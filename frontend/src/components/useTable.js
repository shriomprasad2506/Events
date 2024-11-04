import { Table, TableHead, TableRow, TableCell, TablePagination, TableSortLabel } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState, useEffect } from "react";
import * as EventService from "../services/eventService"

const useStyles = makeStyles(theme => ({
    table: {
        marginTop: theme.spacing(3),
        '& thead th': {
            fontWeight: '600',
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
        },
        '& tbody td': {
            fontWeight: '300',
        },
        '& tbody tr:hover': {
            backgroundColor: '#fffbf2',
            cursor: 'pointer',
        },
    },
}));

export default function useTable(events, setevents, headCells, filterFn) {
    const classes = useStyles();
    
    const pages = [5, 10, 25];
    const [totalEvents,setTotalEvents]=useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
    const [order, setOrder] = useState()
    const [orderBy, setOrderBy] = useState()

    const fetchEvents = async (rowsPerPage,page) => {
        try {
            const data = await EventService.getEventsPerPage(rowsPerPage,page+1);
            if (Array.isArray(data.events)) {
                setevents(data.events);
                setTotalEvents(data.totalEvents)
            } else {
                console.error("Expected an array but got:", data);
                setevents([]);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            setevents([]);
        }
    };

    useEffect(() => {
        fetchEvents(rowsPerPage,page);
    }, [page,rowsPerPage]);
    const TblContainer = (props) => {
        return (
            <Table className={classes.table}>
                {props.children}
            </Table>
        );
    };

    const TblHead = () => {
        const handleSortRequest = cellId =>{
            const isAsc = orderBy === cellId && order ==="asc"
            setOrder(isAsc?'desc':'asc')
            setOrderBy(cellId)
        }
        return (
            <TableHead>
                <TableRow>
                    {headCells.map(headCell => (
                        <TableCell key={headCell.id} sortDirection={orderBy === headCell.id?order:false}>
                        {
                            headCell.disableSorting?headCell.label:
                            <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id?order:'asc'} onClick={()=>{handleSortRequest(headCell.id)}}>
                                {headCell.label}
                            </TableSortLabel>
                        }
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function stableSort(array,comparator){
        const stabilizedThis = array.map((el,index)=>[el,index])
        stabilizedThis.sort((a,b)=>{
            const order = comparator(a[0],b[0]);
            if(order!==0) return order;
            return a[1] - b[1];
        })
        return stabilizedThis.map((e1)=>e1[0])
    }

    function getComparator(order, orderBy){
        return order === 'desc'?
        (a,b)=>descendingComparator(a,b,orderBy)
        : (a,b)=> -descendingComparator(a,b,orderBy)
    }

    function descendingComparator(a,b,orderBy){
        if(b[orderBy]<a[orderBy]){
            return -1;
        }
        if(b[orderBy]>a[orderBy]){
            return 1;
        }
        return 0;
    }

    const eventsAfterPagingAndSorting = () => {
        return stableSort(filterFn.fn(events),getComparator(order,orderBy))
    }

    const TblPagination = () => (
        <TablePagination
            component="div"
            page={page}
            rowsPerPageOptions={pages}
            rowsPerPage={rowsPerPage}
            count={totalEvents}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    );

    return {
        TblContainer,
        TblHead,
        TblPagination,
        eventsAfterPagingAndSorting,
        page,
        rowsPerPage,
        setTotalEvents
    };
}
