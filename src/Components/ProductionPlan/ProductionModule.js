import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, FormLabel, RadioGroup, Radio, Card,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { CustomerSearch, CustomerSearchList, ItemSearchNAAJ, ItemfetchItemsSearch, SaleAddData, SaleGetId, SaleGetOrderNo, SaleOrderData, SaleOrderDataDelete, SaleOrderDataShow, SaleOrderDelete, SaleOrderImport, SaleOrderUpdateData, SaleUpdateData } from '../../ApiService/LoginPageService';
import { SaleOrderTemplate } from '../../ApiService/DownloadCsvReportsService';

const ProductionModule = ({
    open, setOpen, isAddButton, editeData, setRefreshData,
}) => {
    console.log("editeData...................>", editeData);
    const [POContractref, setPOContractref] = useState('');
    const [SalesOrderNo, setSalesOrderNo] = useState('');
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customerNameList, setCustomerNameList] = useState([]);
    const [customerId, setCustomerId] = useState('');
    const [typeOfOrder, setTypeOfOrder] = useState('');
    const [KANBANDeliveryOrder, setKANBANDeliveryOrder] = useState('');
    const [OrderPriority, setOrderPriority] = useState(false);
    const [isBatchProduction, setisBatchProduction] = useState(false);
    const [remarks, setRemark] = useState('');
    const [qty, setQty] = useState('');
    const [remarks2, setRemark2] = useState('');
    const [typeOfAdd, settypeOfAdd] = useState('Add');
    const [globalSalesId, setGlobalSalesId] = useState('');
    const [partData, setPartData] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [file, setFile] = useState(null);
    const [fileUpload, setFileUpload] = useState('');
    const [CustomerList, setCustomerList] = useState([]);
    const [Part, setPart] = useState('');
    const [PartName, setPartName] = useState('');
    const [itemId, setItemId] = useState('');
    const [PartList, setPartList] = useState([]);
    const [inAdd, setInAdd] = useState(true);
    const [inId, setId] = useState('');
    const [partCode, setPartCode] = useState('');


    useEffect(() => {
        if (open) {
            // if (!editeData) {
            // }
            // CustomerSearch(handleCustomerSearchSucces, handleCustomerSearchException);
            // ItemfetchItemsSearch(handleItemfetchItemsSearchSuccess, handleItemfetchItemsSearchException);
            LoadData();
            if (editeData.length === 0) {
                SaleGetOrderNo(handleSucessSaleGetOrderNo, handleExceptionSaleGetOrderNo);
                // SaleGetId(handleSaleGetIdSuccess, handleSaleGetIdException);

            }

        }
    }, [open, editeData]);

    const handleSucessSaleGetOrderNo = (dataObject) => {
        setSalesOrderNo(dataObject?.orderNo || '');
    }

    const handleExceptionSaleGetOrderNo = (errorObject, errorMessage) => {

    }


    const LoadData = () => {
        setCustomerName(editeData?.cCode || '');
        setTypeOfOrder(editeData?.typeOfOrder || '');
        setKANBANDeliveryOrder(editeData?.devliveryDate || '');
        setOrderPriority(editeData?.orderPriority || '');
        setRemark(editeData?.remarks || '');
        setPOContractref(editeData?.poRef || '');
        setSalesOrderNo(editeData?.orderNo || '');
        setCustomerId(editeData?.custId || '');
        setGlobalSalesId(editeData?.saleId || '');
        setisBatchProduction(editeData?.isBatchProduction || false);
        // setPartCode(editeData?.cCode || '');

        SaleOrderDataShow({
            salesId: editeData?.id
        }, handleSaleOrderDataShowSuccess, handleSaleOrderDataShowException);
    }

    const ClearData = () => {
        setPOContractref('');
        setCustomerName('');
        setTypeOfOrder('');
        setKANBANDeliveryOrder('');
        setPartCode('');
        setOrderPriority('');
        setRemark('');
        setQty('');
        setPartName('');
        setItemId('');
        setisBatchProduction(false);
        // if (isAddButton) {
        //     SaleOrderDelete({
        //         id: globalSalesId
        //     }, handleSaleOrderDeleteSuccess, handleSaleOrderDeleteException);
        // }
    }

    const handleSaleOrderDeleteSuccess = () => {

    }

    const handleSaleOrderDeleteException = () => {

    }
    const handleItemfetchItemsSearchSuccess = (dataObject) => {
        setPartList(dataObject?.data || []);
    }

    const handleItemfetchItemsSearchException = () => {

    }

    const handleCustomerSearchSucces = (dataObject) => {
        setCustomerList(dataObject?.data || []);
    }

    const handleCustomerSearchException = () => {

    }

    const handleSaleGetIdSuccess = (dataObject) => {
        setGlobalSalesId(dataObject?.id || '');
    }

    const handleSaleGetIdException = (errorObject, errorMessage) => {

    }

    const handleSubmit = (e) => {
        setLoading(true)
        e.preventDefault();
        if (isAddButton) {
            SaleAddData({
                saleId: globalSalesId,
                typeOfOrder: typeOfOrder,
                poRef: POContractref,
                customerId: customerId,
                devliveryOrder: KANBANDeliveryOrder,
                orderPriority: OrderPriority,
                file: fileUpload,
                remarks: remarks,
                orderNo: SalesOrderNo,
                isBatchProduction: isBatchProduction,
                isNpd: 1,
                itemLists: partData
            }, handleSaleAddDataSuccess, handleSaleAddDataException);
        } else {
            SaleUpdateData({
                id: editeData.id,
                saleId: globalSalesId,
                typeOfOrder: typeOfOrder,
                poRef: POContractref,
                customerId: customerId,
                devliveryOrder: KANBANDeliveryOrder,
                orderPriority: OrderPriority,
                file: fileUpload,
                remarks: remarks,
                orderNo: SalesOrderNo,
                isBatchProduction: isBatchProduction,
                isNpd: 1,
                itemLists: partData
            }, handleSaleAddDataSuccess, handleSaleAddDataException);
        }

    };

    const handleSaleAddDataSuccess = (dataObject) => {
        setLoading(false)
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setOpen(false);
        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            ClaerData();
            handleClose();
            setInAdd(true);
        }, 3000);
    }

    const handleSaleAddDataException = (errorObject, errorMessage) => {
        setLoading(false)
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    }

    const ClaerData = () => {
        setPOContractref('');
        setCustomerName('');
        setKANBANDeliveryOrder('');
        setOrderPriority(false);
        setRemark('');
        settypeOfAdd('Add');
        // setGlobalSalesId('');
    }
    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleChange = (e) => {
        setTypeOfOrder(e.target.value);
    }

    const columns = [
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Part Id
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Part Name
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Order QTY
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span>,

            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: 'black' }}
                onClick={(event) => {
                    setQty(props.selectedRow?.Qty || '');
                    setPartName(props.selectedRow?.itemCode || '')
                    setItemId(props.selectedRow?.itemId || '')
                    setPartCode(props?.selectedRow?.itemCode || '');
                    setPart(props?.selectedRow?.itemId || '');
                    setInAdd(false);
                    setId(props.selectedRow?.id || '');
                    setRemark2(props.selectedRow?.remarks || '')

                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    SaleOrderDataDelete({
                        id: props.selectedRow.id
                    }, DeleteSucess, DeleteException);
                }}
                style={{ color: 'black' }}
            />
        );
    }

    const DeleteSucess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            SaleOrderDataShow({
                salesId: globalSalesId
            }, handleSaleOrderDataShowSuccess, handleSaleOrderDataShowException);
        }, 2000);
    }

    const DeleteException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
    }

    function handleAutocompleteChange(selectedValue) {
        setPart(selectedValue?.id);
        setPartCode(selectedValue?.label);
        setPartName(selectedValue?.label);
        setItemId(selectedValue?.itemId);
    }

    function handleAutocompleteChangeCustomer(selectedValue) {
        setCustomerName(selectedValue?.label);
        setCustomerId(selectedValue?.id)
    }

    const options = customerNameList.map(item => ({
        id: item?.id,
        label: item?.label
    }));

    const option2 = PartList.map(item => ({
        id: item?.id,
        label: item?.label,
        itemId: item?.itemId
    }));

    const AddPartQty = () => {
        // if (inAdd) {

        //     SaleOrderData({
        //         saleId: globalSalesId,
        //         itemId: Part,
        //         Qty: qty,
        //         remarks: remarks2
        //     }, handleSaleOrderDataSuccess, handleSaleOrderDataEception);
        // } else {

        //     SaleOrderUpdateData({
        //         id: inId,
        //         saleId: globalSalesId,
        //         itemId: Part,
        //         Qty: qty,
        //         remarks: remarks2
        //     }, handleSaleOrderDataSuccess, handleSaleOrderDataEception);
        // }
        if (inAdd) {
            setPartData([...partData, { id: Part, itemCode: partCode, itemName: PartName, Qty: qty, remarks: remarks2, itemId: itemId }])
            setPart('');
            setPartCode('');
            setPartName('');
            setItemId('');
            setQty('');
            setRemark2('')
        } else {
            const updatedPartData = partData.map(part =>
                part.id === inId
                    ? { ...part, itemCode: partCode, itemName: PartName, Qty: qty, remarks: remarks2, itemId: itemId }
                    : part
            );
            setPartData(updatedPartData);
            setPart('');
            setPartCode('');
            setPartName('');
            setItemId('');
            setQty('');
            setRemark2('')
        }

    }

    const handleSaleOrderDataSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setPart('');
            setQty('');
            setInAdd(true);
            SaleOrderDataShow({
                salesId: globalSalesId
            }, handleSaleOrderDataShowSuccess, handleSaleOrderDataShowException);
        }, 2000);

    }

    const handleSaleOrderDataShowSuccess = (dataObject) => {
        setPartData(dataObject?.data || []);
    }

    const handleSaleOrderDataShowException = () => {

    }

    const handleSaleOrderDataEception = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
            setPart('');
            setPartName('');
            setQty('');
        }, 2000);
    }

    const textEntery = (e) => {

        ItemSearchNAAJ({
            text: e.target.value
        }, handleItemSearchNAAJSucees, handleItemSearchNAAJException);

    }

    const handleItemSearchNAAJSucees = (dataObject) => {
        setPartList(dataObject?.data || []);
    }

    const handleItemSearchNAAJException = () => {

    }

    const customerNameEnter = (e) => {
        CustomerSearchList({
            text: e.target.value
        }, handleCustomerSearchListSuccess, handleCustomerSearchListException);

    }

    const handleCustomerSearchListSuccess = (dataObject) => {
        setCustomerNameList(dataObject?.data || []);
    }

    const handleCustomerSearchListException = () => {

    }


    const SaleTemplateDownload = () => {
        SaleOrderTemplate(handleSaleOrderTemplateSuccess, handleSaleOrderTemplateException);
    }

    const handleSaleOrderTemplateSuccess = () => {

    }

    const handleSaleOrderTemplateException = () => {

    }

    const handleSaleOrderImportSuccess = (dataObject) => {
        setPartData(dataObject?.data || [])
        settypeOfAdd('Add');
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);

    }

    const handleSaleOrderImportException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add Order' : 'Edit Order'}

            </DialogTitle>
            <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        {/* <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>

                            <FormControl fullWidth

                            >
                                <InputLabel id="demo-simple-select-label">Type of Order</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={typeOfOrder}
                                    label="Customer Name"
                                    variant="filled"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={'Open Po | Contract | Advance Notification'}>Open Po | Contract | Advance Notification</MenuItem>
                                    <MenuItem value={'PO'}>PO</MenuItem>
                                    <MenuItem value={'R&D'}>R&D</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid> */}

                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <TextField
                                id="filled-basic"
                                label="Sales Order No"
                                variant="filled"
                                fullWidth
                                required
                                size='small'
                                value={SalesOrderNo}
                                placeholder="Sales Order No"
                                onChange={(e) => setSalesOrderNo(e.target.value)}
                                inputProps={{ readOnly: true }}
                            />

                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <TextField
                                id="filled-basic"
                                label="PO | Contract ref"
                                variant="filled"
                                fullWidth
                                size='small'
                                value={POContractref}
                                placeholder="PO | Contract ref"
                                onChange={(e) => setPOContractref(e.target.value)}

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>

                            <FormControl

                                style={{ width: '100%' }}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="combo-box-demo"
                                    options={options}
                                    size='small'
                                    value={customerName}
                                    // sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} variant="filled" label="Search By Customer Name"
                                        onChange={customerNameEnter}
                                    />}
                                    onChange={(event, value) => handleAutocompleteChangeCustomer(value)}
                                />
                            </FormControl>
                            {/* 
                            <FormControl fullWidth

                            >
                                <InputLabel id="demo-simple-select-label">Customer Name</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={customerName}
                                    label="Customer Name"
                                    variant="filled"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={10}>test1</MenuItem>
                                    <MenuItem value={20}>test2</MenuItem>
                                    <MenuItem value={30}>test3</MenuItem>
                                </Select>
                            </FormControl> */}
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <TextField
                                id="filled-basic"
                                label="KANBAN | Delivery Date"
                                variant="filled"
                                type='date'
                                fullWidth
                                required
                                value={KANBANDeliveryOrder}
                                InputLabelProps={{ shrink: true }}
                                placeholder="KAN BAN | Delivery Date"
                                onChange={(e) => setKANBANDeliveryOrder(e.target.value)}

                            />
                        </Grid> */}
                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: 'flex', justifyContent: 'center' }}>
                            <FormControl style={{ display: 'flex', flexDirection: 'column' }}>
                                <FormLabel id="demo-row-radio-buttons-group-label">Order Priority</FormLabel>
                                <div style={{ display: 'flex' }}>
                                    <FormControlLabel
                                        control={<Checkbox checked={OrderPriority} onChange={(e) => setOrderPriority(e.target.checked)} />}
                                        label="Urgent"
                                    />
                                    {/* <FormControlLabel control={<Checkbox />} label="Normal schedule " /> */}
                                </div>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <FormControl style={{ display: 'flex', flexDirection: 'column' }}>
                                {/* <FormLabel id="demo-row-radio-buttons-group-label">Batch production</FormLabel> */}
                                <div style={{ display: 'flex' }}>
                                    <FormControlLabel
                                        control={<Checkbox checked={isBatchProduction} onChange={(e) => setisBatchProduction(e.target.checked)} />}
                                        label="Batch production"
                                    />

                                </div>
                            </FormControl>
                        </Grid>
                        {
                            OrderPriority ? (
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <TextField
                                        id="filled-basic"
                                        label="Remarks"
                                        variant="filled"
                                        fullWidth
                                        multiline
                                        required
                                        value={remarks}
                                        placeholder="Remarks"
                                        onChange={(e) => setRemark(e.target.value)}

                                    />

                                </Grid>

                            ) : (<></>)
                        }

                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Typography>
                                PO | Contract
                            </Typography>

                            <TextField
                                style={{ width: '70%', marginLeft: '20px' }}
                                // variant="filled"
                                margin="dense"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            if (reader.readyState === 2) {
                                                setFileUpload(reader.result);
                                                setFile(reader.result);
                                            }
                                        };
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                                type="file" />

                        </Grid>

                        {/* <Grid item xs={12} sm={12} md={4} lg={4} xl={4}
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <Button
                                variant="contained"
                                // color="primary"
                                component="label"
                                htmlFor="upload-photo"
                                sx={{ backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
                            >
                                Brows
                            </Button>
                        </Grid> */}


                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={8} lg={8} xl={8} style={{ marginTop: '20px' }}>
                            <Card style={{ borderRadius: '8px', height: '45vh', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.5)' }}>
                                <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <DataGrid
                                        rows={partData}
                                        columns={columns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '50vh',
                                            // minHeight: '500px',
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                WebkitTextStrokeWidth: '0.6px',
                                                backgroundColor: '#93bce6',
                                                color: '#1c1919'

                                            },
                                            '& .MuiDataGrid-cell': {
                                                border: '1px solid #969696',
                                            },
                                            '& .MuiDataGrid-columnHeader': {
                                                border: '1px solid #969696', // Add border to column headers
                                            },
                                        }}
                                        getRowClassName={(params) => {
                                            // Find the index of the row within the rows array
                                            const rowIndex = partData.findIndex(row => row.id === params.row.id);
                                            // Check if the index is valid
                                            if (rowIndex !== -1) {
                                                console.log(' ');
                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return ''; // Return default class if index is not found
                                        }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />
                                </CardContent>
                            </Card>

                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{ marginTop: '20px' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <FormControl>
                                        {/* <FormLabel id="demo-row-radio-buttons-group-label">Type of Order</FormLabel> */}
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="row-radio-buttons-group"
                                            value={typeOfAdd}
                                            onClick={(e) => {
                                                settypeOfAdd(e.target.value);
                                            }}
                                        >
                                            <FormControlLabel value="Add" control={<Radio />} label="Add" />
                                            <FormControlLabel value="Upload" control={<Radio />} label="Upload" />
                                            {/* <FormControlLabel value="Duplicate" control={<Radio />} label="Duplicate" /> */}

                                            {/* <FormControlLabel value="advanceNotification" control={<Radio />} label="Advance Notification" /> */}
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                {
                                    typeOfAdd === 'Add' &&
                                    <>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <FormControl style={{ width: '100%' }}>
                                                <Autocomplete
                                                    fullWidth
                                                    disablePortal
                                                    id="combo-box-demo"
                                                    size='small'
                                                    options={option2}
                                                    value={partCode}
                                                    // sx={{ width: 300 }}
                                                    renderInput={(params) => <TextField {...params} variant="filled" label="Search By Item Code "
                                                        onChange={textEntery}
                                                    />}
                                                    onChange={(event, value) => handleAutocompleteChange(value)}
                                                />
                                            </FormControl>

                                            {/* <FormControl fullWidth

                                            >
                                                <InputLabel id="demo-simple-select-label">Part Id</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={customerName}
                                                    label="Part Id"
                                                    variant="filled"
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value={10}>test1</MenuItem>
                                                    <MenuItem value={20}>test2</MenuItem>
                                                    <MenuItem value={30}>test3</MenuItem>
                                                </Select>
                                            </FormControl> */}
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <TextField
                                                id="filled-basic"
                                                label="QTY"
                                                variant="filled"
                                                fullWidth
                                                multiline
                                                size='small'
                                                value={qty}
                                                placeholder="QTY"
                                                onChange={(e) => setQty(e.target.value)}

                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <TextField
                                                id="filled-basic"
                                                label="Remarks"
                                                variant="filled"
                                                fullWidth
                                                multiline
                                                size='small'
                                                value={remarks2}
                                                placeholder="Remarks"
                                                onChange={(e) => setRemark2(e.target.value)}

                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                            }}>
                                            <Button
                                                variant="contained"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: '#002D68',
                                                    height: '40px',
                                                    borderRadius: '20px',
                                                    width: '170px'
                                                }}
                                                onClick={AddPartQty}
                                            >
                                                {
                                                    inAdd ? 'Add' : 'Update'
                                                }

                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                // color="primary"


                                                sx={{ backgroundColor: '#002D68', height: '40px', borderRadius: '20px', width: '170px' }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onClick={() => {
                                                    setQty('');
                                                    setPartName('');

                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </>
                                }

                                {
                                    typeOfAdd === 'Duplicate' &&
                                    <>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                            <FormControl fullWidth >
                                                <InputLabel id="demo-simple-select-label">Schedule Ref Id</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={customerName}
                                                    label="Schedule Ref Id"
                                                    variant="filled"
                                                    size='small'
                                                    onChange={handleChange}
                                                >
                                                    <MenuItem value={10}>test1</MenuItem>
                                                    <MenuItem value={20}>test2</MenuItem>
                                                    <MenuItem value={30}>test3</MenuItem>
                                                </Select>
                                            </FormControl>

                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Button
                                                variant="contained"
                                                // color="primary"
                                                component="label"
                                                htmlFor="upload-photo"

                                                sx={{ backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                Add
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Button
                                                variant="contained"
                                                // color="primary"
                                                component="label"
                                                htmlFor="upload-photo"
                                                sx={{ backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </>

                                }

                                {
                                    typeOfAdd === 'Upload' &&
                                    <>
                                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>

                                            <TextField
                                                fullWidth
                                                // variant="filled"
                                                margin="dense"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        const reader = new FileReader();
                                                        reader.onload = () => {
                                                            if (reader.readyState === 2) {
                                                                setFileUpload(reader.result);
                                                                setFile(reader.result);
                                                            }
                                                        };
                                                        reader.readAsDataURL(e.target.files[0]);
                                                    }
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                                type="file" />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={12} xl={12}>
                                            <Button
                                                variant="contained"
                                                // color="primary"
                                                component="label"
                                                htmlFor="upload-photo"
                                                sx={{ backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}

                                                onClick={SaleTemplateDownload}
                                            >
                                                Download Template
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Button
                                                variant="contained"
                                                // color="primary"
                                                component="label"
                                                htmlFor="upload-photo"
                                                sx={{ backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                onClick={() => {
                                                    SaleOrderImport({
                                                        file: fileUpload
                                                    }, handleSaleOrderImportSuccess, handleSaleOrderImportException);
                                                }}
                                            >
                                                Upload
                                            </Button>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <Button
                                                variant="contained"
                                                // color="primary"
                                                component="label"
                                                htmlFor="upload-photo"
                                                sx={{ backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </>

                                }

                            </Grid>

                        </Grid>


                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '200px', background: '#002D68', color: 'white' }}
                        // disabled={
                        //     errorObject?.customerId?.errorStatus
                        //     || errorObject?.GSTNumber?.errorStatus
                        //     || errorObject?.customerName?.errorStatus
                        //     || errorObject?.billingAddress?.errorStatus
                        //     || errorObject?.address?.errorStatus
                        //     || errorObject?.shippingAddress?.errorStatus
                        //     || errorObject?.contactPersonName?.errorStatus
                        //     || errorObject?.primaryContactnumber?.errorStatus
                        //     || errorObject?.phoneNumber?.errorStatus
                        //     || errorObject?.email?.errorStatus
                        // }
                        type="submit"
                        disabled={loading}

                    >
                        {isAddButton ? 'Add Orders Input' : 'Update Orders Input'}
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);
                            ClearData();
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </form>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

        </Dialog>
    )
}

export default ProductionModule