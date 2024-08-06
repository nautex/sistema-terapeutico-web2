import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

const initialState = {
    defaultEntity: [{
        id: 0,
        numero: 0,
        idModelo: 0,
        codigoModelo: "",
        modelo: "",
        idArea: 0,
        codigoArea: "",
        area: "",
        orden: 0,
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,

        modeloArea: [{id: 0, codigo: "", nombre: "", descripcion: ""}],
    }],
    entity: [{
        id: 0,
        numero: 0,
        idModelo: 0,
        codigoModelo: "",
        modelo: "",
        idArea: 0,
        codigoArea: "",
        area: "",
        orden: 0,
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,

        modeloArea: [{id: 0, codigo: "", nombre: "", descripcion: ""}],
    }],
    listModelo: [{id: 0, codigo: "", nombre: "", descripcion: ""}],
    validationActive: {
      AtLeastOneRow: false,
    },
    validationMessage: [],
}

export const therapyPlanAreaSlice = createSlice({
    name: "therapyPlanArea",
    initialState,
    reducers: {
      setEntity: (state, action) => {
        state.entity = action.payload;

        if (state.entity !== initialState.defaultEntity){
          state.entity.forEach((row) => {
            const index = state.entity.findIndex(item => item.numero === row.numero);
            state.entity[index]["modeloArea"] = [{id: row.idArea, codigo: row.codigoArea, nombre: row.area, descripcion: ""}];
          })
        }
      },
      setData: (state, action) => {
        var { numero, name, value } = action.payload;

        if (name.startsWith("id") || name.startsWith("orden") || name.startsWith("valor")) value = parseInt(value)

        const index = state.entity.findIndex(item => item.numero === numero);
        state.entity[index][name] = value;

        Object.keys(state.validationActive).forEach(function (key) {
            state.validationActive[key] = true;
        })
      },
      add: (state, action) => {
        var maxNumero = state.entity.length === 0 ? 0 : Math.max.apply(null, state.entity.map((item) => { return item.numero; }))

        state.entity.push(state.defaultEntity.map((item) => { return { ...item, numero: maxNumero + 1 } })[0]);
      },
      remove: (state, action) => {
        state.entity = state.entity.filter(item => item.numero !== action.payload)
      },
      setListModelo: (state, action) => {
        state.listModelo = action.payload;
      },
      setValidations: (state, action) => {
        state.validationMessage = action.payload;
      },
      activeValidations: (state, action) => {
        Object.keys(state.validationActive).forEach(function (key) {
            state.validationActive[key] = true;
        })
      },
    },
  });
  
  export const { setEntity, setData, add, remove
    , setListModelo
    , setValidations, activeValidations } = therapyPlanAreaSlice.actions;
  export default therapyPlanAreaSlice.reducer;
  