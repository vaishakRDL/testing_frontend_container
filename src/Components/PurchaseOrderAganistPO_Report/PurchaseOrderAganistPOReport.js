import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
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
  GetPuchaseOrderAganistPOReport,
  PurchaseOrderGroup,
} from "../../ApiService/LoginPageService";
import "./PurchaseOrderAganistPO.css";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const PurchaseOrderAganistPOReport = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
  const [itemGroupLists, setItemGroupLists] = useState([]);
  const [selectedItemGroup, setSelectedItemGroup] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = React.useState("1");
  const [selectedValue, setSelectedValue] = useState("0");

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

  const handleGroupChange = (value) => {
    if (value !== null) {
      const idArray = value.map((item) => item.id);
      setSelectedItemGroup(idArray);
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
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

  const handleReportTypeChange = (event) => {
    console.log("Changed to:", event.target.value);
    setReportType(event.target.value);
  };

  const handleReportView = (requestedPage = 1) => {
    setLoader(true);
    setLoading(true);
    GetPuchaseOrderAganistPOReport(
      {
        from: fromDate,
        to: toDate,
        supplier: selectedSupplier,
        items: selectedItem,
        itmGrp: selectedItemGroup,
        type: reportType,
        category: selectedValue,
        page: requestedPage,

      },
      // handleGetReportSuccess,
      (dataObject) => handleGetReportSuccess(dataObject, requestedPage),

      handleGetReportException
    );
  };

  const handleGetReportSuccess = (dataObject, requestedPage) => {
    setLoader(false);
    setTotalPages(dataObject.totalPages || 1);         // Store total pages from API (adjust field name)
    setPage(dataObject.page);
    setPoReportData(dataObject?.data || []);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const handleGetReportException = () => {
    setLoader(false);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  /////////////////////////////////////

  const arrayToWorksheet = (array) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("PO Detailed Report");

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
  //   const formattedData = poReportData.map((item) => ({
  //     "SI No": item.sNo,
  //     "PB Number": item.poNo,
  //     "PB Date": item.poDate,
  //     "Supplier Invoice Number": item.suppInvNo,
  //     "Supplier Invoice Date": item.suppInvoiceDate,
  //     "Supplier Name": item.spName,
  //     "Referance No Date": item.refNoDate,
  //     "Item Code": item.itemCode,
  //     "Item Name": item.itemName,
  //     "Item Group": item.itemGroup,
  //     "Product Family": item.productFamily,
  //     "Supplier Description": item.suppDesc,
  //     "Schedule Date": item.schDate,
  //     "Supplier DCNo": item.csSuppDcNo,
  //     "Supplier DC Date": item.suppDcDate,
  //     "BOENO": item.boeNo,
  //     "BOE Date": item.boeDate,
  //     "GRS Amount": item.grossAmountINR,
  //     "Total Qty": item.poQty,
  //     "Transport": item.transport,
  //     "COOLIE": item.coolie,
  //     "CGST Per": item.cgstPer,
  //     "CGST Amt": item.cgst,
  //     "SGST Per": item.sgstPer,
  //     "SGST Amt": item.sgst,
  //     "IGST Per": item.igstPer,
  //     "IGST Amt": item.igst,
  //     "UTGST Per": item.utgstPer,
  //     "UTGST Amt": item.utgst,
  //     "Other Amt": item.others,
  //     "QC AuthBy": item.qcAuthorizeBy,
  //     "QC Remarks": item.qcRemarks,
  //     "EXG Rate": item.exgRate,
  //     "CURID": item.currencyCode,
  //     "CURCode": item.currencyCode,
  //     "GRSAMTINR": item.grossAmountINR,
  //     "MISCCHGS": item.miscCharges,
  //     "TOTGRSMISC": item.grandTotal,
  //     "INSPER": "-",
  //     "INSAMT": "-",
  //     "FREAMT": item.lndRate,
  //     "TOTINSFRT": item.lndCost,
  //     "BCDPER": item.bcdPer,
  //     "BCDAMT": item.bcd,
  //     "SWCPER": item.swcPer,
  //     "SWCAMT": item.socialWelfareCharges,
  //     "TOTSWBCD": item.subTotalSwAndBCD,
  //     "IMPGSTPER": item.importGstPer,
  //     "IMPGSTAMT": item.importGST,
  //     "TOTGST": item.totalWithGST,
  //     "FCHGS": item.freightCharges,
  //     "LOCCLRCHGS": item.localClearanceCharges,
  //     "DISCAMT": item.lessDiscount,
  //     "GRANDTOT": item.grandTotal,
  //     "ITEMGROUPCODE": item.itemGroup,
  //     "PRINTPONO": item.printPoNo,
  //     "SCHDATE": item.schDate,
  //     "INV Qty": item.invQty,
  //     "RCVD Qty": item.rcvdQty,
  //     "PB Qty": item.accQty,
  //     "PO Qty": item.poQty,
  //     "Rejected Qty": item.rejQty,
  //     "UOM Code": item.uomName,
  //     "INR Rate": item.pbRate,
  //     "INR Amount": item.pbAmt,
  //     "GST": item.gstNo,
  //     "Remarks": item.itemRemarks || "-",
  //     "GRNREFNO": item.grnRefNO,
  //     "Accountable": item.accountable === 1 ? "Y" : "N",
  //     "Addded By": item.user,
  //     "Auth By": item.firstAuthBy || "-",
  //     "Auth By 2": item.secondAuthBy || "-"
  //   }));

  //   const workbook = arrayToWorksheet(formattedData);
  //   downloadExcelFile(workbook, "PO Detailed Report.xlsx");
  // };
  const handleDownload = () => {
    const formattedData = poReportData.map((item) => ({
      "SI No": Number(item.sNo || 0),
      "PB Number": item.poNo,
      "PB Date": item.poDate,
      "Supplier Invoice Number": item.suppInvNo,
      "Supplier Invoice Date": item.suppInvoiceDate,
      "Supplier Name": item.spName,
      "Referance No Date": item.refNoDate,
      "Item Code": item.itemCode,
      "Item Name": item.itemName,
      "Item Group": item.itemGroup,
      "Product Family": item.productFamily,
      "Supplier Description": item.suppDesc,
      "Schedule Date": item.schDate,
      "Supplier DCNo": item.csSuppDcNo,
      "Supplier DC Date": item.suppDcDate,
      "BOENO": item.boeNo,
      "BOE Date": item.boeDate,

      // numeric
      "GRS Amount": Number(item.grossAmountINR || 0),
      "Total Qty": Number(item.poQty || 0),
      "Transport": Number(item.transport || 0),
      "COOLIE": Number(item.coolie || 0),

      "CGST Per": Number(item.cgstPer || 0),
      "CGST Amt": Number(item.cgst || 0),
      "SGST Per": Number(item.sgstPer || 0),
      "SGST Amt": Number(item.sgst || 0),
      "IGST Per": Number(item.igstPer || 0),
      "IGST Amt": Number(item.igst || 0),
      "UTGST Per": Number(item.utgstPer || 0),
      "UTGST Amt": Number(item.utgst || 0),

      "Other Amt": Number(item.others || 0),

      "QC AuthBy": item.qcAuthorizeBy,
      "QC Remarks": item.qcRemarks,

      // numeric
      "EXG Rate": Number(item.exgRate || 0),
      "CURID": item.currencyCode,
      "CURCode": item.currencyCode,
      "GRSAMTINR": Number(item.grossAmountINR || 0),
      "MISCCHGS": Number(item.miscCharges || 0),
      "TOTGRSMISC": Number(item.grandTotal || 0),

      "INSPER": "-",
      "INSAMT": "-",

      "FREAMT": Number(item.lndRate || 0),
      "TOTINSFRT": Number(item.lndCost || 0),

      "BCDPER": Number(item.bcdPer || 0),
      "BCDAMT": Number(item.bcd || 0),
      "SWCPER": Number(item.swcPer || 0),
      "SWCAMT": Number(item.socialWelfareCharges || 0),
      "TOTSWBCD": Number(item.subTotalSwAndBCD || 0),

      "IMPGSTPER": Number(item.importGstPer || 0),
      "IMPGSTAMT": Number(item.importGST || 0),
      "TOTGST": Number(item.totalWithGST || 0),

      "FCHGS": Number(item.freightCharges || 0),
      "LOCCLRCHGS": Number(item.localClearanceCharges || 0),
      "DISCAMT": Number(item.lessDiscount || 0),
      "GRANDTOT": Number(item.grandTotal || 0),

      "ITEMGROUPCODE": item.itemGroup,
      "PRINTPONO": item.printPoNo,
      "SCHDATE": item.schDate,

      // numeric
      "INV Qty": Number(item.invQty || 0),
      "RCVD Qty": Number(item.rcvdQty || 0),
      "PB Qty": Number(item.accQty || 0),
      "PO Qty": Number(item.poQty || 0),
      "Rejected Qty": Number(item.rejQty || 0),

      "UOM Code": item.uomName,

      // numeric
      "INR Rate": Number(item.pbRate || 0),
      "INR Amount": Number(item.pbAmt || 0),

      "GST": item.gstNo,
      "Remarks": item.itemRemarks || "-",
      "GRNREFNO": item.grnRefNO,

      "Accountable": item.accountable === 1 ? "Y" : "N",
      "Addded By": item.user,
      "Auth By": item.firstAuthBy || "-",
      "Auth By 2": item.secondAuthBy || "-"
    }));

    const workbook = arrayToWorksheet(formattedData);
    downloadExcelFile(workbook, "PO Detailed Report.xlsx");
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
          Purchase Bill Detailed Report
        </Typography>
      </div>
      <Card sx={{ minWidth: 275 }}>
        {loading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
        )}
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

            <Grid item xs={12} sm={3.5} md={3.5} lg={3.5}>
              {/* <RadioGroup
    row
    value={reportType}
    onChange={handleReportTypeChange}
    style={{ marginLeft: "10px" }}
  >
    <FormControlLabel
      value="2"
      control={<Radio />}
      label="Both"
    />
    <FormControlLabel
      value="1"
      control={<Radio />}
      label="Accountable"
    />
    <FormControlLabel
      value="0"
      control={<Radio />}
      label="Non Accountable"
    />
  </RadioGroup> */}
              <FormControl fullWidth sx={{ minWidth: 200 }}>
                <InputLabel id="demo-simple-select-label">
                  Choose Option
                </InputLabel>
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
                  <MenuItem value={"2"}>Both</MenuItem>
                  <MenuItem value={"1"}>Accountable</MenuItem>
                  <MenuItem value={"0"}>Non Accountable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="demo-simple-select-label">
                  Choose Option
                </InputLabel>
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
                  <MenuItem value={"0"}>Both</MenuItem>
                  <MenuItem value={"1"}>With PO</MenuItem>
                  <MenuItem value={"2"}>Without PO</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3} md={3} lg={3}>
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
            <Grid item xs={12} sm={3} md={3} lg={3}>
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
            <Grid item xs={12} sm={3} md={3} lg={3}>
              <Autocomplete
                fullWidth
                size="small"
                multiple
                id="item-group-dropdown"
                options={itemGroupLists}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField {...params} label="Selected Item Group" />
                )}
                onChange={(event, value) => handleGroupChange(value)}
              />
            </Grid>

            <Grid item xs={12} sm={1} md={1} lg={1}>
              <Button
                variant="contained"
                style={{ backgroundColor: "#002D68" }}
                onClick={() => handleReportView(1)}              >
                {loading ? (
                  <CircularProgress size={24} style={{ color: "white" }} />
                ) : (
                  "View"
                )}
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
                  height: screenHeight - 435,
                  width: "100%",
                  overflow: "auto",
                }}
              >
                <table id="purchase">
                  <thead>
                    <tr>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        SI No
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        PB Number
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        {" "}
                        PB Date
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        {" "}
                        Supplier Invoice Number
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        {" "}
                        Supplier Invoice Date
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Supplier Name
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Referance No Date
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Item Code
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Item Name
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Item Group
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Product Family
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Supplier Description
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Schedule Date
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Supplier DCNo
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Supplier DC Date
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        BOENO
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        BOE Date
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        GRS Amount
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Total Qty
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Transport
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        COOLIE
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        CGST Per
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        CGST Amt
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        SGST Per
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        SGST Amt
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        IGST Per
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        IGST Amt
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        UTGST Per
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        UTGST Amt
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Other Amt
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        QC AuthBy
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        QC Remarks
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        EXG Rate
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        CURID
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        CURCode
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
                        INSPER
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        INSAMT
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        FREAMT
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
                        SWCAMT
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        TOTSWBCD
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        IMPGSTPER
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        IMPGSTAMT
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
                        DISCAMT
                      </th>
                      {/* <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                      TOTIMPAMT
                      </th> */}
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        GRANDTOT
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        ITEMGROUPCODE
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        PRINTPONO
                      </th>
                      {/* <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        REFNONDATE
                      </th> */}
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        SCHDATE
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        INV Qty
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        RCVD Qty
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        PB Qty
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        PO Qty
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Rejected Qty
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        UOM Code
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        INR Rate
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        INR Amount
                      </th>

                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        GST
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Remarks
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        GRNREFNO
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Accountable
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Addded By
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Auth By
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        Auth By 2
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {poReportData.map((item, index) => (
                      <tr key={item.detailId}>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.sNo}</td> {/* Print PB Number (using poNo) */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.poNo}</td> {/* Print PB Number (using poNo) */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.poDate}</td> {/* PB Date */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.suppInvNo}</td> {/* Supplier Invoice Number */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.suppInvoiceDate}</td> {/* Supplier Invoice Date */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.spName}</td> {/* Supplier Name */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.refNoDate}</td> {/* Reference No Date */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.itemCode}</td> {/* Item Code */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.itemName}</td> {/* Item Name */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.itemGroup}</td> {/* Item Group */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.productFamily}</td> {/* Product Family */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.suppDesc}</td> {/* Supplier Description */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.schDate}</td> {/* Schedule Date */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.csSuppDcNo}</td> {/* Supplier DC No */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.suppDcDate}</td> {/* Supplier DC Date */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.boeNo}</td> {/* BOE No (Not in response) */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.boeDate}</td> {/* BOE Date (Not in response) */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.grossAmountINR}</td> {/* GRS Amount */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.poQty}</td> {/* Total Qty */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.transport}</td> {/* Transport */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.coolie}</td> {/* Coolie */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.cgstPer}</td> {/* CGST Per */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.cgst}</td> {/* CGST Amt */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.sgstPer}</td> {/* SGST Per */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.sgst}</td> {/* SGST Amt */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.igstPer}</td> {/* IGST Per */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.igst}</td> {/* IGST Amt */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.utgstPer}</td> {/* UTGST Per */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.utgst}</td> {/* UTGST Amt */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.others}</td> {/* Other Amt */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.qcAuthorizeBy}</td> {/* QC AuthBy */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.qcRemarks}</td> {/* QC Remarks */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.exgRate}</td> {/* EXG Rate */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.currencyCode}</td> {/* CURID / CURCode */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.currencyCode}</td> {/* CURCode */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.grossAmountINR}</td> {/* GRSAMTINR */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.miscCharges}</td> {/* MISCCHGS (Not in response) */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.grandTotal}</td> {/* TOTGRSMISC (using Grand Total) */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>-</td> {/* INSPER */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>-</td> {/* INSAMT */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.lndRate}</td> {/* FREAMT (Using Lnd Rate) */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.lndCost}</td> {/* TOTINSFRT (Using Lnd Cost) */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.bcdPer}</td> {/* BCDPER */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.bcd}</td> {/* BCDAMT */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.swcPer}</td> {/* SWCPER */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.socialWelfareCharges}</td> {/* SWCAMT */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.subTotalSwAndBCD}</td> {/* TOTSWBCD */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.importGstPer}</td> {/* IMPGSTPER */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.importGST}</td> {/* IMPGSTAMT */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.totalWithGST}</td> {/* TOTGST */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.freightCharges}</td> {/* FCHGS */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.localClearanceCharges}</td> {/* LOCCLRCHGS */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.lessDiscount}</td> {/* DISCAMT */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.grandTotal}</td> {/* GRANDTOT */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.itemGroup}</td> {/* ITEMGROUPCODE */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.printPoNo}</td> {/* PRINTPONO */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.schDate}</td> {/* SCHDATE */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.invQty}</td> {/* INV Qty */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.rcvdQty}</td> {/* RCVD Qty */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.accQty}</td> {/* PB Qty (using pbAmt) */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.poQty}</td> {/* PO Qty */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.rejQty}</td> {/* Rejected Qty */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.uomName}</td> {/* UOM Code */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.pbRate}</td> {/* INR Rate (Using pbRate) */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.pbAmt}</td> {/* INR Amount */}

                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.gstNo}</td> {/* GST */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.itemRemarks || "-"}</td> {/* Remarks */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.grnRefNO}</td> {/* GRNREFNO */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.accountable === 1 ? "Y" : "N"}</td> {/* GRNZERO */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.user}</td> {/* Added By */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.firstAuthBy || "-"}</td> {/* Auth By */}
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>{item.secondAuthBy || "-"}</td> {/* Auth By 2 */}
                      </tr>


                    ))}
                  </tbody>

                </table>
              </Box>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end" style={{ marginTop: '15px' }}>
            {/* <Button
              variant="contained"
              disabled={page === 1}
              onClick={() => handleReportView(page - 1)}
              style={{ marginRight: '10px' }}
            >
              Previous
            </Button> */}

            {/* <Typography style={{ fontWeight: 'bold', margin: '0 10px' }}>
              Page {page} of {totalPages}
            </Typography>

            <Button
              variant="contained"
              disabled={page === totalPages}
              onClick={() => handleReportView(page + 1)}
              style={{ marginLeft: '10px' }}
            >
              Next
            </Button> */}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};
export default PurchaseOrderAganistPOReport;
