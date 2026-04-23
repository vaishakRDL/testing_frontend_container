import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useState, useRef } from "react";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CustomerDCAutoGen,
  CustomerDropShowdata,
  FetchCustomerAddress,
  GetGeneratePoSaleOrderEntry,
  LoadDc,
  LoadDcInvoice,
  LoadDcInvoiceItems,
  LoadDcItems,
  MstTransporterShowData,
  NRDCImport,
  NRDCImportrequest,
  NonCustomerDcAdd,
  NonCustomerDcUpdate,
  NonDcAutoGen,
  NonReturnableDcInvoiceData,
  NonReturnableDcPreview,
  NonReturnableDelete,
  NonreturnableDcDCJson,
  NrdcViewing,
  PartNoSelect,
  PartNoSelectShow,
} from "../../../ApiService/LoginPageService";
import { useEffect } from "react";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";
import AddressChange from "./AddressChange";
import { DataGrid } from "@mui/x-data-grid";
import {
  DownloadNRDCTemplate,
  ExportNrdc,
} from "../../../ApiService/DownloadCsvReportsService";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import DeleteConfirmationDailog from "../../../Utility/confirmDeletion";
import LoadPendingDelNote from "../GSTSalesInvoice/LoadPendingDelNote";
import NonReturnableLoadDelNote from "./NonReturnableLoadDelNote";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { PDFDocument } from "pdf-lib";
import { useModuleLocks } from "../../context/ModuleLockContext";

const NewNRDCEntry = () => {
  const [activeButton, setActiveButton] = useState("");

  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Non-Returnable DC")?.lockStatus === "locked";

  const getHighlightStyle = (name, baseStyle = {}, disabled = false) => ({
    ...baseStyle,
    backgroundColor: disabled
      ? "gray"
      : activeButton === name
        ? "#0d6efd"   // 🔵 highlight
        : baseStyle.backgroundColor,
    transition: "0.3s",
    color: disabled ? "#000" : "white",
  });

  const shipToTextFieldRef = useRef(null);
  const dispatchFromTextFieldRef = useRef(null);
  const [nrdcNo, setNrdcNo] = useState("");
  const [autogen, setAutoGen] = useState("");
  const [autoGenNDc, setAutoGenNDc] = useState("");
  const [customerSelect, setCustomerSelect] = useState("");
  const [customerSelectList, setCustomerSelectList] = useState([]);
  const [customerSid, setCustomerSid] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [cId, setcid] = useState("");
  const [billingAddress, setBillingAddress] = useState([]);
  const [shippingAddress, setShippingAddress] = useState([]);
  const [partNo, setPartNo] = useState("");
  const [partNoList, setPartNoList] = useState([]);
  const [partNoLabel, setPartNoLabel] = useState("");
  const [challenNo, setChallenNo] = useState("");
  const [challenDate, setChallenDate] = useState(new Date());
  const [modeOfTransport, setModeOfTransport] = useState("By Road");
  const [vechicleNo, setVechicleNo] = useState("");
  const [gstNo, setGstNo] = useState(0);
  const [panNo, setPanNo] = useState("");
  const [subSupplyType, setSubSupplyType] = useState("");
  const [subSupplyDesc, setSubSupplyDesc] = useState("");
  const [docType, setDocType] = useState("CHL");
  const [transactionType, setTransactionType] = useState("");
  const [modeOfType, setModeOfType] = useState("");
  const [docketNo, setDocketNo] = useState("");
  const [transportDate, setTransportDate] = useState(new Date());
  const [transporterMst, setTransporterMst] = useState("");
  const [transporterList, setTransporterList] = useState([]);
  const [transporterGSTIN, setTransporterGSTIN] = useState("");
  const [distanceKMS, setDistanceKMS] = useState("");
  const [shippingPincode, setShippingPincode] = useState("");
  const [toStatecode, setToStatecode] = useState("");
  const [actualStateCode, setActualStateCode] = useState("");
  const [remarks, setRemarks] = useState("");
  const [totalQty, setTotalQty] = useState(0);
  const [totalAmt, setTotalAmt] = useState(0);
  const [cgstPercent, setCgstPercent] = useState(0);
  const [cgst, setCGST] = useState(0);
  const [igstPercent, setIgstPercent] = useState(0);
  const [igst, setIGST] = useState(0);
  const [sgstPercent, setSgstPercent] = useState(0);
  const [sgst, setSGST] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
  const [isLoading, setGridLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([{ id: "RDL1" }]);
  const [refreshData, setRefreshData] = useState(false);
  const [rows, setRows] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [selectedChangeAddress, setSelectedChangeAddress] = useState();
  const [checked, setChecked] = useState(false);
  const [selectChecked, setSelectChecked] = useState(false);
  const [loadInvCheck, setLoadInvCheck] = useState([]);
  const [focusedField, setFocusedField] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [uploadLoader, setUploadLoader] = useState(false);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [state, setState] = useState("");
  const [selectedAdditonalOption, setSelectedAdditionalOption] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadPendingDcModal, setLoadPendingDcModal] = useState(false);
  const [dcLists, setDcLists] = useState([]);
  const [loadDcCheck, setLoadDcCheck] = useState([]);

  const [pdfBlobs, setPdfBlobs] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);

  ////////////////////////////////////////////////////////////////////////FORWARD REVERSE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  const [isPOView, setIsPoView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [mainId, setMainId] = useState("");
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [generatedCustDcLists, setGeneratedCustDcLists] = useState([]);
  const [loadPendingDelNote, setLoadPendingDelNote] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  /////////////////////////////////////////////////////////////////////////VALIDATION HANDLER\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  const [vehicleNoError, setVehicleNoError] = useState(false);
  const [transactionTypeError, setTransactionTypeError] = useState(false);
  const [modeOfTypeError, setModeOfTypeError] = useState(false);
  const [distanceKMSError, setDistanceKMSError] = useState(false);
  const [remarksError, setRemarksError] = useState(false);

  const handleViewMore = () => {
    setIsModalOpen(true);
    if (selectedAdditonalOption === "invoice") {
      setRemarks(`Return After JobWork #${selectedItems[0]?.invNo}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const location = useLocation();

  //--View--//
  // const isPOView = new URLSearchParams(location.search).get("isPOView");
  const poRowId = new URLSearchParams(location.search).get("poRowId");

  //--Edit--//
  // const isEdit = new URLSearchParams(location.search).get("isEdit");

  ///View Button Click
  const navigate = useNavigate();
  const handleViewClick = () => {
    navigate("/NewNRDCView");
  };

  const onNrdcNoChange = (e) => {
    setNrdcNo(e.target.value);
    NonDcAutoGen({ po: "NR" }, handlePoNoAutoGen, handlePoNoAutoGenException);
  };

  const handlePoNoAutoGen = (dataObject) => {
    setAutoGen(dataObject.digit);
    setAutoGenNDc(dataObject.id);
  };

  useEffect(
    () => {
      // NonDcAutoGen(handlePoNoAutoGen, handlePoNoAutoGenException);

      // if (isPOView || isEdit) {
      //   NrdcViewing({ id: poRowId }, handlePurchaseOrderView, handlePurchaseOrderViewException);
      // }
      MstTransporterShowData(
        handleTransporterShow,
        handleTransportershowException
      );
      handleForwardReverse("last", "");
    },
    [
      /*isPOView, isEdit, poRowId*/
    ]
  );

  useEffect(() => {
    // Check condition whenever selectedCustomerName changes
    setShowButton(selectedCustomerName !== "");
  }, [selectedCustomerName]);

  const handleTransporterShow = (dataObject) => {
    setTransporterList(dataObject?.data || []);
  };

  const handleTransportershowException = (error, errorMessage) => {
    console.log(errorMessage);
  };
  const handlePoNoAutoGenException = (errorStaus, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
  };

  const handlePurchaseOrderView = (dataObject) => {
    const data = dataObject.data[0];
    setAutoGen(data?.digit || "");
    setSelectedDate(data?.date || "");
    setAutoGenNDc(data?.nrdcNo || "");
    setSelectedCustomerName(data?.custo || "");
    setBillingAddress(data?.billAdd || "");
    setShippingAddress(data?.shipAdd || "");
    setChallenNo(data?.challenNo || "");
    setChallenDate(data?.challenDate || "");
    setModeOfTransport(data?.modeOfDispatch || "");
    setVechicleNo(data?.vechileNo || "");
    setGstNo(data?.gstno || "");
    setPanNo(data?.panNo || "");
    setSubSupplyType(data?.sub_supply_type || "");
    setSubSupplyDesc(data?.sub_supply_desc || "");
    setDocType(data?.Doc_Type || "CHL");
    setTransactionType(data?.Transaction_Type || "");
    setModeOfType(data?.modeOfType || "");
    setDocketNo(data?.docketNo || "");
    setTransportDate(data?.transportDate || "");
    setTransporterMst(data?.transporter || "");
    setTransporterGSTIN(data?.transporterGstin || "");
    setDistanceKMS(data?.distanceKms || "");
    setShippingPincode(data?.shippingPincode || "");
    setToStatecode(data?.toStateCode || "");
    setActualStateCode(data?.actualStateCode || "");
    setRemarks(data?.remarks || "");
    setTotalQty(data?.date || "");
    setTotalAmt(data?.date || "");
    setCgstPercent(data?.cgst || "");
    setCGST(data?.cgst || "");
    setIgstPercent(data?.igst || "");
    setIGST(data?.igst || "");
    setSgstPercent(data?.sgst || "");
    setSGST(data?.sgst || "");
    setTotalValue(data?.totalValue || "");
    setSelectedItems(dataObject?.data2 || []);
    setcid(data?.cust || "");
    setCustomerSelect(data?.cust || "");
    console.log("data", dataObject?.data2 || []);
  };

  const handlePurchaseOrderViewException = (errorObject, errorMessage) => { };

  ///Customer Select
  const optionsCustList = Array.isArray(customerSelectList)
    ? customerSelectList.map((item) => ({
      id: item?.id,
      cId: item?.cId,
      label: item?.cCode,
      cName: item?.cName,
    }))
    : [];

  function onCustomerSelectChange(selectedValue, value) {
    setSelectedCustomerName(selectedValue?.cName);
    setCustomerSelect(selectedValue?.id);
    setCustomerName(selectedValue?.label);
    setcid(selectedValue?.cId);
    setCustomerSid(selectedValue?.cId);
    FetchCustomerAddress(
      {
        id: selectedValue?.cId,
      },
      handleFetchCustAddressSuccess,
      handleFetchCustAddressException
    );
  }

  const handleFetchCustAddressSuccess = (dataObject) => {
    setBillingAddress(dataObject?.data[0]?.cAddress || "");
    setShippingAddress(dataObject?.data[0]?.cAddress || "");
    setState(dataObject?.data[0]?.state || "");
    // setGstNo(dataObject?.data[0]?.gstNo || "");
    setPanNo(dataObject?.data[0]?.panNo || "");
  };

  const handleFetchCustAddressException = (errorStaus, errorMessage) => {
    console.log(errorMessage);
  };

  const handleChangeCustomer = (e) => {
    if (e !== null) {
      CustomerDropShowdata(
        { code: e.target.value },
        handleCustomerDropshow,
        handleCustomerDropshowException
      );
    }
  };

  const handleCustomerDropshow = (dataObject) => {
    setCustomerSelectList(dataObject?.data || []);
  };

  const handleCustomerDropshowException = (error, errorMessage) => {
    console.log(errorMessage);
  };

  const handleBillingTextFieldChange = (event) => {
    setBillingAddress(event.target.value);
  };

  const handleShippingTextFieldChange = (event) => {
    setShippingAddress(event.target.value);
    setGstNo(event.target.value);
    setPanNo(event.target.value);
  };

  const onModeTransportChange = (e) => {
    setModeOfTransport(e.target.value);
  };

  const ClearData = () => {
    setNrdcNo("");
    setAutoGen("");
    setAutoGenNDc("");
    setCustomerSelect("");
    setCustomerSelectList("");
    setCustomerSid("");
    setCustomerName("");
    setSelectedCustomerName("");
    setcid("");
    setBillingAddress("");
    setShippingAddress("");
    setPartNo("");
    setPartNoList([]);
    setChallenNo("");
    setChallenDate("");
    setModeOfTransport("");
    setVechicleNo("");
    setGstNo("");
    setPanNo("");
    setSubSupplyType("");
    setSubSupplyDesc("");
    setDocType("CHL");
    setTransactionType("");
    setModeOfType("");
    setDocketNo("");
    setTransportDate("");
    setTransporterMst("");
    setTransporterList([]);
    setTransporterGSTIN("");
    setDistanceKMS("");
    setShippingPincode("");
    setToStatecode("");
    setActualStateCode("");
    setRemarks("");
    setTotalQty("");
    setTotalAmt("");
    setCgstPercent("");
    setCGST("");
    setIgstPercent("");
    setIGST("");
    setSgstPercent("");
    setSGST("");
    setTotalValue("");
    setRows([]);
    setFromDate("");
    setToDate("");
    setChecked("");
    setSelectedItems([{ id: "RDL1" }]);
    // setSelectedDate(new Date());
    setSelectedDate("");
  };

  //PartNo select
  const handleChange = (e) => {
    PartNoSelectShow(
      {
        code: e.target.value,
        id: customerSelect,
      },
      handlePartNoDropshow,
      handlePartNoDropshowException
    );
  };

  const handlePartNoDropshow = (dataObject) => {
    setPartNoList(dataObject?.data || []);
    console.log("partList--", dataObject?.data);
  };

  const handlePartNoDropshowException = (error, errorMessage) => {
    console.log(errorMessage);
  };

  const optionsPartNoList = partNoList
    ? partNoList.map((item) => ({
      value: item?.id,
      label: item?.label,
    }))
    : [];

  function onPartNoSelectChange(selectedValue, event) {
    setPartNo(selectedValue?.value);
    setPartNoLabel(selectedValue?.label);
    PartNoSelect(
      {
        id: customerSelect,
        id2: selectedValue?.value,
      },
      handlePartNoShowSuccess,
      handlePartNoSelectException
    );
  }

  ///Selecting Items from Datagrid
  const handlePartNoShowSuccess = (dataObject) => {
    setGridLoading(false);
    const data = dataObject?.data || [];
    setRows(data);
    const formattedData = data.map((item) => ({
      id: item?.id || null,
      suppDesc: null,
      itemCode: item?.itemCode || "",
      itemName: item?.itemName || "",
      uom: item?.uom || "",
      fgItem: item?.fgItem || "",
      hsnCode: item?.hsnCode || "",
      invNo: item?.invNo || "",
      cdcNo: item?.cdcNo || "",
      cust_Dc_no: item?.cust_Dc_no || "",
      pendQty: item?.pendQty || "",
      qty: item?.qty || 0,
      newRate: item?.newRate || "",
      amt: item?.amt || 0,
    }));

    console.log("formattedData==", formattedData);

    if (formattedData.length > 0) {
      const clonedSelectedItems = [...selectedItems];
      const lastObj = clonedSelectedItems.pop();
      clonedSelectedItems.push(...formattedData, lastObj);
      setSelectedItems(clonedSelectedItems);
    }
  };

  const handlePartNoSelectException = (errorObject, errorMessage) => {
    setRows([]);
  };

  function normalizeAddress(address) {
    return address
      .toUpperCase() // Convert to same case
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/[.,]/g, "") // Remove punctuation
      .trim(); // Trim whitespace
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;

    if (!vechicleNo) {
      setVehicleNoError(true);
      isValid = false;
    } else {
      setVehicleNoError(false);
    }
    if (!remarks) {
      setRemarksError(true);
      isValid = false;
    } else {
      setRemarksError(false);
    }

    if (!transactionType) {
      setTransactionTypeError(true);
      isValid = false;
    } else {
      setTransactionTypeError(false);
    }

    if (!modeOfType) {
      setModeOfTypeError(true);
      isValid = false;
    } else {
      setModeOfTypeError(false);
    }

    if (!distanceKMS) {
      setDistanceKMSError(true);
      isValid = false;
    } else {
      setDistanceKMSError(false);
    }

    const normalizedBilling = normalizeAddress(billingAddress);
    const normalizedShipping = normalizeAddress(shippingAddress);

    // const normalizedDispatchFrom = normalizeAddress(dispatchFrom);
    // const normalizedDispatchFromCopy = normalizeAddress(dispatchFromCopy);
    // console.log("normalizedDispatchFrom", normalizedDispatchFrom);
    // console.log("normalizedDispatchFromCopy", normalizedDispatchFromCopy);

    if (Number(transactionType) === 1) {
      if (normalizedBilling !== normalizedShipping) {
        setNotification({
          status: true,
          type: "error",
          message: "Billing and Shipping must match",
        });
        return; // Stops execution if the addresses don't match
      }
    }

    // if (Number(transactionType) === 1) {
    //   if (normalizedDispatchFrom !== normalizedDispatchFromCopy) {
    //     setNotification({
    //       status: true,
    //       type: 'error',
    //       message: "Dispatch must use the default address for Regular transactions.",
    //     });
    //     return; // Stops execution if the addresses don't match
    //   }
    // }

    if (Number(transactionType) === 2) {
      // if (normalizedBilling === normalizedShipping) {
      if (
        normalizedBilling.toLowerCase() === normalizedShipping.toLowerCase()
      ) {
        setNotification({
          status: true,
          type: "error",
          message:
            "Billing and Shipping Address may not be the same if Transaction Type is Bill to Ship to",
        });
        return; // Stops execution if the addresses don't match
      }
    }

    // if (Number(transactionType) === 3) {
    //   if (normalizedDispatchFrom === normalizedDispatchFromCopy) {
    //     setNotification({
    //       status: true,
    //       type: 'error',
    //       message: "Dispatch From Address may not be the same if Transaction Type is Dispatch From",
    //     });
    //     return; // Stops execution if the addresses don't match
    //   }
    // }

    // if (Number(transactionType) === 4) {
    //   if (normalizedBilling === normalizedShipping) {
    //     setNotification({
    //       status: true,
    //       type: 'error',
    //       message: "Billing and Shipping Address may not be the same if Transaction Option 4",
    //     });
    //     return; // Stops execution if the addresses don't match
    //   }
    // }

    // if (Number(transactionType) === 4) {
    //   if (normalizedDispatchFrom === normalizedDispatchFromCopy) {
    //     setNotification({
    //       status: true,
    //       type: 'error',
    //       message: "Dispatch From Address may not be the same if Transaction Option 4",
    //     });
    //     return; // Stops execution if the addresses don't match
    //   }
    // }

    const purchaseOrderData = {
      digit: autogen,
      date: selectedDate,
      nrdcNo: autoGenNDc,
      custo: cId,
      billAdd: `${selectedCustomerName}"\n"${billingAddress}`,
      shipAdd: `${selectedCustomerName}"\n"${shippingAddress}`,
      challenNo: challenNo,
      gstno: gstNo,
      panNo: panNo,
      // totalValue: totalValue,
      modeOfDispatch: modeOfTransport,
      vechileNo: vechicleNo,
      transportDate: transportDate,
      transporter: transporterMst,
      transporterGstin: transporterGSTIN,
      distanceKms: distanceKMS,
      shippingPincode: shippingPincode,
      toStateCode: toStatecode,
      actualStateCode: actualStateCode,
      challenDate: challenDate,
      sub_supply_type: subSupplyType,
      sub_supply_desc: subSupplyDesc,
      Doc_Type: docType,
      Transaction_Type: transactionType,
      modeOfType: modeOfType,
      docketNo: docketNo,
      Remarks: remarks,
      totalQty: totalQty,
      total: totalAmt,
      // cgst: cgst,
      // sgst: sgst,
      // igst: igst,
      cgst: cgst,
      cgstPer: cgstPercent,
      sgst: sgst,
      sgstPer: sgstPercent,
      igst: igst,
      igstPer: igstPercent,
      totalValue: totalValue,
    };
    const purchaseOrderItemData = selectedItems.map((data) => ({
      id: data?.id,
      itemCode: data?.itemCode,
      itemName: data?.itemName,
      uom: data?.uom,
      fgItem: data?.fgItem,
      hsnCode: data?.hsnCode,
      invNo: data?.invNo,
      cdcNo: data?.cdcNo,
      cust_Dc_no: data?.cust_Dc_no,
      pendQty: data?.pendQty,
      qty: data?.qty,
      cdc_po: data?.cdc_po,
      newRate: data?.newRate,
      amt: data?.amt,
    }));

    // const updatedPurchaseOrderItemData = purchaseOrderItemData.slice(0, -1);
    const updatedPurchaseOrderItemData = purchaseOrderItemData.filter(
      (item) => item.id !== "RDL1"
    );

    const requestData = {
      purchaseOrderData: purchaseOrderData,
      purchaseOrderItemData: isEdit
        ? purchaseOrderItemData
        : updatedPurchaseOrderItemData,
      id: isEdit ? mainId : "",
      // id:poRowId
    };
    console.log("Request Data:", requestData);
    if (isEdit) {
      if (isValid) {
        setLoading(true);
        NonCustomerDcUpdate(requestData, handleSuccess, handleException);
      } else {
        setNotification({
          status: true,
          type: "error",
          message: "Please fill the required fields",
        });
      }
    } else {
      if (isValid) {
        setLoading(true);
        NonCustomerDcAdd(requestData, handleSuccess, handleException);
      } else {
        setNotification({
          status: true,
          type: "error",
          message: "Please fill the required fields",
        });
      }
    }
  };

  const handleSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      ClearData();
      NonDcAutoGen({ po: "NR" }, handlePoNoAutoGen, handlePoNoAutoGenException);
      setRefreshData((oldValue) => !oldValue);
      setLoading(false);
    }, 2000);
  };

  const handleException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      setRefreshData((oldValue) => !oldValue);
      setLoading(false);
    }, 2000);
  };

  const handleEdit = (cellNam, newValue, id, rowData) => {
    let updatedItems;

    switch (cellNam) {
      case "Qty":
        updatedItems = selectedItems.map((supp) =>
          supp.id === id
            ? {
              ...supp,
              qty: Number(newValue),
              amt: Number(newValue) * Number(rowData.newRate), // recalc amt
            }
            : supp
        );
        break;

      case "newRate":
        updatedItems = selectedItems.map((supp) =>
          supp.id === id
            ? {
              ...supp,
              newRate: Number(newValue),
              amt: Number(rowData.qty) * Number(newValue), // recalc amt
            }
            : supp
        );
        break;

      case "fgItem":
        updatedItems = selectedItems.map((supp) =>
          supp.id === id
            ? {
              ...supp,
              fgItem: Number(newValue),
            }
            : supp
        );
        break;

      case "invNo":
        updatedItems = selectedItems.map((supp) =>
          supp.id === id
            ? {
              ...supp,
              invNo: Number(newValue),
            }
            : supp
        );
        break;

      case "cdcNo":
        updatedItems = selectedItems.map((supp) =>
          supp.id === id
            ? {
              ...supp,
              cdcNo: Number(newValue),
            }
            : supp
        );
        break;

      case "cust_Dc_no":
        updatedItems = selectedItems.map((supp) =>
          supp.id === id
            ? {
              ...supp,
              cust_Dc_no: Number(newValue),
            }
            : supp
        );
        break;

      default:
        updatedItems = selectedItems;
    }

    setSelectedItems(updatedItems);
  };

  useEffect(() => {
    calculateTotals(selectedItems);
  }, [selectedItems]);

  const calculateTotals = (data) => {
    const totalQty = data.reduce(
      (acc, item) => acc + (Number(item.qty) || 0),
      0
    );
    console.log("totalQty", totalQty);
    setTotalQty(totalQty);

    const totalAmount = data.reduce(
      (acc, item) => acc + (Number(item.amt) || 0),
      0
    );
    console.log("totalAmount", totalAmount);
    setTotalAmt(parseFloat(totalAmount).toFixed(2));
  };

  useEffect(() => {
    var cgstAmount = (Number(totalAmt) * Number(cgstPercent)) / 100;
    setCGST(cgstAmount);

    var sgstAmount = (Number(totalAmt) * Number(sgstPercent)) / 100;
    setSGST(sgstAmount);

    var igstAmount = (Number(totalAmt) * Number(igstPercent)) / 100;
    setIGST(igstAmount);

    const finalAmt =
      Number(totalAmt) +
      Number(cgstAmount) +
      Number(sgstAmount) +
      Number(igstAmount);
    setTotalValue(parseFloat(finalAmt).toFixed(2));
  }, [cgstPercent, sgstPercent, igstPercent, totalValue, totalAmt]);

  const handleDeleteRow = (id) => {
    const newArray = selectedItems.filter((item) => item.id != id);
    setSelectedItems(newArray);
    // TO MINUS THE AMOUNT IN TOTAL_GRID
    // calculateTotals(newArray)
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOptionClick = (option) => {
    console.log(option);
    // Add your option-specific functionality here
    handleClose();
  };
  const handleLoadPendingDc = () => {
    setLoadPendingDcModal(true);
    setRemarks("Return After Rework");
    setSelectedAdditionalOption("DC");
  };

  const handleTableRowClick = () => {
    setDialogOpen(true);
    setRemarks("Return After JobWork #");
    setSelectedAdditionalOption("invoice");
    handleClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setLoadPendingDcModal(false);
    setDcLists([]);
    setLoadInvCheck([]);
  };

  // LOAD INVOICE
  const handleClickLoadInv = (e) => {
    console.log("id", e.target.value);
    // LoadNrdcInv({ id: e.target.value }, fromDate, toDate, handleLoadNrdcInvShow, handeLoadNrdcInvException);

    LoadDcInvoice(
      {
        id: customerSid,
        fromDate: fromDate,
        toDate: toDate,
      },
      handleShortCloseView,
      handleShortCloseException
    );
  };
  const handleShortCloseView = (dataObject) => {
    setRows(dataObject?.data || []);
  };

  const handleShortCloseException = (errorStaus, errorMessage) => {
    console.log(errorMessage);
  };

  // LOAD DC
  const handleClickLoadDC = (e) => {
    LoadDc(
      {
        id: customerSid,
        fromDate: fromDate,
        toDate: toDate,
      },
      handleLoadDcSuccess,
      handleLoadDcException
    );
  };

  const handleLoadDcSuccess = (dataObject) => {
    setDcLists(dataObject?.data || []);
  };

  const handleLoadDcException = (errorStaus, errorMessage) => {
    // console.log(errorMessage);
  };

  const columns1 = [
    {
      field: "sel",
      headerClassName: "super-app-theme--header",
      headerName: "Select",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox
          onChange={(event) => handleCheckboxChange(event, params)}
          inputProps={{ "aria-label": "controlled" }}
        />
      ),
    },
    {
      field: "custPoNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>PO No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "invNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Inv No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "date",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Inv Date</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "totalValue",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Inv Value</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const dC_columns = [
    {
      field: "sel",
      headerClassName: "super-app-theme--header",
      headerName: "Select",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Checkbox
          onChange={(event) => handleDcCheckboxChange(event, params)}
          inputProps={{ "aria-label": "controlled" }}
        />
      ),
    },
    {
      field: "cdcNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>CDC No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cust_Dc_no",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Cust DC No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "po_ref",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>PO Ref No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "customerDcDate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Cust DC Date
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const onTransporterMstChange = (e) => {
    setTransporterMst(e.target.value);
  };

  // INVOICE
  // const handleCheckboxChange = (event, params) => {
  //   if (event.target.checked) {
  //     setLoadInvCheck([...loadInvCheck, params.row]);
  //   } else {
  //     const filteredData = loadInvCheck.filter((item) => item.id !== params.id);
  //     setLoadInvCheck(filteredData);
  //   }
  // };

  // INVOICE CODE
  const handleCheckboxChange = (event, params) => {
    if (event.target.checked) {
      // Check if the item already exists
      const exists = loadInvCheck.some((item) => item.id === params.row.id);
      if (!exists) {
        setLoadInvCheck([...loadInvCheck, params.row]);
      }
    } else {
      // Remove the item if unchecked
      const filteredData = loadInvCheck.filter(
        (item) => item.id !== params.row.id
      );
      setLoadInvCheck(filteredData);
    }
  };

  const handleLoadInv = () => {
    // const lastObject = selectedItems.pop();
    // const mergeData = [...selectedItems, ...loadInvCheck];
    // mergeData.push(lastObject);
    // setSelectedItems(mergeData);
    // setDialogOpen(false);
    const updatedArray = loadInvCheck.map((item) => item.id);
    LoadDcInvoiceItems(
      { items: updatedArray },
      handleGetItemSuccess,
      handleGetItemException
    );
  };

  const handleGetItemSuccess = (dataObject) => {
    const lastObject = selectedItems.pop();
    const itemLists = dataObject.data || [];
    const mergeData = [...itemLists];
    mergeData.push(lastObject);
    setSelectedItems(mergeData);
    setDialogOpen(false);
    setLoadInvCheck([]);
    setRows([]);
  };
  const handleGetItemException = () => { };

  // DC CODE
  // const handleDcCheckboxChange = (event, params) => {
  //   // setSelectChecked(event.target.checked);
  //   if (event.target.checked) {
  //     setLoadDcCheck([...loadDcCheck, params.row]);
  //   } else {
  //     const filteredData = loadDcCheck.filter((item) => item.id !== params.id);
  //     setLoadDcCheck(filteredData);
  //   }
  // };

  const handleDcCheckboxChange = (event, params) => {
    if (event.target.checked) {
      // Check if the item already exists
      const exists = loadDcCheck.some((item) => item.id === params.row.id);
      if (!exists) {
        setLoadDcCheck([...loadDcCheck, params.row]);
      }
    } else {
      // Remove the item if unchecked
      const filteredData = loadDcCheck.filter(
        (item) => item.id !== params.row.id
      );
      setLoadDcCheck(filteredData);
    }
  };

  const handleLoadDc = () => {
    const updatedArray = loadDcCheck.map((item) => item.id);
    LoadDcItems(
      { items: updatedArray },
      handleDcItemSuccess,
      handleDcItemException
    );
  };

  const handleDcItemSuccess = (dataObject) => {
    const lastObject = selectedItems.pop();
    const itemLists = dataObject.data || [];
    const mergeData = [...itemLists];
    mergeData.push(lastObject);
    setSelectedItems(mergeData);
    setLoadPendingDcModal(false);
    setLoadDcCheck([]);
    setDcLists([]);
  };
  const handleDcItemException = () => { };

  const handleCheckboxChange1 = (event) => {
    setChecked(event.target.checked);
  };

  const DownloadNRDCTemplateSuccess = () => { };

  const DownloadNRDCTemplateException = () => { };

  const NRDCImportSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      setFile("");
    }, 2000);
  };

  const NRDCImportException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      setFile("");
    }, 2000);
  };

  // HANDLE FORWARD REVERSE HANDLER
  const handleForwardReverse = (type, id) => {
    NonReturnableDcPreview(
      { type: type, id: id },
      handleActionSuccess,
      handleActionException
    );
  };

  const handleActionSuccess = (dataObject) => {
    setIsPoView(true);
    const data = dataObject.data[0];
    setAutoGen(data?.digit || "");
    // setSelectedDate(data?.date || "");
    const rawDate = data?.date || ""; // Example: "28-02-2025"
    const formattedDate = rawDate ? convertToISO(rawDate) : "";
    setSelectedDate(formattedDate);
    setAutoGenNDc(data?.nrdcNo || "");
    setSelectedCustomerName(data?.custo || "");
    setBillingAddress(data?.billAdd || "");
    setShippingAddress(data?.shipAdd || "");
    setChallenNo(data?.challenNo || "");
    setChallenDate(data?.challenDate || "");
    setModeOfTransport(data?.modeOfDispatch || "");
    setVechicleNo(data?.vechileNo || "");
    setGstNo(data?.gstno || "");
    setPanNo(data?.panNo || "");
    setSubSupplyType(data?.sub_supply_type || "");
    setSubSupplyDesc(data?.sub_supply_desc || "");
    setDocType(data?.Doc_Type || "CHL");
    setTransactionType(data?.Transaction_Type || "");
    setModeOfType(data?.modeOfType || "");
    setDocketNo(data?.docketNo || "");
    setTransportDate(data?.transportDate || "");
    setTransporterMst(data?.transporter || "");
    setTransporterGSTIN(data?.transporterGstin || "");
    setDistanceKMS(data?.distanceKms || "");
    setShippingPincode(data?.shippingPincode || "");
    setToStatecode(data?.toStateCode || "");
    setActualStateCode(data?.actualStateCode || "");
    setState(data?.state || "");
    setRemarks(data?.Remarks || "");
    setTotalQty(data?.date || "");
    setTotalAmt(data?.date || "");
    setCgstPercent(data?.cgstPer || "");
    setCGST(data?.cgst || "");
    setIgstPercent(data?.igstPer || "");
    setIGST(data?.igst || "");
    setSgstPercent(data?.sgstPer || "");
    setSGST(data?.sgst || "");
    setTotalValue(data?.totalValue || "");
    setSelectedItems(dataObject?.data2 || []);
    setcid(data?.cust || "");
    setCustomerSelect(data?.cust || "");
    setMainId(data?.id || "");
    setIsEdit(false);

  };
  const handleActionException = () => { };

  const handleClearPage = () => {
    setIsPoView(false);
    setIsEdit(false);
    setMainId("");
    setNrdcNo("");
    setAutoGen("");
    setAutoGenNDc("");
    setCustomerSelect("");
    setCustomerSelectList("");
    setCustomerSid("");
    setCustomerName("");
    setSelectedCustomerName("");
    setcid("");
    setBillingAddress("");
    setShippingAddress("");
    setPartNo("");
    setPartNoList([]);
    setChallenNo("");
    setChallenDate(new Date());
    setModeOfTransport("");
    setVechicleNo("");
    setGstNo("");
    setPanNo("");
    setSelectedDate(new Date());
    setSubSupplyType("");
    setSubSupplyDesc("");
    setDocType("CHL");
    setTransactionType("");
    setModeOfType("");
    setDocketNo("");
    setTransportDate(new Date());
    setTransporterMst("");
    setTransporterGSTIN("");
    setDistanceKMS("");
    setShippingPincode("");
    setToStatecode("");
    setActualStateCode("");
    setRemarks("");
    setTotalQty("");
    setTotalAmt("");
    setCgstPercent("");
    setCGST("");
    setIgstPercent("");
    setIGST("");
    setSgstPercent("");
    setSGST("");
    setTotalValue("");
    setRows([]);
    setFromDate("");
    setToDate("");
    setChecked("");
    setVehicleNoError(false);
    setTransactionTypeError(false);
    setModeOfTypeError(false);
    setDistanceKMSError(false);
    setSelectedItems([{ id: "RDL1" }]);
    setDcLists([]);
    setSelectedAdditionalOption("");
    NonDcAutoGen({ po: "NR" }, handlePoNoAutoGen, handlePoNoAutoGenException);
    MstTransporterShowData(
      handleTransporterShow,
      handleTransportershowException
    );
  };

  // function convertToISO(dateStr) {
  //   // Split the "DD-MM-YYYY" format
  //   const [day, month, year] = dateStr.split('-');

  //   // Create a new Date object using "YYYY-MM-DD"
  //   const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

  //   return isoDate.toISOString(); // Convert to "YYYY-MM-DDTHH:mm:ss.SSSZ"
  // }
  function convertToISO(dateStr) {
    const isoDate = new Date(dateStr); // "2025-04-18"
    return isoDate.toISOString();
  }
  convertToISO("2025-04-18");

  const ExportNrdcSuccess = () => { };

  const ExportNrdcException = () => { };

  const deletehandleSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      // handleClose();
      setDeleteDailogOpen(false);
      handleClearPage();
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

  //SEARCH GENERATED GST INVOICE ENTRY
  const handlePOChange = (e) => {
    GetGeneratePoSaleOrderEntry(
      { type: "nonCustomerDc", code: e.target.value },
      handleGeneratedPoSucessShow,
      handleGeneratedPoExceptionShow
    );
  };

  const handleGeneratedPoSucessShow = (dataObject) => {
    setGeneratedCustDcLists(dataObject?.data || []);
  };
  const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => { };

  const handleGeneratedPoSelect = (selectedValue) => {
    setIsPoView(true);
    if (selectedValue !== null) {
      setMainId(selectedValue.id);
      NrdcViewing(
        { id: selectedValue.id },
        handleActionSuccess,
        handleActionException
      );
    }
  };

  useEffect(() => {
    const totalGst = parseFloat(
      ((Number(igst) || 0) + (Number(cgst) || 0) + (Number(sgst) || 0)).toFixed(
        2
      )
    );
    setGstNo(totalGst);
  }, [igst, cgst, sgst]);

  const invoiceHeader = [
    "ORIGINAL FOR CONSIGNEE",
    "DUPLICATE FOR TRANSPORTER",
    "TRIPLICATE FOR CONSIGNOR",
    "EXTRA COPY",
  ];

  const handleInvoiceSuccess = (dataObject) => {
    // handleFileSave(dataObject || [])
    const allBlobs = [];
    for (const headerName of invoiceHeader) {
      const blob = handleFileSave(dataObject, headerName);
      allBlobs.push(blob);
    }
    setPdfBlobs(allBlobs);
  };
  const handleInvoiceException = () => { };

  function emptyRowsToPush(lineItems) {
    const pageSize = 39,
      header = 20,
      footer = 9;
    const content = header + lineItems + footer;
    const totPage = Math.floor(content / pageSize) + 1;
    const totalContentSize = pageSize * totPage;
    const rowToPush = totalContentSize - content;
    return rowToPush;
  }

  const handleFileSave = (item, headerName) => {
    let info = [];
    item.data2.forEach((element, index, array) => {
      info.push([
        element.sNo,
        element.itemCode,
        element.itemName,
        element.hsnCode,
        element.cust_Dc_no,
        element.invNo,
        element.uom,
        element.nrdcQty,
        element.nrdcRate,
        element.nrdcAmt,
      ]);
    });

    // Ensure a minimum of 10 items
    // const minItems = 16;
    // const placeholderItem = [''];
    // while (info.length < minItems) {
    //   info.push([...placeholderItem]);
    // }

    const paddingNeeded = emptyRowsToPush(info.length);
    for (let i = 0; i < paddingNeeded; i++) {
      const emptyRow = ["", "", "", "", "", "", "", "", "", ""];
      emptyRow.isInfoRow = true; // Keep the same flag if you want same styling
      info.push(emptyRow);
    }

    const doc = new jsPDF();

    const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
    // console.log("baseUrl------------------>>>>>>>>>>>>>>", baseUrl);
    // const logoUrl = (await import('../../AllImage/RDL_Logo.png')).default;
    // const logoUrl = require("../../../AllImage/RDL_Logo.png");

    const logoUrl = `${baseUrl}/${item.data.companyImage}`
    const ISOUrl = require("../../../AllImage/Picture.png");

    const totalPagesExp = "{totalPages}"; // <-- Add this
    const tableOptions = {
      didDrawPage: (HookData) => {
        // Check if it's the first page
        if (HookData.pageNumber === 1) {
          // Add an image on the first page
          doc.addImage(logoUrl, "PNG", 21, 13, 28, 20);
          doc.addImage(ISOUrl, "PNG", 167, 10, 28, 14);
        }
        doc.setFontSize(9);
        doc.setTextColor('black');

        // PAGE NUMBER
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width || pageSize.getWidth();
        const pageHeight = pageSize.height || pageSize.getHeight();

        doc.setFontSize(8);
        doc.setTextColor(70);

        // Left-aligned footer text
        doc.text(
          `Regd. & Corporate Office: No.380A, 5th Main, Bilekahalli, Vijaya Bank Layout, Off. Bannergatta Road, Bangalore 560 076`,
          14, // X position (left margin)
          pageHeight - 10
        );

        // Right-aligned page number
        doc.text(
          `Page ${HookData.pageNumber} of ${totalPagesExp}`,
          pageWidth - 1, // X position (right margin)
          pageHeight - 10,
          { align: "right" } // Align text to the right
        );
      },
    };

    const logoAndAddress = [
      [
        {
          content: headerName,
          colSpan: 10,
          styles: {
            halign: "right",
            fontSize: 8,
            textColor: "black",
            lineWidth: 0,
          },
        },
      ],
      [
        {
          content: {
            image: logoUrl,
            width: 30, // adjust the width as needed
            height: 30, // adjust the height as needed
          },
          colSpan: 2,
        },
        {
          content:
            `${item.data.companyName}\n${item.data.companyAdd}. Tel:${item.data.telNo}\nWeb Site :${item.data.website}\nEmail : ${item.data.email}`,
          colSpan: 5,
          styles: { halign: "left", fontSize: 10, textColor: "black" },
        },
        {
          content: "ISO 9001 : 2015\nISO 14001 : 2015\nOHSAS 18001 : 2007",
          colSpan: 3,
          styles: {
            halign: "right",
            fontSize: 8,
            textColor: "black",
            valign: "bottom",
          },
        },
      ],
    ];
    const pan = [
      [
        {
          content: `PAN No.${item.data.cmpPanNo}`,
          colSpan: 2,
          styles: {
            halign: "center",
            fontSize: 8,
            textColor: "black",
            fontStyle: "bold",
          },
        },
        {
          content: `CIN No. ${item.data.cmpCinNo}`,
          colSpan: 2,
          styles: {
            halign: "center",
            fontSize: 8,
            textColor: "black",
            fontStyle: "bold",
          },
        },
        {
          content: `GSTINO. ${item.data.cmpGstNo}`,
          colSpan: 4,
          styles: {
            halign: "center",
            fontSize: 8,
            textColor: "black",
            fontStyle: "bold",
          },
        },
        {
          content: `No: ${item.data.nrdcNo}`,
          colSpan: 2,
          styles: {
            halign: "center",
            fontSize: 8,
            textColor: "black",
            fontStyle: "bold",
            fontWeight: "bold",
          },
        },
      ],
    ];
    const poHeader = [
      [
        {
          content: "DELIVERY CHALLAN",
          colSpan: 10,
          styles: { textColor: "black", fontStyle: "bold", fontWeight: "bold" },
        },
      ],
    ];
    const address = [
      [
        {
          content: "To:",
          colSpan: 5,
          styles: {
            cellPadding: { top: 0.5, bottom: 0, left: 1, right: 1 },

            halign: "left",
            valign: "top",
            fontSize: 8,
            textColor: "black",
            fontStyle: "bold",
          },
        },
        {
          content: "Ship To:",
          colSpan: 5,
          styles: {
            cellPadding: { top: 0.5, bottom: 0, left: 1, right: 1 },
            halign: "left",
            valign: "top",
            fontSize: 8,
            textColor: "black",
            fontStyle: "bold",
          },
        },
      ],
      [
        {
          content: `${item.data.cName}`,
          colSpan: 5,
          styles: {
            cellPadding: { top: 0, bottom: 0, left: 1, right: 1 },
            halign: 'left', valign: 'top', fontSize: 8, fontStyle: 'bold',
          }
        },
        {
          content: `${item.data.cName}`,
          colSpan: 5,
          styles: {
            cellPadding: { top: 0, bottom: 0, left: 1, right: 1 },
            halign: 'left', valign: 'top', fontSize: 8, fontStyle: 'bold',
          }
        }
      ],
      [
        {
          content: `\n${item.data.billAdd}\nPAN No: ${item.data.panNo}\nGST No: ${item.data.gstno}`,
          colSpan: 5,
          styles: {
            cellPadding: { top: -3, bottom: 0.7, left: 1, right: 2 },
            // lineColor: "#000000",
            halign: "left",
            valign: "top",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal",
          },
        },
        {
          content: `\n${item.data.shipAdd}\nPAN No: ${item.data.panNo}\nGST No: ${item.data.gstno}`,
          colSpan: 5,
          styles: {
            cellPadding: { top: -3, bottom: 0.7, left: 1, right: 1 },
            // lineColor: "#000000",
            halign: "left",
            valign: "top",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal",
          },
        },
      ],
      [
        {
          content: `Place of Supply & State : ${item.data.city} ${item.data.state}`,
          colSpan: 6,
          styles: {
            halign: "left",
            valign: "top",
            fontSize: 10,
            textColor: "black",
            fontStyle: "bold",
          },
        },
        {
          content: `State Code : ${item.data.toStateCode}`,
          colSpan: 4,
          styles: {
            halign: "left",
            valign: "top",
            fontSize: 10,
            textColor: "black",
            fontStyle: "bold",
          },
        },
      ],
    ];
    const firstHeaderRow = [
      [
        {
          content: `NRDC NO: ${item.data.nrdcNo}`,
          colSpan: 3,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            fontStyle: "bold",
            fontWeight: "bold",
          },
        },
        {
          content: `Challan No: ${item.data.challenNo} `,
          colSpan: 3,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            fontStyle: "bold",
            fontWeight: "bold",
          },
        },
        {
          content: `Mode of Trans: ${item.data.modeOfDispatch}`,
          colSpan: 4,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            fontStyle: "bold",
            fontWeight: "bold",
          },
        },
      ],
      [
        {
          content: `NRDC Date: ${item.data.date}`,
          colSpan: 3,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            fontStyle: "bold",
            fontWeight: "bold",
          },
        },
        {
          content: `Challan Date: ${item.data.challenDate}`,
          colSpan: 3,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            fontStyle: "bold",
            fontWeight: "bold",
          },
        },
        {
          content: `Vehicle No:${item.data.vechileNo}`,
          colSpan: 4,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            fontStyle: "bold",
            fontWeight: "bold",
          },
        },
      ],
    ];

    const secondHeaderRow = [
      [
        "SI No",
        `      Part Name      `,
        "Part Description ",
        "HSN /SAC",
        "DC No",
        "Invoice No",
        "UOM",
        "Qty",
        "Rate",
        "Amount",
      ],
    ];

    const headerRows = [
      ...logoAndAddress,
      ...pan,
      ...poHeader,
      ...address,
      ...firstHeaderRow,
      ...secondHeaderRow,
    ];

    const totalRow = [
      [
        {
          content: `Remarks :${item.data.Remarks}`,
          colSpan: 5,
          rowSpan: 1,
          styles: { halign: "left", fontSize: 10, textColor: "black" },
        },
        {
          content: "Total Qty",
          colSpan: 2,
          styles: {
            halign: "center",
            fontSize: 10,
            textColor: "black",
            fontstyle: "bold",
          },
        },
        {
          content: item.data.totalQty,
          colSpan: 3,
          styles: { halign: "right", fontSize: 10, textColor: "black" },
        },
      ],


      ...(item.data.cgstPer > 0
        ? [
          [
            {
              // content: `DC Issue Date : ${item.data.date}`,
              content: ``,
              colSpan: 5,
              rowSpan: 3,
              styles: { halign: "left", fontSize: 10, textColor: "black" },
            },
            {
              content: `CGST:@${item.data.cgstPer}`,
              colSpan: 2,
              styles: { halign: "center", fontSize: 10, textColor: "black" },
            },
            {
              content: item.data.cgst,
              colSpan: 3,
              styles: { halign: "right", fontSize: 10, textColor: "black" },
            },
          ],
        ]
        : [
          [
            {
              content: `DC Issue Date : ${item.data.date}`,
              colSpan: 5,
              rowSpan: 0,
              styles: { halign: "left", fontSize: 10, textColor: "black" },
            },
            {
              content: "Total Value",
              colSpan: 2,
              styles: { halign: "center", fontSize: 10, textColor: "black" },
            },
            {
              content: item.data.totalValue,
              colSpan: 3,
              styles: { halign: "right", fontSize: 10, textColor: "black" },
            },
          ],
        ]),

      // [
      //   {
      //     content: `SGST:@${item.data.sgstPer}`,
      //     colSpan: 2,
      //     styles: { halign: 'center', fontSize: 10, textColor: 'black' }
      //   },
      //   {
      //     content: item.data.sgst,
      //     colSpan: 3,
      //     styles: { halign: 'center', fontSize: 10, textColor: 'black' }
      //   },
      // ],
      ...(item.data.sgstPer > 0
        ? [
          [
            {
              content: `SGST:@${item.data.sgstPer}`,
              colSpan: 2,
              styles: { halign: "center", fontSize: 10, textColor: "black" },
            },
            {
              content: item.data.sgst,
              colSpan: 3,
              styles: { halign: "right", fontSize: 10, textColor: "black" },
            },
          ],
        ]
        : []),
      // [
      //   {
      //     content: 'Total Value',
      //     colSpan: 2,
      //     styles: { halign: 'center', fontSize: 10, textColor: 'black' }
      //   },
      //   {
      //     content: item.data.totalValue,
      //     colSpan: 3,
      //     styles: { halign: 'center', fontSize: 10, textColor: 'black' }
      //   },
      // ],
      ...(item.data.sgstPer > 0 || item.data.cgstPer > 0
        ? [
          [
            {
              content: "Total Value",
              colSpan: 2,
              styles: { halign: "center", fontSize: 10, textColor: "black" },
            },
            {
              content: item.data.totalValue,
              colSpan: 3,
              styles: { halign: "right", fontSize: 10, textColor: "black" },
            },
          ],
        ]
        : []),
      [
        {
          content: "Subject to Bengaluru Jurisdiction",
          colSpan: 10,
          rowSpan: 1,
          styles: { halign: "left", fontSize: 10, textColor: "black" },
        },
      ],
    ];


    const termsAndSuppluColumn = [
      [
        // Receiver's Signature
        {
          content: `Receiver's Signature`,
          colSpan: 2,
          styles: {
            halign: "center",
            fontSize: 9,
            textColor: "black",
            valign: "bottom",
            cellPadding: { top: 20, bottom: 2 }, // Top padding for signature space
          },
        },

        // Prepared By
        {
          content: `Prepared By ${item?.data?.createdBy || ""}`,
          colSpan: 1,
          styles: {
            halign: "center",
            fontSize: 9,
            textColor: "black",
            valign: "bottom",
            cellPadding: { top: 20, bottom: 2 },
          },
        },

        // Reviewed By
        {
          content: `Reviewed By`,
          colSpan: 2,
          styles: {
            halign: "center",
            fontSize: 9,
            textColor: "black",
            valign: "bottom",
            cellPadding: { top: 20, bottom: 2 },
          },
        },

        // Authorized Signatory with company name
        {
          content: `For RDL Technologies Pvt Ltd.\n\n\n\n\nAuthorized Signatory`,
          colSpan: 5,
          styles: {
            halign: "center", // Center-align text
            fontSize: 9,
            textColor: "black",
            valign: "bottom",
            cellPadding: { top: 8, bottom: 2 }, // Space for signature
            lineColor: [0, 0, 0],
          },
        },
      ],
    ];

    //Table Border lines
    // const outerTable = [
    //   [
    //     {
    //       content: 'Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076',
    //       colSpan: 9,
    //       styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', lineWidth: 0 }
    //     },
    //   ],

    // ];

    const bodyRows = [...info, ...totalRow, ...termsAndSuppluColumn];
    // const footRows = [...outerTable]

    // doc.autoTable({
    //   theme: "striped",
    //   head: headerRows,
    //   body: bodyRows,
    //   // foot: footRows,
    //   showHead: "firstPage",
    //   showFoot: "lastPage",
    //   startY: 2,
    //   ...tableOptions,
    //   headStyles: {
    //     fillColor: [255, 255, 255], // Header background color
    //     textColor: [0, 0, 0], // Header text color
    //     halign: "center", // Header text alignment
    //     valign: "middle", // Vertical alignment
    //     lineWidth: 0, // Border width
    //     lineColor: [0, 0, 0], // Border color,
    //     font: "times",
    //   },
    //   bodyStyles: {
    //     fillColor: [255, 255, 255], // Header background color
    //     textColor: [0, 0, 0], // Header text color
    //     halign: "center", // Header text alignment
    //     valign: "middle", // Vertical alignment
    //     lineWidth: 0, // Border width
    //     lineColor: [0, 0, 0], // Border color
    //     fontStyle: "normal",
    //     fontSize: 8,
    //     font: "times",
    //     cellWidth: "auto", // avoids wrapping
    //   },
    //   footStyles: {
    //     fillColor: [255, 255, 255], // Header background color
    //     textColor: [0, 0, 0], // Header text color
    //     halign: "center", // Header text alignment
    //     valign: "middle", // Vertical alignment
    //     lineWidth: 0.1, // Border width
    //     lineColor: [0, 0, 0], // Border color
    //     font: "times",
    //   },
    //   didParseCell: function (data) {
    //     if (data.section === "body") {
    //       // data.cell.styles.overflow = 'visible'; // avoids line break
    //       // data.cell.styles.overflow = 'hidden'; // avoids line break
    //       data.cell.styles.overflow = "ellipsize"; // avoids line break
    //     }
    //   },

    //   didDrawCell: function (data) {
    //     const { cell, row, doc } = data;

    //     // Figure out the exact row indexes of the "To:" and address rows
    //     const totalBeforeAddress =
    //       logoAndAddress.length + pan.length + poHeader.length;
    //     const toRow = totalBeforeAddress; // "To:" / "Ship To:"
    //     const addressRow = toRow + 1; // M/s. address content

    //     // === 1. "To:" and "Ship To:" row ===
    //     if (data.section === "head" && row.index === toRow) {
    //       doc.setDrawColor(0, 0, 0);
    //       doc.setLineWidth(0.1);

    //       // top border
    //       doc.line(cell.x, cell.y, cell.x + cell.width, cell.y);
    //       // left border
    //       doc.line(cell.x, cell.y, cell.x, cell.y + cell.height);
    //       // right border
    //       doc.line(
    //         cell.x + cell.width,
    //         cell.y,
    //         cell.x + cell.width,
    //         cell.y + cell.height
    //       );
    //       // ❌ Skip bottom border
    //     }

    //     // === 2. M/s. address content row ===
    //     else if (data.section === "head" && row.index === addressRow) {
    //       doc.setDrawColor(0, 0, 0);
    //       doc.setLineWidth(0.1);

    //       // left border
    //       doc.line(cell.x, cell.y, cell.x, cell.y + cell.height);
    //       // right border
    //       doc.line(
    //         cell.x + cell.width,
    //         cell.y,
    //         cell.x + cell.width,
    //         cell.y + cell.height
    //       );
    //       // bottom border
    //       doc.line(
    //         cell.x,
    //         cell.y + cell.height,
    //         cell.x + cell.width,
    //         cell.y + cell.height
    //       );
    //       // ❌ Skip top border
    //     }

    //     // === 3. Draw all borders for other cells ===
    //     else {
    //       doc.setDrawColor(0, 0, 0);
    //       doc.setLineWidth(0.1);
    //       // top
    //       doc.line(cell.x, cell.y, cell.x + cell.width, cell.y);
    //       // left
    //       doc.line(cell.x, cell.y, cell.x, cell.y + cell.height);
    //       // right
    //       doc.line(
    //         cell.x + cell.width,
    //         cell.y,
    //         cell.x + cell.width,
    //         cell.y + cell.height
    //       );
    //       // bottom
    //       doc.line(
    //         cell.x,
    //         cell.y + cell.height,
    //         cell.x + cell.width,
    //         cell.y + cell.height
    //       );
    //     }
    //   },
    // });

    doc.autoTable({
      theme: "striped",
      head: headerRows,
      body: bodyRows,
      showHead: "firstPage", // ❌ otherwise will double headers
      showFoot: "lastPage",
      startY: 2,
      ...tableOptions,

      columnStyles: {
        2: { cellWidth: 63 },
      },  // Part Description
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        halign: "center",
        valign: "middle",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        font: "times",
        fontSize: 8,
      },

      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        halign: "center",
        valign: "middle",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        fontStyle: "normal",
        fontSize: 8,
        font: "times",
        cellWidth: "auto",
      },

      footStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        halign: "center",
        valign: "middle",
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        font: "times",
      },

      // ✅ repeat header manually like Purchase Bill
      // didDrawPage: function (data) {
      //   if (data.pageNumber > 1) {
      //     const headers = [

      //         "SI No",
      //         `      Part Name      `,
      //         "Part Description ",
      //         "HSN /SAC",
      //         "DC No",
      //         "Invoice No",
      //         "UOM",
      //         "Qty",
      //         "Rate",
      //         "Amount",

      //     ];
      didDrawPage: function (data) {
        if (data.pageNumber === 1) {
          // 🔥 Show logo + header only on first page
          doc.addImage(logoUrl, 'PNG', 18, 18, 28, 15);
          doc.addImage(ISOUrl, 'PNG', 164, 11, 28, 12);
        } else {
          // 🔥 Repeat headers manually on 2nd page onwards
          const headers = [

            "SI No",
            `      Part Name      `,
            "Part Description ",
            "HSN /SAC",
            "DC No",
            "Invoice No",
            "UOM",
            "Qty",
            "Rate",
            "Amount",

          ];
          const startX = data.settings.margin.left;
          const headerHeight = 9;
          let y = data.settings.margin.top - headerHeight;

          doc.setFont("times", "bold");
          doc.setFontSize(8);
          doc.setTextColor(0);

          let x = startX;
          data.table.columns.forEach((col, i) => {
            const width = col.width;
            doc.rect(x, y, width, headerHeight);
            doc.text(headers[i].trim(), x + width / 2, y + 6, {
              align: "center",
              baseline: "middle",
            });
            x += width;
          });
          doc.setFont('times', 'normal');
          doc.setFontSize(9);
          doc.setTextColor('black');
          doc.text(
            `NRDC No : ${item.data.nrdcNo}     |     Date : ${item.data.date}`,
            startX,
            y - 0.70 // above header; use y + headerHeight + 2 to put it below instead
          );
        }
        // ✅ footer (page numbers)
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width || doc.internal.pageSize.getWidth();
        const pageHeight = pageSize.height || doc.internal.pageSize.getHeight();

        doc.setFontSize(8);
        doc.setTextColor(70);
        doc.text("FORMAT NO:IMS-ME-PUR-F-220-Rev-2 Dated 14-01-2019", 14, pageHeight - 10);
        doc.text(`Page ${data.pageNumber} of ${totalPagesExp}`, pageWidth - 14, pageHeight - 10, { align: "right" });
      },

      didParseCell: function (data) {
        // Suppress default borders for the address section rows
        if (data.section === "head") {
          const totalBeforeAddress = logoAndAddress.length + pan.length + poHeader.length;
          const toRow = totalBeforeAddress;     // "To / Ship To"
          const companyRow = toRow + 1;         // Company name
          const addressRow = toRow + 2;         // Address block

          // ✳️ Keep your existing suppression for label + address
          if (data.row.index === toRow || data.row.index === addressRow) {
            data.cell.styles.lineWidth = 0; // disable AutoTable's borders fully
          }

          // ✅ NEW: Remove bottom border from the Company Name row only
          if (data.row.index === companyRow) {
            data.cell.styles.lineWidth = { top: 0, right: 0.1, bottom: 0, left: 0.1 };
            data.cell.styles.lineColor = [255, 255, 255]; // ensure no faint gray line remains
          }
        }

        // === Your existing BODY section (unchanged) ===
        if (data.section === "body") {
          data.cell.styles.overflow = "linebreak";
          data.cell.styles.fillColor = false;

          const colIndex = data.column.index;
          if (!(data.cell.colSpan > 1)) {
            const c7 = data.row.cells?.[7]?.raw;
            const c8 = data.row.cells?.[8]?.raw;
            const c9 = data.row.cells?.[9]?.raw;
            const isNumeric = (v) =>
              v !== undefined && v !== null && !isNaN(parseFloat(String(v).toString().replace(/,/g, "")));
            const isItemsRow = isNumeric(c7) || isNumeric(c8) || isNumeric(c9);

            if (isItemsRow) {
              if (colIndex === 1 || colIndex === 2) {
                data.cell.styles.halign = "left";
              } else if (colIndex === 6 || colIndex === 7 || colIndex === 8 || colIndex === 9) {
                data.cell.styles.halign = "right";
              } else if (colIndex === 0 || colIndex === 3 || colIndex === 4 || colIndex === 5) {
                data.cell.styles.halign = "center";
              }
            } else {
              const rawText = typeof data.cell.raw === "string" ? data.cell.raw : "";
              if (rawText && /\bPrepared By\b/i.test(rawText)) {
                data.cell.styles.halign = "left";
              }
            }
          }
        }
      },

      didDrawCell: function (data) {
        const { cell, row, doc } = data;

        const totalBeforeAddress = logoAndAddress.length + pan.length + poHeader.length;
        const toRow = totalBeforeAddress;         // "To / Ship To"
        const companyRow = toRow + 1;             // Company name
        const addressRow = toRow + 2;             // Address block

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.1);

        if (data.section === "head" && row.index === toRow) {
          // 🧩 Remove bottom line for "To:" / "Ship To:" row
          // Draw only top, left, and right borders (no bottom)
          doc.line(cell.x, cell.y, cell.x + cell.width, cell.y); // top
          doc.line(cell.x, cell.y, cell.x, cell.y + cell.height); // left
          doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height); // right
          // ❌ Skip drawing bottom intentionally

        } else if (data.section === "head" && row.index === companyRow) {
          // 🧩 Remove bottom border for the company name row
          doc.line(cell.x, cell.y, cell.x, cell.y + cell.height); // left
          doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height); // right
          // doc.line(cell.x, cell.y, cell.x + cell.width, cell.y); // top only

        } else if (data.section === "head" && row.index === addressRow) {
          // Left + right borders only (no bottom)
          const prevColor = doc.getDrawColor ? doc.getDrawColor() : null;
          doc.setDrawColor(255, 255, 255);
          doc.setLineWidth(0.6);
          doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height);
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.1);
          doc.line(cell.x, cell.y, cell.x, cell.y + cell.height);
          doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height);

        } else if (data.section === "head" && row.index === addressRow + 2) {
          // First row after address block: restore full borders including top
          doc.line(cell.x, cell.y, cell.x, cell.y + cell.height);
          doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height);
          doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height);

          if (data.column.index === data.table.columns.length - 1) {
            const firstCol = data.table.columns[0];
            const lastCol = data.table.columns[data.table.columns.length - 1];
            const startXTop = firstCol.x;
            const endXTop = lastCol.x + lastCol.width;
            const yTop = cell.y;
            doc.line(startXTop - 0.2, yTop, endXTop + 0.2, yTop);
          }

        } else {
          // Normal full border
          doc.line(cell.x, cell.y, cell.x + cell.width, cell.y);
          doc.line(cell.x, cell.y, cell.x, cell.y + cell.height);
          doc.line(cell.x + cell.width, cell.y, cell.x + cell.width, cell.y + cell.height);
          doc.line(cell.x, cell.y + cell.height, cell.x + cell.width, cell.y + cell.height);
        }
      },


    });


    // doc.save('PurchaseOrder.pdf');
    // const pdfBlob = doc.output('blob');
    // const pdfBlobUrl = URL.createObjectURL(pdfBlob);
    // setPdfUrl(pdfBlobUrl);

    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp); // This replaces "{totalPages}" in all pages
    }

    const pdfBlob = doc.output("blob");
    return pdfBlob; // ✅ Return the blob instead of setting state
  };

  const mergeJsPdfBlobs = async (blobs) => {
    const mergedPdf = await PDFDocument.create();

    for (const blob of blobs) {
      const arrayBuffer = await blob.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const mergedBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });
    return URL.createObjectURL(mergedBlob);
  };

  useEffect(() => {
    const generateMergedPdf = async () => {
      if (pdfBlobs.length > 0) {
        const mergedUrl = await mergeJsPdfBlobs(pdfBlobs);
        setMergedPdfUrl(mergedUrl);
      }
    };

    generateMergedPdf();
  }, [pdfBlobs]);

  useEffect(() => {
    if (Number(subSupplyType) === 4) {
      setSubSupplyDesc("Job Work");
    } else if (Number(subSupplyType) === 5) {
      setSubSupplyDesc("For Own Use");
    } else if (Number(subSupplyType) === 8) {
      setSubSupplyDesc("Others");
    } else {
      setSubSupplyDesc("");
    }
  }, [subSupplyType]);

  // UNIQUE CODE MANUAL CHANGE
  const handleUniqueCodeChange = (e) => {
    const newUniqueCode = e.target.value;
    const currentYear = autoGenNDc.split("/")[0]; // Get last 2 digits of the year
    setAutoGen(newUniqueCode /*.toString().padStart(5,0)*/);
    setAutoGenNDc(
      `${currentYear}/NR/${newUniqueCode.toString().padStart(5, 0)}`
    );
  };

  const getJsonSuccess = async (dataObject) => {
    try {
      // Create a Blob from the JSON data
      const jsonBlob = new Blob([JSON.stringify(dataObject, null, 2)], {
        type: "application/json",
      });
      // Create a link element
      const link = document.createElement("a");
      link.href = URL.createObjectURL(jsonBlob);
      link.download = "NRDC.json"; // Filename for the downloaded file
      // Programmatically click the link to trigger the download
      link.click();
      // Clean up the object URL
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error fetching API:", error);
    }
  };
  const getJsonExceptoin = () => { };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    // Trigger the hidden file input click
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("File selected:", file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      console.log("Base64 string:", base64String);

      NRDCImportrequest(
        { id: customerSelect, file: base64String },
        handleImport,
        handleImportException
      );
    };
    reader.readAsDataURL(file);

    // 🔑 Reset input so selecting the same file again still triggers onChange
    event.target.value = "";
  };

  const handleImport = (dataObject) => {
    setSelectedItems(dataObject.data);
  };
  const handleImportException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginLeft: "10px",
          marginTop: "10px",
        }}
      >
        <Typography
          sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
          variant="h5"
        >
          {isPOView
            ? "View Non Returnable DC"
            : isEdit
              ? "Edit Non Returnable DC"
              : "New Non Returnable DC"}
        </Typography>
        <div style={{ width: "250px", marginRight: "10px" }}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={generatedCustDcLists}
            fullWidth
            // value={selectedGeneratedPo}
            getOptionLabel={(option) =>
              option.digit || /*selectedGeneratedPo*/ ""
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search DC"
                onChange={handlePOChange}
              />
            )}
            onChange={(event, value) => handleGeneratedPoSelect(value)}
            size="small"
            style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
          />
        </div>
      </div>
      <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
        <Grid container padding={1}>
          <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">NR</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="NRDC No"
                    placeholder="NRDC No"
                    size="small"
                    disabled
                    style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                    value={nrdcNo}
                    onChange={(e) => onNrdcNoChange(e)}
                  >
                    <MenuItem value="EX">CDC2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <TextField
                  fullWidth
                  readOnly={true}
                  value={autogen}
                  onChange={handleUniqueCodeChange}
                  size="small"
                  disabled={isPOView ? true : false}
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <TextField
                  fullWidth
                  label="Date"
                  placeholder="Date"
                  variant="outlined"
                  required
                  type="Date"
                  size="small"
                  disabled={isPOView ? true : false}
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  value={formatDate(selectedDate)}
                  // value={date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <TextField
                  fullWidth
                  readOnly={true}
                  value={autoGenNDc}
                  size="small"
                  disabled={isPOView ? true : false}
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="combo-box-demo"
                  value={selectedCustomerName}
                  options={optionsCustList}
                  disabled={isPOView ? true : false}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Customer "
                      onChange={handleChangeCustomer}
                    />
                  )}
                  onChange={(event, value) =>
                    onCustomerSelectChange(value, event)
                  }
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={3}
                  lg={3}
                  xl={3}
                  style={{ float: "right" }}
                >
                  {!isPOView && (
                    <Button
                      variant="text"
                      disabled={billingAddress.length === 0}
                      onClick={() => {
                        setSelectedChangeAddress("billing");
                        setChangeAddressModalOpen(true);
                      }}
                    >
                      Change
                    </Button>
                  )}
                </Grid>
                <TextField
                  fullWidth
                  id="outlined-multiline-static"
                  label="Billing Address"
                  multiline
                  rows={3}
                  disabled={true}
                  value={`${selectedCustomerName ? selectedCustomerName : ""}${selectedCustomerName && "\n"
                    }${billingAddress}`}
                  onChange={handleBillingTextFieldChange}
                  readOnly={true}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={3}
                  lg={3}
                  xl={3}
                  style={{ float: "right", marginTop: "0px" }}
                >
                  {!isPOView && (
                    <Button
                      variant="text"
                      disabled={shippingAddress.length > 0 ? false : true}
                      onClick={() => {
                        setSelectedChangeAddress("shipping");
                        setChangeAddressModalOpen(true);
                      }}
                    >
                      Change
                    </Button>
                  )}
                </Grid>
                <TextField
                  fullWidth
                  id="outlined-multiline-static"
                  label="Shipping Address"
                  multiline
                  rows={3}
                  disabled={true}
                  value={`${selectedCustomerName ? selectedCustomerName : ""}${selectedCustomerName && "\n"
                    }${shippingAddress}`}
                  // onChange={handleShippingTextFieldChange}
                  inputRef={shipToTextFieldRef}
                  readOnly={true}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                lg={4}
                xl={4}
                style={{ float: "right" }}
              >
                {/* <Button
                  variant="contained"
                  type="button"
                  style={{
                    backgroundColor: "#002d68",
                  }}
                  onClick={handleClick}
                >
                  Additional Options
                </Button> */}
                <Button
                  variant="contained"
                  type="button"
                  style={getHighlightStyle("AdditionalOptions", {
                    backgroundColor: isModuleLocked ? "grey" : "#002d68",
                  })}
                  onClick={(event) => {
                    setActiveButton("AdditionalOptions"); // 🔵 highlight
                    handleClick(event);                        // ✅ existing logic
                  }}
                  disabled={isModuleLocked}
                >
                  Additional Options
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    value={"Load pending Invoice"}
                    onClick={handleTableRowClick}
                  >
                    Load Pending Invoice
                  </MenuItem>

                  <MenuItem onClick={handleLoadPendingDc}>
                    Load Pending DC
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleOptionClick("import items from excel")}
                  >
                    Import Items from Excel
                  </MenuItem>
                </Menu>
              </Grid>
              {showButton && (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={3}
                  lg={3}
                  xl={3}
                  style={{ float: "right" }}
                >
                  {/* <Button
                    variant="contained"
                    type="button"
                    style={{
                      backgroundColor: "#002d68",
                    }}
                    onClick={() => setLoadPendingDelNote(true)}
                  >
                    Load Pending Del Note
                  </Button> */}
                  <Button
                    variant="contained"
                    type="button"
                    style={getHighlightStyle("LoadPendingDelNote", {
                      backgroundColor: isModuleLocked ? "grey" : "#002d68",
                    })}
                    onClick={() => {
                      setActiveButton("LoadPendingDelNote"); // 🔵 highlight
                      setLoadPendingDelNote(true);           // ✅ existing logic
                    }}
                    disabled={isModuleLocked}
                  >
                    Load Pending Del Note
                  </Button>

                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={0.5} lg={0.5} xl={0.5}></Grid>
          <Grid item xs={12} sm={12} md={6.5} lg={4.5} xl={4.5}>
            <Card
              style={{
                boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                marginTop: "0px",
                borderRadius: "10px",
                width: "100%",
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
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          Challen No
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            // required
                            disabled={isPOView ? true : false}
                            value={challenNo}
                            onChange={(e) => setChallenNo(e.target.value)}
                            size="small"
                            InputProps={{
                              sx: {
                                height: "24px",
                                "& .MuiInputBase-input": {
                                  padding: "0 8px",
                                  fontSize: "12px",
                                },
                              },
                            }}
                            InputLabelProps={{
                              sx: {
                                lineHeight: "1.2",
                                fontSize: "12px",
                              },
                            }}
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
                          Total Amount
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            required
                            disabled={isPOView ? true : false}
                            value={totalAmt}
                            size="small"
                            InputProps={{
                              sx: {
                                height: "24px",
                                "& .MuiInputBase-input": {
                                  padding: "0 8px",
                                  fontSize: "12px",
                                },
                              },
                            }}
                            InputLabelProps={{
                              sx: {
                                lineHeight: "1.2",
                                fontSize: "12px",
                              },
                            }}
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
                          Total GST
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            required
                            disabled={isPOView ? true : false}
                            value={gstNo}
                            size="small"
                            InputProps={{
                              sx: {
                                height: "24px",
                                "& .MuiInputBase-input": {
                                  padding: "0 8px",
                                  fontSize: "12px",
                                },
                              },
                            }}
                            InputLabelProps={{
                              sx: {
                                lineHeight: "1.2",
                                fontSize: "12px",
                              },
                            }}
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
                          Total Value
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            required
                            disabled={isPOView ? true : false}
                            value={totalValue}
                            onChange={(e) => setTotalValue(e.target.value)}
                            size="small"
                            InputProps={{
                              sx: {
                                height: "24px",
                                "& .MuiInputBase-input": {
                                  padding: "0 8px",
                                  fontSize: "12px",
                                },
                              },
                            }}
                            InputLabelProps={{
                              sx: {
                                lineHeight: "1.2",
                                fontSize: "12px",
                              },
                            }}
                          />
                        </td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <td
                          colSpan="2"
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            textAlign: "right",
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            style={getHighlightStyle("ViewMore", {
                              marginLeft: "8px",
                              height: "30px",
                              backgroundColor: isModuleLocked ? "grey" : "#002d68",
                            })}
                            onClick={() => {
                              setActiveButton("ViewMore"); // 🔵 highlight
                              handleViewMore();            // ✅ existing logic
                            }}
                            disabled={isModuleLocked}
                          >
                            View More
                          </Button>

                        </td>
                      </tr>
                    </table>
                    <Dialog
                      maxWidth="xl"
                      fullWidth
                      open={isModalOpen}
                      onClose={handleCloseModal}
                    >
                      {/* <DialogTitle>More Information</DialogTitle> */}
                      <DialogContent>
                        <Grid container spacing={2} padding={1}>
                          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <Card
                              style={{
                                boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                                marginTop: "0px",
                                width: "100%",
                                overflow: "auto",
                              }}
                            >
                              <CardContent>
                                <Grid container spacing={2}>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                  >
                                    <Typography variant="h5" gutterBottom>
                                      Transport Details
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">
                                        Mode of Transport
                                      </InputLabel>
                                      <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={modeOfTransport}
                                        size="small"
                                        label="Mode of Transport"
                                        placeholder="Mode of Transport"
                                        onChange={(e) =>
                                          onModeTransportChange(e)
                                        }
                                      >
                                        <MenuItem value={"By Road"}>
                                          By Road
                                        </MenuItem>
                                        <MenuItem value={"By Air"}>
                                          By Air
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      required
                                      label="Vechile No"
                                      placeholder="Vechile No"
                                      disabled={isPOView ? true : false}
                                      value={vechicleNo}
                                      error={
                                        vehicleNoError && vechicleNo === ""
                                      }
                                      helperText={
                                        vehicleNoError && vechicleNo === ""
                                          ? "Vehicle Number is required"
                                          : ""
                                      }
                                      onBlur={() => setVehicleNoError(true)}
                                      onChange={(e) => {
                                        // setVechicleNo(e.target.value)
                                        if (e.target.value.length <= 10) {
                                          setVechicleNo(e.target.value);
                                        }
                                      }}
                                      inputProps={{ maxLength: 10 }}
                                      size="small"
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                  >
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      required
                                      label="Transporter Date"
                                      placeholder="Transporter Date"
                                      type="date"
                                      size="small"
                                      disabled={isPOView ? true : false}
                                      onChange={(e) => {
                                        setTransportDate(e.target.value);
                                      }}
                                      value={formatDate(transportDate)}
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                  >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label">
                                        Transporter Mst
                                      </InputLabel>
                                      <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        size="small"
                                        label="Transporter Mst"
                                        placeholder="Transporter Mst"
                                        value={transporterMst}
                                        disabled={isPOView ? true : false}
                                        //   onChange={(e) =>
                                        //     onTransporterMstChange(e)
                                        //   }
                                        // >
                                        //   {transporterList?.map((data, index) => {
                                        //     return (
                                        //       <MenuItem
                                        //         value={data.id}
                                        //         key={index}
                                        //       >
                                        //         {data.transportName}
                                        //       </MenuItem>
                                        //     );
                                        //   })}
                                        onChange={(e) => {
                                          const selectedId = e.target.value;
                                          const selectedTransporter =
                                            transporterList.find(
                                              (data) => data.id === selectedId
                                            );
                                          setTransporterMst(selectedId);
                                          setTransporterGSTIN(
                                            selectedTransporter?.gstin || ""
                                          );
                                        }}
                                      >
                                        {transporterList?.map((data, index) => (
                                          <MenuItem value={data.id} key={index}>
                                            {data.transportName}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                  >
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label="Transporter GSTIN"
                                      placeholder="Transporter GSTIN"
                                      disabled={isPOView ? true : false}
                                      value={transporterGSTIN}
                                      onChange={(e) =>
                                        setTransporterGSTIN(e.target.value)
                                      }
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label="Distance KMS"
                                      placeholder="Distance KMS"
                                      value={distanceKMS}
                                      disabled={isPOView ? true : false}
                                      onChange={(e) => {
                                        setDistanceKMS(e.target.value);
                                        setDistanceKMSError(false);
                                      }}
                                      error={
                                        distanceKMSError && distanceKMS === ""
                                      }
                                      helperText={
                                        distanceKMSError && distanceKMS === ""
                                          ? "Distance KMS is required"
                                          : ""
                                      }
                                      onBlur={() => setDistanceKMSError(true)}
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label="Shipping Pincode"
                                      placeholder="Shipping Pincode"
                                      value={shippingPincode}
                                      disabled={isPOView ? true : false}
                                      onChange={(e) =>
                                        setShippingPincode(e.target.value)
                                      }
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label="To State code"
                                      placeholder="To State code"
                                      value={toStatecode}
                                      disabled={isPOView ? true : false}
                                      onChange={(e) =>
                                        setToStatecode(e.target.value)
                                      }
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label="Actual State Code"
                                      placeholder="Actual State Code"
                                      value={actualStateCode}
                                      disabled={isPOView ? true : false}
                                      onChange={(e) =>
                                        setActualStateCode(e.target.value)
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <Card
                              style={{
                                boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                                marginTop: "0px",
                                width: "100%",
                                overflow: "auto",
                              }}
                            >
                              <CardContent>
                                <Grid container spacing={2}>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                  >
                                    <Typography variant="h5" gutterBottom>
                                      Other Details
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                  >
                                    <TextField
                                      fullWidth
                                      size="small"
                                      type="date"
                                      label="Challen Date"
                                      placeholder="Challen Date"
                                      value={formatDate(challenDate)}
                                      onChange={(e) => {
                                        setChallenDate(e.target.value);
                                      }}
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      required
                                      label="Sub Supply Type"
                                      placeholder="Sub Supply Type"
                                      onFocus={() =>
                                        setFocusedField("subSupplyType")
                                      }
                                      onBlur={() => setFocusedField(null)}
                                      disabled={isPOView}
                                      value={subSupplyType}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^[458]?$/.test(val)) {
                                          setSubSupplyType(val);
                                        }
                                      }}
                                      inputProps={{
                                        maxLength: 1,
                                        inputMode: "numeric", // mobile-friendly
                                        pattern: "[458]", // optional HTML validation
                                      }}
                                      size="small"
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      required
                                      label="Sub Supply Desc"
                                      placeholder="Sub Supply Desc"
                                      disabled={true}
                                      value={subSupplyDesc}
                                      onChange={(e) =>
                                        setSubSupplyDesc(e.target.value)
                                      }
                                      size="small"
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                  >
                                    <TextField
                                      fullWidth
                                      required
                                      label="Doc Type"
                                      placeholder="Doc Type"
                                      disabled={true}
                                      value={docType}
                                      onChange={(e) =>
                                        setDocType(e.target.value)
                                      }
                                      size="small"
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                  >
                                    {/* <TextField
                                      fullWidth
                                      label="Transaction Type"
                                      placeholder="Transaction Type"
                                      required
                                      onFocus={() =>
                                        setFocusedField("transactionType")
                                      }
                                      onBlur={() => {
                                        setFocusedField(null)
                                        setTransactionTypeError(true)
                                      }}
                                      error={transactionTypeError && transactionType === ""}
                                      helperText={transactionTypeError && transactionType === "" ? "Transaction Type is required" : ""}
                                      disabled={isPOView ? true : false}
                                      value={transactionType}
                                      onChange={(e) => {
                                        setTransactionType(e.target.value)
                                        setTransactionTypeError(false);
                                      }}
                                      size="small"
                                    /> */}
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label="Transaction Type"
                                      placeholder="Transaction Type"
                                      onFocus={() =>
                                        setFocusedField("transactionType")
                                      }
                                      onBlur={() => {
                                        setFocusedField(null);
                                        setTransactionTypeError(true);
                                      }}
                                      value={transactionType}
                                      disabled={isPOView ? true : false}
                                      inputProps={{ maxLength: 1 }}
                                      error={
                                        transactionTypeError &&
                                        transactionType === ""
                                      }
                                      helperText={
                                        transactionTypeError &&
                                          transactionType === ""
                                          ? "Transaction Type is required"
                                          : ""
                                      }
                                      onChange={(e) => {
                                        // setTransactionType(e.target.value)
                                        const value = e.target.value;
                                        setTransactionTypeError(false);
                                        if (/^[0-4]?$/.test(value)) {
                                          // Allows only one digit (0-4)
                                          setTransactionType(value);
                                        }
                                        if (e.target.value == 2) {
                                          // shipToTextFieldRef.current.focus();
                                          if (shipToTextFieldRef.current) {
                                            shipToTextFieldRef.current.focus();
                                            setNotification({
                                              status: true,
                                              type: "error",
                                              message:
                                                "Change Shipping Address",
                                            });
                                          }
                                        }
                                        // if (e.target.value == 3) {
                                        //   if (dispatchFromTextFieldRef.current) {
                                        //     dispatchFromTextFieldRef.current.focus();
                                        //     setNotification({
                                        //       status: true,
                                        //       type: 'error',
                                        //       message: "Change Dispatch Address",
                                        //     });
                                        //   }
                                        // }
                                        // if (e.target.value == 4) {
                                        //   if (dispatchFromTextFieldRef.current || shipToTextFieldRef.current) {
                                        //     shipToTextFieldRef.current.focus();
                                        //     dispatchFromTextFieldRef.current.focus();
                                        //     setNotification({
                                        //       status: true,
                                        //       type: 'error',
                                        //       message: "Change Shipping And Dispatch Address",
                                        //     });
                                        //   }
                                        // }
                                      }}
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      required
                                      label="Mode of Type"
                                      placeholder="Mode of Type"
                                      onFocus={() =>
                                        setFocusedField("modeOfType")
                                      }
                                      // onBlur={() => setFocusedField(null)}
                                      onBlur={() => {
                                        setFocusedField(null);
                                        setModeOfTypeError(true);
                                      }}
                                      error={
                                        modeOfTypeError && modeOfType === ""
                                      }
                                      helperText={
                                        modeOfTypeError && modeOfType === ""
                                          ? "Mode Of Type is required"
                                          : ""
                                      }
                                      disabled={isPOView ? true : false}
                                      value={modeOfType}
                                      onChange={(e) => {
                                        setModeOfType(e.target.value);
                                        setModeOfTypeError(false);
                                      }}
                                      size="small"
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      required
                                      label="Docket No"
                                      placeholder="Docket No"
                                      disabled={isPOView ? true : false}
                                      value={docketNo}
                                      onChange={(e) =>
                                        setDocketNo(e.target.value)
                                      }
                                      size="small"
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                  >
                                    <TextField
                                      fullWidth
                                      required
                                      label="Remarks"
                                      placeholder="Remarks"
                                      disabled={isPOView ? true : false}
                                      value={remarks}
                                      error={remarksError && remarks === ""}
                                      helperText={
                                        remarksError && remarks === ""
                                          ? "Remarks  is required"
                                          : ""
                                      }
                                      onBlur={() => setRemarksError(true)}
                                      onChange={(e) =>
                                        setRemarks(e.target.value)
                                      }
                                      size="small"
                                    />
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                            <Card
                              style={{
                                boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                                marginTop: "0px",
                                width: "100%",
                                overflow: "auto",
                              }}
                            >
                              <CardContent>
                                <Grid container spacing={2}>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                  >
                                    <Typography variant="h5" gutterBottom>
                                      Amount Details
                                    </Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                  >
                                    <TextField
                                      fullWidth
                                      required
                                      label="Total Qty"
                                      placeholder="Total Qty"
                                      disabled={isPOView ? true : false}
                                      value={totalQty}
                                      onChange={(e) =>
                                        setTotalQty(e.target.value)
                                      }
                                      size="small"
                                    />
                                  </Grid>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                  >
                                    <TextField
                                      fullWidth
                                      required
                                      label="Total Amt"
                                      placeholder="Total Amt"
                                      disabled={isPOView ? true : false}
                                      value={totalAmt}
                                      onChange={(e) =>
                                        setTotalAmt(e.target.value)
                                      }
                                      size="small"
                                    />
                                  </Grid>
                                  {/* CGST */}
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      size="small"
                                      value={cgstPercent}
                                      placeholder="%"
                                      onChange={(e) =>
                                        setCgstPercent(e.target.value)
                                      }
                                      style={{ marginRight: "5px" }}
                                      disabled={
                                        state.toUpperCase() !== "KARNATAKA" ||
                                        isPOView
                                      }
                                    />
                                  </Grid>

                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label="CGST"
                                      placeholder="CGST"
                                      value={cgst}
                                      disabled={
                                        state.toUpperCase() !== "KARNATAKA" ||
                                        isPOView
                                      }
                                    />
                                  </Grid>

                                  {/* SGST */}
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      size="small"
                                      value={sgstPercent}
                                      placeholder="%"
                                      onChange={(e) =>
                                        setSgstPercent(e.target.value)
                                      }
                                      style={{ marginRight: "5px" }}
                                      disabled={
                                        state.toUpperCase() !== "KARNATAKA" ||
                                        isPOView
                                      }
                                    />
                                  </Grid>

                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label="SGST"
                                      placeholder="SGST"
                                      value={sgst}
                                      disabled={
                                        state.toUpperCase() !== "KARNATAKA" ||
                                        isPOView
                                      }
                                    />
                                  </Grid>

                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      size="small"
                                      value={igstPercent}
                                      placeholder="%"
                                      onChange={(e) =>
                                        setIgstPercent(e.target.value)
                                      }
                                      style={{ marginRight: "5px" }}
                                      disabled={
                                        state.toUpperCase() === "KARNATAKA"
                                      } // disable if Karnataka
                                    />
                                  </Grid>

                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={6}
                                    lg={6}
                                    xl={6}
                                  >
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label="IGST"
                                      placeholder="IGST"
                                      value={igst}
                                      disabled={
                                        state.toUpperCase() === "KARNATAKA"
                                      } // disable if Karnataka
                                    />
                                  </Grid>

                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                  >
                                    <TextField
                                      fullWidth
                                      required
                                      label="Total Value"
                                      placeholder="Total Value"
                                      disabled={isPOView ? true : false}
                                      value={totalValue}
                                      // onChange={(e) =>
                                      //   setTotalValue(e.target.value)
                                      // }
                                      size="small"
                                    />
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </DialogContent>
                      <DialogActions>
                        {focusedField === "transactionType" && (
                          <Typography>
                            1-Regular, 2-Bill to Ship To, 3-Dispatch From,
                            4-Both 2 and 3
                          </Typography>
                        )}
                        {focusedField === "modeOfType" && (
                          <Typography>1-Road, 2-Rail, 3-Air, 4-Ship</Typography>
                        )}
                        {focusedField === "subSupplyType" && (
                          <Typography>
                            4-Job Work, 5-For Own Use, 8-Other
                          </Typography>
                        )}

                        <Button onClick={handleCloseModal} color="primary">
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
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
                    justifyContent: "space-between",
                    marginBottom: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      columnGap: "10px",
                      rowGap: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      style={getHighlightStyle("New", {
                        width: "100%",
                        backgroundColor: isModuleLocked ? "grey" : "#002D68",
                        height: "35px",
                      })}
                      onClick={() => {
                        setActiveButton("New");
                        handleClearPage();
                      }}
                      disabled={isModuleLocked}
                    >
                      New
                    </Button>
                    <Button
                      variant="contained"
                      style={getHighlightStyle("Edit", {
                        width: "100%",
                        backgroundColor: isModuleLocked ? "grey" : "#002D68",
                        height: "35px",
                      })}
                      disabled={isModuleLocked}
                      onClick={() => {
                        setActiveButton("Edit");

                        setIsPoView(false);
                        setIsEdit(true);

                        setSelectedItems((prev) => {
                          // if prev is empty, set new with RDL1
                          if (!prev || prev.length === 0) {
                            return [{ id: "RDL1" }];
                          }

                          // check if RDL1 already exists
                          const alreadyExists = prev.some((item) => item.id === "RDL1");
                          if (alreadyExists) {
                            return prev; // do nothing if already added
                          }

                          // otherwise append it
                          return [...prev, { id: "RDL1" }];
                        });
                      }}
                    >
                      Edit
                    </Button>


                    <Button
                      variant="contained"
                      style={getHighlightStyle("Delete", {
                        width: "100%",
                        backgroundColor: isModuleLocked ? "grey" : "#002D68",
                        height: "35px",
                      })}
                      onClick={() => {
                        setActiveButton("Delete");
                        setDeleteDailogOpen(true);
                      }}
                      disabled={isModuleLocked}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      style={getHighlightStyle("Clear", {
                        width: "100%",
                        backgroundColor: isModuleLocked ? "grey" : "#002D68",
                        height: "35px",
                      })}
                      onClick={() => {
                        setActiveButton("Clear");
                        handleClearPage();
                      }}
                      disabled={isModuleLocked}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="contained"
                      disabled={!(isPOView || isEdit) || isModuleLocked}
                      style={getHighlightStyle(
                        "Print",
                        { width: "100%", backgroundColor: isModuleLocked ? "grey" : "#002D68", height: "35px" },
                        !(isPOView || isEdit)
                      )}
                      onClick={() => {
                        setActiveButton("Print");
                        setPdfModalOpen(true);
                        NonReturnableDcInvoiceData(
                          { id: mainId },
                          handleInvoiceSuccess,
                          handleInvoiceException
                        );
                      }}
                    >
                      Print
                    </Button>
                    <Button
                      variant="contained"
                      disabled={!(isPOView || isEdit) || isModuleLocked}
                      style={getHighlightStyle(
                        "JSON",
                        { width: "100%", backgroundColor: isModuleLocked ? "grey" : "#002D68", height: "35px" },
                        !(isPOView || isEdit)
                      )}
                      onClick={() => {
                        setActiveButton("JSON");
                        NonreturnableDcDCJson(
                          { id: mainId },
                          getJsonSuccess,
                          getJsonExceptoin
                        );
                      }}
                    >
                      JSON
                    </Button>
                    <Button
                      variant="contained"
                      style={getHighlightStyle("First", {
                        width: "100%",
                        backgroundColor: "#002D68",
                        height: "35px",
                      })}

                      onClick={() => {
                        setActiveButton("First");
                        handleForwardReverse("first", "");
                      }}
                    >
                      <FastRewindIcon />
                    </Button>
                    <Button
                      variant="contained"
                      style={getHighlightStyle("Previous", {
                        width: "100%",
                        backgroundColor: "#002D68",
                        height: "35px",
                      })}
                      onClick={() => {
                        setActiveButton("Previous");
                        handleForwardReverse("reverse", mainId);
                      }}

                    >
                      <SkipPreviousIcon />
                    </Button>
                    {/* <Button
                        variant="contained"
                        style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                    >
                        <SearchIcon />
                    </Button> */}
                    <Button
                      variant="contained"
                      style={getHighlightStyle("Next", {
                        width: "100%",
                        backgroundColor: "#002D68",
                        height: "35px",
                      })}
                      onClick={() => {
                        setActiveButton("Next");
                        handleForwardReverse("forward", mainId);
                      }}

                    >
                      <SkipNextIcon />
                    </Button>
                    <Button
                      variant="contained"
                      style={getHighlightStyle("Last", {
                        width: "100%",
                        backgroundColor: "#002D68",
                        height: "35px",
                      })}

                      onClick={() => {
                        setActiveButton("Last");
                        handleForwardReverse("last", "");
                      }}
                    >
                      <FastForwardIcon />
                    </Button>
                  </div>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <input
                      accept="*"
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />

                    <Button
                      variant="contained"
                      disabled={isPOView || isModuleLocked}
                      style={getHighlightStyle(
                        "Import",
                        { height: "35px", backgroundColor: isModuleLocked ? "grey" : "#002d68" },
                        isPOView
                      )}
                      onClick={() => {
                        setActiveButton("Import");
                        handleButtonClick();
                      }}
                    >
                      Import
                    </Button>

                    {/* </label> */}
                    <Button
                      variant="contained"
                      style={getHighlightStyle("DownloadTemplate", {
                        height: "35px",
                        backgroundColor: isModuleLocked ? "grey" : "#002d68",
                      })}
                      onClick={() => {
                        setActiveButton("DownloadTemplate");
                        DownloadNRDCTemplate(
                          DownloadNRDCTemplateSuccess,
                          DownloadNRDCTemplateException
                        );
                      }}
                      disabled={isModuleLocked}
                    >
                      Download Template
                    </Button>
                    <Button
                      variant="contained"
                      style={getHighlightStyle("View", {
                        height: "35px",
                        backgroundColor: isModuleLocked ? "grey" : "#002d68",
                      })}
                      onClick={() => {
                        setActiveButton("View");
                        handleViewClick();
                      }}
                      disabled={isModuleLocked}
                    >
                      VIEW
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={loading === true || isModuleLocked}
                      style={getHighlightStyle(
                        "SaveUpdate",
                        { height: "35px", backgroundColor: isModuleLocked ? "grey" : "#002d68" },
                        loading
                      )}
                      onClick={() => setActiveButton("SaveUpdate")}
                    >
                      {loading ? (
                        <CircularProgress size={24} style={{ color: "white" }} />
                      ) : isEdit ? (
                        "UPDATE"
                      ) : (
                        "SAVE"
                      )}
                    </Button>
                  </div>
                </div>
                {/* </div> */}
                <table id="customers">
                  <thead>
                    <tr>
                      <th>Part No</th>
                      <th>Part Name</th>
                      <th>UOM</th>
                      <th>FG Item</th>
                      <th>HSN Code</th>
                      <th>Inv No</th>
                      <th>CDC No</th>
                      <th>Manual CDC No</th>
                      <th>Pend Qty</th>
                      <th>NRDC Qty</th>
                      <th>NRDC Rate</th>
                      <th>NRDC Amt</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {console.log("selectedItems=333=", selectedItems)}
                    {selectedItems.map((item, index) => (
                      <tr key={index}>
                        <td contentEditable={true}>
                          {item.itemCode ? (
                            <span>{item.itemCode}</span>
                          ) : (
                            <Autocomplete
                              fullWidth
                              disablePortal
                              id={`combo-box-${index}`}
                              size="small"
                              // disabled={isPOView ? true : false}
                              options={optionsPartNoList}
                              getOptionLabel={(option) => option.label}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Search Part No"
                                  onChange={handleChange}
                                />
                              )}
                              onChange={(event, value) =>
                                onPartNoSelectChange(value, event)
                              }
                            />
                          )}
                        </td>
                        <td contentEditable={!isPOView ? true : false}>
                          {item.itemName}
                        </td>
                        <td contentEditable={!isPOView ? true : false}>
                          {item.uom}
                        </td>
                        <td
                          contentEditable={!isPOView ? true : false}
                          onBlur={(e) =>
                            handleEdit(
                              "fgItem",
                              e.target.textContent,
                              item.id,
                              item
                            )
                          }
                        >
                          {item.fgItem}
                        </td>
                        <td contentEditable={!isPOView ? true : false}>
                          {item.hsnCode}
                        </td>
                        <td
                          contentEditable={!isPOView ? true : false}
                          onBlur={(e) =>
                            handleEdit(
                              "invNo",
                              e.target.textContent,
                              item.id,
                              item
                            )
                          }
                        >
                          {item.invNo}
                        </td>
                        <td
                          contentEditable={!isPOView ? true : false}
                          onBlur={(e) =>
                            handleEdit(
                              "cdcNo",
                              e.target.textContent,
                              item.id,
                              item
                            )
                          }
                        >
                          {item.cdcNo}
                        </td>
                        <td
                          contentEditable={false}
                          onBlur={(e) =>
                            handleEdit(
                              "cust_Dc_no",
                              e.target.textContent,
                              item.id,
                              item
                            )
                          }
                        >
                          {item.cust_Dc_no}
                        </td>
                        <td contentEditable={false}>{item.pendQty}</td>
                        <td
                          contentEditable={!isPOView ? true : false}
                          onBlur={(e) =>
                            handleEdit(
                              "Qty",
                              e.target.textContent,
                              item.id,
                              item
                            )
                          }
                        >
                          {item.qty}
                        </td>
                        <td
                          contentEditable={!isPOView ? true : false}
                          onBlur={(e) =>
                            handleEdit(
                              "newRate",
                              e.target.textContent,
                              item.id,
                              item
                            )
                          }
                        >
                          {item.newRate}
                        </td>

                        <td contentEditable={!isPOView}>
                          {item.amt != null && !isNaN(item.amt)
                            ? Number(item.amt).toFixed(2)
                            : ""}
                        </td>

                        <td
                          contentEditable={!isPOView ? true : false}
                          style={{ textAlign: "center" }}
                        >
                          {item.id === "RDL1" ? null : isPOView ? (
                            <DeleteIcon
                              // onClick={() => {
                              //     handleDeleteRow(item.id)
                              // }}
                              style={{ color: "#dddddd", cursor: "pointer" }}
                            />
                          ) : (
                            <DeleteIcon
                              onClick={() => {
                                handleDeleteRow(item.id);
                              }}
                              style={{ color: "black", cursor: "pointer" }}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
      <AddressChange
        changeAddressModalOpen={changeAddressModalOpen}
        setChangeAddressModalOpen={setChangeAddressModalOpen}
        setCustAddress={setCustAddress}
        customerSid={customerSid}
        selectedChangeAddress={selectedChangeAddress}
        setBillingAddress={setBillingAddress}
        setShippingAddress={setShippingAddress}
      />

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />

      <DeleteConfirmationDailog
        open={deleteDailogOpen}
        setOpen={setDeleteDailogOpen}
        deleteId={mainId}
        // selectedMaster={selectedMaster}
        deleteService={NonReturnableDelete}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />

      {/* LOAD PENDING INVOICE */}
      <Dialog
        maxWidth="xl"
        fullWidth
        open={isDialogOpen}
        onClose={handleDialogClose}
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
          Select Invoice for NRDC
        </DialogTitle>
        <DialogContent>
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
                    justifyContent: "space-between",
                  }}
                >
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    justify="flex-start"
                  >
                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        fullWidth
                        label="From Date"
                        placeholder="From Date"
                        variant="outlined"
                        type="Date"
                        size="small"
                        onChange={(e) => {
                          setFromDate(e.target.value);
                        }}
                        value={formatDate(fromDate)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        fullWidth
                        label=" To Date"
                        placeholder="To Date"
                        variant="outlined"
                        type="Date"
                        size="small"
                        onChange={(e) => {
                          setToDate(e.target.value);
                        }}
                        value={formatDate(toDate)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                      <Button
                        variant="contained"
                        type="button"
                        onClick={handleClickLoadInv}
                        style={{
                          height: "30px",
                          backgroundColor: "#002d68",
                        }}
                      >
                        Load
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <DataGrid
                        rows={rows}
                        // rows={[]}
                        columns={columns1}
                        // loading={isLoading}
                        pageSize={8}
                        style={{ height: "310px", zoom: "75%" }}
                        rowsPerPageOptions={[8]}
                        disableSelectionOnClick
                        rowHeight={40}
                        columnHeaderHeight={40}
                      />
                    </Grid>
                  </Grid>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </DialogContent>
        <DialogActions>
          <FormControlLabel
            control={
              <Checkbox checked={checked} onChange={handleCheckboxChange1} />
            }
            label="Select All"
            labelPlacement="start"
            sx={{ flexDirection: "row-reverse" }} // This places the label on the start (left) side of the checkbox
          />
          <Button
            variant="contained"
            type="button"
            onClick={handleLoadInv}
            style={{ height: "30px", backgroundColor: "#002d68" }}
          >
            Load Inv
          </Button>
          <Button
            variant="contained"
            type="button"
            style={{ height: "30px", backgroundColor: "#002d68" }}
            onClick={handleDialogClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* LOAD PENDING DC */}
      <Dialog
        maxWidth="xl"
        fullWidth
        open={loadPendingDcModal}
        onClose={handleDialogClose}
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
          Select DC for NRDC
        </DialogTitle>
        <DialogContent>
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
                    justifyContent: "space-between",
                  }}
                >
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    justify="flex-start"
                  >
                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        fullWidth
                        label="From Date"
                        placeholder="From Date"
                        variant="outlined"
                        type="Date"
                        size="small"
                        onChange={(e) => {
                          setFromDate(e.target.value);
                        }}
                        value={formatDate(fromDate)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        fullWidth
                        label=" To Date"
                        placeholder="To Date"
                        variant="outlined"
                        type="Date"
                        size="small"
                        onChange={(e) => {
                          setToDate(e.target.value);
                        }}
                        value={formatDate(toDate)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                      <Button
                        variant="contained"
                        type="button"
                        onClick={handleClickLoadDC}
                        style={{
                          height: "30px",
                          backgroundColor: "#002d68",
                        }}
                      >
                        Load
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <DataGrid
                        rows={dcLists}
                        // rows={[]}
                        columns={dC_columns}
                        // loading={isLoading}
                        pageSize={8}
                        style={{ height: "310px", zoom: "75%" }}
                        rowsPerPageOptions={[8]}
                        disableSelectionOnClick
                        rowHeight={40}
                        columnHeaderHeight={40}
                      />
                    </Grid>
                  </Grid>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </DialogContent>
        <DialogActions>
          <FormControlLabel
            control={
              <Checkbox checked={checked} onChange={handleCheckboxChange1} />
            }
            label="Select All"
            labelPlacement="start"
            sx={{ flexDirection: "row-reverse" }} // This places the label on the start (left) side of the checkbox
          />
          <Button
            variant="contained"
            type="button"
            onClick={handleLoadDc}
            style={{ height: "30px", backgroundColor: "#002d68" }}
          >
            Load Inv
          </Button>
          <Button
            variant="contained"
            type="button"
            style={{ height: "30px", backgroundColor: "#002d68" }}
            onClick={handleDialogClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <NonReturnableLoadDelNote
        loadPendingModalOpen={loadPendingDelNote}
        setLoadPendingModalOpen={setLoadPendingDelNote}
        // setPendingPOList={setPendingPOList}
        // pendingPOList={pendingPOList}
        setPendingPOList={setSelectedItems}
        pendingPOList={selectedItems}
        setCustAddress={setCustAddress}
        customerId={cId}
      />

      {/* <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>DELIVERY CHALLAN</DialogTitle>

        <DialogContent style={{ padding: '2px' }}>
          {pdfUrl &&
            <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
          }
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setPdfModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog> */}

      <Dialog
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        maxWidth="xl"
        fullWidth
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
          DELIVERY CHALLAN
        </DialogTitle>

        <DialogContent style={{ padding: "2px" }}>
          {mergedPdfUrl && (
            <embed
              src={mergedPdfUrl}
              type="application/pdf"
              width="100%"
              height="600px"
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setPdfModalOpen(false);
              setMergedPdfUrl(null);
              setPdfBlobs([]);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewNRDCEntry;
