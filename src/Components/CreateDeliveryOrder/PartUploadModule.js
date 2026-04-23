import {
  Button,
  Box,
  Dialog,
  Tooltip,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import {
  DispatchExlimport,
  OpenPoXlUpload,
  UploadOpenPoXlValidData,
} from "../../ApiService/LoginPageService";
import { DispatchExlPartTemp } from "../../ApiService/DownloadCsvReportsService";
import { DataGrid } from "@mui/x-data-grid";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const PartUploadModule = ({
  open,
  setOpen,
  setExcelList,
  setPageRefresher,
  customerSelect,
}) => {
  const [date, setDate] = useState("");
  const [file, setFile] = useState("");
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [uploadOpenPo, setUploadOpenPo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoader, setUploadLoader] = useState(false);

  // ✅ Derived state: check if any row has errorRemark
  const hasErrors = uploadOpenPo.some((row) => row.errorRemark);

  const handleSubmit = (e) => {
    e.preventDefault();
    setUploadLoader(true);
    OpenPoXlUpload(
      {
        date: date,
        file: file,
        customerId: customerSelect,
      },
      handleDispatchExlimportSuccess,
      handleDispatchExlimportException
    );
  };

  const handleDispatchExlimportSuccess = (dataObject) => {
    setUploadOpenPo(dataObject?.items || []);
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
      setUploadLoader(false);
    }, 3000);
  };

  const handleDispatchExlimportException = () => {
    setTimeout(() => {
      setUploadLoader(false);
    }, 3000);
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handleDownloadSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const handleDownloadException = () => { };

  const columns = [
    {
      field: "part",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Item Code</span>
      ),
      type: "string",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "excelId",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Excel Id</span>
      ),
      type: "string",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "qty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Quantity</span>
      ),
      type: "string",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tslot",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Time Slot</span>
      ),
      type: "string",
      sortable: true,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "errorRemark",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Error Remarks
        </span>
      ),
      type: "string",
      sortable: true,
      flex: 2,
      align: "center",
      headerAlign: "center",
    },
  ];

  const handleErrorRemovness = () => {
    const errorRows = uploadOpenPo.filter((row) => row.errorFlag === 1);
    const validRows = uploadOpenPo.filter((row) => row.errorFlag !== 1);

    if (errorRows.length > 0) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Error Rows");
      const excludedKeys = ["id", "rowNo", "itemId"];

      const keys = Object.keys(errorRows[0]).filter(
        (key) => !excludedKeys.includes(key)
      );
      worksheet.columns = keys.map((key) => ({
        header: key.charAt(0).toUpperCase() + key.slice(1),
        key,
        width: 20,
      }));

      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });

      errorRows.forEach((row) => {
        worksheet.addRow(row);
      });

      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer]), "ErrorRows.xlsx");
      });
    }

    setUploadOpenPo(validRows);
    setNotification({
      status: true,
      type: "success",
      message: "Error rows removed and downloaded successfully!",
    });

    setTimeout(() => {
      setNotification({ status: false, type: "", message: "" });
    }, 2000);
  };

  const handleUploadXlData = () => {
    setLoading(true);
    UploadOpenPoXlValidData(
      { items: uploadOpenPo },
      handleUpluadSuccess,
      handleUploadException
    );
  };

  const handleUpluadSuccess = (dataObject) => {
    setPageRefresher((oldvalue) => !oldvalue);
    setLoading(false);
    setExcelList("");
    setUploadOpenPo([]);
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });

    setTimeout(() => {
      setLoading(false);
      handleClose();
      setOpen(false);
    }, 3000);
  };

  const handleUploadException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "100%", maxHeight: "100%" } }}
      maxWidth="lg"
      open={open}
    >
      <DialogTitle
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        Upload Part No
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                id="filled-basic"
                label="Shipment Date"
                variant="filled"
                sx={{ mb: 1 }}
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Grid>

            {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                fullWidth
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (reader.readyState === 2) {
                        setFile(reader.result);
                      }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid> */}
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                fullWidth
                type="file"
                InputProps={{
                  inputProps: {
                    accept: ".xls,.xlsx",
                  },
                }}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (reader.readyState === 2) {
                        setFile(reader.result); // ✅ SAME AS BEFORE
                      }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={3}
              lg={3}
              xl={3}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Button
                variant="contained"
                style={{
                  width: "250px",
                  background: "#002D68",
                  color: "white",
                }}
                disabled={uploadLoader === true}
                type="submit"
              >
                {uploadLoader ? (
                  <CircularProgress size={24} style={{ color: "white" }} />
                ) : (
                  "Upload Shipment Plan"
                )}
              </Button>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={3}
              lg={3}
              xl={3}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Button
                variant="contained"
                style={{
                  width: "200px",
                  background: "#002D68",
                  color: "white",
                  marginRight: "10px",
                }}
                onClick={() => {
                  DispatchExlPartTemp(
                    handleDownloadSuccess,
                    handleDownloadException
                  );
                }}
              >
                Download Template
              </Button>
            </Grid>

            <Grid item xs={12}>
              <DataGrid
                rows={uploadOpenPo}
                columns={columns}
                pageSize={8}
                rowsPerPageOptions={[8]}
                disableSelectionOnClick
                style={{ border: "none" }}
                sx={{
                  overflow: "auto",
                  height: "335px",
                  width: "100%",
                  "& .error-row": {
                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                    color: "red",
                  },
                  "& .super-app-theme--header": {
                    WebkitTextStrokeWidth: "0.6px",
                    backgroundColor: "#93bce6",
                    color: "#1c1919",
                  },
                  "& .MuiDataGrid-cell": {
                    border: "1px solid #969696",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    border: "1px solid #969696",
                  },
                }}
                getRowClassName={(params) => {
                  if (params.row.errorRemark) {
                    return "error-row";
                  }
                  const rowIndex = uploadOpenPo.findIndex(
                    (row) => row.id === params.row.id
                  );
                  return rowIndex % 2 === 0 ? "Mui-evenRow" : "Mui-oddRow";
                }}
                rowHeight={40}
                columnHeaderHeight={40}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            style={{ backgroundColor: "#002d68" }}
            onClick={handleErrorRemovness}
          >
            Remove Errorneous
          </Button>

          {/* ✅ Upload File Button - disabled when there are errors */}
          <Tooltip
            title={hasErrors ? "Remove error rows before uploading." : ""}
          >
            <span>
              <Button
                variant="contained"
                onClick={handleUploadXlData}
                disabled={loading || hasErrors}
                sx={{
                  marginRight: "10px",
                  backgroundColor: hasErrors || loading ? "#9e9e9e" : "#002d68",
                  color: "white",
                  "&:hover": {
                    backgroundColor:
                      hasErrors || loading ? "#9e9e9e" : "#001f4d",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} style={{ color: "white" }} />
                ) : (
                  "Upload File"
                )}
              </Button>
            </span>
          </Tooltip>

          <Button
            variant="contained"
            style={{ width: "150px", background: "#002D68", color: "white" }}
            onClick={() => {
              setOpen(false);
              setUploadOpenPo([]);
              setDate("");
              setExcelList("");
            }}
          >
            Cancel
          </Button>
        </DialogActions>

        <NotificationBar
          handleClose={handleClose}
          notificationContent={openNotification.message}
          openNotification={openNotification.status}
          type={openNotification.type}
        />
      </form>
    </Dialog>
  );
};

export default PartUploadModule;
