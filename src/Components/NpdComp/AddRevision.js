import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment, Card,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AddHoliday, AddHolidayUpdate, NpdRevision, NpdRevisionId, SobUpdate, } from '../../ApiService/LoginPageService';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

const AddRevision = ({ Open, setOpen, editData,setRefreshData }) => {

    const [fileType, setFileType] = useState('');
    const [revisionNo, setRevisionNo] = useState('');
    const [remark, setRemark] = useState('');
    const [file, setFile] = useState('');

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        setFileType(editData?.fileType || '');
        setRevisionNo(editData?.revisionNo || '');
      
    }, [editData]);

    const ClearData = () => {
        // setFileType('');
        // setRevisionNo('');
        // setRemark('');
        // setFile('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        NpdRevision({
            npdId: editData?.id,
            fileType: fileType,
            revisionNo: revisionNo,
            version: " ",
            file: file,
            remarks: remark
        }, handleNpdRevisionSuccess, handleNpdRevisionException);

    }

    const handleNpdRevisionSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setTimeout(() => {
            handleClose();
            setRefreshData((oldValue)=>!oldValue);
            ClearData();
            setOpen(false);
        }, 3000);
    }

    const handleNpdRevisionException = () => {

    }

    const handleSobAddSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });


        setTimeout(() => {
            handleClose();

            ClearData();
        }, 3000);
    }

    const handleSobAddException = () => {

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
            maxWidth={'md'}
            open={Open}
        >
            {/* <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add Holiday' : 'Edit Holiday'}

            </DialogTitle> */}
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} lg={6} xl={6} style={{

                        }}>
                            <TextField
                                fullWidth
                                label="File Type"
                                placeholder='File Type'
                                variant="filled"
                                InputLabelProps={{ shrink: true }}
                                value={fileType}
                                onChange={(e) => {
                                    setFileType(e.target.value);
                                }}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="Revision No"
                                placeholder='Revision No'
                                variant="filled"
                                InputLabelProps={{ shrink: true }}
                                value={revisionNo}
                                onChange={(e) => {
                                    setRevisionNo(e.target.value);
                                }}
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                style={{
                                    // margin: '10px'
                                }}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            if (reader.readyState === 2) {
                                                setFile(reader.result);
                                            }
                                        };
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                                type="file" />
                        </Grid>

                        <Grid item xs={12} sm={12} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="Renark"
                                placeholder='Renark'
                                variant="filled"
                                value={remark}
                                onChange={(e) => {
                                    setRemark(e.target.value);
                                }}
                                required
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                      type='submit'
                    >
                        Add File
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

export default AddRevision 
