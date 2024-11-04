import React, { useState } from "react";
import EmployeeForm from "./EventForm";
import PageHeader from "../../components/PageHeader";
import PeopleOutlineTwoToneIcon from '@mui/icons-material/PeopleOutlineTwoTone';
import {  InputAdornment, Paper, TableBody, TableCell, TableRow, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import useTable from "../../components/useTable";

import * as EventService from "../../services/eventService";

import Controls from "../../components/controls/Controls";
import { EditOutlined as EditOutlinedIcon, Search, Close as CloseIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add"
import Popup from "../../components/Popup";
import Notification from "../../components/controls/Notification";
import DialogConfirm from "../../components/controls/DialogConfirm"
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const useStyles = makeStyles(theme => ({
    paperContent: {
        margin: '40px',
        padding: '24px'
    },
    searchInput: {
        width: '75%'
    },
    newButton: {
        position: 'absolute !important',
        right: '10px'
    }
}));

export default function Events() {
    const classes = useStyles();

    const headCells = [
        { id: 'name', label: 'Name' },
        { id: 'moderator', label: 'Moderator' },
        { id: 'category', label: 'Category' },
        { id: 'eventFormat', label: 'Event Format' },
        { id: 'actions', label: 'Actions', disableSorting: true }
    ];

    const [recordForEdit, setRecordForEdit] = useState(null)
    const [events, setEvents] = useState([]);
    
    const [filterFn, setFilterFn] = useState({ fn: items => { return items } })
    const [openPopup, setOpenPopup] = useState(false)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

    
    const { TblContainer, TblHead, TblPagination, eventsAfterPagingAndSorting,page,rowsPerPage,setTotalEvents } = useTable(events,setEvents, headCells, filterFn);
    
    const fetchEvents = async (rowsPerPage,page) => {
        try {
            const data = await EventService.getEventsPerPage(rowsPerPage,page);
            if (Array.isArray(data.events)) {
                setTotalEvents(data.totalEvents)
                setEvents(data.events);
            } else {
                console.error("Expected an array but got:", data);
                setEvents([]);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]);
        }
    };
    const handleSearch = async e => {
        let target = e.target
        const data = await EventService.searchEvents(target.value,rowsPerPage,page+1)
        setEvents(data.events)
        setTotalEvents(data.totalEvents)
    }   

    const addOrEdit = async (event, resetForm) => {
        if (event.id === 0) {
            await EventService.insertEvent(event)
        }
        else
            await EventService.updateEvent(event)
        resetForm()
        setOpenPopup(false)
        await fetchEvents(rowsPerPage,page+1)
        setNotify({
            isOpen: true,
            message: "Submitted Successfully",
            type: 'success'
        })
    }

    const openInPopup = (item) => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

    const onDelete = async id => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        await EventService.deleteEvent(id)
        await fetchEvents(rowsPerPage,page+1)
        setNotify({
            isOpen: true,
            message: "Deleted Successfully",
            type: 'error'
        })
    }

    const [expandedRowId, setExpandedRowId] = useState(null);
    const [hoveredRow, setHoveredRow] = useState(null);

    return (
        <>
            <PageHeader
                title="Events API"
                subtitle="DeepThoughts Backend"
                icon={<PeopleOutlineTwoToneIcon fontSize='large' />}
            />
            <Paper className={classes.paperContent}>

                <Toolbar>
                    <Controls.Input
                        label="Search Employees"
                        className={classes.searchInput}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            )
                        }}
                        onChange={handleSearch}
                    />
                    <Controls.Button text="Add New" variant="outlined" startIcon={<AddIcon />} className={classes.newButton} onClick={() => { setOpenPopup(true); setRecordForEdit(null) }} />
                </Toolbar>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {eventsAfterPagingAndSorting().map(item => (
                            <>
                                <TableRow key={item._id} onMouseEnter={() => setHoveredRow(item.name)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    sx={{
                                        backgroundColor: hoveredRow === item.name ? '#fffbf2' : 'transparent',
                                        '&:hover': {
                                            backgroundColor: '#fffbf2',
                                        },
                                    }}>
                                    <TableCell style={{ width: '20%', borderBottom: expandedRowId === item.name ? 'none' : '1px solid #ccc' }}>{item.name}</TableCell>
                                    <TableCell style={{ width: '20%', borderBottom: expandedRowId === item.name ? 'none' : '1px solid #ccc' }}>{item.moderator}</TableCell>
                                    <TableCell style={{ width: '20%', borderBottom: expandedRowId === item.name ? 'none' : '1px solid #ccc' }}>{item.category}</TableCell>
                                    <TableCell style={{ width: '20%', borderBottom: expandedRowId === item.name ? 'none' : '1px solid #ccc' }}>{item.eventFormat}</TableCell>
                                    <TableCell style={{ width: '20%', borderBottom: expandedRowId === item.name ? 'none' : '1px solid #ccc' }}>
                                        <Controls.ActionButton color="primary" onClick={() => openInPopup(item)} >
                                            <EditOutlinedIcon fontSize="small" />
                                        </Controls.ActionButton>
                                        <Controls.ActionButton color="secondary" onClick={() => {
                                            setConfirmDialog({
                                                isOpen: true,
                                                title: 'Are you sure you want to delete this record?',
                                                subTitle: "You can't undo this operation.",
                                                onConfirm: () => onDelete(item._id)
                                            })
                                        }}>
                                            <CloseIcon fontSize="small" />
                                        </Controls.ActionButton>
                                        <Controls.ActionButton onClick={() => setExpandedRowId(expandedRowId === item.name ? null : item.name)}>
                                            {
                                                expandedRowId === item.name ?
                                                    <ExpandLess /> : <ExpandMore />
                                            }
                                        </Controls.ActionButton>

                                    </TableCell>
                                </TableRow>
                                {expandedRowId === item.name && (
                                    <>
                                        <TableRow sx={{ backgroundColor: hoveredRow === item.name ? '#fffbf2' : 'transparent' }}>
                                            <TableCell style={{ paddingBottom: '0', paddingTop: '0', border: 'none' }} colSpan={5}><Typography style={{display:'flex',gap:'10px'}}>Additional Information for {item.name} {item.icon ? <img src={item.icon} height={'25px'} /> : ":"}</Typography></TableCell>
                                            
                                        </TableRow>
                                        <TableRow sx={{ backgroundColor: hoveredRow === item.name ? '#fffbf2' : 'transparent' }}>
                                            <TableCell colSpan={1} rowSpan={5}>
                                                <img src={item.image} style={{ maxWidth: '180px' }} />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow sx={{ backgroundColor: hoveredRow === item.name ? '#fffbf2' : 'transparent' }}>
                                            <TableCell colSpan={4} style={{ padding: '0' }}><Typography style={{ display: 'inline' }}>Description: </Typography>{item.description}</TableCell>

                                        </TableRow>
                                        <TableRow sx={{ backgroundColor: hoveredRow === item.name ? '#fffbf2' : 'transparent' }}>
                                            <TableCell colSpan={2} style={{ padding: '0' }}>
                                                <Typography style={{ display: 'inline' }}>TagLine: </Typography>
                                                {item.tagline ? item.tagline : "-"}
                                            </TableCell>
                                            <TableCell colSpan={2} style={{ padding: '0' }}><Typography style={{ display: 'inline' }}>Rigor Rank: </Typography>{item.rigorRank ? item.rigorRank : "-"}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ backgroundColor: hoveredRow === item.name ? '#fffbf2' : 'transparent' }}>
                                            <TableCell colSpan={2} style={{ padding: '0' }}><Typography style={{ display: 'inline' }}>Category: </Typography>{item.category}</TableCell>
                                            <TableCell colSpan={2} style={{ padding: '0' }}><Typography style={{ display: 'inline' }}>Subcategory: </Typography> {item.subCategory ? item.subCategory : "-"}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ backgroundColor: hoveredRow === item.name ? '#fffbf2' : 'transparent' }}>
                                            <TableCell colSpan={2} style={{ padding: '0' }}><Typography style={{ display: 'inline' }}>Member Only: </Typography>{item.memberOnly==="true"?"Yes":"No"}</TableCell>
                                            <TableCell colSpan={2} style={{ padding: '0' }}><Typography style={{ display: 'inline' }}>Scheduled On: </Typography>{new Date(item.scheduledOn).toLocaleDateString('en-US', {
                                                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                            })}</TableCell>
                                        </TableRow>

                                    </>
                                )}
                            </>
                        ))}
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup title="Event Form" openPopup={openPopup} setOpenPopup={setOpenPopup}>
                <EmployeeForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
            </Popup>
            <Notification notify={notify} setNotify={setNotify} />
            <DialogConfirm confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
}
