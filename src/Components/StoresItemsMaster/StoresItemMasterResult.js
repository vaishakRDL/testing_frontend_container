import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Card, CardContent } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';

// import PartMasterTitle from './PartMasterTitle';
// import PartMasterModule from './PartMasterModule';
import StoresItemMasterTitle from './StoresItemMasterTitle';
import StoresItemMasterModule from './StoresItemMasterModule';
import { ShowStoreItemMaster, StoreItemDelete } from '../../ApiService/LoginPageService'
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';

const StoresItemMasterResult = () => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editeData, setEditeData] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [id, setId] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [storeItemMasterList, setStoreItemMasterList] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')


    const columns = [
        {
            field: 'itmCode',
            headerName: 'Sitem Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'itmName',
            headerName: 'Sitem Name',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'itemGroupName',
            headerName: 'Item Group',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'uomName',
            headerName: 'UOM',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },

        {
            field: 'stdRate',
            headerName: 'Std Rate',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50,
            flex: 1,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'inActive',
            headerName: 'InActive',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerName: 'Remarks',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerName: 'Actions',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];


    useEffect(() => {
        ShowStoreItemMaster(handleSucessShow, handleExceptionShow);
    }, [refreshData]);

    const handleSucessShow = (dataObject) => {
        setStoreItemMasterList(dataObject?.data || []);
        // setGridLoading(false);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: '#000000' }}
                onClick={(event) => {
                    setIsAddButton(false);
                    setEditeData(props.selectedRow);
                    setOpen(true);
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
        <div style={{ height: '60vh', width: '100%' }}>
            <StoresItemMasterTitle
                setIsAddButton={setIsAddButton}
                setEditeData={setEditeData}
                setOpen={setOpen}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent>
                        <DataGrid
                            rows={storeItemMasterList}
                            columns={columns}
                            pageSize={8}
                            // loading={isLoading}
                            rowsPerPageOptions={[8]}
                            disableSelectionOnClick
                            style={{ border: 'none', }}
                            sx={{
                                overflow: 'auto',
                                height: '50vh',
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

                            rowHeight={40}
                            columnHeaderHeight={40}
                        />
                    </CardContent>
                </Card>

            </div>

            <StoresItemMasterModule
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
                // selectedMaster={selectedMaster}
                deleteService={StoreItemDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default StoresItemMasterResult