import { FormControl, FormControlLabel, Checkbox as MuiCheckBox } from "@mui/material";
import React from "react";

export default function CheckBox (props){
    const {name,label,value,onChange,disabled}=props
    const convertToDefEventPara = (name,value)=>({
        target:{
            name,value:value?"true":"false"
        }
    })
    return (
        <FormControl disabled={disabled}>
            <FormControlLabel control={<MuiCheckBox  name={name} color="primary" checked={value} onChange={e=>onChange(convertToDefEventPara(name,e.target.checked))}/>} label={label} />
        </FormControl>
    )
}