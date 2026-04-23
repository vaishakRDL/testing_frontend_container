import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment, CardActionArea,
    CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { ItemDownloadExlExport } from '../../../ApiService/DownloadCsvReportsService';
import { DataGrid } from '@mui/x-data-grid';
import { ItemImportExcel, ItemStoreBulk } from '../../../ApiService/LoginPageService';
import ApplicationStore from '../../../Utility/localStorageUtil';
import RemoveErroneous from './RemoveErroneous';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const BulkCreation = ({
    open, setOpen, setRefreshData
}) => {

    const [dataReviewSet, setDataReviewSet] = useState([]);
    const [bcColor, setBcColor] = useState('#9c9c9c');
    const [cColor, setCcolor] = useState('#000000');
    const [isError, setIsError] = useState(true);
    const [errorOpen, setErrorOpen] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasErrors, setHasErrors] = useState(false); // New state for tracking errors
    const [removedErrorRows, setRemovedErrorRows] = useState([]); // State to store removed error rows
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        ItemStoreBulk({
            items: dataReviewSet,
            type: 'Insert'
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
            setLoading(false);
        }, 3000);
    }

    const handleItemStoreBulkException = (errorObject, errorMessage) => {
        setIsLoading(false)
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setLoading(false);
        }, 3000);
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
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Code
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 120,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
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
            minWidth: 120, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemGroupName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Group
                </span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 120, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'inActive',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    In Active
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 120,
            flex: 1,
            align: 'center', headerAlign: 'center'
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
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'stdRate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Std Rate
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'minStockLvl',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Min Stock Lvl
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'maxLvl',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Max Lvl
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'shelfLifeItem',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Shelf LifeItem
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'hsnCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    HSN Code

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'critical',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Critical
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'category',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Category

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'mainLocation',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Main Location
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'material',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Material

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'materialThickness',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Material Thickness

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'rmWidth',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    RM Width

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'rmLength',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    RM Length

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'grossWeight',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Gross Weight

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'netWeight',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Net Weight
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'scrapWeight',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Scrap Weight
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'productFinish',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Product Finish
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'coatingArea',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Coating Area
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'productFamily',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Product Family

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'fimId',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    FIM Id

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'rmItemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    RM Item Code
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'reorder',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Reorder
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'rol',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    ROL

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'roq',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    ROQ

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'nonStockable',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Non Stockable
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'underLedger',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Under Ledger
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'gstCategory',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    GST Category
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'stockControl',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Stock Control

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'jcPart',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    JC Part
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'errorMessages',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Error Message
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },

    ];

    // const handlItemImportExcelSucees = (dataObject) => {
    //     if (dataObject?.success === false) {
    //         ApplicationStore().setStorage2("ErrorArrayList", dataObject?.errorArray);
    //         setNotification({
    //             status: true,
    //             type: 'error',
    //             message: dataObject?.message,
    //         });
    //         setTimeout(() => {
    //             // handleClose();
    //             setIsError(false);
    //         }, 3000);

    //     } else {

    //         setDataReviewSet(dataObject?.data || []);
    //         setTotalCount(dataObject?.data?.length || 0);
    //     }

    //     setNotification({
    //         status: true,
    //         type: 'error',
    //         message: dataObject?.message,
    //     });
    //     setTimeout(() => {
    //         handleClose();
    //     }, 3000);
    //     setIsLoading(false);
    // }

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
            const hasErrorMessages = data.some(item => item.errorMessages && item.errorMessages.length > 0);
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
                    ItemImportExcel(
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
        const errors = dataReviewSet.filter(row => row.errorMessages && row.errorMessages.length > 0);

        // Filter rows without error messages
        const validRows = dataReviewSet.filter(row => !row.errorMessages || row.errorMessages.length === 0);

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
            "Item Code": data?.itemCode,
            "Item Name": data?.itemName,
            "Item Group": data?.itemGroupName,
            "In Active": data?.inActive,
            "UOM": data?.uomName,
            "Std Rate": data?.stdRate,
            "Min Stock Lvl": data?.minStockLvl,
            "Min Lvl": data?.maxLvl,
            "Shelf Life Item": data?.shelfLifeItem,
            "HSN Code": data?.hsnCode,
            "Critical": data?.critical,
            "Category": data?.category,
            "Main Location": data?.mainLocationName,
            "Material": data?.material,
            "Material Thickness": data?.materialThickness,
            "RM Width": data?.rmWidth,
            "RM Length": data?.rmLength,
            "Gross Weight": data?.grossWeight,
            "Net Weight": data?.netWeight,
            "Scrap Weight": data?.scrapWeight,
            "Product Finish": data?.productFinishName,
            "Coating Area": data?.coatingArea,
            "Product Family": data?.productFamilyName,
            "FIM Id": data?.fimId,
            "RM Item Code": data?.rmItemCode,
            "Re Order": data?.reorder,
            "ROL": data?.rol,
            "ROQ": data?.roq,
            "Non Stockable": data?.nonStockable,
            "Under Ledger": data?.underLedger,
            "GST Category": data?.gstCategory,
            "Stock Control": data?.stockControl,
            "JC Part": data?.jcPart,
            "Error Message": data?.errorMessages,
        }))

        const workbook = arrayToWorksheet(formattedData);
        downloadExcelFile(workbook, 'Error Report.xlsx');
        setHasErrors(false);
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Import Store Item
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            {/* <TextField
                                fullWidth

                                style={{
                                    // margin: '10px'
                                }}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            if (reader.readyState === 2) {
                                                setFile(reader.result);
                                                setIsLoading(true);
                                                ItemImportExcel({
                                                    file: reader.result
                                                }, handlItemImportExcelSucees, handleItemImportExcelException);
                                            }
                                        };
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }}
                                InputLabelProps={{ shrink: true }}
                                type="file" /> */}
                            <Button disabled={isLoading === true} variant="contained" component="label" style={{ backgroundColor: '#002d68', height: '40px', width: '300px', borderRadius: '20px' }}>
                                {/* Load From Excel */}
                                {isLoading ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'Load From Excel'}
                                <input
                                    type="file"
                                    accept=".xls,.xlsx"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={2} lg={3} xl={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#002D68',
                                    height: '40px',
                                    width: '400px',
                                    borderRadius: '20px',

                                }}
                                type='submit'
                            >
                                {/* Load To Database */}
                                {loading ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'Load To Database'}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={2} lg={3} xl={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Button variant="contained"
                                onClick={() => {
                                    ItemDownloadExlExport(handleItemDownloadExlExportSucess, handleItemDownloadExlExportException);
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
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
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
                                value={totalCount}
                                placeholder="Tatal Number of Records Loaded"
                                InputLabelProps={{
                                    shrink: true, style: { fontWeight: 'bold' }
                                }}
                                disabled={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>

                            {/* <DataGrid
                                rows={dataReviewSet}
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
                                    const rowIndex = dataReviewSet.findIndex(row => row.id === params.row.id);
                                    // Check if the index is valid
                                    if (rowIndex !== -1) {
                                        console.log(' ');
                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    }
                                    return ''; // Return default class if index is not found
                                }}
                                rowHeight={40}
                                columnHeaderHeight={40}
                            /> */}
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
                                    if (row?.errorMessages && row.errorMessages.length > 0) {
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

                    {/* <Button
                        variant="contained"
                        style={{ width: '290px', background: hasErrors ? '#002D68' : bcColor, color: hasErrors ? '#ffffff' : cColor }}
                        disabled={hasErrors ? false : true}
                        onClick={() => setErrorOpen(true)}
                    >
                        Remove erroneous records
                    </Button> */}

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


                    {/* <LoadingButton
                        variant="contained"
                        loading={onLoader}
                        style={{ width: '200px', background: '#002D68', }}
                       
                    >
                        Bulk Creation
                    </LoadingButton> */}

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

                <RemoveErroneous
                    open={errorOpen}
                    setOpen={setErrorOpen}
                    setIsError={setIsError}
                />

            </form>
        </Dialog>
    )
}

export default BulkCreation