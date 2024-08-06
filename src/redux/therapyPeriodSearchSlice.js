import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filters: {
        idPeriodo: 0,
        idTipoTerapia: 0,
        participante: "",
        idTerapeuta: 0,
        terapeuta: "",
        idEstado: 2,
    },
    listPeriodos: [],
    listTiposTerapias: [],
    listEstados: [],
    results: [],
}

export const therapyPeriodSearchSlice = createSlice({
    name: "therapyPeriodSearch",
    initialState,
    reducers: {
        setValue: (state, action) => {
            const { name, value } = action.payload;

            state.filters[name] = value;
        },
        setResults: (state, action) => {
            state.results = action.payload;
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
    },
});

export const { setValue, setResults, setListPeriodos, setListTiposTerapias, setListEstados } = therapyPeriodSearchSlice.actions;
export default therapyPeriodSearchSlice.reducer;
