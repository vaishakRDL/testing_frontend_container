import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { SaleOrderFetch } from '../../ApiService/LoginPageService';

const SalesItemDetailView = ({ itemDetaildView,
    setItemDetaildView,
    selectSalesId}) => {
        const [itemDetail, setItemDetail] = useState([]);
        const [isViewData, setIsViewData] = useState(0);
        const [sheetScrapList, setSheetScrapList] = useState([]);
        const [sheetInfoList, setSheetInfoList] = useState([]);
        const [from, setFrom] = useState('');
        const [to, setTo] = useState('');

        const columns = [
            {
                field: 'sNo',
                headerClassName: 'super-app-theme--header',
                headerName:
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        S.No
                    </span>,
                type: 'string',
                sortable: true,
                minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
            },
            {
                field: 'orderNo',
                headerClassName: 'super-app-theme--header',
                headerName:
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        Order No
                    </span>,
    
                type: 'string',
                sortable: true,
                sortable: false,
                minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
            },
            {
                field: 'itemCode',
                headerClassName: 'super-app-theme--header',
                headerName:
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        Item | Part No
                    </span>,
    
                type: 'string',
                sortable: true,
                sortable: false,
                minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
            },
            {
                field: 'itemName',
                headerClassName: 'super-app-theme--header',
                headerName:
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        Item | Part Name
                    </span>,
    
                type: 'string',
                sortable: true,
                sortable: false,
                minWidth: 50, flex: 1, align: 'left', headerAlign: 'center'
            },
            // {
            //     field: 'devliveryDate',
            //     headerName:
            //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
            //             Kanban Date
            //         </span>,
    
            //     type: 'number',
            //     sortable: true,
            //     sortable: false,
            //     minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
            // },
    
            {
                field: 'Qty',
                headerClassName: 'super-app-theme--header',
                headerName:
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        Order Qty
                    </span>,
                type: 'string',
                sortable: true,
                sortable: false,
                minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
            },
          
        ];
    

    useEffect(() => {
        if (itemDetaildView) {
            SaleOrderFetch({
                saleId: selectSalesId
            }, handleSaleOrderFetch, handleSaleOrderFetchException);
        }

    }, [selectSalesId, itemDetaildView]);

    const handleSaleOrderFetch = (dataObject) => {
        setItemDetail(dataObject?.data || []);
    }

    const handleSaleOrderFetchException = () => {

    }

    return (
        <div>
            <Dialog sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={itemDetaildView}>
                <form>
                    <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography>
                        Ordered Item List
                        </Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1} style={{ marginTop: '20px' }}>
                            <Grid item xs={12} sm={12} md={12} lg={12} lx={12}>
                                <DataGrid
                                        rows={itemDetail}
                                        columns={columns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '70vh',
                                            // minHeight: '500px',
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                WebkitTextStrokeWidth: '0.6px',
                                                backgroundColor: '#93bce6',
                                                color: '#1c1919'

                                            },
                                            '& .MuiDataGrid-cell': {
                                                border: '1px solid #969696',
                                            },
                                            '& .MuiDataGrid-columnHeader': {
                                                border: '1px solid #969696', // Add border to column headers
                                            },
                                        }}
                                        getRowClassName={(params) => {
                                            // Find the index of the row within the rows array
                                            const rowIndex = itemDetail.findIndex(row => row.id === params.row.id);
                                            // Check if the index is valid
                                            if (rowIndex !== -1) {
                                                console.log(' ');
                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return ''; // Return default class if index is not found
                                        }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setItemDetaildView(false);
                            setItemDetail([]);
                            setIsViewData(0);
                        }}
                    >
                        Cancel
                    </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}

export default SalesItemDetailView
