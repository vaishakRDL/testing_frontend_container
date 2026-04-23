import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Button, Card, CircularProgress, CardContent, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Dialog, DialogTitle, DialogContent, Box, DialogActions } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import CreateDeliveryOrderTitle from './CreateDeliveryOrderTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { CustomerDropShowdata, DispatchCrtDelNote, DispatchDelShow, DispatchDelShowDataLis, DispatchGetContractPart, DispatchGetFim, DispatchGetId, DispatchSearchFim } from '../../ApiService/LoginPageService';
import Checkbox from '@mui/material/Checkbox';
import PartUploadModule from './PartUploadModule';
import ApplicationStore from '../../Utility/localStorageUtil';
import OpenPoModule from './OpenPoModule';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import WarningIcon from '@mui/icons-material/Warning';
import { useModuleLocks } from '../context/ModuleLockContext';

const CreateDeliveryOrderResult = () => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Create Delivery Note")?.lockStatus === "locked";

    const [customerError, setCustomerError] = useState(false);
    const [customerdateError, setCustomerDateError] = useState(false);
    const [error, setError] = useState(""); // Error message state
    const [loading, setLoading] = useState(false);
    const [Createloading, setCreateLoading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [partUpOpen, setPartUplaod] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [isTimeSlot, setIsTimeSlot] = useState(0);
    const [typeNo, setTypeNo] = useState(1);
    const [selectedCell, setSelectedCell] = useState([]);
    const [delNoteNo, setDelNotNo] = useState('');
    const [delDate, setDelDate] = useState('');
    const [DeliveryDate, setDeliveryDate] = useState('');
    const [timeslot, setTimeSlot] = useState('');
    const [location, setLocation] = useState('0');
    const [addDelNot, setAddDelNot] = useState([]);
    const [VehicleNo, setVehicalNo] = useState('');
    const [poNo, setPoNo] = useState('');
    const [customerSelectList, setCustomerSelectList] = useState([]);
    const [customerSelect, setCustomerSelect] = useState("");
    const [selectedCustomerName, setSelectedCustomerName] = useState("");
    const [warnings, setWarnings] = useState([]);
    const [warningModal, setWarningsModal] = useState(false);
    const [hasDispatchErrors, setHasDispatchErrors] = useState(false);
    console.log("selectedCustomerName111", customerSelect)

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const [arrayList, setArrayList] = useState([]);
    const [createList, setCreateList] = useState([]);
    const [DataList, setDataList] = useState([]);
    const [DispatchList, setDispatList] = useState([]);
    const [testing, setTesting] = useState('');
    const [openPoOpen, setOpenPoOpen] = useState(false);

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "deliveryschedule");

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    useEffect(() => {

    }, [typeNo]);

    const ClaerData = () => {

        setDeleteId('');
        setIsTimeSlot(0);
        setTypeNo(1);
        setSelectedCell([]);
        setDelNotNo('');
        setDelDate('');
        setDeliveryDate('');
        setTimeSlot('');
        setLocation('');
        setAddDelNot([]);
        setVehicalNo('');
        setPoNo('');
        setArrayList([]);
        setCreateList([]);
        setDataList([]);
        setDispatList([]);
        setTesting('');
    }

    const columns = [

        // {
        //     field: 'sNo',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             S.No
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 60,
        //     maxWidth: 60,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        {
            field: 'contractNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Contract/Part No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Qty
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    PO No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },


        {
            field: 'fimNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                FIM No
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'duty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Duty
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            maxWidth: 80,
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <DeleteDataLeftGrid selectedRow={params.row} />,
            ],
        },

    ];

    const selectAllData = (e) => {
        if (e.target.checked) {
            setArrayList(DispatchList);
        } else {
            setArrayList([]);
        }
    }


    const columns2 = [
        {
            field: 'actions1', // Changed field name to 'actions1'
            type: 'actions',
            flex: 1,
            maxWidth: 60,
            alignItems: 'center',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    <Checkbox
                        label='Select All'
                        onClick={selectAllData}
                    />
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <SelectAction selectedRow={params.row} />,
            ],
        },
        // {
        //     field: 'sNo',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             S.No
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     maxWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        {
            field: 'contractNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Contract/Part No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Qty
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'fimNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                FIM No
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'duty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Duty
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'actions2', // Changed field name to 'actions2'
            type: 'actions',
            flex: 1,
            maxWidth: 80,
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];


    function DeleteDataLeftGrid(props) {
        const handleDeleteRowData = (id) => {
            const updatedData = createList.filter((item) => item.id !== id)
            setCreateList(updatedData)
        }
        return (
            <DeleteIcon
                onClick={() => {
                    if (isModuleLocked) return;
                    // setDeleteId(props.selectedRow.id);
                    // setDeleteDailogOpen(true);
                    handleDeleteRowData(props.selectedRow.id)
                }}
                style={{ color: isModuleLocked ? 'gray' : 'black' }}
            />
        );
    }

    function DeleteData(props) {
        const handleDeleteRowData = (id) => {
            const updatedData = DispatchList.filter((item) => item.id !== id)
            setDispatList(updatedData)

            const hasErrors = updatedData.some(item => item.errorFlag === 1);
            setHasDispatchErrors(hasErrors);
            console.log("hasErrorshasErrorshasErrors", hasErrors)
        }

        return (
            <DeleteIcon
                onClick={() => {
                    if (isModuleLocked) return;
                    // setDeleteId(props.selectedRow.id);
                    // setDeleteDailogOpen(true);
                    handleDeleteRowData(props.selectedRow.id)
                }}
                style={{ color: isModuleLocked ? 'gray' : 'black' }}
            />
        );
    }


    const sampleData = [
        {
            id: 1,
            actions: "", // Add actions data if applicable
            contractNo: "001",
            fimNo: "FIM001",
            msd: "10",
            sheetName: "Sheet A"
        },
        {
            id: 2,
            actions: "",
            contractNo: "002",
            fimNo: "FIM002",
            msd: "20",
            sheetName: "Sheet B"
        },
        {
            id: 3,
            actions: "",
            contractNo: "003",
            fimNo: "FIM003",
            msd: "15",
            sheetName: "Sheet C"
        },
        // Add more sample data as needed
    ];


    useEffect(() => {
        DispatchGetFim(DispatchGetFimSuccess, DispatchGetFimException);
        DispatchGetId(DispatchGetIdSuccess, DispatchGetIdException);

    }, [refreshData]);


    useEffect(() => {
        DispatchGetContractPart({
            date: DeliveryDate,
            flag: typeNo
        }, handleDispatchGetContractPartSuccess, handleDispatchGetContractPartException);
    }, [typeNo, DeliveryDate]);

    const DispatchGetIdSuccess = (dataObject) => {
        setDelNotNo(dataObject?.delNoteNo || '');
    }

    const DispatchGetIdException = () => {

    }
    // useEffect(() => {

    //     // DispatchDelShow({
    //     //     date: DeliveryDate,
    //     //     fim: selectedCell
    //     // }, DispatchDelShowSuccess, DispatchDelShowException);


    // }, [refreshData, DeliveryDate, selectedCell]);

    const DispatchDelShowSuccess = (dataObject) => {
        setDispatList(dataObject?.data || []);
    }

    const DispatchDelShowException = () => {

    }
    const DispatchGetFimSuccess = (dataObject) => {
        setDataList(dataObject?.data || []);
    }

    const DispatchGetFimException = () => {

    }

    // function SelectAction(props) {
    //     console.log('======>',props?.selectedRow?.id );

    //     return (
    //         <Checkbox {...label}

    //         />
    //     );
    // }

    function SelectAction(props) {

        const onSelectedItem = () => {
            if (arrayList.some(item => item.id === props.selectedRow.id)) {
                // If the item is already in the list, remove it
                setArrayList(arrayList.filter(item => item.id !== props.selectedRow.id));
            } else {
                // If the item is not in the list, add it
                setArrayList([...arrayList, props.selectedRow]);
            }
        }

        return (
            <div style={{ display: 'flex' }}>
                <Checkbox
                    disabled={isModuleLocked}
                    checked={arrayList.some(item => item.id === props.selectedRow.id)}
                    onClick={onSelectedItem}
                />
            </div>
        );
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };



    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
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


    const options = DataList.map(item => ({
        id: item?.id,
        label: item?.contractNo
    }));

    const handleAutocompleteChange = (selectedValue) => {
        // setSelectedCell(selectedValue?.label);
        if (selectedValue !== null) {
            const idArray = selectedValue.map((item) => item.label)
            setSelectedCell(idArray)
        }
    };


    const textEntery = (e) => {
        DispatchSearchFim({
            text: e.target.value
        }, handleDispatchSearchFimSucees, handleDispatchSearchFimException);

    }

    const handleDispatchSearchFimSucees = (dataObject) => {
        setDataList(dataObject?.data || []);

    }

    const handleDispatchSearchFimException = () => {

    }

    const handleRowClick = (e) => {


    }


    const handleSubmit = async (event) => {
        setCreateLoading(true)
        event.preventDefault();
        DispatchCrtDelNote({
            delNoteNo: delNoteNo,
            delDate: delDate,
            vehicleNo: VehicleNo,
            poNo: poNo,
            deliveryDate: DeliveryDate,
            selectedCell: selectedCell,
            timeslot: timeslot,
            selectedValue: createList,
            isWareHouse: location,
            customerId: customerSelect
        }, DispatchCrtDelNoteSuccess, DispatchCrtDelNoteException);
    };

    const DispatchCrtDelNoteSuccess = (dataObject) => {
        setCreateLoading(false);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setRefreshData((oldvalue) => !oldvalue);
            ClaerData();

        }, 2000);
    }
    const DispatchCrtDelNoteException = (errorObject, errorMessage) => {
        setCreateLoading(false);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    const handleDispatchGetContractPartSuccess = (dataObject) => {
        setDataList(dataObject?.data || []);
    }

    const handleDispatchGetContractPartException = () => {

    }

    const handleDispatchDelShowDataLisSuccess = (dataObject) => {
        // setDispatList(dataObject?.data || []);
        // setWarnings(dataObject?.warnings || []);
        // dataObject?.warnings.length > 0 && setWarningsModal(true);
        // setLoading(false);
        const dispatchData = dataObject?.data || [];
        const warningData = dataObject?.warnings || [];

        setDispatList(dispatchData);
        setWarnings(warningData);

        if (warningData.length > 0) {
            setWarningsModal(true);
        }

        // ✅ Check if any object in dispatchData has errorFlag === 1
        const hasErrors = dispatchData.some(item => item.errorFlag === 1);
        setHasDispatchErrors(hasErrors);

        setLoading(false);
    }

    const handleDispatchDelShowDataLisException = () => {
        setLoading(false);

    }

    // ON CUSTOMER CHANGE
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

    ///Customer Select
    const optionsCustList = Array.isArray(customerSelectList)
        ? customerSelectList.map((item) => ({
            id: item?.id,
            cId: item?.cId,
            label: item?.cCode,
            cName: item?.cName,
        }))
        : [];

    function onCustomerSelectChange(selectedValue, value) {
        setSelectedCustomerName(selectedValue?.cName);
        setCustomerSelect(selectedValue?.id);
    }

    const handleAddClick = () => {
        setLoading(true)
        if (!selectedCustomerName) {
            setCustomerError(true);
            return;
        } else {
            setCustomerError(false); // Reset error if field is filled

        };
        if (!DeliveryDate) {
            setCustomerDateError(true);
            return;
        } else {
            setCustomerDateError(false); // Reset error if field is filled

        };

        DispatchDelShowDataLis(
            {
                customerId: customerSelect,
                date: DeliveryDate,
                type: typeNo,
                no: selectedCell
            },
            handleDispatchDelShowDataLisSuccess,
            handleDispatchDelShowDataLisException
        );
    };

    return (
        <div style={{ height: '80vh', width: '98%', marginLeft: '15px' }}>
            <CreateDeliveryOrderTitle

            />
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '-10px' }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={4} lg={6} xl={6} >
                                    <TextField
                                        id="filled-basic"
                                        label="Del-Note Ref No"
                                        variant="filled"
                                        size='small'
                                        fullWidth
                                        required
                                        value={delNoteNo}
                                        onChange={(e) => {
                                            setDelNotNo(e.target.value);
                                        }}
                                        placeholder="Delivery Order Ref No"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={4} lg={6} xl={6} >
                                    <TextField
                                        id="filled-basic"
                                        label="Vehicle No"
                                        variant="filled"
                                        size='small'
                                        fullWidth
                                        value={VehicleNo}
                                        onChange={(e) => {
                                            setVehicalNo(e.target.value)
                                        }}
                                        placeholder="Vehicle No"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Time Slot</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={timeslot}
                                            label="Time Slot"
                                            variant="filled"
                                            size='small'
                                            onChange={(e) => {
                                                setTimeSlot(e.target.value);
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                            placeholder="Time Slot"
                                        >
                                            <MenuItem value='8amto10am'>8am to 10am</MenuItem>
                                            <MenuItem value='10amto2pm'>10am to 2pm</MenuItem>
                                            <MenuItem value='2pmto5pm'>2pm to 5pm</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Location</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={location}
                                            label="Time Slot"
                                            variant="filled"
                                            size='small'
                                            onChange={(e) => {
                                                setLocation(e.target.value);
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                            placeholder="Time Slot"
                                        >
                                            <MenuItem value='0'>Customer Location</MenuItem>
                                            <MenuItem value='1'>Warehouse</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <Autocomplete
                                        fullWidth
                                        disablePortal
                                        id="combo-box-demo"
                                        required
                                        value={selectedCustomerName}
                                        options={optionsCustList}

                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Search Customer "
                                                variant="filled"
                                                onChange={handleChangeCustomer}
                                                error={customerError}
                                                helperText={customerError ? "Customer selection is required" : ""}
                                            />
                                        )}
                                        onChange={(event, value) =>
                                            onCustomerSelectChange(value, event)
                                        }
                                        size="small"
                                    />
                                </Grid>



                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <Card style={{ borderRadius: '8px', height: '100%', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                                        <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <DataGrid
                                                rows={createList}
                                                columns={columns}
                                                pageSize={8}
                                                rowsPerPageOptions={[8]}
                                                disableSelectionOnClick
                                                style={{ border: 'none', fontWeight: 'bold' }}
                                                sx={{
                                                    overflow: 'auto',
                                                    height: '50vh',
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
                                                    const rowIndex = createList.findIndex(row => row.id === params.row.id);
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
                            </Grid>

                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >

                                    <TextField
                                        id="filled-basic"
                                        label="Delivery Schedule Date"
                                        variant="filled"
                                        value={DeliveryDate}
                                        size='small'
                                        error={customerdateError}
                                        helperText={customerdateError ? "Customer Schedule Date is required" : ""}
                                        onChange={(e) => {
                                            setDeliveryDate(e.target.value);




                                        }}
                                        fullWidth
                                        required
                                        type='date'
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="Delivery Schedule Date"

                                    />
                                </Grid>


                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={typeNo}
                                            label="Time Slot"
                                            variant="filled"
                                            size='small'
                                            onChange={(e) => {
                                                setTypeNo(e.target.value);
                                                setError("");
                                                console.log('e.target.value==>', e.target.value);
                                                DispatchGetContractPart({
                                                    date: DeliveryDate,
                                                    flag: e.target.value,
                                                }, handleDispatchGetContractPartSuccess, handleDispatchGetContractPartException);
                                                // e.target.value == '0' && setOpenPoOpen(true)
                                                if (e.target.value === 0 && selectedCustomerName) {
                                                    setOpenPoOpen(true);
                                                } else if (e.target.value === 0 && !selectedCustomerName) {
                                                    setError("Please select customer serach first.");
                                                }
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                            placeholder="Category"
                                        >
                                            <MenuItem value={1}>Contract No</MenuItem>
                                            <MenuItem value={0}>Open Po</MenuItem>
                                        </Select>
                                        {error && <FormHelperText>{error}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={12} md={4} lg={6} xl={6} >
                                    <Autocomplete
                                        multiple
                                        id="checkboxes-tags-demo"
                                        options={options}
                                        disableCloseOnSelect
                                        isOptionEqualToValue={(option, value) => option.id === value.id} // Fix selection issue
                                        getOptionLabel={(option) => option.label}
                                        renderOption={(props, option, { selected }) => (
                                            <>
                                                {console.log("selected", selected)}
                                                <li {...props}>
                                                    <Checkbox
                                                        icon={icon}
                                                        checkedIcon={checkedIcon}
                                                        style={{ marginRight: 8 }}
                                                        checked={selected}
                                                    />
                                                    {option.label}
                                                </li>
                                            </>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Contract/Part No"

                                            />
                                        )}
                                        onChange={(event, value) => handleAutocompleteChange(value)}
                                    />


                                </Grid>
                                <Grid item xs={12} sm={12} md={3} style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }} >
                                    <Button
                                        variant="contained"
                                        style={{ width: '150px', height: '40px', background: isModuleLocked ? 'gray' : '#002D68', color: 'white' }}
                                        disabled={loading || isModuleLocked ||
                                            !selectedCustomerName ||
                                            !DeliveryDate}
                                        // onClick={() => {
                                        //     DispatchDelShowDataLis({
                                        //         date: DeliveryDate,
                                        //         type: typeNo,
                                        //         no: selectedCell
                                        //     }, handleDispatchDelShowDataLisSuccess, handleDispatchDelShowDataLisException);
                                        // }}
                                        onClick={handleAddClick}
                                    >
                                        {loading ? (
                                            <CircularProgress size={24} style={{ color: 'white' }} />
                                        ) : (
                                            'Add'
                                        )}
                                    </Button>
                                </Grid>
                                {/* {
                                    parseInt(typeNo) === 0 ? ( */}
                                {/* <Grid item xs={12} sm={12} md={3} style={{
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }} >
                                            <Button
                                                variant="contained"
                                                style={{ width: '200px', height: '40px', background: '#002D68', color: 'white' }}
                                                onClick={() => {
                                                    setPartUplaod(true);
                                                }}
                                            >
                                                Upload Part No
                                            </Button>
                                        </Grid> */}
                                {/* ) : (
                                        <></>
                                    )
                                } */}

                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                    <Card style={{ borderRadius: '8px', height: '100%', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>

                                        <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                                            <DataGrid
                                                rows={DispatchList}
                                                columns={columns2}
                                                pageSize={8}
                                                // loading={isLoading}
                                                onRowClick={handleRowClick}
                                                rowsPerPageOptions={[8]}
                                                disableSelectionOnClick
                                                style={{ border: 'none', fontWeight: 'bold' }}
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
                                                    const rowIndex = DispatchList.findIndex(row => row.id === params.row.id);
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
                                <Grid container spacing={2} style={{ marginTop: '5px', marginBottom: '20px' }}>
                                    <Grid item xs={12} sm={12} md={6} style={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}>
                                        <Button
                                            variant="contained"
                                            style={{ width: '65%', background: userPermission[0]?.addData === 0 || hasDispatchErrors || isModuleLocked ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 || hasDispatchErrors || isModuleLocked ? 'black' : 'white' }}
                                            disabled={userPermission[0]?.addData === 0 || hasDispatchErrors || isModuleLocked}
                                            onClick={(e) => {
                                                setCreateList(arrayList);
                                            }}
                                        >
                                            Add to Del-Note
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} style={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }} >
                                        <Button
                                            variant="contained"
                                            style={{ width: '65%', background: userPermission[0]?.addData === 0 || isModuleLocked ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 || isModuleLocked ? 'black' : 'white' }}
                                            // disabled={userPermission[0]?.addData === 0}
                                            disabled={userPermission[0]?.addData === 0 || Createloading || isModuleLocked}
                                            type='submit'
                                        >
                                            {Createloading ? (
                                                <CircularProgress size={24} style={{ color: 'white' }} />
                                            ) : (
                                                'Create Del-Note Order'  // Remove extra {}
                                            )}
                                        </Button>
                                    </Grid>

                                </Grid>
                            </Grid>
                            {/* </CardContent>
                            </Card> */}

                        </Grid>
                    </Grid>
                </form>

            </div>

            {/* <DeliveryOrderStatusModule
                isAddButton={isAddButton}
                editData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
            /> */}

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                // deleteService={AllMasterDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
            {/* <PartUploadModule
                open={partUpOpen}
                setOpen={setPartUplaod}
            /> */}

            <OpenPoModule
                openPoOpen={openPoOpen}
                setOpenPoOpen={setOpenPoOpen}
                DeliveryDate={DeliveryDate}
                delNoteNo={delNoteNo}
                setDispatList={setDispatList}
                DispatchList={DispatchList}
                customerSelect={customerSelect}
                setTypeNo={setTypeNo}
            />

            <Dialog
                open={warningModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                width='xl'
            >
                <DialogTitle id="alert-dialog-title">
                    WARNING <WarningIcon style={{ color: 'red' }} />
                </DialogTitle>
                <DialogContent>
                    <Box>
                        <div>
                            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
                                <tbody>
                                    {warnings && warnings.map((item, index) => (
                                        <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                                            <td style={{ whiteSpace: 'nowrap', padding: '10px', cursor: 'pointer' }}>{item}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setWarningsModal(false)
                    }}>Close</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default CreateDeliveryOrderResult
