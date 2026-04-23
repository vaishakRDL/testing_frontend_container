import { Button, Dialog, CircularProgress, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React, { useState } from 'react'
import { useEffect } from 'react';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { AssemblyInspecSubmit, AssemblyInspecUniqueId, ProcessInspecSubmit, ProcessInspecUniqueId, QcInwardApproveSubmit, QcInwardWithoutPoApproveSubmit, QualityInwardQcUniqueId, QualityInwardWithoutQcUniqueId } from '../../../ApiService/LoginPageService';

const InwardQualityFPIScrapPopup = ({
    setOpenFPIScrapPopup,
    OpenFPIScrapPopup,
    reportRowData,
    inspectionList,
    inspectionView,
    rowItemId,
    poBillDetailId,
    poBillId,
    topData,
}) => {

    const [qTestNo, setQTestNo] = useState('');
    const [serialNo, setSerialNo] = useState('');
    const [reamark, setRemark] = useState('');
    const [loader, setLoader] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (OpenFPIScrapPopup) {
            if (inspectionView === true) {
                QualityInwardWithoutQcUniqueId(
                    handleProcessInspecUniqueIdSucess,
                    handleProcessInspecUniqueIdException
                );
            }
            else {
                QualityInwardQcUniqueId(handleProcessInspecUniqueIdSucess, handleProcessInspecUniqueIdException);
            }

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
        const { jCId, itemId, machId, operationId, qty, customer, date, shift2, operation, process } = topData || {};
        setLoader(true);

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
                itemId: rowItemId,
                operationId: operationId,
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
                status: 'scarp',
                remarks: reamark,
                reason: "",
                process: process,
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
                status: 'scarp',
                remarks: reamark,
                reason: "",
                process: process,
            }, handleProcessInspecSubmitSuccess, handleProcessInspecSubmitException)
        }
    }


    const handleProcessInspecSubmitSuccess = (dataObject) => {
        setLoader(false);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setOpenFPIScrapPopup(false);
            setQTestNo('');
            setSerialNo('');

        },);

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
                                label={"PO No"}
                                variant="outlined"
                                fullWidth
                                required
                                value={reportRowData?.poNo}
                            />
                        </Grid>

                        {/* Serial No */}
                        {/* <Grid item xs={6}>
                            <TextField
                                label="Serial No"
                                variant="outlined"
                                fullWidth
                                required
                                value={serialNo}
                            />
                        </Grid> */}
                        <Grid item xs={12} style={{ marginBottom: '10px' }}>
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
                            disabled={loader === true}
                        >
                            {loader ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : 'submit'}
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

export default InwardQualityFPIScrapPopup;