import { Button, FormControl, Grid, InputLabel, Select, Table, TableBody, TableCell
    , TableRow, TextField, Typography, IconButton, Stack, Box } from '@mui/material';
import { Search as IconSearch, AddCircle as IconAddCircle
    , Delete as IconDelete } from "@mui/icons-material";
import axios from "axios";
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addPersonaDireccion, removePersonaDireccion, setDatoPersonaDireccion
    , setPersonaDirecciones, setTiposDirecciones } from '../redux/personDirectionSlice';
import UbigeoSearch from './UbigeoSearch';
import DirectionSearch from './DirectionSearch';
import DialogYesNo from './DialogYesNo';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    paddingTableCell: {
        "& .MuiTableCell-sizeSmall": {
            padding: "0px 0px 0px 0px",
            borderBottom: "none",
          },
          "& .MuiGrid-root": {
              padding: "5px 0px 0px 0px",
          },"& .MuiGrid-root>.MuiGrid-item": {
            paddingTop: "8px"
          },
    },
    tableRow: {
        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.action.selected,
        },
        '&:last-child td, &:last-child th': {
            borderRadius: '0.5em 0.5em 0.5em 0.5em'
        },
    }
}));

const PersonDirection = () => {
    const params = useParams();
    const personaDirecciones = useSelector((state) => state.personDirection.personaDirecciones);
    const tiposDirecciones = useSelector((state) => state.personDirection.tiposDirecciones);
    const defaultPersonaDirecciones = useSelector((state) => state.personDirection.defaultPersonaDirecciones);
    const dispatch = useDispatch();
    const [verMasUbigeo, setVerMasUbigeo] = useState(false);
    const [openUbigeoSearch, setOpenUbigeoSearch] = useState(false)
    const openCloseUbigeoSearch = () => { setOpenUbigeoSearch(!openUbigeoSearch); }
    const [openDirectionSearch, setOpenDirectionSearch] = useState(false)
    const openCloseDirectionSearch = () => { setOpenDirectionSearch(!openDirectionSearch); }
    const [openDialogDelete, setOpenDialogDelete] = useState(false)
    const openCloseDialogDelete = () => { setOpenDialogDelete(!openDialogDelete); }
    const [selectIdItem, setSelectIdItem] = useState(null);
    const [selectNumero, setSelectNumero] = useState(null);
    const [selectId, setSelectId] = useState(null);
    const classes = useStyles();

    const fetchPersonaDirecciones = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Persona/GetPersonasDireccionesViewByIdPersona?idPersona=" + params.id)
            .catch((err) => {
                console.log("Err: ", err);
            });

        if (response.data.data === null || response.data.data.length === 0)
            dispatch(setPersonaDirecciones(defaultPersonaDirecciones));
        else
            dispatch(setPersonaDirecciones(response.data.data));
    }, []);

    const fetchTiposDirecciones = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=38")
            .catch((err) => {
                console.log("Err: ", err);
            });
        dispatch(setTiposDirecciones(response.data.data));
    }, []);

    useEffect(() => {
        fetchPersonaDirecciones();
        fetchTiposDirecciones();
    }, []);

    const setItemValue = (numero, name, value) => {
        dispatch(setDatoPersonaDireccion({numero: numero, name: name, value: value}))
    }

    const setSelectUbigeoSearch = (selectUbigeoSearch) => {
        console.log(selectUbigeoSearch)
        
        setItemValue(selectNumero, "idDireccion", 0);
        setItemValue(selectNumero, "idUbigeo", selectUbigeoSearch == null ? 0 : selectUbigeoSearch.idUbigeo);
        setItemValue(selectNumero, "resumenUbigeo", selectUbigeoSearch == null ? "" : selectUbigeoSearch.descripcion);
    }
    const setSelectDirectionSearch = (selectDirectionSearch) => {
        console.log(selectDirectionSearch)
        console.log(selectNumero)
        
        setItemValue(selectNumero, "idUbigeo", selectDirectionSearch.idUbigeo);
        setItemValue(selectNumero, "resumenUbigeo", selectDirectionSearch.ubigeo);
        setItemValue(selectNumero, "idDireccion", selectDirectionSearch.id);
        setItemValue(selectNumero, "detalle", selectDirectionSearch.detalle);
        setItemValue(selectNumero, "referencia", selectDirectionSearch.referencia);
    }
    const deletePersonaDireccion = async () => {
        await axios
            .delete("https://localhost:44337/Persona/DeletePersonaDireccion?idPersona=" + params.id + "&numero=" + selectNumero)
            .catch((err) => {
                console.log("Err: ", err);
            });
        dispatch(removePersonaDireccion(selectNumero));
    }

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.action.selected,
            // backgroundColor: "gray",
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            borderRadius: '0.5em 0.5em 0.5em 0.5em'
        },
      }));

    return (
        <Grid container>
            <Grid item>
                <Typography variant="h7">
                    <Box sx={{ fontWeight: 'bold' }} padding={0}>
                        {"Direcciones (" + (personaDirecciones != null ? personaDirecciones.length : 0) + ")"}
                    </Box>
                </Typography>
            </Grid>
            <Grid item>
                <IconButton size="small" aria-label="agregar" style={{height: 10}} onClick={() => {
                    dispatch(addPersonaDireccion(params.id));
                }}>
                    <IconAddCircle />
                </IconButton>
            </Grid>
            <Grid item>
                <Button size='small' color="primary" onClick={() => { setVerMasUbigeo(!verMasUbigeo) }}>
                    {verMasUbigeo ? "Ver Menos" : "Ver Más"}
                </Button>
            </Grid>
            <Grid container>
                {/* {JSON.stringify(personaDirecciones)} */}
                <Table size="small" classes={{root: classes.paddingTableCell}}>
                    <TableBody>
                        {
                            verMasUbigeo ?
                            personaDirecciones.map((row) => (
                                <TableRow key={row.numero} classes={{root: classes.tableRow}}>
                                    <TableCell>
                                        <Grid container spacing={1} padding={1}>
                                            <Grid item xs={6} sm={2}>
                                                <FormControl required fullWidth>
                                                    <InputLabel htmlFor="input-tipodireccion">Tipo Direccion</InputLabel>
                                                    <Select
                                                        native
                                                        //native={!tiposDirecciones.length == 0}
                                                        //defaultValue={0}
                                                        label="Tipo Direccion"
                                                        value={row.idTipoDireccion}
                                                        onChange={(event, newValue) => {
                                                            setItemValue(row.numero, "idTipoDireccion", event.target.value);
                                                        }}
                                                        inputProps={{
                                                            name: 'idTipoDireccion',
                                                            id: 'input-tipodireccion',
                                                        }}
                                                        size="small"
                                                    >
                                                        <option key={0} value={0}>{""}</option>
                                                        {tiposDirecciones.map((row) => (
                                                            <option key={row.id} value={row.id}>{row.descripcion}</option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={6} sm={2}>
                                                <Stack alignItems="center" direction="row" gap={2}>
                                                    <TextField
                                                        // required
                                                        name="resumenUbigeo"
                                                        label="Ubigeo"
                                                        value={row.resumenUbigeo}
                                                        disabled
                                                        fullWidth
                                                        onChange={(event) => {
                                                            setItemValue(row.numero, "resumenUbigeo", event.target.value);
                                                        }}
                                                        size="small"
                                                    />
                                                    <IconButton aria-label="Buscar Ubigeo" size='small' onClick={() => {
                                                        setSelectNumero(row.numero);

                                                        openCloseUbigeoSearch()
                                                    }}>
                                                        <IconSearch />
                                                    </IconButton>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12} sm={5}>
                                                <Stack alignItems="center" direction="row" gap={2}>
                                                    <TextField
                                                        required
                                                        name="detalle"
                                                        label="Detalle"
                                                        value={row.detalle}
                                                        fullWidth
                                                        onChange={(event) => {
                                                            setItemValue(row.numero, "detalle", event.target.value);
                                                        }}
                                                        size="small"
                                                    />
                                                    <IconButton aria-label="Buscar Direccion" size='small' onClick={() => {
                                                        setSelectNumero(row.numero);

                                                        openCloseDirectionSearch()
                                                    }}>
                                                        <IconSearch />
                                                    </IconButton>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <Stack alignItems="center" direction="row" gap={2}>
                                                    <TextField
                                                        name="referencia"
                                                        label="Referencia"
                                                        value={row.referencia}
                                                        fullWidth
                                                        onChange={(event) => {
                                                            setItemValue(row.numero, "referencia", event.target.value);
                                                        }}
                                                        size="small"
                                                    />
                                                    <IconButton aria-label="borrar" size='small' onClick={() => {
                                                        dispatch(removePersonaDireccion(row.numero))
                                                    }}>
                                                        <IconDelete />
                                                    </IconButton>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            )) :
                            personaDirecciones.map((row) => (
                                <TableRow key={row.numero} classes={{root: classes.tableRow}}>
                                    <TableCell>
                                        <Grid container spacing={1} padding={1}>
                                            <Grid item xs={6} sm={2}>
                                                <FormControl required fullWidth>
                                                    <InputLabel htmlFor="input-tipodireccion">Tipo Direccion</InputLabel>
                                                    <Select
                                                        native
                                                        label="Tipo Direccion"
                                                        value={row.idTipoDireccion}
                                                        onChange={(event, newValue) => {
                                                            setItemValue(row.numero, "idTipoDireccion", event.target.value);
                                                        }}
                                                        inputProps={{
                                                            name: 'idTipoDireccion',
                                                            id: 'input-tipodireccion',
                                                        }}
                                                        size="small"
                                                    >
                                                        <option key={0} value={0}>{""}</option>
                                                        {tiposDirecciones.map((row) => (
                                                            <option key={row.id} value={row.id}>{row.descripcion}</option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={10} sm={5}>
                                                <TextField
                                                    required
                                                    name="detalle"
                                                    label="Detalle"
                                                    value={row.detalle}
                                                    fullWidth
                                                    onChange={(event) => {
                                                        setItemValue(row.numero, "detalle", event.target.value);
                                                    }}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={8} sm={4}>
                                                <TextField
                                                    name="referencia"
                                                    label="Referencia"
                                                    value={row.referencia}
                                                    fullWidth
                                                    onChange={(event) => {
                                                        setItemValue(row.numero, "referencia", event.target.value);
                                                    }}
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={2} sm={1}>
                                                <IconButton aria-label="borrar" onClick={() => {
                                                    if (row.idPersona > 0) {
                                                        setSelectNumero(row.numero);
                                                        setOpenDialogDelete(true);
                                                    }
                                                    else {
                                                        dispatch(removePersonaDireccion(row.numero));
                                                    }
                                                }}>
                                                    <IconDelete />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Grid>
            <UbigeoSearch open={openUbigeoSearch} openClose={openCloseUbigeoSearch} setSelection={setSelectUbigeoSearch} />
            <DirectionSearch open={openDirectionSearch} openClose={openCloseDirectionSearch} setSelection={setSelectDirectionSearch} />
            <DialogYesNo open={openDialogDelete} openClose={openCloseDialogDelete} setYes={deletePersonaDireccion} 
                setNo={() => { return }}
                titulo={"Borrar dirección"}
                texto={"Esta seguro de borrar la dirección?"} >
            </DialogYesNo>
        </Grid>
    )
}

export default PersonDirection;
