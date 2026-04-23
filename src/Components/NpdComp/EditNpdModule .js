import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment, Card,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { AddHoliday, AddHolidayUpdate, NpdRevisionDELETE, NpdRevisionId, SobUpdate, } from '../../ApiService/LoginPageService';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import AddRevision from './AddRevision';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';

const EditNpdModule = ({ editOpen, setEditOpen,  editData }) => {

    const [holiday, setHoliday] = useState('');
    const [holidayOccasion, setHolidayOccasion] = useState('');
    const [Description, setDescription] = useState('');
    const [open, setOpen] = useState(false);
    const [editDocumentList, setEditDocument] = useState([]);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [refreshData,setRefreshData] = useState(false);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        NpdRevisionId({
            id: editData?.id
        }, handleNpdRevisionIdSuccess, handleNpdRevisionIdException);
    }, [editData,refreshData]);

    const handleNpdRevisionIdSuccess = (dataObject) => {
        setEditDocument(dataObject?.data || []);

    }

    const handleNpdRevisionIdException = () => {

    }
    const ClearData = () => {
        setHoliday('');
        setHolidayOccasion('');
        setDescription('');
    }

    const handleSubmit = (e) => {

    }

    const handleSobAddSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });

        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();

            ClearData();
        }, 3000);
    }

    const handleSobAddException = () => {

    }
    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const columns = [
        {
            field: 'sNo',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'version',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Version
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'revisionNo',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Revision No
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'left',
            headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Remarks
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'left',
            headerAlign: 'center'
        },
        // {
        //     field: 'description',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //         Amt Revision
        //     </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'left',
        //     headerAlign: 'center'
        // },

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
                // <EditData selectedRow={params.row} />,
                <DeleteData selectedRow={params.row} />,
            ],
        },
    ];

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: 'black' }}
                onClick={(event) => {

                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    setDeleteId(props.selectedRow.id)
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

        setTimeout(() => {
            setRefreshData((oldvalue) => !oldvalue);
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


    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            fullScreen
            open={editOpen}
        >
            {/* <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add Holiday' : 'Edit Holiday'}

            </DialogTitle> */}
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} lg={4} xl={4} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Typography style={{ fontWeight: 'bold', fontSize: '30px' }}>
                                Edit Document
                            </Typography>
                        </Grid>
                        {/* <Grid item xs={12} sm={12} lg={4} xl={4}>
                            <Button
                                variant="contained"
                                style={{ width: '250px', background: '#002D68', color: 'white' }}
                                onClick={(e) => {

                                }}
                            >
                                Set Drawimg as Default
                            </Button>
                        </Grid> */}
                        <Grid item xs={12} sm={12} lg={4} xl={4}>
                            <Button
                                variant="contained"
                                style={{ width: '250px', background: '#002D68', color: 'white' }}
                                onClick={(e) => {
                                    setOpen(true);
                                }}
                            >
                                Add Revision
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={12} xl={12}>
                            <Card style={{ borderRadius: '8px', height: '750px', marginTop: '10px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                                <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <DataGrid
                                        rows={editDocumentList}
                                        columns={columns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', fontWeight: 'bold' }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '75vh',
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
                        </Grid>
                    </Grid>

                </DialogContent>

                <DialogActions>

                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setEditOpen(false);
                            ClearData();
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
                <NotificationBar
                    handleClose={handleClose}
                    notificationContent={openNotification.message}
                    openNotification={openNotification.status}
                    type={openNotification.type}
                />

                <AddRevision
                    Open={open}
                    setOpen={setOpen}
                    editData={editData}
                    setRefreshData={setRefreshData}
                />
                <DeleteConfirmationDailog
                    open={deleteDailogOpen}
                    setOpen={setDeleteDailogOpen}
                    deleteId={deleteId}
                    deleteService={NpdRevisionDELETE}
                    handleSuccess={deletehandleSuccess}
                    handleException={deletehandleException}
                />


            </form>
        </Dialog>
    )
}

export default EditNpdModule 
