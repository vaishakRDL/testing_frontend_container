
import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PurchaseReportSearchSupplier, PurchaseReportSearchItem, GetPuchaseReport, GetJobWorkIssueReport, ItemSearchNAAJ, GetSuppVsItemAllSuppList, ITC04ReceiptReportList } from "../../ApiService/LoginPageService";
// import './JobWorkIssueReport.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";

const ITC04JobworkReceiptReport = () => {

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
        ITC04ReceiptReportList(
            {
                fromDate: fromDate,
                toDate: toDate,
                supplierIds: selectedSupplier

            }, handleGetReportSuccess, handleGetReportException)
    }

    const handleGetReportSuccess = (dataObject) => {
        setLoader(false)
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
    //         "GST of Job Worker(JW)": data?.gstNo,
    //         "State Code": data?.stateCode,
    //         "Original Challan Number issued by Principal": data?.originalChallanNoByPrincipal,
    //         "Original Challan Date issued by Principal": data?.originalChallanDateByPrincipal,
    //         "Challan Number issued by Job Worker": data?.challanNoByWorker,
    //         "Challan Date issued by Worker": data?.challanDateByWorker,
    //         "Nature of Job Work Done": data?.jobWorkNature,
    //         "HSN Code": data?.hsn,
    //         "Description of Goods": data?.description,
    //         "Item Code": data?.itemCode,
    //         "Item Name": data?.itemName,
    //         "Unique Quantity Code": data?.uom,
    //         "JWR Qty": data?.jwrQty,
    //         "Rate": data?.rate,
    //         "Taxable Value": data?.amount,
    //         "IGSTPER": data?.igstPercent,
    //         "IGST Amount": data?.igstAmount,
    //         "SGSTPER": data?.sgstPercent,
    //         "SGST Amount": data?.sgst,
    //         "CGSTPER": data?.cgstPercent,
    //         "CGST Amount": data?.cgst,
    //     }));


    //     const workbook = arrayToWorksheet(formattedData);
    //     downloadExcelFile(workbook, 'Job Work Issue Report.xlsx');
    // };

    // const handleDownload = () => {
    //     // Flatten data to match the frontend table structure
    //     const formattedData = jobworkReportData.map((data) => ({
    //         "Supplier Name": data?.spName,
    //         "GST of Job Worker(JW)": data?.gstNo,
    //         "State Code": data?.stateCode,
    //         "Original Challan Number issued by Principal": data?.dcNo,
    //         "Original Challan Date issued by Principal": data?.dcDate,
    //         "Challan Number issued by Job Worker": data?.jwChallanNumber,
    //         "Challan Date issued by Worker": data?.jwChallanDate,
    //         "Nature of Job Work Done": data?.modeOfTransport,
    //         "HSN Code": data?.hsnName,
    //         "Description of Goods": data?.hsnDescription,
    //         "Item Code": data?.itemCode,
    //         "Item Name": data?.itemName,
    //         "Unique Quantity Code": data?.uom,
    //         "JWR Qty": data?.jwrQty,
    //         "Rate": data?.stdRate,
    //         "Taxable Value": data?.taxableValue,
    //         "IGSTPER": data?.igstPercent,
    //         "IGST Amount": data?.igst,
    //         "SGSTPER": data?.sgstPercent,
    //         "SGST Amount": data?.sgst,
    //         "CGSTPER": data?.cgstPercent,
    //         "CGST Amount": data?.cgst,
    //     }));

    //     const workbook = arrayToWorksheet(formattedData);
    //     downloadExcelFile(workbook, 'Job Work Issue Report.xlsx');
    // };
    const handleDownload = () => {
        // Flatten data to match the frontend table structure
        const formattedData = jobworkReportData.map((data) => ({
            "Supplier Name": data?.spName,
            "GST of Job Worker(JW)": data?.gstNo,
            "State Code": data?.stateCode,

            "Original Challan Number issued by Principal": data?.dcNo,
            "Original Challan Date issued by Principal": data?.dcDate,

            "Challan Number issued by Job Worker": data?.jwChallanNumber,
            "Challan Date issued by Worker": data?.jwChallanDate,

            "Nature of Job Work Done": data?.modeOfTransport,
            "HSN Code": data?.hsnName,
            "Description of Goods": data?.hsnDescription,

            "Item Code": data?.itemCode,
            "Item Name": data?.itemName,
            "Unique Quantity Code": data?.uom,

            // numeric conversions
            "JWR Qty": Number(data?.jwrQty || 0),
            "Rate": Number(data?.stdRate || 0),
            "Taxable Value": Number(data?.taxableValue || 0),

            "IGSTPER": Number(data?.igstPercent || 0),
            "IGST Amount": Number(data?.igst || 0),

            "SGSTPER": Number(data?.sgstPercent || 0),
            "SGST Amount": Number(data?.sgst || 0),

            "CGSTPER": Number(data?.cgstPercent || 0),
            "CGST Amount": Number(data?.cgst || 0),
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
        // if (isValidDateInRange(value)) {
        setTodate(value);
        //     setNotification({ status: false, type: "", message: "" });
        // } else {
        //     setNotification({
        //         status: true,
        //         type: "error",
        //         message: "Please select a valid To-Date",
        //     });
        // }
    };


    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    ITC04 Jobwork Receipt Report  </Typography>
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
                                value={toDate}
                                fullWidth
                                onChange={(e) => {
                                    setTodate(e.target.value)
                                }}
                            // inputProps={{
                            //     min: fyFrom,
                            //     max: fyTo,
                            // }}
                            />
                        </Grid>


                        {/* <Grid item xs={12} sm={2} md={2} lg={2}>
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
                        </Grid> */}
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

                        <Grid item xs={4} sm={4} md={4} lg={4} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', columnGap: '20px' }}>
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
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>GST of Job Worker(JW)</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>State Code</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Original Challan Number issued by Principal</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Original Challan Date issued by Principal</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Challan Number issued by Job Worker</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Challan Date issued by Worker</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Nature of Job Work Done</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>HSN Code</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Description of Goods</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Code</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Unique Quantity Code</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>JWR Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Rate</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Taxable Value</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>IGSTPER</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>IGST Amount</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SGSTPER</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SGST Amount</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>CGSTPER</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>CGST Amount</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {jobworkReportData.map((item, itemKey) => (
                                            <tr key={itemKey} style={{ width: '150px' }}>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.spName}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.gstNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.stateCode}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.dcNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.dcDate}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.jwChallanNumber}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.jwChallanDate}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.modeOfTransport}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.hsnName}</td>

                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.hsnDescription}</td>

                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.uom}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.jwrQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.stdRate}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.taxableValue}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.igstPercent}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.igst}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.sgstPercent}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.sgst}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.cgstPercent}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.cgst}</td>
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
export default ITC04JobworkReceiptReport;