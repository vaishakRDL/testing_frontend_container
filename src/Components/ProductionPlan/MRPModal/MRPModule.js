import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';

import { editAllocatedItemVsProcess, AssemblyUserMrpGenerate } from '../../../ApiService/LoginPageService';

const MRPModule = ({ mrpModalOpen, setMrpModalOpen, machineId, editData, setRefreshData, processId }) => {

    const [machineName, setMachineName] = useState('');
    const [count, setCount] = useState('');
    const [cycleTime, setCycleTime] = useState('');
    const [processPriority, setProcessPriority] = useState('');
    const [skip, setSkip] = useState('');
    const [quality, setQuality] = useState('');
    const [rowId, setRowId] = useState('');

    // NEW STATE
    const [kanbanDate, setKanbanDate] = useState('');
    const [orderType, setOrderType] = useState('');

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        mrpModalOpen && loaderData();
    }, [mrpModalOpen, editData])

    const loaderData = () => {
        setRowId(editData?.id || '');
        setMachineName(editData?.machineName || '');
        setCount(editData?.count || '');
        setCycleTime(editData?.cycleTime || '');
        setProcessPriority(editData?.processPriority || '');
        setSkip(editData?.skip || '');
        setQuality(editData?.quality || '');
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        AssemblyUserMrpGenerate({
            saleId: processId,
            kanbanDate: kanbanDate,
            typeOfOrder: orderType
        }, handleSubmitSuccess, handleSubmitException);
    };

    const handleSubmitSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefreshData(oldvalue => !oldvalue);
        setTimeout(() => {
            ClearData();
            handleClose();
        }, 2000);
    };
    const handleSubmitException = (errorObject, errorMessage) => {
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
        setMachineName('');
        setCount('');
        setCycleTime('');
        setProcessPriority('');
        setSkip('');
        setQuality('');
        setMrpModalOpen(false);
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
            open={mrpModalOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                MRP Generation
            </DialogTitle>
            <DialogContent style={{ marginTop: '10px' }}>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={112} lg={112} xl={112}>
                            <TextField
                                id="filled-basic"
                                label="Kanban Date"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                type='date'
                                placeholder="Kanban Date"
                                value={kanbanDate}
                                onChange={(e) => setKanbanDate(e.target.value)}
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: "10px" }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Type Of Order</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Type Of Order"
                                    variant="filled"
                                    onChange={(e) => setOrderType(e.target.value)}
                                    value={orderType}
                                >
                                    <MenuItem value={'Open Po | Contract | Advance Notification'}>Open Po | Contract | Advance Notification</MenuItem>
                                    <MenuItem value={'PO'}>PO</MenuItem>
                                    <MenuItem value={'R&D'}>R&D</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                    </Grid>

                    <DialogActions style={{ marginTop: '20px' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                        >
                            Update
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setMrpModalOpen(false);
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>


            <NotificationBar
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Dialog>
    )
}

export default MRPModule
