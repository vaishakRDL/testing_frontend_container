import React, { useState, useEffect } from 'react';
import { Autocomplete, Checkbox, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Button, Card, CardContent, Box, FormControlLabel, Radio, RadioGroup, FormLabel, FormGroup, CircularProgress } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { GetItemGroup, GetMainLocation, GetSearchedItems, GetStockBalanceReport } from '../../ApiService/LoginPageService';
import LinearProgress from '@mui/material/LinearProgress';
import { OpeningBalanceReportDownload } from '../../ApiService/DownloadCsvReportsService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';

const StockBalanceReport = () => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [locationRadio, setLocationRadio] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedItemGroup, setSelectedItemGroup] = useState([]);
    const [selectedShowValue, setSelectedShowValue] = useState('');
    const [selectedOP, setSelectedOP] = useState('');
    const [itemList, setItemList] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState([]);
    const [locationLists, setLocationLists] = useState([]);
    const [itemGroupLists, setItemGroupLists] = useState([]);
    const [balanceReportData, setBalanceReportData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [downloadloader, setDownloadLoader] = useState(false);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [showValue, setShowValue] = useState(false);
    const [zeroBalance, setZeroBalance] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState('normal'); // 'normal' or 'paginated'
    const handleRadioChange = (event) => {
        setViewMode(event.target.value);
        // Optional: Reset page to 1 when switching modes
        setPage(1);
    };
    useEffect(() => {
        GetSearchedItems({ code: '' }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
        GetMainLocation(handleLocationSuccess, handleLocationException)
        GetItemGroup(handleItemGroupSuccess, handleItemGroupException)
    }, [])

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

    // LOCATION
    const handleLocationSuccess = (dataObject) => {
        setLocationLists(dataObject?.data || []);
    }
    const handleLocationException = () => { }

    // ITEM GROUP
    const handleItemGroupSuccess = (dataObject) => {
        setItemGroupLists(dataObject?.data || []);
    }
    const handleItemGroupException = () => { }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    // AUTOCOMPLETE ITEM SEARCH
    const handleChange = (e) => {
        GetSearchedItems({ code: e.target.value }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
    }

    const handleItemVsProcessItemSucessShow = (dataObject) => {
        setItemList(dataObject?.data || []);
    }
    const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSearchItemChange = (value) => {
        if (value !== null) {
            const idArray = value.map((item) => item.id)
            console.log("idArray", idArray)
            setSelectedItemId(idArray)
        }
    }

    const handleGroupChange = (value) => {
        if (value !== null) {
            const idArray = value.map((item) => item.id)
            console.log("idArray", idArray)
            setSelectedItemGroup(idArray)
        }
    }

    const handleLocationRadio = (value) => {
        if (value === "withoutLocation") {
            setSelectedLocation('');
        }
    }

    const handleViewBalanceReport = (requestedPage = 1) => {
        setLoader(true)
        GetStockBalanceReport({
            from: fromDate,
            to: toDate,
            items: selectedItemId,
            locId: selectedLocation,
            itmGrpId: selectedItemGroup,
            showVal: showValue,
            notDisplay: zeroBalance,
            page: requestedPage,

        },
            (response) => {
                handleBalanceReportSuccess(response)
            },
            (errorObject, errorMessage) => {
                handleBalanceReportException(errorObject, errorMessage)
            }
        )
    }

    const handleBalanceReportSuccess = (response) => {
        setLoader(false)
        console.log("response?.meta?.totalPages", response?.meta?.totalPages)      // Replace table data
        setTotalPages(response?.pagination?.totalPages || 1);         // Store total pages from API (adjust field name)
        setPage(response?.pagination?.currentPage || 1);
        setBalanceReportData(response?.data || [])
        setNotification({
            status: true,
            type: 'success',
            message: response.message,
        });
    }
    const handleBalanceReportException = (errorObject, errorMessage) => {
        setLoader(false)
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setBalanceReportData([]);
        setTimeout(() => {
        }, 3000);
    }

    // FINANCIAL YEAR
    useEffect(() => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const isAfterApril = today.getMonth() >= 3; // 0-indexed: Jan=0, Apr=3

        // From date: always 1st April of the financial year
        const initialFromDate = isAfterApril
            ? `${currentYear}-04-01`
            : `${currentYear - 1}-04-01`;

        // To date: today
        const initialToDate = today.toISOString().split("T")[0]; // Format: yyyy-mm-dd

        setFromDate(initialFromDate);
        setToDate(initialToDate);
    }, []);


    const handleFromDateChange = (e) => {
        const selectedFromDate = e.target.value;
        setFromDate(selectedFromDate);


    };

    const handleStockBalanceDwonload = () => {
        setDownloadLoader(true)
        OpeningBalanceReportDownload({
            from: fromDate,
            to: toDate,
            items: selectedItemId,
            locId: selectedLocation,
            itmGrpId: selectedItemGroup,
            showVal: showValue,
            notDisplay: zeroBalance
        }, handleDownloadSuccess, handleDownloadException)
    }

    const handleDownloadSuccess = () => {
        setDownloadLoader(false)
    }
    const handleDownloadException = () => {
        setDownloadLoader(false)
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };
    const handleMainButtonClick = () => {
        if (viewMode === 'normal') {
            handleViewBalanceReport(null); // Explicitly send null
        } else {
            handleViewBalanceReport(1);    // Start at page 1
        }
    };
    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px', marginBottom: '10px' }}>
                <Typography sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }} variant="h5">
                    Stock Balance Report
                </Typography>
            </div>
            <form>
                <Grid container style={{ zoom: '80%' }}>
                    <Grid item xs={12} sm={12} md={1.9} lg={1.9} xl={1.9} style={{ backgroundColor: '#ffffff', padding: '10px', border: '1px solid black', borderRadius: '5px', marginBottom: '10px' }} >
                        <TextField
                            fullWidth
                            id="from-date"
                            label="From Date"
                            variant="outlined"
                            type="date"
                            value={fromDate}
                            onChange={handleFromDateChange}
                            InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            fullWidth
                            id="to-date"
                            label="To Date"
                            variant="outlined"
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                        />

                    </Grid>
                    <Grid item xs={12} sm={12} md={0.1} lg={0.1} xl={0.1}></Grid>
                    <Grid item xs={12} sm={12} md={1.9} lg={1.9} xl={1.9} style={{ backgroundColor: '#ffffff', padding: '10px', border: '1px solid black', borderRadius: '5px', marginBottom: '10px' }}>
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                style={{ marginTop: '8px', marginBottom: '16px' }}
                                value={locationRadio}
                                onChange={(e) => {
                                    setLocationRadio(e.target.value)
                                    handleLocationRadio(e.target.value)
                                }}
                            >
                                <FormControlLabel
                                    value="location"
                                    control={<Radio />}
                                    label={<Typography sx={{
                                        fontSize: {
                                            xs: '10px',
                                            sm: '10px',
                                            md: '10px',
                                            lg: '15px',
                                            xl: '15px',
                                        },
                                    }}>Location</Typography>}
                                />
                                <FormControlLabel
                                    value="withoutLocation"
                                    control={<Radio />}
                                    label={<Typography sx={{
                                        fontSize: {
                                            xs: '10px',
                                            sm: '10px',
                                            md: '10px',
                                            lg: '15px',
                                            xl: '15px',
                                        },
                                    }} >Without Location</Typography>}
                                />
                            </RadioGroup>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="location-label">Selected Location</InputLabel>
                            <Select
                                labelId="location-label"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                disabled={locationRadio === 'location' ? false : true}
                                label="Selected Location">
                                {locationLists.map((data) => (
                                    <MenuItem key={data.id} value={data?.id} >{data?.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={0.1} lg={0.1} xl={0.1}></Grid>
                    <Grid item xs={12} sm={12} md={3.9} lg={3.9} xl={3.9} style={{ backgroundColor: '#ffffff', padding: '10px', border: '1px solid black', borderRadius: '5px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    limitTags={2}

                                    id="checkboxes-tags-demo"
                                    options={itemGroupLists}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option.name}
                                        </li>
                                    )}
                                    renderInput={(params) => <TextField {...params} label="Selected Item Group" />}
                                    onChange={(event, value) => handleGroupChange(value)}
                                />
                            </div>
                            <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                                <FormGroup fullWidth>
                                    <FormControlLabel style={{ whiteSpace: 'nowrap' }} control={<Checkbox checked={showValue} onChange={(e) => setShowValue(e.target.checked)} />} label="Show Value" />
                                </FormGroup>
                                {showValue === true && <Typography style={{ whiteSpace: 'nowrap', fontWeight: 'bold', color: 'blue', fontFamily: 'Roboto-Slab' }}>Valuation Method : Last Purchase</Typography>}
                            </div>
                        </div>
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                style={{ marginTop: '10px' }}
                                value={selectedOP}
                                onChange={(e) => setSelectedOP(e.target.value)}
                            >
                                <FormControlLabel
                                    value="female"
                                    control={<Radio />}
                                    label={<Typography sx={{
                                        fontSize: {
                                            xs: '10px',
                                            sm: '10px',
                                            md: '10px',
                                            lg: '15px',
                                            xl: '15px',
                                        },
                                    }}>OP Recpt Issue Balance</Typography>}
                                />
                                <FormControlLabel
                                    value="male"
                                    control={<Radio />}
                                    label={<Typography sx={{
                                        fontSize: {
                                            xs: '10px',
                                            sm: '10px',
                                            md: '10px',
                                            lg: '15px',
                                            xl: '15px',
                                        },
                                    }} >OP &lt;&lt; Document wise &gt;&gt; Balance</Typography>}
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={0.1} lg={0.1} xl={0.1}></Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{ backgroundColor: '#ffffff', padding: '10px', border: '1px solid black', borderRadius: '5px', marginBottom: '10px' }}>
                        <Autocomplete
                            multiple
                            limitTags={2}

                            id="checkboxes-tags-demo"
                            options={itemList}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.label}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option.label}
                                </li>
                            )}
                            renderInput={(params) => <TextField {...params} label="Search Items" onChange={handleChange} />}
                            onChange={(event, value) => handleSearchItemChange(value)}
                        />
                        <div style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', columnGap: '10px' }}>
                            <Button disabled={loader === true} variant="contained" style={{ backgroundColor: '#002d68', width: '150px' }}
                                onClick={handleMainButtonClick}>
                                {loader ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'View Report'}
                            </Button>

                            {/* <FormControl component="fieldset">
                                <RadioGroup row value={viewMode} onChange={handleRadioChange}>
                                    <FormControlLabel
                                        value="normal"
                                        control={<Radio style={{ color: '#002d68' }} />}
                                        label="Normal View"
                                    />
                                    <FormControlLabel
                                        value="paginated"
                                        control={<Radio style={{ color: '#002d68' }} />}
                                        label="Paginated View"
                                    />
                                </RadioGroup>
                            </FormControl> */}
                        </div>
                    </Grid>

                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', border: '1px solid black' }}>
                            {loader &&
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress />
                                </Box>
                            }
                            <CardContent>
                                <Box
                                    sx={{
                                        height: screenHeight - 420,
                                        backgroundColor: 'white',
                                        border: '1px solid black',
                                        width: "100%",
                                        overflowY: "scroll",
                                        overflowX: "scroll",
                                        '&::-webkit-scrollbar': {
                                            width: '12px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: 'black',
                                            borderRadius: '10px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            backgroundColor: 'lightgrey',
                                        },
                                        scrollbarColor: "#f9f9fb lightgrey",
                                        scrollbarWidth: "thin",
                                    }}
                                >
                                    <table id="customers" style={{ width: '100%', borderCollapse: 'collapse', zoom: '80%' }}>
                                        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f9f9f9', zIndex: 1 }}>
                                            <tr>
                                                <th style={{ whiteSpace: 'nowrap' }}>Item Group Name</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Last Purchase Date</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Age In Days</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Product Family</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Item Code</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Item Name</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>UOM</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>STD Rate</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Op Qty</th>
                                                {showValue === true && <th style={{ whiteSpace: 'nowrap' }}>Op Value</th>}
                                                <th style={{ whiteSpace: 'nowrap' }}>Rcpt Qty</th>
                                                {showValue === true && <th style={{ whiteSpace: 'nowrap' }}>Rcpt Value</th>}
                                                <th style={{ whiteSpace: 'nowrap' }}>Issue Qty</th>
                                                {showValue === true && <th style={{ whiteSpace: 'nowrap' }}>Issue Value</th>}
                                                <th style={{ whiteSpace: 'nowrap' }}>Closing Qty</th>
                                                {showValue === true && <th style={{ whiteSpace: 'nowrap' }}>Closing Value</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {balanceReportData.map((item, itemIndex) => {
                                                const rowSpanCount = item.stkDtl.length;
                                                return item.stkDtl.map((stkItem, stkIndex) => (
                                                    <tr key={stkItem.id} style={{ backgroundColor: stkItem.isClr === 1 ? '#000000' : '#ffffff', color: stkItem.isClr === 1 ? '#ffffff' : '#000000' }}>

                                                        <td style={{ whiteSpace: 'nowrap' }}>{item.itemGroup}</td>
                                                        <td style={{ whiteSpace: 'nowrap' }}>{stkItem.poDate}</td>
                                                        <td style={{ whiteSpace: 'nowrap' }}>{stkItem.ageInDays}</td>
                                                        <td style={{ whiteSpace: 'nowrap' }}>{stkItem.productFamily}</td>
                                                        <td style={{ whiteSpace: 'nowrap' }}>{stkItem.itemCode}</td>
                                                        <td style={{ whiteSpace: 'nowrap' }}>{stkItem.itemName}</td>
                                                        <td style={{ whiteSpace: 'nowrap' }}>{stkItem.uom}</td>
                                                        <td style={{ whiteSpace: 'nowrap' }}>{stkItem.stdRate}</td>
                                                        <td style={{ whiteSpace: 'nowrap' }}>{stkItem.opQty}</td>
                                                        {showValue === true && <td style={{ whiteSpace: 'nowrap' }}>{stkItem.opValue}</td>}
                                                        <td style={{ whiteSpace: 'nowrap' }}>{stkItem.receipts}</td>
                                                        {showValue === true && <td style={{ whiteSpace: 'nowrap' }}>{stkItem.receiptValue}</td>}
                                                        <td style={{ whiteSpace: 'nowrap' }}>{stkItem.issue}</td>
                                                        {showValue === true && <td style={{ whiteSpace: 'nowrap' }}>{stkItem.issueValue}</td>}
                                                        <td style={{ whiteSpace: 'nowrap' }}>{stkItem.clsQty}</td>
                                                        {showValue === true && <td style={{ whiteSpace: 'nowrap' }}>{stkItem.clsValue}</td>}
                                                    </tr>
                                                ));
                                            })}
                                        </tbody>
                                    </table>
                                </Box>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Button size='small' variant="contained" style={{ backgroundColor: '#002d68', marginRight: '20px' }} onClick={handleStockBalanceDwonload}
                                        disabled={downloadloader}
                                    >
                                        {downloadloader ? (
                                            <CircularProgress size={20} style={{ color: 'white' }} />
                                        ) : (
                                            'Download'
                                        )}
                                    </Button>
                                    <FormGroup fullWidth>
                                        <FormControlLabel style={{ whiteSpace: 'nowrap' }} control={<Checkbox checked={zeroBalance} onChange={(e) => setZeroBalance(e.target.checked)} />} label="Do Not Show Items With Zero Balance" />
                                    </FormGroup>

                                    {/* {viewMode === 'paginated' && totalPages > 0 && ( */}
                                    <Grid container justifyContent="flex-end" alignItems="center" style={{ marginTop: '15px' }}>
                                        <Button
                                            variant="outlined"
                                            disabled={page === 1 || loader}
                                            onClick={() => handleViewBalanceReport(page - 1)}
                                            style={{ marginRight: '10px' }}
                                        >
                                            Previous
                                        </Button>

                                        <Typography style={{ fontWeight: 'bold' }}>
                                            Page {page} of {totalPages}
                                        </Typography>

                                        <Button
                                            variant="outlined"
                                            disabled={page === totalPages || loader}
                                            onClick={() => handleViewBalanceReport(page + 1)}
                                            style={{ marginLeft: '10px' }}
                                        >
                                            Next
                                        </Button>
                                    </Grid>
                                    {/* )} */}
                                </div>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </form>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div >

    );
};

export default StockBalanceReport;
