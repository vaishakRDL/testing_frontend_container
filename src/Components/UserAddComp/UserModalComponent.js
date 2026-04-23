import {
  Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, Select, Switch, TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { connect } from 'react-redux';
import {
  addUser
} from '../../Actions';
import { AddUser, ShowDesignation, ShowRole, ShowDepartment, UserEditData } from '../../ApiService/LoginPageService';
import { AddUserValidate } from '../validation/formValidation';

function UserModal(props) {
  const { open, setOpen, isAddButton, userData, setRefreshData, isSuperAdmin, configSetupData } = props;

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [isDOBCheck, setIsDOBCheck] = useState(false);
  const [selectedDOB, setSelectedDOB] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [remark, setRemark] = useState('')
  const [file, setFile] = useState(null);
  const [imageFlag, setImageFlag] = useState(false)
  //user image
  const [base64Image, setBase64Image] = useState(null);
  //
  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });
  const [designationList, setDesignationList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [rowId, setRowId] = useState('');
  const [loading, setLoading] = useState(false);

  const [errorObject, setErrorObject] = useState({});

  useEffect(() => {
    ShowDesignation(handleShowDesignationSuccess, handleShowDesignationException);
    ShowRole(handleShowRoleSuccess, handleShowRoleException);
    ShowDepartment(handleShowDepartmentSuccess, handleShowDepartmentException);
    loaderData()
  }, [configSetupData]);

  //desination drop success
  const handleShowDesignationSuccess = (dataObject) => {
    setDesignationList(dataObject?.data || []);
  }
  const handleShowDesignationException = (errorObject, errorMessage) => {
  }

  // role drop success
  const handleShowRoleSuccess = (dataObject) => {
    setRoleList(dataObject?.data || []);
  }
  const handleShowRoleException = (errorObject, errorMessage) => {
  }

  //Department drop success
  const handleShowDepartmentSuccess = (dataObject) => {
    setDepartmentList(dataObject?.data || []);
  }
  const handleShowDepartmentException = (errorObject, errorMessage) => {
  }


  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault();
    if (isAddButton) {
      AddUser({
        userName: userName,
        email: email,
        password: password,
        remarks: remark,
        image: base64Image,
        designationId: designation,
        mobile: mobileNo,
        departmentId: department,
        // chknDob: isDOBCheck,
        roleId: role,
        dob: selectedDOB,
        inActive: isActive
      }, handleSuccess, handleException);
    } else {
      // props.editDepartment({
      //   id: rowId,
      //   departmentName: departmentName,
      //   departmentDescription: description
      // }, handleSuccess, handleException);
      UserEditData({
        id: rowId,
        userName: userName,
        email: email,
        password: password,
        remarks: remark,
        image: base64Image,
        designationId: designation,
        mobile: mobileNo,
        departmentId: department,
        // chknDob: isDOBCheck,
        roleId: role,
        dob: selectedDOB,
        inActive: isActive
      }, handleEditeSuccess, handleException);
    }
  };

  const handleSuccess = (dataObject) => {
    console.log("the dataObject ", dataObject);
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      ClearData();
      handleClose();
      setLoading(false)
    }, 2000);
  };

  const handleEditeSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      ClearData();
      handleClose();
      setLoading(false)
    }, 2000);
  }

  const handleException = (errorObject, errorMessage) => {
    console.log("the error ", errorMessage);
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
    setTimeout(() => {
      // ClearData();
      // handleClose();
      setLoading(false)
    }, 2000);
  };

  const ClearData = () => {
    setOpen(false);
    setUserName('');
    setPassword('');
    setEmail('');
    setBase64Image('');
    setDesignation('');
    setMobileNo('');
    setDepartment('');
    setIsDOBCheck(false);
    setIsActive(false);
    setRemark('');
    setSelectedDOB('');
    setImageFlag(false)
    setRefreshData(oldvalue => !oldvalue);
  }

  const loaderData = () => {
    setRowId(configSetupData?.id || '')
    setUserName(configSetupData?.userName || '');
    setEmail(configSetupData?.email || '');
    setDesignation(configSetupData?.designationId || '');
    setMobileNo(configSetupData?.mobile || '');
    setDepartment(configSetupData?.departmentId || '');
    setRole(configSetupData?.userRoleId || '');
    setSelectedDOB(configSetupData?.dob || '');
    setIsActive(configSetupData?.inActive || '');
    setRemark(configSetupData?.remarks || '');
    setBase64Image(configSetupData?.image || '')
    setPassword('');
  }



  const handleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Check if the selected file meets the dimensions criteria (225x225)
    if (selectedFile) {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);

      img.onload = () => {
        // if (img.width === 225 && img.height === 225) {
        setFile(selectedFile);

        // Convert the selected file to base64
        const reader = new FileReader();

        reader.onloadend = () => {
          setBase64Image(reader.result);
          setImageFlag(true)
        };

        reader.readAsDataURL(selectedFile);
        // } else {
        //   // Display an error message or handle accordingly
        //   alert('Please upload an image with dimensions 225x225.');
        // }
      };
    }
  };

  const validateForNullValue = (value, type) => {
    if (value !== null && value !== undefined) {
      AddUserValidate(value, type, setErrorObject);
    }
  };

  const baseUrl = process.env.REACT_APP_API_URL;
  const urlParts = baseUrl.split('api/');

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
      maxWidth="sm"
      open={open}
    >
      <DialogTitle style={{ background: '#002D68', color: 'white' }}>
        {isAddButton ? 'Add User' : 'Edit User'}
      </DialogTitle>
      <DialogContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <TextField
                id="filled-basic"
                label="User Name"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                fullWidth
                size='small'
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="User Name"
                // onBlur={() => validateForNullValue(userName, 'userName')}
                autoComplete="off"
              // error={errorObject?.userName?.errorStatus}
              // helperText={errorObject?.userName?.helperText}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <TextField
                id="filled-basic"
                label="Email ID"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                size='small'
                fullWidth
                // required
                value={email}
                placeholder="Email ID"
                onChange={(e) => setEmail(e.target.value)}
                // onBlur={() => validateForNullValue(email, 'email')}
                autoComplete="off"
              // error={errorObject?.email?.errorStatus}
              // helperText={errorObject?.email?.helperText}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <TextField
                id="filled-basic"
                label="Password"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                size='small'
                fullWidth
                // required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} marginTop={1}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">User Role</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Designation"
                  variant="filled"
                  size='small'
                  value={role}
                  required
                  onChange={(e) => setRole(e.target.value)}
                >
                  {/* <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="CRM">CRM</MenuItem>
                  <MenuItem value="Purchase">Purchase</MenuItem>
                  <MenuItem value="Invoice">Invoice</MenuItem>
                  <MenuItem value="Mgmt">Mgmt</MenuItem>
                  <MenuItem value="Dispatch ">Dispatch</MenuItem>
                  <MenuItem value="Dispatch Supervisor">Dispatch_Supervisor</MenuItem> */}
                  {roleList.map((data) => (
                    // <MenuItem key={data.id} value={data.id}>{data.department}</MenuItem>
                    <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} marginTop={1}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Designation</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Designation"
                  variant="filled"
                  size='small'
                  value={designation}
                  required
                  onChange={(e) => setDesignation(e.target.value)}
                >
                  {/* <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="CRM">CRM</MenuItem>
                  <MenuItem value="Purchase">Purchase</MenuItem>
                  <MenuItem value="Invoice">Invoice</MenuItem>
                  <MenuItem value="Mgmt">Mgmt</MenuItem>
                  <MenuItem value="Dispatch ">Dispatch</MenuItem>
                  <MenuItem value="Dispatch Supervisor">Dispatch_Supervisor</MenuItem> */}
                  {designationList.map((data) => (
                    // <MenuItem key={data.id} value={data.id}>{data.department}</MenuItem>
                    <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <TextField
                id="filled-basic"
                label="Mobile No"
                variant="filled"
                // sx={{ mb: 1 }}
                margin="dense"
                size='small'
                fullWidth
                // required
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                placeholder="Mobile No"
                // onBlur={() => validateForNullValue(mobileNo, 'mobileNo')}
                autoComplete="off"
              // error={errorObject?.mobileNo?.errorStatus}
              // helperText={errorObject?.mobileNo?.helperText}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} marginTop={1}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Department</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Department"
                  variant="filled"
                  size='small'
                  value={department}
                  required
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {/* <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Account">Account</MenuItem>
                  <MenuItem value="Development">Development</MenuItem> */}
                  {departmentList.map((data) => (
                    // <MenuItem key={data.id} value={data.id}>{data.department}</MenuItem>
                    <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} marginTop={1}>
              <TextField
                type="file"
                id="outlined-basic"
                variant="outlined"
                // size='small'
                fullWidth
                onChange={handleFileChange}
                autoComplete="off"
                InputProps={{
                  inputProps: {
                    // accept: 'image/*',
                    accept: '.jpg, .jpeg, .png', // Accept both JPG and PNG
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              {base64Image && (
                <img
                  src={isAddButton || imageFlag === true ? base64Image : `${urlParts[0]}${base64Image}`} // Use base64Image for src
                  alt="Logo"
                  style={{ width: "110px", height: "110px" }}
                />
              )}
            </Grid>


            <Grid
              style={{
                display: 'flex',
                alignItems: 'center',
                // justifyContent: 'center'
              }}
              item
              xs={12}
              sm={12}
              md={4}
              lg={4}
              xl={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isDOBCheck}
                    onChange={(e) => setIsDOBCheck(e.target.checked)}
                  />
                }
                label="Chk DOB"
              />
            </Grid>


            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              {isDOBCheck && <TextField
                id="filled-basic"
                variant="filled"
                // sx={{ mb: 1 }}
                margin="dense"
                type="date"
                size='small'
                fullWidth
                required
                value={selectedDOB}
                onChange={(e) => setSelectedDOB(e.target.value)}
              />
              }
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}></Grid>

            <Grid
              style={{
                display: 'flex',
                alignItems: 'center',
                // justifyContent: 'center'
              }}
              item
              xs={12}
              sm={12}
              md={4}
              lg={4}
              xl={4}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                }
                label="In active"
              />
            </Grid>


            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              {isActive && <TextField
                id="filled-basic"
                label="Remarks"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                size='small'
                fullWidth
                required
                placeholder="Remarks"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}

              />}
            </Grid>

          </Grid>

          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              style={{
                width: '150px',
                background:
                  errorObject?.userName?.errorStatus ||
                    errorObject?.email?.errorStatus ||
                    errorObject?.mobileNo?.errorStatus
                    ? 'gray'
                    : '#002D68',
                color: 'white'
              }}
              disabled={
                errorObject?.userName?.errorStatus
                || errorObject?.email?.errorStatus
                || errorObject?.mobileNo?.errorStatus
                || loading === true
              }
            >
              {loading ? (
                <CircularProgress size={24} style={{ color: 'white' }} />
              ) : (isAddButton ? 'Add' : 'Update')}
            </Button>
            <Button
              variant="contained"
              style={{ width: '150px', background: '#002D68', color: 'white' }}
              onClick={() => {
                setOpen(false)
                loaderData();
                setErrorObject('');
                setImageFlag(false);
              }}
            >
              Cancel
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
  );
}

// export default UserModal;
const mapStateToProps = ({ }) => {
  // const { capacityMeasureList, departmentList } = config;
  return {}
}
export default connect(mapStateToProps, { addUser })(UserModal);
