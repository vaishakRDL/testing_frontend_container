import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { GSTInvshowdc } from '../../../ApiService/LoginPageService';

const DCGstSelectionModel = ({ dcSelectionModalOpen, setDcSelectionModalOpen, partNo, selectedItems }) => {
    const [showSecondGrid, setShowSecondGrid] = useState(false);
    const [rows, setRows] = useState('');
    const [refreshData, setRefreshData] = useState(false);
    const [dcData, setdcData] = useState([]);
    const [selectedrowsprocess, setSelectedRowsProcess] = useState([])
    const [dcValue, setDcValue] = useState(0);

    const handleOK = () => {
        setShowSecondGrid(true);
    };

    const handleClose = () => {
        setDcSelectionModalOpen(false);
        setRefreshData(!refreshData); 
    };

    const handleGSTshowDc = (dataObject) => {
        setdcData(dataObject?.data || []);
    }

    const handleGSTshowDcException = () => {

    }

    const handleRowCheckboxChange = (row) => {
        let newSelected = [];
        if (!selectedrowsprocess.find((selectedRow) => selectedRow.id === row.id)) {
            newSelected = [...selectedrowsprocess, row];
        } else {
            newSelected = selectedrowsprocess.filter(
                (selectedRow) => selectedRow.id !== row.id
            );
        }
        setSelectedRowsProcess(newSelected);
        console.log("newSelected", newSelected);
    };

    const columns = [
        {
            field: 'select',
            headerClassName: 'super-app-theme--header',
            headerAlign: "center",
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.skip} 
                    onChange={() => handleRowCheckboxChange(params.row)} 
                />
            ),
        },
        {
            field: 'partName',
            headerClassName: 'super-app-theme--header',
            headerName: 'Part Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'totStk',
            headerClassName: 'super-app-theme--header',
            headerName: 'Total Qty',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'shortage',
            headerClassName: 'super-app-theme--header',
            headerName: 'Shortage',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
    ];

    const columns1 = [

        {
            field: 'partno',
            headerClassName: 'super-app-theme--header',
            headerName: 'DC NO',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'partName',
            headerClassName: 'super-app-theme--header',
            headerName: 'CDC po NO',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'cdcNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'Cust Dc No',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'partName',
            headerClassName: 'super-app-theme--header',
            headerName: 'Item Name',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'itemDesc',
            headerClassName: 'super-app-theme--header',
            headerName: 'Item desc',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'totStk',
            headerClassName: 'super-app-theme--header',
            headerName: 'Pend Qty',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: 'UOM',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'adjQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Adj Qty',
            type: 'string',
            sortable: true,
            editable: true,
            minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'rate',
            headerClassName: 'super-app-theme--header',
            headerName: 'Rate',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'amt',
            headerClassName: 'super-app-theme--header',
            headerName: 'Amount',
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
        },
    ]

    const calculateTotals = (data) => {
        const dcValue = data.reduce((acc, item) => acc + (Number(item.amt) || 0), 0);
        console.log("totalQty", dcValue);
        setDcValue(dcValue);
        return [
            { id: 1, dcValue }
        ];
    }

    useEffect(() => {
        calculateTotals(selectedrowsprocess)
    }, [selectedrowsprocess])



    return (
        <div>
            <Dialog sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
                maxWidth="xl"
                open={dcSelectionModalOpen}>
                <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                    DC Selection
                </DialogTitle>
                <form>
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                                <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                    <CardContent>
                                        <DataGrid
                                            rows={dcData}
                                            columns={columns}
                                            pageSize={8}
                                            rowsPerPageOptions={[8]}
                                            style={{ border: 'none' }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '43vh',
                                                width: '100%',
                                                '& .super-app-theme--header': {
                                                    WebkitTextStrokeWidth: '0.6px',
                                                },
                                                '& .MuiDataGrid-cell': {
                                                    border: '1px solid #969696',
                                                },
                                                '& .MuiDataGrid-columnHeader': {
                                                    border: '1px solid #969696', 
                                                },
                                            }}
                                            rowHeight={40}
                                            columnHeaderHeight={40}

                                            getRowClassName={(params) => {
                                                const rowIndex = dcData.findIndex(row => row.id === params.row.id);
                                                if (rowIndex !== -1) {
                                                    console.log("Row index:", rowIndex);
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return ''; 
                                            }}

                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        {showSecondGrid && (
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                                    <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                        <CardContent>
                                            <DataGrid
                                                rows={selectedrowsprocess}
                                                columns={columns1}
                                                pageSize={8}
                                                rowsPerPageOptions={[8]}
                                                style={{ border: 'none' }}
                                                sx={{
                                                    overflow: 'auto',
                                                    height: '43vh',
                                                    width: '100%',
                                                    '& .super-app-theme--header': {
                                                        WebkitTextStrokeWidth: '0.6px',
                                                    },
                                                    '& .MuiDataGrid-cell': {
                                                        border: '1px solid #969696',
                                                    },
                                                    '& .MuiDataGrid-columnHeader': {
                                                        border: '1px solid #969696',
                                                    },
                                                }}
                                                rowHeight={40}
                                                columnHeaderHeight={40}
                                                getRowClassName={(params) => {
                                                    const rowIndex = selectedrowsprocess.findIndex(row => row.id === params.row.id);
                                                    if (rowIndex !== -1) {
                                                        console.log("Row index:", rowIndex);
                                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                    }
                                                    return ''; 
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <Button variant="contained" style={{ background: '#002D68', color: 'white' }}>
                                        Remove Row
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                    <TextField
                                        fullWidth
                                        value={dcValue}
                                        label="DC Value"
                                        placeholder='DC Value'
                                    />
                                </Grid>
                            </Grid>
                        )}

                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={handleOK}>
                            OK
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={handleClose}>
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
};

export default DCGstSelectionModel;
