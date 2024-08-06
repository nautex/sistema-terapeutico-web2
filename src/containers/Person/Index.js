import { CircularProgress, Button, Grid, Typography, TextField, Box, Hidden, Card, CardContent } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Search as IconSearch, Add as IconAdd } from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridOverlay
    , GridToolbarFilterButton } from "@mui/x-data-grid";
import { setValue } from '../../redux/personSearchSlice';

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
    const filters = useSelector((state) => state.personSearch.filters);
    const classes = useStyles();
    const [cargando, setCargando] = useState(true);
    const [results, setResults] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://localhost:44337/Persona/GetPersonasResumenView')
            .then(function (response) {
                setResults(response.data.data);
                setCargando(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [])

    const fetchResults = async () => {
        setCargando(true);

        await axios
            .get('https://localhost:44337/Persona/GetPersonasResumenViewByNumeroDocumentoYNombres?numeroDocumento=' + (filters.numeroDocumento == null ? "" : filters.numeroDocumento) + '&nombres=' + (filters.nombres == null ? "" : filters.nombres))
            .then((response) => {
                setResults(response.data.data);
                setCargando(false);
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
    }

    const columns = [
        // { field: 'id', headerName: 'ID', width: 50, sortable: false, headerAlign: 'center', align: 'center' },
        { field: 'nombres', headerName: 'Nombres', width: 200, sortable: false, headerAlign: 'center'
            , renderCell: (cellValues) => {
                return <Link to={'/person/edit/' + cellValues.row.id} style={{ color: 'inherit' }}>{cellValues.row.nombres}</Link>;
            }
        },
        { field: 'tipoDocumento', headerName: 'Tip. Doc.', width: 100, sortable: false, headerAlign: 'center' },
        { field: 'numeroDocumento', headerName: 'Nom. Doc.', width: 120, sortable: false, headerAlign: 'center' },
        { field: 'tipoPersona', headerName: 'Tip. Per.', width: 120, sortable: false, headerAlign: 'center' },
        { field: 'fechaNacimiento', headerName: 'Fec. Nac.', width: 120, type: 'date'
            , valueFormatter: (params) => moment(params).format('D/MM/YYYY')
            , sortable: true, headerAlign: 'center', align: 'center' },
        { field: 'celular', headerName: 'Celular', width: 120, sortable: false, headerAlign: 'center' },
        { field: 'email', headerName: 'Email', width: 120, sortable: false, headerAlign: 'center' }
    ];

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Button size="small" onClick={() => {
                    navigate(`/person/edit/0`);
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
    // const navigate = useNavigate();
    // const handleClick = () => {
    //     navigate(`/person/edit/` + (selectItem.length > 0 ? selectItem[0] : 0));
    // }

    return (
        <div>
            <Typography variant="h6" gutterBottom>
                <Box sx={{ fontWeight: 'bold' }}>
                    Personas
                </Box>
            </Typography>
            <Grid container>
                <Grid item>
                    <Card>
                        <CardContent sx={{ padding: "10px 10px 10px 10px !important" }}>
                            <Grid container item xs={12} sm={12} spacing={1} padding={0}>
                                <Grid item xs={7} sm={4}>
                                    <TextField
                                        // required
                                        name="numeroDocumento"
                                        label="Numero Documento"
                                        value={filters.numeroDocumento}
                                        fullWidth
                                        onChange={(event) => {
                                            dispatch(setValue({name: "numeroDocumento", value: event.target.value}))
                                        }}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={9} sm={5}>
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
                    {/* <Button onClick={handleClick} type="button" />
                    <Link to={`/person/edit/` + (selectItem.length > 0 ? selectItem[0] : 0)}>Editar</Link> */}
                    {/* <Link to={{
                        pathname: '/person/edit'
                        , search: '?id=' + (select.length > 0 ? select[0] : 0)
                    }}>Editar</Link> */}
                    {/* {JSON.stringify(selectItem)} */}
                    {/* <Box sx={{ flexGrow: 1, p: 1, width: `calc(100vw - ${30}px)` }}> */}
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
                                Toolbar: CustomToolbar,
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
                            overflowX: 'scroll',
                            "& .MuiDataGrid-cellContent": {
                                minHeight: 100
                              }
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
}
export default Index


