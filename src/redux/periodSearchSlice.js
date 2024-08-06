import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filters: {
        idTipoTerapia: 0,
        idEstadoApertura: 0,
        mesesHaciaAtras: 0,
        idEstado: 2,
    },
    listTiposTerapias: [],
    listEstadosApertura: [],
    listEstados: [],
    results: [],
}

export const periodSearchSlice = createSlice({
    name: "periodSearch",
    initialState,
    reducers: {
        setValue: (state, action) => {
            const { name, value } = action.payload;

            state.filters[name] = value;
        },
        setResults: (state, action) => {
            state.results = action.payload;
        },
        setListTiposTerapias: (state, action) => {
            state.listTiposTerapias = action.payload;
        },
        setListEstadosApertura: (state, action) => {
            state.listEstadosApertura = action.payload;
        },
        setListEstados: (state, action) => {
            state.listEstados = action.payload;
        },
    },
});

export const { setValue, setResults, setListTiposTerapias
    , setListEstadosApertura, setListEstados } = periodSearchSlice.actions;
export default periodSearchSlice.reducer;
