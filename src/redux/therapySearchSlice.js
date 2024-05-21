import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filters: {
        idLocal: 0,
        member: "",
        therapist: ""
    },
    listLocales: [],
    results: [],
}

export const therapySearchSlice = createSlice({
    name: "therapySearch",
    initialState,
    reducers: {
        setValue: (state, action) => {
            const { name, value } = action.payload;

            state.filters[name] = value;
        },
        setResults: (state, action) => {
            state.results = action.payload;
        },
        setLocales: (state, action) => {
            state.listLocales = action.payload;
        }
    },
});

export const { setValue, setResults, setLocales } = therapySearchSlice.actions;
export default therapySearchSlice.reducer;
