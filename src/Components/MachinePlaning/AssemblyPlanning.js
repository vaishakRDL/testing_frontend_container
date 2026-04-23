import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Button, CircularProgress, Card, Typography, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import { AssemblyFilterDropdown, FilterAssemblyTable, GetAssemblyPlanningFIM, ShipmentDatePlanning, ShowAssemblyPlanning } from '../../ApiService/LoginPageService';
import { DownloadAssemblyPlanningXLData, DownloadShipMentPlanningXLData } from '../../ApiService/DownloadCsvReportsService'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';

const AssemblyPlanning = () => {
    const [submitloading, setSubmitLoading] = useState(false);
    const [downloadloading, setdownloadLoading] = useState(false);

    const [isLoading, setGridLoading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [sobDataList, setSobDataList] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [fimList, setFimList] = useState([]);
    const [selectedFIM, setSelectedFIM] = useState('')
    const [selectedMachine, setSelectedMachine] = useState('')
    const [selectedDate, setSelectedDate] = useState('');
    const [shipmentDate, setShipmentdDate] = useState('');
    const [thickness, setThickness] = useState('');
    const [shipmentDateList, setShipmentDateList] = useState([])
    const [assemblyPlanningList, setAssemblyPlanningList] = useState([])
    const [totalContractCount, setTotalContractCount] = useState('')
    const [assemblyPlanningColumn, setAssemblyPlanningColumn] = useState([])
    const [downloadDisable, setDownloadDisable] = useState(true);
    const [isAllSelect, setIsAllSelect] = useState(true)
    const [aseemblyType, setAssemblyType] = useState('Contract')

    const [contractNoListData, setContractNoListData] = useState([]);
    const [partNoListData, setPartNoListData] = useState([]);
    const [selectedContractNo, setSelectedContractNo] = useState('');
    const [selectedPartNo, setSelectedPartNo] = useState('');

    const noDatacolumns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Code
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'description',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Description
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'refNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Reference no
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    PO no
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Quantity
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'producedQty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Produced Quantity
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'cTime',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Cycle Time
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'totCTime',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Total Cycle Time
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
    ];

    const noDatacolumnsshiptment = [
        {
            field: 'sNo1',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode1',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Code
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'Qty1',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Total Quantity
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'cTime1',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Cycle Time
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },


    ];

    useEffect(() => {
        document.title = 'Assembly Planning';
        GetAssemblyPlanningFIM(handlePlanningFIMSuccess, handlePlanningFIMFailed)
    }, [refreshData]);

    const handlePlanningFIMSuccess = (dataObject) => {
        setFimList(dataObject?.data || []);
    }
    const handlePlanningFIMFailed = (errorObject, errorMessage) => {
    }

    const options = sobDataList.map(item => ({
        id: item?.id,
        label: item?.contractNo
    }));

    const handleSubmitPress = () => {
        setGridLoading(true);
        setSubmitLoading(true);
        setSelectedContractNo("");
        setSelectedPartNo("");

        if (aseemblyType === "Contract") {
            ShowAssemblyPlanning(
                {
                    kanbanDate: selectedDate,
                    fim: isAllSelect ? '' : selectedFIM,
                },
                showAssemblyPlanningSuccess,
                showAssemblyPlanningFailed
            );
        } else {
            ShipmentDatePlanning(
                {
                    shipmentDate: shipmentDate,
                    fim: isAllSelect ? '' : selectedFIM,
                },
                showshipmentDatePlanningSuccess,
                showshipmentDatePlanningFailed
            );
        }

        AssemblyFilterDropdown({
            kanbanDate: selectedDate,
            fim: isAllSelect ? '' : selectedFIM
        }, filterDropdownSuccess, filterDropdownException)
    };

    //FILTER TABLE
    const filterDropdownSuccess = (dataObject) => {
        setContractNoListData(dataObject?.contractNos || []);
        setPartNoListData(dataObject?.partNos || []);
    }
    const filterDropdownException = () => { }

    const showshipmentDatePlanningSuccess = (dataObject) => {
        setGridLoading(false);
        setSubmitLoading(false);

        setDownloadDisable(dataObject?.data.length > 0 ? false : true);

        setShipmentDateList(dataObject.data)
    };
    const showshipmentDatePlanningFailed = () => {
        setSubmitLoading(false);

    };


    const showAssemblyPlanningSuccess = (dataObject) => {
        setGridLoading(false);
        setSubmitLoading(false);

        setDownloadDisable(dataObject?.data.length > 0 ? false : true);
        setAssemblyPlanningList(dataObject?.data || []);
        setTotalContractCount(dataObject?.totalContractCount || '');

        // DYNAMICALLY CREATE HEADER USING ARRAY KEY
        const headerNameMapping = {
            // id: 'S.No',
            // itemcode: 'Item Code',
            // itemcode: 'Item Code',
            // cycletime: 'Cycle Time',
            // totqty: 'Total Quantity',
            // totalcycletime: 'Total Cycle Time',
            sNo: 'S.No',
            itemCode: 'Item Code',
            description: 'Item Description',
            refNo: 'Reference no',
            poNo: 'PO no',
            Qty: 'Quantity',
            producedQty: 'Produced Quantity',
            cTime: 'Cycle Time',
            totCTime: 'Total Cycle Time',
        };

        const dynamicColumn = Object.keys(dataObject?.data.length > 0 && dataObject?.data[0])
            .filter((key) => key.toLowerCase() !== 'id')  // Exclude 'id' field
            .map((key) => ({
                field: key,
                headerName: key,
                // width: 150,
                type: 'string',
                headerClassName: 'super-app-theme--header',
                sortable: true,
                minWidth: 100,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
                renderHeader: (params) => (
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        {headerNameMapping[key.toLowerCase()] || key}
                    </span>
                ),
            }));
        setAssemblyPlanningColumn(dynamicColumn)

    }

    const showAssemblyPlanningFailed = (errorObject, errorMessage) => {
        setGridLoading(false);
        setSubmitLoading(false);

    }

    const arrayToWorksheet = (array, keyMapping, columnWidths) => {
        // Change the key names in each object according to keyMapping
        const transformedArray = array.map(obj =>
            Object.fromEntries(Object.entries(obj).map(([key, value]) =>
                [keyMapping[key] || key, value]
            ))
        );

        const worksheet = XLSX.utils.json_to_sheet(transformedArray);

        // Set column widths
        if (columnWidths) {
            worksheet['!cols'] = columnWidths.map(width => ({ width }));
        }

        return worksheet;
    };

    const downloadExcelFile = (worksheet, filename) => {
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        XLSX.writeFile(workbook, filename);
    };

    const handleDownload = (data) => {
        // Define a key mapping for renaming keys
        const keyMapping = {
            'sNo': 'SNo',
            'rmThickness': 'Thickness',
            'mrpNo': 'MRP ID',
            'itemCode': 'Part Number',
            'itemName': 'Description',
            'jcNo': 'Job Card No',
            'kanbanDate': 'Kanban Date',
            'category': 'Product Type',
            'cycleTime': 'Cycle Time',
            'uom': 'UOM',
            'Qty': 'Quantity',
            'workPlanned': 'Work Planned',
            // Add more key mappings as needed
        };

        // Define column widths (optional)
        const columnWidths = [15, 20, 25, 25, 25, 25, 25, 25, 25];


        const worksheet = arrayToWorksheet(data, keyMapping, columnWidths);
        downloadExcelFile(worksheet, 'Machine_Planning.xlsx');
    };

    const handleDownloadAssemblyPlanning = () => {
        setdownloadLoading(true);
        if (aseemblyType === "Contract") {
            DownloadAssemblyPlanningXLData(
                {
                    kanbanDate: selectedDate,
                    fim: isAllSelect ? '' : selectedFIM
                },
                handleDownloadSucess, handleDownloadFailed
            )
        }
        else {
            DownloadShipMentPlanningXLData(
                {
                    shipmentDate: shipmentDate,
                    fim: isAllSelect ? '' : selectedFIM
                },
                handleDownloadSucess, handleDownloadFailed
            )
        }
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleDownloadSucess = (dataObject) => {
        setdownloadLoading(false);

        console.log("dataObject", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: "Download Success",
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    };

    const handleDownloadFailed = (errorObject, errorMessage) => {
        setdownloadLoading(false);

        console.log("errorMessage", errorMessage);
        console.log("errorObject", errorObject);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage?.message,
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
    };

    return (
        <div style={{ height: '80vh', width: '100%' }}>

            <div style={{ display: 'flex', justifyContent: 'space-around' }}>


                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={1.5} xl={1.5} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label"> Assembly Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Assembly Type"
                                placeholder='Assembly Type'
                                variant="filled"
                                size='small'
                                value={aseemblyType}
                                onChange={(e) => {
                                    setAssemblyType(e.target.value)
                                    setShipmentDateList([]);
                                    setShipmentdDate('')
                                    setSelectedFIM('')
                                    setSelectedDate('');
                                }}
                                required
                            >
                                <MenuItem value={"Contract"}>Contract</MenuItem>
                                <MenuItem value={"FIM"}>FIM</MenuItem>

                            </Select>
                        </FormControl>
                    </Grid>
                    {aseemblyType === "Contract" && (
                        <Grid item xs={12} sm={12} md={6} lg={1.5} xl={1.5} >
                            <TextField
                                fullWidth
                                label="Kanban Date"
                                placeholder='Kanban Date'
                                variant="filled"
                                size='small'
                                InputLabelProps={{
                                    shrink: true
                                }}
                                type='date'
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value)
                                }}
                                required
                            />
                        </Grid>)}
                    {aseemblyType === "FIM" && (
                        <Grid item xs={12} sm={12} md={6} lg={1.5} xl={1.5} >
                            <TextField
                                fullWidth
                                label="Shipment Date"
                                placeholder='Shipment Date'
                                variant="filled"
                                size='small'
                                InputLabelProps={{
                                    shrink: true
                                }}
                                type='date'
                                value={shipmentDate}
                                onChange={(e) => {
                                    setShipmentdDate(e.target.value)
                                }}
                                required
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} sm={12} md={6} lg={1.5} xl={1.5} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Assembly Cell</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Select FIM"
                                placeholder='Select FIM'
                                variant="filled"
                                size='small'
                                value={selectedFIM}
                                onChange={(e) => {
                                    if (e.target.value === 'all') {
                                        setIsAllSelect(true);
                                        setSelectedFIM('all');
                                    } else {
                                        setSelectedFIM(e.target.value);
                                        setDownloadDisable(true);
                                        setIsAllSelect(false);
                                    }
                                }
                                }
                                required
                            >
                                <MenuItem key="all" value="all">All FIM</MenuItem>
                                {fimList.map((data) => (
                                    <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={1} xl={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <Button
                            variant="contained"
                            onClick={handleSubmitPress}
                            style={{ backgroundColor: '#002d68' }}
                            disabled={submitloading}
                        >
                            {submitloading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (
                                "Submit"
                            )}                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={1.6} xl={1.6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <Button
                            variant="contained"
                            endIcon={<FileDownloadIcon />}
                            // disabled={assemblyPlanningList.length > 0 ? false : true}
                            disabled={downloadDisable || isAllSelect || downloadloading}
                            style={{
                                backgroundColor: downloadDisable || isAllSelect ? '#C7C8CC' : '#002d68',
                            }}
                            onClick={handleDownloadAssemblyPlanning}

                        >
                            {downloadloading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (
                                "DOWNLOAD"
                            )}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={1.5} xl={1.5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Contract No</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Select Contract No"
                                placeholder='Select Contract No'
                                variant="filled"
                                size='small'
                                value={selectedContractNo}
                                onChange={(e) => {
                                    setGridLoading(true);
                                    if (e.target.value === 'all') {
                                        // setIsAllSelect(true);
                                        setSelectedContractNo('all');
                                        FilterAssemblyTable({
                                            kanbanDate: selectedDate,
                                            fim: isAllSelect ? '' : selectedFIM,
                                            PartNo: selectedPartNo,
                                            ContractNo: ''
                                        }, showAssemblyPlanningSuccess, showAssemblyPlanningFailed);
                                    } else {
                                        setSelectedContractNo(e.target.value);
                                        FilterAssemblyTable({
                                            kanbanDate: selectedDate,
                                            fim: isAllSelect ? '' : selectedFIM,
                                            PartNo: selectedPartNo,
                                            ContractNo: e.target.value
                                        }, showAssemblyPlanningSuccess, showAssemblyPlanningFailed);
                                        // setIsAllSelect(false);
                                    }
                                }
                                }
                            >
                                {/* <MenuItem key="all" value="all">All Contract</MenuItem> */}
                                {contractNoListData.map((data) => (
                                    <MenuItem /*key={data.id}*/ value={data}>{data}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={1.5} xl={1.5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Part No</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Select Part No"
                                placeholder='Select Part No'
                                variant="filled"
                                size='small'
                                value={selectedPartNo}
                                onChange={(e) => {
                                    setGridLoading(true);
                                    if (e.target.value === 'all') {
                                        // setIsAllSelect(true);
                                        setSelectedPartNo('all');
                                        FilterAssemblyTable({
                                            kanbanDate: selectedDate,
                                            fim: isAllSelect ? '' : selectedFIM,
                                            PartNo: "",
                                            ContractNo: selectedContractNo
                                        }, showAssemblyPlanningSuccess, showAssemblyPlanningFailed);
                                    } else {
                                        setSelectedPartNo(e.target.value);
                                        FilterAssemblyTable({
                                            kanbanDate: selectedDate,
                                            fim: isAllSelect ? '' : selectedFIM,
                                            PartNo: e.target.value,
                                            ContractNo: selectedContractNo
                                        }, showAssemblyPlanningSuccess, showAssemblyPlanningFailed);
                                        // setIsAllSelect(false);
                                    }
                                }
                                }
                            >
                                {/* <MenuItem key="all" value="all">All Part No</MenuItem> */}
                                {partNoListData.map((data) => (
                                    <MenuItem /*key={data.id}*/ value={data}>{data}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                        <Card style={{ borderRadius: '8px', height: '100%', marginTop: '-5px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                            <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <DataGrid
                                    rows={aseemblyType === "Contract" ? assemblyPlanningList : shipmentDateList}
                                    // columns={aseemblyType === "Contract" && assemblyPlanningColumn ? assemblyPlanningColumn : noDatacolumns}
                                    columns={
                                        aseemblyType === "Contract"
                                            ? (assemblyPlanningColumn && assemblyPlanningColumn.length > 0
                                                ? assemblyPlanningColumn // API response columns
                                                : noDatacolumnsshiptment) // Default dummy column
                                            : noDatacolumns // For other cases
                                    }
                                    pageSize={8}
                                    loading={isLoading}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    // style={{ border: 'none', fontWeight: 'bold' }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '65vh',
                                        // minHeight: '500px',
                                        width: '100%',
                                        '& .super-app-theme--header': {
                                            backgroundColor: '#93bce6',
                                            color: '#1c1919'

                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696',
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696', // Add border to column headers
                                        },
                                        '& .green-cell': {
                                            backgroundColor: '#90ee90', // Light green
                                            color: '#000000',           // Optional: dark green text
                                        },
                                    }}
                                    getRowClassName={(params) => {
                                        // Find the index of the row within the rows array
                                        const rowIndex = assemblyPlanningList.findIndex(row => row.id === params.row.id);
                                        // Check if the index is valid
                                        if (rowIndex !== -1) {
                                            console.log(' ');
                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }
                                        return ''; // Return default class if index is not found
                                    }}
                                    getCellClassName={(params) => {
                                        // Excluded fields
                                        console.log(">>>>>>>/<<<<<<<<<<<<<", params);
                                        const originalValue = params.row[params.field];
                                        const updatedValue = params.row.updated && params.row.updated[params.field];

                                        // Check if the values match and apply conditional styling
                                        const isMatch = updatedValue !== undefined && originalValue === parseFloat(updatedValue);
                                        if (isMatch) {
                                            return 'green-cell';
                                        }

                                        // OLD CODE
                                        // const excludedFields = ['sNo', 'totQty', 'totalCycleTime', 'cycleTime'];

                                        // if (!excludedFields.includes(params.field) && typeof params.value === 'number' && params.value > 0) {
                                        //     return 'green-cell';
                                        // }
                                        return '';
                                    }}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                />
                            </CardContent>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '15px', marginBottom: '15px', marginRight: '15px' }}>
                                    <Typography style={{ fontWeight: 'bold' }}>Total Contract</Typography>
                                    <Typography style={{ marginLeft: '10px', marginRight: '10px', fontWeight: 'bold' }}>:</Typography>
                                    <Typography>{totalContractCount}</Typography>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '15px', marginBottom: '15px', marginRight: '15px' }}>
                                    <Typography style={{ fontWeight: 'bold' }}>Completed Contract</Typography>
                                    <Typography style={{ marginLeft: '10px', marginRight: '10px', fontWeight: 'bold' }}>:</Typography>
                                    <Typography>{ }</Typography>
                                </div>
                            </div>
                        </Card>
                    </Grid>
                </Grid>


            </div>


            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />


        </div>
    )
}

export default AssemblyPlanning
