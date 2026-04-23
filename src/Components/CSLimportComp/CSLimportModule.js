import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { cslAdd, cslUpdate } from '../../ApiService/LoginPageService';
// import { Card } from 'react-bootstrap';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import { DataGrid } from '@mui/x-data-grid';
// import { CheckBox } from '@mui/icons-material';
// import SearchIcon from "@mui/icons-material/Search";
// import Autocomplete from '@mui/material/Autocomplete';
// import { FIMIDDataShow, HSNCodeDataShow, ItemAdd, ItemGroupShowMaster, ItemUpdate, MainLocationDataShow, ProductFamilyDataShow, ProductFinishDataShow, RMItemcodeDataShow, SubLocationDataShow, UOMShowMaster, UnderLedgerDataShow } from '../../ApiService/LoginPageService';


const CSLimportModule = ({
    open, setOpen, isAddButton, editData, setRefreshData,
}) => {
    const [contractNo, setContractNo] = useState('');
    const [partNo, setPartNo] = useState('');
    const [qty, setQty] = useState('');
    const [description, setDescription] = useState('');
    const [boxNo, setBoxNo] = useState('');

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        LoaderData();
    }, [editData]);

    const LoaderData = () => {
        setContractNo(editData?.contractNo || '');
        setPartNo(editData?.partNo || '');
        setQty(editData?.Qty || '');
        setDescription(editData?.description || '');
        setBoxNo(editData?.boxNo || '');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isAddButton) {
            cslAdd({
                contractNo: contractNo,
                partNo: partNo,
                Qty: qty,
                description: description,
                boxNo: boxNo
            }, handleCslAddSucees, handleCslAddException);
        } else {
            cslUpdate({
                id: editData.id,
                contractNo: contractNo,
                partNo: partNo,
                Qty: qty,
                description: description,
                boxNo: boxNo
            }, handleCslAddSucees, handleCslAddException);
        }

    }

    const handleCslAddSucees = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setRefreshData((oldValue) => !oldValue);
        }, 2000);

    }

    const handleCslAddException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
        }, 2000);
    }

    const ClearData = () => {
        setContractNo('');
        setPartNo('');
        setQty('');
        setDescription('');
        setBoxNo('');
        setOpen(false);
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
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add Item' : 'Edit Item'}

            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Contract No."
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={contractNo}
                                placeholder="Contract No."
                                onChange={(e) => {
                                    setContractNo(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Part No."
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={partNo}
                                placeholder="Part No."
                                onChange={(e) => {
                                    setPartNo(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <TextField
                                id="filled-basic"
                                label="Qty"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={qty}
                                placeholder="Qty"
                                onChange={(e) => {
                                    setQty(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <TextField
                                id="filled-basic"
                                label="Description"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={description}
                                placeholder="Description"
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <TextField
                                id="filled-basic"
                                label="Box No"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={boxNo}
                                placeholder="Box No"
                                onChange={(e) => {
                                    setBoxNo(e.target.value);
                                }}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        type="submit" >
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

export default CSLimportModule