// import React, { useState } from 'react'
// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import { AppBar, Button, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Toolbar, Tooltip, useMediaQuery } from '@mui/material';
// import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';
// import { styled } from '@mui/material/styles';
// import Paper from '@mui/material/Paper';
// import { DataGrid } from '@mui/x-data-grid';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import SearchIcon from '@mui/icons-material/Search';
// // import { MaintenanceAprovalshow } from '../../../services/LoginServiceNod';
// import { useEffect } from 'react';
// // import { PendingView } from '../MaintenanceStatus/PendingView';
// // import { MaintenanceAprovalshow } from '../../../../Services/NodeJsApiServices';
// import { PendingView } from '../../PendingView';
// import { MaintanenceScheduleList } from '../../../../ApiService/LoginPageService';

// const MaintenanceSchedule = ({ count, setCount }) => {
//     const [open, setOpen] = useState(false);
//     const [rowid, setRowid] = useState([]);
//     const [rowdata, setrowdata] = useState(false);

//     const [refresh, setRefresh] = useState(false);



//     const columns = [
//         {
//             field: 'machine',
//             headerClassName: 'super-app-theme--header',
//             headerName: 'Machine Name',
//             minWidth: 130, flex: 1, align: 'center', headerAlign: 'center'
//         },
//         {
//             field: 'toolNo',
//             headerClassName: 'super-app-theme--header',
//             headerName: 'Tool No',
//             minWidth: 130, flex: 1, align: 'center', headerAlign: 'center'
//         },
//         {
//             field: 'maintenance_type',
//             headerClassName: 'super-app-theme--header',
//             headerName: 'Maintenance Type',
//             minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
//         },
//         {
//             field: 'affectedMachines',
//             headerClassName: 'super-app-theme--header',
//             headerName: 'Affected Machine',
//             minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
//         },
//         {
//             field: 'severity',
//             headerClassName: 'super-app-theme--header',
//             headerName: 'Severity',
//             minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
//         },
//         {
//             field: 'problem_note',
//             headerClassName: 'super-app-theme--header',
//             headerName: 'Problem Note',
//             minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
//         },
//         // {
//         //     field: 'fromdate',
//         //     headerClassName: 'super-app-theme--header',
//         //     headerName: 'Scheduled Date',
//         //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
//         // },
//         // {
//         //     field: 'fromtime',
//         //     headerClassName: 'super-app-theme--header',
//         //     headerName: 'Scheduled Time',
//         //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
//         // },

//         {
//             field: 'actions',
//             type: 'actions',
//             headerName: 'Action',
//             flex: 1,

//             getActions: (params) => [
//                 <ViewTable selectedRow={params.row} />,
//             ],
//         },
//     ];

//     function ViewTable({ selectedRow }) {
//         return (
//             <Tooltip title="Edit Data">
//                 <RemoveRedEyeIcon onClick={(event) => {
//                     event.stopPropagation();
//                     setrowdata(selectedRow)
//                     setRowid(selectedRow.id)
//                     setOpen(true);
//                 }} />
//             </Tooltip>
//         )
//     }


//     const Item = styled(Paper)(({ theme }) => ({
//         backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//         ...theme.typography.body2,
//         padding: theme.spacing(1),
//         textAlign: 'center',
//         color: theme.palette.text.secondary,
//     }));
//     const [row1, setrow1] = useState([])

//     useEffect(() => {
//         MaintanenceScheduleList(
//             (dataObject) => {
//                 const data = dataObject.data || [];
//                 setrow1(data);
//                 const count = data.length; // Count the data
//                 console.log("length==", count); // Log the count here
//                 setCount(count); // Set the count state if needed elsewhere in the component
//             },
//             (error) => {
//                 console.log("error==", error)
//             }
//         )
//         console.log("count==", count)
//     }, [refresh]);

//     // const handelMaintenanceAprovalshow = (dataObject) => {
//     //     const data = dataObject.data || [];
//     //     setrow1(data);
//     //     const count = data.length; // Count the data
//     //     console.log("length==", count); // Log the count here
//     //     setCount(count); // Set the count state if needed elsewhere in the component
//     // };

//     // const MaintenanceAprovalshowException = () => {

//     // }

//     return (
//         <div>
//             <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '15px' }}>
//                 <Typography
//                     sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
//                     variant="h5">
//                     Maintenance Approval
//                 </Typography>
//             </div>
//             <Grid conatiner spacing={1}>
//                 <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={1}>
//                     <Card style={{ boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)', borderRadius: '10px', width: '100%', height: '100%' }}>
//                         <CardContent>
//                             {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end',marginBottom:'5px' }}>
//                                <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
//                                 <TextField
//                                     fullWidth
//                                     label="Search"
//                                     placeholder='Search'
//                                     variant="outlined"
//                                     size="small"
//                                     InputProps={{
//                                         startAdornment: (
//                                             <InputAdornment position="start">
//                                                 <SearchIcon />
//                                             </InputAdornment>
//                                         ),
//                                     }}
//                                 />
//                                 </Grid>
//                                  </div> */}

//                             <DataGrid
//                                 rows={row1}
//                                 columns={columns}
//                                 initialState={{
//                                     pagination: {
//                                         paginationModel: {
//                                             pageSize: 5,
//                                         },
//                                     },
//                                 }}
//                                 sx={{
//                                     '& .MuiDataGrid-columnHeaders': {
//                                         color: '#000000', // Header text color
//                                         fontWeight: 'bold', // Header font weight
//                                     },
//                                     '& .MuiDataGrid-columnHeaderTitle': {
//                                         fontWeight: 'bold', // Ensures the header font weight is bold
//                                     },
//                                 }}
//                                 pageSizeOptions={[5]}
//                                 checkboxSelection
//                                 disableRowSelectionOnClick
//                             />
//                             {open && (
//                                 <PendingView
//                                     open={open}
//                                     setOpen={setOpen}
//                                     rowid={rowid}
//                                     setRowid={setRowid}
//                                     rowdata={rowdata}
//                                     setrowdata={setrowdata}
//                                     setRefresh={setRefresh}
//                                 />
//                             )}
//                         </CardContent>
//                     </Card>


//                 </Grid>
//             </Grid>
//         </div>
//     )
// }
// export default MaintenanceSchedule;
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { PendingView } from "../../PendingView";
import { MaintanenceScheduleList } from "../../../../ApiService/LoginPageService";

const MaintenanceSchedule = ({ count, setCount }) => {
    const [open, setOpen] = useState(false);
    const [rowId, setRowId] = useState(null);
    const [rowData, setRowData] = useState(null);
    const [rows, setRows] = useState([]);
    const [refresh, setRefresh] = useState(false);

    // ================== FETCH DATA ==================
    const fetchData = useCallback(() => {
        MaintanenceScheduleList(
            (res) => {
                const data = res?.data || [];
                setRows(data);
                setCount(data.length);
            },
            (err) => console.error("API Error:", err)
        );
    }, [setCount]);

    useEffect(() => {
        fetchData();
    }, [fetchData, refresh]);

    // ================== ACTION CLICK ==================
    const handleView = useCallback((row) => {
        setRowData(row);
        setRowId(row.id);
        setOpen(true);
    }, []);

    // ================== COLUMNS ==================
    const columns = useMemo(
        () => [
            {
                field: "machine",
                headerName: "Machine Name",
                flex: 1,
                minWidth: 140,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "toolNo",
                headerName: "Tool No",
                flex: 1,
                minWidth: 120,
                align: "center",
                headerAlign: "center",

            },
            {
                field: "maintenance_type",
                headerName: "Maintenance Type",
                flex: 1,
                minWidth: 150,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "affectedMachines",
                headerName: "Affected Machine",
                flex: 1,
                minWidth: 150,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "severity",
                headerName: "Severity",
                flex: 1,
                minWidth: 120,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "problem_note",
                headerName: "Problem Note",
                flex: 1.5,
                minWidth: 200,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Action",
                flex: 0.7,
                getActions: (params) => [
                    <Tooltip title="View Details" key={params.id}>
                        <RemoveRedEyeIcon
                            sx={{ cursor: "pointer", color: "#212529" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleView(params.row);
                            }}
                        />
                    </Tooltip>,
                ],
            },
        ],
        [handleView]
    );

    // ================== UI ==================
    return (
        <Box sx={{ p: 2 }}>
            {/* HEADER */}
            <Typography
                variant="h5"
                sx={{
                    fontWeight: "bold",
                    mb: 2,
                    color: "#212529",
                }}
            >
                Maintenance Approval ({rows.length})
            </Typography>

            {/* CARD */}
            <Card
                sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                }}
            >
                <CardContent>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        autoHeight
                        pageSizeOptions={[5, 10, 20]}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 5 },
                            },
                        }}
                        disableRowSelectionOnClick
                        // checkboxSelection
                        sx={{
                            border: "none",

                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#93bce6",
                                fontWeight: "bold",
                            },

                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "#f1f7ff",
                            },
                        }}
                    />
                </CardContent>
            </Card>

            {/* MODAL */}
            {open && (
                <PendingView
                    open={open}
                    setOpen={setOpen}
                    rowid={rowId}
                    setRowid={setRowId}
                    rowdata={rowData}
                    setrowdata={setRowData}
                    setRefresh={setRefresh}
                />
            )}
        </Box>
    );
};

export default MaintenanceSchedule;
