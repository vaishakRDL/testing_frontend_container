import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Tooltip,
  CircularProgress
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { DataGrid } from "@mui/x-data-grid";
import SalesTitle from "./SalesTitle";
import SalesModule from "./SalesModule";
import {
  OrderProcessSales,
  SaleAddShowData,
  SaleOrderFullDataDelete,
} from "../../ApiService/LoginPageService";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import ConfirmProcess from "../../Utility/confirmProcess";
import "../../App.css";
import ApplicationStore from "../../Utility/localStorageUtil";
import MRPModule from "./MRPModal/MRPModule";
import { useLocation } from "react-router-dom";
import SalesItemDetailView from "./SalesItemDetailView";
import { useModuleLocks } from "../context/ModuleLockContext";

const SalesResult = () => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Order Input")?.lockStatus === "locked";

  const [open, setOpen] = useState(false);
  const [isAddButton, setIsAddButton] = useState(true);
  const [editeData, setEditeData] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [processDailogOpen, setProcessDailogOpen] = useState(false);
  const [processId, setProcessId] = useState("");
  const [mrpModalOpen, setMrpModalOpen] = useState(false);
  const [itemDetaildView, setItemDetaildView] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [toDate, setToDate] = useState("");
  const [selectId, setSelectId] = useState("");
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const location = useLocation();
  const isRejected = new URLSearchParams(location.search).get("isRejected");
  const selectedItems = new URLSearchParams(location.search).get(
    "selectedItems"
  );
  const parsedSelectedItems = isRejected && JSON.parse(selectedItems);
  // console.log("parsedSelectedItemsparsedSelectedItems",parsedSelectedItems)
  // console.log("ORDER INPUT REJECTED ITEMS", isRejected && JSON.parse(selectedItems))
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");
  const { userDetails } = ApplicationStore().getStorage("userDetails");
  console.log("userDetails.userRoleuserDetails.userRole", userDetails.userRole);
  const userPermission = userDetails?.groupRights?.filter(
    (data) => data?.menu?.toLowerCase() === "orderinput"
  );

  useEffect(() => {
    isRejected && setOpen(true);
  }, [isRejected]);

  const today = new Date();
  const date = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  const TodaysDate = `${year}/${month}/${date}`;

  const columns = [
    {
      field: "sNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>S.No</span>
      ),

      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdDate",
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
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>order No</span>
      ),

      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "poRef",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          PO | Contract ref
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
      field: "cName",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Customer Name
        </span>
      ),

      type: "number",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //     field: 'devliveryDate',
    //     headerClassName: 'super-app-theme--header',
    //     headerName:
    //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //             KANBAN | Delivery Date
    //         </span>,

    //     type: 'string',
    //     sortable: true,
    //     minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
    // },
    {
      field: "actions",
      type: "actions",
      flex: 1,
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
      ),

      cellClassName: "actions",
      disableClickEventBubbling: true,
      getActions: (params) => [
        <EditData selectedRow={params.row} />,
        <DeleteData selectedRow={params.row} />,
        <Process selectedRow={params.row} />,
      ],
    },
  ];

  useEffect(() => {
    SaleAddShowData(
      {
        isNpd: 0,
        isAssembly: /* userDetails.userRole === "Assembly" ? 1 : */ 0,
        fromDate: fromDate,
        toDate: toDate,
      },
      handleSaleAddShowDataSuccess,
      handleSaleAddShowDataException
    );
  }, [refreshData, toDate]);

  const handleSaleAddShowDataSuccess = (dataObject) => {
    setDataList(dataObject?.data || []);
    setLoading(false);

  };

  const handleSaleAddShowDataException = () => {
    setLoading(false);

  };
  const canEdit =
    !isModuleLocked && userPermission?.[0]?.updateData === 1;

  function EditData(props) {
    return (
      <EditIcon
        style={{
          color: canEdit ? "#000000" : "gray",
          cursor: canEdit ? "pointer" : "not-allowed",
        }}
        onClick={() => {
          if (!canEdit) return;

          setOpen(true);
          setEditeData(props.selectedRow);
          setIsAddButton(false);
        }}
      />
    );
  }

  function DeleteData(props) {
    return (
      <Tooltip title="Delete">
        <DeleteIcon
          style={{
            color: canEdit ? "#000000" : "gray",
            cursor: canEdit ? "pointer" : "not-allowed",
          }}
          onClick={() => {
            if (!canEdit) return;

            setDeleteId(props.selectedRow.id);
            setDeleteDailogOpen(true);

          }}
        />
      </Tooltip>
    );
  }

  function Process(props) {
    return (
      <Tooltip
        title={
          /*userDetails.userRole === "Assembly" ? 'Generate MRP' :*/ "Process Oder"
        }
      >
        {/* {userDetails.userRole === "Assembly" ?
                    <ChangeCircleIcon
                        style={{ color: 'black' }}
                        onClick={(event) => {
                            // setProcessDailogOpen(true);
                            setMrpModalOpen(true);
                            setProcessId(props.selectedRow.id || '');
                            // handleAssemblyUserProcessOrder(props.selectedRow.id);
                        }}
                    />
                    : */}
        <PublishedWithChangesIcon
          style={{
            color: canEdit ? "#000000" : "gray",
            cursor: canEdit ? "pointer" : "not-allowed",
          }} onClick={(event) => {
            if (!canEdit) return;

            setProcessDailogOpen(true);
            setProcessId(props.selectedRow.id || "");
          }}
        />
        {/* } */}
      </Tooltip>
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
    setProcessDailogOpen(false);

    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });

    setRefreshData((oldvalue) => !oldvalue);
    setTimeout(() => {
      handleClose();
      setDeleteDailogOpen(false);
    }, 2000);
  };

  const deletehandleException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      setProcessDailogOpen(false);
      handleClose();
    }, 2000);
  };

  const handleRowClick = (e) => {
    setItemDetaildView(true);
    setSelectId(e.row.id || "");
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
      <SalesTitle
        setIsAddButton={setIsAddButton}
        setEditeData={setEditeData}
        setOpen={setOpen}
      />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
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
            <Grid container spacing={2}>
              <Grid item sx={12} sm={12} md={3} lg={3} xl={3}>
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
              <Grid item sx={12} sm={12} md={3} lg={3} xl={3}>
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

              <Grid item sx={12} sm={12} md={3} lg={3} xl={3}>
                <Button
                  variant="contained"
                  style={{
                    width: "250px",
                    height: "40px",
                    background: "#002D68",
                    color: "white",
                    marginLeft: "20px",
                  }}
                  disabled={loading}

                  onClick={() => {
                    setLoading(true);

                    SaleAddShowData(
                      {
                        isNpd: 0,
                        isAssembly: /*userDetails.userRole === "Assembly" ? 1 :*/ 0,
                        fromDate: TodaysDate,
                        toDate: TodaysDate,
                      },
                      handleSaleAddShowDataSuccess,
                      handleSaleAddShowDataException
                    );
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} style={{ color: 'white' }} />
                  ) : (
                    "Today"
                  )}                   </Button>
              </Grid>

              <Grid item sx={12} sm={12} md={12} lg={12} xl={12}>
                <DataGrid
                  rows={dataList}
                  columns={columns}
                  pageSize={8}
                  // loading={isLoading}
                  rowsPerPageOptions={[8]}
                  onRowClick={handleRowClick}
                  disableSelectionOnClick
                  style={{ border: "none" }}
                  sx={{
                    overflow: "auto",
                    height: "70vh",
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
                  getRowClassName={(params) => {
                    // Find the index of the row within the rows array
                    const rowIndex = dataList.findIndex(
                      (row) => row.id === params.row.id
                    );
                    // Check if the index is valid
                    if (rowIndex !== -1) {
                      console.log(" ");
                      return rowIndex % 2 === 0 ? "Mui-evenRow" : "Mui-oddRow";
                    }
                    return ""; // Return default class if index is not found
                  }}
                  rowHeight={40}
                  columnHeaderHeight={40}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>

      <SalesModule
        isAddButton={isAddButton}
        editeData={editeData}
        open={open}
        setOpen={setOpen}
        setRefreshData={setRefreshData}
        user={userDetails.userRole}
        isRejected={isRejected}
        selectedItems={parsedSelectedItems}
      />

      <DeleteConfirmationDailog
        open={deleteDailogOpen}
        setOpen={setDeleteDailogOpen}
        deleteId={deleteId}
        deleteService={SaleOrderFullDataDelete}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />

      <ConfirmProcess
        open={processDailogOpen}
        setOpen={setProcessDailogOpen}
        processId={processId}
        deleteService={OrderProcessSales}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />

      <MRPModule
        mrpModalOpen={mrpModalOpen}
        setMrpModalOpen={setMrpModalOpen}
        processId={processId}
      />

      <SalesItemDetailView
        itemDetaildView={itemDetaildView}
        setItemDetaildView={setItemDetaildView}
        selectSalesId={selectId}
      />

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
};

export default SalesResult;
