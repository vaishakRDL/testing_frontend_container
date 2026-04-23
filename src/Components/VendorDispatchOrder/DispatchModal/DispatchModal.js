import { Autocomplete, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { UpdateVendorQuantity } from '../../../ApiService/LoginPageService';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';

const DispatchModal = ({ dispatchModalOpen, setDispatchModalOpen, setRefreshData, rowId, dcNo }) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [dispatchedQty, setDispatchedQty] = useState('');

    useEffect(() => {
    }, [dispatchModalOpen])

    const handleSubmit = (e) => {
        e.preventDefault();
        UpdateVendorQuantity({
            id: rowId,
            type: 'Dispatch',
            qty: Number(dispatchedQty),
            dcNo: '',
            dcFile: '',
            invoiceNo: '',
            invoiceFile: ''
        }, handleSuccess, handleFailure)
    };

    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setDispatchModalOpen(false);
        }, 3000);
    }
    const handleFailure = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // setDispatchModalOpen(false);
            // handleClose();
        }, 3000);
    }

    const handleClose = () => {
        setDispatchedQty('');
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
            open={dispatchModalOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Enter Dispatch Quantity
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2} padding={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                id="filled-basic"
                                label="DC No"
                                variant="filled"
                                disabled={true}
                                value={dcNo}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                id="filled-basic"
                                label="Dispatch Quantity"
                                variant="filled"
                                value={dispatchedQty}
                                onChange={(e) => setDispatchedQty(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type="submit"
                        >
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setDispatchModalOpen(false);
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>


            <NotificationBar
                // handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Dialog>
    )
}

export default DispatchModal
