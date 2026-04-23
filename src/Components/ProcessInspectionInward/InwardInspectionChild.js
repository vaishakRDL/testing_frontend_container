import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { DataGrid } from "@mui/x-data-grid";
import {
  AddItemVsProcess,
  ProcessInspecSearchMachine,
  ProcessInspecChildPart,
} from "../../ApiService/LoginPageService";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProcessInspectImage from "./InwardInspectionImage";
import { NpdDocDownload } from "../../ApiService/DownloadCsvReportsService";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const InwardInspectionChild = ({
  setSelectedRowItemCode,
  isProcessInsp,
  setIsProcessInsp,
  setSelectedOptionName,
  isSelectedData,
  setIsSelectedData,
  machineName,
  setMachineName,
  fromData,
  setFromDate,
  setToDate,
  toDate,
  setIsChild,
  setIsSelectedChildData,
  setFileTypeForView, pdfOpen, setPdfOpen, scrollToRow, selectedRowId, qtydata
}) => {
  const navigate = useNavigate();


  const [refreshData, setRefreshData] = useState(false);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [itemList, setItemList] = useState([]);
  const [processList, setProcessList] = useState([]);

  //////////////////////////////////////////
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [excelModal, setExcelModal] = useState(false);
  const [copyFromModal, setCopyFromModal] = useState(false);
  const [selectedValue, setSelectedValue] = React.useState("JOBCARD");
  const [jobcardno, setJobcardNo] = useState("");
  const [rowsData, setRowsData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openOption, setOpenOption] = useState(false);
  const [machineIdList, setMachineIdList] = useState([]);
  const [openImg, setOpenImg] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleClickOption = (event, params) => {
    setAnchorEl(event.currentTarget);
    // setIsSelectedData(params.row);
    setIsSelectedChildData(params.row);
    setOpenOption(true);
    setSelectedItemId(params.itemId);
  };

  const handleCloseOption = () => {
    setAnchorEl(null);
    setOpenOption(false);
  };

  const columns2 = [
    {
      field: "jcNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Jobcard No{" "}
        </span>
      ),
      type: "string",
      sortable: true,
      maxWidth: 200,
      // width:50,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "itemCode",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Item Code </span>
      ),
      type: "string",
      sortable: true,
      maxWidth: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Qty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Qty </span>
      ),
      type: "string",
      sortable: true,
      maxWidth: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "qltInspecType",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Inspection Type{" "}
        </span>
      ),
      type: "string",
      sortable: true,
      maxWidth: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "completed",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Completed </span>
      ),
      type: "string",
      sortable: true,
      maxWidth: 250,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "reject",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Rejected</span>
      ),
      type: "string",
      sortable: true,
      maxWidth: 250,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "rework",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Rework</span>
      ),
      type: "string",
      sortable: true,
      maxWidth: 250,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "scrap",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Scrap</span>
      ),
      type: "string",
      sortable: true,
      maxWidth: 200,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      type: "actions",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
      ),
      maxWidth: 300,
      flex: 1,
      renderCell: (params) => [
        <div>
          {rowsData?.qltInspecType !== "Complete" ? (
            <>
              <Button
                id="demo-positioned-button"
                aria-controls={openOption ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openOption ? "true" : undefined}
                onClick={(event) => handleClickOption(event, params)}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    minWidth: "250px",
                  }}
                >
                  Options
                </span>
              </Button>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={openOption}
                onClose={handleCloseOption}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    minWidth: "250px",
                  }}
                  onClick={() => {
                    setIsProcessInsp(1);
                    setOpenOption(false);
                    setSelectedOptionName("FPI");
                  }}
                >
                  FPI
                </MenuItem>
                <MenuItem
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    minWidth: "250px",
                  }}
                  onClick={() => {
                    setIsProcessInsp(2);
                    setOpenOption(false);
                    setSelectedOptionName("Observation");
                  }}
                >
                  Observation
                </MenuItem>
                <MenuItem
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    minWidth: "250px",
                  }}
                  onClick={() => {
                    setIsProcessInsp(3);
                    setOpenOption(false);
                    setSelectedOptionName("LPI");
                  }}
                >
                  LPI
                </MenuItem>
                <MenuItem
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    minWidth: "250px",
                  }}
                  onClick={() => {
                    setIsProcessInsp(4);
                    setOpenOption(false);
                    setSelectedOptionName("Rework");
                  }}
                >
                  Rework
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <VisibilityIcon
                onClick={() => {
                  setIsProcessInsp(1);
                  setIsSelectedData(params.row);
                }}
              />
            </>
          )}
        </div>,
      ],
    },
    {
      field: "actions3",
      type: "actions",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Images</span>
      ),
      maxWidth: 100,
      flex: 1,
      renderCell: (params) => [
        <div>
          {/* <VisibilityIcon
            onClick={() => {
              setOpenImg(true);
              setIsSelectedData(params.row);
            }}
          /> */}
          <VisibilityIcon
            onClick={() => {
              // const fileName = params.row.npdFile;
              // const fileExtension = fileName.split(".").pop().toLowerCase();
              // console.log("fileExtension===>", fileExtension);
              // if (fileExtension === "xlsx" || fileExtension === "tif") {
              //   NpdDocDownload(
              //     {
              //       id: params.row.itemId,
              //       fileExtension: fileExtension !== "xlsx" ? "tif" : "xlsx",
              //     },
              //     DownloadSuccess,
              //     DownloadException
              //   );
              // } else {
              setPdfOpen(true);
              setFileTypeForView(params.row.npdFile);
              setSelectedRowItemCode(params.row.itemCode)
              // }
            }}
            style={{ color: "#002D68" }}
          />
        </div>,
      ],
    },
  ];

  const DownloadSuccess = () => { };

  const DownloadException = () => { };

  useEffect(() => {
    setIsChild(1);
    ProcessInspecChildPart(
      {
        jCId: isSelectedData?.jCId,
        machineName: machineName,
        from: fromData,
        to: toDate,
        itemId: isSelectedData?.itemId,
        jcQty: isSelectedData?.Qty,
        jcNo: isSelectedData?.jcNo,
      },
      handleProcessInspecChildPartSuccess,
      handleProcessInspecChildPartException
    );
  }, [refreshData]);

  const handleProcessInspecChildPartSuccess = (dataObject) => {
    setRowsData(dataObject?.data || []);
  };

  const handleProcessInspecChildPartException = () => { };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  return (
    <div style={{ height: "80vh", width: "100%", padding: "20px" }}>
      <Typography
        sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
        variant="h5"
      >
        Process Inspection Child
      </Typography>
      <Card
        style={{
          boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
          width: "100%",
          height: "100%",
        }}
      >
        <CardContent>
          <DataGrid
            rows={rowsData}
            columns={columns2}
            pageSize={8}
            rowsPerPageOptions={[8]}
            disableSelectionOnClick
            style={{
              border: "none",
              fontWeight: "bold",
              height: "60vh",
              fontFamily: "Arial",
            }}
            sx={{
              "& .super-app-theme--header": {
                WebkitTextStrokeWidth: "0.6px",
              },
              "& .MuiDataGrid-cell": {
                border: "1px solid #969696",
              },
              "& .MuiDataGrid-columnHeader": {
                border: "1px solid #969696",
              },
              "& .super-app-theme--header": {
                backgroundColor: "#93bce6",
                color: "#1c1919",
              },
            }}
            getRowClassName={(params) => {
              const rowIndex = rowsData.findIndex(
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
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            style={{
              width: "150px",
              height: "40px",
              background: "#002D68",
              color: "white",
              marginRight: "20px",
            }}
            onClick={() => {
              setIsProcessInsp(0)
              setIsChild(0)
              scrollToRow(selectedRowId)
            }}
          >
            Back
          </Button>
        </Grid>
      </Card>
      <ProcessInspectImage
        openImg={openImg}
        setOpenImg={setOpenImg}
        isSelectedData={isSelectedData}
      />
      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
};

export default InwardInspectionChild;
