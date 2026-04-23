import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { GetSFGVerificationInnerData, UpdateSFGVerificationInnerData, GetSFGFilterLocation, MoveToFg, GetOpeningBalancePendingLists, ApproveOpeningBalance } from '../../ApiService/LoginPageService';
import '../../App.css';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel, Card,
    Switch,
} from '@mui/material';
import CustomePopUp from '../../Utility/CustomePopUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useModuleLocks } from '../context/ModuleLockContext';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const OpeningBalanceApproval = ({
}) => {

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Balance Approval")?.lockStatus === "locked";

    const [selectAll, setSelectAll] = useState(false);
    const [refreshTableData, setRefreshTableData] = useState(false);
    const [approvalLists, setApprovalLists] = useState([])
    const [customeOpen, setCustomeOpen] = useState(false);
    const [payloadData, setPayloadData] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };

        // Add event listener to update height on resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        GetOpeningBalancePendingLists(handlePendingListsSuccess, handlePendingListsException)
    }, [refreshTableData]);

    const handlePendingListsSuccess = (dataObject) => {
        setApprovalLists(dataObject?.data || [])
    }
    const handlePendingListsException = () => { }

    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SI No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'qty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Quantity</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'grn',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>GRN</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'addedBy',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Added By</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'selected',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}></span>,
            type: 'number',
            sortable: true,
            width: 120,
            align: 'center', headerAlign: 'center',
            renderHeader: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox checked={selectAll}
                        disabled={isModuleLocked}
                        onChange={handleSelectAllChange} />
                    <span style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '16px' }}></span>
                </div>
            ),
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.selected}
                    disabled={isModuleLocked}
                    onChange={(e) => handleCheckboxChange(e, params.row.id)}
                />
            ),
        },
    ];

    const handleCheckboxChange = (event, id) => {
        const updatedRows = approvalLists.map((row) =>
            row.id === id ? { ...row, selected: event.target.checked } : row
        );
        setApprovalLists(updatedRows);
    };

    const handleSelectAllChange = (event) => {
        setSelectAll(event.target.checked);
        const isChecked = event.target.checked;
        const updatedRows = approvalLists.map(row => {
            return { ...row, selected: isChecked };
        });
        setApprovalLists(updatedRows);
    };

    const handleApprove = () => {
        const updatedArray = approvalLists.filter((item) => item.selected === true)
            .map((data) => ({ itemId: data.itemId, itemCode: data.itemCode, qty: data.qty, grn: data.grn }))
        setCustomeOpen(true)
        setPayloadData(updatedArray)
    }

    // POPUP 
    const handleCustomeSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefreshTableData((oldvalue) => !oldvalue);
        setCustomeOpen(false);
        setTimeout(() => {
            handleClose();
        }, 3000);
    }

    const handleCustomeFailure = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
        }, 3000);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };


    return (
        <div style={{ margin: '10px' }}>
            <Typography style={{ fontWeight: 'bold', textAlign: 'left', fontSize: '18px', marginBottom: '10px' }}>Opening Balance Approval</Typography>
            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '2px', borderRadius: '10px', width: '100%', height: '100%' }}>
                <CardContent>
                    <DataGrid
                        rows={approvalLists}
                        columns={columns}
                        pageSize={8}
                        rowsPerPageOptions={[8]}
                        disableSelectionOnClick
                        style={{ border: 'none' }}
                        sx={{
                            overflow: 'auto',
                            height: screenHeight - 290,
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
                            const rowIndex = approvalLists.findIndex(row => row.id === params.row.id);
                            if (rowIndex !== -1) {
                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                            }
                            return '';
                        }}
                        rowHeight={40}
                        columnHeaderHeight={40}
                    />

                    <div style={{ width: '100%', textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: isModuleLocked ? 'gray' : '#002d68' }}
                            onClick={handleApprove}
                            disabled={isModuleLocked}
                        >Approve</Button>
                    </div>

                </CardContent>
            </Card>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            <CustomePopUp
                title={'Confirmation'}
                titleColor={'#000000'}
                message={'Are you sure you want to approve?'}
                messageColor={'#000000'}
                CustomIcon={CheckCircleIcon}
                iconColor={'#7ED4AD'}
                confirmButtonTitle={'AGREE'}
                confirmButtonBackGround={'#41B06E'}
                confirmButtonTextColor={'#ffffff'}
                closeButtonTitle={'CLOSE'}
                closeButtonBackground={'#DD5746'}
                closeButtonTextColor={'#ffffff  '}
                customeOpen={customeOpen}
                setCustomeOpen={setCustomeOpen}
                handleCustomeSuccess={handleCustomeSuccess}
                handleCustomeFailure={handleCustomeFailure}
                customeServicesApi={ApproveOpeningBalance}
                bodyData={{ items: payloadData }}
            />
        </div>
    )
}

export default OpeningBalanceApproval;