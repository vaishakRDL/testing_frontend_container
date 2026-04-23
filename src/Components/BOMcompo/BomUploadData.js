import { Button, Dialog, DialogActions, CircularProgress, DialogContent, DialogTitle, FormControlLabel, Grid, TextField, Checkbox, Typography } from '@mui/material'

import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { BeareromExlImport, BomDelete, BomFetchId, BomImportStroreService } from '../../ApiService/LoginPageService';
import { BomExlTemplate } from '../../ApiService/DownloadCsvReportsService';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const BomUploadData = ({ open, setOpen, isAddButton, currencyData, setRefreshData, }) => {
    const [file, setFile] = useState(null);
    const [loadview, setLoadview] = useState(false);
    const [hasErrors, setHasErrors] = useState(false); // New state for tracking errors
    const [isError, setIsError] = useState(true);
    const [fileData, setFileData] = useState([]);
    const [itemCount, setItemCount] = useState('0');
    const [isLoading, setIsLoading] = useState(false);
    const [bomPartId, setBomPartId] = useState('');
    const [excelDataList, setExcelDataList] = useState([]);
    const [mainItemId, setMainItemId] = useState('');
    const [mainItemCode, setMainItemCode] = useState('');
    const [errorModal, setErrorModal] = useState(false);
    const [errorData, setErrorData] = useState([]);
    const [bcColor, setBcColor] = useState('#9c9c9c');
    const [cColor, setCcolor] = useState('#000000');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const [fileName, setFileName] = useState('');
    // const handleFileChange = (e) => {
    //     if (e.target.files && e.target.files.length > 0) {
    //         const selectedFile = e.target.files[0];
    //         setFileName(selectedFile.name);

    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             if (reader.readyState === 2) {
    //                 setFile(reader.result);

    //                 BeareromExlImport({
    //                     file:reader.result
    //                 }, handleFileSucess, handleFileException);
    //             }
    //         };
    //         reader.readAsDataURL(selectedFile);
    //     }
    // };
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

    const handleFileSucess = (dataObject) => {
        setExcelDataList(dataObject.data || []);
        setMainItemId(dataObject?.mainItemId || '');
        setMainItemCode(dataObject?.mainItemCode || '');
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

            // Check if any item has non-empty errorMessage
            const haserrorMessage = data.some(item => item.errorMessage && item.errorMessage.length > 0);
            setHasErrors(haserrorMessage);

            setExcelDataList(data);
        }
    }

    const handleBomFetchIdSuccess = (dataObject) => {
        setFileData(dataObject?.data || []);
        setItemCount(dataObject?.itemCount || '');
        setIsLoading(false);
    }

    const ClearData = () => {
        setFileData([]);
        setItemCount('0');
        setFileName('');
        setExcelDataList([]);
    }

    const handleBomFetchIdException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
    }

    const handleFileException = (errorObject, errorMessage) => {
        setErrorData(errorObject?.errors || []);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
    }

    const columns = [
        {
            field: 'mainItemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    BOM Item Code
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
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
            field: 'uomName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    UOM
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    QTY
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'jcPart',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    JC Part
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'errorMessage',
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
    const errorColumns = [
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
            field: 'message',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Message
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
    ];

    useEffect(() => {

    }, [currencyData]);

    const handleSubmit = (e) => {
        e.preventDefault();

    };

    const validateForNullValue = (value, type) => {

    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleBomExlTemplateSuccess = () => {

    }

    const BomExlTemplateException = () => {

    }

    const handleBomDeleteSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);

    }

    const handleBomDeleteException = () => {

    }

    const handleBomImportServiceSucess = (dataObject) => {
        setLoadview(false)
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        // setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            setIsLoading(false);
            handleClose();
            setExcelDataList([]);
            setOpen(false);
        }, 3000);
    }

    const handleBomImportServiceException = (errorObject, errorMessage) => {
        setLoadview(false)
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
            setExcelDataList([]);
        }, 3000);
    }

    // bomPartId
    const handleRemoveErrorRows = () => {
        // Filter rows with error messages
        const errors = excelDataList.filter(row => row.errorMessage && row.errorMessage.length > 0);

        // Filter rows without error messages
        const validRows = excelDataList.filter(row => !row.errorMessage || row.errorMessage.length === 0);

        // Update states
        // setRemovedErrorRows(errors);     // Store the removed error rows
        setExcelDataList(validRows);     // Update the main data set
        handleDownload(errors);
    };
    const handleDownload = (errors) => {
        const formattedData = errors.map((data, index) => ({
            // "S.No": index + 1,
            "BOM Item Code": data?.mainItemCode,
            "Item Code": data?.itemCode,
            "UOM": data?.uomName,
            "QTY": data?.qty,
            "JC Part": data?.jcPart,
            "Error Messages": data?.errorMessage
        }));

        const workbook = arrayToWorksheet(formattedData);
        downloadExcelFile(workbook, 'Error BOM.xlsx');
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


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);

            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    // Call your API here
                    BeareromExlImport(
                        { file: reader.result },
                        handleFileSucess,
                        handleFileException
                    );
                }
            };
            reader.readAsDataURL(file);
        }

        // Reset file input so same file can be selected again
        event.target.value = '';
    };

    const exportGridToExcel = async () => {
        if (!excelDataList || excelDataList.length === 0) {
            setNotification({
                status: true,
                type: 'error',
                message: 'No data available to export',
            });
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('BOM Data');

        // ✅ Define columns (same order as DataGrid)
        const columns = [
            { header: 'BOM Item Code', key: 'mainItemCode' },
            { header: 'Item Code', key: 'itemCode' },
            { header: 'UOM', key: 'uomName' },
            { header: 'QTY', key: 'qty' },
            { header: 'JC Part', key: 'jcPart' },
            { header: 'Error Messages', key: 'errorMessage' },
        ];

        worksheet.columns = columns.map(col => ({
            ...col,
            width: 20,
        }));

        // ✅ Add rows
        excelDataList.forEach(row => {
            worksheet.addRow({
                mainItemCode: row.mainItemCode || '',
                itemCode: row.itemCode || '',
                uomName: row.uomName || '',
                qty: row.qty || '',
                jcPart: row.jcPart || '',
                errorMessage: row.errorMessage || '',
            });
        });

        // ✅ Header styling
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // ✅ Body styling
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;

            row.eachCell(cell => {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });

        // ✅ Generate & download
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(
            new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }),
            `BOM_Data_${new Date().toISOString().slice(0, 10)}.xlsx`
        );
    };

    return (
        <>
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '100%' } }}
                maxWidth="xl"
                open={open}
            >
                <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                    Import BOM Item Data
                </DialogTitle>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>


                                {/* <input
                                    id="upload-photo"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            const selectedFile = e.target.files[0];
                                            setFileName(selectedFile.name);
                                            const reader = new FileReader();
                                            reader.onload = () => {
                                                if (reader.readyState === 2) {
                                                    setFile(reader.result);
                                                    BeareromExlImport({
                                                        file: reader.result
                                                    }, handleFileSucess, handleFileException);
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
                                    sx={{ backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
                                >
                                    ....
                                </Button> */}
                                <TextField
                                    id="outlined-basic"
                                    type="file"
                                    accept=".xls, .xlsx"
                                    onChange={handleFileChange}
                                    style={{ marginRight: '15px' }}
                                />

                            </Grid>
                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Button variant="contained" sx={{ backgroundColor: '#002D68', height: '40px', width: '200px', borderRadius: '20px' }}
                                    // disabled={loadview}
                                    disabled={
                                        loadview || excelDataList.some(row => row.errorMessage && row.errorMessage.trim() !== '')
                                    }
                                    onClick={() => {
                                        setIsLoading(true);
                                        setLoadview(true)
                                        BomImportStroreService({
                                            data: excelDataList,
                                        }, handleBomImportServiceSucess, handleBomImportServiceException);
                                    }}
                                >
                                    {loadview ? (
                                        <CircularProgress size={24} style={{ color: 'white' }} />
                                    ) : (
                                        ' Load to Database'
                                    )}
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Button variant="contained"
                                    onClick={() => {
                                        BomExlTemplate(handleBomExlTemplateSuccess, BomExlTemplateException);
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
                            {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography>
                                    Please Select a Excel file Containing Item Details
                                </Typography>
                            </Grid> */}
                            {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <TextField
                                    id="filled-basic"
                                    label="Tatal Number of Records Loaded"
                                    variant="filled"
                                    sx={{ mb: 1 }}
                                    margin="dense"
                                    fullWidth
                                    required
                                    value={itemCount}
                                    placeholder="Tatal Number of Records Loaded"
                                    InputLabelProps={{
                                        shrink: true, style: { fontWeight: 'bold' }
                                    }}
                                    disabled={true}
                                />
                            </Grid> */}

                        </Grid>
                        <Grid container spacing={2} style={{ marginTop: '20px' }}>
                            <DataGrid
                                rows={excelDataList}
                                columns={columns}
                                pageSize={8}
                                loading={isLoading}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ border: 'none' }}
                                sx={{
                                    overflow: 'auto',
                                    height: '50vh',
                                    // minHeight: '500px',
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
                                    const row = excelDataList.find(row => row.id === params.row.id);
                                    if (row?.errorMessage && row.errorMessage.length > 0) {
                                        return 'Mui-errorRow';
                                    }

                                    // Apply even/odd row styling as default
                                    const rowIndex = excelDataList.findIndex(row => row.id === params.row.id);
                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
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
                                setErrorModal(true);
                            }}
                        >
                            Remove erroneous records
                        </Button> */}
                        <Button
                            variant="contained"
                            style={{
                                width: '300px',
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
                            style={{ width: '200px', background: '#002D68', color: 'white' }}

                            type="submit"

                            onClick={exportGridToExcel}
                        >
                            {/* {isAddButton ? 'Add' : 'Update'} */}
                            Export to excel
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setOpen(false);
                                ClearData();
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
                <NotificationBar
                    handleClose={handleClose}
                    notificationContent={openNotification.message}
                    openNotification={openNotification.status}
                    type={openNotification.type}
                />

            </Dialog>


        </>
    )
}

export default BomUploadData