import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  Autocomplete,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { Button } from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";
import CSLimportTitle from "./CSLimportTitle";
import CSLimportModule from "./CSLimportModule";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import {
  CslSearch,
  cslDelete,
  cslShowData,
} from "../../ApiService/LoginPageService";
import ImportSOBforCsl from "./ImportSOB/ImportSOBforCsl";
import ViewCSLDetails from "./ImportSOB/ViewCSLDetails";
import MissingCsl from "./MissingCsl/MissingCsl";
import SOBviewCslData from "./SOBviewCslData/SOBviewCslData";
import "../../App.css";
import { CslExlExport } from "../../ApiService/DownloadCsvReportsService";
import { useModuleLocks } from "../context/ModuleLockContext";

const CSLimportResult = () => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "CSL")?.lockStatus === "locked";

  const [submitloading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [openMissing, setOpenMisiing] = useState(false);
  const [openSOBview, setOpenSOBview] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [isAddButton, setIsAddButton] = useState(true);
  const [editData, setEditData] = useState([]);
  const [cslId, setCSLId] = useState("");
  const [isLoading, setGridLoading] = useState(true);
  const [masterData, serMasterData] = useState([]);
  const [id, setId] = useState("");
  const [password, setConfirmPassword] = useState("");
  const [btnReset, setBtnReset] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [rows, setRows] = useState([]);
  //NEW STATE VARIBALES
  const [selectedMaster, setSelectedMaster] = useState("pm");
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");
  const [formDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [itemShowListSeach, setItemShowListSeach] = useState([]);

  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const top100Films = [
    { label: "The Shawshank Redemption", year: 1994 },
    { label: "The Godfather", year: 1972 },
    { label: "The Godfather: Part II", year: 1974 },
    { label: "The Dark Knight", year: 2008 },
    { label: "12 Angry Men", year: 1957 },
  ];

  // const columns = [
  //     {
  //         field: 'contractNo',
  //         headerName:
  //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
  //                 Contract No
  //             </span>,
  //         type: 'string',
  //         sortable: true,
  //         minWidth: 100,
  //         flex: 1,
  //         align: 'center',
  //         headerAlign: 'center',
  //     },
  //     {
  //         field: 'partNo',
  //         headerName:
  //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
  //                 Part No
  //             </span>,
  //         type: 'string',
  //         sortable: true,
  //         minWidth: 100,
  //         flex: 1,
  //         align: 'center',
  //         headerAlign: 'center'
  //     },
  //     {
  //         field: 'Qty',
  //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
  //             Qty
  //         </span>,
  //         type: 'string',
  //         sortable: true,
  //         minWidth: 100,
  //         flex: 1,
  //         align: 'center',
  //         headerAlign: 'center'
  //     },

  //     {
  //         field: 'description',
  //         headerName:
  //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
  //                 Description
  //             </span>,
  //         type: 'string',
  //         sortable: true,
  //         minWidth: 100,
  //         flex: 1,
  //         align: 'center',
  //         headerAlign: 'center'
  //     },
  //     {
  //         field: 'boxNo',
  //         headerName:
  //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
  //                 BOXNO
  //             </span>,
  //         type: 'string',
  //         sortable: true,
  //         minWidth: 100,
  //         flex: 1,
  //         align: 'center',
  //         headerAlign: 'center'
  //     },
  //     {
  //         field: 'actions',
  //         type: 'actions',
  //         flex: 1,
  //         headerName:
  //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
  //                 Actions
  //             </span>,
  //         cellClassName: 'actions',
  //         disableClickEventBubbling: true,
  //         getActions: (params) => [
  //             <EditData selectedRow={params.row} />,
  //             <DeleteData selectedRow={params.row} />,
  //         ],
  //     },
  // ];

  const columns = [
    {
      field: "sNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>S.No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
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
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "kanbandate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Kanban Date
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "contractNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Contract No
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "status",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Status</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      type: "actions",
      flex: 1,
      minWidth: 550,
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
      ),
      cellClassName: "actions",
      disableClickEventBubbling: true,
      getActions: (params) => [
        // <ImportSOB selectedRow={params.row} />,
        <SOBView selectedRow={params.row} />,
        <MissingCSL selectedRow={params.row} />,
        // <OrderProcess selectedRow={params.row} />,
        <DeleteData selectedRow={params.row} />,
      ],
    },
  ];

  useEffect(() => {
    cslShowData(
      {
        fromDate: formDate,
        toDate: toDate,
        cslMstId: "",
      },
      handleSucessShow,
      handleShowException
    );
  }, [refreshData]);

  const handleShowSuccess = (dataObject) => {
    setRows(dataObject?.data || []);
  };

  const handleShowException = (errorObject, errorMessage) => {
    console.log("error", errorMessage);
    setLoading(false);
    setGridLoading(false);
  };

  // function ImportSOB(props) {
  //     return (
  //         <>
  //             <Button variant="outlined"
  //                 style={{ color: '#002D68' }}
  //                 onClick={(event) => {
  //                     setOpen(true);
  //                     // setIsAddButton(false);
  //                     setCSLId(props.selectedRow.id);
  //                 }}
  //             >Import SOB</Button>
  //         </>

  //     );
  // }

  function SOBView(props) {
    return (
      <Button
        variant="outlined"
        style={{ color: "#002D68" }}
        onClick={(event) => {
          setOpenSOBview(true);
          // setIsAddButton(false);
          setCSLId(props.selectedRow.id);
        }}
      >
        SOB View
      </Button>
    );
  }

  function MissingCSL(props) {
    return (
      <Button
        variant="outlined"
        disabled={props?.selectedRow?.missingCsl === 1 ? false : true}
        style={{ color: "#002D68" }}
        onClick={(event) => {
          setOpenMisiing(true);
          // setIsAddButton(false);
          setCSLId(props.selectedRow.id);
        }}
      >
        Missing CSL
      </Button>
    );
  }

  function OrderProcess(props) {
    return (
      <Button
        variant="outlined"
        disabled={props?.selectedRow?.missingCsl === 1 ? true : false}
        style={{ color: "#002D68" }}
        onClick={(event) => {
          // setOpen(true);
          // setIsAddButton(false);
          // setEditData(props.selectedRow);
        }}
      >
        Process Order
      </Button>
    );
  }

  function DeleteData(props) {
    return (
      <DeleteIcon
        // disabled={true}
        onClick={() => {
          if (isModuleLocked) return;
          setDeleteId(props.selectedRow.id);
          setDeleteDailogOpen(true);
        }}
        style={{ color: isModuleLocked ? "gray" : "black" }}
      />
    );
  }

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handleSucessShow = (dataObject) => {
    serMasterData(dataObject?.data || []);
    setGridLoading(false);
    setSubmitLoading(false);
    setLoading(false);


  };
  const handleExceptionShow = (errorObject, errorMessage) => { };

  const deletehandleSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });

    setRefreshData((oldvalue) => !oldvalue);
    setTimeout(() => {
      setDeleteDailogOpen(false);
    }, 3000);
  };

  const deletehandleException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
  };

  const handleRowClick = (e) => {
    setOpenView(true);
    console.log("eeee", e.row.id);
    setViewId(e.row.id);
  };

  const options = itemShowListSeach.map((item) => ({
    id: item?.id,
    label: item?.label,
  }));

  const textEntery = (e) => {
    CslSearch(
      {
        text: e.target.value,
      },
      handleItemSearchNAAJSucees,
      handleItemSearchNAAJException
    );
  };

  const handleItemSearchNAAJSucees = (dataObject) => {
    setItemShowListSeach(dataObject?.data || []);
  };

  const handleItemSearchNAAJException = () => { };

  const handleAutocompleteChange = (selectedValue) => {
    console.log("selectedValue", selectedValue);
    setSelectedItem(selectedValue?.label);
    if (selectedValue) {
      cslShowData(
        {
          fromDate: "",
          toDate: "",
          cslMstId: selectedValue?.id,
        },
        handleSucessShow,
        handleShowException
      );
    }
  };

  const parseDate = (str) => {
    const [day, month, year] = str.split('-');
    return new Date(`${year}-${month}-${day}`);
  };

  // Helper: Format Date to "yyyy-MM-dd" (for <input type="date" />)
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('userDetails')) || {};
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
      setNotification({ status: false, type: '', message: '' });
    } else {
      setNotification({
        status: true,
        type: 'error',
        message: 'Please select a valid From-Date',
      });
    }
  };

  const handleToDateChange = (e) => {
    const value = e.target.value;
    if (isValidDateInRange(value)) {
      setToDate(value);
      setNotification({ status: false, type: '', message: '' });
    } else {
      setNotification({
        status: true,
        type: 'error',
        message: 'Please select a valid To-Date',
      });
    }
  };

  return (
    <div style={{ height: "60vh", width: "100%" }}>
      <CSLimportTitle
        setIsAddButton={setIsAddButton}
        setEditData={setEditData}
        setOpen={setOpen}
        setRefreshData={setRefreshData}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "-20px",
        }}
      >
        <Grid container spacing={2} style={{ width: "99%", height: "100%" }}>
          <Grid item xs={12} md={3} lg={3} sm={3}>
            <TextField
              id="from-date"
              label="From Date"
              variant="filled"
              sx={{ mb: 1 }}
              margin="dense"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              type="date"
              placeholder="From Date"
              value={formDate}
              onChange={handleFromDateChange}
              inputProps={{
                min: fyFrom,
                max: fyTo,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3} lg={3} sm={3}>
            <TextField
              id="to-date"
              label="To Date"
              variant="filled"
              sx={{ mb: 1 }}
              margin="dense"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              type="date"
              placeholder="To Date"
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
            md={1}
            lg={1}
            sm={1}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              disabled={loading}
              onClick={(e) => {
                setLoading(true);
                cslShowData(
                  {
                    fromDate: formattedDate,
                    toDate: formattedDate,
                    cslMstId: "",
                  },
                  handleSucessShow,
                  handleShowException
                );
              }}
            >
              {loading ? (
                <CircularProgress size={24} style={{ color: 'white' }} />
              ) : (
                "Today"
              )}              </Button>
          </Grid>

          <Grid
            item
            xs={12}
            md={1}
            lg={1}
            sm={1}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              disabled={submitloading}
              onClick={(e) => {
                setSubmitLoading(true);
                cslShowData(
                  {
                    fromDate: formDate,
                    toDate: toDate,
                    cslMstId: "",
                  },
                  handleSucessShow,
                  handleShowException
                );
              }}
            >
              {submitloading ? (
                <CircularProgress size={24} style={{ color: 'white' }} />
              ) : (
                "Submit"
              )}            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            lg={4}
            sm={4}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FormControl fullWidth>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={options}
                // sx={{ width: 300, }}
                value={selectedItem}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search By Contract No "
                    onChange={textEntery}
                  // onClear={() => {
                  //   console.log('success');
                  // }}
                  />
                )}
                onChange={(event, value) => handleAutocompleteChange(value)}
              />
            </FormControl>
          </Grid>

          {/* <Grid item xs={12} md={2} lg={2} sm={2}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}

                    >
                         <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                cslShowData({
                                    fromDate: formDate,
                                    toDate: toDate

                                }, handleSucessShow, handleShowException);
                            }}
                        >
                            Submit
                        </Button>
                      
                    </Grid> */}

          <Grid item xs={12} sma={12} md={12} lg={12} xl={12}>
            <Card
              style={{
                borderRadius: "8px",
                height: "100%",
                width: "100%",
                marginTop: "-10px",
                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
              }}
            >
              <CardContent
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DataGrid
                  rows={masterData}
                  columns={columns}
                  pageSize={8}
                  loading={isLoading}
                  rowsPerPageOptions={[8]}
                  disableSelectionOnClick
                  onRowClick={handleRowClick}
                  style={{ border: "none" }}
                  sx={{
                    overflow: "auto",
                    height: "65vh",
                    // minHeight: '500px',
                    width: "100%",
                    "& .super-app-theme--header": {
                      WebkitTextStrokeWidth: "0.6px",
                      backgroundColor: "#93bce6",
                      color: "#1c1919",
                    },
                    "& .MuiDataGrid-cell": {
                      border: "1px solid #969696",
                    },
                    "& .MuiDataGrid-columnHeader": {
                      border: "1px solid #969696", // Add border to column headers
                    },
                  }}
                  getRowClassName={(params) => {
                    // Find the index of the row within the rows array
                    const rowIndex = masterData.findIndex(
                      (row) => row.id === params.row.id
                    );
                    // Check if the index is valid
                    if (rowIndex !== -1) {
                      console.log(" ");
                      return rowIndex % 2 === 0 ? "Mui-evenRow" : "Mui-oddRow";
                    }
                    return ""; // Return default class if index is not found
                  }}
                  rowHeight={40}
                  columnHeaderHeight={40}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

      {/* <CSLimportModule
                isAddButton={isAddButton}
                editData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
            /> */}

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />

      <DeleteConfirmationDailog
        open={deleteDailogOpen}
        setOpen={setDeleteDailogOpen}
        deleteId={deleteId}
        deleteService={cslDelete}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />
      {/* <ImportSOBforCsl
                open={open}
                setOpen={setOpen}
                cslId={cslId}
            /> */}
      <ViewCSLDetails open={openView} setOpen={setOpenView} viewId={viewId} />
      <SOBviewCslData
        openSOBview={openSOBview}
        setOpenSOBview={setOpenSOBview}
        cslId={cslId}
        setCSLId={setCSLId}
      />
      <MissingCsl
        openMissing={openMissing}
        setOpenMisiing={setOpenMisiing}
        cslId={cslId}
      />
    </div>
  );
};

export default CSLimportResult;
