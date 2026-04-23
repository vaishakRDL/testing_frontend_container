import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { Button, Card, CardContent, CircularProgress, Grid, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { ReportPlanning, ShowHoliday } from "../../ApiService/LoginPageService";
import PlanReportResultTitle from "./PlanReportResultTitle";

const PlanReportResult = () => {
  const [submitloading, setsubmitLoading] = useState(false);
  const [viewloading, setViewLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [fromDate, setFromData] = useState("");
  const [toDate, setTodate] = useState("");
  const [columDataList, setColumDataList] = useState([]);
  const [rowDataList, setRowDataList] = useState([]);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const today = new Date();
  const date = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");
  const TodaysDate = `${year}/${month}/${date}`;

  const columns = [
    {
      field: "contractNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Kanban</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "date",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Nova MR (GEN2 MOD MR)
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
      field: "occasion",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Nova MRL-Regular
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "description",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          GEN2 Life-1.75-MRL
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "Revision",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Nova MRL Regular-Ambiance
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "Nova",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Nova MRL (NOVAXN)
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "g",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Gen 3 Prime MRL-Regular
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "2",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Gen 2 Prime MRL-Regular
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "gen2",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Gen 2 Core</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "gen2Core",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Gen 2 Core MRL-AURA
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "NOVArEF",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Nova Refresh MRL-Regular
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "LIFR",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Gen 2 LI Core LIFR
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "LIFR",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Gen 2 LI Core LIFR
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "re",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Nova MRL Regular-Ambiance
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: " 1.75-MR",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          GEN2 life - 1.75-MR
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: " 1.75-MR",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          GEN2 life - 1.75-MR
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    // {
    //     field: 'actions',
    //     type: 'actions',
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

  useEffect(() => { }, [refreshData]);

  function EditData(props) {
    return <EditIcon style={{ color: "black" }} onClick={(event) => { }} />;
  }

  function DeleteData(props) {
    return <DeleteIcon onClick={() => { }} style={{ color: "black" }} />;
  }

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handleSucessShow = (dataObject) => { };
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

  function handleAutocompleteChange(selectedValue) {
    // Your logic here with the selected value
    console.log("Selected Value:", selectedValue);
  }

  const handleReportPlanningSuccuess = (dataObject) => {
    setsubmitLoading(false)
    setViewLoading(false)

    setRowDataList(dataObject?.data || []);
    setColumDataList(dataObject?.products || []);
  };

  const columns2 = columDataList.map((field, index) => ({
    field,
    headerClassName: "super-app-theme--header",
    headerName: (
      <span style={{ fontWeight: "bold", fontSize: "16px" }}>
        {" "}
        {field.charAt(0).toUpperCase() + field.slice(1)}
      </span>
    ),
    type: index === 1 ? "number" : "string",
    minWidth: 100,
    flex: 1,
    align: "center",
    headerAlign: "center",
  }));

  const handleReportPlanningException = () => {
    setsubmitLoading(false);
    setViewLoading(false)

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
      setFromData(value);
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
      setTodate(value);
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
    <div style={{ height: "80vh", width: "98%", marginLeft: "15px" }}>
      <PlanReportResultTitle />
      <Grid container spacing={2} style={{ marginTop: "-30px" }}>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <TextField
            id="filled-basic"
            label="From Date"
            variant="filled"
            type="date"
            size="small"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            onChange={handleFromDateChange}
            inputProps={{
              min: fyFrom,
              max: fyTo,
            }}
            placeholder="From Date"
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <TextField
            id="filled-basic"
            label="To Date"
            variant="filled"
            type="date"
            size="small"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            onChange={handleToDateChange}
            inputProps={{
              min: fyFrom,
              max: fyTo,
            }}
            placeholder="To Date"
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
            style={{ width: "150px", background: "#002D68", color: "white" }}
            disabled={submitloading}
            onClick={(e) => {
              setsubmitLoading(true)
              ReportPlanning(
                {
                  fromDate: TodaysDate,
                  toDate: TodaysDate,
                },
                handleReportPlanningSuccuess,
                handleReportPlanningException
              );
            }}
          >
            {submitloading ? (
              <CircularProgress size={24} style={{ color: 'white' }} />
            ) : (
              "Today"
            )}
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={2}
          lg={2}
          xl={2}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            style={{ width: "150px", background: "#002D68", color: "white" }}
            disabled={viewloading}

            onClick={(e) => {
              setViewLoading(true)
              ReportPlanning(
                {
                  fromDate: fromDate,
                  toDate: toDate,
                },
                handleReportPlanningSuccuess,
                handleReportPlanningException
              );
            }}
          >
            {viewloading ? (
              <CircularProgress size={24} style={{ color: 'white' }} />
            ) : (
              "View"
            )}
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                rows={rowDataList}
                columns={columns2}
                pageSize={8}
                rowsPerPageOptions={[8]}
                disableSelectionOnClick
                style={{ border: "none", fontWeight: "bold" }}
                sx={{
                  overflow: "auto",
                  height: "50vh",

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
                    border: "1px solid #969696",
                  },
                }}
                getRowClassName={(params) => {
                  const rowIndex = [].findIndex(
                    (row) => row.id === params.row.id
                  );

                  if (rowIndex !== -1) {
                    console.log(" ");
                    return rowIndex % 2 === 0 ? "Mui-evenRow" : "Mui-oddRow";
                  }
                  return "";
                }}
                rowHeight={40}
                columnHeaderHeight={40}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default PlanReportResult;
