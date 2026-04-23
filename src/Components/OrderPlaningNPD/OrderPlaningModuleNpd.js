import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, FormLabel, RadioGroup, Radio, Card,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';

const OrderPlaningModuleNpd = ({
    open, setOpen, isAddButton, customerData, setRefreshData,
}) => {
    const [POContractref, setPOContractref] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [KANBANDeliveryOrder, setKANBANDeliveryOrder] = useState('');
    const [remarks, setRemark] = useState('');
    const [typeOfAdd, settypeOfAdd] = useState('Add')
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [file, setFile] = useState(null);
    const [fileUpload, setFileUpload] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };
    const handleChange = (e) => {
        setCustomerName(e.target.value);
    }

    const columns = [
        // {
        //     field: 'customerName',
        //     headerName: 'No',
        //     type: 'string',
        //     sortable: true,
        //     maxWidth: 40,
        //     flex: 1,
        //     align: 'left',
        //     headerAlign: 'center',
        // },
        {
            field: 'customerCode',
            headerName:
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'primaryContactNumber',
            headerName: 'Order No',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'PO',
            headerName: 'PO | Contract |R&D',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'Customer Name',
            headerName: 'Customer Name',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'Kanban Date',
            headerName: 'Kanban Date',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'scheduled Date',
            headerName: 'Scheduled Date',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'Delay Date',
            headerName: 'Delay',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'priority  Date',
            headerName: 'priority',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'Status',
            headerName: 'Status',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerName: 'Actions',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            minWidth:400,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];

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
            maxWidth="false"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'order planningg' : 'order planning'}

            </DialogTitle>
            <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                       
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '20px' }}>
                            <Card style={{ borderRadius: '8px', height: '45vh', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)' }}>
                                <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <DataGrid
                                        rows={[]}
                                        columns={columns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '50vh',
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
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '200px', background: '#002D68', color: 'white' }}
                        // disabled={
                        //     errorObject?.customerId?.errorStatus
                        //     || errorObject?.GSTNumber?.errorStatus
                        //     || errorObject?.customerName?.errorStatus
                        //     || errorObject?.billingAddress?.errorStatus
                        //     || errorObject?.address?.errorStatus
                        //     || errorObject?.shippingAddress?.errorStatus
                        //     || errorObject?.contactPersonName?.errorStatus
                        //     || errorObject?.primaryContactnumber?.errorStatus
                        //     || errorObject?.phoneNumber?.errorStatus
                        //     || errorObject?.email?.errorStatus
                        // }
                        type="submit"

                    >
                        {isAddButton ? 'Add Sales Order' : 'Update Sales Order'}
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
            </form>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

        </Dialog>
    )
}

export default OrderPlaningModuleNpd