import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Autocomplete, Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Tooltip } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import RMBOIIndentReportModule from './RMBOIIndentReportModule';
import RMBOIIndentReportTitle from './RMBOIIndentReportTitle';
import { ShowCreatedGroup, DeleteCreatedGroup, GetBOIIndentReport, SearchBoiSupplier } from '../../ApiService/LoginPageService'
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';

const RMBOIIndentReportResult = (props) => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [id, setId] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [groupList, setGroupList] = useState([]);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    // View user Modal
    const [viewModalOpen, setViewModelOpen] = useState(false)
    //Permisson Modal
    const [selectedRowId, setSelectedRowId] = useState('')
    const [permisionModalOpen, setPermissionModalOpen] = useState(false)
    const [selectedRadio, setSelectedRadio] = useState('today');
    //NEW STATE FOR BOI
    const [boiReportList, setBoiReportList] = useState([])

    // AUTOCOMPLETE SELECTION
    const [supplierList, setSupplierList] = useState([])
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState();

    // CHECKBOX SELECTION ARRAY STORE
    const [selectedPartNo, setSelectedPartNo] = useState([]);
    const [selectedVendorCode, setSelectedVendorCode] = useState([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState([]);

    const [selectAll, setSelectAll] = useState(false);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };

        // Add event listener to update height on resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const columns = [
        {
            field: 'mrpNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>MRP No</span>,
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
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Name</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'category',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Category</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'spCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Vendor Code</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'reqQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Required</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'allocQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Allocated</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'stockInHand',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Stock In Hand</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'indent',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Indent</span>,
            type: 'number',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Select</span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            renderHeader: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
                    <span style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '16px' }}>Select All</span>
                </div>
            ),
            getActions: (params) => [
                <Selector selectedRow={params.row} />,
            ],
        },
    ];

    const handleSelectAllChange = (event) => {
        setSelectAll(event.target.checked);
        const updatedRows = boiReportList.map((row) => ({ ...row, select: event.target.checked }));
        setBoiReportList(updatedRows);

        // Extract IDs and store them in a state array
        const isChecked = event.target.checked;
        const updatedIds = isChecked ? boiReportList.map(row => row.id) : [];
        // console.log("updatedIds", updatedIds);
        setSelectedPartNo(updatedIds); // Assuming `idsArray` is your state array

        const filteredSupplierArray = isChecked ? boiReportList.map(row => ({ id: row.id, spCode: row.spCode })) : [];
        setSelectedVendorCode(filteredSupplierArray);
        const filteredSupplierIdArray = isChecked ? boiReportList.map(row => ({ id: row.id, spId: row.spId })) : [];
        setSelectedSupplierId(filteredSupplierIdArray);
    };

    function Selector(props) {
        const handleChange = (e) => {
            if (e.target.checked) {
                setSelectedPartNo((prevArray) => [...prevArray, props.selectedRow.id])
                setSelectedVendorCode((prevArray) => [
                    ...prevArray,
                    { id: props.selectedRow.id, spCode: props.selectedRow.spCode }
                ]);
                setSelectedSupplierId((prevArray) => [
                    ...prevArray,
                    { id: props.selectedRow.id, spId: props.selectedRow.spId }
                ]);
            } else {
                const filteredArray = selectedPartNo.filter((item) => item !== props.selectedRow.id);
                setSelectedPartNo(filteredArray);
                const filteredSupplierArray = selectedVendorCode.filter((item) => item.id !== props.selectedRow.id);
                setSelectedVendorCode(filteredSupplierArray);
                const filteredSupplierIdArray = selectedSupplierId.filter((item) => item.id !== props.selectedRow.id);
                setSelectedSupplierId(filteredSupplierIdArray);
            }

            const updatedList = boiReportList.map((process) =>
                process.id === props.selectedRow.id
                    ? {
                        ...process,
                        select: e.target.checked
                    }
                    : process
            );
            setBoiReportList(updatedList);

        }

        return (
            <Checkbox
                checked={props.selectedRow.select}
                onChange={handleChange}
            />
        );
    }

    useEffect(() => {
        GetBOIIndentReport({ spId: '', page: 0 }, handleSucessShow, handleExceptionShow)
    }, [refreshData]);

    const handlePageChange = (newPage) => {
        GetBOIIndentReport({ spId: '', page: newPage.page }, handleSucessShow, handleExceptionShow)
    };

    const handleSucessShow = (dataObject) => {
        // setBoiReportList(dataObject?.data || []);
        const reversedData = (dataObject?.data || []).slice().reverse();
        setBoiReportList(reversedData);
        setTotalRows(dataObject?.totRows || 0);
        setCurrentPage(dataObject?.currentPage || 0)
        console.log("dataObject", dataObject)
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

    }

    function View(props) {
        return (
            <Tooltip title={'View'}>
                <RemoveRedEyeIcon
                    onClick={() => {
                        setOpen(true);
                    }}
                    style={{ color: 'black' }}
                />
            </Tooltip>
        );
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

    const handleChange = (e) => {
        SearchBoiSupplier({ code: e.target.value }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
    }

    const handleItemVsProcessItemSucessShow = (dataObject) => {
        setSupplierList(dataObject?.data || []);
    }
    const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSupplierSearchItemChange = (value) => {
        if (value !== null) {
            GetBOIIndentReport({ spId: value.spId }, handleSucessShow, handleExceptionShow)
        }
    }

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <RMBOIIndentReportTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
                selectedPartNo={selectedPartNo}
                selectedVendorCode={selectedVendorCode}
                selectedSupplierId={selectedSupplierId}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '2px', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={supplierList}
                            sx={{ width: 300, marginBottom: '15px' }}
                            renderInput={(params) => <TextField {...params} label="Search Supplier" onChange={handleChange} />}
                            onChange={(event, value) => handleSupplierSearchItemChange(value)}
                            size="small"
                        />
                        <DataGrid
                            rows={boiReportList}
                            columns={columns}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            disableSelectionOnClick
                            style={{ border: 'none', }}
                            sx={{
                                overflow: 'auto',
                                height: screenHeight - 340,
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
                                const rowIndex = boiReportList.findIndex(row => row.id === params.row.id);
                                if (rowIndex !== -1) {
                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                }
                                return '';
                            }}
                            onPaginationModelChange={handlePageChange}
                            rowCount={totalRows}
                            // page={page}
                            pagination
                            paginationMode="server"
                            rowHeight={40}
                            columnHeaderHeight={40}
                        />
                    </CardContent>
                </Card>

            </div>

            {/* <RMBOIIndentReportModule
                isAddButton={isAddButton}
                editData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}

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
                // selectedMaster={selectedMaster}
                deleteService={DeleteCreatedGroup}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default RMBOIIndentReportResult