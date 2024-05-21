import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { setData, setResults, setListServicios, setListLocales, setListTipos, setListModalidades } 
    from "../redux/feeSearchSlice";
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, TextField, Autocomplete, Button, Dialog, DialogActions
    , DialogContent, DialogTitle, Select, InputLabel, FormControl
    , CircularProgress, Hidden } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridOverlay
    , GridToolbarFilterButton } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { Search as IconSearch } from "@mui/icons-material";

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

const FeeSearch = (props) => {
    const filters = useSelector((state) => state.feeSearch.filters);
    const results = useSelector((state) => state.feeSearch.results);
    const listServicios = useSelector((state) => state.feeSearch.listServicios);
    const listLocales = useSelector((state) => state.feeSearch.listLocales);
    const listTipos = useSelector((state) => state.feeSearch.listTipos);
    const dispatch = useDispatch();
    const [selectItem, setSelectItem] = useState([]);
    const [cargando, setCargando] = useState(false);
    const classes = useStyles();
    const dialogRef = useRef()

    const fetchResults = async () => {
        setCargando(true);

        const response = await axios
            .get('https://localhost:44337/Servicio/GetsTarifaByIdServicioOrIdLocalOrSesionesMes?'
                + "idServicio=" + filters.idServicio
                + "&idLocal=" + filters.idLocal
                + "&idTipo=" + filters.idTipo
                + "&sesionesMes=" + filters.sesionesMes
                )
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setResults(response.data.data))
        setCargando(false);
    }
    
    const fetchServicios = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Servicio/GetsListServicio")
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setListServicios(response.data.data));
    }, [])

    const fetchLocales = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Local/GetsList")
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setListLocales(response.data.data));
    }, [])

    const fetchTipos = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=49")
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setListTipos(response.data.data));
    }, [])

    useEffect(() => {
        fetchServicios();
        fetchLocales();
        fetchTipos();
    }, [])

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarFilterButton />
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }

    function CustomLoadingOverlay() {
        return (
            <GridOverlay>
                <div className={classes.styleCircularProgress}>
                    <CircularProgress />
                </div>
            </GridOverlay>
        );
    }

    const columns = [
        { field: 'codigoLocal', headerName: 'Local', width: 70, sortable: false },
        { field: 'codigo', headerName: 'Tarifa', width: 70, sortable: true },
        // { field: 'codigoServicio', headerName: 'Servicio', width: 70, sortable: false },
        { field: 'tipo', headerName: 'Tipo', width: 100, sortable: false },
        { field: 'descripcion', headerName: 'Descripcion', width: 250, sortable: true },
        { field: 'sesionesMes', headerName: 'Sesiones Mes', width: 100, sortable: false },
        { field: 'minutosSesion', headerName: 'Minutos Sesion', width: 100, sortable: false },
        { field: 'monto', headerName: 'Monto', width: 80, sortable: false },
    ];

    return (
        <Dialog
            open={props.open}
            onClose={props.openClose}
            fullWidth={true}
            maxWidth={"xl"}
        >
            <DialogTitle>
                <Typography>
                    Buscar Tarifa
                    {/* {JSON.stringify(filters)} */}
                </Typography>
            </DialogTitle>
            <DialogContent style={{ minHeight: "30px", maxHeight: "450px" }} >
                <Grid container item xs={12} sm={12} spacing={2} padding={1} >
                    <Grid item xs={12} sm={3}>
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
                                <option key={0} value={0}>{""}</option>
                                {listServicios.map((row) => (
                                    <option key={row.id} value={row.id}>{row.descripcion}</option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
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
                                <option key={0} value={0}>{""}</option>
                                {listLocales.map((row) => (
                                    <option key={row.id} value={row.id}>{row.descripcion}</option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
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
                                <option key={0} value={0}>{""}</option>
                                {listTipos.map((row) => (
                                    <option key={row.id} value={row.id}>{row.descripcion}</option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={8} sm={3}>
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
                    <Grid item xs={2} sm={2}>
                        <Button variant="outlined" onClick={() => {
                            fetchResults()
                        }}>
                            {<Hidden smDown>Buscar</Hidden>}
                            <IconSearch />
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <DataGrid
                            rows={results}
                            columns={columns}
                            initialState={{
                                pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                                },
                            }}
                            pageSize={5}
                            pageSizeOptions={[5]}
                            disableColumnMenu
                            components={{
                                Toolbar: CustomToolbar,
                                LoadingOverlay: CustomLoadingOverlay,
                            }}
                            loading={cargando}
                            rowHeight={25}
                            onRowSelectionModelChange={itm => setSelectItem(itm)}
                            // style={{ height: 250 }}
                            autoHeight={true}
                            className={classes.headerColor}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => {
                    if (selectItem.length > 0) {
                        const selectItems = results.filter(item => item.id === selectItem[0]);
                        props.setSelection(selectItems[0]);
                        props.openClose()
                    }
                }}>Aceptar</Button>
                <Button onClick={() => { props.openClose() }} >Cancelar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default FeeSearch;
