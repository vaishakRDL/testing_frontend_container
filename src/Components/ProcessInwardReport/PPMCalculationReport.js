import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    Backdrop,
    CircularProgress
} from "@mui/material";
import { PPMCalculationListreport } from "../../ApiService/LoginPageService";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ROW_HEIGHT = 44;

/* ================= COLUMN CONFIG ================= */
const COLUMN_GROUPS = [
    {
        title: "Production Qty",
        columns: [
            { label: "Day", key: "productionQty" },
            { label: "Cumm", key: "cummProduction" }
        ]
    },
    {
        title: "Day Rejection Qty",
        color: "#f4b183",
        columns: [
            { label: "Inprocess Rej", key: "inprocessRej" },
            { label: "Final Rej", key: "finalRej" },
            { label: "R/W", key: "totalRework" },
            { label: "Total", key: "grandTotal" }
        ]
    },
    {
        title: "Cumulative Rejection Qty",
        color: "#bdd7ee",
        columns: [
            { label: "Inprocess Cumm Rej", key: "cummInprocessRej" },
            { label: "Final Cumm Rej", key: "cummFinalRej" },
            { label: "Cumm R/W", key: "cummTotalRework" },
            { label: "Cumm Total", key: "cummGrandTotal" }
        ]
    },
    {
        title: "Cumulative Rejection PPM",
        color: "#ffe699",
        columns: [
            { label: "Inprocess Rej PPM", key: "inprocessPPM" },
            { label: "Final Rej PPM", key: "finalPPM" },
            { label: "R/W PPM", key: "reworkPPM" },
            { label: "Total %", key: "totalPPM", isPercent: true }
        ]
    }
];

const PPMCalculationReport = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleView = () => {
        if (!fromDate || !toDate) {
            alert("Please select From Date and To Date");
            return;
        }

        if (toDate < fromDate) {
            alert("To Date cannot be less than From Date");
            return;
        }

        setLoading(true);

        PPMCalculationListreport(
            { fromDate, toDate },
            (res) => {
                setData(res?.data || []);
                setLoading(false);
            },
            () => {
                setLoading(false);
                alert("Failed to load report");
            }
        );
    };
    const handleDownloadExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("PPM Report");

        /* ================= HEADER ROW 1 ================= */
        let colIndex = 2;

        worksheet.mergeCells(1, 1, 2, 1);
        worksheet.getCell(1, 1).value = "Date";
        worksheet.getCell(1, 1).alignment = { vertical: "middle", horizontal: "center" };

        COLUMN_GROUPS.forEach((group) => {
            const start = colIndex;
            const end = colIndex + group.columns.length - 1;

            worksheet.mergeCells(1, start, 1, end);
            worksheet.getCell(1, start).value = group.title;
            worksheet.getCell(1, start).alignment = { horizontal: "center" };
            worksheet.getCell(1, start).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFD9D9D9" }
            };

            colIndex = end + 1;
        });

        /* ================= HEADER ROW 2 ================= */
        let headerCol = 2;
        COLUMN_GROUPS.forEach((group) => {
            group.columns.forEach((col) => {
                worksheet.getCell(2, headerCol).value = col.label;
                worksheet.getCell(2, headerCol).alignment = { horizontal: "center" };
                headerCol++;
            });
        });

        /* ================= DATA ROWS ================= */
        data.forEach((row, rowIndex) => {
            const excelRow = worksheet.addRow([]);

            excelRow.getCell(1).value = row.date;

            let dataCol = 2;
            COLUMN_GROUPS.forEach((group) => {
                group.columns.forEach((col) => {
                    excelRow.getCell(dataCol).value =
                        col.isPercent ? row[col.key] : row[col.key] ?? 0;
                    dataCol++;
                });
            });

            excelRow.height = ROW_HEIGHT;
        });

        /* ================= COLUMN WIDTH ================= */
        worksheet.columns.forEach((col) => {
            col.width = 18;
        });

        /* ================= DOWNLOAD ================= */
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        saveAs(blob, `PPM_Report_${fromDate}_to_${toDate}.xlsx`);
    };


    return (
        <Box m={2}>
            <Typography fontWeight="bold" mb={2}>
                PPM Calculation Report
            </Typography>

            {/* 🔥 FULL SCREEN LOADER */}
            <Backdrop
                open={loading}
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Card>
                <CardContent>
                    {/* FILTER */}
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4} md={3}>
                            <TextField
                                type="date"
                                fullWidth
                                size="small"
                                label="From Date"
                                InputLabelProps={{ shrink: true }}
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                disabled={loading}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={3}>
                            <TextField
                                type="date"
                                fullWidth
                                size="small"
                                label="To Date"
                                InputLabelProps={{ shrink: true }}
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                disabled={loading}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4} md={3}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#002D68" }}
                                onClick={handleView}
                                disabled={loading || !fromDate || !toDate}
                            >
                                View
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={4} md={3}>
                            <Button
                                variant="outlined"
                                onClick={handleDownloadExcel}
                                disabled={!data.length}
                            >
                                Download Excel
                            </Button>
                        </Grid>

                    </Grid>

                    {/* TABLE */}
                    <Box mt={3} sx={{ overflowX: "auto", opacity: loading ? 0.5 : 1 }}>
                        <table
                            border="1"
                            style={{
                                borderCollapse: "collapse",
                                minWidth: "1600px",
                                width: "100%",
                                fontSize: "13px",
                                textAlign: "center"
                            }}
                        >
                            <thead>
                                <tr style={{ height: ROW_HEIGHT }}>
                                    <th rowSpan={2} style={stickyHeader}>Date</th>
                                    {COLUMN_GROUPS.map((g) => (
                                        <th
                                            key={g.title}
                                            colSpan={g.columns.length}
                                            style={{ background: g.color || "#d9d9d9" }}
                                        >
                                            {g.title}
                                        </th>
                                    ))}
                                </tr>

                                <tr style={{ height: ROW_HEIGHT }}>
                                    {COLUMN_GROUPS.flatMap((g) =>
                                        g.columns.map((c) => (
                                            <th
                                                key={`${g.title}-${c.key}`}
                                                style={{ background: g.color || "#ededed" }}
                                            >
                                                {c.label}
                                            </th>
                                        ))
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {data.map((row) => (
                                    <tr key={row.date} style={{ height: ROW_HEIGHT }}>
                                        <td style={stickyCell}>{row.date}</td>
                                        {COLUMN_GROUPS.flatMap((g) =>
                                            g.columns.map((c) => (
                                                <td
                                                    key={`${row.date}-${c.key}`}
                                                    style={{ background: g.color || "white" }}
                                                >
                                                    {c.isPercent
                                                        ? `${(row[c.key] || 0).toFixed(3)}%`
                                                        : row[c.key] ?? 0}
                                                </td>
                                            ))
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {!data.length && !loading && (
                            <Typography align="center" mt={2}>
                                No Data Found
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

/* ================= STYLES ================= */
const stickyHeader = {
    position: "sticky",
    left: 0,
    background: "#b4c6e7",
    zIndex: 2,
    minWidth: 110
};

const stickyCell = {
    position: "sticky",
    left: 0,
    background: "#e2efda",
    fontWeight: "bold",
    minWidth: 110
};

export default PPMCalculationReport;

