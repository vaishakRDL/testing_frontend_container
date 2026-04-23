import { Autocomplete, Box, Button, CardContent, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GetSuppVsItemSuppList, GetSuppVsItemSuppItemList, GetSuppAllAddress, GetSupplierPendingPo, GetSupplierPendingDC, GetPendingIssueParts, GetSFGFilterLocation, GetMaterialIssueRowData } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import IssueModal from './IssueComponent/IssueModal';
import { MaterialIssueReportDownload } from '../../ApiService/DownloadCsvReportsService';
import GetAppIcon from '@mui/icons-material/GetApp';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const LoadIssueParts = ({ pendingPOModalOpen, setPendingPOModalOpen, setSelectedItems, selectedItems, handleClearPage }) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [loadLists, setLoadLists] = useState([]);
    //////////////////////////////NEW DATA\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    const [issueModalOpen, setIssueModalOpen] = useState(false);
    const [rowId, setRowId] = useState('');
    const [shelfLifeItem, setShelfLifeItem] = useState('');
    const [itemCode, setItemCode] = useState('');
    const [rawMaterial, setRawMaterial] = useState('');
    const [uom, setUOM] = useState('');
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [requiredQuantity, setRequiredQuantity] = useState('');
    const [selectedRowData, setSelectedRowData] = useState('');
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [filterLocationList, setFilterLocationList] = useState([]);
    const [isFirstPageRowClick, setIsFirstPageRowClick] = useState(false);
    const [firstPageRowId, setFirstPageRowId] = useState('')
    const [materialIssueList, setMaterialIssueList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [firstTableLoader, setFirstTableLoader] = useState(false);
    const [secondTableLoader, setSecondTableLoader] = useState(false);
     const [totalRows, setTotalRows] = useState(0);
    //////////////////////////////NEW DATA\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    // FIRST PAGE
    const pendingPoColumns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>S No</span>,
            type: 'string',
            sortable: true,
            width: 100,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'date',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Date</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'saleOrderNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Sale Order No</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'category',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>SRN Category</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>PO No</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'mrpNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>MRP No</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'srnNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>SRN No</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'srnDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>SRN Date</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'requestedBy',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Requested By</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'approvedBy',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Approved By</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'customerName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Customer</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'kanbanDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>KanBan Date</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        // {
        //     field: 'itemName',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontSize: '16px' }}>Item Name</span>,
        //     type: 'number',
        //     sortable: true,
        //     width: 200,
        //     align: 'left', headerAlign: 'center'
        // },
        // {
        //     field: 'defaultStockLock',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontSize: '16px' }}>Default Stock</span>,
        //     type: 'string',
        //     sortable: true,
        //     width: 200,
        //     align: 'center', headerAlign: 'center'
        // },

        // {
        //     field: 'totStk',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontSize: '16px' }}>Available Stock</span>,
        //     type: 'string',
        //     sortable: true,
        //     width: 200,
        //     align: 'center', headerAlign: 'center'
        // },

        // {
        //     field: 'uom',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontSize: '16px' }}>UOM</span>,
        //     type: 'string',
        //     sortable: true,
        //     width: 200,
        //     align: 'center', headerAlign: 'center'
        // },
        // {
        //     field: 'reqQty',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontSize: '16px' }}>Total Qty Required</span>,
        //     type: 'string',
        //     sortable: true,
        //     width: 200,
        //     align: 'center', headerAlign: 'center'
        // },
        // // {
        // //     field: 'allocQty',
        // //     headerClassName: 'super-app-theme--header',
        // //     headerName: <span style={{ fontSize: '16px' }}>Allocated Qty</span>,
        // //     type: 'string',
        // //     sortable: true,
        // //     width: 200,
        // //     align: 'center', headerAlign: 'center'
        // // },
        // {
        //     field: 'issuedQty',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontSize: '16px' }}>Issued Qty</span>,
        //     type: 'string',
        //     sortable: true,
        //     width: 200,
        //     align: 'center', headerAlign: 'center'
        // },
        // {
        //     field: 'location',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontSize: '16px' }}>Location</span>,
        //     type: 'string',
        //     sortable: true,
        //     width: 200,
        //     align: 'center', headerAlign: 'center'
        // },
        // {
        //     field: 'remarks',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontSize: '16px' }}>Remarks</span>,
        //     type: 'string',
        //     sortable: true,
        //     width: 200,
        //     align: 'center', headerAlign: 'center'
        // },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     width: 200,
        //     headerClassName: 'super-app-theme--header',
        //     headerName: 'BOM',
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     renderHeader: (params) => (
        //         <div style={{ display: 'flex', alignItems: 'center' }}>
        //             <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
        //             <span style={{ marginLeft: '5px', fontSize: '15px' }}>Select All</span>
        //         </div>
        //     ),
        //     getActions: (params) => [
        //         <Selector selectedRow={params.row} />,
        //     ],
        // },
    ];

    //SECOND PAGE
    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>S No</span>,
            type: 'string',
            sortable: true,
            width: 100,
            align: 'center',
            headerAlign: 'center',
        },
        // // Conditionally include the 'nestNo' column
        // ...(category === 'Production' ? [{
        //     field: 'nestNo',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Nesting Id</span>,
        //     type: 'string',
        //     sortable: true,
        //     width: 250,
        //     align: 'center',
        //     headerAlign: 'center',
        // }] : []),
        // ...(category === 'Production' ? [
        //     {
        //         field: 'jcNos',
        //         headerClassName: 'super-app-theme--header',
        //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Job Cards</span>,
        //         type: 'string',
        //         sortable: true,
        //         width: 400,
        //         align: 'center',
        //         headerAlign: 'center',
        //     }
        // ] : [
        //     {
        //         field: 'jcNo',
        //         headerClassName: 'super-app-theme--header',
        //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Job Card No</span>,
        //         type: 'string',
        //         sortable: true,
        //         width: 200,
        //         align: 'center',
        //         headerAlign: 'center',
        //     },
        // ]),
        // {
        //     field: 'jcNo',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Job Card No</span>,
        //     type: 'string',
        //     sortable: true,
        //     width: 120,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        {
            field: 'srnNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SRN No</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'srnDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SRN Date</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part/Item No</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'fim',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>FIM</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'rawMaterialName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Raw Material Name</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Name</span>,
            type: 'number',
            sortable: true,
            width: 200,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'defaultStockLock',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Default Stock</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },

        {
            field: 'totStk',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Available Stock</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },

        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'reqQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Total Qty Required</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'allocQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Allocated Qty</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'issuedQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Issued Qty</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'location',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Location</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
        //     cellClassName: 'actions',
        //     width: 200,
        //     align: 'center', headerAlign: 'center',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         <Issue selectedRow={params.row} />,
        //     ],
        // },
    ];

    // FIRST PAGE
    useEffect(() => {
        pendingPOModalOpen && setFirstTableLoader(true);
        pendingPOModalOpen && GetPendingIssueParts({ page: 1 },handleSuppPOSucessShow, handleSuppPOExceptionShow);
        pendingPOModalOpen && GetSFGFilterLocation(handleGetLocationSuccess, handleGetLocationException);
    }, [pendingPOModalOpen, refreshData])

    // INNER PAGE API CALL
    useEffect(() => {
        isFirstPageRowClick && setSecondTableLoader(true);
        isFirstPageRowClick && GetMaterialIssueRowData({ id: firstPageRowId }, handleSucessShow, handleExceptionShow);
    }, [isFirstPageRowClick, firstPageRowId]);

    const handleSucessShow = (dataObject) => {
        setMaterialIssueList(dataObject?.data || []);
        setSecondTableLoader(false);
        // setCategory(dataObject?.data[0]?.category || []);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {
        setSecondTableLoader(false);
    }

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ sNo: index + 1, ...row }));
    };
    const rowData = generateRowsWithIndex(materialIssueList);

    // GET SFG LOCATION
    const handleGetLocationSuccess = (dataObject) => {
        setFilterLocationList(dataObject?.data || [])
    }
    const handleGetLocationException = () => { }

    // GET SUPPLIER LIST
    const handleSuppPOSucessShow = (dataObject) => {
         setTotalRows(dataObject?.totRows || 0);
        setLoadLists(dataObject?.data || []);
        setFirstTableLoader(false);
    }
    const handleSuppPOExceptionShow = (errorObject, errorMessage) => {
        setFirstTableLoader(false);
    }

    const handleRowClick = (params) => {
        // console.log("handleRowClick", params.row)
        // setSelectedItems([...selectedItems, params.row]);
        // // setBillingAddress(params.row.address);
        // setPendingPOModalOpen(false);

        setIsFirstPageRowClick(true);
        setFirstPageRowId(params.row.id);

        // setIssueModalOpen(true);
        // setRowId(params.row.id);
        // setShelfLifeItem(params.row.shelfLifeItem);
        // setItemCode(params.row.itemCode);
        // setRawMaterial(params.row.rawMaterialName);
        // setUOM(params.row.uom);
        // setRequiredQuantity(Number(params.row.reqQty) - Number(params.row.issuedQty));
        // setSelectedRowData(params.row);
    }

    const handleSubmitClick = () => {
        setPendingPOModalOpen(false);
        setIsFirstPageRowClick(false)
        setSelectedItems(selectedRows);
        setTimeout(() => {
            setSelectedRows([])
        }, 1000)
    }

    const handleRowSelection = (selectionModel) => {
        // Find the selected rows based on IDs
        const selectedData = rowData.filter(row => selectionModel.includes(row.id));
        setSelectedRows(selectedData);
    };

    const handleChange = (event) => {
        const { target: { value }, } = event;
        setSelectedLocation(typeof value === 'string' ? value.split(',') : value,);
        GetMaterialIssueRowData({ id: firstPageRowId, loc: value }, handleSucessShow, handleExceptionShow);
    };

    const handleInnerRowClick = (params) => {
        setIssueModalOpen(true);
        setRowId(params.row.id);
        setShelfLifeItem(params.row.shelfLifeItem);
        setItemCode(params.row.itemCode);
        setRawMaterial(params.row.rawMaterialName);
        setUOM(params.row.uom);
        setRequiredQuantity(Number(params.row.reqQty) - Number(params.row.issuedQty));
        setSelectedRowData(params.row);
    }

    const handleExportClick = () => {
        setLoader(true)
        MaterialIssueReportDownload({ id: firstPageRowId }, handleSucess, handleFailure)
    }

    const handleSucess = (dataObject) => {
        setLoader(false)
        setNotification({
            status: true,
            type: 'success',
            message: "Download success",
        });
        setTimeout(() => {
            handleClose();
        }, 3000);
    }
    const handleFailure = (errorObject, errorMessage) => {
        setLoader(false)
        setNotification({
            status: true,
            type: 'error',
            message: "Failed to download",
        });
        setTimeout(() => {
        }, 3000);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const fetchMaterialIssueData = (rowId, loc) => {
        GetMaterialIssueRowData(
            { id: rowId, loc },
            handleSucessShow,
            handleExceptionShow
        );
    };


    const handlePageChange = (newPage) => {
        setFirstTableLoader(true)
        GetPendingIssueParts({ page: newPage.page + 1}, handleSuppPOSucessShow, handleSuppPOExceptionShow);
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={pendingPOModalOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 2, display: 'flex' }}>
                    Select Pending Issue Parts
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                    {isFirstPageRowClick &&
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: '3px 10px 3px 10px', borderRadius: '5px', width: '100%' }}>
                            <FormControl fullWidth style={{ marginTop: '3px' }}>
                                <InputLabel id="demo-multiple-checkbox-label">Location</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={selectedLocation}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Location" />}
                                    renderValue={(selected) => {
                                        const selectedNames = filterLocationList.filter(location => selected.includes(location.id)).map(location => location.name);
                                        return selectedNames.join(', ');
                                    }}
                                    MenuProps={MenuProps}
                                    size='small'
                                >
                                    {filterLocationList.map((value, key) => (
                                        <MenuItem key={key} value={value.id}>
                                            <Checkbox checked={selectedLocation.indexOf(value.id) > -1} />
                                            <ListItemText primary={value.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    }
                </div>
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" /*onSubmit={handleSubmit}*/>
                    <Grid container >
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            {/* <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                <CardContent> */}
                            {isFirstPageRowClick === false ?
                                <DataGrid
                                    rows={loadLists}
                                    columns={pendingPoColumns}
                                    pageSize={8}
                                    loading={firstTableLoader}
                                    // checkboxSelection
                                    // disableRowSelectionOnClick
                                    // onRowSelectionModelChange={handleRowSelection}
                                    rowsPerPageOptions={[50]}
                                    onRowClick={handleRowClick} // Add this line to handle row clicks
                                    style={{ border: 'none' }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '80vh',
                                        width: '100%',
                                        cursor: 'pointer',
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
                                    rowHeight={30}
                                    columnHeaderHeight={40}
                                    getRowClassName={(params) => {
                                        const rowIndex = loadLists.findIndex(row => row.id === params.row.id);
                                        if (rowIndex !== -1) {
                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }
                                        return '';
                                    }}
                                    onPaginationModelChange={handlePageChange}
                                    pagination
                                    paginationMode="server"
                                    rowCount={totalRows}
                                />
                                :
                                <DataGrid
                                    rows={rowData}
                                    columns={columns}
                                    pageSize={8}
                                    loading={secondTableLoader}
                                    rowsPerPageOptions={[8]}
                                    checkboxSelection
                                    disableRowSelectionOnClick
                                    onRowSelectionModelChange={handleRowSelection}
                                    // onRowClick={(params) => handleIssue(params.row)} disableRowSelectionOnClick
                                    // onRowSelectionModelChange={handleRowSelection}
                                    onRowClick={handleInnerRowClick} // Add this line to handle row clicks
                                    style={{ border: 'none', }}
                                    sx={{
                                        overflow: 'auto',
                                        // height: screenHeight - 285,
                                        height: '80vh',
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
                                        const rowIndex = rowData.findIndex(row => row.id === params.row.id);
                                        if (rowIndex !== -1) {
                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }
                                        return '';
                                    }}

                                    rowHeight={30}
                                    columnHeaderHeight={40}
                                />
                            }
                            {/* </CardContent>

                            </Card> */}
                        </Grid>
                    </Grid>

                    <DialogActions>
                        {isFirstPageRowClick &&
                            <>
                                <Button
                                    variant="contained"
                                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                                    // type="submit"
                                    onClick={handleExportClick}
                                    endIcon={<GetAppIcon />}
                                >
                                    Export
                                    {loader
                                        &&
                                        <Box sx={{ display: 'flex', marginLeft: 1 }}>
                                            <CircularProgress size={25} color="inherit" />
                                        </Box>
                                    }
                                </Button>
                                <Button
                                    variant="contained"
                                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                                    // type="submit"
                                    onClick={handleSubmitClick}
                                >
                                    Submit
                                </Button>
                            </>
                        }
                        {isFirstPageRowClick === false ?
                            <Button
                                variant="contained"
                                style={{ width: '150px', background: '#002D68', color: 'white' }}
                                onClick={(e) => {
                                    setPendingPOModalOpen(false);
                                    // ClearData();
                                }}
                            >
                                Close
                            </Button>
                            :
                            <Button
                                variant="contained"
                                style={{ width: '150px', background: '#002D68', color: 'white' }}
                                onClick={(e) => {
                                    setIsFirstPageRowClick(false);
                                    // ClearData();
                                }}
                            >
                                Back
                            </Button>
                        }
                    </DialogActions>
                </form>
            </DialogContent>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <IssueModal
                issueModalOpen={issueModalOpen}
                setIssueModalOpen={setIssueModalOpen}
                rowId={rowId}
                itemCode={itemCode}
                rawMaterialName={rawMaterial}
                uom={uom}
                requiredQuantity={requiredQuantity}
                selectedRowData={selectedRowData}
                setRefreshData={setRefreshData}
                shelfLifeItem={shelfLifeItem}
                handleClearPage={handleClearPage}
                firstPageRowId={firstPageRowId}
                fetchMaterialIssueData={fetchMaterialIssueData}
            />

        </Dialog>
    )
}

export default LoadIssueParts
