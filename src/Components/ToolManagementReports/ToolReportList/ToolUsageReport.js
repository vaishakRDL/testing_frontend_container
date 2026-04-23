import { Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react'
import { ToolUsageReportList } from '../../../ApiService/LoginPageService';

const ToolUsageReport = () => {

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [toolUsageData, setToolUsageData] = useState([]);

    const columns = [
        {
            field: 'machineCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Machine Code
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Code
                </span>,
            type: 'string',
            sortable: true,
            // minWidth: 50,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'jobcardNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    JobCard No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'process',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Process
                </span>,
            type: 'string',
            sortable: true,
            // minWidth: 50,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'toolId',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Tool Id
                </span>,
            type: 'string',
            sortable: true,
            // minWidth: 50,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },


        {
            field: 'qty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Qty
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'count',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Count
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },


    ];

    const handleViewReport = () => {
        ToolUsageReportList({
            fromDate: fromDate,
            toDate: toDate
        }, handleReportSuccess, handleReportError);
    };
    const handleReportSuccess = (dataObject) => {
        setToolUsageData(dataObject?.data || []);
    };
    const handleReportError = (error) => {
        console.error('Tool Usage Report error', error);
    }
    return (
        <div>
            <Grid container spacing={2} style={{ display: 'flex', }}>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <TextField
                        id="filled-basic"
                        label="From Date"
                        variant="filled"
                        type='date'
                        size='small'
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        placeholder="From Date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <TextField
                        id="filled-basic"
                        label="From Date"
                        variant="filled"
                        type='date'
                        size='small'
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        placeholder="From Date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <Button variant="contained" color="primary" style={{
                        background: "#002D68", width: '100%',
                        height: '40px', marginTop: '8px', textTransform: 'none', fontSize: '16px',
                    }} fullWidth
                        onClick={handleViewReport}
                    >
                        View</Button>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {/* <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '0px', borderRadius: '10px', width: '100%', height: '100%' }}>
                        <CardContent>
                            <Grid item xs={12} sm={12}  > */}
                    <Card style={{ borderRadius: '8px', height: '100%', marginTop: '10px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                        <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <DataGrid
                                rows={toolUsageData}
                                columns={columns}
                                pageSize={8}
                                // loading={isLoading}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ border: 'none', fontWeight: 'bold' }}
                                sx={{
                                    overflow: 'auto',
                                    height: '60vh',
                                    // minHeight: '500px',
                                    width: '100%',
                                    '& .super-app-theme--header': {
                                        WebkitTextStrokeWidth: '0.6px',
                                        backgroundColor: '#93bce6',
                                        color: '#1c1919'
                                    },
                                    '& .MuiDataGrid-cell': {
                                        border: '1px solid #969696',
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        border: '1px solid #969696', // Add border to column headers
                                    },
                                }}
                                getRowClassName={(params) => {
                                    // Find the index of the row within the rows array
                                    const rowIndex = [].findIndex(row => row.id === params.row.id);
                                    // Check if the index is valid
                                    if (rowIndex !== -1) {
                                        console.log(' ');
                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    }
                                    return ''; // Return default class if index is not found
                                }}

                                rowHeight={40}
                                columnHeaderHeight={40}
                            />
                        </CardContent>
                    </Card>
                </Grid>
                {/* </CardContent>
                    </Card>
                </Grid> */}
            </Grid>
        </div>
    )
}

export default ToolUsageReport
