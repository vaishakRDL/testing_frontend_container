import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
    Card,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AddHoliday, AddHolidayUpdate, GetJobCardChildDrill, GetJobCardInsideDetails, SobUpdate, } from '../../ApiService/LoginPageService';
import './JobCardViewNewModal.css';
import { DataGrid } from '@mui/x-data-grid';
import GeneratePdfDialog from '../JobCardView/GeneratePdfDialog';
import RDL_Logo from '../../AllImage/RDL_Logo.png';

const JobCardViewNewModal = ({ open, setOpen, isAddButton, editData, setRefreshData, selectedRowJobCardNo, setSelectedRowJobCardNo, selectedMachine }) => {

    const [holiday, setHoliday] = useState('');
    const [holidayOccasion, setHolidayOccasion] = useState('');
    const [Description, setDescription] = useState('');

    const [jobCardDetails, setJobCardDetails] = useState([]);
    const [processDetails, setProcessDetails] = useState([]);
    const [childParts, setChildParts] = useState([]);
    const [childDrillLists, setChildDrillLists] = useState([]);
    const [isParent, setIsParent] = useState(false);
    const [isChild, setIsChild] = useState(false);
    const [isChildItem, setIsChildItem] = useState(false);

    const [rowChildName, setRowChildName] = useState('');
    const [childId, setChildId] = useState('');
    const [acceptedQty, setAcceptedQty] = useState("");
    const [rejectedQty, setRejectedQty] = useState("");
    const [receivedQty, setReceivedQty] = useState("");
    const [location, setLocation] = useState("");
    const [verifiedBy, setVerifiedBy] = useState("");
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [jcId, setJcId] = useState('');
    const [openPdfDialog, setOpenPdfDialog] = useState(false);
    const [pdfData, setPdfData] = useState([]);


    useEffect(() => {
        if (open) {
            console.log("Fetching job card details...");
            GetJobCardInsideDetails(
                { jcNo: selectedRowJobCardNo, machine: selectedMachine },
                handleGetDetailsSuccess,
                handleGetDetailsException
            );
        }
    }, [open]);

    const handleGetDetailsSuccess = (dataObject) => {
        console.log("API Response:", dataObject); // Log full response

        setJobCardDetails(dataObject?.jcDetails || []);
        setAcceptedQty(dataObject?.jcDetails[0]?.approvedQty || 0)
        setRejectedQty(dataObject?.jcDetails[0]?.reworkQty || 0)
        setReceivedQty(dataObject?.jcDetails[0]?.recievedQty || 0)
        setVerifiedBy(dataObject?.jcDetails[0]?.verifiedBy || "")
        setLocation(dataObject?.jcDetails[0]?.location || "")
        setProcessDetails(dataObject?.processDetails || []);
        setChildParts(dataObject?.childParts || []);
        setIsChild(true);


        if (dataObject?.jcDetails && dataObject.jcDetails.length > 0) {
            const newJcId = dataObject.jcDetails[0].jcId;
            console.log("Extracted jcId:", newJcId); // Log the extracted jcId
            setJcId(newJcId); // Set jcId from the response
        } else {
            console.log("No jcDetails found");
        }
    };

    const handleGetDetailsException = () => { }

    const ClearData = () => {
        setHoliday('');
        setHolidayOccasion('');
        setDescription('');
        setProcessDetails([]);
        setChildParts([]);
        setChildDrillLists([]);
    }


    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const parent = [
        {
            field: 'id',
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    SI NO
                </span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'date',
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Date
                </span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'shift',
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Shift
                </span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "process",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Process
                </span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "machineName",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Machine</span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "producedQty",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Produced Qty</span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "acptQty",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Accepted Qty</span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "operator",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Operator</span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "qa",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>QA</span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "prod_eng",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Prod Eng</span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
    ];

    const child = [
        {
            field: 'SITEMCODE',
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Item Code
                </span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "SITEMNAME",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Item Name
                </span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "MTHICKNESS",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>M Thickness</span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "QTY",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Qty</span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "Child_Produced_Qty",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Produced Qty</span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        }
        // {
        //     field: "ChildId",
        //     headerClassName: "super-app-theme--header",
        //     headerName: (
        //         <span style={{ fontWeight: "bold", fontSize: "16px" }}>Child Id</span>
        //     ),
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        // {
        //     field: "DisplayStatus",
        //     headerClassName: "super-app-theme--header",
        //     headerName: (
        //         <span style={{ fontWeight: "bold", fontSize: "16px" }}>Display Status</span>
        //     ),
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // }
    ];

    const childDrill = [
        {
            field: 'id',
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    S No
                </span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "process",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Process
                </span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "machineName",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Machine</span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "producedQty",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Produced Qty</span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "operator",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Operator</span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "qa",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>QA</span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: "prod_eng",
            headerClassName: "super-app-theme--header",
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>Prod Eng</span>
            ),
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
    ];



    const handleCellClick = (params) => {
        console.log("Cell clicked:", params); // Log clicked cell params

        if (isChild) {
            console.log("isChild state:", isChild); // Log the isChild state
            console.log("API call initiated for item ID:", params.row.id); // Log the item ID for the API call

            setRowChildName(params.row.SITEMCODE);
            setChildId(params.row.id);
            setIsChildItem(true);
            setIsChild(false);

            // Call the API and log the request details
            const requestData = { jcNo: selectedRowJobCardNo, itemId: params.row.id };
            console.log("Request Data for API:", requestData); // Log the request data

            GetJobCardChildDrill(
                requestData,
                handleChildDrillSuccess,
                handleChildDrillException
            );
        }
        // }
    };

    const handleChildDrillSuccess = (dataObject) => {
        console.log("API response:", dataObject); // Log API response
        setChildDrillLists(dataObject?.data || []);
    };

    const handleChildDrillException = (error) => {
        console.error("API call failed:", error); // Log any API errors
    };

    const handleChildClick = () => {
        setIsChild(true)
        if (isChildItem) {
            setIsChildItem(false);
        }
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                Job Card No : {selectedRowJobCardNo}
            </DialogTitle>
            <form /*onSubmit={handleSubmit}*/>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} lg={12} xl={12} style={{ display: 'flex', flexDirection: 'row' }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #000000' }}>
                                <img src={RDL_Logo} alt="Logo" style={{ width: '190px', height: '110px' }} />
                            </div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #000000' }}>
                                <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <Typography style={{ fontSize: '30px', fontWeight: 'bold' }}>JOB CARD</Typography>
                                </div>
                                <div style={{ display: 'flex', flex: 1, alignItems: 'flex-end' }}>
                                    <Typography style={{ fontWeight: 'bold' }}>OTIS Elevator Company (India) ltd</Typography>
                                </div>
                            </div>
                            <div style={{ flex: 1, border: '1px solid #000000' }}>
                                <table id="jobCard">
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>JC Card No</td>
                                        <td>{selectedRowJobCardNo}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>JC Issue Date</td>
                                        <td>{jobCardDetails[0]?.scheduledDate}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>KANBAN Date</td>
                                        <td>{jobCardDetails[0]?.kanbanDate}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Schedule Date</td>
                                        <td>{jobCardDetails[0]?.scheduledDate}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>GRN NO</td>
                                        {/* <td>{jobCardDetails[0]?.grnNo}</td> */}
                                        <td
                                            title={jobCardDetails[0]?.grnNo}  // Tooltip on hover
                                            style={{
                                                maxWidth: '150px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {jobCardDetails[0]?.grnNo}
                                        </td>

                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Product Family</td>
                                        <td>{jobCardDetails[0]?.productFamily}</td>
                                    </tr>
                                </table>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={12} lg={12} xl={12} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', columnGap: '20px' }}>
                            <div style={{ border: '1px solid #000000', width: '100%' }}>
                                <table id="jobCard">
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Part No</td>
                                        <td>{jobCardDetails[0]?.itemCode}</td>
                                    </tr>
                                    {isChildItem &&
                                        <tr>
                                            <td style={{ fontWeight: 'bold' }}>Child Part No</td>
                                            <td>{rowChildName}</td>
                                        </tr>
                                    }
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Description</td>
                                        <td>{jobCardDetails[0]?.itemName}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Material Spec</td>
                                        <td>{jobCardDetails[0]?.material}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Material Thickness</td>
                                        <td>{jobCardDetails[0]?.materialThickness}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Planned Qty</td>
                                        <td>{jobCardDetails[0]?.Qty}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ fontWeight: 'bold' }}>Finished Details</td>
                                        <td>{jobCardDetails[0]?.productFinish}</td>
                                    </tr>
                                </table>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '400px', border: '1px solid #000000' }}>
                                <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <Typography style={{ fontWeight: 'bold' }}>{jobCardDetails[0]?.planEngineer}</Typography>
                                </div>
                                <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                    <Typography style={{ fontWeight: 'bold' }}>PLANNING ENGINEER SIGN:</Typography>
                                </div>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>

                            {/* PARENT TABLE */}
                            <div style={{ height: '500px', overflowY: 'scroll' }}>
                                <Box sx={{ height: 400, width: '100%' }}>
                                    <DataGrid
                                        rows={processDetails}
                                        columns={parent}
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
                                            const rowIndex = processDetails.findIndex((row) => row.id === params.row.id);
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
                                <Typography style={{ fontWeight: 'bold', textAlign: 'left', marginTop: '10px', marginBottom: '5px' }}>BOM Details for Job Card :</Typography>
                                <Box sx={{ height: 400, width: '100%' }}>
                                    <DataGrid
                                        rows={isChild ? childParts : childDrillLists}
                                        columns={isChild ? child : childDrill}
                                        onCellClick={handleCellClick}
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
                                            const rowIndex = isChild
                                                ? childParts.findIndex((row) => row.id === params.row.id)
                                                : isChildItem
                                                    ? childDrillLists.findIndex((row) => row.id === params.row.id)
                                                    : processDetails.findIndex((row) => row.id === params.row.id);

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
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <table id="jobCard">
                                <tr>
                                    <td style={{ fontWeight: 'bold' }}>REMARKS:</td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: 'bold' }}>ACTION FOR REMARKS:</td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: 'bold' }}>ACCEPTED QTY : {acceptedQty}</td>
                                </tr>
                                <tr>
                                    <td style={{ fontWeight: 'bold' }}>REJECT/REWORK QTY: {rejectedQty}</td>
                                </tr>
                            </table>

                            <table id="jobCard">
                                <tr>
                                    <td style={{ fontWeight: 'bold' }}>{location}</td>
                                    <td style={{ fontWeight: 'bold' }}>RECEIVED QTY: {receivedQty} </td>
                                    <td style={{ fontWeight: 'bold' }}>CELL LEADER SIGN : {verifiedBy}</td>
                                </tr>
                            </table>
                            <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                                FORMAT NO: IMS-ME-PRODN-F-305, REV-'3' 25.06.2025
                            </div>                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={() => setOpenPdfDialog(true)}
                        >
                            View PDF
                        </Button>
                        <GeneratePdfDialog
                            open={openPdfDialog}
                            handleClose={() => setOpenPdfDialog(false)}
                            pdfData={pdfData}
                            jcId={jcId}
                        />
                    </>

                    <Button
                        variant="contained"
                        disabled={isChild}
                        style={{ width: '150px', background: isChild ? 'gray' : '#002D68', color: 'white' }}
                        onClick={handleChildClick}
                    >
                        Child Part
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);
                            setIsChild(false);
                            setIsChildItem(false);
                            ClearData();
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

export default JobCardViewNewModal
