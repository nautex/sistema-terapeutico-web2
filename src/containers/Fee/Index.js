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
import { setData, setResults
    , setListServicios, setListLocales, setListTipos, setListModalidades, setListEstados } from '../../redux/feeSearchSlice';
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
    const filters = useSelector((state) => state.feeSearch.filters);
    const listServicios = useSelector((state) => state.feeSearch.listServicios);
    const listLocales = useSelector((state) => state.feeSearch.listLocales);
    const listTipos = useSelector((state) => state.feeSearch.listTipos);
    const listEstados = useSelector((state) => state.feeSearch.listEstados);
    
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
            .get('https://localhost:44337/Servicio/GetsTarifaView?'
                + 'idServicio=' + (filters.idServicio == null ? 0 : filters.idServicio)
                + '&idLocal=' + (filters.idLocal == null ? 0 : filters.idLocal)
                + '&idTipo=' + (filters.idTipo == null ? 0 : filters.idTipo)
                + '&sesionesMes=' + (filters.sesionesMes == null ? 0 : filters.sesionesMes)
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
    const fetchServicios = async () => {
        const response = await axios
            .get("https://localhost:44337/Servicio/GetsListServicio")
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setListServicios(response.data.data));
    }

    const fetchLocales = async () => {
        const response = await axios
            .get("https://localhost:44337/Local/GetsList")
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setListLocales(response.data.data));
    }

    const fetchTipos = async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=49")
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setListTipos(response.data.data));
    }
    const fetchEstados = async () => {
        await axios
            .get('https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?'
            + 'idPadre=1'
            )
            .then((response) => {
                dispatch(setListEstados(response.data.data));
                dispatch(setData({name: "idEstado", value: 2}))
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
    }
    const annul = async () => {
        await axios
            .post("https://localhost:44337/Servicio/AnnulTarifa?idTarifa=" + selectId)
            .catch((err) => {
                console.log("Err: ", err);
            });
            fetchResults();
    }
    const active = async () => {
        await axios
            .post("https://localhost:44337/Servicio/ActiveTarifa?idTarifa=" + selectId)
            .catch((err) => {
                console.log("Err: ", err);
            });
            fetchResults();
    }

    useEffect(() => {
        fetchResults();
        fetchServicios();
        fetchLocales();
        fetchTipos();
        fetchEstados();
    }, []);

    const columns = [
        // { field: 'id', headerName: 'ID', width: 50, sortable: false, headerAlign: 'center', align: 'center' },
        { field: 'codigo', headerName: 'Codigo', width: 80, sortable: false, headerAlign: 'center'
            , renderCell: (cellValues) => {
                return <Link to={'/fee/edit/' + cellValues.row.id} style={{ color: 'inherit' }}>{cellValues.row.codigo}</Link>;
            }
        },
        { field: 'codigoLocal', headerName: 'Local', width: 80, sortable: false, headerAlign: 'center'},
        { field: 'tipo', headerName: 'Tipo', width: 100, sortable: false, headerAlign: 'center', align: 'center' },
        { field: 'sesionesMes', headerName: 'Sesiones Mes', width: 120, sortable: false, headerAlign: 'center', align: 'center' },
        { field: 'minutosSesion', headerName: 'Minutos Sesion', width: 120, sortable: false, headerAlign: 'center', align: 'center' },
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
                    navigate(`/fee/edit/0`);
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
                    Tarifas
                </Box>
            </Typography>
            <Grid container>
                <Grid item>
                    <Card>
                        <CardContent sx={{ padding: "10px 10px 10px 10px !important" }}>
                            <Grid container item xs={12} sm={12} spacing={1} padding={0}>
                                <Grid item xs={6} sm={3}>
                                    <FormControl required fullWidth>
                                        <InputLabel htmlFor="input-servicio">Servicio</InputLabel>
                                        <Select
                                            native
                                            // native={!listServicios.length == 0}
                                            //defaultValue={0}
                                            label="Servicio"
                                            value={filters.idServicio}
                                            onChange={(event, newValue) => {
                                                dispatch(setData({name: "idServicio", value: event.target.value}))
                                            }}
                                            inputProps={{
                                                name: 'idServicio',
                                                id: 'input-servicio',
                                            }}
                                            size="small"
                                        >
                                            <option key={0} value={0}>{"(Todos)"}</option>
                                            {listServicios.map((row) => (
                                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <FormControl required fullWidth>
                                        <InputLabel htmlFor="input-local">Local</InputLabel>
                                        <Select
                                            native
                                            // native={!listServicios.length == 0}
                                            //defaultValue={0}
                                            label="Local"
                                            value={filters.idLocal}
                                            onChange={(event, newValue) => {
                                                dispatch(setData({name: "idLocal", value: event.target.value}))
                                            }}
                                            inputProps={{
                                                name: 'idLocal',
                                                id: 'input-local',
                                            }}
                                            size="small"
                                        >
                                            <option key={0} value={0}>{"(Todos)"}</option>
                                            {listLocales.map((row) => (
                                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <FormControl required fullWidth>
                                        <InputLabel htmlFor="input-tipo">Tipo</InputLabel>
                                        <Select
                                            native
                                            // native={!listServicios.length == 0}
                                            //defaultValue={0}
                                            label="Tipo"
                                            value={filters.idTipo}
                                            onChange={(event, newValue) => {
                                                dispatch(setData({name: "idTipo", value: event.target.value}))
                                            }}
                                            inputProps={{
                                                name: 'idTipo',
                                                id: 'input-tipo',
                                            }}
                                            size="small"
                                        >
                                            <option key={0} value={0}>{"(Todos)"}</option>
                                            {listTipos.map((row) => (
                                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <TextField
                                        // required
                                        name="sesionesMes"
                                        label="Sesiones Mes"
                                        value={filters.sesionesMes}
                                        fullWidth
                                        onChange={(event) => {
                                            dispatch(setData({name: "sesionesMes", value: event.target.value}))
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
                                                dispatch(setData({name: "idEstado", value: event.target.value}))
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
                    titulo={(selectState == "A" ? "Anular" : "Activar") + " Tarifa"}
                    texto={"Esta seguro de " + (selectState == "A" ? "anular" : "activar") + " la tarifa?"} >
                </DialogYesNo>
            </Grid>
        </div>
    )
}
export default Index
