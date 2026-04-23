import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Card, CardContent, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SkillMatrixTools from './SkillMatrixTools';
import SkillMatrixModel from './SkillMatrixModel';
import { Showdata, Deletedata } from '../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import ApplicationStore from '../../Utility/localStorageUtil';
import SkillMatrixViewPdf from './SkillMatrixViewPdf';
import DownloadIcon from '@mui/icons-material/Download';
import SkillMatrixMultipleFile from './SkillMatrixMultipleFile';
import { useModuleLocks } from '../context/ModuleLockContext';

const SkillMatrixResult = () => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Shopfloor Documents")?.lockStatus === "locked";

    const [rows, setRows] = useState([]);
    const [isAddButton, setIsAddButton] = useState(true);
    const [isMultipleAddButton, setIsMultipleAddButton] = useState(true);
    const [editSkillMatrix, setEditSkillMatrix] = useState([]);
    const [open, setOpen] = useState(false);
    const [pdfOpen, setPdfOpen] = useState(false);
    const [skillMatrixpdfOpen, setSkillMatrixPdfOpen] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [isLoading, setGridLoading] = useState(true);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [dataShow, setDataShow] = useState([]);
    const [fileTypeForView, setFileTypeForView] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "dispatchlist");

    useEffect(() => {
        Showdata(handleShowdatasuccess, handeShowdataException);
    }, [refreshData]);

    const handleShowdatasuccess = (dataObject) => {
        setGridLoading(false);
        setRows(dataObject?.data || []);
    }

    const handeShowdataException = (errorStatus, errorMessage) => {
        console.log(errorMessage);
    }

    const columns = [
        {
            field: 'slno',
            headerClassName: 'super-app-theme--header',
            headerName: 'SI No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'machine',
            headerClassName: 'super-app-theme--header',
            headerName: 'Machine Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'revisionNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'Revision No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'fileType',
            headerClassName: 'super-app-theme--header',
            headerName: 'File Type',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'fileName',
            headerClassName: 'super-app-theme--header',
            headerName: 'File Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'revDate',
            headerClassName: 'super-app-theme--header',
            headerName: 'Revision Date',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'actions',
            headerClassName: 'super-app-theme--header',
            type: 'actions',
            flex: 1,
            headerName: 'Actions',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
                <ViewData selectedRow={params.row} />,

            ],
        },
    ];

    function EditData(props) {
        return (
            <Tooltip title="Edit">
                <EditIcon
                    style={{ color: isModuleLocked ? '#ccc' : '#000000' }}
                    onClick={(event) => {
                        // if (userPermission[0]?.updateData === 1) {
                        if (isModuleLocked) return;
                        event.stopPropagation();
                        setIsAddButton(false);
                        setEditSkillMatrix(props.selectedRow);
                        setOpen(true);
                        // }
                    }}
                />
            </Tooltip>
        );
    }

    function DeleteData(props) {
        return (
            <Tooltip title="Delete">
                <DeleteIcon
                    style={{ color: isModuleLocked ? '#ccc' : '#000000' }}
                    onClick={() => {
                        if (isModuleLocked) return;
                        setDeleteId(props.selectedRow.id);
                        console.log(props.selectedRow.id);
                        setDeleteDailogOpen(true);
                        // }
                    }
                    }
                />
            </Tooltip>
        );
    }

    function ViewData(props) {
        return (
            <Tooltip title="View">
                <VisibilityIcon
                    onClick={() => {
                        if (isModuleLocked) return;
                        setFileTypeForView(props.selectedRow.file);
                        console.log(props.selectedRow.id);
                        setPdfOpen(true);
                        // }

                    }

                    }
                    style={{ color: isModuleLocked ? '#ccc' : '#002D68' }}
                />
            </Tooltip>
        );
    }

    const handleDeleteSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setDeleteDailogOpen(false);
        }, 2000);
        setRefreshData(oldValue => !oldValue);
    }

    const handleDeleteException = (errorObject, message) => {
        console.log(message);
        setNotification({
            status: true,
            type: 'error',
            message: message,
        });
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <SkillMatrixTools
                setIsAddButton={setIsAddButton}
                setEditSkillMatrix={setEditSkillMatrix}
                setOpen={setOpen}
                setMultipleOpen={setSkillMatrixPdfOpen}
            />
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
                                rows={rows}
                                columns={columns}
                                pageSize={8}
                                // loading={isLoading}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ border: 'none', }}
                                sx={{
                                    overflow: 'auto',
                                    height: '50vh',
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
                                    const rowIndex = rows.findIndex(row => row.id === params.row.id);
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
            </div>
            <SkillMatrixModel
                isAddButton={isAddButton}
                editSkillMatrix={editSkillMatrix}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
                handleClose={handleClose}
                openNotification={openNotification}
                setNotification={setNotification}
            />

            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                deleteService={Deletedata}
                handleSuccess={handleDeleteSuccess}
                handleException={handleDeleteException}
            />

            <SkillMatrixViewPdf
                pdfOpen={pdfOpen}
                setPdfOpen={setPdfOpen}
                fileTypeForView={fileTypeForView} />

            <SkillMatrixMultipleFile
                open={skillMatrixpdfOpen}
                setOpen={setSkillMatrixPdfOpen}
                setRefreshData={setRefreshData}
            //   isAddButton={isMultipleAddButton}
            />
        </div>
    )
}

export default SkillMatrixResult

