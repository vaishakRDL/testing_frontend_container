import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CircularProgress, CardContent, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, LinearProgress, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ScrapMstGetMaterial, MachineShowData, ScrapReportAnalysisReport } from "../../ApiService/LoginPageService";
import './ScrapAnalysisReport.css';
import { ScrapAnalysisReportDownload } from "../../ApiService/DownloadCsvReportsService";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";

const ScrapAnalysisReport = () => {
    const [viewloading, setviewLoading] = useState(false);
    const [downloadloading, setDownloadLoading] = useState(false);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setTodate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [rawMaterial, setRawMaterial] = useState('');
    const [rawMaterialList, setRawMaterialList] = useState([]);
    const [machinList, setMachineList] = useState([]);
    const [machine, setMachine] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        ScrapMstGetMaterial(handleScrapMstGetMaterialSuccess, handleScrapMstGetMaterialException);
        MachineShowData(handleMachineShowDataSuccess, handleMachineShowDataExceprion);
    }, [])

    const handleReportView = () => {
        setLoader(true)
        setviewLoading(true);
        ScrapReportAnalysisReport(
            {
                machineId: machine,
                material: rawMaterial,
                from: fromDate,
                to: toDate
            }, handleGetReportSuccess, handleGetReportException)
    }

    const handleGetReportSuccess = (dataObject) => {
        setLoader(false)
        setviewLoading(false);

        setReportData(dataObject?.data || [])
    }
    const handleGetReportException = () => {
        setLoader(false)
        setviewLoading(false);

    }

    // HANDLE DOWNLOAD REPORT
    const handleReportDownload = () => {
        setLoader(true)
        setDownloadLoading(true)
        ScrapAnalysisReportDownload({
            machineId: machine,
            material: rawMaterial,
            from: fromDate,
            to: toDate
        }, handleDownloadSuccess, handleDownloadException)
    }

    const handleDownloadSuccess = () => {
        setLoader(false)
        setDownloadLoading(false)

        setNotification({
            status: true,
            type: 'success',
            message: "Download Success",
        });
    }
    const handleDownloadException = () => {
        setLoader(false)
        setDownloadLoading(false)
        setNotification({
            status: true,
            type: 'error',
            message: "Failed to download",
        });
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    // MATERIAL
    const handleScrapMstGetMaterialSuccess = (dataObject) => {
        setRawMaterialList(dataObject?.data || []);
    }
    const handleScrapMstGetMaterialException = () => {
    }
    const options2 = rawMaterialList.map(item => ({
        id: item?.id,
        label: item?.material
    }));

    const handleRawMaterialChange = (selectedValue) => {
        setRawMaterial(selectedValue?.label || '');
    };


    //MACHINE
    const handleMachineShowDataSuccess = (dataObject) => {
        setMachineList(dataObject?.data || []);

    }
    const handleMachineShowDataExceprion = () => {
    }

    const options = machinList.map(item => ({
        id: item?.id,
        label: item?.machineName
    }));

    const handleAutocompleteChange = (selectedValue) => {
        setMachine(selectedValue?.id || '');
    };


    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Scrap Analysis Report
                </Typography>
            </div>
            <Card sx={{ minWidth: 275 }}>
                {loader &&
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                }
                <CardContent>
                    <Grid container alignItems={'center'} spacing={2}>
                        <Grid item xs={12} sm={12} md={2} lg={2}>
                            <FormControl style={{ width: '100%' }}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="combo-box-demo"
                                    size='small'
                                    options={options2}
                                    // sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Search By Raw Material"
                                    />}
                                    onChange={(event, value) => handleRawMaterialChange(value)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={2} lg={2}>
                            <FormControl style={{ width: '100%' }}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="combo-box-demo"
                                    size='small'
                                    options={options}
                                    // sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Search By Machine"

                                    />}
                                    onChange={(event, value) => handleAutocompleteChange(value)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={8} md={2} lg={2}>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                type="date"
                                label="From"
                                variant="outlined"
                                style={{ marginRight: '10px' }}
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size="small"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8} md={2} lg={2}>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                type="date"
                                label="To"
                                variant="outlined"
                                style={{ marginRight: '10px' }}
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size="small"
                                value={toDate}
                                onChange={(e) => setTodate(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8} md={3} lg={3}>
                            <Button variant="contained" style={{ backgroundColor: '#002D68', marginRight: '15px', marginTop: '2px' }} disabled={viewloading} onClick={handleReportView}>
                                {viewloading ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : (
                                    'View'
                                )}
                            </Button>
                            <Button variant="contained" style={{ backgroundColor: '#002D68', marginTop: '2px' }} disabled={downloadloading} onClick={handleReportDownload}>
                                {downloadloading ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : (
                                    'Download'
                                )}
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            {reportData.length > 0 ?
                                <Box sx={{ height: screenHeight - 310, width: '100%', overflow: 'auto' }}>

                                    <table border="1" style={{ borderCollapse: "collapse", width: "100%", zoom: '80%' }} id="customers">
                                        <thead>
                                            <tr>
                                                <th style={{ whiteSpace: 'nowrap' }}>Material</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Thickness</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Scrap Weight</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Button Scrap</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Without Button Scrap</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Sheet Consumption Total</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Total Weight</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>With Button</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Without Button</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Sheet Consumption Total</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>SCRAP(THICKNESS WISE) WITH BUTTON %</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>SCRAP(THICKNESS WISE) WITHOUT BUTTON %</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>SCRAP%(WITH BUTTON)</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>SCRAP%(WITHOUT BUTTON)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportData && reportData.map((data, Key) => (
                                                data.details.map((item, index) => (
                                                    <tr>
                                                        {
                                                            index === 0 &&
                                                            <>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.details.length}>{data.material}</td>
                                                            </>
                                                        }
                                                        <td style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}>
                                                            {item.thickness}
                                                        </td>
                                                        <td style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}>
                                                            {item.totalWeight}
                                                        </td>
                                                        <td style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}>
                                                            {item.withButton}
                                                        </td>
                                                        <td style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}>
                                                            {item.withoutButton}
                                                        </td>
                                                        <td style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}>
                                                            {item.sheetConsumption}
                                                        </td>
                                                        {
                                                            index === 0 &&
                                                            <>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.details.length}>{data.scrapWeightTotal}</td>
                                                            </>
                                                        }
                                                        {
                                                            index === 0 &&
                                                            <>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.details.length}>{data.withButtonTotal}</td>
                                                            </>
                                                        }
                                                        {
                                                            index === 0 &&
                                                            <>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.details.length}>{data.withoutButtonTotal}</td>
                                                            </>
                                                        }
                                                        {
                                                            index === 0 &&
                                                            <>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.details.length}>{data.sheetConsumptionTotal}</td>
                                                            </>
                                                        }
                                                        <td style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}>
                                                            {item.withButtonPercentage}%
                                                        </td>
                                                        <td style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}>
                                                            {item.withoutButtonPercentage}%
                                                        </td>
                                                        {
                                                            index === 0 &&
                                                            <>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.details.length}>{data.withButtonPercentage}%</td>
                                                            </>
                                                        }
                                                        {
                                                            index === 0 &&
                                                            <>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.details.length}>{data.withoutButtonPercentage}%</td>
                                                            </>
                                                        }
                                                    </tr>
                                                ))
                                            ))}
                                        </tbody>
                                    </table>
                                </Box>
                                :
                                <Box sx={{ height: screenHeight - 310, width: '100%', overflow: 'auto' }}>
                                    <div style={{ backgroundColor: '#D9EAFD', padding: '50px', borderRadius: '10px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography style={{ fontFamily: 'cursive' }}>No Data Found</Typography>
                                    </div>
                                </Box>
                            }
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div >
    )
}
export default ScrapAnalysisReport;