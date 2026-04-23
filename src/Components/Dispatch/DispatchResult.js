import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Button, Card, CircularProgress, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import { DispatchSearchFim, DispatchShowData, SobShowData } from '../../ApiService/LoginPageService';
import DispatchModule from './DispatchModule';
import DispatchTitle from './DispatchTitle';
import { DispatchExlConractTemp, DispatchExlPartTemp } from '../../ApiService/DownloadCsvReportsService';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useModuleLocks } from '../context/ModuleLockContext';

const DispatchResult = () => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Machine & Assembly Planning")?.lockStatus === "locked";

    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [viewloading, setviewLoading] = useState(false);
    const [templateloading, setTemplateLoading] = useState(false);

    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [DataList, setDataList] = useState([]);
    const [selectedCell, setSelectedCell] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedButton, setSelectedButton] = useState('');


    const [itemShowListSeach, setItemShowListSeach] = useState([]);
    const [itemShowListHeader, setItemShowListHeader] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const columns = [
        {
            field: 'contractNo',
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
            field: 'fimNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Schedule Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'msd',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Cell
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'sheetName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Status
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
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                // <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];

    // const showAssemblyPlanningSuccess = (dataObject) => {
    //     setGridLoading(false);
    //     setDownloadDisable(dataObject?.data.length > 0 ? false : true);
    //     setAssemblyPlanningList(dataObject?.data || []);
    //     // DYNAMICALLY CREATE HEADER USING ARRAY KEY
    //     const headerNameMapping = {
    //         id: 'S.No',
    //         itemcode: 'Item Code',
    //         cycletime: 'Cycle Time',
    //         totqty: 'Total Quantity',
    //         totalcycletime: 'Total Cycle Time',
    //     };
    //     const dynamicColumn = Object.keys(dataObject?.data.length > 0 && dataObject?.data[0])
    //         .filter((key) => key.toLowerCase() !== '')  // Exclude 'id' field
    //         .map((key) => ({
    //             field: key,
    //             headerName: key,
    //             // width: 150,
    //             type: 'string',
    //             sortable: true,
    //             minWidth: 100,
    //             flex: 1,
    //             align: 'center',
    //             headerAlign: 'center',
    //             renderHeader: (params) => (
    //                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                     {headerNameMapping[key.toLowerCase()] || key}
    //                 </span>
    //             ),
    //         }));
    //     setAssemblyPlanningColumn(dynamicColumn)
    // }

    useEffect(() => {
        // SobShowData(handleSobShowDataSuccess, handleSobShowDataException);
        document.title = 'Shipment Planning';
    }, [refreshData]);

    const handleSobShowDataSuccess = (dataObject) => {

    }

    const handleSobShowDataException = (errorObject, errorMessage) => {

    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: 'black' }}
                onClick={(event) => {
                    setOpen(true);
                    setIsAddButton(false);
                    setEditData(props.selectedRow);
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    setDeleteId(props.selectedRow.id);
                    setDeleteDailogOpen(true);
                }}
                style={{ color: 'black' }}
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
        id: item?.sNo,
        label: item?.fimNo
    }));


    const handleAutocompleteChange = (selectedValue) => {
        console.log('selectedItem==>', selectedValue?.label);
        setSelectedCell(selectedValue?.label);
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

    // const handleDispatchShowDataSuccess = (dataObject) => {
    //     setItemShowListSeach(dataObject?.data || []);
    //     setGridLoading(false);



    //     // setDownloadDisable(dataObject?.data.length > 0 ? false : true);
    //     // setAssemblyPlanningList(dataObject?.data || []);

    //     const headerNameMapping = {
    //         id: 'sNo',
    //         // itemcode: 'Item Code',
    //         // cycletime: 'Cycle Time',
    //         // totqty: 'Total Quantity',
    //         // totalcycletime: 'Total Cycle Time',
    //     };
    //     const dynamicColumn = Object.keys(dataObject?.data.length > 0 && dataObject?.data[0])
    //         .filter((key) => key.toLowerCase() !== '')  // Exclude 'id' field
    //         .map((key) => ({
    //             field: key,
    //             headerName: key,
    //             // width: 150,
    //             type: 'string',
    //             sortable: true,
    //             minWidth: 100,
    //             flex: 1,
    //             align: 'center',
    //             headerClassName: 'super-app-theme--header',
    //             headerAlign: 'center',
    //             renderHeader: (params) => (
    //                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                     {headerNameMapping[key.toLowerCase()] || key}
    //                 </span>
    //             ),
    //         }));
    //     setItemShowListHeader(dynamicColumn)
    // }

    const handleDispatchShowDataSuccess = (dataObject) => {
        setviewLoading(false)

        const fixedColumns = [
            'SNo',
            'ContractNo',
            'Duty',
            // 'id',
            'KanbanDate',
            'Prefix',
            'Product',
            'QtyStops',
            'SheduledDate',
            'TimeSlot'
        ];

        const allColumns = Object.keys(dataObject?.data.length > 0 && dataObject?.data[0]) || [];

        const remainingColumns = allColumns.filter(col => !fixedColumns.includes(col) && col !== 'id');

        const orderedColumns = [...fixedColumns, ...remainingColumns];

        const dynamicColumn = orderedColumns.map((key) => ({
            field: key,
            headerName: key,
            type: 'string',
            sortable: true,
            // minWidth: 100,
            // flex: 1,
            align: 'center',
            headerClassName: 'super-app-theme--header',
            headerAlign: 'center',
            renderHeader: (params) => (
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    {key}
                </span>
            ),
            // Apply fixed width for Product column
            ...(key === 'Product'
                ? { width: 200 } // Set fixed width for Product column
                : { minWidth: 100, flex: 1 }) // Dynamic behavior for other columns
        }));

        setItemShowListHeader(dynamicColumn);
        setItemShowListSeach(dataObject?.data || []);
        setGridLoading(false);
    };

    const handleDispatchShowDataException = () => {
        setviewLoading(false)

    }

    const handleDownloadSuccess = () => {
        setTemplateLoading(false);

    }

    const handleDownloadException = () => {
        setTemplateLoading(false);

    };

    const arrayToWorksheet = (array) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        // Define columns with headers and key names
        const columns = Object.keys(array[0]).map((key) => ({
            header: key,
            key: key,
            width: 20 // Set default column width
        }));

        // Add columns to the worksheet
        worksheet.columns = columns;

        // Add rows to the worksheet
        array.forEach((row) => worksheet.addRow(row));

        // Apply styles to header (Bold font and Centered alignment)
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        // Apply center alignment to data rows
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        });

        return workbook;
    };

    const downloadExcelFile = async (workbook, filename) => {
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), filename);
    };

    const handleDownload = () => {
        if (!itemShowListSeach || itemShowListSeach.length === 0) {
            console.warn('No data available for download');
            return;
        }

        // Filter and map the rows to remove unnecessary columns if needed
        const filteredRows = itemShowListSeach.map(({ id, ...rest }) => rest);

        // Generate Excel workbook
        const workbook = arrayToWorksheet(filteredRows);

        // Download Excel file
        downloadExcelFile(workbook, 'DataGrid_Export.xlsx');
    };


    return (
        <div style={{ height: '80vh', width: '100%', marginTop: '10px' }}>
            {/* <DispatchTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}

            /> */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '-10px' }}>
                {/* <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent> */}
                <Grid container spacing={2} style={{ width: '99%' }}>
                    <Grid item xs={12} sm={12} md={6} lg={2} xl={2}>
                        <TextField
                            id="filled-basic"
                            label="Date"
                            variant="filled"
                            fullWidth
                            type='date'
                            size='small'
                            required
                            InputLabelProps={{ shrink: true }}
                            placeholder="Date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={2} xl={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FormControl style={{ width: '100%' }}>
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="combo-box-demo"
                                size='small'
                                options={options}
                                // sx={{ width: 300 }}
                                renderInput={(params) => <TextField value={selectedCell} variant="filled" {...params} label="Select Cell "
                                    onChange={textEntery}
                                />}
                                onChange={(event, value) => handleAutocompleteChange(value)}
                            />
                        </FormControl>

                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={2} xl={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            disabled={viewloading}
                            onClick={() => {
                                setviewLoading(true)
                                DispatchShowData({
                                    date: selectedDate,
                                    fim: selectedCell
                                }, handleDispatchShowDataSuccess, handleDispatchShowDataException);
                            }}
                        >
                            {viewloading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (
                                "View"
                            )}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3} xl={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            style={{ width: '210px', background: isModuleLocked ? "gray" : '#002D68', color: 'white', marginRight: '10px' }}
                            onClick={() => {
                                setTemplateLoading(true);
                                DispatchExlConractTemp(handleDownloadSuccess, handleDownloadException);
                            }}
                            disabled={isModuleLocked}

                        >
                            Download Template
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '250px', background: isModuleLocked ? "gray" : '#002D68', color: 'white' }}
                            onClick={() => {
                                setOpen(true);
                                setSelectedButton('shipment');
                            }}
                            disabled={isModuleLocked}


                        >
                            Upload Shipment Plan
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3} xl={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            style={{ width: '200px', background: isModuleLocked ? "gray" : '#002D68', color: 'white', marginRight: '10px' }}
                            onClick={() => {
                                DispatchExlPartTemp(handleDownloadSuccess, handleDownloadException);
                            }}
                            disabled={isModuleLocked}

                        >
                            Download Template
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '200px', background: isModuleLocked ? "gray" : '#002D68', color: 'white' }}
                            onClick={() => {
                                setOpen(true);
                                setSelectedButton('part');
                            }}
                            disabled={isModuleLocked}

                        >
                            Upload Part No
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                        <Card style={{ borderRadius: '8px', height: '100%', marginTop: '-5px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                            <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <DataGrid
                                    rows={itemShowListSeach}
                                    columns={itemShowListHeader}
                                    pageSize={8}
                                    // loading={isLoading}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none', fontWeight: 'bold', overflowY: 'scroll' }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '55vh',
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
                                        const rowIndex = itemShowListSeach.findIndex(row => row.id === params.row.id);
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
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '15px', paddingRight: '5px', width: "100%", }}>
                                <Button
                                    variant="contained"
                                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                                    onClick={handleDownload}

                                >
                                    Downlaod
                                </Button>
                            </Grid>
                        </Card>
                        {/* <Grid item xs={12} sm={12} md={6} lg={2} xl={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                style={{ width: '150px', background: '#002D68', color: 'white' }}
                            // onClick={() => {
                            //     DispatchShowData({
                            //         date: selectedDate,
                            //         fim: selectedCell
                            //     }, handleDispatchShowDataSuccess, handleDispatchShowDataException);
                            // }}
                            >
                                Downlaod
                            </Button>
                        </Grid> */}

                    </Grid>
                </Grid>
                {/* </CardContent>
                </Card> */}

            </div>

            <DispatchModule
                isAddButton={isAddButton}
                editData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
                selectedButton={selectedButton}
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
                deleteId={deleteId}
                // deleteService={AllMasterDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default DispatchResult
