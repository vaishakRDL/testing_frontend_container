import { Button, Dialog, CircularProgress, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { AssemblyInspecSubmit, AssemblyInspecUniqueId, AssemblyPlanInspecSubmit, ProcessInspecSubmit, ProcessInspecUniqueId, QcInwardApproveSubmit, QcInwardWithoutPoApproveSubmit, QualityInwardQcUniqueId, QualityInwardWithoutQcUniqueId, ReworkreasonShowData } from '../../../ApiService/LoginPageService';

const InwardQualityFPIReworkPopup = ({
    setOpenFPIReworkPopup,
    OpenFPIReworkPopup,
    reportRowData,
    inspectionList,
    inspectionView,
    rowItemId,
    poBillDetailId,
    poBillId,
    topData,
}) => {
    console.log("rowItemIdrowItemIdrowItemId", topData)
    const [qTestNo, setQTestNo] = useState('');
    const [serialNo, setSerialNo] = useState('');
    const [dataSet, setDataSet] = useState([]);
    const [Reason, setReason] = useState('');
    const [reamark, setRemark] = useState('');
    const [loader, setLoader] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {

        if (OpenFPIReworkPopup) {
            if (inspectionView === true) {
                QualityInwardWithoutQcUniqueId(
                    handleProcessInspecUniqueIdSucess,
                    handleProcessInspecUniqueIdException
                );
                ReworkreasonShowData(
                    handleQualityInsMstShow,
                    handeQualityInsMstException
                );
            } else {
                QualityInwardQcUniqueId(
                    handleProcessInspecUniqueIdSucess,
                    handleProcessInspecUniqueIdException
                );
                ReworkreasonShowData(
                    handleQualityInsMstShow,
                    handeQualityInsMstException
                );
            }
        }
    }, [OpenFPIReworkPopup, inspectionView]); // also add `inspectionView` to dependencies if needed



    const handleQualityInsMstShow = (dataObject) => {
        setDataSet(dataObject?.data || []);
    };

    const handeQualityInsMstException = (errorStatus, errorMessage) => {
        console.log(errorMessage);
    };
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
        const { jCId, itemId, machId, operationId, qty, customer, date, shift2, process } = topData || {};
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
                status: 'rework',
                reason: Reason,
                remarks: reamark,
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
                status: 'rework',
                reason: Reason,
                remarks: reamark,
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
            setOpenFPIReworkPopup(false);
            setQTestNo('');
            setSerialNo('');
            setReason('');
            setRemark('');
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

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
            maxWidth="lg"
            open={OpenFPIReworkPopup}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Rework
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
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Reason</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Process"
                                    variant="filled"
                                    value={Reason}
                                    onChange={(e) => {
                                        setReason(e.target.value);
                                    }}
                                >
                                    {
                                        dataSet.map((data) => (
                                            <MenuItem key={data.id} value={data.id}>{data.reason}</MenuItem>
                                        ))
                                    }

                                </Select>
                            </FormControl>
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
                                setOpenFPIReworkPopup(false);
                                setQTestNo('');
                                setSerialNo('');
                                setReason('');
                                setRemark('');
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

export default InwardQualityFPIReworkPopup;