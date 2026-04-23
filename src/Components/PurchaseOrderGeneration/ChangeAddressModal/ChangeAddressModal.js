import { Autocomplete, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GetSuppVsItemSuppList, GetSuppVsItemSuppItemList, GetSuppAllAddress } from '../../../ApiService/LoginPageService';

const ChangeAddressModal = ({ changeAddressModalOpen, setChangeAddressModalOpen, setSuppAddress, supplierSid, globleId, setSupplierItemList }) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [suppAllAddressList, setSuppAllAddressList] = useState([])

    // PENDING PO COLUMN
    const pendingPoColumns = [
        {
            field: 'category',
            headerClassName: 'super-app-theme--header',
            headerName: 'Category',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'address',
            headerClassName: 'super-app-theme--header',
            headerName: 'Address',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
    ];

    const Address = [{
        id: 1,
        Address: 'udupi'
    }]

    useEffect(() => {
        changeAddressModalOpen && GetSuppAllAddress({ sId: supplierSid }, handleGetSuppVsItemSuppListSucessShow, handleGetSuppVsItemSuppListExceptionShow);
    }, [changeAddressModalOpen])

    // GET SUPPLIER LIST
    const handleGetSuppVsItemSuppListSucessShow = (dataObject) => {
        setSuppAllAddressList(dataObject?.data || []);
    }
    const handleGetSuppVsItemSuppListExceptionShow = (errorObject, errorMessage) => {
    }

    const handleRowClick = (params) => {
        console.log("handleRowClick", params)
        setSuppAddress(params.row.address);
        setChangeAddressModalOpen(false);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={changeAddressModalOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Edit Supplier Address
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6">
                    <Grid container >
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={suppAllAddressList}
                                        columns={pendingPoColumns}
                                        pageSize={8}
                                        rowsPerPageOptions={[8]}
                                        onRowClick={handleRowClick} // Add this line to handle row clicks
                                        style={{ border: 'none' }}
                                        sx={{
                                            '& .super-app-theme--header': {
                                                WebkitTextStrokeWidth: '0.6px',
                                                backgroundColor: '#93bce6',
                                                color: '#1c1919',
                                                cursor: 'pointer'
                                            },
                                            '& .MuiDataGrid-cell': {
                                                border: '1px solid #969696',
                                                cursor: 'pointer'
                                            },
                                            '& .MuiDataGrid-columnHeader': {
                                                border: '1px solid #969696', // Add border to column headers
                                                cursor: 'pointer'
                                            },
                                        }}
                                        getRowClassName={(params) => {
                                            const rowIndex = suppAllAddressList.findIndex(row => row.id === params.row.id);
                                            if (rowIndex !== -1) {
                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return '';
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
                            onClick={(e) => {
                                setChangeAddressModalOpen(false);
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

export default ChangeAddressModal
