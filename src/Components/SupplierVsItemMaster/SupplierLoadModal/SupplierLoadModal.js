import { Autocomplete, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
// import { MultiAddressAdd, MultiAddressDataDelete, MultiAddressDataShow, MultiAddressDataUpdate } from '../../ApiService/LoginPageService';
import { GetSuppVsItemSuppList, GetSuppVsItemSuppItemList, GetSuppVsItemAllSuppList } from '../../../ApiService/LoginPageService';

const SupplierLoadModal = ({ onSupplierSelect, modalOpen, setModalOpen, globleId, setSupplierItemList, setIsTableEditable, supplierItemList, setSuppCode, setSuppName, setSuppId }) => {

    const [page, setPage] = useState(1); // 🔹 track current page dynamically
    const [selectedSuppId, setSelectedSuppId] = useState(''); // store current supplier ID

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [supplierList, setSupplierList] = useState([])

    const columns = [
        {
            field: 'itemName',
            headerName: 'Items Attached',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'spCode',
            headerName: 'SUPPCODE',
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'suppName',
            headerName: 'SUPPCODE Clean',
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

    ];

    //GET SUPPLIER LIST
    const handleChange = (e) => {
        const val = e.target.value || '';
        // Guard: only call API for inputs with length >= 2 to avoid server 500s
        if (val.trim().length >= 2) {
            GetSuppVsItemAllSuppList({ code: val }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
        } else {
            setSupplierList([]);
        }
    }

    const handleItemVsProcessItemSucessShow = (dataObject) => {
        setSupplierList(dataObject?.data || []);
    }
    const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
    }


    // const handleSupplierSearchItemChange = (value) => {
    //     if (value !== null) {
    //       const firstPage = 1; // Explicitly set page to 1
    //       setPage(firstPage);  // Update state for future use
    //       setSelectedSuppId(value.id);

    //       // Call API directly with firstPage
    //       GetSuppVsItemSuppItemList(
    //         { id: value.id, supCode: '', page: firstPage },
    //         handleGetSuppItemListSucessShow,
    //         handleGetSuppItemListExceptionShow
    //       );
    //     }
    //   };


    const handleSupplierSearchItemChange = (value) => {
        if (value) {
            // Pass selected supplier ID to parent
            onSupplierSelect(value.id, value.spCode, value.suppName);
            setModalOpen(false);
        }
    };

    const handleGetSuppItemListSucessShow = (dataObject) => {
        // setSupplierItemList(dataObject?.data || []);
        const filteredItems = (dataObject?.data || []).filter(item => item.id !== null);
        // Add { id: 'RDL1' } if it doesn't already exist
        if (!filteredItems.some(item => item.id === 'RDL1')) {
            filteredItems.push({ id: 'RDL1' });
        }

        // setSupplierItemList(filteredItems);
        setSupplierItemList(prevList =>
            page === 1 ? filteredItems : [...prevList, ...filteredItems]
        );



        setIsTableEditable(false);
        // setModalOpen(false);
        setSuppCode(dataObject?.data[0]?.spCode || '');
        setSuppName(dataObject?.data[0]?.suppName || '');
        setSuppId(dataObject?.data[0]?.supId || '');
    }
    const handleGetSuppItemListExceptionShow = (errorObject, errorMessage) => {
    }



    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="md"
            open={modalOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Search Supplier By Name
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" /*onSubmit={handleSubmit}*/>

                    <Grid container style={{ height: '300px' }}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={supplierList}
                                fullWidth
                                getOptionLabel={(option) => option.spCode || ''}
                                renderInput={(params) => <TextField {...params} label="Supplier" onChange={handleChange} />}
                                onChange={(event, value) => handleSupplierSearchItemChange(value)}
                                size="small"
                                style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                            />
                        </Grid>



                    </Grid>

                    <DialogActions>

                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setModalOpen(false);
                                // ClearData();
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>


            <NotificationBar
                // handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Dialog>
    )
}

export default SupplierLoadModal
