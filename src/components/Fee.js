import { FormControl, Grid, IconButton, InputLabel, Select, TextField
    , Typography, Stack, Box } from '@mui/material';
import { Search as IconSearch } from "@mui/icons-material";
import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setEntity, setData, setValidationMessage, activeValidations
    , setListServicios, setListLocales, setListTipos, setListModalidades, setListEstados } from "../redux/feeSlice";
import { FormHelperText as HelperText } from '@mui/material';

const Fee = () => {
    const params = useParams();
    const entity = useSelector((state) => state.fee.entity);
    const defaultEntity = useSelector((state) => state.fee.defaultEntity);
    const listServicios = useSelector((state) => state.fee.listServicios);
    const listLocales= useSelector((state) => state.fee.listLocales);
    const listTipos= useSelector((state) => state.fee.listTipos);
    const listModalidades = useSelector((state) => state.fee.listModalidades);
    const listEstados = useSelector((state) => state.fee.listEstados);
    const validate = useSelector((state) => state.fee.validationActive);
    const dispatch = useDispatch();
    const fechaIngresoMinimo = new Date(2010, 1, 1);

    var validation = {
        idServicio: {
            error: entity.idServicio < 1,
            message: "Falta ingresar el servicio",
        },
        idLocal: {
            error: entity.idLocal < 1,
            message: "Falta ingresar el local",
        },
        idTipo: {
            error: entity.idTipo < 1,
            message: "Falta ingresar el tipo",
        },
        idModalidad: {
            error: entity.idModalidad < 1,
            message: "Falta ingresar la modalidad",
        },
    }

    const fetchEntity = async () => {
        const response = await axios
            .get("https://localhost:44337/Servicio/GetTarifaView?idTarifa=" + params.id)
            .catch((err) => {
                console.log("Err: ", err);
            });

            console.log(response)

        if (response.data.data === null || response.data.data.length == 0){
            dispatch(setEntity(defaultEntity));
        }
        else {
            dispatch(setEntity(response.data.data));
        }
    }
    const fetchServicios = async () => {
        const response = await axios
            .get("https://localhost:44337/Servicio/GetsListServicio")
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setListServicios(response.data.data));
    }
    const fetchLocales = async () => {
        const response = await axios
            .get("https://localhost:44337/Local/GetsList")
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setListLocales(response.data.data));
    }
    const fetchTipos = async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=49")
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setListTipos(response.data.data));
    }
    const fetchModalidades = async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=80")
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setListModalidades(response.data.data));
    }
    const fetchEstados = async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=1")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setListEstados(response.data.data));
    }

    useEffect(() => {
        fetchEntity();
        fetchServicios();
        fetchLocales();
        fetchTipos();
        fetchModalidades();
        fetchEstados();
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
                        required
                        name="codigo"
                        label="Codigo"
                        value={entity.codigo}
                        fullWidth
                        onChange={(event) => {
                            dispatch(setData({name: "codigo", value: event.target.value}))
                        }}
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        name="descripcion"
                        label="Descripcion"
                        value={entity.descripcion}
                        fullWidth
                        onChange={(event) => {
                            dispatch(setData({name: "descripcion", value: event.target.value}))
                        }}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl required fullWidth error={validate.idServicio && validation.idServicio.error}>
                        <InputLabel htmlFor="input-servicio">Servicio</InputLabel>
                        <Select
                            native
                            // native={!listServicios.length == 0}
                            //defaultValue={0}
                            label="Servicio"
                            value={entity.idServicio}
                            onChange={(event, newValue) => {
                                dispatch(setData({name: "idServicio", value: event.target.value}))
                            }}
                            inputProps={{
                                name: 'idServicio',
                                id: 'input-servicio',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{"(Seleccione)"}</option>
                            {listServicios.map((row) => (
                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                            ))}
                        </Select>
                        <HelperText>{validate.idServicio && validation.idServicio.error ? validation.idServicio.message : ""}</HelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl required fullWidth error={validate.idLocal && validation.idLocal.error}>
                        <InputLabel htmlFor="input-local">Local</InputLabel>
                        <Select
                            native
                            // native={!listServicios.length == 0}
                            //defaultValue={0}
                            label="Local"
                            value={entity.idLocal}
                            onChange={(event, newValue) => {
                                dispatch(setData({name: "idLocal", value: event.target.value}))
                            }}
                            inputProps={{
                                name: 'idLocal',
                                id: 'input-local',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{"(Seleccione)"}</option>
                            {listLocales.map((row) => (
                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                            ))}
                        </Select>
                        <HelperText>{validate.idLocal && validation.idLocal.error ? validation.idLocal.message : ""}</HelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl required fullWidth error={validate.idTipo && validation.idTipo.error}>
                        <InputLabel htmlFor="input-tipo">Tipo</InputLabel>
                        <Select
                            native
                            // native={!listServicios.length == 0}
                            //defaultValue={0}
                            label="Tipo"
                            value={entity.idTipo}
                            onChange={(event, newValue) => {
                                dispatch(setData({name: "idTipo", value: event.target.value}))
                            }}
                            inputProps={{
                                name: 'idTipo',
                                id: 'input-tipo',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{"(Seleccione)"}</option>
                            {listTipos.map((row) => (
                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                            ))}
                        </Select>
                        <HelperText>{validate.idTipo && validation.idTipo.error ? validation.idTipo.message : ""}</HelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl required fullWidth error={validate.idModalidad && validation.idModalidad.error}>
                        <InputLabel htmlFor="input-modalidad">Modalidad</InputLabel>
                        <Select
                            native
                            // native={!listServicios.length == 0}
                            //defaultValue={0}
                            label="Modalidad"
                            value={entity.idModalidad}
                            onChange={(event, newValue) => {
                                dispatch(setData({name: "idModalidad", value: event.target.value}))
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
                        <HelperText>{validate.idModalidad && validation.idModalidad.error ? validation.idModalidad.message : ""}</HelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        required
                        type="number"
                        name="sesionesMes"
                        label="Sesiones Mes"
                        value={entity.sesionesMes}
                        fullWidth
                        onChange={(event) => {
                            dispatch(setData({name: "sesionesMes", value: event.target.value}))
                        }}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        required
                        type="number"
                        name="minutosSesion"
                        label="Minutos Sesion"
                        fullWidth
                        value={entity.minutosSesion}
                        onChange={(event) => {
                            dispatch(setData({name: "minutosSesion", value: event.target.value}))
                        }}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        required
                        type="number"
                        name="monto"
                        label="Monto"
                        inputProps={{
                          step: 0.01,
                        }}
                        fullWidth
                        value={entity.monto}
                        onChange={(event) => {
                            dispatch(setData({name: "monto", value: event.target.value}))
                        }}
                        size="small"
                    />
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
            </Grid>
        </Grid>
    );
}
export default Fee;
