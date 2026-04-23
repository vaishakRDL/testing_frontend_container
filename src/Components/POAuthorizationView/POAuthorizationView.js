import { Autocomplete, Box, Button, Card, CardContent, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const POAuthorizationView = () => {

    const purchaseReportColumn = [
        {
            field: 'Supplier',
            headerName: 'supplier',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'GST No',
            headerName: 'gstNo',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poNo',
            headerName: 'PO No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poDate',
            headerName: 'PO Date',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poType',
            headerName: 'PO Type',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'reference',
            headerName: 'Reference',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'authLevel1',
            headerName: 'Auth Level1',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'authLevel1By',
            headerName: 'Auth Level1 By',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'authLevel1On',
            headerName: 'Auth Level1 On',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'authLevel2',
            headerName: 'Auth Level2',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'authLevel2By',
            headerName: 'Auth Level2 By',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'authLevel2On',
            headerName: 'Auth Level2 On',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'sitemCode',
            headerName: 'Sitem Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'sitemName',
            headerName: 'Sitem Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'suppDesc',
            headerName: 'Supp Desc',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'scheduleDate',
            headerName: 'scheduleDate',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'uomCode',
            headerName: 'UOM Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poQty',
            headerName: 'PO Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'pbCumQty',
            headerName: 'PBCumQty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'pendingGrnQty',
            headerName: 'Pending GRN Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'suppInvNo',
            headerName: 'Supp Inv No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'suppInvDate',
            headerName: 'Supp Inv Date',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'dateDiff',
            headerName: 'Date Diff',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'rcptQty',
            headerName: 'Rcpt Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerName: 'BOM',
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         // <BOMCheck selectedRow={params.row} />,

        //     ],
        // },
    ];

    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    PO Authorization View
                </Typography>
            </div>
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                    <Grid container alignItems={'center'} spacing={2}>
                        <Grid item xs={12} sm={4} md={4} lg={4} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <TextField
                                id="outlined-basic"
                                type="date"
                                label="From"
                                variant="outlined"
                                style={{ marginRight: '10px' }}
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size="small"
                            />
                            <TextField
                                id="outlined-basic"
                                type="date"
                                label="To"
                                variant="outlined"
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                >
                                    <FormControlLabel value="Detailed" control={<Radio />} label="Detailed" />
                                    <FormControlLabel value="Summery" control={<Radio />} label="Summery" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={5} md={5} lg={5}>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                >
                                    <FormControlLabel value="All" control={<Radio />} label="All" />
                                    <FormControlLabel value="Pending For Authorization" control={<Radio />} label="Pending for GRN" />
                                    <FormControlLabel value="Pending For 1st Level Auth" control={<Radio />} label="Pending for GRN" />
                                    <FormControlLabel value="Pending For 2nd Level Auth" control={<Radio />} label="Pending for GRN" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={[]}
                                renderInput={(params) => <TextField {...params} label="Select Item" />}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={[]}
                                renderInput={(params) => <TextField {...params} label="Select Supplier" />}
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <Button variant="contained">View</Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', backgroundColor: '#FBF3D5' }}>
                                <div style={{ border: '1px solid #000000', width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '8px' }}>
                                    <Typography style={{ fontSize: '13px' }}>MALLIK ENGINEERING (INDIA) PVT LTD</Typography>
                                </div>
                                <div style={{ border: '1px solid #000000', width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '8px' }}>
                                    <Typography style={{ fontSize: '13px' }}>Purchase Order: Pending For GRN - Summary</Typography>
                                </div>
                                <div style={{ border: '1px solid #000000', width: '100%', display: 'flex', justifyContent: 'flex-start', paddingLeft: '8px' }}>
                                    <Typography style={{ fontSize: '13px' }}>Date Range From 01 Apr 2023 To 22 Mar 2024</Typography>
                                </div>
                            </div>
                            <Box sx={{ height: 300, width: '100%' }}>
                                <DataGrid
                                    rows={[]}
                                    columns={purchaseReportColumn}
                                    initialState={{
                                        pagination: {
                                            paginationModel: {
                                                pageSize: 5,
                                            },
                                        },
                                    }}
                                    pageSizeOptions={[5]}
                                    disableRowSelectionOnClick
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    )
}
export default POAuthorizationView;