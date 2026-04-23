import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Divider,
  CircularProgress,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  GetSearchedItems,
  GetStockLedgerReport,
  GetMainLocation,
  GetItemGroup,
  GetItemConsumptionTrend,
  GetSuppVsItemAllSuppList,
  GetMinMaxConsumptionReport,
} from "../../../ApiService/LoginPageService";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";

const MinMaxStatusReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // gives YYYY-MM-DD
  });
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedItemGroup, setSelectedItemGroup] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState([]);
  const [locationLists, setLocationLists] = useState([]);
  const [itemGroupLists, setItemGroupLists] = useState([]);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [showShortage, setShowShortage] = useState(true);
  const [showExcess, setShowExcess] = useState(false);
  const [minMaxData, setMinMaxData] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [supplierId, setSupplierId] = useState([]);
  const [range, setRange] = useState("min");
  const [consumptionDays, setCosumptionDays] = useState(0);
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  console.log("minMaxData", minMaxData);

  useEffect(() => {
    GetSearchedItems(
      { code: "" },
      handleItemVsProcessItemSucessShow,
      handleItemVsProcessItemExceptionShow
    );
    GetMainLocation(handleLocationSuccess, handleLocationException);
    GetItemGroup(handleItemGroupSuccess, handleItemGroupException);
  }, []);

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
    // setToDate(initialToDate);
  }, []);


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

  // LOCATION
  const handleLocationSuccess = (dataObject) => {
    setLocationLists(dataObject?.data || []);
  };
  const handleLocationException = () => { };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };


  // ITEM GROUP
  const handleItemGroupSuccess = (dataObject) => {
    setItemGroupLists(dataObject?.data || []);
  };
  const handleItemGroupException = () => { };

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
      const ids = value.map((item) => item.id);
      setSelectedItemId(ids);
    }
  };

  const handleSearchLocationChange = (value) => {
    if (value !== null) {
      const ids = value.map((item) => item.id);
      setSelectedLocation(ids);
    }
  };

  const handleSearchGroupChange = (value) => {
    if (value !== null) {
      const ids = value.map((item) => item.id);
      setSelectedItemGroup(ids);
    }
  };

  const handleViewClick = () => {
    setLoading(true);
    GetMinMaxConsumptionReport(
      {
        fromDate: fromDate,
        toDate: toDate,
        items: selectedItemId,
        locations: selectedLocation,
        itemGroups: selectedItemGroup,
        suppliers: supplierId,
        type: (showShortage && "shortage") || (showExcess && "excess"),
        filter: range,
        consumptionDays: consumptionDays,
      },
      handleViewSuccess,
      handleViewException
    );
  };

  const handleViewSuccess = (dataObject) => {
    setMinMaxData(dataObject?.data || []);
    setTimeout(() => {
      setLoading(false);
    }, 2000)
  };
  const handleViewException = () => {
    setTimeout(() => {
      setLoading(false);
    }, 2000)
  };

  // FINANCIAL YEAR
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // SUPPLIER SEARCH
  const handleSupSearchChange = (e) => {
    GetSuppVsItemAllSuppList(
      { code: e.target.value },
      handleSupplierSuccess,
      handleSupplierException
    );
  };

  const handleSupplierSuccess = (dataObject) => {
    setSupplierList(dataObject?.data || []);
  };
  const handleSupplierException = (errorObject, errorMessage) => { };

  const handleSupplierSearchItemChange = (value) => {
    if (value !== null) {
      const ids = value.map((item) => item.id);
      setSupplierId(ids);
    }
  };

  // THIS PAGINATION CODE
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50; // Adjust based on performance
  const paginatedData = minMaxData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  //////Download/////

  // const handleDownload = () => {
  //   if (!paginatedData || paginatedData.length === 0) {
  //     alert("No data available for download.");
  //     return;
  //   }

  //   // Map data to match table headers dynamically
  //   const formattedData = paginatedData.map((item) => ({
  //     "Item Group": item.itemGroup,
  //     "Product Family": item.productFamily,
  //     "Store Location": item.location,
  //     "Item Code": item.itemCode,
  //     "Item Name": item.itemName,
  //     UOM: item.uom,
  //     "Item Rate": item.stdRate,
  //     ...(range === "min"
  //       ? { "Min Level": item.minStock }
  //       : range === "max"
  //         ? { "Max Level": item.maxStock }
  //         : {
  //           "Min Level": item.minStock,
  //           "Max Level": item.maxStock,
  //         }),
  //     "Current Stock": item.totStk,
  //     ...(range === "min"
  //       ? {
  //         [showShortage ? "Short for Min" : "Excess for Min"]: item.minQty,
  //         [showShortage ? "Short for Min-Value" : "Excess for Min-Value"]:
  //           item.minRate,
  //       }
  //       : range === "max"
  //         ? {
  //           [showShortage ? "Short for MAX" : "Excess for MAX"]: item.maxQty,
  //           [showShortage ? "Short for MAX-Value" : "Excess for MAX-Value"]:
  //             item.maxRate,
  //         }
  //         : {
  //           [showShortage ? "Short for Min" : "Excess for Min"]: item.minQty,
  //           [showShortage ? "Short for Min-Value" : "Excess for Min-Value"]:
  //             item.minRate,
  //           [showShortage ? "Short for MAX" : "Excess for MAX"]: item.maxQty,
  //           [showShortage ? "Short for MAX-Value" : "Excess for MAX-Value"]:
  //             item.maxRate,
  //         }),
  //     Supplier: item.supplier,
  //     Consumption: item.consumption,
  //   }));

  //   const workbook = arrayToWorksheet(formattedData);
  //   downloadExcelFile(workbook, "Inventory_Report.xlsx");
  // };
  const handleDownload = () => {
    if (!paginatedData || paginatedData.length === 0) {
      alert("No data available for download.");
      return;
    }

    const formattedData = paginatedData.map((item) => {
      const row = {
        "Item Group": item.itemGroup,
        "Product Family": item.productFamily,
        "Store Location": item.location,
        "Item Code": item.itemCode,
        "Item Name": item.itemName,
        UOM: item.uom,

        // Convert number fields
        "Item Rate": Number(item.stdRate || 0),
      };

      // MIN / MAX dynamic columns
      if (range === "min") {
        row["Min Level"] = Number(item.minStock || 0);
      } else if (range === "max") {
        row["Max Level"] = Number(item.maxStock || 0);
      } else {
        row["Min Level"] = Number(item.minStock || 0);
        row["Max Level"] = Number(item.maxStock || 0);
      }

      // Current stock
      row["Current Stock"] = Number(item.totStk || 0);

      // Shortage / Excess dynamic columns
      if (range === "min") {
        row[showShortage ? "Short for Min" : "Excess for Min"] =
          Number(item.minQty || 0);

        row[
          showShortage ? "Short for Min-Value" : "Excess for Min-Value"
        ] = Number(item.minRate || 0);
      }
      else if (range === "max") {
        row[showShortage ? "Short for MAX" : "Excess for MAX"] =
          Number(item.maxQty || 0);

        row[
          showShortage ? "Short for MAX-Value" : "Excess for MAX-Value"
        ] = Number(item.maxRate || 0);
      }
      else {
        row[showShortage ? "Short for Min" : "Excess for Min"] =
          Number(item.minQty || 0);
        row[
          showShortage ? "Short for Min-Value" : "Excess for Min-Value"
        ] = Number(item.minRate || 0);

        row[showShortage ? "Short for MAX" : "Excess for MAX"] =
          Number(item.maxQty || 0);
        row[
          showShortage ? "Short for MAX-Value" : "Excess for MAX-Value"
        ] = Number(item.maxRate || 0);
      }

      // Other numeric fields
      row["Supplier"] = item.supplier;
      row["Consumption"] = Number(item.consumption || 0);

      return row;
    });

    const workbook = arrayToWorksheet(formattedData);
    downloadExcelFile(workbook, "Inventory_Report.xlsx");
  };

  // Function to generate an Excel file
  const arrayToWorksheet = (array) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inventory Report");

    if (array.length === 0) return workbook;

    // Define headers dynamically
    const columns = Object.keys(array[0]).map((key) => ({
      header: key.toUpperCase(),
      key: key,
      width: 20,
    }));

    worksheet.columns = columns;

    // Add data rows
    array.forEach((row) => worksheet.addRow(row));

    // Style header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    return workbook;
  };

  // Function to trigger Excel file download
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

  const handleFromDateChange = (e) => {
    const selectedFromDate = e.target.value;
    setFromDate(selectedFromDate);

    const fromYear = new Date(selectedFromDate).getFullYear();
    const isAfterApril = new Date(selectedFromDate).getMonth() >= 3;

    const financialYearEnd = isAfterApril
      ? `${fromYear + 1}-03-31`
      : `${fromYear}-03-31`;

    setToDate(financialYearEnd);
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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginLeft: "10px",
          marginTop: "10px",
        }}
      >
        <Typography
          sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
          variant="h5"
        >
          Min Max Status Report
        </Typography>
      </div>
      <form>
        <Grid container spacing={2} padding={1} style={{ zoom: "80%" }}>
          <Grid item xs={12} sm={12} md={2.4}>
            <TextField
              fullWidth
              id="from-date"
              label="From Date"
              variant="outlined"
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              // inputProps={{
              //   min: fyFrom,
              //   max: fyTo,
              // }}
              InputLabelProps={{
                shrink: true,
                style: { color: "#000000", fontWeight: "bold" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2.4}>
            <TextField
              fullWidth
              id="to-date"
              label="To Date"
              variant="outlined"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              // inputProps={{
              //   min: fyFrom,
              //   max: fyTo,
              // }}
              InputLabelProps={{
                shrink: true,
                style: { color: "#000000", fontWeight: "bold" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2.4}>
            <TextField
              fullWidth
              id="Consumption Days"
              label="Consumption Days"
              placeholder="Consumption Days"
              variant="outlined"
              type="number"
              value={consumptionDays}
              onChange={(e) => setCosumptionDays(e.target.value)}
              InputLabelProps={{
                shrink: true,
                style: { color: "#000000", fontWeight: "bold" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2.4}>
            <Autocomplete
              multiple
              disablePortal
              id="combo-box-demo"
              options={itemList}
              fullWidth
              getOptionLabel={(option) => option.label || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Items"
                  onChange={handleChange}
                />
              )}
              onChange={(event, value) => handleSearchItemChange(value)}
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={2.4}
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "-12px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showShortage}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setShowShortage(e.target.checked);
                          setShowExcess(false);
                          setMinMaxData([]);
                        }
                      }}
                    />
                  }
                  label="Show Shortage"
                />
              </FormGroup>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showExcess}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setShowExcess(e.target.checked);
                          setShowShortage(false);
                          setMinMaxData([]);
                        }
                      }}
                    />
                  }
                  label="Show Excess"
                />
              </FormGroup>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={2.4}>
            <Autocomplete
              multiple
              disablePortal
              id="combo-box-demo"
              options={locationLists}
              fullWidth
              getOptionLabel={(option) => option.name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Search Location" />
              )}
              onChange={(event, value) => handleSearchLocationChange(value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2.4}>
            <Autocomplete
              multiple
              disablePortal
              id="combo-box-demo"
              options={itemGroupLists}
              fullWidth
              getOptionLabel={(option) => option.name || ""}
              renderInput={(params) => (
                <TextField {...params} label="Search Group" />
              )}
              onChange={(event, value) => handleSearchGroupChange(value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2.4}>
            <Autocomplete
              multiple
              disablePortal
              id="combo-box-demo"
              options={supplierList}
              fullWidth
              getOptionLabel={(option) => option.spCode || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplier"
                  onChange={handleSupSearchChange}
                />
              )}
              onChange={(event, value) => handleSupplierSearchItemChange(value)}
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={2.4}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={range}
                onChange={(e) => {
                  setRange(e.target.value);
                  setMinMaxData([]);
                }}
              >
                <FormControlLabel value="min" control={<Radio />} label="Min" />
                <FormControlLabel value="max" control={<Radio />} label="Max" />
                <FormControlLabel
                  value="both"
                  control={<Radio />}
                  label="Both"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={2.4}
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              style={{ backgroundColor: "#002d68", width: '150px' }}
              onClick={handleViewClick}
              disabled={loading === true}
            >
              {/* View Report */}
              {loading ? (
                <CircularProgress size={24} style={{ color: 'white' }} />
              ) : "View Report"}
            </Button>
            <Button
              variant="contained"
              style={{ backgroundColor: "#002d68" }}
              onClick={handleDownload}
            >
              Download
            </Button>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} margin={1}>
          <Card
            style={{
              boxShadow: "0 10px 10px 10px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              width: "100%",
              border: "1px solid black",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  height: screenHeight - 420,
                  backgroundColor: "white",
                  border: "1px solid black",
                  width: "100%",
                  overflowY: "scroll",
                  overflowX: "scroll",
                  "&::-webkit-scrollbar": {
                    width: "12px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "black",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "lightgrey",
                  },
                  scrollbarColor: "#f9f9fb lightgrey",
                  scrollbarWidth: "thin",
                }}
              >
                <table
                  id="customers"
                  style={{ width: "100%", borderCollapse: "collapse" }}
                >
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f9f9f9",
                      zIndex: 1,
                    }}
                  >
                    <tr>
                      <th style={{ whiteSpace: "nowrap" }}>Item Group</th>
                      <th style={{ whiteSpace: "nowrap" }}>Product Family</th>
                      <th style={{ whiteSpace: "nowrap" }}>Store Location</th>
                      <th style={{ whiteSpace: "nowrap" }}>Item Code</th>
                      <th style={{ whiteSpace: "nowrap" }}>Item Name</th>
                      <th style={{ whiteSpace: "nowrap" }}>UOM</th>
                      <th style={{ whiteSpace: "nowrap" }}>Item Rate</th>
                      {range === "min" ? (
                        <th style={{ whiteSpace: "nowrap" }}>Min Level</th>
                      ) : range === "max" ? (
                        <th style={{ whiteSpace: "nowrap" }}>Max Level</th>
                      ) : (
                        <>
                          <th style={{ whiteSpace: "nowrap" }}>Min Level</th>
                          <th style={{ whiteSpace: "nowrap" }}>Max Level</th>
                        </>
                      )}
                      <th style={{ whiteSpace: "nowrap" }}>Current Stock</th>
                      {range === "min" ? (
                        <>
                          <th style={{ whiteSpace: "nowrap" }}>
                            {showShortage ? "Short for Min" : "Excess for Min"}
                          </th>
                          <th style={{ whiteSpace: "nowrap" }}>
                            {showShortage
                              ? "Short for Min-Value"
                              : "Excess for Min-Value"}
                          </th>
                        </>
                      ) : range === "max" ? (
                        <>
                          <th style={{ whiteSpace: "nowrap" }}>
                            {showShortage ? "Short for MAX" : "Excess for MAX"}
                          </th>
                          <th style={{ whiteSpace: "nowrap" }}>
                            {showShortage
                              ? "Short for MAX-Value"
                              : "Excess for MAX-Value"}
                          </th>
                        </>
                      ) : (
                        <>
                          <th style={{ whiteSpace: "nowrap" }}>
                            {showShortage ? "Short for Min" : "Excess for Min"}
                          </th>
                          <th style={{ whiteSpace: "nowrap" }}>
                            {showShortage
                              ? "Short for Min-Value"
                              : "Excess for Min-Value"}
                          </th>
                          <th style={{ whiteSpace: "nowrap" }}>
                            {showShortage ? "Short for MAX" : "Excess for MAX"}
                          </th>
                          <th style={{ whiteSpace: "nowrap" }}>
                            {showShortage
                              ? "Short for MAX-Value"
                              : "Excess for MAX-Value"}
                          </th>
                        </>
                      )}
                      <th style={{ whiteSpace: "nowrap" }}>Supplier</th>
                      <th style={{ whiteSpace: "nowrap" }}>Consumption</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData &&
                      paginatedData.map((item, itemIndex) => (
                        <tr key={itemIndex}>
                          <td key={itemIndex} style={{ whiteSpace: "nowrap" }}>
                            {item.itemGroup}
                          </td>
                          <td key={itemIndex} style={{ whiteSpace: "nowrap" }}>
                            {item.productFamily}
                          </td>
                          <td key={itemIndex} style={{ whiteSpace: "nowrap" }}>
                            {item.location}
                          </td>
                          <td key={itemIndex} style={{ whiteSpace: "nowrap" }}>
                            {item.itemCode}
                          </td>
                          <td key={itemIndex} style={{ whiteSpace: "nowrap" }}>
                            {item.itemName}
                          </td>
                          <td key={itemIndex} style={{ whiteSpace: "nowrap" }}>
                            {item.uom}
                          </td>
                          <td key={itemIndex} style={{ whiteSpace: "nowrap" }}>
                            {item.stdRate}
                          </td>
                          {range === "min" ? (
                            <td
                              key={itemIndex}
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {item.minStock}
                            </td>
                          ) : range === "max" ? (
                            <td
                              key={itemIndex}
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {item.maxStock}
                            </td>
                          ) : (
                            <>
                              <td
                                key={itemIndex}
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {item.minStock}
                              </td>
                              <td
                                key={itemIndex}
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {item.maxStock}
                              </td>
                            </>
                          )}
                          <td key={itemIndex} style={{ whiteSpace: "nowrap" }}>
                            {item.totStk}
                          </td>
                          {range === "min" ? (
                            <>
                              <td
                                key={itemIndex}
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {item.minQty}
                              </td>
                              <td
                                key={itemIndex}
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {item.minRate}
                              </td>
                            </>
                          ) : range === "max" ? (
                            <>
                              <td
                                key={itemIndex}
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {item.maxQty}
                              </td>
                              <td
                                key={itemIndex}
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {item.maxRate}
                              </td>
                            </>
                          ) : (
                            <>
                              <td
                                key={itemIndex}
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {item.minQty}
                              </td>
                              <td
                                key={itemIndex}
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {item.minRate}
                              </td>
                              <td
                                key={itemIndex}
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {item.maxQty}
                              </td>
                              <td
                                key={itemIndex}
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {item.maxRate}
                              </td>
                            </>
                          )}
                          <td key={itemIndex} style={{ whiteSpace: "nowrap" }}>
                            {item.supplier}
                          </td>
                          <td key={itemIndex} style={{ whiteSpace: "nowrap" }}>
                            {item.consumption}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
          <div
            style={{
              marginTop: "5px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span style={{ marginLeft: "5px", marginRight: "5px" }}>
              {" "}
              {paginatedData?.length} of {minMaxData?.length} | Page{" "}
              {currentPage}{" "}
            </span>
            <button
              disabled={currentPage === Math.ceil(minMaxData.length / pageSize)}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </Grid>
      </form>
      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
};

export default MinMaxStatusReport;
