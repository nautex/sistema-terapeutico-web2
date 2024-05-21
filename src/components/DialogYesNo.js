import { Button, Dialog, DialogActions, DialogContentText, DialogContent, DialogTitle
    , Typography } from '@mui/material';

// import { Button } from '@material-ui/core';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import Typography from '@material-ui/core/Typography';
import React, { useRef } from 'react';

const DialogYesNo = (props) => {
    const nodeRef = useRef(null)

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            fullWidth={true}
            ref={nodeRef}
        >
            <DialogTitle>
                {/* <Typography variant="h6"> */}
                <Typography>
                    {props.titulo}
                    {/*JSON.stringify(searchUbigeo)*/}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText >
                    {props.texto}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => {
                    props.setYes();
                    props.openClose();
                }}>Si</Button>
                <Button onClick={() => {
                    props.setNo();
                    props.openClose();
                }} >No</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogYesNo;
