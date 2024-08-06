import { FormControl, Grid, IconButton, InputLabel, Select, TextField, Typography, Box } from '@mui/material';
import { Search as IconSearch } from "@mui/icons-material";
import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setDatoPersonaNatural, setEstadosCiviles, setPersonaNatural, setSexos
    , setTiposPersona, setValidations } from "../redux/personSlice";
import UbigeoSearch from './UbigeoSearch';
import { FormHelperText as HelperText } from '@mui/material';

const PersonaNatural = () => {
    const params = useParams();
    const personaNatural = useSelector((state) => state.person.personaNatural);
    const defaultPersonaNatural = useSelector((state) => state.person.defaultPersonaNatural);
    const validate = useSelector((state) => state.person.validationActive);

    const sexos = useSelector((state) => state.person.sexos);
    const estadosCiviles = useSelector((state) => state.person.estadosCiviles);
    const tiposPersona = useSelector((state) => state.person.tiposPersona);
    const dispatch = useDispatch();
    const [openUbigeoSearch, setOpenUbigeoSearch] = useState(false)
    const fechaIngresoMinimo = new Date(2010, 1, 1);
    const fechaNacimientoMaximo = new Date();

    var validation = {
        primerNombre: {
            error: personaNatural.primerNombre != null && personaNatural.primerNombre.length < 3,
            message: "Falta ingresar el nombre",
        },
        primerApellido: {
            error: personaNatural.primerApellido != null && personaNatural.primerApellido.length < 3,
            message: "Falta ingresar el apellido",
        },
        idSexo: {
            error: personaNatural.idSexo === 0,
            message: "Falta ingresar el sexo",
        },
        idEstadoCivil: {
            error: personaNatural.idEstadoCivil === 0,
            message: "Falta ingresar el estado civil",
        },
        idTipoPersona: {
            error: personaNatural.idTipoPersona === 0,
            message: "Falta ingresar el tipo de persona",
        },
        fechaIngreso: {
            error: Date.parse(personaNatural.fechaIngreso) < fechaIngresoMinimo,
            message: "Debe ser una fecha mayor al " + fechaIngresoMinimo.getFullYear(),
        },
        fechaNacimiento: {
            error: Date.parse(personaNatural.fechaNacimiento) > fechaNacimientoMaximo,
            message: "Debe ser una fecha menor a hoy",
        },
    }
    const openCloseUbigeoSearch = () => { setOpenUbigeoSearch(!openUbigeoSearch); }

    const fetchPersonaNatural = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Persona/GetPersonaNaturalViewById?idPersona=" + params.id)
            .catch((err) => {
                console.log("Err: ", err);
            });

        if (params.id == 0)
            dispatch(setPersonaNatural(defaultPersonaNatural));
        else
            dispatch(setPersonaNatural(response.data.data));
    }, [])
    const fetchSexos = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=32")
            .catch((err) => {
                console.log("Err: ", err);
            });
        dispatch(setSexos(response.data.data));
    }, [])
    const fetchEstadosCiviles = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=35")
            .catch((err) => {
                console.log("Err: ", err);
            });
        dispatch(setEstadosCiviles(response.data.data));
    }, [])
    const fetchTiposPersona = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=22")
            .catch((err) => {
                console.log("Err: ", err);
            });
        dispatch(setTiposPersona(response.data.data));
    }, [])

    useEffect(() => {
        fetchPersonaNatural();
        fetchSexos();
        fetchEstadosCiviles();
        fetchTiposPersona();
        dispatch(setValidations(messagesValidation()));
    }, []);

    useEffect(() => {
        dispatch(setValidations(messagesValidation()));
    }, [personaNatural])

    var handleChangePersonaNatural = e => {
        dispatch(setDatoPersonaNatural(e.target));
    }
    const setSelectUbigeoSearch = (selectSearhUbigeo) => {
        console.log(selectSearhUbigeo)
        
        dispatch(setDatoPersonaNatural({name: "idUbigeoNacimiento", value: parseInt(selectSearhUbigeo.idUbigeo)}))
        dispatch(setDatoPersonaNatural({name: "ubigeoNacimiento", value: selectSearhUbigeo.descripcion}))
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
            {/* {JSON.stringify(personaNatural)} */}
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
                        name="primerNombre"
                        label="1er Nombre"
                        fullWidth
                        value={personaNatural.primerNombre}
                        onChange={handleChangePersonaNatural}
                        error={validate.primerNombre && validation.primerNombre.error}
                        helperText={validate.primerNombre && validation.primerNombre.error ? validation.primerNombre.message : ""}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        name="segundoNombre"
                        label="2do Nombre"
                        fullWidth
                        value={personaNatural.segundoNombre}
                        onChange={handleChangePersonaNatural}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        required
                        name="primerApellido"
                        label="1er Apellido"
                        fullWidth
                        value={personaNatural.primerApellido}
                        onChange={handleChangePersonaNatural}
                        error={validate.primerApellido && validation.primerApellido.error}
                        helperText={validate.primerApellido && validation.primerApellido.error ? validation.primerApellido.message : ""}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        name="segundoApellido"
                        label="2do Apellido"
                        fullWidth
                        value={personaNatural.segundoApellido}
                        onChange={handleChangePersonaNatural}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        required
                        name="fechaIngreso"
                        label="Fecha Ingreso"
                        fullWidth
                        type="date"
                        //defaultValue={moment()}
                        value={moment(personaNatural.fechaIngreso).format('yyyy-MM-DD')}
                        onChange={handleChangePersonaNatural}
                        error={validate.fechaIngreso && validation.fechaIngreso.error}
                        helperText={validate.fechaIngreso && validation.fechaIngreso.error ? validation.fechaIngreso.message : ""}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl required fullWidth error={validate.idSexo && validation.idSexo.error}>
                        <InputLabel htmlFor="input-sexo">Sexo</InputLabel>
                        <Select
                            //native={!sexos.length == 0}
                            native
                            //value={personaNatural.idSexo == null ? 33 : personaNatural.idSexo}
                            // defaultValue={0}
                            label="Sexo"
                            value={personaNatural.idSexo}
                            onChange={handleChangePersonaNatural}
                            inputProps={{
                                name: 'idSexo',
                                id: 'input-sexo',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{""}</option>
                            {sexos.map((row) => (
                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                            ))}
                        </Select>
                        <HelperText>{validate.idSexo && validation.idSexo.error ? validation.idSexo.message : ""}</HelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl required fullWidth error={validate.idEstadoCivil && validation.idEstadoCivil.error}>
                        <InputLabel htmlFor="input-estadocivil">Estado Civil</InputLabel>
                        <Select
                            //native={!estadosCiviles.length == 0}
                            native
                            //defaultValue={0}
                            label="Estado Civil"
                            value={personaNatural.idEstadoCivil}
                            onChange={handleChangePersonaNatural}
                            inputProps={{
                                name: 'idEstadoCivil',
                                id: 'input-estadocivil',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{""}</option>
                            {estadosCiviles.map((row) => (
                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                            ))}
                        </Select>
                        <HelperText>{validate.idEstadoCivil && validation.idEstadoCivil.error ? validation.idEstadoCivil.message : ""}</HelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <FormControl required fullWidth error={validate.idTipoPersona && validation.idTipoPersona.error}>
                        <InputLabel htmlFor="input-tipopersona">Tipo Persona</InputLabel>
                        <Select
                            // native={!tiposPersona.length == 0}
                            native
                            //defaultValue={0}
                            label="Tipo Persona"
                            value={personaNatural.idTipoPersona}
                            fullWidth
                            onChange={handleChangePersonaNatural}
                            inputProps={{
                                name: 'idTipoPersona',
                                id: 'input-tipopersona',
                            }}
                            size="small"
                        >
                            <option key={0} value={0}>{""}</option>
                            {tiposPersona.map((row) => (
                                <option key={row.id} value={row.id}>{row.descripcion}</option>
                            ))}
                        </Select>
                        <HelperText>{validate.idTipoPersona && validation.idTipoPersona.error ? validation.idTipoPersona.message : ""}</HelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        required
                        name="fechaNacimiento"
                        label="Fecha Nac."
                        fullWidth
                        type="date"
                        value={moment(personaNatural.fechaNacimiento).format('yyyy-MM-DD')}
                        onChange={handleChangePersonaNatural}
                        error={validate.fechaNacimiento && validation.fechaNacimiento.error}
                        helperText={validate.fechaNacimiento && validation.fechaNacimiento.error ? validation.fechaNacimiento.message : ""}
                        size="small"
                    />
                </Grid>
                <Grid item xs={10} sm={3}>
                    <TextField
                        name="ubigeoNacimiento"
                        label="Ubigeo"
                        fullWidth
                        value={personaNatural.ubigeoNacimiento}
                        onChange={handleChangePersonaNatural}
                        disabled
                        size="small"
                    />
                </Grid>
                <Grid item xs={2} sm={2}>
                    <IconButton aria-label="Buscar Ubigeo" size='small' onClick={() => {
                        openCloseUbigeoSearch()
                    }}>
                        <IconSearch />
                    </IconButton>
                </Grid>
            </Grid>
            <UbigeoSearch open={openUbigeoSearch} openClose={openCloseUbigeoSearch} setSelection={setSelectUbigeoSearch} />
        </Grid>
    );
}
export default PersonaNatural;
