

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
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import {
  CustomerDropPerformInvoice,
  CustomerDropShowInvoice,
  FetchCustomerAddress,
  FetchGSTCustomerAddress,
  GSTAutoGen,
  GSTAutoGenPerf,
  GSTInvAdd,
  GSTInvUpdate,
  GSTshowconsignee,
  GetGeneratePoSaleOrderEntry,
  GetJobWorkIssueDCCopy,
  GstInvoicePreview,
  GstPartNoSelect,
  GstViewing,
  MstDispatchShowData,
  MstTransporterShowData,
  PartNoSelect,
  PartNoSelectGST,
  PartNoSelectShow,
  PerformInvoiceDelete,
  PerformInvoicePreview,
  PerformInvoiceUpdate,
  PerformInvoiceXlUpload,
  SearchInvoiceViewing,
  gstSaleInvoiceXlUpload,
  handleAddPerformInvoice,
} from "../../ApiService/LoginPageService";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { useEffect } from "react";
import ChangeAddress from "./ChangeAddress";
import DCGstSelectionModel from "./DCGstSelectionModel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useLocation, useNavigate } from "react-router-dom";
import LoadPendingPO from "./LoadPendingPO";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import "../PurchaseOrderGeneration/PurchaseOrder.css";
import DcSelection from "./DcSelection";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import {
  DownloadGstSaleInvoiceTemplate,
  DownloadPerformInvoiceTemplate,
  ExportGstInvoice,
  ExportPerformInvoice,
} from "../../ApiService/DownloadCsvReportsService";
import LabourChargeInvoice from "./LabourChargeInvoice";
import GstTaxInvoice from "./GstTaxInvoice";
import LoadPendingDelNote from "./LoadPendingDelNote";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ChangeShippingAddress from "./ChangeShippingAddress";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useModuleLocks } from "../context/ModuleLockContext";

const NewPerformInvoice = () => {
  const [activeButton, setActiveButton] = useState("");

  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Performa Invoice")?.lockStatus === "locked";

  // const getHighlightColor = (name) => ({
  //   backgroundColor: isModuleLocked
  //     ? "gray"
  //     : activeButton === name ? "#0d6efd" : "#002D68",
  //   transition: "0.3s",
  //   color: "white"
  // });
  const getHighlightColor = (name, isDisabled = false) => ({
    backgroundColor: isDisabled
      ? "#002D68"        // gray ONLY when disabled
      : activeButton === name
        ? "#0d6efd"      // active blue
        : "#002D68",     // default blue
    transition: "0.3s",
    color: "white"
  });

  const [invCode, setInvCode] = useState("Perform");
  const [invType, setInvType] = useState("Assembly");
  const [invAutoCode, setInvAutoCode] = useState("");
  const [date, setDate] = useState("");
  const [autoCode, setAutoCode] = useState("");
  const [customerSelect, setCustomerSelect] = useState("");
  const [customerSelectList, setCustomerSelectList] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [billingAddress, setBillingAddress] = useState([]);
  const [shippingAddress, setShippingAddress] = useState([]);
  const [invIssueDate, setInvIssueDate] = useState(new Date());
  const [dcNo, setDcNo] = useState("");
  const [consignee, setConsignee] = useState("");
  const [add1, setAdd1] = useState("");
  const [add2, setAdd2] = useState("");
  const [add3, setAdd3] = useState("");
  const [add4, setAdd4] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [panNo, setPanNo] = useState("");
  const [dcDate, setDcDate] = useState(new Date());
  const [modeOfDispach, setModeOfDispach] = useState("By Road");
  const [vechicleNo, setVechicleNo] = useState("");
  const [transportDate, setTransportDate] = useState(new Date());
  const [transporterMst, setTransporterMst] = useState("");
  const [transporterList, setTransporterList] = useState([]);
  const [transporterGSTIN, setTransporterGSTIN] = useState("");
  const [distanceKMS, setDistanceKMS] = useState("");
  const [shippingPincode, setShippingPincode] = useState("");
  const [toStatecode, setToStatecode] = useState("");
  const [actualToState, setActualToState] = useState("");
  const [goodsOrService, setGoodsOrService] = useState("G");
  const [goodsOrServiceList, setGoodsOrServiceList] = useState([]);
  const [labourCharge, setLabourCharge] = useState("N");
  const [labourHeadingRequired, setLabourHeadingRequired] = useState("N");
  const [reverseCharge, setReverseCharge] = useState("N");
  const [supplyTypeCode, setSupplyTypeCode] = useState("B2B");
  const [dispatchFrom, setDispatchFrom] = useState("");
  const [dispatchFromadress, setDispatchFromAddress] = useState("");
  const [dispatchList, setDispatchList] = useState([]);
  const [partNo, setPartNo] = useState("");
  const [partNoList, setPartNoList] = useState([]);
  const [gstSalInRows, setGstSalInRows] = useState([]);
  const [dialogViewOpen, setDialogViewOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [resNoTax, setResNoTax] = useState("");
  const [resNoDuty, setResNoDuty] = useState("");
  const [remarks1, setRemarks1] = useState("");
  const [remarks2, setRemarks2] = useState("");
  const [remarks3, setRemarks3] = useState("");
  const [remarks4, setRemarks4] = useState("");
  const [remarks5, setRemarks5] = useState("");
  const [dcDetails, setDcDetails] = useState("");
  const [dutyInWords, setDutyInWords] = useState("");
  const [totalInWords, setTotalInWords] = useState("");
  const [totQty, setTotQty] = useState(0);
  const [taxGSTPayable, setTaxGsTPayable] = useState(0);
  const [lessDisc, setLessDisc] = useState(0);
  const [lessOther, setLessOther] = useState(0);
  const [subTotal, setSubTotal] = useState("");
  const [packFrwrd, setPackFrwrd] = useState(0);
  const [trnsprtcharges, setTrnsprtCharges] = useState(0);
  const [subTotl, setSubTotl] = useState(0);
  const [insurance, setInsurane] = useState(0);
  const [custmrMeterlValue, setCustmrMeterlValue] = useState(0);
  const [ammortisanCost, setAmmortisanCost] = useState(0);
  const [amtGSTPayble, setAmtGSTPayble] = useState(0);
  const [cgst, setCGST] = useState(0);
  const [sgst, setSGST] = useState(0);
  const [igst, setIGST] = useState(0);
  const [utgst, setUTGST] = useState(0);
  const [totlGST, setTotlGST] = useState(0);
  const [tcs, setTCS] = useState(0);
  const [tcsPercentage, setTcsPercentage] = useState(0);
  const [tcsAmount, setTcsAmount] = useState(0);
  const [surChrgesTCS, setSurChrgesTCS] = useState(0);
  const [cessOnTcs, setCessOnTcs] = useState(0);
  const [totlValues, setTotlValues] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [customerSid, setCustomerSid] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [selectedChangeAddress, setSelectedChangeAddress] = useState();
  const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
  const [changeShippingAddressModalOpen, setChangeShippingAddressModalOpen] = useState(false);
  const [dcSelectionModalOpen, setDcSelectionModalOpen] = useState(false);
  const [loadPendingModalOpen, setLoadPendingModalOpen] = useState(false);
  const [loadPendingDelNote, setLoadPendingDelNote] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [custPoNo, setCustPoNo] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [modeOfType, setModeOfType] = useState("");
  const [docketNo, setDocketNo] = useState("");
  const [resonForNoTax, setResonForNoTax] = useState("");
  const [resonForNoduty, setResonForNoduty] = useState("");
  const [selectedItems, setSelectedItems] = useState([{ id: "RDL1" }]);
  const [partNoLabel, setPartNoLabel] = useState("");
  const [pendingPOList, setPendingPOList] = useState([{ id: "RDL1" }]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [cgstPercent, setCgstPercent] = useState(0);
  const [sgstPercent, setSgstPercent] = useState(0);
  const [igstPercent, setIgstPercent] = useState(18);
  const [utgstPercent, setUtgstPercent] = useState(18);
  const [invValue, setInvValue] = useState("");
  const [openOption, setOpenOption] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [option, setOption] = useState("");
  const [cId, setCId] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [refreshData, setRefreshData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModelReason, setIsModelReason] = useState(false);
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [selectedPoItemIds, setSelectedPoItemIds] = useState([]);
  const [dcSelectionData, setDcSelectionData] = useState([]);
  ////////////////////////////////////////////////////////////////////////FORWARD REVERSE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  const [isPOView, setIsPoView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [mainId, setMainId] = useState("");
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [generatedGstLists, setGeneratedGstLists] = useState([]);
  const [subtotal, setSubtotal] = useState("");
  const [frightCharges, setFrightCharges] = useState("");
  const [remarks, setRemarks] = useState("");
  const [cgstper, setCgstper] = useState("");
  const [cgstText, setCgstText] = useState("");
  const [sgstper, setSgstper] = useState("");
  const [sgstText, setSgstText] = useState("");
  const [igstper, setIGstper] = useState("");
  const [igstText, setIGstText] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [invoiceRemarks, setInvoiceRemarks] = useState("");
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadLoader, setUploadLoader] = useState(false);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const location = useLocation();
  const { items } = location.state || { items: [] };
  //--View--//
  // const isPOView = new URLSearchParams(location.search).get("isPOView");
  const poRowId = new URLSearchParams(location.search).get("poRowId");

  //--Edit--//
  // const isEdit = new URLSearchParams(location.search).get("isEdit");

  useEffect(
    () => {

      handleForwardReverse("last", "");
    },
    [
      /*isPOView, isEdit, poRowId, invCode*/
    ]
  );

  const handleGstViewing = (dataObject) => {
    const data = dataObject.data.invoice;
    setInvCode(data?.invCode);
    setInvType(data?.type);
    setInvAutoCode(data?.invSt);
    setSelectedCustomerName(data?.cName || "");
    setAutoCode(data?.invNo || "");
    setBillingAddress(data?.billAdd || "");
    setInvIssueDate(data?.invoIssuDate || "");
    setDcNo(data?.dcNO || "");
    setDcDate(data?.dcDate || "");
    setModeOfDispach(data?.modelOfDis || "");
    setVechicleNo(data?.vechileNO || "");
    setCustPoNo(data?.custPoNo || "");
    setConsignee(data?.Consignee || "");
    setAdd1(data?.add1 || "");
    setAdd2(data?.add2 || "");
    setAdd3(data?.add3 || "");
    setAdd4(data?.add4 || "");
    setGstNo(data?.gstNo || "");
    setPanNo(data?.panNo || "");
    setTransactionType(data?.trType || "");
    setModeOfType(data?.modeOfType || "");
    setTransportDate(data?.traDate || "");
    setTransporterMst(data?.transporter || "");
    setTransporterGSTIN(data?.TransporterGSTIN || "");
    setDistanceKMS(data?.distKms || "");
    setShippingPincode(data?.shipPincode || "");
    setToStatecode(data?.stateCode || "");
    setGoodsOrService(data?.goodsOrService || "");
    setLabourCharge(data?.labourCharge || "");
    setLabourHeadingRequired(data?.labourCrgesHdingReqed || "");
    setReverseCharge(data?.reverseCharge || "");
    setSupplyTypeCode(data?.supplyTypeCode || "");
    setDispatchFrom(data?.dispatchFrom || "");
    setDispatchFromAddress(data?.dispatchFrom || "")
    setTotQty(data?.totalQty || "");
    setTaxGsTPayable(data?.taxableValueforGST || "");
    setLessDisc(data?.lessDisc || "");
    setLessOther(data?.lessOther || "");
    setSubTotal(data?.subTotAfterDisc || "");
    setPackFrwrd(data?.packingForw || "");
    setTrnsprtCharges(data?.transportCharges || "");
    setSubTotl(data?.subtotal || "");
    setInsurane(data?.Insurance || "");
    setCustmrMeterlValue(data?.custMeterialValue || "");
    setAmmortisanCost(data?.AmmortisationCost || "");
    setAmtGSTPayble(data?.amtOfGstPay || "");
    setCGST(data?.CGST || "");
    setSGST(data?.SGST || "");
    setIGST(data?.IGST || "");
    setUTGST(data?.UTGST || "");
    setTotlGST(data?.totGst || "");
    setTCS(data?.tcs || "");
    setSurChrgesTCS(data?.subChargeOnTcs || "");
    setTotlValues(data?.totalValue || "");
    setRoundOff(data?.roundOff || "");
    setInvValue(data?.invValue || "");
    setSelectedItems(dataObject?.data?.items || []);
  };

  const handleGstViewingException = (errorObject, errorMessage) => { };

  const onInvTypeChange = (e) => {
    setInvType(e.target.value);
  };

  const onInvCodeChange = (e) => {
    setInvCode(e.target.value);
    GSTAutoGenPerf(
      { po: e.target.value },
      handleGSTAutoGen,
      handleGSTAutoGenException
    );
  };

  const handleGSTAutoGen = (dataObject) => {
    setInvAutoCode(dataObject.digit);
    setAutoCode(dataObject.id);
  };

  const handleGSTAutoGenException = (errorStatus, errorMessage) => {
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
  };

  const optionsCustList = Array.isArray(customerSelectList)
    ? customerSelectList.map((item) => ({
      cId: item?.cId,
      label: item?.cCode,
      cName: item?.cName,
      id: item?.id,
    }))
    : [];

  function onCustomerSelectChange(selectedValue) {
    console.log("selectedValueselectedValue", selectedValue)
    setSelectedCustomerName(selectedValue?.cName);
    setCustomerSelect(selectedValue?.id);
    setCustomerName(selectedValue?.label);
    setCId(selectedValue?.cId);
    setCustomerSid(selectedValue?.cId);
    FetchGSTCustomerAddress(
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
    setCountry(dataObject?.data[0]?.country || "");
    setGstNo(dataObject?.data[0]?.gstNo || "");
    setPanNo(dataObject?.data[0]?.panNo || "");
    setSurChrgesTCS(dataObject?.data[0]?.SubcharOnTcs || "");
    setCessOnTcs(dataObject?.data[0]?.CessOnTcs || "");
  };

  const handleFetchCustAddressException = (errorStaus, errorMessage) => { };

  const handleBillingTextFieldChange = (event) => {
    setBillingAddress(event.target.value);
  };

  const handleShippingTextFieldChange = (event) => {
    setShippingAddress(event.target.value);
  };

  const handleClearAddress = () => {
    setAdd1("");
    setAdd2("");
    setAdd3("");
    setAdd4("");
    setGstNo("");
    setPanNo("");
  };

  const onModeDispatchChange = (e) => {
    setModeOfDispach(e.target.value);
  };

  const onGoordsOrServiceChange = (e) => {
    setGoodsOrService(e.target.value);
  };

  const handleRowSelection = (selection) => {
    if (selection.rows.length > 0) {
      const selectedRowIndex = selection.rows[0];
      setSelectedRow(rows[selectedRowIndex].data);
    }
  };

  useEffect(() => {
    MstTransporterShowData(
      handleTransportershow,
      handleTransportershowException
    );
    MstDispatchShowData(handleDispatchshow, handleDispatchshowException);
    // GSTshowconsignee({id:cId},handleGSTshowconsignee, handleGSTshowconsigneeException);
  }, [partNo, isModalOpen]);

  const handleChangeCustomer = (e) => {
    CustomerDropPerformInvoice(
      { code: e.target.value },
      handleCustomerDropshow,
      handleCustomerDropshowException
    );
  };

  const handleCustomerDropshow = (dataObject) => {
    setCustomerSelectList(dataObject?.data || []);
  };

  const handleCustomerDropshowException = (error, errorMessage) => { };

  const handleTransportershow = (dataObject) => {
    setTransporterList(dataObject?.data || []);
  };

  const handleTransportershowException = (error, errorMessage) => { };

  const handleDispatchshow = (dataObject) => {
    setDispatchList(dataObject?.data || []);
    const getDefaultAddress = dataObject?.data[0];
    console.log("getDefaultAddressgetDefaultAddress", getDefaultAddress)
    setDispatchFromAddress(getDefaultAddress?.dispatchAdd);
    // setDispatchFromCopy(getDefaultAddress?.dispatchAdd);
    // setDispatchFromId(getDefaultAddress?.id || "");
  };

  const handleDispatchshowException = (error, errorMessage) => { };

  const handleGSTshowconsignee = (dataObject) => {
    setRows(dataObject?.data || []);
  };

  const handleGSTshowconsigneeException = (errorObject, errorMessage) => { };

  const handleSelectedItemsDeleteRow = (id) => {
    const newArray = selectedItems.filter((item) => item.id != id);
    console.log(
      "idididididididididididiididididididididiididididi",
      selectedItems
    );
    setSelectedItems(newArray);
    // TO MINUS THE AMOUNT IN TOTAL_GRID
    calculateTotals(newArray);
  };
  const handlePendingPoDeleteRow = (id) => {
    const newArray = pendingPOList.filter((item) => item.id != id);
    console.log(
      "idididididididididididiididididididididiididididi",
      selectedItems
    );
    setPendingPOList(newArray);
    // TO MINUS THE AMOUNT IN TOTAL_GRID
    calculateTotals(newArray);
  };

  const columns1 = [
    {
      field: "cAddress",
      headerClassName: "super-app-theme--header",
      headerName: "Consignee",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "city",
      headerClassName: "super-app-theme--header",
      headerName: "Add 1",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "pincode",
      headerClassName: "super-app-theme--header",
      headerName: "Add 2",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "state",
      headerClassName: "super-app-theme--header",
      headerName: "Add 3",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "country",
      headerClassName: "super-app-theme--header",
      headerName: "Add 4",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "gstNo",
      headerClassName: "super-app-theme--header",
      headerName: "GSTNO",
      type: "string",
      sortable: true,
      sortable: false,
      flex: 1,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "panNo",
      headerClassName: "super-app-theme--header",
      headerName: "Pan No",
      type: "string",
      sortable: true,
      sortable: false,
      flex: 1,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
    },
  ];

  const onTransporterMstChange = (e) => {
    setTransporterMst(e.target.value);
  };

  const onLabourChange = (e) => {
    setLabourCharge(e.target.value);
  };

  const onLabourHeadingChange = (e) => {
    setLabourHeadingRequired(e.target.value);
  };

  const onReverseChargeChange = (e) => {
    setReverseCharge(e.target.value);
  };

  const onSupplyTypeChange = (e) => {
    setSupplyTypeCode(e.target.value);
  };

  const onDispatchFromChange = (e) => {
    setDispatchFrom(e.target.value);
  };

  const optionsPartNoList = partNoList
    ? partNoList.map((item) => ({
      value: item?.id,
      label: item?.label,
    }))
    : [];

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

  function onPartNoSelectChange(selectedValue, event) {
    setPartNo(selectedValue?.id);
    setPartNoLabel(selectedValue?.label);
    // GstPartNoSelect(
    //   { id: selectedValue?.label },
    //   handlePartNoShowSuccess,
    //   handlePartNoSelectException
    // );
    PartNoSelect(
      {
        id: customerSelect,
        id2: selectedValue?.value,
      },
      handlePartNoShowSuccess,
      handlePartNoSelectException
    );
  }

  // const [dcPartNo,setDcPartNo] = useState('');
  const handlePartNoShowSuccess = (dataObject) => {
    const data = dataObject?.data || [];
    // setDcPartNo(data[0].itemCode);
    setRows(data);
    const formattedData = data.map((item) => ({
      itemId: item.id || null,
      // suppDesc: null,
      // itemCode: item?.itemCode || "",
      itemName: item.itemName || "",
      uom: item.uom || 0,
      // soNo: item.soNo || "",
      // poNo: item.poNo || "",
      qty: item.qty || "",
      // cumQty: item.cumQty || "",
      // pendQty: item.pendQty || 0,
      hsnCode: item.hsnCode || "",
      // schDate: item.schDate || "",
      // invQty: item.invQty || "",
      // stdRate: item.stdRate || "",
      amt: item.amt || "",
      rate: item.rate || "",
      // descOfPackage: item.descOfPackage || "",
      // poId: item.poId || "",
      // poItemId: item.poItemId || "",
    }));

    if (formattedData.length > 0) {
      const clonedSelectedItems = [...selectedItems];
      const lastObj = clonedSelectedItems.pop();
      clonedSelectedItems.push(...formattedData, lastObj);
      setSelectedItems(clonedSelectedItems);
      calculateTotals(clonedSelectedItems);
      // setPendingPOList(clonedSelectedItems);
    }
  };

  const handlePartNoSelectException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setRows([]);
  };

  const generateRowsWithIndex = (selectedItems) => {
    return (
      selectedItems &&
      selectedItems.map((selectedItems, index) => ({
        sNo: index + 1,
        ...selectedItems,
      }))
    );
  };

  const rowData = generateRowsWithIndex(selectedItems);


  const handleSubmit = (e) => {

    e.preventDefault();
    setLoading(true);
    if (isEdit) {
      PerformInvoiceUpdate(
        {
          commonData: {

            id: mainId,
            invSt: invAutoCode,
            invCode: invCode,
            invNo: autoCode,
            date: selectedDate,
            custId: customerSelect,
            billAdd: billingAddress,
            shipAdd: shippingAddress,
            subTotal: subtotal,
            frightCharges: frightCharges,
            remarks: invoiceRemarks,
            cgstPer: cgstper,
            cgst: cgstText,
            sgstPer: sgstper,
            sgst: sgstText,
            igstPer: igstper,
            igst: igstText,
            totalValue: totalValue,
          },
          dtlData: selectedItems,
        },
        handleSuccess,
        handleException
      );

    }
    else {
      handleAddPerformInvoice(
        {
          commonData: {
            invSt: invAutoCode,
            invCode: invCode,
            invNo: autoCode,
            date: selectedDate,
            custId: customerSelect,
            billAdd: billingAddress,
            shipAdd: shippingAddress,
            subTotal: subtotal,
            frightCharges: frightCharges,
            remarks: invoiceRemarks,
            cgstPer: cgstper,
            cgst: cgstText,
            sgstPer: sgstper,
            sgst: sgstText,
            igstPer: igstper,
            igst: igstText,
            totalValue: totalValue,
          },
          dtlData: selectedItems,
        },
        handleSuccess,
        handleException
      );
    }

  };

  const handleSuccess = (dataObject) => {
    setRefreshData((oldValue) => !oldValue);
    handleForwardReverse("last", "");

    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    ClearData();
    setTimeout(() => {
      handleClose();
      setLoading(false);
    }, 2000)
  };

  const handleException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // ClearData();
      setRefreshData((oldValue) => !oldValue);
      setLoading(false);
    }, 2000);
  };



  const calculateTotals = (data) => {
    const totalQty = data.reduce(
      (acc, item) => acc + (Number(item.amt) || 0),
      0
    );
    console.log("totalQty", totalQty);
    setSubtotal(totalQty);
    return [{ id: 1, totalQty }];
  };

  useEffect(() => {
    calculateTotals(selectedItems);
  }, [selectedItems]);

  // GST CALCULATTION
  useEffect(() => {
    const freightCharge = Number(subtotal) + Number(frightCharges);
    setFrightCharges(frightCharges);
    var cgstAmount = (freightCharge * cgstper) / 100;
    setCgstText(cgstAmount);
    var sgstAmount = (freightCharge * sgstper) / 100;
    setSgstText(sgstAmount);
    var igstAmount = (freightCharge * igstper) / 100;
    setIGstText(igstAmount);
    let totalAmount =
      Number(freightCharge) + Number(cgstAmount) + Number(sgstAmount) + Number(igstAmount);
    setTotalValue(Math.round(totalAmount));
  }, [
    cgstper,
    sgstper,
    igstper,
    cgstText,
    sgstText,
    igstText,
    totalValue,
    frightCharges,
    subtotal,
  ]);



  const updateTotalQty = (params) => {
    const updatedList = selectedItems.map((supp) =>
      supp.id === params.id
        ? {
          ...supp,
          schDate: "20/02/2024",
          invQty: params.invQty,
          stdRate: Number(params.stdRate) * Number(params.newRate),
        }
        : supp
    );
    setSelectedItems(updatedList);
    calculateTotals(updatedList);
  };

  const handleUpdateSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      setRefreshData((oldValue) => !oldValue);
    }, 2000);
  };

  const ClearData = () => {
    setMainId("");
    setInvCode("Perform");
    setInvType("Assembly");
    setInvAutoCode("");
    setAutoCode("");
    setCustomerSelect("");
    setCustomerSelectList([]);
    setCustomerName("");
    setBillingAddress("");
    setShippingAddress("");
    setInvIssueDate(new Date());
    setInvoiceRemarks("");
    setSubtotal("");
    setFrightCharges("");
    setSelectedCustomerName("");
    setCId("");
    setCustomerSid("");
    setSelectedItems([]);
    setCgstper("");
    setCgstText("");
    setSgstper("");
    setSgstText("");
    setIGstper("");
    setIGstText("");
    setTotalValue("");
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = () => {
    alert("fvdfvdfd");
    {
      /* <GSTLabTaxInv /> */
    }
  };

  const navigate = useNavigate();
  const handleViewClick = () => {
    navigate("/NewGstInvView");
  };

  const handleEdit = (cellNam, newValue, id, rowData) => {
    let updatedItems;

    switch (cellNam) {
      case "invQty":
        updatedItems = selectedItems.map((supp) =>
          supp.id === id && cellNam === "invQty"
            ? {
              ...supp,
              invQty: Number(newValue),
              amt: Number(newValue) * Number(rowData.stdRate),
            }
            : supp
        );
        break;
      default:
        return;
    }

    setSelectedItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const handleEditPendingPo = (cellNam, newValue, id, rowData) => {
    let updatedItems;

    switch (cellNam) {
      case "invQty":
        updatedItems = pendingPOList.map((supp) =>
          supp.id === id && cellNam === "invQty"
            ? {
              ...supp,
              invQty: Number(newValue),
              amt: Number(newValue) * Number(rowData.stdRate),
            }
            : supp
        );
        break;
      default:
        return;
    }

    setPendingPOList(updatedItems);
    calculateTotals(updatedItems);
  };

  const handleEdit1 = (field, value, id) => {
    // Update the pendingPOList here, e.g.:
    const updatedList = pendingPOList.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setPendingPOList(updatedList);
  };

  const [dcSelectionFlag, setDcSelectionFlag] = useState(false);
  const handleDcSelectionClick = () => {
    // const mergeSelectedAndPending = [...pendingPOList, ...selectedItems];
    // const poItemIds = mergeSelectedAndPending.map(item => item.poItemId);
    // setSelectedPoItemIds(poItemIds)
    const mergeSelectedAndPending = [...pendingPOList, ...selectedItems];
    console.log(
      "mergeSelectedAndPendingmergeSelectedAndPendingmergeSelectedAndPending",
      mergeSelectedAndPending
    );
    const poItemIds = mergeSelectedAndPending
      .filter((item) => item.id !== "RDL1")
      .map((item) => ({ id: item.poItemId, invQty: item.invQty }));

    // Remove duplicates based on the 'id' property
    const uniquePoItemIds = Array.from(
      new Map(poItemIds.map((item) => [item.id, item])).values()
    );
    setSelectedPoItemIds(uniquePoItemIds);
    // setSelectedPoItemIds(poItemIds);
    setTimeout(() => {
      setDcSelectionFlag(true);
    }, 2000);
    // navigate(`/DcSelection?cId=${cId}`);
  };

  const [open, setOpen] = useState(false);

  function numberToWords(number) {
    const units = [
      "Zero",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    if (number < 10) {
      return units[number];
    } else if (number < 20) {
      return teens[number - 10];
    } else if (number < 100) {
      return (
        tens[Math.floor(number / 10)] +
        (number % 10 !== 0 ? " " + units[number % 10] : "")
      );
    } else if (number < 1000) {
      return (
        units[Math.floor(number / 100)] +
        " Hundred" +
        (number % 100 !== 0 ? " " + numberToWords(number % 100) : "")
      );
    } else if (number < 1000000) {
      return (
        numberToWords(Math.floor(number / 1000)) +
        " Thousand" +
        (number % 1000 !== 0 ? " " + numberToWords(number % 1000) : "")
      );
    } else if (number < 1000000000) {
      return (
        numberToWords(Math.floor(number / 1000000)) +
        " Million" +
        (number % 1000000 !== 0 ? " " + numberToWords(number % 1000000) : "")
      );
    } else {
      return (
        numberToWords(Math.floor(number / 1000000000)) +
        " Billion" +
        (number % 1000000000 !== 0
          ? " " + numberToWords(number % 1000000000)
          : "")
      );
    }
  }

  const handleViewMore = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDialogClose = () => {
    setSelectedRow(rows.data);
    setDialogOpen(false);
  };

  const handleTableRowClick = () => {
    setDialogOpen(true);
  };

  const handleModelReason = () => {
    setOpen(true);
  };

  const handleCloseReason = () => {
    setOpen(false);
  };

  // HANDLE FORWARD REVERSE HANDLER
  const handleForwardReverse = (type, id) => {
    PerformInvoicePreview(
      { type: type, id: id },
      handleActionSuccess,
      handleActionException
    );
  };

  const handleActionSuccess = (dataObject) => {
    setIsPoView(true);
    const data = dataObject.data.invoice;
    setMainId(data?.id)
    setInvCode(data?.invCode);
    setInvType(data?.type);
    setInvAutoCode(data?.invSt);
    setSelectedCustomerName(data?.cName || "");
    setAutoCode(data?.invNo || "");
    setCustomerSelect(data?.custId);
    setBillingAddress(data?.billAdd || "");
    setShippingAddress(data?.shipAdd || "");
    setInvoiceRemarks(data?.remarks || "");
    setSubtotal(data?.subtotal || "");
    setFrightCharges(data?.frightCharges || "");
    setCgstper(data?.cgstPer || "");
    setCgstText(data?.cgst || "");
    setSgstper(data?.sgstPer || "");
    setSgstText(data?.sgst || "");
    setIGstper(data?.igstPer || "");
    setIGstText(data?.igst || "");
    setTotalValue(data?.totalValue || "");
    setSelectedItems(dataObject?.data?.items || []);
  };
  const handleActionException = () => { };

  const handleClearPage = () => {
    setIsPoView(false);
    setIsEdit(false);
    setMainId("");
    setInvCode("Perform");
    setInvType("Assembly");
    setInvAutoCode("");
    setAutoCode("");
    setCustomerSelect("");
    setCustomerSelectList([]);
    setCustomerName("");
    setBillingAddress("");
    setShippingAddress("");
    setInvIssueDate(new Date());
    setInvoiceRemarks("");
    setSubtotal("");
    setFrightCharges("");
    setSelectedCustomerName("");
    setCId("");
    setCustomerSid("");
    setSelectedItems([{ id: "RDL1", qty: "", amt: "" }]);
    setCgstper("");
    setCgstText("");
    setSgstper("");
    setSgstText("");
    setIGstper("");
    setIGstText("");
    setTotalValue("");
    GSTAutoGenPerf({ po: "Perform" }, handleGSTAutoGen, handleGSTAutoGenException);
  };

  const ExportGstInvoiceSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: "Download Success",
    });
    setTimeout(() => {
      // setUploadLoader(false);
      // handleClose();
    }, 2000);
  };

  const ExportGstInvoiceException = () => { };

  const handlePrintClick = (value) => {
    if (value === "Y") {
      return <LabourChargeInvoice rowData={mainId} />;
    } else {
      return <GstTaxInvoice rowData={mainId} />;
    }
  };

  // UNIQUE CODE MANUAL CHANGE
  const handleUniqueCodeChange = (e) => {
    const newUniqueCode = e.target.value;
    const currentYear = autoCode.split('/')[0]; // Get last 2 digits of the year
    setInvAutoCode(newUniqueCode /*.toString().padStart(5,0)*/);
    setAutoCode(
      `${currentYear}/${invCode}/${newUniqueCode.toString().padStart(5, 0)}`
    );
  };

  //SEARCH GENERATED GST INVOICE ENTRY
  const handlePOChange = (e) => {
    GetGeneratePoSaleOrderEntry(
      { type: "perfomaInvoice", code: e.target.value },
      handleGeneratedPoSucessShow,
      handleGeneratedPoExceptionShow
    );
  };

  const handleGeneratedPoSucessShow = (dataObject) => {
    setGeneratedGstLists(dataObject?.data || []);
  };
  const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => { };

  const handleGeneratedPoSelect = (selectedValue) => {
    setIsPoView(true);
    if (selectedValue !== null) {
      setMainId(selectedValue.id);
      SearchInvoiceViewing(
        { id: selectedValue.id },
        handleSearchActionSuccess,
        handleSearchActionException
      );
    }
  };

  const handleSearchActionSuccess = (dataObject) => {
    setIsPoView(true);
    const data = dataObject.data.invoice;
    setMainId(data?.id)
    setInvCode(data?.invCode);
    setInvType(data?.type);
    setInvAutoCode(data?.invSt);
    setSelectedCustomerName(data?.cName || "");
    setAutoCode(data?.invNo || "");
    setCustomerSelect(data?.custId);
    setBillingAddress(data?.billAdd || "");
    setShippingAddress(data?.shipAdd || "");
    setInvoiceRemarks(data?.remarks || "");
    setSubtotal(data?.subtotal || "");
    setFrightCharges(data?.frightCharges || "");
    setCgstper(data?.cgstPer || "");
    setCgstText(data?.cgst || "");
    setSgstper(data?.sgstPer || "");
    setSgstText(data?.sgst || "");
    setIGstper(data?.igstPer || "");
    setIGstText(data?.igst || "");
    setTotalValue(data?.totalValue || "");
    setSelectedItems(dataObject?.data?.items || []);
  }


  const handleSearchActionException = () => {

  }


  const handleDownloadSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: "Download Success",
    });
  };

  const handleDownloadException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
  };

  // XL UPLOAD HANDLER
  const handleItemImportSucess = (dataObject) => {
    setSelectedItems(dataObject?.message?.result || []);
    // setUploadLoader(false);
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message.message,
    });
    setTimeout(() => {
      setUploadLoader(false);
    }, 2000)
  };

  const handleItemImportException = (errorObject, errorMessage) => {
    // setSelectedItems([{ id: 'RDL1' }]);
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // setUploadLoader(false);
      // handleClose();
      setUploadLoader(false);
    }, 2000);
  };

  const deletehandleSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });

    setTimeout(() => {
      handleClose();
      setDeleteDailogOpen(false);
      ClearData()
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

  const getInvoiceData = (jobWorkId) => {
    // GetJobWorkIssueDCCopy({ id: jobWorkId }, getInvoiceDataSuccess, getInvoiceDataExceptoin)
  }

  const getInvoiceDataSuccess = (dataObject) => {
    console.log("getInvoiceDataSuccess", dataObject)
    handleFileSave(dataObject || [])
  }

  const getInvoiceDataExceptoin = (errorObject, errorMessage) => {
    console.log("error Msg", errorMessage);
  }


  const handleFileSave = (item) => {
    let info = [];
    item.itemsList.forEach((element, index, array) => {
      info.push([element.sNo, element.itemCode, element.itemName, element.hsnName, element.uomName, element.Qty, element.rate, element.amount])
    });

    // Ensure a minimum of 10 items
    const minItems = 16;
    const placeholderItem = [''];
    while (info.length < minItems) {
      info.push([...placeholderItem]);
    }

    const doc = new jsPDF();

    const logoUrl = require('../../AllImage/RDL_Logo.png');
    const ISOUrl = require('../../AllImage/ISOlogo.png');

    const tableOptions = {
      didDrawPage: (HookData) => {
        // Check if it's the first page
        if (HookData.pageNumber === 1) {
          // Add an image on the first page
          doc.addImage(logoUrl, 'PNG', 31, 13, 28, 20);
          doc.addImage(ISOUrl, 'PNG', 175, 10, 20, 10);
        }
      },
    };

    const logoAndAddress = [
      [
        {
          content: 'ORIGINAL FOR CONSIGNEE',
          colSpan: 8,
          styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0 }
        }
      ],
      [
        {
          content: {
            image: logoUrl,
            width: 30, // adjust the width as needed
            height: 30, // adjust the height as needed
          },
          colSpan: 2
        },
        {
          content: 'RDL Technologies Pvt Ltd.\nPlot No. 126, Road No 3, KIADB Industrial Estate\nII Phase, Jigani Industrial Area, Jigani,Anekal Taluk,\nBengaluru - 560 105. Tel:080-27825249\nWeb Site :www.mallikengineering.com\nEmail : info@mallikengineering.com',
          colSpan: 5,
          styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        },
        {
          content: 'ISO 9001 : 2015\nISO 14001 : 2015\nOHSAS 18001 : 2007',
          colSpan: 1,
          styles: { halign: 'right', fontSize: 8, textColor: 'black', valign: 'bottom' }
        }
      ]
    ];
    const pan = [[
      {
        content: 'CIN No. U28112KA2013PTC068181',
        colSpan: 3,
        styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
      },
      {
        content: 'PAN No.AAICM4744Q',
        colSpan: 1,
        styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
      },
      {
        content: 'GSTINO. 29AAICM4744Q1ZM',
        colSpan: 3,
        styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
      },
      {
        content: `No: ${item.jobWork.dcNo}`,
        colSpan: 1,
        styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
      }
    ]];
    const poHeader = [[{ content: 'DELIVERY CHALLAN', colSpan: 8, styles: { textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' } }]];
    const address = [
      [
        {
          content: `To: \nM/s. ${item.jobWork.supplierName}\n${item.jobWork.address}\nPAN No: ${item.jobWork.panNo}\nGST No: ${item.jobWork.gstNo}`,
          colSpan: 4,
          styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
        },

        {
          content: `Ship To: \nM/s. ${item.jobWork.supplierName}\n${item.jobWork.address}\nPAN No: ${item.jobWork.panNo}\nGST No: ${item.jobWork.gstNo}`,
          colSpan: 4,
          styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
        },
      ],
      [
        {
          content: `Place of Supply & State : ${item.jobWork.state}`,
          colSpan: 4,
          styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
        },
        {
          content: `State Code : ${item.jobWork.toStateCode}`,
          colSpan: 4,
          styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
        },
      ]

    ];
    const firstHeaderRow = [
      [
        {
          content: `DC NO: ${item.jobWork.dcNo}`,
          colSpan: 3,
          styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
        },
        {
          content: `Challan No: ${item.jobWork.challanNo} `,
          colSpan: 3,
          styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
        },
        {
          content: `Mode of Trans: ${item.jobWork.modeOfTransport}`,
          colSpan: 2,
          styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
        }
      ],
      [
        {
          content: `DC Date: ${item.jobWork.created_at}`,
          colSpan: 3,
          styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
        },
        {
          content: `Challan Date: ${item.jobWork.challanDate}`,
          colSpan: 3,
          styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
        },
        {
          content: `Vehicle No:${item.jobWork.vehicleNo}`,
          colSpan: 2,
          styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
        }
      ],
    ];

    const secondHeaderRow = [['SI No', 'Part Name', 'Part Description ', 'HSN /SAC', 'UOM', 'Qty', 'Rate', 'Amount']];

    const headerRows = [...logoAndAddress, ...pan, ...poHeader, ...address, ...firstHeaderRow, ...secondHeaderRow];

    const totalRow = [
      [
        {
          content: `Remarks :${item.jobWork.remarks}`,
          colSpan: 5,
          rowSpan: 1,
          styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        },
        {
          content: 'Total Qty',
          colSpan: 1,
          styles: { halign: 'center', fontSize: 10, textColor: 'black' }
        },
        {
          content: item.jobWork.totalQty,
          colSpan: 2,
          styles: { halign: 'center', fontSize: 10, textColor: 'black' }
        },
      ],
      [
        {
          content: `DC Issue Date : ${item.jobWork.created_at}`,
          colSpan: 5,
          rowSpan: 1,
          styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        },
        {
          content: 'Total Value',
          colSpan: 1,
          styles: { halign: 'center', fontSize: 10, textColor: 'black' }
        },
        {
          content: item.jobWork.totalValue,
          colSpan: 2,
          styles: { halign: 'center', fontSize: 10, textColor: 'black' }
        },

      ],
      [
        {
          content: 'Subject to Bengaluru Jurisdiction',
          colSpan: 5,
          rowSpan: 1,
          styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        },
        {
          content: 'Gross Value',
          colSpan: 1,
          styles: { halign: 'center', fontSize: 10, textColor: 'black' }
        },
        {
          content: item.jobWork.totalGrossAmt,
          colSpan: 2,
          styles: { halign: 'center', fontSize: 10, textColor: 'black' }
        },

      ],
    ];


    const termsAndSuppluColumn = [
      [
        {
          content: `Receiver's Signature`,
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'black', valign: 'bottom', marginTop: 10, paddingTop: 10 }
        },
        {
          content: `Prepared By ${item.jobWork.createdBy} `,
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'black', valign: 'bottom', marginTop: 10, paddingTop: 10 }
        },
        {
          content: 'Reviewed By',
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'black', valign: 'bottom', marginTop: 10, paddingTop: 10 }
        },
        {
          content: 'Authorized Signatory',
          colSpan: 4,
          styles: { halign: 'left', fontSize: 10, textColor: 'black', marginTop: 10, paddingTop: 10 }
        }

      ],

    ]

    //Table Border lines
    const outerTable = [
      [
        {
          content: 'Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076',
          colSpan: 10,
          styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', lineWidth: 0 }
        },
      ],

    ];

    const bodyRows = [...info, ...totalRow, ...termsAndSuppluColumn,]
    const footRows = [...outerTable]

    doc.autoTable({
      theme: 'striped',
      head: headerRows,
      body: bodyRows,
      foot: footRows,
      showHead: 'firstPage',
      showFoot: 'lastPage',
      startY: 2,
      ...tableOptions,
      headStyles: {
        fillColor: [255, 255, 255], // Header background color
        textColor: [0, 0, 0], // Header text color
        halign: 'center', // Header text alignment
        valign: 'middle', // Vertical alignment
        lineWidth: 0.1, // Border width
        lineColor: [0, 0, 0], // Border color,
        font: 'times',
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Header background color
        textColor: [0, 0, 0], // Header text color
        halign: 'center', // Header text alignment
        valign: 'middle', // Vertical alignment
        lineWidth: 0.1, // Border width
        lineColor: [0, 0, 0], // Border color
        fontStyle: 'normal',
        fontSize: 8,
        font: 'times',
      },
      footStyles: {
        fillColor: [255, 255, 255], // Header background color
        textColor: [0, 0, 0], // Header text color
        halign: 'center', // Header text alignment
        valign: 'middle', // Vertical alignment
        lineWidth: 0.1, // Border width
        lineColor: [0, 0, 0], // Border color
        font: 'times',
      },
    });

    // doc.save('PurchaseOrder.pdf');
    const pdfBlob = doc.output('blob');
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfBlobUrl);
  }

  const handleQtyChange = (index, value) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].qty = value;
    updatedItems[index].amt = (value || 0) * (parseFloat(updatedItems[index].rate) || 0);
    setSelectedItems(updatedItems);
  };

  // const handleQtyChange = (index, qty) => {
  //   setYourData((prevData) => {
  //     const updatedData = [...prevData];
  //     updatedData[index].qty = qty;

  //     // ✅ Auto-calculate amt = qty × rate
  //     updatedData[index].amt = (qty || 0) * (updatedData[index].rate || 0);

  //     return updatedData;
  //   });
  // };


  return (
    <>
      {!dcSelectionFlag ? (
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
                ? "Proforma Invoice/Quotation"
                : isEdit
                  ? "Edit Proforma Invoice/Quotation"
                  : "New Proforma Invoice/Quotation"}
            </Typography>
            <div style={{ width: "250px", marginRight: "10px" }}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={generatedGstLists}
                fullWidth
                // value={selectedGeneratedPo}
                getOptionLabel={(option) =>
                  option.digit || /*selectedGeneratedPo*/ ""
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Invoice"
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
                  <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                    <FormControl fullWidth>
                      {/* <InputLabel id="demo-simple-select-label">INV Type</InputLabel> */}
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // label="INV Type"
                        // placeholder="INV Type"
                        size="small"
                        disabled={isPOView ? true : false}
                        style={{
                          backgroundColor: "#ffffff",
                          borderRadius: "5px",
                        }}
                        value={invCode}
                        onChange={(e) => onInvCodeChange(e)}
                      >
                        <MenuItem value="Perform">Perform</MenuItem>
                        <MenuItem value="Quote">Quote</MenuItem>

                        {/* <MenuItem value="Store">Store</MenuItem>
                      <MenuItem value="Scrap">Scrap</MenuItem>
                      <MenuItem value="Assembly">Assembly</MenuItem> */}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          INV Type
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="INV Type"
                          placeholder="INV Type"
                          size="small"
                          disabled={isPOView ? true : false}
                          style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "5px",
                          }}
                          value={invType}
                          onChange={(e) => onInvTypeChange(e)}
                        >
                          <MenuItem value="Store">Store</MenuItem>
                          <MenuItem value="Scrap">Scrap</MenuItem>
                          <MenuItem value="Assembly">Assembly</MenuItem>
                        </Select>
                      </FormControl> */}
                  {/* <TextField
                    fullWidth
                    size="small"
                    value={invCode}
                    style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                    disabled={isPOView ? true : false}
                    onChange={(e) => setInvCode(e.target.value)}
                  /> */}
                  {/* </Grid> */}
                  <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                    <TextField
                      fullWidth
                      label="Docket No"
                      placeholder="Docket No"
                      value={invAutoCode}
                      disabled={isPOView ? true : false}
                      size="small"
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                      onChange={handleUniqueCodeChange}
                      inputProps={{ maxLength: 5 }} // Set max length to 5 characters
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <TextField
                      fullWidth
                      label="Date"
                      placeholder="Date"
                      variant="outlined"
                      required
                      type="date"
                      size="small"
                      disabled={isPOView ? true : false}
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                      // onChange={(e) => { setDate(e.target.value) }}
                      value={formatDate(selectedDate)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                    <TextField
                      fullWidth
                      label="Inv No"
                      placeholder="Inv No"
                      value={autoCode}
                      size="small"
                      disabled={isPOView ? true : false}
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={3.2} lg={3.2} xl={3.2} style={{ display: "flex", alignItems: "center" }}>
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
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                    />
                    <Tooltip title="Refresh DocNumber">
                      <span>
                        {" "}
                        {/* wrapper to avoid tooltip crash when button is disabled */}
                        <IconButton
                          disabled={isPOView || isEdit}
                          onClick={() => {
                            if (autoCode) {
                              GSTAutoGenPerf({ po: "Perform" }, handleGSTAutoGen, handleGSTAutoGenException);
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
                  {/* <Grid item xs={12} sm={2.5} md={2.5} lg={2.5} xl={2.5}>
                      {!isPOView && (
                        <Button
                          size="small"
                          variant="outlined"
                          style={{
                            marginTop: "8px",
                            background: "#002D68",
                            color: "white",
                          }}
                          onClick={() => setLoadPendingModalOpen(true)}
                        >
                          Load Pending SO
                        </Button>
                      )}
                    </Grid> */}
                  {/* <Grid item xs={12} sm={2.5} md={2.5} lg={2.5} xl={2.5}>
                      {!isPOView && (
                        <Button
                          size="small"
                          variant="outlined"
                          style={{
                            marginTop: "8px",
                            background: "#002D68",
                            color: "white",
                          }}
                          onClick={() => setLoadPendingDelNote(true)}
                        >
                          Load Pending Del Note
                        </Button>
                      )}
                    </Grid> */}
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
                      rows={6}
                      disabled={isPOView ? true : false}
                      value={billingAddress}
                      onChange={handleBillingTextFieldChange}
                      readOnly={true}
                      size="small"
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                      inputProps={{
                        style: { height: '65px', fontSize: '13px' }
                      }}
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
                            setChangeShippingAddressModalOpen(true);
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
                      rows={6}
                      disabled={isPOView ? true : false}
                      value={shippingAddress}
                      onChange={handleShippingTextFieldChange}
                      readOnly={true}
                      size="small"
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                      inputProps={{
                        style: { height: '65px', fontSize: '13px' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>

                    <TextField
                      fullWidth
                      id="outlined-multiline-static"
                      // label="Dispatch Address"
                      multiline
                      rows={3.5}
                      disabled={isPOView ? true : false}
                      value={dispatchFromadress}
                      readOnly={true}
                      size="small"
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    {/* <Grid
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
                    </Grid> */}

                    <TextField
                      fullWidth
                      id="outlined-multiline-static"
                      label="Remarks"
                      multiline
                      rows={3.5}
                      disabled={isPOView ? true : false}
                      value={invoiceRemarks}
                      onChange={(e) => setInvoiceRemarks(e.target.value)}
                      readOnly={true}
                      size="small"
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                    />
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
                            zoom: '70%',
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
                              Sub Total
                            </th>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                              }}
                            >
                              <TextField
                                fullWidth
                                variant="outlined"
                                required
                                type="text"
                                size="small"
                                disabled={isPOView ? true : false}
                                value={Number(subtotal).toFixed(2)}
                                onChange={(e) => {
                                  setSubtotal(e.target.value);
                                }}
                                InputProps={{
                                  sx: {
                                    height: "35px",
                                    "& .MuiInputBase-input": {
                                      padding: "0 8px",
                                      fontSize: "22px",
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
                              Fright Charges
                            </th>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                              }}
                            >
                              <TextField
                                fullWidth
                                // required
                                disabled={isPOView ? true : false}
                                value={frightCharges}
                                size="small"
                                onChange={(e) => {
                                  setFrightCharges(e.target.value);
                                }}
                                InputProps={{
                                  sx: {
                                    height: "35px",
                                    "& .MuiInputBase-input": {
                                      padding: "0 8px",
                                      fontSize: "22px",
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
                          {/* <tr style={{ borderBottom: "1px solid #ddd" }}>
                            <th
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                fontWeight: "bold",
                              }}
                            >
                              Remarks
                            </th>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                              }}
                            >
                              <TextField
                                fullWidth
                                required
                                disabled={isPOView ? true : false}
                                value={panNo}
                                size="small"
                                InputProps={{
                                  sx: {
                                    height: "35px",
                                    "& .MuiInputBase-input": {
                                      padding: "0 8px",
                                      fontSize: "22px",
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
                          </tr> */}
                          <tr style={{ borderBottom: "1px solid #ddd" }}>
                            <th
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                fontWeight: "bold",
                              }}
                            >
                              CGST %
                            </th>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: "8px",
                                }}
                              >
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={cgstper}
                                  disabled={isPOView ? true : false}
                                  onChange={(e) => setCgstper(e.target.value)}
                                  InputProps={{
                                    sx: {
                                      height: "35px",
                                      "& .MuiInputBase-input": {
                                        padding: "0 8px",
                                        fontSize: "22px",
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
                                <span
                                  style={{
                                    fontSize: "16px",
                                    marginBottom: "4px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  CGST
                                </span>
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={Number(cgstText).toFixed(2)}
                                  disabled={isPOView ? true : false}
                                  onChange={(e) => setCgstText(e.target.value)}
                                  InputProps={{
                                    sx: {
                                      height: "35px",
                                      "& .MuiInputBase-input": {
                                        padding: "0 8px",
                                        fontSize: "22px",
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
                              </div>
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
                              SGST %
                            </th>

                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: "8px",
                                }}
                              >
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={sgstper}
                                  disabled={isPOView ? true : false}
                                  onChange={(e) => setSgstper(e.target.value)}
                                  InputProps={{
                                    sx: {
                                      height: "35px",
                                      "& .MuiInputBase-input": {
                                        padding: "0 8px",
                                        fontSize: "22px",
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
                                <span
                                  style={{
                                    fontSize: "16px",
                                    marginBottom: "4px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  SGST
                                </span>
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={Number(sgstText).toFixed(2)}
                                  disabled={isPOView ? true : false}
                                  onChange={(e) => setSgstText(e.target.value)}
                                  InputProps={{
                                    sx: {
                                      height: "35px",
                                      "& .MuiInputBase-input": {
                                        padding: "0 8px",
                                        fontSize: "22px",
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
                              </div>
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
                              IGST %
                            </th>
                            <td
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  gap: "8px",
                                }}
                              >
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={igstper}
                                  disabled={isPOView ? true : false}
                                  onChange={(e) => setIGstper(e.target.value)}
                                  InputProps={{
                                    sx: {
                                      height: "35px",
                                      "& .MuiInputBase-input": {
                                        padding: "0 8px",
                                        fontSize: "22px",
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
                                <span
                                  style={{
                                    fontSize: "16px",
                                    marginBottom: "4px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  IGST
                                </span>
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={Number(igstText).toFixed(2)}
                                  disabled={isPOView ? true : false}
                                  onChange={(e) => setIGstText(e.target.value)}
                                  InputProps={{
                                    sx: {
                                      height: "35px",
                                      "& .MuiInputBase-input": {
                                        padding: "0 8px",
                                        fontSize: "22px",
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
                              </div>
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
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                              }}
                            >
                              <TextField
                                fullWidth
                                size="small"
                                value={totalValue}
                                disabled={isPOView ? true : false}
                                onChange={(e) => setTotalValue(e.target.value)}
                                InputProps={{
                                  sx: {
                                    height: "35px",
                                    "& .MuiInputBase-input": {
                                      padding: "0 8px",
                                      fontSize: "22px",
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
                              {/* <Button
                                  variant="contained"
                                  size="small"
                                  onClick={handleViewMore}
                                  style={{
                                    marginLeft: "8px",
                                    height: "30px",
                                    backgroundColor: "#002d68",
                                  }}
                                >
                                  View More
                                </Button> */}
                            </td>
                          </tr>
                        </table>
                        <Dialog
                          maxWidth="xl"
                          fullWidth
                          open={isModalOpen}
                          onClose={handleCloseModal}
                        >
                          <DialogContent>
                            <Grid container spacing={2} padding={1}>
                              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Card
                                  style={{
                                    boxShadow:
                                      "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                                    marginTop: "0px",
                                    width: "100%",
                                    overflow: "auto",
                                  }}
                                >
                                  <CardContent>
                                    <Grid container spacing={1.8}>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                      >
                                        <Typography variant="h6" gutterBottom>
                                          Transport Details
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
                                      >
                                        <FormControl fullWidth>
                                          <InputLabel id="demo-simple-select-label">
                                            Dispatch From [Mst]
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={dispatchFrom}
                                            size="small"
                                            label="Dispatch From [Mst]"
                                            placeholder="Dispatch From [Mst]"
                                            disabled={isPOView ? true : false}
                                            onChange={(e) =>
                                              onDispatchFromChange(e)
                                            }
                                          >
                                            {dispatchList?.map(
                                              (data, index) => {
                                                return (
                                                  <MenuItem
                                                    value={data.id}
                                                    key={index}
                                                  >
                                                    {data.name}
                                                  </MenuItem>
                                                );
                                              }
                                            )}
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
                                      >
                                        <FormControl fullWidth>
                                          <InputLabel id="demo-simple-select-label">
                                            Mode of Dispatch
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={modeOfDispach}
                                            size="small"
                                            label="Mode of Dispatch"
                                            placeholder="Mode of Dispatch"
                                            disabled={isPOView ? true : false}
                                            onChange={(e) =>
                                              onModeDispatchChange(e)
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
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
                                      >
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Vechicle No"
                                          placeholder="Vechicle No"
                                          value={vechicleNo}
                                          disabled={isPOView ? true : false}
                                          onChange={(e) =>
                                            setVechicleNo(e.target.value)
                                          }
                                        />
                                      </Grid>

                                      <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
                                      >
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Transaction Type"
                                          placeholder="Transaction Type"
                                          onFocus={() =>
                                            setFocusedField("transactionType")
                                          }
                                          onBlur={() => setFocusedField(null)}
                                          value={transactionType}
                                          disabled={isPOView ? true : false}
                                          onChange={(e) =>
                                            setTransactionType(e.target.value)
                                          }
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
                                      >
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Mode Of Type"
                                          placeholder="Mode Of Type"
                                          onFocus={() =>
                                            setFocusedField("modeOfType")
                                          }
                                          onBlur={() => setFocusedField(null)}
                                          value={modeOfType}
                                          disabled={isPOView ? true : false}
                                          onChange={(e) =>
                                            setModeOfType(e.target.value)
                                          }
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
                                      >
                                        <TextField
                                          fullWidth
                                          variant="outlined"
                                          required
                                          type="date"
                                          label="Transporter Date"
                                          placeholder="Transporter Date"
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
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
                                      >
                                        <FormControl fullWidth>
                                          <InputLabel id="demo-simple-select-label">
                                            Transporter[Mst]
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            size="small"
                                            label="Transporter[Mst]"
                                            placeholder="Transporter[Mst]"
                                            value={transporterMst}
                                            disabled={isPOView ? true : false}
                                            onChange={(e) => {
                                              onTransporterMstChange(e);
                                              transporterList.map((item) => {
                                                if (
                                                  item.id === e.target.value
                                                ) {
                                                  setTransporterGSTIN(
                                                    item.gstin
                                                  );
                                                }
                                              });
                                            }}
                                          >
                                            {transporterList?.map(
                                              (data, index) => {
                                                return (
                                                  <MenuItem
                                                    value={data.id}
                                                    key={index}
                                                  >
                                                    {data.transportName}
                                                  </MenuItem>
                                                );
                                              }
                                            )}
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
                                      >
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Transporter GSTIN"
                                          placeholder="Transporter GSTIN"
                                          disabled={isPOView ? true : false}
                                          value={transporterGSTIN}
                                        // onChange={(e) =>
                                        //   setTransporterGSTIN(e.target.value)
                                        // }
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
                                      >
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Distance KMS"
                                          placeholder="Distance KMS"
                                          value={distanceKMS}
                                          disabled={isPOView ? true : false}
                                          onChange={(e) =>
                                            setDistanceKMS(e.target.value)
                                          }
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
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
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
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
                                        sm={4}
                                        md={4}
                                        lg={4}
                                        xl={4}
                                      >
                                        <FormControl fullWidth>
                                          <InputLabel id="demo-simple-select-label">
                                            Goords Or Service
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            size="small"
                                            label="Goords Or Service"
                                            placeholder="Goords Or Service"
                                            value={goodsOrService}
                                            disabled={isPOView ? true : false}
                                            onChange={(e) =>
                                              onGoordsOrServiceChange(e)
                                            }
                                          >
                                            <MenuItem value={"G"}>G</MenuItem>
                                            <MenuItem value={"S"}>S</MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                    <Grid
                                      container
                                      spacing={1.5}
                                      padding={1}
                                      style={{ marginBottom: "5px" }}
                                    >
                                      <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                      >
                                        <Typography variant="h6" gutterBottom>
                                          Labour Details
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
                                            Labour Charge
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={labourCharge}
                                            size="small"
                                            label="Labour Charge"
                                            placeholder="Labour Charge"
                                            disabled={isPOView ? true : false}
                                            onChange={(e) => onLabourChange(e)}
                                          >
                                            <MenuItem value={"N"}>N</MenuItem>
                                            <MenuItem value={"Y"}>Y</MenuItem>
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
                                        <FormControl fullWidth>
                                          <InputLabel id="demo-simple-select-label">
                                            Labour Charges Heading Required
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={labourHeadingRequired}
                                            size="small"
                                            label="Labour Charges Heading Required"
                                            placeholder="Labour Charges Heading Required"
                                            disabled={isPOView ? true : false}
                                            onChange={(e) =>
                                              onLabourHeadingChange(e)
                                            }
                                          >
                                            <MenuItem value={"N"}>N</MenuItem>
                                            <MenuItem value={"Y"}>Y</MenuItem>
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
                                        <FormControl fullWidth>
                                          <InputLabel id="demo-simple-select-label">
                                            Reverse Charge
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={reverseCharge}
                                            size="small"
                                            label="Reverse Charge"
                                            placeholder="Reverse Charge"
                                            disabled={isPOView ? true : false}
                                            onChange={(e) =>
                                              onReverseChargeChange(e)
                                            }
                                          >
                                            <MenuItem value={"N"}>N</MenuItem>
                                            <MenuItem value={"Y"}>Y</MenuItem>
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
                                        <FormControl fullWidth>
                                          <InputLabel id="demo-simple-select-label">
                                            Supply Type Code
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={supplyTypeCode}
                                            size="small"
                                            label="Reverse Charge"
                                            placeholder="Reverse Charge"
                                            disabled={isPOView ? true : false}
                                            onChange={(e) =>
                                              onSupplyTypeChange(e)
                                            }
                                          >
                                            <MenuItem value={"B2B"}>
                                              B2B
                                            </MenuItem>
                                            <MenuItem value={"B2C"}>
                                              B2C
                                            </MenuItem>
                                            <MenuItem value={"SEZWP"}>
                                              SEZWP
                                            </MenuItem>
                                            <MenuItem value={"SEZWCP"}>
                                              SEZWCP
                                            </MenuItem>
                                            <MenuItem value={"EXPWP"}>
                                              EXPWP
                                            </MenuItem>
                                            <MenuItem value={"EXPECP"}>
                                              EXPECP
                                            </MenuItem>
                                            <MenuItem value={"DEXP"}>
                                              DEXP
                                            </MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                    <Grid
                                      container
                                      spacing={1.5}
                                      padding={1}
                                      style={{ marginBottom: "5px" }}
                                    >
                                      <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                      >
                                        <Typography variant="h6" gutterBottom>
                                          DC Details
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
                                        <TextField
                                          fullWidth
                                          required
                                          label="DC No"
                                          placeholder="DC No"
                                          disabled={isPOView ? true : false}
                                          value={dcNo}
                                          onChange={(e) =>
                                            setDcNo(e.target.value)
                                          }
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
                                          variant="outlined"
                                          label="DC Date"
                                          placeholder="DC Date"
                                          required
                                          type="date"
                                          size="small"
                                          disabled={isPOView ? true : false}
                                          onChange={(e) => {
                                            setDcDate(e.target.value);
                                          }}
                                          value={formatDate(dcDate)}
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
                                          label="Dc Details"
                                          placeholder="Dc Details"
                                          multiline
                                          disabled={isPOView ? true : false}
                                          value={dcDetails}
                                          onChange={(e) =>
                                            setDcDetails(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={3}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          size="small"
                                          label="Cust PO No & DT"
                                          placeholder="Cust PO No & DT"
                                          value={custPoNo}
                                          disabled={isPOView ? true : false}
                                          onChange={(e) =>
                                            setCustPoNo(e.target.value)
                                          }
                                        />
                                      </Grid>
                                    </Grid>
                                  </CardContent>
                                </Card>
                              </Grid>

                              <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                <Card
                                  style={{
                                    boxShadow:
                                      "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                                    marginTop: "0px",
                                    width: "100%",
                                    overflow: "auto",
                                  }}
                                >
                                  {/* <CardContent>
                                      
                                      <Grid container spacing={1.5}>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={12}
                                          md={12}
                                          lg={12}
                                          xl={12}
                                        >
                                          <Typography variant="h6" gutterBottom>
                                            DC Details
                                          </Typography>
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={3}
                                          md={3}
                                          lg={3}
                                          xl={3}
                                        >
                                          <TextField
                                            fullWidth
                                            required
                                            label="DC No"
                                            placeholder="DC No"
                                            disabled={isPOView ? true : false}
                                            value={dcNo}
                                            onChange={(e) =>
                                              setDcNo(e.target.value)
                                            }
                                            size="small"
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={3}
                                          md={3}
                                          lg={3}
                                          xl={3}
                                        >
                                          <TextField
                                            fullWidth
                                            variant="outlined"
                                            label="DC Date"
                                            placeholder="DC Date"
                                            required
                                            type="date"
                                            size="small"
                                            disabled={isPOView ? true : false}
                                            onChange={(e) => {
                                              setDcDate(e.target.value);
                                            }}
                                            value={formatDate(dcDate)}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          sm={3}
                                          md={3}
                                          lg={3}
                                          xl={3}
                                        >
                                          <TextField
                                            fullWidth
                                            required
                                            label="Dc Details"
                                            placeholder="Dc Details"
                                            multiline
                                            disabled={isPOView ? true : false}
                                            value={dcDetails}
                                            onChange={(e) =>
                                              setDcDetails(e.target.value)
                                            }
                                            size="small"
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={3}
                                          sm={3}
                                          md={3}
                                          lg={3}
                                          xl={3}
                                        >
                                          <TextField
                                            fullWidth
                                            size="small"
                                            label="Cust PO No & DT"
                                            placeholder="Cust PO No & DT"
                                            value={custPoNo}
                                            disabled={isPOView ? true : false}
                                            onChange={(e) =>
                                              setCustPoNo(e.target.value)
                                            }
                                          />
                                        </Grid>
                                      </Grid>
                                    </CardContent> */}

                                  <CardContent>
                                    <Grid container spacing={1.5}>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                      >
                                        <Typography variant="h6" gutterBottom>
                                          Amount Details
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Total Qty"
                                          placeholder="Total Qty"
                                          disabled={isPOView ? true : false}
                                          value={totQty}
                                          onChange={(e) =>
                                            setTotQty(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Taxable Value for GST Payable"
                                          placeholder="Taxable Value for GST Payable"
                                          disabled={isPOView ? true : false}
                                          value={taxGSTPayable}
                                          onChange={(e) =>
                                            setTaxGsTPayable(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          // required
                                          label="Less Disc"
                                          placeholder="Less Disc"
                                          disabled={isPOView ? true : false}
                                          value={lessDisc}
                                          onChange={(e) =>
                                            setLessDisc(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Less Other"
                                          placeholder="Less Other"
                                          disabled={isPOView ? true : false}
                                          value={lessOther}
                                          onChange={(e) =>
                                            setLessOther(e.target.value)
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
                                          label="Sub Total After Disc"
                                          placeholder="Sub Total After Disc"
                                          disabled={isPOView ? true : false}
                                          value={subTotal}
                                          onChange={(e) =>
                                            setSubTotal(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Packing & Forwarding"
                                          placeholder="Packing & Forwarding"
                                          disabled={isPOView ? true : false}
                                          value={packFrwrd}
                                          onChange={(e) =>
                                            setPackFrwrd(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Transport Charges"
                                          placeholder="Transport Charges"
                                          disabled={isPOView ? true : false}
                                          value={trnsprtcharges}
                                          onChange={(e) =>
                                            setTrnsprtCharges(e.target.value)
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
                                          label="Sub Total"
                                          placeholder="Sub Total"
                                          disabled={isPOView ? true : false}
                                          value={subTotl}
                                          onChange={(e) =>
                                            setSubTotl(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Insurance"
                                          placeholder="Insurance"
                                          disabled={isPOView ? true : false}
                                          value={insurance}
                                          onChange={(e) =>
                                            setInsurane(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Customer Material Value"
                                          placeholder="Customer Material Value"
                                          disabled={isPOView ? true : false}
                                          value={custmrMeterlValue}
                                          onChange={(e) =>
                                            setCustmrMeterlValue(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Ammortisation Cost"
                                          placeholder="Ammortisation Cost"
                                          disabled={isPOView ? true : false}
                                          value={ammortisanCost}
                                          onChange={(e) =>
                                            setAmmortisanCost(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Amount for GST Payable"
                                          placeholder="Amount for GST Payable"
                                          disabled={isPOView ? true : false}
                                          value={amtGSTPayble}
                                          onChange={(e) =>
                                            setAmtGSTPayble(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      {state.toUpperCase() === "KARNATAKA" ? (
                                        <>
                                          <Grid
                                            item
                                            xs={6}
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
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            xs={6}
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
                                              onChange={(e) =>
                                                setCGST(e.target.value)
                                              }
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            xs={6}
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
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            xs={6}
                                            sm={6}
                                            md={6}
                                            lg={6}
                                            xl={6}
                                          >
                                            <TextField
                                              fullWidth
                                              label="SGST"
                                              placeholder="SGST"
                                              size="small"
                                              value={sgst}
                                              onChange={(e) =>
                                                setSGST(e.target.value)
                                              }
                                            />
                                          </Grid>
                                        </>
                                      ) : null}
                                      {state.toUpperCase() !== "KARNATAKA" ? (
                                        <>
                                          <Grid
                                            item
                                            xs={6}
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
                                              disabled={isPOView ? true : false}
                                              onChange={(e) =>
                                                setIgstPercent(e.target.value)
                                              }
                                              style={{ marginRight: "5px" }}
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            xs={6}
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
                                              disabled={isPOView ? true : false}
                                              value={igst}
                                              onChange={(e) =>
                                                setIGST(e.target.value)
                                              }
                                            />
                                          </Grid>
                                        </>
                                      ) : null}
                                      {country.toUpperCase() !== "INDIA" ? (
                                        <>
                                          <Grid
                                            item
                                            xs={6}
                                            sm={6}
                                            md={6}
                                            lg={6}
                                            xl={6}
                                          >
                                            <TextField
                                              fullWidth
                                              size="small"
                                              value={utgstPercent}
                                              disabled={isPOView ? true : false}
                                              placeholder="%"
                                              onChange={(e) =>
                                                setUtgstPercent(e.target.value)
                                              }
                                              style={{ marginRight: "5px" }}
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            xs={6}
                                            sm={6}
                                            md={6}
                                            lg={6}
                                            xl={6}
                                          >
                                            <TextField
                                              fullWidth
                                              size="small"
                                              label="UTGST"
                                              disabled={isPOView ? true : false}
                                              placeholder="UTGST"
                                              value={utgst}
                                              onChange={(e) =>
                                                setUTGST(e.target.value)
                                              }
                                            />
                                          </Grid>
                                        </>
                                      ) : null}
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
                                          label="Total GST"
                                          placeholder="Total GST"
                                          disabled={isPOView ? true : false}
                                          value={totlGST}
                                          onChange={(e) =>
                                            setTotlGST(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      {/* <Grid
                                          item
                                          xs={6}
                                          sm={6}
                                          md={6}
                                          lg={6}
                                          xl={6}
                                        >
                                          <TextField
                                            fullWidth
                                            required
                                            label="Tcs"
                                            placeholder="Tcs"
                                            disabled={isPOView ? true : false}
                                            value={tcs}
                                            onChange={(e) =>
                                              setTCS(e.target.value)
                                            }
                                            size="small"
  
                                          />
                                        </Grid> */}
                                      <>
                                        <Grid
                                          item
                                          xs={6}
                                          sm={6}
                                          md={6}
                                          lg={6}
                                          xl={6}
                                        >
                                          <TextField
                                            fullWidth
                                            size="small"
                                            value={tcsPercentage}
                                            disabled={isPOView ? true : false}
                                            placeholder="%"
                                            onChange={(e) =>
                                              setTcsPercentage(e.target.value)
                                            }
                                            style={{ marginRight: "5px" }}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={6}
                                          sm={6}
                                          md={6}
                                          lg={6}
                                          xl={6}
                                        >
                                          <TextField
                                            fullWidth
                                            size="small"
                                            label="TCS"
                                            placeholder="TCS"
                                            disabled={isPOView ? true : false}
                                            value={tcsAmount}
                                            onChange={(e) =>
                                              setTcsAmount(e.target.value)
                                            }
                                          />
                                        </Grid>
                                      </>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Surcharges on TCS"
                                          placeholder="Surcharges on TCS"
                                          disabled={isPOView ? true : false}
                                          value={surChrgesTCS}
                                          onChange={(e) =>
                                            setSurChrgesTCS(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Cess on TCS"
                                          placeholder="Cess on TCS"
                                          disabled={isPOView ? true : false}
                                          value={cessOnTcs}
                                          onChange={(e) =>
                                            setCessOnTcs(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Total Value"
                                          placeholder="Total Value"
                                          disabled={isPOView ? true : false}
                                          value={totlValues}
                                          onChange={(e) =>
                                            setTotlValues(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Round Off"
                                          placeholder="Round Off"
                                          disabled={isPOView ? true : false}
                                          value={roundOff}
                                          onChange={(e) =>
                                            setRoundOff(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Inv Value"
                                          placeholder="Inv Value"
                                          value={invValue}
                                          disabled={isPOView ? true : false}
                                          onChange={(e) =>
                                            setInvValue(e.target.value)
                                          }
                                          size="small"
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                      >
                                        <TextField
                                          fullWidth
                                          required
                                          label="Total in words"
                                          placeholder="Total in words"
                                          disabled={isPOView ? true : false}
                                          value={numberToWords(
                                            Number(invValue)
                                          )}
                                          // onChange={(e) =>
                                          //   setTotalInWords(e.target.value)
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
                              <Typography>
                                1-Road, 2-Rail, 3-Air, 4-Ship
                              </Typography>
                            )}
                            <Button onClick={handleModelReason} color="primary">
                              Reason
                            </Button>
                            <Dialog
                              open={open}
                              onClose={handleClose}
                              aria-labelledby="alert-dialog-title"
                              aria-describedby="alert-dialog-description"
                            >
                              <DialogContent>
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
                                      Reasons
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
                                    <TextField
                                      fullWidth
                                      required
                                      multiline
                                      label="Reason For No Tax"
                                      placeholder="Reason For No Tax"
                                      disabled={isPOView ? true : false}
                                      value={resNoTax}
                                      onChange={(e) =>
                                        setResNoTax(e.target.value)
                                      }
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
                                      multiline
                                      label="Reason For No Duty"
                                      placeholder="Reason For No Duty"
                                      disabled={isPOView ? true : false}
                                      value={resNoDuty}
                                      onChange={(e) =>
                                        setResNoDuty(e.target.value)
                                      }
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
                                      label="Remarks"
                                      placeholder="Remarks"
                                      multiline
                                      disabled={isPOView ? true : false}
                                      value={remarks1}
                                      onChange={(e) =>
                                        setRemarks1(e.target.value)
                                      }
                                      size="small"
                                    />
                                  </Grid>
                                </Grid>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={handleCloseReason}
                                  color="primary"
                                >
                                  Close
                                </Button>
                              </DialogActions>
                            </Dialog>
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
                          style={{ ...getHighlightColor("New", true), width: "100%", height: "35px" }}
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
                          style={{ ...getHighlightColor("Edit", true), width: "100%", height: "35px" }}
                          onClick={() => {
                            setActiveButton("Edit");
                            setIsPoView(false);
                            setIsEdit(true);
                          }}
                          disabled={isModuleLocked}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          style={{ ...getHighlightColor("Delete", true), width: "100%", height: "35px" }}
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
                          style={{ ...getHighlightColor("Clear", true), width: "100%", height: "35px" }}
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
                          style={{ ...getHighlightColor("Download", true), width: "100%", height: "35px" }}
                          onClick={() => {
                            setActiveButton("Download");
                            ExportPerformInvoice(
                              { id: mainId },
                              ExportGstInvoiceSuccess,
                              ExportGstInvoiceException
                            );
                          }}
                          disabled={!(isPOView || isEdit)}
                        >
                          <FileDownloadIcon />
                        </Button>
                        <Button
                          variant="contained"
                          style={{ ...getHighlightColor("Print", true), width: "100%", height: "35px" }}
                          onClick={() => {
                            setActiveButton("Print");
                            setPdfModalOpen(true);
                          }}
                          disabled={isModuleLocked}
                        >
                          {labourCharge === "Y" ? (
                            <LabourChargeInvoice rowData={mainId} />
                          ) : (
                            <GstTaxInvoice rowData={mainId} />
                          )}
                        </Button>


                        <Button
                          variant="contained"
                          style={{
                            ...getHighlightColor("First", false),
                            width: "100%", height: "35px"
                          }}
                          onClick={() => {
                            setActiveButton("First");
                            handleForwardReverse("first", "");
                          }}
                        >
                          <FastRewindIcon />
                        </Button>
                        <Button
                          variant="contained"
                          style={{ ...getHighlightColor("Previous", false), width: "100%", height: "35px" }}
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
                          style={{ ...getHighlightColor("Next", false), width: "100%", height: "35px" }}
                          onClick={() => {
                            setActiveButton("Next");
                            handleForwardReverse("forward", mainId);
                          }}
                        >
                          <SkipNextIcon />
                        </Button>
                        <Button
                          variant="contained"
                          style={{ ...getHighlightColor("Last", false), width: "100%", height: "35px" }}
                          onClick={() => {
                            setActiveButton("Last");
                            handleForwardReverse("last", "");
                          }}
                        >
                          <FastForwardIcon />
                        </Button>
                      </div>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <Button
                          variant="contained"
                          style={{ ...getHighlightColor("Template", true), height: "35px" }}
                          onClick={() => {
                            setActiveButton("Template");
                            DownloadPerformInvoiceTemplate(
                              handleDownloadSuccess,
                              handleDownloadException
                            );
                          }}
                          disabled={isModuleLocked}
                        >
                          Template
                        </Button>
                        <Button
                          variant="contained"
                          component="label"
                          htmlFor="upload-photo"
                          sx={{
                            backgroundColor: "#002D68",
                            height: "35px",
                            marginLeft: "px",
                          }}
                          disabled={uploadLoader === true || isModuleLocked}
                        >
                          {/* Upload File */}
                          {uploadLoader ? (
                            <CircularProgress size={24} style={{ color: 'white' }} />
                          ) : "Upload File"}
                        </Button>
                        <input
                          id="upload-photo"
                          type="file"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (reader.readyState === 2) {
                                  // setUploadLoader(true)
                                  // setSelectedItems([]);
                                  setUploadLoader(true);
                                  PerformInvoiceXlUpload(
                                    {
                                      file: reader.result,
                                      customerId: cId,
                                    },
                                    handleItemImportSucess,
                                    handleItemImportException
                                  );
                                }
                              };
                              reader.readAsDataURL(e.target.files[0]);
                              // Reset the input value to allow re-uploading the same file
                              e.target.value = "";
                            }
                          }}
                        />
                        {/* <Button
                          variant="contained"
                          style={{ ...getHighlightColor("View"), height: "35px" }}
                          onClick={() => {
                            setActiveButton("View");
                            handleViewClick();
                          }}
                        >
                          VIEW
                        </Button> */}
                        <Button
                          variant="contained"
                          type="submit"
                          style={{ ...getHighlightColor("Save", true), height: "35px" }}
                          disabled={loading || isModuleLocked}
                          onClick={() => setActiveButton("Save")}
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
                    <div style={{ maxHeight: "450px", overflowY: "auto" }}>
                      <table id="customers">
                        <thead>
                          <tr>
                            <th>Part No</th>
                            <th>Part Name</th>
                            <th>UOM</th>
                            <th>Qty</th>
                            {/* <th>Sch Date</th> */}
                            <th>HSN Code</th>
                            <th>INV Rate</th>
                            <th>INV Amt</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedItems.map((item, index) => (
                            <tr key={index}>
                              <td contentEditable={false} onBlur={handleEdit}>
                                {item.itemCode ? (
                                  <span>{item.itemCode}</span>
                                ) : (
                                  <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id={`combo-box-${index}`}
                                    size="small"
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
                              <td contentEditable={true}>
                                <input
                                  type="number"
                                  value={item.qty}
                                  onChange={(e) => handleQtyChange(index, parseFloat(e.target.value) || "")}
                                />
                              </td>
                              {/* <td contentEditable={true}>{item.schDate}</td> */}
                              <td contentEditable={false}>{item.hsnCode}</td>
                              <td contentEditable={false}>{item.rate}</td>
                              <td>{Number(item.amt || "").toFixed(2)}</td>


                              {/* <td
                                  contentEditable={!isPOView ? true : false}
                                  onBlur={(e) =>
                                    handleEdit(
                                      "invQty",
                                      e.target.textContent,
                                      item.id,
                                      item
                                    )
                                  }
                                >
                                  {item.invQty}
                                </td> */}
                              {/* <td contentEditable={false}>{item.stdRate}</td>
                                <td contentEditable={false}>{item.amt}</td>
                                <td contentEditable={false}>
                                  {item.itemLedger}
                                </td>
                                <td contentEditable={false}>
                                  {item.descOfPackage}
                                </td> */}
                              <td
                                contentEditable={false}
                                style={{ textAlign: "center" }}
                              >
                                {item.id === "RDL1" ? null : (
                                  <DeleteIcon
                                    onClick={() => {
                                      handleSelectedItemsDeleteRow(item.id);
                                    }}
                                    style={{
                                      color: "black",
                                      cursor: "pointer",
                                    }}
                                  />
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
              <Grid
                item
                xs={12}
                style={{ textAlign: "center", marginTop: "10px" }}
              >
                {/* Buttons go here */}
                {/* <Button
                variant="contained"
                style={{
                  width: "150px",
                  background: "#002D68",
                  color: "white",
                  marginRight: "10px",
                }}
                onClick={handlePrint}
              >
                Print
              </Button> */}
                {/* <Button
                    variant="contained"
                    style={{
                      width: "150px",
                      background: "#002D68",
                      color: "white",
                      marginRight: "10px",
                    }}
                    // onClick={() => setDcSelectionModalOpen(true)}
                    onClick={handleDcSelectionClick}
                  >
                    DC Selection
                  </Button> */}
                <>
                  {/* <Button
                      id="demo-customized-button"
                      aria-controls={
                        anchorEl ? "demo-customized-menu" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={anchorEl ? "true" : undefined}
                      variant="contained"
                      value={option}
                      disableElevation
                      style={{
                        background: "#002D68",
                        color: "white",
                        marginRight: "10px",
                      }}
                      onClick={handleClick}
                      endIcon={<KeyboardArrowDownIcon />}
                    >
                      Options
                    </Button> */}
                  <Menu
                    id="demo-customized-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem value={10}>DC Print</MenuItem>
                    <MenuItem value={20}>E-Inv</MenuItem>
                    <MenuItem value={30}>E-Inv ANX</MenuItem>
                    <MenuItem value={40} onClick={handleMenuItemClick}>
                      Inv
                    </MenuItem>
                    <MenuItem value={50}>Inv Multi Print</MenuItem>
                    <MenuItem value={60}>Inv Multi Delete</MenuItem>
                    <MenuItem value={70}>Inv DC Selection</MenuItem>
                  </Menu>
                </>
              </Grid>
            </Grid>
          </form>

          <DCGstSelectionModel
            dcSelectionModalOpen={dcSelectionModalOpen}
            setDcSelectionModalOpen={setDcSelectionModalOpen}
            setPendingPOList={setPendingPOList}
            setCustAddress={setCustAddress}
            customerSid={customerSid}
            partNo={partNo}
            selectedItems={selectedItems}
          />
          <ChangeAddress
            changeAddressModalOpen={changeAddressModalOpen}
            setChangeAddressModalOpen={setChangeAddressModalOpen}
            setCustAddress={setCustAddress}
            customerSid={customerSid}
            setAdd1={setAdd1}
            setBillingAddress={setBillingAddress}
          />

          <ChangeShippingAddress
            changeAddressModalOpen={changeShippingAddressModalOpen}
            setChangeAddressModalOpen={setChangeShippingAddressModalOpen}
            setCustAddress={setCustAddress}
            customerSid={customerSid}
            setAdd1={setAdd1}
            setBillingAddress={setShippingAddress}
          />

          <LoadPendingPO
            loadPendingModalOpen={loadPendingModalOpen}
            setLoadPendingModalOpen={setLoadPendingModalOpen}
            // setPendingPOList={setPendingPOList}
            // pendingPOList={pendingPOList}
            setPendingPOList={setSelectedItems}
            pendingPOList={selectedItems}
            setCustAddress={setCustAddress}
            customerId={cId}
          />

          <LoadPendingDelNote
            loadPendingModalOpen={loadPendingDelNote}
            setLoadPendingModalOpen={setLoadPendingDelNote}
            // setPendingPOList={setPendingPOList}
            // pendingPOList={pendingPOList}
            setPendingPOList={setSelectedItems}
            pendingPOList={selectedItems}
            setCustAddress={setCustAddress}
            customerId={cId}
          />

          <DeleteConfirmationDailog
            open={deleteDailogOpen}
            setOpen={setDeleteDailogOpen}
            deleteId={mainId}
            deleteService={PerformInvoiceDelete}
            handleSuccess={deletehandleSuccess}
            handleException={deletehandleException}
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

          <NotificationBar
            handleClose={handleClose}
            notificationContent={openNotification.message}
            openNotification={openNotification.status}
            type={openNotification.type}
          />
        </div>
      ) : (
        <DcSelection
          setDcSelectionFlag={setDcSelectionFlag}
          cId={cId}
          PreviousSetSelectedItems={setSelectedItems}
          PreviousSelectedItems={selectedItems}
          selectedPoItemIds={selectedPoItemIds}
          setDcSelectionData={setDcSelectionData}
        />
      )}
    </>
  );
};

export default NewPerformInvoice;