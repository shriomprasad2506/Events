import { Paper, Card, Typography } from "@mui/material";
import {makeStyles} from "@mui/styles"
import React from "react";

const useStyles = makeStyles(theme => ({
    root:{
        backgroundColor:'#fdfdff'
    },
    pageHeader:{
        padding:'32px',
        display:'flex',
        margimBottom:'24px'
    },
    pageIcon:{
        display:'inline-block',
        padding:'16px',
        color:'#3c44b1'
    },
    pageTitle:{
        paddingLeft:'32px',
        '& .MuiTypography-subtitle2':{
            opacity:'0.6'
        }
    }
}))

export default function PageHeader(props){
    const classes = useStyles()
    const {title,subtitle,icon}=props
    return(
        <Paper elevation={0} square>
            <div className={classes.pageHeader}>
                <Card className={classes.pageIcon}>
                    {icon}
                </Card>
                <div className={classes.pageTitle}>
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                    <Typography variant="subtitle2" component="div">
                        {subtitle}
                    </Typography>
                </div>
            </div>
        </Paper>
    )
}