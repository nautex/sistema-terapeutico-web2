import { FormControl, Grid, Select, Table, TableBody, TableCell, TableRow
    , TextField, Typography, IconButton, InputLabel, Box } from '@mui/material'
import { AddCircle as IconAddCircle, Delete as IconDelete } from "@mui/icons-material";
import axios from 'axios'
import { styled } from '@mui/material/styles';
import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
    add, remove, setData
    , setEntity, setTiposAlergias, setValidations
} from '../redux/memberAllergySlice'
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

const MemberAllergy = () => {
    const params = useParams();
    const entity = useSelector((state) => state.memberAllergy.entity)
    const tiposAlergias = useSelector((state) => state.memberAllergy.tiposAlergias)
    const defaultEntity = useSelector((state) => state.memberAllergy.defaultEntity)
    const [openDialogDelete, setOpenDialogDelete] = useState(false)
    const openCloseDialogDelete = () => { setOpenDialogDelete(!openDialogDelete); }
    const [selectNumero, setSelectNumero] = useState(null);
    const [selectId, setSelectId] = useState(null);
    const [numeroDocumentoFocus, setNumeroDocumentoFocus] = useState(null);
    // const [onlyOneTypeDocument, setOnlyOneTypeDocument] = useState(false);
    // const [numeroDocumentoExistente, setNumeroDocumentoExistente] = useState(false);
    // const [typeDocumentAlReadyExists, setTypeDocumentAlReadyExists] = useState("");
    // const [dniWith8Digits, setDNIWith8Digits] = useState(false);
    // const [anyDocumentAtLeast3Digits, setAnyDocumentAtLeast3Digits] = useState(false);
    const validate = useSelector((state) => state.memberAllergy.validationActive);
    const dispatch = useDispatch();
    const classes = useStyles();

    var validation = {
        // AtLeastOneDocument: {
        //     error: entity.length == 1
        //         // && entity[0].id == 0
        //         &&
        //         (
        //             entity[0].idTipoAlergia == 0
        //             || entity[0].detalle == ""
        //         ),
        //     message: "Debe haber por lo menos un documento",
        // },
        // DNIWith8Digits: {
        //     error: dniWith8Digits,
        //     message: "El DNI debe tener 8 digitos",
        // },
        // DocumentAlReadyExists: {
        //     error: numeroDocumentoExistente,
        //     message: "El número de documento " + typeDocumentAlReadyExists + " ya existe"
        // },
        // OnlyOneTypeDocument: {
        //     error: onlyOneTypeDocument,
        //     message: "Sólo puede existir 1 de cada tipo de documento"
        // },
        // AnyDocumentAtLeast3Digits: {
        //     error: anyDocumentAtLeast3Digits,
        //     message: "Un documento debe tener por lo menos 3 dígitos",
        // },
    }

    const setItemValue = (numero, name, value) => {
        dispatch(setData({numero: numero, name: name, value: value}))
    }

    const fecthEntity = async () => {
        const response = await axios
            .get("https://localhost:44337/Participante/GetsParticipanteAlergiaViewById?idParticipante=" + params.id)
            .catch((err) => {
                console.log("Err: ", err)
            });

        console.log(response.data.data)
        
        if (response.data.data == null || response.data.data.length == 0)
            dispatch(setEntity(defaultEntity));
        else
            dispatch(setEntity(response.data.data));
    }

    const fecthTiposAlergias = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=76")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setTiposAlergias(response.data.data));
    }, [])

    useEffect(() => {
        fecthEntity();
        fecthTiposAlergias();
    }, [])

    useEffect(() => {
        dispatch(setValidations(messagesValidation()));
    }, [entity])

    useEffect(() => {
        // validateUniqueDocumentTypes()
        // validateAnyDocumentAtLeast3Digits()
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
            .delete("https://localhost:44337/Participante/DeleteParticipanteAlergia?idParticipante="
                + params.id + "&numero=" + selectNumero)
            .catch((err) => {
                console.log("Err: ", err);
            });
        dispatch(remove(selectNumero));
    }
    
    return (
        <Grid container>
            <Grid item>
                <Box sx={{ fontWeight: 'bold' }} padding={0}>
                    <Typography variant="h7">
                        {"Alergias (" + (entity != null ? entity.length : 0) + ")"}
                    </Typography>
                </Box>
            </Grid>
            <Grid item>
                <IconButton size="small" aria-label="Agregar Alergia" style={{height: 10}} onClick={() => {
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
                                        <Grid item xs={8} sm={4}>
                                            <FormControl required fullWidth>
                                                <InputLabel htmlFor="input-tipoalergia">Tipo</InputLabel>
                                                <Select
                                                    //native={!tiposAlergias.length == 0}
                                                    native
                                                    //defaultValue={0}
                                                    label="Tipo"
                                                    value={row.idTipoAlergia}
                                                    fullWidth
                                                    onChange={(event, newValue) => {
                                                        // if (event.target.value !== row.idTipoAlergia && row.detalle.length >= 6) {
                                                        //     buscarDocumentoExistente(event.target.value, row.detalle)
                                                        // }

                                                        // validateDNIWith8Digits(event.target.value, row.detalle)

                                                        // if (event.target.value == 0) setNumeroDocumentoExistente(false)
                                                        // if (event.target.value == 0) setOnlyOneTypeDocument(false)
                                                        // if (event.target.value == 0) setDNIWith8Digits(false)

                                                        var id = event.nativeEvent.target.selectedIndex;

                                                        setItemValue(row.numero, "idTipoAlergia", event.target.value)
                                                        setItemValue(row.numero, "tipoAlergia", event.nativeEvent.target[id].text)
                                                        
                                                        // validateUniqueDocumentTypes()
                                                        // validateAnyDocumentAtLeast3Digits()
                                                    }}
                                                    inputProps={{
                                                        name: 'idTipoAlergia',
                                                        id: 'input-tipoalergia',
                                                    }}
                                                    size="small"
                                                >
                                                    <option key={0} value={0}>{"(Seleccione)"}</option>
                                                    {tiposAlergias.map((row) => (
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
                                        <Grid item xs={10} sm={6}>
                                            <TextField
                                                required
                                                name="detalle"
                                                label="Detalle"
                                                value={row.detalle}
                                                fullWidth
                                                onFocus={(event) => {
                                                    // setNumeroDocumentoFocus(event.target.value)
                                                }}
                                                onChange={(event) => {
                                                    setItemValue(row.numero, "detalle", event.target.value)

                                                    // validateUniqueDocumentTypes()
                                                    // validateDNIWith8Digits(row.idTipoAlergia, event.target.value)
                                                    // validateAnyDocumentAtLeast3Digits()
                                                }}
                                                onBlur={(event) => {
                                                    // if (row.idTipoAlergia > 0 && event.target.value.length >= 6 && event.target.value !== numeroDocumentoFocus) {
                                                    //     setTypeDocumentAlReadyExists(row.tipoAlergia)

                                                    //     buscarDocumentoExistente(row.idTipoAlergia, event.target.value)
                                                    // }
                                                    // else {
                                                    //     if (event.target.value.length < 6) setNumeroDocumentoExistente(false)
                                                    // }

                                                    // setItemValue(row.numero, "detalle", event.target.value)

                                                    // validateAnyDocumentAtLeast3Digits()
                                                    // dispatch(setValidations(messagesValidation()));
                                                }}
                                                size="small"
                                            // error={
                                            //     (validate.DocumentAlReadyExists && validation.DocumentAlReadyExists.error)
                                            //     || (validate.AnyDocumentAtLeast3Digits && validation.AnyDocumentAtLeast3Digits.error)
                                            // }
                                            // helperText={
                                            //     validate.DocumentAlReadyExists && validation.DocumentAlReadyExists.error ? validation.DocumentAlReadyExists.message : ""
                                            // }
                                            />
                                        </Grid>
                                        <Grid item xs={2} sm={2}>
                                            <IconButton aria-label="delete" size='small' onClick={() => {
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
                {/* <FormControl required fullWidth
                    error={
                        (validate.AtLeastOneDocument && validation.AtLeastOneDocument.error)
                        || (validate.OnlyOneTypeDocument && validation.OnlyOneTypeDocument.error)
                        || (validate.DNIWith8Digits && validation.DNIWith8Digits.error)
                        || (validate.AnyDocumentAtLeast3Digits && validation.AnyDocumentAtLeast3Digits.error)
                        || (validate.DocumentAlReadyExists && validation.DocumentAlReadyExists.error)
                    }>

                    <HelperText>
                        {validate.AtLeastOneDocument && validation.AtLeastOneDocument.error ? validation.AtLeastOneDocument.message : ""}
                    </HelperText>
                    <HelperText>
                        {validate.OnlyOneTypeDocument && validation.OnlyOneTypeDocument.error ? validation.OnlyOneTypeDocument.message : ""}
                    </HelperText>
                    <HelperText>
                        {validate.DNIWith8Digits && validation.DNIWith8Digits.error ? validation.DNIWith8Digits.message : ""}
                    </HelperText>
                    <HelperText>
                        {validate.AnyDocumentAtLeast3Digits && validation.AnyDocumentAtLeast3Digits.error ? validation.AnyDocumentAtLeast3Digits.message : ""}
                    </HelperText>
                    <HelperText>
                        {validate.DocumentAlReadyExists && validation.DocumentAlReadyExists.error ? validation.DocumentAlReadyExists.message : ""}
                    </HelperText>
                </FormControl> */}
            </Grid>
            <DialogYesNo
                open={openDialogDelete}
                openClose={openCloseDialogDelete}
                setYes={deleteEntity}
                setNo={() => { return }}
                titulo={"Borrar alergia"}
                texto={"Esta seguro de borrar la alergia?"}
            ></DialogYesNo>
        </Grid>
    )
}

export default MemberAllergy;
