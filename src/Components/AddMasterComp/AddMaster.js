
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
    Autocomplete,
    CircularProgress
}
    from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AllMasterAdd, AllMasterUpdate, AllShowMasterAdd, GetCountryStates } from '../../ApiService/LoginPageService';

const AddMaster = (props) => {
    const { open, setOpen, isAddButton, currencyData, setRefreshData, configSetupData } = props;

    //NEW STATE VARIBALES
    const [isActive, setIsActive] = useState(false);
    const [selectedMaster, setSelectedMaster] = useState('');
    const [masterId, setMasterId] = useState('');
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [inactiveRemarks, setInactiveRemarks] = useState('');
    const [packingCharge, setPackingCharge] = useState('');
    const [chapterHDR, setChapterHDR] = useState('');
    const [isStoreGroup, setIsStoreGroup] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [cityName, setCityName] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [vendorProcess, setVendorProcess] = useState(0);
    const [countryLists, setCountryLists] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [stateLists, setStateLists] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [pincode, setPincode] = useState('');
    const [loading, setLoading] = useState(false);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [rowId, setRowId] = useState('')

    useEffect(() => {
        loaderData();
    }, [currencyData]);

    useEffect(() => {
        if (!isActive) {
            setInactiveRemarks('');
        }
    }, [isActive]);

    useEffect(() => {
        if (selectedMaster === "state" || selectedMaster === "city") {
            AllShowMasterAdd(
                { masterType: 'country' },
                handleSucessShow,
                handleExceptionShow
            );
        }
    }, [selectedMaster, configSetupData]);

    const handleSucessShow = (dataObject) => {
        setCountryLists(dataObject?.data || []);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

    }

    const typeList = [
        { id: 1, typeName: 'Transactions', typeValue: 'transactions' },
        { id: 1, typeName: 'Masters', typeValue: 'masters' },
        { id: 1, typeName: 'Reports', typeValue: 'reports' },
        { id: 1, typeName: 'Utilities', typeValue: 'utilities' },
    ]

    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        if (isAddButton) {
            AllMasterAdd({
                masterType: selectedMaster,
                masterId: masterId,
                code: code,
                name: name,
                inactiveStatus: isActive,
                inactiveRemarks: inactiveRemarks,
                description: description,
                chapterHdr: chapterHDR,
                isstoreGroup: isStoreGroup,
                type: selectedType,
                city: cityName,
                state: state,
                country: country,
                countryId: selectedCountry,
                stateId: selectedState,
                packingCharge: packingCharge,
                // pinCode: pincode,
                vendorProcess: selectedMaster === 'pm' ? vendorProcess : ''
            }, handleSuccess, handleException)
        } else {
            AllMasterUpdate({
                id: rowId,
                masterType: selectedMaster,
                masterId: masterId,
                code: code,
                name: name,
                inactiveStatus: isActive,
                inactiveRemarks: inactiveRemarks,
                description: description,
                chapterHdr: chapterHDR,
                isstoreGroup: isStoreGroup,
                type: selectedType,
                city: cityName,
                state: state,
                country: country,
                countryId: selectedCountry,
                stateId: selectedState,
                packingCharge: packingCharge,
                // pinCode: pincode,
                vendorProcess: selectedMaster === 'pm' ? vendorProcess : ''
            }, handleSuccess, handleException)
        }
    }

    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setLoading(false);
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        console.log("the error ", errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
            setLoading(false);
        }, 2000);
    };

    const ClearData = () => {
        setIsActive(false);
        setSelectedMaster('');
        setMasterId('');
        setCode('');
        setName('');
        setDescription('');
        setInactiveRemarks('');
        setPackingCharge('');
        setSelectedType('');
        setVendorProcess(0);
        setCountryLists([]);
        setStateLists([]);
        setSelectedCountry('');
        setSelectedState('');
        setPincode('')
        setOpen(false);
        setRefreshData(oldvalue => !oldvalue);
    }

    const loaderData = () => {
        setRowId(configSetupData?.id || '')
        setSelectedMaster(configSetupData?.masterType || '');
        // setMasterId(configSetupData?.categoryDescription || '');
        setCode(configSetupData?.code || '');
        setName(configSetupData?.name || '');
        setDescription(configSetupData?.description || '');
        setIsActive(configSetupData?.inactiveStatus || '');
        setInactiveRemarks(configSetupData?.inactiveRemarks || '');
        setPackingCharge(configSetupData?.packingCharge || '');
        setSelectedType(configSetupData?.type || '');
        setCityName(configSetupData?.cityName || '');
        setCountry(configSetupData?.country || '');
        setState(configSetupData?.state || '');
        setVendorProcess(configSetupData?.vendorProcess || 0);
        setSelectedCountry(configSetupData?.countryId || '');
        setSelectedState(configSetupData?.stateId || '');
        // setPincode(configSetupData?.pinCode || '');
        !isAddButton && GetCountryStates({ id: configSetupData?.countryId }, handleStateSuccess, handleStateException);
    }

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
        // { id: 2, masterName: 'Machine', value: 'machine' },
        // { id: 9, masterName: 'Ledger Group', value: 'ledgerGroup' },
        // { id: 15, masterName: 'FIM', value: 'fim' },
        // { id: 17, masterName: 'LOC', value: 'loc' },
        { id: 1, masterName: 'PM', value: 'pm' },
        { id: 2, masterName: 'Customer Group', value: 'customerGroup' },
        { id: 3, masterName: 'Role', value: 'role' },
        { id: 4, masterName: 'Department', value: 'department' },
        { id: 5, masterName: 'SP', value: 'sp' },
        { id: 6, masterName: 'Currency', value: 'currency' },
        { id: 7, masterName: 'DTR', value: 'dtr' },
        { id: 8, masterName: 'Section', value: 'section' },
        { id: 9, masterName: 'State', value: 'state' },
        { id: 10, masterName: 'Supplier Group', value: 'supplierGroup' },
        { id: 11, masterName: 'Tool', value: 'tool' },
        { id: 12, masterName: 'UOM', value: 'uom' },
        { id: 13, masterName: 'Item Group', value: 'itemGroup' },
        { id: 14, masterName: 'TARIFF', value: 'tarrif' },
        { id: 15, masterName: 'TRF', value: 'trf' },
        { id: 16, masterName: 'Designation', value: 'designation' },
        { id: 17, masterName: 'Menu Master', value: 'menu' },
        { id: 18, masterName: 'Product Master', value: 'product' },
        { id: 19, masterName: 'Location Master', value: 'location' },
        { id: 20, masterName: 'Country', value: 'country' },
        { id: 21, masterName: 'City', value: 'city' },
        //ITEM MASTER
        { id: 22, masterName: 'Under Ledger', value: 'underLedger' },
        { id: 23, masterName: 'Reorder', value: 'reorder' },
        { id: 24, masterName: 'Main Location', value: 'mainLocation' },
        { id: 25, masterName: 'HSNCode', value: 'hsnCode' },
        { id: 26, masterName: 'Sub Location', value: 'subLocation' },
        { id: 27, masterName: 'Product Finish', value: 'productFinish' },
        { id: 28, masterName: 'Product Family', value: 'productFamily' },
        { id: 29, masterName: 'Category', value: 'category' },
        { id: 30, masterName: 'FIM', value: 'fim' },
        { id: 31, masterName: 'RM Itemcode', value: 'rmItemcode' },
        { id: 32, masterName: 'BUY PRODUCTION', value: 'BUYPRODUCTION' },
        { id: 33, masterName: 'Place of Supply', value: 'placeOfSupply' },
        { id: 34, masterName: 'Display Name', value: 'displayName' },
        { id: 35, masterName: 'Inspection Level', value: 'inspectionLevel' },
        { id: 36, masterName: 'Problem Category', value: 'problemCategory' },
        { id: 37, masterName: 'Nature of Problem', value: 'natureOfProblem' },
    ]

    const handleStateSuccess = (dataObject) => {
        setStateLists(dataObject?.data || []);
    }
    const handleStateException = () => { }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '60%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {isAddButton ? 'Add Master' : 'Edit Master'}
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                            <FormControl fullWidth style={{ marginTop: '10px' }}>
                                <InputLabel id="demo-simple-select-label">Select Master</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedMaster}
                                    label="Select Master"
                                    size='small'
                                    variant="filled"
                                    onChange={(e) => setSelectedMaster(e.target.value)}
                                >
                                    {masterList.map((data) => (
                                        <MenuItem key={data.id} value={data.value}>{data.masterName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {selectedMaster === "state" || selectedMaster === "city" ? <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                            <FormControl fullWidth style={{ marginTop: '10px' }}>
                                <InputLabel id="demo-simple-select-label">Select Country</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedCountry}
                                    label="Select Master"
                                    size='small'
                                    variant="filled"
                                    onChange={(e) => {
                                        setSelectedCountry(e.target.value)
                                        GetCountryStates({ id: e.target.value }, handleStateSuccess, handleStateException);
                                    }}
                                >
                                    {countryLists.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                            :
                            null
                        }

                        {selectedMaster === "city" && <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                            <FormControl fullWidth style={{ marginTop: '10px' }}>
                                <InputLabel id="demo-simple-select-label">Select State</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedState}
                                    label="Select Master"
                                    size='small'
                                    variant="filled"
                                    onChange={(e) => {
                                        setSelectedState(e.target.value)
                                    }}
                                >
                                    {stateLists.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        }

                        {
                            selectedMaster === 'menu' &&
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                <FormControl fullWidth style={{ marginTop: '10px' }}>
                                    <InputLabel id="demo-simple-select-label">Select Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedType}
                                        label="Select Type"
                                        variant="filled"
                                        size='small'
                                        onChange={(e) => setSelectedType(e.target.value)}
                                    >
                                        {typeList.map((data) => (
                                            <MenuItem key={data.id} value={data.typeName}>{data.typeName}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        }

                        {
                            selectedMaster !== 'product' && selectedMaster !== 'location' && (
                                <>

                                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <TextField
                                            id="filled-basic"
                                            label="Code"
                                            variant="filled"
                                            value={code}
                                            onChange={(e) => {
                                                if (selectedMaster === 'menu') {
                                                    const tempValue = e.target.value.replace(/\s+/g, '');
                                                    setCode(tempValue);
                                                } else {
                                                    setCode(e.target.value);
                                                }

                                            }}
                                            sx={{ mb: 1 }}
                                            margin="dense"
                                            size="small"
                                            fullWidth
                                            required
                                            placeholder="Code"
                                        />
                                    </Grid>
                                </>
                            )
                        }
                        {
                            selectedMaster === 'location' ? (
                                <>
                                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <TextField
                                            id="filled-basic"
                                            label="City Name"
                                            variant="filled"
                                            value={cityName}
                                            onChange={(e) => {
                                                setCityName(e.target.value);
                                            }}
                                            sx={{ mb: 1 }}
                                            size='small'
                                            margin="dense"
                                            fullWidth
                                            required
                                            placeholder="City Name"

                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <TextField
                                            id="filled-basic"
                                            label="State"
                                            variant="filled"
                                            size='small'
                                            value={state}
                                            onChange={(e) => {
                                                setState(e.target.value);
                                            }}
                                            sx={{ mb: 1 }}
                                            margin="dense"
                                            fullWidth
                                            required
                                            placeholder="State"

                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <TextField
                                            id="filled-basic"
                                            label="Country"
                                            variant="filled"
                                            size='small'
                                            value={country}
                                            onChange={(e) => {
                                                setCountry(e.target.value);
                                            }}
                                            sx={{ mb: 1 }}
                                            margin="dense"
                                            fullWidth
                                            required
                                            placeholder="Country"
                                        />
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                        <TextField
                                            id="filled-basic"
                                            label="Name"
                                            variant="filled"
                                            sx={{ mb: 1 }}
                                            margin="dense"
                                            fullWidth
                                            required
                                            size="small"
                                            value={name}
                                            onChange={(e) => {
                                                if (selectedMaster === 'menu') {
                                                    const tempValue = e.target.value.replace(/\s+/g, '');
                                                    console.log('tempValue===>', tempValue);
                                                    setName(tempValue);
                                                } else {
                                                    setName(e.target.value);
                                                }
                                            }}
                                            placeholder="Name"
                                        />
                                    </Grid>
                                </>
                            )
                        }


                        {selectedMaster === "city" &&
                            <>
                            </>
                            // <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            //     <TextField
                            //         id="filled-basic"
                            //         label="Pincode"
                            //         variant="filled"
                            //         sx={{ mb: 1 }}
                            //         margin="dense"
                            //         size='small'
                            //         fullWidth
                            //         required
                            //         value={pincode}
                            //         onChange={(e) => {
                            //             setPincode(e.target.value)
                            //         }}
                            //         placeholder="Pincode"
                            //         inputProps={{ maxLength: 6 }}
                            //         type='text'
                            //     />
                            // </Grid>
                        }

                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <TextField
                                id="filled-basic"
                                label="Description"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                }}
                                placeholder="Description"

                            />
                        </Grid>
                        {/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
                        {
                            selectedMaster === 'pm' &&
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <FormControl fullWidth variant="standard" style={{ marginTop: '9px' }}>
                                    <InputLabel id="demo-simple-select-label">InHouse/VendorProcess</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="InHouse/VendorProcess"
                                        variant="filled"
                                        size='small'
                                        value={vendorProcess}
                                        onChange={(e) => setVendorProcess(e.target.value)}
                                    >
                                        <MenuItem value={0}>InHouse</MenuItem>
                                        <MenuItem value={1}>Vendor Process</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        }

                        <Grid
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            item
                            xs={12}
                            sm={12}
                            md={4}
                            lg={4}
                            xl={4}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                    />
                                }
                                label="Inactive"
                            />
                        </Grid>


                        {isActive ?
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    id="filled-basic"
                                    label="Inactive Remarks"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    fullWidth
                                    size='small'
                                    required
                                    value={inactiveRemarks}
                                    onChange={(e) => {
                                        setInactiveRemarks(e.target.value);
                                    }}
                                    placeholder="Inactive Remarks"

                                />
                            </Grid> : null}


                    </Grid>
                    {
                        selectedMaster === "fim" &&
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <TextField
                                id="filled-basic"
                                label="Packing Charge"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                value={packingCharge}
                                onChange={(e) => setPackingCharge(e.target.value)}
                                placeholder="FIM No"

                            />
                        </Grid>
                    }
                    {/* {
                        selectedMaster === "fim" &&
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    id="filled-basic"
                                    label="FIM No"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    size='small'
                                    fullWidth
                                    required
                                    // value={currencyCode}
                                    placeholder="FIM No"

                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    id="filled-basic"
                                    label="PBRATE"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    size='small'
                                    fullWidth
                                    required
                                    // value={currencyCode}
                                    placeholder="PBRATE"

                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    id="filled-basic"
                                    label="FIMPX"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    size='small'
                                    fullWidth
                                    required
                                    // value={currencyCode}
                                    placeholder="FIMPX"

                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    id="filled-basic"
                                    label="Job"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    size='small'
                                    fullWidth
                                    required
                                    // value={currencyCode}
                                    placeholder="Job"

                                />
                            </Grid>

                        </Grid>

                    }  */}
                    {
                        selectedMaster === "itemGroup" &&
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    label="CHAPTERHDR"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    size='small'
                                    fullWidth
                                    value={chapterHDR}
                                    placeholder="CHAPTERHDR"
                                    onChange={(e) => setChapterHDR(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    label="Is Store Group "
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    size='small'
                                    fullWidth
                                    value={isStoreGroup}
                                    placeholder="Is Store Group"
                                    onChange={(e) => setIsStoreGroup(e.target.value)}
                                />
                            </Grid>

                        </Grid>
                    }
                    {
                        selectedMaster === 'loc' &&
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    id="filled-basic"
                                    label="LOC DISP Name"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    size='small'
                                    fullWidth
                                    required
                                    // value={currencyCode}
                                    placeholder="LOC DISP Name"

                                />
                            </Grid>

                        </Grid>
                    }
                    {
                        selectedMaster === 'tariff' &&
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    id="filled-basic"
                                    label="TARIFF"
                                    variant="filled"
                                    size='small'
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    fullWidth
                                    required
                                    // value={currencyCode}
                                    placeholder="TARIFF"

                                />
                            </Grid>

                        </Grid>
                    }
                    {
                        selectedMaster === 'trf' &&
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    label="GST No"
                                    variant="filled"
                                    size='small'
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    fullWidth
                                    required
                                    // value={currencyCode}
                                    placeholder="GST No"

                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    label="TRA Disp Name"
                                    variant="filled"
                                    size='small'
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    fullWidth
                                    required
                                    // value={currencyCode}
                                    placeholder="TRA Disp Name"

                                />
                            </Grid>

                        </Grid>
                    }
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: loading ? 'gray' : '#002D68', color: 'white' }}
                            disabled={loading}
                            // disabled={
                            //     errorObject?.customerId?.errorStatus
                            //     || errorObject?.GSTNumber?.errorStatus
                            //     || errorObject?.customerName?.errorStatus
                            //     || errorObject?.billingAddress?.errorStatus
                            //     || errorObject?.address?.errorStatus
                            //     || errorObject?.shippingAddress?.errorStatus
                            //     || errorObject?.contactPersonName?.errorStatus
                            //     || errorObject?.primaryContactnumber?.errorStatus
                            //     || errorObject?.phoneNumber?.errorStatus
                            //     || errorObject?.email?.errorStatus
                            // }
                            type="submit"

                        >
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (isAddButton ? 'Add' : 'Update')}
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setOpen(false);
                                loaderData();
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

export default AddMaster
