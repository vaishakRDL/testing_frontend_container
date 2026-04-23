import React, { useEffect, useState } from 'react'
import { Autocomplete, Box, Button, Card, CardContent, Grid, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import JobCardDetails from './JobCardDetails';
import { GetOrderStatusReport } from '../../ApiService/LoginPageService';

const OrderStatusReport = () => {
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [detailsModelOpen, setDetailsModelOpen] = useState(false);
  const [reportData, setReportData] = useState([])
  const [selectedRow, setSelectedRow] = useState('')

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    // Add event listener to update height on resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    GetOrderStatusReport(handleGetReportSuccess, handleGetReportException)
  }, [])

  const handleGetReportSuccess = (dataObject) => {
    setReportData(dataObject?.data || [])
  }

  const handleGetReportException = () => { }

  const columns1 = [
    {
      field: 'id',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SNo</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'status',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Status/Delay</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'left',
      headerAlign: 'center'
    },
    {
      field: 'poNo',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Customer PO No</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'orderNo',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Sales Order No</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'jcNo',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Job Card No</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'rootJobCardNo',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Root Job Card No</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'orderPriority',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Priority</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'itemCode',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Product Code (Version)</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'customerName',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Customer Name</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'qty',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Order Qty (IUOM)</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'completedQty',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Complted Qty</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'dispatch',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Dispatch</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'completion',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>% Completion</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'delDate',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Delivery Date</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'expCompDate',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Exp Comp Date</span>,
      width: 170,
      type: 'string',
      sortable: true,
      minWidth: 100,
      // flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    // {
    //   field: 'jobCardStatus',
    //   headerClassName: 'super-app-theme--header',
    //   headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Job Card Status</span>,
    //   width: 170,
    //   type: 'string',
    //   sortable: true,
    //   minWidth: 100,
    //   // flex: 1,
    //   align: 'center',
    //   headerAlign: 'center'
    // },
    {
      field: 'actions',
      type: 'actions',
      headerClassName: 'super-app-theme--header',
      width: 170,
      // flex: 1,
      align: 'center',
      headerAlign: 'center',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Job Card Status</span>
      ),
      cellClassName: 'actions',
      disableClickEventBubbling: true,
      getActions: (params) => {
        const actions = [
          <Details key="print" selectedRow={params.row} />,
        ];
        return actions;
      },
    },
  ];

  const Details = (props) => {
    return (
      <Tooltip disableFocusListener title="Details" >
        <Button variant="contained" size='small' style={{ backgroundColor: '#002D68' }} onClick={() => {
          setDetailsModelOpen(true);
          setSelectedRow(props.selectedRow);
        }}>Details</Button>
      </Tooltip>
    );
  }


  return (
    <Grid container style={{ padding: '10px' }} spacing={2}>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <Typography style={{ textAlign: 'left', fontWeight: 'bold', fontSize: '20px' }}>Order Status Report</Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '50px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: 'lightgreen', marginRight: '10px' }} />
            <Typography>Intime</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: 'red', marginRight: '10px' }} />
            <Typography>Overdue</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: 'blue', marginRight: '10px' }} />
            <Typography>Expected Completion Date May Increase</Typography>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <Button variant="contained" style={{ marginRight: '10px', backgroundColor: '#002D68' }}>Excel</Button>
        <Button variant="contained" style={{ marginRight: '10px', backgroundColor: '#002D68' }}>PDF</Button>
        <Button variant="contained" style={{ backgroundColor: '#002D68' }}>Print</Button>
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Autocomplete
          disablePortal
          options={[]}
          sx={{ width: 300 }}
          size='small'
          renderInput={(params) => <TextField {...params} label="Search" />}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', border: '1px solid black' }}>
          {/* {loader &&
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          } */}
          <CardContent>
            <Box
              sx={{
                height: screenHeight - 320,
                backgroundColor: 'white',
                border: '1px solid black',
                width: "100%",
                '&::-webkit-scrollbar': {
                  width: '12px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'black',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'lightgrey',
                },
                scrollbarColor: "#f9f9fb lightgrey",
                scrollbarWidth: "thin",
              }}
            >
              <DataGrid
                rows={reportData}
                columns={columns1}
                pageSize={5}
                disableSelectionOnClick
                sx={{
                  overflow: 'auto',
                  height: '100%',
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
                  const rowIndex = reportData.findIndex(row => row.id === params.row.id);
                  if (rowIndex !== -1) {
                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                  }
                  return '';
                }}
                rowHeight={40}
                columnHeaderHeight={40}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <JobCardDetails
        open={detailsModelOpen}
        setOpen={setDetailsModelOpen}
        selectedRow={selectedRow}
      />
    </Grid>
  )
}

export default OrderStatusReport