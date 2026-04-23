import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import OrderTypeMasterTitle from './OrderTypeMasterTitle';
import OrderTypeMaster from './OrderTypeMaster';
import { MasterAddDataShow } from '../../ApiService/LoginPageService';

const OrderTypeMasterResult = () => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [ShowDataList,setShowDataList] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const columns = [
        {
            field: 'orderType',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Order Type Master
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'description',
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
     
        MasterAddDataShow(handleMasterAddDataShowSuccess,handleMasterAddDataShowException);
    }, [refreshData]);

    const handleMasterAddDataShowSuccess =(dataObject)=>{
        setShowDataList(dataObject?.data || []);
        setGridLoading(false);
    }

    const handleMasterAddDataShowException =()=>{

    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: '#000000' }}
                onClick={(event) => {
                    setIsAddButton(false);
                    setEditData(props.selectedRow);
                    setOpen(true);
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                
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

    const handleSucessShow = (dataObject) => {
      
        setGridLoading(false);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

    }
    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <OrderTypeMasterTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent>
                        <DataGrid
                            rows={ShowDataList}
                            columns={columns}
                            pageSize={8}
                            loading={isLoading}
                            rowsPerPageOptions={[8]}
                            disableSelectionOnClick
                            style={{ border: 'none',  }}
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

            <OrderTypeMaster
                isAddButton={isAddButton}
                currencyData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
                configSetupData={editData}
            />

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            {/* <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                selectedMaster={selectedMaster}
                deleteService={AllMasterDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            /> */}
        </div>
    )
}

export default OrderTypeMasterResult
