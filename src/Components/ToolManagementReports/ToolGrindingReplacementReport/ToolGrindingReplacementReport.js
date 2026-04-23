import { Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { GetGrindingToolsreportList, ProcessToolMachineList, ReplacementAlertReport, ToolReportbyMachine } from '../../../ApiService/LoginPageService';
import { Button } from 'react-bootstrap';

const ToolGrindingReplacementReport = () => {
    const [selectedMachine, setSelectedMachine] = useState('')
    const [toolNo, setToolNo] = useState('')
    const [fromdate, setFormdate] = useState('')
    const [todate, setTodate] = useState('')
    const [machineList, setMachineList] = useState([]);
    const [reportlist, setReportList] = useState([]);
    const [Grindingreportlist, setGrindingReportList] = useState([]);

    useEffect(() => {
        ProcessToolMachineList(handlePlanningMachineSuccess, handlePlanningMachineFailed)
        // GetGrindingToolsreportList(handleGrindingReportSuccess, handleGrindingReportException)
    }, []);



    const handlePlanningMachineSuccess = (dataObject) => {
        setMachineList(dataObject?.data || []);
    };

    const handlePlanningMachineFailed = (errorObject, errorMessage) => {

    };
    const columns = [
        {
            field: 'sno',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
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
            field: 'machineCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Machine
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
                    Process Name
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'toolName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Tool Name
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'grindingCount',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Grinding Count
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'grindingAlert',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Grinding Alert
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'toolNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Tool No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'startGrind',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Action Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'endGrind',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    End Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'grindingTime',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Grinding Time
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'replaceDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Replacement Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
    ];


    const TollReportSuccess = (dataObject) => {
        setGrindingReportList(dataObject?.data || []);

    };
    const ToolReportException = () => {

    };

    const handleReportSuccess = (dataObject) => {
        setReportList(dataObject?.data || []);

    };
    const handleReportException = () => {

    };

    const handleSubmit = () => {
        GetGrindingToolsreportList(
            {
                fromDate: fromdate,
                toDate: todate,
                machineId: selectedMachine,
            },
            TollReportSuccess,
            ToolReportException
        );
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
                        value={fromdate}
                        fullWidth
                        onChange={(e) => {
                            setFormdate(e.target.value);
                        }}
                        required
                        InputLabelProps={{ shrink: true }}
                        placeholder="From Date"
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
                        value={todate}
                        required
                        onChange={(e) => {
                            setTodate(e.target.value);
                        }}
                        InputLabelProps={{ shrink: true }}
                        placeholder="From Date"
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <FormControl fullWidth>
                        <InputLabel id="machine-select-label">Machine</InputLabel>
                        <Select
                            labelId="machine-select-label"
                            id="machine-select"
                            variant="filled"
                            size="small"
                            value={selectedMachine}
                            onChange={(e) => {
                                setSelectedMachine(e.target.value)
                                setGrindingReportList([]);

                            }}
                        >
                            {machineList.map((data) => (
                                <MenuItem key={data.id} value={data.id}>
                                    {data.machineName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={1.5} lg={1.5} xl={1.5}>
                    <Button
                        variant="contained"
                        style={{
                            width: "100%",
                            background: "#002D68",
                            color: "white",
                            height: '40px',
                            width: '150px',
                        }}
                        onClick={handleSubmit}
                    >
                        View
                    </Button>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {/* <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '0px', borderRadius: '10px', width: '100%', height: '100%' }}>
                        <CardContent>
                            <Grid item xs={12} sm={12}  > */}
                    <Card style={{ borderRadius: '8px', height: '100%', marginTop: '10px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                        <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <DataGrid
                                rows={Grindingreportlist}
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

export default ToolGrindingReplacementReport
