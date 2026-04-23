import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { AppBar, Button, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Toolbar, Tooltip, useMediaQuery } from '@mui/material';
import './Pending.css'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const columns = [
    { field: 'id', headerName: 'MAINTENANCE ID', width: 150 },
    {
        field: 'maintenanceType',
        headerName: 'MAINTENANCE TYPE',
        width: 180,
        editable: true,
    },
    {
        field: 'Department',
        headerName: 'DEPARTMENT',
        width: 150,
        editable: true,
    },
    {
        field: 'machine',
        headerName: 'MACHINE',
        type: 'number',
        width: 110,
        editable: true,
    },
    {
        field: 'severity',
        headerName: 'SEVERITY',
        type: 'number',
        width: 110,
        editable: true,
        // description: 'This column has a value getter and is not sortable.',
        // sortable: false,
        // width: 160,
        // valueGetter: (params) =>
        //     `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
        field: 'problemNote',
        headerName: 'PROBLEM NOTE',
        type: 'number',
        width: 150,
        editable: true,
    },
    {
        field: 'date',
        headerName: 'DATE',
        type: 'number',
        width: 110,
        editable: true,
    },
    {
        field: 'time',
        headerName: 'TIME',
        type: 'number',
        width: 110,
        editable: true,
    },
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Action',

        getActions: (params) => [
            <ViewTable selectedRow={params.row} />,

        ],
    },
];

function ViewTable() {
    return (
        <Tooltip title="Edit Data">
            <RemoveRedEyeIcon />
        </Tooltip>
    )
}

const rows = [
    { id: 1, maintenanceType: 'Snow', Department: 'Jon', machine: 'Shearing Machine', severity: 'critical', problemNote: 'Break down', date: '2021-07-01', time: '17:12:00', age: 35 },
    { id: 2, maintenanceType: 'Lannister', Department: 'Cersei', machine: 'Shearing Machine', severity: 'critical', problemNote: 'Break down', date: '2021-07-01', time: '17:12:00', age: 42 },
    { id: 3, maintenanceType: 'Lannister', Department: 'Jaime', machine: 'Shearing Machine', severity: 'critical', problemNote: 'Break down', date: '2021-07-01', time: '17:12:00', age: 45 },
    { id: 4, maintenanceType: 'Stark', Department: 'Arya', machine: 'Shearing Machine', severity: 'critical', problemNote: 'Break down', date: '2021-07-01', time: '17:12:00', age: 16 },
    { id: 5, maintenanceType: 'Targaryen', Department: 'Daenerys', machine: 'Shearing Machine', severity: 'critical', problemNote: 'Break down', date: '2021-07-01', time: '17:12:00', age: null },
    { id: 6, maintenanceType: 'Melisandre', Department: null, machine: 'Shearing Machine', severity: 'critical', problemNote: 'Break down', date: '2021-07-01', time: '17:12:00', age: 150 },
    { id: 7, maintenanceType: 'Clifford', Department: 'Ferrara', machine: 'Shearing Machine', severity: 'critical', problemNote: 'Break down', date: '2021-07-01', time: '17:12:00', age: 44 },
    { id: 8, maintenanceType: 'Frances', Department: 'Rossini', machine: 'Shearing Machine', severity: 'critical', problemNote: 'Break down', date: '2021-07-01', time: '17:12:00', age: 36 },
    { id: 9, maintenanceType: 'Roxie', Department: 'Harvey', machine: 'Shearing Machine', severity: 'critical', problemNote: 'Break down', date: '2021-07-01', time: '17:12:00', age: 65 },
];

const Pending = () => {

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (
        <>
            <Box
                sx={{
                    width: '100%'
                }}
                className='toolAddCardContainer'
            >
                <Typography variant="h7" component="div" sx={{ flexGrow: 1, backgroundColor: '#f7f7fc', padding: 2.5, color: '#000000', borderRadius: '5px 5px 0 0' }} >
                    Maintenance Status
                </Typography>
                <Card sx={{ borderRadius: '0 0 5px 5px', padding: '25px', boxShadow: 'none' }} >
                    <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 5,
                                    },
                                },
                            }}
                            pageSizeOptions={[5]}
                            checkboxSelection
                            disableRowSelectionOnClick
                        />
                    </CardContent>
                </Card>
            </Box>
        </>
    )
}
export default Pending;
