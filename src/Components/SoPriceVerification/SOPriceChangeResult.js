import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import { DispatchSearchFim, DispatchShowData, SoVerification, SoVerificationSave, SobShowData, soVerificationAuthorize } from '../../ApiService/LoginPageService';
import SOPriceChangeTitle from './SOPriceChangeTitle';
import SearchIcon from '@mui/icons-material/Search';
import CostingDocument from './CostingDocument';
import { DownloadSOPricePriceNewTemplate, DownloadSOPricePriceTemplate } from '../../ApiService/DownloadCsvReportsService';
import { Typography } from '@material-ui/core';
import RecommendIcon from '@mui/icons-material/Recommend';
import CustomePopUp from '../../Utility/CustomePopUp';
import { useModuleLocks } from '../context/ModuleLockContext';


const SOPriceChangeResult = () => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "SO Price Verification")?.lockStatus === "locked";

    const [isApproveVisible, setIsApproveVisible] = useState(false);
    const [isButtonFlag, setButtonFlag] = useState(false);
    const [compareloading, setcompareloading] = useState(false);

    const [open, setOpen] = useState(false);
    const [openDocument, setOpenDocument] = useState(false);
    console.log("openDocumentopenDocument", openDocument)
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [viewButton, setViewButton] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [data, setDataList] = useState([]);
    const [file, setFile] = useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [itemNo, setItemNo] = useState('');
    const [itemShowListSeach, setItemShowListSeach] = useState([]);
    const [verifiedCount, setVerifiedCount] = useState('');
    const [notVerifiedCount, setNotVerifiedCount] = useState('');
    const [mismatchCount, setMismatchCount] = useState('');
    const [pricePONO, setPricePONO] = useState('');
    const [pricedate, setPriceDate] = useState('');
    const [id, setId] = useState('');
    const [isChild, setIsChild] = useState(false);
    const [child, setChild] = useState([]);
    const [packingDetails, setPackingDetails] = useState([]);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const columns = [
        {
            field: 'id',
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
            field: 'itemNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'orderedQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Qty Ordered
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'unitCost',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Unit Cost
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'arrivedCost',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Arrived Cost
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'requestedDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Request Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'promisedDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Promised Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'extendedDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Extended Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        // {
        //     field: 'difference',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Difference
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
        {
            field: 'difference',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Difference
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <span style={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: params?.row?.colorStatus, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {params.value}
                </span>
            )
        },
        {
            field: 'description',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Description
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'status',
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
        // {
        //     field: 'Landing',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Landing
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
        // {
        //     field: 'Difference',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Difference
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Actions
        //         </span>,
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         <EditData selectedRow={params.row} />,
        //         <DeleteData selectedRow={params.row} />,
        //     ],
        // },
    ];

    const onColorData = (params) => {
        console.log('onColorData', params?.row?.colorStatus)
        return

    }

    const columns2 = [
        {
            field: 'id',
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
            field: 'partNo',
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
            headerAlign: 'center'
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
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    UOM
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Qty
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
                <span style={{ fontWeight: 'bold', fontSize: '16px', }}>
                    Basic Rate
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <span style={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: params?.row?.colorStatus, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {params.value}
                </span>
            )
        },
        {
            field: 'finalRate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px', }}>
                    Final Rate
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <span style={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: params?.row?.colorStatus, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {params.value}
                </span>
            )
        },

    ];

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


    // const options = DataList.map(item => ({
    //     id: item?.sNo,
    //     label: item?.fimNo
    // }));

    const handleSoVerificationSuccess = (dataObject) => {
        setcompareloading(false)
        console.log("dataObject===>", dataObject?.dataObject)
        setDataList(dataObject?.data || []);
        setMismatchCount(dataObject?.mismatchCount || 0);
        setNotVerifiedCount(dataObject?.notVerifiedCount || 0);
        setVerifiedCount(dataObject?.verifiedCount || 0);
        setPriceDate(dataObject?.date || 0);
        setPricePONO(dataObject?.poNo || 0);
        setId(dataObject?.id || 0);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
        }, 3000);
    };


    const handleSoVerificationException = (errorObject, errorMessage) => {
        setcompareloading(false)
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });

        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
        }, 3000);
    }

    const onRowClikData = (e) => {
        setIsChild(true);
        setChild(e.row.child || []);
        setPackingDetails(e.row.packingDetails || []);
        setItemNo(e.row.itemNo || '');
    };

    const handleDownloadSoSucess = () => {
    };

    const handleDownloadSoException = () => {
    };


    const handleClear = () => {
        setDataList([]);
        setMismatchCount('');
        setNotVerifiedCount('');
        setVerifiedCount('');
        setPriceDate('');
        setId('');
        setPricePONO('');
        setFile('')
        setIsApproveVisible(false);
        setButtonFlag(false);
    }

    const handleConfirmSave = () => {
        setDeleteConfirmOpen(false);

        const payload = {
            data,
            mismatchCount,
            notVerifiedCount,
            verifiedCount,
            pricedate,
            pricePONO,
        };
        SoVerificationSave({
            ...payload
        }, handlePOSuccess, handlePOException);
        console.log("Saving confirmed! Send API request here.");
    };

    const handleSaveClick = () => {
        setDeleteConfirmOpen(true); // Open dialog when clicking Save
    };

    const handlePOSuccess = (dataObject) => {
        setViewButton(false);

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setPriceDate(dataObject?.data?.date || '');
        setId(dataObject?.data?.id || '');
        setDeleteConfirmOpen(false);

        setTimeout(() => {
            handleClose();
        }, 3000);
    };

    const handlePOException = (errorObject, errorMessage) => {
        setViewButton(false);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });

        setTimeout(() => {
            setDeleteDailogOpen(false);
        }, 3000);
    };

    const handleAuthorizeSucess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setIsApproveVisible(false);
        setTimeout(() => {
            handleClose();
        }, 3000);
    }
    const handleAuthorizeException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    return (
        <div style={{ height: '80vh', width: '100%', marginTop: '10px' }}>
            {
                !isChild ? (
                    <>
                        <SOPriceChangeTitle />
                        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '-20px', padding: '20px' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                            {/* <TextField
                                    id="filled-basic"
                                    label="Select Excel File"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    size='small'
                                    fullWidth
                                    // value={}
                                    required
                                    placeholder="Select Excel File"
                                /> */}

                                            <TextField
                                                fullWidth
                                                label="Select Excel File"
                                                style={{
                                                    // margin: '10px'
                                                }}
                                                disabled={isModuleLocked}
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        const reader = new FileReader();
                                                        reader.onload = () => {
                                                            if (reader.readyState === 2) {
                                                                setFile(reader.result);
                                                            }
                                                        };
                                                        reader.readAsDataURL(e.target.files[0]);
                                                    }
                                                }}
                                                InputLabelProps={{ shrink: true }}
                                                type="file"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', columnGap: '10px' }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                // htmlFor="upload-photo"
                                                disabled={compareloading || isModuleLocked}
                                                sx={{ backgroundColor: isModuleLocked ? '#ccc' : '#002D68', height: '40px', width: '200px' }}
                                                onClick={() => {
                                                    setcompareloading(true)
                                                    SoVerification({
                                                        file: file
                                                    }, handleSoVerificationSuccess, handleSoVerificationException);
                                                }}
                                            >
                                                {compareloading ? (
                                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                                ) : (
                                                    'Compare Rates'
                                                )}
                                            </Button>

                                            <Button
                                                variant="contained"
                                                component="label"
                                                sx={{ backgroundColor: '#002D68', height: '40px', width: '200px' }}
                                                onClick={() => {
                                                    DownloadSOPricePriceNewTemplate(handleDownloadSoSucess, handleDownloadSoException);
                                                }}
                                            >
                                                Template
                                            </Button>
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', columnGap: '10px' }}>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                sx={{ backgroundColor: '#002D68', height: '40px', width: '200px' }}
                                                onClick={() => setOpenDocument(true)}
                                            >
                                                <SearchIcon />
                                            </Button>

                                            <Button
                                                variant="contained"
                                                component="label"
                                                sx={{ backgroundColor: isModuleLocked ? '#ccc' : '#002D68', height: '40px', width: '200px' }}
                                                onClick={handleSaveClick}
                                                disabled={isButtonFlag || isModuleLocked}
                                            >
                                                Save
                                            </Button>

                                            <Button
                                                variant="contained"
                                                component="label"
                                                sx={{ backgroundColor: '#002D68', height: '40px', width: '200px' }}
                                                onClick={handleClear}
                                            >
                                                Claer
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                            <TextField
                                                id="filled-basic"
                                                label="No. of Verified Rates"
                                                variant="filled"
                                                sx={{ mb: 1 }}
                                                size='small'
                                                fullWidth
                                                value={verifiedCount || 0}
                                                required
                                                placeholder="No. of Verified Rates"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                            <TextField
                                                id="filled-basic"
                                                label="No. of Not Verified Rates"
                                                variant="filled"
                                                sx={{ mb: 1 }}
                                                size='small'
                                                fullWidth
                                                value={notVerifiedCount || 0}
                                                required
                                                placeholder="No. of Not Verified Rates"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                            <TextField
                                                id="filled-basic"
                                                label="No. of Mismatching Rates"
                                                variant="filled"
                                                sx={{ mb: 1 }}
                                                size='small'
                                                fullWidth
                                                value={mismatchCount || 0}
                                                required
                                                placeholder="No. of Mismatching Rates"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                            <TextField
                                                id="filled-basic"
                                                label="PONO"
                                                variant="filled"
                                                sx={{ mb: 1 }}
                                                size='small'
                                                fullWidth
                                                value={pricePONO || ''}
                                                required
                                                placeholder="PONO"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                            <TextField
                                                id="filled-basic"
                                                label="Date"
                                                variant="filled"
                                                sx={{ mb: 1 }}
                                                size='small'
                                                fullWidth
                                                value={pricedate || ''}
                                                InputLabelProps={{ shrink: true }}
                                                required
                                                placeholder="Date"
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                            <TextField
                                                id="filled-basic"
                                                label="ID"
                                                variant="filled"
                                                sx={{ mb: 1 }}
                                                size='small'
                                                fullWidth
                                                value={id || ''}
                                                InputLabelProps={{ shrink: true }}
                                                required
                                                placeholder="Id"
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <Card style={{ borderRadius: '8px', height: '100%', marginTop: '0px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)", width: '100%' }}>
                                        <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <DataGrid
                                                rows={data}
                                                columns={columns}
                                                pageSize={8}
                                                rowsPerPageOptions={[8]}
                                                disableSelectionOnClick
                                                onRowClick={onRowClikData}
                                                style={{ border: 'none', fontWeight: 'bold', overflowY: 'scroll' }}
                                                sx={{
                                                    overflow: 'auto',
                                                    height: '50vh',
                                                    '& .super-app-theme--header': {
                                                        WebkitTextStrokeWidth: '0.6px',
                                                        backgroundColor: '#93bce6',
                                                        color: '#1c1919'
                                                    },
                                                }}
                                                getRowClassName={(params) => {
                                                    const rowIndex = itemShowListSeach.findIndex(row => row.id === params.row.id);
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
                                        {isButtonFlag ? isApproveVisible ?
                                            (<Grid item xs={12} sm={12} md={2} lg={5} xl={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '25px', marginBottom: '25px', columnGap: '30px' }}>
                                                <Typography style={{ fontSize: "18px", color: 'red', textAlign: 'left' }}>
                                                    Pending For Approval
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                    htmlFor="upload-photo"
                                                    disabled={isModuleLocked}
                                                    sx={{ backgroundColor: isModuleLocked ? '#ccc' : '#002D68', height: '40px', width: '200px' }}
                                                    onClick={() => {
                                                        soVerificationAuthorize({ id: id }, handleAuthorizeSucess, handleAuthorizeException);
                                                    }}
                                                >
                                                    Approve
                                                </Button>

                                            </Grid>
                                            )
                                            :
                                            <div style={{ backgroundColor: 'limegreen', width: '150px', height: '30px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '25px', marginBottom: '25px' }}>
                                                <Typography style={{ color: '#ffffff' }}>Approved</Typography>
                                            </div>
                                            :
                                            null
                                        }
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    </>

                ) : (
                    <>
                        <Grid container spacing={2} style={{
                            padding: '10px'
                        }}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                    ITEM NO: {itemNo}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Card style={{ borderRadius: '8px', height: '100%', marginTop: '0px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)", width: '100%' }}>
                                    <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <DataGrid
                                            rows={child}
                                            columns={columns2}
                                            pageSize={8}
                                            rowsPerPageOptions={[8]}
                                            disableSelectionOnClick
                                            style={{ border: 'none', fontWeight: 'bold', overflowY: 'scroll' }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '60vh',
                                                '& .super-app-theme--header': {
                                                    WebkitTextStrokeWidth: '0.6px',
                                                    backgroundColor: '#93bce6',
                                                    color: '#1c1919'
                                                },
                                            }}
                                            getRowClassName={(params) => {
                                                const rowIndex = itemShowListSeach.findIndex(row => row.id === params.row.id);
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
                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <TextField
                                    id="filled-basic"
                                    label="Packing Rate"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    size='small'
                                    fullWidth
                                    value={packingDetails?.packingRate}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    placeholder="Packing Rate"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <TextField
                                    id="filled-basic"
                                    label="No Of Packing"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    size='small'
                                    fullWidth
                                    value={packingDetails?.noOfPacking}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    placeholder="No Of Packing"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    id="filled-basic"
                                    label="Total Packing + Total Item Changes"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    size='small'
                                    fullWidth
                                    value={packingDetails?.totCharge}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    placeholder="Total Packing + Total Item Changes"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                                <TextField
                                    id="filled-basic"
                                    label="Total Packing Changes"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    size='small'
                                    fullWidth
                                    value={packingDetails?.packingCharge}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                    placeholder="Total Packing Changes"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    htmlFor="upload-photo"
                                    sx={{ backgroundColor: '#002D68', height: '40px', width: '200px' }}
                                    onClick={() => {
                                        setIsChild(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                )
            }

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
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />

            <CostingDocument
                openDocument={openDocument}
                setOpenDocument={setOpenDocument}
                data={data}
                setDataList={setDataList}
                mismatchCount={mismatchCount}
                setMismatchCount={setMismatchCount}
                pricedate={pricedate}
                setPriceDate={setPriceDate}
                verifiedCount={verifiedCount}
                setVerifiedCount={setVerifiedCount}
                notVerifiedCount={notVerifiedCount}
                setNotVerifiedCount={setNotVerifiedCount}
                setId={setId}
                setPricePONO={setPricePONO}
                setIsApproveVisible={setIsApproveVisible}
                setButtonFlag={setButtonFlag}

            />


            {/* <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
                <DialogTitle>Confirm Save</DialogTitle>
                <DialogContent>Are you sure you want to save?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmSave} color="primary" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog> */}

            {/* <Dialog
                open={deleteConfirmOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                size="md"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Save
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to save?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmSave} color="primary" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog> */}

            <CustomePopUp
                title={'Confirmation'}
                titleColor={'#000000'}
                message={'Are you sure you want to save?'}
                messageColor={'#000000'}
                CustomIcon={RecommendIcon}
                iconColor={'#074173'}
                confirmButtonTitle={'YES'}
                confirmButtonBackGround={'#41B06E'}
                confirmButtonTextColor={'#ffffff'}
                closeButtonTitle={'NO'}
                closeButtonBackground={'#DD5746'}
                closeButtonTextColor={'#ffffff  '}
                customeOpen={deleteConfirmOpen}
                setViewButton={setViewButton}
                viewButton={viewButton}
                setCustomeOpen={setDeleteConfirmOpen}
                handleCustomeSuccess={handlePOSuccess}
                handleCustomeFailure={handlePOException}
                customeServicesApi={SoVerificationSave}
                bodyData={{
                    data,
                    mismatchCount,
                    notVerifiedCount,
                    verifiedCount,
                    pricedate,
                    pricePONO,
                }}
            />
        </div >
    )
}

export default SOPriceChangeResult
