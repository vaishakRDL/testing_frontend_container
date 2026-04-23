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
    InputLabel,
    Menu,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import React from "react";
import {
    CancelGstSaleInvoice,
    CreditNoteCustomer,
    CreditNoteInvoice,
    CreditNotePreview,
    CustomerDropShowInvoice,
    FetchCustomerAddress,
    FetchGSTCustomerAddress,
    GSTAutoGen,
    GSTInvAdd,
    GSTInvUpdate,
    GSTshowconsignee,
    GetGenerateGSTSaleInvoice,
    GetGenerateSalesReturn,
    GetInvoiceItems,
    GstInvoicePreview,
    GstPartNoSelect,
    GstViewing,
    LoadGetInvoiceItemsList,
    MstDispatchShowData,
    MstTransporterShowData,
    PartNoSelectGST,
    SaledReturnAutoGen,
    ViewCreditNotes,
    handleAddCreditNote,
} from "../../../ApiService/LoginPageService";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";
import "../../PurchaseOrderGeneration/PurchaseOrder.css";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { ExportGstInvoice } from "../../../ApiService/DownloadCsvReportsService";
import CustomePopUp from "../../../Utility/CustomePopUp";
import ReceiptIcon from '@mui/icons-material/Receipt';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useModuleLocks } from "../../context/ModuleLockContext";

const SalesReturn = () => {
    const [activeButton, setActiveButton] = useState("");

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Credit Note / Sales Return")?.lockStatus === "locked";

    const getHighlightStyle = (name, baseStyle = {}, disabled = false) => ({
        ...baseStyle,
        backgroundColor: disabled
            ? "gray"
            : activeButton === name
                ? "#0d6efd"          // 🔵 highlight color
                : baseStyle.backgroundColor,
        transition: "0.3s",
        color: disabled ? "black" : "white",
    });

    const [invCode, setInvCode] = useState("ME");
    const [invType, setInvType] = useState("");
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
    const [labourCharge, setLabourCharge] = useState("");
    const [labourHeadingRequired, setLabourHeadingRequired] = useState("");
    const [reverseCharge, setReverseCharge] = useState("");
    const [supplyTypeCode, setSupplyTypeCode] = useState("");
    const [dispatchFrom, setDispatchFrom] = useState("");
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
    const [surChrgesTCS, setSurChrgesTCS] = useState(0);
    const [cessOnTcs, setCessOnTcs] = useState(0);
    const [totlValues, setTotlValues] = useState(0);
    const [roundOff, setRoundOff] = useState(0);
    const [customerSid, setCustomerSid] = useState("");
    const [custAddress, setCustAddress] = useState("");
    const [selectedChangeAddress, setSelectedChangeAddress] = useState();
    const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
    const [dcSelectionModalOpen, setDcSelectionModalOpen] = useState(false);
    const [loadPendingModalOpen, setLoadPendingModalOpen] = useState(false);
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
    const [loading, setLoading] = useState(false);
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
    const [mainId, setMainId] = useState('');
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [openNotification, setNotification] = useState({
        status: false,
        type: "error",
        message: "",
    });
    const [generatedGstInvoiceLists, setGeneratedGstInvoiceLists] = useState([]);
    const [generatedGstInvoiceNo, setGeneratedGstInvoiceNo] = useState([]);
    const [customeOpen, setCustomeOpen] = useState(false);
    const [gstInvoiceId, setGstInvoiceId] = useState('');

    const location = useLocation();
    const { items } = location.state || { items: [] };
    //--View--//
    // const isPOView = new URLSearchParams(location.search).get("isPOView");
    const isCancelInvoiceView = new URLSearchParams(location.search).get("isCancelInvoiceView");
    const poRowId = new URLSearchParams(location.search).get("poRowId");

    /////////////////////////////////////////////////////////////SALES RETURN NOTE STATES\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    const [referenceNumber, setReferenceNumber] = useState('');
    const [unitNumber, setUnitNumber] = useState('');
    const [custInvoiceLists, setCustInvoiceLists] = useState([]);
    const [invoiceName, setInvoiceName] = useState('');
    const [invoiceId, setInvoiceId] = useState('');
    const [delAddress, setDelAddress] = useState('');
    const [delAddGstIn, setDelAddGstIn] = useState('');
    const [stateCode, setStateCode] = useState('');
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    // Load Items Dialog states
    const [loadItemsDialogOpen, setLoadItemsDialogOpen] = useState(false);
    const [loadItemsRows, setLoadItemsRows] = useState([]);
    const [loadItemsSelection, setLoadItemsSelection] = useState([]);
    /////////////////////////////////////////////////////////////SALES RETURN NOTE STATES\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    useEffect(() => {
        if (isCancelInvoiceView) {
            GstViewing({ id: poRowId }, handleGstViewing, handleGstViewingException);
        }
        SaledReturnAutoGen(handleGSTAutoGen, handleGSTAutoGenException);
        handleForwardReverse('last', '');
    }, [isCancelInvoiceView]);

    const handleGSTAutoGen = (dataObject) => {
        setReferenceNumber(dataObject.id || "");
        setUnitNumber(dataObject.digit || "");
    };

    const handleGSTAutoGenException = (errorStatus, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    };

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

    const optionsCustList = Array.isArray(customerSelectList)
        ? customerSelectList.map((item) => ({
            cId: item?.cId,
            label: item?.cCode,
            cName: item?.cName,
        }))
        : [];

    // HANDLE CUSTOMER SELECT
    function onCustomerSelectChange(selectedValue) {
        setSelectedCustomerName(selectedValue?.cName);
        setCustomerSelect(selectedValue?.id);
        setCustomerName(selectedValue?.label);
        setCId(selectedValue?.cId);
        setCustomerSid(selectedValue?.cId);
    }

    // HANDLE INVOICE SELECT
    function onInvoiceSelectChange(selectedValue) {
        setInvoiceName(selectedValue?.invNo || "");
        setInvoiceId(selectedValue?.id || "");
        setDelAddress(selectedValue?.billAdd || "");
        setDelAddGstIn(selectedValue?.gstNo || "");
        setStateCode(selectedValue?.stateCode || "");
    }

    const handleShippingTextFieldChange = (event) => {
        setShippingAddress(event.target.value);
    };

    // CHANGE CUSTOMER
    const handleChangeCustomer = (e) => {
        CreditNoteCustomer(
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

    // CHANGE INVOICE
    const handleChangeInvoice = (e) => {
        CreditNoteInvoice(
            { code: e.target.value, cId: cId },
            handleInvoiceDropshow,
            handleInvoiceDropshowException
        );
    };
    const handleInvoiceDropshow = (dataObject) => {
        setCustInvoiceLists(dataObject?.data || []);
    };
    const handleInvoiceDropshowException = (error, errorMessage) => {
    };

    const handleSelectedItemsDeleteRow = (id) => {
        const newArray = selectedItems.filter((item) => item.id != id);
        setSelectedItems(newArray);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const headerData = {
            digit: unitNumber,
            cName: selectedCustomerName,
            returnNo: referenceNumber,
            gstMstId: invoiceId,
            invNo: invoiceName,
            date: selectedDate,
        }

        const updatedGstOrderItemData = selectedItems.slice(0, -1);
        const filteredArray = updatedGstOrderItemData.map((item) => ({
            id: item.id,
            itemId: item.itemId,
            invRate: item.invRate,
            invQty: item.invQty,
            retd: item.retd,
            value: item.value,
            cgstRate: item.cgstRate,
            cgstAmt: item.cgstAmt,
            sgstRate: item.sgstRate,
            sgstAmt: item.sgstAmt,
            igstRate: item.igstRate,
            igstAmt: item.igstAmt,
            remarks: item.remarks,
            invNo: item.invNo,
            invoIssuDate: item.invoIssuDate
        }))

        handleAddCreditNote({ mainData: headerData, items: filteredArray }, handleSuccess, handleException);

    };

    const handleSuccess = (dataObject) => {
        handleForwardReverse('last', '')
        setRefreshData((oldValue) => !oldValue);
        setNotification({
            status: true,
            type: "success",
            message: dataObject.message,
        });
        ClearData();
        setTimeout(() => {
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
            ClearData();
            setRefreshData((oldValue) => !oldValue);
            setLoading(false);
        }, 2000);
    };

    const ClearData = () => {
        setInvCode("");
        setInvAutoCode("");
        setAutoCode("");
        setCustomerSelect("");
        setCustomerSelectList([]);
        setCustomerName("");
        setBillingAddress("");
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
        setTransporterList([]);
        setTransporterGSTIN("");
        setDistanceKMS("");
        setShippingPincode("");
        setToStatecode("");
        setGoodsOrService("");
        setLabourCharge("");
        setLabourHeadingRequired("");
        setReverseCharge("");
        setSupplyTypeCode("");
        setDispatchFrom("");
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
        ///////////////
        setReferenceNumber('');
        setUnitNumber('');
        setCustInvoiceLists([]);
        setInvoiceName('');
        setInvoiceId('');
        setDelAddress('');
        setDelAddGstIn('');
        setStateCode('');
        SaledReturnAutoGen(handleGSTAutoGen, handleGSTAutoGenException);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setNotification({
            status: false,
            type: "",
            message: "",
        });
    };

    // HANDLE FORWARD REVERSE HANDLER
    const handleForwardReverse = (type, id) => {
        CreditNotePreview({ type: type, id: id }, handleActionSuccess, handleActionException)
    }

    const handleActionSuccess = (dataObject) => {
        setIsPoView(true)
        setReferenceNumber(dataObject?.mainData?.returnNo || '');
        setSelectedDate(dataObject?.mainData?.date || '');
        setUnitNumber(dataObject?.mainData?.digit || '');
        setSelectedCustomerName(dataObject?.mainData?.custName || '');
        setInvoiceName(dataObject?.mainData?.invNo || '');
        setDelAddress(dataObject?.mainData?.billAdd || '');
        setDelAddGstIn(dataObject?.mainData?.gstNo || '');
        setStateCode(dataObject?.mainData?.stateCode || '');
        setMainId(dataObject?.mainData?.id || '');
        setSelectedItems(dataObject?.items || []);
    }
    const handleActionException = () => { }

    const handleClearPage = () => {
        setIsPoView(false)
        setIsEdit(false)
        setMainId('')
        setReferenceNumber('');
        setUnitNumber('');
        setSelectedCustomerName('');
        setInvoiceName('');
        setDelAddress('');
        setDelAddGstIn('');
        setStateCode('');
        setMainId('');
        setSelectedItems([{ id: "RDL1" }]);
        setSelectedDate(new Date())
        SaledReturnAutoGen(handleGSTAutoGen, handleGSTAutoGenException);
    }

    const handlePOChange = (e) => {
        GetGenerateSalesReturn({ type: 'creditNote', code: e.target.value }, handleGeneratedPoSucessShow, handleGeneratedPoExceptionShow);
    }

    const handleGeneratedPoSucessShow = (dataObject) => {
        setGeneratedGstInvoiceLists(dataObject?.data || []);
    }

    const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => {
    }

    const handleGeneratedPoSelect = (selectedValue) => {
        setIsPoView(true)
        if (selectedValue !== null) {
            setGstInvoiceId(selectedValue.id || '')
            ViewCreditNotes({ id: selectedValue.id }, handleActionSuccess, handleActionException);
        }
    }

    //CENCEL INVOICE CUSTOM MODAL
    const handleCustomeSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setCustomeOpen(false);
        handleClearPage();
        setTimeout(() => {
            handleClose();
        }, 3000);
    }

    const handleCustomeFailure = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
        }, 3000);
    }

    //HANDLE ITEM SEARCH
    const handleChange = (e) => {
        GetInvoiceItems(
            { id: invoiceId, code: e.target.value },
            handlePartNoDropshow,
            handlePartNoDropshowException
        );
    };

    const handlePartNoDropshow = (dataObject) => {
        setPartNoList(dataObject?.data || []);
    };

    const handlePartNoDropshowException = (error, errorMessage) => {
    };

    // Load Items Dialog handlers
    const handleLoadItemsClick = () => {
        if (!invoiceId) {
            setNotification({
                status: true,
                type: 'error',
                message: 'Please select an Invoice before loading items.',
            });
            return;
        }
        // Fetch invoice items using only invoiceId
        LoadGetInvoiceItemsList({ id: invoiceId }, handleLoadItemsFetchSuccess, handlePartNoDropshowException);
        setLoadItemsDialogOpen(true);
    };

    const handleLoadItemsFetchSuccess = (dataObject) => {
        // Map API response to rows with unique IDs
        const rows = (dataObject?.data || []).map((r, idx) => ({
            id: r.id || r.itemId || `item_${idx}`,
            partNo: r.partNo || r.itemCode || '',
            partName: r.partName || r.itemName || '',
            invNo: r.invNo || invoiceName || '',
            invoIssuDate: r.invoIssuDate || r.invDate || '',
            invRate: r.invRate || r.rate || 0,
            invQty: r.invQty || r.qty || 0,
            value: r.value || (Number(r.invRate || 0) * Number(r.invQty || 0)),
            hsnCode: r.hsnCode || r.hsn || '',
            ...r, // spread rest of response fields
        }));
        setLoadItemsRows(rows);
    };

    const handleLoadItemsClose = () => {
        setLoadItemsDialogOpen(false);
        setLoadItemsSelection([]);
    };

    const handleRowSelection = (newSelection) => {
        setLoadItemsSelection(newSelection);
    };

    const handleLoadItemsSubmit = () => {
        if (!loadItemsSelection || loadItemsSelection.length === 0) {
            setNotification({
                status: true,
                type: 'error',
                message: 'No items selected. Please select items before submitting.',
            });
            return;
        }

        // Get selected rows from loadItemsRows
        const selectedRows = loadItemsRows.filter((r) => loadItemsSelection.includes(r.id));
        if (selectedRows.length === 0) {
            setNotification({
                status: true,
                type: 'error',
                message: 'Selected items not found.',
            });
            return;
        }

        // Map selected rows to table format
        const mapped = selectedRows.map((it) => ({
            id: it.id || it.itemId,
            itemId: it.itemId || it.id,
            partNo: it.partNo || '',
            partName: it.partName || '',
            invNo: it.invNo || invoiceName || '',
            invoIssuDate: it.invoIssuDate || '',
            invRate: it.invRate || 0,
            invQty: it.invQty || 0,
            retd: 0,
            value: it.value || 0,
            hsnCode: it.hsnCode || '',
            cgstRate: it.cgstRate || '',
            cgstAmt: it.cgstAmt || '',
            sgstRate: it.sgstRate || '',
            sgstAmt: it.sgstAmt || '',
            igstRate: it.igstRate || '',
            igstAmt: it.igstAmt || '',
            remarks: it.remarks || '',
        }));

        // Append to selectedItems before RDL1 footer
        const cloned = [...selectedItems];
        const footer = cloned.pop(); // Remove RDL1
        const newArray = [...cloned, ...mapped, footer]; // Add new items + RDL1
        setSelectedItems(newArray);

        setNotification({
            status: true,
            type: 'success',
            message: `${selectedRows.length} item(s) added to table.`,
        });
        setLoadItemsDialogOpen(false);
        setLoadItemsSelection([]);
    };

    // DataGrid columns for Load Items dialog
    const loadItemsColumns = [
        { field: 'partNo', headerName: 'Item Code', flex: 2, align: 'center', headerAlign: 'center', headerClassName: 'super-app-theme--header' },
        { field: 'partName', headerName: 'Item Name', flex: 2, align: 'center', headerAlign: 'center', headerClassName: 'super-app-theme--header' },
        { field: 'invNo', headerName: 'Inv No', flex: 1, align: 'center', headerAlign: 'center', headerClassName: 'super-app-theme--header' },
        { field: 'invoIssuDate', headerName: 'Inv Date', flex: 1, align: 'center', headerAlign: 'center', headerClassName: 'super-app-theme--header' },
        { field: 'invRate', headerName: 'Unit Price', flex: 1, align: 'center', headerAlign: 'center', type: 'number', headerClassName: 'super-app-theme--header' },
        { field: 'invQty', headerName: 'Inv Qty', width: 50, align: 'center', headerAlign: 'center', type: 'number', headerClassName: 'super-app-theme--header' },
        { field: 'value', headerName: 'Value', flex: 1, align: 'center', headerAlign: 'center', type: 'number', headerClassName: 'super-app-theme--header' },
        { field: 'hsnCode', headerName: 'HSN Code', flex: 1, align: 'center', headerAlign: 'center', headerClassName: 'super-app-theme--header' },
    ];

    function onPartNoSelectChange(selectedValue, event) {
        if (selectedValue !== null) {
            const clonedSelectedItems = [...selectedItems];
            const lastObj = clonedSelectedItems.pop();
            clonedSelectedItems.push(selectedValue, lastObj);
            setSelectedItems(clonedSelectedItems);
        }
    }

    //NEW TABLE ENTRY CODE
    const handleEdit = (cellNam, newValue, id, rowData) => {
        switch (cellNam) {
            case "retd":
                const updatedRcvdQty = selectedItems.map((data) => {
                    if (data.id === id && cellNam === 'retd') {

                        if (Number(newValue) > Number(rowData.invQty)) {
                            setNotification({
                                status: true,
                                type: 'error',
                                message: 'Value cannot be greater than Invoice Quantity',
                            });
                            return {
                                ...data,
                                retd: rowData.retd,
                            };
                        }

                        const newRetd = Number(newValue);
                        const newItemValue = Number(rowData.invRate) * newRetd;

                        return {
                            ...data,
                            retd: newRetd,
                            value: newItemValue,

                            // 🔥 Auto update GST amounts
                            cgstAmt: (newItemValue * Number(data.cgstRate)) / 100,
                            sgstAmt: (newItemValue * Number(data.sgstRate)) / 100,
                            igstAmt: (newItemValue * Number(data.igstRate)) / 100
                        };
                    }
                    return data;
                });
                setSelectedItems(updatedRcvdQty);
                break;
            case "cgstRate":
                const updatedCgstRate = selectedItems.map((data) =>
                    data.id === id && cellNam === 'cgstRate' ?
                        {
                            ...data,
                            cgstRate: newValue,
                            cgstAmt: (Number(rowData.value) * Number(newValue)) / 100

                        }
                        : data
                )
                setSelectedItems(updatedCgstRate);
                break;
            case "sgstRate":
                const updatedSgstRate = selectedItems.map((data) =>
                    data.id === id && cellNam === 'sgstRate' ?
                        {
                            ...data,
                            sgstRate: newValue,
                            sgstAmt: (Number(rowData.value) * Number(newValue)) / 100
                        }
                        : data
                )
                setSelectedItems(updatedSgstRate);
                break;
            case "igstRate":
                const updatedIgstRate = selectedItems.map((data) =>
                    data.id === id && cellNam === 'igstRate' ?
                        {
                            ...data,
                            igstRate: newValue,
                            igstAmt: (Number(rowData.value) * Number(newValue)) / 100
                        }
                        : data
                )
                setSelectedItems(updatedIgstRate);
                break;
            case "Remarks":
                const updatedRemarks = selectedItems.map((data) =>
                    data.id === id && cellNam === 'Remarks' ?
                        {
                            ...data,
                            remarks: newValue,
                        }
                        : data
                )
                setSelectedItems(updatedRemarks);
                break;
            default:
            // code block
        }
    }

    // PRINT INVOICE
    const handleCreditNoteInvoice = () => {
        ViewCreditNotes({ id: mainId }, handlePdfInvSucess, handePdfInvException)
    }

    const handlePdfInvSucess = (dataObject) => {
        handleFileSave(dataObject || []);
    }

    const handePdfInvException = (errorStatus, errorMessage) => {
        console.log(errorMessage);
    }

    const handleFileSave = (data) => {
        setPdfModalOpen(true)
        let info = []
        data.items.forEach((element, index, array) => {
            info.push([index + 1, element.partNo, element.partName, element.invRate, element.invQty, element.retd, element.value, element.hsnCode])
        });

        // Ensure a minimum of 10 items
        const minItems = 21;
        const placeholderItem = [''];
        while (info.length < minItems) {
            info.push([...placeholderItem]);
        }

        const doc = new jsPDF();
        const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
        // console.log("baseUrl------------------>>>>>>>>>>>>>>", baseUrl);
        // const logoUrl = (await import('../../AllImage/RDL_Logo.png')).default;
        const logoUrl = `${baseUrl}/${data.mainData.companyImage}`
        const ISOUrl = require('../../../AllImage/ISOlogo.png');

        const tableOptions = {
            didDrawPage: (HookData) => {
                if (HookData.pageNumber === 1) {
                    // Add an image on the first page L,Top/bottom, widht,height
                    doc.addImage(logoUrl, 'PNG', 18, 18, 28, 20);
                    doc.addImage(ISOUrl, 'PNG', 170, 18, 20, 10);
                }
            },
        };

        //Header1
        const logoAndAddress = [
            [
                {
                    content: 'ORIGINAL FOR RECIPIENT',
                    colSpan: 8,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0 }
                }
            ],
            [
                {
                    content: 'SALES RETURN',
                    colSpan: 8,
                    styles: { halign: 'center', fontSize: 10, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold', fillColor: '#CCCCCC' }
                },
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
                    content: `${data.mainData.companyName}\n${data.mainData.companyAdd}. Tel:${data.mainData.telNo}\nWeb Site :${data.mainData.website}\nEmail : ${data.mainData.email}`,
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'ISO 9001 : 2015\nISO 14001 : 2015\nOHSAS 18001 : 2007',
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', valign: 'bottom' }
                }
            ]
        ];

        //Header2
        const pan = [[
            {
                content: `CIN No. ${data.mainData.cmpCinNo}`,
                colSpan: 2,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: `PAN No.${data.mainData.cmpPanNo}`,
                colSpan: 2,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: `GSTINO. ${data.mainData.cmpGstNo}`,
                colSpan: 2,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: 'No:2324006750',
                colSpan: 2,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
            }
        ]];

        //Header3
        const address = [
            [
                {
                    content: `Bill To:\n${data.mainData.billAdd}`,
                    colSpan: 8,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: `Customer : ${data.mainData.cName}`,
                    colSpan: 3,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: `Del Add GSTIN : ${data.mainData.gstNo}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: `State Code : ${data.mainData.stateCode}`,
                    colSpan: 1,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ]
        ];

        //Header4
        const firstHeaderRow = [
            [
                {
                    content: `INVOICE NO: ${data.mainData.invNo}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `Invoice Issue Date: ${data.mainData.invoIssuDate}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `Reference Number:${data.mainData.returnNo}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `Unit: ${data.mainData.digit}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
            ],
        ];

        //Columns
        const secondHeaderRow = [['Sno', 'Item Code', 'Item Name', 'Unit Price', 'Inv Qty', 'Rej Qty', 'Value', 'HSN Code']];

        const headerRows = [...logoAndAddress, ...pan, ...address, ...firstHeaderRow, ...secondHeaderRow];

        //Header5
        const totalRow = [
            [
                {
                    content: 'LABOUR CHARGES ONLY',
                    colSpan: 4,
                    rowSpan: 1,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }

                },
                {
                    content: 'Total Qty',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `${data.mainData.totalQty}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },
            ],
            [
                {
                    content: '',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'Taxable Value for GST Payable:',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `${data.mainData.taxableValueforGST}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },

            ],
            [
                {
                    content: '',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'CGST @ 9.00 % ',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `${data.mainData.CGST}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },

            ],
            [
                {
                    content: '',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'SGST @ 9.00 % ',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `${data.mainData.SGST}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },

            ],
            [
                {
                    content: '',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'Total Value ',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `${data.mainData.totalValue}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },
            ],
            [
                {
                    content: '',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'Round Off ',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `${data.mainData.roundOff}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },

            ],
            [
                {
                    content: `Grand Total In Words: ${data.mainData.totalInWords}`,
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'Grand Total',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `${data.mainData.invValue}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },
            ],
        ];

        //Header6
        const totalWords = [
            [
                {
                    content: 'Certified that the particulars given below are true and correct and the amount indicated represents the price actually charged and that there is no flow of additional consideration directly or indirectly from the buyer',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: 'For RDL Technologies Pvt Ltd.\nSignature not verified\nDigitally Signed By:\nAuthorised Signatory\nSignature of the Licences or his Authorised Agent',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8 }
                },
            ],
        ];

        //Table Border lines
        const outerTable = [
            [
                {
                    content: 'Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076',
                    colSpan: 10,
                    styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', lineWidth: 0.1 }
                },
            ],

        ];

        const bodyRows = [...info, ...totalWords,]
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

        // doc.save('Labour Charge.pdf');
        const pdfBlob = doc.output('blob');
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfBlobUrl);
    }

    console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz", selectedDate);

    return (
        <>
            <div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: 'space-between',
                        marginLeft: "10px",
                        marginTop: "10px",
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography
                            sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
                            variant="h5"
                        >
                            Credit Note/Sales Return
                        </Typography>
                    </div>
                    <div style={{ width: '250px', marginRight: '10px' }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={generatedGstInvoiceLists}
                            fullWidth
                            getOptionLabel={(option) => option.digit}
                            renderInput={(params) => <TextField {...params} label="Search PO" onChange={handlePOChange} />}
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
                                <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                    <TextField
                                        fullWidth
                                        label="Reference No"
                                        placeholder="Reference No"
                                        value={referenceNumber}
                                        disabled={true}
                                        size="small"
                                        style={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "5px",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                    <TextField
                                        fullWidth
                                        label="Unit"
                                        placeholder="Unit"
                                        value={unitNumber}
                                        disabled={true}
                                        size="small"
                                        style={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "5px",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                                    <TextField
                                        fullWidth
                                        label="Date"
                                        placeholder="Date"
                                        variant="outlined"
                                        required
                                        type="date"
                                        size="small"
                                        disabled={true}
                                        style={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "5px",
                                        }}
                                        value={formatDate(selectedDate)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
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
                                        onChange={(event, value) =>
                                            onCustomerSelectChange(value, event)
                                        }
                                        size="small"
                                        style={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "5px",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Autocomplete
                                        fullWidth
                                        disablePortal
                                        id="combo-box-demo"
                                        value={invoiceName}
                                        options={custInvoiceLists}
                                        disabled={isPOView ? true : false}
                                        getOptionLabel={(option) => option.invNo || invoiceName}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Search Invoice No "
                                                onChange={handleChangeInvoice}
                                            />
                                        )}
                                        onChange={(event, value) =>
                                            onInvoiceSelectChange(value, event)
                                        }
                                        size="small"
                                        style={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "5px",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ float: "right" }}>
                                    </Grid>

                                    <TextField
                                        fullWidth
                                        id="outlined-multiline-static"
                                        label="Del Address"
                                        multiline
                                        rows={3}
                                        disabled={isPOView ? true : false}
                                        value={delAddress}
                                        readOnly={true}
                                        size="small"
                                        style={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "5px",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <TextField
                                        fullWidth
                                        id="outlined-multiline-static"
                                        label="Del Address GSTIN"
                                        rows={3}
                                        disabled={isPOView ? true : false}
                                        value={delAddGstIn}
                                        onChange={handleShippingTextFieldChange}
                                        readOnly={true}
                                        size="small"
                                        style={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "5px",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <TextField
                                        fullWidth
                                        id="outlined-multiline-static"
                                        label="Sate Code"
                                        rows={3}
                                        disabled={isPOView ? true : false}
                                        value={stateCode}
                                        onChange={handleShippingTextFieldChange}
                                        readOnly={true}
                                        size="small"
                                        style={{
                                            backgroundColor: "#ffffff",
                                            borderRadius: "5px",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        disabled={isPOView === true || isModuleLocked}
                                        style={getHighlightStyle(
                                            "LoadItems",
                                            {
                                                backgroundColor: isModuleLocked ? "grey" : "#002D68", // ✅ use backgroundColor
                                                height: "40px",
                                            },
                                            isPOView
                                        )}
                                        onClick={() => {
                                            setActiveButton("LoadItems"); // 🔵 highlight
                                            handleLoadItemsClick();       // ✅ existing logic
                                        }}
                                    >
                                        Load Items
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={0.5} lg={0.5} xl={0.5}></Grid>

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
                                    {/* <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "15px" }}>
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", columnGap: "10px", rowGap: "10px", }}>
                                            <Button
                                                variant="contained"
                                                style={{
                                                    width: "100%",
                                                    background: "#002D68",
                                                    color: "white",
                                                    height: "35px",
                                                }}
                                                onClick={handleClearPage}
                                            >
                                                New
                                            </Button>
                                            <Button
                                                variant="contained"
                                                style={{
                                                    width: "100%",
                                                    background: "#002D68",
                                                    color: "white",
                                                    height: "35px",
                                                }}
                                                onClick={handleClearPage}
                                            >
                                                Clear
                                            </Button>
                                            <Button
                                                variant="contained"
                                                style={{
                                                    width: "100%",
                                                    background: gstInvoiceId ? "#002D68" : "gray",
                                                    color: gstInvoiceId ? "white" : "black",
                                                    height: '35px',
                                                }}
                                                onClick={handleCreditNoteInvoice}
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
                                                onClick={() => handleForwardReverse('first', '')}
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
                                                onClick={() => handleForwardReverse('reverse', mainId)}
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
                                                onClick={() => handleForwardReverse('forward', mainId)}
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
                                                onClick={() => handleForwardReverse('last', '')}
                                            >
                                                <FastForwardIcon />
                                            </Button>
                                        </div>
                                        <div style={{ display: "flex", gap: "5px" }}>
                                            {isPOView ?
                                                ""
                                                :
                                                <Button
                                                    variant="contained"
                                                    type="submit"
                                                    style={{
                                                        height: "35px",
                                                        backgroundColor: "#002d68",
                                                    }}
                                                    disabled={isPOView || loading === true ? true : false}
                                                >
                                                    {loading ? (
                                                        <CircularProgress size={24} style={{ color: 'white' }} />
                                                    ) : (isEdit ? "UPDATE" : "SAVE")}
                                                </Button>
                                            }
                                        </div>

                                    </div> */}
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "15px" }}>
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", columnGap: "10px", rowGap: "10px" }}>

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
                                                style={getHighlightStyle(
                                                    "Print",
                                                    {
                                                        width: "100%",
                                                        backgroundColor: isModuleLocked ? "grey" : "#002D68",
                                                        height: "35px",
                                                    },
                                                    !gstInvoiceId
                                                )}
                                                disabled={!gstInvoiceId || isModuleLocked}
                                                onClick={() => {
                                                    setActiveButton("Print");
                                                    handleCreditNoteInvoice();
                                                }}
                                            >
                                                Print
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
                                            {isPOView ? (
                                                ""
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    type="submit"
                                                    disabled={isPOView || loading === true || isModuleLocked}
                                                    style={getHighlightStyle(
                                                        "SaveUpdate",
                                                        {
                                                            height: "35px",
                                                            backgroundColor: isModuleLocked ? "grey" : "#002d68",
                                                        },
                                                        isPOView || loading
                                                    )}
                                                    onClick={() => setActiveButton("SaveUpdate")}
                                                >
                                                    {loading ? (
                                                        <CircularProgress size={24} style={{ color: "white" }} />
                                                    ) : (
                                                        isEdit ? "UPDATE" : "SAVE"
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ overflowX: 'scroll' }}>
                                        <table id="customers">
                                            <thead>
                                                <tr>
                                                    <th style={{ whiteSpace: 'nowrap' }}>Item Code</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>Item Name</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>Inv No</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>Inv Date</th>
                                                    {/* <th>Category</th> */}
                                                    {/* <th>Unit</th> */}
                                                    <th style={{ whiteSpace: 'nowrap' }}>Unit Price</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>Inv Qty</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>Rej Qty</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>Value</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>HSN Code</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>CGST Rate</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>CGST Amt</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>SGST Rate</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>SGST Amt</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>IGST Rate</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>IGST Amt</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>Remarks</th>
                                                    <th style={{ whiteSpace: 'nowrap' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td contentEditable={false} onBlur={handleEdit} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.partNo ? (
                                                                <span>{item.partNo}</span>
                                                            ) : (
                                                                <Autocomplete
                                                                    fullWidth
                                                                    disablePortal
                                                                    id={`combo-box-${index}`}
                                                                    size="small"
                                                                    disabled={isPOView ? true : false}
                                                                    options={partNoList}
                                                                    getOptionLabel={(option) => option.partNo}
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
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.partName}
                                                        </td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.invNo}
                                                        </td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.invoIssuDate}
                                                        </td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.invRate}
                                                        </td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.invQty}
                                                        </td>
                                                        <td
                                                            contentEditable={true}
                                                            onBlur={(e) => handleEdit("retd", e.target.textContent, item.id, item)}
                                                            style={{ whiteSpace: 'nowrap' }}
                                                        >
                                                            {item.retd}
                                                        </td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.value}
                                                        </td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.hsnCode}
                                                        </td>
                                                        <td contentEditable={true} onBlur={(e) => handleEdit("cgstRate", e.target.textContent, item.id, item)} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.cgstRate}
                                                        </td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.cgstAmt}
                                                        </td>
                                                        <td contentEditable={true} onBlur={(e) => handleEdit("sgstRate", e.target.textContent, item.id, item)} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.sgstRate}
                                                        </td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.sgstAmt}
                                                        </td>
                                                        <td contentEditable={true} onBlur={(e) => handleEdit("igstRate", e.target.textContent, item.id, item)} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.igstRate}
                                                        </td>
                                                        <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.igstAmt}
                                                        </td>
                                                        <td contentEditable={true} onBlur={(e) => handleEdit("Remarks", e.target.textContent, item.id, item)} style={{ whiteSpace: 'nowrap' }}>
                                                            {item.remarks}
                                                        </td>
                                                        <td
                                                            contentEditable={!isPOView ? true : false}
                                                            style={{ textAlign: "center", whiteSpace: 'nowrap' }}
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
                    </Grid>
                </form>

                <CustomePopUp
                    title={'Confirmation'}
                    titleColor={'#000000'}
                    message={'Are you sure you want to cancel this invoice?'}
                    messageColor={'#000000'}
                    CustomIcon={ReceiptIcon}
                    iconColor={'#074173'}
                    confirmButtonTitle={'YES'}
                    confirmButtonBackGround={'#41B06E'}
                    confirmButtonTextColor={'#ffffff'}
                    closeButtonTitle={'NO'}
                    closeButtonBackground={'#DD5746'}
                    closeButtonTextColor={'#ffffff  '}
                    customeOpen={customeOpen}
                    setCustomeOpen={setCustomeOpen}
                    handleCustomeSuccess={handleCustomeSuccess}
                    handleCustomeFailure={handleCustomeFailure}
                    customeServicesApi={CancelGstSaleInvoice}
                    bodyData={{ id: gstInvoiceId }}
                />

                <NotificationBar
                    handleClose={handleClose}
                    notificationContent={openNotification.message}
                    openNotification={openNotification.status}
                    type={openNotification.type}
                />

                {/* Load Items Dialog */}
                <Dialog open={loadItemsDialogOpen} onClose={handleLoadItemsClose} maxWidth="lg" fullWidth>
                    <DialogTitle style={{ background: '#002D68', color: 'white', fontWeight: 'bold' }}>
                        Select Invoice Items
                    </DialogTitle>
                    <DialogContent style={{ padding: '16px' }}>
                        <div style={{ height: '60vh', width: '100%' }}>
                            <DataGrid
                                rows={loadItemsRows}
                                columns={loadItemsColumns}
                                checkboxSelection
                                disableRowSelectionOnClick
                                onRowSelectionModelChange={handleRowSelection}
                                sx={{
                                    overflow: 'auto',
                                    height: '100%',
                                    width: '100%',
                                    '& .super-app-theme--header': {
                                        WebkitTextStrokeWidth: '0.6px',
                                        backgroundColor: '#93bce6',
                                        color: '#1c1919'
                                    },

                                    // Better borders
                                    '& .MuiDataGrid-cell': {
                                        borderBottom: '1px solid #e0e0e0',
                                    },
                                    '& .MuiDataGrid-columnHeaders': {
                                        borderBottom: '1px solid #bcbcbc',
                                    },
                                }}

                                getRowClassName={(params) => {
                                    const rowIndex = loadItemsRows.findIndex(row => row.id === params.row.id);
                                    if (rowIndex !== -1) {
                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    }
                                    return '';
                                }}
                                rowHeight={40}
                                columnHeaderHeight={40}
                                pageSizeOptions={[10, 25, 50]}
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 10 } },
                                }}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions style={{ padding: '16px' }}>
                        <Button onClick={handleLoadItemsClose} style={{ color: '#002D68' }}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleLoadItemsSubmit}
                            style={{ background: '#002D68', color: 'white' }}
                        >
                            Add Selected Items
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
                    <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>GOODS RECEIPT NOTE-INPUT</DialogTitle>

                    <DialogContent style={{ padding: '2px' }}>
                        {pdfUrl &&
                            <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
                        }
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setPdfModalOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>

            </div >
        </>
    );
};

export default SalesReturn;
