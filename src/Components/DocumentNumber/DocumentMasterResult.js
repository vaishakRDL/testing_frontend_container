import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { io } from "socket.io-client";
import { DataGrid } from "@mui/x-data-grid";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { DeleteHoliday, EditfinancialYear, ShowHoliday, ShowfinancialYearData } from "../../ApiService/LoginPageService";
import "../../App.css";
import ApplicationStore from "../../Utility/localStorageUtil";
import DocumentMastertitle from "./DocumentMastertitle";
import DocumentMasterModule from "./DocumentMasterModule";
import DocumentFinancialYearModule from "./DocumentFinancialYearModule";
import { useModuleLocks } from "../context/ModuleLockContext";

const DocumentMasterResult = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Document Number")?.lockStatus === "locked";
  const [open, setOpen] = useState(false);
  const [isAddButton, setIsAddButton] = useState(true);
  const [editData, setEditData] = useState([]);
  const [isLoading, setGridLoading] = useState(true);
  const [masterData, serMasterData] = useState([]);

  const [refreshData, setRefreshData] = useState(false);
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [sobDataList, setSobDataList] = useState([]);
  const [isTimeSlot, setIsTimeSlot] = useState(0);
  const [openModule, setOpenModule] = useState(false);
  //NEW STATE VARIBALES
  const [activeSwitch, setActiveSwitch] = React.useState(null); // Track the active row

  useEffect(() => {
    if (!sobDataList || sobDataList.length === 0) return;

    const activeRow = sobDataList.find((row) => row.isActive == 1);

    if (activeRow) {
      setSelectedRows([activeRow.id]); // ✅ THIS FIXES CHECKBOX
    }
  }, [sobDataList]);


  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const { userDetails, fyfrom, fyto } = ApplicationStore()?.getStorage("userDetails");
  const userPermission = userDetails?.groupRights?.filter(
    (data) => data?.menu?.toLowerCase() === "holidaymaster"
  );

  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");

  useEffect(() => {
    // Load the initial value from localStorage when the component mounts
    const storedData = JSON.parse(localStorage.getItem("userDetails")) || {};
    setFyFrom(storedData.fyFrom || "");
    setFyTo(storedData.fyTo || "");

  }, []);

  const handleSwitchChanges = (data) => {
    let existingData = JSON.parse(localStorage.getItem("userDetails")) || {};

    const updatedData = {
      ...existingData,
      fyFrom: data?.fromDate,
      fyTo: data?.toDate
    };

    localStorage.setItem("userDetails", JSON.stringify(updatedData));
    setFyFrom(data?.fromDate); // Update state to trigger re-render
  };

  const isAdmin = userDetails?.userRole?.toLowerCase?.() === "admin";
  const columns = [
    {
      field: "sNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>SI No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fromDate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Financial Year From</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toDate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Financial Year To</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Switch Financial Year</span>
      ),
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isChecked = fyFrom === params.row.fromDate; // Now tracks state changes

        return (
          <Switch
            disabled={isModuleLocked}
            checked={isChecked}
            onChange={() => handleSwitchChanges(params.row)}
          />
        );
      },
    },
    {
      field: "setActive",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Set Active
        </span>
      ),
      headerClassName: "super-app-theme--header",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <input
            type="checkbox"
            disabled={!isAdmin}
            checked={selectedRows.includes(params.row.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRows([params.row.id]); // 🔥 single select
              } else {
                setSelectedRows([]);
              }
            }}
          />
        );
      },
    }
  ];

  const handleActionSuccess = () => {

  }

  const handleActionException = () => {

  }

  useEffect(() => {
    ShowfinancialYearData(handleSobShowDataSuccess, handleSobShowDataException);
  }, [refreshData]);

  const handleSobShowDataSuccess = (dataObject) => {
    setSobDataList(dataObject?.data || []);
  };

  const handleSobShowDataException = (errorObject, errorMessage) => { };

  function EditData(props) {
    return (
      <EditIcon
        style={{
          color: userPermission[0]?.updateData === 0 ? "#706f6f" : "black",
        }}
        onClick={(event) => {
          if (userPermission[0]?.updateData === 1) {
            setOpen(true);
            setIsAddButton(false);
            setEditData(props.selectedRow);
          }
        }}
      />
    );
  }

  function DeleteData(props) {
    return (
      <DeleteIcon
        style={{
          color: userPermission[0]?.deleteData === 0 ? "#706f6f" : "black",
        }}
        onClick={() => {
          if (userPermission[0]?.deleteData === 1) {
            setDeleteId(props.selectedRow.id);
            setDeleteDailogOpen(true);
          }
        }}
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

  const handleSucessShow = (dataObject) => {
    serMasterData(dataObject?.data || []);
    setGridLoading(false);
  };
  const handleExceptionShow = (errorObject, errorMessage) => { };

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

  const options = sobDataList.map((item) => ({
    id: item?.id,
    label: item?.contractNo,
  }));

  function handleAutocompleteChange(selectedValue) { }

  // const handleSetActive = () => {
  //   if (selectedRows.length === 0) return;

  //   const payload = {
  //     id: selectedRows[0],
  //   };

  //   EditfinancialYear(
  //     payload,
  //     (dataObject) => {
  //       setNotification({
  //         status: true,
  //         type: "success",
  //         message: dataObject?.message || "Success", // ✅ backend message
  //       });

  //       setSelectedRows([]);
  //       setRefreshData((prev) => !prev);
  //     },
  //     (errorObject, errorMessage) => {
  //       setNotification({
  //         status: true,
  //         type: "error",
  //         message: errorMessage || "Something went wrong", // ✅ backend error
  //       });
  //     }
  //   );
  // };
  const handleSetActive = () => {
    if (selectedRows.length === 0) return;

    const payload = {
      id: selectedRows[0],
    };

    EditfinancialYear(
      payload,
      (dataObject) => {

        const selectedRow = sobDataList.find(
          (row) => row.id === selectedRows[0]
        );

        // ✅ update localStorage (toggle)
        let existingData = JSON.parse(localStorage.getItem("userDetails")) || {};

        const updatedData = {
          ...existingData,
          fyFrom: selectedRow?.fromDate,
          fyTo: selectedRow?.toDate,
        };

        localStorage.setItem("userDetails", JSON.stringify(updatedData));

        setFyFrom(selectedRow?.fromDate);

        // ✅ KEEP checkbox selected
        setSelectedRows([selectedRow.id]);

        setNotification({
          status: true,
          type: "success",
          message: dataObject?.message || "Success",
        });

        setRefreshData((prev) => !prev);
      },
      (errorObject, errorMessage) => {
        setNotification({
          status: true,
          type: "error",
          message: errorMessage || "Something went wrong",
        });
      }
    );
  };
  const API_URL = process.env.REACT_APP_API_URL;

  // ✅ SAFE removal of /api
  const SOCKET_BASE_URL = API_URL.replace(/\/api\/?$/, '');
  useEffect(() => {
    const socket = io(`${SOCKET_BASE_URL}/erp`); // 🔁 change URL

    socket.on("ACTIVE_FY_UPDATED", (data) => {
      console.log("Global FY Update:", data);

      const newFY = data.activeFY;

      // ✅ Update localStorage (GLOBAL SOURCE)
      const existingData =
        ApplicationStore().getStorage("userDetails") || {};

      const updatedData = {
        ...existingData,
        fyFrom: newFY.fyFrom,
        fyTo: newFY.fyTo,
      };

      ApplicationStore().setStorage("userDetails", updatedData);

      // 🔥 Notify all components
      window.dispatchEvent(new Event("fyUpdated"));
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div style={{ height: "80vh", margin: "20px" }}>
      {/* <DocumentMastertitle
        setIsAddButton={setIsAddButton}
        setEditData={setEditData}
        setOpen={setOpen}
      /> */}
      <DocumentMastertitle
        setIsAddButton={setIsAddButton}
        setEditData={setEditData}
        setOpen={setOpen}
        isAdmin={isAdmin}
        selectedRows={selectedRows}
        handleSetActive={handleSetActive}
      />
      {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}> */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>

          <Card
            style={{
              borderRadius: "8px",
              height: "75vh",
              marginTop: "10px",
              boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
            }}
          >
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >

              <Box
                sx={{
                  height: "150%",
                  width: "100%",
                  "& .super-app-theme--header": {
                    backgroundColor: "#93bce6",
                    color: "#1c1919",
                  },
                }}
              >
                <DataGrid
                  rows={sobDataList}
                  columns={columns}
                  pageSize={8}
                  // loading={isLoading}
                  rowsPerPageOptions={[8]}
                  disableSelectionOnClick
                  style={{ border: "none", fontWeight: "bold" }}
                  sx={{
                    overflow: "auto",
                    height: "70vh",
                    // minHeight: '500px',
                    width: "100%",
                    "& .super-app-theme--header": {
                      WebkitTextStrokeWidth: "0.6px",
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
                    const rowIndex = sobDataList.findIndex(
                      (row) => row.id === params.row.id
                    );
                    // Check if the index is valid
                    if (rowIndex !== -1) {
                      return rowIndex % 2 === 0 ? "Mui-evenRow" : "Mui-oddRow";
                    }
                    return ""; // Return default class if index is not found
                  }}
                  rowHeight={40}
                  columnHeaderHeight={40}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* </div> */}

      <DocumentMasterModule
        isAddButton={isAddButton}
        editData={editData}
        open={open}
        setOpen={setOpen}
        setRefreshData={setRefreshData}
        fromDate1={fyFrom}
        ToDate1={fyTo}
      />

      <DocumentFinancialYearModule
        open={openModule}
        setOpen={setOpenModule}
        setRefreshData={setRefreshData}
      />

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
        deleteService={DeleteHoliday}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />
    </div>
  );
};

export default DocumentMasterResult;
