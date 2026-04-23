import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import { useState } from 'react';
import { GSTInvViewTable, PoEntryViewTable } from '../../../ApiService/LoginPageService';
import { useEffect } from 'react';

const GSTPartNoView = ({ openAsgn, setOpenAsgn, asgnData, setRefreshData }) => {
    const [rows, setRows] = useState([]);

    const handleClose = () => {
        setOpenAsgn(false);
    }

    const columns = [
        {
            field: 'partNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'Part No',
            type: 'string', sortable: true, sortable: false, Width: 200, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'partName',
            headerClassName: 'super-app-theme--header',
            headerName: 'Part Name',
            type: 'string', sortable: true, sortable: false, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: 'UOM',
            type: 'number', sortable: true, sortable: false, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'invQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Qty',
            type: 'number', sortable: true, sortable: false, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center', editable: true,
        },
        {
            field: 'schDate',
            headerClassName: 'super-app-theme--header',
            headerName: 'Sch Date',
            type: 'string', sortable: true, sortable: false, editable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'preRate',
            headerClassName: 'super-app-theme--header',
            headerName: 'Prew Rate',
            type: 'string', sortable: true, sortable: false, flex: 1, minWidth: 100, align: 'center', headerAlign: 'center'
        },
        {
            field: 'invRate',
            headerClassName: 'super-app-theme--header',
            headerName: 'Rate',
            type: 'number', sortable: true, sortable: false, flex: 1, minWidth: 100, align: 'center', headerAlign: 'center',
        },
        {
            field: 'invAmt',
            headerClassName: 'super-app-theme--header',
            headerName: 'Amt',
            type: 'number', sortable: true, sortable: false, flex: 1, minWidth: 100, align: 'center', headerAlign: 'center',
            // editable: true,
        },
    ];

    useEffect(() => {
        if (asgnData) {

            GSTInvViewTable({ id: asgnData }, handleAssignSubShowData, handleAssignSubShowDataException);
        }
    }, [asgnData])

    const handleAssignSubShowData = (dataObject) => {
        setRows(dataObject?.data || []); // Set rows to dataObject.data or an empty array if dataObject.data is undefined
    }

    const handleAssignSubShowDataException = (errorObject, errorMessage) => {
        console.log(errorMessage);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={openAsgn}>
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                View GST Invoice
            </DialogTitle>
            <DialogContent>
                <form>
                    <Grid container spacing={2} style={{ marginTop: '10px' }}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%' }}>
                                <CardContent>
                                    {rows && rows.length > 0 && (
                                        <DataGrid
                                            rows={rows}
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
                                                    border: '1px solid #969696', // Add border to column headers
                                                },
                                            }}
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                            getRowClassName={(params) => {
                                                // Find the index of the row within the rows array
                                                const rowIndex = rows.findIndex(row => row.id === params.row.id);
                                                // Check if the index is valid
                                                if (rowIndex !== -1) {
                                                    console.log("Row index:", rowIndex);
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return ''; // Return default class if index is not found
                                            }}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={handleClose}>
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default GSTPartNoView
