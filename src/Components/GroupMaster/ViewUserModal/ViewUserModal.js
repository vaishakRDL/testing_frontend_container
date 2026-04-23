import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel,
} from '@mui/material';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from "@mui/icons-material/Search";
import { AddMachine, MachineEdit, ShowMachineOperator, GetShift, ShowProcessMaster, getMachineUOM, ShowGroupUser, GroupUserDelete } from '../../../ApiService/LoginPageService';
import GroupNewUser from '../GroupNewUser/GroupNewUser';
import DeleteConfirmationDailog from '../../../Utility/confirmDeletion';

const ViewUserModal = ({
    viewUserModalOpen, setViewUserModelOpen, isAddButton, editData, /*setRefreshData,*/ selectedRowId
}) => {

    const [id, setId] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [rowId, setRowId] = useState('')
    const [newUserModalOpen, setNewUserModalOpen] = useState(false)
    const [groupUserList, setGroupUserList] = useState([])
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
        viewUserModalOpen && ShowGroupUser({ id: selectedRowId }, handleGroupUserSucessShow, handleGroupUserExceptionShow);
    }, [viewUserModalOpen, refreshData]);

    const handleGroupUserSucessShow = (dataObject) => {
        setGroupUserList(dataObject?.data || []);
        console.log("dataObject", dataObject)
    }
    const handleGroupUserExceptionShow = (errorObject, errorMessage) => {
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
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName: 'Actions',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                // <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];

    function DeleteData(props) {
        return (
            <Tooltip title={'Delete'}>
                <DeleteIcon
                    onClick={() => {
                        setDeleteId(props.selectedRow.id);
                        setDeleteDailogOpen(true);
                    }}
                    style={{ color: 'black' }}
                />
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
        <Dialog
            sx={{ width: '100%' }}
            maxWidth="xl"
            open={viewUserModalOpen}
            fullWidth
            PaperProps={{ style: { width: '100%', maxHeight: 'none' } }}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Group Users
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6">
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography style={{ fontWeight: 'bold' }}>Group User Lists</Typography>
                            <Button variant="contained" style={{ backgroundColor: '#002D68' }} onClick={() => setNewUserModalOpen(true)}>Assign New User</Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '2px', borderRadius: '10px', width: '100%', height: '100%' }}>
                                <CardContent>
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
                                            rows={groupUserList}
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
                                            getRowClassName={(params) => {
                                                // Find the index of the row within the rows array
                                                const rowIndex = groupUserList.findIndex(row => row.id === params.row.id);
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
                        setViewUserModelOpen(false)
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
            <GroupNewUser
                selectedRowId={selectedRowId}
                newUserModalOpen={newUserModalOpen}
                setNewUserModalOpen={setNewUserModalOpen}
                setRefreshData={setRefreshData}
            />
            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                // selectedMaster={selectedMaster}
                deleteService={GroupUserDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </Dialog>
    )
}

export default ViewUserModal