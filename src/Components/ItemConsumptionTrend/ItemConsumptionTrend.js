import React, { useState, useEffect } from 'react';
import { Autocomplete, Checkbox, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Button, Card, CardContent, Box, FormGroup, FormControlLabel, RadioGroup, Radio, FormLabel, CircularProgress, LinearProgress } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { GetSearchedItems, GetStockLedgerReport, GetMainLocation, GetItemGroup, GetItemConsumptionTrend, GetSuppVsItemAllSuppList } from '../../ApiService/LoginPageService';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useModuleLocks } from '../context/ModuleLockContext';

const ItemConsumptionTrend = () => {


    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Item Consumption Trend")?.lockStatus === "locked";

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [selectedItemGroup, setSelectedItemGroup] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState([]);
    const [locationLists, setLocationLists] = useState([]);
    const [itemGroupLists, setItemGroupLists] = useState([]);
    const [ledgerReportData, setLedgerReportData] = useState([]);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [isMrn, setIsMrn] = useState('');
    const [period, setPeriod] = useState('');
    const [itemConsumtionData, setItemConsumptionData] = useState([]);
    const [itemConsumptionHeader, setItemConsumptionHeader] = useState('');
    const [supplierList, setSupplierList] = useState([]);
    const [supplierId, setSupplierId] = useState([]);
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
            const ids = value.map(item => item.id);
            setSelectedItemId(ids)
        }
    }

    const handleSearchLocationChange = (value) => {
        if (value !== null) {
            const ids = value.map(item => item.id);
            setSelectedLocation(ids)
        }
    }

    const handleSearchGroupChange = (value) => {
        if (value !== null) {
            const ids = value.map(item => item.id);
            setSelectedItemGroup(ids)
        }
    }

    const handleViewClick = () => {
        setLoading(true);
        GetItemConsumptionTrend({
            fromDate: fromDate,
            toDate: toDate,
            items: selectedItemId,
            locations: selectedLocation,
            itemGroups: selectedItemGroup,
            mrn: isMrn,
            suppliers: supplierId,
            type: period
        }, handleViewSuccess, handleViewException)
    }

    const handleViewSuccess = (dataObject) => {
        setItemConsumptionData(dataObject?.data || []);
        setItemConsumptionHeader(dataObject?.headers || '');
        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }
    const handleViewException = () => {
        setTimeout(() => {
            setLoading(false);
        }, 2000)
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

    // // TABLE DATA

    // // Define keys to ignore
    // const ignoredKeys = new Set(["avgQty", "highestQty"]);

    // // Extract all unique keys from the periods objects, ignoring specified keys
    // const uniquePeriodsKeys = Array.from(
    //     itemConsumtionData.length > 0 && itemConsumtionData.reduce((keysSet, item) => {
    //         Object.keys(item.periods)
    //             .filter((key) => !ignoredKeys.has(key)) // Exclude ignored keys
    //             .forEach((key) => keysSet.add(key));
    //         return keysSet;
    //     }, new Set())
    // );

    // console.log("uniquePeriodsKeys", uniquePeriodsKeys)

    //////////////////////////////////////////////////
    // SUPPLIER SEARCH
    const handleSupSearchChange = (e) => {
        GetSuppVsItemAllSuppList({ code: e.target.value }, handleSupplierSuccess, handleSupplierException);
    }

    const handleSupplierSuccess = (dataObject) => {
        setSupplierList(dataObject?.data || []);
    }
    const handleSupplierException = (errorObject, errorMessage) => {
    }

    const handleSupplierSearchItemChange = (value) => {
        if (value !== null) {
            const ids = value.map(item => item.id);
            setSupplierId(ids)
        }
    };

    // EXPORT TO XL
    const arrayToWorksheet = (array) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PO Report');

        if (array.length === 0) return workbook;

        // Define columns dynamically based on keys
        const columns = Object.keys(array[0]).map((key) => ({
            header: key.toUpperCase(), // Convert headers to uppercase
            key: key,
            width: 20,
        }));

        worksheet.columns = columns;

        // Add data rows
        array.forEach((row) => worksheet.addRow(row));

        // Style the header row (bold + center aligned)
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        // Center align all data rows
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        });

        return workbook;
    };

    const downloadExcelFile = async (workbook, filename) => {
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), filename);
    };

    const headers = {
        itemGroup: "Item Group",
        itemCode: "Item Code",
        itemName: "Item Name",
        location: "Location",
        stdRate: "Standard Rate",
        productFamily: "Product Family",
        April: "April",
        May: "May",
        avgQty: "Average Quantity",
        highestQty: "Highest Quantity",
        totalQty: "Total Quantity"
    }

    const consumptionData = [
        {
            itemGroup: "FASTENERS",
            itemCode: "CLINCH STUD STL FH-M5-16",
            itemName: "Self Clinching Stud, Steel",
            location: "STORES",
            stdRate: "2.12",
            productFamily: "General",
            April: 24,
            May: 0,
            avgQty: 24,
            highestQty: 24,
            totalQty: 24
        }
    ];

    const handleExportClick = () => {
        const formattedData = itemConsumtionData.map((item) => {
            const formattedItem = {};
            for (const key in itemConsumptionHeader) {
                formattedItem[itemConsumptionHeader[key]] = item[key];
            }
            return formattedItem;
        });

        const workbook = arrayToWorksheet(formattedData);
        downloadExcelFile(workbook, 'Item Consumption Trend.xlsx');
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                <Typography sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }} variant="h5">
                    Item Consumption Trend (MIN-MAX)
                </Typography>
            </div>
            <form>
                <Grid container spacing={2} padding={1} style={{ zoom: '80%' }}>
                    <Grid item xs={12} sm={12} md={3}>
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
                    <Grid item xs={12} sm={12} md={3}>
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
                    <Grid item xs={12} sm={12} md={3}>
                        <Autocomplete
                            multiple
                            disablePortal
                            id="combo-box-demo"
                            options={itemList}
                            fullWidth
                            getOptionLabel={(option) => option.label || ''}
                            renderInput={(params) => <TextField {...params} label="Search Items" onChange={handleChange} />}
                            onChange={(event, value) => handleSearchItemChange(value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={isMrn} onChange={(e) => setIsMrn(e.target.checked)} />} label="MRN Only" />
                        </FormGroup>

                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                            >
                                <FormControlLabel value="week" control={<Radio />} label="Weekly" />
                                <FormControlLabel value="month" control={<Radio />} label="Monthly" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                        <Autocomplete
                            multiple
                            disablePortal
                            id="combo-box-demo"
                            options={locationLists}
                            fullWidth
                            getOptionLabel={(option) => option.name || ''}
                            renderInput={(params) => <TextField {...params} label="Search Location" />}
                            onChange={(event, value) => handleSearchLocationChange(value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                        <Autocomplete
                            multiple
                            disablePortal
                            id="combo-box-demo"
                            options={itemGroupLists}
                            fullWidth
                            getOptionLabel={(option) => option.name || ''}
                            renderInput={(params) => <TextField {...params} label="Search Group" />}
                            onChange={(event, value) => handleSearchGroupChange(value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                        <Autocomplete
                            multiple
                            disablePortal
                            id="combo-box-demo"
                            options={supplierList}
                            fullWidth
                            getOptionLabel={(option) => option.spCode || ''}
                            renderInput={(params) => <TextField {...params} label="Supplier" onChange={handleSupSearchChange} />}
                            onChange={(event, value) => handleSupplierSearchItemChange(value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={3} style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <Button disabled={loading === true || isModuleLocked} variant="contained" style={{ backgroundColor: isModuleLocked ? 'gray' : '#002d68' }} onClick={handleViewClick}>
                            {/* View Report */}
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : 'View Report'}
                        </Button>
                        <Button disabled={itemConsumtionData.length === 0 && true} variant="contained" style={{ backgroundColor: itemConsumtionData.length === 0 ? 'gray' : '#002d68' }} onClick={handleExportClick}>
                            Export
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
                                {itemConsumtionData.length > 0 ?
                                    <table id="customers" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f9f9f9', zIndex: 1 }}>
                                            <tr>
                                                {Object.entries(itemConsumptionHeader).map(([key, label], keyIndex) => (
                                                    <th key={keyIndex} style={{ whiteSpace: 'nowrap' }}>
                                                        {label}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {itemConsumptionHeader && itemConsumtionData.map((item, itemIndex) => (
                                                <tr key={itemIndex}>
                                                    {Object.keys(itemConsumptionHeader).map((key, keyIndex) => (
                                                        <td key={keyIndex} style={{ whiteSpace: 'nowrap' }}>
                                                            {item[key]}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    :
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography style={{ fontFamily: 'Orbitron' }}>No Data Found</Typography>
                                    </div>
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </form>
        </div>
    );
};

export default ItemConsumptionTrend;
