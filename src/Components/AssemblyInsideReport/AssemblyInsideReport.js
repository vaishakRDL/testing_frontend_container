import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Box, Button, Card, CardContent, Checkbox, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { GetItemVsProcessItem, GetItemVsProcessProcessList, AddItemVsProcess, ProcessInspecReportViewId, AssemblyInspecReportInsideData } from '../../ApiService/LoginPageService';
import { useNavigate } from 'react-router-dom';
import { QualityAssemblyReportXl, QualityReport } from '../../ApiService/DownloadCsvReportsService';
import AssemblyInsideTitle from './AssemblyInsideTitle';
import QualityAssemblyReport from '../QualityAssemblyReport/QualityAssemblyReport';
// import FPIReportTitle from './FPIReportTitle';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const AssemblyInsideReport = ({ setIsFpiReport, id, reportType }) => {

    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const [dataset, setDataSet] = useState([]);
    const [customer, setCustomer] = useState('');
    const [machine, setMachine] = useState('');
    const [partNumber, setPartNumber] = useState('');
    const [operation, setOperation] = useState('');
    const [shift, setShift] = useState('');
    const [description, setDescription] = useState('');
    const [jobcardNo, setJobCardNo] = useState('');
    const [contractNo, setContractNo] = useState('')
    const [totalQty, setTotalQty] = useState('');
    const [addedBy, setaddedBy] = useState('');

    ////////////////////////////////////
    const [selectedItemId, setSelectedItemId] = useState('')


    const columns2 = [
        {
            field: 'qltyParameter',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Quality Parameter</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
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
            field: "uom",
            headerClassName: 'super-app-theme--header',
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>UOM </span>
            ),
            type: "string",
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "visual",
            headerClassName: 'super-app-theme--header',
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Visual</span>
            ),
            type: "string",
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "evalutionMethod",
            headerClassName: 'super-app-theme--header',
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Evaluation Method
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
            field: "actualResult",
            headerClassName: 'super-app-theme--header',
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Actual Result
                </span>
            ),
            type: "string",
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: "center",
            headerAlign: "center",
            editable: true,
        },



    ]

    useEffect(() => {
        AssemblyInspecReportInsideData({
            id: id
        }, handleProcessInspecReportViewIdSuccess, handleProcessInspecReportViewIdException);
    }, [refreshData]);

    const handleProcessInspecReportViewIdSuccess = (dataObject) => {
        setDataSet(dataObject?.data || []);
        setCustomer(dataObject?.data[0]?.customer || '');
        setMachine(dataObject?.data[0]?.machineCode || '');
        setPartNumber(dataObject?.data[0]?.itemCode || '');
        setOperation(dataObject?.data[0]?.process || '');
        setShift(dataObject?.data[0]?.shift || '');
        setContractNo(dataObject?.data[0]?.contractNo || '');
        setTotalQty(dataObject?.data[0]?.totQty || '');
        setaddedBy(dataObject?.data[0]?.addedBy || '');
    }

    const handleProcessInspecReportViewIdException = () => {

    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };


    const ClearData = () => {

    }

    const DownloadPOEntryTemplateSuccess = () => { };

    const DownloadPOEntryTemplateException = () => { };


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




    return (
        <div style={{ height: '60vh', width: '100%' }}>
            {reportType === "Rejected" ?
                ''
                :
                <AssemblyInsideTitle
                    setIsFpiReport={setIsFpiReport}
                    reportType={reportType}
                />
            }
            <Grid container spacing={2} padding={2}>

                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="Customer"
                        placeholder='Customer'
                        label='Customer'
                        variant="outlined"
                        value={customer}
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="Machine"
                        placeholder='Machine'
                        label='Machine'
                        variant="outlined"
                        value={machine}
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="Part No"
                        placeholder='Part Number'
                        label='Part Number'
                        variant="outlined"
                        value={partNumber}
                        style={{ color: "#000000" }}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="Operation"
                        placeholder='Operation'
                        label='Operation'
                        variant="outlined"
                        value={operation}
                        style={{ color: "#000000" }}
                    />
                </Grid>

                {/* <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
          <TextField
            fullWidth
            id="Shift"
            placeholder='Shift'
            label='Shift'
            variant="outlined"
            value={shift}
            style={{ color: "#000000" }}
          />
        </Grid> */}
                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="Contract No"
                        placeholder='Contract No'
                        label='Contract No'
                        variant="outlined"
                        value={contractNo}
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="Total Qty"
                        placeholder='Total Qty'
                        label='Total Qty'
                        variant="outlined"
                        value={totalQty}
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="User"
                        placeholder='User'
                        label='User'
                        variant="outlined"
                        value={addedBy}
                        style={{ color: "#000000" }}
                    />
                </Grid>
                <Grid
                    item
                    xs={12} sm={12} md={4} lg={3} xl={3}
                    container
                    justifyContent="center" // Aligns the button to the right end
                    alignItems={"center"}
                >
                    <Button {...buttonStyle1} style={{ marginRight: "20px" }}
                        onClick={() => {
                            QualityAssemblyReportXl({
                                id: id
                            },
                                DownloadPOEntryTemplateSuccess,
                                DownloadPOEntryTemplateException
                            );
                        }}
                    >
                        Download
                    </Button>
                </Grid>



                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Card
                            style={{
                                boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)',
                                borderRadius: '10px',
                                width: '98%',
                                height: '100%',
                            }}
                        >
                            <CardContent>
                                <Box
                                    sx={{
                                        height: '150%',
                                        width: '100%',
                                        '& .MuiDataGrid-columnHeaders': {
                                            backgroundColor: '#93bce6', // Set the background color for column headers
                                            color: '#1c1919', // Set the text color for column headers
                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696',
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696', // Add border to column headers
                                        },
                                    }}
                                >
                                    <DataGrid
                                        rows={dataset}
                                        columns={columns2}
                                        pageSize={8}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none' }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '50vh',
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                WebkitTextStrokeWidth: '0.6px',
                                            },
                                            '& .MuiDataGrid-cell': {
                                                border: '1px solid #969696',
                                            },
                                            '& .MuiDataGrid-columnHeader': {
                                                border: '1px solid #969696',
                                            },
                                            '& .MuiDataGrid-columnHeaders': {
                                                backgroundColor: '#93bce6', // Set background color for column headers
                                                color: '#1c1919', // Set text color for column headers
                                            },
                                        }}
                                        getRowClassName={(params) => {
                                            const rowIndex = dataset.findIndex(row => row.id === params.row.id);
                                            if (rowIndex !== -1) {
                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return '';
                                        }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </div>


                    {/* <div style={{ display: "flex", justifyContent: "space-around" }}>
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
                                    rows={dataset}
                                    columns={columns2}
                                    pageSize={8}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none', }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '50vh',
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
                                      getRowClassName={(params) => {
                                      
                                        const rowIndex = dataset.findIndex(row => row.id === params.row.id);
                                        
                                        if (rowIndex !== -1) {
                                            console.log(' ');
                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }
                                        return ''; 
                                    }}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                />
                            </CardContent>
                        </Card>
                    </div> */}
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

                {/* <Button {...buttonStyle1} style={{ marginRight: "20px" }}>
                    Next
                </Button>
                <Button
                    // type="submit"
                    {...buttonStyle1}
                    style={{ marginRight: "20px" }}

                >
                    Previous
                </Button> */}
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

export default AssemblyInsideReport;