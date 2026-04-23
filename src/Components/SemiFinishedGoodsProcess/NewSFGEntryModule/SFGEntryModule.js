import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel,
} from '@mui/material';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from "@mui/icons-material/Search";
import { AddNewSFG, GetSFGItem, GetSFGUniqueID, SFGEdit,GetSearchedItems } from '../../../ApiService/LoginPageService';

const SFGEntryModule = ({
    open, setOpen, isAddButton, editData, setRefreshData,
}) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [rowId, setRowId] = useState('')
    const [sfgType, setSfgType] = useState('');
    const [sfgNo, setSfgNo] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [sfgDigit, setSfgDigit] = useState('')
    const [partNo, setPartNo] = useState('');
    const [partName, setPartName] = useState('');
    const [partId, setPartId] = useState('')
    const [uom, setUom] = useState('');
    const [uomId, setUomId] = useState('');
    const [location, setLocation] = useState('');
    const [locationId, setLocationId] = useState('')
    const [jobCardNo, setJobCardNo] = useState('');
    const [jobCardDate, setJobCardDate] = useState('');
    const [producedQty, setProducedQty] = useState('');
    const [remarks, setRemarks] = useState('');
    const [itemList, setItemList] = useState([]);
    const [uniqueDigit, setUniqueDigit] = useState('');
    const [uniqueCodeID, setUniqueID] = useState('');

    //

    useEffect(() => {
        setOpen(open);
        // open && GetSFGItem(handleGetSFGSucessShow, handleGetSFGException);
        GetSFGUniqueID(handleUniqueIDSucessShow, handleUniqueIDException)
        !isAddButton && loaderData();
    }, [editData]);

    // GET ITEM DROPDOWN
    const handleGetSFGSucessShow = (dataObject) => {
        setItemList(dataObject?.data || []);
    }
    const handleGetSFGException = (errorObject, errorMessage) => {
    }

    //UNIQUE ID
    const handleUniqueIDSucessShow = (dataObject) => {
        console.log("dadasdasdadasd", dataObject)
        setSfgDigit(dataObject.digit);
        setSfgNo(dataObject.id);
        // setItemList(dataObject?.data || []);
    }
    const handleUniqueIDException = (errorObject, errorMessage) => {
    }

    // const optionsItmList = itemList.map(item => ({
    //     id: item.id,
    //     itemCode: item.itemCode,
    //     label: item.itemCode,
    //     itemName: item.itemName,
    //     locId: item.locId,
    //     location: item.location,
    //     uom: item.uom,
    //     uomId: item.uomId
    // }));

    function handleSupplierAutocompleteChange(selectedValue) {
        setPartNo(selectedValue.itemCode);
        setPartId(selectedValue.id)
        setPartName(selectedValue.itemName);
        setUom(selectedValue.uom);
        setUomId(selectedValue.uomId);
        setLocation(selectedValue.location);
        setLocationId(selectedValue.locId)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isAddButton) {
            AddNewSFG({
                digit: sfgDigit,
                date: selectedDate,
                sfgNo: sfgNo,
                itemCode: partNo,
                itemName: partId,
                uom: uomId,
                location: locationId,
                jcNo: jobCardNo,
                jcDate: jobCardDate,
                producedBy: producedQty,
                remarks: remarks
            }, handleSuccess, handleException);
        } else {
            SFGEdit({
                id: rowId,
                digit: sfgDigit,
                date: selectedDate,
                sfgNo: sfgNo,
                itemCode: partNo,
                itemName: partId,
                uom: uomId,
                location: locationId,
                jcNo: jobCardNo,
                jcDate: jobCardDate,
                producedBy: producedQty,
                remarks: remarks
            }, handleSuccess, handleException);
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
        }, 2000);
    };

    const ClearData = () => {
        setOpen(false);
        setPartName('');
        setPartId('');
        setUom('');
        setUomId('');
        setLocation('');
        setJobCardNo('');
        setJobCardDate('');
        setProducedQty('');
        setRemarks('');
        setRefreshData(oldvalue => !oldvalue);
    }

    const loaderData = () => {
        setRowId(editData?.id || '')
        setSfgDigit(editData?.digit || '');
        setSelectedDate(editData?.date || '');
        setSfgNo(editData?.sfgNo || '');
        setPartNo(editData?.itemCode || '');
        setPartName(editData?.itemName || '');
        setUom(editData?.uom || '');
        setLocation(editData?.location || '');
        setJobCardNo(editData?.jcNo || '');
        setJobCardDate(editData?.jcDate || '');
        setProducedQty(editData?.producedBy || '');
        setRemarks(editData?.remarks || '');
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    //DATE CONVERT TO TEXTFIELD
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleChange = (e) => {
        // console.log(e.target.value)
        GetSearchedItems({ code: e.target.value }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
    }

    const handleItemVsProcessItemSucessShow = (dataObject) => {
        setItemList(dataObject?.data || []);
    }
    const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
    }


    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {isAddButton ? "Add New SFG" : "Edit SFG"}
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={sfgDigit}
                                onChange={(e) => setSfgDigit(e.target.value)}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                type='date'
                                required
                                value={formatDate(selectedDate)}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={sfgNo}
                                onChange={(e) => setSfgNo(e.target.value)}
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} marginTop={1}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={itemList}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Part No" onChange={handleChange}/>}
                                onChange={(event, value) => handleSupplierAutocompleteChange(value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Part Name"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={partName}
                                placeholder="Part Name"
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                            <TextField
                                id="filled-basic"
                                label="UOM"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={uom}
                                placeholder="UOM"
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Location"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Location"
                                disabled={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Job Card No"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={jobCardNo}
                                onChange={(e) => setJobCardNo(e.target.value)}
                                placeholder="Job Card No"
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                // label="Job Card Date"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                type='date'
                                required
                                value={jobCardDate}
                                onChange={(e) => setJobCardDate(e.target.value)}
                            // disabled={!isAddButton}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Produced Qty"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={producedQty}
                                onChange={(e) => setProducedQty(e.target.value)}
                                placeholder="Produced Qty"
                            // disabled={!isAddButton}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Remarks"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Remarks"
                            // disabled={!isAddButton}
                            />
                        </Grid>

                    </Grid>

                    <DialogActions>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                        >
                            {isAddButton ? 'Add' : 'Update'}
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

export default SFGEntryModule