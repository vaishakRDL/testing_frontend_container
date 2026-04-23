
import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PurchaseReportSearchSupplier, PurchaseReportSearchItem, GetPuchaseReport, PurchaseOrderGroup, PoAuthorizedReport } from "../../ApiService/LoginPageService";
// import './PurchaseReport.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";


const PoAuthorizationReport = () => {
    const [invCode, setInvCode] = useState("");
    const [itemGroupLists, setItemGroupLists] = useState([]);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [supplierList, setSupplierList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setTodate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // gives YYYY-MM-DD
    });
    const [selectedSupplier, setSelectedSupplier] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [poReportData, setPoReportData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('Summary');
    const [radioButtonValue, setRadioButtonValue] = useState("All");
    const [selectedItemGroup, setSelectedItemGroup] = useState([]);
    const [fyFrom, setFyFrom] = useState("");
    const [fyTo, setFyTo] = useState("");
    const [openNotification, setNotification] = useState({
        status: false,
        type: "error",
        message: "",
    });
    const [loading, setLoading] = useState(false);


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
        // setTodate(initialToDate);
    }, []);



    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };
        PurchaseOrderGroup(handleItemGroupSuccess, handleItemGroupException)

        // Add event listener to update height on resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const handleItemGroupSuccess = (dataObject) => {
        setItemGroupLists(dataObject?.data || []);
    }
    const handleItemGroupException = () => { }

    const handleClose = () => {
        setNotification({
            status: false,
            type: "",
            message: "",
        });
    };

    // SUPPLIER SEARCH
    const handleSupplierChange = (e) => {
        PurchaseReportSearchSupplier({ code: e.target.value }, handleSearchSupplierSucessShow, handleSearchSupplierExceptionShow);
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
        PurchaseReportSearchItem({ code: e.target.value }, handleSearchItemSucessShow, handleSearchItemExceptionShow);
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
        PoAuthorizedReport(
            {
                from: fromDate,
                to: toDate,
                supplier: selectedSupplier,
                items: selectedItem
            }, handleGetReportSuccess, handleGetReportException)
    }

    const handleGetReportSuccess = (dataObject) => {
        setLoader(false)
        console.log(dataObject.data)
        setPoReportData(dataObject?.data || [])
    }
    const handleGetReportException = () => {
        setLoader(false)
    }

    /////////////////////////////////////

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

    // const handleDownload = () => {
    //     const formattedData = poReportData.map((supp) => {
    //         const row = {
    //             "Supplier": supp?.spName,
    //             "GSTNo": supp?.gstNo,
    //             "PONO": supp?.poNo,
    //             "PODate": supp?.poDate,
    //             "POType": supp?.poType,
    //             "Reference": supp?.suppGroup,
    //             "Auth Level1": supp?.first_lvl_auth,
    //             "Auth Level1 By": supp?.firstAuthBy,
    //             "Auth Level2": supp?.second_lvl_auth,
    //             "Auth Level2 By": supp?.secondAuthBy,
    //             "SItemcode": supp?.itemCode,
    //             "SItemName": supp?.itemName,
    //             "SuppDesc": supp?.suppDesc,
    //         };

    //         // If selectedRadio is 'Summary' or 'Detailed', add these fields
    //         if (selectedRadio === 'Summary' || selectedRadio === 'Detailed') {
    //             row["SchDate"] = supp?.schDate;
    //             row["UOMCode"] = supp?.uomName;
    //             row["POQty"] = supp?.poQty;
    //             row["PBCumQty"] = supp?.cumQty;
    //             row["PendingGRNQty"] = supp?.pendingPo;
    //         }

    //         // If selectedRadio is 'Detailed', add these extra fields
    //         if (selectedRadio === 'Detailed') {
    //             row["SuppInvNo"] = supp?.suppInvNo;
    //             row["SuppInvDate"] = supp?.suppInvoiceDate;
    //             row["SuppDcNo"] = supp?.csSuppDcNo;
    //             row["SuppDcDate"] = supp?.suppDcDate;
    //             row["DateDiff"] = supp?.dateDiff;
    //             row["RcptQty"] = supp?.recptQty;
    //         }

    //         return row;
    //     });

    //     const workbook = arrayToWorksheet(formattedData);
    //     downloadExcelFile(workbook, 'PO_Report.xlsx');
    // };

    const handleDownload = () => {
        const formattedData = poReportData.map((supp) => {
            const row = {
                "Supplier": supp?.spName,
                "GSTNo": supp?.gstNo,
                "PONO": supp?.poNo,
                "PODate": supp?.poDate,
                "POType": supp?.poType,
                "Reference": supp?.suppGroup,
                "Auth Level1": supp?.first_lvl_auth,
                "Auth Level1 By": supp?.firstAuthBy,
                "Auth Level2": supp?.second_lvl_auth,
                "Auth Level2 By": supp?.secondAuthBy,
                "SItemcode": supp?.itemCode,
                "SItemName": supp?.itemName,
                "SuppDesc": supp?.suppDesc,
            };

            // Summary OR Detailed → add number fields
            if (selectedRadio === 'Summary' || selectedRadio === 'Detailed') {
                row["SchDate"] = supp?.schDate;
                row["UOMCode"] = supp?.uomName;

                // numeric conversions
                row["POQty"] = Number(supp?.poQty || 0);
                row["PBCumQty"] = Number(supp?.cumQty || 0);
                row["PendingGRNQty"] = Number(supp?.pendingPo || 0);
            }

            // Detailed → add extra numeric fields
            if (selectedRadio === 'Detailed') {
                row["SuppInvNo"] = supp?.suppInvNo;
                row["SuppInvDate"] = supp?.suppInvoiceDate;
                row["SuppDcNo"] = supp?.csSuppDcNo;
                row["SuppDcDate"] = supp?.suppDcDate;

                // numeric conversions
                row["DateDiff"] = Number(supp?.dateDiff || 0);
                row["RcptQty"] = Number(supp?.recptQty || 0);
            }

            return row;
        });

        const workbook = arrayToWorksheet(formattedData);
        downloadExcelFile(workbook, 'PO_Report.xlsx');
    };

    const handleGroupChange = (value) => {
        if (value !== null) {
            const idArray = value.map((item) => item.id)
            console.log("idArray", idArray)
            setSelectedItemGroup(idArray)
        }
    }

    const parseDate = (str) => {
        const [day, month, year] = str.split("-");
        return new Date(`${year}-${month}-${day}`);
    };

    // Helper: Format Date to "yyyy-MM-dd" (for <input type="date" />)
    const formatDateForInput = (date) => {
        return date.toISOString().split("T")[0];
    };

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("userDetails")) || {};
        if (stored.fyFrom && stored.fyTo) {
            const from = parseDate(stored.fyFrom);
            const to = parseDate(stored.fyTo);
            setFyFrom(formatDateForInput(from));
            setFyTo(formatDateForInput(to));
        }
    }, []);

    const isValidDateInRange = (value) => {
        const selected = new Date(value);
        const min = new Date(fyFrom);
        const max = new Date(fyTo);
        return selected >= min && selected <= max;
    };

    const handleFromDateChange = (e) => {
        const selectedFromDate = e.target.value;
        setFromDate(selectedFromDate);

        const fromYear = new Date(selectedFromDate).getFullYear();
        const isAfterApril = new Date(selectedFromDate).getMonth() >= 3;

        const financialYearEnd = isAfterApril
            ? `${fromYear + 1}-03-31`
            : `${fromYear}-03-31`;

        // setTodate(financialYearEnd);
    };

    const handleToDateChange = (e) => {
        const value = e.target.value;
        if (isValidDateInRange(value)) {
            setTodate(value);
            setNotification({ status: false, type: "", message: "" });
        } else {
            setNotification({
                status: true,
                type: "error",
                message: "Please select a valid To-Date",
            });
        }
    };

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const onInvCodeChange = (e) => {
        setInvCode(e.target.value);
    };
    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    PO Authorization Report
                </Typography>
            </div>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Grid container alignItems={'center'} spacing={2}>
                        <Grid item xs={12} sm={6} md={6} lg={6} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <TextField
                                id="outlined-basic"
                                type="date"
                                label="From"
                                variant="outlined"
                                style={{ marginRight: '10px', width: '70%' }}
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size="small"
                                value={fromDate}
                                onChange={handleFromDateChange}
                            // inputProps={{
                            //     min: fyFrom,
                            //     max: fyTo,
                            // }}
                            />
                            <TextField
                                id="outlined-basic"
                                type="date"
                                label="To"
                                variant="outlined"
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size="small"
                                style={{ width: '70%' }}
                                value={toDate}
                                onChange={(e) => setTodate(e.target.value)}
                            // inputProps={{
                            //     min: fyFrom,
                            //     max: fyTo,
                            // }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <FormControl style={{
                                display: 'flex', alignItems: 'center', width: '100%',
                            }}>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={selectedRadio}

                                    onChange={(e) => setSelectedRadio(e.target.value)}
                                >
                                    <FormControlLabel value="Detailed" control={<Radio />} label="Detailed" />
                                    <FormControlLabel value="Summary" control={<Radio />} label="Summary" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <FormControl fullWidth>
                                {/* <InputLabel id="demo-simple-select-label">INV Type</InputLabel> */}
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    // label="INV Type"
                                    // placeholder="INV Type"
                                    size="small"
                                    // disabled={isPOView ? true : false}
                                    style={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "5px",
                                    }}
                                    value={invCode}
                                    onChange={(e) => onInvCodeChange(e)}
                                >
                                    <MenuItem value="1">All</MenuItem>
                                    <MenuItem value="2">Pending For Authorization</MenuItem>
                                    <MenuItem value="3">Pending For 1 Level Auth</MenuItem>
                                    <MenuItem value="4">Pending For 2 Level Auth</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <Autocomplete
                                multiple
                                disablePortal
                                options={itemList}
                                // getOptionLabel={(option) => option.title}
                                // sx={{ width: 300 }}
                                size="small"
                                renderInput={(params) => <TextField {...params} label="Select Item" onChange={handleItemChange} />}
                                onChange={(event, value) => handleItemSelect(value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <Autocomplete
                                multiple
                                disablePortal
                                options={supplierList}
                                // getOptionLabel={(option) => option.title}
                                // sx={{ width: 300 }}
                                size="small"
                                renderInput={(params) => <TextField {...params} label="Select Supplier" onChange={handleSupplierChange} />}
                                onChange={(event, value) => handleSupplierSelect(value)}
                            />


                        </Grid>


                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <Button disabled={loader === true} variant="contained" style={{ backgroundColor: '#002D68', width: '60%' }} onClick={handleReportView}>
                                {/* View */}
                                {loader ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : "View"}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>

                            <Button
                                style={{ background: '#002D68', color: '#fff', }}
                                variant="contained"
                                // disabled={rows.length === 0}
                                onClick={handleDownload}
                            >
                                Export to Excel
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#FBF3D5' }}>
                                <div style={{ border: '1px solid #000000', width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '8px' }}>
                                    <Typography style={{ fontSize: '13px' }}>MALLIK ENGINEERING (INDIA) PVT LTD</Typography>
                                </div>
                                <div style={{ border: '1px solid #000000', width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '8px' }}>
                                    <Typography style={{ fontSize: '13px' }}>Purchase Order: Pending For GRN - Summary</Typography>
                                </div>
                                <div style={{ border: '1px solid #000000', width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '8px' }}>
                                    <Typography style={{ fontSize: '13px' }}>Date Range From 01 Apr 2023 To 22 Mar 2024</Typography>
                                </div>
                            </div> */}
                            <Box sx={{ height: screenHeight - 370, width: '100%', overflow: 'auto' }}>
                                {/* <DataGrid
                                    rows={[]}
                                    columns={purchaseReportColumn}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 5,
                                            },
                                        },
                                    }}
                                    sx={{
                                        '& .super-app-theme--header': {
                                            backgroundColor: '#93bce6',
                                            color: '#1c1919',
                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696',
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696',
                                        },
                                    }}
                                    // getRowClassName={(params) => {
                                    //     const rowIndex = reportLists.findIndex(row => row.id === params.row.id);
                                    //     if (rowIndex !== -1) {
                                    //         console.log(' ');
                                    //         return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    //     }
                                    //     return '';
                                    // }}
                                    pageSizeOptions={[5]}
                                    disableRowSelectionOnClick
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                /> */}
                                {/* 
                                <table id="customers">
                                    <thead>
                                        <tr>
                                            <th>Supplier</th>
                                            <th>GST No</th>
                                            <th>PO No</th>
                                            <th>PO Date</th>
                                            <th>PO Type</th>
                                            <th>Reference</th>
                                            <th>Item Group</th>
                                        </tr>
                                    </thead>
                                    {poReportData.map((supp, key) => (
                                        <tr key={key} style={{ width: '150px' }}>
                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }} >{supp.spName}</td>
                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.gst}</td>
                                            {supp.po.map((PO, key) => (
                                                <tr key={key} style={{ width: '150px' }}>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poNo}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poDate}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poType}</td>
                                                    {PO.items.map((item, key) => (
                                                        <tr key={key} style={{ width: '150px' }}>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemGroup}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppDesc}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.uom}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.qty}</td>
                                                        </tr>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tr>))}
                                </table> */}

                                {/* <table id="customers">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '150px' }}>Supplier Name</th>
                                            <th style={{ width: '150px' }}>GST</th>
                                            <th style={{ width: '150px' }}>PO Number</th>
                                            <th style={{ width: '150px' }}>PO Date</th>
                                            <th style={{ width: '150px' }}>PO Type</th>
                                            <th style={{ width: '150px' }}>Item Group</th>
                                            <th style={{ width: '150px' }}>Item Code</th>
                                            <th style={{ width: '150px' }}>Item Name</th>
                                            <th style={{ width: '150px' }}>Supplier Description</th>
                                            <th style={{ width: '150px' }}>UOM</th>
                                            <th style={{ width: '150px' }}>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {poReportData.map((supp, key) => (
                                            <React.Fragment key={key}>
                                                <tr style={{ width: '150px' }}>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.spName}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.gst}</td>
                                                    <td colSpan="9"></td>
                                                </tr>
                                                {supp.po.map((PO, poKey) => (
                                                    <React.Fragment key={poKey}>
                                                        <tr style={{ width: '150px' }}>
                                                            <td colSpan="2"></td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poNo}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poDate}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poType}</td>
                                                            <td colSpan="6"></td>
                                                        </tr>
                                                        {PO.items.map((item, itemKey) => (
                                                            <tr key={itemKey} style={{ width: '150px' }}>
                                                                <td colSpan="5"></td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemGroup}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppDesc}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.uom}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.qty}</td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table> */}

                                <table id="purchase">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Supplier</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>GSTNo</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PONO</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PODate</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>POType</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Reference</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Auth Level1</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Auth Level1 By</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Auth Level1 On</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Auth Level2</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Auth Level2 By</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Auth Level2 On</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SItemcode</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SItemName</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SuppDesc</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SchDate</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>UOMCode</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>POQty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PBCumQty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PendingGRNQty</th>
                                            {
                                                selectedRadio === "Detailed"
                                                && <> <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SuppInvNo</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SuppInvDate</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SuppDcNo</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SuppDcDate</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>DateDiff</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>RcptQty</th>
                                                </>}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {poReportData
                                            .map((supp, suppKey) => (

                                                <tr key={suppKey} style={{ width: '150px' }}>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.spName}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.gstNo}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.poNo}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.poDate}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.poType}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.suppGroup}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.first_lvl_auth}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.firstAuthBy}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.first_lvl_auth === 1 ? 'YES' : 'NO'}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.second_lvl_auth}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.secondAuthBy}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.second_lvl_auth === 1 ? 'YES' : 'NO'}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.itemCode}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.itemName}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.suppDesc}</td>


                                                    {/* SUMMARY */}
                                                    {
                                                        selectedRadio === 'Detailed' || selectedRadio === "Summary"
                                                            ? <>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.schDate}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.uomName}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.poQty}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.cumQty}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.pendingPo}</td>
                                                            </>
                                                            : null
                                                    }

                                                    {/* DETAILED */}
                                                    {
                                                        selectedRadio === "Detailed"
                                                        && <>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.suppInvNo}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.suppInvoiceDate}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.csSuppDcNo}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.suppDcDate}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.dateDiff}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.recptQty}</td>
                                                        </>
                                                    }
                                                </tr>
                                            ))}

                                    </tbody>


                                    {/* //////////////////////////////////////OLD CODE///////////////////////////////// */}
                                    {/* <tbody>
                                        {poReportData.map((supp, suppKey) => (
                                            <React.Fragment key={suppKey}>
                                                {supp.po.map((PO, poKey) => (
                                                    <React.Fragment key={poKey}>
                                                        {PO.supps.map((item, itemKey) => (
                                                            <tr key={itemKey} style={{ width: '150px' }}>

                                                                {itemKey === 0 && poKey === 0 ? (
                                                                    <>
                                                                        <td rowSpan={supp.po.reduce((total, po) => total + po.items.length, 0)} style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.spName}</td>
                                                                        <td rowSpan={supp.po.reduce((total, po) => total + po.items.length, 0)} style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.gst}</td>
                                                                    </>
                                                                ) : null}

                                                                {itemKey === 0 ? (
                                                                    <>
                                                                        <td rowSpan={PO.items.length} style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poNo}</td>
                                                                        <td rowSpan={PO.items.length} style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poDate}</td>
                                                                        <td rowSpan={PO.items.length} style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poType}</td>
                                                                    </>
                                                                ) : null}

                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemGroup}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppDesc}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.schDate}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.uom}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.qty}</td>

                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.pbCumQty}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.pendingPo}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppInvNo}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppInvoiceDate}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppDcNo}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppDcDate}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.dateDiff}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.recptQty}</td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody> */}
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
export default PoAuthorizationReport;