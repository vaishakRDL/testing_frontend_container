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
// import MultiAddressModule from './MultlAddress/MultiAddressModule';
// import MultiContactPersonModule from './MultiContactPerson/MultiContactPersonModule';
// import FileUploadModule from './FileUpload/FileUploadModule';
import SearchIcon from "@mui/icons-material/Search";
import { AddShiftMaster, ShiftEdit } from '../../ApiService/LoginPageService';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ShiftMasterModule = ({
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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setOpen(open);

        !isAddButton && loaderData();
    }, [editData]);

    const handleSubmit = (event) => {
        setLoading(true)
        event.preventDefault();
        if (isAddButton) {
            AddShiftMaster({
                shiftLabel: shiftLabel,
                startTime: startTime,
                endTime: endTime,
                status: isActive
            }, handleSuccess, handleException);
        } else {
            ShiftEdit({
                id: rowId,
                shiftLabel: shiftLabel,
                startTime: startTime,
                endTime: endTime,
                status: isActive
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

    const ClearData = () => {
        setOpen(false);
        setShiftLabel('');
        setStartTime('');
        setEndTime('');
        setIsActive(false)
        setRefreshData(oldvalue => !oldvalue);
    }

    const loaderData = () => {
        setRowId(editData?.id || '')
        setShiftLabel(editData?.shiftLabel || '');
        setStartTime(editData?.startTime || '');
        setEndTime(editData?.endTime || '');
        setIsActive(editData?.status || '')
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
                Add Shift
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Shift Label"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                size='small'
                                value={shiftLabel}
                                onChange={(e) => setShiftLabel(e.target.value)}
                                placeholder="Shift Label"
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Start Time"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                type='time'
                                size='small'
                                required
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                placeholder="Start Time"
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="End Time"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                type='time'
                                size='small'
                                fullWidth
                                required
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                placeholder="End Time"
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-around'
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                    />
                                }
                                label="Active"
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

export default ShiftMasterModule