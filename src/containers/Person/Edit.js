import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PersonaNatural from '../../components/PersonaNatural'
import { Link, useParams, useNavigate } from 'react-router-dom';
import PersonDirection from '../../components/PersonDirection'
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, Snackbar, Alert, Box } from '@mui/material';
import { Save as IconSave } from "@mui/icons-material";
import PersonDocument from '../../components/PersonDocument'
import PersonContact from '../../components/PersonContact'
import PersonBonding from '../../components/PersonBonding'
import { activeValidationsPersonaNatural, setNombreVinculado, setTipoPersona } from "../../redux/personSlice";
import { activeValidationsPersonaDocumento } from "../../redux/personDocumentSlice";
import { setPersonaDirecciones } from '../../redux/personDirectionSlice';
import { setPersonaVinculaciones } from '../../redux/personBondingSlice';
import { setPersonaContactos } from '../../redux/personContactSlice';
import { setPersonaDocumentos } from '../../redux/personDocumentSlice';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  paddingGridItem: {
        "& .MuiGrid-root>.MuiGrid-item": {
          paddingTop: "8px"
        },
  }
}));

const Edit = (props) => {
  const personaNatural = useSelector((state) => state.person.personaNatural);
  const personaDirecciones = useSelector((state) => state.personDirection.personaDirecciones);
  const personaDocumentos = useSelector((state) => state.personDocument.personaDocumentos);
  const personaContactos = useSelector((state) => state.personContact.personaContactos);
  const personaVinculaciones = useSelector((state) => state.personBonding.personaVinculaciones);
  const personaNaturalValidation = useSelector((state) => state.person.validationMessage);
  const personaDocumentosValidation = useSelector((state) => state.personDocument.validationMessage);
  const nombreVinculado = useSelector((state) => state.person.nombreVinculado);
  const tipoPersona = useSelector((state) => state.person.tipoPersona);

  const defaultPersonaDirecciones = useSelector((state) => state.personDirection.defaultPersonaDirecciones);
  const defaultPersonaDocumentos = useSelector((state) => state.personDocument.defaultPersonaDocumentos)
  const defaultPersonaContactos = useSelector((state) => state.personContact.defaultPersonaContactos);
  const defaultPersonaVinculaciones = useSelector((state) => state.personBonding.defaultPersonaVinculaciones)

  const [openMessage, setOpenMessage] = useState(false)
  const onCloseMessage = () => { setOpenMessage(!openMessage); }
  const [propsMessage, setPropsMessage] = useState({ severity: "success", message: "" });
  const [enabledSave, setEnabledSave] = useState(true)
  const [idNew, setIdNew] = useState(0)
  // const [continueDisplay, setContinueDisplay] = useState("none")

  const classes = useStyles();
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const fetchNombreVinculado = useCallback(async () => {
    if (params.idPersona > 0){
      axios.get("https://localhost:44337/Persona/GetPersonaById?idPersona=" + params.idPersona)
      .then(response => {
        dispatch(setNombreVinculado(response.data.data.nombres))
      })
      .catch((err) => {
        console.log("Err: ", err);
      });
    }
  }, [])
  const fetchTipoPersona = useCallback(async () => {
    console.log(params.idTipoPersona)
    if (params.idTipoPersona > 0){
      axios.get("https://localhost:44337/Catalogo/GetCatalogo?id=" + params.idTipoPersona)
      .then(response => {
        dispatch(setTipoPersona(response.data.data.descripcion))
      })
      .catch((err) => {
        console.log("Err: ", err);
      });
    }
  }, [])

  useEffect(() => {
    fetchNombreVinculado();
    fetchTipoPersona();
  }, [])

  const personaPost = async () => {
    if (idNew > 0 && params.idTipoPersona == 23){
      navigate('/person/edit/0/' + params.idPersona + '/93');
      window.location.reload();
    }
    else {
      var dataPost = {
        ...personaNatural, nombres: personaNatural.primerApellido + " " + personaNatural.segundoApellido + " " + personaNatural.primerNombre + " " + personaNatural.segundoNombre
        , idSexo: parseInt(personaNatural.idSexo)
        , personaDireccion: personaDirecciones, personaDocumento: personaDocumentos, personaContacto: personaContactos, personaVinculacion: personaVinculaciones
      }

      var ValidationMessages = personaNaturalValidation.concat(personaDocumentosValidation)

      if (ValidationMessages.length > 0) {
        dispatch(activeValidationsPersonaNatural());
        dispatch(activeValidationsPersonaDocumento());

        setPropsMessage({ severity: "error", message: ValidationMessages.join(" - ") })
        setOpenMessage(true);
      }
      else {
        await axios.post("https://localhost:44337/Persona/PostPersonaNaturalUpdateWithDetails", dataPost)
          .then(response => {
            setPropsMessage({ severity: "success", message: "Se guardaron los datos con exito" })
            setOpenMessage(true);
            setIdNew(parseInt(response.data.data))

            if (params.idTipoPersona == 0 || params.idTipoPersona == 93) {
              setEnabledSave(false);
            }

            // if (params.idTipoPersona == 23) {
            //   setContinueDisplay("block");
            // }

            if (params.idPersona > 0 && params.idTipoPersona > 0){
              var vinculacion = {
                idPersona: parseInt(params.idPersona),
                idPersonaVinculo: idNew,
                idTipoVinculo: parseInt(params.idTipoPersona) == 23 ? 43 : 44,
                usuarioRegistro: "JSOTELO",
              }
              
              axios.post("https://localhost:44337/Persona/AddPersonaVinculacion", vinculacion)
              .then(response => {
                setPropsMessage({ severity: "success", message: "Se registro la vinculacion" })
                setOpenMessage(true);
              })
              .catch((err) => {
                console.log("Err: ", err);
              });
            }
            
            if (personaNatural.id > 0){
              axios.get("https://localhost:44337/Persona/GetPersonasDireccionesViewByIdPersona?idPersona=" + personaNatural.id)
              .then(directions => {
                if (directions.data.data === null || directions.data.data.length === 0)
                  dispatch(setPersonaDirecciones(defaultPersonaDirecciones));
                else
                  dispatch(setPersonaDirecciones(directions.data.data));
              })
              .catch((err) => {
                console.log("Err: ", err);
              });

              axios.get("https://localhost:44337/Persona/GetPersonasVinculacionesViewByIdPersona?idPersona=" + personaNatural.id)
              .then(bondings => {
                if (bondings.data.data === null || bondings.data.data.length === 0)
                  dispatch(setPersonaVinculaciones(defaultPersonaVinculaciones));
                else
                  dispatch(setPersonaVinculaciones(bondings.data.data));
              })
              .catch((err) => {
                console.log("Err: ", err);
              });

              axios.get("https://localhost:44337/Persona/GetPersonasContactosViewByIdPersona?idPersona=" + personaNatural.id)
              .then(contacts => {
                if (contacts.data.data === null || contacts.data.data.length === 0)
                  dispatch(setPersonaContactos(defaultPersonaContactos));
                else
                  dispatch(setPersonaContactos(contacts.data.data));
              })
              .catch((err) => {
                console.log("Err: ", err);
              });
              
              axios.get("https://localhost:44337/Persona/GetPersonasDocumentosViewByIdPersona?idPersona=" + personaNatural.id)
              .then(documents => {
                if (documents.data.data === null || documents.data.data.length === 0)
                  dispatch(setPersonaDocumentos(defaultPersonaDocumentos));
                else
                  dispatch(setPersonaDocumentos(documents.data.data));
              })
              .catch((err) => {
                console.log("Err: ", err);
              });
            }
          })
          .catch(error => {
            setPropsMessage({ severity: "error", message: "Hubo un error" })
            setOpenMessage(true);
          });
      }
    }
  }

  return (
    <div>
      <Grid container spacing={0}>
        <Grid item xs={8} sm={8}>
          <Typography variant="h5" component="span">
            <Box sx={{ fontWeight: 'bold' }}>
              {/* {(params.id == 0 ? (params.idVinculado > 0 ? "Registro del " + tipoVinculo + " de " + nombreVinculado: "Nueva Persona") : "Editar Persona")} */}
              {(params.id == 0 ? (params.idTipoPersona > 0 ? "Registrar " + tipoPersona : "Nueva Persona") : "Editar Persona")}
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={4} sm={4}>
          <Box textAlign='right'>
            <Link to={'/person'} >{"Volver"}</Link>
          </Box>
        </Grid>
      </Grid>

      {/* <Grid container spacing={0}>
        <Grid item xs={12} sm={12}>
          <Box textAlign='center'>
            <Link reloadDocument to={ "/person/edit/0/" + (idNew) + "/" + (parseInt(params.idTipoPersona) == 23 ? 93 : 0) } style={{ display: continueDisplay }} >{"Continuar Registro >>"}</Link>
          </Box>
        </Grid>
      </Grid> */}

      <Typography gutterBottom component="span">
        <Box textAlign='center' padding={1}>
          <Button variant="outlined" size='small' onClick={() => {personaPost()}} disabled={!enabledSave} >
            {(params.id > 0 ? "Guardar" : idNew > 0 && params.idTipoPersona == 23 ? "Registrar a la Madre" : "Guardar")}
            <IconSave />
          </Button>
        </Box>
      </Typography>

      <Grid container spacing={1} classes={{root: classes.paddingGridItem}}>
        <Grid item xs={12} sm={12}>
          <Card >
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <PersonaNatural />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <PersonDocument />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <PersonContact />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <PersonDirection />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <PersonBonding />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* <Grid container spacing={0}>
        <Grid item xs={12} sm={12}>
          <Box textAlign='center'>
            <Link reloadDocument to={ "/person/edit/0/" + (idNew) + "/" + (parseInt(params.idTipoPersona) == 24 ? 23 : 93) } style={{ display: continueDisplay }} >{"Continuar Registro >>"}</Link>
          </Box>
        </Grid>
      </Grid> */}
      <Typography component="span">
        <Box textAlign='center' padding={1}>
          <Button variant="outlined" size='small' onClick={() => {personaPost()}} disabled={!enabledSave}>
            {(params.id > 0 ? "Guardar" : idNew > 0 && params.idTipoPersona == 23 ? "Registrar a la Madre" : "Guardar")}
            <IconSave />
          </Button>
        </Box>
      </Typography>
      <Snackbar open={openMessage} autoHideDuration={5000} onClose={onCloseMessage}
        anchorOrigin={{vertical: "top", horizontal: "center"}}>
        <Alert onClose={onCloseMessage} severity={propsMessage.severity}>
          {propsMessage.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Edit
