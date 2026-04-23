import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';


const AddChecklistTitle = (props) => {
    const { setUploadLoader, uploadLoader } = props;
    const [file, setFile] = useState(null);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const handleTemplateDownload = () => {
        // ChecklistTemplateDownload(handleDownloadSuccess, handleDownloadException);
    }

    const handleDownloadSuccess = () => {
        setNotification({
            status: true,
            type: 'success',
            message: "Download Success",
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const handleDownloadException = () => {
        setNotification({
            status: true,
            type: 'error',
            message: "Failed to download Template",
        });
        setTimeout(() => {
        }, 2000);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    // XL UPLOAD HANDLER
    const handleItemImportSucess = (dataObject) => {
        setUploadLoader(false);
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
            setUploadLoader(false);
            // handleClose();
        }, 2000);
    }

    return (
        <Box
            sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                backgroundColor: '#ffffff',
                padding: '24px',
                borderRadius: '12px 12px 0 0',
                borderBottom: '1px solid #e2e8f0',
            }}
        >
            <Typography
                sx={{
                    m: 0,
                    color: '#0f172a',
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    fontSize: '1.5rem',
                    fontFamily: 'Roboto Slab'
                }}
                variant="h5"
                component="h1"
            >
                Checklist Management
            </Typography>
            <Box>
                <Grid container alignItems={'center'} spacing={2}>
                    <Grid item>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button
                                variant="outlined"
                                onClick={handleTemplateDownload}
                                sx={{
                                    height: '40px',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: '#475569',
                                    borderColor: '#e2e8f0',
                                    '&:hover': {
                                        backgroundColor: '#f8fafc',
                                        borderColor: '#cbd5e1',
                                    }
                                }}
                            >
                                Download Template
                            </Button>

                            <Button
                                variant="outlined"
                                component="label"
                                htmlFor="upload-photo"
                                sx={{
                                    height: '40px',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: '#475569',
                                    borderColor: '#e2e8f0',
                                    '&:hover': {
                                        backgroundColor: '#f8fafc',
                                        borderColor: '#cbd5e1',
                                    }
                                }}
                            >
                                Upload File
                                <input
                                    id="upload-photo"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            const reader = new FileReader();
                                            reader.onload = () => {
                                                if (reader.readyState === 2) {
                                                    setUploadLoader(true)
                                                }
                                            };
                                            reader.readAsDataURL(e.target.files[0]);
                                        }
                                    }}
                                />
                            </Button>

                            <Fab
                                sx={{
                                    backgroundColor: "#002D68",
                                    color: "#ffffff",
                                    px: 3,
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    height: '40px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 45, 104, 0.2)',
                                    "&:hover": {
                                        backgroundColor: "#004b93",
                                        boxShadow: '0 10px 15px -3px rgba(0, 45, 104, 0.3)',
                                    },
                                }}
                                onClick={() => {
                                    props.setIsAddButton(true);
                                    props.setEditData([]);
                                    props.setOpen(true);
                                }}
                                variant="extended"
                                size="medium"
                            >
                                <AddIcon sx={{ mr: 1 }} />
                                Add Checklist
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

export default AddChecklistTitle