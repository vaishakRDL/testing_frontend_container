import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    Menu,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    CircularProgress,
    Typography,
    Box,
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import AssemblyInspectionTitle from "./AssemblyInspectionTitle";
import {
    GetItemVsProcessItem,
    ProcessInspecGetMachine,
    ScrapMstGetThickness,
    GetAssemblyContractNo,
    GetAssemblyTableData,
    GetAssemblyDateChange,
    GetAssemblyPlanningFIM,
    GetAssemblyPlanInspection
} from "../../ApiService/LoginPageService";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProcessInspectImage from "../ProcessInspection/ProcessInspectImage";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PDFViewer from "../../Utility/PDFViiewer";
import { NpdDocDownload } from "../../ApiService/DownloadCsvReportsService";
import InProcessFPIResult from "../InProcessFPI/InProcessFPIResult";
import ProcessInspectionChild from "../ProcessInspection/ProcessInspectionChild";
import AssemblyFPIResult from "./AssemblyFPI/AssemblyFPIResult";
import { useMemo } from "react";
import MultiFileViewer from "../ProcessInspection/MultiFileViewer";
import "./Assembly.css";
import { useModuleLocks } from "../context/ModuleLockContext";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const AssemblyInspection = () => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Process Inspection")?.lockStatus === "locked";
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 100
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editeData, setEditeData] = useState([]);
    const [isLoading, setGridLoading] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: "error",
        message: "",
    });
    const [itemList, setItemList] = useState([]);
    //////////////////////////////////////////
    const [machineName, setMachineName] = useState("");
    const [fromData, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [rowsData, setRowsData] = useState([]);
    const [isProcessInsp, setIsProcessInsp] = useState(0);
    const [isSelectedData, setIsSelectedData] = useState([]);
    const [isSelectedChildData, setIsSelectedChildData] = useState([]);

    const [anchorEl, setAnchorEl] = useState(null);
    const [openOption, setOpenOption] = useState(false);
    const [machineIdList, setMachineIdList] = useState([]);
    const [selectedOptionName, setSelectedOptionName] = useState("");

    const [openImg, setOpenImg] = useState(false);
    const [pdfOpen, setPdfOpen] = useState(false);
    const [fileTypeForView, setFileTypeForView] = useState("");

    const [isChild, setIsChild] = useState(0);

    const [thicknessList, setThicknessList] = useState([]);
    const [selectedThickness, setSelectedThickness] = useState('None');

    // SCROLL
    const [selectedRowId, setSelectedRowId] = useState('');
    const apiRef = useGridApiRef();
    const [highlightedRowId, setHighlightedRowId] = useState(null);

    const today = new Date();

    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;

    //ASSEMBLY INSPECTION
    const [orderNumberLists, setOrderNumberLists] = useState([]);
    const [contractNumberLists, setContractNumberLists] = useState([]);
    const [selectedContractNumber, setSelectedContractNumber] = useState('');
    const [selectedContractId, setSelectedContractId] = useState('');
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [selectedRowItemId, setSelectedRowItemId] = useState('')
    const [kanDate, setKanBanDate] = useState('');
    const [sobIds, setSobIds] = useState([]);
    const [assemblyPlanningList, setAssemblyPlanningList] = useState([])
    const [assemblyPlanningColumn, setAssemblyPlanningColumn] = useState([])
    const [rowContract, setRowContract] = useState([]);
    const [pageRefresher, setPageRefresher] = useState(false);
    const [contractRadioChange, setContractRadioChange] = useState('assemblyPlan')
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [selectedRowItemCode, setSelectedRowItemCode] = useState('');
    const [optionsRowData, setOptionsRowData] = useState('')
    const [selectedQty, setSelectedQty] = useState(null);

    const handleClickOption = (event, params) => {
        setAnchorEl(event.currentTarget);
        setIsSelectedData(params.row);
        setOpenOption(true);
    };

    const handleCloseOption = () => {
        setAnchorEl(null);
        setOpenOption(false);
    };

    const columns2 = [
        {
            field: "sNo",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    SNO
                </span>
            ),
            type: "string",
            sortable: true,
            width: 200,
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
            width: 120,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "contractNo",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Contract No
                </span>
            ),
            type: "number",
            sortable: true,
            width: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "partNo",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Item Code</span>
            ),
            type: "string",
            sortable: true,
            width: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "Qty",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Qty
                </span>
            ),
            type: "number",
            sortable: true,
            width: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "inspectionType",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Inspection Type
                </span>
            ),
            type: "number",
            sortable: true,
            width: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "boxNo",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Cell
                </span>
            ),
            type: "number",
            sortable: true,
            width: 200,
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
            width: 200,
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
                                onClick={(event) => {
                                    handleClickOption(event, params)
                                    setSelectedRowId(params.row.id)
                                    setSelectedRowItemId(params.row.itemId)
                                }}
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
                                        minWidth: "150px",
                                    }}
                                    onClick={() => {
                                        setIsProcessInsp(1);
                                        setOpenOption(false);
                                        setSelectedOptionName("FPI");
                                        setSelectedRowId(params.row.id);
                                        console.log("isProcessInsp------->>>>>>>:", params.row.id);
                                    }}
                                >
                                    FPI
                                </MenuItem>
                                <MenuItem
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        minWidth: "150px",
                                    }}
                                    onClick={() => {
                                        setIsProcessInsp(2);
                                        setOpenOption(false);
                                        setSelectedOptionName("Observation");
                                        setSelectedRowId(params.row.id);
                                    }}
                                >
                                    Observation
                                </MenuItem>
                                <MenuItem
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        minWidth: "150px",
                                    }}
                                    onClick={() => {
                                        setIsProcessInsp(3);
                                        setOpenOption(false);
                                        setSelectedOptionName("LPI");
                                        setSelectedRowId(params.row.id);
                                    }}
                                >
                                    LPI
                                </MenuItem>
                                <MenuItem
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                        minWidth: "150px",
                                    }}
                                    onClick={() => {
                                        setIsProcessInsp(4);
                                        setOpenOption(false);
                                        setSelectedOptionName("Rework");
                                        setSelectedRowId(params.row.id);
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
            flex: 1,
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Images</span>
            ),
            cellClassName: "actions",
            disableClickEventBubbling: true,
            getActions: (params) => [<ViewdData selectedRow={params.row} />],
        },

    ];

    function ViewdData(props) {
        return (
            <RemoveRedEyeIcon
                onClick={() => {
                    const fileName = props?.selectedRow?.npdFile;
                    const fileExtension = fileName?.split(".").pop().toLowerCase();
                    console.log("fileExtension===>", fileExtension);
                    if (fileExtension === "xlsx" || fileExtension === "tif") {
                        NpdDocDownload(
                            {
                                id: props.selectedRow.itemId,
                                fileExtension: fileExtension !== "xlsx" ? "tif" : "xlsx",
                            },
                            DownloadSuccess,
                            DownloadException
                        );
                    } else {
                        setPdfOpen(true);
                        setFileTypeForView(props.selectedRow.npdFile);
                    }
                }}
                style={{ color: "#002D68" }}
            />
        );
    }

    const DownloadSuccess = () => { };

    const DownloadException = () => { };

    useEffect(() => {
        GetItemVsProcessItem(
            handleItemVsProcessItemSucessShow,
            handleItemVsProcessItemExceptionShow
        );
        ProcessInspecGetMachine(
            handleProcessInspecGetMachineSuccess,
            handleProcessInspecGetMachineException
        );
        ScrapMstGetThickness(
            handleThicknessSuccess,
            handleThicknessException
        );
    }, [refreshData]);

    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };

        // Add event listener to update height on resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleThicknessSuccess = (dataObject) => {
        setThicknessList(dataObject.data);
    }
    const handleThicknessException = () => { }

    const handleProcessInspecGetMachineSuccess = (dataObject) => {
        setMachineIdList(dataObject?.data || []);
        console.log("handleProjectShow", dataObject?.data)
    };

    const handleProcessInspecGetMachineException = () => { };

    // GET ITEM DROPDOWN
    const handleItemVsProcessItemSucessShow = (dataObject) => {
        setItemList(dataObject?.data || []);
    };
    const handleItemVsProcessItemExceptionShow = (
        errorObject,
        errorMessage
    ) => { };

    // GET PROCESS DATAGRID PROCESS

    const handleClose = () => {
        setNotification({
            status: false,
            type: "",
            message: "",
        });
    };

    const jobcardhandleSuccess = (dataObject) => {
        // Store dataObject in local storage
        setLoading(false);
        setGridLoading(false);
        localStorage.setItem("dataObject", JSON.stringify(dataObject));

        // Store the API name 'Addjobcardno' in local storage
        localStorage.setItem("apiName", "Addjobcardno");

        setRowsData(dataObject?.data || []);

        setNotification({
            status: true,
            type: "success",
            message: dataObject.message,
        });
        setTimeout(() => {
            // ClearData();
            handleClose();
        }, 2000);
    };

    const jobcardhandleException = (errorObject, errorMessage) => {
        setGridLoading(false);
        setLoading(false);

        localStorage.setItem("errorMessage", JSON.stringify(errorMessage));
        setNotification({
            status: true,
            type: "error",
            message: errorMessage,
        });
        setTimeout(() => { }, 2000);

        // Retrieve errorMessage from local storage
        const storedErrorMessage = localStorage.getItem("errorMessage");
        const retrievedErrorMessage = storedErrorMessage
            ? JSON.parse(storedErrorMessage)
            : null;
    };


    const scrollToRow = (rowId) => {
        if (rowId && apiRef.current) {
            try {
                // Get row index by looking it up in current rows
                const allRows = apiRef.current.getRowModels();
                const rowIndex = Array.from(allRows.keys()).indexOf(rowId);

                if (rowIndex !== -1) {
                    apiRef.current.scrollToIndexes({ rowIndex });
                    apiRef.current.setRowSelectionModel([rowId]); // optional highlight
                }
            } catch (e) {
                console.error("scrollToRow error:", e);
            }
        }
    };

    // HANDLE GET ORDER NO
    const handleAssemblyOrderSuccess = (dataObject) => {
        setOrderNumberLists(dataObject.data || [])
        const sobArray = dataObject.data || [];
        const newArray = sobArray.map((data) => data.sobMstId)
        setSobIds(newArray)
    }
    const handleAssemblyOrderException = () => { }

    //HANDLE CONTRACT NUMBER
    const handleChangeContract = (e) => {
        GetAssemblyContractNo({ code: e.target.value, sob: sobIds }, handleContractSucessShow, handleContractExceptionShow);
    }

    const handleContractSucessShow = (dataObject) => {
        setContractNumberLists(dataObject?.data || []);
    }
    const handleContractExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSupplierSelect = (selectedValue) => {
        if (selectedValue !== null) {
            console.log("selectedValueselectedValueselectedValue", selectedValue)
            setSelectedContractNumber(selectedValue?.contract)
            setSelectedContractId(selectedValue?.id)
        }
    }
    ///////////////////////////////////////////////////////
    const [fimLists, setFimLists] = useState([]);
    const [selectedFim, setSelectedFim] = useState('');

    useEffect(() => {
        if (contractRadioChange === 'assemblyPlan') {
            GetAssemblyPlanningFIM(
                handleGetFimSuccess,
                handleGetFimException
            )
        }
    }, [contractRadioChange]);

    const handleGetFimSuccess = (dataObject) => {
        setFimLists(dataObject?.data || [])
    }
    const handleGetFimException = () => { }

    ////////////////////////////////////////////////// ASSEMBLY PLAN HANDLER\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    // Menu state management
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    // Menu handlers
    const handleClickOptions = (event, params) => {
        console.log("params========>", params);
        setOptionsRowData(params?.row)
        setSelectedRowItemCode(params?.row?.itemCode);
        setMenuAnchorEl(event?.currentTarget);
        setSelectedRowId(params?.row?.id);
        setSelectedRowItemId(params?.row?.itemId);
        //FETCH WHERE ONLY VALUE IS ===0
        const excludedKeys = ["id", "itemCode", "category", "itemId", "totQty", "sNo"];
        const itemCodesWithOne = Object.entries(params?.row)
            .filter(([key, value]) => !excludedKeys.includes(key) && value > 0)
            .map(([key]) => key);

        setRowContract(itemCodesWithOne)
    };

    const handleCloseOptions = () => {
        setMenuAnchorEl(null);
    };

    const handleRowCellClick = (params, event) => {
        // 🚫 ignore action columns
        if (params.field === "actions" || params.field === "actions3") return;

        const row = { ...params.row };
        const type = row.inspectionType?.toLowerCase();
        if (type !== "complete") return;

        // 🔥 get REAL clicked cell element
        const cellEl = event.target.closest("[data-field]");
        if (!cellEl) return;

        const clickedField = cellEl.getAttribute("data-field");

        const excludedKeys = [
            "id",
            "itemCode",
            "category",
            "itemId",
            "statusDisplay",
            "totQty",
            "sNo",
            "inspectionType",
            "boxNo",
        ];
        if (excludedKeys.includes(clickedField)) return;

        const qty = Number(row[clickedField]);
        if (!qty || qty <= 0) return;

        // ✅ SET STATE (single source of truth)
        setOptionsRowData(row);
        setSelectedRowId(row.id);
        setSelectedRowItemId(row.itemId);
        setSelectedRowItemCode(row.itemCode);

        setRowContract([clickedField]); // ✅ EXACT contract
        setSelectedQty(qty);            // ✅ EXACT qty

        // ✅ anchor menu to actual cell
        setMenuAnchorEl(cellEl);
    };






    // const handleMenuItemClick = (inspType, optionName) => {
    //     const row = optionsRowData;
    //     const type = row.inspectionType?.toLowerCase();

    //     // =========================
    //     // CASE 1️⃣ : COMPLETE (use new logic)
    //     // =========================
    //     if (type === "complete") {

    //         const excludedKeys = ["id", "itemCode", "category", "itemId", "statusDisplay", "totQty", "sNo"];
    //         const qtyKeys = Object.keys(row)
    //             .filter(key => !excludedKeys.includes(key) && row[key] !== "" && row[key] !== null);

    //         const status = row.statusDisplay || {};

    //         const yellow = qtyKeys.find(key => status[key] === "Y");
    //         if (yellow) {
    //             row.selectedSampleKey = yellow;
    //             row.selectedQty = row[yellow];
    //         } else {
    //             const greenKeys = qtyKeys.filter(key => status[key] === "G");
    //             if (greenKeys.length > 0) {
    //                 const lastGreen = greenKeys[greenKeys.length - 1];
    //                 row.selectedSampleKey = lastGreen;
    //                 row.selectedQty = row[lastGreen];
    //             } else {
    //                 const redKeys = qtyKeys.filter(key => status[key] === "R");
    //                 if (redKeys.length > 0) {
    //                     const firstRed = redKeys[0];
    //                     row.selectedSampleKey = firstRed;
    //                     row.selectedQty = row[firstRed];
    //                 } else {
    //                     row.selectedSampleKey = null;
    //                     row.selectedQty = row.totQty;
    //                 }
    //             }
    //         }

    //         // 👇 Only one contract for COMPLETE
    //         setRowContract([row.selectedSampleKey]);
    //         setSelectedQty(row.selectedQty);
    //     }

    //     // =========================
    //     // CASE 2️⃣ : SAMPLE BASED (FULL QTY)
    //     // =========================
    //     else if (type === "sample based") {
    //         row.selectedSampleKey = null;
    //         row.selectedQty = row.totQty;

    //         // 👇 Keep full contract list
    //         setRowContract(rowContract);
    //         setSelectedQty(row.totQty);
    //     }

    //     // =========================
    //     // CASE 3️⃣ : NORMAL
    //     // =========================
    //     else {
    //         row.selectedSampleKey = null;
    //         row.selectedQty = row.totQty;
    //         setRowContract(rowContract);
    //         setSelectedQty(row.totQty);
    //     }

    //     setIsProcessInsp(inspType);
    //     setSelectedOptionName(optionName);
    //     handleCloseOption();
    //     handleCloseOptions();
    // };
    const handleMenuItemClick = (inspType, optionName) => {
        const row = optionsRowData;
        const type = row.inspectionType?.toLowerCase();

        // =========================
        // CASE 1️⃣ : COMPLETE
        // =========================
        if (type === "complete") {

            // ✅ IF user already selected a column by clicking cell
            if (rowContract && rowContract.length > 0) {
                // 👉 DO NOT override anything
                // qty already set correctly in cell click
            }
            // ❗ ELSE fallback to old logic (NO BREAK)
            else {
                const excludedKeys = [
                    "id",
                    "itemCode",
                    "category",
                    "itemId",
                    "statusDisplay",
                    "totQty",
                    "sNo"
                ];

                const qtyKeys = Object.keys(row)
                    .filter(
                        key =>
                            !excludedKeys.includes(key) &&
                            row[key] !== "" &&
                            row[key] !== null
                    );

                const status = row.statusDisplay || {};

                const yellow = qtyKeys.find(key => status[key] === "Y");
                if (yellow) {
                    row.selectedSampleKey = yellow;
                    row.selectedQty = row[yellow];
                } else {
                    const greenKeys = qtyKeys.filter(key => status[key] === "G");
                    if (greenKeys.length > 0) {
                        const lastGreen = greenKeys[greenKeys.length - 1];
                        row.selectedSampleKey = lastGreen;
                        row.selectedQty = row[lastGreen];
                    } else {
                        const redKeys = qtyKeys.filter(key => status[key] === "R");
                        if (redKeys.length > 0) {
                            const firstRed = redKeys[0];
                            row.selectedSampleKey = firstRed;
                            row.selectedQty = row[firstRed];
                        } else {
                            row.selectedSampleKey = null;
                            row.selectedQty = row.totQty;
                        }
                    }
                }

                // 👇 OLD behavior preserved
                setRowContract([row.selectedSampleKey]);
                setSelectedQty(row.selectedQty);
            }
        }

        // =========================
        // CASE 2️⃣ : SAMPLE BASED
        // =========================
        else if (type === "sample based") {
            row.selectedSampleKey = null;
            row.selectedQty = row.totQty;
            setRowContract(rowContract); // unchanged
            setSelectedQty(row.totQty);
        }

        // =========================
        // CASE 3️⃣ : NORMAL
        // =========================
        else {
            row.selectedSampleKey = null;
            row.selectedQty = row.totQty;
            setRowContract(rowContract); // unchanged
            setSelectedQty(row.totQty);
        }

        setIsProcessInsp(inspType);
        setSelectedOptionName(optionName);
        handleCloseOption();
        handleCloseOptions();
    };



    // Static action columns
    const mergeActions = useMemo(() => [
        {
            field: "actions",
            type: "actions",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
            ),
            width: 200,
            renderCell: (params) => {
                const excludedItemCodes = ['Duty', 'Stop', 'Type', 'PoNo'];

                if (excludedItemCodes.includes(params.row.itemCode)) {
                    return null;
                }

                return (
                    <Button
                        id={`demo-positioned-button-${params.row.id}`}
                        aria-controls={Boolean(menuAnchorEl) ? "demo-positioned-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={Boolean(menuAnchorEl) ? "true" : undefined}
                        onClick={(event) => handleClickOptions(event, params)}
                        disabled={isModuleLocked}
                    >
                        <span style={{ fontWeight: "bold", fontSize: "14px", minWidth: "250px" }}>
                            Options
                        </span>
                    </Button>
                );
            },
        },
        {
            field: "actions3",
            type: "actions",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Images</span>
            ),
            cellClassName: "actions",
            disableClickEventBubbling: true,
            getActions: (params) => {
                const excludedItemCodes = ['Duty', 'Stop', 'Type', 'PoNo'];

                if (excludedItemCodes.includes(params.row.itemCode)) {
                    return []; // No actions shown
                }

                return [
                    <ViewdFile key={`view-data-${params.row.id}`} selectedRow={params.row} />
                ];
            },
        }
    ], [menuAnchorEl]);

    function ViewdFile(props) {
        return (
            <RemoveRedEyeIcon
                onClick={() => {
                    setPdfModalOpen(true);
                    setSelectedRowItemCode(props?.selectedRow?.itemCode);
                    // }
                }}
                style={{ color: "#002D68" }}
            />
        );
    }


    // const assemblyPlanSuccess = (dataObject) => {
    //     setLoading(false);
    //     setGridLoading(false);
    //     setAssemblyPlanningList(dataObject?.data || []);
    //     // DYNAMICALLY CREATE HEADER USING ARRAY KEY
    //     const headerNameMapping = {
    //         id: 'S.No',
    //         itemcode: 'Item Code',
    //         cycletime: 'Cycle Time',
    //         totqty: 'Total Quantity',
    //         totalcycletime: 'Total Cycle Time',
    //     };

    //     const dynamicColumn = Object.keys(dataObject?.data?.length > 0 ? dataObject.data[0] : {})
    //         .filter((key) => key.toLowerCase() !== 'id' && key.toLowerCase() !== 'itemid' && key.toLowerCase() !== 'statusdisplay')
    //         .map((key) => ({
    //             field: key,
    //             headerName: key,
    //             type: 'string',
    //             minWidth: 100,
    //             align: 'center',
    //             headerAlign: 'center',
    //             renderHeader: () => (
    //                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                     {headerNameMapping[key.toLowerCase()] || key}
    //                 </span>
    //             ),

    //             cellClassName: (params) => {
    //                 const status = params.row.statusDisplay?.[key];

    //                 if (status === "R") return "cell-red";
    //                 if (status === "Y") return "cell-yellow";
    //                 if (status === "G") return "cell-green";

    //                 return "";
    //             },

    //         }));
    //     setAssemblyPlanningColumn([...dynamicColumn, ...mergeActions]);
    // };
    /////old//////
    const assemblyPlanSuccess = (dataObject) => {
        setLoading(false);
        setGridLoading(false);
        setAssemblyPlanningList(dataObject?.data || []);

        const headerNameMapping = {
            id: "S.No",
            itemcode: "Item Code",
            cycletime: "Cycle Time",
            totqty: "Total Quantity",
            totalcycletime: "Total Cycle Time",
        };

        const dynamicColumn = Object.keys(
            dataObject?.data?.length > 0 ? dataObject.data[0] : {}
        )
            .filter(
                (key) =>
                    key.toLowerCase() !== "id" &&
                    key.toLowerCase() !== "itemid" &&
                    key.toLowerCase() !== "statusdisplay"
            )
            .map((key) => ({
                field: key,
                headerName: key,
                type: "string",
                minWidth: 120,
                align: "center",
                headerAlign: "center",

                renderHeader: () => (
                    <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                        {headerNameMapping[key.toLowerCase()] || key}
                    </span>
                ),

                // 🔥 CRITICAL FIX
                // renderCell: (params) => (
                //     <div
                //         data-field={key}   // 👈 THIS fixes wrong column selection
                //         style={{ width: "100%", textAlign: "center" }}
                //     >
                //         {params.value}
                //     </div>
                // ),
                renderCell: (params) => (
                    <div
                        data-field={key}
                        title={params.value ?? ""}   // 👈 THIS enables hover text
                        style={{
                            width: "100%",
                            textAlign: "center",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {params.value}
                    </div>
                ),

                cellClassName: (params) => {
                    const status = params.row.statusDisplay?.[key];
                    if (status === "R") return "cell-red";
                    if (status === "Y") return "cell-yellow";
                    if (status === "G") return "cell-green";
                    return "";
                },
            }));

        setAssemblyPlanningColumn([...dynamicColumn, ...mergeActions]);
    };
    ///old end/////


    const assemblyPlanException = (errorObject, errorMessage) => {
        setLoading(false);

    }
    // DATAGRID FREEZ AND SCROLL BOTH TABALE AT A TIME
    const leftColumns = assemblyPlanningColumn.slice(0, 4);
    const rightColumns = assemblyPlanningColumn.slice(4);

    const leftGridRef = useRef(null);
    const rightGridRef = useRef(null);
    let isSyncingScroll = false;

    const syncScroll = (source) => {
        if (isSyncingScroll) return;
        isSyncingScroll = true;

        const leftBody = leftGridRef.current?.querySelector('.MuiDataGrid-virtualScroller');
        const rightBody = rightGridRef.current?.querySelector('.MuiDataGrid-virtualScroller');

        if (source === 'left' && rightBody && leftBody) {
            rightBody.scrollTop = leftBody.scrollTop;
        } else if (source === 'right' && rightBody && leftBody) {
            leftBody.scrollTop = rightBody.scrollTop;
        }

        isSyncingScroll = false;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const leftBody = leftGridRef.current?.querySelector('.MuiDataGrid-virtualScroller');
            const rightBody = rightGridRef.current?.querySelector('.MuiDataGrid-virtualScroller');

            if (leftBody && rightBody) {
                const onLeftScroll = () => syncScroll('left');
                const onRightScroll = () => syncScroll('right');

                leftBody.addEventListener('scroll', onLeftScroll);
                rightBody.addEventListener('scroll', onRightScroll);

                clearInterval(interval); // attach once and stop polling

                return () => {
                    leftBody.removeEventListener('scroll', onLeftScroll);
                    rightBody.removeEventListener('scroll', onRightScroll);
                };
            }
        }, 100);

        return () => clearInterval(interval);
    }, [leftColumns, rightColumns]);


    useEffect(() => {
        kanDate && GetAssemblyPlanInspection(
            {
                kanbanDate: kanDate,
                fim: selectedFim
            },

            assemblyPlanSuccess,
            assemblyPlanException
        );
    }, [pageRefresher])

    return (
        <div style={{ height: "60vh", width: "100%" }}>
            {isProcessInsp === 0 ? (
                <>
                    <FormControl style={{ marginLeft: '15px', borderBottom: '1px dotted gray' }}>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={contractRadioChange}
                            onChange={(e) => setContractRadioChange(e.target.value)}
                        >
                            <FormControlLabel value="assemblyPlan" control={<Radio />} label="Assembly Plan" />
                            <FormControlLabel value="contract" control={<Radio />} label="Contract" />
                        </RadioGroup>
                    </FormControl>

                    {contractRadioChange === 'assemblyPlan' &&
                        <Grid
                            container
                            spacing={2}
                            padding={2}
                            style={{ marginTop: "-35px" }}
                        >
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={3}
                                lg={3}
                                xl={3}
                                style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}
                            >
                                <AssemblyInspectionTitle
                                    setIsAddButton={setIsAddButton}
                                    setEditeData={setEditeData}
                                    setOpen={setOpen}
                                    contractRadioChange={contractRadioChange}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={1.5}
                                lg={1.5}
                                xl={1.5}
                                style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}
                            >
                                <TextField
                                    fullWidth
                                    label="Kanban Date"
                                    placeholder="Kanban Date"
                                    variant="outlined"
                                    required
                                    type="Date"
                                    size="small"
                                    style={{ borderRadius: "5px" }}
                                    value={kanDate}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) => {
                                        setKanBanDate(e.target.value)
                                        GetAssemblyDateChange({ date: e.target.value }, handleAssemblyOrderSuccess, handleAssemblyOrderException)
                                    }}
                                />
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={1.5}
                                lg={1.5}
                                xl={1.5}
                                style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}
                            >
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">FIM</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedFim}
                                        label="FIM"
                                        size="small"
                                        onChange={(e) => setSelectedFim(e.target.value)}
                                    >{
                                            fimLists.map((data) => (
                                                <MenuItem value={data.name}>{data.name}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={1.5}
                                lg={1.5}
                                xl={1.5}
                                style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}
                            >
                                <Button
                                    variant="contained"
                                    style={{
                                        width: "250px",
                                        height: "40px",
                                        background: "#002D68",
                                        color: "white",
                                    }}
                                    disabled={loading}
                                    onClick={() => {
                                        setGridLoading(true);
                                        setLoading(true)
                                        GetAssemblyPlanInspection(
                                            {
                                                kanbanDate: kanDate,
                                                fim: selectedFim
                                            },

                                            assemblyPlanSuccess,
                                            assemblyPlanException
                                        );
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} style={{ color: 'white' }} />
                                    ) : (
                                        "Submit"
                                    )}
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <div style={{ display: "flex", justifyContent: "space-around" }}>
                                    <Card
                                        style={{
                                            boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                                            borderRadius: "10px",
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    >
                                        <CardContent style={{ height: screenHeight - 350, overflow: 'auto' }}>
                                            <Box sx={{ display: "flex", overflow: "hidden", width: "100%" }}>

                                                {/* LEFT GRID */}
                                                <Box sx={{ width: 500 }} ref={leftGridRef}>
                                                    <DataGrid
                                                        rows={assemblyPlanningList}
                                                        columns={leftColumns}

                                                        pagination
                                                        paginationModel={paginationModel}
                                                        onPaginationModelChange={(model) => setPaginationModel(model)}

                                                        rowHeight={40}
                                                        columnHeaderHeight={40}
                                                        disableColumnMenu
                                                        disableColumnReorder
                                                        disableColumnResize
                                                        checkboxSelection={false}

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
                                                            "& .MuiDataGrid-columnHeaders": {
                                                                backgroundColor: "#93bce6",
                                                                color: "black",
                                                                fontWeight: "bold",
                                                                fontSize: "15px",
                                                            },
                                                            height: screenHeight - 390,

                                                            "& .MuiDataGrid-virtualScroller": {
                                                                overflow: "hidden !important",
                                                            },
                                                            "& .MuiDataGrid-main": {
                                                                overflow: "hidden !important",
                                                            },
                                                        }}

                                                        getRowClassName={(params) => {
                                                            const status = params.row.statusDisplay;

                                                            if (status === "R") return "MuiDataGrid-cell--red";
                                                            if (status === "G") return "MuiDataGrid-cell--green";
                                                            if (status === "Y") return "MuiDataGrid-cell--yellow";

                                                            const rowIndex = assemblyPlanningList.findIndex(
                                                                (row) => row.id === params.row.id
                                                            );

                                                            if (rowIndex !== -1) {
                                                                return rowIndex % 2 === 0 ? "Mui-evenRow" : "Mui-oddRow";
                                                            }

                                                            return "";
                                                        }}
                                                    />
                                                </Box>

                                                {/* RIGHT GRID */}
                                                <Box
                                                    sx={{
                                                        flexGrow: 1,
                                                        overflow: "auto",
                                                    }}
                                                    onScroll={syncScroll}
                                                    ref={rightGridRef}
                                                >
                                                    <DataGrid
                                                        rows={assemblyPlanningList}
                                                        columns={rightColumns}

                                                        pagination
                                                        paginationModel={paginationModel}
                                                        onPaginationModelChange={(model) => setPaginationModel(model)}

                                                        rowHeight={40}
                                                        columnHeaderHeight={40}
                                                        disableColumnMenu
                                                        disableColumnReorder
                                                        disableColumnResize
                                                        checkboxSelection={false}
                                                        onCellClick={handleRowCellClick}

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
                                                            "& .MuiDataGrid-columnHeaders": {
                                                                backgroundColor: "#93bce6",
                                                                color: "black",
                                                                fontWeight: "bold",
                                                                fontSize: "15px",
                                                            },

                                                            height: screenHeight - 390,
                                                        }}

                                                        getRowClassName={(params) => {
                                                            const status = params.row.statusDisplay;

                                                            if (status === "R") return "MuiDataGrid-cell--red";
                                                            if (status === "G") return "MuiDataGrid-cell--green";
                                                            if (status === "Y") return "MuiDataGrid-cell--yellow";

                                                            const rowIndex = assemblyPlanningList.findIndex(
                                                                (row) => row.id === params.row.id
                                                            );

                                                            if (rowIndex !== -1) {
                                                                return rowIndex % 2 === 0 ? "Mui-evenRow" : "Mui-oddRow";
                                                            }

                                                            return "";
                                                        }}
                                                    />
                                                </Box>

                                            </Box>
                                        </CardContent>

                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft: "50px" }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', columnGap: '50px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                                                    <div
                                                        style={{ width: '20px', height: '20px', backgroundColor: '#8be78b', cursor: 'pointer' }}
                                                    ></div>
                                                    <Typography>Completed</Typography>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                                                    <div style={{ width: '20px', height: '20px', backgroundColor: '#f7e2a0', cursor: 'pointer' }} ></div>
                                                    <Typography>Pending</Typography>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                                                    <div style={{ width: '20px', height: '20px', backgroundColor: '#FFA7A7', cursor: 'pointer' }} ></div>
                                                    <Typography>Incomplete</Typography>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </Grid>

                        </Grid>
                    }
                    {contractRadioChange === 'contract' &&
                        <Grid
                            container
                            spacing={2}
                            padding={2}
                            style={{ marginTop: "-35px" }}
                        >
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={3}
                                lg={3}
                                xl={3}
                                style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}
                            >
                                <AssemblyInspectionTitle
                                    setIsAddButton={setIsAddButton}
                                    setEditeData={setEditeData}
                                    setOpen={setOpen}
                                    contractRadioChange={contractRadioChange}
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={1.5}
                                lg={1.5}
                                xl={1.5}
                                style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}
                            >
                                <TextField
                                    fullWidth
                                    label="Kanban Date"
                                    placeholder="Kanban Date"
                                    variant="outlined"
                                    required
                                    type="Date"
                                    size="small"
                                    style={{ borderRadius: "5px" }}
                                    value={kanDate}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) => {
                                        setKanBanDate(e.target.value)
                                        GetAssemblyDateChange({ date: e.target.value }, handleAssemblyOrderSuccess, handleAssemblyOrderException)
                                    }}
                                />
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={1.5}
                                lg={1.5}
                                xl={1.5}
                                style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}
                            >
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={contractNumberLists}
                                    fullWidth
                                    value={selectedContractNumber}
                                    getOptionLabel={(option) => option.contract || selectedContractNumber}
                                    renderInput={(params) => <TextField {...params} label="Contract Number" onChange={handleChangeContract} />}
                                    onChange={(event, value) => handleSupplierSelect(value)}
                                    size="small"
                                    style={{ borderRadius: '5px' }}
                                    required
                                />
                            </Grid>


                            <Grid
                                item
                                xs={12}
                                sm={12}
                                md={1.5}
                                lg={1.5}
                                xl={1.5}
                                style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}
                            >
                                <Button
                                    variant="contained"
                                    style={{
                                        width: "250px",
                                        height: "40px",
                                        background: "#002D68",
                                        color: "white",
                                    }}
                                    disabled={loading}
                                    onClick={() => {
                                        setGridLoading(true);
                                        setLoading(true);
                                        GetAssemblyTableData(
                                            {
                                                contractNo: selectedContractNumber,
                                                id: selectedContractId
                                            },

                                            jobcardhandleSuccess,
                                            jobcardhandleException
                                        );
                                    }}
                                >

                                    {loading ? (
                                        <CircularProgress size={24} style={{ color: 'white' }} />
                                    ) : (
                                        "Submit"
                                    )}
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: isProcessInsp === 0 ? "block" : "none" }}>
                                <div style={{ display: "flex", justifyContent: "space-around" }}>
                                    <Card
                                        style={{
                                            boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                                            borderRadius: "10px",
                                            width: "100%",
                                            height: "100%",
                                            display: isProcessInsp === 0 ? "block" : "none",
                                        }}
                                    >
                                        <CardContent>
                                            <DataGrid
                                                apiRef={apiRef}
                                                rows={rowsData}
                                                columns={columns2}
                                                loading={isLoading}
                                                hideFooterPagination={false}
                                                style={{
                                                    border: "none",
                                                    fontWeight: "bold",
                                                    // minWidth: '50%',
                                                    height: screenHeight - 380,
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


                                                    const status = params.row.statusDisplay;
                                                    if (status === "R") {
                                                        return "MuiDataGrid-cell--red";
                                                    }
                                                    if (status === "G") {
                                                        return "MuiDataGrid-cell--green";
                                                    }
                                                    if (status === "Y") {
                                                        return "MuiDataGrid-cell--yellow";
                                                    }
                                                    // // Find the index of the row within the rows array
                                                    const rowIndex = rowsData.findIndex(
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
                                        </CardContent>
                                    </Card>
                                </div>
                            </Grid>
                        </Grid>
                    }
                </>
            ) : isProcessInsp === 1 ? (
                <div style={{ display: isProcessInsp === 1 ? "block" : "none" }}>
                    <AssemblyFPIResult
                        key="fpi"
                        setIsProcessInsp={setIsProcessInsp}
                        isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
                        selectedOptionName={selectedOptionName}
                        selectedRowItemId={selectedRowItemId}
                        selectedMachineId={machineName}
                        isChild={isChild}
                        setIsChild={setIsChild}
                        scrollToRow={scrollToRow}
                        selectedRowId={selectedRowId}
                        // FOR ASSEMBLY PLAN
                        kanDate={kanDate}
                        selectedFim={selectedFim}
                        contractRadioChange={contractRadioChange}
                        rowContract={rowContract}
                        optionsRowData={optionsRowData}
                        selectedRowItemCode={selectedRowItemCode}
                        setPageRefresher={setPageRefresher}
                        selectedQty={selectedQty}     // 👈 new

                    />
                </div>
            ) : isProcessInsp === 2 ? (
                <div style={{ display: isProcessInsp === 2 ? "block" : "none" }}>
                    <AssemblyFPIResult
                        key="obs"
                        setIsProcessInsp={setIsProcessInsp}
                        isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
                        selectedOptionName={selectedOptionName}
                        selectedRowItemId={selectedRowItemId}
                        selectedMachineId={machineName}
                        isChild={isChild}
                        setIsChild={setIsChild}
                        scrollToRow={scrollToRow}
                        selectedRowId={selectedRowId}
                        // FOR ASSEMBLY PLAN
                        kanDate={kanDate}
                        selectedFim={selectedFim}
                        contractRadioChange={contractRadioChange}
                        rowContract={rowContract}
                        optionsRowData={optionsRowData}
                        selectedRowItemCode={selectedRowItemCode}
                        setPageRefresher={setPageRefresher}
                        selectedQty={selectedQty}     // 👈 new

                    />
                </div>
            ) : isProcessInsp === 3 ? (
                <div style={{ display: isProcessInsp === 3 ? "block" : "none" }}>
                    <AssemblyFPIResult
                        key="lpi"
                        setIsProcessInsp={setIsProcessInsp}
                        isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
                        selectedOptionName={selectedOptionName}
                        selectedRowItemId={selectedRowItemId}
                        selectedMachineId={machineName}
                        isChild={isChild}
                        setIsChild={setIsChild}
                        scrollToRow={scrollToRow}
                        selectedRowId={selectedRowId}
                        // FOR ASSEMBLY PLAN
                        kanDate={kanDate}
                        selectedFim={selectedFim}
                        contractRadioChange={contractRadioChange}
                        rowContract={rowContract}
                        optionsRowData={optionsRowData}
                        selectedRowItemCode={selectedRowItemCode}
                        setPageRefresher={setPageRefresher}
                    // selectedQty={selectedQty}     // 👈 new

                    />
                </div>
            ) : isProcessInsp === 4 ? (
                <div style={{ display: isProcessInsp === 4 ? "block" : "none" }}>
                    <AssemblyFPIResult
                        key="rework"
                        setIsProcessInsp={setIsProcessInsp}
                        isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
                        selectedOptionName={selectedOptionName}
                        selectedRowItemId={selectedRowItemId}
                        selectedMachineId={machineName}
                        isChild={isChild}
                        setIsChild={setIsChild}
                        scrollToRow={scrollToRow}
                        selectedRowId={selectedRowId}
                        // FOR ASSEMBLY PLAN
                        kanDate={kanDate}
                        selectedFim={selectedFim}
                        contractRadioChange={contractRadioChange}
                        rowContract={rowContract}
                        optionsRowData={optionsRowData}
                        selectedRowItemCode={selectedRowItemCode}
                        setPageRefresher={setPageRefresher}
                        selectedQty={selectedQty}     // 👈 new

                    />
                </div>
            ) : isProcessInsp === 5 ? (
                <div style={{ display: isProcessInsp === 5 ? "block" : "none" }}>
                    <ProcessInspectionChild
                        key="child"
                        setIsProcessInsp={setIsProcessInsp}
                        isSelectedData={isSelectedData}
                        setIsSelectedData={setIsSelectedData}
                        setIsSelectedChildData={setIsSelectedChildData}
                        setSelectedOptionName={setSelectedOptionName}
                        isProcessInsp={isProcessInsp}
                        fromData={fromData}
                        toDate={toDate}
                        machineName={machineName}
                        setFromDate={setFromDate}
                        setToDate={setToDate}
                        setIsChild={setIsChild}
                        setFileTypeForView={setFileTypeForView}
                        pdfOpen={pdfOpen}
                        setPdfOpen={setPdfOpen}
                        scrollToRow={scrollToRow}
                        selectedRowId={selectedRowId}
                    />
                </div>
            ) : (
                <></>
            )}
            <ProcessInspectImage
                openImg={openImg}
                setOpenImg={setOpenImg}
                isSelectedData={isSelectedData}
            />
            <PDFViewer
                pdfOpen={pdfOpen}
                setPdfOpen={setPdfOpen}
                fileTypeForView={fileTypeForView}
            />

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            {/* Menu component outside DataGrid */}
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleCloseOptions}
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
                    style={{ fontWeight: "bold", fontSize: "16px", minWidth: "150px" }}
                    onClick={() => handleMenuItemClick(1, "FPI")}
                >
                    FPI
                </MenuItem>
                <MenuItem
                    style={{ fontWeight: "bold", fontSize: "16px", minWidth: "150px" }}
                    onClick={() => handleMenuItemClick(2, "Observation")}
                >
                    Observation
                </MenuItem>
                <MenuItem
                    style={{ fontWeight: "bold", fontSize: "16px", minWidth: "150px" }}
                    onClick={() => handleMenuItemClick(3, "LPI")}
                >
                    LPI
                </MenuItem>
                <MenuItem
                    style={{ fontWeight: "bold", fontSize: "16px", minWidth: "150px" }}
                    onClick={() => handleMenuItemClick(4, "Rework")}
                >
                    Rework
                </MenuItem>
            </Menu>
            <MultiFileViewer
                pdfOpen={pdfModalOpen}
                setPdfOpen={setPdfModalOpen}
                fileTypeForView={fileTypeForView}
                selectedRowItemCode={selectedRowItemCode}
            />
        </div>

    );
};

export default AssemblyInspection;
