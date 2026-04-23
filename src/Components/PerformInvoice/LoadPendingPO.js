import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { GSTLoadPendingPO } from '../../ApiService/LoginPageService';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

const LoadPendingPO = ({ loadPendingModalOpen, setLoadPendingModalOpen, setPendingPOList,customerId }) => {
    const [refreshData, setRefreshData] = useState(false);
    const [rows, setRows] = useState('');
    const [custAllAddressList, setCustAllAddressList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [itemsSelectedSo, setItemsSelectedSo] = useState([]);

    const handleClose = () => {
        setLoadPendingModalOpen(false);
    }

    const columns = [
        {
            field: 'cCode',
            headerName: 'Customer Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cName',
            headerName: 'Customer Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poNo',
            headerName: 'Po No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'sodigit',
            headerName: 'SO No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'date',
            headerName: 'SO Date',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode',
            headerName: 'Item Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemName',
            headerName: 'Item Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemGroupCode',
            headerName: 'Item Group Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'uom',
            headerName: 'UOM Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
    ]

    const columns1 = [
        {
            field: 'cCode',
            headerName: 'Customer Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cName',
            headerName: 'Customer Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'sino',
            headerName: 'SO No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poNo',
            headerName: 'Po No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'date',
            headerName: 'SO Date',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode',
            headerName: 'Item Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemName',
            headerName: 'Item Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemGroupCode',
            headerName: 'Item Group Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'uom',
            headerName: 'UOM Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            // headerName: 'Actions',
            headerName: 'Actions',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ]
    const rows1 = selectedRows;
    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    handleDeleteRow(props.selectedRow.id)
                }}
                style={{ color: 'black' }}
            />
        );
    };

    const handleDeleteRow = (id) => {
        const newArray = selectedItems.filter((item) => item.id != id)
        setSelectedRows(newArray);
    }

    useEffect(() => {
        loadPendingModalOpen && GSTLoadPendingPO({id:customerId},handleLoadPendingPOShow, handeLoadPendingPOException);
    }, [loadPendingModalOpen,customerId])

    const handleLoadPendingPOShow = (dataObject) => {
        setCustAllAddressList(dataObject?.data || []);
    }

    const handeLoadPendingPOException = (errorObject, errorMessage) => {

    }

    const handleRowSelection = (selection) => {
        // Check if the selection.row's id is already in selectedRows
        const isAlreadySelected = selectedRows.some(row => row.id === selection.row.id);  
        // If not already selected, add it to selectedRows
        if (!isAlreadySelected) {
            setSelectedRows([...selectedRows, selection.row]);
        }
    }

    const handleOkClick = () => {
        setPendingPOList([...selectedRows,{id:'RDL1'}]);
        setLoadPendingModalOpen(false);
    }

    return (
        <div>
            <Dialog sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
                maxWidth="xl"
                open={loadPendingModalOpen}>
                <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                    Select Pending Customer - PO Sale Order
                </DialogTitle>
                <form className="mt-2 space-y-6">
                    <DialogContent>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                                <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '40vh' }}>
                                    <CardContent>
                                        <DataGrid 
                                            rows={custAllAddressList}
                                            columns={columns}
                                            pageSize={8}
                                            onRowClick={handleRowSelection}
                                            rowsPerPageOptions={[8]}
                                            style={{ border: 'none' }}
                                            sx={{
                                                '& .MuiDataGrid-columnHeaders': {  
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
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                                <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '40vh' }}>
                                    <CardContent>
                                        <DataGrid 
                                            rows={rows1}
                                            columns={columns1}
                                            pageSize={8}
                                            onRowClick={handleRowSelection}
                                            rowsPerPageOptions={[8]}
                                            style={{ border: 'none' }}
                                            sx={{
                                                '& .MuiDataGrid-columnHeaders': { 
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
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                            getRowClassName={(params) => {
                                                // Find the index of the row within the rows array
                                                const rowIndex = rows1.findIndex(row => row.id === params.row.id);
                                                // Check if the index is valid
                                                if (rowIndex !== -1) {
                                                    console.log("Row index:", rowIndex);
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return ''; // Return default class if index is not found
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{ width: '150px', background: '#002D68', color: 'white' }} onClick={handleOkClick}>
                            OK
                        </Button>
                        <Button  variant="contained" style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}

export default LoadPendingPO

