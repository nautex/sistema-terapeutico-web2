import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

const initialState = {
    defaultEntity: {
        id: 0,
        idArea: 0,
        idDestreza: 0,
        codigo: "",
        nombre: "",
        descripcion: "",
        orden: 0,
        pregunta: "",
        ejemplo: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    },
    entity: {
        id: 0,
        idArea: 0,
        idDestreza: 0,
        codigo: "",
        nombre: "",
        descripcion: "",
        orden: 0,
        pregunta: "",
        ejemplo: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    },
    listArea: [{id: 0, codigo: "", nombre: "", descripcion: ""}],
    listDestreza: [{id: 0, codigo: "", nombre: "", descripcion: ""}],
    validationActive: {
        idArea: false,
        codigo: false,
        nombre: false,
    },
    validationMessage: [],
  }
  
  export const areaObjectiveSlice = createSlice({
    name: "areaObjective",
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
      setListArea: (state, action) => {
        state.listArea = action.payload;
      },
      setListDestreza: (state, action) => {
        state.listDestreza = action.payload;
      },
      setValidationMessage: (state, action) => {
        state.validationMessage = action.payload;
      },
      activeValidations: (state, action) => {
        Object.keys(state.validationActive).forEach(function (key) {
          state.validationActive[key] = true;
        })
      },
    },
  });
  
  export const { setEntity, setData, setValidationMessage, activeValidations
    , setListArea, setListDestreza
    } = areaObjectiveSlice.actions;
  export default areaObjectiveSlice.reducer;
  