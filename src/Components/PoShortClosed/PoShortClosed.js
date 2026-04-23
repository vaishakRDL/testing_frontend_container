import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { DataGrid } from "@mui/x-data-grid";
// import SfgViewModule from './SfgViewModule';
// import SfgViewTitle from './SfgViewTitle';
import {
  ShowCreatedGroup,
  DeleteCreatedGroup,
  ViewSfg,
  PurchaseReportSearchSupplier,
  GetPoShortClose,
  UpdatePoShortClose,
} from "../../ApiService/LoginPageService";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import "../../App.css";
import ApplicationStore from "../../Utility/localStorageUtil";
import { useModuleLocks } from "../context/ModuleLockContext";

const PoShortClosed = (props) => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Purchase Order Short Close")?.lockStatus === "locked";

  const [refreshData, setRefreshData] = useState(false);
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [selectedRadio, setSelectedRadio] = useState("");
  const [viewSfgList, setViewSfgList] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState([]);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [shortCloseList, setShortCloseLists] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { userDetails } = ApplicationStore().getStorage("userDetails");
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      field: "poNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>PO No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "poDate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>PO Date</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "spName",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Supplier</span>
      ),
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "refNoDate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Ref No</span>
      ),
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //     field: 'SINo',
    //     headerClassName: 'super-app-theme--header',
    //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SI No</span>,
    //     type: 'number',
    //     sortable: true,
    //     sortable: false,
    //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    // },
    {
      field: "itemCode",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Item Code</span>
      ),
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "itemName",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Item Name</span>
      ),
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "uomName",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>UOM</span>
      ),
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "poQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>PO Qty</span>
      ),
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "rate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>PO Rate</span>
      ),
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //     field: 'PBCumQty',
    //     headerClassName: 'super-app-theme--header',
    //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>PB Cum Qty</span>,
    //     type: 'number',
    //     sortable: true,
    //     sortable: false,
    //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    // },
    {
      field: "pendingPo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Pend Qty</span>
      ),
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //     field: 'ShortCloses',
    //     headerClassName: 'super-app-theme--header',
    //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>ShortCloses</span>,
    //     type: 'number',
    //     sortable: true,
    //     sortable: false,
    //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    // },
    {
      field: "selected",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          ShortCloses
        </span>
      ),
      type: "number",
      sortable: true,
      width: 220,
      align: "center",
      headerAlign: "center",
      renderHeader: (params) => (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography style={{ fontWeight: "bold" }}>ShortCloses</Typography>
          <Checkbox
            checked={selectAll}
            disabled={isModuleLocked}
            /*disabled={selectedRadio === ''?true:false}*/ onChange={
              handleSelectAllChange
            }
          />
          <span
            style={{ marginLeft: "5px", fontWeight: "bold", fontSize: "16px" }}
          ></span>
        </div>
      ),
      renderCell: (params) => (
        <Checkbox
          checked={params.row.selected}
          disabled={isModuleLocked}
          /*disabled={selectedRadio === ''?true:false}*/
          onChange={(e) => handleCheckboxChange(e, params.row.id)}
        />
      ),
    },
    {
      field: "shortClosedDate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          ShortClose Date
        </span>
      ),
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "shortClosedBy",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          ShortClose By
        </span>
      ),
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //     field: 'actions',
    //     type: 'actions',
    //     flex: 1,
    //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
    //     cellClassName: 'actions',
    //     disableClickEventBubbling: true,
    //     getActions: (params) => [
    //         <View selectedRow={params.row} />,
    //     ],
    // },
  ];

  const handleCheckboxChange = (event, id) => {
    const updatedRows = shortCloseList.map((row) =>
      row.id === id
        ? {
          ...row,
          selected: event.target.checked,
          edited: true,
          shortClosedDate: event.target.checked ? formatDate(new Date()) : "",
          shortClosedBy: event.target.checked ? userDetails?.userName : "",
        }
        : row
    );
    setShortCloseLists(updatedRows);
  };

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);
    const isChecked = event.target.checked;
    const updatedRows = shortCloseList.map((row) => {
      return {
        ...row,
        selected: isChecked,
        edited: true,
        shortClosedDate: event.target.checked ? formatDate(new Date()) : "",
        shortClosedBy: event.target.checked ? userDetails?.userName : "",
      };
    });
    setShortCloseLists(updatedRows);
  };

  const handleSucessShow = (dataObject) => {
    const updatedList = (dataObject?.data || []).map((item) => ({
      ...item,
      edited: false,
    }));

    setShortCloseLists(updatedList);
  };
  const handleExceptionShow = (errorObject, errorMessage) => { };

  const generateRowsWithIndex = (rows) => {
    return rows.map((row, index) => ({ sNo: index + 1, ...row }));
  };
  const rowData = generateRowsWithIndex(viewSfgList);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = () => {
    GetPoShortClose(
      {
        fromDate: fromDate,
        toDate: toDate,
        supplier: selectedSupplier,
        type: selectedRadio,
      },
      handleSucessShow,
      handleExceptionShow
    );
  };

  const deletehandleSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setRefreshData((oldvalue) => !oldvalue);
    setTimeout(() => {
      handleClose();
      setDeleteDailogOpen(false);
    }, 3000);
  };
  const deletehandleException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
    }, 3000);
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  // SUPPLIER SEARCH
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

  const handleSupplierSelect = (value) => {
    if (value !== null) {
      const ids = value.map((item) => item.id);
      setSelectedSupplier(ids);
    }
  };

  const rows = [
    {
      id: 1,
      "PO No": "PO12345",
      "PO Date": "2024-01-15",
      Supplier: "Supplier A",
      "Ref No": "REF001",
      "SI No": "SI1001",
      "Item Code": "IC001",
      "Item Name": "Widget A",
      UOM: "PCS",
      "PO Qty": 100,
      "PO Rate": 25.5,
      "PB Cum Qty": 50,
      "Pend Qty": 50,
      ShortCloses: false,
      "ShortClose Date": null,
      "ShortClose By": null,
    },
  ];

  const handleSave = () => {
    setLoading(true);
    const updatedArray = shortCloseList
      .filter((item) => item.edited === true) // Filter only selected items
      .map((item) => ({ id: item.id, status: item.selected })); // Map to their `id` values
    console.log("updatedArray", updatedArray);
    UpdatePoShortClose(
      {
        items: updatedArray,
        shortClosedBy: userDetails?.userName,
        shortClosedDate: formatDate(new Date()),
      },
      handleUpdateSuccess,
      handleUpdateException
    );
  };

  const handleUpdateSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setRefreshData((oldvalue) => !oldvalue);
    GetPoShortClose(
      {
        fromDate: fromDate,
        toDate: toDate,
        supplier: selectedSupplier,
        type: selectedRadio,
      },
      handleSucessShow,
      handleExceptionShow
    );
    setTimeout(() => {
      handleClose();
      setLoading(false);
    }, 3000);
  };
  const handleUpdateException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
      setLoading(false);
    }, 3000);
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
      {/* <SfgViewTitle /> */}
      <Typography
        style={{
          textAlign: "left",
          fontWeight: "bold",
          marginLeft: "20px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      >
        PO SHORTCLOSED
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Grid container spacing={2} style={{ marginLeft: "0px" }}>
          <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
            <TextField
              id="filled-basic"
              variant="filled"
              type="date"
              fullWidth
              label="From Date"
              InputLabelProps={{
                shrink: true,
                style: { color: "#000000", fontWeight: "bold" },
              }}
              value={fromDate}
              onChange={handleFromDateChange}
              inputProps={{
                min: fyFrom,
                max: fyTo,
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
            <TextField
              id="filled-basic"
              variant="filled"
              fullWidth
              type="date"
              label="To Date"
              InputLabelProps={{
                shrink: true,
                style: { color: "#000000", fontWeight: "bold" },
              }}
              value={toDate}
              onChange={handleToDateChange}
              inputProps={{
                min: fyFrom,
                max: fyTo,
              }}
              size="small"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={3}
            lg={2}
            xl={2}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                defaultValue="female"
                name="row-radio-buttons-group"
                value={selectedRadio}
                onChange={(e) => {
                  setSelectedRadio(e.target.value);
                  // GetPoShortClose(
                  //   {
                  //     fromDate: fromDate,
                  //     toDate: toDate,
                  //     supplier: selectedSupplier,
                  //     type: e.target.value,
                  //   },
                  //   handleSucessShow,
                  //   handleExceptionShow
                  // );
                  setShortCloseLists([]);
                }}
              >
                <FormControlLabel value="1" control={<Radio />} label="All" />
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="Pending"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
            <Autocomplete
              multiple
              disablePortal
              options={supplierList}
              // getOptionLabel={(option) => option.title}
              // sx={{ width: 300 }}
              size="small"
              renderInput={(params) => (
                <TextField
                  variant="filled"
                  {...params}
                  label="Select Supplier"
                  onChange={handleSupplierChange}
                />
              )}
              onChange={(event, value) => handleSupplierSelect(value)}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={3}
            lg={3}
            xl={3}
            style={{
              display: "flex",
              justifyContent: 'flex-start',
              alignItems: "center",
              columnGap: 4
            }}
          >
            <Button
              variant="contained"
              onClick={handleSubmit}
              style={{ backgroundColor: "#002D68" }}
            >
              View
            </Button>
            {/* <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                > */}
            <Button
              variant="contained"
              onClick={handleSave}
              style={{ backgroundColor: isModuleLocked ? "gray" : "#002D68", color: 'white' }}
              disabled={loading === true || isModuleLocked}
            >
              {/* SAVE */}
              {loading ? (
                <CircularProgress size={24} style={{ color: 'white' }} />
              ) : 'SAVE'}
            </Button>
            {/* </div> */}
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={1}>
            <Card
              style={{
                boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                marginTop: "-10px",
                borderRadius: "10px",
                width: "98%",
                height: "100%",
              }}
            >
              <CardContent>
                <DataGrid
                  rows={shortCloseList}
                  columns={columns}
                  pageSize={8}
                  rowsPerPageOptions={[8]}
                  disableSelectionOnClick
                  style={{ border: "none" }}
                  sx={{
                    overflow: "auto",
                    height: "63vh",
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
                      border: "1px solid #969696",
                    },
                  }}
                  getRowClassName={(params) => {
                    const rowIndex = shortCloseList.findIndex(
                      (row) => row.id === params.row.id
                    );
                    if (rowIndex !== -1) {
                      console.log(" ");
                      return rowIndex % 2 === 0 ? "Mui-evenRow" : "Mui-oddRow";
                    }
                    return "";
                  }}
                  rowHeight={40}
                  columnHeaderHeight={40}
                />

              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

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
        // selectedMaster={selectedMaster}
        deleteService={DeleteCreatedGroup}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />
    </div>
  );
};

export default PoShortClosed;
