import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Button, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DeleteHoliday, NpdDltLogShow, ShowHoliday } from '../../ApiService/LoginPageService';

import DeleteLogTitle from './DeleteLogTitle';
import { NpdDocDownload } from '../../ApiService/DownloadCsvReportsService';
import PDFViewer from '../../Utility/PDFViiewer';

const DeletLog = () => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [isDrawing, setIsDrawing] = useState(true);
    const [editData, setEditData] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [masterData, serMasterData] = useState([]);

    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(true);
    const [selectedItemNo, setSelectedItemNo] = useState('0');
    const [selectedRevision, setSelectedRevision] = useState('0');
    const [deleteId, setDeleteId] = useState('');
    const [deleteLogData, setDeleteLogData] = useState([]);
    const [isTimeSlot, setIsTimeSlot] = useState(0);

    const [editOpen, setEditOpen] = useState(false);
    //NEW STATE VARIBALES
    const [selectedMaster, setSelectedMaster] = useState('pm');
    //
    const [pdfOpen, setPdfOpen] = useState(false);
    const [fileTypeForView, setFileTypeForView] = useState('');


    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

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
            field: 'item',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'fileType',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                File Type
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'deleted_at',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Deleted Date
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'deletedBy',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Deleted By
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'revisionNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Revision No
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'revDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Revision Date
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'reason',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Reason
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
                <ViewdData selectedRow={params.row} />,

            ],
        },
    ];

    function ViewdData(props) {
        return (
            <RemoveRedEyeIcon
                onClick={() => {
                    const fileName = props.selectedRow.file;
                    const fileExtension = fileName.split('.').pop().toLowerCase();
                    console.log("fileExtension===>", fileExtension);

                    if (fileExtension === 'xlsx' || fileExtension === 'tif') {

                        NpdDocDownload({
                            id: props.selectedRow.id,
                            fileExtension: fileExtension !== 'xlsx' ? 'tif' : 'xlsx'
                        }, DownloadSuccess, DownloadException);
                    } else {
                        setPdfOpen(true);
                        setFileTypeForView(props.selectedRow.file);
                    }
                }}
                style={{ color: '#002D68' }}
            />
        );
    }

    const DownloadSuccess = () => {

    }

    const DownloadException = () => {

    }


    useEffect(() => {
        NpdDltLogShow(handleSobShowDataSuccess, handleSobShowDataException);
    }, [refreshData]);

    const handleSobShowDataSuccess = (dataObject) => {
        setDeleteLogData(dataObject?.data || []);
    }

    const handleSobShowDataException = (errorObject, errorMessage) => {

    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: 'black' }}
                onClick={(event) => {
                    setOpen(true);
                    setIsAddButton(false);
                    setEditData(props.selectedRow);
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
                    setSelectedItemNo(props?.selectedRow?.item || '0');
                    setSelectedRevision(props?.selectedRow?.revision || '0');
                }}
                style={{ color: 'black' }}
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

    const handleSucessShow = (dataObject) => {
        serMasterData(dataObject?.data || []);
        setGridLoading(false);
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
            // handleClose();
        }, 3000);
    };


    const options = deleteLogData.map(item => ({
        id: item?.id,
        label: item?.itemId
    }));


    const handleAutocompleteChange = (selectedValue) => {
        // const selectedItem = itemShowList.find(item => item.id === selectedValue?.id);
        // setItemShowList(selectedItem ? [selectedItem] : []);
        // setItemSelected(selectedValue?.id)

    };
    const textEntery = (e) => {

        // ItemSearchNAAJ({
        //     text: e.target.value
        // }, handleItemSearchNAAJSucees, handleItemSearchNAAJException);

    }
    return (
        <div style={{ height: '80vh', width: '98%', marginLeft: '15px' }}>
            <DeleteLogTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
                setIsDrawing={setIsDrawing}

            />
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '-10px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <FormControl style={{ width: '100%' }}>
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="combo-box-demo"
                                size='small'
                                options={options}
                                // sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Search By Item Code "
                                    onChange={textEntery}
                                />}
                                onChange={(event, value) => handleAutocompleteChange(value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                        <Card style={{ borderRadius: '8px', height: '100%', marginTop: '-5px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                            <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <DataGrid
                                    rows={deleteLogData}
                                    columns={columns}
                                    pageSize={8}
                                    // loading={isLoading}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none', fontWeight: 'bold' }}
                                    sx={{
                                        overflow: 'auto',
                                        maxHeight: '60vh',
                                        // minHeight: '50vh',
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
                                        const rowIndex = deleteLogData.findIndex(row => row.id === params.row.id);
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
                    </Grid>
                </Grid>

            </div>

            <PDFViewer
                pdfOpen={pdfOpen}
                setPdfOpen={setPdfOpen}
                fileTypeForView={fileTypeForView}
            />

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            {/* <DeleteConfirmationDailogNpd
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                deleteService={DeleteHoliday}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
                selectedItemNo={selectedItemNo}
                selectedRevision={selectedRevision}
            /> */}

        </div>
    )
}

export default DeletLog
