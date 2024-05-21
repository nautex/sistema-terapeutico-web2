import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    defaultPersonaVinculaciones: [{
        id: 0,
        idPersona: 0,
        numero: 0,
        idPersonaVinculo: 0,
        idTipoVinculo: 0,
        personaVinculo: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    }],
    tiposVinculaciones: [{ id: 0, descripcion: "" }],
    personaVinculaciones: [{
        id: 0,
        idPersona: 0,
        numero: 0,
        idPersonaVinculo: 0,
        idTipoVinculo: 0,
        personaVinculo: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    }],
}

export const personBondingSlice = createSlice({
    name: "personBonding",
    initialState,
    reducers: {
        setTiposVinculaciones: (state, action) => {
            state.tiposVinculaciones = action.payload;
        },
        setPersonaVinculaciones: (state, action) => {
            state.personaVinculaciones = action.payload;
        },
        setDatoPersonaVinculaciones: (state, action) => {
          var { numero, name, value } = action.payload;

          if (name.startsWith("id")) value = parseInt(value)

          const index = state.personaVinculaciones.findIndex(item => item.numero === numero);
          state.personaVinculaciones[index][name] = value;
        },
        addPersonaVinculaciones: (state, action) => {
          var maxNumero = state.personaVinculaciones.length === 0 ? 0 : Math.max.apply(null, state.personaVinculaciones.map((item) => { return item.numero; }))
  
          state.personaVinculaciones.push(state.defaultPersonaVinculaciones.map((item) => { return { ...item, numero: maxNumero + 1 } })[0]);
        },
        removePersonaVinculaciones: (state, action) => {
          state.personaVinculaciones = state.personaVinculaciones.filter(item => item.numero !== action.payload)
        },

    },
});

export const { setTiposVinculaciones, setPersonaVinculaciones, setDatoPersonaVinculaciones
    , addPersonaVinculaciones, removePersonaVinculaciones } = personBondingSlice.actions;
export default personBondingSlice.reducer;
