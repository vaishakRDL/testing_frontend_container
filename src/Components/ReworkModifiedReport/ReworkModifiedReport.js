import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Button, Card, CardContent, Checkbox, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { GetItemVsProcessItem, GetItemVsProcessProcessList, AddItemVsProcess } from '../../ApiService/LoginPageService';
import { useNavigate } from 'react-router-dom';
import ReworkModifiedTitle from './ReworkModifiedTitle';
// import FPIReportTitle from './FPIReportTitle';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const ReworkModifiedReport = () => {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
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
    const [OpenFPIReworkPopup,setOpenFPIReworkPopup]= useState(false);
    const [OpenFPIApprovePopup,setOpenFPIApprovePopup]= useState(false);
    const [OpenFPIScrapPopup,setOpenFPIScrapPopup]= useState(false);
   

    const columns2 = [
        {
            field: 'Parameter',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Parameter</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'Specification',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Specification</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'Evaluation Method',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Evaluation Method</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'LPI',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rework</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
       
       
        
    ]

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


   

    const handleSupplierSearchItemChange = (value) => {
        console.log("handleSupplierSearchItemChange", value.id)
        // setSelectedItems((prevSelectedItems) => [...prevSelectedItems, value]);
        if (value !== null) {
            setSelectedItemId(value.id)}
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
          
           

    return (
        <div style={{ height: '60vh', width: '100%' }}>
           
<ReworkModifiedTitle/>
<Grid container spacing={2} padding={2}>

                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                    fullWidth
                        id="Customer"
                        placeholder='Customer'
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
                        style={{ color: "#000000" }}
                        />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                    fullWidth
                        id="Part No"
                        placeholder='Part Number'
                        variant="outlined"
                        style={{ color: "#000000" }}
                        />
                </Grid>
                
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                    fullWidth
                        id="Operation"
                        placeholder='Operation'
                        variant="outlined"
                        style={{ color: "#000000" }}
                        />
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                    fullWidth
                        id="Shift"
                        placeholder='Shift'
                        variant="outlined"
                        style={{ color: "#000000" }}
                        />
                </Grid>
               
                <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                    <TextField
                    fullWidth
                        id="Description"
                        placeholder='Description'
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
                 
             
               
               
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    
                    {/* Card for the left grid */}
                    <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%' }}>
                        <CardContent>
                            {/* Autocomplete for the left grid */}
                           
                            {/* DataGrid for the left grid */}
                            <DataGrid
                                rows={processList.map((row) => ({
                                    ...row,
                                    selected: selectedCheckboxes[row.id] || false,
                                    item: selectedItemId,
                                    cycleTime: editedCycleTime[row.id] || row.CycleTime,
                                    processPriority: editedProcessPriority[row.id] || row.processPriority,
                                    count: editCount[row.id] || row.count,
                                    skip: editedSkip[row.id] || 'NO',
                                    quality: editedQuality[row.id] || 'YES'
                                }))}
                                columns={columns2}
                                pageSize={8}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ border: 'none' }}
                                sx={{
                                    overflow: 'auto',
                                    height: '45vh',
                                    width: '100%',
                                    '& .super-app-theme--header': {
                                        WebkitTextStrokeWidth: '0.6px',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        border: '1px solid #969696',
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        border: '1px solid #969696', // Add border to column headers
                                    },
                                }}

                                rowHeight={40}
                                columnHeaderHeight={40}
                            />
                        </CardContent>
                    </Card>
                </div>
            </Grid>

           
        </Grid>
        <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Button {...buttonStyle1} style={{ marginRight: "20px" }}>
          Next
        </Button>
        <Button
          // type="submit"
          {...buttonStyle1}
          style={{ marginRight: "20px" }}
         
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
        </div>
    )
}

export default ReworkModifiedReport;