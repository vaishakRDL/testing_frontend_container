import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { MRPGeneration, OrderPlanningSelctedData } from '../../../ApiService/LoginPageService';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';

const RescheduleOrder = ({ open, setOpen, selectRowId, setRefreshData }) => {
    const [priority, setPriority] = useState('');
    const [kanbanDate, setKanbanDate] = useState('');
    const [isSubmit, setIsSubmit] = useState(0);
    const [reason, setReason] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {


    }, []);

    const handleChange = (e) => {
        setPriority(e.target.value);
    }

    const OnSubmitData = (e) => {
        e.preventDefault();
        setIsSubmit(1);
        OrderPlanningSelctedData({
            orderId: selectRowId,
            kanbanDate: kanbanDate,
            priority: priority,
            // priority: "",
            type: "reschedule",
            reason: reason,
            typeOfOrder: "",

        }, succuessMRPGeneration, ExceptionMRPGeneration);

    }
    const succuessMRPGeneration = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message
        });
        setTimeout(() => {
            handleClose();
            setOpen(false);
            setIsSubmit(0);
            setKanbanDate('');
            setPriority('');
            setRefreshData((oldValue) => !oldValue);
        }, 2000);

    }

    const ExceptionMRPGeneration = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage
        });
        setTimeout(() => {
            // handleClose();
            // setOpen(false);
            setIsSubmit(0);
            setKanbanDate('');
            setPriority('');
        }, 2000);
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
            sx={{ '& .MuiDialog-paper': { width: '30%', maxHeight: '100%' } }}
            maxWidth="small"
            open={open}
        >
            <DialogTitle style={{ marginTop: '-10px', }}
            // style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
                Reschedule Order
            </DialogTitle>
            <form onSubmit={OnSubmitData}>
                <DialogContent>
                    <Grid container spacing={2} >

                        {
                            isSubmit === 1 ? (
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Box sx={{ display: 'flex' }}>
                                        <CircularProgress style={{ width: '100px', height: '100px' }} />
                                    </Box>
                                </Grid>
                            ) : (

                                <Grid container spacing={2} style={{ marginTop: '20px' }}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            id="filled-basic"
                                            label="Reason"
                                            variant="filled"
                                            type='text'
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            value={reason}
                                            placeholder="Reason"
                                            onChange={(e) => setReason(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <TextField
                                            id="filled-basic"
                                            label="Priority"
                                            variant="filled"
                                            sx={{ mb: 1 }}
                                            size='small'
                                            type='number'
                                            fullWidth
                                            value={priority}
                                            required
                                            onChange={(e) => setPriority(e.target.value)}
                                            placeholder="Priority"
                                        />
                                    </Grid>
                                </Grid>
                            )
                        }
                    </Grid>
                </DialogContent>
                <DialogActions>

                    <Button
                        variant="contained"
                        style={{ width: '200px', background: '#002D68', color: 'white' }}
                        type='submit'
                    >
                        Reschedule Order
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);
                            setIsSubmit(0);
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </form>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

        </Dialog>
    )
}

export default RescheduleOrder
