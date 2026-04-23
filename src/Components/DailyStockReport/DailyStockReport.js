

import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, LinearProgress, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PurchaseReportSearchSupplier, PurchaseReportSearchItem, GetPuchaseReport, GetJobWorkIssueReport, ItemSearchNAAJ, GetSuppVsItemAllSuppList, ITC04JobworkIssueReportList, DailyStockReportList, UnderLedgerShowData } from "../../ApiService/LoginPageService";
// import './JobWorkIssueReport.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";

const DailyStockReport = () => {

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [supplierList, setSupplierList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setTodate] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [jobworkReportData, setJobWorkReportData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('Summary');
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [fyFrom, setFyFrom] = useState("");
    const [fyTo, setFyTo] = useState("");
    const [itemGroupLists, setItemGroupLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItemGroup, setSelectedItemGroup] = useState([]);
    const [itemScrapDesc, SetItemScrapDesc] = useState([]);
    const [dailystockReportData, setDailystockReportData] = useState([]);
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
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
        UnderLedgerShowData(handleItemGroupSuccess, handleItemGroupException);
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

    const handleReportView = () => {
        setLoader(true)
        setLoading(true);
        DailyStockReportList(
            {
                from: fromDate,
                to: toDate,
                itemLedger: selectedItemGroup

            }, handleGetReportSuccess, handleGetReportException)
    }

    const handleGetReportSuccess = (dataObject) => {
        setLoader(false)
        SetItemScrapDesc(dataObject?.hsnDetails?.hsnDesc)
        setDailystockReportData(dataObject?.data || [])
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
    // const handleDownload = async ({
    //     companyName,
    //     periodString,
    //     ironScrapDescription,
    //     logoUrl,
    //     dailystockReportData
    // }) => {
    //     if (!dailystockReportData || dailystockReportData.length === 0) return;

    //     const workbook = new ExcelJS.Workbook();
    //     const worksheet = workbook.addWorksheet("Daily Stock Report");

    //     // Dynamic Header Rows
    //     worksheet.mergeCells("A1:N1");
    //     worksheet.getCell("A1").value = companyName || "Company Name";
    //     worksheet.getCell("A1").font = { bold: true, size: 16 };
    //     worksheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };

    //     worksheet.mergeCells("A2:N2");
    //     worksheet.getCell("A2").value = `Daily Stock Account For the Period ${periodString || ''}`;
    //     worksheet.getCell("A2").font = { bold: true, size: 12 };
    //     worksheet.getCell("A2").alignment = { horizontal: "center", vertical: "middle" };

    //     worksheet.mergeCells("A3:N3");
    //     worksheet.getCell("A3").value = ironScrapDescription || "Iron Scrap Description";
    //     worksheet.getCell("A3").font = { bold: true };
    //     worksheet.getCell("A3").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" } };
    //     worksheet.getCell("A3").alignment = { horizontal: "left", vertical: "middle" };

    //     // Set columns - keys must match the keys in your data objects
    //     worksheet.columns = [
    //         { header: "SI No", key: "sNo", width: 10 },
    //         { header: "Date", key: "date", width: 15 },
    //         { header: "Opening Balance", key: "openQty", width: 16 },
    //         { header: "FG Manufactured", key: "fgManufactured", width: 16 },
    //         { header: "FG Supplied", key: "outwardQty", width: 16 },
    //         { header: "Closing Balance", key: "clsQty", width: 15 },
    //         { header: "Invoice No", key: "invNo", width: 14 },
    //         { header: "Taxable Value", key: "taxableValueforGST", width: 15 },
    //         { header: "Rate of CGST", key: "CGSTPer", width: 13 },
    //         { header: "CGST Value", key: "CGST", width: 13 },
    //         { header: "Rate of SGST", key: "SGSTPer", width: 13 },
    //         { header: "SGST Value", key: "SGST", width: 13 },
    //         { header: "Rate of IGST", key: "IGSTPer", width: 13 },
    //         { header: "IGST Value", key: "IGST", width: 13 },
    //     ];

    //     // Add header row explicitly at row 4 (below dynamic headers)
    //     worksheet.getRow(4).values = worksheet.columns.map(col => col.header);

    //     // Style Header Row (Row 4)
    //     const headerRow = worksheet.getRow(4);
    //     headerRow.font = { bold: true };
    //     headerRow.alignment = { horizontal: "center", vertical: "middle" };
    //     headerRow.height = 20;
    //     headerRow.eachCell((cell) => {
    //         cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" } };
    //         cell.border = {
    //             top: { style: "thin" },
    //             left: { style: "thin" },
    //             bottom: { style: "thin" },
    //             right: { style: "thin" },
    //         };
    //     });

    //     // Add data rows starting from row 5
    //     dailystockReportData.forEach((item) => {
    //         worksheet.addRow({
    //             sNo: item.sNo,
    //             date: item.date,
    //             openQty: item.openQty,
    //             fgManufactured: item.fgManufactured,
    //             outwardQty: item.outwardQty,
    //             clsQty: item.clsQty,
    //             invNo: item.invNo,
    //             taxableValueforGST: item.taxableValueforGST,
    //             CGSTPer: item.CGSTPer,
    //             CGST: item.CGST,
    //             SGSTPer: item.SGSTPer,
    //             SGST: item.SGST,
    //             IGSTPer: item.IGSTPer,
    //             IGST: item.IGST,
    //         });
    //     });

    //     // Generate and download Excel file
    //     try {
    //         const buffer = await workbook.xlsx.writeBuffer();
    //         const blob = new Blob([buffer], {
    //             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //         });
    //         saveAs(blob, `Daily_Stock_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
    //     } catch (error) {
    //         console.error("Error generating Excel file: ", error);
    //     }
    // };
    const handleDownload = async ({
        companyName,
        periodString,
        ironScrapDescription,
        dailystockReportData
    }) => {
        if (!dailystockReportData || dailystockReportData.length === 0) return;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Daily Stock Report");

        // ===================== 📏 Column Definitions with Widths =====================
        const columns = [
            { header: "SI No", key: "sNo", width: 10 },
            { header: "Date", key: "date", width: 15 },
            { header: "Opening Balance", key: "openQty", width: 16 },
            { header: "FG Manufactured", key: "fgManufactured", width: 16 },
            { header: "FG Supplied", key: "outwardQty", width: 16 },
            { header: "Closing Balance", key: "clsQty", width: 15 },
            { header: "Invoice No", key: "invNo", width: 14 },
            { header: "Taxable Value", key: "taxableValueforGST", width: 15 },
            { header: "Rate of CGST", key: "CGSTPer", width: 13 },
            { header: "CGST Value", key: "CGST", width: 13 },
            { header: "Rate of SGST", key: "SGSTPer", width: 13 },
            { header: "SGST Value", key: "SGST", width: 13 },
            { header: "Rate of IGST", key: "IGSTPer", width: 13 },
            { header: "IGST Value", key: "IGST", width: 13 },
        ];
        worksheet.columns = columns;

        // ===================== 🏢 Company Header =====================
        const lastColLetter = worksheet.getColumn(columns.length).letter;

        worksheet.mergeCells(`A1:${lastColLetter}1`);
        const companyCell = worksheet.getCell("A1");
        companyCell.value = companyName || "Company Name";
        companyCell.font = { bold: true, size: 16 };
        companyCell.alignment = { horizontal: "center", vertical: "middle" };
        worksheet.getRow(1).height = 25;

        worksheet.mergeCells(`A2:${lastColLetter}2`);
        const periodCell = worksheet.getCell("A2");
        periodCell.value = `Daily Stock Account For the Period ${periodString || ""}`;
        periodCell.font = { bold: true, size: 12 };
        periodCell.alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells(`A3:${lastColLetter}3`);
        const scrapCell = worksheet.getCell("A3");
        scrapCell.value = ironScrapDescription || "Iron Scrap Description";
        scrapCell.font = { bold: true };
        scrapCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" } };
        scrapCell.alignment = { horizontal: "left", vertical: "middle" };

        // ===================== 🟨 Header Row =====================
        const headerRow = worksheet.getRow(4);
        headerRow.values = [...columns.map(c => c.header)];
        headerRow.font = { bold: true };
        headerRow.alignment = { horizontal: "center", vertical: "middle" };
        headerRow.height = 20;
        headerRow.eachCell((cell) => {
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF00" } };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };
        });

        // ===================== 📊 Data Rows =====================
        dailystockReportData.forEach((item) => {
            worksheet.addRow({
                sNo: item.sNo,
                date: item.date,
                openQty: item.openQty,
                fgManufactured: item.fgManufactured,
                outwardQty: item.outwardQty,
                clsQty: item.clsQty,
                invNo: item.invNo,
                taxableValueforGST: item.taxableValueforGST,
                CGSTPer: item.CGSTPer,
                CGST: item.CGST,
                SGSTPer: item.SGSTPer,
                SGST: item.SGST,
                IGSTPer: item.IGSTPer,
                IGST: item.IGST,
            });
        });

        // ===================== ✨ Bold Last Row (Total Row) =====================
        const lastRowNumber = worksheet.lastRow.number;
        const lastRow = worksheet.getRow(lastRowNumber);
        lastRow.font = { bold: true };

        // ===================== 💾 Download Excel =====================
        try {
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, `Daily_Stock_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
        } catch (error) {
            console.error("Error generating Excel file: ", error);
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

    useEffect(() => {
        // Initialize with the current financial year based on today's date
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
    }, []);

    const handleFromDateChange = (e) => {
        const selectedFromDate = e.target.value;
        setFromDate(selectedFromDate);


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



    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Daily Stock Report              </Typography>
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

                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label"> Selected Item Group</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    size="small"
                                    value={selectedItemGroup}
                                    label=" Selected Item Group"
                                    onChange={(e) => setSelectedItemGroup(e.target.value)}
                                >
                                    {itemGroupLists.map((item) => (
                                        <MenuItem key={item.id} value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </Grid>

                        <Grid item xs={4} sm={4} md={4} lg={4} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', columnGap: '20px' }}>
                            <Button variant="contained" style={{ backgroundColor: '#002D68' }} onClick={handleReportView}>
                                {loading ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'View'}
                            </Button>

                            <Button
                                style={{ background: dailystockReportData.length === 0 ? 'gray' : '#002D68', color: '#fff', }}
                                variant="contained"
                                disabled={dailystockReportData.length === 0}
                                // onClick={handleDownload}
                                onClick={() => handleDownload({
                                    companyName: "Mallik Engineering (INDIA) PVT LTD",
                                    periodString: `${fromDate} to ${toDate}`,
                                    ironScrapDescription: itemScrapDesc,
                                    logoUrl: "https://example.com/logo.png",
                                    dailystockReportData: dailystockReportData
                                })}
                            >
                                Export to Excel
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Box sx={{ height: screenHeight - 335, width: '100%', overflow: 'auto' }}>
                                <table id="purchase">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SI No</th>
                                            <th style={{ width: '180px', whiteSpace: 'nowrap' }}>Date</th>
                                            <th style={{ width: '120px', whiteSpace: 'nowrap' }}>Opening Balance</th>
                                            <th style={{ width: '180px', whiteSpace: 'nowrap' }}>FG Manufactured</th>
                                            <th style={{ width: '180px', whiteSpace: 'nowrap' }}>FG Supplied</th>

                                            <th style={{ width: '100px', whiteSpace: 'nowrap' }}>Closing Balance</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Invoice No</th>
                                            <th style={{ width: '100px', whiteSpace: 'nowrap' }}>Taxable Value</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Rate of CGST</th>
                                            <th style={{ width: '100px', whiteSpace: 'nowrap' }}>CGST Value</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Rate of SGST</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SGST Value</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Rate of IGST</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>IGST Value</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {dailystockReportData.map((item, itemKey) => (
                                            <tr key={itemKey} style={{ width: '150px' }}>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.sNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.date}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.openQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.fgManufactured}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.outwardQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.clsQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.invNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.taxableValueforGST}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.CGSTPer}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.CGST}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.SGSTPer}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.SGST}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.IGSTPer}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.IGST}</td>

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
export default DailyStockReport;