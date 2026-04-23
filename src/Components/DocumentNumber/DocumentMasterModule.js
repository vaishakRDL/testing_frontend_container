import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
    CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AddFinancialYear, AddHoliday, AddHolidayUpdate, SobUpdate, } from '../../ApiService/LoginPageService';
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
const DocumentMasterModule = ({ open, setOpen, isAddButton, editData, setRefreshData, fromDate1, ToDate1 }) => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     setFromDate(fromDate1 || '');
    //      setToDate(ToDate1 || '');
    // }, [fromDate1, ToDate1,open]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userDetails")) || {};
        setFromDate(storedData.fyFrom || "");
        setToDate(storedData.fyTo || "");

    }, [open]);
    const ClearData = () => {
        setFromDate("")
        setToDate("")
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        AddFinancialYear({ fromDate: fromDate, toDate: toDate }, handleSobAddSuccess, handleSobAddException);

    }

    const handleSobAddSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setOpen(false);
            ClearData();
            setLoading(false);
        }, 3000);
    }

    const handleSobAddException = (error, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setLoading(false);
        }, 3000)
    }
    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const addYear = (dateStr) => {
        const [day, month, year] = dateStr.split('-').map(Number);
        const newDate = new Date(year + 1, month - 1, day);
        return formatDate(newDate);
    };

    const subtractYear = (dateStr) => {
        const [day, month, year] = dateStr.split('-').map(Number);
        const newDate = new Date(year - 1, month - 1, day);
        return formatDate(newDate);
    };

    const handleSkipNext = () => {
        setFromDate(prev => addYear(prev));
        setToDate(prev => addYear(prev));
    };

    const handleSkipPrevious = () => {
        setFromDate(prev => subtractYear(prev));
        setToDate(prev => subtractYear(prev));
    };
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="sm"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add Financial Year' : 'Edit financial Year'}

            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                label="From Date"
                                placeholder='From Date'
                                variant="filled"
                                // type='date'
                                size='small'
                                value={fromDate}
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => {
                                    setFromDate(e.target.value);
                                }}
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                label="To Date"
                                placeholder='To Date'
                                variant="filled"
                                // type='date'
                                size='small'
                                value={toDate}
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => {
                                    setToDate(e.target.value);
                                }}
                                required

                            />
                        </Grid>


                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '50px', background: '#002D68', color: 'white' }}
                        onClick={handleSkipPrevious}
                    >
                        <SkipPreviousIcon />

                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '50px', background: '#002D68', color: 'white' }}
                        onClick={handleSkipNext}
                    >
                        <SkipNextIcon />

                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        type='submit'
                        disabled={loading === true}
                    >
                        {loading ? (
                            <CircularProgress size={24} style={{ color: 'white' }} />
                        ) : 'Submit'}

                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);
                            ClearData();
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

export default DocumentMasterModule
