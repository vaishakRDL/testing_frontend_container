import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Switch, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { ShowSFG, SFGDelete, GetMaterialAllocation, GetAllocationMode, UpdateAllocationMode } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import ApplicationStore from '../../Utility/localStorageUtil';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const MaterialAllocationTitle = (props) => {
    const [allocationMode, setAllocationMode] = useState([])
    const [refreshData, setRefreshData] = useState(false)
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "materialallocation");

    useEffect(() => {
        GetAllocationMode(handleSucessShow, handleExceptionShow)
    }, [refreshData]);

    const handleSucessShow = (dataObject) => {
        setAllocationMode(dataObject?.data || []);
        console.log("dataObject", dataObject)
    }
    const handleExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSwitchChange = (id, newMode) => {
        UpdateAllocationMode({ id: id, mode: newMode }, handleSuccess, handleException)
    };

    const handleSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject.message);
        setRefreshData(oldvalue => !oldvalue);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    };
    const handleException = (errorObject, errorMessage) => {
        console.log("the error ", errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
    };

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
                Material Allocation
            </Typography>
            {/* <Box
                sx={{ m: 1 }}
            >
                <Grid container alignItems={'center'} spacing={2}>
                    <Grid item>
                        <Stack
                            direction="row"
                            spacing={2}
                            onClick={() => {
                                props.setIsAddButton(true);
                                props.setEditData([]);
                                props.setOpen(true);
                            }}
                        >
                            <Fab
                                style={{ background: '#002D68', color: 'white' }}
                                variant="extended" size="medium" color="primary" aria-label="add">
                                <AddIcon sx={{ mr: 1 }} />
                                Add Machine
                            </Fab>
                        </Stack>
                    </Grid>
                </Grid>
            </Box> */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: '10px',
                backgroundColor: '#ffffff',
                paddingLeft: '20px',
                paddingRight: '20px',
                borderRadius: '10px',
                border: '2px solid #002d68'
            }}>
                <Typography style={{ fontWeight: 'bolder', fontFamily: 'Roboto Slab' }}>Manual</Typography>
                {allocationMode.map((item) => (
                    <Switch key={item.id}
                        checked={item.mode === 'Auto'}
                        onChange={() => {
                            const newMode = item.mode === 'Auto' ? 'Manual' : 'Auto';
                            handleSwitchChange(item.id, newMode);
                        }}
                    />
                ))}
                <Typography style={{ fontWeight: 'bolder', fontFamily: 'Roboto Slab' }}>Auto</Typography>
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

export default MaterialAllocationTitle