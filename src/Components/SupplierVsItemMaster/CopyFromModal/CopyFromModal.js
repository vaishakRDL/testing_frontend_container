import { Autocomplete, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import { MultiAddressAdd, MultiAddressDataDelete, MultiAddressDataShow, MultiAddressDataUpdate } from '../../ApiService/LoginPageService';
import { GetSuppVsItemSuppList, GetSuppVsItemSuppItemList, GetSuppVsItemCopyFromAction } from '../../../ApiService/LoginPageService';
import FeedbackIcon from '@mui/icons-material/Feedback';


const CopyFromModal = ({ copyFromModal, setCopyFromModal, globleId, setSupplierItemList, suppId }) => {
    const [supplierCode, setSupplierCode] = useState('')
    const [category, setCategory] = useState('');
    const [address, setAddress] = useState('');
    const [defaultShippingAddress, setDefaultShippingAddress] = useState('');
    const [multiAddress, setMultiAddress] = useState([]);
    const [multiRefresh, setMultiRefresh] = useState(true);
    const [isEditable, setIsEditable] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [supplierSelct, setSupplierSelect] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [supplierList, setSupplierList] = useState([])


    useEffect(() => {
        copyFromModal && GetSuppVsItemSuppList(handleGetSuppVsItemSuppListSucessShow, handleGetSuppVsItemSuppListExceptionShow);
    }, [copyFromModal])

    // GET SUPPLIER LIST
    const handleGetSuppVsItemSuppListSucessShow = (dataObject) => {
        setSupplierList(dataObject?.data || []);
    }
    const handleGetSuppVsItemSuppListExceptionShow = (errorObject, errorMessage) => {
    }

    const options = supplierList.map(item => ({
        id: item.id,
        label: item.spName
    }));

    function handleAutocompleteChange(selectedValue) {
        // Your logic here with the selected value
        console.log("Selected Value:", selectedValue.id);
        console.log("suppId", suppId);
        setSupplierSelect(selectedValue?.id || '')
        // GetSuppVsItemCopyFromAction({ copyFrom: selectedValue.id, copyTo: suppId }, handleCopySuccess, handleCopyException)
    }

    const handleCopySuccess = (dataObject) => {
        // setSupplierItemList(dataObject?.data || []);
        console.log("dataObjectdataObject", dataObject)
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setCopyFromModal(false);
        }, 2000);
    }
    const handleCopyException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    //ROW SELECTION FUNCTION CALL
    const [selectionModel, setSelectionModel] = React.useState([]);

    const handleSubmit = (e) => {
        e.preventDefault(); // prevent form submit
        setOpenConfirm(true); // open confirmation dialog
    };

    const handleConfirmSubmit = () => {
        setOpenConfirm(false);

        GetSuppVsItemCopyFromAction(
            { copyFrom: supplierSelct, copyTo: suppId },
            handleCopySuccess,
            handleCopyException
        );
    };


    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="md"
            open={copyFromModal}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Select from SUPP Master...
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>

                    <Grid container style={{ height: '300px' }}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="combo-box-demo"
                                options={options}
                                // sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Search" />}
                                onChange={(event, value) => handleAutocompleteChange(value)}
                            />
                        </Grid>

                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type="submit"
                        >
                            Submit
                        </Button>

                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setCopyFromModal(false);
                                // ClearData();
                            }}
                        >
                            Close
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
            <Dialog
                fullWidth
                maxWidth="sm"
                sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '100%' } }}
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
            >
                <DialogTitle sx={{ textAlign: 'center' }}>
                    <FeedbackIcon color="warning" style={{ fontSize: 95, color: '#8b1228' }} />
                </DialogTitle>

                <DialogContent
                    sx={{
                        mt: 1,
                        textAlign: 'center',
                        fontFamily: 'customfont',
                        letterSpacing: '0.5px',
                        marginTop: '0px'
                    }}
                >
                    <Typography
                        sx={{
                            m: 1,
                            fontFamily: 'customfont',
                            letterSpacing: '0.5px',
                            padding: '10px 0'
                        }}
                        variant="h5"
                        component="span"
                    >
                        Do you want to copy supplier item mapping?
                    </Typography>
                    <br />
                    Please verify before submitting. This action cannot be undone.
                </DialogContent>

                <DialogActions sx={{ margin: '10px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <Button
                            onClick={handleConfirmSubmit}
                            style={{ background: 'rgb(19 60 129)' }}
                            sx={{
                                height: '0',
                                color: 'white',
                                padding: "10px 19px",
                                fontSize: '13px',
                                borderRadius: '10px',
                                fontWeight: '600',
                                fontFamily: 'customfont',
                                letterSpacing: '1px',
                                boxShadow: 'none',
                                marginRight: '20px',
                                marginBottom: '20px'
                            }}
                            disabled={!supplierSelct}   // optional safety
                        >
                            Confirm
                        </Button>

                        <Button
                            style={{ background: 'rgb(19 60 129)' }}
                            sx={{
                                height: '0',
                                color: 'white',
                                padding: "10px 19px",
                                fontSize: '13px',
                                borderRadius: '10px',
                                fontWeight: '600',
                                fontFamily: 'customfont',
                                letterSpacing: '1px',
                                boxShadow: 'none',
                                marginRight: '20px',
                                marginBottom: '20px'
                            }}
                            onClick={() => setOpenConfirm(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>


        </Dialog>
    )
}

export default CopyFromModal
