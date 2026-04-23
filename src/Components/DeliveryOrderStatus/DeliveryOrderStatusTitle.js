import React, { useState } from 'react';
import { Box, Button, FormControlLabel, Grid, Radio, RadioGroup, Switch, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ExcelTemplateDownloader from '../../ApiService/ExcelTemplateDownloader';
import { DownloadSobExlTemplate, DownloadSupExcelTemplate } from '../../ApiService/DownloadCsvReportsService';
import { SobExlImport, SupExcelImport } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';

const DeliveryOrderStatusTitle = (props) => {

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });




    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };


    const handleChange = () => {
        props.setSelectedSwitch(prev => !prev);
    };


    return (
        <Box
            sx={{
                mb: '10px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                // flexWrap: 'wrap',
                marginLeft: '10px',
                marginRight: '10px',
                // width: '100%'
            }}
        >

            <Grid container alignItems="center" justifyContent="space-around">
                <Grid item xs={12} sm={9} md={9} lg={9} xl={9}>
                    <Typography sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }} variant="h5">
                        Dispatch Status
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={3} md={3} lg={3} xl={3} style={{ backgroundColor: 'white', justifyContent: 'center', borderRadius: 8, display: "flex", alignItems: 'center' }}  >
                    <Typography sx={{ color: '#000000', fontWeight: 'bold', mr: 1, ml: 3 }}>Verification</Typography>
                    <Switch
                        checked={props.selectedSwitch}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#4CAF50', // Green color when checked
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#4CAF50', // Green track when checked
                            },
                            '& .MuiSwitch-switchBase': {
                                color: '#F44336', // Red color when unchecked
                            },
                            '& .MuiSwitch-track': {
                                backgroundColor: '#F44336', // Red track when unchecked
                            }
                        }}
                    />
                    <Typography sx={{ color: '#000000', fontWeight: 'bold', ml: 1 }}>Completed</Typography>
                </Grid>
            </Grid>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Box>
    )
}

export default DeliveryOrderStatusTitle
