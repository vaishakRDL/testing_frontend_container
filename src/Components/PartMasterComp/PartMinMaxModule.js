import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, TextField, Checkbox, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { DownloadItemStockTemplateExl } from '../../ApiService/DownloadCsvReportsService';
import { ItemStockDataBase, ItemStockImportlistdata } from '../../ApiService/LoginPageService';

const PartMinMaxModule = ({ itemInfoOpen, setItemInfoOpen }) => {
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState([]);
    const [itemCount, setItemCount] = useState('0');
    const [isLoading, setIsLoading] = useState(false);
    const [excelDataList, setExcelDataList] = useState([]);
    const [importDataList, setImportDataList] = useState([]);
    const [totalNumber, setTotalNumber] = useState(0);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const columns = [
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Code
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Name
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'maxQty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Max QTY
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'minQty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Min Qty
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },


    ];


    const handleItemStockImportSuccess = (dataObject) => {
        setImportDataList(dataObject?.data || []);
        setTotalNumber(dataObject?.data?.length ?? 0);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject?.message,
        });
    }

    const handleItemStockImportException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    const handleDownloadItemStockTemplateExlSuccess = (dataObject) => {
        setExcelDataList(dataObject?.data || []);

    }

    const handleDownloadItemStockTemplateExlException = (errorObject, errorMessage) => {

    }

    const handleItemStockDataBaseSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setExcelDataList([]);
            setItemInfoOpen(false);
        }, 3000);

    }

    const handleItemStockDataBaseException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={itemInfoOpen}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Update Item Stock Info
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} style={{ marginTop: '10px', marginBottom: '20px' }}>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TextField
                            fullWidth
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        if (reader.readyState === 2) {
                                            setFileData(reader.result);
                                            // setFile(reader.result);
                                            ItemStockImportlistdata(
                                                {
                                                    file: reader.result
                                                }, handleItemStockImportSuccess, handleItemStockImportException)

                                        }
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                }
                            }}
                            InputLabelProps={{ shrink: true }}
                            type="file" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={3} xl={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#002D68',
                                height: '40px',
                                width: '400px',
                                borderRadius: '20px',

                            }}
                            onClick={() => {
                                ItemStockDataBase({
                                    data: importDataList
                                }, handleItemStockDataBaseSuccess, handleItemStockDataBaseException);
                            }}
                        >
                            Load To Database
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={2} lg={3} xl={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button variant="contained"
                            onClick={() => {
                                DownloadItemStockTemplateExl(handleDownloadItemStockTemplateExlSuccess, handleDownloadItemStockTemplateExlException);
                            }}
                            sx={{
                                backgroundColor: '#002D68',
                                height: '40px',
                                width: '200px',
                                borderRadius: '20px'
                            }}>
                            Template
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography>
                            Please Select a Excel file Containing Item Details
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <TextField
                            id="filled-basic"
                            label="Tatal Number of Records Loaded"
                            variant="filled"
                            sx={{ mb: 1 }}
                            margin="dense"
                            fullWidth
                            required
                            value={totalNumber}
                            placeholder="Tatal Number of Records Loaded"
                            InputLabelProps={{
                                shrink: true, style: { fontWeight: 'bold' }
                            }}
                            disabled={true}
                        />
                    </Grid>

                </Grid>
                <Grid container spacing={2}>
                    <DataGrid
                        rows={importDataList}
                        columns={columns}
                        pageSize={8}
                        loading={isLoading}
                        rowsPerPageOptions={[8]}
                        disableSelectionOnClick
                        style={{ border: 'none', }}
                        sx={{
                            overflow: 'auto',
                            height: '55vh',
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
                            const rowIndex = importDataList.findIndex(row => row.id === params.row.id);
                            // Check if the index is valid
                            if (rowIndex !== -1) {
                                console.log(' ');
                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                            }
                            return ''; // Return default class if index is not found
                        }}
                        rowHeight={40}
                        columnHeaderHeight={40}
                    />

                </Grid>
            </DialogContent>
            <DialogActions>

                {/* <Button
                variant="contained"
                style={{ width: '250px', background: '#002D68', color: 'white' }}
            >
                Import data to database
            </Button> */}

                {/* <Button
                    variant="contained"
                    style={{ width: '300px', background: '#002D68', color: 'white' }}
                    onClick={(e) => {
                        setImportDataList([]);
                    }}
                >
                    Remove erroneous records
                </Button> */}

                {/* <Button
                    variant="contained"
                    style={{ width: '200px', background: '#002D68', color: 'white' }}
                    type="submit"

                >
            
                    Export to excel
                </Button> */}
                <Button
                    variant="contained"
                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                    onClick={(e) => {
                        setItemInfoOpen(false);
                        setTotalNumber('');
                        setImportDataList('');
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

        </Dialog>
    )
}

export default PartMinMaxModule