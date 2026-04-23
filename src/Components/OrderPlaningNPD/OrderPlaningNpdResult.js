import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Button, Card, CardContent, Checkbox, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { DispatchOrderDeleteDelete, OrderPlaningDataShow } from '../../ApiService/LoginPageService';
import SplitOrderModule from './SplitOrderComp/SplitOrderModule';
import ItemDetaildView from './ItemDetaildView';
import MrpOrderModule from './MrpOrderComp/MrpOrderModule';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import DownloadIcon from '@mui/icons-material/Download';
import { MrpExportMrpMstId } from '../../ApiService/DownloadCsvReportsService';
import OrderPlaningModuleNpd from './OrderPlaningModuleNpd';
import ApplicationStore from '../../Utility/localStorageUtil';
import { useModuleLocks } from '../context/ModuleLockContext';

const OrderPlaningNpdResult = () => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "NPD Order Planning")?.lockStatus === "locked";

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [spOpen, setSpOpen] = useState(false);
    const [openMrp, setOpenMrp] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editCustomer, setEditCustomer] = useState([]);
    const [salesList, setSalesList] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [id, setId] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [seletedItemList, setSeletedItemList] = useState([]);
    const [selectSalesId, setSelectSalesId] = useState('');
    const [selectId, setSelectId] = useState('');
    const [selectRowId, setSelectRowId] = useState('');
    const [selectDetails, setSelectDetails] = useState([]);
    const [SelectOptions, setSelectOptions] = useState('SelectOptions');
    const [itemDetaildView, setItemDetaildView] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [arrayList, setArrayList] = useState([]);
    const [TypesScheduling, setTypesScheduling] = useState('all');
    const navigate = useNavigate();
    const [fromDate, setFromeDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectMrpMstId, setSelectMrpMstId] = useState("");

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "npdorderplanning");
    const [fyFrom, setFyFrom] = useState("");
    const [fyTo, setFyTo] = useState("");
    const today = new Date();
    const date = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const TodaysDate = `${year}/${month}/${date}`;

    const columns = [
        {
            field: 'created_at',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'orderNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Order No
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'poRef',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    PO | Contract Ref
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'cName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Customer Name
                </span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'kanbanDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Kanban Date
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'Delay Date',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Delay
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'priority  Date',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Priority
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'status',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Status
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span >,
            minWidth: 350, maxWidth: 600,
            cellClassName: 'actions',
            disableClickEventBubbling: true,

            getActions: (params) => [
                <SelectAction selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
                <DownloadMRPData selectedRow={params.row} />,
            ],
        },
    ];

    useEffect(() => {
        OrderPlaningDataShow({
            type: TypesScheduling,
            fromDate: fromDate,
            toDate: toDate,
            isNpd: 1
        }, handleOrderPlaningDataShowSuccess, handleOrderPlaningDataShowException);
        //   SaleAddShowData(handleSaleAddShowDataSuccess,handleSaleAddShowDataException);
    }, [refreshData]);

    const handleOrderPlaningDataShowSuccess = (dataObject) => {
        setLoading(false);
        setSalesList(dataObject?.data || []);
    }

    const handleOrderPlaningDataShowException = () => {
        setLoading(false)

    }

    function SelectAction(props) {

        // const handleChange = (e) => {
        //     if (e.target.value === 'SplitOrder') {
        //         setSpOpen(true);
        //         setSelectSalesId(props?.selectedRow?.saleId || '');
        //         setSelectDetails(props?.selectedRow || []);

        //     } else if (e.target.value === 'Mrp') {
        //         setOpenMrp(true);
        //         setSelectRowId(props?.selectedRow?.id || '');
        //     }
        // }
        const handleChange = (e) => {
            const value = e.target.value;
            if (value === 'SplitOrder') {
                setSpOpen(true);
                setSelectSalesId(props?.selectedRow?.id || '');
                setSelectDetails(props?.selectedRow || []);
            } else if (value === 'Mrp') {
                setOpenMrp(true);
                console.log('props?.selectedRow====>', props?.selectedRow?.id)
                setSelectRowId(props?.selectedRow?.id || '');
            } else {
                setSpOpen(false);
                setOpenMrp(false);
            }
        };

        return (
            <div style={{ display: 'flex' }}>
                <FormControl style={{ width: '250px' }}>
                    {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={SelectOptions}
                        // label="Age"
                        defaultValue={SelectOptions}
                        onChange={handleChange}
                        disabled={isModuleLocked}
                    >
                        <MenuItem value='SelectOptions'>Select Options</MenuItem>
                        {/* <MenuItem value='Hold'>Hold</MenuItem> */}
                        <MenuItem value='Mrp'>MRP</MenuItem>
                        {/* <MenuItem value='GanttChart'>Gantt Chart</MenuItem> */}
                        {/* <MenuItem value='PlanOrder'>Schedule Order</MenuItem> */}
                        {/* <MenuItem value='RescheduleOrder'>Reschedule Order</MenuItem> */}
                        {/* <MenuItem value='SplitOrder'>Split Order</MenuItem> */}
                        {/* <MenuItem value='FreeComplete'>Force Complete</MenuItem> */}
                    </Select>
                </FormControl>
            </div>
        );
    }

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    function RowSelectAction(props) {

        const onSelectedItem = () => {
            setArrayList([...arrayList, props.selectedRow]);
        }


        return (
            <div style={{ display: 'flex' }}>
                <Checkbox {...label}
                    checked={arrayList?.id === props.selectedRow ? true : false}
                    onClick={onSelectedItem}
                />
            </div>
        );
    }

    // function RowSelectAction(props) {
    //     const { selectedRow, label } = props; // Destructure selectedRow and label from props

    //     const onSelectedItem = () => {
    //         // Assuming selectedRow is an array of selected items, you can add them to a new array
    //         const newSelectDataSet = [...selectedRow];
    //         console.log("------->", newSelectDataSet);

    //         // Perform any additional logic with newSelectDataSet if needed

    //         // You might want to update the state or perform some action with the new array here
    //     };

    //     return (
    //         <div style={{ display: 'flex' }}>
    //             <Checkbox {...label} onClick={onSelectedItem} />
    //         </div>
    //     );
    // }


    function DeleteData(props) {
        return (
            <DeleteIcon
                style={{ color: userPermission[0]?.deleteData === 0 || isModuleLocked ? 'gray' : '#000000' }}
                onClick={() => {
                    if (userPermission[0]?.deleteData === 1 && !isModuleLocked) {
                        setDeleteDailogOpen(true);
                        setDeleteId(props.selectedRow.id);
                    }
                }}

            />
        );
    }

    function DownloadMRPData(props) {

        return (
            <Tooltip text="Download MRP Data">
                <DownloadIcon
                    onClick={() => {
                        if (isModuleLocked) return
                        MrpExportMrpMstId({
                            mrpMstId: props.selectedRow.mrpMstId
                        }, handleMrpExportMrpMstIdSuccess, handleMrpExportMrpMstIdException);
                    }}
                    style={{ color: isModuleLocked ? 'gray' : 'black' }}
                />
            </Tooltip>
        );
    }

    const handleMrpExportMrpMstIdSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: 'Download Successful',
        });

        setTimeout(() => {
            handleClose();
        }, 3000);
    }

    const handleMrpExportMrpMstIdException = () => {

    }

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            setDeleteDailogOpen(false);
        }, 3000);
    };

    const deletehandleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });

    };



    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const OnChangeType = (e) => {
        setTypesScheduling(e.target.value)
    }

    const handleRowClick = (e) => {
        setItemDetaildView(true);
        setSelectId(e.row.id || '');
        setSelectMrpMstId(e.row.mrpMstId || "");

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
            setFromeDate(value);
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
            setToDate(value);
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
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems={'center'}>
                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <Typography sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }} variant="h5">NPD Order Planning</Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <FormControl fullWidth
                                >
                                    <InputLabel id="demo-simple-select-label">Types of Scheduling</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={TypesScheduling}
                                        label="Customer Name"
                                        variant="filled"
                                        onChange={OnChangeType}
                                        size="small"
                                    >
                                        <MenuItem value={'Pending Order'}>Pending Order</MenuItem>
                                        <MenuItem value={'Scheduled_and_Process Order'}>Scheduled and Process Order</MenuItem>
                                        <MenuItem value={'hold'}>Hold</MenuItem>
                                        <MenuItem value={'all'}>All</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <TextField
                                    id="filled-basic"
                                    label="From date"
                                    variant="filled"
                                    fullWidth
                                    required
                                    size='small'

                                    placeholder="From date"
                                    type='date'
                                    onChange={handleFromDateChange}
                                    inputProps={{
                                        min: fyFrom,
                                        max: fyTo,
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                />

                            </Grid>
                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <TextField
                                    id="filled-basic"
                                    label="To date"
                                    variant="filled"
                                    fullWidth
                                    required
                                    size='small'
                                    onChange={handleToDateChange}
                                    inputProps={{
                                        min: fyFrom,
                                        max: fyTo,
                                    }}
                                    placeholder="To date"
                                    type='date'
                                    InputLabelProps={{ shrink: true }}
                                />

                            </Grid>
                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                                , alignContent: 'center'
                            }}>
                                <Button variant="contained"
                                    style={{ width: '150px', background: '#002D68', color: 'white', }}
                                    disabled={loading}
                                    onClick={() => {
                                        setLoading(true)
                                        OrderPlaningDataShow({
                                            type: TypesScheduling,
                                            fromDate: TodaysDate,
                                            toDate: TodaysDate,
                                            isNpd: 1
                                        }, handleOrderPlaningDataShowSuccess, handleOrderPlaningDataShowException);

                                    }}
                                >

                                    Today
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Button variant="contained"
                                    style={{ width: '150px', background: isModuleLocked ? 'gray' : '#002D68', color: 'white' }}
                                    disabled={loading || isModuleLocked}
                                    onClick={() => {
                                        setLoading(true)
                                        OrderPlaningDataShow({
                                            type: TypesScheduling,
                                            fromDate: fromDate,
                                            toDate: toDate,
                                            isNpd: 1
                                        }, handleOrderPlaningDataShowSuccess, handleOrderPlaningDataShowException);

                                    }}
                                >

                                    Submit
                                </Button>
                            </Grid>

                            {/* <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Button variant="contained"
                                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                                    onClick={() => {
                                        // setSpOpen(true);
                                        navigate(`/GanttChartModule`);
                                    }}
                                >

                                    Gantt Chart
                                </Button>
                            </Grid> */}
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                            style={{
                                marginTop: '20px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'

                            }} >
                            <DataGrid
                                rows={salesList}
                                columns={columns}
                                pageSize={8}
                                // loading={isLoading}
                                rowsPerPageOptions={[8]}
                                onRowClick={handleRowClick}
                                disableSelectionOnClick
                                style={{ border: 'none', }}
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
                                    const rowIndex = salesList.findIndex(row => row.id === params.row.id);
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

                        </Grid>
                    </CardContent>
                </Card>

            </div>

            <OrderPlaningModuleNpd
                isAddButton={isAddButton}
                customerData={editCustomer}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
            />
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <SplitOrderModule
                setOpen={setSpOpen}
                open={spOpen}
                seletedItemList={arrayList}
                setSeletedItemList={setArrayList}
                selectSalesId={selectSalesId}
                selectDetails={selectDetails}
                setRefreshData={setRefreshData}
            />
            <MrpOrderModule
                openMrp={openMrp}
                setOpenMrp={setOpenMrp}
                selectRowId={selectRowId}
                setRefreshData={setRefreshData}
                TypesScheduling={TypesScheduling}
            />

            <ItemDetaildView
                itemDetaildView={itemDetaildView}
                setItemDetaildView={setItemDetaildView}
                selectSalesId={selectId}
                selectMrpMstId={selectMrpMstId}

            />

            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                deleteService={DispatchOrderDeleteDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />

        </div >
    )
}

export default OrderPlaningNpdResult