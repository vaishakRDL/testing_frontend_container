// import React, { useState, useEffect, useRef } from "react";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/DeleteOutlined";
// import {
//   Autocomplete,
//   Button,
//   Card,
//   CardContent,
//   FormControl,
//   Grid,
//   InputAdornment,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Typography,
// } from "@mui/material";
// import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
// import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
// import DispatchModule from "../Dispatch/DispatchModule";
// import "./Dispatch.css";
// import { useBeforeUnload } from "react-router-dom";
// import {
//   DispatchDashboardLock,
//   DispatchDelnoteSearch,
//   FooterdispatchDashboardShow,
//   PurchaseReportSearchItem,
//   RemarksShowData,
//   RemarksUpdate,
//   ShowDelNoteShow,
//   dispatchDashboardShow,
//   dispatchDashboardStartTime,
//   dispatchPartNoDashboardShow,
// } from "../../ApiService/LoginPageService";
// import CircularProgress from "@mui/material/CircularProgress";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { useModuleLocks } from "../context/ModuleLockContext";
// const DispatchDashboard = () => {
//   const moduleLocks = useModuleLocks();
//   const isModuleLocked =
//     moduleLocks.find(m => m.moduleName === "Dispatch Dashboard")?.lockStatus === "locked";

//   const [open, setOpen] = useState(false);
//   const [isAddButton, setIsAddButton] = useState(true);
//   const [editData, setEditData] = useState([]);

//   const [refreshData, setRefreshData] = useState(false);
//   const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState("");
//   const [DataList, setDataList] = useState([]);
//   const [selectedCell, setSelectedCell] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedButton, setSelectedButton] = useState("");
//   const [screenHeight, setScreenHeight] = useState(window.innerHeight);
//   const [startIndex, setStartIndex] = useState(0);
//   const rowsPerPage = 10;
//   const [animate, setAnimate] = useState(false);
//   const [shipmentDate, setShipmentDate] = useState(" ");
//   const [itemShowListSeach, setItemShowListSeach] = useState([]);
//   const [itemShowListHeader, setItemShowListHeader] = useState([]);
//   const [showFirstTable, setShowFirstTable] = useState(true);
//   const [showData, setShowData] = useState([]);
//   const [showPartData, setShowPartData] = useState([]);
//   const [fyFrom, setFyFrom] = useState("");
//   const [fyTo, setFyTo] = useState("");
//   const [fromDate, setFromDate] = useState(() => {
//     const today = new Date();
//     return today.toISOString().split("T")[0]; // This formats it as "YYYY-MM-DD"
//   });
//   const [footerShowData, setFooterShowData] = useState([]);
//   const [toDate, setTodate] = useState("");
//   const [totalPlanned, setTotalPlanned] = useState("");
//   const [totalDispatched, settotalDispatched] = useState("");
//   const [performance, setperformance] = useState("");
//   const [checkboxId, setCheckboxId] = useState([]);
//   const [delay, setDelay] = useState("");
//   const [vehicleNo, setVehicleNo] = useState("");
//   const [keys, setKeys] = useState([]);
//   const [remarksData, setRemarksData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [itemShowList, setItemShowList] = useState([]);
//   const [itemGroupLists, setItemGroupLists] = useState([]);
//   const [itemList, setItemList] = useState([]);
//   const [selectedItem, setSelectedItem] = useState([]);
//   const [selectAllChecked, setSelectAllChecked] = useState(false);

//   const [openNotification, setNotification] = useState({
//     status: false,
//     type: "error",
//     message: "",
//   });

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setShowFirstTable((prev) => !prev);
//     }, 30000); // Toggle every 60 seconds

//     return () => clearInterval(interval);
//   }, []);

//   const columns = [
//     "S.No",
//     "Contract No.",
//     "Po No",
//     "Duty",
//     "Qty/Stops",
//     "Kanban Date",
//     "11.12",
//     "3.4",
//     "4.4",
//     "5.0",
//     "5.1",
//     "9.13",
//     "8.0",
//     "9.8",
//     "11.0",
//     "4.1",
//     "v7 /v8",
//     "9.12",
//     "Time-Slot",
//     "Vehicle No",
//     "Start Time",
//     "End Time",
//     "Delay",
//     "OTD",
//     "Remarks",
//     "Select",
//   ];

//   const partscolumns = [
//     "S.No",
//     "Part No.",
//     "Po No",
//     "Qty",
//     "Vechile No",
//     "Start Time",
//     "End Time",
//     "Delay",
//     "Ontime",
//     "Remarks",
//   ];

//   const tabId = useRef(
//     `dispatch-tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
//   );

//   useEffect(() => {
//     // Set tab ID in sessionStorage (doesn't trigger API call)
//     sessionStorage.setItem("dispatchTabId", tabId.current);

//     const handleTabClose = (event) => {
//       DispatchDashboardLock(
//         { type: 1 },
//         () => console.log("Tab close API success"),
//         (error) => console.error("Tab close API failed", error)
//       );
//     };

//     window.addEventListener("beforeunload", handleTabClose);

//     return () => {
//       window.removeEventListener("beforeunload", handleTabClose);
//       // Clean up our sessionStorage marker if this isn't a tab close
//       if (sessionStorage.getItem("dispatchTabId") === tabId.current) {
//         sessionStorage.removeItem("dispatchTabId");
//       }
//     };
//   }, []);

//   const handlesuccess = (dataObject) => {
//     setNotification({
//       status: true,
//       type: "success",
//       message: dataObject.message,
//     });
//     setTimeout(() => { }, 2000);
//   };

//   const handlefailure = () => { };

//   function EditData(props) {
//     return (
//       <EditIcon
//         style={{ color: "black" }}
//         onClick={(event) => {
//           setOpen(true);
//           setIsAddButton(false);
//           setEditData(props.selectedRow);
//         }}
//       />
//     );
//   }

//   function DeleteData(props) {
//     return (
//       <DeleteIcon
//         onClick={() => {
//           setDeleteId(props.selectedRow.id);
//           setDeleteDailogOpen(true);
//         }}
//         style={{ color: "black" }}
//       />
//     );
//   }

//   const handleClose = () => {
//     setNotification({
//       status: false,
//       type: "",
//       message: "",
//     });
//   };

//   const deletehandleSuccess = (dataObject) => {
//     setNotification({
//       status: true,
//       type: "success",
//       message: dataObject.message,
//     });

//     setRefreshData((oldvalue) => !oldvalue);
//     setTimeout(() => {
//       handleClose();
//       setDeleteDailogOpen(false);
//     }, 3000);
//   };

//   const deletehandleException = (errorObject, errorMessage) => {
//     setNotification({
//       status: true,
//       type: "error",
//       message: errorMessage,
//     });
//     setTimeout(() => {
//       // handleClose();
//     }, 3000);
//   };

//   useEffect(() => {
//     const handleResize = () => {
//       setScreenHeight(window.innerHeight);
//     };

//     // Add event listener to update height on resize
//     window.addEventListener("resize", handleResize);

//     // Cleanup the event listener on component unmount
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const totalPages = Math.ceil(showData.length / rowsPerPage);

//   useEffect(() => {
//     setShipmentDate("25-04-2025");
//     const interval = setInterval(() => {
//       setTimeout(() => {
//         setStartIndex((prevIndex) => {
//           const nextPage = Math.floor(prevIndex / rowsPerPage) + 1;
//           return (nextPage % totalPages) * rowsPerPage;
//         });

//         setAnimate(false); // Reset to animate back in
//       }, 600); // match this to CSS transition duration
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [showData.length]);

//   const currentRows = showData.slice(startIndex, startIndex + rowsPerPage);

//   // const totalPartPages = Math.ceil(showPartData.length / rowsPerPage);

//   // useEffect(() => {
//   //   if (showPartData.length === 0) return; // Skip if no data

//   //   const interval = setInterval(() => {
//   //     setStartIndex((prevIndex) => {
//   //       // Calculate the next index to display the next 10 rows
//   //       const nextIndex = (prevIndex + rowsPerPage) % showPartData.length;
//   //       return nextIndex;
//   //     });
//   //   }, 5000); // Update every 5 seconds

//   //   return () => clearInterval(interval);
//   // }, [showPartData]); // Run the interval logic only when data changes

//   // // Get the current set of rows to display
//   // const currentPartRows = showPartData.slice(
//   //   startIndex,
//   //   startIndex + rowsPerPage
//   // );

//   useEffect(() => {
//     dispatchDashboardShow(
//       {
//         shipmentdate: fromDate,
//       },
//       dispatchDashboardShowSuccess,
//       dispatchDashboardShowException
//     );

//     FooterdispatchDashboardShow(
//       {
//         date: "",
//       },
//       FooterdispatchDashboardShowSuccess,
//       FooterdispatchDashboardShowException
//     );
//   }, []);

//   // const FooterdispatchDashboardShowSuccess = (dataObject) => {
//   //   setFooterShowData(dataObject.dailySummary);
//   //   setTotalPlanned(dataObject.totalPlanned);
//   //   settotalDispatched(dataObject.totalDispatched);
//   //   setperformance(dataObject.totalPerformance);
//   // };

//   const FooterdispatchDashboardShowSuccess = (dataObject) => {
//     setIsLoading(false);
//     if (dataObject && dataObject.success) {
//       // Set the data to state
//       setFooterShowData(dataObject.data);

//       // 🔄 Directly use the values provided by the backend for total
//       const totalItem = dataObject.data.find((item) => item.SNo === "Total");

//       if (totalItem) {
//         setTotalPlanned(totalItem.planned);
//         settotalDispatched(totalItem.dispatched);
//         setperformance(totalItem.performance);
//         setDelay(totalItem.delay);
//         setVehicleNo(totalItem.vehicleCount);
//       }
//     }
//   };

//   const FooterdispatchDashboardShowException = (errorObject, errorMessage) => {
//     setIsLoading(false);
//     setNotification({
//       status: true,
//       type: "error",
//       message: errorMessage,
//     });
//   };

//   const dispatchDashboardShowSuccess = (dataObject) => {
//     setShowData(dataObject.data);
//   };

//   const dispatchDashboardShowException = (errorObject, errorMessage) => {
//     setNotification({
//       status: true,
//       type: "error",
//       message: errorMessage,
//     });
//   };

//   const formatDateForInput = (date) => {
//     return date.toISOString().split("T")[0];
//   };

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("userDetails")) || {};
//     if (stored.fyFrom && stored.fyTo) {
//       const from = parseDate(stored.fyFrom);
//       const to = parseDate(stored.fyTo);
//       setFyFrom(formatDateForInput(from));
//       setFyTo(formatDateForInput(to));
//     }
//   }, []);

//   const isValidDateInRange = (value) => {
//     const selected = new Date(value);
//     const min = new Date(fyFrom);
//     const max = new Date(fyTo);
//     return selected >= min && selected <= max;
//   };

//   const handleFromDateChange = (e) => {
//     const value = e.target.value;
//     if (isValidDateInRange(value)) {
//       setFromDate(value);
//       setNotification({ status: false, type: "", message: "" });
//     } else {
//       setNotification({
//         status: true,
//         type: "error",
//         message: "Please select a valid From-Date",
//       });
//     }
//   };

//   const parseDate = (str) => {
//     const [day, month, year] = str.split("-");
//     return new Date(`${year}-${month}-${day}`);
//   };

//   const handleDataView = () => {
//     setIsLoading(true);
//     dispatchDashboardShow(
//       {
//         shipmentdate: fromDate,
//       },
//       handleGetdataSuccess,
//       handleGetdataException
//     );
//     FooterdispatchDashboardShow(
//       {
//         date: fromDate,
//       },
//       FooterdispatchDashboardShowSuccess,
//       FooterdispatchDashboardShowException
//     );
//   };

//   // Counter to track API completions
//   let completedCalls = 0;

//   const checkIfAllCallsDone = () => {
//     completedCalls += 1;
//     if (completedCalls >= 2) {
//       setIsLoading(false); // Stop loader after both calls are done
//       completedCalls = 0;
//     }
//   };

//   const footerDashboardShowSuccess = (dataObject) => {
//     setShowData(dataObject.data);
//   };

//   const footerdispatchDashboardShowException = () => { };

//   const handleGetdataSuccess = (dataObject) => {
//     setIsLoading(false);
//     const keysArray = Object.keys(dataObject?.data[0] || []);
//     // const updatedKeysArray = keysArray.filter((key) => key !== "id");
//     const updatedKeysArray = keysArray.filter(
//       (key) =>
//         key !== "id" &&
//         key !== "colorCode" &&
//         key !== "dispatchId" &&
//         key !== "sobId" &&
//         key !== "created_at" &&
//         key !== "updated_at" &&
//         key !== "mstId"
//     );
//     setKeys(updatedKeysArray);
//     console.log("keysArray>>>>>>>>>>>>>>>>>>>>", updatedKeysArray);

//     setShowData(dataObject?.data || []);
//     setCheckboxId([]);
//   };

//   const handleGetdataException = (errorObject, errorMessage) => {
//     setIsLoading(false);
//     setNotification({
//       status: true,
//       type: "error",
//       message: errorMessage,
//     });
//   };

//   // const handleCheckboxChange = (id, e) => {
//   //   if (e.target.checked) {
//   //     setCheckboxId((prev) => [...prev, id]);
//   //   } else {
//   //     setCheckboxId((prev) => prev.filter((item) => item !== id));
//   //   }
//   // };

//   const handleCheckboxChange = (id, e) => {
//     if (e.target.checked) {
//       setCheckboxId((prev) => {
//         const updated = [...prev, id];

//         // 🔥 If all rows are selected, auto-check the header checkbox
//         if (updated.length === showData.length) {
//           setSelectAllChecked(true);
//         }

//         return updated;
//       });
//     } else {
//       setCheckboxId((prev) => {
//         const updated = prev.filter((item) => item !== id);

//         // 🔥 If ANY row is unchecked, uncheck the header select-all checkbox
//         setSelectAllChecked(false);

//         return updated;
//       });
//     }
//   };


//   const handleSelectAllChange = (e) => {
//     const checked = e.target.checked;
//     setSelectAllChecked(checked);

//     if (checked) {
//       // 🔥 Select all row ids
//       const allIds = showData.map((row, idx) => row.id ?? idx);
//       setCheckboxId(allIds);
//     } else {
//       // 🔥 Clear all
//       setCheckboxId([]);
//     }
//   };



//   const handleStartTime = () => {
//     const now = new Date();
//     let hours = now.getHours();
//     const minutes = now.getMinutes().toString().padStart(2, "0");
//     const ampm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12 || 12; // Convert to 12-hour format and handle "0" as "12"

//     const currentTime = `${hours}:${minutes} ${ampm}`;

//     dispatchDashboardStartTime(
//       {
//         shipmentDate: fromDate,
//         startTime: currentTime,
//         id: checkboxId,
//       },
//       handleGetdataStartTimeSuccess,
//       handleGetdataStartTimeException
//     );
//   };

//   const handleGetdataStartTimeSuccess = () => {
//     setCheckboxId([]);
//     dispatchDashboardShow(
//       {
//         shipmentdate: fromDate,
//       },
//       handleGetdataSuccess,
//       handleGetdataException
//     );
//   };

//   const handleGetdataStartTimeException = () => { };

//   // const handleRemarksChange = (rowId, newValue) => {
//   //   // Update only the matching row
//   //   const updatedData = showData.map((row) =>
//   //     row.id === rowId ? { ...row, Remarks: newValue } : row
//   //   );
//   //   setShowData(updatedData);

//   //   console.log("updatedData>>>>>>>>>>>>>>>>>", rowId, newValue);

//   //   RemarksUpdate(
//   //     { id: rowId, remarks: newValue },
//   //     handleRemarksUpdateSuccess,
//   //     handleRemarksUpdateException
//   //   );
//   // };

//   const handleRemarksChange = (rowId, newValue) => {
//     const updatedData = showData.map((row, idx) => {
//       const uniqueId = row.id ?? idx;
//       return uniqueId === rowId ? { ...row, Remarks: newValue } : row;
//     });
//     setShowData(updatedData);

//     RemarksUpdate(
//       { id: rowId, remarks: newValue },
//       handleRemarksUpdateSuccess,
//       handleRemarksUpdateException
//     );
//   };

//   const handleRemarksUpdateSuccess = () => { };

//   const handleRemarksUpdateException = () => { };

//   useEffect(() => {
//     RemarksShowData(handleSobShowDataSuccess, handleSobShowDataException);
//   }, []);

//   const handleSobShowDataSuccess = (dataObject) => {
//     setRemarksData(dataObject?.data || []);
//   };

//   const handleSobShowDataException = (errorObject, errorMessage) => { };
//   const daysCount = 31; // or compute: new Date(year, month + 1, 0).getDate()

//   const handleAutocompleteChange = (selectedValue) => { };

//   const handleItemsDataShowSuccess = (dataObject) => { };

//   const handleItemsDataShowException = (errorObject, errorMessage) => {
//     console.log("error", errorMessage);
//   };

//   // helper: find the footerShowData item for a given day number (1..daysCount)
//   const getItemForDay = (dayNumber) => {
//     if (!Array.isArray(footerShowData)) return undefined;
//     return footerShowData.find((it) => {
//       if (!it || !it.date) return false;
//       // normalize date value to a Date and compare day-of-month
//       const d = new Date(it.date);
//       return d.getDate() === dayNumber;
//     });
//   };

//   const handleItemChange = (e) => {
//     DispatchDelnoteSearch(
//       { code: e.target.value },
//       handleSearchItemSucessShow,
//       handleSearchItemExceptionShow
//     );
//   };

//   const handleSearchItemSucessShow = (dataObject) => {
//     setItemList(dataObject?.data || []);
//   };
//   const handleSearchItemExceptionShow = (errorObject, errorMessage) => { };

//   const handleItemSelect = (value) => {
//     console.log("value----------->>>>>>>>>", value);

//     if (value) {
//       handleItemsubmit(value);
//     }
//   };

//   const handleItemsubmit = (selectedItem) => {
//     console.log("selectedItem----------->>>>>>>>>", selectedItem);

//     ShowDelNoteShow(
//       {
//         DelNoteNo: selectedItem.DelNoteNo,
//         shipmentDate: fromDate,
//       },
//       handleSearchDelNoteShowsuccess,
//       handleSearchDelNoteShowException
//     );
//   };

//   const handleSearchDelNoteShowsuccess = (dataObject) => {
//     setIsLoading(false);
//     const keysArray = Object.keys(dataObject?.data[0] || []);
//     // const updatedKeysArray = keysArray.filter((key) => key !== "id");
//     const updatedKeysArray = keysArray.filter(
//       (key) =>
//         key !== "id" &&
//         key !== "colorCode" &&
//         key !== "dispatchId" &&
//         key !== "sobId" &&
//         key !== "created_at" &&
//         key !== "updated_at" &&
//         key !== "mstId"
//     );
//     setKeys(updatedKeysArray);
//     console.log("keysArray>>>>>>>>>>>>>>>>>>>>", updatedKeysArray);

//     setShowData(dataObject?.data || []);
//     setCheckboxId([]);
//   };

//   const handleSearchDelNoteShowException = (errorObject) => {
//     const errorMessage = errorObject?.message || "Something went wrong";

//     setNotification({
//       status: true,
//       type: "error",
//       message: errorMessage,
//     });

//     setTimeout(() => {
//       setNotification({ status: false, type: "", message: "" });
//     }, 4000);
//   };

//   // const handleExport = () => {
//   //   if (!showData || showData.length === 0) {
//   //     alert("No data available to export");
//   //     return;
//   //   }

//   //   // Columns to remove
//   //   const removeFields = [
//   //     "id",
//   //     "colorCode",
//   //     "dispatchId",
//   //     "sobId",
//   //     "created_at",
//   //     "updated_at",
//   //     "mstId",
//   //   ];

//   //   // 1️⃣ Filter each row by removing unwanted keys
//   //   const filteredData = showData.map((item) => {
//   //     const newObj = {};
//   //     Object.keys(item).forEach((key) => {
//   //       if (!removeFields.includes(key)) {
//   //         newObj[key] = item[key];
//   //       }
//   //     });
//   //     return newObj;
//   //   });

//   //   // 2️⃣ Convert filtered data to worksheet
//   //   const worksheet = XLSX.utils.json_to_sheet(filteredData);

//   //   // 3️⃣ Create workbook and append worksheet
//   //   const workbook = XLSX.utils.book_new();
//   //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//   //   // 4️⃣ Generate Excel buffer
//   //   const excelBuffer = XLSX.write(workbook, {
//   //     bookType: "xlsx",
//   //     type: "array",
//   //   });

//   //   // 5️⃣ Save file using file-saver
//   //   const blob = new Blob([excelBuffer], {
//   //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   //   });

//   //   saveAs(blob, "Daily Dispatch Contract Plan.xlsx");
//   // };

//   const handleExport = () => {
//     if (!showData || showData.length === 0) {
//       alert("No data available to export");
//       return;
//     }

//     const removeFields = [
//       "id",
//       "colorCode",
//       "dispatchId",
//       "sobId",
//       "created_at",
//       "updated_at",
//       "mstId",
//     ];

//     // ==============================
//     // 🔹 MAIN TABLE EXPORT
//     // ==============================
//     const filteredData = showData.map((item) => {
//       const newObj = {};
//       Object.keys(item).forEach((key) => {
//         if (!removeFields.includes(key)) {
//           newObj[key] = item[key];
//         }
//       });
//       return newObj;
//     });

//     const mainWorksheet = XLSX.utils.json_to_sheet(filteredData);

//     // ==============================
//     // 🔹 FOOTER TABLE EXPORT
//     // ==============================

//     const footerRows = [];

//     // Helper function to generate row
//     const generateFooterRow = (title, field, totalValue) => {
//       const row = { Title: title };

//       for (let day = 1; day <= daysCount; day++) {
//         const item = getItemForDay(day);
//         row[`Day ${day}`] = item ? item[field] ?? "" : "";
//       }

//       row["Total"] = totalValue;
//       return row;
//     };

//     footerRows.push(generateFooterRow("Daily Contracts Plan", "planned", totalPlanned));
//     footerRows.push(generateFooterRow("Daily Contracts Dispatched", "dispatched", totalDispatched));
//     footerRows.push(generateFooterRow("Contract Performance %", "contractPerformance", performance));
//     footerRows.push(generateFooterRow("OTD Delayed Contract", "delay", delay));
//     footerRows.push(generateFooterRow("OTD %", "performance", performance));
//     footerRows.push(generateFooterRow("Total Vehicle Dispatched", "vehicleCount", vehicleNo));

//     const footerWorksheet = XLSX.utils.json_to_sheet(footerRows);

//     // ==============================
//     // 🔹 CREATE WORKBOOK
//     // ==============================
//     const workbook = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(workbook, mainWorksheet, "Dispatch Data");
//     XLSX.utils.book_append_sheet(workbook, footerWorksheet, "Monthly Summary");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const blob = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });

//     saveAs(blob, "Daily Dispatch Contract Plan.xlsx");
//   };


//   return (
//     <div
//       style={{
//         display: "flex",
//         flex: 1,
//         height: "100%",
//         flexDirection: "column",
//         padding: "5px",
//         rowGap: "10px",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "-5px",
//           paddingLeft: "10px",
//           paddingRight: "10px",
//           paddingTop: "5px",
//         }}
//       >
//         {/* LEFT SIDE - TITLE */}
//         <Typography style={{ fontSize: 26, fontWeight: "bold" }}>
//           Daily Dispatch Contract Plan
//         </Typography>

//         {/* RIGHT SIDE - AUTOCOMPLETE + DATE + BUTTONS */}
//         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//           {/* 📅 DATE PICKER */}
//           <div>
//             <Typography style={{ fontSize: 20, fontWeight: "bold" }}>
//               ShipmentDate:
//             </Typography>
//           </div>

//           <TextField
//             id="outlined-basic"
//             type="date"
//             variant="outlined"
//             InputLabelProps={{
//               shrink: true,
//               style: { color: "#000000", fontWeight: "bold" },
//             }}
//             size="small"
//             value={fromDate}
//             onChange={handleFromDateChange}
//             inputProps={{
//               min: fyFrom,
//               max: fyTo,
//             }}
//           />

//           {/* VIEW BUTTON */}
//           <Button
//             variant="contained"
//             style={{ backgroundColor: "#002D68" }}
//             onClick={handleDataView}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <CircularProgress size={24} sx={{ color: "#fff" }} />
//             ) : (
//               "View"
//             )}
//           </Button>
//           <div style={{ width: "300px" }}>
//             <Autocomplete
//               disablePortal
//               options={itemList}
//               size="small"
//               getOptionLabel={(option) => option?.DelNoteNo?.toString() || ""}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   label="Select DelNote No"
//                   onChange={handleItemChange}
//                 />
//               )}
//               onChange={(event, value) => handleItemSelect(value)}
//             />
//           </div>

//           {/* START TIME BUTTON */}
//           <Button
//             variant="contained"
//             style={{ backgroundColor: isModuleLocked ? "gray" : "#002D68" }}
//             onClick={handleStartTime}
//             disabled={isModuleLocked}
//           >
//             Start Time
//           </Button>
//           <Button
//             variant="contained"
//             style={{ backgroundColor: "#002D68" }}
//             onClick={handleExport}
//           >
//             Export To Excel
//           </Button>
//         </div>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           flex: 1,
//           height: "100%",
//           flexDirection: "column",
//           padding: "10px",
//           rowGap: "10px",
//         }}
//       >
//         <>
//           <div
//             style={{
//               flex: 5,
//               overflowX: "scroll",
//               boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
//             }}
//           >
//             <table className="styled-table" style={{ height: "100%" }}>
//               <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
//                 <tr>
//                   {keys.length > 0 &&
//                     keys.map((col, index) => {
//                       // freeze columns until "VehicleNo"
//                       const isSticky = true; // stick ALL columns
//                       return (
//                         <th
//                           key={index}
//                           className="sticky-header"
//                           style={isSticky ? { left: `${index * 150}px` } : {}}
//                         >
//                           {col}
//                         </th>
//                       );
//                     })}

//                   {/* Action column */}
//                   <th className="sticky-header" style={{ left: `${keys.length * 150}px` }}>
//                     <input
//                       type="checkbox"
//                       title="Select all rows"
//                       checked={selectAllChecked}
//                       onChange={handleSelectAllChange}
//                       className="large-checkbox"
//                     />
//                     <span style={{ marginLeft: 6 }}>Action</span>
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {keys.length > 0 &&
//                   showData.map((row, rowIndex) => {
//                     let rowClass = rowIndex % 2 === 0 ? "even-row" : "odd-row";

//                     if (row.colorCode === "#56ED79") rowClass += " green-row";
//                     if (row.colorCode === "#E3EE6A") rowClass += " yellow-row";
//                     if (row.colorCode === "#F5B133") rowClass += " orange-row";

//                     const rowIdentifier = row.id ?? rowIndex;

//                     return (
//                       <tr key={rowIndex} className={rowClass}>
//                         {keys.map((col, colIndex) => {
//                           const isSticky = true;

//                           return (
//                             <td
//                               key={colIndex}
//                               className="sticky-col"
//                               style={isSticky ? { left: `${colIndex * 150}px` } : {}}
//                             >
//                               {col === "Remarks" ? (
//                                 <select
//                                   value={row.Remarks || ""}
//                                   onChange={(e) =>
//                                     handleRemarksChange(rowIdentifier, e.target.value)
//                                   }
//                                 >
//                                   <option value="">Select</option>
//                                   {remarksData.map((item, idx) => (
//                                     <option key={idx} value={item.remarks}>
//                                       {item.remarks}
//                                     </option>
//                                   ))}
//                                 </select>
//                               ) : (
//                                 row[col]
//                               )}
//                             </td>
//                           );
//                         })}

//                         {/* Sticky checkbox column */}
//                         <td
//                           className="sticky-col"
//                           style={{ left: `${keys.length * 150}px` }}
//                         >
//                           <input
//                             type="checkbox"
//                             className="large-checkbox"
//                             checked={checkboxId.includes(rowIdentifier)}
//                             onChange={(e) => handleCheckboxChange(rowIdentifier, e)}
//                           />
//                         </td>
//                       </tr>
//                     );
//                   })}
//               </tbody>
//             </table>
//           </div>


//           <div
//             style={{
//               flex: 2,
//               overflowX: "scroll",
//               boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
//             }}
//           >
//             <table className="styled-table footer-table" style={{ height: "100%" }}>
//               <tbody>
//                 {/* Date Row */}
//                 <tr className="footer-row">
//                   <td colSpan="3">Date</td>

//                   {Array.from({ length: daysCount }).map((_, i) => {
//                     const day = i + 1;
//                     const item = getItemForDay(day);
//                     return (
//                       <td key={`date-${day}`}>
//                         {item ? new Date(item.date).getDate() : day}
//                       </td>
//                     );
//                   })}

//                   <td>Total</td>
//                 </tr>

//                 {/* Daily Contracts Plan */}
//                 <tr className="footer-row">
//                   <td colSpan="3">Daily Contracts Plan</td>

//                   {Array.from({ length: daysCount }).map((_, i) => {
//                     const day = i + 1;
//                     const item = getItemForDay(day);
//                     return <td key={`plan-${day}`}>{item ? item.planned ?? "" : ""}</td>;
//                   })}

//                   <td>{totalPlanned}</td>
//                 </tr>

//                 {/* Daily Contracts Dispatched */}
//                 <tr className="footer-row">
//                   <td colSpan="3">Daily Contracts Dispatched</td>

//                   {Array.from({ length: daysCount }).map((_, i) => {
//                     const day = i + 1;
//                     const item = getItemForDay(day);
//                     return <td key={`dispatched-${day}`}>{item ? item.dispatched ?? "" : ""}</td>;
//                   })}

//                   <td>{totalDispatched}</td>
//                 </tr>

//                 {/* Contract Performance % */}
//                 <tr className="footer-row">
//                   <td colSpan="3">Contract Performance %</td>

//                   {Array.from({ length: daysCount }).map((_, i) => {
//                     const day = i + 1;
//                     const item = getItemForDay(day);
//                     return <td key={`contractPerf-${day}`}>{item ? item.contractPerformance ?? "" : ""}</td>;
//                   })}

//                   <td>{performance}%</td>
//                 </tr>

//                 {/* OTD Delayed Contract */}
//                 <tr className="footer-row">
//                   <td colSpan="3">OTD Delayed Contract</td>

//                   {Array.from({ length: daysCount }).map((_, i) => {
//                     const day = i + 1;
//                     const item = getItemForDay(day);
//                     return <td key={`delay-${day}`}>{item ? item.delay ?? "" : ""}</td>;
//                   })}

//                   <td>{delay}</td>
//                 </tr>

//                 {/* OTD % */}
//                 <tr className="footer-row">
//                   <td colSpan="3">OTD %</td>

//                   {Array.from({ length: daysCount }).map((_, i) => {
//                     const day = i + 1;
//                     const item = getItemForDay(day);
//                     return <td key={`otd-${day}`}>{item ? item.performance ?? "" : ""}</td>;
//                   })}

//                   <td>{performance}%</td>
//                 </tr>

//                 {/* Total Vehicle Dispatched */}
//                 <tr className="footer-row">
//                   <td colSpan="3">Total Vehicle Dispatched</td>

//                   {Array.from({ length: daysCount }).map((_, i) => {
//                     const day = i + 1;
//                     const item = getItemForDay(day);
//                     return <td key={`vehicle-${day}`}>{item ? item.vehicleCount ?? "" : ""}</td>;
//                   })}

//                   <td>{vehicleNo}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </>
//       </div>
//       <NotificationBar
//         handleClose={handleClose}
//         notificationContent={openNotification.message}
//         openNotification={openNotification.status}
//         type={openNotification.type}
//       />
//     </div>
//   );
// };

// export default DispatchDashboard;


import React, { useState, useEffect, useRef } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import DispatchModule from "../Dispatch/DispatchModule";
import "./Dispatch.css";
import { useBeforeUnload } from "react-router-dom";
import {
  DispatchDashboardLock,
  DispatchDelnoteSearch,
  FooterdispatchDashboardShow,
  PurchaseReportSearchItem,
  RemarksShowData,
  RemarksUpdate,
  ShowDelNoteShow,
  dispatchDashboardShow,
  dispatchDashboardStartTime,
  dispatchPartNoDashboardShow,
} from "../../ApiService/LoginPageService";
import CircularProgress from "@mui/material/CircularProgress";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useModuleLocks } from "../context/ModuleLockContext";
const DispatchDashboard = () => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Dispatch Dashboard")?.lockStatus === "locked";

  const [open, setOpen] = useState(false);
  const [isAddButton, setIsAddButton] = useState(true);
  const [editData, setEditData] = useState([]);

  const [refreshData, setRefreshData] = useState(false);
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [DataList, setDataList] = useState([]);
  const [selectedCell, setSelectedCell] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedButton, setSelectedButton] = useState("");
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [startIndex, setStartIndex] = useState(0);
  const rowsPerPage = 10;
  const [animate, setAnimate] = useState(false);
  const [shipmentDate, setShipmentDate] = useState(" ");
  const [itemShowListSeach, setItemShowListSeach] = useState([]);
  const [itemShowListHeader, setItemShowListHeader] = useState([]);
  const [showFirstTable, setShowFirstTable] = useState(true);
  const [showData, setShowData] = useState([]);
  const [showPartData, setShowPartData] = useState([]);
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");
  const [fromDate, setFromDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // This formats it as "YYYY-MM-DD"
  });
  const [footerShowData, setFooterShowData] = useState([]);
  const [toDate, setTodate] = useState("");
  const [totalPlanned, setTotalPlanned] = useState("");
  const [totalDispatched, settotalDispatched] = useState("");
  const [performance, setperformance] = useState("");
  const [checkboxId, setCheckboxId] = useState([]);
  const [delay, setDelay] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [keys, setKeys] = useState([]);
  const [remarksData, setRemarksData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [itemShowList, setItemShowList] = useState([]);
  const [itemGroupLists, setItemGroupLists] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirstTable((prev) => !prev);
    }, 30000); // Toggle every 60 seconds

    return () => clearInterval(interval);
  }, []);

  const columns = [
    "S.No",
    "Contract No.",
    "Po No",
    "Duty",
    "Qty/Stops",
    "Kanban Date",
    "11.12",
    "3.4",
    "4.4",
    "5.0",
    "5.1",
    "9.13",
    "8.0",
    "9.8",
    "11.0",
    "4.1",
    "v7 /v8",
    "9.12",
    "Time-Slot",
    "Vehicle No",
    "Start Time",
    "End Time",
    "Delay",
    "OTD",
    "Remarks",
    "Select",
  ];

  const partscolumns = [
    "S.No",
    "Part No.",
    "Po No",
    "Qty",
    "Vechile No",
    "Start Time",
    "End Time",
    "Delay",
    "Ontime",
    "Remarks",
  ];

  const tabId = useRef(
    `dispatch-tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    // Set tab ID in sessionStorage (doesn't trigger API call)
    sessionStorage.setItem("dispatchTabId", tabId.current);

    const handleTabClose = (event) => {
      DispatchDashboardLock(
        { type: 1 },
        () => console.log("Tab close API success"),
        (error) => console.error("Tab close API failed", error)
      );
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
      // Clean up our sessionStorage marker if this isn't a tab close
      if (sessionStorage.getItem("dispatchTabId") === tabId.current) {
        sessionStorage.removeItem("dispatchTabId");
      }
    };
  }, []);

  const handlesuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => { }, 2000);
  };

  const handlefailure = () => { };

  function EditData(props) {
    return (
      <EditIcon
        style={{ color: "black" }}
        onClick={(event) => {
          setOpen(true);
          setIsAddButton(false);
          setEditData(props.selectedRow);
        }}
      />
    );
  }

  function DeleteData(props) {
    return (
      <DeleteIcon
        onClick={() => {
          setDeleteId(props.selectedRow.id);
          setDeleteDailogOpen(true);
        }}
        style={{ color: "black" }}
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

  const totalPages = Math.ceil(showData.length / rowsPerPage);

  useEffect(() => {
    setShipmentDate("25-04-2025");
    const interval = setInterval(() => {
      setTimeout(() => {
        setStartIndex((prevIndex) => {
          const nextPage = Math.floor(prevIndex / rowsPerPage) + 1;
          return (nextPage % totalPages) * rowsPerPage;
        });

        setAnimate(false); // Reset to animate back in
      }, 600); // match this to CSS transition duration
    }, 5000);

    return () => clearInterval(interval);
  }, [showData.length]);

  const currentRows = showData.slice(startIndex, startIndex + rowsPerPage);

  // const totalPartPages = Math.ceil(showPartData.length / rowsPerPage);

  // useEffect(() => {
  //   if (showPartData.length === 0) return; // Skip if no data

  //   const interval = setInterval(() => {
  //     setStartIndex((prevIndex) => {
  //       // Calculate the next index to display the next 10 rows
  //       const nextIndex = (prevIndex + rowsPerPage) % showPartData.length;
  //       return nextIndex;
  //     });
  //   }, 5000); // Update every 5 seconds

  //   return () => clearInterval(interval);
  // }, [showPartData]); // Run the interval logic only when data changes

  // // Get the current set of rows to display
  // const currentPartRows = showPartData.slice(
  //   startIndex,
  //   startIndex + rowsPerPage
  // );

  useEffect(() => {
    dispatchDashboardShow(
      {
        shipmentdate: fromDate,
      },
      dispatchDashboardShowSuccess,
      dispatchDashboardShowException
    );

    FooterdispatchDashboardShow(
      {
        date: "",
      },
      FooterdispatchDashboardShowSuccess,
      FooterdispatchDashboardShowException
    );
  }, []);

  // const FooterdispatchDashboardShowSuccess = (dataObject) => {
  //   setFooterShowData(dataObject.dailySummary);
  //   setTotalPlanned(dataObject.totalPlanned);
  //   settotalDispatched(dataObject.totalDispatched);
  //   setperformance(dataObject.totalPerformance);
  // };

  const FooterdispatchDashboardShowSuccess = (dataObject) => {
    setIsLoading(false);
    if (dataObject && dataObject.success) {
      // Set the data to state
      setFooterShowData(dataObject.data);

      // 🔄 Directly use the values provided by the backend for total
      const totalItem = dataObject.data.find((item) => item.SNo === "Total");

      if (totalItem) {
        setTotalPlanned(totalItem.planned);
        settotalDispatched(totalItem.dispatched);
        setperformance(totalItem.performance);
        setDelay(totalItem.delay);
        setVehicleNo(totalItem.vehicleCount);
      }
    }
  };

  const FooterdispatchDashboardShowException = (errorObject, errorMessage) => {
    setIsLoading(false);
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
  };

  const dispatchDashboardShowSuccess = (dataObject) => {
    setShowData(dataObject.data);
  };

  const dispatchDashboardShowException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
  };

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

  const parseDate = (str) => {
    const [day, month, year] = str.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  const handleDataView = () => {
    setIsLoading(true);
    dispatchDashboardShow(
      {
        shipmentdate: fromDate,
      },
      handleGetdataSuccess,
      handleGetdataException
    );
    FooterdispatchDashboardShow(
      {
        date: fromDate,
      },
      FooterdispatchDashboardShowSuccess,
      FooterdispatchDashboardShowException
    );
  };

  // Counter to track API completions
  let completedCalls = 0;

  const checkIfAllCallsDone = () => {
    completedCalls += 1;
    if (completedCalls >= 2) {
      setIsLoading(false); // Stop loader after both calls are done
      completedCalls = 0;
    }
  };

  const footerDashboardShowSuccess = (dataObject) => {
    setShowData(dataObject.data);
  };

  const footerdispatchDashboardShowException = () => { };

  const handleGetdataSuccess = (dataObject) => {
    setIsLoading(false);
    const keysArray = Object.keys(dataObject?.data[0] || []);
    // const updatedKeysArray = keysArray.filter((key) => key !== "id");
    const updatedKeysArray = keysArray.filter(
      (key) =>
        key !== "id" &&
        key !== "colorCode" &&
        key !== "dispatchId" &&
        key !== "sobId" &&
        key !== "created_at" &&
        key !== "updated_at" &&
        key !== "mstId"
    );
    setKeys(updatedKeysArray);
    console.log("keysArray>>>>>>>>>>>>>>>>>>>>", updatedKeysArray);

    setShowData(dataObject?.data || []);
    setCheckboxId([]);
  };

  const handleGetdataException = (errorObject, errorMessage) => {
    setIsLoading(false);
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
  };

  // const handleCheckboxChange = (id, e) => {
  //   if (e.target.checked) {
  //     setCheckboxId((prev) => [...prev, id]);
  //   } else {
  //     setCheckboxId((prev) => prev.filter((item) => item !== id));
  //   }
  // };

  const handleCheckboxChange = (id, e) => {
    if (e.target.checked) {
      setCheckboxId((prev) => {
        const updated = [...prev, id];

        // 🔥 If all rows are selected, auto-check the header checkbox
        if (updated.length === showData.length) {
          setSelectAllChecked(true);
        }

        return updated;
      });
    } else {
      setCheckboxId((prev) => {
        const updated = prev.filter((item) => item !== id);

        // 🔥 If ANY row is unchecked, uncheck the header select-all checkbox
        setSelectAllChecked(false);

        return updated;
      });
    }
  };


  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAllChecked(checked);

    if (checked) {
      // 🔥 Select all row ids
      const allIds = showData.map((row, idx) => row.id ?? idx);
      setCheckboxId(allIds);
    } else {
      // 🔥 Clear all
      setCheckboxId([]);
    }
  };



  const handleStartTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format and handle "0" as "12"

    const currentTime = `${hours}:${minutes} ${ampm}`;

    dispatchDashboardStartTime(
      {
        shipmentDate: fromDate,
        startTime: currentTime,
        id: checkboxId,
      },
      handleGetdataStartTimeSuccess,
      handleGetdataStartTimeException
    );
  };

  const handleGetdataStartTimeSuccess = () => {
    setCheckboxId([]);
    dispatchDashboardShow(
      {
        shipmentdate: fromDate,
      },
      handleGetdataSuccess,
      handleGetdataException
    );
  };

  const handleGetdataStartTimeException = () => { };

  // const handleRemarksChange = (rowId, newValue) => {
  //   // Update only the matching row
  //   const updatedData = showData.map((row) =>
  //     row.id === rowId ? { ...row, Remarks: newValue } : row
  //   );
  //   setShowData(updatedData);

  //   console.log("updatedData>>>>>>>>>>>>>>>>>", rowId, newValue);

  //   RemarksUpdate(
  //     { id: rowId, remarks: newValue },
  //     handleRemarksUpdateSuccess,
  //     handleRemarksUpdateException
  //   );
  // };

  const handleRemarksChange = (rowId, newValue) => {
    const updatedData = showData.map((row, idx) => {
      const uniqueId = row.id ?? idx;
      return uniqueId === rowId ? { ...row, Remarks: newValue } : row;
    });
    setShowData(updatedData);

    RemarksUpdate(
      { id: rowId, remarks: newValue },
      handleRemarksUpdateSuccess,
      handleRemarksUpdateException
    );
  };

  const handleRemarksUpdateSuccess = () => { };

  const handleRemarksUpdateException = () => { };

  useEffect(() => {
    RemarksShowData(handleSobShowDataSuccess, handleSobShowDataException);
  }, []);

  const handleSobShowDataSuccess = (dataObject) => {
    setRemarksData(dataObject?.data || []);
  };

  const handleSobShowDataException = (errorObject, errorMessage) => { };
  const daysCount = 31; // or compute: new Date(year, month + 1, 0).getDate()

  const handleAutocompleteChange = (selectedValue) => { };

  const handleItemsDataShowSuccess = (dataObject) => { };

  const handleItemsDataShowException = (errorObject, errorMessage) => {
    console.log("error", errorMessage);
  };

  // helper: find the footerShowData item for a given day number (1..daysCount)
  const getItemForDay = (dayNumber) => {
    if (!Array.isArray(footerShowData)) return undefined;
    return footerShowData.find((it) => {
      if (!it || !it.date) return false;
      // normalize date value to a Date and compare day-of-month
      const d = new Date(it.date);
      return d.getDate() === dayNumber;
    });
  };

  const handleItemChange = (e) => {
    DispatchDelnoteSearch(
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
    console.log("value----------->>>>>>>>>", value);

    if (value) {
      handleItemsubmit(value);
    }
  };

  const handleItemsubmit = (selectedItem) => {
    console.log("selectedItem----------->>>>>>>>>", selectedItem);

    ShowDelNoteShow(
      {
        DelNoteNo: selectedItem.DelNoteNo,
        shipmentDate: fromDate,
      },
      handleSearchDelNoteShowsuccess,
      handleSearchDelNoteShowException
    );
  };

  const handleSearchDelNoteShowsuccess = (dataObject) => {
    setIsLoading(false);
    const keysArray = Object.keys(dataObject?.data[0] || []);
    // const updatedKeysArray = keysArray.filter((key) => key !== "id");
    const updatedKeysArray = keysArray.filter(
      (key) =>
        key !== "id" &&
        key !== "colorCode" &&
        key !== "dispatchId" &&
        key !== "sobId" &&
        key !== "created_at" &&
        key !== "updated_at" &&
        key !== "mstId"
    );
    setKeys(updatedKeysArray);
    console.log("keysArray>>>>>>>>>>>>>>>>>>>>", updatedKeysArray);

    setShowData(dataObject?.data || []);
    setCheckboxId([]);
  };

  const handleSearchDelNoteShowException = (errorObject) => {
    const errorMessage = errorObject?.message || "Something went wrong";

    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });

    setTimeout(() => {
      setNotification({ status: false, type: "", message: "" });
    }, 4000);
  };

  // const handleExport = () => {
  //   if (!showData || showData.length === 0) {
  //     alert("No data available to export");
  //     return;
  //   }

  //   // Columns to remove
  //   const removeFields = [
  //     "id",
  //     "colorCode",
  //     "dispatchId",
  //     "sobId",
  //     "created_at",
  //     "updated_at",
  //     "mstId",
  //   ];

  //   // 1️⃣ Filter each row by removing unwanted keys
  //   const filteredData = showData.map((item) => {
  //     const newObj = {};
  //     Object.keys(item).forEach((key) => {
  //       if (!removeFields.includes(key)) {
  //         newObj[key] = item[key];
  //       }
  //     });
  //     return newObj;
  //   });

  //   // 2️⃣ Convert filtered data to worksheet
  //   const worksheet = XLSX.utils.json_to_sheet(filteredData);

  //   // 3️⃣ Create workbook and append worksheet
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  //   // 4️⃣ Generate Excel buffer
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });

  //   // 5️⃣ Save file using file-saver
  //   const blob = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });

  //   saveAs(blob, "Daily Dispatch Contract Plan.xlsx");
  // };

  const handleExport = () => {
    if (!showData || showData.length === 0) {
      alert("No data available to export");
      return;
    }

    const removeFields = [
      "id",
      "colorCode",
      "dispatchId",
      "sobId",
      "created_at",
      "updated_at",
      "mstId",
    ];

    // ==============================
    // 🔹 MAIN TABLE EXPORT
    // ==============================
    const filteredData = showData.map((item) => {
      const newObj = {};
      Object.keys(item).forEach((key) => {
        if (!removeFields.includes(key)) {
          newObj[key] = item[key];
        }
      });
      return newObj;
    });

    const mainWorksheet = XLSX.utils.json_to_sheet(filteredData);

    // ==============================
    // 🔹 FOOTER TABLE EXPORT
    // ==============================

    const footerRows = [];

    // Helper function to generate row
    const generateFooterRow = (title, field, totalValue) => {
      const row = { Title: title };

      for (let day = 1; day <= daysCount; day++) {
        const item = getItemForDay(day);
        row[`Day ${day}`] = item ? item[field] ?? "" : "";
      }

      row["Total"] = totalValue;
      return row;
    };

    footerRows.push(generateFooterRow("Daily Contracts Plan", "planned", totalPlanned));
    footerRows.push(generateFooterRow("Daily Contracts Dispatched", "dispatched", totalDispatched));
    footerRows.push(generateFooterRow("Contract Performance %", "contractPerformance", performance));
    footerRows.push(generateFooterRow("OTD Delayed Contract", "delay", delay));
    footerRows.push(generateFooterRow("OTD %", "performance", performance));
    footerRows.push(generateFooterRow("Total Vehicle Dispatched", "vehicleCount", vehicleNo));

    const footerWorksheet = XLSX.utils.json_to_sheet(footerRows);

    // ==============================
    // 🔹 CREATE WORKBOOK
    // ==============================
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, mainWorksheet, "Dispatch Data");
    XLSX.utils.book_append_sheet(workbook, footerWorksheet, "Monthly Summary");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Daily Dispatch Contract Plan.xlsx");
  };

  const frozenColumns = [
    "SNo",
    "DelNoteNo",
    "ContractNo",
    "KanbanDate",
    "TimeSlot",
  ];

  // const getLeftPosition = (index) => {
  //   let left = 0;

  //   for (let i = 0; i < index; i++) {
  //     if (frozenColumns.includes(keys[i])) {
  //       left += 150; // column width
  //     }
  //   }

  //   return left;
  // };
  const frozenLeftMap = React.useMemo(() => {
    const map = {};
    let left = 0;

    keys.forEach((key) => {
      if (frozenColumns.includes(key)) {
        map[key] = left;
        left += 150;
      }
    });

    return map;
  }, [keys]);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        height: "100%",
        flexDirection: "column",
        padding: "5px",
        rowGap: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "-5px",
          paddingLeft: "10px",
          paddingRight: "10px",
          paddingTop: "5px",
        }}
      >
        {/* LEFT SIDE - TITLE */}
        <Typography style={{ fontSize: 26, fontWeight: "bold" }}>
          Daily Dispatch Contract Plan
        </Typography>

        {/* RIGHT SIDE - AUTOCOMPLETE + DATE + BUTTONS */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* 📅 DATE PICKER */}
          <div>
            <Typography style={{ fontSize: 20, fontWeight: "bold" }}>
              ShipmentDate:
            </Typography>
          </div>

          <TextField
            id="outlined-basic"
            type="date"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
              style: { color: "#000000", fontWeight: "bold" },
            }}
            size="small"
            value={fromDate}
            onChange={handleFromDateChange}
            inputProps={{
              min: fyFrom,
              max: fyTo,
            }}
          />

          {/* VIEW BUTTON */}
          <Button
            variant="contained"
            style={{ backgroundColor: "#002D68" }}
            onClick={handleDataView}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "View"
            )}
          </Button>
          <div style={{ width: "300px" }}>
            <Autocomplete
              disablePortal
              options={itemList}
              size="small"
              getOptionLabel={(option) => option?.DelNoteNo?.toString() || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select DelNote No"
                  onChange={handleItemChange}
                />
              )}
              onChange={(event, value) => handleItemSelect(value)}
            />
          </div>

          {/* START TIME BUTTON */}
          <Button
            variant="contained"
            style={{ backgroundColor: isModuleLocked ? "gray" : "#002D68" }}
            onClick={handleStartTime}
            disabled={isModuleLocked}
          >
            Start Time
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "#002D68" }}
            onClick={handleExport}
          >
            Export To Excel
          </Button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          height: "100%",
          flexDirection: "column",
          padding: "10px",
          rowGap: "10px",
        }}
      >
        <>
          <div
            style={{
              flex: 5,
              overflowX: "auto",
              boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
            }}
          >
            <table
              className="styled-table"
              style={{
                minWidth: "max-content",
                borderCollapse: "collapse",
              }}
            >
              <thead style={{ position: "sticky", top: 1, zIndex: 2 }}>
                <tr>
                  {keys.length > 0 &&
                    keys.map((col, index) => {
                      const isSticky = frozenColumns.includes(col);

                      return (
                        <th
                          key={index}
                          style={{
                            minWidth: 150,
                            position: isSticky ? "sticky" : "static",
                            // left: isSticky ? `${getLeftPosition(index)}px` : "auto",
                            left: `${frozenLeftMap[col]}px`,

                            background: "#002D68",
                            color: "white",
                            zIndex: isSticky ? 0 : 0,
                            border: "1px solid #ddd",
                            padding: "8px",
                          }}
                        >
                          {col}
                        </th>
                      );
                    })}

                  {/* Action Header */}
                  <th
                    style={{
                      minWidth: 100,
                      position: "sticky",
                      right: 0,
                      background: "#002D68",
                      color: "white",
                      zIndex: 0,
                      border: "1px solid #ddd",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectAllChecked}
                      onChange={handleSelectAllChange}
                    />
                    <span style={{ marginLeft: 6 }}>Action</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {keys.length > 0 &&
                  showData.map((row, rowIndex) => {
                    let rowClass = rowIndex % 2 === 0 ? "even-row" : "odd-row";

                    if (row.colorCode === "#56ED79") rowClass += " green-row";
                    if (row.colorCode === "#E3EE6A") rowClass += " yellow-row";
                    if (row.colorCode === "#F5B133") rowClass += " orange-row";

                    const rowIdentifier = row.id ?? rowIndex;

                    return (
                      <tr key={rowIndex} className={rowClass}>
                        {keys.map((col, colIndex) => {
                          const isSticky = frozenColumns.includes(col);

                          return (
                            <td
                              key={colIndex}
                              style={{
                                minWidth: 150,
                                position: isSticky ? "sticky" : "static",
                                left: `${frozenLeftMap[col]}px`,
                                background: isSticky ? "#fff" : "transparent",
                                zIndex: isSticky ? 0 : 0,
                                border: "1px solid #ddd",
                                padding: "6px",
                              }}
                            >
                              {col === "Remarks" ? (
                                <select
                                  value={row.Remarks || ""}
                                  onChange={(e) =>
                                    handleRemarksChange(
                                      rowIdentifier,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select</option>
                                  {remarksData.map((item, idx) => (
                                    <option key={idx} value={item.remarks}>
                                      {item.remarks}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                row[col]
                              )}
                            </td>
                          );
                        })}

                        {/* Action Column */}
                        <td
                          style={{
                            minWidth: 100,
                            position: "sticky",
                            right: 0,
                            background: "#fff",
                            zIndex: 0,
                            border: "1px solid #ddd",
                            textAlign: "center",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checkboxId.includes(rowIdentifier)}
                            onChange={(e) =>
                              handleCheckboxChange(rowIdentifier, e)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>


          <div
            style={{
              flex: 2,
              overflowX: "scroll",
              boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
            }}
          >
            <table className="styled-table footer-table" style={{ height: "100%" }}>
              <tbody>
                {/* Date Row */}
                <tr className="footer-row">
                  <td colSpan="3">Date</td>

                  {Array.from({ length: daysCount }).map((_, i) => {
                    const day = i + 1;
                    const item = getItemForDay(day);
                    return (
                      <td key={`date-${day}`}>
                        {item ? new Date(item.date).getDate() : day}
                      </td>
                    );
                  })}

                  <td>Total</td>
                </tr>

                {/* Daily Contracts Plan */}
                <tr className="footer-row">
                  <td colSpan="3">Daily Contracts Plan</td>

                  {Array.from({ length: daysCount }).map((_, i) => {
                    const day = i + 1;
                    const item = getItemForDay(day);
                    return <td key={`plan-${day}`}>{item ? item.planned ?? "" : ""}</td>;
                  })}

                  <td>{totalPlanned}</td>
                </tr>

                {/* Daily Contracts Dispatched */}
                <tr className="footer-row">
                  <td colSpan="3">Daily Contracts Dispatched</td>

                  {Array.from({ length: daysCount }).map((_, i) => {
                    const day = i + 1;
                    const item = getItemForDay(day);
                    return <td key={`dispatched-${day}`}>{item ? item.dispatched ?? "" : ""}</td>;
                  })}

                  <td>{totalDispatched}</td>
                </tr>

                {/* Contract Performance % */}
                <tr className="footer-row">
                  <td colSpan="3">Contract Performance %</td>

                  {Array.from({ length: daysCount }).map((_, i) => {
                    const day = i + 1;
                    const item = getItemForDay(day);
                    return <td key={`contractPerf-${day}`}>{item ? item.contractPerformance ?? "" : ""}</td>;
                  })}

                  <td>{performance}</td>
                </tr>

                {/* <tr className="footer-row">
                  <td colSpan="3">OTD Delayed Contract</td>

                  {Array.from({ length: daysCount }).map((_, i) => {
                    const day = i + 1;
                    const item = getItemForDay(day);
                    return <td key={`delay-${day}`}>{item ? item.delay ?? "" : ""}</td>;
                  })}

                  <td>{delay}</td>
                </tr>

                <tr className="footer-row">
                  <td colSpan="3">OTD %</td>

                  {Array.from({ length: daysCount }).map((_, i) => {
                    const day = i + 1;
                    const item = getItemForDay(day);
                    return <td key={`otd-${day}`}>{item ? item.performance ?? "" : ""}</td>;
                  })}

                  <td>{performance}</td>
                </tr> */}

                {/* Total Vehicle Dispatched */}
                <tr className="footer-row">
                  <td colSpan="3">Total Vehicle Dispatched</td>

                  {Array.from({ length: daysCount }).map((_, i) => {
                    const day = i + 1;
                    const item = getItemForDay(day);
                    return <td key={`vehicle-${day}`}>{item ? item.vehicleCount ?? "" : ""}</td>;
                  })}

                  <td>{vehicleNo}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
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

export default DispatchDashboard;

