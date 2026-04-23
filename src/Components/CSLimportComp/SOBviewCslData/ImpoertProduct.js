import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { SobExlProductMap } from '../../../ApiService/LoginPageService';
import CircularProgress from '@mui/material/CircularProgress';

const ImpoertProduct = ({
    open, setOpen, idId, setRefeshValue
}) => {

    const [file, setFile] = useState(null);
    const [isLoader, setIsLoader] = useState(false);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoader(true);
        SobExlProductMap({
            sobMstId: idId,
            file: file
        }, SobExlProductMapSuccess, SobExlProductMapException);


    }

    const SobExlProductMapSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setOpen(false);
            setIsLoader(false);
            setRefeshValue((oldValue) => !oldValue);
        }, 3000);
    }

    const SobExlProductMapException = (errorObject,errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
            // setOpen(false);
            setIsLoader(false);
            setRefeshValue((oldValue) => !oldValue);
        }, 3000);
    }

    const handleCslAddSucees = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();

        }, 2000);

    }

    const handleCslAddException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
    }

    const ClearData = () => {

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
            maxWidth="sm"
            open={open}
        >
            {/* <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>


            </DialogTitle> */}
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        {!isLoader ? (
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

                        ) : (

                            <Grid item md={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Box sx={{ display: 'flex' }}>
                                    <CircularProgress />
                                </Box>
                            </Grid>
                        )

                        }
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        type="submit" >
                        Upload
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

export default ImpoertProduct