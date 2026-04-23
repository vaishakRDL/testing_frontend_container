import React, { useState, useEffect, useLayoutEffect, } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
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
  Typography,
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import ProcessInspectionTitle from "./InwardInspectionTitle";
import {
  GetItemVsProcessItem,
  AddItemVsProcess,
  Addjobcardno,
  Processinspection,
  ProcessInspecSearchMachine,
  ProcessInspecGetMachine,
  ScrapMstGetThickness,
  SupplyItemcode,
  SupplydnoData
} from "../../ApiService/LoginPageService";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import InWardProcessFPIResult from "../InWardProcessFPI/InWardProcessFPIResult";
import InwardInspectionChild from "./InwardInspectionChild";



const label = { inputProps: { "aria-label": "Checkbox demo" } };

const InwardInspectionResult = () => {
  const [selectedCustomerName, setSelectedCustomerName] = useState('');

  const navigate = useNavigate();
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
  const [supplyItemList, setsupplyItemList] = useState([]);
  const [supplyItemcode, setSupplyItemcode] = useState("");

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
  const [fyFrom, setFyFrom] = useState("");
    const [fyTo, setFyTo] = useState("");
  const [openImg, setOpenImg] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [fileTypeForView, setFileTypeForView] = useState("");
  const [selectedRowItemCode, setSelectedRowItemCode] = useState('');

  const [isChild, setIsChild] = useState(0);

  const [qtydata, setQtyData] = useState([]);
  console.log("112222", qtydata)
  const [thicknessList, setThicknessList] = useState([]);
  const [selectedThickness, setSelectedThickness] = useState('None');

  // SCROLL
  const [selectedRowId, setSelectedRowId] = useState('');
  const [selectedRowQTy, setSelectedRowQty] = useState('');
  const [selectedRowspCode, setSelectedRowSPCode] = useState('');
  const [selectedinwarddate, setSelectedInwardDtae] = useState('');
  const [selectedinwardpoNo, setSelectedInwardPONo] = useState('');
  const [selectedshDate, setSelectedshDate] = useState('');
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
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          SNO
        </span>
      ),
      type: "string",
      sortable: true,
      width: 80,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "spCode",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Supply Code{" "}
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
      field: "date",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Date</span>
      ),
      type: "string",
      sortable: true,
      width: 180,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "schDate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Shedule Date
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
      width: 180,
      // flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "poNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          poNo
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
      field: "accQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Qty
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
      field: "inspectionType",
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

    // {
    //   field: "reject",
    //   headerClassName: "super-app-theme--header",
    //   headerName: (
    //     <span style={{ fontWeight: "bold", fontSize: "16px" }}>Rejected</span>
    //   ),
    //   type: "string",
    //   sortable: true,
    //   maxWidth: 200,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },


    {
      field: "actions",
      type: "actions",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
      ),
      // width: 200,
      flex: 1,
      renderCell: (params) => [
        <div>
          {rowsData?.qltInspecType !== "Complete" ? (
            <>
              <Button
                id="demo-positioned-button"
                aria-controls={openOption ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openOption ? "true" : undefined}
                onClick={(event) => {
                  handleClickOption(event, params)
                  setSelectedRowId(params.row.id)
                  setSelectedRowQty(params.row.accQty)
                  setSelectedRowSPCode(params.row.spCode)
                  setSelectedInwardDtae(params.row.date)
                  setSelectedshDate(params.row.schDate)
                  setSelectedInwardPONo(params.row.poNo)
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
                  setIsProcessInsp(1);
                  setIsSelectedData(params.row);
                }}
              />
            </>
          )}
        </div>,
      ],
    },
    // {
    //   field: "actions2",
    //   type: "actions",
    //   headerClassName: "super-app-theme--header",
    //   headerName: (
    //     <span style={{ fontWeight: "bold", fontSize: "16px" }}>Child</span>
    //   ),
    //   width: 90,
    //   // flex: 1,
    //   renderCell: (params) => [
    //     <div>
    //       <Button
    //         onClick={() => {
    //           setIsProcessInsp(5);
    //           setIsSelectedData(params.row);
    //           setSelectedRowId(params.row.id)
    //         }}
    //       >
    //         Child{" "}
    //       </Button>
    //     </div>,
    //   ],
    // },
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
          // const fileName = props.selectedRow.npdFile;
          // const fileExtension = fileName.split(".").pop().toLowerCase();
          // console.log("fileExtension===>", fileExtension);
          // if (fileExtension === "xlsx" || fileExtension === "tif") {
          //   NpdDocDownload(
          //     {
          //       id: props.selectedRow.itemId,
          //       fileExtension: fileExtension !== "xlsx" ? "tif" : "xlsx",
          //     },
          //     DownloadSuccess,
          //     DownloadException
          //   );
          // } else {
          setPdfOpen(true);
          setFileTypeForView(props.selectedRow.npdFile);
          setSelectedRowItemCode(props.selectedRow.itemCode);
          // }
        }}
        style={{ color: "#002D68" }}
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
    ScrapMstGetThickness(
      handleThicknessSuccess,
      handleThicknessException
    );
  }, [refreshData]);

  const handleThicknessSuccess = (dataObject) => {
    setThicknessList(dataObject.data);
  }
  const handleThicknessException = () => { }

  const handleProcessInspecGetMachineSuccess = (dataObject) => {
    setMachineIdList(dataObject?.data || []);
    console.log("handleProjectShow", dataObject?.data)
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

  const SupplyhandleSuccess = (dataObject) => {
    // Store dataObject in local storage
    setGridLoading(false);
    // localStorage.setItem("dataObject", JSON.stringify(dataObject));

    // // Store the API name 'Addjobcardno' in local storage
    // localStorage.setItem("apiName", "Addjobcardno");

    setRowsData(dataObject?.data || []);
    // setQtyData(dataObject?.data.data?.accQty || []);
    // setRowsData(dataObject?.data || []);

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

  const SupplyhandleException = (errorObject, errorMessage) => {
    setGridLoading(false);

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
    }, 500)
  };

  const [expanded, setExpanded] = useState(false);  // State to track if accordion is open
  const handleAccordionSummaryClick = () => {
    setExpanded((prevExpanded) => !prevExpanded); // Toggle the accordion state only when summary is clicked
  };
  const handleHover = () => {
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
  };
  const handleChange = (e) => {
    SupplyItemcode({ code: e.target.value }, supplyItemItemProcessSucessShow, supplyItemProcessExceptionShow);
  }

  const supplyItemItemProcessSucessShow = (dataObject) => {
    setsupplyItemList(dataObject?.data || []);
  }
  const supplyItemProcessExceptionShow = (errorObject, errorMessage) => {
  }

  const handleSupplierSearchItemChange = (value) => {
    if (value !== null) {
      setSupplyItemcode(value.spCode);
    }
  }
  const handleSubmit = () => {
    if (!fromData || !toDate) {
      setNotification({
        status: true,
        type: "error",
        message: "Please select both From Date and To Date before submitting.",
      });
      return;
    }

    setGridLoading(true);
    SupplydnoData(
      {
        supplier: jobcardno,
        from: fromData,
        to: toDate,
      },
      SupplyhandleSuccess,
      SupplyhandleException
    );
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
          {/* <Accordion
            expanded={expanded}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
            disableGutters
            elevation={0}
            style={{ transition: 'max-height 0.2s ease-in-out', borderBottom: '1px solid #212121', padding: '4px', }}
          > */}

          {/* <AccordionSummary style={{ height: '40px' }} expandIcon={<ExpandMoreIcon />}
              onClick={handleAccordionSummaryClick}
            > */}
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
            {/* <Grid
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
            <Grid item xs={12} sm={12} md={1.3} lg={1.3} xl={1.3} >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">SHift</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Section"
                  required
                  size="small"
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                >
                  <MenuItem value={""} >None</MenuItem>
                  <MenuItem value={1} >Shift 1</MenuItem>
                  <MenuItem value={2} >Shift 2</MenuItem>
                  <MenuItem value={3} >shift 3</MenuItem>
                  <MenuItem value={4} >General</MenuItem>
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
              <FormControl fullWidth >
                <InputLabel id="demo-simple-select-label">
                  Status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  size="small"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value={'All'}>All</MenuItem>
                  <MenuItem value={'Pending'}>Pending</MenuItem>
                  <MenuItem value={'InProcess'}>InProcess</MenuItem>
                  <MenuItem value={'Completed'}>Completed</MenuItem>
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
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Thickness
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  size="small"
                  value={selectedThickness}
                  onChange={(e) => setSelectedThickness(e.target.value)}
                  label="Thickness"
                >
                  <MenuItem value={'None'}>None</MenuItem>
                  {thicknessList.map((data) => (
                    <MenuItem key={data?.id} value={data?.thickness}>
                      {data?.thickness}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}


            <Grid
              item
              xs={12}
              sm={12}
              md={3}
              lg={3}
              xl={3}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <Autocomplete
                fullWidth
                disablePortal
                id="combo-box-demo"
                value={supplyItemList.find((item) => item.spCode === supplyItemcode) || null} // Ensure matching object
                options={supplyItemList}
                size="small"
                getOptionLabel={(option) => option.spName || ""}
                sx={{
                  height: "45px", // Adjust height as needed
                  "& .MuiInputBase-root": {
                    height: "45px", // Ensure input field height matches
                  },

                }}
                renderInput={(params) =>
                  <TextField
                    {...params}
                    variant="filled"
                    label="Search Customer"
                    onChange={handleChange}
                  />}
                onChange={(event, value) => handleSupplierSearchItemChange(value)}
                style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={3}
              lg={3}
              xl={3}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <TextField
                fullWidth
                id="Date"
                placeholder=" From Date"
                type="date"
                variant="outlined"
                size="small"
                value={fromData}
                required
                style={{ color: "#000000", }}
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
              md={3}
              lg={3}
              xl={3}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <TextField
                fullWidth
                id="Date"
                placeholder="To Date"
                type="date"
                variant="outlined"
                size="small"
                required
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
                // onClick={() => {
                //   setGridLoading(true);
                //   SupplydnoData(
                //     {
                //       supplier: jobcardno,
                //       from: fromData,
                //       to: toDate,
                //     },

                //     SupplyhandleSuccess,
                //     SupplyhandleException
                //   );
                // }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
          {/* </AccordionDetails>
          </Accordion> */}
          <Grid item xs={12} sm={12} md={12} lg={12} spacing={2}
            padding={2}>
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

                    // pageSize={8}
                    // rowsPerPageOptions={[8]}
                    // disableSelectionOnClick
                    // initialState={{
                    //   ...rowsData.initialState,
                    //   pagination: { paginationModel: { pageSize: -1 } },
                    // }}
                    // pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
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

                      // // Find the index of the row within the rows array
                      // const rowIndex = rowsData.findIndex(
                      //   (row) => row.id === params.row.id
                      // );
                      // // Check if the index is valid
                      // if (rowIndex !== -1) {
                      //   console.log(" ");
                      //   return rowIndex % 2 === 0
                      //     ? "Mui-evenRow"
                      //     : "Mui-oddRow";
                      // }
                      return ""; // Return default class if index is not found
                    }}
                    rowHeight={40}
                    columnHeaderHeight={40}
                  />
                </CardContent>
              </Card>
            </div>
          </Grid>

        </>
      ) : isProcessInsp === 1 ? (
        <InWardProcessFPIResult
          selectedRowQTy={selectedRowQTy}
          selectedinwardpoNo={selectedinwardpoNo}
          selectedinwarddate={selectedinwarddate}
          selectedshDate={selectedshDate}
          selectedRowspCode={selectedRowspCode}
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
        <InWardProcessFPIResult
          selectedRowQTy={selectedRowQTy}
          selectedinwardpoNo={selectedinwardpoNo}
          selectedinwarddate={selectedinwarddate}
          selectedshDate={selectedshDate}
          selectedRowspCode={selectedRowspCode}
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
        <InWardProcessFPIResult
          selectedinwardpoNo={selectedinwardpoNo}
          selectedRowQTy={selectedRowQTy}
          selectedinwarddate={selectedinwarddate}
          selectedshDate={selectedshDate}
          selectedRowspCode={selectedRowspCode}
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
        <InWardProcessFPIResult
          selectedinwardpoNo={selectedinwardpoNo}
          selectedRowspCode={selectedRowspCode}
          selectedinwarddate={selectedinwarddate}
          selectedshDate={selectedshDate}
          selectedRowQTy={selectedRowQTy}
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
        <InwardInspectionChild
          selectedinwardpoNo={selectedinwardpoNo}
          selectedRowspCode={selectedRowspCode}
          selectedshDate={selectedshDate}
          selectedinwarddate={selectedinwarddate}
          selectedRowQTy={selectedRowQTy}
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

      {/* <ProcessInspectImage
        openImg={openImg}
        setOpenImg={setOpenImg}
        isSelectedData={isSelectedData}
      /> */}

      {/* <PDFViewer
        pdfOpen={pdfOpen}
        setPdfOpen={setPdfOpen}
        fileTypeForView={fileTypeForView}
        selectedRowItemCode={selectedRowItemCode}
      /> */}

      {/* <MultiFileViewer
        pdfOpen={pdfOpen}
        setPdfOpen={setPdfOpen}
        fileTypeForView={fileTypeForView}
        selectedRowItemCode={selectedRowItemCode}
      /> */}

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
};

export default InwardInspectionResult;
