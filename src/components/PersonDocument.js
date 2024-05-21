import { FormControl, Grid, Select, Table, TableBody, TableCell, TableRow
    , TextField, Typography, IconButton, InputLabel, Box } from '@mui/material'
import { AddCircle as IconAddCircle, Delete as IconDelete } from "@mui/icons-material";
import axios from 'axios'
import { styled } from '@mui/material/styles';
import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
    addPersonaDocumento, removePersonaDocumento, setDatoPersonaDocumento
    , setPersonaDocumentos, setTiposDocumentos, setValidations
} from '../redux/personDocumentSlice'
import DialogYesNo from './DialogYesNo'
import { FormHelperText as HelperText } from '@mui/material';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    paddingTableCell: {
        "& .MuiTableCell-sizeSmall": {
            padding: "0px 0px 0px 0px"
          },
          "& .MuiGrid-root": {
              padding: "5px 0px 0px 0px",
          },
    }
}));

const PersonDocument = () => {
    const params = useParams();
    const personaDocumentos = useSelector((state) => state.personDocument.personaDocumentos)
    const tiposDocumentos = useSelector((state) => state.personDocument.tiposDocumentos)
    const defaultPersonaDocumentos = useSelector((state) => state.personDocument.defaultPersonaDocumentos)
    const [openDialogDelete, setOpenDialogDelete] = useState(false)
    const openCloseDialogDelete = () => { setOpenDialogDelete(!openDialogDelete); }
    const [selectNumero, setSelectNumero] = useState(null);
    const [selectId, setSelectId] = useState(null);
    const [numeroDocumentoFocus, setNumeroDocumentoFocus] = useState(null);
    const [onlyOneTypeDocument, setOnlyOneTypeDocument] = useState(false);
    const [numeroDocumentoExistente, setNumeroDocumentoExistente] = useState(false);
    const [typeDocumentAlReadyExists, setTypeDocumentAlReadyExists] = useState("");
    const [dniWith8Digits, setDNIWith8Digits] = useState(false);
    const [anyDocumentAtLeast3Digits, setAnyDocumentAtLeast3Digits] = useState(false);
    const validate = useSelector((state) => state.personDocument.validationActive);
    const dispatch = useDispatch();
    const classes = useStyles();

    var validation = {
        AtLeastOneDocument: {
            error: personaDocumentos.length == 1
                // && personaDocumentos[0].id == 0
                &&
                (
                    personaDocumentos[0].idTipoDocumento == 0
                    || personaDocumentos[0].numeroDocumento == ""
                ),
            message: "Debe haber por lo menos un documento",
        },
        DNIWith8Digits: {
            error: dniWith8Digits,
            message: "El DNI debe tener 8 digitos",
        },
        DocumentAlReadyExists: {
            error: numeroDocumentoExistente,
            message: "El número de documento " + typeDocumentAlReadyExists + " ya existe"
        },
        OnlyOneTypeDocument: {
            error: onlyOneTypeDocument,
            message: "Sólo puede existir 1 de cada tipo de documento"
        },
        AnyDocumentAtLeast3Digits: {
            error: anyDocumentAtLeast3Digits,
            message: "Un documento debe tener por lo menos 3 dígitos",
        },
    }

    const setItemValue = (numero, name, value) => {
        dispatch(setDatoPersonaDocumento({numero: numero, name: name, value: value}))
    }

    const fetchPersonaDocumentos = async () => {
        await axios
            .get("https://localhost:44337/Persona/GetPersonasDocumentosViewByIdPersona?idPersona=" + params.id)
            .then((response) => {
                if (response.data.data == null || response.data.data.length == 0){
                    dispatch(setPersonaDocumentos(defaultPersonaDocumentos));
                }
                else
                    dispatch(setPersonaDocumentos(response.data.data));
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
    }

    const fetchTiposDocumentos = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Catalogo/GetCatalogosByIdPadreInLista?idPadre=5")
            .catch((err) => {
                console.log("Err: ", err)
            });
        dispatch(setTiposDocumentos(response.data.data));
    }, [])

    useEffect(() => {
        fetchPersonaDocumentos();
        fetchTiposDocumentos();
    }, [])

    useEffect(() => {
        dispatch(setValidations(messagesValidation()));
    }, [personaDocumentos, numeroDocumentoExistente])

    useEffect(() => {
        validateUniqueDocumentTypes()
        validateAnyDocumentAtLeast3Digits()
    }, [personaDocumentos])

    const messagesValidation = () => {
        var messages = [];

        Object.keys(validation).forEach(function (key) {
            if (validation[key].error) messages.push(validation[key].message)
        })

        return messages;
    }

    const deletePersonaDocumento = async () => {
        await axios
            .delete("https://localhost:44337/Persona/DeletePersonaDocumento?idPersona="
                + params.id + "&numero=" + selectNumero)
            .catch((err) => {
                console.log("Err: ", err);
            });
        dispatch(removePersonaDocumento(selectNumero));
    }
    const buscarDocumentoExistente = (idTipoDocumento, numeroDocumento) => {
        axios.get("https://localhost:44337/PersonaDocumento/GetPersonaDocumentoByTipoYNumero?idTipoDocumento="
            + idTipoDocumento + "&numeroDocumento=" + numeroDocumento)
        .then(document => {
            setNumeroDocumentoExistente(document.data.data.length > 0);
        })
        .catch((err) => {
            console.log("Err: ", err)
        });
    }

    const validateDNIWith8Digits = (idTipoDocumento, numeroDocumento) => {
        setDNIWith8Digits(idTipoDocumento == 6 && numeroDocumento.length != 8)
    }

    const validateAnyDocumentAtLeast3Digits = () => {
        var countDocumentsWithLess3Digits = 0
        var DNIWithout8Digits = false

        for (let i = 0; i < personaDocumentos.length; i++) {
            var document = personaDocumentos[i];

            if (document.idTipoDocumento > 0 && document.numeroDocumento.length < 3) countDocumentsWithLess3Digits++;
            if (document.idTipoDocumento == 6 && document.numeroDocumento.length != 8) DNIWithout8Digits = true;
            // if (countDocumentsWithLess3Digits > 0) i = personaDocumentos.length
        }

        console.log(countDocumentsWithLess3Digits)

        setAnyDocumentAtLeast3Digits(!!countDocumentsWithLess3Digits)
        setDNIWith8Digits(DNIWithout8Digits)
    }

    const validateUniqueDocumentTypes = () => {
        var countDuplicateDocumentTypes = 0

        for (let i = 0; i < personaDocumentos.length; i++) {
            for (let j = i + 1; j < personaDocumentos.length; j++) {
                if (personaDocumentos[i].idTipoDocumento == personaDocumentos[j].idTipoDocumento) countDuplicateDocumentTypes++
                if (countDuplicateDocumentTypes > 0) j = personaDocumentos.length
            }
            if (countDuplicateDocumentTypes > 0) i = personaDocumentos.length
        }

        setOnlyOneTypeDocument(!!countDuplicateDocumentTypes)
    }

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(even)': {
            backgroundColor: theme.palette.action.selected,
            // backgroundColor: "gray",
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

    return (
        <Grid container>
            <Grid item>
                <Typography variant="h7">
                    <Box sx={{ fontWeight: 'bold' }} padding={0}>
                        {"Documentos (" + (personaDocumentos != null ? personaDocumentos.length : 0) + ")"}
                    </Box>
                </Typography>
            </Grid>
            <Grid item>
                <IconButton size="small" aria-label="Agregar Direccion" style={{height: 10}} onClick={() => {
                    dispatch(addPersonaDocumento(params.id));
                }}>
                    <IconAddCircle />
                </IconButton>
            </Grid>
            <Grid container>
                {/* {JSON.stringify(validation)} */}
                {/* {JSON.stringify(numeroDocumentoExistente)} */}
                <Table size="small" classes={{root: classes.paddingTableCell}}>
                    <TableBody>
                        {personaDocumentos.map((row) => (
                            <StyledTableRow key={row.numero}>
                                <TableCell>
                                    <Grid container spacing={1} padding={1}>
                                        <Grid item xs={8} sm={5}>
                                            <FormControl required fullWidth>
                                                <InputLabel htmlFor="input-tipodocumento">Tipo</InputLabel>
                                                <Select
                                                    //native={!tiposDocumentos.length == 0}
                                                    native
                                                    //defaultValue={0}
                                                    label="Tipo"
                                                    value={row.idTipoDocumento}
                                                    fullWidth
                                                    onChange={(event, newValue) => {
                                                        if (event.target.value !== row.idTipoDocumento && row.numeroDocumento.length >= 6) {
                                                            buscarDocumentoExistente(event.target.value, row.numeroDocumento)
                                                        }

                                                        validateDNIWith8Digits(event.target.value, row.numeroDocumento)

                                                        if (event.target.value == 0) setNumeroDocumentoExistente(false)
                                                        if (event.target.value == 0) setOnlyOneTypeDocument(false)
                                                        if (event.target.value == 0) setDNIWith8Digits(false)

                                                        var id = event.nativeEvent.target.selectedIndex;

                                                        setItemValue(row.numero, "idTipoDocumento", event.target.value)
                                                        setItemValue(row.numero, "tipoDocumento", event.nativeEvent.target[id].text)
                                                        
                                                        // validateUniqueDocumentTypes()
                                                        // validateAnyDocumentAtLeast3Digits()
                                                    }}
                                                    inputProps={{
                                                        name: 'idTipoDocumento',
                                                        id: 'input-tipodocumento',
                                                    }}
                                                    size="small"
                                                >
                                                    <option key={0} value={0}>{""}</option>
                                                    {tiposDocumentos.map((row) => (
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
                                                name="numeroDocumento"
                                                label="Numero"
                                                value={row.numeroDocumento}
                                                fullWidth
                                                onFocus={(event) => {
                                                    setNumeroDocumentoFocus(event.target.value)
                                                }}
                                                onChange={(event) => {
                                                    setItemValue(row.numero, "numeroDocumento", event.target.value)

                                                    // validateUniqueDocumentTypes()
                                                    validateDNIWith8Digits(row.idTipoDocumento, event.target.value)
                                                    // validateAnyDocumentAtLeast3Digits()
                                                }}
                                                onBlur={(event) => {
                                                    if (row.idTipoDocumento > 0 && event.target.value.length >= 6 && event.target.value !== numeroDocumentoFocus) {
                                                        setTypeDocumentAlReadyExists(row.tipoDocumento)

                                                        buscarDocumentoExistente(row.idTipoDocumento, event.target.value)
                                                    }
                                                    else {
                                                        if (event.target.value.length < 6) setNumeroDocumentoExistente(false)
                                                    }

                                                    setItemValue(row.numero, "numeroDocumento", event.target.value)

                                                    // validateAnyDocumentAtLeast3Digits()
                                                    dispatch(setValidations(messagesValidation()));
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
                                        <Grid item xs={2} sm={1}>
                                            <IconButton aria-label="delete" onClick={() => {
                                                if (row.idPersona > 0) {
                                                    setSelectId(row.id);
                                                    setSelectNumero(row.numero);
                                                    setOpenDialogDelete(true);
                                                }
                                                else {
                                                    dispatch(removePersonaDocumento(row.numero));
                                                }

                                            }}>
                                                <IconDelete />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                <FormControl required fullWidth
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
                </FormControl>
            </Grid>
            <DialogYesNo
                open={openDialogDelete}
                openClose={openCloseDialogDelete}
                setYes={deletePersonaDocumento}
                setNo={() => { return }}
                titulo={"Borrar documento"}
                texto={"Esta seguro de borrar el documento?"}
            ></DialogYesNo>
        </Grid>
    )
}

export default PersonDocument;
