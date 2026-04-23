import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { CustomMultiAddressAdd, CustomMultiAddressDelete, CustomMultiAddressShow, CustomMultiAddresspdate } from '../../../ApiService/LoginPageService';

const MultiAddressModule = ({ multiOpen, setMultiOpen, autoCustomId, setUploadMultiAdress, uploadMultiAdress, isEditMultiAdd, setIsEditMultiAdd, editeDataId, setEditDataId, multiAddEditRow,customerNameMulti,customerCodeMulti}) => {
    const [customerCode, setcustomerCode] = useState('');
    const [cotegory, setCotegory] = useState('');
    const [address, setAddress] = useState('');
    const [isMultiAddress, setIsMultiAddress] = useState(true);
    const [defaultShipping, setDefaultShipping] = useState('N');
    const [multiAdressList, setMultiAddressList] = useState([]);
    // const [uploadMultiAdress, setUploadMultiAdress] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [customerName, setCustomerName] = useState('');
    const [custGstNo, setCustGstNo] = useState('');
    const [isTouchedCustomerCode, setIsTouchedCustomerCode] = useState(false);
    const [isTouchedCustomerName, setIsTouchedCustomerName] = useState(false);
    const [isTouchedAddress, setIsTouchedAddress] = useState(false);
    const [isTouchedGstNo, setIsTouchedGstNo] = useState(false);

    useEffect(() => {
        setcustomerCode(multiAddEditRow.code || '');
        setCustomerName(multiAddEditRow.custName || '');
        setAddress(multiAddEditRow.address || '');
        setCustGstNo(multiAddEditRow.gstNo || '');
    }, [multiAddEditRow])

    useEffect(() => {
        if (multiOpen) {
            CustomMultiAddressShow({
                id: autoCustomId
            }, handleCustomMultiAddressShowSuccess, handleCustomMultiAddressShowException);
        }
    }, [multiOpen, isMultiAddress]);

    const handleCustomMultiAddressShowSuccess = (dataObject) => {
        setMultiAddressList(dataObject?.data || []);

    }

    const handleCustomMultiAddressShowException = () => {

    }

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (isMultiAddress) {

    //         CustomMultiAddressAdd({
    //             cId: autoCustomId,
    //             cust_Code: customerCode,
    //             category: cotegory,
    //             address: address,
    //             def_ship_add: defaultShipping
    //         }, handleSuccessCustomMultiAddressAdd, handleExceptionCustomMultiAddressAdd);

    //     } else {
    //         CustomMultiAddresspdate({
    //             id: editeDataId,
    //             cId: autoCustomId,
    //             cust_Code: customerCode,
    //             category: cotegory,
    //             address: address,
    //             def_ship_add: defaultShipping
    //         }, handleSuccessCustomMultiAddressAdd, handleExceptionCustomMultiAddressAdd);
    //     }
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     if (!customerCode || !customerName || !address || !custGstNo) {
    //         alert("Please Enter all the Fields");
    //         return;
    //     }
    //     const uniqueId = Date.now();
    //     // Append new file data to uploadedFiles state
    //     setUploadMultiAdress((prev) => [
    //         ...prev,
    //         { id: uniqueId, code: customerCode, custName: customerName, address: address, gstNo: custGstNo }
    //     ]);

    //     // Reset fields after submission
    //     setcustomerCode("");
    //     setCustomerName("");
    //     setAddress("");
    //     setIsMultiAddress("");
    //     setCustGstNo("");
    //     setIsTouchedCustomerCode(false);
    //     setIsTouchedCustomerName(false);
    //     setIsTouchedAddress(false)
    //     setIsTouchedGstNo(false)
    //     setIsEditMultiAdd(false)
    // }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!customerCodeMulti || !customerNameMulti || !address || !custGstNo) {
            alert("Please Enter all the Fields");
            return;
        }

        if (isEditMultiAdd) {
            // Update the existing entry
            setUploadMultiAdress((prev) =>
                prev.map((item) =>
                    item.id === editeDataId
                        ? { ...item, code: customerCodeMulti, custName: customerNameMulti, address: address, gstNo: custGstNo }
                        : item
                )
            );
        } else {
            // Add a new entry
            const uniqueId = Date.now();
            setUploadMultiAdress((prev) => [
                ...prev,
                { id: uniqueId, code: customerCodeMulti, custName: customerNameMulti, address: address, gstNo: custGstNo }
            ]);
        }

        // Reset fields after submission
        setcustomerCode("");
        setCustomerName("");
        setAddress("");
        setIsMultiAddress("");
        setCustGstNo("");
        setIsTouchedCustomerCode(false);
        setIsTouchedCustomerName(false);
        setIsTouchedAddress(false);
        setIsTouchedGstNo(false);
        setIsEditMultiAdd(false);
    };



    const handleSuccessCustomMultiAddressAdd = (dataObject) => {

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            ClearData();
            CustomMultiAddressShow({
                id: autoCustomId
            }, handleCustomMultiAddressShowSuccess, handleCustomMultiAddressShowException);
        }, 2000);

    }

    const handleExceptionCustomMultiAddressAdd = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
            // ClearData();
        }, 2000);
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
            field: 'custName',
            headerName: 'Customer Name',
            type: 'string',
            headerClassName: 'super-app-theme--header',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'address',
            headerName: 'Address',
            type: 'number',
            headerClassName: 'super-app-theme--header',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'gstNo',
            headerName: 'GST No',
            type: 'string',
            headerClassName: 'super-app-theme--header',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
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
                    setEditDataId(props.selectedRow.id);
                    setIsMultiAddress(false);
                    setIsEditMultiAdd(true)
                    // setcustomerCode(props.selectedRow.cust_Code || '');
                    // setCotegory(props.selectedRow.category || '');
                    // setAddress(props.selectedRow.address || '');
                    // setDefaultShipping(props.selectedRow.defaultAddress || '');

                    setcustomerCode(props.selectedRow.code || '');
                    setCustomerName(props.selectedRow.custName || '');
                    setAddress(props.selectedRow.address || '');
                    setCustGstNo(props.selectedRow.gstNo || '');
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    const updatedMultiAddress = uploadMultiAdress.filter((add) => add.id !== props.selectedRow.id)
                    setUploadMultiAdress(updatedMultiAddress);
                }}
                style={{ color: 'black' }}
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
            CustomMultiAddressShow({
                id: autoCustomId
            }, handleCustomMultiAddressShowSuccess, handleCustomMultiAddressShowException);
        }, 2000);
    }

    const handleDeleteException = () => {

    }
    const ClearData = () => {
        setEditDataId('');
        setIsMultiAddress(true);
        setcustomerCode('');
        setCotegory('');
        setAddress('');
        setDefaultShipping('N');
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={multiOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Multi Address
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <TextField
                                sx={{ mb: 1 }}
                                label="Customer Code"
                                type="text"
                                fullWidth
                                value={customerCodeMulti}
                                variant="filled"
                                size="small"
                                placeholder="Customer Code"
                                required
                                margin="dense"
                                error={isTouchedCustomerCode && !customerCodeMulti} // Show error only if touched and empty
                                helperText={isTouchedCustomerCode && !customerCodeMulti ? "Customer Code is required" : ""}
                                onChange={(e) => setcustomerCode(e.target.value)}
                                onBlur={() => setIsTouchedCustomerCode(true)} // Mark as touched when focus leaves
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <TextField
                                sx={{ mb: 1 }}
                                label="Customer Name"
                                type="text"
                                fullWidth
                                value={customerNameMulti}
                                variant="filled"
                                size='small'
                                placeholder="Customer Name"
                                error={isTouchedCustomerName && !customerNameMulti} // Show error only if touched and empty
                                helperText={isTouchedCustomerName && !customerNameMulti ? "Customer Name is required" : ""}
                                onChange={(e) => {
                                    setCustomerName(e.target.value)
                                }}
                                onBlur={() => setIsTouchedCustomerName(true)} // Mark as touched when focus leaves
                                required
                                margin="dense"

                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <TextField
                                sx={{ mb: 1 }}
                                label="Address"
                                type="text"
                                fullWidth
                                value={address}
                                variant="filled"
                                size='small'
                                placeholder="Address"
                                multiline
                                required
                                error={isTouchedAddress && !address} // Show error only if touched and empty
                                helperText={isTouchedAddress && !address ? "address is required" : ""}
                                onChange={(e) => {
                                    setAddress(e.target.value);
                                }}
                                margin="dense"
                                onBlur={() => setIsTouchedAddress(true)} // Mark as touched when focus leaves
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            {/* <TextField
                                sx={{ mb: 1 }}
                                label="GST No"
                                type="text"
                                fullWidth
                                value={custGstNo}
                                variant="filled"
                                size='small'
                                placeholder="GST No"
                                multiline
                                error={isTouchedGstNo && !custGstNo} // Show error only if touched and empty
                                helperText={isTouchedGstNo && !custGstNo ? "GST No is required" : ""}
                                onChange={(e) => {
                                    setCustGstNo(e.target.value);
                                }}
                                required
                                margin="dense"
                                onBlur={() => setIsTouchedGstNo(true)} // Mark as touched when focus leaves
                            /> */}
                            <TextField
                                sx={{ mb: 1 }}
                                label="GST No"
                                type="text"
                                fullWidth
                                value={custGstNo}
                                variant="filled"
                                size="small"
                                placeholder="GST No"
                                multiline
                                error={isTouchedGstNo && (custGstNo.length < 13 || custGstNo.length > 15)}
                                helperText={
                                    isTouchedGstNo && (custGstNo.length < 13 || custGstNo.length > 15)
                                        ? "GST No must be between 13 and 15 characters"
                                        : ""
                                }
                                onChange={(e) => setCustGstNo(e.target.value)}
                                required
                                margin="dense"
                                onBlur={() => setIsTouchedGstNo(true)}
                            />

                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '100%', height: '32vh' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={uploadMultiAdress}
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

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type="submit"

                        >
                            {isEditMultiAdd ? "Update" : "Add"}
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setMultiOpen(false);
                                setIsEditMultiAdd(false);
                                setEditDataId("");
                                setcustomerCode("");
                                setCustomerName("");
                                setAddress("");
                                setCustGstNo("");
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

export default MultiAddressModule
