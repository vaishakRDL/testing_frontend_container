import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Box, Button, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DeleteHoliday, RemarksDelete, RemarksShowData, ShowHoliday } from '../../ApiService/LoginPageService';
import '../../App.css';
import ApplicationStore from '../../Utility/localStorageUtil';
import RemarksMasterTitle from './RemarksMasterTitle';
import RemarksMasterModule from './RemarksMasterModule';
import { useModuleLocks } from '../context/ModuleLockContext';

const RemarksMasterResult = () => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [masterData, serMasterData] = useState([]);

    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [sobDataList, setSobDataList] = useState([]);
    const [isTimeSlot, setIsTimeSlot] = useState(0);
    //NEW STATE VARIBALES
    const [selectedMaster, setSelectedMaster] = useState('pm');
    //

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const { userDetails } = ApplicationStore()?.getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "holidaymaster");
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Remark Master")?.lockStatus === "locked";


    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                SI No
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Remarks Description
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            headerClassName: 'super-app-theme--header',
            flex: 1,
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
        RemarksShowData(handleSobShowDataSuccess, handleSobShowDataException);
    }, [refreshData]);

    const handleSobShowDataSuccess = (dataObject) => {
        setSobDataList(dataObject?.data || []);
    }

    const handleSobShowDataException = (errorObject, errorMessage) => {

    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: userPermission[0]?.updateData === 0 || isModuleLocked ? '#706f6f' : 'black' }}

                onClick={(event) => {
                    if (isModuleLocked) return;
                    setOpen(true);
                    setIsAddButton(false);
                    setEditData(props.selectedRow);

                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                style={{ color: userPermission[0]?.deleteData === 0 || isModuleLocked ? '#706f6f' : 'black' }}
                onClick={() => {
                    if (isModuleLocked) return;
                    setDeleteId(props.selectedRow.id);
                    setDeleteDailogOpen(true);

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

    const handleSucessShow = (dataObject) => {
        serMasterData(dataObject?.data || []);
        setGridLoading(false);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

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


    const options = sobDataList.map(item => ({
        id: item?.id,
        label: item?.contractNo
    }));

    function handleAutocompleteChange(selectedValue) {
    }

    return (
        <div style={{ height: '80vh', margin: '20px' }}>
            <RemarksMasterTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}

            />
            {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}> */}
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                    <Card style={{ borderRadius: '8px', height: '75vh', marginTop: '10px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                        <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                    rows={sobDataList}
                                    columns={columns}
                                    pageSize={8}
                                    // loading={isLoading}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none', fontWeight: 'bold' }}
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
                                        const rowIndex = sobDataList.findIndex(row => row.id === params.row.id);
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

            {/* </div> */}

            <RemarksMasterModule
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
                deleteService={RemarksDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default RemarksMasterResult
