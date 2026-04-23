import React, { useState, useEffect } from 'react';
import { Autocomplete, Checkbox, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Button, Card, CardContent, Box, FormGroup, FormControlLabel, RadioGroup, Radio, FormLabel, LinearProgress, CircularProgress } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { GetSearchedItems, GetStockLedgerReport, GetMainLocation, GetItemGroup, GetItemConsumptionTrend, GetSuppVsItemAllSuppList, GetStockAgeReport } from '../../ApiService/LoginPageService';

const StockAgeReport = () => {
    const [uniquePeriodsKeys, setUniquePeriodsKeys] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
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
    const [supplierList, setSupplierList] = useState([]);
    const [supplierId, setSupplierId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [mainTotalData, setMainTotalData] = useState({});

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

    const handleViewClick = () => {
        setLoading(true);
        GetStockAgeReport({

            date: selectedDate,
            itmGrpId: selectedItemGroup,
            items: selectedItemId,
            locId: selectedLocation
        }, handleViewSuccess, handleViewException)
    }

    // const handleViewSuccess = (dataObject) => {
    //     setItemConsumptionData(dataObject?.data || []);
    //     console.log("Sample item:Sample itemSample item", dataObject?.data?.[0]);

    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 2000)
    // }
    // const handleViewException = () => {
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 2000)
    // }
    // const handleViewSuccess = (dataObject) => {
    //     const apiData = dataObject?.data || [];

    //     const flattenData = (data) => {
    //         const rows = [];
    //         const periodKeys = new Set();

    //         data.forEach((groupItem) => {
    //             groupItem.prdFam.forEach((famItem) => {
    //                 famItem.stkDtl.forEach((stk) => {
    //                     const row = {
    //                         itemGroup: groupItem.itemGroup,
    //                         productFamily: famItem.productFamily,
    //                         location: stk.location,
    //                         itemCode: stk.itemCode,
    //                         itemName: stk.itemName,
    //                         stdRate: stk.stdRate,
    //                         uom: stk.uom,
    //                         clsQty: stk.clsQty,
    //                         periods: {},
    //                     };

    //                     Object.keys(stk).forEach((key) => {
    //                         if (!["itemCode", "itemName", "uom", "stdRate", "clsQty", "location", "storeId", "itemId", "clsValue"].includes(key)) {
    //                             row.periods[key] = stk[key]?.clsQty || 0;
    //                             periodKeys.add(key);
    //                         }
    //                     });

    //                     rows.push(row);
    //                 });
    //             });
    //         });

    //         return {
    //             rows,
    //             periodKeys: Array.from(periodKeys),
    //         };
    //     };

    //     const { rows, periodKeys } = flattenData(apiData);
    //     setItemConsumptionData(rows);           // ✅ Now it's flat and ready for table
    //     setUniquePeriodsKeys(periodKeys);      // ✅ Also store period keys for table headers
    //     setLoading(false);
    //     setMainTotalData(dataObject?.mainTotal || []);

    // };
    const handleViewSuccess = (dataObject) => {
        const apiData = dataObject?.data || [];

        const flattenData = (data) => {
            const rows = [];
            const periodKeys = new Set();

            data.forEach((groupItem) => {
                groupItem.prdFam.forEach((famItem) => {
                    famItem.stkDtl.forEach((stk) => {
                        const row = {
                            itemGroup: groupItem.itemGroup,
                            productFamily: famItem.productFamily,
                            location: stk.location,
                            itemCode: stk.itemCode,
                            itemName: stk.itemName,
                            stdRate: stk.stdRate,
                            uom: stk.uom,
                            clsQty: stk.clsQty,
                            clsValue: stk.clsValue,
                            periods: {},
                        };

                        Object.keys(stk).forEach((key) => {
                            if (
                                ![
                                    "itemCode",
                                    "itemName",
                                    "uom",
                                    "stdRate",
                                    "clsQty",
                                    "clsValue",
                                    "location",
                                    "storeId",
                                    "itemId"
                                ].includes(key)
                            ) {
                                row.periods[key] = {
                                    clsQty: stk[key]?.clsQty || 0,
                                    clsValue: stk[key]?.clsValue || 0
                                };
                                periodKeys.add(key);
                            }
                        });

                        rows.push(row);
                    });
                });
            });

            return {
                rows,
                periodKeys: Array.from(periodKeys),
            };
        };

        const { rows, periodKeys } = flattenData(apiData);
        setItemConsumptionData(rows);
        setUniquePeriodsKeys(periodKeys);
        setMainTotalData(dataObject?.mainTotal || []);
        setLoading(false);
    };

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

    // TABLE DATA

    // Define keys to ignore
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

    // const ignoredKeys = new Set(["clsQty", "clsValue"]);

    // const flattenData = (data) => {
    //     const rows = [];
    //     const periodKeys = new Set();

    //     data.forEach((groupItem) => {
    //         groupItem.prdFam.forEach((famItem) => {
    //             famItem.stkDtl.forEach((stk) => {
    //                 const row = {
    //                     itemGroup: groupItem.itemGroup,
    //                     productFamily: famItem.productFamily,
    //                     location: stk.location,
    //                     itemCode: stk.itemCode,
    //                     itemName: stk.itemName,
    //                     stdRate: stk.stdRate,
    //                     uom: stk.uom,
    //                     clsQty: stk.clsQty,
    //                     periods: {}
    //                 };

    //                 Object.keys(stk).forEach((key) => {
    //                     if (!["itemCode", "itemName", "uom", "stdRate", "clsQty", "location", "storeId", "itemId", "clsValue"].includes(key)) {
    //                         row.periods[key] = stk[key]?.clsQty || 0;
    //                         periodKeys.add(key);
    //                     }
    //                 });

    //                 rows.push(row);
    //             });
    //         });
    //     });

    //     return { rows, periodKeys: Array.from(periodKeys) };
    // };

    // const { rows: flattenedData, periodKeys: uniquePeriodsKeys } = flattenData(apiData); // `apiData` is your backend response

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
            setSupplierId(value.id);
        }
    };

    //HANDLE GROUP CHANGE
    const handleGroupChange = (value) => {
        if (value !== null) {
            const idArray = value.map((item) => item.id)
            console.log("idArray", idArray)
            setSelectedItemGroup(idArray)
        }
    }


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                <Typography sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }} variant="h5">
                    Stock Age Report
                </Typography>
            </div>
            <form>
                <Grid container spacing={2} padding={1} style={{ zoom: '80%' }}>
                    <Grid item xs={12} sm={12} md={2}>
                        <TextField
                            fullWidth
                            id="from-date"
                            label="As On Date"
                            variant="outlined"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={2}>
                        <Autocomplete
                            multiple
                            limitTags={2}

                            id="checkboxes-tags-demo"
                            options={itemList}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option.label || ''}
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

                    <Grid item xs={12} sm={12} md={2}>
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
                    <Grid item xs={12} sm={12} md={2}>

                        <Autocomplete
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
                            renderInput={(params) => <TextField {...params} label="Item Group" />}
                            onChange={(event, value) => handleGroupChange(value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={isMrn} onChange={(e) => setIsMrn(e.target.checked)} />} label="Show Value" />
                        </FormGroup>
                    </Grid>

                    <Grid item xs={12} sm={12} md={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button disabled={loading === true} variant="contained" style={{ backgroundColor: '#002d68', width: '150px' }} onClick={handleViewClick}>
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
                                {/* <table id="customers" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th>Item Group</th>
                                            <th>Item Code</th>
                                            <th>Item Name</th>
                                            <th>Store Location</th>
                                            <th>Item Std Rate</th>
                                            <th>Product Family</th>
                                            <th style={{ minWidth: 80 }}>CL Qty</th>
                                            {isMrn && <th style={{ minWidth: 100 }}>CL Value</th>}

                                            {uniquePeriodsKeys.map((key) => (
                                                <React.Fragment key={key}>
                                                    <th style={{ minWidth: 80, whiteSpace: 'nowrap' }}>{key} Qty</th>
                                                    {isMrn && (
                                                        <th style={{ minWidth: 100, whiteSpace: 'nowrap' }}>
                                                            {key} Value
                                                        </th>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {itemConsumtionData.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.itemGroup}</td>
                                                <td>{item.itemCode}</td>
                                                <td>{item.itemName}</td>
                                                <td>{item.location}</td>
                                                <td>{item.stdRate}</td>
                                                <td>{item.productFamily}</td>
                                                <td>{item.clsQty}</td>
                                                {isMrn && <td>{item.clsValue?.toFixed(2) ?? 0}</td>}

                                                {uniquePeriodsKeys.map((key) => (
                                                    <React.Fragment key={`${idx}-${key}`}>
                                                        <td style={{ minWidth: 80 }}>
                                                            {item.periods?.[key]?.clsQty ?? 0}
                                                        </td>
                                                        {isMrn && (
                                                            <td style={{ minWidth: 100 }}>
                                                                {item.periods?.[key]?.clsValue?.toFixed(2) ?? 0}
                                                            </td>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </tr>
                                        ))}

                                        <tr style={{ fontWeight: 'bold', background: '#f1f1f1' }}>
                                            <td colSpan={6}>Total</td>
                                            <td>{mainTotalData?.[0]?.clsQty ?? 0}</td>
                                            {isMrn && <td>{mainTotalData?.[0]?.clsValue?.toFixed(2) ?? 0}</td>}

                                            {uniquePeriodsKeys.map((key) => (
                                                <React.Fragment key={`total-${key}`}>
                                                    <td>
                                                        {mainTotalData?.[0]?.[key]?.clsQty ?? 0}
                                                    </td>
                                                    {isMrn && (
                                                        <td>
                                                            {mainTotalData?.[0]?.[key]?.clsValue?.toFixed(2) ?? 0}
                                                        </td>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table> */}
                                {/* <table id="customers" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th>Item Group</th>
                                            <th>Item Code</th>
                                            <th>Item Name</th>
                                            <th>Store Location</th>
                                            <th>Item Std Rate</th>
                                            <th>Product Family</th>
                                            <th style={{ minWidth: 80 }}>CL Qty</th>
                                            {isMrn && <th style={{ minWidth: 100 }}>CL Value</th>}

                                            {uniquePeriodsKeys.map((key) => (
                                                <React.Fragment key={key}>
                                                    <th style={{ minWidth: 80, whiteSpace: 'nowrap' }}>{key} Qty</th>
                                                    {isMrn && (
                                                        <th style={{ minWidth: 100, whiteSpace: 'nowrap' }}>
                                                            {key} Value
                                                        </th>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {itemConsumtionData.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.itemGroup}</td>
                                                <td>{item.itemCode}</td>
                                                <td>{item.itemName}</td>
                                                <td>{item.location}</td>
                                                <td>{item.stdRate}</td>
                                                <td>{item.productFamily}</td>
                                                <td>{item.clsQty}</td>
                                                {isMrn && <td>{item.clsValue?.toFixed(2) ?? 0}</td>}

                                                {uniquePeriodsKeys.map((key) => (
                                                    <React.Fragment key={`${idx}-${key}`}>
                                                        <td style={{ minWidth: 80 }}>
                                                            {item.periods?.[key]?.clsQty ?? 0}
                                                        </td>
                                                        {isMrn && (
                                                            <td style={{ minWidth: 100 }}>
                                                                {item.periods?.[key]?.clsValue?.toFixed(2) ?? 0}
                                                            </td>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table> */}
                                <table id="customers" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th>Item Group</th>
                                            <th>Item Code</th>
                                            <th>Item Name</th>
                                            <th>Store Location</th>
                                            <th>Item Std Rate</th>
                                            <th>Product Family</th>
                                            <th style={{ minWidth: 80 }}>CL Qty</th>
                                            {isMrn && <th style={{ minWidth: 100 }}>CL Value</th>}

                                            {uniquePeriodsKeys.map((key) => (
                                                <React.Fragment key={key}>
                                                    <th style={{ minWidth: 80, whiteSpace: 'nowrap' }}>{key} Qty</th>
                                                    {isMrn && (
                                                        <th style={{ minWidth: 100, whiteSpace: 'nowrap' }}>
                                                            {key} Value
                                                        </th>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {itemConsumtionData.map((item, idx) => (
                                            <tr key={idx}>
                                                <td>{item.itemGroup}</td>
                                                <td>{item.itemCode}</td>
                                                <td>{item.itemName}</td>
                                                <td>{item.location}</td>
                                                <td>{item.stdRate}</td>
                                                <td>{item.productFamily}</td>
                                                <td>{item.clsQty}</td>
                                                {isMrn && <td>{item.clsValue?.toFixed(2) ?? 0}</td>}

                                                {uniquePeriodsKeys.map((key) => (
                                                    <React.Fragment key={`${idx}-${key}`}>
                                                        <td style={{ minWidth: 80 }}>
                                                            {item.periods?.[key]?.clsQty ?? 0}
                                                        </td>
                                                        {isMrn && (
                                                            <td style={{ minWidth: 100 }}>
                                                                {item.periods?.[key]?.clsValue?.toFixed(2) ?? 0}
                                                            </td>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </form>
        </div>
    );
};

export default StockAgeReport;
