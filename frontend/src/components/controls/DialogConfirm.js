import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import React from "react";
import Controls from "./Controls";
import { makeStyles } from "@mui/styles";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";

const useStyles = makeStyles(theme => ({
    dialog:{
        position:'absolute !important',
        top:'40px !important',
        padding:'16px !important'
    },
    dialogTitle:{
        textAlign:'center !important'
    },
    dialogContent:{
        textAlign:'center !important'
    },
    dialogAction:{
        justifyContent:'center !important'
    },
    titleIcon:{
        backgroundColor: '#f8324526 !important',
        color: '#f83245 !important',
        '&:hover':{
            backgroundColor: '#f8324526 !important',
            curose:'default !important'
        },
        '& .MuiSvgIcon-root':{
            fontSize:'8rem !important'
        }

    }
}))

export default function DialogConfirm(props){
    const classes = useStyles()
    const {confirmDialog, setConfirmDialog} = props
    return (
        <Dialog open={confirmDialog.isOpen} classes={{paper:classes.dialog}}>
            <DialogTitle className={classes.dialogTitle}>
                <IconButton disableRipple className={classes.titleIcon}>
                    <NotListedLocationIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="h6">
                    {confirmDialog.title}
                </Typography>
                <Typography variant="subtitle2">
                    {confirmDialog.subTitle}
                </Typography>
            </DialogContent>
            <DialogActions className={classes.dialogAction}>
                <Controls.Button onClick={()=>{
                    setConfirmDialog({
                        ...confirmDialog,
                        isOpen:false
                    })
                }} text="No" color="default"/>
                <Controls.Button onClick={confirmDialog.onConfirm} text="Yes" color="secondary"/>
            </DialogActions>
        </Dialog>
    )
}