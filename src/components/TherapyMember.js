import { FormControl, Grid, Select, Table, TableBody, TableCell, TableRow
    , TextField, Typography, IconButton, InputLabel, Autocomplete, Box } from '@mui/material'
import { AddCircle as IconAddCircle, Delete as IconDelete } from "@mui/icons-material";
import axios from 'axios'
import moment from 'moment';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setEntity, setData, add, remove, setParticipantes, setEstados
    , setValidations, activeValidations
} from '../redux/therapyMemberSlice'
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

const TherapyMember = () => {
    const params = useParams();
    const entity = useSelector((state) => state.therapyMember.entity)
    const defaultEntity = useSelector((state) => state.therapyMember.defaultEntity)
    const listParticipantes = useSelector((state) => state.therapyMember.listParticipantes)
    const listEstados = useSelector((state) => state.therapyMember.listEstados)
    const [openDialogDelete, setOpenDialogDelete] = useState(false)
    const openCloseDialogDelete = () => { setOpenDialogDelete(!openDialogDelete); }
    const [selectNumero, setSelectNumero] = useState(null);
    const [selectId, setSelectId] = useState(null);
    const [numeroDocumentoFocus, setNumeroDocumentoFocus] = useState(null);
    const validate = useSelector((state) => state.therapyMember.validationActive);
    const dispatch = useDispatch();
    const classes = useStyles();

    var validation = {
        AtLeastOneRow: {
            error: entity.length == 1
                &&
                (
                    entity[0].idParticipante == 0
                ),
            message: "Debe haber por lo menos un participante",
        },
    }

    const setItemValue = (numero, name, value) => {
        dispatch(setData({numero: numero, name: name, value: value}))
    }

    const fecthEntity = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Terapia/GetsTerapiaParticipanteView?idTerapia=" + params.id)
            .catch((err) => {
                console.log("Err: ", err)
            });
        
        if (response.data.data == null || response.data.data.length == 0)
            dispatch(setEntity(defaultEntity));
        else
            dispatch(setEntity(response.data.data));
    }, [])
    const fetchParticipantes = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Participante/GetsParticipantesResumenView")
            .catch((err) => {
                console.log("Err: ", err);
            });
        
        dispatch(setParticipantes(response.data.data));
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
        fetchParticipantes();
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
            .delete("https://localhost:44337/Terapia/DeteleTerapiaParticipante?idTerapia="
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
                        {"Participantes (" + (entity != null ? entity.length : 0) + ")"}
                    </Box>
                </Typography>
            </Grid>
            <Grid item>
                <IconButton size="small" aria-label="Agregar Participante" style={{height: 10}} onClick={() => {
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
                                        <Grid item xs={12} sm={8} >
                                            <FormControl required fullWidth error={validate.participante && validation.participante.error}>
                                                <Autocomplete
                                                    name="idParticipante"
                                                    value={row.idParticipante == null ? 0 : row.idParticipante}
                                                    inputValue={row.participante == null ? "" : row.participante}
                                                    onInputChange={(event, newValue) => {
                                                        if (event != null) {
                                                            if (event.type === "change") {
                                                                setItemValue(row.numero, "participante", newValue == null ? "" : newValue)
                                                            }
                                                        }
                                                    }}
                                                    onChange={(event, newValue) => {
                                                        setItemValue(row.numero, "idParticipante", newValue == null ? 0 : newValue.id)
                                                        setItemValue(row.numero, "participante", newValue == null ? "" : newValue.participante)
                                                    }}
                                                    options={listParticipantes}
                                                    autoHighlight
                                                    getOptionLabel={(option) => option.participante == null ? "" : option.participante}
                                                    isOptionEqualToValue ={(option, value) => option.value === value.value}
                                                    renderOption={(props, option) => {
                                                        return (
                                                            <li {...props} key={option.id}>
                                                            {option.participante}
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
                                                <HelperText>{validate.terapeuta && validation.terapeuta.error ? validation.terapeuta.message : ""}</HelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={6} sm={3}>
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
                                        <Grid item xs={2} sm={1}>
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
                titulo={"Borrar participante"}
                texto={"Esta seguro de borrar el participante?"}
            ></DialogYesNo>
        </Grid>
    )
}

export default TherapyMember;
