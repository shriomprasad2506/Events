import { Alert, Snackbar } from "@mui/material"
import { makeStyles } from "@mui/styles"
import React from "react"

const useStyles = makeStyles(theme=>({
    root:{
        top:'72px !important'
    }
}))

export default function Notification(props){
    const classes=useStyles()
    const {notify, setNotify} = props
    const handleClose = (event,reason) => {
        if(reason==='clickaway'){
            return;
        }
        setNotify({
            ...notify,
            isOpen:false
        })
    }
    return(
        <Snackbar onClose={handleClose} className={classes.root} open={notify.isOpen} autoHideDuration={3000} anchorOrigin={{vertical:'top', horizontal:'right'}}>
            <Alert severity={notify.type} onClose={()=>handleClose()} >
                {notify.message}
            </Alert>
        </Snackbar>
    )
}