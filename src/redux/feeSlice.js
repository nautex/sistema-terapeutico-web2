import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

const initialState = {
    defaultEntity: {
        id: 0,
        codigo: "",
        descripcion: "",
        idServicio: 0,
        codigoServicio: "",
        servicio: "",
        idLocal: 0,
        codigoLocal: "",
        local: "",
        idTipo: 0,
        tipo: "",
        idModalidad: 0,
        modalidad: "",
        sesionesMes: 0,
        minutosSesion: 0,
        monto: 0.00,
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
        codigo: "",
        descripcion: "",
        idServicio: 0,
        codigoServicio: "",
        servicio: "",
        idLocal: 0,
        codigoLocal: "",
        local: "",
        idTipo: 0,
        tipo: "",
        idModalidad: 0,
        modalidad: "",
        sesionesMes: 0,
        minutosSesion: 0,
        monto: 0.00,
        idEstado: 2,
        estado: "Activo",
        observaciones: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    },
    listServicios: [{id: 0, descripcion: ""}],
    listLocales: [{id: 0, descripcion: ""}],
    listTipos: [{id: 0, descripcion: ""}],
    listModalidades: [{id: 0, descripcion: ""}],
    listEstados: [{id: 0, descripcion: ""}],
    validationActive: {
        idServicio: false,
        idLocal: false,
        idTipo: false,
        idModalidad: false,
    },
    validationMessage: [],
  }
  
  export const feeSlice = createSlice({
    name: "fee",
    initialState,
    reducers: {
      setEntity: (state, action) => {
        state.entity = action.payload;
      },
      setData: (state, action) => {
        var { name, value } = action.payload;
  
        if (name.startsWith("id")) value = parseInt(value)
        if (name == "minutosSesion" || name == "sesionesMes") value = parseInt(value)
        if (name == "monto") value = parseFloat(value)
        
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
      setListServicios: (state, action) => {
        state.listServicios = action.payload;
      },
      setListLocales: (state, action) => {
        state.listLocales = action.payload;
      },
      setListTipos: (state, action) => {
        state.listTipos = action.payload;
      },
      setListModalidades: (state, action) => {
        state.listModalidades = action.payload;
      },
      setListEstados: (state, action) => {
        state.listEstados = action.payload;
      },
    },
  });
  
  export const { setEntity, setData, setValidationMessage, activeValidations
    , setListServicios, setListLocales, setListTipos, setListModalidades, setListEstados } = feeSlice.actions;
  export default feeSlice.reducer;
  