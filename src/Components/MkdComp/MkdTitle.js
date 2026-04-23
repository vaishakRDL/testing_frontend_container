import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ExcelTemplateDownloader from '../../ApiService/ExcelTemplateDownloader';
import { DownloadSobExlTemplate, DownloadSupExcelTemplate } from '../../ApiService/DownloadCsvReportsService';
import { SobExlImport, SupExcelImport } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import ApplicationStore from '../../Utility/localStorageUtil';
import { useModuleLocks } from '../context/ModuleLockContext';

const MkdTitle = (props) => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "MKD")?.lockStatus === "locked";

    const [file, setFile] = useState(null);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const handleFileUpload = () => {
        // Handle the uploaded file here
    };

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

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "mkddocument");

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
                MKD Document
            </Typography>
            <Box
                sx={{ m: 1 }}
            >

                <Grid style={{ display: 'flex' }}>
                    {/* <Stack
                        style={{ marginRight: '10px' }}
                        direction="row"
                        spacing={2}
                        onClick={() => {
                            props.setIsAddButton(true);
                            props.setEditData([]);
                            props.setOpen(true);
                            props.setIsDrawing(true);
                        }}
                    >
                        <Fab
                            style={{ background: '#002D68', color: 'white' }}
                            variant="extended" size="medium" color="primary" aria-label="add">
                            <AddIcon sx={{ mr: 1 }} />
                            Add File
                        </Fab>
                    </Stack> */}
                    <Grid item sm={6} xs={12} md={4} lg={2} xl={2}>
                        <Button
                            variant="contained"
                            // color="primary"
                            component="label"
                            style={{ marginRight: '16px', backgroundColor: '#002D68', height: '40px', borderRadius: '20px', background: userPermission[0]?.addData === 0 || isModuleLocked ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 || isModuleLocked ? 'black' : 'white' }}
                            disabled={userPermission[0]?.addData === 0 || isModuleLocked}
                            onClick={() => {
                                props.setIsAddButton(true);
                                props.setEditData([]);
                                props.setOpen(true);
                                props.setIsDrawing(true);
                            }}
                        >
                            <AddIcon sx={{ mr: 1 }} />
                            Add File
                        </Button>
                    </Grid>

                    <Grid item sm={6} xs={12} md={4} lg={2} xl={2}>
                        <Button
                            variant="contained"
                            // color="primary"
                            component="label"
                            style={{ marginRight: '16px', backgroundColor: isModuleLocked ? 'gray' : '#002D68', height: '40px', borderRadius: '20px', background: userPermission[0]?.addData === 0 || isModuleLocked ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 || isModuleLocked ? 'black' : 'white' }}
                            disabled={userPermission[0]?.addData === 0 || isModuleLocked}
                            onClick={() => {
                                props.setIsAddButton(true);
                                props.setEditData([]);
                                props.setOpen(true);
                                props.setIsDrawing(false);
                            }}
                        >
                            <AddIcon sx={{ mr: 1 }} />
                            Add Multiple File
                        </Button>
                    </Grid>
                    {/* <Stack
                        direction="row"
                        spacing={2}
                        onClick={() => {
                            props.setIsAddButton(true);
                            props.setEditData([]);
                            props.setOpen(true);
                            props.setIsDrawing(false);
                        }}
                    >
                        <Fab
                            style={{ background: '#002D68', color: 'white' }}
                            variant="extended" size="medium" color="primary" aria-label="add">
                            <AddIcon sx={{ mr: 1 }} />
                            Add Multiple File
                        </Fab>
                    </Stack> */}
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

export default MkdTitle
