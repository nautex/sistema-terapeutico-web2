import { FormControl, Grid, IconButton, InputLabel, Select, TextField, Divider
    , Typography, Stack, Box } from '@mui/material';
import { Search as IconSearch } from "@mui/icons-material";
import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setEntity, setData, setValidationMessage, activeValidations
    , setListEstadoVigencia, setListPeriodo, setListEstado } from "../redux/therapyPlanSlice";
import { FormHelperText as HelperText } from '@mui/material';

const TherapyPlan = () => {
    const params = useParams();
    const entity = useSelector((state) => state.therapyPlan.entity);
    const defaultEntity = useSelector((state) => state.therapyPlan.defaultEntity);
    const listEstadoVigencia = useSelector((state) => state.therapyPlan.listEstadoVigencia);
    const listPeriodo = useSelector((state) => state.therapyPlan.listPeriodo);
    const listEstado = useSelector((state) => state.therapyPlan.listEstado);
    const validate = useSelector((state) => state.therapyPlan.validationActive);
    const dispatch = useDispatch();
    const fechaHoy = new Date();
    const fechaIngresoMinimo = new Date(2010, 1, 1);

    var validation = {
        idPeriodo: {
            error: entity.idPeriodo == null || entity.idPeriodo == 0,
            message: "Falta ingresar el periodo",
        },
        fechaInicio: {
            error: Date.parse(entity.fechaInicio) < fechaIngresoMinimo,
            message: "Debe ser una fecha mayor al " + fechaIngresoMinimo.getFullYear(),
        },
        idEstadoVigencia: {
            error: entity.idEstadoVigencia == null || entity.idEstadoVigencia == 0,
            message: "Falta ingresar el estado de vigencia",
        },
    }

    const fetchEntity = useCallback(async () => {
        await axios
            .get("https://localhost:44337/TerapiaPlan/GetTerapiaPlanView?idTerapiaPlan=" + params.id)
            .then((response) => {
                if (response.data.data == null || response.data.data.length == 0){
                    dispatch(setEntity(defaultEntity));

                    axios
                    .get("https://localhost:44337/Terapia/GetTerapiaView?idTerapia=" + params.idTerapia)
                    .then((res) => {
                        if (res.data.data != null){
                            dispatch(setData({name: "idTerapia", value: res.data.data.id}))
                            dispatch(setData({name: "participante", value: res.data.data.participante}))
                            dispatch(setData({name: "terapeuta", value: res.data.data.terapeuta}))
                        }
                    })
                    .catch((err) => {
                        console.log("Err: ", err);
                    });
                }
                else {
                    dispatch(setEntity(response.data.data));
                }
            })
            .catch((err) => {
                console.log("Err: ", err);
            });
    }, [])
    const fetchListEstadoVigencia = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=90")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setListEstadoVigencia(response.data.data));
    }, [])
    const fetchListPeriodo = useCallback(async () => {
        await axios
        .get('https://localhost:44337/Periodo/GetsPeriodoView?'
        + 'idTipoTerapia=0'
        + '&idEstadoApertura=87'
        + '&mesesHaciaAtras=0'
        + '&idEstado=2'
        )
        .then((response) => {
            dispatch(setListPeriodo(response.data.data));
        })
        .catch((err) => {
            console.log("Err: ", err)
        });
    }, [])
    const fetchListEstado = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=1")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setListEstado(response.data.data));
    }, [])

    useEffect(() => {
        fetchEntity();
        fetchListEstadoVigencia();
        fetchListPeriodo();
        fetchListEstado();
        dispatch(setValidationMessage(messagesValidation()));
    }, []);

    useEffect(() => {
        dispatch(setValidationMessage(messagesValidation()));
    }, [entity])

    var setDataEntity = e => {
        dispatch(setData(e.target));
    }
    const messagesValidation = () => {
        var messages = [];

        Object.keys(validation).forEach(function (key) {
            if (validation[key].error) messages.push(validation[key].message)
        })

        return messages;
    }

    return (
        <Grid container>
            {/* {JSON.stringify(validation)}
            {JSON.stringify(validate)} */}
            {/* {JSON.stringify(entity)} */}
            <Grid item>
                <Box sx={{ fontWeight: 'bold' }} padding={0}>
                    <Typography variant="h7">
                        Datos Basicos
                    </Typography>
                </Box>
            </Grid>
            <Grid container spacing={2} padding={"12px 0px 0px 0px"}>
                <Grid item xs={12} sm={3}>
                    <TextField
                        disabled
                        name="terapeuta"
                        label="Terapeuta"
                        fullWidth
                        value={entity.terapeuta}
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        disabled
                        name="participante"
                        label="Participante"
                        fullWidth
                        value={entity.participante}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl required fullWidth error={validate.idPeriodo && validation.idPeriodo.error}>
                        <InputLabel htmlFor="input-periodo">Periodo</InputLabel>
                        <Select
                            native
                            label="Periodo"
                            value={entity.idPeriodo}
                            fullWidth
                            onChange={(event, newValue) => {
                                var id = event.nativeEvent.target.selectedIndex;

                                dispatch(setData({name: "idPeriodo", value: event.target.value}))
                                dispatch(setData({name: "periodo", value: event.nativeEvent.target[id].text}))
                            }}
                            inputProps={{
                                name: 'idPeriodo',
                                id: 'input-periodo',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{"(Seleccione)"}</option>
                            {listPeriodo.map((row) => (
                                <option key={row.id} value={row.id}>{row.codigo}</option>
                            ))}
                        </Select>
                        <HelperText>
                            {validate.idPeriodo && validation.idPeriodo.error ? validation.idPeriodo.message : ""}
                        </HelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        required
                        name="fechaInicio"
                        label="Fecha"
                        fullWidth
                        type="date"
                        value={moment(entity.fechaInicio).format('yyyy-MM-DD')}
                        onChange={setDataEntity}
                        error={validate.fechaInicio && validation.fechaInicio.error}
                        helperText={validate.fechaInicio && validation.fechaInicio.error ? validation.fechaInicio.message : ""}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl required fullWidth error={validate.idEstadoVigencia && validation.idEstadoVigencia.error}>
                        <InputLabel htmlFor="input-estadoVigencia">Vigencia</InputLabel>
                        <Select
                            native
                            label="Vigencia"
                            value={entity.idEstadoVigencia}
                            onChange={(event, newValue) => {
                                var id = event.nativeEvent.target.selectedIndex;

                                dispatch(setData({name: "idEstadoVigencia", value: event.target.value}))
                                dispatch(setData({name: "estadoVigencia", value: event.nativeEvent.target[id].text}))
                            }}
                            inputProps={{
                                name: 'idEstadoVigencia',
                                id: 'input-estadoVigencia',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{"(Seleccione)"}</option>
                            {listEstadoVigencia.map((row) => (
                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                            ))}
                        </Select>
                        <HelperText>
                            {validate.idEstadoVigencia && validation.idEstadoVigencia.error ? validation.idEstadoVigencia.message : ""}
                        </HelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    {/* <FormControl required fullWidth error={validate.idEstado && validation.idEstado.error}> */}
                    <FormControl required fullWidth>
                        <InputLabel htmlFor="input-estado">Estado</InputLabel>
                        <Select
                            //native={!sexos.length == 0}
                            native
                            //value={personaNatural.idSexo == null ? 33 : personaNatural.idSexo}
                            // defaultValue={0}
                            label="Estado"
                            value={entity.idEstado}
                            onChange={setDataEntity}
                            inputProps={{
                                name: 'idEstado',
                                id: 'input-estado',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{"(Seleccione)"}</option>
                            {listEstado.map((row) => (
                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                            ))}
                        </Select>
                        {/* <HelperText>{validate.idEstado && validation.idEstado.error ? validation.idEstado.message : ""}</HelperText> */}
                    </FormControl>
                </Grid>
            </Grid>
        </Grid>
    );
}
export default TherapyPlan;
