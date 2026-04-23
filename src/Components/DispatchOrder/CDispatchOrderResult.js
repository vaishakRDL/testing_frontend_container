import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import { Autocomplete, Button, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import { Autocomplete, Box, Button, InputAdornment, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, LinearProgress, MenuItem, Radio, RadioGroup, Select, TextField, Tooltip } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import CDispatchOrderModule from './CDispatchOrderModule';
import CDispatchOrderTitle from './CDispatchOrderTitle';
import { CustomerDeliverySchedule, customerdeliveryscheduleList, DispatchCustDelSchedule, DispatchCustDelScheduleDelete, DispatchInvoiceClick } from '../../ApiService/LoginPageService';
import DetaildViewDispatch from './DetaildViewDispatch';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';
import ApplicationStore from '../../Utility/localStorageUtil';
import { useModuleLocks } from '../context/ModuleLockContext';

const CDispatchOrderResult = () => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Customer Delivery Note")?.lockStatus === "locked";

    const [open, setOpen] = useState(false);
    const [isLoading, setGridLoading] = useState(true);
    const [masterData, setMasterData] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [sobDataList, setSobDataList] = useState([]);
    const [delNotNo, setDelNotNo] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setTodate] = useState('');
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [selectedFilterRadio, setSelectedFilterRadio] = useState('Today');
    const [loader, setLoader] = useState(false);

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "customerdeliveryschedule");

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        CustomerDeliverySchedule(DispatchCustDelScheduleSuccess, DispatchCustDelScheduleException);
        handleRadioChange({ target: { value: 'Today' } });

        // const handleResize = () => {
        //     setScreenHeight(window.innerHeight);
        // };
        // window.addEventListener('resize', handleResize);
        // return () => {
        //     window.removeEventListener('resize', handleResize);
        // };
    }, [refreshData]);

    const DispatchCustDelScheduleSuccess = (dataObject) => {
        setMasterData(dataObject?.data || []);
        setGridLoading(false);
    }

    const DispatchCustDelScheduleException = () => {

    }

    const columns = [
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
            field: 'deliveryDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Sheduled Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'createdBy',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Created By
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'delNoteNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Del-Note No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        // {
        //     field: 'dc',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             DC/Invoice No
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
        {
            field: 'vehicleNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Vehicle No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'timeslot',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Time Slot
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        // {
        //     field: 'status',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Status
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
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
                <Visibility selectedRow={params.row} />,
                // <InnvoceData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];


    const handleReportView = () => {
        setLoader(true)
        customerdeliveryscheduleList(
            {
                fromDate: fromDate,
                toDate: toDate,
            }, handleGetheduleSuccess, handleGetSheduleException)
    };


    const handleGetheduleSuccess = (dataObject) => {
        setMasterData(dataObject?.data || []);
        setLoader(false)
        setGridLoading(false);

    }

    const handleGetSheduleException = (errorObject, errorMessage) => {

    }

    function Visibility(props) {
        return (
            <Tooltip title="View">
                <VisibilityIcon
                    style={{ color: isModuleLocked ? 'gray' : 'black' }}
                    onClick={(event) => {
                        if (isModuleLocked) return;
                        setOpen(true);
                        setDelNotNo(props.selectedRow.delNoteNo);
                    }}
                />
            </Tooltip>
        );
    }

    function InnvoceData(props) {
        return (
            <Tooltip title=" Invoice ">
                <DescriptionIcon
                    style={{ color: isModuleLocked ? 'gray' : 'black' }}
                    onClick={(event) => {
                        if (isModuleLocked) return;
                        DispatchInvoiceClick({
                            id: props.selectedRow.id
                        }, DispatchInvoiceClickSuccess, DispatchInvoiceClickException);
                    }}
                />
            </Tooltip>
        );
    }

    const DispatchInvoiceClickSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
        }, 3000);
    }

    const DispatchInvoiceClickException = () => {

    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                style={{ color: userPermission[0]?.deleteData === 0 || isModuleLocked ? 'gray' : '#000000' }}
                onClick={() => {
                    if (userPermission[0]?.deleteData === 1 && !isModuleLocked) {
                        setDeleteId(props.selectedRow.id);
                        setDeleteDailogOpen(true);
                    }
                }}
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


    const options = sobDataList.map(item => ({
        id: item?.id,
        label: item?.contractNo
    }));

    function handleAutocompleteChange(selectedValue) {
        // Your logic here with the selected value
        console.log("Selected Value:", selectedValue);
    }


    const handleRowClick = (e) => {

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
        setFromDate(fromDate ? fromDate.toISOString().split('T')[0] : '');
        setTodate(toDate ? toDate.toISOString().split('T')[0] : '');
    };


    return (
        <div style={{ height: '80vh', width: '100%' }}>
            <CDispatchOrderTitle />
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '-10px' }}>
                <Card style={{ borderRadius: '8px', height: '100%', width: '99%', marginTop: '10px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                    <CardContent >
                        <Grid container alignItems={'center'} spacing={2} >

                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <FormControl style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', height: '40px', borderRadius: '5px' }}>
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
                            <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '10px', paddingLeft: '15px' }}>
                                <Grid item xs={12} sm={8} md={2} lg={2}>
                                    <TextField
                                        fullWidth
                                        id="outlined-basic"
                                        type="date"
                                        label="From"
                                        variant="outlined"
                                        style={{ marginRight: '10px' }}
                                        InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                        size="small"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8} md={2} lg={2}>
                                    <TextField
                                        fullWidth
                                        id="outlined-basic"
                                        type="date"
                                        label="To"
                                        variant="outlined"
                                        style={{ marginRight: '10px' }}
                                        InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                        size="small"
                                        value={toDate}
                                        onChange={(e) => setTodate(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8} md={3} lg={3}>
                                    <Button disabled={loader === true} variant="contained" style={{ backgroundColor: '#002D68', marginRight: '15px', marginTop: '2px' }} onClick={handleReportView}>
                                        {loader ? (
                                            <CircularProgress size={24} style={{ color: 'white' }} />
                                        ) : 'View'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <DataGrid
                            rows={masterData}
                            columns={columns}
                            pageSize={8}
                            loading={isLoading}
                            rowsPerPageOptions={[8]}
                            onRowClick={handleRowClick}
                            disableSelectionOnClick
                            style={{ border: 'none', fontWeight: 'bold' }}
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
                            getRowClassName={(params) => {
                                // Find the index of the row within the rows array
                                const rowIndex = masterData.findIndex(row => row.id === params.row.id);
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

            <DetaildViewDispatch
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
                delNotNo={delNotNo}
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
                deleteService={DispatchCustDelScheduleDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default CDispatchOrderResult
