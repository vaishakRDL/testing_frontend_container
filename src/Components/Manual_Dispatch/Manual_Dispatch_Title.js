import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import ExcelTemplateDownloader from "../../ApiService/ExcelTemplateDownloader";
import {
  DownloadSobExlTemplate,
  DownloadSupExcelTemplate,
} from "../../ApiService/DownloadCsvReportsService";
import {
  FilterContractNumber,
  ShowDelNoteManual,
  ShowDelNoteNoteShow,
  SobExlImport,
  SupExcelImport,
  UpdatedispatchDashboardShow,
} from "../../ApiService/LoginPageService";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import ApplicationStore from "../../Utility/localStorageUtil";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import { useModuleLocks } from "../context/ModuleLockContext";

const Manual_Dispatch_Title = (props) => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Manual Dispatch")?.lockStatus === "locked";


  const [file, setFile] = useState(null);
  const [sobDataList, setSobDataList] = useState([]);
  const [contract, setContract] = useState([]);
  const [selectedContract, setSelectedContract] = useState("");
  const [tableData, setTableData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [itemList, setItemList] = useState([]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const [shipmentDate, setShipmentDate] = useState(formatDate(new Date()));
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const { userDetails } = ApplicationStore()?.getStorage("userDetails");
  const userPermission = userDetails?.groupRights?.filter(
    (data) => data?.menu?.toLowerCase() === "holidaymaster"
  );

  const handleFileUpload = () => { };

  const DownloadSupExcelTemplateSuccess = () => { };

  const DownloadSupExcelTemplateException = () => { };

  const SupExcelImportSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
      setFile("");
    }, 5000);
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

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
      field: "FIM",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>FIM No</span>
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
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Status</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "select",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Action</span>
      ),
      minWidth: 100,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox
          checked={params.row.select || false}
          onChange={(e) => {
            const isChecked = e.target.checked;

            setSobDataList((prev) =>
              prev.map((row) =>
                row.id === params.row.id
                  ? { ...row, select: isChecked }
                  : row
              )
            );
          }}

        />
      ),
    }

    // {
    //     field: 'actions',
    //     type: 'actions',
    //     headerClassName: 'super-app-theme--header',
    //     flex: 1,
    //     headerName:
    //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //             Actions
    //         </span>,
    //     cellClassName: 'actions',
    //     disableClickEventBubbling: true,
    //     getActions: (params) => [
    //         <EditData selectedRow={params.row} />,
    //         <DeleteData selectedRow={params.row} />,
    //     ],
    // },
  ];

  const handleView = () => {
    ShowDelNoteManual(
      { shipmentDate: shipmentDate },
      handlesuccess,
      handleError
    );
  };

  const handlesuccess = (dataObject) => {
    setContract(dataObject.data);
  };

  const handleError = () => {
    setContract([]);
  };

  const handleShowContract = () => {
    ShowDelNoteNoteShow(
      { id: selectedContract },
      handleShowsuccess,
      handleShowError
    );
  };

  const handleShowsuccess = (dataObject) => {
    setSobDataList(dataObject.data);

  };

  const handleShowError = () => {
    setSobDataList([]);
  };

  const handleConvertView = () => {
    // Get all checked rows
    const selectedFIMList = sobDataList
      .filter((row) => row.select === true)
      .map((row) => row.FIM); // <-- change to correct column name

    UpdatedispatchDashboardShow(
      {
        id: selectedContract,
        fimNo: selectedFIMList,
      },
      handleConvertViewSuccess,
      handleConvertViewError
    );
  };


  const handleConvertViewSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });


    setSobDataList((old) =>
      old.map((row) => ({ ...row, select: false }))
    );

    setTimeout(() => {
      setNotification({
        status: false,
        type: "",
        message: "",
      });
    }, 3000);
    handleShowContract();
  };


  const handleConvertViewError = () => {

  }

  const handleItemChange = (e) => {
    FilterContractNumber(
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
      setSelectedContract(value);
    }
  };


  return (
    <Box sx={{ padding: "20px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT SIDE — TITLE */}
        <Typography
          variant="h5"
          sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
        >
          Manual Dispatch
        </Typography>

        {/* RIGHT SIDE — Inputs + Button */}
        {/* RIGHT SIDE — Inputs + Button */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ marginTop: { xs: 2, md: 0 } }}
        >
          {/* Shipment Date */}
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
            Shipment Date:
          </Typography>

          <TextField
            type="date"
            size="small"
            value={shipmentDate}
            onChange={(e) => setShipmentDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 150 }}
          />

          {/* VIEW BUTTON 1 */}
          <Button
            variant="contained"
            style={{ backgroundColor: "#002D68" }}
            onClick={handleView}
          >
            View
          </Button>

          {/* Contract Number Label */}
          <Typography sx={{ fontSize: 20, fontWeight: "bold" }}>
            Contract No:
          </Typography>

          {/* Contract Dropdown */}
          <div style={{ width: "300px" }}>
            <Autocomplete
              disablePortal
              options={itemList}
              size="small"
              getOptionLabel={(option) => option?.contractNo?.toString() || ""}
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



          {/* <TextField
            select
            label="Select Contract"
            size="small"
            sx={{ minWidth: 180 }}
            value={selectedContract}
            onChange={(e) => setSelectedContract(e.target.value)}
          >
            {contract.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {item.contractNo}
              </MenuItem>
            ))}
          </TextField> */}

          {/* VIEW BUTTON 2 */}
          <Button
            variant="contained"
            style={{ backgroundColor: "#002D68" }}
            onClick={handleShowContract}
          >
            View
          </Button>
        </Stack>
      </Box>

      {/* --- DataGrid Container --- */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Card
            style={{
              borderRadius: "8px",
              height: "60vh",
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
                      console.log(" ");
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

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <Button
          variant="contained"
          style={{ backgroundColor: isModuleLocked ? "gray" : "#002D68" }}
          onClick={handleConvertView}
          disabled={isModuleLocked}
        >
          Convert to P/R/D
        </Button>
      </div>
      {/* Notification */}
      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </Box>
  );
};

export default Manual_Dispatch_Title;
