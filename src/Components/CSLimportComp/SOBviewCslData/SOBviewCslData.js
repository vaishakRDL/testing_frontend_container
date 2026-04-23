import {
  Button,
  Dialog,
  DialogActions,
  CircularProgress,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import {
  OrderProcessOrder,
  SOBDataShow,
  SobConsolidateSob,
  SobExlProductMap,
  SobFetchShow,
  cslShowData,
} from "../../../ApiService/LoginPageService";
import MissingCsl from "../MissingCsl/MissingCsl";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";
import { DownloadSobExlTemplateProduct } from "../../../ApiService/DownloadCsvReportsService";
import ImpoertProduct from "./ImpoertProduct";
import "../../../App.css";

const SOBviewCslData = ({ openSOBview, setOpenSOBview, cslId, setCSLId }) => {
  const [sobDataList, setSobDataList] = useState([]);
  const [sobDataSetList, setSobDataSetList] = useState([]);
  const [openMissing, setOpenMissing] = useState("");
  const [isMissing, setIsMissing] = useState("");
  const [formDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [hasUnmappedProduct, sethasUnmappedProduct] = useState(true);
  const [isSobSet, setisSobSet] = useState(false);
  const [idId, setIsId] = useState("");
  const [processed, setProcessed] = useState("");
  const [refeshValue, setRefeshValue] = useState(false);
  const [refeshMissing, setRefeshMissing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);

  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const [productOpen, setProductOpen] = useState(false);

  useEffect(() => {
    if (openSOBview) {
      if (cslId) {
        SOBDataShow(
          {
            id: cslId,
          },
          handleSOBDataShowSuccess,
          handleSOBDataShowException
        );
      } else {
        SobFetchShow(
          {
            fromDate: formDate,
            toDate: toDate,
          },
          handleSobFetchShowSuccess,
          handleSobFetchShowException
        );
        setisSobSet(true);
      }
    }
  }, [cslId, openSOBview, refeshMissing]);

  useEffect(() => {
    if (openSOBview && idId) {
      SobConsolidateSob(
        {
          id: idId,
        },
        handleSOBDataShowSuccess,
        handleSOBDataShowException
      );
    }
  }, [refeshValue, openSOBview]);

  const handleSobFetchShowSuccess = (dataObject) => {
    setSobDataSetList(dataObject?.data || []);
    setSubmitLoading(false);
    setLoading(false);
  };

  const handleSobFetchShowException = () => {
    setSubmitLoading(false);
    setLoading(false);
  };

  // const handleSOBDataShowSuccess = (dataObject) => {
  //     setSobDataList(dataObject?.data || []);
  //     setIsMissing(dataObject?.missingCsl || '');

  // }
  const handleSOBDataShowSuccess = (dataObject) => {
    setSobDataList(dataObject?.data || []);
    setIsMissing(dataObject?.missingCsl || "");
    sethasUnmappedProduct(dataObject?.hasUnmappedProduct || false);
  };

  const handleSOBDataShowException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
    }, 2000);
  };
  const columns = [
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
      field: "product",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Product</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "fimNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>FIMNo</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //     field: 'msd',
    //     headerClassName: 'super-app-theme--header',
    //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //         MSD
    //     </span>,
    //     type: 'string',
    //     sortable: true,
    //     minWidth: 100,
    //     flex: 1,
    //     align: 'center',
    //     headerAlign: 'center'
    // },
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
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    // {
    //     field: 'sheetName',
    //     headerName:
    //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //             Sheet Name
    //         </span>,
    //     type: 'string',
    //     sortable: true,
    //     minWidth: 100,
    //     flex: 1,
    //     align: 'center',
    //     headerAlign: 'center'
    // },
  ];

  const columns2 = [
    {
      field: "sId",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>S.No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "sobNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>SOB Number</span>
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
      field: "created_at",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Created Date
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // {
    //     field: 'Qty',
    //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //         Qty
    //     </span>,
    //     type: 'string',
    //     sortable: true,
    //     minWidth: 100,
    //     flex: 1,
    //     align: 'center',
    //     headerAlign: 'center'
    // },

    // {
    //     field: 'sheetName',
    //     headerName:
    //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //             Sheet Name
    //         </span>,
    //     type: 'string',
    //     sortable: true,
    //     minWidth: 100,
    //     flex: 1,
    //     align: 'center',
    //     headerAlign: 'center'
    // },
  ];

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const sucessOrderProcessOrder = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
      setOpenSOBview(false);
    }, 3000);
  };
  const ExceptionOrderProcessOrder = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
    }, 3000);
  };

  const handleSucessShow = (dataObject) => {
    setSobDataList(dataObject?.data || []);
  };
  const handleShowException = (errorObject, errorMessage) => {};

  const handleRowClick = (e) => {
    setisSobSet(false);
    setIsId(e.row.id);
    setProcessed(e.row.processed);
    SobConsolidateSob(
      {
        id: e.row.id,
      },
      handleSOBDataShowSuccess,
      handleSOBDataShowException
    );
  };

  const ClearData = () => {
    setFromDate("");
    setToDate("");
    setSobDataList([]);
    setIsMissing("");
    setSobDataSetList([]);
  };

  const onProductDownload = () => {
    DownloadSobExlTemplateProduct(
      {
        id: idId,
      },
      DownloadSobExlTemplateProductSucces,
      DownloadSobExlTemplateProductException
    );
  };

  const DownloadSobExlTemplateProductSucces = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
      setOpenSOBview(false);
    }, 3000);
  };

  const DownloadSobExlTemplateProductException = (
    errorObject,
    errorMessage
  ) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
    }, 2000);
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "100%", height: "100%" } }}
      maxWidth="false"
      open={openSOBview}
    >
      <DialogTitle
        style={{
          background: "#002D68",
          color: "white",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {cslId ? " SOB Data List" : "SOB Consolidated Views"}
      </DialogTitle>
      <DialogContent>
        <Grid item md={12}>
          <Grid container spacing={2}>
            {!cslId && isSobSet ? (
              <>
                <Grid item xs={12} md={4} lg={3} sm={4}>
                  <TextField
                    id="filled-basic"
                    label="From Date"
                    variant="filled"
                    sx={{ mb: 1 }}
                    margin="dense"
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="date"
                    placeholder="From Date"
                    value={formDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={3} sm={4}>
                  <TextField
                    id="filled-basic"
                    label="To date"
                    variant="filled"
                    sx={{ mb: 1 }}
                    margin="dense"
                    size="small"
                    fullWidth
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    placeholder="To date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  lg={3}
                  sm={4}
                  style={{
                    display: "flex",
                    alignItems: "center",
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
                    onClick={(e) => {
                      setSubmitLoading(true);

                      SobFetchShow(
                        {
                          fromDate: formDate,
                          toDate: toDate,
                        },
                        handleSobFetchShowSuccess,
                        handleSobFetchShowException
                      );
                    }}
                  >
                    {submitloading ? (
                      <CircularProgress size={24} style={{ color: "white" }} />
                    ) : (
                      "Submit"
                    )}{" "}
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  lg={3}
                  sm={4}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    disabled={loading}
                    style={{
                      width: "150px",
                      background: "#002D68",
                      color: "white",
                    }}
                    onClick={(e) => {
                      setFromDate("");
                      setToDate("");
                      setLoading(true);
                      SobFetchShow(
                        {
                          fromDate: "",
                          toDate: "",
                        },
                        handleSobFetchShowSuccess,
                        handleSobFetchShowException
                      );
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} style={{ color: "white" }} />
                    ) : (
                      "Today"
                    )}{" "}
                  </Button>
                </Grid>
              </>
            ) : (
              <></>
            )}

            <Grid item md={12}>
              {isSobSet ? (
                <>
                  <DataGrid
                    rows={sobDataSetList}
                    columns={columns2}
                    pageSize={8}
                    onRowClick={handleRowClick}
                    rowsPerPageOptions={[8]}
                    disableSelectionOnClick
                    style={{ border: "none" }}
                    sx={{
                      overflow: "auto",
                      height: "70vh",

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
                      const rowIndex = sobDataSetList.findIndex(
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
                </>
              ) : (
                <DataGrid
                  rows={sobDataList}
                  columns={columns}
                  pageSize={8}
                  // loading={isLoading}
                  rowsPerPageOptions={[8]}
                  disableSelectionOnClick
                  style={{ border: "none" }}
                  sx={{
                    marginTop: "20px",
                    overflow: "auto",
                    height: "70vh",
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
                    const rowIndex = sobDataList.findIndex(
                      (row) => row.id === params.row.id
                    );
                    // Check if the index is valid
                    if (rowIndex !== -1) {
                      return rowIndex % 2 === 0 ? "Mui-evenRow" : "Mui-oddRow";
                    }
                    return ""; // Return default class if index is not found
                  }}
                  rowHeight={40}
                  columnHeaderHeight={40}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {!cslId && !isSobSet ? (
          <>
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              onClick={(e) => {
                setisSobSet(true);
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              onClick={(e) => {
                onProductDownload();
              }}
            >
              Download
            </Button>
            {hasUnmappedProduct === true ? (
              <Button
                // disabled={isMissing === 1}
                variant="contained"
                style={{
                  width: "300px",
                  background: "#002D68",
                  color: "white",
                }}
                onClick={(e) => {
                  setProductOpen(true);
                }}
              >
                Contract and Product Mapping
              </Button>
            ) : isMissing === 1 ? (
              <>
                <Button
                  variant="contained"
                  // disabled={isMissing === 0}
                  style={{
                    width: "150px",
                    background: "#002D68",
                    color: "white",
                  }}
                  onClick={(e) => {
                    setOpenMissing(true);
                  }}
                >
                  Missing CSL
                </Button>
              </>
            ) : processed === 0 ? (
              <>
                <Button
                  // disabled={}
                  variant="contained"
                  style={{
                    width: "200px",
                    background: "#002D68",
                    color: "white",
                  }}
                  onClick={(e) => {
                    if (sobDataList[0]?.product === null) {
                      setNotification({
                        status: true,
                        type: "error",
                        message:
                          "Contract and product mapping have not been completed",
                      });
                      setTimeout(() => {
                        // handleClose();
                      }, 3000);
                    } else {
                      OrderProcessOrder(
                        {
                          sobMstId: idId,
                        },
                        sucessOrderProcessOrder,
                        ExceptionOrderProcessOrder
                      );
                    }
                  }}
                >
                  Process Order
                </Button>
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <> </>
        )}

        <Button
          variant="contained"
          style={{ width: "150px", background: "#002D68", color: "white" }}
          onClick={(e) => {
            setOpenSOBview(false);
            ClearData();
            if (cslId) {
              setCSLId("");
            }
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

      <MissingCsl
        openMissing={openMissing}
        setOpenMisiing={setOpenMissing}
        // cslId={cslId}
        masterId={idId}
        setRefeshMissing={setRefeshMissing}
      />
      <ImpoertProduct
        open={productOpen}
        setOpen={setProductOpen}
        idId={idId}
        setRefeshValue={setRefeshValue}
      />
    </Dialog>
  );
};

export default SOBviewCslData;
