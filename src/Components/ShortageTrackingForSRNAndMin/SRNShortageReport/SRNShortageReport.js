import React, { useState, useEffect, useCallback } from "react";
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
  InputLabel,
  LinearProgress,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "./SRNShortageReport.css";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  GetJobWorkIssueReport,
  GetSFGFilterLocation,
  GetSRNshortageReport,
  GetSuppVsItemAllSuppList,
  ItemSearchNAAJ,
} from "../../../ApiService/LoginPageService";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SRNShortageReport = () => {
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [supplierList, setSupplierList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setTodate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // gives YYYY-MM-DD
  });
  const [selectedSupplier, setSelectedSupplier] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [jobworkReportData, setJobWorkReportData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("Summary");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [filterLocationList, setFilterLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [filters, setFilters] = useState({
    requestedBy: "",
    srnNo: "",
    srnDate: "",
    location: "",
    itemCode: "",
    itemName: "",
    category: "",
    uom: "",
    FIM: "",
    srnQty: "",
    pendingQty: "",
    totStk: "",
    shortage: "",
  });
  const [showFilter, setShowFilter] = useState(false);
  const [displayLoader, setDispalyLoader] = useState(false);
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

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

  useEffect(() => {
    GetSFGFilterLocation(handleGetLocationSuccess, handleGetLocationException);
  }, []);

  // GET SFG LOCATION
  const handleGetLocationSuccess = (dataObject) => {
    setFilterLocationList(dataObject?.data || []);
  };
  const handleGetLocationException = () => { };

  // SUPPLIER SEARCH
  const handleSupplierChange = (e) => {
    // PurchaseReportSearchSupplier({ code: e.target.value }, handleSearchSupplierSucessShow, handleSearchSupplierExceptionShow);
    GetSuppVsItemAllSuppList(
      { code: e.target.value },
      handleSearchSupplierSucessShow,
      handleSearchSupplierExceptionShow
    );
  };

  const handleSearchSupplierSucessShow = (dataObject) => {
    setSupplierList(dataObject?.data || []);
  };
  const handleSearchSupplierExceptionShow = (errorObject, errorMessage) => { };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
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



  const handleSupplierSelect = (value) => {
    if (value !== null) {
      const ids = value.map((item) => item.id);
      setSelectedSupplier(ids);
    }
  };

  // ITEM SEARCH
  const handleItemChange = (e) => {
    // PurchaseReportSearchItem({ code: e.target.value }, handleSearchItemSucessShow, handleSearchItemExceptionShow);
    ItemSearchNAAJ(
      {
        text: e.target.value,
      },
      handleSearchItemSucessShow,
      handleSearchItemExceptionShow
    );
  };

  const handleSearchItemSucessShow = (dataObject) => {
    setItemList(dataObject?.data || []);
  };
  const handleSearchItemExceptionShow = (errorObject, errorMessage) => { };

  const handleItemSelect = (value) => {
    if (value !== null) {
      const ids = value.map((item) => item.id);
      setSelectedItem(ids);
    }
  };

  const handleReportView = () => {
    setLoader(true);
    GetSRNshortageReport(
      {
        fromDate: fromDate,
        toDate: toDate,
        type: selectedRadio,
        view: selectedStatus,
        items: selectedItem,
        locations: selectedLocation,
      },
      handleGetReportSuccess,
      handleGetReportException
    );
  };

  const handleGetReportSuccess = (dataObject) => {
    setLoader(false);
    console.log(dataObject.data);
    setJobWorkReportData(dataObject?.data || []);
  };
  const handleGetReportException = () => {
    setLoader(false);
  };

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

  // const handleDownload = () => {
  //   // Flatten data to match the frontend table structure
  //   const formattedData = jobworkReportData.map((data) => ({
  //     "Request By": data?.requestedBy,
  //     "SRN No	": data?.srnNo,
  //     "SRN Date": data?.srnDate,
  //     "Loc Name": data?.location,
  //     "Sitem Code": data?.itemCode,
  //     "Sitem Name": data?.itemName,
  //     "Category": data?.category,
  //     UOM: data?.uom,
  //     "FIM": data?.fim,
  //     "SRN Qty": data?.srnQty,
  //     "Pending Qty": data?.pendingQty,
  //     // ...(selectedRadio === 'Detailed' ? {
  //     //     "Inv No": data?.invoiceNo,
  //     //     "Inv Date": data?.invoiceDate,
  //     //     "DC No": data?.dcNo,
  //     //     "DC Date": data?.dcDate,
  //     // } : {}),
  //     // "Date Diff": data?.dateDiff,
  //     // ...(selectedRadio === 'Detailed' ? {
  //     //     "Rcpt Qty": data?.rcpQty
  //     // } : {}),
  //     QOH: data?.totStk,
  //     Shortag: data?.shortage,
  //   }));

  //   const workbook = arrayToWorksheet(formattedData);
  //   downloadExcelFile(workbook, "SRN Shortage Report.xlsx");
  // };
  const handleDownload = () => {
    // Flatten data to match the frontend table structure
    const formattedData = jobworkReportData.map((data) => ({
      "Request By": data?.requestedBy,
      "SRN No	": data?.srnNo,
      "SRN Date": data?.srnDate,
      "Loc Name": data?.location,
      "Sitem Code": data?.itemCode,
      "Sitem Name": data?.itemName,
      "Category": data?.category,
      UOM: data?.uom,

      // Numeric conversions
      "FIM": data?.fim || '',
      "SRN Qty": Number(data?.srnQty || 0),
      "Pending Qty": Number(data?.pendingQty || 0),

      // More numeric fields
      QOH: Number(data?.totStk || 0),
      Shortag: Number(data?.shortage || 0),
    }));

    const workbook = arrayToWorksheet(formattedData);
    downloadExcelFile(workbook, "SRN Shortage Report.xlsx");
  };

  // LOCATION DROPDOWN
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedLocation(typeof value === "string" ? value.split(",") : value);
  };

  // FILTER TABLE DATA
  const handleFilterChange = (e, key) => {
    setFilters({ ...filters, [key]: e.target.value });
  };

  const [filteredData, setFilteredData] = useState(() =>
    jobworkReportData.filter((item) =>
      Object.keys(filters).every((key) => {
        const filterValue = filters[key].replace(/\s/g, "").toLowerCase();
        const itemValue = String(item[key] ?? "")
          .replace(/\s/g, "")
          .toLowerCase();
        return itemValue.includes(filterValue);
        // return itemValue.startsWith(filterValue);
      })
    )
  );

  useEffect(() => {
    const updatedData = jobworkReportData.filter((item) =>
      Object.keys(filters).every((key) => {
        const filterValue = filters[key].replace(/\s/g, "").toLowerCase();
        const itemValue = String(item[key] ?? "")
          .replace(/\s/g, "")
          .toLowerCase();
        return itemValue.includes(filterValue);
        // return itemValue.startsWith(filterValue);
      })
    );
    setFilteredData(updatedData);
  }, [jobworkReportData, filters]);

  // SHOW FILTER HEADER
  const handleMouseEnter = useCallback(() => setShowFilter(true), []);
  const handleMouseLeave = useCallback(() => setShowFilter(false), []);

  // THIS PAGINATION CODE
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50; // Adjust based on performance
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
          SRN Shortage Report
        </Typography>
      </div>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Grid container alignItems={"center"} spacing={2}>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={2}
              style={{ display: "flex", justifyContent: "flex-start" }}
            >
              <TextField
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
                fullWidth
                onChange={handleFromDateChange}
              // inputProps={{
              //   min: fyFrom,
              //   max: fyTo,
              // }}
              />
              <TextField
                id="outlined-basic"
                type="date"
                label="To"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                  style: { color: "#000000", fontWeight: "bold" },
                }}
                size="small"
                value={toDate}
                fullWidth
                onChange={(e) => setTodate(e.target.value)}
              // inputProps={{
              //   min: fyFrom,
              //   max: fyTo,
              // }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              lg={3}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={selectedRadio}
                  onChange={(e) => {
                    setSelectedRadio(e.target.value);
                    setJobWorkReportData([]);
                  }}
                >
                  <FormControlLabel
                    value="Detailed"
                    control={<Radio />}
                    label="Detailed"
                  />
                  <FormControlLabel
                    value="Summary"
                    control={<Radio />}
                    label="Summary"
                  />
                </RadioGroup>
              </FormControl>

              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setJobWorkReportData([]);
                  }}
                >
                  <FormControlLabel
                    value="All"
                    control={<Radio />}
                    label="All"
                  />
                  <FormControlLabel
                    value="Shortage"
                    control={<Radio />}
                    label="Shortage"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={2}>
              <Autocomplete
                multiple
                disablePortal
                options={itemList}
                // getOptionLabel={(option) => option.title}
                // sx={{ width: 300 }}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Item"
                    onChange={handleItemChange}
                  />
                )}
                onChange={(event, value) => handleItemSelect(value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={2}>
              <FormControl fullWidth style={{ marginTop: "1px" }}>
                <InputLabel id="demo-multiple-checkbox-label">
                  Location
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={selectedLocation}
                  onChange={handleChange}
                  input={<OutlinedInput label="Location" />}
                  renderValue={(selected) => {
                    const selectedNames = filterLocationList
                      .filter((location) => selected.includes(location.id))
                      .map((location) => location.name);
                    return selectedNames.join(", ");
                  }}
                  MenuProps={MenuProps}
                  size="small"
                >
                  {filterLocationList.map((value, key) => (
                    <MenuItem key={key} value={value.id}>
                      <Checkbox
                        checked={selectedLocation.indexOf(value.id) > -1}
                      />
                      <ListItemText primary={value.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={3}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                columnGap: "20px",
              }}
            >
              <Button
                variant="contained"
                style={{ backgroundColor: "#002D68" }}
                onClick={handleReportView}
                disabled={loader === true}
              >
                {/* View */}
                {loader ? (
                  <CircularProgress size={24} style={{ color: 'white' }} />
                ) : "View"}
              </Button>

              <Button
                style={{
                  background:
                    jobworkReportData.length === 0 ? "gray" : "#002D68",
                  color: "#fff",
                }}
                variant="contained"
                disabled={jobworkReportData.length === 0}
                onClick={handleDownload}
              >
                Export to Excel
              </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Box
                sx={{
                  height: screenHeight - 345,
                  width: "100%",
                  overflow: "auto",
                }}
              >
                {loader && (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress />
                  </Box>
                )}
                <table
                  id="purchase"
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    zoom: "80%",
                  }}
                >
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      background: "white",
                      zIndex: 1,
                    }}
                  >
                    {showFilter && (
                      <tr
                        onMouseOver={handleMouseEnter}
                        onMouseOut={handleMouseLeave}
                      >
                        {Object.keys(filters).map((key, index) => (
                          <th
                            key={index}
                            style={{ width: "150px", whiteSpace: "nowrap" }}
                          >
                            <input
                              type="text"
                              placeholder={`Filter ${key}`}
                              value={filters[key]}
                              onChange={(e) => handleFilterChange(e, key)}
                              style={{
                                width: "100%",
                                padding: "4px",
                                boxSizing: "border-box",
                              }}
                            />
                          </th>
                        ))}
                      </tr>
                    )}
                    <tr
                      onMouseOver={handleMouseEnter}
                      onMouseOut={handleMouseLeave}
                    >
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Request By
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        SRN No
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        SRN Date
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Loc Name
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Item Code
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Item Name
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Category
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        UOM
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        FIM
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        SRN Qty
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Pending Qty
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        QOH
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Shortag
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item, itemKey) => (
                      <tr key={itemKey} style={{ width: "150px" }}>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {item.requestedBy}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {item.srnNo}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {item.srnDate}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {item.location}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {item.itemCode}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {item.itemName}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {item.category}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {item.uom}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {item.fim}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {item.srnQty}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {item.pendingQty}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {item.totStk}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {item.shortage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Grid>
          </Grid>
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
          {paginatedData?.length} of {jobworkReportData?.length} | Page{" "}
          {currentPage}{" "}
        </span>
        <button
          disabled={currentPage === Math.ceil(filteredData.length / pageSize)}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
};
export default SRNShortageReport;
