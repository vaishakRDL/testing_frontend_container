import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { CheckBox } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from '@mui/material/Autocomplete';
import { FIMIDDataShow, HSNCodeDataShow, ItemAdd, ItemGroupShowMaster, ItemUpdate, MainLocationDataShow, ProductFamilyDataShow, ProductFinishDataShow, RMItemcodeDataShow, SobAdd, SobUpdate, SubLocationDataShow, UOMShowMaster, UnderLedgerDataShow } from '../../ApiService/LoginPageService';


const SOBimportModule = ({
    open, setOpen, isAddButton, editData, setRefreshData,
}) => {
    const [contractNo, setContractNo] = useState('');
    const [fimNo, setFimno] = useState('');
    const [msd, setMsd] = useState('');
    const [sheetName, setSheetName] = useState('');
    const [error, setError] = useState('');
    const [errorDescription, setErrorDescription] = useState('');

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        setContractNo(editData?.contractNo || '');
        setFimno(editData?.fimNo || '');
        setMsd(editData?.msd || '');
        setSheetName(editData?.sheetName || '');
    }, [editData]);

    const ClearData = () => {
        setContractNo('');
        setFimno('');
        setMsd('');
        setSheetName('');
    }

    const handleSubmit = (e) => {
        if (isAddButton) {
            SobAdd({
                contractNo: contractNo,
                fimNo: fimNo,
                msd: msd,
                sheetName: sheetName
            }, handleSobAddSuccess, handleSobAddException);
        } else {
            SobUpdate({
                id: editData?.id,
                contractNo: contractNo,
                fimNo: fimNo,
                msd: msd,
                sheetName: sheetName
            }, handleSobAddSuccess, handleSobAddException);
        }

    }

    const handleSobAddSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setOpen(false);

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
                                label="FIM No"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={fimNo}
                                placeholder="FIM No"
                                onChange={(e) => {
                                    setFimno(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="MSD"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={msd}
                                placeholder="MSD"
                                onChange={(e) => {
                                    setMsd(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Sheet Name"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={sheetName}
                                placeholder="Sheet Name"
                                onChange={(e) => {
                                    setSheetName(e.target.value);
                                }}
                            />
                        </Grid>
                        {/* <Grid item xs={12} sm={12}  md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Error"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={error}
                                placeholder="Error"
                                onChange={(e) => {
                                    setError(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Error Description"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={errorDescription}
                                placeholder="Error Description"
                                onChange={(e) => {
                                    setErrorDescription(e.target.value);
                                }}
                            />
                        </Grid> */}

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

export default SOBimportModule