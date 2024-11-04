import React from 'react'
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles(theme => ({
    root: {
        minWidth: '0 !important',
        margin: '4px !important'
    },
    secondary: {
        backgroundColor: '#f8324526 !important',
        '& .MuiSvgIcon-root': {
            color: "#f83245 !important",
        }
    },
    primary: {
        backgroundColor: '#3c44b126 !important',
        '& .MuiButton-label': {
            color:'#333996 !important',
        }
    },
}))

export default function ActionButton(props) {

    const { color, children, onClick } = props;
    const classes = useStyles();

    return (
        <Button
            className={`${classes.root} ${classes[color]}`}
            onClick={onClick}>
            {children}
        </Button>
    )
}