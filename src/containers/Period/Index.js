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
import { setValue, setResults, setListTiposTerapias, setListEstadosApertura, setListEstados } from '../../redux/periodSearchSlice';
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
    const filters = useSelector((state) => state.periodSearch.filters);
    const listTiposTerapias = useSelector((state) => state.periodSearch.listTiposTerapias);
    const listEstadosApertura = useSelector((state) => state.periodSearch.listEstadosApertura);
    const listEstados = useSelector((state) => state.periodSearch.listEstados);
    
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
            .get('https://localhost:44337/Periodo/GetsPeriodoView?'
                + 'idTipoTerapia=' + (filters.idTipoTerapia == null ? 0 : filters.idTipoTerapia)
                + '&idEstadoApertura=' + (filters.idEstadoApertura == null ? 0 : filters.idEstadoApertura)
                + '&mesesHaciaAtras=' + (filters.mesesHaciaAtras == null ? 0 : filters.mesesHaciaAtras)
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
    const fetchEstadosApertura = async () => {
        await axios
            .get('https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?'
            + 'idPadre=86'
            )
            .then((response) => {
                dispatch(setListEstadosApertura(response.data.data));
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
            .post("https://localhost:44337/Periodo/AnnulPeriodo?idPeriodo=" + selectId)
            .catch((err) => {
                console.log("Err: ", err);
            });
            fetchResults();
    }
    const active = async () => {
        await axios
            .post("https://localhost:44337/Periodo/ActivePeriodo?idPeriodo=" + selectId)
            .catch((err) => {
                console.log("Err: ", err);
            });
            fetchResults();
    }

    useEffect(() => {
        fetchResults();
        fetchTiposTerapias();
        fetchEstadosApertura();
        fetchEstados();
    }, []);

    const columns = [
        // { field: 'id', headerName: 'ID', width: 50, sortable: false, headerAlign: 'center', align: 'center' },
        { field: 'codigo', headerName: 'Codigo', width: 120, sortable: false, headerAlign: 'center'
            , renderCell: (cellValues) => {
                return <Link to={'/period/edit/' + cellValues.row.id} style={{ color: 'inherit' }}>{cellValues.row.codigo}</Link>;
            }
        },
        { field: 'tipoTerapia', headerName: 'Tipo Terapia', width: 100, sortable: false, headerAlign: 'center'},
        { field: 'estadoApertura', headerName: 'Apertura', width: 100, sortable: false, headerAlign: 'center', align: 'center' },
        // { field: 'codigoTarifa', headerName: 'Tarifa', width: 80, sortable: false, headerAlign: 'center', align: 'center' },
        // { field: 'salon', headerName: 'Salon', width: 100, sortable: true, headerAlign: 'center' },
        { field: 'fechaInicio', headerName: 'Inicio', width: 120, type: 'date'
            , valueFormatter: (value) => moment(value).format('D/MM/YYYY')
            , sortable: false, headerAlign: 'center', align: 'center' },
        { field: 'fechaFin', headerName: 'Fin', width: 120, type: 'date'
            , valueFormatter: (value) => moment(value).format('D/MM/YYYY')
            , sortable: false, headerAlign: 'center', align: 'center' },
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
                    navigate(`/period/edit/0`);
                }}>
                    Nuevo
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
            <Typography variant="h6" gutterBottom>
                <Box sx={{ fontWeight: 'bold' }}>
                    Periodos
                </Box>
            </Typography>
            <Grid container>
                <Grid item>
                    <Card>
                        <CardContent sx={{ padding: "10px 10px 10px 10px !important" }}>
                            <Grid container item xs={12} sm={12} spacing={1} padding={0}>
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
                                <Grid item xs={6} sm={2}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="input-estadoapertura">Apertura</InputLabel>
                                        <Select
                                            native
                                            label="Estado Apertura"
                                            value={filters.idEstadoApertura}
                                            onChange={(event) => {
                                                dispatch(setValue({name: "idEstadoApertura", value: event.target.value}))
                                            }}
                                            inputProps={{
                                                name: 'idEstadoApertura',
                                                id: 'input-estadoapertura',
                                            }}
                                            size="small"
                                        >
                                            <option key={0} value={0}>{"(Todos)"}</option>
                                            {listEstadosApertura.map((row) => (
                                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={8} sm={4}>
                                    <TextField
                                        // required
                                        inputProps={{ type: 'number'}}
                                        name="mesesHaciaAtras"
                                        label="Meses Hacia Atras"
                                        value={filters.mesesHaciaAtras}
                                        fullWidth
                                        onChange={(event) => {
                                            dispatch(setValue({name: "mesesHaciaAtras", value: event.target.value}))
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
                    titulo={(selectState == "A" ? "Anular" : "Activar") + " Periodo"}
                    texto={"Esta seguro de " + (selectState == "A" ? "anular" : "activar") + " el periodo?"} >
                </DialogYesNo>
            </Grid>
        </div>
    )
}
export default Index


