import { CircularProgress, Button, Grid, Typography, TextField, Box, Hidden, Card, CardContent
    , FormControl, InputLabel, Select, IconButton, Autocomplete } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Search as IconSearch, Add as IconAdd, IndeterminateCheckBox as IconIndeterminateCheckBox
    , CheckBox as IconCheckBox } from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridOverlay
    , GridToolbarFilterButton } from "@mui/x-data-grid";
import { setValue, setListTerapeutas, setListPeriodos, setListEstados } from '../../redux/sessionSearchSlice';
import { setPersonList } from "../../redux/personSlice";
import DialogYesNo from '../../components/DialogYesNo';

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

const Index = () => {
    const filters = useSelector((state) => state.sessionSearch.filters);
    const listTerapeutas = useSelector((state) => state.sessionSearch.listTerapeutas);
    const listPeriodos = useSelector((state) => state.sessionSearch.listPeriodos);
    const listEstados = useSelector((state) => state.sessionSearch.listEstados);

    const [openDialogAnnulActive, setOpenDialogAnnulActive] = useState(false)
    const openCloseDialogAnnulActive = () => { setOpenDialogAnnulActive(!openDialogAnnulActive); }
    const [selectId, setSelectId] = useState(null);
    const [selectState, setSelectState] = useState(null);

    const classes = useStyles();
    const [cargando, setCargando] = useState(true);
    const [results, setResults] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchResults = async () => {
        setCargando(true);

        await axios
            .get('https://localhost:44337/Sesion/GetsSesionResumenView?'
                + 'idTerapeuta=' + (filters.idTerapeuta == null ? 0 : filters.idTerapeuta)
                + '&participante=' + (filters.participante == null ? "" : filters.participante)
                + '&idPeriodo=' + (filters.idPeriodo == null ? 0 : filters.idPeriodo)
                + '&fechaInicio=' + (filters.fechaInicio == null ? "" : filters.fechaInicio)
                + '&fechaFin=' + (filters.fechaFin == null ? "" : filters.fechaFin)
                + '&idEstado=' + (filters.idEstado == null ? "" : filters.idEstado)
            )
            .then((response) => {
                setResults(response.data.data);
                setCargando(false);
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
    }
    const fetchTerapeutas = async () => {
        const response = await axios
            .get("https://localhost:44337/Persona/GetsListPersonByTypeAndName?idType=25&name=")
            .catch((err) => {
                console.log("Err: ", err);
            });

        dispatch(setListTerapeutas(response.data.data));
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
    const fetchEstados = async () => {
        await axios
            .get('https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?'
            + 'idPadre=1'
            )
            .then((response) => {
                dispatch(setListEstados(response.data.data));
                dispatch(setValue({name: "idEstado", value: 2}))
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
    }
    const annul = async () => {
        await axios
            .post("https://localhost:44337/Sesion/AnnulSesion?idSesion=" + selectId)
            .catch((err) => {
                console.log("Err: ", err);
            });
            fetchResults();
    }
    const active = async () => {
        await axios
            .post("https://localhost:44337/Sesion/ActiveSesion?idSesion=" + selectId)
            .catch((err) => {
                console.log("Err: ", err);
            });
            fetchResults();
    }

    useEffect(() => {
        fetchResults();
        fetchTerapeutas();
        fetchPeriodos();
        fetchEstados();
    }, []);

    const columns = [
        { field: 'participante', headerName: 'Participante', width: 150, sortable: false, headerAlign: 'center'
            , renderCell: (cellValues) => {
                return <Link to={'/session/edit/' + cellValues.row.id + '/' +  + cellValues.row.idTerapiaPeriodo} style={{ color: 'inherit' }}>{cellValues.row.participante}</Link>;
            }
        },
        { field: 'fecha', headerName: 'Fecha', width: 100, type: 'date'
            , valueFormatter: (value) => moment(value).format('D/MM/YYYY')
            , sortable: false, headerAlign: 'center', align: 'center' },
            { field: 'codigoPeriodo', headerName: 'Periodo', width: 100, sortable: false, headerAlign: 'center', align: 'center' },
        { field: 'terapeuta', headerName: 'Terapeuta', width: 180, sortable: false, headerAlign: 'center' },
        { field: 'estado', headerName: 'Estado', width: 80, sortable: false, headerAlign: 'center' },
        { field: 'anular', headerName: '', width: 80, sortable: false, headerAlign: 'center', align: 'center'
            , renderCell: (cellValues) => {
                return <IconButton aria-label="anular" size='small' style={{height: 10}} align={"center"} onClick={() => {
                    setSelectId(cellValues.row.id);
                    setSelectState(cellValues.row.estado);
                    setOpenDialogAnnulActive(true);
                }}>
                    { cellValues.row.estado == "A" ? <IconIndeterminateCheckBox /> : <IconCheckBox /> }
                </IconButton>;
            }
        },
    ];

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                {/* <Button size="small" onClick={() => {
                    navigate(`/sesion/edit/0/0`);
                }}>
                    Nuevo
                    <IconAdd />
                </Button> */}
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
            {/* <Button onClick={handleClick} type="button" />
            <Link to={`/participante/edit/` + (selectItem.length > 0 ? selectItem[0] : 0)}>Editar</Link> */}
            {/* <Link to={{
                pathname: '/person/edit'
                , search: '?id=' + (select.length > 0 ? select[0] : 0)
            }}>Editar</Link> */}
            {/* {JSON.stringify(selectItem)} */}
            <Typography variant="h6" gutterBottom>
                <Box sx={{ fontWeight: 'bold' }}>
                    Sesiones
                </Box>
            </Typography>
            <Grid container>
                <Grid item>
                    <Card>
                        <CardContent sx={{ padding: "10px 10px 10px 10px !important" }}>
                            <Grid container item xs={12} sm={12} spacing={1} padding={0}>
                                <Grid item xs={12} sm={5} >
                                    <FormControl fullWidth>
                                        <Autocomplete
                                            name="idTerapeuta"
                                            value={filters.idTerapeuta == null ? 0 : filters.idTerapeuta}
                                            inputValue={filters.terapeuta == null ? "" : filters.terapeuta}
                                            onInputChange={(event, newValue) => {
                                                if (event != null) {
                                                    if (event.type === "change") {
                                                        dispatch(setValue({name: "terapeuta", value: newValue == null ? "" : newValue}))
                                                    }
                                                }
                                            }}
                                            onChange={(event, newValue) => {
                                                dispatch(setValue({name: "idTerapeuta", value: newValue == null ? 0 : newValue.id}))
                                                dispatch(setValue({name: "terapeuta", value: newValue == null ? "" : newValue.descripcion}))
                                            }}
                                            options={listTerapeutas}
                                            autoHighlight
                                            getOptionLabel={(option) => option.descripcion == null ? "" : option.descripcion}
                                            isOptionEqualToValue ={(option, value) => option.value === value.value}
                                            renderOption={(props, option) => {
                                                return (
                                                    <li {...props} key={option.id}>
                                                    {option.descripcion}
                                                    </li>
                                                );
                                                }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Terapeuta"
                                                    variant="outlined"
                                                    inputProps={{
                                                        ...params.inputProps,
                                                        autoComplete: 'new-password',
                                                    }}
                                                />
                                            )}
                                            size="small"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        // required
                                        name="participante"
                                        label="Participante"
                                        value={filters.participante}
                                        fullWidth
                                        onChange={(event) => {
                                            dispatch(setValue({name: "participante", value: event.target.value}))
                                        }}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="input-periodo">Periodo</InputLabel>
                                        <Select
                                            native
                                            label="Periodo"
                                            value={filters.idPeriodo}
                                            onChange={(event) => {
                                                dispatch(setValue({name: "idPeriodo", value: event.target.value}))
                                            }}
                                            inputProps={{
                                                name: 'idPeriodo',
                                                id: 'input-periodo',
                                            }}
                                            size="small"
                                        >
                                            <option key={0} value={0}>{"(Todos)"}</option>
                                            {listPeriodos.map((row) => (
                                                <option key={row.id} value={row.id}>{row.codigo}</option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <TextField
                                        required
                                        name="fechaInicio"
                                        label="Inicio"
                                        fullWidth
                                        type="date"
                                        value={moment(filters.fechaInicio).format('yyyy-MM-DD')}
                                        onChange={(event) => {
                                            dispatch(setValue({name: "fechaInicio", value: event.target.value}))
                                        }}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <TextField
                                        required
                                        name="fechaFin"
                                        label="Fin"
                                        fullWidth
                                        type="date"
                                        value={moment(filters.fechaFin).format('yyyy-MM-DD')}
                                        onChange={(event) => {
                                            dispatch(setValue({name: "fechaFin", value: event.target.value}))
                                        }}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="input-estado">Estado</InputLabel>
                                        <Select
                                            native
                                            label="Estado"
                                            value={filters.idEstado}
                                            onChange={(event) => {
                                                dispatch(setValue({name: "idEstado", value: event.target.value}))
                                            }}
                                            inputProps={{
                                                name: 'idEstado',
                                                id: 'input-estado',
                                            }}
                                            size="small"
                                        >
                                            <option key={0} value={0}>{"(Todos)"}</option>
                                            {listEstados.map((row) => (
                                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2} sm={2}>
                                    <Button variant="outlined" size="small" onClick={() => {
                                        fetchResults()
                                    }}>
                                        {<Hidden smDown>Buscar</Hidden>}
                                        <IconSearch />
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr' }}>
                        <DataGrid
                            rows={results}
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
                <DialogYesNo open={openDialogAnnulActive} openClose={openCloseDialogAnnulActive} setYes={ selectState == "A" ? annul : active} 
                    setNo={() => { return }}
                    titulo={(selectState == "A" ? "Anular" : "Activar") + " Sesion"}
                    texto={"Esta seguro de " + (selectState == "A" ? "anular" : "activar") + " la sesion?"} >
                </DialogYesNo>
            </Grid>
        </div>
    )
}
export default Index


