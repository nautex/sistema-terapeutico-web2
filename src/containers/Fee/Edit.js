import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Button, Snackbar, Alert, Box } from '@mui/material';
import { Save as IconSave, Terrain } from "@mui/icons-material";
import Fee from '../../components/Fee'
import { activeValidations as activeValidationsFee } from "../../redux/feeSlice";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  paddingGridItem: {
        "& .MuiGrid-root>.MuiGrid-item": {
          paddingTop: "8px"
        },
  }
}));

const Edit = (props) => {
    const fee = useSelector((state) => state.fee.entity);
    const feeValidation = useSelector((state) => state.fee.validationMessage);

    const classes = useStyles();
    const [openMessage, setOpenMessage] = useState(false)
    const onCloseMessage = () => { setOpenMessage(!openMessage); }
    const [propsMessage, setPropsMessage] = useState({ severity: "success", message: "" });
    const dispatch = useDispatch();
    const params = useParams();
    const navigate = useNavigate();
    const postEntity = async () => {
      var dataPost = {
        ...fee
      }

      var ValidationMessages = feeValidation;

      if (ValidationMessages.length > 0) {
        setPropsMessage({ severity: "error", message: ValidationMessages.join(" - ") })
        dispatch(activeValidationsFee());
        setOpenMessage(true);
      }
      else {
        await axios.post("https://localhost:44337/Servicio/AddUpdateTarifa", dataPost)
          .then(response => {
            setPropsMessage({ severity: "success", message: "Se guardaron los datos con exito" })
            setOpenMessage(true);
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
              {(params.id == 0 ? "Nueva" : "Editar") + " Tarifa"}
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Box textAlign='right'>
            <Link to={'/fee'} >{"Volver"}</Link>
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
              <Fee />
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
