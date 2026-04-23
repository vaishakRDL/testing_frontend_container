import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ExcelTemplateDownloader from '../../ApiService/ExcelTemplateDownloader';
import { DownloadSobExlTemplate, DownloadSupExcelTemplate, partvstoolvsExlTemplate } from '../../ApiService/DownloadCsvReportsService';
import { AddToolListImport, PartNoVsProcessEntry, PartNoVsProcessSearch, ProcessToolList, SobExlImport, SupExcelImport } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';

const ProcessVsTool = (props) => {
    const [file, setFile] = useState(null);
    const [importloading, setimportloading] = useState(false);
    const [generatedCustDcLists, setGeneratedCustDcLists] = useState([]);
    const [toolNo, setToolNo] = useState('');

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (!toolNo) {
            ProcessToolList(handleSobShowDataSuccess, handleSobShowDataException);
        }
    }, [toolNo])
    const handleFileUpload = () => {
        // Handle the uploaded file here
    };

    const handleSobShowDataSuccess = (dataObject) => {
        props.setSobDataList(dataObject?.data || [])
    }

    const handleSobShowDataException = () => {

    }

    const DownloadSupExcelTemplateSuccess = () => {

    }

    const DownloadSupExcelTemplateException = () => {

    }
    const SupExcelImportSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setFile('');
        }, 5000);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleItemImportSucess = (dataObject) => {
        // setUploadLoader(false);
        setimportloading(false)
        // setRefreshData(oldvalue => !oldvalue);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const handleItemImportException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setimportloading(false)
            // handleClose();
        }, 2000);
    }
    const handlePOChange = (e) => {
        PartNoVsProcessEntry({ code: e.target.value }, handleGeneratedPoSucessShow, handleGeneratedPoExceptionShow);
    };
    const handleGeneratedPoSucessShow = (dataObject) => {
        setGeneratedCustDcLists(dataObject?.data || []);
    }
    const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => {
    }
    const handleGeneratedPoSelect = (selectedValue) => {
        console.log("q1w2selectedValue", selectedValue);
        setToolNo(selectedValue)
        // setIsPoView(true)
        if (selectedValue !== null) {
            // GstViewing({ id: selectedValue.id }, handleActionSuccess, handleActionException);
            PartNoVsProcessSearch({ id: selectedValue.id }, handleActionSuccess, handleActionException);
        }
    }
    const handleActionSuccess = (dataObject) => {
        props.setSobDataList(dataObject?.data || [])

    }
    const handleActionException = () => {

    }
    return (
        <Box
            sx={{
                mb: '10px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginLeft: '10px',
                marginRight: '10px'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '10px' }}>
                <Typography
                    sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5"
                >
                    Process Vs Tools
                </Typography>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={generatedCustDcLists}
                    fullWidth
                    sx={{ width: 300 }}
                    value={toolNo}
                    getOptionLabel={(option) => option.toolNo || /*selectedGeneratedPo*/''}
                    renderInput={(params) => <TextField {...params} label="Search ToolNo" onChange={handlePOChange} />}
                    onChange={(event, value) => handleGeneratedPoSelect(value)}
                    size="small"
                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                />
            </div>
            <Box
                sx={{ m: 1 }}
            >
                <Grid container alignItems={'center'} spacing={2}>

                    <Grid item>
                        <div>
                            <Button
                                variant="contained"
                                // color="primary"
                                component="label"
                                sx={{ marginRight: '16px', backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
                                onClick={() => {
                                    partvstoolvsExlTemplate(DownloadSupExcelTemplateSuccess, DownloadSupExcelTemplateException);
                                }}
                            >
                                Download Template
                            </Button>
                            {/* <ExcelTemplateDownloader /> */}

                            <input
                                id="upload-photo"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            if (reader.readyState === 2) {
                                                setFile(reader.result);
                                                setimportloading(true)
                                                AddToolListImport({
                                                    file: reader.result || []
                                                }, handleItemImportSucess, handleItemImportException);
                                            }
                                        };
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }}
                            />

                            <Button
                                variant="contained"
                                component="label"
                                htmlFor="upload-photo"
                                disabled={importloading}
                                sx={{ backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
                            >
                                {importloading ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : (
                                    'import'
                                )}
                            </Button>

                        </div>
                    </Grid>

                    <Grid item>
                        <Stack direction="row" spacing={2}
                            onClick={() => {
                                props.setIsAddButton(true);
                                props.setEditData([]);
                                props.setOpen(true);
                            }}>
                            <Fab
                                style={{ background: '#002D68', color: 'white' }}
                                variant="extended" size="medium" color="primary" aria-label="add">
                                <AddIcon sx={{ mr: 1 }} />
                                Add Process Vs Tools
                            </Fab>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Box>
    )
}

export default ProcessVsTool
