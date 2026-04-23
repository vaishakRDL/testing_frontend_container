// import React, { useState, useEffect } from 'react';
// import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import { Autocomplete, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
// import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
// import { SobShowData, ToolGrindingDelete, ToolsGrindingShowdata } from '../../ApiService/LoginPageService';
// import ToolGrindingTitle from './ToolGrindingTitle';
// import ToolGrindingModule from './ToolGrindingModule';


// const ToolGrindingResult = () => {
//     const [open, setOpen] = useState(false);
//     const [isAddButton, setIsAddButton] = useState(true);
//     const [editData, setEditData] = useState([]);
//     const [isLoading, setGridLoading] = useState(true);
//     const [masterData, serMasterData] = useState([]);
//     const [id, setId] = useState('');
//     const [password, setConfirmPassword] = useState('');
//     const [btnReset, setBtnReset] = useState(false);
//     const [refreshData, setRefreshData] = useState(false);
//     const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
//     const [deleteId, setDeleteId] = useState('');
//     const [kanbanDate, setKanbanDate] = useState('');
//     const [totalRecord, setTotalRecord] = useState('0');
//     const [sobDataList, setSobDataList] = useState([]);
//     const [showdata, setShowData] = useState("");

//     //NEW STATE VARIBALES
//     const [selectedMaster, setSelectedMaster] = useState('pm');
//     //

//     const [openNotification, setNotification] = useState({
//         status: false,
//         type: 'error',
//         message: '',
//     });

//     const columns = [
//         {
//             field: 'sno',
//             headerClassName: 'super-app-theme--header',
//             headerName:
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     S.No
//                 </span>,
//             type: 'string',
//             sortable: true,
//             // minWidth: 50,
//             minWidth: 100,
//             // flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'machineCode',
//             headerClassName: 'super-app-theme--header',
//             headerName:
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     Machine Code
//                 </span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'toolNo',
//             headerClassName: 'super-app-theme--header',
//             headerName:
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     Tool No
//                 </span>,
//             type: 'string',
//             sortable: true,
//             // minWidth: 50,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },

//         {
//             field: 'toolName',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                 Tool Name
//             </span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'process',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                 Process
//             </span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'grindingAlert',
//             headerClassName: 'super-app-theme--header',
//             headerName:
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     Grinding Alert
//                 </span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },

//         {
//             field: 'grindingCount',
//             headerClassName: 'super-app-theme--header',
//             headerName:
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     Grinding Count
//                 </span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },

//         {
//             field: 'startGrind',
//             headerClassName: 'super-app-theme--header',
//             headerName:
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     Start Grinding
//                 </span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'endGrind',
//             headerClassName: 'super-app-theme--header',
//             headerName:
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     End Grinding
//                 </span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },

//         {
//             field: 'actions',
//             type: 'actions',
//             headerClassName: 'super-app-theme--header',
//             flex: 1,
//             headerName:
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     Actions
//                 </span>,
//             cellClassName: 'actions',
//             disableClickEventBubbling: true,
//             getActions: (params) => [
//                 // <MiscellaneousServicesIcon />,
//                 <StartTimeEndTime selectedRow={params.row} />,
//             ],
//         },
//     ];


//     useEffect(() => {
//         // SobShowData(handleSobShowDataSuccess, handleSobShowDataException);
//         ToolsGrindingShowdata(handlegrindingShowData, handlegrindingException);
//     }, [refreshData]);


//     const handlegrindingShowData = (dataObject) => {
//         setGridLoading(false);
//         setShowData(dataObject.data);
//     }

//     const handlegrindingException = () => {

//     }


//     function StartTimeEndTime(props) {
//         return (
//             <MiscellaneousServicesIcon
//                 style={{ color: 'black', cursor: 'pointer' }}
//                 onClick={(event) => {
//                     setOpen(true);
//                     setIsAddButton(false);
//                     setEditData(props.selectedRow);
//                 }}
//             />
//         );
//     }

//     function DeleteData(props) {
//         return (
//             <DeleteIcon
//                 onClick={() => {
//                     setDeleteId(props.selectedRow.id);
//                     setDeleteDailogOpen(true);
//                 }}
//                 style={{ color: 'black' }}
//             />
//         );
//     }

//     const handleClose = () => {
//         setNotification({
//             status: false,
//             type: '',
//             message: '',
//         });
//     };

//     const handleSucessShow = (dataObject) => {
//         serMasterData(dataObject?.data || []);
//         setGridLoading(false);
//     }
//     const handleExceptionShow = (errorObject, errorMessage) => {

//     }

//     const deletehandleSuccess = (dataObject) => {
//         setNotification({
//             status: true,
//             type: 'success',
//             message: dataObject.message,
//         });

//         setRefreshData((oldvalue) => !oldvalue);
//         setTimeout(() => {
//             handleClose();
//             setDeleteDailogOpen(false);
//         }, 3000);
//     };

//     const deletehandleException = (errorObject, errorMessage) => {
//         setNotification({
//             status: true,
//             type: 'error',
//             message: errorMessage,
//         });
//         setTimeout(() => {
//             // handleClose();
//         }, 3000);
//     };


//     const options = sobDataList.map(item => ({
//         id: item?.id,
//         label: item?.contractNo
//     }));

//     function handleAutocompleteChange(selectedValue) {
//         // Your logic here with the selected value
//         console.log("Selected Value:", selectedValue);
//     }

//     return (
//         <div style={{ height: '80vh', width: '100%' }}>
//             <ToolGrindingTitle
//                 setIsAddButton={setIsAddButton}
//                 setEditData={setEditData}
//                 setOpen={setOpen}

//             />
//             <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '-20px' }}>

//                 <Card style={{ borderRadius: '8px', height: '100%', width: '98%', marginTop: '10px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
//                     <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                         <DataGrid
//                             rows={showdata}
//                             columns={columns}
//                             pageSize={8}
//                             loading={isLoading}
//                             rowsPerPageOptions={[8]}
//                             disableSelectionOnClick
//                             style={{ border: 'none', fontWeight: 'bold' }}
//                             sx={{
//                                 overflow: 'auto',
//                                 height: '65vh',
//                                 // minHeight: '500px',
//                                 width: '100%',
//                                 '& .super-app-theme--header': {
//                                     WebkitTextStrokeWidth: '0.6px',
//                                     backgroundColor: '#93bce6',
//                                     color: '#1c1919'
//                                 },
//                                 '& .MuiDataGrid-cell': {
//                                     border: '1px solid #969696',
//                                 },
//                                 '& .MuiDataGrid-columnHeader': {
//                                     border: '1px solid #969696', // Add border to column headers
//                                 },
//                             }}
//                             getRowClassName={(params) => {
//                                 // Find the index of the row within the rows array
//                                 const rowIndex = sobDataList.findIndex(row => row.id === params.row.id);
//                                 // Check if the index is valid
//                                 if (rowIndex !== -1) {
//                                     console.log(' ');
//                                     return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
//                                 }
//                                 return ''; // Return default class if index is not found
//                             }}

//                             rowHeight={40}
//                             columnHeaderHeight={40}
//                         />
//                     </CardContent>
//                 </Card>
//             </div>

//             <ToolGrindingModule
//                 isAddButton={isAddButton}
//                 editData={editData}
//                 open={open}
//                 setOpen={setOpen}
//                 setRefreshData={setRefreshData}
//             />

//             <NotificationBar
//                 handleClose={handleClose}
//                 notificationContent={openNotification.message}
//                 openNotification={openNotification.status}
//                 type={openNotification.type}
//             />

//             <DeleteConfirmationDailog
//                 open={deleteDailogOpen}
//                 setOpen={setDeleteDailogOpen}
//                 deleteId={deleteId}
//                 deleteService={ToolGrindingDelete}
//                 handleSuccess={deletehandleSuccess}
//                 handleException={deletehandleException}
//             />
//         </div>
//     )
// }

// export default ToolGrindingResult
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
    CardContent
} from '@mui/material';

import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import { EditShowToolList, GetProcessmachineList, GetUOM, ToolGrindingDelete, ToolGrindingTimeService, ToolsGrindingShowdata } from '../../ApiService/LoginPageService';
import ToolGrindingTitle from './ToolGrindingTitle';

const ToolGrindingResult = () => {

    // 🔹 Replacement dialog state
    const [openReplaceDialog, setOpenReplaceDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [showdata, setShowData] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [refreshData, setRefreshData] = useState(false);

    // 🔹 Date dialog states

    // 🔹 Notification
    const [openNotification, setNotification] = useState({
        status: false,
        type: '',
        message: '',
    });

    const handleOpenReplacement = (row) => {
        ToolGrindingTimeService({
            id: row?.id,
            type: 'Replacement',
        }, handleReplacetGrindingSuccess, handleReplaceGrindingException);
        setRefreshData(prev => !prev);

    };


    // ================= FETCH =================
    // Load grid ONCE + refresh only when needed
    useEffect(() => {
        ToolsGrindingShowdata(handleSuccess, handleException);
    }, [refreshData]);



    const handleSuccess = (res) => {
        setShowData(res.data || []);
        setGridLoading(false);
    };

    const handleException = () => {
        setGridLoading(false);
    };


    // ================= COLUMNS (UI SAME) =================
    const handleStartGrinding = (row) => {
        const startTime = new Date().toISOString();


        ToolGrindingTimeService({
            id: row.id,
            type: 'start',
        }, handleStartGrindingSuccess, handleStartGrindingException);

        // 🔴 CALL START API HERE
        setRefreshData(prev => !prev);

    };

    const handleStartGrindingSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
    }
    const handleStartGrindingException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }
    const handleReplacetGrindingSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const handleReplaceGrindingException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });

    }
    // ================= END API =================
    const handleEndGrinding = (row) => {
        const endTime = new Date().toISOString();


        ToolGrindingTimeService({
            id: row.id,
            type: 'end',
        }, handleEndGrindingSuccess, handleEndGrindingException);

        setRefreshData(prev => !prev);

    };

    const handleEndGrindingSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();

        }, 2000);
    }
    const handleEndGrindingException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }
    const columns = [
        {
            field: 'sno',
            headerClassName: 'super-app-theme--header',
            headerName: 'S.No',
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'machineCode',
            headerName: 'Machine Code',
            headerClassName: 'super-app-theme--header',

            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'toolNo',
            headerName: 'Tool No',
            headerClassName: 'super-app-theme--header',

            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'toolName',
            headerName: 'Tool Name',
            headerClassName: 'super-app-theme--header',

            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'process',
            headerName: 'Process',
            headerClassName: 'super-app-theme--header',

            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'grindingAlert',
            headerName: 'Grinding Alert',
            headerClassName: 'super-app-theme--header',

            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'grindingCount',
            headerName: 'Grinding Count',
            headerClassName: 'super-app-theme--header',

            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'alertMessage',
            headerName: 'Alert Message',
            headerClassName: 'super-app-theme--header',

            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'startGrind',
            headerName: 'Start Date',
            headerClassName: 'super-app-theme--header',

            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },

        {
            field: 'grinding',
            headerName: 'Grinding',
            headerClassName: 'super-app-theme--header',
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center',

            renderCell: (params) => {
                const { startGrind, endGrind, alertMessage } = params.row;

                // 🟡 REPLACEMENT CASE → Hide Start button
                if (!startGrind && alertMessage === "Replacement") {
                    return <span>-</span>;   // or return null
                }

                // 🟢 Normal → Show START
                if (!startGrind) {
                    return (
                        <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleStartGrinding(params.row)}
                        >
                            Start
                        </Button>
                    );
                }

                // 🔵 Started but not ended → Show END
                if (startGrind && !endGrind) {
                    return (
                        <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleEndGrinding(params.row)}
                        >
                            End
                        </Button>
                    );
                }

                // ✅ Started & Ended → Show End value
                return <span>{endGrind}</span>;
            },
        },

        {
            field: 'replacement',
            headerName: 'Replacement',
            minWidth: 120,
            headerClassName: 'super-app-theme--header',
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                // 🟢 Show Replace ONLY when alertMessage = "Grinding"
                if (params.row.alertMessage === 'Replacement') {
                    return (
                        <Button
                            size="small"
                            variant="contained"
                            color="warning"
                            onClick={() => handleOpenReplacement(params.row)}
                        >
                            Replace
                        </Button>
                    );
                }

                return null;
            },
        },



    ];

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <div style={{ height: '80vh', width: '100%' }}>
            <ToolGrindingTitle />

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

            {/* ⏱️ DATE TIME PICKER */}

            <NotificationBar
                openNotification={openNotification.status}
                type={openNotification.type}
                notificationContent={openNotification.message}
                handleClose={handleClose}

            />
        </div>
    );
};

export default ToolGrindingResult;
