import { CircularProgress, Button, Grid, Typography, TextField, Box, Hidden, Card, CardContent
    , FormControl, InputLabel, Select, Snackbar, Alert } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Search as IconSearch, Add as IconAdd, HourglassEmpty as IconHourglassEmpty
    , CheckCircleOutline as IconCheckCircleOutline, Dangerous as IconDangerous } from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridOverlay
    , GridToolbarFilterButton } from "@mui/x-data-grid";
import { setValue, setListTerapiasParticipantes, setListPeriodos
    , setValidationMessage, activeValidations
    , setListTiposTerapias, setListEstados, setDataTerapiasParticipantes } from '../../redux/therapyPeriodOpenSlice';
import DialogYesNo from '../../components/DialogYesNo'
import { FormHelperText as HelperText } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    styleCircularProgress: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
    headerColor: {
        "& .MuiDataGrid-columnHeader ": {
            backgroundColor: "#1976d2",
            color: "white"
          }
    }
}));

const Open = () => {
    const input = useSelector((state) => state.therapyPeriodOpen.input);
    const listTerapiasParticipantes = useSelector((state) => state.therapyPeriodOpen.listTerapiasParticipantes);
    const listPeriodos = useSelector((state) => state.therapyPeriodOpen.listPeriodos);
    const listTiposTerapias = useSelector((state) => state.therapyPeriodOpen.listTiposTerapias);
    const listEstados = useSelector((state) => state.therapyPeriodOpen.listEstados);
    const validationMessage = useSelector((state) => state.therapyPeriodOpen.validationMessage);
    const validate = useSelector((state) => state.therapyPeriodOpen.validationActive);
    const [openDialogGenerate, setOpenDialogGenerate] = useState(false)
    const openCloseDialogGenerate = () => { setOpenDialogGenerate(!openDialogGenerate); }
    const classes = useStyles();
    const [openMessage, setOpenMessage] = useState(false)
    const onCloseMessage = () => { setOpenMessage(!openMessage); }
    const [propsMessage, setPropsMessage] = useState({ severity: "success", message: "" });
    const [cargando, setCargando] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    var validation = {
        idPeriodo: {
            error: input.idPeriodo == null || input.idPeriodo == 0,
            message: "Falta seleccionar el Periodo",
        },
        atLeastOneTherapy: {
            error: listTerapiasParticipantes == null || listTerapiasParticipantes.length == 0,
            message: "Deben listarse las terapias para la generacion",
        }
    }
    const fetchTerapiasParticipantes = async () => {
        setCargando(true);

        await axios
            .get('https://localhost:44337/Terapia/GetsTerapiaParticipanteResumenView?'
                + 'idTipoTerapia=' + (input.idTipoTerapia == null ? 0 : input.idTipoTerapia)
                + '&idEstado=' + (input.idEstado == null ? 0 : input.idEstado)
                )
            .then((response) => {
                dispatch(setListTerapiasParticipantes(response.data.data));
                setCargando(false);
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
    }
    const fetchPeriodos = async () => {
        await axios
            .get('https://localhost:44337/Periodo/GetsPeriodoView?'
            + 'idTipoTerapia=0'
            + '&idEstadoApertura=87'
            + '&mesesHaciaAtras=0'
            + '&idEstado=2'
            )
            .then((response) => {
                dispatch(setListPeriodos(response.data.data));
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
    }
    const fetchTiposTerapias = async () => {
        await axios
            .get('https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?'
            + 'idPadre=49'
            )
            .then((response) => {
                dispatch(setListTiposTerapias(response.data.data));
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
    }
    const fetchEstados = async () => {
        await axios
            .get('https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?'
            + 'idPadre=1'
            )
            .then((response) => {
                dispatch(setListEstados(response.data.data));
                // dispatch(setValue({name: "idEstado", value: 2}))
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
    }
    const fecthGenerarTerapiasPeriodos = async () => {
        dispatch(activeValidations());
        dispatch(setValidationMessage(messagesValidation()));
        
        if (validationMessage != "") {
            setPropsMessage({ severity: "error", message: validationMessage })
            setOpenMessage(true);
        }
        else {
            var i = 0;

            while (i < listTerapiasParticipantes.length){
                var id = listTerapiasParticipantes[i].id;
                
                await axios.post("https://localhost:44337/Terapia/AddTerapiaPeriodo?"
                    + "idPeriodo="+ input.idPeriodo
                    + "&idTerapia=" + listTerapiasParticipantes[i].idTerapia
                    + "&numero=" + listTerapiasParticipantes[i].numero
                    + "&idTarifa=" + listTerapiasParticipantes[i].idTarifa
                )
                .then(directions => {
                    dispatch(setDataTerapiasParticipantes({id: id, name: "estadoCreacion", value: "O"}));;
                })
                .catch((err) => {
                    dispatch(setDataTerapiasParticipantes({id: id, name: "estadoCreacion", value: "E"}));;
                    
                    console.log("Err: ", err);
                });
    
                i++;
            }

            setPropsMessage({ severity: "success", message: "Se generaron los periodos para las terapias" })
            setOpenMessage(true);
        }
    }

    useEffect(() => {
        fetchPeriodos();
        fetchTiposTerapias();
        fetchEstados();
        dispatch(setValidationMessage(messagesValidation()));
    }, []);

    useEffect(() => {
        dispatch(setValidationMessage(messagesValidation()));
    }, [input, listTerapiasParticipantes])

    const messagesValidation = () => {
        var messages = [];

        Object.keys(validation).forEach(function (key) {
            if (validation[key].error) messages.push(validation[key].message)
        })

        return messages;
    }

    const columns = [
        { field: 'estadoCreacion', headerName: '', width: 50, sortable: false, headerAlign: 'center'
            , renderCell: (cellValues) => {
                return cellValues.row.estadoCreacion == "P" ? <IconHourglassEmpty /> : (cellValues.row.estadoCreacion == "O" ? <IconCheckCircleOutline /> : (cellValues.row.estadoCreacion == "E" ? <IconDangerous /> : null ))
            }
                // return <IconButton aria-label="creado" size='small' style={{height: 10}} align={"center"} onClick={() => {
                //     setSelectId(cellValues.row.id);
                //     setSelectState(cellValues.row.estado);
                //     setOpenDialogAnnulActive(true);
                // }}>
                //     { cellValues.row.estado == "A" ? <IconIndeterminateCheckBox /> : <IconCheckBox /> }
                // </IconButton>;
        },
        { field: 'participante', headerName: 'Participante', width: 180, sortable: false, headerAlign: 'center' },
        { field: 'terapeuta', headerName: 'Terapeuta', width: 180, sortable: false, headerAlign: 'center' },
        { field: 'tipoTerapia', headerName: 'Tipo Terapia', width: 100, sortable: false, headerAlign: 'center' },
        // { field: 'estadoTerapia', headerName: 'Estado Terapia', width: 80, sortable: false, headerAlign: 'center' },
        { field: 'estado', headerName: 'Estado', width: 80, sortable: false, headerAlign: 'center' },
    ];

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Button size="small" onClick={() => {
                    setOpenDialogGenerate(true);
                }}>
                    Generar
                    <IconAdd />
                </Button>
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }

    function CustomLoadingOverlay() {
        return (
            <GridOverlay>
                <div classes={classes.styleCircularProgress}>
                    <CircularProgress />
                </div>
            </GridOverlay>
        );
    }

    const [selectItem, setSelection] = useState([]);

    return (
        <div>
            {/* {JSON.stringify(selectItem)} */}
            <Grid container spacing={0}>
                <Grid item xs={6} sm={6}>
                    <Typography variant="h5" component="span">
                        <Box sx={{ fontWeight: 'bold' }}>
                            Aperturar Periodos de Terapia
                        </Box>
                    </Typography>
                </Grid>
                <Grid item xs={6} sm={6}>
                <Box textAlign='right'>
                    <Link to={'/therapyperiod'} >{"Volver"}</Link>
                </Box>
                </Grid>
            </Grid>
            
            <Grid container>
                <Grid item>
                    <Card>
                        <CardContent sx={{ padding: "10px 10px 10px 10px !important" }}>
                            <Grid container item xs={12} sm={12} spacing={1} padding={0}>
                                <Grid item xs={6} sm={5}>
                                    <FormControl required fullWidth error={validate.idPeriodo && validation.idPeriodo.error}>
                                        <InputLabel htmlFor="input-periodo">Periodo</InputLabel>
                                        <Select
                                            native
                                            label="Periodo"
                                            value={input.idPeriodo}
                                            onChange={(event) => {
                                                dispatch(setValue({name: "idPeriodo", value: event.target.value}))
                                            }}
                                            inputProps={{
                                                name: 'idPeriodo',
                                                id: 'input-periodo',
                                            }}
                                            size="small"
                                        >
                                            <option key={0} value={0}>{"(Seleccione)"}</option>
                                            {listPeriodos.map((row) => (
                                                <option key={row.id} value={row.id}>{row.codigo}</option>
                                            ))}
                                        </Select>
                                        <HelperText>{validate.idPeriodo && validation.idPeriodo.error ? validation.idPeriodo.message : ""}</HelperText>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="input-tipoterapia">Tipo Terapia</InputLabel>
                                        <Select
                                            native
                                            label="Tipo Terapia"
                                            value={input.idTipoTerapia}
                                            onChange={(event) => {
                                                dispatch(setValue({name: "idTipoTerapia", value: event.target.value}))
                                            }}
                                            inputProps={{
                                                name: 'idTipoTerapia',
                                                id: 'input-tipoterapia',
                                            }}
                                            size="small"
                                        >
                                            <option key={0} value={0}>{"(Todos)"}</option>
                                            {listTiposTerapias.map((row) => (
                                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2} sm={2}>
                                    <Button variant="outlined" size="small" onClick={() => {
                                        fetchTerapiasParticipantes()
                                    }}>
                                        {<Hidden smDown>Filtrar</Hidden>}
                                        <IconSearch />
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                        <DataGrid
                            rows={listTerapiasParticipantes}
                            columns={columns}
                            initialState={{
                                pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                                },
                            }}
                            pageSize={10}
                            pageSizeOptions={[10]}
                            disableColumnMenu
                            components={{
                                LoadingOverlay: CustomLoadingOverlay,
                            }}
                            slots={{
                                toolbar: CustomToolbar,
                            }}
                            loading={cargando}
                            rowHeight={25}
                            onRowSelectionModelChange={(itm) => setSelection(itm)}
                            className={classes.headerColor}
                            autoHeight={true}
                            sx={{
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main',
                            },
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
            <Snackbar open={openMessage} autoHideDuration={5000} onClose={onCloseMessage}
                anchorOrigin={{vertical: "top", horizontal: "center"}}>
                <Alert onClose={onCloseMessage} severity={propsMessage.severity}>
                {propsMessage.message}
                </Alert>
            </Snackbar>
            <FormControl required fullWidth
                error={
                    (validate.atLeastOneTherapy && validation.atLeastOneTherapy.error)
                }>
                <HelperText>
                    {validate.atLeastOneTherapy && validation.atLeastOneTherapy.error ? validation.atLeastOneTherapy.message : ""}
                </HelperText>
            </FormControl>
            <DialogYesNo
                open={openDialogGenerate}
                openClose={openCloseDialogGenerate}
                setYes={fecthGenerarTerapiasPeriodos}
                setNo={() => { return }}
                titulo={"Generar Periodos para Terapias"}
                texto={"Esta seguro de generar los Periodos para las Terapias?"}
            ></DialogYesNo>
        </div>
    )
}
export default Open
