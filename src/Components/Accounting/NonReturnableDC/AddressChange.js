import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { ChangeAddressShowData } from '../../../ApiService/LoginPageService';

const AddressChange = ({ changeAddressModalOpen, setChangeAddressModalOpen, setCustAddress, setBillingAddress, setShippingAddress, customerSid, selectedChangeAddress }) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [rows, setRows] = useState('');

    const [custAllAddressList, setCustAllAddressList] = useState([])

    const handleClose = () => {
        setChangeAddressModalOpen(false);
    }

    useEffect(() => {
        changeAddressModalOpen && ChangeAddressShowData({ id: customerSid }, handleGSTshowconsignee, handleGSTshowconsigneeException);
    }, [changeAddressModalOpen, customerSid])

    const handleGSTshowconsignee = (dataObject) => {
        setCustAllAddressList(dataObject?.data || []);
    }

    const handleGSTshowconsigneeException = (errorObject, errorMessage) => {
    }

    const BillingColumns = [
        {
            field: 'gstNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'GST NO',
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
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
    ];

    const ShippingColumns = [
        {
            field: 'gstNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'GST NO',
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
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
    ];

    const handleRowClick = (params) => {
        console.log("handleRowClick", params)
        // setCustAddress(params.row.address);
        if (selectedChangeAddress === 'billing') {
            setBillingAddress(params.row.address)
        } else {
            setShippingAddress(params.row.address)
        }


        setChangeAddressModalOpen(false);
    }

    const handleDatagridRowSelection = (selectionModel) => {
        const selectedId = selectionModel[0]; // Assuming single selection
        const selectedRow = custAllAddressList.find((row) => row.id === selectedId);

        if (selectedRow) {
            const newAddress = `${selectedRow.address || ""}`;

            if (selectedChangeAddress === "billing") {
                setBillingAddress(newAddress);
            } else if (selectedChangeAddress === "shipping") {
                setShippingAddress(newAddress);
            }

            setChangeAddressModalOpen(false); // Close the dialog
        }
    };

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
                                        columns={selectedChangeAddress === 'billing' ? BillingColumns : ShippingColumns}
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
                                                border: '1px solid #969696',
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
                                        checkboxSelection
                                        disableRowSelectionOnClick
                                        // selectionModel={selectedRows}
                                        onRowSelectionModelChange={handleDatagridRowSelection}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions >
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default AddressChange
