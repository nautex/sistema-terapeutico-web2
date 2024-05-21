import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    filters: {
        member: "",
        relative: ""
    },
    results: [],
}

export const memberSearchSlice = createSlice({
    name: "memberSearch",
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

export const { setValue, setResults } = memberSearchSlice.actions;
export default memberSearchSlice.reducer;
