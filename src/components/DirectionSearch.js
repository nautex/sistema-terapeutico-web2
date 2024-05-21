import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle
    , Grid, TextField, Typography, IconButton, Hidden } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridOverlay
    , GridToolbarFilterButton } from "@mui/x-data-grid";
import { Search as IconSearch } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UbigeoSearch from "./UbigeoSearch";
import { setResults, setValueFilters } from '../redux/directionSearchSlice';

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

const DirectionSearch = (props) => {
    const filters = useSelector((state) => state.directionSearch.filters);
    const results = useSelector((state) => state.directionSearch.results);
    const dispatch = useDispatch();
    const [selectItem, setSelectItem] = useState([]);
    const [openUbigeoSearch, setOpenUbigeoSearch] = useState(false)
    const [cargando, setCargando] = useState(false);
    const openCloseUbigeoSearch = () => { setOpenUbigeoSearch(!openUbigeoSearch); }
    const classes = useStyles();
    const nodeRef = useRef(null)

    const fetchResults = async () => {
        setCargando(true);

        const url = 'https://localhost:44337/Direccion/GetDireccionesViewByUbigeoYDetalle?'
            + 'IdUbigeo=' + (filters.idUbigeo == null ? 0 : filters.idUbigeo) 
            + '&Detalle=' + (filters.detalle == null ? "" : filters.detalle)

        const response = await axios
            .get(url)
            .catch((err) => {
                console.log("Err: ", err)
            });
        
        dispatch(setResults(response.data.data))
        setCargando(false);
    }
    const setSelectUbigeoSearch = (selectSearchUbigeo) => {
        dispatch(setValueFilters({name: "idUbigeo", value: parseInt(selectSearchUbigeo.idUbigeo)}))
        dispatch(setValueFilters({name: "resumenUbigeo", value: selectSearchUbigeo.descripcion}))

        console.log(filters)
    }

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
        { field: 'ubigeo', headerName: 'Ubigeo', width: 80, sortable: true },
        { field: 'detalle', headerName: 'Detalle', width: 200, sortable: false },
        { field: 'referencia', headerName: 'Referencia', width: 150, sortable: false },
    ];

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            fullWidth={true}
            maxWidth={"xl"}
            ref={nodeRef}
        >
            <DialogTitle>
                <Typography>
                    Buscar Direccion
                    {/* {JSON.stringify(filters)} */}
                </Typography>
            </DialogTitle>
            <DialogContent style={{ minHeight: "350px", maxHeight: "400px" }}>
                <Grid container item xs={12} sm={12} spacing={1} padding={1}>
                    <Grid item xs={8} sm={3}>
                        <Grid container>
                            <Grid item xs={10} sm={10}>
                                <TextField
                                    // required
                                    name="resumenUbigeo"
                                    label="Ubigeo"
                                    value={filters.resumenUbigeo}
                                    disabled
                                    fullWidth
                                    onChange={(event) => {
                                        dispatch(setValueFilters({name: "resumenUbigeo", value: event == null ? "" : event.target.value}))
                                    }}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={2} sm={2}>
                                <IconButton aria-label="Buscar Ubigeo" onClick={() => {
                                    openCloseUbigeoSearch()
                                }}>
                                    <IconSearch />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={8} sm={3}>
                        <TextField
                            // required
                            name="detalle"
                            label="Detalle"
                            value={filters.detalle}
                            fullWidth
                            onChange={(event) => {
                                dispatch(setValueFilters({name: "detalle", value: event == null ? "" : event.target.value}))
                            }}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={1} sm={1}>
                        <Button variant='outlined' color="primary" onClick={() => {
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
                            onRowSelectionModelChange={(itm) => setSelectItem(itm)}
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
            <UbigeoSearch open={openUbigeoSearch} openClose={openCloseUbigeoSearch} setSelection={setSelectUbigeoSearch} />
        </Dialog>
    )
}

export default DirectionSearch;
