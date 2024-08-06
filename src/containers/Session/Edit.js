import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, Snackbar, Alert, Box } from '@mui/material';
import { Save as IconSave, Terrain } from "@mui/icons-material";
import Session from '../../components/Session'
import SessionTherapist from '../../components/SessionTherapist'
import SessionCriterion from '../../components/SessionCriterion'
import { makeStyles } from "@mui/styles";
import { activeValidations as activeValidationsSession } from '../../redux/sessionSlice';
import { setEntity as setSessionTherapist, activeValidations as activeSessionTherapist } from '../../redux/sessionTherapistSlice';
import { setEntity as setSessionCriterion, activeValidations as activeSessionCriterion } from '../../redux/sessionCriterionSlice';

const useStyles = makeStyles((theme) => ({
  paddingGridItem: {
        "& .MuiGrid-root>.MuiGrid-item": {
          paddingTop: "8px"
        },
  }
}));

const Edit = (props) => {
  const session = useSelector((state) => state.session.entity);
  const nombreTerapeuta = useSelector((state) => state.session.nombreTerapeuta);
  const sessionTherapist = useSelector((state) => state.sessionTherapist.entity);
  const sessionCriterion = useSelector((state) => state.sessionCriterion.entity);
  const sessionValidation = useSelector((state) => state.session.validationMessage);
  const sessionTherapistValidation = useSelector((state) => state.sessionTherapist.validationMessage);
  const sessionCriterionValidation = useSelector((state) => state.sessionCriterion.validationMessage);
  const defaultSessionTherapist = useSelector((state) => state.sessionTherapist.defaultEntity)
  const defaultSessionCriterion = useSelector((state) => state.sessionCriterion.defaultEntity)

  const classes = useStyles();
  const [openMessage, setOpenMessage] = useState(false)
  const onCloseMessage = () => { setOpenMessage(!openMessage); }
  const [propsMessage, setPropsMessage] = useState({ severity: "success", message: "" });
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const postEntity = async () => {
    var dataPost = {
      ...session
      , sesionTerapeuta: sessionTherapist
      , sesionCriterio: sessionCriterion
    }

    var ValidationMessages = sessionValidation.concat(sessionTherapistValidation).concat(sessionCriterionValidation);

    if (ValidationMessages.length > 0) {
      dispatch(activeValidationsSession());
      dispatch(activeSessionTherapist());
      dispatch(activeSessionCriterion());

      setPropsMessage({ severity: "error", message: ValidationMessages.join(" - ") })
      setOpenMessage(true);
    }
    else {
      await axios.post("https://localhost:44337/Sesion/AddUpdateSessionWithDetails", dataPost)
        .then(response => {
          setPropsMessage({ severity: "success", message: "Se guardaron los datos con exito" })
          setOpenMessage(true);

          if (session.id > 0){
            axios.get("https://localhost:44337/Sesion/GetsSesionTerapeutaView?idSesion=" + session.id)
            .then(response => {
              if (response.data.data === null || response.data.data.length === 0)
                dispatch(setSessionTherapist(defaultSessionTherapist));
              else
                dispatch(setSessionTherapist(response.data.data));
            })
            .catch((err) => {
              console.log("Err: ", err);
            });

            axios
            .get("https://localhost:44337/Sesion/GetsSesionCriterioView?idSesion=" + session.id)
            .then((response) => {
                if (response.data.data == null || response.data.data.length == 0){
                    dispatch(setSessionCriterion(defaultSessionCriterion));
                }
                else {
                    dispatch(setSessionCriterion(response.data.data));
                }
            })
            .catch((err) => {
                console.log("Err: ", err)
            });
          }
        })
        .catch(error => {
          setPropsMessage({ severity: "error", message: "Hubo un error" })
          setOpenMessage(true);
        });
    }
  }

  return (
    <div>
      <Grid container spacing={0}>
        <Grid item xs={6} sm={6}>
          <Typography variant="h5" component="span">
            <Box sx={{ fontWeight: 'bold' }}>
              {(params.id == 0 ? "Nueva" : "Editar") + " Sesion"}
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Box textAlign='right'>
            <Link to={'/session'} >{"Volver"}</Link>
          </Box>
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

      <Box sx={{ fontWeight: 'bold' }} padding={0}>
          <Typography variant="h7">
              {nombreTerapeuta}
          </Typography>
      </Box>
      
      <Grid container spacing={1} classes={{root: classes.paddingGridItem}}>
        <Grid item xs={12} sm={12}>
          <Card >
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <Session />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <SessionCriterion />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <SessionTherapist />
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
