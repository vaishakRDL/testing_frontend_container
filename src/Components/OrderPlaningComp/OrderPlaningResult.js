import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  CircularProgress
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { DataGrid } from "@mui/x-data-grid";
import OrderPlaningTitle from "./OrderPlaningTitle";
import OrderPlaningModule from "./OrderPlaningModule";
import {
  DispatchOrderDeleteDelete,
  MachinLoadBottleList,
  OrderPlaningDataShow,
} from "../../ApiService/LoginPageService";
import SplitOrderModule from "./SplitOrderComp/SplitOrderModule";
import ItemDetaildView from "./ItemDetaildView";
import MrpOrderModule from "./MrpOrderComp/MrpOrderModule";
import { Link, useNavigate } from "react-router-dom";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import DownloadIcon from "@mui/icons-material/Download";
import { MrpExportMrpMstId } from "../../ApiService/DownloadCsvReportsService";
import HoldNotification from "./MrpOrderComp/HoldNotification";
import RescheduleOrder from "./MrpOrderComp/RescheduleOrder";
import ForceComplete from "./MrpOrderComp/ForceComplete";
import ForceDelete from "./MrpOrderComp/ForceDelete";
import axios from "axios";
import { useMemo } from "react";
import { useModuleLocks } from "../context/ModuleLockContext";


const OrderPlaningResult = () => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Production Planning and Control")?.lockStatus === "locked";

  const [isDownloading, setIsDownloading] = useState(false);
  const [open, setOpen] = useState(false);
  const [spOpen, setSpOpen] = useState(false);
  const [openMrp, setOpenMrp] = useState(false);
  const [openHold, setOpenHold] = useState(false);
  const [openReshedul, setOpenReshedul] = useState(false);
  const [openFreeComplete, setOpenFreeComplete] = useState(false);
  const [openForceDelete, setOpenForceDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [todayloading, setTodayLoading] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);
  const [isAddButton, setIsAddButton] = useState(true);
  const [editCustomer, setEditCustomer] = useState([]);
  const [salesList, setSalesList] = useState([]);
  const [isLoading, setGridLoading] = useState(true);
  const [id, setId] = useState("");
  const [password, setConfirmPassword] = useState("");
  const [btnReset, setBtnReset] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [seletedItemList, setSeletedItemList] = useState([]);
  const [selectSalesId, setSelectSalesId] = useState("");
  const [selectId, setSelectId] = useState("");
  const [selectMrpMstId, setSelectMrpMstId] = useState("");
  const [selectRowId, setSelectRowId] = useState("");
  const [selectDetails, setSelectDetails] = useState([]);
  const [SelectOptions, setSelectOptions] = useState("SelectOptions");
  const [itemDetaildView, setItemDetaildView] = useState(false);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [arrayList, setArrayList] = useState([]);
  const [TypesScheduling, setTypesScheduling] = useState(
    "Scheduled_and_Process_Order"
  );
  const navigate = useNavigate();
  const [fromDate, setFromeDate] = useState("");
  const [toDate, setToDate] = useState("");
  const today = new Date();
  const date = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");
  const TodaysDate = `${year}/${month}/${date}`;

  const [machineLoadIds, setMachineLoadIds] = useState([]);

  // const columns = [
  //   {
  //     field: "created_at",
  //     headerClassName: "super-app-theme--header",
  //     headerName: (
  //       <span style={{ fontWeight: "bold", fontSize: "16px" }}>Date</span>
  //     ),
  //     type: "string",
  //     sortable: true,
  //     minWidth: 100,
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  //   {
  //     field: "orderNo",
  //     headerClassName: "super-app-theme--header",
  //     headerName: (
  //       <span style={{ fontWeight: "bold", fontSize: "16px" }}>Order No</span>
  //     ),
  //     type: "number",
  //     sortable: true,
  //     minWidth: 100,
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  //   {
  //     field: "mrpNo",
  //     headerClassName: "super-app-theme--header",
  //     headerName: (
  //       <span style={{ fontWeight: "bold", fontSize: "16px" }}>MRP ID</span>
  //     ),
  //     type: "number",
  //     sortable: true,
  //     minWidth: 100,
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  //   {
  //     field: "poNo",
  //     headerClassName: "super-app-theme--header",
  //     headerName: (
  //       <span style={{ fontWeight: "bold", fontSize: "16px" }}>
  //         PO | Contract Ref
  //       </span>
  //     ),
  //     type: "number",
  //     sortable: true,
  //     minWidth: 50,
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  //   {
  //     field: "cName",
  //     headerClassName: "super-app-theme--header",
  //     headerName: (
  //       <span style={{ fontWeight: "bold", fontSize: "16px" }}>
  //         Customer Name
  //       </span>
  //     ),
  //     type: "string", // Changed from 'number' to 'string' since it's a name.
  //     sortable: true,
  //     minWidth: 100,
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  //   {
  //     field: "kanbanDate",
  //     headerClassName: "super-app-theme--header",
  //     headerName: (
  //       <span style={{ fontWeight: "bold", fontSize: "16px" }}>
  //         Kanban Date
  //       </span>
  //     ),
  //     type: "string",
  //     sortable: true,
  //     minWidth: 100,
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  //   {
  //     field: "requestedBy",
  //     headerClassName: "super-app-theme--header",
  //     headerName: (
  //       <span style={{ fontWeight: "bold", fontSize: "16px" }}>User</span>
  //     ),
  //     type: "string",
  //     sortable: true,
  //     minWidth: 50,
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  //   {
  //     field: "delay",
  //     headerClassName: "super-app-theme--header",
  //     headerName: (
  //       <span style={{ fontWeight: "bold", fontSize: "16px" }}>Delay</span>
  //     ),
  //     type: "number",
  //     sortable: true,
  //     minWidth: 50,
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  // ];

  // // ** Add the orderPriority column conditionally **
  // if (
  //   TypesScheduling !== "Completed" &&
  //   TypesScheduling !== "Force_Completed" &&
  //   TypesScheduling !== "Hold"
  // ) {
  //   columns.push({
  //     field: "orderPriority",
  //     headerClassName: "super-app-theme--header",
  //     headerName: (
  //       <span style={{ fontWeight: "bold", fontSize: "16px" }}>Priority</span>
  //     ),
  //     type: "number",
  //     sortable: true,
  //     minWidth: 50,
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   });
  // }

  // // ** Continue defining remaining columns **
  // columns.push(
  //   {
  //     field: "status",
  //     headerClassName: "super-app-theme--header",
  //     headerName: (
  //       <span style={{ fontWeight: "bold", fontSize: "16px" }}>Status</span>
  //     ),
  //     type: "number",
  //     sortable: true,
  //     minWidth: 50,
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  //   {
  //     field: "actions",
  //     type: "actions",
  //     flex: 1,
  //     headerClassName: "super-app-theme--header",
  //     headerName: (
  //       <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
  //     ),
  //     minWidth: 350,
  //     maxWidth: 600,
  //     cellClassName: "actions",
  //     disableClickEventBubbling: true,
  //     getActions: (params) => [
  //       <SelectAction selectedRow={params.row} />,
  //       <DeleteData selectedRow={params.row} />,
  //       <DownloadMRPData selectedRow={params.row} />,
  //     ],
  //   }
  // );


  const columns = useMemo(() => {
    const cols = [
      {
        field: "created_at",
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
        field: "orderNo",
        headerClassName: "super-app-theme--header",
        headerName: (
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>Order No</span>
        ),
        type: "number",
        sortable: true,
        minWidth: 100,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "mrpNo",
        headerClassName: "super-app-theme--header",
        headerName: (
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>MRP ID</span>
        ),
        type: "number",
        sortable: true,
        minWidth: 100,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "poNo",
        headerClassName: "super-app-theme--header",
        headerName: (
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>
            PO | Contract Ref
          </span>
        ),
        type: "number",
        sortable: true,
        minWidth: 50,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "cName",
        headerClassName: "super-app-theme--header",
        headerName: (
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>
            Customer Name
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
        field: "kanbanDate",
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
        field: "requestedBy",
        headerClassName: "super-app-theme--header",
        headerName: (
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>User</span>
        ),
        type: "string",
        sortable: true,
        minWidth: 50,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "delay",
        headerClassName: "super-app-theme--header",
        headerName: (
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>Delay</span>
        ),
        type: "number",
        sortable: true,
        minWidth: 50,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
    ];

    // ✅ Conditional Priority column (SAFE)
    if (
      TypesScheduling !== "Completed" &&
      TypesScheduling !== "Force_Completed" &&
      TypesScheduling !== "Hold"
    ) {
      cols.push({
        field: "orderPriority",
        headerClassName: "super-app-theme--header",
        headerName: (
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>Priority</span>
        ),
        type: "number",
        sortable: true,
        minWidth: 50,
        flex: 1,
        align: "center",
        headerAlign: "center",
      });
    }

    // ✅ Status + Actions (SAFE)
    cols.push(
      {
        field: "status",
        headerClassName: "super-app-theme--header",
        headerName: (
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>Status</span>
        ),
        type: "number",
        sortable: true,
        minWidth: 50,
        flex: 1,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "actions",
        type: "actions",
        flex: 1,
        headerClassName: "super-app-theme--header",
        headerName: (
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
        ),
        minWidth: 350,
        maxWidth: 600,
        cellClassName: "actions",
        disableClickEventBubbling: true,
        getActions: (params) => [
          <SelectAction selectedRow={params.row} />,
          <DeleteData selectedRow={params.row} />,
          <DownloadMRPData selectedRow={params.row} />,
        ],
      }
    );

    return cols;
  }, [TypesScheduling, machineLoadIds]);

  useEffect(() => {
    OrderPlaningDataShow(
      {
        type: TypesScheduling,
        fromDate: fromDate,
        toDate: toDate,
        isNpd: 0,
      },
      handleOrderPlaningDataShowSuccess,
      handleOrderPlaningDataShowException
    );
    //   SaleAddShowData(handleSaleAddShowDataSuccess,handleSaleAddShowDataException);
  }, [refreshData]);

  const handleOrderPlaningDataShowSuccess = (dataObject) => {
    setSalesList(dataObject?.data || []);
    setSubmitLoading(false);
    setTodayLoading(false);
    setMachineLoadIds([]); // ✅ reset selection

  };

  const handleOrderPlaningDataShowException = () => {
    setSubmitLoading(false);
    setTodayLoading(false);

  };

  function SelectAction(props) {

    const handleChange = (e) => {
      if (isModuleLocked) return;
      const value = e.target.value;
      if (value === "SplitOrder") {
        setSpOpen(true);
        setSelectSalesId(props?.selectedRow?.id || "");
        setSelectDetails(props?.selectedRow || []);
      } else if (value === "Mrp") {
        setOpenMrp(true);
        setSelectRowId(props?.selectedRow?.id || "");
      } else if (value === "Hold") {
        setOpenHold(true);
        setSelectRowId(props?.selectedRow?.id || "");
      } else if (value === "RescheduleOrder") {
        setOpenReshedul(true);
        setSelectRowId(props?.selectedRow?.id || "");
      } else if (value === "FreeComplete") {
        setOpenFreeComplete(true);
        setSelectRowId(props?.selectedRow?.id || "");
      } else if (value === "ForceDelete") {
        setOpenForceDelete(true);
        setSelectRowId(props?.selectedRow?.id || "");
      } else {
        setSpOpen(false);
        setOpenMrp(false);
        setOpenHold(false);
        setOpenReshedul(false);
        setOpenFreeComplete(false);
      }
    };

    return (
      <div style={{ display: "flex" }}>
        <FormControl style={{ width: "250px" }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            defaultValue={SelectOptions}
            onChange={handleChange}
            disabled={isModuleLocked}
          >
            <MenuItem value="SelectOptions">Select Options</MenuItem>
            <MenuItem value="Hold">Hold</MenuItem>
            <MenuItem value="Mrp">MRP</MenuItem>
            <MenuItem value="RescheduleOrder">Reschedule Order</MenuItem>
            {/* <MenuItem value='SplitOrder'>Split Order</MenuItem> */}
            <MenuItem value="FreeComplete">Force Complete</MenuItem>
            <MenuItem value="ForceDelete">Force Delete</MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  }

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  function RowSelectAction(props) {
    const onSelectedItem = () => {
      setArrayList([...arrayList, props.selectedRow]);
    };

    return (
      <div style={{ display: "flex" }}>
        <Checkbox
          disabled={isModuleLocked}
          {...label}
          checked={arrayList?.id === props.selectedRow ? true : false}
          onClick={onSelectedItem}
        />
      </div>
    );
  }

  function DeleteData(props) {
    return (
      <DeleteIcon
        onClick={() => {
          if (isModuleLocked) return;

          setDeleteDailogOpen(true);
          setDeleteId(props.selectedRow.id);
        }}
        style={{ color: isModuleLocked ? "gray" : "black" }}
      />
    );
  }


  // function DownloadMRPData(props) {
  //   const [disabled, setDisabled] = React.useState(false);

  //   const handleClick = () => {
  //     if (disabled) return;   // prevent double click

  //     setDisabled(true);      // disable when click starts

  //     MrpExportMrpMstId(
  //       { mrpMstId: props.selectedRow.mrpMstId },

  //       // SUCCESS → enable again
  //       (response) => {
  //         handleMrpExportMrpMstIdSuccess(response);
  //         setDisabled(false);
  //       },

  //       // ERROR → still enable again
  //       (error) => {
  //         handleMrpExportMrpMstIdException(error);
  //         setDisabled(false);
  //       }
  //     );
  //   };

  //   return (
  //     <Tooltip title={disabled ? "Downloading..." : "Download MRP Data"}>
  //       <DownloadIcon
  //         onClick={handleClick}
  //         style={{
  //           color: disabled ? "gray" : "black",
  //           opacity: disabled ? 0.5 : 1,
  //           pointerEvents: disabled ? "none" : "auto",
  //           cursor: disabled ? "not-allowed" : "pointer",
  //         }}
  //       />
  //     </Tooltip>
  //   );
  // }

  function DownloadMRPData(props) {
    const [disabled, setDisabled] = React.useState(false);
    const mrpId = props.selectedRow.mrpMstId;

    const handleClick = () => {
      if (disabled || isModuleLocked) return;

      setDisabled(true);

      MrpExportMrpMstId(
        { mrpMstId: mrpId },
        (response) => {
          handleMrpExportMrpMstIdSuccess(response);
          setDisabled(false);
        },
        (error) => {
          handleMrpExportMrpMstIdException(error);
          setDisabled(false);
        }
      );
    };

    const handleCheckboxChange = (e) => {
      if (e.target.checked) {
        setMachineLoadIds((prev) =>
          prev.includes(mrpId) ? prev : [...prev, mrpId]
        );
      } else {
        setMachineLoadIds((prev) =>
          prev.filter((id) => id !== mrpId)
        );
      }
    };

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Tooltip title={disabled ? "Downloading..." : "Download MRP Data"}>
          <DownloadIcon

            onClick={handleClick}
            style={{
              color: disabled || isModuleLocked ? "gray" : "black",
              cursor: disabled || isModuleLocked ? "not-allowed" : "pointer",
            }}
          />
        </Tooltip>

        {/* ✅ CHECKBOX ADDED (AFTER DOWNLOAD ICON) */}
        <Checkbox
          size="small"
          disabled={isModuleLocked}
          checked={machineLoadIds.includes(mrpId)}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()} // VERY IMPORTANT
        />
      </div>
    );
  }
  // const handleMachineLoad = () => {
  //   if (machineLoadIds.length === 0) return;

  //   const ids = machineLoadIds.join(",");

  //   const url = `http://192.168.1.74:8000/api/planning/machineLoad?mrpMstIds=${ids}`;

  //   window.open(url, "_blank"); // Excel download
  // };
  // const handleMachineLoad = async () => {
  //   if (machineLoadIds.length === 0) return;

  //   try {
  //     const ids = machineLoadIds.join(",");

  //     const response = await axios.get(
  //       "http://192.168.1.74:8000/api/planning/machineLoad",
  //       {
  //         params: { mrpMstIds: ids },
  //         responseType: "blob",
  //       }
  //     );

  //     // NORMAL browser download
  //     const url = window.URL.createObjectURL(
  //       new Blob([response.data])
  //     );

  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "Machine_Load.xlsx");
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //     window.URL.revokeObjectURL(url);

  //     // ✅ CLEAR CHECKBOX AFTER SUCCESS
  //     setMachineLoadIds([]);

  //   } catch (error) {
  //     console.error("Machine Load download failed", error);
  //   }
  // };

  const handleMachineLoad = () => {
    setIsDownloading(true);
    if (machineLoadIds.length === 0) return;

    const ids = machineLoadIds.join(",");

    MachinLoadBottleList(
      { mrpMstIds: ids },

      (response) => {
        const blob = new Blob([response], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "Machine_Load.xlsx";

        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        setMachineLoadIds([]); // clear checkbox
        setIsDownloading(false);
      },

      (error) => {
        console.error("Machine Load download failed", error);
      }
    );
  };




  const handleMrpExportMrpMstIdSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: "Download Successful",
    });

    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const handleMrpExportMrpMstIdException = () => { };

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

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const OnChangeType = (e) => {
    setTypesScheduling(e.target.value);
  };

  const handleRowClick = (e) => {
    setItemDetaildView(true);
    setSelectId(e.row.id || "");
    setSelectMrpMstId(e.row.mrpMstId || "");
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
      setFromeDate(value);
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

      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '98%', height: '100%' }}>
          <CardContent>
            <Grid container spacing={2} alignItems={'center'}>
              <Grid item xs={12} sm={12} md={2.7} lg={2.7} xl={2.7} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Typography sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }} variant="h5">Production Planning And Control</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={1.70} lg={1.70} xl={1.70} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <FormControl fullWidth
                >
                  <InputLabel id="demo-simple-select-label">Types of Scheduling</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={TypesScheduling}
                    label="Customer Name"
                    variant="filled"
                    onChange={OnChangeType}
                    size="small"
                  >
                    {/* <MenuItem value={'Pending Order'}>Pending Order</MenuItem> */}
                    <MenuItem value={'Scheduled_and_Process_Order'}>Pending and Schedule Order</MenuItem>
                    <MenuItem value={'Hold'}>Hold</MenuItem>
                    <MenuItem value={'All'}>All</MenuItem>
                    <MenuItem value={'Completed'}>Completed</MenuItem>
                    <MenuItem value={'Force_Completed'}>Force Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12} md={1.6} lg={1.6} xl={1.6}>
                <TextField
                  id="filled-basic"
                  label="From date"
                  variant="filled"
                  fullWidth
                  required
                  size="small"
                  placeholder="From date"
                  type="date"
                  onChange={handleFromDateChange}
                  inputProps={{
                    min: fyFrom,
                    max: fyTo,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={1.6} lg={1.6} xl={1.6}>
                <TextField
                  id="filled-basic"
                  label="To date"
                  variant="filled"
                  fullWidth
                  required
                  size="small"
                  onChange={handleToDateChange}
                  inputProps={{
                    min: fyFrom,
                    max: fyTo,
                  }}
                  placeholder="To date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={1}
                lg={1}
                xl={1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  style={{
                    width: "150px",
                    background: "#002D68",
                    color: "white",
                  }}
                  disabled={todayloading}
                  onClick={() => {
                    setTodayLoading(true);

                    OrderPlaningDataShow(
                      {
                        type: TypesScheduling,
                        fromDate: TodaysDate,
                        toDate: TodaysDate,
                        isNpd: 0,
                      },
                      handleOrderPlaningDataShowSuccess,
                      handleOrderPlaningDataShowException
                    );
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} style={{ color: 'white' }} />
                  ) : (
                    "Today"
                  )}                     </Button>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={1}
                lg={1}
                xl={1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  style={{
                    width: "150px",
                    background: "#002D68",
                    color: "white",
                  }}
                  onClick={() => {
                    setSubmitLoading(true)
                    OrderPlaningDataShow(
                      {
                        type: TypesScheduling,
                        fromDate: fromDate,
                        toDate: toDate,
                        isNpd: 0,
                      },
                      handleOrderPlaningDataShowSuccess,
                      handleOrderPlaningDataShowException
                    );
                  }}
                  disabled={submitloading} >

                  {submitloading ? (
                    <CircularProgress size={24} style={{ color: 'white' }} />
                  ) : (
                    "Submit"
                  )}                </Button>
              </Grid>


              <Grid
                item
                xs={12}
                sm={12}
                md={2.4}
                lg={2.4}
                xl={2.4}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  columnGap: "10px",
                }}
              >
                <Button
                  variant="contained"
                  style={{
                    width: "160px",
                    background: machineLoadIds.length === 0 ? "gray" : "#2e7d32",
                    color: "white",
                  }}
                  disabled={machineLoadIds.length === 0 || isDownloading}
                  onClick={handleMachineLoad}
                >
                  {isDownloading ? (
                    <CircularProgress size={24} style={{ color: 'white' }} />
                  ) : (
                    "Capacity Planner"
                  )}                </Button>

                <Button
                  variant="contained"
                  style={{
                    width: "150px",
                    background: "#002D68",
                    color: "white",
                  }}
                  onClick={() => {
                    // setSpOpen(true);
                    navigate(`/GanttChartModule`);
                  }}
                >
                  Gantt Chart
                </Button>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <DataGrid
                rows={salesList}
                columns={columns}
                pageSize={8}
                // loading={isLoading}
                rowsPerPageOptions={[8]}
                onRowClick={handleRowClick}
                disableSelectionOnClick
                style={{ border: "none" }}
                sx={{
                  overflow: "auto",
                  height: "55vh",
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
                getRowClassName={(params) =>
                  params.indexRelativeToCurrentPage % 2 === 0
                    ? "Mui-evenRow"
                    : "Mui-oddRow"
                }

                rowHeight={40}
                columnHeaderHeight={40}
              />
            </Grid>
          </CardContent>
        </Card>
      </div>

      <OrderPlaningModule
        isAddButton={isAddButton}
        customerData={editCustomer}
        open={open}
        setOpen={setOpen}
        setRefreshData={setRefreshData}
      />
      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />

      <SplitOrderModule
        setOpen={setSpOpen}
        open={spOpen}
        seletedItemList={arrayList}
        setSeletedItemList={setArrayList}
        selectSalesId={selectSalesId}
        selectDetails={selectDetails}
        setRefreshData={setRefreshData}
      />

      <MrpOrderModule
        openMrp={openMrp}
        setOpenMrp={setOpenMrp}
        selectRowId={selectRowId}
        setRefreshData={setRefreshData}
      />

      <ItemDetaildView
        itemDetaildView={itemDetaildView}
        setItemDetaildView={setItemDetaildView}
        selectSalesId={selectId}
        selectMrpMstId={selectMrpMstId}
      />

      <DeleteConfirmationDailog
        open={deleteDailogOpen}
        setOpen={setDeleteDailogOpen}
        deleteId={deleteId}
        deleteService={DispatchOrderDeleteDelete}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />

      <HoldNotification
        open={openHold}
        setOpen={setOpenHold}
        selectRowId={selectRowId}
        setRefreshData={setRefreshData}
      />

      <RescheduleOrder
        open={openReshedul}
        setOpen={setOpenReshedul}
        selectRowId={selectRowId}
        setRefreshData={setRefreshData}
      />
      <ForceComplete
        open={openFreeComplete}
        setOpen={setOpenFreeComplete}
        selectRowId={selectRowId}
        setRefreshData={setRefreshData}
      />
      <ForceDelete
        open={openForceDelete}
        setOpen={setOpenForceDelete}
        selectRowId={selectRowId}
        setRefreshData={setRefreshData}
      />
    </div>
  );
};

export default OrderPlaningResult;
