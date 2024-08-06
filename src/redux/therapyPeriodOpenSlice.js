import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    input: {
        idPeriodo: 0,
        idTipoTerapia: 0,
        idEstado: 2,
    },
    listTerapiasParticipantes: [],
    // listTerapiasParticipantes: [{
    //     id: 0,
    //     idTerapia: 0,
    //     numero: 0,
    //     idTipoTerapia: 0,
    //     tipoTerapia: "",
    //     idTipoTerapiaPadre: 0,
    //     idEstadoTerapia: 0,
    //     estadoTerapia: "",
    //     idParticipante: 0,
    //     idPersona: 0,
    //     participante: "",
    //     terapeutas: "",
    //     idEstado: 2,
    //     estado: "Activo",
    //     estadoCreacion: "",
    // }],
    listPeriodos: [],
    listTiposTerapias: [],
    listEstados: [],
    validationActive: {
        idPeriodo: false,
        atLeastOneTherapy: false,
    },
    validationMessage: [],
}

export const therapyPeriodOpenSlice = createSlice({
    name: "therapyPeriodoOpen",
    initialState,
    reducers: {
        setValue: (state, action) => {
            var { name, value } = action.payload;

            if (name.startsWith("id")) value = parseInt(value)

            state.input[name] = value;
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
        setListTerapiasParticipantes: (state, action) => {
            state.listTerapiasParticipantes = action.payload;
        },
        setListPeriodos: (state, action) => {
            state.listPeriodos = action.payload;
        },
        setListTiposTerapias: (state, action) => {
            state.listTiposTerapias = action.payload;
        },
        setListEstados: (state, action) => {
            state.listEstados = action.payload;
        },
        setDataTerapiasParticipantes: (state, action) => {
          var { id, name, value } = action.payload;
  
          if (name.startsWith("id")) value = parseInt(value)
  
          const index = state.listTerapiasParticipantes.findIndex(item => item.id === id);
          state.listTerapiasParticipantes[index][name] = value;
        },
    },
});

export const { setValue, setListTerapiasParticipantes, setListPeriodos
    , setValidationMessage, activeValidations
    , setListTiposTerapias, setListEstados, setDataTerapiasParticipantes } = therapyPeriodOpenSlice.actions;
export default therapyPeriodOpenSlice.reducer;
