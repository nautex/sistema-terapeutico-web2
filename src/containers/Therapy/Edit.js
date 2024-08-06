import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, Snackbar, Alert, Box } from '@mui/material';
import { Save as IconSave, Terrain } from "@mui/icons-material";
import Therapy from '../../components/Therapy'
import TherapySchedule from '../../components/TherapySchedule'
import TherapyTherapist from '../../components/TherapyTherapist'
import TherapyMember from '../../components/TherapyMember'
import { makeStyles } from "@mui/styles";
import { activeValidations as activeValidationsTherapy } from '../../redux/therapySlice';
import { setEntity as setTherapySchedule, activeValidations as activeTherapySchedule } from '../../redux/therapyScheduleSlice';
import { setEntity as setTherapyTherapist, activeValidations as activeTherapyTherapist } from '../../redux/therapyTherapistSlice';
import { setEntity as setTherapyMember, activeValidations as activeTherapyMember } from '../../redux/therapyMemberSlice';

const useStyles = makeStyles((theme) => ({
  paddingGridItem: {
        "& .MuiGrid-root>.MuiGrid-item": {
          paddingTop: "8px"
        },
  }
}));

const Edit = (props) => {
   const therapy = useSelector((state) => state.therapy.entity);
   const therapySchedule = useSelector((state) => state.therapySchedule.entity);
   const therapyTherapist = useSelector((state) => state.therapyTherapist.entity);
   const therapyMember = useSelector((state) => state.therapyMember.entity);
   const therapyValidation = useSelector((state) => state.therapy.validationMessage);
   const therapyScheduleValidation = useSelector((state) => state.therapySchedule.validationMessage);
   const therapyTherapistValidation = useSelector((state) => state.therapyTherapist.validationMessage);
   const therapyMemberValidation = useSelector((state) => state.therapyMember.validationMessage);

   const defaultTherapySchedule = useSelector((state) => state.therapySchedule.defaultEntity)
   const defaultTherapyTherapist = useSelector((state) => state.therapyTherapist.defaultEntity)
   const defaultTherapyMember = useSelector((state) => state.therapyMember.defaultEntity)
   const classes = useStyles();
  const [openMessage, setOpenMessage] = useState(false)
  const onCloseMessage = () => { setOpenMessage(!openMessage); }
  const [propsMessage, setPropsMessage] = useState({ severity: "success", message: "" });
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const postEntity = async () => {
    var dataPost = {
      ...therapy
      , terapiaHorario: therapySchedule, terapiaTerapeuta: therapyTherapist, terapiaParticipante: therapyMember
    }

    var ValidationMessages = therapyValidation.concat(therapyMemberValidation).concat(therapyScheduleValidation).concat(therapyTherapistValidation)

    console.log(dataPost)
    console.log(ValidationMessages)

    if (ValidationMessages.length > 0) {
      dispatch(activeValidationsTherapy());
      dispatch(activeTherapySchedule());
      dispatch(activeTherapyTherapist());
      dispatch(activeTherapyMember());

      setPropsMessage({ severity: "error", message: ValidationMessages.join(" - ") })
      setOpenMessage(true);
    }
    else {
      await axios.post("https://localhost:44337/Terapia/AddUpdateTherapyWithDetails", dataPost)
        .then(response => {
          setPropsMessage({ severity: "success", message: "Se guardaron los datos con exito" })
          setOpenMessage(true);

          if (therapy.id > 0){
            axios.get("https://localhost:44337/Terapia/GetsTerapiaHorarioView?idTerapia=" + therapy.id)
            .then(response => {
              if (response.data.data === null || response.data.data.length === 0)
                dispatch(setTherapySchedule(defaultTherapySchedule));
              else
                dispatch(setTherapySchedule(response.data.data));
            })
            .catch((err) => {
              console.log("Err: ", err);
            });

            axios.get("https://localhost:44337/Terapia/GetsTerapiaTerapeutaView?idTerapia=" + therapy.id)
            .then(response => {
              if (response.data.data === null || response.data.data.length === 0)
                dispatch(setTherapyTherapist(defaultTherapyTherapist));
              else
                dispatch(setTherapyTherapist(response.data.data));
            })
            .catch((err) => {
              console.log("Err: ", err);
            });
            
            axios.get("https://localhost:44337/Terapia/GetsTerapiaParticipanteView?idTerapia=" + therapy.id)
            .then(response => {
              if (response.data.data === null || response.data.data.length === 0)
                dispatch(setTherapyMember(defaultTherapyMember));
              else
                dispatch(setTherapyMember(response.data.data));
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

  return (
    <div>
      <Grid container spacing={0}>
        <Grid item xs={6} sm={6}>
          <Typography variant="h5" component="span">
            <Box sx={{ fontWeight: 'bold' }}>
              {(params.id == 0 ? "Nueva" : "Editar") + " Terapia"}
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Box textAlign='right'>
            <Link to={'/therapy'} >{"Volver"}</Link>
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
      
      <Grid container spacing={1} classes={{root: classes.paddingGridItem}}>
        <Grid item xs={12} sm={12}>
          <Card >
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <Therapy />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <TherapyTherapist />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <TherapyMember />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <TherapySchedule />
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
