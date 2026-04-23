import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { DownloadCslExlExport, DownloadSupExcelTemplate } from '../../ApiService/DownloadCsvReportsService';
import { cslExlImport } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import ImportSOBfile from './ImportSOBfile/ImportSOBfile';
import SOBviewCslData from './SOBviewCslData/SOBviewCslData';
import CaslImportData from './CaslImportData/CaslImportData';
import ApplicationStore from '../../Utility/localStorageUtil';
import { useModuleLocks } from '../context/ModuleLockContext';


const CSLimportTitle = (props) => {
    const [file, setFile] = useState(null);
    const [open, setOpen] = useState(false);
    const [cslOpen, setCslOpen] = useState(false);
    const [openSOBview, setOpenSOBview] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "cslimport");
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "CSL")?.lockStatus === "locked";

    const handleFileUpload = () => {
        // Handle the uploaded file here
    };

    const DownloadSupExcelTemplateSuccess = () => {

    }

    const DownloadSupExcelTemplateException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
    }

    const SupExcelImportSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            props.setRefreshData((oldValue) => !oldValue);
            setFile('');
        }, 2000);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };


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
            <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                variant="h5"
            >
                CSL Import Summary
            </Typography>
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
                                style={{ height: '40px', borderRadius: '20px', marginRight: '16px', background: userPermission[0]?.addData === 0 || isModuleLocked ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                                disabled={userPermission[0]?.addData === 0 || isModuleLocked}
                                onClick={() => {
                                    DownloadCslExlExport(DownloadSupExcelTemplateSuccess, DownloadSupExcelTemplateException);
                                }}
                            >
                                CSL Template
                            </Button>
                            {/* <ExcelTemplateDownloader /> */}

                            {/* <input
                                id="upload-photo"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            if (reader.readyState === 2) {
                                                setFile(reader.result);
                                                cslExlImport(
                                                    { file: reader.result },
                                                    SupExcelImportSuccess,
                                                    DownloadSupExcelTemplateException
                                                );
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
                                sx={{ backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
                            >
                                CSL Import
                            </Button> */}
                            <Button
                                variant="contained"
                                // color="primary"
                                component="label"
                                style={{ height: '40px', borderRadius: '20px', marginRight: '16px', background: userPermission[0]?.addData === 0 || isModuleLocked ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                                disabled={userPermission[0]?.addData === 0 || isModuleLocked}
                                onClick={() => {
                                    setCslOpen(true);
                                }}
                            >
                                CSL Import
                            </Button>
                            <Button
                                variant="contained"
                                // color="primary"
                                component="label"
                                style={{ height: '40px', borderRadius: '20px', marginRight: '16px', background: userPermission[0]?.addData === 0 || isModuleLocked ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                                disabled={userPermission[0]?.addData === 0 || isModuleLocked}
                                onClick={() => {
                                    setOpen(true);
                                }}
                            >
                                Import SOB
                            </Button>
                            <Button
                                variant="contained"
                                // color="primary"
                                component="label"
                                style={{ height: '40px', borderRadius: '20px', marginRight: '16px', background: userPermission[0]?.addData === 0 || isModuleLocked ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                                disabled={userPermission[0]?.addData === 0 || isModuleLocked}
                                onClick={() => {
                                    setOpenSOBview(true);
                                }}
                            >
                                Consolidated Views
                            </Button>


                        </div>
                    </Grid>

                    {/* <Grid item>
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
                                Add CSL
                            </Fab>
                        </Stack>
                    </Grid> */}
                </Grid>
            </Box>
            <ImportSOBfile
                open={open}
                setOpen={setOpen}
                setRefreshData={props.setRefreshData}
            // cslId={cslId}
            />
            <CaslImportData
                open={cslOpen}
                setOpen={setCslOpen}
                setRefreshData={props.setRefreshData}
            // cslId={cslId}
            />

            <SOBviewCslData
                openSOBview={openSOBview}
                setOpenSOBview={setOpenSOBview}
            // cslId={cslId}
            />
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

        </Box>
    )
}

export default CSLimportTitle