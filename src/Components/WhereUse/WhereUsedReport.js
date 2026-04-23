import React, { useEffect, useState } from 'react'
import WhereUsedReportTitle from './WhereUsedReportTitle';
import { Autocomplete, Button, Card, CardContent, FormControl, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { BomMainParts, ItemSearchNAAJ } from '../../ApiService/LoginPageService';
import { BomMainPartsDwonload } from '../../ApiService/DownloadCsvReportsService';

const WhereUsedReport = () => {

    const [itemCodeList, setItemCodeList] = useState([]);
    const [itemShowListSeach, setItemShowListSeach] = useState([]);
    const [searchId, setSearchId] = useState('');
    const [searchName, setSearchName] = useState('');
    const [rows, setRows] = useState([]);


    useEffect(() => {

    }, [])


    const onTextSearch = (e) => {
        ItemSearchNAAJ({
            text: e.target.value
        }, handleItemSearchNAAJSucees, handleItemSearchNAAJException);

    }

    const handleItemSearchNAAJSucees = (dataObject) => {
        setItemShowListSeach(dataObject?.data || []);
    }

    const handleItemSearchNAAJException = () => {

    }

    function handleAutocompleteChange(selectedValue) {
        console.log("Selected Value:", selectedValue);
        setSearchId(selectedValue?.id);
        setSearchName(selectedValue?.label)
        BomMainParts({
            itemId: selectedValue?.id,
            type: 'View'
        }, handleBomFetchIdSuccess, handleBomFetchIdException);
    }

    const handleBomFetchIdSuccess = (dataObject) => {
        setRows(dataObject?.data || []);

    }

    const handleBomFetchIdException = (errorObject, errorMessage) => {

    }

    const options = itemShowListSeach.map(item => ({
        id: item?.id,
        label: item?.label
    }));

    const columns = [

        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Code
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',

        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Name
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            // editable: true
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>

                    UOM
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            // editable: true
        },
       
        {
            field: 'itemGroup',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item Group
                </span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80,
            align: 'center',
            headerAlign: 'center',

        },
        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    BOM Qty
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            // editable: true
        },


    ];

    const handleBomDownloadSuccess = () => {

    }

    const handleBomDownloadException = () => {

    }

    return (
        <div style={{ height: '70vh', width: '98%', justifyContent: 'space-around', marginLeft: '15px' }}>
            <WhereUsedReportTitle />
            <Grid container spacing={2} alignItems={'center'} style={{ marginTop: '-30px' }} >
                <Grid item xs={12} sm={12} md={5} lg={5} xl={5}
                    style={{
                        // display: 'flex',
                        // alignItems: 'center',
                        // justifyContent: 'center',

                    }}
                >
                    <FormControl style={{ width: '86%' }}>
                        <Autocomplete
                            fullWidth
                            disablePortal
                            id="combo-box-demo"
                            size='small'
                            options={options}
                            value={searchName}
                            // sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Search By Item Code " onChange={onTextSearch} />}
                            onChange={(event, value) => handleAutocompleteChange(value)}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}
                    style={{
                        // display: 'flex',
                        // alignItems: 'center',
                        // justifyContent: 'center',

                    }}
                >
                    <Button variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={() => {
                            BomMainPartsDwonload({
                                itemId: searchId,
                                type: 'Export'
                            }, handleBomDownloadSuccess, handleBomDownloadException);
                        }}
                    >
                        Export
                    </Button>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', marginTop: "-10px", borderRadius: '10px', width: '100%', height: '100%' }}>
                        <CardContent>
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

                                    const rowIndex = rows.findIndex(row => row.id === params.row.id);

                                    if (rowIndex !== -1) {
                                        console.log(' ');
                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    }
                                    return '';
                                }}
                                rowHeight={40}
                                columnHeaderHeight={40}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            {/* <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            /> */}
        </div >
    )
}

export default WhereUsedReport
