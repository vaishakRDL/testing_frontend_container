import {
    Autocomplete,
    Button,
    Card,
    CardContent,
    Checkbox,
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
    CancelInvoiceViewing,
    CustomerDropShowInvoice,
    FetchCustomerAddress,
    FetchGSTCustomerAddress,
    GSTAutoGen,
    GSTInvAdd,
    GSTInvUpdate,
    GSTshowconsignee,
    GetGenerateGSTSaleInvoice,
    GstInvoicePreview,
    GstPartNoSelect,
    GstViewing,
    MstDispatchShowData,
    MstTransporterShowData,
    PartNoSelectGST,
} from "../../../ApiService/LoginPageService";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { useEffect } from "react";
// import ChangeAddress from "./ChangeAddress";
// import DCGstSelectionModel from "./DCGstSelectionModel";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import LoadPendingPO from "./LoadPendingPO";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";
import "../../PurchaseOrderGeneration/PurchaseOrder.css";
// import DcSelection from "./DcSelection";
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
// import LabourChargeInvoice from "./LabourChargeInvoice";
// import GstTaxInvoice from "./GstTaxInvoice";

const CancelInvoice = () => {
    const [activeButton, setActiveButton] = useState("");

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Cancel GST Sales Invoice")?.lockStatus === "locked";

    const getHighlightStyle = (name, baseStyle = {}, disabled = false) => ({
        ...baseStyle,
        backgroundColor: disabled
            ? "grey"
            : activeButton === name
                ? "#0d6efd"
                : baseStyle.backgroundColor,
        transition: "0.3s",
        color: disabled ? "black" : "white",
    });

    const [displayAllGstTotal, setDisplayAllGstTotal] = useState(0);
    const [tcsPercentage, setTcsPercentage] = useState(0);
    const [displayAllTcsTotal, setDisplayAllTcsTotal] = useState(0);
    function convertToISO(dateStr) {
        // Split the "DD-MM-YYYY" format
        const [day, month, year] = dateStr.split('-');

        // Create a new Date object using "YYYY-MM-DD"
        const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

        return isoDate.toISOString(); // Convert to "YYYY-MM-DDTHH:mm:ss.SSSZ"
    }
    // const [tcsAmount, setTcsAmount] = useState(0);
    const [dispatchFromCopy, setDispatchFromCopy] = useState("");
    const [dispatchFromId, setDispatchFromId] = useState("");
    const [dispatchAddress, setDispatchAddress] = useState('');
    const [surChrgesTCSPercentage, setSurChrgesTCSPercentage] = useState(0);
    const [cessOnTcsPercentage, setCessOnTcsPercentage] = useState(0);
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
    const [selectedItems, setSelectedItems] = useState([]);
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

    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');

    const location = useLocation();
    const { items } = location.state || { items: [] };
    //--View--//
    // const isPOView = new URLSearchParams(location.search).get("isPOView");
    const isCancelInvoiceView = new URLSearchParams(location.search).get("isCancelInvoiceView");
    const poRowId = new URLSearchParams(location.search).get("poRowId");

    //--Edit--//
    // const isEdit = new URLSearchParams(location.search).get("isEdit");

    useEffect(() => {
        // if (isPOView || isEdit) {
        //   GstViewing({ id: poRowId }, handleGstViewing, handleGstViewingException);
        // }
        if (isCancelInvoiceView) {
            GstViewing({ id: poRowId }, handleGstViewing, handleGstViewingException);
        }
        // GSTAutoGen({ po: invCode }, handleGSTAutoGen, handleGSTAutoGenException);
    }, [/*isPOView, isEdit, poRowId, invCode*/isCancelInvoiceView]);

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
    };

    const handleGstViewingException = (errorObject, errorMessage) => { };

    const onInvTypeChange = (e) => {
        setInvType(e.target.value);
    };

    const onInvCodeChange = (e) => {
        setInvCode(e.target.value);
    };

    const handleGSTAutoGen = (dataObject) => {
        setInvAutoCode(dataObject.digit);
        setAutoCode(dataObject.id);
    };

    const handleGSTAutoGenException = (errorStatus, errorMessage) => { };

    const optionsCustList = Array.isArray(customerSelectList)
        ? customerSelectList.map((item) => ({
            cId: item?.cId,
            label: item?.cCode,
            cName: item?.cName,
        }))
        : [];

    function onCustomerSelectChange(selectedValue) {
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

    // const handleFetchCustAddressSuccess = (dataObject) => {
    //     setBillingAddress(dataObject?.data[0]?.cAddress || "");
    //     setShippingAddress(dataObject?.data[0]?.cAddress || "");
    //     setState(dataObject?.data[0]?.state || "");
    //     setCountry(dataObject?.data[0]?.country || "");
    //     setGstNo(dataObject?.data[0]?.gstNo || "");
    //     setPanNo(dataObject?.data[0]?.panNo || "");
    // };
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
    }, []);

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
    };

    const optionsPartNoList = partNoList
        ? partNoList.map((item) => ({
            value: item?.id,
            label: item?.label,
        }))
        : [];

    const handleChange = (e) => {
        PartNoSelectGST(
            { id: cId },
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
    const handlePartNoShowSuccess = (dataObject) => {
        const data = dataObject?.data || [];
        // setDcPartNo(data[0].itemCode);
        setRows(data);
        const formattedData = data.map((item) => ({
            id: item.id || null,
            suppDesc: null,
            itemCode: item?.itemCode || "",
            itemName: item.itemName || "",
            uom: item.uom || 0,
            soNo: item.soNo || "",
            poNo: item.poNo || "",
            Qty: item.Qty || "",
            cumQty: item.cumQty || "",
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
            const clonedSelectedItems = [...selectedItems];
            const lastObj = clonedSelectedItems.pop();
            clonedSelectedItems.push(...formattedData, lastObj);
            setSelectedItems(clonedSelectedItems);
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
        const gstOrderData = {
            invCode: invCode,
            type: invType,
            invSt: invAutoCode,
            invNo: autoCode,
            date: selectedDate,
            custName: cId,
            billAdd: billingAddress,
            shipAdd: shippingAddress,
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
            dispatchFrom: dispatchFrom,
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
            CGST: cgst,
            SGST: sgst,
            IGST: igst,
            UTGST: utgst,
            totGst: totlGST,
            tcs: tcs,
            subChargeOnTcs: surChrgesTCS,
            totalValue: totlValues,
            roundOff: roundOff,
            invValue: invValue,
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

        const updatedGstOrderItemData = gstOrderItemData.slice(0, -1);
        const updatedPendingPoLists = pendingPOList.slice(0, -1);

        const requestData = {
            gstOrderData: gstOrderData,
            gstOrderItemData: isEdit ? gstOrderItemData : [...updatedGstOrderItemData, ...updatedPendingPoLists, ...dcSelectionData],
            // id: isEdit ? poRowId : "",
            id: isEdit ? mainId : "",
        };
        if (isEdit) {
            GSTInvUpdate(requestData, handleSuccess, handleException);
        } else {
            GSTInvAdd(requestData, handleSuccess, handleException);
        }
    };

    const handleSuccess = (dataObject) => {
        setRefreshData((oldValue) => !oldValue);
        setNotification({
            status: true,
            type: "success",
            message: dataObject.message,
        });
        ClearData();
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
        }, 2000);
    };

    const calculateTotals = (data) => {
        const totQty =
            data && data.reduce((acc, item) => acc + (Number(item.invQty) || 0), 0);
        setTotQty(totQty);

        const taxGSTPayable =
            data && data.reduce((acc, item) => acc + (Number(item.stdRate) || 0), 0);
        setTaxGsTPayable(taxGSTPayable);

        const subTotal =
            data && data.reduce((acc, item) => acc + (Number(item.amt) || 0), 0);
        setSubTotal(subTotal);

        // Calculate discounted total
        const lessDiscountTotal = (Number(subTotal) * Number(lessDisc)) / 100;

        // Calculate other total
        const lessOtherTotal = (Number(subTotal) * Number(lessOther)) / 100;

        // Update subTotal after applying both discounts
        const subTotalValue =
            Number(subTotal) - Number(lessDiscountTotal) - Number(lessOtherTotal);
        setSubTotal(subTotalValue);

        // Packing Transport Sub Total
        const packingTransportTotal =
            Number(subTotalValue) + Number(packFrwrd) + Number(trnsprtcharges);
        setSubTotl(packingTransportTotal);

        // Amount for GST Payable
        const amountForGSTPayable =
            Number(packingTransportTotal) +
            Number(insurance) +
            Number(custmrMeterlValue) +
            Number(ammortisanCost);
        setAmtGSTPayble(amountForGSTPayable);

        // const totalValue=
        setTotlValues();

        return [{ id: 1, totQty, taxGSTPayable, subTotal /*amt*/ }];
    };

    // useEffect(() => {
    //     calculateTotals(selectedItems);
    // }, [
    //     selectedItems,
    //     lessDisc,
    //     lessOther,
    //     packFrwrd,
    //     trnsprtcharges,
    // ]);
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

    // useEffect(() => {
    //     var cgstAmount = (Number(amtGSTPayble) * Number(cgstPercent)) / 100;
    //     setCGST(cgstAmount);

    //     var sgstAmount = (Number(amtGSTPayble) * Number(sgstPercent)) / 100;
    //     setSGST(sgstAmount);

    //     var igstAmount =
    //         add3.toUpperCase() !== "KARNATAKA" && add4.toUpperCase() === "INDIA"
    //             ? (Number(amtGSTPayble) * Number(igstPercent)) / 100
    //             : 0;
    //     setIGST(igstAmount);

    //     var utgstAmount =
    //         add4.toUpperCase() !== "INDIA"
    //             ? (Number(amtGSTPayble) * Number(utgstPercent)) / 100
    //             : 0;
    //     setUTGST(utgstAmount);

    //     var allGstToTAL =
    //         Number(amtGSTPayble) +
    //         Number(cgstAmount) +
    //         Number(sgstAmount) +
    //         Number(igstAmount) +
    //         Number(utgstAmount);

    //     setTotlGST(Math.floor(allGstToTAL));

    //     var tcsAmount = (allGstToTAL * tcs) / 100;
    //     var allTotalValues =
    //         Number(allGstToTAL) +
    //         Number(tcsAmount) +
    //         Number(surChrgesTCS) +
    //         Number(cessOnTcs);

    //     setTotlValues(allTotalValues);

    //     let difference = Math.round(allTotalValues) - allTotalValues;
    //     setRoundOff(difference);

    //     const invValue = Number(allTotalValues) + Number(difference);
    //     setInvValue(invValue);

    // }, [
    //     cgstPercent,
    //     sgstPercent,
    //     igstPercent,
    //     utgstPercent,
    //     amtGSTPayble,
    //     tcs,
    //     surChrgesTCS,
    //     cessOnTcs,
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

        console.log("IGST Calculation Debug =>", { add3, add4, amtGSTPayble, igstPercent, igstAmount });

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
        setSelectedItems([]);
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
        // calculateTotals(updatedItems);
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
        console.log("mergeSelectedAndPendingmergeSelectedAndPendingmergeSelectedAndPending", mergeSelectedAndPending)
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
    }

    const handleCloseReason = () => {
        setOpen(false);
    };

    // HANDLE FORWARD REVERSE HANDLER
    const handleForwardReverse = (type, id) => {
        GstInvoicePreview({ type: type, id: id }, handleActionSuccess, handleActionException)
    }

    // const handleActionSuccess = (dataObject) => {
    //     setIsPoView(true)
    //     const data = dataObject.data.invoice;
    //     console.log("data.data.data.data.data", data?.invValue)
    //     setInvCode(data?.invCode);
    //     setInvType(data?.type);
    //     setSelectedDate(data?.date)
    //     setInvAutoCode(data?.invSt);
    //     setSelectedCustomerName(data?.cName || "");
    //     setAutoCode(data?.invNo || "");
    //     setBillingAddress(data?.billAdd || "");
    //     setInvIssueDate(data?.invoIssuDate || "");
    //     setDcNo(data?.dcNO || "");
    //     setDcDate(data?.dcDate || "");
    //     setModeOfDispach(data?.modelOfDis || "");
    //     setVechicleNo(data?.vechileNO || "");
    //     setCustPoNo(data?.custPoNo || "");
    //     setConsignee(data?.Consignee || "");
    //     setAdd1(data?.add1 || "");
    //     setAdd2(data?.add2 || "");
    //     setAdd3(data?.add3 || "");
    //     setAdd4(data?.add4 || "");
    //     setGstNo(data?.gstNo || "");
    //     setPanNo(data?.panNo || "");
    //     setTransactionType(data?.trType || "");
    //     setModeOfType(data?.modeOfType || "");
    //     setTransportDate(data?.traDate || "");
    //     setTransporterMst(data?.transporter || "");
    //     setTransporterGSTIN(data?.TransporterGSTIN || "");
    //     setDistanceKMS(data?.distKms || "");
    //     setShippingPincode(data?.shipPincode || "");
    //     setToStatecode(data?.stateCode || "");
    //     setGoodsOrService(data?.goodsOrService || "");
    //     setLabourCharge(data?.labourCharge || "");
    //     setLabourHeadingRequired(data?.labourCrgesHdingReqed || "");
    //     setReverseCharge(data?.reverseCharge || "");
    //     setSupplyTypeCode(data?.supplyTypeCode || "");
    //     setDispatchFrom(data?.dispatchFrom || "");
    //     setTotQty(data?.totalQty || "");
    //     setTaxGsTPayable(data?.taxableValueforGST || "");
    //     setLessDisc(data?.lessDisc || "");
    //     setLessOther(data?.lessOther || "");
    //     setSubTotal(data?.subTotAfterDisc || "");
    //     setPackFrwrd(data?.packingForw || "");
    //     setTrnsprtCharges(data?.transportCharges || "");
    //     setSubTotl(data?.subtotal || "");
    //     setInsurane(data?.Insurance || "");
    //     setCustmrMeterlValue(data?.custMeterialValue || "");
    //     setAmmortisanCost(data?.AmmortisationCost || "");
    //     setAmtGSTPayble(data?.amtOfGstPay || "");
    //     setCGST(data?.CGST || "");
    //     setSGST(data?.SGST || "");
    //     setIGST(data?.IGST || "");
    //     setUTGST(data?.UTGST || "");
    //     setTotlGST(data?.totGst || "");
    //     setTCS(data?.tcs || "");
    //     setSurChrgesTCS(data?.subChargeOnTcs || "");
    //     setTotlValues(data?.totalValue || "");
    //     setRoundOff(data?.roundOff || "");
    //     setInvValue(data?.invValue || "");
    //     setSelectedItems(dataObject?.data?.items || []);
    //     setMainId(data?.id || '');
    // }
    const handleActionSuccess = (dataObject) => {
        setIsPoView(true)
        const data = dataObject.data.invoice;
        setInvCode(data?.invCode);
        const rawDate = data?.date || ''; // Example: "28-02-2025"
        const formattedDate = rawDate ? convertToISO(rawDate) : '';
        setSelectedDate(formattedDate);
        setState(data?.state);
        setCountry(data?.country);
        // setEinvoiceGen(data?.invoiceGen);
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

    const handleClearPage = () => {
        setIsPoView(false)
        setIsEdit(false)
        setMainId('')
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
        setSelectedItems([]);
        setPartNoLabel("");
        setPendingPOList([{ id: "RDL1" }]);
        setSelectedDate(new Date());
        setCgstPercent("");
        setSgstPercent("");
        setIgstPercent("");
        setUtgstPercent("");
        setInvValue("");
    }

    const ExportGstInvoiceSuccess = () => { };

    const ExportGstInvoiceException = () => { };

    // const handlePrintClick = (value) => {
    //     if (value === 'Y') {
    //         return <LabourChargeInvoice rowData={mainId} />;
    //     } else {
    //         return <GstTaxInvoice rowData={mainId} />;
    //     }
    // }

    const handlePOChange = (e) => {
        GetGenerateGSTSaleInvoice({ type: 'gstInvoice', code: e.target.value }, handleGeneratedPoSucessShow, handleGeneratedPoExceptionShow);
    }

    const handleGeneratedPoSucessShow = (dataObject) => {
        setGeneratedGstInvoiceLists(dataObject?.data || []);
    }

    const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => {
    }

    const handleGeneratedPoSelect = (selectedValue) => {
        setIsPoView(true)
        if (selectedValue !== null) {
            setGeneratedGstInvoiceNo(selectedValue.no);
            setGstInvoiceId(selectedValue.id || '');
            CancelInvoiceViewing({ id: selectedValue.id }, handleActionSuccess, handleActionException);
        }
    }

    //CENCEL INVOICE CUSTOM MODAL
    const handleCustomeSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        // setRefreshData((oldvalue) => !oldvalue);
        setCustomeOpen(false);
        handleClearPage();
        setTimeout(() => {
            handleClose();
            // setNewUserModalOpen(false);
        }, 3000);
    }

    const handleCustomeFailure = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    }

    // PRINT INVOICE
    const handleCancelInvoice = () => {
        CancelInvoiceViewing({ id: mainId }, handlePdfInvSucess, handePdfInvException)
    }

    const handlePdfInvSucess = (dataObject) => {
        handleFileSave(dataObject?.data || []);
    }

    const handePdfInvException = (errorStatus, errorMessage) => {
        console.log(errorMessage);
    }

    const handleFileSave = (data) => {
        setPdfModalOpen(true)
        let info = []
        data.items.forEach((element, index, array) => {
            info.push([element.index, `${element.partNo} ${element.partName}`, element.hsnCode, element.descOfPackage, element.invQty, element.uom, element.invRate, element.invAmt])
        });
        const doc = new jsPDF();
        const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
        // const logoUrl = (await import('../../AllImage/RDL_Logo.png')).default;
        // const logoUrl = `${baseUrl}/${data.invoice.companyImage}`
        const ISOUrl = require('../../../AllImage/ISOlogo.png');

        const tableOptions = {
            didDrawPage: (HookData) => {
                if (HookData.pageNumber === 1) {
                    // Add an image on the first page L,Top/bottom, widht,height
                    // doc.addImage(logoUrl, 'PNG', 26, 18, 28, 20);
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
                    content: 'CANCEL INVOICE',
                    colSpan: 8,
                    styles: { halign: 'center', fontSize: 10, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold', fillColor: '#CCCCCC' }
                },
            ],
            [
                {
                    content: {
                        // image: logoUrl,
                        width: 30, // adjust the width as needed
                        height: 30, // adjust the height as needed
                    },
                    colSpan: 2
                },
                {
                    content: `${data.invoice.companyName}\n${data.invoice.companyAdd}. Tel:${data.invoice.telNo}\nWeb Site :${data.invoice.website}\nEmail : ${data.invoice.email}`,
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
                content: `CIN No: ${data.invoice.cmpCinNo}`,
                colSpan: 2,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: `PAN No:${data.invoice.cmpPanNo}`,
                colSpan: 2,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: `GSTINO:${data.invoice.cmpGstNo}`,
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
                    content: `Dispatch From:\n${data.invoice.dispatchFromAdd}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },

                {
                    content: `IRN:96a44fa78c60ee8b7a3ea5c600459a378655b2223bb631cbfa5f6ff03dd2dd21\nACK NO:${data.invoice.ackNo}\nACK Date:${data.invoice.ackDate}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    // content: 'Bill To:\nOTIS Elevator Company (India) ltd\nNO. 92, KIADB INDL. ESTATE,\nPHASE II, JIGANI INDL. AREA,\nANEKAL TALUK\nBangalore 560105 Karnataka\nPAN No.:AAACO0481E\nGSTIN No:29AAACO0481E2ZM',
                    content: `Bill To:\n${data.invoice.billAdd}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: 'Ship To :\nOTIS Elevator Company (India) ltd\nNO. 92, KIADB INDL. ESTATE,\nPHASE II, JIGANI INDL. AREA,\nANEKAL TALUK\nBangalore 560105 Karnataka\nPAN No.:AAACO0481E\nGSTIN No:29AAACO0481E2ZM',
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: `Place of Supply & State : ${data.invoice.add1} ${data.invoice.add3}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: `State Code : ${data.invoice.stateCode}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ]
        ];

        //Header4
        const firstHeaderRow = [
            [
                {
                    content: `INVOICE NO: ${data.invoice.invNo}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `PO NO:${data.invoice.invNo}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `DC NO : ${data.invoice.dcNO}`,
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `Terms of Payment :${data.invoice.dcNO}`,
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                }
            ],
            [
                {
                    content: `Date: ${data.invoice.date}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'Date: ',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'Date:',
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `Vehicle No: ${data.invoice.vechileNO}`,
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                }
            ],
        ];

        //Columns
        const secondHeaderRow = [['SI No', 'Description & Specification of Goods', 'HSN/SAC Code', 'No.&Desc of Pckgs', 'Total Qty of Goods (Net)', 'UOM', 'Rate / Unit', 'Value Of Goods']];

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
                    content: `${data.invoice.totalQty}`,
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
                    content: `${data.invoice.taxableValueforGST}`,
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
                    content: `${data.invoice.CGST}`,
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
                    content: `${data.invoice.SGST}`,
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
                    content: `${data.invoice.totalValue}`,
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
                    content: `${data.invoice.roundOff}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },

            ],
            [
                {
                    content: `Grand Total In Words: ${data.invoice.totalInWords}`,
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'Grand Total',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `${data.invoice.invValue}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },
            ],
        ];

        //Header6
        const totalWords = [
            [
                {
                    content: `Date of Issue of Invoice : ${data.invoice.invoIssuDate}`,
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: 'Name of Commodities : LABOUR CHARGES',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8 }
                },

            ],
            [
                {
                    content: `Mode of Dispatch: ${data.invoice.modelOfDis}`,
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: 'Whether tax payable of Reverse Charge basis: NO',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8 }
                },

            ],
            [
                {
                    content: 'Remarks:',
                    colSpan: 8,
                    styles: { halign: 'left', fontSize: 8 }
                },

            ],
            [
                {
                    content: 'DC Details:',
                    colSpan: 8,
                    styles: { halign: 'left', fontSize: 8 }
                },

            ],
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

        //Header7
        // const termsAndSuppluColumn = [
        //     [
        //         {
        //             content: `Receiver's Signature`,
        //             colSpan: 2,
        //             styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom' }
        //         },
        //         {
        //             content: 'Prepared By ',
        //             colSpan: 2,
        //             styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom' }
        //         },
        //         {
        //             content: 'Reviewed By',
        //             colSpan: 2,
        //             styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom' }
        //         },
        //         {
        //             content: 'For RDL Technologies Pvt Ltd.\nSignature Not Verified.\nDigitally Signed By: \nDate: 11/03/2024\nAuthorized Signatory',
        //             colSpan: 4,
        //             // rowSpan:6,
        //             styles: { halign: 'left', fontSize: 8, textColor: 'black' }
        //         }
        //     ],
        // ]

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

        const bodyRows = [...info, ...totalRow, ...totalWords,]
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
            // startY: 0,
            // pageBreak: 'avoid',
            // rowPageBreak: 'avoid',
            // tableWidth: 'auto',
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
                        {isCancelInvoiceView == 'true' ?
                            <Link to='/CancelInvoiceAuthorization' style={{ textDecoration: 'none' }}>
                                <Typography
                                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                                    variant="h5"
                                >
                                    {`Authorise Cancel Invoice>>`}
                                </Typography>
                            </Link>
                            :
                            ""
                        }
                        <Typography
                            sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
                            variant="h5"
                        >
                            Cancel GST Sales Invoice
                        </Typography>
                    </div>
                    <div style={{ width: '250px', marginRight: '10px' }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={generatedGstInvoiceLists}
                            fullWidth
                            // value={selectedGeneratedPo}
                            getOptionLabel={(option) => option.no /*|| selectedGeneratedPo*/}
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
                      <MenuItem value="Scrap">Scrap</MenuItem>
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
                                            <MenuItem value="Store">Store</MenuItem>
                                            <MenuItem value="Scrap">Scrap</MenuItem>
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
                                <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
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
                                <Grid item xs={12} sm={12} md={9.5} lg={9.5} xl={9.5}>
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
                                <Grid item xs={12} sm={2.5} md={2.5} lg={2.5} xl={2.5}>
                                    {/* {!isPOView && (
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
                                    )} */}
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ float: "right" }}>
                                        {/* {!isPOView && (
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
                                        )} */}
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
                                        onChange={handleBillingTextFieldChange}
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
                                        {/* {!isPOView && (
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
                                        )} */}
                                    </Grid>
                                    <TextField
                                        fullWidth
                                        id="outlined-multiline-static"
                                        label="Shipping Address"
                                        multiline
                                        rows={3}
                                        disabled={isPOView ? true : false}
                                        value={shippingAddress}
                                        onChange={handleShippingTextFieldChange}
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
                                                    <th
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
                                                        GST NO
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
                                                        Pan NO
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
                                                                                    onChange={(e) =>
                                                                                        onTransporterMstChange(e)
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
                                                                                onChange={(e) =>
                                                                                    setTransporterGSTIN(e.target.value)
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
                                                                                disabled={isPOView ? true : false}
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



                                                                <CardContent>
                                                                    {/* <Grid container spacing={1.5}>
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
                                                                                required
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
                                                                            xs={6}
                                                                            sm={6}
                                                                            md={6}
                                                                            lg={6}
                                                                            xl={6}
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
                                                                                label="Tcs"
                                                                                placeholder="Tcs"
                                                                                disabled={isPOView ? true : false}
                                                                                value={tcs}
                                                                                onChange={(e) =>
                                                                                    setTCS(e.target.value)
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
                                                                    </Grid> */}
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
                                                                        {cgstPercent > 0 ? (
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
                                                                        {igstPercent > 0 ? (
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
                                                                        {utgstPercent > 0 ? (
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
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "15px" }}>
                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", columnGap: "10px", rowGap: "10px", }}>
                                            {/* <Button
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
                                            </Button> */}
                                            {/* <Button
                                                variant="contained"
                                                style={{
                                                    width: "100%",
                                                    background: "#002D68",
                                                    color: "white",
                                                    height: "35px",
                                                }}
                                                onClick={() => {
                                                    setIsPoView(false)
                                                    setIsEdit(true)
                                                }}
                                            >
                                                Edit
                                            </Button> */}
                                            {/* <Button
                                                variant="contained"
                                                style={{
                                                    width: "100%",
                                                    background: "#002D68",
                                                    color: "white",
                                                    height: "35px",
                                                }}
                                            >
                                                Delete
                                            </Button> */}
                                            {/* <Button
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
                                            </Button> */}
                                            <Button
                                                variant="contained"
                                                style={getHighlightStyle("Clear", {
                                                    width: "100%",
                                                    backgroundColor: isModuleLocked ? "grey" : "#002D68",
                                                    height: "35px",
                                                })}
                                                onClick={() => {
                                                    setActiveButton("Clear"); // 🔵 highlight
                                                    handleClearPage();       // ✅ existing logic
                                                }}
                                                disabled={isModuleLocked}
                                            >
                                                Clear
                                            </Button>

                                            {/* <Button
                                                variant="contained"
                                                style={{
                                                    width: "100%",
                                                    background: selectedItems.length > 0 ? "#002D68" : "gray",
                                                    color: selectedItems.length > 0 ? "white" : "black",
                                                    height: "35px",
                                                }}
                                                disabled={selectedItems.length === 0}
                                                onClick={handleCancelInvoice}
                                            >
                                                Print
                                            </Button> */}
                                            <Button
                                                variant="contained"
                                                disabled={selectedItems.length === 0 || isModuleLocked}
                                                style={getHighlightStyle(
                                                    "Print",
                                                    {
                                                        width: "100%",
                                                        backgroundColor: isModuleLocked ? "grey" : "#002D68",
                                                        height: "35px",
                                                    },
                                                    selectedItems.length === 0
                                                )}
                                                onClick={() => {
                                                    setActiveButton("Print"); // 🔵 highlight
                                                    handleCancelInvoice();   // ✅ existing logic
                                                }}
                                            >
                                                Print
                                            </Button>


                                            {/* <Button
                                                variant="contained"
                                                style={{
                                                    width: "100%",
                                                    background: "#002D68",
                                                    color: "white",
                                                    height: "35px",
                                                }}
                                                onClick={() => {
                                                    ExportGstInvoice({ id: mainId },
                                                        ExportGstInvoiceSuccess,
                                                        ExportGstInvoiceException
                                                    );
                                                }}
                                            >
                                                <FileDownloadIcon />
                                            </Button> */}
                                            {/* <Button
                                                    variant="contained"
                                                    style={{
                                                        width: "100%",
                                                        background: isPOView || isEdit ? "#002D68" : "gray",
                                                        color: isPOView || isEdit ? "white" : "#000000",
                                                        height: "35px",
                                                    }}
                                                    onClick={() => handlePrintClick(labourCharge)}
                                                >
                                                    {labourCharge === 'Y' ?
                                                        <LabourChargeInvoice rowData={mainId} />
                                                        :
                                                        <GstTaxInvoice rowData={mainId} />
                                                    }
                                                </Button> */}

                                            {/* <Button
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
                                            </Button> */}
                                            {/* <Button
                          variant="contained"
                          style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                      >
                          <SearchIcon />
                      </Button> */}
                                            {/* <Button
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
                                            </Button> */}
                                        </div>
                                        <div style={{ display: "flex", gap: "5px" }}>
                                            {/* <Button
                                                variant="contained"
                                                type="button"
                                                style={{
                                                    height: "35px",
                                                    backgroundColor: "#002d68",
                                                }}
                                                onClick={handleViewClick}
                                            >
                                                VIEW
                                            </Button>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                style={{
                                                    height: "35px",
                                                    backgroundColor: "#002d68",
                                                }}
                                            >
                                                {isEdit ? "UPDATE" : "SAVE"}
                                            </Button> */}
                                            {/* {isCancelInvoiceView == 'true' ?
                                                ""
                                                :
                                                <Button
                                                    variant="contained"
                                                    type="button"
                                                    style={{
                                                        height: "35px",
                                                        backgroundColor: "#002d68",
                                                    }}
                                                    onClick={() => setCustomeOpen(true)}
                                                >
                                                    Cancel Invoice
                                                </Button>
                                            } */}
                                            {isCancelInvoiceView === "true" ? (
                                                ""
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    type="button"
                                                    style={getHighlightStyle("CancelInvoice", {
                                                        height: "35px",
                                                        backgroundColor: isModuleLocked ? "grey" : "#002d68",
                                                    })}
                                                    onClick={() => {
                                                        setActiveButton("CancelInvoice"); // 🔵 highlight
                                                        setCustomeOpen(true);             // ✅ existing logic
                                                    }}
                                                    disabled={isModuleLocked}
                                                >
                                                    Cancel Invoice
                                                </Button>
                                            )}

                                        </div>

                                    </div>
                                    <table id="customers">
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
                                                {/* <th>Action</th> */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingPOList.length > 1
                                                ? pendingPOList.map((item, index) => (
                                                    <tr key={index}>
                                                        <td contentEditable={false} onBlur={handleEdit1}>
                                                            {item.itemCode}
                                                        </td>
                                                        <td contentEditable={false}>
                                                            {item.itemName}
                                                        </td>
                                                        <td contentEditable={false}>
                                                            {item.uom}
                                                        </td>
                                                        <td contentEditable={false}>
                                                            {item.soNo}
                                                        </td>
                                                        <td contentEditable={false}>
                                                            {item.poNo}
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
                                                            contentEditable={false}
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
                                                        <td contentEditable={false}>
                                                            {item.descOfPackage}
                                                        </td>
                                                        {/* <td
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
                                                        </td> */}
                                                    </tr>
                                                ))
                                                : selectedItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td contentEditable={false} onBlur={handleEdit}>
                                                            {item.itemCode}
                                                        </td>
                                                        <td contentEditable={false}>
                                                            {item.itemName}
                                                        </td>
                                                        <td contentEditable={false}>
                                                            {item.uom}
                                                        </td>
                                                        <td contentEditable={false}>
                                                            {item.soNo}
                                                        </td>
                                                        <td contentEditable={false}>
                                                            {item.poNo}
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
                                                            contentEditable={false}
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
                                                        <td contentEditable={false}>
                                                            {item.descOfPackage}
                                                        </td>
                                                        {/* <td
                                                            contentEditable={!isPOView ? true : false}
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
                                                        </td> */}
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
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

                {/* <DCGstSelectionModel
                        dcSelectionModalOpen={dcSelectionModalOpen}
                        setDcSelectionModalOpen={setDcSelectionModalOpen}
                        setPendingPOList={setPendingPOList}
                        setCustAddress={setCustAddress}
                        customerSid={customerSid}
                        partNo={partNo}
                        selectedItems={selectedItems}
                    /> */}
                {/* <ChangeAddress
                        changeAddressModalOpen={changeAddressModalOpen}
                        setChangeAddressModalOpen={setChangeAddressModalOpen}
                        setCustAddress={setCustAddress}
                        customerSid={customerSid}
                        setAdd1={setAdd1}
                        setBillingAddress={setBillingAddress}
                    /> */}

                {/* <LoadPendingPO
                        loadPendingModalOpen={loadPendingModalOpen}
                        setLoadPendingModalOpen={setLoadPendingModalOpen}
                        setPendingPOList={setPendingPOList}
                        pendingPOList={pendingPOList}
                        setCustAddress={setCustAddress}
                        customerId={cId}
                    /> */}

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

export default CancelInvoice;
