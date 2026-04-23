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
import { DataGrid, gridFilteredSortedRowIdsSelector, useGridApiRef } from "@mui/x-data-grid";
// import SfgViewModule from './SfgViewModule';
// import SfgViewTitle from './SfgViewTitle';
import {
  ShowCreatedGroup,
  DeleteCreatedGroup,
  ViewSfg,
  PurchaseReportSearchSupplier,
  GetPoShortClose,
  UpdatePoShortClose,
  GetSrnShortClose,
  UpdateSrnShortClose,
} from "../../ApiService/LoginPageService";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import "../../App.css";
import ApplicationStore from "../../Utility/localStorageUtil";
import { useModuleLocks } from "../context/ModuleLockContext";

const SrnShortClosed = (props) => {

  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "SRN Short Closed")?.lockStatus === "locked";

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
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);


  const apiRef = useGridApiRef();
  useEffect(() => {
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

  const columns = [
    {
      field: "requestedBy",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Request By</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "srnNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>SRN No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "srnDate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>SRN Date</span>
      ),
      type: "string",
      sortable: true,
      // sortable: false,
      minWidth: 100,
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
      // sortable: false,
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
      type: "string",
      sortable: true,
      // sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "uom",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>UOM</span>
      ),
      type: "string",
      sortable: true,
      // sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "srnQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>SRN Qty</span>
      ),
      type: "number",
      sortable: true,
      // sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "pbQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>PB Cum Qty</span>
      ),
      type: "number",
      sortable: true,
      // sortable: false,
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
      field: "pendQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Pend Qty</span>
      ),
      type: "number",
      // sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      // renderCell: (params) => (
      //     <span>{params.row.pendQty}</span> // show as fixed decimal
      // ),
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
          {/* <Checkbox checked={selectAll} onChange={handleSelectAllChange} /> */}
          <Checkbox
            checked={selectAll}
            // indeterminate={
            //   selectedCount > 0 && selectedCount < shortCloseList.length
            // }
            disabled={isModuleLocked}
            onChange={handleSelectAllChange}
            style={{ marginLeft: 8 }}
          />
          <span
            style={{ marginLeft: "5px", fontWeight: "bold", fontSize: "16px" }}
          ></span>
        </div>
      ),
      renderCell: (params) => (
        <Checkbox
          disabled={isModuleLocked}
          checked={params.row.selected}
          onChange={(e) => handleCheckboxChange(e, params.row.id)}
        />
      ),
    },
    {
      field: "Qty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          {" "}
          shortClosedQty
        </span>
      ),
      type: "number",
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const { row } = params;

        if (!row.selected) return null;

        const qtyValue = row.Qty;

        const handleChange = (e) => {
          const inputValue = parseFloat(e.target.value);
          if (inputValue <= row.pendQty) {
            handleQtyChange(inputValue, row.id);
          } else {
            alert(
              `ShortClosedQty cannot be greater than Pending Qty (${row.pendQty})`
            );
          }
        };

        return (
          <input
            type="number"
            value={qtyValue}
            step="0.01"
            style={{ width: "80px", textAlign: "center" }}
            onChange={handleChange}
            min={0}
            max={row.pendQty}
          />
        );
      },
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
  const selectedCount = shortCloseList.filter((r) => r.selected).length;

  const handleQtyChange = (value, id) => {
    const updatedRows = shortCloseList.map((row) => {
      if (row.id === id) {
        const qtyValue = Number(value);
        if (qtyValue > row.srnQty) {
          alert(`Qty cannot be more than Srn Qty (${row.srnQty})`);
          return row;
        }
        return { ...row, Qty: qtyValue };
      }
      return row;
    });

    setShortCloseLists(updatedRows);
  };

  // const handleCheckboxChange = (event, id) => {
  //     const updatedRows = shortCloseList.map((row) =>
  //         row.id === id ? { ...row, selected: event.target.checked, shortClosedDate: event.target.checked ? formatDate(new Date()) : '', shortClosedBy: event.target.checked ? userDetails?.userName : '' } : row
  //     );
  //     setShortCloseLists(updatedRows);
  // };

  const handleCheckboxChange = (event, id) => {
    const updatedRows = shortCloseList.map((row) =>
      row.id === id
        ? {
          ...row,
          selected: event.target.checked,
          shortClosedDate: event.target.checked ? formatDate(new Date()) : "",
          shortClosedBy: event.target.checked ? userDetails?.userName : "",
          Qty: event.target.checked ? row.srnQty : "",
          userSelected: event.target.checked, // ✅ track only user actions
          userUnselected: !event.target.checked && row.selected === false,
        }
        : row
    );
    setShortCloseLists(updatedRows);
  };
  // const handleSelectAllChange = (event) => {
  //     setSelectAll(event.target.checked);
  //     const isChecked = event.target.checked;
  //     const updatedRows = shortCloseList.map(row => {
  //         return { ...row, selected: isChecked, shortClosedDate: event.target.checked ? formatDate(new Date()) : '', shortClosedBy: event.target.checked ? userDetails?.userName : '' };
  //     });
  //     setShortCloseLists(updatedRows);
  // };

  const handleSelectAllChange = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);

    const visibleRowIds = gridFilteredSortedRowIdsSelector(apiRef);

    setShortCloseLists((prev) =>
      prev.map((row) =>
        visibleRowIds.includes(row.id)
          ? {
            ...row,
            selected: isChecked,
            shortClosedDate: isChecked ? formatDate(new Date()) : "",
            shortClosedBy: isChecked ? userDetails?.userName : "",
            Qty: isChecked ? row.srnQty : "",
            userSelected: isChecked, // ✅ mark bulk user action too
            userUnselected: !event.target.checked && row.selected === false,
          }
          : row
      )
    );
  };
  const handleSucessShow = (dataObject) => {
    const updatedData = (dataObject?.data || []).map((row) => ({
      ...row,
      originalSelected: row.selected, // Track original checkbox state
    }));

    setShortCloseLists(updatedData);
    // setShortCloseLists(dataObject?.data || []);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const handleExceptionShow = (errorObject, errorMessage) => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

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
    if (fromDate && toDate) {
      setLoading(true);
      GetSrnShortClose(
        {
          fromDate: fromDate,
          toDate: toDate,
          // supplier: selectedSupplier,
          type: selectedRadio,
        },
        handleSucessShow,
        handleExceptionShow
      );
    } else {
      setNotification({
        status: true,
        type: "error",
        message: "Please Select Date Range",
      });
    }
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

  const handleCancel = () => {
    const updatedRows = shortCloseList.map((row) => ({
      ...row,
      selected: row.originalSelected,
      shortClosedDate: row.originalSelected ? formatDate(new Date()) : "",
      shortClosedBy: row.originalSelected ? userDetails?.userName : "",
    }));
    setShortCloseLists(updatedRows);
  };

  // const handleSave = () => {
  //     const updatedArray = shortCloseList
  //         .filter((item) => item.selected === true) // Filter only selected items
  //         .map((item) => item.id); // Map to their `id` values
  //     console.log("updatedArray", updatedArray);
  //     setSubmitLoading(true);
  //     UpdateSrnShortClose({
  //         items: updatedArray,
  //         shortCloseQty: qtyValue,
  //         shortClosedBy: userDetails?.userName,
  //         shortClosedDate: formatDate(new Date())
  //     }, handleUpdateSuccess, handleUpdateException)
  // };
  const handleSave = () => {
    // ✅ rows that user newly checked
    const selectedRows = shortCloseList.filter(
      (item) => item.userSelected === true && item.Qty
    );

    // ❌ rows that were pre-selected but user unchecked
    const uncheckedRows = shortCloseList.filter(
      (item) => item.selected === false && item.userSelected === false && item.originalSelected === true
    );

    if (selectedRows.length === 0 && uncheckedRows.length === 0) {
      alert("Please select at least one item to short close or uncheck to remove.");
      return;
    }

    const updatedArray = selectedRows.map((item) => ({
      id: item.id,
      Qty: item.Qty,
    }));

    // ✅ send only array of IDs instead of objects
    const uncheckedArray = uncheckedRows.map((item) => item.id);

    setSubmitLoading(true);

    UpdateSrnShortClose(
      {
        items: updatedArray,     // ✅ array of objects with id + Qty
        revertItems: uncheckedArray, // ✅ plain array of IDs
        shortClosedBy: userDetails?.userName,
        shortClosedDate: formatDate(new Date()),
      },
      handleUpdateSuccess,
      handleUpdateException
    );
  };

  // const handleSave = () => {
  //     if (selectedRadio !== "0") {
  //         alert("Short close is allowed only in the 'Pending' view.");
  //         return;
  //     }

  //     const modifiedRows = shortCloseList.filter(
  //         (item) => item.selected && Number(item.qty) !== Number(item.pendQty)
  //     );

  //     if (modifiedRows.length === 0) {
  //         alert("Please select at least one item with modified quantity to short close.");
  //         return;
  //     }

  //     const updatedArray = modifiedRows.map((item) => ({
  //         id: item.id,
  //         Qty: Number(item.qty),
  //     }));

  //     setSubmitLoading(true);

  //     UpdateSrnShortClose(
  //         {
  //             items: updatedArray,
  //             shortClosedBy: userDetails?.userName,
  //             shortClosedDate: formatDate(new Date()),
  //         },
  //         handleUpdateSuccess,
  //         handleUpdateException
  //     );
  // };

  const handleUpdateSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setRefreshData((oldvalue) => !oldvalue);
    GetSrnShortClose(
      {
        fromDate: fromDate,
        toDate: toDate,
        // supplier: selectedSupplier,
        type: selectedRadio,
      },
      handleSucessShow,
      handleExceptionShow
    );
    setTimeout(() => {
      handleClose();
      setSubmitLoading(false);
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
      setSubmitLoading(false);
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
    // const initialData = data.map((row) => ({
    //     ...row,
    //     originalSelected: row.selected  // Track original selection state
    // }));
    // setShortCloseLists(initialData);
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
    <div style={{ height: "60vh", marginRight: "10px", marginLeft: "10px" }}>
      {/* <SfgViewTitle /> */}
      <Typography
        style={{
          textAlign: "left",
          fontWeight: "bold",
          marginTop: "10px",
          marginBottom: "10px",
          fontSize: "20px",
        }}
      >
        SRN SHORTCLOSED
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Grid container>
          <Grid item xs={12} sm={12} md={3} lg={2} xl={2} marginRight={2}>
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
                  setShortCloseLists([]);
                }}
              >
                <FormControlLabel value="" control={<Radio />} label="All" />
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="Pending"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          {/* <Grid item xs={12} sm={12} md={3} lg={2} xl={2}>
                        <Autocomplete
                            multiple
                            disablePortal
                            options={supplierList}
                            // getOptionLabel={(option) => option.title}
                            // sx={{ width: 300 }}
                            size="small"
                            renderInput={(params) => <TextField variant="filled" {...params} label="Select Supplier" onChange={handleSupplierChange} />}
                            onChange={(event, value) => handleSupplierSelect(value)}
                        />
                    </Grid> */}
          <Grid
            item
            xs={12}
            sm={12}
            md={3}
            lg={3}
            xl={3}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              disabled={loading === true}
              variant="contained"
              onClick={handleSubmit}
              style={{
                color: 'white',
                backgroundColor: "#002D68",
              }}
            >
              {loading ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                "View"
              )}
            </Button>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={1}>
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
                  rows={shortCloseList}
                  columns={columns}
                  pageSize={8}
                  apiRef={apiRef}
                  rowsPerPageOptions={[8]}
                  disableSelectionOnClick
                  style={{ border: "none" }}
                  sx={{
                    overflow: "auto",
                    height: screenHeight - 320,
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    columnGap: 2,
                  }}
                >
                  {/* <Grid item xs={12} sm={12} md={2} lg={2} xl={2}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            columnGap: 2
                        }}
                    > */}
                  <Button
                    variant="contained"
                    onClick={handleCancel}
                    style={{ backgroundColor: isModuleLocked ? "gray" : "#002D68" }}
                    disabled={isModuleLocked}
                  >
                    {/* SAVE */}
                    Cancel
                  </Button>
                  <Button
                    disabled={submitLoading === true || isModuleLocked}
                    variant="contained"
                    onClick={handleSave}
                    style={{ backgroundColor: isModuleLocked ? "gray" : "#002D68" }}
                  >
                    {/* SAVE */}
                    {submitLoading ? (
                      <CircularProgress size={24} style={{ color: "white" }} />
                    ) : (
                      "Save"
                    )}
                  </Button>

                  {/* </Grid> */}
                </div>
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

export default SrnShortClosed;
