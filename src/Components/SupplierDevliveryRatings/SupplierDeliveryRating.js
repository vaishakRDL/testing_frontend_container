
import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PurchaseReportSearchSupplier, PurchaseReportSearchItem, GetPuchaseReport, GetJobWorkIssueReport, ItemSearchNAAJ, GetSuppVsItemAllSuppList, SupplierDeliveryReportList } from "../../ApiService/LoginPageService";
// import './JobWorkIssueReport.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";

const SupplierDeliveryRating = () => {

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
        SupplierDeliveryReportList(
            {
                fromDate: fromDate,
                toDate: toDate,
                suppliers: selectedSupplier

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
    //         "Supplier": data?.spName,
    //         "PO Qty": data?.poQty,
    //         "Rcvd Qty": data?.rcvdQty,
    //         "Rejected Qty": data?.rejQty,
    //         "Pending Qty": data?.pendingPo,
    //         "Delay in Qty": data?.delayQty,
    //         "Delay in Days": data?.delayDays,
    //         "Avg Lead Time": data?.avgLeadTime,
    //         "PPM": data?.ppm,
    //         "OTD %": data?.otdPercent,
    //         "Performance": data?.performance,
    //         "Accepted Qty": data?.accQty,
    //         "Quality %": data?.performanceQuality
    //     }))

    //     const workbook = arrayToWorksheet(formattedData);
    //     downloadExcelFile(workbook, 'Job Work Issue Report.xlsx');
    // };
    const handleDownload = () => {
        // Flatten data to match the frontend table structure
        const formattedData = jobworkReportData.map((data) => ({
            "Supplier": data?.spName,

            // numeric conversions
            "PO Qty": Number(data?.poQty || 0),
            "Rcvd Qty": Number(data?.rcvdQty || 0),
            "Rejected Qty": Number(data?.rejQty || 0),
            "Pending Qty": Number(data?.pendingPo || 0),
            "Delay in Qty": Number(data?.delayQty || 0),
            "Delay in Days": Number(data?.delayDays || 0),
            "Avg Lead Time": Number(data?.avgLeadTime || 0),
            "PPM": Number(data?.ppm || 0),
            "OTD %": Number(data?.otdPercent || 0),
            "Performance": Number(data?.performance || 0),
            "Accepted Qty": Number(data?.accQty || 0),
            "Quality %": Number(data?.performanceQuality || 0)
        }));

        const workbook = arrayToWorksheet(formattedData);
        downloadExcelFile(workbook, 'Job Work Issue Report.xlsx');
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

    const handleFromDateChange = (e) => {
        const value = e.target.value;
        // if (isValidDateInRange(value)) {
        setFromDate(value);
        //     setNotification({ status: false, type: "", message: "" });
        // } else {
        //     setNotification({
        //         status: true,
        //         type: "error",
        //         message: "Please select a valid From-Date",
        //     });
        // }
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
                    Supplier Delivery Rating           </Typography>
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
                                onChange={handleToDateChange}

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
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Supplier</th>
                                            <th style={{ width: '180px', whiteSpace: 'nowrap' }}>PO Qty</th>
                                            <th style={{ width: '120px', whiteSpace: 'nowrap' }}>Rcvd Qty</th>
                                            <th style={{ width: '180px', whiteSpace: 'nowrap' }}>Rejected Qty</th>
                                            <th style={{ width: '180px', whiteSpace: 'nowrap' }}>Pend Qty</th>
                                            <th style={{ width: '130px', whiteSpace: 'nowrap' }}>Delay in Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Delay In Days</th>
                                            <th style={{ width: '130px', whiteSpace: 'nowrap' }}>Avg Lead time</th>
                                            <th style={{ width: '200px', whiteSpace: 'nowrap' }}>PPM</th>
                                            <th style={{ width: '180px', whiteSpace: 'nowrap' }}>OTD %</th>
                                            <th style={{ width: '120px', whiteSpace: 'nowrap' }}>Performance</th>
                                            <th style={{ width: '120px', whiteSpace: 'nowrap' }}>Accepted Qty</th>
                                            <th style={{ width: '160px', whiteSpace: 'nowrap' }}>Quality %</th>

                                        </tr>
                                    </thead>

                                    <tbody>
                                        {jobworkReportData.map((item, itemKey) => (
                                            <tr key={itemKey} style={{ width: '150px' }}>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.spName}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.poQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.rcvdQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.rejQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.pendingPo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.delayQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.delayDays}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.avgLeadTime}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.ppm}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.otdPercent}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.performance}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.accQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.performanceQuality}</td>

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
export default SupplierDeliveryRating;