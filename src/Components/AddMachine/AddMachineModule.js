import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel,
    CircularProgress,
} from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from "@mui/icons-material/Search";
import { AddMachine, MachineEdit, ShowMachineOperator, GetShift, ShowProcessMaster, getMachineUOM } from '../../ApiService/LoginPageService';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const AddMachineModule = ({
    open, setOpen, isAddButton, editData, setRefreshData,
}) => {
    const [utilization, setUtilization] = useState('');
    const [machineName, setMachineName] = useState('');
    const [machineCode, setMachineCode] = useState('');
    const [machineOperator, setMachineOperator] = useState([]);
    const [machineOperatorID, setMachineOperatorID] = useState([]);
    const [efficiency, setEfficiency] = useState('');
    const [capacityTarget, setCapacityTarget] = useState('');
    const [utilizationUnits, setUtilizationUnits] = useState('');
    const [days, setDays] = useState('');
    const [checkedDays, setCheckedDays] = useState({
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
        Sunday: false
    });
    const [time, setTime] = useState('');
    const [selectedShift, setSelectedShift] = useState([]);
    const [machineHourRate, setMachineHourRate] = useState('');
    const [rowId, setRowId] = useState('')
    const [machineOperatorList, setMachineOperatorList] = useState([]);
    const [shiftList, setShiftList] = useState([]);
    const [machineUOMList, setMachineUOMList] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setOpen(open);
        open && ShowProcessMaster(handleMachineOperatorSucessShow, handleMachineOperatorExceptionShow);
        open && GetShift(handleShiftSucessShow, handleShiftExceptionShow);
        !isAddButton && loaderData();
    }, [editData]);

    const handleSubmit = (event) => {
        setLoading(true);
        event.preventDefault();
        if (isAddButton) {
            AddMachine({
                machName: machineName,
                machCode: machineCode,
                machOperator: machineOperator,
                machOperatorInt: machineOperatorID,
                efficiency: efficiency,
                utilization: utilization,
                capOrTarget: capacityTarget,
                utilizationUnit: utilizationUnits,
                days: checkedDays,
                time: time,
                shift: selectedShift,
                machHrRate: machineHourRate
            }, handleSuccess, handleException);
        } else {
            MachineEdit({
                id: rowId,
                machName: machineName,
                machCode: machineCode,
                machOperator: machineOperator,
                machOperatorInt: machineOperatorID,
                efficiency: efficiency,
                utilization: utilization,
                capOrTarget: capacityTarget,
                utilizationUnit: utilizationUnits,
                days: checkedDays,
                time: time,
                shift: selectedShift,
                machHrRate: machineHourRate
            }, handleSuccess, handleException);
        }

    };

    const handleSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setLoading(false);
        }, 2000);
    };
    const handleException = (errorObject, errorMessage) => {
        console.log("the error ", errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
            setLoading(false);
        }, 2000);
    };

    // GET MACHINE OPERATOR
    const handleMachineOperatorSucessShow = (dataObject) => {
        setMachineOperatorList(dataObject?.data || []);
        // TO GET THE UOM WHILE EDITING
        !isAddButton && getMachineUOM({ machOperatorInt: editData?.machOperatorInt }, handleMachineUOMSucessShow, handleMachineUOMExceptionShow);
    }
    const handleMachineOperatorExceptionShow = (errorObject, errorMessage) => {
    }

    // GET SHIFT
    const handleShiftSucessShow = (dataObject) => {
        setShiftList(dataObject?.data || []);
    }
    const handleShiftExceptionShow = (errorObject, errorMessage) => {
    }

    const ClearData = () => {
        setOpen(false);
        setMachineName('');
        setMachineCode('');
        setMachineOperator([]);
        setMachineOperatorID([]);
        setEfficiency('');
        setUtilization('');
        setCapacityTarget('');
        setUtilizationUnits('');
        setCheckedDays({
            Monday: false,
            Tuesday: false,
            Wednesday: false,
            Thursday: false,
            Friday: false,
            Saturday: false,
        });
        setTime('');
        setSelectedShift([]);
        setMachineHourRate('');
        setRefreshData(oldvalue => !oldvalue);
    }

    const loaderData = () => {
        setRowId(editData?.id || '')
        setMachineName(editData?.machineName || '');
        setMachineCode(editData?.machineCode || '');
        setMachineOperator(editData?.machineOperator || '');
        setMachineOperatorID(editData?.machOperatorInt || '');
        setEfficiency(editData?.efficiency || '');
        setUtilization(editData?.utilization || '');
        setCapacityTarget(editData?.capOrTarget || '');
        setUtilizationUnits(editData?.uomId || '');
        setCheckedDays(editData?.days || '');
        setTime(editData?.time || '');
        setSelectedShift(editData?.shift || '');
        setMachineHourRate(editData?.machHrRate || '');
    }


    const validateForNullValue = (value, type) => {

    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        // On autofill we get a stringified value.
        const selectedValues = typeof value === 'string' ? value.split(',') : value;
        setMachineOperator(selectedValues);
        // Update machineOperatorID based on selected names
        const selectedIDs = selectedValues.map((selectedValue) =>
            machineOperatorList.find((item) => item.name === selectedValue).id
        );
        setMachineOperatorID(selectedIDs);
        getMachineUOM({ machOperatorInt: selectedIDs }, handleMachineUOMSucessShow, handleMachineUOMExceptionShow);
    };

    // GET UOM LIST
    const handleMachineUOMSucessShow = (dataObject) => {
        setMachineUOMList(dataObject?.data || []);
    }
    const handleMachineUOMExceptionShow = (errorObject, errorMessage) => {
    }


    const handleShiftChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedShift(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleDayChange = (day) => (event) => {
        setCheckedDays((prevCheckedDays) => ({
            ...prevCheckedDays,
            [day]: event.target.checked,
        }));
    };

    const isAllChecked = Object.values(checkedDays).every((value) => value === true);

    const handleAllChange = () => {
        const newCheckedState = {};
        for (const day in checkedDays) {
            newCheckedState[day] = !isAllChecked;
        }
        setCheckedDays(newCheckedState);
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {isAddButton ? "Add Machine" : "Edit Machine"}
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Machine Name"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                size='small'
                                value={machineName}
                                onChange={(e) => setMachineName(e.target.value)}
                                placeholder="Machine Name"
                                disabled={!isAddButton}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Machine Code"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                value={machineCode}
                                onChange={(e) => setMachineCode(e.target.value)}
                                placeholder="Machine Code"
                            // disabled={!isAddButton}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} marginTop={1}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-multiple-checkbox-label">Process</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    variant="filled"
                                    multiple
                                    value={machineOperator}
                                    size='small'
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Process" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {machineOperatorList.map((data) => (
                                        <MenuItem key={data.id} value={data.name}>
                                            <Checkbox checked={machineOperator.indexOf(data.name) > -1} />
                                            <ListItemText primary={data.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Efficiency"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                value={efficiency}
                                onChange={(e) => setEfficiency(e.target.value)}
                                placeholder="Efficiency"
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} alignItems={'center'} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Typography style={{ fontWeight: 'bold', marginRight: '25px' }}>Utilization</Typography>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={utilization}
                                    size='small'
                                    onChange={(e) => setUtilization(e.target.value)}
                                >
                                    <FormControlLabel value="Capacity wise" control={<Radio />} label="Capacity wise" />
                                    <FormControlLabel value="Production target" control={<Radio />} label="Production target" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Capacity / target"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                size='small'
                                value={capacityTarget}
                                onChange={(e) => setCapacityTarget(e.target.value)}
                                placeholder="Capacity / target"
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} marginTop={1}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Utilization Unit</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Department"
                                    variant="filled"
                                    size='small'
                                    value={utilizationUnits}
                                    onChange={(e) => setUtilizationUnits(e.target.value)}
                                >
                                    {machineUOMList.map((data) => (
                                        <MenuItem key={data.id} value={data?.id} >{data?.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4} display={'flex'} alignItems={'center'}>
                            <Typography style={{ fontWeight: 'bold', color: '#002D68' }}>Availability</Typography>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            alignItems={'center'}
                            style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
                        >
                            <Typography style={{ fontWeight: 'bold', marginRight: '25px' }}>
                                Day's
                            </Typography>
                            <FormControlLabel
                                control={<Checkbox checked={isAllChecked} onChange={handleAllChange} />}
                                label="All"
                            />
                            {Object.keys(checkedDays).map((day) => (
                                <FormControlLabel
                                    key={day}
                                    control={
                                        <Checkbox
                                            checked={checkedDays[day]}
                                            onChange={handleDayChange(day)}
                                        />
                                    }
                                    label={day}
                                />
                            ))}
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} alignItems={'center'} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                            <Typography style={{ fontWeight: 'bold', marginRight: '25px' }}>Time</Typography>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={time}
                                    size='small'
                                    onChange={(e) => setTime(e.target.value)}
                                >
                                    <FormControlLabel value="As per the shift" control={<Radio />} label="As per the shift" />
                                    <FormControlLabel value="ODD Time" control={<Radio />} label="Odd Time" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                            <FormControl fullWidth style={{ marginTop: '9px' }}>
                                <InputLabel id="demo-multiple-checkbox-label">Shift</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    variant="filled"
                                    multiple
                                    size='small'
                                    value={selectedShift}
                                    onChange={handleShiftChange}
                                    input={<OutlinedInput label="Shift" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {shiftList.map((data) => (
                                        <MenuItem key={data.id} value={data.shiftLabel}>
                                            <Checkbox checked={selectedShift.indexOf(data.shiftLabel) > -1} />
                                            <ListItemText primary={data.shiftLabel} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Machine Hour Rate"
                                variant="filled"
                                margin="dense"
                                fullWidth
                                size='small'
                                required
                                value={machineHourRate}
                                onChange={(e) => setMachineHourRate(e.target.value)}
                                placeholder="Machine Hour Rate"
                            />
                        </Grid>

                    </Grid>

                    <DialogActions>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            disabled={loading === true}
                        >
                            {/* {isAddButton ? 'Add' : 'Update'} */}
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (isAddButton ? 'Add' : 'Update')}
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setOpen(false)
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
        </Dialog>
    )
}

export default AddMachineModule