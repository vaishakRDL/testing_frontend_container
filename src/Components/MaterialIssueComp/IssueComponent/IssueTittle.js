import React, { useState, useEffect } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import { Link } from 'react-router-dom';
import { MaterialIssueReportDownload } from '../../../ApiService/DownloadCsvReportsService'
import { MaterialIssueAutomatic } from '../../../ApiService/LoginPageService'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';

const IssueTittle = (props) => {
    const { issueId, setIssueLoader, setRefreshData, selctedId } = props;
    console.log("selctedId123456", selctedId);
    const [loader, setLoader] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const handleExportClick = () => {
        setLoader(true)
        MaterialIssueReportDownload({ id: issueId }, handleSucess, handleFailure)
    }

    const handleSucess = (dataObject) => {
        setLoader(false)
        setNotification({
            status: true,
            type: 'success',
            message: "Download success",
        });
        setTimeout(() => {
            handleClose();
        }, 3000);
    }
    const handleFailure = (errorObject, errorMessage) => {
        setLoader(false)
        setNotification({
            status: true,
            type: 'error',
            message: "Failed to download",
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleIssueAutomatic = () => {
        setIssueLoader(true)
        MaterialIssueAutomatic({ srnMstId: issueId, items: selctedId }, handleIssueAutomaticSuccess, handleIssueAutomaticFailure)
    }

    const handleIssueAutomaticSuccess = (dataObject) => {
        setIssueLoader(false)
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setRefreshData((oldvalue) => !oldvalue);
            handleClose();
        }, 2000);
    }
    const handleIssueAutomaticFailure = (errorObject, errorMessage) => {
        setIssueLoader(false)
        console.log("the error ", errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
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
                marginLeft: '10px',
                marginRight: '10px',
                marginTop: '10px'
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}>
                <Link to='/MaterialIssueResult' style={{ textDecoration: 'none' }}>
                    <Typography
                        sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                        variant="h5"
                    >
                        {`Material Issue>>`}
                    </Typography>
                </Link>
                <Typography
                    sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5"
                >
                    Issue
                </Typography>
            </div>
            <Box
                sx={{ m: 1 }}
            >
                <Grid container alignItems={'center'} spacing={2}>
                    <Grid item>
                        <Stack
                            direction="row"
                            spacing={2}
                            onClick={() => {
                                handleExportClick()
                            }}
                        >
                            <Fab
                                style={{ background: '#002D68', color: 'white' }}
                                variant="extended" size="medium" color="primary" aria-label="add">
                                <GetAppIcon sx={{ mr: 1 }} />
                                Export
                                {loader
                                    &&
                                    <Box sx={{ display: 'flex', marginLeft: 1 }}>
                                        <CircularProgress size={25} color="inherit" />
                                    </Box>
                                }
                            </Fab>
                        </Stack>
                    </Grid>

                    <Grid item>
                        <Stack
                            direction="row"
                            spacing={2}
                            onClick={() => {
                                handleIssueAutomatic()
                            }}
                        >
                            <Fab
                                style={{ background: '#002D68', color: 'white' }}
                                variant="extended" size="medium" color="primary" aria-label="add">
                                Issue Automatically
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

export default IssueTittle