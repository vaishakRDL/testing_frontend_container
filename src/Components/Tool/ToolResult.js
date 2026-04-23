import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Button } from 'react-bootstrap';
import SearchIcon from "@mui/icons-material/Search";
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import { DeleteShowToolList, ShowToolList, ToolsShowdata, } from '../../ApiService/LoginPageService';
import ToolTitle from './ToolTitle';
import ToolModule from './ToolModule';


const ToolResult = () => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [masterData, serMasterData] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');

    const [sobDataList, setSobDataList] = useState([]);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const columns = [
        {
            field: 'slno',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
                </span>,
            type: 'string',
            sortable: true,
            // minWidth: 50,
            maxWidth: 100,
            width: 100,
            align: 'center',
            headerAlign: 'center',
        },
        // {
        //     field: 'fimNo',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Tool Id
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     maxWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
        {
            field: 'machineCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Machine Name
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'code',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Process
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'toolName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Tool Name
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 2,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'toolNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Tool No
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'uomName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    UOM
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'toolCost',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Tool Cost
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'grindingSupportId',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Grinding Support
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'grindingAlert',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Grinding Alert
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        // {
        //     field: 'afterGrindingToolLife',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             After Grinding Tool Life
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
        // {
        //     field: 'replacementCount',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Tool Replacement Count
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
        // {
        //     field: 'toolUsageLife',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Max Tool Usage| Life
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
        {
            field: 'openingCount',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Opening Count
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'replacementCount',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Replacement Count
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
        ShowToolList(handleSobShowDataSuccess, handleSobShowDataException);
    }, [refreshData]);


    const handleSobShowDataSuccess = (dataObject) => {
        setGridLoading(false);
        setSobDataList(dataObject?.data || []);
    }

    const handleSobShowDataException = (errorObject, errorMessage) => {

    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: 'black' }}
                onClick={(event) => {
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
                onClick={() => {
                    setDeleteId(props.selectedRow.id);
                    setDeleteDailogOpen(true);
                }}
                style={{ color: 'black' }}
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


    // const options = sobDataList.map(item => ({
    //     id: item?.id,
    //     label: item?.contractNo
    // }));

    function handleAutocompleteChange(selectedValue) {
        // Your logic here with the selected value
    }

    return (
        <div style={{ height: '80vh', width: '100%' }}>
            <ToolTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}

            />
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '-20px' }}>
                <Card style={{ borderRadius: '8px', height: '100%', width: '98%', marginTop: '10px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                    <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <DataGrid
                            rows={sobDataList}
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
                    </CardContent>
                </Card>
            </div>

            <ToolModule
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
                deleteService={DeleteShowToolList}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default ToolResult
