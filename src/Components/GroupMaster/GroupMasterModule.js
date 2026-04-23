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
import { AddMachine, MachineEdit, ShowMachineOperator, GetShift, ShowProcessMaster, getMachineUOM, CreateGroup, EditCreatedGroup } from '../../ApiService/LoginPageService';
import { AddUserValidate } from '../validation/formValidation';

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

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const GroupMasterModule = ({
    open, setOpen, isAddButton, editData, setRefreshData,
}) => {

    const [id, setId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [customerId, setCustomerID] = useState('');
    const [customerLogo, setCustomerLogo] = useState('');
    const [previewBuilding, setPreviewBuilding] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [alertLogInterval, setAlertLogInterval] = useState('');
    const [deviceLogInterval, setDeviceLogInterval] = useState('');
    const [sensorLogInterval, setSensorLogInterval] = useState('');
    const [dataRetentionPeriodInterval, setDataRetentionPeriodInterval] = useState('');
    const [expireDateReminder, setExpireDateReminder] = useState('');
    const [periodicBackupInterval, setPeriodicBackupInterval] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [GSTNumber, setGSTNumber] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [contactPersonName, setContactPersonName] = useState('');
    const [primaryContactnumber, setPrimaryContactnumber] = useState('');
    const [secondaryContactnumber, setSecondaryContactnumber] = useState('');
    const [remark, setRemark] = useState('');
    const [fileUpload, setFileUpload] = useState('');
    const [errorObject, setErrorObject] = useState({});
    const [file, setFile] = useState('');
    const URL = 'https://varmatrix.com/MachoVersion2/Macho';
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [multiOpen, setMultiOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [fileUploadOpen, setFileUploadOpen] = useState(false);
    const [partyNotes, setPartyNotes] = useState('');
    const [isEdit, setIsEdit] = useState(true);

    //NEW STATE
    const [personName, setPersonName] = React.useState([]);
    const [utilization, setUtilization] = useState('');
    const [machineName, setMachineName] = useState('');
    const [machineCode, setMachineCode] = useState('');
    const [machineOperator, setMachineOperator] = useState([]);
    const [machineOperatorID, setMachineOperatorID] = useState([]);
    console.log("machineOperator", machineOperator)
    console.log("machineOperatorID", machineOperatorID)
    const [efficiency, setEfficiency] = useState('');
    const [capacityTarget, setCapacityTarget] = useState('');
    const [utilizationUnits, setUtilizationUnits] = useState('');
    console.log("utilizationUnits", utilizationUnits)
    const [days, setDays] = useState('');
    const [checkedDays, setCheckedDays] = useState({
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
    });
    console.log("checkedDays", checkedDays)
    const [time, setTime] = useState('');
    const [selectedShift, setSelectedShift] = useState([]);
    console.log("selectedShift", selectedShift)
    const [machineHourRate, setMachineHourRate] = useState('');
    const [rowId, setRowId] = useState('')
    const [machineOperatorList, setMachineOperatorList] = useState([]);
    const [shiftList, setShiftList] = useState([]);
    const [machineUOMList, setMachineUOMList] = useState([]);
    //

    // CRAETE GROUP MENUES
    const [groupName, setGroupName] = useState('');
    const [groupCode, setGroupCode] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setOpen(open);
        // open && ShowProcessMaster(handleMachineOperatorSucessShow, handleMachineOperatorExceptionShow);
        // open && GetShift(handleShiftSucessShow, handleShiftExceptionShow);
        !isAddButton && loaderData();
    }, [editData]);

    const handleSubmit = (event) => {
        setLoading(true)
        event.preventDefault();
        if (isAddButton) {
            CreateGroup({
                groupName: groupName,
                code: groupCode,
                description: groupDescription
                // machName: machineName,
                // machCode: machineCode,
                // machOperator: machineOperator,
                // machOperatorInt: machineOperatorID,
                // efficiency: efficiency,
                // utilization: utilization,
                // capOrTarget: capacityTarget,
                // utilizationUnit: utilizationUnits,
                // days: checkedDays,
                // time: time,
                // shift: selectedShift,
                // machHrRate: machineHourRate
            }, handleSuccess, handleException);
        } else {
            EditCreatedGroup({
                id: rowId,
                groupName: groupName,
                code: groupCode,
                description: groupDescription
            }, handleSuccess, handleException);
        }

    };

    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setLoading(false)
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
            setLoading(false)
        }, 2000);
    };

    // GET MACHINE OPERATOR
    const handleMachineOperatorSucessShow = (dataObject) => {
        setMachineOperatorList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleMachineOperatorExceptionShow = (errorObject, errorMessage) => {
    }

    // GET SHIFT
    const handleShiftSucessShow = (dataObject) => {
        setShiftList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleShiftExceptionShow = (errorObject, errorMessage) => {
    }

    const ClearData = () => {
        setOpen(false);
        setGroupName('');
        setGroupCode('');
        setGroupDescription('');
        setErrorObject('');
        setRefreshData(oldvalue => !oldvalue);
    }

    const loaderData = () => {
        setRowId(editData?.id || '')
        setGroupName(editData?.groupName || '');
        setGroupCode(editData?.code || '');
        setGroupDescription(editData?.description || '');
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    // Original
    // const handleChange = (event) => {
    //     const {
    //         target: { value },
    //     } = event;
    //     setMachineOperator(
    //         // On autofill we get a stringified value.
    //         typeof value === 'string' ? value.split(',') : value,
    //     );
    // };

    // office change
    // const handleChange = (event) => {
    //     const {
    //         target: { value },
    //     } = event;

    //     setMachineOperator(value);
    // };

    // homechange
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
        // setGridLoading(false);
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

    // const handleUtilizationRadioChange = (event) => {
    //     setUtilization(event.target.value);
    // };

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

    const validateForNullValue = (value, type) => {
        if (value !== null && value !== undefined) {
            AddUserValidate(value, type, setErrorObject);
        }
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {isAddButton ? "Add Group" : "Edit Group"}
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Group Name"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Group Name"
                                onBlur={() => validateForNullValue(groupName, 'groupName')}
                                autoComplete="off"
                                error={errorObject?.groupName?.errorStatus}
                                helperText={errorObject?.groupName?.helperText}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Group Code"
                                variant="filled"
                                size='small'
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                disabled={!isAddButton}
                                value={groupCode}
                                onChange={(e) => setGroupCode(e.target.value)}
                                placeholder="Group Code"
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Group Description"
                                variant="filled"
                                sx={{ mb: 1 }}
                                size='small'
                                margin="dense"
                                fullWidth
                                required
                                value={groupDescription}
                                onChange={(e) => setGroupDescription(e.target.value)}
                                placeholder="Group Description"
                            />
                        </Grid>

                    </Grid>

                    <DialogActions>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{
                                width: '150px', background:
                                    errorObject?.groupName?.errorStatus
                                        ? 'gray'
                                        : '#002D68', color: 'white'
                            }}
                            disabled={
                                errorObject?.groupName?.errorStatus
                                || loading === true
                            }
                        >
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (isAddButton ? 'Add' : 'Update')}
                            {/* {isAddButton ? 'Add' : 'Update'} */}
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

export default GroupMasterModule