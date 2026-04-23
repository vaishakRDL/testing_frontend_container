import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
    LinearProgress, Popper,
    CircularProgress,
    IconButton
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { CheckBox } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from '@mui/material/Autocomplete';
import {
    GetPurchaseBillSuppList,
    GetPurchaseBillSuppListItemList,
    PurchaseBillFormSubmit,
    getPurchaseBillDetails,
    GetPOBillUniqueID,
    genarateGrnNumber,
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
    GetMaterialDocNumber,
    MaterialIssuePreview,
    AutoMaterialIssueSubmit,
    searchMaterialIssue
} from '../../ApiService/LoginPageService'
import '../../App.css';
import { Link, useLocation } from 'react-router-dom';
import { PurchaseBillAgaintsPOTemplate } from '../../ApiService/DownloadCsvReportsService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ApplicationStore from '../../Utility/localStorageUtil';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import { type } from '@testing-library/user-event/dist/type';
import LoadPendingPO from '../PurchaseBillAgainstPO/LoadPendingPO/LoadPendingPO';
import LoadIssueParts from './LoadIssueParts';
import RefreshIcon from "@mui/icons-material/Refresh";
import { useModuleLocks } from '../context/ModuleLockContext';


const NewMaterialIsseResult = ({
    open, setOpen, isAddButton, editeData, setRefreshData,
}) => {

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Material Issue")?.lockStatus === "locked";


    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter(
        (data) => data?.menu?.toLowerCase() === "MaterialIssue".toLowerCase()
    );
    console.log("PurchaseOrderEntryPurchaseOrderEntry", userPermission)

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [rowId, setRowId] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [suppplierList, setSupplierList] = useState([]);
    const [digit, setDigit] = useState('');
    const [getPoNumber, setGetPoNumber] = useState('');
    const [poType, setPoType] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [supplierId, setSupplierId] = useState('');
    const [supplierIdCopy, setSupplierIdCopy] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [billingAddressCopy, setBillingAddressCopy] = useState('');
    const [grnRefNo, setGrnRefNo] = useState('');
    const [supplierInvoiceNo, setSupplierInvoiceNo] = useState('');
    const [supplierInvoiceNoCopy, setSupplierInvoiceNoCopy] = useState('');
    const [supplierInvoiceDate, setSupplierInvoiceDate] = useState('');
    const [supplierInvoiceDateCopy, setSupplierInvoiceDateCopy] = useState('');
    const [cSupplierDcNo, setCSupplierDcNumber] = useState('');
    const [cSupplierDcNoCopy, setCSupplierDcNumberCopy] = useState('');
    const [supplierDcDate, setSupplierDcDate] = useState('');
    const [supplierDcDateCopy, setSupplierDcDateCopy] = useState('');
    const [irNo, setIrNo] = useState('');
    const [carNo, setCarNo] = useState('');
    const [binNo, setBinNo] = useState('');
    const [exgRate, setExgRate] = useState(1);
    const [currency, setCurrency] = useState('');
    const [currencyId, setCurrencyId] = useState('');
    const [gstType, setGstType] = useState('CGST/SGST');
    const [remarks, setRemarks] = useState('');
    const [qcAuthorise, setQcAuthorise] = useState('');
    const [qcAuthoriseBy, setQcAuthoriseBy] = useState('');
    const [qcAuthoriseDate, setQcAuthoriseDate] = useState('');
    const [qcRemarks, setQcRemarks] = useState('');
    const [totalQty, setTotalQty] = useState('');
    const [grossAmount, setGrossAmount] = useState('');
    const [lessDiscount, setLessDiscount] = useState('');
    const [transport, setTransport] = useState('');
    const [coolie, setCoolie] = useState('');
    const [subTotal, setSubTotal] = useState('');
    const [supplierItemList, setSupplierItemList] = useState([])
    const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
    const [pendingPOModalOpen, setPendingPOModalOpen] = useState(false);
    const [supplierSid, setSupplierSid] = useState('');
    const [supplierSelect, setSupplierSelect] = useState('');
    const [supplierSelectCopy, setSupplierSelectCopy] = useState('');
    const [cgst, setCGST] = useState('');
    const [cgstPercent, setCGSTPercent] = useState('');
    const [sgst, setSGST] = useState('');
    const [sgstPercent, setSGSTPercent] = useState('');
    const [igst, setIGST] = useState('');
    const [igstPercent, setIGSTPercent] = useState('');
    const [utgst, setUTGST] = useState('');
    const [utgstPercent, setUTGSTPercent] = useState('');
    const [total, setTotal] = useState('');
    const [tds, setTDS] = useState('');
    const [tdsPercent, setTDSPercent] = useState('');
    const [tcs, setTCS] = useState('');
    const [tcsPercent, setTCSPercent] = useState('');
    const [others, setOthers] = useState('');
    const [grandTotal, setGrandTotal] = useState('');
    const [poSupplierData, setPoSupplierData] = useState([])
    const [fileUploadOpen, setFileUploadOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [supplierSate, setSupplierState] = useState('');
    const [supplierCountry, setSupplierCountry] = useState('');
    console.log("selectedFile", selectedFile);
    const [jobWorkReceipt, setJobWorkReceipt] = useState(false);
    const [jobWorkReceiptModal, setJobWorkReceiptModal] = useState(false);
    //FOR INTERNATIONAL
    const [boeNo, setBOENo] = useState('');
    const [boeDate, setBOEDate] = useState('');
    const [packingListNo, setPackingListNo] = useState('');
    const [packingDate, setPackingDate] = useState('');
    const [grossAmountINR, setGrossAmountINR] = useState('');
    const [miscCharges, setMiscCharges] = useState('');
    const [subTotalGrsAndMisc, setSubTotalGrsAndMisc] = useState('');
    const [insurance, setInsurance] = useState('');
    const [freight, setFreight] = useState('');
    const [subTotalINSAndFreight, setSubTotalINSAndFreight] = useState('');
    const [bcd, setBCD] = useState('');
    const [socialWelfareCharges, setSocialWelfareCharges] = useState('');
    const [subTotalSwAndBCD, setSubTotalSWAndBCD] = useState('');
    const [importGST, setImportGST] = useState('');
    const [importGSTPercent, setImportGSTPercent] = useState('');
    const [totalWithGST, setTotalWithGST] = useState('');
    const [freightCharges, setFreightCharges] = useState('');
    const [localClearanceCharges, setLocalClearanceCharges] = useState('');
    const [uploadLoader, setUploadLoader] = useState(false);
    const [pruchaseOrderDigit, setPurchaseOrderDigit] = useState('');
    const [genPoBillFlag, setGenPoBillFlag] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [invoiceData, setInvoiceData] = useState([]);
    const [lotEntryModalOpen, setLotEntryModalOpen] = useState(false);
    const [cellData, setCellData] = useState('');
    const [rowData, setRowData] = useState([]);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [previewQcFlag, setPreviewQcFlag] = useState(0)
    const [selectedGeneratedPo, setSelectedGeneratedPo] = useState('');
    const [generatedPoLists, setGeneratedPoLists] = useState([]);
    const [transportCode, setTransportCode] = useState(null);
    const [loading, setLoading] = useState(false);
    /////////////////////////////////////////////////////////////////////////NEW STATES\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    const [docNumber, setDocNumber] = useState({ digtit: '', uniqueNo: '' });
    const [issuedBy, setIssuedBy] = useState("");
    const [isForwardReverse, setIsForwardReverse] = useState(false);
    const [searchedIssueNo, setSearchedIssueNo] = useState('')
    /////////////////////////////////////////////////////////////////////////NEW STATES\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    // FORWARD REVERSE
    const [mainId, setMainId] = useState('');
    const [viewMoreModal, setViewMoreModal] = useState(false);

    const location = useLocation();
    const selectName = new URLSearchParams(location.search).get('selectName');
    const selectId = new URLSearchParams(location.search).get('selectId');
    const selectPotype = new URLSearchParams(location.search).get('selectPotype');
    const selectdigit = new URLSearchParams(location.search).get('selectdigit');
    const selectPo = new URLSearchParams(location.search).get('selectPo');
    const selectspAddress = new URLSearchParams(location.search).get('selectspAddress');
    const selectsupId = new URLSearchParams(location.search).get('selectsupId');

    // PURCHASE BILL PREVIEW
    const isPOBillView = new URLSearchParams(location.search).get('isPOBillView');
    const poBillDigit = new URLSearchParams(location.search).get('poBillDigit');

    // PURCHASE ORDER GENERATE
    const isGenPOBill = new URLSearchParams(location.search).get('isGenPOBill');
    const selectedSuppName = new URLSearchParams(location.search).get('selectedSuppName');
    const selectedPodigit = new URLSearchParams(location.search).get('selectedPodigit');
    const selectedSpAddress = new URLSearchParams(location.search).get('selectedSpAddress');
    const selectedsupId = new URLSearchParams(location.search).get('selectedsupId');
    const selectedCurrency = new URLSearchParams(location.search).get('selectedCurrency');
    const selectedCurrencyId = new URLSearchParams(location.search).get('selectedCurrencyId');

    // AGAINST PO ROUTE DATA 
    // const isView = new URLSearchParams(location.search).get('isView');
    const PBNo = new URLSearchParams(location.search).get('PBNo');
    const qcApproval = new URLSearchParams(location.search).get('qcApproval');
    const isQcApprovalFlag = new URLSearchParams(location.search).get('isQcApprovalFlag');
    const isType = new URLSearchParams(location.search).get('isType');

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
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        handleForwardReverse('last', '');
    }, [editeData, isGenPOBill, selectedPodigit, isType]);

    //FORM SUBMIT FUNCTION
    const handleSubmit = (e) => {
        e.preventDefault();
        const payloadData = {
            docNo: docNumber?.digtit,
            issueNo: docNumber?.uniqueNo,
            issuedDate: selectedDate,
            items: selectedItems
        }

        if (isEdit) {
        } else {
            setLoading(true);
            AutoMaterialIssueSubmit(payloadData, handleSuccess, handleException);
        }
    };

    // ADD
    const handleSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        poType === 'J' && setJobWorkReceiptModal(true);
        setTimeout(() => {
            handleClearPage();
            handleClose();
            setLoading(false);
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        console.log("the error ", errorMessage);
        setNotification({
            status: true,
            type: 'error',
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
        console.log("the dataObject ", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        poType === 'J' && setJobWorkReceiptModal(true);
        setTimeout(() => {
            handleClearPage();
            handleClose();
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
        }, 2000);
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleDeleteRow = (id) => {
        const newArray = selectedItems.filter((item) => item.id !== id)
        setSelectedItems(newArray);
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    handleDeleteRow(props.selectedRow.id)
                }}
                style={{ color: 'black' }}
            />
        );
    };

    //DATE CONVERT TO TEXTFIELD
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // HANDLE FORWARD REVERSE HANDLER
    const handleForwardReverse = (type, id) => {
        setIsForwardReverse(true)
        MaterialIssuePreview({ type: type, id: id }, handleActionSuccess, handleActionException)
    }

    // CONVERT DATE TO ISO FORMATE
    function convertToISO(dateStr) {
        // Split the "DD-MM-YYYY" format
        const [day, month, year] = dateStr.split('-');
        // Create a new Date object using "YYYY-MM-DD"
        const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
        return isoDate.toISOString(); // Convert to "YYYY-MM-DDTHH:mm:ss.SSSZ"
    }

    const handleActionSuccess = (dataObject) => {
        setIsView(true);
        const data = dataObject;
        const rawDate = data?.issueDetails?.issuedDate || ''; // Example: "28-02-2025"
        const formattedDate = rawDate ? convertToISO(rawDate) : '';
        setSelectedDate(formattedDate);
        setMainId(data?.issueDetails?.id || '');
        setIssuedBy(data?.issueDetails?.issuedBy || '')
        setDocNumber({ digtit: data?.issueDetails?.docNo, uniqueNo: data?.issueDetails?.issueNo } || { digtit: '', uniqueNo: '' })
        setSelectedItems(dataObject?.issueItems || []);
    }
    const handleActionException = () => { }

    const handleClearPage = () => {
        setIsView(false);
        setIsEdit(false);
        setIsForwardReverse(false);
        setSelectedDate(new Date());
        setMainId('');
        setSelectedItems([]);
        setSearchedIssueNo('');
        setIssuedBy(userDetails?.userName || "");
        GetMaterialDocNumber(documentNumberSucess, documentNumberException);
    }
    // setDocNumber
    const documentNumberSucess = (dataObject) => {
        setDocNumber({ digtit: dataObject?.digtit, uniqueNo: dataObject?.uniqueNo });
    }
    const documentNumberException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
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
            type: 'error',
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
                    data.id === id && cellNam === 'cumQty' ?
                        { ...data, cumQty: newValue }
                        : data
                )
                setSelectedItems(updatedCumQty);
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
                    if (data.id === id && cellNam === 'invQty') {
                        if (Number(newValue) > Number(rowData.pendingPo)) {
                            // alert('Invoice Quantity cannot be greater than Pending Quantity');
                            setNotification({
                                status: true,
                                type: 'error',
                                message: 'Invoice Quantity cannot be greater than Pending Quantity',
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
                    if (data.id === id && cellNam === 'rcvdQty') {
                        if (Number(newValue) > Number(rowData.invQty)) {
                            // alert('Received Quantity cannot be greater than Inventory Quantity');
                            setNotification({
                                status: true,
                                type: 'error',
                                message: 'Received Quantity cannot be greater than Inventory Quantity',
                            });
                            return {
                                ...data,
                                rcvdQty: rowData.rcvdQty,
                                accQty: rowData.accQty,
                                rejQty: rowData.rejQty,
                                itemRemarks: '', // Reset remarks if needed 
                                pbAmt: rowData.pbAmt
                            };
                        }
                        return {
                            ...data,
                            rcvdQty: newValue,
                            accQty: newValue,
                            rejQty: 0,
                            pbAmt: Number(newValue) * Number(rowData.pbRate),
                            itemRemarks: rowData.invQty - newValue === 0 ? '' : `Short Supply ${rowData.invQty - newValue}`,
                        };
                    }
                    return data;
                });
                setSelectedItems(updatedRcvdQty);
                break;
            case "accQty":
                const updatedAccQty = selectedItems.map((data) =>
                    data.id === id && cellNam === 'accQty' ?
                        {
                            ...data,
                            accQty: newValue,
                            rejQty: Number(rowData.rcvdQty) - Number(newValue),
                            pbAmt: Number(newValue) * Number(rowData.pbRate)
                        }
                        : data
                )
                setSelectedItems(updatedAccQty);
                break;
            case "rejQty":
                const updatedRejQty = selectedItems.map((data) => {
                    if (data.id === id && cellNam === 'rejQty') {
                        if (Number(newValue) > Number(rowData.rcvdQty)) {
                            // alert('Rejected Quantity cannot be greater than Received Quantity');
                            setNotification({
                                status: true,
                                type: 'error',
                                message: 'Rejected Quantity cannot be greater than Received Quantity',
                            });
                            return {
                                ...data,
                                accQty: 0,
                                rejQty: 0,
                                pbAmt: Number(rowData.pbAmt)
                            };
                        }
                        return {
                            ...data,
                            accQty: Number(rowData.rcvdQty) - Number(newValue),
                            rejQty: newValue,
                            // pbAmt: Number(rowData.accQty) * Number(rowData.pbRate)
                            // pbAmt: Number(rowData.pbAmt)
                            pbAmt: (Number(rowData.rcvdQty) - Number(newValue)) * Number(rowData.pbRate)
                        };
                    }
                    return data
                });
                setSelectedItems(updatedRejQty);
                break;
            case "hsnCode":
                const updatedHsnCode = selectedItems.map((data) =>
                    data.id === id && cellNam === 'hsnCode' ?
                        { ...data, hsnCode: newValue }
                        : data
                )
                setSelectedItems(updatedHsnCode);
                break;
            case "itemRemarks":
                const updatedItemRemarks = selectedItems.map((data) =>
                    data.id === id && cellNam === 'itemRemarks' ?
                        { ...data, itemRemarks: newValue }
                        : data
                )
                setSelectedItems(updatedItemRemarks);
                break;
            default:
            // code block
        }
    }

    //SEARCH BILL
    const handleSearchChange = (e) => {
        searchMaterialIssue({ code: e.target.value }, handleSearchSucessShow, handleSearchExceptionShow);
    }

    const handleSearchSucessShow = (dataObject) => {
        setGeneratedPoLists(dataObject?.data || []);
    }
    const handleSearchExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSearchListSelect = (selectedValue) => {
        setIsView(true)
        setSearchedIssueNo(selectedValue?.issueNo);
        handleForwardReverse('view', selectedValue?.id);
    }

    // UNIQUE CODE MANUAL CHANGE
    const handleUniqueCodeChange = (e) => {
        const newUniqueCode = e.target.value;
        const currentYear = docNumber?.uniqueNo?.split('/')[0];
        setDocNumber({ uniqueNo: `${currentYear}/${newUniqueCode.toString().padStart(5, 0)}`, digit: newUniqueCode });
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
                style={{ position: 'absolute', top: 'auto', bottom: '100%' }}
            />
        );
    };


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    {isEdit ? "Edit Material Issue" : isView ? "View Material Issue" : "New Material Issue"}
                    {/* {isModuleLocked && (
                        <Box sx={{
                            background: "#ffcccc",
                            padding: "10px",
                            margin: "10px 0",
                            borderRadius: "5px",
                            border: "1px solid red",
                            color: "#b30000",
                            fontWeight: "bold"
                        }}>
                            ❌ Material Issue is Locked. You cannot perform any transactions.
                        </Box>
                    )} */}

                </Typography>
            </div>
            <form onSubmit={handleSubmit}>
                <Grid container padding={1}>
                    <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Doc No"
                                    placeholder="Doc No"
                                    InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                    value={docNumber?.digtit}
                                    // onChange={(e) => setDigit(e.target.value)}
                                    onChange={handleUniqueCodeChange}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    disabled={isView || isQcApprovalFlag === 'true' ? true : false}
                                    inputProps={{ maxLength: 5 }} // Set max length to 5 characters
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <TextField
                                    fullWidth
                                    // disabled={true}
                                    label="Issued Date"
                                    placeholder="Issued Date"
                                    InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                    type='date'
                                    // readOnly={true}
                                    disabled={isView || isQcApprovalFlag === 'true' ? true : false}
                                    required
                                    value={formatDate(selectedDate)}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    max={getCurrentDate()} // Restrict dates greater than today
                                    inputProps={{
                                        max: getCurrentDate(), // Restrict dates greater than today
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Issue No"
                                    placeholder="Issue No"
                                    InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                    value={docNumber?.uniqueNo}
                                    // onChange={(e) => setGetPoNumber(e.target.value)}
                                    readOnly={true}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    disabled={isView || isQcApprovalFlag === 'true' ? true : false}
                                />

                                <Tooltip title="Refresh DocNumber">
                                    <span>
                                        {" "}
                                        {/* wrapper to avoid tooltip crash when button is disabled */}
                                        <IconButton
                                            disabled={
                                                isView || isQcApprovalFlag === "true" ? true : false
                                            }
                                            onClick={() => {
                                                if (docNumber) {
                                                    // setPoType(e.target.value)
                                                    GetMaterialDocNumber(documentNumberSucess, documentNumberException);
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

                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <TextField
                                    fullWidth
                                    required
                                    value={issuedBy}
                                    label="Issued By"
                                    placeholder="Issued By"
                                    InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    disabled={true}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <Button fullWidth variant="contained" style={{ marginTop: '3px', backgroundColor: isView ? "gray" : '#002D68', color: '#ffffff' }} disabled={isView ? true : false} onClick={() => setPendingPOModalOpen(true)}>Pending SRN</Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ fontSize: '75%' }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={generatedPoLists}
                            fullWidth
                            value={searchedIssueNo}
                            getOptionLabel={(option) => option.issueNo || searchedIssueNo}
                            renderInput={(params) => <TextField {...params} label="Search Issued Material" onChange={handleSearchChange} />}
                            onChange={(event, value) => handleSearchListSelect(value)}
                            size="small"
                            style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: screenHeight - 265, border: '1px solid #000000' }}>
                            <CardContent style={{ height: '100%', overflow: 'auto' }}>
                                {uploadLoader &&
                                    <Box sx={{ width: '100%', marginBottom: '15px' }}>
                                        <LinearProgress />
                                    </Box>
                                }
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    {isQcApprovalFlag === 'true' ?
                                        <div></div> :
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: '10px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', columnGap: '10px', rowGap: '10px' }}>
                                                <Button
                                                    variant="contained"
                                                    style={{
                                                        width: "100%",
                                                        height: '35px',
                                                        background:
                                                            userPermission[0]?.addData === 0 ? "gray" : isModuleLocked ? "gray" : "#002D68",
                                                        color:
                                                            userPermission[0]?.addData === 0 ? "black" : "white",
                                                    }}
                                                    // disabled={userPermission[0]?.addData === 0}
                                                    disabled={isModuleLocked || userPermission[0]?.addData === 0}
                                                    onClick={handleClearPage}
                                                >
                                                    New
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    style={{
                                                        width: "100%",
                                                        background: userPermission[0]?.deleteData === 0 ? "gray" : isModuleLocked ? "gray" : "#002D68",
                                                        color: "white",
                                                        height: '35px',
                                                    }}
                                                    onClick={() => setDeleteDailogOpen(true)}
                                                    disabled={isModuleLocked || userPermission[0]?.deleteData === 0 ? true : false}
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    style={{
                                                        width: "100%",
                                                        background: isModuleLocked ? "gray" : "#002D68",
                                                        color: "white",
                                                        height: '35px',
                                                    }}
                                                    onClick={handleClearPage}
                                                    disabled={isModuleLocked}
                                                >
                                                    Clear
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                                    onClick={() => handleForwardReverse('first', '')}
                                                >
                                                    <FastRewindIcon />
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                                    onClick={() => handleForwardReverse('reverse', mainId)}

                                                >
                                                    <SkipPreviousIcon />
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                                    onClick={() => handleForwardReverse('forward', mainId)}


                                                >
                                                    <SkipNextIcon />
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                                    onClick={() => handleForwardReverse('last', '')}
                                                >
                                                    <FastForwardIcon />
                                                </Button>
                                            </div>
                                        </div>
                                    }
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: isView || isEdit ? '600px' : '500px', flexWrap: 'wrap', rowGap: '10px', alignItems: 'center' }}>
                                        {
                                            !isView ? (
                                                <Button disabled={loading === true || isModuleLocked}
                                                    variant="contained" type='submit' style={{ height: '35px', backgroundColor: Number(transportCode) === 2 ? 'gray' : '#002D68' }}>
                                                    {/* {isEdit ? "UPDATE" : "Auto-Issue & Save"} */}
                                                    {loading ? (
                                                        <CircularProgress size={24} style={{ color: 'white' }} />
                                                    ) : "Auto-Issue & Save"}
                                                </Button>
                                            ) : (
                                                null
                                            )
                                        }
                                    </div>
                                </div>

                                <table id="transactionTable">
                                    <tr style={{ position: 'sticky', top: '-16px', backgroundColor: '#f9f9f9', zIndex: 1 }}>
                                        <th style={{ whiteSpace: 'nowrap' }}>S No</th>
                                        {isForwardReverse === false &&
                                            <>
                                                {/* <th style={{ whiteSpace: 'nowrap' }}>SRN No</th> */}
                                                <th style={{ whiteSpace: 'nowrap' }}>SRN Category</th>
                                                {/* <th style={{ whiteSpace: 'nowrap' }}>SRN Date</th> */}
                                            </>
                                        }
                                        <th style={{ whiteSpace: 'nowrap' }}>SRN No</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>SRN Date</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>SRN Requested By</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Part No</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Part Name</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>FIM</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Raw Material Name</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Available Stock</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>UOM</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>SRN Qty</th>

                                        {isForwardReverse === false &&
                                            <>
                                                <th style={{ whiteSpace: 'nowrap' }}>Total Qty Required</th>
                                            </>
                                        }
                                        <th style={{ whiteSpace: 'nowrap' }}>Issued Qty</th>

                                        <th style={{ whiteSpace: 'nowrap' }}>ShelfLifeItem</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>GRN</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Location</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Actions</th>
                                    </tr>
                                    {selectedItems.map((item, index) => {
                                        return (
                                            <tr key={index}>

                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.sNo}</td>
                                                {isForwardReverse === false &&
                                                    <>
                                                        {/* <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.srnNo}</td> */}
                                                        <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.category}</td>
                                                        {/* <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.srnDate}</td> */}
                                                    </>
                                                }
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} >{item.srnNo}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} >{item.srnDate}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.requestedBy}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} >{item.itemCode}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} >{item.itemName}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.fim}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.rawMaterialName}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} onBlur={(e) => handleEdit('cumQty', e.target.textContent, item.id, item)}>{item.totStk}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} >{item.uom}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} >{item.srnQty}</td>

                                                {isForwardReverse === false &&
                                                    <>
                                                        <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.reqQty}</td>
                                                    </>
                                                }
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} onBlur={(e) => handleEdit('rcvdQty', e.target.textContent, item.id, item)} >{item.issuedQty}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} onBlur={(e) => handleEdit('invQty', e.target.textContent, item.id, item)} >{item.shelfLifeItem}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} onBlur={(e) => handleEdit('invQty', e.target.textContent, item.id, item)} >{item.grn}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} onBlur={(e) => handleEdit('invQty', e.target.textContent, item.id, item)} >{item.location}</td>
                                                <td contentEditable={false} style={{ textAlign: 'center' }}>
                                                    {item.id === 'RDL1' ?
                                                        null
                                                        :
                                                        !isView ?
                                                            <DeleteIcon
                                                                onClick={() => {
                                                                    handleDeleteRow(item.id)
                                                                }}
                                                                style={{ color: 'black', cursor: 'pointer' }}
                                                            />
                                                            :
                                                            <DeleteIcon
                                                                style={{ color: 'gray', cursor: 'pointer' }}
                                                            />
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </table>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid >

            </form>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <LoadIssueParts
                pendingPOModalOpen={pendingPOModalOpen}
                setPendingPOModalOpen={setPendingPOModalOpen}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                handleClearPage={handleClearPage}
            />

        </div>
    )
}

export default NewMaterialIsseResult