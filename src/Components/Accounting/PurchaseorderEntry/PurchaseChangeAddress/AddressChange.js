import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { ChangeAddressShowData } from '../../../../ApiService/LoginPageService';

const AddressChange = ({ changeAddressModalOpen, setChangeAddressModalOpen,setBillingAddress,setShippingAddress, customerSid,selectedChangeAddress }) => {
    const [custAllAddressList, setCustAllAddressList] = useState([])

    const handleClose = () => {
        setChangeAddressModalOpen(false);
    }

    useEffect(() =>{
       changeAddressModalOpen && ChangeAddressShowData({ id: customerSid },handleGSTshowconsignee,handleGSTshowconsigneeException);
    },[changeAddressModalOpen,customerSid])

    const handleGSTshowconsignee = (dataObject) => {
        setCustAllAddressList(dataObject?.data || []);
    }

    const handleGSTshowconsigneeException = (errorObject, errorMessage) => {
    }
    
    const BillingColumns = [
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
            field: 'billingAddress',
            headerClassName: 'super-app-theme--header',
            headerName: 'Address',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
    ];

    const ShippingColumns = [
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
            field: 'shippingAddress',
            headerClassName: 'super-app-theme--header',
            headerName: 'Address',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
    ];

    const handleRowClick = (params) => {
        if(selectedChangeAddress === 'billing'){
            setBillingAddress(params.row.billingAddress)
        }else {
            setShippingAddress(params.row.shippingAddress)
        }
        setChangeAddressModalOpen(false);
    }

    return (
        <Dialog sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
        maxWidth="xl"
        open={changeAddressModalOpen}>
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Edit Customer Address
            </DialogTitle>
            <form className="mt-2 space-y-6">
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={custAllAddressList}
                                        columns={selectedChangeAddress === 'billing'? BillingColumns :ShippingColumns }
                                        pageSize={8}
                                        onRowClick={handleRowClick}
                                        rowsPerPageOptions={[8]}
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
                                            const rowIndex = custAllAddressList.findIndex(row => row.id === params.row.id);
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
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={handleClose} >
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddressChange
