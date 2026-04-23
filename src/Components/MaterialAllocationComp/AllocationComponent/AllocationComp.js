import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Button, Card, CardContent, MenuItem, Select, TextField } from '@mui/material';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import AllocationTitle from './AllocationTitle';
import { ShowSFG, SFGDelete, GetAllocationRowData, MaterialAllocate } from '../../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../../Utility/confirmDeletion';
import LinearProgress from '@mui/material/LinearProgress';
import { useLocation } from 'react-router-dom';

const AllocationComp = (props) => {

    const location = useLocation();
    const [refreshData, setRefreshData] = useState(false);
    const [allocationList, setAllocationList] = useState([]);
    const allocationId = new URLSearchParams(location.search).get('allocationId');
    // const [issuedQuantity, setIssuedQuantity] = useState('');
    const [allocatedQuantity, setAllocatedQuantity] = useState('');
    const [remarks, setRemarks] = useState('');
    const [allocationDate, setAllocationDate] = useState(new Date().toISOString().split('T')[0]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [allocateAutomaticLoader, setAllocateAutomaticLoader] = useState(false)
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState()
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        setLoading(true)
        GetAllocationRowData({ id: allocationId, page: 0 }, handleSucessShow, handleExceptionShow)
    }, [refreshData, allocationId]);

    const handleSucessShow = (dataObject) => {
        setAllocationList(dataObject?.data || []);
        setTotalRows(dataObject?.totRows || 0);
        setCurrentPage(dataObject?.currentPage || 0)
        setLoading(false);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {
        setLoading(false);
    }

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ sNo: Number(currentPage * 100) + index + 1, ...row }));
    };
    const rowData = generateRowsWithIndex(allocationList);

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>S No</span>,
            type: 'string',
            sortable: true,
            width: 70,
            // flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'jcNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Job Card No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part/Item</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'category',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Category</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'rawMaterialName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Raw Material Name</span>,
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
        },

        // {
        //     field: 'minLvl',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Default Stock Lock</span>,
        //     type: 'string',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 50,
        //     flex: 1,
        //     align: 'center', headerAlign: 'center'
        // },
        {
            field: 'totStk',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Available Qty</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50,
            flex: 1,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'center', headerAlign: 'center'
        },
        {
            field: 'reqQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Total Qty Required</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'center', headerAlign: 'center'
        },
        // {
        //     field: 'issuedQty',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Issued Qty</span>,
        //     type: 'string',
        //     sortable: true,
        //     sortable: false,
        //     flex: 1,
        //     minWidth: 80, align: 'center', headerAlign: 'center',
        //     editable: false
        // },
        {
            field: 'allocQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Allocated Qty</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'center', headerAlign: 'center',
            editable: true
        },
        {
            field: 'allocPenQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Pending Qty</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'center', headerAlign: 'center',
            editable: false
        },
        // {
        //     field: 'AllocatedUnallocate',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Allocate/Unallocate</span>,
        //     type: 'string',
        //     sortable: true,
        //     sortable: false,
        //     flex: 1,
        //     minWidth: 80, align: 'center', headerAlign: 'center',
        //     editable: true
        // },
        {
            field: '',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Allocate/Unallocate</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            // flex: 1,
            width: 170, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <CustomDropdownCell
                    // value={params.value}
                    value={params.row.allocStatus}
                    options={['Allocate', 'UnAllocate']} // Replace with your dropdown options
                    onChange={(newValue) => {
                        // Handle the change here, e.g., update the state or send an API request
                        console.log(newValue);
                        console.log("params", params)
                        if (newValue === 'Allocate') {
                            MaterialAllocate({
                                id: params.row.id,
                                // issuedQty: params.row.issuedQty,
                                allocQty: params.row.allocQty,
                                allocStatus: "Allocate",
                                remarks: params.row.remarks,
                                allocDate: allocationDate
                            }, handleAllocateSuccess, handleAllocateFailed)
                        } else {
                            MaterialAllocate({
                                id: params.row.id,
                                // issuedQty: params.row.issuedQty,
                                allocQty: params.row.allocQty,
                                allocStatus: "UnAllocate",
                                remarks: params.row.remarks,
                                allocDate: params.row.AllocationDate
                            }, handleAllocateSuccess, handleAllocateFailed)
                        }
                    }}
                />
            ),
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'center', headerAlign: 'center',
            editable: true
        },
        {
            field: 'AllocationDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Allocation Date</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'center', headerAlign: 'center',
            editable: true,
            renderCell: (params) => (
                <TextField
                    type="date"
                    value={params.value || allocationDate}
                    onChange={(e) => handleDateChange(params.id, e.target.value)}
                />
            ),
        },
    ];

    const handleAllocateSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefreshData((oldvalue) => !oldvalue);
        setAllocateAutomaticLoader(false);
        setRefreshKey((prevKey) => prevKey + 1);
        setTimeout(() => {
            handleClose();
        }, 3000);
    }
    const handleAllocateFailed = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setAllocateAutomaticLoader(false);
        setRefreshKey((prevKey) => prevKey + 1);
        setTimeout(() => {
            // handleClose();
        }, 3000);
    }

    const CustomDropdownCell = ({ value, options, onChange }) => {
        return (
            <Select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{ width: '100%' }}
            >
                {options.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        );
    };

    const handleDateChange = (id, date) => {
        // Implement your logic to update the date in your data
        console.log(`Date changed for row ${id}:`, date);
        setAllocationDate(date);
    };

    const handleCellEdit = (params) => {
        const updatedList = allocationList.map((supp) =>
            supp.id === params.id ?
                { ...supp,/* issuedQty: params?.issuedQty,*/ allocQty: params?.allocQty, remarks: params.remarks }
                : supp
        )
        setAllocationList(updatedList);
        setAllocatedQuantity(params?.AllocatedQty);
        setRemarks(params?.remarks);
    }

    const handlePageChange = (newPage) => {
        setLoading(true)
        GetAllocationRowData({ id: allocationId, page: newPage.page }, handleSucessShow, handleExceptionShow)
    };


    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <AllocationTitle
                allocationId={allocationId}
                setRefreshData={setRefreshData}
                handleAllocateSuccess={handleAllocateSuccess}
                handleAllocateFailed={handleAllocateFailed}
                allocateAutomaticLoader={allocateAutomaticLoader}
                setAllocateAutomaticLoader={setAllocateAutomaticLoader}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent>
                        <DataGrid
                            rows={rowData}
                            columns={columns}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            disableSelectionOnClick
                            style={{ border: 'none', }}
                            sx={{
                                overflow: 'auto',
                                height: '60vh',
                                // minHeight: '500px',
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
                                const rowIndex = rowData.findIndex(row => row.id === params.row.id);
                                // Check if the index is valid
                                if (rowIndex !== -1) {
                                    console.log(' ');
                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                }
                                return ''; // Return default class if index is not found
                            }}
                            rowHeight={40}
                            columnHeaderHeight={40}
                            processRowUpdate={handleCellEdit}
                            onPaginationModelChange={handlePageChange}
                            rowCount={totalRows}
                            // page={page}
                            pagination
                            paginationMode="server"
                            loading={loading}
                            key={refreshKey}
                        />
                        {allocateAutomaticLoader &&
                            <div style={{ width: '100%' }}>
                                <LinearProgress />
                            </div>}
                    </CardContent>
                </Card>
            </div>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div>
    )
}

export default AllocationComp