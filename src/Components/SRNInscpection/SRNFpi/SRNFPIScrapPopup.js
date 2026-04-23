import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React, { useState } from 'react'
import { useEffect } from 'react';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { AssemblyInspecSubmit, AssemblyInspecUniqueId, FmiInspecSubmit, FmiInspecUniqueId, ProcessInspecSubmit, ProcessInspecUniqueId } from '../../../ApiService/LoginPageService';

const SRNFPIScrapPopup = ({ setOpenFPIScrapPopup, OpenFPIScrapPopup, selectedOptionName, shipmentDate, jobCardsNo, inspectionList, topData, contractNo, itemCode }) => {

    const [qTestNo, setQTestNo] = useState('');
    const [serialNo, setSerialNo] = useState('');
    const [reamark, setRemark] = useState('');
    const [quantity, setQuantity] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (OpenFPIScrapPopup) {
            FmiInspecUniqueId(handleProcessInspecUniqueIdSucess, handleProcessInspecUniqueIdException);
        }

    }, [OpenFPIScrapPopup]);

    const handleProcessInspecUniqueIdSucess = (deataObject) => {
        setQTestNo(deataObject?.qcTestNo || '');
        // setSerialNo(deataObject?.snNo || '');
    }

    const handleProcessInspecUniqueIdException = (errorObject, errorMessage) => {

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { jCId, itemId, machId, operationId, qty, customer, date, shift2, poNo, fim, apId } = topData || {};
        console.log('Submit clicked with:', { jCId, itemId, machId, operationId, qty, customer, date, shift2 });
        const updatedInspectionList = inspectionList.map((item) => ({
            ...item,
            jCId,
            machId,
            qty,
            itemId,
            operationId,
            customer,
            date,
            shift2,
        }));
        FmiInspecSubmit({
            // qlty: updatedInspectionList,
            // qTestNo: qTestNo,
            // serialNo: serialNo,
            // type: selectedOptionName,
            // result: '',
            // status: 'scrap',
            // reason: "",
            // remarks: '',
            // jCId,
            // machId,
            // Qty,
            // itemId,
            // customer,
            // operationId,
            // date,
            // shift2,
            qlty: updatedInspectionList,
            qcTestNo: qTestNo,
            serialNo: serialNo,
            type: selectedOptionName,
            result: '',
            status: 'scrap',
            reason: "",
            remarks: '',
            rejRewQty: quantity,
            contractNo,
            machId,
            qty,
            itemId,
            customer,
            operationId,
            date,
            shipmentDate,
            poNo, fim,
            apId
            // shift2,
        }, handleProcessInspecSubmitSuccess, handleProcessInspecSubmitException);
    }


    const handleProcessInspecSubmitSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setOpenFPIScrapPopup(false);
            setQTestNo('');
            setSerialNo('');

        }, 3000);

    }

    const handleProcessInspecSubmitException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: "error",
            message: errorMessage,
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
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
            maxWidth="lg"
            open={OpenFPIScrapPopup}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Scrap
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Jobcard No */}

                        <Grid item xs={6}>
                            <TextField
                                label="Q-test No"
                                variant="outlined"
                                fullWidth
                                required
                                value={qTestNo}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Part Number"
                                variant="outlined"
                                fullWidth
                                required
                                value={itemCode}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Quantity"
                                variant="outlined"
                                fullWidth
                                required
                                value={quantity}
                                onChange={(e) => {
                                    setQuantity(e.target.value)
                                }}
                            />

                        </Grid>
                        <Grid item xs={6} style={{ marginBottom: '10px' }}>
                            <TextField
                                label="Remarks"
                                variant="outlined"
                                fullWidth
                                required
                                value={reamark}
                                onChange={(e) => {
                                    setRemark(e.target.value);
                                }}
                            />
                        </Grid>

                    </Grid>

                    <DialogActions>

                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type='submit'
                        >
                            submit
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setOpenFPIScrapPopup(false);
                                setQTestNo('');
                                setSerialNo('');
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Dialog>

    )
}

export default SRNFPIScrapPopup;