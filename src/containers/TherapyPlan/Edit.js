import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, Snackbar, Alert, Box } from '@mui/material';
import { Save as IconSave, Terrain } from "@mui/icons-material";
import TherapyPlan from '../../components/TherapyPlan'
import TherapyPlanArea from '../../components/TherapyPlanArea'
import { makeStyles } from "@mui/styles";
import { activeValidations as activeValidationsTherapyPlan } from '../../redux/therapyPlanSlice';
import { setEntity as setTherapyPlanArea, activeValidations as activeTherapyPlanArea } from '../../redux/therapyPlanAreaSlice';

const useStyles = makeStyles((theme) => ({
  paddingGridItem: {
        "& .MuiGrid-root>.MuiGrid-item": {
          paddingTop: "8px"
        },
  }
}));

const Edit = (props) => {
   const therapyPlan = useSelector((state) => state.therapyPlan.entity);
   const therapyPlanArea = useSelector((state) => state.therapyPlanArea.entity);
   const therapyPlanValidation = useSelector((state) => state.therapyPlan.validationMessage);
   const therapyPlanAreaValidation = useSelector((state) => state.therapyPlanArea.validationMessage);

   const defaultTherapyPlanArea = useSelector((state) => state.therapyPlanArea.defaultEntity)
   const classes = useStyles();
  const [openMessage, setOpenMessage] = useState(false)
  const onCloseMessage = () => { setOpenMessage(!openMessage); }
  const [propsMessage, setPropsMessage] = useState({ severity: "success", message: "" });
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const postEntity = async () => {
    var dataPost = {
      ...therapyPlan
      , terapiaPlanArea: therapyPlanArea
    }

    var ValidationMessages = therapyPlanValidation.concat(therapyPlanAreaValidation)

    if (ValidationMessages.length > 0) {
      dispatch(activeValidationsTherapyPlan());
      dispatch(activeTherapyPlanArea());

      setPropsMessage({ severity: "error", message: ValidationMessages.join(" - ") })
      setOpenMessage(true);
    }
    else {
      await axios.post("https://localhost:44337/TerapiaPlan/AddUpdateTerapiaPlanWithDetails", dataPost)
        .then(response => {
          setPropsMessage({ severity: "success", message: "Se guardaron los datos con exito" })
          setOpenMessage(true);

          if (therapyPlan.id > 0){
            axios.get("https://localhost:44337/Terapia/GetsTerapiaPlanAreaView?idTerapia=" + therapyPlan.id)
            .then(response => {
              if (response.data.data === null || response.data.data.length === 0)
                dispatch(setTherapyPlanArea(defaultTherapyPlanArea));
              else
                dispatch(setTherapyPlanArea(response.data.data));
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
              {(params.id == 0 ? "Nueva" : "Editar") + " Plan de Terapia"}
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
              <TherapyPlan />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Card>
            <CardContent sx={{ padding: "0px 10px 10px 10px !important" }}>
              <TherapyPlanArea />
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
