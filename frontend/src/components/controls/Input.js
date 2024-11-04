import React from "react"
import { TextField } from "@mui/material"

export default function Input(props) {
    const { name, label, value,error, onChange, ...other } = props
    return (
        <TextField variant="outlined" name={name} label={label} value={value} onChange={onChange} {...(error && {error:true, helperText:error})} {...other}/>
    )
}