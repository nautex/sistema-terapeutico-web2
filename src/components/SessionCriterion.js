import { FormControl, Grid, Select, Table, TableBody, TableCell, TableRow
    , TextField, Typography, IconButton, InputLabel, Autocomplete, Box } from '@mui/material'
import { AddCircle as IconAddCircle, Delete as IconDelete } from "@mui/icons-material";
import axios from 'axios'
import moment from 'moment';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setEntity, setData, add, remove
    , setIdTerapia, setListModelo, setListArea, setListAreaObjetivo, setListAreaObjetivoCriterio, setListGrupoPuntuacion
    , setValidations, activeValidations
} from '../redux/sessionCriterionSlice'
import DialogYesNo from './DialogYesNo'
import { FormHelperText as HelperText } from '@mui/material';
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
        // "& .MuiCardContent-root": {
        //     padding: "0px 0px 0px 0px",
        // }
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

const SessionCriterion = () => {
    const params = useParams();
    const entity = useSelector((state) => state.sessionCriterion.entity)
    const defaultEntity = useSelector((state) => state.sessionCriterion.defaultEntity)
    const idTerapia = useSelector((state) => state.sessionCriterion.idTerapia)
    const listArea = useSelector((state) => state.sessionCriterion.listArea)
    const listAreaObjetivo = useSelector((state) => state.sessionCriterion.listAreaObjetivo)
    const listAreaObjetivoCriterio = useSelector((state) => state.sessionCriterion.listAreaObjetivoCriterio)
    const listPuntuacionGrupo = useSelector((state) => state.sessionCriterion.listPuntuacionGrupo)
    const [openDialogDelete, setOpenDialogDelete] = useState(false)
    const openCloseDialogDelete = () => { setOpenDialogDelete(!openDialogDelete); }
    const [selectNumero, setSelectNumero] = useState(null);
    const [selectId, setSelectId] = useState(null);
    const [numeroDocumentoFocus, setNumeroDocumentoFocus] = useState(null);
    const validate = useSelector((state) => state.sessionCriterion.validationActive);
    const dispatch = useDispatch();
    const classes = useStyles();

    var validation = {
        AtLeastOneRow: {
            error: entity.length == 1
                &&
                (
                    entity[0].idTerapeuta == 0
                    || entity[0].idTipoCargo == 0
                ),
            message: "Debe haber por lo menos un criterio",
        },
    }

    const setItemValue = (numero, name, value) => {
        dispatch(setData({numero: numero, name: name, value: value}))
    }

    const fecthEntity = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Sesion/GetsSesionCriterioView?idSesion=" + params.id)
            .then((response) => {
                if (response.data.data == null || response.data.data.length == 0){
                    dispatch(setEntity(defaultEntity));

                    axios
                    .get("https://localhost:44337/Terapia/GetTerapiaPeriodoResumenView?idTerapiaPeriodo=" + params.idTerapiaPeriodo)
                    .then((res) => {
                        if (res.data.data != null){
                            axios
                            .get("https://localhost:44337/TerapiaPlan/GetsArea?idTerapia=" + res.data.data.idTerapia)
                            .then((resareas) => {
                                dispatch(setListArea(resareas.data.data));
                            })
                            .catch((err) => {
                                console.log("Err: ", err);
                            });
                        }
                    })
                    .catch((err) => {
                        console.log("Err: ", err);
                    });
                }
                else {
                    axios
                    .get("https://localhost:44337/Terapia/GetTerapiaPeriodoResumenView?idTerapiaPeriodo=" + params.idTerapiaPeriodo)
                    .then((res) => {
                        if (res.data.data != null){
                            axios
                            .get("https://localhost:44337/TerapiaPlan/GetsArea?idTerapia=" + res.data.data.idTerapia)
                            .then((resareas) => {
                                dispatch(setListArea(resareas.data.data));
                            })
                            .catch((err) => {
                                console.log("Err: ", err);
                            });
                        }
                    })
                    .catch((err) => {
                        console.log("Err: ", err);
                    });

                    dispatch(setEntity(response.data.data));
                }
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
    }, [])
    const fetchPuntuacionGrupo = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Puntuacion/GetsPuntuacionGrupo")
            .catch((err) => {
                console.log("Err: ", err);
            });

        dispatch(setListGrupoPuntuacion(response.data.data));
    }, [])
    const setObjetivo = useCallback(async (idArea, numero) => {
        const response = await axios
            .get("https://localhost:44337/Modelo/GetsObjetivo?idArea=" + idArea)
            .catch((err) => {
                console.log("Err: ", err);
            });
        setItemValue(numero, "areaObjetivo", response.data.data)
    }, [])
    const fetchObjetivo = useCallback(async (idArea) => {
        const response = await axios
            .get("https://localhost:44337/Modelo/GetsObjetivo?idArea=" + idArea)
            .catch((err) => {
                console.log("Err: ", err);
            });
        dispatch(setListAreaObjetivo(response.data.data));
    }, [])
    const setCriterio = useCallback(async (idAreaObjetivo, numero) => {
        const response = await axios
            .get("https://localhost:44337/Modelo/GetsCriterio?idAreaObjetivo=" + idAreaObjetivo)
            .catch((err) => {
                console.log("Err: ", err);
            });
        setItemValue(numero, "areaObjetivoCriterio", response.data.data)
    }, [])
    const fetchCriterio = useCallback(async (idAreaObjetivo) => {
        const response = await axios
            .get("https://localhost:44337/Modelo/GetsCriterio?idAreaObjetivo=" + idAreaObjetivo)
            .catch((err) => {
                console.log("Err: ", err);
            });
        dispatch(setListAreaObjetivoCriterio(response.data.data));
    }, [])

    useEffect(() => {
        fecthEntity();
        fetchPuntuacionGrupo();
    }, [])

    useEffect(() => {
        dispatch(setValidations(messagesValidation()));
    }, [entity])

    const messagesValidation = () => {
        var messages = [];

        Object.keys(validation).forEach(function (key) {
            if (validation[key].error) messages.push(validation[key].message)
        })

        return messages;
    }

    const deleteEntity = async () => {
        await axios
            .delete("https://localhost:44337/Sesion/DeleteSesionCriterio?idSesion="
                + params.id + "&numero=" + selectNumero)
            .catch((err) => {
                console.log("Err: ", err);
            });
        dispatch(remove(selectNumero));
   }

    return (
        <Grid container>
            <Grid item>
                <Typography variant="h7">
                    <Box sx={{ fontWeight: 'bold' }} padding={0}>
                        {"Criterios (" + (entity != null ? entity.length : 0) + ")"}
                    </Box>
                </Typography>
            </Grid>
            <Grid item>
                <IconButton size="small" aria-label="Agregar Criterio" style={{height: 10}} onClick={() => {
                    dispatch(add(params.id));
                }}>
                    <IconAddCircle />
                </IconButton>
            </Grid>
            <Grid container>
                {/* {JSON.stringify(entity)} */}
                {/* {JSON.stringify(numeroDocumentoExistente)} */}
                <Table size="small" classes={{root: classes.paddingTableCell}}>
                    <TableBody>
                        {entity.map((row) => (
                            <TableRow key={row.numero} classes={{root: classes.tableRow}}>
                                <TableCell>
                                    <Grid container spacing={1} padding={1}>
                                        <Grid item xs={12} sm={3}>
                                            <FormControl required fullWidth>
                                                <InputLabel htmlFor="input-area">Area</InputLabel>
                                                <Select
                                                    native
                                                    label="Area"
                                                    value={row.idArea}
                                                    onChange={(event, newValue) => {
                                                        var id = event.nativeEvent.target.selectedIndex;
                                                        
                                                        setItemValue(row.numero, "idArea", event.target.value)
                                                        setItemValue(row.numero, "area", event.nativeEvent.target[id].text)

                                                        if (event.target.value != null) {
                                                            setObjetivo(event.target.value, row.numero)
                                                            setCriterio(0, row.numero)
                                                        }
                                                    }}
                                                    inputProps={{
                                                        name: 'idArea',
                                                        id: 'input-area',
                                                    }}
                                                    size="small"
                                                >
                                                    <option key={0} value={0}>{"(Seleccione)"}</option>
                                                    {listArea.map((row) => (
                                                        <option key={row.id} value={row.id}>{row.nombre}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <FormControl required fullWidth>
                                                <InputLabel htmlFor="input-objetivo">Objetivo</InputLabel>
                                                <Select
                                                    native
                                                    label="Objetivo"
                                                    value={row.idAreaObjetivo}
                                                    onChange={(event, newValue) => {
                                                        var id = event.nativeEvent.target.selectedIndex;
                                                        
                                                        setItemValue(row.numero, "idAreaObjetivo", event.target.value)
                                                        setItemValue(row.numero, "objetivo", event.nativeEvent.target[id].text)

                                                        if (event.target.value != null) {
                                                            setCriterio(event.target.value, row.numero)
                                                        }
                                                    }}
                                                    inputProps={{
                                                        name: 'idAreaObjetivo',
                                                        id: 'input-objetivo',
                                                    }}
                                                    size="small"
                                                >
                                                    <option key={0} value={0}>{"(Seleccione)"}</option>
                                                    {row.areaObjetivo.map((childrow) => (
                                                        <option key={childrow.id} value={childrow.id}>{childrow.nombre}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <FormControl required fullWidth>
                                                <InputLabel htmlFor="input-criterio">Criterio</InputLabel>
                                                <Select
                                                    native
                                                    label="Criterio"
                                                    value={row.idAreaObjetivoCriterio}
                                                    onChange={(event, newValue) => {
                                                        var id = event.nativeEvent.target.selectedIndex;
                                                        
                                                        setItemValue(row.numero, "idAreaObjetivoCriterio", event.target.value)
                                                        setItemValue(row.numero, "criterio", event.nativeEvent.target[id].text)
                                                    }}
                                                    inputProps={{
                                                        name: 'idAreaObjetivoCriterio',
                                                        id: 'input-criterio',
                                                    }}
                                                    size="small"
                                                >
                                                    <option key={0} value={0}>{"(Seleccione)"}</option>
                                                    {row.areaObjetivoCriterio.map((childrow) => (
                                                        <option key={childrow.id} value={childrow.id}>{childrow.descripcion}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={6} sm={2}>
                                            <FormControl required fullWidth>
                                                <InputLabel htmlFor="input-puntuaciongrupo">Puntuacion</InputLabel>
                                                <Select
                                                    native
                                                    label="Puntuacion"
                                                    value={row.idPuntuacionGrupo}
                                                    fullWidth
                                                    onChange={(event, newValue) => {
                                                        var id = event.nativeEvent.target.selectedIndex;

                                                        setItemValue(row.numero, "idPuntuacionGrupo", event.target.value)
                                                        setItemValue(row.numero, "puntuacionGrupo", event.nativeEvent.target[id].text)
                                                    }}
                                                    inputProps={{
                                                        name: 'idPuntuacionGrupo',
                                                        id: 'input-puntuaciongrupo',
                                                    }}
                                                    size="small"
                                                >
                                                    <option key={0} value={0}>{"(Seleccione)"}</option>
                                                    {listPuntuacionGrupo.map((row) => (
                                                        <option key={row.id} value={row.id}>{row.descripcion}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={1} sm={1}>
                                            <IconButton aria-label="delete" onClick={() => {
                                                if (row.id > 0) {
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
                <FormControl required fullWidth
                    error={
                        (validate.AtLeastOneRow && validation.AtLeastOneRow.error)
                    }>

                    <HelperText>
                        {validate.AtLeastOneRow && validation.AtLeastOneRow.error ? validation.AtLeastOneRow.message : ""}
                    </HelperText>
                </FormControl>
            </Grid>
            <DialogYesNo
                open={openDialogDelete}
                openClose={openCloseDialogDelete}
                setYes={deleteEntity}
                setNo={() => { return }}
                titulo={"Borrar criterio"}
                texto={"Esta seguro de borrar el criterio?"}
            ></DialogYesNo>
        </Grid>
    )
}

export default SessionCriterion;
