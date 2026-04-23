import { Cancel } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { BomDetailsView } from '../../ApiService/LoginPageService';
import { BomExportDOWNLOAD } from '../../ApiService/DownloadCsvReportsService';

const AllBOMList = ({ openAllView, setOpenAllView }) => {

    const [bomDetails, setBomDetails] = useState([]);

    useEffect(() => {
        BomDetailsView(handleBomDetailsViewSuccess, handleBomDetailsViewException);
    }, [openAllView]);


    const handleBomDetailsViewSuccess = (dataObject) => {
        setBomDetails(dataObject?.data || []);
    }

    const handleBomDetailsViewException = () => {

    }

    const columns = [
        {
            field: 'bomItemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    BOM Item Code
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Code
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    QTY
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'jcPart',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    JC Part
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },


    ];

    const handleBomExportDOWNLOADSuccess=()=>{

    }

    const handleBomExportDOWNLOADException=()=>{

    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={openAllView}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Import BOM Item Data
            </DialogTitle>
            <DialogContent>
                <DataGrid
                    rows={bomDetails}
                    columns={columns}
                    pageSize={8}

                    rowsPerPageOptions={[8]}
                    disableSelectionOnClick
                    style={{ border: 'none' }}
                    sx={{
                        overflow: 'auto',
                        height: '50vh',
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
                        const rowIndex = [].findIndex(row => row.id === params.row.id);
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
            </DialogContent>
            <DialogActions>
                <Button variant="contained" style={{ width: '150px', background: '#002D68', color: 'white' }}
                    onClick={() => {
                        BomExportDOWNLOAD(handleBomExportDOWNLOADSuccess,handleBomExportDOWNLOADException);
                    }}
                >
                    Download
                </Button>

                <Button variant="contained" style={{ width: '150px', background: '#002D68', color: 'white' }}
                    onClick={() => {
                        setOpenAllView(false);
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>

        </Dialog>
    )
}

export default AllBOMList
