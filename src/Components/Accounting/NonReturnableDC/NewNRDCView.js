// import { Card, CardContent, Grid, Tooltip, Typography } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import React, { useState } from 'react'
// import { Link } from 'react-router-dom';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import { useEffect } from 'react';
// import { NonReturnableShowData } from '../../../ApiService/LoginPageService';
// import DeleteConfirmationDailog from '../../../Utility/confirmDeletion';
// import POInvoicePdf from '../PurchaseorderEntry/POInvoicePdf';

// const NewNRDCView = () => {
//   const [rows, setRows] = useState([]);
//   const [refreshData, setRefreshData] = useState(false);
//   const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState('');
//   const [asgnData, setAsgnData] = useState("");
//   const [openAsgn, setOpenAsgn] = useState(false);
//   const [openNotification, setNotification] = useState({
//     status: false,
//     type: 'error',
//     message: '',
//   });

//   const columns = [
//     {
//       field: 'poNo',
//       headerClassName: 'super-app-theme--header',
//       headerName: 'Part No',
//       type: 'string',
//       sortable: true,
//       minWidth: 80,
//       flex: 1,
//       align: 'center',
//       headerAlign: 'center',
//     },
//     {
//       field: 'custo',
//       headerClassName: 'super-app-theme--header',
//       headerName: 'Customer',
//       type: 'string',
//       sortable: true,
//       minWidth: 80,
//       flex: 1,
//       align: 'center',
//       headerAlign: 'center',
//     },
//     {
//       field: 'nrdcNo',
//       headerClassName: 'super-app-theme--header',
//       headerName: 'NRDC No',
//       type: 'string',
//       sortable: true,
//       minWidth: 100,
//       flex: 1,
//       align: 'center',
//       headerAlign: 'center'
//     },
//     {
//       field: 'actions',
//       headerClassName: 'super-app-theme--header',
//       type: 'actions',
//       flex: 1,
//       headerName: 'Actions',
//       cellClassName: 'actions',
//       disableClickEventBubbling: true,
//       getActions: (params) => [
//         // <EditData selectedRow={params.row} />,
//         <DeleteData selectedRow={params.row} />,
//         <DownloadData selectedRow={params.row} />,
//       ],
//     },
//   ];

//   function DownloadData(props) {
//     return (
//       <Tooltip title="Download Invoice" >

//         <POInvoicePdf
//           rowData={props.selectedRow}
//         />

//       </Tooltip>
//     );
//   }

//   function DeleteData(props) {
//     return (
//       <Tooltip title="Delete">
//         <DeleteIcon style={{ color: '#002D68', cursor: 'pointer' }}
//           onClick={() => {
//             setDeleteId(props.selectedRow.id);
//             console.log(props.selectedRow.id);
//             setDeleteDailogOpen(true);
//           }}
//         />
//       </Tooltip>
//     );
//   }

//   function ViewData(props) {
//     return (
//       <Tooltip disableFocusListener title="View" >
//         <VisibilityIcon
//           style={{ color: '#002D68', cursor: 'pointer' }}
//           // onClick={handlePrintClick}
//           onClick={() => {
//             console.log("sucess");
//             setAsgnData(props.selectedRow.id);
//             setOpenAsgn(true);
//           }}
//         />
//       </Tooltip>
//     );
//   }

//   useEffect(() => {
//     NonReturnableShowData(handleNonReturnableShow, handeNonReturnableException);
//   }, [refreshData])

//   const handleNonReturnableShow = (dataObject) => {
//     setRows(dataObject?.data || []);
//   }

//   const handeNonReturnableException = (errorStatus, errorMessage) => {
//     console.log(errorMessage);
//   }

//   const handleDeleteSuccess = (dataObject) => {
//     console.log(dataObject);
//     setNotification({
//       status: true,
//       type: 'success',
//       message: dataObject.message,
//     });
//     setTimeout(() => {
//       setDeleteDailogOpen(false);
//     }, 2000);
//     setRefreshData(oldValue => !oldValue);
//   }

//   const handleDeleteException = (errorObject, message) => {
//     console.log(message);
//     setNotification({
//       status: true,
//       type: 'error',
//       message: message,
//     });
//   }



//   return (
//     <div>
//       <div style={{ height: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
//         <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//           <div style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}>
//             <Link to='/NewNRDCEntry' style={{ textDecoration: 'none' }}>
//               <Typography
//                 sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
//                 variant="h5"
//               >
//                 {`Non Returnable-DC>>`}
//               </Typography>
//             </Link>
//             <Typography
//               sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
//               variant="h5"
//             >
//               Non Returnable-Dc View
//             </Typography>
//           </div>

//           {/* <Link to='/NewPurchaseOrderEntry'>
//                         <Button
//                         variant="contained"
//                         component="label"
//                         sx={{ marginRight: '16px', backgroundColor: '#002D68', height: '40px', borderRadius: '20px', width: '150px' }}
//                         >
//                         New
//                         </Button>
//                     </Link> */}
//         </div>
//         <Grid container spacing={2} style={{ flex: 1 }}>
//           <Grid item xs={12}>
//             <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '100%', height: '650px' }}>
//               <CardContent style={{ padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
//                 <Typography variant="h9" style={{ fontWeight: 'bold' }}></Typography>
//                 <div style={{ height: 600, width: '100%' }}>
//                   <DataGrid
//                     rows={rows}
//                     columns={columns}
//                     pageSize={8}
//                     // loading={isLoading}
//                     rowsPerPageOptions={[8]}
//                     disableSelectionOnClick
//                     style={{ border: 'none', }}
//                     sx={{
//                       overflow: 'auto',
//                       height: '60vh',
//                       // minHeight: '500px',
//                       width: '100%',
//                       '& .super-app-theme--header': {
//                         WebkitTextStrokeWidth: '0.6px',
//                         backgroundColor: '#93bce6',
//                         color: '#1c1919'
//                       },
//                       '& .MuiDataGrid-cell': {
//                         border: '1px solid #969696',
//                       },
//                       '& .MuiDataGrid-columnHeader': {
//                         border: '1px solid #969696', // Add border to column headers
//                       },
//                     }}
//                     getRowClassName={(params) => {
//                       // Find the index of the row within the rows array
//                       const rowIndex = rows.findIndex(row => row.id === params.row.id);
//                       // Check if the index is valid
//                       if (rowIndex !== -1) {

//                         return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
//                       }
//                       return ''; // Return default class if index is not found
//                     }}
//                     rowHeight={40}
//                     columnHeaderHeight={40}
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </div>

//       {/* <DeleteConfirmationDailog
//                 open={deleteDailogOpen}
//                 setOpen={setDeleteDailogOpen}
//                 deleteId={deleteId}
//                 deleteService={NonReturnableDelete}
//                 handleSuccess={handleDeleteSuccess}
//                 handleException={handleDeleteException}
//             /> */}

//       {/* <PurchaseOrderEntryView
//                setOpenAsgn={setOpenAsgn}
//                openAsgn={openAsgn}
//                asgnData={asgnData}
//             /> */}
//     </div>
//   )
// }

// export default NewNRDCView


import { Card, CardContent, Grid, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import DeleteConfirmationDailog from '../../../Utility/confirmDeletion';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import { NonReturnableDelete, NonReturnableShowData } from '../../../ApiService/LoginPageService';
import { ExportNrdc } from '../../../ApiService/DownloadCsvReportsService';

const NewNRDCView = () => {
  const [rows, setRows] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const navigate = useNavigate();
  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });

  const columns = [
    {
      field: 'nrdcNo',
      headerClassName: 'super-app-theme--header',
      headerName:
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          NRDC No
        </span>
      , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
    {
      field: 'nrdc_date',
      headerClassName: 'super-app-theme--header',
      headerName:
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          NRDC Date
        </span>
      , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
    {
      field: 'cName',
      headerClassName: 'super-app-theme--header',
      headerName:
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          Customer
        </span>
      , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
    },
    {
      field: 'actions',
      headerClassName: 'super-app-theme--header',
      type: 'actions',
      flex: 1,
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          Actions
        </span>),
      cellClassName: 'actions',
      disableClickEventBubbling: true,
      getActions: (params) => [
        <ViewData selectedRow={params.row.id} />,
        <EditData selectedRow={params.row.id} />,
        <DownloadData selectedRow={params.row} />,
        <DeleteData selectedRow={params.row} />,
      ],
    },
  ];

  function ViewData(props) {
    return (
      <Tooltip disableFocusListener title="View" >
        <VisibilityIcon
          style={{ color: '#002D68', cursor: 'pointer' }}
          onClick={() => {
            navigate(`/NewNRDCEntry?isPOView=true&&poRowId=${props.selectedRow}`);
          }}
        />
      </Tooltip>
    );
  }

  function EditData(props) {
    return (
      <Tooltip disableFocusListener title="Edit" >
        <EditIcon
          style={{ color: '#002D68', cursor: 'pointer' }}
          onClick={() => {
            navigate(`/NewNRDCEntry?isEdit=true&&poRowId=${props.selectedRow}`);
          }}

        />
      </Tooltip>
    );
  }

  function DownloadData(props) {
    return (
      <Tooltip title="Export">
        <DownloadIcon style={{ color: '#002D68', cursor: 'pointer' }}
          onClick={() => {
            ExportNrdc({ id: props?.selectedRow?.id },
              ExportNrdcSuccess,
              ExportNrdcException
            );
          }}
        />
      </Tooltip>
    );
  }

  const ExportNrdcSuccess = () => { };

  const ExportNrdcException = () => { };

  function DeleteData(props) {
    return (
      <Tooltip title="Delete">
        <DeleteIcon style={{ color: '#002D68', cursor: 'pointer' }}
          onClick={() => {
            setDeleteId(props.selectedRow.id);
            console.log(props.selectedRow.id);
            setDeleteDailogOpen(true);
          }}
        />
      </Tooltip>
    );
  }

  useEffect(() => {
    NonReturnableShowData(handleNonReturnableShow, handeNonReturnableException);
  }, [refreshData]);

  const handleNonReturnableShow = (dataObject) => {
    setRows(dataObject?.data || []);
  }

  const handeNonReturnableException = (errorStatus, errorMessage) => {
    console.log(errorMessage);
  }

  const handleDeleteSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      setDeleteDailogOpen(false);
    }, 2000);
    setRefreshData(oldValue => !oldValue);
  }

  const handleDeleteException = (errorObject, message) => {
    console.log(message);
    setNotification({
      status: true,
      type: 'error',
      message: message,
    });
  }

  return (
    <div>
      <div style={{ height: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}>
            <Link to='/NewNRDCEntry' style={{ textDecoration: 'none' }}>
              <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                variant="h5"
              >
                {`Non Returnable DC >>`}
              </Typography>
            </Link>
            <Typography
              sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
              variant="h5"
            >
              Non Returnable DC View
            </Typography>
          </div>
        </div>
        <Grid container spacing={2} style={{ flex: 1 }}>
          <Grid item xs={12}>
            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '100%', height: '500px' }}>
              <CardContent style={{ padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="h9" style={{ fontWeight: 'bold' }}></Typography>
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
      </div>

      <DeleteConfirmationDailog
        open={deleteDailogOpen}
        setOpen={setDeleteDailogOpen}
        deleteId={deleteId}
        deleteService={NonReturnableDelete}
        handleSuccess={handleDeleteSuccess}
        handleException={handleDeleteException}
      />

    </div>
  )
}

export default NewNRDCView



