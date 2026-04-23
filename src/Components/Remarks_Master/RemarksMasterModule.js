import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AddHoliday, AddHolidayUpdate, AddRemarks, AddRemarksUpdate, SobUpdate, } from '../../ApiService/LoginPageService';

const RemarksMasterModule = ({ open, setOpen, isAddButton, editData, setRefreshData, }) => {

    const [holiday, setHoliday] = useState('');
    const [holidayOccasion, setHolidayOccasion] = useState('');
    const [Description, setDescription] = useState('');

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        setDescription(editData?.remarks || '');
    }, [editData]);

    const ClearData = () => {
        setDescription('');
    }
    const handleSubmit = (e) => {
        if (isAddButton) {
            AddRemarks({
                remarks: Description,
            }, handleSobAddSuccess, handleSobAddException);
        } else {
            AddRemarksUpdate({
                id: editData?.id,
                remarks: Description,
            }, handleSobAddSuccess, handleSobAddException);
        }
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
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add Remarks' : 'Edit Remarks'}

            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        {/* <Grid item xs={12} sm={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                label="Holiday Date"
                                placeholder='Holiday Date'
                                variant="filled"
                                type='date'
                                size='small'
                                value={holiday}
                                InputLabelProps={{ shrink: true }}
                                onChange={(e) => {
                                    setHoliday(e.target.value);
                                }}
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                label="Holiday Occasion"
                                placeholder='Holiday Occasion'
                                variant="filled"
                                size='small'
                                value={holidayOccasion}
                                onChange={(e) => {
                                    setHolidayOccasion(e.target.value);
                                }}
                                required

                            />
                        </Grid> */}
                        <Grid item xs={12} sm={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                label=" Remarks Description"
                                placeholder='Remarks Description'
                                size='small'
                                variant="filled"
                                value={Description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                                required

                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        type='submit'
                    >
                        {
                            isAddButton ? 'Submit' : 'Update'
                        }

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

export default RemarksMasterModule
