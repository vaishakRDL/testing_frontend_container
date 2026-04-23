import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Button, Card, CircularProgress, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DeleteHoliday, NpdDataDelete, NpdSearch, NpdShowData, ShowHoliday } from '../../ApiService/LoginPageService';
import NpdModule from './NpdModule';
import NpdTitle from './NpdTitle';
import EditNpdModule from './EditNpdModule ';
import DeleteConfirmationDailogNpd from '../../Utility/confirmDeletionNpd';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PDFViewer from '../../Utility/PDFViiewer';
import { NpdDocDownload, NpdExlReportDownload } from '../../ApiService/DownloadCsvReportsService';
import ApplicationStore from '../../Utility/localStorageUtil';
import { useModuleLocks } from '../context/ModuleLockContext';

const NpdResult = () => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Create NPD File")?.lockStatus === "locked";

    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [isDrawing, setIsDrawing] = useState(true);
    const [editData, setEditData] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [masterData, serMasterData] = useState([]);
    const [downloadloading, setdownloadloading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [selectedItemNo, setSelectedItemNo] = useState('0');
    const [selectedRevision, setSelectedRevision] = useState('0');
    const [deleteId, setDeleteId] = useState('');
    const [sobDataList, setSobDataList] = useState([]);
    const [type, setType] = useState('MKD');
    const [isTimeSlot, setIsTimeSlot] = useState(0);
    const [dataShow, setDataShow] = useState([]);

    const [editOpen, setEditOpen] = useState(false);
    //NEW STATE VARIBALES
    const [selectedMaster, setSelectedMaster] = useState('pm');
    const [partNo, setPartNo] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [pdfOpen, setPdfOpen] = useState(false);
    const [fileTypeForView, setFileTypeForView] = useState('');

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "npddocument");

    useEffect(() => {
        NpdShowData({
            itemId: partNo,
            type: type
        }, NpdShowDataSuccess, NpdShowDataException);
    }, [refreshData, partNo])

    const NpdShowDataSuccess = (dataObject) => {
        setDataShow(dataObject?.data || []);
    }

    const NpdShowDataException = () => {

    }
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
                    Part No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'cnNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                CN No
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
            field: 'revisionNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Revision
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
            field: 'actions',
            type: 'actions',
            headerClassName: 'super-app-theme--header',
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
                <ViewdData selectedRow={params.row} />,
            ],
        },
    ];

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: userPermission[0]?.updateData === 0 || isModuleLocked ? 'gray' : '#000000' }}
                onClick={() => {
                    if (userPermission[0]?.updateData === 1 && !isModuleLocked) {
                        setEditOpen(true);
                        // setIsAddButton(false);
                        setEditData(props.selectedRow);
                    }
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                style={{ color: userPermission[0]?.deleteData === 0 || isModuleLocked ? 'gray' : '#000000' }}
                onClick={() => {
                    if (userPermission[0]?.deleteData === 1 && !isModuleLocked) {
                        setDeleteId(props.selectedRow.id);
                        setDeleteDailogOpen(true);
                        setSelectedItemNo(props?.selectedRow?.item || '0');
                        setSelectedRevision(props?.selectedRow?.revision || '0');
                    }
                }}

            />
        );
    }

    function ViewdData(props) {
        return (
            <RemoveRedEyeIcon
                onClick={() => {
                    if (isModuleLocked) {
                        return;
                    }
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
                style={{ color: isModuleLocked ? 'gray' : '#002D68' }}
            />
        );
    }

    const DownloadSuccess = () => {

    }

    const DownloadException = () => {

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


    const options = sobDataList.map(item => ({
        id: item?.id,
        label: item?.label
    }));

    const handleAutocompleteChange = (selectedValue) => {
        setPartNo(selectedValue?.id || '');
    };

    const textEntery = (e) => {
        NpdSearch({
            text: e.target.value
        }, handleNpdSearchSuccess, handleNpdSearchException);

    }

    const handleNpdSearchSuccess = (dataObject) => {
        setSobDataList(dataObject?.data || []);
    }

    const handleNpdSearchException = () => {

    }

    const handleNpdExlReportDownload = () => {
        setdownloadloading(false)

    }

    const handleNpdExlReportDownloadException = () => {
        setdownloadloading(false)

    }

    return (
        <div style={{ height: '80vh', width: '98%', marginLeft: '15px' }}>
            <NpdTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
                setIsDrawing={setIsDrawing}

            />
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '-20px' }}>

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
                                renderInput={(params) => <TextField value={partNo} variant="filled" {...params} label="Select Part No"
                                    onChange={textEntery}
                                />}
                                onChange={(event, value) => handleAutocompleteChange(value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} lg={2.2} xl={2.2}
                        style={{
                            display: 'flex',
                            alignIItems: 'center',
                            justifyContent: 'center'

                        }}>
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value);
                                    NpdShowData({
                                        itemId: '',
                                        type: e.target.value
                                    }, NpdShowDataSuccess, NpdShowDataException);
                                }}
                            >
                                <FormControlLabel value="MKD" control={<Radio />} label="MKD" />
                                <FormControlLabel value="NPD" control={<Radio />} label="NPD" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} lg={2.2} xl={2.2}
                        style={{
                            display: 'flex',
                            alignIItems: 'center',
                            justifyContent: 'center'

                        }}>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            disabled={downloadloading}
                            onClick={(e) => {
                                setdownloadloading(true)
                                NpdExlReportDownload({
                                    type: type
                                }, handleNpdExlReportDownload, handleNpdExlReportDownloadException);
                            }}
                        >
                            {downloadloading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (
                                'Download'
                            )}
                        </Button>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                        <Card style={{ borderRadius: '8px', height: '100%', marginTop: '-5px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                            <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <DataGrid
                                    rows={dataShow}
                                    columns={columns}
                                    pageSize={8}
                                    // loading={isLoading}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ fontWeight: 'bold' }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '60vh',
                                        // minHeight: '500px',
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
                                        const rowIndex = dataShow.findIndex(row => row.id === params.row.id);
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

            <NpdModule
                isAddButton={isAddButton}
                editData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
                isDrawing={isDrawing}
            />

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <DeleteConfirmationDailogNpd
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                deleteService={NpdDataDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
                selectedItemNo={selectedItemNo}
                selectedRevision={selectedRevision}
            />
            <EditNpdModule
                editOpen={editOpen}
                setEditOpen={setEditOpen}
                editData={editData}
            />
            <PDFViewer
                pdfOpen={pdfOpen}
                setPdfOpen={setPdfOpen}
                fileTypeForView={fileTypeForView}
            />
        </div>
    )
}

export default NpdResult
