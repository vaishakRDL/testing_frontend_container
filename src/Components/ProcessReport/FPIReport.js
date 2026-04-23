import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  CircularProgress
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { DataGrid } from "@mui/x-data-grid";
import {
  GetItemVsProcessItem,
  GetItemVsProcessProcessList,
  AddItemVsProcess,
  ProcessInspecReport,
} from "../../ApiService/LoginPageService";
import { useNavigate } from "react-router-dom";
import FPIReportTitle from "../ProcessReport/FPIReportTitle";
import Radio from "@mui/material/Radio";
import FPIModifiedReport from "../FPIModifiedReport/FPIModifiedReport";

// import FPIReportTitle from './FPIReportTitle';
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const FPIReport = ({ reportType }) => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [refreshData, setRefreshData] = useState(false);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [selectedValue, setSelectedValue] = React.useState("JOBCARD");
  const [jobcardNumber, setJobcardNumber] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [rowSet, setRowSet] = useState([]);
  const [isFpiReport, setIsFpiReport] = useState(false);
  const [slNO, setSlno] = useState('');
  const [jcId, setJcId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);
  const [itemId, setItemId] = useState('')
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");
  const columns2 = [
    {
      field: "snNo",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>SI No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "qTestNo",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>QCTest No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "date",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Date</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "jcNo",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>JC No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "itemCode",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Item Code </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "machineCode",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Machine Code </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "addedBy",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>User</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Status</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Actions",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
      ),
      sortable: true,
      maxWidth: 500,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Button
            variant="contained"
            sx={{
              marginRight: "8px",
              backgroundColor: "#002D68",
              height: "40px",
              borderRadius: "20px",
              width: "100px",
            }}
            onClick={() => {
              setIsFpiReport(true);
              setSlno(params.row.qTestNo);
              setJcId(params.row.jcId);
              setItemId(params.row.itemId);
            }}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {

  }, [refreshData]);


  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };



  const ClearData = () => {

  };

  const rows2 = [{ id: 1 /* other properties */ }];


  const buttonStyle = {
    variant: "contained",
    // color: "primary",
    component: "label",
    sx: {
      marginRight: "8px",
      backgroundColor: "#002D68",
      height: "40px",
      borderRadius: "20px",
      width: "200px",
    },
  };

  const buttonStyle1 = {
    variant: "contained",
    // color: "primary",
    component: "label",
    sx: {
      marginRight: "8px",
      backgroundColor: "#002D68",
      height: "40px",
      borderRadius: "20px",
      width: "150px",
    },
  };

  //TOGGLE RADIO SWITCH
  // const handleChange = (event) => {
  //   setSelectedValue(event.target.value);

  // };
  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);

    if (value === "JOBCARD") {
      setFromDate('');
      setToDate('');
    }

    if (value === "DATE") {
      setJobcardNumber('');
    }
  };


  const JobcardNumberHandle = (e) => {
    const jobvcardnoValue = e.target.value.trim();

    // Check if the value is present in the textbox
    if (jobvcardnoValue !== "") {

    }
  }

  const handleProcessInspecReportSuccess = (dataObject) => {
    setRowSet(dataObject?.data);
    setSubmitLoading(false);
    setLoading(false)

  }

  const handleProcessInspecReportException = () => {
    setSubmitLoading(false);
    setLoading(false)

  }

  const onSubmit = () => {
    setSubmitLoading(true);
    ProcessInspecReport({
      jcNo: jobcardNumber,
      type: reportType,
      fromDate: fromDate,
      toDate: toDate
    }, handleProcessInspecReportSuccess, handleProcessInspecReportException);
  }

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
    <div style={{ height: "100%", width: "100%" }}>
      {
        !isFpiReport ? (
          <Grid container spacing={2} padding={2}>
            <Grid item xs={12} sm={12} md={8} lg={6} xl={6} style={{ display: "flex", flexDirection: "row" }} >
              <Radio
                checked={selectedValue === "JOBCARD"}
                onChange={handleChange}
                value="JOBCARD"
                name="radio-buttons"
                inputProps={{ "aria-label": "A" }}
              />
              <TextField
                fullWidth
                id="Jobcard number"
                placeholder="Jobcard number"
                variant="outlined"
                label='JOBCARD'
                size="small"
                value={jobcardNumber}
                style={{ color: "#000000" }}
                // onBlur={JobcardNumberHandle}
                onChange={(e) => {
                  setJobcardNumber(e.target.value);
                }}
                disabled={selectedValue === "DATE" ? true : false}
              />
              <Radio
                checked={selectedValue === "DATE"}
                onChange={handleChange}
                value="DATE"

                name="radio-buttons"
                inputProps={{ "aria-label": "B" }}
              />
              {/* <TextField
                fullWidth
                id="Date"
                placeholder="Date"
                type="date"
                label='From Date'
                size="small"
                InputLabelProps={{
                  shrink: true
                }}
                variant="outlined"
                onChange={handleFromDateChange}
                inputProps={{
                  min: fyFrom,
                  max: fyTo,
                }}
                disabled={selectedValue === "JOBCARD" ? true : false}
                style={{ color: "#000000", marginRight: "10px" }}
              />
              <TextField
                fullWidth
                id="Date"
                placeholder="Date"
                type="date"
                label='To Date'
                size="small"
                onChange={handleToDateChange}
                inputProps={{
                  min: fyFrom,
                  max: fyTo,
                }}
                InputLabelProps={{
                  shrink: true
                }}
                variant="outlined"
                style={{ color: "#000000" }}
                disabled={selectedValue === "JOBCARD" ? true : false}
              /> */}
              <TextField
                fullWidth
                type="date"
                label="From Date"
                size="small"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={fromDate}                         // ✅ REQUIRED
                onChange={(e) => setFromDate(e.target.value)}
                inputProps={{
                  min: fyFrom,
                  max: fyTo,
                }}
                disabled={selectedValue === "JOBCARD"}
                sx={{ mr: 1 }}
              />

              <TextField
                fullWidth
                type="date"
                label="To Date"
                size="small"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={toDate}                           // ✅ REQUIRED
                onChange={(e) => setToDate(e.target.value)}
                inputProps={{
                  min: fyFrom,
                  max: fyTo,
                }}
                disabled={selectedValue === "JOBCARD"}
              />

            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              lg={2}
              xl={2}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}

            >
              <Button {...buttonStyle}
                onClick={() => {
                  setLoading(true);

                  ProcessInspecReport({
                    jcNo: jobcardNumber,
                    type: reportType,
                    fromDate: '',
                    toDate: ''
                  }, handleProcessInspecReportSuccess, handleProcessInspecReportException);
                }}
                disabled={loading}>
                {loading ? (
                  <CircularProgress size={24} style={{ color: 'white' }} />
                ) : (
                  "Today"
                )}              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              lg={2}
              xl={2}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button {...buttonStyle}
                onClick={onSubmit}

                disabled={submitloading} >
                {submitloading ? (
                  <CircularProgress size={24} style={{ color: 'white' }} />
                ) : (
                  "Submit"
                )}
              </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {/* Card for the left grid */}
                <Card
                  style={{
                    boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                    width: "100%",
                    height: "100%",
                    marginTop: '-5px'
                  }}
                >
                  <CardContent>
                    {/* Autocomplete for the left grid */}

                    {/* DataGrid for the left grid */}
                    <DataGrid
                      rows={rowSet}
                      columns={columns2}
                      pageSize={8}
                      rowsPerPageOptions={[8]}
                      disableSelectionOnClick
                      style={{ border: "none" }}
                      sx={{
                        overflow: "auto",
                        height: "55vh",
                        width: "100%",
                        "& .super-app-theme--header": {
                          WebkitTextStrokeWidth: "0.6px",
                          backgroundColor: '#93bce6',
                          color: '#1c1919'

                        },
                      }}
                      getRowClassName={(params) => {
                        // Find the index of the row within the rows array
                        const rowIndex = rowSet.findIndex(row => row.id === params.row.id);
                        // Check if the index is valid
                        if (rowIndex !== -1) {
                          console.log(' ');
                          return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                        }
                        return ''; // Return default class if index is not found
                      }}
                      rowHeight={40}
                      columnHeaderHeight={40}
                    />
                  </CardContent>
                </Card>
              </div>
            </Grid>
          </Grid>
        ) : (
          <FPIModifiedReport
            setIsFpiReport={setIsFpiReport}
            slNO={slNO}
            reportType={reportType}
            jcId={jcId}
            itemId={itemId}
          />
        )
      }

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
};

export default FPIReport;
