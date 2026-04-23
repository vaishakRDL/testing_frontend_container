import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
    CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { CheckBox } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from '@mui/material/Autocomplete';
import { AddComplaintList, AddToolList, ComplaintMachineToolNoShow, ComplaintToolNameShow, EditComplaintList, EditShowToolList, FIMIDDataShow, GetProcessmachineList, HSNCodeDataShow, ItemAdd, ItemGroupShowMaster, ItemUpdate, MainLocationDataShow, NewGenerateTool, ProcessToolMachineList, ProductFamilyDataShow, ProductFinishDataShow, RMItemcodeDataShow, ShowComplaintOperatorList, SobAdd, SobUpdate, SubLocationDataShow, UnderLedgerDataShow } from '../../ApiService/LoginPageService';



const ToolComplaintsModule = ({ open, setOpen, isAddButton, editData, setRefreshData, }) => {
    const [toolNo, setToolno] = useState('');
    const [ToolNoNameList, setToolNoNameList] = useState([]);
    const [complainttype, setComplaintType] = useState('');
    const [toolname, setToolName] = useState('');
    const [remarks, setRemarks] = useState('');
    const [selectedOperator, setSelectedOperator] = useState('');
    const [replaceCount, setReplaceCount] = useState('');
    const [openingCount, setOpeningCount] = useState('');
    const [selectedprocess, setSelectedProcess] = useState('');
    const [processList, setProcessList] = useState([]);
    const [OperatorList, setOpeatorList] = useState([]);
    const [toolview, setTollView] = useState(false)
    const [fromDate, setFromDate] = useState('');
    const [fromTime, setFromTime] = useState('');
    const [machineList, setMachineList] = useState([]);
    const [MachineToolNoList, setMachineToolNoList] = useState([])
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [selectedMachine, setSelectedMachine] = useState('')


    useEffect(() => {
        LoadingData();
        open && ShowComplaintOperatorList(handleOpeatorSucessShow, handleOpeatorExceptionShow);
        ProcessToolMachineList(handlePlanningMachineSuccess, handlePlanningMachineFailed)

    }, [editData, isAddButton]);

    const handlePlanningMachineSuccess = (dataObject) => {
        setMachineList(dataObject?.data || []);
    };

    const handlePlanningMachineFailed = (errorObject, errorMessage) => {

    };
    const handleOpeatorSucessShow = (dataObject) => {
        setOpeatorList(dataObject?.data || []);
    }
    const handleOpeatorExceptionShow = (errorObject, errorMessage) => {
    }
    const handleProcessMachineshow = (dataObject) => {
        setProcessList(dataObject?.data || []);
    }
    const handleProcessExceptionShow = (errorObject, errorMessage) => {
    }
    const MachineToolNoShowSuccess = (dataObject) => {
        setMachineToolNoList(dataObject?.data || []);
    }
    const MachineToolNoException = (errorObject, errorMessage) => {
    }
    const TollNameShowSuccess = (dataObject) => {
        if (dataObject?.data) {
            // Directly set the Tool Name from the response
            setToolName(dataObject.data.toolName || '');
        } else {
            setToolName('');
        }
    };
    const TollNameShowException = (errorObject, errorMessage) => {
    }


    const LoadingData = () => {
        // Set other fields
        if (isAddButton) {
            setMachineToolNoList([]);
            setToolno('');
        }
        setSelectedOperator(editData?.operator || '');
        setComplaintType(editData?.compType || '');
        setFromDate(editData?.Date || '');
        setFromTime(editData?.Time || '');
        setSelectedMachine(editData?.machineId || '');
        setReplaceCount(editData?.replacementCount || '');
        setOpeningCount(editData?.openingCount || '');
        setRemarks(editData?.remarks || '');
        setToolName(editData?.toolName || '');

        if (!isAddButton && editData?.machineId) {
            // Fetch tool list for machine
            ComplaintMachineToolNoShow(
                { machineId: editData.machineId },
                (response) => {
                    MachineToolNoShowSuccess(response);

                    // ✅ After list is loaded, find matching ID using toolNo
                    const matchingTool = response?.data?.find(
                        tool => tool.toolNo === editData.toolNo
                    );

                    if (matchingTool) {
                        setToolno(matchingTool.id); // Set dropdown value to the tool ID
                    }
                },
                MachineToolNoException
            );
        }
    };

    // useEffect(() => {
    //     if (selectedMachine) {
    //         ComplaintMachineToolNoShow(
    //             { machineId: selectedMachine },
    //             MachineToolNoShowSuccess,
    //             MachineToolNoException
    //         );
    //     }
    // }, [selectedMachine]);

    const ClearData = () => {
        // setContractNo('');
        // setToolno('');
        // setMsd('');
        // setSheetName('');

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setTollView(true);
        if (isAddButton) {
            AddComplaintList({
                date: fromDate,
                time: fromTime,
                compType: complainttype,
                operator: selectedOperator,
                machineId: selectedMachine,
                toolNo: toolNo,
                toolName: toolname,
                remarks: remarks
            }, handleSobAddSuccess, handleSobAddException);
        } else {
            EditComplaintList({
                id: editData?.id,
                date: fromDate,
                time: fromTime,
                compType: complainttype,
                operator: selectedOperator,
                machineId: selectedMachine,
                toolNo: toolNo,
                toolName: toolname,
                remarks: remarks
            }, handleSobupdateSuccess, handleSobupdateException);
        }

    }

    const handleSobAddSuccess = (dataObject) => {
        setTollView(false);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            ClearData();
            setOpen(false);

        }, 3000);
    }

    const handleSobAddException = () => {
        ClearData();
        setTollView(false);

    }
    const handleSobupdateSuccess = (dataObject) => {
        setTollView(false);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            ClearData();
            setOpen(false);

        }, 3000);
    }

    const handleSobupdateException = () => {
        ClearData();
        setTollView(false);

    }
    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };


    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add Complaint Tool' : 'Edit Complaint Tool'}

            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                label="Date"
                                placeholder='Date'
                                variant="filled"
                                required
                                type='Date'
                                size="small"
                                style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                onChange={(e) => { setFromDate(e.target.value) }}
                                value={fromDate}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                fullWidth
                                label="Time"
                                placeholder='Time'
                                variant="filled"
                                required
                                type='Time'
                                size="small"
                                style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                onChange={(e) => { setFromTime(e.target.value) }}
                                value={fromTime}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Complaint Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    variant="filled"
                                    label='Complaint Type'
                                    size='small'
                                    required
                                    value={complainttype}
                                    onChange={(e) => setComplaintType(e.target.value)}
                                >
                                    <MenuItem value='Missing'>Missing</MenuItem>
                                    <MenuItem value='Broken'>Broken</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Operator</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    variant="filled"
                                    label='Select Operator'
                                    size='small'
                                    required
                                    value={selectedOperator}
                                    onChange={(e) => setSelectedOperator(e.target.value)}
                                >
                                    {OperatorList.map((data) => (
                                        <MenuItem key={data.id} value={data.operatorName}>{data.operatorName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
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
                                        // setReportList([]);
                                        ComplaintMachineToolNoShow({
                                            machineId: e.target.value
                                        }, MachineToolNoShowSuccess, MachineToolNoException);
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

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <FormControl fullWidth>
                                <InputLabel id="machine-select-label">Tool No</InputLabel>
                                <Select
                                    labelId="machine-select-label"
                                    id="machine-select"
                                    variant="filled"
                                    size="small"
                                    value={toolNo}
                                    onChange={(e) => {
                                        setToolno(e.target.value)
                                        ComplaintToolNameShow({
                                            toolNo: e.target.value
                                        }, TollNameShowSuccess, TollNameShowException);
                                    }}
                                >
                                    {MachineToolNoList.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>
                                            {data.toolNo}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>

                            <TextField
                                id="filled-basic"
                                label="Tool Name"
                                variant="filled"
                                sx={{ mb: 1 }}
                                size='small'
                                fullWidth
                                required
                                disabled
                                value={toolname}
                                placeholder="Tool Name"
                                onChange={(e) => {
                                    setToolName(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>

                            <TextField
                                id="filled-basic"
                                label="Reamrks"
                                variant="filled"
                                sx={{ mb: 1 }}
                                size='small'
                                fullWidth
                                required
                                rows={4}
                                multiline
                                value={remarks}
                                placeholder="Remarks"
                                onChange={(e) => {
                                    setRemarks(e.target.value);
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        type="submit"
                        disabled={toolview}
                    >
                        {/* {isAddButton ? 'Add' : 'Update'} */}
                        {toolview ? (
                            <CircularProgress size={24} style={{ color: 'white' }} />
                        ) : (
                            isAddButton ? 'Add' : 'Update'
                        )}
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);

                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
                <NotificationBar
                    handleClose={handleClose}
                    notificationContent={openNotification.message}
                    openNotification={openNotification.status}
                    type={openNotification.type}
                />

            </form>
        </Dialog>
    )
}

export default ToolComplaintsModule
