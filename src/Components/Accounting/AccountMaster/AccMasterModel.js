import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { MstTransporterAdd, MstTransporterUpdate } from '../../../ApiService/LoginPageService';

const AccMasterModel = ({ open, setOpen, isAddButton, editTransporter, setRefreshData, setNotification }) => {
    const [transporter, setTransporter] = useState('');
    const [description, setDescription] = useState('');
    const [gstIn, setGstIn] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setOpen(false);
        ClearData();
    }

    useEffect(() => {
        setTransporter(editTransporter?.transportName || '');
        setDescription(editTransporter?.discription || '');
        setGstIn(editTransporter?.gstin || '');
    }, [editTransporter])

    const ClearData = () => {
        setTransporter('');
        setDescription('');
        setRefreshData(oldValue => !oldValue);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        isAddButton === true ?
            (
                MstTransporterAdd({
                    transportName: transporter,
                    discription: description,
                    gstin: gstIn
                }, handleSuccess, handleException)
            ) : (
                MstTransporterUpdate({
                    id: editTransporter.id,
                    transportName: transporter,
                    discription: description,
                    gstin: gstIn
                }, handleUpdateSuccess, handleException)
            );
    }

    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setRefreshData(oldValue => !oldValue);
            setLoading(false);
        }, 2000);
    }

    const handleUpdateSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setRefreshData(oldValue => !oldValue);
            setLoading(false);
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        console.log(errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
            setLoading(false);
            setRefreshData(oldValue => !oldValue);
        }, 2000);
    }

    return (
        <div>
            <Dialog sx={{ '& .MuiDialog-paper': { width: '45%', maxHeight: '100%' } }}
                maxWidth="xl"
                open={open}>
                <form onSubmit={onSubmit}>
                    <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {isAddButton ? 'Add Transporter' : 'Edit Transporter '}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{ marginTop: '10px' }}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="Transporter"
                                    placeholder='Transporter'
                                    variant="outlined"
                                    size='small'
                                    required
                                    onChange={(e) => { setTransporter(e.target.value) }}
                                    value={transporter}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="GSTIN"
                                    placeholder='GSTIN'
                                    variant="outlined"
                                    size='small'
                                    required
                                    onChange={(e) => { setGstIn(e.target.value) }}
                                    value={gstIn}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    placeholder='Description'
                                    variant="outlined"
                                    size='small'
                                    required
                                    onChange={(e) => { setDescription(e.target.value) }}
                                    value={description}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            disabled={loading === true}
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type="submit">
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (isAddButton ? 'Add' : 'Update')}
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={handleClose}>
                            Cancel
                        </Button>
                        <DialogActions>

                        </DialogActions>
                    </DialogActions>
                </form>
            </Dialog>

        </div>
    )
}

export default AccMasterModel
