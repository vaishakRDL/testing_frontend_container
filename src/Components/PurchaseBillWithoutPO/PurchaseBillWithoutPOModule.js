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
  LinearProgress,
  Popper,
  CircularProgress,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { Card } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { DataGrid } from "@mui/x-data-grid";
import { CheckBox } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import {
  GetPurchaseBillSuppList,
  GetPurchaseBillSuppListItemList,
  PurchaseBillWithoutPoFormSubmit,
  getPurchaseBillDetails,
  GetWithoutPOBillUniqueID,
  GetWithoutPoSuppList,
  GetWithoutPoItemLists,
  GenarateWithoutPoGrnNumber,
  PurchaseBillWithoutPOPreview,
  UpdatePurchaseBillWithoutPO,
  PurchaseBillWithoutPOXLUpload,
  PurchaseBillWithoutPoPreview,
  GetGeneratedPo,
  genarateGrnNumber,
  DeletePurchaseBillWithoutPO,
  GetPOBillUniqueID,
  CheckValidSuppInvNo,
  PurchaseBillShortClose,
  PurchaseBillWithoutShortClose,
} from "../../ApiService/LoginPageService";
import "../../App.css";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { PurchaseBillWithoutPOTemplate } from "../../ApiService/DownloadCsvReportsService";
import ApplicationStore from "../../Utility/localStorageUtil";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import LotEntryModal from "../PurchaseBillAgainstPO/LotEntryModal/LotEntryModal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import SummarizeIcon from "@mui/icons-material/Summarize";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import InwardQualityFPIResult from "../PurchaseBillAgainstPO/InwardQualityFPI/InwardQualityFPIResult";
import MultiFileViewer from "../ProcessInspection/MultiFileViewer";
import JobworkReceiptModal from "../PurchaseBillAgainstPO/JobworkReceiptModal/JobworkReceiptModal";
import JobWorkWithoutPoModal from "../PurchaseBillAgainstPO/JobworkReceiptModal/JobWorkWithoutPoModal";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useModuleLocks } from "../context/ModuleLockContext";

const PurchaseBillWithoutPOModule = ({
  open,
  setOpen,
  isAddButton,
  editeData,
  setRefreshData,
}) => {
  const { userDetails } = ApplicationStore().getStorage("userDetails");
  const userPermission = userDetails?.groupRights?.filter(
    (data) => data?.menu?.toLowerCase() === "purchasebillwithoutpo"
  );

  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Purchase Bill Without PO")?.lockStatus === "locked";

  const navigate = useNavigate();

  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [jobWorkReceipt, setJobWorkReceipt] = useState(false);
  const [jobWorkReceiptModal, setJobWorkReceiptModal] = useState(false);
  const [isAccountable, setIsAccountable] = useState(true);
  const [rowId, setRowId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [suppplierList, setSupplierList] = useState([]);
  const [digit, setDigit] = useState("");
  const [getPoNumber, setGetPoNumber] = useState("");
  const [poType, setPoType] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [grnRefNo, setGrnRefNo] = useState("");
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState("");
  const [supplierInvoiceDate, setSupplierInvoiceDate] = useState("");
  const [cSupplierDcNo, setCSupplierDcNumber] = useState("");
  const [supplierDcDate, setSupplierDcDate] = useState("");
  const [irNo, setIrNo] = useState("");
  const [carNo, setCarNo] = useState("");
  const [binNo, setBinNo] = useState("");
  const [exgRate, setExgRate] = useState(1);
  const [currency, setCurrency] = useState("");
  const [currencyId, setCurrencyId] = useState("");
  const [gstType, setGstType] = useState("CGST/SGST");
  const [remarks, setRemarks] = useState("");
  const [qcAuthorise, setQcAuthorise] = useState("");
  const [qcAuthoriseBy, setQcAuthoriseBy] = useState("");
  const [qcAuthoriseDate, setQcAuthoriseDate] = useState("");
  const [qcRemarks, setQcRemarks] = useState("");
  const [totalQty, setTotalQty] = useState("");
  const [grossAmount, setGrossAmount] = useState("");
  const [lessDiscount, setLessDiscount] = useState("");
  const [transport, setTransport] = useState("");
  const [coolie, setCoolie] = useState("");
  const [subTotal, setSubTotal] = useState("");
  const [supplierItemList, setSupplierItemList] = useState([]);
  const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
  const [pendingPOModalOpen, setPendingPOModalOpen] = useState(false);
  const [supplierSid, setSupplierSid] = useState("");
  const [supplierSelect, setSupplierSelect] = useState("");
  const [cgst, setCGST] = useState("");
  const [cgstPercent, setCGSTPercent] = useState("");
  const [sgst, setSGST] = useState("");
  const [sgstPercent, setSGSTPercent] = useState("");
  const [igst, setIGST] = useState("");
  const [igstPercent, setIGSTPercent] = useState("");
  const [utgst, setUTGST] = useState("");
  const [utgstPercent, setUTGSTPercent] = useState("");
  const [total, setTotal] = useState("");
  const [tds, setTDS] = useState("");
  const [tdsPercent, setTDSPercent] = useState("");
  const [tcs, setTCS] = useState("");
  const [tcsPercent, setTCSPercent] = useState("");
  const [others, setOthers] = useState("");
  const [grandTotal, setGrandTotal] = useState("");
  const [poSupplierData, setPoSupplierData] = useState([]);
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [supplierSate, setSupplierState] = useState("");
  const [supplierCountry, setSupplierCountry] = useState("");
  const [supId, setSupId] = useState("");
  console.log("selectedFile", selectedFile);
  //FOR INTERNATIONAL
  const [boeNo, setBOENo] = useState("");
  const [boeDate, setBOEDate] = useState("");
  const [packingListNo, setPackingListNo] = useState("");
  const [packingDate, setPackingDate] = useState("");
  const [grossAmountINR, setGrossAmountINR] = useState("");
  const [miscCharges, setMiscCharges] = useState("");
  const [subTotalGrsAndMisc, setSubTotalGrsAndMisc] = useState("");
  const [insurance, setInsurance] = useState("");
  const [insurancePercent, setInsurancePercent] = useState("");
  const [freight, setFreight] = useState("");
  const [subTotalINSAndFreight, setSubTotalINSAndFreight] = useState("");
  const [bcd, setBCD] = useState("");
  const [bcdPercent, setBCDPercent] = useState("");
  const [socialWelfareCharges, setSocialWelfareCharges] = useState("");
  const [socialWelfareChargesPercent, setSocialWelfareChargesPercent] =
    useState("");
  const [subTotalSwAndBCD, setSubTotalSWAndBCD] = useState("");
  const [importGST, setImportGST] = useState("");
  const [importGSTPercent, setImportGSTPercent] = useState("");
  const [totalWithGST, setTotalWithGST] = useState("");
  const [freightCharges, setFreightCharges] = useState("");
  const [localClearanceCharges, setLocalClearanceCharges] = useState("");
  const [uploadLoader, setUploadLoader] = useState(false);
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [mainId, setMainId] = useState("");
  const [previewQcFlag, setPreviewQcFlag] = useState(0);
  const [viewMoreModal, setViewMoreModal] = useState(false);
  const [selectedGeneratedPo, setSelectedGeneratedPo] = useState("");
  const [generatedPoLists, setGeneratedPoLists] = useState([]);
  const [lotEntryModalOpen, setLotEntryModalOpen] = useState(false);
  const [cellData, setCellData] = useState("");
  const [rowData, setRowData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadFileLoader, setUploadFileLoader] = useState(false);
  const [isProcessInsp, setIsProcessInsp] = useState(false);
  const location = useLocation();
  const [poBillDetailId, setPoBillDetailId] = useState("");
  const [poBillId, setPoBillId] = useState("");
  const [rowItemId, setRowItemId] = useState("");
  const [rowPoNumber, setRowPoNumber] = useState("");
  const [rowAccQty, setRowAccQty] = useState("");
  const [reportRowData, setReportRowData] = useState("");
  const [pdfOpen, setPdfOpen] = useState(false);
  const [selectedRowItemCode, setSelectedRowItemCode] = useState("");
  const [inspectionView, setInspectionView] = useState(false);
  const [supplierSelectCopy, setSupplierSelectCopy] = useState('');
  const [supplierDcDateCopy, setSupplierDcDateCopy] = useState('');
  const [cSupplierDcNoCopy, setCSupplierDcNumberCopy] = useState('');
  const [supplierInvoiceDateCopy, setSupplierInvoiceDateCopy] = useState('');
  const [supplierInvoiceNoCopy, setSupplierInvoiceNoCopy] = useState('');
  const [billingAddressCopy, setBillingAddressCopy] = useState('');
  const [supplierIdCopy, setSupplierIdCopy] = useState('');
  const [selectedRowIds, setSelectedRowIds] = React.useState([]);


  const selectName = new URLSearchParams(location.search).get("selectName");
  const selectId = new URLSearchParams(location.search).get("selectId");
  const selectPotype = new URLSearchParams(location.search).get("selectPotype");
  const selectdigit = new URLSearchParams(location.search).get("selectdigit");
  const selectPo = new URLSearchParams(location.search).get("selectPo");
  const selectspAddress = new URLSearchParams(location.search).get(
    "selectspAddress"
  );
  // const selectaccountable = new URLSearchParams(location.search).get(
  //   "selectaccountable"
  // );
  const selectsupId = new URLSearchParams(location.search).get("selectsupId");

  // WITHOUT PO ROUTE DATA
  // const isView = new URLSearchParams(location.search).get('isView');
  const PBNo = new URLSearchParams(location.search).get("PBNo");
  const qcApproval = new URLSearchParams(location.search).get("qcApproval");
  const isQcApprovalFlag = new URLSearchParams(location.search).get(
    "isQcApprovalFlag"
  );
  const isType = new URLSearchParams(location.search).get("isType");

  const [searchParams] = useSearchParams();
  const qualityWithoutPOModuleView = searchParams.get("qualityWithoutPOModuleView") === "true";
  //FC EDIT
  // const isEdit = new URLSearchParams(location.search).get('isEdit');

  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    // Add event listener to update height on resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // !isView && GenarateWithoutPoGrnNumber(handleGrnSucess, handleGrnException)

    if (isView || isEdit || isQcApprovalFlag) {
      PurchaseBillWithoutPOPreview(
        { digit: PBNo, prefix: poType || isType },
        handlePOBillPreviewSuccess,
        handlePOBillPreviewException
      );
    }

    if (selectdigit) {
      setSupplierSelect(selectName);
      setPoType(selectPotype);
      setDigit(selectdigit);
      setGetPoNumber(selectPo);
      setBillingAddress(selectspAddress);
      setSupplierSid(selectsupId);
      // setIsAccountable(selectaccountable === "true" ? true : false);
    }
    loaderData();

    if (!isQcApprovalFlag) {
      handleForwardReverse("last", "");
    }
  }, [editeData, selectdigit]);

  // POBILL PREVIEW
  const handlePOBillPreviewSuccess = (dataObject) => {
    const data = dataObject.data[0];
    setSupplierSelectCopy(data?.suppName || '');
    setBillingAddressCopy(data?.spAddress || '');

    setSupplierInvoiceNo(data?.suppInvNo || '');
    setSupplierInvoiceDateCopy(data?.suppInvoiceDate || '');
    setSupplierInvoiceNoCopy(data?.suppInvNo || '');
    setSupplierIdCopy(data?.supId || '');
    setCSupplierDcNumberCopy(data?.csSuppDcNo || '');
    setSupplierDcDateCopy(data?.suppDcDate || '');

    setPoType(data?.type || "");
    setDigit(data?.digit || "");
    setGetPoNumber(data?.poNo || "");
    setSupplierSelect(data?.suppName || "");
    setSelectedDate(data?.date || "");
    setBillingAddress(data?.spAddress || "");
    setGrnRefNo(data?.grnRefNO || "");
    setSupplierInvoiceNo(data?.suppInvNo || "");
    setSupplierInvoiceDate(data?.suppInvoiceDate || "");
    setSupplierCountry(data?.country || "");
    setSupplierState(data?.state || "");
    setCSupplierDcNumber(data?.csSuppDcNo || "");
    setSupplierDcDate(data?.suppDcRate || "");
    setIrNo(data?.irNo || "");
    setCarNo(data?.carNo || "");
    setBinNo(data?.binNo || "");
    setExgRate(data?.exgRate || "");
    setCurrency(data?.currency || "");
    setCurrencyId(data?.currencyId || "");
    setGstType(data?.gstType || "");
    //QC FIELDS
    setRemarks(data?.remarks || "");
    setQcAuthorise(data?.qcAuthorize || "");
    setQcAuthoriseBy(data?.qcAuthorizeBy || "");
    setQcAuthoriseDate(data?.qcAuthorizeDate || "");
    setQcRemarks(data?.qcRemarks || "");
    //AMOUNT FIELDS
    setTotalQty(data?.totalQty || "");
    setGrossAmount(data?.grossAmount || "");
    setLessDiscount(data?.lessDiscount || "");
    setTransport(data?.transport || "");
    setCoolie(data?.coolie || "");
    setSubTotal(data?.subTotal || "");
    setCGST(data?.cgst || "");
    setIGST(data?.igst)
    setIGSTPercent(data?.igstPer)
    setCGSTPercent(data?.cgstPer || "");
    setSGST(data?.sgst || "");
    setSGSTPercent(data?.sgstPer || "");
    setUTGST(data?.utgst || "");
    setUTGSTPercent(data?.utgstPer || "");
    setTDS(data?.tds || "");
    setTDSPercent(data?.tdsPer || "");
    setTCS(data?.tcs || "");
    setTCSPercent(data?.tcsPer || "");
    setOthers(data?.others || "");
    setIsAccountable(data?.accountable || false);
    setSelectedItems(dataObject.data || []);
  };
  const handlePOBillPreviewException = () => { };

  // GRN HANDLER
  const handleGrnSucess = (dataObject) => {
    setGrnRefNo(dataObject?.grnRefNO || []);
  };
  const handleGrnException = () => { };

  // CALLED WHILE COMING FROM -PURCHASE ORDER VIEW
  const handleBillDetailSuccess = (dataObject) => {
    setPoSupplierData(dataObject?.data || []);
    GetPurchaseBillSuppListItemList(
      { poDigit: selectdigit },
      handlePurchaseBillSupItemSuccess,
      handlePurchaseBillSupItemFail
    );
  };

  const handleBillDetailFailed = (errorObject, errorMessage) => { };

  //SUPPLIER LIST API PART
  const handleSupplierListSuccess = (dataObject) => {
    setSupplierList(dataObject?.data || []);
  };

  const handleSupplierListFailed = (errorObject, errorMessage) => { };

  // GETTING SUPPLIER ITEM ON AUTOCOMPLETE CHANGE
  const handleSupplierSearchItemChange = (value) => {
    if (value !== null) {
      setCurrency(value?.currency);
      setCurrencyId(value?.currencyId);
      setBillingAddress(value?.spAddress);
      setSupplierSid(value?.supId);
      setSupplierSelect(value?.label);
      setSupplierId(value?.spTabId);
      setSupplierCountry(value?.country || "");
      setSupplierState(value?.state || "");
      setSupId(value.id);
    }
  };

  //FORM SUBMIT FUNCTION
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedSelectedArray =
      selectedItems.length > 1 ? selectedItems.slice(0, -1) : selectedItems;
    const updatedArray = updatedSelectedArray.map((obj) => ({
      ...obj,
      poNo: poType,
      digit: digit,
      date: selectedDate,
      digitString: getPoNumber,
      spAddress: billingAddress,
      approve: isQcApprovalFlag === "true" ? 1 : qcApproval,
      //FILE
      // file: selectedFile,
      //TABLE DATA
      supId: supId,
      grnRefNO: getPoNumber,
      suppInvNo: supplierInvoiceNo,
      suppInvoiceDate: supplierInvoiceDate,
      csSuppDcNo: cSupplierDcNo,
      suppDcRate: supplierDcDate,
      irNo: irNo,
      carNo: carNo,
      binNo: binNo,
      exgRate: exgRate,
      currencyId: currency,
      gstType: gstType,
      remarks: remarks,
      qcAuthorize: qcAuthorise,
      qcAuthorizeBy: isQcApprovalFlag === "true" ? userDetails?.userName : "",
      qcAuthorizeDate: qcAuthoriseDate,
      qcRemarks: qcRemarks,
      totalQty: totalQty,
      grossAmount: grossAmount,
      lessDiscount: lessDiscount,
      transport: transport,
      coolie: coolie,
      subTotal: subTotal,
      cgst: cgst,
      cgstPer: cgstPercent,
      sgst: sgst,
      sgstPer: sgstPercent,
      igst: igst,
      igstPer: igstPercent,
      utgst: utgst,
      utgstPer: utgstPercent,
      total: total,
      tds: tds,
      tdsPer: tdsPercent,
      tcs: tcs,
      tcsPer: tcsPercent,
      others: others,
      grandTotal: grandTotal,
      //FOR INTERNATIONAL
      boeNo: boeNo,
      boeDate: boeDate,
      packingListNo: packingListNo,
      packingDate: packingDate,
      grossAmountINR: grossAmountINR,
      miscCharges: miscCharges,
      subTotalGrsAndMisc: subTotalGrsAndMisc,
      insurance: insurance,
      insurancePer: insurancePercent,
      freight: freight,
      subTotalINSAndFreight: subTotalINSAndFreight,
      bcd: bcd,
      bcdPer: bcdPercent,
      socialWelfareCharges: socialWelfareCharges,
      swcPer: socialWelfareChargesPercent,
      subTotalSwAndBCD: subTotalSwAndBCD,
      importGST: importGST,
      totalWithGST: totalWithGST,
      freightCharges: freightCharges,
      localClearanceCharges: localClearanceCharges,
      accountable: isAccountable,
      //INTERNATIONAL ENDS HERE
    }));
    // if (!supplierInvoiceNo || grnRefNo || gstType || cgstPercent || cgst || sgstPercent
    //     || sgst || igstPercent || igst || utgstPercent || utgst || tcsPercent || tcs) {

    //     console.log("Missing required fields!");
    //     setNotification({
    //         status: true,
    //         type: 'error',
    //         message: 'Please fill the required fields',
    //     });
    //     return;
    // }

    // PREVIOUS CODE

    // if (
    //     !supplierInvoiceNo ||
    //     grnRefNo === "" || // Ensuring grnRefNo is not empty (but can be 0)
    //     !supplierInvoiceDate ||
    //     (poType === 'J' && (!supplierDcDate || !cSupplierDcNo)) ||
    //     // !gstType ||
    //     // (gstType === 'CGST/SGST' && (!cgstPercent || !sgstPercent))
    //     // ||
    //     // (gstType === 'IGST' && (!igstPercent || !utgstPercent))
    //     Number(grnRefNo) === 0
    // ) {
    //     console.log("Missing required fields!");
    //     setNotification({
    //         status: true,
    //         type: 'error',
    //         message: 'Please fill the required fields',
    //     });
    //     return;
    // }

    if (!supplierInvoiceNo) {
      setNotification({
        status: true,
        type: "error",
        message: "Supplier Invoice No is required",
      });
      return;
    }

    // if (grnRefNo === "") {
    //   setNotification({
    //     status: true,
    //     type: "error",
    //     message: "GRN Reference No is required",
    //   });
    //   return;
    // }

    if (!supplierInvoiceDate) {
      setNotification({
        status: true,
        type: "error",
        message: "Supplier Invoice Date is required",
      });
      return;
    }

    // if (poType === "J" && (!supplierDcDate || !cSupplierDcNo)) {
    //   setNotification({
    //     status: true,
    //     type: "error",
    //     message: "Supplier DC Date and Number are required for PO Type J",
    //   });
    //   return;
    // }
    if (
      poType === "J" &&
      supplierCountry.toUpperCase() === "INDIA" &&
      (!supplierDcDate || !cSupplierDcNo)
    ) {
      setNotification({
        status: true,
        type: "error",
        message: "Supplier DC Date and Number are required for PO Type J",
      });
      return;
    }

    // if (Number(grnRefNo) === 0) {
    //   setNotification({
    //     status: true,
    //     type: "error",
    //     message: "GRN Reference No cannot be 0",
    //   });
    //   return;
    // }

    if (isEdit || qcApproval) {
      setLoading(true);
      UpdatePurchaseBillWithoutPO(updatedArray, handleEditOrQcSuccess, handleEditOrQcException);
    } else {
      setLoading(true);
      PurchaseBillWithoutPoFormSubmit(
        updatedArray,
        handleSuccess,
        handleException
      );
    }
  };

  const handleSuccess = (dataObject) => {
    console.log("the dataObject ", dataObject);
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    poType === 'J' && setJobWorkReceiptModal(true);

    setTimeout(() => {
      // ClearData();
      handleClearPage();
      handleClose();
      setLoading(false);
    }, 2000);
  };

  const handleException = (errorObject, errorMessage) => {
    console.log("the error ", errorMessage);
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
      setLoading(false);
    }, 2000);
  };

  const handleEditOrQcSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    poType === 'J' && setJobWorkReceiptModal(true);
    setTimeout(() => {
      ClearData();
      handleClose();
      setLoading(false)
    }, 2000);
  };

  const handleEditOrQcException = (errorObject, errorMessage) => {
    console.log("the error ", errorMessage);
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
    setTimeout(() => {
      // ClearData();
      // handleClose();
      setLoading(false)
    }, 2000);
  };
  const ClearData = () => {
    setSelectedDate("");
    setDigit("");
    setGetPoNumber("");
    setPoType("");
    setSelectedItems([]);
    setBillingAddress("");
    setGrnRefNo("");
    setSupplierSelect("");
    setSelectedItemName("");
    setSupplierInvoiceNo("");
    setSupplierInvoiceDate("");
    setCSupplierDcNumber("");
    setSupplierDcDate("");
    setIrNo("");
    setCarNo("");
    setBinNo("");
    setExgRate("");
    setCurrency("");
    setCurrencyId("");
    setGstType("");
    setRemarks("");
    setQcAuthorise("");
    setQcAuthoriseBy("");
    setQcAuthoriseDate("");
    setQcRemarks("");
    setTotalQty("");
    setGrossAmount("");
    setLessDiscount("");
    setTransport("");
    setCoolie("");
    setSubTotal("");
    setCGST("");
    setCGSTPercent("");
    setSGST("");
    setSGSTPercent("");
    setIGST("");
    setIGSTPercent("");
    setUTGST("");
    setUTGSTPercent("");
    setTotal("");
    setTDS("");
    setTDSPercent("");
    setTCS("");
    setTCSPercent("");
    setOthers("");
    setGrandTotal("");
    setSupplierItemList([]);
    setSelectedFile(null);
    //INTERNATIONAL CLEAR
    setBOENo("");
    setBOEDate("");
    setPackingListNo("");
    setPackingDate("");
    setGrossAmountINR("");
    setMiscCharges("");
    setSubTotalGrsAndMisc("");
    setInsurance("");
    setFreight("");
    setSubTotalINSAndFreight("");
    setBCD("");
    setSocialWelfareCharges("");
    setSubTotalSWAndBCD("");
    setImportGST("");
    setImportGSTPercent("");
    setTotalWithGST("");
    setFreightCharges("");
    setLocalClearanceCharges("");
    setBCDPercent("");
    setInsurancePercent("");
    setSocialWelfareChargesPercent("");
    // INT END
    // setTimeout(() => {
    //     GetPurchaseBillSuppList(handleSupplierListSuccess, handleSupplierListFailed)
    // }, 2000);
  };

  const loaderData = () => {
    setRowId(editeData?.id || "");
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  //MIDDLE GRID
  const middleGridColumns = [
    {
      field: "itemCode",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Part No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "itemName",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Part Name</span>
      ),
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "uom",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>UOM</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "qoh",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>QOH</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "invQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>INV QTY</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "rcvdQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>RCVD QTY</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "accQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>ACC QTY</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "rejQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>REJ QTY</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "pbRate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>PB Rate</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "pbAmt",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>PB Amt</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
    },
    {
      field: "location",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>LOT</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "itemsLedger",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Item Ledger
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "itemRemarks",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Item Remarks
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "lndCost",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>LND Cost</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "lndRate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>LND Rate</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      flex: 1,
      headerClassName: "super-app-theme--header",
      minWidth: 150,
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Actions</span>
      ),
      cellClassName: "actions",
      disableClickEventBubbling: true,
      getActions: (params) => [<DeleteData selectedRow={params.row} />],
    },
  ];

  const handleDeleteRow = (id) => {
    const newArray = selectedItems.filter((item) => item.id !== id);
    setSelectedItems(newArray);
    // TO MINUS THE AMOUNT IN TOTAL_GRID
    calculateTotals(newArray);
  };

  function DeleteData(props) {
    return (
      <DeleteIcon
        onClick={() => {
          handleDeleteRow(props.selectedRow.id);
        }}
        style={{ color: "black" }}
      />
    );
  }

  //PO AND GROSS CALCULATION
  const calculateTotals = (data) => {
    const totalQty = data.reduce(
      (acc, item) => acc + (Number(item.accQty) || 0),
      0
    );
    setTotalQty(totalQty);

    const grossAmount = data.reduce(
      (acc, item) => acc + (Number(item.pbAmt) || 0),
      0
    );
    setGrossAmount(grossAmount);

    return [{ id: 1, totalQty, grossAmount /*amt*/ }];
  };

  // OTHER CALCULATION FUNCTION + AND -
  function calculateTotal(initialAmount, inputValue) {
    if (inputValue === "" || !inputValue) {
      return initialAmount;
    } else {
      if (inputValue[0] !== "+" && inputValue[0] !== "-") {
        // throw new Error('Invalid input format. Expected format: +<number> or -<number>');
        setNotification({
          status: true,
          type: "error",
          message:
            "Invalid input format. Expected format: +<number> or -<number>",
        });
      }
      const [sign, number] = [inputValue[0], parseFloat(inputValue.slice(1))];
      return sign === "+" ? initialAmount + number : initialAmount - number;
    }
  }

  // CALCULATE THE SUB-TOTAL
  // useEffect(() => {
  //     let subTotalAmount = Number(grossAmount) - Number(lessDiscount) + Number(transport) + Number(coolie)
  //     setSubTotal(subTotalAmount);

  //     // CGST CALCULATION
  //     var cgstAmount = (subTotalAmount * cgstPercent) / 100;
  //     setCGST(cgstAmount);

  //     // SGAST CALCULATION
  //     var sgstAmount = (subTotalAmount * sgstPercent) / 100;
  //     setSGST(sgstAmount);

  //     // UTGST CALCULATION
  //     var utgstAmount = (subTotalAmount * utgstPercent) / 100;
  //     setUTGST(utgstAmount);

  //     // IGST CALCULATION
  //     var igstAmount = (subTotalAmount * igstPercent) / 100;
  //     setIGST(igstAmount);

  //     // TOTAL CALCULATION
  //     let totalAmount = Number(subTotalAmount) + Number(cgst) + Number(sgst) + Number(utgst) + Number(igst)
  //     setTotal(Math.round(totalAmount));

  //     // TDS CALCULATION
  //     var tdsAmount = (totalAmount * tdsPercent) / 100;
  //     setTDS(tdsAmount)

  //     //TCS CALCULATION
  //     var tcsAmount = (totalAmount * tcsPercent) / 100;
  //     setTCS(tcsAmount)

  //     // FOR NRI SUPPLIER- GROSS AMOUNT INR
  //     var NriGrossAmountINR = Number(exgRate) * Number(grossAmount) + tcsAmount + igstAmount /*IGST ADDED IN MALLIK FOR CALLCULATION*/
  //     setGrossAmountINR(Math.round(NriGrossAmountINR))

  //     // SUB TOTAL GRS AND MISC
  //     var totalGrsAndMiscValue = Math.round(Number(NriGrossAmountINR) + Number(miscCharges))
  //     setSubTotalGrsAndMisc(totalGrsAndMiscValue)

  //     //SUB TOTAL INS AND FREIGHT
  //     var subTotalInsAndFreight = Number(totalGrsAndMiscValue) + Number(insurance) + Number(freight)
  //     setSubTotalINSAndFreight(subTotalInsAndFreight)

  //     // SUB TOTAL SW AND BCD
  //     var subTotalSwAndBcd = Number(subTotalInsAndFreight) + Number(bcd) + Number(socialWelfareCharges)
  //     setSubTotalSWAndBCD(subTotalSwAndBcd)

  //     //NRI TOTAL WITH IMPORT GST
  //     var importGstValues = (Number(subTotalSwAndBcd) * Number(importGSTPercent)) / 100;
  //     setImportGST(importGstValues)
  //     var importGstTotal = Number(subTotalSwAndBcd) + Number(importGST)
  //     setTotalWithGST(importGstTotal);

  //     // GRAND TOTAL CALCULATION
  //     var allGrandTotalValues = Number(importGstTotal) + Number(freightCharges) + Number(localClearanceCharges)
  //     if (supplierCountry.toUpperCase() !== 'INDIA') {
  //         // IF SUPPLIER FROM OUT OF INDIA
  //         var grandTotalAmount = Number(allGrandTotalValues);
  //         setGrandTotal(parseFloat(grandTotalAmount.toFixed(2)));
  //     } else {
  //         // IF SUPPLIER FROM INDIA
  //         var grandTotalAmount = Number(totalAmount) + Number(tdsAmount) + Number(tcsAmount)/* + Number(others)*/;
  //         const total = calculateTotal(grandTotalAmount, others);
  //         setGrandTotal(parseFloat(total.toFixed(2)));
  //     }

  // }, [lessDiscount, transport, coolie, grossAmount, cgstPercent, sgstPercent, utgstPercent, igstPercent, tdsPercent, tcsPercent, cgst, sgst, utgst, igst, tds, tcs, others, selectedItems, exgRate, miscCharges, insurance, freight, bcd, socialWelfareCharges, importGST, importGSTPercent, freightCharges, localClearanceCharges])

  useEffect(() => {
    let subTotalAmount =
      Number(grossAmount) -
      Number(lessDiscount) +
      Number(transport) +
      Number(coolie);
    setSubTotal(subTotalAmount.toFixed(3));

    // CGST CALCULATION
    var cgstAmount = (subTotalAmount * cgstPercent) / 100;
    setCGST(cgstAmount.toFixed(3));

    // SGST CALCULATION
    var sgstAmount = (subTotalAmount * sgstPercent) / 100;
    setSGST(sgstAmount.toFixed(3));

    // UTGST CALCULATION
    var utgstAmount = (subTotalAmount * utgstPercent) / 100;
    setUTGST(utgstAmount.toFixed(3));

    // IGST CALCULATION
    var igstAmount = (subTotalAmount * igstPercent) / 100;
    setIGST(igstAmount.toFixed(3));

    // TOTAL CALCULATION
    let totalAmount =
      Number(subTotalAmount) +
      Number(cgst) +
      Number(sgst) +
      Number(utgst) +
      Number(igst);
    setTotal(totalAmount.toFixed(3));

    // TDS CALCULATION
    var tdsAmount = (totalAmount * tdsPercent) / 100;
    setTDS(tdsAmount.toFixed(3));

    //TCS CALCULATION
    var tcsAmount = (totalAmount * tcsPercent) / 100;
    setTCS(tcsAmount.toFixed(3));

    // FOR NRI SUPPLIER- GROSS AMOUNT INR
    var NriGrossAmountINR =
      Number(exgRate) * Number(grossAmount) +
      Number(tcsAmount) +
      Number(igstAmount); /*IGST ADDED IN MALLIK FOR CALLCULATION*/
    setGrossAmountINR(NriGrossAmountINR.toFixed(3));

    // SUB TOTAL GRS AND MISC
    var totalGrsAndMiscValue = Math.round(
      Number(NriGrossAmountINR) + Number(miscCharges)
    );
    setSubTotalGrsAndMisc(totalGrsAndMiscValue);

    // INSURANCE CALCULATION
    var insuranceAmount = (totalGrsAndMiscValue * insurancePercent) / 100;
    setInsurance(insuranceAmount);

    //SUB TOTAL INS AND FREIGHT
    // var subTotalInsAndFreight =
    //   Number(totalGrsAndMiscValue) + Number(insuranceAmount) + Number(freight);
    // setSubTotalINSAndFreight(subTotalInsAndFreight);

    // // BCD CALCULATION
    // var bcdAmount = (totalGrsAndMiscValue * bcdPercent) / 100;
    // setBCD(bcdAmount);

    // // SOCIAL WELFARE CHARGES CALCULATION
    // var socialWelfareAmount =
    //   (totalGrsAndMiscValue * socialWelfareChargesPercent) / 100;
    // setSocialWelfareCharges(socialWelfareAmount);
    var subTotalInsAndFreight = Number(totalGrsAndMiscValue) + Number(insuranceAmount) + Number(freight)
    setSubTotalINSAndFreight(parseFloat(subTotalInsAndFreight.toFixed(3)))

    var bcdAmount = (subTotalInsAndFreight * bcdPercent) / 100;
    setBCD(parseFloat(bcdAmount.toFixed(3)));

    // SOCIAL WELFARE CHARGES CALCULATION
    var socialWelfareAmount = (bcdAmount * socialWelfareChargesPercent) / 100;
    setSocialWelfareCharges(parseFloat(socialWelfareAmount.toFixed(3)));
    // SUB TOTAL SW AND BCD
    var subTotalSwAndBcd =
      Number(subTotalInsAndFreight) +
      Number(bcdAmount) +
      Number(socialWelfareAmount);
    setSubTotalSWAndBCD(parseFloat(subTotalSwAndBcd.toFixed(3)));

    //NRI TOTAL WITH IMPORT GST
    var importGstValues =
      (Number(subTotalSwAndBcd) * Number(importGSTPercent)) / 100;
    setImportGST(parseFloat(importGstValues.toFixed(3)));
    var importGstTotal = Number(subTotalSwAndBcd) + Number(importGST);
    setTotalWithGST(parseFloat(importGstTotal.toFixed(3)));

    // GRAND TOTAL CALCULATION
    var allGrandTotalValues =
      Number(importGstTotal) +
      Number(freightCharges) +
      Number(localClearanceCharges);
    if (supplierCountry.toUpperCase() !== "INDIA") {
      // IF SUPPLIER FROM OUT OF INDIA
      // var grandTotalAmount = Number(allGrandTotalValues);
      // setGrandTotal(parseFloat(grandTotalAmount.toFixed(2)));
      var grandTotalAmount = Number(allGrandTotalValues);
      const total = calculateTotal(grandTotalAmount, others);
      setGrandTotal(parseFloat(total.toFixed(3)));
    } else {
      // IF SUPPLIER FROM INDIA
      var grandTotalAmount =
        Number(totalAmount) +
        Number(tdsAmount) +
        Number(tcsAmount); /* + Number(others)*/
      const total = calculateTotal(grandTotalAmount, others);
      setGrandTotal(parseFloat(total.toFixed(3)));
    }

    // OTHERS + AND - CALCULATION
    // const [sign, number] = [others[0], Number(others.slice(1))];
    // const total = sign === '+' ? grandTotal + number : grandTotal - number;
    // const total = others && calculateTotal(grandTotal, others);
    // setGrandTotal(total);
    // console.log("ppppppppppppppppppppppppp", total)
  }, [
    lessDiscount,
    transport,
    coolie,
    grossAmount,
    cgstPercent,
    sgstPercent,
    utgstPercent,
    igstPercent,
    tdsPercent,
    tcsPercent,
    cgst,
    sgst,
    utgst,
    igst,
    tds,
    tcs,
    others,
    selectedItems,
    exgRate,
    miscCharges,
    insurance,
    insurancePercent,
    bcdPercent,
    socialWelfareChargesPercent,
    freight,
    bcd,
    socialWelfareCharges,
    importGST,
    importGSTPercent,
    freightCharges,
    localClearanceCharges,
  ]);

  useEffect(() => {
    calculateTotals(selectedItems);
  }, [selectedItems]);

  const handleItemChange = (e) => {
    GetWithoutPoItemLists(
      { code: e.target.value },
      handleVendorProcessVendorSucessShow,
      handleVendorProcessVendorExceptionShow
    );
  };

  const handleVendorProcessVendorSucessShow = (dataObject) => {
    setSupplierItemList(dataObject?.data || []);
  };
  const handleVendorProcessVendorExceptionShow = (
    errorObject,
    errorMessage
  ) => { };

  // const handleSupplierItemChange = (value) => {
  //     if (value !== null) {
  //         setSelectedItemName(value.itemCode);
  //         setSelectedItems((prevSelectedItems) => [...prevSelectedItems, value]);
  //     }
  // };

  //DATE CONVERT TO TEXTFIELD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // HANDLE CELL EDIT DATA
  const handleCellEdit = (params) => {
    console.log("params", params);
    const updatedList = selectedItems.map((supp) =>
      supp.id === params.id
        ? {
          ...supp,
          qoh: params.qoh,
          cumQty: params.cumQty,
          pendQty: params.pendQty,
          invQty: params.invQty,
          rcvdQty: params.rcvdQty,
          accQty: params.accQty,
          rejQty: params.rejQty,
          pbRate: params.pbRate,
          pbAmt: Number(params.invQty) * Number(params.pbRate),
          lot: params.lot,
          itemLedger: params.itemLedger,
          itemRemarks: params.itemRemarks,
          lndCost: params.lndCost,
          lndRate: params.lndRate,
          schDate: params.schDate,
        }
        : supp
    );
    setSelectedItems(updatedList);
  };

  useEffect(() => {
    const data = poSupplierData[0];
    setSupplierSelect(data?.spName || "");
    setPoType(data?.type || "");
    setDigit(data?.digit || "");
    setGetPoNumber(data?.poNo || "");
    setBillingAddress(data?.spAddress || "");
    setSupplierSid(data?.supId || "");
    setCurrency(data?.currency || "");
    setCurrencyId(data?.currencyId || "");
    setSupplierCountry(data?.country || "");
    setSupplierState(data?.state || "");
  }, [poSupplierData]);

  // PO ENTER ONBLUR API CALL
  const handlePoEnterOnBlur = () => {
    getPurchaseBillDetails(
      { poDigit: digit },
      handlePoEnterOnBlurSuccess,
      handlePoEnterOnBlurFailed
    );
    setSelectedItems([]);
  };

  const handlePoEnterOnBlurFailed = (errorObject, errorMessage) => { };

  const handlePoEnterOnBlurSuccess = (dataObject) => {
    setPoSupplierData(dataObject?.data || []);
    GetPurchaseBillSuppListItemList(
      { poDigit: digit },
      handlePurchaseBillSupItemSuccess,
      handlePurchaseBillSupItemFail
    );
  };

  const handlePurchaseBillSupItemSuccess = (dataObject) => {
    setSupplierItemList(dataObject?.data || []);
  };

  const handlePurchaseBillSupItemFail = (errorObject, errorMessage) => { };

  //PO UNIQUE CODE SUCCESS FAILURE CALLBACK
  const handleGetUniqueCodeSuccess = (dataObject) => {
    setDigit(dataObject?.digit || []);
    setGetPoNumber(dataObject?.id || []);
  };
  const handleGetUniqueCodeException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
  };

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

  // TEMPLATE DOWNLOAD
  const handleTemplateDownload = () => {
    PurchaseBillWithoutPOTemplate(
      handleTemplateDownloadSuccess,
      handleTemplateDownloadFailed
    );
  };
  const handleTemplateDownloadSuccess = () => {
    setNotification({
      status: true,
      type: "success",
      message: "Template Download Success",
    });
    setTimeout(() => {
      handleClose();
    }, 3000);
  };
  const handleTemplateDownloadFailed = () => {
    setNotification({
      status: true,
      type: "error",
      message: "Template failed to download",
    });
    setTimeout(() => {
      // handleClose();
    }, 3000);
  };

  // XL UPLOAD HANDLER
  const handleItemImportSucess = (dataObject) => {
    setSelectedItems([...selectedItems, ...(dataObject?.data || [])]);
    setUploadLoader(false);

    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
      setUploadFileLoader(false);
    }, 2000);
  };

  const handleItemImportException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // setUploadLoader(false);
      // handleClose();
      setUploadFileLoader(false);
    }, 2000);
  };

  // TABLE EDIT CELL
  // OLD CODE
  // const handleEdit = (cellNam, newValue, id, rowData) => {
  //     switch (cellNam) {
  //         case "INVQTY":
  //             const updatedInvQty = selectedItems.map((supp) =>
  //                 supp.id === id && cellNam === 'INVQTY' ?
  //                     { ...supp, invQty: Number(newValue), pbAmt: Number(newValue) * Number(rowData.pbRate), lndCost: Number(100) / Number(rowData.pbRate), accQty: Number(newValue) }
  //                     : supp
  //             )
  //             setSelectedItems(updatedInvQty);
  //             break;
  //         case "RCVQTY":
  //             const updatedRcvQty = selectedItems.map((supp) =>
  //                 supp.id === id && cellNam === 'RCVQTY' ?
  //                     // { ...supp, rcvdQty: Number(newValue), rejQty: Number(rowData.accQty) - Number(newValue) }
  //                     { ...supp, rcvdQty: Number(newValue), rejQty: 0, itemRemarks: `Short Supply ${Number(rowData.invQty) - Number(newValue)}` }
  //                     : supp
  //             )
  //             setSelectedItems(updatedRcvQty);
  //             break;
  //         case "ACCQTY":
  //             const updatedAccQty = selectedItems.map((supp) =>
  //                 supp.id === id && cellNam === 'ACCQTY' ?
  //                     // { ...supp, accQty: Number(newValue), rejQty: Number(newValue) - Number(rowData.rcvdQty) }
  //                     { ...supp, accQty: Number(newValue), rejQty: Number(rowData.rcvdQty) - Number(newValue), pbAmt: Number(newValue) * Number(rowData.pbRate), }
  //                     : supp
  //             )
  //             setSelectedItems(updatedAccQty);
  //             calculateTotals(updatedAccQty);
  //             break;
  //         case "REJQTY":
  //             const updatedRejQty = selectedItems.map((supp) =>
  //                 supp.id === id && cellNam === 'REJQTY' ?
  //                     { ...supp, rejQty: Number(newValue) }
  //                     : supp
  //             )
  //             setSelectedItems(updatedRejQty);
  //             break;
  //         case "PBRATE":
  //             const updatedPbRate = selectedItems.map((supp) =>
  //                 supp.id === id && cellNam === 'PBRATE' ?
  //                     { ...supp, pbRate: Number(newValue), pbAmt: Number(newValue) * Number(rowData.invQty), lndCost: Number(grandTotal) / Number(newValue) }
  //                     : supp
  //             )
  //             setSelectedItems(updatedPbRate);
  //             break;
  //         default:
  //         // code block
  //     }
  // }
  ////////////
  const handleEdit = (cellNam, newValue, id, rowData) => {
    switch (cellNam) {
      case "cumQty":
        const updatedCumQty = selectedItems.map((data) =>
          data.id === id && cellNam === "cumQty"
            ? { ...data, cumQty: newValue }
            : data
        );
        setSelectedItems(updatedCumQty);
        break;
      case "pbRate":
        const updatedPbRate = selectedItems.map((data) =>
          data.id === id && cellNam === "pbRate"
            ? {
              ...data,
              pbRate: newValue,
              pbAmt: Number(rowData.rcvdQty) * Number(newValue),
            }
            : data
        );
        setSelectedItems(updatedPbRate);
        break;
      case "invQty":
        // pendingPo
        // const updatedInvQty = selectedItems.map((data) =>
        //     data.id === id && cellNam === 'invQty' ?
        //         { ...data, invQty: newValue }
        //         : data
        // )
        // setSelectedItems(updatedInvQty);
        // break;

        const updatedInvQty = selectedItems.map((data) => {
          if (data.id === id && cellNam === "invQty") {
            if (Number(newValue) > Number(rowData.pendingPo)) {
              // alert('Invoice Quantity cannot be greater than Pending Quantity');
              setNotification({
                status: true,
                type: "error",
                message:
                  "Invoice Quantity cannot be greater than Pending Quantity",
              });
              return {
                ...data,
                invQty: Number(rowData.pendingPo),
                rcvdQty: Number(rowData.pendingPo),
                accQty: Number(rowData.pendingPo),
              };
            }
            return {
              ...data,
              invQty: newValue,
              rcvdQty: newValue,
              accQty: newValue,
              pbAmt: Number(newValue) * Number(rowData.pbRate),
            };
          }
          return data;
        });

        // const updatedInvQty = [];
        // console.log("Number(newValue)Number(newValue)Number(newValue)",Number(newValue))
        // selectedItems.forEach((data) => {
        //     if (data.id === id && cellNam === 'invQty') {
        //         if (Number(newValue) > Number(rowData.pendingPo)) {
        //             alert('Invoice Quantity cannot be greater than Pending Quantity');
        //             updatedInvQty.push({
        //                 ...data,
        //                 invQty: Number(rowData.pendingPo),
        //                 rcvdQty: Number(rowData.pendingPo),
        //                 accQty: Number(rowData.pendingPo),
        //             });
        //         } else {
        //             updatedInvQty.push({
        //                 ...data,
        //                 invQty: newValue,
        //                 rcvdQty: newValue,
        //                 accQty: newValue,
        //             });
        //         }
        //     } else {
        //         updatedInvQty.push({...data});
        //     }
        // });
        setSelectedItems(updatedInvQty);
        break;

      // case "rcvdQty":
      //     const updatedRcvdQty = selectedItems.map((data) =>
      //         data.id === id && cellNam === 'rcvdQty' ?
      //             {
      //                 ...data,
      //                 rcvdQty: newValue, rejQty: 0,
      //                 itemRemarks: `Short Supply ${rowData.invQty - newValue}`,
      //             }
      //             : data
      //     )
      //     setSelectedItems(updatedRcvdQty);
      //     break;
      case "rcvdQty":
        const updatedRcvdQty = selectedItems.map((data) => {
          if (data.id === id && cellNam === "rcvdQty") {
            if (Number(newValue) > Number(rowData.invQty)) {
              // alert('Received Quantity cannot be greater than Inventory Quantity');
              setNotification({
                status: true,
                type: "error",
                message:
                  "Received Quantity cannot be greater than Inventory Quantity",
              });
              return {
                ...data,
                rcvdQty: rowData.rcvdQty,
                accQty: rowData.accQty,
                rejQty: rowData.rejQty,
                itemRemarks: "", // Reset remarks if needed
                pbAmt: rowData.pbAmt,
              };
            }
            return {
              ...data,
              rcvdQty: newValue,
              accQty: newValue,
              rejQty: 0,
              // itemRemarks: `Short Supply ${rowData.invQty - newValue}`,
              itemRemarks:
                rowData.invQty - newValue === 0
                  ? ""
                  : `Short Supply ${rowData.invQty - newValue}`,
              pbAmt: Number(newValue) * Number(rowData.pbRate),
            };
          }
          return data;
        });
        setSelectedItems(updatedRcvdQty);
        break;
      case "accQty":
        const updatedAccQty = selectedItems.map((data) =>
          data.id === id && cellNam === "accQty"
            ? {
              ...data,
              accQty: newValue,
              rejQty: Number(rowData.rcvdQty) - Number(newValue),
              pbAmt: Number(newValue) * Number(rowData.pbRate),
            }
            : data
        );
        setSelectedItems(updatedAccQty);
        break;
      case "rejQty":
        const updatedRejQty = selectedItems.map((data) => {
          if (data.id === id && cellNam === "rejQty") {
            if (Number(newValue) > Number(rowData.rcvdQty)) {
              // alert('Rejected Quantity cannot be greater than Received Quantity');
              setNotification({
                status: true,
                type: "error",
                message:
                  "Rejected Quantity cannot be greater than Received Quantity",
              });
              return {
                ...data,
                accQty: 0,
                rejQty: 0,
                pbAmt: Number(rowData.pbAmt),
              };
            }
            return {
              ...data,
              accQty: Number(rowData.rcvdQty) - Number(newValue),
              rejQty: newValue,
              pbAmt:
                (Number(rowData.rcvdQty) - Number(newValue)) *
                Number(rowData.pbRate),
              // pbAmt: Number(rowData.pbAmt)
            };
          }
          return data;
        });
        setSelectedItems(updatedRejQty);
        break;
      case "conversionQty":
        const updatedConversionQty = selectedItems.map((data) =>
          data.id === id && cellNam === "conversionQty"
            ? {
              ...data,
              conversionQty: newValue,
              conversionPartId: rowData.conversionPartId  // <-- ensure it stays
            }
            : data
        );
        setSelectedItems(updatedConversionQty);
        break;
      case "hsnCode":
        const updatedHsnCode = selectedItems.map((data) =>
          data.id === id && cellNam === "hsnCode"
            ? { ...data, hsnCode: newValue }
            : data
        );
        setSelectedItems(updatedHsnCode);
        break;
      case "itemRemarks":
        const updatedItemRemarks = selectedItems.map((data) =>
          data.id === id && cellNam === "itemRemarks"
            ? { ...data, itemRemarks: newValue }
            : data
        );
        setSelectedItems(updatedItemRemarks);
        break;
      default:
      // code block
    }
  };

  // ADD ITEMS
  const handleSupplierItemChange = (value) => {
    if (value !== null) {
      // Clone the selectedItems array
      const clonedSelectedItems = [...selectedItems];

      // Remove the last item from the cloned array
      const lastObj = clonedSelectedItems.pop();

      // Add the new value at the end and the removed item back
      clonedSelectedItems.push(value, lastObj);

      // Set the state with the modified array
      setSelectedItems(clonedSelectedItems);
      // setSearchedItemValue();
    }
  };

  // LND COST AND LND RATE CALCULATION
  useEffect(() => {
    const result = selectedItems.map((item) => ({
      ...item,
      lndCost: Math.round(Number(grandTotal) / Number(item.pbRate)),
      lndRate: Math.round(Number(grandTotal) / Number(item.invQty)),
    }));
    setSelectedItems(result);
  }, [grandTotal, exgRate]);

  //PURCHASE BILL FORWARD REVERSE
  // HANDLE FORWARD REVERSE HANDLER
  const handleForwardReverse = (type, id) => {
    PurchaseBillWithoutPoPreview(
      { type: type, id: id, prefix: poType },
      handleActionSuccess,
      handleActionException
    );
  };

  // CONVERT DATE TO ISO FORMATE
  function convertToISO(dateStr) {
    // Split the "DD-MM-YYYY" format
    const [day, month, year] = dateStr.split("-");

    // Create a new Date object using "YYYY-MM-DD"
    const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

    return isoDate.toISOString(); // Convert to "YYYY-MM-DDTHH:mm:ss.SSSZ"
  }

  const handleActionSuccess = (dataObject) => {
    setIsView(true);
    setInvoiceData(dataObject.data || []);
    const data = dataObject.data[0];
    setPreviewQcFlag(data?.qcApproval || "");
    setPoType(data?.type || "");
    setDigit(data?.digit || "");
    setGetPoNumber(data?.poNo || "");
    setSupplierSelect(data?.suppName || "");
    // setSelectedDate(data?.date || '');
    const rawDate = data?.date || ""; // Example: "28-02-2025"
    const formattedDate = rawDate ? convertToISO(rawDate) : "";
    setSelectedDate(formattedDate);
    setBillingAddress(data?.spAddress || "");
    setGrnRefNo(data?.grnRefNO || "");
    setSupplierInvoiceNo(data?.suppInvNo || "");
    setSupplierIdCopy(data?.supId || '');
    setIGST(data?.igst)
    setIGSTPercent(data?.igstPer)
    setUTGST(data?.utgst)
    setUTGSTPercent(data?.utgstPer)
    setSupplierSelectCopy(data?.suppName || '');
    setBillingAddressCopy(data?.spAddress || '');
    setSupplierInvoiceNoCopy(data?.suppInvNo || '');
    setSupplierInvoiceDateCopy(data?.suppInvoiceDate || '');
    setCSupplierDcNumberCopy(data?.csSuppDcNo || '');
    setSupplierDcDateCopy(data?.suppDcRate || '');
    setSupplierInvoiceDate(data?.suppInvoiceDate || "");
    setSupplierCountry(data?.country || "");
    setSupplierState(data?.state || "");
    setCSupplierDcNumber(data?.csSuppDcNo || "");
    setSupplierDcDate(data?.suppDcRate || "");
    setIrNo(data?.irNo || "");
    setCarNo(data?.carNo || "");
    setBinNo(data?.binNo || "");
    setExgRate(data?.exgRate || "");
    setCurrency(data?.currency || "");
    setCurrencyId(data?.currencyId || "");
    setGstType(data?.gstType || "");
    //QC FIELDS
    setRemarks(data?.remarks || "");
    setQcAuthorise(data?.qcAuthorize || "");
    setQcAuthoriseBy(data?.qcAuthorizeBy || "");
    setQcAuthoriseDate(data?.qcAuthorizeDate || "");
    setQcRemarks(data?.qcRemarks || "");
    //AMOUNT FIELDS
    setTotalQty(data?.totalQty || "");
    setGrossAmount(data?.grossAmount || "");
    setLessDiscount(data?.lessDiscount || "");
    setTransport(data?.transport || "");
    setCoolie(data?.coolie || "");
    setSubTotal(data?.subTotal || "");
    setCGST(data?.cgst || "");
    setCGSTPercent(data?.cgstPer || "");
    setSGST(data?.sgst || "");
    setSGSTPercent(data?.sgstPer || "");
    setUTGST(data?.utgst || "");
    setUTGSTPercent(data?.utgstPer || "");
    setTDS(data?.tds || "");
    setTDSPercent(data?.tdsPer || "");
    setTCS(data?.tcs || "");
    setTCSPercent(data?.tcsPer || "");
    setOthers(data?.others || "");

    //INTERNATIONAL
    setBCDPercent(data?.bcdPer || "");
    setInsurancePercent(data?.insurancePer || "");
    setSocialWelfareChargesPercent(data?.swcPer || "");

    setBOENo(data?.boeNo || "");
    setBOEDate(data?.boeDate || "");
    setPackingListNo(data?.packingListNo || "");
    setPackingDate(data?.packingDate || "");
    setMiscCharges(data?.miscCharges || "");
    setInsurance(data?.insurance || "");
    setFreight(data?.freight || "");
    setBCD(data?.bcd || "");
    setSocialWelfareCharges(data?.socialWelfareCharges || "");
    setImportGSTPercent(data?.importGstPer || "");
    setImportGST(data?.importGST || "");
    setFreightCharges(data?.freightCharges || "");
    setLocalClearanceCharges(data?.localClearanceCharges || "");
    setMainId(data?.mainId || "");
    setIsAccountable(data?.accountable);
    setSelectedItems(dataObject.data || []);
  };
  const handleActionException = () => { };

  const handleClearPage = () => {
    setIsView(false);
    setIsEdit(false);
    setIsAccountable(true);
    setSelectedDate(new Date());
    setDigit("");
    setGetPoNumber("");
    setPoType("");
    setSelectedItems([{ id: "RDL1" }]);
    setBillingAddress("");
    setGrnRefNo("");
    setSupplierSelect("");
    setSelectedItemName("");
    setSupplierInvoiceNo("");
    setSupplierInvoiceDate("");
    setCSupplierDcNumber("");
    setSupplierDcDate("");
    setIrNo("");
    setCarNo("");
    setBinNo("");
    setExgRate("");
    setCurrency("");
    setCurrencyId("");
    setGstType("");
    setRemarks("");
    setQcAuthorise("");
    setQcAuthoriseBy("");
    setQcAuthoriseDate("");
    setQcRemarks("");
    setTotalQty("");
    setGrossAmount("");
    setLessDiscount("");
    setTransport("");
    setCoolie("");
    setSubTotal("");
    setCGST("");
    setCGSTPercent("");
    setSGST("");
    setSGSTPercent("");
    setIGST("");
    setIGSTPercent("");
    setUTGST("");
    setUTGSTPercent("");
    setTotal("");
    setTDS("");
    setTDSPercent("");
    setTCS("");
    setTCSPercent("");
    setOthers("");
    setGrandTotal("");
    setSupplierItemList([]);
    setSelectedFile(null);
    //INTERNATIONAL CLEAR
    setBOENo("");
    setBOEDate("");
    setPackingListNo("");
    setPackingDate("");
    setGrossAmountINR("");
    setMiscCharges("");
    setSubTotalGrsAndMisc("");
    setInsurance("");
    setFreight("");
    setSubTotalINSAndFreight("");
    setBCD("");
    setSocialWelfareCharges("");
    setSubTotalSWAndBCD("");
    setImportGST("");
    setImportGSTPercent("");
    setTotalWithGST("");
    setFreightCharges("");
    setLocalClearanceCharges("");
    setSelectedGeneratedPo("");
    // genarateGrnNumber(handleGrnSucess, handleGrnException);
    // INT END
    // setTimeout(() => {
    //     GetPurchaseBillSuppList(handleSupplierListSuccess, handleSupplierListFailed)
    // }, 2000);
  };

  const deletehandleSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    // setRefreshData((oldvalue) => !oldvalue);
    setTimeout(() => {
      handleClose();
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

  //SEARCH BILL
  const handlePOChange = (e) => {
    GetGeneratedPo(
      { type: "withoutPoBill", code: e.target.value },
      handleGeneratedPoSucessShow,
      handleGeneratedPoExceptionShow
    );
  };

  const handleGeneratedPoSucessShow = (dataObject) => {
    setGeneratedPoLists(dataObject?.data || []);
  };
  const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => { };

  const handleGeneratedPoSelect = (selectedValue) => {
    setIsView(true);
    if (selectedValue !== null) {
      setSelectedGeneratedPo(selectedValue.digit);
      PurchaseBillWithoutPOPreview(
        {
          digit: selectedValue.digit,
          prefix: selectedValue?.type,
        },
        handleActionSuccess,
        handleActionException
      );
    }
  };

  const handleCellClick = (cellName, params) => {
    if (cellName === "lotQtyData") {
      setLotEntryModalOpen(true);
      console.log("paramsparamsparams", params);
      setCellData(params);
      if (params?.lotQtyData) {
        setRowData(params?.lotQtyData);
      } else {
        setRowData([]);
      }
    }
  };

  const CustomPopper = (props) => {
    return (
      <Popper
        {...props}
        placement="top"
        style={{ position: "absolute", top: "auto", bottom: "100%" }}
      />
    );
  };

  // UNIQUE CODE MANUAL CHANGE
  const handleUniqueCodeChange = (e) => {
    const newUniqueCode = e.target.value;
    const currentYear = getPoNumber.split("/")[0]; // Get last 2 digits of the year
    setDigit(newUniqueCode);
    setGetPoNumber(
      `${currentYear}/${poType}/${newUniqueCode.toString().padStart(5, 0)}`
    );
  };

  // Helper function to format the current date as yyyy-MM-dd
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Extracts yyyy-MM-dd
  };

  function emptyRowsToPush(lineItems) {
    const pageSize = 39;   // Max rows per page (depends on layout)
    const header = 10;     // Rows occupied by header
    const footer = 19;     // Rows reserved for footer

    // Total rows including header and footer
    const totalContent = header + lineItems + footer;

    // Total pages required
    const totalPages = Math.ceil(totalContent / pageSize);

    // Capacity available in all pages
    const totalCapacity = pageSize * totalPages;

    // Dummy rows required to perfectly fill the last page
    let rowsToPush = totalCapacity - totalContent;

    // ✅ Keep at least 0 dummy rows unless it's too small
    // if (rowsToPush < 0) rowsToPush = 0;

    // return rowsToPush;
    if (rowsToPush < 0) {
      rowsToPush = 0;
    } else if (rowsToPush > 0) {
      rowsToPush -= 1;  // <-- prevent accidental overflow
    }

    return rowsToPush;
  }

  const handlePrintClick = () => {
    setPdfModalOpen(true);
    let info = [];
    invoiceData.forEach((element, index, array) => {
      info.push([
        index + 1,
        element.itemCode,
        element.uom,
        // element.poNo,
        element.poQty,
        element.invQty,
        element.rcvdQty,
        element.accQty,
        element.rejQty,
        element.itemRemarks,
      ]);
    });

    // Ensure a minimum of 10 items
    // const minItems = 10;
    // const placeholderItem = [''];
    // while (info.length < minItems) {
    //     info.push([...placeholderItem]);
    // }
    const paddingNeeded = emptyRowsToPush(info.length);
    for (let i = 0; i < paddingNeeded; i++) {
      const emptyRow = ["", "", "", "", "", "", "", "", "", ""];
      emptyRow.isInfoRow = true; // Keep the same flag if you want same styling
      info.push(emptyRow);
    }

    const doc = new jsPDF();
    const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
    // const logoUrl = (await import('../../AllImage/RDL_Logo.png')).default;
    const logoUrl = `${baseUrl}/${invoiceData[0].companyImage}`
    const IsoUrl = require("../../AllImage/Picture.png");
    // const IsoUrl = require('../../AllImage/Picture.png');

    // PAGE NUMBER
    const totalPagesExp = "{totalPages}"; // <-- Add this
    const tableOptions = {
      didDrawPage: (HookData) => {
        // Check if it's the first page
        if (HookData.pageNumber === 1) {
          // Add an image on the first page
          doc.addImage(logoUrl, "PNG", 25, 15, 28, 20);
          doc.addImage(IsoUrl, "PNG", 160, 15, 35, 20);
        } else {
          // From second page onward, show header
          doc.setFontSize(10);
          doc.setTextColor("blue");
          doc.setFont("times", "bold");
          doc.text(
            `Puchase Bill No : ${invoiceData[0].poNo}     |     Date : ${invoiceData[0].date}`,
            14,
            8
          ); // Adjust Y pos as needed
          doc.setDrawColor(0);
          // doc.line(14, 10, 196, 10); // Line under the header (optional)
        }

        // PAGE NUMBER
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width || pageSize.getWidth();
        const pageHeight = pageSize.height || pageSize.getHeight();

        doc.setFontSize(8);
        doc.setTextColor(70);
        // Left-aligned footer text
        doc.text(
          `FORMAT NO : IMS-ME-PUR-F-219-Rev-3 Dated 11-01-2019`,
          14, // X position (left margin)
          pageHeight - 10
        );

        // Right-aligned page number
        doc.text(
          `Page ${HookData.pageNumber} of ${totalPagesExp}`,
          pageWidth - 14, // X position (right margin)
          pageHeight - 10,
          { align: "right" } // Align text to the right
        );
      },
    };

    // const logoAndAddress = [
    //     [
    //         {
    //             content: {
    //                 image: logoUrl,
    //                 width: 30, // adjust the width as needed
    //                 height: 30, // adjust the height as needed
    //             },
    //             colSpan: 2
    //         },
    //         {
    //             content: 'RDL Technologies Pvt Ltd.\nPlot No. 126, Road No 3, KIADB Industrial Estate\nII Phase, Jigani Industrial Area, Jigani,Anekal Taluk,\nBengaluru - 560 105. Tel:080-27825249\nWeb Site :www.mallikengineering.com\nEmail : info@mallikengineering.com',
    //             colSpan: 6,
    //             styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //         },
    //         {
    //             content: 'ISO 9001 : 2015\nISO 14001 : 2015\nOHSAS 18001 : 2007',
    //             colSpan: 2,
    //             styles: { halign: 'right', fontSize: 6, textColor: 'black', valign: 'bottom' }
    //         }
    //     ]
    // ];

    const logoAndAddress = [
      // [
      //     {
      //         content: `\n\n\n\n\n\nRDL Technologies Pvt Ltd.\nPlot No. 126, Road No 3, KIADB Industrial Estate\nII Phase, Jigani Industrial Area, Jigani,Anekal Taluk,\nBengaluru - 560 105. Tel:080-27825249\nWeb Site :www.mallikengineering.com\nEmail : info@mallikengineering.com`,
      //         colSpan: 3,
      //         styles: {
      //             halign: 'left', fontSize: 8, textColor: 'black',
      //             lineWidth: { top: 0.2, right: 0, bottom: 0, left: 0.2 },
      //             lineColor: { top: [0, 0, 0] },
      //         }
      //     },
      //     {
      //         content: '',
      //         colSpan: 4,
      //         styles: {
      //             lineWidth: { top: 0.2, right: 0, bottom: 0, left: 0 },
      //             lineColor: { top: [0, 0, 0] },
      //         }
      //     },
      //     {
      //         content: `\n\n\n\n\n\n\n\n\nCIN No: U28112KA2013PTC068181\nPAN No: AAICM4744Q\nGSTINO: 29AAICM4744Q1ZM`,
      //         colSpan: 3,
      //         styles: {
      //             halign: 'right', fontSize: 8, textColor: 'black', /*valign: 'top',*/
      //             lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0 },
      //             lineColor: { top: [0, 0, 0] },
      //         }
      //     }
      // ]
      [
        {
          content: ``,
          colSpan: 2,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
            lineColor: { top: [0, 0, 0] },
          },
        },
        {
          content: `${invoiceData[0]?.companyName}\n${invoiceData[0]?.companyAdd}. Tel:${invoiceData[0]?.telNo}\nWeb Site :${invoiceData[0]?.website}\nEmail : ${invoiceData[0]?.email}`,
          colSpan: 8,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
            lineColor: { top: [0, 0, 0] },
          },
        },
      ],
      [
        {
          content: `PAN No: ${invoiceData[0]?.cmpPanNo}`,
          colSpan: 2,
          styles: {
            fontSize: 8,
            textColor: "black" /*valign: 'top',*/,
            lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
            lineColor: { top: [0, 0, 0] },
          },
        },
        {
          content: `CIN No:${invoiceData[0]?.cmpCinNo}`,
          colSpan: 4,
          styles: {
            fontSize: 8,
            textColor: "black" /*valign: 'top',*/,
            lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
            lineColor: { top: [0, 0, 0] },
          },
        },
        {
          content: `GSTINO: ${invoiceData[0]?.cmpGstNo}`,
          colSpan: 4,
          styles: {
            fontSize: 8,
            textColor: "black" /*valign: 'top',*/,
            lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
            lineColor: { top: [0, 0, 0] },
          },
        },
      ],
    ];

    // const pan = [[
    //     {
    //         content: 'CIN No. U28112KA2013PTC068181',
    //         colSpan: 3,
    //         styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //     },
    //     {
    //         content: 'PAN No.AAICM4744Q',
    //         colSpan: 3,
    //         styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //     },
    //     {
    //         content: 'GSTINO. 29AAICM4744Q1ZM',
    //         colSpan: 4,
    //         styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //     }
    // ]];
    // const poHeader = [
    //   [
    //     {
    //       content:
    //         invoiceData[0].type === "R"
    //           ? `GOODS RECEIPT NOTE - INPUT`
    //           : `GOODS RECEIPT NOTE - SERVICE`,
    //       colSpan: 10,
    //       styles: {
    //         lineWidth: 0,
    //         textColor: "#ffffff",
    //         fontStyle: "bold",
    //         fontWeight: "bold",
    //         fillColor: "#4D55CC",
    //         fontSize: 8,
    //       },
    //     },
    //   ],
    // ];
    const poHeader = [
      [
        {
          content:
            invoiceData[0].type === "R"
              ? `GOODS RECEIPT NOTE - INPUT`
              : `GOODS RECEIPT NOTE - SERVICE`,
          colSpan: 10,
          styles: {
            lineWidth: 0,
            textColor: "#000000", // dark text on light background
            fontStyle: "bold",
            fontWeight: "bold",
            fillColor: [200, 210, 255], fontSize: 8,
          },
        },
      ],
    ];

    const address = [
      [
        {
          content: `SUPPLIER NAME :\n${invoiceData[0]?.suppName}\n${invoiceData[0]?.spAddress}\n${invoiceData[0]?.state}\n${invoiceData[0]?.country}`,
          colSpan: 6,
          rowSpan: 6,
          styles: {
            halign: "left",
            valign: "top",
            fontSize: 9,
            textColor: "black",
            fontStyle: "normal",
          },
        },
        {
          content: `GRN No :`,
          colSpan: 2,
          styles: { halign: "left", fontSize: 8 },
        },
        {
          content: `${invoiceData[0].grnRefNO}`,
          colSpan: 2,
          styles: { halign: "left", fontSize: 8, textColor: "blue" },
        },
      ],
      [
        {
          content: "GRN Date :",
          colSpan: 2,
          styles: { halign: "left", fontSize: 8 },
        },
        {
          content: `${invoiceData[0].date}`,
          colSpan: 2,
          styles: { halign: "left", fontSize: 8, textColor: "blue" },
        },
      ],
      [
        {
          content: "PB No :",
          colSpan: 2,
          styles: { halign: "left", fontSize: 8 },
        },
        {
          content: `${invoiceData[0].poNo}`,
          colSpan: 2,
          styles: { halign: "left", fontSize: 8, textColor: "blue" },
        },
      ],
      [
        {
          content: "IR No :",
          colSpan: 2,
          styles: { halign: "left", fontSize: 8 },
        },
        {
          content: `${invoiceData[0].irNo}`,
          colSpan: 2,
          styles: { halign: "left", fontSize: 8, textColor: "blue" },
        },
      ],
      [
        {
          content: "CAR No:",
          colSpan: 2,
          styles: { halign: "left", fontSize: 8 },
        },
        {
          content: `${invoiceData[0].carNo}`,
          colSpan: 2,
          styles: { halign: "left", fontSize: 8, textColor: "blue" },
        },
      ],
      [
        {
          content: "BIN No:",
          colSpan: 2,
          styles: { halign: "left", fontSize: 8 },
        },
        {
          content: `${invoiceData[0].binNo}`,
          colSpan: 2,
          styles: { halign: "left", fontSize: 8, textColor: "blue" },
        },
      ],
    ];

    const threeCell = [
      [
        {
          content: `BOE No : ${invoiceData[0]?.boeNo || ''}`,
          colSpan: 2,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal",
          },
        },
        {
          content: `Supp Invoice No : ${invoiceData[0]?.suppInvNo}`,
          colSpan: 4,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal",
          },
        },
        {
          content: `Supp DC No : ${invoiceData[0]?.csSuppDcNo}`,
          colSpan: 4,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal",
          },
        },
      ],
      [
        {
          content: `BOE Date : ${invoiceData[0]?.boeDate || ''}`,
          colSpan: 2,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal",
          },
        },
        {
          content: `Supp Invoice Date : ${invoiceData[0]?.suppInvoiceDate}`,
          colSpan: 4,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal",
          },
        },
        {
          content: `Supp DC Date : ${invoiceData[0]?.suppDcRate}`,
          colSpan: 4,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal",
          },
        },
      ],
    ];

    // const firstHeaderRow = [[{ content: 'We are pleased to place an order for the following items, subject to the terms & conditions given below', colSpan: 8 }]];

    const secondHeaderRow = [
      [
        "SI No",
        "Description Of Goods",
        "UOM",
        "PONo",
        "PO Qty",
        "Inv Qty",
        "Rec Qty",
        "Acc Qty",
        "Rej Qty",
        "Remarks",
      ],
    ];

    const headerRows = [
      ...logoAndAddress,
      /* ...pan,*/ ...poHeader,
      ...address,
      ...threeCell /* firstHeaderRow  ...firstHeaderRow*/,
      ...secondHeaderRow,
    ];

    const GstTaxAmount = [
      ...(invoiceData[0]?.coolie.length > 0 ? [[
        { content: '', colSpan: 6, styles: { halign: 'left', fontSize: 8 } },
        { content: 'Coolie  :', colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
        { content: `${Number(invoiceData[0]?.coolie || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8, textColor: 'blue' } }
      ]] : []),


      ...(invoiceData[0]?.lessDiscount.length > 0 ? [[
        { content: '', colSpan: 6, styles: { halign: 'left', fontSize: 8 } },
        { content: 'Less Discount :', colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
        { content: `${Number(invoiceData[0]?.lessDiscount || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8, textColor: 'blue' } }
      ]] : []),

      ...(invoiceData[0]?.transport.length > 0 ? [[
        { content: '', colSpan: 6, styles: { halign: 'left', fontSize: 8 } },
        { content: 'Transport :', colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
        { content: `${Number(invoiceData[0]?.transport || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8, textColor: 'blue' } }
      ]] : []),
      ...(Math.max(Number(invoiceData[0].subTotal), 0) > 0 ? [[
        { content: '', colSpan: 6, styles: { halign: 'left', fontSize: 8 } },
        { content: 'Sub Total : ', colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
        { content: `${Number(invoiceData[0]?.subTotal || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8, textColor: 'blue' } }
      ]] : []),

      ...(Math.max(Number(invoiceData[0].tds), 0) > 0 ? [[
        { content: '', colSpan: 6, styles: { halign: 'left', fontSize: 8 } },
        { content: 'TDS : ', colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
        { content: `${Number(invoiceData[0]?.tds || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8, textColor: 'blue' } }
      ]] : []),

      ...(Math.max(Number(invoiceData[0].tcs), 0) > 0 ? [[
        { content: '', colSpan: 6, styles: { halign: 'left', fontSize: 8 } },
        { content: 'TCS : ', colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
        { content: `${Number(invoiceData[0]?.tcs || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8, textColor: 'blue' } }
      ]] : []),
      ...(invoiceData[0]?.totalQty?.length > 0
        ? [
          [
            { content: '', colSpan: 6, styles: { halign: 'left', fontSize: 8 } },
            { content: 'Total Qty :', colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
            {
              content: `${Number(invoiceData[0]?.totalQty || 0).toLocaleString('en-IN')}`,
              colSpan: 2,
              styles: { halign: 'right', fontSize: 8, textColor: 'blue' },
            },
          ],
        ]
        : []),

      ...(gstType === 'IGST'
        ? [
          [
            { content: '', colSpan: 6, styles: { halign: 'left', fontSize: 8 } },
            { content: `IGST @ ${invoiceData[0]?.igstPer}%`, colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
            {
              content: `${Number(invoiceData[0]?.igst || 0).toLocaleString('en-IN')}`,
              colSpan: 2,
              styles: { halign: 'right', fontSize: 8, textColor: 'blue' },
            },
          ],
          [
            { content: '', colSpan: 6, styles: { halign: 'left', fontSize: 8 } },
            { content: `UTGST @ ${invoiceData[0]?.utgstPer}%`, colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
            {
              content: `${Number(invoiceData[0]?.utgst || 0).toLocaleString('en-IN')}`,
              colSpan: 2,
              styles: { halign: 'right', fontSize: 8, textColor: 'blue' },
            },
          ],
        ]
        : [
          ...(invoiceData[0]?.cgstPer
            ? [
              [
                { content: '', colSpan: 6, styles: { halign: 'left', fontSize: 8 } },
                { content: `CGST @ ${invoiceData[0]?.cgstPer}%`, colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
                {
                  content: `${Number(invoiceData[0]?.cgst || 0).toLocaleString('en-IN')}`,
                  colSpan: 2,
                  styles: { halign: 'right', fontSize: 8, textColor: 'blue' },
                },
              ],
            ]
            : []),
          ...(invoiceData[0]?.sgstPer
            ? [
              [
                { content: '', colSpan: 6, styles: { halign: 'left', fontSize: 8 } },
                { content: `SGST @ ${invoiceData[0]?.sgstPer}%`, colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
                {
                  content: `${Number(invoiceData[0]?.sgst || 0).toLocaleString('en-IN')}`,
                  colSpan: 2,
                  styles: { halign: 'right', fontSize: 8, textColor: 'blue' },
                },
              ],
            ]
            : []),
        ]),

      ...(invoiceData[0]?.total?.length > 0
        ? [
          [
            { content: '', colSpan: 6, styles: { halign: 'left', fontSize: 8 } },
            { content: 'Total : ', colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
            {
              content: `${Number(invoiceData[0]?.total || 0).toLocaleString('en-IN')}`,
              colSpan: 2,
              styles: { halign: 'right', fontSize: 8, textColor: 'blue' },
            },
          ],
        ]
        : []),

      ...(invoiceData[0]?.others.length > 0
        ? [
          [
            { content: '', colSpan: 6, styles: { halign: 'left', fontSize: 8 } },
            { content: 'Other', colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
            {
              content: `${Number(invoiceData[0]?.others || 0).toLocaleString('en-IN')}`,
              colSpan: 2,
              styles: { halign: 'right', fontSize: 8, textColor: 'blue' },
            },
          ],
        ]
        : []),
      ...(invoiceData[0]?.grandTotal.length > 0 ? [[
        { content: `PB Remarks:${invoiceData[0]?.remarks}\nQA Remarks:${invoiceData[0]?.qcRemarks}`, colSpan: 6, styles: { halign: 'left', fontSize: 8 } },
        { content: 'Grand Total :', colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
        { content: `${Number(invoiceData[0]?.grandTotal || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8, textColor: 'blue' } }
      ]] : [])
    ];


    // const totalRow = [
    //   [
    //     {
    //       content: `PB Remarks:${invoiceData[0]?.remarks}\nQA Remarks:${invoiceData[0]?.qcRemarks}`,
    //       colSpan: 6,
    //       styles: { halign: "left", fontSize: 8 },
    //     },
    //     {
    //       content: `Grand Total : ${Number(invoiceData[0]?.grandTotal || 0).toLocaleString('en-IN')}`,
    //       colSpan: 4,
    //       styles: { halign: "center", fontSize: 8 },
    //     },
    //   ],
    // ];

    const userData = [
      [
        {
          content: `Prepared By ${invoiceData[0]?.user || ''}`,
          colSpan: 2,
          styles: {
            halign: "center",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal", cellPadding: { top: 11, bottom: 2 }
          },
        },
        {
          content: `QA Approved ${invoiceData[0]?.qcAuthorizeBy}`,
          colSpan: 2,
          styles: {
            halign: "center",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal", cellPadding: { top: 11, bottom: 2 }
          },
        },
        {
          content: `Stores in Charge`,
          colSpan: 3,
          styles: {
            halign: "center",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal", cellPadding: { top: 11, bottom: 2 }
          },
        },
        {
          content: `Authorised By`,
          colSpan: 3,
          styles: {
            halign: "center",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal", cellPadding: { top: 11, bottom: 2 }
          },
        },
      ],
    ];

    const outerTable1 = [
      [
        {
          content: 'Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076',
          colSpan: 8,
          styles: {
            halign: 'left', fontSize: 7, textColor: 'black', fontStyle: 'normal', lineWidth: 0,
            lineWidth: { top: 0.2, right: 0, bottom: 0, left: 0 },
            lineColor: { top: [0, 0, 0] },
          }
          //  styles: {
          //     halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal',
          //     lineWidth: { top: 0.5, right: 0, bottom: 0, left: 0 },
          //     lineColor: { top: [0, 0, 0] },
          //     cellPadding: { top: 20, bottom: 3 }, // ⬅️ Add padding for spacing

          // }
        },
      ],
      [
        {
          content: 'Branch Address: Plot No. 98-I, Road No. 6, KIADB Jigani Industrial Estate, 2nd Phase, Jigani, Anekal Tq, Bangalore - 560105.',
          colSpan: 8,
          styles: {
            halign: 'left', fontSize: 7, textColor: 'black', fontStyle: 'normal', lineWidth: 0,
          }
        },
      ]
    ];


    const bodyRows = [
      ...info,
      ...GstTaxAmount,
      // ...totalRow,
      // ...footerData /* ...totalWords, ...termsAndSuppluColumn, ...requirements, ...para, ...users, ...note*/,
    ];
    const footRows = [...userData]
    const footRowssepearte = [...outerTable1]


    // const footRows = [...outerTable]

    doc.autoTable({
      theme: "striped",
      head: headerRows,
      body: bodyRows,
      // foot: footRows,
      showHead: "firstPage",
      showFoot: "lastPage",
      ...tableOptions,
      headStyles: {
        fillColor: [255, 255, 255], // Header background color
        textColor: [0, 0, 0], // Header text color
        halign: "center", // Header text alignment
        valign: "middle", // Vertical alignment
        lineWidth: 0.1, // Border width
        lineColor: [0, 0, 0], // Border color,
        font: "times",
        fontSize: 8,

      },
      columnStyles: {
        1: { cellWidth: 50 }, // ✅ wrap only this column
        // other columns can remain default
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // Header background color
        textColor: [0, 0, 0], // Header text color
        halign: "left", // Header text alignment
        valign: "middle", // Vertical alignment
        lineWidth: 0.1, // Border width
        lineColor: [0, 0, 0], // Border color
        fontStyle: "normal",
        fontSize: 7,
        font: "times",
        cellWidth: "wrap", // avoids wrapping
      },
      footStyles: {
        fillColor: [255, 255, 255], // Header background color
        textColor: [0, 0, 0], // Header text color
        halign: "center", // Header text alignment
        valign: "middle", // Vertical alignment
        lineWidth: 0.1, // Border width
        lineColor: [0, 0, 0], // Border color
        font: "times",
      },
      // didParseCell: function (data) {
      //   if (data.section === 'body') {
      //     data.cell.styles.overflow = 'linebreak'; // ✅ enables wrapping
      //     data.cell.styles.fillColor = false;
      //   }
      //   const rightAlignColumns = [2, 3, 4, 5, 6, 7, 8, 9];
      //   // if (data.row.index > 0 && rightAlignColumns.includes(data.column.index)) {
      //   //     data.cell.styles.halign = 'right';
      //   // }
      //   if (data.section === 'body' && rightAlignColumns.includes(data.column.index)) {
      //     data.cell.styles.halign = 'right';
      //   }
      // },
      didDrawPage: function (data) {
        if (data.pageNumber === 1) {
          // ✅ First page logo/header
          doc.addImage(logoUrl, 'PNG', 22, 18, 28, 15);
          doc.addImage(IsoUrl, 'PNG', 160, 15, 35, 20);
        } else {
          const headerHeight = 10; // Adjust height of your repeated header

          // ✅ Repeat secondHeaderRow manually on all pages after 1
          const headers = [
            "SI No",
            "Description Of Goods",
            "UOM",
            "PONo",
            "PO Qty",
            "Inv Qty",
            "Rec Qty",
            "Acc Qty",
            "Rej Qty",
            "Remarks",
          ];
          const startX = data.settings.margin.left;
          let y = data.settings.margin.top - headerHeight;  // 🔥 fixed: start from top margin

          doc.setFont('times', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(0);

          let x = startX;
          data.table.columns.forEach((col, i) => {
            const width = col.width;  // use actual column width
            doc.rect(x, y, width, 10);
            doc.text(headers[i].trim(), x + width / 2, y + 6, {
              align: 'center',
              baseline: 'middle'
            });
            x += width;
          });

          // data.cursor.y = y + 10; // Adjust for next row
          doc.setFontSize(8);
          doc.setFont("times", "bold");
          doc.setTextColor('blue');
          doc.text(`Puchase Bill No : ${invoiceData[0].poNo}     |     Date : ${invoiceData[0].date}`, 14, 3); // Adjust Y pos as needed
        }
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width || pageSize.getWidth();
        const pageHeight = pageSize.height || pageSize.getHeight();

        doc.setFontSize(8);
        doc.setTextColor(70);
        doc.text('FORMAT NO:IMS-ME-PUR-F-220-Rev-3 Dated 14-01-2019', 14, pageHeight - 10);
        doc.text(`Page ${data.pageNumber} of ${totalPagesExp}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
      },
      didParseCell: function (data) {
        if (data.section === 'body') {
          data.cell.styles.overflow = 'linebreak'; // ✅ enables wrapping
          data.cell.styles.fillColor = false;

          const rightAlignColumns = [2, 3, 4, 5, 6, 7, 8, 9];

          // ✅ Only apply right alignment if it's a single-cell column (not a label with colSpan)
          if (
            rightAlignColumns.includes(data.column.index) &&
            !(data.cell.colSpan > 1)
          ) {
            data.cell.styles.halign = 'right';
          }
        }
      }

    });

    doc.autoTable({
      theme: 'striped',
      head: footRows,
      startY: doc.lastAutoTable.finalY,
      headStyles: {
        fillColor: [255, 255, 255], // Header background color
        textColor: [0, 0, 0], // Header text color
        halign: 'center', // Header text alignment
        valign: 'middle', // Vertical alignment
        lineWidth: 0.1, // Border width
        lineColor: [0, 0, 0], // Border color,
        font: 'times',
      }
    });

    doc.autoTable({
      theme: 'striped',
      head: footRowssepearte,
      startY: doc.lastAutoTable.finalY,
      headStyles: {
        fillColor: [255, 255, 255], // Header background color
        textColor: [0, 0, 0], // Header text color
        halign: 'center', // Header text alignment
        valign: 'middle', // Vertical alignment
        lineWidth: 0.1, // Border width
        lineColor: [0, 0, 0], // Border color,
        font: 'times',
      }
    });
    // PAGE NUMBER
    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp); // This replaces "{totalPages}" in all pages
    }

    // doc.save('PurchaseOrder.pdf');
    const pdfBlob = doc.output("blob");
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfBlobUrl);
  };

  // Utility function to convert date to YYYY-MM-DD format
  const formatDateToYYYYMMDD = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // HANDLE SUPP INVOICE NUMBER CHECK
  const handleCheckSuccess = (dataObject) => { };
  const handleCheckException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
  };


  const eligibleIds = React.useMemo(
    () =>
      (selectedItems || [])
        .filter((it) => Number(it?.rcvdQty) === 0)
        .map((it) => it.id),
    [selectedItems]
  );

  // Whether all eligible rows are selected
  const allEligibleSelected = React.useMemo(
    () => eligibleIds.length > 0 && eligibleIds.every((id) => selectedRowIds.includes(id)),
    [eligibleIds, selectedRowIds]
  );

  // Master checkbox handler (select/deselect only eligible rows)
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    if (checked) {
      const newSelected = Array.from(new Set([...selectedRowIds, ...eligibleIds]));
      setSelectedRowIds(newSelected);
      console.log("Selected IDs:", newSelected);
    } else {
      const newSelected = selectedRowIds.filter((id) => !eligibleIds.includes(id));
      setSelectedRowIds(newSelected);
      console.log("Selected IDs:", newSelected);
    }
  };

  // Individual row checkbox handler
  const handleRowSelect = (id) => {
    setSelectedRowIds((prev) => {
      let newSelected;
      if (prev.includes(id)) {
        newSelected = prev.filter((x) => x !== id);
      } else {
        newSelected = [...prev, id];
      }
      console.log("Selected IDs:", newSelected);
      return newSelected;
    });
  };


  const handleShortClose = () => {
    PurchaseBillWithoutShortClose({ ids: selectedRowIds }, handleSuccessShortClose, handleExceptionShortClose)
  }


  const handleSuccessShortClose = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      // setInvoiceUploadLoader(false);
    }, 2000);
  }


  const handleExceptionShortClose = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // setInvoiceUploadLoader(false);
    }, 2000);
  }


  return (
    <div>
      {isProcessInsp ? (
        <>
          <InwardQualityFPIResult
            setIsProcessInsp={setIsProcessInsp}
            inspectionView={inspectionView}
            poBillDetailId={poBillDetailId}
            poBillId={poBillId}
            rowItemId={rowItemId}
            rowPoNumber={rowPoNumber}
            rowAccQty={rowAccQty}
            reportRowData={reportRowData}
            WithoutPObatchQty={reportRowData?.batchQty}   // ✅ add this line

          // isSelectedData={isChild === 1 ? isSelectedChildData : isSelectedData}
          // selectedOptionName={selectedOptionName}
          // selectedRowItemId={selectedRowItemId}
          // selectedMachineId={machineName}
          // isChild={isChild}
          // setIsChild={setIsChild}
          // scrollToRow={scrollToRow}
          // selectedRowId={selectedRowId}
          // // FOR ASSEMBLY PLAN
          // kanDate={kanDate}
          // selectedFim={selectedFim}
          // contractRadioChange={contractRadioChange}
          // rowContract={rowContract}
          // optionsRowData={optionsRowData}
          // selectedRowItemCode={selectedRowItemCode}
          />
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginLeft: "10px",
              marginTop: "10px",
            }}
          >
            {/* <Link to='/PurchaseBillWithoutPOResult' style={{ textDecoration: 'none' }}>
                    <Typography
                        sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                        variant="h5"
                    >
                        {`Purchase Bill Without PO>>`}
                    </Typography>
                </Link>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    {isEdit ? "Edit Purchase Bill Without PO" : isView ? "View Purchase Bill Without PO" : "New Purchase Bill Without PO"}
                </Typography> */}
            {
              isQcApprovalFlag === "true" && (
                <Link
                  to="/QualityInspectionTab"
                  style={{ textDecoration: "none" }}
                >
                  <Typography
                    sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
                    variant="h5"
                  >
                    {`QC Approval>>`}
                  </Typography>
                </Link>
              )
              // :
              // <Link to='/PurchaseBillWithoutPOResult' style={{ textDecoration: 'none' }}>
              //     <Typography
              //         sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
              //         variant="h5"
              //     >
              //         {`Purchase Bill Without PO>>`}
              //     </Typography>
              // </Link>
            }
            <Typography
              sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
              variant="h5"
            >
              {isEdit
                ? "Edit Purchase Bill Without PO"
                : isView
                  ? "View Purchase Bill Without PO"
                  : "New Purchase Bill Without PO"}
            </Typography>
          </div>
          <form onSubmit={handleSubmit}>
            <Grid container padding={1}>
              <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        PB No
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="PO No"
                        value={poType}
                        onChange={(e) => {
                          setPoType(e.target.value);
                          GetPOBillUniqueID(
                            { po: e.target.value },
                            handleGetUniqueCodeSuccess,
                            handleGetUniqueCodeException
                          );
                        }}
                        size="small"
                        style={{
                          backgroundColor: "#ffffff",
                          borderRadius: "5px",
                        }}
                        disabled={
                          isView || isQcApprovalFlag === "true" ? true : false
                        }
                      >
                        <MenuItem value={"R"}>R</MenuItem>
                        <MenuItem value={"J"}>J</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                    <TextField
                      fullWidth
                      required
                      value={digit}
                      onChange={handleUniqueCodeChange}
                      size="small"
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                      disabled={
                        isView || isQcApprovalFlag === "true" ? true : false
                      }
                      inputProps={{ maxLength: 5 }} // Set max length to 5 characters
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                    <TextField
                      fullWidth
                      // disabled={true}
                      type="date"
                      // readOnly={true}
                      disabled={
                        isView || isQcApprovalFlag === "true" ? true : false
                      }
                      required
                      value={formatDate(selectedDate)}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      size="small"
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                      max={getCurrentDate()} // Restrict dates greater than today
                      inputProps={{
                        max: getCurrentDate(), // Restrict dates greater than today
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      fullWidth
                      required
                      value={getPoNumber}
                      // onChange={(e) => setGetPoNumber(e.target.value)}
                      readOnly={true}
                      size="small"
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                      disabled={isView ? true : false}
                    />

                    <Tooltip title="Refresh DocNumber">
                      <span>
                        {" "}
                        {/* wrapper to avoid tooltip crash when button is disabled */}
                        <IconButton
                          disabled={
                            isView || isQcApprovalFlag === "true" ? true : false || isEdit
                          }
                          onClick={() => {
                            if (poType) {
                              // setPoType(e.target.value)
                              GetPOBillUniqueID(
                                { po: poType },
                                handleGetUniqueCodeSuccess,
                                handleGetUniqueCodeException
                              );
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
                      disablePortal
                      id="combo-box-demo"
                      options={suppplierList}
                      value={supplierSelect}
                      fullWidth
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Supplier"
                          onChange={handleChange}
                        />
                      )}
                      onChange={(event, value) =>
                        handleSupplierSearchItemChange(value)
                      }
                      size="small"
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                      disabled={
                        isView || isQcApprovalFlag === "true" || poType === ""
                          ? true
                          : false
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{}}>
                    <TextField
                      fullWidth
                      id="outlined-multiline-static"
                      label="Billing Address"
                      multiline
                      rows={4}
                      value={billingAddress}
                      readOnly={true}
                      size="small"
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "5px",
                      }}
                      disabled={isView ? true : false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{}}>
                    <FormControlLabel
                      style={{ paddingLeft: 10 }}
                      control={
                        <Checkbox
                          checked={isAccountable}
                          onChange={(e) => setIsAccountable(e.target.checked)}
                          disabled={isView || isQcApprovalFlag === 'true'}
                          color="primary"
                        />
                      }
                      label={isAccountable ? 'Accountable' : 'Non-Accountable'} // ✅ Label changes based on checkbox
                    />
                  </Grid>
                  <div
                    style={{
                      width: "100%",
                      textAlign: "right",
                      // marginTop: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        width: "100%",
                        background: isModuleLocked ? "gray" : "#002D68",
                        color: "white",
                        height: "35px",
                        width: "250px",
                      }}
                      disabled={isModuleLocked}
                      onClick={() => setViewMoreModal(true)}
                    >
                      Additional Details
                    </Button>
                  </div>
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
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={generatedPoLists}
                  fullWidth
                  value={selectedGeneratedPo}
                  getOptionLabel={(option) =>
                    option.poNo || selectedGeneratedPo
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
                {/* <div
                  style={{
                    width: "100%",
                    textAlign: "right",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    style={{
                      width: "100%",
                      background: "#002D68",
                      color: "white",
                      height: "35px",
                      width: "250px",
                    }}
                    onClick={() => setViewMoreModal(true)}
                  >
                    Additional Details
                  </Button>
                </div> */}
                {/* <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '0px', borderRadius: '10px', width: '100%', height: '34vh', overflow: 'auto', border: '1px solid #000000' }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} >
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card> */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Card
                    style={{
                      boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                      marginTop: "3px",
                      borderRadius: "10px",
                      width: "100%",
                      // height: "27vh",
                      overflow: "auto",
                      border: "1px solid black",
                    }}
                  >
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <table style={{ width: "100%", height: "100%", borderCollapse: "collapse" }}>
                            <tbody>
                              <tr style={{ borderBottom: "1px solid #ddd", height: "40px" }}>
                                <th style={{ border: "1px solid #ddd", padding: "4px", fontWeight: "bold", fontSize: "14px" }}>
                                  Total Qty
                                </th>
                                <td style={{ border: "1px solid #ddd", padding: "4px" }}>
                                  <TextField
                                    fullWidth
                                    size='small'
                                    required
                                    value={totalQty}
                                    disabled={isView || isQcApprovalFlag === 'true' ? true : false}
                                  />
                                </td>
                              </tr>
                              <tr style={{ borderBottom: "1px solid #ddd", height: "40px" }}>
                                <th style={{ border: "1px solid #ddd", padding: "4px", fontWeight: "bold", fontSize: "14px" }}>
                                  Sub Total
                                </th>
                                <td style={{ border: "1px solid #ddd", padding: "4px" }}>
                                  <TextField
                                    fullWidth
                                    size='small'
                                    required
                                    value={subTotal}
                                    // onChange={(e) => setSubTotal(e.target.value)}
                                    disabled={isView || isQcApprovalFlag === 'true' ? true : false}
                                  />
                                </td>
                              </tr>
                              <tr style={{ borderBottom: "1px solid #ddd" }}>
                                <th style={{ border: "1px solid #ddd", padding: "8px", fontWeight: "bold", fontSize: "14px" }}>
                                  Grand Total
                                </th>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                  <TextField
                                    fullWidth
                                    size='small'
                                    required
                                    value={grandTotal}
                                    disabled={isView || isQcApprovalFlag === 'true' ? true : false}
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
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                <Card
                  style={{
                    boxShadow: "0 10px 10px 10px rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                    width: "100%",
                    height: screenHeight - 430,
                    border: "1px solid #000000",
                  }}
                >
                  <CardContent style={{ height: "100%" }}>
                    {/* {uploadLoader && (
                      <Box sx={{ width: "100%", marginBottom: "15px" }}>
                        <LinearProgress />
                      </Box>
                    )} */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                      }}
                    >
                      {isQcApprovalFlag === "true" ? (
                        <div></div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={supplierItemList}
                                            value={selectedItemName}
                                            sx={{ width: 300, marginBottom: '15px' }}
                                            renderInput={(params) => <TextField {...params} label="Search Items" onChange={handleItemChange} />}
                                            onChange={(event, value) => handleSupplierItemChange(value)}
                                            size='small'
                                            disabled={isView ? true : false}
                                        /> */}
                          {!isView && isQcApprovalFlag !== "true" ? (
                            <Button
                              variant="contained"
                              style={{
                                height: "35px",
                                backgroundColor: "#002D68",
                                marginRight: "10px",
                              }}
                              onClick={handleTemplateDownload}
                            >
                              Template
                            </Button>
                          ) : null}
                          {!isView && isQcApprovalFlag !== "true" ? (
                            <Button
                              variant="contained"
                              component="label"
                              htmlFor="upload-photo"
                              sx={{
                                backgroundColor: "#002D68",
                                height: "35px",
                              }}
                              disabled={uploadFileLoader === true}
                            >
                              {uploadFileLoader ? (
                                <CircularProgress
                                  size={24}
                                  style={{ color: "white" }}
                                />
                              ) : (
                                "Upload File"
                              )}
                            </Button>
                          ) : null}
                          <input
                            id="upload-photo"
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (reader.readyState === 2) {
                                    // setUploadLoader(true);
                                    setUploadFileLoader(true);
                                    PurchaseBillWithoutPOXLUpload(
                                      {
                                        file: reader.result,
                                      },
                                      handleItemImportSucess,
                                      handleItemImportException
                                    );
                                  }
                                };
                                reader.readAsDataURL(e.target.files[0]);
                              }
                            }}
                          />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              columnGap: "10px",
                              rowGap: "10px",
                              marginLeft: "10px",
                            }}
                          >
                            <Button
                              variant="contained"
                              style={{
                                width: "100%",
                                height: "35px",
                                background:
                                  userPermission[0]?.addData === 0 || isModuleLocked
                                    ? "gray"
                                    : "#002D68",
                                color:
                                  userPermission[0]?.addData === 0 || isModuleLocked
                                    ? "black"
                                    : "white",
                              }}
                              disabled={userPermission[0]?.addData === 0 || isModuleLocked}
                              onClick={handleClearPage}
                            >
                              New
                            </Button>
                            <Button
                              variant="contained"
                              style={{
                                width: "100%",
                                height: "35px",
                                background:
                                  userPermission[0]?.updateData === 0 || isModuleLocked
                                    ? "gray"
                                    : "#002D68",
                                color:
                                  userPermission[0]?.updateData === 0 || isModuleLocked
                                    ? "black"
                                    : "white",
                              }}
                              disabled={userPermission[0]?.updateData === 0 || isModuleLocked}
                              onClick={() => {
                                setIsView(false);
                                setIsEdit(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              style={{
                                width: "100%",
                                background:
                                  userPermission[0]?.deleteData === 0 || isModuleLocked
                                    ? "gray"
                                    : qcApproval === "1" || previewQcFlag === 1 || isModuleLocked
                                      ? "gray"
                                      : "#002D68",
                                color:
                                  userPermission[0]?.deleteData === 0 || isModuleLocked
                                    ? "white"
                                    : qcApproval === "1" || previewQcFlag === 1
                                      ? "black"
                                      : "white",
                                height: "35px",
                              }}
                              onClick={() => setDeleteDailogOpen(true)}
                              disabled={
                                userPermission[0]?.deleteData === 0 || isModuleLocked
                                  ? true
                                  : qcApproval === "1" || previewQcFlag === 1
                                    ? true
                                    : false
                              }
                            >
                              Delete
                            </Button>
                            <Button
                              variant="contained"
                              style={{
                                width: "100%",
                                background: isModuleLocked ? "gray" : "#002D68",
                                color: "white",
                                height: "35px",
                              }}
                              disabled={isModuleLocked}
                              onClick={handleClearPage}
                            >
                              Clear
                            </Button>
                            <Button
                              variant="contained"
                              style={{
                                width: "100%",
                                background:
                                  userPermission[0]?.print === 0 || isModuleLocked
                                    ? "gray"
                                    : invoiceData.length > 0 &&
                                      (qcApproval === "1" ||
                                        previewQcFlag === 1)
                                      ? "#002D68"
                                      : "gray",
                                color:
                                  userPermission[0]?.print === 0
                                    ? "white"
                                    : invoiceData.length > 0 &&
                                      (qcApproval === "1" ||
                                        previewQcFlag === 1)
                                      ? "white"
                                      : "black",
                                height: "35px",
                              }}
                              disabled={
                                userPermission[0]?.print === 0 || isModuleLocked
                                  ? true
                                  : invoiceData.length > 0 &&
                                    (qcApproval === "1" || previewQcFlag === 1)
                                    ? false
                                    : true
                              }
                              onClick={handlePrintClick}
                            >
                              Print
                            </Button>
                            <Button
                              variant="contained"
                              style={{
                                width: "100%",
                                background: "#002D68",
                                color: "white",
                                height: "35px",
                              }}
                              onClick={() => handleForwardReverse("first", "")}
                            >
                              <FastRewindIcon />
                            </Button>
                            <Button
                              variant="contained"
                              style={{
                                width: "100%",
                                background: "#002D68",
                                color: "white",
                                height: "35px",
                              }}
                              onClick={() =>
                                handleForwardReverse("reverse", mainId)
                              }
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
                              style={{
                                width: "100%",
                                background: "#002D68",
                                color: "white",
                                height: "35px",
                              }}
                              onClick={() =>
                                handleForwardReverse("forward", mainId)
                              }
                            >
                              <SkipNextIcon />
                            </Button>
                            <Button
                              variant="contained"
                              style={{
                                width: "100%",
                                background: "#002D68",
                                color: "white",
                                height: "35px",
                              }}
                              onClick={() => handleForwardReverse("last", "")}
                            >
                              <FastForwardIcon />
                            </Button>
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-end",
                          width: "600px",
                          columnGap: "10px",
                        }}
                      >
                        <Button variant="contained"
                          disabled={isModuleLocked}
                          style={{ height: '35px', backgroundColor: isModuleLocked ? 'gray' : '#002D68' }} onClick={() => navigate('/PurchaseBillWithoutMultiPrint')}>Multi Print</Button>

                        {isView || isEdit || isQcApprovalFlag ? (
                          <Typography
                            style={{
                              color:
                                qcApproval === "1" || previewQcFlag === 1
                                  ? "green"
                                  : "red",
                              fontWeight: "bold",
                              marginRight: "15px",
                              marginTop: "5px",
                              marginRight: "10px",
                            }}
                          >
                            {qcApproval === "1" || previewQcFlag === 1
                              ? "QC AUTHORISED"
                              : "QC PENDING"}
                          </Typography>
                        ) : null}
                        {!isView ? (
                          <Button
                            disabled={loading === true || isModuleLocked}
                            variant="contained"
                            type="submit"
                            style={{
                              height: "35px",
                              backgroundColor: isModuleLocked ? "gray" : "#002D68",
                            }}
                          >
                            {/* {isEdit ? "UPDATE" : "SAVE"} */}
                            {loading ? (
                              <CircularProgress
                                size={24}
                                style={{ color: "white" }}
                              />
                            ) : isEdit ? (
                              "UPDATE"
                            ) : (
                              "SAVE"
                            )}
                          </Button>
                        ) : null}

                        {!isView ? (
                          <Button
                            disabled={loading === true || isModuleLocked}
                            variant="contained"
                            type="submit"
                            style={{
                              height: "35px",
                              backgroundColor: isModuleLocked ? "gray" : "#002D68",
                            }}
                            // Number(transportCode) === 2
                            // "gray"

                            onClick={handleShortClose}
                          >
                            Short Close
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    {/* <div style={{ overflowX: 'scroll' }}> */}
                    <div
                      style={{
                        maxHeight: "80%",   // 👈 set height for scrollable area
                        overflowY: "auto",
                        border: "1px solid #ddd"
                      }}
                    >

                      <table id="transactionTable" style={{ width: "100%", borderCollapse: "collapse" }}>
                        <tr
                          // style={{
                          //   position: "sticky",
                          //   top: "-16px",
                          //   backgroundColor: "#f9f9f9",
                          //   zIndex: 1,
                          // }}
                          style={{ position: 'sticky', top: '-2px', backgroundColor: '#f9f9f9', zIndex: 1 }}
                        >
                          {isQcApprovalFlag === "true" && (
                            <th style={{ whiteSpace: "nowrap" }}>
                              <input
                                type="checkbox"
                                checked={allEligibleSelected}
                                onChange={handleSelectAll}
                              />
                            </th>)}

                          <th style={{ whiteSpace: 'nowrap' }}>Sl No</th>
                          <th style={{ whiteSpace: "nowrap" }}>Part No</th>
                          <th style={{ whiteSpace: "nowrap" }}>Part Name</th>
                          <th style={{ whiteSpace: "nowrap" }}>UOM</th>
                          <th style={{ whiteSpace: "nowrap" }}>QOH</th>
                          <th style={{ whiteSpace: "nowrap" }}>INV QTY</th>
                          <th style={{ whiteSpace: "nowrap" }}>RCVD QTY</th>
                          <th style={{ whiteSpace: "nowrap" }}>ACC QTY</th>
                          <th style={{ whiteSpace: "nowrap" }}>REJ QTY</th>
                          {!qualityWithoutPOModuleView && (
                            <>
                              <th style={{ whiteSpace: "nowrap" }}>PB Rate</th>
                              <th style={{ whiteSpace: "nowrap" }}>PB Amt</th>
                              <th style={{ whiteSpace: "nowrap" }}>LOT</th>
                              <th style={{ whiteSpace: "nowrap" }}>Item Ledger</th>

                              <th style={{ whiteSpace: "nowrap" }}>Item Remarks</th>
                              <th style={{ whiteSpace: "nowrap" }}>LND Cost</th>
                              <th style={{ whiteSpace: "nowrap" }}>LND Rate</th>
                            </>
                          )}
                          {isQcApprovalFlag === "true" && (
                            <>
                              <th style={{ whiteSpace: "nowrap" }}>Conversion Part</th>
                              <th style={{ whiteSpace: "nowrap" }}>Conversion Qty</th>
                              <th style={{ whiteSpace: "nowrap" }}>Item Group</th>
                              <th style={{ whiteSpace: "nowrap" }}>
                                Display Name
                              </th>
                              <th style={{ whiteSpace: "nowrap" }}>
                                QC Req
                              </th>
                              <th style={{ whiteSpace: "nowrap" }}>
                                QC R Completed
                              </th>
                            </>
                          )}
                          <th style={{ whiteSpace: "nowrap" }}>Actions</th>
                        </tr>
                        {selectedItems.map((item, index) => {
                          const totalLotQty = item.lotQtyData
                            ? item.lotQtyData.reduce(
                              (total, item) =>
                                total + (item.lotQty ? Number(item.lotQty) : 0),
                              0
                            )
                            : 0;
                          return (
                            <tr key={index}>

                              {isQcApprovalFlag === "true" && (
                                <td style={{ whiteSpace: "nowrap" }}>
                                  <input
                                    type="checkbox"
                                    checked={selectedRowIds.includes(item.id)}
                                    onChange={() => handleRowSelect(item.id)}
                                    disabled={Number(item.rcvdQty) > 0}
                                  />
                                </td>)}
                              <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{index + 1}</td>
                              <td
                                style={{ whiteSpace: "nowrap" }}
                                contentEditable={false}
                              >
                                {item.itemCode ? (
                                  <span>{item.itemCode}</span>
                                ) : (
                                  <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={supplierItemList}
                                    // value={selectedItemName}
                                    sx={{ width: 300 }}
                                    getOptionLabel={(option) =>
                                      `𝐈𝐭𝐞𝐦 𝐂𝐨𝐝𝐞: ${option?.label} | 𝐑𝐚𝐭𝐞: ${option.pbRate}` ||
                                      ""
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Search Items"
                                        onChange={handleItemChange}
                                        sx={{
                                          "& .MuiInputBase-root": {
                                            height: "35px",
                                            fontSize: "12px",
                                            backgroundColor: "#ffffff",
                                            borderRadius: "5px",
                                          },
                                          "& .MuiInputBase-input": {
                                            padding: "0 8px",
                                          },
                                          "& .MuiInputLabel-root": {
                                            fontSize: "12px",
                                            lineHeight: "1.2",
                                          },
                                        }}
                                      />
                                    )}
                                    onChange={(event, value) =>
                                      handleSupplierItemChange(value)
                                    }
                                    size="small"
                                    disabled={isView ? true : false}
                                    PopperComponent={CustomPopper}
                                  />
                                )}
                              </td>
                              <td style={{ whiteSpace: "nowrap" }}>
                                {item.itemName}
                              </td>
                              <td style={{ whiteSpace: "nowrap" }}>{item.uom}</td>
                              <td style={{ whiteSpace: "nowrap" }}>
                                {item.totStk}
                              </td>
                              <td
                                style={{ whiteSpace: "nowrap" }}
                                contentEditable={!isView}
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
                              <td
                                style={{ whiteSpace: "nowrap" }}
                                contentEditable={!isView}
                                onBlur={(e) =>
                                  handleEdit(
                                    "rcvdQty",
                                    e.target.textContent,
                                    item.id,
                                    item
                                  )
                                }
                              >
                                {item.rcvdQty}
                              </td>
                              <td
                                style={{ whiteSpace: "nowrap" }}
                                contentEditable={!isView}
                                onBlur={(e) =>
                                  handleEdit(
                                    "accQty",
                                    e.target.textContent,
                                    item.id,
                                    item
                                  )
                                }
                              >
                                {item.accQty}
                              </td>
                              <td
                                style={{ whiteSpace: "nowrap" }}
                                contentEditable={!isView}
                                onBlur={(e) =>
                                  handleEdit(
                                    "rejQty",
                                    e.target.textContent,
                                    item.id,
                                    item
                                  )
                                }
                              >
                                {item.rejQty}
                              </td>
                              {!qualityWithoutPOModuleView && (
                                <>
                                  <td
                                    style={{ whiteSpace: "nowrap" }}
                                    contentEditable={!isView}
                                    onBlur={(e) =>
                                      handleEdit(
                                        "pbRate",
                                        e.target.textContent,
                                        item.id,
                                        item
                                      )
                                    }
                                  >
                                    {item.pbRate}
                                  </td>
                                  <td style={{ whiteSpace: "nowrap" }}>
                                    {item.pbAmt}
                                  </td>
                                  {/* <td style={{ whiteSpace: 'nowrap' }} contentEditable={true}>{item.location}</td> */}
                                  <td
                                    style={{ whiteSpace: "nowrap" }}
                                    contentEditable={false}
                                    {...(item.shelfLifeItem !== "N" && {
                                      onDoubleClick: () =>
                                        handleCellClick("lotQtyData", item),
                                    })}
                                  >
                                    {item.id === "RDL1"
                                      ? null
                                      : `Loc: ${item.location || ""
                                      } Lot Qty: ${totalLotQty}`}
                                  </td>
                                  <td style={{ whiteSpace: "nowrap" }}>
                                    {item.iLedger}
                                  </td>

                                  <td
                                    style={{ whiteSpace: "nowrap" }}
                                    contentEditable={!isView}
                                    onBlur={(e) =>
                                      handleEdit(
                                        "itemRemarks",
                                        e.target.textContent,
                                        item.id,
                                        item
                                      )
                                    }
                                  >
                                    {item.itemRemarks}
                                  </td>
                                  <td style={{ whiteSpace: "nowrap" }}>
                                    {item.id === "RDL1" ? null : item.lndCost}
                                  </td>
                                  <td style={{ whiteSpace: "nowrap" }}>
                                    {item.id === "RDL1" ? null : item.lndRate}
                                  </td>
                                </>)}
                              {isQcApprovalFlag === "true" && (
                                <>
                                  <td style={{ whiteSpace: "nowrap" }}>
                                    {item.conversionPart || "-"}
                                  </td>

                                  <td
                                    style={{ whiteSpace: "nowrap" }}
                                    contentEditable={!isView}
                                    onBlur={(e) =>
                                      handleEdit(
                                        "conversionQty",
                                        e.target.textContent,
                                        item.id,
                                        item
                                      )
                                    }
                                  >
                                    {item.conversionQty}
                                  </td>
                                  <td
                                    style={{ whiteSpace: "nowrap" }}
                                    contentEditable={false}
                                  >
                                    {item.itemGroupName}
                                  </td>
                                  <td
                                    style={{ whiteSpace: "nowrap" }}
                                    contentEditable={false}
                                  >
                                    {item.displayName}
                                  </td>
                                  <td
                                    style={{ whiteSpace: "nowrap" }}
                                    contentEditable={false}
                                  >
                                    {item.batchQty}
                                  </td>
                                  <td
                                    style={{ whiteSpace: "nowrap" }}
                                    contentEditable={false}
                                  >
                                    {item.poBillDtld_count}
                                  </td>
                                </>
                              )}
                              {/* <td
                          style={{ whiteSpace: "nowrap", textAlign: "center" }}
                          contentEditable={!isView}
                        >
                          {item.id !== "RDL1" && (
                            <>
                              {!isView ? (
                                <DeleteIcon
                                  onClick={() => handleDeleteRow(item.id)}
                                  style={{ color: "black", cursor: "pointer" }}
                                />
                              ) : (
                                <DeleteIcon
                                  style={{ color: "gray", cursor: "pointer" }}
                                />
                              )}

                              {isQcApprovalFlag === "true" && (
                                <>
                                  <Tooltip title="Report">
                                    <SummarizeIcon
                                      size="small"
                                      variant="text"
                                      style={{ color: "#002D68" }}
                                    />
                                  </Tooltip>
                                  <Tooltip title="View">
                                    <RemoveRedEyeIcon
                                      style={{ color: "#002D68" }}
                                    />
                                  </Tooltip>
                                </>
                              )}
                            </>
                          )}
                        </td> */}
                              <td
                                contentEditable={false}
                                style={{
                                  textAlign: "center",
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                {item.id === "RDL1" ? null : !isView ? (
                                  <>
                                    {isQcApprovalFlag === "true" ? (
                                      <DeleteIcon
                                        style={{
                                          color: "gray",
                                          cursor: "pointer",
                                        }}
                                      />
                                    ) : (
                                      <DeleteIcon
                                        onClick={() => {
                                          handleDeleteRow(item.id);
                                        }}
                                        style={{
                                          color: "black",
                                          cursor: "pointer",
                                        }}
                                      />
                                    )}
                                    {isQcApprovalFlag === "true" ? (
                                      <>
                                        <Tooltip title="Report">
                                          <SummarizeIcon
                                            size="small"
                                            variant="text"
                                            style={{ color: "#002D68" }}
                                            onClick={() => {
                                              setIsProcessInsp(true);
                                              setInspectionView(true);
                                              setPoBillDetailId(
                                                item?.poBillDtlId
                                              );
                                              setPoBillId(item?.poBillId);
                                              setRowItemId(item?.itemId);
                                              setRowPoNumber(item?.poNo);
                                              setRowAccQty(item?.accQty);
                                              setReportRowData(item);
                                              console.log(
                                                ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
                                                item
                                              );
                                            }}
                                          />
                                        </Tooltip>
                                        <Tooltip title="View">
                                          <RemoveRedEyeIcon
                                            style={{ color: "#002D68" }}
                                            onClick={() => {
                                              setPdfOpen(true);
                                              setSelectedRowItemCode(
                                                item.itemCode
                                              );
                                            }}
                                          />
                                        </Tooltip>
                                      </>
                                    ) : null}
                                  </>
                                ) : (
                                  <>
                                    <DeleteIcon
                                      style={{ color: "gray", cursor: "pointer" }}
                                    />
                                    {isQcApprovalFlag === "true" ? (
                                      <>
                                        <Tooltip title="Report">
                                          <SummarizeIcon
                                            size="small"
                                            variant="text"
                                            style={{ color: "#002D68" }}
                                          />
                                        </Tooltip>
                                        <Tooltip title="View">
                                          <RemoveRedEyeIcon
                                            style={{ color: "#002D68" }}
                                          />
                                        </Tooltip>
                                      </>
                                    ) : null}
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </table>
                    </div>

                    {/* <DataGrid
                                    rows={selectedItems}
                                    columns={middleGridColumns}
                                    pageSize={8}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    sx={{
                                        '& .super-app-theme--header': {
                                            WebkitTextStrokeWidth: '0.6px',
                                            backgroundColor: '#93bce6',
                                            color: '#1c1919'

                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696',
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696',
                                        },
                                    }}
                                    style={{ height: '310px' }}
                                    getRowClassName={(params) => {
                                        // Find the index of the row within the rows array
                                        const rowIndex = selectedItems.findIndex(row => row.id === params.row.id);
                                        // Check if the index is valid
                                        if (rowIndex !== -1) {
                                            console.log(' ');
                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }
                                        return ''; // Return default class if index is not found
                                    }}

                                    processRowUpdate={handleCellEdit}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                /> */}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Dialog
              open={viewMoreModal}
              onClose={() => setViewMoreModal(false)}
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
                Purchase Bill Without PO
              </DialogTitle>

              <DialogContent
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  rowGap: "10px",
                  columnGap: "10px",
                }}
              >
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
                        GST DETAILS
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
                        GRN  No
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          required
                          value={getPoNumber}
                        // onChange={(e) => setGrnRefNo(e.target.value)}
                        // disabled={true}
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
                        Supplier Invoice No
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          required
                          value={supplierInvoiceNo}
                          onChange={(e) => setSupplierInvoiceNo(e.target.value)}
                          onBlur={(e) => {
                            CheckValidSuppInvNo(
                              {
                                code: e.target.value,
                                supplierSid: supId,
                              },
                              handleCheckSuccess,
                              handleCheckException
                            );
                          }}
                          disabled={
                            isView || isQcApprovalFlag === "true" ? true : false
                          }
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
                        SupplierInvoice Date
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          required
                          type="date"
                          value={supplierInvoiceDate}
                          onChange={(e) =>
                            setSupplierInvoiceDate(e.target.value)
                          }
                          disabled={
                            isView || isQcApprovalFlag === "true" ? true : false
                          }
                          max={formatDateToYYYYMMDD(selectedDate)} // Convert selectedDate to YYYY-MM-DD format
                          inputProps={{
                            max: formatDateToYYYYMMDD(selectedDate), // Convert selectedDate to YYYY-MM-DD format
                          }}
                        />
                      </td>
                    </tr>
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          BOE No
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={boeNo}
                            onChange={(e) => setBOENo(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          BOE Date
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            type="date"
                            value={boeDate}
                            onChange={(e) => setBOEDate(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          Packing List No
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={packingListNo}
                            onChange={(e) => setPackingListNo(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          Packing Date
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            type="date"
                            required
                            value={packingDate}
                            onChange={(e) => setPackingDate(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() === "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          Supplier DC No
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={cSupplierDcNo}
                            onChange={(e) =>
                              setCSupplierDcNumber(e.target.value)
                            }
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() === "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          Supplier DC Date
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            type="date"
                            value={supplierDcDate}
                            onChange={(e) => setSupplierDcDate(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {/* <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>EXG Rate</th>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            size='small'
                                            required
                                            value={exgRate}
                                            onChange={(e) => setExgRate(e.target.value)}
                                            disabled={isView || isQcApprovalFlag === 'true' ? true : false}
                                        />
                                    </td>
                                </tr> */}
                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        EXG Rate
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          required
                          value={exgRate}
                          onChange={(e) => setExgRate(e.target.value)}
                          disabled={
                            isView ||
                              isQcApprovalFlag === "true" ||
                              supplierCountry.toUpperCase() === "INDIA"
                              ? true
                              : false
                          }
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
                        Currency [MST]
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          required
                          disabled={true}
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        GST Type
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {/* <TextField
                                            fullWidth
                                            size='small'
                                            required
                                            value={gstType}
                                            onChange={(e) => setGstType(e.target.value)}
                                            disabled={isView || isQcApprovalFlag === 'true' ? true : false}
                                        /> */}
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            GST Type
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={gstType}
                            size="small"
                            label="GST Type"
                            onChange={(e) => setGstType(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          >
                            <MenuItem value={"CGST/SGST"}>CGST/SGST</MenuItem>
                            <MenuItem value={"IGST"}>IGST</MenuItem>
                          </Select>
                        </FormControl>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* ////////////////////////// */}
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
                        AMOUNT DETAILS
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
                          whiteSpace: "nowrap",
                        }}
                      >
                        Total Qty
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          required
                          value={totalQty}
                          disabled={
                            isView || isQcApprovalFlag === "true" ? true : false
                          }
                        />
                      </td>
                    </tr>

                    {/* IF THE COUNTRY IS INDIA */}
                    {supplierCountry.toUpperCase() === "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Gross Amount
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={grossAmount}
                            // onChange={(e) => setGrossAmount(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() === "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Less Discount
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={lessDiscount}
                            type="number"
                            onChange={(e) => setLessDiscount(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() === "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Transport
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={transport}
                            type="number"
                            onChange={(e) => setTransport(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() === "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Coolie
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={coolie}
                            type="number"
                            onChange={(e) => setCoolie(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() === "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Sub Total
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={subTotal}
                            // onChange={(e) => setSubTotal(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() === "INDIA" &&
                      supplierSate.toUpperCase() === "KARNATAKA" &&
                      gstType === "CGST/SGST" ? (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          CGST
                        </th>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            type="number"
                            value={cgstPercent}
                            placeholder="%"
                            onChange={(e) => setCGSTPercent(e.target.value)}
                            style={{ marginRight: "5px" }}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={cgst}
                            // onChange={(e) => setCGST(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    ) : (
                      ""
                    )}
                    {supplierCountry.toUpperCase() === "INDIA" &&
                      supplierSate.toUpperCase() === "KARNATAKA" &&
                      gstType === "CGST/SGST" ? (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          SGST
                        </th>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={sgstPercent}
                            type="number"
                            placeholder="%"
                            onChange={(e) => setSGSTPercent(e.target.value)}
                            style={{ marginRight: "5px" }}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={sgst}
                            // onChange={(e) => setSGST(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    ) : (
                      ""
                    )}
                    {/* FOR OUT OFF STATE */}
                    {
                      /*supplierSate.toUpperCase() !== 'KARNATAKA' || */ gstType ===
                        "IGST" ? (
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                              whiteSpace: "nowrap",
                            }}
                          >
                            IGST
                          </th>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              required
                              value={igstPercent}
                              type="number"
                              placeholder="%"
                              onChange={(e) => setIGSTPercent(e.target.value)}
                              style={{ marginRight: "5px" }}
                              disabled={
                                isView ||
                                  isQcApprovalFlag === "true" ||
                                  utgstPercent
                                  ? true
                                  : false
                              }
                            />
                            <TextField
                              fullWidth
                              size="small"
                              required
                              value={igst}
                              // onChange={(e) => setIGST(e.target.value)}
                              disabled={
                                isView || isQcApprovalFlag === "true"
                                  ? true
                                  : false
                              }
                            />
                          </td>
                        </tr>
                      ) : (
                        ""
                      )
                    }
                    {/* // */}
                    {/* {supplierCountry.toUpperCase() === 'INDIA' && <tr style={{ borderBottom: '1px solid #ddd' }}> */}
                    {
                      /*supplierSate.toUpperCase() !== 'KARNATAKA' || */ gstType ===
                        "IGST" ? (
                        <tr style={{ borderBottom: "1px solid #ddd" }}>
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              fontWeight: "bold",
                              whiteSpace: "nowrap",
                            }}
                          >
                            UTGST
                          </th>
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "8px",
                              display: "flex",
                              flexDirection: "row",
                            }}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              required
                              value={utgstPercent}
                              type="number"
                              placeholder="%"
                              onChange={(e) => setUTGSTPercent(e.target.value)}
                              style={{ marginRight: "5px" }}
                              disabled={
                                isView ||
                                  isQcApprovalFlag === "true" ||
                                  igstPercent
                                  ? true
                                  : false
                              }
                            />
                            <TextField
                              fullWidth
                              size="small"
                              required
                              value={utgst}
                              // onChange={(e) => setUTGST(e.target.value)}
                              disabled={
                                isView || isQcApprovalFlag === "true"
                                  ? true
                                  : false
                              }
                            />
                          </td>
                        </tr>
                      ) : (
                        ""
                      )
                    }
                    {supplierCountry.toUpperCase() === "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Total
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={total}
                            // onChange={(e) => setTotal(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() === "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          TDS
                        </th>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            type="number"
                            value={tdsPercent}
                            placeholder="%"
                            onChange={(e) => setTDSPercent(e.target.value)}
                            style={{ marginRight: "5px" }}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={tds}
                            // onChange={(e) => setTDS(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() === "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          TCS
                        </th>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={tcsPercent}
                            type="number"
                            placeholder="%"
                            onChange={(e) => setTCSPercent(e.target.value)}
                            style={{ marginRight: "5px" }}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={tcs}
                            // onChange={(e) => setTCS(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {/* {supplierCountry.toUpperCase() === 'INDIA' && <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Others</th>
                                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                                    <TextField
                                                                        fullWidth
                                                                        size='small'
                                                                        type='string'
                                                                        required
                                                                        value={others}
                                                                        onChange={(e) => setOthers(e.target.value)}
                                                                        disabled={isView || isQcApprovalFlag === 'true' ? true : false}
                                                                    />
                                                                </td>
                                                            </tr>} */}
                    {/* COUNTRY INDIA ENDS HERE */}

                    {/* FOR INTERNATIONAL */}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Gross Amount INR
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={grossAmountINR}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Misc Charges
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={miscCharges}
                            type="number"
                            onChange={(e) => setMiscCharges(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Subtotal GRS & Misc
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={subTotalGrsAndMisc}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Insurance
                        </th>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={insurancePercent}
                            type="number"
                            placeholder="%"
                            onChange={(e) =>
                              setInsurancePercent(e.target.value)
                            }
                            style={{ marginRight: "5px" }}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={insurance}
                            type="number"
                            onChange={(e) => setInsurance(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Freight
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={freight}
                            type="number"
                            onChange={(e) => setFreight(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Subtotal INS & Freight
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={subTotalINSAndFreight}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          BCD
                        </th>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={bcdPercent}
                            type="number"
                            placeholder="%"
                            onChange={(e) => setBCDPercent(e.target.value)}
                            style={{ marginRight: "5px" }}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={bcd}
                            type="number"
                            onChange={(e) => setBCD(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Social Welfare Charges
                        </th>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={socialWelfareChargesPercent}
                            type="number"
                            placeholder="%"
                            onChange={(e) =>
                              setSocialWelfareChargesPercent(e.target.value)
                            }
                            style={{ marginRight: "5px" }}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={socialWelfareCharges}
                            type="number"
                            onChange={(e) =>
                              setSocialWelfareCharges(e.target.value)
                            }
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Subtotal SW & BCD
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={subTotalSwAndBCD}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Import GST %
                        </th>
                        <td
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            display: "flex",
                            flexDirection: "row",
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={importGSTPercent}
                            type="number"
                            placeholder="%"
                            onChange={(e) =>
                              setImportGSTPercent(e.target.value)
                            }
                            style={{ marginRight: "5px" }}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={importGST}
                            // onChange={(e) => setImportGST(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Total With GST
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={totalWithGST}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Freight Charges
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            required
                            value={freightCharges}
                            type="number"
                            onChange={(e) => setFreightCharges(e.target.value)}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {supplierCountry.toUpperCase() !== "INDIA" && (
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <th
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Local Clearance Charges
                        </th>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            required
                            value={localClearanceCharges}
                            onChange={(e) =>
                              setLocalClearanceCharges(e.target.value)
                            }
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}
                    {/* INTERNATIONAL ENDS HERE */}

                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Others
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="string"
                          required
                          value={others}
                          onChange={(e) => setOthers(e.target.value)}
                          disabled={
                            isView || isQcApprovalFlag === "true" ? true : false
                          }
                        />
                      </td>
                    </tr>

                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Grand Total
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          required
                          value={grandTotal}
                          disabled={
                            isView || isQcApprovalFlag === "true" ? true : false
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* /////////////////////////////// */}
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
                        QC DETAILS
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
                        Remarks
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          disabled={
                            isView || isQcApprovalFlag === "true" ? true : false
                          }
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
                        IR No
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          required
                          value={irNo}
                          onChange={(e) => setIrNo(e.target.value)}
                          disabled={!isQcApprovalFlag ? true : false}
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
                        Car No
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          required
                          value={carNo}
                          onChange={(e) => setCarNo(e.target.value)}
                          disabled={!isQcApprovalFlag ? true : false}
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
                        Bin No
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          required
                          value={binNo}
                          onChange={(e) => setBinNo(e.target.value)}
                          disabled={!isQcApprovalFlag ? true : false}
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
                        QC Authorise
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={qcAuthorise}
                          onChange={(e) => setQcAuthorise(e.target.value)}
                          disabled={!isQcApprovalFlag ? true : false}
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
                        QC Authorise By
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={
                            isQcApprovalFlag === "true"
                              ? userDetails?.userName
                              : isView || isEdit
                                ? qcAuthoriseBy
                                : ""
                          }
                          // {userDetails?.userName}
                          // onChange={(e) => setQcAuthoriseBy(e.target.value)}
                          disabled={!isQcApprovalFlag ? true : false}
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
                        QC Authorise Date
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          value={qcAuthoriseDate}
                          onChange={(e) => setQcAuthoriseDate(e.target.value)}
                          disabled={!isQcApprovalFlag ? true : false}
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
                        QC Remarks
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={qcRemarks}
                          onChange={(e) => setQcRemarks(e.target.value)}
                          disabled={!isQcApprovalFlag ? true : false}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setViewMoreModal(false)}>Close</Button>
              </DialogActions>
            </Dialog>
          </form>

          {/* MODALS */}
          <NotificationBar
            handleClose={handleClose}
            notificationContent={openNotification.message}
            openNotification={openNotification.status}
            type={openNotification.type}
          />

          <JobWorkWithoutPoModal
            // setJobWorkReceiptModal={setJobWorkReceiptModal}
            // jobWorkReceiptModal={jobWorkReceiptModal}
            // setJobWorkReceipt={setJobWorkReceipt}
            // supplierId={supplierIdCopy}
            // billingAddress={billingAddressCopy}
            // supplierSelect={supplierSelectCopy}
            // supplierInvoiceNoCopy={supplierInvoiceNoCopy}
            // supplierInvoiceDateCopy={supplierInvoiceDateCopy}
            // cSupplierDcNoCopy={cSupplierDcNoCopy}
            // supplierDcDateCopy={supplierDcDateCopy}
            WithoutsetJobWorkReceiptModal={setJobWorkReceiptModal}
            WithoutjobWorkReceiptModal={jobWorkReceiptModal}
            WithoutsetJobWorkReceipt={setJobWorkReceipt}
            WithoutsupplierId={supplierIdCopy}
            WithoutbillingAddress={billingAddressCopy}
            WithoutsupplierSelect={supplierSelectCopy}
            WithoutsupplierInvoiceNoCopy={supplierInvoiceNoCopy}
            WithoutsupplierInvoiceDateCopy={supplierInvoiceDateCopy}
            WithoutcSupplierDcNoCopy={cSupplierDcNoCopy}
            WithoutsupplierDcDateCopy={supplierDcDateCopy}
          />
          <LotEntryModal
            setLotEntryModalOpen={setLotEntryModalOpen}
            lotEntryModalOpen={lotEntryModalOpen}
            cellData={cellData}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            rowData={rowData}
            setRowData={setRowData}
          />

          <DeleteConfirmationDailog
            open={deleteDailogOpen}
            setOpen={setDeleteDailogOpen}
            deleteId={{ id: digit, prefix: poType }}
            // selectedMaster={selectedMaster}
            deleteService={DeletePurchaseBillWithoutPO}
            handleSuccess={deletehandleSuccess}
            handleException={deletehandleException}
          />

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
              GOODS RECEIPT NOTE-INPUT
            </DialogTitle>

            <DialogContent style={{ padding: "2px" }}>
              {pdfUrl && (
                <embed
                  src={pdfUrl}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                />
              )}
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setPdfModalOpen(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>

          <MultiFileViewer
            pdfOpen={pdfOpen}
            setPdfOpen={setPdfOpen}
            // fileTypeForView={fileTypeForView}
            selectedRowItemCode={selectedRowItemCode}
          />
        </>
      )}
    </div>
  );
};

export default PurchaseBillWithoutPOModule;
