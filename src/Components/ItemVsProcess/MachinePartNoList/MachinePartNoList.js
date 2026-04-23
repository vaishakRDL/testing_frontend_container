import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import { GetMachinePartNoList } from '../../../ApiService/LoginPageService';
import { PartMachineListDownload } from '../../../ApiService/DownloadCsvReportsService';

const MachinePartNoList = ({ machinePartListModal, setMachinePartListModal, machineId, machineCode, process }) => {

    const [machinePartNoList, setMachinePartNoList] = useState([])
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const Columns = [
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
            field: 'process',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Process</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'machineCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Machine</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cycleTime',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cycle Time</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'count',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM Count</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'processPriority',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Process Priority</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'skip',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Skip</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                return params.value === 1 ? 'Yes' : 'No';
            },
        },
        // {
        //     field: 'vendorProcess',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>InHouse/VendorProcess</span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        //     renderCell: (params) => {
        //         return params.value === 1 ? 'Vendor Process' : 'InHouse';
        //     },
        // }
    ];

    useEffect(() => {
        machinePartListModal && GetMachinePartNoList({ id: machineId }, handleSuccess, handleException);
    }, [machinePartListModal])

    const handleSuccess = (dataObject) => {
        setMachinePartNoList(dataObject?.data || []);
    }
    const handleException = (errorObject, errorMessage) => {
    }

    const handleDownload = () => {
        PartMachineListDownload({ id: machineId }, handleDownloadSucess, handleDownloadException)
    }

    const handleDownloadSucess = () => {
        setNotification({
            status: true,
            type: 'success',
            message: "Download Sucess",
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const handleDownloadException = () => {
        setNotification({
            status: true,
            type: 'error',
            message: "Failed To Download",
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
        }, 2000);
    }

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
            maxWidth="xl"
            open={machinePartListModal}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {`Machine : ${machineCode}`}
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6">
                    <Grid container >
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={machinePartNoList}
                                        columns={Columns}
                                        pageSize={8}
                                        rowsPerPageOptions={[8]}
                                        style={{ border: 'none' }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '43vh',
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                WebkitTextStrokeWidth: '0.2px',
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
                                            const rowIndex = machinePartNoList.findIndex(row => row.id === params.row.id);
                                            // Check if the index is valid
                                            if (rowIndex !== -1) {
                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return ''; // Return default class if index is not found
                                        }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />
                                </CardContent>

                            </Card>
                        </Grid>
                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={handleDownload}
                        >
                            Download
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setMachinePartListModal(false);
                                setMachinePartNoList([]);
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>


            <NotificationBar
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Dialog>
    )
}

export default MachinePartNoList
