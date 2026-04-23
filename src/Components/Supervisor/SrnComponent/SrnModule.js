import {
  Autocomplete,
  Button,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";
import SrnSubModule from "./SrnSubModule";
import { GetMachineList, JobCardOnSubmit } from "../../../ApiService/LoginPageService";

const SrnModule = ({ open, setOpen }) => {
  const [srnSubModuleOpen, setSrnSubModuleOpen] = useState(false);
  const [jonCardView, setJobCardView] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [machineName, setMachineName] = useState("");
  const [machineList, setMachineList] = useState([]);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [submitloading, setsubmitLoading] = useState(false);

  const columns2 = [
    {
      field: "sNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>S.No</span>
      ),
      type: "string",
      sortable: true,
      maxWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "jcNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Job Card No
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
      field: "created_at",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Created At</span>
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
      field: "itemCode",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Item Code</span>
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
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "producedQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Produced Qty
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
      field: "selected",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}></span>
      ),
      type: "number",
      sortable: true,
      width: 120,
      align: "center",
      headerAlign: "center",
      renderHeader: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
          <span
            style={{ marginLeft: "5px", fontWeight: "bold", fontSize: "16px" }}
          ></span>
        </div>
      ),
      renderCell: (params) => (
        <Checkbox
          checked={params.row.selected}
          onChange={(e) => handleCheckboxChange(e, params.row.id)}
        />
      ),
    },
  ];

  const handleCheckboxChange = (event, id) => {
    const updatedRows = jonCardView.map((row) =>
      row.id === id ? { ...row, selected: event.target.checked } : row
    );
    setJobCardView(updatedRows);
  };

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);
    const isChecked = event.target.checked;
    const updatedRows = jonCardView.map((row) => {
      return { ...row, selected: isChecked };
    });
    setJobCardView(updatedRows);
  };

  const handleJobCardSubmitSuccess = (dataObject) => {
    setsubmitLoading(false);
    const updatedData = (dataObject?.data || []).map((item, index) => ({
      ...item,
      sNo: index + 1,
      selected: false,
    }));
    setJobCardView(updatedData);
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });

    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const handleJobCardSubmitException = () => {
    setsubmitLoading(false);
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handleRequestMaterial = () => {
    const transformedData = jonCardView
      .filter((item) => item.selected) // Filter items where selected is true
      .map(({ id, itemCode, itemId, jcNo }) => ({
        jcId: id,
        itemCode: itemCode,
        itemId: itemId,
        jcNo: jcNo,
      }));
    setSelectedRowData(transformedData);
  };


  useEffect(() => {
    GetMachineList(handleMachineListSuccess, handleMachineListException);
  }, [])

  const handleMachineListSuccess = (dataObject) => {
    setMachineList(dataObject?.data || []);
  }

  const handleMachineListException = () => { }

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "100%", maxHeight: "100%" } }}
      maxWidth="xl"
      open={open}
    >
      <DialogTitle style={{ background: "#002D68", color: "white" }}>
        SRN
      </DialogTitle>
      <DialogContent>
        <form className="mt-2 space-y-6" /*onSubmit={handleSubmit}*/>
          <Card
            style={{
              boxShadow: "0 10px 10px 10px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              width: "100%",
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item md={2}>
                  <TextField
                    fullWidth
                    label="From Date"
                    placeholder="From Date"
                    variant="filled"
                    size="small"
                    // required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value || "")}
                  />
                </Grid>

                <Grid item md={2}>
                  <TextField
                    fullWidth
                    label="To Date"
                    placeholder="To Date"
                    variant="filled"
                    size="small"
                    // required
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value || "")}
                  />
                </Grid>
                <Grid item md={2}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Select Machine Name
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Select Machine Name"
                      placeholder="Select Machine Name"
                      variant="filled"
                      size="small"
                      value={machineName}
                      onChange={(e) => setMachineName(e.target.value)}
                      required
                    >
                      {
                        machineList.map((data) => (
                          <MenuItem key={data.id} value={data.id}>{data.machineName}</MenuItem>
                        ))
                      }

                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  md={1}
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
                    disabled={submitloading}
                    onClick={() => {
                      setsubmitLoading(true);
                      JobCardOnSubmit(
                        {
                          fromDate: fromDate,
                          toDate: toDate,
                          itemCode: "",
                          machineId: machineName
                        },
                        handleJobCardSubmitSuccess,
                        handleJobCardSubmitException
                      );
                    }}
                  >
                    {submitloading ? (
                      <CircularProgress size={24} style={{ color: 'white' }} />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Grid>

                <Grid item md={12}>
                  <DataGrid
                    rows={jonCardView}
                    columns={columns2}
                    pageSize={8}
                    // loading={isLoading}
                    rowsPerPageOptions={[8]}
                    disableSelectionOnClick
                    // style={{ border: 'none', fontWeight: 'bold' }}
                    style={{
                      border: "none",
                      fontWeight: "bold",
                      // minWidth: '50%',
                      height: "65vh",
                      fontFamily: "Arial", // Set the font family to Arial
                    }}
                    sx={{
                      "& .super-app-theme--header": {
                        WebkitTextStrokeWidth: "0.6px",
                      },
                      "& .MuiDataGrid-cell": {
                        border: "1px solid #969696",
                      },
                      "& .MuiDataGrid-columnHeader": {
                        border: "1px solid #969696", // Add border to column headers
                      },
                      "& .super-app-theme--header": {
                        backgroundColor: "#93bce6",
                        color: "#1c1919",
                      },
                    }}
                    getRowClassName={(params) => {
                      // Find the index of the row within the rows array
                      const rowIndex = jonCardView.findIndex(
                        (row) => row.id === params.row.id
                      );
                      // Check if the index is valid
                      if (rowIndex !== -1) {
                        console.log(" ");
                        return rowIndex % 2 === 0
                          ? "Mui-evenRow"
                          : "Mui-oddRow";
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

          <DialogActions>
            <Button
              variant="contained"
              style={{ width: "190px", background: "#002D68", color: "white" }}
              // type="submit"
              onClick={() => {
                setSrnSubModuleOpen(true);
                handleRequestMaterial();
              }}
            >
              Request Material
            </Button>
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              onClick={(e) => {
                setOpen(false);
                // ClearData();
              }}
            >
              Close
            </Button>
          </DialogActions>
        </form>
      </DialogContent>

      <NotificationBar
        // handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />

      <SrnSubModule
        open={srnSubModuleOpen}
        setOpen={setSrnSubModuleOpen}
        selectedRowData={selectedRowData}
      />
    </Dialog>
  );
};

export default SrnModule;
