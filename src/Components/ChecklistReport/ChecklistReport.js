import React, { useState, useEffect, useCallback } from 'react'
import { Box, Button, Card, CardContent, Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { GetChecklistReport, MachineShowList, ToolListByMachineId } from '../../ApiService/LoginPageService';
import VerifyModal from '../Checklist/VerifyModal';

const ChecklistReport = () => {
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [Machine, setMachine] = useState('');
    const [Tool, setTool] = useState('');
    const [machineOptions, setMachineOptions] = useState([]);
    const [toolList, setToolList] = useState([]);
    const [reportLists, setReportLists] = useState([]);
    const [verifyModal, setVerifyModal] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const columns = [
        {
            field: 'srNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '15px' }}>#</span>,
            type: 'number',
            sortable: true,
            width: 80,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'toolNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Tool No</span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'toolName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Tool Name</span>,
            type: 'string',
            sortable: true,
            minWidth: 150, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'checklistName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Checklist Name</span>,
            type: 'string',
            sortable: true,
            minWidth: 180, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'checklistDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Date</span>,
            type: 'string',
            sortable: true,
            minWidth: 120, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'status',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Status</span>,
            type: 'string',
            sortable: true,
            minWidth: 120, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => {
                const status = params.row.status?.toUpperCase() || '';
                return (
                    <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: status === 'PENDING' ? '#fff3e0' : status === 'COMPLETED' ? '#e8f5e9' : '#f5f5f5',
                        color: status === 'PENDING' ? '#e65100' : status === 'COMPLETED' ? '#2e7d32' : '#333',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    }}>
                        {params.row.status || 'N/A'}
                    </span>
                );
            }
        },
        {
            field: 'issueCount',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Issues</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => {
                const count = params.value || 0;
                return (
                    <span style={{
                        color: count > 0 ? '#d32f2f' : '#2e7d32',
                        fontWeight: 'bold'
                    }}>
                        {count}
                    </span>
                );
            }
        },
    ];

    useEffect(() => {
        const handleResize = () => setScreenHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);

        // Fetch Machines initially
        MachineShowList(
            (dataObject) => setMachineOptions(dataObject?.data || []),
            () => setMachineOptions([])
        );

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMachineChange = useCallback(
        (event) => {
            const id = event.target.value;
            setMachine(id);
            setTool("");
            setToolList([]);
            if (id) {
                ToolListByMachineId({ id },
                    (dataObject) => setToolList(dataObject?.data || []),
                    () => setToolList([])
                );
            }
        },
        [setMachine, setTool]
    );

    const handleSubmit = () => {
        if (!fromDate || !toDate) {
            setNotification({ status: true, type: 'error', message: 'Please select both From Date and To Date' });
            return;
        }

        GetChecklistReport({
            fromDate: fromDate,
            toDate: toDate,
            toolId: Tool || undefined
        }, handleSubmitSucess, handleSubmitException)
    }

    const handleSubmitSucess = (dataObject) => {
        setReportLists(dataObject?.data || [])
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message || 'Report Fetched Successfully',
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    };

    const handleSubmitException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage || 'Failed to fetch report',
        });
    };

    const handleClose = () => {
        setNotification({ status: false, type: '', message: '' });
    };

    const handleRowClick = (params) => {
        setSelectedRowData(params.row);
        setVerifyModal(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                <Typography sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }} variant="h5">
                    Checklist Report
                </Typography>
            </div>

            <Grid container spacing={2} padding={1} style={{ zoom: '80%', paddingBottom: '20px' }}>
                <Grid item xs={12} sm={6} md={3} lg={2.5}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel size="small" id="demo-machine-label">Machine</InputLabel>
                        <Select
                            labelId="demo-machine-label"
                            id="demo-machine"
                            label="Machine"
                            value={Machine}
                            onChange={handleMachineChange}
                        >
                            {machineOptions.map((m) => (
                                <MenuItem key={m.id} value={m.id}>
                                    {m.machineCode}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={2.5}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel size="small" id="demo-tool-label">Tool No</InputLabel>
                        <Select
                            labelId="demo-tool-label"
                            id="demo-tool"
                            label="Tool No"
                            // size="small"
                            value={Tool}
                            onChange={(e) => setTool(e.target.value)}
                            disabled={!Machine}
                        >
                            {toolList.map((tool) => (
                                <MenuItem key={tool.id} value={tool.id}>
                                    {tool.toolNo}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <TextField
                        id="filled-basic-from"
                        label="From Date"
                        variant="outlined"
                        // size="small"
                        type="date"
                        fullWidth
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={2}>
                    <TextField
                        id="filled-basic-to"
                        label="To Date"
                        variant="outlined"
                        // size="small"
                        type="date"
                        fullWidth
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={3} lg={2} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        style={{ backgroundColor: '#002d68', width: '130px', height: '40px', fontWeight: 'bold', fontSize: '13px' }}
                    >
                        Generate
                    </Button>
                </Grid>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} margin={1}>
                <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', border: '1px solid black' }}>
                    <CardContent>
                        <Box
                            sx={{
                                height: screenHeight - 320,
                                width: "100%",
                                overflowY: "auto",
                                '&::-webkit-scrollbar': { width: '12px' },
                                '&::-webkit-scrollbar-thumb': { backgroundColor: 'black', borderRadius: '10px' },
                                '&::-webkit-scrollbar-track': { backgroundColor: 'lightgrey' },
                                scrollbarColor: "black lightgrey",
                                scrollbarWidth: "thin",
                            }}
                        >
                            <DataGrid
                                rows={reportLists}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { pageSize: 15 },
                                    },
                                }}
                                sx={{
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: '#004286',
                                        color: '#ffffff',
                                        fontWeight: 'bold',
                                    },
                                    '& .MuiDataGrid-columnHeaderTitle': {
                                        fontWeight: 'bold',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        fontSize: '14px',
                                        borderBottom: '1px solid #e0e0e0',
                                    },
                                    cursor: 'pointer',
                                }}
                                getRowClassName={(params) => {
                                    const rowIndex = reportLists.findIndex(row => row.id === params.row.id);
                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                }}
                                pageSizeOptions={[10, 15, 20, 50]}
                                disableRowSelectionOnClick
                                onRowClick={handleRowClick}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            {verifyModal && (
                <VerifyModal
                    verifyModal={verifyModal}
                    setVerifyModal={setVerifyModal}
                    viewRowId={selectedRowData?.id}
                    selectedRowData={selectedRowData}
                    currentFrequency={selectedRowData?.frequency}
                    isViewOnly={true}
                />
            )}
        </div>
    )
}

export default ChecklistReport