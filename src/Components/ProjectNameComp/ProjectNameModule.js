import {
    Button, Box, Dialog, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';

const ProjectNameModule = ({
    open, setOpen, isAddButton, customerData, setRefreshData,
}) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {

    }, [customerData]);

    const handleSubmit = (e) => {
        e.preventDefault();

    };

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
                {isAddButton ? 'Project Name' : 'Edit Project Name'}
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                id="filled-basic"
                                label="Project Name"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                size='small'
                                required
                                // value={customerId}
                                placeholder="Project Name"

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                id="filled-basic"
                                label="Description"
                                variant="filled"
                                sx={{ mb: 1 }}
                                size='small'
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

export default ProjectNameModule