import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Box, Button, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import VendorDispatchOrderModule from './VendorDispatchOrderModule';
import VendorDispatchOrderTitle from './VendorDispatchOrderTitle';
import { ViewScheduledVendorProcess, DeleteCreatedGroup, GetVendorDelNote } from '../../ApiService/LoginPageService'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DispatchModal from './DispatchModal/DispatchModal';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import RecievedModal from './RecievedModal/RecievedModal';
import ReceivedHistory from './ReceivedHistory/ReceivedHistory';
import ViewChildItems from './ViewChildItems/ViewChildItems';
import { Link, useNavigate } from 'react-router-dom';

const VendorDispatchOrderResult = () => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [vendorDeliveryList, setVendorDeliveryList] = useState([])
    const [childItemsModalOpen, setChildItemsModalOpen] = useState(false);
    const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
    const [recievedModalOpen, setRecivedModalOpen] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [rowId, setRowId] = useState('')
    const [dcNo, setDcNo] = useState('');
    const navigate = useNavigate();
    //

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'created_at',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'createdBy',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Created By
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'supCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supplier Code
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'dcNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    DC / Invoice No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'vehicleNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Vehicle No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'dispatchDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Dispatch Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'dispatchWeight',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Dispatched Weight
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'dispatchTime',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Time Slot
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            minWidth: 200,
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <Tooltip title="View DC">
                    <Button
                        variant="contained"
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '5px', height: '25px', backgroundColor: '#002D68' }}
                        onClick={() => {
                            navigate(`/JobWorkIssueModal?viewDC=true&&delRowId=${params.row.id}`)
                        }}
                    >
                        DC
                    </Button>
                </Tooltip>,
                <ViewHistory selectedRow={params.row} />,
                <ViewData selectedRow={params.row} />,
            ],
        },
    ];


    useEffect(() => {
        GetVendorDelNote(handleVendorDelListSuccess, handleVendorDelListException);
    }, [refreshData]);

    const handleVendorDelListSuccess = (dataObject) => {
        setVendorDeliveryList(dataObject?.data || []);
    }

    const handleVendorDelListException = (errorObject, errorMessage) => {
    }

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ sNo: index + 1, ...row }));
    };
    const rowData = generateRowsWithIndex(vendorDeliveryList);

    function ViewHistory(props) {
        return (
            <Tooltip title='View History'>
                <RemoveRedEyeIcon
                    onClick={() => {
                        setRowId(props.selectedRow.id);
                        setHistoryModalOpen(true);
                    }}
                    style={{ color: 'black' }}
                />
            </Tooltip>
        );
    }

    function ViewData(props) {
        return (
            <Tooltip title='Recieved'>
                <LocalShippingIcon
                    onClick={() => {
                        setRowId(props.selectedRow.id);
                        setRecivedModalOpen(true);
                    }}
                    style={{ color: 'black', transform: 'scaleX(-1)' }}
                />
            </Tooltip>
        );
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

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

    const handleRowClick = (params) => {
        setRowId(params.row.id);
        setChildItemsModalOpen(true)
    }

    return (
        <Box style={{ height: '80vh' }} margin={2}>
            <VendorDispatchOrderTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}

            />
            <div style={{ display: 'flex' }}>
                <Card style={{ borderRadius: '8px', width: '100%', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)", overflow: 'hidden' }}>
                    <CardContent style={{}}>
                        <DataGrid
                            rows={rowData}
                            columns={columns}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            disableSelectionOnClick
                            sx={{
                                cursor: 'pointer',
                                overflow: 'auto',
                                height: '60vh',
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
                            onRowClick={handleRowClick}
                        />
                    </CardContent>
                </Card>


            </div>
            <VendorDispatchOrderModule
                isAddButton={isAddButton}
                editData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
            />

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
                // deleteService={AllMasterDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
            <DispatchModal
                setDispatchModalOpen={setDispatchModalOpen}
                dispatchModalOpen={dispatchModalOpen}
                setRefreshData={setRefreshData}
                rowId={rowId}
                dcNo={dcNo}
            />
            <RecievedModal
                setRecivedModalOpen={setRecivedModalOpen}
                recievedModalOpen={recievedModalOpen}
                setRefreshData={setRefreshData}
                rowId={rowId}
            />
            <ReceivedHistory
                historyModalOpen={historyModalOpen}
                setHistoryModalOpen={setHistoryModalOpen}
                rowId={rowId}
            />
            <ViewChildItems
                childItemsModalOpen={childItemsModalOpen}
                setChildItemsModalOpen={setChildItemsModalOpen}
                rowId={rowId}
            />
        </Box>
    )
}

export default VendorDispatchOrderResult
