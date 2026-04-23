import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel,
    CircularProgress,
    IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { EditEmailSetting } from '../../ApiService/LoginPageService';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const EmailSettingModule = ({ open, setOpen, isAddButton, editData, setRefreshData, }) => {
    const [type, setType] = useState('');
    const [password, setPassword] = useState('');
    const [smtpHost, setSMTPHost] = useState('');
    const [senderemail, setSenderEmail] = useState('');
    const [rowId, setRowId] = useState('')
    const [port, setPort] = useState('')
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        setOpen(open);
        // open && ShowProcessMaster(handleMachineOperatorSucessShow, handleMachineOperatorExceptionShow);
        // open && GetShift(handleShiftSucessShow, handleShiftExceptionShow);
        isAddButton && loaderData();
    }, [editData]);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const handleSubmit = (event) => {
        setLoading(true)
        event.preventDefault();
        if (isAddButton) {
            EditEmailSetting({
                id: rowId,
                type: type,
                smtp_host: smtpHost,
                email: senderemail,
                password: password,
                smtp_port: port

            }, handleSuccess, handleException);
        }

    };

    const loaderData = () => {
        setRowId(editData?.id || '')
        setType(editData?.type || '');
        setPassword(editData?.password || '');
        setSMTPHost(editData?.smtp_host || '');
        setPort(editData?.smtp_port || '');
        setSenderEmail(editData?.email || '');
    }
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
    const ClearData = () => {
        setOpen(false);
        // setGroupName('');
        // setGroupCode('');
        // setGroupDescription('');
        // setErrorObject('');
        setRefreshData(oldvalue => !oldvalue);
    }
    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };
    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {isAddButton && "Edit Group"}
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Department"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                disabled={isAddButton}
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                placeholder="Department"
                                // onBlur={() => validateForNullValue(groupName, 'groupName')}
                                autoComplete="off"
                            // error={errorObject?.groupName?.errorStatus}
                            // helperText={errorObject?.groupName?.helperText}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="SMTP Server"
                                variant="filled"
                                size='small'
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                disabled={isAddButton}
                                value={smtpHost}
                                onChange={(e) => setSMTPHost(e.target.value)}
                                placeholder="SMTP Server"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Sender Email"
                                variant="filled"
                                size='small'
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                // disabled={!isAddButton}
                                value={senderemail}
                                onChange={(e) => setSenderEmail(e.target.value)}
                                placeholder="Sender Email"
                            />
                        </Grid>

                        {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Password"
                                variant="filled"
                                sx={{ mb: 1 }}
                                size='small'
                                margin="dense"
                                fullWidth
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </Grid> */}

                        <Grid item xs={6} sm={6}>
                            <TextField
                                fullWidth
                                label="Password"
                                placeholder="Password"
                                variant="outlined"
                                required
                                type={!isAddButton ? "password" : showPassword ? "text" : "password"} // Toggle password visibility
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {!isAddButton ?
                                                <IconButton edge="end">
                                                    <VisibilityOff />
                                                </IconButton>
                                                :
                                                <IconButton onClick={handleTogglePassword} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            }
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Port"
                                variant="filled"
                                sx={{ mb: 1 }}
                                size='small'
                                margin="dense"
                                fullWidth
                                required
                                disabled={isAddButton}
                                value={port}
                                onChange={(e) => setPort(e.target.value)}
                                placeholder="Port"
                            />
                        </Grid>
                    </Grid>

                    <DialogActions>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{
                                width: '150px', background: '#002D68', color: 'white'
                            }}
                        // disabled={
                        //     errorObject?.groupName?.errorStatus
                        //     || loading === true
                        // }
                        >
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (
                                isAddButton ? 'Update' : null
                            )}

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

export default EmailSettingModule