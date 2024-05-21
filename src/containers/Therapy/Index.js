import { CircularProgress, Button, Grid, Typography, TextField, Box, Hidden, Card, CardContent
    , FormControl, InputLabel, Select } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Search as IconSearch, Add as IconAdd } from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridOverlay
    , GridToolbarFilterButton } from "@mui/x-data-grid";
import { setValue, setLocales } from '../../redux/therapySearchSlice';
import { setPersonList } from "../../redux/personSlice";

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
    const filters = useSelector((state) => state.therapySearch.filters);
    const listLocales = useSelector((state) => state.therapySearch.listLocales);
    const classes = useStyles();
    const [cargando, setCargando] = useState(true);
    const [results, setResults] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://localhost:44337/Terapia/GetsTerapiaResumenViewAll')
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
            .get('https://localhost:44337/Terapia/GetsTerapiaResumenViewByIdLocalOrMemberOrTherapist?'
                + 'idLocal=' + (filters.idLocal == null ? 0 : filters.idLocal)
                + '&member=' + (filters.member == null ? "" : filters.member)
                + '&therapist=' + (filters.therapist == null ? "" : filters.therapist))
            .then((response) => {
                setResults(response.data.data);
                setCargando(false);
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
    }
    const fetchLocales = async () => {
        await axios
            .get('https://localhost:44337/Local/GetsList')
            .then((response) => {
                dispatch(setLocales(response.data.data));
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
    }

    useEffect(() => {
        fetchLocales();
    }, []);

    const columns = [
        // { field: 'id', headerName: 'ID', width: 50, sortable: false, headerAlign: 'center', align: 'center' },
        // { field: 'codigoServicio', headerName: 'Servicio', width: 50, sortable: false, headerAlign: 'center', align: 'center' },
        { field: 'participante', headerName: 'Participante', width: 180, sortable: true, headerAlign: 'center'
            , renderCell: (cellValues) => {
                return <Link to={'/therapy/edit/' + cellValues.row.idTerapia} style={{ color: 'inherit' }}>{cellValues.row.participante}</Link>;
            }
        },
        { field: 'terapeutas', headerName: 'Terapeutas', width: 180, sortable: true, headerAlign: 'center' },
        { field: 'local', headerName: 'Local', width: 80, sortable: false, headerAlign: 'center', align: 'center' },
        { field: 'horario', headerName: 'Horario', width: 250, sortable: true, headerAlign: 'center' },
        { field: 'codigoTarifa', headerName: 'Tarifa', width: 80, sortable: false, headerAlign: 'center', align: 'center' },
        { field: 'salon', headerName: 'Salon', width: 100, sortable: true, headerAlign: 'center' },
        { field: 'fechaInicio', headerName: 'Inicio', width: 120, type: 'date'
            , valueFormatter: (value) => moment(value).format('D/MM/YYYY')
            , sortable: true, headerAlign: 'center', align: 'center' },
        { field: 'estado', headerName: 'Estado', width: 80, sortable: true, headerAlign: 'center' },
    ];

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Button size="small" onClick={() => {
                    navigate(`/therapy/edit/0`);
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
            {/* <Button onClick={handleClick} type="button" />
            <Link to={`/member/edit/` + (selectItem.length > 0 ? selectItem[0] : 0)}>Editar</Link> */}
            {/* <Link to={{
                pathname: '/person/edit'
                , search: '?id=' + (select.length > 0 ? select[0] : 0)
            }}>Editar</Link> */}
            {/* {JSON.stringify(selectItem)} */}
            <Typography variant="h6" gutterBottom>
                <Box sx={{ fontWeight: 'bold' }}>
                    Terapias
                </Box>
            </Typography>
            <Grid container>
                <Grid item>
                    <Card>
                        <CardContent sx={{ padding: "10px 10px 10px 10px !important" }}>
                            <Grid container item xs={12} sm={12} spacing={1} padding={0}>
                                <Grid item xs={6} sm={2}>
                                    {/* <TextField
                                        // required
                                        name="local"
                                        label="Local"
                                        value={filters.local}
                                        fullWidth
                                        onChange={(event) => {
                                            dispatch(setValue({name: "local", value: event.target.value}))
                                        }}
                                        size="small"
                                    /> */}
                                    <FormControl>
                                        <InputLabel htmlFor="input-local">Local</InputLabel>
                                        <Select
                                            //native={!sexos.length == 0}
                                            native
                                            //value={personaNatural.idSexo == null ? 33 : personaNatural.idSexo}
                                            // defaultValue={0}
                                            label="Local"
                                            value={filters.idLocal}
                                            onChange={(event) => {
                                                dispatch(setValue({name: "idLocal", value: event.target.value}))
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
                                <Grid item xs={8} sm={3}>
                                    <TextField
                                        // required
                                        name="member"
                                        label="Participante"
                                        value={filters.member}
                                        fullWidth
                                        onChange={(event) => {
                                            dispatch(setValue({name: "member", value: event.target.value}))
                                        }}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={8} sm={3}>
                                    <TextField
                                        // required
                                        name="therapist"
                                        label="Terapeuta"
                                        value={filters.therapist}
                                        fullWidth
                                        onChange={(event) => {
                                            dispatch(setValue({name: "therapist", value: event.target.value}))
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
            </Grid>
        </div>
    )
}
export default Index


