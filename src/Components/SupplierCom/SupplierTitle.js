import React, { useState } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ExcelTemplateDownloader from '../../ApiService/ExcelTemplateDownloader';
import { DownloadSupExcelTemplate } from '../../ApiService/DownloadCsvReportsService';
import { SupExcelImport } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import ApplicationStore from '../../Utility/localStorageUtil';
import IssueModal from '../MaterialIssueComp/IssueComponent/IssueModal';
import { useModuleLocks } from '../context/ModuleLockContext';

const SupplierTitle = (props) => {
  const [file, setFile] = useState(null);
  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const { userDetails } = ApplicationStore().getStorage('userDetails');
  const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "supplierlist");

  const handleFileUpload = () => {
    // Handle the uploaded file here
  };

  const DownloadSupExcelTemplateSuccess = () => {

  }

  const DownloadSupExcelTemplateException = () => {

  }

  // const SupExcelImportSuccess = (dataObject) => {
  //   setNotification({
  //     status: true,
  //     type: 'success',
  //     message: dataObject.message,
  //   });
  //   setTimeout(() => {
  //     handleClose();
  //     setFile('');
  //   }, 5000);
  // }

  const SupExcelImportSuccess = (dataObject) => {
    setFile('');
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      setLoading(false);
    }, 200)
  }

  const SupExcelImportException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      setLoading(false);
    }, 200)
  }

  const handleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };

  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Supplier List")?.lockStatus === "locked";

  return (
    <Box
      sx={{
        // mb: '10px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        // marginLeft: '10px',
        // marginRight: '10px'
        marginTop: '-20px'
      }}
    >
      <Typography
        sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
        variant="h5"
      >
        Supplier List Summary
      </Typography>
      <Box
        sx={{ m: 1 }}
      >
        <Grid container alignItems={'center'} spacing={2}>

          <Grid item>
            <div>
              <Button
                variant="contained"
                // color="primary"
                component="label"
                disabled={isModuleLocked}
                sx={{ marginRight: '16px', backgroundColor: isModuleLocked ? 'gray' : '#002D68', height: '40px', borderRadius: '20px' }}
                onClick={() => {
                  DownloadSupExcelTemplate(DownloadSupExcelTemplateSuccess, DownloadSupExcelTemplateException);
                }}
              >
                Download Template
              </Button>
              {/* <ExcelTemplateDownloader /> */}

              <input
                id="upload-photo"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (reader.readyState === 2) {
                        setFile(reader.result);
                        setLoading(true);
                        SupExcelImport(
                          { file: reader.result },
                          SupExcelImportSuccess,
                          SupExcelImportException
                        );
                      }
                    };
                    reader.readAsDataURL(file);
                  }

                  // Reset the input value so the same file can be uploaded again
                  e.target.value = '';
                }}
              />


              <Button
                variant="contained"
                component="label"
                htmlFor="upload-photo"
                sx={{ backgroundColor: isModuleLocked ? 'gray' : '#002D68', height: '40px', borderRadius: '20px' }}
                disabled={loading === true || isModuleLocked}
              >
                {/* Upload File */}
                {loading ? (
                  <CircularProgress size={24} style={{ color: 'white' }} />
                ) : 'Upload File'}
              </Button>
              {/* <input
                id="upload-photo"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const selectedFile = e.target.files[0];

                  // Check if a file is selected before proceeding
                  if (selectedFile) {
                    // Update state with the selected file
                    setFile(selectedFile);

                    // Perform the file upload or processing function
                    SupExcelImport(
                      { file: selectedFile },
                      SupExcelImportSuccess,
                      DownloadSupExcelTemplateException
                    );
                  }
                }}
              /> */}
            </div>
          </Grid>

          {/* <Grid item>
            <Stack direction="row" spacing={2}
            >
              <Fab
                style={{ width: '100%', background: userPermission[0]?.addData === 0 ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                disabled={userPermission[0]?.addData === 0}
                onClick={() => {
                  props.setIsAddButton(true);
                  props.setEditCustomer([]);
                  props.setOpen(true);
                }}
                variant="extended" size="medium" color="primary" aria-label="add">
                <AddIcon sx={{ mr: 1 }} />
                Add Supplier List
              </Fab>
            </Stack>
          </Grid> */}
        </Grid>
      </Box>
      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </Box>
  )
}

export default SupplierTitle