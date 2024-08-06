import { FormControl, Grid, IconButton, InputLabel, Select, TextField
    , Typography, Stack, Box } from '@mui/material';
import { Search as IconSearch } from "@mui/icons-material";
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setEntity, setData, setValidationMessage, activeValidations
    , setListLocales, setListParticipantes, setListSalones, setListTipos, setListEstados } from "../redux/therapySlice";
import { FormHelperText as HelperText } from '@mui/material';
import FeeSearch from './FeeSearch';
// import { setListTipos } from '../redux/feeSearchSlice';

const Therapy = () => {
    const params = useParams();
    const entity = useSelector((state) => state.therapy.entity);
    const defaultEntity = useSelector((state) => state.therapy.defaultEntity);
    const listLocales = useSelector((state) => state.therapy.listLocales);
    const listSalones= useSelector((state) => state.therapy.listSalones);
    const listTipos= useSelector((state) => state.therapy.listTipos);
    const listEstados = useSelector((state) => state.therapy.listEstados);
    const validate = useSelector((state) => state.therapy.validationActive);
    const dispatch = useDispatch();
    const [openFeeSearch, setOpenFeeSearch] = useState(false);
    const fechaIngresoMinimo = new Date(2010, 1, 1);

    var validation = {
        local: {
            error: entity.local.length < 1,
            message: "Falta ingresar el local",
        },
        idTipo: {
            error: entity.idTipo < 1,
            message: "Falta ingresar el tipo de terapia",
        },
        codigoTarifa: {
            error: entity.codigoTarifa.length < 1,
            message: "Falta ingresar el codigo de tarifa",
        },
        fechaInicio: {
            error: Date.parse(entity.fechaInicio) < fechaIngresoMinimo,
            message: "Debe ser una fecha mayor al " + fechaIngresoMinimo.getFullYear(),
        },
    }
    const openCloseFeeSearch = () => { setOpenFeeSearch(!openFeeSearch); }

    const fetchEntity = async () => {
        const response = await axios
            .get("https://localhost:44337/Terapia/GetTerapiaView?idTerapia=" + params.id)
            .catch((err) => {
                console.log("Err: ", err);
            });

            console.log(response)

        if (response.data.data === null || response.data.data.length == 0){
            dispatch(setEntity(defaultEntity));
            fetchListSalones(1);
        }
        else {
            dispatch(setEntity(response.data.data));
            fetchListSalones(response.data.data.idLocal);
        }
    }
    const fetchListLocales = async () => {
        const response = await axios
            .get("https://localhost:44337/Local/GetsList")
            .catch((err) => {
                console.log("Err: ", err);
            });
        
        dispatch(setListLocales(response.data.data));
    }
    const fetchListParticipantes = async () => {
        const response = await axios
            .get("https://localhost:44337/Persona/GetsListPersonByTypeAndName?idType=24&name=")
            .catch((err) => {
                console.log("Err: ", err);
            });
        
        dispatch(setListParticipantes(response.data.data));
    }
    const fetchListSalones = async (idLocal) => {
        const response = await axios.get("https://localhost:44337/Salon/GetsListByIdLocal?idLocal=" + idLocal)
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setListSalones(response.data.data));
    }
    const fetchListTipos = async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=49")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setListTipos(response.data.data));
    }
    const fetchListEstados = async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=1")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setListEstados(response.data.data));
    }

    useEffect(() => {
        fetchEntity();
        fetchListLocales();
        fetchListParticipantes();
        fetchListTipos();
        fetchListEstados();
        dispatch(setValidationMessage(messagesValidation()));
    }, []);

    useEffect(() => {
        dispatch(setValidationMessage(messagesValidation()));
    }, [entity])

    var setDataEntity = e => {
        dispatch(setData(e.target));
    }
    const setSelectFeeSearch = (select) => {
        dispatch(setData({name: "idTarifa", value: parseInt(select.id)}))
        dispatch(setData({name: "codigoServicio", value: select.codigoServicio}))
        dispatch(setData({name: "codigoTarifa", value: select.codigo}))
        dispatch(setData({name: "tipo", value: select.tipo}))
        dispatch(setData({name: "modalidad", value: select.modalidad}))
        dispatch(setData({name: "sesionesMes", value: select.sesionesMes}))
        dispatch(setData({name: "minutosSesion", value: select.minutosSesion}))
        dispatch(setData({name: "montoTarifa", value: select.monto}))
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
                    <FormControl required fullWidth>
                        <InputLabel htmlFor="input-local">Local</InputLabel>
                        <Select
                            native
                            // native={!paises.length == 0}
                            //defaultValue={0}
                            label="Local"
                            value={entity.idLocal}
                            onChange={(event, newValue) => {
                                console.log(event)
                                console.log(newValue)
                                
                                var id = event.nativeEvent.target.selectedIndex;

                                dispatch(setListSalones([]));
                                dispatch(setData({name: "idLocal", value: event.target.value}))
                                dispatch(setData({name: "local", value: event.nativeEvent.target[id].text}))

                                if (event.target.value != null) {
                                    fetchListSalones(event.target.value)
                                }
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
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    {/* <TextField
                        disabled
                        name="tipo"
                        label="Tipo"
                        fullWidth
                        value={entity.tipo}
                        size="small"
                    /> */}
                    <FormControl required fullWidth error={validate.idTipo && validation.idTipo.error}>
                        <InputLabel htmlFor="input-tipo">Tipo</InputLabel>
                        <Select
                            //native={!tiposDocumentos.length == 0}
                            native
                            //defaultValue={0}
                            label="tipo"
                            value={entity.idTipo}
                            fullWidth
                            onChange={(event, newValue) => {
                                var id = event.nativeEvent.target.selectedIndex;

                                dispatch(setData({name: "idTipo", value: event.target.value}))
                                dispatch(setData({name: "tipo", value: event.nativeEvent.target[id].text}))
                            }}
                            inputProps={{
                                name: 'idTipo',
                                id: 'input-tipo',
                            }}
                            size="small"
                            // error={validate.idTipo && validation.idTipo.error}
                            // helperText={validate.idTipo && validation.idTipo.error ? validation.idTipo.message : ""}
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
                    <FormControl required fullWidth error={validate.codigoTarifa && validation.codigoTarifa.error}>
                        <Stack alignItems="center" direction="row" gap={2}>
                            <TextField
                                disabled
                                required
                                name="codigoTarifa"
                                label="Tarifa"
                                fullWidth
                                value={entity.codigoTarifa}
                                size="small"
                                // error={validate.codigoTarifa && validation.codigoTarifa.error}
                                // helperText={validate.codigoTarifa && validation.codigoTarifa.error ? validation.codigoTarifa.message : ""}
                            />
                            <IconButton aria-label="Buscar Tarifa" size='small' onClick={() => {
                                openCloseFeeSearch()
                            }}>
                                <IconSearch />
                            </IconButton>
                        </Stack>
                        <HelperText>{validate.codigoTarifa && validation.codigoTarifa.error ? validation.codigoTarifa.message : ""}</HelperText>
                    </FormControl>
                    {/* <Stack alignItems="center" direction="row" gap={2}>
                    </Stack> */}
                </Grid>
                <FeeSearch open={openFeeSearch} openClose={openCloseFeeSearch} setSelection={setSelectFeeSearch}
                    idServicioSelect={1} idTipoTerapiaSelect={entity.idTipo} servicioEnabled={0} tipoEnabled={0} />
                {/* <Grid item xs={6} sm={3}>
                    <TextField
                        disabled
                        name="modalidad"
                        label="Modalidad"
                        fullWidth
                        value={entity.modalidad}
                        size="small"
                    />
                </Grid> */}
                <Grid item xs={6} sm={3}>
                    <TextField
                        disabled
                        name="sesionesMes"
                        label="Sesiones Mes"
                        fullWidth
                        value={entity.sesionesMes}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        disabled
                        name="minutosSesion"
                        label="Minutos Sesion"
                        fullWidth
                        value={entity.minutosSesion}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        disabled
                        required
                        name="montoTarifa"
                        label="Monto Tarifa"
                        fullWidth
                        value={entity.montoTarifa}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        required
                        name="fechaInicio"
                        label="Fecha Inicio"
                        fullWidth
                        type="date"
                        //defaultValue={moment()}
                        value={moment(entity.fechaInicio).format('yyyy-MM-DD')}
                        onChange={setDataEntity}
                        error={validate.fechaInicio && validation.fechaInicio.error}
                        helperText={validate.fechaInicio && validation.fechaInicio.error ? validation.fechaInicio.message : ""}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="input-salon">Salon</InputLabel>
                        <Select
                            //native={!tiposDocumentos.length == 0}
                            native
                            //defaultValue={0}
                            label="Salon"
                            value={entity.idSalon}
                            fullWidth
                            onChange={(event, newValue) => {
                                dispatch(setData({name: "idSalon", value: event.target.value}))
                            }}
                            inputProps={{
                                name: 'idSalon',
                                id: 'input-salon',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{"(Seleccione)"}</option>
                            {listSalones.map((row) => (
                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl required fullWidth>
                        <InputLabel htmlFor="input-estado">Estado</InputLabel>
                        <Select
                            native
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
export default Therapy;
