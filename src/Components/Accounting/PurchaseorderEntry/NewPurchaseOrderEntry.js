import React from "react";
import { useState } from "react";
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
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import {
  AppendImport,
  CustomerDropShowdata,
  FetchCustomerAddress,
  GetGeneratePoSaleOrderEntry,
  GetGeneratedPo,
  MultiSoImport,
  POEntryAdd,
  POEntryDelete,
  POEntryUpdate,
  PartNoSelect,
  PartNoSelectShow,
  PoNoAutoGen,
  PoSalesOrderPreview,
  PoViewing,
  updatePoRate,
} from "../../../ApiService/LoginPageService";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  DownloadPOEntryTemplate,
  ExportPoEntry,
} from "../../../ApiService/DownloadCsvReportsService";
import { useLocation, useNavigate } from "react-router-dom";
import AddressChange from "./PurchaseChangeAddress/AddressChange";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";
import "../../PurchaseOrderGeneration/PurchaseOrder.css";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import DeleteConfirmationDailog from "../../../Utility/confirmDeletion";
import LoadSalesDelNote from "./LoadSalesDelNote";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import GetAppIcon from '@mui/icons-material/GetApp';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useModuleLocks } from "../../context/ModuleLockContext";


const NewPurchaseOrderEntry = () => {
  const [loadPendingDelNote, setLoadPendingDelNote] = useState(false);


  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "PO Sales Order Entry")?.lockStatus === "locked";

  const [slNo, setSlNo] = useState("");
  const [slNoList, setSlNoList] = useState([]);
  const [slNoAutoGen, setSlNoAutoGen] = useState("");
  const [slPoAutoGen, setSlPoAutoGen] = useState("");
  const [customerSelect, setCustomerSelect] = useState("");
  const [customerSelectList, setCustomerSelectList] = useState([]);
  const [billingAddress, setBillingAddress] = useState([]);
  const [shippingAddress, setShippingAddress] = useState([]);
  const [partNo, setPartNo] = useState("");
  const [partNoList, setPartNoList] = useState([]);
  const [partNoLabel, setPartNoLabel] = useState("");
  const [poNo, setPONo] = useState("");
  const [poDate, setPODate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [narration, setNarration] = useState("");
  const [append, setAppend] = useState(false);
  const [multiSo, setmultiSo] = useState(false);
  const [totalQty, setTotalQty] = useState("0");
  const [grossAmt, setGrossAmt] = useState("0.00");
  const [rows, setRows] = useState([]);
  const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
  const [customerSid, setCustomerSid] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [isLoading, setGridLoading] = useState(true);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [cid, setcid] = useState("");
  const [file, setFile] = useState(null);
  const [newArray, setNewArray] = useState("");
  const [selectedItems, setSelectedItems] = useState([{ id: "RDL1" }]);
  console.log("selectedItemsselectedItemsselectedItems", selectedItems)
  const [missMatchItems, setMissMatchItems] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appendChecked, setAppendChecked] = useState(false);
  const [multiSOChecked, setMultiSOChecked] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [selectedChangeAddress, setSelectedChangeAddress] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [generatedPoLists, setGeneratedPoLists] = useState([]);
  const [selectedGeneratedPo, setSelectedGeneratedPo] = useState("");
  const [gstPercentage, setGstPercentage] = useState(0);
  const [gstValue, setGstValue] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState('');

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };
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
  const location = useLocation();

  //--View--//
  // const isPOView = new URLSearchParams(location.search).get("isPOView");
  const poRowId = new URLSearchParams(location.search).get("poRowId");

  //--Edit--//
  // const isEdit = new URLSearchParams(location.search).get("isEdit");

  ////////////////////////////////////////////////////////////////////////FORWARD REVERSE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  const [isPOView, setIsPoView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [mainId, setMainId] = useState("");
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  ///View Button Click
  const navigate = useNavigate();
  const handleViewClick = () => {
    navigate("/NewPurchaseOderEntryView");
  };

  const onslNoChange = (e) => {
    setSlNo(e.target.value);
  };

  useEffect(() => {
    // PoNoAutoGen(handlePoNoAutoGen, handlePoNoAutoGenException);
    // if (isPOView || isEdit) {
    //   PoViewing(
    //     { id: poRowId },
    //     handlePurchaseOrderView,
    //     handlePurchaseOrderViewException
    //   );
    // }
    handleForwardReverse("last", "");
  }, []);

  const handlePurchaseOrderView = (dataObject) => {
    const data = dataObject.data[0];
    setSlNoAutoGen(data?.sino || "");
    setSelectedDate(data?.date || "");
    setSlPoAutoGen(data?.sodigit || "");
    setSelectedCustomerName(data?.cName || "");
    setCustomerSelect(data?.CustomerId || "");
    setBillingAddress(data?.billAdd || "");
    setShippingAddress(data?.shipAdd || "");
    setPONo(data?.poNo || "");
    setPODate(data?.poDate || "");
    setPaymentTerms(data?.pay_term || "");
    setAppend(data?.append || false);
    setmultiSo(data?.multi_so || false);
    setGrossAmt(data?.gross_amt || "");
    setTotalQty(data?.total_qty || "");
    setNarration(data?.narration || "");
    const allItems = dataObject.data2 || [];
    setSelectedItems([...allItems, { id: "RDL1" }]);
    setcid(data?.customer || "");
  };

  const handlePurchaseOrderViewException = (errorObject, errorMessage) => { };

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

  const handleCustomerDropshowException = (error, errorMessage) => { };

  const handlePoNoAutoGen = (dataObject) => {
    setSlNoAutoGen(dataObject.digit || "");
    setSlPoAutoGen(dataObject.id || "");
  };

  const handlePoNoAutoGenException = (errorStaus, errorMessage) => {
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
  };

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
    setShippingAddress(dataObject?.data[0]?.multiAddress || "");
    setPaymentTerms(dataObject?.data[0]?.payTerm || "");
  };

  const handleFetchCustAddressException = (errorStaus, errorMessage) => { };

  const handleBillingTextFieldChange = (event) => {
    setBillingAddress(event.target.value);
  };

  const handleShippingTextFieldChange = (event) => {
    setShippingAddress(event.target.value);
  };

  //PartNo select
  const optionsPartNoList = partNoList
    ? partNoList.map((item) => ({
      value: item?.id,
      label: item?.label,
    }))
    : [];

  function onPartNoSelectChange(selectedValue, event) {
    setPartNo(selectedValue?.id);
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
  // const handlePartNoShowSuccess = (dataObject) => {
  //   setGridLoading(false);
  //   const data = dataObject?.data || [];
  //   setRows(data);
  //   const formattedData = data.map((item) => ({
  //     id: item?.id || null,
  //     suppDesc: null,
  //     itemCode: item?.itemCode || "",
  //     itemName: item?.itemName || "",
  //     amt: item?.amt || 0,
  //     uom: item?.uom || "",
  //     hsnCode: item?.hsnCode || "",
  //     newRate: item?.newRate || "",
  //     preRate: item?.preRate || "",
  //     qty: item?.qty || 0,
  //     remarks: item?.remarks || "",
  //   }));
  //   if (formattedData.length > 0) {
  //     const clonedSelectedItems = [...selectedItems];
  //     const lastObj = clonedSelectedItems.pop();
  //     clonedSelectedItems.push(...formattedData, lastObj);
  //     setSelectedItems(clonedSelectedItems);
  //   }
  // };
  const handlePartNoShowSuccess = (dataObject) => {
    setGridLoading(false);
    const data = dataObject?.data || [];
    setRows(data);

    const formattedData = data.map((item) => ({
      id: item?.id || null,
      suppDesc: null,
      itemCode: item?.itemCode || "",
      itemName: item?.itemName || "",
      amt: item?.amt || "",
      uom: item?.uom || "",
      hsnCode: item?.hsnCode || "",
      newRate: item?.newRate || "",
      preRate: item?.preRate || "",
      qty: item?.qty || "",
      remarks: item?.remarks || "",
    }));

    if (formattedData.length > 0) {
      const clonedSelectedItems = [...selectedItems];
      const lastObj = clonedSelectedItems.pop(); // Remove the last object

      // let duplicateFound = false;

      // const newItems = formattedData.filter((newItem) => {
      //   const exists = clonedSelectedItems.some((existingItem) => existingItem.id === newItem.id);
      //   if (exists) {
      //     duplicateFound = true; // Mark that a duplicate exists
      //   }
      //   return !exists;
      // });

      // if (duplicateFound) {
      //   setNotification({
      //     status: true,
      //     type: "error",
      //     message: "Some items already exist and were not added!",
      //   });
      // }

      // Filter out duplicates based on 'itemCode' (you can change this to 'id' if needed)
      const existingCodes = new Set(clonedSelectedItems.map(item => item.itemCode));
      const uniqueNewItems = formattedData.filter(item => !existingCodes.has(item.itemCode));

      if (uniqueNewItems.length < formattedData.length) {
        setNotification({
          status: true,
          type: "error",
          message: "Some items already exist and were not added!",
        });
      }

      clonedSelectedItems.push(...uniqueNewItems, lastObj);
      setSelectedItems(clonedSelectedItems);
    }

    // clonedSelectedItems.push(...newItems, lastObj);
    // setSelectedItems(clonedSelectedItems);
    // }
  };


  const handlePartNoSelectException = (errorObject, errorMessage) => {
    setRows([]);
  };

  const handleChange = (e) => {
    PartNoSelectShow(
      { code: e.target.value, id: customerSelect },
      handlePartNoDropshow,
      handlePartNoDropshowException
    );
  };

  const handlePartNoDropshow = (dataObject) => {
    setPartNoList(dataObject?.data || []);
  };

  const handlePartNoDropshowException = (error, errorMessage) => { };

  useEffect(() => {
    calculateTotals(selectedItems);
  }, [selectedItems]);

  const calculateTotals = (data) => {
    const totalQty = data.reduce(
      (acc, item) => acc + (Number(item.qty) || 0),
      0
    );
    setTotalQty(totalQty);

    const grossAmount = data.reduce(
      (acc, item) => acc + (Number(item.amt) || 0),
      0
    );
    setGrossAmt(parseFloat(grossAmount.toFixed(2)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Filter out the item with id === "RDL1"
    const filteredItems = selectedItems.filter((item) => item.id !== "RDL1");

    //Check if any of the remaining items have no qty or sch date
    const hasInvalidQty = filteredItems.some(item => item.qty === 0 || item.qty === "");
    if (hasInvalidQty) {
      setNotification({
        status: true,
        type: 'error',
        message: 'Quantity cannot be null or zero.',
      });
      return; // Stop further execution if validation fails
    }

    //Check if any of the remaining items have no qty or sch date
    const hasInvalidSch = filteredItems.some(item => item.schDate === 0 || item.schDate === "");
    if (hasInvalidSch) {
      setNotification({
        status: true,
        type: 'error',
        message: 'Sch Date cannot be empty.',
      });
      return; // Stop further execution if validation fails
    }

    // Check if any of the remaining items have no hsnCode
    const hasMissingHsnCode = filteredItems.some((item) => !item.hsnCode);
    if (hasMissingHsnCode) {
      setNotification({
        status: true,
        type: "error",
        message: "Please provide HSN code for all items.",
      });
      return; // Stop further execution if hsnCode is missing
    }

    ["poNo", "paymentTerms"].forEach((field) => {
      if (!eval(field)) {
        setNotification({
          status: true,
          type: "error",
          message: `Please Enter ${field.replace(/([A-Z])/g, " $1")} To Continue`,
        });
      }
    });


    const purchaseOrderData = {
      isVerbal: checked,
      sino: slNoAutoGen,
      date: formatDateForPayload(selectedDate),
      sodigit: slPoAutoGen,
      billAdd: billingAddress,
      shipAdd: shippingAddress,
      poNo: poNo,
      poDate: formatDateForPayload(poDate),
      pay_term: paymentTerms,
      append: append,
      gross_amt: grossAmt,
      multi_so: multiSo,
      narration: narration,
      total_qty: totalQty,
      customer: cid,
      gstPer: gstPercentage,
      gst: gstValue,
      grandTotal: grandTotal,
      append: append
    };

    const purchaseOrderItemData = filteredItems.map((data) => ({
      id: data?.id,
      part_No: data?.itemCode,
      part_name: data?.itemName,
      UOM: data?.uom,
      hsnCode: data?.hsnCode,
      Qty: data?.qty,
      schDate: data?.schDate,
      pre_Rate: data?.preRate,
      Rate: data?.newRate,
      Amt: data?.amt,
      remarks: data?.remarks,
    }));

    const requestData = {
      purchaseOrderData: purchaseOrderData,
      purchaseOrderItemData: purchaseOrderItemData,
      id: mainId,
    };

    if (isEdit) {
      setLoading(true);
      POEntryUpdate(requestData, handleSuccess, handleException);
    } else {
      setLoading(true);
      POEntryAdd(requestData, handleSuccess, handleException);
    }
  };

  const handleSuccess = (dataObject) => {
    setIsEdit(false);
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      ClearData();
      PoNoAutoGen(handlePoNoAutoGen, handlePoNoAutoGenException);
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

  const AppendImportSuccess = (dataObject) => {
    if (multiSo === false) {
      setPONo(dataObject?.data[0]?.PoNo);
      setPODate(dataObject?.data[0]?.PoDate);
      checkforMismatch(dataObject?.data);
    }
    setNotification({
      status: true,
      type: "success",
      message: "Import Success",
    });
    setTimeout(() => {
      handleCloseNot();
      setFile("");
    }, 2000);
  };

  // const checkforMismatch = (data) => {
  //   if (data && Array.isArray(data)) {
  //     const importData = [...data];
  //     let hasMismatch = false;
  //     importData.forEach((temp) => {
  //       console.log(">>>>>>>>>>>>>>>>>vvvvvvvvvv", temp);
  //       if (temp && temp.match === 1) {
  //         setMissMatchItems(temp);
  //         hasMismatch = true;
  //       } else {
  //         // Ensure selectedItems is not empty before popping
  //         const lastData = selectedItems.length > 0 ? selectedItems.pop() : null;
  //         // setSelectedItems(
  //         //   lastData ? [...selectedItems, ...importData, lastData] : [...selectedItems, ...importData]
  //         // );
  //         const newItems = [...importData];
  //         if (lastData) newItems.push(lastData);
  //         if (append) {
  //           setSelectedItems([...selectedItems, ...newItems]);
  //         } else {
  //           setSelectedItems(newItems);
  //         }
  //         hasMismatch = false;
  //       }
  //     });
  //     setIsDialogOpen(hasMismatch);
  //   }
  // };
  const checkforMismatch = (data) => {
    if (data && Array.isArray(data)) {
      const importData = [...data];

      // ✅ Separate mismatch and non-mismatch data
      const mismatchItems = importData.filter(item => item.match === 1);
      const validItems = importData.filter(item => item.match === 0);

      // ✅ Set mismatch items together
      setMissMatchItems(mismatchItems);

      // ✅ Set valid (non-mismatch) items in parent module
      if (append) {
        setSelectedItems(prev => [...prev, ...validItems]);
      } else {
        setSelectedItems(validItems);
      }

      // ✅ Open dialog only if mismatch items exist
      setIsDialogOpen(mismatchItems.length > 0);
    }
  };


  const ClearData = () => {
    setSlNo("");
    setSlNoAutoGen("");
    setSelectedCustomerName("");
    setSlPoAutoGen("");
    setCustomerName("");
    setCustAddress("");
    setSelectedDate(new Date());
    setCustomerSelect("");
    setCustomerSelectList("");
    setBillingAddress("");
    setShippingAddress("");
    setPartNo("");
    setPartNoList("");
    setPartNoLabel("");
    setGrossAmt("0.00");
    setNarration("");
    setTotalQty("0");
    setPONo("");
    setGstValue(0);
    setGstPercentage(0);
    setGrandTotal(0);
    setPODate("");
    setPaymentTerms("");
    setSelectedItems([{ id: "RDL1" }]);
    setRows([]);
    setRefreshData((oldValue) => !oldValue);
  };

  ///Rate Mismatch while importing
  useEffect(() => { }, [missMatchItems, selectedItems]);

  const AppendImportException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      setFile("");
    }, 2000);
  };

  ///Model Popup of Rate Mismatch
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const DownloadPOEntryTemplateSuccess = () => { };

  const DownloadPOEntryTemplateException = () => { };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  //Append Columns
  const columns2 = [
    {
      field: "itemCode",
      headerClassName: "super-app-theme--header",
      headerName: "Part No",
      type: "string",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "qty",
      headerClassName: "super-app-theme--header",
      headerName: "QTY",
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "newRate",
      headerClassName: "super-app-theme--header",
      headerName: "Xl Rate",
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "newrate",
      headerClassName: "super-app-theme--header",
      headerName: "Std Rate ",
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "schDate",
      headerClassName: "super-app-theme--header",
      headerName: "Sch Date",
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "error",
      headerClassName: "super-app-theme--header",
      headerName: "Error",
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "discription",
      headerClassName: "super-app-theme--header",
      headerName: "Error Description",
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  const handleCloseNot = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handleBlur = (cellNam, newValue, id, rowData) => {
    if (cellNam === "SCHDATE") {
      const newDate = new Date(newValue);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (newDate < today) {
        alert("Please enter a date that is today or in the future.");
        return;
      }
    }
    handleEdit(cellNam, newValue, id, rowData);
  };

  //Qty and Sch date Update
  const handleEdit = (cellNam, newValue, id, rowData) => {

    // QTY VALIDATION
    if (cellNam === "Qty" && (!newValue || isNaN(newValue) || Number(newValue) <= 0)) {
      setNotification({
        status: true,
        type: "error",
        message: "Please enter a valid quantity.",
      });
      return;
    }

    let updatedItems;
    switch (cellNam) {
      case "Qty":
        updatedItems = selectedItems.map((supp) =>
          supp.id === id && cellNam === "Qty"
            ? {
              ...supp,
              qty: Number(newValue),
              amt: Number(newValue) * Number(rowData.newRate),
            }
            : supp
        );
        break;
      case "SCHDATE":
        updatedItems = selectedItems.map((supp) =>
          supp.id === id && cellNam === "SCHDATE"
            ? { ...supp, schDate: newValue }
            : supp
        );
        break;
      default:
        return;
    }
    setSelectedItems(updatedItems);
  };

  const handleDeleteRow = (code) => {
    const newArray = selectedItems.filter((item) => item.itemCode != code);
    setSelectedItems(newArray);
    calculateTotals(newArray);
  };

  const getFormattedTodayDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const handleCheckboxChange = (event, itemId) => {
    const isChecked = event.target.checked;
  };

  // HANDLE FORWARD REVERSE HANDLER
  const handleForwardReverse = (type, id) => {
    PoSalesOrderPreview(
      { type: type, id: id },
      handleActionSuccess,
      handleActionException
    );
  };

  const handleActionSuccess = (dataObject) => {
    setIsPoView(true);
    const data = dataObject.data[0];
    setSlNoAutoGen(data?.sino || "");
    setSelectedDate(data?.date || "");
    // setChecked(data?.isVerbal)
    setChecked(data?.isVerbal === 1);
    setSlPoAutoGen(data?.sodigit || "");
    setSelectedCustomerName(data?.cName || "");
    setCustomerSelect(data?.CustomerId || "");
    setBillingAddress(data?.billAdd || "");
    setShippingAddress(data?.shipAdd || "");
    setGstPercentage(Number(data?.gstPer) || "")
    setGstValue(Number(data?.gst) || "")
    setPONo(data?.poNo || "");
    setPODate(data?.poDate || "");
    setPaymentTerms(data?.pay_term || "");
    setAppend(data?.append || false);
    setmultiSo(data?.multi_so || false);
    setGrossAmt(data?.gross_amt || "");
    setTotalQty(data?.total_qty || "");
    setNarration(data?.narration || "");
    const allItems = dataObject.data2 || [];
    setSelectedItems([...allItems, { id: "RDL1" }]);
    setcid(data?.customer || "");
    setMainId(data?.id || "");
  };
  const handleActionException = () => { };

  const handleClearPage = () => {
    setIsPoView(false);
    setIsEdit(false);
    setAppend(false);
    setmultiSo(false);
    setChecked(false);
    setMainId("");
    setSlNo("");
    setSlNoAutoGen("");
    setSelectedCustomerName("");
    setSlPoAutoGen("");
    setCustomerName("");
    setCustAddress("");
    setSelectedDate(new Date());
    setCustomerSelect("");
    setCustomerSelectList("");
    setBillingAddress("");
    setShippingAddress("");
    setPartNo("");
    setPartNoList("");
    setPartNoLabel("");
    setGrossAmt("0.00");
    setNarration("");
    setTotalQty("0");
    setPONo("");
    setGstValue(0);
    setGstPercentage(0);
    setGrandTotal(0);
    setPODate("");
    setPaymentTerms("");
    setSelectedItems([{ id: "RDL1" }]);
    setRows([]);
    PoNoAutoGen(handlePoNoAutoGen, handlePoNoAutoGenException);
    // setRefreshData((oldValue) => !oldValue);
  };

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

  const ExportPoEntrySuccess = () => { };

  const ExportPoEntryException = () => { };

  //SEARCH GENERATED PO SALES ORDER ENTRY
  const handlePOChange = (e) => {
    GetGeneratePoSaleOrderEntry(
      { type: "soOrder", code: e.target.value },
      handleGeneratedPoSucessShow,
      handleGeneratedPoExceptionShow
    );
  };

  const handleGeneratedPoSucessShow = (dataObject) => {
    setGeneratedPoLists(dataObject?.data || []);
  };
  const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => { };

  const handleGeneratedPoSelect = (selectedValue) => {
    setIsPoView(true);
    if (selectedValue !== null) {
      setSelectedGeneratedPo(selectedValue.digit);
      setMainId(selectedValue.id);
      // POViewApprove({ poDigit: selectedValue.digit }, handleActionSuccess, handleActionException);
      PoViewing(
        { id: selectedValue.id },
        handlePurchaseOrderView,
        handlePurchaseOrderViewException
      );
    }
  };

  const handleUpdatePoPrice = () => {
    updatePoRate(
      {
        poId: mainId,
        customerId: customerSelect,
      },
      handleRateUpdateSuccess,
      handleRateUpdateException
    );
  };

  const handleRateUpdateSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    PoViewing(
      { id: mainId },
      handlePurchaseOrderView,
      handlePurchaseOrderViewException
    );
    setTimeout(() => {
      handleClose();
    }, 3000);
  };

  const handleRateUpdateException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
  };

  const handleUniqueCodeChange = (e) => {
    // const newUniqueCode = e.target.value;

    // // Extract the prefix from slPoAutoGen (e.g., "25/02/")
    // const prefix = slPoAutoGen.slice(0, slPoAutoGen.lastIndexOf("/") + 1);

    // // Pad the newUniqueCode to 5 digits and combine it with the prefix
    // const updatedSlPoAutoGen = `${prefix}${newUniqueCode
    //   .toString()
    //   .padStart(5, "0")}`;

    // // Update the state or variable
    // setSlPoAutoGen(updatedSlPoAutoGen);

    // // Optionally, you can also update slNoAutoGen if needed
    // setSlNoAutoGen(newUniqueCode);

    const newUniqueCode = e.target.value;
    const currentYear = slPoAutoGen.split('/')[0]; // Get last 2 digits of the year
    setSlNoAutoGen(newUniqueCode);
    setSlPoAutoGen(`${currentYear}/${newUniqueCode.toString().padStart(5, "0")}`);
  };

  useEffect(() => {
    const gross = Number(grossAmt); // Ensure grossAmt is a number
    const gstPercent = Number(gstPercentage); // Ensure gstPercentage is a number

    const gstAmount = (gross * gstPercent) / 100;
    setGstValue(parseFloat(gstAmount.toFixed(2))); // Ensures two decimal places

    setGrandTotal(Number((gross + gstAmount).toFixed(2))); // Ensures proper calculation
  }, [gstPercentage, grossAmt]);

  // XL DOWNLOAD

  const arrayToWorksheet = (array) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PO Rate Mismatch.xlsx');

    if (array.length === 0) return workbook;

    // Define columns dynamically based on keys
    const columns = Object.keys(array[0]).map((key) => ({
      header: key.toUpperCase(), // Convert headers to uppercase
      key: key,
      width: 20,
    }));

    worksheet.columns = columns;

    // Add data rows
    array.forEach((row) => worksheet.addRow(row));

    // Style the header row (bold + center aligned)
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Center align all data rows
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    return workbook;
  };

  const downloadExcelFile = async (workbook, filename) => {
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
  };

  const handleExportClick = () => {
    // ✅ Don't wrap missMatchItems in []
    const formattedData = missMatchItems.map((data) => ({
      "Part No": data?.itemCode,
      "Qty": data?.qty,
      "Excel Rate": data?.newRate,
      "Std Rate": data?.newrate ?? "", // Use preRate or blank if null
      "Sch Date": data?.schDate,
      "Error": data?.error,
      "Error Description": data?.discription ?? "",
    }));

    const workbook = arrayToWorksheet(formattedData);
    downloadExcelFile(workbook, 'PO Rate Mismatch.xlsx');
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Extracts yyyy-MM-dd
  };


  const formatDateForInput = (dateString) => {
    if (!dateString) return getCurrentDate();
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // already yyyy-MM-dd
    return date.toISOString().split("T")[0]; // only yyyy-MM-dd
  };

  const formatDateForPayload = (dateString) => {
    // Convert yyyy-MM-dd -> yyyy-MM-ddT00:00:00.000Z
    const isoDate = new Date(dateString).toISOString();
    return isoDate;
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
            ? "View PO - Sales Order Entry"
            : isEdit
              ? "Edit PO - Sales Order Entry"
              : "New PO - Sales Order Entry"}
        </Typography>
        <div style={{ width: "450px", display: 'flex', columnGap: 5, marginRight: "10px" }}>

          <Grid item container alignItems="center" >
            {/* Always show "Type :" */}
            <Grid item>
              <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>Type:</Typography>
            </Grid>

            {/* Checkbox */}
            <Grid item>
              <Checkbox
                checked={checked}
                disabled={isPOView ? true : false}
                onChange={(e) => setChecked(e.target.checked)}
                color="primary"
              />
            </Grid>

            {/* Show Verbal when checked */}
            {checked && (
              <Grid item>
                <Typography style={{ fontSize: '18px', fontWeight: 'bold' }}>Verbal</Typography>
              </Grid>
            )}
          </Grid>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={generatedPoLists}
            fullWidth
            // value={selectedGeneratedPo}
            getOptionLabel={(option) =>
              option.digit || /*selectedGeneratedPo*/ ""
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search PO"
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
                  <InputLabel id="demo-simple-select-label">Sl No</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Sl No"
                    placeholder="Sl No"
                    value={slNo}
                    disabled
                    size="small"
                    style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                    onChange={(e) => onslNoChange(e)}
                  >
                    {slNoList?.map((data, index) => {
                      return (
                        <MenuItem value={data.id} key={index}>
                          {data.slNo}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <TextField
                  fullWidth
                  readOnly={true}
                  value={slNoAutoGen}
                  size="small"
                  disabled={isPOView ? true : false}
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                  onChange={handleUniqueCodeChange}
                  inputProps={{ maxLength: 5 }} // Set max length to 5 characters
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
                  disabled={isPOView || isEdit}
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                  // value={formatDate(selectedDate)}
                  value={formatDateForInput(selectedDate)}

                  onChange={(e) => setSelectedDate(e.target.value)}

                  max={getCurrentDate()} // Restrict dates greater than today
                  inputProps={{
                    max: getCurrentDate(), // Restrict dates greater than today
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ display: "flex", alignItems: "center" }}>
                <TextField
                  fullWidth
                  readOnly={true}
                  value={slPoAutoGen}
                  size="small"
                  disabled={isPOView ? true : false}
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />

                <Tooltip title="Refresh DocNumber">
                  <span>
                    {" "}
                    {/* wrapper to avoid tooltip crash when button is disabled */}
                    <IconButton
                      disabled={isPOView || isEdit}
                      onClick={() => {
                        if (slNoAutoGen) {
                          PoNoAutoGen(handlePoNoAutoGen, handlePoNoAutoGenException);
                        }
                      }}
                      color="primary"
                      size="small"
                      style={{ marginLeft: "5px" }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </span>
                </Tooltip>
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
                  rows={4}
                  value={`${selectedCustomerName ? selectedCustomerName : ""}${selectedCustomerName && "\n"
                    }${billingAddress}`}
                  onChange={handleBillingTextFieldChange}
                  readOnly={true}
                  size="small"
                  disabled={true}
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
                  rows={4}
                  value={`${selectedCustomerName ? selectedCustomerName : ""}${selectedCustomerName && "\n"
                    }${shippingAddress}`}
                  onChange={handleShippingTextFieldChange}
                  readOnly={true}
                  disabled={true}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                style={{ display: "flex", flexDirection: "row" }}
              >
                {!isPOView && (
                  <>
                    <FormControl
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      <FormControlLabel
                        control={<Checkbox style={{ marginTop: "5px" }} checked={append} onChange={(e) => setAppend(e.target.checked)} />}
                        label={
                          <Typography
                            variant="body1"
                            style={{ fontWeight: "bold", marginTop: "5px" }}
                          >
                            Append
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        control={<Checkbox
                          disabled={checked}
                          style={{ marginTop: "5px" }} value={multiSo} onChange={(e) => setmultiSo(e.target.checked)} />}
                        label={
                          <Typography
                            variant="body1"
                            style={{ fontWeight: "bold", marginTop: "5px" }}
                          >
                            Multi SO
                          </Typography>
                        }
                      />
                    </FormControl>
                    <input
                      id="upload-photo"
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (reader.readyState === 2) {
                              setFile(reader.result);
                              if (multiSo === true) {
                                MultiSoImport(
                                  { isVerbal: checked, custId: cid, file: reader.result, custAdd: shippingAddress, billAdd: billingAddress },
                                  AppendImportSuccess,
                                  AppendImportException
                                )
                              } else {
                                AppendImport(
                                  { id: cid, file: reader.result },
                                  AppendImportSuccess,
                                  AppendImportException
                                );
                              }
                              // Reset the file input to allow multiple uploads
                              e.target.value = "";
                            }
                          };
                          reader.readAsDataURL(e.target.files[0]);
                        }
                      }}
                    />

                    <Button
                      variant="contained"
                      component="label"
                      size="small"
                      htmlFor="upload-photo"
                      style={{
                        width: "120px",
                        background: "#002D68",
                        color: "white",
                        marginLeft: "30px",
                        height: "30px",
                        padding: "5px",
                        marginRight: "16px",
                        marginTop: "10px",
                      }}
                    >
                      Import
                      <input id="upload-photo" type="file" hidden />
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#002D68",
                        height: "30px",
                        padding: "5px",
                        marginTop: "10px",
                      }}
                      onClick={() => {
                        DownloadPOEntryTemplate(
                          DownloadPOEntryTemplateSuccess,
                          DownloadPOEntryTemplateException
                        );
                      }}
                    >
                      Download Template
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        backgroundColor: "#002D68",
                        height: "30px",
                        padding: "5px",
                        marginTop: "10px",
                        marginLeft: "30px",
                      }}
                      onClick={() => setLoadPendingDelNote(true)}
                    >
                      Load SO Verified
                    </Button>
                  </>
                )}
                {/* <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography>
                        Type : {checked ? "Verbal" : ""}
                      </Typography>
                    }
                    style={{ paddingLeft: 10 }}
                  />
                </Grid> */}


              </Grid>

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
                height: "auto",
                overflow: "auto",
                border: "1px solid black",
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    style={{ height: "200px", marginBottom: "10px" }}
                  >
                    <table
                      style={{
                        width: "100%",
                        height: "100%",
                        borderCollapse: "collapse",
                      }}
                    >
                      <tbody>
                        <tr
                          style={{
                            borderBottom: "1px solid #ddd",
                            height: "30px",
                          }}
                        >
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "4px",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            PO No
                          </th>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            <TextField
                              fullWidth
                              required
                              disabled={isPOView || isEdit}  // disables if either is true
                              value={poNo}
                              onChange={(e) => setPONo(e.target.value)}
                              size="small"
                              inputProps={{
                                style: { padding: "4px", fontSize: "14px" },
                              }}
                            />
                          </td>
                        </tr>
                        <tr
                          style={{
                            borderBottom: "1px solid #ddd",
                            height: "30px",
                          }}
                        >
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "4px",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            Date
                          </th>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            <TextField
                              fullWidth
                              label="Date"
                              placeholder="Date"
                              variant="outlined"
                              required
                              type="date"
                              size="small"
                              disabled={isPOView ? true : false}
                              onChange={(e) => {
                                setPODate(e.target.value);
                              }}
                              // value={formatDate(poDate)}
                              value={formatDate(poDate)}
                              // value={poDate}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              inputProps={{
                                style: { padding: "4px", fontSize: "14px" },
                              }}
                            />
                          </td>
                        </tr>
                        <tr
                          style={{
                            borderBottom: "1px solid #ddd",
                            height: "30px",
                          }}
                        >
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            Payment Terms
                          </th>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            <TextField
                              fullWidth
                              required
                              value={paymentTerms}
                              disabled={isPOView ? true : false}
                              onChange={(e) => setPaymentTerms(e.target.value)}
                              size="small"
                              inputProps={{
                                style: { padding: "4px", fontSize: "14px" },
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                      <tbody>
                        <tr
                          style={{
                            borderBottom: "1px solid #ddd",
                            height: "30px",
                          }}
                        >
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
                              required
                              disabled={isPOView ? true : false}
                              value={totalQty}
                              onChange={(e) => setTotalQty(e.target.value)}
                              size="small"
                              inputProps={{
                                style: { padding: "4px", fontSize: "14px" },
                              }}
                            />
                          </td>
                        </tr>
                        <tr
                          style={{
                            borderBottom: "1px solid #ddd",
                            height: "30px",
                          }}
                        >
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            Gross Amt
                          </th>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            <TextField
                              fullWidth
                              required
                              disabled={isPOView ? true : false}
                              value={grossAmt}
                              onChange={(e) => setGrossAmt(e.target.value)}
                              size="small"
                              inputProps={{
                                style: { padding: "4px", fontSize: "14px" },
                              }}
                            />
                          </td>
                        </tr>
                        <tr
                          style={{
                            borderBottom: "1px solid #ddd",
                            height: "30px",
                          }}
                        >
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            GST %
                          </th>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              display: "flex",
                              flexDirection: "row",
                              columnGap: "10px",
                            }}
                          >
                            <TextField
                              fullWidth
                              disabled={isPOView ? true : false}
                              value={gstPercentage}
                              onChange={(e) => setGstPercentage(e.target.value)}
                              size="small"
                              inputProps={{
                                style: { padding: "4px", fontSize: "14px" },
                              }}
                            />
                            <TextField
                              fullWidth
                              disabled={isPOView ? true : false}
                              value={gstValue}
                              size="small"
                              inputProps={{
                                style: { padding: "4px", fontSize: "14px" },
                              }}
                            />
                          </td>
                        </tr>
                        <tr
                          style={{
                            borderBottom: "1px solid #ddd",
                            height: "30px",
                          }}
                        >
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            Grand Total
                          </th>
                          <td
                            style={{ border: "1px solid #ddd", padding: "8px" }}
                          >
                            <TextField
                              fullWidth
                              required
                              disabled={isPOView ? true : false}
                              value={grandTotal}
                              // onChange={(e) => setGrandTotal(e.target.value)}
                              size="small"
                              inputProps={{
                                style: { padding: "4px", fontSize: "14px" },
                              }}
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
                      style={{
                        width: "100%",
                        background: isModuleLocked
                          ? "gray"
                          : activeButton === "New"
                            ? "#0d6efd"
                            : "#002D68",
                        color: "white",
                        height: "35px",
                        transition: 'background 0.3s ease'
                      }}
                      onClick={() => {
                        handleButtonClick('New');
                        handleClearPage();
                      }}
                      disabled={isModuleLocked}
                    >
                      New
                    </Button>

                    <Button
                      variant="contained"
                      style={{
                        width: "100%",
                        background: isModuleLocked
                          ? "gray"
                          : activeButton === 'Edit' ? '#0d6efd' : "#002D68",
                        color: "white",
                        height: "35px",
                        transition: 'background 0.3s ease'
                      }}
                      onClick={() => {
                        handleButtonClick('Edit');
                        setIsPoView(false);
                        setIsEdit(true);
                        setAppend(true);
                      }}
                      disabled={isModuleLocked}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="contained"
                      style={{
                        width: "100%",
                        background: isModuleLocked
                          ? "gray"
                          : activeButton === 'Delete' ? '#0d6efd' : "#002D68",
                        color: "white",
                        height: "35px",
                        transition: 'background 0.3s ease'
                      }}
                      onClick={() => {
                        handleButtonClick('Delete');
                        setDeleteDailogOpen(true);
                      }}
                      disabled={isModuleLocked}
                    >
                      Delete
                    </Button>

                    <Button
                      variant="contained"
                      style={{
                        width: "100%",
                        background: isModuleLocked
                          ? "gray"
                          : activeButton === 'Clear' ? '#0d6efd' : "#002D68",
                        color: "white",
                        height: "35px",
                        transition: 'background 0.3s ease'
                      }}
                      onClick={() => {
                        handleButtonClick('Clear');
                        handleClearPage();
                      }}
                      disabled={isModuleLocked}
                    >
                      Clear
                    </Button>

                    <Button
                      variant="contained"
                      style={{
                        width: "160%",
                        background: isModuleLocked
                          ? "gray"
                          : isPOView || isEdit
                            ? (activeButton === 'Download' ? '#0d6efd' : "#002D68")
                            : "gray",
                        color: isPOView || isEdit ? "white" : "#000000",
                        height: "35px",
                        transition: 'background 0.3s ease'
                      }}
                      onClick={() => {
                        handleButtonClick('Download');
                        ExportPoEntry(
                          { id: mainId },
                          ExportPoEntrySuccess,
                          ExportPoEntryException
                        );
                      }}
                      disabled={!(isPOView || isEdit) || isModuleLocked}
                    >
                      Download
                    </Button>

                    <Button
                      variant="contained"
                      style={{
                        width: "100%",
                        background: activeButton === 'First' ? '#0d6efd' : "#002D68",
                        color: "white",
                        height: "35px",
                        transition: 'background 0.3s ease'
                      }}
                      onClick={() => {
                        handleButtonClick('First');
                        handleForwardReverse("first", "");
                      }}
                      disabled={isEdit === true}

                    >
                      <FastRewindIcon />
                    </Button>

                    <Button
                      variant="contained"
                      style={{
                        width: "100%",
                        background: activeButton === 'Previous' ? '#0d6efd' : "#002D68",
                        color: "white",
                        height: "35px",
                        transition: 'background 0.3s ease'
                      }}
                      onClick={() => {
                        handleButtonClick('Previous');
                        handleForwardReverse("reverse", mainId);
                      }}
                      disabled={isEdit === true || isModuleLocked}

                    >
                      <SkipPreviousIcon />
                    </Button>

                    <Button
                      variant="contained"
                      style={{
                        width: "100%",
                        background: activeButton === 'Next' ? '#0d6efd' : "#002D68",
                        color: "white",
                        height: "35px",
                        transition: 'background 0.3s ease'
                      }}
                      onClick={() => {
                        handleButtonClick('Next');
                        handleForwardReverse("forward", mainId);
                      }}
                      disabled={isEdit === true}

                    >
                      <SkipNextIcon />
                    </Button>

                    <Button
                      variant="contained"
                      style={{
                        width: "100%",
                        background:
                          activeButton === 'Last' ? '#0d6efd' : "#002D68",
                        color: "white",
                        height: "35px",
                        transition: 'background 0.3s ease'
                      }}
                      onClick={() => {
                        handleButtonClick('Last');
                        handleForwardReverse("last", "");
                      }}
                      disabled={isEdit === true}

                    >
                      <FastForwardIcon />
                    </Button>
                  </div>
                  {/* <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                      padding: "5px",
                    }}
                  > */}{" "}
                  {/* Reduced padding */}
                  <div style={{ display: "flex", gap: "5px" }}>
                    <Button
                      variant="contained"
                      type="button"
                      style={{ height: "35px", backgroundColor: isModuleLocked ? "gray" : "#002d68" }}
                      onClick={handleUpdatePoPrice}
                      disabled={isModuleLocked}
                    >
                      Apply New Price
                    </Button>
                    {/* <Button
                      variant="contained"
                      type="button"
                      style={{ height: "35px", backgroundColor: "#002d68" }}
                      onClick={handleViewClick}
                    >
                      VIEW
                    </Button> */}

                    <Button
                      variant="contained"
                      type="submit"
                      style={{
                        height: "35px",
                        backgroundColor: isModuleLocked
                          ? "gray"
                          : activeButton === 'Save' ? '#0d6efd' : "#002D68",
                        color: "white",
                        transition: 'background 0.3s ease'
                      }}
                      disabled={loading === true || isModuleLocked}
                      onClick={() => handleButtonClick('Save')}
                    >
                      {loading ? (
                        <CircularProgress size={24} style={{ color: 'white' }} />
                      ) : (isEdit ? "UPDATE" : "SAVE")}
                    </Button>

                  </div>
                  {/* </div> */}
                </div>
                <div style={{ maxHeight: "450px", overflowY: "auto" }}>

                  <table id="customers">
                    <thead>
                      <tr>
                        <th>Part No</th>
                        <th>Part Name</th>
                        <th>UOM</th>
                        <th>HSN Code</th>
                        <th>Qty</th>
                        <th>Cum Qty</th>
                        <th>Sch Date</th>
                        <th>Prew Rate</th>
                        <th>Rate</th>
                        <th>Amt</th>
                        <th>Remarks</th>
                        <th>Short Close Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItems && selectedItems.map((item, index) => (
                        <tr key={index}>
                          <td contentEditable={false} onBlur={handleEdit}>
                            {item.itemCode ? (
                              <span>{item?.itemCode}</span>
                            ) : (
                              <Autocomplete
                                fullWidth
                                disablePortal
                                id={`combo-box-${index}`}
                                size="small"
                                disabled={isPOView ? true : false}
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
                          <td contentEditable={false}>{item.itemName}</td>
                          <td contentEditable={false}>{item.uom}</td>
                          <td contentEditable={false}>{item.hsnCode}</td>
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
                          <td contentEditable={false}>{item.cumQty}</td>
                          <td
                            contentEditable={!isPOView}
                            onBlur={(e) =>
                              handleBlur(
                                "SCHDATE",
                                e.target.textContent,
                                item.id,
                                item
                              )
                            }
                          >
                            {/* {item.itemCode
                            ? item.schDate || getFormattedTodayDate()
                            : ""} */}
                            {item.schDate}
                          </td>
                          <td contentEditable={false}>{item.preRate}</td>
                          <td contentEditable={false}>{item.newRate}</td>
                          <td contentEditable={false}>{item.amt}</td>
                          <td contentEditable={!isPOView ? true : false}>
                            {item.remarks}
                          </td>
                          <td
                            contentEditable={false}
                            style={{ textAlign: "center" }}
                          >
                            {item.id === "RDL1" ? null : isPOView ? (
                              <div>
                                <DeleteIcon
                                  style={{ color: "#dddddd", cursor: "pointer" }}
                                />
                                {/* <Checkbox
                                disabled
                                style={{ marginLeft: "8px" }}
                              /> */}
                                {item.isShortCls === 1 ? (
                                  <span style={{ fontWeight: 'normal', marginLeft: "8px" }}>Yes</span>
                                ) : (
                                  <span style={{ fontWeight: 'normal', marginLeft: "8px" }}>No</span>
                                )}
                              </div>
                            ) : (
                              <div>
                                <DeleteIcon
                                  onClick={() => {
                                    handleDeleteRow(item.itemCode);
                                  }}
                                  style={{ color: "black", cursor: "pointer" }}
                                />
                                {/* <Checkbox
                                onChange={(e) =>
                                  handleCheckboxChange(e, item.id)
                                }
                                style={{ marginLeft: "8px" }}
                              /> */}
                                {item.isShortCls === 1 ? (
                                  <span style={{ fontWeight: 'normal', marginLeft: "8px" }}>Yes</span>
                                ) : (
                                  <span style={{ fontWeight: 'normal', marginLeft: "8px" }}>No</span>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

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
          Rate Mismatched
        </DialogTitle>
        <form className="mt-2 space-y-6">
          <DialogContent>
            <Grid container>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                <Card
                  style={{
                    boxShadow: "0 10px 10px 10px rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                    width: "100%",
                    height: "45vh",
                  }}
                >
                  <CardContent>
                    <DataGrid
                      rows={missMatchItems}
                      columns={columns2}
                      pageSize={8}
                      rowsPerPageOptions={[8]}
                      disableSelectionOnClick
                      style={{ border: "none" }}
                      sx={{
                        "& .super-app-theme--header": {
                          WebkitTextStrokeWidth: "0.6px",
                          backgroundColor: "#0d6efd",
                          color: "#1c1919",
                          cursor: "pointer",
                        },
                        "& .MuiDataGrid-cell": {
                          border: "1px solid #969696",
                          cursor: "pointer",
                        },
                        "& .MuiDataGrid-columnHeader": {
                          border: "1px solid #969696",
                          cursor: "pointer",
                        },
                      }}
                      rowHeight={40}
                      columnHeaderHeight={40}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button style={{ background: "#002D68" }} variant="contained" onClick={handleExportClick} endIcon={<GetAppIcon />}>Export</Button>
            <Button style={{ background: "#002D68" }} variant="contained" onClick={handleDialogClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </form>
      </Dialog>
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
        deleteService={POEntryDelete}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />

      <LoadSalesDelNote
        loadPendingModalOpen={loadPendingDelNote}
        setLoadPendingModalOpen={setLoadPendingDelNote}
        setSelectedItems={setSelectedItems}
        customerSelect={customerSelect}
      />
    </div>
  );
};

export default NewPurchaseOrderEntry;
