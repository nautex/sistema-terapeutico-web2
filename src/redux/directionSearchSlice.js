import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filters: {
        idUbigeo: 0,
        resumenUbigeo: "",
        detalle: ""
    },
    results: [],
}

export const directionSearchSlice = createSlice({
    name: "directionSearch",
    initialState,
    reducers: {
        setValueFilters: (state, action) => {
            const { name, value } = action.payload;

            state.filters[name] = value;
        },
        setResults: (state, action) => {
            state.results = action.payload;
        },
    },
});

export const { setValueFilters, setResults } = directionSearchSlice.actions;
export default directionSearchSlice.reducer;
