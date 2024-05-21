import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    defaultPersonaContactos: [{
        id: 0,
        idPersona: 0,
        numero: 0,
        idTipoContacto: 69,
        tipoContacto: "Celular",
        valor: "",
        idEstado: 0,
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    }],
    tiposContactos: [{ id: 0, descripcion: "" }],
    personaContactos: [{
        id: 0,
        idPersona: 0,
        numero: 0,
        idTipoContacto: 0,
        tipoContacto: "",
        valor: "",
        idEstado: 0,
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    }],
}

export const personContactSlice = createSlice({
    name: "personContact",
    initialState,
    reducers: {
      setTiposContactos: (state, action) => {
        state.tiposContactos = action.payload;
      },
      setPersonaContactos: (state, action) => {
        state.personaContactos = action.payload;
      },
      setDatoPersonaContacto: (state, action) => {
        var { numero, name, value } = action.payload;

        if (name.startsWith("id")) value = parseInt(value)
        
        const index = state.personaContactos.findIndex(item => item.numero === numero);
        state.personaContactos[index][name] = value;
      },
      addPersonaContacto: (state, action) => {
        var maxNumero = state.personaContactos.length === 0 ? 0 : Math.max.apply(null, state.personaContactos.map((item) => { return item.numero; }))

        state.personaContactos.push(state.defaultPersonaContactos.map((item) => { return { ...item, numero: maxNumero + 1 } })[0]);
      },
      removePersonaContacto: (state, action) => {
        state.personaContactos = state.personaContactos.filter(item => item.numero !== action.payload)
      },

    },
});

export const { setTiposContactos, setPersonaContactos, setDatoPersonaContacto
  , addPersonaContacto, removePersonaContacto } = personContactSlice.actions;
export default personContactSlice.reducer;
