import {
    Button, Box, Dialog, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { CheckBox } from '@mui/icons-material';

const CustomerHeaderModul = ({
    open, setOpen, isAddButton, customerData, setRefreshData,
}) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [multiOpen, setMultiOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);

    useEffect(() => {

    }, [customerData]);


    const handleSubmit = (e) => {
        e.preventDefault();

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
            maxWidth="xl"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {isAddButton ? 'Add Custom Header' : 'Edit Custom Header'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Currency [Mst]</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    // value={age}
                                    label="Currency [Mst]"
                                    variant="filled"
                                // onChange={handleChange}
                                >
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="PANNO"
                                placeholder='PANNO'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="GSTIN/UIN ID"
                                placeholder='GSTIN/UIN ID'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="BILL PHONE NO"
                                placeholder='BILL PHONE NO'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="BILL Fax No"
                                placeholder='BILL Fax No'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="E-Mail"
                                placeholder='E-Mail'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="Payment Terms"
                                placeholder='Payment Terms'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="NO Tax Remarks"
                                placeholder='NO Tax Remarks'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="Credit Days"
                                placeholder='Credit Days'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Place of Supply [Mst]</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    // value={age}
                                    label="Place of Supply"
                                    variant="filled"
                                // onChange={handleChange}
                                >
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>

                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="TCS Collected"
                                placeholder='TCS Collected'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="Surcharges on TCS "
                                placeholder='Surcharges on TCS'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="Cess on TCS"
                                placeholder='Cess on TCS'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label=" Single Sales Order"
                                placeholder='Single Sales Order'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="Apply DC Value"
                                placeholder='Apply DC Value'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="Auto SO Short Close  "
                                placeholder='Auto SO Short Close'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label=" CGST %"
                                placeholder='CGST %'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="SGST%"
                                placeholder='SGST%'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="IGST%"
                                placeholder='IGST%'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="UTGST%"
                                placeholder='UTGST%'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="DC Info Required in"
                                placeholder='DC Info Required in'
                                variant="filled"
                                required

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <TextField
                                fullWidth
                                label="Max Line Items In"
                                placeholder='Max Line Items In'
                                variant="filled"
                                required

                            />
                        </Grid>

                    </Grid>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}

                            type="submit"

                        >
                            {isAddButton ? 'Add' : 'Update'}
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


                </DialogContent>

            </form>
        </Dialog>
    )
}

export default CustomerHeaderModul