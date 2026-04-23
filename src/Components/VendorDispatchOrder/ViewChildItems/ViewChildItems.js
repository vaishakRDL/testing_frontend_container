import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { UpdateVendorQuantity, GetDeliveryHistoryNote, GetDelNoteChildDetails } from '../../../ApiService/LoginPageService'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Autocomplete, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';

const ViewChildItems = ({ childItemsModalOpen, setChildItemsModalOpen, setBillingAddress, supplierSid, globleId, setSupplierItemList, setRefreshData, rowId }) => {

    const [receivedHistory, setReceivedHistory] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const columns = [
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
            headerName: 'sfgQty',
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
        },
        {
            field: 'pendingQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Pending Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
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
        }
    ];

    useEffect(() => {
        childItemsModalOpen && GetDelNoteChildDetails({ id: rowId }, handleGetHistorySuccess, handleGetHistoryException);
    }, [childItemsModalOpen])

    const handleGetHistorySuccess = (dataObject) => {
        setReceivedHistory(dataObject?.data || []);
    }
    const handleGetHistoryException = (errorObject, errorMessage) => {
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
            maxWidth="md"
            open={childItemsModalOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                View Child Items
            </DialogTitle>
            <DialogContent>
                <DataGrid
                    rows={receivedHistory}
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
                    rowHeight={40}
                    columnHeaderHeight={40}
                    getRowClassName={(params) => {
                        const rowIndex = receivedHistory.findIndex(row => row.id === params.row.id);
                        if (rowIndex !== -1) {
                            console.log(' ');
                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                        }
                        return '';
                    }}
                />
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setChildItemsModalOpen(false);
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
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

export default ViewChildItems;
