import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel,
} from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from "@mui/icons-material/Search";
import { GetSfgRefNo, SfgVendorProcessSubmit } from '../../ApiService/LoginPageService';

const SfgVendorProcessModule = (
    {
        open,
        setOpen,
        isAddButton,
        editData,
        setRefreshData,
        idsArray,
        setIdsArray,
        setSelectAll,
        setRefreshKey
    }
) => {

    const [dispatchDate, setDispatchDate] = useState('');
    const [dispatchTime, setDispatchTime] = useState('');
    const [sfgRefNo, setSfgRefNo] = useState('');
    const [vehicleNo, setVehicleNo] = useState('');
    const [weight, setWeight] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    console.log("idsArray modal", idsArray);

    useEffect(() => {
        setOpen(open);
        open && GetSfgRefNo(handleShiftSucessShow, handleShiftExceptionShow);
    }, [editData]);

    const handleShiftSucessShow = (dataObject) => {
        setSfgRefNo(dataObject.sfgRefNo || '');
    }
    const handleShiftExceptionShow = () => { }

    const handleSubmit = (event) => {
        event.preventDefault();
        SfgVendorProcessSubmit({
            sfgRefNo: sfgRefNo,
            dispatchDate: dispatchDate,
            dispatchTime: dispatchTime,
            vehicleNo: vehicleNo,
            itemsList: idsArray,
            weight: weight
        }, handleSuccess, handleException);
    };

    const handleSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setIdsArray([]);
            ClearData();
            handleClose();
            setRefreshData(oldvalue => !oldvalue);
            setSelectAll(false);
            setRefreshKey((prevKey) => prevKey + 1);
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
            setIdsArray([]);
            // ClearData();
            // handleClose();
            setRefreshData(oldvalue => !oldvalue);
            setSelectAll(false);
        }, 2000);
    };

    const ClearData = () => {
        setOpen(false);
        setDispatchDate('');
        setDispatchTime('');
        setSfgRefNo('');
        setVehicleNo('');
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
            sx={{ '& .MuiDialog-paper': { width: '100%' } }}
            maxWidth="md"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                SFG Vendor Process
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    variant="filled"
                                    type="date"
                                    label="Date"
                                    style={{ marginTop: '8px' }}
                                    fullWidth
                                    InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                    value={dispatchDate}
                                    onChange={(e) => {
                                        setDispatchDate(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    label="Dispatch Time"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    type='time'
                                    fullWidth
                                    required
                                    value={dispatchTime}
                                    onChange={(e) => setDispatchTime(e.target.value)}
                                    placeholder="Dispatch Time"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    label="SFG Ref No"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    fullWidth
                                    required
                                    value={sfgRefNo}
                                    placeholder="SFG Ref No"
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    label="Vehicle No"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    fullWidth
                                    required
                                    value={vehicleNo}
                                    onChange={(e) => setVehicleNo(e.target.value)}
                                    placeholder="Vehicle No"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    label="Weight"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    fullWidth
                                    required
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    placeholder="Weight"
                                />
                            </Grid>
                        </Grid>
                    </div>

                    <DialogActions>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setOpen(false)
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
        </Dialog>
    )
}

export default SfgVendorProcessModule