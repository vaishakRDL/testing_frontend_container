import { Autocomplete, Box, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, IconButton, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { UpdateVendorQuantity, GetDelNoteChildDetails, UploadReceivedQuantity } from '../../../ApiService/LoginPageService'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import LinearProgress from '@mui/material/LinearProgress';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ReceivedTemplateDownload } from '../../../ApiService/DownloadCsvReportsService';

const RecievedModal = ({ recievedModalOpen, setRecivedModalOpen, setBillingAddress, supplierSid, globleId, setSupplierItemList, setRefreshData, rowId }) => {

    const [dcNo, setDcNo] = useState('');
    const [dcFile, setDcFile] = useState('');
    const [invoiceNo, setInvoiceNo] = useState('');
    const [invoiceFile, setInvoiceFile] = useState('');
    const [recievedQty, setRecievedQty] = useState('');
    const [recievedTableList, setRecievedTableList] = useState([]);
    const [updatedData, setUpdatedData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [uploadLoader, setUploadLoader] = useState(false);
    const [pageRefresher, setPageRefresher] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const columns = [
        {
            field: 'jcNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'Job Card No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: 'Item Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'sfgQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'SFG Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'dispatchQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Dispatched Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'recievedQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Received Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: true,
            renderHeader: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', marginRight: '5px' }}>Received Qty</span>
                    <EditOutlinedIcon fontSize="small" style={{ color: '#ffffff' }} />
                </div>
            ),
        },
        // {
        //     field: 'recievedWeight',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: 'Received Weight',
        //     type: 'string',
        //     sortable: true,
        //     width: 150,
        //     // flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        //     editable: true,
        //     renderHeader: (params) => (
        //         <div style={{ display: 'flex', alignItems: 'center' }}>
        //             <span style={{ fontSize: '14px', marginRight: '5px' }}>Received Weight</span>
        //             <EditOutlinedIcon fontSize="small" style={{ color: '#ffffff' }} />
        //         </div>
        //     ),
        // },
        {
            field: 'status',
            headerClassName: 'super-app-theme--header',
            headerName: 'Status',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
    ];

    useEffect(() => {
        recievedModalOpen && GetDelNoteChildDetails({ id: rowId }, handleGetHistorySuccess, handleGetHistoryException);
    }, [recievedModalOpen, pageRefresher])

    //RECIEVED TABLE - CHILD API CALLED
    const handleGetHistorySuccess = (dataObject) => {
        setRecievedTableList(dataObject?.data || []);
    }
    const handleGetHistoryException = (errorObject, errorMessage) => {
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader(true);
        UpdateVendorQuantity({
            delScheduleId: rowId,
            dcNo: dcNo,
            dcFile: dcFile,
            invoiceNo: invoiceNo,
            invoiceFile: invoiceFile,
            itemsList: updatedData
        }, handleSuccess, handleFailure);
    };

    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setPageRefresher((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            clearData()
        }, 3000);
    }
    const handleFailure = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            handleClose();
            setLoader(false);
        }, 3000);
    }

    const handleClose = () => {
        setRecievedQty('')
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleCellEdit = (params) => {
        if (params.recievedQty /*|| params.recievedWeight*/) {
            // Check if an item with the same id already exists
            const existingItemIndex = updatedData.findIndex(item => item.id === params.id);
            if (existingItemIndex !== -1) {
                // If the item already exists, update its receivedQty and receivedWeight
                const updatedDataCopy = [...updatedData];
                if (params.recievedQty) {
                    updatedDataCopy[existingItemIndex].recievedQty = Number(params.recievedQty);
                }
                // if (params.recievedWeight) {
                //     updatedDataCopy[existingItemIndex].recievedWeight = Number(params.recievedWeight);
                // }
                setUpdatedData(updatedDataCopy);
            } else {
                // If the item doesn't exist, add it to the array
                const newItem = { id: params.id };
                if (params.recievedQty) {
                    newItem.recievedQty = Number(params.recievedQty);
                }
                // if (params.recievedWeight) {
                //     newItem.recievedWeight = Number(params.recievedWeight);
                // }
                setUpdatedData([...updatedData, newItem]);
            }
        } else {
            // Remove the item with the matching id
            const newData = updatedData.filter((item) => item.id !== params.id);
            setUpdatedData(newData);
        }
    };

    const clearData = () => {
        setUpdatedData([]);
        setRecivedModalOpen(false);
        setDcNo('');
        setDcFile('');
        setInvoiceNo('');
        setInvoiceFile('');
        setLoader(false);
    }

    const handleTemplateDownload = () => {
        ReceivedTemplateDownload({ id: rowId }, handleTempDownloadSuccess, handleTempDownloadException)
    }
    const handleTempDownloadSuccess = () => { }
    const handleTempDownloadException = () => { }

    // XL UPLOAD HANDLER
    const handleItemImportSucess = (dataObject) => {
        setUploadLoader(false);
        setPageRefresher((oldvalue) => !oldvalue);

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const handleItemImportException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // setUploadLoader(false);
            // handleClose();
        }, 2000);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={recievedModalOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Enter Recieved Quantity
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2} padding={2} >
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                id="filled-basic"
                                label="DC NO"
                                variant="filled"
                                value={dcNo}
                                onChange={(e) => setDcNo(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                style={{
                                }}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            if (reader.readyState === 2) {
                                                setDcFile(reader.result)
                                            }
                                        };
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }}
                                label='Upload DC'
                                InputLabelProps={{ shrink: true }}
                                type="file" />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                id="filled-basic"
                                label="Invoice No"
                                variant="filled"
                                value={invoiceNo}
                                onChange={(e) => setInvoiceNo(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                style={{
                                }}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            if (reader.readyState === 2) {
                                                setInvoiceFile(reader.result)
                                            }
                                        };
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }}
                                label='Upload Invoice'
                                InputLabelProps={{ shrink: true }}
                                type="file" />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <DataGrid
                                rows={recievedTableList}
                                columns={columns}
                                pageSize={8}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ border: 'none', }}
                                sx={{
                                    overflow: 'auto',
                                    height: '50vh',
                                    marginTop: '10px',
                                    width: '100%',
                                    '& .super-app-theme--header': {
                                        WebkitTextStrokeWidth: '0.6px',
                                        backgroundColor: '#93bce6',
                                        color: '#1c1919'
                                    },
                                    '& .MuiDataGrid-cell': {
                                        border: '1px solid #969696',
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        border: '1px solid #969696',
                                    },
                                }}
                                getRowClassName={(params) => {
                                    const rowIndex = recievedTableList.findIndex(row => row.id === params.row.id);
                                    if (rowIndex !== -1) {
                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    }
                                    return '';
                                }}
                                rowHeight={40}
                                columnHeaderHeight={40}
                                processRowUpdate={handleCellEdit}
                            />
                        </Grid>
                        {loader && <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>}
                    </Grid>

                    {uploadLoader &&
                        <Box sx={{ width: '100%', marginBottom: '15px' }}>
                            <LinearProgress />
                        </Box>
                    }
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={handleTemplateDownload}
                        >
                            Template
                        </Button>
                        <Button
                            variant="contained"
                            component="label"
                            htmlFor="upload-photo"
                            sx={{ backgroundColor: '#002D68', height: '35px', marginLeft: '10px', marginRight: '30px' }}
                        >
                            Upload File
                        </Button>
                        <input
                            id="upload-photo"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        if (reader.readyState === 2) {
                                            setUploadLoader(true)
                                            UploadReceivedQuantity({
                                                dcNo: dcNo,
                                                dcFile: dcFile,
                                                invoiceNo: invoiceNo,
                                                invoiceFile: invoiceFile,
                                                file: reader.result,
                                                delscheduleId: rowId
                                            }, handleItemImportSucess, handleItemImportException);
                                        }
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                }
                            }}

                        />
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type="submit"
                        >
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                clearData()
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>


            <NotificationBar
                // handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Dialog>
    )
}

export default RecievedModal
