import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    open: false,
    searchUbigeo: {
        idUbigeo: 0,
        codigo: "",
        descripcion: "",
        idProvincia: 0,
        provincia: "",
        idDepartamento: 0,
        departamento: "",
        idPais: 0,
        pais: ""
    },
    paises: [{ id: 0, descripcion: "" }],
    departamentos: [{ id: 0, descripcion: "" }],
    provincias: [{ id: 0, descripcion: "" }],
    ubigeos: [{ id: 0, descripcion: "" }],
    selectUbigeo: {},
    source: ""
}

export const ubigeoSearchSlice = createSlice({
    name: "ubigeoSearch",
    initialState,
    reducers: {
        setDato: (state, action) => {
            const { name, value } = action.payload;

            state.searchUbigeo[name] = value;
        },
        setPaises: (state, action) => {
            state.paises = action.payload;
            state.departamentos = [];
            state.provincias = [];
            state.ubigeos = [];
        },
        setDepartamentos: (state, action) => {
            state.departamentos = action.payload;
            state.provincias = [];
            state.ubigeos = [];
        },
        setProvincias: (state, action) => {
            state.provincias = action.payload;
            state.ubigeos = [];
        },
        setUbigeos: (state, action) => {
            state.ubigeos = action.payload;
        },
    },
});

export const { setDato, setPaises, setDepartamentos, setProvincias, setUbigeos } = ubigeoSearchSlice.actions;
export default ubigeoSearchSlice.reducer;
