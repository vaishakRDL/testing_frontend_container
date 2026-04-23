import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { JobCardShow } from '../../ApiService/LoginPageService';

const JobCardModule = ({ open, setOpen, isAddButton, editData, setRefreshData, }) => {

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const ClearData = () => {

    }

    const handleSubmit = (e) => {

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

                    <Card style={{ borderRadius: '8px', height: '250px', width: '100%', marginTop: '10px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                        <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Grid container spacing={2}>
                                <Grid item sm={12}>
                                    <TextField
                                        id="filled-basic"
                                        label="Job Cardard No"
                                        variant="filled"
                                        fullWidth
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="Job Cardard No"

                                    />
                                </Grid>
                                <Grid item sm={12}>
                                    <TextField
                                        id="filled-basic"
                                        label="Part No"
                                        variant="filled"
                                        fullWidth
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="Part No"

                                    />
                                </Grid>

                                <Grid item sm={6}>
                                    <TextField
                                        id="filled-basic"
                                        label="Total Qty"
                                        variant="filled"
                                        fullWidth
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="Total Qty"

                                    />
                                </Grid>

                                <Grid item sm={6}>
                                    <TextField
                                        id="filled-basic"
                                        label="Produced Qty"
                                        variant="filled"
                                        fullWidth
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="Produced Qty"

                                    />
                                </Grid>

                            </Grid>

                        </CardContent>
                    </Card>

                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);

                        }}
                    >
                        Ok
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

export default JobCardModule
