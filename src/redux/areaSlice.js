import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

const initialState = {
    defaultEntity: {
        id: 0,
        idModelo: 0,
        codigo: "",
        nombre: "",
        descripcion: "",
        orden: 0,
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    },
    entity: {
        id: 0,
        idModelo: 0,
        codigo: "",
        nombre: "",
        descripcion: "",
        orden: 0,
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    },
    listModelo: [{id: 0, codigo: "", nombre: "", descripcion: ""}],
    validationActive: {
        idModelo: false,
        codigo: false,
        nombre: false,
    },
    validationMessage: [],
  }
  
  export const areaSlice = createSlice({
    name: "area",
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
      setListModelo: (state, action) => {
        state.listModelo = action.payload;
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
    , setListModelo
    } = areaSlice.actions;
  export default areaSlice.reducer;
  