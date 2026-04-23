import React, { useState, useEffect } from "react";
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
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  PurchaseReportSearchSupplier,
  PurchaseReportSearchItem,
  GetPuchaseReport,
  PurchaseOrderGroup,
  PurchaseBillWithoutPReport,
} from "../../ApiService/LoginPageService";
import "./PurchasebillWithoutReport.css";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";

const PurchasebillWithoutReport = () => {
  const [itemGroupLists, setItemGroupLists] = useState([]);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [supplierList, setSupplierList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const [toDate, setTodate] = useState(today);
  const [selectedSupplier, setSelectedSupplier] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [poReportData, setPoReportData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("Summary");
  const [selectedItemGroup, setSelectedItemGroup] = useState([]);
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = React.useState("1");
  const [selectedValue, setSelectedValue] = useState('0');
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };
    PurchaseOrderGroup(handleItemGroupSuccess, handleItemGroupException);

    // Add event listener to update height on resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleItemGroupSuccess = (dataObject) => {
    setItemGroupLists(dataObject?.data || []);
  };
  const handleItemGroupException = () => { };

  // SUPPLIER SEARCH
  const handleSupplierChange = (e) => {
    PurchaseReportSearchSupplier(
      { code: e.target.value },
      handleSearchSupplierSucessShow,
      handleSearchSupplierExceptionShow
    );
  };

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };



  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
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

  // ITEM SEARCH
  const handleItemChange = (e) => {
    PurchaseReportSearchItem(
      { code: e.target.value },
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
    setLoading(true);
    PurchaseBillWithoutPReport(
      {
        from: fromDate,
        to: toDate,
        supplier: selectedSupplier,
        type: reportType,
        category: selectedValue,
      },
      handleGetReportSuccess,
      handleGetReportException
    );
  };

  const handleGetReportSuccess = (dataObject) => {
    setLoader(false);
    console.log(dataObject.data);
    setPoReportData(dataObject?.data || []);
    setTimeout(() => {
      setLoading(false);
    }, 2000)
  };
  const handleGetReportException = () => {
    setLoader(false);
    setTimeout(() => {
      setLoading(false);
    }, 2000)
  };

  /////////////////////////////////////

  const arrayToWorksheet = (array) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("PO Summary Report");

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
  //   // Format data to match the table structure
  //   const formattedData = poReportData.map((supp) => ({
  //     "PB No": supp.poNo,
  //     "PB Date": supp.pbDate,
  //     "GRN Ref No": supp.grnRefNO,
  //     "Supplier Name": supp.spName,
  //     "GST No": supp.gstNo,
  //     "Supplier Invoice No": supp.suppInvNo,
  //     "Supplier Invoice Date": supp.suppInvoiceDate,
  //     "PO Qty": supp.poQty,
  //     "BOE No": supp.boeNo,
  //     "BOE Date": supp.boeDate,
  //     // "Gross Amount INR": supp.grossAmountINR,
  //     "Gross Amount INR": supp.grossAmount,
  //     "Total Qty": supp.totalQty,
  //     "Other Amount": supp.othersamount,
  //     "Transport": supp.transport,
  //     "Coolie": supp.coolie,
  //     "Rejected Qty": supp.rejqty,
  //     "Grand Total": supp.grandTotal,
  //     "CGST %": supp.cgstPer,
  //     "CGST Amount": supp.cgst,
  //     "IGST %": supp.igstPer,
  //     "IGST Amount": supp.igst,
  //     "UTGST %": supp.utgstPer,
  //     "UTGST Amount": supp.utgst,
  //     "SGST %": supp.sgstPer,
  //     "SGST Amount": supp.sgst,
  //     "Currency Code": supp.currencyCode,
  //     "Exchange Rate": supp.exgRate,
  //     "Gross Amount": supp.grossAmount,
  //     "Misc Charges": supp.miscCharges,
  //     "Sub Total (Gross + Misc)": supp.subTotalGrsAndMisc,
  //     "Freight Charges": supp.freightCharges,
  //     "Insurance %": supp.insurancePer,
  //     "Insurance Amount": supp.insurance,
  //     "Sub Total (Insurance + Freight)": supp.subTotalINSAndFreight,
  //     "BCD %": supp.bcdPer,
  //     "BCD Amount": supp.bcd,
  //     "SWC %": supp.swcPer,
  //     "Social Welfare Charges": supp.socialWelfareCharges,
  //     "Sub Total SW & BCD": supp.subTotalSwAndBCD,
  //     "Total with GST": supp.totalWithGST,
  //     "Freight Charges (Repeated)": supp.freightCharges,
  //     "Local Clearance Charges": supp.localClearanceCharges,
  //     "Total Import Amount": supp.totimpant,
  //     "Added By": supp.user,
  //     "QC Authorized By": supp.qcAuthorizeBy,
  //     "Remarks": supp.remarks
  //   }));

  //   const workbook = arrayToWorksheet(formattedData);
  //   downloadExcelFile(workbook, "PO Summary Report.xlsx");
  // };
  const handleDownload = () => {
    // Format data to match the table structure
    const formattedData = poReportData.map((supp) => ({
      "PB No": supp.poNo,
      "PB Date": supp.pbDate,
      "GRN Ref No": supp.grnRefNO,
      "Supplier Name": supp.spName,
      "GST No": supp.gstNo,
      "Supplier Invoice No": supp.suppInvNo,
      "Supplier Invoice Date": supp.suppInvoiceDate,

      // numeric
      "PO Qty": Number(supp.poQty || 0),

      "BOE No": supp.boeNo,
      "BOE Date": supp.boeDate,

      // numeric
      "Gross Amount INR": Number(supp.grossAmount || 0),
      "Total Qty": Number(supp.totalQty || 0),
      "Other Amount": Number(supp.othersamount || 0),
      "Transport": Number(supp.transport || 0),
      "Coolie": Number(supp.coolie || 0),
      "Rejected Qty": Number(supp.totalRejQty || 0),
      "Grand Total": Number(supp.grandTotal || 0),

      // GST numeric fields
      "CGST %": Number(supp.cgstPer || 0),
      "CGST Amount": Number(supp.cgst || 0),
      "IGST %": Number(supp.igstPer || 0),
      "IGST Amount": Number(supp.igst || 0),
      "UTGST %": Number(supp.utgstPer || 0),
      "UTGST Amount": Number(supp.utgst || 0),
      "SGST %": Number(supp.sgstPer || 0),
      "SGST Amount": Number(supp.sgst || 0),

      "Currency Code": supp.currencyCode,

      // numeric
      "Exchange Rate": Number(supp.exgRate || 0),
      "Gross Amount": Number(supp.grossAmount || 0),
      "Misc Charges": Number(supp.miscCharges || 0),
      "Sub Total (Gross + Misc)": Number(supp.subTotalGrsAndMisc || 0),
      "Freight Charges": Number(supp.freightCharges || 0),

      // numeric
      "Insurance %": Number(supp.insurancePer || 0),
      "Insurance Amount": Number(supp.insurance || 0),
      "Sub Total (Insurance + Freight)": Number(supp.subTotalINSAndFreight || 0),

      "BCD %": Number(supp.bcdPer || 0),
      "BCD Amount": Number(supp.bcd || 0),
      "SWC %": Number(supp.swcPer || 0),
      "Social Welfare Charges": Number(supp.socialWelfareCharges || 0),
      "Sub Total SW & BCD": Number(supp.subTotalSwAndBCD || 0),
      "Total with GST": Number(supp.totalWithGST || 0),

      "Freight Charges (Repeated)": Number(supp.freightCharges || 0),
      "Local Clearance Charges": Number(supp.localClearanceCharges || 0),
      "Total Import Amount": Number(supp.totimpant || 0),

      "Added By": supp.user,
      "QC Authorized By": supp.qcAuthorizeBy,
      "Remarks": supp.remarks
    }));

    const workbook = arrayToWorksheet(formattedData);
    downloadExcelFile(workbook, "PO Summary Report.xlsx");
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleGroupChange = (value) => {
    if (value !== null) {
      const idArray = value.map((item) => item.id);
      console.log("idArray", idArray);
      setSelectedItemGroup(idArray);
    }
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



  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
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
          Purchase Bill Summary Report
        </Typography>
      </div>
      <Card sx={{ minWidth: 275 }}>
        {loading &&
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        }
        <CardContent>
          <Grid container alignItems={"center"} spacing={2}>
            <Grid
              item
              xs={12}
              sm={2.5}
              md={2.5}
              lg={2.5}
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
                onChange={handleFromDateChange}
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
                onChange={(e) => setTodate(e.target.value)}
              />


            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={3} >

              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel id="demo-simple-select-label">Choose Option</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={reportType}
                  label="Choose Option"
                  onChange={handleReportTypeChange}
                  style={{ height: "40px" }}
                >
                  {/* <MenuItem value="">
          <em>None</em>
        </MenuItem> */}
                  <MenuItem value={'2'}>Both</MenuItem>
                  <MenuItem value={'1'}>Accountable</MenuItem>
                  <MenuItem value={'0'}>Non Accountable</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2} md={3} lg={2} >
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel id="demo-simple-select-label">Choose Option</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedValue}
                  label="Choose Option"
                  onChange={handleChange}
                  style={{ height: "40px" }}
                >
                  {/* <MenuItem value="">
          <em>None</em>
        </MenuItem> */}
                  <MenuItem value={'0'}>Both</MenuItem>
                  <MenuItem value={'1'}>With PO</MenuItem>
                  <MenuItem value={'2'}>Without PO</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
              <Autocomplete
                multiple
                disablePortal
                options={supplierList}
                // getOptionLabel={(option) => option.title}
                // sx={{ width: 300 }}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Supplier"
                    onChange={handleSupplierChange}
                  />
                )}
                onChange={(event, value) => handleSupplierSelect(value)}
              />
            </Grid>

            <Grid item xs={12} sm={1} md={1} lg={1} >
              <Button
                variant="contained"
                style={{ backgroundColor: "#002D68" }}
                onClick={handleReportView}
                disabled={loading === true}
              >
                {loading ? (
                  <CircularProgress size={24} style={{ color: 'white' }} />
                ) : 'View'}
              </Button>
            </Grid>
            <Grid item xs={12} sm={1.5} md={1.5} lg={1.5}>
              <Button
                style={{ background: "#002D68", color: "#fff" }}
                variant="contained"
                // disabled={rows.length === 0}
                onClick={handleDownload}
              >
                Export to Excel
              </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>

              <Box
                sx={{
                  height: screenHeight - 400,
                  width: "100%",
                  overflow: "auto",
                }}
              >
                <table id="purchase">
                  <thead>
                    <tr>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        PB No
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        PB Date
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Doc No
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Supplier Name
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        GST No
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Supply Inv No
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Supply Inv Date
                      </th>
                      {/* <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Supply Dc Rate
                      </th> */}
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        BOE No
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        BOE Date
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Gross Amount
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Total Qty
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Other Amount
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Transport
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        COOLIE
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Rej Qty
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Grand Total
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        CGST Per
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        CGST Amount
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        IGST Per
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        IGST Amount
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        UTGST Per
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        UTGST Amount
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        SGST Per
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        SGST Amount
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        CUR Code
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Exchange Rate
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        GRSAMTINR
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        MISCCHGS
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        TOTGRSMISC
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        FREAMT
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        INSPER
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        INSAMT
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        TOTINSFRT
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        BCDPER
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        BCDAMT
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        SWCPER
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        SWCAMT                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        TOTSWBCD
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        IMPGSTPER
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        TOTGST
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        FCHGS
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        LOCCLRCHGS
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        TOTIMPAMT
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        ADDEDBY
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        QCAUTHBY
                      </th>
                      {/* <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                      GRNZERO
                      </th> */}
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        REMARKS
                      </th>

                    </tr>
                  </thead>
                  <tbody>
                    {poReportData.map((supp, suppKey) => (
                      <tr key={suppKey} style={{ width: "150px" }}>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.poNo}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.pbDate}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.docType}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.spName}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.gstNo}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.suppInvNo}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.suppInvoiceDate}
                        </td>
                        {/* <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.poQty}
                        </td> */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.boeNo}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.boeDate}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {/* {supp.grossAmountINR} */}
                          {supp.grossAmount}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.totalQty}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.othersamount}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.transport}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.coolie}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.totalRejQty}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.grandTotal}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.cgstPer}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.cgst}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.igstPer}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.igst}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.utgstPer}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.utgst}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.sgstPer}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.sgst}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.currencyCode}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.exgRate}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.grossAmountINR}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.miscCharges}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.subTotalGrsAndMisc}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.freightCharges}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.insurancePer}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.insurance}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.subTotalINSAndFreight}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.bcdPer}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.bcd}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.swcPer}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.socialWelfareCharges}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.subTotalINSAndFreight}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.subTotalSwAndBCD}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.totalWithGST}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.freightCharges}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.localClearanceCharges}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.totimpant}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.user}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.qcAuthorizeBy}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.remarks}
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

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
};
export default PurchasebillWithoutReport;
