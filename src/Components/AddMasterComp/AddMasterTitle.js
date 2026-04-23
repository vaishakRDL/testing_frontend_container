import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ApplicationStore from '../../Utility/localStorageUtil';
import ImportExcelModal from './ImportExcelModal/ImportExcelModal';
import { AllMastersExport } from '../../ApiService/DownloadCsvReportsService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { useModuleLocks } from '../context/ModuleLockContext';

const AddMasterTitle = (props) => {
    const { selectedMaster } = props;
    const [excelModal, setExcelModal] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const { userDetails } = ApplicationStore()?.getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "addmaster");
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Master")?.lockStatus === "locked";

    const handleExportClick = () => {
        AllMastersExport({ master: selectedMaster }, handleExportSuccess, handleExportException);
    }

    const handleExportSuccess = () => {
        setNotification({
            status: true,
            type: 'success',
            message: "Download Success",
        });
        setTimeout(() => {
            handleClose();
        }, 2000)
    }
    const handleExportException = () => {
        setNotification({
            status: true,
            type: 'success',
            message: "Download Failed",
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
        <Box
            sx={{
                mb: '10px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginLeft: '10px',
                marginRight: '10px',
                marginTop: '10px'
            }}
        >
            <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                variant="h5"
            >
                Master
            </Typography>
            <Box
                sx={{ m: 1, display: 'flex', flexDirection: 'row' }}

            >
                <Button variant="contained" style={{ backgroundColor: isModuleLocked ? 'gray' : '#002D68', borderRadius: '50px', marginRight: '10px', color: 'white' }} disabled={isModuleLocked} onClick={() => handleExportClick()}>Export</Button>
                <Button variant="contained" style={{ backgroundColor: isModuleLocked ? 'gray' : '#002D68', borderRadius: '50px', marginRight: '10px', color: 'white' }} disabled={isModuleLocked} onClick={() => setExcelModal(true)}>Import</Button>
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
                        Add Master
                    </Fab>
                </Stack>
            </Box>
            <ImportExcelModal
                excelModal={excelModal}
                setExcelModal={setExcelModal}
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

export default AddMasterTitle