import { Button, Dialog, DialogActions, CircularProgress, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { AssemblyInspecSubmit, AssemblyInspecUniqueId, AssemblyPlanInspecSubmit, ProcessInspecSubmit, ProcessInspecUniqueId, QcInwardApproveSubmit, QcInwardWithoutPoApproveSubmit, QualityInwardQcUniqueId, QualityInwardWithoutQcUniqueId } from '../../../ApiService/LoginPageService';

const InwardQualityFPIApprovePopup = ({
    setOpenFPIApprovePopup,
    OpenFPIApprovePopup,
    reportRowData,
    inspectionList,
    inspectionView,
    rowItemId,
    poBillDetailId,
    poBillId,
    topData,
}) => {
    console.log("12122333", topData)
    const [qTestNo, setQTestNo] = useState('');
    const [serialNo, setSerialNo] = useState('');
    const [loader, setLoader] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (OpenFPIApprovePopup) {
            if (inspectionView === true) {
                QualityInwardWithoutQcUniqueId(
                    handleProcessInspecUniqueIdSucess,
                    handleProcessInspecUniqueIdException
                );
            } else {
                QualityInwardQcUniqueId(handleProcessInspecUniqueIdSucess, handleProcessInspecUniqueIdException);
            }

        }
    }, [OpenFPIApprovePopup]);

    const handleProcessInspecUniqueIdSucess = (deataObject) => {
        setQTestNo(deataObject?.qcTestNo || '');
        // setSerialNo(deataObject?.snNo || '');
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
        setLoader(true);
        const { jCId, itemId, machId, operationId, qty, customer, date, shift2, process } = topData || {};


        if (inspectionView === true) {
            QcInwardWithoutPoApproveSubmit({
                qlty: inspectionList,
                conversionPart: reportRowData?.conversionPart || '',
                conversionPartId: reportRowData?.conversionPartId || '',
                conversionQty: reportRowData?.conversionQty || '',
                qcTestNo: qTestNo,
                date: new Date(),
                spCode: reportRowData?.spCode,
                poBillId: reportRowData?.poBillId,
                poBillDtlId: reportRowData?.poBillDtlId,
                schDate: reportRowData?.schDate,
                itemId: reportRowData?.itemId,
                operationId: operationId,
                process: process,
                machId: machId,
                Qty: reportRowData?.accQty,
                itemName: reportRowData?.itemName,
                itemCode: reportRowData?.itemCode,
                digit: reportRowData?.digit,
                digitString: reportRowData?.poNo,
                rejQty: reportRowData?.rejQty,
                grnRefNO: reportRowData?.grnRefNO,
                rcvdQty: reportRowData?.rcvdQty,
                accQty: reportRowData?.accQty,
                status: 'approved',
                reason: "",
                remarks: " ",
            }, handleProcessInspecSubmitSuccess, handleProcessInspecSubmitException)
        }
        else {
            QcInwardApproveSubmit({
                qlty: inspectionList,
                conversionPart: reportRowData?.conversionPart || '',
                conversionPartId: reportRowData?.conversionPartId || '',
                conversionQty: reportRowData?.conversionQty || '',
                qcTestNo: qTestNo,
                date: new Date(),
                spCode: reportRowData?.spCode,
                poBillId: reportRowData?.poBillId,
                poBillDtlId: reportRowData?.poBillDtlId,
                schDate: reportRowData?.schDate,
                itemId: reportRowData?.itemId,
                operationId: operationId,
                process: process,
                machId: machId,
                Qty: reportRowData?.accQty,
                itemName: reportRowData?.itemName,
                itemCode: reportRowData?.itemCode,
                digit: reportRowData?.digit,
                digitString: reportRowData?.poNo,
                rejQty: reportRowData?.rejQty,
                grnRefNO: reportRowData?.grnRefNO,
                poBillId: reportRowData?.poBillId,
                rcvdQty: reportRowData?.rcvdQty,
                accQty: reportRowData?.accQty,
                status: 'approved',
                reason: "",
                remarks: '',
            }, handleProcessInspecSubmitSuccess, handleProcessInspecSubmitException)
        }

    }

    const handleProcessInspecSubmitSuccess = (dataObject) => {
        console.log('Success Callback:', dataObject);
        setLoader(false);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setOpenFPIApprovePopup(false);
            setQTestNo('');
            setSerialNo('');

        },);
    };

    const handleProcessInspecSubmitException = (errorObject, message) => {
        setLoader(false);
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
                                label={"PO No"}
                                variant="outlined"
                                fullWidth
                                required
                                value={reportRowData?.poNo}
                            />
                        </Grid>
                        {/* <Grid item xs={6}>
                            <TextField
                                label="Serial No"
                                variant="outlined"
                                fullWidth
                                required
                                value={serialNo}
                            />
                        </Grid> */}
                    </Grid>
                    <DialogActions>
                        <Button
                            variant="contained"
                            disabled={loader === true}
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type='submit'>
                            {loader ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : 'submit'}

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

export default InwardQualityFPIApprovePopup;