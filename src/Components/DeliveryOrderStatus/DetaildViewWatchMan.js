import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { DispatchCustDelScheduleShowDetail, DispatchDelStatusSubmit, DispatchDelStatusSubmitAll } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';

const DetaildViewWatchMan = ({
    setOpen, open, setRefreshData, delNotNo
}) => {
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [itemDetail, setItemDetail] = useState([]);
    const [isRefresh, setIsRefresh] = useState(false);
    const [selctedId, setSelectedId] = useState([])

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (itemDetail && itemDetail.length > 0) {
            const preSelectedIds = itemDetail
                .filter(row => row.status === 1) // Select rows where status = 1
                .map(row => row.id);

            setSelectedId(preSelectedIds); // Set selected rows
        }
    }, [itemDetail]);

    useEffect(() => {
        if (open) {
            DispatchCustDelScheduleShowDetail({
                delID: delNotNo
            }, DispatchCustDelScheduleShowDetailSuccess, DispatchCustDelScheduleShowDetailException);
        }
    }, [open, isRefresh]);


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
            width: 60, align: 'center', headerAlign: 'center'
        },
        {

            field: 'invNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Invoice No
                </span>,
            type: 'string',
            sortable: true,
            width: 150, align: 'center', headerAlign: 'center'
        },
        {

            field: 'invDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Invoice Date
                </span>,

            type: 'string',
            sortable: true,
            width: 150, align: 'center', headerAlign: 'center'
        },


        {
            field: 'contractNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Contract No / Part No
                </span>,

            type: 'string',
            sortable: true,
            width: 120, align: 'left', headerAlign: 'center'
        },

        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    PO No
                </span>,

            type: 'string',
            sortable: true,
            width: 140, align: 'left', headerAlign: 'center'
        },
        {
            field: 'delNoteNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Del_Note.Ref.No
                </span>,
            type: 'string',
            sortable: true,
            width: 100,

            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'fimNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                FIM No
            </span>,
            type: 'string',
            sortable: true,
            width: 80,

            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'qty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Qty
            </span>,
            type: 'Number',
            sortable: true,
            width: 50,

            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'type',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Type
            </span>,
            type: 'string',
            sortable: true,
            width: 70,

            align: 'center',
            headerAlign: 'center'
        },

        {

            field: 'duty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Duty
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            width: 90, align: 'center', headerAlign: 'center'
        },

        {

            field: 'stop',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Stop
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            width: 80, align: 'center', headerAlign: 'center'
        },

    ];

    const selectAllData = (e) => {
        DispatchDelStatusSubmitAll({
            status: e.target.checked,
            dlNo: delNotNo
        }, handleDispatchDelStatusSubmitAllSucces, handleDispatchDelStatusSubmitAllException);
    }

    const handleRowSelection = (selectionModel) => {
        setSelectedId(selectionModel);
        // Find the selected rows based on IDs
        // const selectedData = itemDetail.filter(row => selectionModel.includes(row.id));
        // setSelectedRows(selectedData);
    };

    const handleDispatchDelStatusSubmitAllSucces = (dataObject) => {
        DispatchCustDelScheduleShowDetail({
            delNo: delNotNo
        }, DispatchCustDelScheduleShowDetailSuccess, DispatchCustDelScheduleShowDetailException);
    }

    const handleDispatchDelStatusSubmitAllException = () => {

    }

    // function SelectAction(props) {

    //     const onSelectedItem = () => {

    //         DispatchDelStatusSubmit({ id: selctedId }, handleDispatchDelStatusSubmitSucces, handleDispatchDelStatusSubmitException);
    //     }

    //     return (
    //         <div style={{ display: 'flex' }}>
    //             <Checkbox
    //                 checked={props?.selectedRow?.status === 1}
    //                 disabled={props?.selectedRow?.status === 1}
    //                 onClick={onSelectedItem}
    //             />
    //         </div>
    //     );
    // }

    const handleDispatchDelStatusSubmitSucces = (dataObject) => {
        setLoading(false);
        setRefreshData((oldvalue) => !oldvalue);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setOpen(false)

        }, 2000);
        // DispatchCustDelScheduleShowDetail({
        //     delNo: delNotNo
        // }, DispatchCustDelScheduleShowDetailSuccess, DispatchCustDelScheduleShowDetailException);
    }

    const handleDispatchDelStatusSubmitException = (errorObject, errorMessages) => {
        setLoading(false);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessages,
        });
        setTimeout(() => {
            setOpen(false)
            handleClose();
            // setRefreshData(oldValue => !oldValue);
        }, 2000);
    }

    const onSubmitClicked = () => {
        setLoading(true);
        const now = new Date();

        // Format date
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // months are 0-based
        const day = now.getDate().toString().padStart(2, '0');

        // Format time
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert 0 → 12 in 12-hour format

        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;

        DispatchDelStatusSubmit(
            { delNoteIDs: selctedId, endTime: formattedDateTime },
            handleDispatchDelStatusSubmitSucces,
            handleDispatchDelStatusSubmitException
        );
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
            <form >
                <DialogContent>
                    <DataGrid
                        rows={itemDetail}
                        columns={columns}
                        pageSize={8}
                        // loading={isLoading}
                        rowsPerPageOptions={[8]}
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
                        onRowSelectionModelChange={handleRowSelection}
                        checkboxSelection
                        isRowSelectable={(params) => params.row.status !== 1} // Disable if status is 1
                        selectionModel={selctedId}

                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        disabled={loading === true}
                        onClick={(e) => {

                            onSubmitClicked();
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} style={{ color: 'white' }} />
                        ) : 'Approve'}

                    </Button>


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

export default DetaildViewWatchMan
