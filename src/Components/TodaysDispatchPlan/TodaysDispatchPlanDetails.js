import { Button, Dialog, CircularProgress, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { DispatchCustDelScheduleShowDetail, TodayDispatchShowDetail, TodaysDispatchUpdate } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';

const TodaysDispatchPlanDetails = ({
    setOpen, open, setRefreshData, delNotNo, refreshData
}) => {
    const [submitloading, setSubmitLoading] = useState(false);
    const [itemDetail, setItemDetail] = useState([]);
    // const [pageRefresher, setPageRefresher] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (open) {
            TodayDispatchShowDetail({
                delNo: delNotNo
            }, DispatchCustDelScheduleShowDetailSuccess, DispatchCustDelScheduleShowDetailException);
        }
    }, [open, refreshData]);


    const DispatchCustDelScheduleShowDetailSuccess = (dataObject) => {
        setItemDetail(dataObject?.data || []);
    }

    const DispatchCustDelScheduleShowDetailException = (dataObject) => {

    }

    const columns = [
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
            field: 'contractNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Contract No / Part No
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'fimNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    FIM No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Po No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        // {
        //     field: 'fimNo',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //         FIM No
        //     </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
        // {
        //     field: 'type',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //         Type
        //     </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },

        // {

        //     field: 'duty',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Duty
        //         </span>,

        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        // },

        // {

        //     field: 'stop',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Stop
        //         </span>,

        //     type: 'number',
        //     sortable: true,
        //     sortable: false,
        //     minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        // },
        {

            field: 'shipmentQty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Qty
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {

            field: 'accQty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Accepted Qty
                </span>,

            type: 'number',
            sortable: true,
            editable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {

            field: 'rejQty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Rejected Qty
                </span>,

            type: 'number',
            sortable: true,
            editable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },

    ];

    const handleCellEdit = (params) => {
        const updatedList = itemDetail.map((item) =>
            item.id === params.id ?
                { ...item, accQty: Number(params.accQty), rejQty: Number(params.shipmentQty) - Number(params.accQty) }
                : item
        )
        setItemDetail(updatedList);
        console.log("nnnnnnnnnnnnnnnnnnnnnnn", updatedList)
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     TodaysDispatchUpdate({
    //         delNote: delNotNo,
    //         qcData: itemDetail
    //     }, handleDispatchUpdate, handleDispatchException)
    // }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        // Filter out items where accQty is 0
        const filteredItemDetail = itemDetail.filter(item => item.accQty > 0);

        // Only send if there's at least one valid item
        if (filteredItemDetail.length > 0) {
            TodaysDispatchUpdate(
                {
                    delNote: delNotNo,
                    qcData: filteredItemDetail
                },
                handleDispatchUpdate,
                handleDispatchException
            );
        } else {
            console.log("No valid items to send.");
        }
    };


    const handleDispatchUpdate = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setSubmitLoading(false);

        setTimeout(() => {
            handleClose();
            setOpen(false);
            setRefreshData((oldvalue) => !oldvalue);
        }, 2000);
    };

    const handleDispatchException = (errorObject, errorMessage) => {
        setSubmitLoading(false);

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

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                Detailed View
            </DialogTitle>
            <form onSubmit={handleSubmit} >
                <DialogContent>
                    <DataGrid
                        rows={itemDetail}
                        columns={columns}
                        pageSize={8}
                        // loading={isLoading}
                        rowsPerPageOptions={[8]}
                        processRowUpdate={handleCellEdit}
                        disableSelectionOnClick
                        style={{ border: 'none', fontWeight: 'bold' }}
                        sx={{
                            overflow: 'auto',
                            height: '60vh',
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
                            const rowIndex = itemDetail.findIndex(row => row.id === params.row.id);
                            if (rowIndex !== -1) {
                                console.log(' ');
                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                            }
                            return '';
                        }}
                        rowHeight={40}
                        columnHeaderHeight={40}
                    />
                </DialogContent>
                <DialogActions>

                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        type='submit'
                        disabled={submitloading}
                    >
                        {submitloading ? (
                            <CircularProgress size={24} style={{ color: 'white' }} />
                        ) : (
                            "Submit"
                        )}                         </Button>

                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </form>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Dialog>
    )
}

export default TodaysDispatchPlanDetails
