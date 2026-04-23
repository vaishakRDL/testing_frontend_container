// import React, { useState, useMemo } from "react";
// import {
//     Box,
//     Button,
//     Card,
//     CardContent,
//     CircularProgress,
//     Grid,
//     LinearProgress,
//     TextField,
//     Typography
// } from "@mui/material";
// import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
// import { COPQListreport } from "../../ApiService/LoginPageService";

// const COPQReport = () => {
//     const [fromDate, setFromDate] = useState("");
//     const [toDate, setToDate] = useState("");
//     const [reportData, setReportData] = useState([]);
//     const [loader, setLoader] = useState(false);

//     const [notification, setNotification] = useState({
//         status: false,
//         type: "",
//         message: ""
//     });

//     // 🔹 API CALL
//     const handleView = () => {
//         if (!fromDate || !toDate) {
//             setNotification({
//                 status: true,
//                 type: "error",
//                 message: "Please select From Date and To Date"
//             });
//             return;
//         }

//         setLoader(true);

//         COPQListreport(
//             { from: fromDate, to: toDate },
//             (res) => {
//                 setReportData(res?.data ?? []);
//                 setLoader(false);
//             },
//             () => {
//                 setLoader(false);
//                 setNotification({
//                     status: true,
//                     type: "error",
//                     message: "Failed to fetch COPQ data"
//                 });
//             }
//         );
//     };

//     // 🔹 DYNAMIC ROW FIELDS (🔥 KEY PART)
//     const rowFields = useMemo(() => {
//         if (!reportData.length) return [];

//         return Object.keys(reportData[0]).filter(
//             (key) => key !== "day"
//         );
//     }, [reportData]);

//     // 🔹 MEMOIZED DERIVED DATA
//     const { days, totalCost, cumulativeCost } = useMemo(() => {
//         if (!reportData.length) {
//             return { days: [], totalCost: [], cumulativeCost: [] };
//         }

//         const daysArr = [];
//         const totalArr = [];
//         const cummArr = [];
//         let runningTotal = 0;

//         // for (let i = 0; i < reportData.length; i++) {
//         //     const d = reportData[i];
//         //     daysArr.push(d.day);

//         //     let dayTotal = 0;
//         //     rowFields.forEach((f) => {
//         //         dayTotal += d[f] || 0;
//         //     });

//         //     totalArr.push(dayTotal);
//         //     runningTotal += dayTotal;
//         //     cummArr.push(runningTotal);
//         // }
//         for (let i = 0; i < reportData.length; i++) {
//             const d = reportData[i];
//             daysArr.push(d.day);

//             let dayTotal = 0;
//             rowFields.forEach((f) => {
//                 dayTotal += d[f] || 0;
//             });

//             totalArr.push(Number(dayTotal.toFixed(2)));

//             runningTotal += dayTotal;
//             cummArr.push(Number(runningTotal.toFixed(2)));
//         }
//         return {
//             days: daysArr,
//             totalCost: totalArr,
//             cumulativeCost: cummArr
//         };
//     }, [reportData, rowFields]);

//     return (
//         <Box m={2}>
//             <Typography variant="h6" fontWeight="bold" mb={2}>
//                 COPQ Monthly Report
//             </Typography>

//             <Card>
//                 {loader && <LinearProgress />}

//                 <CardContent>
//                     {/* 🔹 FILTER */}
//                     <Grid container spacing={2} alignItems="center">
//                         <Grid item xs={12} sm={6} md={3}>
//                             <TextField
//                                 fullWidth
//                                 type="date"
//                                 label="From Date"
//                                 size="small"
//                                 InputLabelProps={{ shrink: true }}
//                                 value={fromDate}
//                                 onChange={(e) => setFromDate(e.target.value)}
//                             />
//                         </Grid>

//                         <Grid item xs={12} sm={6} md={3}>
//                             <TextField
//                                 fullWidth
//                                 type="date"
//                                 label="To Date"
//                                 size="small"
//                                 InputLabelProps={{ shrink: true }}
//                                 value={toDate}
//                                 onChange={(e) => setToDate(e.target.value)}
//                             />
//                         </Grid>

//                         <Grid item xs={12} md={3}>
//                             <Button
//                                 variant="contained"
//                                 sx={{ backgroundColor: "#002D68" }}
//                                 onClick={handleView}
//                                 disabled={loader}
//                             >
//                                 {loader ? (
//                                     <CircularProgress size={22} sx={{ color: "#fff" }} />
//                                 ) : (
//                                     "View"
//                                 )}
//                             </Button>
//                         </Grid>
//                     </Grid>

//                     {/* 🔹 TABLE */}
//                     <Box mt={3} sx={{ overflowX: "auto", maxHeight: "65vh" }}>
//                         <table
//                             border="1"
//                             style={{
//                                 borderCollapse: "collapse",
//                                 minWidth: "1400px",
//                                 width: "100%",
//                                 tableLayout: "fixed",
//                                 textAlign: "center",
//                                 fontSize: "12px"
//                             }}
//                         >
//                             <thead>
//                                 <tr style={headerStyle}>
//                                     <th style={stickyHeader}>Description</th>
//                                     {days.map((day) => (
//                                         <th key={day} style={dayCell}>{day}</th>
//                                     ))}
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 {/* 🔥 DYNAMIC ROWS */}
//                                 {rowFields.map((field) => (
//                                     <Row
//                                         key={field}
//                                         label={formatLabel(field)}
//                                         data={reportData}
//                                         field={field}
//                                     />
//                                 ))}

//                                 {/* TOTAL */}
//                                 <tr style={totalRowStyle}>
//                                     <td style={stickyCell}>Total Cost</td>
//                                     {totalCost.map((v, i) => (
//                                         <td key={i} style={dataCell}>{v.toFixed(2)}</td>
//                                     ))}
//                                 </tr>

//                                 {/* CUMULATIVE */}
//                                 <tr style={cummRowStyle}>
//                                     <td style={stickyCell}>Cumm. COPQ Cost</td>
//                                     {cumulativeCost.map((v, i) => (
//                                         <td key={i} style={dataCell}>{v.toFixed(2)}</td>
//                                     ))}
//                                 </tr>
//                             </tbody>
//                         </table>

//                         {!reportData.length && (
//                             <Typography align="center" mt={2}>
//                                 No Data Found
//                             </Typography>
//                         )}
//                     </Box>
//                 </CardContent>
//             </Card>

//             <NotificationBar
//                 openNotification={notification.status}
//                 notificationContent={notification.message}
//                 type={notification.type}
//                 handleClose={() =>
//                     setNotification({ status: false, type: "", message: "" })
//                 }
//             />
//         </Box>
//     );
// };

// // 🔹 ROW COMPONENT
// const Row = React.memo(({ label, data, field }) => (
//     <tr style={{ height: 36 }}>
//         <td style={stickyCell} title={label}>
//             {label}
//         </td>
//         {data.map((d, i) => (
//             <td key={i} style={dataCell}>
//                 {d[field] || 0}
//             </td>
//         ))}
//     </tr>
// ));

// // 🔹 LABEL FORMATTER
// const formatLabel = (key) =>
//     key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

// // 🔹 STYLES
// const stickyCell = {
//     position: "sticky",
//     left: 0,
//     width: 220,
//     minWidth: 220,
//     maxWidth: 220,
//     background: "#e9f5e1",
//     fontWeight: "bold",
//     zIndex: 2,
//     textAlign: "left",
//     paddingLeft: 8,
//     whiteSpace: "nowrap",
//     overflow: "hidden",
//     textOverflow: "ellipsis"
// };

// const stickyHeader = {
//     ...stickyCell,
//     background: "#93bce6",
//     textAlign: "center"
// };

// const dayCell = {
//     width: 80,
//     minWidth: 80,
//     maxWidth: 80
// };

// const dataCell = {
//     width: 80,
//     minWidth: 80,
//     maxWidth: 80,
//     height: 36
// };

// const headerStyle = {
//     background: "#93bce6",
//     color: "#0c0505ff",
//     height: 40
// };

// const totalRowStyle = {
//     background: "#e0e0e0",
//     fontWeight: "bold",
//     height: 36
// };

// const cummRowStyle = {
//     background: "#c9daf8",
//     fontWeight: "bold",
//     color: "red",
//     height: 36
// };

// export default COPQReport;

import React, { useState, useMemo, useCallback } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    LinearProgress,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { COPQDetailsView, COPQListreport } from "../../ApiService/LoginPageService";
import * as XLSX from 'xlsx';
const COPQReport = () => {

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reportData, setReportData] = useState([]);
    const [loader, setLoader] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
    const [detailData, setDetailData] = useState([]);
    const [detailLoader, setDetailLoader] = useState(false);
    const [detailInfo, setDetailInfo] = useState({ day: "", description: "" });

    const [notification, setNotification] = useState({
        status: false,
        type: "",
        message: ""
    });

    /* ---------------- FETCH MAIN REPORT ---------------- */

    const handleView = useCallback(() => {

        if (!fromDate || !toDate) {
            setNotification({
                status: true,
                type: "error",
                message: "Please select From Date and To Date"
            });
            return;
        }

        setLoader(true);

        COPQListreport(
            { from: fromDate, to: toDate },
            (res) => {
                setReportData(res?.data ?? []);
                setLoader(false);
            },
            () => {
                setLoader(false);
                setNotification({
                    status: true,
                    type: "error",
                    message: "Failed to fetch COPQ data"
                });
            }
        );

    }, [fromDate, toDate]);

    /* ---------------- ROW FIELD GENERATION ---------------- */

    const rowFields = useMemo(() => {

        if (!reportData.length) return [];

        return Object.keys(reportData[0]).filter(
            (key) => key !== "day" && key !== "date"
        );

    }, [reportData]);
    /* ---------------- TOTAL + CUMULATIVE CALC ---------------- */

    const { days, totalCost, cumulativeCost } = useMemo(() => {

        if (!reportData.length) {
            return { days: [], totalCost: [], cumulativeCost: [] };
        }

        const daysArr = [];
        const totalArr = [];
        const cummArr = [];

        let runningTotal = 0;

        reportData.forEach((row) => {

            daysArr.push(row.day);

            let dayTotal = 0;

            rowFields.forEach((f) => {
                dayTotal += parseFloat(row[f]) || 0;
            });

            dayTotal = Number(dayTotal.toFixed(2));

            totalArr.push(dayTotal);

            runningTotal += dayTotal;

            cummArr.push(Number(runningTotal.toFixed(2)));

        });

        return {
            days: daysArr,
            totalCost: totalArr,
            cumulativeCost: cummArr
        };

    }, [reportData, rowFields]);

    /* ---------------- DRILL DOWN ---------------- */

    const handleRowClick = useCallback((day, description) => {

        setDetailLoader(true);

        COPQDetailsView(
            { day, description },
            (res) => {

                setDetailData(res?.data?.records ?? []);

                setDetailInfo({
                    day: res?.data?.day,
                    description: res?.data?.description
                });

                setOpenDialog(true);
                setDetailLoader(false);

            },
            () => {

                setDetailLoader(false);

                setNotification({
                    status: true,
                    type: "error",
                    message: "Failed to fetch detail data"
                });

            }
        );

    }, []);

    /* ---------------- UI ---------------- */
    // ✅ Use the exact keys from the API response (with spaces)
    const NON_CLICKABLE_FIELDS = new Set(["External failure Cost", "Internal failure Cost"]);
    /* ---------------- EXCEL DOWNLOAD ---------------- */
    const handleDownloadExcel = useCallback(() => {
        if (!reportData.length) return;

        const wb = XLSX.utils.book_new();

        // ── Sheet 1: Main COPQ Report ──
        const headers = ["Description", ...days];

        const sheetRows = [
            headers,
            ...rowFields.map((field) => [
                formatLabel(field),
                ...reportData.map((d) => Number(d[field] ?? 0))
            ]),
            ["Total Cost", ...totalCost],
            ["Cumm. COPQ Cost", ...cumulativeCost],
        ];

        const ws = XLSX.utils.aoa_to_sheet(sheetRows);

        // Column widths
        ws['!cols'] = [
            { wch: 28 },                          // Description column
            ...days.map(() => ({ wch: 12 }))      // Day columns
        ];

        // Style header row (row 0) - bold + background
        const headerRange = XLSX.utils.decode_range(ws['!ref']);
        for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
            const cellAddr = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!ws[cellAddr]) continue;
            ws[cellAddr].s = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "002D68" } },
                alignment: { horizontal: "center" }
            };
        }

        // Style Total Cost row
        const totalRowIdx = rowFields.length + 1;
        for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
            const cellAddr = XLSX.utils.encode_cell({ r: totalRowIdx, c: C });
            if (!ws[cellAddr]) continue;
            ws[cellAddr].s = {
                font: { bold: true },
                fill: { fgColor: { rgb: "E0E0E0" } }
            };
        }

        // Style Cumulative row
        const cummRowIdx = rowFields.length + 2;
        for (let C = headerRange.s.c; C <= headerRange.e.c; C++) {
            const cellAddr = XLSX.utils.encode_cell({ r: cummRowIdx, c: C });
            if (!ws[cellAddr]) continue;
            ws[cellAddr].s = {
                font: { bold: true, color: { rgb: "FF0000" } },
                fill: { fgColor: { rgb: "C9DAF8" } }
            };
        }

        XLSX.utils.book_append_sheet(wb, ws, "COPQ Report");

        // ── Sheet 2: Detail (if dialog data is loaded) ──
        if (detailData.length > 0) {
            const isRework = detailInfo.description === "reworkCost";

            let detailRows;
            if (isRework) {
                detailRows = [
                    ["Item Code", "Item Name", "Process", "Rej Qty", "Net Weight", "Material Rate", "Total Cost"],
                    ...detailData
                        .filter(r => r.itemCode !== "TOTAL")
                        .map(r => [r.itemCode, r.itemName || "-", r.scrapProcessName || "-", Number(r.rejRewQty || 0), Number(r.netWeight || 0), Number(r.materialRate || 0), Number(r.totalCost || 0)]),
                    ["", "", "", "", "", "TOTAL", Number(detailData.find(r => r.itemCode === "TOTAL")?.totalCost || 0)]
                ];
            } else {
                detailRows = [["Item Code", "Item Name", "Scrap Process", "Rej Qty", "Net Weight", "Material Rate", "Process", "Count", "Rate", "Process Cost", "Material Cost", "Total Cost"]];
                detailData.filter(r => r.itemCode !== "TOTAL").forEach(r => {
                    if (r.processes?.length > 0) {
                        r.processes.forEach((proc, j) => {
                            detailRows.push([
                                j === 0 ? r.itemCode : "",
                                j === 0 ? (r.itemName || "-") : "",
                                j === 0 ? (r.scrapProcessName || "-") : "",
                                j === 0 ? Number(r.rejRewQty || 0) : "",
                                j === 0 ? Number(r.netWeight || 0) : "",
                                j === 0 ? Number(r.materialRate || 0) : "",
                                proc.processName,
                                proc.count,
                                Number(proc.rate || 0),
                                Number(proc.cost || 0),
                                j === 0 ? Number(r.materialCost || 0) : "",
                                j === 0 ? Number(r.totalCost || 0) : ""
                            ]);
                        });
                    } else {
                        detailRows.push([r.itemCode, r.itemName || "-", r.scrapProcessName || "-", Number(r.rejRewQty || 0), Number(r.netWeight || 0), Number(r.materialRate || 0), "-", "-", "-", "-", Number(r.materialCost || 0), Number(r.totalCost || 0)]);
                    }
                });
                const tot = detailData.find(r => r.itemCode === "TOTAL");
                if (tot) detailRows.push(["", "", "", "", "", "", "", "", "", Number(tot.processCost || 0), Number(tot.materialCost || 0), Number(tot.totalCost || 0)]);
            }

            const ws2 = XLSX.utils.aoa_to_sheet(detailRows);
            ws2['!cols'] = [{ wch: 24 }, { wch: 30 }, { wch: 22 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 22 }, { wch: 10 }, { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 12 }];
            XLSX.utils.book_append_sheet(wb, ws2, `Detail - ${detailInfo.description}`);
        }

        // ── Download ──
        const fileName = `COPQ_Report_${fromDate}_to_${toDate}.xlsx`;
        XLSX.writeFile(wb, fileName);

    }, [reportData, rowFields, days, totalCost, cumulativeCost, detailData, detailInfo, fromDate, toDate]);

    /* ---------------- DIALOG EXCEL DOWNLOAD ---------------- */
    const handleDownloadDetailExcel = useCallback(() => {
        if (!detailData.length) return;

        const wb = XLSX.utils.book_new();
        const isRework = detailInfo.description === "reworkCost";

        let detailRows;

        if (isRework) {
            detailRows = [
                ["Item Code", "Item Name", "Process", "Rej Qty", "Net Weight", "Material Rate", "Total Cost"],
                ...detailData
                    .filter(r => r.itemCode !== "TOTAL")
                    .map(r => [
                        r.itemCode,
                        r.itemName || "-",
                        r.scrapProcessName || "-",
                        Number(r.rejRewQty || 0),
                        Number(r.netWeight || 0),
                        Number(r.materialRate || 0),
                        Number(r.totalCost || 0)
                    ]),
            ];
            const tot = detailData.find(r => r.itemCode === "TOTAL");
            if (tot) detailRows.push(["", "", "", "", "", "TOTAL", Number(tot.totalCost || 0)]);

        } else {
            detailRows = [["Item Code", "Item Name", "Scrap Process", "Rej Qty", "Net Weight", "Material Rate", "Process", "Count", "Rate", "Process Cost", "Material Cost", "Total Cost"]];

            detailData.filter(r => r.itemCode !== "TOTAL").forEach(r => {
                if (r.processes?.length > 0) {
                    r.processes.forEach((proc, j) => {
                        detailRows.push([
                            j === 0 ? r.itemCode : "",
                            j === 0 ? (r.itemName || "-") : "",
                            j === 0 ? (r.scrapProcessName || "-") : "",
                            j === 0 ? Number(r.rejRewQty || 0) : "",
                            j === 0 ? Number(r.netWeight || 0) : "",
                            j === 0 ? Number(r.materialRate || 0) : "",
                            proc.processName,
                            Number(proc.count || 0),
                            Number(proc.rate || 0),
                            Number(proc.cost || 0),
                            j === 0 ? Number(r.materialCost || 0) : "",
                            j === 0 ? Number(r.totalCost || 0) : ""
                        ]);
                    });
                } else {
                    detailRows.push([
                        r.itemCode,
                        r.itemName || "-",
                        r.scrapProcessName || "-",
                        Number(r.rejRewQty || 0),
                        Number(r.netWeight || 0),
                        Number(r.materialRate || 0),
                        "-", "-", "-", "-",
                        Number(r.materialCost || 0),
                        Number(r.totalCost || 0)
                    ]);
                }
            });

            const tot = detailData.find(r => r.itemCode === "TOTAL");
            if (tot) {
                detailRows.push([
                    "TOTAL", "", "", "", "", "", "", "", "",
                    Number(tot.processCost || 0),
                    Number(tot.materialCost || 0),
                    Number(tot.totalCost || 0)
                ]);
            }
        }

        const ws = XLSX.utils.aoa_to_sheet(detailRows);

        // Column widths
        ws['!cols'] = [
            { wch: 24 }, { wch: 30 }, { wch: 22 },
            { wch: 15 }, { wch: 15 }, { wch: 15 },
            { wch: 22 }, { wch: 10 }, { wch: 10 },
            { wch: 14 }, { wch: 14 }, { wch: 12 }
        ];

        // Style header row
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cell = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!ws[cell]) continue;
            ws[cell].s = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "1976D2" } },
                alignment: { horizontal: "center" }
            };
        }

        // Style TOTAL row (last row)
        const lastRow = detailRows.length - 1;
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cell = XLSX.utils.encode_cell({ r: lastRow, c: C });
            if (!ws[cell]) continue;
            ws[cell].s = {
                font: { bold: true },
                fill: { fgColor: { rgb: "F5F5F5" } }
            };
        }

        XLSX.utils.book_append_sheet(wb, ws, detailInfo.description);

        const fileName = `COPQ_Detail_${detailInfo.description}_${detailInfo.day}.xlsx`;
        XLSX.writeFile(wb, fileName);

    }, [detailData, detailInfo]);
    return (
        <Box m={2}>

            <Typography variant="h6" fontWeight="bold" mb={2}>
                COPQ Monthly Report
            </Typography>

            <Card>

                {loader && <LinearProgress />}

                <CardContent>

                    {/* FILTER */}

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

                        <Grid item xs={12} md={3}>
                            <Box display="flex" gap={1}>
                                <Button
                                    variant="contained"
                                    sx={{ backgroundColor: "#002D68" }}
                                    onClick={handleView}
                                    disabled={loader}
                                >
                                    {loader ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "View"}
                                </Button>

                                {/* ← Add this download button */}
                                <Button
                                    variant="outlined"
                                    sx={{ borderColor: "#002D68", color: "#002D68" }}
                                    onClick={handleDownloadExcel}
                                    disabled={!reportData.length || loader}
                                >
                                    ⬇ Download
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>

                    {/* TABLE */}

                    <Box mt={3} sx={{ overflowX: "auto", maxHeight: "65vh" }}>

                        <table
                            border="1"
                            style={{
                                borderCollapse: "collapse",
                                minWidth: "1400px",
                                width: "100%",
                                tableLayout: "fixed",
                                textAlign: "center",
                                fontSize: "12px"
                            }}
                        >

                            <thead>

                                <tr style={headerStyle}>

                                    <th style={stickyHeader}>Description</th>

                                    {days.map((day) => (
                                        <th key={day} style={dayCell}>{day}</th>
                                    ))}

                                </tr>

                            </thead>

                            <tbody>

                                {rowFields.map((field) => (
                                    <Row
                                        key={field}
                                        label={formatLabel(field)}
                                        data={reportData}
                                        field={field}
                                        onCellClick={handleRowClick}
                                        clickable={!NON_CLICKABLE_FIELDS.has(field)} // ← add this

                                    />
                                ))}

                                <tr style={totalRowStyle}>
                                    <td style={stickyCell}>Total Cost</td>
                                    {totalCost.map((v, i) => (
                                        <td key={i} style={dataCell}>{v.toFixed(2)}</td>
                                    ))}
                                </tr>

                                <tr style={cummRowStyle}>
                                    <td style={stickyCell}>Cumm. COPQ Cost</td>
                                    {cumulativeCost.map((v, i) => (
                                        <td key={i} style={dataCell}>{v.toFixed(2)}</td>
                                    ))}
                                </tr>

                            </tbody>

                        </table>

                        {!reportData.length && (
                            <Typography align="center" mt={2}>
                                No Data Found
                            </Typography>
                        )}

                    </Box>

                </CardContent>

            </Card>

            {/* ---------------- DIALOG ---------------- */}

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    COPQ Detail - {detailInfo.description} ({detailInfo.day})
                </DialogTitle>

                <DialogContent>
                    {detailLoader ? (
                        <CircularProgress />
                    ) : (
                        <Box sx={{ maxHeight: "60vh", overflow: "auto" }}>
                            {/* ── REWORK COST TABLE (no processes array) ── */}
                            {detailInfo.description === "reworkCost" ? (
                                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                                    <thead>
                                        <tr style={dialogHeader}>
                                            <th style={{ padding: "8px 12px", textAlign: "center" }}>Item Code</th>
                                            <th style={{ padding: "8px 12px", textAlign: "left" }}>Item Name</th>
                                            <th style={{ padding: "8px 12px", textAlign: "center" }}>Process</th>
                                            <th style={{ padding: "8px 12px", textAlign: "right" }}>Rej Qty</th>
                                            <th style={{ padding: "8px 12px", textAlign: "right" }}>Net Weight</th>
                                            <th style={{ padding: "8px 12px", textAlign: "right" }}>Material Rate</th>
                                            <th style={{ padding: "8px 12px", textAlign: "right" }}>Total Cost</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {(() => {
                                            const dataRows = detailData.filter(r => r.itemCode !== "TOTAL");
                                            const totalRow = detailData.find(r => r.itemCode === "TOTAL");

                                            // Group rows by itemCode to apply rowSpan
                                            const grouped = dataRows.reduce((acc, row) => {
                                                if (!acc[row.itemCode]) acc[row.itemCode] = [];
                                                acc[row.itemCode].push(row);
                                                return acc;
                                            }, {});

                                            const rows = [];

                                            Object.values(grouped).forEach((group, gi) => {
                                                group.forEach((row, j) => {
                                                    const isFirst = j === 0;
                                                    const isLast = j === group.length - 1;

                                                    rows.push(
                                                        <tr
                                                            key={`${gi}-${j}`}
                                                            style={{
                                                                ...dialogRow,
                                                                borderBottom: isLast ? "2px solid #ccc" : "1px solid #eee",
                                                            }}
                                                        >
                                                            {isFirst && (
                                                                <>
                                                                    <td
                                                                        rowSpan={group.length}
                                                                        style={{
                                                                            padding: "8px 12px",
                                                                            textAlign: "center",
                                                                            verticalAlign: "middle",
                                                                            borderRight: "1px solid #ddd",
                                                                            fontWeight: "500",
                                                                        }}
                                                                    >
                                                                        {row.itemCode}
                                                                    </td>
                                                                    <td
                                                                        rowSpan={group.length}
                                                                        style={{
                                                                            padding: "8px 12px",
                                                                            textAlign: "left",
                                                                            verticalAlign: "middle",
                                                                            borderRight: "1px solid #ddd",
                                                                        }}
                                                                    >
                                                                        {row.itemName || "-"}
                                                                    </td>
                                                                </>
                                                            )}
                                                            <td style={{ padding: "8px 12px", textAlign: "center" }}>
                                                                {row.scrapProcessName || "-"}
                                                            </td>
                                                            <td style={{ padding: "8px 12px", textAlign: "right" }}>
                                                                {row.rejRewQty || "0"}
                                                            </td>
                                                            <td style={{ padding: "8px 12px", textAlign: "right" }}>
                                                                {row.netWeight || "0"}
                                                            </td>
                                                            <td style={{ padding: "8px 12px", textAlign: "right" }}>
                                                                {row.materialRate || "0"}
                                                            </td>
                                                            <td style={{ padding: "8px 12px", textAlign: "right" }}>
                                                                {Number(row.totalCost || 0).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    );
                                                });
                                            });

                                            // TOTAL row
                                            if (totalRow) {
                                                rows.push(
                                                    <tr key="total" style={dialogTotal}>
                                                        <td
                                                            colSpan={6}
                                                            style={{ padding: "8px 12px", textAlign: "right", fontWeight: "bold" }}
                                                        >
                                                            TOTAL
                                                        </td>
                                                        <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "bold" }}>
                                                            {Number(totalRow.totalCost || 0).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                );
                                            }

                                            return rows;
                                        })()}
                                    </tbody>
                                </table>

                            ) : (
                                /* ── INPROCESS TABLE (has processes array) ── */
                                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                                    <thead>
                                        <tr style={dialogHeader}>
                                            <th style={{ padding: "8px 12px", textAlign: "center" }}>Item Code</th>
                                            <th style={{ padding: "8px 12px", textAlign: "left" }}>Item Name</th>
                                            <th style={{ padding: "8px 12px", textAlign: "center" }}>Scrap Process</th>
                                            <th style={{ padding: "8px 12px", textAlign: "right" }}>Rej Qty</th>
                                            <th style={{ padding: "8px 12px", textAlign: "right" }}>Net Weight</th>
                                            <th style={{ padding: "8px 12px", textAlign: "right" }}>Material Rate</th>
                                            <th style={{ padding: "8px 12px", textAlign: "center" }}>Process</th>
                                            <th style={{ padding: "8px 12px", textAlign: "right" }}>Count</th>
                                            <th style={{ padding: "8px 12px", textAlign: "right" }}>Rate</th>
                                            <th style={{ padding: "8px 12px", textAlign: "right" }}>Process Cost</th>
                                            <th style={{ padding: "8px 12px", textAlign: "right" }}>Material Cost</th>
                                            <th style={{ padding: "8px 12px", textAlign: "right" }}>Total Cost</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {detailData.map((row, i) => {
                                            const isTotal = row.itemCode === "TOTAL";

                                            if (isTotal) {
                                                return (
                                                    <tr key={i} style={dialogTotal}>
                                                        <td
                                                            colSpan={9}
                                                            style={{ padding: "8px 12px", textAlign: "right", fontWeight: "bold" }}
                                                        >
                                                            TOTAL
                                                        </td>
                                                        <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "bold" }}>
                                                            {Number(row.processCost || 0).toFixed(2)}
                                                        </td>
                                                        <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "bold" }}>
                                                            {Number(row.materialCost || 0).toFixed(2)}
                                                        </td>
                                                        <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "bold" }}>
                                                            {Number(row.totalCost || 0).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                );
                                            }

                                            const processes = row.processes || [];

                                            // return processes.map((proc, j) => {
                                            //     const isFirstProcess = j === 0;
                                            //     const isLastProcess = j === processes.length - 1;

                                            //     return (
                                            //         <tr
                                            //             key={`${i}-${j}`}
                                            //             style={{
                                            //                 ...dialogRow,
                                            //                 borderBottom: isLastProcess ? "2px solid #ccc" : "1px solid #eee",
                                            //             }}
                                            //         >
                                            //             {isFirstProcess && (
                                            //                 <>
                                            //                     <td
                                            //                         rowSpan={processes.length}
                                            //                         style={{
                                            //                             padding: "8px 12px",
                                            //                             textAlign: "center",
                                            //                             verticalAlign: "middle",
                                            //                             borderRight: "1px solid #ddd",
                                            //                             fontWeight: "500",
                                            //                         }}
                                            //                     >
                                            //                         {row.itemCode}
                                            //                     </td>
                                            //                     <td
                                            //                         rowSpan={processes.length}
                                            //                         style={{
                                            //                             padding: "8px 12px",
                                            //                             textAlign: "left",
                                            //                             verticalAlign: "middle",
                                            //                             borderRight: "1px solid #ddd",
                                            //                         }}
                                            //                     >
                                            //                         {row.itemName || "-"}
                                            //                     </td>
                                            //                 </>
                                            //             )}
                                            //             <td style={{ padding: "8px 12px", textAlign: "center" }}>
                                            //                 {proc.processName}
                                            //             </td>
                                            //             <td style={{ padding: "8px 12px", textAlign: "right" }}>
                                            //                 {proc.count}
                                            //             </td>
                                            //             <td style={{ padding: "8px 12px", textAlign: "right" }}>
                                            //                 {Number(proc.rate || 0).toFixed(2)}
                                            //             </td>
                                            //             <td style={{ padding: "8px 12px", textAlign: "right" }}>
                                            //                 {Number(proc.cost || 0).toFixed(2)}
                                            //             </td>
                                            //             {isFirstProcess && (
                                            //                 <>
                                            //                     <td
                                            //                         rowSpan={processes.length}
                                            //                         style={{
                                            //                             padding: "8px 12px",
                                            //                             textAlign: "right",
                                            //                             verticalAlign: "middle",
                                            //                             borderLeft: "1px solid #ddd",
                                            //                         }}
                                            //                     >
                                            //                         {Number(row.materialCost || 0).toFixed(2)}
                                            //                     </td>
                                            //                     <td
                                            //                         rowSpan={processes.length}
                                            //                         style={{
                                            //                             padding: "8px 12px",
                                            //                             textAlign: "right",
                                            //                             verticalAlign: "middle",
                                            //                             fontWeight: "bold",
                                            //                             borderLeft: "1px solid #ddd",
                                            //                         }}
                                            //                     >
                                            //                         {Number(row.totalCost || 0).toFixed(2)}
                                            //                     </td>
                                            //                 </>
                                            //             )}
                                            //         </tr>
                                            //     );
                                            // });
                                            return processes.length > 0 ? (
                                                // existing processes.map() code
                                                processes.map((proc, j) => {
                                                    const isFirstProcess = j === 0;
                                                    const isLastProcess = j === processes.length - 1;

                                                    return (
                                                        <tr
                                                            key={`${i}-${j}`}
                                                            style={{
                                                                ...dialogRow,
                                                                borderBottom: isLastProcess ? "2px solid #ccc" : "1px solid #eee",
                                                            }}
                                                        >
                                                            {isFirstProcess && (
                                                                <>
                                                                    <td
                                                                        rowSpan={processes.length}
                                                                        style={{
                                                                            padding: "8px 12px",
                                                                            textAlign: "center",
                                                                            verticalAlign: "middle",
                                                                            borderRight: "1px solid #ddd",
                                                                            fontWeight: "500",
                                                                        }}
                                                                    >
                                                                        {row.itemCode}
                                                                    </td>
                                                                    <td
                                                                        rowSpan={processes.length}
                                                                        style={{
                                                                            padding: "8px 12px",
                                                                            textAlign: "left",
                                                                            verticalAlign: "middle",
                                                                            borderRight: "1px solid #ddd",
                                                                        }}
                                                                    >
                                                                        {row.itemName || "-"}
                                                                    </td>
                                                                    <td rowSpan={processes.length} style={{ padding: "8px 12px", textAlign: "center", verticalAlign: "middle", borderRight: "1px solid #ddd" }}>
                                                                        {row.scrapProcessName || "-"}
                                                                    </td>
                                                                    <td rowSpan={processes.length} style={{ padding: "8px 12px", textAlign: "right", verticalAlign: "middle", borderRight: "1px solid #ddd" }}>
                                                                        {row.rejRewQty || "0"}
                                                                    </td>
                                                                    <td rowSpan={processes.length} style={{ padding: "8px 12px", textAlign: "right", verticalAlign: "middle", borderRight: "1px solid #ddd" }}>
                                                                        {row.netWeight || "0"}
                                                                    </td>
                                                                    <td rowSpan={processes.length} style={{ padding: "8px 12px", textAlign: "right", verticalAlign: "middle", borderRight: "1px solid #ddd" }}>
                                                                        {row.materialRate || "0"}
                                                                    </td>
                                                                </>
                                                            )}
                                                            <td style={{ padding: "8px 12px", textAlign: "center" }}>{proc.processName}</td>
                                                            <td style={{ padding: "8px 12px", textAlign: "right" }}>{proc.count}</td>
                                                            <td style={{ padding: "8px 12px", textAlign: "right" }}>{Number(proc.rate || 0).toFixed(2)}</td>
                                                            <td style={{ padding: "8px 12px", textAlign: "right" }}>{Number(proc.cost || 0).toFixed(2)}</td>
                                                            {isFirstProcess && (
                                                                <>
                                                                    <td
                                                                        rowSpan={processes.length}
                                                                        style={{
                                                                            padding: "8px 12px",
                                                                            textAlign: "right",
                                                                            verticalAlign: "middle",
                                                                            borderLeft: "1px solid #ddd",
                                                                        }}
                                                                    >
                                                                        {Number(row.materialCost || 0).toFixed(2)}
                                                                    </td>
                                                                    <td
                                                                        rowSpan={processes.length}
                                                                        style={{
                                                                            padding: "8px 12px",
                                                                            textAlign: "right",
                                                                            verticalAlign: "middle",
                                                                            fontWeight: "bold",
                                                                            borderLeft: "1px solid #ddd",
                                                                        }}
                                                                    >
                                                                        {Number(row.totalCost || 0).toFixed(2)}
                                                                    </td>
                                                                </>
                                                            )}
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                // ← fallback row when processes is empty
                                                <tr
                                                    key={`${i}-empty`}
                                                    style={{ ...dialogRow, borderBottom: "2px solid #ccc" }}
                                                >
                                                    <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: "500" }}>
                                                        {row.itemCode}
                                                    </td>
                                                    <td style={{ padding: "8px 12px", textAlign: "left" }}>
                                                        {row.itemName || "-"}
                                                    </td>
                                                    <td style={{ padding: "8px 12px", textAlign: "center", borderRight: "1px solid #ddd" }}>{row.scrapProcessName || "-"}</td>
                                                    <td style={{ padding: "8px 12px", textAlign: "right", borderRight: "1px solid #ddd" }}>{row.rejRewQty || "0"}</td>
                                                    <td style={{ padding: "8px 12px", textAlign: "right", borderRight: "1px solid #ddd" }}>{row.netWeight || "0"}</td>
                                                    <td style={{ padding: "8px 12px", textAlign: "right", borderRight: "1px solid #ddd" }}>{row.materialRate || "0"}</td>
                                                    <td style={{ padding: "8px 12px", textAlign: "center", color: "#999" }}>-</td>
                                                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#999" }}>-</td>
                                                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#999" }}>-</td>
                                                    <td style={{ padding: "8px 12px", textAlign: "right", color: "#999" }}>-</td>
                                                    <td style={{ padding: "8px 12px", textAlign: "right" }}>
                                                        {Number(row.materialCost || 0).toFixed(2)}
                                                    </td>
                                                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: "bold" }}>
                                                        {Number(row.totalCost || 0).toFixed(2)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </Box>
                    )}
                </DialogContent>

                <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>

                    {/* ← Download button on the left */}
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{ borderColor: "#1976d2", color: "#1976d2" }}
                        onClick={handleDownloadDetailExcel}
                        disabled={!detailData.length}
                    >
                        ⬇ Download Excel
                    </Button>

                    <Button onClick={() => setOpenDialog(false)}>Close</Button>

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

        </Box>
    );
};

/* ---------------- ROW COMPONENT ---------------- */

const Row = React.memo(({ label, data, field, onCellClick, clickable = true }) => (
    <tr style={{ height: 36 }}>
        <td style={stickyCell} title={label}>{label}</td>

        {data.map((d, i) => {
            const raw = Number(d[field] ?? 0);
            const value = Math.round(raw * 100) / 100;

            const isClickable = clickable && value > 0; // ← both must be true

            return (
                <td
                    key={i}
                    style={{
                        ...dataCell,
                        cursor: isClickable ? "pointer" : "default",
                        color: isClickable ? "#1976d2" : "#000",
                    }}
                    onClick={() => isClickable && onCellClick(d.date, field)}
                >
                    {value.toFixed(2)}
                </td>
            );
        })}
    </tr>
));

/* ---------------- HELPERS ---------------- */

const formatLabel = (key) =>
    key
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .replace(/^./, (s) => s.toUpperCase());

/* ---------------- STYLES ---------------- */

const stickyCell = {
    position: "sticky",
    left: 0,
    width: 220,
    background: "#e9f5e1",
    fontWeight: "bold",
    zIndex: 2,
    textAlign: "left",
    paddingLeft: 8,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
};

const stickyHeader = {
    ...stickyCell,
    background: "#93bce6",
    textAlign: "center"
};

const dayCell = { width: 80 };

const dataCell = { width: 80, height: 36 };

const headerStyle = {
    background: "#93bce6",
    height: 40
};

const totalRowStyle = {
    background: "#e0e0e0",
    fontWeight: "bold"
};

const cummRowStyle = {
    background: "#c9daf8",
    fontWeight: "bold",
    color: "red"
};

const dialogHeader = {
    position: "sticky",
    top: 0,
    background: "#1976d2",
    color: "#fff",
    height: 40
};

const dialogRow = {
    borderBottom: "1px solid #ddd",
    height: 36
};

const dialogTotal = {
    background: "#f5f5f5",
    fontWeight: "bold",
    height: 36
};

export default COPQReport;
