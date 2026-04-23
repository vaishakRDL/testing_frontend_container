import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { ProcessInwardSubmit, ProcessInspecUniqueId } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';

const InWardFPIApprovePopup = ({ setRefreshData, isButtonDisabled, setOpenFPIApprovePopup, OpenFPIApprovePopup, selectedOptionName, jobCardsNo, inspectionList, topData }) => {
    console.log('topDatatopDatatopDatatopData', topData)
    const [qTestNo, setQTestNo] = useState('');
    const [serialNo, setSerialNo] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (OpenFPIApprovePopup) {
            ProcessInspecUniqueId(handleProcessInspecUniqueIdSucess, handleProcessInspecUniqueIdException);
        }
    }, [OpenFPIApprovePopup]);

    const handleProcessInspecUniqueIdSucess = (deataObject) => {
        setQTestNo(deataObject?.qTestNo || '');
        setSerialNo(deataObject?.snNo || '');
    }

    const handleProcessInspecUniqueIdException = () => {

    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { jCId, itemId, machId, operationId, Qty, customer, date, shift2, spCode, schDate } = topData || {};
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
            spCode,
            schDate
        }));
        ProcessInwardSubmit({
            qlty: updatedInspectionList,
            qcTestNo: qTestNo,
            serialNo: serialNo,
            type: selectedOptionName,
            result: '',
            status: 'approved',
            reason: "",
            remarks: '',
            jCId,
            machId,
            Qty,
            itemId,
            customer,
            operationId,
            date,
            shift2,
            spCode,
            schDate

        }, handleProcessInspecSubmitSuccess, handleProcessInspecSubmitException);
    }

    const handleProcessInspecSubmitSuccess = (dataObject) => {
        console.log('Success Callback:', dataObject);
        setRefreshData(oldvalue => !oldvalue)
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setOpenFPIApprovePopup(false);
            setQTestNo('');
            setSerialNo('');
        }, 3000);
    };

    const handleProcessInspecSubmitException = (errorObject, message) => {
        console.log(message);
        setNotification({
            status: true,
            type: 'error',
            message: message,
        });
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
            maxWidth="lg"
            open={OpenFPIApprovePopup}>
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Approved
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Q -Test No"
                                variant="outlined"
                                fullWidth
                                required
                                value={qTestNo}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                label="Serial No"
                                variant="outlined"
                                fullWidth
                                required
                                value={serialNo}
                            />
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{
                                width: '150px',

                                background: isButtonDisabled === true ? "gray" : '#002D68', color: 'white'
                            }}
                            type='submit'
                            disabled={isButtonDisabled}
                        >
                            submit
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setOpenFPIApprovePopup(false);
                                setQTestNo('');
                                setSerialNo('');

                            }}>
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

export default InWardFPIApprovePopup;