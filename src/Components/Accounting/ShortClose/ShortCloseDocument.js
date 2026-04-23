import { Autocomplete, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { CustomerDropShowdata, PartNoSelectShow, shortClosedSave, shortClseDocument } from '../../../ApiService/LoginPageService';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ApplicationStore from '../../../Utility/localStorageUtil';
import { type } from '@testing-library/user-event/dist/type';
import { useModuleLocks } from '../../context/ModuleLockContext';
const ShortCloseDocument = () => {
    const { userDetails } = ApplicationStore().getStorage("userDetails");

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Short Closed Document")?.lockStatus === "locked";

    const [document, setDocument] = useState('custPo');
    const [documentList, setDocumentList] = useState([]);
    const [docNo, setDocNo] = useState('');
    const [docNoList, setDocNoList] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('')
    const [selectedRadio, setSelectedRadio] = useState('');
    const [rows, setRows] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [unCheckInvoice, setUnCheckInvoice] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [saveLoad, setSaveLoad] = useState(false);
    const [customerSelectList, setCustomerSelectList] = useState([]);
    const [customerSelect, setCustomerSelect] = useState([]);
    const [partNo, setPartNo] = useState([]);
    const [partNoList, setPartNoList] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedFilterRadio, setSelectedFilterRadio] = useState('');
    const onDocumentChange = (e) => {
        setDocument(e.target.value);
    }

    const onDocNoChange = (e) => {
        setDocNo(e.target.value);
    }

    const handleRadioChange = (event) => {
        setSelectedRadio(event.target.value);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleRadioChangedateselect = (event) => {
        setSelectedFilterRadio(event.target.value);

        let fromDate = new Date();
        let toDate = new Date();

        switch (event.target.value) {
            case 'Today':
                fromDate = new Date();
                toDate = new Date();
                break;
            case 'Yesterday':
                fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - 1);
                toDate = new Date(fromDate);
                break;
            case 'This week':
                fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - fromDate.getDay());
                toDate = new Date();
                break;
            case 'Last week':
                fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - fromDate.getDay() - 7);
                toDate = new Date(fromDate);
                toDate.setDate(toDate.getDate() + 6);
                break;
            case 'This month':
                fromDate = new Date();
                fromDate.setDate(1);
                toDate = new Date();
                break;
            case 'Last month':
                fromDate = new Date();
                fromDate.setMonth(fromDate.getMonth() - 1);
                fromDate.setDate(1);
                toDate = new Date(fromDate);
                toDate.setMonth(toDate.getMonth() + 1);
                toDate.setDate(0); // Last day of the previous month
                break;
            default:
                fromDate = null;
                toDate = null; // For 'Custom' or other cases where a specific date isn't predefined
        }

        // selectedDate,selectedToDate
        setFromDate(fromDate ? fromDate.toISOString().split('T')[0] : '');
        setToDate(toDate ? toDate.toISOString().split('T')[0] : '');
    };

    // const handleCheckboxChange = (event, id) => {
    //     const updatedRows = rows.map((row) =>
    //         row.id === id
    //             ? {
    //                 ...row,
    //                 selected: event.target.checked,
    //                 isShortCls: true,
    //                 shortClosedDate: event.target.checked ? formatDate(new Date()) : "",
    //                 shortClosedBy: event.target.checked ? userDetails?.userName : "",
    //                 // pendQty: event.target.checked ? userDetails?.pendQty : "",
    //             }
    //             : row
    //     );
    //     setRows(updatedRows);
    // };
    const handleCheckboxChange = (event, id) => {
        // const isChecked = event.target.checked;

        const updatedRows = rows.map((row) =>
            row.id === id
                ? {
                    ...row,
                    selected: event.target.checked,
                    edited: true,
                    shortclsQty: event.target.checked ? row.pendQty : "",
                    isShortCls: event.target.checked,
                    shortclsDate: event.target.checked ? formatDate(new Date()) : "",
                    shortclsBy: event.target.checked ? userDetails?.userName : "",
                }
                : row
        );

        setRows(updatedRows);
    };


    const handleSelectAllChange = (event) => {
        const isChecked = event.target.checked;

        setSelectAll(isChecked);

        const updatedRows = rows.map((row) => ({
            ...row,
            selected: isChecked,
            isShortCls: isChecked,
            edited: true,
            shortclsQty: isChecked ? row.pendQty : "",
            // shortclsBy: event.target.checked ? userDetails?.userName : "",
            shortclsDate: isChecked ? formatDate(new Date()) : "",
            shortclsBy: isChecked ? userDetails?.userName : "",

            // Keep original pendQty
        }));

        setRows(updatedRows);
    };

    const handleChangeCustomer = (e) => {
        if (e !== null) {
            CustomerDropShowdata(
                { code: e.target.value },
                handleCustomerDropshow,
                handleCustomerDropshowException
            );
        }
    };

    const handleCustomerDropshow = (dataObject) => {
        setCustomerSelectList(dataObject?.data || []);
    };

    const handleCustomerDropshowException = (error, errorMessage) => { };
    const handleSearchItemChange = (value) => {
        if (value !== null) {
            const idArray = value.map((item) => item.id)
            setCustomerSelect(idArray)
        }
    };
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const handleChange = (e) => {
        PartNoSelectShow(
            { code: e.target.value, id: customerSelect },
            handlePartNoDropshow,
            handlePartNoDropshowException
        );
    };

    const handlePartNoDropshow = (dataObject) => {
        setPartNoList(dataObject?.data || []);
    };

    const handlePartNoDropshowException = (error, errorMessage) => { };

    const onPartNoSelectChange = (value) => {
        if (value !== null) {
            const idArray = value.map((item) => item.id)
            console.log("idArray", idArray)
            setPartNo(idArray)
        }
    }
    const columns = [
        {
            field: 'cCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cust Code</span>,
            type: 'string',
            sortable: true,
            // minWidth: 80,
            // flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cust Name</span>,
            type: 'string',
            sortable: true,
            minWidth: 120,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'sodigit',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SO No</span>,
            type: 'number',
            sortable: true,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
        },

        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Code</span>,
            type: 'string',
            sortable: true,
            minWidth: 140,
            align: 'center',
            flex: 1,
            headerAlign: 'center',
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Name</span>,
            type: 'string',
            sortable: true,
            minWidth: 140,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemGroup',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item GroupCode</span>,
            type: 'string',
            sortable: true,
            minWidth: 120,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM Code</span>,
            type: 'number',
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'soQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SO Qty</span>,
            type: 'number',
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cumQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Inv Cum Qty</span>,
            type: 'number',
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'pendQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Pend Qty</span>,
            type: 'number',
            sortable: false,
            minWidth: 100,
            align: 'center',
            flex: 1,
            headerAlign: 'center',
        },

        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>PO No</span>,
            type: 'string',
            sortable: false,
            minWidth: 120,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            // filterable: true, // ensure this is enabled

        },
        {
            field: 'poDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>PO Date</span>,
            type: 'number',
            sortable: false,
            minWidth: 120,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },

        {
            field: "shortClosed",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    ShortCloses
                </span>
            ),
            type: "number",
            sortable: true,
            minWidth: 200,

            // flex: 1,
            align: "center",
            headerAlign: "center",
            renderHeader: (params) => (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Typography style={{ fontWeight: "bold" }}>ShortCloses</Typography>
                    <Checkbox
                        disabled={isModuleLocked}
                        checked={selectAll}
                    /*disabled={selectedRadio === ''?true:false}*/ onChange={
                            handleSelectAllChange
                        }
                    />
                    <span
                        style={{ marginLeft: "5px", fontWeight: "bold", fontSize: "16px" }}
                    ></span>
                </div>
            ),
            renderCell: (params) => (
                <Checkbox
                    disabled={isModuleLocked}
                    checked={params.row.selected}
                    /*disabled={selectedRadio === ''?true:false}*/
                    onChange={(e) => handleCheckboxChange(e, params.row.id)}
                />
            ),
        },
        {
            field: 'shortclsBy',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Short Closed By</span>,
            type: 'number',
            sortable: false,
            minWidth: 120,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false,
        },
        {
            field: 'shortclsDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Short Closed Date</span>,
            type: 'number',
            sortable: false,
            minWidth: 120,
            align: 'center',
            flex: 1,
            headerAlign: 'center',
            editable: false,
        },
        {
            field: 'shortclsQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Short Closed Qty</span>,
            type: 'number',
            sortable: false,
            minWidth: 80,
            align: 'center',
            flex: 1,
            headerAlign: 'center',
            editable: false,
        },
    ];

    const onLoadShortClose = () => {
        setLoading(true);
        shortClseDocument({
            type: document,
            fromDate: fromDate,
            toDate: toDate,
            item: partNo,
            customer: customerSelect,
            category: selectedRadio
        }, handleShortCloseView, handleShortCloseException)
    }

    const handleShortCloseView = (dataObject) => {
        // setRows(dataObject?.data || []);
        const updatedList = (dataObject?.data || []).map((item) => ({
            ...item,
            edited: false,
        }));
        setRows(updatedList);

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }


    useEffect(() => {
        // Initialize with the current financial year based on today's date
        const today = new Date();
        const currentYear = today.getFullYear();
        const isAfterApril = today.getMonth() >= 3; // Checks if month is April or later (0-indexed)

        // Set the initial financial year range
        const initialFromDate = isAfterApril
            ? `${currentYear}-04-01`
            : `${currentYear - 1}-04-01`;
        const initialToDate = isAfterApril
            ? `${currentYear + 1}-03-31`
            : `${currentYear}-03-31`;

        setFromDate(initialFromDate);
        setToDate(initialToDate);
    }, []);


    const handleFromDateChange = (e) => {
        const selectedFromDate = e.target.value;
        setFromDate(selectedFromDate);

        const fromYear = new Date(selectedFromDate).getFullYear();
        const isAfterApril = new Date(selectedFromDate).getMonth() >= 3;

        const financialYearEnd = isAfterApril
            ? `${fromYear + 1}-03-31`
            : `${fromYear}-03-31`;

        setToDate(financialYearEnd);
    };
    const handleShortCloseException = (errorStaus, errorMessage) => {
        console.log(errorMessage);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        // setSaveLoad(true);

        const updatedArray = rows
            .filter((item) => item.edited === true) // Filter only selected items
            .map((item) => ({
                id: item.id,
                isShortCls: item.selected,
                shortclsQty: item.selected ? item.pendQty : "", // Add pendQty here

            }));
        const hasCheckedRows = updatedArray.some(item => item.isShortCls === true);

        console.log("updatedArray", updatedArray);

        shortClosedSave(
            {
                type: document,
                items: updatedArray,
                shortclsBy: hasCheckedRows ? userDetails?.userName : "",
                shortclsDate: hasCheckedRows ? formatDate(new Date()) : "",
            },
            handleUpdateSuccess,
            handleUpdateException
        );
    };


    const handleUpdateSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        shortClseDocument({
            type: document,
            fromDate: fromDate,
            toDate: toDate,
            item: partNo,
            customer: customerSelect,
            category: selectedRadio
        }, handleShortCloseView, handleShortCloseException)
        setTimeout(() => {
            handleClose();
            setRefreshData(oldValue => !oldValue);
            setSaveLoad(false);
        }, 2000);
    }

    const handleUpdateException = (errorObject, errorMessage) => {
        console.log(errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
            setRefreshData(oldValue => !oldValue);
            setSaveLoad(false);
        }, 2000);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Short Close Documents
                </Typography>
            </div>
            <form className="mt-2 space-y-6" onSubmit={onSubmit}>
                <Grid container spacing={2} padding={1}>
                    <Grid item xs={12} sm={11} md={11} lg={11} xl={11}>
                        <Grid container spacing={2}>
                            <FormControl style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', borderRadius: '5px', marginBottom: '10px' }}>
                                <RadioGroup
                                    aria-label="options"
                                    name="options"
                                    value={selectedFilterRadio}
                                    onChange={handleRadioChangedateselect}
                                    sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}
                                >
                                    <FormControlLabel
                                        value="Today"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Today"
                                    />
                                    <FormControlLabel
                                        value="Yesterday"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Yesterday"
                                    />
                                    <FormControlLabel
                                        value="This week"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="This week"
                                    />
                                    <FormControlLabel
                                        value="Last week"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Last week"
                                    />
                                    <FormControlLabel
                                        value="This month"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="This month"
                                    />
                                    <FormControlLabel
                                        value="Last month"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Last month"
                                    />
                                    <FormControlLabel
                                        value="Custom"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Custom"
                                    />
                                </RadioGroup>
                            </FormControl>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Document</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Document"
                                        placeholder='Document'
                                        value={document}
                                        size="small"
                                        style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                        onChange={(e) => onDocumentChange(e)}>
                                        <MenuItem value="Customer Delivery Challen">Customer Delivery Challen</MenuItem>
                                        <MenuItem value="custPo">Customer Po-Sale Order</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>

                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="Type"
                                        placeholder='Type'
                                        value={selectedRadio}
                                        size="small"
                                        style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                        onChange={(e) => handleRadioChange(e)}>
                                        <MenuItem value={1}>Short Closed</MenuItem>
                                        <MenuItem value={0}>Pending</MenuItem>
                                        <MenuItem value={2}>Both</MenuItem>

                                    </Select>
                                </FormControl>

                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    label="From Date"
                                    placeholder='From Date'
                                    variant="outlined"
                                    required
                                    type='Date'
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    onChange={handleFromDateChange}
                                    value={fromDate}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    label="To Date"
                                    placeholder='To Date'
                                    variant="outlined"
                                    required
                                    type='Date'
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    onChange={(e) => { setToDate(e.target.value) }}
                                    value={toDate}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>

                        </Grid>
                        <Grid container spacing={2} style={{ marginTop: '5px' }}>

                            <Grid item xs={12} sm={3} md={3} lg={3}>
                                <FormControl style={{ width: '100%', backgroundColor: '#ffffff', }}>
                                    <Autocomplete
                                        multiple
                                        id="checkboxes-tags-demo"
                                        options={customerSelectList}
                                        disableCloseOnSelect
                                        getOptionLabel={(option) => option.cCode}
                                        renderOption={(props, option, { selected }) => (
                                            <li {...props}>
                                                <Checkbox
                                                    icon={icon}
                                                    checkedIcon={checkedIcon}
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                />
                                                {option.cCode}
                                            </li>
                                        )}
                                        size="small"
                                        renderInput={(params) => <TextField {...params} label="Search Customer" onChange={handleChangeCustomer} />}
                                        onChange={(event, value) => handleSearchItemChange(value)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={3} md={3} lg={3}>
                                <FormControl style={{ width: '100%', backgroundColor: '#ffffff', }}>
                                    <Autocomplete
                                        multiple
                                        id="checkboxes-tags-demo"
                                        options={partNoList}
                                        disableCloseOnSelect
                                        getOptionLabel={(option) => option.label}
                                        renderOption={(props, option, { selected }) => (
                                            <li {...props}>
                                                <Checkbox
                                                    icon={icon}
                                                    checkedIcon={checkedIcon}
                                                    style={{ marginRight: 8 }}
                                                    checked={selected}
                                                />
                                                {option.label}
                                            </li>
                                        )}
                                        disabled={!customerSelect}
                                        size="small"
                                        renderInput={(params) => <TextField {...params} label="Search Part No" onChange={handleChange} />}
                                        onChange={(event, value) => onPartNoSelectChange(value)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                                <Button disabled={loading === true} variant="contained" style={{ height: '30px', backgroundColor: '#002d68' }} onClick={onLoadShortClose} >
                                    {loading ? (
                                        <CircularProgress size={24} style={{ color: 'white' }} />
                                    ) : 'Load'}
                                </Button>

                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%', border: '1px solid black', }}>
                            <CardContent>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: '5px' }}>
                                    <Button disabled={saveLoad === true || isModuleLocked} variant="contained" type="submit" style={{ height: '30px', backgroundColor: isModuleLocked ? "gray" : '#002d68' }}>
                                        {saveLoad ? (
                                            <CircularProgress size={24} style={{ color: 'white' }} />
                                        ) : 'SAVE'}
                                    </Button>
                                </div>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
                                    pageSize={8}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                    style={{ border: 'none', }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '60vh',
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
                                />
                            </CardContent>
                        </Card>

                    </Grid>

                </Grid>
            </form>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div>
    )
}

export default ShortCloseDocument
