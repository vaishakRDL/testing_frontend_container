import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ViewSfgVendorProcessTitle from './ViewSfgVendorProcessTitle';
import { ViewScheduledVendorProcess } from '../../ApiService/LoginPageService'
import '../../App.css';

const ViewSfgVendorProcessResult = (props) => {
    const [refreshData, setRefreshData] = useState(false);
    const [vendorProcessList, setVendorProcessList] = useState([])
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const today = new Date();
    const date = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const TodaysDate = `${year}/${month}/${date}`;

    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SNo</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'sfgRefNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SFG Ref No</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'mrpNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>MRP No</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'kanbanDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>KANBAN Date</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'sfgQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SFG Qty</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'vendorProcess',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier Process</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'dispatchQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Dispatch Quantity</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'recievedQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Received Quantity</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'pendingQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Pending Quantity</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'status',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Status</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
    ];

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ sNo: index + 1, ...row }));
    };
    const rowData = generateRowsWithIndex(vendorProcessList);

    useEffect(() => {
        ViewScheduledVendorProcess({ fromDate: fromDate, toDate: toDate }, handleVendorProcessSucessShow, handleVendorProcessExceptionShow);
    }, [refreshData]);

    const handleSubmitClick = () => {
        ViewScheduledVendorProcess({ fromDate: fromDate, toDate: toDate }, handleVendorProcessSucessShow, handleVendorProcessExceptionShow);
    }

    const handleVendorProcessSucessShow = (dataObject) => {
        setVendorProcessList(dataObject?.data || []);
    }
    const handleVendorProcessExceptionShow = (errorObject, errorMessage) => {
    }

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <ViewSfgVendorProcessTitle
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '5px', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    id="filled-basic"
                                    variant="filled"
                                    type="date"
                                    label="From Date"
                                    style={{ marginRight: '20px', width: '200px' }}
                                    InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                    size="small"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                                <TextField
                                    id="filled-basic"
                                    variant="filled"
                                    type="date"
                                    label="To Date"
                                    style={{ marginRight: '20px', width: '200px' }}
                                    InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                    size="small"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                                <Button  variant="contained" style={{ backgroundColor: '#002D68',margin:'10px' }} onClick={() => {
                                    ViewScheduledVendorProcess({ fromDate: TodaysDate, toDate: TodaysDate }, handleVendorProcessSucessShow, handleVendorProcessExceptionShow);
                                }}>Today</Button>
                                <Button variant="contained" style={{ backgroundColor: '#002D68' }} onClick={handleSubmitClick}>Submit</Button>
                            </div>
                        </div>
                        <DataGrid
                            rows={rowData}
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
                            getRowClassName={(params) => {
                                const rowIndex = rowData.findIndex(row => row.id === params.row.id);
                                if (rowIndex !== -1) {
                                    console.log(' ');
                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                }
                                return '';
                            }}
                            rowHeight={40}
                            columnHeaderHeight={40}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ViewSfgVendorProcessResult