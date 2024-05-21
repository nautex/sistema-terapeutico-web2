import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    defaultPersonaDocumentos: [{
        id: 0,
        idPersona: 0,
        numero: 0,
        idTipoDocumento: 6,
        tipoDocumento: "DNI",
        numeroDocumento: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    }],
    tiposDocumentos: [{ id: 0, descripcion: "" }],
    personaDocumentos: [{
        id: 0,
        idPersona: 0,
        numero: 0,
        idTipoDocumento: 0,
        tipoDocumento: "",
        numeroDocumento: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    }],
    validationActive: {
        AtLeastOneDocument: false,
        OnlyOneTypeDocument: false,
        DNIWith8Digits: false,
        AnyDocumentAtLeast3Digits: false,
        DocumentAlReadyExists: false
    },
    validationMessage: [],
}

export const personDocumentSlice = createSlice({
    name: "personDocument",
    initialState,
    reducers: {
      setTiposDocumentos: (state, action) => {
        state.tiposDocumentos = action.payload;
      },
      setPersonaDocumentos: (state, action) => {
        state.personaDocumentos = action.payload;
      },
      setDatoPersonaDocumento: (state, action) => {
        var { numero, name, value } = action.payload;

        if (name.startsWith("id")) value = parseInt(value)

        const index = state.personaDocumentos.findIndex(item => item.numero === numero);
        state.personaDocumentos[index][name] = value;

        Object.keys(state.validationActive).forEach(function (key) {
            state.validationActive[key] = true;
        })
      },
      addPersonaDocumento: (state, action) => {
        var maxNumero = state.personaDocumentos.length === 0 ? 0 : Math.max.apply(null, state.personaDocumentos.map((item) => { return item.numero; }))

        state.personaDocumentos.push(state.defaultPersonaDocumentos.map((item) => { return { ...item, numero: maxNumero + 1 } })[0]);
        state.validationActive.OnlyOneTypeDocument = true
      },
      removePersonaDocumento: (state, action) => {
        state.personaDocumentos = state.personaDocumentos.filter(item => item.numero !== action.payload)
        state.validationActive.AtLeastOneDocument = true
      },
      setValidations: (state, action) => {
        state.validationMessage = action.payload;
      },
      activeValidationsPersonaDocumento: (state, action) => {
        Object.keys(state.validationActive).forEach(function (key) {
            state.validationActive[key] = true;
        })
      },
    },
  });
  
  export const { setTiposDocumentos, setPersonaDocumentos, setDatoPersonaDocumento
    , addPersonaDocumento, removePersonaDocumento, setValidations, activeValidationsPersonaDocumento } = personDocumentSlice.actions;
  export default personDocumentSlice.reducer;
  