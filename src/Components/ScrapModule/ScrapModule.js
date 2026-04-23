import {
    Button, Box, Dialog, Tooltip, CircularProgress, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AddHoliday, AddHolidayUpdate, ScrapeMaster, ScrapeMasterUpdate, SobUpdate, } from '../../ApiService/LoginPageService';

const ScrapModule = ({ open, setOpen, isAddButton, editData, setRefreshData, }) => {
    const [types, setTypes] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [addloading, setaddLoading] = useState(false);
    const [weightloading, setweightLoading] = useState(false);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        setTypes(editData?.type || '');
        setName(editData?.name || '');
        setDescription(editData?.description || '');
    }, [editData]);

    const ClearData = () => {
        setTypes('');
        setName('');
        setDescription('');
    }


    const onScrapeMasterAdd = (e) => {
        setaddLoading(true)
        e.preventDefault();
        if (isAddButton) {
            ScrapeMaster({
                type: types,
                name: name,
                description: description
            }, handleScrapeMasterSuccess, handleScrapeMasterException);
        } else {
            ScrapeMasterUpdate({
                id: editData?.id,
                type: types,
                name: name,
                description: description
            }, handleScrapeMasterSuccess, handleScrapeMasterException);

        }

    }

    const handleScrapeMasterSuccess = (dataObject) => {
        setaddLoading(false)

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setOpen(false);
            ClearData();
        }, 3000);
    }

    const handleScrapeMasterException = () => {
        setaddLoading(false)

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
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add Scrap Master' : 'Edit Scrap Master'}
            </DialogTitle>
            <form onSubmit={onScrapeMasterAdd}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} lg={12} xl={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Types </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={types}
                                    label="Customer Name"
                                    variant="filled"
                                    size='small'
                                    onChange={(e) => {
                                        setTypes(e.target.value);

                                    }}
                                >
                                    <MenuItem value={'Category'}>Category</MenuItem>
                                    <MenuItem value={'Raw Material'}>Raw Material</MenuItem>
                                    <MenuItem value={'Thickness'}>Thickness</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                placeholder='Name'
                                variant="filled"
                                value={name}
                                size='small'
                                onChange={(e) => {
                                    setName(e.target.value);

                                }}
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} xl={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                placeholder='Description'
                                variant="filled"
                                value={description}
                                size='small'
                                onChange={(e) => {
                                    setDescription(e.target.value);
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
                        disabled={addloading}
                    >
                        {addloading ? (
                            <CircularProgress size={24} style={{ color: 'white' }} />
                        ) : (
                            isAddButton ? 'Add' : 'Update'
                        )}


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

export default ScrapModule
