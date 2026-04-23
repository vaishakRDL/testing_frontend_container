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

const RemarksMasterTitle = (props) => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Remark Master")?.lockStatus === "locked";


    const [file, setFile] = useState(null);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const { userDetails } = ApplicationStore()?.getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "holidaymaster");

    const handleFileUpload = () => {
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

    return (
        <Box
            sx={{
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
                Remarks Overview
            </Typography>
            <Box
            >

                <Grid item>
                    <Stack
                        direction="row"
                        spacing={2}

                    >
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
                            Add Remarks
                        </Fab>
                    </Stack>
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

export default RemarksMasterTitle
