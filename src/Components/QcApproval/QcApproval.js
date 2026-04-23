import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Card, CardContent } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { ShowForeCastEntry, DeletePurchaseBillWithoutPO, ViewWithoutPoList, PurchaseBillResultShowData, DeletePurchaseBillAgainstPO, QCApprovalLists, WithoutPOApprovalLists } from '../../ApiService/LoginPageService'
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';
import ApplicationStore from '../../Utility/localStorageUtil';
import { Typography } from '@material-ui/core';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useModuleLocks } from '../context/ModuleLockContext';


const QcApproval = (props) => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Process Inspection")?.lockStatus === "locked";

    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [id, setId] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [machineList, setMachineList] = useState([]);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('');
    const [selectedRadio, setSelectedRadio] = useState('againtPO');

    //NEW STATE
    const [foreCastList, setForeCastList] = useState([]);
    const navigate = useNavigate();
    const [purchaseBillList, setPurchaseBillLists] = useState([]);
    const [QualityModuleView, setQualityModuleView] = useState(false);
    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "purchasebillagainstpo");

    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    SNo
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    PB No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'date',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    PB Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'suppName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Party Name
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'suppInvNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supp Inv No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'suppInvoiceDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supp Inv Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        // {
        //     field: 'toConsumptionDate',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             PO Value
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        // {
        //     field: 'consumptionInDays',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             DC No
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        {
            field: 'csSuppDcNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supp DC No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'suppDcDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supp Dc Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        // {
        //     field: 'remarks',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Remarks
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        // {
        //     field: 'qualityCheck',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:  // Changed this to a string
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Quality Check
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        //     cellClassName: 'qualityCheck',
        //     disableClickEventBubbling: true,
        //     renderCell: (params) => <QualityCheck selectedRow={params.row} /> // Changed from getActions to renderCell
        // },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                // <QualityCheck selectedRow={params.row} />,
                <ViewData selectedRow={params.row} />,
                // <EditData selectedRow={params.row} />,
                // <DeleteData selectedRow={params.row} />,
            ],
        },
    ];


    useEffect(() => {
        if (selectedRadio === 'againtPO') {
            QCApprovalLists(handleSucessShow, handleExceptionShow)
        } else {
            WithoutPOApprovalLists(handleSucessShow, handleExceptionShow)
        }
    }, [refreshData, selectedRadio]);

    const handleSucessShow = (dataObject) => {
        setPurchaseBillLists(dataObject?.data || []);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {
    }

    function ViewData(props) {
        return (
            <>
                {
                    selectedRadio === 'againtPO' ?
                        <RemoveRedEyeIcon
                            style={{ color: isModuleLocked ? 'gray' : '#000000' }}
                            onClick={() => {
                                if (isModuleLocked) return;
                                //   (params.row.id);
                                // setIsView(true);
                                setQualityModuleView(true)
                                navigate(`/PurchaseBillAgainstPOModule?isEdit=true&&qualityModuleView=true&&PBNo=${props.selectedRow.digit}&&qcApproval=${props.selectedRow.qcApproval}&&isQcApprovalFlag=${true}&&isType=${props.selectedRow.type}`)
                            }}
                        />
                        :
                        <RemoveRedEyeIcon
                            style={{ color: isModuleLocked ? 'gray' : '#000000' }}
                            onClick={() => {
                                if (isModuleLocked) return;

                                //   (params.row.id);
                                // setIsView(true);
                                navigate(`/PurchaseBillWithoutPOModule?isEdit=true&&qualityWithoutPOModuleView=true&&PBNo=${props.selectedRow.digit}&&qcApproval=${props.selectedRow.qcApproval}&&isQcApprovalFlag=${true}&&isType=${props.selectedRow.type}`)
                            }}
                        />
                }
            </>
        );
    }
    function QualityCheck(props) {
        return (
            <>
                {props.selectedRow.qcApproval === 1 ?
                    <Typography style={{ color: 'green', fontWeight: 'bold', fontSize: '15px', width: '100px' }}>QC Approved</Typography>
                    :
                    <Typography style={{ color: 'red', fontWeight: 'bold', fontSize: '15px', width: '100px' }}>QC Pending</Typography>
                }
            </>
        );
    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: userPermission[0]?.updateData === 0 ? 'gray' : '#000000' }}
                onClick={() => {
                    //   (params.row.id);
                    // setIsView(true);
                    if (userPermission[0]?.updateData === 1) {
                        navigate(`/PurchaseBillAgainstPOModule?isEdit=true&&PBNo=${props.selectedRow.digit}&&qcApproval=${props.selectedRow.qcApproval}`)
                    }
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                style={{ color: userPermission[0]?.deleteData === 0 ? 'gray' : '#000000' }}
                onClick={() => {
                    if (userPermission[0]?.deleteData === 1) {
                        setDeleteId(props.selectedRow.digit);
                        setDeleteDailogOpen(true);
                    }
                }}
            />
        );
    }

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
        <div style={{ height: '60vh', width: '100%' }}>
            {/* <h2>{props.name}</h2>
            <button onClick={()=>props.changeUserName()}>Click me</button> */}
            {/* <Typography style={{ textAlign: 'left', marginLeft: '18px', marginTop: '15px', marginBottom: '15px', fontWeight: 'bold' }}>QC Approval</Typography> */}
            <FormControl style={{ marginLeft: '18px' }}>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={selectedRadio}
                    onChange={(e) => setSelectedRadio(e.target.value)}
                >
                    <FormControlLabel value="againtPO" control={<Radio />} label="Purchase Bill Against PO" />
                    <FormControlLabel value="withoutPO" control={<Radio />} label="Purchase Bill Without PO" />
                </RadioGroup>
            </FormControl>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent>
                        <Box
                            sx={{
                                height: '150%',
                                width: '100%',
                                '& .super-app-theme--header': {
                                    backgroundColor: '#93bce6',
                                    color: '#1c1919'
                                },
                            }}
                        >
                            <DataGrid
                                rows={purchaseBillList}
                                columns={columns}
                                pageSize={8}
                                // loading={isLoading}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ border: 'none', }}
                                sx={{
                                    overflow: 'auto',
                                    height: '68vh',
                                    // minHeight: '500px',
                                    width: '100%',
                                    '& .super-app-theme--header': {
                                        WebkitTextStrokeWidth: '0.6px',

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
                                    const rowIndex = purchaseBillList.findIndex(row => row.id === params.row.id);
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
                        </Box>
                    </CardContent>
                </Card>

            </div>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                // selectedMaster={selectedMaster}
                deleteService={DeletePurchaseBillAgainstPO}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default QcApproval