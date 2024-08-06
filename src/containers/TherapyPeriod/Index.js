import { CircularProgress, Button, Grid, Typography, TextField, Box, Hidden, Card, CardContent
    , FormControl, InputLabel, Select, IconButton } from "@mui/material";
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
import { setValue, setResults, setListPeriodos, setListTiposTerapias, setListEstados } from '../../redux/therapyPeriodSearchSlice';
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
    const filters = useSelector((state) => state.therapyPeriodSearch.filters);
    const listPeriodos = useSelector((state) => state.therapyPeriodSearch.listPeriodos);
    const listTiposTerapias = useSelector((state) => state.therapyPeriodSearch.listTiposTerapias);
    const listEstados = useSelector((state) => state.therapyPeriodSearch.listEstados);
    
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
            .get('https://localhost:44337/Terapia/GetsTerapiaPeriodoResumenView?'
                + 'idPeriodo=' + (filters.idPeriodo == null ? 0 : filters.idPeriodo)
                + '&idTipoTerapia=' + (filters.idTipoTerapia == null ? 0 : filters.idTipoTerapia)
                + '&participante=' + (filters.participante == null ? "" : filters.participante)
                + '&idTerapeuta=' + (filters.idTerapeuta == null ? 0 : filters.idTerapeuta)
                + '&terapeuta=' + (filters.terapeuta == null ? "" : filters.terapeuta)
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
                dispatch(setValue({name: "idEstado", value: 2}))
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
    }
    const annulTerapiaPeriodo = async () => {
        await axios
            .post("https://localhost:44337/Terapia/AnnulTerapiaPeriodo?idTerapiaPeriodo=" + selectId)
            .catch((err) => {
                console.log("Err: ", err);
            });
            fetchResults();
    }
    const activeTerapiaPeriodo = async () => {
        await axios
            .post("https://localhost:44337/Terapia/ActiveTerapiaPeriodo?idTerapiaPeriodo=" + selectId)
            .catch((err) => {
                console.log("Err: ", err);
            });
            fetchResults();
    }

    useEffect(() => {
        fetchResults();
        fetchPeriodos();
        fetchTiposTerapias();
        fetchEstados();
    }, []);

    const columns = [
        // { field: 'id', headerName: 'ID', width: 50, sortable: false, headerAlign: 'center', align: 'center' },
        // { field: 'codigoServicio', headerName: 'Servicio', width: 50, sortable: false, headerAlign: 'center', align: 'center' },
        { field: 'participante', headerName: 'Participante', width: 200, sortable: false, headerAlign: 'center'
            // , renderCell: (cellValues) => {
            //     return <Link to={'/therapyPeriod/edit/' + cellValues.row.idTerapia} style={{ color: 'inherit' }}>{cellValues.row.participante}</Link>;
            // }
        },
        { field: 'codigoPeriodo', headerName: 'Periodo', width: 100, sortable: false, headerAlign: 'center', align: 'center' },
        { field: 'terapeuta', headerName: 'Terapeuta', width: 200, sortable: false, headerAlign: 'center' },
        { field: 'estadoApertura', headerName: 'Apertura', width: 80, sortable: false, headerAlign: 'center', align: 'center' },
        // { field: 'codigoTarifa', headerName: 'Tarifa', width: 80, sortable: false, headerAlign: 'center', align: 'center' },
        // { field: 'salon', headerName: 'Salon', width: 100, sortable: true, headerAlign: 'center' },
        // { field: 'fechaInicio', headerName: 'Inicio', width: 120, type: 'date'
        //     , valueFormatter: (value) => moment(value).format('D/MM/YYYY')
        //     , sortable: true, headerAlign: 'center', align: 'center' },
        { field: 'estado', headerName: 'Estado', width: 80, sortable: false, headerAlign: 'center', align: 'center' },
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
                <Button size="small" onClick={() => {
                    navigate(`/therapyPeriod/open`);
                }}>
                    Aperturar
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
            {/* <Button onClick={handleClick} type="button" />
            <Link to={`/member/edit/` + (selectItem.length > 0 ? selectItem[0] : 0)}>Editar</Link> */}
            {/* <Link to={{
                pathname: '/person/edit'
                , search: '?id=' + (select.length > 0 ? select[0] : 0)
            }}>Editar</Link> */}
            {/* {JSON.stringify(selectItem)} */}
            <Typography variant="h6" gutterBottom>
                <Box sx={{ fontWeight: 'bold' }}>
                    Periodos de Terapia
                </Box>
            </Typography>
            <Grid container>
                <Grid item>
                    <Card>
                        <CardContent sx={{ padding: "10px 10px 10px 10px !important" }}>
                            <Grid container item xs={12} sm={12} spacing={1} padding={0}>
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
                                <Grid item xs={6} sm={2}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="input-tipoterapia">Tipo Terapia</InputLabel>
                                        <Select
                                            native
                                            label="Tipo Terapia"
                                            value={filters.idTipoTerapia}
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
                                <Grid item xs={8} sm={4}>
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
                                <Grid item xs={8} sm={4}>
                                    <TextField
                                        // required
                                        name="terapeuta"
                                        label="Terapeuta"
                                        value={filters.terapeuta}
                                        fullWidth
                                        onChange={(event) => {
                                            dispatch(setValue({name: "terapeuta", value: event.target.value}))
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
                <DialogYesNo open={openDialogAnnulActive} openClose={openCloseDialogAnnulActive} setYes={ selectState == "A" ? annulTerapiaPeriodo : activeTerapiaPeriodo} 
                    setNo={() => { return }}
                    titulo={(selectState == "A" ? "Anular" : "Activar") + " Periodo de Terapia"}
                    texto={"Esta seguro de " + (selectState == "A" ? "anular" : "activar") + " el periodo de la terapia?"} >
                </DialogYesNo>
            </Grid>
        </div>
    )
}
export default Index


