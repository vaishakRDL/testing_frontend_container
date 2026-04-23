import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import React, { useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { GetItemVsProcessMachineDeselectTemplate } from '../../../ApiService/DownloadCsvReportsService';
import { MachineDeselectXLUpload } from '../../../ApiService/LoginPageService';
import CircularProgress from '@mui/material/CircularProgress';

const MachineDeselectModal = ({ machineDeselectModal, setMachineDeselectModal, globleId, suppCode, handleLoadButtonClick }) => {
    const [uploadloading, setuploadloading] = useState(false);
    const [excelBase64File, setExcelBase64File] = useState('');
    const [isLoader, setIsLoader] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

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
        GetItemVsProcessMachineDeselectTemplate(handleTemplateDownloadSucessShow, handleTemplateDownloadExceptionShow)
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
        setuploadloading(true);
        MachineDeselectXLUpload({ file: excelBase64File }, handleMachineDeselectSucessShow, handleMachineDeselectExceptionShow)
    }
    const handleMachineDeselectSucessShow = (dataObject) => {
        setuploadloading(false);

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
        }, 2000);
    }
    const handleMachineDeselectExceptionShow = (errorObject, errorMessage) => {
        setuploadloading(false);

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
        setMachineDeselectModal(false);
        setIsLoader(false);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="md"
            open={machineDeselectModal}
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
                                    <Button variant="contained" style={{ width: '150px', background: '#002D68', color: 'white' }} onClick={handleDownloadTemplate}>Template</Button>
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
                        <Button variant="contained" style={{ width: '150px', background: '#002D68', color: 'white' }} disabled={uploadloading} onClick={handleFileUpload}>
                            {uploadloading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (
                                'Upload'
                            )}
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setMachineDeselectModal(false);
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
        </Dialog>
    )
}

export default MachineDeselectModal
