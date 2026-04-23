import React, { useEffect, useState, useRef } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { CheckBox } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from '@mui/material/Autocomplete';
// import ChangeAddressModal from './ChangeAddressModal/ChangeAddressModal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import LoadPendingSfg from './LoadPendingSfg/LoadPendingSfg';
import LoadPendingJWISS from './SelectedItemsModal/LoadPendingJWISS';
import {
    poApproval,
    GetJobWorkIssueUniqueID,
    GetJobWorkIssueSupplierItemList,
    GenerateJobWorkIssueDC,
    GetDelNoteDetails,
    GetWithoutPoSuppList,
    GetJobWorkReceiptUniqueID,
    GenerateJobWorkReceipt
} from '../../ApiService/LoginPageService'
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment, setRef,
} from '@mui/material';

const JobworkReceiptModule = ({ editeData }) => {

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [supplierList, setSupplierList] = useState([]);
    const [supplierName, setSupplierName] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [suppAddress, setSuppAddress] = useState('');
    const [currency, setCurrency] = useState('');
    const [currencyId, setCurrencyId] = useState('');
    const [department, setDepartment] = useState('');
    const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
    const [supplierSid, setSupplierSid] = useState('');
    const [totalQuantity, setTotalQuantity] = useState('');
    const [totalGrossAmount, setTotalGrossAmount] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [DCNumber, setDCNumber] = useState('');
    const [sequentialNumber, setSequentialNumber] = useState('');
    const [challanNo, setChallanNo] = useState('');
    const [challanDate, setChallanDate] = useState('');
    const [modeOfTransport, setModeOfTransport] = useState('');
    const [vehicleNo, setVehicleNo] = useState('');
    const [consigneeName, setConsigneeName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [address3, setAddress3] = useState('');
    const [address4, setAddress4] = useState('');
    const [panNo, setPanNo] = useState('');
    const [gstNo, setGSTNo] = useState('');
    const [typeOfGoods, setTypeOfGoods] = useState('');
    const [docType, setDocType] = useState('');
    const [subSupplyType, setSubSupplyType] = useState('');
    const [subSupplyDesc, setSubSupplyDesc] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [modeOfType, setModeOfType] = useState('');
    const [docketNo, setDocketNo] = useState('');
    const [transportDate, setTransportDate] = useState('');
    const [transportMst, setTransportMst] = useState('');
    const [transportGSTIN, setTransportGSTIN] = useState('');
    const [distanceKMS, setDistanceKMS] = useState('');
    const [shippingPinCode, setShippingPinCode] = useState('');
    const [toStateCode, setToStateCode] = useState('');
    const [actualToState, setActualToState] = useState('');
    const [stockAffect, setStockAffect] = useState('');
    const [ewayBillRequired, setEwayBillRequired] = useState('');
    const [cgst, setCGST] = useState('');
    const [cgstPercent, setCGSTPercent] = useState('');
    const [sgst, setSGST] = useState('');
    const [sgstPercent, setSGSTPercent] = useState('');
    const [igst, setIGST] = useState('');
    const [igstPercent, setIGSTPercent] = useState('');
    const [totalValue, setTotalValue] = useState('');
    const [remarks, setRemarks] = useState('');
    const [suppId, setSuppId] = useState('');
    const [loadPendingSfg, setLoadPendingSfg] = useState(false);
    const [supplierSelect, setSupplierSelect] = useState('');

    const [invoiceDate, setInvoiceDate] = useState("");
    const [invoiceNo, setInvoiceNo] = useState("");
    const [dcNo, setDcNo] = useState("");
    const [dcDate, setDcDate] = useState("");
    // const location = useLocation();

    // const queryParams = new URLSearchParams(location.search);

    // const mode = queryParams.get('mode');
    // const viewDC = queryParams.get('viewDC');
    // const delRowId = queryParams.get('delRowId');

    // // Get both supplier IDs
    // const withPOSupplierId = queryParams.get('withPOSupplierId');
    // const WithoutsupplierId = queryParams.get('withoutPOSupplierId');

    // // If you still need one common `supplierId` variable based on mode
    // const supplierId = mode === 'withPO' ? withPOSupplierId : WithoutsupplierId;

    // // Get other shared params
    // const selectedSuppName = queryParams.get('selectedSuppName');
    // const selectedSpAddress = queryParams.get('selectedSpAddress');
    // const supplierInvoiceNoCopy = queryParams.get('supplierInvoiceNoCopy');
    // const supplierInvoiceDateCopy = queryParams.get('supplierInvoiceDateCopy');
    // const cSupplierDcNoCopy = queryParams.get('cSupplierDcNoCopy');
    // const supplierDcDateCopy = queryParams.get('supplierDcDateCopy');

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // Mode and IDs
    const mode = queryParams.get("mode");
    const viewDC = queryParams.get('viewDC');
    const delRowId = queryParams.get('delRowId');
    //   const withPOSupplierId = queryParams.get("withPOSupplierId");
    // //   const withoutPOSupplierId = queryParams.get("withoutPOSupplierId");
    // const withoutPOSupplierId = queryParams.get("withoutPOSupplierId");
    //   const supplierId = mode === "withPO" ? withPOSupplierId : withoutPOSupplierId;

    //   // Other shared params
    //   const selectedSuppName = queryParams.get("selectedSuppName");
    //   const selectedSpAddress = queryParams.get("selectedSpAddress");
    //   const supplierInvoiceNoCopy = queryParams.get("supplierInvoiceNoCopy");
    //   const supplierInvoiceDateCopy = queryParams.get("supplierInvoiceDateCopy");
    //   const cSupplierDcNoCopy = queryParams.get("cSupplierDcNoCopy");
    //   const supplierDcDateCopy = queryParams.get("supplierDcDateCopy");
    const withPOSupplierId = queryParams.get("withPOSupplierId");
    // const withoutPOSupplierId = queryParams.get("withoutPOSupplierId");
    const withoutPOSupplierId = queryParams.get("withoutPOSupplierId"); // ✅

    const supplierId = mode === "withPO" ? withPOSupplierId : withoutPOSupplierId;

    // Other shared params
    const selectedSuppName = queryParams.get("selectedSuppName") || "";
    const selectedSpAddress = queryParams.get("selectedSpAddress") || "";
    const supplierInvoiceNoCopy = queryParams.get("supplierInvoiceNoCopy") || "";
    const supplierInvoiceDateCopy = queryParams.get("supplierInvoiceDateCopy") || "";
    const cSupplierDcNoCopy = queryParams.get("cSupplierDcNoCopy") || "";
    const supplierDcDateCopy = queryParams.get("supplierDcDateCopy") || "";

    console.log({
        mode,
        supplierId,
        selectedSuppName,
        selectedSpAddress,
        supplierInvoiceNoCopy,
        supplierInvoiceDateCopy,
        cSupplierDcNoCopy,
        supplierDcDateCopy,
    });


    useEffect(() => {
        setInvoiceDate(formatDate(supplierInvoiceDateCopy));
        setDcNo(cSupplierDcNoCopy || "");
        setInvoiceNo(supplierInvoiceNoCopy || "");
        setDcDate(formatDate(supplierDcDateCopy));
    }, [supplierInvoiceDateCopy, cSupplierDcNoCopy, supplierInvoiceNoCopy, supplierDcDateCopy]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";

        // If already in YYYY-MM-DD format, just return it
        if (typeof dateStr === "string" && dateStr.includes("-")) {
            const parts = dateStr.split("-");
            if (parts[0].length === 4) {
                // Already YYYY-MM-DD
                return dateStr;
            }
            if (parts.length === 3) {
                // Convert DD-MM-YYYY → YYYY-MM-DD
                const [day, month, year] = parts;
                return `${year}-${month}-${day}`;
            }
        }

        // If it's a Date object
        if (dateStr instanceof Date) {
            return dateStr.toISOString().slice(0, 10); // YYYY-MM-DD
        }

        return "";
    };

    useEffect(() => {
        // !viewDC && GetJobWorkIssueUniqueID(handleUniqueCodeSuccess, handleUniqueCodeException);
        GetJobWorkReceiptUniqueID(handleUniqueCodeSuccess, handleUniqueCodeException);
        delRowId && GetDelNoteDetails({ id: delRowId }, handleDelNoteDetailsSuccess, handleDelNoteDetailsException);

    }, [viewDC]);

    //UNIQUE CODE API HANDLER
    const handleUniqueCodeSuccess = (dataObject) => {
        setDCNumber(dataObject?.data?.jwrNo);
        setSequentialNumber(dataObject?.data?.sequentialNumber);
    }
    const handleUniqueCodeException = () => { }

    //DEL_NOTE DETAILS API HANDLER
    const handleDelNoteDetailsSuccess = (dataObject) => {
        //SUPPLIER LIST
        setSuppAddress(dataObject?.supplier?.spAddress || '');
        setCurrency(dataObject?.supplier?.currency || '');
        setCurrencyId(dataObject?.supplier?.currencyId || '');
        setSupplierName(dataObject?.supplier?.spName || '');
        setDepartment(dataObject?.supplier?.department || '');
        setSupplierSid(dataObject?.supplier?.sId || '');
        setSuppId(dataObject?.supplier?.id || '');
        setGSTNo(dataObject?.supplier?.gstNo || '');
        setPanNo(dataObject?.supplier?.panNo || '');
        setSupplierSelect(dataObject?.supplier?.spName || '');
        // Jobwork Details
        setDCNumber(dataObject?.jobWork?.dcNo || '')
        setSequentialNumber(dataObject?.jobWork?.sequentialNumber || '')
        setChallanNo(dataObject?.jobWork?.challanNo || '')
        setChallanDate(dataObject?.jobWork?.challanDate || '')
        setModeOfTransport(dataObject?.jobWork?.modeOfTransport || '')
        setVehicleNo(dataObject?.jobWork?.vehicleNo || '')
        setConsigneeName(dataObject?.jobWork?.consigneeName || '')
        setTypeOfGoods(dataObject?.jobWork?.typeOfGoods || '')
        setDocType(dataObject?.jobWork?.docType || '')
        setSubSupplyType(dataObject?.jobWork?.subSupplyType || '')
        setSubSupplyDesc(dataObject?.jobWork?.subSupplyDesc || '')
        setTransactionType(dataObject?.jobWork?.transactionType || '')
        setModeOfType(dataObject?.jobWork?.modeOfType || '')
        setDocketNo(dataObject?.jobWork?.docketNo || '')
        setTransportDate(dataObject?.jobWork?.transportDate || '')
        setTransportMst(dataObject?.jobWork?.transportMst || '')
        setTransportGSTIN(dataObject?.jobWork?.transportGSTIN || '')
        setDistanceKMS(dataObject?.jobWork?.distanceKMS || '')
        setShippingPinCode(dataObject?.jobWork?.shippingPinCode || '')
        setToStateCode(dataObject?.jobWork?.toStateCode || '')
        setActualToState(dataObject?.jobWork?.actualToState || '')
        setStockAffect(dataObject?.jobWork?.stockAffect || '')
        setEwayBillRequired(dataObject?.jobWork?.ewayBillReq || '')
        setTotalQuantity(dataObject?.jobWork?.totalQty || '')
        setTotalGrossAmount(dataObject?.jobWork?.totalGrossAmt || '')
        setCGSTPercent(dataObject?.jobWork?.cgstPercent || '')
        setCGST(dataObject?.jobWork?.cgst || '')
        setSGSTPercent(dataObject?.jobWork?.sgstPercent || '')
        setSGST(dataObject?.jobWork?.sgst || '')
        setIGSTPercent(dataObject?.jobWork?.igstPercent || '')
        setIGST(dataObject?.jobWork?.igst || '')
        setTotalValue(dataObject?.jobWork?.totalValue || '')
        setRemarks(dataObject?.jobWork?.remarks || '')
        setSelectedDate(dataObject?.jobWork?.created_at || '')
        //ITEMLIST
        setVehicleNo(dataObject?.itemsList[0]?.vehicleNo || '')
        setSelectedItems(dataObject.itemsList || []);
    }

    const handleDelNoteDetailsException = () => { }

    const ClearData = () => {
        setSupplierSid('');
        setChallanNo('');
        setChallanDate('');
        setModeOfTransport('');
        setVehicleNo('');
        setConsigneeName('');
        setSuppAddress('');
        setPanNo('');
        setGSTNo('');
        setTypeOfGoods('');
        setDocType('');
        setSubSupplyType('');
        setSubSupplyDesc('');
        setTransactionType('');
        setModeOfType('');
        setDocketNo('');
        setTransportDate('');
        setTransportMst('');
        setTransportGSTIN('');
        setDistanceKMS('');
        setShippingPinCode('');
        setToStateCode('');
        setActualToState('');
        setStockAffect('');
        setEwayBillRequired('');
        setTotalQuantity('');
        setTotalGrossAmount('');
        setCGSTPercent('');
        setCGST('');
        setSGSTPercent('');
        setSGST('');
        setIGSTPercent('');
        setIGST('');
        setTotalValue('');
        setRemarks('');
        setSelectedItems([]);

        setTimeout(() => {
            GetJobWorkIssueUniqueID(handleUniqueCodeSuccess, handleUniqueCodeException);
        }, 2000);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if any item has an empty cumQty
        const hasEmptyRcvQty = selectedItems.some((item) => !item.recievedQty);

        if (hasEmptyRcvQty) {
            // alert("Cum qty cannot be empty.");
            setNotification({
                status: true,
                type: 'error',
                message: 'Received Quantity cannot be empty.',
            });
            return; // Stop form submission if any cumQty is empty
        }

        const updatedArray = selectedItems.map((item) => ({ "id": item.id, "itemId": item.itemId, "jwiQty": item.Qty, "cumQty": item.cumQty, "pendQty": item.pendingQty, "jwrQty": item.recievedQty }))
        GenerateJobWorkReceipt({
            itemsList: updatedArray,
            jwrNo: DCNumber,
            supplierId: supplierId,
            invoiceNo: supplierInvoiceNoCopy,
            invoiceDate: supplierInvoiceDateCopy,
            dcNo: cSupplierDcNoCopy,
            dcDate: supplierDcDateCopy,
            totQty: totalQuantity,
        }, handleSuccess, handleException);
    };

    const handleSuccess = (dataObject) => {

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            GetJobWorkReceiptUniqueID(handleUniqueCodeSuccess, handleUniqueCodeException);
            console.log("the dataObject ", dataObject);
            if (mode === "withPO") {
                navigate("/PurchaseBillAgainstPOModule");
            } else if (mode === "withoutPO") {
                navigate("/PurchaseBillWithoutPOModule");
            }
            ClearData();
            handleClose();
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

    //MIDDLE GRID
    const middleGridColumns = [
        {
            field: 'jcNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Jobcard No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Name</span>,
            type: 'number',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'dcNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>JWISSNO</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>JWISSQTY</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'cumQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cum Qty</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'pendingQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Pend Qty</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'recievedQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>JWR Qty</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: true
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remark</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];

    const handleDeleteRow = (id) => {
        console.log("selectedItemsselectedItems", selectedItems)
        console.log("ididididididididididididid", id)
        const newArray = selectedItems.filter((item) => item.id != id)
        setSelectedItems(newArray);
        // TO MINUS THE AMOUNT IN TOTAL_GRID
        calculateTotals(newArray)
        console.log("selectedItemsselectedItems", selectedItems)
    }

    function DeleteData(props) {
        return (
            viewDC ?
                <DeleteIcon
                    style={{ color: '#dddddd' }}
                />
                :
                <DeleteIcon
                    onClick={() => {
                        handleDeleteRow(props.selectedRow.id)
                    }}
                    style={{ color: 'black' }}
                />
        );
    };

    //DATE CONVERT TO TEXTFIELD
    // const formatDate = (dateString) => {
    //     const date = new Date(dateString);
    //     const year = date.getFullYear();
    //     const month = (date.getMonth() + 1).toString().padStart(2, '0');
    //     const day = date.getDate().toString().padStart(2, '0');
    //     return `${year}-${month}-${day}`;
    // };

    //TOTAL CALCULATION
    // const calculateTotals = (data) => {
    //     const totalQty = data.reduce((acc, item) => acc + (Number(item.Qty) || 0), 0);
    //     console.log("totalQty", totalQty);
    //     setTotalQuantity(totalQty);
    //     // const amt = data.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
    //     // console.log("amt", amt);
    //     // setTotalGrossAmount(amt);
    //     return [
    //         { id: 1, totalQty }
    //     ];
    // };

    const calculateTotals = (data) => {
        const totalQty = data.reduce((acc, item) => acc + (Number(item.recievedQty) || 0), 0);
        console.log("totalQty", totalQty);
        setTotalQuantity(totalQty);
    };

    useEffect(() => {
        calculateTotals(selectedItems)
    }, [selectedItems])

    // GST CALCULATTION
    useEffect(() => {
        var cgstAmount = (totalGrossAmount * cgstPercent) / 100;
        setCGST(cgstAmount);
        var sgstAmount = (totalGrossAmount * sgstPercent) / 100;
        setSGST(sgstAmount)
        var igstAmount = (totalGrossAmount * igstPercent) / 100;
        setIGST(igstAmount)
        let totalAmount = Number(totalGrossAmount) + Number(cgst) + Number(sgst) + Number(igst);
        setTotalValue(Math.round(totalAmount));
    }, [cgstPercent, sgstPercent, igstPercent, cgst, sgst, igst, totalValue, totalGrossAmount]);

    const remarksLists = [
        'APPROXIMATE WEIGHT & VALUE FOR WEIGHING AND RETURN WITHOUT E-WAY BILL LESS THAN 20KM',
        'FOR SIMULATION AND RETURN',
        'FOR STORAGE ONLY',
        'FOR ACID PICKLING AND RETURN',
        'FOR ANODIZING AND RETURN',
        'FOR ASSEMBLY TRAINING AND RETURN',
        'FOR BALANCEING AND RETURN',
        'FOR POWDER COATING AND RETURN',
        'FOR PRESSING AND RETURN',
        'FOR PRODUCTION PROCESS AND RETURN',
        'FOR PUNCHING AND RETURN',
        'FOR PUNCHING,BENDING AND RETURN',
        'FOR PUNCHING,BENDING,PROCESS AND RETURN',
    ]

    //GET SUPPLIER LIST
    const handleChange = (e) => {
        GetWithoutPoSuppList({ code: e.target.value }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
    }

    const handleItemVsProcessItemSucessShow = (dataObject) => {
        setSupplierList(dataObject?.data || []);
    }
    const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSupplierSearchItemChange = (value) => {
        if (value !== null) {
            setSuppAddress(value?.spAddress);
            setSupplierSid(value?.id);
            setGSTNo(value?.gstNo);
            setPanNo(value?.panNo);
            // setSupplierSelect(value?.label);
        }
    };

    // HANDLE CELL EDIT DATA
    // const handleCellEdit = (params) => {
    //     const updatedList = selectedItems.map((supp) =>
    //         supp.id === params.id ?
    //             {
    //                 ...supp,
    //                 recievedQty: params.recievedQty,
    //             }
    //             : supp
    //     )
    //     setSelectedItems(updatedList);
    // };
    const handleCellEdit = (newRow) => {
        let updatedCumQty = 0, pendingQty = 0;
        const updatedList = selectedItems.map((supp) => {
            if (supp.id === newRow.id) {
                updatedCumQty = Number(supp.Qty) === Number(supp.cumQty) ? Number(newRow.recievedQty) : Number(supp.cumQty) + Number(newRow.recievedQty);
                pendingQty = Number(supp.Qty) - updatedCumQty;
                return { ...supp, cumQty: updatedCumQty, recievedQty: Number(newRow.recievedQty) || 0, pendingQty };
            } else {
                return supp;
            }
        });
        setSelectedItems(updatedList);
        return { ...newRow, cumQty: updatedCumQty, pendingQty }; // important for DataGrid to not throw error
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>

                {mode === 'withPO' &&
                    <Link to='/PurchaseBillAgainstPOModule' style={{ textDecoration: 'none' }}>
                        <Typography
                            sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                            variant="h5"
                        >
                            {`Purchase Bill Against PO >>`}
                        </Typography>
                    </Link>
                }
                {mode === 'withoutPO' && (<Link to='/PurchaseBillWithoutPOModule' style={{ textDecoration: 'none' }}>
                    <Typography
                        sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                        variant="h5"
                    >
                        {`Purchase Bill Without PO >>`}
                    </Typography>
                </Link>

                )}
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    New - Job Work Receipt
                </Typography>
            </div>
            <form onSubmit={handleSubmit}>
                <Grid container padding={1}>
                    <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    disabled={true}
                                    placeholder='JWR No'
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    readOnly={true}
                                    required
                                    value={sequentialNumber}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    type='date'
                                    readOnly={true}
                                    disabled={true}
                                    required
                                    value={formatDate(selectedDate)}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    readOnly={true}
                                    required
                                    value={DCNumber}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    readOnly={true}
                                    required
                                    value={selectedSuppName}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    id="outlined-multiline-static"
                                    label="Billing Address"
                                    multiline
                                    rows={4}
                                    rowsMax={8}
                                    value={selectedSpAddress}
                                    readOnly={true}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    inputProps={{
                                        style: { height: '65px', fontSize: '13px' }
                                    }}
                                />

                            </Grid>

                            {!viewDC && <Grid item xs={12} sm={12} md={1} lg={1} xl={1} marginRight={2}  >
                                <Button variant="contained" style={{ backgroundColor: suppAddress.length > 0 ? '#002d68' : ' #dddddd' }} disabled={suppAddress.length > 0 ? false : true} onClick={() => setChangeAddressModalOpen(true)}>Change</Button>
                            </Grid>}

                            {!viewDC && <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                <Button variant="contained" style={{ backgroundColor: '#002d68' }} onClick={() => setLoadPendingSfg(true)}>Load Pending JWISS</Button>
                            </Grid>}

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid>

                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} style={{ fontSize: '75%' }}>
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '0px', borderRadius: '10px', width: '100%', height: '30vh', overflow: 'auto', border: '1px solid black' }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} >
                                        <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr>
                                                    <th colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#6895D2', color: '#ffffff' }}>JOB WORK RECEIPT DETAILS</th>
                                                </tr>
                                                <tr>
                                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Field</th>
                                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Invoice No</th>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            // required
                                                            // onChange={(e) => setChallanNo(e.target.value)}
                                                            // value={supplierInvoiceNoCopy}
                                                            value={invoiceNo}
                                                            onChange={(e) => setInvoiceNo(e.target.value)}
                                                            size='small'
                                                        />
                                                    </td>
                                                </tr>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Invoice Date</th>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            type='date'
                                                            // onChange={(e) => setChallanDate(e.target.value)}
                                                            // value={formatDate(supplierInvoiceDateCopy)}
                                                            value={invoiceDate}
                                                            onChange={(e) => setInvoiceDate(e.target.value)}
                                                            size='small'
                                                        />
                                                    </td>
                                                </tr>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>DC No</th>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            // type='date'
                                                            // onChange={(e) => setChallanDate(e.target.value)}
                                                            // value={cSupplierDcNoCopy}
                                                            value={dcNo}
                                                            onChange={(e) => setDcNo(e.target.value)}
                                                            size='small'
                                                        />
                                                    </td>
                                                </tr>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>DC Date</th>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            type='date'
                                                            // onChange={(e) => setChallanDate(e.target.value)}
                                                            // value={formatDate(supplierDcDateCopy)}
                                                            value={dcDate}
                                                            onChange={(e) => setDcDate(e.target.value)}
                                                            size='small'
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <thead>
                                                <tr>
                                                    <th colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#6895D2', color: '#ffffff' }}>TOTAL</th>
                                                </tr>
                                                <tr>
                                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Field</th>
                                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Total Qty</th>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            size='small'
                                                            value={totalQuantity}
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
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%', border: '1px solid black', }}>
                            <CardContent>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: '18px' }}>
                                    {!viewDC && < Button variant="contained" type='submit' style={{ height: '35px', backgroundColor: '#002D68' }}>SAVE</Button>}
                                </div>
                                <DataGrid
                                    rows={selectedItems}
                                    columns={middleGridColumns}
                                    pageSize={5}
                                    style={{ height: '310px' }}
                                    key={refreshKey}
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
                                            border: '1px solid #969696'
                                        },
                                    }}
                                    getRowClassName={(params) => {
                                        const rowIndex = selectedItems.findIndex(row => row.id === params.row.id);
                                        if (rowIndex !== -1) {
                                            console.log(' ');
                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }
                                        return '';
                                    }}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                    processRowUpdate={handleCellEdit}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </form>
            {/* <ChangeAddressModal
                changeAddressModalOpen={changeAddressModalOpen}
                setChangeAddressModalOpen={setChangeAddressModalOpen}
                setSuppAddress={setSuppAddress}
                supplierSid={supplierSid}
            /> */}
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <LoadPendingJWISS
                setLoadPendingSfg={setLoadPendingSfg}
                loadPendingSfg={loadPendingSfg}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                supplierSid={withPOSupplierId}
                withoutPOSupplierId={withoutPOSupplierId}   // ✅ fixed
                mode={mode}
            />
        </div >
    )
}

export default JobworkReceiptModule