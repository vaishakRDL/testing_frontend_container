import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  Button,
  Card,
  CardContent,
  Fab,
  Grid,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import SupervisorTitle from "./SupervisorTitle";
import AddIcon from "@mui/icons-material/Add";
import NestingModule from "./NestingModule";
import {
  JobCardOnSubmit,
  SupervisorJobCardOnSubmit,
} from "../../ApiService/LoginPageService";
import OperatorLog from "./OperatorLog";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import PDFViewer from "../../Utility/PDFViiewer";
import SkillMatrixViewPdf from "../SkillMatrix/SkillMatrixViewPdf";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import JobCardViewNewModal from "../JobCardViewNew/JobCardViewNewModal";
import SupervisorJobcardViewModel from "./SupervisorJobcardViewModel";
import SrnModule from "./SrnComponent/SrnModule";
import PDFViewerSupervise from "../../Utility/PDFViewerSupervise";
import { useNavigate } from "react-router-dom";
import { useModuleLocks } from "../context/ModuleLockContext";

const SupervisorModule = () => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Supervisor Job Card")?.lockStatus === "locked";

  const [open, setOpen] = useState(false);
  const [isAddButton, setIsAddButton] = useState(true);
  const [editData, setEditData] = useState([]);
  const [selectedRowItemCode, setSelectedRowItemCode] = useState("");

  const [customerList, setCustomerList] = useState([]);
  const [isLoading, setGridLoading] = useState(true);
  const [id, setId] = useState("");
  const [password, setConfirmPassword] = useState("");
  const [btnReset, setBtnReset] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [fyFrom, setFyFrom] = useState("");
  const [fyTo, setFyTo] = useState("");

  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [isNesting, setisNesting] = useState(false);
  const [isOperatorLog, setIsOperatorLog] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [jonCardView, setJobCardView] = useState([]);
  const [submitloading, setsubmitLoading] = useState(false);
  const [todayloading, settodayLoading] = useState(false);
  const today = new Date();
  const date = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  const TodaysDate = `${year}-${month}-${date}`;

  const [pdfOpen, setPdfOpen] = useState(false);
  const [fileTypeForView, setFileTypeForView] = useState("");
  const [selectedRowJobCardNo, setSelectedRowJobCardNo] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [srnModalOpen, setSrnModalOpen] = useState(false);


  const navigate = useNavigate();

  // const columns = [
  //     {
  //         field: 'JCID',
  //         headerClassName: 'super-app-theme--header',
  //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
  //             JCID
  //         </span>,
  //         type: 'string',
  //         sortable: true,
  //         minWidth: 80,
  //         flex: 1,
  //         align: 'left',
  //         headerAlign: 'center',
  //     },
  //     {
  //         field: 'JCNO',
  //         headerClassName: 'super-app-theme--header',
  //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
  //             JCNO
  //         </span>,

  //         type: 'string',
  //         sortable: true,
  //         minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
  //     },
  //     {
  //         field: 'JCdATE',
  //         headerClassName: 'super-app-theme--header',
  //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
  //             JCDate
  //         </span>,

  //         type: 'string',
  //         sortable: true,
  //         minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
  //     },
  //     {
  //         field: 'KB',
  //         headerClassName: 'super-app-theme--header',
  //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
  //             KBDATE
  //         </span>,

  //         type: 'string',
  //         sortable: true,
  //         minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
  //     },
  //     {
  //         field: 'SITE',
  //         headerClassName: 'super-app-theme--header',
  //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
  //             SITEMCODE
  //         </span>,

  //         type: 'string',
  //         sortable: true,
  //         minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
  //     },
  //     {
  //         field: 'JC',
  //         headerClassName: 'super-app-theme--header',
  //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
  //             JCQTY
  //         </span>,

  //         type: 'string',
  //         sortable: true,
  //         minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
  //     },
  //     {
  //         field: 'SF',
  //         headerClassName: 'super-app-theme--header',
  //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
  //             SFGCumQty
  //         </span>,

  //         type: 'string',
  //         sortable: true,
  //         minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
  //     },

  //     {
  //         field: 'actions',
  //         type: 'actions',
  //         flex: 1,
  //         headerClassName: 'super-app-theme--header',
  //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
  //             Actions
  //         </span>,

  //         cellClassName: 'actions',
  //         minWidth: 300,
  //         disableClickEventBubbling: true,
  //         getActions: (params) => [
  //             <ViewData selectedRow={params.row} />,
  //             <Nesting selectedRow={params.row} />,
  //         ],
  //     },
  // ];

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
      field: "npdFile",

      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>File</span>
      ),
      type: "actions",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      disableClickEventBubbling: true,
      getActions: (params) => [<ViewdData selectedRow={params.row} />],
    },
  ];
  function ViewdData(props) {
    return (
      <RemoveRedEyeIcon
        onClick={() => {
          setPdfOpen(true);
          setFileTypeForView(props.selectedRow?.npdFile || "");
          setSelectedRowItemCode(props.selectedRow?.itemCode || "");
        }}
        style={{
          color: "#002D68",
          cursor: "pointer",
        }}
      />
    );
  }
  const exampleData = [
    {
      id: 1,
      JCID: "1",
      JCNO: "JC001",
      JCDate: "2024-03-06",
      KBDATE: "2024-03-07",
      SITEMCODE: "SITE001",
      JCQTY: "10",
      SFGCumQty: "5",
    },
    {
      id: 1,
      JCID: "2",
      JCNO: "JC002",
      JCDate: "2024-03-07",
      KBDATE: "2024-03-08",
      SITEMCODE: "SITE002",
      JCQTY: "15",
      SFGCumQty: "8",
    },
    {
      id: 2,
      JCID: "3",
      JCNO: "JC003",
      JCDate: "2024-03-08",
      KBDATE: "2024-03-09",
      SITEMCODE: "SITE003",
      JCQTY: "20",
      SFGCumQty: "12",
    },
    // Add more data as needed...
  ];

  useEffect(() => { }, [refreshData]);

  function ViewData(props) {
    return (
      <Fab
        style={{ background: "#002D68", color: "white" }}
        variant="extended"
        size="medium"
        color="primary"
        aria-label="add"
      >
        <AddIcon sx={{ mr: 1 }} />
        View
      </Fab>
    );
  }

  function Nesting(props) {
    return (
      <Fab
        style={{ background: "#002D68", color: "white" }}
        variant="extended"
        size="medium"
        color="primary"
        aria-label="add"
        onClick={() => {
          setisNesting(true);
        }}
      >
        <AddIcon sx={{ mr: 1 }} />
        Nesting
      </Fab>
    );
  }

  const handleCellClick = (params) => {
    if (params.field === "jcNo") {
      console.log("Cell clicked:", params);
      // JobCard No
      setOpen(true);
      setSelectedRowJobCardNo(params.row.jcNo);
    }
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handleClickOpen = (fileUrl) => {
    setFileTypeForView(fileUrl);
    setPdfOpen(true);
  };

  const handleJobCardSubmitSuccess = (dataObject) => {
    settodayLoading(false);
    setsubmitLoading(false);
    setJobCardView(dataObject?.data || []);
    // setNotification({
    //   status: true,
    //   type: "success",
    //   message: dataObject.message,
    // });

    // setTimeout(() => {
    //   handleClose();
    // }, 3000);
  };

  const handleJobCardSubmitException = () => {
    settodayLoading(false);
    setsubmitLoading(false);
  };

  const generateRowsWithIndex = (rows) => {
    return rows.map((row, index) => ({ sNo: index + 1, ...row }));
  };
  const rowData = generateRowsWithIndex(jonCardView);

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
      setFromDate(value);
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
      setToDate(value);
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
    <>
      {isNesting === false && isOperatorLog === false ? (
        <div style={{ height: "60vh", width: "100%" }}>
          <SupervisorTitle
            setIsAddButton={setIsAddButton}
            setEditData={setEditData}
            setOpen={setOpen}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginLeft: "25px",
            }}
          >
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
                  onChange={handleFromDateChange}
                  inputProps={{
                    min: fyFrom,
                    max: fyTo,
                  }}
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
                  onChange={handleToDateChange}
                  inputProps={{
                    min: fyFrom,
                    max: fyTo,
                  }}
                />
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
                  disabled={todayloading}
                  onClick={() => {
                    settodayLoading(true);
                    SupervisorJobCardOnSubmit(
                      {
                        fromDate: TodaysDate,
                        toDate: TodaysDate,
                        itemCode: "",
                      },
                      handleJobCardSubmitSuccess,
                      handleJobCardSubmitException
                    );
                  }}
                >
                  {todayloading ? (
                    <CircularProgress size={24} style={{ color: "white" }} />
                  ) : (
                    "Today"
                  )}
                </Button>
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
                    SupervisorJobCardOnSubmit(
                      {
                        fromDate: fromDate,
                        toDate: toDate,
                        itemCode: "",
                      },
                      handleJobCardSubmitSuccess,
                      handleJobCardSubmitException
                    );
                  }}
                >
                  {submitloading ? (
                    <CircularProgress size={24} style={{ color: "white" }} />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Grid>
              <Grid
                item
                md={2}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* <Button
                  variant="contained"
                  style={{
                    width: "100%",
                    background: "#002D68",
                    color: "white",
                  }}
                  onClick={() => {
                    setisNesting(true);
                  }}
                >
                  Sheet Requirement
                </Button> */}
                <Button
                  variant="contained"
                  style={{
                    width: "100%",
                    background: isModuleLocked ? "gray" : "#002D68",
                    color: "white",
                  }}
                  onClick={() => {
                    navigate("/NestingTransaction"); // 👈 navigate to module
                  }}
                  disabled={isModuleLocked}
                >
                  Sheet Requirement
                </Button>
              </Grid>
              <Grid
                item
                md={2}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  style={{
                    width: "180px",
                    background: isModuleLocked ? "gray" : "#002D68",
                    color: "white",
                  }}
                  disabled={isModuleLocked}
                  onClick={() => {
                    setIsOperatorLog(true);
                  }}
                >
                  Operator Log
                </Button>
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
                    width: "180px",
                    background: isModuleLocked ? "gray" : "#002D68",
                    color: "white",
                  }}
                  onClick={() => {
                    setSrnModalOpen(true);
                  }}
                  disabled={isModuleLocked}
                >
                  SRN
                </Button>
              </Grid>

              <Grid item md={12}>
                <Card
                  style={{
                    boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                    width: "98%",
                    height: "100%",
                  }}
                >
                  <CardContent>
                    <DataGrid
                      rows={rowData}
                      columns={columns2}
                      pageSize={8}
                      rowsPerPageOptions={[8]}
                      disableSelectionOnClick
                      onCellClick={handleCellClick}
                      style={{
                        border: "none",
                        fontWeight: "bold",
                        height: "61vh",
                        fontFamily: "Arial",
                      }}
                      sx={{
                        // Header
                        "& .super-app-theme--header": {
                          WebkitTextStrokeWidth: "0.6px",
                          backgroundColor: "#93bce6",
                          color: "#1c1919",
                        },

                        // Borders
                        "& .MuiDataGrid-cell": {
                          border: "1px solid #969696",
                        },
                        "& .MuiDataGrid-columnHeader": {
                          border: "1px solid #969696",
                        },

                        // Custom row background by supervisorCls
                        "& .supervisorCls-0": {
                          backgroundColor: "#FFA7A7 !important",
                        },
                        "& .supervisorCls-1": {
                          backgroundColor: "#90ee90 !important",
                        },
                        "& .supervisorCls-2": {
                          backgroundColor: "#FFFFE0 !important",
                        },
                        "& .supervisorCls-3": {
                          backgroundColor: "#799EFF !important",
                        },

                        // ✅ Completely remove selected & focused styles
                        "& .MuiDataGrid-row.Mui-selected": {
                          backgroundColor: "unset !important",
                        },
                        "& .MuiDataGrid-cell.Mui-selected": {
                          backgroundColor: "unset !important",
                        },
                        "& .MuiDataGrid-row.Mui-selected:hover": {
                          backgroundColor: "unset !important",
                        },
                        "& .MuiDataGrid-cell:focus": {
                          outline: "none !important",
                        },
                        "& .MuiDataGrid-cell:focus-within": {
                          outline: "none !important",
                        },
                        "& .MuiDataGrid-row:focus": {
                          outline: "none !important",
                        },
                        "& .MuiDataGrid-row:focus-within": {
                          outline: "none !important",
                        },
                      }}
                      getRowClassName={(params) => {
                        const cls = params.row.supervisorCls;
                        if (cls === 0) return "supervisorCls-0";
                        if (cls === 1) return "supervisorCls-1";
                        if (cls === 2) return "supervisorCls-2";
                        if (cls === 3) return "supervisorCls-3";
                        return "";
                      }}
                      rowHeight={40}
                      columnHeaderHeight={40}
                    />

                    {/* <SkillMatrixViewPdf
                      pdfOpen={pdfOpen}
                      setPdfOpen={setPdfOpen}
                      fileTypeForView={fileTypeForView}
                    />
                     */}
                    <PDFViewerSupervise
                      pdfOpen={pdfOpen}
                      setPdfOpen={setPdfOpen}
                      fileTypeForView={fileTypeForView}
                      selectedRowItemCode={selectedRowItemCode}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          columnGap: "50px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            columnGap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: "#8be78b",
                              cursor: "pointer",
                            }}
                          // onClick={handleCompleteClick}
                          // onMouseEnter={(e) => (e.target.style.border = '1px solid #000000', e.target.style.borderRadius = '50px')}
                          // onMouseLeave={(e) => (e.target.style.border = 'none', e.target.style.borderRadius = '0px')}
                          ></div>
                          <Typography>Completed</Typography>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            columnGap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: "#FFA7A7",
                              cursor: "pointer",
                            }}
                          ></div>
                          <Typography>Incomplete</Typography>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            columnGap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: "#f7e2a0",
                              cursor: "pointer",
                            }}
                          ></div>
                          <Typography>Pending</Typography>
                        </div>
                        {/* <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                                        <div style={{ width: '20px', height: '20px', backgroundColor: '#f5a546', cursor: 'pointer' }} ></div>
                                        <Typography>Exceeded</Typography>
                                    </div> */}

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            columnGap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: "#799EFF",
                              cursor: "pointer",
                            }}
                          ></div>
                          <Typography>Awaiting for Vendor Process</Typography>
                        </div>
                      </div>

                      {/* <div>
                                    <Typography style={{ fontWeight: 'bold' }}>Total Work Planned : {totalWorkPlanned} Min</Typography>
                                </div> */}
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </div>
          {/* <SupplaceModule
                isAddButton={isAddButton}
                customerData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
            /> */}

          <SupervisorJobcardViewModel
            open={open}
            setOpen={setOpen}
            selectedRowJobCardNo={selectedRowJobCardNo}
            selectedMachine={selectedMachine}
            setSelectedRowJobCardNo={setSelectedRowJobCardNo}
          />
          <NotificationBar
            handleClose={handleClose}
            notificationContent={openNotification.message}
            openNotification={openNotification.status}
            type={openNotification.type}
          />
        </div>
      ) : isNesting ? (
        <NestingModule setisNesting={setisNesting} />
      ) : isOperatorLog ? (
        <OperatorLog setIsOperatorLog={setIsOperatorLog} />
      ) : (
        <></>
      )}
      <SrnModule open={srnModalOpen} setOpen={setSrnModalOpen} />
    </>
  );
};

export default SupervisorModule;
