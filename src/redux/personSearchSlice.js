import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filters: {
        numeroDocumento: "",
        nombres: ""
    },
    results: [],
}

export const personSearchSlice = createSlice({
    name: "personSearch",
    initialState,
    reducers: {
        setValue: (state, action) => {
            const { name, value } = action.payload;

            state.filters[name] = value;
        },
        setResults: (state, action) => {
            state.results = action.payload;
        },
        
    },
});

export const { setValue, setResults } = personSearchSlice.actions;
export default personSearchSlice.reducer;
