import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

const initialState = {
    defaultEntity: {
        id: 0,
        idAreaObjetivo: 0,
        valor: 0,
        descripcion: "",
        orden: 0,
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    },
    entity: {
        id: 0,
        idAreaObjetivo: 0,
        valor: 0,
        descripcion: "",
        orden: 0,
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    },
    listAreaObjetivo: [{id: 0, codigo: "", nombre: "", descripcion: "", pregunta: "", ejemplo: ""}],
    validationActive: {
        idAreaObjetivo: false,
        descripcion: false,
    },
    validationMessage: [],
  }
  
  export const areaObjectiveCriterionSlice = createSlice({
    name: "areaObjectiveCriterion",
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
      setListAreaObjetivo: (state, action) => {
        state.listAreaObjetivo = action.payload;
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
    , setListAreaObjetivo
    } = areaObjectiveCriterionSlice.actions;
  export default areaObjectiveCriterionSlice.reducer;
  