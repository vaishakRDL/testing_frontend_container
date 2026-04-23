
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    TextField,
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Select
}
    from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AllMasterAdd, AllMasterUpdate, MasterAddData } from '../../ApiService/LoginPageService';

const OrderTypeMaster = (props) => {
    const { open, setOpen, isAddButton, editeData, setRefreshData, } = props;

    const [OrderType, setOrderType] = useState('');
    const [Description, setDescription] = useState('');

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {

    }, [editeData]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (isAddButton) {
            MasterAddData({
                masterType : 'orderType',
                orderType : OrderType,
                description : Description
            },handleSuccess,handleException);
        } else {

        }
    }

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
        setRefreshData(oldvalue => !oldvalue);
        setOrderType('');
        setDescription('');
    }

    const loaderData = () => {
        setOrderType('');
        setDescription('');

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
            sx={{ '& .MuiDialog-paper': { width: '60%', maxHeight: '100%' } }}
            maxWidth="sm"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {isAddButton ? 'Add Order Type Master' : 'Edit Order Type Master'}
            </DialogTitle>
            <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2} style={{ marginTop: '0px', marginBottom: '20px', }}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                id="filled-basic"
                                label="Order Type"
                                variant="filled"
                                fullWidth
                                required
                                value={OrderType}
                                placeholder="Order Type"
                                onChange={(e) => setOrderType(e.target.value)}

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                id="filled-basic"
                                label="Description"
                                variant="filled"

                                fullWidth
                                required
                                value={Description}
                                placeholder="Description"
                                onChange={(e) => setDescription(e.target.value)}

                            />
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        type="submit"

                    >
                        {isAddButton ? 'Add' : 'Update'}
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);
                            loaderData();
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

        </Dialog >
    )
}

export default OrderTypeMaster

