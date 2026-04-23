import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Button, Card, CircularProgress, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ShipmentPlanningModule from './ShipmentPlanningModule';
import { DispatchSearchFim, DispatchShowData } from '../../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../../Utility/confirmDeletion';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';

const ShipmentPlanningResult = () => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [viewloading, setviewLoading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [DataList, setDataList] = useState([]);
    const [selectedCell, setSelectedCell] = useState('');
    const [selectedDate, setSelectedDate] = useState('');


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
        // DispatchSearchFim({
        //     text: e.target.value
        // }, handleDispatchSearchFimSucees, handleDispatchSearchFimException);

    }

    const handleDispatchSearchFimSucees = (dataObject) => {
        setDataList(dataObject?.data || []);

    }

    const handleDispatchSearchFimException = () => {

    }

    const handleDispatchShowDataSuccess = (dataObject) => {
        setItemShowListSeach(dataObject?.data || []);
        setGridLoading(false);
        setviewLoading(false);

        // setDownloadDisable(dataObject?.data.length > 0 ? false : true);
        // setAssemblyPlanningList(dataObject?.data || []);

        const headerNameMapping = {
            id: 'sNo',
            // itemcode: 'Item Code',
            // cycletime: 'Cycle Time',
            // totqty: 'Total Quantity',
            // totalcycletime: 'Total Cycle Time',
        };
        const dynamicColumn = Object.keys(dataObject?.data.length > 0 && dataObject?.data[0])
            .filter((key) => key.toLowerCase() !== '')  // Exclude 'id' field
            .map((key) => ({
                field: key,
                headerName: key,
                // width: 150,
                type: 'string',
                sortable: true,
                minWidth: 100,
                flex: 1,
                align: 'center',
                headerClassName: 'super-app-theme--header',
                headerAlign: 'center',
                renderHeader: (params) => (
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        {headerNameMapping[key.toLowerCase()] || key}
                    </span>
                ),
            }));
        setItemShowListHeader(dynamicColumn)
    }

    const handleDispatchShowDataException = () => {
        setviewLoading(false);

    }

    const handleDownloadSuccess = () => {

    }

    const handleDownloadException = () => {

    }

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
                    {/* <Grid item xs={12} sm={12} md={6} lg={2} xl={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

                    </Grid> */}
                    <Grid item xs={12} sm={12} md={6} lg={2} xl={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            disabled={viewloading}
                            onClick={() => {
                                setviewLoading(true);
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
                    {/* <Grid item xs={12} sm={12} md={6} lg={3} xl={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            style={{ width: '200px', background: '#002D68', color: 'white', marginRight: '10px' }}
                            onClick={() => {
                             
                            }}

                        >
                            Download Template
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '250px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setOpen(true);
                            }}

                        >
                            Upload Shipment Plan
                        </Button>
                    </Grid> */}
                    {/* <Grid item xs={12} sm={12} md={6} lg={3} xl={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            style={{ width: '200px', background: '#002D68', color: 'white', marginRight: '10px' }}
                            onClick={() => {
                           
                            }}

                        >
                            Download Template
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '200px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setOpen(true);
                            }}

                        >
                            Upload Part No
                        </Button>
                    </Grid> */}
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
                        </Card>
                    </Grid>
                </Grid>
                {/* </CardContent>
                </Card> */}

            </div>

            <ShipmentPlanningModule
                isAddButton={isAddButton}
                editData={editData}
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

export default ShipmentPlanningResult
