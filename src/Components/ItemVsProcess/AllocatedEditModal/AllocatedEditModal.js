import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';

import { editAllocatedItemVsProcess, PriceRangeShowList } from '../../../ApiService/LoginPageService';

const AllocatedEditModal = ({ editModalOpen, setEditModalOpen, machineId, editData, setRefreshData }) => {

    const [machineName, setMachineName] = useState('');
    const [priceRangeList, setPriceRangeList] = useState([]);
    const [count, setCount] = useState('');
    const [cycleTime, setCycleTime] = useState('');
    const [processPriority, setProcessPriority] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [skip, setSkip] = useState(0);
    const [vendorProcess, setVendorProcess] = useState(0);
    const [rowId, setRowId] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        editModalOpen && loaderData();
    }, [editModalOpen, editData])

    const loaderData = () => {
        PriceRangeShowList({ id: editData?.processId }, handlerangeSuccess, handleRangeException);
        setRowId(editData?.id || '');
        setMachineName(editData?.machineName || '');
        setCount(editData?.count || '');
        setCycleTime(editData?.cycleTime || '');
        setProcessPriority(editData?.processPriority || '');
        setPriceRange(editData?.priceRangeId || '');
        setSkip(editData?.skip || 0);
        setVendorProcess(editData?.vendorProcess || 0);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        editAllocatedItemVsProcess({
            id: rowId,
            count: count,
            cycleTime: cycleTime,
            processPriority: processPriority,
            skip: skip,
            vendorProcess: vendorProcess,
            priceRangeId: priceRange
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

    const handlerangeSuccess = (dataObject) => {
        setPriceRangeList(dataObject.data);
    };

    const handleRangeException = (errorObject, errorMessage) => {
        console.log("the error ", errorMessage);
    };
    const ClearData = () => {
        setMachineName('');
        setCount('');
        setCycleTime('');
        setProcessPriority('');
        setSkip('');
        setVendorProcess('');
        setEditModalOpen(false);
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
            maxWidth="md"
            open={editModalOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Item Vs Process Edit
            </DialogTitle>
            <DialogContent style={{ marginTop: '10px' }}>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Machine Name"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                placeholder="Machine Name"
                                value={machineName}
                                readOnly={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Count"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                placeholder="Count"
                                onChange={(e) => setCount(e.target.value)}
                                value={count}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Cycle Time"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                placeholder="Cycle Time"
                                onChange={(e) => setCycleTime(e.target.value)}
                                value={cycleTime}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Process Priority"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                placeholder="Process Priority"
                                onChange={(e) => setProcessPriority(e.target.value)}
                                value={processPriority}
                            />
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Price Range"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                placeholder="Price Range"
                                onChange={(e) => setPriceRange(e.target.value)}
                                value={priceRange}
                            />
                        </Grid> */}
                        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Price Range</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Price Range"
                                    variant="filled"
                                    // size="small"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                >
                                    {priceRangeList.map((data) => (
                                        <MenuItem key={data.id} value={data?.id}>
                                            {data?.range}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{ marginTop: "10px" }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Skip</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Skip"
                                    variant="filled"
                                    onChange={(e) => setSkip(e.target.value)}
                                    value={skip}
                                    disabled={true}
                                >
                                    <MenuItem value={1}>Yes</MenuItem>
                                    <MenuItem value={0}>No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{ marginTop: "10px" }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">InHouse/VendorProcess</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="InHouse/VendorProcess"
                                    variant="filled"
                                    onChange={(e) => setVendorProcess(e.target.value)}
                                    value={vendorProcess}
                                    disabled={true}
                                >
                                    <MenuItem value={1}>Vendor Process</MenuItem>
                                    <MenuItem value={0}>InHouse</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid> */}

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
                                setEditModalOpen(false);
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

export default AllocatedEditModal
