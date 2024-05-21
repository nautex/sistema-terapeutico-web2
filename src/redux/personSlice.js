import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

const initialState = {
  defaultPersonaNatural: {
      id: 0,
      nombres: "",
      fechaIngreso: moment().format('yyyy-MM-DD'),
      esEmpresa: false,
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      fechaNacimiento: moment("2000-01-01").format('yyyy-MM-DD'),
      idPais: 0,
      pais: "",
      idDepartamento: 0,
      departamento: "",
      idProvincia: 0,
      provincia: "",
      idUbigeoNacimiento: 230101,
      ubigeoNacimiento: "TACNA",
      idSexo: 33,
      sexo: "Masculino",
      idEstadoCivil: 36,
      estadoCivil: "Soltero",
      idTipoPersona: 23,
      tipoPersona: "Padre",
      idEstado: 2,
      fechaRegistro: null,
      usuarioRegistro: null,
      fechaModificacion: null,
      usuarioModificacion: null,
  },
  personaNatural: {
      id: 0,
      nombres: "",
      fechaIngreso: "",
      esEmpresa: false,
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      fechaNacimiento: "",
      idPais: 0,
      pais: "",
      idDepartamento: 0,
      departamento: "",
      idProvincia: 0,
      provincia: "",
      idUbigeoNacimiento: 0,
      ubigeoNacimiento: "",
      idSexo: 0,
      sexo: "",
      idEstadoCivil: 0,
      estadoCivil: "",
      idTipoPersona: 0,
      tipoPersona: "",
      idEstado: 0,
      fechaRegistro: null,
      usuarioRegistro: null,
      fechaModificacion: null,
      usuarioModificacion: null,
  },
  sexos: [{ id: 0, descripcion: "" }],
  estadosCiviles: [{ id: 0, descripcion: "" }],
  tiposPersona: [{ id: 0, descripcion: "" }],
  validationActive: {
      primerNombre: false,
      primerApellido: false,
      idSexo: false,
      idEstadoCivil: false,
      idTipoPersona: false,
      fechaIngreso: false,
      fechaNacimiento: false,
  },
  validationMessage: [],
  personList: {
    id: 0,
    nombres: "",
  }
}

export const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    setPersonaNatural: (state, action) => {
      state.personaNatural = action.payload;
    },
    setDatoPersonaNatural: (state, action) => {
      var { name, value } = action.payload;

      if (name.startsWith("id")) value = parseInt(value)
      
      state.personaNatural[name] = value
      state.validationActive[name] = true
    },
    setSexos: (state, action) => {
      state.sexos = action.payload;
    },
    setEstadosCiviles: (state, action) => {
      state.estadosCiviles = action.payload;
    },
    setTiposPersona: (state, action) => {
      state.tiposPersona = action.payload;
    },
    setValidations: (state, action) => {
      state.validationMessage = action.payload;
    },
    activeValidationsPersonaNatural: (state, action) => {
      Object.keys(state.validationActive).forEach(function (key) {
        state.validationActive[key] = true;
      })
    },
    setPersonList: (state, action) => {
      state.personList = action.payload;
    }
  },
});

export const { setPersonaNatural, setDatoPersonaNatural, setSexos, setEstadosCiviles, setTiposPersona
  , setValidations, activeValidationsPersonaNatural, setPersonList } = personSlice.actions;
export default personSlice.reducer;
