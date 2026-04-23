import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import '../../../App.css';
import FGItemViewModal from './FGItemViewModal';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import ApplicationStore from '../../../Utility/localStorageUtil';
import { ViewFgItemLists } from '../../../ApiService/LoginPageService';
import { useNavigate } from 'react-router-dom';
import { useModuleLocks } from '../../context/ModuleLockContext';

const FGItemViewResult = (props) => {
    const [open, setOpen] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [fgViewLists, setViewFgLists] = useState([]);
    const [selectedRow, setSelectedRow] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const navigate = useNavigate();


    const { userDetails } = ApplicationStore()?.getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "FGItemViewResult");
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Map Customer PO DC")?.lockStatus === "locked";

    const columns = [
        {
            field: 'Sno',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    SNo
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'date',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    PO No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'fgitemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Customer Part No
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
    ];


    useEffect(() => {
        ViewFgItemLists(handleSucessShow, handleExceptionShow)
    }, [refreshData]);

    const handleSucessShow = (dataObject) => {
        const updatedData = (dataObject?.data || []).map((item, index) => ({
            ...item,
            Sno: index + 1
        }));
        setViewFgLists(updatedData);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleRowClick = (params) => {
        console.log("params", params);
        setSelectedRow(params?.row)
        setOpen(true);
    }

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginTop: '15px', marginBottom: '15px' }}>
                    <Typography style={{ fontWeight: 'bold', marginLeft: '18px' }}>Map Customer PO & DC</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button
                        disabled={isModuleLocked}
                        onClick={() => navigate('/FGItemList')} style={{ marginRight: '18px', backgroundColor: isModuleLocked ? "gray" : '#002d68', borderRadius: '20px' }} variant="contained">Add FG Item</Button>
                </Grid>
            </Grid>

            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '98%', height: '100%' }}>
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
                                rows={fgViewLists}
                                columns={columns}
                                pageSize={8}
                                onRowClick={handleRowClick}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ border: 'none', }}
                                sx={{
                                    overflow: 'auto',
                                    height: '68vh',
                                    width: '100%',
                                    cursor: 'pointer',
                                    '& .super-app-theme--header': {
                                        WebkitTextStrokeWidth: '0.6px',

                                    },
                                    '& .MuiDataGrid-cell': {
                                        border: '1px solid #969696',
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        border: '1px solid #969696',
                                    },
                                }}
                                getRowClassName={(params) => {
                                    const rowIndex = fgViewLists.findIndex(row => row.id === params.row.id);
                                    if (rowIndex !== -1) {
                                        console.log(' ');
                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    }
                                    return '';
                                }}
                                rowHeight={40}
                                columnHeaderHeight={40}
                            />
                        </Box>
                    </CardContent>
                </Card>

            </div>

            <FGItemViewModal
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
                selectedRow={selectedRow}
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

export default FGItemViewResult;