import { FormControl, Grid, IconButton, InputLabel, Select, TextField, Divider
    , Typography, Stack, Box } from '@mui/material';
import { Search as IconSearch } from "@mui/icons-material";
import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setEntity, setData, setValidationMessage, activeValidations
    , setListEstadosAsistencia, setListModalidades, setListPuntuacionesCriterio
    , setListPuntuacionesActividad, setListEstados, setNombreTerapeuta } from "../redux/sessionSlice";
import { FormHelperText as HelperText } from '@mui/material';
import FeeSearch from './FeeSearch';

const Session = () => {
    const params = useParams();
    const entity = useSelector((state) => state.session.entity);
    const defaultEntity = useSelector((state) => state.session.defaultEntity);
    const nombreTerapeuta = useSelector((state) => state.session.nombreTerapeuta);
    const listEstadosAsistencia = useSelector((state) => state.session.listEstadosAsistencia);
    const listModalidades = useSelector((state) => state.session.listModalidades);
    const listPuntuacionesCriterio= useSelector((state) => state.session.listPuntuacionesCriterio);
    const listPuntuacionesActividad= useSelector((state) => state.session.listPuntuacionesActividad);
    const listEstados = useSelector((state) => state.session.listEstados);
    const validate = useSelector((state) => state.session.validationActive);
    const dispatch = useDispatch();
    // const [openFeeSearch, setOpenFeeSearch] = useState(false);
    const fechaHoy = new Date();
    const fechaIngresoMinimo = new Date(2010, 1, 1);

    var validation = {
        fecha: {
            error: Date.parse(entity.fecha) < fechaIngresoMinimo,
            message: "Debe ser una fecha mayor al " + fechaIngresoMinimo.getFullYear(),
        },
        horaInicio: {
            error: entity.horaInicio.length < 1,
            message: "Falta ingresar la hora de inicio",
        },
        idEstadoAsistencia: {
            error: entity.idEstadoAsistencia == null || entity.idEstadoAsistencia == 0,
            message: "Falta ingresar el estado de asistencia",
        },
    }
    // const openCloseFeeSearch = () => { setOpenFeeSearch(!openFeeSearch); }

    const fetchEntity = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Sesion/GetSesionView?idSesion=" + params.id)
            .then((response) => {
                if (response.data.data == null || response.data.data.length == 0){
                    dispatch(setEntity(defaultEntity));
                    dispatch(setData({name: "idTerapiaPeriodo", value: params.idTerapiaPeriodo}))
                }
                else {
                    dispatch(setEntity(response.data.data));
                }

                axios
                .get("https://localhost:44337/Terapia/GetTerapiaPeriodoResumenView?idTerapiaPeriodo=" + params.idTerapiaPeriodo)
                .then((res) => {
                    if (res.data.data != null){
                        dispatch(setData({name: "idTerapia", value: res.data.data.idTerapia}))
                        dispatch(setData({name: "codigoPeriodo", value: res.data.data.codigoPeriodo}))
                        dispatch(setData({name: "participante", value: res.data.data.participante}))
                        dispatch(setNombreTerapeuta(res.data.data.terapeuta))

                        console.log(fechaHoy.getDay())

                        axios
                        .get("https://localhost:44337/Terapia/GetsTerapiaHorarioViewByWeekDay?idTerapia=" + res.data.data.idTerapia + "&weekDay=" + fechaHoy.getDay())
                        .then((resSchedule) => {
                            if (resSchedule.data.data != null && resSchedule.data.data.length > 0){
                                dispatch(setData({name: "horaInicio", value: resSchedule.data.data[0].horaInicio}))
                            }
                        })
                        .catch((err) => {
                            console.log("Err: ", err);
                        });
                    }
                })
                .catch((err) => {
                    console.log("Err: ", err);
                });
            })
            .catch((err) => {
                console.log("Err: ", err);
            });
    }, [])
    const fetchListEstadosAsistencia = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=58")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setListEstadosAsistencia(response.data.data));
    }, [])
    const fetchListModalidades = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=80")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setListModalidades(response.data.data));
    }, [])
    const fetchListEstados = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=1")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setListEstados(response.data.data));
    }, [])

    useEffect(() => {
        fetchEntity();
        fetchListEstadosAsistencia();
        fetchListModalidades();
        fetchListEstados();
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
                <Grid item xs={6} sm={3}>
                    <TextField
                        disabled
                        name="codigoPeriodo"
                        label="Periodo"
                        fullWidth
                        value={entity.codigoPeriodo}
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
                    <TextField
                        required
                        name="fecha"
                        label="Fecha"
                        fullWidth
                        type="date"
                        value={moment(entity.fecha).format('yyyy-MM-DD')}
                        onChange={setDataEntity}
                        error={validate.fecha && validation.fecha.error}
                        helperText={validate.fecha && validation.fecha.error ? validation.fecha.message : ""}
                        size="small"
                    />
                </Grid>
                <Grid item xs={5} sm={3}>
                    <TextField
                        required
                        label="Hora Inicio"
                        type="time"
                        value={entity.horaInicio}
                        onChange={(e) => {
                            dispatch(setData({name: "horaInicio", value: e.target.value}));
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
                        error={validate.horaInicio && validation.horaInicio.error}
                        helperText={validate.horaInicio && validation.horaInicio.error ? validation.horaInicio.message : ""}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl required fullWidth error={validate.idEstadoAsistencia && validation.idEstadoAsistencia.error}>
                        <InputLabel htmlFor="input-estadoasistencia">Asistencia</InputLabel>
                        <Select
                            native
                            label="Asistencia"
                            value={entity.idEstadoAsistencia}
                            onChange={(event, newValue) => {
                                var id = event.nativeEvent.target.selectedIndex;

                                dispatch(setData({name: "idEstadoAsistencia", value: event.target.value}))
                                dispatch(setData({name: "estadoAsistencia", value: event.nativeEvent.target[id].text}))
                            }}
                            inputProps={{
                                name: 'idEstadoAsistencia',
                                id: 'input-estadoasistencia',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{"(Seleccione)"}</option>
                            {listEstadosAsistencia.map((row) => (
                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                            ))}
                        </Select>
                        <HelperText>
                            {validate.idEstadoAsistencia && validation.idEstadoAsistencia.error ? validation.idEstadoAsistencia.message : ""}
                        </HelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="input-modalidad">Modalidad</InputLabel>
                        <Select
                            native
                            label="Modalidad"
                            value={entity.idModalidad}
                            fullWidth
                            onChange={(event, newValue) => {
                                var id = event.nativeEvent.target.selectedIndex;

                                dispatch(setData({name: "idModalidad", value: event.target.value}))
                                dispatch(setData({name: "modalidad", value: event.nativeEvent.target[id].text}))
                            }}
                            inputProps={{
                                name: 'idModalidad',
                                id: 'input-modalidad',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{"(Seleccione)"}</option>
                            {listModalidades.map((row) => (
                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                            ))}
                        </Select>
                        {/* <HelperText>
                            {validate.DNIWith8Digits && validation.DNIWith8Digits.error ? validation.DNIWith8Digits.message : ""}
                        </HelperText>
                        <HelperText>
                            {validate.AnyDocumentAtLeast3Digits && validation.AnyDocumentAtLeast3Digits.error ? validation.AnyDocumentAtLeast3Digits.message : ""}
                        </HelperText> */}
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
                            {listEstados.map((row) => (
                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                            ))}
                        </Select>
                        {/* <HelperText>{validate.idEstado && validation.idEstado.error ? validation.idEstado.message : ""}</HelperText> */}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="observaciones"
                        label="Observaciones"
                        fullWidth
                        value={entity.observaciones}
                        onChange={setDataEntity}
                        size="small"
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}
export default Session;
