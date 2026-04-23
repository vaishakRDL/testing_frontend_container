import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel, IconButton,
} from '@mui/material';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from "@mui/icons-material/Search";
import CustomePopUp from '../../../Utility/CustomePopUp';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { AddMachine, MachineEdit, ShowMachineOperator, GetShift, ShowProcessMaster, getMachineUOM, ShowUser, GroupUserAssign } from '../../../ApiService/LoginPageService';

const dummyData = [
    { id: 1, SNo: '1', userName: 'John Doe', userEmail: 'john.doe@example.com', department: 'IT', userRole: 'Admin', designation: 'Software Engineer' },
    { id: 2, SNo: '2', userName: 'Jane Smith', userEmail: 'jane.smith@example.com', department: 'HR', userRole: 'User', designation: 'HR Manager' },
    { id: 3, SNo: '3', userName: 'Bob Johnson', userEmail: 'bob.johnson@example.com', department: 'Finance', userRole: 'User', designation: 'Financial Analyst' },
    { id: 4, SNo: '4', userName: 'Alice Williams', userEmail: 'alice.williams@example.com', department: 'Marketing', userRole: 'User', designation: 'Marketing Specialist' },
    { id: 5, SNo: '5', userName: 'Charlie Brown', userEmail: 'charlie.brown@example.com', department: 'Sales', userRole: 'User', designation: 'Sales Representative' },
    { id: 6, SNo: '6', userName: 'Eva Davis', userEmail: 'eva.davis@example.com', department: 'IT', userRole: 'User', designation: 'Systems Analyst' },
    { id: 7, SNo: '7', userName: 'David Clark', userEmail: 'david.clark@example.com', department: 'Finance', userRole: 'User', designation: 'Financial Planner' },
    { id: 8, SNo: '8', userName: 'Grace Lee', userEmail: 'grace.lee@example.com', department: 'HR', userRole: 'User', designation: 'HR Specialist' },
];

const GroupNewUser = ({
    newUserModalOpen, setNewUserModalOpen, isAddButton, editData, setRefreshData, selectedRowId
}) => {

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [userList, setUserList] = useState([]);
    const [customeOpen, setCustomeOpen] = useState(false)
    const [groupId, setGroupId] = useState('');
    const [userId, setUserId] = useState('')

    useEffect(() => {
        newUserModalOpen && ShowUser(handleSucessShow, handleExceptionShow);
    }, [newUserModalOpen]);

    const handleSucessShow = (dataObject) => {
        setFilteredData(dataObject?.data || []);
        setUserList(dataObject?.data || []);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {
    }

    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'SNo',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'userName',
            headerClassName: 'super-app-theme--header',
            headerName: 'User Name',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'email',
            headerClassName: 'super-app-theme--header',
            headerName: 'User Email',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'department',
            headerClassName: 'super-app-theme--header',
            headerName: 'Department',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'userRole',
            headerClassName: 'super-app-theme--header',
            headerName: 'User Role',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'designation',
            headerClassName: 'super-app-theme--header',
            headerName: 'Designation',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
    ];

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        const filteredRows = userList.filter((row) => {
            return Object.values(row).some((value) =>
                value.toString().toLowerCase().includes(query.toLowerCase())
            );
        });
        setFilteredData(filteredRows);
    };

    const handleRowClick = (params) => {
        setCustomeOpen(true);
        setGroupId(selectedRowId);
        setUserId(params.row.id);
        // GroupUserAssign({ groupId: selectedRowId, userId: params.row.id }, handleAssignSuccess, handleAssignFail)
    };

    const handleCustomeSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefreshData((oldvalue) => !oldvalue);
        setCustomeOpen(false);
        setTimeout(() => {
            handleClose();
            setNewUserModalOpen(false);
        }, 3000);
    }

    const handleCustomeFailure = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <Dialog
            sx={{ width: '100%' }}
            maxWidth="xl"
            open={newUserModalOpen}
            fullWidth
            // Set the height to a specific value or 'auto' for full height
            PaperProps={{ style: { width: '100%', maxHeight: 'none' } }}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Select the user
            </DialogTitle>

            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '2px', borderRadius: '10px', width: '100%', height: '100%' }}>
                                <CardContent>
                                    {/* <TextField
                                        label="Search"
                                        variant="outlined"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        style={{ marginBottom: 16 }}
                                    /> */}
                                    <Box
                                        sx={{
                                            height: '100%',
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                backgroundColor: '#93bce6',
                                                color: '#1c1919'
                                            },
                                        }}
                                    >
                                        <DataGrid
                                            rows={filteredData}
                                            columns={columns}
                                            pageSize={8}
                                            rowsPerPageOptions={[8]}
                                            disableSelectionOnClick
                                            style={{
                                                border: 'none',
                                                height: '490px', // Set your preferred height here
                                                border: '1px solid #DADADA'
                                            }}
                                            sx={{
                                                overflow: 'auto',
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
                                            onRowClick={handleRowClick}
                                            getRowClassName={(params) => {
                                                // Find the index of the row within the rows array
                                                const rowIndex = filteredData.findIndex(row => row.id === params.row.id);
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
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>

            <DialogActions>
                <Button
                    variant="contained"
                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                    onClick={() => {
                        setNewUserModalOpen(false)
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            <CustomePopUp
                title={'Confirmation'}
                titleColor={'#000000'}
                message={'Are you sure you want to add this user to the group?'}
                messageColor={'#000000'}
                CustomIcon={GroupAddIcon}
                iconColor={'#074173'}
                confirmButtonTitle={'AGREE'}
                confirmButtonBackGround={'#41B06E'}
                confirmButtonTextColor={'#ffffff'}
                closeButtonTitle={'CLOSE'}
                closeButtonBackground={'#DD5746'}
                closeButtonTextColor={'#ffffff  '}
                customeOpen={customeOpen}
                setCustomeOpen={setCustomeOpen}
                handleCustomeSuccess={handleCustomeSuccess}
                handleCustomeFailure={handleCustomeFailure}
                customeServicesApi={GroupUserAssign}
                bodyData={{ groupId: groupId, userId: userId }}
            />
        </Dialog>
    )
}

export default GroupNewUser