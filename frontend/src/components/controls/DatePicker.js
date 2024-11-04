import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function DatePicker(props) {
    const { name, label, value, onChange, disabled } = props;

    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MuiDatePicker
                name={name}
                label={label}
                value={value}
                onChange={(date) => onChange(convertToDefEventPara(name, date))}
                format="dd MMM, yyyy" 
                disabled={disabled}
            />
        </LocalizationProvider>
    );
}
