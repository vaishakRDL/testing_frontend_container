import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Button, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import { DispatchSearchFim, DispatchShowData, ItemSearchNAAJ, PcnShowData, SobShowData } from '../../ApiService/LoginPageService';
import { DispatchExlConractTemp, DispatchExlPartTemp } from '../../ApiService/DownloadCsvReportsService';
import PriceChangeTitle from './PriceChangeTitle';
import PriceChangeModule from './PriceChangeModule';

const PriceChangeResult = () => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [isLoading, setGridLoading] = useState(true);

    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [DataList, setDataList] = useState([]);
    const [selectedCell, setSelectedCell] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [dataListDetail, setDataListDetail] = useState([]);
    const [dataTemp,setDataTemp] = useState([]);
    const [selectedName, setSelectedName] = useState('');

    const [itemShowListSeach, setItemShowListSeach] = useState([]);
    const [itemShowListHeader, setItemShowListHeader] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const columns = [
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
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Name
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'effectiveFromDt',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Eff From
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'lastEffectivefromDt',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Last Eff From Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'basicRate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Basic Rate
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'lcr',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    LCR
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'freight',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Freight
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Existing landing',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Land Rate
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'pcnNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Last PCN No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'created_at',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Last PC Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Remarks
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
        PcnShowData({
            text: ''
        }, handleSobShowDataSuccess, handleSobShowDataException);
        document.title = 'Shipment Planning';
    }, [refreshData]);

    const handleSobShowDataSuccess = (dataObject) => {
        setDataListDetail(dataObject?.data || []);
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


    const options = itemShowListSeach.map(item => ({
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

    const handleDispatchShowDataSuccess = (dataObject) => {
        setItemShowListSeach(dataObject?.data || []);
        setGridLoading(false);

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

    }

    const handleDownloadSuccess = () => {

    }

    const handleDownloadException = () => {

    }


    const options1 = itemShowListSeach.map(item => ({
        id: item?.id,
        label: item?.label
      }));
    

    const handleCategoryChange = (selectedValue) => {
        setSelectedName(selectedValue?.label);
        if (selectedValue) {
            PcnShowData({
                text: selectedValue?.label.replace(/\s+/g, '')
            }, handleSobShowDataSuccess, handleSobShowDataException);
          }else{
            PcnShowData({
                text:''
            }, handleSobShowDataSuccess, handleSobShowDataException);
          }
      
    };

    const textEntery2 = (e) => {

        PcnShowData({
            text: e.target.value
        }, handleSobShowDataSuccess, handleSobShowDataException);

        ItemSearchNAAJ({
            text: e.target.value
        }, handleItemSearchNAAJSucees, handleItemSearchNAAJException);

    }

    const handleItemSearchNAAJSucees = (dataObject) => {
        setItemShowListSeach(dataObject?.data || []);
    }

    const handleItemSearchNAAJException = () => {

    }

    return (
        <div style={{ height: '80vh', width: '100%', marginTop: '10px' }}>
            {/* <PriceChangeTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}

            /> */}
            <PriceChangeTitle
    setIsAddButton={setIsAddButton}
    setEditData={setEditData}
    setOpen={setOpen}
    dataListDetail={dataListDetail}   // 👈 Pass your data here
    columns={columns}                // 👈 Pass your column headers here
/>

           
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '-20px', padding: '20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl style={{ width: '100%' }}>
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="combo-box-demo"
                                size='small'
                                options={options1}
                                value={selectedName}
                                // sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Search By Item code" onChange={textEntery2}
                                />}
                                onChange={(event, value) => handleCategoryChange(value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>

                        <Card style={{ borderRadius: '8px', height: '100%', marginTop: '0px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)", width: '100%' }}>
                            <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <DataGrid
                                    rows={dataListDetail}
                                    columns={columns}
                                    pageSize={8}
                                    // loading={isLoading}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none', fontWeight: 'bold', overflowY: 'scroll' }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '50vh',
                                        // minHeight: '500px',
                                        '& .super-app-theme--header': {
                                            WebkitTextStrokeWidth: '0.6px',
                                            backgroundColor: '#93bce6',
                                            color: '#1c1919'
                                        },
                                    }}
                                    getRowClassName={(params) => {
                                        const rowIndex = dataListDetail.findIndex(row => row.id === params.row.id);
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
                    </Grid>

                </Grid>
            </div>

            <PriceChangeModule
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

export default PriceChangeResult
