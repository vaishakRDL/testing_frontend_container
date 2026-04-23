import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';

const RMBOIIndentReportTitle = (props) => {
    const { selectedPartNo, selectedVendorCode, selectedSupplierId } = props;
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const areAllSpCodesSame = selectedVendorCode.every(item => item.spCode === selectedVendorCode[0].spCode);
    const areAllSpIdSame = selectedSupplierId.every(item => item.spId === selectedSupplierId[0].spId);

    const supplierSelectionException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: "SELECTED SUPPLIER MUST BE THE SAME",
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
                marginTop: '12px'
            }}
        >
            <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                variant="h5"
            >
                RM/BOI Indent Report
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
                                areAllSpCodesSame && areAllSpIdSame ?
                                    navigate(`/PurchaseOrderGenerationModule?isBOI=${true}&&selectedPartNo=${selectedPartNo}&&selectedBoiSuppId=${selectedSupplierId[0]?.spId}`)
                                    :
                                    supplierSelectionException()
                                // props.setIsAddButton(true);
                                // props.setEditData([]);
                                // props.setOpen(true);
                            }}
                        >
                            <Fab
                                style={{ background: '#002D68', color: 'white' }}
                                variant="extended" size="medium" color="primary" aria-label="add">
                                <AddIcon sx={{ mr: 1 }} />
                                Request For PO
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

export default RMBOIIndentReportTitle