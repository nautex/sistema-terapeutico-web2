import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

const initialState = {
    defaultEntity: [{
        id: 0,
        numero: 0,
        idParticipante: 0,
        idPersona: 0,
        participante: "",
        idEstado: 2,
        estado: "Activo",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    }],
    entity: [{
        id: 0,
        numero: 0,
        idParticipante: 0,
        idPersona: 0,
        participante: "",
        idEstado: 2,
        estado: "Activo",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    }],
    listParticipantes: [{id: 0, descripcion: ""}],
    listEstados: [{id: 0, descripcion: ""}],
    validationActive: {
      AtLeastOneRow: false,
    },
    validationMessage: [],
}

export const therapyMemberSlice = createSlice({
    name: "therapyMember",
    initialState,
    reducers: {
      setEntity: (state, action) => {
        state.entity = action.payload;
      },
      setData: (state, action) => {
        var { numero, name, value } = action.payload;

        if (name.startsWith("id")) value = parseInt(value)

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
        state.validationActive.AtLeastOneRow = true
      },
      setParticipantes: (state, action) => {
        state.listParticipantes = action.payload;
      },
      setEstados: (state, action) => {
        state.listEstados = action.payload;
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
  
  export const { setEntity, setData, add, remove, setParticipantes, setEstados
    , setValidations, activeValidations } = therapyMemberSlice.actions;
  export default therapyMemberSlice.reducer;
  