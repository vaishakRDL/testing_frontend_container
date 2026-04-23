import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Card, CardContent, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
// import GroupMaster from './GroupMaster';
// import GroupMasterTitle from './MenuRightsTitle';
import MenuRights from './MenuRights';
import MenuRightsTitle from './MenuRightsTitle';
import { Button } from 'react-bootstrap';
import { AllShowMasterAdd, AllMasterDelete, ShowGroupMaster, GroupMasterDelete } from '../../ApiService/LoginPageService';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';

const MenuRightsResult = (props) => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [groupMasterData, setGroupMasterData] = useState([]);
    const [id, setId] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    //NEW STATE VARIBALES
    const [selectedMaster, setSelectedMaster] = useState('pm');
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const columns = [
        {
            field: 'type',

            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Type
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'menuName',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Menu
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'addData',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Add
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // console.log("params",params.row.addData)
                params.row.addData ?
                    <CheckBoxIcon
                        style={{ color: '#32CD32' }}
                    /> :
                    <CloseIcon
                        style={{ color: '#FF0000' }}
                    />
                // <FormControlLabel
                //     control={
                //         <Checkbox
                //             style={{ textAlign: 'center' }}
                //             checked={params.row.addData}
                //         // onChange={(e) => setIsOpt5(e.target.checked)}
                //         />
                //     }
                // />
            ),
        },
        {
            field: 'updateData',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Edit
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // console.log("params",params.row.addData)
                params.row.updateData ?
                    <CheckBoxIcon
                        style={{ color: '#32CD32' }}
                    /> :
                    <CloseIcon
                        style={{ color: '#FF0000' }}
                    />
                // <FormControlLabel
                //     control={
                //         <Checkbox
                //             style={{ textAlign: 'center' }}
                //             checked={params.row.addData}
                //         // onChange={(e) => setIsOpt5(e.target.checked)}
                //         />
                //     }
                // />
            ),
        },
        {
            field: 'deleteData',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Delete
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // console.log("params",params.row.addData)
                params.row.deleteData ?
                    <CheckBoxIcon
                        style={{ color: '#32CD32' }}
                    /> :
                    <CloseIcon
                        style={{ color: '#FF0000' }}
                    />
                // <FormControlLabel
                //     control={
                //         <Checkbox
                //             style={{ textAlign: 'center' }}
                //             checked={params.row.addData}
                //         // onChange={(e) => setIsOpt5(e.target.checked)}
                //         />
                //     }
                // />
            ),
        },
        {
            field: 'print',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Print
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // console.log("params",params.row.addData)
                params.row.print ?
                    <CheckBoxIcon
                        style={{ color: '#32CD32' }}
                    /> :
                    <CloseIcon
                        style={{ color: '#FF0000' }}
                    />
                // <FormControlLabel
                //     control={
                //         <Checkbox
                //             style={{ textAlign: 'center' }}
                //             checked={params.row.addData}
                //         // onChange={(e) => setIsOpt5(e.target.checked)}
                //         />
                //     }
                // />
            ),
        },
        {
            field: 'viewData',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    View
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // console.log("params",params.row.addData)
                params.row.viewData ?
                    <CheckBoxIcon
                        style={{ color: '#32CD32' }}
                    /> :
                    <CloseIcon
                        style={{ color: '#FF0000' }}
                    />
                // <FormControlLabel
                //     control={
                //         <Checkbox
                //             style={{ textAlign: 'center' }}
                //             checked={params.row.addData}
                //         // onChange={(e) => setIsOpt5(e.target.checked)}
                //         />
                //     }
                // />
            ),
        },
        {
            field: 'auth',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Auth
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // console.log("params",params.row.addData)
                params.row.auth ?
                    <CheckBoxIcon
                        style={{ color: '#32CD32' }}
                    /> :
                    <CloseIcon
                        style={{ color: '#FF0000' }}
                    />
                // <FormControlLabel
                //     control={
                //         <Checkbox
                //             style={{ textAlign: 'center' }}
                //             checked={params.row.addData}
                //         // onChange={(e) => setIsOpt5(e.target.checked)}
                //         />
                //     }
                // />
            ),
        },
        {
            field: 'auth1',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Auth1
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // console.log("params",params.row.addData)
                params.row.auth1 ?
                    <CheckBoxIcon
                        style={{ color: '#32CD32' }}
                    /> :
                    <CloseIcon
                        style={{ color: '#FF0000' }}
                    />
                // <FormControlLabel
                //     control={
                //         <Checkbox
                //             style={{ textAlign: 'center' }}
                //             checked={params.row.addData}
                //         // onChange={(e) => setIsOpt5(e.target.checked)}
                //         />
                //     }
                // />
            ),
        },
        {
            field: 'opt1',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Opt1
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // console.log("params",params.row.addData)
                params.row.opt1 ?
                    <CheckBoxIcon
                        style={{ color: '#32CD32' }}
                    /> :
                    <CloseIcon
                        style={{ color: '#FF0000' }}
                    />
                // <FormControlLabel
                //     control={
                //         <Checkbox
                //             style={{ textAlign: 'center' }}
                //             checked={params.row.addData}
                //         // onChange={(e) => setIsOpt5(e.target.checked)}
                //         />
                //     }
                // />
            ),
        },
        {
            field: 'opt2',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Opt2
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // console.log("params",params.row.addData)
                params.row.opt2 ?
                    <CheckBoxIcon
                        style={{ color: '#32CD32' }}
                    /> :
                    <CloseIcon
                        style={{ color: '#FF0000' }}
                    />
                // <FormControlLabel
                //     control={
                //         <Checkbox
                //             style={{ textAlign: 'center' }}
                //             checked={params.row.addData}
                //         // onChange={(e) => setIsOpt5(e.target.checked)}
                //         />
                //     }
                // />
            ),
        },
        {
            field: 'opt3',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Opt3
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // console.log("params",params.row.addData)
                params.row.opt3 ?
                    <CheckBoxIcon
                        style={{ color: '#32CD32' }}
                    /> :
                    <CloseIcon
                        style={{ color: '#FF0000' }}
                    />
                // <FormControlLabel
                //     control={
                //         <Checkbox
                //             style={{ textAlign: 'center' }}
                //             checked={params.row.addData}
                //         // onChange={(e) => setIsOpt5(e.target.checked)}
                //         />
                //     }
                // />
            ),
        },
        {
            field: 'opt4',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Opt4
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // console.log("params",params.row.addData)
                params.row.opt4 ?
                    <CheckBoxIcon
                        style={{ color: '#32CD32' }}
                    /> :
                    <CloseIcon
                        style={{ color: '#FF0000' }}
                    />
                // <FormControlLabel
                //     control={
                //         <Checkbox
                //             style={{ textAlign: 'center' }}
                //             checked={params.row.addData}
                //         // onChange={(e) => setIsOpt5(e.target.checked)}
                //         />
                //     }
                // />
            ),
        },
        {
            field: 'opt5',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Opt5
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center',
            renderCell: (params) => (
                // console.log("params",params.row.addData)
                params.row.opt5 ?
                    <CheckBoxIcon
                        style={{ color: '#32CD32' }}
                    /> :
                    <CloseIcon
                        style={{ color: '#FF0000' }}
                    />
                // <FormControlLabel
                //     control={
                //         <Checkbox
                //             style={{ textAlign: 'center' }}
                //             checked={params.row.addData}
                //         // onChange={(e) => setIsOpt5(e.target.checked)}
                //         />
                //     }
                // />
            ),
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span>,

            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];


    useEffect(() => {
        ShowGroupMaster(handleSucessShow, handleExceptionShow);
    }, [refreshData]);

    const handleSucessShow = (dataObject) => {
        setGroupMasterData(dataObject?.data || []);
        setGridLoading(false);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: '#000000' }}
                onClick={(event) => {
                    setIsAddButton(false);
                    setEditData(props.selectedRow);
                    setOpen(true);
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    setDeleteId(props.selectedRow.id);
                    setDeleteDailogOpen(true);
                }}
                style={{ color: 'black' }}
            />
        );
    }

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
        }, 3000);
    };
    const deletehandleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <MenuRightsTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '1px', borderRadius: '10px', width: '98%', height: '100%' }}>

                    <CardContent>
                        <DataGrid
                            rows={groupMasterData}
                            columns={columns}
                            pageSize={8}
                            loading={isLoading}
                            rowsPerPageOptions={[8]}
                            disableSelectionOnClick
                            style={{ border: 'none', }}
                            sx={{
                                overflow: 'auto',
                                height: '50vh',
                                // minHeight: '500px',
                                width: '100%',
                                '& .super-app-theme--header': {
                                    WebkitTextStrokeWidth: '0.6px',

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
                        />
                    </CardContent>
                </Card>

            </div>

            <MenuRights
                isAddButton={isAddButton}
                currencyData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
                configSetupData={editData}
            />

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                selectedMaster={selectedMaster}
                deleteService={GroupMasterDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default MenuRightsResult
