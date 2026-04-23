import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { SobDeletedItems, SobResAndDev } from '../../../ApiService/LoginPageService';

const MoveRDView = ({ openRd, setOpenRD, dataList, setDataList, deleView }) => {
    useEffect(() => {

    }, [openRd]);

    const columns = [
        {
            field: 'itemCode',
            headerName: (
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item | Part No
                </span>
            ),
            type: 'number',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'left',
            headerAlign: 'center'
        },
        {
            field: 'description',
            headerName: (
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Description
                </span>
            ),
            type: 'number',
            sortable: true,
            minWidth: 50,
            flex: 1,
            align: 'left',
            headerAlign: 'center'
        },
        // {
        //     field: 'remark',
        //     headerName: (
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Remark
        //         </span>
        //     ),
        //     type: 'number',
        //     sortable: true,
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'left',
        //     headerAlign: 'center'
        // },
        {
            field: 'Qty',
            headerName: (
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Order Qty
                </span>
            ),
            type: 'number',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },

    ];

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    function SelectItem(props) {
        return (
            <Checkbox {...label} />
        );
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={openRd}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {
                    deleView === '0' ? "R&D List" : "Deleted Items"
                }

            </DialogTitle>

            <DialogContent>

                <Grid item md={12}>
                    <DataGrid
                        rows={dataList}
                        columns={columns}
                        pageSize={8}
                        // loading={isLoading}
                        rowsPerPageOptions={[8]}
                        disableSelectionOnClick
                        style={{ border: 'none', }}
                        sx={{
                            overflow: 'auto',
                            height: '55vh',
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

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                    onClick={(e) => {
                        setOpenRD(false);
                        setDataList([]);
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MoveRDView
