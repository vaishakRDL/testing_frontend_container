import { Card, CardContent, Grid } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import { useState } from 'react';

const StandardReportList = () => {
    const [rows,setRows] = useState('');

    const columns = [
        {
            field: 'groupName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Group Name</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'reportNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Report No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'reportName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Report Name</span>,
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
            <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                    <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%', border: '1px solid black', }}>
                        <CardContent>
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
            </Grid>
        </div>
    )
}

export default StandardReportList
