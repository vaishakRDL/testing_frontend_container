import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    LinearProgress,
    TextField,
    Typography
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { FPYDetaildReportList, FpyListreport } from "../../ApiService/LoginPageService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const FPYTrendsReport = () => {

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reportData, setReportData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [detailData, setDetailData] = useState([]);
    const [detailLoading, setDetailLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");

    const [notification, setNotification] = useState({
        status: false,
        type: "",
        message: ""
    });
    const fetchFpyDetail = (date, category) => {
        if (!category) return; // safety

        setDetailLoading(true);
        setOpenDialog(true);
        setSelectedDate(date);

        FPYDetaildReportList(
            {
                date: date,
                category: category
            },
            (res) => {
                setDetailData(res?.data || []);
                setDetailLoading(false);
            },
            () => {
                setDetailLoading(false);
                setDetailData([]);
            }
        );
    };



    // 🔹 API CALL
    const handleView = () => {
        if (!fromDate || !toDate) {
            setNotification({
                status: true,
                type: "error",
                message: "Please select From Date and To Date"
            });
            return;
        }

        setLoader(true);

        FpyListreport(
            { from: fromDate, to: toDate },
            (res) => {
                setReportData(res?.data || []);
                setLoader(false);
            },
            () => {
                setLoader(false);
                setNotification({
                    status: true,
                    type: "error",
                    message: "Failed to fetch data"
                });
            }
        );
    };
    const handleDownloadExcel = () => {
        if (!reportData || reportData.length === 0) {
            setNotification({
                status: true,
                type: "error",
                message: "No data available to download"
            });
            return;
        }

        // Format data for Excel
        const excelData = reportData.map((row, index) => ({
            "S.No": index + 1,
            "Date": row.date,
            "No of Items Produced": row.producedCount,
            "No of Items Inspected": row.inspectionCount,
            "First Piece Inspection %": row.fpyPercent,
            "No of Items Defective": row.defectCount,
            "No of Items Reworked": row.reworkCount,
            "No of Items Rejected": row.rejectionCount,
            "Yield (%)": row.yield,
            "Target (%)": row.target
        }));

        // Create worksheet & workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "FPY Trends");

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });

        const file = new Blob([excelBuffer], {
            type: "application/octet-stream"
        });

        saveAs(file, `FPY_Trends_Report_${fromDate}_to_${toDate}.xlsx`);
    };

    const headerStyle = {
        backgroundColor: "#002D68",
        color: "#ffffff",
        padding: "8px",
        textAlign: "center",
        fontWeight: "bold",
        border: "1px solid #ddd"
    };

    const cellStyle = {
        padding: "6px",
        textAlign: "center",
        border: "1px solid #ddd"
    };


    return (
        <div style={{ margin: "10px" }}>
            {/* 🔹 TITLE */}
            <Typography variant="h5" fontWeight="bold" mb={2}>
                FPY Trends Report
            </Typography>

            <Card>
                {loader && <LinearProgress />}

                <CardContent>
                    {/* 🔹 DATE FILTER */}
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="From Date"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="To Date"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={3}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#002D68" }}
                                onClick={handleView}
                                disabled={loader}
                            >
                                {loader ? (
                                    <CircularProgress size={22} sx={{ color: "white" }} />
                                ) : (
                                    "View"
                                )}
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#002D68", ml: 1 }}
                                onClick={handleDownloadExcel}
                                disabled={loader || reportData.length === 0}
                            >
                                Download Excel
                            </Button>
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={3}>
                          
                        </Grid> */}

                    </Grid>

                    {/* 🔹 TABLE */}
                    <Box mt={3} sx={{ height: "60vh", overflow: "auto" }}>
                        <table
                            border="1"
                            style={{
                                borderCollapse: "collapse",
                                width: "100%",
                                zoom: "80%"
                            }}
                            id="customers"
                        >
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Date</th>
                                    <th>No of Items Produced</th>
                                    <th>No of Items Inspected</th>
                                    <th>First Piece Inspection %</th>
                                    <th>No of Items Defective</th>
                                    <th>No of Items Reworked</th>
                                    <th>No of Items Rejected</th>
                                    <th>Yield (%)</th>
                                    <th>TARGET (%)</th>
                                </tr>
                            </thead>

                            <tbody>
                                {reportData && reportData.length > 0 ? (
                                    reportData.map((row, index) => {
                                        // ✅ DEFINE it HERE
                                        const isLastRow = index === reportData.length - 1;

                                        return (
                                            // <tr
                                            //     key={index}
                                            //     style={{
                                            //         fontWeight: isLastRow ? "bold" : "normal",
                                            //         backgroundColor: isLastRow ? "#f1f5f9" : "transparent"
                                            //     }}
                                            // >
                                            //     <td>{row.snNo}</td>
                                            //     <td>{row.date}</td> {/* Produced */}
                                            //     <td onClick={() => fetchFpyDetail(row.date, "production")}> {row.producedCount} </td>
                                            //     <td onClick={() => fetchFpyDetail(row.date, "inspected")} > {row.inspectionCount} </td>
                                            //     <td>{row.fpyPercent}</td>
                                            //     <td onClick={() => fetchFpyDetail(row.date, "defect")} > {row.defectCount} </td>
                                            //     <td onClick={() => fetchFpyDetail(row.date, "rework")} > {row.reworkCount} </td>
                                            //     <td onClick={() => fetchFpyDetail(row.date, "scrap")} > {row.rejectionCount} </td>
                                            //     <td>{row.yield}</td>
                                            //     <td>{row.target}</td>
                                            // </tr>
                                            <tr
                                                key={index}
                                                style={{
                                                    fontWeight: isLastRow ? "bold" : "normal",
                                                    backgroundColor: isLastRow ? "#f1f5f9" : "transparent"
                                                }}
                                            >
                                                <td>{row.snNo}</td>
                                                <td>{row.date}</td>

                                                <td
                                                    onClick={!isLastRow ? () => fetchFpyDetail(row.date, "production") : undefined}
                                                    style={{ cursor: !isLastRow ? "pointer" : "default" }}
                                                >
                                                    {row.producedCount}
                                                </td>

                                                <td
                                                    onClick={!isLastRow ? () => fetchFpyDetail(row.date, "inspected") : undefined}
                                                    style={{ cursor: !isLastRow ? "pointer" : "default" }}
                                                >{row.inspectionCount}</td>
                                                <td>{row.fpyPercent}</td>
                                                <td
                                                    onClick={!isLastRow ? () => fetchFpyDetail(row.date, "defect") : undefined}
                                                    style={{ cursor: !isLastRow ? "pointer" : "default" }}
                                                >{row.defectCount}</td>
                                                <td
                                                    onClick={!isLastRow ? () => fetchFpyDetail(row.date, "rework") : undefined}
                                                    style={{ cursor: !isLastRow ? "pointer" : "default" }}
                                                >{row.reworkCount}</td>
                                                <td
                                                    onClick={!isLastRow ? () => fetchFpyDetail(row.date, "scrap") : undefined}
                                                    style={{ cursor: !isLastRow ? "pointer" : "default" }}
                                                >{row.rejectionCount}</td>
                                                <td>{row.yield}</td>
                                                <td>{row.target}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={10} style={{ textAlign: "center", padding: "20px" }}>
                                            No Data Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>



                        </table>
                    </Box>
                </CardContent>
            </Card>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>
                    FPY Detail Report – {selectedDate}
                </DialogTitle>

                <DialogContent>
                    {detailLoading ? (
                        <Box textAlign="center" py={3}>
                            <CircularProgress />
                        </Box>
                    ) : detailData.length > 0 ? (
                        <table
                            border="1"
                            style={{
                                borderCollapse: "collapse",
                                width: "100%",
                                marginTop: "10px",
                                fontSize: "13px"
                            }}
                        >

                            <thead>
                                <tr>
                                    <th style={headerStyle}>Sl No</th>
                                    <th style={headerStyle}>kanbanDate</th>
                                    <th style={headerStyle}>Item Code</th>
                                    <th style={headerStyle}>JobCard No</th>
                                    <th style={headerStyle}>Produced Qty</th>
                                    <th style={headerStyle}>Machine</th>
                                    <th style={headerStyle}>Process</th>

                                </tr>
                            </thead>
                            <tbody>
                                {detailData.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        style={{
                                            backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#ffffff"
                                        }}
                                    >
                                        <td style={cellStyle}>{item.slNo}</td>
                                        <td style={cellStyle}>{item.kanbanDate}</td>
                                        <td style={cellStyle}>{item.itemCode}</td>
                                        <td style={cellStyle}>{item.jcNo}</td>
                                        <td style={cellStyle}>{item.prodQty}</td>
                                        <td style={cellStyle}>{item.machine}</td>
                                        <td style={cellStyle}>{item.process}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <Typography align="center" mt={2}>
                            No details found
                        </Typography>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <NotificationBar
                openNotification={notification.status}
                notificationContent={notification.message}
                type={notification.type}
                handleClose={() =>
                    setNotification({ status: false, type: "", message: "" })
                }
            />
        </div>
    );
};

export default FPYTrendsReport;
