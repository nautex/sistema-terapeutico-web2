import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    open: false,
    filters: {
        idServicio: 0,
        idLocal: 0,
        idTipo: 0,
        sesionesMes: 0,
        idEstado: 2,
    },
    results: [],
    // results: {
    //     id: 0,
    //     codigo: "",
    //     descripcion: "",
    //     idServicio: 0,
    //     codigoServicio: "",
    //     idLocal: 0,
    //     local: "",
    //     idModalidad: 0,
    //     modalidad: "",
    //     sesionesMes: 0,
    //     minutosSesion: 0,
    //     monto: 0,
    //     idEstado: 0,
    //     estado: "",
    //     fechaRegistro: null,
    //     usuarioRegistro: null,
    //     fechaModificacion: null,
    //     usuarioModificacion: null,
    // },
    listServicios: [{ id: 0, descripcion: "" }],
    listLocales: [{ id: 0, descripcion: "" }],
    listTipos: [{ id: 0, descripcion: "" }],
    listModalidades: [{ id: 0, descripcion: "" }],
    listEstados: [{ id: 0, descripcion: "" }],
    select: {},
    source: ""
}

export const feeSearchSlice = createSlice({
    name: "feeSearch",
    initialState,
    reducers: {
        setData: (state, action) => {
            const { name, value } = action.payload;

            state.filters[name] = value;
        },
        setResults: (state, action) => {
            state.results = action.payload;
        },
        setListServicios: (state, action) => {
            state.listServicios = action.payload;
        },
        setListLocales: (state, action) => {
            state.listLocales = action.payload;
        },
        setListTipos: (state, action) => {
            state.listTipos = action.payload;
        },
        setListModalidades: (state, action) => {
            state.listModalidades = action.payload;
        },
        setListEstados: (state, action) => {
            state.listEstados = action.payload;
        },
    },
});

export const { setData, setResults
    , setListServicios, setListLocales, setListTipos, setListModalidades, setListEstados } = feeSearchSlice.actions;
export default feeSearchSlice.reducer;
