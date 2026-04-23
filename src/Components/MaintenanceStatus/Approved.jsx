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
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";

import { PendingView } from "../MaintenanceApproval/PendingView";
import CheckListDialog from "./CheckListDialog";
import { MaintanenceApprovedList } from "../../ApiService/LoginPageService";

const Approved = ({ index }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedRow, setSelectedRow] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [openChecklist, setOpenChecklist] = useState(false);

  const [machineTag, setMachineTag] = useState("");
  const [checkListId, setCheckListId] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await new Promise((resolve, reject) => {
          MaintanenceApprovedList(resolve, reject);
        });

        if (!isActive) return;

        const apiData = res?.data?.data || res?.data || res || [];

        const formatted = apiData.map((item, index) => ({
          id: index + 1,
          toolNo: item?.toolNo || item?.tool_no || "-",
          Maintype: item?.Maintype || item?.maintenance_type || "-",
          Severity: item?.Severity || item?.severity || "-",
          ProblemNote: item?.ProblemNote || item?.problem_note || "-",
          fromdate: item?.fromdate || item?.scheduleDate || "-",
          fromtime: item?.fromtime || "-",
          machineTag: item?.machineTag || item?.machine || "",
          toolId: item?.toolId || item?.id || "",
        }));

        setRows(formatted);
      } catch (err) {
        if (!isActive) return;
        console.error(err);
        setRows([]);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, []);

  const handleView = useCallback((row) => {
    setSelectedRow(row);
    setCheckListId(row.toolId);
    setOpenView(true);
  }, []);

  const handleChecklist = useCallback((row) => {
    setSelectedRow(row);
    setMachineTag(row.machineTag);
    setCheckListId(row.toolId);
    setOpenChecklist(true);
  }, []);

  const columns = useMemo(
    () => [
      { field: "toolNo", headerName: "Tool No", flex: 1, align: "center", headerAlign: "center" },
      { field: "Maintype", headerName: "Maintenance Type", flex: 1, align: "center", headerAlign: "center" },
      { field: "Severity", headerName: "Severity", flex: 1, align: "center", headerAlign: "center" },
      { field: "ProblemNote", headerName: "Problem Note", flex: 1.2, align: "center", headerAlign: "center" },
      { field: "fromdate", headerName: "Date", flex: 1, align: "center", headerAlign: "center" },
      { field: "fromtime", headerName: "Time", flex: 1, align: "center", headerAlign: "center" },
      {
        field: "actions",
        headerName: "View",
        sortable: false,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) =>
          row.Maintype !== "Preventive Maintenance" && (
            <Tooltip title="View Details">
              <IconButton size="small" onClick={() => handleView(row)}>
                <RemoveRedEyeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ),
      },
      {
        field: "checklist",
        headerName: "Checklist",
        sortable: false,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <Tooltip title="Open Checklist">
            <IconButton size="small" onClick={() => handleChecklist(row)}>
              <ChecklistRtlIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [handleView, handleChecklist]
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
        Maintenance Status
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
              getRowId={(row) => row.id}
              loading={loading}
              pageSizeOptions={[5, 10]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              disableRowSelectionOnClick
              sx={{
                flex: 1, // 🔥 FULL HEIGHT FIX
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
                No records found
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* MODALS */}
      {openView && selectedRow && (
        <PendingView
          ison
          open={openView}
          setOpen={setOpenView}
          rowid={selectedRow?.id}
          rowdata={selectedRow}
          index={index}
        />
      )}

      {openChecklist && machineTag && (
        <CheckListDialog
          openCheckList={openChecklist}
          setOpenCheckList={setOpenChecklist}
          machineTag={machineTag}
          checkListId={checkListId}
        />
      )}
    </Box>
  );
};

export default Approved;