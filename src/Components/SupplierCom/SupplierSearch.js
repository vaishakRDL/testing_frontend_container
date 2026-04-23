import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, TextField, Checkbox, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { ItemGetItemsTypeFirst, SupplierDataShow } from '../../ApiService/LoginPageService';
import { ItemExportDownload } from '../../ApiService/DownloadCsvReportsService';
import { LoadingButton } from '@mui/lab';

const SupplierSearch = ({ opeAllView, setOpenAllView }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [allDataList, setAllDataList] = useState([]);
    const [isDownload, setIsDownload] = useState(false);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    useEffect(() => {
        if (opeAllView) {
            setIsLoading(true);
            SupplierDataShow(handleItemGetItemsTypeFirstSuccess, hndleItemGetItemsTypeFirstException);
        }
    }, [opeAllView]);

    const handleItemGetItemsTypeFirstSuccess = (dataObject) => {
        setAllDataList(dataObject?.data || []);
        setIsLoading(false);
        // console.log('dataList===>', dataObject?.data);
    }

    const hndleItemGetItemsTypeFirstException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    }
    const columns = [
        {
            field: 'spName',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supplier Name
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'gstNo',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    GST Number
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'spCode',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supplier Code
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'supplyGroupName',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supplier Group
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'spType',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supplier Type
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'tallyAlias',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Tally Alias

                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'spAddress',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Address
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
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


    const handledDownloadSuccess = (dataObject) => {
        setIsDownload(false);
    }

    const handleDownloadException = () => {

    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            // maxWidth="xl"
            open={opeAllView}
            fullScreen
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                All Supplier
            </DialogTitle>
            <DialogContent style={{ padding: '30px' }}>
                <Grid container spacing={2}>
                    <DataGrid
                        rows={allDataList}
                        columns={columns}
                        pageSize={8}
                        loading={isLoading}
                        rowsPerPageOptions={[8]}
                        disableSelectionOnClick
                        style={{ border: 'none' }}
                        sx={{
                            overflow: 'auto',
                            height: '80vh',
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
                                border: '1px solid #969696',
                            },
                        }}
                        getRowClassName={(params) => {
                            const rowIndex = allDataList.findIndex(row => row.id === params.row.id);
                            if (rowIndex !== -1) {
                                console.log(' ');
                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                            }
                            return '';
                        }}
                        rowHeight={40}
                        columnHeaderHeight={40}
                    />


                </Grid>
            </DialogContent>
            <DialogActions>
                {/* {
                    isDownload ? (
                        <LoadingButton style={{ width: '200px', height: '35px' }} loading variant="contained" />
                    ) : (
                        <Button
                            variant="contained"
                            style={{ width: '200px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setIsDownload(true);
                                ItemExportDownload(handledDownloadSuccess, handleDownloadException);
                            }}
                        >

                            Download
                        </Button>
                    )

                } */}


                <Button
                    variant="contained"
                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                    onClick={(e) => {
                        setOpenAllView(false);

                    }}
                >
                    Cancel
                </Button>
            </DialogActions>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

        </Dialog>
    )
}

export default SupplierSearch