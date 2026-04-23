import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment, CardActionArea,
} from '@mui/material';
import React, { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { ItemDownloadExlExport } from '../../../ApiService/DownloadCsvReportsService';

const BulkPriceUpdate = ({
    open, setOpen, setRefreshData
}) => {

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const [file, setFile] = useState('');


    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const [onLoader, setOnLoader] = useState(false);

    const handleSubmit = () => {
        setOnLoader(true);
        // ItemDuplicateItems(
        //     { file: file },
        //     ItemDuplicateItemsSuccess,
        //     ItemDuplicateItemsException
        // );
    }

    const DownloadItemDuplicateTemplateSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }

    const DownloadItemDuplicateTemplateException = () => {

    }

    const handleItemDownloadExlExportSucess = () => {

    }

    const handleItemDownloadExlExportException = () => {

    }
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="sm"
            open={open}
        >
            <DialogTitle style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                Bulk Price Update
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '200px', background: '#002D68', color: 'white' }}

                    >
                        Download Template
                    </Button>
                    {/* <Button
                        variant="contained"
                        style={{ width: '250px', background: '#002D68', color: 'white' }}

                     
                    >

                        Copy from Imp Load
                    </Button> */}
                    <LoadingButton
                        variant="contained"
                        loading={onLoader}
                        style={{ width: '200px', background: '#002D68', }}
                        type='submit'
                    >
                        Bulk Price Update
                    </LoadingButton>

                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setRefreshData((oldValue) => !oldValue);
                            setOpen(false);
                            setOnLoader(false);
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

export default BulkPriceUpdate