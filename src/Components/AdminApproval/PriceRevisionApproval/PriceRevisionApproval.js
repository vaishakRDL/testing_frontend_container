// import React, { useState } from 'react';
// import Typography from '@mui/material/Typography';
// import { Card, CardContent, Checkbox, FormControlLabel, FormGroup, Grid, Switch, Tooltip } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import Button from '@mui/material/Button';
// import { POGenerateServices, GetUpdatedRateList, priceRevisionApproval, priceRejectList } from '../../../ApiService/LoginPageService';
// import { useEffect } from 'react';
// import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
// // import CompliteSucess from './CompliteSucess';
// import Chip from '@mui/material/Chip';
// import { Link, useNavigate } from 'react-router-dom';
// import DownloadIcon from '@mui/icons-material/Download';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import ApprovalConfirmation from '../ApprovalConfirmation/ApprovalConfirmation';
// import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
// import RejectConfirmation from '../RejectConfirmation/RejectConfirmation';
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { useModuleLocks } from '../../context/ModuleLockContext';


// const PriceRevisionApproval = () => {
//     const moduleLocks = useModuleLocks();
//     const isModuleLocked =
//         moduleLocks.find(m => m.moduleName === "Price Revision Approval")?.lockStatus === "locked";

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
//     const isAnyRowSelected = rows.some(row => row.selected);
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
//             width: 50,
//             align: 'center', headerAlign: 'center',
//             renderHeader: (params) => (
//                 <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
//                     <Typography style={{ fontWeight: 'bold' }}>Select</Typography>
//                     <Checkbox checked={selectAll}
//                         disabled={isModuleLocked}
//                         onChange={handleSelectAllChange} />
//                     <span style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '16px' }}></span>
//                 </div>
//             ),
//             renderCell: (params) => (
//                 <Checkbox
//                     checked={params.row.selected}
//                     disabled={isModuleLocked}
//                     onChange={(e) => handleCheckboxChange(e, params.row.id)}
//                 />
//             ),
//         },
//         {
//             field: 'spCode',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier</span>,
//             width: 200,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             align: 'center',
//             headerAlign: 'center'
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
//             field: 'suppDesc',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier Desc</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'uom',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
//             width: 60,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             // flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'preRate',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Previous Rate</span>,
//             width: 110,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'newRate',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>New Rate</span>,
//             width: 100,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'changedBy',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Updated On</span>,
//             width: 110,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'category',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
//             width: 150,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         // {
//         //     field: 'actions',
//         //     type: 'actions',
//         //     width: 70,
//         //     flex: 1,
//         //     align: 'center',
//         //     headerAlign: 'center',
//         //     headerName: (
//         //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>
//         //     ),
//         //     cellClassName: 'actions',
//         //     disableClickEventBubbling: true,
//         //     getActions: (params) => [
//         //         <EditData selectedRow={params.row} />,
//         //         <DeleteData selectedRow={params.row} />,
//         //     ],
//         // },
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
//             field: 'uom',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'preRate',
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
//             field: 'newRate',
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
//         {
//             field: 'changedBy',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rejected On</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'rejRemarks',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
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
//         GetUpdatedRateList(handlePOGenerateServicesSuccess, handlePOGenerateServicesExceptoin);
//         priceRejectList(handlePORejectSuccess, handlePORejectException);
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
//             message: errorObject?.message,
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

//     const downloadExport = () => {
//         if (!rows || rows.length === 0) {
//             setNotification({
//                 status: true,
//                 type: "error",
//                 message: "No data available to download",
//             });
//             return;
//         }

//         // 👉 Export selected rows first, else all rows
//         const selectedRows = rows.filter(row => row.selected);
//         const dataSource = selectedRows.length > 0 ? selectedRows : rows;

//         const exportData = dataSource.map((row, index) => ({
//             "S.No": index + 1,
//             "Supplier": row.spCode,
//             "Part No": row.itemCode,
//             "Part Name": row.itemName,
//             "UOM": row.uom,
//             "Previous Rate": row.preRate,
//             "New Rate": row.newRate,
//             "Updated On": row.changedBy,
//             "Remarks": row.category,
//         }));

//         // 🔹 Create worksheet
//         const worksheet = XLSX.utils.json_to_sheet(exportData);

//         // 🔹 Header Styling (BOLD + CENTER + BACKGROUND)
//         const headerStyle = {
//             font: { bold: true, color: { rgb: "FFFFFF" } },
//             alignment: { horizontal: "center", vertical: "center" },
//             fill: { fgColor: { rgb: "305496" } }, // Dark Blue
//             border: {
//                 top: { style: "thin" },
//                 bottom: { style: "thin" },
//                 left: { style: "thin" },
//                 right: { style: "thin" },
//             },
//         };

//         // Apply header style
//         const headerKeys = Object.keys(exportData[0]);
//         headerKeys.forEach((key, index) => {
//             const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
//             if (worksheet[cellAddress]) {
//                 worksheet[cellAddress].s = headerStyle;
//             }
//         });

//         // 🔹 Auto Column Width
//         worksheet["!cols"] = [
//             { wch: 6 },   // S.No
//             { wch: 12 },  // Supplier
//             { wch: 14 },  // Part No
//             { wch: 25 },  // Part Name
//             { wch: 8 },   // UOM
//             { wch: 15 },  // Previous Rate
//             { wch: 15 },  // New Rate
//             { wch: 18 },  // Updated On
//             { wch: 25 },  // Remarks
//         ];

//         // 🔹 Create workbook
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Price Revision");

//         // 🔹 Export
//         const excelBuffer = XLSX.write(workbook, {
//             bookType: "xlsx",
//             type: "array",
//             cellStyles: true, // ⚠️ IMPORTANT
//         });

//         const fileData = new Blob([excelBuffer], {
//             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         });

//         saveAs(fileData, `Price_Revision_Approval_${Date.now()}.xlsx`);
//     };


//     return (
//         <div>
//             <div style={{ height: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
//                 <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}>
//                         Price Revision Approval
//                     </Typography>

//                     {/* <div>
//                         <FormGroup>
//                             <FormControlLabel control={<Switch checked={rejectedToggle} onChange={(e) => setRejectedToggle(e.target.checked)} />} label="VIEW REJECTED LISTS" />
//                         </FormGroup>
//                     </div> */}

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
//                                             style={{ height: '30px', backgroundColor: isModuleLocked || !isAnyRowSelected ? 'gray' : '#65B741', marginRight: '20px', color: 'white' }}
//                                             onClick={(event) => {
//                                                 // setDeleteId(props.selectedRow);
//                                                 setDeleteDailogOpen(true);
//                                                 setPriceFlag('Price');

//                                             }}
//                                             disabled={isModuleLocked || !isAnyRowSelected}
//                                         >
//                                             Approve
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             style={{ height: '30px', backgroundColor: isModuleLocked ? 'gray' : '#002D68', color: 'white' }}
//                                             onClick={downloadExport}
//                                             disabled={isModuleLocked}
//                                         >
//                                             Downlaod
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
//             <ApprovalConfirmation
//                 open={deleteDailogOpen}
//                 setOpen={setDeleteDailogOpen}
//                 deleteId={deleteId}
//                 deleteService={priceRevisionApproval}
//                 handleSuccess={deletehandleSuccess}
//                 handleException={deletehandleException}
//                 priceFlag={priceFlag}
//                 rows={rows}
//                 remarks={remarks}
//                 setRemarks={setRemarks}
//             />

//             <RejectConfirmation
//                 open={rejectDailogOpen}
//                 setOpen={setRejectDailogOpen}
//                 deleteId={rejectId}
//                 deleteService={priceRevisionApproval}
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
// export default PriceRevisionApproval;



// import React, { useMemo, useState } from 'react';
// import Typography from '@mui/material/Typography';
// import { Card, CardContent, Checkbox, FormControlLabel, FormGroup, Grid, Switch, Tooltip } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import Button from '@mui/material/Button';
// import { POGenerateServices, GetUpdatedRateList, priceRevisionApproval, priceRejectList } from '../../../ApiService/LoginPageService';
// import { useEffect } from 'react';
// import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
// // import CompliteSucess from './CompliteSucess';
// import Chip from '@mui/material/Chip';
// import { Link, useNavigate } from 'react-router-dom';
// import DownloadIcon from '@mui/icons-material/Download';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import ApprovalConfirmation from '../ApprovalConfirmation/ApprovalConfirmation';
// import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
// import RejectConfirmation from '../RejectConfirmation/RejectConfirmation';
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { useModuleLocks } from '../../context/ModuleLockContext';


// const PriceRevisionApproval = () => {
//     const moduleLocks = useModuleLocks();
//     const isModuleLocked =
//         moduleLocks.find(m => m.moduleName === "Price Revision Approval")?.lockStatus === "locked";

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
//     // const [selectAll, setSelectAll] = useState(false);
//     const [remarks, setRemarks] = useState('')
//     const [rejectedToggle, setRejectedToggle] = useState(false);
//     const [screenHeight, setScreenHeight] = useState(window.innerHeight);
//     const isAnyRowSelected = rows.some(row => row.selected);
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


//     const allSelected = rows.length > 0 && rows.every(row => row.selected);
//     const someSelected = rows.some(row => row.selected);

//     const columns1 = useMemo(() => [
//         {
//             field: 'selected',
//             headerClassName: 'super-app-theme--header',
//             sortable: false,
//             filterable: false,
//             width: 100,
//             align: 'center',
//             headerAlign: 'center',
//             renderHeader: () => (
//                 <Checkbox
//                     checked={allSelected}
//                     indeterminate={someSelected && !allSelected}
//                     disabled={isModuleLocked}
//                     onChange={handleSelectAllChange}
//                 />
//             ),
//             renderCell: (params) => (
//                 <Checkbox
//                     checked={params.row.selected || false}
//                     disabled={isModuleLocked}
//                     onChange={(e) => handleCheckboxChange(e, params.row.id)}
//                 />
//             ),
//         },
//         {
//             field: 'spCode',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier</span>,
//             width: 200,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             align: 'center',
//             headerAlign: 'center'
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
//             field: 'suppDesc',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier Desc</span>,
//             width: 60,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'uom',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
//             width: 60,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             // flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'preRate',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Previous Rate</span>,
//             width: 110,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'newRate',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>New Rate</span>,
//             width: 100,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'changedBy',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Updated On</span>,
//             width: 110,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'category',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
//             width: 150,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             align: 'center',
//             headerAlign: 'center'
//         },

//     ], [allSelected, someSelected, isModuleLocked]);

//     const handleCheckboxChange = (event, id) => {
//         setRows(prevRows =>
//             prevRows.map(row =>
//                 row.id === id ? { ...row, selected: event.target.checked } : row
//             )
//         );
//     };

//     const handleSelectAllChange = (event) => {
//         const isChecked = event.target.checked;

//         setRows(prevRows =>
//             prevRows.map(row => ({
//                 ...row,
//                 selected: isChecked
//             }))
//         );
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
//             field: 'uom',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'preRate',
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
//             field: 'newRate',
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
//         {
//             field: 'changedBy',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rejected On</span>,
//             width: 70,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'rejRemarks',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
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
//         GetUpdatedRateList(handlePOGenerateServicesSuccess, handlePOGenerateServicesExceptoin);
//         priceRejectList(handlePORejectSuccess, handlePORejectException);
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
//             message: errorObject?.message,
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

//     const downloadExport = () => {
//         if (!rows || rows.length === 0) {
//             setNotification({
//                 status: true,
//                 type: "error",
//                 message: "No data available to download",
//             });
//             return;
//         }

//         // 👉 Export selected rows first, else all rows
//         const selectedRows = rows.filter(row => row.selected);
//         const dataSource = selectedRows.length > 0 ? selectedRows : rows;

//         const exportData = dataSource.map((row, index) => ({
//             "S.No": index + 1,
//             "Supplier": row.spCode,
//             "Part No": row.itemCode,
//             "Part Name": row.itemName,
//             "UOM": row.uom,
//             "Previous Rate": row.preRate,
//             "New Rate": row.newRate,
//             "Updated On": row.changedBy,
//             "Remarks": row.category,
//         }));

//         // 🔹 Create worksheet
//         const worksheet = XLSX.utils.json_to_sheet(exportData);

//         // 🔹 Header Styling (BOLD + CENTER + BACKGROUND)
//         const headerStyle = {
//             font: { bold: true, color: { rgb: "FFFFFF" } },
//             alignment: { horizontal: "center", vertical: "center" },
//             fill: { fgColor: { rgb: "305496" } }, // Dark Blue
//             border: {
//                 top: { style: "thin" },
//                 bottom: { style: "thin" },
//                 left: { style: "thin" },
//                 right: { style: "thin" },
//             },
//         };

//         // Apply header style
//         const headerKeys = Object.keys(exportData[0]);
//         headerKeys.forEach((key, index) => {
//             const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
//             if (worksheet[cellAddress]) {
//                 worksheet[cellAddress].s = headerStyle;
//             }
//         });

//         // 🔹 Auto Column Width
//         worksheet["!cols"] = [
//             { wch: 6 },   // S.No
//             { wch: 12 },  // Supplier
//             { wch: 14 },  // Part No
//             { wch: 25 },  // Part Name
//             { wch: 8 },   // UOM
//             { wch: 15 },  // Previous Rate
//             { wch: 15 },  // New Rate
//             { wch: 18 },  // Updated On
//             { wch: 25 },  // Remarks
//         ];

//         // 🔹 Create workbook
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Price Revision");

//         // 🔹 Export
//         const excelBuffer = XLSX.write(workbook, {
//             bookType: "xlsx",
//             type: "array",
//             cellStyles: true, // ⚠️ IMPORTANT
//         });

//         const fileData = new Blob([excelBuffer], {
//             type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         });

//         saveAs(fileData, `Price_Revision_Approval_${Date.now()}.xlsx`);
//     };


//     return (
//         <div>
//             <div style={{ height: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
//                 <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}>
//                         Price Revision Approval
//                     </Typography>

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
//                                             style={{ height: '30px', backgroundColor: isModuleLocked || !isAnyRowSelected ? 'gray' : '#65B741', marginRight: '20px', color: 'white' }}
//                                             onClick={(event) => {
//                                                 // setDeleteId(props.selectedRow);
//                                                 setDeleteDailogOpen(true);
//                                                 setPriceFlag('Price');

//                                             }}
//                                             disabled={isModuleLocked || !isAnyRowSelected}
//                                         >
//                                             Approve
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             style={{ height: '30px', backgroundColor: isModuleLocked ? 'gray' : '#002D68', color: 'white' }}
//                                             onClick={downloadExport}
//                                             disabled={isModuleLocked}
//                                         >
//                                             Downlaod
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
//                                             rows={rows}
//                                             columns={columns1}
//                                             getRowId={(row) => row.id}   // 🔥 IMPORTANT
//                                             pageSize={5}
//                                             disableRowSelectionOnClick
//                                             rowHeight={40}
//                                             columnHeaderHeight={40}
//                                         />

//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </Grid>
//                     </Grid>
//                 }

//             </div>
//             <ApprovalConfirmation
//                 open={deleteDailogOpen}
//                 setOpen={setDeleteDailogOpen}
//                 deleteId={deleteId}
//                 deleteService={priceRevisionApproval}
//                 handleSuccess={deletehandleSuccess}
//                 handleException={deletehandleException}
//                 priceFlag={priceFlag}
//                 rows={rows}
//                 remarks={remarks}
//                 setRemarks={setRemarks}
//             />

//             <RejectConfirmation
//                 open={rejectDailogOpen}
//                 setOpen={setRejectDailogOpen}
//                 deleteId={rejectId}
//                 deleteService={priceRevisionApproval}
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
// export default PriceRevisionApproval;



import React, { useMemo, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Card, CardContent, Checkbox, FormControlLabel, FormGroup, Grid, Switch, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { POGenerateServices, GetUpdatedRateList, priceRevisionApproval, priceRejectList } from '../../../ApiService/LoginPageService';
import { useEffect } from 'react';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
// import CompliteSucess from './CompliteSucess';
import Chip from '@mui/material/Chip';
import { Link, useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ApprovalConfirmation from '../ApprovalConfirmation/ApprovalConfirmation';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import RejectConfirmation from '../RejectConfirmation/RejectConfirmation';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useModuleLocks } from '../../context/ModuleLockContext';


const PriceRevisionApproval = () => {
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Price Revision Approval")?.lockStatus === "locked";

    const [rows, setRows] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [rejectDailogOpen, setRejectDailogOpen] = useState(false)
    const [rejectId, setRejectId] = useState('')
    const [refreshData, setRefreshData] = useState(false);
    const [rejectList, setRejectList] = useState([]);
    const [priceFlag, setPriceFlag] = useState('');
    // const [selectAll, setSelectAll] = useState(false);
    const [remarks, setRemarks] = useState('')
    const [rejectedToggle, setRejectedToggle] = useState(false);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);

    // ✅ Track IDs of rows currently visible after DataGrid filtering
    const [visibleRowIds, setVisibleRowIds] = useState([]);

    const isAnyRowSelected = rows.some(row => row.selected);

    // ✅ Only rows that are BOTH selected (checked) AND visible in current filter
    const selectedFilteredRows = rows.filter(
        row => row.selected && (visibleRowIds.length === 0 || visibleRowIds.includes(row.id))
    );

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


    const allSelected = rows.length > 0 && rows.every(row => row.selected);
    const someSelected = rows.some(row => row.selected);

    const columns1 = useMemo(() => [
        {
            field: 'selected',
            headerClassName: 'super-app-theme--header',
            sortable: false,
            filterable: false,
            width: 100,
            align: 'center',
            headerAlign: 'center',
            renderHeader: () => (
                <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected && !allSelected}
                    disabled={isModuleLocked}
                    onChange={handleSelectAllChange}
                />
            ),
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.selected || false}
                    disabled={isModuleLocked}
                    onChange={(e) => handleCheckboxChange(e, params.row.id)}
                />
            ),
        },
        {
            field: 'spCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier</span>,
            width: 200,
            type: 'string',
            sortable: true,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Name</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'suppDesc',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier Desc</span>,
            width: 60,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
            width: 60,
            type: 'string',
            sortable: true,
            minWidth: 100,
            // flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'preRate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Previous Rate</span>,
            width: 110,
            type: 'string',
            sortable: true,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'newRate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>New Rate</span>,
            width: 100,
            type: 'string',
            sortable: true,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'changedBy',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Updated On</span>,
            width: 110,
            type: 'string',
            sortable: true,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'category',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            width: 150,
            type: 'string',
            sortable: true,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center'
        },

    ], [allSelected, someSelected, isModuleLocked]);

    const handleCheckboxChange = (event, id) => {
        setRows(prevRows =>
            prevRows.map(row =>
                row.id === id ? { ...row, selected: event.target.checked } : row
            )
        );
    };

    const handleSelectAllChange = (event) => {
        const isChecked = event.target.checked;

        setRows(prevRows =>
            prevRows.map(row => ({
                ...row,
                selected: isChecked
            }))
        );
    };


    const columns2 = [
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Name</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'preRate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Previous Rate</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'newRate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>New Rate</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'changedBy',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rejected On</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'rejRemarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            width: 70,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
    ];


    function EditData(props) {
        return (
            <Button
                variant="contained"
                type='submit'
                style={{ height: '30px', backgroundColor: '#65B741' }}
                onClick={(event) => {
                    setDeleteId(props.selectedRow);
                    setDeleteDailogOpen(true);
                    setPriceFlag('Price');
                }}
            >
                Approve
            </Button>
        );
    }

    function DeleteData(props) {
        return (
            <Button
                variant="contained"
                type='submit'
                style={{ height: '30px', backgroundColor: '#D24545' }}
                onClick={(event) => {
                    setRejectId(props.selectedRow);
                    setRejectDailogOpen(true);
                    setPriceFlag('Price');
                }}
            >
                Reject
            </Button>
        );
    }

    useEffect(() => {
        GetUpdatedRateList(handlePOGenerateServicesSuccess, handlePOGenerateServicesExceptoin);
        priceRejectList(handlePORejectSuccess, handlePORejectException);
    }, [refreshData, rejectedToggle]);

    const handlePORejectSuccess = (dataObject) => {
        setRejectList(dataObject?.data || []);
    }

    const handlePORejectException = (errorObject, errorMessage) => {
        console.log("error Msg", errorMessage);
    }

    const handlePOGenerateServicesSuccess = (dataObject) => {
        setRows(dataObject?.data || []);
    }

    const handlePOGenerateServicesExceptoin = (errorObject, errorMessage) => {
        console.log("error Msg", errorMessage);
    }

    const handlePrintButtonClick = (id) => {
        console.log(`Print button clicked for row with id: ${id}`);
    };

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
            setRejectDailogOpen(false);
            setPriceFlag(false);
            setRemarks('');
        }, 3000);
    };
    const deletehandleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorObject?.message,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const downloadExport = () => {
        if (!rows || rows.length === 0) {
            setNotification({
                status: true,
                type: "error",
                message: "No data available to download",
            });
            return;
        }

        // 👉 Export selected rows first, else all rows
        const selectedRows = rows.filter(row => row.selected);
        const dataSource = selectedRows.length > 0 ? selectedRows : rows;

        const exportData = dataSource.map((row, index) => ({
            "S.No": index + 1,
            "Supplier": row.spCode,
            "Part No": row.itemCode,
            "Part Name": row.itemName,
            "UOM": row.uom,
            "Previous Rate": row.preRate,
            "New Rate": row.newRate,
            "Updated On": row.changedBy,
            "Remarks": row.category,
        }));

        // 🔹 Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // 🔹 Header Styling (BOLD + CENTER + BACKGROUND)
        const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: "305496" } }, // Dark Blue
            border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
            },
        };

        // Apply header style
        const headerKeys = Object.keys(exportData[0]);
        headerKeys.forEach((key, index) => {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].s = headerStyle;
            }
        });

        // 🔹 Auto Column Width
        worksheet["!cols"] = [
            { wch: 6 },   // S.No
            { wch: 12 },  // Supplier
            { wch: 14 },  // Part No
            { wch: 25 },  // Part Name
            { wch: 8 },   // UOM
            { wch: 15 },  // Previous Rate
            { wch: 15 },  // New Rate
            { wch: 18 },  // Updated On
            { wch: 25 },  // Remarks
        ];

        // 🔹 Create workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Price Revision");

        // 🔹 Export
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
            cellStyles: true, // ⚠️ IMPORTANT
        });

        const fileData = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(fileData, `Price_Revision_Approval_${Date.now()}.xlsx`);
    };


    return (
        <div>
            <div style={{ height: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}>
                        Price Revision Approval
                    </Typography>

                </div>
                {rejectedToggle === false ?
                    <Grid container spacing={2} style={{ flex: 1 }}>
                        {/* First Grid */}
                        <Grid item xs={12}>
                            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '10px', borderRadius: '10px', width: '100%' }}>
                                <CardContent style={{ padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Typography variant="h9" style={{ fontWeight: 'bold' }}></Typography>
                                    <div style={{ height: screenHeight - 315, width: '100%' }}>
                                        <DataGrid
                                            rows={rows}
                                            columns={columns1}
                                            pageSize={5}
                                            disableSelectionOnClick
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                            // ✅ Capture visible row IDs whenever filter changes
                                            onStateChange={(state) => {
                                                const filteredLookup = state.filter?.filteredRowsLookup;
                                                if (filteredLookup) {
                                                    const ids = Object.keys(filteredLookup)
                                                        .filter(id => filteredLookup[id] === true)
                                                        .map(id => isNaN(id) ? id : Number(id));
                                                    setVisibleRowIds(ids);
                                                }
                                            }}
                                            sx={{
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
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return '';
                                            }}
                                        />
                                    </div>
                                    <div style={{ textAlign: 'right', width: '100%', marginTop: '10px', marginBottom: '10px' }}>
                                        <Button
                                            variant="contained"
                                            type='submit'
                                            style={{ height: '30px', backgroundColor: isModuleLocked || !isAnyRowSelected ? 'gray' : '#65B741', marginRight: '20px', color: 'white' }}
                                            onClick={(event) => {
                                                // setDeleteId(props.selectedRow);
                                                setDeleteDailogOpen(true);
                                                setPriceFlag('Price');

                                            }}
                                            disabled={isModuleLocked || !isAnyRowSelected}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{ height: '30px', backgroundColor: isModuleLocked ? 'gray' : '#002D68', color: 'white' }}
                                            onClick={downloadExport}
                                            disabled={isModuleLocked}
                                        >
                                            Downlaod
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    :
                    <Grid container spacing={2} style={{ flex: 1 }}>
                        <Grid item xs={12}>
                            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '10px', borderRadius: '10px', width: '100%' }}>
                                <CardContent style={{ padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Typography variant="h9" style={{ fontWeight: 'bold', marginBottom: '10px' }}>REJECTED LISTS</Typography>
                                    <div style={{ height: screenHeight - 299, width: '100%' }}>
                                        <DataGrid
                                            rows={rows}
                                            columns={columns1}
                                            getRowId={(row) => row.id}   // 🔥 IMPORTANT
                                            pageSize={5}
                                            disableRowSelectionOnClick
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                        />

                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                }

            </div>
            <ApprovalConfirmation
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                deleteService={priceRevisionApproval}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
                priceFlag={priceFlag}
                rows={selectedFilteredRows}
                remarks={remarks}
                setRemarks={setRemarks}
            />

            <RejectConfirmation
                open={rejectDailogOpen}
                setOpen={setRejectDailogOpen}
                deleteId={rejectId}
                deleteService={priceRevisionApproval}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
                priceFlag={priceFlag}
                rows={selectedFilteredRows}
                remarks={remarks}
                setRemarks={setRemarks}
            />

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div>
    );
};
export default PriceRevisionApproval;