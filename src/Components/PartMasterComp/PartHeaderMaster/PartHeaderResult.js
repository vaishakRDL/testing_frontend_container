import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PartHeaderTitle from './PartHeaderTitle';
import PartHeaderModule from './PartHeaderModule';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { ItemMasterDataDelete, ItemMastersDataShow } from '../../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../../Utility/confirmDeletion';
import '../../../App.css';
import ApplicationStore from '../../../Utility/localStorageUtil';

const PartHeaderResult = () => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editeData, setEditeData] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [id, setId] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [itemMasterList, setItemMasterList] = useState([]);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [selectedMaster, setSelectedMaster] = useState('underLedger');

    const { userDetails } = ApplicationStore()?.getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "itemmaster");

    const columns = [
        {
            field: 'name',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Name
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'description',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Description
                </span>,
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

    const masterList = [
        { id: 1, masterName: 'Under Ledger', value: 'underLedger' },
        { id: 2, masterName: 'Reorder', value: 'reorder' },
        { id: 3, masterName: 'Main Location', value: 'mainLocation' },
        { id: 4, masterName: 'HSNCode', value: 'hsnCode' },
        { id: 5, masterName: 'Sub Location', value: 'subLocation' },
        { id: 6, masterName: 'Product Finish', value: 'productFinish' },
        { id: 7, masterName: 'Product Family', value: 'productFamily' },
        { id: 8, masterName: 'Category', value: 'category' },
        { id: 9, masterName: 'FIM', value: 'fim' },
        // { id: 10, masterName: 'RM Itemcode', value: 'rmItemcode' },
        { id: 11, masterName: 'BUY PRODUCTION', value: 'BUYPRODUCTION' },
    ]


    useEffect(() => {
        ItemMastersDataShow({
            id: selectedMaster
        }, handleItemMastersDataShowSuccess, handleItemMastersDataShowException);
    }, [refreshData]);

    const handleItemMastersDataShowSuccess = (dataObject) => {
        setItemMasterList(dataObject?.data || []);
        setGridLoading(false);
    }

    const handleItemMastersDataShowException = (errorObject, errorMessage) => {
        console.log(errorMessage);
    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: userPermission[0]?.updateData === 0 ? '#706f6f' : 'black' }}
                onClick={(event) => {
                    if (userPermission[0]?.updateData === 1) {
                        setOpen(true);
                        setEditeData(props.selectedRow);
                        setIsAddButton(false);
                    }
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                style={{ color: userPermission[0]?.deleteData === 0 ? '#706f6f' : 'black' }}
                onClick={() => {
                    if (userPermission[0]?.deleteData === 1) {
                        setDeleteId(props.selectedRow.id);
                        setDeleteDailogOpen(true);
                    }
                }
                }
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

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <PartHeaderTitle
                setIsAddButton={setIsAddButton}
                setEditeData={setEditeData}
                setOpen={setOpen}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Grid container spacing={2} style={{ marginTop: '-25px' }}>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3} marginLeft={2}>
                        <FormControl fullWidth >
                            <InputLabel id="demo-simple-select-label">Select Master</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedMaster}
                                label="Select Master"
                                variant="filled"
                                size='small'
                                onChange={(e) => {
                                    setSelectedMaster(e.target.value)
                                    ItemMastersDataShow({
                                        id: e.target.value
                                    }, handleItemMastersDataShowSuccess, handleItemMastersDataShowException);
                                }}
                            >
                                {masterList.map((data) => (
                                    <MenuItem key={data.id} value={data.value}>{data.masterName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginLeft={2}>
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '-10px', borderRadius: '10px', width: '98%', height: '100%' }}>
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
                                        rows={itemMasterList}
                                        columns={columns}
                                        pageSize={8}
                                        loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', fontWeight: 'bold' }}
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
                                            const rowIndex = itemMasterList.findIndex(row => row.id === params.row.id);
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

            </div>

            <PartHeaderModule
                isAddButton={isAddButton}
                editeData={editeData}
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
                selectedMaster={selectedMaster}
                deleteService={ItemMasterDataDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default PartHeaderResult