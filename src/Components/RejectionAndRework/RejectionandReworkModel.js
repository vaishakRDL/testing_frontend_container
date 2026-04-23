import { Button, Dialog, CircularProgress, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { ReworkreasonAdd, ReworkreasonID, ReworkreasonUpdate } from '../../ApiService/LoginPageService';

const RejectionandReworkModel = ({ open, setOpen, isAddButton, editRejectionAndRework, setRefreshData, setNotification }) => {
    const [reasonId, setReasonId] = useState('');
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [reasonpopup, setReasonPopup] = useState("");
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setOpen(false);
        // ClearData();
    }

    useEffect(() => {
        ReworkreasonID(handleautoSuccess, handleautoException)
        setReasonId(editRejectionAndRework?.reasonId || '');
        setReason(editRejectionAndRework?.reason || '');
        setDescription(editRejectionAndRework?.description || '');
    }, [editRejectionAndRework])

    const handleautoSuccess = (dataObject) => {
        if (editRejectionAndRework?.autoId) {
            setReasonId(editRejectionAndRework?.autoId || '');
        }
        else {
            setReasonId(dataObject.autoId);
        }
    }

    const handleautoException = (errorStaus, errorMessage) => {
        console.log(errorMessage);
    }

    const ClearData = () => {
        setReasonId('');
        setReason('');
        setDescription('');
        setRefreshData(oldValue => !oldValue);
    }

    const onSubmit = (e) => {
        setLoading(true)
        e.preventDefault();
        isAddButton === true ?
            (
                ReworkreasonAdd({
                    reasonId: reasonId,
                    reason: reason,
                    description: description,
                }, handleSuccess, handleException)
            ) : (
                ReworkreasonUpdate({
                    id: editRejectionAndRework.id,
                    reasonId: reasonId,
                    reason: reason,
                    description: description,
                }, handleUpdateSuccess, handleException)
            );
    }

    const handleSuccess = (dataObject) => {
        setLoading(false);
        console.log(dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setRefreshData(oldValue => !oldValue);
        }, 2000);
    }

    const handleUpdateSuccess = (dataObject) => {
        setLoading(false);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setRefreshData(oldValue => !oldValue);
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        setLoading(false)
        console.log(errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
            setRefreshData(oldValue => !oldValue);
        }, 2000);
    }

    return (
        <div>
            <Dialog sx={{ '& .MuiDialog-paper': { width: '30%', maxHeight: '100%' } }}
                maxWidth="xl"
                open={open}>
                <form onSubmit={onSubmit}>
                    <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {isAddButton ? 'Add' : 'Edit'} Reason
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{ marginTop: '10px' }}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="Reason ID"
                                    placeholder='Reason ID'
                                    variant="outlined"
                                    size='small'
                                    required
                                    onChange={(e) => { setReasonId(e.target.value) }}
                                    value={reasonId}


                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="Reason"
                                    placeholder='Reason'
                                    variant="outlined"
                                    size='small'
                                    required
                                    onChange={(e) => { setReason(e.target.value) }}
                                    value={reason}
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
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (
                                isAddButton ? "Add" : "Update"

                            )}
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={handleClose}


                        >
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

export default RejectionandReworkModel;
