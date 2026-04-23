import { Box, Typography, CircularProgress, Button, Grid, } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ApplicationStore from '../../Utility/localStorageUtil';
import { Link } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { useState } from 'react';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { DownloadMapInspectionReport, DownloadMapInspectionTemplate } from '../../ApiService/DownloadCsvReportsService';
import { MapInflectQualityImport, QualityImport } from '../../ApiService/LoginPageService';


const QualitySettingMapTitle = (props) => {
    const { setRefreshData } = props

    const { userDetails } = ApplicationStore()?.getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "suppliermaster");
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
    const handleItemImportSucess = (dataObject) => {
        // setUploadLoader(false);
        setimportloading(false)
        setRefreshData(oldvalue => !oldvalue);
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

    const DownloadCsv = () => {
        // setEnableDownload(true);
        DownloadMapInspectionReport(appQualityExportSuccess, appQualityExportException);
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
            handleClose();
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
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Link to='/QualitySetting' style={{ textDecoration: 'none' }}>
                    <Typography
                        sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                        variant="h5"
                    >
                        {`Quality Rule>>`}
                    </Typography>
                </Link>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5"
                >
                    Map Inspection Batch Qty
                </Typography>
            </div>

            <Box
                sx={{
                    mb: '10px',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                }}
            >
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
                        sx={{ backgroundColor: '#002D68', height: '40px', width: '150px', borderRadius: '30px' }}
                        onClick={() => {
                            DownloadMapInspectionTemplate(handleTemDownSuccess, handleTempDownException)

                        }
                        }
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
                                        MapInflectQualityImport({
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
                        sx={{ backgroundColor: '#002D68', height: '40px', width: '150px', borderRadius: '30px' }}
                        disabled={importloading}
                    >                            <ImportExportIcon sx={{ mr: 1 }} />
                        {importloading ? (
                            <CircularProgress size={24} style={{ color: 'white' }} />
                        ) : (
                            'Import'
                        )}
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#002D68', height: '40px', width: '150px', borderRadius: '30px', mr: 2 }}
                        onClick={() => {
                            DownloadCsv();
                        }}                    >                            <DownloadIcon sx={{ mr: 1 }} />

                        Downlaod
                    </Button>
                </Grid>
                <Stack direction="row" spacing={2}>
                    <Fab
                        style={{ width: '100%', background: userPermission[0]?.addData === 0 ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                        disabled={userPermission[0]?.addData === 0}
                        onClick={() => {
                            props.setIsAddButton(true);
                            props.setEditData([]);
                            props.setOpen(true);
                        }}
                        variant="extended" size="medium" color="primary" aria-label="add">
                        <AddIcon sx={{ mr: 1 }} />
                        Add Map Inspection Batch Qty
                    </Fab>
                </Stack>

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

export default QualitySettingMapTitle