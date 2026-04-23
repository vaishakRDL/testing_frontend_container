import React, { useState, useEffect } from 'react';
import { Autocomplete, Checkbox, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Button, Card, CardContent, Box, LinearProgress, CircularProgress } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { GetSearchedItems, GetStockLedgerReport, GetMainLocation, GetItemGroup, GetQuarantineStockReport } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
const QuarantineStockReport = () => {
    const [fromDate, setFromDate] = useState('');
    const today = new Date().toISOString().split("T")[0]; // 👉 gives "2025-08-22"
    const [toDate, setToDate] = useState(today);
    const [itemList, setItemList] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState([]);
    const [quarantineReportData, setQuarantineReportData] = useState([]);
    const [fyFrom, setFyFrom] = useState("");
    const [fyTo, setFyTo] = useState("");
    const [loading, setLoading] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: "error",
        message: "",
    });

    useEffect(() => {
        GetSearchedItems({ code: '' }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
    }, [])

    // MULTI SELECTION AUTOCOMPLETE
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    // AUTOCOMPLETE ITEM SEARCH
    const handleChange = (e) => {
        GetSearchedItems({ code: e.target.value }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: "",
            message: "",
        });
    };

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
        setLoading(true)
        GetQuarantineStockReport({
            from: fromDate,
            to: toDate,
            items: selectedItemId,
        }, handleViewSuccess, handleViewException)
    }

    const handleViewSuccess = (dataObject) => {
        setQuarantineReportData(dataObject?.data || []);
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }
    const handleViewException = () => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
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


    const handleToDateChange = (e) => {
        const value = e.target.value;
        if (isValidDateInRange(value)) {
            setToDate(value);
            setNotification({ status: false, type: "", message: "" });
        } else {
            setNotification({
                status: true,
                type: "error",
                message: "Please select a valid To-Date",
            });
        }
    };

    const downloadExcelFile = async (workbook, filename) => {
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), filename);
    };


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


    // const handleDownload = () => {
    //     // Flatten data to match the frontend table structure
    //     const reportData = quarantineReportData.map((item, index) => ({
    //         "SI No": index + 1,
    //         "Date": item?.date,
    //         "Time": item?.time,
    //         "Doc Number": item?.docNo,
    //         "Doc Type": item?.docType,
    //         "Supplier Code": item?.spCode,
    //         "Invoice Number": item?.suppInvNo,
    //         "Item Code": item?.itemCode,
    //         // "PB No": item?.pbNo,   // uncomment if you want
    //         // "Category": item?.category, // uncomment if you want
    //         "Inward Quantity": item?.inQty,
    //         "Outward Quantity": item?.outQty,
    //         "Purchase User": item?.purchaseUser,
    //         "Quality User": item?.qualityUser,
    //         "Total Qty": item?.totQty,
    //     }));

    //     const workbook = arrayToWorksheet(reportData);
    //     downloadExcelFile(workbook, 'Quarantine Stock Report.xlsx');
    // };
    const handleDownload = () => {
        // Flatten data to match the frontend table structure
        const reportData = quarantineReportData.map((item, index) => ({
            "SI No": Number(index + 1),

            "Date": item?.date,
            "Time": item?.time,
            "Doc Number": item?.docNo,
            "Doc Type": item?.docType,
            "Supplier Code": item?.spCode,
            "Invoice Number": item?.suppInvNo,
            "Item Code": item?.itemCode,
            // "PB No": item?.pbNo,   // uncomment if you want
            // "Category": item?.category, // uncomment if you want

            // numeric fields
            "Inward Quantity": Number(item?.inQty || 0),
            "Outward Quantity": Number(item?.outQty || 0),
            "Purchase User": item?.purchaseUser,
            "Quality User": item?.qualityUser,
            "Total Qty": Number(item?.totQty || 0),
        }));

        const workbook = arrayToWorksheet(reportData);
        downloadExcelFile(workbook, 'Quarantine Stock Report.xlsx');
    };


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                <Typography sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }} variant="h5">
                    Quarantine Stock Report
                </Typography>
            </div>
            <form>
                <Grid container spacing={2} padding={1}>
                    <Grid item xs={12} sm={12} md={2}>
                        <TextField
                            fullWidth
                            id="from-date"
                            label="From Date"
                            variant="outlined"
                            type="date"
                            value={fromDate}
                            onChange={handleFromDateChange}
                        // inputProps={{
                        //     min: fyFrom,
                        //     max: fyTo,
                        // }}
                        // InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
                        <TextField
                            fullWidth
                            id="to-date"
                            label="To Date"
                            variant="outlined"
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        // inputProps={{
                        //     min: fyFrom,
                        //     max: fyTo,
                        // }}
                        // InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={2}>
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
                    <Grid item xs={12} sm={12} md={2} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', columnGap: '10px' }}>
                        <Button variant="contained" style={{ backgroundColor: '#002d68', width: '150px' }} onClick={handleViewClick}>
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : 'View Report'}
                        </Button>
                        <Button variant="contained" style={{ backgroundColor: '#002d68', width: '150px' }} onClick={handleDownload}>
                            {/* {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} /> */}
                            Export Excel
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
                                    height: "550px",
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
                                    <thead>
                                        <tr>
                                            <th>SI No</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Doc Number</th>
                                            <th>Doc Type</th>
                                            <th>Supplier Code</th>
                                            <th>Invoice Number</th>

                                            <th>item Code</th>
                                            {/* <th>PB No</th> */}
                                            {/* <th>Category</th> */}
                                            <th>Inward Quantity</th>
                                            <th>Outward Quantity</th>
                                            <th>Purchase User</th>
                                            <th>Quality User</th>
                                            <th>Total Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quarantineReportData.map((item, itemIndex) => (
                                            <tr key={itemIndex}>
                                                <td style={{ whiteSpace: 'nowrap' }}>{itemIndex + 1}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{item.date}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{item.time}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{item.docNo}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{item.docType}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{item.spCode}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{item.suppInvNo}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                {/* <td style={{ whiteSpace: 'nowrap' }}>{item.pbNo}</td> */}
                                                {/* <td style={{ whiteSpace: 'nowrap' }}>{item.categoty}</td> */}
                                                <td style={{ whiteSpace: 'nowrap' }}>{item.inQty}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{item.outQty}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{item.purchaseUser}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{item.qualityUser}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{item.totQty}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </form>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div>
    );
};

export default QuarantineStockReport;
