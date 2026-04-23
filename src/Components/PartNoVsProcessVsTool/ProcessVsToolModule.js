import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
    Popper,
    ListItemText,
    OutlinedInput,
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
import { AddProcessToolvs, EditProcessToolvs, FIMIDDataShow, HSNCodeDataShow, ItemAdd, ItemGroupShowMaster, ItemSearchNAAJ, ItemUpdate, ItemsDataShow, MainLocationDataShow, ProcessToolMachineList, ProcessToolProcessList, ProcesstoolNoList, ProductFamilyDataShow, ProductFinishDataShow, RMItemcodeDataShow, SobAdd, SobUpdate, SubLocationDataShow, UOMShowMaster, UnderLedgerDataShow } from '../../ApiService/LoginPageService';
import FilledInput from '@mui/material/FilledInput';
import { data } from 'autoprefixer';


const ProcessVsToolModule = ({ open, setOpen, isAddButton, editData, setRefreshData, }) => {

    const [msd, setMsd] = useState('');
    const [sheetName, setSheetName] = useState('');
    const [processList, setProcessList] = useState([]);
    const [selectedProcess, setSelectedProcess] = useState([]);
    const [toolNo, setToolNo] = useState('');
    const [machineList, setMachineList] = useState([]);
    const [toolNoList, setToolNoList] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState('')
    const [machineOperator, setMachineOperator] = useState([]);
    console.log("machineOperatormachineOperatorw2", machineOperator)
    const [machineOperatorID, setMachineOperatorID] = useState([]);
    const [machOperatorInt, setMachOperatorInt] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        open && ProcessToolMachineList(handlePlanningMachineSuccess, handlePlanningMachineFailed)
        open && ProcesstoolNoList(handletoolNoListDataSuccess, handletoolNoListDataException);
        if (!isAddButton) {
            ProcessToolProcessList(
                { id: editData?.machineId },
                handleSucessProcessList,
                handleExceptionProcessList
            );
        }

        if (!isAddButton) {
            setSelectedMachine(editData?.machineId); // set machine id
            setSelectedProcess(JSON.parse(editData?.process)); // set machine id
            setToolNo(editData?.toolId);
        } // set machine id}
    }, [editData, open]);

    const handlePlanningMachineSuccess = (dataObject) => {
        setMachineList(dataObject?.data || []);
    };

    const handlePlanningMachineFailed = (errorObject, errorMessage) => {

    };

    const handletoolNoListDataSuccess = (dataObject) => {
        setToolNoList(dataObject?.data || []);

    };

    const handletoolNoListDataException = (errorObject, errorMessage) => {

    }


    const handleSucessProcessList = (dataObject) => {
        console.log("q334344343", dataObject?.data)
        setProcessList(dataObject?.data || []);
    };

    const handleExceptionProcessList = (err) => {
        console.error("Error fetching process list:", err);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (isAddButton) {
            AddProcessToolvs({

                machineId: selectedMachine,
                process: selectedProcess,
                toolId: toolNo,
                processId: machineOperatorID
            }, handleSobAddSuccess, handleSobAddException);
        } else {
            EditProcessToolvs({
                id: editData?.id,
                machineId: selectedMachine,
                process: selectedProcess,
                toolId: toolNo,
                processId: machineOperatorID
            }, handleSobupdateSuccess, handleSobupdateException);
        }

    }

    const handleSobAddSuccess = (dataObject) => {
        setLoading(false);

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setOpen(false);

        }, 3000);
    }

    const handleSobAddException = (errorObject, errorMessage) => {
        setLoading(false);

    }
    const handleSobupdateSuccess = (dataObject) => {
        setLoading(false);

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setOpen(false);

        }, 3000);
    }

    const handleSobupdateException = (errorObject, errorMessage) => {
        setLoading(false);

    }
    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };




    const handleMachineChange = (e) => {
        setSelectedProcess([]);
        setMachineOperatorID([]);
        const selectedId = e.target.value;
        setSelectedMachine(selectedId);

        // API Call
        ProcessToolProcessList(
            { id: selectedId },
            handleSucessProcessList,
            handleExceptionProcessList
        );
    };

    const handleProcessChange = (event) => {

        // const {
        //     target: { value }
        // } = event;
        // setSelectedProcess(typeof value === 'string' ? value.split(',') : value);
        const {
            target: { value },
        } = event;
        // On autofill we get a stringified value.
        const selectedValues = typeof value === 'string' ? value.split(',') : value;
        setSelectedProcess(selectedValues);
        // Update machineOperatorID based on selected names
        const selectedIDs = selectedValues.map((selectedValue) =>
            processList.find((item) => item.process === selectedValue).id
        );
        setMachineOperatorID(selectedIDs);
    };

    console.log("editData?.process", editData?.process)
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="md"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add Process Vs Tools' : 'Edit Process Vs Tools'}

            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl fullWidth>
                                <InputLabel id="machine-select-label">Machine</InputLabel>
                                <Select
                                    labelId="machine-select-label"
                                    id="machine-select"
                                    variant="filled"
                                    size="small"
                                    value={selectedMachine}
                                    onChange={handleMachineChange}
                                >
                                    {machineList.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>
                                            {data.machineName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl fullWidth>
                                <InputLabel id="process-select-label">Process</InputLabel>
                                <Select
                                    labelId="process-select-label"
                                    id="process-select"
                                    variant="filled"
                                    multiple
                                    size="small"
                                    value={selectedProcess}
                                    onChange={handleProcessChange}
                                    input={<FilledInput label="Process" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 224,
                                                width: 250
                                            }
                                        }
                                    }}
                                >

                                    {processList.map((data) => (
                                        <MenuItem key={data.id} value={data.process}>
                                            <Checkbox checked={selectedProcess.indexOf(data.process) > -1} />
                                            <ListItemText primary={data.process} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Tools No </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    variant="filled"
                                    label='Tools No'
                                    size='small'
                                    value={toolNo}
                                    onChange={(e) => {
                                        setToolNo(e.target.value)
                                    }}
                                >
                                    {toolNoList.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>{data.toolNo}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>


                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
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

export default ProcessVsToolModule
