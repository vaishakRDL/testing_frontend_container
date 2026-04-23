import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { AssemblyInspecSubmit, AssemblyInspecUniqueId, AssemblyPlanInspecSubmit, ProcessInspecSubmit, ProcessInspecUniqueId, ReworkreasonShowData } from '../../../ApiService/LoginPageService';

const AssemblyFPIReworkPopup = ({
    setOpenFPIReworkPopup,
    OpenFPIReworkPopup,
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
    setPageRefresher
}) => {
    const [qTestNo, setQTestNo] = useState('');
    const [serialNo, setSerialNo] = useState('');
    const [dataSet, setDataSet] = useState([]);
    const [Reason, setReason] = useState('');
    const [reamark, setRemark] = useState('');
    const [quantity, setQuantity] = useState('');

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (OpenFPIReworkPopup) {
            AssemblyInspecUniqueId(handleProcessInspecUniqueIdSucess, handleProcessInspecUniqueIdException);
            ReworkreasonShowData(handleQualityInsMstShow, handeQualityInsMstException);
        }
    }, [OpenFPIReworkPopup]);


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
        const { jCId, itemId, machId, operationId, qty, customer, date, shift2 } = topData || {};
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
        contractRadioChange === 'assemblyPlan' ?
            AssemblyPlanInspecSubmit({
                qlty: updatedInspectionList,
                qcTestNo: qTestNo,
                serialNo: serialNo,
                type: selectedOptionName,
                result: '',
                status: 'rework',
                reason: Reason,
                remarks: reamark,
                // jCId,  
                contractNo,
                machId,
                rejRewQty: quantity,
                qty,

                itemId,
                customer,
                operationId,
                date: new Date(),
                kanbanDate: kanDate,
                fim: selectedFim,
                contractList: rowContract,
                itemId: selectedRowItemId
                // shift2,
            }, handleProcessInspecSubmitSuccess, handleProcessInspecSubmitException)
            :
            AssemblyInspecSubmit({
                qlty: updatedInspectionList,
                qcTestNo: qTestNo,
                serialNo: serialNo,
                type: selectedOptionName,
                result: '',
                status: 'rework',
                reason: Reason,
                remarks: reamark,
                // jCId,  
                contractNo,
                machId,
                rejRewQty: quantity,
                qty, itemId,
                customer,
                operationId,
                date,
                // shift2,
            }, handleProcessInspecSubmitSuccess, handleProcessInspecSubmitException);
    }

    const handleProcessInspecSubmitSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setPageRefresher(prev => !prev);
        setTimeout(() => {
            setOpenFPIReworkPopup(false);
            setQTestNo('');
            setSerialNo('');
            setReason('');
            setRemark('');
            setQuantity('');
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
                                label={contractRadioChange === 'assemblyPlan' ? "Part No" : "Contract No"}
                                variant="outlined"
                                fullWidth
                                required
                                value={contractRadioChange === 'assemblyPlan' ? selectedRowItemCode : contractNo}
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

export default AssemblyFPIReworkPopup;