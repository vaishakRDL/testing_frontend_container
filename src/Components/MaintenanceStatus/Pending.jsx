import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import { PendingView } from "../MaintenanceApproval/PendingView";
import { MaintanenceScheduleList } from "../../ApiService/LoginPageService";

const Pending = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await new Promise((resolve, reject) => {
          MaintanenceScheduleList(resolve, reject);
        });

        const apiData = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];

        const formatted = apiData.map((item, index) => ({
          id: item?.id ?? index + 1,
          Maintype: item?.maintenance_type ?? "-",
          toolNo: item?.toolNo ?? "-",
          AffectedMachine: item?.machine ?? "-",
          Severity: item?.severity ?? "-",
          ProblemNote: item?.problem_note ?? "-",
          fromdate: item?.scheduleDate ?? "-",
          fromtime: "-",
          supervisor: item?.supervisor ?? "-",
          problem_category: item?.problem_category ?? "-",
          problem_nature: item?.problem_nature ?? "-",
          machine: item?.machine ?? "-",
          schedule_type: item?.schedule_type ?? "-",
          manpower_mode: item?.manpower_mode ?? "-",
        }));

        setRows(formatted);
      } catch (err) {
        console.error(err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleView = useCallback((row) => {
    setSelectedRow(row);
    setOpen(true);
  }, []);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "Maintenance ID", flex: 1, align: "center", headerAlign: "center" },
      { field: "toolNo", headerName: "Tool No", flex: 1, align: "center", headerAlign: "center" },
      { field: "AffectedMachine", headerName: "Machine", flex: 1 },
      { field: "Severity", headerName: "Severity", flex: 1 },
      { field: "ProblemNote", headerName: "Problem Note", flex: 1.2 },
      { field: "fromdate", headerName: "Date", flex: 1, align: "center" },
      { field: "fromtime", headerName: "Time", flex: 1, align: "center" },
      {
        field: "actions",
        headerName: "Action",
        sortable: false,
        flex: 1,
        renderCell: ({ row }) => (
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => handleView(row)}>
              <RemoveRedEyeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [handleView]
  );

  return (
    <Box
      sx={{
        height: "73vh", // 🔥 full screen
        display: "flex",
        flexDirection: "column",
        p: 2,
      }}
    >
      {/* HEADER */}
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "#1a237e" }}>
        Pending Maintenance
      </Typography>

      {/* CONTENT */}
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
              pageSizeOptions={[5, 10]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              disableRowSelectionOnClick
              sx={{
                flex: 1, // 🔥 MAIN FIX
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#93bce6",
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#eef5ff",
                },
                "& .MuiDataGrid-cell": {
                  fontSize: "13px",
                },
              }}
            />

            {!loading && rows.length === 0 && (
              <Typography align="center" sx={{ mt: 2, color: "gray" }}>
                No pending records found
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* MODAL */}
      {open && selectedRow && (
        <PendingView
          open={open}
          ison
          setOpen={setOpen}
          rowid={selectedRow?.id}
          rowdata={selectedRow}
        />
      )}
    </Box>
  );
};

export default Pending;