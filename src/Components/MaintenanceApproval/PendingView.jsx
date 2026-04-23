// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Grid,
//   TextField,
//   Box,
//   Typography,
//   InputLabel,
//   Snackbar,
//   Checkbox,
//   FormControlLabel,
//   Card,
//   CardContent,
//   Tooltip,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import React, { useEffect, useState } from "react";
// import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// // import { DamageDeleteType, MaintenanceDamagedPart, MaintenanceEditDamagedPart, MaintenanceEditReplacedPart, MaintenanceReplacedPart, MaintenanceUpdate, MaintenenceAproveReject, MaintenenceDamagedList, MaintenenceReplacementList, PartsDelete, ReplaceDeleteType, showMaintanceDatabyiD } from "../../Services/NodeJsApiServices";
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
// import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
// import { MaintanenceApprovRejList, MaintanenceDetailsList } from "../../ApiService/LoginPageService";
// // import DeleteConfirmationDailog from "../UserComponent/SubUserComponent/DeleteConfirmationDailog";
// // import {
// //   MaintenenceAproveReject,
// //   showMaintanceDatabyiD,
// // } from "../../../services/LoginServiceNod";


// export const PendingView = ({
//   open,
//   setOpen,
//   rowid,
//   setRowid,
//   rowdata,
//   setrowdata,
//   ison,
//   index,
//   setRefresh

// }) => {
//   const [showImages, setShowImages] = useState(false);
//   const [notificationMessage, setNotificationMessage] = useState("");
//   const [notificationSeverity, setNotificationSeverity] = useState("success");
//   const [notificationOpen, setNotificationOpen] = useState(false);
//   const [damagedList, setDamagedList] = useState([]);
//   const [replacedlist, setReplacedList] = useState([]);
//   const [reason, setreason] = useState("");
//   const [openNotification, setNotification] = useState({
//     status: false,
//     type: 'error',
//     message: '',
//   });
//   const [refreshData, setRefreshData] = useState(false);

//   const [scheduleDetails, setScheduleDetails] = useState([]);
//   const [scheduleImages, setScheduleImages] = useState([]);

//   const [openReject, setOpenReject] = useState(false);
//   const [openUpdate, setOpenUpdate] = useState(false);
//   const [checked, setChecked] = useState(false);
//   const [cause, setcause] = useState('');
//   const [Correction, setCorrection] = useState('');
//   const [CorrAction, setCorrAction] = useState('')
//   const [DmpartName, setDmPartName] = useState('');
//   const [DmQuantity, setDMQuantity] = useState('');
//   const [RepartName, setREPartName] = useState('')
//   const [ReQuantity, setREQuantity] = useState('')
//   const [showDataGrid, setShowDataGrid] = useState(false);
//   const [rows, setRow] = useState([]);
//   const [showDataGridPart, setShowDataGridPart] = useState(false);
//   const [isAddButton, setIsAddButton] = useState(true);
//   const [isAddButtonReplace, setIsAddButtonReplace] = useState(true);
//   const [id, setId] = useState('')
//   const [replaceid, setReplaceId] = useState('')
//   const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
//   const [deleteDamageDailogOpen, setDeleteDamageDailogOpen] = useState(false);
//   const [deleteReplaceDailogOpen, setDeleteReplaceDailogOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState('');
//   const [ReplacedeleteId, setReplaceDeleteId] = useState('');
//   const [damagedDeleteId, setDamagedDeleteId] = useState('');

//   const handleCheckboxChange = (event) => {
//     setChecked(event.target.checked);
//   };

//   const handleClickOpenReject = () => {
//     setOpenReject(true);
//   };

//   const handleCloseReject = () => {
//     setOpenReject(false);
//   };

//   const handleApprove = (id) => {
//     // Your approval logic here
//     console.log(`Approved item with id: ${id}`);
//     handleClose();
//   };

//   const handleClickOpenUpdate = () => {
//     setOpenUpdate(true);
//   };

//   const handleCloseUpdate = () => {
//     setOpenUpdate(false);
//     setDmPartName('');
//     setDMQuantity('');
//     setREPartName('');
//     setREQuantity('');
//   };

//   const handleCloseNotification = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setNotificationOpen(false);
//   };

//   const handleClose = () => {
//     setOpen(false);

//   };
//   const handleClose1 = () => {
//     setNotification(false)

//   };


//   const toggleImages = () => {
//     setShowImages(!showImages);
//   };

//   const columns = [
//     { field: "id", headerName: "ID", width: 60, align: "center", headerAlign: "center" },
//     { field: "type", headerName: "Type", flex: 1, minWidth: 100 },
//     { field: "name", headerName: "Part Name", flex: 1.5, minWidth: 150 },
//     { field: "part", headerName: "Part No", flex: 1, minWidth: 100 },
//     { field: "quantity", headerName: "Quantity", flex: 1, minWidth: 100, align: "center", headerAlign: "center" },
//     { field: "unit", headerName: "Unit", flex: 1, minWidth: 100, align: "center", headerAlign: "center" },
//     { field: "total_amount", headerName: "Total Amount", flex: 1, minWidth: 120, align: "right", headerAlign: "right" },
//   ];


//   const columns2 = [
//     {
//       field: "id",
//       headerClassName: "super-app-theme--header",
//       headerName: "ID",
//       minWidth: 100,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },

//     {
//       field: "damagedPartName",
//       headerClassName: "super-app-theme--header",
//       headerName: "Damaged PartName",
//       minWidth: 100,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "quantity",
//       headerClassName: "super-app-theme--header",
//       headerName: "Quantity",
//       minWidth: 100,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: 'actions',
//       type: 'actions',
//       headerName: 'Actions',
//       headerAlign: 'center',
//       // width: 180,
//       flex: 1,
//       align: 'center',
//       cellClassName: 'actions',
//       getActions: (params) => [
//         <EditData selectedRow={params.row} />,
//         <DamageDeleteData selectedRow={params.row} />,
//         // <Password selectedRow={params.row} />,
//       ],
//     },
//   ];


//   const columns1 = [
//     {
//       field: "id",
//       headerClassName: "super-app-theme--header",
//       headerName: "ID",
//       minWidth: 100,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "replacementPartName",
//       headerClassName: "super-app-theme--header",
//       headerName: "Replacement Part Name",
//       minWidth: 100,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: "quantity",
//       headerClassName: "super-app-theme--header",
//       headerName: "Quantity",
//       minWidth: 100,
//       flex: 1,
//       align: "center",
//       headerAlign: "center",
//     },
//     {
//       field: 'actions',
//       type: 'actions',
//       headerName: 'Actions',
//       headerAlign: 'center',
//       // width: 180,
//       flex: 1,
//       align: 'center',
//       cellClassName: 'actions',
//       getActions: (params) => [
//         <EditDataReplace selectedRow={params.row} />,
//         <ReplaceDeleteData selectedRow={params.row} />,
//         // <Password selectedRow={params.row} />,
//       ],
//     },

//   ];
//   const EditData = (params) => {
//     return (
//       <Tooltip title='Edit'>
//         <EditIcon
//           onClick={(event) => {
//             event.stopPropagation();
//             setIsAddButton(false);
//             // setEditDamage(params.selectedRow);
//             setId(params.selectedRow.id || '');
//             setDmPartName(params.selectedRow.damagedPartName || '');
//             setDMQuantity(params.selectedRow.quantity || '');
//           }}
//           style={{ cursor: 'pointer', color: '#18143D' }}
//         />
//       </Tooltip>
//     )
//   };

//   const DeleteData = (params) => {
//     return (
//       <Tooltip title='Delete'>
//         <DeleteIcon
//           onClick={(event) => {
//             event.stopPropagation();
//             setDeleteDailogOpen(true);
//             setDeleteId(params.selectedRow.id);
//             // OperatorDelete();
//           }}
//           style={{ cursor: 'pointer', color: '#18143D' }}
//         />
//       </Tooltip>
//     )
//   };

//   const EditDataReplace = (params) => {
//     return (
//       <Tooltip title='EditReplace'>
//         <EditIcon
//           onClick={(event) => {
//             event.stopPropagation();
//             setIsAddButtonReplace(false);
//             setReplaceId(params.selectedRow.id || '');
//             setREPartName(params.selectedRow.replacementPartName || '');
//             setREQuantity(params.selectedRow.quantity || '');
//           }}
//           style={{ cursor: 'pointer', color: '#18143D' }}
//         />
//       </Tooltip>
//     )
//   };

//   const ReplaceDeleteData = (params) => {
//     return (
//       <Tooltip title='ReplaceDelete'>
//         <DeleteIcon
//           onClick={(event) => {
//             event.stopPropagation();
//             setDeleteReplaceDailogOpen(true);
//             setReplaceDeleteId(params.selectedRow.id);
//             // OperatorDelete();

//           }}
//           style={{ cursor: 'pointer', color: '#18143D' }}
//         />
//       </Tooltip>
//     )
//   };


//   const DamageDeleteData = (params) => {
//     return (
//       <Tooltip title='ReplaceDelete'>
//         <DeleteIcon
//           onClick={(event) => {
//             event.stopPropagation();
//             setDeleteDamageDailogOpen(true);
//             setDamagedDeleteId(params.selectedRow.id);
//             // OperatorDelete();

//           }}
//           style={{ cursor: 'pointer', color: '#18143D' }}
//         />
//       </Tooltip>
//     )
//   };


//   useEffect(() => {
//     if (open && rowdata?.id) {
//       MaintanenceDetailsList(
//         { scheduleId: rowdata.id },
//         (res) => {
//           setScheduleDetails(res?.consumables || []);
//           setScheduleImages(res?.images || []);
//         },
//         (err) => {
//           console.error("Failed to fetch details:", err);
//           setScheduleDetails([]);
//           setScheduleImages([]);
//         }
//       );
//     }
//   }, [open, rowdata]);

//   const handleAssignSubShowData = (dataObject) => {
//     setRow(dataObject?.data || []);
//   };


//   const handleAssignSubShowDataException = (errorObject, errorMessage) => {
//     console.log(errorMessage);
//   };

//   const handleDamagedList = (dataObject) => {

//     setDamagedList(dataObject?.data || []);
//   };
//   const handleDamagedListException = (errorObject, errorMessage) => {
//     console.log(errorMessage);
//   };

//   const handleReplacedList = (dataObject) => {
//     setReplacedList(dataObject?.data || []);
//   };
//   const handleReplacedListException = (errorObject, errorMessage) => {
//     console.log(errorMessage);
//   };

//   const [buttonStatus, setButtonStatus] = useState('');

//   const handleAprove = (value) => {
//     setButtonStatus(value);

//     const payload = {
//       scheduleId: rowdata?.id ? String(rowdata.id) : "",
//       status: value === 1 ? "approve" : "reject"
//     };

//     // if (value === 2) {
//     //   payload.reason = reason;
//     // }

//     MaintanenceApprovRejList(
//       payload,
//       handleApproveRejectSuccuss,
//       handleApproveRejectException
//     );
//   };

//   const handleApproveRejectSuccuss = () => {
//     setRefresh(prev => !prev)
//     console.log("handleAprovehandleAprove", buttonStatus)
//     setNotification({
//       status: true,
//       type: 'success',
//       message: Number(buttonStatus) === 1 ? "Approved Success" : "Rejected Success",
//     });
//     setTimeout(() => {
//       handleClose();
//     }, 2000)
//   };

//   const handleApproveRejectException = () => {
//     setNotification({
//       status: true,
//       type: "error",
//       message: "An error occurred.",
//     });
//   };

//   const handelupdate = () => {
//     // MaintenanceUpdate({
//     //   id: rowid,
//     //   cause: cause,
//     //   correction: Correction,
//     //   corrective_action: CorrAction
//     // }, handelMaintupdate, handelexception)
//   }


//   const handelMaintupdate = (dataObject) => {

//     setNotification({
//       status: true,
//       type: 'success',
//       message: dataObject.message,
//     });
//     setTimeout(() => {
//       setOpenUpdate(false);
//       setOpen(prev => !prev);
//     }, 2000);
//     setRefresh(pre => !pre)

//   }

//   const handelexception = () => {

//   };
//   const AddDamagedParts = () => {
//     // if (isAddButton) {
//     //   MaintenanceDamagedPart({
//     //     id: rowid,
//     //     damagedPartName: DmpartName,
//     //     quantity: DmQuantity,
//     //   }, handeldamagedPartSuccess, handeldamagedPartexception)
//     // } else {
//     //   MaintenanceEditDamagedPart({
//     //     // id: rowid,
//     //     id,
//     //     damagedPartName: DmpartName,
//     //     quantity: DmQuantity,
//     //   }, handeldamagedPartSuccess, handeldamagedPartexception)
//     // }
//   };

//   const handeldamagedPartSuccess = (dataObject) => {
//     setRefreshData((oldvalue) => !oldvalue);
//     setIsAddButton(true);
//     setDmPartName('');
//     setDMQuantity('');
//     setNotification({
//       status: true,
//       type: 'success',
//       message: dataObject.message,
//     });
//     setTimeout(() => {
//       // setOpenUpdate(false);
//     }, 2000);
//   };

//   const handeldamagedPartexception = () => {

//   }

//   const AddReplacementParts = () => {
//     // setShowDataGridPart(true);
//     // if (isAddButtonReplace) {
//     //   MaintenanceReplacedPart({
//     //     id: rowid,
//     //     replacementPartName: RepartName,
//     //     quantity: ReQuantity,
//     //   }, handelReplacePartSuccess, handelReplacePartexception)
//     // }
//     // else {
//     //   MaintenanceEditReplacedPart({
//     //     id: replaceid,
//     //     replacementPartName: RepartName,
//     //     quantity: ReQuantity,
//     //   }, handelReplacePartSuccess, handelReplacePartexception)
//     // };
//   }

//   const handelReplacePartSuccess = (dataObject) => {
//     setRefreshData((oldvalue) => !oldvalue);
//     setIsAddButtonReplace(true)
//     setREPartName('');
//     setREQuantity('');
//     setNotification({
//       status: true,
//       type: 'success',
//       message: dataObject.message,
//     });
//     setTimeout(() => {
//       // setOpenUpdate(false);
//     }, 2000);
//   };

//   const handelReplacePartexception = () => {

//   };
//   const RoleDelete = (id) => {
//     // PartsDelete({ id }, RoleDeleteSuccess, RoleDeleteException)
//   };


//   const RoleDeleteSuccess = (dataObject) => {
//     setDeleteDailogOpen(false);
//     setRefreshData((oldvalue) => !oldvalue)


//   };

//   const RoleDeleteException = (dataObject) => {

//   };


//   const ReplaceDelete = (id) => {
//     // ReplaceDeleteType({ id }, ReplaceDeleteSuccess, ReplaceDeleteException)
//   };

//   const ReplaceDeleteSuccess = (dataObject) => {
//     setDeleteDamageDailogOpen(false);
//     setRefreshData((oldvalue) => !oldvalue)
//   };

//   const ReplaceDeleteException = (dataObject) => {

//   };


//   const DamageDelete = (id) => {
//     // DamageDeleteType({ id }, DamageDeleteSuccess, DamageDeleteException)
//   };

//   const DamageDeleteSuccess = (dataObject) => {
//     setDeleteReplaceDailogOpen(false);
//     setRefreshData((oldvalue) => !oldvalue)
//   };

//   const DamageDeleteException = (dataObject) => {

//   };

//   const DetailField = ({ label, value }) => (
//     <Box sx={{ p: 1.5, borderRadius: "8px", border: "1px solid #E2E6EA", background: "#F9FAFB", height: "100%" }}>
//       <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em", mb: 0.5 }}>
//         {label}
//       </Typography>
//       <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#1A1A2E" }}>
//         {value || "—"}
//       </Typography>
//     </Box>
//   );

//   return (
//     <div>
//       <Dialog
//         sx={{
//           "& .MuiDialog-paper": {
//             borderRadius: "16px",
//             boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
//           }
//         }}
//         maxWidth="md"
//         fullWidth
//         open={open}
//         onClose={handleClose}
//       >
//         <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E2E6EA", py: 2.5, px: 3 }}>
//           <Box>
//             <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: "#1A1A2E" }}>
//               Estimated Maintenance Details
//             </Typography>
//             <Typography sx={{ fontSize: "0.8rem", color: "#6B7280", mt: 0.3 }}>
//               Review the schedule breakdown before approving or rejecting
//             </Typography>
//           </Box>
//         </DialogTitle>
//         <DialogContent sx={{ p: "24px !important", background: "#FFFFFF", overflowY: "auto" }}>

//           {/* Details Grid */}
//           <Grid container spacing={2} sx={{ mb: 4 }}>
//             <Grid item xs={12} sm={4}>
//               <DetailField label="Assigned Supervisor" value={rowdata?.userName || rowdata?.supervisor || rowdata?.supervisor_id} />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <DetailField label="Category" value={rowdata?.Category_name || rowdata?.problem_category} />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <DetailField label="Nature of Problem" value={rowdata?.Nature_problem || rowdata?.problem_nature} />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <DetailField label="Machine / Asset" value={rowdata?.assetName || rowdata?.machine} />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <DetailField label="Schedule Type" value={rowdata?.type1 || rowdata?.schedule_type} />
//             </Grid>
//             <Grid item xs={12} sm={4}>
//               <DetailField label="Manpower Mode" value={rowdata?.type2 || rowdata?.manpower_mode} />
//             </Grid>
//             <Grid item xs={12}>
//               <DetailField label="Problem Note" value={rowdata?.ProblemNote || rowdata?.problem_note} />
//             </Grid>
//           </Grid>

//           {/* Parts Grid */}
//           <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: "#1A1A2E", mb: 1.5, letterSpacing: "0.02em" }}>
//             Estimated Parts / Consumables
//           </Typography>
//           <Box sx={{ border: "1px solid #E2E6EA", borderRadius: "12px", overflow: "hidden", mb: 4 }}>
//             <DataGrid
//               rows={scheduleDetails}
//               columns={columns}
//               autoHeight
//               disableSelectionOnClick
//               hideFooter
//               sx={{
//                 border: "none",
//                 "& .MuiDataGrid-columnHeaders": {
//                   background: "#93bce6", borderBottom: "1px solid #E2E6EA",
//                   "& .MuiDataGrid-columnHeaderTitle": { fontWeight: 800, fontSize: "0.75rem", color: "#000000", textTransform: "uppercase" },
//                 },
//                 "& .MuiDataGrid-row:hover": { bgcolor: "rgba(15, 98, 254, 0.04)" },
//                 "& .MuiDataGrid-cell": { borderColor: "#E2E6EA", fontSize: "0.85rem", color: "#1A1A2E" },
//               }}
//             />
//           </Box>

//           {/* Images */}
//           <Box sx={{ display: "flex", alignItems: "center", mb: 2, cursor: "pointer", userSelect: "none" }} onClick={toggleImages}>
//             <RemoveRedEyeIcon sx={{ mr: 1, fontSize: 18, color: "#0F62FE" }} />
//             <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: "#0F62FE", letterSpacing: "0.02em" }}>
//               {showImages ? "Hide Breakdown Images" : "View Breakdown Images"}
//             </Typography>
//           </Box>
//           {showImages && (
//             <Grid container spacing={2} sx={{ mb: 3 }}>
//               {scheduleImages.map((img, idx) => (
//                 <Grid item xs={12} sm={3} key={idx}>
//                   <Box
//                     component="img"
//                     src={`${process.env.REACT_APP_IMAGE_URL || ''}/${img.image_path}`}
//                     alt={`Image ${idx + 1}`}
//                     sx={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #E2E6EA" }}
//                   />
//                 </Grid>
//               ))}
//               {scheduleImages.length === 0 && (
//                 <Grid item xs={12}>
//                   <Typography sx={{ color: "#6B7280", fontStyle: "italic", ml: 1, fontSize: "0.85rem" }}>
//                     No breakdown images found.
//                   </Typography>
//                 </Grid>
//               )}
//             </Grid>
//           )}

//           {/* Action Buttons */}
//           {!ison && (
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 4, pt: 3, borderTop: "1px solid #E2E6EA" }}>
//               <Button
//                 variant="contained"
//                 onClick={() => handleAprove(1)}
//                 sx={{
//                   flex: 1, height: "46px", borderRadius: "8px", bgcolor: "#24A148", color: "#fff",
//                   fontWeight: 700, fontSize: "0.9rem", textTransform: "none", boxShadow: "none",
//                   "&:hover": { bgcolor: "#1D8239", boxShadow: "none" }
//                 }}
//               >
//                 Approve Schedule
//               </Button>
//               <Button
//                 variant="outlined"
//                 onClick={handleClickOpenReject}
//                 sx={{
//                   flex: 1, height: "46px", borderRadius: "8px", borderColor: "#DA1E28", color: "#DA1E28",
//                   fontWeight: 700, fontSize: "0.9rem", textTransform: "none",
//                   "&:hover": { bgcolor: "rgba(218,30,40,0.06)", borderColor: "#DA1E28" }
//                 }}
//               >
//                 Reject Schedule
//               </Button>

//               <Dialog
//                 open={openReject}
//                 onClose={handleCloseReject}
//                 sx={{ "& .MuiDialog-paper": { width: "400px", borderRadius: "12px", p: 1 } }}
//               >
//                 <DialogTitle sx={{ fontWeight: 800, fontSize: "1.1rem", color: "#1A1A2E", pb: 1 }}>
//                   Reason for Rejection
//                 </DialogTitle>
//                 <DialogContent>
//                   <TextField
//                     fullWidth
//                     multiline
//                     rows={4}
//                     placeholder="Please specify why this schedule is being rejected..."
//                     value={reason}
//                     onChange={(e) => setreason(e.target.value)}
//                     sx={{
//                       mt: 1,
//                       "& .MuiOutlinedInput-root": {
//                         borderRadius: "8px", fontSize: "0.85rem",
//                         "& fieldset": { borderColor: "#E2E6EA" },
//                         "&.Mui-focused fieldset": { borderColor: "#DA1E28" }
//                       }
//                     }}
//                   />
//                 </DialogContent>
//                 <DialogActions sx={{ pt: 0, pb: 2, px: 3, gap: 1 }}>
//                   <Button onClick={handleCloseReject} sx={{ color: "#6B7280", fontWeight: 700, textTransform: "none" }}>
//                     Cancel
//                   </Button>
//                   <Button
//                     onClick={() => { handleAprove(2); handleCloseReject(); }}
//                     variant="contained"
//                     sx={{
//                       bgcolor: "#DA1E28", color: "#fff", fontWeight: 700, borderRadius: "6px", boxShadow: "none", textTransform: "none",
//                       "&:hover": { bgcolor: "#B81921", boxShadow: "none" }
//                     }}
//                   >
//                     Confirm Reject
//                   </Button>
//                 </DialogActions>
//               </Dialog>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions style={{ justifyContent: "flex-end" }}>
//           {index === 0 && (
//             <Button
//               variant="contained"
//               style={{ background: "#051622", color: "white" }}
//               onClick={handleClickOpenUpdate}
//             >
//               Complete Maintenance
//             </Button>
//           )}


//           <Dialog
//             open={openUpdate}
//             // onClose={handleCloseUpdate}
//             sx={{ "& .MuiDialog-paper": { width: "52%", maxHeight: "100%" } }}
//             maxWidth="lg"
//           >
//             <DialogTitle style={{ background: "#051622", color: "white" }}>
//               Update
//             </DialogTitle>
//             <DialogContent>
//               <Grid container spacing={2} style={{ marginTop: "10px" }}>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Problem Category"
//                     placeholder="Cause"
//                     variant="outlined"
//                     // onChange={(e) => {
//                     // const value = e.target.value;
//                     // Only allow alphanumeric characters and spaces
//                     // const filteredValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
//                     // setcause(filteredValue);
//                     // }}
//                     // value={cause}
//                     value={rowdata?.Category_name || ''}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Cause"
//                     placeholder="Cause"
//                     variant="outlined"
//                     // onChange={(e) => {
//                     // const value = e.target.value;
//                     // Only allow alphanumeric characters and spaces
//                     // const filteredValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
//                     // setcause(filteredValue);
//                     // }}
//                     value={rowdata?.Nature_problem || ''} />
//                 </Grid>
//                 {/* <Grid item xs={6}>
//                     <TextField
//                       fullWidth
//                       label="Cause"
//                       placeholder="Cause"
//                       variant="outlined"
//                       onChange={(e) => {
//                       const value = e.target.value;
//                       // Only allow alphanumeric characters and spaces
//                       const filteredValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
//                       setcause(filteredValue);
//                       }}
//                       value={cause}
//                     />
//                   </Grid> */}
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Correction"
//                     placeholder="Correction"
//                     variant="outlined"
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       // Only allow alphanumeric characters and spaces
//                       const filteredValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
//                       setCorrection(filteredValue);
//                     }}
//                     value={Correction}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Corrective Action"
//                     placeholder="Corrective Action"
//                     variant="outlined"
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       // Only allow alphanumeric characters and spaces
//                       const filteredValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
//                       setCorrAction(filteredValue);
//                     }}
//                     value={CorrAction}
//                   />
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography style={{ fontWeight: 'bold' }}>
//                     Damaged Parts
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Part Name"
//                     value={DmpartName}
//                     autoComplete="off"
//                     onChange={(e) => {
//                       setDmPartName(e.target.value)
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Quantity"
//                     value={DmQuantity}
//                     autoComplete="off"
//                     onChange={(e) => {
//                       setDMQuantity(e.target.value)
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} style={{ display: 'flex', justifyContent: "flex-end" }}>

//                   <Button
//                     onClick={AddDamagedParts}
//                     variant="contained"
//                     style={{ background: "#051622", color: "white" }}
//                   >
//                     {isAddButton ? 'Add' : 'Update'}
//                   </Button>
//                 </Grid>

//                 {
//                   damagedList.length > 0 && (
//                     <Grid container spacing={2} style={{ marginTop: "5px" }}>
//                       <Grid item xs={12}>
//                         <DataGrid
//                           rows={damagedList}
//                           columns={columns2}
//                           pageSize={5}
//                           sx={{
//                             height: 200,
//                             '& .MuiDataGrid-columnHeaders': {
//                               color: '#000000', // Header text color
//                               fontWeight: 'bold', // Header font weight
//                             },
//                             '& .MuiDataGrid-columnHeaderTitle': {
//                               fontWeight: 'bold', // Ensures the header font weight is bold
//                             },
//                           }}
//                           disableSelectionOnClick
//                         />
//                       </Grid>

//                     </Grid>)}

//                 <Grid item xs={12}>
//                   <Typography style={{ fontWeight: 'bold' }}>
//                     Replacement Parts
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Part Name"
//                     value={RepartName}
//                     autoComplete="off"
//                     onChange={(e) => {
//                       setREPartName(e.target.value)
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={6}>
//                   <TextField
//                     fullWidth
//                     label="Quantity"
//                     value={ReQuantity}
//                     autoComplete="off"
//                     onChange={(e) => {
//                       setREQuantity(e.target.value)
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} style={{ display: 'flex', justifyContent: "flex-end" }}>

//                   <Button
//                     onClick={AddReplacementParts}
//                     variant="contained"
//                     style={{ background: "#051622", color: "white" }}
//                   >
//                     {isAddButtonReplace ? 'Add' : 'Update'}
//                   </Button>
//                 </Grid>

//                 {
//                   replacedlist.length > 0 && (
//                     <Grid container spacing={2} style={{ marginTop: "5px" }}>
//                       <Grid item xs={12}>
//                         <DataGrid
//                           rows={replacedlist}
//                           columns={columns1}
//                           pageSize={5}
//                           sx={{
//                             height: 200,
//                             '& .MuiDataGrid-columnHeaders': {
//                               color: '#000000', // Header text color
//                               fontWeight: 'bold', // Header font weight
//                             },
//                             '& .MuiDataGrid-columnHeaderTitle': {
//                               fontWeight: 'bold', // Ensures the header font weight is bold
//                             },
//                           }}
//                           disableSelectionOnClick
//                         />
//                       </Grid>

//                     </Grid>
//                   )}

//                 <Grid item xs={12}>
//                   <FormControlLabel
//                     control={
//                       <Checkbox
//                         checked={checked}
//                         onChange={handleCheckboxChange}
//                         name="checkedA"
//                         color="primary"
//                       />
//                     }
//                     label="Mark as Completed"
//                   />
//                 </Grid>
//               </Grid>
//             </DialogContent>
//             <DialogActions>
//               <Button
//                 onClick={handelupdate}
//                 variant="contained"
//                 style={{ background: "#051622", color: "white" }}
//               >
//                 Submit
//               </Button>
//               <Button
//                 onClick={handleCloseUpdate}
//                 variant="contained"
//                 style={{ background: "#051622", color: "white" }}
//               >
//                 Cancel
//               </Button>
//             </DialogActions>
//           </Dialog>
//           <Button
//             onClick={handleClose}
//             variant="contained"
//             style={{ background: "#051622", color: "white" }}
//           >
//             Cancel
//           </Button>
//         </DialogActions>
//         {/* </form> */}
//         <Snackbar
//           open={notificationOpen}
//           autoHideDuration={6000}
//           onClose={handleCloseNotification}
//           message={notificationMessage}
//           severity={notificationSeverity}
//         />
//         <NotificationBar
//           handleClose={handleClose1}
//           notificationContent={openNotification.message}
//           openNotification={openNotification.status}
//           type={openNotification.type}
//         />
//         <DeleteConfirmationDailog
//           open={deleteDailogOpen}
//           setOpen={setDeleteDailogOpen}
//           deleteId={deleteId}
//           deleteService={RoleDelete}
//           handleSuccess={RoleDeleteSuccess}
//           handleException={RoleDeleteException}
//         />
//         <DeleteConfirmationDailog
//           open={deleteReplaceDailogOpen}
//           setOpen={setDeleteReplaceDailogOpen}
//           deleteId={ReplacedeleteId}
//           deleteService={ReplaceDelete}
//           handleSuccess={ReplaceDeleteSuccess}
//           handleException={ReplaceDeleteException}
//         />
//         <DeleteConfirmationDailog
//           open={deleteDamageDailogOpen}
//           setOpen={setDeleteDamageDailogOpen}
//           deleteId={damagedDeleteId}
//           deleteService={DamageDelete}
//           handleSuccess={DamageDeleteSuccess}
//           handleException={DamageDeleteException}
//         />
//       </Dialog>
//     </div>
//   );
// };


import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Box,
  Typography,
  Snackbar,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import {
  MaintanenceApprovRejList,
  MaintanenceDetailsList,
} from "../../ApiService/LoginPageService";

export const PendingView = ({
  open,
  setOpen,
  rowdata,
  ison,
  index,
  setRefresh,
}) => {
  console.log("rowdata", rowdata);
  const [showImages, setShowImages] = useState(false);
  const [damagedList, setDamagedList] = useState([]);
  const [replacedlist, setReplacedList] = useState([]);
  const [reason, setreason] = useState("");
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const [scheduleDetails, setScheduleDetails] = useState([]);
  const [scheduleImages, setScheduleImages] = useState([]);

  const [openReject, setOpenReject] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [checked, setChecked] = useState(false);
  const [Correction, setCorrection] = useState("");
  const [CorrAction, setCorrAction] = useState("");
  const [DmpartName, setDmPartName] = useState("");
  const [DmQuantity, setDMQuantity] = useState("");
  const [RepartName, setREPartName] = useState("");
  const [ReQuantity, setREQuantity] = useState("");
  const [isAddButton, setIsAddButton] = useState(true);
  const [isAddButtonReplace, setIsAddButtonReplace] = useState(true);
  const [id, setId] = useState("");
  const [replaceid, setReplaceId] = useState("");
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [deleteDamageDailogOpen, setDeleteDamageDailogOpen] = useState(false);
  const [deleteReplaceDailogOpen, setDeleteReplaceDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [ReplacedeleteId, setReplaceDeleteId] = useState("");
  const [damagedDeleteId, setDamagedDeleteId] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("success");

  // Use a ref to track if the component is still mounted — prevents state updates after unmount
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Cleanup all pending timeouts on unmount
  const timeoutRef = useRef(null);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCheckboxChange = useCallback((event) => {
    setChecked(event.target.checked);
  }, []);

  const handleClickOpenReject = useCallback(() => setOpenReject(true), []);
  const handleCloseReject = useCallback(() => setOpenReject(false), []);

  const handleClickOpenUpdate = useCallback(() => setOpenUpdate(true), []);
  const handleCloseUpdate = useCallback(() => {
    setOpenUpdate(false);
    setDmPartName("");
    setDMQuantity("");
    setREPartName("");
    setREQuantity("");
  }, []);

  const handleCloseNotification = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setNotificationOpen(false);
  }, []);

  const handleClose = useCallback(() => setOpen(false), [setOpen]);

  const handleClose1 = useCallback(
    () => setNotification((prev) => ({ ...prev, status: false })),
    []
  );

  const toggleImages = useCallback(() => setShowImages((prev) => !prev), []);

  // Fetch details only when dialog opens with valid data
  useEffect(() => {
    if (!open || !rowdata?.id) return;

    let cancelled = false;

    MaintanenceDetailsList(
      { scheduleId: rowdata.id },
      (res) => {
        if (!cancelled) {
          setScheduleDetails(res?.consumables || []);
          setScheduleImages(res?.images || []);
        }
      },
      (err) => {
        if (!cancelled) {
          console.error("Failed to fetch details:", err);
          setScheduleDetails([]);
          setScheduleImages([]);
        }
      }
    );

    // Reset view state when dialog closes/row changes
    return () => {
      cancelled = true;
    };
  }, [open, rowdata?.id]);

  // Reset image toggle when dialog closes
  useEffect(() => {
    if (!open) setShowImages(false);
  }, [open]);

  const handleAprove = useCallback(
    (value) => {
      const payload = {
        scheduleId: rowdata?.id ? String(rowdata.id) : "",
        status: value === 1 ? "approve" : "reject",
      };

      MaintanenceApprovRejList(
        payload,
        () => {
          if (!isMounted.current) return;
          setRefresh((prev) => !prev);
          setNotification({
            status: true,
            type: "success",
            message: value === 1 ? "Approved Success" : "Rejected Success",
          });
          timeoutRef.current = setTimeout(() => {
            if (isMounted.current) handleClose();
          }, 2000);
        },
        () => {
          if (!isMounted.current) return;
          setNotification({
            status: true,
            type: "error",
            message: "An error occurred.",
          });
        }
      );
    },
    [rowdata?.id, setRefresh, handleClose]
  );

  // Memoize action cell renderers to prevent DataGrid row re-renders
  const EditData = useCallback(
    (params) => (
      <Tooltip title="Edit">
        <EditIcon
          onClick={(e) => {
            e.stopPropagation();
            setIsAddButton(false);
            setId(params.selectedRow.id || "");
            setDmPartName(params.selectedRow.damagedPartName || "");
            setDMQuantity(params.selectedRow.quantity || "");
          }}
          style={{ cursor: "pointer", color: "#18143D" }}
        />
      </Tooltip>
    ),
    []
  );

  const DamageDeleteData = useCallback(
    (params) => (
      <Tooltip title="Delete Damage">
        <DeleteIcon
          onClick={(e) => {
            e.stopPropagation();
            setDeleteDamageDailogOpen(true);
            setDamagedDeleteId(params.selectedRow.id);
          }}
          style={{ cursor: "pointer", color: "#18143D" }}
        />
      </Tooltip>
    ),
    []
  );

  const EditDataReplace = useCallback(
    (params) => (
      <Tooltip title="Edit Replace">
        <EditIcon
          onClick={(e) => {
            e.stopPropagation();
            setIsAddButtonReplace(false);
            setReplaceId(params.selectedRow.id || "");
            setREPartName(params.selectedRow.replacementPartName || "");
            setREQuantity(params.selectedRow.quantity || "");
          }}
          style={{ cursor: "pointer", color: "#18143D" }}
        />
      </Tooltip>
    ),
    []
  );

  const ReplaceDeleteData = useCallback(
    (params) => (
      <Tooltip title="Delete Replace">
        <DeleteIcon
          onClick={(e) => {
            e.stopPropagation();
            setDeleteReplaceDailogOpen(true);
            setReplaceDeleteId(params.selectedRow.id);
          }}
          style={{ cursor: "pointer", color: "#18143D" }}
        />
      </Tooltip>
    ),
    []
  );

  // Memoize columns to prevent re-creation on every render
  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 60, align: "center", headerAlign: "center" },
      { field: "type", headerName: "Type", flex: 1, minWidth: 100 },
      { field: "name", headerName: "Part Name", flex: 1.5, minWidth: 150 },
      { field: "part", headerName: "Part No", flex: 1, minWidth: 100 },
      { field: "quantity", headerName: "Quantity", flex: 1, minWidth: 100, align: "center", headerAlign: "center" },
      { field: "unit", headerName: "Unit", flex: 1, minWidth: 100, align: "center", headerAlign: "center" },
      { field: "total_amount", headerName: "Total Amount", flex: 1, minWidth: 120, align: "center", headerAlign: "right" },
    ],
    []
  );

  const columns2 = useMemo(
    () => [
      { field: "id", headerName: "ID", minWidth: 100, flex: 1, align: "center", headerAlign: "center" },
      { field: "damagedPartName", headerName: "Damaged PartName", minWidth: 100, flex: 1, align: "center", headerAlign: "center" },
      { field: "quantity", headerName: "Quantity", minWidth: 100, flex: 1, align: "center", headerAlign: "center" },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        headerAlign: "center",
        flex: 1,
        align: "center",
        cellClassName: "actions",
        getActions: (params) => [
          <EditData selectedRow={params.row} />,
          <DamageDeleteData selectedRow={params.row} />,
        ],
      },
    ],
    [EditData, DamageDeleteData]
  );

  const columns1 = useMemo(
    () => [
      { field: "id", headerName: "ID", minWidth: 100, flex: 1, align: "center", headerAlign: "center" },
      { field: "replacementPartName", headerName: "Replacement Part Name", minWidth: 100, flex: 1, align: "center", headerAlign: "center" },
      { field: "quantity", headerName: "Quantity", minWidth: 100, flex: 1, align: "center", headerAlign: "center" },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        headerAlign: "center",
        flex: 1,
        align: "center",
        cellClassName: "actions",
        getActions: (params) => [
          <EditDataReplace selectedRow={params.row} />,
          <ReplaceDeleteData selectedRow={params.row} />,
        ],
      },
    ],
    [EditDataReplace, ReplaceDeleteData]
  );

  const dataGridSx = useMemo(
    () => ({
      border: "none",
      "& .MuiDataGrid-columnHeaders": {
        background: "#93bce6",
        borderBottom: "1px solid #E2E6EA",
        "& .MuiDataGrid-columnHeaderTitle": {
          fontWeight: 800,
          fontSize: "0.75rem",
          color: "#000000",
          textTransform: "uppercase",
        },
      },
      "& .MuiDataGrid-row:hover": { bgcolor: "rgba(15, 98, 254, 0.04)" },
      "& .MuiDataGrid-cell": { borderColor: "#E2E6EA", fontSize: "0.85rem", color: "#1A1A2E" },
    }),
    []
  );

  const alphanumericFilter = useCallback((setter) => (e) => {
    setter(e.target.value.replace(/[^a-zA-Z0-9\s]/g, ""));
  }, []);

  const DetailField = useCallback(
    ({ label, value }) => (
      <Box
        sx={{
          p: 1.5,
          borderRadius: "8px",
          border: "1px solid #E2E6EA",
          background: "#F9FAFB",
          height: "100%",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#1A1A2E" }}>
          {value || "—"}
        </Typography>
      </Box>
    ),
    []
  );

  const RoleDeleteSuccess = useCallback(() => {
    setDeleteDailogOpen(false);
  }, []);
  const RoleDeleteException = useCallback(() => { }, []);
  const ReplaceDeleteSuccess = useCallback(() => {
    setDeleteDamageDailogOpen(false);
  }, []);
  const ReplaceDeleteException = useCallback(() => { }, []);
  const DamageDeleteSuccess = useCallback(() => {
    setDeleteReplaceDailogOpen(false);
  }, []);
  const DamageDeleteException = useCallback(() => { }, []);

  // Stub deleters — wire these to real API calls when ready
  const RoleDelete = useCallback(() => { }, []);
  const ReplaceDelete = useCallback(() => { }, []);
  const DamageDelete = useCallback(() => { }, []);

  return (
    <div>
      <Dialog
        sx={{ "& .MuiDialog-paper": { borderRadius: "16px", boxShadow: "0 12px 40px rgba(0,0,0,0.12)" } }}
        maxWidth="md"
        fullWidth
        open={open}
        onClose={handleClose}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #E2E6EA",
            py: 2.5,
            px: 3,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1.2rem", color: "#1A1A2E" }}>
              Estimated Maintenance Details
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "#6B7280", mt: 0.3 }}>
              Review the schedule breakdown before approving or rejecting
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: "24px !important", background: "#FFFFFF", overflowY: "auto" }}>
          {/* Details Grid */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <DetailField label="Assigned Supervisor" value={rowdata?.supervisor} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DetailField label="Category" value={rowdata?.Category_name || rowdata?.problem_category} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DetailField label="Nature of Problem" value={rowdata?.Nature_problem || rowdata?.problem_nature} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DetailField label="Machine / Asset" value={rowdata?.assetName || rowdata?.machine} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DetailField label="Schedule Type" value={rowdata?.type1 || rowdata?.schedule_type} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <DetailField label="Manpower Mode" value={rowdata?.type2 || rowdata?.manpower_mode} />
            </Grid>
            <Grid item xs={12}>
              <DetailField label="Problem Note" value={rowdata?.ProblemNote || rowdata?.problem_note} />
            </Grid>
          </Grid>

          {/* Parts Grid */}
          <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: "#1A1A2E", mb: 1 }}>
            Estimated Parts / Consumables
          </Typography>
          <Box sx={{ border: "1px solid #E2E6EA", borderRadius: "12px", overflow: "hidden", mb: 4 }}>
            <DataGrid
              rows={scheduleDetails}
              columns={columns}
              autoHeight
              disableSelectionOnClick
              hideFooter
              sx={dataGridSx}
            />
          </Box>

          {/* Images */}
          <Box
            sx={{ display: "flex", alignItems: "center", mb: 2, cursor: "pointer", userSelect: "none" }}
            onClick={toggleImages}
          >
            <RemoveRedEyeIcon sx={{ mr: 1, fontSize: 18, color: "#0F62FE" }} />
            <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: "#0F62FE" }}>
              {showImages ? "Hide Breakdown Images" : "View Breakdown Images"}
            </Typography>
          </Box>

          {showImages && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {scheduleImages.length > 0 ? (
                scheduleImages.map((img, idx) => (
                  <Grid item xs={12} sm={3} key={idx}>
                    <Box
                      component="img"
                      src={`${process.env.REACT_APP_IMAGE_URL || ""}/${img.image_path}`}
                      alt={`Image ${idx + 1}`}
                      sx={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #E2E6EA",
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography sx={{ color: "#6B7280", fontStyle: "italic", ml: 1, fontSize: "0.85rem" }}>
                    No breakdown images found.
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}

          {/* Approve / Reject */}
          {!ison && (
            <Box sx={{ display: "flex", gap: 2, mt: 4, pt: 3, borderTop: "1px solid #E2E6EA" }}>
              <Button
                variant="contained"
                onClick={() => handleAprove(1)}
                sx={{
                  flex: 1,
                  height: "46px",
                  borderRadius: "8px",
                  bgcolor: "#24A148",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#1D8239", boxShadow: "none" },
                }}
              >
                Approve Schedule
              </Button>
              <Button
                variant="outlined"
                onClick={handleClickOpenReject}
                sx={{
                  flex: 1,
                  height: "46px",
                  borderRadius: "8px",
                  borderColor: "#DA1E28",
                  color: "#DA1E28",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  textTransform: "none",
                  "&:hover": { bgcolor: "rgba(218,30,40,0.06)", borderColor: "#DA1E28" },
                }}
              >
                Reject Schedule
              </Button>

              <Dialog
                open={openReject}
                onClose={handleCloseReject}
                sx={{ "& .MuiDialog-paper": { width: "400px", borderRadius: "12px", p: 1 } }}
              >
                <DialogTitle sx={{ fontWeight: 800, fontSize: "1.1rem", color: "#1A1A2E", pb: 1 }}>
                  Reason for Rejection
                </DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Please specify why this schedule is being rejected..."
                    value={reason}
                    onChange={(e) => setreason(e.target.value)}
                    sx={{
                      mt: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        "& fieldset": { borderColor: "#E2E6EA" },
                        "&.Mui-focused fieldset": { borderColor: "#DA1E28" },
                      },
                    }}
                  />
                </DialogContent>
                <DialogActions sx={{ pt: 0, pb: 2, px: 3, gap: 1 }}>
                  <Button onClick={handleCloseReject} sx={{ color: "#6B7280", fontWeight: 700, textTransform: "none" }}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => { handleAprove(2); handleCloseReject(); }}
                    variant="contained"
                    sx={{
                      bgcolor: "#DA1E28",
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: "6px",
                      boxShadow: "none",
                      textTransform: "none",
                      "&:hover": { bgcolor: "#B81921", boxShadow: "none" },
                    }}
                  >
                    Confirm Reject
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          )}
        </DialogContent>

        <DialogActions style={{ justifyContent: "flex-end" }}>
          {index === 0 && (
            <Button
              variant="contained"
              style={{ background: "#051622", color: "white" }}
              onClick={handleClickOpenUpdate}
            >
              Complete Maintenance
            </Button>
          )}

          <Dialog
            open={openUpdate}
            sx={{ "& .MuiDialog-paper": { width: "52%", maxHeight: "100%" } }}
            maxWidth="lg"
          >
            <DialogTitle style={{ background: "#051622", color: "white" }}>Update</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} style={{ marginTop: "10px" }}>
                <Grid item xs={6}>
                  <TextField fullWidth label="Problem Category" variant="outlined" value={rowdata?.Category_name || ""} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Cause" variant="outlined" value={rowdata?.Nature_problem || ""} />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Correction"
                    variant="outlined"
                    onChange={alphanumericFilter(setCorrection)}
                    value={Correction}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Corrective Action"
                    variant="outlined"
                    onChange={alphanumericFilter(setCorrAction)}
                    value={CorrAction}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography style={{ fontWeight: "bold" }}>Damaged Parts</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Part Name" value={DmpartName} autoComplete="off" onChange={(e) => setDmPartName(e.target.value)} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Quantity" value={DmQuantity} autoComplete="off" onChange={(e) => setDMQuantity(e.target.value)} />
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="contained" style={{ background: "#051622", color: "white" }}>
                    {isAddButton ? "Add" : "Update"}
                  </Button>
                </Grid>

                {damagedList.length > 0 && (
                  <Grid item xs={12}>
                    <DataGrid rows={damagedList} columns={columns2} pageSize={5} sx={{ height: 200 }} disableSelectionOnClick />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography style={{ fontWeight: "bold" }}>Replacement Parts</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Part Name" value={RepartName} autoComplete="off" onChange={(e) => setREPartName(e.target.value)} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Quantity" value={ReQuantity} autoComplete="off" onChange={(e) => setREQuantity(e.target.value)} />
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="contained" style={{ background: "#051622", color: "white" }}>
                    {isAddButtonReplace ? "Add" : "Update"}
                  </Button>
                </Grid>

                {replacedlist.length > 0 && (
                  <Grid item xs={12}>
                    <DataGrid rows={replacedlist} columns={columns1} pageSize={5} sx={{ height: 200 }} disableSelectionOnClick />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={checked} onChange={handleCheckboxChange} color="primary" />}
                    label="Mark as Completed"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" style={{ background: "#051622", color: "white" }}>Submit</Button>
              <Button onClick={handleCloseUpdate} variant="contained" style={{ background: "#051622", color: "white" }}>Cancel</Button>
            </DialogActions>
          </Dialog>

          <Button onClick={handleClose} variant="contained" style={{ background: "#051622", color: "white" }}>
            Cancel
          </Button>
        </DialogActions>

        <Snackbar
          open={notificationOpen}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          message={notificationMessage}
          severity={notificationSeverity}
        />
        <NotificationBar
          handleClose={handleClose1}
          notificationContent={openNotification.message}
          openNotification={openNotification.status}
          type={openNotification.type}
        />
        <DeleteConfirmationDailog
          open={deleteDailogOpen}
          setOpen={setDeleteDailogOpen}
          deleteId={deleteId}
          deleteService={RoleDelete}
          handleSuccess={RoleDeleteSuccess}
          handleException={RoleDeleteException}
        />
        <DeleteConfirmationDailog
          open={deleteReplaceDailogOpen}
          setOpen={setDeleteReplaceDailogOpen}
          deleteId={ReplacedeleteId}
          deleteService={ReplaceDelete}
          handleSuccess={ReplaceDeleteSuccess}
          handleException={ReplaceDeleteException}
        />
        <DeleteConfirmationDailog
          open={deleteDamageDailogOpen}
          setOpen={setDeleteDamageDailogOpen}
          deleteId={damagedDeleteId}
          deleteService={DamageDelete}
          handleSuccess={DamageDeleteSuccess}
          handleException={DamageDeleteException}
        />
      </Dialog>
    </div>
  );
};
