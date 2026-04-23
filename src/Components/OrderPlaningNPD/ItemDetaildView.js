import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { InfoScrapList, InfoSheetList, OrderOList, SaleOrderFetch } from '../../ApiService/LoginPageService';
import { InfoScrapExport, InfoSheetExport, MrpDownloadorder } from '../../ApiService/DownloadCsvReportsService';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';


const ItemDetaildView = ({
    itemDetaildView,
    setItemDetaildView,
    selectSalesId,
    selectMrpMstId
}) => {

    const [itemDetail, setItemDetail] = useState([]);
    const [isViewData, setIsViewData] = useState(0);
    const [sheetScrapList, setSheetScrapList] = useState([]);
    const [sheetInfoList, setSheetInfoList] = useState([]);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [loader, setLoader] = useState(false);
    const [total, setTotal] = useState('');
    const [completed, setCompleted] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        if (itemDetaildView) {
            OrderOList({
                id: selectSalesId
            }, handleSaleOrderFetch, handleSaleOrderFetchException);
        }

    }, [selectSalesId, itemDetaildView]);

    useEffect(() => {
        if (isViewData === 1) {
            InfoSheetList({
                from: from,
                to: to
            }, handleInfoSheetListSuccess, handleInfoSheetListException);
        } else if (isViewData === 2) {
            InfoScrapList({
                from: from,
                to: to
            }, InfoScrapListSuccess, handleInfoScrapListEception);
        } else {
            setSheetScrapList([]);
            setSheetInfoList([]);
            setFrom('');
            setTo('');
        }

    }, [isViewData]);


    const handleInfoSheetListSuccess = (dataObject) => {
        setSheetInfoList(dataObject?.data || []);
    }

    const handleInfoSheetListException = () => {

    }

    const InfoScrapListSuccess = (dataObject) => {
        setSheetScrapList(dataObject?.data || []);
    }

    const handleInfoScrapListEception = () => {

    }

    const handleSaleOrderFetch = (dataObject) => {
        setItemDetail(dataObject?.data || []);
        setTotal(dataObject?.totalJC || '0');
        setCompleted(dataObject?.completedJC || '0');
    }

    const handleSaleOrderFetchException = () => {

    }

    const handleSubmit = () => {

    };

    const columns = [
        {
            field: 'slNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'contractNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Contract No
                </span>,

            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item | Part No
                </span>,

            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item | Part Name
                </span>,

            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'left', headerAlign: 'center'
        },
        // {
        //     field: 'devliveryDate',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Kanban Date
        //         </span>,

        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        // },

        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Order Qty
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        // {
        //     field: 'status',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Status
        //         </span>,

        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        // },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Actions
        //         </span >,
        //     minWidth: 350, maxWidth: 600,
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,

        //     getActions: (params) => [
        //         // <RowSelectAction selectedRow={params.row} />,
        //         // <SelectAction selectedRow={params.row} />,
        //         // <DeleteData selectedRow={params.row} />,
        //     ],
        // },
    ];

    const columns2 = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'rmThickness',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    T
                </span>,

            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'rmWidth',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    W
                </span>,

            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'rmLength',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    L
                </span>,

            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'totalWt',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    TOT WT
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'material',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Material
                </span>,

            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'rmItem',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    RM Item
                </span>,

            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },

    ];

    const columns3 = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'material',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Material
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'totQty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Total Qty
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'totalWt',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Total Wt
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'rmItem',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    RM Item
                </span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        // {
        //     field: 'Category',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Category
        //         </span>,
        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        // },
        // {
        //     field: 'Material',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Material
        //         </span>,
        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        // },
        // {
        //     field: 'Qty',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Qty
        //         </span>,
        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        // },
        // {
        //     field: 'sc',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Scrap W
        //         </span>,
        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        // },
        // {
        //     field: 'sc',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Scrap Wt
        //         </span>,
        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        // },
        // {
        //     field: 'rmitem',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             RM Item
        //         </span>,
        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        // },
        // {
        //     field: 'Total Scrap Wt',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Total Scrap Wt
        //         </span>,
        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        // },

    ];


    const onDownloadClicked = () => {
        if (isViewData === 1) {
            InfoSheetExport({
                from: from,
                to: to
            }, handleInfoSheetExportSuccess, handleInfoSheetExportException);

        } else if (isViewData === 2) {
            InfoScrapExport({
                from: from,
                to: to
            }, handleInfoScrapExportSuccess, handleInfoScrapExportException);
        }
    }

    const handleInfoSheetExportSuccess = () => {

    }

    const handleInfoSheetExportException = () => {

    }

    const handleInfoScrapExportSuccess = () => {

    }

    const handleInfoScrapExportException = () => {

    }

    const handleMrpDownloadSuccess = () => {

    }

    const handleMrpDownloadException = () => {

    }
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={itemDetaildView}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* {isAddButton ? 'Add Sales Order' : 'Edit Sales Order'} */}
                {
                    isViewData === 0 ? 'Ordered Item List' : isViewData === 1 ? 'Sheet Info' : 'Sheet Scrap Info'
                }

            </DialogTitle>
            <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                <DialogContent>
                    <div style={{ height: '100%' }}>
                        {
                            isViewData === 0 ? (
                                <>
                                    <DataGrid
                                        rows={itemDetail}
                                        columns={columns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '70vh',
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
                                            const rowIndex = itemDetail.findIndex(row => row.id === params.row.id);
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

                                </>
                            ) : isViewData === 1 ? (
                                <Grid container spacing={2}>
                                    <Grid item sm={12} md={6} lg={4} xl={4}>
                                        <TextField
                                            id="filled-basic"
                                            label="From Date"
                                            variant="filled"
                                            fullWidth
                                            type='date'
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            placeholder="From Date"
                                            onChange={(e) => setFrom(e.target.value)}

                                        />
                                    </Grid>

                                    <Grid item sm={12} md={6} lg={4} xl={4}>
                                        <TextField
                                            id="filled-basic"
                                            label="To Date"
                                            variant="filled"
                                            fullWidth
                                            type='date'
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            placeholder="To Date"
                                            onChange={(e) => setTo(e.target.value)}

                                        />
                                    </Grid>
                                    <Grid item sm={12} md={6} lg={3} xl={3} style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center' }}>
                                        <Button
                                            variant="contained"
                                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                                            onClick={(e) => {
                                                InfoSheetList({
                                                    from: from,
                                                    to: to
                                                }, handleInfoSheetListSuccess, handleInfoSheetListException);
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    </Grid>


                                    <Grid item sm={12} md={12} lg={12} xl={12}>
                                        <DataGrid
                                            rows={sheetInfoList}
                                            columns={columns2}
                                            pageSize={8}
                                            // loading={isLoading}
                                            rowsPerPageOptions={[8]}
                                            disableSelectionOnClick
                                            style={{ border: 'none', }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '70vh',
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

                                            rowHeight={40}
                                            columnHeaderHeight={40}

                                            getRowClassName={(params) => {
                                                // Find the index of the row within the rows array
                                                const rowIndex = itemDetail.findIndex(row => row.id === params.row.id);
                                                // Check if the index is valid
                                                if (rowIndex !== -1) {
                                                    console.log(' ');
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return ''; // Return default class if index is not found
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid container spacing={2}>
                                    <Grid item sm={12} md={6} lg={4} xl={4}>
                                        <TextField
                                            id="filled-basic"
                                            label="From Date"
                                            variant="filled"
                                            fullWidth
                                            type='date'
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            placeholder="From Date"

                                        />
                                    </Grid>

                                    <Grid item sm={12} md={6} lg={4} xl={4}>
                                        <TextField
                                            id="filled-basic"
                                            label="To Date"
                                            variant="filled"
                                            fullWidth
                                            type='date'
                                            required
                                            InputLabelProps={{ shrink: true }}
                                            placeholder="To Date"

                                        />
                                    </Grid>

                                    <Grid item sm={12} md={6} lg={3} xl={3} style={{ display: 'flex', justifyContent: 'center', alignSelf: 'center' }}>
                                        <Button
                                            variant="contained"
                                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                                            onClick={(e) => {
                                                InfoScrapList({
                                                    from: from,
                                                    to: to
                                                }, InfoScrapListSuccess, handleInfoScrapListEception);
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    </Grid>

                                    <Grid item sm={12} md={12} lg={12} xl={12}>
                                        <DataGrid
                                            rows={sheetScrapList}
                                            columns={columns3}
                                            pageSize={8}
                                            // loading={isLoading}
                                            rowsPerPageOptions={[8]}
                                            disableSelectionOnClick
                                            style={{ border: 'none', }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '70vh',
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
                                                const rowIndex = itemDetail.findIndex(row => row.id === params.row.id);
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
                                </Grid>

                            )

                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    {
                        isViewData != 0 ? (
                            <>
                                <Button
                                    variant="contained"
                                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                                    onClick={(e) => {
                                        setIsViewData(0);
                                    }}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                                    onClick={(e) => {
                                        setLoader(true)
                                        onDownloadClicked()
                                    }}
                                >
                                    Download
                                </Button>
                            </>

                        ) : (
                            <>
                            </>
                        )
                    }

                    {
                        isViewData === 0 ? (
                            <>
                                <div style={{ width: '150px', height: '35px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dotted', cursor: 'not-allowed' }}>
                                    <Typography style={{ fontWeight: 'bold', fontFamily: 'Monospace' }}>{`${completed}/${total}`}</Typography>
                                </div>
                                <Button
                                    variant="contained"
                                    style={{ background: '#002D68', color: 'white' }}
                                    onClick={(e) => {
                                        navigate(`/JobCardViewNewResult?isJobCardStatus=false&&mrpMstId=${selectMrpMstId}`)
                                        // navigate(`/PurchaseBillAgainstPOModule?isEdit=true&&PBNo=${props.selectedRow.digit}&&qcApproval=${props.selectedRow.qcApproval}`)
                                    }}
                                >
                                    JobCard Status
                                </Button>
                                <Button
                                    variant="contained"
                                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                                    onClick={(e) => {
                                        MrpDownloadorder({
                                            from: from,
                                            to: to,
                                            id: selectSalesId
                                        }, handleMrpDownloadSuccess, handleMrpDownloadException);
                                    }}
                                >
                                    Download
                                </Button>
                                <Button
                                    variant="contained"
                                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                                    onClick={(e) => {
                                        setIsViewData(1);
                                    }}
                                >
                                    Sheet Info
                                </Button>
                                <Button
                                    variant="contained"
                                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                                    onClick={(e) => {
                                        setIsViewData(2);
                                    }}
                                >
                                    Scrap Info
                                </Button>
                            </>

                        ) : isViewData === 0 || isViewData === 1 ? (
                            <Button
                                variant="contained"
                                style={{ width: '150px', background: '#002D68', color: 'white' }}
                                onClick={(e) => {
                                    setIsViewData(1);
                                }}
                            >
                                Sheet Info
                            </Button>

                        ) : isViewData === 0 || isViewData === 2 ? (
                            <>
                                <Button
                                    variant="contained"
                                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                                    onClick={(e) => {
                                        setIsViewData(2);
                                    }}
                                >
                                    Scrap Info
                                </Button>
                            </>
                        ) : (
                            <>
                            </>
                        )
                    }
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setItemDetaildView(false);
                            setItemDetail([]);
                            setIsViewData(0);
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </form>
            {/* <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
    /> */}

        </Dialog>
    )
}

export default ItemDetaildView
