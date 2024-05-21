import { FormControl, Grid, InputLabel, Select, Table, TableBody, TableCell, TableRow
    , TextField, Typography, IconButton, Box } from '@mui/material'
import { AddCircle as IconAddCircle, Delete as IconDelete } from "@mui/icons-material";
import axios from 'axios'
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { addPersonaContacto, removePersonaContacto, setDatoPersonaContacto
    , setPersonaContactos, setTiposContactos } from '../redux/personContactSlice'
import DialogYesNo from './DialogYesNo'
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
    }
}));

const PersonContact = () => {
    const params = useParams();
    const personaContactos = useSelector((state) => state.personContact.personaContactos);
    const tiposContactos = useSelector((state) => state.personContact.tiposContactos);
    const defaultPersonaContactos = useSelector((state) => state.personContact.defaultPersonaContactos);
    const [openDialogDelete, setOpenDialogDelete] = useState(false)
    const openCloseDialogDelete = () => { setOpenDialogDelete(!openDialogDelete); }
    const [selectNumero, setSelectNumero] = useState(null);
    const [selectId, setSelectId] = useState(null);
    const dispatch = useDispatch();
    const classes = useStyles();

    const fetchPersonaContactos = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Persona/GetPersonasContactosViewByIdPersona?idPersona=" + params.id)
            .catch((err) => {
                console.log("Err: " + err)
            });

        if (response.data.data == null || response.data.data.length == 0)
            dispatch(setPersonaContactos(defaultPersonaContactos))
        else
            dispatch(setPersonaContactos(response.data.data))
    }, [])
    const fetchTiposContactos = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=12")
            .catch((err) => {
                console.log("Err: " + err)
            })

        dispatch(setTiposContactos(response.data.data));
    }, [])

    useEffect(() => {
        fetchPersonaContactos();
        fetchTiposContactos();
    }, [])

    const deletePersonaContacto = async () => {
        await axios
            .delete("https://localhost:44337/Persona/DeletePersonaContacto?idPersona=" + params.id + "&numero=" + selectNumero)
            .catch((err) => {
                console.log("Err: ", err);
            });
        dispatch(removePersonaContacto(selectNumero));
    }
    const setItemValue = (numero, name, value) => {
        dispatch(setDatoPersonaContacto({numero: numero, name: name, value: value}))
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
                        {"Contactos (" + (personaContactos != null ? personaContactos.length : 0) + ")"}
                    </Box>
                </Typography>
            </Grid>
            <Grid item>
                <IconButton size="small" aria-label="agregar" style={{height: 10}} onClick={() => {
                    dispatch(addPersonaContacto(params.id));
                }}>
                    <IconAddCircle />
                </IconButton>
            </Grid>
            <Grid container>
                {/* {JSON.stringify(personaContactos)} */}
                <Table size="small" classes={{root: classes.paddingTableCell}}>
                    <TableBody>
                        {personaContactos.map((row) => (
                            <StyledTableRow key={row.numero}>
                                <TableCell>
                                    <Grid container spacing={1} padding={1}>
                                        <Grid item xs={8} sm={5}>
                                            <FormControl required fullWidth>
                                                <InputLabel htmlFor="input-tipocontacto">Tipo</InputLabel>
                                                <Select
                                                    //native={!tiposContactos.length == 0}
                                                    native
                                                    //defaultValue={0}
                                                    label="Tipo"
                                                    value={row.idTipoContacto}
                                                    fullWidth
                                                    onChange={(event, newValue) => {
                                                        setItemValue(row.numero, "idTipoContacto", event.target.value);
                                                        // dispatch(setDatoPersonaContacto(row.id, "idTipoContacto", event.target.value));
                                                    }}
                                                    inputProps={{
                                                        name: 'idTipoContacto',
                                                        id: 'input-tipocontacto',
                                                    }}
                                                    size="small"
                                                >
                                                    <option key={0} value={0}>{""}</option>
                                                    {tiposContactos.map((row) => (
                                                        <option key={row.id} value={row.id}>{row.descripcion}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={10} sm={6}>
                                            <TextField
                                                required
                                                name="valor"
                                                label="Valor"
                                                fullWidth
                                                value={row.valor}
                                                onChange={(event) => {
                                                    setItemValue(row.numero, "valor", event.target.value);
                                                    // dispatch(setDatoPersonaContacto(row.id, "valor", event.target.value));
                                                }}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={1}>
                                            <IconButton aria-label="delete" onClick={() => {
                                                if (row.idPersona > 0) {
                                                    setSelectId(row.id);
                                                    setSelectNumero(row.numero);
                                                    setOpenDialogDelete(true);
                                                }
                                                else {
                                                    dispatch(removePersonaContacto(row.numero));
                                                }
                                            }}>
                                                <IconDelete />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </Grid>
            <DialogYesNo open={openDialogDelete} openClose={openCloseDialogDelete} setYes={deletePersonaContacto} setNo={() => { return }}
                titulo={"Borrar contacto"}
                texto={"Esta seguro de borrar el contacto?"} ></DialogYesNo>
        </Grid>
    )
}

export default PersonContact;
