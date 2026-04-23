import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Button, Card, CardContent, Tooltip, Paper, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import '../../App.css';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import ChecklistTemplateModule from './ChecklistTemplateModule';
import AddLayoutModule from './AddLayoutModule';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import ChecklistTemplateTitle from './ChecklistTemplateTitle';
import { DeleteTemplateList, ShowTemplate } from '../../ApiService/LoginPageService';


const ChecklistTemplateResult = (props) => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('');
    const [layoutModuleOpen, setLayoutModuleOpen] = useState(false);
    const [templateList, setTemplateList] = useState([]);
    const [seletcedRow, setSelectedRow] = useState('')

    const columns = [
        {
            field: 'name',
            headerName: 'Template Name',
            flex: 1.5,
            minWidth: 200,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box sx={{ fontWeight: 500, color: '#1e293b', width: '100%', textAlign: 'center' }}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 2,
            minWidth: 300,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box sx={{ color: '#1e293b', width: '100%', textAlign: 'center' }}>
                    {params.value}
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 300,
            align: 'center',
            headerAlign: 'center',
            getActions: (params) => [
                <Tooltip title="View Template">
                    <IconButton size="small" onClick={() => { }} sx={{ color: '#002D68' }}>
                        {/* <RemoveRedEyeIcon fontSize="small" /> */}
                    </IconButton>
                </Tooltip>,
                <Tooltip title="Edit Template">
                    <IconButton size="small" onClick={() => {
                        setIsAddButton(false);
                        setEditData(params.row);
                        setOpen(true);
                    }} sx={{ color: '#0369a1' }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>,
                <Tooltip title="Delete Template">
                    <IconButton size="small" onClick={() => {
                        setDeleteId(params.row.id);
                        setDeleteDailogOpen(true);
                    }} sx={{ color: '#be123c' }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>,
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        setSelectedRow(params.row)
                        setLayoutModuleOpen(true)
                    }}
                    sx={{
                        ml: 1,
                        background: 'linear-gradient(135deg, #002D68 0%, #004b93 100%)',
                        color: 'white',
                        textTransform: 'none',
                        borderRadius: '6px',
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(0, 45, 104, 0.2)',
                        }
                    }}
                >
                    Layout
                </Button>,
            ],
        },
    ];

    useEffect(() => {
        ShowTemplate(handleSucessShow, handleExceptionShow)
    }, [refreshData]);

    const handleSucessShow = (dataObject) => {
        setTemplateList(dataObject?.data || []);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {
        console.error(errorMessage);
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
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#f1f5f9', minHeight: '100vh' }}>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
            >
                <ChecklistTemplateTitle
                    setIsAddButton={setIsAddButton}
                    setEditData={setEditData}
                    setOpen={setOpen}
                />
                <Box sx={{ height: 600, width: '100%', bgcolor: 'white' }}>
                    <DataGrid
                        rows={templateList}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        disableSelectionOnClick
                        sx={{
                            border: 'none',
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: '#004286',
                                color: '#ffffff',
                                fontSize: '0.875rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                borderBottom: '1px solid #e2e8f0',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #f1f5f9',
                                py: 1.5,
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#f8fafc',
                            },
                            '& .MuiDataGrid-footerContainer': {
                                borderTop: '1px solid #e2e8f0',
                            },
                        }}
                    />
                </Box>
            </Paper>

            <ChecklistTemplateModule
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
                deleteService={DeleteTemplateList}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
            <AddLayoutModule
                setLayoutModuleOpen={setLayoutModuleOpen}
                layoutModuleOpen={layoutModuleOpen}
                seletcedRow={seletcedRow}
            />
        </Box>
    )
}

export default ChecklistTemplateResult
// const mapStateToProps = ({ config }) => {
//     const { name } = config;
//     return { name }
// }
// export default connect(mapStateToProps, { })(CustomerResult);