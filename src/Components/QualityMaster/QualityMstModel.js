import { Button, Dialog, CircularProgress, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { QualityInsMstAdd, QualityInsMstUpdate } from '../../ApiService/LoginPageService';

const QualityMstModel = ({ open, setOpen, isAddButton, editQuality, setRefreshData, setNotification }) => {
    const [quality, setQuality] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setOpen(false);
        ClearData();
    }

    useEffect(() => {
        setQuality(editQuality?.inspectionType || '');
        setDescription(editQuality?.description || '');
    }, [editQuality])

    const ClearData = () => {
        setQuality('');
        setDescription('');
        setRefreshData(oldValue => !oldValue);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        isAddButton === true ?
            (
                QualityInsMstAdd({
                    inspectionType: quality,
                    description: description,
                }, handleSuccess, handleException)
            ) : (
                QualityInsMstUpdate({
                    id: editQuality.id,
                    inspectionType: quality,
                    description: description,
                }, handleUpdateSuccess, handleException)
            );
    }

    const handleSuccess = (dataObject) => {
        console.log(dataObject);
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
        console.log(errorMessage);
        setLoading(false);

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
            <Dialog sx={{ '& .MuiDialog-paper': { width: '45%', maxHeight: '100%' } }}
                maxWidth="xl"
                open={open}>
                <form onSubmit={onSubmit}>
                    <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {isAddButton ? 'Add Instrument' : 'Edit Instrument '}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{ marginTop: '10px' }}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="Instrument"
                                    placeholder='Instrument'
                                    variant="outlined"
                                    size='small'
                                    required
                                    onChange={(e) => { setQuality(e.target.value) }}
                                    value={quality}

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
                                isAddButton ? 'Add' : 'Update'
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

export default QualityMstModel
