import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { CslViewData } from '../../../ApiService/LoginPageService';
import { CslExlExportcslMstId } from '../../../ApiService/DownloadCsvReportsService';

const ViewCSLDetails = ({ open, setOpen, viewId }) => {

    const [dataSet, setDataSet] = useState([]);

    const columns = [
        {
            field: 'contractNo',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Contract No
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
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Part No
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
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
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
            field: 'description',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Description
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'left',
            headerAlign: 'center'
        },
        {
            field: 'boxNo',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    BOXNO
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
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

    useEffect(() => {
        if (open) {
            CslViewData({
                viewId
            }, handleCslViewDataSuccess, handleCslViewDataException);
        }
    }, [viewId, open]);

    const handleCslViewDataSuccess = (dataObject) => {
        setDataSet(dataObject?.data || []);
    }
    const handleCslViewDataException = () => {

    }

    const handleCslExlExportcslMstIdSuccess = () => {

    }

    const handleCslExlExportcslMstIdException = () => {

    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            // fullScreen
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                CSL Details
            </DialogTitle>
            {/* <form onSubmit={handleSubmit}> */}
            <DialogContent >

                {/* <Card style={{ borderRadius: '8px', height: '450px', marginTop: '10px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                    <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
                <DataGrid
                    rows={dataSet}
                    columns={columns}
                    pageSize={8}
                    // loading={isLoading}
                    rowsPerPageOptions={[8]}
                    disableSelectionOnClick
                    style={{ border: 'none' }}
                    sx={{
                        overflow: 'auto',
                        height: '70vh',
                        // minHeight: '500px',
                        width: '100%',
                        '& .super-app-theme--header': {
                            WebkitTextStrokeWidth: '0.6px',

                        },
                        '& .MuiDataGrid-cell': {
                            border: '1px solid #969696',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            border: '1px solid #969696', 
                        },
                    }}
                    rowHeight={40}
                    columnHeaderHeight={40}
                />
                {/* </CardContent>
                </Card> */}

            </DialogContent>
            <DialogActions>
                {/* <Button
                variant="contained"
                style={{ width: '150px', background: '#002D68', color: 'white' }}
                type="submit" >

            </Button> */}
                <Button
                    variant="contained"
                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                    onClick={(e) => {
                        CslExlExportcslMstId({
                            cslMstId: viewId
                        }, handleCslExlExportcslMstIdSuccess, handleCslExlExportcslMstIdException)
                    }}
                >
                    Export
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
            {/* <NotificationBar
    handleClose={handleClose}
    notificationContent={openNotification.message}
    openNotification={openNotification.status}
    type={openNotification.type}
/> */}

            {/* </form> */}
        </Dialog>
    )
}

export default ViewCSLDetails
