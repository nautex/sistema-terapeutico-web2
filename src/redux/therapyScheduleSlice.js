import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    defaultEntity: [{
        id: 0,
        numero: 0,
        diaSemana: 1,
        dia: "Lunes",
        horaInicio: "",
        horaFin: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    }],
    entity: [{
        id: 0,
        numero: 0,
        diaSemana: 1,
        dia: "Lunes",
        horaInicio: "",
        horaFin: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    }],
    diasSemana: [
        {id: 0, descripcion: "Domingo"},
        {id: 1, descripcion: "Lunes"},
        {id: 2, descripcion: "Martes"},
        {id: 3, descripcion: "Miercoles"},
        {id: 4, descripcion: "Jueves"},
        {id: 5, descripcion: "Viernes"},
        {id: 6, descripcion: "Sabado"},
    ],
    validationActive: {
      AtLeastOneRow: false,
    },
    validationMessage: [],
}

export const therapyScheduleSlice = createSlice({
    name: "therapySchedule",
    initialState,
    reducers: {
      setEntity: (state, action) => {
        state.entity = action.payload;
      },
      setData: (state, action) => {
        var { numero, name, value } = action.payload;

        if (name.startsWith("id") || name == "diaSemana") value = parseInt(value)

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
  
  export const { setEntity, setData
    , add, remove, setValidations, activeValidations } = therapyScheduleSlice.actions;
  export default therapyScheduleSlice.reducer;
  