import React, { useCallback, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
  Modal,
  Box,
  Stack,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { MaintanenceMtbfList } from "../../ApiService/LoginPageService";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "90%", md: "85%", lg: "80%" },
  height: { xs: "90%", md: "85%", lg: "80%" },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  overflow: "auto",
};

const MTBF_MonitoringTrend = () => {
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [MTBFData, setMTBFData] = useState({});
  const [detailRows, setDetailRows] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchMtbfData = useCallback(() => {
    if (!fromDate || !toDate) {
      alert("Please select From Date and To Date");
      return;
    }

    if (fromDate > toDate) {
      alert("From Date cannot be greater than To Date");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    const payload = {
      from_date: fromDate,
      to_date: toDate,
    };

    MaintanenceMtbfList(
      payload,
      (res) => {
        const formatted =
          res?.data?.map((item, index) => ({
            id: item.id || index + 1,
            ...item,
            subData: (item.subData || []).map((sub, subIndex) => ({
              id: sub.id || subIndex + 1,
              ...sub,
            })),
          })) || [];

        setRows(formatted);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching MTBF data", err);
        setRows([]);
        setLoading(false);
      }
    );
  }, [fromDate, toDate]);

  const handleSubmit = () => {
    fetchMtbfData();
  };

  const handleView = useCallback((rowData) => {
    setMTBFData({
      machineName: rowData?.machineName || rowData?.toolName || "-",
      machineTag: rowData?.machineTag || rowData?.toolNo || "-",
      AssetModel: rowData?.AssetModel || "-",
      SerialNo: rowData?.SerialNo || "-",
      max_capacity: rowData?.max_capacity || "-",
      dateOfInstall: rowData?.dateOfInstall || rowData?.date_of_install || "-",
      totalHours: rowData?.totalHours || rowData?.operation_hrs || "-",
      totalDays: rowData?.totalDays || rowData?.operation_days || "-",
      BreakDownHours: rowData?.BreakDownHours || rowData?.breakdown_hrs || "-",
      BreakDownCounts: rowData?.BreakDownCounts || rowData?.breakdown_count || "-",
      MTBF_Hrs: rowData?.MTBF_Hrs || rowData?.mtbf || "-",
      MTTR_Hrs: rowData?.MTTR_Hrs || rowData?.mttr || "-",
    });

    setDetailRows(
      (rowData?.subData || []).map((item, index) => ({
        id: item.id || index + 1,
        ...item,
      }))
    );

    setOpenModal(true);
  }, []);

  const handleClose = () => {
    setOpenModal(false);
    setMTBFData({});
    setDetailRows([]);
  };

  const handleDownload = () => {
    // add csv logic if needed
  };

  const handleExport = async () => {
    if (!MTBFData || Object.keys(MTBFData).length === 0) {
      alert("No data available to export.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("MTBF Report");

    sheet.mergeCells("A1:I1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = "MTBF and MTTR Monitor";
    titleCell.font = { bold: true, size: 16 };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    sheet.addRow([]);

    const leftData = [
      ["Name of Machine", MTBFData.machineName],
      ["Machine Code Number", MTBFData.machineTag],
      ["Model Number", MTBFData.AssetModel],
      ["Serial Number", MTBFData.SerialNo],
      ["Capacity", MTBFData.max_capacity],
      ["Date of Installation", MTBFData.dateOfInstall],
    ];

    const rightData = [
      ["Operation Availability (in hrs)", MTBFData.totalHours],
      ["Operation Availability (in days)", MTBFData.totalDays],
      ["Total Breakdown Hours", MTBFData.BreakDownHours],
      ["No of Breakdowns", MTBFData.BreakDownCounts],
      ["MTBF (Hrs)", MTBFData.MTBF_Hrs],
      ["MTTR (Hrs)", MTBFData.MTTR_Hrs],
    ];

    for (let i = 0; i < leftData.length; i++) {
      sheet.addRow([
        leftData[i][0],
        leftData[i][1] || "-",
        "",
        "",
        rightData[i][0],
        rightData[i][1] || "-",
      ]);
    }

    sheet.addRow([]);

    const headers = [
      "Month",
      "From Date",
      "To Date",
      "Time Start",
      "Time Finish",
      "Down Time (hrs)",
      "Availability (hrs)",
      "MTBF (hrs)",
      "Failure %",
    ];

    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEAEAEA" },
    };

    (detailRows || []).forEach((r) => {
      sheet.addRow([
        r.monthYear || "-",
        r.fromdate || "-",
        r.todate || "-",
        r.fromtime || "-",
        r.totime || "-",
        r.BreakDownHours || "-",
        r.AvailabilityHrs || "-",
        r.MTBFHrs || "-",
        r.FailurePercent || "-",
      ]);
    });

    sheet.columns.forEach((col) => {
      let maxLength = 0;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const value = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, value.length);
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
      col.width = maxLength + 4;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `MTBF_Report_${MTBFData.machineName || "Machine"}.xlsx`
    );
  };

  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "SLNO",
        minWidth: 70,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "toolNo",
        headerName: "Tool No",
        minWidth: 120,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "toolName",
        headerName: "Tool Name",
        minWidth: 150,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "date_of_install",
        headerName: "Date Of Install",
        minWidth: 140,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "operation_hrs",
        headerName: "Operation Hrs",
        minWidth: 130,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "operation_days",
        headerName: "Operation Days",
        minWidth: 130,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "breakdown_hrs",
        headerName: "Breakdown Hrs",
        minWidth: 130,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "breakdown_count",
        headerName: "Breakdown Count",
        minWidth: 150,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "mtbf",
        headerName: "MTBF",
        minWidth: 100,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      // {
      //   field: "action",
      //   headerName: "Action",
      //   minWidth: 100,
      //   align: "center",
      //   headerAlign: "center",
      //   sortable: false,
      //   filterable: false,
      //   renderCell: (params) => (
      //     <IconButton
      //       onClick={() => handleView(params.row)}
      //       title="View Details"
      //     >
      //       <VisibilityIcon />
      //     </IconButton>
      //   ),
      // },
    ],
    [handleView]
  );

  const detailColumns = useMemo(
    () => [
      {
        field: "monthYear",
        headerName: "Month",
        flex: 1,
        minWidth: 120,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "fromdate",
        headerName: "From Date",
        flex: 1,
        minWidth: 120,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "todate",
        headerName: "To Date",
        flex: 1,
        minWidth: 120,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "fromtime",
        headerName: "Time Start",
        flex: 1,
        minWidth: 120,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "totime",
        headerName: "Time Finish",
        flex: 1,
        minWidth: 120,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "BreakDownHours",
        headerName: "Down Time (in hrs)",
        flex: 1.2,
        minWidth: 140,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "AvailabilityHrs",
        headerName: "Availability (in hrs)",
        flex: 1.2,
        minWidth: 150,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "MTBFHrs",
        headerName: "MTBF (Hrs)",
        flex: 1,
        minWidth: 120,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "FailurePercent",
        headerName: "Failure %",
        flex: 1,
        minWidth: 120,
        align: "center",
        headerAlign: "center",
      },
    ],
    []
  );

  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{ fontFamily: "Roboto Slab", fontWeight: "bold", color: "#000" }}
          variant="h5"
        >
          MTBF MONITORING
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <TextField
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: "black" }}>
            Submit
          </Button>
          <Button onClick={handleDownload} variant="contained" sx={{ backgroundColor: "black" }}>
            Download CSV
          </Button>
        </Box>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card
            sx={{
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              borderRadius: "10px",
              height: "68vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <Box sx={{ flex: 1, overflow: "auto" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  loading={loading}
                  pageSize={10}
                  rowsPerPageOptions={[10, 20, 50]}
                  disableRowSelectionOnClick
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      color: "#000",
                      fontWeight: "bold",
                      backgroundColor: "#93bce6",
                    },
                    "& .MuiDataGrid-cell": {
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                    },
                  }}
                />
              </Box>

              {hasSearched && !loading && rows.length === 0 && (
                <Typography sx={{ textAlign: "center", mt: 2 }}>
                  No data found for selected date range.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Modal open={openModal} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            MTBF and MTTR Monitor
          </Typography>

          <Grid container spacing={6} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.5}>
                {[
                  ["Name of Machine", MTBFData.machineName],
                  ["Machine Code Number", MTBFData.machineTag],
                  ["Model Number", MTBFData.AssetModel],
                  ["Serial Number", MTBFData.SerialNo],
                  ["Capacity", MTBFData.max_capacity],
                  ["Date of Installation", MTBFData.dateOfInstall],
                ].map(([label, value], index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                      borderBottom: "1px solid #eee",
                      pb: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
                    <Typography>{value || "-"}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack spacing={1.5}>
                {[
                  ["Operation Availability (in hrs)", MTBFData.totalHours],
                  ["Operation Availability (in days)", MTBFData.totalDays],
                  ["Total Breakdown Hours", MTBFData.BreakDownHours],
                  ["No of Breakdowns", MTBFData.BreakDownCounts],
                  ["MTBF (Hrs)", MTBFData.MTBF_Hrs],
                  ["MTTR (Hrs)", MTBFData.MTTR_Hrs],
                ].map(([label, value], index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                      borderBottom: "1px solid #eee",
                      pb: 1,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
                    <Typography>{value || "-"}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ height: "35vh", width: "100%" }}>
            <DataGrid
              rows={detailRows}
              columns={detailColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  fontWeight: "bold",
                  color: "#000",
                  backgroundColor: "#f5f5f5",
                },
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "black", color: "#fff" }}
              onClick={handleClose}
            >
              Close
            </Button>

            <Button
              variant="contained"
              sx={{ backgroundColor: "black", color: "#fff" }}
              onClick={handleExport}
            >
              Download Excel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default MTBF_MonitoringTrend;