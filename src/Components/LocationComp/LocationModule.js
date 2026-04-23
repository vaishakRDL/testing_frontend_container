
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,

}
    from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';

const LocationModule = (props) => {
    const { open, setOpen, isAddButton } = props;

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const handleSubmit = (e) => {

    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="sm"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Add Location
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                            <TextField
                                id="filled-basic"
                                label="City Name"
                                variant="filled"

                                onChange={(e) => {

                                }}
                                sx={{ mb: 1 }}
                                size='small'
                                margin="dense"
                                fullWidth
                                required
                                placeholder="City Name"

                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                            <TextField
                                id="filled-basic"
                                label="State"
                                variant="filled"
                                size='small'
                                onChange={(e) => {

                                }}
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                placeholder="State"

                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Country"
                                variant="filled"
                                size='small'
                                onChange={(e) => {

                                }}
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                placeholder="Country"

                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Description"
                                variant="filled"
                                size='small'
                                onChange={(e) => {

                                }}
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
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
                                // ClearData();
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

        </Dialog >
    )
}

export default LocationModule

