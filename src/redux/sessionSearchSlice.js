import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

const initialState = {
    filters: {
        idTerapeuta: 0,
        participante: "",
        idPeriodo: 0,
        fechaInicio: null,
        fechaFin: null,
        idEstado: 2,
    },
    listTerapeutas: [],
    listPeriodos: [],
    listEstados: [],
    results: [],
}

export const sessionSearchSlice = createSlice({
    name: "sessionSearch",
    initialState,
    reducers: {
        setValue: (state, action) => {
            const { name, value } = action.payload;

            state.filters[name] = value;
        },
        setResults: (state, action) => {
            state.results = action.payload;
        },
        setListTerapeutas: (state, action) => {
            state.listTerapeutas = action.payload;
        },
        setListPeriodos: (state, action) => {
            state.listPeriodos = action.payload;
        },
        setListEstados: (state, action) => {
            state.listEstados = action.payload;
        },
    },
});

export const { setValue, setResults
    , setListTerapeutas, setListPeriodos, setListEstados } = sessionSearchSlice.actions;
export default sessionSearchSlice.reducer;
