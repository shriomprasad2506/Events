import React from "react";
import { FormControl, Button, FormHelperText } from "@mui/material";
import Delete from "@mui/icons-material/Delete";

export default function FileUpload(props) {
    const { name, label, icon, preview, setPreview, error,disabled } = props;

    const handleChange = (e) => {
        props.onChange(e);
    };

    return (
        <FormControl variant="outlined" fullWidth>
            <input
                style={{ display: 'none' }}
                type="file"
                id={name}
                name={name}
                onChange={handleChange}
                accept=".jpg,.jpeg,.png"
            />
            <label htmlFor={name}>
                {
                    !preview && (
                        <div style={{display:'flex',flexDirection:'column'}}>

                        <Button
                            variant="contained"
                            component="span"
                            startIcon={icon}
                            fullWidth
                            color={error?"secondary":"primary"}
                            style={{height: '48px' }}
                            disabled={disabled}
                        >
                            {label} 
                        </Button>
                        <div>

                            {error && <FormHelperText style={{color:'red'}}>Please Upload Image</FormHelperText>}
                        </div>
                        </div>
                        
                    )
                }
            </label>

            {
                preview && (
                    <div style={{ display: 'flex', gap: '40px' }}>
                        <label htmlFor={name}>
                            <Button
                                variant="contained"
                                component="span"
                                style={{ height: '48px' }}
                                disabled={disabled}
                            >
                                {icon}
                            </Button>
                        </label>
                        <img
                            src={preview}
                            alt="Preview"
                            style={{ height: '48px' }}
                        />
                        <Button
                            variant="outlined"
                            component="span"
                            color="secondary"
                            style={{ border: 'none', marginLeft: "auto" }}
                            onClick={() => setPreview(null)}
                            disabled={disabled}
                        >
                            <Delete fontSize="large" />
                        </Button>
                    </div>
                )
            }

            
        </FormControl>
    );
}
