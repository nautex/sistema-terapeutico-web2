import { FormControl, Grid, Select, Table, TableBody, TableCell, TableRow
    , TextField, Typography, IconButton, InputLabel, Autocomplete, Box } from '@mui/material'
import { AddCircle as IconAddCircle, Delete as IconDelete } from "@mui/icons-material";
import axios from 'axios'
import moment from 'moment';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setEntity, setData, add, remove, setTerapeutas, setTiposCargos, setEstados
    , setValidations, activeValidations
} from '../redux/therapyTherapistSlice'
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

const TherapyTherapist = () => {
    const params = useParams();
    const entity = useSelector((state) => state.therapyTherapist.entity)
    const defaultEntity = useSelector((state) => state.therapyTherapist.defaultEntity)
    const listTerapeutas = useSelector((state) => state.therapyTherapist.listTerapeutas)
    const listTiposCargos = useSelector((state) => state.therapyTherapist.listTiposCargos)
    const listEstados = useSelector((state) => state.therapyTherapist.listEstados)
    const [openDialogDelete, setOpenDialogDelete] = useState(false)
    const openCloseDialogDelete = () => { setOpenDialogDelete(!openDialogDelete); }
    const [selectNumero, setSelectNumero] = useState(null);
    const [selectId, setSelectId] = useState(null);
    const [numeroDocumentoFocus, setNumeroDocumentoFocus] = useState(null);
    const validate = useSelector((state) => state.therapyTherapist.validationActive);
    const dispatch = useDispatch();
    const classes = useStyles();

    var validation = {
        AtLeastOneRow: {
            error: entity.length == 1
                &&
                (
                    entity[0].idTerapeuta == 0
                    || entity[0].idTipoCargo == 0
                    || entity[0].fechaInicio == null
                ),
            message: "Debe haber por lo menos un terapeuta",
        },
    }

    const setItemValue = (numero, name, value) => {
        dispatch(setData({numero: numero, name: name, value: value}))
    }

    const fecthEntity = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Terapia/GetsTerapiaTerapeutaView?idTerapia=" + params.id)
            .catch((err) => {
                console.log("Err: ", err)
            });

            console.log(response)
        
        if (response.data.data == null || response.data.data.length == 0)
            dispatch(setEntity(defaultEntity));
        else
            dispatch(setEntity(response.data.data));
    }, [])
    const fetchTerapeutas = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Persona/GetsListPersonByTypeAndName?idType=25&name=")
            .catch((err) => {
                console.log("Err: ", err);
            });

        dispatch(setTerapeutas(response.data.data));
    }, [])
    const fetchTiposCargos = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=53")
            .catch((err) => {
                console.log("Err: ", err);
            });
        dispatch(setTiposCargos(response.data.data));
    }, [])
    const fetchEstados = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=1")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setEstados(response.data.data));
    }, [])

    useEffect(() => {
        fecthEntity();
        fetchTerapeutas();
        fetchTiposCargos();
        fetchEstados();
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
            .delete("https://localhost:44337/Terapia/DeleteTerapiaTerapeuta?idTerapia="
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
                        {"Terapeutas (" + (entity != null ? entity.length : 0) + ")"}
                    </Box>
                </Typography>
            </Grid>
            <Grid item>
                <IconButton size="small" aria-label="Agregar Terapeuta" style={{height: 10}} onClick={() => {
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
                                        <Grid item xs={12} sm={4} >
                                            <FormControl required fullWidth error={validate.terapeuta && validation.terapeuta.error}>
                                                <Autocomplete
                                                    name="idTerapeuta"
                                                    value={row.idTerapeuta == null ? 0 : row.idTerapeuta}
                                                    inputValue={row.terapeuta == null ? "" : row.terapeuta}
                                                    onInputChange={(event, newValue) => {
                                                        if (event != null) {
                                                            if (event.type === "change") {
                                                                setItemValue(row.numero, "terapeuta", newValue == null ? "" : newValue)
                                                            }
                                                        }
                                                    }}
                                                    onChange={(event, newValue) => {
                                                        setItemValue(row.numero, "idTerapeuta", newValue == null ? 0 : newValue.id)
                                                        setItemValue(row.numero, "terapeuta", newValue == null ? "" : newValue.descripcion)
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
                                        </Grid>
                                        <Grid item xs={6} sm={2}>
                                            <FormControl required fullWidth>
                                                <InputLabel htmlFor="input-tipocargo">Tipo Cargo</InputLabel>
                                                <Select
                                                    //native={!diasSemana.length == 0}
                                                    native
                                                    //defaultValue={0}
                                                    label="Tipo Cargo"
                                                    value={row.idTipoCargo}
                                                    fullWidth
                                                    onChange={(event, newValue) => {
                                                        var id = event.nativeEvent.target.selectedIndex;

                                                        setItemValue(row.numero, "idTipoCargo", event.target.value)
                                                        setItemValue(row.numero, "tipoCargo", event.nativeEvent.target[id].text)
                                                    }}
                                                    inputProps={{
                                                        name: 'idTipoCargo',
                                                        id: 'input-tipocargo',
                                                    }}
                                                    size="small"
                                                >
                                                    <option key={0} value={0}>{"(Seleccione)"}</option>
                                                    {listTiposCargos.map((row) => (
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
                                                name="fechaInicio"
                                                label="Fecha Inicio"
                                                fullWidth
                                                type="date"
                                                //defaultValue={moment()}
                                                value={moment(row.fechaInicio).format('yyyy-MM-DD')}
                                                onChange = {(e) => {setItemValue(row.numero, "fechaInicio", e.target.value)}}
                                                error={validate.fechaInicio && validation.fechaInicio.error}
                                                helperText={validate.fechaInicio && validation.fechaInicio.error ? validation.fechaInicio.message : ""}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
                                            <TextField
                                                name="fechaFin"
                                                label="Fecha Fin"
                                                fullWidth
                                                type="date"
                                                //defaultValue={moment()}
                                                value={moment(row.fechaFin).format('yyyy-MM-DD')}
                                                onChange = {(e) => {setItemValue(row.numero, "fechaFin", e.target.value == "" ? null : e.target.value)}}
                                                error={validate.fechaFin && validation.fechaFin.error}
                                                helperText={validate.fechaFin && validation.fechaFin.error ? validation.fechaFin.message : ""}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={4} sm={2}>
                                            <FormControl required fullWidth>
                                                <InputLabel htmlFor="input-estado">Estado</InputLabel>
                                                <Select
                                                    native
                                                    label="Estado"
                                                    value={row.idEstado}
                                                    fullWidth
                                                    onChange={(event, newValue) => {
                                                        var id = event.nativeEvent.target.selectedIndex;

                                                        setItemValue(row.numero, "idEstado", event.target.value)
                                                        setItemValue(row.numero, "estado", event.nativeEvent.target[id].text)
                                                    }}
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
                titulo={"Borrar terapeuta"}
                texto={"Esta seguro de borrar el terapeuta?"}
            ></DialogYesNo>
        </Grid>
    )
}

export default TherapyTherapist;
