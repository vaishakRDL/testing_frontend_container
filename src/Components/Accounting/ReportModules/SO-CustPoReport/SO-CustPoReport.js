import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import './SO-CustPoReport.css';
import { AccCustomerDcReportItem, AccCustomerDcReportSearch, CustomerDcReport, CustomerDropShowdata, GetCustPoReport, PartNoSelectShow } from "../../../../ApiService/LoginPageService";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { SSOCustPoReportDownload } from "../../../../ApiService/DownloadCsvReportsService";
import NotificationBar from "../../../GlobleFiles/ServiceNotificationBar";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
const CustPoReport = () => {

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

    const [customerSelect, setCustomerSelect] = useState([]);
    const [customerSelectList, setCustomerSelectList] = useState([]);
    const [viewType, setViewType] = useState("Detailed");
    const [partNo, setPartNo] = useState([]);
    const [partNoList, setPartNoList] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });


    useEffect(() => {
        const today = new Date(); // e.g., 2025-08-09
        const currentYear = today.getFullYear();
        const isAfterApril = today.getMonth() >= 3; // month is 0-based (April = 3)

        // Financial year starts on April 1
        const financialYearStart = isAfterApril
            ? `${currentYear}-04-01`
            : `${currentYear - 1}-04-01`;

        const formattedToday = today.toISOString().split('T')[0]; // e.g., "2025-08-09"

        setFromDate(financialYearStart);
        setTodate(formattedToday);
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
        GetCustPoReport(
            {
                from: fromDate,
                to: toDate,
                item: partNo,
                customer: customerSelect,
                type: selectedType
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
            console.log("idArray", idArray)
            setCustomerSelect(idArray)
        }
    }

    // MULTI SELECTION AUTOCOMPLETE
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    ////////////////////HANDLE ITEM CHANGE//////////////////////////
    const handleChange = (e) => {
        PartNoSelectShow(
            { code: e.target.value, id: customerSelect },
            handlePartNoDropshow,
            handlePartNoDropshowException
        );
    };

    const handlePartNoDropshow = (dataObject) => {
        setPartNoList(dataObject?.data || []);
    };

    const handlePartNoDropshowException = (error, errorMessage) => { };

    const onPartNoSelectChange = (value) => {
        if (value !== null) {
            const idArray = value.map((item) => item.id)
            console.log("idArray", idArray)
            setPartNo(idArray)
        }
    }

    ///////Download///
    //     const handleExcelDownload = async () => {
    //     const workbook = new ExcelJS.Workbook();
    //     const worksheet = workbook.addWorksheet("Customer PO Report");

    //     const isDetailed = viewType === "Detailed";

    //     // ✅ Define Excel columns
    //     const columns = [
    //         { header: 'Customer', key: 'customer', width: 25 },
    //         { header: 'SO No', key: 'soNo', width: 20 },
    //         { header: 'SO Date', key: 'soDate', width: 20 },
    //         { header: 'PO No', key: 'poNo', width: 20 },
    //         { header: 'PO Date', key: 'poDate', width: 20 },
    //         { header: 'Item Code', key: 'itemCode', width: 20 },
    //         { header: 'Item Name', key: 'itemName', width: 30 },
    //         { header: 'UOM', key: 'uom', width: 10 },
    //         { header: 'Schedule Date', key: 'schDate', width: 20 },
    //         { header: 'SO Qty', key: 'soQty', width: 15 },
    //         { header: 'Rate', key: 'rate', width: 15 },     // ✅ lowercase key
    //         { header: 'Amount', key: 'amt', width: 15 },    // ✅ lowercase key
    //         { header: 'Short Closed Qty', key: 'shortQty', width: 20 },
    //         { header: 'Pending Qty', key: 'pendingQty', width: 20 },
    //         { header: 'Invoiced Qty', key: 'invoicedQty', width: 20 },
    //     ];

    //     if (isDetailed) {
    //         columns.push(
    //             { header: 'Invoiced No', key: 'invNo', width: 20 },
    //             { header: 'Invoiced Date', key: 'invDate', width: 20 },
    //             { header: 'Invoice Qty', key: 'invQty', width: 15 }
    //         );
    //     }

    //     worksheet.columns = columns;
    //     worksheet.getRow(1).font = { bold: true };

    //     let currentRowNumber = 2;

    //     // ✅ Populate data
    //     poReportData.forEach(supp => {
    //         supp.po.forEach(po => {
    //             po.items.forEach(item => {
    //                 // Always at least one row (like frontend)
    //                 const invList = item.invList && item.invList.length > 0 ? item.invList : [null];

    //                 invList.forEach(inv => {
    //                     const row = worksheet.getRow(currentRowNumber);

    //                     row.getCell('customer').value = supp.cName;
    //                     row.getCell('soNo').value = po.soNo;
    //                     row.getCell('soDate').value = po.soDate;
    //                     row.getCell('poNo').value = po.poNo;
    //                     row.getCell('poDate').value = po.poDate;
    //                     row.getCell('itemCode').value = item.itemCode;
    //                     row.getCell('itemName').value = item.itemName;
    //                     row.getCell('uom').value = item.uom;
    //                     row.getCell('schDate').value = item.schDate;
    //                     row.getCell('soQty').value = item.soQty;
    //                     row.getCell('rate').value = item.rate;       // ✅ fixed
    //                     row.getCell('amt').value = item.amt;         // ✅ fixed
    //                     row.getCell('shortQty').value = item.shortQty;
    //                     row.getCell('pendingQty').value = item.pendingQty;
    //                     row.getCell('invoicedQty').value = item.invoicedQty;

    //                     if (isDetailed) {
    //                         row.getCell('invNo').value = inv?.invNo || '—';
    //                         row.getCell('invDate').value = inv?.invDate || '—';
    //                         row.getCell('invQty').value = inv?.invQty || '—';
    //                     }

    //                     currentRowNumber++;
    //                 });
    //             });
    //         });
    //     });

    //     // ✅ Enable auto-filter (fixed version, no out of bounds)
    //     worksheet.autoFilter = {
    //         from: { row: 1, column: 1 },
    //         to: { row: 1, column: worksheet.columns.length }
    //     };

    //     // ✅ Export and download
    //     const buffer = await workbook.xlsx.writeBuffer();
    //     const blob = new Blob([buffer], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    //     });
    //     saveAs(blob, `Customer_PO_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    // };
    const handleExcelDownload = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Customer PO Report");

        const isDetailed = viewType === "Detailed";

        // Define Excel columns
        const columns = [
            { header: 'Customer', key: 'customer', width: 25 },
            { header: 'SO No', key: 'soNo', width: 20 },
            { header: 'SO Date', key: 'soDate', width: 20 },
            { header: 'PO No', key: 'poNo', width: 20 },
            { header: 'PO Date', key: 'poDate', width: 20 },
            { header: 'Item Code', key: 'itemCode', width: 20 },
            { header: 'Item Name', key: 'itemName', width: 30 },
            { header: 'UOM', key: 'uom', width: 10 },
            { header: 'Schedule Date', key: 'schDate', width: 20 },
            { header: 'SO Qty', key: 'soQty', width: 15 },
            { header: 'Rate', key: 'rate', width: 15 },
            { header: 'Amount', key: 'amt', width: 15 },
            { header: 'Short Closed Qty', key: 'shortQty', width: 20 },
            { header: 'Pending Qty', key: 'pendingQty', width: 20 },
            { header: 'Invoiced Qty', key: 'invoicedQty', width: 20 },
        ];

        if (isDetailed) {
            columns.push(
                { header: 'Invoiced No', key: 'invNo', width: 20 },
                { header: 'Invoiced Date', key: 'invDate', width: 20 },
                { header: 'Invoice Qty', key: 'invQty', width: 15 }
            );
        }

        worksheet.columns = columns;
        worksheet.getRow(1).font = { bold: true };

        let currentRowNumber = 2;

        // Helper function to write row
        const addRow = (row, inv, supp, po, item) => {
            row.getCell('customer').value = supp.cName;
            row.getCell('soNo').value = po.soNo;
            row.getCell('soDate').value = po.soDate;
            row.getCell('poNo').value = po.poNo;
            row.getCell('poDate').value = po.poDate;
            row.getCell('itemCode').value = item.itemCode;
            row.getCell('itemName').value = item.itemName;
            row.getCell('uom').value = item.uom;
            row.getCell('schDate').value = item.schDate;
            row.getCell('soQty').value = item.soQty;
            row.getCell('rate').value = item.rate;
            row.getCell('amt').value = item.amt;
            row.getCell('shortQty').value = item.shortQty;
            row.getCell('pendingQty').value = item.pendingQty;
            row.getCell('invoicedQty').value = item.invoicedQty;

            if (isDetailed) {
                row.getCell('invNo').value = inv?.invNo || '—';
                row.getCell('invDate').value = inv?.invDate || '—';
                row.getCell('invQty').value = inv?.invQty || '—';
            }
        };

        // Populate data
        poReportData.forEach(supp => {
            supp.po.forEach(po => {
                po.items.forEach(item => {
                    const invList = item.invList && item.invList.length > 0 ? item.invList : [null];

                    if (!isDetailed) {
                        // Summary Mode -> Only single row per item
                        const row = worksheet.getRow(currentRowNumber);
                        addRow(row, null, supp, po, item);
                        currentRowNumber++;
                    } else {
                        // Detailed Mode -> One row per invoice
                        invList.forEach(inv => {
                            const row = worksheet.getRow(currentRowNumber);
                            addRow(row, inv, supp, po, item);
                            currentRowNumber++;
                        });
                    }
                });
            });
        });

        // Enable auto filter
        worksheet.autoFilter = {
            from: { row: 1, column: 1 },
            to: { row: 1, column: worksheet.columns.length }
        };

        // Export file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        saveAs(blob, `Customer_PO_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
    };



    ///

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };
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

    const tableRows = React.useMemo(() => {
        const rows = [];

        poReportData.forEach((cust) => {
            const custRowCount = cust.po.reduce((total, po) => {
                return total + po.items.reduce((itemTotal, item) => {
                    return itemTotal + (item.invList?.length || 1);
                }, 0);
            }, 0);

            let custRendered = false;

            cust.po.forEach((po) => {
                const poRowCount = po.items.reduce((itemTotal, item) => {
                    return itemTotal + (item.invList?.length || 1);
                }, 0);

                let poRendered = false;

                po.items.forEach((item) => {
                    const invList = item.invList?.length ? item.invList : [null];
                    let itemRendered = false;

                    invList.forEach((inv) => {
                        rows.push({
                            customer: cust.cName,
                            showCustomer: !custRendered,
                            customerRowSpan: !custRendered ? custRowCount : undefined,

                            soNo: po.soNo,
                            soDate: po.soDate,
                            poNo: po.poNo,
                            poDate: po.poDate,
                            showPO: !poRendered,
                            poRowSpan: !poRendered ? poRowCount : undefined,

                            itemCode: item.itemCode,
                            itemName: item.itemName,
                            uom: item.uom,
                            schDate: item.schDate,
                            soQty: item.soQty,
                            rate: item.rate,
                            amt: item.amt,

                            shortQty: item.shortQty,
                            pendingQty: item.pendingQty,
                            invoicedQty: item.invoicedQty,
                            showItem: !itemRendered,
                            itemRowSpan: !itemRendered ? invList.length : undefined,

                            invNo: inv?.invNo || "—",
                            invDate: inv?.invDate || "—",
                            invQty: inv?.invQty || "—",
                        });

                        custRendered = true;
                        poRendered = true;
                        itemRendered = true;
                    });
                });
            });
        });

        return rows;
    }, [poReportData]);

    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    SO-Cust PO Report
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
                        <Grid item xs={12} sm={4} md={4} lg={4} style={{ display: 'flex', justifyContent: 'flex-start' }}>
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
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={viewType}
                                    onChange={(e) => {
                                        setViewType(e.target.value)
                                        setPoReportData([]);
                                    }}
                                >
                                    <FormControlLabel value="Detailed" control={<Radio />} label="Detailed" />
                                    <FormControlLabel value="Summary" control={<Radio />} label="Summary" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
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
                        <Grid item xs={12} sm={3} md={3} lg={3}>
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
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <FormControl style={{ width: '100%' }}>
                                <Autocomplete
                                    multiple
                                    id="checkboxes-tags-demo"
                                    options={partNoList}
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
                                    disabled={customerSelect.length === 0}
                                    size="small"
                                    renderInput={(params) => <TextField {...params} label="Search Part No" onChange={handleChange} />}
                                    onChange={(event, value) => onPartNoSelectChange(value)}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <Button disabled={loader === true} variant="contained" style={{ height: '30px', backgroundColor: '#002d68' }} onClick={handleReportView}>
                                {/* View */}
                                {loader ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'View'}
                            </Button>

                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <Button variant="contained" style={{ backgroundColor: '#002D68', marginTop: '2px' }} onClick={handleExcelDownload}>Download</Button>

                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Box sx={{ height: screenHeight - 368, width: '100%', overflow: 'auto' }}>
                                <table id="purchase">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Customer</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SO No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SO Date</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PO No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PO Date</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Code</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>UOM</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Schedule Date</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SO Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Rate</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Amount</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Short Closed Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Pending Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Invoiced Qty</th>

                                            {/* Only show these columns if Detailed view is selected */}
                                            {viewType === "Detailed" && (
                                                <>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Invoiced No</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Invoiced Date</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Invoice Qty</th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>


                                    <tbody>
                                        {tableRows.map((row, index) => (
                                            <tr key={index}>
                                                {row.showCustomer && (
                                                    <td rowSpan={row.customerRowSpan}>{row.customer}</td>
                                                )}

                                                {row.showPO && (
                                                    <>
                                                        <td rowSpan={row.poRowSpan}>{row.soNo}</td>
                                                        <td rowSpan={row.poRowSpan}>{row.soDate}</td>
                                                        <td rowSpan={row.poRowSpan}>{row.poNo}</td>
                                                        <td rowSpan={row.poRowSpan}>{row.poDate}</td>
                                                    </>
                                                )}

                                                {row.showItem && (
                                                    <>
                                                        <td rowSpan={row.itemRowSpan}>{row.itemCode}</td>
                                                        <td rowSpan={row.itemRowSpan}>{row.itemName}</td>
                                                        <td rowSpan={row.itemRowSpan}>{row.uom}</td>
                                                        <td rowSpan={row.itemRowSpan}>{row.schDate}</td>
                                                        <td rowSpan={row.itemRowSpan}>{row.soQty}</td>
                                                        <td rowSpan={row.itemRowSpan}>{row.rate}</td>
                                                        <td rowSpan={row.itemRowSpan}>{row.amt}</td>
                                                        <td rowSpan={row.itemRowSpan}>{row.shortQty}</td>
                                                        <td rowSpan={row.itemRowSpan}>{row.pendingQty}</td>
                                                        <td rowSpan={row.itemRowSpan}>{row.invoicedQty}</td>
                                                    </>
                                                )}

                                                {viewType === "Detailed" && (
                                                    <>
                                                        <td>{row.invNo}</td>
                                                        <td>{row.invDate}</td>
                                                        <td>{row.invQty}</td>
                                                    </>
                                                )}
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
export default CustPoReport;