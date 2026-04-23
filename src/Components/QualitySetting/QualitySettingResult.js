import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Button } from 'react-bootstrap';
import { AllMasterDelete, AllShowMasterAdd, DeleteQualityRule, GetQualityRule } from '../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import '../../App.css';
import ApplicationStore from '../../Utility/localStorageUtil';
import QualitySettingModal from './QualitySettingModal';
import QualitySettingTitle from './QualitySettingTitle';
import { useModuleLocks } from '../context/ModuleLockContext';

const QualitySettingResult = () => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Quality Settings")?.lockStatus === "locked";


    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [masterData, serMasterData] = useState([]);
    const [id, setId] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    //NEW STATE VARIBALES
    const [selectedMaster, setSelectedMaster] = useState('supplyType');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [qualityRuleLists, setQualiotyRuleLists] = useState([])

    const { userDetails } = ApplicationStore()?.getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "QualitySetting".toLowerCase());


    useEffect(() => {
        GetQualityRule({
            masterType: selectedMaster
        }, handleSucessShow, handleExceptionShow);
    }, [refreshData]);

    const handleSucessShow = (dataObject) => {
        setQualiotyRuleLists(dataObject?.data || []);
        setGridLoading(false);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {
    }

    const columns = [
        {
            field: 'type',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Inspection Type
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'itemGroup',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Group
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        // {
        //     field: 'material',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Material
        //         </span>,
        //     headerClassName: 'super-app-theme--header',
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        // },
        {
            field: 'displayName',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Display Name
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'inspectionPlan',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Inspection Plan
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'inspectionLevel',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Inspection Level
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
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
            ],
        },
    ];

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: userPermission[0]?.updateData === 0 || isModuleLocked ? '#706f6f' : 'black' }}
                onClick={(event) => {
                    if (userPermission[0]?.updateData === 1 && !isModuleLocked) {
                        setOpen(true);
                        setIsAddButton(false);
                        setEditData(props.selectedRow);
                    }
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    if (userPermission[0]?.deleteData === 1 && !isModuleLocked) {
                        setDeleteId(props.selectedRow.id);
                        setDeleteDailogOpen(true);
                    }
                }}
                style={{ color: userPermission[0]?.deleteData === 0 || isModuleLocked ? '#706f6f' : 'black' }}
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

    const masterList = [
        // { id: 1, masterName: 'Currency', value: 'currency' },
        { id: 2, masterName: 'Supply Type', value: 'supplyType' },
        { id: 3, masterName: 'GSTIN/UIN ID', value: 'gstinOrUin' },
        { id: 4, masterName: 'Place of Supply', value: 'placeOfSupply' },
    ]

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

    return (
        <Box style={{ height: '60vh', margin: "10px" }}>
            <QualitySettingTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
            />
            {/* <div style={{ display: 'flex', justifyContent: 'space-around'}}> */}
            <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', borderRadius: '10px', height: '100%' }}>
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
                                    rows={qualityRuleLists}
                                    columns={columns}
                                    pageSize={8}
                                    loading={isLoading}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none' }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '63vh',
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
                                        const rowIndex = qualityRuleLists.findIndex(row => row.id === params.row.id);
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

            <QualitySettingModal
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
                // selectedMaster={selectedMaster}
                deleteService={DeleteQualityRule}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </Box>
    )
}

export default QualitySettingResult;