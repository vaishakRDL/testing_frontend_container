import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
    Card,
} from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AddHoliday, AddHolidayUpdate, GetJobCardChildDrill, GetJobCardInsideDetails, GetOrderStatusDetailedReport, SobUpdate, } from '../../ApiService/LoginPageService';
import './JobCardDetails.css';
import { DataGrid } from '@mui/x-data-grid';
import GeneratePdfDialog from '../JobCardView/GeneratePdfDialog';
import RDL_Logo from '../../AllImage/RDL_Logo.png';

const JobCardDetails = ({ open, setOpen, selectedRow }) => {
    const [reportData, setReportData] = useState([]);
    const [reportJcDetails, setReportJcDetails] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        open && GetOrderStatusDetailedReport({ jcNo: selectedRow?.jcNo }, handleGetReportSuccess, handleGetReportException)
    }, [open])

    const handleGetReportSuccess = (dataObject) => {
        setReportData(dataObject?.processDetails || []);
        setReportJcDetails(dataObject?.jcDetails[0] || []);
    }
    const handleGetReportException = () => { }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const Columns = [
        {
            field: 'process',
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Operation Name
                </span>
            ),
            type: 'string',
            sortable: true,
            width: 190,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'Qty',
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Order Qty
                </span>
            ),
            type: 'string3',
            sortable: true,
            width: 190,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'machineName',
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Machine Name
                </span>
            ),
            type: 'string',
            sortable: true,
            width: 190,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "producedQty",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Produced + Reproduced Qty
                </span>
            ),
            type: 'string',
            sortable: true,
            width: 250,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "acceptedQty",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Accepted Qty</span>
            ),
            type: 'string',
            sortable: true,
            width: 190,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "rejectedQty",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Rejected Qty</span>
            ),
            type: 'string',
            sortable: true,
            width: 190,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "reworkQty",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Reworked Qty</span>
            ),
            type: 'string',
            sortable: true,
            width: 190,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "startDate",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Start Date</span>
            ),
            type: 'string',
            sortable: true,
            width: 190,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "endDate",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>End Date</span>
            ),
            type: 'string',
            sortable: true,
            width: 190,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "lastProdDate",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Last Production Date</span>
            ),
            type: 'string',
            sortable: true,
            width: 190,
            align: 'center',
            headerAlign: 'center',
        },
    ];

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                Job Card Details
            </DialogTitle>
            <form /*onSubmit={handleSubmit}*/>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} lg={12} xl={12} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', columnGap: '20px' }}>
                            <div style={{ border: '1px solid #000000', width: '100%' }}>
                                <table id="jobCard">
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Customer PO No</td>
                                        <td>{reportJcDetails?.poNo}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Sales Order No</td>
                                        <td>{reportJcDetails?.orderNo}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Job Card No</td>
                                        <td>{reportJcDetails?.jcNo}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Customer Name</td>
                                        <td>{reportJcDetails?.customerName}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Order Status</td>
                                        <td>{reportJcDetails?.status}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Product Name</td>
                                        <td>{reportJcDetails?.itemName}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Product Code</td>
                                        <td>{reportJcDetails?.itemCode}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Product Drawing No</td>
                                        <td></td>
                                    </tr>
                                </table>
                            </div>
                            <div style={{ border: '1px solid #000000', width: '100%' }}>
                                <table id="jobCard">
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Product Size</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Order Quantity</td>
                                        <td>{reportJcDetails?.qty}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>% Completion</td>
                                        <td>{reportJcDetails?.completion}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Documents Links</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Original Planned Comp. Date</td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Expected Completion Date</td>
                                        <td></td>
                                    </tr>
                                </table>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div style={{ height: '500px', overflowY: 'scroll' }}>
                                <Box sx={{ height: 500, width: '100%' }}>
                                    <DataGrid
                                        rows={reportData}
                                        columns={Columns}
                                        // onCellClick={handleCellClick}
                                        sx={{
                                            "& .super-app-theme--header": {
                                                WebkitTextStrokeWidth: "0.6px",
                                            },
                                            "& .MuiDataGrid-cell": {
                                                border: "1px solid #969696",
                                            },
                                            "& .MuiDataGrid-columnHeader": {
                                                border: "1px solid #969696", // Add border to column headers
                                            },
                                            "& .super-app-theme--header": {
                                                backgroundColor: "#93bce6",
                                                color: "#1c1919",
                                            },
                                        }}
                                        getRowClassName={(params) => {
                                            const rowIndex = reportData.findIndex((row) => row.id === params.row.id);
                                            if (rowIndex !== -1) {
                                                return rowIndex % 2 === 0 ? "Mui-evenRow" : "Mui-oddRow";
                                            }
                                            return "";
                                        }}
                                        rowHeight={30}
                                        columnHeaderHeight={30}
                                        pageSizeOptions={[5]}
                                        disableRowSelectionOnClick
                                    />
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                    >
                        Print
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
                <NotificationBar
                    handleClose={handleClose}
                    notificationContent={openNotification.message}
                    openNotification={openNotification.status}
                    type={openNotification.type}
                />

            </form>
        </Dialog >
    )
}

export default JobCardDetails
