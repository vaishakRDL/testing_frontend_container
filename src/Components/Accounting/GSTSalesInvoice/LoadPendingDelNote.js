import {
  Button,
  Card,
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  GetPendingDelNoteData,
  GSTLoadPendingPO,
  SearchDelNote,
} from "../../../ApiService/LoginPageService";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

const LoadPendingDelNote = ({
  loadPendingModalOpen,
  setLoadPendingModalOpen,
  setPendingPOList,
  customerId, setVechicleNo
}) => {
  const getTodayDate = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split("T")[0];
  };

  const [refreshData, setRefreshData] = useState(false);
  const [rows, setRows] = useState("");
  const [custAllAddressList, setCustAllAddressList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemsSelectedSo, setItemsSelectedSo] = useState([]);
  const [formDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());

  const [delNoteLists, setDelNoteLists] = useState([]);
  const [selectedDelNote, setSelectedDelNote] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [location, setLocation] = useState(0);

  const handleClose = () => {
    setLoadPendingModalOpen(false);
    clearPageData();
  };

  const columns1 = [
    {
      field: "cCode",
      headerName: "Customer Code",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cName",
      headerName: "Customer Name",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "sino",
      headerName: "SO No",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "poNo",
      headerName: "Po No",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "date",
      headerName: "SO Date",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "itemCode",
      headerName: "Item Code",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "itemName",
      headerName: "Item Name",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "itemGroupCode",
      headerName: "Item Group Code",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "uom",
      headerName: "UOM Code",
      type: "string",
      sortable: true,
      minWidth: 80,
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
    const updatedRows = tableData.map((row) =>
      row.id === id ? { ...row, selected: event.target.checked } : row
    );
    setTableData(updatedRows);
  };

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);
    const isChecked = event.target.checked;
    const updatedRows = tableData.map((row) => {
      return { ...row, selected: isChecked };
    });
    setTableData(updatedRows);
  };

  const rows1 = selectedRows;

  function DeleteData(props) {
    return (
      <DeleteIcon
        onClick={() => {
          handleDeleteRow(props.selectedRow.id);
        }}
        style={{ color: "black" }}
      />
    );
  }

  const handleDeleteRow = (id) => {
    const newArray = selectedItems.filter((item) => item.id != id);
    setSelectedRows(newArray);
  };

  // useEffect(() => {
  //   // loadPendingModalOpen && GSTLoadPendingPO({ id: customerId }, handleLoadPendingPOShow, handeLoadPendingPOException);
  //   loadPendingModalOpen &&
  //     SearchDelNote(
  //       { id: customerId, form: formDate, to: toDate },
  //       handleLoadPendingDelNote,
  //       handeLoadPendingDelNoteException
  //     );
  // }, [loadPendingModalOpen, customerId]);
  useEffect(() => {
    if (loadPendingModalOpen) {
      const today = getTodayDate();

      setFromDate(today);
      setToDate(today);

      SearchDelNote(
        { id: customerId, form: today, to: today },
        handleLoadPendingDelNote,
        handeLoadPendingDelNoteException
      );
    }
  }, [loadPendingModalOpen, customerId]);


  const handleLoadPendingDelNote = (dataObject) => {
    setDelNoteLists(dataObject?.data || []);
  };

  const handeLoadPendingDelNoteException = (errorObject, errorMessage) => { };

  const handleRowSelection = (selection) => {
    // Check if the selection.row's id is already in selectedRows
    const isAlreadySelected = selectedRows.some(
      (row) => row.id === selection.row.id
    );
    // If not already selected, add it to selectedRows
    if (!isAlreadySelected) {
      setSelectedRows([...selectedRows, selection.row]);
    }
  };

  const handleOkClick = () => {
    const updatedArray = tableData
      .filter((item) => item.selected === true) // Filter items where selected is true
      .map((data) => ({ ...data })); // Map to only include the id
    console.log("updatedArray", updatedArray);
    setPendingPOList(updatedArray);
    setLoadPendingModalOpen(false);
    clearPageData();
  };

  const handleGetDataSuccess = (dataObject) => {
    setTableData(dataObject?.data || []);
    setVechicleNo(dataObject?.data[0]?.vehicleNo || "");
  };
  const handleGetDataException = () => { };

  const clearPageData = () => {
    const today = getTodayDate();
    setTableData([]);
    setFromDate(today);
    setToDate(today);
    setSelectedDelNote([]);
  };


  const handlesubmit = () => {
    GetPendingDelNoteData(
      { cusId: customerId, delNo: selectedDelNote },
      handleGetDataSuccess,
      handleGetDataException
    );
  };
  return (
    <div>
      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "100%", maxHeight: "100%" } }}
        maxWidth="xl"
        open={loadPendingModalOpen}
      >
        <DialogTitle style={{ background: "#002D68", color: "white" }}>
          Select Pending Del Note
        </DialogTitle>
        <form className="mt-2 space-y-6">
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item sm={12} md={2} lg={2} xl={2}>
                <TextField
                  id="filled-basic"
                  label="From Date"
                  variant="filled"
                  fullWidth
                  type="date"
                  required
                  InputLabelProps={{ shrink: true }}
                  placeholder="From Date"
                  value={formDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    toDate &&
                      SearchDelNote(
                        { id: customerId, form: e.target.value, to: toDate },
                        handleLoadPendingDelNote,
                        handeLoadPendingDelNoteException
                      );
                    // selectedDelNote && GetPendingDelNoteData({ cusId: customerId, delNo: selectedDelNote }, handleGetDataSuccess, handleGetDataException)
                  }}
                />
              </Grid>

              <Grid item sm={12} md={2} lg={2} xl={2}>
                <TextField
                  id="filled-basic"
                  label="To Date"
                  variant="filled"
                  fullWidth
                  type="date"
                  required
                  InputLabelProps={{ shrink: true }}
                  placeholder="To Date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    formDate &&
                      SearchDelNote(
                        { id: customerId, form: formDate, to: e.target.value },
                        handleLoadPendingDelNote,
                        handeLoadPendingDelNoteException
                      );
                    // selectedDelNote && GetPendingDelNoteData({ cusId: customerId, delNo: selectedDelNote }, handleGetDataSuccess, handleGetDataException)
                  }}
                />
              </Grid>
              <Grid item sm={12} md={2} lg={2} xl={2}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Location
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={location === 0 ? "Customer_Location" : "Warehouse"}
                    variant="filled"
                    label="Del Note"
                    onChange={(e) => {
                      const selectedValue =
                        e.target.value === "Customer_Location" ? 0 : 1;
                      setLocation(selectedValue);
                      toDate &&
                        formDate &&
                        SearchDelNote(
                          {
                            id: customerId,
                            form: formDate,
                            to: toDate,
                            isWarehouse: selectedValue,
                          },
                          handleLoadPendingDelNote,
                          handeLoadPendingDelNoteException
                        );
                      // selectedDelNote && GetPendingDelNoteData({ cusId: customerId, delNo: selectedDelNote }, handleGetDataSuccess, handleGetDataException)
                    }}
                  >
                    <MenuItem value={"Customer_Location"}>
                      Customer Location
                    </MenuItem>
                    <MenuItem value={"Warehouse"}>Warehouse</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={12} md={2} lg={2} xl={2}>
                <FormControl fullWidth>
                  <InputLabel id="demo-multiple-select-label">
                    Del Note
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-select-label"
                    id="demo-multiple-select"
                    multiple
                    value={selectedDelNote} // Should be an array
                    variant="filled"
                    onChange={(e) => {
                      setSelectedDelNote(e.target.value); // e.target.value is an array
                    }}
                    renderValue={(selected) => selected.join(", ")} // Display selected values
                  >
                    {delNoteLists.map((data) => (
                      <MenuItem key={data.delNoteNo} value={data.delNoteNo}>
                        <Checkbox
                          checked={selectedDelNote.indexOf(data.delNoteNo) > -1}
                        />
                        {data.delNoteNo}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={12} md={2} lg={2} xl={2}>
                <Button
                  variant="contained"
                  style={{
                    height: "50px",
                    backgroundColor: "#002d68",
                    width: "100px",
                  }}
                  onClick={handlesubmit}
                >
                  View
                </Button>
              </Grid>

              <Grid item sm={12} md={12} lg={12} xl={12}>
                <Card
                  style={{
                    boxShadow: "0 10px 10px 10px rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                    width: "100%",
                  }}
                >
                  <CardContent>
                    <DataGrid
                      rows={tableData}
                      columns={columns1}
                      pageSize={8}
                      onRowClick={handleRowSelection}
                      rowsPerPageOptions={[8]}
                      style={{ border: "none" }}
                      sx={{
                        "& .MuiDataGrid-columnHeaders": {
                          WebkitTextStrokeWidth: "0.6px",
                          backgroundColor: "#93bce6",
                          color: "#1c1919",
                          cursor: "pointer",
                        },
                        "& .MuiDataGrid-cell": {
                          border: "1px solid #969696",
                          cursor: "pointer",
                        },
                        "& .MuiDataGrid-columnHeader": {
                          border: "1px solid #969696",
                          cursor: "pointer",
                        },
                        height: "40vh",
                      }}
                      rowHeight={40}
                      columnHeaderHeight={40}
                      getRowClassName={(params) => {
                        // Find the index of the row within the rows array
                        const rowIndex = rows1.findIndex(
                          (row) => row.id === params.row.id
                        );
                        // Check if the index is valid
                        if (rowIndex !== -1) {
                          console.log("Row index:", rowIndex);
                          return rowIndex % 2 === 0
                            ? "Mui-evenRow"
                            : "Mui-oddRow";
                        }
                        return ""; // Return default class if index is not found
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              onClick={handleOkClick}
            >
              OK
            </Button>
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default LoadPendingDelNote;
