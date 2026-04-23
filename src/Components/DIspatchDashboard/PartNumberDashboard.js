import React, { useState, useEffect } from "react";
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
  DispatchDelnoteSearch,
  FooterdispatchDashboardShow,
  FooterdispatchPartDashboardShow,
  PartFilterDelNote,
  PartShowDelNote,
  RemarkPartsDashboardUpdate,
  RemarkPartsUpdate,
  RemarksShowData,
  RemarksUpdate,
  ShowDelNoteShow,
  StartTimePartDashboardShow,
  dispatchDashboardShow,
  dispatchPartDashboardShow,
  dispatchPartNoDashboardShow,
} from "../../ApiService/LoginPageService";
import CircularProgress from "@mui/material/CircularProgress";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useModuleLocks } from "../context/ModuleLockContext";
const PartNumberDashboard = () => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Part Dispatch Dashboard")?.lockStatus === "locked";

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
  const [overallData, setOverallData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [itemList, setItemList] = useState([]);

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


  useEffect(() => {
    dispatchPartDashboardShow(
      {
        shipmentDate: fromDate,
        partNoIds: [],
      },
      dispatchDashboardShowSuccess,
      dispatchDashboardShowException
    );

    FooterdispatchPartDashboardShow(
      {
        date: fromDate,
      },
      footerdispatchDashboardShowSuccess,
      footerdispatchDashboardShowException
    );
  }, []);

  const footerdispatchDashboardShowSuccess = (dataObject) => {
    setFooterShowData(dataObject.data);
    setTotalPlanned(dataObject.totalPlanned);
    settotalDispatched(dataObject.totalDispatched);
    setperformance(dataObject.totalPerformance);
    setOverallData(dataObject.overall);
  };

  // const footerdispatchDashboardShowException = (errorObject, errorMessage) => {
  //   setNotification({
  //     status: true,
  //     type: "error",
  //     message: errorMessage,
  //   });
  //   };
  // const FooterdispatchDashboardShowSuccess = (dataObject) => {
  //   setFooterShowData(dataObject.dailySummary);
  //   setTotalPlanned(dataObject.totalPlanned);
  //   settotalDispatched(dataObject.totalDispatched);
  //   setperformance(dataObject.totalPerformance);
  // };

  const FooterdispatchDashboardShowSuccess = (dataObject) => {
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
    dispatchPartDashboardShow(
      {
        shipmentDate: fromDate,
        partNoIds: [],
      },
      handleGetdataSuccess,
      handleGetdataException
    );

    FooterdispatchPartDashboardShow(
      {
        date: fromDate,
      },
      footerdispatchDashboardShowSuccess,
      footerdispatchDashboardShowException
    );

    PartFilterDelNote(
      { deliveryDate: fromDate },
      handlePartSuccess,
      handlePartFailure
    );
  };

  const handlePartSuccess = (dataObject) => {
    const normalized = (dataObject?.data || []).map((item) => ({
      id: item.id,
      DelNoteNo: item.delNoteNo, // normalize key
    }));
    setItemList(normalized);
  };

  const handlePartFailure = () => { };

  const footerDashboardShowSuccess = (dataObject) => {
    setShowData(dataObject.data);
  };

  const footerdispatchDashboardShowException = () => { };

  const handleGetdataSuccess = (dataObject) => {
    setIsLoading(false);
    const keysArray = Object.keys(dataObject?.data[0] || []);
    // const updatedKeysArray = keysArray.filter((key) => key !== "id");
    const updatedKeysArray = keysArray.filter(
      (key) => key !== "id" && key !== "colorCode" && key !== "dispatchId"
    );
    setKeys(updatedKeysArray);
    console.log("keysArray>>>>>>>>>>>>>>>>>>>>", updatedKeysArray);

    setShowData(dataObject?.data || []);
    setCheckboxId([]);
  };

  const handleGetdataException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
  };

  const handleCheckboxChange = (id, e) => {
    if (e.target.checked) {
      setCheckboxId([...checkboxId, id]);
    } else {
      setCheckboxId(checkboxId.filter((item) => item !== id));
    }
  };

  const handleStartTime = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

    const currentTime = `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;

    StartTimePartDashboardShow(
      {
        ids: checkboxId,
        startTime: currentTime,
      },
      handleStartdataSuccess,
      handleGetdataException
    );
  };

  const handleStartdataSuccess = () => {
    setCheckboxId([]);
    dispatchPartDashboardShow(
      {
        shipmentDate: fromDate,
        partNoIds: [],
      },
      handleGetdataSuccess,
      handleGetdataException
    );
  };

  const handleRemarksChange = (rowId, newValue) => {
    // Update only the matching row
    const updatedData = showData.map((row) =>
      row.id === rowId ? { ...row, Remarks: newValue } : row
    );
    setShowData(updatedData);
    console.log("updatedData>>>>>>>>>>>>>>>>>", rowId, newValue);
    RemarkPartsDashboardUpdate(
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

  const handleItemChange = (e) => {

  };

  const handleSearchItemSucessShow = (dataObject) => {
    setIsLoading(false);
    const keysArray = Object.keys(dataObject?.data[0] || []);
    // const updatedKeysArray = keysArray.filter((key) => key !== "id");
    const updatedKeysArray = keysArray.filter(
      (key) => key !== "id" && key !== "colorCode" && key !== "dispatchId"
    );
    setKeys(updatedKeysArray);
    console.log("keysArray>>>>>>>>>>>>>>>>>>>>", updatedKeysArray);

    setShowData(dataObject?.data || []);
    setCheckboxId([]);
  };
  const handleSearchItemExceptionShow = (errorObject, errorMessage) => { };

  const handleItemSelect = (value) => {
    if (value) {
      PartShowDelNote(
        { delNoteId: value },
        handleSearchDelNoteShowsuccess,
        handleSearchDelNoteShowException
      );
    }
    // if (value) {
    //   handleItemsubmit(value);
    // }
  };

  const handleItemsubmit = (selectedItem) => {
    console.log("selectedItem----------->>>>>>>>>", selectedItem);
  };

  const handleSearchDelNoteShowsuccess = (dataObject) => {
    setIsLoading(false);
    const keysArray = Object.keys(dataObject?.data[0] || []);
    // const updatedKeysArray = keysArray.filter((key) => key !== "id");
    const updatedKeysArray = keysArray.filter(
      (key) => key !== "id" && key !== "colorCode" && key !== "dispatchId"
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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = showData.map((row) => row.id);
      setCheckboxId(allIds);
    } else {
      setCheckboxId([]);
    }
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

  //   saveAs(blob, "Daily Dispatch Part Plan.xlsx");
  // };
  const handleExport = () => {
    if ((!showData || showData.length === 0) && (!footerShowData || footerShowData.length === 0)) {
      alert("No data available to export");
      return;
    }

    const workbook = XLSX.utils.book_new();

    /* ------------------------------------
       1️⃣ MAIN DISPATCH TABLE EXPORT
    -------------------------------------*/

    const removeFields = ["id", "colorCode", "dispatchId"];

    const filteredData = showData.map((item) => {
      const newObj = {};
      Object.keys(item).forEach((key) => {
        if (!removeFields.includes(key)) {
          newObj[key] = item[key];
        }
      });
      return newObj;
    });

    const worksheet1 = XLSX.utils.json_to_sheet(filteredData);

    // Auto column width
    const wscols = Object.keys(filteredData[0] || {}).map(() => ({ wch: 20 }));
    worksheet1["!cols"] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet1, "Dispatch Data");


    /* ------------------------------------
       2️⃣ FOOTER SUMMARY TABLE EXPORT
    -------------------------------------*/

    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const summaryData = [
      ["Date", ...days, "Total"],

      [
        "Daily Part Plan",
        ...days.map((d, i) => footerShowData[i]?.planned || ""),
        overallData?.planned || ""
      ],

      [
        "Daily Part Dispatched",
        ...days.map((d, i) => footerShowData[i]?.dispatched || ""),
        overallData?.dispatched || ""
      ],

      [
        "Part Performance %",
        ...days.map((d, i) => footerShowData[i]?.partPerformance || ""),
        overallData?.partOverallPerfo || ""
      ],

      [
        "OTD Delayed Contract",
        ...days.map((d, i) => footerShowData[i]?.delayCount || ""),
        overallData?.delayCount || ""
      ],

      [
        "OTD %",
        ...days.map((d, i) => footerShowData[i]?.otdPerformance || ""),
        overallData?.overallOtdPerc || ""
      ],

      [
        "Total Vehicle Dispatched",
        ...days.map((d, i) => footerShowData[i]?.vehicleCount || ""),
        overallData?.vehicleCount || ""
      ]
    ];

    const worksheet2 = XLSX.utils.aoa_to_sheet(summaryData);

    // Header bold
    const range = XLSX.utils.decode_range(worksheet2["!ref"]);

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });

      if (!worksheet2[address]) continue;

      worksheet2[address].s = {
        font: { bold: true }
      };
    }

    // Column width
    worksheet2["!cols"] = [
      { wch: 28 },
      ...Array(31).fill({ wch: 8 }),
      { wch: 10 }
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet2, "Dispatch Summary");


    /* ------------------------------------
       3️⃣ DOWNLOAD EXCEL FILE
    -------------------------------------*/

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(blob, "Daily_Dispatch_Report.xlsx");
  };

  return (
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "-5px",
          width: "100%",
        }}
      >
        {/* LEFT: Title */}
        <Typography style={{ fontSize: 26, fontWeight: "bold" }}>
          Daily Dispatch Part Plan
        </Typography>

        {/* RIGHT: Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <Typography style={{ fontSize: 20, fontWeight: "bold" }}>
            ShipmentDate:
          </Typography>

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
              getOptionLabel={(option) => option?.DelNoteNo || ""}
              filterOptions={(options, state) => {
                return options.filter((option) =>
                  option.DelNoteNo.toLowerCase().includes(
                    state.inputValue.toLowerCase()
                  )
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select DelNote No"
                  onChange={handleItemChange}
                />
              )}
              onChange={(event, value) => handleItemSelect(value?.id)}
            />
          </div>

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
              overflowX: "scroll",
              boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
            }}
          // className="no-scrollbar"
          >
            <table className="styled-table" style={{ height: "100%" }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr>
                  {keys.length > 0 &&
                    keys.map((col, index) => <th key={index}>{col}</th>)}
                  <th>
                    {" "}
                    <input
                      type="checkbox"
                      className="large-checkbox"
                      checked={
                        checkboxId.length === showData.length &&
                        showData.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                    <span style={{ marginLeft: 6 }}>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {keys.length > 0 &&
                  showData.map((row, index) => {
                    let rowClass = index % 2 === 0 ? "even-row" : "odd-row";

                    if (row.colorCode === "#56ED79") {
                      rowClass += " green-row";
                    } else if (row.colorCode === "#E3EE6A") {
                      rowClass += " yellow-row";
                    } else if (row.colorCode === "#F5B133") {
                      rowClass += " orange-row";
                    }

                    return (
                      <tr key={index} className={rowClass}>
                        {keys.map((col, colIndex) => (
                          <td key={colIndex}>
                            {col === "Remarks" ? (
                              <select
                                value={row[col] || ""}
                                onChange={(e) =>
                                  handleRemarksChange(row.id, e.target.value)
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
                        ))}
                        <td>
                          <input
                            type="checkbox"
                            className="large-checkbox"
                            checked={checkboxId.includes(row.id)}
                            onChange={(e) => handleCheckboxChange(row.id, e)}
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
          // className="no-scrollbar"
          >
            <table
              className="styled-table footer-table"
              style={{ height: "100%" }}
            >
              <tbody>
                <tr className="footer-row">
                  <td colSpan="3">Date</td>
                  {footerShowData.map((item, index) => (
                    <td key={index}>{new Date(item.date).getDate()}</td>
                  ))}
                  <td>Total</td> {/* ✅ Removed extra empty <td> */}
                </tr>

                <tr className="footer-row">
                  <td colSpan="3">Daily Part Plan</td>
                  {Array.from({ length: 31 }).map((_, index) => (
                    <td key={index}>
                      {footerShowData[index]
                        ? footerShowData[index].planned
                        : ""}
                    </td>
                  ))}
                  <td>{overallData?.planned}</td>{" "}
                  {/* ✅ Aligned correctly under Total */}
                </tr>

                <tr className="footer-row">
                  <td colSpan="3">Daily Part Dispatched</td>
                  {Array.from({ length: 31 }).map((_, index) => (
                    <td key={index}>
                      {footerShowData[index]
                        ? footerShowData[index].dispatched
                        : ""}
                    </td>
                  ))}
                  <td>{overallData?.dispatched}</td>
                </tr>

                <tr className="footer-row">
                  <td colSpan="3">Part Performance %</td>
                  {Array.from({ length: 31 }).map((_, index) => (
                    <td key={index}>
                      {footerShowData[index]
                        ? footerShowData[index].partPerformance
                        : ""}
                    </td>
                  ))}
                  <td>{overallData?.partOverallPerfo}%</td>
                </tr>

                <tr className="footer-row">
                  <td colSpan="3">OTD Delayed Contract</td>
                  {Array.from({ length: 31 }).map((_, index) => (
                    <td key={index}>
                      {footerShowData[index]
                        ? footerShowData[index].delayCount
                        : ""}
                    </td>
                  ))}
                  <td>{overallData?.delayCount}</td>
                </tr>

                <tr className="footer-row">
                  <td colSpan="3">OTD %</td>
                  {Array.from({ length: 31 }).map((_, index) => (
                    <td key={index}>
                      {footerShowData[index]
                        ? footerShowData[index].otdPerformance
                        : ""}
                    </td>
                  ))}
                  <td>{overallData?.overallOtdPerc}%</td>
                </tr>

                <tr className="footer-row">
                  <td colSpan="3">Total Vehicle Dispatched</td>
                  {Array.from({ length: 31 }).map((_, index) => (
                    <td key={index}>
                      {footerShowData[index]
                        ? footerShowData[index].vehicleCount
                        : ""}
                    </td>
                  ))}
                  <td>{overallData?.vehicleCount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      </div>
    </div>
  );
};

export default PartNumberDashboard;
