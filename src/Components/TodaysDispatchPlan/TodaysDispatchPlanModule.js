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

const TodaysDispatchPlanModule = ({ open, setOpen, isAddButton, editData, setRefreshData, }) => {
    const [contractNo, setContractNo] = useState('');
    const [fimNo, setFimno] = useState('');
    const [msd, setMsd] = useState('');
    const [sheetName, setSheetName] = useState('');
    const [error, setError] = useState('');
    const [errorDescription, setErrorDescription] = useState('');
    const [partImage, setPartImage] = useState('');

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
            maxWidth="sm"
            open={open}
        >
            {/* <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add Tool' : 'Edit Tool'}

            </DialogTitle> */}
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <TextField
                                id="filled-basic"
                                label="Shipment Date"
                                variant="filled"
                                sx={{ mb: 1 }}
                                type="date"
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                                value={fimNo}
                                placeholder="Shipment Date"
                                onChange={(e) => {
                                    setFimno(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={12} xl={12}>
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
                                                setPartImage(reader.result);
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
                        style={{ width: '250px', background: '#002D68', color: 'white' }}
                        type="submit" >
                        Upload Shipment Plan
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

export default TodaysDispatchPlanModule
