import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { AssemblyInspecSubmit, AssemblyInspecUniqueId, AssemblyPlanInspecSubmit, ProcessInspecSubmit, ProcessInspecUniqueId } from '../../../ApiService/LoginPageService';

const AssemblyFPIApprovePopup = ({
    setOpenFPIApprovePopup,
    OpenFPIApprovePopup,
    selectedOptionName,
    jobCardsNo,
    inspectionList,
    topData,
    contractNo,
    kanDate,
    selectedFim,
    contractRadioChange,
    rowContract,
    selectedRowItemCode,
    selectedRowItemId,
    setPageRefresher,
    optionsRowData
}) => {
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
            AssemblyInspecUniqueId(handleProcessInspecUniqueIdSucess, handleProcessInspecUniqueIdException);
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
    const updateSampleProgress = () => {
        if (!optionsRowData || !optionsRowData.statusDisplay) return;

        const col = optionsRowData.selectedSampleKey;

        if (!col) return; // nothing to update

        const currentStatus = optionsRowData.statusDisplay[col];

        // Convert Yellow -> Green when approved
        if (currentStatus === "Y") {
            optionsRowData.statusDisplay[col] = "G";
        }

        // Reduce quantity
        if (optionsRowData[col] > 1) {
            optionsRowData[col] = optionsRowData[col] - 1;
        } else {
            optionsRowData[col] = "";  // remove value when exhausted
        }

        // Recalculate total
        const ignore = ["id", "itemCode", "category", "itemId", "statusDisplay", "totQty", "sNo"];
        optionsRowData.totQty = Object.keys(optionsRowData)
            .filter(k => !ignore.includes(k))
            .reduce((sum, k) => sum + (Number(optionsRowData[k]) || 0), 0);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const { jCId, itemId, machId, operationId, qty, customer, date, shift2 } = topData || {};
        console.log('Submit clicked with:', { jCId, itemId, machId, operationId, qty, customer, date, shift2 });
        const inspecCategory = inspectionList[0]?.inspecCategory || "";
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
        contractRadioChange === 'assemblyPlan' ?
            AssemblyPlanInspecSubmit({
                qlty: updatedInspectionList,
                qcTestNo: qTestNo,
                serialNo,
                type: selectedOptionName,
                status: "approved",
                reason: "",
                remarks: "",
                contractNo,
                machId,
                qty: optionsRowData?.selectedQty ?? topData?.qty,     // ✅ FIXED
                itemId,
                customer,
                operationId,
                date: new Date(),
                kanbanDate: kanDate,
                fim: selectedFim,
                contractList: optionsRowData?.selectedSampleKey       // ✅ FIXED
                    ? [optionsRowData.selectedSampleKey]
                    : rowContract,
                itemId: selectedRowItemId,
                inspecCategory
            }, handleProcessInspecSubmitSuccess, handleProcessInspecSubmitException)

            :
            AssemblyInspecSubmit({
                qlty: updatedInspectionList,
                qcTestNo: qTestNo,
                serialNo: serialNo,
                type: selectedOptionName,
                result: '',
                status: 'approved',
                reason: "",
                remarks: '',
                // jCId,  
                contractNo,
                machId,
                qty,
                itemId,
                customer,
                operationId,
                date,
                // shift2,
            }, handleProcessInspecSubmitSuccess, handleProcessInspecSubmitException);
    }

    // const handleProcessInspecSubmitSuccess = (dataObject) => {
    //     console.log('Success Callback:', dataObject);
    //     setNotification({
    //         status: true,
    //         type: 'success',
    //         message: dataObject.message,
    //     });
    //     setPageRefresher(prev => !prev);
    //     setTimeout(() => {
    //         setOpenFPIApprovePopup(false);
    //         setQTestNo('');
    //         setSerialNo('');
    //     }, 3000);
    // };
    const handleProcessInspecSubmitSuccess = (dataObject) => {
        console.log('Success Callback:', dataObject);

        // 🔥 Step-2 logic (apply update after approval)
        updateSampleProgress();

        // UI feedback
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        // Refresh table from parent
        setPageRefresher(prev => !prev);

        setTimeout(() => {
            setOpenFPIApprovePopup(false);
            setQTestNo('');
            setSerialNo('');
        }, 1000);
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
                                label={contractRadioChange === 'assemblyPlan' ? "Part No" : "Contract No"}
                                variant="outlined"
                                fullWidth
                                required
                                value={contractRadioChange === 'assemblyPlan' ? selectedRowItemCode : contractNo}
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
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type='submit'>
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

export default AssemblyFPIApprovePopup;