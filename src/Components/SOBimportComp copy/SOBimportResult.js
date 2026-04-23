import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Button } from 'react-bootstrap';
import SearchIcon from "@mui/icons-material/Search";
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import SOBLimportTitle from './SOBLimportTitle';
import SOBimportModule from './SOBimportModule';
import { SobShowData } from '../../ApiService/LoginPageService';

const SOBimportResult = ({cslId}) => {
    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editData, setEditData] = useState([]);
    const [isLoading, setGridLoading] = useState(true);
    const [masterData, serMasterData] = useState([]);
    const [id, setId] = useState('');
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [kanbanDate, setKanbanDate] = useState('');
    const [totalRecord, setTotalRecord] = useState('0');
    const [sobDataList, setSobDataList] = useState([]);

    //NEW STATE VARIBALES
    const [selectedMaster, setSelectedMaster] = useState('pm');
    //

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const top100Films = [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },
        { label: 'The Dark Knight', year: 2008 },
        { label: '12 Angry Men', year: 1957 },

    ];


    const columns = [
        {
            field: 'contractNo',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Contract No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'fimNo',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    FIMNo
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'msd',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                MSD
            </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

        {
            field: 'sheetName',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Sheet Name
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        // {
        //     field: 'BOXNO',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Error
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center'
        // },
        // {
        //     field: ' ErrorDescription',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Error Description
        //         </span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
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


    useEffect(() => {
        SobShowData(handleSobShowDataSuccess, handleSobShowDataException);
    }, [refreshData]);

    const handleSobShowDataSuccess = (dataObject) => {
        setGridLoading(false);
        setSobDataList(dataObject?.data || []);

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


    const options = sobDataList.map(item => ({
        id: item?.id,
        label: item?.contractNo
    }));

    function handleAutocompleteChange(selectedValue) {
        // Your logic here with the selected value
        console.log("Selected Value:", selectedValue);
    }


    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <SOBLimportTitle
                setIsAddButton={setIsAddButton}
                setEditData={setEditData}
                setOpen={setOpen}
                cslId={cslId}
            />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent>
                        <Grid item xs={12} md={12} lg={12} sm={12} style={{ display: 'flex',alignItems: 'center' }}>

                            {/* <Card style={{ borderRadius: '8px', height: '85px' }}>
                        <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
                         <FormControl style={{ width: '20%' }}>
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="combo-box-demo"
                                options={options}
                                // sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Search By Item Code " />}
                                onChange={(event, value) => handleAutocompleteChange(value)}
                            />
                         </FormControl>
                            <TextField
                                id="outlined-basic"
                                label="Total Number of Records Loaded"
                                variant="outlined"
                                type='text'
                                value={totalRecord}
                                disabled={true}
                                onChange={(e) => {
                                    setTotalRecord(e.target.value);
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { fontWeight: 'bold', fontSize: '15.5px', color: 'black' }
                                }}
                                style={{ margin: '10px' }}
                            />
                            <TextField
                                id="outlined-basic"
                                label="KANBAN Date"
                                variant="outlined"
                                type='date'
                                value={kanbanDate}
                                onChange={(e) => {
                                    setKanbanDate(e.target.value);
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                    style: { fontWeight: 'bold', fontSize: '16px', color: 'black' }
                                }}
                                style={{ margin: '10px' }}
                            />
                            {/* </CardContent>
                    </Card> */}
                        </Grid>
                        <Card style={{ borderRadius: '8px', height: '450px', marginTop: '10px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
                            <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <DataGrid
                                    rows={sobDataList}
                                    columns={columns}
                                    pageSize={8}
                                    loading={isLoading}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none', fontWeight: 'bold' }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '45vh',
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
                    </CardContent>
                </Card>

            </div>

            <SOBimportModule
                isAddButton={isAddButton}
                editData={editData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
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
                // deleteService={AllMasterDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default SOBimportResult