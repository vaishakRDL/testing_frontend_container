import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
// import { GetMtbfMonitoringReport, MachineBreakDownTrend } from '../../Services/NodeJsApiServices';
// import { DownloadMachineBreakDownTrendXl, MtbfMonitoringExcel } from '../../Services/DownloadCsvReportsService';


const MTTR_Monitor = () => {
    const [row2, setrow2] = useState([])

    const [selectFromDate, setSelectFromDate] = useState('');
    const [selectedTodate, setSelectedTodate] = useState('');


    useEffect(() => {
        // GetMtbfMonitoringReport({},handelMtbfTrend,MachineMtbfException)
    }, [])

    const columns = [
        {
            field: 'id',
            headerClassName: 'super-app-theme--header',
            headerName: 'SLNO',
            minWidth: 50, align: 'center', headerAlign: 'center'
        },
        {
            field: 'MachineNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'MachineNo',
            minWidth: 80, align: 'center', headerAlign: 'center'
        },
        {
            field: 'MachineName',
            headerClassName: 'super-app-theme--header',
            headerName: 'MachineName',
            minWidth: 70, headerAlign: 'center'
        },
        {
            field: 'ModelNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'ModelNo',
            minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'DateOfInstall',
            headerClassName: 'super-app-theme--header',
            headerName: 'DateOfInstall',
            minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'OperationHrs',
            headerClassName: 'super-app-theme--header',
            headerName: 'OperationHrs',
            minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'OperationDays',
            headerClassName: 'super-app-theme--header',
            headerName: 'OperationDays',
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'BreakdownHrs',
            headerClassName: 'super-app-theme--header',
            headerName: 'BreakdownHrs',
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'BreakdownCount',
            headerClassName: 'super-app-theme--header',
            headerName: 'BreakdownCount',
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'MTBF',
            headerClassName: 'super-app-theme--header',
            headerName: 'MTBF',
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
    ];



    const handleSubmit = (e) => {
        e.preventDefault();
        // MachineBreakDownTrend({

        //     fromDate: selectFromDate,
        //     toDate: selectedTodate,
        // }, handelMachineBreakDownTrend, MachineBreakDownTrendException)
    };

    const handelMtbfTrend = (dataObject) => {
        setrow2(dataObject.data || [])
    }

    const MachineMtbfException = () => {
    }

    const handleDownload = () => {
        // MtbfMonitoringExcel({

        // }, handelMachineBreakSuccess, MachineBreakDownTrendExlException);  // Success and Error callbacks are not needed for just download
    };

    const handelMachineBreakSuccess = () => { };
    const MachineBreakDownTrendExlException = () => { };





    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold', color: '#000000' }}
                    variant="h5"
                >
                    MTBF MONITORING
                </Typography>


            </div>
            {/* <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                         <Typography
                             sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold', color: '#000000' }}
                             variant="h5">
                             Breakdown Maintenance Record
                         </Typography>
                     </div>
          */}
            <div className="operator_bottomContainer">
                <div className="operator_bottm_date_containet">
                    <Grid container spacing={5} paddingLeft={'10px'} paddingRight={'10px'}>
                        <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4} style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                size="small"
                                id="outlined-basic"
                                label=" From Date"
                                type="date"
                                variant="outlined"
                                value={selectFromDate}
                                onChange={(e) => setSelectFromDate(e.target.value)}
                                InputLabelProps={
                                    {
                                        shrink: true
                                    }
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4} style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                fullWidth
                                size="small"
                                id="outlined-basic"
                                label=" To Date"
                                type="date"
                                variant="outlined"
                                value={selectedTodate}
                                onChange={(e) => setSelectedTodate(e.target.value)}
                                InputLabelProps={
                                    {
                                        shrink: true
                                    }
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={1.4} lg={1.4} xl={1.4} display={'flex'} alignItems={'center'} >
                            <div className="operator_button_container" >
                                <Button variant="contained" size="small"
                                    sx={{
                                        backgroundColor: 'black',

                                    }}
                                    onClick={handleSubmit} >Search</Button>
                            </div>
                        </Grid>




                        <Grid item xs={12} sm={12} md={1.4} lg={1.4} xl={1.4} display={'flex'} alignItems={'center'} >
                            <div className="operator_button_container" >


                                <Button onClick={handleDownload} variant="contained">
                                    Download CSV
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>


            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                    <Card style={{ boxShadow: '0 1px 1px 1px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%' }}>
                        <CardContent style={{ overflowX: 'auto' }}>
                            <DataGrid
                                rows={row2}
                                columns={columns}
                                autoHeight
                                // initialState={{
                                //     pagination: {
                                //         paginationModel: {
                                //             pageSize: 530,
                                //         },
                                //     },
                                // }}
                                sx={{
                                    '& .MuiDataGrid-columnHeaders': {
                                        color: '#000000',
                                        fontWeight: 'bold',
                                    },
                                    '& .MuiDataGrid-columnHeaderTitle': {
                                        fontWeight: 'bold',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word',
                                    },
                                }}
                                // pageSizeOptions={[530]}
                                disableRowSelectionOnClick
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>


        </div>

    )
}

export default MTTR_Monitor
