import {
    Button, Box, Dialog, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { connect } from 'react-redux';
import {
    addCustomerGroup
} from '../../../Actions';

const CustomerGroupModule = (props) => {
    const { open, setOpen, isAddButton, customerData, setRefreshData } = props



    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {

    }, [customerData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isAddButton) {
            props.addCustomerGroup(
                {
                    cgId: "",
                    cgCode: "",
                    cgClean: "",
                    cgName: "",
                    inactiveStatus: "",
                    remarks: ""
                },
                handleSuccess, handleException)
        } else {
            props.addCustomerGroup(
                {
                    cgId: "",
                    cgCode: "",
                    cgClean: "",
                    cgName: "",
                    inactiveStatus: "",
                    remarks: ""
                },
                handleSuccess, handleException)
        }
    };

    const handleSuccess = (dataObject) => {
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
        // setOpen(false);
        // setDepartment('')
        // setMachineId('')
        // setMachineName('')
        // setMachineTag('')
        // setCapacityMeasureType('')
        // setMaxCapacity('')
        // setCapacityMeasuringUnit('')
        // setLoadingTime('')
        // setUnloadingTime('')
        // setMaxProductionHour('')
        // setSelectedRadioValue('')
        // setRefreshData(oldvalue => !oldvalue);
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
            sx={{ '& .MuiDialog-paper': { width: '60%', maxHeight: '100%' } }}
            maxWidth="md"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {isAddButton ? 'Customer Group' : 'Edit Customer Group'}
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Customer Group Id"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                // value={customerId}
                                placeholder="Customer Group Id"

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Customer Group Code"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                // value={customerId}
                                placeholder="Customer Group Code"

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Customer Group Clean"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                // value={customerId}
                                placeholder="Customer Group Clean"

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}

                        >
                            <TextField
                                id="filled-basic"
                                label="Customer Group Name"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                // value={customerId}
                                placeholder="Customer Group Name"

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControlLabel control={<Checkbox defaultChecked />} label="Inactive" />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Inactive Remaks"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                // value={customerId}
                                placeholder="Description"

                            />
                        </Grid>

                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            // disabled={
                            //     errorObject?.customerId?.errorStatus
                            //     || errorObject?.GSTNumber?.errorStatus
                            //     || errorObject?.customerName?.errorStatus
                            //     || errorObject?.billingAddress?.errorStatus
                            //     || errorObject?.address?.errorStatus
                            //     || errorObject?.shippingAddress?.errorStatus
                            //     || errorObject?.contactPersonName?.errorStatus
                            //     || errorObject?.primaryContactnumber?.errorStatus
                            //     || errorObject?.phoneNumber?.errorStatus
                            //     || errorObject?.email?.errorStatus
                            // }
                            type="submit"

                        >
                            {isAddButton ? 'Add' : 'Update'}
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

// export default CustomerGroupModule
const mapStateToProps = ({ config }) => {
    const { capacityMeasureList, departmentList } = config;
    return {}
}
export default connect(mapStateToProps, { addCustomerGroup })(CustomerGroupModule);