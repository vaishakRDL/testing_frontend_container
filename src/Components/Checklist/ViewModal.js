import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VerifyModal from './VerifyModal';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { getMachines } from '../../ApiService/LoginPageService';

const ViewModal = ({
    isAddButton, editData, setRefreshData, viewModalOpen, setViewModalOpen, selectedRow
}) => {
    const [rowId, setRowId] = useState('');
    const [verifyModal, setVerifyModal] = useState(false);
    const [currentFrequency, setCurrentFrequency] = useState('');
    const [currentAnswerType, setCurrentAnswerType] = useState('');
    const [machineList, setMachineList] = useState([]);
    const [selectedMachineId, setSelectedMachineId] = useState('');
    const [machineAssinedList, setMachineAssinedList] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedRowData, setSelectedRowData] = useState([]);
    const [calenderDate, setCalenderDate] = useState(new Date());

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        setViewModalOpen(viewModalOpen);
        !isAddButton && loaderData();
    }, [editData]);

    useEffect(() => {
        viewModalOpen && getMachines(handleMachinesList, handleMachineListException);
    }, [viewModalOpen])

    const handleMachinesList = (dataObject) => {
        setMachineList(dataObject.data || []);
    }

    const handleMachineListException = () => { }

    const ClearData = () => {
        setViewModalOpen(false);
        setSelectedMachineId('');
        setRefreshData(oldvalue => !oldvalue);
        setMachineAssinedList([])
    }

    const loaderData = () => {
        setRowId(editData?.id || '');
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const columns = [
        {
            field: 'checkname',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Checklist Name
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'frequency',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Frequency
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'status',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Status
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <Verify selectedRow={params.row} />,
            ],
        },
    ];

    function Verify(props) {
        return (
            <Button
                variant="outlined"
                size='small'
                style={{ fontWeight: 'bold' }}
                onClick={() => {
                    setVerifyModal(true)
                    setCurrentFrequency(props.selectedRow.frequency)
                    // setCurrentAnswerType(props.selectedRow.answertype)
                    setRowId(props.selectedRow.id)
                    setSelectedRowData(props.selectedRow)
                }}
            >Verify</Button>
        );
    }

    const handleAssignViewSuccess = (dataObject) => {
        setMachineAssinedList(dataObject.data);
        // setNotification({
        //     status: true,
        //     type: "success",
        //     message: dataObject.message,
        // });
        // setTimeout(() => {
        //     setRefreshData((oldValue) => !oldValue);
        //   }, 2000);
    }

    const handleAssignViewException = (errorObject, errorMessage) => {
        setMachineAssinedList([]);
        setNotification({
            status: true,
            type: "error",
            message: errorMessage,
        });
        setTimeout(() => {
        }, 2000);
    }

    const triggerApiCall = (machineId, date, id) => {
        const payload = { machineId, date, id };
        console.log(payload)
        // ViewAssignedChecklist(payload, handleAssignViewSuccess, handleAssignViewException);
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
            open={viewModalOpen}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {`View ${selectedRow.checkname}`}
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6">
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Asset</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Asset"
                                    variant="filled"
                                    size='small'
                                    value={selectedMachineId}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        setSelectedMachineId(selectedId);
                                        triggerApiCall(selectedId, formatDate(selectedDate), selectedRow.checklistid); // Trigger API call
                                    }}
                                >
                                    {machineList.map((data) => (
                                        <MenuItem key={data.id} value={data?.id} >{data?.machineName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                label="Date"
                                placeholder="Date"
                                variant="filled"
                                required
                                size='small'
                                type="Date"
                                value={formatDate(selectedDate)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => {
                                    const newDate = e.target.value;
                                    setSelectedDate(newDate);
                                    setCalenderDate(new Date(newDate).toString());
                                    triggerApiCall(selectedMachineId, formatDate(newDate), selectedRow.checklistid); // Trigger API call
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Box
                                sx={{
                                    width: '100%',
                                    '& .super-app-theme--header': {
                                        backgroundColor: '#93bce6',
                                        color: '#1c1919'
                                    },
                                }}
                            >
                                <DataGrid
                                    rows={machineAssinedList}
                                    columns={columns}
                                    pageSize={8}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none' }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '68vh',
                                        width: '100%',
                                        '& .super-app-theme--header': {
                                            WebkitTextStrokeWidth: '0.6px',
                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696',
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696',
                                        },
                                    }}
                                    getRowClassName={(params) => {
                                        const rowIndex = machineAssinedList.findIndex(row => row.id === params.row.id);
                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    }}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                />
                            </Box>
                        </Grid>

                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setViewModalOpen(false)
                                ClearData();
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            <VerifyModal
                verifyModal={verifyModal}
                setVerifyModal={setVerifyModal}
                currentFrequency={currentFrequency}
                // currentAnswerType={currentAnswerType}
                viewRowId={rowId}
                selectedRowData={selectedRowData}
                selectedDate={selectedDate}
                calenderDate={calenderDate}
            />
        </Dialog>
    );
}

export default ViewModal;
