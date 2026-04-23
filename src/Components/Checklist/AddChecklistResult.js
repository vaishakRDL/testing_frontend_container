import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import '../../App.css';
import AddChecklistTitle from './AddChecklistTitle';
import AddChecklistModule from './AddChecklistModule';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import AssignModule from './AssignModule';
import ViewModal from './ViewModal';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { ChecklistDelete, ShowCheckList } from '../../ApiService/LoginPageService';
import { ExportChecklistMaster } from '../../ApiService/DownloadCsvReportsService';



const AddChecklistResult = (props) => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [id, setId] = useState('');
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('');
    const [checklistShow, setChecklistShow] = useState([]);
    const [uploadLoader, setUploadLoader] = useState(false);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [selectedRow, setSelectedRow] = useState('');

    const columns = [
        {
            field: 'checklist_name',
            headerName: 'Checklist Name',
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
            field: 'document_version',
            headerName: 'Version',
            flex: 0.8,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box sx={{ color: '#1e293b', width: '100%', textAlign: 'center' }}>
                    {params.value}
                </Box>
            )
        },
        // {
        //     field: 'created_at',
        //     headerName: 'Created Date',
        //     flex: 1.1,
        //     minWidth: 180,
        //     align: 'center',
        //     headerAlign: 'center',
        //     renderCell: (params) => (
        //         <Box sx={{ color: '#1e293b', width: '100%', textAlign: 'center' }}>
        //             {params.value}
        //         </Box>
        //     )
        // },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 320,
            align: 'center',
            headerAlign: 'center',
            getActions: (params) => [
                <Tooltip title="Download Checklist">
                    <IconButton
                        size="small"
                        onClick={() => {
                            // Call download API with the row's ID
                            ExportChecklistMaster({ id: params.row.id }, handleDownloadSuccess, handleDownloadException);
                        }}
                        sx={{ color: '#002D68' }}
                    >
                        <DownloadIcon fontSize="small" />
                    </IconButton>
                </Tooltip>,
                <Tooltip title="Edit Checklist">
                    <IconButton
                        size="small"
                        onClick={() => {
                            setIsAddButton(false);
                            setEditData(params.row);
                            setOpen(true);
                        }}
                        sx={{ color: '#0369a1' }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>,
                <Tooltip title="Delete Checklist">
                    <IconButton
                        size="small"
                        onClick={() => {
                            setDeleteId(params.row.id);
                            setDeleteDailogOpen(true);
                        }}
                        sx={{ color: '#be123c' }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>,
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        setSelectedRow(params.row)
                        setAssignModalOpen(true)
                    }}
                    sx={{
                        ml: 1,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        textTransform: 'none',
                        borderRadius: '6px',
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                        }
                    }}
                >
                    Assign
                </Button>,
            ],
        },
    ];

    useEffect(() => {
        ShowCheckList(handleSucessShow, handleExceptionShow)
    }, [refreshData, props.refreshData]);

    const handleSucessShow = (dataObject) => {
        setChecklistShow(dataObject?.data || []);
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
        }, 3000);
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleDownloadSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject?.message || 'Downloaded successfully!',
        });
        setTimeout(() => handleClose(), 3000);
    };

    const handleDownloadException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage || 'Failed to download checklist.',
        });
        setTimeout(() => handleClose(), 3000);
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
                <AddChecklistTitle
                    setIsAddButton={setIsAddButton}
                    setEditData={setEditData}
                    setOpen={setOpen}
                    setUploadLoader={setUploadLoader}
                    uploadLoader={uploadLoader}
                />
                <Box sx={{ height: 620, width: '100%', bgcolor: 'white' }}>
                    <DataGrid
                        rows={checklistShow}
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
                    // getRowId={(row) => row.checklistid}
                    />
                </Box>
            </Paper>

            <AddChecklistModule
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
                deleteService={ChecklistDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
            <AssignModule
                assignModalOpen={assignModalOpen}
                setAssignModalOpen={setAssignModalOpen}
                setRefreshData={setRefreshData}
                selectedRow={selectedRow}
            />
            <ViewModal
                viewModalOpen={viewModalOpen}
                setViewModalOpen={setViewModalOpen}
                setRefreshData={setRefreshData}
                selectedRow={selectedRow}
            />
        </Box>
    )
}

export default AddChecklistResult
