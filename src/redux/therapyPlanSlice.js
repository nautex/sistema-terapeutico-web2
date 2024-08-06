import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

const initialState = {
    defaultEntity: {
        id: 0,
        idTerapia: 0,
        idTerapeuta: 0,
        terapeuta: "",
        idParticipante: 0,
        participante: "",
        idPeriodo: 0,
        codigoPeriodo: "",
        fechaInicioPeriodo: moment().format('yyyy-MM-DD'),
        fechaFinPeriodo: moment().format('yyyy-MM-DD'),
        fechaInicio: moment().format('yyyy-MM-DD'),
        idEstadoVigencia: 91,
        estadoVigencia: "Vigente",
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
        idTerapia: 0,
        idTerapeuta: 0,
        terapeuta: "",
        idParticipante: 0,
        participante: "",
        idPeriodo: 0,
        codigoPeriodo: "",
        fechaInicioPeriodo: moment().format('yyyy-MM-DD'),
        fechaFinPeriodo: moment().format('yyyy-MM-DD'),
        fechaInicio: moment().format('yyyy-MM-DD'),
        idEstadoVigencia: 0,
        estadoVigencia: "",
        idEstado: 2,
        estado: "Activo",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    },
    listPeriodo: [{id: 0, descripcion: ""}],
    listEstadoVigencia: [{id: 0, descripcion: ""}],
    listEstado: [{id: 0, descripcion: ""}],
    validationActive: {
        idPeriodo: false,
        fechaInicio: false,
        idEstadoVigencia: false,
    },
    validationMessage: [],
  }
  
  export const therapyPlanSlice = createSlice({
    name: "therapyPlan",
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
      setListPeriodo: (state, action) => {
        state.listPeriodo = action.payload;
      },
      setListEstadoVigencia: (state, action) => {
        state.listEstadoVigencia = action.payload;
      },
      setListEstado: (state, action) => {
        state.listEstado = action.payload;
      },
    },
  });
  
  export const { setEntity, setData, setValidationMessage, activeValidations
    , setListPeriodo, setListEstadoVigencia, setListEstado } = therapyPlanSlice.actions;
  export default therapyPlanSlice.reducer;
  