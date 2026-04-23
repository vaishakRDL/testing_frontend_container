import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import ApplicationStore from '../../Utility/localStorageUtil';
import { useNavigate } from 'react-router-dom';
import { DownloadQualityDownloadTemplate, DownloadQualityReport } from '../../ApiService/DownloadCsvReportsService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { QualityImport } from '../../ApiService/LoginPageService';
import { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import { useModuleLocks } from '../context/ModuleLockContext';

const QualitySettingTitle = (props) => {
    const { setRefreshData } = props
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Quality Settings")?.lockStatus === "locked";


    const { userDetails } = ApplicationStore()?.getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "QualitySetting".toLowerCase());
    const navigate = useNavigate()
    const [file, setFile] = useState('');
    const [fileData, setFileData] = useState([]);
    const [importloading, setimportloading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const handleTemDownSuccess = () => {
        setNotification({
            status: true,
            type: 'success',
            message: 'Template Download Success',
        });

        setTimeout(() => {
            handleClose();
        }, 3000);
    }
    const handleTempDownException = () => {
        setNotification({
            status: true,
            type: 'error',
            message: 'Template Download Failed',
        });
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    // const handlePcnImportSuccess = (dataObject) => {
    //     setimportloading(false);

    //     // setViewData(dataObject?.data || []);
    //     // setPcnItems(dataObject?.data || []);
    //     setIsLoading(false);
    //     if (dataObject?.success === false) {
    //         // ApplicationStore().setStorage2("ErrorArrayList", dataObject?.errorArray);
    //         setNotification({
    //             status: true,
    //             type: 'error',
    //             message: dataObject?.message,
    //         });
    //         setTimeout(() => {
    //             // setIsError(false);
    //         }, 3000);
    //     } else {
    //         // const data = dataObject?.data || [];

    //         // // Check if any item has non-empty errorMessages
    //         // const hasErrorMessages = data.some(item => item.errorMessages && item.errorMessages.length > 0);
    //         // setHasErrors(hasErrorMessages);

    //         // setViewData(data);
    //         ""
    //     }
    // }


    const handleItemImportSucess = (dataObject) => {
        // setUploadLoader(false);
        setimportloading(false)
        setRefreshData(oldValue => !oldValue);
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
        setimportloading(false)
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // setUploadLoader(false);
            handleClose();
        }, 2000);
    }

    const DownloadCsv = () => {
        // setEnableDownload(true);
        DownloadQualityReport(appQualityExportSuccess, appQualityExportException);
    };

    const appQualityExportSuccess = (dataObject) => {
        // setUploadLoader(false);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const appQualityExportException = (errorObject, errorMessage) => {
        // setimportloading(false)
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // setUploadLoader(false);
            // handleClose();
        }, 2000);
    }
    return (
        <Box
            sx={{
                mb: '10px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
            }}
        >
            <Typography
                sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                variant="h5"
            >
                Quality Rule
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        columnGap: '10px'
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: isModuleLocked ? 'gray' : '#002D68', height: '40px', width: '150px', borderRadius: '30px' }}
                        onClick={() => DownloadQualityDownloadTemplate(handleTemDownSuccess, handleTempDownException)}
                        disabled={isModuleLocked}
                    >                            <DownloadIcon sx={{ mr: 1 }} />

                        Template
                    </Button>

                    <input
                        id="upload-photo"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                const selectedFile = e.target.files[0];
                                setFileData(selectedFile.name);
                                const reader = new FileReader();
                                reader.onload = () => {
                                    if (reader.readyState === 2) {
                                        setFile(reader.result);
                                        setIsLoading(true);
                                        setimportloading(true);
                                        QualityImport({
                                            file: reader.result || []
                                        }, handleItemImportSucess, handleItemImportException);
                                    }
                                };
                                reader.readAsDataURL(e.target.files[0]);
                                e.target.value = '';
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        component="label"
                        htmlFor="upload-photo"
                        sx={{ backgroundColor: isModuleLocked ? 'gray' : '#002D68', height: '40px', width: '150px', borderRadius: '30px' }}
                        disabled={importloading || isModuleLocked}
                    >                            <ImportExportIcon sx={{ mr: 1 }} />
                        {importloading ? (
                            <CircularProgress size={24} style={{ color: 'white' }} />
                        ) : (
                            'Import'
                        )}
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#002D68', height: '40px', width: '150px', borderRadius: '30px' }}
                        onClick={() => {
                            DownloadCsv();
                        }}                    >                            <DownloadIcon sx={{ mr: 1 }} />

                        Downlaod
                    </Button>
                </Grid>
                <Box>
                    <Stack direction="row" spacing={2}>
                        <Fab
                            style={{ width: '100%', background: userPermission[0]?.addData === 0 || isModuleLocked ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                            disabled={userPermission[0]?.addData === 0 || isModuleLocked}
                            onClick={() => { navigate('/QualitySettingMapResult') }}
                            variant="extended" size="medium" color="primary" aria-label="add">
                            <AddIcon sx={{ mr: 1 }} />
                            Map Inspection Batch Qty
                        </Fab>
                    </Stack>
                </Box>
                <Box>
                    <Stack direction="row" spacing={2}>
                        <Fab
                            style={{ width: '100%', background: userPermission[0]?.addData === 0 || isModuleLocked ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                            disabled={userPermission[0]?.addData === 0 || isModuleLocked}
                            onClick={() => {
                                props.setIsAddButton(true);
                                props.setEditData([]);
                                props.setOpen(true);
                            }}
                            variant="extended" size="medium" color="primary" aria-label="add">
                            <AddIcon sx={{ mr: 1 }} />
                            Add Quality Rule
                        </Fab>
                    </Stack>
                </Box>


            </div>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Box>

    )
}

export default QualitySettingTitle