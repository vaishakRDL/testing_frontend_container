import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Card, CardContent, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import AccDispatchTools from './AccDispatchTools';
import AccDispatchModel from './AccDispatchModel';
import { MstDispatchDelete, MstDispatchShowData } from '../../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../../Utility/confirmDeletion';
import ApplicationStore from '../../../Utility/localStorageUtil';
import { useModuleLocks } from '../../context/ModuleLockContext';

const AccDispatchList = () => {
    const [rows, setRows] = useState([]);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editDispatch, setEditDispatch] = useState([]);
    const [open, setOpen] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [isLoading, setGridLoading] = useState(true);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "dispatchlist");


    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Dispatch Master")?.lockStatus === "locked";


    useEffect(() => {
        MstDispatchShowData(handleDispatchShow, handeDispatchException);
    }, [refreshData]);

    const handleDispatchShow = (dataObject) => {
        setGridLoading(false);
        setRows(dataObject?.data || []);
    }

    const handeDispatchException = (errorStatus, errorMessage) => {
        console.log(errorMessage);
    }

    const columns = [
        {
            field: 'code',
            headerClassName: 'super-app-theme--header',
            headerName: 'Dispatch Code',
            type: 'string',
            sortable: true,
            width: 120,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'name',
            headerClassName: 'super-app-theme--header',
            headerName: 'Dispatch Name',
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'add1',
            headerClassName: 'super-app-theme--header',
            headerName: 'Address Line1',
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'add2',
            headerClassName: 'super-app-theme--header',
            headerName: 'Address Line2',
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'add3',
            headerClassName: 'super-app-theme--header',
            headerName: 'Address Line3',
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'add4',
            headerClassName: 'super-app-theme--header',
            headerName: 'Address Line4',
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'city',
            headerClassName: 'super-app-theme--header',
            headerName: 'City',
            type: 'string',
            sortable: true,
            width: 120,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'state',
            headerClassName: 'super-app-theme--header',
            headerName: 'State',
            type: 'string',
            sortable: true,
            width: 120,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'pinCode',
            headerClassName: 'super-app-theme--header',
            headerName: 'Pincode',
            type: 'string',
            sortable: true,
            width: 80,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'country',
            headerClassName: 'super-app-theme--header',
            headerName: 'Country',
            type: 'string',
            sortable: true,
            width: 80,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'gstNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'GST No',
            type: 'string',
            sortable: true,
            width: 80,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'stateCode',
            headerClassName: 'super-app-theme--header',
            headerName: 'State Code',
            type: 'string',
            sortable: true,
            width: 90,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'panNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'Pan No',
            type: 'string',
            sortable: true,
            width: 80,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'placeOfSupply',
            headerClassName: 'super-app-theme--header',
            headerName: 'Place Of Supply',
            type: 'string',
            sortable: true,
            width: 130,
            align: 'center',
            headerAlign: 'center',
        },
        // {
        //     field: 'defaultField',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: 'Default',
        //     type: 'string',
        //     sortable: true,
        //     width: 80,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        {
            field: 'actions',
            headerClassName: 'super-app-theme--header',
            type: 'actions',
            width: 80,
            headerName: 'Actions',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];

    function EditData(props) {
        return (
            <Tooltip title="Edit">
                <EditIcon
                    style={{ color: userPermission[0]?.updateData === 0 || isModuleLocked ? 'gray' : '#000000' }}
                    onClick={(event) => {
                        if (isModuleLocked) return
                        event.stopPropagation();
                        setIsAddButton(false);
                        setEditDispatch(props.selectedRow);
                        setOpen(true);

                    }}
                />
            </Tooltip>
        );
    }

    function DeleteData(props) {
        return (
            <Tooltip title="Delete">
                <DeleteIcon
                    style={{ color: userPermission[0]?.deleteData === 0 || isModuleLocked ? 'gray' : '#000000' }}
                    onClick={() => {
                        if (isModuleLocked) return
                        setDeleteId(props.selectedRow.id);
                        setDeleteDailogOpen(true);

                    }
                    }
                />
            </Tooltip>
        );
    }

    const DeleteFunction = () => {
        MstDispatchDelete(handleDeleteSuccess, handleDeleteException);
    }

    const handleDeleteSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setDeleteDailogOpen(false);
        }, 2000);
        setRefreshData(oldValue => !oldValue);
    }

    const handleDeleteException = (errorObject, message) => {
        console.log(message);
        setNotification({
            status: true,
            type: 'error',
            message: message,
        });
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <AccDispatchTools
                setIsAddButton={setIsAddButton}
                setEditDispatch={setEditDispatch}
                setOpen={setOpen}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '98%', height: '100%' }}>
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
                                // getRowClassName={(params) => {
                                //     const rowIndex = rows.findIndex(row => row.id === params.row.id);
                                //     if (rowIndex !== -1) {
                                //         return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                //     }
                                //     return '';
                                // }}
                                getRowClassName={(params) =>
                                    params.indexRelativeToCurrentPage % 2 === 0
                                        ? 'Mui-evenRow'
                                        : 'Mui-oddRow'
                                }

                                rowHeight={40}
                                columnHeaderHeight={40}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </div>
            <AccDispatchModel
                isAddButton={isAddButton}
                editDispatch={editDispatch}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
                handleClose={handleClose}
                openNotification={openNotification}
                setNotification={setNotification}
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
                deleteService={MstDispatchDelete}
                handleSuccess={handleDeleteSuccess}
                handleException={handleDeleteException}
            />
        </div>
    )
}

export default AccDispatchList

