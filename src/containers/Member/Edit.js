import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, Snackbar, Alert, Box } from '@mui/material';
import { Save as IconSave } from "@mui/icons-material";
import Member from '../../components/Member'
import MemberAllergy from '../../components/MemberAllergy'
import MemberAuthorizedPerson from '../../components/MemberAuthorizedPerson'
import { makeStyles } from "@mui/styles";
import { setEntity as setMemberAllergy, activeValidations as activeMemberAllergy } from '../../redux/memberAllergySlice';
import { setEntity as setMemberAuthorizedPerson, activeValidations as activeMemberAuthorizedPerson } from '../../redux/memberAuthorizedPersonSlice';

const useStyles = makeStyles((theme) => ({
  paddingGridItem: {
        "& .MuiGrid-root>.MuiGrid-item": {
          paddingTop: "8px"
        },
  }
}));

const Edit = (props) => {
   const participante = useSelector((state) => state.member.participante);
//   const personaDirecciones = useSelector((state) => state.personDirection.personaDirecciones);
   const participanteAlergia = useSelector((state) => state.memberAllergy.entity);
//   const personaContactos = useSelector((state) => state.personContact.personaContactos);
   const participantePersonaAutorizada = useSelector((state) => state.memberAuthorizedPerson.entity);
   const participanteValidation = useSelector((state) => state.member.validationMessage);
   const participanteAlergiaValidation = useSelector((state) => state.memberAllergy.validationMessage);

   const defaultParticipanteAlergia = useSelector((state) => state.memberAllergy.defaultEntity)
   const defaultParticipanteAuthorizedPerson = useSelector((state) => state.memberAuthorizedPerson.defaultEntity)
   const classes = useStyles();
  const [openMessage, setOpenMessage] = useState(false)
  const onCloseMessage = () => { setOpenMessage(!openMessage); }
  const [propsMessage, setPropsMessage] = useState({ severity: "success", message: "" });
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const postEntity = async () => {
    var dataPost = {
      ...participante
      , idTerapeuta: parseInt(participante.idTerapeuta)
      , participanteAlergia: participanteAlergia, participantePersonaAutorizada: participantePersonaAutorizada
    }

    var ValidationMessages = participanteValidation.concat(participanteAlergiaValidation)

    console.log(dataPost)
    console.log(ValidationMessages)

    if (ValidationMessages.length > 0) {
      dispatch(activeMemberAllergy());
      dispatch(activeMemberAuthorizedPerson());

      setPropsMessage({ severity: "error", message: ValidationMessages.join(" - ") })
      setOpenMessage(true);
    }
    else {
      await axios.post("https://localhost:44337/Participante/AddUpdateParticipanteWithDetails", dataPost)
        .then(response => {
          setPropsMessage({ severity: "success", message: "Se guardaron los datos con exito" })
          setOpenMessage(true);

          if (participante.id == 0){
            navigate("/member");
          }
          else{
            axios.get("https://localhost:44337/Participante/GetsParticipanteAlergiaViewById?idParticipante=" + participante.id)
            .then(response => {
              if (response.data.data === null || response.data.data.length === 0)
                dispatch(setMemberAllergy(defaultParticipanteAlergia));
              else
                dispatch(setMemberAllergy(response.data.data));
            })
            .catch((err) => {
              console.log("Err: ", err);
            });

            axios.get("https://localhost:44337/Participante/GetsParticipantePersonaAutorizadaViewById?idParticipante=" + participante.id)
            .then(response => {
              if (response.data.data === null || response.data.data.length === 0)
                dispatch(setMemberAuthorizedPerson(defaultParticipanteAuthorizedPerson));
              else
                dispatch(setMemberAuthorizedPerson(response.data.data));
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
      <Typography variant="h5" component="span">
        <Box sx={{ fontWeight: 'bold' }}>
          {(params.id == 0 ? "Nuevo" : "Editar") + " Participante"}
        </Box>
      </Typography>
      <Typography  component="span">
        <Box textAlign='center' padding={1}>
          <Button variant="outlined" size='small' onClick={() => {postEntity()}}>
            Guardar
            <IconSave />
          </Button>
        </Box>
      </Typography>
      
      <Grid container spacing={1} classes={{root: classes.paddingGridItem}}>
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <Member />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <MemberAllergy />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <MemberAuthorizedPerson />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography component="span">
        <Box textAlign='center' padding={1}>
          <Button variant="outlined" size='small' onClick={() => {postEntity()}}>
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
