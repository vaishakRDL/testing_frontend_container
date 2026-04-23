import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PurchaseReportSearchSupplier, PurchaseReportSearchItem, GetPuchaseReport, PurchaseOrderGroup, SupplyItemcode } from "../../ApiService/LoginPageService";
import './PurchaseReport.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";


const PurchaseOrderReport = () => {
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
        // PurchaseReportSearchSupplier({ code: e.target.value }, handleSearchSupplierSucessShow, handleSearchSupplierExceptionShow);
        SupplyItemcode({ code: e.target.value }, handleSearchSupplierSucessShow, handleSearchSupplierExceptionShow);

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
        GetPuchaseReport(
            {
                from: fromDate,
                to: toDate,
                supplier: selectedSupplier,
                items: selectedItem,
                type: radioButtonValue === 'All' ? 0 : 1
            }, handleGetReportSuccess, handleGetReportException)
    }

    const handleGetReportSuccess = (dataObject) => {
        setLoader(false)
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
    //     const formattedData = [];

    //     poReportData.forEach((supp) => {
    //         supp.po.forEach((PO) => {
    //             PO.items
    //                 .filter(item => radioButtonValue === "All" || item.pendingPo > 0)
    //                 .forEach((item) => {
    //                     const row = {
    //                         "Supplier Name": supp.spName,
    //                         "GST": supp.gst,
    //                         "PO Number": PO.poNo,
    //                         "PO Date": PO.poDate,
    //                         "PO Type": PO.poType,
    //                         "Item Group": item.itemGroup,
    //                         "Item Code": item.itemCode,
    //                         "Item Name": item.itemName,
    //                         "Supplier Description": item.suppDesc,
    //                         "Schedule Date": item.schDate,
    //                         "UOM": item.uom,
    //                     };

    //                     // Add summary fields if selected
    //                     if (selectedRadio === "Detailed" || selectedRadio === "Summary") {
    //                         row["PO Quantity"] = item.qty;
    //                         row["PB Cum Qty"] = item.pbCumQty;
    //                         row["Pending Qty"] = item.pendingPo;
    //                         row["Amount"] = item.amt;
    //                         row["Rate"] = item.rate;
    //                     }

    //                     // Add detailed fields if selected
    //                     if (selectedRadio === "Detailed") {
    //                         row["Supp Inv No"] = item.suppInvNo;
    //                         row["Supp Inv Date"] = item.suppInvoiceDate;
    //                         row["Supp Dc No"] = item.suppDcNo;
    //                         row["Supp Dc Date"] = item.suppDcDate;
    //                         // row["Date Diff"] = item.dateDiff;
    //                         row["Rcpt Qty"] = item.recptQty;
    //                     }

    //                     formattedData.push(row);
    //                 });
    //         });
    //     });

    //     const workbook = arrayToWorksheet(formattedData);
    //     downloadExcelFile(workbook, 'PO_Report.xlsx');
    // };
    const handleDownload = () => {
        const formattedData = [];

        poReportData.forEach((supp) => {
            supp.po.forEach((PO) => {
                PO.items
                    .filter(item => radioButtonValue === "All" || item.pendingPo > 0)
                    .forEach((item) => {
                        const row = {
                            "Supplier Name": supp.spName,
                            "GST": supp.gst,
                            "PO Number": PO.poNo,
                            "PO Date": PO.poDate,
                            "PO Type": PO.poType,
                            "Item Group": item.itemGroup,
                            "Item Code": item.itemCode,
                            "Item Name": item.itemName,
                            "Supplier Description": item.suppDesc,
                            "Schedule Date": item.schDate,
                            "UOM": item.uom,
                        };

                        // Convert numeric fields → Number()
                        if (selectedRadio === "Detailed" || selectedRadio === "Summary") {
                            row["PO Quantity"] = Number(item.qty || 0);
                            row["PB Cum Qty"] = Number(item.pbCumQty || 0);
                            row["Pending Qty"] = Number(item.pendingPo || 0);
                            row["Amount"] = Number(item.amt || 0);
                            row["Rate"] = Number(item.rate || 0);
                        }

                        if (selectedRadio === "Detailed") {
                            row["Supp Inv No"] = item.suppInvNo;
                            row["Supp Inv Date"] = item.suppInvoiceDate;
                            row["Supp Dc No"] = item.suppDcNo;
                            row["Supp Dc Date"] = item.suppDcDate;
                            row["Rcpt Qty"] = Number(item.recptQty || 0);
                        }

                        formattedData.push(row);
                    });
            });
        });

        // Convert to Excel
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
    const handleFromDateChange = (e) => {
        // const value = e.target.value;
        // if (isValidDateInRange(value)) {
        //     setFromDate(value);
        //     setNotification({ status: false, type: "", message: "" });
        // } else {
        //     setNotification({
        //         status: true,
        //         type: "error",
        //         message: "Please select a valid From-Date",
        //     });
        // }
        const selectedFromDate = e.target.value;
        setFromDate(selectedFromDate);

        const fromYear = new Date(selectedFromDate).getFullYear();
        const isAfterApril = new Date(selectedFromDate).getMonth() >= 3;

        const financialYearEnd = isAfterApril
            ? `${fromYear + 1}-03-31`
            : `${fromYear}-03-31`;

        // setTodate(financialYearEnd);
    };


    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Purchase Order Report
                </Typography>
            </div>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Grid container alignItems={'center'} spacing={2}>
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
                                onChange={handleFromDateChange}

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
                                    value={selectedRadio}
                                    onChange={(e) => setSelectedRadio(e.target.value)}
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
                                    value={radioButtonValue}
                                    onChange={(e) => {
                                        setRadioButtonValue(e.target.value);
                                        setPoReportData([])
                                    }}
                                >
                                    <FormControlLabel value="All" control={<Radio />} label="All" />
                                    <FormControlLabel value="Pending for GRN" control={<Radio />} label="Pending for GRN" />
                                </RadioGroup>
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
                            {/* <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={[]}
                                renderInput={(params) => <TextField {...params} label="Select Item Group" />}
                                size="small"
                            /> */}
                            <Autocomplete
                                fullWidth
                                size="small"
                                multiple
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
                        </Grid>

                        <Grid item xs={12} sm={1.5} md={1.5} lg={1.5}>
                            <Button disabled={loader === true} variant="contained" style={{ backgroundColor: '#002D68' }} onClick={handleReportView}>
                                {/* View */}
                                {loader ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : "View"}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={1.5} md={1.5} lg={1.5}>

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
                            <Box sx={{ height: screenHeight - 370, width: '100%', overflow: 'auto' }}>

                                <table id="purchase">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Supplier Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>GST</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PO Number</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PO Date</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PO Type</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Group</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Code</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Supplier Description</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Schedule Date</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>UOM</th>
                                            {/* SUMMARY */}
                                            {
                                                selectedRadio === 'Detailed' || selectedRadio === "Summary"
                                                    ?
                                                    <>
                                                        <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PO Quantity</th>
                                                        <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PB Cum Qty</th>
                                                        <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Pending Qty</th>
                                                        <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Amount</th>
                                                        <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Rate</th>
                                                    </>
                                                    :
                                                    null
                                            }

                                            {selectedRadio === "Detailed" && radioButtonValue !== "Pending for GRN" && (
                                                <>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Supp Inv No</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Supp Inv Date</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Supp Dc No</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Supp Dc Date</th>
                                                    {/* <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Date Diff</th> */}
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Rcpt Qty</th>
                                                </>
                                            )}

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {poReportData
                                            .map((supp, suppKey) => (
                                                <React.Fragment key={suppKey}>
                                                    {supp.po.map((PO, poKey) => (
                                                        <React.Fragment key={poKey}>
                                                            {PO.items
                                                                .filter(item => radioButtonValue === "All" || item.pendingPo > 0) // Filter condition
                                                                .map((item, itemKey) => (
                                                                    <tr key={itemKey} style={{ width: '150px' }}>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.spName}</td>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.gst}</td>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poNo}</td>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poDate}</td>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poType}</td>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemGroup}</td>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppDesc}</td>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.schDate}</td>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.uom}</td>

                                                                        {
                                                                            selectedRadio === 'Detailed' || selectedRadio === "Summary"
                                                                                ? <>
                                                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.qty}</td>
                                                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.pbCumQty}</td>
                                                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.pendingPo}</td>
                                                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.amt}</td>
                                                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.rate}</td>
                                                                                </>
                                                                                : null
                                                                        }


                                                                        {selectedRadio === "Detailed" && radioButtonValue !== "Pending for GRN" && (
                                                                            <>
                                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppInvNo}</td>
                                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppInvoiceDate}</td>
                                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppDcNo}</td>
                                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppDcDate}</td>
                                                                                {/* <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.dateDiff}</td> */}
                                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.recptQty}</td>
                                                                            </>
                                                                        )}

                                                                    </tr>
                                                                ))}
                                                        </React.Fragment>
                                                    ))}
                                                </React.Fragment>
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
export default PurchaseOrderReport;