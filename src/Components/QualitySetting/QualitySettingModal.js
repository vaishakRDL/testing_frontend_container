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
    CircularProgress,
    Select
}
    from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AddQualityRule, AllMasterAdd, AllMasterUpdate, EditQualityRule, GetCategoryLists, GetDisplayName, GetInspectionLists, GetMaterialLists, ItemGroupShowMaster, } from '../../ApiService/LoginPageService';
import { Category } from '@mui/icons-material';

const QualitySettingModal = (props) => {
    const { open, setOpen, isAddButton, editData, setRefreshData, } = props;

    //NEW STATE VARIBALES
    const [submitloading, setSubmitLoading] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [inspectionType, setInspectionType] = useState('');
    const [category, setCategory] = useState('');
    const [material, setMaterial] = useState('');
    const [displayNameLists, setDisplayNameLists] = useState([]);
    const [inspectionlevelLists, setinspectionlevelLists] = useState([]);
    const [displayName, setDisplayName] = useState('');
    const [inspectionPlan, setInspectionPlan] = useState('');
    const [inspectionLevel, setInspectionLevel] = useState('');
    const [categoryLists, setCategoryLists] = useState([]);
    const [materialLists, setMaterialLists] = useState([]);
    const [itemGroupLists, setItemGroupLists] = useState([]);
    const [selectedItemGroup, setSelectedItemGroup] = useState('')

    useEffect(() => {
        LoadingData();
        open && GetCategoryLists(handleCategorySuccess, handleCategoryException);
        open && GetMaterialLists(handleMaterialSuccess, handleMaterialException);
        open && ItemGroupShowMaster({ masterType: "itemGroup", }, hadleItemGroupShowMasterSuccess, ShowMasterException);
        open && GetDisplayName({ masterType: "displayName", }, hadleDisplayNameSuccess, ShowDisplayNameException);
        open && GetInspectionLists(hadleInspectionListSuccess, ShowInspectionListException);
    }, [editData, open]);

    const hadleInspectionListSuccess = (dataObject) => {
        setinspectionlevelLists(dataObject?.data || []);
    }
    const ShowInspectionListException = () => { }

    const hadleItemGroupShowMasterSuccess = (dataObject) => {
        setItemGroupLists(dataObject?.data || []);
    };
    const ShowMasterException = () => { };

    const hadleDisplayNameSuccess = (dataObject) => {
        setDisplayNameLists(dataObject?.data || []);
    }
    const ShowDisplayNameException = () => { }

    const handleCategorySuccess = (dataObject) => {
        setCategoryLists(dataObject?.data || []);
    }
    const handleCategoryException = () => { }

    const handleMaterialSuccess = (dataObject) => {
        setMaterialLists(dataObject?.data || []);
    }
    const handleMaterialException = () => { }

    const ClearData = () => {
        setInspectionType('')
        setCategory('')
        setMaterial('')
        setDisplayName('')
        setInspectionPlan('')
        setInspectionLevel('')
        setOpen(false);
    }

    const LoadingData = () => {
        setInspectionType(editData?.type || '');
        // setCategory(editData?.category || '');
        // setMaterial(editData?.material || '');
        setSelectedItemGroup(editData?.itemGroupId || '')
        setDisplayName(editData?.displayNameId || '');
        setInspectionPlan(editData?.inspectionPlan || '');
        setInspectionLevel(editData?.inspectionLevelId || '');
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        if (isAddButton) {

            AddQualityRule({
                type: inspectionType,
                // category: category,
                // material: material,
                itemGroupId: selectedItemGroup,
                displayName: displayName,
                inspectionPlan: inspectionPlan,
                inspectionLevel: inspectionLevel

            }, handleSuccess, handleException);
        } else {
            EditQualityRule({
                id: editData?.id,
                type: inspectionType,
                // category: category,
                // material: material,
                itemGroupId: selectedItemGroup,
                displayName: displayName,
                inspectionPlan: inspectionPlan,
                inspectionLevel: inspectionLevel

            }, handleUpdateSuccess, handleException);
        }
    };

    const handleSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject);
        setSubmitLoading(false);

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
        setSubmitLoading(false);

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
        console.log("the error ", errorMessage);
        setSubmitLoading(false);
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

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '60%', maxHeight: '100%' } }}
            maxWidth="md"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {isAddButton ? 'Add Quality Rule' : 'Edit Quality Rule'}
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
                                <InputLabel id="demo-simple-select-label">Item Group</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedItemGroup}
                                    label="Item Group"
                                    variant="filled"
                                    size='small'
                                    onChange={(e) => setSelectedItemGroup(e.target.value)}
                                >{itemGroupLists.map((data) => (
                                    <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                            <FormControl fullWidth style={{ marginTop: '10px' }}>
                                <InputLabel id="demo-simple-select-label">Material</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={material}
                                    label="Material"
                                    variant="filled"
                                    size='small'
                                    onChange={(e) => setMaterial(e.target.value)}
                                >{materialLists.map((data) => (
                                    <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid> */}

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            {/* <TextField
                                id="filled-basic"
                                label="Display Name"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                value={displayName}
                                onChange={(e) => {
                                    setDisplayName(e.target.value);
                                }}
                                placeholder="Display Name"

                            /> */}
                            <FormControl fullWidth style={{ marginTop: '10px' }}>
                                <InputLabel id="demo-simple-select-label">Display Name</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={displayName}
                                    label="Display Name"
                                    variant="filled"
                                    size='small'
                                    onChange={(e) => setDisplayName(e.target.value)}
                                >{displayNameLists.map((data) => (
                                    <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                            <FormControl fullWidth style={{ marginTop: '10px' }}>
                                <InputLabel id="demo-simple-select-label">Inspection Plan</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={inspectionPlan}
                                    label="Inspection Plan"
                                    variant="filled"
                                    size='small'
                                    onChange={(e) => setInspectionPlan(e.target.value)}
                                >
                                    <MenuItem value={'special'}>Special</MenuItem>
                                    <MenuItem value={'general'}>General</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                            <FormControl fullWidth style={{ marginTop: '10px' }}>
                                <InputLabel id="demo-simple-select-label">Inspection Level</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={inspectionLevel}
                                    label="Inspection Level"
                                    variant="filled"
                                    size='small'
                                    onChange={(e) => setInspectionLevel(e.target.value)}
                                >
                                    {/* <MenuItem value={"s1"}>S1</MenuItem>
                                    <MenuItem value={"s2"}>S2</MenuItem>
                                    <MenuItem value={"s3"}>S3</MenuItem>
                                    <MenuItem value={"s4"}>S4</MenuItem>
                                    <MenuItem value={"g1"}>G1</MenuItem>
                                    <MenuItem value={"g2"}>G2</MenuItem>
                                    <MenuItem value={"g3"}>G3</MenuItem> */}
                                    {inspectionlevelLists.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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

export default QualitySettingModal;