import React, { useState } from "react";
import { makeStyles} from "@mui/styles"

export function useForm(initialFValues,validateOnChange=false,validate){
    const [errors,setErrors]= useState({})
    const [values,setValues] = useState(initialFValues);
    const handleInputChange = e =>{
        const {name,value,checked,type} = e.target
        const newValue = type === "checkbox" ? (checked ? "true" : "false") : value;
        setValues({
            ...values,
            [name]:newValue 
        })
        if(validateOnChange){
            validate({[name]:newValue })
        }
    }

    const resetForm = () =>{
        setValues(initialFValues);
        setErrors({})
    }
    return{
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiFormControl-root': {
            width: '80%',
            margin: '8px',
        },
    },
}));

export function Form(props){
    const classes= useStyles();
    const {children, ...other}=props
    return(
        <form className={classes.root} autoComplete="off" {...other}>
            {props.children}
        </form>
    )
}