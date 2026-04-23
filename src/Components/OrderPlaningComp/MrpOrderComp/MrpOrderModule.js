import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { MRPGenerationmrp, OrderPlanningSelctedData } from '../../../ApiService/LoginPageService';

const MrpOrderModule = ({ openMrp, setOpenMrp, selectRowId, setRefreshData }) => {
    const [typeOfOrder, setTypeOfOrder] = useState('');
    const [kanbanDate, setKanbanDate] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmit, setIsSubmit] = useState(0);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {


    }, []);

    const handleChange = (e) => {
        setTypeOfOrder(e.target.value);
    }

    const OnSubmitData = (e) => {
        e.preventDefault();
        setIsSubmit(1);
        // if (reason) {
        MRPGenerationmrp({
            orderId: selectRowId,
            kanbanDate: kanbanDate,
            typeOfOrder: typeOfOrder,
            type: 'mrp',
            // reason: reason,
            priority: ''

        }, succuessMRPGeneration, ExceptionMRPGeneration);
        // } else {
        //     setNotification({
        //         status: false,
        //         type: 'error',
        //         message: 'Enter The Reason',
        //     });
        //     setTimeout(() => {
        //         handleClose();
        //     }, 2000);
        // }
    }
    const succuessMRPGeneration = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message
        });
        setTimeout(() => {
            setReason('');
            handleClose();
            setOpenMrp(false);
            setIsSubmit(0);
            setKanbanDate('');
            setTypeOfOrder('');
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
            // setOpenMrp(false);
            setIsSubmit(0);
            setKanbanDate('');
            setTypeOfOrder('');
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
            open={openMrp}
        >
            <DialogTitle
            // style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
                MRP Generation
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
                                            label="Kanban Date"
                                            variant="filled"
                                            type='date'
                                            fullWidth
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            value={kanbanDate}
                                            placeholder="Kanban Date"
                                            onChange={(e) => setKanbanDate(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <FormControl fullWidth

                                        >
                                            <InputLabel id="demo-simple-select-label">Type of Order</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={typeOfOrder}
                                                label="Customer Name"
                                                variant="filled"
                                                onChange={(e) => {
                                                    setTypeOfOrder(e.target.value);
                                                }}
                                            >
                                                <MenuItem value={'Open Po | Contract | Advance Notification'}>Open Po | Contract | Advance Notification</MenuItem>
                                                <MenuItem value={'PO'}>PO</MenuItem>
                                                <MenuItem value={'R&D'}>R&D</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                                    </Grid> */}
                                </Grid>
                            )
                        }

                    </Grid>
                </DialogContent>
                <DialogActions>

                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        // onClick={(e) => {

                        // }}
                        type='submit'
                    >
                        Generate
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpenMrp(false);
                            setIsSubmit(0);
                            setReason('');

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

export default MrpOrderModule
