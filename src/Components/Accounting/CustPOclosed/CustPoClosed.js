import { Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'
import { useState } from 'react';

const CustPoClosed = () => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedRadio, setSelectedRadio] = useState('');
    const [rows, setRows] = useState('');

    const handleRadioChange = (event) => {
        setSelectedRadio(event.target.value);
    };

    const columns = [
        {
            field: 'soNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SONO</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'soDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SO Date</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'customer',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Customer</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'refNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Ref No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'slNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SL No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Code</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Name</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'soQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SO Qty</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'soRate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SO Rate</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'invCumQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Inv Cum Qty</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'pendQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Pend Qty</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'shortClose',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Short Close</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
    ]


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    PO Shortclosed
                </Typography>
            </div>
            <from>
                <Grid container spacing={2} padding={1}>
                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                            fullWidth
                            label="From Date"
                            placeholder='From Date'
                            variant="outlined"
                            required
                            type='Date'
                            size="small"
                            style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                            onChange={(e) => { setFromDate(e.target.value) }}
                            value={fromDate}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                            fullWidth
                            label="To Date"
                            placeholder='To Date'
                            variant="outlined"
                            required
                            type='Date'
                            size="small"
                            style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                            onChange={(e) => { setToDate(e.target.value) }}
                            value={toDate}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2} md={2} lg={2} xl={2}>
                        <RadioGroup row value={selectedRadio} onChange={handleRadioChange} >
                            <FormControlLabel value="docNoRadio1" control={<Radio />} label="All" />
                            <FormControlLabel value="docNoRadio2" control={<Radio />} label="Pending" />
                        </RadioGroup>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                        <FormControl style={{ display: 'flex', flexDirection: 'row' }}>
                            <FormControlLabel
                                control={<Checkbox />}
                                label={<Typography variant="body1" style={{ fontWeight: 'bold' }}>Select ItemCode</Typography>}
                            />
                            <FormControlLabel
                                control={<Checkbox />}
                                label={<Typography variant="body1" style={{ fontWeight: 'bold' }}>Select Party</Typography>}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2} spacing={2} padding={1}>
                    <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%', border: '1px solid black', }}>
                        <CardContent>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: '5px' }}>
                                <Button variant="contained" type="submit" style={{ height: '30px', backgroundColor: '#002d68' }}>
                                    SAVE
                                </Button>
                            </div>
                            <DataGrid
                                rows={rows}
                                // rows={[]}
                                columns={columns}
                                // loading={isLoading}
                                pageSize={8}
                                style={{ height: '310px' }}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                rowHeight={40}
                                columnHeaderHeight={40}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </from>

        </div>
    )
}

export default CustPoClosed
