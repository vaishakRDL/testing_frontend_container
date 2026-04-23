import { Button, Card, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { GetPendingDelNoteData, GSTLoadPendingPO, loadSaleOrderVerfied, SearchDelNote } from '../../../ApiService/LoginPageService';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

const LoadSalesDelNote = ({ loadPendingModalOpen, setLoadPendingModalOpen, setPendingPOList, customerId, setSelectedItems, customerSelect }) => {
    const [refreshData, setRefreshData] = useState(false);
    const [rows, setRows] = useState('');
    const [custAllAddressList, setCustAllAddressList] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [itemsSelectedSo, setItemsSelectedSo] = useState([]);
    const [formDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [delNoteLists, setDelNoteLists] = useState([]);
    const [selectedDelNote, setSelectedDelNote] = useState('');
    const [tableData, setTableData] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [verifiedLists, setVerifiedLists] = useState([]);

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
            field: 'soNo',
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
            field: 'verifiedBy',
            headerName: 'Verified By',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        // {
        //     field: 'selected',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}></span>,
        //     type: 'number',
        //     sortable: true,
        //     width: 120,
        //     align: 'center', headerAlign: 'center',
        //     renderHeader: (params) => (
        //         <div style={{ display: 'flex', alignItems: 'center' }}>
        //             <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
        //             <span style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '16px' }}></span>
        //         </div>
        //     ),
        //     renderCell: (params) => (
        //         <Checkbox
        //             checked={params.row.selected}
        //             onChange={(e) => handleCheckboxChange(e, params.row.id)}
        //         />
        //     ),
        // },
    ]

    const clearPageData = () => {
        setTableData([]);
        setFromDate('');
        setToDate('');
        setSelectedDelNote('');
    }

    const handleViewClick = () => {
        loadSaleOrderVerfied({ from: formDate, to: toDate, customerId: customerSelect }, handleViewSuccess, handleViewException);
    }

    const handleViewSuccess = (dataObject) => {
        setVerifiedLists(dataObject.data || [])
    }
    const handleViewException = () => { }

    // DATAGRID CHECKBOX SELECTION ROW
    const handleDatagridRowSelection = (selectionModel) => {
        // Find the selected rows based on IDs
        const selectedData = verifiedLists.filter(row => selectionModel.includes(row.id));
        setSelectedRows(selectedData);
    };

    const handleOkClick = () => {
        setSelectedItems(selectedRows);
        setLoadPendingModalOpen(false);
        clearPageData();
    }

    const handleClose = () => {
        setLoadPendingModalOpen(false);
        clearPageData();
    }

    return (
        <div>
            <Dialog sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
                maxWidth="xl"
                open={loadPendingModalOpen}>
                <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                    Select SO Verified Item
                </DialogTitle>
                <form className="mt-2 space-y-6">
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item sm={12} md={6} lg={4} xl={4}>
                                <TextField
                                    id="filled-basic"
                                    label="From Date"
                                    variant="filled"
                                    fullWidth
                                    type='date'
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    placeholder="From Date"
                                    value={formDate}
                                    onChange={(e) => {
                                        setFromDate(e.target.value)
                                    }}
                                />
                            </Grid>

                            <Grid item sm={12} md={6} lg={4} xl={4}>
                                <TextField
                                    id="filled-basic"
                                    label="To Date"
                                    variant="filled"
                                    fullWidth
                                    type='date'
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    placeholder="To Date"
                                    value={toDate}
                                    onChange={(e) => {
                                        setToDate(e.target.value)
                                    }}
                                />
                            </Grid>

                            <Grid item sm={12} md={4} lg={4} xl={4} style={{ display: 'flex', alignItems: 'center' }}>
                                <Button variant="contained" style={{ width: '150px', background: '#002D68', color: 'white' }} onClick={handleViewClick}>
                                    View
                                </Button>
                            </Grid>
                            <Grid item sm={12} md={12} lg={12} xl={12}>
                                <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%' }}>
                                    <CardContent>
                                        <DataGrid
                                            rows={verifiedLists}
                                            columns={columns1}
                                            pageSize={8}
                                            rowsPerPageOptions={[8]}
                                            style={{ border: 'none' }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '50vh',
                                                // minHeight: '500px',
                                                width: '100%',
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
                                                const rowIndex = verifiedLists.findIndex(row => row.id === params.row.id);
                                                // Check if the index is valid
                                                if (rowIndex !== -1) {
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return ''; // Return default class if index is not found
                                            }}
                                            checkboxSelection
                                            disableRowSelectionOnClick
                                            onRowSelectionModelChange={handleDatagridRowSelection}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" style={{ width: '150px', background: '#002D68', color: 'white' }} onClick={handleOkClick}>
                            Submit
                        </Button>
                        <Button variant="contained" style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div >
    )
}

export default LoadSalesDelNote

