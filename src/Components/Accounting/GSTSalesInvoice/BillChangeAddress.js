import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { GSTshowconsignee } from '../../../../ApiService/LoginPageService';

const BillChangeAddress = ({ changeAddressModalOpen, setChangeAddressModalOpen, setCustAddress, customerSid, globleId, setCustomerItemList }) => {
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
        GSTshowconsignee(handleGSTshowconsignee, handleGSTshowconsigneeException);
    }, [])

    const handleGSTshowconsignee = (dataObject) => {
        setCustAllAddressList(dataObject?.data || []);
    }

    const handleGSTshowconsigneeException = (errorObject, errorMessage) => {

    }

    const columns = [
        {
            field: 'cAddress',
            headerClassName: 'super-app-theme--header',
            headerName: 'Address',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'city',
            headerClassName: 'super-app-theme--header',
            headerName: 'Add 1',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'pincode',
            headerClassName: 'super-app-theme--header',
            headerName: 'Add 2',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'state',
            headerClassName: 'super-app-theme--header',
            headerName: 'Add 3',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'country',
            headerClassName: 'super-app-theme--header',
            headerName: 'Add 4',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'gstNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'GSTNO',
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'center', headerAlign: 'center'
        },
        {
            field: 'panNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'Pan No',
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'center', headerAlign: 'center'
        },
    ];

    return (
        <Dialog sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={changeAddressModalOpen}>
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Edit Customer Address
            </DialogTitle>
            <form>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={custAllAddressList}
                                        columns={columns}
                                        pageSize={8}
                                        rowsPerPageOptions={[8]}
                                        style={{ border: 'none' }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                        sx={{
                                            overflow: 'auto',
                                            height: '50vh',
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                WebkitTextStrokeWidth: '0.6px',
                                            },
                                            '& .MuiDataGrid-cell': {
                                                border: '1px solid #969696',
                                            },
                                            '& .MuiDataGrid-columnHeader': {
                                                border: '1px solid #969696', 
                                            },
                                        }}
                                        getRowClassName={(params) => {
                                            const rowIndex = custAllAddressList.findIndex(row => row.id === params.row.id);
                                           
                                            if (rowIndex !== -1) {
                                                console.log("Row index:", rowIndex);
                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return ''; 
                                        }}
    
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
                        onClick={handleClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default BillChangeAddress
