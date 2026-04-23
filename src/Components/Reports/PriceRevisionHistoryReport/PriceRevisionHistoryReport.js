// import {
//   Button,
//   TextField,
//   Grid,
//   FormControlLabel,
//   Checkbox,
//   CardContent,
//   Typography,
//   FormGroup,
//   Autocomplete,
//   Box,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";
// import { Card } from "react-bootstrap";
// import { DataGrid } from "@mui/x-data-grid";
// import PriceRevisionHistoryReportTitle from "./PriceRevisionHistoryReportTitle";
// import { GetPOSupplierList, GetPriceRevision, GetPriceRevisionData } from "../../../ApiService/LoginPageService";
// import { DownloadSuppVsItemPriceRevisionExl } from '../../../ApiService/DownloadCsvReportsService';
// import '../../../App.css';

// const PriceRevisionHistoryReport = ({
//   open,
//   setOpen,
//   isAddButton,
//   editeData,
//   setRefreshData,
// }) => {
//   const [openNotification, setNotification] = useState({
//     status: false,
//     type: "error",
//     message: "",
//   });

//   //NEW STATE
//   const [todate, settodate] = useState("");
//   const [fromDate, setfromdate] = useState("");
//   const [spName, setSpName] = useState("");

//   const [rowId, setRowId] = useState("");
//   const [row, setRow] = useState([]);
//   const [PriceRevision, setPriceRevision] = useState([]);

//   const url = "http://192.168.1.149:8000/";
//   //END NEW STATE



//   const handleSubmit = (e) => {
//     e.preventDefault();
//   };

//   const loaderData = () => {
//     setRowId(editeData?.id || "");
//   };

//   const handleClose = () => {
//     setNotification({
//       status: false,
//       type: "",
//       message: "",
//     });
//   };

//   //MIDDLE GRID COLUMNS
//   const middleGridColumns = [
//     {
//       field: "suppName",
//       headerClassName: 'super-app-theme--header',
//       headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier Name</span>,
//       type: "string",
//       sortable: true,
//       minWidth: 80,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "spCode",
//       headerClassName: 'super-app-theme--header',
//       headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier Code</span>,
//       type: "string",
//       sortable: true,
//       minWidth: 80,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "remarks",
//       headerClassName: 'super-app-theme--header',
//       headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
//       type: "string",
//       sortable: true,
//       minWidth: 100,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "preRate",
//       headerClassName: 'super-app-theme--header',
//       headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Previous Rate</span>,
//       type: "number",
//       sortable: true,
//       sortable: false,
//       minWidth: 100,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "newRate",
//       headerClassName: 'super-app-theme--header',
//       headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>New Rate</span>,
//       type: "string",
//       sortable: true,
//       minWidth: 80,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "itemName",
//       headerClassName: 'super-app-theme--header',
//       headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Name</span>,
//       type: "string",
//       sortable: true,
//       minWidth: 80,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },

//     {
//       field: "changedBy",
//       headerClassName: 'super-app-theme--header',
//       headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Changed Date</span>,
//       type: "string",
//       sortable: true,
//       minWidth: 80,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },

//   ];



//   function handleSupplierAutocompleteChange(selectedValue) {
//     // console.log("SELECTED VALUE", selectedValue.label);
//     setSpName(selectedValue?.id)
//     GetPriceRevisionData({ spName: selectedValue?.id, fromDate: fromDate, toDate: todate }, handleGetPriceRevisionDataSuccess, handleGetPriceRevisionDataFailed)

//   }

//   const handleGetPriceRevisionDataSuccess = (dataObject) => {
//     setRow(dataObject?.data || []);
//   }

//   console.log("row", row)

//   const handleGetPriceRevisionDataFailed = (dataObject) => {

//   }


//   useEffect(() => {
//     GetPriceRevision(handleGetPriceRevisionListSuccess, handleGetPriceRevisionListFailed)
//     loaderData();
//   }, [editeData]);



//   //LOAD THE SUPPLIER LIST IN AUTO COMPLETE FIELD
//   const handleGetPriceRevisionListSuccess = (dataObject) => {
//     setPriceRevision(dataObject?.data || []);
//     // setGridLoading(false);
//     console.log("dataObject", dataObject)
//   }
//   const handleGetPriceRevisionListFailed = (errorObject, errorMessage) => {
//   }

//   const optionsSuppList = PriceRevision.map(item => ({
//     id: item.id,
//     spCode: item.spCode,
//     label: item.spName,
//     spAddress: item.spAddress,
//     currency: item.currency,
//     currencyId: item.currencyId
//   }));

//   const priceRevisionExDownload = () => {
//     DownloadSuppVsItemPriceRevisionExl({
//       spName: spName,
//       // itemName: "",
//       fromDate: fromDate,
//       toDate: todate
//     }, exDownloadSuccess, exDownloadFailed)
//   }

//   const exDownloadSuccess = () => {
//     setNotification({
//       status: true,
//       type: 'success',
//       // message: dataObject.message,
//       message: "Excel Download Success",
//     });
//     setTimeout(() => {
//       handleClose();
//     }, 3000);
//   };

//   const exDownloadFailed = (errorObject, errorMessage) => {
//     setNotification({
//       status: true,
//       type: 'error',
//       message: errorMessage,
//     });
//     setTimeout(() => {
//       // handleClose();
//     }, 3000);
//   };

//   return (
//     <div style={{ marginLeft: "25px", marginRight: "25px" }}>
//       <PriceRevisionHistoryReportTitle />
//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
//             {/* <Card
//               style={{
//                 boxShadow: "0 10px 10px 10px rgba(0, 0, 0, 0.2)",
//                 borderRadius: "10px",
//                 width: "100%",
//                 height: "100%",
//               }}
//             >
//               <CardContent> */}
//                 <Grid container spacing={2}>
//                   <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
//                     <Grid container spacing={2}>
//                       <Grid
//                         item
//                         xs={12} sm={1.5} md={1.5} lg={1.5}
//                         style={{
//                           display: "flex",
//                           justifyContent: "flex-start",

//                         }}
//                       >
//                          <TextField
//                                 id="outlined-basic"
//                                 type="date"
//                                 label="From"
//                                 variant="outlined"
//                                 style={{ marginRight: '10px' }}
//                                 InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
//                                 size="small"
//                                 value={fromDate}
//                                 onChange={(e) => setfromdate(e.target.value)}
//                             />
//                       </Grid>

//                       <Grid item  xs={12} sm={1.5} md={1.5} lg={1.5}>

//                          <TextField
//                                 id="outlined-basic"
//                                 type="date"
//                                 label="To"
//                                 variant="outlined"
//                                 InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
//                                 size="small"
//                                 value={todate}
//                                 onChange={(e) => settodate(e.target.value)}
//                             />
//                       </Grid>

//                       <Grid item xs={12} sm={12} md={3} lg={4} xl={4}>
//                         <Autocomplete
//                           disablePortal
//                           id="combo-box-demo"
//                           options={optionsSuppList}
//                           // fullWidth
//                           size="small"
//                           renderInput={(params) => (
//                             <TextField {...params} label="Search Supplier" />
//                           )}
//                           onChange={(event, value) =>
//                             handleSupplierAutocompleteChange(value)
//                           }
//                         />
//                       </Grid>

//                       <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>
//                       {/* <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
//                         <Button variant="contained">View</Button>
//                       </Grid> */}
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               {/* </CardContent>
//             </Card> */}
//           </Grid>
//         </Grid>

//         <Grid container marginTop={5} marginBottom={10}>
//           <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
//             <Card
//               style={{
//                 boxShadow: "0 10px 10px 10px rgba(0, 0, 0, 0.2)",
//                 borderRadius: "10px",
//                 width: "100%",
//                 height: "100%",
//               }}
//             >
//               <CardContent>
//                 <Box
//                   sx={{
//                     height: '150%',
//                     width: '100%',
//                     '& .super-app-theme--header': {
//                       backgroundColor: '#93bce6',
//                       color: '#1c1919'
//                     },
//                   }}
//                 >
//                   <DataGrid
//                     rows={row}
//                     columns={middleGridColumns}
//                     pageSize={8}
//                     // loading={isLoading}
//                     rowsPerPageOptions={[8]}
//                     disableSelectionOnClick
//                     style={{ border: "none" }}
//                     sx={{
//                       overflow: "auto",
//                       height: "50vh",
//                       width: "100%",
//                       "& .super-app-theme--header": {
//                         WebkitTextStrokeWidth: "0.6px",
//                       },
//                       '& .MuiDataGrid-cell': {
//                         border: '0.5px solid #000',
//                       },
//                       '& .MuiDataGrid-columnHeader': {
//                         border: '0.5px solid #000', // Add border to column headers
//                       },
//                     }}
//                     getRowClassName={(params) => {
//                       // Find the index of the row within the rows array
//                       const rowIndex = row.findIndex(row => row.id === params.row.id);
//                       // Check if the index is valid
//                       if (rowIndex !== -1) {
//                         console.log(' ');
//                         return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
//                       }
//                       return ''; // Return default class if index is not found
//                     }}
//                     rowHeight={40}
//                     columnHeaderHeight={40}
//                   />

//                   <Grid container>
//                     <Grid item>
//                       <Button variant="contained" disabled={row.length > 0 ? false : true} onClick={priceRevisionExDownload}>Save As XL</Button>
//                     </Grid>
//                   </Grid>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </form>
//       <NotificationBar
//         handleClose={handleClose}
//         notificationContent={openNotification.message}
//         openNotification={openNotification.status}
//         type={openNotification.type}
//       />
//     </div>
//   );
// };

// export default PriceRevisionHistoryReport;



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
  GetPriceRevisionData,
} from "../../../ApiService/LoginPageService";
import "./PriceRevisionHistoryReport.css";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";

const PriceRevisionHistoryReport = () => {
  const [itemGroupLists, setItemGroupLists] = useState([]);
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
    console.log("Changed to:", event.target.value);
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
    GetPriceRevisionData({ spName: selectedSupplier, fromDate: fromDate, toDate: toDate }, handleGetReportSuccess, handleGetReportException)
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
  //     "suppName": supp.poNo,
  //     "spCode": supp.pbDate,
  //     "remarks": supp.grnRefNO,
  //     "preRate": supp.spName,
  //     "newRate": supp.gstNo,
  //     "itemName": supp.suppInvNo,
  //     "changedBy": supp.suppInvoiceDate,
  //   }));

  //   const workbook = arrayToWorksheet(formattedData);
  //   downloadExcelFile(workbook, "PO Summary Report.xlsx");
  // };
  const handleDownload = () => {
    // Format data to match the table structure
    const formattedData = poReportData.map((supp) => ({
      "suppName": Number(supp.poNo || 0),        // numeric
      "spCode": supp.pbDate,                     // date → keep as string
      "remarks": supp.grnRefNO,                  // text
      "preRate": supp.spName,                    // text
      "newRate": Number(supp.gstNo || 0),        // numeric
      "itemName": supp.suppInvNo,                // text
      "changedBy": supp.suppInvoiceDate,         // date
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

  // const handleFromDateChange = (e) => {
  //   const value = e.target.value;
  //   // if (isValidDateInRange(value)) {
  //     setFromDate(value);
  //   //   setNotification({ status: false, type: "", message: "" });
  //   // } else {
  //   //   setNotification({
  //   //     status: true,
  //   //     type: "error",
  //   //     message: "Please select a valid From-Date",
  //   //   });
  //   // }
  // };

  // const handleToDateChange = (e) => {
  //   const value = e.target.value;
  //   // if (isValidDateInRange(value)) {
  //     setTodate(value);
  //   //   setNotification({ status: false, type: "", message: "" });
  //   // } else {
  //   //   setNotification({
  //   //     status: true,
  //   //     type: "error",
  //   //     message: "Please select a valid To-Date",
  //   //   });
  //   // }
  // };


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
          Price Revision History Report
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
            {/* <Grid item xs={12} sm={3} md={3} lg={3}>
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
            </Grid> */}

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
              {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#FBF3D5' }}>
                                <div style={{ border: '1px solid #000000', width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '8px' }}>
                                    <Typography style={{ fontSize: '13px' }}>MALLIK ENGINEERING (INDIA) PVT LTD</Typography>
                                </div>
                                <div style={{ border: '1px solid #000000', width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '8px' }}>
                                    <Typography style={{ fontSize: '13px' }}>Purchase Order: Pending For GRN - Summary</Typography>
                                </div>
                                <div style={{ border: '1px solid #000000', width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '8px' }}>
                                    <Typography style={{ fontSize: '13px' }}>Date Range From 01 Apr 2023 To 22 Mar 2024</Typography>
                                </div>
                            </div> */}
              <Box
                sx={{
                  height: screenHeight - 400,
                  width: "100%",
                  overflow: "auto",
                }}
              >
                {/* <DataGrid
                                    rows={[]}
                                    columns={purchaseReportColumn}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 5,
                                            },
                                        },
                                    }}
                                    sx={{
                                        '& .super-app-theme--header': {
                                            backgroundColor: '#93bce6',
                                            color: '#1c1919',
                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696',
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696',
                                        },
                                    }}
                                    // getRowClassName={(params) => {
                                    //     const rowIndex = reportLists.findIndex(row => row.id === params.row.id);
                                    //     if (rowIndex !== -1) {
                                    //         console.log(' ');
                                    //         return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    //     }
                                    //     return '';
                                    // }}
                                    pageSizeOptions={[5]}
                                    disableRowSelectionOnClick
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                /> */}
                {/* 
                                <table id="customers">
                                    <thead>
                                        <tr>
                                            <th>Supplier</th>
                                            <th>GST No</th>
                                            <th>PO No</th>
                                            <th>PO Date</th>
                                            <th>PO Type</th>
                                            <th>Reference</th>
                                            <th>Item Group</th>
                                        </tr>
                                    </thead>
                                    {poReportData.map((supp, key) => (
                                        <tr key={key} style={{ width: '150px' }}>
                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }} >{supp.spName}</td>
                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.gst}</td>
                                            {supp.po.map((PO, key) => (
                                                <tr key={key} style={{ width: '150px' }}>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poNo}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poDate}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poType}</td>
                                                    {PO.items.map((item, key) => (
                                                        <tr key={key} style={{ width: '150px' }}>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemGroup}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppDesc}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.uom}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.qty}</td>
                                                        </tr>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tr>))}
                                </table> */}

                {/* <table id="customers">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '150px' }}>Supplier Name</th>
                                            <th style={{ width: '150px' }}>GST</th>
                                            <th style={{ width: '150px' }}>PO Number</th>
                                            <th style={{ width: '150px' }}>PO Date</th>
                                            <th style={{ width: '150px' }}>PO Type</th>
                                            <th style={{ width: '150px' }}>Item Group</th>
                                            <th style={{ width: '150px' }}>Item Code</th>
                                            <th style={{ width: '150px' }}>Item Name</th>
                                            <th style={{ width: '150px' }}>Supplier Description</th>
                                            <th style={{ width: '150px' }}>UOM</th>
                                            <th style={{ width: '150px' }}>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {poReportData.map((supp, key) => (
                                            <React.Fragment key={key}>
                                                <tr style={{ width: '150px' }}>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.spName}</td>
                                                    <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.gst}</td>
                                                    <td colSpan="9"></td>
                                                </tr>
                                                {supp.po.map((PO, poKey) => (
                                                    <React.Fragment key={poKey}>
                                                        <tr style={{ width: '150px' }}>
                                                            <td colSpan="2"></td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poNo}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poDate}</td>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poType}</td>
                                                            <td colSpan="6"></td>
                                                        </tr>
                                                        {PO.items.map((item, itemKey) => (
                                                            <tr key={itemKey} style={{ width: '150px' }}>
                                                                <td colSpan="5"></td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemGroup}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppDesc}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.uom}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.qty}</td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table> */}

                <table id="purchase">
                  <thead>
                    <tr>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        suppName
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        spCode
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        remarks
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        preRate
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        newRate
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        itemName
                      </th>
                      <th style={{ width: "150px", whiteSpace: "nowrap" }}>
                        changedBy
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {poReportData.map((supp, suppKey) => (
                      <tr key={suppKey} style={{ width: "150px" }}>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.suppName}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.spCode}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.remarks}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.preRate}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.newRate}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.itemName}
                        </td>
                        <td style={{ width: "150px", whiteSpace: "nowrap" }}>
                          {supp.changedBy}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {/* //////////////////////////////////////OLD CODE///////////////////////////////// */}
                  {/* <tbody>
                                        {poReportData.map((supp, suppKey) => (
                                            <React.Fragment key={suppKey}>
                                                {supp.po.map((PO, poKey) => (
                                                    <React.Fragment key={poKey}>
                                                        {PO.items.map((item, itemKey) => (
                                                            <tr key={itemKey} style={{ width: '150px' }}>

                                                                {itemKey === 0 && poKey === 0 ? (
                                                                    <>
                                                                        <td rowSpan={supp.po.reduce((total, po) => total + po.items.length, 0)} style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.spName}</td>
                                                                        <td rowSpan={supp.po.reduce((total, po) => total + po.items.length, 0)} style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.gst}</td>
                                                                    </>
                                                                ) : null}

                                                                {itemKey === 0 ? (
                                                                    <>
                                                                        <td rowSpan={PO.items.length} style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poNo}</td>
                                                                        <td rowSpan={PO.items.length} style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poDate}</td>
                                                                        <td rowSpan={PO.items.length} style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.poType}</td>
                                                                    </>
                                                                ) : null}

                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemGroup}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppDesc}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.schDate}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.uom}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.qty}</td>

                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.pbCumQty}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.pendingPo}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppInvNo}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppInvoiceDate}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppDcNo}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.suppDcDate}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.dateDiff}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.recptQty}</td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody> */}
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
export default PriceRevisionHistoryReport;
