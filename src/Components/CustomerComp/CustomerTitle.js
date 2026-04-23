import React, { useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { CustomerTemplateDownloadExlExport } from '../../ApiService/DownloadCsvReportsService';
import { CustomerImport } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import Fade from '@mui/material/Fade';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import { useRef } from 'react';
import ApplicationStore from '../../Utility/localStorageUtil';

const CustomerTitle = (props) => {
  const [file, setFile] = useState(null);
  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('idle');
  const timerRef = useRef();

  const { userDetails } = ApplicationStore()?.getStorage('userDetails');
  const userPermission = userDetails?.groupRights?.filter((data) => data?.menu?.toLowerCase() === "addcustomer");

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    [],
  );


  const handleClickQuery = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (query !== 'idle') {
      setQuery('idle');
      return;
    }

    setQuery('progress');
    timerRef.current = window.setTimeout(() => {
      setQuery('success');
    }, 2000);
  };

  const handleClickLoading = () => {
    setLoading(true);
  };

  const handleCustomerTemplateDownloadExlExportSuccess = () => {

  }

  const handleCustomerTemplateDownloadExlExportException = () => {

  }

  const handleCustomerImportSucess = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
      setLoading(false);
    }, 3000);

  }

  const handleCustomerImportException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
    setTimeout(() => {
      setLoading(false);
    }, 3000);

  }

  const handleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };


  return (
    <Box
      sx={{
        mb: '10px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginLeft: '10px',
        marginRight: '10px'
      }}
    >
      <Typography
        sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
        variant="h5"
      >
        Customer Summary
      </Typography>
      {/* <Box
        sx={{ m: 1 }}
      >
        <Grid container alignItems={'center'} spacing={2}>

          <Grid item>
            <div>
              <Button
                variant="contained"
                // color="primary"
                component="label"
                sx={{ marginRight: '16px', backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
                onClick={() => {
                  CustomerTemplateDownloadExlExport(handleCustomerTemplateDownloadExlExportSuccess, handleCustomerTemplateDownloadExlExportException);
                }}
              >
                Download Template
              </Button>

              <Button
                variant="contained"
                // color="primary"
                component="label"
                htmlFor="upload-photo"
                sx={{ backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
              // onClick={handleClickLoading}
              >
                <Fade
                  in={loading}
                  style={{
                    transitionDelay: loading ? '200ms' : '0ms',
                  }}
                  unmountOnExit
                >
                  <CircularProgress />
                </Fade>


                Upload File
              </Button>
              <input
                id="upload-photo"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (reader.readyState === 2) {
                        setFile(reader.result);
                        setLoading(true);
                        CustomerImport({
                          file: reader.result
                        }, handleCustomerImportSucess, handleCustomerImportException);
                      }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}

              />

            </div>
          </Grid>
          <Grid item>
            <Stack
              direction="row"
              spacing={2}

            >
              <Fab
                style={{ width: '100%', background: userPermission[0]?.addData === 0 ? 'gray' : '#002D68', color: userPermission[0]?.addData === 0 ? 'black' : 'white' }}
                disabled={userPermission[0]?.addData === 0}
                onClick={() => {
                  props.setIsAddButton(true);
                  props.setEditEdit([]);
                  props.setOpen(true);
                }}
                variant="extended" size="medium" color="primary" aria-label="add">
                <AddIcon sx={{ mr: 1 }} />
                Add Customer
              </Fab>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
              />*/}
    </Box> 
  )
}

export default CustomerTitle