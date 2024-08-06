import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filters: {
        idLocal: 0,
        member: "",
        therapist: "",
        idEstadoVigencia: 0, //91,
        idEstado: 2,
    },
    listLocal: [],
    listEstadoVigencia: [],
    listEstado: [],
    results: [],
}

export const therapyPlanSearchSlice = createSlice({
    name: "therapyPlanSearch",
    initialState,
    reducers: {
        setValue: (state, action) => {
            const { name, value } = action.payload;

            state.filters[name] = value;
        },
        setResult: (state, action) => {
            state.results = action.payload;
        },
        setListLocal: (state, action) => {
            state.listLocal = action.payload;
        },
        setListEstadoVigencia: (state, action) => {
            state.listEstadoVigencia = action.payload;
        },
        setListEstado: (state, action) => {
            state.listEstado = action.payload;
        },
    },
});

export const { setValue, setResults
    , setListLocal, setListEstadoVigencia, setListEstado } = therapyPlanSearchSlice.actions;
export default therapyPlanSearchSlice.reducer;
