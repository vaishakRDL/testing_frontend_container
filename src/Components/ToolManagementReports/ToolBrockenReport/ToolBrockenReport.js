import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
  BrokenToolReport,
  ProcessToolMachineList,
} from "../../../ApiService/LoginPageService";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
const ToolBrockenReport = () => {
  const [selectedMachine, setSelectedMachine] = useState("");
  const [machineList, setMachineList] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [toolNoList, setToolNoList] = useState([]);

  useEffect(() => {
    ProcessToolMachineList(
      handlePlanningMachineSuccess,
      handlePlanningMachineFailed
    );
  }, []);
  const handlePlanningMachineSuccess = (dataObject) => {
    setMachineList(dataObject?.data || []);
  };

  const handlePlanningMachineFailed = (errorObject, errorMessage) => {};

  const columns = [
    {
      field: "sno",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>SI No</span>
      ),
      type: "string",
      sortable: true,
      // minWidth: 50,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Date",
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
      field: "toolName",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Tool Name</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "toolNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Tool Number
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
      field: "machineCode",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Machine Code
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
      field: "compType",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Component Type
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
      field: "operator",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Operator </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "remarks",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Remarks</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const handleSubmit = () => {
    BrokenToolReport(
      {
        fromDate: fromDate,
        toDate: toDate,
        machineId: selectedMachine,
      },
      TollReportSuccess,
      ToolReportException
    );
  };

  const TollReportSuccess = (dataObject) => {
    setToolNoList(dataObject?.data || []);
  };
  const ToolReportException = () => {};
const downloadExcelFile = async (workbook, filename) => {
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), filename);
    };
    const arrayToWorksheet = (array) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tool Broken Report');
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
        const reportData = toolNoList.map((item, index) => ({
            "SI No": item?.sno,
            "Date": item?.Date,
            "Tool Name": item?.toolName,
            "Tool Number": item?.toolNo,
            "Machine Code": item?.machineCode,
            "Component Type": item?.compType,
            "Operator": item?.operator,
            "Remarks": item?.remarks,
        
        }));
        const workbook = arrayToWorksheet(reportData);
        downloadExcelFile(workbook, 'Tool Broken Report .xlsx');
    };

  return (
    <div>
      <Grid container spacing={2} style={{ display: "flex" }}>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <TextField
            id="filled-basic"
            label="From Date"
            variant="filled"
            type="date"
            size="small"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <TextField
            id="filled-basic"
            label="To Date"
            variant="filled"
            type="date"
            size="small"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            placeholder="From Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <FormControl fullWidth>
            <InputLabel id="machine-select-label">Machine</InputLabel>
            <Select
              labelId="machine-select-label"
              id="machine-select"
              variant="filled"
              size="small"
              value={selectedMachine}
              onChange={(e) => {
                setSelectedMachine(e.target.value);
                // setReportList([]);
              }}
            >
              {machineList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.machineName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={1.5}>
          <Button
            variant="contained"
            style={{
              width: "100%",
              background: "#002D68",
              color: "white",
              height: "40px",
              width: "150px",
            }}
            onClick={handleSubmit}
          >
            View
          </Button>
        </Grid>
         <Grid item xs={12} sm={12} md={3} lg={3} xl={1.5}>
          <Button
                                          style={{ background: '#002D68', color: '#fff', }}
                                          variant="contained"
                                          // disabled={rows.length === 0}
                                          onClick={handleDownload}
                                      >
                                          Export to Excel
                                      </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          {/* <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '0px', borderRadius: '10px', width: '100%', height: '100%' }}>
                        <CardContent>
                            <Grid item xs={12} sm={12}  > */}
          <Card
            style={{
              borderRadius: "8px",
              height: "100%",
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
              <DataGrid
                rows={toolNoList}
                columns={columns}
                pageSize={8}
                // loading={isLoading}
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
                  const rowIndex = [].findIndex(
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

        {/* </CardContent>
                    </Card>
                </Grid> */}
      </Grid>
    </div>
  );
};

export default ToolBrockenReport;
