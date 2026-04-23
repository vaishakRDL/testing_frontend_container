import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    TextField,
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    CircularProgress
}
    from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AddMapInspectionBatchQty, AllMasterAdd, AllMasterUpdate, EditMapInspectionBatchQty, GetInspectionLists, GetQualityRule, GetQualityRuleMapInspection } from '../../ApiService/LoginPageService';

const QualitySettingMapModal = (props) => {
    const { open, setOpen, isAddButton, editData, setRefreshData, } = props;

    //NEW STATE VARIBALES
    const [selectedMaster, setSelectedMaster] = useState('');
    const [submitloading, setSubmitLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [qualityRuleLists, setQualiotyRuleLists] = useState([])
    const [selectedQualityRule, setSelectedQualityRule] = useState('');
    const [lotSizeFrom, setLotSizeFrom] = useState('');
    const [lotSizeTo, setLotSizeTo] = useState('');
    const [batchQtyName, setBatchQtyName] = useState('');
    const [batchQty, setBatchQty] = useState('');
    const [batchQtyNameLists, setbatchQtyNameLists] = useState([]);
    const [inspectionType, setInspectionType] = useState('');

    useEffect(() => {
        LoadingData();
        open && /*GetQualityRule({
            masterType: selectedMaster
        }, handleSucessShow, handleExceptionShow);*/
        open && GetInspectionLists(hadleInspectionListSuccess, ShowInspectionListException);

        if (inspectionType) {
            GetQualityRuleMapInspection(
              { type: inspectionType },
              handleMapSuccess,
              handleMapException
            );
          }
    }, [editData, open,inspectionType]);

const handleMapSuccess=(dataObject)=>{
    setQualiotyRuleLists(dataObject?.data || []);
}

const handleMapException=()=>{}



    const hadleInspectionListSuccess = (dataObject) => {
        setbatchQtyNameLists(dataObject?.data || []);
    }
    const ShowInspectionListException = () => { }

    // const handleSucessShow = (dataObject) => {
    //     setQualiotyRuleLists(dataObject?.data || []);
    // }
    // const handleExceptionShow = (errorObject, errorMessage) => {
    // }


    const ClearData = () => {
        setOpen(false);
        setSelectedQualityRule('');
        setLotSizeFrom('');
        setLotSizeTo('');
        setBatchQty('');
        setBatchQtyName('');
        setInspectionType('');
    }

    const LoadingData = () => {
        setSelectedQualityRule(editData?.qcRuleId || '');
        setLotSizeFrom(editData?.lotFrom || '');
        setLotSizeTo(editData?.lotTo || '');
        setBatchQty(editData?.batchQty || '');
        setBatchQtyName(editData?.inspectionLevelId || '');
    }
    const handleSubmit = (e) => {
        setSubmitLoading(true)
        e.preventDefault();
        if (isAddButton) {
            AddMapInspectionBatchQty({
                qcRuleId: selectedQualityRule,
                lotFrom: lotSizeFrom,
                lotTo: lotSizeTo,
                batchQtyName: batchQtyName,
                batchQty: batchQty
            }, handleSuccess, handleException);
        } else {
            EditMapInspectionBatchQty({
                id: editData?.id,
                qcRuleId: selectedQualityRule,
                lotFrom: lotSizeFrom,
                lotTo: lotSizeTo,
                batchQtyName: batchQtyName,
                batchQty: batchQty
            }, handleUpdateSuccess, handleException);
        }
    };

    const handleSuccess = (dataObject) => {
        setSubmitLoading(false)
        console.log("the dataObject ", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setRefreshData(oldValue => !oldValue);
        }, 2000);
    };

    const handleUpdateSuccess = (dataObject) => {
        setSubmitLoading(false)
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setRefreshData(oldValue => !oldValue);
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        setSubmitLoading(false)

        console.log("the error ", errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
            setRefreshData(oldValue => !oldValue);
        }, 2000);
    };
    const validateForNullValue = (value, type) => {

    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const masterList = [
        // { id: 1, masterName: 'Currency', value: 'currency' },
        { id: 2, masterName: 'Supply Type', value: 'supplyType' },
        // { id: 3, masterName: 'GSTIN/UIN ID', value: 'gstinOrUin' },
        { id: 4, masterName: 'Place of Supply', value: 'placeOfSupply' },
    ]

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '60%', maxHeight: '100%' } }}
            maxWidth="md"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {isAddButton ? 'Add Map Inspection Batch Qty' : 'Edit Map Inspection Batch Qty'}
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                            <FormControl fullWidth style={{ marginTop: '10px' }}>
                                <InputLabel id="demo-simple-select-label">Inspection Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={inspectionType}
                                    label="Inspection Type"
                                    variant="filled"
                                    size='small'
                                    onChange={(e) => setInspectionType(e.target.value)}
                                >
                                    {/* <MenuItem value={'production'}>Production</MenuItem> */}
                                    <MenuItem value={'assembly'}>Assembly</MenuItem>
                                    <MenuItem value={'inward'}>Inward</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                            <FormControl fullWidth style={{ marginTop: '10px' }}>
                                <InputLabel id="demo-simple-select-label">Quality Rule</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedQualityRule}
                                    label="Quality Rule"
                                    variant="filled"
                                    size='small'
                                    onChange={(e) => setSelectedQualityRule(e.target.value)}
                                >
                                    {
                                        qualityRuleLists.map((data) => (
                                            <MenuItem key={data.id} value={data.id}>{data.qcRule}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Lot Size From"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                value={lotSizeFrom}
                                onChange={(e) => {
                                    setLotSizeFrom(e.target.value);
                                }}
                                placeholder="Lot Size From"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Lot Size To"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                value={lotSizeTo}
                                onChange={(e) => {
                                    setLotSizeTo(e.target.value);
                                }}
                                placeholder="Lot Size To"
                            />
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Batch Qty Name"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                value={batchQtyName}
                                onChange={(e) => {
                                    setBatchQtyName(e.target.value);
                                }}
                                placeholder="Batch Qty Name"
                            />
                        </Grid> */}
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                            <FormControl fullWidth style={{ marginTop: '10px' }}>
                                <InputLabel id="demo-simple-select-label">Batch Qty Name</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={batchQtyName}
                                    label="Batch Qty Name"
                                    variant="filled"
                                    size='small'
                                    onChange={(e) => setBatchQtyName(e.target.value)}
                                >
                                    {batchQtyNameLists.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                id="filled-basic"
                                label="Batch Qty"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                value={batchQty}
                                onChange={(e) => {
                                    setBatchQty(e.target.value);
                                }}
                                placeholder="Batch Qty"
                            />
                        </Grid>
                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type="submit"
                            disabled={submitloading}
                        >
                            {submitloading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (
                                isAddButton ? 'Add' : 'Update'
                            )}
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setOpen(false);

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

        </Dialog >
    )
}

export default QualitySettingMapModal;