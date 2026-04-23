import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Button, Card, CardContent, Checkbox, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { GetItemVsProcessItem, GetItemVsProcessProcessList, AddItemVsProcess, Processinspection } from '../../ApiService/LoginPageService';
import Box from '@mui/material/Box';
import { SelectChangeEvent } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { useLocation, useNavigate } from 'react-router-dom';
import InProcessTitle from './InProcessTitle';
import InProcessPopup from './InProcessPopup';
import InProcessReworkPopup from '../InProcessRework/InProcessReworkPopup2';
import InProcessReworksPopup1 from './InProcessReworksPopup1';
import InProcessScrapPopup1 from './InprocessScrapPopup1';
import InProcessFPIApprovedPopup from '../InProcessFPI/InProcessFPIApprovePopup';
import InProcessFPIreworkPopup from '../InProcessFPI/InProcessFPIreworkPopup';
import InProcessFPIScrapPopup from '../InProcessFPI/InProcessFPIScrapPopup';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const InProcessIn = ({ setIsProcessInsp, isSelectedData }) => {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [openRework, setopenRework] = useState(false)
    const [isAddButton, setIsAddButton] = useState(true);
    const [editeData, setEditeData] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [id, setId] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [itemList, setItemList] = useState([])
    const [processList, setProcessList] = useState([])
    const location = useLocation();
    const jcNo = new URLSearchParams(location.search).get("jcNo");
    const inspectionId = new URLSearchParams(location.search).get("inspectionId");
    ////////////////////////////////////
    const [selectedItemId, setSelectedItemId] = useState('')
    const [skipValues, setSkipValues] = useState({});
    const [qualityValues, setQualityValues] = useState({});
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    // console.log("CHECKBOX SELECTED", selectedRows)
    const [editedCycleTime, setEditedCycleTime] = useState({});
    const [editedProcessPriority, setEditedProcessPriority] = useState({});
    const [editCount, setEditCount] = useState({});
    const [editedSkip, setEditedSkip] = useState({});
    const [editedQuality, setEditedQuality] = useState({})
    const [excelModal, setExcelModal] = useState(false);
    const [copyFromModal, setCopyFromModal] = useState(false);
    const [inProOpen, setInproOpen] = useState(false);
    const [inProReworkOpen, setInproReworkOpen] = useState(false);
    const [inProScrapOpen, setInProScrapOpen] = useState(false);
    const [observationInspectionList, setObservationInspectionList] = useState([]);
    const [machineName, setMachineName] = useState('');
    const [itemCode, setItemCode] = useState('');
    const [customer, setCustomer] = useState('');
    const [type, setType] = useState('');
    const [shift2, setShift] = useState('');
    const [operation, setOperation] = useState('');
    const [itemName, setItemName] = useState('');
    const [fpiInspectionListUpdate, setFpiInspectionListUpdate] = useState([]);
    const [date, setDate] = useState('');

    const columns1 = [
        {
            field: 'process',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Process </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Select</span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <CheckBoxData disabled={true} color="success" selectedRow={params.row} />,
            ],
        },
    ];


    const columns2 = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SI No </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            // width:50,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'qltyParameter',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Quality Parameter </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "expVal",
            headerClassName: 'super-app-theme--header',
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Expected Value
                </span>
            ),
            type: "string",
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "minTolerance",
            headerClassName: 'super-app-theme--header',
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Min Tolerance
                </span>
            ),
            type: "string",
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "maxTolerance",
            headerClassName: 'super-app-theme--header',
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Max Tolerance
                </span>
            ),
            type: "string",
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: 'SpecificTolerance',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Specification with Tolerance </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'expVisInspec',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Visual</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'evalMethod',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Evaluation Method</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'actualResult',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actual Result</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: true,
        },


    ]

    useEffect(() => {
        Processinspection(
            { id: isSelectedData?.processId, jcNo: isSelectedData?.jcNo, type: 'Observation',item:isSelectedData?.item },
            handleObservationSucessShow,
            handleObservationExceptionShow
        );
        // GetItemVsProcessProcessList(handleItemVsProcessListSucessShow, handleItemVsProcessListExceptionShow);
    }, [refreshData]);
    const handleObservationExceptionShow = (errorObject,errorMessage) => { };


    const handleObservationSucessShow = (dataObject) => {
        setObservationInspectionList(dataObject?.data || []);
        const dataExtracted = dataObject?.data[0];
        setMachineName(dataExtracted?.machineName || '');
        setItemCode(dataExtracted?.itemCode || '');
        setCustomer(dataExtracted?.customer || '');
        setType(dataExtracted?.type || '');
        setShift(dataExtracted?.shift2 || '');
        setOperation(dataExtracted?.operation || '');
        setItemName(dataExtracted?.itemName || '');
        setDate(dataExtracted?.date || '')
        console.log("dataObject?.data", dataObject?.data)
    };



    const handleCycleTimeChange = (rowId, value) => {
        setEditedCycleTime({ ...editedCycleTime, [rowId]: value });
    };

    // Handle changes in Process Priority input field
    const handleProcessPriorityChange = (rowId, value) => {
        setEditedProcessPriority({ ...editedProcessPriority, [rowId]: value });
    };

    // Handle changes in Count input field
    const handleCountChange = (rowId, value) => {
        setEditCount({ ...editCount, [rowId]: value });
    };

    const handleSkipChange = (rowId, value) => {
        setEditedSkip({ ...editedSkip, [rowId]: value });
    };

    const handleQualityChange = (rowId, value) => {
        setEditedQuality({ ...editedQuality, [rowId]: value });
    };
    /////////////////////

    function SkipFieldsAction(props) {
        const { selectedRow } = props;

        const handleSkipChange = (e) => {
            const updatedSkipValues = { ...skipValues, [selectedRow.id]: e.target.value };
            setSkipValues(updatedSkipValues);
        };

        return (
            <>
                <FormControl fullWidth>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={skipValues[selectedRow.id] || ''}
                        label="Skip"
                        onChange={handleSkipChange}
                    >
                        <MenuItem value={'Y'}>Y</MenuItem>
                        <MenuItem value={'N'}>N</MenuItem>
                    </Select>
                </FormControl>
            </>
        );
    }

    function QualityFieldsAction(props) {
        const { selectedRow } = props;

        const handleQualityChange = (e) => {
            const updatedQualityValues = { ...qualityValues, [selectedRow.id]: e.target.value };
            setQualityValues(updatedQualityValues);
        };

        return (
            <>
                <FormControl fullWidth>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={qualityValues[selectedRow.id] || ''}
                        label="Quality"
                        onChange={handleQualityChange}
                    >
                        <MenuItem value={'Y'}>Y</MenuItem>
                        <MenuItem value={'N'}>N</MenuItem>
                    </Select>
                </FormControl>
            </>
        );
    }


    useEffect(() => {
        // GetItemVsProcessItem(handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
        // GetItemVsProcessProcessList(handleItemVsProcessListSucessShow, handleItemVsProcessListExceptionShow);
    }, [refreshData]);

    // GET ITEM DROPDOWN
    const handleItemVsProcessItemSucessShow = (dataObject) => {
        setItemList(dataObject?.data || []);
    }
    const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
    }

    // GET PROCESS DATAGRID PROCESS
    const handleItemVsProcessListSucessShow = (dataObject) => {
        setProcessList(dataObject?.data || []);
    }
    const handleItemVsProcessListExceptionShow = (errorObject, errorMessage) => {
    }

    function CheckBoxData(props) {
        const { selectedRow } = props;

        const handleCheckboxChange = (e) => {
            const updatedSelectedCheckboxes = { ...selectedCheckboxes, [selectedRow.id]: e.target.checked };
            setSelectedCheckboxes(updatedSelectedCheckboxes);

            const isChecked = e.target.checked;

            if (isChecked) {
                // If the checkbox is checked, add the selected row to the array
                setSelectedRows((prevSelectedRows) => [...prevSelectedRows, selectedRow]);
            } else {
                // If the checkbox is unchecked, remove the selected row from the array
                setSelectedRows((prevSelectedRows) =>
                    prevSelectedRows.filter((row) => row.id !== selectedRow.id)
                );
            }
        };

        return (
            <Checkbox
                {...label}
                checked={selectedCheckboxes[selectedRow.id] || false}
                onChange={handleCheckboxChange}
            />
        );
    }


    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleSubmitClick = () => {
        AddItemVsProcess(selectedRows, handleSuccess, handleException)
    }

    const handleSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
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
            // ClearData();
            // handleClose();
        }, 2000);
    };

    const ClearData = () => {
        // window.location.reload();
        setProcessList([]);
        setSelectedRows([]);
        setEditCount({});
        setEditedCycleTime({});
        setEditedProcessPriority({});
        setEditedSkip("NO");
        setEditedQuality("YES");
        setSelectedCheckboxes({});
        setTimeout(() => {
            GetItemVsProcessProcessList(handleItemVsProcessListSucessShow, handleItemVsProcessListExceptionShow);
        }, 1000);
    }

    const handleExcelModelOpen = () => {
        setExcelModal(true);
    }

    const handleCopyFromModelOpen = () => {
        setCopyFromModal(true);
    }

    const optionsSuppItemList = itemList.map(item => ({
        // let optionsSuppItemList = suppItemTestingArray.map(item => ({
        id: item.id,
        label: item.itemName,
        // schDate: item.schDate,
        // poQty: item.poQty
    }));

    const handleSupplierSearchItemChange = (value) => {
        console.log("handleSupplierSearchItemChange", value.id)
        // setSelectedItems((prevSelectedItems) => [...prevSelectedItems, value]);
        if (value !== null) {
            setSelectedItemId(value.id)
        }
    }
    const buttonStyle = {
        variant: "contained",
        // color: "primary",
        component: "label",
        sx: {
            marginRight: '8px',
            backgroundColor: '#002D68',
            height: '40px',
            borderRadius: '20px',
            width: '200px'
        }
    };
    const buttonStyle1 = {
        variant: "contained",
        // color: "primary",
        component: "label",
        sx: {
            marginRight: '8px',
            backgroundColor: '#002D68',
            height: '40px',
            borderRadius: '20px',
            width: '150px'
        }
    };

    const handleCellEdit = (params) => {
        const updatedList = observationInspectionList.map((supp) => {
            return supp.id === params.id ? { ...supp, actualResult: params.actualResult } : supp;
        });
        setFpiInspectionListUpdate(updatedList);
    };

    function formatDate(dateStr) {
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`;
    }

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <InProcessTitle
                setIsAddButton={setIsAddButton}
                setEditeData={setEditeData}
                setOpen={setOpen}
                setIsProcessInsp={setIsProcessInsp}
            />

            <Grid container spacing={2} padding={2}>
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                        fullWidth
                        id="Customer"
                        placeholder='Customer'
                        value={customer}
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                        fullWidth
                        id="Machine"
                        placeholder='Machine'
                        variant="outlined"
                        value={machineName}
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                        fullWidth
                        id="Date"
                        placeholder='Date'
                        type='date'
                        value={formatDate(date)}
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                        fullWidth
                        id="F-type"
                        placeholder='Inspection-type'
                        value={type}
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                        fullWidth
                        id="Part Number"
                        placeholder='Part Number'
                        variant="outlined"
                        value={itemCode}
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                        fullWidth
                        id="Operation"
                        placeholder='Operation'
                        value={operation}
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                        fullWidth
                        id="Shift"
                        placeholder='Shift'
                        value={shift2}
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                        fullWidth
                        id="Batch No"
                        placeholder='Batch No'
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                        fullWidth
                        id="Description"
                        placeholder='Description'
                        value={itemName}
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                        fullWidth
                        id="Jobcard No"
                        placeholder='Jobcard No'
                        variant="outlined"
                        value={isSelectedData?.jcNo}
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                        fullWidth
                        id="Total Qty"
                        placeholder='Total Qty'
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                        fullWidth
                        id="Status"
                        placeholder='Status'
                        variant="outlined"
                        style={{ color: "#000000" }}
                    />
                </Grid>


                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>

                        {/* Card for the left grid */}
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%' }}>
                            <CardContent>
                                {/* Autocomplete for the left grid */}

                                {/* DataGrid for the left grid */}
                                <DataGrid
                                    rows={observationInspectionList}
                                    columns={columns2}
                                    pageSize={8}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    processRowUpdate={handleCellEdit}
                                    style={{ border: 'none' }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '40vh',
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
                                        const rowIndex = observationInspectionList.findIndex(row => row.id === params.row.id);
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
                    </div>
                </Grid>


            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end" }}>
                <Button {...buttonStyle1} style={{ marginRight: '20px' }}
                    onClick={() => {
                        setInproOpen(true);
                    }}
                >
                    Approved
                </Button>
                <Button {...buttonStyle1} style={{ marginRight: '20px' }}
                    onClick={() => {
                        setInproReworkOpen(true);
                    }}
                >
                    Rework
                </Button>
                <Button {...buttonStyle1} style={{ marginRight: '20px' }}
                    onClick={() => {
                        setInProScrapOpen(true);
                    }}>
                    Scrap
                </Button>
                <Button {...buttonStyle1} style={{ marginRight: '20px' }}
                    onClick={() => {

                    }}
                >
                    Next
                </Button>
                <Button {...buttonStyle1} style={{ marginRight: '20px' }}
                    onClick={() => {

                    }}
                >
                    Previous
                </Button>
            </Grid>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            {/* <InProcessPopup
                setOpen={setInproOpen}
                open={inProOpen}
            /> */}


            <InProcessFPIApprovedPopup
                fpiInspectionList={fpiInspectionListUpdate}
                setOpenFPIApprovePopup={setInproOpen}
                OpenFPIApprovePopup={inProOpen}
                jobCardsNo={isSelectedData?.jcNo}
            />

            {/* <InProcessReworksPopup1
                setopenRework={setInproReworkOpen}
                inProReworkOpen={inProReworkOpen}
            /> */}

            <InProcessFPIreworkPopup
                setOpenFPIReworkPopup={setInproReworkOpen}
                OpenFPIReworkPopup={inProReworkOpen}
                jobCardsNo={isSelectedData?.jcNo}
                fpiInspectionList={fpiInspectionListUpdate}
            />

            {/* <InProcessScrapPopup1
                setopenScrap={setInProScrapOpen}
                inProScrapOpen={inProScrapOpen}
            /> */}

            <InProcessFPIScrapPopup
                setOpenFPIScrapPopup={setInProScrapOpen}
                OpenFPIScrapPopup={inProScrapOpen}
                jobCardsNo={isSelectedData?.jcNo}
                fpiInspectionList={fpiInspectionListUpdate}
            />
        </div>
    )
}

export default InProcessIn;