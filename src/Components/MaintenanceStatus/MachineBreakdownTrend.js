import React, { useState, useCallback, useMemo } from "react";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    Button,
    Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { BreakDownMaintenanceRecordList } from "../../ApiService/LoginPageService";

const MachineBreakdownTrend = () => {
    const [rows, setRows] = useState([]);
    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
    });
    const [loading, setLoading] = useState(false);
    const [showDownload, setShowDownload] = useState(false);

    const handleChange = (key) => (e) => {
        setFilters((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const columns = useMemo(
        () => [
            { field: "slno", headerName: "SLNO", width: 70, align: "center", headerAlign: "center" },
            { field: "date", headerName: "Date", width: 110, align: "center", headerAlign: "center" },
            { field: "mc_code", headerName: "M/C Code", width: 120, align: "center" },
            { field: "machine_name", headerName: "Machine Name", flex: 1, minWidth: 160 },
            { field: "breakdown_details", headerName: "Breakdown Details", flex: 1.5, minWidth: 200 },
            { field: "corrective_action", headerName: "Immediate Action", flex: 1.5, minWidth: 200 },
            { field: "time_of_failure", headerName: "Failure Time", minWidth: 160, align: "center" },
            { field: "time_of_completion", headerName: "Completion Time", minWidth: 160, align: "center" },
            {
                field: "duration_minutes",
                headerName: "Duration (Hrs)",
                width: 140,
                align: "center",
                valueGetter: ({ value }) =>
                    value ? (value / 60).toFixed(2) : "0.00",
            },
            { field: "cause", headerName: "Cause", flex: 1, minWidth: 150 },
            { field: "attended_by", headerName: "Attended By", flex: 1, minWidth: 180 },
        ],
        []
    );

    const fetchData = useCallback(() => {
        if (!filters.fromDate || !filters.toDate) return;

        setLoading(true);

        BreakDownMaintenanceRecordList(
            {
                from_date: filters.fromDate,
                to_date: filters.toDate,
            },
            (res) => {
                const formatted = (res?.data || []).map((item, index) => ({
                    ...item,
                    id: item.id || index + 1,
                    slno: index + 1,
                }));

                setRows(formatted);
                setShowDownload(true);
                setLoading(false);
            },
            (err) => {
                console.error(err);
                setLoading(false);
            }
        );
    }, [filters]);

    const handleDownload = useCallback(() => {
        if (!rows.length) return;

        const headers = Object.keys(rows[0]).join(",");
        const csvRows = rows.map((row) => Object.values(row).join(","));

        const blob = new Blob([headers, "\n", ...csvRows], {
            type: "text/csv",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "breakdown_report.csv";
        a.click();
    }, [rows]);

    return (
        <Box
            sx={{
                height: "73vh", // 🔥 full page
                display: "flex",
                flexDirection: "column",
                p: 2,
            }}
        >
            {/* HEADER */}
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "#1a237e" }}>
                Breakdown Maintenance Record
            </Typography>

            {/* FILTER CARD */}
            <Card sx={{ mb: 2, borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                label="From Date"
                                type="date"
                                value={filters.fromDate}
                                onChange={handleChange("fromDate")}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                label="To Date"
                                type="date"
                                value={filters.toDate}
                                onChange={handleChange("toDate")}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12} md={2}>
                            <Button
                                fullWidth
                                onClick={fetchData}
                                disabled={loading}
                                disableRipple // 🔥 removes flash

                                sx={{
                                    height: 40,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 600,
                                    backgroundColor: "#002d68",
                                    color: "#fff",
                                    "&:hover": {
                                        backgroundColor: "#001f4d",
                                    },

                                    "&:active": {
                                        backgroundColor: "#001f4d", // 🔥 prevent white flash
                                    },

                                    "&:focus": {
                                        outline: "none",
                                    },
                                }}
                            >
                                {loading ? "Loading..." : "Search"}
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* TABLE SECTION */}
            <Box sx={{ flex: 1, display: "flex" }}>
                <Card
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        boxShadow: 2,
                    }}
                >
                    <CardContent
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            p: 1,
                        }}
                    >
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            loading={loading}
                            pageSizeOptions={[5, 10, 20]}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            disableRowSelectionOnClick
                            sx={{
                                flex: 1, // 🔥 FULL HEIGHT
                                border: "none",
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: "#93bce6",
                                    fontWeight: "bold",
                                },
                                "& .MuiDataGrid-cell": {
                                    whiteSpace: "normal",
                                    wordBreak: "break-word",
                                    fontSize: "13px",
                                },
                            }}
                        />

                        {!loading && rows.length === 0 && (
                            <Typography align="center" sx={{ mt: 2, color: "gray" }}>
                                No records found
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </Box>

            {/* DOWNLOAD */}
            {showDownload && rows.length > 0 && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <Button variant="contained" onClick={handleDownload}>
                        Download CSV
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default MachineBreakdownTrend;