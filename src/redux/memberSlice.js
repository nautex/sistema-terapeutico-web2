import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

const initialState = {
    defaultParticipante: {
        id: 0,
        idPersona: 0,
        participante: "",
        fechaIngreso: moment().format('yyyy-MM-DD'),
        padre: "",
        madre: "",
        lugarCasoAccidente: "",
        idDireccionCasoAccidente: 0,
        ubigeoCasoAccidente: "",
        direccionCasoAccidente: "",
        detalleHermanos: "",
        tieneDiagnostico: false,
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    },
    participante: {
        id: 0,
        idPersona: 0,
        participante: "",
        fechaIngreso: moment().format('yyyy-MM-DD'),
        padre: "",
        madre: "",
        lugarCasoAccidente: "",
        idDireccionCasoAccidente: 0,
        ubigeoCasoAccidente: "",
        direccionCasoAccidente: "",
        detalleHermanos: "",
        tieneDiagnostico: false,
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,
    },
    listParticipantes: [{ id: 0, descripcion: "" }],
    // listTerapeutas: [{ id: 0, descripcion: "" }],
    validationActive: {
        participante: false,
        terapeuta: false,
        fechaIngreso: false,
    },
    validationMessage: [],
  }
  
  export const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {
      setEntity: (state, action) => {
        state.participante = action.payload;
      },
      setData: (state, action) => {
        var { name, value } = action.payload;
  
        if (name.startsWith("id")) value = parseInt(value)
        
        state.participante[name] = value
        state.validationActive[name] = true
      },
      setValidationMessage: (state, action) => {
        state.validationMessage = action.payload;
      },
      activeValidations: (state, action) => {
        Object.keys(state.validationActive).forEach(function (key) {
          state.validationActive[key] = true;
        })
      },
      setListParticipantes: (state, action) => {
        state.listParticipantes = action.payload;
      },
      // setListTerapeutas: (state, action) => {
      //   state.listTerapeutas = action.payload;
      // }
    },
  });
  
  export const { setEntity, setData, setValidationMessage, activeValidations
    , setListParticipantes } = memberSlice.actions;
  export default memberSlice.reducer;
  