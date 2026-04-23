import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React, { useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import CircularProgress from '@mui/material/CircularProgress';
import { DownloadCustVsItemPriceCopyTemplate } from '../../../ApiService/DownloadCsvReportsService';
import CustomerVsItemMissing from './CustomerVsItemMissing';
import { CustVsItemXLUpload } from '../../../ApiService/LoginPageService';

const CopyFromXl = ({ copyFromModal, setCopyFromModal,customerSelect }) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [excelBase64File, setExcelBase64File] = useState('');
    const [isLoader, setIsLoader] = useState(false);
    const [missingModal, setMissingModal] = useState(false);
    const [missingLists, setMissingLists] = useState([]);
    console.log("excelBase64File", excelBase64File)

    const columns = [
        {
            field: 'Part No',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'Process Name',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'Machine',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Machine</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'Process',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Process</span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Cycle Time',
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
            field: 'UOM Count',
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
            field: 'Process Priority',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Process Priority</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Skip (YES/NO)',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>skip</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'Quality (YES/NO)',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Quality</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
    ];

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
                setExcelBase64File(base64String);
            };

            reader.readAsArrayBuffer(file);
        }
    };

    const handleDownloadTemplate = () => {
        DownloadCustVsItemPriceCopyTemplate(handleTemplateDownloadSucessShow, handleTemplateDownloadExceptionShow)
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
    const handleFileUpload = () => {
        setIsLoader(true);
        CustVsItemXLUpload({  customerId: customerSelect,file: excelBase64File }, handleCopyFromUploadSucessShow, handleCopyFromUploadExceptionShow)
    }
    // const handleCopyFromUploadSucessShow = (dataObject) => {
    //     setMissingLists(dataObject.missing);
    //     setIsLoader(false);
    //     setNotification({
    //         status: true,
    //         type: 'success',
    //         message: dataObject.message,
    //     });
    //     setTimeout(() => {
    //         // handleClose();
    //     }, 2000);
    // }

    const handleCopyFromUploadSucessShow = (dataObject) => {
        setIsLoader(false);
        if (dataObject.missing.length > 0) {
            setMissingLists(dataObject.missing); // Set the missing items
            setMissingModal(true); // Show the modal if there are missing items
        }

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
    }
    const handleCopyFromUploadExceptionShow = (errorObject, errorMessage) => {
        setIsLoader(false);
        if (errorObject.missing.length > 0) {
            setMissingLists(errorObject.missing); 
            setMissingModal(true); 
        }
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
        setCopyFromModal(false);
        setIsLoader(false);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="md"
            open={copyFromModal}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Select Excel File
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6">
                    {
                        !isLoader ? (

                            <Grid container alignItems={'center'} spacing={2} paddingTop={2.5}>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        id="outlined-basic"
                                        type="file"
                                        accept=".xls, .xlsx"
                                        onChange={handleFileChange}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                                    <Button variant="contained" style={{ width: '150px', background: '#002D68', color: 'white', marginRight: '15px' }} onClick={handleDownloadTemplate} >Template</Button>
                                    
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid container >
                                <Grid
                                    item xs={12} sm={12} md={12} lg={12} xl={12}
                                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '18px' }}
                                >
                                    <CircularProgress />
                                </Grid>
                            </Grid>
                        )
                    }
                    <DialogActions>
                    <Button variant="contained" onClick={() => setMissingModal(true)} style={{ backgroundColor: '#002D68' }}>View Missing Items</Button>
                        <Button variant="contained" style={{ width: '150px', background: '#002D68', color: 'white' }}onClick={handleFileUpload} >Upload</Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setCopyFromModal(false);
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
            <CustomerVsItemMissing
                setMissingModal={setMissingModal}
                missingModal={missingModal}
                missingLists={missingLists}
                type={'Copy'}
            />
        </Dialog>
    )
}

export default CopyFromXl
