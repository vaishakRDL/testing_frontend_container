import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Button, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { DeleteHoliday, NpdDltLogShow, ShowHoliday } from '../../ApiService/LoginPageService';

import DeleteLogTitle from './DeleteLogTitle';

const DeletLog = () => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [isDrawing, setIsDrawing] = useState(true);
    const [editData, setEditData] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [masterData, serMasterData] = useState([]);

    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(true);
    const [selectedItemNo, setSelectedItemNo] = useState('0');
    const [selectedRevision, setSelectedRevision] = useState('0');
    const [deleteId, setDeleteId] = useState('');
    const [deleteLogData, setDeleteLogData] = useState([]);
    const [isTimeSlot, setIsTimeSlot] = useState(0);

    const [editOpen, setEditOpen] = useState(false);
    //NEW STATE VARIBALES
    const [selectedMaster, setSelectedMaster] = useState('pm');
    //


    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

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
            field: 'item',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'Left',
            headerAlign: 'center'
        },
        {
            field: 'fileType',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                File Type
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'left',
            headerAlign: 'center'
        },
        {
            field: 'deletedAt',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Deleted Date
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'left',
            headerAlign: 'center'
        },
        {
            field: 'deletedBy',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Deleted By
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'left',
            headerAlign: 'center'
        },
        {
            field: 'Drawimg',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                Drawing Version
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'left',
            headerAlign: 'center'
        },
        {
            field: 'Revision',
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
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Actions
        //         </span>,
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         <EditData selectedRow={params.row} />,
        //         <DeleteData selectedRow={params.row} />,
        //     ],
        // },
    ];


    useEffect(() => {
        NpdDltLogShow(handleSobShowDataSuccess, handleSobShowDataException);
    }, [refreshData]);

    const handleSobShowDataSuccess = (dataObject) => {
        setDeleteLogData(dataObject?.data || []);
    }

    const handleSobShowDataException = (errorObject, errorMessage) => {

    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: 'black' }}
                onClick={(event) => {
                    setOpen(true);
                    setIsAddButton(false);
                    setEditData(props.selectedRow);
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
                    setSelectedItemNo(props?.selectedRow?.item || '0');
                    setSelectedRevision(props?.selectedRow?.revision || '0');
                }}
                style={{ color: 'black' }}
            />
        );
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleSucessShow = (dataObject) => {
        serMasterData(dataObject?.data || []);
        setGridLoading(false);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

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


    const options = deleteLogData.map(item => ({
        id: item?.id,
        label: item?.itemId
    }));

    
    const handleAutocompleteChange = (selectedValue) => {
        // const selectedItem = itemShowList.find(item => item.id === selectedValue?.id);
        // setItemShowList(selectedItem ? [selectedItem] : []);
        // setItemSelected(selectedValue?.id)

    };
    const textEntery = (e) => {

        // ItemSearchNAAJ({
        //     text: e.target.value
        // }, handleItemSearchNAAJSucees, handleItemSearchNAAJException);

    }
    return (
        <div style={{ height: '80vh', width: '98%', marginLeft: '15px' }}>
            <DeleteLogTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
                setIsDrawing={setIsDrawing}

            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '100%', height: '100%' }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <FormControl style={{ width: '100%' }}>
                                    <Autocomplete
                                        fullWidth
                                        disablePortal
                                        id="combo-box-demo"
                                        options={options}
                                        // sx={{ width: 300 }}
                                        renderInput={(params) => <TextField {...params} label="Search By Item Code "
                                            onChange={textEntery}
                                        />}
                                        onChange={(event, value) => handleAutocompleteChange(value)}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                                <Card style={{ borderRadius: '8px', height: '500px', marginTop: '10px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                                    <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <DataGrid
                                            rows={deleteLogData}
                                            columns={columns}
                                            pageSize={8}
                                            // loading={isLoading}
                                            rowsPerPageOptions={[8]}
                                            disableSelectionOnClick
                                            style={{ border: 'none', fontWeight: 'bold' }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '60vh',
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
                    </CardContent>
                </Card>

            </div>



            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            {/* <DeleteConfirmationDailogNpd
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                deleteService={DeleteHoliday}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
                selectedItemNo={selectedItemNo}
                selectedRevision={selectedRevision}
            /> */}

        </div>
    )
}

export default DeletLog
