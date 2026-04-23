
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    TextField,
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Select
}
    from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AllMasterAdd, AllMasterUpdate, AllShowMasterAdd, AddGroupMaster, GroupMasterEdit } from '../../ApiService/LoginPageService';

const MenuRights = (props) => {
    const { open, setOpen, isAddButton, currencyData, setRefreshData, configSetupData } = props;
    console.log("configSetupDataconfigSetupData", configSetupData)

    // MENU MASTER TYPES
    const [menuListData, setMenuListData] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedMenu, setSelectedMenu] = useState('');
    const [code, setCode] = useState('');
    const [isAdd, setIsAdd] = useState(false);
    const [isedit, setIsEdit] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isPrint, setIsPrint] = useState(false);
    const [isView, setIsView] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [isAuth1, setIsAuth1] = useState(false);
    const [isOpt1, setIsOpt1] = useState(false);
    const [isOpt2, setIsOpt2] = useState(false);
    const [isOpt3, setIsOpt3] = useState(false);
    const [isOpt4, setIsOpt4] = useState(false);
    const [isOpt5, setIsOpt5] = useState(false);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [rowId, setRowId] = useState('')

    useEffect(() => {

        AllShowMasterAdd({
            masterType: 'menu'
        }, handleSucessShow, handleExceptionShow);
        !isAddButton && loaderData();
    }, [currencyData]);

    const handleSucessShow = (dataObject) => {
        setMenuListData(dataObject?.data || []);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

    }


    const handleSubmit = (e) => {

        e.preventDefault();
        if (isAddButton) {
            AddGroupMaster({
                type: selectedType,
                menuId: selectedMenu,
                add: isAdd,
                update: isedit,
                delete: isDelete,
                view: isView,
                print: isPrint,
                auth: isAuth,
                auth1: isAuth1,
                opt1: isOpt1,
                opt2: isOpt2,
                opt3: isOpt3,
                opt4: isOpt4,
                opt5: isOpt5
            }, handleSuccess, handleException)
        } else {
            GroupMasterEdit({
                id: rowId,
                type: selectedType,
                menuId: selectedMenu,
                add: isAdd,
                update: isedit,
                delete: isDelete,
                view: isView,
                print: isPrint,
                auth: isAuth,
                auth1: isAuth1,
                opt1: isOpt1,
                opt2: isOpt2,
                opt3: isOpt3,
                opt4: isOpt4,
                opt5: isOpt5
            }, handleSuccess, handleException)
        }
    }

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
        // setIsActive(false);
        // setSelectedMaster('');
        // setMasterId('');
        // setCode('');
        // setName('');
        // setDescription('');
        // setInactiveRemarks('');
        // setOpen(false);
        setRefreshData(oldvalue => !oldvalue);
        setMenuListData([]);
        setSelectedType('');
        setSelectedMenu('');
        setIsAdd(false);
        setIsEdit(false);
        setIsDelete(false);
        setIsPrint(false);
        setIsView(false);
        setIsAuth(false);
        setIsAuth1(false);
        setIsOpt1(false);
        setIsOpt2(false);
        setIsOpt3(false);
        setIsOpt4(false);
        setIsOpt5(false);
        setCode('');
    }


    const loaderData = () => {
        setRowId(configSetupData?.id)
        setSelectedType(configSetupData?.type);
        setSelectedMenu(configSetupData?.menuId);
        setCode(configSetupData?.code);
        setIsAdd(configSetupData?.addData);
        setIsEdit(configSetupData?.updateData)
        setIsDelete(configSetupData?.deleteData);
        setIsPrint(configSetupData?.print);
        setIsView(configSetupData?.viewData);
        setIsAuth(configSetupData?.auth);
        setIsAuth1(configSetupData?.auth1);
        setIsOpt1(configSetupData?.opt1);
        setIsOpt2(configSetupData?.opt2);
        setIsOpt3(configSetupData?.opt3);
        setIsOpt4(configSetupData?.opt4);
        setIsOpt5(configSetupData?.opt5);
    }
    console.log("jhfjdfhgdfvhgdsfvhgsdfvhdsfv", isAdd);
    const validateForNullValue = (value, type) => {

    };

    const handleClose = () => {
        setOpen(false);
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const typeList = [
        { id: 1, typeName: 'Transactions', typeValue: 'transactions' },
        { id: 1, typeName: 'Masters', typeValue: 'masters' },
        { id: 1, typeName: 'Reports', typeValue: 'reports' },
        { id: 1, typeName: 'Utilities', typeValue: 'utilities' },
    ]

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '60%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Group Rights
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                            <FormControl fullWidth style={{ marginTop: '10px' }}>
                                <InputLabel id="demo-simple-select-label">Select Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedType}
                                    label="Select Type"
                                    variant="filled"
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    {typeList.map((data) => (
                                        <MenuItem key={data.id} value={data.typeName}>{data.typeName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                            <FormControl fullWidth style={{ marginTop: '10px' }}>
                                <InputLabel id="demo-simple-select-label">Select Menu</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedMenu}
                                    label="Select Menu"
                                    variant="filled"
                                    onChange={(e) => {
                                        menuListData.map((data) => {
                                            data.id === e.target.value &&
                                                setSelectedMenu(data.id)
                                            setCode(data.code)
                                        }
                                        )
                                    }}
                                >
                                    {menuListData.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <TextField
                                id="filled-basic"
                                label="Menu Code"
                                variant="filled"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value)
                                }}
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                placeholder="Menu Code"

                            />
                        </Grid>

                        <Grid
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
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
                                        checked={isAdd}
                                        value={isAdd}
                                        onChange={(e) => setIsAdd(e.target.checked)}
                                    />
                                }
                                label="Add"
                            />
                        </Grid>

                        <Grid
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
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
                                        checked={isedit}
                                        value={isedit}
                                        onChange={(e) => setIsEdit(e.target.checked)}
                                    />
                                }
                                label="Edit"
                            />
                        </Grid>

                        <Grid
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
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
                                        checked={isDelete}
                                        value={isDelete}
                                        onChange={(e) => setIsDelete(e.target.checked)}
                                    />
                                }
                                label="Delete"
                            />
                        </Grid>

                        <Grid
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
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
                                        checked={isPrint}
                                        value={isPrint}
                                        onChange={(e) => setIsPrint(e.target.checked)}
                                    />
                                }
                                label="Print"
                            />
                        </Grid>

                        <Grid
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
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
                                        checked={isView}
                                        value={isView}
                                        onChange={(e) => setIsView(e.target.checked)}
                                    />
                                }
                                label="View"
                            />
                        </Grid>

                        <Grid
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
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
                                        checked={isAuth}
                                        value={isAuth}
                                        onChange={(e) => setIsAuth(e.target.checked)}
                                    />
                                }
                                label="Auth"
                            />
                        </Grid>

                        <Grid
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
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
                                        checked={isAuth1}
                                        value={isAuth1}
                                        onChange={(e) => setIsAuth1(e.target.checked)}
                                    />
                                }
                                label="Auth1"
                            />
                        </Grid>

                        <Grid
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
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
                                        checked={isOpt1}
                                        value={isOpt1}
                                        onChange={(e) => setIsOpt1(e.target.checked)}
                                    />
                                }
                                label="Opt1"
                            />
                        </Grid>

                        <Grid
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
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
                                        checked={isOpt2}
                                        value={isOpt2}
                                        onChange={(e) => setIsOpt2(e.target.checked)}
                                    />
                                }
                                label="Opt2"
                            />
                        </Grid>

                        <Grid
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
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
                                        checked={isOpt3}
                                        value={isOpt3}
                                        onChange={(e) => setIsOpt3(e.target.checked)}
                                    />
                                }
                                label="Opt3"
                            />
                        </Grid>

                        <Grid
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
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
                                        checked={isOpt4}
                                        value={isOpt4}
                                        onChange={(e) => setIsOpt4(e.target.checked)}
                                    />
                                }
                                label="Opt4"
                            />
                        </Grid>

                        <Grid
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start'
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
                                        checked={isOpt5}
                                        onChange={(e) => setIsOpt5(e.target.checked)}
                                    />
                                }
                                label="Opt5"
                            />
                        </Grid>

                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            // disabled={
                            //     errorObject?.customerId?.errorStatus
                            //     || errorObject?.GSTNumber?.errorStatus
                            //     || errorObject?.customerName?.errorStatus
                            //     || errorObject?.billingAddress?.errorStatus
                            //     || errorObject?.address?.errorStatus
                            //     || errorObject?.shippingAddress?.errorStatus
                            //     || errorObject?.contactPersonName?.errorStatus
                            //     || errorObject?.primaryContactnumber?.errorStatus
                            //     || errorObject?.phoneNumber?.errorStatus
                            //     || errorObject?.email?.errorStatus
                            // }
                            type="submit"

                        >
                            {isAddButton ? 'Add' : 'Update'}
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setOpen(false);
                                loaderData();
                                ClearData();
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

        </Dialog >
    )
}

export default MenuRights

