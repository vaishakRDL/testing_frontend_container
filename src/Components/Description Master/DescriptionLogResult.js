
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Button,
    TextField,
    Card,
    CardContent,
    Tooltip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DescriptionMasterLogDelete, DescriptionMasterLogShowData } from '../../ApiService/LoginPageService';
import DescriptionLogTolBar from './DescriptionLogTolBar';
import DescriptionLogModule from './DescriptionLogModule';
import ApplicationStore from '../../Utility/localStorageUtil';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import { useModuleLocks } from '../context/ModuleLockContext';



const DescriptionLogResult = () => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "COPQ")?.lockStatus === "locked";

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "instrumentlist");
    const [showdata, setShowData] = useState([]);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editDescriptionLog, setEditDescriptionLog] = useState([]);
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

    // ================= FETCH =================
    // Load grid ONCE + refresh only when needed
    useEffect(() => {
        DescriptionMasterLogShowData(handleSuccess, handleException);
    }, [refreshData]);



    const handleSuccess = (res) => {
        setShowData(res.data || []);
        setGridLoading(false);
    };

    const handleException = () => {
        setGridLoading(false);
    };



    // ================= END API =================

    const columns = [
        {
            field: 'slNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'S.No',
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'showDate',          // ✅ DISPLAY DATE
            headerName: 'Date',
            headerClassName: 'super-app-theme--header',
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'description',
            headerName: 'Description',
            headerClassName: 'super-app-theme--header',
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cost',
            headerName: 'Cost',
            headerClassName: 'super-app-theme--header',

            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'actions',
            headerClassName: 'super-app-theme--header',
            type: 'actions',
            flex: 1,
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
                        if (userPermission[0]?.updateData === 1 && !isModuleLocked) {
                            event.stopPropagation();
                            setIsAddButton(false);
                            setEditDescriptionLog(props.selectedRow);
                            setOpen(true);
                        }
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
                        if (userPermission[0]?.deleteData === 1 && !isModuleLocked) {
                            setDeleteId(props.selectedRow.id);
                            setDeleteDailogOpen(true);
                        }
                    }}
                />
            </Tooltip>
        );
    }


    const handleDeleteSuccess = (dataObject) => {
        console.log(dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setDeleteDailogOpen(false);
            handleClose();
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
        <div style={{ height: '80vh', width: '100%' }}>
            <DescriptionLogTolBar
                setIsAddButton={setIsAddButton}
                setEditDescriptionLog={setEditDescriptionLog}
                setOpen={setOpen}
            />
            <Card style={{ width: '98%', margin: '10px auto' }}>
                <CardContent>

                    <DataGrid
                        rows={showdata}
                        columns={columns}
                        pageSize={8}
                        loading={isLoading}
                        rowsPerPageOptions={[8]}
                        disableSelectionOnClick
                        style={{ border: 'none', fontWeight: 'bold' }}
                        sx={{
                            overflow: 'auto',
                            height: '65vh',
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
                            const rowIndex = showdata.findIndex(row => row.id === params.row.id);
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
            <DescriptionLogModule
                isAddButton={isAddButton}
                editDescriptionLog={editDescriptionLog}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
                handleClose={handleClose}
                openNotification={openNotification}
                setNotification={setNotification}
            />
            {/* ⏱️ DATE TIME PICKER */}

            <NotificationBar
                openNotification={openNotification.status}
                type={openNotification.type}
                notificationContent={openNotification.message}
                handleClose={handleClose}

            />
            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                deleteService={DescriptionMasterLogDelete}
                handleSuccess={handleDeleteSuccess}
                handleException={handleDeleteException}
            />
        </div>
    );
};

export default DescriptionLogResult;
