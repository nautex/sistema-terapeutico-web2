import { createSlice } from "@reduxjs/toolkit";
import moment from 'moment';

const initialState = {
    defaultEntity: [{
        id: 0,
        numero: 0,
        idAreaObjetivoCriterio: 0,
        idModelo: 0,
        codigoModelo: "",
        modelo: "",
        idArea: 0,
        codigoArea: "",
        area: "",
        idAreaObjetivo: 0,
        codigoObjetivo: "",
        objetivo: "",
        ordenObjetivo: 0,
        preguntaObjetivo: "",
        ejemploObjetivo: "",
        valorCriterio: 0,
        criterio: "",
        ordenCriterio: 0,
        idPuntuacionGrupo: 1,
        puntuacionGrupo: "+ + +",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,

        areaObjetivo: [{id: 0, codigo: "", nombre: "", descripcion: "", pregunta: "", ejemplo: ""}],
        areaObjetivoCriterio: [{id: 0, valor: 0, descripcion: ""}],        

    }],
    entity: [{
        id: 0,
        numero: 0,
        idAreaObjetivoCriterio: 0,
        idModelo: 0,
        codigoModelo: "",
        modelo: "",
        idArea: 0,
        codigoArea: "",
        area: "",
        idAreaObjetivo: 0,
        codigoObjetivo: "",
        objetivo: "",
        ordenObjetivo: 0,
        preguntaObjetivo: "",
        ejemploObjetivo: "",
        valorCriterio: 0,
        criterio: "",
        ordenCriterio: 0,
        idPuntuacionGrupo: 0,
        puntuacionGrupo: "",
        fechaRegistro: null,
        usuarioRegistro: null,
        fechaModificacion: null,
        usuarioModificacion: null,

        areaObjetivo: [{id: 0, codigo: "", nombre: "", descripcion: "", pregunta: "", ejemplo: ""}],
        areaObjetivoCriterio: [{id: 0, valor: 0, descripcion: ""}],
    
      }],
    listModelo: [{id: 0, codigo: "", nombre: "", descripcion: ""}],
    listArea: [{id: 0, codigo: "", nombre: "", descripcion: ""}],
    // listAreaObjetivo: [{id: 0, codigo: "", nombre: "", descripcion: "", pregunta: "", ejemplo: ""}],
    // listAreaObjetivoCriterio: [{id: 0, valor: 0, descripcion: ""}],
    listPuntuacionGrupo: [{id: 0, descripcion: ""}],
    validationActive: {
      AtLeastOneRow: false,
    },
    validationMessage: [],
}

export const sessionCriterionSlice = createSlice({
    name: "sessionCriterion",
    initialState,
    reducers: {
      setEntity: (state, action) => {
        state.entity = action.payload;

        if (state.entity !== initialState.defaultEntity){
          state.entity.forEach((row) => {
            const index = state.entity.findIndex(item => item.numero === row.numero);
            state.entity[index]["areaObjetivo"] = [{id: row.idAreaObjetivo, codigo: row.codigoObjetivo, nombre: row.objetivo, descripcion: "", pregunta: row.preguntaObjetivo, ejemplo: ""}];
            state.entity[index]["areaObjetivoCriterio"] = [{id: row.idAreaObjetivoCriterio, valor: row.valorCriterio, descripcion: row.criterio}];
          })
        }
      },
      setData: (state, action) => {
        var { numero, name, value } = action.payload;

        if (name.startsWith("id") || name.startsWith("orden") || name.startsWith("valor")) value = parseInt(value)

        const index = state.entity.findIndex(item => item.numero === numero);
        state.entity[index][name] = value;

        Object.keys(state.validationActive).forEach(function (key) {
            state.validationActive[key] = true;
        })
      },
      add: (state, action) => {
        var maxNumero = state.entity.length === 0 ? 0 : Math.max.apply(null, state.entity.map((item) => { return item.numero; }))

        if (state.entity.length > 0){
          var idArea = state.entity[state.entity.length - 1].idArea;
          var areaObjetivo = state.entity[state.entity.length - 1].areaObjetivo;

          state.entity.push(state.defaultEntity.map((item) => { return { ...item, numero: maxNumero + 1, idArea: idArea, areaObjetivo: areaObjetivo} })[0]);
        }
        else {
          state.entity.push(state.defaultEntity.map((item) => { return { ...item, numero: maxNumero + 1 } })[0]);
        }
      },
      remove: (state, action) => {
        state.entity = state.entity.filter(item => item.numero !== action.payload)
      },
      setListModelo: (state, action) => {
        state.listModelo = action.payload;
      },
      setListArea: (state, action) => {
        state.listArea = action.payload;
      },
      setListAreaObjetivo: (state, action) => {
        state.listAreaObjetivo = action.payload;
      },
      setListAreaObjetivoCriterio: (state, action) => {
        state.listAreaObjetivoCriterio = action.payload;
      },
      setListGrupoPuntuacion: (state, action) => {
        state.listPuntuacionGrupo = action.payload;
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
  
  export const { setEntity, setData, add, remove
    , setIdTerapia, setListModelo, setListArea, setListAreaObjetivo, setListAreaObjetivoCriterio, setListGrupoPuntuacion
    , setValidations, activeValidations } = sessionCriterionSlice.actions;
  export default sessionCriterionSlice.reducer;
  