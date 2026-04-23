import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  LinearProgress,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  LotwiseStockReportList,
  PurchaseReportSearchItem,
  GetPuchaseReport,
  GetJobWorkIssueReport,
  ItemSearchNAAJ,
  GetSuppVsItemAllSuppList,
  GetSearchedItems,
  RevisedCSLPlan,
  CompareCSLandSOB,
  ProcessRevisedPlanApi,
} from "../../ApiService/LoginPageService";
// import './JobWorkIssueReport.css';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DeleteIcon from "@mui/icons-material/Delete";
import { CheckBox } from "@mui/icons-material";
import { useSharedStore } from "../../StoreData/useSharedStore";
import { useNavigate } from "react-router-dom";
import { useModuleLocks } from "../context/ModuleLockContext";
const RevisedPlan = () => {
  // const { setOrderPlan: setOrderPlanGlobal } = useSharedStore();  // rename
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Revised Plan")?.lockStatus === "locked";

  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [selectedItemId, setSelectedItemId] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const [toDate, setTodate] = useState(today);

  const [lotwsieReportData, setLotwiseReportData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("0");
  console.log("selectedRadioselectedRadio", selectedRadio);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [openRevisedPlan, setOpenRevisedPlan] = useState(false);

  const handleOpenRevisedPlan = () => setOpenRevisedPlan(true);
  const handleCloseRevisedPlan = () => setOpenRevisedPlan(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [cslFiles, setCslFiles] = useState([]);
  const [sobFile, setSobFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [rowsCSL, setRowsCSL] = useState([]);
  const [missingCSL, setMissingCSL] = useState([]);
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [orderPlan, setOrderPlan] = useState([]);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const [file, setFile] = useState(null);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  useEffect(() => {
    GetSearchedItems(
      { code: "" },
      handleItemVsProcessItemSucessShow,
      handleItemVsProcessItemExceptionShow
    );

    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    // Add event listener to update height on resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handlemissingCSL = () => {
    // setRowsCSL(missingCSL || []); // populate DataGrid
    setOpen(true);
  };

  const handleClosecsl = () => setOpen(false);

  const handleExcelImport = () => {
    if (!cslFiles.length || !sobFile) {
      alert("Please select both CSL folder and SOB file");
      return;
    }

    const formData = new FormData();

    // Add CSL folder files (multiple)
    cslFiles.forEach((file) => {
      formData.append("cslFile", file, file.webkitRelativePath || file.name);
    });

    // Add SOB file (single)
    formData.append("sobFile", sobFile, sobFile.name);
    setLoading(true);
    // Call API
    RevisedCSLPlan(formData, handleExportSucess, handleExportFailure);

    handleCloseRevisedPlan();
  };

  const handleExportSucess = (dataObject) => {
    setRows(dataObject?.data || []);
    setMissingCSL(dataObject?.missingCsl || []);
    setLoading(false);
  };

  const handleExportFailure = () => {
    setLoading(false);
  };

  const columns = [
    {
      field: "sNo",
      headerName: "SI No",
      headerClassName: "super-app-theme--header",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "contractNo",
      headerName: "Contract Number",
      headerClassName: "super-app-theme--header",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fimNo",
      headerName: "FIM No",
      headerClassName: "super-app-theme--header",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "partNo",
      headerName: "Part No",
      headerClassName: "super-app-theme--header",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Qty",
      headerName: "Qty",
      headerClassName: "super-app-theme--header",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "oldQty",
      headerName: "Previous Qty",
      headerClassName: "super-app-theme--header",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "super-app-theme--header",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const columns2 = [
    {
      field: "sNo",
      headerName: "SI No",
      headerClassName: "super-app-theme--header",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "contractNo",
      headerName: "Contract Number",
      headerClassName: "super-app-theme--header",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fimNo",
      headerName: "FIM No",
      headerClassName: "super-app-theme--header",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "partNo",
      headerName: "Part No",
      headerClassName: "super-app-theme--header",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Qty",
      headerName: "Qty",
      headerClassName: "super-app-theme--header",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "action",
      headerName: "Action",
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Checkbox
            color="primary"
            checked={params.row.checked} // controlled by row state
            onChange={() => handleCheckboxChange(params.row.id)}
          />
          <IconButton
            sx={{ color: "gray" }}
            onClick={() => console.log("Delete row:", params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (missingCSL.length > 0) {
      setButtonsDisabled(false);
    } else {
      setButtonsDisabled(true);
    }
  }, [missingCSL]);

  const handleCheckboxChange = (id) => {
    setRowsCSL((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, checked: !row.checked } : row
      )
    );
  };

  //   const rows = lotwsieReportData.map((item, index) => ({
  //     id: index + 1,
  //     siNo: item.itemGroup,
  //     contractNumber: item.spCode,
  //     fimNo: item.spName,
  //     partNo: item.location,
  //     qty: item.poNo,
  //     status: item.itemCode,
  //   }));

  /////////////////////////////////////

  const arrayToWorksheet = (array) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("PO Report");

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
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Center align all data rows
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    });

    return workbook;
  };

  const downloadExcelFile = async (workbook, filename) => {
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
  };

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
    // setTodate(initialToDate);
  }, []);

  const handleFromDateChange = (e) => {
    const selectedFromDate = e.target.value;
    setFromDate(selectedFromDate);

    const fromYear = new Date(selectedFromDate).getFullYear();
    const isAfterApril = new Date(selectedFromDate).getMonth() >= 3;

    const financialYearEnd = isAfterApril
      ? `${fromYear + 1}-03-31`
      : `${fromYear}-03-31`;

    // setTodate(financialYearEnd);
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

  // AUTOCOMPLETE ITEM SEARCH
  const handleChange = (e) => {
    GetSearchedItems(
      { code: e.target.value },
      handleItemVsProcessItemSucessShow,
      handleItemVsProcessItemExceptionShow
    );
  };

  const handleItemVsProcessItemSucessShow = (dataObject) => {
    setItemList(dataObject?.data || []);
  };
  const handleItemVsProcessItemExceptionShow = (
    errorObject,
    errorMessage
  ) => { };
  const handleSearchItemChange = (value) => {
    if (value !== null) {
      const idArray = value.map((item) => item.id);
      console.log("idArray", idArray);
      setSelectedItemId(idArray);
    }
  };
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const handleReportView = () => {
    setLoader(true);
    setLoading(true);
    LotwiseStockReportList(
      {
        fromDate: fromDate,
        toDate: toDate,
        category: selectedRadio,
        items: selectedItemId,
        // items: selectedItem,
        // suppliers: selectedSupplier
      },
      handleGetReportSuccess,
      handleGetReportException
    );
  };

  const handleGetReportSuccess = (dataObject) => {
    setLoader(false);
    console.log(dataObject.data);
    setLotwiseReportData(dataObject?.data || []);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const handleGetReportException = () => {
    setLoader(false);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleDeleteAll = () => {
    setMissingCSL([]);
  };

  const MissingCslbuttonsDisabled =
    rows.length === 0 ? true : missingCSL.length > 0 ? true : false;

  const ProcessRevisedPlan = !rows[0]?.status;

  const handleCompareRevisedPlan = () => {
    CompareCSLandSOB({ cslData: rows }, handlesuccess, handlefailure);
  };

  const handlesuccess = (dataObject) => {
    setRows(dataObject?.data || []);
  };

  const handlefailure = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {

    }, 2000);
  };

  const handleProcessRevisedPlan = () => {
    // Filter out rows that contain "No change"
    const filteredRows = rows.filter((row) => row.status !== "No change");

    ProcessRevisedPlanApi(
      { revisedPlanData: filteredRows },
      handleProcesssuccess,
      handleProcessfailure
    );
  };

  const handleProcesssuccess = (dataObject) => {
    const items = dataObject?.items || [];

    // Update state
    setOrderPlan(items);

    // Store in sessionStorage
    sessionStorage.setItem("orderPlan", JSON.stringify(items));
    if (items.length > 0) {
      navigate(`/SalesResult?isRejected=true`);
    }
  };

  const handleProcessfailure = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();

    }, 2000);
  };

  return (
    <div style={{ margin: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginLeft: "5px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        <Typography
          sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
          variant="h5"
        >
          Revised Plan{" "}
        </Typography>
      </div>
      <Card sx={{ minWidth: 275 }}>
        {loading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
        <CardContent>
          <Grid container alignItems={"center"} spacing={2}>
            <Grid
              item
              xs={4}
              sm={4}
              md={3}
              lg={3}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "20px",
                ml: "auto", // 👈 pushes this grid item fully to the right
              }}
            >
              <Button
                variant="contained"
                sx={{ backgroundColor: isModuleLocked ? "gray" : "#002D68" }}
                onClick={handleOpenRevisedPlan}
                disabled={isModuleLocked}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  " Import Revised Plan"
                )}
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: isModuleLocked ? "gray" : "#002D68" }}
                onClick={handleReportView}
                disabled={isModuleLocked}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Export"
                )}
              </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Box
                sx={{
                  height: screenHeight - 435,
                  width: "100%",
                  overflow: "auto",
                  "& .super-app-theme--header": {
                    backgroundColor: "#93bce6",
                    color: "#1c1919",
                  },
                }}
              >
                <DataGrid
                  loading={loading}
                  rows={rows}
                  columns={columns}
                  pageSize={8}
                  rowsPerPageOptions={[8]}
                  disableSelectionOnClick
                  style={{ border: "none" }}
                  sx={{
                    overflow: "auto",
                    height: "50vh",
                    width: "100%",
                    "& .super-app-theme--header": {
                      WebkitTextStrokeWidth: "0.6px",
                    },
                    "& .MuiDataGrid-cell": {
                      border: "1px solid #969696",
                    },
                    "& .MuiDataGrid-columnHeader": {
                      border: "1px solid #969696",
                    },
                  }}
                  getRowClassName={(params) => {
                    const rowIndex = rows.findIndex(
                      (row) => row.id === params.row.id
                    );
                    return rowIndex % 2 === 0 ? "Mui-evenRow" : "Mui-oddRow";
                  }}
                  rowHeight={40}
                  columnHeaderHeight={40}
                />
              </Box>
            </Grid>
          </Grid>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: buttonsDisabled ? "grey" : "#002D68",
                "&:hover": {
                  backgroundColor: buttonsDisabled ? "grey" : "#002D68",
                },
              }}
              disabled={buttonsDisabled} // disabled initially
              onClick={handlemissingCSL}
            >
              Missing CSL
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: MissingCslbuttonsDisabled ? "grey" : "#002D68",
                "&:hover": {
                  backgroundColor: MissingCslbuttonsDisabled
                    ? "grey"
                    : "#002D68",
                },
              }}
              disabled={MissingCslbuttonsDisabled}
              onClick={handleCompareRevisedPlan}
            >
              Compare Revised Plan
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: ProcessRevisedPlan ? "grey" : "#002D68",
                "&:hover": {
                  backgroundColor: ProcessRevisedPlan ? "grey" : "#002D68",
                },
              }}
              disabled={ProcessRevisedPlan}
              onClick={handleProcessRevisedPlan}
            >
              Process Revised Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={openRevisedPlan}
        onClose={handleCloseRevisedPlan}
        aria-labelledby="revised-plan-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",

            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              textAlign: "center",
              backgroundColor: "#002D68",
              py: 1.5,
              borderRadius: "6px",
              mb: 3,
            }}
          >
            <Typography
              id="revised-plan-title"
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "white",
                fontFamily: "Roboto Slab",
              }}
            >
              Import Revised Plan
            </Typography>
          </Box>

          {/* CSL Folder */}
          <Box sx={{ display: "flex", mb: 2, gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ mt: 2, minWidth: "120px", fontWeight: "bold" }}
            >
              CSL Folder :
            </Typography>

            <TextField
              type="file"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                multiple: true,
                webkitdirectory: "true", // <-- allow folder selection
                directory: "true", // <-- optional
                accept: ".xlsx, .xls",
              }}
              style={{ width: "100%" }}
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setCslFiles(files);

                console.log("CSL Folder Selected:");
                files.forEach((f) => console.log(f.webkitRelativePath)); // shows folder structure
              }}
            />
          </Box>

          {/* SOB File */}
          <Box sx={{ display: "flex", mb: 2, gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ mt: 2, minWidth: "120px", fontWeight: "bold" }}
            >
              SOB File :
            </Typography>

            <TextField
              fullWidth
              required
              type="file"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                accept: ".xlsx, .xls",
              }}
              onChange={(e) => {
                const file = e.target.files[0];
                setSobFile(file);
                console.log("SOB File:", file?.name);
              }}
            />
          </Box>

          {/* Buttons */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: "#002D68" }}
              //   onClick={() => {
              //
              //   }}
              onClick={handleExcelImport}
            >
              Import
            </Button>

            <Button
              variant="contained"
              sx={{ backgroundColor: "#002D68" }}
              onClick={handleCloseRevisedPlan}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            bgcolor: "background.paper",
            "& .super-app-theme--header": {
              backgroundColor: "#93bce6",
              color: "#1c1919",
            },

            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2>Missing CSL Data</h2>

          <DataGrid
            rows={missingCSL}
            columns={columns2}
            pageSize={8}
            rowsPerPageOptions={[8]}
            disableSelectionOnClick
            style={{ border: "none" }}
            sx={{
              overflow: "auto",
              height: "50vh",
              width: "100%",
              "& .super-app-theme--header": {
                WebkitTextStrokeWidth: "0.6px",
              },
              "& .MuiDataGrid-cell": {
                border: "1px solid #969696",
              },
              "& .MuiDataGrid-columnHeader": {
                border: "1px solid #969696",
              },
            }}
            getRowClassName={(params) => {
              const rowIndex = rows.findIndex(
                (row) => row.id === params.row.id
              );
              return rowIndex % 2 === 0 ? "Mui-evenRow" : "Mui-oddRow";
            }}
            rowHeight={40}
            columnHeaderHeight={40}
          />

          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: "#002D68" }}
              onClick={handleDeleteAll}
            >
              Delete All
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#002D68" }}
              onClick={handleClosecsl}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
};
export default RevisedPlan;
