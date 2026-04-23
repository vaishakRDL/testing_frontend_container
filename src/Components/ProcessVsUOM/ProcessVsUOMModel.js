import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel,
    CircularProgress,
} from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
// import MultiAddressModule from './MultlAddress/MultiAddressModule';
// import MultiContactPersonModule from './MultiContactPerson/MultiContactPersonModule';
// import FileUploadModule from './FileUpload/FileUploadModule';
import SearchIcon from "@mui/icons-material/Search";
import { AddProcessVsUOM, ProcessVsUOMEdit, GetProcess, GetUOM } from '../../ApiService/LoginPageService';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ProcessVsUOMModel = ({
    open, setOpen, isAddButton, editData, setRefreshData,
}) => {

    const [id, setId] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    //NEW//////
    const [rowId, setRowId] = useState('');
    const [selectedProcess, setSelectedProcess] = useState([]);
    const [selectedUOM, setSelectedUOM] = useState([]);
    const [description, setDescription] = useState('');
    const [processList, setProcessList] = useState([]);
    const [uomList, setUOMList] = useState([]);
    const [loading, setLoading] = useState(false);
    /////////////

    useEffect(() => {
        setOpen(open);
        open && GetProcess(handleProcessSucessShow, handleProcessExceptionShow);
        open && GetUOM(handleUOMSucessShow, handleUOMExceptionShow);

        !isAddButton && loaderData();
    }, [editData]);

    const handleSubmit = (event) => {
        setLoading(true);
        event.preventDefault();
        if (isAddButton) {
            AddProcessVsUOM({
                process: selectedProcess,
                uom: selectedUOM,
                description: description
            }, handleSuccess, handleException);
        } else {
            ProcessVsUOMEdit({
                id: rowId,
                process: selectedProcess,
                uom: selectedUOM,
                description: description
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
            setLoading(false);
        }, 2000);
    };

    // GETPROCESS
    const handleProcessSucessShow = (dataObject) => {
        setProcessList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleProcessExceptionShow = (errorObject, errorMessage) => {

    }
    // GETUOM
    const handleUOMSucessShow = (dataObject) => {
        setUOMList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleUOMExceptionShow = (errorObject, errorMessage) => {

    }

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
            setLoading(false);
        }, 2000);
    };

    const ClearData = () => {
        setOpen(false);
        setSelectedProcess([]);
        setSelectedUOM([]);
        setDescription('')
        setRefreshData(oldvalue => !oldvalue);
    }

    const loaderData = () => {
        setRowId(editData?.id || '')
        setSelectedProcess(editData?.pmId || '');
        setSelectedUOM(editData?.uomId || '');
        setDescription(editData?.description || '')
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

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Process Vs UOM
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4} marginTop={1}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Process</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Process"
                                    variant="filled"
                                    size='small'
                                    value={selectedProcess}
                                    onChange={(e) => setSelectedProcess(e.target.value)}
                                >
                                    {processList.map((data) => (
                                        <MenuItem key={data.id} value={data?.id} >{data?.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4} marginTop={1}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">UOM</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="UOM"
                                    variant="filled"
                                    size='small'
                                    value={selectedUOM}
                                    onChange={(e) => setSelectedUOM(e.target.value)}
                                >
                                    {uomList.map((data) => (
                                        <MenuItem key={data.id} value={data?.id} >{data?.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <TextField
                                id="filled-basic"
                                label="Description"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                size='small'
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description4"
                            />
                        </Grid>

                    </Grid>

                    <DialogActions>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            disabled={loading===true}
                        >
                            {/* {isAddButton ? 'Add' : 'Update'} */}
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (isAddButton ? 'Add' : 'Update')}
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

export default ProcessVsUOMModel