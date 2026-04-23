import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment, CardActionArea,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { BulkItemDownloadExlExport, ItemDownloadExlExport } from '../../ApiService/DownloadCsvReportsService';
import { DataGrid } from '@mui/x-data-grid';
import { BulkItemImportExcel, BulkItemStore, ItemImportExcel, ItemStoreBulk } from '../../ApiService/LoginPageService';
import ApplicationStore from '../../Utility/localStorageUtil';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


const DocumentFinancialYearModule = ({
    open, setOpen, setRefreshData
}) => {

    const [dataReviewSet, setDataReviewSet] = useState([]);
    const [bcColor, setBcColor] = useState('#9c9c9c');
    const [cColor, setCcolor] = useState('#000000');
    const [isError, setIsError] = useState(true);
    const [errorOpen, setErrorOpen] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasErrors, setHasErrors] = useState(true); // New state for tracking errors
    const [removedErrorRows, setRemovedErrorRows] = useState([]); // State to store removed error rows

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const [file, setFile] = useState('');


    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    useEffect(() => {
        // const  ErrorArrayList = ApplicationStore().getStorage2('ErrorArrayList');
        if (!isError) {
            setBcColor('#002D68');
            setCcolor('white');
        } else if (isError) {
            setBcColor('#9c9c9c');
            setCcolor('#000000');
        }

    }, [isError]);

    const [onLoader, setOnLoader] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true)
        BulkItemStore({
            items: dataReviewSet
        }, handleItemStoreBulkSuccess, handleItemStoreBulkException);
    }

    const handleItemStoreBulkSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject?.message,
        });
        setTimeout(() => {
            handleClose();
            setIsLoading(false)
            setDataReviewSet([]);
        }, 3000);
    }

    const handleItemStoreBulkException = (errorObject, errorMessage) => {
        setIsLoading(false)
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    const DownloadItemDuplicateTemplateSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }

    const DownloadItemDuplicateTemplateException = () => {

    }

    const handleItemDownloadExlExportSucess = () => {

    }

    const handleItemDownloadExlExportException = () => {

    }

    const columns = [
        {
            field: 'id',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                   SI No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 120,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'copyFromItem',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  From Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 120, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'copyToItem',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    To Date
                </span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 120, flex: 1, align: 'center', headerAlign: 'center'
        },
         {
            field: 'error',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                   Active
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },

    ];

    const handlItemImportExcelSucees = (dataObject) => {
        setIsLoading(false)
        if (dataObject?.success === false) {
            ApplicationStore().setStorage2("ErrorArrayList", dataObject?.errorArray);
            setNotification({
                status: true,
                type: 'error',
                message: dataObject?.message,
            });
            setTimeout(() => {
                setIsError(false);
            }, 3000);
        } else {
            const data = dataObject?.data || [];

            // Check if any item has non-empty errorMessages
            const hasErrorMessages = data.some(item => item.error && item.error.length > 0);
            setHasErrors(hasErrorMessages);
            setDataReviewSet(data);
            setTotalCount(data.length);
        }

        setNotification({
            status: true,
            type: dataObject?.success === false ? 'error' : 'success',
            message: dataObject?.message,
        });

        setTimeout(() => {
            handleClose();
        }, 3000);

        setIsLoading(false);
    };

    const handleItemImportExcelException = (errorObject, errorMessage) => {
        setIsLoading(false)
        console.log('errorObject===>', errorMessage)
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setIsLoading(false);
        setTimeout(() => {
            // handleClose();
            // setIsError(false);
        }, 3000);
    }

    //NEW XL UPLOAD CODE
    const handleFileChange = (e) => {
        setIsLoading(true)
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setFile(reader.result);
                    setIsLoading(true);
                    BulkItemImportExcel(
                        { file: reader.result },
                        handlItemImportExcelSucees,
                        handleItemImportExcelException
                    );
                    // Clear input to allow re-uploading the same file
                    e.target.value = null;
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveErrorRows = () => {
        // Filter rows with error messages
        const errors = dataReviewSet.filter(row => row.error && row.error.length > 0);

        // Filter rows without error messages
        const validRows = dataReviewSet.filter(row => !row.error || row.error.length === 0);

        // Update states
        setRemovedErrorRows(errors);     // Store the removed error rows
        setDataReviewSet(validRows);     // Update the main data set
        handleDownload(errors);
    };

    // DOWNLOAD TABLE DATA IN XL
    const arrayToWorksheet = (array) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Error Report');

        if (array.length === 0) return workbook;

        // Define columns dynamically based on keys
        const columns = Object.keys(array[0]).map((key) => ({
            header: key.toUpperCase(), // Convert headers to uppercase
            key: key,
            width: 20,
        }));

        worksheet.columns = columns;

        // Add data rows
        array.forEach((row) => worksheet.addRow(row));

        // Style the header row (bold + center aligned)
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        // Center align all data rows
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        });

        return workbook;
    };

    const downloadExcelFile = async (workbook, filename) => {
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), filename);
    };

    const handleDownload = (errors) => {
        // Flatten data to match the frontend table structure
        const formattedData = errors.map((data) => ({
            "Copy To Item": data?.copyToItem,
            "Copy Form Item": data?.copyFromItem,
          
        }))

        const workbook = arrayToWorksheet(formattedData);
        downloadExcelFile(workbook, 'Error Report.xlsx');
        setHasErrors(false);
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '50%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
            Select Financial Year
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                       
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <DataGrid
                                rows={dataReviewSet}
                                columns={columns}
                                pageSize={8}
                                loading={isLoading}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ border: 'none' }}
                                sx={{
                                    overflow: 'auto',
                                    height: '55vh',
                                    width: '100%',
                                    '& .super-app-theme--header': {
                                        WebkitTextStrokeWidth: '0.6px',
                                        backgroundColor: '#93bce6',
                                        color: '#1c1919',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        border: '1px solid #969696',
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        border: '1px solid #969696',
                                    },
                                    '& .Mui-errorRow': {
                                        backgroundColor: '#f8d7da', // Light red background for error rows
                                        color: '#721c24', // Darker text for contrast
                                    },
                                    '& .Mui-evenRow': {
                                        backgroundColor: '#f5f5f5', // Optional: Alternate row color
                                    },
                                    '& .Mui-oddRow': {
                                        backgroundColor: '#ffffff',
                                    },
                                }}
                                getRowClassName={(params) => {
                                    const row = dataReviewSet.find(row => row.id === params.row.id);
                                    if (row?.error && row.error.length > 0) {
                                        return 'Mui-errorRow';
                                    }

                                    // Apply even/odd row styling as default
                                    const rowIndex = dataReviewSet.findIndex(row => row.id === params.row.id);
                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                }}
                                rowHeight={40}
                                columnHeaderHeight={40}
                            />

                        </Grid>


                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{
                            width: '290px',
                            background: hasErrors ? '#002D68' : bcColor,
                            color: hasErrors ? '#ffffff' : cColor,
                        }}
                        // disabled={!hasErrors}
                        // onClick={handleRemoveErrorRows} // Attach the click handler
                    >
                       Set As Active
                    </Button>

                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setRefreshData((oldValue) => !oldValue);
                            setOpen(false);
                            setOnLoader(false);
                            setDataReviewSet([]);
                            setTotalCount(0);
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

            </form>
        </Dialog>
    )
}

export default DocumentFinancialYearModule