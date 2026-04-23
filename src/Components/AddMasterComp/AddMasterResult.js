import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import AddMasterTitle from './AddMasterTitle';
import AddMaster from './AddMaster';
import { Button } from 'react-bootstrap';
import { AllShowMasterAdd, AllMasterDelete } from '../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import '../../App.css';
import ApplicationStore from '../../Utility/localStorageUtil';
import { useModuleLocks } from '../context/ModuleLockContext';

const AddMasterResult = (props) => {
    // const moduleLocks = JSON.parse(localStorage.getItem("moduleLocks") || "[]");
    // const isModuleLocked = moduleLocks.find(
    //     (m) => m.moduleName === "Master"
    // )?.lockStatus === "locked";
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Master")?.lockStatus === "locked";
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [masterData, serMasterData] = useState([]);
    const [id, setId] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

    //NEW STATE VARIBALES
    const [selectedMaster, setSelectedMaster] = useState('pm');
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    //

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const { userDetails } = ApplicationStore()?.getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "addmaster");

    // const headerSet = new Set(['fim']);
    // const columns = [
    //     ...(selectedMaster !== "product" && selectedMaster !== "location" && selectedMaster !== "section" ? [
    //         {
    //             field: 'code',
    //             headerClassName: 'super-app-theme--header',
    //             headerName:
    //                 <span style={{ fontWeight: 'bold', fontSize: '16px', }}>
    //                     Code
    //                 </span>,

    //             type: 'string',
    //             sortable: true,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },
    //     ] : []),

    //     ...(selectedMaster === "menu" ? [
    //         {
    //             field: 'type',
    //             headerClassName: 'super-app-theme--header',
    //             headerName:
    //                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                     Type
    //                 </span>,
    //             type: 'string',
    //             sortable: true,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },
    //     ] : []),
    //     ...(selectedMaster !== "location" ? [

    //         {
    //             field: 'name',
    //             headerClassName: 'super-app-theme--header',
    //             headerName:
    //                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                     Name
    //                 </span>,
    //             type: 'string',
    //             sortable: true,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },
    //     ] : []),
    //     ...(selectedMaster === "pm" ? [

    //         {
    //             field: 'vendorProcess',
    //             headerClassName: 'super-app-theme--header',
    //             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>InHouse/VendorProcess</span>,
    //             type: 'string',
    //             sortable: true,
    //             minWidth: 80,
    //             flex: 1,
    //             align: 'center',
    //             headerAlign: 'center',
    //             renderCell: (params) => {
    //                 return params.value === 1 ? 'Vendor Process' : 'InHouse';
    //             },
    //         },
    //     ] : []),
    //     ...(selectedMaster !== "product" && selectedMaster !== "location" ? [
    //         {
    //             field: 'inactiveStatus',
    //             headerClassName: 'super-app-theme--header',
    //             headerName:
    //                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                     Inactive
    //                 </span>,
    //             type: 'string',
    //             sortable: true,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },
    //         {
    //             field: 'inactiveRemarks',
    //             headerClassName: 'super-app-theme--header',
    //             headerName:
    //                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                     Inactive Remarks
    //                 </span>,
    //             type: 'string',
    //             sortable: true,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },
    //     ] : []),


    //     ...(selectedMaster === "itemGroup" ? [
    //         {
    //             field: 'chapterHdr',
    //             headerName: 'ChapterHDR',
    //             headerClassName: 'super-app-theme--header',
    //             type: 'string',
    //             sortable: true,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },
    //         {
    //             field: 'isstoreGroup',
    //             headerName: 'is Store Group',
    //             headerClassName: 'super-app-theme--header',
    //             type: 'string',
    //             sortable: true,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },
    //     ] : []),

    //     ...(selectedMaster === "location" ? [
    //         {
    //             field: 'City',
    //             headerName: 'City Name',
    //             headerClassName: 'super-app-theme--header',
    //             type: 'string',
    //             sortable: true,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },
    //         {
    //             field: 'State',
    //             headerName: 'State',
    //             headerClassName: 'super-app-theme--header',
    //             type: 'string',
    //             sortable: true,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },
    //         {
    //             field: 'Country',
    //             headerName: 'Country',
    //             headerClassName: 'super-app-theme--header',
    //             type: 'string',
    //             sortable: true,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },


    //     ] : []),
    //     {
    //         field: 'description',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Description
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //     },
    //     {
    //         field: 'actions',
    //         headerClassName: 'super-app-theme--header',
    //         type: 'actions',
    //         flex: 1,
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 Actions
    //             </span>,

    //         cellClassName: 'actions',
    //         disableClickEventBubbling: true,
    //         getActions: (params) => [
    //             <EditData selectedRow={params.row} />,
    //             <DeleteData selectedRow={params.row} />,
    //         ],
    //     },
    // ];

    const headerSet = new Set(['fim', 'category', 'productFinish',
        'productFamily', 'city', 'underLedger',
        'reorder', 'mainLocation', 'hsnCode', 'subLocation', 'placeOfSupply']);

    const columns = headerSet.has(selectedMaster)
        ? [
            {
                field: 'name',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Name</span>,
                type: 'string',
                sortable: true,
                minWidth: 100,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'inactiveStatus',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Inactive</span>,
                type: 'string',
                sortable: true,
                minWidth: 100,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'description',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Description</span>,
                type: 'string',
                sortable: true,
                minWidth: 100,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'actions',
                headerClassName: 'super-app-theme--header',
                type: 'actions',
                flex: 1,
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
                cellClassName: 'actions',
                disableClickEventBubbling: true,
                getActions: (params) => [
                    <EditData selectedRow={params.row} />,
                    <DeleteData selectedRow={params.row} />,
                ],
            },
        ]
        : [
            ...(selectedMaster !== 'product' && selectedMaster !== 'location' && selectedMaster !== 'section'
                ? [
                    {
                        field: 'code',
                        headerClassName: 'super-app-theme--header',
                        headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Code</span>,
                        type: 'string',
                        sortable: true,
                        minWidth: 100,
                        flex: 1,
                        align: 'center',
                        headerAlign: 'center',
                    },
                ]
                : []),
            ...(selectedMaster === 'menu'
                ? [
                    {
                        field: 'type',
                        headerClassName: 'super-app-theme--header',
                        headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Type</span>,
                        type: 'string',
                        sortable: true,
                        minWidth: 100,
                        flex: 1,
                        align: 'center',
                        headerAlign: 'center',
                    },
                ]
                : []),
            ...(selectedMaster !== 'location'
                ? [
                    {
                        field: 'name',
                        headerClassName: 'super-app-theme--header',
                        headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Name</span>,
                        type: 'string',
                        sortable: true,
                        minWidth: 100,
                        flex: 1,
                        align: 'center',
                        headerAlign: 'center',
                    },
                ]
                : []),
            ...(selectedMaster === 'pm'
                ? [
                    {
                        field: 'vendorProcess',
                        headerClassName: 'super-app-theme--header',
                        headerName: (
                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                InHouse/VendorProcess
                            </span>
                        ),
                        type: 'string',
                        sortable: true,
                        minWidth: 80,
                        flex: 1,
                        align: 'center',
                        headerAlign: 'center',
                        renderCell: (params) => {
                            return params.value === 1 ? 'Vendor Process' : 'InHouse';
                        },
                    },
                ]
                : []),
            ...(selectedMaster !== 'product' && selectedMaster !== 'location'
                ? [
                    {
                        field: 'inactiveStatus',
                        headerClassName: 'super-app-theme--header',
                        headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Inactive</span>,
                        type: 'string',
                        sortable: true,
                        minWidth: 100,
                        flex: 1,
                        align: 'center',
                        headerAlign: 'center',
                    },
                    {
                        field: 'inactiveRemarks',
                        headerClassName: 'super-app-theme--header',
                        headerName: (
                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                                Inactive Remarks
                            </span>
                        ),
                        type: 'string',
                        sortable: true,
                        minWidth: 100,
                        flex: 1,
                        align: 'center',
                        headerAlign: 'center',
                    },
                ]
                : []),
            ...(selectedMaster === 'itemGroup'
                ? [
                    {
                        field: 'chapterHdr',
                        headerName: 'ChapterHDR',
                        headerClassName: 'super-app-theme--header',
                        type: 'string',
                        sortable: true,
                        minWidth: 100,
                        flex: 1,
                        align: 'center',
                        headerAlign: 'center',
                    },
                    {
                        field: 'isstoreGroup',
                        headerName: 'is Store Group',
                        headerClassName: 'super-app-theme--header',
                        type: 'string',
                        sortable: true,
                        minWidth: 100,
                        flex: 1,
                        align: 'center',
                        headerAlign: 'center',
                    },
                ]
                : []),
            ...(selectedMaster === 'location'
                ? [
                    {
                        field: 'City',
                        headerName: 'City Name',
                        headerClassName: 'super-app-theme--header',
                        type: 'string',
                        sortable: true,
                        minWidth: 100,
                        flex: 1,
                        align: 'center',
                        headerAlign: 'center',
                    },
                    {
                        field: 'State',
                        headerName: 'State',
                        headerClassName: 'super-app-theme--header',
                        type: 'string',
                        sortable: true,
                        minWidth: 100,
                        flex: 1,
                        align: 'center',
                        headerAlign: 'center',
                    },
                    {
                        field: 'Country',
                        headerName: 'Country',
                        headerClassName: 'super-app-theme--header',
                        type: 'string',
                        sortable: true,
                        minWidth: 100,
                        flex: 1,
                        align: 'center',
                        headerAlign: 'center',
                    },
                ]
                : []),
            {
                field: 'description',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Description</span>,
                type: 'string',
                sortable: true,
                minWidth: 100,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'actions',
                headerClassName: 'super-app-theme--header',
                type: 'actions',
                flex: 1,
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
                cellClassName: 'actions',
                disableClickEventBubbling: true,
                getActions: (params) => [
                    <EditData selectedRow={params.row} />,
                    <DeleteData selectedRow={params.row} />,
                ],
            },
        ];



    useEffect(() => {
        AllShowMasterAdd({
            masterType: selectedMaster
        }, handleSucessShow, handleExceptionShow);

    }, [refreshData]);

    function EditData(props) {
        return (
            <EditIcon
                style={{
                    color: isModuleLocked ? "#706f6f" : "black",
                    pointerEvents: isModuleLocked ? "none" : "auto",
                    cursor: isModuleLocked ? "not-allowed" : "pointer",
                }}
                onClick={(event) => {
                    if (isModuleLocked) return;
                    setIsAddButton(false);
                    setEditData(props.selectedRow);
                    setOpen(true);
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    if (isModuleLocked) return;
                    setDeleteId(props.selectedRow.id);
                    setDeleteDailogOpen(true);

                }}
                style={{
                    color: isModuleLocked ? "#706f6f" : "black",
                    pointerEvents: isModuleLocked ? "none" : "auto",
                    cursor: isModuleLocked ? "not-allowed" : "pointer",
                }} />
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

    const masterList = [
        // { id: 2, masterName: 'Machine', value: 'machine' },
        // { id: 9, masterName: 'Ledger Group', value: 'ledgerGroup' },
        // { id: 15, masterName: 'FIM', value: 'fim' },
        // { id: 17, masterName: 'LOC', value: 'loc' },
        { id: 1, masterName: 'PM', value: 'pm' },
        { id: 2, masterName: 'Customer Group', value: 'customerGroup' },
        { id: 3, masterName: 'Role', value: 'role' },
        { id: 4, masterName: 'Department', value: 'department' },
        { id: 5, masterName: 'SP', value: 'sp' },
        { id: 6, masterName: 'Currency', value: 'currency' },
        { id: 7, masterName: 'DTR', value: 'dtr' },
        { id: 8, masterName: 'Section', value: 'section' },
        { id: 9, masterName: 'State', value: 'state' },
        { id: 10, masterName: 'Supplier Group', value: 'supplierGroup' },
        { id: 11, masterName: 'Tool', value: 'tool' },
        { id: 12, masterName: 'UOM', value: 'uom' },
        { id: 13, masterName: 'Item Group', value: 'itemGroup' },
        { id: 14, masterName: 'TARIFF', value: 'tarrif' },
        { id: 15, masterName: 'TRF', value: 'trf' },
        { id: 16, masterName: 'Designation', value: 'designation' },
        { id: 17, masterName: 'Menu Master', value: 'menu' },
        { id: 18, masterName: 'Product Master', value: 'product' },
        { id: 19, masterName: 'Location Master', value: 'location' },
        { id: 20, masterName: 'Country', value: 'country' },
        { id: 21, masterName: 'City', value: 'city' },
        //ITEM MASTER
        { id: 22, masterName: 'Under Ledger', value: 'underLedger' },
        { id: 23, masterName: 'Reorder', value: 'reorder' },
        { id: 24, masterName: 'Main Location', value: 'mainLocation' },
        { id: 25, masterName: 'HSNCode', value: 'hsnCode' },
        { id: 26, masterName: 'Sub Location', value: 'subLocation' },
        { id: 27, masterName: 'Product Finish', value: 'productFinish' },
        { id: 28, masterName: 'Product Family', value: 'productFamily' },
        { id: 29, masterName: 'Category', value: 'category' },
        { id: 30, masterName: 'FIM', value: 'fim' },
        { id: 31, masterName: 'RM Itemcode', value: 'rmItemcode' },
        { id: 33, masterName: 'BUY PRODUCTION', value: 'BUYPRODUCTION' },
        { id: 34, masterName: 'Place of Supply', value: 'placeOfSupply' },
        { id: 35, masterName: 'Display Name', value: 'displayName' },
        { id: 36, masterName: 'Inspection Level', value: 'inspectionLevel' },
        { id: 37, masterName: 'Problem Category', value: 'problemCategory' },
        { id: 38, masterName: 'Nature of Problem', value: 'natureOfProblem' },
    ]

    const handleSucessShow = (dataObject) => {
        serMasterData(dataObject?.data || []);
        setGridLoading(false);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

    }
    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <AddMasterTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
                selectedMaster={selectedMaster}
            />
            {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}> */}

            <Grid container spacing={2} style={{ marginTop: '-35px' }}>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3} marginTop={1.7} marginLeft={2}>
                    <FormControl fullWidth >
                        <InputLabel id="demo-simple-select-label">Select Master</InputLabel>
                        <Select

                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedMaster}
                            label="Select Master"
                            variant="filled"
                            size='small'
                            onChange={(e) => {
                                setSelectedMaster(e.target.value)
                                AllShowMasterAdd({
                                    masterType: e.target.value
                                }, handleSucessShow, handleExceptionShow);
                            }}
                        >
                            {masterList.map((data) => (
                                <MenuItem key={data.id} value={data.value}>{data.masterName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={1.7} marginLeft={2}>
                    <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '-20px', borderRadius: '10px', width: '98%', height: '100%' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    height: '150%',
                                    width: '100%',
                                    '& .super-app-theme--header': {
                                        backgroundColor: '#93bce6',
                                        color: '#1c1919'
                                    },
                                }}
                            >
                                <DataGrid
                                    rows={masterData}
                                    columns={columns}
                                    pageSize={8}
                                    loading={isLoading}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none', }}
                                    sx={{
                                        zoom: '90%',
                                        overflow: 'auto',
                                        height: '70vh',
                                        width: '100%',
                                        '& .super-app-theme--header': {
                                            WebkitTextStrokeWidth: '0.6px',
                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696', // Thinner, solid border
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696', // Thinner, solid border for column headers
                                        },
                                    }}
                                    getRowClassName={(params) => {
                                        const rowIndex = masterData.findIndex(row => row.id === params.row.id);
                                        if (rowIndex !== -1) {
                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }
                                        return '';
                                    }}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* </div> */}

            <AddMaster
                isAddButton={isAddButton}
                currencyData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
                configSetupData={editData}
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
                selectedMaster={selectedMaster}
                deleteService={AllMasterDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default AddMasterResult
// const mapStateToProps = ({ config }) => {
//     const { masterList, masterLoader } = config;
//     return { masterList, masterLoader }
// }
// export default connect(mapStateToProps, { showAllMasterData })(AddMasterResult);