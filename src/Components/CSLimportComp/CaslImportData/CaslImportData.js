import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
  CslMissing,
  SobExlImport,
  cslExlImport,
} from "../../../ApiService/LoginPageService";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { CslExlExport } from "../../../ApiService/DownloadCsvReportsService";
import { CslExlContractsExport } from "../../../ApiService/DownloadPost";
import WarningIcon from "@mui/icons-material/Warning";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const CaslImportData = ({
  open,
  setOpen,
  setRefreshData,
  formDate,
  toDate,
}) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [onChildTrue, setOnChildTrue] = useState(false);
  const [chilsDataList, setChildDataList] = useState([]);
  const [uploadloading, setuploadLoading] = useState(false);
  const [databaseloading, setdatabaseLoading] = useState(false);
  const [exportloading, setexportLoading] = useState(false);
  const [isDuplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [isErrorState, setIsErrorState] = useState(false);
  const [showMessage, setShowmessage] = useState("");

  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const columns = [
    {
      field: "id",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Sl.no</span>
      ),

      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "contractNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Contract No
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
      field: "duty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Duty</span>
      ),

      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "stop",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Stop</span>
      ),

      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "type",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Type</span>
      ),

      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "errorMessage",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Error</span>
      ),

      type: "string",
      sortable: true,
      minWidth: 300,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const columns2 = [
    {
      field: "id",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Sl.no</span>
      ),

      type: "string",
      sortable: true,
      maxWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "contractNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Contract No
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
      field: "boxNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Box No</span>
      ),

      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "partNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Part No</span>
      ),

      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Qty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Qty</span>
      ),

      type: "string",
      sortable: true,
      maxWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "desc",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Desc</span>
      ),

      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handleFolderUpload = async (e) => {
    setuploadLoading(true);
    e.preventDefault();
    const filesData = [];
    for (const file of selectedFolder) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        filesData.push({ name: file.name, data: base64Data });
        if (filesData.length === selectedFolder.length) {
          setSelectedFolder(filesData);
          setIsLoader(true);
          cslExlImport(
            {
              contractList: filesData,
              type: "View",
              // View, "Export",
            },
            SupExcelImportSuccess,
            DownloadSupExcelTemplateException
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const SupExcelImportSuccess = (dataObject) => {
    setuploadLoading(false);
    setdatabaseLoading(false);

    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
      // setOpen(false);
      setIsLoader(false);
      setDataList(dataObject?.data || []);
      // setRefreshData((oldValue) => !oldValue);
    }, 2000);
  };

  const DownloadSupExcelTemplateException = (errorObject, errorMessage) => {
    setuploadLoading(false);
    setdatabaseLoading(false);

    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
      // setOpen(false);
      setIsLoader(false);
      setRefreshData((oldValue) => !oldValue);
    }, 2000);
  };

  const handleFolderChange = (event) => {
    setSelectedFolder(event.target.files);
  };

  const handleCslExlExportSucess = () => {};

  const handleCslExlExportException = () => {};

  const handleRowClick = (e) => {
    setOnChildTrue(true);
    console.log("eeee", e.row.childItems);
    setChildDataList(e.row.childItems || []);
  };

  const handleCslExlContractsExportSuccess = () => {
    setexportLoading(false);
  };

  const handleCslExlContractsExportException = (errorObject, errorMessage) => {
    setexportLoading(false);

    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
  };

  // Function to export error rows

  const arrayToWorksheet = (array) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Error Report");

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

  const handleErrorness = () => {
    // Filter only rows with errorMessage
    const errorRows = dataList.filter((row) => row.errorMessage);

    if (errorRows.length === 0) {
      alert("No error rows found!");
      return;
    }

    // Format data for Excel (adjust keys as per your actual row structure)
    const formattedData = errorRows.map((row, index) => ({
      "SI No": index + 1,
      "Contract No": row.contractNo || "",
      Duty: row.duty || "",
      Stop: row.stop || "",
      Type: row.type || "",
      "Error Message": row.errorMessage || "", // include error msg
    }));

    // Generate workbook & download
    const workbook = arrayToWorksheet(formattedData);
    downloadExcelFile(workbook, "Error_Report.xlsx");

    setOpen(false);
    setSelectedFolder(null);
    setOnChildTrue(false);
    setChildDataList([]);
    setDataList([]);
  };

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxHeight: "100%",
          marginTop: "20px",
        },
      }}
      maxWidth="xl"
      open={open}
    >
      <DialogTitle
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "25px",
        }}
      >
        Import CSL
      </DialogTitle>
      <form onSubmit={handleFolderUpload}>
        <DialogContent>
          {!onChildTrue ? (
            <Grid container spacing={2} style={{ marginTop: "10px" }}>
              {!isLoader ? (
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid
                    item
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <TextField
                      type="file"
                      required
                      InputProps={{
                        inputProps: {
                          directory: "",
                          webkitdirectory: "",
                          multiple: true,
                        },
                        onChange: handleFolderChange,
                      }}
                    />

                    {!isLoader && (
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#002D68",
                          height: "40px",
                          width: "200px",
                          borderRadius: "20px",
                        }}
                        type="submit"
                        disabled={uploadloading}
                      >
                        {uploadloading ? (
                          <CircularProgress
                            size={24}
                            style={{ color: "white" }}
                          />
                        ) : (
                          "Upload Folder"
                        )}
                      </Button>
                    )}
                  </Grid>

                  {/* Right side (Load DB + Export) */}
                  <Grid
                    item
                    sx={{ display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#002D68",
                        height: "40px",
                        width: "200px",
                        borderRadius: "20px",
                      }}
                      disabled={
                        databaseloading ||
                        dataList.some((row) => row.errorMessage)
                      }
                      onClick={() => {
                        const loadedContracts = dataList
                          .filter((row) => row.contractLoaded)
                          .map((row) => row.contractNo)
                          .join(", ");
                        setShowmessage(loadedContracts);
                        if (loadedContracts) {
                          setIsErrorState(true);
                          setDuplicateDialogOpen(true);
                        } else {
                          setdatabaseLoading(true);
                          cslExlImport(
                            {
                              contractList: selectedFolder,
                              type: "Import",
                            },
                            SupExcelImportSuccess,
                            DownloadSupExcelTemplateException
                          );
                        }
                      }}
                    >
                      {databaseloading ? (
                        <CircularProgress
                          size={24}
                          style={{ color: "white" }}
                        />
                      ) : (
                        "Load to Database"
                      )}
                    </Button>

                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#002D68",
                        height: "40px",
                        width: "200px",
                        borderRadius: "20px",
                      }}
                      disabled={exportloading}
                      onClick={() => {
                        setexportLoading(true);
                        CslExlContractsExport(
                          {
                            contractList: dataList,
                            type: "Export",
                          },
                          handleCslExlContractsExportSuccess,
                          handleCslExlContractsExportException
                        );
                      }}
                    >
                      {exportloading ? (
                        <CircularProgress
                          size={24}
                          style={{ color: "white" }}
                        />
                      ) : (
                        "Export"
                      )}
                    </Button>
                  </Grid>

                  <Grid item md={12} style={{ marginTop: "20px" }}>
                    <DataGrid
                      rows={dataList}
                      columns={columns}
                      pageSize={8}
                      // loading={isLoading}
                      onRowClick={handleRowClick}
                      rowsPerPageOptions={[8]}
                      disableSelectionOnClick
                      style={{ border: "none" }}
                      sx={{
                        overflow: "auto",
                        height: "50vh",
                        // minHeight: '500px',
                        width: "100%",
                        "& .super-app-theme--header": {
                          WebkitTextStrokeWidth: "0.6px",
                          backgroundColor: "#93bce6",
                          color: "#1c1919",
                        },
                        "& .error-row": {
                          backgroundColor: "#f8d7da", // light red
                        },
                        "& .contract-loaded-row": {
                          backgroundColor: "#f8d7da", // Light red background
                        },
                        "& .MuiDataGrid-cell": {
                          border: "1px solid #969696",
                        },
                        "& .MuiDataGrid-columnHeader": {
                          border: "1px solid #969696", // Add border to column headers
                        },
                      }}
                      getRowClassName={(params) => {
                        if (params.row.errorMessage) {
                          return "error-row";
                        }
                        const isContractLoaded = params.row.contractLoaded;

                        // Find the index of the row within the rows array
                        const rowIndex = dataList.findIndex(
                          (row) => row.id === params.row.id
                        );
                        // Check if the index is valid
                        // if (rowIndex !== -1) {
                        //     console.log(' ');
                        //     return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                        // }
                        // return ''; // Return default class if index is not found
                        if (isContractLoaded) {
                          return "contract-loaded-row"; // Custom class for light red background
                        }

                        return rowIndex % 2 === 0
                          ? "Mui-evenRow"
                          : "Mui-oddRow";
                      }}
                      rowHeight={40}
                      columnHeaderHeight={40}
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  item
                  md={12}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box sx={{ display: "flex" }}>
                    <CircularProgress />
                  </Box>
                </Grid>
              )}
            </Grid>
          ) : (
            <Grid item md={12} style={{ marginTop: "20px" }}>
              <DataGrid
                rows={chilsDataList}
                columns={columns2}
                pageSize={8}
                // loading={isLoading}
                onRowClick={handleRowClick}
                rowsPerPageOptions={[8]}
                disableSelectionOnClick
                style={{ border: "none" }}
                sx={{
                  overflow: "auto",
                  height: "50vh",
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
                  const rowIndex = chilsDataList.findIndex(
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
          )}
        </DialogContent>
        <DialogActions>
          {onChildTrue ? (
            <Button
              variant="contained"
              style={{ width: "100px", background: "#002D68", color: "white" }}
              onClick={() => {
                setOnChildTrue(false);
              }}
            >
              Back
            </Button>
          ) : (
            <></>
          )}
          <Button
            variant="contained"
            style={{ width: "250px", background: "#002D68", color: "white" }}
            onClick={handleErrorness}
          >
            Remove Errorness
          </Button>

          <Button
            variant="contained"
            style={{ width: "150px", background: "#002D68", color: "white" }}
            onClick={(e) => {
              setOpen(false);
              setIsLoader(false);
              setSelectedFolder(null);
              setOnChildTrue(false);
              setChildDataList([]);
              setDataList([]);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </form>

      <Dialog
        fullWidth
        maxWidth="sm"
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: "100%" } }}
        open={isDuplicateDialogOpen}
        onClose={() => setDuplicateDialogOpen(false)}
      >
        <DialogTitle sx={{ textAlign: "center" }}>
          <WarningIcon
            color="warning"
            style={{ fontSize: 95, color: "#8b1228" }}
          />
        </DialogTitle>

        <DialogContent
          sx={{
            mt: 1,
            textAlign: "center",
            fontFamily: "customfont",
            letterSpacing: "0.5px",
            marginTop: "0px",
          }}
        >
          <Typography
            sx={{
              m: 1,
              fontFamily: "bold",
              letterSpacing: "0.5px",
              padding: "10px 0",
            }}
            variant="h6"
            component="span"
          >
            Contracts {showMessage} are already loaded. Do you want to proceed
          </Typography>
        </DialogContent>
        <DialogActions sx={{ margin: "10px" }}>
          <Button
            variant="contained"
            style={{ width: "200px", background: "#002D68", color: "white" }}
            onClick={() => {
              setDuplicateDialogOpen(false);
              setdatabaseLoading(true);
              cslExlImport(
                {
                  contractList: selectedFolder,
                  type: "Import",
                },
                SupExcelImportSuccess,
                DownloadSupExcelTemplateException
              );
            }}
          >
            Continue
          </Button>

          <Button
            variant="contained"
            style={{ width: "200px", background: "#002D68", color: "white" }}
            onClick={() => setDuplicateDialogOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </Dialog>
  );
};

export default CaslImportData;
