import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

const initialState = {
    defaultEntity: {
        id: 0,
        idLocal: 1,
        local: "Sede Principal",
        idTarifa: 0,
        codigoServicio: "",
        codigoTarifa: "",
        montoTarifa: 0,
        fechaInicio: moment().format('yyyy-MM-DD'),
        idTipo: 0,
        tipo: "",
        idModalidad: 0,
        modalidad: "",
        sesionesMes: 0,
        minutosSesion: 0,
        idSalon: 0,
        salon: "",
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
      idLocal: 1,
      local: "Sede Principal",
      idTarifa: 0,
      codigoServicio: "",
      codigoTarifa: "",
      montoTarifa: 0,
      fechaInicio: moment().format('yyyy-MM-DD'),
      idTipo: 0,
      tipo: "",
      idModalidad: 0,
      modalidad: "",
      sesionesMes: 0,
      minutosSesion: 0,
      idSalon: 0,
      salon: "",
      idEstado: 2,
      estado: "Activo",
      observaciones: "",
      fechaRegistro: null,
      usuarioRegistro: null,
      fechaModificacion: null,
      usuarioModificacion: null,
    },
    listLocales: [{id: 0, descripcion: ""}],
    listParticipantes: [{id: 0, descripcion: ""}],
    listSalones: [{id: 0, descripcion: ""}],
    listTipos: [{id: 0, descripcion: ""}],
    listEstados: [{id: 0, descripcion: ""}],
    validationActive: {
        local: false,
        codigoTarifa: false,
        fechaInicio: false,
        idTipo: false,
    },
    validationMessage: [],
  }
  
  export const therapySlice = createSlice({
    name: "therapy",
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
      setListLocales: (state, action) => {
        state.listLocales = action.payload;
      },
      setListParticipantes: (state, action) => {
        state.listParticipantes = action.payload;
      },
      setListSalones: (state, action) => {
        state.listSalones = action.payload;
      },
      setListTipos: (state, action) => {
        state.listTipos = action.payload;
      },
      setListEstados: (state, action) => {
        state.listEstados = action.payload;
      },
    },
  });
  
  export const { setEntity, setData, setValidationMessage, activeValidations
    , setListLocales, setListParticipantes, setListSalones, setListTipos, setListEstados } = therapySlice.actions;
  export default therapySlice.reducer;
  