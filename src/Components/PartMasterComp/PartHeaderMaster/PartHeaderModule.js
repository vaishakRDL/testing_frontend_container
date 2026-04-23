import {
    Button, Box, Dialog, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { CheckBox } from '@mui/icons-material';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { ItemMasterAdd, ItemMasterUpdate } from '../../../ApiService/LoginPageService';

const PartHeaderModule = (
    {
        open, setOpen, isAddButton, editeData, setRefreshData,
    }

) => {
    const [selectedMaster, setSelectedMaster] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [permission, setPermission] = useState('');
    const [packingCharge, setPackingCharge] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        LoaderData();
    }, [editeData]);

    const LoaderData = () => {
        setSelectedMaster(editeData?.masterType || '');
        setName(editeData?.name || '');
        setDescription(editeData?.description || '');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isAddButton) {
            ItemMasterAdd({
                masterType: selectedMaster,
                name: name,
                description: description,
                permission: permission,
                packingCharge: packingCharge,
            }, handleItemMasterAddSuccess, handleItemMasterAddExcepton);

        } else {
            ItemMasterUpdate({
                id: editeData?.id,
                masterType: selectedMaster,
                name: name,
                description: description,
                packingCharge: packingCharge,
            }, handleItemMasterAddSuccess, handleItemMasterAddExcepton);

        }

    };

    const handleItemMasterAddSuccess = (dataObject) => {
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

    const handleItemMasterAddExcepton = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
            setRefreshData((oldValue) => !oldValue);
        }, 2000);
    }

    const ClearData = () => {
        setSelectedMaster('');
        setName('');
        setDescription('');
        setOpen(false);
    }

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
        { id: 1, masterName: 'Under Ledger', value: 'underLedger' },
        { id: 2, masterName: 'Reorder', value: 'reorder' },
        { id: 3, masterName: 'Main Location', value: 'mainLocation' },
        { id: 4, masterName: 'HSNCode', value: 'hsnCode' },
        { id: 5, masterName: 'Sub Location', value: 'subLocation' },
        { id: 6, masterName: 'Product Finish', value: 'productFinish' },
        { id: 7, masterName: 'Product Family', value: 'productFamily' },
        { id: 8, masterName: 'Category', value: 'category' },
        { id: 9, masterName: 'FIM', value: 'fim' },
        // { id: 10, masterName: 'RM Itemcode', value: 'rmItemcode' },
        { id: 11, masterName: 'BUY PRODUCTION', value: 'BUYPRODUCTION' },
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
                        {
                            selectedMaster !== 'gstinOrUin' &&
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    label="Name"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    fullWidth
                                    required
                                    size='small'
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    placeholder="Name"

                                />
                            </Grid>
                        }
                        {
                            selectedMaster === 'gstinOrUin' &&
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    label="GSTIN/UIN ID"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    fullWidth
                                    type='number'
                                    size='small'
                                    required
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                    placeholder="GSTIN/UIN ID"

                                />
                            </Grid>
                        }
                        {selectedMaster === 'placeofSupply' &&
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    label="State Code"
                                    size='small'
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    fullWidth
                                    required
                                    value={stateCode}
                                    onChange={(e) => {
                                        setStateCode(e.target.value)
                                    }}
                                    placeholder="State Code"

                                />
                            </Grid>
                        }
                        {
                            selectedMaster === 'fim' &&
                            <>
                                {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <FormControl fullWidth style={{ marginTop: '10px' }}>
                                        <InputLabel id="demo-simple-select-label">Permission</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={permission}
                                            label="Permission"
                                            variant="filled"
                                            size='small'
                                            onChange={(e) => setPermission(e.target.value)}
                                        >

                                            <MenuItem value='Y'>Y</MenuItem>
                                            <MenuItem value='N'>N</MenuItem>

                                        </Select>
                                    </FormControl>
                                </Grid> */}
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        id="filled-basic"
                                        label="Packing Charges"
                                        size='small'
                                        type='number'
                                        variant="filled"
                                        sx={{ mb: 1 }}
                                        margin="dense"
                                        fullWidth
                                        required
                                        value={packingCharge}
                                        onChange={(e) => {
                                            setPackingCharge(e.target.value)
                                        }}
                                        placeholder="Packing Charges"

                                    />
                                </Grid>
                            </>

                        }
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Description"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                size='small'
                                // required
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                }}
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
                                ClearData();
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

export default PartHeaderModule