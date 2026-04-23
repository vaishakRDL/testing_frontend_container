import React, { useState, useEffect } from 'react'
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material'
import JobCardViewNewTitle from './JobCardViewNewTitle'
import { DataGrid } from '@mui/x-data-grid';
import JobCardViewNewModal from './JobCardViewNewModal';
import { GetPlanningMachine, ItemSearchNAAJ, GetJobCardShifts, GetJobCardViewData, ShortClose } from '../../ApiService/LoginPageService';
import { JobCardXlDownload } from '../../ApiService/DownloadCsvReportsService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Link, useLocation } from 'react-router-dom';
import { useModuleLocks } from '../context/ModuleLockContext';

const JobCardViewNewResult = () => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Job Card")?.lockStatus === "locked";

    const [submitloading, setsubmitLoading] = useState(false);
    const [downlaodloading, setdownlaodLoading] = useState(false);
    const [shortClose, setdShortClose] = useState(false);
    const [open, setOpen] = useState(false);
    const [machineList, setMachineList] = useState([]);
    const [selectedMachine, setSelectedMachine] = useState('');
    const [shiftList, setShiftList] = useState([]);
    const [selectedShift, setSelectedShift] = useState('');
    const [itemList, setItemList] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedToDate, setSelectedToDate] = useState('');
    const [thickness, setThickness] = useState('');
    const [jobcardViewLists, setJobCardViewLists] = useState([]);
    const [filteredJobcardViewLists, setfilteredJobCardViewLists] = useState([]);
    const [selectedRowJobCardNo, setSelectedRowJobCardNo] = useState('')
    const [totalWorkPlanned, setTotalWorkPlanned] = useState(0)
    const [isFilter, setIsFilter] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('all')
    const [selectedFilterRadio, setSelectedFilterRadio] = useState('');
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openShortCloseModal, setOpenShortCloseModal] = useState(false);
    const [remarks, setRemarks] = useState("");

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    // NAVIGATION FROM ORDER PLANNING JOBCARD STATUS
    const location = useLocation();
    const mrpMstId = new URLSearchParams(location.search).get('mrpMstId');
    const isJobCardStatus = new URLSearchParams(location.search).get('isJobCardStatus');
    const [fyFrom, setFyFrom] = useState("");
    const [fyTo, setFyTo] = useState("");
    useEffect(() => {
        GetPlanningMachine(handleMachineSuccess, handleMachineException)
        if (isJobCardStatus == 'true' || isJobCardStatus == 'false') {
            GetJobCardViewData({
                // machine: selectedMachine,
                fromDate: selectedDate,
                toDate: selectedToDate,
                type: selectedRadio,
                shift: selectedShift,
                part: selectedItem,
                thickness: thickness,
                mrpMstId: mrpMstId
            }, handleGetDataSucess, handleGetDataException)
        }
    }, [mrpMstId, isJobCardStatus])

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

    const handleMachineSuccess = (dataObject) => {
        setMachineList(dataObject?.data || [])
    }
    const handleMachineException = () => { }

    // SEARCH ITEM
    const handleItemChange = (e) => {
        ItemSearchNAAJ({ text: e.target.value }, handlePoItemSuccess, handlePoItemException);
        GetJobCardViewData({
            machine: selectedMachine,
            fromDate: selectedDate,
            toDate: selectedToDate,
            type: selectedRadio,
            shift: selectedShift,
            part: e.target.value,
            thickness: thickness
        }, handleGetDataSucess, handleGetDataException)
    }
    const handlePoItemSuccess = (dataObject) => {
        setItemList(dataObject?.data || []);
    }
    const handlePoItemException = () => { }

    // ADD ITEMS
    const handleSupplierItemChange = (value) => {
        if (value !== null) {
            setSelectedItem(value?.label)
        }
    };

    //SHIFTS HANDLER
    const handleShiftSucess = (dataObject) => {
        setShiftList(dataObject?.data || [])
    }
    const handleShiftException = () => { }

    const columns2 = [
        {
            field: "Thickness",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Thickness</span>
            ),
            type: "string",
            sortable: true,
            maxWidth: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "MRPID",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>MRP ID </span>
            ),
            type: "string",
            sortable: true,
            maxWidth: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "PartNumber",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Part No
                </span>
            ),
            type: "string",
            sortable: true,
            maxWidth: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "Description",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Description </span>
            ),
            type: "string",
            sortable: true,
            maxWidth: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "JobCardNo",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    JobCard No{" "}
                </span>
            ),
            type: "string",
            sortable: true,
            maxWidth: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "kanbanDate",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Kanaban Date
                </span>
            ),
            type: "string",
            sortable: true,
            maxWidth: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "addedBy",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Added By
                </span>
            ),
            type: "string",
            sortable: true,
            maxWidth: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        // {
        //   field: "reject",
        //   headerClassName: "super-app-theme--header",
        //   headerName: (
        //     <span style={{ fontWeight: "bold", fontSize: "16px" }}>Rejected</span>
        //   ),
        //   type: "string",
        //   sortable: true,
        //   maxWidth: 200,
        //   flex: 1,
        //   align: "center",
        //   headerAlign: "center",
        // },
        {
            field: "ProductType",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Product Type</span>
            ),
            type: "string",
            sortable: true,
            maxWidth: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        // {
        //     field: "CTime",
        //     headerClassName: "super-app-theme--header",
        //     headerName: (
        //         <span style={{ fontWeight: "bold", fontSize: "16px" }}>CTime</span>
        //     ),
        //     type: "string",
        //     sortable: true,
        //     maxWidth: 200,
        //     flex: 1,
        //     align: "center",
        //     headerAlign: "center",
        // },
        {
            field: "UOM",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>UOM</span>
            ),
            type: "string",
            sortable: true,
            maxWidth: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        // {
        //     field: "WorkPlanned",
        //     headerClassName: "super-app-theme--header",
        //     headerName: (
        //         <span style={{ fontWeight: "bold", fontSize: "16px" }}>Work Planned</span>
        //     ),
        //     type: "string",
        //     sortable: true,
        //     maxWidth: 200,
        //     flex: 1,
        //     align: "center",
        //     headerAlign: "center",
        // },
        {
            field: "Qty",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Qty</span>
            ),
            type: "string",
            sortable: true,
            maxWidth: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "ProducedQty",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Produced Qty</span>
            ),
            type: "string",
            sortable: true,
            maxWidth: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "jcType",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>JC Type</span>
            ),
            type: "string",
            sortable: true,
            maxWidth: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "status",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Status</span>
            ),
            type: "string",
            sortable: true,
            maxWidth: 200,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "action",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Action</span>
            ),
            width: 120,
            align: "center",
            headerAlign: "center",
            sortable: false,
            renderCell: (params) => {
                const isChecked = selectedRows.includes(params.row.id);
                const isCompleted = params.row.status === "Completed"; // <-- check status

                return (
                    <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isCompleted}                     // <-- disable if Completed
                        onChange={(e) => handleCheckboxChange(e, params.row)}
                        style={{
                            cursor: isCompleted ? "not-allowed" : "pointer",
                            height: "20px",
                            width: "20px"
                        }}
                    />
                );
            }
        }

    ];

    const handleCheckboxChange = (e, row) => {
        if (e.target.checked) {
            // Add row id when selected
            setSelectedRows((prev) => [...prev, row.id]);
        } else {
            // Remove row id when unchecked
            setSelectedRows((prev) => prev.filter((id) => id !== row.id));
        }
    };


    const handleCellClick = (params) => {
        // IGNORE action column click
        if (params.field === "action") return;

        // Otherwise continue your logic
        setOpen(true);
        setSelectedRowJobCardNo(params.row.JobCardNo);
    };

    // SUBMIT
    const handleSubmitClick = () => {
        setsubmitLoading(true)
        GetJobCardViewData({
            // machine: selectedMachine,
            fromDate: selectedDate,
            toDate: selectedToDate,
            type: selectedRadio,
            shift: selectedShift,
            part: selectedItem,
            thickness: thickness,
        }, handleGetDataSucess, handleGetDataException)
    }

    const handleGetDataSucess = (dataObject) => {
        setIsFilter(false);
        setsubmitLoading(false)
        setdShortClose(false)
        setJobCardViewLists(dataObject?.data || [])
        setTotalWorkPlanned(dataObject?.workPlanned || 0)
    }
    const handleGetDataException = () => {
        setsubmitLoading(false)

    }

    const handleCompleteClick = () => {
        setIsFilter(true)
        const filteredArray = jobcardViewLists.filter((item) => item.status === 'Completed');
        setfilteredJobCardViewLists(filteredArray);
    }
    const handlePendingClick = () => {
        setIsFilter(true)
        const filteredArray = jobcardViewLists.filter((item) => item.status === 'Pending');
        setfilteredJobCardViewLists(filteredArray);
    }
    const handleExceededClick = () => {
        setIsFilter(true)
        const filteredArray = jobcardViewLists.filter((item) => item.status === 'Exceeded');
        setfilteredJobCardViewLists(filteredArray);
    }

    const handleDownloadClick = () => {
        setdownlaodLoading(true)

        JobCardXlDownload({
            selectedDate: selectedDate,
            selectedToDate: selectedToDate,
            type: selectedRadio,
            selectedShift: selectedShift,
            selectedItem: selectedItem,
            thickness: thickness,
            mrpMstId: mrpMstId
        }, handleDownloadSuccess, handleDownloadException)
    }

    const handleDownloadSuccess = (dataObject) => {
        setdownlaodLoading(false)
        setNotification({
            status: true,
            type: 'success',
            message: "Download Success",
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const handleDownloadException = (errorObject, errorMessage) => {
        setdownlaodLoading(false)

        setNotification({
            status: true,
            type: 'error',
            message: "Failed to download",
        });
        setTimeout(() => {
        }, 2000);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleRadioChange = (event) => {
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
        setSelectedDate(fromDate ? fromDate.toISOString().split('T')[0] : '');
        setSelectedToDate(toDate ? toDate.toISOString().split('T')[0] : '');
    };


    const parseDate = (str) => {
        const [day, month, year] = str.split("-");
        return new Date(`${year}-${month}-${day}`);
    };

    // Helper: Format Date to "yyyy-MM-dd" (for <input type="date" />)
    const formatDateForInput = (date) => {
        return date.toISOString().split("T")[0];
    };

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("userDetails")) || {};
        if (stored.fyFrom && stored.fyTo) {
            const from = parseDate(stored.fyFrom);
            const to = parseDate(stored.fyTo);
            setFyFrom(formatDateForInput(from));
            setFyTo(formatDateForInput(to));
        }
    }, []);

    const isValidDateInRange = (value) => {
        const selected = new Date(value);
        const min = new Date(fyFrom);
        const max = new Date(fyTo);
        return selected >= min && selected <= max;
    };

    const handleFromDateChange = (e) => {
        const value = e.target.value;
        if (isValidDateInRange(value)) {
            setSelectedDate(value);
            setNotification({ status: false, type: "", message: "" });
        } else {
            setNotification({
                status: true,
                type: "error",
                message: "Please select a valid From-Date",
            });
        }
    };

    const handleToDateChange = (e) => {
        const value = e.target.value;
        if (isValidDateInRange(value)) {
            setSelectedToDate(value);
            setNotification({ status: false, type: "", message: "" });
        } else {
            setNotification({
                status: true,
                type: "error",
                message: "Please select a valid To-Date",
            });
        }
    };

    const handleShortClose = () => {
        setOpenShortCloseModal(true);

    }

    const handleSubmitShortClose = () => {
        ShortClose({ jcIds: selectedRows, remark: remarks }, handleShortCloseSuccess, handleShortCloseException)
    }

    const handleShortCloseSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            GetJobCardViewData({
                // machine: selectedMachine,
                fromDate: selectedDate,
                toDate: selectedToDate,
                type: selectedRadio,
                shift: selectedShift,
                part: selectedItem,
                thickness: thickness,
            }, handleGetDataSucess, handleGetDataException)
            setOpenShortCloseModal(false);
            setSelectedRows([]);
            setRemarks('');
        }, 2000);

    }

    const handleShortCloseException = (errorObject, errorMessage) => {

        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setRemarks('');
        }, 3000);
    }

    return (
        <Grid container spacing={2} padding={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', flexDirection: 'row' }}>
                {isJobCardStatus === 'true' &&
                    <Link to='/OrderPlaningResult' style={{ textDecoration: 'none' }}>
                        <Typography
                            sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                            variant="h5"
                        >
                            {`Order Planning>>`}
                        </Typography>
                    </Link>
                }
                {isJobCardStatus === 'false' &&
                    <Link to='/OrderPlaningNpdResult' style={{ textDecoration: 'none' }}>
                        <Typography
                            sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                            variant="h5"
                        >
                            {`NPD Order Planning>>`}
                        </Typography>
                    </Link>
                }


                <JobCardViewNewTitle />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormControl style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', borderRadius: '5px' }}>
                    <RadioGroup
                        aria-label="options"
                        name="options"
                        value={selectedFilterRadio}
                        onChange={handleRadioChange}
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
            </Grid>

            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <FormControl style={{ border: '1px solid #aeafb1', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', borderRadius: '5px' }}>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={selectedRadio}
                        onChange={(e) => setSelectedRadio(e.target.value)}
                    >
                        <FormControlLabel value="all" control={<Radio />} label="All" />
                        <FormControlLabel value="pending" control={<Radio />} label="Pending" />
                    </RadioGroup>
                </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                <TextField
                    fullWidth
                    id="Date"
                    placeholder="Date"
                    type="date"
                    variant="outlined"
                    size="small"
                    value={selectedDate}
                    label="From"
                    style={{ color: "#000000",/* marginRight: "10px" */ }}
                    InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                    onChange={handleFromDateChange}
                    inputProps={{
                        min: fyFrom,
                        max: fyTo,
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                <TextField
                    fullWidth
                    id="Date"
                    placeholder="Date"
                    type="date"
                    variant="outlined"
                    size="small"
                    value={selectedToDate}
                    label="To"
                    style={{ color: "#000000",/* marginRight: "10px" */ }}
                    InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                    onChange={handleToDateChange}
                    inputProps={{
                        min: fyFrom,
                        max: fyTo,
                    }}
                />
            </Grid>

            {/* <Grid item xs={12} sm={12} md={2} lg={2} xl={2} >
                <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label">
                        Machine
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        value={selectedMachine}
                        onChange={(e) => {
                            GetJobCardShifts({ machineName: e.target.value, date: selectedDate }, handleShiftSucess, handleShiftException)
                            setSelectedMachine(e.target.value)
                        }}
                        label="Machine"
                    >
                        {machineList.map((data) => (
                            <MenuItem key={data?.id} value={data?.machineName}>
                                {data?.machineName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid> */}

            {/* <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label">
                        Shift
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        value={selectedShift}
                        onChange={(e) => setSelectedShift(e.target.value)}
                        label="Shift"
                    >
                        {shiftList.map((data) => (
                            <MenuItem key={data?.shift} value={data?.shift}>
                                {data?.shift}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid> */}

            <Grid
                item xs={12} sm={12} md={1.5} lg={1.5} xl={1.5} >
                <TextField
                    fullWidth
                    placeholder='Thickness'
                    size="small"
                    value={thickness}
                    onChange={(e) => setThickness(e.target.value)}
                />
            </Grid>

            <Grid
                item xs={12} sm={12} md={2} lg={2} xl={2} >
                <Autocomplete
                    fullWidth
                    disablePortal
                    id="combo-box-demo"
                    options={itemList}
                    renderInput={(params) => <TextField {...params} label="Search Items" onChange={handleItemChange} />}
                    onChange={(event, value) => handleSupplierItemChange(value)}
                    size='small'
                />
            </Grid>

            <Grid
                item xs={12} sm={12} md={1} lg={1} xl={1} style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    style={{ height: '40px', width: '150px', backgroundColor: '#002d68' }}
                    onClick={handleSubmitClick}
                    disabled={submitloading}
                >
                    {submitloading ? (
                        <CircularProgress size={24} style={{ color: 'white' }} />
                    ) : (
                        "Submit   "
                    )}
                </Button>
            </Grid>
            <Grid
                item xs={12} sm={12} md={1} lg={1} xl={1} >
                <Button
                    variant="contained"
                    style={{ height: '40px', width: '130px', backgroundColor: !isModuleLocked ? '#002d68' : 'gray', color: !isModuleLocked ? '#ffffff' : '#000000' }}
                    onClick={handleDownloadClick}
                    disabled={downlaodloading || jobcardViewLists.length === 0 || isModuleLocked}
                >
                    {downlaodloading ? (
                        <CircularProgress size={24} style={{ color: 'white' }} />
                    ) : (
                        "Download"
                    )}
                </Button>
            </Grid>

            <Grid
                item xs={12} sm={12} md={1} lg={1} xl={1} >
                <Button
                    variant="contained"
                    style={{ height: '40px', width: '150px', backgroundColor: !isModuleLocked > 0 ? '#002d68' : 'gray', color: !isModuleLocked ? '#ffffff' : '#000000' }}
                    onClick={handleShortClose}
                    disabled={shortClose || isModuleLocked}
                >
                    {shortClose ? (
                        <CircularProgress size={24} style={{ color: 'white' }} />
                    ) : (
                        "Short Close"
                    )}
                </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    {/* Card for the left grid */}
                    <Card
                        style={{
                            boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                            borderRadius: "10px",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <CardContent>
                            <DataGrid
                                rows={isFilter ? filteredJobcardViewLists : jobcardViewLists}
                                columns={columns2}
                                pageSize={8}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                onCellClick={handleCellClick}
                                style={{
                                    border: "none",
                                    fontWeight: "bold",
                                    // minWidth: '50%',
                                    height: screenHeight - 410,
                                    fontFamily: "Arial", // Set the font family to Arial
                                    cursor: 'pointer'
                                }}
                                sx={{
                                    "& .super-app-theme--header": {
                                        WebkitTextStrokeWidth: "0.6px",
                                    },
                                    "& .MuiDataGrid-cell": {
                                        border: "1px solid #969696",
                                    },
                                    "& .MuiDataGrid-columnHeader": {
                                        border: "1px solid #969696", // Add border to column headers
                                    },
                                    "& .super-app-theme--header": {
                                        backgroundColor: "#93bce6",
                                        color: "#1c1919",
                                    },
                                }}
                                getRowClassName={(params) => {

                                    const status = params.row.status;
                                    if (status === "Completed") {
                                        return "MuiDataGrid-cell--jobComplete"; // Use a predefined class or return a string if needed
                                    }
                                    if (status === "Pending") {
                                        return "MuiDataGrid-cell--jobPending"; // You can still use CSS class approach as a fallback
                                    }
                                    if (status === "Exceeded") {
                                        return "MuiDataGrid-cell--jobExceeded"; // Alternative styles
                                    }
                                    return ""; // Return default class if index is not found
                                }}
                                rowHeight={40}
                                columnHeaderHeight={40}
                            />
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', columnGap: '50px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                                        <div
                                            style={{ width: '20px', height: '20px', backgroundColor: '#8be78b', cursor: 'pointer' }}
                                            onClick={handleCompleteClick}
                                        // onMouseEnter={(e) => (e.target.style.border = '1px solid #000000', e.target.style.borderRadius = '50px')}
                                        // onMouseLeave={(e) => (e.target.style.border = 'none', e.target.style.borderRadius = '0px')}
                                        ></div>
                                        <Typography>Completed</Typography>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                                        <div style={{ width: '20px', height: '20px', backgroundColor: '#f7e2a0', cursor: 'pointer' }} onClick={handlePendingClick}></div>
                                        <Typography>Pending</Typography>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                                        <div style={{ width: '20px', height: '20px', backgroundColor: '#f5a546', cursor: 'pointer' }} onClick={handleExceededClick}></div>
                                        <Typography>Exceeded</Typography>
                                    </div>
                                </div>

                                {/* <div>
                                    <Typography style={{ fontWeight: 'bold' }}>Total Work Planned : {totalWorkPlanned} Min</Typography>
                                </div> */}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Grid>
            <Modal
                open={openShortCloseModal}
                onClose={() => setOpenShortCloseModal(false)}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 3,
                    }}
                >
                    <Typography variant="h6" mb={2}>
                        Enter Remarks
                    </Typography>

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    />

                    <Box mt={3} display="flex" justifyContent="space-between">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSubmitShortClose()}
                        >
                            Submit
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setOpenShortCloseModal(false)}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>


            <JobCardViewNewModal
                open={open}
                setOpen={setOpen}
                selectedRowJobCardNo={selectedRowJobCardNo}
                selectedMachine={selectedMachine}
                setSelectedRowJobCardNo={setSelectedRowJobCardNo}

            />

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

        </Grid>
    )
}

export default JobCardViewNewResult