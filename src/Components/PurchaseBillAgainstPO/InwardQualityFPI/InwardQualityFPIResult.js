import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
// import {
//   GetItemVsProcessProcessList,
//   AddItemVsProcess,
//   GetFpiInspectionData,
// } from "../../ApiService/LoginPageService";
import { useLocation, useNavigate } from "react-router-dom";
// import AssemblyFPIApprovePopup from "./AssemblyFPIApprovePopup";
// import AssemblyFPIReworkPopup from "./AssemblyFPIReworkPopup";
// import AssemblyFPIScrapPopup from "./AssemblyFPIScrapPopup";
// import AssemblyFPITitle from "./AssemblyFPITitle";
import InwardQualityFPIReworkPopup from "./InwardQualityFPIReworkPopup";
import InwardQualityFPIScrapPopup from "./InwardQualityFPIScrapPopup";
import InwardQualityFPITitle from "./InwardQualityFPITitle";
import { AddItemVsProcess, GetContractAssemblyPlanInspectionData, GetFpiAssemblyInspectionData, GetFpiInspectionData, GetItemVsProcessProcessList, QualityInwardReportShow, QualityInwardWithoutReportShow } from "../../../ApiService/LoginPageService";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";
import InwardQualityFPIApprovePopup from "./InwardQualityFPIApprovePopup";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const InwardQualityFPIResult = ({
    isSelectedData,
    batchQty,
    setIsProcessInsp,
    poBillDetailId,
    rowItemId,
    rowPoNumber,
    rowAccQty,
    reportRowData,
    WithoutPObatchQty,
    selectedOptionName,
    selectedMachineId,
    isChild,
    setIsChild,
    scrollToRow,
    selectedRowId,
    selectedRowItemId,
    kanDate,
    selectedFim,
    contractRadioChange,
    rowContract,
    optionsRowData,
    selectedRowItemCode,
    inspectionView,
    poBillId
}) => {
    console.log("poBillDetailIdpoBillDetailId", reportRowData)
    console.log("q121233rowItemId", rowItemId)
    console.log("batchQtybatchQty", batchQty)
    const navigate = useNavigate();
    const location = useLocation();

    const jcNo = new URLSearchParams(location.search).get("jcNo");
    const inspectionId = new URLSearchParams(location.search).get("inspectionId");


    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editeData, setEditeData] = useState([]);
    const [id, setId] = useState("");
    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: "error",
        message: "",
    });
    const [processList, setProcessList] = useState([]);
    ////////////////////////////////////
    const [selectedItemId, setSelectedItemId] = useState("");
    const [skipValues, setSkipValues] = useState({});
    const [qualityValues, setQualityValues] = useState({});
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [editedCycleTime, setEditedCycleTime] = useState({});
    const [editedProcessPriority, setEditedProcessPriority] = useState({});
    const [editCount, setEditCount] = useState({});
    const [editedSkip, setEditedSkip] = useState({});
    const [editedQuality, setEditedQuality] = useState({});
    const [excelModal, setExcelModal] = useState(false);
    const [copyFromModal, setCopyFromModal] = useState(false);
    const [OpenFPIReworkPopup, setOpenFPIReworkPopup] = useState(false);
    const [OpenFPIApprovePopup, setOpenFPIApprovePopup] = useState(false);
    const [OpenFPIScrapPopup, setOpenFPIScrapPopup] = useState(false);
    const [userName, setUserName] = useState('');

    //FPI INSPECTION STATE
    const [fpiInspectionList, setFpiInspectionList] = useState([]);

    const [machineName, setMachineName] = useState('');
    const [itemCode, setItemCode] = useState('');
    const [customer, setCustomer] = useState('');
    const [type, setType] = useState('');
    const [shift2, setShift] = useState('');
    const [operation, setOperation] = useState('');
    const [operationId, setOperationId] = useState('');
    const [itemName, setItemName] = useState('');
    const [date, setDate] = useState(new Date());
    const [jobCardNo, setJobCardNo] = useState('');
    const [contractNo, setContractNo] = useState('');
    const [totalQty, setTotalQty] = useState('');
    const [status, setStatus] = useState('');
    const [jcId, setJcId] = useState('');
    const [machineId, setMachineId] = useState('')
    // const[itemCode,setItemCode]=useState('');

    // kk
    const [fpInSpectionData, setFpiInspectionData] = useState([]);
    const [inspectionList, setInSpectionList] = useState([]);
    const [arrayIndex, setArrayIndex] = useState(0);

    // const columns2 = [
    //     {
    //         field: "sNo",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>SI No </span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         // width:50,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //     },
    //     {
    //         field: "qltyParameter",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>
    //                 Quality Parameter{" "}
    //             </span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //     },
    //     {
    //         field: "expVal",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>
    //                 Expected Value
    //             </span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //     },
    //     {
    //         field: "minTolerance",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>
    //                 Min Tolerance
    //             </span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //     },
    //     {
    //         field: "maxTolerance",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>
    //                 Max Tolerance
    //             </span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //     },
    //     {
    //         field: "uom",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>UOM </span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //     },
    //     {
    //         field: "expVisInspec",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>Visual</span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //     },
    //     {
    //         field: "evalMethod",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>
    //                 Evaluation Method
    //             </span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //     },
    //     {
    //         field: "actualResult",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>
    //                 Actual Result
    //             </span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //         editable: true,
    //     },
    // ];
    // 🔹 Dynamic columns based on batchQty
    const [columns2, setColumns2] = useState([]);

    // function to build base + dynamic columns
    const buildColumns = (count = 1) => {
        const baseColumns = [
            {
                field: "sNo",
                headerClassName: "super-app-theme--header",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>SI No</span>,
                type: "string",
                minWidth: 80,
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "qltyParameter",
                headerClassName: "super-app-theme--header",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>Quality Parameter</span>,
                type: "string",
                minWidth: 120,
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "expVal",
                headerClassName: "super-app-theme--header",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>Expected Value</span>,
                type: "string",
                minWidth: 100,
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "minTolerance",
                headerClassName: "super-app-theme--header",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>Min Tolerance</span>,
                type: "string",
                minWidth: 100,
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "maxTolerance",
                headerClassName: "super-app-theme--header",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>Max Tolerance</span>,
                type: "string",
                minWidth: 100,
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "uom",
                headerClassName: "super-app-theme--header",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>UOM</span>,
                type: "string",
                minWidth: 80,
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "expVisInspec",
                headerClassName: "super-app-theme--header",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>Visual</span>,
                type: "string",
                minWidth: 80,
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "evalMethod",
                headerClassName: "super-app-theme--header",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>Evaluation Method</span>,
                type: "string",
                minWidth: 120,
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
        ];

        // 🔹 Add dynamic columns: Actual Result1..N
        const dynamicCols = [];
        const total = Number(count) || 1;

        for (let i = 1; i <= total; i++) {
            dynamicCols.push({
                field: `actualResult${i}`,
                headerClassName: "super-app-theme--header",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actual Result{i}</span>,
                type: "string",
                sortable: true,
                minWidth: 100,
                flex: 1,
                align: "center",
                headerAlign: "center",
                editable: true,
            });
        }

        setColumns2([...baseColumns, ...dynamicCols]);
    };
    // useEffect(() => {
    //   // Whenever batchQty is available or changes, rebuild the columns
    //   if (batchQty) {
    //     buildColumns(batchQty);
    //   } else {
    //     buildColumns(1); // default
    //   }
    // }, [batchQty]);
    useEffect(() => {
        console.log("🧩 Using batch count =>", batchQty || WithoutPObatchQty);
    }, [batchQty, WithoutPObatchQty]);

    useEffect(() => {
        const totalCount = batchQty || WithoutPObatchQty || 1;
        buildColumns(totalCount);
    }, [batchQty, WithoutPObatchQty]);

    // useEffect(() => {
    //   if (inspectionList.length > 0 && batchQty) {
    //     const total = Number(batchQty) || 1;
    //     const updated = inspectionList.map((row) => {
    //       const newRow = { ...row };
    //       // Copy existing actualResult value to actualResult1 if only one exists
    //       if (newRow.actualResult !== undefined && !newRow.actualResult1) {
    //         newRow.actualResult1 = newRow.actualResult;
    //       }
    //       // Ensure all dynamic columns exist
    //       for (let i = 1; i <= total; i++) {
    //         if (newRow[`actualResult${i}`] === undefined) {
    //           newRow[`actualResult${i}`] = "";
    //         }
    //       }
    //       return newRow;
    //     });
    //     setInSpectionList(updated);
    //   }
    // }, [inspectionList.length, batchQty]);

    useEffect(() => {
        const total = Number(batchQty || WithoutPObatchQty) || 1;

        if (inspectionList.length > 0 && total > 0) {
            const updated = inspectionList.map((row) => {
                const newRow = { ...row };

                // If backend sent only one "actualResult", mirror it into first column
                if (newRow.actualResult !== undefined && !newRow.actualResult1) {
                    newRow.actualResult1 = newRow.actualResult;
                }

                // Make sure all required dynamic actualResult columns exist
                for (let i = 1; i <= total; i++) {
                    if (newRow[`actualResult${i}`] === undefined) {
                        newRow[`actualResult${i}`] = "";
                    }
                }
                return newRow;
            });

            setInSpectionList(updated);
        }
    }, [inspectionList.length, batchQty, WithoutPObatchQty]);

    useEffect(() => {
        if (inspectionView === true) {
            QualityInwardWithoutReportShow(
                {
                    poBillDtlId: poBillDetailId,
                    item: rowItemId,
                },
                handleFpiInspectionSuccess,
                handleFpiInspectionException
            );
        } else {
            QualityInwardReportShow(
                {
                    poBillDtlId: poBillDetailId,
                    item: rowItemId,
                },
                handleFpiInspectionSuccess,
                handleFpiInspectionException
            );
        }
    }, [refreshData, inspectionView]);


    useEffect(() => {
        if (contractRadioChange === 'assemblyPlan') {
            setContractNo(Object.keys(optionsRowData)[6])
            setTotalQty(optionsRowData?.totQty)
            console.log("optionsRowDataoptionsRowDataoptionsRowData", optionsRowData)
            console.log("Object.keys(optionsRowData)[0]Object.keys(optionsRowData)[0]", Object.keys(optionsRowData)[6])
        }
    }, [contractRadioChange, kanDate, optionsRowData])

    const handleFpiInspectionSuccess = (dataObject) => {
        setFpiInspectionData(dataObject?.data || []);
    }
    const handleFpiInspectionException = () => { }

    useEffect(() => {
        const dataExtracted = fpInSpectionData[arrayIndex];

        setOperationId(dataExtracted?.operationId || '');
        setMachineId(dataExtracted?.machineId || '')
        setStatus(dataExtracted?.status || '');

        setCustomer(dataExtracted?.customer || '');
        setMachineName(dataExtracted?.machineCode || '');
        setType(dataExtracted?.inspectionType || '')
        contractRadioChange !== 'assemblyPlan' && setContractNo(isSelectedData?.contractNo || '')
        setItemCode(dataExtracted?.itemCode || '');
        setOperation(dataExtracted?.operation || '');
        setShift(dataExtracted?.shift2 || '');
        setJobCardNo(dataExtracted?.jcNo || '')
        contractRadioChange !== 'assemblyPlan' && setTotalQty(isSelectedData?.Qty || '');
        setInSpectionList(dataExtracted?.inspections || [])
        setJcId(dataExtracted?.jCId || '')
        setUserName(dataExtracted?.addedBy || '');
    }, [arrayIndex, fpInSpectionData])

    const handleNextButton = () => {
        setArrayIndex(arrayIndex + 1)
    }
    const handlePreviousButton = () => {
        setArrayIndex(arrayIndex - 1)
    }

    // GET ITEM DROPDOWN
    // const handleItemVsProcessItemSucessShow = (dataObject) => {
    //   setFpiInspectionList(dataObject?.data || []);
    //   const dataExtracted = dataObject?.data[0];
    //   setMachineName(dataExtracted?.machineName || '');
    //   setItemCode(dataExtracted?.itemCode || '');
    //   setCustomer(dataExtracted?.customer || '');
    //   setType(dataExtracted?.type || '');
    //   setShift(dataExtracted?.shift2 || 'Null');
    //   setOperation(dataExtracted?.operation || '');
    //   setItemName(dataExtracted?.itemName || '');
    //   setDate(dataExtracted?.date || '');
    //   // console.log("dataObject?.data", dataObject?.data)
    // };
    // const handleItemVsProcessItemExceptionShow = (
    //   errorObject,
    //   errorMessage
    // ) => { };

    // GET PROCESS DATAGRID PROCESS
    const handleItemVsProcessListSucessShow = (dataObject) => {
        setProcessList(dataObject?.data || []);
    };
    const handleItemVsProcessListExceptionShow = (
        errorObject,
        errorMessage
    ) => { };

    function CheckBoxData(props) {
        const { selectedRow } = props;

        const handleCheckboxChange = (e) => {
            const updatedSelectedCheckboxes = {
                ...selectedCheckboxes,
                [selectedRow.id]: e.target.checked,
            };
            setSelectedCheckboxes(updatedSelectedCheckboxes);

            const isChecked = e.target.checked;

            if (isChecked) {
                // If the checkbox is checked, add the selected row to the array
                setSelectedRows((prevSelectedRows) => [
                    ...prevSelectedRows,
                    selectedRow,
                ]);
            } else {
                // If the checkbox is unchecked, remove the selected row from the array
                setSelectedRows((prevSelectedRows) =>
                    prevSelectedRows.filter((row) => row.id !== selectedRow.id)
                );
            }
        };

        return (
            <Checkbox
                {...label}
                checked={selectedCheckboxes[selectedRow.id] || false}
                onChange={handleCheckboxChange}
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

    const handleSubmitClick = () => {
        AddItemVsProcess(selectedRows, handleSuccess, handleException);
    };

    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: "success",
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
        }, 2000);
    };
    const handleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: "error",
            message: errorMessage,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
        }, 2000);
    };

    const ClearData = () => {
        // window.location.reload();
        setProcessList([]);
        setSelectedRows([]);
        setEditCount({});
        setEditedCycleTime({});
        setEditedProcessPriority({});
        setEditedSkip("NO");
        setEditedQuality("YES");
        setSelectedCheckboxes({});
        setTimeout(() => {
            GetItemVsProcessProcessList(
                handleItemVsProcessListSucessShow,
                handleItemVsProcessListExceptionShow
            );
        }, 1000);
    };

    const handleSupplierSearchItemChange = (value) => {
        // setSelectedItems((prevSelectedItems) => [...prevSelectedItems, value]);
        if (value !== null) {
            setSelectedItemId(value.id);
        }
    };
    const buttonStyle = {
        variant: "contained",
        // color: "primary",
        component: "label",
        sx: {
            marginRight: "8px",
            backgroundColor: "#002D68",
            height: "40px",
            borderRadius: "20px",
            width: "200px",
        },
    };
    const buttonStyle1 = {
        variant: "contained",
        // color: "primary",
        component: "label",
        sx: {
            marginRight: "8px",
            backgroundColor: "#002D68",
            height: "40px",
            borderRadius: "20px",
            width: "150px",
        },
    };

    // const handleCellEdit = (params) => {
    //     const updatedList = inspectionList.map((supp) => {
    //         return supp.id === params.id ? { ...supp, actualResult: params.actualResult || '0' } : supp;
    //     });
    //     setInSpectionList(updatedList);
    // };
    const handleCellEdit = (params) => {
        const { id, field, value } = params;
        if (field.startsWith("actualResult")) {
            const updatedList = inspectionList.map((row) => {
                if (row.id === id) {
                    return { ...row, [field]: value };
                }
                return row;
            });
            setInSpectionList(updatedList);
        }
    };


    // function formatDate(dateStr) {
    //     const [day, month, year] = dateStr?.split("-");
    //     return `${year}-${month}-${day}`;
    // }

    //DATE CONVERT TO TEXTFIELD
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    return (
        <div style={{ height: "60vh", width: "100%" }}>
            {
                isSelectedData?.qltInspecType !== 'Complete' ? (
                    <InwardQualityFPITitle
                        setIsAddButton={setIsAddButton}
                        setEditeData={setEditeData}
                        setOpen={setOpen}
                        setIsProcessInsp={setIsProcessInsp}
                        selectedOptionName={selectedOptionName}
                        setIsChild={setIsChild}
                        isChild={isChild}
                        scrollToRow={scrollToRow}
                        selectedRowId={selectedRowId}
                        inspectionView={inspectionView}
                    />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}>
                        <Typography
                            sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold', color: '#0769d9', '&:hover': { color: '#043f82' } }}
                            variant="h5"
                            onClick={() => {
                                setIsProcessInsp(0);
                                scrollToRow(selectedRowId)
                            }}
                        >
                            {`Process Inspection`}
                        </Typography>
                    </div>
                )
            }

            <Grid container spacing={2} padding={2}>
                <Grid item xs={12} sm={12} md={4} lg={2.4} xl={2.4}>
                    <TextField
                        fullWidth
                        id="Customer"
                        placeholder="Customer"
                        label='Customer'
                        value={customer}
                        size="small"
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2.4} xl={2.4}>
                    <TextField
                        fullWidth
                        id="PO No"
                        placeholder="PO No"
                        label='PO No'
                        variant="outlined"
                        size="small"
                        value={rowPoNumber}
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2.4} xl={2.4}>
                    <TextField
                        fullWidth
                        id="Date"
                        placeholder="Date"
                        label='Date'
                        value={formatDate(date)}
                        // value={date}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        type="date"
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2.4} xl={2.4}>
                    <TextField
                        fullWidth
                        id="Inspection-type"
                        placeholder="Inspection-type"
                        label='Inspection-type'
                        size="small"
                        value={type}
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2.4} xl={2.4}>
                    <TextField
                        fullWidth
                        id="Part Number"
                        placeholder="Part Number"
                        label='Part Number'
                        size="small"
                        value={itemCode}
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2.4} xl={2.4}>
                    <TextField
                        fullWidth
                        id="Operation"
                        placeholder="Operation"
                        label='Operation'
                        value={operation}
                        size="small"
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={2.4} xl={2.4}>
                    <TextField
                        fullWidth
                        id="Machine"
                        label='Machine'
                        value={machineName}
                        size="small"
                        placeholder="Machine"
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2.4} xl={2.4}>
                    <TextField
                        fullWidth
                        id="Total Qty"
                        placeholder="Total Qty"
                        label='Total Qty'
                        size="small"
                        variant="outlined"
                        value={rowAccQty}
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2.4} xl={2.4}>
                    <TextField
                        fullWidth
                        id="Status"
                        placeholder="Status"
                        label='Status'
                        disabled
                        variant="outlined"
                        size="small"
                        value={status}
                        style={{ color: "#000000" }}

                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2.4} xl={2.4}>
                    <TextField
                        fullWidth
                        label='User'
                        disabled
                        variant="outlined"
                        size="small"
                        value={userName}
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        {/* Card for the left grid */}
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
                                    rows={inspectionList}
                                    columns={columns2}
                                    pageSize={8}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    // processRowUpdate={handleCellEdit}
                                    processRowUpdate={(updatedRow, oldRow) => {
                                        handleCellEdit({ id: updatedRow.id, field: Object.keys(updatedRow).find(k => updatedRow[k] !== oldRow[k]), value: Object.values(updatedRow).find((v, i) => v !== Object.values(oldRow)[i]) });
                                        return updatedRow;
                                    }}
                                    style={{
                                        border: 'none',
                                        fontWeight: 'bold',
                                        // minWidth: '50%',
                                        height: '45vh',
                                        fontFamily: 'Arial',// Set the font family to Arial
                                    }}
                                    sx={{
                                        '& .super-app-theme--header': {
                                            WebkitTextStrokeWidth: '0.6px',
                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696',
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696', // Add border to column headers
                                        },
                                        '& .super-app-theme--header': {
                                            backgroundColor: '#93bce6',
                                            color: '#1c1919'
                                        },
                                    }}
                                    getRowClassName={(params) => {
                                        // Find the index of the row within the rows array
                                        const rowIndex = fpiInspectionList.findIndex(row => row.id === params.row.id);
                                        // Check if the index is valid
                                        if (rowIndex !== -1) {
                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }
                                        return ''; // Return default class if index is not found
                                    }}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </Grid>
            </Grid>

            <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                }}
            >
                <Button
                    {...buttonStyle1}
                    style={{ marginRight: "20px" }}
                    onClick={() => {
                        setOpenFPIApprovePopup(true);
                        inspectionView = true;
                    }}
                >
                    Approved
                </Button>
                <Button
                    {...buttonStyle1}
                    style={{ marginRight: "20px" }}
                    onClick={() => {
                        setOpenFPIReworkPopup(true);
                        inspectionView = true;
                    }}
                >
                    Rework
                </Button>
                <Button
                    {...buttonStyle1}
                    style={{ marginRight: "20px" }}
                    onClick={() => {
                        setOpenFPIScrapPopup(true);
                        inspectionView = true;
                    }}
                >
                    Scrap
                </Button>
                <Button
                    {...buttonStyle1}
                    style={{ marginRight: "20px" }}
                    onClick={handleNextButton}
                    disabled={arrayIndex + 1 === fpInSpectionData.length ? true : false}
                >
                    Next
                </Button>
                <Button
                    {...buttonStyle1}
                    style={{ marginRight: "20px" }}
                    onClick={handlePreviousButton}
                    disabled={arrayIndex === 0 ? true : false}
                >
                    Previous
                </Button>
            </Grid>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <InwardQualityFPIReworkPopup
                setOpenFPIReworkPopup={setOpenFPIReworkPopup}
                OpenFPIReworkPopup={OpenFPIReworkPopup}
                reportRowData={reportRowData}
                inspectionList={inspectionList}
                inspectionView={inspectionView}
                rowItemId={rowItemId}
                poBillDetailId={poBillDetailId}
                poBillId={poBillId}
                topData={{
                    type: selectedOptionName,
                    customer: customer,
                    shift2: shift2,
                    jCId: jcId,
                    machId: machineId,
                    date: date,
                    itemId: isSelectedData?.itemId,
                    operationId: operationId,
                    qty: totalQty,
                    process: operation,
                    status: status
                }}
            />

            <InwardQualityFPIApprovePopup
                setOpenFPIApprovePopup={setOpenFPIApprovePopup}
                OpenFPIApprovePopup={OpenFPIApprovePopup}
                reportRowData={reportRowData}
                inspectionList={inspectionList}
                inspectionView={inspectionView}
                rowItemId={rowItemId}
                poBillDetailId={poBillDetailId}
                poBillId={poBillId}
                topData={{
                    type: selectedOptionName,
                    customer: customer,
                    shift2: shift2,
                    jCId: jcId,
                    machId: machineId,
                    date: date,
                    itemId: isSelectedData?.itemId,
                    operationId: operationId,
                    process: operation,
                    qty: totalQty,
                    status: status
                }}
            />
            <InwardQualityFPIScrapPopup
                setOpenFPIScrapPopup={setOpenFPIScrapPopup}
                OpenFPIScrapPopup={OpenFPIScrapPopup}
                reportRowData={reportRowData}
                inspectionList={inspectionList}
                inspectionView={inspectionView}
                rowItemId={rowItemId}
                poBillDetailId={poBillDetailId}
                poBillId={poBillId}
                topData={{
                    type: selectedOptionName,
                    customer: customer,
                    shift2: shift2,
                    jCId: jcId,
                    machId: machineId,
                    date: date,
                    itemId: isSelectedData?.itemId,
                    operationId: operationId,
                    qty: totalQty,
                    process: operation,
                    status: status
                }}
            />
        </div>
    );
};

export default InwardQualityFPIResult;
