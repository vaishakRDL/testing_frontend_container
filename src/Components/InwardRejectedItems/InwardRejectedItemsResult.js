import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Autocomplete, Button, Card, CardContent, Checkbox, FormControl, CircularProgress, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Tooltip } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
// import SfgVendorProcessModule from './SfgVendorProcessModule';
import InwardRejectedItemsTitle from './InwardRejectedItemsTitle';
import { ViewSfgVendorProcess, DeleteCreatedGroup, SearchVendorProcessVendor, GetRejectedItems, GetInwardRejectedItems } from '../../ApiService/LoginPageService'
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import '../../App.css';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from 'react-router-dom';
import FPIModifiedReport from '../FPIModifiedReport/FPIModifiedReport';

const InwardRejectedItemsResult = (props) => {
    const [submitloading, setSubmitLoading] = useState(false);
    const [rejectedItems, setRejectedItems] = useState([])
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [selectAll, setSelectAll] = useState(false);
    const [viewButton, setViewButton] = useState(false);
    const [sfgVendorProcessList, setSfgVendorProcessList] = useState([]);
    const [idsArray, setIdsArray] = useState([]);
    const [vendorList, setVendorList] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [isFpiReport, setIsFpiReport] = useState(false);
    const [slNO, setSlno] = useState('');
    const [jcId, setJcId] = useState('');
    const [itemId, setItemId] = useState('')
    const [drillFlag, setDrillFlag] = useState(false);
    const navigate = useNavigate();
    const [fyFrom, setFyFrom] = useState("");
    const [fyTo, setFyTo] = useState("");
    // const [rejectedItems, setRejectedItems] = useState([
    //     { id: 1, sNo: '1', itemCode: '01PSIGN16X6', Qty: 10, select: false },
    //     { id: 2, sNo: '2', itemCode: '01SIGNFOB24X36S', Qty: 15, select: false },
    //     { id: 3, sNo: '3', itemCode: '01SPRBTMRINGSP', Qty: 20, select: false },
    //     { id: 4, sNo: '4', itemCode: '01SPRSTICKERSTP006', Qty: 12, select: false },
    //     { id: 5, sNo: '5', itemCode: '03GENLELECMAT3BKV', Qty: 8, select: false },
    // ])

    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SNo</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>PO No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'date',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Date</span>,
            type: 'stirng',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'supplier',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'process',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Process</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Code</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'status',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Status</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'machineCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Machine</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'totQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Quantity</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'addedBy',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>User</span>,
            type: 'stirng',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },

        // {
        //     field: 'select',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Select All</span>,
        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
        //     renderHeader: (params) => (
        //         <div style={{ display: 'flex', alignItems: 'center' }}>
        //             <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
        //             <span style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '16px' }}>Select All</span>
        //         </div>
        //     ),
        //     renderCell: (params) => (
        //         <Checkbox
        //             checked={params.row.select}
        //             onChange={(e) => handleCheckboxChange(e, params.row.id)}
        //         />
        //     ),
        // }
    ];

    useEffect(() => {
    }, [])

    const handleRejectedItemsSucess = (dataObject) => {
        const updatedArray = dataObject?.data.map((item) => ({ ...item, select: false }))
        setRejectedItems(updatedArray)
        setViewButton(false);

    }
    const handleRejectedItemsException = () => {
        setViewButton(false);

    }


    const handleCheckboxChange = (event, id) => {
        // Update the state using map to create a new array with the updated item
        setRejectedItems(rejectedItems.map(item =>
            item.id === id ? { ...item, select: event.target.checked } : item
        ));
    };

    const handleSelectAllChange = (event) => {
        setSelectAll(event.target.checked);
        const updatedRows = rejectedItems.map((row) => ({ ...row, select: event.target.checked }));
        setRejectedItems(updatedRows);
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

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleViewClick = () => {
        setViewButton(true);
        GetInwardRejectedItems({ from: from, to: to }, handleRejectedItemsSucess, handleRejectedItemsException)
    }

    const handleSubmitClick = () => {
        // setSubmitLoading(true)
        const selectedRejItems = rejectedItems.filter((item) => item.select !== false)
        selectedRejItems.length > 0 && navigate(`/SalesResult?isRejected=true&&selectedItems=${JSON.stringify(selectedRejItems)}`);
    }

    const handleTableCellClick = (params) => {
        console.log("Paramssss", params.row)
        setIsFpiReport(true);
        setSlno(params.row.snNo);
        setJcId(params.row.jcId);
        setItemId(params.row.itemId);
        setDrillFlag(true);
    }

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
            setFrom(value);
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
            setTo(value);
            setNotification({ status: false, type: "", message: "" });
        } else {
            setNotification({
                status: true,
                type: "error",
                message: "Please select a valid To-Date",
            });
        }
    };


    return (
        <div style={{ height: '60vh', width: '100%' }}>

            <InwardRejectedItemsTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
                idsArray={idsArray}
                setIsFpiReport={setIsFpiReport}
                drillFlag={drillFlag}
                setDrillFlag={setDrillFlag}
            />
            {!isFpiReport ? (
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '-10px', borderRadius: '10px', width: '98%', height: '100%' }}>
                        <CardContent>
                            <Grid container spacing={2} alignItems={'center'} paddingBottom={1} >

                                <Grid item xs={12} sm={4} md={4} lg={4}  >
                                    <TextField
                                        id="outlined-basic"
                                        type="date"
                                        label="From"
                                        variant="outlined"
                                        // style={{ marginRight: '10px' }}
                                        InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                        fullWidth
                                        size="small"
                                        value={from}
                                        onChange={handleFromDateChange}
                                        inputProps={{
                                            min: fyFrom,
                                            max: fyTo,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={4}          >
                                    <TextField
                                        id="outlined-basic"
                                        type="date"
                                        label="To"
                                        variant="outlined"
                                        fullWidth
                                        InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                        size="small"
                                        value={to}
                                        onChange={handleToDateChange}
                                        inputProps={{
                                            min: fyFrom,
                                            max: fyTo,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={4} style={{ columnGap: '12px', display: 'flex' }} >
                                    <Button variant="contained" style={{ backgroundColor: '#002d68' }} disabled={viewButton} onClick={handleViewClick}>
                                        {viewButton ? (
                                            <CircularProgress size={24} style={{ color: 'white' }} />
                                        ) : (
                                            "View"
                                        )}                                                      </Button>

                                    {/* <Button variant="contained" style={{ backgroundColor: '#002d68' }} onClick={handleSubmitClick}>
                                        Submit
                                    </Button> */}

                                </Grid>

                            </Grid>
                            {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            </div> */}
                            <DataGrid
                                rows={rejectedItems}
                                columns={columns}
                                pageSize={8}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                // onCellClick={handleTableCellClick}
                                onCellClick={(params, event) => {
                                    if (params.field === 'select') {
                                        // Ignore clicks on the 'select' checkbox column
                                        event.stopPropagation();
                                        return;
                                    }
                                    handleTableCellClick(params, event);
                                }}
                                style={{ border: 'none', }}
                                sx={{
                                    overflow: 'auto',
                                    height: '60vh',
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
                                        border: '1px solid #969696',
                                    },
                                }}
                                getRowClassName={(params) => {
                                    const rowIndex = rejectedItems.findIndex(row => row.id === params.row.id);
                                    if (rowIndex !== -1) {
                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    }
                                    return '';
                                }}
                                key={refreshKey}
                                rowHeight={40}
                                columnHeaderHeight={40}
                            />

                        </CardContent>
                    </Card>

                </div>
            ) : (
                <FPIModifiedReport
                    setIsFpiReport={setIsFpiReport}
                    slNO={slNO}
                    reportType={'Rejected'}
                    jcId={jcId}
                    itemId={itemId}
                />
            )
            }
            {/* 
            <SfgVendorProcessModule
                isAddButton={isAddButton}
                editData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
                idsArray={idsArray}
                setIdsArray={setIdsArray}
                setSelectAll={setSelectAll}
                setRefreshKey={setRefreshKey}
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
                deleteService={DeleteCreatedGroup}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default InwardRejectedItemsResult