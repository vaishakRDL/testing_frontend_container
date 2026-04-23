import {
    Button, Box, Dialog, Tooltip, CircularProgress, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DispatchExlimport, } from '../../ApiService/LoginPageService';



const DispatchModule = ({ open, setOpen, setRefreshData, selectedButton }) => {
    const [uploadloading, setuploadLoading] = useState(false);
    const [date, setDate] = useState('');
    const [file, setFile] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });


    const handleSubmit = (e) => {
        setuploadLoading(true);
        e.preventDefault();
        DispatchExlimport({
            date: date,
            file: file,
            flag: selectedButton === 'shipment' ? 1 : 0,
        }, handleDispatchExlimportSuccess, handleDispatchExlimportException);

    }

    const handleDispatchExlimportSuccess = (dataObject) => {
        setuploadLoading(false);

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setOpen(false);
            setDate('');
            setRefreshData((oldvalue) => !oldvalue);
        }, 3000);
    }

    const handleDispatchExlimportException = () => {
        setuploadLoading(false);

    }

    const handleSobAddSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setTimeout(() => {
            handleClose();
            setOpen(false);

        }, 3000);
    }

    const handleSobAddException = () => {

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
            maxWidth="sm"
            open={open}
        >
            {/* <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add Tool' : 'Edit Tool'}

            </DialogTitle> */}
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                id="filled-basic"
                                label="Shipment Date"
                                variant="filled"
                                sx={{ mb: 1 }}
                                type="date"
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                                value={date}
                                placeholder="Shipment Date"
                                onChange={(e) => {
                                    setDate(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                style={{
                                    // margin: '10px'
                                }}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            if (reader.readyState === 2) {
                                                setFile(reader.result);
                                            }
                                        };
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                                type="file" />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '250px', background: '#002D68', color: 'white' }}
                        type="submit" >
                        {uploadloading ? (
                            <CircularProgress size={24} style={{ color: 'white' }} />
                        ) : (
                            " Upload"
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

export default DispatchModule
