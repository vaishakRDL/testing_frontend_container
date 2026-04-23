import { Box, Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress, TextField } from '@mui/material';
import React, { useState } from 'react'
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { DownloadCustVsItemPriceTemplate, DownloadRateUpdateTemplate } from '../../../ApiService/DownloadCsvReportsService';
import ImportXlMissingItems from './ImportXlMissingItems';
import CustomerVsItemMissing from './CustomerVsItemMissing';
import { CustVsItemXLImportXl, RateUpdateXLImportXl } from '../../../ApiService/LoginPageService';
import RateXLMissing from './RateXLMissing';

const RateUpdateXL = ({ RateUpadteModal, setRateUpadteModal, customerSelect }) => {
    const [activeButton, setActiveButton] = useState("");
    const getHighlightStyle = (name, baseStyle = {}, disabled = false) => ({
        ...baseStyle,
        backgroundColor: disabled
            ? "grey"
            : activeButton === name
                ? "#0d6efd"
                : baseStyle.backgroundColor,
        transition: "0.3s",
        color: "white",
    });

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [excelData, setExcelData] = useState([]);
    const [excelBase64File, setExcelBase64File] = useState('');
    const [missingModal, setMissingModal] = useState(false);
    const [missingLists, setMissingLists] = useState([]);
    const [loading, setLoading] = useState(false);

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
            field: 'oldRate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Old Rate</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'newRate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>New Rate</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

    ];

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ id: index, ...row }));
    };

    const rows = generateRowsWithIndex(excelData);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setLoading(true);

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const base64String = btoa(
                    new Uint8Array(e.target.result)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                RateUpdateXLImportXl({ customerId: customerSelect, file: base64String }, handleXLImportXlSucessShow, handleXLImportXlExceptionShow)
            };

            reader.readAsArrayBuffer(file);
        }
    };

    const handleXLImportXlSucessShow = (dataObject) => {
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
            setLoading(false);
        }, 2000);
    }
    const handleXLImportXlExceptionShow = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
            setLoading(false);
        }, 2000);
    }

    const handleDownloadTemplate = () => {
        DownloadRateUpdateTemplate(handleTemplateDownloadSucessShow, handleTemplateDownloadExceptionShow)
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
        setRateUpadteModal(false);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg    "
            open={RateUpadteModal}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Rate Update Excel
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
                                disabled={loading === true}
                            />
                        </Grid>

                        <Grid item >
                            <Button
                                variant="contained"
                                style={getHighlightStyle("Template", {
                                    width: "150px",
                                    backgroundColor: "#002D68",
                                    marginRight: "15px",
                                })}
                                onClick={() => {
                                    setActiveButton("Template");   // 🔵 highlight
                                    handleDownloadTemplate();      // ✅ existing logic
                                }}
                            >
                                Template
                            </Button>                            <Button variant="contained" onClick={() => setMissingModal(true)} style={{ backgroundColor: '#002D68' }}>View Missing Items</Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                {loading &&
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress />
                                    </Box>
                                }
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
                                setRateUpadteModal(false);
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

            <RateXLMissing
                setMissingModal={setMissingModal}
                missingModal={missingModal}
                missingLists={missingLists}
                type={'Import'}
            />

        </Dialog>
    )
}

export default RateUpdateXL;
