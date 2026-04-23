import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel,
} from '@mui/material';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from "@mui/icons-material/Search";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AddMachine, MachineEdit, ShowMachineOperator, GetShift, ShowProcessMaster, getMachineUOM, GetGroupMenu, GroupRight, GroupRightSubmit } from '../../../ApiService/LoginPageService';

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
// setPermissionModalOpen,permisionModalOpen
const PermissionModal = ({
    permisionModalOpen, setPermissionModalOpen, isAddButton, editData, selectedRowId, selectedRowCode
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
    const [efficiency, setEfficiency] = useState('');
    const [capacityTarget, setCapacityTarget] = useState('');
    const [utilizationUnits, setUtilizationUnits] = useState('');
    const [days, setDays] = useState('');
    const [checkedDays, setCheckedDays] = useState({
        Monday: false,
        Tuesday: false,
        Wednesday: false,
        Thursday: false,
        Friday: false,
        Saturday: false,
    });
    const [time, setTime] = useState('');
    const [selectedShift, setSelectedShift] = useState([]);
    const [machineHourRate, setMachineHourRate] = useState('');
    const [rowId, setRowId] = useState('')
    const [machineOperatorList, setMachineOperatorList] = useState([]);
    const [shiftList, setShiftList] = useState([]);
    const [machineUOMList, setMachineUOMList] = useState([]);
    const [tempDataSet, setTempDataSet] = useState({});

    //NEW STATE FOR GET GROUP MENU
    const [transactionMenuList, setTransactionMenuList] = useState([])
    const [masterMenuList, setMasterMenuList] = useState([])
    const [reportsMenuList, setReportsMenuList] = useState([])
    const [utilitiesMenuList, setUtilitiesMenuList] = useState([])
    const [refreshData, setRefreshData] = useState(false);

    const [TransactionTemp, setTransactionTemp] = useState([]);

    //

    useEffect(() => {
        // setOpen(open);
        // open && ShowProcessMaster(handleMachineOperatorSucessShow, handleMachineOperatorExceptionShow);
        // open && GetShift(handleShiftSucessShow, handleShiftExceptionShow);
        permisionModalOpen && GetGroupMenu({ type: "Masters", code: selectedRowCode }, masterSucessShow, masterExceptionShow);
        permisionModalOpen && GetGroupMenu({ type: "Transactions", code: selectedRowCode }, transactionSucessShow, transactionExceptionShow);
        permisionModalOpen && GetGroupMenu({ type: "Reports", code: selectedRowCode }, reportsSucessShow, reportsExceptionShow);
        permisionModalOpen && GetGroupMenu({ type: "Utilities", code: selectedRowCode }, utilitiesSucessShow, utilitiesExceptionShow);
        !isAddButton && loaderData();
    }, [editData, permisionModalOpen, refreshData]);

    // MENU LIST SUCCESS FAILURE
    const masterSucessShow = (dataObject) => {
        setMasterMenuList(dataObject?.data || []);

    }
    const masterExceptionShow = (errorObject, errorMessage) => {
    }

    const transactionSucessShow = (dataObject) => {
        setTransactionMenuList(dataObject?.data || []);

    }
    const transactionExceptionShow = (errorObject, errorMessage) => {
    }

    const reportsSucessShow = (dataObject) => {
        setReportsMenuList(dataObject?.data || []);
    }
    const reportsExceptionShow = (errorObject, errorMessage) => {
    }

    const utilitiesSucessShow = (dataObject) => {
        setUtilitiesMenuList(dataObject?.data || []);
    }
    const utilitiesExceptionShow = (errorObject, errorMessage) => {
    }

    //END

    // const updateCheckbox = (value) => {
    // }

    useEffect(() => {
        console.log('TransactionTemp==>', TransactionTemp);
    }, [TransactionTemp]);

    const columns = [
        // {
        //     field: 'type',
        //     headerName: 'Type',
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        {
            field: 'menuName',
            headerClassName: 'super-app-theme--header',
            headerName: 'Menu',
            type: 'string',
            sortable: true,
            width:250, align: 'center', headerAlign: 'center'
        },
        {
            field: 'addData',
            headerClassName: 'super-app-theme--header',
            headerName: 'Add',
            type: 'number',
            // sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.addData}
                    style={{ color: params.row.addData ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {
                                const updatedState = [...prevState];
                                newObjects.forEach(newObj => {
                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);
                                    if (existingIndex !== -1) {
                                        updatedState[existingIndex] = newObj;
                                    } else {
                                        updatedState.push(newObj);
                                    }
                                });
                                
                                return updatedState;
                            });
                        };

                        let Temp = transactionMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.addData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }
                    }
                    }
                />
            ),
        },
        {
            field: 'updateData',
            headerClassName: 'super-app-theme--header',
            headerName: 'Edit',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.updateData}
                    style={{ color: params.row.updateData ? '#32cd32' : '#696969' }}

                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = transactionMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.updateData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }}
                />
            ),
        },
        {
            field: 'deleteData',
            headerClassName: 'super-app-theme--header',
            headerName: 'Delete',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.deleteData}
                    style={{ color: params.row.deleteData ? '#32cd32' : '#696969' }}
                    onChange={(e) => {

                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = transactionMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.deleteData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'print',
            headerClassName: 'super-app-theme--header',
            headerName: 'Print',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.print}
                    style={{ color: params.row.print ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = transactionMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.print = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }

                    }
                />
            ),
        },
        {
            field: 'viewData',
            headerClassName: 'super-app-theme--header',
            headerName: 'View',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.viewData}
                    style={{ color: params.row.viewData ? '#32cd32' : '#696969' }}
                    onChange={(e) => {

                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = transactionMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.viewData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }

                    }
                />
            ),
        },
        {
            field: 'auth',
            headerClassName: 'super-app-theme--header',
            headerName: 'Auth',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // <Checkbox checked={params.row.auth} style={{ color: params.row.auth ? '#32cd32' : '#696969' }} />
                <Checkbox
                    checked={params.row.auth}
                    style={{ color: params.row.auth ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {
                                const updatedState = [...prevState];
                                newObjects.forEach(newObj => {
                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {
                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = transactionMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.auth = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'auth1',
            headerClassName: 'super-app-theme--header',
            headerName: 'Auth1',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.auth1}
                    style={{ color: params.row.auth1 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = transactionMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.auth1 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
        {
            field: 'opt1',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt1',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt1}
                    style={{ color: params.row.opt1 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = transactionMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt1 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }
                    }
                    }
                />
            ),
        },
        {
            field: 'opt2',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt2',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt2}
                    style={{ color: params.row.opt2 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = transactionMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt2 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'opt3',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt3',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt3}
                    style={{ color: params.row.opt3 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = transactionMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt3 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
        {
            field: 'opt4',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt4',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt4}
                    style={{ color: params.row.opt4 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = transactionMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt4 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
        {
            field: 'opt5',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt5',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // <Checkbox checked={params.row.opt5} style={{ color: params.row.opt5 ? '#32cd32' : '#696969' }} />
                <Checkbox
                    checked={params.row.opt5}
                    style={{ color: params.row.opt5 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = transactionMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt5 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
    ];


    const columns2 = [
        // {
        //     field: 'type',
        //     headerName: 'Type',
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        {
            field: 'menuName',
            headerClassName: 'super-app-theme--header',
            headerName: 'Menu',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'addData',
            headerClassName: 'super-app-theme--header',
            headerName: 'Add',
            type: 'number',
            // sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.addData}
                    style={{ color: params.row.addData ? '#32cd32' : '#696969' }}
                    // onChange={(e) => updateCheckbox(e.target.checked)}

                    onChange={(e) => {

                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = masterMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.addData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'updateData',
            headerClassName: 'super-app-theme--header',
            headerName: 'Edit',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.updateData}
                    style={{ color: params.row.updateData ? '#32cd32' : '#696969' }}

                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = masterMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.updateData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }}
                />
            ),
        },
        {
            field: 'deleteData',
            headerClassName: 'super-app-theme--header',
            headerName: 'Delete',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.deleteData}
                    style={{ color: params.row.deleteData ? '#32cd32' : '#696969' }}
                    onChange={(e) => {

                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = masterMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.deleteData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'print',
            headerClassName: 'super-app-theme--header',
            headerName: 'Print',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.print}
                    style={{ color: params.row.print ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = masterMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.print = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }

                    }
                />
            ),
        },
        {
            field: 'viewData',
            headerClassName: 'super-app-theme--header',
            headerName: 'View',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.viewData}
                    style={{ color: params.row.viewData ? '#32cd32' : '#696969' }}
                    onChange={(e) => {

                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = masterMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.viewData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }

                    }
                />
            ),
        },
        {
            field: 'auth',
            headerClassName: 'super-app-theme--header',
            headerName: 'Auth',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // <Checkbox checked={params.row.auth} style={{ color: params.row.auth ? '#32cd32' : '#696969' }} />
                <Checkbox
                    checked={params.row.auth}
                    style={{ color: params.row.auth ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {
                                const updatedState = [...prevState];
                                newObjects.forEach(newObj => {
                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {
                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = masterMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.auth = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'auth1',
            headerClassName: 'super-app-theme--header',
            headerName: 'Auth1',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.auth1}
                    style={{ color: params.row.auth1 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = masterMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.auth1 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
        {
            field: 'opt1',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt1',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt1}
                    style={{ color: params.row.opt1 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = masterMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt1 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }
                    }
                    }
                />
            ),
        },
        {
            field: 'opt2',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt2',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt2}
                    style={{ color: params.row.opt2 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = masterMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt2 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'opt3',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt3',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt3}
                    style={{ color: params.row.opt3 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = masterMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt3 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
        {
            field: 'opt4',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt4',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt4}
                    style={{ color: params.row.opt4 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = masterMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt4 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
        {
            field: 'opt5',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt5',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // <Checkbox checked={params.row.opt5} style={{ color: params.row.opt5 ? '#32cd32' : '#696969' }} />
                <Checkbox
                    checked={params.row.opt5}
                    style={{ color: params.row.opt5 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = masterMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt5 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
    ];


    const columns3 = [
        // {
        //     field: 'type',
        //     headerName: 'Type',
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        {
            field: 'menuName',
            headerClassName: 'super-app-theme--header',
            headerName: 'Menu',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'addData',
            headerClassName: 'super-app-theme--header',
            headerName: 'Add',
            type: 'number',
            // sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.addData}
                    style={{ color: params.row.addData ? '#32cd32' : '#696969' }}
                    // onChange={(e) => updateCheckbox(e.target.checked)}

                    onChange={(e) => {

                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = reportsMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.addData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'updateData',
            headerClassName: 'super-app-theme--header',
            headerName: 'Edit',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.updateData}
                    style={{ color: params.row.updateData ? '#32cd32' : '#696969' }}

                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = reportsMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.updateData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }}
                />
            ),
        },
        {
            field: 'deleteData',
            headerClassName: 'super-app-theme--header',
            headerName: 'Delete',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.deleteData}
                    style={{ color: params.row.deleteData ? '#32cd32' : '#696969' }}
                    onChange={(e) => {

                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = reportsMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.deleteData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'print',
            headerClassName: 'super-app-theme--header',
            headerName: 'Print',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.print}
                    style={{ color: params.row.print ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = reportsMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.print = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }

                    }
                />
            ),
        },
        {
            field: 'viewData',
            headerClassName: 'super-app-theme--header',
            headerName: 'View',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.viewData}
                    style={{ color: params.row.viewData ? '#32cd32' : '#696969' }}
                    onChange={(e) => {

                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = reportsMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.viewData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }

                    }
                />
            ),
        },
        {
            field: 'auth',
            headerClassName: 'super-app-theme--header',
            headerName: 'Auth',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // <Checkbox checked={params.row.auth} style={{ color: params.row.auth ? '#32cd32' : '#696969' }} />
                <Checkbox
                    checked={params.row.auth}
                    style={{ color: params.row.auth ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {
                                const updatedState = [...prevState];
                                newObjects.forEach(newObj => {
                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {
                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = reportsMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.auth = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'auth1',
            headerClassName: 'super-app-theme--header',
            headerName: 'Auth1',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.auth1}
                    style={{ color: params.row.auth1 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = reportsMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.auth1 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
        {
            field: 'opt1',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt1',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt1}
                    style={{ color: params.row.opt1 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = reportsMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt1 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }
                    }
                    }
                />
            ),
        },
        {
            field: 'opt2',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt2',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt2}
                    style={{ color: params.row.opt2 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = reportsMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt2 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'opt3',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt3',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt3}
                    style={{ color: params.row.opt3 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = reportsMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt3 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
        {
            field: 'opt4',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt4',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt4}
                    style={{ color: params.row.opt4 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = reportsMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt4 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
        {
            field: 'opt5',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt5',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // <Checkbox checked={params.row.opt5} style={{ color: params.row.opt5 ? '#32cd32' : '#696969' }} />
                <Checkbox
                    checked={params.row.opt5}
                    style={{ color: params.row.opt5 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = reportsMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt5 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
    ];

    const columns4 = [
        // {
        //     field: 'type',
        //     headerName: 'Type',
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
        {
            field: 'menuName',
            headerClassName: 'super-app-theme--header',
            headerName: 'Menu',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'addData',
            headerClassName: 'super-app-theme--header',
            headerName: 'Add',
            type: 'number',
            // sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.addData}
                    style={{ color: params.row.addData ? '#32cd32' : '#696969' }}
                    // onChange={(e) => updateCheckbox(e.target.checked)}

                    onChange={(e) => {

                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = utilitiesMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.addData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'updateData',
            headerClassName: 'super-app-theme--header',
            headerName: 'Edit',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.updateData}
                    style={{ color: params.row.updateData ? '#32cd32' : '#696969' }}

                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = utilitiesMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.updateData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }}
                />
            ),
        },
        {
            field: 'deleteData',
            headerClassName: 'super-app-theme--header',
            headerName: 'Delete',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.deleteData}
                    style={{ color: params.row.deleteData ? '#32cd32' : '#696969' }}
                    onChange={(e) => {

                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = utilitiesMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.deleteData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'print',
            headerClassName: 'super-app-theme--header',
            headerName: 'Print',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.print}
                    style={{ color: params.row.print ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = utilitiesMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.print = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }

                    }
                />
            ),
        },
        {
            field: 'viewData',
            headerClassName: 'super-app-theme--header',
            headerName: 'View',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.viewData}
                    style={{ color: params.row.viewData ? '#32cd32' : '#696969' }}
                    onChange={(e) => {

                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = utilitiesMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.viewData = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }

                    }
                />
            ),
        },
        {
            field: 'auth',
            headerClassName: 'super-app-theme--header',
            headerName: 'Auth',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // <Checkbox checked={params.row.auth} style={{ color: params.row.auth ? '#32cd32' : '#696969' }} />
                <Checkbox
                    checked={params.row.auth}
                    style={{ color: params.row.auth ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {
                                const updatedState = [...prevState];
                                newObjects.forEach(newObj => {
                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {
                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = utilitiesMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.auth = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'auth1',
            headerClassName: 'super-app-theme--header',
            headerName: 'Auth1',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.auth1}
                    style={{ color: params.row.auth1 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = utilitiesMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.auth1 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
        {
            field: 'opt1',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt1',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt1}
                    style={{ color: params.row.opt1 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = utilitiesMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt1 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }
                    }
                    }
                />
            ),
        },
        {
            field: 'opt2',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt2',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt2}
                    style={{ color: params.row.opt2 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = utilitiesMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt2 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }

                    }
                    }
                />
            ),
        },
        {
            field: 'opt3',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt3',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt3}
                    style={{ color: params.row.opt3 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = utilitiesMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt3 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
        {
            field: 'opt4',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt4',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.opt4}
                    style={{ color: params.row.opt4 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = utilitiesMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt4 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
        {
            field: 'opt5',
            headerClassName: 'super-app-theme--header',
            headerName: 'Opt5',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // <Checkbox checked={params.row.opt5} style={{ color: params.row.opt5 ? '#32cd32' : '#696969' }} />
                <Checkbox
                    checked={params.row.opt5}
                    style={{ color: params.row.opt5 ? '#32cd32' : '#696969' }}
                    onChange={(e) => {
                        const addOrUpdateObjects = (newObjects) => {
                            setTransactionTemp(prevState => {

                                const updatedState = [...prevState];

                                newObjects.forEach(newObj => {

                                    const existingIndex = updatedState.findIndex(item => item.id === newObj.id);

                                    if (existingIndex !== -1) {

                                        updatedState[existingIndex] = newObj;
                                    } else {

                                        updatedState.push(newObj);
                                    }
                                });

                                return updatedState;
                            });
                        };

                        let Temp = utilitiesMenuList.find(item => item.id === params.row.id);
                        if (Temp) {
                            Temp.opt5 = e.target.checked;
                            addOrUpdateObjects([Temp]);
                        }


                    }
                    }
                />
            ),
        },
    ];

    const dummyData = [
        {
            id: 1,
            type: 'Type1',
            menu: 'Menu1',
            add: true,
            edit: false,
            view: true,
            delete: false,
            auth1: true,
        },
        {
            id: 2,
            type: 'Type2',
            menu: 'Menu2',
            add: false,
            edit: true,
            view: false,
            delete: true,
            auth1: false,
        },
        // Add more dummy data as needed
    ];


    function EditData(props) {
        return (
            <Tooltip title={'Edit'}>
                <EditIcon
                    style={{ color: '#000000' }}
                // onClick={(event) => {
                //     setIsAddButton(false);
                //     setEditData(props.selectedRow);
                //     setOpen(true);
                // }}
                />
            </Tooltip>
        );
    }

    function DeleteData(props) {
        return (
            <Tooltip title={'Delete'}>
                <DeleteIcon
                    // onClick={() => {
                    //     setDeleteId(props.selectedRow.id);
                    //     setDeleteDailogOpen(true);
                    // }}
                    style={{ color: 'black' }}
                />
            </Tooltip>
        );
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // if (isAddButton) {
        //     AddMachine({
        //         machName: machineName,
        //         machCode: machineCode,
        //         machOperator: machineOperator,
        //         machOperatorInt: machineOperatorID,
        //         efficiency: efficiency,
        //         utilization: utilization,
        //         capOrTarget: capacityTarget,
        //         utilizationUnit: utilizationUnits,
        //         days: checkedDays,
        //         time: time,
        //         shift: selectedShift,
        //         machHrRate: machineHourRate
        //     }, handleSuccess, handleException);
        // } else {
        //     MachineEdit({
        //         id: rowId,
        //         machName: machineName,
        //         machCode: machineCode,
        //         machOperator: machineOperator,
        //         machOperatorInt: machineOperatorID,
        //         efficiency: efficiency,
        //         utilization: utilization,
        //         capOrTarget: capacityTarget,
        //         utilizationUnit: utilizationUnits,
        //         days: checkedDays,
        //         time: time,
        //         shift: selectedShift,
        //         machHrRate: machineHourRate
        //     }, handleSuccess, handleException);
        // }

        GroupRightSubmit({
            data: TransactionTemp
        }, handleSuccess, handleException);
    };


    const handleSuccess = (dataObject) => {
        setRefreshData((oldvalue) => !oldvalue);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.messages,
        });
        setTimeout(() => {
            // ClearData();
            handleClose();
        }, 1000);
    };

    const handleException = (errorObject, errorMessage) => {
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
    }
    const handleMachineOperatorExceptionShow = (errorObject, errorMessage) => {
    }

    // GET SHIFT
    const handleShiftSucessShow = (dataObject) => {
        setShiftList(dataObject?.data || []);
        // setGridLoading(false);
    }
    const handleShiftExceptionShow = (errorObject, errorMessage) => {
    }

    const ClearData = () => {
        setPermissionModalOpen(false);
        setMachineName('');
        setMachineCode('');
        setMachineOperator([]);
        setMachineOperatorID([]);
        setEfficiency('');
        setUtilization('');
        setCapacityTarget('');
        setUtilizationUnits('');
        setCheckedDays({
            Monday: false,
            Tuesday: false,
            Wednesday: false,
            Thursday: false,
            Friday: false,
            Saturday: false,
        });
        setTime('');
        setSelectedShift([]);
        setMachineHourRate('');
        // setRefreshData(oldvalue => !oldvalue);
    }

    const loaderData = () => {
        setRowId(editData?.id || '')
        setMachineName(editData?.machineName || '');
        setMachineCode(editData?.machineCode || '');
        setMachineOperator(editData?.machineOperator || '');
        setEfficiency(editData?.efficiency || '');
        setUtilization(editData?.utilization || '');
        setCapacityTarget(editData?.capOrTarget || '');
        setUtilizationUnits(editData?.utilizationUnit || '');
        setCheckedDays(editData?.days || '');
        setTime(editData?.time || '');
        setSelectedShift(editData?.shift || '');
        setMachineHourRate(editData?.machHrRate || '');
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

    return (
        <Dialog
            sx={{ width: '100%' }}
            maxWidth="xl"
            open={permisionModalOpen}
            fullWidth
            // Set the height to a specific value or 'auto' for full height
            PaperProps={{ style: { height: '80vh', width: '100%', maxHeight: 'none' } }}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Permissions
            </DialogTitle>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <DialogContent style={{ paddingTop: '20px' }}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            style={{ fontWeight: 'bold' }}
                        >
                            Transaction
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    {/* <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '2px', borderRadius: '10px', width: '100%', height: '100%' }}> */}
                                    {/* <CardContent> */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                backgroundColor: '#93bce6',
                                                color: '#1c1919'
                                            },
                                        }}
                                    >
                                        <DataGrid
                                            rows={transactionMenuList}
                                            columns={columns}
                                            pageSize={8}
                                            // loading={isLoading}
                                            rowsPerPageOptions={[8]}
                                            disableSelectionOnClick
                                            style={{ border: 'none', }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '100%',
                                                minHeight: '390px',
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
                                                const rowIndex = transactionMenuList.findIndex(row => row.id === params.row.id);
                                                // Check if the index is valid
                                                if (rowIndex !== -1) {
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return ''; // Return default class if index is not found
                                            }}
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                        />
                                    </Box>
                                    {/* </CardContent> */}
                                    {/* </Card> */}
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                            style={{ fontWeight: 'bold' }}
                        >
                            Masters
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    {/* <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '2px', borderRadius: '10px', width: '100%', height: '100%' }}>
                                        <CardContent> */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                backgroundColor: '#93bce6',
                                                color: '#1c1919'
                                            },
                                        }}
                                    >
                                        <DataGrid
                                            rows={masterMenuList}
                                            columns={columns2}
                                            pageSize={8}
                                            // loading={isLoading}
                                            rowsPerPageOptions={[8]}
                                            disableSelectionOnClick
                                            style={{ border: 'none', }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '100%',
                                                minHeight: '390px',
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
                                                const rowIndex = masterMenuList.findIndex(row => row.id === params.row.id);
                                                // Check if the index is valid
                                                if (rowIndex !== -1) {
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return ''; // Return default class if index is not found
                                            }}
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                        />
                                    </Box>
                                    {/* </CardContent>
                                    </Card> */}
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                            style={{ fontWeight: 'bold' }}
                        >
                            Reports
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    {/* <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '2px', borderRadius: '10px', width: '100%', height: '100%' }}>
                                        <CardContent> */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                backgroundColor: '#93bce6',
                                                color: '#1c1919'
                                            },
                                        }}
                                    >
                                        <DataGrid
                                            rows={reportsMenuList}
                                            columns={columns3}
                                            pageSize={8}
                                            rowsPerPageOptions={[8]}
                                            disableSelectionOnClick
                                            style={{ border: 'none', }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '100%',
                                                minHeight: '390px',
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
                                            getRowClassName={(params) => {
                                                const rowIndex = reportsMenuList.findIndex(row => row.id === params.row.id);
                                                if (rowIndex !== -1) {
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return '';
                                            }}
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                        />
                                    </Box>
                                    {/* </CardContent>
                                    </Card> */}
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                            style={{ fontWeight: 'bold' }}
                        >
                            Utilities
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    {/* <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '2px', borderRadius: '10px', width: '100%', height: '100%' }}>
                                        <CardContent> */}
                                    <Box
                                        sx={{
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                backgroundColor: '#93bce6',
                                                color: '#1c1919'
                                            },
                                        }}
                                    >
                                        <DataGrid
                                            rows={utilitiesMenuList}
                                            columns={columns4}
                                            pageSize={8}
                                            // loading={isLoading}
                                            rowsPerPageOptions={[8]}
                                            disableSelectionOnClick
                                            style={{ border: 'none', }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '100%',
                                                minHeight: '390px',
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
                                            getRowClassName={(params) => {
                                                const rowIndex = utilitiesMenuList.findIndex(row => row.id === params.row.id);
                                                if (rowIndex !== -1) {
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return '';
                                            }}
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                        />
                                    </Box>
                                    {/* </CardContent>
                                    </Card> */}
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Button
                        type="submit"
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={() => {
                            setPermissionModalOpen(false)
                            ClearData();
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

export default PermissionModal