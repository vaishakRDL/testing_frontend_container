import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, TextField, Checkbox, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { GetCustomerData, ItemGetItemsTypeFirst, SupplierDataShow } from '../../ApiService/LoginPageService';
import { ItemExportDownload } from '../../ApiService/DownloadCsvReportsService';
import { LoadingButton } from '@mui/lab';

const CustomerSearch = ({ opeAllView, setOpenAllView ,allDataList,setAllDataList}) => {
    const [isLoading, setIsLoading] = useState(false);
   
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
            GetCustomerData(handleItemGetItemsTypeFirstSuccess, hndleItemGetItemsTypeFirstException);
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
            field: 'cName',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Customer Name
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 170,
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
            minWidth: 170,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cCode',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Customer Code
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 180, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'cGroupName',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Customer Group
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            minWidth: 180, flex: 1, align: 'center', headerAlign: 'center'
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
            minWidth: 110, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'cAddress1',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Address 1
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 200,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'cAddress2',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Address 2
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 200,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'cAddress3',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Address 3
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 200,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'cAddress4',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Address 4
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 200,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'city',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    City
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'pincode',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Pincode
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 80,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'state',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    State
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'country',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Country
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'partyNotes',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Party notes
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 70,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'currencyName',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Currency
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'panNo',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Pan No
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 150,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'gstInUinId',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                   GSTInUinId
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 160,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'bi_phoneNo',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Bill Phone No
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 120,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'bi_faxNo',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Bill Fax No
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 120,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'email',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Email
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'payTerm',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Paymennt Terms
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'noTaxRemark',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    No Tax Remarks
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'creditday',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Credit Days
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'placeOfSupplyName',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Place of Supply
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 170,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'tcsCollected',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    TCS Collected
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'SubcharOnTcs',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Subcharges on TCS
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 110,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'CessOnTcs',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Cess on TCS
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'singleSaleOrd',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Single Sales Order
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'dcValue',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Apply DC Value
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'shortClose',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Auto SO Short Close
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'cgst',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    CGST%
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'sgst',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    SGST%
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'igst',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    IGST%
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'utgst',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    UTGST%
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'dcInfoReq',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    DC Info Required In
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'maxLineItem',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Max Line Items In
                </span>,
            headerClassName: 'super-app-theme--header',
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
       
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
                All Customer
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

export default CustomerSearch