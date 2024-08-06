import { FormControl, Grid, IconButton, InputLabel, Select, TextField
    , Typography, Stack, Box, Checkbox, FormControlLabel } from '@mui/material';
import { Search as IconSearch } from "@mui/icons-material";
import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setEntity, setData, setValidationMessage, activeValidations
    , setListTiposTerapias, setListCategorias, setListEstadosApertura, setListEstados } from "../redux/periodSlice";
import { FormHelperText as HelperText } from '@mui/material';

const Period = () => {
    const params = useParams();
    const entity = useSelector((state) => state.period.entity);
    const defaultEntity = useSelector((state) => state.period.defaultEntity);
    const listTiposTerapias = useSelector((state) => state.period.listTiposTerapias);
    const listCategorias= useSelector((state) => state.period.listCategorias);
    const listEstadosApertura= useSelector((state) => state.period.listEstadosApertura);
    const listEstados = useSelector((state) => state.period.listEstados);
    const validate = useSelector((state) => state.period.validationActive);
    const dispatch = useDispatch();
    const [openFeeSearch, setOpenFeeSearch] = useState(false);
    const fechaIngresoMinimo = new Date(2010, 1, 1);

    var validation = {
        idTipoTerapia: {
            error: entity.idTipoTerapia == 0 || entity.idTipoTerapia == null,
            message: "Falta ingresar el tipo de terapia",
        },
        codigo: {
            error: entity.codigo.length < 1,
            message: "Falta ingresar el codigo del periodo",
        },
        fechaInicio: {
            error: Date.parse(entity.fechaInicio) < fechaIngresoMinimo,
            message: "Debe ser una fecha mayor al " + fechaIngresoMinimo.getFullYear(),
        },
    }
    const openCloseFeeSearch = () => { setOpenFeeSearch(!openFeeSearch); }

    const fetchEntity = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Periodo/GetPeriodoView?idPeriodo=" + params.id)
            .catch((err) => {
                console.log("Err: ", err);
            });

        if (response.data.data === null || response.data.data.length == 0){
            dispatch(setEntity(defaultEntity));
        }
        else {
            response.data.data.generarCodigo = false;
            dispatch(setEntity(response.data.data));
        }
    }, [])
    const fetchListTiposTerapias = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=49")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setListTiposTerapias(response.data.data));
    }, [])
    const fetchListCategorias = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=66")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setListCategorias(response.data.data));
    }, [])
    const fetchListEstadosApertura = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=86")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setListEstadosApertura(response.data.data));
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
        fetchListTiposTerapias();
        fetchListCategorias();
        fetchListEstadosApertura();
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
    const getPeriodCode = (therapyType, date) => {
        console.log(date)

        date = moment(date).add(1, 'm').toDate()

        console.log(date)
        
        const year = new Date(date).getFullYear();
        const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
        const month = new Date(date).getMonth();

        console.log(month)

        //const codigoGenerado = Math.round(((year/100) - (year/100 | 0)) * 100) / 100 * 100

        return "T" + therapyType.substring(0, 1) + Math.round(((year/100) - (year/100 | 0)) * 100) / 100 * 100 + monthNames[month]
    }

    return (
        <Grid container>
            {/* {JSON.stringify(validation)}
            {JSON.stringify(validate)} */}
            {/* {JSON.stringify(entity)} */}
            <Typography variant="h7" gutterBottom>
                <Box sx={{ fontWeight: 'bold' }} padding={1}>
                    Datos Basicos
                </Box>
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                    <FormControl required fullWidth error={validate.idTipoTerapia && validation.idTipoTerapia.error}>
                        <InputLabel htmlFor="input-tipoterapia">Tipo Terapia</InputLabel>
                        <Select
                            native
                            label="Tipo Terapia"
                            value={entity.idTipoTerapia}
                            onChange={(event) => {
                                var id = event.nativeEvent.target.selectedIndex;
                                
                                dispatch(setData({name: "idTipoTerapia", value: event.target.value}))
                                dispatch(setData({name: "tipoTerapia", value: event.nativeEvent.target[id].text}))

                                if (entity.generarCodigo){
                                    dispatch(setData({name: "codigo", value: getPeriodCode(event.nativeEvent.target[id].text, entity.fechaInicio)}))
                                }
                            }}
                            inputProps={{
                                name: 'idTipoTerapia',
                                id: 'input-tipoterapia',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{"(Seleccione)"}</option>
                            {listTiposTerapias.map((row) => (
                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                            ))}
                        </Select>
                        <HelperText>
                            {validate.idTipoTerapia && validation.idTipoTerapia.error ? validation.idTipoTerapia.message : ""}
                        </HelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="input-categoria">Categoria</InputLabel>
                        <Select
                            native
                            label="Categoria"
                            value={entity.idCategoria}
                            onChange={setDataEntity}
                            inputProps={{
                                name: 'idCategoria',
                                id: 'input-categoria',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{"(Seleccione)"}</option>
                            {listCategorias.map((row) => (
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
                    <TextField
                        required
                        name="codigo"
                        label="Codigo"
                        fullWidth
                        value={entity.codigo}
                        onChange={setDataEntity}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControlLabel control={
                        <Checkbox
                            name="generarCodigo"
                            checked={entity.generarCodigo}
                            onChange={(event, newValue) => {
                                dispatch(setData({name: "generarCodigo", value: event.target.checked}))

                                if (event.target.checked){
                                    dispatch(setData({name: "codigo", value: getPeriodCode(entity.tipoTerapia, entity.fechaInicio)}))
                                }
                            }}
                            size='small'
                        />
                        } label={"Generar Codigo"} />
                </Grid>
                <Grid item xs={6} sm={3}>
                    {/* <FormControl required fullWidth error={validate.idEstado && validation.idEstado.error}> */}
                    <FormControl required fullWidth>
                        <InputLabel htmlFor="input-estadoapertura">Estado Apertura</InputLabel>
                        <Select
                            native
                            label="Estado Apertura"
                            value={entity.idEstadoApertura}
                            onChange={setDataEntity}
                            inputProps={{
                                name: 'idEstadoApertura',
                                id: 'input-estadoapertura',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{"(Seleccione)"}</option>
                            {listEstadosApertura.map((row) => (
                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                            ))}
                        </Select>
                        {/* <HelperText>{validate.idEstado && validation.idEstado.error ? validation.idEstado.message : ""}</HelperText> */}
                    </FormControl>
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
                        onChange={(event) => {
                            dispatch(setData({name: "fechaInicio", value: event.target.value}))
                            
                            if (entity.generarCodigo){
                                dispatch(setData({name: "codigo", value: getPeriodCode(entity.tipoTerapia, event.target.value)}))
                            }
                        }}
                        error={validate.fechaInicio && validation.fechaInicio.error}
                        helperText={validate.fechaInicio && validation.fechaInicio.error ? validation.fechaInicio.message : ""}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        required
                        name="fechaFin"
                        label="Fecha Fin"
                        fullWidth
                        type="date"
                        //defaultValue={moment()}
                        onChange={setDataEntity}
                        value={moment(entity.fechaFin).format('yyyy-MM-DD')}
                        // error={validate.fechaInicio && validation.fechaInicio.error}
                        // helperText={validate.fechaInicio && validation.fechaInicio.error ? validation.fechaInicio.message : ""}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    {/* <FormControl required fullWidth error={validate.idEstado && validation.idEstado.error}> */}
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
export default Period;
