import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel,
} from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from "@mui/icons-material/Search";
import { AddMachine, MachineEdit, ShowMachineOperator, GetShift, ShowProcessMaster, getMachineUOM, CreateGroup, EditCreatedGroup } from '../../ApiService/LoginPageService';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const RMBOIIndentReportModule = ({
    open, setOpen, isAddButton, editData, setRefreshData,
}) => {

    const [id, setId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNo, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [customerId, setCustomerID] = useState('');
    const [customerLogo, setCustomerLogo] = useState('');
    const [previewBuilding, setPreviewBuilding] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [alertLogInterval, setAlertLogInterval] = useState('');
    const [deviceLogInterval, setDeviceLogInterval] = useState('');
    const [sensorLogInterval, setSensorLogInterval] = useState('');
    const [dataRetentionPeriodInterval, setDataRetentionPeriodInterval] = useState('');
    const [expireDateReminder, setExpireDateReminder] = useState('');
    const [periodicBackupInterval, setPeriodicBackupInterval] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [GSTNumber, setGSTNumber] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    const [contactPersonName, setContactPersonName] = useState('');
    const [primaryContactnumber, setPrimaryContactnumber] = useState('');
    const [secondaryContactnumber, setSecondaryContactnumber] = useState('');
    const [remark, setRemark] = useState('');
    const [fileUpload, setFileUpload] = useState('');
    const [errorObject, setErrorObject] = useState({});
    const [file, setFile] = useState('');
    const URL = 'https://varmatrix.com/MachoVersion2/Macho';
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [multiOpen, setMultiOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const [fileUploadOpen, setFileUploadOpen] = useState(false);
    const [partyNotes, setPartyNotes] = useState('');
    const [isEdit, setIsEdit] = useState(true);

    //NEW STATE
    const [personName, setPersonName] = React.useState([]);
    const [utilization, setUtilization] = useState('');
    const [machineName, setMachineName] = useState('');
    const [machineCode, setMachineCode] = useState('');
    const [machineOperator, setMachineOperator] = useState([]);
    const [machineOperatorID, setMachineOperatorID] = useState([]);
    console.log("machineOperator", machineOperator)
    console.log("machineOperatorID", machineOperatorID)
    const [efficiency, setEfficiency] = useState('');
    const [capacityTarget, setCapacityTarget] = useState('');
    const [utilizationUnits, setUtilizationUnits] = useState('');
    console.log("utilizationUnits", utilizationUnits)
    const [days, setDays] = useState('');
    const [checkedDays, setCheckedDays] = useState({
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
    });
    console.log("checkedDays", checkedDays)
    const [time, setTime] = useState('');
    const [selectedShift, setSelectedShift] = useState([]);
    console.log("selectedShift", selectedShift)
    const [machineHourRate, setMachineHourRate] = useState('');
    const [rowId, setRowId] = useState('')
    const [machineOperatorList, setMachineOperatorList] = useState([]);
    const [shiftList, setShiftList] = useState([]);
    const [machineUOMList, setMachineUOMList] = useState([]);
    //

    // CRAETE GROUP MENUES
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');

    useEffect(() => {
        setOpen(open);
        // open && ShowProcessMaster(handleMachineOperatorSucessShow, handleMachineOperatorExceptionShow);
        // open && GetShift(handleShiftSucessShow, handleShiftExceptionShow);
        !isAddButton && loaderData();
    }, [editData]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isAddButton) {
            CreateGroup({
                groupName: groupName,
                description: groupDescription
                // machName: machineName,
                // machCode: machineCode,
                // machOperator: machineOperator,
                // machOperatorInt: machineOperatorID,
                // efficiency: efficiency,
                // utilization: utilization,
                // capOrTarget: capacityTarget,
                // utilizationUnit: utilizationUnits,
                // days: checkedDays,
                // time: time,
                // shift: selectedShift,
                // machHrRate: machineHourRate
            }, handleSuccess, handleException);
        } else {
            EditCreatedGroup({
                id: rowId,
                groupName: groupName,
                description: groupDescription
            }, handleSuccess, handleException);
        }

    };

    const handleSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
        }, 2000);
    };
    const handleException = (errorObject, errorMessage) => {
        console.log("the error ", errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
        }, 2000);
    };

    // GET MACHINE OPERATOR
    const handleMachineOperatorSucessShow = (dataObject) => {
        setMachineOperatorList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleMachineOperatorExceptionShow = (errorObject, errorMessage) => {
    }

    // GET SHIFT
    const handleShiftSucessShow = (dataObject) => {
        setShiftList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleShiftExceptionShow = (errorObject, errorMessage) => {
    }

    const ClearData = () => {
        setOpen(false);
        setGroupName('');
        setGroupDescription('');
        setRefreshData(oldvalue => !oldvalue);
    }

    const loaderData = () => {
        setRowId(editData?.id || '')
        setGroupName(editData?.groupName || '');
        setGroupDescription(editData?.description || '');
    }


    const validateForNullValue = (value, type) => {

    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    // Original
    // const handleChange = (event) => {
    //     const {
    //         target: { value },
    //     } = event;
    //     setMachineOperator(
    //         // On autofill we get a stringified value.
    //         typeof value === 'string' ? value.split(',') : value,
    //     );
    // };

    // office change
    // const handleChange = (event) => {
    //     const {
    //         target: { value },
    //     } = event;

    //     setMachineOperator(value);
    // };

    // homechange
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        // On autofill we get a stringified value.
        const selectedValues = typeof value === 'string' ? value.split(',') : value;

        setMachineOperator(selectedValues);

        // Update machineOperatorID based on selected names
        const selectedIDs = selectedValues.map((selectedValue) =>
            machineOperatorList.find((item) => item.name === selectedValue).id
        );
        setMachineOperatorID(selectedIDs);
        getMachineUOM({ machOperatorInt: selectedIDs }, handleMachineUOMSucessShow, handleMachineUOMExceptionShow);
    };

    // GET UOM LIST
    const handleMachineUOMSucessShow = (dataObject) => {
        setMachineUOMList(dataObject?.data || []);
        // setGridLoading(false);
        console.log("dataObject", dataObject)
    }
    const handleMachineUOMExceptionShow = (errorObject, errorMessage) => {
    }


    const handleShiftChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedShift(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    // const handleUtilizationRadioChange = (event) => {
    //     setUtilization(event.target.value);
    // };

    const handleDayChange = (day) => (event) => {
        setCheckedDays((prevCheckedDays) => ({
            ...prevCheckedDays,
            [day]: event.target.checked,
        }));
    };

    const isAllChecked = Object.values(checkedDays).every((value) => value === true);

    const handleAllChange = () => {
        const newCheckedState = {};
        for (const day in checkedDays) {
            newCheckedState[day] = !isAllChecked;
        }
        setCheckedDays(newCheckedState);
    };

    const columns = [
        {
            field: 'po/contractNo',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>PO/Contarct No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'partNo',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'producedQty',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Produced Qty</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'actualQty',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actual Qty</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            editable: true
        },
        {
            field: 'vendorProcess',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Vendor Process</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         <View selectedRow={params.row} />,
        //     ],
        // },
    ];

    const dummyRows = [
        {
            id: 1,
            'po/contractNo': 'PO123',
            partNo: 'A123',
            producedQty: 100,
            actualQty: 90,
            vendorProcess: 'Job Work',
            remarks: 'Partially Completed',
        },
        {
            id: 2,
            'po/contractNo': 'PO456',
            partNo: 'B456',
            producedQty: 150,
            actualQty: 150,
            vendorProcess: 'Job Work',
            remarks: 'Completed',
        },
        {
            id: 3,
            'po/contractNo': 'PO456',
            partNo: 'B456',
            producedQty: 150,
            actualQty: 0,
            vendorProcess: 'Job Work',
            remarks: 'Pending',
        },
    ];

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%' } }}
            maxWidth="xl"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                SFG Varification
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '2px', borderRadius: '10px', width: '100%', height: '100%' }}>
                            <CardContent>
                                <DataGrid
                                    rows={dummyRows}
                                    columns={columns}
                                    pageSize={8}
                                    // loading={isLoading}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none', }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '50vh',
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

                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                />
                            </CardContent>
                        </Card>

                    </div>

                    <DialogActions>
                        {/* <Button
                            type="submit"
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                        >
                            {isAddButton ? 'Add' : 'Update'}
                        </Button> */}
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setOpen(false)
                                ClearData();
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Dialog>
    )
}

export default RMBOIIndentReportModule