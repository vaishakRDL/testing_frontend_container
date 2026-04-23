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
import { AddToolList, EditShowToolList, FIMIDDataShow, GetProcessmachineList, GetUOM, HSNCodeDataShow, ItemAdd, ItemGroupShowMaster, ItemUpdate, MainLocationDataShow, NewGenerateTool, ProductFamilyDataShow, ProductFinishDataShow, RMItemcodeDataShow, SobAdd, SobUpdate, SubLocationDataShow, UOMShowMaster, UnderLedgerDataShow } from '../../ApiService/LoginPageService';



const ToolModule = ({ open, setOpen, isAddButton, editData, setRefreshData, }) => {
    const [toolUsageLife, setToolUsageLife] = useState('');
    const [toolNo, setToolno] = useState('');
    const [msd, setMsd] = useState('');
    const [grindingSupport, setGrindingSupport] = useState('');
    const [grindingalert, setGrindingAlert] = useState('');
    const [grindingtoolLife, setGrindingToolLife] = useState('');
    const [selectedUOM, setSelectedUOM] = useState('');
    const [replaceCount, setReplaceCount] = useState('');
    const [openingCount, setOpeningCount] = useState('');
    const [selectedprocess, setSelectedProcess] = useState('');
    const [processList, setProcessList] = useState([]);
    const [uomList, setUOMList] = useState([]);
    const [toolview, setTollView] = useState(false)
    const [toolName, setToolName] = useState('');
    const [toolCost, setToolCost] = useState('');
    const [selectedMachineId, setSelectedMachineId] = useState(null);
    const [selectedProcessId, setSelectedProcessId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        LoadingData();
        open && GetUOM(handleUOMSucessShow, handleUOMExceptionShow);
        GetProcessmachineList(handleProcessMachineshow, handleProcessExceptionShow)

    }, [editData]);

    const handleUOMSucessShow = (dataObject) => {
        setUOMList(dataObject?.data || []);
    }
    const handleUOMExceptionShow = (errorObject, errorMessage) => {
    }
    const handleProcessMachineshow = (dataObject) => {
        setProcessList(dataObject?.data || []);
        // 🧩 Once process list is loaded, match editData process & set IDs
        if (editData?.process) {
            const selected = processList.find(item => item.process === editData.process);
            if (selected) {
                setSelectedProcess(selected.process);
                setSelectedProcessId(selected.processId);
                setSelectedMachineId(selected.machineId);
            }
        }
    }
    const handleProcessExceptionShow = (errorObject, errorMessage) => {
    }
    const LoadingData = () => {
        setToolno(editData?.toolNo || '');
        setToolUsageLife(editData?.toolUsageLife || '');
        setSelectedUOM(editData?.uom || '');
        setGrindingSupport(editData?.grindingSupportId || '');
        setGrindingAlert(editData?.grindingAlert || '');
        setGrindingToolLife(editData?.afterGrindingToolLife || '');
        setReplaceCount(editData?.replacementCount || '');
        setOpeningCount(editData?.openingCount || '');
        setSelectedProcess(editData?.process || '')
        setToolName(editData?.toolName || '');
        setToolCost(editData?.toolCost || '');
    }

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
            AddToolList({
                process: selectedprocess,
                processId: selectedProcessId,
                machineId: selectedMachineId,
                toolNo: toolNo,
                // toolUsageLife: toolUsageLife,
                uomId: selectedUOM,
                status: 'submit',
                grindingSupportId: grindingSupport,
                ...(grindingSupport === 'YES' && {
                    grindingAlert: grindingalert,
                    // afterGrindingToolLife: grindingtoolLife
                }),
                replacementCount: replaceCount,
                openingCount: openingCount,
                toolName: toolName,
                toolCost: toolCost

            }, handleSobAddSuccess, handleSobAddException);
        } else {
            EditShowToolList({
                id: editData?.id,
                processId: selectedProcessId,
                machineId: selectedMachineId,
                process: selectedprocess,
                toolNo: toolNo,
                // toolUsageLife: toolUsageLife,
                uomId: selectedUOM,
                grindingSupportId: grindingSupport,
                ...(grindingSupport === 'YES' && {
                    grindingAlert: grindingalert,
                    // afterGrindingToolLife: grindingtoolLife
                }),
                replacementCount: replaceCount,
                openingCount: openingCount,
                toolName: toolName,
                toolCost: toolCost
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

    // const handleSobAddException = () => {
    //     ClearData();
    //     setTollView(false);

    // }
    const handleSobAddException = (errorObject, error) => {
        console.log("the error ", error);
        ClearData();
        setTollView(false);
        setNotification({
            status: true,
            type: 'error',
            message: errorObject.error,
        });
        setTimeout(() => {
            // handleClose();
            setLoading(false);
        }, 2000);
    };
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

    const handleGenerateToolSuccess = (dataObject) => {
        // setToolno(dataObject?.tool || '')
    };

    const handleGenerateToolException = () => {

    };
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add Tool' : 'Edit Tool'}

            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>

                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Process</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    variant="filled"
                                    label="Process"
                                    size="small"
                                    required
                                    value={selectedprocess}
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;

                                        // Find the selected object
                                        const selectedData = processList.find(item => item.process === selectedValue);

                                        if (selectedData) {
                                            setSelectedProcess(selectedData.process);      // process name
                                            setSelectedMachineId(selectedData.machineId);  // machineId
                                            setSelectedProcessId(selectedData.processId);  // processId
                                        }

                                        // Call your API with the selected machine name
                                        // NewGenerateTool(
                                        //     { machineName: selectedValue },
                                        //     handleGenerateToolSuccess,
                                        //     handleGenerateToolException
                                        // );
                                    }}
                                >
                                    {processList.map((data) => (
                                        <MenuItem key={data.id} value={data.process}>
                                            {data.process}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>

                            <TextField
                                id="filled-basic"
                                label="Tool No"
                                variant="filled"
                                sx={{ mb: 1 }}
                                size="small"
                                fullWidth
                                required
                                value={toolNo}
                                placeholder="Tool No"
                                onChange={(e) => {
                                    // const newValue = e.target.value;
                                    // const oldParts = toolNo.split("/");
                                    // const prefix = oldParts.slice(0, -1).join("/"); // fixed part
                                    // let suffix = newValue.split("/").pop();         // user input for last part

                                    // // ✅ Allow only numbers in suffix
                                    // if (/^\d*$/.test(suffix)) {
                                    //     setToolno(`${prefix}/${suffix}`);
                                    // }
                                    setToolno(e.target.value);
                                }}
                            />



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
                                value={toolName}
                                placeholder="Tool Name"
                                onChange={(e) => {
                                    setToolName(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                id="filled-basic"
                                label="Tool Cost"
                                variant="filled"
                                sx={{ mb: 1 }}
                                size='small'
                                fullWidth
                                required
                                value={toolCost}
                                placeholder="Tool Cost"
                                onChange={(e) => {
                                    setToolCost(e.target.value);
                                }}
                            />
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                id="filled-basic"
                                label="Max Tool Usage | Life"
                                variant="filled"
                                sx={{ mb: 1 }}
                                size='small'
                                fullWidth
                                required
                                value={toolUsageLife}
                                placeholder="Max Tool Usage | Life"
                                onChange={(e) => {
                                    setToolUsageLife(e.target.value);
                                }}
                            />
                        </Grid> */}
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">UOM</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    variant="filled"
                                    label='UOM'
                                    size='small'
                                    required
                                    value={selectedUOM}
                                    onChange={(e) => setSelectedUOM(e.target.value)}
                                >
                                    {uomList.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Grinding Supportd</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    variant="filled"
                                    label='Grinding Support'
                                    size='small'
                                    required
                                    value={grindingSupport}
                                    onChange={(e) => setGrindingSupport(e.target.value)}
                                >
                                    <MenuItem value='YES'>YES</MenuItem>
                                    <MenuItem value='NO'>NO</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>

                        {grindingSupport === 'YES' && (
                            <> <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                                <TextField
                                    id="filled-basic"
                                    label="Grinding Alert"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    size='small'
                                    fullWidth
                                    required
                                    value={grindingalert}
                                    placeholder="Grinding Alert"
                                    onChange={(e) => {
                                        setGrindingAlert(e.target.value);
                                    }}
                                />
                            </Grid>
                                {/* <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>

                                    <TextField
                                        id="filled-basic"
                                        label="   After Grinding Tool Life"
                                        variant="filled"
                                        sx={{ mb: 1 }}
                                        size='small'
                                        fullWidth
                                        required
                                        value={grindingtoolLife}
                                        placeholder="   After Grinding Tool Life"
                                        onChange={(e) => {
                                            setGrindingToolLife(e.target.value);
                                        }}
                                    />
                                </Grid> */}
                            </>)}
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                            <TextField
                                id="filled-basic"
                                label="Tool Replacement Count"
                                variant="filled"
                                sx={{ mb: 1 }}
                                size='small'
                                fullWidth
                                required
                                value={replaceCount}
                                placeholder="Tool Replacement Count"
                                onChange={(e) => {
                                    setReplaceCount(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>

                            <TextField
                                id="filled-basic"
                                label="Opening Count"
                                variant="filled"
                                sx={{ mb: 1 }}
                                size='small'
                                fullWidth
                                required
                                value={openingCount}
                                placeholder="Opening Count"
                                onChange={(e) => {
                                    setOpeningCount(e.target.value);
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

export default ToolModule
