import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { MultiAddressAdd, MultiAddressDataDelete, MultiAddressDataShow, MultiAddressDataUpdate } from '../../../ApiService/LoginPageService';

const MultiAddressModule = ({ multiOpen, setMultiOpen, globleId }) => {
    const [supplierCode, setSupplierCode] = useState('')
    const [category, setCategory] = useState('');
    const [address, setAddress] = useState('');
    const [defaultShippingAddress, setDefaultShippingAddress] = useState('');
    const [multiAddress, setMultiAddress] = useState([]);
    const [multiRefresh, setMultiRefresh] = useState(true);
    const [isEditable, setIsEditable] = useState(false);
    const [dataRefresh,setDataRefresh] = useState(false);
    const [editId,setEditId] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (multiOpen) {

            MultiAddressDataShow({
                id: globleId
            }, handleMultiAddressDataShowSuccess, handleMultiAddressDataShowException);
        }

    }, [globleId, multiRefresh, multiOpen,isEditable,dataRefresh]);

    const handleMultiAddressDataShowSuccess = (dataObject) => {
        setMultiAddress(dataObject?.data || []);

    }

    const handleMultiAddressDataShowException = (errorObject, errorMessage) => {

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isEditable) {

            MultiAddressAdd({
                sId: globleId,
                code: supplierCode,
                category: category,
                address: address,
                defaultAddress: defaultShippingAddress
            }, handleMultiAddressAddSuccess, handleMultiAddressAddExceptiom);
        } else {
            MultiAddressDataUpdate({
                id:editId,
                sId: globleId,
                code: supplierCode,
                category: category,
                address: address,
                defaultAddress: defaultShippingAddress
            }, handleMultiAddressUpadteAddSuccess, handleMultiAddressAddExceptiom);

        }
    };

    
    const handleMultiAddressUpadteAddSuccess = (dataObject) => {

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setIsEditable(false);
            setMultiRefresh((oldValue) => !oldValue);
        }, 2000);
    }

    const handleMultiAddressAddSuccess = (dataObject) => {

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setMultiRefresh((oldValue) => !oldValue);
        }, 2000);
    }

    const handleMultiAddressAddExceptiom = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
            setMultiRefresh((oldValue) => !oldValue);
        }, 2000);

    }
    const ClearData = () => {
        setSupplierCode('')
        setIsEditable(false);
        setCategory('');
        setAddress('');
        setDefaultShippingAddress('');
    }
    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const columns = [
        // {
        //     field: 'customerName',
        //     headerName: 'Customer Code',
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'left',
        //     headerAlign: 'center',
        // },
        {
            field: 'category',
            headerName: 'Cotegory',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'address',
            headerName: 'Address',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'defaultAddress',
            headerName: 'Default Shipping Address',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerName: 'Actions',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];


    function EditData(props) {
        return (
            <EditIcon
                style={{ color: 'black' }}
                onClick={(event) => {
                    setIsEditable(true);
                    setEditId(props.selectedRow.id || '');
                    setSupplierCode(props.selectedRow.code || '');
                    setCategory(props.selectedRow.category || '');
                    setAddress(props.selectedRow.address || '');
                    setDefaultShippingAddress(props.selectedRow.defaultAddress || '');

                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    MultiAddressDataDelete({id:props.selectedRow.id},deletehandleSuccess,deletehandleException);
                }}
                style={{ color: 'black' }}
            />
        );
    }

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setTimeout(() => {
            handleClose();
            setDataRefresh((oldvalue) => !oldvalue);
        }, 3000);
    };

    const deletehandleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    };
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={multiOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Multi Address
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={3} lg={3}>
                            <TextField
                                sx={{ mb: 1 }}
                                label="Supplier Code"
                                type="text"
                                fullWidth
                                value={supplierCode}
                                onChange={(e) => setSupplierCode(e.target.value)}
                                variant="filled"
                                placeholder="Supplier Code"
                                size='small'
                                required
                                margin="dense"

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3}>
                            <TextField
                                sx={{ mb: 1 }}
                                label="Category"
                                type="text"
                                fullWidth
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                variant="filled"
                                placeholder="Category"
                                size='small'
                                required
                                margin="dense"

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3}>
                            <TextField
                                sx={{ mb: 1 }}
                                label="Address"
                                type="text"
                                fullWidth
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                variant="filled"
                                placeholder="Address"
                                size='small'
                                required
                                margin="dense"

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3}>
                            <TextField
                                sx={{ mb: 1 }}
                                label="Default Shipping Address"
                                type="text"
                                fullWidth
                                value={defaultShippingAddress}
                                onChange={(e) => setDefaultShippingAddress(e.target.value)}
                                variant="filled"
                                placeholder="Default Shipping Address"
                                multiline
                                required
                                margin="dense"
                                size='small'
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '-10px', borderRadius: '10px', width: '100%', height: '32vh' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={multiAddress}
                                        columns={columns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        sx={{
                                            height: '30vh',
                                            // minHeight: '480px',
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

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}

                            type="submit"

                        >
                            {
                                !isEditable ? 'Add' : 'Update'
                            }

                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setMultiOpen(false);
                                ClearData();
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>


            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Dialog>
    )
}

export default MultiAddressModule
