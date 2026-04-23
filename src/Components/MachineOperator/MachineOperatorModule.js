import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel,
} from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
// import MultiAddressModule from './MultlAddress/MultiAddressModule';
// import MultiContactPersonModule from './MultiContactPerson/MultiContactPersonModule';
// import FileUploadModule from './FileUpload/FileUploadModule';
import SearchIcon from "@mui/icons-material/Search";
import { AddMachineOperator, MachineOperatorEdit } from '../../ApiService/LoginPageService';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const MachineOperatorModule = ({
    open, setOpen, isAddButton, editData, setRefreshData,
}) => {

    const [id, setId] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [rowId, setRowId] = useState('');
    const [shiftLabel, setShiftLabel] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isActive, setIsActive] = useState(false);

    const [machineOperatorName, setMachineOperatorName] = useState('');
    const [machineOperatorDescription, setMachineOperatorDescription] = useState('');

    useEffect(() => {
        setOpen(open);

        !isAddButton && loaderData();
    }, [editData]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isAddButton) {
            AddMachineOperator({
                name: machineOperatorName,
                description: machineOperatorDescription
            }, handleSuccess, handleException);
        } else {
            MachineOperatorEdit({
                id: rowId,
                name: machineOperatorName,
                description: machineOperatorDescription
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
        }, 2000);
    };

    const ClearData = () => {
        setOpen(false);
        setMachineOperatorName('');
        setMachineOperatorDescription('');
        setRefreshData(oldvalue => !oldvalue);
    }

    const loaderData = () => {
        setRowId(editData?.id || '')
        setMachineOperatorName(editData?.name || '');
        setMachineOperatorDescription(editData?.description || '');
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

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Add Machine Operator
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Machine Operator Name"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={machineOperatorName}
                                onChange={(e) => setMachineOperatorName(e.target.value)}
                                placeholder="Machine Operator Name"
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Machine Operator Description"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={machineOperatorDescription}
                                onChange={(e) => setMachineOperatorDescription(e.target.value)}
                                placeholder="Machine Operator Description"
                            />
                        </Grid>

                    </Grid>

                    <DialogActions>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                        >
                            {isAddButton ? 'Add' : 'Update'}
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

export default MachineOperatorModule