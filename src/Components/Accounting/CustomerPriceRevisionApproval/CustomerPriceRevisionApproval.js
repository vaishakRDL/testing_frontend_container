// import React, { useState } from 'react';
// import Typography from '@mui/material/Typography';
// import { Card, CardContent, Checkbox, FormControlLabel, FormGroup, Grid, Switch, Tooltip } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import Button from '@mui/material/Button';
// import { POGenerateServices, GetUpdatedRateList, priceRevisionApproval, priceRejectList, CustomerVsItemGetUpdatedRateListCustomer, CustomerVsItempriceRevisionApproval, CustomerVsItempriceRejectList, CustomerVsItemPriceReject } from '../../../ApiService/LoginPageService';
// import { useEffect } from 'react';
// import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
// // import CompliteSucess from './CompliteSucess';
// import Chip from '@mui/material/Chip';
// import { Link, useNavigate } from 'react-router-dom';
// import DownloadIcon from '@mui/icons-material/Download';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';

// import ApprovalConfirmation from '../../AdminApproval/ApprovalConfirmation/ApprovalConfirmation';
// import RejectConfirmation from '../../AdminApproval/RejectConfirmation/RejectConfirmation';
// import CustomerVsItemApprovalConfirmation from '../../AdminApproval/CustomerVsItemApprovalConfirmation/CustomerVsItemApprovalConfirmation';
// import CustomerVsItemRejectConfirmation from '../../AdminApproval/CustomerVsItemRejectConfirmation/CustomerVsItemRejectConfirmation';

// const CustomerPriceRevisionApproval = () => {
//     const [rows, setRows] = useState([]);
//     const [openNotification, setNotification] = useState({
//         status: false,
//         type: 'error',
//         message: '',
//     });
//     const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
//     const [deleteId, setDeleteId] = useState('')
//     const [rejectDailogOpen, setRejectDailogOpen] = useState(false)
//     const [rejectId, setRejectId] = useState('')
//     const [refreshData, setRefreshData] = useState(false);
//     const [rejectList, setRejectList] = useState([]);
//     const [priceFlag, setPriceFlag] = useState('');
//     const [selectAll, setSelectAll] = useState(false);
//     const [remarks, setRemarks] = useState('')
//     const [rejectedToggle, setRejectedToggle] = useState(false);
//     const [screenHeight, setScreenHeight] = useState(window.innerHeight);
//     useEffect(() => {
//         const handleResize = () => {
//             setScreenHeight(window.innerHeight);
//         };

//         // Add event listener to update height on resize
//         window.addEventListener('resize', handleResize);

//         // Cleanup the event listener on component unmount
//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);

//     const columns1 = [
//         {
//             field: 'selected',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Select</span>,
//             type: 'number',
//             sortable: true,
//             width: 220,
//             align: 'center', headerAlign: 'center',
//             renderHeader: (params) => (
//                 <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
//                     <Typography style={{ fontWeight: 'bold' }}>Select</Typography>
//                     <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
//                     <span style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '16px' }}></span>
//                 </div>
//             ),
//             renderCell: (params) => (
//                 <Checkbox
//                     checked={params.row.selected}
//                     onChange={(e) => handleCheckboxChange(e, params.row.id)}
//                 />
//             ),
//         },
//         {
//             field: 'itemCode',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'itemName',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Name</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'customer',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Customer</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'customerDesc',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Customer Description</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'old_rate',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Previous Rate</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'new_rate',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>New Rate</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },

//     ];

//     const handleCheckboxChange = (event, id) => {
//         const updatedRows = rows.map((row) =>
//             row.id === id ? { ...row, selected: event.target.checked } : row
//         );
//         setRows(updatedRows);
//     };

//     const handleSelectAllChange = (event) => {
//         setSelectAll(event.target.checked);
//         const isChecked = event.target.checked;
//         const updatedRows = rows.map(row => {
//             return { ...row, selected: isChecked };
//         });
//         setRows(updatedRows);
//     };

//     const columns2 = [
//         {
//             field: 'itemCode',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'itemName',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Name</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'customer',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Customer</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'customerDesc',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Customer Description</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'old_rate',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Previous Rate</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'new_rate',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>New Rate</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//     ];


//     function EditData(props) {
//         return (
//             <Button
//                 variant="contained"
//                 type='submit'
//                 style={{ height: '30px', backgroundColor: '#65B741' }}
//                 onClick={(event) => {
//                     setDeleteId(props.selectedRow);
//                     setDeleteDailogOpen(true);
//                     setPriceFlag('Price');
//                 }}
//             >
//                 Approve
//             </Button>
//         );
//     }

//     function DeleteData(props) {
//         return (
//             <Button
//                 variant="contained"
//                 type='submit'
//                 style={{ height: '30px', backgroundColor: '#D24545' }}
//                 onClick={(event) => {
//                     setRejectId(props.selectedRow);
//                     setRejectDailogOpen(true);
//                     setPriceFlag('Price');
//                 }}
//             >
//                 Reject
//             </Button>
//         );
//     }

//     useEffect(() => {
//         CustomerVsItemGetUpdatedRateListCustomer(handlePOGenerateServicesSuccess, handlePOGenerateServicesExceptoin);
//         CustomerVsItempriceRejectList(handlePORejectSuccess, handlePORejectException);
//     }, [refreshData, rejectedToggle]);

//     const handlePORejectSuccess = (dataObject) => {
//         setRejectList(dataObject?.data || []);
//     }

//     const handlePORejectException = (errorObject, errorMessage) => {
//         console.log("error Msg", errorMessage);
//     }

//     const handlePOGenerateServicesSuccess = (dataObject) => {
//         setRows(dataObject?.data || []);
//     }

//     const handlePOGenerateServicesExceptoin = (errorObject, errorMessage) => {
//         console.log("error Msg", errorMessage);
//     }

//     const handlePrintButtonClick = (id) => {
//         console.log(`Print button clicked for row with id: ${id}`);
//     };

//     const deletehandleSuccess = (dataObject) => {
//         setNotification({
//             status: true,
//             type: 'success',
//             message: dataObject.message,
//         });
//         setRefreshData((oldvalue) => !oldvalue);
//         setTimeout(() => {
//             handleClose();
//             setDeleteDailogOpen(false);
//             setRejectDailogOpen(false);
//             setPriceFlag(false);
//             setRemarks('');
//         }, 3000);
//     };
//     const deletehandleException = (errorObject, errorMessage) => {
//         setNotification({
//             status: true,
//             type: 'error',
//             message: errorMessage,
//         });
//         setTimeout(() => {
//             // handleClose();
//         }, 3000);
//     };

//     const handleClose = () => {
//         setNotification({
//             status: false,
//             type: '',
//             message: '',
//         });
//     };

//     return (
//         <div>
//             <div style={{ height: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
//                 <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}>
//                        Customer vs Item Price Revision Approval
//                     </Typography>

//                     <div>
//                         <FormGroup>
//                             <FormControlLabel control={<Switch checked={rejectedToggle} onChange={(e) => setRejectedToggle(e.target.checked)} />} label="VIEW REJECTED LISTS" />
//                         </FormGroup>
//                     </div>

//                 </div>
//                 {rejectedToggle === false ?
//                     <Grid container spacing={2} style={{ flex: 1 }}>
//                         {/* First Grid */}
//                         <Grid item xs={12}>
//                             <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '10px', borderRadius: '10px', width: '100%' }}>
//                                 <CardContent style={{ padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
//                                     <Typography variant="h9" style={{ fontWeight: 'bold' }}></Typography>
//                                     <div style={{ height: screenHeight - 315, width: '100%' }}>
//                                         <DataGrid
//                                             rows={rows}
//                                             columns={columns1}
//                                             pageSize={5}
//                                             disableSelectionOnClick
//                                             rowHeight={40}
//                                             columnHeaderHeight={40}
//                                             sx={{
//                                                 '& .super-app-theme--header': {
//                                                     WebkitTextStrokeWidth: '0.6px',
//                                                     backgroundColor: '#93bce6',
//                                                     color: '#1c1919'
//                                                 },
//                                                 '& .MuiDataGrid-cell': {
//                                                     border: '1px solid #969696',
//                                                 },
//                                                 '& .MuiDataGrid-columnHeader': {
//                                                     border: '1px solid #969696', // Add border to column headers
//                                                 },
//                                             }}
//                                             getRowClassName={(params) => {
//                                                 const rowIndex = rows.findIndex(row => row.id === params.row.id);
//                                                 if (rowIndex !== -1) {
//                                                     return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
//                                                 }
//                                                 return '';
//                                             }}
//                                         />
//                                     </div>
//                                     <div style={{ textAlign: 'right', width: '100%', marginTop: '10px', marginBottom: '10px' }}>
//                                         <Button
//                                             variant="contained"
//                                             type='submit'
//                                             style={{ height: '30px', backgroundColor: '#65B741', marginRight: '20px' }}
//                                             onClick={(event) => {
//                                                 // setDeleteId(props.selectedRow);
//                                                 setDeleteDailogOpen(true);
//                                                 setPriceFlag('Price');
//                                             }}
//                                         >
//                                             Approve
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             type='submit'
//                                             style={{ height: '30px', backgroundColor: '#D24545' }}
//                                             onClick={(event) => {
//                                                 // setRejectId(props.selectedRow);
//                                                 setRejectDailogOpen(true);
//                                                 setPriceFlag('Price');
//                                             }}
//                                         >
//                                             Reject
//                                         </Button>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//                     </Grid>
//                     :
//                     <Grid container spacing={2} style={{ flex: 1 }}>
//                         <Grid item xs={12}>
//                             <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '10px', borderRadius: '10px', width: '100%' }}>
//                                 <CardContent style={{ padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
//                                     <Typography variant="h9" style={{ fontWeight: 'bold', marginBottom: '10px' }}>REJECTED LISTS</Typography>
//                                     <div style={{ height: screenHeight - 299, width: '100%' }}>
//                                         <DataGrid
//                                             rows={rejectList}
//                                             columns={columns2}
//                                             pageSize={5}
//                                             disableSelectionOnClick
//                                             rowHeight={40}
//                                             columnHeaderHeight={40}
//                                             sx={{
//                                                 '& .super-app-theme--header': {
//                                                     WebkitTextStrokeWidth: '0.6px',
//                                                     backgroundColor: '#93bce6',
//                                                     color: '#1c1919'
//                                                 },
//                                                 '& .MuiDataGrid-cell': {
//                                                     border: '1px solid #969696',
//                                                 },
//                                                 '& .MuiDataGrid-columnHeader': {
//                                                     border: '1px solid #969696',
//                                                 },
//                                             }}
//                                             getRowClassName={(params) => {
//                                                 const rowIndex = rejectList.findIndex(row => row.id === params.row.id);
//                                                 if (rowIndex !== -1) {

//                                                     return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
//                                                 }
//                                                 return '';
//                                             }}
//                                         />
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//                     </Grid>
//                 }
//             </div>
//             <CustomerVsItemApprovalConfirmation
//                 open={deleteDailogOpen}
//                 setOpen={setDeleteDailogOpen}
//                 deleteId={deleteId}
//                 deleteService={CustomerVsItempriceRevisionApproval}
//                 handleSuccess={deletehandleSuccess}
//                 handleException={deletehandleException}
//                 priceFlag={priceFlag}
//                 rows={rows}
//                 remarks={remarks}
//                 setRemarks={setRemarks}
//             />

//             <CustomerVsItemRejectConfirmation
//                 open={rejectDailogOpen}
//                 setOpen={setRejectDailogOpen}
//                 deleteId={rejectId}
//                 deleteService={CustomerVsItemPriceReject}
//                 handleSuccess={deletehandleSuccess}
//                 handleException={deletehandleException}
//                 priceFlag={priceFlag}
//                 rows={rows}
//                 remarks={remarks}
//                 setRemarks={setRemarks}
//             />

//             <NotificationBar
//                 handleClose={handleClose}
//                 notificationContent={openNotification.message}
//                 openNotification={openNotification.status}
//                 type={openNotification.type}
//             />
//         </div>
//     );
// };
// export default CustomerPriceRevisionApproval;

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
  Button
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import CustomerVsItemApprovalConfirmation from '../../AdminApproval/CustomerVsItemApprovalConfirmation/CustomerVsItemApprovalConfirmation';
import CustomerVsItemRejectConfirmation from '../../AdminApproval/CustomerVsItemRejectConfirmation/CustomerVsItemRejectConfirmation';
import {
  CustomerVsItemGetUpdatedRateListCustomer,
  CustomerVsItempriceRevisionApproval,
  CustomerVsItempriceRejectList,
  CustomerVsItemPriceReject
} from '../../../ApiService/LoginPageService';
import { useModuleLocks } from '../../context/ModuleLockContext';

const CustomerPriceRevisionApproval = () => {
  const [rows, setRows] = useState([]);
  const [rejectList, setRejectList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openNotification, setNotification] = useState({ status: false, type: '', message: '' });
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [rejectDailogOpen, setRejectDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [rejectId, setRejectId] = useState('');
  const [refreshData, setRefreshData] = useState(false);
  const [priceFlag, setPriceFlag] = useState('');
  const [remarks, setRemarks] = useState('');
  const [rejectedToggle, setRejectedToggle] = useState(false);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);


  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Price Revision Approval")?.lockStatus === "locked";

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setScreenHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Columns for active and rejected lists
  const columns = [
    { field: 'itemCode', headerName: 'Part No', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'itemName', headerName: 'Part Name', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'customer', headerName: 'Customer', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'customerDesc', headerName: 'Customer Description', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'old_rate', headerName: 'Previous Rate', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'new_rate', headerName: 'New Rate', flex: 1, align: 'center', headerAlign: 'center' },
  ];

  // Fetch data
  useEffect(() => {
    CustomerVsItemGetUpdatedRateListCustomer(handlePOGenerateServicesSuccess, handlePOGenerateServicesException);
    CustomerVsItempriceRejectList(handlePORejectSuccess, handlePORejectException);
  }, [refreshData, rejectedToggle]);

  const handlePOGenerateServicesSuccess = (dataObject) => setRows(dataObject?.data || []);
  const handlePOGenerateServicesException = (err, msg) => console.log(msg);
  const handlePORejectSuccess = (dataObject) => setRejectList(dataObject?.data || []);
  const handlePORejectException = (err, msg) => console.log(msg);

  // Notification handlers
  const handleCloseNotification = () => setNotification({ status: false, type: '', message: '' });
  const handleSuccess = (dataObject) => {
    setNotification({ status: true, type: 'success', message: dataObject.message });
    setRefreshData(old => !old);
    setTimeout(() => {
      setDeleteDailogOpen(false);
      setRejectDailogOpen(false);
      setPriceFlag('');
      setRemarks('');
      handleCloseNotification();
    }, 3000);
  };
  const handleException = (err, msg) => {
    setNotification({ status: true, type: 'error', message: msg });
    setTimeout(() => handleCloseNotification(), 3000);
  };

  // Handle row selection
  const handleRowSelection = (selectionModel) => setSelectedRows(selectionModel);

  return (
    <div style={{ height: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}>
          Customer vs Item Price Revision Approval
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={rejectedToggle} onChange={(e) => setRejectedToggle(e.target.checked)} />}
            label="VIEW REJECTED LISTS"
          />
        </FormGroup>
      </div>

      {/* Active or Rejected List */}
      <Grid container spacing={2} style={{ flex: 1 }}>
        <Grid item xs={12}>
          <Card style={{ boxShadow: '0 10px 10px 2px rgba(0,0,0,0.2)', marginTop: '10px', borderRadius: '10px', width: '100%' }}>
            <CardContent style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              {rejectedToggle && <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 10 }}>REJECTED LISTS</Typography>}
              <div style={{ height: rejectedToggle ? screenHeight - 299 : screenHeight - 315, width: '100%' }}>
                <DataGrid
                  rows={rejectedToggle ? rejectList : rows}
                  columns={columns}
                  pageSize={5}
                  checkboxSelection
                  disableRowSelectionOnClick
                  rowSelectionModel={selectedRows}
                  onRowSelectionModelChange={handleRowSelection}
                  rowHeight={40}
                  columnHeaderHeight={40}
                  sx={{
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#93bce6',
                      color: '#1c1919',
                      fontWeight: 'bold',
                    },
                    '& .MuiDataGrid-cell': { border: '1px solid #969696' },
                  }}
                />
              </div>

              {/* Approve/Reject buttons only for active list */}
              {!rejectedToggle && (
                <div style={{ textAlign: 'right', width: '100%', marginTop: 10, marginBottom: 10 }}>
                  <Button
                    variant="contained"
                    style={{ height: 30, backgroundColor: isModuleLocked ? "gray" : '#65B741', marginRight: 20 }}
                    onClick={() => { setDeleteDailogOpen(true); setPriceFlag('Price'); }}
                    disabled={isModuleLocked}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    style={{ height: 30, backgroundColor: isModuleLocked ? "gray" : '#D24545' }}
                    onClick={() => { setRejectDailogOpen(true); setPriceFlag('Price'); }}
                    disabled={isModuleLocked}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modals */}
      <CustomerVsItemApprovalConfirmation
        open={deleteDailogOpen}
        setOpen={setDeleteDailogOpen}
        deleteId={deleteId}
        deleteService={CustomerVsItempriceRevisionApproval}
        handleSuccess={handleSuccess}
        handleException={handleException}
        priceFlag={priceFlag}
        rows={rows.filter(r => selectedRows.includes(r.id))}
        remarks={remarks}
        setRemarks={setRemarks}
      />
      <CustomerVsItemRejectConfirmation
        open={rejectDailogOpen}
        setOpen={setRejectDailogOpen}
        deleteId={rejectId}
        deleteService={CustomerVsItemPriceReject}
        handleSuccess={handleSuccess}
        handleException={handleException}
        priceFlag={priceFlag}
        rows={rows.filter(r => selectedRows.includes(r.id))}
        remarks={remarks}
        setRemarks={setRemarks}
      />

      <NotificationBar
        handleClose={handleCloseNotification}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  );
};

export default CustomerPriceRevisionApproval;
