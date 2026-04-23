import React, { useEffect, useState, useRef } from "react";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { Card } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { CheckBox } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
// import ChangeAddressModal from './ChangeAddressModal/ChangeAddressModal';
import { Link, useLocation, useNavigate } from "react-router-dom";
// import LoadPendingSfg from './LoadPendingSfg/LoadPendingSfg';
// import LoadPendingJWISS from './SelectedItemsModal/LoadPendingJWISS';
import {
  poApproval,
  GetJobWorkIssueUniqueID,
  GetJobWorkIssueSupplierItemList,
  GenerateJobWorkIssueDC,
  GetDelNoteDetails,
  GetWithoutPoSuppList,
  GetJobWorkReceiptUniqueID,
  GenerateJobWorkReceipt,
  JobWorkReceipt,
  ShowJobWorkReceipt,
  GetDelNoteForwardReverse,
  GetGeneratedJW,
  GetGeneratedJWRecipt,
  JobWorkReciptUpdate,
  JobWorkReciptDelete,
} from "../../ApiService/LoginPageService";
import {
  Button,
  Box,
  Dialog,
  Tooltip,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  DialogActions,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  CardContent,
  Typography,
  InputAdornment,
  setRef,
} from "@mui/material";
import ApplicationStore from "../../Utility/localStorageUtil";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import LoadPendingJobwork from "./LoadPendingJobwork";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import { useModuleLocks } from "../context/ModuleLockContext";

const JobWork_Receipt = ({ editeData }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Balance Approval")?.lockStatus === "locked";

  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const navigate = useNavigate();
  const [generatedJwRLists, setGeneratedJWRLists] = useState([]);
  const [selectedJwRNo, setSelectedJwRNo] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [suppplierList, setSupplierList] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [suppAddress, setSuppAddress] = useState("");
  const [currency, setCurrency] = useState("");
  const [currencyId, setCurrencyId] = useState("");
  const [department, setDepartment] = useState("");
  const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
  const [supplierSid, setSupplierSid] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [totalGrossAmount, setTotalGrossAmount] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [DCNumber, setDCNumber] = useState("");
  const [sequentialNumber, setSequentialNumber] = useState("");
  const [challanNo, setChallanNo] = useState("");
  const [challanDate, setChallanDate] = useState("");
  const [modeOfTransport, setModeOfTransport] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [consigneeName, setConsigneeName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [address4, setAddress4] = useState("");
  const [panNo, setPanNo] = useState("");
  const [gstNo, setGSTNo] = useState("");
  const [typeOfGoods, setTypeOfGoods] = useState("");
  const [docType, setDocType] = useState("");
  const [subSupplyType, setSubSupplyType] = useState("");
  const [subSupplyDesc, setSubSupplyDesc] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [modeOfType, setModeOfType] = useState("");
  const [docketNo, setDocketNo] = useState("");
  const [transportDate, setTransportDate] = useState("");
  const [transportMst, setTransportMst] = useState("");
  const [transportGSTIN, setTransportGSTIN] = useState("");
  const [distanceKMS, setDistanceKMS] = useState("");
  const [shippingPinCode, setShippingPinCode] = useState("");
  const [toStateCode, setToStateCode] = useState("");
  const [actualToState, setActualToState] = useState("");
  const [stockAffect, setStockAffect] = useState("");
  const [ewayBillRequired, setEwayBillRequired] = useState("");
  const [cgst, setCGST] = useState("");
  const [cgstPercent, setCGSTPercent] = useState("");
  const [sgst, setSGST] = useState("");
  const [sgstPercent, setSGSTPercent] = useState("");
  const [igst, setIGST] = useState("");
  const [igstPercent, setIGSTPercent] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [remarks, setRemarks] = useState("");
  const [suppId, setSuppId] = useState("");
  const [loadPendingSfg, setLoadPendingSfg] = useState(false);
  const [supplierSelect, setSupplierSelect] = useState("");
  const [mainId, setMainId] = useState("");
  const [rows, setRows] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [DcNo, setDcNo] = useState("");
  const [DcDate, setDcDate] = useState("");
  const [totalQty, settotalQty] = useState("");
  const [supplierAddress, setSupplierAddress] = useState("");
  const [jobsupplierName, setJobSupplierName] = useState("");
  const [sId, setSId] = useState("");
  const [enable, setEnable] = useState(false);
  const [initialCumQtyMap, setInitialCumQtyMap] = useState({});
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState('')

  const location = useLocation();

  const { userDetails } = ApplicationStore().getStorage("userDetails");
  const userPermission = userDetails?.groupRights?.filter(
    (data) => data?.menu?.toLowerCase() === "purchasebill"
  );
  const queryParams = new URLSearchParams(location.search);

  const mode = queryParams.get("mode");
  const viewDC = queryParams.get("viewDC");
  const delRowId = queryParams.get("delRowId");

  // Get both supplier IDs
  const withPOSupplierId = queryParams.get("withPOSupplierId");
  const withoutPOSupplierId = queryParams.get("withoutPOSupplierId");

  // If you still need one common `supplierId` variable based on mode
  const supplierId = mode === "withPO" ? withPOSupplierId : withoutPOSupplierId;

  // Get other shared params
  const selectedSuppName = queryParams.get("selectedSuppName");
  const selectedSpAddress = queryParams.get("selectedSpAddress");
  const supplierInvoiceNoCopy = queryParams.get("supplierInvoiceNoCopy");
  const supplierInvoiceDateCopy = queryParams.get("supplierInvoiceDateCopy");
  const cSupplierDcNoCopy = queryParams.get("cSupplierDcNoCopy");
  const supplierDcDateCopy = queryParams.get("supplierDcDateCopy");

  useEffect(() => {

    delRowId &&
      GetDelNoteDetails(
        { id: delRowId },
        handleDelNoteDetailsSuccess,
        handleDelNoteDetailsException
      );

    handleForwardReverse("last", "");
  }, [viewDC]);

  //UNIQUE CODE API HANDLER
  const handleUniqueCodeSuccess = (dataObject) => {
    setDCNumber(dataObject?.data?.jwrNo);
    setSequentialNumber(dataObject?.data?.sequentialNumber);
  };
  const handleUniqueCodeException = () => { };

  //DEL_NOTE DETAILS API HANDLER
  const handleDelNoteDetailsSuccess = (dataObject) => {
    //SUPPLIER LIST
    setSuppAddress(dataObject?.supplier?.spAddress || "");
    setCurrency(dataObject?.supplier?.currency || "");
    setCurrencyId(dataObject?.supplier?.currencyId || "");
    setSupplierName(dataObject?.supplier?.spName || "");
    setDepartment(dataObject?.supplier?.department || "");
    setSupplierSid(dataObject?.supplier?.sId || "");
    setSuppId(dataObject?.supplier?.id || "");
    setGSTNo(dataObject?.supplier?.gstNo || "");
    setPanNo(dataObject?.supplier?.panNo || "");
    setSupplierSelect(dataObject?.supplier?.spName || "");
    // Jobwork Details
    setDCNumber(dataObject?.jobWork?.dcNo || "");
    setSequentialNumber(dataObject?.jobWork?.sequentialNumber || "");
    setChallanNo(dataObject?.jobWork?.challanNo || "");
    setChallanDate(dataObject?.jobWork?.challanDate || "");
    setModeOfTransport(dataObject?.jobWork?.modeOfTransport || "");
    setVehicleNo(dataObject?.jobWork?.vehicleNo || "");
    setConsigneeName(dataObject?.jobWork?.consigneeName || "");
    setTypeOfGoods(dataObject?.jobWork?.typeOfGoods || "");
    setDocType(dataObject?.jobWork?.docType || "");
    setSubSupplyType(dataObject?.jobWork?.subSupplyType || "");
    setSubSupplyDesc(dataObject?.jobWork?.subSupplyDesc || "");
    setTransactionType(dataObject?.jobWork?.transactionType || "");
    setModeOfType(dataObject?.jobWork?.modeOfType || "");
    setDocketNo(dataObject?.jobWork?.docketNo || "");
    setTransportDate(dataObject?.jobWork?.transportDate || "");
    setTransportMst(dataObject?.jobWork?.transportMst || "");
    setTransportGSTIN(dataObject?.jobWork?.transportGSTIN || "");
    setDistanceKMS(dataObject?.jobWork?.distanceKMS || "");
    setShippingPinCode(dataObject?.jobWork?.shippingPinCode || "");
    setToStateCode(dataObject?.jobWork?.toStateCode || "");
    setActualToState(dataObject?.jobWork?.actualToState || "");
    setStockAffect(dataObject?.jobWork?.stockAffect || "");
    setEwayBillRequired(dataObject?.jobWork?.ewayBillReq || "");
    setTotalQuantity(dataObject?.jobWork?.totalQty || "");
    setTotalGrossAmount(dataObject?.jobWork?.totalGrossAmt || "");
    setCGSTPercent(dataObject?.jobWork?.cgstPercent || "");
    setCGST(dataObject?.jobWork?.cgst || "");
    setSGSTPercent(dataObject?.jobWork?.sgstPercent || "");
    setSGST(dataObject?.jobWork?.sgst || "");
    setIGSTPercent(dataObject?.jobWork?.igstPercent || "");
    setIGST(dataObject?.jobWork?.igst || "");
    setTotalValue(dataObject?.jobWork?.totalValue || "");
    setRemarks(dataObject?.jobWork?.remarks || "");
    setSelectedDate(dataObject?.jobWork?.created_at || "");
    //ITEMLIST
    setVehicleNo(dataObject?.itemsList[0]?.vehicleNo || "");
    // setSelectedItems(dataObject.itemsList || []);
  };

  const handleDelNoteDetailsException = () => { };

  const ClearData = () => {
    setSupplierSid("");
    setChallanNo("");
    setChallanDate("");
    setModeOfTransport("");
    setVehicleNo("");
    setConsigneeName("");
    setSuppAddress("");
    setPanNo("");
    setGSTNo("");
    setTypeOfGoods("");
    setDocType("");
    setSubSupplyType("");
    setSubSupplyDesc("");
    setTransactionType("");
    setModeOfType("");
    setDocketNo("");
    setTransportDate("");
    setTransportMst("");
    setTransportGSTIN("");
    setDistanceKMS("");
    setShippingPinCode("");
    setToStateCode("");
    setActualToState("");
    setStockAffect("");
    setEwayBillRequired("");
    setTotalQuantity("");
    setTotalGrossAmount("");
    setCGSTPercent("");
    setCGST("");
    setSGSTPercent("");
    setSGST("");
    setIGSTPercent("");
    setIGST("");
    setTotalValue("");
    setRemarks("");
    setSelectedItems([]);

    setTimeout(() => {
      GetJobWorkIssueUniqueID(
        handleUniqueCodeSuccess,
        handleUniqueCodeException
      );
    }, 2000);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // Check if any item has an empty receivedQty
  //   const hasEmptyRcvQty = rows.some((row) => !row.recievedQty);

  //   if (hasEmptyRcvQty) {
  //     setNotification({
  //       status: true,
  //       type: "error",
  //       message: "Received Quantity cannot be empty.",
  //     });
  //     return; // Stop form submission if any recievedQty is empty
  //   }

  //   // Build updated array directly from DataGrid rows
  //   const updatedArray = rows.map((row) => ({
  //     id: row.id,
  //     itemId: row.itemId,
  //     jwiQty: row.Qty,
  //     cumQty: row.cumQty,
  //     pendQty: row.pendingQty,
  //     jwrQty: row.recievedQty,
  //     jwcQty: row.jcNo,

  //   }));

  //   GenerateJobWorkReceipt(
  //     {
  //       itemsList: updatedArray,
  //       jwrNo: DCNumber,
  //       supplierId: sId,
  //       invoiceNo: invoiceNumber,
  //       invoiceDate: invoiceDate,
  //       dcNo: DcNo,
  //       dcDate: DcDate,
  //       totQty: totalQty,
  //       sequentialNumber: sequentialNumber,
  //     },
  //     handleSuccess,
  //     handleException
  //   );
  // };
  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Validate JWR Qty
    const hasEmptyJwrQty = rows.some(
      (row) => row.jwrQty === "" || row.jwrQty === null || row.jwrQty === undefined
    );

    if (hasEmptyJwrQty) {
      setNotification({
        status: true,
        type: "error",
        message: "Received Quantity cannot be empty.",
      });
      return;
    }

    // ✅ Build payload (COMMON for SAVE & UPDATE)
    const itemsList = rows.map((row) => ({
      id: row.id,
      itemId: row.itemId,
      jwiQty: row.Qty,
      cumQty: row.cumQty,
      pendQty: row.pendQty,
      jwrQty: row.jwrQty,
      jcNo: row.jcNo,
      jwiId: row.jwiId,
    }));

    // ===============================


    // 🟢 UPDATE MODE
    // ===============================
    if (isUpdateMode) {
      JobWorkReciptUpdate(
        {
          id: mainId, // 👈 goes in URL /update/:id
          // {
          itemsList,
          // totQty: totalQty,
          jwrNo: DCNumber,
          supplierId: sId,
          invoiceNo: invoiceNumber,
          invoiceDate,
          dcNo: DcNo,
          dcDate: DcDate,
          totQty: totalQty,
          sequentialNumber,
        },
        // },
        handleSuccess,
        handleException
      );
      return;
    }

    // ===============================
    // 🔵 SAVE MODE
    // ===============================
    GenerateJobWorkReceipt(
      {
        itemsList,
        jwrNo: DCNumber,
        supplierId: sId,
        invoiceNo: invoiceNumber,
        invoiceDate,
        dcNo: DcNo,
        dcDate: DcDate,
        totQty: totalQty,
        sequentialNumber,
      },
      handleSuccess,
      handleException
    );
  };


  const handleSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      handleNew()
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
      // handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handlePJWChange = (e) => {
    GetGeneratedJWRecipt({ code: e.target.value }, handleGeneratedJWSucessShow, handleGeneratedJWExceptionShow);
  }

  const handleGeneratedJWSucessShow = (dataObject) => {
    setGeneratedJWRLists(dataObject?.data || []);
  }
  const handleGeneratedJWExceptionShow = (errorObject, errorMessage) => {
  }

  const handleGeneratedJWSelect = (selectedValue) => {
    if (selectedValue !== null) {
      setSelectedJwRNo(selectedValue?.jwrNo);
      JobWorkReceipt(
        { type: "view", id: selectedValue.id },
        handleForwardSuccess,
        handleForwardException
      );
    }
  }
  //MIDDLE GRID
  const middleGridColumns = [
    {
      field: "jcNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Jobcard No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "itemCode",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Part No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "itemName",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Part Name</span>
      ),
      type: "number",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "uom",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>UOM</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "dcNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>JWISSNO</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "Qty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>JWISSQTY</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "cumQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Cum Qty</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "pendQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Pend Qty</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "jwrQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>JWR Qty</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true, // ✅ CONTROL EDIT
    },
    {
      field: "remarks",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Remark</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "actions",
      type: "actions",
      flex: 1,
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
      ),
      cellClassName: "actions",
      disableClickEventBubbling: true,
      getActions: (params) => [
        <DeleteData key={params.id} selectedRow={params.row} />,
      ],
    },
  ];

  function DeleteData({ selectedRow }) {
    return (
      <GridActionsCellItem
        icon={<DeleteIcon style={{ color: "black", cursor: "pointer" }} />}
        label="Delete"
        onClick={() => handleDeleteRow(selectedRow.id)}
        disabled={!enable}
      />
    );
  }



  const handleDeleteRow = (id) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.filter((row) => row.id !== id);

      // 🔹 Update selectedItems also
      setSelectedItems((prevItems) =>
        prevItems.filter((item) => item.id !== id)
      );

      // 🔹 Recalculate totalQty
      const newTotalQty = updatedRows.reduce(
        (sum, row) => sum + Number(row.jwrQty || 0),
        0
      );
      settotalQty(newTotalQty);

      return updatedRows;
    });
  };

  //DATE CONVERT TO TEXTFIELD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  //TOTAL CALCULATION
  const calculateTotals = (data) => {
    const totalQty = data.reduce(
      (acc, item) => acc + (Number(item.Qty) || 0),
      0
    );
    setTotalQuantity(totalQty);

    return [{ id: 1, totalQty }];
  };

  useEffect(() => {
    calculateTotals(selectedItems);
  }, [selectedItems]);

  // GST CALCULATTION
  useEffect(() => {
    var cgstAmount = (totalGrossAmount * cgstPercent) / 100;
    setCGST(cgstAmount);
    var sgstAmount = (totalGrossAmount * sgstPercent) / 100;
    setSGST(sgstAmount);
    var igstAmount = (totalGrossAmount * igstPercent) / 100;
    setIGST(igstAmount);
    let totalAmount =
      Number(totalGrossAmount) + Number(cgst) + Number(sgst) + Number(igst);
    setTotalValue(Math.round(totalAmount));
  }, [
    cgstPercent,
    sgstPercent,
    igstPercent,
    cgst,
    sgst,
    igst,
    totalValue,
    totalGrossAmount,
  ]);

  const remarksLists = [
    "APPROXIMATE WEIGHT & VALUE FOR WEIGHING AND RETURN WITHOUT E-WAY BILL LESS THAN 20KM",
    "FOR SIMULATION AND RETURN",
    "FOR STORAGE ONLY",
    "FOR ACID PICKLING AND RETURN",
    "FOR ANODIZING AND RETURN",
    "FOR ASSEMBLY TRAINING AND RETURN",
    "FOR BALANCEING AND RETURN",
    "FOR POWDER COATING AND RETURN",
    "FOR PRESSING AND RETURN",
    "FOR PRODUCTION PROCESS AND RETURN",
    "FOR PUNCHING AND RETURN",
    "FOR PUNCHING,BENDING AND RETURN",
    "FOR PUNCHING,BENDING,PROCESS AND RETURN",
  ];

  //GET SUPPLIER LIST
  const handleChange = (e) => {
    GetWithoutPoSuppList(
      { code: e.target.value },
      handleItemVsProcessItemSucessShow,
      handleItemVsProcessItemExceptionShow
    );
  };

  const handleItemVsProcessItemSucessShow = (dataObject) => {
    setSupplierList(dataObject?.data || []);
  };
  const handleItemVsProcessItemExceptionShow = (
    errorObject,
    errorMessage
  ) => { };

  const handleSupplierSearchItemChange = (value) => {
    if (value !== null) {
      setSuppAddress(value?.spAddress);
      setSupplierSid(value?.id);
      setGSTNo(value?.gstNo);
      setPanNo(value?.panNo);
      // setSupplierSelect(value?.label);
    }
  };
  useEffect(() => {
    // ⛔ If rows empty → just set total 0
    if (rows.length === 0) {
      settotalQty(0);
      return;
    }

    // ⛔ If totalQty already came from API, DO NOT override it
    if (Number(totalQty) > 0) {
      return;
    }

    // ✅ Otherwise calculate based on rows
    const updated = rows.map((row) => {
      const jwissQty = Number(row.Qty || 0);
      const cumQty = Number(row.cumQty || 0);
      const calcQty = Math.max(jwissQty - cumQty, 0);

      return {
        ...row,
        jwrQty: calcQty,
        pendQty: calcQty,
      };
    });

    setRows(updated);

    // baseline mapping
    const map = updated.reduce((acc, row) => {
      acc[row.id] = row.cumQty;
      return acc;
    }, {});

    setInitialCumQtyMap(map);

    // Now calculate sum only if API did not give totalQty
    const sum = updated.reduce((acc, row) => acc + Number(row.jwrQty || 0), 0);

    settotalQty(sum);
  }, [rows.length]);


  // const handleCellEdit = (newRow, oldRow) => {
  //   let updatedRow = { ...newRow };

  //   if (newRow.jwrQty !== oldRow.jwrQty) {
  //     const originalCum = Number(initialCumQtyMap[oldRow.id] || 0);
  //     const enteredJwr = Number(newRow.jwrQty || 0);   // user input
  //     const jwissQty = Number(newRow.Qty || 0);

  //     const newCum = originalCum + enteredJwr;
  //     const pend = Math.max(jwissQty - newCum, 0);

  //     updatedRow.cumQty = newCum;
  //     updatedRow.pendQty = pend;
  //     updatedRow.jwrQty = pend;  // mirror Pend Qty
  //   }

  //   // ✅ After row is updated, recompute total
  //   const sum = rows.reduce((acc, r) =>
  //     r.id === updatedRow.id
  //       ? acc + Number(updatedRow.jwrQty || 0) // include new row value
  //       : acc + Number(r.jwrQty || 0),
  //     0
  //   );
  //   settotalQty(sum);

  //   return updatedRow;
  // };

  const handleCellEdit = (newRow, oldRow) => {
    let updatedRow = { ...newRow };

    if (newRow.jwrQty !== oldRow.jwrQty) {
      const originalCum = Number(initialCumQtyMap[oldRow.id] || 0);
      const enteredJwr = Number(newRow.jwrQty || 0);
      const jwissQty = Number(newRow.Qty || 0);

      const newCum = originalCum + enteredJwr;
      const pend = Math.max(jwissQty - newCum, 0);

      updatedRow.cumQty = newCum;
      updatedRow.pendQty = pend;
      updatedRow.jwrQty = enteredJwr; // mirror pend qty
    }

    // ✅ UPDATE ROWS STATE (THIS WAS MISSING)
    setRows((prevRows) =>
      prevRows.map((r) => (r.id === updatedRow.id ? updatedRow : r))
    );

    // ✅ Recalculate totalQty
    const sum = rows.reduce((acc, r) =>
      r.id === updatedRow.id
        ? acc + Number(updatedRow.jwrQty || 0)
        : acc + Number(r.jwrQty || 0),
      0
    );
    settotalQty(sum);

    return updatedRow;
  };



  const handleForwardReverse = (type, id) => {
    setIsUpdateMode(false);

    JobWorkReceipt(
      { type: type, id: id },
      handleForwardSuccess,
      handleForwardException
    );
  };

  const handleForwardSuccess = (dataObject = {}) => {
    setEnable(false);
    setMainId(dataObject?.jobWork?.id || "");
    setRows(dataObject?.itemsList || []);
    setInvoiceNumber(dataObject?.jobWork?.invoiceNo || "");
    setInvoiceDate(dataObject?.jobWork?.invoiceDate || "");
    setDcNo(dataObject?.jobWork?.dcNo || "");
    setDcDate(dataObject?.jobWork?.dcDate || "");
    settotalQty(dataObject?.jobWork?.totQty || "");
    setSupplierAddress(dataObject?.supplier?.spAddress || "");
    setJobSupplierName(dataObject?.supplier?.spName || "");
    setDCNumber(dataObject?.jobWork?.jwrNo || "");
    setSequentialNumber(dataObject?.jobWork?.sequentialNumber || "");
  };

  const handleForwardException = () => { };

  const handleNew = () => {
    setIsUpdateMode(false);
    setEnable(true);
    setMainId("");
    setRows([]);
    setInvoiceNumber("");
    setInvoiceDate("");
    setDcNo("");
    setDcDate("");
    settotalQty("");
    setSupplierAddress("");
    setJobSupplierName("");
    setSequentialNumber("");
    setDCNumber("");
    GetJobWorkReceiptUniqueID(handleNewsuccess, handleNewexception);
  };

  const handleSupplierSelect = (value) => {
    if (value !== null) {
      setSupplierAddress(value?.spAddress || "");
      setJobSupplierName(value?.label || "");
      setSId(value?.id || "");
    }
  };

  const handleNewsuccess = (dataObject) => {
    setDCNumber(dataObject?.data?.jwrNo);
    setSequentialNumber(dataObject?.data?.sequentialNumber);
  };

  const handleNewexception = () => { };


  const handleClear = () => {
    setIsUpdateMode(false);
    setEnable(false);
    setMainId("");
    setRows([]);
    setInvoiceNumber("");
    setInvoiceDate("");
    setDcNo("");
    setDcDate("");
    settotalQty("");
    setSupplierAddress("");
    setJobSupplierName("");
    setSequentialNumber("");
    setDCNumber("");
  }

  const handleMainDelete = () => {
    if (!mainId) {
      setNotification({
        status: true,
        type: "error",
        message: "No record selected to delete",
      });
      return;
    }

    setDeleteId(mainId);        // store ID
    setDeleteDailogOpen(true);  // open dialog

  };

  const handleDeleteSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject?.message || "Deleted successfully",
    });

    setTimeout(() => {
      handleNew();   // reset form
      handleClose();
    }, 2000);
  };


  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginLeft: "10px",
          marginTop: "10px",
        }}
      >
        {mode === "withPO" && (
          <Link
            to="/PurchaseBillAgainstPOModule"
            style={{ textDecoration: "none" }}
          >
            <Typography
              sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
              variant="h5"
            >
              {`Purchase Bill Against PO >>1`}
            </Typography>
          </Link>
        )}
        {mode === "withoutPO" && (
          <Link
            to="/PurchaseBillWithoutPOModule"
            style={{ textDecoration: "none" }}
          >
            <Typography
              sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
              variant="h5"
            >
              {`Purchase Bill Without PO >>`}
            </Typography>
          </Link>
        )}
        <Typography
          sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
          variant="h5"
        >
          Job Work Receipt
        </Typography>
        <div style={{ width: '300px', marginLeft: 'auto', marginRight: '0px' }}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={generatedJwRLists}
            fullWidth
            value={selectedJwRNo}
            getOptionLabel={(option) => option.jwrNo || selectedJwRNo}
            renderInput={(params) => <TextField {...params} label="Search JWR" onChange={handlePJWChange} />}
            onChange={(event, value) => handleGeneratedJWSelect(value)}
            size="small"
          // style={{ backgroundColor: '#ffffff', borderRadius: '5px', zIndex: 10000 }}
          />
        </div>

      </div>
      <form onSubmit={handleSubmit}>
        <Grid container padding={1}>
          <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
            <Grid container spacing={1}>
              <Grid
                item
                xs={12}
                sm={12}
                md={3}
                lg={3}
                xl={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  fullWidth
                  disabled={true}
                  placeholder="JWR No"
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <TextField
                  fullWidth
                  readOnly={true}
                  required
                  value={sequentialNumber}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <TextField
                  fullWidth
                  type="date"
                  readOnly={true}
                  disabled={true}
                  required
                  value={formatDate(selectedDate)}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <TextField
                  fullWidth
                  readOnly={true}
                  required
                  value={DCNumber}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                {/* <TextField
                                    fullWidth
                                    readOnly={true}
                                    required
                                    value={jobsupplierName}
                                    label="Supplier Name"
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                /> */}
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={suppplierList}
                  fullWidth
                  value={jobsupplierName}
                  getOptionLabel={(option) => option.spCode || jobsupplierName}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Supplier"
                      onChange={handleChange}
                    />
                  )}
                  onChange={(event, value) => handleSupplierSelect(value)}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                  disabled={!enable}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <TextField
                  fullWidth
                  id="outlined-multiline-static"
                  label="Billing Address"
                  multiline
                  rows={4}
                  rowsMax={8}
                  value={supplierAddress}
                  readOnly={true}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                  inputProps={{
                    style: { height: "65px", fontSize: "13px" },
                  }}
                  disabled={!enable}
                />
              </Grid>

              {!viewDC && (
                <Grid item xs={12} sm={12} md={1} lg={1} xl={1} marginRight={2}>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor:
                        suppAddress.length > 0 ? "#002d68" : " #dddddd",
                    }}
                    disabled={suppAddress.length > 0 ? false : true}
                    onClick={() => setChangeAddressModalOpen(true)}
                  >
                    Change
                  </Button>
                </Grid>
              )}

              {!viewDC && (
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setLoadPendingSfg(true);
                    }}
                    disabled={!enable}
                    sx={{
                      backgroundColor: "#002d68",
                      "&.Mui-disabled": {
                        backgroundColor: "gray", // button turns gray
                        color: "#fff", // keep text white
                        opacity: 1, // prevent faded look
                      },
                    }}
                  >
                    Load Pending JWISS
                  </Button>
                </Grid>
              )}

              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}></Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={4}
            xl={4}
            style={{ fontSize: "75%" }}
          >
            <Card
              style={{
                boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                marginTop: "0px",
                borderRadius: "10px",
                width: "100%",
                height: "30vh",
                overflow: "auto",
                border: "1px solid black",
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <table
                      style={{
                        width: "100%",
                        height: "100%",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            colSpan={2}
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                              backgroundColor: "#6895D2",
                              color: "#ffffff",
                            }}
                          >
                            JOB WORK RECEIPT DETAILS
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                              color: "#7077A1",
                            }}
                          >
                            Field
                          </th>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                              color: "#7077A1",
                            }}
                          >
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            Invoice No
                          </th>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            <TextField
                              fullWidth
                              // required
                              onChange={(e) => setInvoiceNumber(e.target.value)}
                              value={invoiceNumber}
                              size="small"
                              disabled={!enable}
                            />
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            Invoice Date
                          </th>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            <TextField
                              fullWidth
                              type="date"
                              onChange={(e) => setInvoiceDate(e.target.value)}
                              value={formatDate(invoiceDate)}
                              size="small"
                              disabled={!enable}
                            />
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            DC No
                          </th>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            <TextField
                              fullWidth
                              // type='date'
                              onChange={(e) => setDcNo(e.target.value)}
                              value={DcNo}
                              size="small"
                              disabled={!enable}
                            />
                          </td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            DC Date
                          </th>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            <TextField
                              fullWidth
                              type="date"
                              onChange={(e) => setDcDate(e.target.value)}
                              value={formatDate(DcDate)}
                              size="small"
                              disabled={!enable}
                            />
                          </td>
                        </tr>
                      </tbody>
                      <thead>
                        <tr>
                          <th
                            colSpan={2}
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                              backgroundColor: "#6895D2",
                              color: "#ffffff",
                            }}
                          >
                            TOTAL
                          </th>
                        </tr>
                        <tr>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                              color: "#7077A1",
                            }}
                          >
                            Field
                          </th>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                              color: "#7077A1",
                            }}
                          >
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            Total Qty
                          </th>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              value={totalQty}
                              disabled={!enable}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
            <Card
              style={{
                boxShadow: "0 10px 10px 10px rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
                width: "100%",
                height: "100%",
                border: "1px solid black",
              }}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between", // left group & right button separated
                    alignItems: "center",
                    marginBottom: "18px",
                  }}
                >
                  {/* Left side buttons */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      columnGap: "10px",
                      flexWrap: "wrap", // wrap if too many
                    }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        height: "35px",
                        background: isModuleLocked ? "gray" : "#002D68",
                        color: "white",
                      }}
                      onClick={handleNew}
                      disabled={isModuleLocked} // optional safety
                    >
                      New
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        height: "35px",
                        background: isModuleLocked ? "gray" : "#002D68",
                        color: "white",
                      }}
                      disabled={isModuleLocked} // optional safety
                      onClick={() => {
                        setIsEditMode(true);
                        setIsUpdateMode(true);   // switch Save → Update
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="contained"
                      style={{
                        height: "35px",
                        background: isModuleLocked ? "gray" : "#002D68",
                        color: "white",
                      }}
                      disabled={!mainId || isModuleLocked} // optional safety
                      onClick={handleMainDelete}
                    >
                      Delete
                    </Button>

                    <Button
                      variant="contained"
                      style={{
                        height: "35px",
                        background: isModuleLocked ? "gray" : "#002D68",
                        color: "white",
                      }}
                      disabled={isModuleLocked} // optional safety
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        height: "35px",
                        background: "#002D68",
                        color: "white",
                      }}
                      // optional safety
                      onClick={() => handleForwardReverse("first", "")}
                    >
                      <FastRewindIcon />
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        height: "35px",
                        background: "#002D68",
                        color: "white",
                      }}

                      onClick={() => handleForwardReverse("reverse", mainId)}
                    >
                      <SkipPreviousIcon />
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        height: "35px",
                        background: "#002D68",
                        color: "white",
                      }}

                      onClick={() => handleForwardReverse("forward", mainId)}
                    >
                      <SkipNextIcon />
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        height: "35px",
                        background: "#002D68",
                        color: "white",
                      }}

                      onClick={() => handleForwardReverse("last", "")}
                    >
                      <FastForwardIcon />
                    </Button>
                  </div>

                  {/* Right side SAVE button */}
                  {!viewDC && (
                    <Button
                      variant="contained"
                      type="submit"
                      style={{
                        height: "35px",
                        backgroundColor: isModuleLocked ? "gray" : "#002D68",
                        color: "white",
                      }}
                      disabled={isModuleLocked} // optional safety
                    >
                      {isUpdateMode ? "UPDATE" : "SAVE"}
                    </Button>
                  )}

                </div>

                <DataGrid
                  rows={rows}
                  columns={middleGridColumns}
                  pageSize={5}
                  style={{ height: "310px" }}
                  key={refreshKey}
                  sx={{
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
                    const rowIndex = selectedItems.findIndex(
                      (row) => row.id === params.row.id
                    );
                    if (rowIndex !== -1) {
                      return rowIndex % 2 === 0 ? "Mui-evenRow" : "Mui-oddRow";
                    }
                    return "";
                  }}
                  rowHeight={40}
                  columnHeaderHeight={40}
                  processRowUpdate={handleCellEdit}
                  experimentalFeatures={{ newEditingApi: true }}

                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
      {/* <ChangeAddressModal
                changeAddressModalOpen={changeAddressModalOpen}
                setChangeAddressModalOpen={setChangeAddressModalOpen}
                setSuppAddress={setSuppAddress}
                supplierSid={supplierSid}
            /> */}
      <DeleteConfirmationDailog
        open={deleteDailogOpen}
        setOpen={setDeleteDailogOpen}
        deleteId={deleteId}
        deleteService={JobWorkReciptDelete}
        handleSuccess={handleDeleteSuccess}
        handleException={handleException}
      />


      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />

      <LoadPendingJobwork
        setLoadPendingSfg={setLoadPendingSfg}
        loadPendingSfg={loadPendingSfg}
        setSelectedItems={setSelectedItems}
        selectedItems={selectedItems}
        supplierSid={sId}
        onClose={() => setLoadPendingSfg(false)}
        onSubmit={(items) => {
          setRows((prev) => {
            const existingIds = new Set(prev.map((row) => row.id));
            const newItems = items.filter((item) => !existingIds.has(item.id));
            return [...prev, ...newItems];
          });

          setSelectedItems((prev) => {
            const existingIds = new Set(prev.map((row) => row.id));
            const newItems = items.filter((item) => !existingIds.has(item.id));
            return [...prev, ...newItems];
          });
        }}
        withoutPOSupplierId={withoutPOSupplierId}
        mode={mode}
      />
    </div>
  );
};

export default JobWork_Receipt;
