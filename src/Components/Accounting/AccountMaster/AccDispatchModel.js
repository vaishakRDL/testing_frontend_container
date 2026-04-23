import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Grid, TextField } from '@mui/material';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { MstDispatchAdd, MstDispatchUpdate } from '../../../ApiService/LoginPageService';

const AccDispatchModel = ({ open, setOpen, isAddButton, editDispatch, setRefreshData, setNotification }) => {
    const [dispatch, setDispatch] = useState('');
    const [dispatchName, setDispatchName] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [addressLine3, setAddressLine3] = useState('');
    const [addressLine4, setAddressLine4] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [country, setCountry] = useState('');
    const [gstNo, setGstNo] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [panNo, setPanNo] = useState('');
    const [placeOfSupply, setPlaceOfSupply] = useState('');
    const [defaultText, setDefaultText] = useState('');
    const [inActive, setInActive] = useState('');
    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState('');
    const [irn, setIRN] = useState('');
    const [ackNo, setAckNo] = useState('');
    const [ackDate, setAckDate] = useState('');

    const handleClose = () => {
        setOpen(false);
        ClearData();
    }

    useEffect(() => {
        setDispatch(editDispatch?.code || '');
        setDispatchName(editDispatch?.name || '');
        setAddressLine1(editDispatch?.add1 || '');
        setAddressLine2(editDispatch?.add2 || '');
        setAddressLine3(editDispatch?.add3 || '');
        setAddressLine4(editDispatch?.add4 || '');
        setCity(editDispatch?.city || '');
        setState(editDispatch?.state || '');
        setPincode(editDispatch?.pinCode || '');
        setCountry(editDispatch?.country || '');
        setGstNo(editDispatch?.gstNo || '');
        setStateCode(editDispatch?.stateCode || '');
        setPanNo(editDispatch?.panNo || '');
        setPlaceOfSupply(editDispatch?.placeOfSupply || '');
        setDefaultText(editDispatch?.defaultField || '');
        setInActive(editDispatch?.inActive || '');
    }, [editDispatch])

    const ClearData = () => {
        setDispatch('');
        setDispatchName('');
        setAddressLine1('');
        setAddressLine2('');
        setAddressLine3('');
        setAddressLine4('');
        setCity('');
        setState('');
        setPincode('');
        setCountry('');
        setGstNo('');
        setStateCode('');
        setPanNo('');
        setPlaceOfSupply('');
        setDefaultText('');
        setInActive('');
        setRefreshData(oldValue => !oldValue);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        isAddButton === true ?
            (
                MstDispatchAdd({
                    code: dispatch,
                    name: dispatchName,
                    add1: addressLine1,
                    add2: addressLine2,
                    add3: addressLine3,
                    add4: addressLine4,
                    city: city,
                    state: state,
                    pinCode: pincode,
                    country: country,
                    gstNo: gstNo,
                    stateCode: stateCode,
                    panNo: panNo,
                    placeOfSupply: placeOfSupply,
                    defaultField: defaultText,
                    inActive: inActive
                }, handleSuccess, handleException)
            ) : (
                MstDispatchUpdate({
                    id: editDispatch.id,
                    code: dispatch,
                    name: dispatchName,
                    add1: addressLine1,
                    add2: addressLine2,
                    add3: addressLine3,
                    add4: addressLine4,
                    city: city,
                    state: state,
                    pinCode: pincode,
                    country: country,
                    gstNo: gstNo,
                    stateCode: stateCode,
                    panNo: panNo,
                    placeOfSupply: placeOfSupply,
                    defaultField: defaultText,
                    inActive: inActive
                }, handleUpdateSuccess, handleException)
            );
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
            setRefreshData(oldValue => !oldValue);
            setLoading(false);
        }, 2000);
    }

    const handleUpdateSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setRefreshData(oldValue => !oldValue);
            setLoading(false);
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        console.log(errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
            setRefreshData(oldValue => !oldValue);
            setLoading(false);
        }, 2000);
    }

    return (
        <div>
            <Dialog sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
                maxWidth="xl"
                open={open}>
                <form onSubmit={onSubmit}>
                    <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        {isAddButton ? 'Add Dispatch' : 'Edit Dispatch '}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{ marginTop: '10px' }}>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="Dispatch Code"
                                    placeholder='Dispatch Code'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setDispatch(e.target.value) }}
                                    value={dispatch}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="Dispatch Name"
                                    placeholder='Dispatch Name'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setDispatchName(e.target.value) }}
                                    value={dispatchName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="Address Line1"
                                    placeholder='Address Line1'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setAddressLine1(e.target.value) }}
                                    value={addressLine1}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="Address Line2"
                                    placeholder='Address Line2'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setAddressLine2(e.target.value) }}
                                    value={addressLine2}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="Address Line3"
                                    placeholder='Address Line3'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setAddressLine3(e.target.value) }}
                                    value={addressLine3}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="Address Line4"
                                    placeholder='Address Line4'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setAddressLine4(e.target.value) }}
                                    value={addressLine4}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    placeholder='City'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setCity(e.target.value) }}
                                    value={city}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    placeholder='State'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setState(e.target.value) }}
                                    value={state}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="Pincode"
                                    placeholder='Pincode'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setPincode(e.target.value) }}
                                    value={pincode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="Country"
                                    placeholder='Country'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setCountry(e.target.value) }}
                                    value={country}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="GST No"
                                    placeholder='GST No'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setGstNo(e.target.value) }}
                                    value={gstNo}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="State Code"
                                    placeholder='State Code'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setStateCode(e.target.value) }}
                                    value={stateCode}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="PAN NO"
                                    placeholder='PAN NO'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setPanNo(e.target.value) }}
                                    value={panNo}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="Place Of Supply"
                                    placeholder='Place Of Supply'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setPlaceOfSupply(e.target.value) }}
                                    value={placeOfSupply}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <TextField
                                    fullWidth
                                    label="Default"
                                    placeholder='Default'
                                    variant="outlined"
                                    required
                                    onChange={(e) => { setDefaultText(e.target.value) }}
                                    value={defaultText}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={inActive} onChange={(e) => setInActive(e.target.checked)} />} label="Inactive" />
                                </FormGroup>
                            </Grid>
                            {/* <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="Address"
                                    placeholder='Address'
                                    variant="outlined"
                                    size='small'
                                    multiline
                                    required
                                    onChange={(e) => { setAddress(e.target.value) }}
                                    value={address}
                                />
                            </Grid>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="IRN"
                                    placeholder='IRN'
                                    variant="outlined"
                                    size='small'
                                    onChange={(e) => { setIRN(e.target.value) }}
                                    value={irn}
                                />
                            </Grid>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="Ack No"
                                    placeholder='Ack No'
                                    variant="outlined"
                                    size='small'
                                    required
                                    onChange={(e) => { setAckNo(e.target.value) }}
                                    value={ackNo}
                                />
                            </Grid>
                            <Grid item  xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="Ack Date"
                                    placeholder='Ack Date'
                                    type='date'
                                    variant="outlined"
                                    size='small'
                                    required
                                    onChange={(e) => { setAckDate(e.target.value) }}
                                    value={ackDate}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid> */}
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            disabled={loading === true}
                            type="submit">
                            {/* {isAddButton ? 'Add' : 'Update'} */}
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (isAddButton ? 'Add' : 'Update')}
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}

export default AccDispatchModel
