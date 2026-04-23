import React, { useEffect, useState } from 'react';
import {
    Button, Grid, Dialog, DialogContent, DialogTitle, TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Box
} from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import { DataGrid } from '@mui/x-data-grid';
import { GetGRN_FIFO } from '../../ApiService/LoginPageService';

const columns = [
    {
        headerClassName: 'super-app-theme--header',
        field: 'location',
        headerName: 'Location',
        sortable: true,
        width: 160,
        align: 'center',
        headerAlign: 'center',
    },
    {
        headerClassName: 'super-app-theme--header',
        field: 'docType',
        headerName: 'Doc Type',
        sortable: true,
        width: 160,
        align: 'center',
        headerAlign: 'center',
    },
    {
        headerClassName: 'super-app-theme--header',
        field: 'date',
        headerName: 'Doc Date',
        type: 'number',
        sortable: true,
        width: 160,
        align: 'center',
        headerAlign: 'center',
    },
    {
        headerClassName: 'super-app-theme--header',
        field: 'docNo',
        headerName: 'Doc No',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        width: 160,
        align: 'center',
        headerAlign: 'center',
    },
    {
        headerClassName: 'super-app-theme--header',
        field: 'Cum Iss Qty',
        headerName: 'Cum Iss Qty',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        width: 160,
        align: 'center',
        headerAlign: 'center',
    },
    {
        headerClassName: 'super-app-theme--header',
        field: 'Iss Doc Type',
        headerName: 'Iss Doc Type',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        width: 160,
        align: 'center',
        headerAlign: 'center',
    },
    {
        headerClassName: 'super-app-theme--header',
        field: 'Iss Doc No',
        headerName: 'Iss Doc No',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        width: 160,
        align: 'center',
        headerAlign: 'center',
    },
    {
        headerClassName: 'super-app-theme--header',
        field: 'Iss Doc Date',
        headerName: 'Iss Doc Date',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        width: 160,
        align: 'center',
        headerAlign: 'center',
    },
    {
        headerClassName: 'super-app-theme--header',
        field: 'Iss Doc Qty',
        headerName: 'Iss Doc Qty',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        width: 160,
        align: 'center',
        headerAlign: 'center',
    },
    {
        headerClassName: 'super-app-theme--header',
        field: 'Cum ST Qty',
        headerName: 'Cum ST Qty',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        width: 160,
        align: 'center',
        headerAlign: 'center',
    },
    {
        headerClassName: 'super-app-theme--header',
        field: 'ST Doc No',
        headerName: 'ST Doc No',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        width: 160,
        align: 'center',
        headerAlign: 'center',
    },
    {
        headerClassName: 'super-app-theme--header',
        field: 'ST Doc Date',
        headerName: 'ST Doc Date',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        width: 160,
        align: 'center',
        headerAlign: 'center',
    },
    {
        headerClassName: 'super-app-theme--header',
        field: 'ST Doc Qty',
        headerName: 'ST Doc Qty',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        width: 160,
        align: 'center',
        headerAlign: 'center',
    },
    {
        headerClassName: 'super-app-theme--header',
        field: 'Pending Qty',
        headerName: 'Pending Qty',
        description: 'This column has a value getter and is not sortable.',
        sortable: true,
        width: 160,
        align: 'center',
        headerAlign: 'center',
    },
];

const GRN_FIFO_Module = (props) => {
    const { open, setOpen, setSelectedTransaction, selectedItemId, fromDate, toDate } = props;
    const [grnFifoData, setGrnFifoData] = useState([]);

    useEffect(() => {
        open && GetGRN_FIFO({ id: selectedItemId, from: fromDate, to: toDate }, handleSuccess, handleException);
    }, [open])

    const handleSuccess = (dataObject) => {
        setGrnFifoData(dataObject?.data || [])
    }
    const handleException = () => { }

    return (
        <Dialog
            fullWidth
            maxWidth="xl"
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            open={open}
        >
            <form >
                <DialogTitle>
                    GRN FIFO
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ height: 500, width: '100%' }}>
                        <DataGrid
                            rows={grnFifoData}
                            columns={columns}
                            pageSize={8}
                            rowsPerPageOptions={[8]}
                            disableSelectionOnClick
                            style={{ border: 'none', }}
                            sx={{
                                height: '500px',
                                width: '100%',
                                '& .super-app-theme--header': {
                                    WebkitTextStrokeWidth: '0.6px',
                                    backgroundColor: '#93bce6',
                                    color: '#1c1919',
                                    fontWeight: 'bold'
                                },
                                '& .MuiDataGrid-cell': {
                                    border: '1px solid #969696',
                                },
                                '& .MuiDataGrid-columnHeader': {
                                    border: '1px solid #969696',
                                },
                            }}
                            getRowClassName={(params) => {
                                const rowIndex = grnFifoData.findIndex(row => row.id === params.row.id);
                                if (rowIndex !== -1) {
                                    console.log(' ');
                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                }
                                return '';
                            }}
                            rowHeight={40}
                            columnHeaderHeight={40}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ margin: '10px' }}>
                    <Button
                        size="large"
                        autoFocus
                        onClick={() => {
                            setOpen(false)
                            setSelectedTransaction('')
                            setGrnFifoData([]);
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </form >
        </Dialog >
    );
}
export default GRN_FIFO_Module;