import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Card, CardContent, Grid, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { POGenerateServices, GetPurchaseOrderApproveList, poApproval, GetPoRejectList } from '../../../ApiService/LoginPageService';
import { useEffect } from 'react';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
// import CompliteSucess from './CompliteSucess';
import Chip from '@mui/material/Chip';
import { Link, useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ApprovalConfirmation from '../ApprovalConfirmation/ApprovalConfirmation';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import RejectConfirmation from '../RejectConfirmation/RejectConfirmation';

const PurchaseOrderApprovalModule = () => {
    const [rows, setRows] = useState([]);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [rejectDailogOpen, setRejectDailogOpen] = useState(false)
    const [rejectId, setRejectId] = useState('')
    const [refreshData, setRefreshData] = useState(false);
    const [rejectList, setRejectList] = useState([]);
    const navigate = useNavigate();

    const columns1 = [
        {
            field: 'poNo'
            , headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>PO No</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'suppName',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier Name</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'date',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Schedule Date</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            width: 70,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            headerName: (
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>
            ),
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                // <EditData selectedRow={params.row} />,
                // <DeleteData selectedRow={params.row} />,
                <ViewPo selectedRow={params.row} />
            ],
        },
    ];
    const columns2 = [
        {
            field: 'poNo'
            , headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>PO No</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'suppName',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier Name</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'date',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rejected Date</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'rejRemarks',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
    ];

    // function EditData(props) {
    //     return (
    //         <Button
    //             variant="contained"
    //             type='submit'
    //             style={{ height: '30px', backgroundColor: '#65B741' }}
    //             onClick={(event) => {
    //                 setDeleteId(props.selectedRow.id);
    //                 setDeleteDailogOpen(true);
    //             }}
    //         >
    //             Approve
    //         </Button>
    //     );
    // }

    // function DeleteData(props) {
    //     return (
    //         <Button
    //             variant="contained"
    //             type='submit'
    //             style={{ height: '30px', backgroundColor: '#D24545' }}
    //             onClick={(event) => {
    //                 setRejectId(props.selectedRow.id);
    //                 setRejectDailogOpen(true);
    //             }}
    //         >
    //             Reject
    //         </Button>
    //     );
    // }

    function ViewPo(props) {
        return (
            <Button
                variant="contained"
                type='submit'
                sx={{
                    marginRight: '8px',
                    backgroundColor: '#002D68',
                    height: '40px',
                    borderRadius: '20px',
                    width: '100px',
                }}
                // onClick={(event) => {
                //     setRejectId(props.selectedRow.id);
                //     setRejectDailogOpen(true);
                // }}
                onClick={() => {
                    //   (params.row.id);
                    // setIsView(true);
                    navigate(`/PurchaseOrderGenerationModule?isView=true&&poDigit=${props.selectedRow.digit}&&rowId=${props.selectedRow.id}`);
                }}
            >
                View
            </Button>
        );
    }


    useEffect(() => {
        GetPurchaseOrderApproveList(handlePOGenerateServicesSuccess, handlePOGenerateServicesExceptoin);
        GetPoRejectList(handlePORejectSuccess, handlePORejectException)
    }, [refreshData]);

    const handlePOGenerateServicesSuccess = (dataObject) => {
        setRows(dataObject?.data || []);
    }

    const handlePOGenerateServicesExceptoin = (errorObject, errorMessage) => {
        console.log("error Msg", errorMessage);
    }
    const handlePORejectSuccess = (dataObject) => {
        setRejectList(dataObject?.data || []);
    }

    const handlePORejectException = (errorObject, errorMessage) => {
        console.log("error Msg", errorMessage);
    }

    const handlePrintButtonClick = (id) => {
        console.log(`Print button clicked for row with id: ${id}`);
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
            setRejectDailogOpen(false);
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

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <div>
            <div style={{ height: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" gutterBottom sx={{ m: 0, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}>
                        Purchase Order Approval
                    </Typography>

                </div>
                <Grid container spacing={2} style={{ flex: 1 }}>
                    <Grid item xs={12}>
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '18px', borderRadius: '10px', width: '100%', height: '350px' }}>
                            <CardContent style={{ padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography variant="h9" style={{ fontWeight: 'bold' }}></Typography>
                                <div style={{ height: 300, width: '100%' }}>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns1}
                                        pageSize={5}
                                        disableSelectionOnClick
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={2} style={{ flex: 1 }}>
                    <Grid item xs={12}>
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '100%', height: '350px' }}>
                            <CardContent style={{ padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography variant="h9" style={{ fontWeight: 'bold', marginBottom: '10px' }}>REJECTED PO LISTS</Typography>
                                <div style={{ height: 300, width: '100%' }}>
                                    <DataGrid
                                        rows={rejectList}
                                        columns={columns2}
                                        pageSize={5}
                                        disableSelectionOnClick
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

            </div>

            <ApprovalConfirmation
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                deleteService={poApproval}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />

            <RejectConfirmation
                open={rejectDailogOpen}
                setOpen={setRejectDailogOpen}
                deleteId={rejectId}
                deleteService={poApproval}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div>
    );
};
export default PurchaseOrderApprovalModule;
