import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
  Checkbox,
  Modal,
  Box,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";

import {
  AuthorizePlanningData,
  AuthorizeRejectedPlanningData,
  DeclineCheckedDataList,
  DeclineDataList,
  ProcessCheckedDataList,
  ProcessDataList,
} from "../../ApiService/LoginPageService";
import { useModuleLocks } from "../context/ModuleLockContext";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const AuthorizePlanning = () => {
  // ---------------- TAB STATE ----------------
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // --------------- ORIGINAL STATES ----------------
  const [processloading, setProcessLoading] = useState(false);
  const [declineloading, setDeclineLoading] = useState(false);

  const [refreshData, setRefreshData] = useState(false);
  const [authorizelist, setAuthorizeList] = useState([]);
  const [documentStatus, setDocumentStatus] = useState("Pending");
  const [selectAll, setSelectAll] = useState(false);
  const [rejectList, setRejectList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalRows, setModalRows] = useState([]); // For second grid

  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Authorize Planning Document")?.lockStatus === "locked";


  const handleRowClick = (params) => {
    // Open modal ONLY when clicking Kanban Date
    if (params.field !== "kanbanDate") return;

    const date = params.row.kanbanDate;
    setSelectedDate(date);

    AuthorizeRejectedPlanningData(
      { type: "RejParts", date: date, status: documentStatus },
      handleRejectedModalSuccess,
      handleRejectedModalError
    );
  };

  const handleRejectedModalSuccess = (dataObject) => {
    setModalRows(dataObject?.data || []);
    setOpenModal(true);
  };

  const handleRejectedModalError = () => { };
  // ---------------- COLUMN DEFINITIONS ----------------
  const columns = [
    {
      field: "sNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>S.No</span>
      ),
      type: "number",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "requestedDate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Requested Date
        </span>
      ),
      type: "string",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "docType",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Document Type
        </span>
      ),
      type: "string",
      minWidth: 50,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "docNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Document NO
        </span>
      ),
      type: "string",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "requestedBy",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Requested By
        </span>
      ),
      type: "string",
      minWidth: 50,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "reason",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Reason</span>
      ),
      type: "string",
      minWidth: 50,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    // Checkbox only for Pending
    ...(documentStatus !== "Approved"
      ? [
        {
          field: "selected",
          headerClassName: "super-app-theme--header",
          headerName: (
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>
              Select
            </span>
          ),
          sortable: false,
          width: 100,
          align: "center",
          headerAlign: "center",
          renderHeader: () => (
            <Checkbox
              checked={selectAll}
              indeterminate={
                authorizelist.some((row) => row.selected) &&
                !authorizelist.every((row) => row.selected)
              }
              onChange={handleSelectAllChange}
            />
          ),
          renderCell: (params) => (
            <Checkbox
              checked={params.row.selected || false}
              onChange={(e) => handleCheckboxChange(e, params.row.id)}
            />
          ),
        },
      ]
      : []),

    // Show Authorized columns
    ...(documentStatus === "Approved"
      ? [
        {
          field: "authorizedBy",
          headerClassName: "super-app-theme--header",
          headerName: (
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>
              Authorized By
            </span>
          ),
          type: "string",
          flex: 1,
          align: "center",
          headerAlign: "center",
        },
        {
          field: "authorizedDate",
          headerClassName: "super-app-theme--header",
          headerName: (
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>
              Authorized Date
            </span>
          ),
          type: "string",
          flex: 1,
          align: "center",
          headerAlign: "center",
        },
      ]
      : []),
  ];

  const columns2 = [
    {
      field: "sNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>S.No</span>
      ),
      type: "number",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "kanbanDate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Kanban Date
        </span>
      ),
      type: "string",
      minWidth: 50,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "rejDate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Rejected Date
        </span>
      ),
      type: "string",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    // {
    //   field: "reqUser",
    //   headerClassName: "super-app-theme--header",
    //   headerName: (
    //     <span style={{ fontWeight: "bold", fontSize: "16px" }}>
    //       Requested By
    //     </span>
    //   ),
    //   type: "string",
    //   minWidth: 50,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "reason",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Reason</span>
      ),
      type: "string",
      minWidth: 50,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    // Checkbox only for Pending
    ...(documentStatus !== "Approved"
      ? [
        {
          field: "selected",
          headerClassName: "super-app-theme--header",
          headerName: (
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>
              Select
            </span>
          ),
          sortable: false,
          width: 100,
          align: "center",
          headerAlign: "center",
          renderHeader: () => (
            <Checkbox
              checked={selectAll}
              indeterminate={
                rejectList.some((row) => row.selected) &&
                !rejectList.every((row) => row.selected)
              }
              onChange={handleSelectAllRejectedChange}
            />
          ),
          renderCell: (params) => (
            <Checkbox
              checked={params.row.selected || false}
              onChange={(e) => handleCheckboxRejectedChange(e, params.row.id)}
            />
          ),
        },
      ]
      : []),

    // Show Authorized columns
    ...(documentStatus === "Approved"
      ? [
        {
          field: "authorizedBy",
          headerClassName: "super-app-theme--header",
          headerName: (
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>
              Authorized By
            </span>
          ),
          type: "string",
          flex: 1,
          align: "center",
          headerAlign: "center",
        },
        {
          field: "authorizedDate",
          headerClassName: "super-app-theme--header",
          headerName: (
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>
              Authorized Date
            </span>
          ),
          type: "string",
          flex: 1,
          align: "center",
          headerAlign: "center",
        },
      ]
      : []),
  ];

  const columns3 = [
    {
      field: "sNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>S.No</span>
      ),
      type: "number",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "jcNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          JobCard Number
        </span>
      ),
      type: "string",
      minWidth: 50,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "itemCode",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>ItemCode</span>
      ),
      type: "string",
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "rejQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Rejected Qty
        </span>
      ),
      type: "string",
      minWidth: 50,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "reqUser",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Rejected By
        </span>
      ),
      type: "string",
      minWidth: 50,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "kanbanDate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          kanban Date
        </span>
      ),
      type: "string",
      minWidth: 50,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const selectedCount = rejectList.filter((row) => row.selected).length;
  const isProcessEnabled = selectedCount === 1;
  const isDeclineEnabled = selectedCount > 1;

  // ---------------------- SELECT ALL CHECKBOX -----------------------
  const handleSelectAllChange = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);

    const updated = authorizelist.map((row) => ({
      ...row,
      selected: checked,
    }));

    setAuthorizeList(updated);
  };

  const handleSelectAllRejectedChange = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);

    const updated = rejectList.map((row) => ({
      ...row,
      selected: checked,
    }));

    setRejectList(updated);
  };

  const handleCheckboxChange = (event, id) => {
    const updatedRows = authorizelist.map((row) =>
      row.id === id ? { ...row, selected: event.target.checked } : row
    );

    setAuthorizeList(updatedRows);

    const allChecked = updatedRows.every((row) => row.selected);
    setSelectAll(allChecked);
  };

  const handleCheckboxRejectedChange = (event, id) => {
    const updatedRows = rejectList.map((row) =>
      row.id === id ? { ...row, selected: event.target.checked } : row
    );

    setRejectList(updatedRows);

    const allChecked = updatedRows.every((row) => row.selected);
    setSelectAll(allChecked);
  };

  // ---------------------- API CALLS ----------------------
  useEffect(() => {
    AuthorizePlanningData(
      { type: documentStatus },
      handleDataSuccess,
      handleDataError
    );
    AuthorizeRejectedPlanningData(
      { type: "doc", date: "", status: documentStatus },
      handleRejectedDataSuccess,
      handleRejectedDataError
    );
  }, [refreshData, documentStatus]);

  const handleDataSuccess = (dataObject) => {
    setAuthorizeList(dataObject?.data || []);
  };

  const handleDataError = () => { };

  const handleRejectedDataSuccess = (dataObject) => {
    setRejectList(dataObject?.data || []);
  };

  const handleRejectedDataError = (dataObject, errorMessage) => {
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
      // setLoading(false);
    }, 3000);
  };

  // Process
  const handleProcess = () => {
    setProcessLoading(true);
    const selectedIDs = authorizelist
      .filter((x) => x.selected)
      .map((x) => x.id);

    if (selectedIDs.length === 0) {
      setProcessLoading(false);
      showError("Please select at least one document!");
      return;
    }

    ProcessCheckedDataList(
      { docIDs: selectedIDs },
      handleProcessSuccess,
      handleProcessError
    );
  };


  const handleRejectedProcess = () => {
    const selectedRow = rejectList.find(row => row.selected);

    if (!selectedRow) {
      console.log("No row selected");
      return;
    }

    const kanbanDate = selectedRow.kanbanDate;

    console.log("Selected Kanban Date:", kanbanDate);

    ProcessDataList({ kanbanDate: kanbanDate }, handleRejected, handleRejectedException)
  };

  const handleRejected = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
    }, 2000);
    AuthorizeRejectedPlanningData(
      { type: "doc", date: "", status: documentStatus },
      handleRejectedDataSuccess,
      handleRejectedDataError
    );
  }

  const handleRejectedException = (dataObject, errorMessage) => {
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
      // setLoading(false);
    }, 3000);

  }

  const handleProcessSuccess = (dataObject) => {
    setProcessLoading(false);
    showSuccess(dataObject.message);
    setRefreshData((prev) => !prev);
  };

  const handleProcessError = (errorObject, errorMessage) => {
    setProcessLoading(false);
    showError(errorMessage);
  };

  // Decline
  const handleDecline = () => {
    setDeclineLoading(true);
    const selectedIDs = authorizelist
      .filter((x) => x.selected)
      .map((x) => x.id);

    if (selectedIDs.length === 0) {
      setDeclineLoading(false);
      showError("Please select at least one document!");
      return;
    }

    DeclineCheckedDataList(
      { docIDs: selectedIDs },
      handleDeclineSuccess,
      handleDeclineError
    );
  };

  const handleDeclineSuccess = (dataObject) => {
    setDeclineLoading(false);
    showSuccess(dataObject.message);
    setRefreshData((prev) => !prev);
  };

  const handleDeclineError = (errorObject, errorMessage) => {
    setDeclineLoading(false);
    showError(errorMessage);
  };

  // ---------------------- NOTIFICATION ----------------------
  const showSuccess = (msg) => {
    setNotification({ status: true, type: "success", message: msg });
    setTimeout(handleClose, 2000);
  };

  const showError = (msg) => {
    setNotification({ status: true, type: "error", message: msg });
    setTimeout(handleClose, 2000);
  };

  const handleClose = () => {
    setNotification({ status: false, type: "", message: "" });
  };

  const handleRejectedDecline = () => {
    const selectedRows = rejectList.filter(row => row.selected);

    const selectedKanbanDates = selectedRows.map(row => row.kanbanDate);

    DeclineDataList({ kanbanDates: selectedKanbanDates }, handleRejectedDeclineSuccess, handleRejectedDeclineError)
  }

  const handleRejectedDeclineSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
    }, 2000);
    AuthorizeRejectedPlanningData(
      { type: "doc", date: "", status: documentStatus },
      handleRejectedDataSuccess,
      handleRejectedDataError
    );

  }

  const handleRejectedDeclineError = (dataObject, errorMessage) => {
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
      // setLoading(false);
    }, 3000);
  }

  return (
    <div style={{ width: "100%", height: "80vh" }}>
      {/* ---------------- TOP TABS ---------------- */}
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Authorize Plan" />
        <Tab label="Authorize Rejected Plan" />
      </Tabs>

      {/* ------------ TAB 1 CONTENT (Authorize Plan EMPTY PLACEHOLDER) ------------ */}
      {tabValue === 0 && (
        <div style={{ height: "60vh", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Card
              style={{ marginTop: "20px", width: "98%", borderRadius: "10px" }}
            >
              <CardContent>
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="h5" fontWeight="bold">
                      Authorize PPC Docs
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Document Status</InputLabel>
                      <Select
                        value={documentStatus}
                        label="Document Status"
                        variant="filled"
                        onChange={(e) => setDocumentStatus(e.target.value)}
                        size="small"
                      >
                        <MenuItem value={"Pending"}>Pending</MenuItem>
                        <MenuItem value={"Approved"}>Approved</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        background: isModuleLocked ? "grey" : "#002D68",
                        color: "white",
                        width: "150px",
                      }}
                      onClick={handleProcess}
                      disabled={processloading || isModuleLocked}
                    >
                      {processloading ? (
                        <CircularProgress
                          size={24}
                          style={{ color: "white" }}
                        />
                      ) : (
                        "Process"
                      )}
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        background: isModuleLocked ? "grey" : "#002D68",
                        color: "white",
                        width: "150px",
                      }}
                      onClick={handleDecline}
                      disabled={declineloading || isModuleLocked}
                    >
                      {declineloading ? (
                        <CircularProgress
                          size={24}
                          style={{ color: "white" }}
                        />
                      ) : (
                        "Decline"
                      )}
                    </Button>
                  </Grid>
                </Grid>

                {/* ---------------- DATA GRID ---------------- */}
                <Grid item xs={12} style={{ marginTop: "20px" }}>
                  <DataGrid
                    rows={authorizelist}
                    columns={columns}
                    pageSize={8}
                    rowsPerPageOptions={[8]}
                    disableRowSelectionOnClick
                    sx={{
                      overflow: "auto",
                      height: "55vh",
                      "& .super-app-theme--header": {
                        backgroundColor: "#93bce6",
                        color: "#1c1919",
                      },
                      "& .MuiDataGrid-cell": { border: "1px solid #969696" },
                      "& .MuiDataGrid-columnHeader": {
                        border: "1px solid #969696",
                      },
                    }}
                    rowHeight={40}
                    columnHeaderHeight={40}
                  />
                </Grid>
              </CardContent>
            </Card>
          </div>

          <NotificationBar
            handleClose={handleClose}
            notificationContent={openNotification.message}
            openNotification={openNotification.status}
            type={openNotification.type}
          />

          <DeleteConfirmationDailog />
        </div>
      )}

      {/* ------------ TAB 2 CONTENT (YOUR ORIGINAL COMPONENT) ------------ */}
      {tabValue === 1 && (
        <div style={{ height: "60vh", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Card
              style={{ marginTop: "20px", width: "98%", borderRadius: "10px" }}
            >
              <CardContent>
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="h5" fontWeight="bold">
                      Authorize Rejected Plan
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Document Status</InputLabel>
                      <Select
                        value={documentStatus}
                        label="Document Status"
                        variant="filled"
                        onChange={(e) => setDocumentStatus(e.target.value)}
                        size="small"
                      >
                        <MenuItem value={"Pending"}>Pending</MenuItem>
                        <MenuItem value={"Approved"}>Approved</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        background: isProcessEnabled ? "#002D68" : isModuleLocked ? "grey" : "#002D68",
                        color: "white",
                        width: "150px",
                        cursor: isProcessEnabled ? "pointer" : "not-allowed",
                      }}
                      onClick={handleRejectedProcess}
                      disabled={!isProcessEnabled}
                    >
                      {processloading ? (
                        <CircularProgress
                          size={24}
                          style={{ color: "white" }}
                        />
                      ) : (
                        "Process"
                      )}
                    </Button>

                    <Button
                      variant="contained"
                      style={{
                        background: isDeclineEnabled ? "#002D68" : isModuleLocked ? "grey" : "#002D68",
                        color: "white",
                        width: "150px",
                        cursor: isDeclineEnabled ? "pointer" : "not-allowed",
                      }}
                      onClick={handleRejectedDecline}
                      disabled={!isDeclineEnabled || isModuleLocked}
                    >
                      {declineloading ? (
                        <CircularProgress
                          size={24}
                          style={{ color: "white" }}
                        />
                      ) : (
                        "Decline"
                      )}
                    </Button>
                  </Grid>
                </Grid>

                {/* ---------------- DATA GRID ---------------- */}
                <Grid item xs={12} style={{ marginTop: "20px" }}>
                  <DataGrid
                    rows={rejectList}
                    columns={columns2}
                    pageSize={8}
                    onCellClick={handleRowClick}
                    rowsPerPageOptions={[8]}
                    disableRowSelectionOnClick
                    sx={{
                      overflow: "auto",
                      height: "55vh",
                      "& .super-app-theme--header": {
                        backgroundColor: "#93bce6",
                        color: "#1c1919",
                      },
                      "& .MuiDataGrid-cell": { border: "1px solid #969696" },
                      "& .MuiDataGrid-columnHeader": {
                        border: "1px solid #969696",
                      },
                    }}
                    rowHeight={40}
                    columnHeaderHeight={40}
                  />
                </Grid>
              </CardContent>
            </Card>
          </div>

          <NotificationBar
            handleClose={handleClose}
            notificationContent={openNotification.message}
            openNotification={openNotification.status}
            type={openNotification.type}
          />

          <DeleteConfirmationDailog />

          {/* <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70%",
                bgcolor: "white",
                p: 2,
                boxShadow: 24,
              }}
            >
              <Typography variant="h5" mb={2} style={{ fontWeight: "bold" }}>
                Rejected Parts on {selectedDate}
              </Typography>

              <DataGrid
                rows={modalRows}
                columns={columns3}
                pageSize={8}
                rowsPerPageOptions={[8]}
                sx={{
                  height: "60vh",
                  "& .super-app-theme--header": {
                    backgroundColor: "#93bce6",
                    color: "#1c1919",
                  },
                }}
              />
            </Box>
          </Modal> */}
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70%",
                bgcolor: "white",
                p: 2,
                boxShadow: 24,
                borderRadius: "10px",
              }}
            >

              {/* -------- HEADER WITH CLOSE BUTTON -------- */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5" style={{ fontWeight: "bold" }}>
                  Rejected Parts on {selectedDate}
                </Typography>

                <IconButton onClick={() => setOpenModal(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* -------- DATA GRID -------- */}
              <DataGrid
                rows={modalRows}
                columns={columns3}
                pageSize={8}
                rowsPerPageOptions={[8]}
                sx={{
                  height: "60vh",
                  "& .super-app-theme--header": {
                    backgroundColor: "#93bce6",
                    color: "#1c1919",
                  },
                }}
              />
            </Box>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default AuthorizePlanning;
