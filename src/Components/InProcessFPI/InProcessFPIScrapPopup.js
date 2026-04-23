import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { ProcessInspecSubmit, ProcessInspecUniqueId } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { CircularProgress } from '@mui/material';

const InProcessFPIScrapPopup = ({ count, range, setCount, setOpenFPIScrapPopup, OpenFPIScrapPopup, selectedOptionName, jobCardsNo, inspectionList, topData }) => {

    const [qTestNo, setQTestNo] = useState('');
    const [serialNo, setSerialNo] = useState('');
    const [reamark, setRemark] = useState('');
    const [quantity, setQuantity] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (OpenFPIScrapPopup) {
            ProcessInspecUniqueId(handleProcessInspecUniqueIdSucess, handleProcessInspecUniqueIdException);
        }

    }, [OpenFPIScrapPopup]);

    const handleProcessInspecUniqueIdSucess = (deataObject) => {
        setQTestNo(deataObject?.qTestNo || '');
        setSerialNo(deataObject?.snNo || '');

    }

    const handleProcessInspecUniqueIdException = (errorObject, errorMessage) => {

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSubmitting) return; // 🚫 prevent double click
        setIsSubmitting(true); // ✅ start loader
        const { jCId, jcNo, itemId, machId, operationId, Qty, customer, date, shift2 } = topData || {};
        console.log('Submit clicked with:', { jCId, itemId, machId, operationId, Qty, customer, date, shift2 });
        const updatedInspectionList = inspectionList.map((item) => ({
            ...item,
            jCId,
            machId,
            Qty,
            itemId,
            operationId,
            customer,
            date,
            shift2,
        }));
        ProcessInspecSubmit({
            qlty: updatedInspectionList,
            qTestNo: qTestNo,
            serialNo: serialNo,
            rejRewQty: quantity,
            type: selectedOptionName,
            result: '',
            status: 'scrap',
            reason: "",
            remarks: reamark,
            jCId,
            jcNo,
            machId,
            Qty,
            itemId,
            customer,
            operationId,
            date,
            shift2,
            count: count,
            range: range
        }, handleProcessInspecSubmitSuccess, handleProcessInspecSubmitException);
    }


    const handleProcessInspecSubmitSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setIsSubmitting(false); // ✅ stop loader
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
        setIsSubmitting(false); // ✅ stop loader
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
                                label="Jobcard No"
                                variant="outlined"
                                fullWidth
                                required
                                value={jobCardsNo}
                            />
                        </Grid>

                        {/* Serial No */}
                        <Grid item xs={6}>
                            <TextField
                                label="Serial No"
                                variant="outlined"
                                fullWidth
                                required
                                value={serialNo}
                            />
                        </Grid>
                        <Grid item xs={6}>
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
                        <Grid item xs={6}>
                            <TextField
                                label="Count"
                                variant="outlined"
                                fullWidth
                                required
                                value={count}
                                type='number'
                                onChange={(e) => {
                                    setCount(e.target.value)
                                }}
                            />

                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Price Range"
                                variant="outlined"
                                fullWidth
                                required
                                value={range}
                            // onChange={(e) => {
                            //     setRange(e.target.value)
                            // }}
                            />

                        </Grid>

                    </Grid>

                    <DialogActions>

                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type='submit'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Submit'}

                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setOpenFPIScrapPopup(false);
                                setQTestNo('');
                                setSerialNo('');
                                setRemark('');
                                setQuantity('');
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

export default InProcessFPIScrapPopup;