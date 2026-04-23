import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Button, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import TodaysDispatchPlanTitle from './TodaysDispatchPlanTitle';
import { DispatchCustDelScheduleDelete, DispatchInvoiceClick, TodayDispatchDelSchedule } from '../../ApiService/LoginPageService';
import TodaysDispatchPlanDetails from './TodaysDispatchPlanDetails';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';
import ApplicationStore from '../../Utility/localStorageUtil';

const TodaysDispatchPlanResult = () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setGridLoading] = useState(true);
    const [masterData, setMasterData] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [sobDataList, setSobDataList] = useState([]);
    const [delNotNo, setDelNotNo] = useState('');

    //NEW STATE VARIBALES
    const [selectedMaster, setSelectedMaster] = useState('pm');
    //

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "customerdeliveryschedule");

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        TodayDispatchDelSchedule(DispatchCustDelScheduleSuccess, DispatchCustDelScheduleException);
    }, [refreshData]);

    const DispatchCustDelScheduleSuccess = (dataObject) => {
        setMasterData(dataObject?.data || []);
        setGridLoading(false);
    }

    const DispatchCustDelScheduleException = (errorStatus, errorMessage) => {
        console.log(errorMessage);
    }

    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'deliveryDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Scheduled Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'createdBy',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Created By
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'delNoteNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Del-Note No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        // {
        //     field: 'dc',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             DC/Invoice No
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
        {
            field: 'vehicleNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Vehicle No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'timeslot',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Time Slot
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'status',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Status
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
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <Visibility selectedRow={params.row} />,
                // <InnvoceData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];


    useEffect(() => {
        // SobShowData(handleSobShowDataSuccess, handleSobShowDataException);
    }, [refreshData]);

    const handleSobShowDataSuccess = (dataObject) => {

    }

    const handleSobShowDataException = (errorObject, errorMessage) => {

    }

    function Visibility(props) {
        return (
            <Tooltip title="View">
                <VisibilityIcon
                    style={{ color: 'black' }}
                    onClick={(event) => {
                        setOpen(true);
                        setDelNotNo(props.selectedRow.delNoteNo);
                    }}
                />
            </Tooltip>
        );
    }

    function InnvoceData(props) {
        return (
            <Tooltip title=" Invoice ">
                <DescriptionIcon
                    style={{ color: 'black' }}
                    onClick={(event) => {
                        DispatchInvoiceClick({
                            id: props.selectedRow.id
                        }, DispatchInvoiceClickSuccess, DispatchInvoiceClickException);
                    }}
                />
            </Tooltip>
        );
    }

    const DispatchInvoiceClickSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
        }, 3000);
    }

    const DispatchInvoiceClickException = () => {

    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                style={{ color: userPermission[0]?.deleteData === 0 ? 'gray' : '#000000' }}
                onClick={() => {
                    if (userPermission[0]?.deleteData === 1) {
                        setDeleteId(props.selectedRow.id);
                        setDeleteDailogOpen(true);
                    }
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
        // Your logic here with the selected value
        console.log("Selected Value:", selectedValue);
    }


    const handleRowClick = (e) => {

    }

    return (
        <div style={{ height: '80vh', width: '100%' }}>
            <TodaysDispatchPlanTitle />
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '-10px' }}>
                <Card style={{ borderRadius: '8px', height: '100%', width: '99%', marginTop: '10px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                    <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <DataGrid
                            rows={masterData}
                            columns={columns}
                            pageSize={8}
                            loading={isLoading}
                            rowsPerPageOptions={[8]}
                            onRowClick={handleRowClick}
                            disableSelectionOnClick
                            style={{ border: 'none', fontWeight: 'bold' }}
                            sx={{
                                overflow: 'auto',
                                height: '60vh',
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
                                const rowIndex = masterData.findIndex(row => row.id === params.row.id);
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

            <TodaysDispatchPlanDetails
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
                refreshData={setRefreshData}
                delNotNo={delNotNo}
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
                deleteService={DispatchCustDelScheduleDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default TodaysDispatchPlanResult
