import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment, setRef,
    LinearProgress, Popper,
    Menu,
    CircularProgress,
    IconButton,
    DialogContentText
} from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { CheckBox } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from '@mui/material/Autocomplete';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    AddStoreItemMaster,
    StoreItemEdit,
    GetMainLocation,
    GetSubLocation,
    GetProductFinish,
    GetProductFamily,
    GetHSNCode,
    GetUnderLedger,
    GetItemGroup,
    GetUOM,
    GetPOUniqueID,
    GetPOSupplierList,
    GetPOSupplierItemList,
    GeneratePO,
    ShowDepartment,
    POViewApprove,
    poApproval,
    GetBoiPurchaseItemList,
    PurchaseOrderXLUpload,
    EditGeneratedPO,
    GetFieldSuggetions,
    updatePoMaxLevel,
    GetPoItemLists,
    GetSuppVsItemAllSuppList,
    ChangeSupplierAfterEntry,
    GetGeneratedPo,
    PurchaseOrderPreview,
    GetPurchaseOrderInvoiceData,
    deleteGeneratedPO,
    UpdateAmendAndDeauth,
    deleteAmendment
    ,
    StoreTempSelection
} from '../../ApiService/LoginPageService'
import PurchaseOrderGenerationTitle from './PurchaseOrderGenerationTitle';
import CellClickModal from './CellClickModal/CellClickModal';
import ChangeAddressModal from './ChangeAddressModal/ChangeAddressModal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ApprovalConfirmation from '../AdminApproval/ApprovalConfirmation/ApprovalConfirmation';
import RejectConfirmation from '../AdminApproval/RejectConfirmation/RejectConfirmation';
import ApplicationStore from '../../Utility/localStorageUtil';
import { PurchaseOrderTemplate } from '../../ApiService/DownloadCsvReportsService';
import './PurchaseOrder.css';
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import LoadPendingJw from './LoadPendingJW/LoadPendingJw';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TuneIcon from '@mui/icons-material/Tune';
import { useModuleLocks } from '../context/ModuleLockContext';

const PurchaseOrderGenerationModule = ({
    open, setOpen, isAddButton, editeData, setRefreshData,
}) => {

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter(
        (data) => data?.menu?.toLowerCase() === "purchaseordergeneration"
    );

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Purchase Order Generation")?.lockStatus === "locked";

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const getHighlightStyle = (name, baseStyle = {}) => ({
        ...baseStyle,
        backgroundColor: isModuleLocked
            ? "gray"
            : activeButton === name
                ? "#0d6efd"   // 🔥 active highlight
                : baseStyle.backgroundColor || "#002D68",
        transition: "all 0.3s ease",
        color: "white",
    });

    const navigate = useNavigate();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteRowId, setDeleteRowId] = useState(null);
    // --- TEMP PO SAVE / RESTORE (add here with other states) ---
    const [openTempManager, setOpenTempManager] = useState(false);
    const [tempList, setTempList] = useState([]);

    const [searchTemp, setSearchTemp] = useState([]);
    const [activeButton, setActiveButton] = React.useState("");

    // Load temp saves once on mount


    //UPDATED STATE
    const [selectedPONo, setSelectedPONo] = useState('')
    const [uniqueCode, setUniqueCode] = useState('')
    const [uniqueCodeString, setUniqueCodeString] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [supplierList, setSupplierList] = useState([])
    const [supplierName, setSupplierName] = useState('')
    const [selectedItems, setSelectedItems] = useState([{ id: 'RDL1' }]);
    const [suppAddress, setSuppAddress] = useState('');
    const [buildAddress, setBuildAddress] = useState('');
    const [supplierItemList, setSupplierItemList] = useState([]);
    const [poType, setPOType] = useState('REGULAR');
    const [currency, setCurrency] = useState('');
    const [currencyCode, setCurrencyCode] = useState('');
    const [currencyId, setCurrencyId] = useState('');
    const [selectedFreightType, setSelectedFreightType] = useState('');
    const [supplyOfMaterial, setSupplyOfMaterial] = useState('')
    const [deliveryMode, setDeliveryMode] = useState('')
    const [department, setDepartment] = useState('');
    const [cellModalOpen, setCellModalOpen] = useState(false);
    const [cellClickParams, setClickParams] = useState('');
    const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
    const [changeShippingAddress, setChangeShippingAddress] = useState(false);
    const [supplierSid, setSupplierSid] = useState('')
    const [totalData, setTotalData] = useState([])//TO DISPLY TOTAL PO AND AMOUNT IN DATAGRID
    const [totalQuantity, setTotalQuantity] = useState('');
    const [totalGrossAmount, setTotalGrossAmount] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [scheduleDate, setScheduleDate] = useState()
    const [supplierId, setSupplierId] = useState('');
    const [searchedItemValue, setSearchedItemValue] = useState('')
    const [fieldSuggetionsGroup, setFieldSuggetionsGroup] = useState('')
    const [selectedCellName, setSelectedCellName] = useState('');
    const [storeItemIds, setStoreItemIds] = useState([]);
    const [loading, setLoading] = useState(false);
    // Store Temp Selection dialog state
    const [storeTempDialogOpen, setStoreTempDialogOpen] = useState(false);
    const [storeTempSelectionModel, setStoreTempSelectionModel] = useState([]);
    // USEREF HOOK
    const [refNo, setRefNo] = useState('')
    const [ptf, setPtf] = useState('');
    const [gref, setGref] = useState('')
    const [sir, setSir] = useState('')
    const [sr, setSr] = useState([])
    const [pbr, setPbr] = useState('');
    const [cdr, setCdr] = useState('')
    const [awr, setAwr] = useState('');
    const [uploadLoader, setUploadLoader] = useState(false);
    const [replacingValue, setReplacingValue] = useState('');
    const [replacingCellName, setReplacingCellName] = useState('');
    const [generatedPoLists, setGeneratedPoLists] = useState([]);
    const [selectedGeneratedPo, setSelectedGeneratedPo] = useState('');
    const [pendingJwModalOpen, setPendingJwModalOpen] = useState(false);
    const [deleteDailogOpenPo, setDeleteDailogOpenPo] = useState(false)
    //OPTION
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openOption = Boolean(anchorEl);
    const [deAthorise, setDeAuthorise] = useState(false);
    const [ammendment, setAmmendment] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [isDoubleClickItemCode, setIsDoubleClickItemCode] = useState(false);
    const [doubleClickIndex, setDoubleClickIndex] = useState(null);
    const [editedRowPoGenId, setEditedRowPoGenId] = useState('');
    // FORWARD REVERSE
    const [mainId, setMainId] = useState('');
    //PO APPROVAL
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [rejectDailogOpen, setRejectDailogOpen] = useState(false)
    const [rejectId, setRejectId] = useState('')
    const location = useLocation();
    const [isPOView, setIsPoView] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [poStatus, setPoStatus] = useState('')
    const [pdfModalOpen, setPdfModalOpen] = useState(false)
    const [pdfUrl, setPdfUrl] = useState('');
    const [viewMoreModal, setViewMoreModal] = useState(false);
    const [isNewMode, setIsNewMode] = useState(false);
    // EDIT PURCHASE OERDER isEdit
    const supId = new URLSearchParams(location.search).get('supId');
    // DOCUMENT AUTHORIZATION
    const isAuthoriseDocument = new URLSearchParams(location.search).get('isAuthoriseDocument');
    const isView = new URLSearchParams(location.search).get('isView');
    const rowId = new URLSearchParams(location.search).get('rowId');
    const poDigit = new URLSearchParams(location.search).get('poDigit');
    const type = new URLSearchParams(location.search).get('type');
    const poNo = new URLSearchParams(location.search).get('poNo');
    const isType = new URLSearchParams(location.search).get('isType');
    //NAVIGATION FROM BOI TO PURCHASE
    const isBOI = new URLSearchParams(location.search).get('isBOI');
    const selectedPartNo = new URLSearchParams(location.search).get('selectedPartNo');
    const selectedBoiSuppId = new URLSearchParams(location.search).get('selectedBoiSuppId');
    // Split the string into an array using the comma as a delimiter
    const partNoArray = selectedPartNo && selectedPartNo.split(',');
    // PURCHASE OERDER VIEW
    let isPurchaseOrderView = new URLSearchParams(location.search).get('isPurchaseOrderView');

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
        setSearchTemp([]);
    }, [selectedPONo]);


    useEffect(() => {
        if (openTempManager) {
            loadAllTemps();
        }
    }, [openTempManager]);

    const loadAllTemps = () => {
        const keys = Object.keys(localStorage).filter(k => k.startsWith("poTempSearch_"));
        const list = keys.map(k => {
            const t = JSON.parse(localStorage.getItem(k));
            return {
                key: k,
                poNo: t.poNo,
                supplierName: t.supplierName,
                items: t.items.length,
                createdAt: t.createdAt
            };
        });
        setTempList(list);
    };

    useEffect(() => {
        GetFieldSuggetions(handleGetPoSuggetionsSuccess, handleGetPoSuggetionsException)

        // FROM PURCHASE ORDER VIEW PAGE
        if (isPurchaseOrderView) {
            POViewApprove({ poDigit: poDigit, prefix: selectedPONo }, handleActionSuccess, handleActionException);
        }

        if (isPOView) {
            POViewApprove(
                {
                    poDigit: poDigit,
                    prefix: selectedPONo
                },
                handlePOViewApproveSuccess, handlePOViewApproveException);
        }
        if (isAuthoriseDocument) {
            POViewApprove(
                {
                    poDigit: poDigit,
                    prefix: isType
                },
                handlePOViewApproveSuccess, handlePOViewApproveException);
        }
        if (isEdit) {
            POViewApprove(
                {
                    poDigit: poDigit,
                    prefix: selectedPONo
                },
                handlePOViewApproveSuccess, handlePOViewApproveException);
            GetPOSupplierItemList({ id: supId }, handleGetSuppItemListSucessShow, handleGetSuppItemListExceptionShow)
        }
        if (isView) {
            POViewApprove(
                {
                    poDigit: poDigit,
                    prefix: selectedPONo
                },
                handlePOViewApproveSuccess, handlePOViewApproveException);
        }
        if (isBOI) {
            GetBoiPurchaseItemList(
                {
                    spId: selectedBoiSuppId,
                    itemList: partNoArray
                },
                handleBoiPurchaseItemListSuccess, handleBoiPurchaseItemListException);
        }

        if (!isAuthoriseDocument && !isBOI && !isPurchaseOrderView) {
            handleForwardReverse('last', '');
        }

        return () => {
            setStoreItemIds([]);
        }

    }, [editeData, type, poDigit, isBOI, selectedPartNo, selectedBoiSuppId]);

    // HANDLE SUGGETIONS EXCEPTION
    const handleGetPoSuggetionsSuccess = (dataObject) => {
        setFieldSuggetionsGroup(dataObject);
    }
    const handleGetPoSuggetionsException = () => { }

    // BOI PURCHASE ORDER CODE
    const handleBoiPurchaseItemListSuccess = (dataObject) => {
        setSuppAddress(dataObject?.supplierDetails?.spAddress || '')
        setBuildAddress(dataObject?.supplierDetails?.shipAddress || '')
        setPtf(dataObject?.supplierDetails?.paymentTerms || '');
        setGref(dataObject?.supplierDetails?.gstNo || '');
        setCurrency(dataObject?.supplierDetails?.currency || '');
        setCurrencyCode(dataObject?.supplierDetails?.code || '');
        setCurrencyId(dataObject?.supplierDetails?.currencyId || '')
        setSupplierName(dataObject?.supplierDetails?.spName || '');
        setSupplierSid(dataObject?.supplierDetails?.sId || '')
        setSelectedItems(dataObject.itemsDetails || []);
        // FOR BIO TO PURCHASE TOTAL CALCULATION
        calculateTotals(dataObject.itemsDetails || [])
    }

    const handleBoiPurchaseItemListException = () => { }

    // PO APPROVAL CODE
    const handlePOViewApproveSuccess = (dataObject) => {
        const data = dataObject.data[0];
        setSelectedPONo(data?.type || '');
        setUniqueCode(data?.digit || '')
        setUniqueCodeString(data?.poNo || '')
        setSelectedDate(data?.date || '')
        setSuppAddress(data?.spAddress || '')
        setBuildAddress(data?.shipAddress)
        setRefNo(data?.refNoDate || '');
        setPtf(data?.paymentTerms || '');
        setGref(data?.gst || '');
        setSir(data?.splInstr1 || '');
        setSr(data?.specification || '');
        setPbr(data?.preparedBy || '');
        setCdr(data?.caption || '');
        setAwr(data?.amountInWords || '');
        setPOType(data?.poType || '');
        setDepartment(data?.department || '');
        setCurrency(data?.currency || '');
        setCurrencyCode(data?.code || '');
        setSelectedFreightType(data?.freightType || '');
        setDeliveryMode(data?.deliveryMode || '');
        setSupplyOfMaterial(data?.suppOfMat || '');
        setTotalQuantity(data?.totalQty || '');
        setTotalGrossAmount(data?.grossAmount || '');
        setSupplierName(data?.suppName || '');
        setPoStatus(data?.authorized || '');
        setSelectedItems(dataObject.data || []);
    }
    const handlePOViewApproveException = (errorObject, errorMessage) => {
    }

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
            setRejectDailogOpen(false);
            navigate(`/PurchaseOrderApprovalModule`);
        }, 3000);
    };
    const deletehandleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
        }, 3000);
    };
    // PO APPROVAL CODE END

    const ClearData = () => {
        setSupplierId('');
        setSelectedPONo('');
        setUniqueCode('');
        setUniqueCodeString('');
        setSelectedDate('');
        setSupplierList([]);
        setSupplierName('');
        setSelectedItems([{ id: 'RDL1' }]);
        setSuppAddress('');
        setBuildAddress("")
        setPOType('REGULAR');
        setCurrency('');
        setCurrencyCode('');
        setCurrencyId('');
        setSelectedFreightType('');
        setSupplyOfMaterial('');
        setDeliveryMode('');
        setDepartment('');
        setClickParams('');
        setSupplierSid('');
        setTotalData([]);
        setTotalQuantity('')
        setTotalGrossAmount('')
        setRefNo('');
        setPtf('');
        setGref('');
        setSir('');
        setSr('');
        setPbr(userDetails.userName);
        setCdr('');
        setAwr('');
        setSearchedItemValue('');
        setStoreItemIds([]);
    }

    //LOAD THE SUPPLIER LIST IN AUTO COMPLETE FIELD
    const handleGetPOSupplierListSuccess = (dataObject) => {
        setSupplierList(dataObject?.data || []);
    }
    const handleGetPOSupplierListFailed = (errorObject, errorMessage) => {
    }

    const optionsSuppList = supplierList?.map(item => ({
        id: item?.id,
        spCode: item?.spCode,
        label: item?.spName,
        spAddress: item?.spAddress,
        currency: item?.currency,
        currencyId: item?.currencyId,
        code: item?.code,
        department: item?.department,
        sId: item?.sId,
        paymentTerms: item?.paymentTerms
    }));

    function handleSupplierAutocompleteChange(selectedValue) {
        //GET SUPPLIER ITEM LIST
        if (selectedValue !== null) {
            setSuppAddress(selectedValue?.spAddress);
            setCurrency(selectedValue?.currency);
            setCurrencyCode(selectedValue?.code);
            setCurrencyId(selectedValue?.currencyId);
            setSupplierName(selectedValue?.label);
            setDepartment(selectedValue?.department);
            setSupplierSid(selectedValue?.sId);
            setSupplierId(selectedValue?.id);
            setPtf(selectedValue?.paymentTerms);
        }
    }

    const handleGetSuppItemListSucessShow = (dataObject) => {
        setSupplierItemList(dataObject?.data || []);
    }
    const handleGetSuppItemListExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let updatedSelectedArray;
        if (selectedPONo === 'R') {
            updatedSelectedArray = selectedItems.filter(item => item.id !== 'RDL1');
        } else {
            updatedSelectedArray = selectedItems.filter(item => item.id !== 'RDL1');
        }

        // Validate that rates are not null or zero
        const hasInvalidRate = updatedSelectedArray.some(item => item.rate === 0 || item.rate === "");
        if (hasInvalidRate) {
            setNotification({
                status: true,
                type: 'error',
                message: 'Rate cannot be empty or zero.',
            });
            return; // Stop further execution if validation fails
        }

        // Validate that rates are not null or zero
        const hasInvalidSchDate = updatedSelectedArray.some(item => item.schDate === "00/00/0000" || item.schDate === "");
        if (hasInvalidSchDate) {
            setNotification({
                status: true,
                type: 'error',
                message: 'Schedule date cannot be empty.',
            });
            return; // Stop further execution if validation fails
        }

        const updatedArray = updatedSelectedArray.map(obj => (
            {
                ...obj,
                poNo: selectedPONo,
                digit: uniqueCode,
                date: selectedDate,
                digitString: uniqueCodeString,
                spName: supplierName,
                spAddress: suppAddress,
                shipAddress: buildAddress,
                refNoDate: refNo,
                poType: poType,
                department: department,
                currency: currency,
                currencyId: currencyId,
                freightType: selectedFreightType,
                paymentTerms: ptf,
                gst: gref,
                deliveryMode: deliveryMode,
                suppOfMat: supplyOfMaterial,
                splInstr1: sir,
                specification: sr,
                preparedBy: pbr,
                caption: cdr,
                amountInWords: numberToWordsWithDecimal(Number(totalGrossAmount).toFixed(3)),
                totalQty: totalQuantity,
                grossAmount: totalGrossAmount,
                code: currencyCode
            }

        ))

        if (isEdit) {
            if (poType && selectedFreightType && ptf && gref && deliveryMode && sr) {
                setLoading(true);
                EditGeneratedPO(updatedArray, handleSuccess, handleException);
            } else {
                setNotification({
                    status: true,
                    type: 'error',
                    message: 'Please fill the required fields',
                });
            }
        } else {
            if (poType && ptf && gref && deliveryMode) {
                setLoading(true);
                GeneratePO(updatedArray, handleSuccess, handleException);
            } else {
                setNotification({
                    status: true,
                    type: 'error',
                    message: 'Please fill the required fields',
                });
            }
        }
    };

    // THIS FOR OPTIONS AMMENDMENT AND DE-AUTHORISE
    const handleAmendOrDeAuth = () => {
        let updatedSelectedArray;
        if (selectedPONo === 'R') {
            updatedSelectedArray = selectedItems.filter(item => item.id !== 'RDL1');
        } else {
            updatedSelectedArray = selectedItems.filter(item => item.id !== 'RDL1');
        }

        // Validate that rates are not null or zero
        const hasInvalidRate = updatedSelectedArray.some(item => item.rate === 0 || item.rate === "");
        if (hasInvalidRate) {
            setNotification({
                status: true,
                type: 'error',
                message: 'Rate cannot be null or zero.',
            });
            return; // Stop further execution if validation fails
        }

        const updatedArray = updatedSelectedArray.map(obj => (
            {
                ...obj,
                poNo: selectedPONo,
                digit: uniqueCode,
                date: selectedDate,
                digitString: uniqueCodeString,
                spName: supplierName,
                spAddress: suppAddress,
                shipAddress: buildAddress,
                refNoDate: refNo,
                poType: poType,
                department: department,
                currency: currency,
                currencyId: currencyId,
                freightType: selectedFreightType,
                paymentTerms: ptf,
                gst: gref,
                deliveryMode: deliveryMode,
                suppOfMat: supplyOfMaterial,
                splInstr1: sir,
                specification: sr,
                preparedBy: pbr,
                caption: cdr,
                amountInWords: numberToWords(Number(totalGrossAmount)),
                totalQty: totalQuantity,
                grossAmount: totalGrossAmount,

                type: ammendment ? "ammend" : "deauth"
            }
        ))


        if (poType && ptf && gref && deliveryMode) {
            setLoading(true);
            UpdateAmendAndDeauth(updatedArray, handleSuccess, handleException);
        } else {
            setNotification({
                status: true,
                type: 'error',
                message: 'Please fill the required fields',
            });
        }
    }


    // const handleSuccess = (dataObject) => {
    //     setIsNewMode(false);
    //     console.log("the dataObject ", dataObject);

    //     setNotification({
    //         status: true,
    //         type: 'success',
    //         message: dataObject.message,
    //     });

    //     // ⭐⭐⭐ CLEAR ONLY THIS PO'S TEMP STORE
    //     const tempKey = `poTempSearch_${selectedPONo}`;
    //     localStorage.removeItem(tempKey);
    //     setSearchTemp([]);

    //     // Now load last saved record
    //     setTimeout(() => {
    //         handleForwardReverse('last', '');
    //         setLoading(false);

    //         setTimeout(() => handleClose(), 1500);
    //     }, 1000);
    // };
    const handleSuccess = (dataObject) => {
        setIsNewMode(false);

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        // ⭐⭐⭐ CLEAR ONLY THIS PO'S TEMP STORE (SAFE)
        const tempKey = `poTempSearch_${selectedPONo}`;

        localStorage.removeItem(tempKey);
        // Optional: clear backup if created
        localStorage.removeItem(`backup_${tempKey}`);

        setSearchTemp([]);  // Clear UI temp

        // Refresh UI
        setTimeout(() => {
            setAmmendment(false);
            setDeAuthorise(false);
            setIsEdit(false);
            setIsPoView(true);
            // handleForwardReverse('poNo', selectedPONo);
            setLoading(false);
            // if (isView) {
            POViewApprove(
                { poDigit: poDigit, prefix: selectedPONo },
                (res) => {
                    setPoStatus(res.data?.authorized || "");   // <-- ⭐ UPDATE STATUS HERE
                },
                handlePOViewApproveException
            );
            // }
            setTimeout(() => handleClose(), 1500);
        }, 800);
    };


    const handleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleFreightTypeChange = (e) => {
        const selectedValue = e.target.value;
        // Your custom conditions based on the selected value
        if (selectedValue === 'PAID') {
            // Do something when 'PAID' is selected
            setSupplyOfMaterial('DOOR DELIVERY');
        } else if (selectedValue === 'TO PAY') {
            // Do something when 'TO PAY' is selected
            setSupplyOfMaterial('FREIGHT EXTRA');
        }
        // Update the state
        setSelectedFreightType(selectedValue);
    };

    const handleDateChange = (id, date) => {
        // Implement your logic to update the date in your data
        const updatedList = selectedItems.map((supp) =>
            supp.id === id ?
                { ...supp, schDate: date }
                : supp
        )
        setSelectedItems(updatedList);
    };

    const handleDeleteRow = (id) => {
        const newArray = selectedItems.filter((item) => item.id != id)
        setSelectedItems(newArray);
        // TO MINUS THE AMOUNT IN TOTAL_GRID
        calculateTotals(newArray)

        ///////////////////////////////////////DELETE STORED ITEM IDS ARRAY////////////////////
        const filteredArray = storeItemIds.filter((item) => item != id)
        setStoreItemIds(filteredArray)
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


    //PO UNIQUE CODE SUCCESS FAILURE CALLBACK
    const handleGetUniqueCodeSuccess = (dataObject) => {
        setUniqueCode(dataObject?.digit || []);
        setUniqueCodeString(dataObject?.id || []);
    }
    const handleGetUniqueCodeException = (errorObject, errorMessage) => {
        setNotification({
            // errorObject, errorMessage
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    //DATE CONVERT TO TEXTFIELD
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    //ON CELL CLICK FUNCTION
    const handleCellClick = (cellName, rowData) => {
        setSelectedCellName(cellName)
        setCellModalOpen(true)
        setClickParams(rowData)
    }

    //TOTAL CALCULATION
    const calculateTotals = (data) => {
        const updatedData = data.filter((item) => item.id !== 'RDL1');
        const totalQty = updatedData.reduce((acc, item) => acc + (Number(item.poQty) || 0), 0);
        setTotalQuantity(totalQty);
        const amt = updatedData.reduce((acc, item) => acc + (Number(item.amt) || 0), 0);
        setTotalGrossAmount(amt);
        return [
            { id: 1, totalQty, amt }
        ];
    };
    // const calculateTotals = (data) => {
    //     // Filter out any invalid items and the RDL1 row
    //     const validItems = data.filter(item => item && item.id && item.id !== 'RDL1');

    //     // Calculate total quantity and amount
    //     const totalQty = validItems.reduce((acc, item) => acc + (Number(item.poQty) || 0), 0);
    //     const amt = validItems.reduce((acc, item) => acc + (Number(item.amt) || 0), 0);

    //     // Update state
    //     setTotalQuantity(totalQty);
    //     setTotalGrossAmount(amt);

    //     // Return the summary
    //     return [
    //         { id: 1, totalQty, amt }
    //     ];
    // };
    const handleTemplateDownload = () => {
        PurchaseOrderTemplate(handleTemplateDownloadSuccess, handleTemplateDownloadFailed)
    }
    const handleTemplateDownloadSuccess = () => {
        setNotification({
            status: true,
            type: 'success',
            message: "Template Download Success",
        });
        setTimeout(() => {
            handleClose();
        }, 3000);
    }
    const handleTemplateDownloadFailed = () => {
        setNotification({
            status: true,
            type: 'error',
            message: "Template failed to download",
        });
        setTimeout(() => {
        }, 3000);
    }

    // CONVERT NUMBER INTO WORDS
    // function numberToWords(number) {
    //     const units = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    //     const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    //     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    //     if (number < 10) {
    //         return units[number];
    //     } else if (number < 20) {
    //         return teens[number - 10];
    //     } else if (number < 100) {
    //         return tens[Math.floor(number / 10)] + (number % 10 !== 0 ? ' ' + units[number % 10] : '');
    //     } else if (number < 1000) {
    //         return units[Math.floor(number / 100)] + ' Hundred' + (number % 100 !== 0 ? ' ' + numberToWords(number % 100) : '');
    //     } else if (number < 100000) {
    //         return numberToWords(Math.floor(number / 1000)) + ' Thousand' + (number % 1000 !== 0 ? ' ' + numberToWords(number % 1000) : '');
    //     } else if (number < 10000000) {
    //         return numberToWords(Math.floor(number / 100000)) + ' Lakh' + (number % 100000 !== 0 ? ' ' + numberToWords(number % 100000) : '');
    //     } else {
    //         return numberToWords(Math.floor(number / 10000000)) + ' Crore' + (number % 10000000 !== 0 ? ' ' + numberToWords(number % 10000000) : '');
    //     }
    // }
    function numberToWords(number) {
        const units = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        if (number < 10) return units[number];
        if (number < 20) return teens[number - 10];
        if (number < 100) {
            return tens[Math.floor(number / 10)] + (number % 10 !== 0 ? ' ' + units[number % 10] : '');
        }
        if (number < 1000) {
            return numberToWords(Math.floor(number / 100)) + ' Hundred' + (number % 100 !== 0 ? ' ' + numberToWords(number % 100) : '');
        }
        if (number < 100000) {
            return numberToWords(Math.floor(number / 1000)) + ' Thousand' + (number % 1000 !== 0 ? ' ' + numberToWords(number % 1000) : '');
        }
        if (number < 10000000) {
            return numberToWords(Math.floor(number / 100000)) + ' Lakh' + (number % 100000 !== 0 ? ' ' + numberToWords(number % 100000) : '');
        }
        return numberToWords(Math.floor(number / 10000000)) + ' Crore' + (number % 10000000 !== 0 ? ' ' + numberToWords(number % 10000000) : '');
    }

    // ✅ Convert full amount including decimal
    function numberToWordsWithDecimal(value) {
        const sanitized = String(value).replace(/,/g, ''); // Remove commas
        const [intPart, decPart] = sanitized.split('.');
        let words = numberToWords(Number(intPart));
        if (decPart && Number(decPart) !== 0) {
            const decimalWords = decPart
                .split('')
                .map(digit => numberToWords(Number(digit)))
                .join(' ');
            words += ` point ${decimalWords}`;
        }
        return words;
    }


    // XL UPLOAD HANDLER
    const handleItemImportSucess = (dataObject) => {
        const isSpecialRightOpt1Checked = userPermission[0]?.opt1 === 1;
        // Clone the selectedItems array
        const clonedSelectedItems = [...selectedItems];
        // Remove the last item from the cloned array
        const lastObj = clonedSelectedItems.pop();
        // EXCEL RESPONSE DATA
        const excelResponse = dataObject?.data || [];
        // Validate and modify excel data before adding
        const validatedResponse = excelResponse.map((item) => {
            const isQuantityExceedingMax = Number(item.poQty) > Number(item.maxLvl);

            if (isQuantityExceedingMax) {
                alert(`PO Quantity for item ${item.itemCode} must be less than Max Quantity Level`);
                return {
                    ...item,
                    poQty: isSpecialRightOpt1Checked ? item.poQty : 0,
                    amt: isSpecialRightOpt1Checked ? Number(item.poQty) * Number(item.rate) : 0,
                };
            }

            return item;
        });

        // Add the validated new values at the end and the removed item back
        clonedSelectedItems.push(...validatedResponse, lastObj);

        // Set the state with the modified array
        setSelectedItems(clonedSelectedItems);
        setTotalData(calculateTotals(clonedSelectedItems));
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setUploadLoader(false);
        }, 2000);
    }

    const handleItemImportException = (errorObject, errorMessage) => {
        setSelectedItems([{ id: 'RDL1' }]);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setUploadLoader(false);
        }, 2000);
    }

    const handleEnterKeyPress = (params) => {
    };

    const handleSupplierSearchItemChange = (value) => {
        if (value !== null) {
            // Clone the selectedItems array
            const clonedSelectedItems = [...selectedItems];
            // Remove the last item from the cloned array
            const lastObj = clonedSelectedItems.pop();
            // Add the new value at the end and the removed item back
            clonedSelectedItems.push(value, lastObj);
            // Set the state with the modified array
            setSelectedItems(clonedSelectedItems);
            setSearchedItemValue();
        }
    };

    const handleEdit = (cellNam, newValue, id, rowData, uniqueFId) => {
        switch (cellNam) {
            case "POQTY": {
                const isSpecialRightOpt1Checked = userPermission[0]?.opt1 === 1;
                const isQuantityExceedingMax = Number(newValue) > Number(rowData.maxLvl);

                if (isQuantityExceedingMax) {
                    alert("PO Quantity must be less than Max Quantity Level");

                    const refreshRow = selectedItems.map((supp) =>
                        supp.uniqueFId === uniqueFId
                            ? {
                                ...supp,
                                poQty: isSpecialRightOpt1Checked ? newValue : 0,
                                // amt: isSpecialRightOpt1Checked ? Number(newValue) * Number(rowData.rate) : 0
                                amt: parseFloat(
                                    ((isSpecialRightOpt1Checked ? newValue : 0) * Number(rowData.rate)).toFixed(3)
                                )
                            }
                            : supp
                    );

                    setSelectedItems(refreshRow);
                    setTotalData(calculateTotals(refreshRow));
                    return;
                }

                // const updatedPoqty = selectedItems.map((supp) =>
                //     supp.uniqueFId === uniqueFId && cellNam === 'POQTY'
                //         ? { ...supp, poQty: newValue, amt: Number(newValue) * Number(rowData.rate) }
                //         : supp
                // );
                const updatedPoqty = selectedItems.map((supp) =>
                    supp.uniqueFId === uniqueFId && cellNam === 'POQTY'
                        ? {
                            ...supp,
                            poQty: newValue,
                            amt: parseFloat((Number(newValue) * Number(rowData.rate)).toFixed(3))
                        }
                        : supp
                );

                setSelectedItems(updatedPoqty);
                setTotalData(calculateTotals(updatedPoqty));
                break;
            }

            case "SCHDATE":

                const selectedItem = selectedItems.find(supp => supp.uniqueFId === uniqueFId);
                if (!selectedItem) {
                    break;
                }

                const { itemCode } = selectedItem;
                let isDuplicateSchDate = false;

                // ✅ Only check for duplicates if PO No = 'R'
                if (selectedPONo === 'R') {
                    isDuplicateSchDate = selectedItems.some(
                        (supp) =>
                            supp.uniqueFId !== uniqueFId &&
                            supp.itemCode === itemCode &&
                            supp.schDate === newValue
                    );
                }

                let updatedSchDate;

                if (isDuplicateSchDate) {
                    // alert(`Schedule date "${newValue}" already exists for item code "${itemCode}". It must be unique.`);
                    setNotification({
                        status: true,
                        type: 'error',
                        message: `Schedule date "${newValue}" already exists for item code "${itemCode}". It must be unique.`,
                    });

                    // Reset the schDate to "00/00/0000" for the same row
                    updatedSchDate = selectedItems.map((supp) =>
                        supp.uniqueFId === uniqueFId
                            ? { ...supp, schDate: "00/00/0000" }
                            : supp
                    );
                } else {
                    // No conflict, update with the new value
                    updatedSchDate = selectedItems.map((supp) =>
                        supp.uniqueFId === uniqueFId
                            ? { ...supp, schDate: newValue }
                            : supp
                    );
                }

                // if (isDuplicateSchDate) {
                //     alert(`Schedule date "${newValue}" already exists for item code "${itemCode}". Please choose a different date.`);
                //     return;
                // }

                // // Update if validation passed
                // const updatedSchDate = selectedItems.map((supp) =>
                //     supp.uniqueFId === uniqueFId
                //         ? { ...supp, schDate: newValue }
                //         : supp
                // );

                setSelectedItems(updatedSchDate);
                setTotalData(calculateTotals(updatedSchDate));
                break;

            case "suppDesc":
                const updatedSuppDesc = selectedItems.map((supp) =>
                    supp.uniqueFId === uniqueFId && cellNam === 'suppDesc' ?
                        { ...supp, suppDesc: newValue }
                        : supp
                )
                setSelectedItems(updatedSuppDesc);
                setTotalData(calculateTotals(updatedSuppDesc));
                break;

            default:
            // code block
        }
    }

    // AUTOFULL SUGGESTIONS
    const handlePaymentTermsChange = (value) => {
        if (value !== null) {
            setPtf(value.paymentTerms);
        }
    }
    const handleGstRefChange = (value) => {
        if (value !== null) {
            setGref(value.gst);
        }
    }
    const handleSpeclInstr1Change = (value) => {
        if (value !== null) {
            setSir(value.splInstr1);
        }
    }
    const handleSpecificationChange = (value) => {
        if (value !== null) {
            setSr(value.specification);
        }
    }
    const handleCaptionChange = (value) => {
        if (value !== null) {
            setCdr(value.caption);
        }
    }

    const handleUpdateMaxLevelSuccess = (dataObject) => {
        // Create a copy of the current data array
        const updatedData = [...selectedItems];

        // Iterate over newData
        dataObject?.results?.forEach(newItem => {
            // Find the corresponding item in the data array
            const existingItemIndex = updatedData.findIndex(item => item?.itemCode === newItem?.itemCode);
            // If found, update its age
            if (existingItemIndex !== -1) {
                updatedData[existingItemIndex].maxLvl = newItem.value;
            }
        });

        // Update the state with the modified data
        setSelectedItems(updatedData);
    }
    const handleUpdateMaxLevelException = () => { }

    // ITEM AND ITEM CODE SEARCH

    const handleItemChange = (e) => {
        GetPoItemLists({ supId: supplierId, code: e.target.value, type: selectedPONo }, handlePoItemSuccess, handlePoItemException);
    }

    const handlePoItemSuccess = (dataObject, refreshedItemCode) => {
        const allItems = dataObject?.data || [];
        setSupplierItemList(allItems); // <-- set options for Autocomplete

        if (!refreshedItemCode) return; // skip rest for live search (not refresh)

        const refreshedItem = allItems.find(item => item.itemCode === refreshedItemCode);
        if (!refreshedItem) return;

        // Create updated item list
        const updatedItems = selectedItems.map((item) =>
            item.itemCode === refreshedItemCode
                ? {
                    ...item,
                    ...refreshedItem,
                    amt: Number(item.poQty) * Number(refreshedItem.rate || item.rate)  // updated rate used for amount
                }
                : item
        );

        // Update selectedItems and totals
        setSelectedItems(updatedItems);
        setTotalData(calculateTotals(updatedItems));
    };


    const handlePoItemException = () => { }

    // ADD ITEMS
    // const handleSupplierItemChange = (value) => {
    //     if (value !== null) {
    //         // Clone the selectedItems array
    //         const clonedSelectedItems = [...selectedItems];

    //         // Remove the last item from the cloned array
    //         const lastObj = clonedSelectedItems.pop();

    //         // Add the new value at the end and the removed item back
    //         clonedSelectedItems.push(value, lastObj);

    //         // Set the state with the modified array
    //         setSelectedItems(clonedSelectedItems);
    //         // setSearchedItemValue();
    //         ///////////////////////////////////////////////STORE ITEM IDES///////////////////////////
    //         setStoreItemIds([...storeItemIds, value.itemId])
    //     }
    // };

    // const handleSupplierItemChange = (value) => {
    //     if (value !== null) {
    //         // Clone the selectedItems array
    //         const clonedSelectedItems = [...selectedItems];

    //         // Remove the last item from the cloned array
    //         const lastObj = clonedSelectedItems.pop();

    //         // Generate a unique ID
    //         const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    //         // Add the unique ID to the value object
    //         const newItem = { ...value, uniqueFId: uniqueId };

    //         // Add the new item and the removed item back
    //         clonedSelectedItems.push(newItem, lastObj);

    //         // Set the state with the modified array
    //         setSelectedItems(clonedSelectedItems);

    //         // Store item IDs
    //         setStoreItemIds([...storeItemIds, value.itemId]);
    //     }
    // };
    // const handleSupplierItemChange = (value) => {
    //     if (value !== null) {

    //         // Clone old array
    //         const clonedSelectedItems = [...selectedItems];

    //         // Remove footer row
    //         const lastObj = clonedSelectedItems.pop();

    //         // Generate unique ID
    //         const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    //         // Attach our unique id
    //         const newItem = { ...value, uniqueFId: uniqueId };

    //         // Push new item + footer row
    //         clonedSelectedItems.push(newItem, lastObj);

    //         // Update UI Table
    //         setSelectedItems(clonedSelectedItems);

    //         // Store itemIds (your old logic)
    //         setStoreItemIds([...storeItemIds, value.itemId]);

    //         // ⭐⭐⭐ TEMP STORE FOR RESTORE
    //         const newTempList = [...searchTemp, newItem];
    //         setSearchTemp(newTempList);

    //         localStorage.setItem("poTempSearch", JSON.stringify({
    //             items: newTempList,
    //             poNo: selectedPONo,
    //             supplierId: supplierId,
    //             supplierName: supplierName,
    //             id: uniqueCodeString,      // API -> poId
    //             digit: uniqueCode,
    //         }));
    //     }
    // };
    ////////New Updated Code//////
    const handleSupplierItemChange = (value) => {
        if (value !== null) {

            // Clone old array and remove footer row
            const clonedSelectedItems = [...selectedItems];
            const lastObj = clonedSelectedItems.pop();

            const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

            const newItem = { ...value, uniqueFId: uniqueId };

            // Add item + footer back
            clonedSelectedItems.push(newItem, lastObj);

            setSelectedItems(clonedSelectedItems);

            setStoreItemIds([...storeItemIds, value.itemId]);

            // ⭐⭐⭐ TEMP STORE PER PO — (NO MIXING)
            const newTempList = [...searchTemp, newItem];
            setSearchTemp(newTempList);

            // Use dynamic key per PO
            const tempKey = `poTempSearch_${selectedPONo}`;

            localStorage.setItem(tempKey, JSON.stringify({
                items: newTempList,
                poNo: selectedPONo,
                supplierId: supplierId,
                supplierName: supplierName,
                id: uniqueCodeString,
                digit: uniqueCode,
                createdAt: new Date().toISOString()
            }));
        }
    };



    ////End

    ///new updated code///
    const handleSupplierItemEdit = (value) => {
        if (value === null || value.itemCode === selectedItems[doubleClickIndex]?.itemCode) {
            setDoubleClickIndex(null);
            setEditedRowPoGenId('');
            return;
        }

        const clonedSelectedItems = [...selectedItems];

        const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

        const updatedValue = {
            ...value,
            poGenId: editedRowPoGenId,
            uniqueFId: uniqueId
        };

        // Replace edited row
        clonedSelectedItems[doubleClickIndex] = updatedValue;

        setSelectedItems(clonedSelectedItems);
        setStoreItemIds([...storeItemIds, value.itemId]);
        setDoubleClickIndex(null);

        // ⭐⭐⭐ TEMP STORE PER PO — (NO MIXING)
        const newTempList = [...searchTemp, updatedValue];
        setSearchTemp(newTempList);

        // Dynamic per-PO key
        const tempKey = `poTempSearch_${selectedPONo}`;

        localStorage.setItem(tempKey, JSON.stringify({
            items: newTempList,
            poNo: selectedPONo,
            supplierId: supplierId,
            supplierName: supplierName,
            id: uniqueCodeString,
            digit: uniqueCode,
            createdAt: new Date().toISOString()
        }));
    };


    ///end///
    //////////////////////////////////////////////////////////////SUPPLIER CHANGE//////////////////////////////////////////////////////////
    //GET SUPPLIER LIST
    const handleChange = (e) => {
        setSupplierItemList([]);

        GetSuppVsItemAllSuppList({ code: e.target.value }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
    }

    const handleItemVsProcessItemSucessShow = (dataObject) => {
        setSupplierList(dataObject?.data || []);
    }
    const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSupplierSelect = (selectedValue) => {
        setSupplierItemList([]);

        setSuppAddress(selectedValue?.spAddress || '');
        setBuildAddress(selectedValue?.shipAddress || '');
        setCurrency(selectedValue?.currency || '');
        setCurrencyCode(selectedValue?.code || '');
        setCurrencyId(selectedValue?.currencyId || '');
        setSupplierName(selectedValue?.spName || '');
        setDepartment(selectedValue?.department || '');
        setSupplierSid(selectedValue?.sId || '');
        setSupplierId(selectedValue?.id || '');
        setPtf(selectedValue?.paymentTerms || '');
        if (storeItemIds.length > 0) {
            ChangeSupplierAfterEntry({ id: selectedValue?.id, items: storeItemIds }, handleChangeSupplierSuccess, handleChangeSupplierException)
        }
    }

    const handleChangeSupplierSuccess = (dataObject) => {
        const clonedSelectedItems = [...dataObject?.data];
        clonedSelectedItems.push({ id: 'RDL1' });
        setSelectedItems(clonedSelectedItems);
    }
    const handleChangeSupplierException = () => { }

    // const handleReplaceAll = () => {
    //     if (replacingCellName === "replacePOQTY") {
    //         let updatedData = selectedItems.map((item, index) => {
    //             if (index === selectedItems.length - 1) {
    //                 return item;
    //             }
    //             return { ...item, poQty: replacingValue, amt: Number(replacingValue) * Number(item.rate) };
    //         });

    //         setSelectedItems(updatedData);
    //         calculateTotals(updatedData);
    //     } else {
    //         // let updatedData = selectedItems.map((item, index) => {
    //         //     if (index === selectedItems.length - 1) {
    //         //         return item;
    //         //     }
    //         //     return { ...item, schDate: replacingValue };
    //         // });

    //         // setSelectedItems(updatedData);
    //         let updatedData = selectedItems.map((item, index) => {
    //             // Skip the last item
    //             if (index === selectedItems.length - 1) {
    //                 return item;
    //             }

    //             const isDuplicate = selectedItems.some((otherItem, otherIndex) =>
    //                 otherIndex !== index &&
    //                 otherIndex !== selectedItems.length - 1 && // skip comparing to last item
    //                 otherItem.itemCode === item.itemCode &&
    //                 otherItem.schDate === replacingValue
    //             );

    //             return {
    //                 ...item,
    //                 schDate: isDuplicate ? "00/00/0000" : replacingValue
    //             };
    //         });
    //         setSelectedItems(updatedData);
    //     }
    // }
    const handleReplaceAll = () => {
        if (replacingCellName === "replacePOQTY") {
            let updatedData = selectedItems.map((item, index) => {
                if (index === selectedItems.length - 1) {
                    return item; // keep footer row as is
                }
                return {
                    ...item,
                    poQty: replacingValue,
                    amt: Number(replacingValue) * Number(item.rate)
                };
            });

            setSelectedItems(updatedData);
            calculateTotals(updatedData);
        } else {
            let updatedData = selectedItems.map((item, index) => {
                if (index === selectedItems.length - 1) {
                    return item; // skip footer
                }

                let newSchDate = replacingValue;

                // ✅ Only check duplicates when PO No = 'R'
                if (selectedPONo === "R") {
                    const isDuplicate = selectedItems.some(
                        (otherItem, otherIndex) =>
                            otherIndex !== index &&
                            otherIndex !== selectedItems.length - 1 &&
                            otherItem.itemCode === item.itemCode &&
                            otherItem.schDate === replacingValue
                    );

                    if (isDuplicate) {
                        newSchDate = "00/00/0000"; // reset if duplicate
                    }
                }

                return {
                    ...item,
                    schDate: newSchDate
                };
            });

            setSelectedItems(updatedData);
        }
    };

    const handleCellReplaceClick = (name, item) => {
        setReplacingCellName(name)
        if (name === "replacePOQTY") {
            setReplacingValue(item.poQty)
        } else {
            setReplacingValue(item.schDate)
        }
    }

    const handlePOChange = (e) => {
        GetGeneratedPo({ type: 'poOrder', code: e.target.value }, handleGeneratedPoSucessShow, handleGeneratedPoExceptionShow);
    }

    const handleGeneratedPoSucessShow = (dataObject) => {
        setGeneratedPoLists(dataObject?.data || []);
    }
    const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => {
    }

    const handleGeneratedPoSelect = (selectedValue) => {
        setIsPoView(true)
        setStoreItemIds([]);
        if (selectedValue !== null) {
            setSelectedGeneratedPo(selectedValue?.poNo);
            POViewApprove({ poDigit: selectedValue.digit, prefix: selectedValue?.type }, handleActionSuccess, handleActionException);
        }
    }

    // HANDLE FORWARD REVERSE HANDLER
    const handleForwardReverse = (type, id) => {
        setStoreItemIds([]);
        PurchaseOrderPreview({ type: type, id: id, prefix: selectedPONo }, handleActionSuccess, handleActionException)
    }

    const handleActionSuccess = (dataObject) => {
        setIsPoView(true)
        const data = dataObject?.data[0];
        setSelectedPONo(data?.type || '');
        setUniqueCode(data?.digit || '')
        setUniqueCodeString(data?.poNo || '')
        setSelectedDate(data?.date || '')
        setSuppAddress(data?.spAddress || '')
        setBuildAddress(data?.shipAddress)
        setSupplierId(data?.supId || '')
        setRefNo(data?.refNoDate || '');
        setPtf(data?.paymentTerms || '');
        setGref(data?.gst || '');
        setSir(data?.splInstr1 || '');
        setSr(data?.specification || '');
        setPbr(data?.preparedBy || '');
        setCdr(data?.caption || '');
        setAwr(data?.amountInWords || '');
        setPOType(data?.poType || '');
        setDepartment(data?.department || '');
        setCurrency(data?.currency || '');
        setCurrencyCode(data?.code || '');
        setSelectedFreightType(data?.freightType || '');
        setDeliveryMode(data?.deliveryMode || '');
        setSupplyOfMaterial(data?.suppOfMat || '');
        setTotalQuantity(data?.totalQty || '');
        setTotalGrossAmount(data?.grossAmount || '');
        setSupplierName(data?.suppName || '');
        setMainId(data?.mainId || '');
        setPoStatus(data?.authorized || '');
        setSelectedItems((dataObject?.data || []).some(item => item?.id === 'RDL1')
            ? dataObject?.data
            : [...(dataObject?.data || []), { id: 'RDL1' }]
        );
        setStoreItemIds(prevIds => [...new Set([...prevIds, ...(dataObject?.data?.map(item => item.itemId) || [])])]);
    }
    const handleActionException = () => { }

    const handleClearPage = () => {
        setIsPoView(false)
        setIsEdit(false)
        setSelectedPONo('');
        setUniqueCode('')
        setUniqueCodeString('')
        setSelectedDate(new Date())
        setSuppAddress('')
        setBuildAddress("")
        setRefNo('');
        setPtf('');
        setGref('');
        setSir('');
        setSr('');
        setPbr(userDetails.userName);
        setCdr('');
        setAwr('');
        setPOType('');
        setDepartment('');
        setCurrency('');
        setCurrencyCode('');
        setSelectedFreightType('');
        setDeliveryMode('');
        setSupplyOfMaterial('');
        setTotalQuantity('');
        setTotalGrossAmount('');
        setSupplierName('');
        setMainId('')
        setSelectedItems([{ id: 'RDL1' }]);
        setPoStatus('');
        setSelectedGeneratedPo('');
        setSupplierId('');
        setDeAuthorise(false);
        setAmmendment(false);
        setSelectedOption('');
        setStoreItemIds([]);
        setSupplierItemList([]);
        setIsNewMode(true);
    }

    // INVOICE
    const getInvoiceData = (data) => {
        GetPurchaseOrderInvoiceData({ poDigit: data, prefix: selectedPONo }, getInvoiceDataSuccess, getInvoiceDataExceptoin)
    }

    const getInvoiceDataSuccess = (dataObject) => {
        handleFileSave(dataObject?.testData || [])
    }

    const getInvoiceDataExceptoin = (errorObject, errorMessage) => {
    }

    // function emptyRowsToPush(lineItems) {
    //     const pageSize = 39, header = 10, footer = 19;//20
    //     const content = header + lineItems + footer;
    //     const totPage = Math.floor(content / pageSize) + 1;
    //     const totalContentSize = pageSize * totPage;
    //     const rowToPush = totalContentSize - content
    //     return rowToPush;
    // }

    // function emptyRowsToPush(lineItems) {
    //     const pageSize = 39;   // max rows per page (depends on your layout)
    //     const header = 10;     // rows occupied by header
    //     const footer = 19;     // rows reserved for footer

    //     // Content rows = header + actual line items + footer
    //     const content = header + lineItems + footer;

    //     // Total pages needed
    //     const totPage = Math.floor(content / pageSize) + 1;

    //     // Capacity of all pages
    //     const totalContentSize = pageSize * totPage;

    //     // Rows we need to pad
    //     let rowToPush = totalContentSize - content;

    //     // 🔧 Always keep at least 4 dummy rows
    //     if (rowToPush < 4) {
    //         rowToPush = 4;
    //     }

    //     return rowToPush;
    // }

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




    const handleFileSave = (item) => {
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // let info = [];
        // item.data.forEach((element, index, array) => {
        //     info.push([element.sNo, element?.itemCode, element.itemDescription, element.uom, element.qty, element.schDate, element.unitRate, element.value])
        // });
        let info = [];
        item.data.forEach((element, index) => {
            const row = [
                element.sNo,
                element.itemCode,
                element.suppDesc,
                element.uom,
                element.qty,
                element.schDate,
                element.unitRate,
                element.value
            ];
            row.isInfoRow = true; // Attach a custom flag to identify rows for styling
            info.push(row);
        });

        const paddingNeeded = emptyRowsToPush(info.length);

        // Push only that many dummy rows
        // for (let i = 0; i < paddingNeeded; i++) {
        //     const emptyRow = ["", "", "", "", "", "", "", ""];
        //     emptyRow.isInfoRow = true;
        //     info.push(emptyRow);
        // }
        if (paddingNeeded > 0) {
            for (let i = 0; i < paddingNeeded; i++) {
                const emptyRow = ["", "", "", "", "", "", "", ""];
                emptyRow.isInfoRow = true;
                info.push(emptyRow);
            }
        }


        const doc = new jsPDF();
        const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
        // console.log("baseUrl------------------>>>>>>>>>>>>>>", baseUrl);
        // const logoUrl = (await import('../../AllImage/RDL_Logo.png')).default;
        const logoUrl = `${baseUrl}/${item.companyImage}`
        const IsoUrl = require('../../AllImage/Picture.png');

        // PAGE NUMBER
        const totalPagesExp = "{totalPages}"; // <-- Add this
        const tableOptions = {
            didDrawPage: (HookData) => {
                // Check if it's the first page
                if (HookData.pageNumber === 1) {
                    // Add an image on the first page
                    doc.addImage(logoUrl, 'PNG', 22, 18, 28, 15);
                    doc.addImage(IsoUrl, 'PNG', 160, 15, 35, 20);
                } else {
                    // From second page onward, show header
                    doc.setFontSize(10);
                    doc.setTextColor('blue');
                    doc.setFont("times", "bold");
                    doc.text(`Puchase Order No : ${item.poNo}     |     Date : ${item.date}`, 14, 8); // Adjust Y pos as needed
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
                    { align: 'right' } // Align text to the right
                );


            },
        };


        const logoAndAddress = [
            [
                {
                    content: ``,
                    colSpan: 2,
                    styles: {
                        halign: 'left', fontSize: 8, textColor: 'black',
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
                {
                    content: `${item.companyName}\n${item.companyAdd}. Tel:${item.telNo}\nWeb Site :${item.website}\nEmail : ${item.email}`,
                    colSpan: 6,
                    styles: {
                        halign: 'left', fontSize: 8, textColor: 'black',
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
            ],
            [
                {
                    content: `PAN No: ${item.cmpPanNo}`,
                    colSpan: 2,
                    styles: {
                        fontSize: 8, textColor: 'black', /*valign: 'top',*/
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
                {
                    content: `CIN No: ${item.cmpCinNo}`,
                    colSpan: 2,
                    styles: {
                        fontSize: 8, textColor: 'black', /*valign: 'top',*/
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
                {
                    content: `GSTINO: ${item.cmpGstNo}`,
                    colSpan: 4,
                    styles: {
                        fontSize: 8, textColor: 'black', /*valign: 'top',*/
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                }
            ]
        ];

        const poHeader = [[{
            content: `PURCHASE ORDER - ${item.type === 'J' ? 'JOB WORK' : 'RAW MATERIAL'}`, colSpan: 8, styles: {
                lineWidth: 0,
                textColor: "#000000", // dark text on light background
                fontStyle: "bold",
                fontWeight: "bold",
                fillColor: [200, 210, 255], fontSize: 8,
            },
        }]];

        const address = [
            [
                {
                    content: `To :\nM/s. ${item.toName}\n${item.toAddress}\nPAN No. ${item.panNo}\nGST No. ${item.supGst}`,
                    colSpan: 2,
                    rowSpan: 5,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: `Ship To :\nM/s. ${item.shipAddress}\nPAN No:AAICM4744Q\nGST No:29AAICM4744Q1ZM `,
                    colSpan: 1,
                    rowSpan: 5,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: 'Order No:',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: item.poNo,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue' }
                },
            ],
            [
                {
                    content: 'Ammendment No:',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: item.ammend,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'red' }
                },
            ],
            [
                {
                    content: 'Date :',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: item.date,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue' }
                },
            ],
            [
                // {
                //     content: `Ship To :\nM/s. ${item.shipAddress}`,
                //     colSpan: 3,
                //     rowSpan: 2,
                //     styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                // },
                {
                    content: 'PO Type :',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: item.poType,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'red' }
                },
            ],
            [
                {
                    content: 'Ref No & Date:',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: item.refNoDate,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'red' }
                },
            ],
        ];

        const firstHeaderRow = [[{ content: 'We are pleased to place an order for the following items, subject to the terms & conditions given below', colSpan: 8 }]];

        const secondHeaderRow = [['SI No', `Item Code`, `Item Description`, 'UOM', 'Qty', 'Sch Date', 'Unit Rate', 'Value']];

        const headerRows = [...logoAndAddress,/* ...pan,*/ ...poHeader, ...address, ...firstHeaderRow, ...secondHeaderRow];

        const totalRow = [
            [
                {
                    content: '"Special Instruction: Multiple GST rate not allowed in Single Invoice"',
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 8, textColor: 'red' }
                },
                {
                    content: 'Total',
                    colSpan: 1,
                    styles: { halign: 'center', fontSize: 8, textColor: 'blue' }
                },
                {
                    content: `${item.code} ${Number(item.total || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'center', fontSize: 8, textColor: 'blue' }
                },
            ]
        ];
        const totalWords = [[
            {
                content: 'Total Amount In Words',
                colSpan: 2,
                styles: { halign: 'left', fontSize: 8 }
            },
            {
                content: `INR ${item.amountInWords}`,
                // content: `INR ${parseFloat(item.amountInWords || 0).toFixed(3)}`,
                colSpan: 6,
                styles: { halign: 'left', fontSize: 8, textColor: 'blue', fontStyle: 'normal' }
            }
        ]];

        const termsAndSuppluColumn = [
            [
                {
                    content: 'Terms & Conditions:',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'red' }
                },
                {
                    content: 'Supply Conditions:',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'red' }
                }
            ],
            [
                {
                    content: 'GST :',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: item.gst,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue', fontStyle: 'normal' }
                },
                {
                    content: '* Necessary Test Certificate/ Inspection Reports shall be furnished along with the supplies\n* Subject to Bengaluru Jurisdiction',
                    colSpan: 4,
                    rowSpan: 5,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'Payment Terms :',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: item.paymentTerms,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'Delivery Mode :',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: item.deliveryMode,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'Supply of Matl. :',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: item.supplyOfMaterial,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'Special Instruction 1 :',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: item.specialInstruction1,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue', fontStyle: 'normal' }
                },
            ]
        ]

        const requirements = [
            [
                {
                    content: 'EMS Requirements :',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 7, textColor: 'black' }
                },
                {
                    content: 'OHSAS requirements :',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 7, textColor: 'black' }
                }
            ],
            [
                {
                    content: '* Reduce process scrap\n* Use recycled carton boxes for packing the components\n* Conserve usage of electrical energy\n* Ensure disposal of hazardous waste to authorised Agency\n* Conserve usage of oils and recycle the same to the extent possible',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 7, textColor: 'black', fontStyle: 'normal', valign: 'top', }
                },
                {
                    content: '* All operators should wear relevant PPEs Like Safety shoe,Helmet, Goggles,Handgloves as applicable during working.\n* Ensure necessary material handling equipments/in your facilities\n* Monitor and Evaluate Near Miss Incidents.\n* Ensure Statutory Requirements.',
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 7, textColor: 'black', fontStyle: 'normal', valign: 'top', }
                }
            ]
        ]

        const payment = [[{
            content: '"Payment in 45 days on Mutual consent to MSME Category Suppliers (i.e. Micro & Small Enterprises)Subject to submission of evidence of MSME category andsubject to proper supply, quality clearance and statutory compliances."',
            colSpan: 8,
            styles: { fontStyle: 'normal', fontSize: 7, }
        }]];
        const para = [[{
            content: 'Please send the acknowledgement thru return mail for having accepted this purchase order. In case of no communication within 2days of the receipt of the mail, Purchase order shall be considered as accepted by you.',
            colSpan: 8,
            styles: { fontStyle: 'normal', fontSize: 6, }
        }]];

        const users = [[
            {
                content: `Prepared By / ${item.preparedBy}`,
                colSpan: 2,
                styles: { halign: 'center', fontSize: 7, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: `Reviewed By / ${item.reviewedBy}`,
                colSpan: 3,
                styles: { halign: 'center', fontSize: 7, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: `Approved By / ${item.approvedBy}`,
                colSpan: 3,
                styles: { halign: 'center', fontSize: 7, textColor: 'black', fontStyle: 'normal' }
            }
        ]];

        const note = [[
            {
                content: 'Note',
                colSpan: 1,
                styles: { halign: 'left', fontSize: 7, textColor: 'red', fontStyle: 'bold' }
            },
            {
                content: 'This is computer generated document and is valid without signature',
                colSpan: 7,
                styles: { halign: 'left', fontSize: 7, textColor: 'blue', fontStyle: 'bold' }
            },
        ]];

        const outerTable = [
            [
                {
                    content: 'Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076',
                    colSpan: 8,
                    styles: {
                        halign: 'left', fontSize: 7, textColor: 'black', fontStyle: 'normal', lineWidth: 0,
                        lineWidth: { top: 0.2, right: 0, bottom: 0, left: 0 },
                        lineColor: { top: [0, 0, 0] },
                    }
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

        const bodyRows = [...info, ...totalRow, ...totalWords, ...termsAndSuppluColumn, ...requirements, ...payment, ...para, ...users, ...note]
        const footRows = [...outerTable]

        const sharedColumnStyles = {
            0: { cellWidth: 10 },  // SI No
            1: { cellWidth: 45 },  // Item Code
            2: { cellWidth: 61 },  // Item Description
            3: { cellWidth: 11 },  // UOM
            4: { cellWidth: 12 },  // Qty
            5: { cellWidth: 15 },  // Sch Date
            6: { cellWidth: 15 },  // Unit Rate
            7: { cellWidth: 14 },  // Value
        };

        doc.autoTable({
            theme: 'striped',
            head: headerRows, // Full header only on first page
            body: bodyRows,
            foot: footRows,
            showHead: 'firstPage', // 👈 ensures full header only on first page
            showFoot: 'lastPage',
            // columnStyles: {
            //     // 0: { cellWidth: 7 },
            //     1: { cellWidth: 46 },
            //     2: { cellWidth: 67 },
            // },
            columnStyles: sharedColumnStyles, // ✅ Apply shared styles
            //   startY: 5,                  // instead of 10 or more
            //   margin: { top: 5, bottom: 10 },

            ...tableOptions,
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                halign: 'center',
                valign: 'middle',
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
                font: 'times',
                fontSize: 8,
            },

            bodyStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                halign: 'left',
                valign: 'middle',
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
                fontStyle: 'normal',
                fontSize: 7,
                font: 'times',
                cellWidth: 'wrap',
            },
            footStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                halign: 'center',
                valign: 'middle',
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
                font: 'times',
            },


            didDrawPage: function (data) {
                const pageHeight = doc.internal.pageSize.height;
                const pageWidth = doc.internal.pageSize.width;

                if (data.pageNumber === 1) {
                    doc.addImage(logoUrl, 'PNG', 22, 18, 28, 15);
                    doc.addImage(IsoUrl, 'PNG', 160, 15, 35, 20);
                } else {
                    const headerHeight = 7; // Adjust height of your repeated header
                    // data.settings.margin.top += headerHeight; // ⬅ Push main table content down to prevent overlap

                    doc.autoTable({
                        head: [secondHeaderRow[0]], // just the 1 header row
                        body: [['', '', '', '', '', '', '', '']], // Empty dummy row
                        startY: data.settings.margin.top - headerHeight, // Place at the original top
                        theme: 'plain',
                        styles: {
                            fontSize: 8,
                            halign: 'center',
                            valign: 'middle',
                            lineWidth: 0.1,
                            lineColor: [0, 0, 0],
                            font: 'times',
                            cellWidth: 'wrap',

                        },
                        columnStyles: sharedColumnStyles, // ✅ Apply shared styles
                        //  startY: 5,                  // instead of 10 or more
                        //   margin: { top: 7, bottom: 25 },
                        headStyles: {
                            fillColor: [255, 255, 255],
                            textColor: [0, 0, 0],
                            halign: 'center',
                            valign: 'middle',
                        },

                        didParseCell: function (hookData) {
                            if (hookData.section === 'body') {
                                // ✅ hide content and remove height
                                hookData.cell.text = '';
                                hookData.cell.styles.minCellHeight = 0;
                                hookData.cell.styles.cellPadding = 0;
                                hookData.cell.styles.lineWidth = 0;
                            }
                        },
                        margin: {
                            left: data.settings.margin.left,
                            right: data.settings.margin.right
                        }
                    });
                    // data.cursor.y += headerHeight;

                    // Optional heading
                    doc.setFontSize(9);
                    doc.setFont("times", "bold");
                    doc.setTextColor('blue');
                    doc.text(`Purchase Order No: ${item.poNo}     |     Date: ${item.date}`, 14, 5);

                    // doc.text(`Purchase Order No: ${item.poNo}     |     Date: ${item.date}`, 14, 3);
                }

                // Footer
                doc.setFontSize(8);
                doc.setTextColor(70);
                doc.text('FORMAT NO: IMS-ME-PUR-F-219-Rev-3 Dated 11-01-2019', 14, pageHeight - 10);
                doc.text(`Page ${data.pageNumber} of ${totalPagesExp}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
            },

            didParseCell: function (data) {
                const colIndex = data.column.index;
                const rowIndex = data.row.index;
                const row = data.row.raw;

                if (data.section === 'head') {
                    if (data.column.raw === 'Unit Rate' || data.column.raw === 'Value') {
                        data.cell.styles.halign = 'right';
                    }
                }

                if (data.section === 'body') {
                    data.cell.styles.overflow = 'linebreak';
                    data.cell.styles.fillColor = false;

                    const rightAlignColumns = [3, 4, 5, 6, 7];
                    const dataRowCount = info.length + totalRow.length + totalWords.length;

                    if (rowIndex < dataRowCount && rightAlignColumns.includes(colIndex)) {
                        data.cell.styles.halign = 'right';
                    }

                    if (row?.isInfoRow) {
                        if ([1, 2, 4, 5].includes(colIndex)) {
                            data.cell.styles.textColor = 'blue';
                            data.cell.styles.fontStyle = 'bold';
                        }
                        if (colIndex === 6) {
                            data.cell.styles.textColor = 'red';
                            data.cell.styles.fontStyle = 'bold';
                        }
                        if (colIndex === 7) {
                            data.cell.styles.textColor = 'black';
                            data.cell.styles.fontStyle = 'bold';
                        }
                    }
                }
            }
        });


        // PAGE NUMBER
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp); // This replaces "{totalPages}" in all pages
        }

        // doc.save('PurchaseOrder.pdf');
        const pdfBlob = doc.output('blob');
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfBlobUrl);
    }

    // UNIQUE CODE MANUAL CHANGE
    const handleUniqueCodeChange = (e) => {
        const newUniqueCode = e.target.value;
        const currentYear = uniqueCodeString.split('/')[0]; // Get last 2 digits of the year
        setUniqueCode(newUniqueCode/*.toString().padStart(5,0)*/);
        setUniqueCodeString(`${currentYear}/${selectedPONo}/${newUniqueCode.toString().padStart(5, 0)}`);
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

    const deletehandleSuccessPo = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
            handleClearPage();
        }, 3000);
    };

    const deletehandleExceptionPo = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    };
    const deletehandleSuccessdelete = (dataObject) => {
        const newArray = selectedItems.filter((item) => item.id !== deleteRowId);
        setSelectedItems(newArray);
        calculateTotals(newArray);

        const filteredArray = storeItemIds.filter((item) => item !== deleteRowId);
        setStoreItemIds(filteredArray);

        // optional toast/snackbar
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setOpenDeleteDialog(false);
            // handleClearPage();
        }, 3000);
    };

    const deletehandleExceptiondelete = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    };

    // Utility function to convert date to YYYY-MM-DD format
    const formatDateToYYYYMMDD = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleRefresh = (poGenId) => {

        // Sample API call
        fetch(`/api/your-refresh-endpoint/${poGenId}`)
            .then((res) => res.json())
            .then((data) => {
                // Optionally update state here
            })
            .catch((err) => {
            });
    };
    const handleRefreshIconClick = (item) => {
        const params = {
            supId: supplierId,
            code: item.itemCode,     // pass current item code
            type: selectedPONo
        };

        GetPoItemLists(
            params,
            (response) => handlePoItemSuccess(response, item.itemCode), // pass itemCode to success handler
            handlePoItemException
        );
    };

    // const loadTempSearch = () => {
    //     const raw = localStorage.getItem("poTempSearch");
    //     if (!raw) {
    //         setNotification({
    //             status: true,
    //             type: 'error',
    //             message: 'No previous search found.'
    //         });
    //         return;
    //     }

    //     const temp = JSON.parse(raw);

    //     // Restore items with footer row
    //     setSelectedItems([...temp.items, { id: "RDL1" }]);

    //     // Restore supplier + PO
    //     if (temp.poNo) setSelectedPONo(temp.poNo);
    //     if (temp.supplierId) setSupplierId(temp.supplierId);
    //     if (temp.supplierName) setSupplierName(temp.supplierName);
    //     if (temp.digit) setUniqueCode(temp.digit);        // FIXED
    //     if (temp.id) setUniqueCodeString(temp.id);

    //     setNotification({
    //         status: true,
    //         type: 'success',
    //         message: 'Restored previous searched part numbers.'
    //     });
    // };
    const restoreSpecificTemp = (poNo) => {
        const raw = localStorage.getItem(`poTempSearch_${poNo}`);

        if (!raw) {
            setNotification({ status: true, type: "error", message: "No temp found" });
            return;
        }

        const temp = JSON.parse(raw);

        setSelectedPONo(temp.poNo);
        setSupplierId(temp.supplierId);
        setSupplierName(temp.supplierName);
        setUniqueCode(temp.digit);
        setUniqueCodeString(temp.id);

        setSelectedItems([...temp.items, { id: "RDL1" }]);

        setNotification({
            status: true,
            type: 'success',
            message: `Loaded temp for PO ${poNo}`
        });

        setOpenTempManager(false);
    };
    const deleteSpecificTemp = (poNo) => {
        localStorage.removeItem(`poTempSearch_${poNo}`);
        loadAllTemps();

        setNotification({
            status: true,
            type: "success",
            message: `Deleted temp for PO ${poNo}`
        });
    };


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '10px', marginTop: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    {isPOView || isAuthoriseDocument ? "View Purchase Order" : isEdit ? "Edit Purchase Order" : "New Purchase Order"}
                </Typography>
                <div style={{ width: '250px', marginRight: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {isPOView || isEdit || isAuthoriseDocument ?
                        <div>
                            <Typography style={{ color: Number(poStatus) == 0 ? 'red' : 'green', fontWeight: 'bold', marginRight: '15px' }}>{Number(poStatus) == 0 ? "PENDING" : "APPROVED"}</Typography>
                        </div>
                        :
                        null
                    }
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={generatedPoLists}
                        fullWidth
                        value={selectedGeneratedPo}
                        getOptionLabel={(option) => option.poNo || selectedGeneratedPo}
                        renderInput={(params) => <TextField {...params} label="Search PO" onChange={handlePOChange} />}
                        onChange={(event, value) => handleGeneratedPoSelect(value)}
                        size="small"
                        style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                    />
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <Grid container padding={1}>
                    <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">PO No</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="PO No"
                                        value={selectedPONo}
                                        // disabled={isPOView ? true : false}
                                        onChange={(e) => {
                                            setSelectedItems([{ id: 'RDL1' }]);
                                            setSelectedPONo(e.target.value)
                                            GetPOUniqueID({ po: e.target.value }, handleGetUniqueCodeSuccess, handleGetUniqueCodeException)
                                        }}
                                        size="small"
                                        style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    >
                                        <MenuItem value={'R'}>R</MenuItem>
                                        <MenuItem value={'J'}>J</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    disabled={isPOView ? true : false}
                                    required
                                    value={uniqueCode}
                                    onChange={handleUniqueCodeChange}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    inputProps={{ maxLength: 5 }} // Set max length to 5 characters
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    type='date'
                                    disabled={isPOView ? true : false}
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
                                    disabled={isPOView ? true : false}
                                    required
                                    value={uniqueCodeString}
                                    size="small"
                                    style={{ backgroundColor: "#FFFFFF", borderRadius: "5px" }}
                                />
                                <Tooltip title="Refresh DocNumber">
                                    <span>
                                        {" "}
                                        {/* wrapper to avoid tooltip crash when button is disabled */}
                                        <IconButton
                                            disabled={isPOView || isEdit}
                                            onClick={() => {
                                                if (selectedPONo) {
                                                    GetPOUniqueID(
                                                        { po: selectedPONo },
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

                            <Grid item xs={12} sm={12} md={10} lg={9} xl={9}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={supplierList}
                                    fullWidth
                                    value={supplierName}
                                    getOptionLabel={(option) => option.spCode || supplierName}
                                    renderInput={(params) => <TextField {...params} label="Supplier" onChange={handleChange} />}
                                    onChange={(event, value) => handleSupplierSelect(value)}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    disabled={isPOView && (!deAthorise && !ammendment) || (selectedPONo === '') ? true : false}
                                />
                            </Grid>

                            {selectedPONo === 'J' && supplierName &&
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <Button disabled={!isView || isModuleLocked || !isAuthoriseDocument ? false : true} variant="outlined" style={{ marginTop: '2px', width: '100%' }} onClick={() => setPendingJwModalOpen(true)}>Load Pending DC</Button>
                                </Grid>
                            }

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    id="outlined-multiline-static"
                                    label="Billing Address"
                                    multiline
                                    rows={4} // initial number of rows
                                    rowsMax={8} // maximum number of rows
                                    value={suppAddress}
                                    disabled={isPOView ? true : false}
                                    readOnly={true}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    inputProps={{
                                        style: { height: '65px', fontSize: '13px' }
                                    }}
                                />

                                {!isAuthoriseDocument &&
                                    <>
                                        <Button disabled={isPOView} variant="text" onClick={() => setChangeAddressModalOpen(true)}>Change</Button>
                                    </>
                                }

                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    id="outlined-multiline-static"
                                    label="Shipping Address"
                                    multiline
                                    rows={4} // initial number of rows
                                    rowsMax={8} // maximum number of rows
                                    value={buildAddress}
                                    onChange={(e) => setBuildAddress(e.target.value)}
                                    disabled={isPOView || !changeShippingAddress ? true : false}
                                    readOnly={true}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    inputProps={{
                                        style: { height: '65px', fontSize: '13px' }
                                    }}
                                />

                                {!isAuthoriseDocument &&
                                    <>
                                        <Button disabled={isPOView} variant="text" onClick={() => setChangeShippingAddress(true)}>Change</Button>
                                    </>
                                }
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', borderColor: '#000000', backgroundColor: 'white', borderRadius: '10px' }}>
                                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Qty:</th>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{totalQuantity}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Gross Amount:</th>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>  {Number(totalGrossAmount).toFixed(3)}
                                        </td>
                                    </tr>
                                </table>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid>

                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} style={{ fontSize: '75%' }}>
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '0px', borderRadius: '10px', width: '100%', /*height: '19.7vh',*/ border: '1px solid black' }}>
                            <CardContent style={{ overflow: 'auto', }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6} >
                                        <TextField
                                            fullWidth
                                            onChange={(e) => setRefNo(e.target.value)}
                                            value={refNo}
                                            label='Ref No & Date'
                                            size='small'
                                            disabled={isPOView ? true : false}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6} >
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">PO Type</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={poType}
                                                size='small'
                                                required
                                                label='PO Type'
                                                onChange={(e) => {
                                                    setPOType(e.target.value)
                                                    const updatedSelectedArray = selectedItems.slice(0, -1);
                                                    const updatedArray = updatedSelectedArray.map(obj => (
                                                        {
                                                            ...obj,
                                                            poType: e.target.value
                                                        }))
                                                    updatePoMaxLevel(updatedArray, handleUpdateMaxLevelSuccess, handleUpdateMaxLevelException)
                                                }}
                                                disabled={isPOView ? true : false}
                                            >
                                                <MenuItem value={'REGULAR'}>REGULAR</MenuItem>
                                                <MenuItem value={'OPEN PO'}>OPEN PO</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6} >
                                        <TextField
                                            fullWidth
                                            required
                                            value={department}
                                            label='Department [MST]'
                                            disabled={true}
                                            size='small'
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6} >
                                        <TextField
                                            fullWidth
                                            required
                                            value={currency}
                                            label='Currency[Mst]'
                                            disabled={true}
                                            size='small'
                                        />
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6} >
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Freight Type</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={selectedFreightType}
                                                size='small'
                                                label='Freight Type'
                                                required
                                                onChange={handleFreightTypeChange}
                                                disabled={isPOView ? true : false}
                                            >
                                                <MenuItem value={'PAID'}>PAID</MenuItem>
                                                <MenuItem value={'TO PAY'}>TO PAY</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                background: isModuleLocked ? "gray" : "#002D68",
                                                color: "white",
                                                height: '35px',
                                                width: '250px',
                                            }}
                                            onClick={() => setViewMoreModal(true)}
                                            disabled={isModuleLocked}
                                        >
                                            Additional Details
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: screenHeight - 447, border: '1px solid black', }}>
                            <CardContent style={{ height: '100%', overflow: 'auto' }}>
                                {uploadLoader &&
                                    <Box sx={{ width: '100%', marginBottom: '15px' }}>
                                        <LinearProgress />
                                    </Box>
                                }

                                {!isAuthoriseDocument &&
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                                            {!ammendment && !deAthorise ?
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', columnGap: '10px', rowGap: '10px' }}>
                                                    <Button
                                                        variant="contained"
                                                        sx={getHighlightStyle("new", {
                                                            width: "100%",
                                                            height: "35px",
                                                            backgroundColor: "#002D68",
                                                        })}
                                                        disabled={userPermission[0]?.addData === 0 || isModuleLocked}
                                                        onClick={() => {
                                                            setActiveButton("new");     // 🔥 highlight stays
                                                            handleClearPage();          // your existing logic
                                                        }}
                                                    >
                                                        New
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        sx={getHighlightStyle("edit", {
                                                            width: "100%",
                                                            height: "35px",
                                                            backgroundColor:
                                                                userPermission[0]?.updateData === 0 ||
                                                                    Number(poStatus) === 1 ||
                                                                    isModuleLocked
                                                                    ? "gray"
                                                                    : "#002D68",
                                                            color:
                                                                userPermission[0]?.updateData === 0 ||
                                                                    Number(poStatus) === 1 ||
                                                                    isModuleLocked
                                                                    ? "black"
                                                                    : "white",
                                                        })}
                                                        disabled={userPermission[0]?.updateData === 0 || Number(poStatus) === 1 || isModuleLocked}
                                                        onClick={() => {
                                                            setActiveButton("edit"); // 🔥 highlight
                                                            setIsPoView(false);
                                                            setIsEdit(true);
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>

                                                    <Button
                                                        variant="contained"
                                                        sx={getHighlightStyle("delete", {
                                                            width: "100%",
                                                            height: "35px",
                                                            backgroundColor:
                                                                userPermission[0]?.deleteData === 0 ||
                                                                    Number(poStatus) === 1 ||
                                                                    isModuleLocked
                                                                    ? "gray"
                                                                    : "#002D68",
                                                            color:
                                                                userPermission[0]?.deleteData === 0 ||
                                                                    Number(poStatus) === 1 ||
                                                                    isModuleLocked
                                                                    ? "black"
                                                                    : "white",
                                                        })}
                                                        disabled={
                                                            userPermission[0]?.deleteData === 0 ||
                                                            Number(poStatus) === 1 ||
                                                            isModuleLocked
                                                        }
                                                        onClick={() => {
                                                            setActiveButton("delete"); // 🔥 highlight
                                                            setDeleteDailogOpenPo(true);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>

                                                    <Button
                                                        variant="contained"
                                                        sx={getHighlightStyle("clear", {
                                                            width: "100%",
                                                            height: "35px",
                                                            backgroundColor: isModuleLocked ? "gray" : "#002D68",
                                                        })}
                                                        disabled={isModuleLocked}
                                                        onClick={() => {
                                                            setActiveButton("clear"); // 🔥 highlight
                                                            handleClearPage();
                                                        }}
                                                    >
                                                        Clear
                                                    </Button>

                                                    <Button
                                                        variant="contained"
                                                        sx={getHighlightStyle("print", {
                                                            width: "100%",
                                                            height: "35px",
                                                            backgroundColor:
                                                                userPermission[0]?.print === 0 || isModuleLocked
                                                                    ? "gray"
                                                                    : (isPOView && Number(poStatus) === 1) ||
                                                                        (isEdit && Number(poStatus) === 1)
                                                                        ? "#002D68"
                                                                        : "gray",
                                                            color:
                                                                userPermission[0]?.print === 0 || isModuleLocked
                                                                    ? "black"
                                                                    : (isPOView && Number(poStatus) === 1) ||
                                                                        (isEdit && Number(poStatus) === 1)
                                                                        ? "white"
                                                                        : "black",
                                                        })}
                                                        disabled={
                                                            userPermission[0]?.print === 0 ||
                                                            isModuleLocked ||
                                                            !(
                                                                (isPOView && Number(poStatus) === 1) ||
                                                                (isEdit && Number(poStatus) === 1)
                                                            )
                                                        }
                                                        onClick={() => {
                                                            setActiveButton("print"); // 🔥 highlight
                                                            setPdfModalOpen(true);
                                                            getInvoiceData(uniqueCode);
                                                        }}
                                                    >
                                                        Print
                                                    </Button>


                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            width: "100%",
                                                            height: "35px",
                                                            backgroundColor: "#002D68",
                                                        }}
                                                        onClick={() => {
                                                            setActiveButton("first");          // 🔥 highlight
                                                            handleForwardReverse("first", "");
                                                        }}
                                                    >
                                                        <FastRewindIcon />
                                                    </Button>

                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            width: "100%",
                                                            height: "35px",
                                                            backgroundColor: "#002D68",
                                                        }}
                                                        onClick={() => {
                                                            setActiveButton("prev");           // 🔥 highlight
                                                            handleForwardReverse("reverse", mainId);
                                                        }}
                                                    >
                                                        <SkipPreviousIcon />
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            width: "100%",
                                                            height: "35px",
                                                            backgroundColor: "#002D68",
                                                        }}
                                                        onClick={() => {
                                                            setActiveButton("next");           // 🔥 highlight
                                                            handleForwardReverse("forward", mainId);
                                                        }}
                                                    >
                                                        <SkipNextIcon />
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        sx={{
                                                            width: "100%",
                                                            height: "35px",
                                                            backgroundColor: "#002D68",
                                                        }}
                                                        onClick={() => {
                                                            setActiveButton("last");            // 🔥 highlight
                                                            handleForwardReverse("last", "");
                                                        }}
                                                    >
                                                        <FastForwardIcon />
                                                    </Button>

                                                    {/* <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                                                        <Button variant="outlined" size="small" onClick={saveTempPO}>
                                                            Save Temp PO
                                                        </Button>

                                                        <Button variant="outlined" size="small" onClick={openTempList}>
                                                            Temp Saved List
                                                        </Button>

                                                        <Typography variant="caption" sx={{ ml: 1, color: '#555' }}>
                                                            {tempPOs.length} saved
                                                        </Typography>
                                                    </Box> */}



                                                </div>
                                                :
                                                null
                                            }
                                            <div>
                                                {/* <Button
                                                    variant="outlined"
                                                    size="small"
                                                    style={{ width: "200px", background: "#002D68", color: "white", height: '35px', marginRight: '10px' }}
                                                    onClick={loadTempSearch}
                                                >
                                                    Load Temp
                                                </Button> */}
                                                <Button variant="outlined"
                                                    style={{ width: "200px", background: isModuleLocked ? "gray" : "#002D68", color: "white", height: '35px', marginRight: '10px' }}
                                                    disabled={isModuleLocked}
                                                    size="small" onClick={() => setOpenTempManager(true)}>
                                                    Load From Temp
                                                </Button>

                                                <Button
                                                    variant="contained"
                                                    id="basic-button"
                                                    style={{ width: "200px", background: isModuleLocked ? "gray" : "#002D68", color: "white", height: '35px', }}
                                                    aria-controls={openOption ? 'basic-menu' : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={openOption ? 'true' : undefined}
                                                    onClick={(event) => setAnchorEl(event.currentTarget)}
                                                    endIcon={<ArrowDropDownIcon />} // Add the icon here
                                                    startIcon={<TuneIcon />} // Add the icon here
                                                    disabled={isModuleLocked}
                                                >
                                                    {deAthorise ? 'De-Authorise' : ammendment ? 'Ammendment' : 'Options'}
                                                </Button>
                                                <Menu
                                                    id="basic-menu"
                                                    anchorEl={anchorEl}
                                                    open={openOption}
                                                    onClose={() => setAnchorEl(null)}
                                                    MenuListProps={{
                                                        'aria-labelledby': 'basic-button',
                                                    }}
                                                >
                                                    <MenuItem onClick={() => {
                                                        setAnchorEl(null);
                                                        setDeAuthorise(false);
                                                        setAmmendment(false);
                                                        handleClearPage();
                                                    }}>Local PO</MenuItem>
                                                    <MenuItem onClick={() => {
                                                        setAnchorEl(null);
                                                        setDeAuthorise(true);
                                                        setAmmendment(false);
                                                        setSelectedOption('deauth');
                                                    }}>De-Authorise</MenuItem>
                                                    <MenuItem onClick={() => {
                                                        setAnchorEl(null);
                                                        setAmmendment(true);
                                                        setDeAuthorise(false);
                                                        setSelectedOption('ammend');
                                                        setIsPoView(false);
                                                        setIsEdit(true);
                                                    }}>Ammend PO</MenuItem>
                                                </Menu>
                                            </div>
                                        </div>
                                        {
                                            !isPOView && !ammendment && !deAthorise ? !isView ? (
                                                <div>
                                                    <Button variant="contained" style={{ height: '35px', backgroundColor: isModuleLocked ? "gray" : "#002D68" }}
                                                        disabled={isModuleLocked}
                                                        onClick={handleReplaceAll}>Replace Rest</Button>
                                                    <Button variant="contained" style={{ height: '35px', backgroundColor: isModuleLocked ? "gray" : "#002D68", marginLeft: '10px' }}
                                                        disabled={isModuleLocked}
                                                        onClick={handleTemplateDownload}>Template</Button>
                                                    <Button
                                                        variant="contained"
                                                        component="label"
                                                        htmlFor="upload-photo"
                                                        sx={{ backgroundColor: isModuleLocked ? "gray" : "#002D68", height: '35px', marginLeft: '10px', marginRight: '10px' }}
                                                        disabled={uploadLoader === true || isModuleLocked}
                                                    >
                                                        {/* Upload File */}
                                                        {uploadLoader ? (
                                                            <CircularProgress size={24} style={{ color: 'white' }} />
                                                        ) : 'Upload File'}
                                                    </Button>
                                                    <input
                                                        id="upload-photo"
                                                        type="file"
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files.length > 0) {
                                                                const reader = new FileReader();
                                                                reader.onload = () => {
                                                                    if (reader.readyState === 2) {
                                                                        setUploadLoader(true)
                                                                        setSelectedItems([]);
                                                                        PurchaseOrderXLUpload({
                                                                            file: reader.result,
                                                                            supplierId: supplierId,
                                                                            type: selectedPONo
                                                                        }, handleItemImportSucess, handleItemImportException);
                                                                    }
                                                                };
                                                                reader.readAsDataURL(e.target.files[0]);
                                                                // Reset the input value to allow re-uploading the same file
                                                                e.target.value = '';
                                                            }
                                                        }}

                                                    />
                                                    <Button disabled={loading === true || isModuleLocked} variant="contained" type='submit' style={{ height: '35px', backgroundColor: isModuleLocked ? 'gray' : '#002D68' }}>
                                                        {/* {isEdit ? "UPDATE" : "SAVE"} */}
                                                        {loading ? (
                                                            <CircularProgress size={24} style={{ color: 'white' }} />
                                                        ) : (isEdit ? "UPDATE" : "SAVE")}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div style={{ display: 'flex', gap: '5px' }}>
                                                        <Button
                                                            variant="contained"
                                                            type='submit'
                                                            style={{ flex: 1, height: '48px', backgroundColor: isModuleLocked ? "gray" : '#4CAF50' }}
                                                            onClick={(event) => {
                                                                setDeleteDailogOpen(true);
                                                            }}
                                                            disabled={isModuleLocked}
                                                        >Approve</Button>
                                                        <Button
                                                            variant="contained"
                                                            type='submit'
                                                            style={{ flex: 1, height: '48px', backgroundColor: isModuleLocked ? "gray" : '#ED2939' }}
                                                            onClick={(event) => {
                                                                setRejectDailogOpen(true);
                                                            }}
                                                            disabled={isModuleLocked}
                                                        >Reject</Button>
                                                    </div>
                                                </>
                                            )
                                                : null
                                        }
                                        {(ammendment || deAthorise) &&
                                            <div>
                                                <Button disabled={loading === true} onClick={handleAmendOrDeAuth} variant="contained" style={{ height: '35px', backgroundColor: '#002D68' }}>
                                                    {/* SAVE */}
                                                    {loading ? (
                                                        <CircularProgress size={24} style={{ color: 'white' }} />
                                                    ) : 'SAVE'}
                                                </Button>
                                            </div>
                                        }
                                    </div>
                                }

                                <table id="transactionTable">
                                    <tr style={{ position: 'sticky', top: '-17px', backgroundColor: '#f9f9f9', zIndex: 1 }}>
                                        <th style={{ whiteSpace: 'nowrap' }}>Part No</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Part Name</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>UOM</th>
                                        {/* Conditionally render ShortClosed and Rcvd Qty */}
                                        {ammendment && (
                                            <>
                                                <th style={{ whiteSpace: 'nowrap' }}>Short Closed</th>
                                                <th style={{ whiteSpace: 'nowrap' }}>Rcvd Qty</th>
                                            </>
                                        )}
                                        <th style={{ whiteSpace: 'nowrap' }}>Suuplier Desc</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Total Stock</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Pending PO Qty</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Pending JW Qty</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Max Qty Level</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>PO Qty</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Sch Date</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Rate</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Amt</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Actions</th>
                                    </tr>
                                    {selectedItems.map((item, index) => (
                                        <tr key={index}>
                                            <td style={{ whiteSpace: 'nowrap' }}
                                                contentEditable={false}
                                                onDoubleClick={() => {
                                                    if (isEdit) {
                                                        setDoubleClickIndex(index);
                                                        setEditedRowPoGenId(item.poGenId);
                                                    }
                                                }}
                                            >
                                                {doubleClickIndex === index ? (
                                                    item.rcvdQty > 0 ?
                                                        <span>{item?.itemCode}</span>
                                                        :
                                                        <Autocomplete
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            options={supplierItemList}
                                                            getOptionLabel={(option) => `𝐈𝐭𝐞𝐦 𝐂𝐨𝐝𝐞: ${option?.itemCode} | 𝐑𝐚𝐭𝐞: ₹${option.rate} | 𝐒𝐮𝐩𝐩 𝐃𝐞𝐬𝐜: ${option.suppDesc}` || ''}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField
                                                                {...params}
                                                                label="Search Items"
                                                                onChange={handleItemChange}
                                                                onBlur={() => setDoubleClickIndex(null)}
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
                                                            />}
                                                            onChange={(event, value) => handleSupplierItemEdit(value)}
                                                            size='small'
                                                            PopperComponent={CustomPopper}
                                                        />
                                                ) : (
                                                    item?.itemCode ?
                                                        <span>{item?.itemCode}</span>
                                                        :
                                                        <Autocomplete
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            options={supplierItemList}
                                                            getOptionLabel={(option) => `𝐈𝐭𝐞𝐦 𝐂𝐨𝐝𝐞: ${option?.itemCode} | 𝐑𝐚𝐭𝐞: ₹${option.rate} | 𝐒𝐮𝐩𝐩 𝐃𝐞𝐬𝐜: ${option.suppDesc}` || ''}
                                                            sx={{ width: 300 }}
                                                            renderInput={(params) => <TextField
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
                                                            />}
                                                            onChange={(event, value) => handleSupplierItemChange(value)}
                                                            size='small'
                                                            disabled={isPOView && !ammendment && !deAthorise}
                                                            PopperComponent={CustomPopper}
                                                        />
                                                )}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.itemName}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.uom}</td>
                                            {ammendment && (
                                                <>
                                                    <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.dflag === 1 ? 'Y' : 'N'}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.rcvdQty}</td>
                                                </>
                                            )}
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={!isPOView} onBlur={(e) => handleEdit('suppDesc', e.target.textContent, item.id, item, item.uniqueFId)}>{item.suppDesc}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} onDoubleClick={() => handleCellClick("totStk", item)}>{Number(item.totStk || 0).toFixed(3)}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} onDoubleClick={() => handleCellClick("pendingPo", item)}>{Number(item.pendingPo || 0).toFixed(3)}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} onDoubleClick={() => handleCellClick("pendingJwQty", item)}>{Number(item.jwQty || 0).toFixed(3)}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.maxLvl}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={!isPOView} onClick={() => handleCellReplaceClick("replacePOQTY", item)} onBlur={(e) => handleEdit('POQTY', e.target.textContent, item.id, item, item.uniqueFId)}>{Number(item.poQty || 0).toFixed(3)}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} onClick={() => handleCellReplaceClick("replaceSCHDATE", item)}>
                                                {item.id === 'RDL1' ?
                                                    null
                                                    :
                                                    <TextField
                                                        value={item.schDate}
                                                        type='date'
                                                        placeholder='Sch Date'
                                                        disabled={isPOView ? true : false}
                                                        required
                                                        size='small'
                                                        onChange={(e) => handleEdit('SCHDATE', e.target.value, item.id, item, item.uniqueFId)}
                                                        min={formatDateToYYYYMMDD(selectedDate)} // Convert selectedDate to YYYY-MM-DD format
                                                        inputProps={{
                                                            min: formatDateToYYYYMMDD(selectedDate), // Convert selectedDate to YYYY-MM-DD format
                                                            sx: {
                                                                height: "15px",
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
                                                }
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} onDoubleClick={() => handleCellClick("rate", item)}>{Number(item.rate || 0).toFixed(3)}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{Number(item.amt || 0).toFixed(3)}</td>

                                            {/* <td contentEditable={false} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                {item.id !== 'RDL1' && (
                                                    <>
                                                        {!isPOView ? (
                                                            <>
                                                                <DeleteIcon
                                                                    onClick={() => handleDeleteRow(item.id)}
                                                                    style={{ color: 'black', cursor: 'pointer', marginRight: '8px' }}
                                                                />
                                                                <IconButton
                                                                    // onClick={() => handleRefresh(item.poGenId)}
                                                                    onClick={() => handleRefreshIconClick(item)}

                                                                    disabled={item.rcvdQty > 0}
                                                                    style={{ color: item.rcvdQty > 0 ? 'gray' : 'blue' }}
                                                                    size="small"
                                                                >
                                                                    <RefreshIcon fontSize="small" />
                                                                </IconButton>
                                                            </>
                                                        ) : (
                                                            <>
                                                            
                                                                <DeleteIcon style={{ color: 'gray', cursor: 'not-allowed', marginRight: '8px' }} />
                                                                <IconButton
                                                                    disabled
                                                                    style={{ color: 'gray' }}
                                                                    size="small"
                                                                >
                                                                    <RefreshIcon fontSize="small" />
                                                                </IconButton>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </td> */}
                                            <td contentEditable={false} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                {item.id !== 'RDL1' && (
                                                    <>
                                                        {/* Show active icons only when NOT in PO View and NOT in Ammendment mode */}
                                                        {/* Case 1: Normal Edit (not PO View) → use dialog */}
                                                        {!isPOView && !isNewMode && (
                                                            <>
                                                                <DeleteIcon
                                                                    onClick={() => {
                                                                        if (item.rcvdQty <= 0) {
                                                                            setDeleteRowId(item.id);
                                                                            setOpenDeleteDialog(true); // open confirmation dialog
                                                                        }
                                                                    }}
                                                                    disabled={item.rcvdQty > 0}
                                                                    style={{
                                                                        color: item.rcvdQty > 0 ? "gray" : "black",
                                                                        cursor: item.rcvdQty > 0 ? "not-allowed" : "pointer",
                                                                        marginRight: "8px"
                                                                    }}
                                                                />

                                                                <IconButton
                                                                    onClick={() => handleRefreshIconClick(item)}
                                                                    disabled={item.rcvdQty > 0}
                                                                    style={{ color: item.rcvdQty > 0 ? "gray" : "blue" }}
                                                                    size="small"
                                                                >
                                                                    <RefreshIcon fontSize="small" />
                                                                </IconButton>
                                                            </>
                                                        )}

                                                        {/* Case 2: New Mode → delete directly (no dialog) */}
                                                        {isNewMode && (
                                                            <>
                                                                <DeleteIcon
                                                                    onClick={() => {
                                                                        handleDeleteRow(item.id); // directly delete row

                                                                    }}
                                                                    disabled={item.rcvdQty > 0}
                                                                    style={{
                                                                        color: item.rcvdQty > 0 ? "gray" : "black",
                                                                        cursor: item.rcvdQty > 0 ? "not-allowed" : "pointer",
                                                                        marginRight: "8px"
                                                                    }}
                                                                />

                                                                <IconButton
                                                                    onClick={() => handleRefreshIconClick(item)}
                                                                    disabled={item.rcvdQty > 0}
                                                                    style={{ color: item.rcvdQty > 0 ? "gray" : "blue" }}
                                                                    size="small"
                                                                >
                                                                    <RefreshIcon fontSize="small" />
                                                                </IconButton>
                                                            </>
                                                        )}

                                                        {/* Case 3: PO View (and not new mode) → disable icons */}
                                                        {isPOView && !isNewMode && (
                                                            <>
                                                                <DeleteIcon style={{ color: "gray", cursor: "not-allowed", marginRight: "8px" }} />
                                                                <IconButton disabled style={{ color: "gray" }} size="small">
                                                                    <RefreshIcon fontSize="small" />
                                                                </IconButton>
                                                            </>
                                                        )}

                                                    </>
                                                )}
                                            </td>

                                        </tr>))}
                                </table>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Dialog open={viewMoreModal} onClose={() => setViewMoreModal(false)} maxWidth="xl" fullWidth>
                    <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>Purchase Order</DialogTitle>

                    <DialogContent style={{ padding: '2px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', columnGap: '10px', padding: '10px' }}>
                            <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#6895D2', color: '#ffffff' }}>Footer</th>
                                    </tr>
                                    <tr>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Field</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Value</th>
                                    </tr>
                                </thead>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Payment Terms</th>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            required
                                            value={ptf}
                                            size='small'
                                            disabled={isPOView ? true : false}
                                        />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>GST</th>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {isPOView ?
                                            <TextField
                                                fullWidth
                                                value={gref}
                                                size='small'
                                                disabled={isPOView ? true : false}
                                            /> :
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={fieldSuggetionsGroup && fieldSuggetionsGroup?.gst}
                                                sx={{ width: '100%' }}
                                                getOptionLabel={(option) => option.gst || ''}
                                                renderInput={(params) => <TextField {...params} label={gref} onChange={(e) => setGref(e.target.value)} />}
                                                onChange={(event, value) => handleGstRefChange(value)}
                                                size='small'
                                                disabled={isPOView ? true : false}
                                            />
                                        }
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Delivery Mode</th>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <FormControl fullWidth>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={deliveryMode}
                                                onChange={(e) => setDeliveryMode(e.target.value)}
                                                size='small'
                                                disabled={isPOView ? true : false}
                                            >
                                                <MenuItem value={'BY ROAD'}>BY ROAD</MenuItem>
                                                <MenuItem value={'BY AIR'}>BY AIR</MenuItem>
                                                <MenuItem value={'BY SEA'}>BY SEA</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Supply of Mtrl</th>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={supplyOfMaterial}
                                            disabled={true}
                                            size='small'
                                        />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'normal' }}>Spl Instruction 1</th>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {isPOView ?
                                            <TextField
                                                fullWidth
                                                value={sir}
                                                size='small'
                                                disabled={isPOView ? true : false}
                                            /> :
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={fieldSuggetionsGroup && fieldSuggetionsGroup?.splInstr1}
                                                sx={{ width: '100%' }}
                                                getOptionLabel={(option) => option.splInstr1 || ''}
                                                renderInput={(params) => <TextField {...params} label={sir} onChange={(e) => setSir(e.target.value)} />}
                                                onChange={(event, value) => handleSpeclInstr1Change(value)}
                                                size='small'
                                                disabled={isPOView ? true : false}
                                            />
                                        }
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Specification</th>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {isPOView ?
                                            <TextField
                                                fullWidth
                                                value={sr}
                                                size='small'
                                                disabled={isPOView ? true : false}
                                            />
                                            :
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={fieldSuggetionsGroup && fieldSuggetionsGroup?.specification}
                                                sx={{ width: '100%' }}
                                                getOptionLabel={(option) => option.specification || ''}
                                                renderInput={(params) => <TextField {...params} label={sr} onChange={(e) => setSr(e.target.value)} />}
                                                onChange={(event, value) => handleSpecificationChange(value)}
                                                size='small'
                                                disabled={isPOView ? true : false}
                                            />
                                        }
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Prepared By</th>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            disabled={true}
                                            value={pbr}
                                            onChange={(e) => setPbr(e.target.value)}
                                            size='small'
                                        />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'normal' }}>Caption Details</th>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {isPOView ?
                                            <TextField
                                                fullWidth
                                                value={cdr}
                                                size='small'
                                                disabled={isPOView ? true : false}
                                            />
                                            :
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={fieldSuggetionsGroup && fieldSuggetionsGroup?.caption}
                                                sx={{ width: '100%' }}
                                                getOptionLabel={(option) => option.caption || ''}
                                                renderInput={(params) => <TextField {...params} label={cdr} onChange={(e) => setCdr(e.target.value)} />}
                                                onChange={(event, value) => handleCaptionChange(value)}
                                                size='small'
                                                disabled={isPOView ? true : false}
                                            />
                                        }
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Amount In Words</th>
                                    <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', flexDirection: 'row' }}>
                                        {/* <TextField
                                            fullWidth
                                            required
                                            value={`${currencyCode}: ${numberToWords(Number(totalGrossAmount))}`}
                                            size='small'
                                            disabled={isPOView ? true : false}
                                        /> */}
                                        <TextField
                                            fullWidth
                                            required
                                            // value={`${currencyCode}: ${numberToWordsWithDecimal(totalGrossAmount)}`}
                                            value={`${currencyCode}: ${numberToWordsWithDecimal(Number(totalGrossAmount).toFixed(3))}`}
                                            size='small'
                                            disabled={isPOView}
                                        />
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setViewMoreModal(false)}>Update</Button>
                    </DialogActions>
                </Dialog>


            </form>
            {/* MODALS COMPONENTS */}
            <CellClickModal
                cellModalOpen={cellModalOpen}
                setCellModalOpen={setCellModalOpen}
                cellClickParams={cellClickParams}
                selectedCellName={selectedCellName}
            />
            <ChangeAddressModal
                changeAddressModalOpen={changeAddressModalOpen}
                setChangeAddressModalOpen={setChangeAddressModalOpen}
                setSuppAddress={setSuppAddress}
                supplierSid={supplierSid}
            />
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <ApprovalConfirmation
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={rowId}
                deleteService={poApproval}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />

            <RejectConfirmation
                open={rejectDailogOpen}
                setOpen={setRejectDailogOpen}
                deleteId={rowId}
                deleteService={poApproval}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />

            <LoadPendingJw
                pendingPOModalOpen={pendingJwModalOpen}
                setPendingPOModalOpen={setPendingJwModalOpen}
                supplierId={supplierId}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                calculateTotals={calculateTotals}
            />

            <DeleteConfirmationDailog
                open={deleteDailogOpenPo}
                setOpen={setDeleteDailogOpenPo}
                deleteId={{ id: uniqueCode, prefix: selectedPONo }}
                // selectedMaster={selectedMaster}
                deleteService={deleteGeneratedPO}
                handleSuccess={deletehandleSuccessPo}
                handleException={deletehandleExceptionPo}
            />
            <DeleteConfirmationDailog
                open={openDeleteDialog}
                setOpen={setOpenDeleteDialog}
                deleteId={{ id: deleteRowId, prefix: selectedPONo }}   // id of row + PO type
                deleteService={deleteAmendment}                        // <-- service to call
                handleSuccess={deletehandleSuccessdelete}                  // success callback
                handleException={deletehandleExceptiondelete}              // error callback
            />


            <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
                <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>Purchase Order</DialogTitle>

                <DialogContent style={{ padding: '2px' }}>
                    {pdfUrl &&
                        <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
                    }
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setPdfModalOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openTempManager} onClose={() => setOpenTempManager(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Temporary Saved POs</DialogTitle>

                <DialogContent>
                    {tempList.length === 0 && (
                        <p>No Temp PO saved.</p>
                    )}

                    {tempList.map((temp) => (
                        <div
                            key={temp.key}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px 0",
                                borderBottom: "1px solid #ccc"
                            }}
                        >
                            <div>
                                <b>PO No:</b> {temp.poNo}<br />
                                <b>Supplier:</b> {temp.supplierName}<br />
                                <b>Items:</b> {temp.items}<br />
                                <small>{new Date(temp.createdAt).toLocaleString()}</small>
                            </div>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => restoreSpecificTemp(temp.poNo)}
                                >
                                    Load
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => deleteSpecificTemp(temp.poNo)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenTempManager(false)}>Close</Button>
                </DialogActions>
            </Dialog>


        </div>
    )
}

export default PurchaseOrderGenerationModule;