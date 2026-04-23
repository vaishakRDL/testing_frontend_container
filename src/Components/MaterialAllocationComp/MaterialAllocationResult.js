import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Button, Card, CardContent, MenuItem, Select } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import MaterialAllocationTitle from './MaterialAllocationTitle';
import { ShowSFG, SFGDelete, GetMaterialAllocation } from '../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import { Link, useNavigate } from 'react-router-dom';

const MaterialAllocationResult = (props) => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [sfgList, setSFGList] = useState([]);
    //NEW STATE ALLOCATION
    const [allocationList, setAllocationList] = useState([])
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const navigate = useNavigate();

    // const columns = [
    //     {
    //         field: 'Sno',
    //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>S No</span>,
    //         type: 'string',
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: 'center',
    //         headerAlign: 'center',
    //     },
    //     {
    //         field: 'itemCode',
    //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Request Date</span>,
    //         type: 'string',
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: 'center',
    //         headerAlign: 'center',
    //     },
    //     {
    //         field: 'Department',
    //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Department</span>,
    //         type: 'string',
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: 'center',
    //         headerAlign: 'center',
    //     },
    //     {
    //         field: 'requestedby',
    //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Requested By</span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 80, align: 'center', headerAlign: 'center',
    //         editable: true
    //     },
    //     {
    //         field: 'locationData',
    //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Location</span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 80, align: 'center', headerAlign: 'center',
    //         editable: true
    //     },
    //     {
    //         field: 'Remarks',
    //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 80, align: 'center', headerAlign: 'center',
    //         editable: true
    //     },
    //     {
    //         field: 'itemName',
    //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>MRN No</span>,
    //         type: 'string',
    //         sortable: true,
    //         minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'uom',
    //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Sales Order No</span>,
    //         type: 'number',
    //         sortable: true,
    //         sortable: false,
    //         minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'location',
    //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>PO No</span>,
    //         type: 'string',
    //         sortable: true,
    //         minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
    //     },

    //     {
    //         field: 'jcNo',
    //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Customer Name</span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         minWidth: 50,
    //         flex: 1,
    //         align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'jcDate',
    //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>KAN BAN Due</span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 80, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'Status',
    //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Status</span>,
    //         type: 'string',
    //         sortable: true,
    //         sortable: false,
    //         flex: 1,
    //         minWidth: 80, align: 'center', headerAlign: 'center'
    //     },
    //     // {
    //     //     field: '',
    //     //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Status</span>,
    //     //     type: 'string',
    //     //     sortable: true,
    //     //     sortable: false,
    //     //     flex: 1,
    //     //     minWidth: 80, align: 'center', headerAlign: 'center',
    //     //     renderCell: (params) => (
    //     //         <CustomDropdownCell
    //     //             value={params.value}
    //     //             options={['In Process', 'Pending', 'Completed', 'Delayed']} // Replace with your dropdown options
    //     //             onChange={(newValue) => {
    //     //                 // Handle the change here, e.g., update the state or send an API request
    //     //                 console.log(newValue);
    //     //             }}
    //     //         />
    //     //     ),
    //     // },
    //     {
    //         field: 'actions',
    //         type: 'actions',
    //         flex: 1,
    //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
    //         cellClassName: 'actions',
    //         disableClickEventBubbling: true,
    //         getActions: (params) => [
    //             <Allocate selectedRow={params.row} />,
    //             // <DeleteData selectedRow={params.row} />,
    //         ],
    //     },
    // ];

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
            field: 'created_at',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Date</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'orderNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Sales Order No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>PO No</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'center', headerAlign: 'center',
            editable: true
        },
        {
            field: 'mrpNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>MRP No</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'center', headerAlign: 'center',
            editable: true
        },
        {
            field: 'srnNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SRN No</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'center', headerAlign: 'center',
            editable: true
        },
        {
            field: 'requestedBy',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Requested By</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'center', headerAlign: 'center',
            editable: true
        },
        {
            field: 'location',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Location</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'customerName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Customer</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'kanbanDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>KanBan Date</span>,
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'status',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Status</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50,
            flex: 1,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'center', headerAlign: 'center'
        },
        // {
        //     field: '',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Status</span>,
        //     type: 'string',
        //     sortable: true,
        //     sortable: false,
        //     flex: 1,
        //     minWidth: 80, align: 'center', headerAlign: 'center',
        //     renderCell: (params) => (
        //         <CustomDropdownCell
        //             value={params.value}
        //             options={['In Process', 'Pending', 'Completed', 'Delayed']} // Replace with your dropdown options
        //             onChange={(newValue) => {
        //                 // Handle the change here, e.g., update the state or send an API request
        //                 console.log(newValue);
        //             }}
        //         />
        //     ),
        // },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <Allocate selectedRow={params.row} />,
                // <DeleteData selectedRow={params.row} />,
            ],
        },
    ];

    function Allocate(props) {
        return (
            <Button
                variant="contained"
                style={{ width: '100px', background: '#002D68', color: 'white' }}
                onClick={() => navigate(`/AllocationComp?allocationId=${props.selectedRow.id}`)}
            // onClick={()=> navigate(`/PurchaseOrderGenerationModule?isView=true&&poDigit=${props.selectedRow.digit}&&rowId=${props.selectedRow.id}`)}
            >
                View
            </Button>
        );
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


    useEffect(() => {
        // document.title = 'Material Allocation';
        GetMaterialAllocation(handleSucessShow, handleExceptionShow)
    }, [refreshData]);

    const handleSucessShow = (dataObject) => {
        setAllocationList(dataObject?.data || []);
        console.log("dataObject", dataObject)
    }
    const handleExceptionShow = (errorObject, errorMessage) => {
    }

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ sNo: index + 1, ...row }));
    };
    const rowData = generateRowsWithIndex(allocationList);

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    setDeleteId(props.selectedRow.id);
                    setDeleteDailogOpen(true);
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
        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
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

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <div style={{ height: '80vh', width: '100%' }}>
            <MaterialAllocationTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
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
                                height: '70vh',
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
                        />
                    </CardContent>
                </Card>

            </div>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                // selectedMaster={selectedMaster}
                deleteService={SFGDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default MaterialAllocationResult