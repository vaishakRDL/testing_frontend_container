import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from "xlsx";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { GetSFGVerificationInnerData, UpdateSFGVerificationInnerData, GetSFGFilterLocation, MoveToFg, UploadOpeningStock, SubmitOpeningStock } from '../../ApiService/LoginPageService';
import '../../App.css';
import LinearProgress from '@mui/material/LinearProgress';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel, Card,
    Switch,
    CircularProgress,
} from '@mui/material';
import { OpenBalanceTemplate } from '../../ApiService/DownloadCsvReportsService';
import { useModuleLocks } from '../context/ModuleLockContext';
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const OpeningBalanceUpload = ({
}) => {

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Opening Balance")?.lockStatus === "locked";

    const [uploadLoader, setUploadLoader] = useState(false);
    const [openingBalanceList, setOpeningBalanceList] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };

        // Add event listener to update height on resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const columns = [
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Code</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'qty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Quantity</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'grn',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>GRN</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'errorRemark',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Error Remarks</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        }
    ];

    ////handleTemplateDownload////
    const handleTemplateDownload = () => {
        OpenBalanceTemplate(handleDownloadSuccess, handleDownloadException)
    };

    const handleDownloadSuccess = () => {
        setNotification({
            status: true,
            type: 'success',
            message: 'Download Success',
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const handleDownloadException = () => {
        setNotification({
            status: true,
            type: 'error',
            message: 'Download Failed',
        });
        setTimeout(() => {

        }, 2000);
    }

    // XL UPLOAD HANDLER
    const handleItemImportSucess = (dataObject) => {
        setOpeningBalanceList(dataObject?.items || []);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setUploadLoader(false);
        }, 2000);
    }

    const handleItemImportException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setUploadLoader(false);
        }, 2000);
    }

    // SUBMIT
    const handleSubmit = () => {
        setLoading(true);
        SubmitOpeningStock({ items: openingBalanceList }, handleSubmitSuccess, handleSubmitException)
    }

    const handleSubmitSuccess = (dataObject) => {
        setUploadLoader(false);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setOpeningBalanceList([]);
            setLoading(false);
        }, 2000);
    }

    const handleSubmitException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    // const handleErrorRemovness = () => {
    //     // Filter rows with errors and those without errors
    //     const errorRows = openingBalanceList.filter((row) => row.errorRemark === 'Invalid Item code');
    //     const validRows = openingBalanceList.filter((row) => row.errorRemark !== 'Invalid Item code');

    //     console.log('Error rows:', errorRows); // Debugging
    //     console.log('Valid rows:', validRows); // Debugging

    //     // Download error rows as Excel
    //     if (errorRows.length > 0) {
    //         const worksheet = XLSX.utils.json_to_sheet(errorRows.map(({ id, ...rest }) => rest)); // Exclude 'id' column
    //         const workbook = XLSX.utils.book_new();
    //         XLSX.utils.book_append_sheet(workbook, worksheet, 'Errors');
    //         console.log('Workbook created:', workbook); // Debugging
    //         XLSX.writeFile(workbook, 'ERROR_data.xlsx');
    //     } else {
    //         console.warn('No error rows found to download.');
    //     }

    //     // Update the DataGrid to show only valid rows
    //     setOpeningBalanceList(validRows);

    //     console.log('Updated DataGrid rows:', validRows); // Debugging

    //     // Show a success notification
    //     setNotification({
    //         status: true,
    //         type: 'success',
    //         message: 'Error rows removed and downloaded successfully!',
    //     });

    //     setTimeout(() => {
    //         setNotification({
    //             status: false,
    //             type: '',
    //             message: '',
    //         });
    //     }, 2000);
    // };

    const handleErrorRemovness = () => {
        // Filter rows based on the error condition
        const errorRows = openingBalanceList.filter((row) => row.errorRemark === 'Invalid Item code');
        const validRows = openingBalanceList.filter((row) => row.errorRemark !== 'Invalid Item code');

        console.log('Error rows:', errorRows); // Debugging
        console.log('Valid rows:', validRows); // Debugging

        // Check if there are any error rows
        if (errorRows.length > 0) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Error Rows');

            const excludedKeys = ['id', 'rowNo', 'itemId'];


            // Dynamically define columns based on the first error row's keys
            // const keys = Object.keys(errorRows[0]);
            const keys = Object.keys(errorRows[0]).filter((key) => !excludedKeys.includes(key));
            worksheet.columns = keys.map((key) => ({
                header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter for headers
                key,
                width: 20, // Adjust width as necessary
            }));

            // Apply bold styling to headers
            worksheet.getRow(1).eachCell((cell) => {
                cell.font = { bold: true };
            });

            // Add error rows to the worksheet
            errorRows.forEach((row) => {
                worksheet.addRow(row);
            });

            // Save the Excel file
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer]), 'ErrorRows.xlsx');
            }).catch((err) => {
                console.error('Error writing buffer:', err); // Debugging any potential errors with the buffer
            });
        } else {
            console.warn('No error rows found to download.');
        }

        // Update the DataGrid with valid rows
        setOpeningBalanceList(validRows);

        console.log('Updated DataGrid rows:', validRows); // Debugging

        // Show a success notification
        setNotification({
            status: true,
            type: 'success',
            message: 'Error rows removed and downloaded successfully!',
        });

        setTimeout(() => {
            setNotification({
                status: false,
                type: '',
                message: '',
            });
        }, 2000);
    };


    return (
        <div style={{ margin: '10px' }}>
            <Typography style={{ fontWeight: 'bold', textAlign: 'left', fontSize: '18px', marginBottom: '10px' }}>Opening Balance</Typography>
            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '2px', borderRadius: '10px', width: '100%', height: '100%' }}>
                {uploadLoader === true ?
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                    :
                    null
                }
                <CardContent>
                    <div style={{ width: '100%', textAlign: 'right', marginBottom: '15px' }}>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: isModuleLocked ? "gray" : '#002d68', marginRight: '10px' }}
                            onClick={handleTemplateDownload}
                            disabled={isModuleLocked}
                        >Template</Button>
                        <Button
                            variant="contained"
                            component="label"
                            htmlFor="upload-photo"
                            sx={{ backgroundColor: isModuleLocked ? "gray" : "#002D68", height: '35px' }}
                            disabled={uploadLoader === true || isModuleLocked}
                        >
                            Choose File
                        </Button>
                        <input
                            id="upload-photo"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                        if (reader.readyState === 2) {
                                            setUploadLoader(true);
                                            UploadOpeningStock(
                                                {
                                                    file: reader.result,
                                                },
                                                handleItemImportSucess,
                                                handleItemImportException
                                            );
                                            e.target.value = null; // Reset the input's value after upload
                                        }
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                }
                            }}
                        />

                    </div>
                    <DataGrid
                        rows={openingBalanceList}
                        columns={columns}
                        pageSize={8}
                        rowsPerPageOptions={[8]}
                        disableSelectionOnClick
                        style={{ border: 'none' }}
                        sx={{
                            overflow: 'auto',
                            height: screenHeight - 335,
                            width: '100%',
                            "& .error-row": {
                                backgroundColor: "rgba(255, 0, 0, 0.1)",
                                color: "red",
                            },
                            '& .super-app-theme--header': {
                                WebkitTextStrokeWidth: '0.6px',
                                backgroundColor: '#93bce6',
                                color: '#1c1919'
                            },
                            '& .MuiDataGrid-cell': {
                                border: '1px solid #969696',
                            },
                            '& .MuiDataGrid-columnHeader': {
                                border: '1px solid #969696',
                            },
                        }}
                        // getRowClassName={(params) => {
                        //     const rowIndex = openingBalanceList.findIndex(row => row.id === params.row.id);
                        //     if (rowIndex !== -1) {
                        //         return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                        //     }
                        //     return '';
                        // }}
                        getRowClassName={(params) => {
                            if (params.row.errorRemark) {
                                return 'error-row'; // Highlight rows with errorRemark
                            }
                            const rowIndex = openingBalanceList.findIndex(row => row.id === params.row.id);
                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                        }}
                        rowHeight={40}
                        columnHeaderHeight={40}
                    />

                    <div style={{ width: '100%', textAlign: 'right', }}>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: isModuleLocked ? "gray" : '#002d68', marginRight: '10px' }}
                            onClick={handleSubmit}
                            disabled={loading || isModuleLocked}
                        >
                            {/* Upload File */}
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : 'Upload File'}
                        </Button>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: isModuleLocked ? "gray" : '#002d68' }}
                            onClick={handleErrorRemovness}
                            disabled={isModuleLocked}
                        >Remove Errorneous</Button>
                    </div>


                </CardContent>
            </Card>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div>
    )
}

export default OpeningBalanceUpload;