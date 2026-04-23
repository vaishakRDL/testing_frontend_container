import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React, { useState } from 'react'
import { SupervisorJcRqstMaterial } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';

const MatrialModule = ({
    open, setOpen, materialList
}) => {

    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        SupervisorJcRqstMaterial({
            nstNo: materialList?.Nesting_no
        }, handleSuccess, handleException);
    }

    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setOpen(false);
        }, 5000);
    }

    const handleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
            // setOpen(false);
        }, 3000);
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
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Material Request
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                label="Material Name"
                                placeholder='Material Name'
                                variant="filled"
                                required
                                size='small'
                                InputLabelProps={{
                                    shrink: true
                                }}
                                value={materialList?.Material_Name}

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                label="Material Thickness"
                                placeholder='Material Thickness'
                                variant="filled"
                                required
                                size='small'
                                InputLabelProps={{
                                    shrink: true
                                }}
                                value={materialList?.Material_Name}
                            />

                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                label="Sheet Qty (kg)"
                                placeholder='Sheet Qty (kg)'
                                variant="filled"
                                required
                                size='small'
                                InputLabelProps={{
                                    shrink: true
                                }}
                                value={materialList?.totalSheetQty}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    {/* <Button
                        variant="contained"
                        style={{ width: '250px', background: '#002D68', color: 'white' }}
                        type="submit"

                    >
                        Request For Meterial
                    </Button> */}
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

export default MatrialModule