import React, { useState, useEffect, useLayoutEffect } from "react";
import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    Checkbox,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import SRNInspectionTtitle from "./SRNInspectionTtitle";
import {
    GetItemVsProcessItem,
    AddItemVsProcess,
    Addjobcardno,
    Processinspection,
    ProcessInspecSearchMachine,
    ProcessInspecGetMachine,
    ScrapMstGetThickness,
    GetAssemblyOrderNo,
    GetAssemblyContractNo,
    GetAssemblyTableData,
    GetAssemblyDateChange,
    GetAssemblyPlanningFIM,
    GetQualitySrnShowData
} from "../../ApiService/LoginPageService";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProcessInspectImage from "../ProcessInspection/ProcessInspectImage";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import PDFViewer from "../../Utility/PDFViiewer";
import { NpdDocDownload } from "../../ApiService/DownloadCsvReportsService";
import InProcessFPIResult from "../InProcessFPI/InProcessFPIResult";
import ProcessInspectionChild from "../ProcessInspection/ProcessInspectionChild";
import SRNFPIResult from "./SRNFpi/SRNFPIResult";
import PDFViewerFim from "../../Utility/PDFViewerFim";
import { useModuleLocks } from "../context/ModuleLockContext";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const SRNInspection = () => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Process Inspection")?.lockStatus === "locked";

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editeData, setEditeData] = useState([]);
    const [isLoading, setGridLoading] = useState(false);
    const [selectedRowItemCode, setSelectedRowItemCode] = useState("");

    const [openNotification, setNotification] = useState({
        status: false,
        type: "error",
        message: "",
    });
    const [itemList, setItemList] = useState([]);
    const [processList, setProcessList] = useState([]);

    //////////////////////////////////////////
    const [selectedItemId, setSelectedItemId] = useState("");
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [excelModal, setExcelModal] = useState(false);
    const [copyFromModal, setCopyFromModal] = useState(false);
    const [selectedValue, setSelectedValue] = React.useState("JOBCARD");
    const [jobcardno, setJobcardNo] = useState("");
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

    const [selectedStatus, setSelectedStatus] = useState('All');
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
    const [selectedOrderNumber, setSelectedOrderNumber] = useState('');
    const [selectedKanbanDate, setSelectedKanbanDate] = useState('');
    const [contractNumberLists, setContractNumberLists] = useState([]);
    const [selectedContractNumber, setSelectedContractNumber] = useState('');
    const [selectedContractId, setSelectedContractId] = useState('');
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [selectedRowItemId, setSelectedRowItemId] = useState('')
    const [poNodata, setPOnoData] = useState('')
    const [cellname, setCellName] = useState('')
    console.log("111`1`1", poNodata)
    const [kanDate, setKanBanDate] = useState('');
    const [sobIds, setSobIds] = useState([]);
    const [selectedFromDate, setSelectedFromDate] = useState('');
    const [selectedToDate, setSelectedToDate] = useState('');
    const [fimLists, setFimLists] = useState([]);
    const [selectedFim, setSelectedFim] = useState('');
    const [loading, setLoading] = useState(false);



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
            field: "date",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Date
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
            field: "refNo",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Refernce No
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
            field: "itemCode",
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
            field: "poNo",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>PO No</span>
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
            field: "shipmentDate",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Shipment Date
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
            field: "fim",
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
                                    setPOnoData(params.row.poNo)
                                    setCellName(params.row.fim)
                                }}
                                disabled={isModuleLocked}
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
        // {
        //     field: "actions2",
        //     type: "actions",
        //     headerClassName: "super-app-theme--header",
        //     headerName: (
        //         <span style={{ fontWeight: "bold", fontSize: "16px" }}>Child</span>
        //     ),
        //     width: 90,
        //     flex: 1,
        //     renderCell: (params) => [
        //         <div>
        //             <Button
        //                 onClick={() => {
        //                     setIsProcessInsp(5);
        //                     setIsSelectedData(params.row);
        //                     setSelectedRowId(params.row.id)
        //                 }}
        //             >
        //                 Child
        //             </Button>
        //         </div>,
        //     ],
        // }
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

    // function ViewdData(props) {
    //     return (
    //         <RemoveRedEyeIcon
    //             onClick={() => {
    //                 const fileName = props.selectedRow.npdFile;
    //                 const fileExtension = fileName.split(".").pop().toLowerCase();
    //                 console.log("fileExtension===>", fileExtension);
    //                 if (fileExtension === "xlsx" || fileExtension === "tif") {
    //                     NpdDocDownload(
    //                         {
    //                             id: props.selectedRow.itemId,
    //                             fileExtension: fileExtension !== "xlsx" ? "tif" : "xlsx",
    //                         },
    //                         DownloadSuccess,
    //                         DownloadException
    //                     );
    //                 } else {
    //                     setPdfOpen(true);
    //                     setFileTypeForView(props.selectedRow.npdFile);
    //                 }
    //             }}
    //             style={{ color: "#002D68" }}
    //         />
    //     );
    // }
    // function ViewdData(props) {
    //     const fileName = props.selectedRow?.npdFile;
    //     const hasFile = !!fileName; // true if not null/undefined/empty

    //     return (
    //         <RemoveRedEyeIcon
    //             onClick={() => {
    //                 if (!hasFile) return; // do nothing if no file

    //                 const fileExtension = fileName.split(".").pop().toLowerCase();
    //                 console.log("fileExtension===>", fileExtension);

    //                 if (fileExtension === "xlsx" || fileExtension === "tif") {
    //                     NpdDocDownload(
    //                         {
    //                             id: props.selectedRow.itemId,
    //                             fileExtension: fileExtension !== "xlsx" ? "tif" : "xlsx",
    //                         },
    //                         DownloadSuccess,
    //                         DownloadException
    //                     );
    //                 } else {
    //                     setPdfOpen(true);
    //                     setFileTypeForView(props.selectedRow.npdFile);
    //                 }
    //             }}
    //             style={{
    //                 color: hasFile ? "#002D68" : "#ccc", // grey out if no file
    //                 cursor: hasFile ? "pointer" : "not-allowed",
    //             }}
    //         />
    //     );
    // }
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


    const DownloadSuccess = () => { };

    const DownloadException = () => { };

    useEffect(() => {
        GetAssemblyPlanningFIM(
            handleGetFimSuccess,
            handleGetFimException
        )
    }, [refreshData]);

    const handleGetFimSuccess = (dataObject) => {
        setFimLists(dataObject?.data || [])
    }
    const handleGetFimException = () => { }

    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // GET PROCESS DATAGRID PROCESS
    const handleClose = () => {
        setNotification({
            status: false,
            type: "",
            message: "",
        });
    };

    const handleBlur = (e) => {
        const jobvcardnoValue = e.target.value.trim();
    };

    const jobcardhandleSuccess = (dataObject) => {
        setGridLoading(false);
        setLoading(false);
        setRowsData(dataObject?.data || []);
        setNotification({
            status: true,
            type: "success",
            message: dataObject.message,
        });
        setTimeout(() => {
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

    // SCROLL
    const scrollToRow = (rowId) => {
        setTimeout(() => {
            const rowIndex = rowsData.findIndex((row) => row.id === rowId);
            if (rowIndex !== -1) {
                apiRef.current.scrollToIndexes({ rowIndex });
                setHighlightedRowId(rowId); // Set the highlighted row
            }
        }, 500)
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

    return (
        <div style={{ height: "60vh", width: "100%" }}>
            {isProcessInsp === 0 ? (
                <>
                    <SRNInspectionTtitle
                        setIsAddButton={setIsAddButton}
                        setEditeData={setEditeData}
                        setOpen={setOpen}
                    />

                    <Grid
                        container
                        spacing={2}
                        padding={2}
                        style={{ marginTop: "-40px" }}
                    >
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={1.5}
                            lg={1.5}
                            xl={1.5}
                            style={{ display: "flex", flexDirection: "row" }}
                        >
                            <TextField
                                fullWidth
                                label="Shipment Date"
                                placeholder="Shipment Date"
                                variant="outlined"
                                required
                                type="Date"
                                size="small"
                                style={{ borderRadius: "5px" }}
                                value={selectedFromDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => {
                                    setSelectedFromDate(e.target.value)
                                }}
                            />
                        </Grid>
                        {/* <Grid
                            item
                            xs={12}
                            sm={12}
                            md={1.5}
                            lg={1.5}
                            xl={1.5}
                            style={{ display: "flex", flexDirection: "row" }}
                        >
                            <TextField
                                fullWidth
                                label="To Date"
                                placeholder="To Date"
                                variant="outlined"
                                required
                                type="Date"
                                size="small"
                                style={{ borderRadius: "5px" }}
                                value={selectedToDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => {
                                    setSelectedToDate(e.target.value)
                                    // GetAssemblyDateChange({ date: e.target.value }, handleAssemblyOrderSuccess, handleAssemblyOrderException)
                                }}
                            />
                        </Grid> */}

                        {/* <Grid
                            item
                            xs={12}
                            sm={12}
                            md={1.5}
                            lg={1.5}
                            xl={1.5}
                            style={{ display: "flex", flexDirection: "row" }}
                        >
                            <TextField
                                fullWidth
                                id="Date"
                                placeholder="Date"
                                type="date"
                                variant="outlined"
                                size="small"
                                style={{ color: "#000000" }}
                                value={toDate}
                                onChange={(e) => {
                                    setToDate(e.target.value);
                                    fromData && GetAssemblyOrderNo({ from: fromData, to: e.target.value }, handleAssemblyOrderSuccess, handleAssemblyOrderException)
                                }}
                            />
                        </Grid> */}

                        {/* <Grid
                            item
                            xs={12}
                            sm={12}
                            md={1.5}
                            lg={1.5}
                            xl={1.5}
                            style={{ display: "flex", flexDirection: "row" }}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">
                                    Assembly Order No
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    required
                                    size="small"
                                    value={selectedOrderNumber}
                                    onChange={(e) => {
                                        setSelectedOrderNumber(e.target.value)
                                        orderNumberLists.map((data) => {
                                            if (data.sobMstId === e.target.value) {
                                                setSelectedKanbanDate(data.kanbanDate)
                                            }
                                        })
                                    }}
                                    label="Assembly Order No"
                                >
                                    {orderNumberLists.map((data) => (
                                        <MenuItem key={data?.id} value={data?.sobMstId}>
                                            {data?.orderNo}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid> */}

                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={1.5}
                            lg={1.5}
                            xl={1.5}
                            style={{ display: "flex", flexDirection: "row" }}
                        >
                            {/* <Autocomplete
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
                            // disabled={isPOView ? true : false}
                            /> */}
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

                        {/* <Grid
                            item
                            xs={12}
                            sm={12}
                            md={1.5}
                            lg={1.5}
                            xl={1.5}
                            style={{ display: "flex", flexDirection: "row" }}
                        >
                            <Button
                                variant="contained"
                                style={{
                                    width: "250px",
                                    height: "40px",
                                    background: "#002D68",
                                    color: "white",
                                }}
                                onClick={() => {
                                    Addjobcardno(
                                        {
                                            jcNo: jobcardno,
                                            machineName: machineName,
                                            from: formattedDate,
                                            to: formattedDate,
                                        },

                                        jobcardhandleSuccess,
                                        jobcardhandleException
                                    );
                                }}
                            >
                                Today
                            </Button>
                        </Grid> */}

                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={1.5}
                            lg={1.5}
                            xl={1.5}
                            style={{ display: "flex", flexDirection: "row" }}
                        >
                            <Button
                                variant="contained"
                                style={{
                                    width: "250px",
                                    height: "40px",
                                    background: "#002D68",
                                    color: "white",
                                    /*marginLeft: "20px",*/
                                }}
                                disabled={loading}
                                onClick={() => {
                                    setGridLoading(true);
                                    setLoading(true);
                                    GetQualitySrnShowData(
                                        {
                                            date: selectedFromDate,
                                            fim: selectedFim
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
                                        {/* <DataGrid
                                            apiRef={apiRef}
                                            rows={rowsData}
                                            columns={columns2}
                                            loading={isLoading}
                                            // pageSize={8}
                                            // rowsPerPageOptions={[8]}
                                            // disableSelectionOnClick
                                            // initialState={{
                                            //   ...rowsData.initialState,
                                            //   pagination: { paginationModel: { pageSize: -1 } },
                                            // }}
                                            // pageSizeOptions={[5, 10, 25, { value: -1, label: 'All' }]}
                                            hideFooterPagination={false}
                                            style={{
                                                border: "none",
                                                fontWeight: "bold",
                                                // minWidth: '50%',
                                                height: screenHeight - 390,
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
                                                // "& .MuiDataGrid-cell--highlighted": {
                                                //   border: '1px solid red'
                                                // },
                                            }}
                                            getRowClassName={(params) => {
                                                // // Apply the class for the highlighted row
                                                // if (params.id === highlightedRowId) {
                                                //   return "MuiDataGrid-cell--highlighted"; // Apply the highlight class to the row
                                                // }

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
                                        /> */}
                                        <DataGrid
                                            apiRef={apiRef}
                                            rows={rowsData}
                                            columns={columns2}
                                            loading={isLoading}
                                            hideFooterPagination={false}
                                            style={{
                                                border: "none",
                                                fontWeight: "bold",
                                                height: screenHeight - 390,
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

                                                // ✅ Define custom row colors
                                                "& .qc-status-pink": {
                                                    backgroundColor: "#ffc0cb", // Light Pink
                                                },
                                                "& .qc-status-green": {
                                                    backgroundColor: "#90ee90", // Light Green
                                                },
                                                "& .Mui-evenRow": {
                                                    backgroundColor: "#f9f9f9",
                                                },
                                                "& .Mui-oddRow": {
                                                    backgroundColor: "#ffffff",
                                                },
                                            }}
                                            getRowClassName={(params) => {
                                                const qcStatus = params.row.qcStatus;

                                                // ✅ Set row color based on qcStatus
                                                if (qcStatus === 0) {
                                                    return "qc-status-pink";
                                                }
                                                if (qcStatus === 1) {
                                                    return "qc-status-green";
                                                }

                                                // ✅ Alternate row colors if no qcStatus match
                                                const rowIndex = rowsData.findIndex((row) => row.id === params.row.id);
                                                if (rowIndex !== -1) {
                                                    return rowIndex % 2 === 0 ? "Mui-evenRow" : "Mui-oddRow";
                                                }

                                                return "";
                                            }}
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                        />
                                    </CardContent>

                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft: "50px" }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', columnGap: '50px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                                                <div
                                                    style={{ width: '20px', height: '20px', backgroundColor: '#8be78b', cursor: 'pointer' }}
                                                // onClick={handleCompleteClick}
                                                // onMouseEnter={(e) => (e.target.style.border = '1px solid #000000', e.target.style.borderRadius = '50px')}
                                                // onMouseLeave={(e) => (e.target.style.border = 'none', e.target.style.borderRadius = '0px')}
                                                ></div>
                                                <Typography>Completed</Typography>
                                            </div>
                                            {/* <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                                                <div style={{ width: '20px', height: '20px', backgroundColor: '#f7e2a0', cursor: 'pointer' }} ></div>
                                                <Typography>Pending</Typography>
                                            </div> */}
                                            <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                                                <div style={{ width: '20px', height: '20px', backgroundColor: '#FFA7A7', cursor: 'pointer' }} ></div>
                                                <Typography>Pending</Typography>
                                            </div>
                                            {/* <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                                        <div style={{ width: '20px', height: '20px', backgroundColor: '#799EFF', cursor: 'pointer' }} ></div>
                                        <Typography>Awaiting for Vendor Process</Typography>
                                    </div> */}
                                        </div>

                                        {/* <div>
                                    <Typography style={{ fontWeight: 'bold' }}>Total Work Planned : {totalWorkPlanned} Min</Typography>
                                </div> */}
                                    </div>
                                </Card>
                            </div>
                        </Grid>
                    </Grid>
                </>
            ) : isProcessInsp === 1 ? (
                <SRNFPIResult
                    setIsProcessInsp={setIsProcessInsp}
                    isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
                    selectedOptionName={selectedOptionName}
                    selectedRowItemId={selectedRowItemId}
                    selectedMachineId={machineName}
                    isChild={isChild}
                    setIsChild={setIsChild}
                    scrollToRow={scrollToRow}
                    selectedRowId={selectedRowId}
                    poNodata={poNodata}
                    cellname={cellname}
                />
            ) : isProcessInsp === 2 ? (
                // <InProcessIn
                <SRNFPIResult
                    setIsProcessInsp={setIsProcessInsp}
                    isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
                    selectedOptionName={selectedOptionName}
                    selectedRowItemId={selectedRowItemId}
                    selectedMachineId={machineName}
                    isChild={isChild}
                    setIsChild={setIsChild}
                    scrollToRow={scrollToRow}
                    selectedRowId={selectedRowId}
                    poNodata={poNodata}
                    cellname={cellname}
                />
            ) : isProcessInsp === 3 ? (
                // <InProcessLPIResult
                <SRNFPIResult
                    setIsProcessInsp={setIsProcessInsp}
                    isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
                    selectedOptionName={selectedOptionName}
                    selectedRowItemId={selectedRowItemId}
                    selectedMachineId={machineName}
                    isChild={isChild}
                    setIsChild={setIsChild}
                    scrollToRow={scrollToRow}
                    selectedRowId={selectedRowId}
                    poNodata={poNodata}
                    cellname={cellname}
                />
            ) : isProcessInsp === 4 ? (
                // <InProcessReworkResult
                <SRNFPIResult
                    setIsProcessInsp={setIsProcessInsp}
                    isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
                    selectedOptionName={selectedOptionName}
                    selectedRowItemId={selectedRowItemId}
                    selectedMachineId={machineName}
                    isChild={isChild}
                    setIsChild={setIsChild}
                    scrollToRow={scrollToRow}
                    selectedRowId={selectedRowId}
                    poNodata={poNodata}
                    cellname={cellname}
                />
            ) : isProcessInsp === 5 ? (
                <ProcessInspectionChild
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
                    poNodata={poNodata}
                    cellname={cellname}
                />
            ) : (
                <></>
            )}

            <ProcessInspectImage
                openImg={openImg}
                setOpenImg={setOpenImg}
                isSelectedData={isSelectedData}
            />

            <PDFViewerFim
                pdfOpen={pdfOpen}
                setPdfOpen={setPdfOpen}
                fileTypeForView={fileTypeForView}
                selectedRowItemCode={selectedRowItemCode}
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

export default SRNInspection;
