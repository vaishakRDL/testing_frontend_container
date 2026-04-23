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
import React, { useRef } from "react";
import {
  CustomerDropShowInvoice,
  FetchCustomerAddress,
  FetchGSTCustomerAddress,
  GSTAutoGen,
  GSTInvAdd,
  GSTInvDelete,
  GSTInvUpdate,
  GSTLoadPendingPO,
  GSTshowconsignee,
  GetGeneratePoSaleOrderEntry,
  GstInvoicePreview,
  GstPartNoSelect,
  GstViewing,
  MstDispatchShowData,
  MstTransporterShowData,
  PartNoSelectGST,
  gstSaleInvoiceXlUpload,
} from "../../../ApiService/LoginPageService";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { useEffect } from "react";
import ChangeAddress from "./ChangeAddress";
import DCGstSelectionModel from "./DCGstSelectionModel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useLocation, useNavigate } from "react-router-dom";
import LoadPendingPO from "./LoadPendingPO";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";
import "../../PurchaseOrderGeneration/PurchaseOrder.css";
import DcSelection from "./DcSelection";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { DownloadGstSaleInvoiceTemplate, ExportGstInvoice } from "../../../ApiService/DownloadCsvReportsService";
import LabourChargeInvoice from "./LabourChargeInvoice";
import GstTaxInvoice from "./GstTaxInvoice";
import LoadPendingDelNote from "./LoadPendingDelNote";
import EInvoicePdf from "./EInvoicePdf";
import DeleteConfirmationDailog from "../../../Utility/confirmDeletion";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useModuleLocks } from "../../context/ModuleLockContext";


const NewGstInvoice = () => {
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState("");

  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "GST Sales Invoice")?.lockStatus === "locked";

  const getHighlightStyle = (name, baseStyle = {}) => ({
    ...baseStyle,
    backgroundColor: isModuleLocked
      ? "gray"
      : activeButton === name ? "#0d6efd" : baseStyle.background,
    transition: "0.3s",
    color: "white"
  });

  const [custAllAddressList, setCustAllAddressList] = useState([]);
  const shipToTextFieldRef = useRef(null);
  const dispatchFromTextFieldRef = useRef(null);
  const [invCode, setInvCode] = useState("ME");
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
  const [dcSelectionRequired, setDcSelectionRequired] = useState("N");
  const [dispatchFrom, setDispatchFrom] = useState("");
  const [dispatchFromCopy, setDispatchFromCopy] = useState("");
  const [dispatchFromId, setDispatchFromId] = useState("");
  const [dispatchAddress, setDispatchAddress] = useState('');
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
  const [subTotal, setSubTotal] = useState(0);
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
  // const [tcsAmount, setTcsAmount] = useState(0);
  const [surChrgesTCSPercentage, setSurChrgesTCSPercentage] = useState(0);
  const [surChrgesTCS, setSurChrgesTCS] = useState(0);
  const [cessOnTcsPercentage, setCessOnTcsPercentage] = useState(0);
  const [cessOnTcs, setCessOnTcs] = useState(0);
  const [totlValues, setTotlValues] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [customerSid, setCustomerSid] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [selectedChangeAddress, setSelectedChangeAddress] = useState();
  const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
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
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [selectedPoItemIds, setSelectedPoItemIds] = useState([]);
  const [dcSelectionData, setDcSelectionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoader, setUploadLoader] = useState(false);
  ////////////////////////////////////////////////////////////////////////FORWARD REVERSE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  const [isPOView, setIsPoView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [mainId, setMainId] = useState('');
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
  const [generatedGstLists, setGeneratedGstLists] = useState([])
  const [displayAllGstTotal, setDisplayAllGstTotal] = useState(0);
  const [displayAllTcsTotal, setDisplayAllTcsTotal] = useState(0);
  const [isEinvoiceGen, setEinvoiceGen] = useState(0)
  const [maxItems, setMaxItems] = useState('0')

  // ⭐ Temp Storage States for Invoice Items
  const [openTempManager, setOpenTempManager] = useState(false);
  const [tempList, setTempList] = useState([]);
  const [searchTemp, setSearchTemp] = useState([]);
  const [isLoadingTemp, setIsLoadingTemp] = useState(false);

  // ERROR VALIDATION
  const [vehicleNoError, setVehicleNoError] = useState(false);
  const [transactionTypeError, setTransactionTypeError] = useState(false);
  const [modeOfTypeError, setModeOfTypeError] = useState(false);
  const [distanceKMSError, setDistanceKMSError] = useState(false);
  const [shippingPincodeError, setShippingPincodeError] = useState(false);
  const [toStatecodeError, setToStatecodeError] = useState(false);
  const [goodsOrServiceError, setGoodsOrServiceError] = useState(false);
  const [labourHeadingRequiredError, setLabourHeadingRequiredError] = useState(false);
  const [supplyTypeCodeError, setSupplyTypeCodeError] = useState(false);

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

  useEffect(() => {
    // if (isPOView || isEdit) {
    //   GstViewing({ id: poRowId }, handleGstViewing, handleGstViewingException);
    // }
    // GSTAutoGen({ po: invCode }, handleGSTAutoGen, handleGSTAutoGenException);
    handleForwardReverse('last', '')
  }, [/*isPOView, isEdit, poRowId, invCode*/]);

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
    setDispatchFromId(data?.dispatchFrom || "");
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
    GSTAutoGen({ po: e.target.value }, handleGSTAutoGen, handleGSTAutoGenException);
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
      maxLineItem: item?.maxLineItem,
    }))
    : [];

  function onCustomerSelectChange(selectedValue) {
    setMaxItems(selectedValue?.maxLineItem);
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
    // FetchCustomerAddress({
    //     id: selectedValue?.cId
    // }, handleFetchCustAddressSuccess, handleFetchCustAddressException);
  }

  const handleFetchCustAddressSuccess = (dataObject) => {
    setBillingAddress(dataObject?.data[0]?.cAddress || "");
    setToStatecode(dataObject?.data[0]?.stateCode || "");
    setShippingAddress(dataObject?.data[0]?.cAddress || "");
    setState(dataObject?.data[0]?.state || "");
    setCountry(dataObject?.data[0]?.country || "");
    setGstNo(dataObject?.data[0]?.gstNo || "");
    setPanNo(dataObject?.data[0]?.panNo || "");
    // setSurChrgesTCS(Number(dataObject?.data[0]?.subChargeOnTcs) || "");
    // setCessOnTcs(dataObject?.data[0]?.CessOnTcs || "");
    setCgstPercent(Number(dataObject?.data[0]?.cgst) || "");
    setSgstPercent(Number(dataObject?.data[0]?.sgst) || "");
    setIgstPercent(Number(dataObject?.data[0]?.igst) || "");
    setUtgstPercent(Number(dataObject?.data[0]?.utgst) || "");
    // setTCS(Number(dataObject?.data[0]?.tcsCollected) || "");
    setTcsPercentage(Number(dataObject?.data[0]?.tcsCollected) || "");
    setSurChrgesTCSPercentage(Number(dataObject?.data[0]?.SubcharOnTcs) || "");
    setCessOnTcsPercentage(Number(dataObject?.data[0]?.CessOnTcs) || "");
    setAdd3(dataObject?.data[0]?.state || "");    // <-- Add this line
    setAdd4(dataObject?.data[0]?.country || "");  // <-- Add this line
  };

  const handleFetchCustAddressException = (errorStaus, errorMessage) => {
  };

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
  }, [partNo]);

  const handleChangeCustomer = (e) => {
    CustomerDropShowInvoice(
      { code: e.target.value },
      handleCustomerDropshow,
      handleCustomerDropshowException
    );
  };

  const handleCustomerDropshow = (dataObject) => {
    setCustomerSelectList(dataObject?.data || []);
  };

  const handleCustomerDropshowException = (error, errorMessage) => {
  };

  const handleTransportershow = (dataObject) => {
    setTransporterList(dataObject?.data || []);
  };

  const handleTransportershowException = (error, errorMessage) => {
  };

  const handleDispatchshow = (dataObject) => {
    setDispatchList(dataObject?.data || []);

    const getDefaultAddress = dataObject?.data[0];
    console.log("getDefaultAddressgetDefaultAddress", getDefaultAddress)
    setDispatchFrom(getDefaultAddress?.dispatchAdd);
    setDispatchFromCopy(getDefaultAddress?.dispatchAdd);
    setDispatchFromId(getDefaultAddress?.id || "");
  };

  const handleDispatchshowException = (error, errorMessage) => {
  };

  const handleGSTshowconsignee = (dataObject) => {
    setRows(dataObject?.data || []);
  };

  const handleGSTshowconsigneeException = (errorObject, errorMessage) => { };

  const handleSelectedItemsDeleteRow = (id) => {
    const newArray = selectedItems.filter((item) => item.id != id);
    setSelectedItems(newArray);
    // TO MINUS THE AMOUNT IN TOTAL_GRID
    calculateTotals(newArray);
  };
  const handlePendingPoDeleteRow = (id) => {
    const newArray = pendingPOList.filter((item) => item.id != id);
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
    dispatchList?.map((add) => {
      if (add.dispatchAdd === e.target.value) {
        setDispatchFromId(add?.id || "");
      }
    })
  };

  const optionsPartNoList = partNoList
    ? partNoList.map((item) => ({
      value: item?.id,
      label: item?.label,
    }))
    : [];

  const handleChange = (e) => {
    PartNoSelectGST(
      { id: cId, type: invType },
      handlePartNoDropshow,
      handlePartNoDropshowException
    );
  };

  const handlePartNoDropshow = (dataObject) => {
    setPartNoList(dataObject?.data || []);
  };

  const handlePartNoDropshowException = (error, errorMessage) => {
  };

  function onPartNoSelectChange(selectedValue, event) {
    setPartNo(selectedValue?.id);
    setPartNoLabel(selectedValue?.label);
    GstPartNoSelect(
      { id: selectedValue?.label },
      handlePartNoShowSuccess,
      handlePartNoSelectException
    );
  }

  // const [dcPartNo,setDcPartNo] = useState('');
  // const handlePartNoShowSuccess = (dataObject) => {
  //   const data = dataObject?.data || [];
  //   // setDcPartNo(data[0].itemCode);
  //   setRows(data);
  //   const formattedData = data.map((item) => ({
  //     id: item.id || null,
  //     suppDesc: null,
  //     itemCode: item?.itemCode || "",
  //     itemName: item.itemName || "",
  //     uom: item.uom || 0,
  //     soNo: item.soNo || "",
  //     poNo: item.poNo || "",
  //     Qty: item.Qty || "",
  //     cumQty: item.cumQty || 0,
  //     pendQty: item.pendQty || 0,
  //     hsnCode: item.hsnCode || "",
  //     schDate: item.schDate || "",
  //     invQty: item.invQty || "",
  //     stdRate: item.stdRate || "",
  //     amt: item.amt || "",
  //     itemLedger: item.itemLedger || "",
  //     descOfPackage: item.descOfPackage || "",
  //     poId: item.poId || "",
  //     poItemId: item.poItemId || "",
  //   }));

  //   if (formattedData.length > 0) {
  //     const clonedSelectedItems = [...selectedItems];
  //     const lastObj = clonedSelectedItems.pop();
  //     clonedSelectedItems.push(...formattedData, lastObj);
  //     setSelectedItems(clonedSelectedItems);
  //     calculateTotals(clonedSelectedItems);

  //     // ⭐⭐⭐ TEMP STORE PER INVOICE — Save to localStorage
  //     const newTempList = [...searchTemp, ...formattedData];
  //     setSearchTemp(newTempList);

  //     // Dynamic per-invoice key
  //     const tempKey = `poTempSearch_${autoCode}`;

  //     localStorage.setItem(tempKey, JSON.stringify({
  //       items: newTempList,
  //       poNo: autoCode,
  //       customerName: selectedCustomerName || '',
  //       id: mainId || 'unsaved',
  //       digit: invAutoCode || '',
  //       createdAt: new Date().toISOString()
  //     }));
  //   }
  // };
  const handlePartNoShowSuccess = (dataObject) => {
    const data = dataObject?.data || [];
    setRows(data);
    setVechicleNo(data[0]?.vehicleNo || "");
    const formattedData = data.map((item) => ({
      id: item.id || null,
      suppDesc: item.suppDesc || null,
      itemCode: item?.itemCode || "",
      itemName: item.itemName || "",
      uom: item.uom || "",
      soNo: item.soNo || "",
      poNo: item.poNo || "",
      Qty: item.Qty || "",
      cumQty: item.cumQty || 0,
      pendQty: item.pendQty || 0,
      hsnCode: item.hsnCode || "",
      schDate: item.schDate || "",
      invQty: item.invQty || "",
      stdRate: item.stdRate || "",
      amt: item.amt || "",
      itemLedger: item.itemLedger || "",
      descOfPackage: item.descOfPackage || "",
      poId: item.poId || "",
      poItemId: item.poItemId || "",
    }));


    if (formattedData.length > 0) {

      // ---------- UPDATE UI TABLE ----------
      const clonedSelectedItems = [...selectedItems];
      const lastObj = clonedSelectedItems.pop();
      clonedSelectedItems.push(...formattedData, lastObj);

      setSelectedItems(clonedSelectedItems);
      calculateTotals(clonedSelectedItems);

      // ---------- TEMP STORAGE SYSTEM (No Duplicate Items) ----------
      const cleanedTemp = [...searchTemp];

      formattedData.forEach(item => {
        if (!cleanedTemp.some(temp => temp.itemCode === item.itemCode)) {
          cleanedTemp.push(item);
        }
      });

      setSearchTemp(cleanedTemp);

      // ---------- SAVE TO LOCAL STORAGE ----------
      const tempKey = `poTempSearch_${autoCode}`;

      localStorage.setItem(
        tempKey,
        JSON.stringify({
          items: cleanedTemp,
          poNo: autoCode,
          customerName: selectedCustomerName || "",
          cId: cId || "",
          billingAddress: billingAddress || "",
          shippingAddress: shippingAddress || "",
          add1: add1 || "",
          add2: add2 || "",
          add3: add3 || "",
          add4: add4 || "",
          gstNo: gstNo || "",
          panNo: panNo || "",
          id: mainId || "unsaved",
          digit: invAutoCode || "",
          createdAt: new Date().toISOString()
        })
      );
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

  function normalizeAddress(address) {
    return address
      .toUpperCase()                  // Convert to same case
      .replace(/\s+/g, ' ')           // Replace multiple spaces with single space
      .replace(/[.,]/g, '')           // Remove punctuation
      .trim();                       // Trim whitespace
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

    if (!shippingPincode) {
      setShippingPincodeError(true);
      isValid = false;
    } else {
      setShippingPincodeError(false);
    }

    if (!toStatecode) {
      setToStatecodeError(true);
      isValid = false;
    } else {
      setToStatecodeError(false);
    }

    if (!goodsOrService) {
      setGoodsOrServiceError(true);
      isValid = false;
    } else {
      setGoodsOrServiceError(false);
    }

    if (!labourHeadingRequired) {
      setLabourHeadingRequiredError(true);
      isValid = false;
    } else {
      setLabourHeadingRequiredError(false);
    }

    if (!supplyTypeCode) {
      setSupplyTypeCodeError(true);
      isValid = false;
    } else {
      setSupplyTypeCodeError(false);
    }

    // Normalize addresses by removing extra spaces and line breaks
    // console.log("billingAddressbillingAddress", billingAddress)
    // console.log("shippingAddressshippingAddress", shippingAddress)
    const normalizedBilling = normalizeAddress(billingAddress);
    const normalizedShipping = normalizeAddress(shippingAddress);

    const normalizedDispatchFrom = normalizeAddress(dispatchFrom);
    const normalizedDispatchFromCopy = normalizeAddress(dispatchFromCopy);


    if (labourCharge === 'Y') {
      if (dcSelectionRequired === 'Y') {
        if (dcSelectionData.length < 1) {
          setNotification({
            status: true,
            type: 'error',
            message: "DC selection is required when Labour Charge is applied.",
          });
          return; // Stops execution if the addresses don't match
        }
      }
    }

    if (Number(transactionType) === 1) {
      if (normalizedBilling !== normalizedShipping) {
        setNotification({
          status: true,
          type: 'error',
          message: "Billing and Shipping must match",
        });
        return; // Stops execution if the addresses don't match
      }
    }

    if (Number(transactionType) === 1) {
      if (normalizedDispatchFrom !== normalizedDispatchFromCopy) {
        setNotification({
          status: true,
          type: 'error',
          message: "Dispatch must use the default address for Regular transactions.",
        });
        return; // Stops execution if the addresses don't match
      }
    }

    if (Number(transactionType) === 2) {
      // if (normalizedBilling === normalizedShipping) {
      if (normalizedBilling.toLowerCase() === normalizedShipping.toLowerCase()) {
        setNotification({
          status: true,
          type: 'error',
          message: "Billing and Shipping Address may not be the same if Transaction Type is Bill to Ship to",
        });
        return; // Stops execution if the addresses don't match
      }
    }

    if (Number(transactionType) === 3) {
      if (normalizedDispatchFrom === normalizedDispatchFromCopy) {
        setNotification({
          status: true,
          type: 'error',
          message: "Dispatch From Address may not be the same if Transaction Type is Dispatch From",
        });
        return; // Stops execution if the addresses don't match
      }
    }

    if (Number(transactionType) === 4) {
      if (normalizedBilling === normalizedShipping) {
        setNotification({
          status: true,
          type: 'error',
          message: "Billing and Shipping Address may not be the same if Transaction Option 4",
        });
        return; // Stops execution if the addresses don't match
      }
    }

    if (Number(transactionType) === 4) {
      if (normalizedDispatchFrom === normalizedDispatchFromCopy) {
        setNotification({
          status: true,
          type: 'error',
          message: "Dispatch From Address may not be the same if Transaction Option 4",
        });
        return; // Stops execution if the addresses don't match
      }
    }

    const gstOrderData = {
      invCode: invCode,
      type: invType,
      invSt: invAutoCode,
      invNo: autoCode,
      date: selectedDate,
      custName: cId,
      billAdd: `${billingAddress}`,
      shipAdd: `${shippingAddress}`,
      invoIssuDate: invIssueDate,
      dcNO: dcNo,
      dcDate: dcDate,
      modelOfDis: modeOfDispach,
      vechileNO: vechicleNo,
      custPoNo: custPoNo,
      Consignee: consignee,
      add1: add1,
      add2: add2,
      add3: add3,
      add4: add4,
      gstNo: gstNo,
      panNo: panNo,
      trType: transactionType,
      modeOfType: modeOfType,
      docketNo: docketNo,
      traDate: transportDate,
      transporter: transporterMst,
      TransporterGSTIN: transporterGSTIN,
      distKms: distanceKMS,
      shipPincode: shippingPincode,
      stateCode: toStatecode,
      actualToState: actualToState,
      goodsOrService: goodsOrService,
      labourCharge: labourCharge,
      labourCrgesHdingReqed: labourHeadingRequired,
      reverseCharge: reverseCharge,
      supplyTypeCode: supplyTypeCode,
      dcSelectionRequired: dcSelectionRequired,
      dcSelected: dcSelectionRequired === 'Y' && labourCharge === 'Y' ? 1 : 0,
      dispatchFrom: dispatchFrom,
      dispatchId: dispatchFromId,
      resonForNoTax: resonForNoTax,
      resonForNoduty: resonForNoduty,
      remrk1: remarks1,
      remrk2: remarks2,
      remrk3: remarks3,
      remrk4: remarks4,
      remrk5: remarks5,
      dcDetails: dcDetails,
      dutyInwords: dutyInWords,
      totalInWords: numberToWords(invValue),
      totalQty: totQty,
      taxableValueforGST: taxGSTPayable,
      lessDisc: lessDisc,
      lessOther: lessOther,
      subTotAfterDisc: subTotal,
      packingForw: packFrwrd,
      transportCharges: trnsprtcharges,
      subtotal: subTotl,
      Insurance: insurance,
      custMeterialValue: custmrMeterlValue,
      AmmortisationCost: ammortisanCost,
      amtOfGstPay: amtGSTPayble,
      CGSTPer: cgstPercent,
      CGST: cgst,
      SGSTPer: sgstPercent,
      SGST: sgst,
      IGSTPer: igstPercent,
      IGST: igst,
      UTGSTPer: utgstPercent,
      UTGST: utgst,
      totGst: totlGST,
      tcsPer: tcsPercentage,
      tcs: tcs,
      subChargeOnTcsPer: surChrgesTCSPercentage,
      subChargeOnTcs: surChrgesTCS,
      cessOnTcsPer: cessOnTcsPercentage,
      cessOnTcs: cessOnTcs,
      totalValue: totlValues,
      roundOff: roundOff,
      invValue: invValue,
      allGstTotal: displayAllGstTotal,
      allTcsTotal: displayAllTcsTotal,
      cumQty: custAllAddressList?.[0]?.cumQty
    };

    // const gstOrderItemData = selectedItems.map((data, key) => ({
    //   id: data?.id,
    //   itemCode: data?.itemCode,
    //   itemName: data?.itemName,
    //   uom: data?.uom,
    //   soNo: data?.soNo,
    //   Qty: data?.Qty,
    //   cumQty: data?.totStk,
    //   pendQty: data?.pendQty,
    //   hsnCode: data?.hsnCode,
    //   schDate: data?.schDate,
    //   invQty: data?.invQty,
    //   stdRate: data?.stdRate,
    //   amt: data?.amt,
    //   itemLedger: data?.itemLedger,
    //   descOfPackage: data?.descOfPackage,
    //   poId:data?.poId,
    //   nrdc :1
    // }));

    const gstOrderItemData = selectedItems.map((obj) => ({
      ...obj,
      nrdc: 1,
    }));

    // const updatedGstOrderItemData = gstOrderItemData.slice(0, -1);
    // const updatedPendingPoLists = pendingPOList.slice(0, -1);
    const updatedGstOrderItemData = gstOrderItemData.filter(item => item.id !== 'RDL1');
    const updatedPendingPoLists = pendingPOList.filter(item => item.id !== 'RDL1');

    const requestData = {
      gstOrderData: gstOrderData,
      gstOrderItemData: isEdit ? gstOrderItemData : [...updatedGstOrderItemData, ...updatedPendingPoLists, ...dcSelectionData],
      // id: isEdit ? poRowId : "",
      id: isEdit ? mainId : "",
    };
    if (isEdit) {
      // GSTInvUpdate(requestData, handleSuccess, handleException);
      if (vechicleNo && transactionType && modeOfType && distanceKMS && shippingPincode && toStatecode && goodsOrService && labourHeadingRequired && supplyTypeCode) {
        setLoading(true);
        GSTInvUpdate(requestData, handleSuccess, handleException);
      } else {
        setNotification({
          status: true,
          type: 'error',
          message: 'Please fill the required fields',
        });
      }
    } else {
      // GSTInvAdd(requestData, handleSuccess, handleException);
      if (vechicleNo && transactionType && modeOfType && distanceKMS && shippingPincode && toStatecode && goodsOrService && labourHeadingRequired && supplyTypeCode) {
        setLoading(true);
        GSTInvAdd(requestData, handleSuccess, handleException);
      } else {
        setNotification({
          status: true,
          type: 'error',
          message: 'Please fill the required fields',
        });
      }
    }
  };

  // const handleSuccess = (dataObject) => {
  //   setRefreshData((oldValue) => !oldValue);
  //   setNotification({
  //     status: true,
  //     type: "success",
  //     message: dataObject.message,
  //   });
  //   ClearData();
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2000)
  // };
  const handleSuccess = (dataObject) => {
    setIsEdit(false);
    const savedInvoiceNo = autoCode;
    const returnedId = dataObject?.data?.id || dataObject?.id || mainId;
    const updatedInvoice = dataObject?.data;

    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });

    // ⭐ Clear any temp entries related to this invoice (supports multiple saved temps per invoice)
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith("poTempSearch_"));
      keys.forEach((k) => {
        try {
          const raw = localStorage.getItem(k);
          if (!raw) return;
          const parsed = JSON.parse(raw);
          if (!parsed) return;
          if ((savedInvoiceNo && String(parsed.poNo) === String(savedInvoiceNo)) || (returnedId && String(parsed.id) === String(returnedId))) {
            localStorage.removeItem(k);
          }
        } catch (e) {
          // ignore malformed entries
        }
      });
    } catch (e) {
      // ignore
    }

    // Clear state temp
    // setSearchTemp([]);
    if (updatedInvoice?.items) {
      setSearchTemp(updatedInvoice.items);
    }

    // ⭐ CONDITION HERE:
    // 🆕 NEW item added → go to LAST invoice
    if (!isEdit) {
      handleForwardReverse("last", "");
    }

    // ✏️ Edited existing item → reload SAME invoice
    else {
      handleForwardReverse("search", returnedId);
    }

    // Reset form
    handleForwardReverse("search", returnedId);

    setTimeout(() => setLoading(false), 1000);
  };


  const handleException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // setRefreshData((oldValue) => !oldValue);
      setLoading(false);
    }, 2000);
  };

  // const calculateTotals = (data) => {
  //   const totQty =
  //     data && data.reduce((acc, item) => acc + (Number(item.invQty) || 0), 0);
  //   setTotQty(totQty);

  //   // const taxGSTPayable =
  //   //   data && data.reduce((acc, item) => acc + (Number(item.stdRate) || 0), 0);
  //   // setTaxGsTPayable(taxGSTPayable);

  //   const subTotal =
  //     data && data.reduce((acc, item) => acc + (Number(item.amt) || 0), 0);
  //   // setSubTotal(subTotal);
  //   setTaxGsTPayable(subTotal);

  //   // Calculate discounted total
  //   const lessDiscountTotal = (Number(subTotal) * Number(lessDisc)) / 100;

  //   // Calculate other total
  //   const lessOtherTotal = (Number(subTotal) * Number(lessOther)) / 100;

  //   // Update subTotal after applying both discounts
  //   const subTotalValue =
  //     Number(subTotal) - Number(lessDiscountTotal) - Number(lessOtherTotal);
  //   setSubTotal(subTotalValue);

  //   // Packing Transport Sub Total
  //   const packingTransportTotal =
  //     Number(subTotalValue) + Number(packFrwrd) + Number(trnsprtcharges);
  //   setSubTotl(packingTransportTotal);

  //   // Amount for GST Payable
  //   const amountForGSTPayable =
  //     Number(packingTransportTotal) +
  //     Number(insurance) +
  //     Number(custmrMeterlValue) +
  //     Number(ammortisanCost);
  //   setAmtGSTPayble(amountForGSTPayable);

  //   // const totalValue=
  //   setTotlValues();

  //   return [{ id: 1, totQty, taxGSTPayable, subTotal /*amt*/ }];
  // };

  const calculateTotals = (data) => {
    console.log("datadatadatadata", maxItems)
    let rowCount = 2;

    if (!data || data.length === 0) {
      setTotQty(0);
      setTaxGsTPayable(0);
      return;
    }

    let filteredData = data;

    // If rowCount is NOT 0, filter by the first row's poNo
    if (Number(maxItems) !== 0) {
      const poNo = data[0]?.poNo;
      if (!poNo) {
        setTotQty(0);
        setTaxGsTPayable(0);
        return;
      }
      filteredData = data.filter(item => item.poNo === poNo);

      // Apply row limit if rowCount is provided and greater than 0
      if (Number(maxItems) !== null && Number(maxItems) > 0) {
        filteredData = filteredData.slice(0, Number(maxItems)); // Safe even if rowCount > available rows
      }
    }

    // Calculate total quantity
    const totQty = parseFloat(
      filteredData.reduce((acc, item) => acc + (Number(item.invQty) || 0), 0).toFixed(2)
    );
    setTotQty(totQty);

    // Calculate total amount
    const subTotal = parseFloat(
      filteredData.reduce((acc, item) => acc + (Number(item.amt) || 0), 0).toFixed(2)
    );
    setTaxGsTPayable(subTotal);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Update subTotal after applying both discounts
    const subTotalValue = parseFloat(
      (subTotal - Number(lessDisc) - Number(lessOther)).toFixed(2)
    );
    setSubTotal(subTotalValue);

    // Packing Transport Sub Total
    const packingTransportTotal = parseFloat(
      (subTotalValue + Number(packFrwrd) + Number(trnsprtcharges)).toFixed(2)
    );
    setSubTotl(packingTransportTotal);

    // INSURANCE CALCULATION
    const insuranceAmount = parseFloat(
      ((Number(packingTransportTotal) * Number(insurance)) / 100).toFixed(2)
    );

    // Amount for GST Payable
    const amountForGSTPayable = parseFloat(
      (
        packingTransportTotal +
        Number(insuranceAmount) +
        Number(custmrMeterlValue) +
        Number(ammortisanCost)
      ).toFixed(2)
    );
    setAmtGSTPayble(amountForGSTPayable);

    setTotlValues();

    return [{ id: 1, totQty, taxGSTPayable: subTotal, subTotal }];
  };

  // ⭐⭐⭐ TEMP STORAGE HANDLERS FOR INVOICE ITEMS
  // const loadAllTemps = () => {
  //   const keys = Object.keys(localStorage).filter(k => k.startsWith("poTempSearch_"));
  //   const list = keys.map(k => {
  //     const t = JSON.parse(localStorage.getItem(k));
  //     return {
  //       key: k,
  //       poNo: t.poNo,
  //       supplierName: t.supplierName || t.customerName || 'N/A',
  //       items: t.items.length,
  //       createdAt: t.createdAt
  //     };
  //   });
  //   setTempList(list);
  // };
  // ---------------- TEMP DATA MANAGER ----------------
  const loadAllTemps = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith("poTempSearch_"));

    const list = keys.map(k => {
      try {
        const t = JSON.parse(localStorage.getItem(k));
        return {
          key: k,
          poNo: t.poNo,
          supplierName: t.customerName || t.cName || t.supplierName || "Unknown",
          items: t.items?.length ?? 0,
          createdAt: t.createdAt
        };
      } catch {
        return null;
      }
    }).filter(Boolean);

    setTempList(list);
  };


  // Restore a specific saved invoice



  // ⭐⭐⭐ TEMP STORE PER INVOICE



  // const restoreSpecificTemp = (poNo) => {
  //   const raw = localStorage.getItem(`poTempSearch_${poNo}`);

  //   if (!raw) {
  //     setNotification({ status: true, type: "error", message: "No temp found for this invoice" });
  //     return;
  //   }

  //   const temp = JSON.parse(raw);

  //   // Restore invoice data
  //   setAutoCode(temp.poNo);
  //   setSelectedItems([...temp.items, { id: "RDL1" }]);
  //   setSearchTemp(temp.items);

  //   setNotification({
  //     status: true,
  //     type: 'success',
  //     message: `Loaded temp for Invoice ${poNo}`
  //   });

  //   setOpenTempManager(false);
  // };
  const restoreSpecificTemp = (keyOrPoNo) => {
    // Accept either a full localStorage key or a poNo
    let key = keyOrPoNo;
    if (!key.startsWith?.("poTempSearch_")) {
      key = `poTempSearch_${keyOrPoNo}`;
    }

    const raw = localStorage.getItem(key);

    if (!raw) {
      setNotification({ status: true, type: "error", message: "No temp found for this invoice" });
      return;
    }

    let temp;
    try {
      temp = JSON.parse(raw);
    } catch (e) {
      setNotification({ status: true, type: "error", message: "Failed to parse temp data" });
      return;
    }

    // Restore items FIRST (before invoice fields) so they're ready
    const items = Array.isArray(temp.items) ? temp.items : [];
    setSelectedItems([...items, { id: "RDL1" }]);
    setSearchTemp(items);
    calculateTotals(items);

    // Restore invoice-level fields AFTER items
    if (temp.poNo) setAutoCode(temp.poNo);
    if (temp.customerName) {
      setSelectedCustomerName(temp.customerName);
      setCustomerName(temp.customerName);
    }
    if (temp.cId) setCId(temp.cId);
    if (temp.billingAddress) setBillingAddress(temp.billingAddress);
    if (temp.shippingAddress) setShippingAddress(temp.shippingAddress);
    if (temp.add1) setAdd1(temp.add1);
    if (temp.add2) setAdd2(temp.add2);
    if (temp.add3) setAdd3(temp.add3);
    if (temp.add4) setAdd4(temp.add4);
    if (temp.gstNo) setGstNo(temp.gstNo);
    if (temp.panNo) setPanNo(temp.panNo);
    if (temp.digit) setInvAutoCode(temp.digit);
    if (temp.id) setMainId(temp.id);

    setNotification({
      status: true,
      type: 'success',
      message: `Restored invoice ${temp.poNo || key}`
    });

    setOpenTempManager(false);
  };



  // const deleteSpecificTemp = (poNo) => {
  //   localStorage.removeItem(`poTempSearch_${poNo}`);
  //   loadAllTemps();

  //   setNotification({
  //     status: true,
  //     type: "success",
  //     message: `Deleted temp for Invoice ${poNo}`
  //   });
  // };
  const deleteSpecificTemp = (keyOrPoNo) => {
    let key = keyOrPoNo;
    if (!key.startsWith?.("poTempSearch_")) {
      key = `poTempSearch_${keyOrPoNo}`;
    }
    localStorage.removeItem(key);
    loadAllTemps();

    setNotification({
      status: true,
      type: "success",
      message: `Deleted temporary invoice ${key}`
    });
  };

  // useEffect(() => {
  //   if (openTempManager) {
  //     loadAllTemps();
  //   }
  // }, [openTempManager]);
  useEffect(() => {
    if (openTempManager) loadAllTemps();
  }, [openTempManager]);

  // Clear items only when invoice number changes AND items are already empty
  useEffect(() => {
    if (autoCode && !isLoadingTemp && selectedItems.length < 0) {
      // Only clear if items are empty (only footer RDL1 remains)
      setSelectedItems([{ id: "RDL1" }]);
      setSearchTemp([]);
    }
  }, [autoCode, isLoadingTemp]);

  useEffect(() => {
    calculateTotals(selectedItems);
  }, [
    selectedItems,
    lessDisc,
    subTotal,
    lessOther,
    packFrwrd,
    trnsprtcharges,
    insurance,
    custmrMeterlValue,
    ammortisanCost
  ]);

  useEffect(() => {
    if (pendingPOList.length > 1) {
      calculateTotals(pendingPOList);
    }
  }, [
    lessDisc,
    subTotal,
    lessOther,
    packFrwrd,
    trnsprtcharges,
    pendingPOList,
    insurance,
    custmrMeterlValue,
    ammortisanCost
  ]);

  // useEffect(() => {
  //   // let subTotalAmount = Number(subTotal)
  //   // setSubTotal(subTotalAmount);

  //   var cgstAmount = (Number(amtGSTPayble) * Number(cgstPercent)) / 100;
  //   setCGST(cgstAmount);

  //   var sgstAmount = (Number(amtGSTPayble) * Number(sgstPercent)) / 100;
  //   setSGST(sgstAmount);

  //   var igstAmount =
  //     add3.toUpperCase() !== "KARNATAKA" && add4.toUpperCase() === "INDIA"
  //       ? (Number(amtGSTPayble) * Number(igstPercent)) / 100
  //       : 0;
  //   setIGST(igstAmount);

  //   var utgstAmount =
  //     add4.toUpperCase() !== "INDIA"
  //       ? (Number(amtGSTPayble) * Number(utgstPercent)) / 100
  //       : 0;
  //   setUTGST(utgstAmount);

  //   var allGstToTAL =
  //     Number(amtGSTPayble) +
  //     Number(cgstAmount) +
  //     Number(sgstAmount) +
  //     Number(igstAmount) +
  //     Number(utgstAmount);
  //   setTotlGST(Math.floor(allGstToTAL));

  //   // cgstPercent

  //   // var tcsAmount = (allGstToTAL * tcs) / 100;
  //   var tcsAmount = (Number(allGstToTAL) * Number(tcsPercentage)) / 100;
  //   setTcsAmount(tcsAmount);

  //   var allTotalValues =
  //     Number(allGstToTAL) +
  //     Number(tcsAmount) +
  //     Number(surChrgesTCS) +
  //     Number(cessOnTcs);
  //   setTotlValues(allTotalValues);

  //   // let rounded_number = Math.round(allTotalValues) ;
  //   // setRoundOff(rounded_number)

  //   let roundedNumber = Math.round(allTotalValues);
  //   // Calculate the difference between the rounded value and the original value
  //   let difference = roundedNumber - allTotalValues;
  //   // Set the difference value to the state
  //   setRoundOff(difference);

  //   const invValue = Number(allTotalValues) + Number(difference);
  //   setInvValue(invValue);
  // }, [
  //   cgstPercent,
  //   sgstPercent,
  //   igstPercent,
  //   utgstPercent,
  //   amtGSTPayble,
  //   tcs,
  //   surChrgesTCS,
  //   cessOnTcs,
  //   totlGST,
  //   totlValues,
  //   roundOff,
  //   invValue,
  //   tcsPercentage
  // ]);

  useEffect(() => {
    // Calculate CGST Amount
    const cgstAmount = parseFloat(
      ((Number(amtGSTPayble) * Number(cgstPercent)) / 100).toFixed(2)
    );
    setCGST(cgstAmount);

    // Calculate SGST Amount
    const sgstAmount = parseFloat(
      ((Number(amtGSTPayble) * Number(sgstPercent)) / 100).toFixed(2)
    );
    setSGST(sgstAmount);

    // Calculate IGST Amount (for non-Karnataka states in India)
    // const igstAmount =
    //   add3?.toUpperCase() !== "KARNATAKA" && add4?.toUpperCase() === "INDIA"
    //     ? parseFloat(((Number(amtGSTPayble) * Number(igstPercent)) / 100).toFixed(2))
    //     : 0;
    // setIGST(igstAmount);
    const isDomestic = add4?.toUpperCase() === "INDIA";
    const isSameState = add3?.toUpperCase() === "KARNATAKA";

    // ✅ Calculate IGST only if domestic and inter-state
    const igstAmount = isDomestic && !isSameState
      ? parseFloat(((Number(amtGSTPayble) * Number(igstPercent)) / 100).toFixed(2))
      : 0;


    setIGST(igstAmount);
    // Calculate UTGST Amount (for outside India)
    const utgstAmount =
      add4?.toUpperCase() !== "INDIA"
        ? parseFloat(((Number(amtGSTPayble) * Number(utgstPercent)) / 100).toFixed(2))
        : 0;
    setUTGST(utgstAmount);

    // Calculate Total GST
    // const allGstTotal = parseFloat(
    //   (
    //     Number(amtGSTPayble) +
    //     Number(cgstAmount) +
    //     Number(sgstAmount) +
    //     Number(igstAmount) +
    //     Number(utgstAmount)
    //   ).toFixed(2)
    // );
    // setTotlGST(allGstTotal);
    const allGstTotal = parseFloat(
      (
        Number(amtGSTPayble) +
        Number(cgstAmount) +
        Number(sgstAmount) +
        Number(igstAmount) +
        Number(utgstAmount) -
        Number(ammortisanCost) -
        Number(custmrMeterlValue)
      ).toFixed(2)
    );

    setTotlGST(allGstTotal);


    // DISPLAY ALL GST TOTAL IN FRONT PAGE
    setDisplayAllGstTotal(parseFloat((cgstAmount + sgstAmount + igstAmount + utgstAmount).toFixed(2)))

    // Calculate TCS Amount
    // const tcsAmount = parseFloat(
    //   ((allGstTotal * Number(tcsPercentage)) / 100).toFixed(2)
    // );
    // setTcsAmount(tcsAmount);
    const tcsAmount = parseFloat(
      ((allGstTotal * Number(tcsPercentage)) / 100).toFixed(2)
    );
    setTCS(tcsAmount);

    //CALCULATE SUB CHARGES ON TCS
    const subChargesAmount = parseFloat(
      ((tcsAmount * Number(surChrgesTCSPercentage)) / 100).toFixed(2)
    );
    setSurChrgesTCS(subChargesAmount);

    //CALCULATE CESS ON TCS
    const cessOnTcsAmount = parseFloat(
      (((tcsAmount + subChargesAmount) * Number(cessOnTcsPercentage)) / 100).toFixed(2)
    );
    setCessOnTcs(cessOnTcsAmount);

    // Calculate All Total Values
    const allTotalValues = parseFloat(
      (
        allGstTotal +
        Number(tcsAmount) +
        Number(subChargesAmount) +
        Number(cessOnTcsAmount)
      ).toFixed(2)
    );
    setTotlValues(allTotalValues);

    // DISPLAY ALL TCS TOTAL IN FRONT PAGE
    setDisplayAllTcsTotal(parseFloat((tcsAmount + subChargesAmount + cessOnTcsAmount).toFixed(2)));

    // Calculate Round Off Difference
    const roundedNumber = Math.round(allTotalValues);
    const difference = parseFloat((roundedNumber - allTotalValues).toFixed(2));
    setRoundOff(difference);

    // Calculate Final Invoice Value
    const invValue = parseFloat((allTotalValues + difference).toFixed(2));
    setInvValue(invValue);
  }, [
    cgstPercent,
    sgstPercent,
    igstPercent,
    utgstPercent,
    amtGSTPayble,
    tcs,
    // surChrgesTCS,
    // cessOnTcs,
    totlGST,
    totlValues,
    roundOff,
    invValue,
    tcsPercentage,
    surChrgesTCSPercentage,
    cessOnTcsPercentage,
    add3,
    add4
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
    setInvCode("ME");
    setInvAutoCode("");
    setAutoCode("");
    setCustomerSelect("");
    setCustomerSelectList([]);
    setCustomerName("");
    setBillingAddress("");
    setShippingAddress("");
    setInvIssueDate(new Date());
    setDcNo("");
    setAdd1("");
    setAdd2("");
    setAdd3("");
    setAdd4("");
    setGstNo("");
    setPanNo("");
    setDcDate(new Date());
    setModeOfDispach("");
    setVechicleNo("");
    setTransportDate(new Date());
    setTransporterMst("");
    // setTransporterList([]);
    setTransporterGSTIN("");
    setDistanceKMS("");
    setShippingPincode("");
    setToStatecode("");
    setGoodsOrService("");
    setLabourCharge("N");
    setLabourHeadingRequired("N");
    setReverseCharge("N");
    setSupplyTypeCode("B2B");
    setDispatchFrom("");
    setDispatchFromId("");
    setDispatchAddress("");
    setDispatchList([]);
    setPartNo("");
    setPartNoList([]);
    setRows([]);
    setSelectedRow("");
    setResNoTax("");
    setResNoDuty("");
    setRemarks1("");
    setRemarks2("");
    setRemarks3("");
    setRemarks4("");
    setRemarks5("");
    setDcDetails("");
    setDutyInWords("");
    setTotalInWords("");
    setTotQty("");
    setTaxGsTPayable("");
    setLessDisc("");
    setLessOther("");
    setSubTotal("");
    setPackFrwrd("");
    setTrnsprtCharges("");
    setSubTotl("");
    setInsurane("");
    setCustmrMeterlValue("");
    setAmmortisanCost("");
    setAmtGSTPayble("");
    setCGST("");
    setSGST("");
    setIGST("");
    setUTGST("");
    setTotlGST("");
    setTCS("");
    setSurChrgesTCSPercentage("");
    setSurChrgesTCS("");
    setCessOnTcsPercentage("");
    setCessOnTcs("");
    setTotlValues("");
    setRoundOff("");
    setCustomerSid("");
    setCustAddress("");
    setSelectedCustomerName("");
    setCustPoNo("");
    setTransactionType("");
    setModeOfType("");
    setDocketNo("");
    setResonForNoTax("");
    setResonForNoduty("");
    setSelectedItems([{ id: "RDL1" }]);
    setPartNoLabel("");
    setPendingPOList([{ id: "RDL1" }]);
    setSelectedDate(new Date());
    setCgstPercent("");
    setSgstPercent("");
    setIgstPercent("");
    setUtgstPercent("");
    setInvValue("");
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

  const handleViewClick = () => {
    navigate("/NewGstInvView");
  };

  const handleEdit = (cellNam, newValue, id, rowData) => {
    switch (cellNam) {
      case "invQty":
        const updatedInvQty = selectedItems.map((data) => {
          if (data.id === id && cellNam === 'invQty') {
            if (Number(newValue) > Number(rowData.Qty)) {
              // alert('Invoice Quantity cannot be greater than Pending Quantity');
              setNotification({
                status: true,
                type: 'error',
                message: 'Invoice Quantity cannot be greater than SO Quantity',
              });
              return {
                ...data,
                invQty: 0,
                amt: 0
              };
            }
            return {
              ...data,
              invQty: Number(newValue),
              amt: Number(newValue) * Number(rowData.stdRate),
            };
          }
          return data;
        });
        setSelectedItems(updatedInvQty);
        calculateTotals(updatedInvQty);
        break;
      case "descOfPackage":
        const updatedDescOfPackage = selectedItems.map((data) => {
          if (data.id === id && cellNam === 'descOfPackage') {
            return {
              ...data,
              descOfPackage: newValue,
            };
          }
          return data;
        });
        setSelectedItems(updatedDescOfPackage);
        break;
      default:
        return;
    }
  };

  const handleEditPendingPo = (cellNam, newValue, id, rowData) => {
    switch (cellNam) {
      case "invQty":
        const updatedInvQty = selectedItems.map((data) => {
          if (data.id === id && cellNam === 'invQty') {
            if (Number(newValue) > Number(rowData.Qty)) {
              // alert('Invoice Quantity cannot be greater than Pending Quantity');
              setNotification({
                status: true,
                type: 'error',
                message: 'Invoice Quantity cannot be greater than SO Quantity',
              });
              return {
                ...data,
                invQty: 0,
                amt: 0
              };
            }
            return {
              ...data,
              invQty: Number(newValue),
              amt: Number(newValue) * Number(rowData.stdRate),
            };
          }
          return data;
        });
        setSelectedItems(updatedInvQty);
        calculateTotals(updatedInvQty);
        break;
      case "descOfPackage":
        const updatedDescOfPackage = selectedItems.map((data) => {
          if (data.id === id && cellNam === 'descOfPackage') {
            return {
              ...data,
              descOfPackage: newValue,
            };
          }
          return data;
        });
        setSelectedItems(updatedDescOfPackage);
        break;
      default:
        return;
    }
  };

  const handleEdit1 = (field, value, id) => {
    // Update the pendingPOList here, e.g.:
    const updatedList = pendingPOList.map(item =>
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
    const poItemIds = mergeSelectedAndPending
      .filter(item => item.id !== "RDL1")
      .map(item => ({ id: item.poItemId, invQty: item.invQty }));

    // Remove duplicates based on the 'id' property
    const uniquePoItemIds = Array.from(
      new Map(poItemIds.map(item => [item.id, item])).values()
    );
    setSelectedPoItemIds(uniquePoItemIds);
    // setSelectedPoItemIds(poItemIds);
    setTimeout(() => {
      setDcSelectionFlag(true);
    }, 2000)
    // navigate(`/DcSelection?cId=${cId}`);
  };

  const [open, setOpen] = useState(false);

  // function numberToWords(number) {
  //   const units = [
  //     "Zero",
  //     "One",
  //     "Two",
  //     "Three",
  //     "Four",
  //     "Five",
  //     "Six",
  //     "Seven",
  //     "Eight",
  //     "Nine",
  //   ];
  //   const teens = [
  //     "Ten",
  //     "Eleven",
  //     "Twelve",
  //     "Thirteen",
  //     "Fourteen",
  //     "Fifteen",
  //     "Sixteen",
  //     "Seventeen",
  //     "Eighteen",
  //     "Nineteen",
  //   ];
  //   const tens = [
  //     "",
  //     "",
  //     "Twenty",
  //     "Thirty",
  //     "Forty",
  //     "Fifty",
  //     "Sixty",
  //     "Seventy",
  //     "Eighty",
  //     "Ninety",
  //   ];
  //   if (number < 10) {
  //     return units[number];
  //   } else if (number < 20) {
  //     return teens[number - 10];
  //   } else if (number < 100) {
  //     return (
  //       tens[Math.floor(number / 10)] +
  //       (number % 10 !== 0 ? " " + units[number % 10] : "")
  //     );
  //   } else if (number < 1000) {
  //     return (
  //       units[Math.floor(number / 100)] +
  //       " Hundred" +
  //       (number % 100 !== 0 ? " " + numberToWords(number % 100) : "")
  //     );
  //   } else if (number < 1000000) {
  //     return (
  //       numberToWords(Math.floor(number / 1000)) +
  //       " Thousand" +
  //       (number % 1000 !== 0 ? " " + numberToWords(number % 1000) : "")
  //     );
  //   } else if (number < 1000000000) {
  //     return (
  //       numberToWords(Math.floor(number / 1000000)) +
  //       " Million" +
  //       (number % 1000000 !== 0 ? " " + numberToWords(number % 1000000) : "")
  //     );
  //   } else {
  //     return (
  //       numberToWords(Math.floor(number / 1000000000)) +
  //       " Billion" +
  //       (number % 1000000000 !== 0
  //         ? " " + numberToWords(number % 1000000000)
  //         : "")
  //     );
  //   }
  // }

  function numberToWords(number) {
    const units = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (number < 10) {
      return units[number];
    } else if (number < 20) {
      return teens[number - 10];
    } else if (number < 100) {
      return tens[Math.floor(number / 10)] + (number % 10 !== 0 ? ' ' + units[number % 10] : '');
    } else if (number < 1000) {
      return units[Math.floor(number / 100)] + ' Hundred' + (number % 100 !== 0 ? ' ' + numberToWords(number % 100) : '');
    } else if (number < 100000) {
      return numberToWords(Math.floor(number / 1000)) + ' Thousand' + (number % 1000 !== 0 ? ' ' + numberToWords(number % 1000) : '');
    } else if (number < 10000000) {
      return numberToWords(Math.floor(number / 100000)) + ' Lakh' + (number % 100000 !== 0 ? ' ' + numberToWords(number % 100000) : '');
    } else {
      return numberToWords(Math.floor(number / 10000000)) + ' Crore' + (number % 10000000 !== 0 ? ' ' + numberToWords(number % 10000000) : '');
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
  }

  const handleCloseReason = () => {
    setOpen(false);
  };

  // HANDLE FORWARD REVERSE HANDLER
  // const handleForwardReverse = (type, id) => {
  //   GstInvoicePreview({ type: type, id: id }, handleActionSuccess, handleActionException)
  //   MstDispatchShowData(handleDispatchshow, handleDispatchshowException);
  // }
  const handleForwardReverse = (type, id) => {

    // Load a specific invoice after save/update
    if (type === "search") {
      GstViewing({ id }, handleActionSuccess, handleActionException);
      MstDispatchShowData(handleDispatchshow, handleDispatchshowException);
      return;
    }

    // Normal navigation (first, last, next, previous)
    GstInvoicePreview({ type, id }, handleActionSuccess, handleActionException);
    MstDispatchShowData(handleDispatchshow, handleDispatchshowException);
  };


  function convertToISO(dateStr) {
    // Split the "DD-MM-YYYY" format
    const [day, month, year] = dateStr.split('-');

    // Create a new Date object using "YYYY-MM-DD"
    const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

    return isoDate.toISOString(); // Convert to "YYYY-MM-DDTHH:mm:ss.SSSZ"
  }

  const handleActionSuccess = (dataObject) => {
    setIsPoView(true)
    const data = dataObject.data.invoice;
    setInvCode(data?.invCode);
    const rawDate = data?.date || ''; // Example: "28-02-2025"
    const formattedDate = rawDate ? convertToISO(rawDate) : '';
    setSelectedDate(formattedDate);
    setState(data?.state);
    setCountry(data?.country);
    setEinvoiceGen(data?.invoiceGen);
    setInvType(data?.type);
    setInvAutoCode(data?.invSt);
    setSelectedCustomerName(data?.cName || "");
    setAutoCode(data?.invNo || "");
    setBillingAddress(data?.billAdd || "");
    setShippingAddress(data?.shipAdd || "");
    setInvIssueDate(data?.invoIssuDate || "");
    setDcNo(data?.dcNO || "");
    setDcDate(data?.dcDate || "");
    setModeOfDispach(data?.modelOfDis || "");
    setVechicleNo(data?.vechileNO || "");
    setCustPoNo(data?.custPoNo || "");
    setConsignee(data?.Consignee || "");
    setAdd1(data?.add1 || "");
    setAdd2(data?.add2 || "");
    // setAdd3(data?.add3 || "");
    // setAdd4(data?.add4 || "");
    setAdd3(data?.state || "");
    setAdd4(data?.country || "");
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
    setDispatchFromId(data?.dispatchId || "");
    setDispatchAddress(data?.dispatchFrom || "");
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
    setCgstPercent(data?.CGSTPer || "")
    setCGST(data?.CGST || "");
    setSgstPercent(data?.SGSTPer || "")
    setSGST(data?.SGST || "");
    setIgstPercent(data?.IGSTPer || "")
    setIGST(data?.IGST || "");
    setUtgstPercent(data?.UTGSTPer || "")
    setUTGST(data?.UTGST || "");
    setTotlGST(data?.totGst || "");
    setTcsPercentage(data?.tcsPer || "")
    setTCS(data?.tcsCollected || "");
    setSurChrgesTCS(data?.subChargeOnTcs || "");
    setSurChrgesTCSPercentage(data?.subChargeOnTcsPer || "");
    setCessOnTcsPercentage(data?.cessOnTcsPer || "");
    setTotlValues(data?.totalValue || "");
    setRoundOff(data?.roundOff || "");
    setInvValue(data?.invValue || "");
    setSelectedItems(dataObject?.data?.items || []);
    setMainId(data?.id || '');
  }
  const handleActionException = () => { }
  const getJsonSuccess = async (dataObject) => {
    try {
      // Create a Blob from the JSON data
      const jsonBlob = new Blob([JSON.stringify(dataObject, null, 2)], {
        type: "application/json",
      });
      // Create a link element
      const link = document.createElement("a");
      link.href = URL.createObjectURL(jsonBlob);
      link.download = "GST.json"; // Filename for the downloaded file
      // Programmatically click the link to trigger the download
      link.click();
      // Clean up the object URL
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error fetching API:", error);
    }
  };
  const getJsonExceptoin = () => { };


  const handleClearPage = () => {
    setIsPoView(false)
    setIsEdit(false)
    setVehicleNoError(false);
    setTransactionTypeError(false);
    setModeOfTypeError(false);
    setDistanceKMSError(false);
    setShippingPincodeError(false);
    setToStatecodeError(false);
    setGoodsOrServiceError(false);
    setLabourHeadingRequiredError(false);
    setSupplyTypeCodeError(false);

    setMainId('')
    setEinvoiceGen(0);
    setInvCode("ME");
    setInvType("Assembly");
    setInvAutoCode("");
    setAutoCode("");
    setCustomerSelect("");
    setCustomerSelectList([]);
    setCustomerName("");
    setBillingAddress("");
    setShippingAddress("");
    setInvIssueDate(new Date());
    setDcNo("");
    setAdd1("");
    setAdd2("");
    setAdd3("");
    setAdd4("");
    setGstNo("");
    setPanNo("");
    setDcDate(new Date());
    setModeOfDispach("By Road");
    setVechicleNo("");
    setTransportDate(new Date());
    setTransporterMst("");
    // setTransporterList([]);
    setTransporterGSTIN("");
    setDistanceKMS("");
    setShippingPincode("");
    setToStatecode("");
    setGoodsOrService("G");
    setLabourCharge("N");
    setLabourHeadingRequired("N");
    setReverseCharge("N");
    setSupplyTypeCode("B2B");
    setDispatchFrom("");
    setDispatchFromId("");
    setDispatchAddress("");
    setDispatchList([]);
    setPartNo("");
    setPartNoList([]);
    setRows([]);
    setSelectedRow("");
    setResNoTax("");
    setResNoDuty("");
    setRemarks1("");
    setRemarks2("");
    setRemarks3("");
    setRemarks4("");
    setRemarks5("");
    setDcDetails("");
    setDutyInWords("");
    setTotalInWords("");
    setTotQty("");
    setTaxGsTPayable("");
    setLessDisc("");
    setLessOther("");
    setSubTotal("");
    setPackFrwrd("");
    setTrnsprtCharges("");
    setSubTotl("");
    setInsurane("");
    setCustmrMeterlValue("");
    setAmmortisanCost("");
    setAmtGSTPayble("");
    setCGST("");
    setSGST("");
    setIGST("");
    setUTGST("");
    setTotlGST("");
    // setTCS("");
    setTcsPercentage(0);
    setTCS(0);
    setSurChrgesTCSPercentage("");
    setCessOnTcsPercentage("");
    setSurChrgesTCS("");
    setCessOnTcs("");
    setTotlValues("");
    setRoundOff("");
    setCustomerSid("");
    setCustAddress("");
    setSelectedCustomerName("");
    setCustPoNo("");
    setTransactionType("");
    setModeOfType("");
    setDocketNo("");
    setResonForNoTax("");
    setResonForNoduty("");
    setSelectedItems([{ id: "RDL1" }]);
    setPartNoLabel("");
    setPendingPOList([{ id: "RDL1" }]);
    setSelectedDate(new Date());
    setCgstPercent("");
    setSgstPercent("");
    setIgstPercent("");
    setUtgstPercent("");
    setInvValue("");
    GSTAutoGen({ po: 'ME' }, handleGSTAutoGen, handleGSTAutoGenException);
    MstDispatchShowData(handleDispatchshow, handleDispatchshowException);
  }

  const ExportGstInvoiceSuccess = () => { };

  const ExportGstInvoiceException = () => { };

  const handlePrintClick = (value) => {
    if (value === 'Y') {
      return <LabourChargeInvoice rowData={mainId} />;
    } else {
      return <GstTaxInvoice rowData={mainId} />;
    }
  }

  // UNIQUE CODE MANUAL CHANGE
  // const handleUniqueCodeChange = (e) => {
  //   const newUniqueCode = e.target.value;
  //   const currentYear = autoCode.split('/')[0]; // Get last 2 digits of the year
  //   setInvAutoCode(newUniqueCode);
  //   setAutoCode(`${currentYear}/${newUniqueCode.toString().padStart(6, 0)}`);
  // };
  const handleUniqueCodeChange = (e) => {
    const newUniqueCode = e.target.value;

    // Take first 10 characters from autoCode (or full if less than 10)
    const baseCode = autoCode.slice(0, 10);

    // Pad unique code to the right length (e.g., 2 → 000036)
    const paddedCode = newUniqueCode.toString().padStart(2, '0'); // or use 6 if needed

    // Combine without slash
    const finalCode = `${baseCode.slice(0, baseCode.length - paddedCode.length)}${paddedCode}`;

    // Set new code
    setAutoCode(finalCode);
    setInvAutoCode(newUniqueCode);
  };



  //SEARCH GENERATED GST INVOICE ENTRY
  const handlePOChange = (e) => {
    GetGeneratePoSaleOrderEntry({ type: 'gstInvoice', code: e.target.value }, handleGeneratedPoSucessShow, handleGeneratedPoExceptionShow);
  }

  const handleGeneratedPoSucessShow = (dataObject) => {
    setGeneratedGstLists(dataObject?.data || []);
  }
  const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => {
  }

  const handleGeneratedPoSelect = (selectedValue) => {
    setIsPoView(true)
    if (selectedValue !== null) {
      setMainId(selectedValue.id);
      GstViewing({ id: selectedValue.id }, handleActionSuccess, handleActionException);
    }
  }

  const handleDownloadSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: "Download Success",
    });
  };

  const handleDownloadException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: 'error',
      message: "Failed to download",
    });
  };

  // XL UPLOAD HANDLER
  const handleItemImportSucess = (dataObject) => {
    setSelectedItems(dataObject?.data || [])
    // setUploadLoader(false);
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      setUploadLoader(false)
    }, 2000)
  }

  const handleItemImportException = (errorObject, errorMessage) => {
    // setSelectedItems([{ id: 'RDL1' }]);
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
    setTimeout(() => {
      // setUploadLoader(false);
      // handleClose();
      setUploadLoader(false)
    }, 2000);
  }


  const handleDelete = () => {
    setDeleteDailogOpen(true);
  };

  const handleDeleteSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      setDeleteDailogOpen(false);
    }, 2000);
    setRefreshData(oldValue => !oldValue);
  }

  const handleDeleteException = (errorObject, message) => {
    console.log(message);
    setNotification({
      status: true,
      type: 'error',
      message: message,
    });
  }

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Extracts yyyy-MM-dd
  };

  const handleLoadPendingPOShow = (dataObject) => {
    setCustAllAddressList(dataObject?.data || []);
  }

  const handeLoadPendingPOException = (errorObject, errorMessage) => {

  }
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
                ? "View GST Sales Invoice"
                : isEdit
                  ? "Edit GST Sales Invoice"
                  : "New GST Sales Invoice"}
            </Typography>
            <div style={{ width: '250px', marginRight: '10px' }}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={generatedGstLists}
                fullWidth
                // value={selectedGeneratedPo}
                getOptionLabel={(option) => option.digit || /*selectedGeneratedPo*/''}
                renderInput={(params) => <TextField {...params} label="Search Invoice" onChange={handlePOChange} />}
                onChange={(event, value) => handleGeneratedPoSelect(value)}
                size="small"
                style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
              />
            </div>
          </div>
          <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
            <Grid container padding={1}>
              <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={2.2} lg={2.2} xl={2.2}>
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
                        <MenuItem value="ME">ME</MenuItem>
                        <MenuItem value="S2">S2</MenuItem>
                        {/* <MenuItem value="Store">Store</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                    <MenuItem value="Assembly">Assembly</MenuItem> */}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
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
                        <MenuItem value="Others">Others</MenuItem>
                        <MenuItem value="Assembly">Assembly</MenuItem>
                      </Select>
                    </FormControl>
                    {/* <TextField
                  fullWidth
                  size="small"
                  value={invCode}
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                  disabled={isPOView ? true : false}
                  onChange={(e) => setInvCode(e.target.value)}
                /> */}
                  </Grid>
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
                      inputProps={{ maxLength: 6 }} // Set max length to 5 characters
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={2.2} lg={2.2} xl={2.2}>
                    <TextField
                      fullWidth
                      label="Date"
                      placeholder="Date"
                      variant="outlined"
                      required
                      type="date"
                      size="small"
                      disabled={isPOView || isEdit}
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                      // onChange={(e) => { setDate(e.target.value) }}
                      value={formatDate(selectedDate)}
                      onChange={(e) => setSelectedDate(e.target.value)}

                      max={getCurrentDate()} // Restrict dates greater than today
                      inputProps={{
                        max: getCurrentDate(), // Restrict dates greater than today
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={2.8} lg={2.8} xl={2.8} style={{ display: "flex", alignItems: "center" }}>
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
                    <Tooltip title="Refresh DocNumber">
                      <span>
                        {" "}
                        {/* wrapper to avoid tooltip crash when button is disabled */}
                        <IconButton
                          disabled={isPOView || isEdit}
                          onClick={() => {
                            if (invAutoCode) {
                              GSTAutoGen({ po: 'ME' }, handleGSTAutoGen, handleGSTAutoGenException);
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
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
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
                      onChange={(event, value) => {
                        onCustomerSelectChange(value, event)
                      }}
                      size="small"
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <div>
                        {!isPOView && (
                          <Button
                            size="small"
                            variant="outlined"
                            style={getHighlightStyle("LoadPendingSO", {
                              marginTop: "8px",
                              background: "#002D68",
                              color: "white",
                            })}
                            onClick={() => {
                              setActiveButton("LoadPendingSO");
                              setLoadPendingModalOpen(true);
                              GSTLoadPendingPO({ id: cId, type: invType }, handleLoadPendingPOShow, handeLoadPendingPOException);
                            }}
                          >
                            Load Pending SO
                          </Button>
                        )}

                      </div>
                      <div>
                        {!isPOView && (
                          <Button
                            size="small"
                            variant="outlined"
                            style={getHighlightStyle("LoadPendingDN", {
                              marginTop: "8px",
                              background: invType === "Others" ? "gray" : "#002D68",
                              color: "white",
                            })}
                            disabled={invType === "Others"}
                            onClick={() => {
                              setActiveButton("LoadPendingDN");
                              setLoadPendingDelNote(true);
                            }}
                          >
                            Load Pending Del Note
                          </Button>
                        )}

                      </div>
                    </div>

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
                  <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    {/* {!isPOView && (
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
                    )} */}
                    <TextField
                      fullWidth
                      id="outlined-multiline-static"
                      // label="Dispatch Address"
                      multiline
                      rows={3}
                      disabled={isPOView ? true : false}
                      value={dispatchFrom}
                      readOnly={true}
                      size="small"
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ float: "right" }}>
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
                      disabled={isPOView ? true : false}
                      value={`${selectedCustomerName ? selectedCustomerName : ""
                        }${selectedCustomerName && "\n"}${billingAddress}`}
                      // onChange={handleBillingTextFieldChange}
                      readOnly={true}
                      size="small"
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ float: "right", marginTop: "0px" }} >
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
                      disabled={isPOView ? true : false}
                      // value={shippingAddress}
                      value={`${selectedCustomerName}\n${shippingAddress}`}
                      // onChange={handleShippingTextFieldChange}
                      inputRef={shipToTextFieldRef}
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
                            borderCollapse: "collapse",
                          }}
                        >
                          <tr style={{ borderBottom: "1px solid #ddd" }}>
                            {/* <th
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                fontWeight: "bold",
                              }}
                            >
                              Invoice Issue Date
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
                                type="date"
                                size="small"
                                disabled={isPOView ? true : false}
                                value={formatDate(invIssueDate)}
                                onChange={(e) => {
                                  setInvIssueDate(e.target.value);
                                }}
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
                            </td> */}
                          </tr>
                          <tr style={{ borderBottom: "1px solid #ddd" }}>
                            <th
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                                fontWeight: "bold",
                              }}
                            >
                              Amount For GST Payable
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
                                value={amtGSTPayble}
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
                              style={{
                                border: "1px solid #ddd",
                                padding: "8px",
                              }}
                            >
                              <TextField
                                fullWidth
                                required
                                disabled={isPOView ? true : false}
                                value={displayAllGstTotal}
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
                              TCS Amount
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
                                value={displayAllTcsTotal}
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
                              Inv Value
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
                                value={invValue}
                                disabled={isPOView ? true : false}
                                onChange={(e) => setInvValue(e.target.value)}
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
                                onClick={handleViewMore}
                                style={{
                                  marginLeft: "8px",
                                  height: "30px",
                                  backgroundColor: isModuleLocked ? "gray" : "#002d68",
                                  color: 'white',
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
                                            inputRef={dispatchFromTextFieldRef}
                                            onChange={(e) =>
                                              onDispatchFromChange(e)
                                            }
                                          >
                                            {dispatchList?.map(
                                              (data, index) => {
                                                return (
                                                  <MenuItem
                                                    value={data.dispatchAdd}
                                                    key={index}
                                                  >
                                                    {data.code}
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
                                          // onChange={(e) =>
                                          //   setVechicleNo(e.target.value)
                                          // }
                                          error={vehicleNoError && vechicleNo === ""}
                                          helperText={vehicleNoError && vechicleNo === "" ? "Vehicle Number is required" : ""}
                                          onBlur={() => setVehicleNoError(true)}
                                          onChange={(e) => {
                                            if (e.target.value.length <= 10) {
                                              setVechicleNo(e.target.value);
                                            }
                                            setVehicleNoError(true);
                                          }}
                                          inputProps={{ maxLength: 10 }} // Restricts input length
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
                                          onBlur={() => {
                                            setFocusedField(null)
                                            setTransactionTypeError(true)
                                          }}
                                          value={transactionType}
                                          disabled={isPOView ? true : false}
                                          inputProps={{ maxLength: 1 }}
                                          error={transactionTypeError && transactionType === ""}
                                          helperText={transactionTypeError && transactionType === "" ? "Transaction Type is required" : ""}
                                          onChange={(e) => {
                                            // setTransactionType(e.target.value)
                                            const value = e.target.value;
                                            setTransactionTypeError(false);
                                            if (/^[0-4]?$/.test(value)) { // Allows only one digit (0-4)
                                              setTransactionType(value);
                                            }
                                            if (e.target.value == 2) {
                                              // shipToTextFieldRef.current.focus();
                                              if (shipToTextFieldRef.current) {
                                                shipToTextFieldRef.current.focus();
                                                setNotification({
                                                  status: true,
                                                  type: 'error',
                                                  message: "Change Shipping Address",
                                                });
                                              }
                                            }
                                            if (e.target.value == 3) {
                                              if (dispatchFromTextFieldRef.current) {
                                                dispatchFromTextFieldRef.current.focus();
                                                setNotification({
                                                  status: true,
                                                  type: 'error',
                                                  message: "Change Dispatch Address",
                                                });
                                              }
                                            }
                                            if (e.target.value == 4) {
                                              if (dispatchFromTextFieldRef.current || shipToTextFieldRef.current) {
                                                shipToTextFieldRef.current.focus();
                                                dispatchFromTextFieldRef.current.focus();
                                                setNotification({
                                                  status: true,
                                                  type: 'error',
                                                  message: "Change Shipping And Dispatch Address",
                                                });
                                              }
                                            }
                                          }}
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
                                          onBlur={() => {
                                            setFocusedField(null)
                                            setModeOfTypeError(true)
                                          }}
                                          value={modeOfType}
                                          disabled={isPOView ? true : false}
                                          error={modeOfTypeError && modeOfType === ""}
                                          helperText={modeOfTypeError && modeOfType === "" ? "Mode Of Type is required" : ""}
                                          onChange={(e) => {
                                            setModeOfType(e.target.value)
                                            setModeOfTypeError(false)
                                          }}
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
                                              onTransporterMstChange(e)
                                              transporterList.map((item) => {
                                                if (item.id === e.target.value) {
                                                  setTransporterGSTIN(item.gstin)
                                                }
                                              })
                                            }
                                            }
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
                                          onChange={(e) => {
                                            setDistanceKMS(e.target.value)
                                            setDistanceKMSError(false)
                                          }}
                                          error={distanceKMSError && distanceKMS === ""}
                                          helperText={distanceKMSError && distanceKMS === "" ? "Distance KMS is required" : ""}
                                          onBlur={() => setDistanceKMSError(true)}
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
                                          onChange={(e) => {
                                            setShippingPincode(e.target.value)
                                            setShippingPincodeError(false)
                                          }}
                                          error={shippingPincodeError && shippingPincode === ""}
                                          helperText={shippingPincodeError && shippingPincode === "" ? "Shipping Pincode is required" : ""}
                                          onBlur={() => setShippingPincodeError(true)}
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
                                          onChange={(e) => {
                                            setToStatecode(e.target.value)
                                            setToStatecodeError(false)
                                          }}
                                          error={toStatecodeError && toStatecode === ""}
                                          helperText={toStatecodeError && toStatecode === "" ? "To State Code is required" : ""}
                                          onBlur={() => setToStatecodeError(true)}
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
                                            onChange={(e) => {
                                              onGoordsOrServiceChange(e)
                                              setGoodsOrServiceError(false)
                                            }}
                                            error={goodsOrServiceError && goodsOrService === ""}
                                            helperText={goodsOrServiceError && goodsOrService === "" ? "Goods oR Service is required" : ""}
                                            onBlur={() => setGoodsOrServiceError(true)}
                                          >
                                            <MenuItem value={"G"}>G</MenuItem>
                                            <MenuItem value={"S"}>S</MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                    <Grid container spacing={1.5} padding={1} style={{ marginBottom: '5px' }}>
                                      <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                      >
                                        <Typography variant="h6" gutterBottom >
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
                                            onChange={(e) => {
                                              onLabourHeadingChange(e)
                                              setLabourHeadingRequiredError(false)
                                            }}
                                            error={labourHeadingRequiredError && labourHeadingRequired === ""}
                                            helperText={labourHeadingRequiredError && labourHeadingRequired === "" ? "Labour Charges Heading is required" : ""}
                                            onBlur={() => setLabourHeadingRequiredError(true)}
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
                                            onChange={(e) => {
                                              onSupplyTypeChange(e)
                                              setSupplyTypeCodeError(false)
                                            }}
                                            error={supplyTypeCodeError && supplyTypeCode === ""}
                                            helperText={supplyTypeCodeError && supplyTypeCode === "" ? "Supply Type Code is required" : ""}
                                            onBlur={() => setSupplyTypeCodeError(true)}
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
                                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                                        <FormControl fullWidth>
                                          <InputLabel id="demo-simple-select-label">
                                            DC Selection Required
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={dcSelectionRequired}
                                            size="small"
                                            label="DC Selection Required"
                                            placeholder="DC Selection Required"
                                            disabled={isPOView ? true : false}
                                            onChange={(e) => {
                                              setDcSelectionRequired(e.target.value)
                                            }}
                                          >
                                            <MenuItem value={"Y"}>
                                              Y
                                            </MenuItem>
                                            <MenuItem value={"N"}>
                                              N
                                            </MenuItem>
                                          </Select>
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                    <Grid container spacing={1.5} padding={1} style={{ marginBottom: '5px' }}>
                                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                        <Typography variant="h6" gutterBottom >
                                          DC Details
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
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
                                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
                                        <TextField
                                          fullWidth
                                          variant="outlined"
                                          label="DC Date"
                                          placeholder="DC Date"
                                          required
                                          type="date"
                                          size="small"
                                          disabled={isPOView ? true : false || isEdit == 'true'}
                                          onChange={(e) => {
                                            setDcDate(e.target.value);
                                          }}
                                          value={formatDate(dcDate)}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={6} md={6} lg={6} xl={6} >
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
                                      <Grid item xs={3} sm={6} md={6} lg={6} xl={6}>
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
                                          // onChange={(e) =>
                                          //   setTotQty(e.target.value)
                                          // }
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
                                          // onChange={(e) =>
                                          //   setTaxGsTPayable(e.target.value)
                                          // }
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
                                          // onChange={(e) =>
                                          //   setSubTotal(e.target.value)
                                          // }
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
                                          // onChange={(e) =>
                                          //   setSubTotl(e.target.value)
                                          // }
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
                                      {state?.toUpperCase() === "KARNATAKA" ? (
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
                                              disabled={isPOView ? true : false}
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
                                              // onChange={(e) =>
                                              //   setCGST(e.target.value)
                                              // }
                                              disabled={isPOView ? true : false}
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
                                              disabled={isPOView ? true : false}
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
                                              // onChange={(e) =>
                                              //   setSGST(e.target.value)
                                              // }
                                              disabled={isPOView ? true : false}
                                            />
                                          </Grid>
                                        </>
                                      ) : null}
                                      {state?.toUpperCase() !== "KARNATAKA" ? (
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
                                            // onChange={(e) =>
                                            //   setIGST(e.target.value)
                                            // }

                                            />
                                          </Grid>
                                        </>
                                      ) : null}
                                      {country?.toUpperCase() !== "INDIA" ? (
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
                                            // onChange={(e) =>
                                            //   setUTGST(e.target.value)
                                            // }

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
                                          // onChange={(e) =>
                                          //   setTotlGST(e.target.value)
                                          // }
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
                                            // value={tcsAmount}
                                            value={tcs}
                                          // onChange={(e) =>
                                          //   setTcsAmount(e.target.value)
                                          // }

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
                                          label="Surcharges on TCS %"
                                          placeholder="Surcharges on TCS"
                                          disabled={isPOView ? true : false}
                                          value={surChrgesTCSPercentage}
                                          onChange={(e) =>
                                            setSurChrgesTCSPercentage(e.target.value)
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
                                          size="small"
                                          label="Surcharges on TCS"
                                          disabled={isPOView ? true : false}
                                          placeholder="Surcharges on TCS"
                                          value={surChrgesTCS}
                                        // onChange={(e) =>
                                        //   setUTGST(e.target.value)
                                        // }

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
                                          label="Cess on TCS %"
                                          placeholder="Cess on TCS %"
                                          disabled={isPOView ? true : false}
                                          value={cessOnTcsPercentage}
                                          onChange={(e) =>
                                            setCessOnTcsPercentage(e.target.value)
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
                                          size="small"
                                          label="Cess on TCS"
                                          disabled={isPOView ? true : false}
                                          placeholder="Cess on TCS"
                                          value={cessOnTcs}
                                        // onChange={(e) =>
                                        //   setUTGST(e.target.value)
                                        // }

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
                                          // onChange={(e) =>
                                          //   setTotlValues(e.target.value)
                                          // }
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
                                          // onChange={(e) =>
                                          //   setRoundOff(e.target.value)
                                          // }
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
                                          // onChange={(e) => setInvValue(e.target.value)}
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
                                          value={numberToWords(Number(invValue))}
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
                                <Button onClick={handleCloseReason} color="primary">
                                  Close
                                </Button>
                              </DialogActions>
                            </Dialog>
                            <Button onClick={handleCloseModal} color="primary">
                              Update
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
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "15px" }}>
                      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", columnGap: "10px", rowGap: "10px", }}>
                        <Button
                          variant="contained"
                          style={getHighlightStyle("New", {
                            width: "100%",
                            background: "#002D68",
                            height: "35px"
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
                          disabled={Number(isEinvoiceGen) === 1 || isModuleLocked}
                          style={getHighlightStyle("Edit", {
                            width: "100%",
                            background: "#002D68",
                            height: "35px"
                          })}
                          onClick={() => {
                            setActiveButton("Edit");
                            setIsPoView(false);
                            setIsEdit(true);
                          }}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="contained"
                          disabled={Number(isEinvoiceGen) === 1 || isModuleLocked}
                          style={getHighlightStyle("Delete", {
                            width: "100%",
                            background: "#002D68",
                            height: "35px"
                          })}
                          onClick={() => {
                            setActiveButton("Delete");
                            handleDelete();
                          }}
                        >
                          Delete
                        </Button>

                        <Button
                          variant="contained"
                          style={getHighlightStyle("Clear", {
                            width: "100%",
                            background: "#002D68",
                            height: "35px"
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
                          style={
                            getHighlightStyle("Download",
                              {
                                width: "100%",
                                background: "#002D68",
                                height: "35px"
                              })}
                          onClick={() => {
                            setActiveButton("Download");
                            ExportGstInvoice(
                              { id: mainId },
                              ExportGstInvoiceSuccess,
                              ExportGstInvoiceException
                            );
                          }}
                          disabled={isModuleLocked}

                        >
                          <FileDownloadIcon />
                        </Button>

                        <Button
                          variant="contained"
                          style={{
                            width: "100%",
                            background: isPOView || isEdit ? "#002D68" : isModuleLocked ? "gray" : '',
                            color: isPOView || isEdit ? "white" : "#000000",
                            height: "35px",
                          }}
                          onClick={() => {
                            setActiveButton("Print");
                            handlePrintClick(labourCharge);
                          }}
                          disabled={isModuleLocked}

                        >
                          {labourCharge === "Y" ?
                            <LabourChargeInvoice rowData={mainId} />
                            :
                            <GstTaxInvoice rowData={mainId} />
                          }
                        </Button>

                        <Button
                          variant="contained"
                          disabled={Number(isEinvoiceGen) === 0 ? true : false || isModuleLocked}
                          style={{
                            width: "100%",
                            background: Number(isEinvoiceGen) === 1 ? "#002D68" : isModuleLocked ? "gray" : '',
                            color: Number(isEinvoiceGen) === 1 ? "white" : "#000000",
                            height: "35px",
                          }}
                        >
                          <EInvoicePdf rowData={mainId} />
                        </Button>

                        {/* NAVIGATION BUTTONS (Highlight Only Color) */}

                        <Button
                          variant="contained"
                          style={
                            getHighlightStyle("First",
                              {
                                width: "100%",
                                background: "#002D68",
                                height: "35px"
                              })}
                          onClick={() => {
                            setActiveButton("First");
                            handleForwardReverse("first", "");
                          }}
                          disabled={isEdit === true}
                        >
                          <FastRewindIcon />
                        </Button>

                        <Button
                          variant="contained"
                          style={getHighlightStyle("Previous", {
                            width: "100%",
                            background: "#002D68",
                            height: "35px"
                          })}
                          onClick={() => {
                            setActiveButton("Previous");
                            handleForwardReverse("reverse", mainId);
                          }}
                          disabled={isEdit === true}

                        >
                          <SkipPreviousIcon />
                        </Button>

                        <Button
                          variant="contained"
                          style={getHighlightStyle("Next", {
                            width: "100%",
                            background: "#002D68",
                            height: "35px"
                          })}
                          onClick={() => {
                            setActiveButton("Next");
                            handleForwardReverse("forward", mainId);
                          }}
                          disabled={isEdit === true}

                        >
                          <SkipNextIcon />
                        </Button>

                        <Button
                          variant="contained"
                          style={getHighlightStyle("Last", {
                            width: "100%",
                            background: "#002D68",
                            height: "35px"
                          })}
                          onClick={() => {
                            setActiveButton("Last");
                            handleForwardReverse("last", "");
                          }}
                          disabled={isEdit === true}

                        >
                          <FastForwardIcon />

                        </Button>
                        <Button
                          variant="contained"
                          // disabled={!(isPOView || isEdit) || isModuleLocked}
                          style={getHighlightStyle("LoadTemp", {
                            width: "150px",
                            background: "#002D68",
                            height: "35px"
                          })}
                          onClick={() => {
                            setActiveButton("JSON");
                            GstViewing({ id: mainId }, getJsonSuccess, getJsonExceptoin);

                          }}
                        >
                          JSON
                        </Button>
                      </div>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <Button
                          variant="contained"
                          style={getHighlightStyle("LoadTemp", {
                            width: "150px",
                            background: "#002D68",
                            height: "35px"
                          })}
                          onClick={() => {
                            setActiveButton("LoadTemp");
                            setOpenTempManager(true);
                          }}
                          disabled={isModuleLocked}
                        >
                          Load Temp
                        </Button>

                        <Button
                          variant="contained"
                          style={{
                            width: "150px",
                            background: labourCharge === "Y" ? "#002D68" : "gray",
                            color: "white"
                          }}
                          disabled={labourCharge !== "Y" || isModuleLocked}
                          onClick={() => {
                            setActiveButton("DCSelection");
                            handleDcSelectionClick();
                          }}
                        >
                          DC Selection
                        </Button>

                        <Button
                          variant="contained"
                          style={getHighlightStyle("MultiPrint", { height: "35px", background: "#002D68" })}
                          onClick={() => {
                            setActiveButton("MultiPrint");
                            navigate("/SalesReportMultiPrint");
                          }}
                          disabled={isModuleLocked}
                        >
                          Multi Print
                        </Button>

                        <Button
                          variant="contained"
                          style={getHighlightStyle("Template", { height: "35px", background: "#002D68" })}
                          onClick={() => {
                            setActiveButton("Template");
                            DownloadGstSaleInvoiceTemplate(handleDownloadSuccess, handleDownloadException);
                          }}
                          disabled={isModuleLocked}
                        >
                          Template
                        </Button>

                        {/* Upload Button stays same, only highlight on click */}
                        <Button
                          variant="contained"
                          component="label"
                          htmlFor="upload-photo"
                          style={getHighlightStyle("Upload", { background: "#002D68", height: "35px" })}
                          disabled={uploadLoader || isModuleLocked}
                          onClick={() => setActiveButton("Upload")}
                        >
                          {uploadLoader ? (
                            <CircularProgress size={24} style={{ color: "white" }} />
                          ) : "Upload File"}
                        </Button>

                        <input id="upload-photo" type="file" style={{ display: "none" }} />

                        <Button
                          variant="contained"
                          type="submit"
                          style={getHighlightStyle("Save", { height: "35px", background: "#002D68" })}
                          disabled={loading || isModuleLocked}
                          onClick={() => setActiveButton("Save")}
                        >
                          {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : (isEdit ? "UPDATE" : "SAVE")}
                        </Button>
                      </div>

                    </div>
                    {/* <table id="customers"> */}
                    <div style={{ maxHeight: "450px", overflowY: "auto" }}>
                      <table id="customers" >

                        <thead>
                          <tr>
                            <th>Part No</th>
                            <th>Part Name</th>
                            <th>UOM</th>
                            <th>PO NO</th>
                            <th>SO NO</th>
                            <th>SO Qty</th>
                            <th>Cum Qty</th>
                            <th>Pend Qty</th>
                            <th>HSN Code</th>
                            <th>Sch Date</th>
                            <th>INV Qty</th>
                            <th>INV Rate</th>
                            <th>INV Amt</th>
                            <th>Item Ledger</th>
                            <th>Desc of Package</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingPOList.length > 1
                            ? pendingPOList.map((item, index) => (
                              <tr key={index}>
                                <td contentEditable={false} onBlur={handleEdit1}>
                                  {item.itemCode ? (
                                    <span>{item.itemCode}</span>
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
                                <td contentEditable={false}>
                                  {item.itemName}
                                </td>
                                <td contentEditable={false}>
                                  {item.uom}
                                </td>
                                <td contentEditable={false}>
                                  {item.poNo}
                                </td>
                                <td contentEditable={false}>
                                  {item.soNo}
                                </td>
                                <td contentEditable={false}>
                                  {item.Qty}
                                </td>
                                <td contentEditable={false}>
                                  {item.cumQty}
                                </td>
                                <td contentEditable={false}>
                                  {item.pendQty}
                                </td>
                                <td contentEditable={false}>
                                  {item.hsnCode}
                                </td>
                                <td contentEditable={false}>
                                  {item.schDate}
                                </td>
                                <td
                                  contentEditable={!isPOView ? true : false}
                                  onBlur={(e) =>
                                    handleEditPendingPo(
                                      "invQty",
                                      e.target.textContent,
                                      item.id,
                                      item
                                    )
                                  }
                                >
                                  {item.invQty}
                                </td>
                                {/* <td contentEditable={!isPOView ? true : false}>
                                  {item.invQty}
                                </td> */}
                                <td contentEditable={false}>
                                  {item.stdRate}
                                </td>
                                <td contentEditable={false}>
                                  {item.amt}
                                </td>
                                <td contentEditable={false}>
                                  {item.itemLedger}
                                </td>
                                <td
                                  contentEditable={!isPOView ? true : false}
                                  onBlur={(e) =>
                                    handleEditPendingPo(
                                      "descOfPackage",
                                      e.target.textContent,
                                      item.id,
                                      item
                                    )
                                  }
                                >
                                  {item.descOfPackage}
                                </td>
                                <td
                                  contentEditable={!isPOView ? true : false}
                                  style={{ textAlign: "center" }}
                                >
                                  {item.id === "RDL1" ? null : (
                                    <DeleteIcon
                                      onClick={() => {
                                        handlePendingPoDeleteRow(item.id);
                                      }}
                                      style={{
                                        color: "black",
                                        cursor: "pointer",
                                      }}
                                    />
                                  )}
                                </td>
                              </tr>
                            ))
                            : selectedItems.map((item, index) => (
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
                                <td contentEditable={false}>
                                  {item.itemName}
                                </td>
                                <td contentEditable={false}>
                                  {item.uom}
                                </td>
                                <td contentEditable={false}>
                                  {item.poNo}
                                </td>
                                <td contentEditable={false}>
                                  {item.soNo}
                                </td>
                                <td contentEditable={false}>
                                  {item.Qty}
                                </td>
                                <td contentEditable={false}>
                                  {item.cumQty}
                                </td>
                                <td contentEditable={false}>
                                  {item.pendQty}
                                </td>
                                <td contentEditable={false}>
                                  {item.hsnCode}
                                </td>
                                <td contentEditable={false}>
                                  {item.schDate}
                                </td>
                                <td
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
                                </td>
                                <td contentEditable={false}>
                                  {item.stdRate}
                                </td>
                                <td contentEditable={false}>
                                  {item.amt}
                                </td>
                                <td contentEditable={false}>
                                  {item.itemLedger}
                                </td>
                                <td
                                  contentEditable={!isPOView ? true : false}
                                  onBlur={(e) =>
                                    handleEdit(
                                      "descOfPackage",
                                      e.target.textContent,
                                      item.id,
                                      item
                                    )
                                  }
                                >
                                  {item.descOfPackage}
                                </td>
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
            setShippingAddress={setShippingAddress}
            selectedChangeAddress={selectedChangeAddress}
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
            invType={invType}
            setVechicleNo={setVechicleNo}


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
            setVechicleNo={setVechicleNo}
          />

          <NotificationBar
            handleClose={handleClose}
            notificationContent={openNotification.message}
            openNotification={openNotification.status}
            type={openNotification.type}
          />

          {/* ⭐ Temp Manager Dialog */}
          {/* <Dialog open={openTempManager} onClose={() => setOpenTempManager(false)} maxWidth="sm" fullWidth>
            <DialogTitle style={{ background: '#002D68', color: 'white', fontWeight: 'bold' }}>
              Temporary Saved Invoices
            </DialogTitle>

            <DialogContent style={{ padding: '16px' }}>
              {tempList.length === 0 && (
                <p style={{ color: '#666', fontStyle: 'italic' }}>No Temp Invoice saved.</p>
              )}

              {tempList.map((temp) => (
                <div
                  key={temp.key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    backgroundColor: "#f9f9f9"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <b>Invoice No:</b> {temp.poNo}<br />
                    <b>Customer:</b> {temp.supplierName}<br />
                    <b>Items:</b> {temp.items}<br />
                    <small style={{ color: '#999' }}>
                      {new Date(temp.createdAt).toLocaleString()}
                    </small>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexDirection: 'column' }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => restoreSpecificTemp(temp.key)}
                      style={{ background: '#002D68', color: 'white', whiteSpace: 'nowrap' }}
                    >
                      Load
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => deleteSpecificTemp(temp.key)}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenTempManager(false)} style={{ color: '#002D68' }}>
                Close
              </Button>
            </DialogActions>
          </Dialog> */}
          <Dialog open={openTempManager} onClose={() => setOpenTempManager(false)} maxWidth="sm" fullWidth>
            <DialogTitle style={{ background: '#002D68', color: 'white', fontWeight: 'bold' }}>
              Temporary Saved Invoices
            </DialogTitle>

            <DialogContent>
              {tempList.length === 0 && <p style={{ color: "#777" }}>No temporary invoices found.</p>}

              {tempList.map(temp => (
                <div key={temp.key} style={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "10px",
                  marginBottom: "8px",
                  background: "#f5f5f5"
                }}>
                  <b>Invoice:</b> {temp.poNo}<br />
                  <b>Customer:</b> {temp.supplierName}<br />
                  <b>Items:</b> {temp.items}<br />
                  <small style={{ color: "#888" }}>{new Date(temp.createdAt).toLocaleString()}</small>

                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <Button variant="contained" onClick={() => restoreSpecificTemp(temp.key)} style={{ background: "#002D68", color: "#fff" }}>
                      Load
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => deleteSpecificTemp(temp.key)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setOpenTempManager(false)} style={{ color: "#002D68" }}>Close</Button>
            </DialogActions>
          </Dialog>

        </div >
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
      <DeleteConfirmationDailog
        open={deleteDailogOpen}
        setOpen={setDeleteDailogOpen}
        deleteId={mainId}
        deleteService={GSTInvDelete}
        handleSuccess={handleDeleteSuccess}
        handleException={handleDeleteException}
      />
    </>
  );
};

export default NewGstInvoice;

