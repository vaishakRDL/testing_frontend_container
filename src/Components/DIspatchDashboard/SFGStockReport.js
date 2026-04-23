import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "./SFGStockReport.css";
import {
  ScrapMstGetMaterial,
  MachineShowData,
  ScrapReportAnalysisReport,
  CustomerDropShowdata,
  GetSaleInvoiceReport,
  GetSaleRegisterReport,
  GetSFGStockReport,
} from "../../ApiService/LoginPageService";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import {
  SalesRegisterReportDownload,
  ScrapAnalysisReportDownload,
} from "../../ApiService/DownloadCsvReportsService";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Navigate, useNavigate } from "react-router-dom";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
const SFGStockReport = () => {
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setTodate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [rawMaterial, setRawMaterial] = useState("");
  const [rawMaterialList, setRawMaterialList] = useState([]);
  const [machinList, setMachineList] = useState([]);
  const [machine, setMachine] = useState("");
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");
  const [customerSelect, setCustomerSelect] = useState([]);
  const [customerSelectList, setCustomerSelectList] = useState([]);
  const [selectedFilterRadio, setSelectedFilterRadio] = useState("");

  const navigate = useNavigate();

  const ViewCompletedSFG = () => {
    navigate("/CompletedSFG");
  }

  const ViewSFGSummary = () => {
    navigate("/SFGSummaryReport");
  }

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    ScrapMstGetMaterial(
      handleScrapMstGetMaterialSuccess,
      handleScrapMstGetMaterialException
    );
    MachineShowData(
      handleMachineShowDataSuccess,
      handleMachineShowDataExceprion
    );
  }, []);

  const handleReportView = () => {
    setLoader(true);
    GetSFGStockReport(
      {
        from: fromDate,
        to: toDate,
        type: 0
      },
      handleGetReportSuccess,
      handleGetReportException
    );
  };

  const handleGetReportSuccess = (dataObject) => {
    setLoader(false);
    setReportData(dataObject?.data || []);
  };
  const handleGetReportException = () => {
    setLoader(false);
  };

  // HANDLE DOWNLOAD REPORT
  const handleReportDownload = () => {
    setLoader(true);
    SalesRegisterReportDownload(
      {
        customer: customerSelect,
        from: fromDate,
        to: toDate,
      },
      handleDownloadSuccess,
      handleDownloadException
    );
  };

  const handleDownloadSuccess = () => {
    setLoader(false);
    setNotification({
      status: true,
      type: "success",
      message: "Download Success",
    });
  };
  const handleDownloadException = () => {
    setLoader(false);
    setNotification({
      status: true,
      type: "error",
      message: "Failed to download",
    });
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  // MATERIAL
  const handleScrapMstGetMaterialSuccess = (dataObject) => {
    setRawMaterialList(dataObject?.data || []);
  };
  const handleScrapMstGetMaterialException = () => { };
  const options2 = rawMaterialList.map((item) => ({
    id: item?.id,
    label: item?.material,
  }));

  const handleRawMaterialChange = (selectedValue) => {
    setRawMaterial(selectedValue?.label || "");
  };

  //MACHINE
  const handleMachineShowDataSuccess = (dataObject) => {
    setMachineList(dataObject?.data || []);
  };
  const handleMachineShowDataExceprion = () => { };

  const options = machinList.map((item) => ({
    id: item?.id,
    label: item?.machineName,
  }));

  const handleAutocompleteChange = (selectedValue) => {
    setMachine(selectedValue?.id || "");
  };

  //////////////////////////////////////////////////////
  const handleChangeCustomer = (e) => {
    if (e !== null) {
      CustomerDropShowdata(
        { code: e.target.value },
        handleCustomerDropshow,
        handleCustomerDropshowException
      );
    }
  };



  const handleCustomerDropshow = (dataObject) => {
    setCustomerSelectList(dataObject?.data || []);
  };

  const handleCustomerDropshowException = (error, errorMessage) => { };

  const handleSearchItemChange = (value) => {
    if (value !== null) {
      const idArray = value.map((item) => item.id);
      console.log("idArray", idArray);
      setCustomerSelect(idArray);
    }
  };

  // MULTI SELECTION AUTOCOMPLETE
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const handleRadioChange = (event) => {
    setSelectedFilterRadio(event.target.value);

    let fromDate = new Date();
    let toDate = new Date();

    switch (event.target.value) {
      case "Today":
        fromDate = new Date();
        toDate = new Date();
        break;
      case "Yesterday":
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 1);
        toDate = new Date(fromDate);
        break;
      case "This week":
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - fromDate.getDay());
        toDate = new Date();
        break;
      case "Last week":
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - fromDate.getDay() - 7);
        toDate = new Date(fromDate);
        toDate.setDate(toDate.getDate() + 6);
        break;
      case "This month":
        fromDate = new Date();
        fromDate.setDate(1);
        toDate = new Date();
        break;
      case "Last month":
        fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 1);
        fromDate.setDate(1);
        toDate = new Date(fromDate);
        toDate.setMonth(toDate.getMonth() + 1);
        toDate.setDate(0); // Last day of the previous month
        break;
      default:
        fromDate = null;
        toDate = null; // For 'Custom' or other cases where a specific date isn't predefined
    }

    // selectedDate,selectedToDate
    setFromDate(fromDate ? fromDate.toISOString().split("T")[0] : "");
    setTodate(toDate ? toDate.toISOString().split("T")[0] : "");
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

  const arrayToWorksheet = (array) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('SFG Stock Report');

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
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Center align all data rows
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    return workbook;
  };

  const downloadExcelFile = async (workbook, filename) => {
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
  };

  const handleDownload = () => {
    // Flatten data to match the frontend table structure
    // Format data to match the table structure
    const formattedData = reportData.map((supp) => ({
      " SI No": supp.sNo,
      "Date": supp.date,
      " Kanban Date": supp.kanbanDate,
      " Shipment Date": supp.shipmentDate,
      "Item Code": supp.itemCode,
      " Item Name": supp.itemName,
      "Del User": supp.delUser,
      " Po No": supp.poNo,
      " Delivery Note No": supp.delNoteNo,
      " Inward Quantity": supp.inwardQty,
      " Outward Quantity": supp.outwardQty,
      " Total Quantity": supp.totQty,
      " QC Status": supp.qcStatus,
      " Qc Approval": supp.qc,

    })); const workbook = arrayToWorksheet(formattedData);
    downloadExcelFile(workbook, 'SFG Stock Report.xlsx');
  };


  const columns = [
    {
      field: 'sNo',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SI No</span>
      ),
      type: 'number',
      sortable: true,
      minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
    {
      field: 'date',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Date</span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
    {
      field: 'kanbanDate',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Kanban Date</span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
    {
      field: 'shipmentDate',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Shipment Date</span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
    {
      field: 'itemCode',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Code</span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 200, flex: 1, align: 'center', headerAlign: 'center'
    },
    {
      field: 'itemName',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Name</span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 300, flex: 1, align: 'center', headerAlign: 'center'
    },
    // {
    //   field: 'delReqQty',
    //   headerClassName: 'super-app-theme--header',
    //   headerName: (
    //     <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Delivery Note Requested Qty</span>
    //   ),
    //   type: 'string',
    //   sortable: true,
    //   minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    // },
    {
      field: 'delUser',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Del User</span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
    {
      field: 'poNo',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Po No</span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
    {
      field: 'invNo',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Invoice No</span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
    {
      field: 'delNoteNo',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Delivery Note No</span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
    {
      field: 'inwardQty',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Inward Quantity</span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
    {
      field: 'outwardQty',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Outward Quantity</span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
    {
      field: 'totQty',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Total Quantity</span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
    // {
    //   field: 'qcStatus',
    //   headerClassName: 'super-app-theme--header',
    //   headerName: (
    //     <span style={{ fontWeight: 'bold', fontSize: '16px' }}>QC Status</span>
    //   ),
    //   type: 'string',
    //   sortable: true,
    //   minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    // },
    {
      field: 'qcUser',
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Qc Approval By</span>
      ),
      type: 'string',
      sortable: true,
      minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
  ];
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
          SFG Stock Report
        </Typography>
      </div>
      <Card sx={{ minWidth: 275 }}>
        {loader && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
        <CardContent>
          <Grid container alignItems={"center"} spacing={2}>
            <Grid item xs={12} sm={8} md={2} lg={2}>
              <TextField
                fullWidth
                id="outlined-basic"
                type="date"
                label="From"
                variant="outlined"
                style={{ marginRight: "10px" }}
                InputLabelProps={{
                  shrink: true,
                  style: { color: "#000000", fontWeight: "bold" },
                }}
                size="small"
                value={fromDate}
                onChange={handleFromDateChange}
                inputProps={{
                  min: fyFrom,
                  max: fyTo,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={2} lg={2}>
              <TextField
                fullWidth
                id="outlined-basic"
                type="date"
                label="To"
                variant="outlined"
                style={{ marginRight: "10px" }}
                InputLabelProps={{
                  shrink: true,
                  style: { color: "#000000", fontWeight: "bold" },
                }}
                size="small"
                value={toDate}
                onChange={handleToDateChange}
                inputProps={{
                  min: fyFrom,
                  max: fyTo,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={8}>
              <div style={{ display: "flex", flexDirection: "row", height: "40px" }}>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#002D68",
                    marginRight: "15px",
                    marginTop: "2px",
                  }}
                  onClick={handleReportView}
                >
                  View
                </Button>

                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#002D68",
                    marginRight: "15px",
                    // marginLeft: "-235px",
                    width: "250px",
                    marginTop: "2px",
                  }}
                  onClick={ViewCompletedSFG}
                >
                  Completed SFG
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#002D68",
                    marginRight: "15px",
                    // marginLeft: "-235px",
                    width: "250px",
                    marginTop: "2px",
                  }}
                  onClick={handleDownload}
                >
                  Export to Excel
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#002D68",
                    marginRight: "15px",
                    // marginLeft: "-235px",
                    width: "250px",
                    marginTop: "2px",
                  }}
                  onClick={ViewSFGSummary}
                >
                  Summary Report
                </Button>
              </div>
              {/* <Button variant="contained" style={{ backgroundColor: '#002D68', marginTop: '2px' }} onClick={handleReportDownload}>Download</Button> */}
            </Grid>
            {/* <Grid item xs={12} sm={8} md={2} lg={2}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#002D68",
                  marginRight: "15px",
                  // marginLeft: "-235px",
                  marginTop: "2px",
                }}
                onClick={handleReportView}
              >
                Completed SFG Stock Report
              </Button>
            </Grid> */}
            <Grid item xs={12} sm={12} md={12} lg={12}>
              {/* {reportData.length > 0 ? */}
              <Box
                sx={{
                  // height: screenHeight - 375,
                  width: "100%",
                  overflow: "auto",
                }}
              >
                <DataGrid
                  rows={reportData}
                  columns={columns}
                  pageSize={8}
                  // loading={isLoading}
                  rowsPerPageOptions={[8]}
                  // checkboxSelection
                  disableRowSelectionOnClick
                  // onRowSelectionModelChange={handleRowSelection}
                  style={{ border: 'none', }}
                  sx={{
                    overflow: 'auto',
                    height: screenHeight - 310,
                    width: '100%',
                    '& .super-app-theme--header': {
                      WebkitTextStrokeWidth: '0.6px',
                      backgroundColor: '#93bce6',
                      color: '#1c1919'

                    },
                    '& .MuiDataGrid-cell': {
                      border: '1px solid #969696',
                    },
                    '& .MuiDataGrid-columnHeader': {
                      border: '1px solid #969696', // Add border to column headers
                    },
                  }}
                  getRowClassName={(params) => {
                    const rowIndex = reportData.findIndex(row => row.id === params.row.id);
                    if (rowIndex !== -1) {
                      return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                    }
                    return '';
                  }}
                  rowHeight={40}
                  columnHeaderHeight={40}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
};
export default SFGStockReport;
