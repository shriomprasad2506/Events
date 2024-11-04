import { FormControl, FormHelperText, InputLabel, MenuItem, Select as MuiSelect } from "@mui/material";
import React from "react";

export default function Select(props){
    const {name,label,value,onChange,options, error=null,disabled}=props
    return(
        <FormControl variant="outlined" {...(error && {error:true})} disabled={disabled}>
            <InputLabel>{label}</InputLabel>
            <MuiSelect label={label} name={name} value={value} onChange={onChange}>
                <MenuItem value="">None</MenuItem>
                {
                    options.map((option,index)=>(
                        <MenuItem key={index} value={option.title}>{option.title}</MenuItem>
                    ))
                }
            </MuiSelect>
            {
                error && <FormHelperText>{error}</FormHelperText>
            }
        </FormControl>
    )
}