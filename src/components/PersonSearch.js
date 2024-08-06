import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle
    , Grid, TextField, Typography, Hidden } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridOverlay
    , GridToolbarFilterButton } from "@mui/x-data-grid";
import { Search as IconSearch } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setResults, setValue } from '../redux/personSearchSlice';

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

const PersonSearch = (props) => {
    const filters = useSelector((state) => state.personSearch.filters);
    const results = useSelector((state) => state.personSearch.results);
    const dispatch = useDispatch();
    const [selectItem, setSelectItem] = useState([]);
    const [cargando, setCargando] = useState(false);
    const classes = useStyles();
    const dialogRef = useRef()

    const fetchResults = async () => {
        setCargando(true);

        const response = await axios
            .get('https://localhost:44337/Persona/GetPersonasResumenBasicoViewByNumeroDocumentoYNombres?numeroDocumento=' + (filters.numeroDocumento == null ? "" : filters.numeroDocumento) + '&nombres=' + (filters.nombres == null ? "" : filters.nombres))
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setResults(response.data.data))
        setCargando(false);
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
        { field: 'nombres', headerName: 'Nombres', width: 200, sortable: true },
        { field: 'tipoDocumento', headerName: 'Tip.Doc.', width: 100, sortable: false },
        { field: 'numeroDocumento', headerName: 'Num.Doc.', width: 100, sortable: false },
    ];

    return (
        <Dialog
            open={props.open}
            onClose={props.openClose}
            fullWidth={true}
            maxWidth={"xl"}
            ref={dialogRef}
        >
            <DialogTitle>
                <Typography>
                    Buscar Persona
                    {/* {JSON.stringify(filters)} */}
                </Typography>
            </DialogTitle>
            <DialogContent style={{ minHeight: "350px", maxHeight: "400px" }}>
                <Grid container item xs={12} sm={12} spacing={1} padding={1}>
                    <Grid item xs={6} sm={2}>
                        <TextField
                            // required
                            name="numeroDocumento"
                            label="Num. Doc."
                            value={filters.numeroDocumento}
                            fullWidth
                            onChange={(event) => {
                                dispatch(setValue({name: "numeroDocumento", value: event.target.value}))
                            }}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={8} sm={3}>
                        <TextField
                            // required
                            name="nombres"
                            label="Nombres"
                            value={filters.nombres}
                            fullWidth
                            onChange={(event) => {
                                dispatch(setValue({name: "nombres", value: event.target.value}))
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

export default PersonSearch;
