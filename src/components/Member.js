import { FormControl, Grid, IconButton, TextField, Typography, Autocomplete
    , FormControlLabel, Checkbox, Box } from '@mui/material';
import { Search as IconSearch } from "@mui/icons-material";
import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setEntity, setData, setValidationMessage, activeValidations
    , setListParticipantes, setListTerapeutas } from "../redux/memberSlice";
import { FormHelperText as HelperText } from '@mui/material';
import DirectionSearch from './DirectionSearch';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    paddingTableCell: {
          "& .MuiCardContent-root": {
              padding: "5px 0px 0px 0px",
          },
    }
}));

const Member = () => {
    const params = useParams();
    const participante = useSelector((state) => state.member.participante);
    const listParticipantes = useSelector((state) => state.member.listParticipantes);
    // const listTerapeutas = useSelector((state) => state.member.listTerapeutas);
    const defaultParticipante = useSelector((state) => state.member.defaultParticipante);
    const validate = useSelector((state) => state.member.validationActive);
    const [openDirectionSearch, setOpenDirectionSearch] = useState(false)
    const openCloseDirectionSearch = () => { setOpenDirectionSearch(!openDirectionSearch); }
    const classes = useStyles();
    const dispatch = useDispatch();
    const fechaIngresoMinimo = new Date(2010, 1, 1);

    var validation = {
        participante: {
            error: participante.participante != null && participante.participante.length < 3,
            message: "Falta ingresar el participante",
        },
        // terapeuta: {
        //     error: participante.terapeuta.length < 3,
        //     message: "Falta ingresar el terapeuta",
        // },
        fechaIngreso: {
            error: Date.parse(participante.fechaIngreso) < fechaIngresoMinimo,
            message: "Debe ser una fecha mayor al " + fechaIngresoMinimo.getFullYear(),
        },
    }

    const fetchParticipante = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Participante/GetParticipanteViewById?idParticipante=" + params.id)
            .catch((err) => {
                console.log("Err: ", err);
            });

        if (response.data.data === null || response.data.data.length == 0)
            dispatch(setEntity(defaultParticipante));
        else
            dispatch(setEntity(response.data.data));
    }, [])
    const fetchListParticipantes = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Persona/GetsListPersonByTypeAndName?idType=24&name=")
            .catch((err) => {
                console.log("Err: ", err);
            });
        
        dispatch(setListParticipantes(response.data.data));
    }, [])
    // const fetchListTerapeutas = useCallback(async () => {
    //     const response = await axios
    //         .get("https://localhost:44337/Persona/GetsListPersonByTypeAndName?idType=25&name=")
    //         .catch((err) => {
    //             console.log("Err: ", err);
    //         });

    //     dispatch(setListTerapeutas(response.data.data));
    // }, [])

    useEffect(() => {
        fetchParticipante();
        fetchListParticipantes();
        // fetchListTerapeutas();
        dispatch(setValidationMessage(messagesValidation()));
    }, []);

    useEffect(() => {
        dispatch(setValidationMessage(messagesValidation()));
    }, [participante])

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
    const setSelectDirectionSearch = (select) => {
        dispatch(setData({name: "idDireccionCasoAccidente", value: select.id}));
        dispatch(setData({name: "ubigeoCasoAccidente", value: select.ubigeo}));
        dispatch(setData({name: "direccionCasoAccidente", value: select.detalle}));
    }

    return (
        <Grid container>
            {/* {JSON.stringify(validation)}
            {JSON.stringify(validate)} */}
            {/* {JSON.stringify(participante)} */}
            <Typography variant="h7" gutterBottom>
                <Box sx={{ fontWeight: 'bold' }} padding={1}>
                    Datos Basicos
                </Box>
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                    <FormControl required fullWidth error={validate.participante && validation.participante.error}>
                        <Autocomplete
                            // disabled={params.id == 0 ? false : true}
                            name="idPersona"
                            value={participante.idPersona == null ? 0 : participante.idPersona}
                            inputValue={participante.participante == null ? "" : participante.participante}
                            onInputChange={(event, newValue) => {
                                if (event != null) {
                                    if (event.type === "change") {
                                        dispatch(setData({name: "participante", value: newValue == null ? "" : newValue}))
                                    }
                                }
                            }}
                            onChange={(event, newValue) => {
                                dispatch(setData({name: "idPersona", value: newValue == null ? 0 : newValue.id}))
                                dispatch(setData({name: "participante", value: newValue == null ? "" : newValue.descripcion}))
                            }}
                            options={listParticipantes}
                            autoHighlight
                            getOptionLabel={(option) => option.descripcion == null ? "" : option.descripcion}
                            isOptionEqualToValue ={(option, value) => option.value === value.value}
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.id}>
                                    {option.descripcion}
                                    </li>
                                );
                                }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Participante"
                                    variant="outlined"
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                    }}
                                />
                            )}
                            size="small"
                        />
                        <HelperText>{validate.participante && validation.participante.error ? validation.participante.message : ""}</HelperText>
                    </FormControl>
                </Grid>
                {/* <Grid item xs={6} sm={3}>
                    <FormControl required fullWidth error={validate.terapeuta && validation.terapeuta.error}>
                        <Autocomplete
                            name="idTerapeuta"
                            value={participante.idTerapeuta == null ? 0 : participante.idTerapeuta}
                            inputValue={participante.terapeuta == null ? "" : participante.terapeuta}
                            onInputChange={(event, newValue) => {
                                if (event != null) {
                                    if (event.type === "change") {
                                        dispatch(setData({name: "terapeuta", value: newValue == null ? "" : newValue}))
                                    }
                                }
                            }}
                            onChange={(event, newValue) => {
                                dispatch(setData({name: "idTerapeuta", value: newValue == null ? 0 : newValue.id}))
                                dispatch(setData({name: "terapeuta", value: newValue == null ? "" : newValue.descripcion}))
                            }}
                            options={listTerapeutas}
                            autoHighlight
                            getOptionLabel={(option) => option.descripcion == null ? "" : option.descripcion}
                            isOptionEqualToValue ={(option, value) => option.value === value.value}
                            renderOption={(props, option) => {
                                return (
                                    <li {...props} key={option.id}>
                                    {option.descripcion}
                                    </li>
                                );
                                }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Terapeuta"
                                    variant="outlined"
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                    }}
                                />
                            )}
                            size="small"
                        />
                        <HelperText>{validate.terapeuta && validation.terapeuta.error ? validation.terapeuta.message : ""}</HelperText>
                    </FormControl>
                </Grid> */}
                <Grid item xs={6} sm={3}>
                    <TextField
                        required
                        name="fechaIngreso"
                        label="Fecha Ingreso"
                        fullWidth
                        type="date"
                        //defaultValue={moment()}
                        value={moment(participante.fechaIngreso).format('yyyy-MM-DD')}
                        onChange={setDataEntity}
                        error={validate.fechaIngreso && validation.fechaIngreso.error}
                        helperText={validate.fechaIngreso && validation.fechaIngreso.error ? validation.fechaIngreso.message : ""}
                        size="small"
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        name="detalleHermanos"
                        label="Hermanos"
                        fullWidth
                        value={participante.detalleHermanos}
                        onChange={setDataEntity}
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        required
                        name="lugarCasoAccidente"
                        label="Lugar Caso Accidente"
                        fullWidth
                        value={participante.lugarCasoAccidente}
                        onChange={setDataEntity}
                        size="small"
                    />
                </Grid>
                {/* <Grid item xs={6} sm={2}>
                    <TextField
                        disabled
                        name="ubigeoCasoAccidente"
                        label="Ubigeo"
                        value={participante.ubigeoCasoAccidente}
                        fullWidth
                        // onChange={(event) => {
                        //     dispatch(setData({name: "ubigeoCasoAccidente", value: event.target.value}));
                        // }}
                        size="small"
                    />
                </Grid> */}
                <Grid item xs={12} sm={4}>
                    <Grid container>
                        <Grid item xs={10} sm={10}>
                            <TextField
                                disabled
                                required
                                name="direccionCasoAccidente"
                                label="Direcccion"
                                value={participante.direccionCasoAccidente}
                                fullWidth
                                // onChange={(event) => {
                                //     setItemValue(row.numero, "direccionCasoAccidente", event.target.value);
                                // }}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={2} sm={2}>
                            <IconButton aria-label="Buscar Direccion" onClick={() => {
                                openCloseDirectionSearch()
                            }}>
                                <IconSearch />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <FormControlLabel control={
                        <Checkbox
                            name="tieneDiagnostico"
                            checked={participante.tieneDiagnostico}
                            onChange={(event, newValue) => {
                                console.log(event)
                                dispatch(setData({name: "tieneDiagnostico", value: event.target.checked}))
                            }}
                            size='small'
                        />
                        } label="Tiene Diagnostico" />    
                </Grid>
                {/* <Grid item xs={12} sm={3}>
                    <TextField
                        disabled
                        name="padre"
                        label="Padre"
                        fullWidth
                        value={participante.padre}
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={3}>
                    <TextField
                        disabled
                        name="madre"
                        label="Madre"
                        fullWidth
                        value={participante.madre}
                        size="small"
                    />
                </Grid> */}
            </Grid>
            <DirectionSearch open={openDirectionSearch} openClose={openCloseDirectionSearch} setSelection={setSelectDirectionSearch} />
        </Grid>
    );
}
export default Member;
