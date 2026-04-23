import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { MRPGeneration, OrderPlanningSelctedData } from '../../../ApiService/LoginPageService';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import WarningIcon from '@mui/icons-material/Warning';

const HoldNotification = ({ open, setOpen, selectRowId, setRefreshData }) => {
    const [typeOfOrder, setTypeOfOrder] = useState('');
    const [reason, setReason] = useState('');
    const [kanbanDate, setKanbanDate] = useState('');
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

    const OnSubmitData = () => {
        if (reason) {
            OrderPlanningSelctedData({
                orderId: selectRowId,
                kanbanDate: '',
                typeOfOrder: '',
                priority: "",
                type: "hold",
                reason: reason,

            }, succuessMRPGeneration, ExceptionMRPGeneration);
        } else {

            setNotification({
                status: true,
                type: 'error',
                message: "Enter The Reason "
            });
            setTimeout(() => {
                handleClose();
            }, 2000);
        };

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
            setTypeOfOrder('');
            setReason('');
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
            setIsSubmit(0);
            setKanbanDate('');
            setTypeOfOrder('');
            setReason('');
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
            fullWidth
            maxWidth="sm"
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '100%' } }}
            open={open}
        >
            <DialogTitle sx={{ textAlign: 'center' }}>
                <WarningIcon color="warning" style={{ fontSize: 95, color: '#8b1228' }} />
            </DialogTitle>

            <DialogContent sx={{
                mt: 1,
                textAlign: 'center', fontFamily: 'customfont',
                letterSpacing: '0.5px',
                marginTop: '0px'
            }}>
                <Typography sx={{
                    m: 1,
                    fontFamily: 'customfont',
                    letterSpacing: '0.5px',
                    padding: '10px 0'
                }}
                    variant="h5"
                    component="span">

                    Are you sure you want to Hold this?

                </Typography>
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
            </DialogContent>
            <DialogActions sx={{ margin: '10px' }}>

                <Button
                    variant="contained"
                    style={{ width: '200px', background: '#002D68', color: 'white' }}
                    onClick={(e) => {
                        setIsSubmit(1);
                        OnSubmitData();
                    }}
                >
                    Hold
                </Button>
                <Button
                    variant="contained"
                    style={{ width: '200px', background: '#002D68', color: 'white' }}
                    onClick={(e) => {
                        setOpen(false);
                        setIsSubmit(0);
                        setReason('')
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

        </Dialog>
    )
}

export default HoldNotification
