import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';

const ToolBreckMissing = ({ setToolMissOpen, toolMissOpen, isRes }) => {


    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {

    }, []);

    const ClearData = () => {

    }

    const handleSubmit = (e) => {


    }

    const handleSobAddSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setToolMissOpen(false);

        }, 3000);
    }

    const handleSobAddException = () => {

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
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="md"
            open={toolMissOpen}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                Tool Grinding | Replacement Due
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    {
                        isRes === 'ToolBreakdown' ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        id="filled-basic"
                                        label="Operator"
                                        variant="filled"

                                        fullWidth
                                        required

                                        placeholder="Operator"


                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        id="filled-basic"
                                        label="Part Id"
                                        variant="filled"

                                        fullWidth
                                        required

                                        placeholder="Part Id"


                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        id="filled-basic"
                                        label="Part Name"
                                        variant="filled"

                                        fullWidth
                                        required

                                        placeholder="Part Name"


                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Machine</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            variant="filled"
                                            label='Machine'
                                        >
                                            <MenuItem value='SelectOptions'>Select Options</MenuItem>
                                            <MenuItem value='Hold'>Hold</MenuItem>
                                            <MenuItem value='Mrp'>MRP</MenuItem>
                                            {/* <MenuItem value='GanttChart'>Gantt Chart</MenuItem> */}
                                            <MenuItem value='PlanOrder'>Schedule Order</MenuItem>
                                            <MenuItem value='RescheduleOrder'>Reschedule Order</MenuItem>
                                            <MenuItem value='SplitOrder'>Split Order</MenuItem>
                                            <MenuItem value='FreeComplete'>Force Complete</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Tool </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            variant="filled"
                                            label='Machine'
                                        >
                                            <MenuItem value='SelectOptions'>Select Options</MenuItem>
                                            <MenuItem value='Hold'>Hold</MenuItem>
                                            <MenuItem value='Mrp'>MRP</MenuItem>
                                            {/* <MenuItem value='GanttChart'>Gantt Chart</MenuItem> */}
                                            <MenuItem value='PlanOrder'>Schedule Order</MenuItem>
                                            <MenuItem value='RescheduleOrder'>Reschedule Order</MenuItem>
                                            <MenuItem value='SplitOrder'>Split Order</MenuItem>
                                            <MenuItem value='FreeComplete'>Force Complete</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        id="filled-basic"
                                        label="Remarks"
                                        variant="filled"

                                        fullWidth
                                        required

                                        placeholder="Remarks"


                                    />
                                </Grid>
                            </Grid>
                        ) : isRes === 'ToolMissing' ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        id="filled-basic"
                                        label="Date"
                                        variant="filled"
                                        type='date'
                                        fullWidth
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="Date"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Machine</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            variant="filled"
                                            label='Machine'
                                        >
                                            <MenuItem value='SelectOptions'>Select Options</MenuItem>
                                            <MenuItem value='Hold'>Hold</MenuItem>
                                            <MenuItem value='Mrp'>MRP</MenuItem>
                                            {/* <MenuItem value='GanttChart'>Gantt Chart</MenuItem> */}
                                            <MenuItem value='PlanOrder'>Schedule Order</MenuItem>
                                            <MenuItem value='RescheduleOrder'>Reschedule Order</MenuItem>
                                            <MenuItem value='SplitOrder'>Split Order</MenuItem>
                                            <MenuItem value='FreeComplete'>Force Complete</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Tool </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            variant="filled"
                                            label='Machine'
                                        >
                                            <MenuItem value='SelectOptions'>Select Options</MenuItem>
                                            <MenuItem value='Hold'>Hold</MenuItem>
                                            <MenuItem value='Mrp'>MRP</MenuItem>
                                            {/* <MenuItem value='GanttChart'>Gantt Chart</MenuItem> */}
                                            <MenuItem value='PlanOrder'>Schedule Order</MenuItem>
                                            <MenuItem value='RescheduleOrder'>Reschedule Order</MenuItem>
                                            <MenuItem value='SplitOrder'>Split Order</MenuItem>
                                            <MenuItem value='FreeComplete'>Force Complete</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        id="filled-basic"
                                        label="Remarks"
                                        variant="filled"
                                        fullWidth
                                        required
                                        placeholder="Remarks"


                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        id="filled-basic"
                                        label="Replace By"
                                        variant="filled"

                                        fullWidth
                                        required

                                        placeholder="Replace By"


                                    />
                                </Grid>
                            </Grid>
                        ) : (
                            <>
                            </>
                        )
                    }


                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        type="submit" >
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setToolMissOpen(false);

                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
                <NotificationBar
                    handleClose={handleClose}
                    notificationContent={openNotification.message}
                    openNotification={openNotification.status}
                    type={openNotification.type}
                />

            </form>
        </Dialog >

    )
}

export default ToolBreckMissing
