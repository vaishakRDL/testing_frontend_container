import { Card, CardContent, Grid, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  POEntryDelete,
  POEntryShowData,
} from "../../../ApiService/LoginPageService";
import DeleteConfirmationDailog from "../../../Utility/confirmDeletion";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEffect } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import { ExportPoEntry } from "../../../ApiService/DownloadCsvReportsService";

const NewPurchaseOderEntryView = () => {
  const [rows, setRows] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const navigate = useNavigate();
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const columns = [
    {
      field: "poNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>PO No</span>
      ),
      width: 70,
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "poDate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>PO Date</span>
      ),
      width: 70,
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cCode",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Customer</span>
      ),
      width: 70,
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerClassName: "super-app-theme--header",
      type: "actions",
      flex: 1,
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
      ),
      cellClassName: "actions",
      disableClickEventBubbling: true,
      getActions: (params) => [
        <ViewData selectedRow={params.row.id} />,
        <EditData selectedRow={params.row.id} />,
        <DownloadData selectedRow={params.row} />,
        <DeleteData selectedRow={params.row} />,
      ],
    },
  ];

  function ViewData(props) {
    return (
      <Tooltip disableFocusListener title="View">
        <VisibilityIcon
          style={{ color: "#002D68", cursor: "pointer" }}
          onClick={() => {
            navigate(
              `/NewPurchaseOrderEntry?isPOView=true&&poRowId=${props.selectedRow}`
            );
          }}
        />
      </Tooltip>
    );
  }

  function EditData(props) {
    return (
      <Tooltip disableFocusListener title="Edit">
        <EditIcon
          style={{ color: "#002D68", cursor: "pointer" }}
          onClick={() => {
            navigate(
              `/NewPurchaseOrderEntry?isEdit=true&&poRowId=${props.selectedRow}`
            );
          }}
        />
      </Tooltip>
    );
  }

  function DownloadData(props) {
    return (
      <Tooltip title="Export">
        <DownloadIcon
          style={{ color: "#002D68", cursor: "pointer" }}
          onClick={() => {
            ExportPoEntry(
              { id: props?.selectedRow?.id },
              ExportPoEntrySuccess,
              ExportPoEntryException
            );
          }}
        />
      </Tooltip>
    );
  }

  const ExportPoEntrySuccess = () => {};

  const ExportPoEntryException = () => {};

  function DeleteData(props) {
    return (
      <Tooltip title="Delete">
        <DeleteIcon
          style={{ color: "#002D68", cursor: "pointer" }}
          onClick={() => {
            setDeleteId(props.selectedRow.id);
            setDeleteDailogOpen(true);
          }}
        />
      </Tooltip>
    );
  }

  useEffect(() => {
    POEntryShowData(handlePOEntryShow, handePOEntryException);
  }, [refreshData]);

  const handlePOEntryShow = (dataObject) => {
    setRows(dataObject?.data || []);
  };

  function DeleteData(props) {
    return (
      <Tooltip title="Delete">
        <DeleteIcon
          style={{ color: "#002D68", cursor: "pointer" }}
          onClick={() => {
            setDeleteId(props.selectedRow.id);
            setDeleteDailogOpen(true);
          }}
        />
      </Tooltip>
    );
  }

  useEffect(() => {
    POEntryShowData(handlePOEntryShow, handePOEntryException);
  }, [refreshData]);

  const handePOEntryException = (errorStatus, errorMessage) => {};

  const handleDeleteSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      setDeleteDailogOpen(false);
    }, 2000);
    setRefreshData((oldValue) => !oldValue);
  };

  const handleDeleteException = (errorObject, message) => {
    setNotification({
      status: true,
      type: "error",
      message: message,
    });
  };

  return (
    <div>
      <div
        style={{
          height: "100%",
          padding: 16,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "row", cursor: "pointer" }}
          >
            <Link
              to="/NewPurchaseOrderEntry"
              style={{ textDecoration: "none" }}
            >
              <Typography
                sx={{ m: 1, fontFamily: "Roboto Slab", fontWeight: "bold" }}
                variant="h5"
              >
                {`PO - Sales Order Entry>>`}
              </Typography>
            </Link>
            <Typography
              sx={{ m: 1, fontFamily: "Roboto Slab", fontWeight: "bold" }}
              variant="h5"
            >
              PO - Sales Order View
            </Typography>
          </div>
        </div>
        <Grid container spacing={2} style={{ flex: 1 }}>
          <Grid item xs={12}>
            <Card
              style={{
                boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                marginTop: "20px",
                borderRadius: "10px",
                width: "100%",
                height: "500px",
              }}
            >
              <CardContent
                style={{
                  padding: 16,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography
                  variant="h9"
                  style={{ fontWeight: "bold" }}
                ></Typography>
                <div style={{ height: 600, width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={8}
                    rowsPerPageOptions={[8]}
                    disableSelectionOnClick
                    style={{ border: "none" }}
                    sx={{
                      overflow: "auto",
                      height: "60vh",
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
                      const rowIndex = rows.findIndex(
                        (row) => row.id === params.row.id
                      );
                      if (rowIndex !== -1) {
                        return rowIndex % 2 === 0
                          ? "Mui-evenRow"
                          : "Mui-oddRow";
                      }
                      return ""; 
                    }}
                    rowHeight={40}
                    columnHeaderHeight={40}
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

      <DeleteConfirmationDailog
        open={deleteDailogOpen}
        setOpen={setDeleteDailogOpen}
        deleteId={deleteId}
        deleteService={POEntryDelete}
        handleSuccess={handleDeleteSuccess}
        handleException={handleDeleteException}
      />
    </div>
  );
};

export default NewPurchaseOderEntryView;
