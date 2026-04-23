import { Autocomplete, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import { MultiAddressAdd, MultiAddressDataDelete, MultiAddressDataShow, MultiAddressDataUpdate } from '../../ApiService/LoginPageService';
import { GetSuppVsItemSuppList, GetSuppVsItemSuppItemList, GetItemPendingPoLists, GetSupplierRateLists, GetLocationStock, GetPendingJWIQuantity } from '../../../ApiService/LoginPageService';

const CellClickModal = ({ cellModalOpen, setCellModalOpen, cellClickParams, selectedCellName, globleId, setSupplierItemList }) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [dataGridLists, setDataGridLists] = useState([])

    // PENDING PO COLUMN
    const pendingPoColumns = [
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'PONO',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'date',
            headerClassName: 'super-app-theme--header',
            headerName: 'PODate',
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'suppName',
            headerClassName: 'super-app-theme--header',
            headerName: 'Party Name',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'poQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'POQty',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'schDate',
            headerClassName: 'super-app-theme--header',
            headerName: 'SchDate',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'pendingPo',
            headerClassName: 'super-app-theme--header',
            headerName: 'PendQty',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'rate',
            headerClassName: 'super-app-theme--header',
            headerName: 'PORate',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerName: 'BOM',
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         // <BOMCheck selectedRow={params.row} />,

        //     ],
        // },
    ];

    //RATE COLUMN
    const rateColumns = [
        {
            field: 'spName',
            headerClassName: 'super-app-theme--header',
            headerName: 'SupplierName',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'rate',
            headerClassName: 'super-app-theme--header',
            headerName: 'Rate',
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'dcRate',
            headerClassName: 'super-app-theme--header',
            headerName: 'DCRATE',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'sob',
            headerClassName: 'super-app-theme--header',
            headerName: 'SOBPER',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerName: 'BOM',
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         // <BOMCheck selectedRow={params.row} />,

        //     ],
        // },
    ];

    //PENDING JW COLUMN
    const pendingJWColumns = [
        {
            field: 'jwiNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'JWISSNO',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'jwiDate',
            headerClassName: 'super-app-theme--header',
            headerName: 'JWISSDate',
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'spCode',
            headerClassName: 'super-app-theme--header',
            headerName: 'PartyName',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'issuedQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'JWISSQty',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'pendingQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Pending Qty',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'rate',
            headerClassName: 'super-app-theme--header',
            headerName: 'JWISSRate',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerName: 'BOM',
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         // <BOMCheck selectedRow={params.row} />,

        //     ],
        // },
    ];

    //PENDING TOTAL STOCK
    const pendingTotalStock = [
        {
            field: 'location',
            headerClassName: 'super-app-theme--header',
            headerName: 'Location',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'totStk',
            headerClassName: 'super-app-theme--header',
            headerName: 'QOH',
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerName: 'BOM',
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         // <BOMCheck selectedRow={params.row} />,

        //     ],
        // },
    ];

    useEffect(() => {
        cellModalOpen && selectedCellName === "pendingPo" && GetItemPendingPoLists({ id: cellClickParams.itemId }, handleSucessShow, handleExceptionShow);
        cellModalOpen && selectedCellName === "rate" && GetSupplierRateLists({ id: cellClickParams.itemId }, handleSucessShow, handleExceptionShow);
        cellModalOpen && selectedCellName === "totStk" && GetLocationStock({ id: cellClickParams.itemId }, handleSucessShow, handleExceptionShow);
        cellModalOpen && selectedCellName === "pendingJwQty" && GetPendingJWIQuantity({ id: cellClickParams.itemId }, handleSucessShow, handleExceptionShow);
    }, [cellModalOpen])

    // GET SUPPLIER LIST
    const handleSucessShow = (dataObject) => {
        setDataGridLists(dataObject?.data || []);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={cellModalOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {selectedCellName === "pendingPo" && "Display Pending PO Info..."}
                {selectedCellName === "rate" && "Display Supplier Wise Rate Info..."}
                {selectedCellName === "pendingJwQty" && "Display Pending JW Info..."}
                {selectedCellName === "totStk" && "Display Location Wise Stock Balance..."}
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" /*onSubmit={handleSubmit}*/>
                    <Grid container >
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                <CardContent>
                                    {selectedCellName === "pendingPo" &&
                                        <DataGrid
                                            rows={dataGridLists}
                                            columns={pendingPoColumns}
                                            pageSize={8}
                                            // selectionModel={selectionModel}
                                            // onSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
                                            rowsPerPageOptions={[8]}
                                            // disableSelectionOnClick
                                            // onRowClick={handleRowClick} // Add this line to handle row clicks
                                            style={{ border: 'none' }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '43vh',
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
                                                    border: '1px solid #969696', // Add border to column headers
                                                },
                                            }}

                                            getRowClassName={(params) => {
                                                // Find the index of the row within the rows array
                                                const rowIndex = dataGridLists.findIndex(row => row.id === params.row.id);
                                                // Check if the index is valid
                                                if (rowIndex !== -1) {
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return ''; // Return default class if index is not found
                                            }}
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                        />}

                                    {selectedCellName === "rate" &&
                                        <DataGrid
                                            rows={dataGridLists}
                                            columns={rateColumns}
                                            pageSize={8}
                                            // selectionModel={selectionModel}
                                            // onSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
                                            rowsPerPageOptions={[8]}
                                            // disableSelectionOnClick
                                            // onRowClick={handleRowClick} // Add this line to handle row clicks
                                            style={{ border: 'none' }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '43vh',
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
                                                    border: '1px solid #969696', // Add border to column headers
                                                },
                                            }}

                                            getRowClassName={(params) => {
                                                // Find the index of the row within the rows array
                                                const rowIndex = dataGridLists.findIndex(row => row.id === params.row.id);
                                                // Check if the index is valid
                                                if (rowIndex !== -1) {
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return ''; // Return default class if index is not found
                                            }}
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                        />}

                                    {selectedCellName === "pendingJwQty" &&
                                        <DataGrid
                                            rows={dataGridLists}
                                            columns={pendingJWColumns}
                                            pageSize={8}
                                            // selectionModel={selectionModel}
                                            // onSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
                                            rowsPerPageOptions={[8]}
                                            // disableSelectionOnClick
                                            // onRowClick={handleRowClick} // Add this line to handle row clicks
                                            style={{ border: 'none' }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '43vh',
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
                                                    border: '1px solid #969696', // Add border to column headers
                                                },
                                            }}
                                            getRowClassName={(params) => {
                                                // Find the index of the row within the rows array
                                                const rowIndex = dataGridLists.findIndex(row => row.id === params.row.id);
                                                // Check if the index is valid
                                                if (rowIndex !== -1) {
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return ''; // Return default class if index is not found
                                            }}
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                        />}

                                    {selectedCellName === "totStk" &&
                                        <DataGrid
                                            rows={dataGridLists}
                                            columns={pendingTotalStock}
                                            pageSize={8}
                                            // selectionModel={selectionModel}
                                            // onSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
                                            rowsPerPageOptions={[8]}
                                            // disableSelectionOnClick
                                            // onRowClick={handleRowClick} // Add this line to handle row clicks
                                            style={{ border: 'none' }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '43vh',
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
                                                    border: '1px solid #969696', // Add border to column headers
                                                },
                                            }}
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                            getRowClassName={(params) => {
                                                // Find the index of the row within the rows array
                                                const rowIndex = dataGridLists.findIndex(row => row.id === params.row.id);
                                                // Check if the index is valid
                                                if (rowIndex !== -1) {
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return ''; // Return default class if index is not found
                                            }}

                                        />}
                                </CardContent>

                            </Card>
                        </Grid>
                    </Grid>

                    <DialogActions>
                        {/* <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type="submit"
                        >
                            {
                                !isEditable ? 'Add' : 'Update'
                            }
                        </Button> */}
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setCellModalOpen(false);
                                // ClearData();
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

export default CellClickModal
