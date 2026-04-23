import { Typography } from '@material-ui/core';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { GetSoPendingVreification, SoVerificationSearch } from '../../ApiService/LoginPageService';

const CostingDocument = ({ setIsApproveVisible, setId, setPricePONO, setPriceDate, setVerifiedCount, setNotVerifiedCount, setMismatchCount, setDataList, openDocument, setOpenDocument, setButtonFlag }) => {
    const [supplyItemList, setsupplyItemList] = useState([]);
    const [supplyItemcode, setSupplyItemcode] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }
    useEffect(() => {
        openDocument && SoVerificationSearch({ code: "" }, supplyItemItemProcessSucessShow, supplyItemProcessExceptionShow);

    }, [openDocument])



    const columns = [
        {
            field: 'id',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Cost ID
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    PO No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'authorized',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Authorised
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 850,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

    ];

    const handleChange = (e) => {
        SoVerificationSearch({ code: e.target.value }, supplyItemItemProcessSucessShow, supplyItemProcessExceptionShow);
    }

    const supplyItemItemProcessSucessShow = (dataObject) => {
        setsupplyItemList(dataObject?.data || []);
    }
    const supplyItemProcessExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSupplierSearchItemChange = (value) => {
        if (value !== null) {
            setSupplyItemcode(value.spCode);
        }
    }

    const handleRowDoubleClick = (params) => {
        GetSoPendingVreification({
            id: params?.row?.id
        }, handlePendingSuccess, handlePendingException);
        setOpenDocument(false); // Close dialog
        setButtonFlag(true);
        if (params?.row?.authorized === "N") {
            setIsApproveVisible(true); // Show Approve button if authorized = "N"
        } else {
            setIsApproveVisible(false); // Hide Approve button otherwise
        }
    };

    const handlePendingSuccess = (dataObject) => {
        setDataList(dataObject?.data || [])
        setMismatchCount(dataObject?.mismatchCount || 0);
        setNotVerifiedCount(dataObject?.notVerifiedCount || 0);
        setVerifiedCount(dataObject?.verifiedCount || 0);
        setPriceDate(dataObject?.date || 0);
        setPricePONO(dataObject?.poNo || 0);
        setId(dataObject?.id || 0);

    };

    const handlePendingException = (errorObject, errorMessage) => {
        console.log(errorMessage);
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={openDocument}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                Please Select Costing Document
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container style={{ display: 'flex', alignItems: 'center' }}>
                        <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                            <Typography>
                                Search PO No
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={4} xl={4}>
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="combo-box-demo"
                                value={supplyItemList.find((item) => item.spCode === supplyItemcode) || null} // Ensure matching object
                                options={supplyItemList}
                                size="small"
                                getOptionLabel={(option) => option.spName || ""}
                                sx={{
                                    height: "45px", // Adjust height as needed
                                    "& .MuiInputBase-root": {
                                        height: "45px", // Ensure input field height matches
                                    },

                                }}
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        variant="filled"
                                        label="Search Customer"
                                        onChange={handleChange}
                                    />}
                                onChange={(event, value) => handleSupplierSearchItemChange(value)}
                                style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '20px' }}>
                            <DataGrid
                                rows={supplyItemList}
                                columns={columns}
                                pageSize={8}
                                // loading={isLoading}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ border: 'none', fontWeight: 'bold' }}
                                sx={{
                                    overflow: 'auto',
                                    height: '60vh',
                                    // minHeight: '500px',
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
                                        border: '1px solid #969696', // Add border to column headers
                                    },
                                }}
                                getRowClassName={(params) => {
                                    // Find the index of the row within the rows array
                                    const rowIndex = [].findIndex(row => row.id === params.row.id);
                                    // Check if the index is valid
                                    if (rowIndex !== -1) {
                                        console.log(' ');
                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    }
                                    return ''; // Return default class if index is not found
                                }}
                                onRowDoubleClick={handleRowDoubleClick}
                                rowHeight={40}
                                columnHeaderHeight={40}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>

                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => setOpenDocument(false)}

                    >
                        Cancel
                    </Button>
                </DialogActions>
                {/* <NotificationBar
            handleClose={handleClose}
            notificationContent={openNotification.message}
            openNotification={openNotification.status}
            type={openNotification.type}
        /> */}

            </form>
        </Dialog>
    )
}

export default CostingDocument