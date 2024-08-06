import { FormControl, Grid, IconButton, InputLabel, Select, Table, TableBody
    , TableCell, TableRow, TextField, Typography, Hidden, Box } from '@mui/material'
import { AddCircle as IconAddCircle, Delete as IconDelete, Search as IconSearch } from "@mui/icons-material";
import axios from 'axios'
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { add, remove, setData
    , setEntity } from '../redux/memberAuthorizedPersonSlice'
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
    }
}));

const MemberAuthorizedPerson = () => {
    const params = useParams();
    const entity = useSelector((state) => state.memberAuthorizedPerson.entity)
    // const tiposVinculaciones = useSelector((state) => state.memberAuthorizedPerson.tiposVinculaciones)
    const defaultEntity = useSelector((state) => state.memberAuthorizedPerson.defaultEntity)
    const [openSearchPersona, setOpenSearchPersona] = useState(false)
    const openCloseSearchPersona = () => { setOpenSearchPersona(!openSearchPersona); }
    const [selectIdItem, setSelectIdItem] = useState(null);
    const [openDialogDelete, setOpenDialogDelete] = useState(false)
    const openCloseDialogDelete = () => { setOpenDialogDelete(!openDialogDelete); }
    const [selectNumero, setSelectNumero] = useState(null);
    const [selectId, setSelectId] = useState(null);
    const dispatch = useDispatch();
    const classes = useStyles();

    const fetchEntity = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Participante/GetsParticipantePersonaAutorizadaViewById?idParticipante=" + params.id)
            .catch((err) => {
                console.log("Err: ", err)
            });
        
        if (response.data.data == null || response.data.data.length == 0)
            dispatch(setEntity(defaultEntity));
        else
            dispatch(setEntity(response.data.data));
    }, [])
    // const fetchTiposVinculaciones = useCallback(async () => {
    //     const response = await axios
    //         .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=42")
    //         .catch((err) => {
    //             console.log("Err: ", err)
    //         });
    //     dispatch(setTiposVinculaciones(response.data.data));
    // }, [])

    useEffect(() => {
        fetchEntity();
        // fetchTiposVinculaciones();
    }, [])

    const setSelectSearchPersona = (select) => {
        setItemValue(selectNumero, "idPersona", select.idPersona)
        setItemValue(selectNumero, "persona", select.nombres)
    }

    const deleteEntity = async () => {
        await axios
            .delete("https://localhost:44337/Participante/DeleteParticipantePersonaAutorizada?idParticipante=" + params.id + "&numero=" + selectNumero)
            .catch((err) => {
                console.log("Err: ", err);
            });
        dispatch(remove(selectNumero));
    }

    const setItemValue = (numero, name, value) => {
        dispatch(setData({numero: numero, name: name, value: value}))
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
                        {"Personas Autor"}<Hidden smDown>izadas</Hidden>{" (" + (entity != null ? entity.length : 0) + ")"}
                    </Box>
                </Typography>
            </Grid>
            <Grid item>
                <IconButton size="small" aria-label="Agregar Persona" style={{height: 10}} onClick={() => {
                    dispatch(add(params.id))
                }}>
                    <IconAddCircle />
                </IconButton>
            </Grid>
            <Grid container>
                {/* {JSON.stringify(entity)} */}
                <Table size="small" classes={{root: classes.paddingTableCell}}>
                    <TableBody>
                        {entity.map((row) => (
                            <TableRow key={row.numero} classes={{root: classes.tableRow}}>
                                <TableCell>
                                    <Grid container spacing={1} padding={1}>
                                        {/* <Grid item xs={5} sm={4}>
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
                                        </Grid> */}

                                        <Grid item xs={8} sm={8}>
                                            <TextField
                                                disabled
                                                name="persona"
                                                label="Persona"
                                                value={row.persona}
                                                fullWidth
                                                onChange={(event) => {
                                                    setItemValue(row.numero, "persona", event.target.value)
                                                }}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={2}>
                                            <IconButton aria-label="buscar persona" size='small' onClick={() => {
                                                setSelectIdItem(row.id)
                                                setSelectNumero(row.numero);
                                                openCloseSearchPersona()
                                            }}>
                                                <IconSearch />
                                            </IconButton>
                                        </Grid>
                                        <Grid item xs={2} sm={2}>
                                            <IconButton aria-label="delete" size='small' onClick={() => {
                                                if (row.idPersona > 0) {
                                                    setSelectId(row.id);
                                                    setSelectNumero(row.numero);
                                                    setOpenDialogDelete(true);
                                                }
                                                else {
                                                    dispatch(remove(row.numero));
                                                }
                                            }}>
                                                <IconDelete />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Grid>
            <PersonSearch open={openSearchPersona} openClose={openCloseSearchPersona} setSelection={setSelectSearchPersona} />
            <DialogYesNo open={openDialogDelete} openClose={openCloseDialogDelete} setYes={deleteEntity} setNo={() => { return }}
                titulo={"Borrar persona"}
                texto={"Esta seguro de borrar la persona?"} ></DialogYesNo>
        </Grid>
    )
}

export default MemberAuthorizedPerson;
