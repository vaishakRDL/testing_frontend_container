import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Autocomplete, Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Tooltip } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import SfgVendorProcessModule from './SfgVendorProcessModule';
import SfgVendorProcessTitle from './SfgVendorProcessTitle';
import { ViewSfgVendorProcess, DeleteCreatedGroup, SearchVendorProcessVendor } from '../../ApiService/LoginPageService'
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import '../../App.css';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const SfgVendorProcessResult = (props) => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [selectAll, setSelectAll] = useState(false);
    const [sfgVendorProcessList, setSfgVendorProcessList] = useState([]);
    const [idsArray, setIdsArray] = useState([]);
    const [vendorList, setVendorList] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

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
            field: 'producedDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Produced Date</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'orderNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Sales Order No</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'mrpNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>MRP No</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'kanbanDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>KANBAN Date</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'vendorCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Vendor Code</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'partFinish',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Finish</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'plannedQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Qty</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'JWQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>JW Qty</span>,
            type: 'number',
            sortable: true,
            // minWidth: 80,
            // flex: 1,
            width: 170,
            align: 'center',
            headerAlign: 'center',
            editable: true,
            // renderHeader: (params) => (
            //     <div style={{ display: 'flex', alignItems: 'center' }}>
            //         <span style={{ fontSize: '16px', marginRight: '5px', fontWeight: 'bold' }}>JW Qty</span>
            //         <EditOutlinedIcon fontSize="small" style={{ color: '#ffffff' }} />
            //     </div>
            // ),
        },
        // {
        //     field: 'pendingJWQty',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Pending JW Qty</span>,
        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        // },
        // {
        //     field: 'vendorProcess',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Vendor Process Type</span>,
        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        // },
        {
            field: 'select',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Select All</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderHeader: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
                    <span style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '16px' }}>Select All</span>
                </div>
            ),
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.select}
                    onChange={(e) => handleCheckboxChange(e, params.row.id, params.row.JWQty, params.row.supplierId)}
                />
            ),
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
    ];

    const handleCheckboxChange = (event, id, JWQty, supplierId) => {
        if (event.target.checked) {
            setIdsArray([...idsArray, { id: id, plannedQty: JWQty, supplierId: supplierId }]);
        } else {
            const filteredArray = idsArray.filter((item) => item.id !== id);
            setIdsArray(filteredArray);
        }
        const updatedRows = rowData.map((row) =>
            row.id === id ? { ...row, select: event.target.checked } : row
        );
        setSfgVendorProcessList(updatedRows);
    };

    const handleSelectAllChange = (event) => {
        setSelectAll(event.target.checked);
        const updatedRows = sfgVendorProcessList.map((row) => ({ ...row, select: event.target.checked }));
        setSfgVendorProcessList(updatedRows);
        // Extract IDs and store them in a state array
        const isChecked = event.target.checked;
        const updatedIds = isChecked ? sfgVendorProcessList.map(row => ({ id: row.id, plannedQty: row.JWQty, supplierId: row.supplierId })) : [];
        setIdsArray(updatedIds); // Assuming `idsArray` is your state array

    };

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ sNo: index + 1, select: false, ...row }));
    };
    const rowData = generateRowsWithIndex(sfgVendorProcessList);

    useEffect(() => {
        ViewSfgVendorProcess({ spId: '' }, handleSucessShow, handleExceptionShow)
    }, [refreshData]);

    const handleSucessShow = (dataObject) => {
        setSfgVendorProcessList(dataObject?.data || []);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

    }

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

    //VENDOR CODE SEARCH FILTER
    const handleChange = (e) => {
        SearchVendorProcessVendor({ code: e.target.value }, handleVendorProcessVendorSucessShow, handleVendorProcessVendorExceptionShow);
    }

    const handleVendorProcessVendorSucessShow = (dataObject) => {
        setVendorList(dataObject?.data || []);
    }
    const handleVendorProcessVendorExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSupplierSearchItemChange = (value) => {
        if (value !== null) {
            ViewSfgVendorProcess({ spId: value.spId }, handleSucessShow, handleExceptionShow)
        }
    }

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <SfgVendorProcessTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
                idsArray={idsArray}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '-10px', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={vendorList}
                            sx={{ width: 300, marginBottom: '15px' }}
                            renderInput={(params) => <TextField {...params} label="Search Vendor" onChange={handleChange} />}
                            onChange={(event, value) => handleSupplierSearchItemChange(value)}
                            size="small"
                        />
                        <DataGrid
                            rows={rowData}
                            columns={columns}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            disableSelectionOnClick
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
                                const rowIndex = rowData.findIndex(row => row.id === params.row.id);
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
                deleteService={DeleteCreatedGroup}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default SfgVendorProcessResult