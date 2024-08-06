import { FormControl, Grid, Select, Table, TableBody, TableCell, TableRow
    , TextField, Typography, IconButton, InputLabel, Autocomplete, Box } from '@mui/material'
import { AddCircle as IconAddCircle, Delete as IconDelete } from "@mui/icons-material";
import axios from 'axios'
import moment from 'moment';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setEntity, setData, add, remove
    , setListModelo
    , setValidations, activeValidations
} from '../redux/therapyPlanAreaSlice'
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

const TherapyPlanArea = () => {
    const params = useParams();
    const entity = useSelector((state) => state.therapyPlanArea.entity)
    const defaultEntity = useSelector((state) => state.therapyPlanArea.defaultEntity)
    const listModelo = useSelector((state) => state.therapyPlanArea.listModelo)
    const [openDialogDelete, setOpenDialogDelete] = useState(false)
    const openCloseDialogDelete = () => { setOpenDialogDelete(!openDialogDelete); }
    const [selectNumero, setSelectNumero] = useState(null);
    const [selectId, setSelectId] = useState(null);
    const [numeroDocumentoFocus, setNumeroDocumentoFocus] = useState(null);
    const validate = useSelector((state) => state.therapyPlanArea.validationActive);
    const dispatch = useDispatch();
    const classes = useStyles();

    var validation = {
        AtLeastOneRow: {
            error: entity.length == 1
                &&
                (
                    entity[0].idArea == 0
                ),
            message: "Debe haber por lo menos una area",
        },
    }

    const setItemValue = (numero, name, value) => {
        dispatch(setData({numero: numero, name: name, value: value}))
    }

    const fecthEntity = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/TerapiaPlan/GetsTerapiaPlanAreaView?idTerapiaPlan=" + params.id)
            .then((response) => {
                if (response.data.data == null || response.data.data.length == 0){
                    dispatch(setEntity(defaultEntity));
                }
                else {
                    dispatch(setEntity(response.data.data));
                }
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
    }, [])
    const fetchModelo = useCallback(async () => {
        const response = await axios
            .get("https://localhost:44337/Modelo/GetsModelo")
            .catch((err) => {
                console.log("Err: ", err);
            });

        dispatch(setListModelo(response.data.data));
    }, [])
    const setArea = useCallback(async (idModelo, numero) => {
        const response = await axios
            .get("https://localhost:44337/Modelo/GetsArea?idModelo=" + idModelo)
            .catch((err) => {
                console.log("Err: ", err);
            });
        setItemValue(numero, "modeloArea", response.data.data)
    }, [])
    useEffect(() => {
        fecthEntity();
        fetchModelo();
    }, [])

    useEffect(() => {
        dispatch(setValidations(messagesValidation()));
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
            .delete("https://localhost:44337/TerapiaPlan/DeleteTerapiaPlanArea?idTerapiaPlan="
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
                        {"Areas (" + (entity != null ? entity.length : 0) + ")"}
                    </Box>
                </Typography>
            </Grid>
            <Grid item>
                <IconButton size="small" aria-label="Agregar Area" style={{height: 10}} onClick={() => {
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
                                        <Grid item xs={12} sm={4}>
                                            <FormControl required fullWidth>
                                                <InputLabel htmlFor="input-modelo">Modelo</InputLabel>
                                                <Select
                                                    native
                                                    label="Modelo"
                                                    value={row.idModelo}
                                                    onChange={(event, newValue) => {
                                                        var id = event.nativeEvent.target.selectedIndex;
                                                        
                                                        setItemValue(row.numero, "idModelo", event.target.value)
                                                        setItemValue(row.numero, "modelo", event.nativeEvent.target[id].text)

                                                        if (event.target.value != null) {
                                                            setArea(event.target.value, row.numero)
                                                        }
                                                    }}
                                                    inputProps={{
                                                        name: 'idModelo',
                                                        id: 'input-modelo',
                                                    }}
                                                    size="small"
                                                >
                                                    <option key={0} value={0}>{"(Seleccione)"}</option>
                                                    {listModelo.map((row) => (
                                                        <option key={row.id} value={row.id}>{row.nombre}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={5}>
                                            <FormControl required fullWidth>
                                                <InputLabel htmlFor="input-area">Area</InputLabel>
                                                <Select
                                                    native
                                                    label="Area"
                                                    value={row.idArea}
                                                    onChange={(event, newValue) => {
                                                        var id = event.nativeEvent.target.selectedIndex;
                                                        
                                                        setItemValue(row.numero, "idArea", event.target.value)
                                                        setItemValue(row.numero, "area", event.nativeEvent.target[id].text)
                                                    }}
                                                    inputProps={{
                                                        name: 'idArea',
                                                        id: 'input-area',
                                                    }}
                                                    size="small"
                                                >
                                                    <option key={0} value={0}>{"(Seleccione)"}</option>
                                                    {row.modeloArea.map((childrow) => (
                                                        <option key={childrow.id} value={childrow.id}>{childrow.nombre}</option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={10} sm={2}>
                                            <TextField
                                                required
                                                name="orden"
                                                label="Orden"
                                                type="number"
                                                value={row.orden}
                                                fullWidth
                                                // onFocus={(event) => {
                                                    
                                                // }}
                                                onChange={(event) => {
                                                    setItemValue(row.numero, "orden", event.target.value)
                                                }}
                                                // onBlur={(event) => {
                                                // }}
                                                size="small"
                                                focused={row.orden && true}
                                            />
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
                titulo={"Borrar area"}
                texto={"Esta seguro de borrar el area?"}
            ></DialogYesNo>
        </Grid>
    )
}

export default TherapyPlanArea;
