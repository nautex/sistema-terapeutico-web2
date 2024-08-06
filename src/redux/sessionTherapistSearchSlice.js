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
    nombreTerapeuta: "",
    listPeriodos: [],
    listTiposTerapias: [],
    listEstados: [],
    results: [],
}

export const sessionTherapistSearchSlice = createSlice({
    name: "sessionTherapistSearch",
    initialState,
    reducers: {
        setValue: (state, action) => {
            const { name, value } = action.payload;

            state.filters[name] = value;
        },
        setNombreTerapeuta: (state, action) => {
            state.nombreTerapeuta = action.payload;
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

export const { setValue, setNombreTerapeuta, setResults, setListPeriodos
    , setListTiposTerapias, setListEstados } = sessionTherapistSearchSlice.actions;
export default sessionTherapistSearchSlice.reducer;
