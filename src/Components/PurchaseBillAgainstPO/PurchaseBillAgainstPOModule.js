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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import React, { useEffect, useState } from "react";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { Card } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SummarizeIcon from "@mui/icons-material/Summarize";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { DataGrid } from "@mui/x-data-grid";
import { CheckBox } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import {
  GetPurchaseBillSuppList,
  GetPurchaseBillSuppListItemList,
  PurchaseBillFormSubmit,
  getPurchaseBillDetails,
  GetPOBillUniqueID,
  // genarateGrnNumber,
  PurchaseBillPreview,
  PurchaseBillXLUpload,
  PurchaseBillDataPreview,
  UpdatePurchaseBillAgainstPO,
  GetPoBillAllSuppList,
  PurchaseBillAgainstPoPreview,
  DeletePurchaseBillAgainstPO,
  GetGeneratedPo,
  GetSupplierPendingPo,
  GetSupplierPendingDC,
  CheckValidSuppInvNo,
  handleCheckPoFreight,
  QcInwardFileUpload,
  PurchaseBillShortClose,
} from "../../ApiService/LoginPageService";
import PurchaseBillAgainstPOTitle from "./PurchaseBillAgainstPOTitle";
import ChangeAddressModal from "./ChangeAddressModal/ChangeAddressModal";
import "../../App.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadPendingPO from "./LoadPendingPO/LoadPendingPO";
import FileUploadModule from "./FileUpload/FileUploadModule";
import {
  PurchaseBillAgaintsPOTemplate,
  PurchaseBillAgaintsPOTemplateNew,
} from "../../ApiService/DownloadCsvReportsService";
import JobworkReceiptModal from "./JobworkReceiptModal/JobworkReceiptModal";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ApplicationStore from "../../Utility/localStorageUtil";
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
import LotEntryModal from "./LotEntryModal/LotEntryModal";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import { type } from "@testing-library/user-event/dist/type";
import InwardQualityFPIResult from "./InwardQualityFPI/InwardQualityFPIResult";
import MultiFileViewer from "../ProcessInspection/MultiFileViewer";
import { useSearchParams } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useModuleLocks } from "../context/ModuleLockContext";

const PurchaseBillAgaintPOModule = ({
  open,
  setOpen,
  isAddButton,
  editeData,
  setRefreshData,
}) => {
  const navigate = useNavigate();
  const { userDetails } = ApplicationStore().getStorage("userDetails");
  const userPermission = userDetails?.groupRights?.filter(
    (data) => data?.menu?.toLowerCase() === "purchasebill"
  );

  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Purchase Bill Against PO")?.lockStatus === "locked";

  const [selectedItem, setSelectedItem] = useState(null);

  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [itemSearch, setItemSearch] = useState("");
  const [rowId, setRowId] = useState("");
  const [isAccountable, setIsAccountable] = useState(true);
  console.log("isAccountableisAccountable", isAccountable); // true = Accountable, false = Non-Accountable
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [suppplierList, setSupplierList] = useState([]);
  const [digit, setDigit] = useState("");
  const [getPoNumber, setGetPoNumber] = useState("");
  const [poType, setPoType] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [supplierIdCopy, setSupplierIdCopy] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingAddressCopy, setBillingAddressCopy] = useState("");
  const [grnRefNo, setGrnRefNo] = useState("");
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState("");
  const [supplierInvoiceNoCopy, setSupplierInvoiceNoCopy] = useState("");
  const [supplierInvoiceDate, setSupplierInvoiceDate] = useState("");
  const [supplierInvoiceDateCopy, setSupplierInvoiceDateCopy] = useState("");
  const [cSupplierDcNo, setCSupplierDcNumber] = useState("");
  const [cSupplierDcNoCopy, setCSupplierDcNumberCopy] = useState("");
  const [supplierDcDate, setSupplierDcDate] = useState("");
  const [supplierDcDateCopy, setSupplierDcDateCopy] = useState("");
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
  const [supplierSelectCopy, setSupplierSelectCopy] = useState("");
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
  const [jobWorkReceipt, setJobWorkReceipt] = useState(false);
  const [jobWorkReceiptModal, setJobWorkReceiptModal] = useState(false);
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
  const [pruchaseOrderDigit, setPurchaseOrderDigit] = useState("");
  const [genPoBillFlag, setGenPoBillFlag] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [lotEntryModalOpen, setLotEntryModalOpen] = useState(false);
  const [cellData, setCellData] = useState("");
  const [rowData, setRowData] = useState([]);
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [previewQcFlag, setPreviewQcFlag] = useState(0);
  const [selectedGeneratedPo, setSelectedGeneratedPo] = useState("");
  const [generatedPoLists, setGeneratedPoLists] = useState([]);
  const [transportCode, setTransportCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadFileLoader, setUploadFileLoader] = useState(false);
  const [invoiceUploadLoader, setInvoiceUploadLoader] = useState(false);
  const [importRoundOff, setImportRoundOff] = useState("");
  const [selectedRowIds, setSelectedRowIds] = React.useState([]);

  // QUALITY REPORT
  const [isProcessInsp, setIsProcessInsp] = useState(false);
  const [poBillDetailId, setPoBillDetailId] = useState("");
  const [rowItemId, setRowItemId] = useState("");
  const [rowPoNumber, setRowPoNumber] = useState("");
  const [rowAccQty, setRowAccQty] = useState("");
  const [reportRowData, setReportRowData] = useState("");
  const [pdfOpen, setPdfOpen] = useState(false);
  const [selectedRowItemCode, setSelectedRowItemCode] = useState("");

  // FORWARD REVERSE
  const [mainId, setMainId] = useState("");
  const [viewMoreModal, setViewMoreModal] = useState(false);

  const location = useLocation();
  const selectName = new URLSearchParams(location.search).get("selectName");
  const selectId = new URLSearchParams(location.search).get("selectId");
  const selectPotype = new URLSearchParams(location.search).get("selectPotype");
  const selectdigit = new URLSearchParams(location.search).get("selectdigit");
  const selectPo = new URLSearchParams(location.search).get("selectPo");
  const selectspAddress = new URLSearchParams(location.search).get(
    "selectspAddress"
  );
  const selectsupId = new URLSearchParams(location.search).get("selectsupId");

  // PURCHASE BILL PREVIEW
  const isPOBillView = new URLSearchParams(location.search).get("isPOBillView");
  const poBillDigit = new URLSearchParams(location.search).get("poBillDigit");

  // PURCHASE ORDER GENERATE
  const isGenPOBill = new URLSearchParams(location.search).get("isGenPOBill");
  const selectedSuppName = new URLSearchParams(location.search).get(
    "selectedSuppName"
  );
  const selectedPodigit = new URLSearchParams(location.search).get(
    "selectedPodigit"
  );
  const selectedSpAddress = new URLSearchParams(location.search).get(
    "selectedSpAddress"
  );
  const selectedsupId = new URLSearchParams(location.search).get(
    "selectedsupId"
  );
  const selectedCurrency = new URLSearchParams(location.search).get(
    "selectedCurrency"
  );
  const selectedCurrencyId = new URLSearchParams(location.search).get(
    "selectedCurrencyId"
  );

  // AGAINST PO ROUTE DATA
  // const isView = new URLSearchParams(location.search).get('isView');
  const PBNo = new URLSearchParams(location.search).get("PBNo");
  const qcApproval = new URLSearchParams(location.search).get("qcApproval");
  const isQcApprovalFlag = new URLSearchParams(location.search).get(
    "isQcApprovalFlag"
  );
  const isType = new URLSearchParams(location.search).get("isType");
  const [searchParams] = useSearchParams();
  const qualityModuleView = searchParams.get("qualityModuleView") === "true";
  //AGAINST PO EDIT
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

  const DisableEdit = qcApproval === 1 || previewQcFlag === 1;

  useEffect(() => {
    // !isPOBillView && !isView && !isEdit && genarateGrnNumber(handleGrnSucess, handleGrnException)
    if (!isProcessInsp) {
      PurchaseBillDataPreview(
        {
          digit: PBNo,
          prefix: poType || isType,
        },
        handlePOBillPreviewSuccess,
        handlePOBillPreviewException
      );
    }
    if (isPOBillView) {
      PurchaseBillPreview(
        {
          poDigit: poBillDigit,
          prefix: poType,
        },
        handlePOBillPreviewSuccess,
        handlePOBillPreviewException
      );
    }

    // PURCHASE BILL RESULT TO MODAL PO BILL VIEW
    if (isView || isEdit || isQcApprovalFlag) {
      PurchaseBillDataPreview(
        {
          digit: PBNo,
          prefix: poType || isType,
        },
        handlePOBillPreviewSuccess,
        handlePOBillPreviewException
      );
    }

    // PURCHASE BILL GENERATE FROM PURCHASE BILL VIEW
    if (isGenPOBill) {
      setGenPoBillFlag(isGenPOBill);
      setSupplierSelect(selectedSuppName);
      setPurchaseOrderDigit(selectedPodigit);
      setBillingAddress(selectedSpAddress);
      setSupplierSid(selectedsupId);
      setCurrency(selectedCurrency);
      setCurrencyId(selectedCurrencyId);
    }

    !isPOBillView &&
      !isGenPOBill &&
      !isView &&
      !isEdit &&
      GetPurchaseBillSuppList(
        handleSupplierListSuccess,
        handleSupplierListFailed
      );
    loaderData();

    if (!isQcApprovalFlag) {
      handleForwardReverse("last", "");
    }
  }, [editeData, isGenPOBill, selectedPodigit, isType, !isProcessInsp]);

  // FOR MANULA ENTRY IN PO BILL
  useEffect(() => {
    if (poType === "R") {
      GetSupplierPendingPo(
        { supTabId: supplierId },
        handleSuppPOSucessShow,
        handleSuppPOExceptionShow
      );
    }
    if (poType === "J") {
      GetSupplierPendingDC(
        { supTabId: supplierId },
        handleSuppPOSucessShow,
        handleSuppPOExceptionShow
      );
    }
    setItemSearch("");
    setSelectedItem(null);
  }, [poType, supplierId]);

  const handleSuppPOSucessShow = (dataObject) => {
    setSupplierItemList(dataObject?.data || []);
  };
  const handleSuppPOExceptionShow = (errorObject, errorMessage) => { };

  /////////////////////////////////END////////////////////////////////////

  // GRN HANDLER
  const handleGrnSucess = (dataObject) => {
    setGrnRefNo(dataObject?.grnRefNO || []);
  };
  const handleGrnException = () => { };

  // POBILL PREVIEW
  const handlePOBillPreviewSuccess = (dataObject) => {
    setInvoiceData(dataObject.data || []);

    const data = dataObject.data[0];
    setSupplierId(data?.supId || "");
    setSupplierIdCopy(data?.supId || "");
    setSupplierSelectCopy(data?.suppName || "");
    setBillingAddressCopy(data?.spAddress || "");
    setPoType(data?.type || "");
    setDigit(data?.digit || "");
    setGetPoNumber(data?.poNo || "");
    setSupplierSelect(data?.suppName || "");
    setSelectedDate(data?.date || "");
    setBillingAddress(data?.spAddress || "");
    setGrnRefNo(data?.grnRefNO || "");
    setSupplierInvoiceNo(data?.suppInvNo || "");
    setSupplierInvoiceNoCopy(data?.suppInvNo || "");
    setSupplierInvoiceDate(data?.suppInvoiceDate || "");
    setSupplierInvoiceDateCopy(data?.suppInvoiceDate || "");
    setSupplierCountry(data?.country || "");
    setSupplierState(data?.state || "");
    setCSupplierDcNumber(data?.csSuppDcNo || "");
    setCSupplierDcNumberCopy(data?.csSuppDcNo || "");
    setSupplierDcDate(data?.suppDcDate || "");
    setSupplierDcDateCopy(data?.suppDcDate || "");
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
    setQcAuthoriseDate(
      data?.qcAuthorizeDate ? data?.qcAuthoriseDate : new Date() || ""
    );
    setQcRemarks(data?.qcRemarks || "");
    //AMOUNT FIELDS
    setTotalQty(data?.totalQty || "");
    setGrossAmount(data?.grossAmount || "");
    setLessDiscount(data?.lessDiscount || "");
    setTransport(data?.transport || "");
    setCoolie(data?.coolie || "");
    setSubTotal(data?.subTotal || "");
    setIGST(data?.igst || "");
    setIGSTPercent(data?.igstPer || "");
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
    setMainId(data?.poBillId || "");
    setSelectedItems(dataObject.data || []);
    // ADD THESE THREE LINES
    setInsurancePercent(data?.insurancePer || "");
    setBCDPercent(data?.bcdPer || "");
    setSocialWelfareChargesPercent(data?.swcPer || "");
    setIsAccountable(data?.accountable || false);
  };



  const handlePOBillPreviewException = () => { };

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
      setCurrency(value?.currency || "");
      setCurrencyId(value?.currencyId || "");
      setBillingAddress(value?.spAddress || "");
      setBillingAddressCopy(value?.spAddress || "");
      setSupplierSid(value?.sId || "");
      setSupplierSelect(value?.label || "");
      setSupplierSelectCopy(value?.label || "");
      setSupplierId(value?.spTabId || "");
      setSupplierIdCopy(value?.spTabId || "");
      setSupplierCountry(value?.country || "");
      setSupplierState(value?.state || "");
    }
  };

  let optionsSuppItemList = supplierItemList.map((item) => ({
    id: item.id,
    itemCode: item.itemCode,
    label: item.itemName,
    itemName: item.itemName,
    uom: item.uom,
    poNo: item.poNo,
    poQty: item.poQty,
    schDate: item.schDate,
    totalQty: item.totalQty,
    grossAmount: item.grossAmount,
    spCode: item.spCode,
    suppName: item.suppName,
    supId: item.supId,
    paymentTerms: item.paymentTerms,
    gstNo: item.gstNo,
    department: item.department,
    currencyId: item.currencyId,
    minStockLvl: item.minStockLvl,
    maxLvl: item.maxLvl,
    uomId: item.uomId,
    itmLedger: item.itmLedger,
    rate: item.rate,
    amt: item.amt,
    location: item.location,
  }));

  //FORM SUBMIT FUNCTION
  const handleSubmit = (e) => {
    e.preventDefault();
    // const updatedArray = selectedItems.map(obj => (
    // Filter out items with id: 'RDL1'
    const filteredItems = selectedItems.filter((obj) => obj.id !== "RDL1");
    const updatedArray = filteredItems.map((obj) => ({
      ...obj,
      poNo: poType,
      digit: digit,
      date: selectedDate,
      digitString: getPoNumber,
      spAddress: billingAddress,
      approve: isQcApprovalFlag === "true" ? 1 : qcApproval,
      accountable: isAccountable,
      //FILE
      file: selectedFile,
      //TABLE DATA
      grnRefNO: grnRefNo,
      suppInvNo: supplierInvoiceNo,
      suppInvoiceDate: supplierInvoiceDate,
      csSuppDcNo: cSupplierDcNo,
      suppDcDate: supplierDcDate,
      irNo: irNo,
      carNo: carNo,
      binNo: binNo,
      exgRate: exgRate,
      currencyId: currencyId,
      gstType: gstType,
      remarks: remarks,
      qcAuthorize: qcAuthorise,
      // qcAuthorizeBy: qcAuthoriseBy,
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
      importGstPer: importGSTPercent,
      importGST: importGST,
      totalWithGST: totalWithGST,
      freightCharges: freightCharges,
      localClearanceCharges: localClearanceCharges,
      //INTERNATIONAL ENDS HERE
    }));
    console.log("PAYLOAD DATA", updatedArray);


    if (!supplierInvoiceNo) {
      setNotification({
        status: true,
        type: "error",
        message: "Supplier Invoice No is required",
      });
      return;
    }



    if (!supplierInvoiceDate) {
      setNotification({
        status: true,
        type: "error",
        message: "Supplier Invoice Date is required",
      });
      return;
    }


    if (supplierCountry.toUpperCase() === "INDIA") {
      if (!gstType) {
        setNotification({
          status: true,
          type: "error",
          message: "GST Type is required",
        });
        return;
      }
      if (
        gstType === "CGST/SGST" &&
        (cgstPercent === "" || sgstPercent === "")
      ) {
        setNotification({
          status: true,
          type: "error",
          message: "CGST and SGST percentages are required",
        });
        return;
      }
      if (gstType === "IGST" && igstPercent === "" && utgstPercent === "") {
        setNotification({
          status: true,
          type: "error",
          message: "IGST and UTGST percentages are required",
        });
        return;
      }
    }

    if (poType === "J" && (!supplierDcDate || !cSupplierDcNo)) {
      setNotification({
        status: true,
        type: "error",
        message: "Supplier DC Date and Number are required for PO Type J",
      });
      return;
    }

    // LOT QTY VALIDATION
    for (const item of updatedArray) {
      const { shelfLifeItem, lotQtyData, rcvdQty } = item;

      if (shelfLifeItem === "Y") {
        // Condition 1: Check if lotQtyData is empty
        if (!lotQtyData || lotQtyData.length === 0) {
          setNotification({
            status: true,
            type: "error",
            message: "Must enter lot quantity.",
          });
          return; // Stop execution
        }

        // Condition 2: Check if total lotQty matches rcvdQty
        const totalLotQty = lotQtyData.reduce(
          (sum, lot) => sum + parseFloat(lot.lotQty || 0),
          0
        );
        if (totalLotQty !== parseFloat(rcvdQty)) {
          setNotification({
            status: true,
            type: "error",
            message: "Lot quantity must match invoice quantity.",
          });
          return; // Stop execution
        }
      }
    }

    // if (isEdit || qcApproval) {
    if (
      isEdit ||
      isQcApprovalFlag === "true" ||
      qcApproval === "1" ||
      qcApproval === 1
    ) {
      setLoading(true);
      UpdatePurchaseBillAgainstPO(
        updatedArray,
        handleEditOrQcSuccess,
        handleEditOrQcException
      );
    } else {
      setLoading(true);
      PurchaseBillFormSubmit(updatedArray, handleSuccess, handleException);
    }
  };

  // ADD
  const handleSuccess = (dataObject) => {
    console.log("the dataObject ", dataObject);
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    (poType === "J" || poType === "R") && setJobWorkReceiptModal(true);
    setTimeout(() => {
      ClearData();
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
      // ClearData();
      // handleClose();
      setLoading(false);
    }, 2000);
  };
  // EDIT OR QC
  const handleEditOrQcSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    (poType === "J" || poType === "R") && setJobWorkReceiptModal(true);
    setTimeout(() => {
      ClearData();
      handleClose();
      setLoading(false);
    }, 2000);
  };

  const handleEditOrQcException = (errorObject, errorMessage) => {
    console.log("the error ", errorMessage);
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // ClearData();
      // handleClose();
      setLoading(false);
    }, 2000);
  };

  const ClearData = () => {
    setSelectedDate("");
    setDigit("");
    setGetPoNumber("");
    setPoType("");
    setSelectedItems([{ id: "RDL1" }]);
    setBillingAddress("");
    setGrnRefNo("");
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
    setGstType("CGST/SGST");
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
    setSGST("");
    setIGST("");
    setUTGST("");
    setTotal("");
    setTDS("");
    setTCS("");
    setOthers("");
    setGrandTotal("");
    setSupplierItemList([]);
    setSelectedFile(null);
    setSupplierSelect("");
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
    setTotalWithGST("");
    setFreightCharges("");
    setLocalClearanceCharges("");
    setTransportCode(null);
    // INT END
    setIGSTPercent("");
    setTCSPercent("");
    setImportGSTPercent("");
    setCGSTPercent("");
    setSGSTPercent("");
    setUTGSTPercent("");
    setTDSPercent("");
    setTCSPercent("");
    setBCDPercent("");
    setInsurancePercent("");
    setSocialWelfareChargesPercent("");

    setTimeout(() => {
      // GetPurchaseBillSuppList(handleSupplierListSuccess, handleSupplierListFailed);
      // genarateGrnNumber(handleGrnSucess, handleGrnException);
    }, 2000);
  };

  const loaderData = () => {
    setRowId(editeData?.id || "");
    // setSItemCode(editeData?.itmCode || '');
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
      field: "totStk",
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
      editable: false,
    },
    {
      field: "poNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>PONO</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "poQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>POQTY</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cumQty",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Cum Qty</span>
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
      field: "pendingPo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Pend Qty</span>
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
      field: "schDate",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Sch Date</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
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
      field: "lotQtyData",
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
      editable: false,
      renderCell: (params) => {
        // Calculate the total of lotQty in the lotQtyData array
        // const totalLotQty = params?.row?.lotQtyData ? params?.row?.lotQtyData.reduce((total, item) => total + Number(item.lotQty), 0) : []
        const totalLotQty = params?.row?.lotQtyData
          ? params.row.lotQtyData.reduce(
            (total, item) => total + (item.lotQty ? Number(item.lotQty) : 0),
            0
          )
          : 0;

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <span>{`Loc: ${params.row.location} Lot Qty: ${totalLotQty}`}</span>
          </div>
        );
      },
    },
    {
      field: "itmLedger",
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

  const ViewLot = (props) => {
    console.log("propspropspropspropsprops", props);
    return <Button>View</Button>;
  };

  const handleDeleteRow = (id) => {
    const newArray = selectedItems.filter((item) => item.id !== id);
    setSelectedItems(newArray);

    // CHECK AFTER DELETE ROW WETHER PAID OR TOPAY
    const filteredItems = newArray
      .filter((obj) => obj.id !== "RDL1") // Exclude items with id 'RDL1'
      .map((obj) => obj.freightType); // Store only the freightType values
    handleCheckPoFreight(
      { po: filteredItems },
      handleCheckFreightSuccess,
      handleCheckFreightException
    );

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

  // const calculateTotals = (data) => {
  //     const totalQty = data.reduce((acc, item) => acc + (Number(item.accQty) || 0), 0);
  //     console.log("totalQty", totalQty);
  //     setTotalQty(totalQty);

  //     const grossAmount = data.reduce((acc, item) => acc + (Number(item.pbAmt) || 0), 0);
  //     console.log("grossAmount", grossAmount);
  //     setGrossAmount(grossAmount);

  //     return [
  //         { id: 1, totalQty, grossAmount, /*amt*/ }
  //     ];
  // };

  const calculateTotals = (data) => {
    const totalQtyRaw = data.reduce(
      (acc, item) => acc + (Number(item.accQty) || 0),
      0
    );
    const totalQty = Number(totalQtyRaw.toFixed(3)); // Round to 3 decimal places
    console.log("totalQty", totalQty);
    setTotalQty(totalQty);

    const grossAmountRaw = data.reduce(
      (acc, item) => acc + (Number(item.pbAmt) || 0),
      0
    );
    const grossAmount = Number(grossAmountRaw.toFixed(3)); // Round to 3 decimal places
    console.log("grossAmount", grossAmount);
    setGrossAmount(grossAmount);

    return [{ id: 1, totalQty, grossAmount /*, amt*/ }];
  };

  // OTHER CALCULATION FUNCTION + AND -
  // function calculateTotal(initialAmount, inputValue) {
  //     if (inputValue === "" || !inputValue) {
  //         return initialAmount
  //     } else {
  //         if (inputValue[0] !== '+' && inputValue[0] !== '-') {
  //             // throw new Error('Invalid input format. Expected format: +<number> or -<number>');
  //             setNotification({
  //                 status: true,
  //                 type: 'error',
  //                 message: 'Invalid input format. Expected format: +<number> or -<number>',
  //             });
  //         }
  //         const [sign, number] = [inputValue[0], parseFloat(inputValue.slice(1))];
  //         return sign === '+' ? initialAmount + number : initialAmount - number;
  //     }
  // }

  function calculateTotal(initialAmount, inputValue) {
    if (!inputValue || inputValue.trim() === "") {
      return initialAmount;
    }

    const trimmedInput = inputValue.trim();

    let sign = "+";
    let numberStr = trimmedInput;

    if (trimmedInput[0] === "-") {
      sign = "-";
      numberStr = trimmedInput.slice(1);
    }

    // Handle ".4" or "-.4" by making it "0.4"
    if (numberStr.startsWith(".")) {
      numberStr = "0" + numberStr;
    }

    // Show error if no number after "-"
    if (numberStr === "") {
      setNotification({
        status: true,
        type: "error",
        message: 'Please enter a number after "-"',
      });
      return initialAmount;
    }

    const number = parseFloat(numberStr);

    if (isNaN(number)) {
      setNotification({
        status: true,
        type: "error",
        message: "Invalid number entered.",
      });
      return initialAmount;
    }

    return sign === "+" ? initialAmount + number : initialAmount - number;
  }

  // CALCULATE THE SUB-TOTAL
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

    // SGAST CALCULATION
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
    var subTotalInsAndFreight =
      Number(totalGrsAndMiscValue) + Number(insuranceAmount) + Number(freight);
    setSubTotalINSAndFreight(parseFloat(subTotalInsAndFreight.toFixed(3)));

    // BCD CALCULATION
    // var bcdAmount = (totalGrsAndMiscValue * bcdPercent) / 100;
    // setBCD(bcdAmount);

    // // SOCIAL WELFARE CHARGES CALCULATION
    // var socialWelfareAmount = (totalGrsAndMiscValue * socialWelfareChargesPercent) / 100;
    // setSocialWelfareCharges(socialWelfareAmount);
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
  }, [selectedItems, exgRate]);

  const handleSupplierItemChange = (value) => {
    if (value !== null) {
      // Remove any existing dummy row
      const filteredItems = selectedItems.filter((item) => item.id !== "RDL1");
      // Add the new value to the list
      const updatedItems = [...filteredItems, value];
      // Add the dummy row at the end
      updatedItems.push({ id: "RDL1" });
      setSelectedItems(updatedItems);
      console.log("selectedItems-------->>>>>>>>>", updatedItems);
    }
  };

  //DATE CONVERT TO TEXTFIELD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };



  const handlePoEnterOnBlur = () => {
    getPurchaseBillDetails(
      { poDigit: digit },
      handlePoEnterOnBlurSuccess,
      handlePoEnterOnBlurFailed
    );
    setSelectedItems([]);
    optionsSuppItemList = [];
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
    console.log("dataObject", dataObject);
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

  // HANDLE TEMPLATE DOWNLOAD
  const handleTemplateDownload = () => {
    // PurchaseBillAgaintsPOTemplate(handleTemplateDownloadSuccess, handleTemplateDownloadFailed);
    PurchaseBillAgaintsPOTemplateNew(
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

  // LND COST AND LND RATE CALCULATION
  useEffect(() => {
    const result = selectedItems.map((item) => ({
      ...item,
      lndCost: Math.round(Number(grandTotal) / Number(item.pbRate)),
      lndRate: Math.round(Number(grandTotal) / Number(item.invQty)),
    }));
    setSelectedItems(result);
  }, [grandTotal, exgRate]);

  /////////////////////////////////////////////////////////////SUPLIER AUTOCOMPLETE///////////////////////////////////
  const handleChange = (e) => {
    GetPoBillAllSuppList(
      { code: e.target.value, type: poType },
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

  const handleSupplierSelect = (value) => {
    if (value !== null) {
      setCurrency(value?.currency || "");
      setCurrencyId(value?.currencyId || "");
      setBillingAddress(value?.spAddress || "");
      setBillingAddressCopy(value?.spAddress || "");
      setSupplierSid(value?.sId || "");
      setSupplierSelect(value?.label || "");
      setSupplierSelectCopy(value?.label || "");
      setSupplierId(value?.spTabId || "");
      setSupplierIdCopy(value?.spTabId || "");
      setSupplierCountry(value?.country || "");

      // setSupplierState(value?.state || '');
      const state = value?.state || "";
      setSupplierState(state);

      if (state.toUpperCase() !== "KARNATAKA") {
        setGstType("IGST");
      } else {
        setGstType("CGST/SGST");
      }
    }
  };

  ///End Code///
  function emptyRowsToPush(lineItems) {
    const pageSize = 39; // Max rows per page (depends on layout)
    const header = 10; // Rows occupied by header
    const footer = 19; // Rows reserved for footer

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
      rowsToPush -= 1; // <-- prevent accidental overflow
    }

    return rowsToPush;
  }

  // const handlePrintClick = () => {
  const handlePrintClick = async () => {
    // console.log("invoiceDatainvoiceData", invoiceData)
    function formatNumber(value) {
      if (value === null || value === undefined || value === "") return "";
      const num = Number(value);
      return isNaN(num) ? value : num.toFixed(3); // always 2 decimals
    }
    setPdfModalOpen(true);
    // Lazy-load heavy libs and assets only when printing
    const { default: JsPDFCtor } = await import("jspdf");
    await import("jspdf-autotable");
    const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
    console.log("baseUrl------------------>>>>>>>>>>>>>>", baseUrl);
    // const logoUrl = (await import('../../AllImage/RDL_Logo.png')).default;
    const logoUrl = `${baseUrl}/${invoiceData[0].companyImage}`
      ;
    const IsoUrl = (await import("../../AllImage/Picture.png")).default;
    let info = [];
    invoiceData.forEach((element, index, array) => {
      info.push([
        index + 1,
        element.description,
        element.uom,
        element.mainPoNo,
        // element.poQty, element.invQty, element.rcvdQty, element.accQty, element.rejQty,
        formatNumber(element.poQty),
        formatNumber(element.invQty),
        formatNumber(element.rcvdQty),
        formatNumber(element.accQty),
        formatNumber(element.rejQty),
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

    // const doc = new jsPDF();
    // const logoUrl = require('../../AllImage/RDL_Logo.png');
    // const IsoUrl = require('../../AllImage/Picture.png');
    // const IsoUrl = require('../../AllImage/Picture.png');

    const doc = new JsPDFCtor({ compress: true });
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
          `FORMAT NO:IMS-ME-PUR-F-220-Rev-2 Dated 14-01-2019`,
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

    const logoAndAddress = [
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
          content: `CIN No:  ${invoiceData[0]?.cmpCinNo}`,
          colSpan: 4,
          styles: {
            fontSize: 8,
            textColor: "black" /*valign: 'top',*/,
            lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
            lineColor: { top: [0, 0, 0] },
          },
        },
        {
          content: `GSTINO:  ${invoiceData[0]?.cmpGstNo}`,
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
            fillColor: [200, 210, 255],
            fontSize: 8,
          },
        },
      ],
    ];
    const address = [
      [
        {
          content: `SUPPLIER NAME :\n${invoiceData[0]?.suppName}\n#${invoiceData[0]?.spAddress}\n${invoiceData[0]?.state}\n${invoiceData[0]?.country}`,
          colSpan: 6,
          rowSpan: 6,
          styles: {
            halign: "left",
            valign: "top",
            fontSize: 10,
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
          content: `BOE No : ${invoiceData[0]?.boeNo}`,
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
          content: `BOE Date : ${invoiceData[0]?.boeDate}`,
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
          content: `Supp DC Date : ${invoiceData[0]?.suppDcDate}`,
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
      /* ...pan, */ ...poHeader,
      ...address,
      ...threeCell /* firstHeaderRow  ...firstHeaderRow*/,
      ...secondHeaderRow,
    ];


    const GstTaxAmount = [
      // Coolie
      ...(invoiceData[0]?.coolie.length > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            }, // increased from 6 → 7
            {
              content: "Coolie :",
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            }, // same
            {
              content: `${Number(invoiceData[0]?.coolie || 0).toLocaleString(
                "en-IN"
              )}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            }, // reduced from 2 → 1
          ],
        ]
        : []),

      // Discount
      ...(invoiceData[0]?.lessDiscount.length > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: "Discount :",
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(
                invoiceData[0]?.lessDiscount || 0
              ).toLocaleString("en-IN")}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // Transport
      ...(invoiceData[0]?.transport.length > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: "Transport :",
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(
                invoiceData[0]?.transport || 0
              ).toLocaleString("en-IN")}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // Total Quantity
      ...(invoiceData[0]?.totalQty.length > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: "Total Qty :",
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(
                invoiceData[0]?.totalQty || 0
              ).toLocaleString("en-IN")}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // Sub Total
      ...(Math.max(Number(invoiceData[0].subTotal), 0) > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: "Sub Total :",
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(
                invoiceData[0]?.subTotal || 0
              ).toLocaleString("en-IN")}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // TDS
      ...(Math.max(Number(invoiceData[0].tds), 0) > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: "TDS :",
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(invoiceData[0]?.tds || 0).toLocaleString(
                "en-IN"
              )}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // TCS
      ...(Math.max(Number(invoiceData[0].tcs), 0) > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: "TCS :",
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(invoiceData[0]?.tcs || 0).toLocaleString(
                "en-IN"
              )}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // GST Types (IGST or CGST + SGST)
      ...(gstType === "IGST"
        ? [
          ...(Number(invoiceData[0]?.igstPer || 0) > 0
            ? [
              [
                {
                  content: "",
                  colSpan: 7,
                  styles: { halign: "left", fontSize: 8 },
                },
                {
                  content: `IGST @ ${invoiceData[0]?.igstPer}%`,
                  colSpan: 2,
                  styles: { halign: "left", fontSize: 8 },
                },
                {
                  content: `${Number(
                    invoiceData[0]?.igst || 0
                  ).toLocaleString("en-IN")}`,
                  colSpan: 1,
                  styles: {
                    halign: "right",
                    fontSize: 8,
                    textColor: "blue",
                  },
                },
              ],
            ]
            : []),

          ...(Number(invoiceData[0]?.utgstPer || 0) > 0
            ? [
              [
                {
                  content: "",
                  colSpan: 7,
                  styles: { halign: "left", fontSize: 8 },
                },
                {
                  content: `UTGST @ ${invoiceData[0]?.utgstPer}%`,
                  colSpan: 2,
                  styles: { halign: "left", fontSize: 8 },
                },
                {
                  content: `${Number(
                    invoiceData[0]?.utgst || 0
                  ).toLocaleString("en-IN")}`,
                  colSpan: 1,
                  styles: {
                    halign: "right",
                    fontSize: 8,
                    textColor: "blue",
                  },
                },
              ],
            ]
            : []),
        ]
        : [
          ...(Number(invoiceData[0]?.cgstPer || 0) > 0
            ? [
              [
                {
                  content: "",
                  colSpan: 7,
                  styles: { halign: "left", fontSize: 8 },
                },
                {
                  content: `CGST @ ${invoiceData[0]?.cgstPer}%`,
                  colSpan: 2,
                  styles: { halign: "left", fontSize: 8 },
                },
                {
                  content: `${Number(
                    invoiceData[0]?.cgst || 0
                  ).toLocaleString("en-IN")}`,
                  colSpan: 1,
                  styles: {
                    halign: "right",
                    fontSize: 8,
                    textColor: "blue",
                  },
                },
              ],
            ]
            : []),

          ...(Number(invoiceData[0]?.sgstPer || 0) > 0
            ? [
              [
                {
                  content: "",
                  colSpan: 7,
                  styles: { halign: "left", fontSize: 8 },
                },
                {
                  content: `SGST @ ${invoiceData[0]?.sgstPer}%`,
                  colSpan: 2,
                  styles: { halign: "left", fontSize: 8 },
                },
                {
                  content: `${Number(
                    invoiceData[0]?.sgst || 0
                  ).toLocaleString("en-IN")}`,
                  colSpan: 1,
                  styles: {
                    halign: "right",
                    fontSize: 8,
                    textColor: "blue",
                  },
                },
              ],
            ]
            : []),
        ]),

      // Import GST
      ...(Number(invoiceData[0]?.importGstPer || 0) > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `Import GST @ ${invoiceData[0]?.importGstPer}%`,
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(
                invoiceData[0]?.importGST || 0
              ).toLocaleString("en-IN")}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // BCD
      ...(Number(invoiceData[0]?.bcdPer || 0) > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `BCD @ ${invoiceData[0]?.bcdPer}%`,
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(invoiceData[0]?.bcd || 0).toLocaleString(
                "en-IN"
              )}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // Subtotal INS & Freight
      // ...(Math.max(Number(invoiceData[0].subTotalINSAndFreight), 0) > 0 ? [[
      //     { content: '', colSpan: 7, styles: { halign: 'left', fontSize: 8 } },
      //     { content: 'Subtotal INS & Freight ', colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
      //     { content: `${Number(invoiceData[0]?.subTotalINSAndFreight || 0).toLocaleString('en-IN')}`, colSpan: 1, styles: { halign: 'right', fontSize: 8, textColor: 'blue' } }
      // ]] : []),
      // Subtotal INS & Freight
      ...(Math.max(Number(invoiceData[0].miscCharges), 0) > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: "Misc Charges ",
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(
                invoiceData[0]?.miscCharges || 0
              ).toLocaleString("en-IN")}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // Social Welfare Charges
      ...(Number(invoiceData[0]?.swcPer || 0) > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `Social Welfare Charges @ ${invoiceData[0]?.swcPer}%`,
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(
                invoiceData[0]?.socialWelfareCharges || 0
              ).toLocaleString("en-IN")}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // Insurance
      ...(Number(invoiceData[0]?.insurancePer || 0) > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `Insurance @ ${invoiceData[0]?.insurancePer}%`,
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(
                invoiceData[0]?.insurance || 0
              ).toLocaleString("en-IN")}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // Freight
      ...(invoiceData[0]?.freight.length > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: "Freight ",
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(invoiceData[0]?.freight || 0).toLocaleString(
                "en-IN"
              )}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // Total with GST
      ...(Math.max(Number(invoiceData[0].total), 0) > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: "Total ",
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(
                invoiceData[0]?.total || 0
              ).toLocaleString("en-IN")}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // // Subtotal SW & BCD
      // ...(Math.max(Number(invoiceData[0].subTotalSwAndBCD), 0) > 0 ? [[
      //     { content: '', colSpan: 7, styles: { halign: 'left', fontSize: 8 } },
      //     { content: 'Subtotal SW & BCD ', colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
      //     { content: `${Number(invoiceData[0]?.subTotalSwAndBCD || 0).toLocaleString('en-IN')}`, colSpan: 1, styles: { halign: 'right', fontSize: 8, textColor: 'blue' } }
      // ]] : []),

      // Freight Charges
      ...(Math.max(Number(invoiceData[0].freight), 0) > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: "Freight Charges ",
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(invoiceData[0]?.freight || 0).toLocaleString(
                "en-IN"
              )}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),
      // Local Clearance Charges
      ...(Math.max(Number(invoiceData[0].localClearanceCharges), 0) > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: "Local Clearance Charges ",
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(
                invoiceData[0]?.localClearanceCharges || 0
              ).toLocaleString("en-IN")}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // Others
      ...(invoiceData[0]?.others.length > 0
        ? [
          [
            {
              content: "",
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: "Other",
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(invoiceData[0]?.others || 0).toLocaleString(
                "en-IN"
              )}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),

      // Grand Total + Remarks
      ...(invoiceData[0]?.grandTotal.length > 0
        ? [
          [
            {
              content: `PB Remarks: ${invoiceData[0]?.remarks}\nQA Remarks: ${invoiceData[0]?.qcRemarks}`,
              colSpan: 7,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: "Grand Total :",
              colSpan: 2,
              styles: { halign: "left", fontSize: 8 },
            },
            {
              content: `${Number(
                invoiceData[0]?.grandTotal || 0
              ).toLocaleString("en-IN")}`,
              colSpan: 1,
              styles: { halign: "right", fontSize: 8, textColor: "blue" },
            },
          ],
        ]
        : []),
    ];

    const userData = [
      [
        {
          content: `Prepared By ${invoiceData[0]?.user || ""}`,
          colSpan: 2,
          styles: {
            halign: "center",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal",
            cellPadding: { top: 13, bottom: 3 },
          },
        },
        {
          content: `QA Approved ${invoiceData[0]?.qcAuthorizeBy}`,
          colSpan: 3,
          styles: {
            halign: "center",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal",
            cellPadding: { top: 13, bottom: 3 },
          },
        },
        {
          content: `Stores in Charge`,
          colSpan: 3,
          styles: {
            halign: "center",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal",
            valign: "bottom",
            cellPadding: { top: 13, bottom: 3 },
          },
        },
        {
          content: `Authorised By`,
          colSpan: 2,
          styles: {
            halign: "center",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal",
            valign: "bottom",
            cellPadding: { top: 13, bottom: 3 },
          },
        },
      ],
    ];

    const footerData = [
      [
        {
          content: `FORMAT NO:IMS-ME-PUR-F-220-Rev-2 Dated 14-01-2019`,
          colSpan: 10,
          styles: {
            halign: "left",
            fontSize: 8,
            textColor: "black",
            fontStyle: "normal",
          },
        },
      ],

    ];


    const outerTable1 = [
      [
        {
          content:
            "Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076",
          colSpan: 8,
          styles: {
            halign: "left",
            fontSize: 7,
            textColor: "black",
            fontStyle: "normal",
            lineWidth: 0,
            lineWidth: { top: 0.2, right: 0, bottom: 0, left: 0 },
            lineColor: { top: [0, 0, 0] },
          },
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
          content:
            "Branch Address: Plot No. 98-I, Road No. 6, KIADB Jigani Industrial Estate, 2nd Phase, Jigani, Anekal Tq, Bangalore - 560105.",
          colSpan: 8,
          styles: {
            halign: "left",
            fontSize: 7,
            textColor: "black",
            fontStyle: "normal",
            lineWidth: 0,
          },
        },
      ],
    ];
    const bodyRows = [
      ...info,
      ...GstTaxAmount /*...userData, /*...footerData ...totalWords, ...termsAndSuppluColumn, ...requirements, ...para, ...users, ...note*/,
    ];
    const footRows = [...userData];
    const footRowssepearte = [...outerTable1];

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
        cellWidth: "wrap",
      },
      columnStyles: {
        1: { cellWidth: 50 }, // ✅ wrap only this column
        9: { cellWidth: 20 }, // ✅ wrap only this column
        // other columns can remain default
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
      didDrawPage: function (data) {
        if (data.pageNumber === 1) {
          // ✅ First page logo/header
          doc.addImage(logoUrl, "PNG", 22, 18, 28, 15);
          doc.addImage(IsoUrl, "PNG", 160, 15, 35, 20);
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
          let y = data.settings.margin.top - headerHeight; // 🔥 fixed: start from top margin

          doc.setFont("times", "bold");
          doc.setFontSize(8);
          doc.setTextColor(0);

          let x = startX;
          data.table.columns.forEach((col, i) => {
            const width = col.width; // use actual column width
            doc.rect(x, y, width, 10);
            doc.text(headers[i].trim(), x + width / 2, y + 6, {
              align: "center",
              baseline: "middle",
            });
            x += width;
          });

          doc.setFontSize(8);
          doc.setFont("times", "bold");
          doc.setTextColor("blue");
          doc.text(
            `Puchase Bill No : ${invoiceData[0].poNo}     |     Date : ${invoiceData[0].date}`,
            14,
            3
          ); // Adjust Y pos as needed
        }
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width || pageSize.getWidth();
        const pageHeight = pageSize.height || pageSize.getHeight();

        doc.setFontSize(8);
        doc.setTextColor(70);
        doc.text(
          "FORMAT NO:IMS-ME-PUR-F-220-Rev-2 Dated 14-01-2019",
          14,
          pageHeight - 10
        );
        doc.text(
          `Page ${data.pageNumber} of ${totalPagesExp}`,
          pageWidth - 14,
          pageHeight - 10,
          { align: "right" }
        );
      },
      didParseCell: function (data) {
        if (data.section === "body") {
          data.cell.styles.overflow = "linebreak";
          data.cell.styles.fillColor = false;

          const rightAlignColumns = [2, 3, 4, 5, 6, 7, 8, 9];

          // ✅ Only apply right alignment if column is in the list AND colSpan === 1 (i.e., regular numeric cell)
          if (
            rightAlignColumns.includes(data.column.index) &&
            !(data.cell.colSpan > 1)
          ) {
            data.cell.styles.halign = "right";
          }
        }
      },
    });

    doc.autoTable({
      theme: "striped",
      head: footRows,
      startY: doc.lastAutoTable.finalY,
      headStyles: {
        fillColor: [255, 255, 255], // Header background color
        textColor: [0, 0, 0], // Header text color
        halign: "center", // Header text alignment
        valign: "middle", // Vertical alignment
        lineWidth: 0.1, // Border width
        lineColor: [0, 0, 0], // Border color,
        font: "times",
      },
    });
    doc.autoTable({
      theme: "striped",
      head: footRowssepearte,
      startY: doc.lastAutoTable.finalY,
      headStyles: {
        fillColor: [255, 255, 255], // Header background color
        textColor: [0, 0, 0], // Header text color
        halign: "center", // Header text alignment
        valign: "middle", // Vertical alignment
        lineWidth: 0.1, // Border width
        lineColor: [0, 0, 0], // Border color,
        font: "times",
      },
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

  // ORIGINAL
  // const handleCellClick = (params) => {
  //     if (params.field === 'lotQtyData') {
  //         setLotEntryModalOpen(true);
  //         console.log("paramsparamsparams", params)
  //         setCellData(params.row);
  //         if (params?.row?.lotQtyData) {
  //             setRowData(params?.row?.lotQtyData)
  //         } else {
  //             setRowData([])
  //         }
  //     }
  // }

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

  //PURCHASE BILL FORWARD REVERSE
  // HANDLE FORWARD REVERSE HANDLER
  const handleForwardReverse = (type, id) => {
    PurchaseBillAgainstPoPreview(
      { type: type, id: id, prefix: poType },
      handleActionSuccess,
      handleActionException
    );
  };

  function formatDateToString(isoString) {
    const date = new Date(isoString);
    return date?.toISOString();
  }

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
    setInvoiceData(dataObject?.data || []);
    const data = dataObject?.data[0];
    setIsAccountable(data?.accountable);
    setPreviewQcFlag(data?.qcFlag || "");
    setSupplierId(data?.supId || "");
    setSupplierIdCopy(data?.supId || "");
    setSupplierSelectCopy(data?.suppName || "");
    setBillingAddressCopy(data?.spAddress || "");
    setPoType(data?.type || "");
    setDigit(data?.digit || "");
    setGetPoNumber(data?.poNo || "");
    setSupplierSelect(data?.suppName || "");
    const rawDate = data?.date || ""; // Example: "28-02-2025"
    const formattedDate = rawDate ? convertToISO(rawDate) : "";
    setSelectedDate(formattedDate);
    setBillingAddress(data?.spAddress || "");
    setGrnRefNo(data?.grnRefNO || "");
    setSupplierInvoiceNo(data?.suppInvNo || "");
    setSupplierInvoiceNoCopy(data?.suppInvNo || "");
    setSupplierInvoiceDate(data?.suppInvoiceDate || "");
    setSupplierInvoiceDateCopy(data?.suppInvoiceDate || "");
    setSupplierCountry(data?.country || "");
    setSupplierState(data?.state || "");
    setCSupplierDcNumber(data?.csSuppDcNo || "");
    setCSupplierDcNumberCopy(data?.csSuppDcNo || "");
    setSupplierDcDate(data?.suppDcDate || "");
    setSupplierDcDateCopy(data?.suppDcDate || "");
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
    // setMainId(data?.mainId || "");
    setMainId(data?.poBillId || "");
    setIGSTPercent(data?.igstPer || "");
    setSelectedItems(dataObject.data || []);
  };
  const handleActionException = () => { };

  const handleClearPage = () => {
    navigate(location.pathname, { replace: true });

    // 🔹 reset QC preview
    setPreviewQcFlag(0);
    setSelectedItem(null);
    setSelectedItems([]);
    setIGSTPercent("");
    setIsAccountable(true);
    setIsView(false);
    setIsEdit(false);
    setInvoiceData([]);
    setSupplierId("");
    setSupplierIdCopy("");
    setSupplierSelectCopy("");
    setBillingAddressCopy("");
    setPoType("");
    setDigit("");
    setGetPoNumber("");
    setSupplierSelect("");
    setSelectedDate(new Date());
    setBillingAddress("");
    setGrnRefNo("");
    setSupplierInvoiceNo("");
    setSupplierInvoiceNoCopy("");
    setSupplierInvoiceDate("");
    setSupplierInvoiceDateCopy("");
    setSupplierCountry("");
    setSupplierState("");
    setCSupplierDcNumber("");
    setCSupplierDcNumberCopy("");
    setSupplierDcDate("");
    setSupplierDcDateCopy("");
    setIrNo("");
    setCarNo("");
    setBinNo("");
    setExgRate(1);
    setCurrency("");
    setCurrencyId("");
    setGstType("CGST/SGST");
    //QC FIELDS
    setRemarks("");
    setQcAuthorise("");
    setQcAuthoriseBy("");
    setQcAuthoriseDate("");
    setQcRemarks("");
    //AMOUNT FIELDS
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
    setUTGST("");
    setUTGSTPercent("");
    setTDS("");
    setTDSPercent("");
    setTCS("");
    setTCSPercent("");
    setOthers("");
    setTransportCode(null);
    //INTERNATIONAL
    setBOENo("");
    setBCDPercent("");
    setInsurancePercent("");
    setSocialWelfareChargesPercent("");
    setBOEDate("");
    setPackingListNo("");
    setPackingDate("");
    setMiscCharges("");
    setInsurance("");
    setFreight("");
    setBCD("");
    setSocialWelfareCharges("");
    setImportGSTPercent("");
    setImportGST("");
    setFreightCharges("");
    setLocalClearanceCharges("");
    setMainId("");
    setSelectedItems([{ id: "RDL1" }]);
    setSelectedGeneratedPo("");
    // genarateGrnNumber(handleGrnSucess, handleGrnException)
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

  //NEW TABLE ENTRY CODE
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
      case "invQty":
        const updatedInvQty = selectedItems.map((data) => {
          if (data.id === id && cellNam === "invQty") {
            let finalInvQty;

            if (Number(newValue) > Number(rowData.poQty)) {
              // Show notification if too large
              setNotification({
                status: true,
                type: "error",
                message:
                  "Invoice Quantity cannot be greater than Pending Quantity",
              });
              finalInvQty = Number(rowData.poQty);
            } else {
              finalInvQty = Number(newValue);
            }

            return {
              ...data,
              invQty: finalInvQty,
              rcvdQty: finalInvQty,
              accQty: finalInvQty,
              pbAmt: finalInvQty * Number(data.pbRate || 0), // ✅ new pbAmt calculated here
            };
          }
          return data;
        });

        setSelectedItems(updatedInvQty);
        break;

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
              pbAmt: Number(newValue) * Number(rowData.pbRate),
              // itemRemarks: rowData.invQty - newValue === 0 ? '' : `Short Supply ${rowData.invQty - newValue}`,
              // itemRemarks:
              //     rowData.invQty - newValue === 0
              //         ? ''
              //         : qualityModuleView
              //             ? ``
              //             : `Short Supply ${rowData.invQty - newValue}`,
              itemRemarks:
                rowData.invQty - newValue === 0
                  ? ""
                  : `Short Supply ${rowData.invQty - newValue}`,
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
                itemRemarks: "", // Clear remarks if error
              };
            }
            return {
              ...data,
              accQty: Number(rowData.rcvdQty) - Number(newValue),
              rejQty: newValue,
              // pbAmt: Number(rowData.accQty) * Number(rowData.pbRate)
              // pbAmt: Number(rowData.pbAmt)
              pbAmt:
                (Number(rowData.rcvdQty) - Number(newValue)) *
                Number(rowData.pbRate),
              itemRemarks:
                qualityModuleView && newValue > 0
                  ? `Short Qty ${newValue}`
                  : "",
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

  //SEARCH BILL
  const handlePOChange = (e) => {
    GetGeneratedPo(
      { type: "poBill", code: e.target.value },
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
      console.log("selectedValueselectedValue", selectedValue);

      PurchaseBillDataPreview(
        {
          digit: selectedValue.digit,
          prefix: selectedValue?.type,
        },
        handleActionSuccess,
        handleActionException
      );
    }
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

  const CustomPopper = (props) => {
    return (
      <Popper
        {...props}
        placement="top"
        style={{ position: "absolute", top: "auto", bottom: "100%" }}
      />
    );
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

  // HANLDE CHECK FREIGHT
  useEffect(() => {
    if (viewMoreModal) {
      const filteredItems = selectedItems
        .filter((obj) => obj.id !== "RDL1") // Exclude items with id 'RDL1'
        .map((obj) => obj.freightType); // Store only the freightType values
      viewMoreModal &&
        handleCheckPoFreight(
          { po: filteredItems },
          handleCheckFreightSuccess,
          handleCheckFreightException
        );
    }
  }, [viewMoreModal]);

  const handleCheckFreightSuccess = (dataObject) => {
    setTransportCode(dataObject?.code || null);
    if (Number(dataObject?.code) === 2) {
      setNotification({
        status: true,
        type: "error",
        message:
          "There is a freight mismatch across multiple POs. Please amend the PO accordingly.",
      });
    }
  };
  const handleCheckFreightException = () => { };

  // QC INWARD FILE UPLOAD HANDLER EXCEPTION
  const handleQcFileImportSucess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      setInvoiceUploadLoader(false);
    }, 2000);
  };
  const handleQcFilemportException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      setInvoiceUploadLoader(false);
    }, 2000);
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
    () =>
      eligibleIds.length > 0 &&
      eligibleIds.every((id) => selectedRowIds.includes(id)),
    [eligibleIds, selectedRowIds]
  );

  // Master checkbox handler (select/deselect only eligible rows)
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    if (checked) {
      const newSelected = Array.from(
        new Set([...selectedRowIds, ...eligibleIds])
      );
      setSelectedRowIds(newSelected);
      console.log("Selected IDs:", newSelected);
    } else {
      const newSelected = selectedRowIds.filter(
        (id) => !eligibleIds.includes(id)
      );
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
      return newSelected;
    });
  };

  const handleShortClose = () => {
    PurchaseBillShortClose(
      { ids: selectedRowIds },
      handleSuccessShortClose,
      handleExceptionShortClose
    );
  };

  const handleSuccessShortClose = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      setInvoiceUploadLoader(false);
    }, 2000);
  };

  const handleExceptionShortClose = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      setInvoiceUploadLoader(false);
    }, 2000);
  };

  return (
    <div>
      {isProcessInsp ? (
        <>
          <InwardQualityFPIResult
            setIsProcessInsp={setIsProcessInsp}
            poBillDetailId={poBillDetailId}
            rowItemId={rowItemId}
            rowPoNumber={rowPoNumber}
            rowAccQty={rowAccQty}
            reportRowData={reportRowData}
            batchQty={reportRowData?.batchQty}   // ✅ add this line

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

          <form onSubmit={handleSubmit}>
            <Accordion defaultExpanded style={{ width: '100%' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {/* <Typography sx={{ fontWeight: "bold" }}>
                  Purchase Bill Details
                </Typography> */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginLeft: "10px",
                    marginTop: "10px",
                  }}
                >
                  {/* <Typography
                  sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                  variant="h5">
                  Purchase Bill Against PO
              </Typography> */}
                  {/* {isQcApprovalFlag === 'true' ?
                  <Link to='/QcApproval' style={{ textDecoration: 'none' }}>
                      <Typography
                          sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                          variant="h5"
                      >
                          {`QC Approval>>`}
                      </Typography>
                  </Link>
                  :
                  <Link to='/PurchaseBillAgaintPOResult' style={{ textDecoration: 'none' }}>
                      <Typography
                          sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                          variant="h5"
                      >
                          {`Purchase Bill Against PO>>`}
                      </Typography>
                  </Link>
              } */}
                  {isQcApprovalFlag === "true" && (
                    <Link
                      to="/QualityInspectionTab"
                      state={{ tab: "3" }}
                      style={{ textDecoration: "none" }}
                    >
                      <Typography
                        sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
                        variant="h5"
                      >
                        {`QC Approval>>`}
                      </Typography>
                    </Link>
                  )}
                  <Typography
                    sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
                    variant="h5"
                  >
                    {isEdit
                      ? "Edit Purchase Bill Against PO"
                      : isView
                        ? "View Purchase Bill Against PO"
                        : "New Purchase Bill Against PO"}
                  </Typography>
                </div>
              </AccordionSummary>

              <AccordionDetails>
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
                          // disabled={isView || isQcApprovalFlag === "true" ? true : false}
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
                          // onChange={(e) => setDigit(e.target.value)}
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

                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={3}
                        lg={3}
                        xl={3}
                        style={{ display: "flex", alignItems: "center" }}
                      >
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
                          disabled={
                            isView || isQcApprovalFlag === "true" ? true : false
                          }
                        />

                        <Tooltip title="Refresh DocNumber">
                          <span>
                            {" "}
                            {/* wrapper to avoid tooltip crash when button is disabled */}
                            <IconButton
                              disabled={
                                isView || isQcApprovalFlag === "true"
                                  ? true
                                  : false || isEdit
                              }
                              onClick={() => {
                                if (poType) {
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
                        {/* <Autocomplete
                                  disablePortal
                                  id="combo-box-demo"
                                  options={suppplierList}
                                  value={supplierSelect}
                                  fullWidth
                                  renderInput={(params) => <TextField {...params} label="Supplier" />}
                                  onChange={(event, value) => handleSupplierSearchItemChange(value)}
                                  size="small"
                                  style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                              /> */}
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={suppplierList}
                          fullWidth
                          value={supplierSelect}
                          getOptionLabel={(option) =>
                            option.spCode || supplierSelect
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Supplier"
                              onChange={handleChange}
                            />
                          )}
                          onChange={(event, value) => handleSupplierSelect(value)}
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

                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
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
                        />
                      </Grid>

                      <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{}}>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            textAlign: "left",
                            marginTop: "20px",
                          }}
                        >
                          {poType === "R" ? (
                            <Button
                              variant="outlined"
                              style={{ marginTop: "8px" }}
                              disabled={
                                isView || isQcApprovalFlag === "true" ? true : false
                              }
                              onClick={() => setPendingPOModalOpen(true)}
                            >
                              Load Pending PO
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              style={{ marginTop: "8px" }}
                              disabled={
                                isView || isQcApprovalFlag === "true" ? true : false
                              }
                              onClick={() => setPendingPOModalOpen(true)}
                            >
                              Load Pending PO
                            </Button>
                          )}
                          <FormControlLabel
                            style={{ paddingLeft: 10 }}
                            control={
                              <Checkbox
                                checked={isAccountable}
                                onChange={(e) => setIsAccountable(e.target.checked)}
                                disabled={isView || isQcApprovalFlag === "true"}
                                color="primary"
                              />
                            }
                            label={
                              isAccountable ? "Accountable" : "Non-Accountable"
                            } // ✅ Label changes based on checkbox
                          />
                        </div>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            textAlign: "left",
                            marginTop: "20px",
                          }}
                        >
                          <Button
                            variant="text"
                            disabled={
                              billingAddress.length < 0 ||
                                isView ||
                                isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                            onClick={() => setChangeAddressModalOpen(true)}
                          >
                            Change
                          </Button>

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

                    {/* <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '0px', borderRadius: '10px', width: '100%', height: '14vh', overflow: 'auto', border: '1px solid #000000' }}> */}
                    {isQcApprovalFlag === "true" ? (
                      ""
                    ) : (
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
                            label="Search PB No"
                            onChange={handlePOChange}
                          />
                        )}
                        onChange={(event, value) => handleGeneratedPoSelect(value)}
                        size="small"
                        style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                      />
                    )}


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
                                      height: "40px",
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
                                      Total Qty
                                    </th>
                                    <td
                                      style={{
                                        border: "1px solid #ddd",
                                        padding: "4px",
                                      }}
                                    >
                                      <TextField
                                        fullWidth
                                        size="small"
                                        required
                                        value={totalQty}
                                        disabled={
                                          isView || isQcApprovalFlag === "true"
                                            ? true
                                            : false
                                        }
                                      />
                                    </td>
                                  </tr>
                                  <tr
                                    style={{
                                      borderBottom: "1px solid #ddd",
                                      height: "40px",
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
                                      Sub Total
                                    </th>
                                    <td
                                      style={{
                                        border: "1px solid #ddd",
                                        padding: "4px",
                                      }}
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
                                  <tr style={{ borderBottom: "1px solid #ddd" }}>
                                    <th
                                      style={{
                                        border: "1px solid #ddd",
                                        padding: "8px",
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                      }}
                                    >
                                      Grand Total
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
                                        required
                                        value={grandTotal}
                                        disabled={
                                          isView || isQcApprovalFlag === "true"
                                            ? true
                                            : false
                                        }
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
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
              <Card
                style={{
                  boxShadow: "0 10px 10px 10px rgba(0, 0, 0, 0.2)",
                  borderRadius: "10px",
                  width: "100%",
                  height: screenHeight - 466,
                  border: "1px solid #000000",
                }}
              >
                <CardContent style={{ height: "100%" }}>
                  {/* {uploadLoader &&
                                          <Box sx={{ width: '100%', marginBottom: '15px' }}>
                                              <LinearProgress />
                                          </Box>
                                      } */}
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
                          flexWrap: "wrap",
                          rowGap: "10px",
                        }}
                      >
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
                              marginRight: "10px",
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
                            const fileInput = e.target;
                            if (
                              fileInput.files &&
                              fileInput.files.length > 0
                            ) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (reader.readyState === 2) {
                                  setUploadLoader(true);
                                  setUploadFileLoader(true);
                                  PurchaseBillXLUpload(
                                    {
                                      file: reader.result,
                                      supplierId: supplierId,
                                    },
                                    handleItemImportSucess,
                                    handleItemImportException
                                  );
                                  // Reset input so the same file can be selected again
                                  fileInput.value = "";
                                }
                              };
                              reader.readAsDataURL(fileInput.files[0]);
                            }
                          }}
                        />
                        {/* {isView || isEdit ? <Button variant="contained" style={{ height: '35px', backgroundColor: '#002D68', marginRight: '10px' }} onClick={handlePrintClick}>Print</Button> : null} */}
                        {/* /////////////////////////// */}
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
                              height: "35px",
                              background:
                                userPermission[0]?.addData === 0 || isModuleLocked
                                  ? "gray"
                                  : "#002D68",
                              color:
                                userPermission[0]?.addData === 0
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
                                // qcApproval === "1" || previewQcFlag === 1
                                //   ? "gray"
                                //   :
                                isModuleLocked ? "gray" : "#002D68",
                              color:
                                userPermission[0]?.updateData === 0
                                  ? "black"
                                  : "white",
                            }}
                            disabled={isModuleLocked}
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
                                userPermission[0]?.deleteData === 0
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
                                userPermission[0]?.print === 0 || isModuleLocked
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
                        {/* ////////////////////////////// */}
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        width: isView || isEdit ? "600px" : "500px",
                        flexWrap: "wrap",
                        rowGap: "10px",
                        alignItems: "center",
                        columnGap: "10px",
                      }}
                    >
                      <Button variant="contained" style={{ height: '35px', backgroundColor: isModuleLocked ? "gray" : "#002D68" }} disabled={isModuleLocked} onClick={() => navigate('/PurchaseBillMultiPrint')}>Multi Print</Button>

                      {isView || isEdit || isQcApprovalFlag ? (
                        <Typography
                          style={{
                            color:
                              qcApproval === "1" || previewQcFlag === 1
                                ? "green"
                                : "red",
                            fontWeight: "bold",
                            marginRight: "10px",
                          }}
                        >
                          {qcApproval === "1" || previewQcFlag === 1
                            ? "QC AUTHORISED"
                            : "QC PENDING"}
                        </Typography>
                      ) : null}
                      {!isView && isQcApprovalFlag !== "true" ? (
                        <Button
                          variant="contained"
                          style={{
                            height: "35px",
                            backgroundColor: "#002d68",
                            marginRight: "10px",
                          }}
                          onClick={(e) => {
                            setFileUploadOpen(true);
                          }}
                        >
                          {selectedFile?.length > 0
                            ? "Selected"
                            : "Invoice Upload"}
                        </Button>
                      ) : null}
                      {/* <Button variant="contained" type='submit' style={{ height: '35px', backgroundColor: '#002d68' }}>SAVE</Button> */}
                      {/* {
                                          !isView ? (
                                              <Button variant="contained"
                                                  style={{ height: '35px', backgroundColor: '#002D68' }}
                                                  onClick={() => setJobWorkReceipt(!jobWorkReceipt)}
                                              >Jobwork Receipt {jobWorkReceipt && <CheckCircleIcon style={{ marginLeft: '10px' }} />}
                                              </Button>
                                          ) : (
                                              null
                                          )
                                      } */}
                      {isQcApprovalFlag === "true" ? (
                        <Button
                          variant="contained"
                          component="label"
                          htmlFor="upload-photo"
                          sx={{
                            backgroundColor: "#002D68",
                            height: "35px",
                            marginRight: "10px",
                          }}
                          disabled={invoiceUploadLoader === true}
                        >
                          {/* Upload File */}
                          {invoiceUploadLoader ? (
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
                                setUploadLoader(true);
                                setInvoiceUploadLoader(true);
                                QcInwardFileUpload(
                                  {
                                    file: reader.result,
                                    id: mainId,
                                  },
                                  handleQcFileImportSucess,
                                  handleQcFilemportException
                                );
                              }
                            };
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }}
                      />

                      {!isView ? (
                        <Button
                          disabled={transportCode === 2 || loading === true}
                          variant="contained"
                          type="submit"
                          style={{
                            height: "35px",
                            backgroundColor:
                              Number(transportCode) === 2
                                ? "gray"
                                : "#002D68",
                          }}
                        >
                          {/* {isEdit ? "UPDATE" : "SAVE "} */}
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

                      {isQcApprovalFlag === "true" ? (
                        <Button
                          disabled={loading === true}
                          variant="contained"
                          type="submit"
                          style={{
                            height: "35px",
                            backgroundColor:
                              // Number(transportCode) === 2
                              // "gray"
                              "#002D68",
                          }}
                          onClick={handleShortClose}
                        >
                          Short Close
                        </Button>
                      ) : null}
                    </div>
                  </div>


                  <div
                    style={{
                      maxHeight: "80%", // 👈 set height for scrollable area
                      overflowY: "auto",
                      border: "1px solid #ddd",
                    }}
                  >
                    <table
                      id="transactionTable"
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <tr
                        style={{
                          position: "sticky",
                          top: "-2px",
                          backgroundColor: "#f9f9f9",
                          zIndex: 1,
                        }}
                      >
                        {isQcApprovalFlag === "true" && (
                          <th style={{ whiteSpace: "nowrap" }}>
                            <input
                              type="checkbox"
                              checked={allEligibleSelected}
                              onChange={handleSelectAll}
                            />
                          </th>
                        )}
                        <th style={{ whiteSpace: "nowrap" }}>Sl No</th>
                        <th style={{ whiteSpace: "nowrap" }}>Jobcard No</th>
                        <th style={{ whiteSpace: "nowrap" }}>Part No</th>
                        <th style={{ whiteSpace: "nowrap" }}>Part Name</th>
                        <th style={{ whiteSpace: "nowrap" }}>UOM</th>
                        <th style={{ whiteSpace: "nowrap" }}>QOH</th>
                        <th style={{ whiteSpace: "nowrap" }}>PONO</th>
                        <th style={{ whiteSpace: "nowrap" }}>POQTY</th>
                        <th style={{ whiteSpace: "nowrap" }}>CUM Qty</th>
                        <th style={{ whiteSpace: "nowrap" }}>Pend Qty</th>
                        <th style={{ whiteSpace: "nowrap" }}>Sch Date</th>
                        <th style={{ whiteSpace: "nowrap" }}>INV Qty</th>
                        <th style={{ whiteSpace: "nowrap" }}>RCVD Qty</th>
                        <th style={{ whiteSpace: "nowrap" }}>ACC QTY</th>
                        <th style={{ whiteSpace: "nowrap" }}>REJ QTY</th>
                        {/* {selectedItems.some(item => item.conversionConcept === 1) && (
                            <> */}
                        <th style={{ whiteSpace: "nowrap" }}>Conversion Part</th>
                        <th style={{ whiteSpace: "nowrap" }}>Conversion Qty</th>
                        {/* </>
                          )} */}


                        {qualityModuleView && (
                          <th style={{ whiteSpace: "nowrap" }}>
                            Item Remarks
                          </th>
                        )}

                        {!qualityModuleView && (
                          <>
                            <th style={{ whiteSpace: "nowrap" }}>PB Rate</th>
                            <th style={{ whiteSpace: "nowrap" }}>PB Amt</th>
                            <th style={{ whiteSpace: "nowrap" }}>LOT</th>
                            <th style={{ whiteSpace: "nowrap" }}>
                              Item Ledger
                            </th>
                            <th style={{ whiteSpace: "nowrap" }}>
                              Item Remarks
                            </th>
                            <th style={{ whiteSpace: "nowrap" }}>HSN Code</th>
                            <th style={{ whiteSpace: "nowrap" }}>LND Cost</th>
                            <th style={{ whiteSpace: "nowrap" }}>LND Rate</th>
                          </>
                        )}

                        {isQcApprovalFlag === "true" && (
                          <>
                            <th style={{ whiteSpace: "nowrap" }}>
                              Item Group
                            </th>
                            <th style={{ whiteSpace: "nowrap" }}>
                              Display Name
                            </th>
                            <th style={{ whiteSpace: "nowrap" }}>QC Req</th>
                            <th style={{ whiteSpace: "nowrap" }}>
                              {/* QC R Completed */}
                              QC Status
                            </th>
                          </>
                        )}
                        <th style={{ whiteSpace: "nowrap" }}>Actions</th>
                      </tr>
                      {selectedItems.map((item, index) => {
                        const totalLotQty = item.lotQtyData
                          ? item.lotQtyData.reduce(
                            (total, item) =>
                              total +
                              (item.lotQty ? Number(item.lotQty) : 0),
                            0
                          )
                          : 0;
                        const isConversionEditable =
                          item.conversionPartId &&
                          Number(item.conversionConcept) === 1 &&
                          qcApproval !== 1 &&
                          previewQcFlag !== 1;

                        const isViewEdit = qcApproval !== '1' && previewQcFlag !== 1;
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
                              </td>
                            )}

                            {/* <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.itemCode}</td> */}
                            <td
                              style={{ whiteSpace: "nowrap" }}
                              contentEditable={false}
                            >
                              {index + 1}
                            </td>
                            <td
                              style={{ whiteSpace: "nowrap" }}
                              contentEditable={false}
                            >
                              {item.jcNo}
                            </td>
                            <td contentEditable={false}>
                              {item.itemCode ? (
                                <span>{item.itemCode}</span>
                              ) : (

                                <Autocomplete
                                  disablePortal
                                  id="combo-box-demo"
                                  value={selectedItem}
                                  options={supplierItemList}
                                  // Keep your full, rich label for display
                                  getOptionLabel={(option) =>
                                    `𝐈𝐭𝐞𝐦 𝐂𝐨𝐝𝐞: ${option?.itemCode} | 𝐒𝐮𝐩𝐩 𝐃𝐞𝐬𝐜: ${option.suppDesc} | 𝐏𝐎: ${option.poNo} | 𝐒𝐜𝐡 𝐃𝐚𝐭𝐞: ${option.schDate} | 𝐐𝐭𝐲: ${option.poQty} | 𝐏𝐎 𝐑𝐚𝐭𝐞: ${option.pbRate}` ||
                                    ""
                                  }
                                  // Filter ONLY by itemCode (works for both R and J)
                                  filterOptions={(options, state) => {
                                    const q = (state.inputValue || "")
                                      .toLowerCase()
                                      .trim();
                                    if (!q) return options;
                                    return options.filter((opt) =>
                                      (opt?.itemCode || "")
                                        .toLowerCase()
                                        .includes(q)
                                    );
                                    // If you prefer starts-with:
                                    // return options.filter(opt => (opt?.itemCode || '').toLowerCase().startsWith(q));
                                  }}
                                  // Important: control the input text to avoid stale searches
                                  inputValue={itemSearch}
                                  onInputChange={(
                                    event,
                                    newInputValue,
                                    reason
                                  ) => {
                                    // Avoid overwriting when option is selected
                                    setItemSearch(newInputValue || "");
                                  }}
                                  // Stable equality across R/J
                                  isOptionEqualToValue={(opt, val) => {
                                    if (!opt || !val) return false;
                                    const keyOpt = `${opt?.itemCode || ""}|${opt?.poNo || opt?.dcNo || ""
                                      }`;
                                    const keyVal = `${val?.itemCode || ""}|${val?.poNo || val?.dcNo || ""
                                      }`;
                                    return keyOpt === keyVal;
                                  }}
                                  noOptionsText="No matching item code"
                                  sx={{ width: 300 }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Search Items"
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

                                  onChange={(event, value) => {
                                    if (!value) return;

                                    const matchByKey = (item, value) => {
                                      return Number(item.poDtlId) === Number(value.poDtlId);
                                    };

                                    if (poType === "R") {
                                      GetSupplierPendingPo(
                                        { supTabId: supplierId, itemCode: value.itemCode },
                                        (resp) => {
                                          const updatedValue = resp.data?.find((item) =>
                                            matchByKey(item, value)
                                          );

                                          setSelectedItem(updatedValue || value);
                                          handleSupplierItemChange(updatedValue || value);
                                          setItemSearch("");
                                        },
                                        () => {
                                          setSelectedItem(value);
                                          handleSupplierItemChange(value);
                                          setItemSearch("");
                                        }
                                      );
                                    }

                                    if (poType === "J") {
                                      GetSupplierPendingDC(
                                        { supTabId: supplierId, itemCode: value.itemCode },
                                        (resp) => {
                                          const updatedValue = resp.data?.find((item) =>
                                            matchByKey(item, value)
                                          );

                                          setSelectedItem(updatedValue || value);
                                          handleSupplierItemChange(updatedValue || value);
                                          setItemSearch("");
                                        },
                                        () => {
                                          setSelectedItem(value);
                                          handleSupplierItemChange(value);
                                          setItemSearch("");
                                        }
                                      );
                                    }
                                  }}

                                  size="small"
                                  disabled={isView ? true : false}
                                  PopperComponent={CustomPopper}
                                />
                              )}
                            </td>

                            <td
                              style={{ whiteSpace: "nowrap" }}
                              contentEditable={false}
                            >
                              {isQcApprovalFlag === "true"
                                ? item.itemName
                                : item.itemName}
                            </td>
                            <td
                              style={{ whiteSpace: "nowrap" }}
                              contentEditable={false}
                            >
                              {item.uom}
                            </td>
                            <td
                              style={{ whiteSpace: "nowrap" }}
                              contentEditable={
                                false
                              } /*onDoubleClick={() => handleCellClick("totStk", item)}*/
                            >
                              {item.totStk}
                            </td>
                            <td
                              style={{ whiteSpace: "nowrap" }}
                              contentEditable={
                                false
                              } /*onDoubleClick={() => handleCellClick("pendingPo", item)}*/
                            >
                              {item.mainPoNo}
                            </td>
                            <td
                              style={{ whiteSpace: "nowrap" }}
                              contentEditable={
                                false
                              } /*onDoubleClick={() => handleCellClick("pendingJwQty", item)}*/
                            >
                              {item.poQty}
                            </td>
                            <td
                              style={{ whiteSpace: "nowrap" }}
                              contentEditable={false}
                              onBlur={(e) =>
                                handleEdit(
                                  "cumQty",
                                  e.target.textContent,
                                  item.id,
                                  item
                                )
                              }
                            >
                              {Number(item.cumQty || 0).toFixed(3)}
                            </td>
                            <td
                              style={{ whiteSpace: "nowrap" }}
                              contentEditable={
                                false
                              } /*onDoubleClick={() => handleCellClick("rate", item)}*/
                            >
                              {Number(item.pendingPo || 0).toFixed(3)}
                            </td>
                            <td
                              style={{ whiteSpace: "nowrap" }}
                              contentEditable={false}
                            >
                              {item.schDate}
                            </td>
                            <td
                              style={{ whiteSpace: "nowrap" }}
                              contentEditable={!isView && isViewEdit}
                              onBlur={(e) =>
                                handleEdit(
                                  "invQty",
                                  e.target.textContent,
                                  item.id,
                                  item
                                )
                              }
                            >
                              {" "}
                              {Number(item.invQty || 0).toFixed(3)}
                            </td>
                            <td
                              style={{ whiteSpace: "nowrap" }}
                              contentEditable={!isView && isViewEdit}
                              onBlur={(e) =>
                                handleEdit(
                                  "rcvdQty",
                                  e.target.textContent,
                                  item.id,
                                  item
                                )
                              }
                            >
                              {" "}
                              {Number(item.rcvdQty || 0).toFixed(3)}
                            </td>
                            <td
                              style={{ whiteSpace: "nowrap" }}
                              contentEditable={false}
                              onBlur={(e) =>
                                handleEdit(
                                  "accQty",
                                  e.target.textContent,
                                  item.id,
                                  item
                                )
                              }
                            >
                              {" "}
                              {Number(item.accQty || 0).toFixed(3)}
                            </td>
                            <td
                              style={{ whiteSpace: "nowrap" }}
                              contentEditable={!isView && isViewEdit}
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
                            {/* {item.conversionConcept === 1 && (
                                <> */}
                            <td style={{ whiteSpace: "nowrap" }}>
                              {item.conversionPart || "-"}
                            </td>

                            {/* <td
                                style={{ whiteSpace: "nowrap" }}
                                contentEditable={!isView && !DisableEdit}
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
                              </td> */}
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                backgroundColor: isConversionEditable ? "#fff" : "#f3f3f3",
                              }}
                              contentEditable={!isView && isConversionEditable}
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                if (!isConversionEditable) return;

                                handleEdit(
                                  "conversionQty",
                                  e.target.textContent?.trim() || "",
                                  item.id,
                                  item
                                );
                              }}
                            >
                              {Number(item.conversionQty ?? 0)}
                            </td>

                            {/* </>
                              )} */}

                            {qualityModuleView && (
                              <td
                                style={{ whiteSpace: "nowrap" }}
                                contentEditable={!isView && !DisableEdit}
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
                            )}

                            {!qualityModuleView && (
                              <>
                                <td
                                  style={{ whiteSpace: "nowrap" }}
                                  contentEditable={false}
                                >
                                  {item.pbRate}
                                </td>
                                <td
                                  style={{ whiteSpace: "nowrap" }}
                                  contentEditable={false}
                                >
                                  {item.pbAmt}
                                </td>
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
                                <td
                                  style={{ whiteSpace: "nowrap" }}
                                  contentEditable={false}
                                >
                                  {item.itmLedger}
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
                                <td
                                  style={{ whiteSpace: "nowrap" }}
                                  contentEditable={!isView}
                                  onBlur={(e) =>
                                    handleEdit(
                                      "hsnCode",
                                      e.target.textContent,
                                      item.id,
                                      item
                                    )
                                  }
                                >
                                  {item.hsnCode}
                                </td>
                                <td
                                  style={{ whiteSpace: "nowrap" }}
                                  contentEditable={false}
                                >
                                  {item.id === "RDL1" ? null : item.lndCost}
                                </td>
                                <td
                                  style={{ whiteSpace: "nowrap" }}
                                  contentEditable={false}
                                >
                                  {item.id === "RDL1" ? null : item.lndRate}
                                </td>
                              </>
                            )}
                            {isQcApprovalFlag === "true" && (
                              <>
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
                                  {item.qcApproval == 1 ? 'Completed' : 'Pending'}
                                </td>
                              </>
                            )}
                            {/* <td contentEditable={false} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                      <DeleteIcon
                                                          onClick={() => {
                                                              handleDeleteRow(item.id)
                                                          }}
                                                          style={{ color: 'black', cursor: 'pointer' }}
                                                      />
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
                                            setPoBillDetailId(
                                              item?.poBillDtlId
                                            );
                                            // setRowItemId(item?.itemName)
                                            setRowItemId(item?.itemId);
                                            setRowPoNumber(item?.poNo);
                                            setRowAccQty(item?.accQty);
                                            setReportRowData(item);
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
                                    style={{
                                      color: "gray",
                                      cursor: "pointer",
                                    }}
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
                    {/* </div> */}
                  </div>
                </CardContent>
              </Card>
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
                Purchase Bill Against
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
                        GRN No
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          required
                          // type='number'
                          disabled={
                            isView || isQcApprovalFlag === "true" ? true : false
                          }
                          value={getPoNumber}
                        // onChange={(e) => setGrnRefNo(e.target.value)}
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
                          onChange={(e) => {
                            setSupplierInvoiceNo(e.target.value);
                            setSupplierInvoiceNoCopy(e.target.value);
                          }}
                          onBlur={(e) => {
                            CheckValidSuppInvNo(
                              { code: e.target.value, supplierSid: supplierId },
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
                          type="date"
                          required
                          value={supplierInvoiceDate}
                          // value={supplierInvoiceDate ? formatDate(supplierInvoiceDate) : ''}

                          onChange={(e) => {
                            const selectedDate = e.target.value;
                            setSupplierInvoiceDate(selectedDate);
                            setSupplierInvoiceDateCopy(selectedDate);
                          }}
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
                            whiteSpace: "nowrap",
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
                            whiteSpace: "nowrap",
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
                            whiteSpace: "nowrap",
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
                            whiteSpace: "nowrap",
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
                            whiteSpace: "nowrap",
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
                            onChange={(e) => {
                              setCSupplierDcNumber(e.target.value);
                              setCSupplierDcNumberCopy(e.target.value);
                            }}
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
                            value={formatDate(supplierDcDate)}
                            onChange={(e) => {
                              setSupplierDcDate(e.target.value);
                              setSupplierDcDateCopy(e.target.value);
                            }}
                            disabled={
                              isView || isQcApprovalFlag === "true"
                                ? true
                                : false
                            }
                          />
                        </td>
                      </tr>
                    )}

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
                          whiteSpace: "nowrap",
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
                              isView ||
                                isQcApprovalFlag === "true" ||
                                Number(transportCode) === 1 ||
                                Number(transportCode) === 2
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
                    {/* {supplierSate.toUpperCase() !== 'KARNATAKA' || gstType === 'IGST' ?  */}
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
                              // required
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
                              // required
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
                          whiteSpace: "nowrap",
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
                          // disabled={!isQcApprovalFlag ? false : true}
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
                          whiteSpace: "nowrap",
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
                          whiteSpace: "nowrap",
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
                          whiteSpace: "nowrap",
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
                          whiteSpace: "nowrap",
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
                          whiteSpace: "nowrap",
                        }}
                      >
                        QC Authorise Date
                      </th>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          // value={qcAuthoriseDate}
                          value={formatDate(qcAuthoriseDate)}
                          onChange={(e) => setQcAuthoriseDate(e.target.value)}
                          disabled={true}
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
                <Button onClick={() => setViewMoreModal(false)}>Update</Button>
              </DialogActions>
            </Dialog>
          </form>

          {/* MODALS */}
          <FileUploadModule
            fileUploadOpen={fileUploadOpen}
            setFileUploadOpen={setFileUploadOpen}
            setSelectedFile={setSelectedFile}
          />
          <NotificationBar
            handleClose={handleClose}
            notificationContent={openNotification.message}
            openNotification={openNotification.status}
            type={openNotification.type}
          />
          <ChangeAddressModal
            changeAddressModalOpen={changeAddressModalOpen}
            setChangeAddressModalOpen={setChangeAddressModalOpen}
            setBillingAddress={setBillingAddress}
            supplierSid={supplierSid}
          />
          <LoadPendingPO
            pendingPOModalOpen={pendingPOModalOpen}
            setPendingPOModalOpen={setPendingPOModalOpen}
            // setBillingAddress={setBillingAddress}
            supplierId={supplierId}
            setSelectedItems={setSelectedItems}
            selectedItems={selectedItems}
            pruchaseOrderDigit={pruchaseOrderDigit}
            genPoBillFlag={genPoBillFlag}
            poType={poType}
          />
          <JobworkReceiptModal
            setJobWorkReceiptModal={setJobWorkReceiptModal}
            jobWorkReceiptModal={jobWorkReceiptModal}
            setJobWorkReceipt={setJobWorkReceipt}
            supplierId={supplierIdCopy}
            billingAddress={billingAddressCopy}
            supplierSelect={supplierSelectCopy}
            supplierInvoiceNoCopy={supplierInvoiceNoCopy}
            supplierInvoiceDateCopy={supplierInvoiceDateCopy}
            cSupplierDcNoCopy={cSupplierDcNoCopy}
            supplierDcDateCopy={supplierDcDateCopy}
            genPoBillFlag={genPoBillFlag}
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
            deleteService={DeletePurchaseBillAgainstPO}
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
              <Button onClick={() => setPdfModalOpen(false)}>Close</Button>
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

export default PurchaseBillAgaintPOModule;
