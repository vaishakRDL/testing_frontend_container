import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    TextField,
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    CircularProgress
}
    from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import {  AllMasterAdd, AllMasterUpdate } from '../../ApiService/LoginPageService';

const SupplerCom = (props) => {
    const { open, setOpen, isAddButton, editData, setRefreshData, } = props;

    //NEW STATE VARIBALES
    const [selectedMaster, setSelectedMaster] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        LoadingData();
    }, [editData]);

    const ClearData = () => {
        setSelectedMaster('');
        setName('');
        setDescription('');
        setStateCode('');
        setOpen(false);
        setRefreshData(oldValue => !oldValue);
    }

    const LoadingData = () => {
        setSelectedMaster(editData?.masterType || '')
        setName(editData?.name || '');
        setDescription(editData?.description || '');
        setStateCode(editData?.stateCode || '');
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        if (isAddButton) {

            AllMasterAdd({
                masterType: selectedMaster,
                name: name,
                description: description,
                stateCode: stateCode,

            }, handleSuccess, handleException);
        } else {
            AllMasterUpdate({
                id: editData?.id,
                masterType: selectedMaster,
                name: name,
                description: description,
                stateCode: stateCode,

            }, handleUpdateSuccess, handleException);
        }
    };

    const handleSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setRefreshData(oldValue => !oldValue);
            setLoading(false)
        }, 2000);
    };

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
            setLoading(false)
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        console.log("the error ", errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
            setRefreshData(oldValue => !oldValue);
            setLoading(false)
        }, 2000);
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

    const masterList = [
        // { id: 1, masterName: 'Currency', value: 'currency' },
        { id: 2, masterName: 'Supply Type', value: 'supplyType' },
        // { id: 3, masterName: 'GSTIN/UIN ID', value: 'gstinOrUin' },
        { id: 4, masterName: 'Place of Supply', value: 'placeOfSupply' },
    ]

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '60%', maxHeight: '100%' } }}
            maxWidth="md"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {isAddButton ? 'Add Master' : 'Edit Master'}
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                            <FormControl fullWidth style={{ marginTop: '10px' }}>
                                <InputLabel id="demo-simple-select-label">Select Master</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedMaster}
                                    label="Select Master"
                                    variant="filled"
                                    size='small'
                                    onChange={(e) => setSelectedMaster(e.target.value)}
                                >
                                    {masterList.map((data) => (
                                        <MenuItem key={data.id} value={data.value}>{data.masterName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Name"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                placeholder="Name"

                            />
                        </Grid>


                        {/* {
                            selectedMaster === 'gstinOrUin' &&
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    label="GSTIN/UIN ID"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    fullWidth
                                    required
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    placeholder="GSTIN/UIN ID"

                                />
                            </Grid>
                        } */}


                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Description"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                }}
                                placeholder="Description"

                            />
                        </Grid>
                        {selectedMaster === 'placeofSupply' &&
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    label="State Code"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    size='small'
                                    fullWidth
                                    required
                                    value={stateCode}
                                    onChange={(e) => {
                                        setStateCode(e.target.value)
                                    }}
                                    placeholder="State Code
                                    "

                                />
                            </Grid>
                        }

                    </Grid>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type="submit"
                            disabled={
                                loading === true
                            }
                        >
                            {/* {isAddButton ? 'Add' : 'Update'} */}
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (isAddButton ? 'Add' : 'Update')}
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

        </Dialog >
    )
}

export default SupplerCom