import {
    Button, Box, Dialog, Tooltip, CircularProgress, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment, Card, Autocomplete,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AddHoliday, AddHolidayUpdate, ItemSearchNAAJ, NpdAddData, NpdExlImport, NpdFileTypeShow, NpdFileUpload, NpdGetIdData, NpdUpdateData, SobUpdate, } from '../../ApiService/LoginPageService';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from "@mui/icons-material/Search";
import { DownloadNpdExlTemplate } from '../../ApiService/DownloadCsvReportsService';
import axios from 'axios';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

const MkdModule = ({ open, setOpen, isAddButton, editData, setRefreshData, isDrawing }) => {
    const [fileloading, setFileLoading] = useState(false);

    const [holiday, setHoliday] = useState('');
    const [holidayOccasion, setHolidayOccasion] = useState('');
    const [cnNo, setCnNo] = useState('');
    const [fileType, setFileType] = useState('');
    const [file, setFile] = useState('');
    const [fileAuto, setFileAuto] = useState('');
    const [revisionNo, setRevisionNo] = useState('');
    const [revisionDate, setRevisionDate] = useState('');
    const [itemShowListSeach, setItemShowListSeach] = useState([]);
    const [partNo, setPartNo] = useState('');
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [sobDataList, setSobDataList] = useState([]);
    const [type, setType] = useState('MKD');

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (open) {

            NpdGetIdData(NpdGetIdDataSucess, NpdGetIdDataException);
            NpdFileTypeShow(handleSobShowDataSuccess, handleSobShowDataException);
        }
    }, [editData, open]);

    const handleSobShowDataSuccess = (dataObject) => {
        setSobDataList(dataObject?.data || []);
    }

    const handleSobShowDataException = (errorObject, errorMessage) => {

    }

    const NpdGetIdDataSucess = (dataObject) => {
        setFileAuto(dataObject?.fileId || '');
        setRevisionNo(dataObject?.revisionNo || '')
    }

    const NpdGetIdDataException = () => {

    }

    const ClearData = () => {
        setHoliday('');
        setHolidayOccasion('');
        setDataList([]);

    }

    const handleSubmit = (e) => {
        setFileLoading(true)
        e.preventDefault();
        if (isDrawing) {
            NpdAddData({
                fileId: fileAuto,
                itemId: partNo,
                cnNo: cnNo,
                fileType: fileType,
                revisionNo: revisionNo,
                revDate: revisionDate,
                file: file,
                type: type
            }, handleNpDAddSuccess, handlenPDAddException);
        } else {
            setNotification({
                status: true,
                type: 'success',
                message: 'Add Multiple File Success..!',
            });
            setTimeout(() => {
                handleClose();
                setOpen(false);
                setDataList([]);
                setRefreshData((oldvalue) => !oldvalue);
            }, 2000);
        }

    }

    const handleNpDAddSuccess = (dataObject) => {
        setFileLoading(false)

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setOpen(false);
            ClearData();
        }, 3000);
    }

    const handlenPDAddException = () => {
        setFileLoading(false)

    }
    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

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
                <ViewItem selectedRow={params.row} />,
                // <DeleteData selectedRow={params.row} />,
            ],
        },
    ];

    function ViewItem(props) {
        return (
            <RemoveRedEyeIcon
                style={{ color: 'black' }}
                onClick={(event) => {

                }}
            />
        );
    }

    const options = itemShowListSeach.map(item => ({
        id: item?.id,
        label: item?.label
    }));


    const handleAutocompleteChange = (selectedValue) => {
        setPartNo(selectedValue?.id || '');
    };

    const textEntery = (e) => {
        ItemSearchNAAJ({
            text: e.target.value
        }, handleItemSearchNAAJSucees, handleItemSearchNAAJException);
    }

    const handleItemSearchNAAJSucees = (dataObject) => {
        setItemShowListSeach(dataObject?.data || []);
    }

    const handleItemSearchNAAJException = () => {

    }

    const DownloadNpdExlTemplateSuccess = () => {

    }

    const DownloadNpdExlTemplateExption = () => { }

    const NpdExlImportSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }

    const NpdExlImportException = () => {

    }

    const handleFolderUpload = async () => {
        const filesData = [];
        for (const file of selectedFolder) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Data = event.target.result;
                filesData.push({ name: file.name, data: base64Data });
                if (filesData.length === selectedFolder.length) {
                    uploadFiles(filesData);
                    NpdFileUpload({
                        filesData: filesData
                    }, NpdFileUploadSuccess, NpdFileUploadException);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const NpdFileUploadSuccess = (dataObject) => {
        setDataList(dataObject?.data || []);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setSelectedFolder('');
        }, 2000);
    }

    const NpdFileUploadException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
    }

    const uploadFiles = async (filesData) => {
        try {
            // await axios.post('/upload', { files: filesData });
            console.log('Files uploaded successfully', filesData);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const handleFolderChange = (event) => {
        setSelectedFolder(event.target.files);
        console.log("event.target.files", event.target.files)
    };


    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isDrawing ? 'Add File' : 'Add Multiple File'}

            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    {isDrawing ?
                        (
                            <Grid container spacing={2}>
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
                                            }}
                                        >
                                            <FormControlLabel value="MKD" control={<Radio />} label="MKD" />
                                            {/* <FormControlLabel value="NPD" control={<Radio />} label="NPD" /> */}
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12} lg={1.8} xl={1.8}>
                                    <TextField
                                        fullWidth
                                        label="File Id"
                                        placeholder='File Id'
                                        variant="filled"
                                        size='small'
                                        value={fileAuto}
                                        InputLabelProps={{ shrink: true }}
                                    // required

                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} lg={4} xl={4}>
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
                                </Grid>
                                <Grid item xs={12} sm={12} lg={4} xl={4}>
                                    <TextField
                                        fullWidth
                                        label="CN No"
                                        placeholder='CN No'
                                        variant="filled"
                                        size='small'
                                        value={cnNo}
                                        onChange={(e) => {
                                            setCnNo(e.target.value);
                                        }}
                                    // required

                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} lg={3} xl={3}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">File Type</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            variant="filled"
                                            label='File Type'
                                            size='small'
                                            value={fileType}
                                            onChange={(e) => {
                                                setFileType(e.target.value);
                                            }}
                                        >
                                            {sobDataList.map((data) => (
                                                <MenuItem key={data.id} value={data.fileType}>{data.fileType}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                </Grid>
                                <Grid item xs={12} sm={12} lg={3} xl={3}>
                                    <TextField
                                        fullWidth
                                        label="Revision No"
                                        placeholder='Revision No'
                                        variant="filled"
                                        size='small'
                                        value={revisionNo}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => {
                                            setRevisionNo(e.target.value);
                                        }}
                                    // required

                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} lg={3} xl={3}>
                                    <TextField
                                        fullWidth
                                        label="Revision Date"
                                        placeholder="Revision Date"
                                        variant="filled"
                                        size="small"
                                        type="date"
                                        value={revisionDate}
                                        InputLabelProps={{ shrink: true }}
                                        onChange={(e) => setRevisionDate(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} lg={3} xl={3}>
                                    <TextField
                                        fullWidth
                                        style={{
                                            // margin: '10px'
                                        }}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    if (reader.readyState === 2) {
                                                        setFile(reader.result);

                                                    }
                                                };
                                                reader.readAsDataURL(e.target.files[0]);
                                            }
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        type="file" />
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} lg={3} xl={3} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Button
                                        variant="contained"
                                        style={{ width: '250px', background: '#002D68', color: 'white' }}
                                        onClick={(e) => {
                                            DownloadNpdExlTemplate(DownloadNpdExlTemplateSuccess, DownloadNpdExlTemplateExption);
                                        }}
                                    >
                                        Download Template
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={12} lg={3} xl={3}>
                                    <TextField
                                        fullWidth
                                        style={{
                                            // margin: '10px'
                                        }}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    if (reader.readyState === 2) {
                                                        NpdExlImport({
                                                            file: reader.result
                                                        }, NpdExlImportSuccess, NpdExlImportException);
                                                    }
                                                };
                                                reader.readAsDataURL(e.target.files[0]);
                                            }
                                        }}
                                        label='Upload CSV'
                                        InputLabelProps={{ shrink: true }}
                                        type="file" />
                                </Grid>
                                <Grid item xs={12} sm={12} lg={6} xl={6} style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <TextField
                                        type="file"
                                        style={{ width: '300px' }}
                                        InputProps={{ inputProps: { directory: '', webkitdirectory: '' } }}
                                        onChange={handleFolderChange}
                                    />
                                    <Button
                                        variant="contained"
                                        style={{ width: '150px', marginLeft: '20px' }}
                                        onClick={handleFolderUpload}
                                        disabled={!selectedFolder} // Disable the button if no folder selected
                                    >
                                        Upload Folder
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={12} lg={12} xl={12}>
                                    <Card style={{ borderRadius: '8px', height: '300px', marginTop: '10px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                                        <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <DataGrid
                                                rows={dataList}
                                                columns={columns}
                                                pageSize={8}
                                                // loading={isLoading}
                                                rowsPerPageOptions={[8]}
                                                disableSelectionOnClick
                                                style={{ border: 'none', fontWeight: 'bold' }}
                                                sx={{
                                                    overflow: 'auto',
                                                    height: '30vh',
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
                                                    const rowIndex = dataList.findIndex(row => row.id === params.row.id);
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
                        )


                    }
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '200px', background: '#002D68', color: 'white' }}
                        type='submit'
                        disabled={fileloading}
                    >
                        {fileloading ? (
                            <CircularProgress size={24} style={{ color: 'white' }} />
                        ) : (
                            isDrawing ? 'Add File' : 'Add Multiple File'
                        )}
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);
                            ClearData();
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
                <NotificationBar
                    handleClose={handleClose}
                    notificationContent={openNotification.message}
                    openNotification={openNotification.status}
                    type={openNotification.type}
                />

            </form>
        </Dialog>
    )
}

export default MkdModule
