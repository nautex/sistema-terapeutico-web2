import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PersonaNatural from '../../components/PersonaNatural'
import { useParams, useNavigate } from 'react-router-dom';
import PersonDirection from '../../components/PersonDirection'
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, Snackbar, Alert, Box } from '@mui/material';
import { Save as IconSave } from "@mui/icons-material";
import PersonDocument from '../../components/PersonDocument'
import PersonContact from '../../components/PersonContact'
import PersonBonding from '../../components/PersonBonding'
import { activeValidationsPersonaNatural } from "../../redux/personSlice";
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

  const defaultPersonaDirecciones = useSelector((state) => state.personDirection.defaultPersonaDirecciones);
  const defaultPersonaDocumentos = useSelector((state) => state.personDocument.defaultPersonaDocumentos)
  const defaultPersonaContactos = useSelector((state) => state.personContact.defaultPersonaContactos);
  const defaultPersonaVinculaciones = useSelector((state) => state.personBonding.defaultPersonaVinculaciones)

  const [openMessage, setOpenMessage] = useState(false)
  const onCloseMessage = () => { setOpenMessage(!openMessage); }
  const [propsMessage, setPropsMessage] = useState({ severity: "success", message: "" });
  const classes = useStyles();
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const personaPost = async () => {
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

          if (personaNatural.id == 0){
            navigate("/person");
          }
          else{
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
          setPropsMessage({ severity: "success", message: "Hubo un error" })
          setOpenMessage(true);
        });
    }
  }

  return (
    <div>
      <Typography variant="h6" component="span">
        <Box sx={{ fontWeight: 'bold' }}>
          {(params.id == 0 ? "Nueva" : "Editar") + " Persona"}
        </Box>
      </Typography>
      <Typography gutterBottom component="span">
        <Box textAlign='center' padding={1}>
          <Button variant="outlined" size='small' onClick={() => {personaPost()}}>
            Guardar
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
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <PersonBonding />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography component="span">
        <Box textAlign='center' padding={1}>
          <Button variant="outlined" size='small' onClick={() => {personaPost()}}>
            Guardar
            <IconSave />
          </Button>
        </Box>
      </Typography>
      <Snackbar open={openMessage} autoHideDuration={5000} onClose={onCloseMessage}>
        <Alert onClose={onCloseMessage} severity={propsMessage.severity}>
          {propsMessage.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Edit
