import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { supplierUploadFile } from '../../../ApiService/LoginPageService';

const FileUploadModule = ({ fileUploadOpen, setFileUploadOpen, globleId,setDataRefresh }) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const [fileUpload, setFileUpload] = useState('');
    const [file, setFile] = useState('');
    const [selectFileName, setSelectFileName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        supplierUploadFile({
            sId: globleId,
            fileType: selectFileName,
            file: fileUpload
        }, handlesupplierUploadFileSuccess, handlesupplierUploadFileException)

    };

    const handlesupplierUploadFileSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setDataRefresh((oldValue)=>! oldValue);
        }, 2000);
    }

    const handlesupplierUploadFileException = (errorObject, errorMessage) => {
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
        setFileUpload('');
        setSelectFileName('');
        setFileUploadOpen(false);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: 'purple' }}
                onClick={(event) => {

                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {

                }}
                style={{ color: 'purple' }}
            />
        );
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={fileUploadOpen}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                File Upload
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="demo-simple-select-label">Select File Name</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectFileName}
                                    label="Select File Name"
                                    size='small'
                                    variant="filled"
                                    onChange={(e) => {
                                        setSelectFileName(e.target.value);
                                    }}
                                >
                                    <MenuItem value={'GST Certificate'}>GST Certificate</MenuItem>
                                    <MenuItem value={'Incorporation Certificate'}>Incorporation Certificate</MenuItem>
                                    <MenuItem value={'Aadhaar'}>Aadhaar</MenuItem>
                                    <MenuItem value={'PanCard'}>PanCard</MenuItem>
                                    <MenuItem value={'MSMA Certificate'}>MSMA Certificate</MenuItem>
                                    <MenuItem value={'Other'}>Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                // variant="filled"
                                margin="dense"
                                // value={fileUpload}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            if (reader.readyState === 2) {
                                                setFileUpload(reader.result);
                                                // setFile(reader.result);
                                            }
                                        };
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                                type="file" />
                        </Grid>

                

                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}

                            type="submit"

                        >
                            Add
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setFileUploadOpen(false);

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

export default FileUploadModule;