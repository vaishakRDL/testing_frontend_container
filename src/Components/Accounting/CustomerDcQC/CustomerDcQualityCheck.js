import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GetSFGVerificationInnerData, UpdateSFGVerificationInnerData, GetSFGFilterLocation, MoveToFg, GetOpeningBalancePendingLists, ApproveOpeningBalance, CustomerDCQualityCheck, CustomerDCQualityCheckApprove } from '../../../ApiService/LoginPageService';
import '../../../App.css';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel, Card,
    Switch,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CustomePopUp from '../../../Utility/CustomePopUp';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { useNavigate } from 'react-router-dom';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const CustomerDcQualityCheck = ({
}) => {
    const [selectAll, setSelectAll] = useState(false);
    const [refreshTableData, setRefreshTableData] = useState(false);
    const [approvalLists, setApprovalLists] = useState([]);
    const [customeOpen, setCustomeOpen] = useState(false);
    const [payloadData, setPayloadData] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        // onClick={() => {
        //     navigate(
        //       `/NewCustomerDc?isPOView=true&&poRowId=${props.selectedRow}`
        //     );
        //   }}
        CustomerDCQualityCheck(handleGetSuccess, handleGetException)
    }, [refreshTableData]);

    const handleGetSuccess = (dataObject) => {
        setApprovalLists(dataObject?.data || [])
    }
    const handleGetException = () => { }

    const columns = [
        {
            field: 'cName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cust Name</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cust Code</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'customerDcDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cust DC Date</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'po_ref',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>PO Ref No</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'cust_Dc_no',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cust DC No</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'cdcNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>CDC No</span>,
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
                    <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
                    <span style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '16px' }}></span>
                </div>
            ),
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.selected}
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
        // const updatedArray = approvalLists.filter((item) => item.selected === true)
        //     .map((data) => ({ itemId: data.itemId, itemCode: data.itemCode, qty: data.qty }))
        // setCustomeOpen(true)
        // setPayloadData(updatedArray)
        const updatedArray = approvalLists
            .filter((item) => item.selected === true) // Filter items where selected is true
            .map((data) => data.id); // Map to only include the id
        setCustomeOpen(true)
        setPayloadData(updatedArray)
        console.log("updatedArray", updatedArray);
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

    const handleRowClick = (params) => {
        console.log(params.row.id)
        navigate(`/NewCustomerDc?isPOView=true&&isQcApprovalFlag=true&&poRowId=${params.row.id}`);
    }


    return (
        <div style={{ margin: '10px' }}>
            <Typography style={{ fontWeight: 'bold', textAlign: 'left', fontSize: '18px', marginBottom: '10px' }}>Customer DC Quality Check</Typography>
            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '2px', borderRadius: '10px', width: '100%', height: '100%' }}>
                <CardContent>
                    <DataGrid
                        rows={approvalLists}
                        columns={columns}
                        pageSize={8}
                        rowsPerPageOptions={[8]}
                        onRowDoubleClick={handleRowClick}
                        disableSelectionOnClick
                        style={{ border: 'none' }}
                        sx={{
                            overflow: 'auto',
                            height: '50vh',
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
                            style={{ backgroundColor: '#002d68' }}
                            onClick={handleApprove}
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
                customeServicesApi={CustomerDCQualityCheckApprove}
                bodyData={{ data: payloadData }}
            />
        </div>
    )
}

export default CustomerDcQualityCheck;