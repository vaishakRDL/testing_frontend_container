import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PurchaseReportSearchSupplier, PurchaseReportSearchItem, GetPuchaseReport, GetJobWorkIssueReport, ItemSearchNAAJ, GetSuppVsItemAllSuppList } from "../../ApiService/LoginPageService";
import './JobWorkIssueReport.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";

const JobWorkIssueReport = () => {

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [supplierList, setSupplierList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const today = new Date().toISOString().split("T")[0];

    const [toDate, setTodate] = useState(today);
    const [selectedSupplier, setSelectedSupplier] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [jobworkReportData, setJobWorkReportData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('Summary');
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [fyFrom, setFyFrom] = useState("");
    const [fyTo, setFyTo] = useState("");
    const [loading, setLoading] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: "error",
        message: "",
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
        GetSuppVsItemAllSuppList({ code: e.target.value }, handleSearchSupplierSucessShow, handleSearchSupplierExceptionShow);
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
        // PurchaseReportSearchItem({ code: e.target.value }, handleSearchItemSucessShow, handleSearchItemExceptionShow);
        ItemSearchNAAJ({
            text: e.target.value
        }, handleSearchItemSucessShow, handleSearchItemExceptionShow);
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
        setLoading(true);
        GetJobWorkIssueReport(
            {
                fromDate: fromDate,
                toDate: toDate,
                type: selectedRadio,
                status: selectedStatus,
                items: selectedItem,
                suppliers: selectedSupplier

            }, handleGetReportSuccess, handleGetReportException)
    }

    const handleGetReportSuccess = (dataObject) => {
        setLoader(false)
        // console.log(dataObject.data)
        setJobWorkReportData(dataObject?.data || [])
        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }
    const handleGetReportException = () => {
        setLoader(false)
        setTimeout(() => {
            setLoading(false);
        }, 2000)
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
    //     // Flatten data to match the frontend table structure
    //     const formattedData = jobworkReportData.map((data) => ({
    //         "Supplier Name": data?.supplier,
    //         "GST No": data?.gstNo,
    //         "Category": data?.dcType,
    //         "JWISS No": data?.jwiNo,
    //         "JWISS Date": data?.jwiDate,
    //         "Sitem Code": data?.itemCode,
    //         "Sitem Name": data?.itemName,
    //         "UOM": data?.uom,
    //         "JWISS Qty": data?.jwiQty,
    //         "JWR Cum Qty": data?.jwrCumQty,
    //         "Pending Qty": data?.pendingQty,
    //         ...(selectedRadio === 'Detailed' ? {
    //             "Inv No": data?.invoiceNo,
    //             "Inv Date": data?.invoiceDate,
    //             "DC No": data?.dcNo,
    //             "DC Date": data?.dcDate,
    //         } : {}),
    //         "Date Diff": data?.dateDiff,
    //         ...(selectedRadio === 'Detailed' ? {
    //             "Rcpt Qty": data?.rcpQty
    //         } : {}),
    //         "JWISS Rate": data?.rate,
    //         "JWISS Amt": data?.amount,
    //         "CGST Per": data?.cgstPercent,
    //         "CGST Amt": data?.cgst,
    //         "SGST Per": data?.sgstPercent,
    //         "SGST Amt": data?.sgst,
    //         "Remarks": data?.remarks,
    //         "HSN Code": data?.hsn,
    //     }))

    //     const workbook = arrayToWorksheet(formattedData);
    //     downloadExcelFile(workbook, 'Job Work Issue Report.xlsx');
    // };
    const handleDownload = () => {
        // Flatten data to match the frontend table structure
        const formattedData = jobworkReportData.map((data) => ({
            "Supplier Name": data?.supplier,
            "GST No": data?.gstNo,
            "Category": data?.dcType,
            "JWISS No": data?.jwiNo,
            "JWISS Date": data?.jwiDate,
            "Sitem Code": data?.itemCode,
            "Sitem Name": data?.itemName,
            "UOM": data?.uom,

            // numeric
            "JWISS Qty": Number(data?.jwiQty || 0),
            "JWR Cum Qty": Number(data?.jwrCumQty || 0),
            "Pending Qty": Number(data?.pendingQty || 0),

            ...(selectedRadio === 'Detailed'
                ? {
                    "Inv No": data?.invoiceNo,
                    "Inv Date": data?.invoiceDate,
                    "DC No": data?.dcNo,
                    "DC Date": data?.dcDate,
                }
                : {}),

            // numeric
            "Date Diff": Number(data?.dateDiff || 0),

            ...(selectedRadio === 'Detailed'
                ? {
                    "Rcpt Qty": Number(data?.rcpQty || 0),
                }
                : {}),

            // numeric
            "JWISS Rate": Number(data?.rate || 0),
            "JWISS Amt": Number(data?.amount || 0),

            "CGST Per": Number(data?.cgstPercent || 0),
            "CGST Amt": Number(data?.cgst || 0),
            "SGST Per": Number(data?.sgstPercent || 0),
            "SGST Amt": Number(data?.sgst || 0),

            "Remarks": data?.remarks,
            "HSN Code": data?.hsn,
        }));

        const workbook = arrayToWorksheet(formattedData);
        downloadExcelFile(workbook, "Job Work Issue Report.xlsx");
    };

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
            // setTodate(value);
            setNotification({ status: false, type: "", message: "" });
        } else {
            setNotification({
                status: true,
                type: "error",
                message: "Please select a valid To-Date",
            });
        }
    };


    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Job Work Issue Report
                </Typography>
            </div>
            <Card sx={{ minWidth: 275 }}>
                {loading &&
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                }
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
                                fullWidth
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
                                fullWidth
                                onChange={(e) => {
                                    setTodate(e.target.value)
                                }}

                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={selectedRadio}
                                    onChange={(e) => {
                                        setSelectedRadio(e.target.value)
                                        setJobWorkReportData([])
                                    }}
                                >
                                    <FormControlLabel value="Detailed" control={<Radio />} label="Detailed" />
                                    <FormControlLabel value="Summary" control={<Radio />} label="Summary" />
                                </RadioGroup>
                            </FormControl>

                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={selectedStatus}
                                    onChange={(e) => {
                                        setSelectedStatus(e.target.value)
                                        setJobWorkReportData([])
                                    }}
                                >
                                    <FormControlLabel value="All" control={<Radio />} label="All" />
                                    <FormControlLabel value="Pending" control={<Radio />} label="Pending" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={2} md={2} lg={2}>
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
                        <Grid item xs={12} sm={2} md={2} lg={2}>
                            <Autocomplete
                                multiple
                                disablePortal
                                options={supplierList}
                                getOptionLabel={(option) => option.spCode}
                                // sx={{ width: 300 }}
                                size="small"
                                renderInput={(params) => <TextField {...params} label="Select Supplier" onChange={handleSupplierChange} />}
                                onChange={(event, value) => handleSupplierSelect(value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', columnGap: '20px' }}>
                            <Button variant="contained" style={{ backgroundColor: '#002D68' }} onClick={handleReportView}>
                                {loading ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'View'}
                            </Button>

                            <Button
                                style={{ background: jobworkReportData.length === 0 ? 'gray' : '#002D68', color: '#fff', }}
                                variant="contained"
                                disabled={jobworkReportData.length === 0}
                                onClick={handleDownload}
                            >
                                Export to Excel
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Box sx={{ height: screenHeight - 435, width: '100%', overflow: 'auto' }}>
                                <table id="purchase">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Supplier Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>GST No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Category</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>JWISS No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>JWISS Dtae</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Code</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>UOM</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>JWISS Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>JWR Cum Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Pending Qty</th>
                                            {
                                                selectedRadio === "Detailed"
                                                &&
                                                <>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Inv No</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Inv Date</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>DC No</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>DC Date</th>
                                                </>
                                            }

                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Date Diff</th>
                                            {
                                                selectedRadio === "Detailed"
                                                &&
                                                <>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Rcpt Qty</th>
                                                </>
                                            }
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>JWISS Rate</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>JWISS Amt</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>CGST Per</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>CGST Amt</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SGST Per</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SGST Amt</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Remarks</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>HSN Code</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobworkReportData.map((item, itemKey) => (
                                            <tr key={itemKey} style={{ width: '150px' }}>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.supplier}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.gstNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.dcType}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.jwiNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.jwiDate}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.uom}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.jwiQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.jwrCumQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.pendingQty}</td>
                                                {
                                                    selectedRadio === 'Detailed'
                                                        ?
                                                        <>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.invoiceNo}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.invoiceDate}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.dcNo}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.dcDate}</td>
                                                        </>
                                                        :
                                                        null
                                                }
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.dateDiff}</td>
                                                {
                                                    selectedRadio === 'Detailed'
                                                        ?
                                                        <>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.qty}</td>
                                                        </>
                                                        :
                                                        null
                                                }
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.rate}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.amount}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.cgstPercent}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.cgst}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.sgstPercent}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.sgst}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.remarks}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.hsn}</td>
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
export default JobWorkIssueReport;