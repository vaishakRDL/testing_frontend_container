import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, CircularProgress, Button, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import { GetMachinePlanningShifts, GetPlanningMachine, ShowMachinePlanning } from '../../ApiService/LoginPageService';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import JobCardViewNewModal from '../JobCardViewNew/JobCardViewNewModal';

const MachinePlaning = () => {
    const [submitloading, setSubmitLoading] = useState(false);

    const [isLoading, setGridLoading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [sobDataList, setSobDataList] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [machineList, setMachineList] = useState([])
    const [selectedMachine, setSelectedMachine] = useState('')
    const [selectedMachineName, setSelectedMachineName] = useState('')
    const [selectedDate, setSelectedDate] = useState('');
    const [shiftLists, setShiftLists] = useState([]);
    const [selectedShift, setSelectedShift] = useState('');
    const [thickness, setThickness] = useState('');
    const [machinePlanningList, setMachinePlanningList] = useState([])
    const [isAllSelect, setIsAllSelect] = useState(true)
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [open, setOpen] = useState(false);
    const [selectedRowJobCardNo, setSelectedRowJobCardNo] = useState('');
    const [totalWorkPlanned, setTotalWorkPlanned] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };

        // Add event listener to update height on resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const columns = [
        {
            field: 'sNo',
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
            field: 'Thickness',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Thickness
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
            field: 'MRP ID',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    MRP ID
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Part Number',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Part Number
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'Description',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Description
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'JobCard No',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Job Card No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'JobCard Date',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Kanban Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Product Type',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Product Type
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'CTime',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Cycle Time
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        // {
        //     field: 'UOM Count',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             UOM Count
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },

        {
            field: 'UOM',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    UOM
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    QTY
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Produced Qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Produced QTY
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Work Planned',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Work Planned
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        }
    ];


    useEffect(() => {
        document.title = 'Machine Planning';
        GetPlanningMachine(handlePlanningMachineSuccess, handlePlanningMachineFailed)

        if (selectedMachine && selectedMachineName) {
            GetMachinePlanningShifts(
                {
                    machineName: selectedMachineName,
                    date: selectedDate,
                },
                handleGetShiftsSuccess,
                handleGetShiftsException
            );
        }

    }, [refreshData, selectedDate]);

    const handlePlanningMachineSuccess = (dataObject) => {
        setMachineList(dataObject?.data || []);
    }
    const handlePlanningMachineFailed = (errorObject, errorMessage) => {

    }

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ sNo: index + 1, ...row }));
    };
    const rowData = generateRowsWithIndex(machinePlanningList);


    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const options = sobDataList.map(item => ({
        id: item?.id,
        label: item?.contractNo
    }));

    const handleSubmitPress = () => {
        setGridLoading(true)
        setSubmitLoading(true)
        ShowMachinePlanning({
            // date: selectedDate,
            // fromDate: fromDate,
            // toDate: toDate,
            // machineId: isAllSelect ? '' : selectedMachine,
            machine: selectedMachineName,
            date: selectedDate,
            shift: selectedShift
        }, showPlanningMachineSuccess, showPlanningMachineFailed)
    }

    const showPlanningMachineSuccess = (dataObject) => {
        setGridLoading(false);
        setSubmitLoading(false)

        const updatedMachinePlanningList = dataObject?.data.map((data, index) => ({ ...data, id: index + 1 }))
        setMachinePlanningList(updatedMachinePlanningList);
        // GET TOTAL WORK PLANNED
        const totalWrkPlnd = dataObject?.data && dataObject?.data.reduce((acc, cur) => Number(acc) + Number(cur['Work Planned']), 0)
        setTotalWorkPlanned(Math.round(totalWrkPlnd))
    }
    const showPlanningMachineFailed = (errorObject, errorMessage) => {
        setGridLoading(false);
        setSubmitLoading(false)

    }

    const arrayToWorksheet = (array, keyMapping, columnWidths) => {
        // Change the key names in each object according to keyMapping
        const transformedArray = array.map(obj =>
            Object.fromEntries(Object.entries(obj).map(([key, value]) =>
                [keyMapping[key] || key, value]
            ))
        );

        const worksheet = XLSX.utils.json_to_sheet(transformedArray);

        // Set column widths
        if (columnWidths) {
            worksheet['!cols'] = columnWidths.map(width => ({ width }));
        }

        return worksheet;
    };

    const downloadExcelFile = (worksheet, filename) => {
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        XLSX.writeFile(workbook, filename);
    };

    const handleDownload = (data) => {
        // Define a key mapping for renaming keys
        let newArrayWithoutId = data.map(({ id, ...rest }) => rest);

        const keyOrder = [
            'sNo',
            'thickness',
            'mrpNo',
            'itemCode',
            'itemName',
            'jcNo',
            'kanbanDate',
            'category',
            'cycleTime',
            'uom',
            'Qty',
            'workPlanned',
        ];

        // Function to reorder keys in an object
        function reorderKeys(obj, keyOrder) {
            const result = {};
            keyOrder.forEach(key => {
                if (obj.hasOwnProperty(key)) {
                    result[key] = obj[key];
                }
            });
            return result;
        }

        const newData = newArrayWithoutId.map(item => reorderKeys(item, keyOrder));

        const keyMapping = {
            'sNo': 'SNo',
            'thickness': 'Thickness',
            'mrpNo': 'MRP ID',
            'itemCode': 'Part Number',
            'itemName': 'Description',
            'jcNo': 'Job Card No',
            'kanbanDate': 'Kanban Date',
            'category': 'Product Type',
            'cycleTime': 'Cycle Time',
            'uom': 'UOM',
            'Qty': 'Quantity',
            'workPlanned': 'Work Planned',
            // Add more key mappings as needed
        };

        // Define column widths (optional)
        const columnWidths = [10, 10, 15, 25, 25, 20, 15, 15, 10, 10, 10, 15];


        const worksheet = arrayToWorksheet(newData, keyMapping, columnWidths);
        downloadExcelFile(worksheet, 'Machine_Planning.xlsx');
    };

    const handleGetShiftsSuccess = (dataObject) => {
        setShiftLists(dataObject?.data || []);
    }
    const handleGetShiftsException = () => { }

    const handleRowClick = (params) => {
        setOpen(true);
        setSelectedRowJobCardNo(params.row['JobCard No'])
    }

    return (
        <div style={{ height: '80vh', width: '100%' }}>

            <div style={{ display: 'flex', justifyContent: 'space-around' }}>

                <Grid container spacing={2} >
                    <Grid item xs={12} sm={12} md={6} lg={2.4} xl={2.4} >
                        <TextField
                            fullWidth
                            label="Select Date"
                            placeholder='Select Date'
                            variant="filled"
                            size='small'
                            InputLabelProps={{
                                shrink: true
                            }}
                            type='date'
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value)
                            }}
                            required
                        />

                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={2.4} xl={2.4} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Machine</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Select Machine"
                                placeholder='Select Machine'
                                variant="filled"
                                size='small'
                                value={selectedMachine}
                                onChange={(e) => {

                                    machineList.map((data) => {
                                        if (data.id === e.target.value) {
                                            setSelectedMachine(e.target.value)
                                            setSelectedMachineName(data.machineName)
                                            setIsAllSelect(false);
                                            GetMachinePlanningShifts({
                                                machineName: data.machineName,
                                                date: selectedDate
                                            }, handleGetShiftsSuccess, handleGetShiftsException)
                                        }
                                    })
                                }}
                                required
                            >
                                {/* <MenuItem key="all" value="all">All Machines</MenuItem> */}
                                {machineList.map((data) => (
                                    <MenuItem key={data.id} value={data.id}>{data.machineName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={2.4} xl={2.4} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Shift</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Select Shift"
                                placeholder='Select Shift'
                                variant="filled"
                                size='small'
                                value={selectedShift}
                                onChange={(e) => {
                                    setSelectedShift(e.target.value)
                                }}
                                required
                            >
                                {shiftLists.map((data) => (
                                    <MenuItem key={data.shift} value={data.shift}>{data.shift}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={1} xl={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <Button
                            variant="contained"
                            onClick={handleSubmitPress}
                            disabled={submitloading}
                            style={{ backgroundColor: '#002d68' }}
                        >
                            {submitloading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={6} lg={1} xl={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <Button
                            variant="contained"
                            endIcon={<FileDownloadIcon />}
                            disabled={rowData.length > 0 ? false : true}
                            style={{
                                backgroundColor: rowData.length > 0 ? '#002d68' : '#C7C8CC',
                            }}
                            onClick={() => handleDownload(rowData)}
                        >
                            DOWNLOAD
                        </Button>
                    </Grid> */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                        <Card style={{ borderRadius: '8px', height: '100%', marginTop: '-5px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                            <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <DataGrid
                                    rows={rowData}
                                    columns={columns}
                                    pageSize={8}
                                    loading={isLoading}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    onRowClick={handleRowClick}
                                    // style={{ border: 'none', fontWeight: 'bold' }}
                                    sx={{
                                        overflow: 'auto',
                                        cursor: 'pointer',
                                        height: screenHeight - 367,
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
                                        // const rowIndex = rowData.findIndex(row => row.id === params.row.id);
                                        // // Check if the index is valid
                                        // if (rowIndex !== -1) {
                                        //     console.log(' ');
                                        //     return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        // }

                                        // const status = params.row.statusDisplay;
                                        if (params.row['Produced Qty'] > params.row.Qty) {
                                            return "MuiDataGrid-cell--red";
                                        }
                                        if (params.row['Produced Qty'] === params.row.Qty) {
                                            return "MuiDataGrid-cell--green";
                                        }
                                        if (params.row['Produced Qty'] < params.row.Qty) {
                                            return "MuiDataGrid-cell--yellow";
                                        }

                                        return ''; // Return default class if index is not found
                                    }}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                />
                            </CardContent>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', columnGap: '20px', marginLeft: '15px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '5px' }}>
                                        <div style={{ width: '20px', height: '20px', backgroundColor: '#8be78b' }}></div>
                                        <Typography>Completed</Typography>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '5px' }}>
                                        <div style={{ width: '20px', height: '20px', backgroundColor: '#f7e2a0 ' }}></div>
                                        <Typography>Pending</Typography>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '5px' }}>
                                        <div style={{ width: '20px', height: '20px', backgroundColor: '#f5a546' }}></div>
                                        <Typography>Exceeded</Typography>
                                    </div>
                                </div>
                                <div>
                                    <Typography style={{ marginRight: '200px', fontWeight: 'bold' }}>Total Work Planned : {totalWorkPlanned}</Typography>
                                </div>
                            </div>
                        </Card>
                    </Grid>
                </Grid>
            </div>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            <JobCardViewNewModal
                open={open}
                setOpen={setOpen}
                selectedRowJobCardNo={selectedRowJobCardNo}
                selectedMachine={selectedMachine}
                setSelectedRowJobCardNo={setSelectedRowJobCardNo}
            />
        </div>
    )
}

export default MachinePlaning
