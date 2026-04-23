import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Box, Button, Card, CardContent, Tooltip } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import GroupMasterModule from './GroupMasterModule';
import GroupMasterTitle from './GroupMasterTitle';
import { ShowCreatedGroup, DeleteCreatedGroup } from '../../ApiService/LoginPageService'
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import ViewUserModal from './ViewUserModal/ViewUserModal';
import PermissionModal from './PermissionModal/PermissionModal';
import ApplicationStore from '../../Utility/localStorageUtil';
import { useModuleLocks } from '../context/ModuleLockContext';

const GroupMasterResult = (props) => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Group")?.lockStatus === "locked";

    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [id, setId] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [groupList, setGroupList] = useState([]);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    // View user Modal
    const [viewUserModalOpen, setViewUserModelOpen] = useState(false)
    //Permisson Modal
    const [selectedRowId, setSelectedRowId] = useState('');
    const [selectedRowCode, setSelectedRowCode] = useState('');
    const [permisionModalOpen, setPermissionModalOpen] = useState(false);

    const { userDetails } = ApplicationStore()?.getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "groupmaster");

    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    SNo
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'groupName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Group Name
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'code',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Group Code
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'description',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Group Description
                </span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
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
                <ViewUser selectedRow={params.row} />,
                <Permission selectedRow={params.row} />,
            ],
        },
    ];

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ sNo: index + 1, ...row }));
    };
    const rowData = generateRowsWithIndex(groupList);

    // const dummyData = [
    //     { id: 1, SNo: '1', groupName: 'Group A', groupDescription: 25 },
    //     { id: 2, SNo: '2', groupName: 'Group B', groupDescription: 30 },
    //     { id: 3, SNo: '3', groupName: 'Group C', groupDescription: 18 },
    //     { id: 4, SNo: '4', groupName: 'Group D', groupDescription: 22 },
    //     { id: 5, SNo: '5', groupName: 'Group E', groupDescription: 28 },
    // ];


    useEffect(() => {
        ShowCreatedGroup(handleSucessShow, handleExceptionShow)
    }, [refreshData]);

    const handleSucessShow = (dataObject) => {
        setGroupList(dataObject?.groupMstData || []);
        // setGridLoading(false);
        // console.log("dataObject", dataObject)
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

    }

    function EditData(props) {
        return (
            <Tooltip title={'Edit'}>
                <EditIcon
                    style={{
                        color: isModuleLocked ? "#706f6f" : "black",
                        pointerEvents: isModuleLocked ? "none" : "auto",
                        cursor: isModuleLocked ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                        if (isModuleLocked) return;
                        setIsAddButton(false);
                        setEditData(props.selectedRow);
                        setOpen(true);
                    }}
                />

            </Tooltip>
        );
    }

    function DeleteData(props) {
        return (
            <Tooltip title={'Delete'}>
                <DeleteIcon
                    style={{
                        color: isModuleLocked ? "#706f6f" : "black",
                        pointerEvents: isModuleLocked ? "none" : "auto",
                        cursor: isModuleLocked ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                        if (isModuleLocked) return;
                        setDeleteId(props.selectedRow.id);
                        setDeleteDailogOpen(true);
                    }

                    }
                />
            </Tooltip>
        );
    }

    function ViewUser(props) {
        return (
            <Tooltip title={'View User'}>
                <RemoveRedEyeIcon
                    onClick={() => {
                        if (isModuleLocked) return;

                        // setDeleteId(props.selectedRow.id);
                        setSelectedRowId(props.selectedRow.id);
                        setViewUserModelOpen(true);
                    }}
                    style={{
                        color: isModuleLocked ? "#706f6f" : "black",
                        pointerEvents: isModuleLocked ? "none" : "auto",
                        cursor: isModuleLocked ? "not-allowed" : "pointer",
                    }} />
            </Tooltip>
        );
    }

    function Permission(props) {
        return (
            <Tooltip title={'Add permission to this group'}>
                <Button variant="outlined"
                    style={{
                        color: isModuleLocked ? "#706f6f" : "black",
                        pointerEvents: isModuleLocked ? "none" : "auto",
                        cursor: isModuleLocked ? "not-allowed" : "pointer",
                    }} onClick={() => {
                        if (isModuleLocked) return;
                        setPermissionModalOpen(true)
                        setSelectedRowId(props.selectedRow.id)
                        setSelectedRowCode(props.selectedRow.code)
                    }}
                >Permission</Button>
            </Tooltip>
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
        <div style={{ height: '60vh', width: '100%' }}>
            <GroupMasterTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '10px', borderRadius: '10px', width: '98%', height: '100%' }}>
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
                                rows={rowData}
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
                                    const rowIndex = rowData.findIndex(row => row.id === params.row.id);
                                    // Check if the index is valid
                                    if (rowIndex !== -1) {
                                        // console.log(' ');
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

            <GroupMasterModule
                isAddButton={isAddButton}
                editData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
            />

            <ViewUserModal
                selectedRowId={selectedRowId}
                viewUserModalOpen={viewUserModalOpen}
                setViewUserModelOpen={setViewUserModelOpen}
            />

            <PermissionModal
                permisionModalOpen={permisionModalOpen}
                setPermissionModalOpen={setPermissionModalOpen}
                selectedRowId={selectedRowId}
                selectedRowCode={selectedRowCode}
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
                // selectedMaster={selectedMaster}
                deleteService={DeleteCreatedGroup}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />

        </div>
    )
}

export default GroupMasterResult