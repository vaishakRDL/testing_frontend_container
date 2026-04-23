import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Card, CardContent } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import SupplierTitle from './SupplierTitle';
import SupplierModule from './SupplierModule';
import { SupplierDataDelete, SupplierDataShow } from '../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import '../../App.css';
import ApplicationStore from '../../Utility/localStorageUtil';

const SupplierResult = () => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editCustomer, setEditCustomer] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "supplierlist");

    const columns = [
        {
            field: 'spName',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supplier Name
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'gstNo',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    GST Number
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'spCode',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supplier Code
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'supplyGroupName',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supplier Group
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'spType',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supplier Type
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'tallyAlias',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Tally Alias

                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'spAddress',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Address
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];


    useEffect(() => {
        SupplierDataShow(handleSupplierDataShowSuccess, handleSupplierDataShowException);
    }, [refreshData]);

    const handleSupplierDataShowSuccess = (dataObject) => {
        setRows(dataObject?.data || []);
    }

    const handleSupplierDataShowException = (errorObject, errorMessage) => {

    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: userPermission[0]?.updateData === 0 ? 'gray' : '#000000' }}
                onClick={() => {
                    if (userPermission[0]?.updateData === 1) {
                        setOpen(true);
                        setEditCustomer(props.selectedRow);
                        setIsAddButton(false);
                    }
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                style={{ color: userPermission[0]?.deleteData === 0 ? 'gray' : '#000000' }}
                onClick={() => {
                    if (userPermission[0]?.deleteData === 1) {
                        setDeleteDailogOpen(true);
                        setDeleteId(props.selectedRow.id);
                    }
                }}

            />
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


    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <SupplierTitle
                setIsAddButton={setIsAddButton}
                setEditCustomer={setEditCustomer}
                setOpen={setOpen}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '-10px', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent>
                        <Box
                            sx={{
                                height: '150%',
                                width: '100%',
                                '& .super-app-theme--header': {
                                    backgroundColor: '#93bce6',
                                    color: '#1c1919'
                                },
                            }}
                        >
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={8}
                                // loading={isLoading}
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
                                    const rowIndex = rows.findIndex(row => row.id === params.row.id);
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
                        </Box>
                    </CardContent>
                </Card>

            </div>
            <SupplierModule
                isAddButton={isAddButton}
                editData={editCustomer}
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
                deleteService={SupplierDataDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default SupplierResult