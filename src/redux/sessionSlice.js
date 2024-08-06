import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

const initialState = {
    defaultEntity: {
        id: 0,
        idTerapiaPeriodo: 0,
        idTerapia: 0,
        codigoPeriodo: "",
        participante: "",
        fecha: moment().format('yyyy-MM-DD'),
        horaInicio: "",
        idEstadoAsistencia: 59,
        estadoAsistencia: "Normal",
        idModalidad: 81,
        modalidad: "Presencial",
        idPuntuacionCriterio: 1,
        puntuacionCriterio: "",
        idPuntuacionActividad: 1,
        puntuacionActividad: "",
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
        idTerapiaPeriodo: 0,
        idTerapia: 0,
        codigoPeriodo: "",
        participante: "",
        fecha: moment().format('yyyy-MM-DD'),
        horaInicio: "",
        idEstadoAsistencia: 0,
        estadoAsistencia: "",
        idModalidad: 0,
        modalidad: "",
        idPuntuacionCriterio: 1,
        puntuacionCriterio: "",
        idPuntuacionActividad: 1,
        puntuacionActividad: "",
        idEstado: 0,
        estado: "",
        observaciones: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    },
    nombreTerapeuta: "",
    listEstadosAsistencia: [{id: 0, descripcion: ""}],
    listModalidades: [{id: 0, descripcion: ""}],
    listPuntuacionesCriterio: [{id: 0, descripcion: ""}],
    listPuntuacionesActividad: [{id: 0, descripcion: ""}],
    listEstados: [{id: 0, descripcion: ""}],
    validationActive: {
        fecha: false,
        horaInicio: false,
        idEstadoAsistencia: false,
    },
    validationMessage: [],
  }
  
  export const sessionSlice = createSlice({
    name: "session",
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
      setNombreTerapeuta: (state, action) => {
        state.nombreTerapeuta = action.payload;
      },
      setValidationMessage: (state, action) => {
        state.validationMessage = action.payload;
      },
      activeValidations: (state, action) => {
        Object.keys(state.validationActive).forEach(function (key) {
          state.validationActive[key] = true;
        })
      },
      setListEstadosAsistencia: (state, action) => {
        state.listEstadosAsistencia = action.payload;
      },
      setListModalidades: (state, action) => {
        state.listModalidades = action.payload;
      },
      setListPuntuacionesCriterio: (state, action) => {
        state.listPuntuacionesCriterio = action.payload;
      },
      setListPuntuacionesActividad: (state, action) => {
        state.listPuntuacionesActividad = action.payload;
      },
      setListEstados: (state, action) => {
        state.listEstados = action.payload;
      },
    },
  });
  
  export const { setEntity, setData, setValidationMessage, activeValidations
    , setListEstadosAsistencia, setListModalidades, setListPuntuacionesCriterio
    , setListPuntuacionesActividad, setListEstados, setNombreTerapeuta } = sessionSlice.actions;
  export default sessionSlice.reducer;
  