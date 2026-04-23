import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React, { useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { GetItemVsProcessTemplate } from '../../../ApiService/DownloadCsvReportsService';
import { ItemVsProcessXLUpload } from '../../../ApiService/LoginPageService';
import MissingModal from '../MissingModal/MissingModal';

const ImportFromExcelModal = ({ excelModal, setExcelModal }) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [excelData, setExcelData] = useState([]);
    const [excelBase64File, setExcelBase64File] = useState('');
    const [missingModal, setMissingModal] = useState(false);
    const [missingLists, setMissingLists] = useState([]);

    const columns = [
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'Process Name',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'pm',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Process</span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'machine',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Machine</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'cycleTym',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cycle Time</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'uomCount',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM Count</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'pmPriority',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Process Priority</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        }
    ];

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ id: index, ...row }));
    };

    const rows = generateRowsWithIndex(excelData);

    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             const base64String = btoa(
    //                 new Uint8Array(e.target.result)
    //                     .reduce((data, byte) => data + String.fromCharCode(byte), '')
    //             );
    //             // Now you have the file as a Base64-encoded string
    //             console.log("Base64 String:", base64String);
    //             setExcelBase64File(base64String);
    //             // Rest of your code... TO DISPLAY XCEL IN GRID
    //             const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
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
                // SupplierVsItemXLUpload({ spCode: suppCode, file: base64String }, handleTemplateUploadSucessShow, handleTemplateUploadExceptionShow)
                ItemVsProcessXLUpload({ file: base64String }, handleTemplateUploadSucessShow, handleTemplateUploadExceptionShow)
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

    const handleDownloadTemplate = () => {
        GetItemVsProcessTemplate(handleTemplateDownloadSucessShow, handleTemplateDownloadExceptionShow)
    };

    const handleTemplateDownloadSucessShow = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: "Template Download Success",
        });
    }
    const handleTemplateDownloadExceptionShow = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: "Template failed to download",
        });
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    //UPLOAD EXCEL FILE
    // const handleFileUpload = () => {
    //     ItemVsProcessXLUpload({ file: excelBase64File }, handleTemplateUploadSucessShow, handleTemplateUploadExceptionShow)
    // }
    const handleTemplateUploadSucessShow = (dataObject) => {
        setExcelData(dataObject?.display);
        setMissingLists(dataObject?.missing);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            // ClearData()
            handleClose();
        }, 2000);
    }
    const handleTemplateUploadExceptionShow = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
    }

    const ClearData = () => {
        setExcelData([]);
        setMissingLists([]);
        setExcelModal(false);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg    "
            open={excelModal}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Import from Excel
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" >

                    <Grid container alignItems={'center'} spacing={2} paddingTop={2.5}>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                type="file"
                                accept=".xls, .xlsx"
                                onChange={handleFileChange}
                            />
                        </Grid>

                        <Grid item >
                            <Button variant="contained" style={{ width: '150px', background: '#002D68', color: 'white', marginRight: '15px' }} onClick={handleDownloadTemplate}>Template</Button>
                            <Button variant="contained" onClick={() => setMissingModal(true)} style={{ backgroundColor: '#002D68' }}>View Missing Items</Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        pageSize={8}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '43vh',
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
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                        getRowClassName={(params) => {
                                            // Find the index of the row within the rows array
                                            const rowIndex = excelData.findIndex(row => row.id === params.row.id);
                                            // Check if the index is valid
                                            if (rowIndex !== -1) {
                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return ''; // Return default class if index is not found
                                        }}


                                    />
                                </CardContent>

                            </Card>
                        </Grid>
                    </Grid>

                    <DialogActions>
                        {/* <Button variant="contained" style={{ width: '150px', background: '#002D68', color: 'white' }} disabled={excelData.length > 0 ? false : true} onClick={handleFileUpload}>Upload</Button> */}
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setExcelModal(false);
                                ClearData();
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
                type={'Import'}
            />

        </Dialog>
    )
}

export default ImportFromExcelModal;
