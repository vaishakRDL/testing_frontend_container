import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Autocomplete, Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Tooltip } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
// import SfgVendorProcessModule from './SfgVendorProcessModule';
import { ViewSfgVendorProcess, DeleteCreatedGroup, SearchVendorProcessVendor, GetRejectedItems, GetAssemblyRejectedItems, GetFimRejectedItems } from '../../ApiService/LoginPageService'
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import '../../App.css';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from 'react-router-dom';
import FimRejectedItemsTitle from './FimRejectedItemsTitle';
import FimInsideReport from '../FimInsideReport/FimInsideReport';
import { useModuleLocks } from '../context/ModuleLockContext';

const FimRejectedItemsResult = (props) => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Assembly Rejected Items")?.lockStatus === "locked";

    const [rejectedItems, setRejectedItems] = useState([])
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
    const [isFpiReport, setIsFpiReport] = useState(false);
    const [rowId, setRowId] = useState('');
    const [drillFlag, setDrillFlag] = useState(false);
    const navigate = useNavigate();

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
        // {
        //     field: 'contractNo',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Contract No</span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Code</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'machineCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Machine Code</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Quantity</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'rejRewQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rejected Qty</span>,
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
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'stirng',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
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
                    onChange={(e) => handleCheckboxChange(e, params.row.id)}
                />
            ),
        }
    ];

    useEffect(() => {
        GetFimRejectedItems(handleRejectedItemsSucess, handleRejectedItemsException)
    }, [])

    const handleRejectedItemsSucess = (dataObject) => {
        const updatedArray = dataObject?.data.map((item) => ({ ...item, select: false }))
        setRejectedItems(updatedArray)
    }
    const handleRejectedItemsException = () => { }

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

    const handleSubmitClick = () => {
        const selectedRejItems = rejectedItems.filter((item) => item.select !== false)
        selectedRejItems.length > 0 && navigate(`/SalesResult?isRejected=true&&selectedItems=${JSON.stringify(selectedRejItems)}`);
    }

    const handleTableCellClick = (params) => {
        setIsFpiReport(true);
        setRowId(params.row.id);
        setDrillFlag(true);
    }

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <FimRejectedItemsTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
                idsArray={idsArray}
                setIsFpiReport={setIsFpiReport}
                drillFlag={drillFlag}
                setDrillFlag={setDrillFlag}
                rejectedItems={rejectedItems}
                setRejectedItems={setRejectedItems}
            />
            {
                !isFpiReport ? (
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '-10px', borderRadius: '10px', width: '98%', height: '100%' }}>
                            <CardContent>
                                <DataGrid
                                    rows={rejectedItems}
                                    columns={columns}
                                    pageSize={8}
                                    rowsPerPageOptions={[8]}
                                    onCellClick={handleTableCellClick}
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
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button variant="contained" disabled={isModuleLocked} style={{ backgroundColor: isModuleLocked ? 'gray' : '#002d68' }} onClick={handleSubmitClick}>Submit</Button>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                ) : (
                    <FimInsideReport
                        setIsFpiReport={setIsFpiReport}
                        id={rowId}
                        reportType={'Rejected'}
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

export default FimRejectedItemsResult