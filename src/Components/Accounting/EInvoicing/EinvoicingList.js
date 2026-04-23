// import React from 'react'
// import EinvoicingTools from './EinvoicingTools';
// import { useState } from 'react';
// import { Button, Card, CardContent, Checkbox, FormControlLabel, FormGroup, Grid, TextField } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';

// const EinvoicingList = () => {
//     const [rows, setRows] = useState([]);
//     const [isAddButton, setIsAddButton] = useState(true);
//     const [open, setOpen] = useState(false);
//     const [refreshData, setRefreshData] = useState(false);
//     const [isLoading, setGridLoading] = useState(true);
//     const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
//     const [deleteId, setDeleteId] = useState('');
//     const [date, setDate] = useState('');
//     const [toDate, setToDate] = useState('');
//     const [openNotification, setNotification] = useState({
//         status: false,
//         type: 'error',
//         message: '',
//     });

//     const columns = [
//         {
//             field: 'invNo',
//             headerClassName: 'super-app-theme--header',
//             headerName: 'Inv No',
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'invDate',
//             headerClassName: 'super-app-theme--header',
//             headerName: 'Inv Date',
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'customer',
//             headerClassName: 'super-app-theme--header',
//             headerName: 'Customer',
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'status',
//             headerClassName: 'super-app-theme--header',
//             headerName: 'Status',
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'responsiveMsg',
//             headerClassName: 'super-app-theme--header',
//             headerName: 'Response Message',
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'ackNo',
//             headerClassName: 'super-app-theme--header',
//             headerName: 'Ack No',
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'irnNo',
//             headerClassName: 'super-app-theme--header',
//             headerName: 'IRN No',
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//     ];

//     return (
//         <div style={{ marginLeft: '25px', marginRight: '25px' }}>
//             <EinvoicingTools />
//             <form>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
//                         <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%' }}>
//                             <CardContent>
//                                 <Grid container spacing={2}>
//                                     <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
//                                         <Grid container spacing={2}>
//                                             <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ display: 'flex', justifyContent: 'flex-start' }}>
//                                                 <TextField
//                                                     fullWidth
//                                                     label="Date Range"
//                                                     placeholder='Date Range'
//                                                     variant="outlined"
//                                                     required
//                                                     type='date'
//                                                     value={date}
//                                                     onChange={(e) => setDate(e.target.value)}
//                                                     InputLabelProps={
//                                                         {
//                                                             shrink: true
//                                                         }
//                                                     }
//                                                 />
//                                             </Grid>
//                                             <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ display: 'flex', justifyContent: 'flex-start' }}>
//                                                 <TextField
//                                                     fullWidth
//                                                     label="To"
//                                                     placeholder='To'
//                                                     variant="outlined"
//                                                     required
//                                                     type='date'
//                                                     value={toDate}
//                                                     onChange={(e) => setToDate(e.target.value)}
//                                                     InputLabelProps={
//                                                         {
//                                                             shrink: true
//                                                         }
//                                                     }
//                                                 />
//                                             </Grid>
//                                             <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
//                                                 <Button variant="contained"
//                                                     style={{ width: '150px', background: '#002D68', color: 'white' }}>Load</Button>
//                                             </Grid>
//                                             <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
//                                                 <Button variant="contained"
//                                                     style={{ width: '240px', background: '#002D68', color: 'white' }}>Upload to GST Provider</Button>                            </Grid>
//                                         </Grid>
//                                         <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ marginTop: '5px' }}>
//                                             <FormGroup>
//                                                 <FormControlLabel control={<Checkbox defaultChecked />} label="Pending Only" />
//                                             </FormGroup>
//                                         </Grid>
//                                     </Grid>
//                                 </Grid>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 </Grid>
//                 <Grid container marginTop={5} marginBottom={10}>
//                     <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
//                         <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%' }}>
//                             <CardContent>
//                                 <DataGrid
//                                     rows={rows}
//                                     columns={columns}
//                                     pageSize={8}
//                                     loading={isLoading}
//                                     rowsPerPageOptions={[8]}
//                                     disableSelectionOnClick
//                                     style={{ border: 'none' }}
//                                     sx={{
//                                         overflow: 'auto',
//                                         height: '50vh',
//                                         width: '100%',
//                                         '& .super-app-theme--header': {
//                                             WebkitTextStrokeWidth: '0.6px',
//                                         },
//                                         '& .MuiDataGrid-cell': {
//                                             border: '1px solid #969696',
//                                         },
//                                         '& .MuiDataGrid-columnHeader': {
//                                             border: '1px solid #969696', // Add border to column headers
//                                         },
//                                     }}
//                                     getRowClassName={(params) => {
//                                         // Find the index of the row within the rows array
//                                         const rowIndex = rows.findIndex(row => row.id === params.row.id);
//                                         // Check if the index is valid
//                                         if (rowIndex !== -1) {

//                                           return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
//                                         }
//                                         return ''; // Return default class if index is not found
//                                       }}
//                                     rowHeight={40}
//                                     columnHeaderHeight={40}
//                                 />
//                             </CardContent>

//                         </Card>
//                     </Grid>
//                 </Grid>
//             </form>

//         </div>
//     )
// }

// export default EinvoicingList

import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react'

const EinvoicingList = () => {
    const [fromDate, setFromDate] = useState('');
    const [rows, setRows] = useState([]);
    const [toDate, setToDate] = useState('');

    const columns = [
        {
            field: 'invNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Inv No
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'invDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Inv Date
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'cCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Customer
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'cCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Status
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'responseMessage',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Response Message
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'ackNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Ack No
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'irnNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    IRN No
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    E-Invoicing
                </Typography>
            </div>
            <form>
                <Grid container padding={1} direction="row" alignItems="center" spacing={1}>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <TextField
                            fullWidth
                            label="From Date"
                            placeholder='From Date'
                            variant="outlined"
                            required
                            type='date'
                            size="small"
                            style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                            onChange={(e) => setFromDate(e.target.value)}
                            value={fromDate}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                        <TextField
                            fullWidth
                            label="To Date"
                            placeholder='To Date'
                            variant="outlined"
                            required
                            type='date'
                            size="small"
                            style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                            onChange={(e) => setToDate(e.target.value)}
                            value={toDate}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                        <Box display="flex" justifyContent="flex-start" alignItems="center" gap={1}>
                            <Button
                                variant="contained"
                                type="button"
                                sx={{ height: 30, backgroundColor: '#002d68' }}
                            // onClick={handleViewClick}
                            >
                                Load
                            </Button>
                            <Button
                                variant="contained"
                                type="button"
                                sx={{ height: 30, backgroundColor: '#002d68', minWidth: 240 }}
                            // onClick={handleViewClick}
                            >
                                Upload to GST Provider
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{ flex: 1 }}>
                    <Grid item xs={12}>
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '100%', height: '500px' }}>
                            <CardContent style={{ padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <div style={{ height: 600, width: '100%' }}>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '60vh',
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
                                            const rowIndex = rows.findIndex(row => row.id === params.row.id);
                                            // Check if the index is valid
                                            if (rowIndex !== -1) {

                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return ''; // Return default class if index is not found
                                        }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />

                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default EinvoicingList

