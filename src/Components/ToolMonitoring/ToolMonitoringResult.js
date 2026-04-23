import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import {
  PartNoVsProcessEntry,
  SobShowData,
  ToolMonitoringDelete,
  ToolMonitoringSearched,
  ToolsShowdata,
} from "../../ApiService/LoginPageService";
import ToolMonitoringTitle from "./ToolMonitoringTitle";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
const ToolMonitoringResult = () => {
  const [open, setOpen] = useState(false);
  const [isAddButton, setIsAddButton] = useState(true);
  const [editData, setEditData] = useState([]);
  const [isLoading, setGridLoading] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  // const [sobDataList, setSobDataList] = useState([]);
  const [generatedCustDcLists, setGeneratedCustDcLists] = useState([]);
  const [showData, setShowData] = useState([]);
  const [selectedToolNo, setSelectedToolNo] = useState("");

  //NEW STATE VARIBALES
  const [selectedMaster, setSelectedMaster] = useState("pm");
  //

  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const columns = [
    {
      field: "slno",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>S.No</span>
      ),
      type: "string",
      sortable: true,
      // minWidth: 50,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //     field: 'toolNo',
    //     headerClassName: 'super-app-theme--header',
    //     headerName:
    //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //             Tool Id
    //         </span>,
    //     type: 'string',
    //     sortable: true,
    //     minWidth: 100,
    //     flex: 1,
    //     align: 'center',
    //     headerAlign: 'center'
    // },

    {
      field: "toolNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Tool No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolName",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Tool Name </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "uomName",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>UOM</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "grindingAlert",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Grinding Alert
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
      field: "toolReplacementCount",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Replacement Count
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
      field: "grindingCount",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Grinding Count
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
      field: "toolUsageCount",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Tool Usage Count
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

  ];

  useEffect(() => {
    // SobShowData(handleSobShowDataSuccess, handleSobShowDataException);
    if (!selectedToolNo) {
      ToolsShowdata(handleShowSuccess, handleShowExcption);
    }
  }, [refreshData, selectedToolNo]);

  const handleShowSuccess = (dataObject) => {
    setGridLoading(false);
    setShowData(dataObject.data || []);
  };

  const handleShowExcption = () => { };

  // const handleSobShowDataSuccess = (dataObject) => {
  //     setGridLoading(false);
  //     setSobDataList(dataObject?.data || []);

  // }

  const handleSobShowDataException = (errorObject, errorMessage) => { };

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

  // const options = sobDataList.map(item => ({
  //     id: item?.id,
  //     label: item?.contractNo
  // }));

  function handleAutocompleteChange(selectedValue) {
    // Your logic here with the selected value
    console.log("Selected Value:", selectedValue);
  }
  const handlePOChange = (e) => {
    PartNoVsProcessEntry(
      { code: e.target.value },
      handleGeneratedPoSucessShow,
      handleGeneratedPoExceptionShow
    );
  };
  const handleGeneratedPoSucessShow = (dataObject) => {
    setGeneratedCustDcLists(dataObject?.data || []);
  };
  const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => { };
  const handleGeneratedPoSelect = (selectedValue) => {
    console.log("q1w2selectedValue", selectedValue);
    setSelectedToolNo(selectedValue);
    if (selectedValue !== null) {
      // GstViewing({ id: selectedValue.id }, handleActionSuccess, handleActionException);
      ToolMonitoringSearched(
        { id: selectedValue.id },
        handleActionSuccess,
        handleActionException
      );
    }
  };
  const handleActionSuccess = (dataObject) => {
    setShowData(dataObject?.data || []);
  };
  const handleActionException = () => { };
  const downloadExcelFile = async (workbook, filename) => {
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
  };
  const arrayToWorksheet = (array) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PO Report');
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
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    // Center align all data rows
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });
    return workbook;
  };
  const handleDownload = () => {
    // Flatten data to match the frontend table structure
    const reportData = showData.map((item, index) => ({
      "S.No": item?.slno,
      "Tool No": item?.toolNo,
      "Max Tool Life": item?.maxToolLife,
      "UOM": item?.uomName,
      "Tool Usage Count": item?.toolUsageCount,
      "Grinding Alert": item?.grindingAlert,
      "Replacement Count": item?.toolReplacementCount,
      // "No of Grinding": item?.noOfGrinding,

    }));
    const workbook = arrayToWorksheet(reportData);
    downloadExcelFile(workbook, 'Tool Monitoring .xlsx');
  };
  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <ToolMonitoringTitle
        setIsAddButton={setIsAddButton}
        setEditData={setEditData}
        setOpen={setOpen}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "-10px",
        }}
      >
        <Grid container spacing={2} style={{ width: "99%" }}>
          <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={generatedCustDcLists}
              fullWidth
              sx={{ width: 300 }}
              value={selectedToolNo}
              getOptionLabel={(option) =>
                option.toolNo || /*selectedGeneratedPo*/ ""
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search ToolNo"
                  onChange={handlePOChange}
                />
              )}
              onChange={(event, value) => handleGeneratedPoSelect(value)}
              size="small"
              style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
            <Button
              style={{ background: '#002D68', color: '#fff', }}
              variant="contained"
              // disabled={rows.length === 0}
              onClick={handleDownload}
            >
              Export to Excel
            </Button>
          </Grid>


          <Grid item xs={12} sm={12}>
            <Card
              style={{
                borderRadius: "8px",
                height: "100%",
                marginTop: "-5px",
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
                <DataGrid
                  rows={showData}
                  columns={columns}
                  pageSize={8}
                  loading={isLoading}
                  rowsPerPageOptions={[8]}
                  disableSelectionOnClick
                  style={{ border: "none", fontWeight: "bold" }}
                  sx={{
                    overflow: "auto",
                    height: "60vh",
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
                    const rowIndex = showData.findIndex(
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

      {/* <ProcessVsToolModule
                isAddButton={isAddButton}
                editData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
            /> */}

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
        deleteService={ToolMonitoringDelete}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />
    </div>
  );
};

export default ToolMonitoringResult;
