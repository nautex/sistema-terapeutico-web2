import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    defaultPersonaDirecciones: [{
        id: 0,
        idPersona: 0,
        numero: 0,
        idTipoDireccion: 39,
        tipoDireccion: "Domicilio",
        idDireccion: 0,
        idUbigeo: 230101,
        codigoUbigeo: "230101",
        resumenUbigeo: "TACNA",
        detalle: "",
        referencia: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    }],
    tiposDirecciones: [{ id: 0, descripcion: "" }],
    personaDirecciones: [{
        id: 0,
        idPersona: 0,
        numero: 0,
        idTipoDireccion: 0,
        tipoDireccion: "",
        idDireccion: 0,
        idUbigeo: 0,
        codigoUbigeo: "",
        resumenUbigeo: "",
        detalle: "",
        referencia: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    }],
}

export const personDirectionSlice = createSlice({
    name: "personDirection",
    initialState,
    reducers: {
        setTiposDirecciones: (state, action) => {
            state.tiposDirecciones = action.payload;
        },
        setPersonaDirecciones: (state, action) => {
            state.personaDirecciones = action.payload;
        },
        setDatoPersonaDireccion: (state, action) => {
            var { numero, name, value } = action.payload;

            if (name.startsWith("id")) value = parseInt(value)

            const index = state.personaDirecciones.findIndex(item => item.numero === numero);
            state.personaDirecciones[index][name] = value;

        },
        addPersonaDireccion: (state, action) => {
          var maxNumero = state.personaDirecciones.length === 0 ? 0 : Math.max.apply(null, state.personaDirecciones.map((item) => { return item.numero; }))
  
          state.personaDirecciones.push(state.defaultPersonaDirecciones.map((item) => { return { ...item, numero: maxNumero + 1 } })[0]);
        },
        removePersonaDireccion: (state, action) => {
          state.personaDirecciones = state.personaDirecciones.filter(item => item.numero !== action.payload)
        },

    },
});

export const { setTiposDirecciones, setPersonaDirecciones, setDatoPersonaDireccion
    , addPersonaDireccion, removePersonaDireccion } = personDirectionSlice.actions;
export default personDirectionSlice.reducer;
