import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { CustomContactDelete, CustomContactShow, CustomContactUpdate, CustomMContactAdd } from '../../../ApiService/LoginPageService';

const MultiContactPersonModule = ({ contactOpen, setContactOpen, autoCustomId,contactPersonDetails, setContactPersonDetails }) => {
    const [customerCode, setCustomerCode] = useState('');
    const [contactPersonName, setContactPersonName] = useState('');
    const [department, setDepartment] = useState('');
    const [deesignation, setDesignation] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [telNo, setTelNumber] = useState('');
    const [email, setEmail] = useState('');
    const [fax, setFax] = useState('');
    const [remarks, setRemarks] = useState('');
    const [fileImg, setFileImg] = useState('');
    const [file, setFile] = useState('');
    const [editDataId, setEditeDataId] = useState('');
//    const [contactPersonDetails, setContactPersonDetails] = useState([]);
    const url = 'http://192.168.0.247:8000/';

    const [isContact, setIsContact] = useState(true);

    const [customerDataList, setCustomerDataList] = useState([]);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (contactOpen) {

            CustomContactShow({
                id: autoCustomId
            }, handleCustomContactShowSuccess, handleCustomContactShowException);
        }

    }, [contactOpen]);

    const handleCustomContactShowSuccess = (dataObject) => {
        setCustomerDataList(dataObject.data || []);
    }

    const handleCustomContactShowException = (errorObject, errorMessage) => {
        console.log('error Message', errorMessage);
    }
     
    const handleSubmit=(e) => {
        e.preventDefault();
        if (!customerCode || !contactPersonName || !department || !deesignation || !mobileNo || !telNo || !email || !fax || !remarks || !fileImg) {
            alert("Please Enter all the Fields");
            return;
        }

        const uniqueId = Date.now();
        setContactPersonDetails((prev) => [
            ...prev,
            { id :uniqueId ,code: customerCode, name: contactPersonName,department: department,designation : deesignation,mbNo :mobileNo ,telNo :telNo ,email :email, fax :fax, remark :remarks ,file :fileImg}
        ]);

        setCustomerCode('');
        setContactPersonName('');
        setDepartment('');
        setDesignation('');
        setMobileNo('');
        setTelNumber('');
        setEmail('');
        setFax('');
        setRemarks('');
        setFileImg('');

    }


    const handleCustomMContactAddSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            ClearData();
            CustomContactShow({
                id: autoCustomId
            }, handleCustomContactShowSuccess, handleCustomContactShowException);
        }, 2000);
    }

    const handleCustomMContactAddException = (errorObject, errorMessage) => {

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
            field: 'code',
            headerName: 'Customer Code',
            type: 'string',
            headerClassName: 'super-app-theme--header',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'name',
            headerName: 'Contact Person Name',
            type: 'string',
            headerClassName: 'super-app-theme--header',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'department',
            headerName: 'Department',
            type: 'number',
            headerClassName: 'super-app-theme--header',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'designation',
            headerName: 'Designation',
            type: 'string',
            headerClassName: 'super-app-theme--header',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'mbNo',
            headerName: 'Mobile No',
            type: 'string',
            headerClassName: 'super-app-theme--header',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'telNo',
            headerName: 'Tel No',
            type: 'string',
            headerClassName: 'super-app-theme--header',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'email',
            headerName: 'Email',
            type: 'string',
            headerClassName: 'super-app-theme--header',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'fax',
            headerName: 'Fax',
            type: 'string',
            headerClassName: 'super-app-theme--header',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'remark',
            headerName: 'Remaks',
            type: 'string',
            headerClassName: 'super-app-theme--header',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            headerClassName: 'super-app-theme--header',
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
                style={{ color: 'balck' }}
                onClick={(event) => {
                    setIsContact(false);
                    setEditeDataId(props.selectedRow.id || '');
                    setCustomerCode(props.selectedRow.code || '');
                    setContactPersonName(props.selectedRow.name || '');
                    setDepartment(props.selectedRow.department || '');
                    setDesignation(props.selectedRow.designation || '');
                    setMobileNo(props.selectedRow.mbNo || '');
                    setTelNumber(props.selectedRow.telNo || '');
                    setEmail(props.selectedRow.email || '');
                    setFax(props.selectedRow.fax || '');
                    setRemarks(props.selectedRow.remark || '');
                    setFileImg(url + props.selectedRow.file || '');
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    CustomContactDelete({ id: props.selectedRow.id }, handleDeleteSuccess, handleDeleteException);
                }}
                style={{ color: 'balck' }}
            />
        );
    }

    const handleDeleteSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            CustomContactShow({
                id: autoCustomId
            }, handleCustomContactShowSuccess, handleCustomContactShowException);
        }, 2000);
    }

    const handleDeleteException = () => {

    }

    const ClearData = () => {
        setCustomerCode('');
        setContactPersonName('');
        setDepartment('');
        setDesignation('');
        setMobileNo('');
        setTelNumber('');
        setEmail('');
        setFax('');
        setRemarks('');
        setFileImg('');
        setFile('');
        setIsContact(true);
    }
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={contactOpen}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Contact Person Details
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                            <Grid container spacing={2}>

                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        sx={{ mb: 1 }}
                                        label="Customer Code"
                                        type="text"
                                        fullWidth
                                        value={customerCode}
                                        variant="filled"
                                        size='small'
                                        placeholder="Customer Code"
                                        onChange={(e) => {
                                            setCustomerCode(e.target.value);
                                        }}
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
                                        variant="filled"
                                        size='small'
                                        placeholder="Contact Person Name"
                                        onChange={(e) => {
                                            setContactPersonName(e.target.value);
                                        }}
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
                                        variant="filled"
                                        placeholder="Department"
                                        size='small'
                                        multiline
                                        required
                                        onChange={(e) => {
                                            setDepartment(e.target.value);
                                        }}
                                        margin="dense"

                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        sx={{ mb: 1 }}
                                        label="Designation"
                                        type="text"
                                        fullWidth
                                        value={deesignation}
                                        variant="filled"
                                        size='small'
                                        placeholder="Designation"
                                        multiline
                                        onChange={(e) => {
                                            setDesignation(e.target.value);
                                        }}
                                        required
                                        margin="dense"

                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        sx={{ mb: 1 }}
                                        label="Mobile No"
                                        type="text"
                                        fullWidth
                                        value={mobileNo}
                                        variant="filled"
                                        size='small'
                                        placeholder="Mobile No"
                                        multiline
                                        onChange={(e) => {
                                            setMobileNo(e.target.value);
                                        }}
                                        required
                                        margin="dense"

                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        sx={{ mb: 1 }}
                                        label="Tel No"
                                        type="text"
                                        fullWidth
                                        value={telNo}
                                        variant="filled"
                                        size='small'
                                        placeholder="Tel No"
                                        onChange={(e) => {
                                            setTelNumber(e.target.value);
                                        }}
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
                                        size='small'
                                        variant="filled"
                                        placeholder="Email"
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
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
                                        variant="filled"
                                        placeholder="Fax"
                                        multiline
                                        size='small'
                                        required
                                        onChange={(e) => {
                                            setFax(e.target.value);
                                        }}
                                        margin="dense"

                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <TextField
                                        sx={{ mb: 1 }}
                                        label="Remaks"
                                        type="text"
                                        fullWidth
                                        value={remarks}
                                        variant="filled"
                                        size='small'
                                        placeholder="Remarks"
                                        multiline
                                        // required
                                        onChange={(e) => {
                                            setRemarks(e.target.value)
                                        }}
                                        margin="dense"

                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <img src={fileImg} style={{ width: '90%', height: '25vh', margin: "10px" }} />
                            <TextField
                                margin="dense"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            if (reader.readyState === 2) {
                                                setFileImg(reader.result);
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
                            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '100%', height: '100%' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={contactPersonDetails}
                                        columns={columns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        sx={{
                                            height: '35vh',
                                            // minHeight: '480px',
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                WebkitTextStrokeWidth: "0.6px",
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
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />
                                </CardContent>
                            </Card>

                        </Grid>

                    </Grid>

                    <DialogActions style={{ marginTop: '20px' }}>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}

                            type="submit"

                        >
                            {
                                isContact ? 'Add' : 'Update'
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