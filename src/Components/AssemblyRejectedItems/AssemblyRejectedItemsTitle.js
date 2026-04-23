import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { GetAssemblyRejectedItems } from '../../ApiService/LoginPageService';

const AssemblyRejectedItemsTitle = (props) => {
    const { setIsFpiReport, setDrillFlag, drillFlag, rejectedItems, setRejectedItems } = props;
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });


    const [fromDate, setFromDate] = useState('');
    const [toDate, setTodate] = useState('');
    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const goBack = () => {
        setIsFpiReport(false);
        setDrillFlag(false);
    };

    const handleReportView = () => {
        GetAssemblyRejectedItems({ fromDate, toDate },
            handleRejectedItemsSucess, handleRejectedItemsException)

    };

    const handleRejectedItemsSucess = (dataObject) => {
        const updatedArray = dataObject?.data.map((item) => ({ ...item, select: false }))
        setRejectedItems(updatedArray)
    }
    const handleRejectedItemsException = () => {
        setNotification({
            status: true,
            type: 'error',
            message: 'Something went wrong',
        });
    }
    return (
        <Box
            sx={{
                mb: '10px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                // marginLeft: '10px',
                // marginRight: '10px',
                paddingTop: '10px',
                paddingBottom: '10px',
                paddingLeft: '22px',
                paddingRight: '10px',
            }}
        >
            <Grid container spacing={2}>
                {drillFlag === true ?
                    <Typography
                        sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold', color: '#0769d9', '&:hover': { color: '#043f82' } }}
                        variant="h5"
                        onClick={goBack}
                    >
                        {'Back >>'}
                    </Typography>
                    :
                    ''
                }
                <Typography
                    sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5"
                >
                    Assembly Rejected Items
                </Typography>

                {/* <Grid container spacing={2}> */}
                <Grid item xs={12} sm={8} md={3} lg={3}>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        type="date"
                        label="From"
                        variant="outlined"
                        style={{ marginRight: '10px' }}
                        InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                        size="small"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={8} md={3} lg={3}>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        type="date"
                        label="To"
                        variant="outlined"
                        style={{ marginRight: '10px' }}
                        InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                        size="small"
                        value={toDate}
                        onChange={(e) => setTodate(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={8} md={2} lg={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: '#002d68' }}
                        onClick={handleReportView}
                    >
                        View
                    </Button>
                </Grid>
                <NotificationBar
                    handleClose={handleClose}
                    notificationContent={openNotification.message}
                    openNotification={openNotification.status}
                    type={openNotification.type}
                />
                {/* </Grid> */}
            </Grid>
        </Box>
    )
}

export default AssemblyRejectedItemsTitle