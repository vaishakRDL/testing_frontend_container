import React, { useEffect, useState, } from 'react'
import { Grid, TextField, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Box, InputAdornment, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import RDL_Logo from '../../AllImage/RDL_Logo.png';
import MallikLoginPage from '../../AllImage/MallickLoginImage.jpg'
import { LoginService, UserPasswordChange } from '../../ApiService/LoginPageService';
import ApplicationStore from '../../Utility/localStorageUtil';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './Login.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordUserName, setPasswordUserName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errorFlag, setErrorFlag] = useState(false);

    useEffect(() => {
        const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
        if (userDetails?.accessToken) {
            navigate("/");
        }
    }, [navigate]);

    const successCaseCode = [200, 201];
    const [data, setData] = useState({
        userName: '',
        password: ''
    })

    function submit(e) {
        e.preventDefault();
        LoginService({ userName: data.userName, password: data.password })
            .then((response) => {
                if (successCaseCode.indexOf(response.status) > -1) {
                    setNotification({
                        status: true,
                        type: 'success',
                        message: 'Login Successful..!',
                    });
                    return response.json();
                }
                throw {
                    errorStatus: response.status,
                    errorObject: response.json(),
                };
            }).then((data) => {
                ApplicationStore().setStorage('userDetails', data);
                setTimeout(() => {
                    navigate("/MasterDashboard");
                }, 1500);
            }).catch((error) => {
                error?.errorObject?.then((errorResponse) => {
                    setNotification({
                        status: true,
                        type: 'error',
                        message: errorResponse.message || 'Login Failed',
                    });
                });
            });
    }

    const handleLogin = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    }

    const handleCloseNotify = () => {
        setNotification({ status: false, type: '', message: '' });
    };

    const handleConfirm = () => {
        if (oldPassword === newPassword) {
            setErrorFlag(true);
            return;
        }
        setErrorFlag(false);
        UserPasswordChange({
            userName: passwordUserName,
            oldPassword: oldPassword,
            newPassword: newPassword
        }, (dataObject) => {
            setNotification({
                status: true,
                type: 'success',
                message: dataObject.message,
            });
            setTimeout(() => {
                setOpen(false);
                setPasswordUserName('');
                setOldPassword('');
                setNewPassword('');
            }, 2000);
        }, (errorObject, errorMessage) => {
            setNotification({
                status: true,
                type: 'error',
                message: errorMessage,
            });
        });
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo-wrapper">
                    <img src={RDL_Logo} alt="RDL Logo" className="logo-img" />
                    <h1 className="login-title">Sign In</h1>
                    <p className="login-subtitle">Enter your credentials to access your account</p>
                </div>

                <form onSubmit={submit}>
                    <div className="input-group">
                        <TextField
                            fullWidth
                            label="Username"
                            name="userName"
                            variant="outlined"
                            className="custom-input"
                            value={data.userName}
                            onChange={handleLogin}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle sx={{ color: '#64748b', mr: 1 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>

                    <div className="input-group">
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            className="custom-input"
                            value={data.password}
                            onChange={handleLogin}
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: '#64748b', mr: 1 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <span className="change-password-link" onClick={() => setOpen(true)}>
                            Forgot or Change Password?
                        </span>
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="login-button"
                        size="large"
                    >
                        Sign In
                    </Button>
                </form>
            </div>

            <NotificationBar
                handleClose={handleCloseNotify}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, color: '#002d68' }}>Change Password</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={passwordUserName}
                            onChange={(e) => setPasswordUserName(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            error={errorFlag}
                            helperText={errorFlag ? "New password cannot be same as old" : ""}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleConfirm} variant="contained" sx={{ backgroundColor: '#002d68' }}>Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default LoginPage