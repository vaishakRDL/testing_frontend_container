import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DispatchExlimport, PcnImport, PcnStoreApi, PcnUniqueNo, } from '../../ApiService/LoginPageService';
import { DataGrid } from '@mui/x-data-grid';
import AuthoriseDocumentsModule from '../PurchaseOrderAuthorization/AuthoriseDocuments/AuthoriseDocumentsModule';

const SOPriceChangeModule = ({ open, setOpen, setRefreshData, isAddButton }) => {

    const [date, setDate] = useState('');
    const [file, setFile] = useState('');
    const [fileData, setFileData] = useState([]);
    const [viewData, setViewData] = useState([]);
    const [authorization, setAuthorization] = useState(false);

    const [pcnNo, setPcnNo] = useState('');
    const [effectiveFromDt, seteffectiveFromDt] = useState('');
    const [refNo, setRefno] = useState('');
    const [pcnItems, setPcnItems] = useState('');

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (open) {
            PcnUniqueNo(handlePcnUniqueNoSuccess, handlePcnUniqueNoException);
        }
    }, [open]);

    const handlePcnUniqueNoSuccess = (dataObject) => {
        setPcnNo(dataObject?.data?.pcnNo || '');
    }

    const handlePcnUniqueNoException = () => {

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!authorization) {
            PcnStoreApi({
                pcnNo: pcnNo,
                effectiveFromDt: effectiveFromDt,
                refNo: refNo,
                pcnItems: pcnItems
            }, handlePcnStoreApiSuccess, handlePcnStoreApiException);
        }

    }

    const handlePcnStoreApiSuccess = (dataObject) => {

    }

    const handlePcnStoreApiException = () => {

    }

    const handleDispatchExlimportSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setOpen(false);
            setDate('');
            setRefreshData((oldvalue) => !oldvalue);
        }, 3000);
    }

    const handleDispatchExlimportException = () => {

    }

    const handleSobAddSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

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
            field: 'id',
            headerClassName: 'super-app-theme--header',
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
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Part No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Part Name
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                UOM
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'LastEffFromDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Last Eff From Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'Existing Rate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Existing Rate
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'Existing LCR',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Existing LCR
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'Existing Freight',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Existing Freight
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Existing landing',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Existing landing
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'newBasePrice',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Basic Rate
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'LCR',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    LCR
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Freight',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Freight
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'prevBasePrice',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Landing
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'percent',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Difference
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
    ];


    const handlePcnImportSuccess = (dataObject) => {
        setViewData(dataObject?.data || []);
    }

    const handlePcnImportException = () => {

    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Price Change Add' : 'Price Change Edit'}

            </DialogTitle>
            <form onSubmit={handleSubmit}>
                {
                    !authorization ? (
                        <DialogContent >
                            <Grid container spacing={2}>

                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        id="filled-basic"
                                        label="PCN No"
                                        variant="filled"
                                        sx={{ mb: 1 }}
                                        size='small'
                                        fullWidth
                                        value={pcnNo}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="PCN No"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                                    <TextField
                                        id="filled-basic"
                                        label="Date"
                                        variant="filled"
                                        sx={{ mb: 1 }}
                                        size='small'
                                        type='date'
                                        fullWidth

                                        value={date}
                                        onChange={(e) => {
                                            setDate(e.target.value);
                                        }}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="Date"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                                    <TextField
                                        id="filled-basic"
                                        // label="Date"
                                        variant="filled"
                                        sx={{ mb: 1 }}
                                        size='small'
                                        // type='date'
                                        fullWidth

                                        value={pcnItems}
                                        onChange={(e) => {
                                            setPcnItems(e.target.value);
                                        }}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                    // placeholder="Date"
                                    />
                                </Grid>


                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        id="filled-basic"
                                        label="Eff Date From"
                                        variant="filled"
                                        sx={{ mb: 1 }}
                                        size='small'
                                        type='date'
                                        value={effectiveFromDt}
                                        onChange={(e) => {
                                            seteffectiveFromDt(e.target.value);
                                        }}
                                        fullWidth
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="Eff Date From"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        id="filled-basic"
                                        label="Ref No"
                                        variant="filled"
                                        sx={{ mb: 1 }}
                                        size='small'
                                        fullWidth
                                        required

                                        value={refNo}
                                        onChange={(e) => {
                                            setRefno(e.target.value);
                                        }}
                                        placeholder="Ref No"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <input
                                        id="upload-photo"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                const selectedFile = e.target.files[0];
                                                setFileData(selectedFile.name);
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    if (reader.readyState === 2) {
                                                        setFile(reader.result);
                                                        PcnImport({
                                                            file: reader.result
                                                        }, handlePcnImportSuccess, handlePcnImportException);
                                                    }
                                                };
                                                reader.readAsDataURL(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        component="label"
                                        htmlFor="upload-photo"
                                        sx={{ backgroundColor: '#002D68', height: '40px', width: '200px' }}
                                    >
                                        Import
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        style={{ width: '200px', background: '#002D68', color: 'white' }}
                                        onClick={() => {
                                            setAuthorization(true);
                                        }}
                                    >
                                        Authorization
                                    </Button>
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <DataGrid
                                        rows={viewData}
                                        columns={columns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', fontWeight: 'bold', overflowY: 'scroll' }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '55vh',
                                            // minHeight: '500px',
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                WebkitTextStrokeWidth: '0.6px',
                                                backgroundColor: '#93bce6',
                                                color: '#1c1919'
                                            },
                                        }}
                                        getRowClassName={(params) => {
                                            // Find the index of the row within the rows array
                                            const rowIndex = [].findIndex(row => row.id === params.row.id);
                                            // Check if the index is valid
                                            if (rowIndex !== -1) {
                                                console.log(' ');
                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return ''; // Return default class if index is not found
                                        }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />
                                </Grid>

                            </Grid>
                        </DialogContent>
                    ) : (
                        <AuthoriseDocumentsModule />
                    )

                }
                <DialogActions>

                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        type="submit" >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);
                            setAuthorization(false);
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

export default SOPriceChangeModule
