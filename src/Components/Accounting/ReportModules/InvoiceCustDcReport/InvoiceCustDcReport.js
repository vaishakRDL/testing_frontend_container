import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import './InvoiceCustDcReport.css';
import { AccCustomerDcReportItem, AccCustomerDcReportSearch, CustomerDcReport, CustomerDropShowdata, GetInvoiceCustDcReport, PartNoSelectShow } from "../../../../ApiService/LoginPageService";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { InvoiceCustDCReportDownload, SSOCustPoReportDownload } from "../../../../ApiService/DownloadCsvReportsService";
import NotificationBar from "../../../GlobleFiles/ServiceNotificationBar";

const InvoiceCustDcReport = () => {

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [supplierList, setSupplierList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setTodate] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [poReportData, setPoReportData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedToDate, setSelectedToDate] = useState('');
    const [selectedFilterRadio, setSelectedFilterRadio] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedSummary, setSelectedSummary] = useState('');

    const [customerSelect, setCustomerSelect] = useState([]);
    const [customerSelectList, setCustomerSelectList] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };

        // Add event listener to update height on resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const top100Films = [
        { title: 'The Shawshank Redemption', year: 1994 },
        { title: 'The Godfather', year: 1972 },
        // other film objects...
    ];

    // SUPPLIER SEARCH
    const handleSupplierChange = (e) => {
        AccCustomerDcReportSearch({ code: e.target.value }, handleSearchSupplierSucessShow, handleSearchSupplierExceptionShow);
    }

    const handleSearchSupplierSucessShow = (dataObject) => {
        setSupplierList(dataObject?.data || []);
    }
    const handleSearchSupplierExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSupplierSelect = (value) => {
        if (value !== null) {
            const ids = value.map(item => item.id);
            setSelectedSupplier(ids)
        }
    };

    // ITEM SEARCH
    const handleItemChange = (e) => {
        AccCustomerDcReportItem({ code: e.target.value }, handleSearchItemSucessShow, handleSearchItemExceptionShow);
    }

    const handleSearchItemSucessShow = (dataObject) => {
        setItemList(dataObject?.data || []);
    }
    const handleSearchItemExceptionShow = (errorObject, errorMessage) => {
    }

    const handleItemSelect = (value) => {
        if (value !== null) {
            const ids = value.map(item => item.id);
            setSelectedItem(ids)
        }
    };

    const handleReportView = () => {
        setLoader(true)
        GetInvoiceCustDcReport(
            {
                from: fromDate,
                to: toDate,
                customer: customerSelect
            }, handleGetReportSuccess, handleGetReportException)
    }

    const handleGetReportSuccess = (dataObject) => {
        setPoReportData(dataObject?.data || [])
        setTimeout(() => {
            setLoader(false)
        }, 2000);
    }
    const handleGetReportException = () => {
        setTimeout(() => {
            setLoader(false)
        }, 2000);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const handleChangeCustomer = (e) => {
        if (e !== null) {
            CustomerDropShowdata(
                { code: e.target.value },
                handleCustomerDropshow,
                handleCustomerDropshowException
            );
        }
    };

    const handleCustomerDropshow = (dataObject) => {
        setCustomerSelectList(dataObject?.data || []);
    };

    const handleCustomerDropshowException = (error, errorMessage) => { };

    const handleSearchItemChange = (value) => {
        if (value !== null) {
            const idArray = value.map((item) => item.id)
            setCustomerSelect(idArray)
        }
    }

    const handleReportDownload = () => {
        setLoader(true)
        InvoiceCustDCReportDownload({
            from: fromDate,
            to: toDate,
            customer: customerSelect
        }, handleDownloadSuccess, handleDownloadException)
    }

    const handleDownloadSuccess = () => {
        setLoader(false)
        setNotification({
            status: true,
            type: 'success',
            message: "Download Success",
        });
    }
    const handleDownloadException = () => {
        setLoader(false)
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

    // MULTI SELECTION AUTOCOMPLETE
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const handleRadioChange = (event) => {
        setSelectedFilterRadio(event.target.value);

        let fromDate = new Date();
        let toDate = new Date();

        switch (event.target.value) {
            case 'Today':
                fromDate = new Date();
                toDate = new Date();
                break;
            case 'Yesterday':
                fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - 1);
                toDate = new Date(fromDate);
                break;
            case 'This week':
                fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - fromDate.getDay());
                toDate = new Date();
                break;
            case 'Last week':
                fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - fromDate.getDay() - 7);
                toDate = new Date(fromDate);
                toDate.setDate(toDate.getDate() + 6);
                break;
            case 'This month':
                fromDate = new Date();
                fromDate.setDate(1);
                toDate = new Date();
                break;
            case 'Last month':
                fromDate = new Date();
                fromDate.setMonth(fromDate.getMonth() - 1);
                fromDate.setDate(1);
                toDate = new Date(fromDate);
                toDate.setMonth(toDate.getMonth() + 1);
                toDate.setDate(0); // Last day of the previous month
                break;
            default:
                fromDate = null;
                toDate = null; // For 'Custom' or other cases where a specific date isn't predefined
        }

        // selectedDate,selectedToDate
        setFromDate(fromDate ? fromDate.toISOString().split('T')[0] : '');
        setTodate(toDate ? toDate.toISOString().split('T')[0] : '');
    };

    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Invoice Cust DC Report
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
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <FormControl style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', borderRadius: '5px' }}>
                                <RadioGroup
                                    aria-label="options"
                                    name="options"
                                    value={selectedFilterRadio}
                                    onChange={handleRadioChange}
                                    sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}
                                >
                                    <FormControlLabel
                                        value="Today"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Today"
                                    />
                                    <FormControlLabel
                                        value="Yesterday"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Yesterday"
                                    />
                                    <FormControlLabel
                                        value="This week"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="This week"
                                    />
                                    <FormControlLabel
                                        value="Last week"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Last week"
                                    />
                                    <FormControlLabel
                                        value="This month"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="This month"
                                    />
                                    <FormControlLabel
                                        value="Last month"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Last month"
                                    />
                                    <FormControlLabel
                                        value="Custom"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Custom"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <TextField
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
                            <TextField
                                id="outlined-basic"
                                type="date"
                                label="To"
                                variant="outlined"
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size="small"
                                value={toDate}
                                onChange={(e) => setTodate(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={2} md={2} lg={2}>
                            <FormControl style={{ width: '100%' }}>
                                <Autocomplete
                                    multiple
                                    id="checkboxes-tags-demo"
                                    options={customerSelectList}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option.cCode}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option.cCode}
                                        </li>
                                    )}
                                    size="small"
                                    renderInput={(params) => <TextField {...params} label="Search Customer" onChange={handleChangeCustomer} />}
                                    onChange={(event, value) => handleSearchItemChange(value)}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={2} md={2} lg={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={selectedSummary}
                                    onChange={(e) => setSelectedSummary(e.target.value)}
                                >
                                    <FormControlLabel value="Detailed" control={<Radio />} label="Detailed" />
                                    <FormControlLabel value="Summary" control={<Radio />} label="Summary" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    <FormControlLabel value="All" control={<Radio />} label="All" />
                                    <FormControlLabel value="Pending" control={<Radio />} label="Pending " />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={1} md={1} lg={1}>
                            <Button disabled={loader === true} variant="contained" style={{ height: '30px', backgroundColor: '#002d68' }} onClick={handleReportView}>
                                {loader ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'View'}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2}>
                            <Button variant="contained" style={{ backgroundColor: '#002D68', marginTop: '2px' }} onClick={handleReportDownload}>Download</Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Box sx={{ height: screenHeight - 435, width: '100%', overflow: 'auto' }}>
                                <table id="purchase">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Inv Id</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Inv Date</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Cust Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Cust DC No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Cust DC Date</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Delivery Mode</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Code</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>DC Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>DC Rate</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>DC Amt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {poReportData.map((data) => (
                                            <tr>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{data.invNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{data.date}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{data.cName}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{data.cust_Dc_no}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{data.custDcDate}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{data.modeOfDispath}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{data.itemCode}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{data.itemName}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{data.dcQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{data.invRate}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{data.invAmt}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>


                            </Box>
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
        </div>
    )
}
export default InvoiceCustDcReport;