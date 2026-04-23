import {
    Button, Box, Dialog, Tooltip, DialogContent, CircularProgress, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DispatchExlimport, PcnImport, PcnStoreApi, PcnUniqueNo, } from '../../ApiService/LoginPageService';
import { DataGrid } from '@mui/x-data-grid';
import AuthoriseDocumentsModule from '../PurchaseOrderAuthorization/AuthoriseDocuments/AuthoriseDocumentsModule';
import { render } from '@testing-library/react';
import { DownloadPriceChangeNoteTemplate } from '../../ApiService/DownloadCsvReportsService';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


const PriceChangeModule = ({ open, setOpen, setRefreshData, isAddButton }) => {
    const [hasErrors, setHasErrors] = useState(false); // New state for tracking errors
    const [removedErrorRows, setRemovedErrorRows] = useState([]); // State to store removed error rows
    const [date, setDate] = useState('');
    const [file, setFile] = useState('');
    const [fileData, setFileData] = useState([]);
    const [viewData, setViewData] = useState([]);
    const [authorization, setAuthorization] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [bcColor, setBcColor] = useState('#9c9c9c');
    const [cColor, setCcolor] = useState('#000000');
    const [pcnNo, setPcnNo] = useState('');
    const [effectiveFromDt, seteffectiveFromDt] = useState('');
    const [refNo, setRefno] = useState('');
    const [pcnItems, setPcnItems] = useState('');
    const [pcnItems2, setPcnItems2] = useState([]);
    const [isError, setIsError] = useState(true);
    const [importloading, setimportloading] = useState(false);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        if (open) {
            PcnUniqueNo(handlePcnUniqueNoSuccess, handlePcnUniqueNoException);
        }
    }, [open]);

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

    const handlePcnUniqueNoSuccess = (dataObject) => {
        setPcnNo(dataObject?.data?.pcnNo || '');
        setPcnItems(dataObject?.data?.docNo || '');
    }

    const handlePcnUniqueNoException = () => {

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!authorization) {
            PcnStoreApi({
                pcnNo: pcnNo,
                effectiveFromDt: effectiveFromDt,
                refNo: refNo,
                pcnItems: viewData,
                docNo: pcnItems
            }, handlePcnStoreApiSuccess, handlePcnStoreApiException);
        }

    }

    const handlePcnStoreApiSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setViewData([]);

        setTimeout(() => {
            handleClose();
            setOpen(false);
        }, 3000);
    }

    const handlePcnStoreApiException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }

    const handleDispatchExlimportSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setOpen(false);
            setDate('');
            setRefreshData((oldvalue) => !oldvalue);
        }, 3000);
    }

    const handleDispatchExlimportException = () => {

    }

    const handleSobAddSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setTimeout(() => {
            handleClose();
            setOpen(false);

        }, 3000);
    }

    const handleSobAddException = () => {

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
            field: 'id',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },

        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Part No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <span style={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: params?.row?.color, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {params.value}
                </span>
            )
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Part Name
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                UOM
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'lastEffectivefromDt',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Last Eff From Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'existingRate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Existing Rate
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'existingLcr',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Existing LCR
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'existingFreight',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Existing Freight
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'existingLanding',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Existing landing
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'basicRate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Basic Rate
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'lcr',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    LCR
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'freight',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Freight
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'landing',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Landing
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'diffrence',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Difference
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'errorMessages',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Error Messages
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
    ];


    const handlePcnImportSuccess = (dataObject) => {
        setimportloading(false);

        setViewData(dataObject?.data || []);
        // setPcnItems(dataObject?.data || []);
        setIsLoading(false);
        if (dataObject?.success === false) {
            // ApplicationStore().setStorage2("ErrorArrayList", dataObject?.errorArray);
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
            const hasErrorMessages = data.some(item => item.errorMessages && item.errorMessages.length > 0);
            setHasErrors(hasErrorMessages);

            setViewData(data);
        }
    }

    const handlePcnImportException = () => {
        setimportloading(false);

    }

    const handleTemDownSuccess = () => {
        setNotification({
            status: true,
            type: 'success',
            message: 'Template Download Success',
        });

        setTimeout(() => {
            handleClose();
        }, 3000);
    }
    const handleTempDownException = () => {
        setNotification({
            status: true,
            type: 'error',
            message: 'Template Download Failed',
        });
    };

    const handleRemoveErrorRows = () => {
        // Filter rows with error messages
        const errors = viewData.filter(row => row.errorMessages && row.errorMessages.length > 0);

        // Filter rows without error messages
        const validRows = viewData.filter(row => !row.errorMessages || row.errorMessages.length === 0);

        // Update states
        setRemovedErrorRows(errors);     // Store the removed error rows
        setViewData(validRows);     // Update the main data set
        handleDownload(errors);
    };

    const handleDownload = (errors) => {
        const formattedData = errors.map((data, index) => ({
            "S.No": index + 1,
            "Part No": data?.itemCode,
            "Part Name": data?.itemName,
            "UOM": data?.uom,
            "Last Eff From Date": data?.lastEffectivefromDt,
            "Existing Rate": data?.existingRate,
            "Existing LCR": data?.existingLcr,
            "Existing Freight": data?.existingFreight,
            "Existing Landing": data?.existingLanding,
            "Basic Rate": data?.basicRate,
            "LCR": data?.lcr,
            "Freight": data?.freight,
            "Landing": data?.landing,
            "Difference": data?.diffrence,
            "Error Message": data?.errorMessages
        }));

        const workbook = arrayToWorksheet(formattedData);
        downloadExcelFile(workbook, 'Error Report.xlsx');
        setHasErrors(false);
    };

    const downloadExcelFile = async (workbook, filename) => {
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), filename);
    };
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
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Price Change Add' : 'Price Change Edit'}

            </DialogTitle>
            <form onSubmit={handleSubmit}>
                {
                    !authorization ? (
                        <DialogContent >
                            <Grid container spacing={2}>


                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <TextField
                                        id="filled-basic"
                                        // label="Date"
                                        variant="filled"
                                        sx={{ mb: 1 }}
                                        size='small'
                                        // type='date'
                                        fullWidth

                                        value={pcnItems}
                                        // onChange={(e) => {
                                        //     setPcnItems(e.target.value);
                                        // }}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                    // placeholder="Date"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <TextField
                                        id="filled-basic"
                                        label="PCN No"
                                        variant="filled"
                                        sx={{ mb: 1 }}
                                        size='small'
                                        fullWidth
                                        value={pcnNo}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="PCN No"
                                    />
                                </Grid>
                                {/* <Grid item xs={12} sm={12} md={4} lg={2} xl={2}>
                                    <TextField
                                        id="filled-basic"
                                        label="Date"
                                        variant="filled"
                                        sx={{ mb: 1 }}
                                        size='small'
                                        type='date'
                                        fullWidth

                                        value={date}
                                        onChange={(e) => {
                                            setDate(e.target.value);
                                        }}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="Date"
                                    />
                                </Grid> */}

                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <TextField
                                        id="filled-basic"
                                        label="Eff Date From"
                                        variant="filled"
                                        sx={{ mb: 1 }}
                                        size='small'
                                        type='date'
                                        value={effectiveFromDt}
                                        onChange={(e) => {
                                            seteffectiveFromDt(e.target.value);
                                        }}
                                        fullWidth
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        placeholder="Eff Date From"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <TextField
                                        id="filled-basic"
                                        label="Ref No"
                                        variant="filled"
                                        sx={{ mb: 1 }}
                                        size='small'
                                        fullWidth
                                        required

                                        value={refNo}
                                        onChange={(e) => {
                                            setRefno(e.target.value);
                                        }}
                                        placeholder="Ref No"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        columnGap: '10px'
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        sx={{ backgroundColor: '#002D68', height: '40px', width: '200px' }}
                                        onClick={() => DownloadPriceChangeNoteTemplate(handleTemDownSuccess, handleTempDownException)}
                                    >
                                        Template
                                    </Button>

                                    <input
                                        id="upload-photo"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                const selectedFile = e.target.files[0];
                                                setFileData(selectedFile.name);
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    if (reader.readyState === 2) {
                                                        setFile(reader.result);
                                                        setIsLoading(true);
                                                        setimportloading(true);
                                                        PcnImport({
                                                            file: reader.result || []
                                                        }, handlePcnImportSuccess, handlePcnImportException);
                                                    }
                                                };
                                                reader.readAsDataURL(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        component="label"
                                        htmlFor="upload-photo"
                                        sx={{ backgroundColor: '#002D68', height: '40px', width: '200px' }}
                                        disabled={importloading}
                                    >
                                        {importloading ? (
                                            <CircularProgress size={24} style={{ color: 'white' }} />
                                        ) : (
                                            'Import'
                                        )}
                                    </Button>
                                </Grid>
                                {/* <Grid item xs={12} sm={12} md={4} lg={4} xl={4}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        style={{ width: '200px', background: '#002D68', color: 'white' }}
                                        onClick={() => {
                                            setAuthorization(true);
                                        }}
                                    >
                                        Authorization
                                    </Button>
                                </Grid> */}

                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                    <DataGrid
                                        rows={viewData}
                                        columns={columns}
                                        pageSize={8}
                                        loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', fontWeight: 'bold', overflowY: 'scroll' }}
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
                                            const row = viewData.find(row => row.id === params.row.id);
                                            if (row?.errorMessages && row.errorMessages.length > 0) {
                                                return 'Mui-errorRow';
                                            }

                                            // Apply even/odd row styling as default
                                            const rowIndex = viewData.findIndex(row => row.id === params.row.id);
                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />
                                </Grid>

                            </Grid>
                        </DialogContent>
                    ) : (
                        <AuthoriseDocumentsModule />
                    )

                }
                <DialogActions>
                    {
                        authorization ? (
                            <Button
                                variant="contained"
                                style={{ width: '150px', background: '#002D68', color: 'white' }}
                                onClick={() => {
                                    setAuthorization(false);
                                }}
                            >
                                Back
                            </Button>

                        ) : (
                            <></>
                        )
                    }
                    <Button
                        variant="contained"
                        style={{
                            width: '290px',
                            background: hasErrors ? '#002D68' : bcColor,
                            color: hasErrors ? '#ffffff' : cColor,
                        }}
                        disabled={!hasErrors}
                        onClick={handleRemoveErrorRows} // Attach the click handler
                    >
                        Remove erroneous records
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        type="submit" >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);
                            setAuthorization(false);
                            setViewData([]);
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

export default PriceChangeModule
