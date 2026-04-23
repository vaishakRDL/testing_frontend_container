import { Autocomplete, Button, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
// import { MultiAddressAdd, MultiAddressDataDelete, MultiAddressDataShow, MultiAddressDataUpdate } from '../../ApiService/LoginPageService';
import { GetSuppVsItemTemplate } from '../../../ApiService/DownloadCsvReportsService';
import { GetSuppVsItemSuppItemListWithCode, SupplierVsItemXLSaveData, SupplierVsItemXLUpload } from '../../../ApiService/LoginPageService';
import MissingModal from '../MissingModal/MissingModal';

const ImportExcelModal = ({ excelModal, setExcelModal, globleId, suppCode, handleLoadButtonClick, setSupplierItemList }) => {
    const [supplierCode, setSupplierCode] = useState('')
    const [category, setCategory] = useState('');
    const [address, setAddress] = useState('');
    const [defaultShippingAddress, setDefaultShippingAddress] = useState('');
    const [multiAddress, setMultiAddress] = useState([]);
    const [multiRefresh, setMultiRefresh] = useState(true);
    const [isEditable, setIsEditable] = useState(false);
    const [dataRefresh, setDataRefresh] = useState(false);
    const [editId, setEditId] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [excelData, setExcelData] = useState([]);
    const [excelReponse, setExcelResponse] = useState([]);
    const [missingModal, setMissingModal] = useState(false);
    const [missingLists, setMissingLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveLoader, setSaveLoader] = useState(false);

    const columns = [
        {
            field: 'id',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SI No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Code</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'rate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rate</span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'sob',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SOB%</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'supplyDesc',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supp Desc</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'jwdcRate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>JWDC Rate</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'leadTime',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Lead Time(Days)</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'isFc',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>FCITEM</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'errorRemarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Error Remarks</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerName: 'BOM',
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         // <BOMCheck selectedRow={params.row} />,

        //     ],
        // },
    ];

    // const generateRowsWithIndex = (rows) => {
    //     return rows.map((row, index) => ({ id: index + 1, ...row }));
    // };

    // const rows = generateRowsWithIndex(excelReponse);

    const [rows, setRows] = useState([]);

    // Function to add IDs to rows
    const generateRowsWithIndex = (rows) => {
        if (!Array.isArray(rows)) {
            console.error("The provided 'rows' is not an array:", rows);
            return [];
        }
        return rows.map((row, index) => ({ id: index + 1, ...row }));
    };

    // Set initial rows when `excelResponse` is received
    useEffect(() => {
        if (excelReponse && Array.isArray(excelReponse)) {
            const processedRows = generateRowsWithIndex(excelReponse);
            setRows(processedRows);
        } else {
            console.error("Invalid or empty 'excelReponse':", excelReponse);
        }
    }, [excelReponse]);

    // Function to remove erroneous rows
    // const handleRemove = () => {
    //     const filteredRows = rows.filter((row) => row.errorRemarks !== 'Missing itemId');
    //     setRows(filteredRows);
    //     const worksheet = arrayToWorksheet(rows.filter((row) => row.errorRemarks == 'Missing itemId'));
    //     downloadExcelFile(worksheet, 'ERROR_data.xlsx');
    // };
    ////////
    const handleRemove = () => {
        // Filter rows that do not have 'Missing itemId' in errorRemarks
        const filteredRows = rows.filter((row) => row.errorRemarks !== 'Missing itemId');
        setRows(filteredRows);

        // Filter out columns you don't want in the downloaded Excel (e.g., suppId, itemId, id)
        const errorRows = rows.filter((row) => row.errorRemarks === 'Missing itemId').map(({ suppId, itemId, id, rowNo, ...rest }) => rest);

        // Generate the worksheet for the filtered error rows
        const worksheet = arrayToWorksheet(errorRows);

        // Trigger the download of the error data Excel file
        downloadExcelFile(worksheet, 'ERROR_data.xlsx');
    };

    // const [rows, setRows] = useState([]);

    // useEffect(() => {
    //     // Filter rows to remove those with 'Missing itemId' in errorRemarks
    //     if (Array.isArray(excelReponse)) {
    //         setRows(excelReponse.filter(row => row.errorRemarks !== 'Missing itemId').map((row, index) => ({ id: index + 1, ...row })));
    //     }
    // }, [excelReponse]);

    // // Remove erroneous rows (those with errorRemarks)
    // const handleRemove = () => {
    //     setRows(prevRows => prevRows.filter(row => row.errorRemarks !== 'Missing itemId'));
    // };
    ////////EXCEL UPLOAD CODE///////////

    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             const data = new Uint8Array(e.target.result);
    //             const workbook = XLSX.read(data, { type: 'array' });
    //             const sheetName = workbook.SheetNames[0];
    //             const sheet = workbook.Sheets[sheetName];
    //             const dataArray = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    //             // Assuming the first row contains headers
    //             const headers = dataArray[0];

    //             // Extracting data from subsequent rows
    //             const excelObjects = dataArray.slice(1).map((row) => {
    //                 const obj = {};
    //                 headers.forEach((header, index) => {
    //                     obj[header] = row[index];
    //                 });
    //                 return obj;
    //             });

    //             setExcelData(excelObjects);
    //             console.log("excelObjects",excelObjects)
    //         };

    //         reader.readAsArrayBuffer(file);
    //     }
    // };

    // WOEKING CODE WITH EXCEL LOAD 

    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             const data = new Uint8Array(e.target.result);
    //             const workbook = XLSX.read(data, { type: 'array' });
    //             const sheetName = workbook.SheetNames[0];
    //             const sheet = workbook.Sheets[sheetName];
    //             const dataArray = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    //             // Assuming the first row contains headers
    //             const headers = dataArray[0];

    //             // Extracting data from subsequent rows
    //             const excelObjects = dataArray.slice(1).map((row, rowIndex) => {
    //                 const obj = { id: rowIndex + 1 }; // Adding id property
    //                 headers.forEach((header, index) => {
    //                     obj[header] = row[index];
    //                 });
    //                 return obj;
    //             });

    //             setExcelData(excelObjects);
    //             console.log("excelObjects", excelObjects);
    //         };

    //         reader.readAsArrayBuffer(file);
    //     }
    // };

    const handleFileChange = (event) => {
        setLoading(true);
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const base64String = btoa(
                    new Uint8Array(e.target.result)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );

                // Now you have the file as a Base64-encoded string
                console.log("Base64 String:", base64String);
                //API CALLS HERE
                SupplierVsItemXLUpload({ spCode: suppCode, file: base64String }, handleTemplateUploadSucessShow, handleTemplateUploadExceptionShow)
                //

                // // Rest of your code...
                // const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
                // const sheetName = workbook.SheetNames[0];
                // const sheet = workbook.Sheets[sheetName];
                // const dataArray = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                // // Assuming the first row contains headers
                // const headers = dataArray[0];

                // // Extracting data from subsequent rows
                // const excelObjects = dataArray.slice(1).map((row, rowIndex) => {
                //     const obj = { id: rowIndex + 1 }; // Adding id property
                //     headers.forEach((header, index) => {
                //         obj[header] = row[index];
                //     });
                //     return obj;
                // });

                // setExcelData(excelObjects);
                // console.log("excelObjects", excelObjects);
            };

            reader.readAsArrayBuffer(file);
        }
    };

    const handleTemplateUploadSucessShow = (dataObject) => {
        setExcelResponse(dataObject?.display || [])
        setMissingLists(dataObject?.missing || [])
        setNotification({
            status: true,
            type: 'success',
            message: "Data Import Success",
        });
        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }
    const handleTemplateUploadExceptionShow = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: "Data Import Failed",
        });
        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }


    //DOWNLOAD ARRAY OF OBJECTS AS EXCEL
    // const arrayToWorksheet = (array) => {
    //     const worksheet = XLSX.utils.json_to_sheet(array);
    //     return worksheet;
    // };

    /////////////
    // const arrayToWorksheet = (array) => {
    //     // Filter out specific fields from each object in the array
    //     const filteredArray = array.map(({ suppId, itemId, id, rowNo, ...rest }) => rest);
    //     const worksheet = XLSX.utils.json_to_sheet(filteredArray);
    //     return worksheet;
    // };

    // const downloadExcelFile = (worksheet, filename) => {
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    //     XLSX.writeFile(workbook, filename);
    // };

    // const handleDownload = () => {
    //     const worksheet = arrayToWorksheet(rows);
    //     downloadExcelFile(worksheet, 'SUPP_data.xlsx');
    // };
    ///////////////////////////////////////2////
    // const arrayToWorksheet = (array) => {
    //     // Filter out specific fields from each object in the array
    //     const filteredArray = array.map(({ suppId, itemId, id, rowNo, ...rest }) => rest);
    //     const worksheet = XLSX.utils.json_to_sheet(filteredArray);

    //     // Set column widths
    //     const headerKeys = Object.keys(filteredArray[0]); // Get header keys for reference
    //     worksheet['!cols'] = headerKeys.map(() => ({ wpx: 120})); // Set each column width to 150px

    //     return worksheet;
    // };

    // const downloadExcelFile = (worksheet, filename) => {
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    //     // Write the Excel file
    //     XLSX.writeFile(workbook, filename);
    // };

    // const handleDownload = () => {
    //     const worksheet = arrayToWorksheet(rows);
    //     downloadExcelFile(worksheet, 'SUPP_data.xlsx');
    // };

    ////////////////////////3///////////



    const arrayToWorksheet = (array) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        // Define columns with headers and key names
        const columns = Object.keys(array[0]).map((key) => ({
            header: key,
            key: key,
            width: 20 // Set default column width
        }));

        // Add columns to the worksheet
        worksheet.columns = columns;

        // Add rows to the worksheet
        array.forEach((row) => worksheet.addRow(row));

        // Apply styles to header (Bold font and Centered alignment)
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        // Apply center alignment to data rows
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        });

        return workbook;
    };

    const downloadExcelFile = async (workbook, filename) => {
        // Generate the Excel buffer and trigger the file download
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), filename);
    };

    const handleDownload = () => {
        // const rows = [
        //     { suppId: 4250, itemId: 1526, rate: 208, sob: 100, jwdcRate: "208", leadTime: "15", remarks: null, isFc: "N" },
        //     { suppId: 4251, itemId: 1527, rate: 210, sob: 101, jwdcRate: "210", leadTime: "14", remarks: "Urgent", isFc: "Y" }
        // ];

        // Filter out unwanted columns (suppId, itemId, id, rowNo)
        const filteredRows = rows.map(({ suppId, itemId, id, rowNo, ...rest }) => rest);

        // Generate workbook
        const workbook = arrayToWorksheet(filteredRows);

        // Download Excel file
        downloadExcelFile(workbook, 'SUPP_data.xlsx');
    };



    ///////////////////
    const ClearData = () => {
        setExcelData([])
    }

    //CREATE AND DOWNLOAD XL TEMPLATE
    const generateExcelTemplate = () => {
        // Define your template data or headers
        const templateData = [
            { header1: '', header2: '' },
            // Add more template data as needed
        ];

        // Convert template data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(templateData);

        return worksheet;
    };

    const downloadExcelTemplate = (worksheet, filename) => {
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        XLSX.writeFile(workbook, filename);
    };

    const handleDownloadTemplate = () => {
        // const templateWorksheet = generateExcelTemplate();
        // downloadExcelTemplate(templateWorksheet, 'excel_template.xlsx');
        GetSuppVsItemTemplate(handleTemplateDownloadSucessShow, handleTemplateDownloadExceptionShow)
    };

    const handleTemplateDownloadSucessShow = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: "Template Download Success",
            // message: dataObject.message,
        });
    }
    const handleTemplateDownloadExceptionShow = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: "Template failed to download",
            // message: errorMessage,
        });
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    //////////////////////////////////

    const handleTransferMainPageClick = () => {
        // SupplierVsItemXLSaveData({

        // },handleSaveSuccess,handleSaveexception);
        // handleLoadButtonClick();
        // setExcelModal(false);
        // setExcelResponse([]);
        setSaveLoader(true);
        SupplierVsItemXLSaveData(
            {
                items: rows.map(row => ({
                    suppId: row.suppId,
                    itemId: row.itemId,
                    rate: row.rate,
                    sob: row.sob,
                    supplyDesc: row.supplyDesc,
                    jwdcRate: row.jwdcRate,
                    leadTime: row.leadTime,
                    remarks: row.remarks,
                    isFc: row.isFc,
                })),
            },
            handleSaveSuccess, // Success handler
            handleSaveException // Error handler
        );
    };
    const handleSaveException = (error) => {
        // Handle error response (e.g., show an error message)
        console.error('Error saving data:', error);
        setTimeout(() => {
            setSaveLoader(false);
        }, 2000)
    };

    const handleSaveSuccess = (dataObject) => {
        // Handle success response (e.g., show a success message, update UI)
        console.log('Data saved successfully:', dataObject);
        // Reset the data after saving successfully
        setExcelResponse([]);
        setExcelModal(false);
        // setNotification({
        //     status: true,
        //     type: 'success',
        //     message: dataObject.message,
        // });
        GetSuppVsItemSuppItemListWithCode({ supCode: suppCode }, handleGetSuppItemListSucessShow, handleGetSuppItemListExceptionShow);
        setTimeout(() => {
            setSaveLoader(false);
        }, 2000)

    };
    const handleGetSuppItemListSucessShow = (dataObject) => {
        setSupplierItemList(dataObject?.data || []);
        // alert("ddd")
        // setNotification({
        //     status: true,
        //     type: 'success',
        //     message: dataObject.message,
        // });
        // setTimeout(() => {
        //     handleClose();
        // }, 3000);
    };
    const handleGetSuppItemListExceptionShow = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }


    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg    "
            open={excelModal}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Select from SUPP Master...
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" /*onSubmit={handleSubmit}*/>

                    <Grid container alignItems={'center'} spacing={2} paddingTop={2.5}>
                        <Grid item xs={12} sm={12} md={10} lg={10} xl={10} display={'flex'} alignItems={'center'}>
                            <TextField
                                // fullWidth
                                id="outlined-basic"
                                type="file"
                                accept=".xls, .xlsx"
                                onChange={handleFileChange}
                                style={{ marginRight: '15px' }}
                                disabled={loading === true}
                            />
                            <Button variant="contained" onClick={handleDownloadTemplate} style={{ backgroundColor: '#002D68', marginRight: '15px' }}>Template</Button>
                            {/* <Button variant="contained" onClick={() => setMissingModal(true)} style={{ backgroundColor: '#002D68' }}>View Missing Items</Button> */}
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        getRowClassName={(params) =>
                                            params.row.errorRemarks ? "error-row" : ""
                                        }
                                        sx={{
                                            height: '500px',
                                            // width: '100%',
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
                                                border: '1px solid #969696', // Add border to column headers
                                            },
                                        }}

                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />
                                </CardContent>

                            </Card>
                        </Grid>
                    </Grid>

                    <DialogActions>
                        {/* <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type="submit"
                        >
                            {
                                !isEditable ? 'Add' : 'Update'
                            }
                        </Button> */}
                        <Button style={{ background: rows.length > 0 ? '#002D68' : 'gray' }} variant="contained" disabled={rows.length > 0 && saveLoader === false ? false : true}
                            onClick={handleTransferMainPageClick}>
                            {saveLoader ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : 'Save Data'}
                        </Button>
                        <Button
                            style={{ background: '#002D68', color: '#fff', }}
                            variant="contained"
                            disabled={rows.length === 0}
                            onClick={handleDownload}
                        >
                            Export to Excel
                        </Button>
                        <Button
                            style={{ background: '#002D68', color: '#fff' }}
                            variant="contained"
                            disabled={rows.length === 0}
                            onClick={handleRemove}
                        >
                            Remove Erroneous
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white', }}
                            onClick={(e) => {
                                setExcelModal(false);
                                ClearData();
                                setExcelResponse([]);
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

            <MissingModal
                setMissingModal={setMissingModal}
                missingModal={missingModal}
                missingLists={missingLists}
            />

        </Dialog>
    )
}

export default ImportExcelModal
