import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Button, Card, CardContent } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import UserAddTitle from './UserAddTitle';
import UserModal from './UserModalComponent';
import { ShowUser, UserDeleteData } from '../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import AssignRightsModal from './AssignRightsModal';
import '../../App.css';
import ApplicationStore from '../../Utility/localStorageUtil';
import { useModuleLocks } from '../context/ModuleLockContext';

const UserAddResult = () => {
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
    const [userList, serUserList] = useState([]);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [assignRightsDailogOpen, setAssignRightsDailogOpen] = useState(false);

    const { userDetails } = ApplicationStore()?.getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "adduser");

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "User")?.lockStatus === "locked";

    const dummyData = [
        {
            id: 1,
            userName: 'John Doe',
            email: 'john.doe@example.com',
            mobile: '123-456-7890',
            designation: 'Software Engineer',
            role: 'Developer',
            department: 'IT',
        },
        {
            id: 2,
            userName: 'Jane Smith',
            email: 'jane.smith@example.com',
            mobile: '987-654-3210',
            designation: 'UX Designer',
            role: 'Designer',
            department: 'Design',
        },
        // Add more dummy data as needed
    ];

    const columns = [

        {
            field: 'userName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Full Name
                </span>,
            type: 'string',
            sortable: true,
            flex: 1,
            sortable: false,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'email',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Email Id
                </span>,
            type: 'string',
            sortable: true, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'mobile',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Phone
                </span>,

            type: 'string',
            sortable: true, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'designation',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Designation
                </span>,

            type: 'string',
            sortable: true, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'userRole',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Role
                </span>,

            type: 'string',
            sortable: true, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'department',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Department
                </span>,
            type: 'string',
            flex: 1,
            sortable: true,
            sortable: false, align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions',
            flex: 1,
            type: 'actions',
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
                // <AssignRights selectedRow={params.row} />
            ],
        },
    ];


    useEffect(() => {
        ShowUser(handleSucessShow, handleExceptionShow);
    }, [refreshData]);

    const handleSucessShow = (dataObject) => {
        serUserList(dataObject?.data || []);
        setGridLoading(false);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

    }

    function EditData(props) {
        return (
            <EditIcon
                style={{
                    color: isModuleLocked ? "#706f6f" : "black",
                    pointerEvents: isModuleLocked ? "none" : "auto",
                    cursor: isModuleLocked ? "not-allowed" : "pointer",
                }} userPermission
                onClick={(event) => {
                    if (isModuleLocked) return;
                    setIsAddButton(false);
                    setEditData(props.selectedRow);
                    setOpen(true);

                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon

                onClick={() => {
                    if (isModuleLocked) return;
                    setDeleteId(props.selectedRow.id);
                    setDeleteDailogOpen(true);
                }}
                style={{
                    color: isModuleLocked ? "#706f6f" : "black",
                    pointerEvents: isModuleLocked ? "none" : "auto",
                    cursor: isModuleLocked ? "not-allowed" : "pointer",
                }} />
        );
    }

    function AssignRights(props) {
        return (
            <Button variant="contained"
                sx={{ backgroundColor: '#002D68' }}
                onClick={() => setAssignRightsDailogOpen(true)}
            >Assign Rights</Button>
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
        <div style={{ height: '60vh', marginLeft: '20px', marginTop: '10px', marginRight: '20px', marginBottom: '20px' }}>
            <UserAddTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '10px', borderRadius: '10px', width: '100%' }}>
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
                                rows={userList}
                                // rows={dummyData}
                                columns={columns}
                                pageSize={8}
                                // loading={isLoading}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ border: 'none', }}
                                sx={{
                                    height: '70vh',
                                    minHeight: '480px',
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
                                    const rowIndex = userList.findIndex(row => row.id === params.row.id);
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

            <UserModal
                isAddButton={isAddButton}
                customerData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
                configSetupData={editData}
            />
            <AssignRightsModal
                // isAddButton={isAddButton}
                // customerData={editData}
                assignRightsDailogOpen={assignRightsDailogOpen}
                setAssignRightsDailogOpen={setAssignRightsDailogOpen}
            // setRefreshData={setRefreshData}
            // configSetupData={editData}
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
                deleteService={UserDeleteData}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default UserAddResult