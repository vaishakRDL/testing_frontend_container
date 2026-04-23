import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment, CardActionArea,
    CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { CutomerDownloadExlExport, ItemDownloadExlExport } from '../../ApiService/DownloadCsvReportsService';
import { DataGrid } from '@mui/x-data-grid';
import { CustomerImportExcel, CustomerStoreBulk, ItemImportExcel, ItemStoreBulk } from '../../ApiService/LoginPageService';
import ApplicationStore from '../../Utility/localStorageUtil';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import RemoveErroneous from '../PartMasterComp/BulkCreation/RemoveErroneous';

const CustomerFileUpload = ({
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
        CustomerStoreBulk({
            customers: dataReviewSet
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
            field: 'cCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Customer Code
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'gstNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    GST No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 120, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'cName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Customer Name
                </span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 150, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'tallyAlias',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Tally Alias
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 120,
            flex: 1,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'cGroupName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Customer Group
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 150, align: 'center', headerAlign: 'center'
        },
        {
            field: 'cAddress1',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Customer Address 1
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 180, align: 'center', headerAlign: 'center'
        },
        {
            field: 'cAddress2',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Customer Address 2
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 180, align: 'center', headerAlign: 'center'
        },
        {
            field: 'cAddress3',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Customer Address 3
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 180, align: 'center', headerAlign: 'center'
        },
        {
            field: 'cAddress4',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Customer Address 4
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 180, align: 'center', headerAlign: 'center'
        },
        {
            field: 'inactiveStatus',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    In Active
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'city',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    City
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'pincode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Pincode
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'state',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    State

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'country',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Country
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'partyNotes',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Party Notes

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'currencyName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Currency
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'panNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Pan No

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'gstInUinId',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    GSTIn / Uin Id

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'bi_phoneNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    bi_phoneNo

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'bi_faxNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    BILL Fax No

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'email',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Email

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'payTerm',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Pay Term
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'noTaxRemark',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    No Tax Remark
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'creditday',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Credit day
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'placeOfSupplyName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Place of Supply
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'tcsCollected',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    TCS Collected

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'SubcharOnTcs',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Surcharges on TCS

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'CessOnTcs',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Cess on TCS
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'singleSaleOrd',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Single Sales Order
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'dcValue',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    DC Value

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'shortClose',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Short close

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'cgst',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    CGST
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'sgst',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    SGST
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'igst',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    IGST
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'utgst',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    UTGST

                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        }, {
            field: 'dcInfoReq',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    DC Info Required in
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
        },
        {
            field: 'maxLineItem',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Max Line Items In
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 120, align: 'center', headerAlign: 'center'
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
                setLoading(false)
            }, 3000);
        } else {
            const data = dataObject?.data || [];

            // Check if any item has non-empty errorMessages
            const hasErrorMessages = data.some(item => item.errorMessages && item.errorMessages.length > 0);
            setHasErrors(hasErrorMessages);

            setDataReviewSet(data);
            setTotalCount(data.length);
            setLoading(false)
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
        setLoading(true)
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setFile(reader.result);
                    setIsLoading(true);
                    CustomerImportExcel(
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
            "Customer Code": data?.cCode,
            "GST NO": data?.gstNo,
            "Customer Name": data?.cName,
            "Tally Alias": data?.tallyAlias,
            "Customer Group": data?.cGroupName,
            "Customer Adress 1": data?.cAddress1,
            "Customer Adress 2": data?.cAddress2,
            "Customer Adress 3": data?.cAddress3,
            "Customer Adress 4": data?.cAddress4,
            "Inactive Status": data?.inactiveStatus,
            "City": data?.city,
            "Pincode": data?.pincode,
            "State": data?.state,
            "Country": data?.country,
            "Party Notes": data?.partyNotes,
            "Currency": data?.currencyName,
            "Pan No": data?.panNo,
            "GSTInUinId": data?.gstInUinId,
            "Bi Phone No": data?.bi_phoneNo,
            "Bi Fax No": data?.bi_faxNo,
            "Email": data?.email,
            "Pay Term": data?.payTerm,
            "No Tax Remarks": data?.noTaxRemark,
            "Credit Day": data?.creditday,
            "Place of Supply": data?.placeOfSupplyName,
            "TCS Collected": data?.tcsCollected,
            "Sub Chargea On TCS": data?.SubcharOnTcs,
            "Cess On TCS": data?.CessOnTcs,
            "Single Sales Order": data?.singleSaleOrd,
            "DC Value": data?.dcValue,
            "Short Close": data?.shortClose,
            "CGST": data?.cgst,
            "SGST": data?.sgst,
            "IGST": data?.igst,
            "UGST": data?.utgst,
            "DC Info Req": data?.dcInfoReq,
            "Max Line Item": data?.maxLineItem,
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
                Import Customer Item
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
                            <Button variant="contained" component="label" style={{ backgroundColor: '#002d68', height: '40px', width: '300px', borderRadius: '20px' }}>
                                {loading ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'Upload Excel'}
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
                                disabled={isLoading === true}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'Load To Database'}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={2} lg={3} xl={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Button variant="contained"
                                onClick={() => {
                                    CutomerDownloadExlExport(handleItemDownloadExlExportSucess, handleItemDownloadExlExportException);
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

export default CustomerFileUpload