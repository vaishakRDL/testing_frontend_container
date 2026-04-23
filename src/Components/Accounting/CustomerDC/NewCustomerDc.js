import React from 'react'
import { useState } from 'react';
import { Autocomplete, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import { CustomerDCAdd, CustomerDCAutoGen, CustomerDCDelete, CustomerDCUpdate, CustomerDcImport, CustomerDcPreview, CustomerDcViewing, CustomerDropShowdata, FetchCustomerAddress, GetGeneratePoSaleOrderEntry, PartNoDcShow, PartNoSelect, PartNoSelectDc } from '../../../ApiService/LoginPageService';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DownloadCustomerDcTemplate, ExportCustomerDC } from '../../../ApiService/DownloadCsvReportsService';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import '../../PurchaseOrderGeneration/PurchaseOrder.css';
import AddressChange from './AddressChange';
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import DeleteConfirmationDailog from '../../../Utility/confirmDeletion';
import { useModuleLocks } from '../../context/ModuleLockContext';

const NewCustomerDc = () => {
    const [activeButton, setActiveButton] = useState("");
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Customer DC")?.lockStatus === "locked";

    const getHighlightStyle = (name, baseStyle = {}, disabled = false) => ({
        ...baseStyle,
        backgroundColor: disabled
            ? "gray"
            : activeButton === name
                ? "#0d6efd" // 🔵 highlight
                : baseStyle.backgroundColor,
        transition: "0.3s",
        color: disabled ? "#000" : "white",
    });

    const [autogen, setAutoGen] = useState('');
    const [autoGenDc, setAutoGenDc] = useState('');
    const [poReference, setPoReference] = useState('');
    const [nrdcRefNo, setNrdcRefNo] = useState('');
    const [nrdcRefDate, setNrdcRefDate] = useState('');
    const [customerDcNo, setCustomerDcNo] = useState('');
    const [customerDcDate, setcustomerDcDate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [multiDc, setMultiDc] = useState('');
    const [cdcNo, setCdcNo] = useState('');
    const [date, setDate] = useState('');
    const [customerSelect, setCustomerSelect] = useState('');
    const [customerSelectList, setCustomerSelectList] = useState([]);
    const [billingAddress, setBillingAddress] = useState([]);
    const [shippingAddress, setShippingAddress] = useState([]);
    const [partNo, setPartNo] = useState('');
    const [partNoList, setPartNoList] = useState([]);
    const [partNoLabel, setPartNoLabel] = useState('');
    const [poNo, setPONo] = useState('');
    const [poDate, setPODate] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [totalQty, setTotalQty] = useState('0');
    const [grossAmt, setGrossAmt] = useState('0.00');
    const [rows, setRows] = useState([]);
    const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
    const [customerSid, setCustomerSid] = useState('');
    const [custAddress, setCustAddress] = useState('');
    const [isLoading, setGridLoading] = useState(true);
    const [selectedCustomerName, setSelectedCustomerName] = useState('');
    const [cid, setcid] = useState('');
    const [file, setFile] = useState(null);
    const [selectedItems, setSelectedItems] = useState([{ id: 'RDL1' }]);
    const [refreshData, setRefreshData] = useState(false);
    const [selectedChangeAddress, setSelectedChangeAddress] = useState();
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [loading, setLoading] = useState(false);
    const [uploadLoader, setUploadLoader] = useState(false);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [qcApprovalStatus, setQcApprovalStatus] = useState();
    const [grnRefNo, setGrnRefNo] = useState('');
    const location = useLocation();
    const [generatedCustDcLists, setGeneratedCustDcLists] = useState([]);

    //--View--//
    // const isPOView = new URLSearchParams(location.search).get('isPOView');
    const isQcApprovalFlag = new URLSearchParams(location.search).get('isQcApprovalFlag');
    const poRowId = new URLSearchParams(location.search).get('poRowId');

    //--Edit--//
    // const isEdit = new URLSearchParams(location.search).get('isEdit');

    ////////////////////////////////////////////////////////////////////////FORWARD REVERSE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    const [isPOView, setIsPoView] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mainId, setMainId] = useState('');
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)

    ///View Button Click
    const navigate = useNavigate()
    const handleViewClick = () => {
        navigate('/NewCustomerDcView')
    };

    const onCDCNoChange = (e) => {
        setCdcNo(e.target.value);
        CustomerDCAutoGen(handlePoNoAutoGen, handlePoNoAutoGenException);
    }

    useEffect(() => {
        // CustomerDCAutoGen(handlePoNoAutoGen, handlePoNoAutoGenException);
        if (isQcApprovalFlag) {
            CustomerDcViewing({ id: poRowId }, handlePurchaseOrderView, handlePurchaseOrderViewException);
        } else {
            handleForwardReverse('last', '');
        }
    }, [/*isPOView, isEdit,*/ poRowId]);

    const handlePurchaseOrderView = (dataObject) => {
        const data = dataObject.data[0];
        setQcApprovalStatus(data?.qcApproval || '');
        setGrnRefNo(data?.grnRefNo || '');
        setSelectedDate(data?.date || '')
        setAutoGen(data?.digit || '');
        setAutoGenDc(data?.cdcNo || '');
        setSelectedCustomerName(data?.cName || '');
        setBillingAddress(data?.bill_add || '');
        setGrossAmt(data?.gross_amt || '');
        setTotalQty(data?.total_qty || '');
        setPoReference(data?.po_ref || '');
        setNrdcRefNo(data?.nrdc_No || '');
        setNrdcRefDate(data?.nrdc_date || '');
        setCustomerDcNo(data?.cust_Dc_no || '');
        setcustomerDcDate(data?.customerDcDate || '');
        setRemarks(data?.remark || '');
        const allItems = dataObject.data2 || [];
        setSelectedItems([...allItems, { id: 'RDL1' }]);
        setcid(data?.cust || '')
    }

    const handlePurchaseOrderViewException = (errorObject, errorMessage) => {
    }

    const handleChangeCustomer = (e) => {
        if (e !== null) {
            CustomerDropShowdata({ code: e.target.value }, handleCustomerDropshow, handleCustomerDropshowException);
        }
    }

    const handleCustomerDropshow = (dataObject) => {
        setCustomerSelectList(dataObject?.data || []);
    }

    const handleCustomerDropshowException = (error, errorMessage) => {
        console.log(errorMessage);
    }

    const handlePoNoAutoGen = (dataObject) => {
        setAutoGen(dataObject.digit);
        setAutoGenDc(dataObject.id);
    }

    const handlePoNoAutoGenException = (errorStaus, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    ///Customer Select
    const optionsCustList = Array.isArray(customerSelectList) ? customerSelectList.map(item => ({
        id: item?.id,
        cId: item?.cId,
        label: item?.cCode,
        cName: item?.cName
    })) : [];

    function onCustomerSelectChange(selectedValue, value) {
        setSelectedCustomerName(selectedValue?.cName);
        setCustomerSelect(selectedValue?.id);
        setCustomerName(selectedValue?.label);
        setcid(selectedValue?.cId)
        setCustomerSid(selectedValue?.cId)
        FetchCustomerAddress({
            id: selectedValue?.cId
        }, handleFetchCustAddressSuccess, handleFetchCustAddressException);
    }

    const handleFetchCustAddressSuccess = (dataObject) => {
        setBillingAddress(dataObject?.data[0]?.cAddress || '');
    };

    const handleFetchCustAddressException = (errorStaus, errorMessage) => {
        console.log(errorMessage);
    };

    const handleBillingTextFieldChange = (event) => {
        setBillingAddress(event.target.value);
    };

    //PartNo select
    const optionsPartNoList = partNoList ? partNoList.map(item => ({
        value: item?.id,
        label: item?.label
    })) : [];

    // function onPartNoSelectChange(selectedValue, event) {
    //     setPartNo(selectedValue?.id);
    //     setPartNoLabel(selectedValue?.label);
    //     PartNoSelectDc({
    //         id: selectedValue?.label
    //     }, handlePartNoShowSuccess, handlePartNoSelectException);
    // }

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
    const handlePartNoShowSuccess = (dataObject) => {
        setGridLoading(false);
        const data = dataObject?.data || [];
        setRows(data);
        const formattedData = data.map(item => ({
            id: item?.id || null,
            itemCode: item?.itemCode || '',
            itemName: item?.itemName || '',
            amt: item?.amt || 0,
            uom: item?.uom || '',
            cdc_po: item?.cdc_po || '',
            rate: item?.rate || "",
            qty: item?.qty || 0,
            hsnCode: item?.hsnCode || "",
        }));
        if (formattedData.length > 0) {
            const clonedSelectedItems = [...selectedItems];
            const lastObj = clonedSelectedItems.pop();
            clonedSelectedItems.push(...formattedData, lastObj);
            setSelectedItems(clonedSelectedItems);
        }
    };

    const handlePartNoSelectException = (errorObject, errorMessage) => {
        setRows([]);
    }

    const handleChange = (e) => {
        PartNoDcShow({
            code: e.target.value,
            id: customerSelect
        }, handlePartNoDropshow, handlePartNoDropshowException);
    }

    const handlePartNoDropshow = (dataObject) => {
        setPartNoList(dataObject?.data || []);
    }

    const handlePartNoDropshowException = (error, errorMessage) => {
        console.log(errorMessage);
    }

    useEffect(() => {
        calculateTotals(selectedItems);
    }, [selectedItems]);

    const calculateTotals = (data) => {
        const totalQty = data.reduce((acc, item) => acc + (Number(item.qty) || 0), 0);
        setTotalQty(totalQty);

        const grossAmount = data.reduce((acc, item) => acc + (Number(item.amt) || 0), 0);
        setGrossAmt(grossAmount);
    };

    const updateTotalQty = (params) => {

        const updatedList = selectedItems.map((supp) =>
            supp.id === params.id ?
                { ...supp, SchDate: params.SchDate, qty: params.qty, amt: Number(params.qty) * Number(params.newRate) }
                : supp
        )
        setSelectedItems(updatedList);
        calculateTotals(updatedList);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const purchaseOrderData = {
            digit: autogen,
            cdcNo: autoGenDc,
            date: selectedDate,
            cust: cid,
            bill_add: billingAddress,
            multi_Dc: multiDc,
            po_ref: poReference,
            grnRefNo: grnRefNo,
            nrdc_No: nrdcRefNo,
            nrdc_date: nrdcRefDate,
            cust_Dc_no: customerDcNo,
            remark: remarks,
            customerDcDate: customerDcDate,
            qcApproval: isQcApprovalFlag === 'true' ? 1 : null,
        };
        const purchaseOrderItemData = selectedItems.map((data) => ({
            id: data?.id,
            itemCode: data?.itemCode,
            itemName: data?.itemName,
            uom: data?.uom,
            qty: data?.qty,
            cdc_po: data?.cdc_po,
            rate: data?.rate,
            amt: data?.amt,
            hsnCode: data?.hsnCode,
            accQty: data?.accQty,
            rejQty: data?.rejQty,
        }));
        const updatedPurchaseOrderItemData = purchaseOrderItemData.slice(0, -1);
        const requestData = {
            purchaseOrderData: purchaseOrderData,
            purchaseOrderItemData: isEdit ? purchaseOrderItemData : updatedPurchaseOrderItemData,
            id: isQcApprovalFlag === 'true' ? poRowId : mainId
        };
        if (isEdit || isQcApprovalFlag) {
            setLoading(true);
            CustomerDCUpdate(requestData, handleSuccess, handleException);
        } else {
            setLoading(true);
            CustomerDCAdd(requestData, handleSuccess, handleException);
        }
    };

    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            CustomerDCAutoGen(handlePoNoAutoGen, handlePoNoAutoGenException);
            setRefreshData(oldValue => !oldValue);
            setLoading(false);
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            ClearData();
            setRefreshData(oldValue => !oldValue);
            setLoading(false);
        }, 2000);
    };

    const ClearData = () => {
        setIsEdit(false)

        setAutoGen('');
        setSelectedDate(new Date());
        setAutoGenDc('');
        setGrnRefNo('');
        setSelectedCustomerName('');
        setCustomerName('');
        setCustAddress('');
        setCustomerSelect('');
        setCustomerSelectList('');
        setBillingAddress('');
        setPartNo('');
        setPartNoList('');
        setPartNoLabel('');
        setGrossAmt('0.00');
        setTotalQty('0');
        setPoReference('');
        setNrdcRefNo('');
        setNrdcRefDate('');
        setCustomerDcNo('');
        setcustomerDcDate(new Date());
        setRemarks('');
        setSelectedItems([{ id: 'RDL1' }]);
        setRows([]);
        setRefreshData(oldValue => !oldValue);
    }

    const DownloadCustomerDcTemplateSuccess = () => { };

    const DownloadCustomerDcTemplateException = () => { };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleEdit = (cellNam, newValue, id, rowData) => {
        let updatedItems;
        switch (cellNam) {
            case "Qty":
                updatedItems = selectedItems.map((supp) =>
                    supp.id === id && cellNam === 'Qty'
                        ? { ...supp, qty: Number(newValue), amt: Number(newValue) * Number(rowData.rate) }
                        : supp
                );
                break;
            case "rejQty":
                // updatedItems = selectedItems.map((supp) =>
                //     supp.id === id && cellNam === 'rejQty'
                //         ? { ...supp, accQty: Number(rowData.qty) - Number(newValue) }
                //         : supp
                // );
                updatedItems = selectedItems.map((supp) => {
                    if (supp.id === id && cellNam === 'rejQty') {
                        if (newValue > rowData.qty) {
                            alert('Rejected Quantity cannot be greater than Quantity');
                            return {
                                ...supp,
                                accQty: 0,
                                rejQty: 0,
                            };
                        }
                        return {
                            ...supp,
                            accQty: Number(rowData.qty) - Number(newValue),
                            rejQty: Number(newValue)
                        };
                    }
                    return supp
                });
                break;
            case "hsnCode":
                updatedItems = selectedItems.map((supp) =>
                    supp.id === id && cellNam === 'hsnCode'
                        ? { ...supp, hsnCode: newValue }
                        : supp
                );
                break;
            case "cdc_po":
                updatedItems = selectedItems.map((supp) =>
                    supp.id === id && cellNam === 'cdc_po'
                        ? { ...supp, cdc_po: newValue }
                        : supp
                );
                break;
        }
        setSelectedItems(updatedItems);
    };

    const handleDeleteRow = (id) => {
        const newArray = selectedItems.filter((item) => item.id != id)
        setSelectedItems(newArray);
        calculateTotals(newArray)
    }

    const CustomerDcImportSuccess = (dataObject) => {
        console.log('Data received:', dataObject.data);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setFile('');
            setUploadLoader(false)
        }, 2000);
    }

    const CustomerDcImportException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setFile('');
            setUploadLoader(false)
        }, 2000);
    };

    // HANDLE FORWARD REVERSE HANDLER
    const handleForwardReverse = (type, id) => {
        CustomerDcPreview({ type: type, id: id }, handleActionSuccess, handleActionException)
    }

    const handleActionSuccess = (dataObject) => {
        setIsPoView(true)
        const data = dataObject.data[0];
        setCustomerSelect(data?.cust || '');
        setQcApprovalStatus(data?.qcApproval || '');
        setGrnRefNo(data?.grnRefNo || '');
        setSelectedDate(data?.date || '')
        setAutoGen(data?.digit || '');
        setAutoGenDc(data?.cdcNo || '');
        setSelectedCustomerName(data?.cName || '');
        setBillingAddress(data?.bill_add || '');
        setGrossAmt(data?.gross_amt || '');
        setTotalQty(data?.total_qty || '');
        setPoReference(data?.po_ref || '');
        setNrdcRefNo(data?.nrdc_No || '');
        setNrdcRefDate(data?.nrdc_date || '');
        setCustomerDcNo(data?.cust_Dc_no || '');
        setcustomerDcDate(data?.customerDcDate || '');
        setRemarks(data?.remark || '');
        const allItems = dataObject.data2 || [];
        setSelectedItems([...allItems, { id: 'RDL1' }]);
        setcid(data?.cust || '')
        console.log("data", dataObject?.data2 || [])
        setMainId(data?.id || '');
    }
    const handleActionException = () => { }

    const handleClearPage = () => {
        setIsPoView(false)
        setIsEdit(false)
        setMainId('')
        setGrnRefNo('')
        setAutoGen('');
        setSelectedDate(new Date());
        setAutoGenDc('');
        setSelectedCustomerName('');
        setCustomerName('');
        setCustAddress('');
        setCustomerSelect('');
        setCustomerSelectList('');
        setBillingAddress('');
        setPartNo('');
        setPartNoList('');
        setPartNoLabel('');
        setGrossAmt('0.00');
        setTotalQty('0');
        setPoReference('');
        setNrdcRefNo('');
        setNrdcRefDate('');
        setCustomerDcNo('');
        setcustomerDcDate(new Date());
        setRemarks('');
        setSelectedItems([{ id: 'RDL1' }]);
        setRows([]);
        // setRefreshData(oldValue => !oldValue);
        CustomerDCAutoGen(handlePoNoAutoGen, handlePoNoAutoGenException);
    }

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
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
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    };

    const ExportCustomerDCSuccess = () => { };

    const ExportCustomerDCException = () => { };

    //SEARCH GENERATED GST INVOICE ENTRY
    const handlePOChange = (e) => {
        GetGeneratePoSaleOrderEntry({ type: 'customerDc', code: e.target.value }, handleGeneratedPoSucessShow, handleGeneratedPoExceptionShow);
    }

    const handleGeneratedPoSucessShow = (dataObject) => {
        setGeneratedCustDcLists(dataObject?.data || []);
    }
    const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => {
    }

    const handleGeneratedPoSelect = (selectedValue) => {
        setIsPoView(true)
        if (selectedValue !== null) {
            setMainId(selectedValue.id);
            // GstViewing({ id: selectedValue.id }, handleActionSuccess, handleActionException);
            CustomerDcViewing({ id: selectedValue.id }, handleActionSuccess, handleActionException);
        }
    }

    // UNIQUE CODE MANUAL CHANGE
    const handleUniqueCodeChange = (e) => {
        const newUniqueCode = e.target.value;
        const currentYear = autoGenDc.split('/')[0]; // Get last 2 digits of the year
        setAutoGen(newUniqueCode/*.toString().padStart(5,0)*/);
        setAutoGenDc(`${currentYear}/${newUniqueCode.toString().padStart(5, 0)}`);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '10px', marginTop: '10px' }}>
                {isQcApprovalFlag == 'true' &&
                    <Link to="/CustomerDcQualityCheck" style={{ textDecoration: "none" }}>
                        <Typography
                            sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
                            variant="h5"
                        >
                            {`Quality Check >>`}
                        </Typography>
                    </Link>
                }
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    {isPOView ? "View Customer Delivery Challan" : isEdit ? "Edit Customer Delivery Challan" : "New Customer Delivery Challan"}
                </Typography>
                <div style={{ width: '250px', marginRight: '10px' }}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={generatedCustDcLists}
                        fullWidth
                        // value={selectedGeneratedPo}
                        getOptionLabel={(option) => option.digit || /*selectedGeneratedPo*/''}
                        renderInput={(params) => <TextField {...params} label="Search DC" onChange={handlePOChange} />}
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
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">CDC No</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="CDC No"
                                        placeholder='CDC No'
                                        size="small"
                                        disabled
                                        style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                        value={cdcNo}
                                        onChange={(e) => onCDCNoChange(e)}>
                                        <MenuItem value="EX">CDC2</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    readOnly={true}
                                    onChange={handleUniqueCodeChange}
                                    value={autogen}
                                    size="small"
                                    disabled={isPOView ? true : false}
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    inputProps={{ maxLength: 5 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    label="Date"
                                    placeholder='Date'
                                    variant="outlined"
                                    required
                                    type='Date'
                                    size="small"
                                    disabled={isPOView ? true : false}
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    value={formatDate(selectedDate)}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    readOnly={true}
                                    value={autoGenDc}
                                    size="small"
                                    disabled={isPOView ? true : false}
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="combo-box-demo"
                                    value={selectedCustomerName}
                                    options={optionsCustList}
                                    disabled={isPOView ? true : false}
                                    renderInput={(params) => <TextField {...params} label="Search Customer " onChange={handleChangeCustomer} />}
                                    onChange={(event, value) => onCustomerSelectChange(value, event)}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    fullWidth
                                    id="outlined-multiline-static"
                                    label="Billing Address"
                                    multiline
                                    rows={4}
                                    disabled={isPOView ? true : false}
                                    value={`${selectedCustomerName ? selectedCustomerName : ''}${selectedCustomerName && '\n'}${billingAddress}`}
                                    onChange={handleBillingTextFieldChange}
                                    readOnly={true}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ float: 'right' }}>
                                {!isPOView && (
                                    <Button
                                        variant="text"
                                        disabled={billingAddress.length === 0}
                                        onClick={() => {
                                            setSelectedChangeAddress('billing');
                                            setChangeAddressModalOpen(true);
                                        }}
                                    >
                                        Change
                                    </Button>
                                )}
                            </Grid>
                            {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', flexDirection: 'row' }}>
                                {!isPOView && (
                                    <>
                                        <FormControl style={{ display: 'flex', flexDirection: 'row' }}>
                                            <FormControlLabel
                                                control={<Checkbox />}
                                                label={<Typography variant="body1" style={{ fontWeight: 'bold' }}>Multi DC</Typography>}
                                            />
                                        </FormControl>
                                        <input
                                            id="upload-photo"
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        if (reader.readyState === 2) {
                                                            setFile(reader.result);
                                                            CustomerDcImport(
                                                                { file: reader.result },
                                                                CustomerDcImportSuccess,
                                                                CustomerDcImportException
                                                            );
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
                                                width: '120px', 
                                                background: '#002D68', 
                                                color: 'white', 
                                                marginLeft: '30px', 
                                                height: '30px', 
                                                padding: '5px', 
                                                marginRight: '16px' 
                                            }}
                                        >
                                            Import
                                            <input id="upload-photo" type="file" hidden />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{
                                                backgroundColor: '#002D68',
                                                height: '30px',
                                                padding: '5px',
                                            }}
                                            onClick={() => {
                                                DownloadCustomerDcTemplate(
                                                    DownloadCustomerDcTemplateSuccess,
                                                    DownloadCustomerDcTemplateException
                                                );
                                            }}
                                        >
                                            Download Template
                                        </Button>
                                    </>
                                )}
                            </Grid> */}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={0.5} lg={0.5} xl={0.5}></Grid>
                    <Grid item xs={12} sm={12} md={6.5} lg={4.5} xl={4.5} >
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '0px', borderRadius: '10px', width: '100%', height: '31vh', overflow: 'auto', border: '1px solid black' }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
                                            <tbody>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        GRN Reference
                                                    </th>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            disabled={isPOView ? true : false}
                                                            value={grnRefNo}
                                                            onChange={(e) => setGrnRefNo(e.target.value)}
                                                            size='small'
                                                            inputProps={{
                                                                style: { padding: "4px", fontSize: "14px" },
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        PO Reference
                                                    </th>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            disabled={isPOView ? true : false}
                                                            value={poReference}
                                                            onChange={(e) => setPoReference(e.target.value)}
                                                            size='small'
                                                            inputProps={{
                                                                style: { padding: "4px", fontSize: "14px" },
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        NRDC Ref No
                                                    </th>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            disabled={isPOView ? true : false}
                                                            value={nrdcRefNo}
                                                            onChange={(e) => setNrdcRefNo(e.target.value)}
                                                            size='small'
                                                            inputProps={{
                                                                style: { padding: "4px", fontSize: "14px" },
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        NRDC Ref Date
                                                    </th>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            label="Date"
                                                            placeholder='Date'
                                                            variant="outlined"
                                                            type='Date'
                                                            size='small'
                                                            disabled={isPOView ? true : false}
                                                            onChange={(e) => { setNrdcRefDate(e.target.value) }}
                                                            value={formatDate(nrdcRefDate)}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            inputProps={{
                                                                style: { padding: "4px", fontSize: "14px" },
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Customer DC No
                                                    </th>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            required
                                                            disabled={isPOView ? true : false}
                                                            value={customerDcNo}
                                                            onChange={(e) => setCustomerDcNo(e.target.value)}
                                                            size='small'
                                                            inputProps={{
                                                                style: { padding: "4px", fontSize: "14px" },
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Customer DC Date
                                                    </th>

                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            label="Date"
                                                            placeholder='Date'
                                                            variant="outlined"
                                                            required
                                                            type='Date'
                                                            size='small'
                                                            disabled={isPOView ? true : false}
                                                            onChange={(e) => { setcustomerDcDate(e.target.value) }}
                                                            value={formatDate(customerDcDate)}
                                                            InputLabelProps={{
                                                                shrink: true
                                                            }}
                                                            inputProps={{
                                                                style: { padding: "4px", fontSize: "14px" },
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Remarks
                                                    </th>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            disabled={isPOView ? true : false}
                                                            value={remarks}
                                                            onChange={(e) => setRemarks(e.target.value)}
                                                            size='small'
                                                            inputProps={{
                                                                style: { padding: "4px", fontSize: "14px" },
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                            <tbody>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Total Qty
                                                    </th>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            disabled={isPOView ? true : false}
                                                            value={totalQty}
                                                            onChange={(e) => setTotalQty(e.target.value)}
                                                            size='small'
                                                            inputProps={{
                                                                style: { padding: "4px", fontSize: "14px" },
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                    <th
                                                        style={{
                                                            border: "1px solid #ddd",
                                                            padding: "8px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Total Amt
                                                    </th>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            disabled={isPOView ? true : false}
                                                            value={grossAmt}
                                                            onChange={(e) => setGrossAmt(e.target.value)}
                                                            size='small'
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
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%', border: '1px solid black', }}>
                            <CardContent>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "15px" }}>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", columnGap: "10px", rowGap: "10px", }}>
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
                                            style={getHighlightStyle("Edit", {
                                                width: "100%",
                                                backgroundColor: isModuleLocked ? "grey" : "#002D68",
                                                height: "35px",
                                            })}
                                            disabled={isModuleLocked}
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
                                            style={getHighlightStyle("Delete", {
                                                width: "100%",
                                                backgroundColor: isModuleLocked ? "grey" : "#002D68",
                                                height: "35px",
                                            })}
                                            disabled={isModuleLocked}
                                            onClick={() => {
                                                setActiveButton("Delete");
                                                setDeleteDailogOpen(true);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={getHighlightStyle("Clear", {
                                                width: "100%",
                                                backgroundColor: isModuleLocked ? "grey" : "#002D68",
                                                height: "35px",
                                            })}
                                            disabled={isModuleLocked}
                                            onClick={() => {
                                                setActiveButton("Clear");
                                                handleClearPage();
                                            }}
                                        >
                                            Clear
                                        </Button>
                                        <Button
                                            variant="contained"
                                            disabled={!(isPOView || isEdit) || isModuleLocked}
                                            style={getHighlightStyle(
                                                "Print",
                                                {
                                                    width: "100%",
                                                    backgroundColor: isModuleLocked ? "gray" : "#002D68",
                                                    height: "35px",
                                                },
                                                !(isPOView || isEdit)
                                            )}
                                            onClick={() => {
                                                setActiveButton("Print");
                                                ExportCustomerDC(
                                                    { id: mainId },
                                                    ExportCustomerDCSuccess,
                                                    ExportCustomerDCException
                                                );
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
                                            disabled={isModuleLocked}
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
                                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        {/* {isPOView || isEdit || isQcApprovalFlag ? <Typography style={{ color: Number(qcApprovalStatus) === 0 ? 'red' : 'green', fontWeight: 'bold' }}>{Number(qcApprovalStatus) === 0 ? 'QC Pending' : 'QC Approved'}</Typography> : ""} */}
                                        <input
                                            id="upload-photo"
                                            type="file"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    const reader = new FileReader();
                                                    reader.onload = () => {
                                                        if (reader.readyState === 2) {
                                                            setFile(reader.result);
                                                            setUploadLoader(true)
                                                            CustomerDcImport(
                                                                { file: reader.result },
                                                                CustomerDcImportSuccess,
                                                                CustomerDcImportException
                                                            );
                                                        }
                                                    };
                                                    reader.readAsDataURL(e.target.files[0]);
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            component="label"
                                            htmlFor="upload-photo"
                                            disabled={uploadLoader === true || isModuleLocked}
                                            style={getHighlightStyle(
                                                "Import",
                                                { height: "35px", backgroundColor: isModuleLocked ? "grey" : "#002D68" },
                                                uploadLoader
                                            )}
                                            onClick={() => setActiveButton("Import")}
                                            d
                                        >
                                            {uploadLoader ? (
                                                <CircularProgress size={24} style={{ color: "white" }} />
                                            ) : (
                                                "Import"
                                            )}
                                        </Button>

                                        <Button
                                            variant="contained"
                                            type="submit"
                                            style={getHighlightStyle("DownloadTemplate", {
                                                height: "35px",
                                                backgroundColor: isModuleLocked ? "grey" : "#002D68",
                                            })}
                                            disabled={isModuleLocked}
                                            onClick={() => {
                                                setActiveButton("DownloadTemplate");
                                                DownloadCustomerDcTemplate(
                                                    DownloadCustomerDcTemplateSuccess,
                                                    DownloadCustomerDcTemplateException
                                                );
                                            }}
                                        >
                                            Download Template
                                        </Button>

                                        <Button
                                            variant="contained"
                                            type="button"
                                            style={getHighlightStyle("View", {
                                                height: "35px",
                                                backgroundColor: isModuleLocked ? "grey" : "#002D68",
                                            })}
                                            onClick={() => {
                                                setActiveButton("View");
                                                handleViewClick();
                                            }}
                                            disabled={isModuleLocked}
                                        >
                                            VIEW
                                        </Button>

                                        <Button
                                            variant="contained"
                                            type="submit"
                                            disabled={loading === true || isModuleLocked}
                                            style={getHighlightStyle(
                                                "SaveUpdate",
                                                { height: "35px", backgroundColor: isModuleLocked ? "grey" : "#002D68" },
                                                loading
                                            )}
                                            onClick={() => setActiveButton("SaveUpdate")}
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
                                <table id="customers">
                                    <thead>
                                        <tr>
                                            <th>Part No</th>
                                            <th>Part Name</th>
                                            <th>UOM</th>
                                            <th>CDC Po</th>
                                            <th>HSN Code</th>
                                            <th>Qty</th>
                                            {/* <th>Acc Qty</th>
                                            <th>Rej Qty</th> */}
                                            <th>Rate</th>
                                            <th>Amt</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {console.log("selectedItems=333=", selectedItems)}
                                        {selectedItems.map((item, index) => (
                                            <tr key={index}>
                                                <td contentEditable={true} >
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
                                                                <TextField {...params} label="Search Part No" onChange={handleChange} />
                                                            )}
                                                            onChange={(event, value) => onPartNoSelectChange(value, event)}
                                                        />
                                                    )}
                                                </td>
                                                <td contentEditable={!isPOView ? true : false}>{item.itemName}</td>
                                                <td contentEditable={!isPOView ? true : false}>{item.uom}</td>
                                                <td contentEditable={!isPOView ? true : false} onBlur={(e) => handleEdit('cdc_po', e.target.textContent, item.id, item)}>{item.cdc_po}</td>
                                                <td contentEditable={!isPOView ? true : false} onBlur={(e) => handleEdit('hsnCode', e.target.textContent, item.id, item)}>{item.hsnCode}</td>
                                                <td contentEditable={!isPOView ? true : false} onBlur={(e) => handleEdit('Qty', e.target.textContent, item.id, item)}>{item.qty}</td>
                                                {/* <td contentEditable={false} >{item.accQty}</td>
                                                <td contentEditable={isQcApprovalFlag === 'true' ? true : false} onBlur={(e) => handleEdit('rejQty', e.target.textContent, item.id, item)}>{item.rejQty}</td> */}
                                                <td contentEditable={!isPOView ? true : false}>{item.rate}</td>
                                                <td contentEditable={!isPOView ? true : false}>{item.amt}</td>
                                                <td contentEditable={!isPOView ? true : false} style={{ textAlign: 'center' }}>
                                                    {item.id === 'RDL1' ?
                                                        null
                                                        :
                                                        isPOView ?
                                                            <DeleteIcon
                                                                style={{ color: '#dddddd', cursor: 'pointer' }}
                                                            />
                                                            :
                                                            <DeleteIcon
                                                                onClick={() => {
                                                                    handleDeleteRow(item.id)
                                                                }}
                                                                style={{ color: 'black', cursor: 'pointer' }}
                                                            />
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                deleteService={CustomerDCDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />

        </div>
    )
}

export default NewCustomerDc
