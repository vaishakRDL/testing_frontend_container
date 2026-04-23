import { Box, Card, CardContent, Tooltip } from '@mui/material';
import React, { useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import EmailSettingModule from './EmailSettingModule';
import { ShowEmailSetting } from '../../ApiService/LoginPageService';
import { DataGrid } from '@mui/x-data-grid';
import EmailSettingTitle from './EmailSettingTitle';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { useModuleLocks } from '../context/ModuleLockContext';

const EmailSettingResult = () => {

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Email Settings")?.lockStatus === "locked";


    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [emailList, setEmailList] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const columns = [
        {
            field: 'type',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Department
                </span>,
            type: 'string',
            sortable: true,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'smtp_host',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    SMTP Server
                </span>,

            type: 'string',
            sortable: true,
            flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'email',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Email From
                </span>,

            type: 'string',
            sortable: true,
            flex: 1, align: 'center', headerAlign: 'center'
        },
        // {
        //     field: 'password',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Password
        //         </span>,
        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //    flex: 1, flex: 1, align: 'left', headerAlign: 'center'
        // },
        {
            field: 'smtp_port',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Port
                </span>,
            type: 'number',
            sortable: true,
            sortable: false,
            flex: 1, align: 'center', headerAlign: 'center'
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
            ],
        },
    ];
    function EditData(props) {
        return (
            <Tooltip title={'Edit'}>
                {/* <EditIcon
                    style={{ color: 'black' }}
                    disabled={isModuleLocked}
                    onClick={(event) => {
                        setIsAddButton(true);
                        setEditData(props.selectedRow);
                        setOpen(true); */}
                <EditIcon
                    style={{
                        color: isModuleLocked ? "gray" : "black",
                        pointerEvents: isModuleLocked ? "none" : "auto",
                        cursor: isModuleLocked ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                        if (isModuleLocked) return;
                        setIsAddButton(true);
                        setEditData(props.selectedRow);
                        setOpen(true);

                    }}
                />            </Tooltip>
        )
    }
    useEffect(() => {
        ShowEmailSetting(handleSucessShow, handleExceptionShow)
    }, [refreshData]);

    const handleSucessShow = (dataObject) => {
        setEmailList(dataObject?.data || []);
        // setGridLoading(false);
        // console.log("dataObject", dataObject)
    };
    const handleExceptionShow = (errorObject, errorMessage) => {

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
            <EmailSettingTitle
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
                                rows={emailList}
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
                                    const rowIndex = emailList.findIndex(row => row.id === params.row.id);
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

            <EmailSettingModule
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



        </div>
    )
}

export default EmailSettingResult