import React, { useState, useEffect, useRef } from "react";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { DataGrid } from "@mui/x-data-grid";
import {
  GetItemVsProcessItem,
  GetItemVsProcessProcessList,
  AddItemVsProcess,
  ProcessInspecReport,
  SearchInwardPo,
  InwardInspecReport,
  SearchInwardPoWithoutPo,
  WithoutPoInwardInspecReport,
  PurchaseReportSearchSupplier,
  AgainstPoUpload,
} from "../../ApiService/LoginPageService";
import { useNavigate } from "react-router-dom";
import Radio from "@mui/material/Radio";
import VisibilityIcon from '@mui/icons-material/Visibility';
import WithoutInwardInsideFpiReport from "./WithoutInwardInsideFpiReport";
import UploadFileIcon from '@mui/icons-material/UploadFile';

// import FPIReportTitle from './FPIReportTitle';
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const WithoutFPIProcessInwardReport = ({ reportType }) => {
  const [openQcDialog, setOpenQcDialog] = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState('');
  const [fileTypeForView, setFileTypeForView] = useState('');
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
  const [itemId, setItemId] = useState('');
  const [selectedRowId, setSelectedRowId] = useState('');
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);



  const fileInputRef = useRef(null);
  const [selectedUploadRow, setSelectedUploadRow] = useState(null);

  // Convert File to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Open file dialog
  const handleFileUploadClick = (row) => {
    setSelectedUploadRow(row);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle selected file
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedUploadRow) return;

    try {
      const base64File = await convertToBase64(file);

      const payload = {
        id: selectedUploadRow.poBillDtlId,
        file: base64File,
        type: "withoutPo",
      };

      // ---- Correct API Format ----
      AgainstPoUpload(
        payload,                  // no wrapper object
        AgainstExcelImportSuccess,    // success callback
        AgainstExcelTemplateException // error callback
      );


    } catch (error) {
      console.error("Error converting file:", error);
      alert("Error converting or uploading the file");
    }

    event.target.value = ""; // reset input
  };


  const AgainstExcelImportSuccess = (dataObject) => {
    WithoutPoInwardInspecReport({
      po: selectedGeneratedPo,
      from: fromDate,
      to: toDate
    }, handleProcessInspecReportSuccess, handleProcessInspecReportException);
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
  };
  const AgainstExcelTemplateException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
  };

  const columns2 = [
    {
      field: "sNo",
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
      field: "poNo",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>PB NO</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "spCode",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Supplier Code </span>
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
        <div style={{ display: "flex", justifyContent: "space-around", alignItems: 'center' }}>
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
              console.log('111111111', params)
              setSlno(params.row.snNo);
              setJcId(params.row.jcId);
              setItemId(params.row.itemId);
              setSelectedRowId(params.row.id);
            }}
          >
            View
          </Button>

          <ViewData selectedRow={params.row} />
          <Tooltip title="Upload File">
            <UploadFileIcon
              style={{ cursor: "pointer", color: "#002D68" }}
              onClick={() => handleFileUploadClick(params.row)}
            />
          </Tooltip>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

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

  const handleClosedialog = () => {
    setPdfOpen(false);
  };

  function ViewData(props) {
    return (
      <Tooltip title="View">
        <VisibilityIcon
          onClick={() => {
            // if (userPermission[0]?.deleteData === 1) {
            setFileTypeForView(props.selectedRow.qcFile);
            console.log(props.selectedRow.id);
            setPdfOpen(true);
            // }

          }
          }
          style={{ color: "#002D68" }}
        />
      </Tooltip>
    );
  }

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
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const JobcardNumberHandle = (e) => {
    const jobvcardnoValue = e.target.value.trim();

    // Check if the value is present in the textbox
    if (jobvcardnoValue !== "") {

    }
  }

  const handleProcessInspecReportSuccess = (dataObject) => {
    setRowSet(dataObject?.data);
    setSubmitLoading(false)
    setLoading(false)

  }

  const handleProcessInspecReportException = () => {
    setSubmitLoading(false)
    setLoading(false)

  }

  const onSubmit = () => {
    setSubmitLoading(true)
    WithoutPoInwardInspecReport({
      po: selectedGeneratedPo,
      from: fromDate,
      to: toDate
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

  // SERACH PO
  const [generatedWithoutPoLists, setGeneratedWithoutPoLists] = useState([]);
  const [selectedGeneratedPo, setSelectedGeneratedPo] = useState('');
  const [supplierList, setSupplierList] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState([]);


  const handleGeneratedPoSelect = (selectedValue) => {
    // if (selectedValue !== null) {
    setSelectedGeneratedPo(selectedValue?.poNo);
    //   POViewApprove({ poDigit: selectedValue.digit, prefix: selectedValue?.type }, handleActionSuccess, handleActionException);
    // }
  }
  const baseUrl = process.env.REACT_APP_API_URL;
  const urlParts = baseUrl.split('api/');
  const Url = `${urlParts[0]}${fileTypeForView}`

  // const getFileExtension = (fileType) => {
  //     const segments = fileType.split('.');
  //     if (segments.length > 1) {
  //         return segments.pop().toLowerCase();
  //     }
  //     return null;
  // };
  const handleSupplierChange = (e) => {
    PurchaseReportSearchSupplier(
      { code: e.target.value },
      handleSearchSupplierSucessShow,
      handleSearchSupplierExceptionShow
    );
  };
  const handleSearchSupplierSucessShow = (dataObject) => {
    setSupplierList(dataObject?.data || []);
  };
  const handleSearchSupplierExceptionShow = (errorObject, errorMessage) => { };

  console.log('12212==>', Url);
  const handleSupplierSelect = (value) => {
    if (value) {
      setSelectedSupplier(value.id); // single id
    } else {
      setSelectedSupplier(null);
    }
  };
  return (
    <div style={{ height: "100%", width: "100%" }}>
      {
        !isFpiReport ? (
          <Grid container spacing={2} padding={2}>
            <Grid item xs={12} sm={12} md={8} lg={6} xl={6} style={{ display: "flex", flexDirection: "row", columnGap: "10px" }} >
              {/* <Radio
                checked={selectedValue === "JOBCARD"}
                onChange={handleChange}
                value="JOBCARD"
                name="radio-buttons"
                inputProps={{ "aria-label": "A" }}
              /> */}
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={supplierList}
                fullWidth
                // value={supplierList}
                // disabled={selectedValue === "DATE" ? true : false}
                // getOptionLabel={(option) => option.poNo || supplierList}
                renderInput={(params) => <TextField {...params} label="Search Supplier" onChange={handleSupplierChange} />}
                onChange={(event, value) => handleSupplierSelect(value)}
                size="small"
                style={{ borderRadius: '5px' }}
              />
              {/* <Radio
                checked={selectedValue === "DATE"}
                onChange={handleChange}
                value="DATE"

                name="radio-buttons"
                inputProps={{ "aria-label": "B" }}
              /> */}
              <TextField
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
                // disabled={selectedValue === "JOBCARD" ? true : false}
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
              // disabled={selectedValue === "JOBCARD" ? true : false}
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
                disabled={loading}
                onClick={() => {
                  setLoading(true)
                  // ProcessInspecReport({
                  //   jcNo: jobcardNumber,
                  //   type: reportType,
                  //   fromDate: '',
                  //   toDate: ''
                  // }, handleProcessInspecReportSuccess, handleProcessInspecReportException);
                  WithoutPoInwardInspecReport({
                    po: selectedGeneratedPo,
                    from: "",
                    to: ""
                  }, handleProcessInspecReportSuccess, handleProcessInspecReportException);
                }}
              >
                {loading ? (
                  <CircularProgress size={24} style={{ color: 'white' }} />
                ) : (
                  "Today"
                )}                </Button>
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
              onClick={onSubmit}
            >
              <Button {...buttonStyle} disabled={submitloading}>
                {submitloading ? (
                  <CircularProgress size={24} style={{ color: 'white' }} />
                ) : (
                  "Submit"
                )}                </Button>
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
                        '& .MuiDataGrid-cell': {
                          border: '1px solid #969696',
                        },
                        '& .MuiDataGrid-columnHeader': {
                          border: '1px solid #969696', // Add border to column headers
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
          // <FPIModifiedReport
          //   setIsFpiReport={setIsFpiReport}
          //   slNO={slNO}
          //   reportType={reportType}
          //   jcId={jcId}
          //   itemId={itemId}
          //   inwordReport={true}
          //   selectedRowId={selectedRowId}
          // />
          <WithoutInwardInsideFpiReport
            setIsFpiReport={setIsFpiReport}
            slNO={slNO}
            reportType={reportType}
            jcId={jcId}
            itemId={itemId}
            inwordReport={true}
            selectedRowId={selectedRowId}
          />
        )
      }
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '100%', height: '100%' } }}
        maxWidth="xl"
        open={pdfOpen}
      >
        <DialogTitle style={{ background: '#002D68', color: 'white' }}>File Data View</DialogTitle>
        <DialogContent>
          {/* {fileExtension === 'pdf' ? ( */}
          <div style={{ width: '100%', height: '100%' }} >
            <object style={{ height: '100%', width: '100%' }} data={Url} type="application/pdf">
              <p>It appears you don't have a PDF plugin for this browser.
                No biggie... you can <a style={{ width: '100%', height: '100%' }} href={Url} target="_blank" rel="noopener noreferrer">click here to
                  download the PDF file.</a></p>
            </object>
          </div>
          {/* ) : (
                             <img
                                 srcSet={Url}
                                 style={{ height: '100%', width: '100%', padding: '10px' }}
                             />
                         )
                         } */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosedialog}>Close</Button>
        </DialogActions>
      </Dialog>


      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
};

export default WithoutFPIProcessInwardReport;
