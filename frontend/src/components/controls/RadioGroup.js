import { FormControl, FormLabel, RadioGroup as MuiRadioGroup, FormControlLabel, Radio } from "@mui/material"
import React from "react"

export default function RadioGroup(props) {
    const { name, label, value, onChange, items,disabled } = props
    return (
        <FormControl disabled={disabled}>
            <FormLabel>{label}</FormLabel>
            <MuiRadioGroup row name={name} value={value} onChange={onChange}>
                {
                    items.map(
                        (item, index) => (
                            <FormControlLabel key={index} value={item} control={<Radio />} label={item} />

                        )
                    )
                }
            </MuiRadioGroup>
        </FormControl>
    )
}