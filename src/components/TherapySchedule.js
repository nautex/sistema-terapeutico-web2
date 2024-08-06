import { FormControl, Grid, Select, Table, TableBody, TableCell, TableRow
    , TextField, Typography, IconButton, InputLabel, Box } from '@mui/material'
import { AddCircle as IconAddCircle, Delete as IconDelete } from "@mui/icons-material";
import axios from 'axios'
import { styled } from '@mui/material/styles';
import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
    add, remove, setData
    , setEntity, setTiposAlergias, setValidations
} from '../redux/therapyScheduleSlice'
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

const TherapySchedule = () => {
    const params = useParams();
    const entity = useSelector((state) => state.therapySchedule.entity)
    const diasSemana = useSelector((state) => state.therapySchedule.diasSemana)
    const defaultEntity = useSelector((state) => state.therapySchedule.defaultEntity)
    const [openDialogDelete, setOpenDialogDelete] = useState(false)
    const openCloseDialogDelete = () => { setOpenDialogDelete(!openDialogDelete); }
    const [selectNumero, setSelectNumero] = useState(null);
    const [selectId, setSelectId] = useState(null);
    const [numeroDocumentoFocus, setNumeroDocumentoFocus] = useState(null);
    const validate = useSelector((state) => state.therapySchedule.validationActive);
    const dispatch = useDispatch();
    const classes = useStyles();

    var validation = {
        AtLeastOneRow: {
            error: entity.length == 1
                &&
                (
                    entity[0].horaInicio == ""
                ),
            message: "Debe haber por lo menos un horario",
        },
    }

    const setItemValue = (numero, name, value) => {
        dispatch(setData({numero: numero, name: name, value: value}))
    }

    const fecthEntity = async () => {
        const response = await axios
            .get("https://localhost:44337/Terapia/GetsTerapiaHorarioView?idTerapia=" + params.id)
            .catch((err) => {
                console.log("Err: ", err)
            });
        
        if (response.data.data == null || response.data.data.length == 0)
            dispatch(setEntity(defaultEntity));
        else
            dispatch(setEntity(response.data.data));
    }

    useEffect(() => {
        fecthEntity();
    }, [])

    useEffect(() => {
        dispatch(setValidations(messagesValidation()));
    }, [entity])

    useEffect(() => {
        
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
            .delete("https://localhost:44337/Terapia/DeleteTerapiaHorario?idTerapia="
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
                        {"Horarios (" + (entity != null ? entity.length : 0) + ")"}
                    </Box>
                </Typography>
            </Grid>
            <Grid item>
                <IconButton size="small" aria-label="Agregar Horario" style={{height: 10}} onClick={() => {
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
                                        <Grid item xs={5} sm={4}>
                                            <FormControl required fullWidth>
                                                <InputLabel htmlFor="input-diasemana">Dia</InputLabel>
                                                <Select
                                                    //native={!diasSemana.length == 0}
                                                    native
                                                    //defaultValue={0}
                                                    label="Dia"
                                                    value={row.diaSemana}
                                                    fullWidth
                                                    onChange={(event, newValue) => {
                                                        var id = event.nativeEvent.target.selectedIndex;

                                                        setItemValue(row.numero, "diaSemana", event.target.value)
                                                        setItemValue(row.numero, "dia", event.nativeEvent.target[id].text)
                                                    }}
                                                    inputProps={{
                                                        name: 'diaSemana',
                                                        id: 'input-diasemana',
                                                    }}
                                                    size="small"
                                                >
                                                    {/* <option key={0} value={0}>{""}</option> */}
                                                    {diasSemana.map((row) => (
                                                        <option key={row.id} value={row.id}>{row.descripcion}</option>
                                                    ))}
                                                </Select>
                                                {/* <HelperText>
                                                    {validate.AtLeastOneRow && validation.AtLeastOneRow.error ? validation.AtLeastOneRow.message : ""}
                                                </HelperText> */}
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5} sm={4}>
                                            <TextField
                                                required
                                                label="Hora Inicio"
                                                type="time"
                                                value={row.horaInicio}
                                                onChange={(e) => {
                                                    console.log(e.target.value)
                                                    setItemValue(row.numero, "horaInicio", e.target.value)
                                                }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                                // sx={{ width: 150 }}
                                                size='small'
                                                fullWidth
                                            />
                                        </Grid>
                                        {/* <Grid item xs={6} sm={3}>
                                            <TextField
                                                id="time"
                                                disabled
                                                label="Hora Fin"
                                                // type="time"
                                                value={row.horaFin}
                                                // onChange={(e) => {
                                                //     setItemValue(row.numero, "horaFin", e.target.value)
                                                // }}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                                // sx={{ width: 150 }}
                                                size='small'
                                                fullWidth
                                            />
                                        </Grid> */}
                                        <Grid item xs={2} sm={2}>
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
                titulo={"Borrar horario"}
                texto={"Esta seguro de borrar el horario?"}
            ></DialogYesNo>
        </Grid>
    )
}

export default TherapySchedule;
