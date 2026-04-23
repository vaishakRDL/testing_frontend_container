import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel,
} from '@mui/material';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from "@mui/icons-material/Search";
import VerifyModal from './VerifyModal';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';

const CellAssignModal = ({
    isAddButton, editData, setRefreshData, cellAssignModal, setCellAssignModal, gridHeaderName, checklistBodyDetails, checklistRowData, currentFrequency, mappedDate, currentAnswerType
}) => {
    const [rowId, setRowId] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [verifyModal, setVerifyModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    const optionsArray = [
        checklistBodyDetails.option1,
        checklistBodyDetails.option2,
        checklistBodyDetails.option3,
        checklistBodyDetails.option4
    ].filter(option => option !== undefined);
    console.log("optionsArrayoptionsArray", optionsArray)

    useEffect(() => {
        setCellAssignModal(cellAssignModal);
        !isAddButton && loaderData();
    }, [editData]);

    useEffect(() => {
    }, [])

    // SUBMIT
    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     UpdateTableCellAnswer({ id: checklistRowData.layoutid, date: gridHeaderName, ans: selectedOption,frequency: currentFrequency }, handleSuccess, handleException)
    // };

    /*
    const handleSubmit = (event) => {
        event.preventDefault();
    
        // Get today's date (day of the month)
        const today = new Date();
        const day = today.getDate(); // This will give you the current day as a number (1-31)
    
        // Prepare the payload
        const payload = {
            id: checklistRowData.layoutid,
            date: day.toString(), // Convert to string if necessary
            ans: selectedOption,
            frequency: currentFrequency,
        };
    
        // Call the UpdateTableCellAnswer function with the payload
        UpdateTableCellAnswer(payload, handleSuccess, handleException);
    };*/

    const handleSubmit = (event) => {
        event.preventDefault();

        const today = new Date();
        let day = '';

        if (currentFrequency === 'daily') {
            day = today.getDate(); // 1-31
        }

        if (currentFrequency === 'monthly') {
            const monthMap = [
                "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
            ];
            const currentMonth = today.getMonth(); // 0-11
            day = monthMap[currentMonth];
        }

        if (currentFrequency === 'quarterly') {
            const quarters = [
                "JAN_FEB_MAR",
                "APR_MAY_JUN",
                "JUL_AUG_SEP",
                "OCT_NOV_DEC"
            ];
            const currentQuarter = Math.floor(today.getMonth() / 3);
            day = quarters[currentQuarter];
        }

        if (currentFrequency === 'semi_annually') {
            const semiAnnual = [
                "APR_MAY_JUN_JUL_AUG_SEP",
                "OCT_NOV_DEC_JAN_FEB_MAR"
            ];
            // If current month is between APR (3) and SEP (8), it's first half
            const currentMonth = today.getMonth(); // 0-11
            day = currentMonth >= 3 && currentMonth <= 8
                ? semiAnnual[0]
                : semiAnnual[1];
        }

        if (currentFrequency === 'annually') {
            day = "APR_MAY_JUN_JUL_AUG_SEP_OCT_NOV_DEC_JAN_FEB_MAR";
        }

        const payload = {
            id: checklistRowData.layoutid,
            date: day.toString(),
            ans: selectedOption,
            frequency: currentFrequency,
            currentAnswerType: currentAnswerType
        };

        // UpdateTableCellAnswer(payload, handleSuccess, handleException);
    };



    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
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
        }, 2000);
    };

    const ClearData = () => {
        setCellAssignModal(false);
        setRefreshData(oldvalue => !oldvalue);
    }

    const loaderData = () => {
        setRowId(editData?.id || '');
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
            sx={{ '& .MuiDialog-paper': { minWidth: '30%' } }}
            maxWidth="sm"
            open={cellAssignModal}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Select
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2} style={{ marginBottom: '20px' }}>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                            <FormControl>
                                {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel> */}
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                >
                                    {optionsArray.map((value) => (
                                        <FormControlLabel value={value} control={<Radio />} label={value} />
                                    ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            // onClick={() => {
                            //     setCellAssignModal(false)
                            //     ClearData();
                            // }}
                            type='submit'
                        >
                            Add
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setCellAssignModal(false)
                                ClearData();
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
            <VerifyModal
                verifyModal={verifyModal}
                setVerifyModal={setVerifyModal}
            />
        </Dialog>
    )
}

export default CellAssignModal