import React, { useCallback, useEffect } from 'react';
import axios from 'axios';
import { setDato, setPaises, setDepartamentos, setProvincias, setUbigeos } from "../redux/ubigeoSearchSlice";
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography, TextField, Autocomplete, Button, Dialog, DialogActions
    , DialogContent, DialogTitle, Select, InputLabel, FormControl } from '@mui/material';

const UbigeoSearch = (props) => {
    const searchUbigeo = useSelector((state) => state.ubigeoSearch.searchUbigeo);
    const paises = useSelector((state) => state.ubigeoSearch.paises);
    const departamentos = useSelector((state) => state.ubigeoSearch.departamentos);
    const provincias = useSelector((state) => state.ubigeoSearch.provincias);
    const ubigeos = useSelector((state) => state.ubigeoSearch.ubigeos);
    const dispatch = useDispatch();

    const fetchPaises = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/UbigeoView/GetPaises")
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setPaises(response.data.data));
    }, [])
    const fetchDepartamentos = useCallback(async (idPais) => {
        const response = await axios
            .get("https://localhost:44337/UbigeoView/GetDepartamentosByIdPais?idPais=" + idPais)
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setDepartamentos(response.data.data));
    }, [])
    const fetchProvincias = useCallback(async (idDepartamento) => {
        const response = await axios
            .get("https://localhost:44337/UbigeoView/GetProvinciasByIdDepartamento?idDepartamento=" + idDepartamento)
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setProvincias(response.data.data));
    }, [])
    const fetchUbigeos = useCallback(async (idProvincia) => {
        const response = await axios
            .get("https://localhost:44337/UbigeoView/GetUbigeosByIdProvincia?idProvincia=" + idProvincia)
            .catch((err) => {
                console.log("Err: ", err)
            });

        dispatch(setUbigeos(response.data.data));
    }, [])

    useEffect(() => {
        fetchPaises();
    }, [])

    return (
        <Dialog
            open={props.open}
            onClose={props.openClose}
            fullWidth={true}
            maxWidth={"xl"}
        >
            <DialogTitle>
                <Typography>
                    Buscar Ubigeo
                    {/* {JSON.stringify(searchUbigeo)} */}
                </Typography>
            </DialogTitle>
            <DialogContent style={{ minHeight: "30px", maxHeight: "250px" }} >
                <Grid container item xs={12} sm={12} spacing={2} padding={1} >
                    <Grid item xs={12} sm={3}>
                        <FormControl required fullWidth>
                            <InputLabel htmlFor="input-pais">Pais</InputLabel>
                            <Select
                                native
                                // native={!paises.length == 0}
                                //defaultValue={0}
                                label="Pais"
                                value={searchUbigeo.idPais}
                                onChange={(event, newValue) => {
                                    dispatch(setDepartamentos([]));
                                    dispatch(setProvincias([]));
                                    dispatch(setUbigeos([]));
                                    dispatch(setDato({name: "departamento", value: ""}))
                                    dispatch(setDato({name: "provincia", value: ""}))
                                    dispatch(setDato({name: "descripcion", value: ""}))
                                    dispatch(setDato({name: "idPais", value: event.target.value}))

                                    if (event.target.value != null) {
                                        fetchDepartamentos(event.target.value)
                                    }
                                }}
                                inputProps={{
                                    name: 'idPais',
                                    id: 'input-pais',
                                }}
                                size="small"
                            >
                                <option key={0} value={0}>{"(Seleccione)"}</option>
                                {paises.map((row) => (
                                    <option key={row.id} value={row.id}>{row.descripcion}</option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            name="idDepartamento"
                            value={searchUbigeo.idDepartamento == null ? 0 : searchUbigeo.idDepartamento}
                            inputValue={searchUbigeo.departamento == null ? "" : searchUbigeo.departamento}
                            onInputChange={(event, newValue) => {
                                if (event != null) {
                                    if (event.type === "change") {
                                        dispatch(setDato({name: "departamento", value: newValue == null ? "" : newValue}))
                                    }
                                }
                            }}
                            onChange={(event, newValue) => {
                                dispatch(setProvincias([]))
                                dispatch(setUbigeos([]))
                                dispatch(setDato({name: "provincia", value: ""}))
                                dispatch(setDato({name: "descripcion", value: ""}))
                                dispatch(setDato({name: "idDepartamento", value: newValue == null ? 0 : newValue.id}))
                                dispatch(setDato({name: "departamento", value: newValue == null ? "" : newValue.descripcion}))

                                if (newValue != null)
                                    fetchProvincias(newValue.id)
                            }}
                            options={departamentos}
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
                                    label="Departamento"
                                    variant="outlined"
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                    }}
                                />
                            )}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            name="idProvincia"
                            value={searchUbigeo.idProvincia == null ? 0 : searchUbigeo.idProvincia}
                            inputValue={searchUbigeo.provincia == null ? "" : searchUbigeo.provincia}
                            onInputChange={(event, newValue) => {
                                if (event != null) {
                                    if (event.type === "change") {
                                        dispatch(setDato({name: "provincia", value: newValue == null ? "" : newValue}))
                                    }
                                }
                            }}
                            onChange={(event, newValue) => {
                                dispatch(setUbigeos([]))
                                dispatch(setDato({name: "descripcion", value: ""}))
                                dispatch(setDato({name: "idProvincia", value: newValue == null ? 0 : newValue.id}))
                                dispatch(setDato({name: "provincia", value: newValue == null ? "" : newValue.descripcion}))

                                if (newValue != null)
                                    fetchUbigeos(newValue.id)
                            }}
                            options={provincias}
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
                                    label="Provincia"
                                    variant="outlined"
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                    }}
                                />
                            )}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Autocomplete
                            name="idUbigeo"
                            value={searchUbigeo.idUbigeo == null ? 0 : searchUbigeo.idUbigeo}
                            inputValue={searchUbigeo.descripcion == null ? "" : searchUbigeo.descripcion}
                            onInputChange={(event, newValue) => {
                                if (event != null) {
                                    if (event.type === "change") {
                                        dispatch(setDato({name: "descripcion", value: newValue == null ? "" : newValue}))
                                    }
                                }
                            }}
                            onChange={(event, newValue) => {
                                dispatch(setDato({name: "idUbigeo", value: newValue == null ? 0 : newValue.id}))
                                dispatch(setDato({name: "descripcion", value: newValue == null ? "" : newValue.descripcion}))
                            }}
                            options={ubigeos}
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
                                    label="Ubigeo"
                                    variant="outlined"
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                    }}
                                />
                            )}
                            size="small"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => {
                    props.setSelection(searchUbigeo);
                    props.openClose()
                }}>Aceptar</Button>
                <Button onClick={() => { props.openClose() }} >Cancelar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default UbigeoSearch;
