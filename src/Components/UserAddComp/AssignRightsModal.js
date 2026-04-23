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
import './style.css'

function AssignRightsModal(props) {
    const { assignRightsDailogOpen, setAssignRightsDailogOpen, isAddButton, userData, setRefreshData, isSuperAdmin, configSetupData } = props;

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
    const [rowId, setRowId] = useState('')

    useEffect(() => {
        // ShowDesignation(handleShowDesignationSuccess, handleShowDesignationException);
        // ShowRole(handleShowRoleSuccess, handleShowRoleException);
        // ShowDepartment(handleShowDepartmentSuccess, handleShowDepartmentException);
        // loaderData()
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


    const validateForNullValue = (value, type) => {

    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isAddButton) {
            AddUser({
                userName: userName,
                email: email,
                password: password,
                remarks: remark,
                image: base64Image,
                designation: designation,
                mobile: mobileNo,
                department: department,
                // chknDob: isDOBCheck,
                role: role,
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
                designation: designation,
                mobile: mobileNo,
                department: department,
                // chknDob: isDOBCheck,
                role: role,
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
        }, 2000);
    };

    const ClearData = () => {
        setAssignRightsDailogOpen(false);
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
        setRefreshData(oldvalue => !oldvalue);
    }

    const loaderData = () => {
        setRowId(configSetupData?.id || '')
        setUserName(configSetupData?.userName || '');
        setEmail(configSetupData?.email || '');
        setDesignation(configSetupData?.designation || '');
        setMobileNo(configSetupData?.mobile || '');
        setDepartment(configSetupData?.department || '');
        setRole(configSetupData?.role || '');
        setSelectedDOB(configSetupData?.dob || '');
        setIsActive(configSetupData?.inActive || '');
        setRemark(configSetupData?.remarks || '');
        setBase64Image(configSetupData?.image || '')
        setPassword(configSetupData?.password || '');
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
                };

                reader.readAsDataURL(selectedFile);
                // } else {
                //   // Display an error message or handle accordingly
                //   alert('Please upload an image with dimensions 225x225.');
                // }
            };
        }
    };

    const assignRightsData = [
        {
            type: 'Transaction',
            menu: [{
                menuLabel: 'Purchase Order',
                Add: true,
                Edit: true,
                Delete: true,
                Print: true,
                View: true,
                Auth: true,
                Auth1: true,
                Opt1: true,
                Opt2: true,
                Opt3: true,
                Opt4: true,
            }]
        }
    ]


    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '50%' } }}
            maxWidth="xl"
            open={assignRightsDailogOpen}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {isAddButton ? 'Add User' : 'Edit User'}
            </DialogTitle>
            <DialogContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4} marginRight={1}>
                            <TextField
                                id="filled-basic"
                                label="User Code"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="User Name"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <TextField
                                id="filled-basic"
                                label="User Name"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="User Name"
                            />
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <table id="customers">
                                    <tr>
                                        <th>Type</th>
                                        <th>Menu</th>
                                        <th>Add</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                        <th>Print</th>
                                        <th>View</th>
                                        <th>Auth</th>
                                        <th>Auth1</th>
                                        <th>Opt-1</th>
                                        <th>Opt-2</th>
                                        <th>Opt-3</th>
                                        <th>Opt-4</th>
                                    </tr>
                                    <tr>
                                        <td rowSpan={2}>Transactions</td>
                                        <td>Purchase Order</td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                    </tr>
                                    <tr>
                                        <td>Purchase Request</td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                    </tr>

                                    {/* FOR MASTER */}
                                    <tr>
                                        <td rowSpan={2}>Masters</td>
                                        <td>Company Master</td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                    </tr>
                                    <tr>
                                        <td>Item Master</td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                    </tr>

                                    {/* FOR REPORTS */}
                                    <tr>
                                        <td rowSpan={2}>REPORTS</td>
                                        <td>STORE REPORTS</td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                    </tr>
                                    <tr>
                                        <td>PRICE REPORTS</td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                    </tr>

                                    {/* FOR UTILITIES */}
                                    <tr>
                                        <td rowSpan={2}>Utilities</td>
                                        <td>Demo Utility</td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                    </tr>
                                    <tr>
                                        <td>Test Utility</td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                        <td style={{ textAlign: 'center', alignItems: 'center' }}><input style={{ width: '20px', height: '20px' }} type='checkbox' /></td>
                                    </tr>
                                </table>
                            </Grid>
                        </Grid>
                    </Grid>

                    <DialogActions>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setAssignRightsDailogOpen(false)
                                loaderData();
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
export default connect(mapStateToProps, { addUser })(AssignRightsModal);
