import { FormControl, Grid, IconButton, InputLabel, Select, Table, TableBody
    , TableCell, TableRow, TextField, Typography, Stack, Box } from '@mui/material'
import { AddCircle as IconAddCircle, Delete as IconDelete, Search as IconSearch } from "@mui/icons-material";
import axios from 'axios'
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { addPersonaVinculaciones, removePersonaVinculaciones, setDatoPersonaVinculaciones
    , setPersonaVinculaciones, setTiposVinculaciones } from '../redux/personBondingSlice'
import PersonSearch from './PersonSearch'
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
        },
    },
    tableRow: {
        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.action.selected,
        },
        '&:last-child td, &:last-child th': {
            borderRadius: '0.5em 0.5em 0.5em 0.5em'
        },
    },
}));

const PersonBonding = () => {
    const params = useParams();
    const personaVinculaciones = useSelector((state) => state.personBonding.personaVinculaciones)
    const tiposVinculaciones = useSelector((state) => state.personBonding.tiposVinculaciones)
    const defaultPersonaVinculaciones = useSelector((state) => state.personBonding.defaultPersonaVinculaciones)
    const [openSearchPersona, setOpenSearchPersona] = useState(false)
    const openCloseSearchPersona = () => { setOpenSearchPersona(!openSearchPersona); }
    const [selectIdItem, setSelectIdItem] = useState(null);
    const [openDialogDelete, setOpenDialogDelete] = useState(false)
    const openCloseDialogDelete = () => { setOpenDialogDelete(!openDialogDelete); }
    const [selectNumero, setSelectNumero] = useState(null);
    const [selectId, setSelectId] = useState(null);
    const dispatch = useDispatch();
    const classes = useStyles();

    const fetchPersonaVinculaciones = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Persona/GetPersonasVinculacionesViewByIdPersona?idPersona=" + params.id)
            .catch((err) => {
                console.log("Err: ", err)
            });

        if (response.data.data == null || response.data.data.length == 0)
            dispatch(setPersonaVinculaciones(defaultPersonaVinculaciones));
        else
            dispatch(setPersonaVinculaciones(response.data.data));
    }, [])
    const fetchTiposVinculaciones = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=42")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setTiposVinculaciones(response.data.data));
    }, [])

    useEffect(() => {
        fetchPersonaVinculaciones();
        fetchTiposVinculaciones();
    }, [])

    const setSelectSearchPersona = (select) => {
        setItemValue(selectNumero, "idPersonaVinculo", select.idPersona)
        setItemValue(selectNumero, "personaVinculo", select.nombres)
    }

    const deletePersonaVinculacion = async () => {
        await axios
            .delete("https://localhost:44337/Persona/DeletePersonaVinculacion?idPersona=" + params.id + "&numero=" + selectNumero)
            .catch((err) => {
                console.log("Err: ", err);
            });
        dispatch(removePersonaVinculaciones(selectNumero));
    }

    const setItemValue = (numero, name, value) => {
        dispatch(setDatoPersonaVinculaciones({numero: numero, name: name, value: value}))
    }

    return (
        <Grid container>
            <Grid item>
                <Typography variant="h7">
                    <Box sx={{ fontWeight: 'bold' }} padding={0}>
                        {"Vinculaciones (" + (personaVinculaciones != null ? personaVinculaciones.length : 0) + ")"}
                    </Box>
                </Typography>
            </Grid>
            <Grid item>
                <IconButton size="small" aria-label="Agregar Vinculacion" onClick={() => {
                    dispatch(addPersonaVinculaciones(params.id))
                }}>
                    <IconAddCircle />
                </IconButton>
            </Grid>
            <Grid container>
                {/* {JSON.stringify(personaVinculaciones)} */}
                <Table size="small" classes={{root: classes.paddingTableCell}}>
                    <TableBody>
                        {personaVinculaciones.map((row) => (
                            <TableRow key={row.numero} classes={{root: classes.tableRow}}>
                                <TableCell>
                                    <Grid container spacing={1} padding={1}>
                                        <Grid item xs={8} sm={4}>
                                            <FormControl required fullWidth>
                                                <InputLabel htmlFor="input-tipovinculo">Tipo</InputLabel>
                                                <Select
                                                    native
                                                    //native={!tiposVinculaciones.length == 0}
                                                    //defaultValue={0}
                                                    label="Tipo"
                                                    value={row.idTipoVinculo}
                                                    fullWidth
                                                    onChange={(event, newValue) => {
                                                        setItemValue(row.numero, "idTipoVinculo", event.target.value)
                                                    }}
                                                    inputProps={{
                                                        name: 'idTipoVinculo',
                                                        id: 'input-tipovinculo',
                                                    }}
                                                    size="small"
                                                >
                                                    <option key={0} value={0}>{""}</option>
                                                    {tiposVinculaciones.map((row) => (
                                                        <option key={row.id} value={row.id}>{row.descripcion}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={7}>
                                            <Stack alignItems="center" direction="row" gap={3}>
                                                <TextField
                                                    disabled
                                                    name="personaVinculo"
                                                    label="Persona"
                                                    value={row.personaVinculo}
                                                    fullWidth
                                                    onChange={(event) => {
                                                        setItemValue(row.numero, "personaVinculo", event.target.value)
                                                    }}
                                                    size="small"
                                                />
                                                <IconButton aria-label="buscar persona" size='small' onClick={() => {
                                                    setSelectIdItem(row.id)
                                                    setSelectNumero(row.numero);
                                                    openCloseSearchPersona()
                                                    }}>
                                                    <IconSearch />
                                                </IconButton>
                                                <IconButton aria-label="delete" size='small' onClick={() => {
                                                    if (row.idPersona > 0) {
                                                        setSelectId(row.id);
                                                        setSelectNumero(row.numero);
                                                        setOpenDialogDelete(true);
                                                    }
                                                    else {
                                                        dispatch(removePersonaVinculaciones(row.numero));
                                                    }
                                                    }}>
                                                    <IconDelete />
                                                </IconButton>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Grid>
            <PersonSearch open={openSearchPersona} openClose={openCloseSearchPersona} setSelection={setSelectSearchPersona} />
            <DialogYesNo open={openDialogDelete} openClose={openCloseDialogDelete} setYes={deletePersonaVinculacion} setNo={() => { return }}
                titulo={"Borrar vinculacion"}
                texto={"Esta seguro de borrar la vinculacion?"} ></DialogYesNo>
        </Grid>
    )
}

export default PersonBonding;
