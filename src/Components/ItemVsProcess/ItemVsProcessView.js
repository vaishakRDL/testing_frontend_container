import React, { useState, useEffect } from 'react';
import { Autocomplete, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { GetAllocatedItemVsProcessView, GetAllAllocatedItemVsProcess, GetAllocatedItems } from '../../ApiService/LoginPageService';
import MachinePartNoList from './MachinePartNoList/MachinePartNoList';
import EditIcon from '@mui/icons-material/Edit';
import AllocatedEditModal from './AllocatedEditModal/AllocatedEditModal';
import ApplicationStore from '../../Utility/localStorageUtil';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ItemVsProcessView = () => {
    const [refreshData, setRefreshData] = useState(false);
    const [itemList, setItemList] = useState([])
    const [allocatedItemList, setAllocatedItemList] = useState([])
    const [machinePartListModal, setMachinePartListModal] = useState(false);
    const [machineId, setMachineId] = useState('');
    const [machineCode, setMachineCode] = useState('');
    const [process, setProcess] = useState('');
    const [editModalOpen, setEditModalOpen] = useState('');
    const [editData, setEditData] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState('')
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        editModalOpen && GetAllocatedItemVsProcessView({ id: selectedItemId }, handleViewAllocationSucess, handleViewAllocationException)
    }, [refreshData]);

    const handleAllAllocatedItemSucess = (dataObject) => {
        setAllocatedItemList(dataObject?.data || []);
    }
    const handleAllAllocatedItemException = (errorObject, errorMessage) => {
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "viewitemvsprocess");

    const processListView = [
        {
            field: 'process',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Process Name</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'machineCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>Machine Code</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        // {
        //     field: 'toolNo',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Tool</span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        {
            field: 'count',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Count</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cycleTime',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cycle Time</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'processPriority',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Process Priority</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'range',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Price Range</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'skip',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Skip</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                return params.value === 1 ? 'Yes' : 'No';
            },
        },
        // {
        //     field: 'quality',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Quality</span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        // {
        //     field: 'vendorProcess',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>InHouse/VendorProcess</span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        //     renderCell: (params) => {
        //         return params.value === 1 ? 'Vendor Process' : 'InHouse';
        //     },
        // },
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
                // <DeleteData selectedRow={params.row} />,
            ],
        },
    ]

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: userPermission[0]?.updateData === 0 ? 'gray' : '#000000' }}
                onClick={() => {
                    if (userPermission[0]?.updateData === 1) {
                        setEditData(props.selectedRow);
                        setEditModalOpen(true);
                    }
                }}
            />
        );
    }

    const handleSupplierSearchItemChange = (value) => {
        if (value !== null) {
            setSelectedItemId(value.id);
            GetAllocatedItemVsProcessView({ id: value.id }, handleViewAllocationSucess, handleViewAllocationException)
        }
    }

    const handleViewAllocationSucess = (dataObject) => {
        setAllocatedItemList(dataObject?.data || []);
    }
    const handleViewAllocationException = (errorObject, errorMessage) => {
    }

    const handleChange = (e) => {
        GetAllocatedItems({ code: e.target.value }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
    }

    const handleItemVsProcessItemSucessShow = (dataObject) => {
        setItemList(dataObject?.data || []);
    }
    const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
    }

    const handleCellClick = (params) => {
        (params.field === 'machineCode')
            &&
            (setMachinePartListModal(true))
        setMachineId(params.row.machineId);
        setMachineCode(params.row.machineCode);
        setProcess(params.row.process);
    }

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <Grid container>
                <Grid item style={{ marginTop: '16px', marginBottom: '16px' }}>
                    <Typography
                        sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold', marginLeft: '21px' }}
                        variant="h5"
                    >
                        View Item Vs Process
                    </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} paddingLeft={2} paddingRight={2} paddingBottom={2}>
                <Grid item xs={12} sm={12} md={12} lg={12}>

                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={itemList}
                        size='small'
                        sx={{ width: 300, }}
                        renderInput={(params) => <TextField {...params} label="Search Items" onChange={handleChange} />}
                        onChange={(event, value) => handleSupplierSearchItemChange(value)}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '-5px', borderRadius: '10px', width: '100%', height: '100%' }}>
                        <CardContent>

                            <DataGrid
                                rows={allocatedItemList}
                                columns={processListView}
                                pageSize={8}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ border: 'none', }}
                                sx={{
                                    overflow: 'auto',
                                    height: '60vh',
                                    width: '100%',
                                    cursor: 'pointer',
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
                                    const rowIndex = allocatedItemList.findIndex(row => row.id === params.row.id);
                                    // Check if the index is valid
                                    if (rowIndex !== -1) {
                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    }
                                    return ''; // Return default class if index is not found
                                }}
                                rowHeight={40}
                                columnHeaderHeight={40}
                                onCellClick={handleCellClick}
                            />
                        </CardContent>
                    </Card>
                </Grid>


            </Grid>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            <MachinePartNoList
                machinePartListModal={machinePartListModal}
                setMachinePartListModal={setMachinePartListModal}
                machineId={machineId}
                machineCode={machineCode}
                process={process}
            />
            <AllocatedEditModal
                setEditModalOpen={setEditModalOpen}
                editModalOpen={editModalOpen}
                editData={editData}
                setRefreshData={setRefreshData}
            />
        </div>
    )
}

export default ItemVsProcessView