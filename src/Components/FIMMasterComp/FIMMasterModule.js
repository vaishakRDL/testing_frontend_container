import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { CheckBox } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from '@mui/material/Autocomplete';
import { FIMIDDataShow, HSNCodeDataShow, ItemAdd, ItemGroupShowMaster, ItemUpdate, MainLocationDataShow, ProductFamilyDataShow, ProductFinishDataShow, RMItemcodeDataShow, SubLocationDataShow, UOMShowMaster, UnderLedgerDataShow } from '../../ApiService/LoginPageService';


const FIMMasterModule = ({
    open, setOpen, isAddButton, editData, setRefreshData,
}) => {
    const [fimCode, setFIMCode] = useState('');
    const [fimName, setFIMName] = useState('');
    const [isActive, setIsActive] = useState('');
    const [isEdit, setIsEdit] = useState(true);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const handleSubmit = (e) => { }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const columns = [
        {
            field: 'headerName',
            headerName: 'Header Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'value',
            headerName: 'Values',
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false,
            renderCell: (params) => [
                <FieldsAction selectedRow={params.row} />,
            ],
        },


    ];
    function FieldsAction(props) {
        return (
            <>

            </>
        );

    }
    const HeaderRows = [
        { id: 1, headerName: 'NON SOB', value: 'Rupee' },

    ]


    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {isAddButton ? 'Add FIM Master ' : 'Edit FIM Master'}

            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        id="filled-basic"
                                        label="FIM Code"
                                        variant="filled"
                                        sx={{ mb: 1 }}
                                        margin="dense"
                                        fullWidth
                                        required
                                        value={fimCode}
                                        placeholder="FIM Code"
                                        onChange={(e) => {
                                            setFIMCode(e.target.value);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        id="filled-basic"
                                        label="FIM Name"
                                        variant="filled"
                                        sx={{ mb: 1 }}
                                        margin="dense"
                                        fullWidth
                                        required
                                        value={fimName}
                                        placeholder="FIM Name"
                                        onChange={(e) => {
                                            setFIMName(e.target.value);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                    <FormControlLabel control={<Checkbox />} label="In Active" />
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '0px', borderRadius: '10px', width: '100%', height: '550px' }}>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} style={{ display: 'flex' }}>
                                            <Typography style={{ fontWeight: 'bold' }}>
                                                Header Info
                                            </Typography>

                                        </Grid>
                                        <Grid item xs={12}>
                                            <DataGrid
                                                rows={HeaderRows}
                                                columns={columns}
                                                pageSize={8}
                                                // loading={isLoading}
                                                rowsPerPageOptions={[8]}
                                                disableSelectionOnClick
                                                style={{ border: 'none', }}
                                                sx={{
                                                    height: '400px',
                                                    // minHeight: '520px',
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

                                        </Grid>
                                        <Button variant="outlined" onClick={() => setIsEdit(!isEdit)} sx={{ position: 'absolute', bottom: 10, margin: '10px' }}>{isEdit ? "Edit" : "Cancel"}</Button>
                                    </Grid>

                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        type="submit" >
                        {isAddButton ? 'Add' : 'Update'}
                    </Button>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);

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

            </form>
        </Dialog>
    )
}

export default FIMMasterModule