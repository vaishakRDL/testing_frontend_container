import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import ProcessInspectionTitle from "./ProcessInspectionTitle";
import {
  GetItemVsProcessItem,
  AddItemVsProcess,
  Addjobcardno,
  Processinspection,
  ProcessInspecSearchMachine,
  ProcessInspecGetMachine,
  ScrapMstGetThickness,
} from "../../ApiService/LoginPageService";
import { useNavigate } from "react-router-dom";
import InProcessFPIResult from "../InProcessFPI/InProcessFPIResult";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProcessInspectionChild from "./ProcessInspectionChild";
import ProcessInspectImage from "../ProcessInspection/ProcessInspectImage";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PDFViewer from "../../Utility/PDFViiewer";
import { NpdDocDownload } from "../../ApiService/DownloadCsvReportsService";
import MultiFileViewer from "./MultiFileViewer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useModuleLocks } from "../context/ModuleLockContext";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const ProcessInspectionResult = () => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Process Inspection")?.lockStatus === "locked";


  const [openDialog, setOpenDialog] = useState(false);
  const [dialogComponent, setDialogComponent] = useState(null);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [isAddButton, setIsAddButton] = useState(true);
  const [editeData, setEditeData] = useState([]);
  const [isLoading, setGridLoading] = useState(false);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [itemList, setItemList] = useState([]);
  const [processList, setProcessList] = useState([]);

  //////////////////////////////////////////
  const [shift, setShift] = useState("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [excelModal, setExcelModal] = useState(false);
  const [copyFromModal, setCopyFromModal] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState("JOBCARD");
  const [jobcardno, setJobcardNo] = useState("");
  const [machineName, setMachineName] = useState("");
  const [fromData, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rowsData, setRowsData] = useState([]);
  const [isProcessInsp, setIsProcessInsp] = useState(0);
  const [isSelectedData, setIsSelectedData] = useState([]);
  const [isSelectedChildData, setIsSelectedChildData] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [openOption, setOpenOption] = useState(false);
  const [machineIdList, setMachineIdList] = useState([]);
  const [selectedOptionName, setSelectedOptionName] = useState("");

  const [openImg, setOpenImg] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [fileTypeForView, setFileTypeForView] = useState("");
  const [selectedRowItemCode, setSelectedRowItemCode] = useState("");

  const [isChild, setIsChild] = useState(0);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [thicknessList, setThicknessList] = useState([]);
  const [selectedThickness, setSelectedThickness] = useState("None");
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");
  // SCROLL
  const [selectedRowId, setSelectedRowId] = useState("");
  const apiRef = useGridApiRef();
  const [highlightedRowId, setHighlightedRowId] = useState(null);

  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;

  const handleClickOption = (event, params) => {
    setAnchorEl(event.currentTarget);
    setIsSelectedData(params.row);
    setOpenOption(true);
  };

  const handleCloseOption = () => {
    setAnchorEl(null);
    setOpenOption(false);
  };

  const [filterModel, setFilterModel] = useState({
    items: [], // Store the applied filters
    logicOperator: "and", // Ensures multiple filters work together
  });
  // const handleFilterChange = useCallback((newModel) => {
  //   setFilterModel(newModel); // Directly update the model without modifying state
  // }, []);

  const columns2 = [
    {
      field: "sNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>SNO</span>
      ),
      type: "string",
      sortable: true,
      width: 80,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "jcNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Jobcard No{" "}
        </span>
      ),
      type: "string",
      sortable: true,
      width: 200,
      // flex: 1,
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
      sortable: true,
      // width: 120,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "itemCode",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Item Code</span>
      ),
      type: "string",
      sortable: true,
      width: 280,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Qty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Qty </span>
      ),
      type: "string",
      sortable: true,
      width: 60,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "qltInspecType",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Inspection Type{" "}
        </span>
      ),
      type: "string",
      sortable: true,
      // width: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "completed",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Completed </span>
      ),
      type: "string",
      sortable: true,
      width: 80,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "rework",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Rework</span>
      ),
      type: "string",
      sortable: true,
      width: 80,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "scrap",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Scrap</span>
      ),
      type: "string",
      sortable: true,
      // width: 80,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      type: "actions",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
      ),
      // width: 200,
      // flex: 1,
      width: 100,
      renderCell: (params) => [
        <div>
          {rowsData?.qltInspecType !== "Complete" ? (
            <>
              <Button
                disabled={isModuleLocked}
                id="demo-positioned-button"
                aria-controls={openOption ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openOption ? "true" : undefined}
                onClick={(event) => {
                  handleClickOption(event, params);
                  setSelectedRowId(params.row.id);
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    minWidth: "250px",
                  }}
                >
                  Options
                </span>
              </Button>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={openOption}
                onClose={handleCloseOption}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    minWidth: "150px",
                  }}
                  onClick={() => {
                    setIsProcessInsp(1);
                    setOpenOption(false);
                    setSelectedOptionName("FPI");
                  }}
                >
                  FPI
                </MenuItem>
                <MenuItem
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    minWidth: "150px",
                  }}
                  onClick={() => {
                    setIsProcessInsp(2);
                    setOpenOption(false);
                    setSelectedOptionName("Observation");
                  }}
                >
                  Observation
                </MenuItem>
                <MenuItem
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    minWidth: "150px",
                  }}
                  onClick={() => {
                    setIsProcessInsp(3);
                    setOpenOption(false);
                    setSelectedOptionName("LPI");
                  }}
                >
                  LPI
                </MenuItem>
                <MenuItem
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    minWidth: "150px",
                  }}
                  onClick={() => {
                    setIsProcessInsp(4);
                    setOpenOption(false);
                    setSelectedOptionName("Rework");
                  }}
                >
                  Rework
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <VisibilityIcon
                onClick={() => {
                  if (isModuleLocked) return;
                  setIsProcessInsp(1);
                  setIsSelectedData(params.row);
                }}
              />
            </>
          )}
        </div>,
      ],
    },
    {
      field: "actions2",
      type: "actions",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Child</span>
      ),
      width: 90,
      // flex: 1,
      renderCell: (params) => [
        <div>
          <Button
            disabled={isModuleLocked}
            onClick={() => {
              setIsProcessInsp(5);
              setIsSelectedData(params.row);
              setSelectedRowId(params.row.id);
            }}
          >
            Child{" "}
          </Button>
        </div>,
      ],
    },
    {
      field: "actions3",
      type: "actions",
      headerClassName: "super-app-theme--header",
      // flex: 1,
      width: 70,

      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Images</span>
      ),
      cellClassName: "actions",
      disableClickEventBubbling: true,
      getActions: (params) => [<ViewdData selectedRow={params.row} />],
    },
  ];

  function ViewdData(props) {
    return (
      <RemoveRedEyeIcon
        onClick={() => {
          if (isModuleLocked) return;
          setPdfOpen(true);
          setFileTypeForView(props.selectedRow?.npdFile || "");
          setSelectedRowItemCode(props.selectedRow?.itemCode || "");
        }}
        style={{
          color: isModuleLocked ? "#706f6f" : "#002D68",
          cursor: "pointer",
        }}
      />
    );
  }



  const DownloadSuccess = () => { };

  const DownloadException = () => { };

  useEffect(() => {
    GetItemVsProcessItem(
      handleItemVsProcessItemSucessShow,
      handleItemVsProcessItemExceptionShow
    );
    ProcessInspecGetMachine(
      handleProcessInspecGetMachineSuccess,
      handleProcessInspecGetMachineException
    );
    ScrapMstGetThickness(handleThicknessSuccess, handleThicknessException);
  }, [refreshData]);

  const handleThicknessSuccess = (dataObject) => {
    setThicknessList(dataObject.data);
  };
  const handleThicknessException = () => { };

  const handleProcessInspecGetMachineSuccess = (dataObject) => {
    setMachineIdList(dataObject?.data || []);
    console.log("handleProjectShow", dataObject?.data);
  };

  const handleProcessInspecGetMachineException = () => { };

  // GET ITEM DROPDOWN
  const handleItemVsProcessItemSucessShow = (dataObject) => {
    setItemList(dataObject?.data || []);
  };
  const handleItemVsProcessItemExceptionShow = (
    errorObject,
    errorMessage
  ) => { };

  const handleChildClick = (params) => {
    setIsProcessInsp(5);
    setIsSelectedData(params.row);
    setIsChild(1); // Set isChild to 1 to show the Typography component
  };

  // GET PROCESS DATAGRID PROCESS

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handleBlur = (e) => {
    const jobvcardnoValue = e.target.value.trim();
  };

  const jobcardhandleSuccess = (dataObject) => {
    // Store dataObject in local storage
    setLoading(false);
    setSubmitLoading(false);
    setGridLoading(false);
    localStorage.setItem("dataObject", JSON.stringify(dataObject));

    // Store the API name 'Addjobcardno' in local storage
    localStorage.setItem("apiName", "Addjobcardno");

    setRowsData(dataObject?.data || []);

    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      // ClearData();
      handleClose();
    }, 2000);
  };

  const jobcardhandleException = (errorObject, errorMessage) => {
    setGridLoading(false);
    setSubmitLoading(false);
    setLoading(false);
    localStorage.setItem("errorMessage", JSON.stringify(errorMessage));
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => { }, 2000);

    // Retrieve errorMessage from local storage
    const storedErrorMessage = localStorage.getItem("errorMessage");
    const retrievedErrorMessage = storedErrorMessage
      ? JSON.parse(storedErrorMessage)
      : null;
  };

  // SCROLL
  const scrollToRow = (rowId) => {
    setTimeout(() => {
      const rowIndex = rowsData.findIndex((row) => row.id === rowId);
      if (rowIndex !== -1) {
        apiRef.current.scrollToIndexes({ rowIndex });
        setHighlightedRowId(rowId); // Set the highlighted row
      }
    }, 500);
  };

  const [expanded, setExpanded] = useState(false); // State to track if accordion is open
  const handleAccordionSummaryClick = () => {
    setExpanded((prevExpanded) => !prevExpanded); // Toggle the accordion state only when summary is clicked
  };
  const handleHover = () => {
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
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

  const handleFromDateChange = (e) => {
    const value = e.target.value;
    if (isValidDateInRange(value)) {
      setFromDate(value);
      setNotification({ status: false, type: "", message: "" });
    } else {
      setNotification({
        status: true,
        type: "error",
        message: "Please select a valid From-Date",
      });
    }
  };

  const handleToDateChange = (e) => {
    const value = e.target.value;
    if (isValidDateInRange(value)) {
      setToDate(value);
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
    <div style={{ height: "60vh", width: "100%" }}>
      {isProcessInsp === 0 ? (
        <>

          <ProcessInspectionTitle
            setIsAddButton={setIsAddButton}
            setEditeData={setEditeData}
            setOpen={setOpen}
          />
          {/* </AccordionSummary>
            <AccordionDetails> */}

          <Grid
            container
            spacing={2}
            padding={2}
            style={{ marginTop: "-40px" }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              md={1.3}
              lg={1.3}
              xl={1.3}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <TextField
                fullWidth
                id="Jobcard numbers"
                placeholder="Jobcard number"
                variant="outlined"
                style={{ color: "#000000" }}
                size="small"
                onBlur={handleBlur}
                value={jobcardno}
                onChange={(e) => setJobcardNo(e.target.value)}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={1.3}
              lg={1.3}
              xl={1.3}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Machine Id
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  required
                  size="small"
                  value={machineName}
                  onChange={(e) => setMachineName(e.target.value)}
                  label="Machine Id"
                >
                  {machineIdList.map((data) => (
                    <MenuItem key={data?.id} value={data?.machineName}>
                      {data?.machineName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={1.3} lg={1.3} xl={1.3}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Shift</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Section"
                  required
                  size="small"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                >
                  <MenuItem value={""}>None</MenuItem>
                  <MenuItem value={1}>Shift 1</MenuItem>
                  <MenuItem value={2}>Shift 2</MenuItem>
                  <MenuItem value={3}>shift 3</MenuItem>
                  <MenuItem value={4}>General</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={1.3}
              lg={1.3}
              xl={1.3}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <FormControl fullWidth /*style={{ marginRight: "40px" }}*/>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  size="small"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value={"All"}>All</MenuItem>
                  <MenuItem value={"Pending"}>Pending</MenuItem>
                  <MenuItem value={"InProcess"}>InProcess</MenuItem>
                  <MenuItem value={"Completed"}>Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={1.3}
              lg={1.3}
              xl={1.3}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <FormControl fullWidth /*style={{ marginRight: "40px" }}*/>
                <InputLabel id="demo-simple-select-label">Thickness</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  size="small"
                  value={selectedThickness}
                  onChange={(e) => setSelectedThickness(e.target.value)}
                  label="Thickness"
                >
                  <MenuItem value={"None"}>None</MenuItem>
                  {thicknessList.map((data) => (
                    <MenuItem key={data?.id} value={data?.thickness}>
                      {data?.thickness}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={1.3}
              lg={1.3}
              xl={1.3}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <TextField
                fullWidth
                id="Date"
                placeholder="Date"
                type="date"
                variant="outlined"
                size="small"
                value={fromData}
                // disabled={selectedValue === "JOBCARD" ? true : false}
                style={{ color: "#000000" /* marginRight: "10px" */ }}
                onChange={handleFromDateChange}
                inputProps={{
                  min: fyFrom,
                  max: fyTo,
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={1.3}
              lg={1.3}
              xl={1.3}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <TextField
                fullWidth
                id="Date"
                placeholder="Date"
                type="date"
                variant="outlined"
                size="small"
                style={{ color: "#000000" }}
                value={toDate}
                onChange={handleToDateChange}
                inputProps={{
                  min: fyFrom,
                  max: fyTo,
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={1.3}
              lg={1.3}
              xl={1.3}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <Button
                variant="contained"
                style={{
                  width: "250px",
                  height: "40px",
                  background: "#002D68",
                  color: "white",
                  /*marginLeft: "20px",*/
                }}
                onClick={() => {
                  setLoading(true);
                  Addjobcardno(
                    {
                      jcNo: jobcardno,
                      machineName: machineName,
                      from: formattedDate,
                      to: formattedDate,
                    },

                    jobcardhandleSuccess,
                    jobcardhandleException
                  );
                }}
              >
                Today
              </Button>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={1.3}
              lg={1.3}
              xl={1.3}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <Button
                variant="contained"
                style={{
                  width: "250px",
                  height: "40px",
                  background: "#002D68",
                  color: "white",
                  /*marginLeft: "20px",*/
                }}
                onClick={() => {
                  setGridLoading(true);
                  setSubmitLoading(true);
                  Addjobcardno(
                    {
                      jcNo: jobcardno,
                      machineName: machineName,
                      shift: shift,
                      thickness:
                        selectedThickness === "None" ? "" : selectedThickness,
                      status: selectedStatus,
                      from: fromData,
                      to: toDate,
                    },

                    jobcardhandleSuccess,
                    jobcardhandleException
                  );
                }}
              >
                {submitloading ? (
                  <CircularProgress size={24} style={{ color: 'white' }} />
                ) : (
                  "Submit"
                )}
              </Button>
            </Grid>
          </Grid>
          {/* </AccordionDetails>
          </Accordion> */}
          <Grid item xs={12} sm={12} md={12} lg={12} spacing={2} padding={2}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {/* Card for the left grid */}
              <Card
                style={{
                  boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                  borderRadius: "10px",
                  width: "100%",
                  height: "100%",
                }}
              >
                <CardContent>
                  <DataGrid
                    apiRef={apiRef}
                    rows={rowsData}
                    columns={columns2}
                    loading={isLoading}
                    filterModel={filterModel} // Apply the saved filter model
                    onFilterModelChange={(newModel) => setFilterModel(newModel)} // Update state when filters change
                    // onFilterModelChange={handleFilterChange}

                    hideFooterPagination={false}
                    style={{
                      border: "none",
                      fontWeight: "bold",
                      // minWidth: '50%',
                      height: "65vh",
                      fontFamily: "Arial",
                    }}
                    sx={{
                      "& .super-app-theme--header": {
                        WebkitTextStrokeWidth: "0.6px",
                      },
                      "& .MuiDataGrid-cell": {
                        border: "1px solid #969696",
                      },
                      "& .MuiDataGrid-columnHeader": {
                        border: "1px solid #969696",
                      },
                      "& .super-app-theme--header": {
                        backgroundColor: "#93bce6",
                        color: "#1c1919",
                      },
                      // "& .MuiDataGrid-cell--highlighted": {
                      //   border: '1px solid red'
                      // },
                    }}
                    getRowClassName={(params) => {
                      // // Apply the class for the highlighted row
                      // if (params.id === highlightedRowId) {
                      //   return "MuiDataGrid-cell--highlighted"; // Apply the highlight class to the row
                      // }

                      const status = params.row.statusDisplay;
                      if (status === "R") {
                        return "MuiDataGrid-cell--red";
                      }
                      if (status === "G") {
                        return "MuiDataGrid-cell--green";
                      }
                      if (status === "Y") {
                        return "MuiDataGrid-cell--yellow";
                      }


                      return ""; // Return default class if index is not found
                    }}
                    rowHeight={40}
                    columnHeaderHeight={40}
                  />

                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', columnGap: '50px' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                        <div
                          style={{ width: '20px', height: '20px', backgroundColor: '#8be78b', cursor: 'pointer' }}
                        // onClick={handleCompleteClick}
                        // onMouseEnter={(e) => (e.target.style.border = '1px solid #000000', e.target.style.borderRadius = '50px')}
                        // onMouseLeave={(e) => (e.target.style.border = 'none', e.target.style.borderRadius = '0px')}
                        ></div>
                        <Typography>Completed</Typography>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#f7e2a0', cursor: 'pointer' }} ></div>
                        <Typography>Pending</Typography>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#FFA7A7', cursor: 'pointer' }} ></div>
                        <Typography>Incomplete</Typography>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: '#799EFF', cursor: 'pointer' }} ></div>
                        <Typography>Awaiting for Vendor Process</Typography>
                      </div>
                    </div>

                    {/* <div>
                                    <Typography style={{ fontWeight: 'bold' }}>Total Work Planned : {totalWorkPlanned} Min</Typography>
                                </div> */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Grid>
        </>
      ) : isProcessInsp === 1 ? (

        <InProcessFPIResult
          setIsProcessInsp={setIsProcessInsp}
          isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
          selectedOptionName={selectedOptionName}
          selectedMachineId={machineName}
          isChild={isChild}
          setIsChild={setIsChild}
          scrollToRow={scrollToRow}
          selectedRowId={selectedRowId}
        />

      ) : isProcessInsp === 2 ? (
        // <InProcessIn
        <InProcessFPIResult
          setIsProcessInsp={setIsProcessInsp}
          isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
          selectedOptionName={selectedOptionName}
          selectedMachineId={machineName}
          isChild={isChild}
          setIsChild={setIsChild}
          scrollToRow={scrollToRow}
          selectedRowId={selectedRowId}
        />
      ) : isProcessInsp === 3 ? (
        // <InProcessLPIResult
        <InProcessFPIResult
          setIsProcessInsp={setIsProcessInsp}
          isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
          selectedOptionName={selectedOptionName}
          selectedMachineId={machineName}
          isChild={isChild}
          setIsChild={setIsChild}
          scrollToRow={scrollToRow}
          selectedRowId={selectedRowId}
        />
      ) : isProcessInsp === 4 ? (
        // <InProcessReworkResult
        <InProcessFPIResult
          setIsProcessInsp={setIsProcessInsp}
          isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
          selectedOptionName={selectedOptionName}
          selectedMachineId={machineName}
          isChild={isChild}
          setIsChild={setIsChild}
          scrollToRow={scrollToRow}
          selectedRowId={selectedRowId}
        />
      ) : isProcessInsp === 5 ? (
        <ProcessInspectionChild
          setSelectedRowItemCode={setSelectedRowItemCode}
          setIsProcessInsp={setIsProcessInsp}
          isSelectedData={isSelectedData}
          setIsSelectedData={setIsSelectedData}
          setIsSelectedChildData={setIsSelectedChildData}
          setSelectedOptionName={setSelectedOptionName}
          isProcessInsp={isProcessInsp}
          fromData={fromData}
          toDate={toDate}
          machineName={machineName}
          setFromDate={setFromDate}
          setToDate={setToDate}
          setIsChild={setIsChild}
          setFileTypeForView={setFileTypeForView}
          pdfOpen={pdfOpen}
          setPdfOpen={setPdfOpen}
          scrollToRow={scrollToRow}
          selectedRowId={selectedRowId}
        />
      ) : (

        <></>
      )}

      <ProcessInspectImage
        openImg={openImg}
        setOpenImg={setOpenImg}
        isSelectedData={isSelectedData}
      />

      <MultiFileViewer
        pdfOpen={pdfOpen}
        setPdfOpen={setPdfOpen}
        fileTypeForView={fileTypeForView}
        selectedRowItemCode={selectedRowItemCode}
      />

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
};

export default ProcessInspectionResult;

// import React, { useState, useEffect, useLayoutEffect } from "react";
// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   Button,
//   Card,
//   CardContent,
//   Checkbox,
//   FormControl,
//   Grid,
//   InputLabel,
//   Menu,
//   MenuItem,
//   Select,
//   TextField,
//   CircularProgress,
//   Typography,
// } from "@mui/material";
// import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
// import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
// import ProcessInspectionTitle from "./ProcessInspectionTitle";
// import {
//   GetItemVsProcessItem,
//   AddItemVsProcess,
//   Addjobcardno,
//   Processinspection,
//   ProcessInspecSearchMachine,
//   ProcessInspecGetMachine,
//   ScrapMstGetThickness,
// } from "../../ApiService/LoginPageService";
// import { useNavigate } from "react-router-dom";
// import InProcessFPIResult from "../InProcessFPI/InProcessFPIResult";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import ProcessInspectionChild from "./ProcessInspectionChild";
// import ProcessInspectImage from "../ProcessInspection/ProcessInspectImage";
// import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// import PDFViewer from "../../Utility/PDFViiewer";
// import { NpdDocDownload } from "../../ApiService/DownloadCsvReportsService";
// import MultiFileViewer from "./MultiFileViewer";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// // NEW imports for fullscreen dialog
// import Dialog from "@mui/material/Dialog";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";

// const label = { inputProps: { "aria-label": "Checkbox demo" } };

// const ProcessInspectionResult = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [submitloading, setSubmitLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [refreshData, setRefreshData] = useState(false);
//   const [isAddButton, setIsAddButton] = useState(true);
//   const [editeData, setEditeData] = useState([]);
//   const [isLoading, setGridLoading] = useState(false);
//   const [openNotification, setNotification] = useState({
//     status: false,
//     type: "error",
//     message: "",
//   });
//   const [itemList, setItemList] = useState([]);
//   const [processList, setProcessList] = useState([]);

//   //////////////////////////////////////////
//   const [shift, setShift] = useState("");
//   const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [excelModal, setExcelModal] = useState(false);
//   const [copyFromModal, setCopyFromModal] = useState(false);
//   const [selectedValue, setSelectedValue] = React.useState("JOBCARD");
//   const [jobcardno, setJobcardNo] = useState("");
//   const [machineName, setMachineName] = useState("");
//   const [fromData, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [rowsData, setRowsData] = useState([]);
//   const [isProcessInsp, setIsProcessInsp] = useState(0);
//   const [isSelectedData, setIsSelectedData] = useState([]);
//   const [isSelectedChildData, setIsSelectedChildData] = useState([]);

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [openOption, setOpenOption] = useState(false);
//   const [machineIdList, setMachineIdList] = useState([]);
//   const [selectedOptionName, setSelectedOptionName] = useState("");

//   const [openImg, setOpenImg] = useState(false);
//   const [pdfOpen, setPdfOpen] = useState(false);
//   const [fileTypeForView, setFileTypeForView] = useState("");
//   const [selectedRowItemCode, setSelectedRowItemCode] = useState("");

//   const [isChild, setIsChild] = useState(0);

//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [thicknessList, setThicknessList] = useState([]);
//   const [selectedThickness, setSelectedThickness] = useState("None");
//   const [fyFrom, setFyFrom] = useState("");
//   const [fyTo, setFyTo] = useState("");
//   // SCROLL
//   const [selectedRowId, setSelectedRowId] = useState("");
//   const apiRef = useGridApiRef();
//   const [highlightedRowId, setHighlightedRowId] = useState(null);

//   // NEW: Dialog state to open inspections without unmounting the grid
//   const [openDialog, setOpenDialog] = useState(false);
//   const [dialogComponent, setDialogComponent] = useState(null);

//   const today = new Date();

//   const day = String(today.getDate()).padStart(2, "0");
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const year = today.getFullYear();
//   const formattedDate = `${year}-${month}-${day}`;

//   const handleClickOption = (event, params) => {
//     setAnchorEl(event.currentTarget);
//     setIsSelectedData(params.row);
//     setOpenOption(true);
//   };

//   const handleCloseOption = () => {
//     setAnchorEl(null);
//     setOpenOption(false);
//   };

//   const [filterModel, setFilterModel] = useState({
//     items: [], // Store the applied filters
//     logicOperator: "and", // Ensures multiple filters work together
//   });
//   // const handleFilterChange = useCallback((newModel) => {
//   //   setFilterModel(newModel); // Directly update the model without modifying state
//   // }, []);

//   const columns2 = [
//     {
//       field: "sNo",
//       headerClassName: "super-app-theme--header",
//       headerName: (
//         <span style={{ fontWeight: "bold", fontSize: "16px" }}>SNO</span>
//       ),
//       type: "string",
//       sortable: true,
//       width: 80,
//       // flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "jcNo",
//       headerClassName: "super-app-theme--header",
//       headerName: (
//         <span style={{ fontWeight: "bold", fontSize: "16px" }}>
//           Jobcard No{" "}
//         </span>
//       ),
//       type: "string",
//       sortable: true,
//       width: 200,
//       // flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "kanbanDate",
//       headerClassName: "super-app-theme--header",
//       headerName: (
//         <span style={{ fontWeight: "bold", fontSize: "16px" }}>
//           Kanban Date
//         </span>
//       ),
//       type: "string",
//       sortable: true,
//       // width: 120,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "itemCode",
//       headerClassName: "super-app-theme--header",
//       headerName: (
//         <span style={{ fontWeight: "bold", fontSize: "16px" }}>Item Code</span>
//       ),
//       type: "string",
//       sortable: true,
//       width: 280,
//       // flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "Qty",
//       headerClassName: "super-app-theme--header",
//       headerName: (
//         <span style={{ fontWeight: "bold", fontSize: "16px" }}>Qty </span>
//       ),
//       type: "string",
//       sortable: true,
//       width: 60,
//       // flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "qltInspecType",
//       headerClassName: "super-app-theme--header",
//       headerName: (
//         <span style={{ fontWeight: "bold", fontSize: "16px" }}>
//           Inspection Type{" "}
//         </span>
//       ),
//       type: "string",
//       sortable: true,
//       // width: 200,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "completed",
//       headerClassName: "super-app-theme--header",
//       headerName: (
//         <span style={{ fontWeight: "bold", fontSize: "16px" }}>Completed </span>
//       ),
//       type: "string",
//       sortable: true,
//       width: 80,
//       // flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },

//     {
//       field: "rework",
//       headerClassName: "super-app-theme--header",
//       headerName: (
//         <span style={{ fontWeight: "bold", fontSize: "16px" }}>Rework</span>
//       ),
//       type: "string",
//       sortable: true,
//       width: 80,
//       // flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "scrap",
//       headerClassName: "super-app-theme--header",
//       headerName: (
//         <span style={{ fontWeight: "bold", fontSize: "16px" }}>Scrap</span>
//       ),
//       type: "string",
//       sortable: true,
//       // width: 80,
//       width: 100,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "actions",
//       type: "actions",
//       headerClassName: "super-app-theme--header",
//       headerName: (
//         <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
//       ),
//       // width: 200,
//       // flex: 1,
//       width: 100,
//       renderCell: (params) => [
//         <div>
//           {rowsData?.qltInspecType !== "Complete" ? (
//             <>
//               <Button
//                 id="demo-positioned-button"
//                 aria-controls={openOption ? "demo-positioned-menu" : undefined}
//                 aria-haspopup="true"
//                 aria-expanded={openOption ? "true" : undefined}
//                 onClick={(event) => {
//                   handleClickOption(event, params);
//                   setSelectedRowId(params.row.id);
//                 }}
//               >
//                 <span
//                   style={{
//                     fontWeight: "bold",
//                     fontSize: "14px",
//                     minWidth: "250px",
//                   }}
//                 >
//                   Options
//                 </span>
//               </Button>
//               <Menu
//                 id="demo-positioned-menu"
//                 aria-labelledby="demo-positioned-button"
//                 anchorEl={anchorEl}
//                 open={openOption}
//                 onClose={handleCloseOption}
//                 anchorOrigin={{
//                   vertical: "top",
//                   horizontal: "left",
//                 }}
//                 transformOrigin={{
//                   vertical: "top",
//                   horizontal: "left",
//                 }}
//               >
//                 {/* Modified: open dialog instead of setIsProcessInsp */}
//                 <MenuItem
//                   style={{
//                     fontWeight: "bold",
//                     fontSize: "16px",
//                     minWidth: "150px",
//                   }}
//                   onClick={() => {
//                     // open FPI in fullscreen dialog
//                     openFPI(params.row);
//                     setOpenOption(false);
//                   }}
//                 >
//                   FPI
//                 </MenuItem>
//                 <MenuItem
//                   style={{
//                     fontWeight: "bold",
//                     fontSize: "16px",
//                     minWidth: "150px",
//                   }}
//                   onClick={() => {
//                     // open Observation in dialog
//                     openObservation(params.row);
//                     setOpenOption(false);
//                   }}
//                 >
//                   Observation
//                 </MenuItem>
//                 <MenuItem
//                   style={{
//                     fontWeight: "bold",
//                     fontSize: "16px",
//                     minWidth: "150px",
//                   }}
//                   onClick={() => {
//                     // open LPI in dialog
//                     openLPI(params.row);
//                     setOpenOption(false);
//                   }}
//                 >
//                   LPI
//                 </MenuItem>
//                 <MenuItem
//                   style={{
//                     fontWeight: "bold",
//                     fontSize: "16px",
//                     minWidth: "150px",
//                   }}
//                   onClick={() => {
//                     // open Rework in dialog
//                     openRework(params.row);
//                     setOpenOption(false);
//                   }}
//                 >
//                   Rework
//                 </MenuItem>
//               </Menu>
//             </>
//           ) : (
//             <>
//               <VisibilityIcon
//                 onClick={() => {
//                   setIsProcessInsp(1);
//                   setIsSelectedData(params.row);
//                 }}
//               />
//             </>
//           )}
//         </div>,
//       ],
//     },
//     {
//       field: "actions2",
//       type: "actions",
//       headerClassName: "super-app-theme--header",
//       headerName: (
//         <span style={{ fontWeight: "bold", fontSize: "16px" }}>Child</span>
//       ),
//       width: 90,
//       // flex: 1,
//       renderCell: (params) => [
//         <div>
//           <Button
//             onClick={() => {
//               // open child in dialog instead of switching main view
//               openChild(params.row);
//               // keep track of selected row id
//               setSelectedRowId(params.row.id);
//             }}
//           >
//             Child{" "}
//           </Button>
//         </div>,
//       ],
//     },
//     {
//       field: "actions3",
//       type: "actions",
//       headerClassName: "super-app-theme--header",
//       // flex: 1,
//       width: 70,

//       headerName: (
//         <span style={{ fontWeight: "bold", fontSize: "16px" }}>Images</span>
//       ),
//       cellClassName: "actions",
//       disableClickEventBubbling: true,
//       getActions: (params) => [<ViewdData selectedRow={params.row} />],
//     },
//   ];

//   // Helper functions to open dialogs (must be declared before use in menu)
//   const openFPI = (row) => {
//     setIsSelectedData(row);
//     setSelectedRowId(row?.id);
//     setDialogComponent(
//       <InProcessFPIResult
//         setIsProcessInsp={setIsProcessInsp}
//         isSelectedData={row}
//         selectedOptionName={selectedOptionName}
//         selectedMachineId={machineName}
//         isChild={isChild}
//         setIsChild={setIsChild}
//         scrollToRow={scrollToRow}
//         selectedRowId={row?.id}
//         onClose={() => setOpenDialog(false)}
//       />
//     );
//     setOpenDialog(true);
//   };

//   // If your Observation is same component or a different one, replace accordingly.
//   // As per your mapping, Observation has its own component name - but if it uses same,
//   // you can import and use that component. Here I assume InProcessFPIResult is different.
//   const openObservation = (row) => {
//     // If you have a separate component InProcessObservationResult import and use it here.
//     // For now we'll reuse InProcessFPIResult only if Observation component not available.
//     setIsSelectedData(row);
//     setSelectedRowId(row?.id);
//     setDialogComponent(
//       <InProcessFPIResult
//         setIsProcessInsp={setIsProcessInsp}
//         isSelectedData={row}
//         selectedOptionName={selectedOptionName}
//         selectedMachineId={machineName}
//         isChild={isChild}
//         setIsChild={setIsChild}
//         scrollToRow={scrollToRow}
//         selectedRowId={row?.id}
//         onClose={() => setOpenDialog(false)}
//       />
//     );
//     setOpenDialog(true);
//   };

//   const openLPI = (row) => {
//     setIsSelectedData(row);
//     setSelectedRowId(row?.id);
//     setDialogComponent(
//       <InProcessFPIResult
//         setIsProcessInsp={setIsProcessInsp}
//         isSelectedData={row}
//         selectedOptionName={selectedOptionName}
//         selectedMachineId={machineName}
//         isChild={isChild}
//         setIsChild={setIsChild}
//         scrollToRow={scrollToRow}
//         selectedRowId={row?.id}
//         onClose={() => setOpenDialog(false)}
//       />
//     );
//     setOpenDialog(true);
//   };

//   const openRework = (row) => {
//     setIsSelectedData(row);
//     setSelectedRowId(row?.id);
//     setDialogComponent(
//       <InProcessFPIResult
//         setIsProcessInsp={setIsProcessInsp}
//         isSelectedData={row}
//         selectedOptionName={selectedOptionName}
//         selectedMachineId={machineName}
//         isChild={isChild}
//         setIsChild={setIsChild}
//         scrollToRow={scrollToRow}
//         selectedRowId={row?.id}
//         onClose={() => setOpenDialog(false)}
//       />
//     );
//     setOpenDialog(true);
//   };

//   const openChild = (row) => {
//     setIsSelectedData(row);
//     setSelectedRowId(row?.id);
//     setDialogComponent(
//       <ProcessInspectionChild
//         setSelectedRowItemCode={setSelectedRowItemCode}
//         setIsProcessInsp={setIsProcessInsp}
//         isSelectedData={row}
//         setIsSelectedData={setIsSelectedData}
//         setIsSelectedChildData={setIsSelectedChildData}
//         setSelectedOptionName={setSelectedOptionName}
//         isProcessInsp={isProcessInsp}
//         fromData={fromData}
//         toDate={toDate}
//         machineName={machineName}
//         setFromDate={setFromDate}
//         setToDate={setToDate}
//         setIsChild={setIsChild}
//         setFileTypeForView={setFileTypeForView}
//         pdfOpen={pdfOpen}
//         setPdfOpen={setPdfOpen}
//         scrollToRow={scrollToRow}
//         selectedRowId={row?.id}
//         onClose={() => setOpenDialog(false)}
//       />
//     );
//     setOpenDialog(true);
//   };

//   function ViewdData(props) {
//     return (
//       <RemoveRedEyeIcon
//         onClick={() => {
//           setPdfOpen(true);
//           setFileTypeForView(props.selectedRow?.npdFile || "");
//           setSelectedRowItemCode(props.selectedRow?.itemCode || "");
//         }}
//         style={{
//           color: "#002D68",
//           cursor: "pointer",
//         }}
//       />
//     );
//   }

//   const DownloadSuccess = () => { };

//   const DownloadException = () => { };

//   useEffect(() => {
//     GetItemVsProcessItem(
//       handleItemVsProcessItemSucessShow,
//       handleItemVsProcessItemExceptionShow
//     );
//     ProcessInspecGetMachine(
//       handleProcessInspecGetMachineSuccess,
//       handleProcessInspecGetMachineException
//     );
//     ScrapMstGetThickness(handleThicknessSuccess, handleThicknessException);
//   }, [refreshData]);

//   const handleThicknessSuccess = (dataObject) => {
//     setThicknessList(dataObject.data);
//   };
//   const handleThicknessException = () => { };

//   const handleProcessInspecGetMachineSuccess = (dataObject) => {
//     setMachineIdList(dataObject?.data || []);
//     console.log("handleProjectShow", dataObject?.data);
//   };

//   const handleProcessInspecGetMachineException = () => { };

//   // GET ITEM DROPDOWN
//   const handleItemVsProcessItemSucessShow = (dataObject) => {
//     setItemList(dataObject?.data || []);
//   };
//   const handleItemVsProcessItemExceptionShow = (
//     errorObject,
//     errorMessage
//   ) => { };

//   const handleChildClick = (params) => {
//     setIsProcessInsp(5);
//     setIsSelectedData(params.row);
//     setIsChild(1); // Set isChild to 1 to show the Typography component
//   };

//   // GET PROCESS DATAGRID PROCESS

//   const handleClose = () => {
//     setNotification({
//       status: false,
//       type: "",
//       message: "",
//     });
//   };

//   const handleBlur = (e) => {
//     const jobvcardnoValue = e.target.value.trim();
//   };

//   const jobcardhandleSuccess = (dataObject) => {
//     // Store dataObject in local storage
//     setLoading(false);
//     setSubmitLoading(false);
//     setGridLoading(false);
//     localStorage.setItem("dataObject", JSON.stringify(dataObject));

//     // Store the API name 'Addjobcardno' in local storage
//     localStorage.setItem("apiName", "Addjobcardno");

//     setRowsData(dataObject?.data || []);

//     setNotification({
//       status: true,
//       type: "success",
//       message: dataObject.message,
//     });
//     setTimeout(() => {
//       // ClearData();
//       handleClose();
//     }, 2000);
//   };

//   const jobcardhandleException = (errorObject, errorMessage) => {
//     setGridLoading(false);
//     setSubmitLoading(false);
//     setLoading(false);
//     localStorage.setItem("errorMessage", JSON.stringify(errorMessage));
//     setNotification({
//       status: true,
//       type: "error",
//       message: errorMessage,
//     });
//     setTimeout(() => { }, 2000);

//     // Retrieve errorMessage from local storage
//     const storedErrorMessage = localStorage.getItem("errorMessage");
//     const retrievedErrorMessage = storedErrorMessage
//       ? JSON.parse(storedErrorMessage)
//       : null;
//   };

//   // SCROLL
//   const scrollToRow = (rowId) => {
//     setTimeout(() => {
//       const rowIndex = rowsData.findIndex((row) => row.id === rowId);
//       if (rowIndex !== -1) {
//         apiRef.current.scrollToIndexes({ rowIndex });
//         setHighlightedRowId(rowId); // Set the highlighted row
//       }
//     }, 500);
//   };

//   const [expanded, setExpanded] = useState(false); // State to track if accordion is open
//   const handleAccordionSummaryClick = () => {
//     setExpanded((prevExpanded) => !prevExpanded); // Toggle the accordion state only when summary is clicked
//   };
//   const handleHover = () => {
//     setExpanded(true);
//   };

//   const handleMouseLeave = () => {
//     setExpanded(false);
//   };

//   const parseDate = (str) => {
//     const [day, month, year] = str.split("-");
//     return new Date(`${year}-${month}-${day}`);
//   };

//   // Helper: Format Date to "yyyy-MM-dd" (for <input type="date" />)
//   const formatDateForInput = (date) => {
//     return date.toISOString().split("T")[0];
//   };

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("userDetails")) || {};
//     if (stored.fyFrom && stored.fyTo) {
//       const from = parseDate(stored.fyFrom);
//       const to = parseDate(stored.fyTo);
//       setFyFrom(formatDateForInput(from));
//       setFyTo(formatDateForInput(to));
//     }
//   }, []);

//   const isValidDateInRange = (value) => {
//     const selected = new Date(value);
//     const min = new Date(fyFrom);
//     const max = new Date(fyTo);
//     return selected >= min && selected <= max;
//   };

//   const handleFromDateChange = (e) => {
//     const value = e.target.value;
//     if (isValidDateInRange(value)) {
//       setFromDate(value);
//       setNotification({ status: false, type: "", message: "" });
//     } else {
//       setNotification({
//         status: true,
//         type: "error",
//         message: "Please select a valid From-Date",
//       });
//     }
//   };

//   const handleToDateChange = (e) => {
//     const value = e.target.value;
//     if (isValidDateInRange(value)) {
//       setToDate(value);
//       setNotification({ status: false, type: "", message: "" });
//     } else {
//       setNotification({
//         status: true,
//         type: "error",
//         message: "Please select a valid To-Date",
//       });
//     }
//   };

//   return (
//     <div style={{ height: "60vh", width: "100%" }}>
//       {isProcessInsp === 0 ? (
//         <>
//           <ProcessInspectionTitle
//             setIsAddButton={setIsAddButton}
//             setEditeData={setEditeData}
//             setOpen={setOpen}
//           />

//           <Grid
//             container
//             spacing={2}
//             padding={2}
//             style={{ marginTop: "-40px" }}
//           >
//             <Grid
//               item
//               xs={12}
//               sm={12}
//               md={1.3}
//               lg={1.3}
//               xl={1.3}
//               style={{ display: "flex", flexDirection: "row" }}
//             >
//               <TextField
//                 fullWidth
//                 id="Jobcard numbers"
//                 placeholder="Jobcard number"
//                 variant="outlined"
//                 style={{ color: "#000000" }}
//                 size="small"
//                 onBlur={handleBlur}
//                 value={jobcardno}
//                 onChange={(e) => setJobcardNo(e.target.value)}
//               />
//             </Grid>
//             <Grid
//               item
//               xs={12}
//               sm={12}
//               md={1.3}
//               lg={1.3}
//               xl={1.3}
//               style={{ display: "flex", flexDirection: "row" }}
//             >
//               <FormControl fullWidth>
//                 <InputLabel id="demo-simple-select-label">
//                   Machine Id
//                 </InputLabel>
//                 <Select
//                   labelId="demo-simple-select-label"
//                   id="demo-simple-select"
//                   required
//                   size="small"
//                   value={machineName}
//                   onChange={(e) => setMachineName(e.target.value)}
//                   label="Machine Id"
//                 >
//                   {machineIdList.map((data) => (
//                     <MenuItem key={data?.id} value={data?.machineName}>
//                       {data?.machineName}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid item xs={12} sm={12} md={1.3} lg={1.3} xl={1.3}>
//               <FormControl fullWidth>
//                 <InputLabel id="demo-simple-select-label">Shift</InputLabel>
//                 <Select
//                   labelId="demo-simple-select-label"
//                   id="demo-simple-select"
//                   label="Section"
//                   required
//                   size="small"
//                   value={shift}
//                   onChange={(e) => setShift(e.target.value)}
//                 >
//                   <MenuItem value={""}>None</MenuItem>
//                   <MenuItem value={1}>Shift 1</MenuItem>
//                   <MenuItem value={2}>Shift 2</MenuItem>
//                   <MenuItem value={3}>shift 3</MenuItem>
//                   <MenuItem value={4}>General</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>
//             <Grid
//               item
//               xs={12}
//               sm={12}
//               md={1.3}
//               lg={1.3}
//               xl={1.3}
//               style={{ display: "flex", flexDirection: "row" }}
//             >
//               <FormControl fullWidth /*style={{ marginRight: "40px" }}*/>
//                 <InputLabel id="demo-simple-select-label">Status</InputLabel>
//                 <Select
//                   labelId="demo-simple-select-label"
//                   id="demo-simple-select"
//                   size="small"
//                   value={selectedStatus}
//                   onChange={(e) => setSelectedStatus(e.target.value)}
//                   label="Status"
//                 >
//                   <MenuItem value={"All"}>All</MenuItem>
//                   <MenuItem value={"Pending"}>Pending</MenuItem>
//                   <MenuItem value={"InProcess"}>InProcess</MenuItem>
//                   <MenuItem value={"Completed"}>Completed</MenuItem>
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid
//               item
//               xs={12}
//               sm={12}
//               md={1.3}
//               lg={1.3}
//               xl={1.3}
//               style={{ display: "flex", flexDirection: "row" }}
//             >
//               <FormControl fullWidth /*style={{ marginRight: "40px" }}*/>
//                 <InputLabel id="demo-simple-select-label">Thickness</InputLabel>
//                 <Select
//                   labelId="demo-simple-select-label"
//                   id="demo-simple-select"
//                   size="small"
//                   value={selectedThickness}
//                   onChange={(e) => setSelectedThickness(e.target.value)}
//                   label="Thickness"
//                 >
//                   <MenuItem value={"None"}>None</MenuItem>
//                   {thicknessList.map((data) => (
//                     <MenuItem key={data?.id} value={data?.thickness}>
//                       {data?.thickness}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Grid>

//             <Grid
//               item
//               xs={12}
//               sm={12}
//               md={1.3}
//               lg={1.3}
//               xl={1.3}
//               style={{ display: "flex", flexDirection: "row" }}
//             >
//               <TextField
//                 fullWidth
//                 id="Date"
//                 placeholder="Date"
//                 type="date"
//                 variant="outlined"
//                 size="small"
//                 value={fromData}
//                 // disabled={selectedValue === "JOBCARD" ? true : false}
//                 style={{ color: "#000000" /* marginRight: "10px" */ }}
//                 onChange={handleFromDateChange}
//                 inputProps={{
//                   min: fyFrom,
//                   max: fyTo,
//                 }}
//               />
//             </Grid>
//             <Grid
//               item
//               xs={12}
//               sm={12}
//               md={1.3}
//               lg={1.3}
//               xl={1.3}
//               style={{ display: "flex", flexDirection: "row" }}
//             >
//               <TextField
//                 fullWidth
//                 id="Date"
//                 placeholder="Date"
//                 type="date"
//                 variant="outlined"
//                 size="small"
//                 style={{ color: "#000000" }}
//                 value={toDate}
//                 onChange={handleToDateChange}
//                 inputProps={{
//                   min: fyFrom,
//                   max: fyTo,
//                 }}
//               />
//             </Grid>
//             <Grid
//               item
//               xs={12}
//               sm={12}
//               md={1.3}
//               lg={1.3}
//               xl={1.3}
//               style={{ display: "flex", flexDirection: "row" }}
//             >
//               <Button
//                 variant="contained"
//                 style={{
//                   width: "250px",
//                   height: "40px",
//                   background: "#002D68",
//                   color: "white",
//                   /*marginLeft: "20px",*/
//                 }}
//                 onClick={() => {
//                   setLoading(true);
//                   Addjobcardno(
//                     {
//                       jcNo: jobcardno,
//                       machineName: machineName,
//                       from: formattedDate,
//                       to: formattedDate,
//                     },

//                     jobcardhandleSuccess,
//                     jobcardhandleException
//                   );
//                 }}
//               >
//                 Today
//               </Button>
//             </Grid>

//             <Grid
//               item
//               xs={12}
//               sm={12}
//               md={1.3}
//               lg={1.3}
//               xl={1.3}
//               style={{ display: "flex", flexDirection: "row" }}
//             >
//               <Button
//                 variant="contained"
//                 style={{
//                   width: "250px",
//                   height: "40px",
//                   background: "#002D68",
//                   color: "white",
//                   /*marginLeft: "20px",*/
//                 }}
//                 onClick={() => {
//                   setGridLoading(true);
//                   setSubmitLoading(true);
//                   Addjobcardno(
//                     {
//                       jcNo: jobcardno,
//                       machineName: machineName,
//                       shift: shift,
//                       thickness:
//                         selectedThickness === "None" ? "" : selectedThickness,
//                       status: selectedStatus,
//                       from: fromData,
//                       to: toDate,
//                     },

//                     jobcardhandleSuccess,
//                     jobcardhandleException
//                   );
//                 }}
//               >
//                 {submitloading ? (
//                   <CircularProgress size={24} style={{ color: 'white' }} />
//                 ) : (
//                   "Submit"
//                 )}
//               </Button>
//             </Grid>
//           </Grid>
//           {/* </AccordionDetails>
//           </Accordion> */}
//           <Grid item xs={12} sm={12} md={12} lg={12} spacing={2} padding={2}>
//             <div style={{ display: "flex", justifyContent: "space-around" }}>
//               {/* Card for the left grid */}
//               <Card
//                 style={{
//                   boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
//                   borderRadius: "10px",
//                   width: "100%",
//                   height: "100%",
//                 }}
//               >
//                 <CardContent>
//                   <DataGrid
//                     apiRef={apiRef}
//                     rows={rowsData}
//                     columns={columns2}
//                     loading={isLoading}
//                     filterModel={filterModel} // Apply the saved filter model
//                     onFilterModelChange={(newModel) => setFilterModel(newModel)} // Update state when filters change
//                     // onFilterModelChange={handleFilterChange}

//                     hideFooterPagination={false}
//                     style={{
//                       border: "none",
//                       fontWeight: "bold",
//                       // minWidth: '50%',
//                       height: "65vh",
//                       fontFamily: "Arial",
//                     }}
//                     sx={{
//                       "& .super-app-theme--header": {
//                         WebkitTextStrokeWidth: "0.6px",
//                       },
//                       "& .MuiDataGrid-cell": {
//                         border: "1px solid #969696",
//                       },
//                       "& .MuiDataGrid-columnHeader": {
//                         border: "1px solid #969696",
//                       },
//                       "& .super-app-theme--header": {
//                         backgroundColor: "#93bce6",
//                         color: "#1c1919",
//                       },
//                       // "& .MuiDataGrid-cell--highlighted": {
//                       //   border: '1px solid red'
//                       // },
//                     }}
//                     getRowClassName={(params) => {
//                       // // Apply the class for the highlighted row
//                       // if (params.id === highlightedRowId) {
//                       //   return "MuiDataGrid-cell--highlighted"; // Apply the highlight class to the row
//                       // }

//                       const status = params.row.statusDisplay;
//                       if (status === "R") {
//                         return "MuiDataGrid-cell--red";
//                       }
//                       if (status === "G") {
//                         return "MuiDataGrid-cell--green";
//                       }
//                       if (status === "Y") {
//                         return "MuiDataGrid-cell--yellow";
//                       }


//                       return ""; // Return default class if index is not found
//                     }}
//                     rowHeight={40}
//                     columnHeaderHeight={40}
//                   />

//                   <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
//                     <div style={{ display: 'flex', flexDirection: 'row', columnGap: '50px' }}>
//                       <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
//                         <div
//                           style={{ width: '20px', height: '20px', backgroundColor: '#8be78b', cursor: 'pointer' }}
//                         // onClick={handleCompleteClick}
//                         // onMouseEnter={(e) => (e.target.style.border = '1px solid #000000', e.target.style.borderRadius = '50px')}
//                         // onMouseLeave={(e) => (e.target.style.border = 'none', e.target.style.borderRadius = '0px')}
//                         ></div>
//                         <Typography>Completed</Typography>
//                       </div>
//                       <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
//                         <div style={{ width: '20px', height: '20px', backgroundColor: '#f7e2a0', cursor: 'pointer' }} ></div>
//                         <Typography>Pending</Typography>
//                       </div>
//                       <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
//                         <div style={{ width: '20px', height: '20px', backgroundColor: '#FFA7A7', cursor: 'pointer' }} ></div>
//                         <Typography>Incomplete</Typography>
//                       </div>
//                       <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
//                         <div style={{ width: '20px', height: '20px', backgroundColor: '#799EFF', cursor: 'pointer' }} ></div>
//                         <Typography>Awaiting for Vendor Process</Typography>
//                       </div>
//                     </div>

//                     {/* <div>
//                                     <Typography style={{ fontWeight: 'bold' }}>Total Work Planned : {totalWorkPlanned} Min</Typography>
//                                 </div> */}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </Grid>
//         </>
//       ) : isProcessInsp === 1 ? (
//         <InProcessFPIResult
//           setIsProcessInsp={setIsProcessInsp}
//           isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
//           selectedOptionName={selectedOptionName}
//           selectedMachineId={machineName}
//           isChild={isChild}
//           setIsChild={setIsChild}
//           scrollToRow={scrollToRow}
//           selectedRowId={selectedRowId}
//         />
//       ) : isProcessInsp === 2 ? (
//         // <InProcessIn
//         <InProcessFPIResult
//           setIsProcessInsp={setIsProcessInsp}
//           isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
//           selectedOptionName={selectedOptionName}
//           selectedMachineId={machineName}
//           isChild={isChild}
//           setIsChild={setIsChild}
//           scrollToRow={scrollToRow}
//           selectedRowId={selectedRowId}
//         />
//       ) : isProcessInsp === 3 ? (
//         // <InProcessLPIResult
//         <InProcessFPIResult
//           setIsProcessInsp={setIsProcessInsp}
//           isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
//           selectedOptionName={selectedOptionName}
//           selectedMachineId={machineName}
//           isChild={isChild}
//           setIsChild={setIsChild}
//           scrollToRow={scrollToRow}
//           selectedRowId={selectedRowId}
//         />
//       ) : isProcessInsp === 4 ? (
//         // <InProcessReworkResult
//         <InProcessFPIResult
//           setIsProcessInsp={setIsProcessInsp}
//           isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
//           selectedOptionName={selectedOptionName}
//           selectedMachineId={machineName}
//           isChild={isChild}
//           setIsChild={setIsChild}
//           scrollToRow={scrollToRow}
//           selectedRowId={selectedRowId}
//         />
//       ) : isProcessInsp === 5 ? (
//         <ProcessInspectionChild
//           setSelectedRowItemCode={setSelectedRowItemCode}
//           setIsProcessInsp={setIsProcessInsp}
//           isSelectedData={isSelectedData}
//           setIsSelectedData={setIsSelectedData}
//           setIsSelectedChildData={setIsSelectedChildData}
//           setSelectedOptionName={setSelectedOptionName}
//           isProcessInsp={isProcessInsp}
//           fromData={fromData}
//           toDate={toDate}
//           machineName={machineName}
//           setFromDate={setFromDate}
//           setToDate={setToDate}
//           setIsChild={setIsChild}
//           setFileTypeForView={setFileTypeForView}
//           pdfOpen={pdfOpen}
//           setPdfOpen={setPdfOpen}
//           scrollToRow={scrollToRow}
//           selectedRowId={selectedRowId}
//         />
//       ) : (
//         <></>
//       )}

//       {/* FULLSCREEN DIALOG: renders inspection components without unmounting DataGrid */}
//       <Dialog fullScreen open={openDialog} onClose={() => setOpenDialog(false)}>
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "flex-end",
//             padding: "12px",
//             background: "#f5f5f5",
//           }}
//         >
//           <IconButton onClick={() => setOpenDialog(false)}>
//             <CloseIcon style={{ fontSize: 30 }} />
//           </IconButton>
//         </div>

//         <div style={{ height: "100%", overflow: "auto" }}>
//           {dialogComponent}
//         </div>
//       </Dialog>

//       <ProcessInspectImage
//         openImg={openImg}
//         setOpenImg={setOpenImg}
//         isSelectedData={isSelectedData}
//       />

//       <MultiFileViewer
//         pdfOpen={pdfOpen}
//         setPdfOpen={setPdfOpen}
//         fileTypeForView={fileTypeForView}
//         selectedRowItemCode={selectedRowItemCode}
//       />

//       <NotificationBar
//         handleClose={handleClose}
//         notificationContent={openNotification.message}
//         openNotification={openNotification.status}
//         type={openNotification.type}
//       />
//     </div>
//   );
// };

// export default ProcessInspectionResult;

