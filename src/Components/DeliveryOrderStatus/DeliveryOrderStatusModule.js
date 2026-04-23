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

const DeliveryOrderStatusModule = ({ open, setOpen, isAddButton, editData, setRefreshData, }) => {
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

    const columns = [
        {
            field: 'contractNo',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'fimNo',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Sales Order No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'msd',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                MRP No
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'sheetName',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Contract
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'po',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    QTY
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'dc',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Product Type
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'vch',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Type Of Shipment
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'Time',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Duty
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Statues',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Qty Stops
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'pre',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Prefer
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'fim',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    FIM
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
    ];


    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={open}
        >
            {/* <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add Tool' : 'Edit Tool'}

            </DialogTitle> */}
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>

                        <Card style={{ borderRadius: '8px', height: '600px', width: '100%', marginTop: '10px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                            <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <DataGrid
                                    rows={[]}
                                    columns={columns}
                                    pageSize={8}

                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none', fontWeight: 'bold' }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '60vh',
                                        // minHeight: '500px',
                                        width: '100%',
                                        '& .super-app-theme--header': {
                                            WebkitTextStrokeWidth: '0.6px',

                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696',
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696', // Add border to column headers
                                        },
                                    }}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </DialogContent>
                <DialogActions>

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

export default DeliveryOrderStatusModule
