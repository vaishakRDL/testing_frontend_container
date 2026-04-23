import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';

const SfgVendorProcessTitle = (props) => {
    const { idsArray } = props;
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const areAllSpCodesSame = idsArray.every(item => item.supplierId === idsArray[0].supplierId);

    const supplierSelectionException = (errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
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
            }}
        >
            <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                variant="h5"
            >
                SFG Supplier Process
            </Typography>
            <Box
                sx={{ m: 1 }}
            >
                <Grid container alignItems={'center'} spacing={2}>
                    <Grid item>
                        <Stack
                            direction="row"
                            spacing={2}
                            onClick={() => {
                                if (areAllSpCodesSame && idsArray.length > 0) {
                                    props.setIsAddButton(true);
                                    props.setEditData([]);
                                    props.setOpen(true);
                                } else {
                                    if (idsArray.length < 1) {
                                        supplierSelectionException("SELECT THE Supplier TO PROCESS")
                                    } else {
                                        supplierSelectionException("SELECTED Supplier MUST BE THE SAME")
                                    }
                                }
                            }}
                        >
                            <Fab
                                style={{ background: idsArray.length > 0 ? '#002D68' : "gray", color: 'white' }}
                                variant="extended" size="medium" color="primary" aria-label="add">
                                <AddIcon sx={{ mr: 1 }} />
                                Schedule For Supplier Process
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

export default SfgVendorProcessTitle