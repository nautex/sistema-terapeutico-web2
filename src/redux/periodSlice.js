import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

const initialState = {
    defaultEntity: {
        id: 0,
        idTipoTerapia: 0,
        tipoTerapia: "",
        idTipoTerapiaPadre: 0,
        idCategoria: 0,
        categoria: "",
        generarCodigo: true,
        codigo: "",
        idEstadoApertura: 0,
        estadoApertura: "",
        fechaInicio: moment().format('yyyy-MM-DD'),
        fechaFin: moment().format('yyyy-MM-DD'),
        idEstado: 2,
        estado: "Activo",
        observaciones: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    },
    entity: {
      id: 0,
      idTipoTerapia: 0,
      tipoTerapia: "",
      idTipoTerapiaPadre: 0,
      idCategoria: 0,
      categoria: "",
      generarCodigo: true,
      codigo: "",
      idEstadoApertura: 0,
      estadoApertura: "",
      fechaInicio: moment().format('yyyy-MM-DD'),
      fechaFin: moment().format('yyyy-MM-DD'),
      idEstado: 2,
      estado: "Activo",
      observaciones: "",
      fechaRegistro: null,
      usuarioRegistro: null,
      fechaModificacion: null,
      usuarioModificacion: null,
    },
    listTiposTerapias: [{id: 0, descripcion: ""}],
    listCategorias: [{id: 0, descripcion: ""}],
    listEstadosApertura: [{id: 0, descripcion: ""}],
    listEstados: [{id: 0, descripcion: ""}],
    validationActive: {
        idTipoTerapia: false,
        codigo: false,
        fechaInicio: false,
    },
    validationMessage: [],
  }
  
  export const periodSlice = createSlice({
    name: "period",
    initialState,
    reducers: {
      setEntity: (state, action) => {
        state.entity = action.payload;
      },
      setData: (state, action) => {
        var { name, value } = action.payload;
  
        if (name.startsWith("id")) value = parseInt(value)
        
        state.entity[name] = value
        state.validationActive[name] = true
      },
      setValidationMessage: (state, action) => {
        state.validationMessage = action.payload;
      },
      activeValidations: (state, action) => {
        Object.keys(state.validationActive).forEach(function (key) {
          state.validationActive[key] = true;
        })
      },
      setListTiposTerapias: (state, action) => {
        state.listTiposTerapias = action.payload;
      },
      setListCategorias: (state, action) => {
        state.listCategorias = action.payload;
      },
      setListEstadosApertura: (state, action) => {
        state.listEstadosApertura = action.payload;
      },
      setListEstados: (state, action) => {
        state.listEstados = action.payload;
      },
    },
  });
  
  export const { setEntity, setData, setValidationMessage, activeValidations
    , setListTiposTerapias, setListCategorias, setListEstadosApertura, setListEstados } = periodSlice.actions;
  export default periodSlice.reducer;
  