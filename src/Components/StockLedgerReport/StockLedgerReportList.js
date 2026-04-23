import React, { useState, useEffect } from 'react';
import { Autocomplete, Checkbox, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Button, Card, CardContent, Box, CircularProgress, LinearProgress } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { GetSearchedItems, GetStockLedgerReport, GetMainLocation, GetItemGroup } from '../../ApiService/LoginPageService';

const StockLedgerReportList = () => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedItemGroup, setSelectedItemGroup] = useState('');
    const [itemList, setItemList] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState([]);
    const [locationLists, setLocationLists] = useState([]);
    const [itemGroupLists, setItemGroupLists] = useState([]);
    const [ledgerReportData, setLedgerReportData] = useState([]);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [loading, setLoading] = useState(false);

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

    // MULTI SELECTION AUTOCOMPLETE
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

    const handleViewClick = (requestedPage = 1) => {
        setLoading(true);
        GetStockLedgerReport({
            from: fromDate,
            to: toDate,
            items: selectedItemId,
            locId: selectedLocation,
            itmGrpId: selectedItemGroup,
            page: requestedPage,

        },
            (dataObject) => handleViewSuccess(dataObject, requestedPage),

            handleViewException)
    }

    const handleViewSuccess = (dataObject) => {
        setTotalPages(dataObject.totalPages || 1);         // Store total pages from API (adjust field name)
        setPage(dataObject.page);
        setLedgerReportData(dataObject?.data || []);
        setTimeout(() => {
            setLoading(false);
        })
    }
    const handleViewException = () => {
        setTimeout(() => {
            setLoading(false);
        })
    }

    // FINANCIAL YEAR

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    useEffect(() => {
        // Initialize with the current financial year based on today's date
        const today = new Date();
        const currentYear = today.getFullYear();
        const isAfterApril = today.getMonth() >= 3; // Checks if month is April or later (0-indexed)

        // Set the initial financial year range
        const initialFromDate = isAfterApril
            ? `${currentYear}-04-01`
            : `${currentYear - 1}-04-01`;
        const initialToDate = isAfterApril
            ? `${currentYear + 1}-03-31`
            : `${currentYear}-03-31`;

        setFromDate(initialFromDate);
        // setToDate(initialToDate);
        setToDate(formatDate(today));
    }, []);

    const handleFromDateChange = (e) => {
        const selectedFromDate = e.target.value;
        setFromDate(selectedFromDate);

        const fromYear = new Date(selectedFromDate).getFullYear();
        const isAfterApril = new Date(selectedFromDate).getMonth() >= 3;

        const financialYearEnd = isAfterApril
            ? `${fromYear + 1}-03-31`
            : `${fromYear}-03-31`;

        // setToDate(financialYearEnd);
    };



    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                <Typography sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }} variant="h5">
                    Stock Ledger Report
                </Typography>
            </div>
            <form>
                <Grid container spacing={2} padding={1} style={{ zoom: '80%' }}>
                    <Grid item xs={12} sm={12} md={4}>
                        <TextField
                            fullWidth
                            id="from-date"
                            label="From Date"
                            variant="outlined"
                            type="date"
                            value={fromDate}
                            onChange={handleFromDateChange}
                            InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
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
                    <Grid item xs={12} sm={12} md={4}>
                        <Autocomplete
                            multiple
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
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="location-label">Selected Location</InputLabel>
                            <Select
                                labelId="location-label"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                label="Selected Location">
                                {locationLists.map((data) => (
                                    <MenuItem key={data.id} value={data?.id} >{data?.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="item-group-label">Selected Item Group</InputLabel>
                            <Select
                                labelId="item-group-label"
                                value={selectedItemGroup}
                                onChange={(e) => setSelectedItemGroup(e.target.value)}
                                label="Selected Item Group">
                                {itemGroupLists.map((data) => (
                                    <MenuItem key={data.id} value={data?.id} >{data?.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} md={3} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Button disabled={loading === true} variant="contained" style={{ backgroundColor: '#002d68', width: '150px' }}
                            onClick={() => handleViewClick(1)} >

                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : 'View Report'}
                        </Button>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} margin={1}>
                    <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', border: '1px solid black' }}>
                        {loading &&
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress />
                            </Box>
                        }
                        <CardContent>
                            <Box
                                sx={{
                                    height: screenHeight - 367,
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
                                <table id="customers" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f9f9f9', zIndex: 1 }}>
                                        <tr>
                                            <th style={{ whiteSpace: 'nowrap' }}>Location</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Item Group</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>item Code</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Item Name</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>UOM</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Doc Type</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Doc No</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Doc Date</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Grn No</th>
                                            {/* <th style={{ whiteSpace: 'nowrap' }}>Opening Balance</th> */}
                                            <th style={{ whiteSpace: 'nowrap' }}>Recipts</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Supp Name</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Inv No</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Inv Date</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Acc Qty</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Quarantine Stock</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Disposal</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Issues</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Closing Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ledgerReportData.map((item, itemIndex) => {
                                            const rowSpanCount = item.stkDtl.length;
                                            return item.stkDtl.map((stkItem, stkIndex) => (
                                                <tr key={stkItem.id} style={{ backgroundColor: stkItem.row === "total" && '#4A4947', color: stkItem.row === "total" && '#ffffff' }}>
                                                    {stkIndex === 0 && (
                                                        <>
                                                            <td rowSpan={rowSpanCount} style={{ whiteSpace: 'nowrap' }}>{item.location}</td>
                                                            <td rowSpan={rowSpanCount} style={{ whiteSpace: 'nowrap' }}>{item.itemGroup}</td>
                                                            <td rowSpan={rowSpanCount} style={{ whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                            <td rowSpan={rowSpanCount} style={{ whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                            <td rowSpan={rowSpanCount} style={{ whiteSpace: 'nowrap' }}>{item.uom}</td>
                                                        </>
                                                    )}
                                                    <td style={{ whiteSpace: 'nowrap' }}>{stkItem.docType}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{stkItem.docNo}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{stkItem.date}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{stkItem.grnNo}</td>
                                                    {/* <td style={{ whiteSpace: 'nowrap' }}>{stkItem.opQty}</td> */}
                                                    <td style={{ whiteSpace: 'nowrap' }}>{stkItem.receipts}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{stkItem.spName}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{stkItem.invNo}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{stkItem.invDate}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{stkItem.accQty}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{stkItem.rejQty}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{stkItem.disposal}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{stkItem.issue !== null ? stkItem.issue : ""}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>{stkItem.balQty}</td>
                                                </tr>
                                            ));
                                        })}
                                    </tbody>
                                </table>
                            </Box>
                            <Grid container justifyContent="flex-end" style={{ marginTop: '15px' }}>
                                <Button
                                    variant="contained"
                                    disabled={page === 1}
                                    onClick={() => handleViewClick(page - 1)}
                                    style={{ marginRight: '10px' }}
                                >
                                    Previous
                                </Button>

                                <Typography style={{ fontWeight: 'bold', margin: '0 10px' }}>
                                    Page {page} of {totalPages}
                                </Typography>

                                <Button
                                    variant="contained"
                                    disabled={page === totalPages || loading === true}
                                    onClick={() => handleViewClick(page + 1)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Next
                                </Button>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </form>
        </div>
    );
};

export default StockLedgerReportList;
