import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, TextField } from '@mui/material';
import RDL_Logo from '../../AllImage/RDL_Logo.png';
import { Padding } from '@mui/icons-material';
import UploadIcon from '@mui/icons-material/Upload';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { GetCompanyDetails, updateCompanyDetails } from '../../ApiService/LoginPageService';
import NoImage from '../../AllImage/No-Image.png'
import { useModuleLocks } from '../context/ModuleLockContext';

const CompanyMaster = () => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Company Master")?.lockStatus === "locked";


  const [imageBase64, setImageBase64] = useState(null);
  const [imageBase64Show, setImageBase64Show] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    email: '',
    telNo: '',
    mobileNo: '',
    website: '',
    gstNo: '',
    cinNo: '',
    panNo: '',
  });
  const [cardHeight, setCardHeight] = useState(window.innerHeight);
  const [isEdit, setIsEdit] = useState(false);
  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });
  const [refresher, setRefresher] = useState(false);
  const baseUrl = process.env.REACT_APP_API_URL;
  const urlParts = baseUrl.split('api/');

  useEffect(() => {
    const handleResize = () => {
      setCardHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    GetCompanyDetails(handleGetSuccess, handleGetException)
  }, [refresher])

  const handleGetSuccess = (dataObject) => {
    setFormData({
      companyName: dataObject?.data?.companyName,
      address: dataObject?.data?.address,
      email: dataObject?.data?.email,
      telNo: dataObject?.data?.telNo,
      mobileNo: dataObject?.data?.mobNo,
      website: dataObject?.data?.website,
      gstNo: dataObject?.data?.gstNo,
      cinNo: dataObject?.data?.cinNo,
      panNo: dataObject?.data?.panNo,
    })
    setImageBase64Show(dataObject?.data?.image);
  }
  const handleGetException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
  }

  // const handleImageUpload = (event) => {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();

  //   if (file) {
  //     reader.readAsDataURL(file);
  //     reader.onloadend = () => {
  //       setImageBase64(reader.result);
  //       setImageBase64Show(reader.result);
  //     };
  //     console.log("Base64 File:", reader.result);
  //   }
  // };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageBase64(reader.result);
        setImageBase64Show(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };



  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   updateCompanyDetails({
  //     companyName: formData.companyName,
  //     image: imageBase64 ? imageBase64 : '',
  //     address: formData.address,
  //     email: formData.email,
  //     telNo: formData.telNo,
  //     mobNo: formData.mobileNo,
  //     website: formData.website,
  //     gstNo: formData.gstNo,
  //     cinNo: formData.cinNo,
  //     panNo: formData.panNo
  //   },
  //     handleUpdateSuccess, handleUpdateException)
  // }

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalImage = imageBase64
      ? imageBase64                 // newly uploaded image (Base64)
      : imageBase64Show && !imageBase64Show.startsWith('data:')
        ? imageBase64Show
        : '';

    updateCompanyDetails(
      {
        companyName: formData.companyName,
        image: finalImage,
        address: formData.address,
        email: formData.email,
        telNo: formData.telNo,
        mobNo: formData.mobileNo,
        website: formData.website,
        gstNo: formData.gstNo,
        cinNo: formData.cinNo,
        panNo: formData.panNo,
      },
      handleUpdateSuccess,
      handleUpdateException
    );
  };

  const handleUpdateSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
      setRefresher(!refresher);
      setIsEdit(false)
      setImageBase64Show(null);
    }, 2000);
  }

  const handleUpdateException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
  }

  const handleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };

  return (
    <form style={{ display: 'flex', justifyContent: 'center', height: '100%' }} onSubmit={handleSubmit}>
      <Box style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
        <Card sx={{ height: cardHeight - 170, width: '50%', margin: 1, display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', rowGap: '10px' }}>
                <img
                  src={
                    imageBase64
                      ? imageBase64
                      : imageBase64Show
                        ? `${urlParts[0]}${imageBase64Show}`
                        : NoImage
                  }
                  alt="Logo"
                  style={{ width: '200px', height: '200px', border: '1px solid gray', borderRadius: '5px' }}
                />
                <Button variant="contained" component="label" style={{ backgroundColor: isEdit ? '#002D68' : 'gray' }} disabled={!isEdit || isModuleLocked}>
                  Upload Image  <UploadIcon />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </Button>
              </Grid>
              <Grid item xs={12} xl={12}>
                <TextField
                  size="small"
                  fullWidth
                  required
                  label="Company Name"
                  variant="outlined"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  disabled={!isEdit}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Address"
                  multiline
                  rows={4}
                  size="small"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEdit}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={6}>
                <TextField
                  size="small"
                  fullWidth
                  required
                  type='email'
                  label="Email ID"
                  variant="outlined"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEdit}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={6}>
                <TextField
                  size="small"
                  fullWidth
                  required
                  type='number'
                  label="Tel No"
                  variant="outlined"
                  value={formData.telNo}
                  onChange={(e) => setFormData({ ...formData, telNo: e.target.value })}
                  disabled={!isEdit}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={6}>
                <TextField
                  size="small"
                  fullWidth
                  required
                  type='number'
                  label="Mobile No"
                  variant="outlined"
                  value={formData.mobileNo}
                  onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                  disabled={!isEdit}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={6}>
                <TextField
                  size="small"
                  fullWidth
                  required
                  label="Website"
                  variant="outlined"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={!isEdit}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={6}>
                <TextField
                  size="small"
                  fullWidth
                  required
                  label="Gst No"
                  variant="outlined"
                  value={formData.gstNo}
                  onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
                  disabled={!isEdit}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={6}>
                <TextField
                  size="small"
                  fullWidth
                  required
                  label="CIN No"
                  variant="outlined"
                  value={formData.cinNo}
                  onChange={(e) => setFormData({ ...formData, cinNo: e.target.value })}
                  disabled={!isEdit}
                />
              </Grid>

              <Grid item xs={12} md={6} xl={6}>
                <TextField
                  size="small"
                  fullWidth
                  required
                  label="Pan No"
                  variant="outlined"
                  value={formData.panNo}
                  onChange={(e) => setFormData({ ...formData, panNo: e.target.value })}
                  disabled={!isEdit}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#EEEEEE' }}>
            <Button variant="contained" style={{ backgroundColor: isModuleLocked ? 'gray' : '#002D68', color: 'white', border: isEdit ? '1px solid red' : '', color: 'white' }} disabled={isModuleLocked || isModuleLocked} onClick={() => setIsEdit(true)}>Edit</Button>
            <Button disabled={isEdit ? false : true || isModuleLocked} type="submit" variant="contained" style={{ backgroundColor: isEdit || isModuleLocked ? 'gray' : '#002D68', color: 'white' }}>Update</Button>
          </CardActions>
        </Card>
      </Box>
      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </form>
  )
}

export default CompanyMaster