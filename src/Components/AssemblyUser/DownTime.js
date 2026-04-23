import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Button, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import { AssemblyMachines, Assemblyreasons, GetAssemblyPlanningFIM, ShowAssemblyPlanning } from '../../ApiService/LoginPageService';
import { DownloadAssemblyPlanningXLData } from '../../ApiService/DownloadCsvReportsService'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import AssemblyModule from './AssemblyModule';
import { HmiMachineDropDown, OeeOeeDownReason } from '../../ApiService/LoginPageService2';

const DownTime = () => {


    const [refreshData, setRefreshData] = useState(false);
    const [sobDataList, setSobDataList] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const [machineList, setMachineList] = useState([]);
    const [machine, setMachine] = useState('');
    const [PartNo, setPartNo] = useState('');
    const [accountabiityList, setAccountabilityList] = useState([]);
    const [accountability, setAccountability] = useState([]);
    const [open, setOpen] = useState(false);




    useEffect(() => {
        document.title = 'Assembly Planning';
        AssemblyMachines(handlePlanningFIMSuccess, handlePlanningFIMFailed);
        Assemblyreasons(handleOeeOeeDownReasonSuccess, handleOeeOeeDownReasonException);
    }, [refreshData]);

    const handleOeeOeeDownReasonSuccess = (dataObject) => {
        setAccountabilityList(dataObject?.data || []);
    }

    const handleOeeOeeDownReasonException = () => {

    }

    const handlePlanningFIMSuccess = (dataObject) => {
        setMachineList(dataObject?.data || []);
    }

    const handlePlanningFIMFailed = (errorObject, errorMessage) => {

    }

    const options = sobDataList.map(item => ({
        id: item?.id,
        label: item?.contractNo
    }));

    const handleSubmitPress = () => {


    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <div style={{ height: '80vh', width: '100%' }}>

            <div style={{ display: 'flex', justifyContent: 'space-around' }}>

                <Grid container spacing={2}>

                    <Grid item xs={12} sm={12} md={6} lg={2.4} xl={2.4} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Machine Name</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Select Machine Name"
                                placeholder='Select Machine Name'
                                variant="filled"
                                size='small'
                                value={machine}
                                onChange={(e) => setMachine(e.target.value)}
                                required
                            >

                                {machineList.map((data) => (
                                    <MenuItem key={data.id} value={data.machineName}>{data.machineName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={2.4} xl={2.4} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Accountability Reason</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Select Accountability Reason"
                                placeholder='Select Accountability Reason'
                                variant="filled"
                                size='small'
                                value={accountability}
                                onChange={(e) => setAccountability(e.target.value)
                                }
                                required
                            >

                                {
                                    accountabiityList.map((data) => (
                                        <MenuItem key={data.id} value={data.parameterName}>{data.parameterName}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={1} xl={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <Button
                            variant="contained"
                            onClick={handleSubmitPress}
                            style={{ backgroundColor: '#002d68' }}
                        >
                            Submit
                        </Button>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                        <Card style={{ borderRadius: '8px', height: '100%', minHeight: '500px', marginTop: '-5px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                            <CardContent style={{ padding: '30px' }} >
                                <Grid container spacing={2} style={{ display: 'flex', }}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', marginTop: '-20px', }}>
                                        <Typography
                                            sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                                            variant="h5"
                                        >
                                            Down Since
                                        </Typography>

                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', backgroundColor: 'red', marginTop: '20px', color: 'white' }}>
                                        <Typography variant='h4'>
                                            Downtime :
                                        </Typography>

                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', marginTop: '20px', color: 'white' }}>

                                        <Button
                                            variant="contained"
                                            onClick={handleSubmitPress}
                                            style={{ backgroundColor: '#002d68' }}
                                        >
                                            Resume
                                        </Button>

                                    </Grid>


                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />


        </div>
    )
}

export default DownTime
