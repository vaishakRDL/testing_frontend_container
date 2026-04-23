import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React, { useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { ContactPersonsAdd, ContactPersonsDataDelete, ContactPersonsDataShow, ContentontactPersonUpdate } from '../../../ApiService/LoginPageService';
import { useEffect } from 'react';

const MultiContactPersonModule = ({ contactOpen, setContactOpen, globleId }) => {
    const [supplierCode, setSupplierCode] = useState('');
    const [contactPersonName, setContactPersonName] = useState('');
    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [telephoneNo, setTelephoneNo] = useState('');
    const [email, setEmail] = useState('');
    const [fax, setFax] = useState('');
    const [remarks, setRemarks] = useState('');
    const [fileUpload, setFileUpload] = useState('');
    const [file, setFile] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [contactPersonList, setContactPersonList] = useState([]);
    const [contactRefresh, setContactRefresh] = useState(false);
    const [isEditId, setIsEditId] = useState('');
    const [dataRefresh, setDataRefresh] = useState(false);
    const url = 'http://192.168.0.4:8000/'
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (contactOpen) {
            ContactPersonsDataShow({
                id: globleId
            }, handleShowSuccess, handleShowException);
        }
    }, [contactOpen, contactRefresh, dataRefresh]);

    const handleShowSuccess = (dataObject) => {
        setContactPersonList(dataObject?.data || []);
    }

    const handleShowException = () => {

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isEdit) {

            ContactPersonsAdd({
                sId: globleId,
                code: supplierCode,
                department: department,
                mobNo: mobileNo,
                email: email,
                remarks: remarks,
                contactPerson: contactPersonName,
                designation: designation,
                telNo: telephoneNo,
                fax: fax,
                file: fileUpload
            }, handleContactSuccess, handleContactException);
        } else {
            ContentontactPersonUpdate({
                id: isEditId,
                sId: globleId,
                code: supplierCode,
                department: department,
                mobNo: mobileNo,
                email: email,
                remarks: remarks,
                contactPerson: contactPersonName,
                designation: designation,
                telNo: telephoneNo,
                fax: fax,
                file: fileUpload
            }, handleContactSuccess, handleContactException);
        }

    };

    const handleContactSuccess = (dataObject) => {

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setContactRefresh((oldValue) => !oldValue);
        }, 2000);
    }

    const handleContactException = (errorObject, errorMessage) => {

    }

    const ClearData = () => {
        setIsEdit(false);
        setIsEditId('');
        setSupplierCode('');
        setContactPersonName('');
        setDepartment('');
        setDesignation('');
        setMobileNo('');
        setTelephoneNo('');
        setEmail('');
        setFax('');
        setRemarks('');
        setFileUpload('');
        setFile('');
    }
    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const columns = [
        {
            field: 'contactPerson',
            headerName: 'Contact Person Name',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'department',
            headerName: 'Department',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'designation',
            headerName: 'Designation',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'mobNo',
            headerName: 'Mobile No',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'telNo',
            headerName: 'Tel No',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'email',
            headerName: 'Email',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'fax',
            headerName: 'Fax',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerName: 'Remaks',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerName: 'Actions',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];


    function EditData(props) {
        return (
            <EditIcon
                style={{ color: 'black' }}
                onClick={(event) => {
                    setIsEdit(true);
                    setIsEditId(props.selectedRow.id || '');
                    setSupplierCode(props.selectedRow.code || '');
                    setContactPersonName(props.selectedRow.contactPerson || '');
                    setDepartment(props.selectedRow.department || '');
                    setDesignation(props.selectedRow.designation || '');
                    setMobileNo(props.selectedRow.mobNo || '');
                    setTelephoneNo(props.selectedRow.telNo || '');
                    setEmail(props.selectedRow.email || '');
                    setFax(props.selectedRow.fax || '');
                    setRemarks(props.selectedRow.remarks || '');
                    setFileUpload(url + props.selectedRow.file || '');
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    ContactPersonsDataDelete({
                        id: props.selectedRow.id
                    }, deletehandleSuccess, deletehandleException);
                }}
                style={{ color: 'black' }}
            />
        );
    }

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setTimeout(() => {
            handleClose();
            setDataRefresh((oldvalue) => !oldvalue);
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

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={contactOpen}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Contact Persons
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                            <Grid container spacing={2}>

                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        sx={{ mb: 1 }}
                                        label="Supplier Code"
                                        type="text"
                                        fullWidth
                                        value={supplierCode}
                                        onChange={(e) => setSupplierCode(e.target.value)}
                                        variant="filled"
                                        placeholder="Customer Code"
                                        size='small'
                                        required
                                        margin="dense"

                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        sx={{ mb: 1 }}
                                        label="Contact Person Name"
                                        type="text"
                                        fullWidth
                                        value={contactPersonName}
                                        onChange={(e) => setContactPersonName(e.target.value)}
                                        variant="filled"
                                        placeholder="Contact Person Name"
                                        size='small'
                                        required
                                        margin="dense"

                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        sx={{ mb: 1 }}
                                        label="Department"
                                        type="text"
                                        fullWidth
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        variant="filled"
                                        placeholder="Department"
                                        multiline
                                        required
                                        margin="dense"
                                        size='small'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        sx={{ mb: 1 }}
                                        label="Designation"
                                        type="text"
                                        fullWidth
                                        value={designation}
                                        onChange={(e) => setDesignation(e.target.value)} setDesignation
                                        variant="filled"
                                        placeholder="Designation"
                                        multiline
                                        required
                                        margin="dense"
                                        size='small'

                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        sx={{ mb: 1 }}
                                        label="Mobile No"
                                        type="text"
                                        fullWidth
                                        value={mobileNo}
                                        onChange={(e) => setMobileNo(e.target.value)}
                                        variant="filled"
                                        placeholder="Mobile No"
                                        multiline
                                        required
                                        margin="dense"
                                        size='small'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        sx={{ mb: 1 }}
                                        label="Tel No"
                                        type="text"
                                        fullWidth
                                        value={telephoneNo}
                                        onChange={(e) => setTelephoneNo(e.target.value)}
                                        variant="filled"
                                        placeholder="Tel No"
                                        size='small'
                                        required
                                        margin="dense"

                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        sx={{ mb: 1 }}
                                        label="Email"
                                        type="text"
                                        fullWidth
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        variant="filled"
                                        placeholder="Email"
                                        size='small'
                                        required
                                        margin="dense"

                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        sx={{ mb: 1 }}
                                        label="Fax"
                                        type="text"
                                        fullWidth
                                        value={fax}
                                        onChange={(e) => setFax(e.target.value)}
                                        variant="filled"
                                        placeholder="Fax"
                                        multiline
                                        required
                                        margin="dense"
                                        size='small'
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        sx={{ mb: 1 }}
                                        label="Remaks"
                                        type="text"
                                        fullWidth
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        variant="filled"
                                        placeholder="Remaks"
                                        multiline
                                        required
                                        margin="dense"
                                        size='small'

                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <img src={fileUpload} style={{ width: '90%', height: '25vh', margin: "10px" }} />

                            <TextField
                                margin="dense"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            if (reader.readyState === 2) {
                                                setFileUpload(reader.result);
                                                setFile(reader.result);
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                                type="file"
                            />


                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '100%', height: '32vh' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={contactPersonList}
                                        columns={columns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        sx={{
                                            height: '30vh',
                                            // minHeight: '480px',
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

                        </Grid>

                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}

                            type="submit"

                        >
                            {
                                !isEdit ? 'Add' : 'Update'
                            }

                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setContactOpen(false);
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

export default MultiContactPersonModule