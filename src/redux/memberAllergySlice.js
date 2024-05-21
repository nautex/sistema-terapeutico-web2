import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    defaultEntity: [{
        id: 0,
        numero: 0,
        idTipoAlergia: 0,
        tipoAlergia: "",
        detalle: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    }],
    tiposAlergias: [{ id: 0, descripcion: "" }],
    entity: [{
        id: 0,
        numero: 0,
        idTipoAlergia: 0,
        tipoAlergia: "",
        detalle: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    }],
    validationActive: {
    },
    validationMessage: [],
}

export const memberAllergySlice = createSlice({
    name: "memberAllergy",
    initialState,
    reducers: {
      setTiposAlergias: (state, action) => {
        state.tiposAlergias = action.payload;
      },
      setEntity: (state, action) => {
        state.entity = action.payload;
      },
      setData: (state, action) => {
        var { numero, name, value } = action.payload;

        if (name.startsWith("id")) value = parseInt(value)

        const index = state.entity.findIndex(item => item.numero === numero);
        state.entity[index][name] = value;

        Object.keys(state.validationActive).forEach(function (key) {
            state.validationActive[key] = true;
        })
      },
      add: (state, action) => {
        var maxNumero = state.entity.length === 0 ? 0 : Math.max.apply(null, state.entity.map((item) => { return item.numero; }))

        state.entity.push(state.defaultEntity.map((item) => { return { ...item, numero: maxNumero + 1 } })[0]);
      },
      remove: (state, action) => {
        state.entity = state.entity.filter(item => item.numero !== action.payload)
      },
      setValidations: (state, action) => {
        state.validationMessage = action.payload;
      },
      activeValidations: (state, action) => {
        Object.keys(state.validationActive).forEach(function (key) {
            state.validationActive[key] = true;
        })
      },
      
    },
  });
  
  export const { setTiposAlergias, setEntity, setData
    , add, remove, setValidations, activeValidations } = memberAllergySlice.actions;
  export default memberAllergySlice.reducer;
  