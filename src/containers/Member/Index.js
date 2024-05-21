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
import { setValue } from '../../redux/memberSearchSlice';
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
    const filters = useSelector((state) => state.memberSearch.filters);
    const personList = useSelector((state) => state.person.personList);
    const classes = useStyles();
    const [cargando, setCargando] = useState(true);
    const [results, setResults] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://localhost:44337/Participante/GetsParticipantesResumenView')
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
            .get('https://localhost:44337/Participante/GetsParticipantesResumenViewByMemberOrRelative?'
                + 'member=' + (filters.member == null ? "" : filters.member)
                + '&relative=' + (filters.relative == null ? "" : filters.relative))
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
        { field: 'participante', headerName: 'Nombre Participante', width: 200, sortable: true, headerAlign: 'center'
            , renderCell: (cellValues) => {
                return <Link to={'/member/edit/' + cellValues.row.id} style={{ color: 'inherit' }}>{cellValues.row.participante}</Link>;
            }
        },
        // { field: 'terapeutaAsignado', headerName: 'Terapeuta Asig.', width: 200, sortable: true, headerAlign: 'center' },
        { field: 'fechaIngreso', headerName: 'Ingreso', width: 100, type: 'date'
            , valueFormatter: (value) => moment(value).format('D/MM/YYYY')
            , sortable: true, headerAlign: 'center', align: 'center' },
        { field: 'padre', headerName: 'Padre', width: 200, sortable: true, headerAlign: 'center' },
        { field: 'madre', headerName: 'Madre', width: 200, sortable: true, headerAlign: 'center' },
        { field: 'personasAutorizadas', headerName: 'Personas Aut.', width: 200, sortable: true, headerAlign: 'center' },
        { field: 'lugarCasoAccidente', headerName: 'Lugar Caso Acc.', width: 150, sortable: true, headerAlign: 'center' },
    ];

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Button size="small" onClick={() => {
                    navigate(`/member/edit/0`);
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
                    Participantes
                </Box>
            </Typography>
            <Grid container>
                <Grid item>
                    <Card>
                        <CardContent sx={{ padding: "10px 10px 10px 10px !important" }}>
                            <Grid container item xs={12} sm={12} spacing={1} padding={0}>
                                <Grid item xs={8} sm={5}>
                                    <TextField
                                        // required
                                        name="member"
                                        label="Nombre Participante"
                                        value={filters.member}
                                        fullWidth
                                        onChange={(event) => {
                                            dispatch(setValue({name: "member", value: event.target.value}))
                                        }}
                                        size="small"
                                    />
                                </Grid>
                                {/* <Grid item xs={8} sm={3}>
                                    <TextField
                                        // required
                                        name="therapist"
                                        label="Terapeuta Asignado"
                                        value={filters.therapist}
                                        fullWidth
                                        onChange={(event) => {
                                            dispatch(setValue({name: "therapist", value: event.target.value}))
                                        }}
                                        size="small"
                                    />
                                </Grid> */}
                                <Grid item xs={8} sm={4}>
                                    <TextField
                                        // required
                                        name="relative"
                                        label="Nombre Familiar"
                                        value={filters.relative}
                                        fullWidth
                                        onChange={(event) => {
                                            dispatch(setValue({name: "relative", value: event.target.value}))
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


