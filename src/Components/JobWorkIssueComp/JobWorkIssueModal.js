// import React, { useEffect, useState, useRef } from 'react';
// import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
// import { Card } from 'react-bootstrap';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import { DataGrid } from '@mui/x-data-grid';
// import { CheckBox } from '@mui/icons-material';
// import SearchIcon from "@mui/icons-material/Search";
// import Autocomplete from '@mui/material/Autocomplete';
// import ChangeAddressModal from './ChangeAddressModal/ChangeAddressModal';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import LoadPendingSfg from './LoadPendingSfg/LoadPendingSfg';
// import {
//     poApproval,
//     GetJobWorkIssueUniqueID,
//     GetJobWorkIssueSupplierItemList,
//     GenerateJobWorkIssueDC,
//     GetDelNoteDetails,
//     GetWithoutPoSuppList,
//     UpdateJobWorkIssueDC,
//     GetDelNoteForwardReverse,
//     GetJobWorkIssueDCCopy,
//     GetJobWorkIssueDCJson,
//     GetGeneratedJW,
//     GetRemarksLists,
//     GetWithoutPoItemLists,
//     GetJobWorkIssueItemLists,
//     ItemSearchNAAJ,
//     GetJobWorkIssueItemDetails,
//     JobWorkDelete,
// } from '../../ApiService/LoginPageService'
// import {
//     Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment, setRef,
//     Popper,
//     CircularProgress,
//     IconButton,
// } from '@mui/material';
// import FastForwardIcon from "@mui/icons-material/FastForward";
// import FastRewindIcon from "@mui/icons-material/FastRewind";
// import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
// import SkipNextIcon from "@mui/icons-material/SkipNext";
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import ApplicationStore from '../../Utility/localStorageUtil';
// import { PDFDocument } from 'pdf-lib';
// import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
// import RefreshIcon from "@mui/icons-material/Refresh";


// const JobWorkIssueModal = ({ editeData }) => {

//     const { userDetails } = ApplicationStore().getStorage('userDetails');
//     console.log("userDetailsuserDetails", userDetails)
//     const userPermission = userDetails?.groupRights?.filter(
//         (data) => data?.menu?.toLowerCase() === "viewjobworkissue"
//     );
//     console.log("PurchaseOrderEntryPurchaseOrderEntry", userPermission)

//     const [openNotification, setNotification] = useState({
//         status: false,
//         type: 'error',
//         message: '',
//     });
//     const navigate = useNavigate();
//     const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
//     const [selectedDate, setSelectedDate] = useState(new Date())
//     const [supplierList, setSupplierList] = useState([])
//     const [supplierName, setSupplierName] = useState('')
//     const [selectedItems, setSelectedItems] = useState([{ id: 'RDL1' }]);
//     const [suppAddress, setSuppAddress] = useState('');
//     const [currency, setCurrency] = useState('');
//     const [currencyId, setCurrencyId] = useState('');
//     const [department, setDepartment] = useState('');
//     const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
//     const [supplierSid, setSupplierSid] = useState('')
//     const [totalQuantity, setTotalQuantity] = useState('');
//     const [totalGrossAmount, setTotalGrossAmount] = useState('');
//     const [refreshKey, setRefreshKey] = useState(0);
//     const [DCNumber, setDCNumber] = useState('');
//     const [jobworkid, setjobWorkId] = useState('');
//     console.log("jobworkid", jobworkid)
//     const [sequentialNumber, setSequentialNumber] = useState('');
//     const [challanNo, setChallanNo] = useState('');
//     const [challanDate, setChallanDate] = useState('');
//     const [modeOfTransport, setModeOfTransport] = useState('');
//     const [vehicleNo, setVehicleNo] = useState('');
//     const [consigneeName, setConsigneeName] = useState('');
//     const [address1, setAddress1] = useState('');
//     const [address2, setAddress2] = useState('');
//     const [address3, setAddress3] = useState('');
//     const [address4, setAddress4] = useState('');
//     const [panNo, setPanNo] = useState('');
//     const [gstNo, setGSTNo] = useState('');
//     const [typeOfGoods, setTypeOfGoods] = useState('inputs');
//     const [docType, setDocType] = useState('CHL');
//     const [subSupplyType, setSubSupplyType] = useState('');
//     const [subSupplyDesc, setSubSupplyDesc] = useState('');
//     const [transactionType, setTransactionType] = useState('');
//     const [modeOfType, setModeOfType] = useState('');
//     const [docketNo, setDocketNo] = useState('');
//     const [transportDate, setTransportDate] = useState('');
//     const [transportMst, setTransportMst] = useState('');
//     const [transportGSTIN, setTransportGSTIN] = useState('');
//     const [distanceKMS, setDistanceKMS] = useState('');
//     const [shippingPinCode, setShippingPinCode] = useState('');
//     const [toStateCode, setToStateCode] = useState('');
//     const [actualToState, setActualToState] = useState('');
//     const [stockAffect, setStockAffect] = useState('');
//     const [ewayBillRequired, setEwayBillRequired] = useState('');
//     const [cgst, setCGST] = useState('');
//     const [cgstPercent, setCGSTPercent] = useState('');
//     const [sgst, setSGST] = useState('');
//     const [sgstPercent, setSGSTPercent] = useState('');
//     const [igst, setIGST] = useState('');
//     const [igstPercent, setIGSTPercent] = useState('');
//     const [totalValue, setTotalValue] = useState('');
//     const [remarks, setRemarks] = useState('');
//     const [suppId, setSuppId] = useState('');
//     const [loadPendingSfg, setLoadPendingSfg] = useState(false);
//     const [supplierSelect, setSupplierSelect] = useState('');
//     const location = useLocation();
//     const [isEditable, setIsEditable] = useState(false);
//     const [pdfModalOpen, setPdfModalOpen] = useState(false);
//     const [pdfUrl, setPdfUrl] = useState('');
//     const [preViewItemList, setPreviewItemLists] = useState([]);
//     const [viewMoreModal, setViewMoreModal] = useState(false);
//     const [generatedJwLists, setGeneratedJWLists] = useState([]);
//     const [remarksAllLists, setRemarksAllLists] = useState([]);
//     const [selectedType, setSelectedType] = useState('General');
//     const [supplierItemList, setSupplierItemList] = useState([]);
//     const [pdfBlobs, setPdfBlobs] = useState([]);
//     const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [items, setItems] = useState([]);

//     //JOB WORK ISSUE ROUTE HANDLER
//     const viewDC = new URLSearchParams(location.search).get('viewDC');
//     const delRowId = new URLSearchParams(location.search).get('delRowId');

//     // DC VIEW FROM RESULT PAGE
//     // const isView = new URLSearchParams(location.search).get('isView');
//     const jcRowId = new URLSearchParams(location.search).get('jcRowId');

//     // NEW ENTRY
//     const newEntry = new URLSearchParams(location.search).get('newEntry');

//     const [isView, setIsView] = useState(false);
//     const [isEdit, setIsEdit] = useState(false);
//     const [mainId, setMainId] = useState('');
//     const [selectedJwNo, setSelectedJwNo] = useState('');

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

//     useEffect(() => {
//         newEntry === 'true' && setIsEditable(true);
//         // !viewDC && GetJobWorkIssueUniqueID(handleUniqueCodeSuccess, handleUniqueCodeException);
//         // if (!viewDC || !isView) {
//         //     GetRemarks(handleUniqueCodeSuccess, handleUniqueCodeException);
//         // }
//         if (isView) {
//             setIsEditable(false)
//             GetDelNoteDetails({ id: jcRowId }, handleDelNoteDetailsSuccess, handleDelNoteDetailsException)
//         }

//         delRowId && GetDelNoteDetails({ id: delRowId }, handleDelNoteDetailsSuccess, handleDelNoteDetailsException);

//         handleForwardReverse('last', '');

//     }, [viewDC]);

//     //UNIQUE CODE API HANDLER
//     const handleUniqueCodeSuccess = (dataObject) => {
//         setDCNumber(dataObject?.data?.dcNo);
//         setSequentialNumber(dataObject?.data?.sequentialNumber);
//     }
//     const handleUniqueCodeException = (errorObject, errorMessage) => {
//         setNotification({
//             status: true,
//             type: 'error',
//             message: errorMessage,
//         });
//     }

//     //DEL_NOTE DETAILS API HANDLER
//     const handleDelNoteDetailsSuccess = (dataObject) => {
//         //SUPPLIER LIST
//         setSuppAddress(dataObject?.supplier?.spAddress || '');
//         setCurrency(dataObject?.supplier?.currency || '');
//         setCurrencyId(dataObject?.supplier?.currencyId || '');
//         setSupplierName(dataObject?.supplier?.spName || '');
//         setDepartment(dataObject?.supplier?.department || '');
//         setSupplierSid(dataObject?.supplier?.sId || '');
//         setSuppId(dataObject?.supplier?.id || '');
//         setGSTNo(dataObject?.supplier?.gstNo || '');
//         setPanNo(dataObject?.supplier?.panNo || '');
//         setSupplierSelect(dataObject?.supplier?.spName || '');
//         // Jobwork Details
//         setDCNumber(dataObject?.jobWork?.dcNo || '')
//         setjobWorkId(dataObject?.jobWork?.id || '')
//         setSequentialNumber(dataObject?.jobWork?.sequentialNumber || '')
//         setChallanNo(dataObject?.jobWork?.challanNo || '')
//         setChallanDate(dataObject?.jobWork?.challanDate || '')
//         setModeOfTransport(dataObject?.jobWork?.modeOfTransport || '')
//         setVehicleNo(dataObject?.jobWork?.vehicleNo || '')
//         setConsigneeName(dataObject?.jobWork?.consigneeName || '')
//         setTypeOfGoods(dataObject?.jobWork?.typeOfGoods || '')
//         // setDocType(dataObject?.jobWork?.docType || '')
//         setSubSupplyType(dataObject?.jobWork?.subSupplyType || '')
//         setSubSupplyDesc(dataObject?.jobWork?.subSupplyDesc || '')
//         setTransactionType(dataObject?.jobWork?.transactionType || '')
//         setModeOfType(dataObject?.jobWork?.modeOfType || '')
//         setDocketNo(dataObject?.jobWork?.docketNo || '')
//         setTransportDate(dataObject?.jobWork?.transportDate || '')
//         setTransportMst(dataObject?.jobWork?.transportMst || '')
//         setTransportGSTIN(dataObject?.jobWork?.transportGSTIN || '')
//         setDistanceKMS(dataObject?.jobWork?.distanceKMS || '')
//         setShippingPinCode(dataObject?.jobWork?.shippingPinCode || '')
//         setToStateCode(dataObject?.jobWork?.toStateCode || '')
//         setActualToState(dataObject?.jobWork?.actualToState || '')
//         setStockAffect(dataObject?.jobWork?.stockAffect || '')
//         setEwayBillRequired(dataObject?.jobWork?.ewayBillReq || '')
//         setTotalQuantity(dataObject?.jobWork?.totalQty || '')
//         setTotalGrossAmount(dataObject?.jobWork?.totalGrossAmt || '')
//         setCGSTPercent(dataObject?.jobWork?.cgstPercent || '')
//         setCGST(dataObject?.jobWork?.cgst || '')
//         setSGSTPercent(dataObject?.jobWork?.sgstPercent || '')
//         setSGST(dataObject?.jobWork?.sgst || '')
//         setIGSTPercent(dataObject?.jobWork?.igstPercent || '')
//         setIGST(dataObject?.jobWork?.igst || '')
//         setTotalValue(dataObject?.jobWork?.totalValue || '')
//         setRemarks(dataObject?.jobWork?.remarks || '')
//         setSelectedDate(dataObject?.jobWork?.created_at || '')
//         //ITEMLIST
//         setVehicleNo(dataObject?.itemsList[0]?.vehicleNo || '')
//         setSelectedItems(dataObject.itemsList || []);
//     }

//     const handleDelNoteDetailsException = () => { }

//     const ClearData = () => {
//         setSupplierSid('');
//         setChallanNo('');
//         setChallanDate('');
//         setModeOfTransport('');
//         setVehicleNo('');
//         setConsigneeName('');
//         setSuppAddress('');
//         setPanNo('');
//         setGSTNo('');
//         setTypeOfGoods('inputs');
//         // setDocType('');
//         setSubSupplyType('');
//         setSubSupplyDesc('');
//         setTransactionType('');
//         setModeOfType('');
//         setDocketNo('');
//         setTransportDate('');
//         setTransportMst('');
//         setTransportGSTIN('');
//         setDistanceKMS('');
//         setShippingPinCode('');
//         setToStateCode('');
//         setActualToState('');
//         setStockAffect('');
//         setEwayBillRequired('');
//         setTotalQuantity('');
//         setTotalGrossAmount('');
//         setCGSTPercent('');
//         setCGST('');
//         setSGSTPercent('');
//         setSGST('');
//         setIGSTPercent('');
//         setIGST('');
//         setTotalValue('');
//         setRemarks('');
//         setSelectedItems([{ id: 'RDL1' }]);
//         setSelectedType('General');
//         setMainId('');

//         // setTimeout(() => {
//         GetJobWorkIssueUniqueID(handleUniqueCodeSuccess, handleUniqueCodeException);
//         // }, 2000);
//     }

//     const handleSubmit = (e) => {
//         // selectedItems
//         const filteredItems = selectedItems.filter(item => item.id !== 'RDL1');
//         console.log("qqqqqqqqqqqqqqqqqqq")
//         e.preventDefault();
//         const commonData = {
//             ...(isEditable && { id: jcRowId }),
//             dcNo: DCNumber,
//             id: mainId,
//             sequentialNumber: sequentialNumber,
//             delScheduleId: delRowId,
//             supplierId: supplierSid,
//             suppAddress: suppAddress,
//             challanNo: challanNo,
//             challanDate: challanDate,
//             modeOfTransport: modeOfTransport,
//             vehicleNo: vehicleNo,
//             consigneeName: consigneeName,
//             address: address1,
//             panNo: panNo,
//             gstNo: gstNo,
//             typeOfGoods: typeOfGoods,
//             docType: docType,
//             subSupplyType: subSupplyType,
//             subSupplyDesc: subSupplyDesc,
//             transactionType: transactionType,
//             modeOfType: modeOfType,
//             docketNo: docketNo,
//             transportDate: transportDate,
//             transportMst: transportMst,
//             transportGSTIN: transportGSTIN,
//             distanceKMS: distanceKMS,
//             shippingPinCode: shippingPinCode,
//             toStateCode: toStateCode,
//             actualToState: actualToState,
//             stockAffect: stockAffect,
//             ewayBillReq: ewayBillRequired,
//             totalQty: totalQuantity,
//             totalGrossAmt: totalGrossAmount,
//             cgstPercent: cgstPercent,
//             cgst: cgst,
//             sgstPercent: sgstPercent,
//             sgst: sgst,
//             igstPercent: igstPercent,
//             igst: igst,
//             totalValue: totalValue,
//             remarks: remarks,
//             dcType: selectedType
//         }
//         if (isEdit) {
//             console.log("eeeeeeeeeeeeeeeeeeeeeeeee")
//             // if (modeOfTransport && vehicleNo && consigneeName && typeOfGoods && docType && subSupplyType && transactionType && modeOfType && docketNo && transportDate && transportMst && transportGSTIN && distanceKMS && shippingPinCode && toStateCode && actualToState && stockAffect && ewayBillRequired) {
//             //     if (subSupplyType === '8' || subSupplyType === '5') {
//             //         console.log("lllllllllllllllllllllllllllll")
//             //         if (subSupplyDesc === '') {
//             //             setNotification({
//             //                 status: true,
//             //                 type: 'error',
//             //                 message: 'Please Enter Sub Supply Desc',
//             //             });
//             //         }
//             //     } else if (actualToState !== '29' || (actualToState === '29' && Number(totalValue) > 50000)) {
//             //         if (ewayBillRequired === 'N') {
//             //             setNotification({
//             //                 status: true,
//             //                 type: 'error',
//             //                 message: 'E-way Bill Is Mandetory',
//             //             });
//             //         }
//             //     } else {
//             //         UpdateJobWorkIssueDC({ itemsList: selectedItems, jobWork: commonData }, handleSuccess, handleException);
//             //     }
//             // } else {
//             //     setNotification({
//             //         status: true,
//             //         type: 'error',
//             //         message: 'Please fill the required fields',
//             //     });
//             // }
//             if (!modeOfTransport || !vehicleNo || !typeOfGoods ||/* !docType ||*/
//                 !transactionType || !remarks  /*!docketNo || */ /* !transportMst ||*/
//             ) {

//                 console.log("Missing required fields!");
//                 setNotification({
//                     status: true,
//                     type: 'error',
//                     message: 'Please fill the required fields',
//                 });
//                 return;
//             }

//             console.log("All required fields are present.");

//             // Check subSupplyType condition
//             if (subSupplyType === '8' || subSupplyType === '5') {
//                 console.log("Checking subSupplyType condition...");
//                 if (!subSupplyDesc || subSupplyDesc.trim() === '') {
//                     console.log("Missing subSupplyDesc");
//                     setNotification({
//                         status: true,
//                         type: 'error',
//                         message: 'Please Enter Sub Supply Desc',
//                     });
//                     return;
//                 }
//             }

//             // Check E-way bill condition
//             if (actualToState !== '29' || (actualToState === '29' && Number(totalValue) > 50000)) {
//                 console.log("Checking actualToState and totalValue condition...");
//                 if (ewayBillRequired === 'N') {
//                     console.log("E-way bill required but not provided.");
//                     setNotification({
//                         status: true,
//                         type: 'error',
//                         message: 'E-way Bill Is Mandatory',
//                     });
//                     return;
//                 }
//             }

//             // If all conditions are met, call the API
//             console.log("Calling API: UpdateJobWorkIssueDC...");
//             try {
//                 setLoading(true);
//                 UpdateJobWorkIssueDC(
//                     { itemsList: filteredItems, jobWork: commonData },
//                     handleSuccess,
//                     handleException
//                 );
//             } catch (error) {
//                 console.error("API call failed:", error);
//                 setNotification({
//                     status: true,
//                     type: 'error',
//                     message: 'Failed to update job work issue DC.',
//                 });
//             }
//         } else {
//             console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
//             // if (modeOfTransport && vehicleNo && consigneeName && typeOfGoods && docType && subSupplyType && transactionType && modeOfType && docketNo && transportDate && transportMst && transportGSTIN && distanceKMS && shippingPinCode && toStateCode && actualToState && stockAffect && ewayBillRequired) {
//             //     console.log("ppppppppppppppppppppppppppppppppppp")
//             //     if (subSupplyType === '8' || subSupplyType === '5') {
//             //         console.log("mmmmmmmmmmmmmmmmmmmmmmmmm")
//             //         if (subSupplyDesc === '') {
//             //             console.log("ggggggggggggg")
//             //             setNotification({
//             //                 status: true,
//             //                 type: 'error',
//             //                 message: 'Please Enter Sub Supply Desc',
//             //             });
//             //         }
//             //     } else if (actualToState !== '29' || (actualToState === '29' && Number(totalValue) > 50000)) {
//             //         console.log("ooooooooooooooooooooooo")
//             //         if (ewayBillRequired === 'N') {
//             //             console.log("ddddddddddddddddd")
//             //             setNotification({
//             //                 status: true,
//             //                 type: 'error',
//             //                 message: 'E-way Bill Is Mandetory',
//             //             });
//             //         }
//             //     } else {
//             //         console.log("xxxxxxxxxxxxxxx")
//             //         GenerateJobWorkIssueDC({ itemsList: selectedItems, jobWork: commonData }, handleSuccess, handleException);
//             //     }
//             // } else {
//             //     console.log("aaaaaaaaaaaaaaaaa")
//             //     setNotification({
//             //         status: true,
//             //         type: 'error',
//             //         message: 'Please fill the required fields',
//             //     });
//             // }
//             if (!modeOfTransport || !vehicleNo || !typeOfGoods ||/* !docType ||*/
//                 !transactionType || !remarks  /*!docketNo || */ /* !transportMst ||*/
//             ) {

//                 console.log("Missing required fields!");
//                 setNotification({
//                     status: true,
//                     type: 'error',
//                     message: 'Please fill the required fields',
//                 });
//                 return;
//             }

//             console.log("All required fields are present.");

//             // Check subSupplyType condition
//             if (subSupplyType === '8' || subSupplyType === '5') {
//                 console.log("Checking subSupplyType condition...");
//                 if (!subSupplyDesc || subSupplyDesc.trim() === '') {
//                     console.log("Missing subSupplyDesc");
//                     setNotification({
//                         status: true,
//                         type: 'error',
//                         message: 'Please Enter Sub Supply Desc',
//                     });
//                     return;
//                 }
//             }

//             // Check E-way bill condition
//             if (actualToState !== '29' || (actualToState === '29' && Number(totalValue) > 50000)) {
//                 console.log("Checking actualToState and totalValue condition...");
//                 if (ewayBillRequired === 'N') {
//                     console.log("E-way bill required but not provided.");
//                     setNotification({
//                         status: true,
//                         type: 'error',
//                         message: 'E-way Bill Is Mandatory',
//                     });
//                     return;
//                 }
//             }

//             // If all conditions are met, call the API
//             console.log("Calling API: GenerateJobWorkIssueDC...");
//             try {
//                 setLoading(true);
//                 GenerateJobWorkIssueDC(
//                     { itemsList: filteredItems, jobWork: commonData },
//                     handleSuccess,
//                     handleException
//                 );
//             } catch (error) {
//                 console.error("API call failed:", error);
//                 setNotification({
//                     status: true,
//                     type: 'error',
//                     message: 'Failed to generate job work issue DC.',
//                 });
//             }
//         }
//     };

//     const handleSuccess = (dataObject) => {
//         console.log("the dataObject ", dataObject);
//         setNotification({
//             status: true,
//             type: 'success',
//             message: dataObject.message,
//         });
//         setTimeout(() => {
//             ClearData();
//             handleClose();
//             setLoading(false);
//         }, 2000);
//     };

//     const handleException = (errorObject, errorMessage) => {
//         console.log("the error ", errorMessage);
//         setNotification({
//             status: true,
//             type: 'error',
//             message: errorMessage,
//         });
//         setTimeout(() => {
//             // handleClose();
//             setLoading(false);
//         }, 2000);
//     };

//     const handleClose = () => {
//         setNotification({
//             status: false,
//             type: '',
//             message: '',
//         });
//     };

//     //MIDDLE GRID
//     const middleGridColumns = [
//         {
//             field: 'itemCode',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'itemName',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Name</span>,
//             type: 'number',
//             sortable: true,
//             sortable: false,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'uom',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'qoh',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>QOH</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'hsn',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>HSNCODE</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'jwQty',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Qty</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//             editable: false
//         },
//         {
//             field: 'suppDesc',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier Desc</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'rate',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rate</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'location',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Location</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//             editable: true
//         },
//         {
//             field: 'lot',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>LOT</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 180,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//             editable: false,
//         },
//         {
//             field: 'amount',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Amt</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'remarks',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remark</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'grnNo',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>GRN INFO</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'actions',
//             type: 'actions',
//             flex: 1,
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
//             cellClassName: 'actions',
//             disableClickEventBubbling: true,
//             getActions: (params) => [
//                 <DeleteData selectedRow={params.row} />,
//             ],
//         }, ,
//     ];

//     const handleDeleteRow = (id) => {
//         const newArray = selectedItems.filter((item) => item.id != id)
//         setSelectedItems(newArray);
//         // TO MINUS THE AMOUNT IN TOTAL_GRID
//         calculateTotals(newArray)
//     }

//     function DeleteData(props) {
//         return (
//             viewDC ?
//                 <DeleteIcon
//                     style={{ color: '#dddddd' }}
//                 />
//                 :
//                 <DeleteIcon
//                     onClick={() => {
//                         handleDeleteRow(props.selectedRow.id)
//                     }}
//                     style={{ color: 'black' }}
//                 />
//         );
//     };

//     //DATE CONVERT TO TEXTFIELD
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         const year = date.getFullYear();
//         const month = (date.getMonth() + 1).toString().padStart(2, '0');
//         const day = date.getDate().toString().padStart(2, '0');
//         return `${year}-${month}-${day}`;
//     };

//     //TOTAL CALCULATION
//     const calculateTotals = (data) => {
//         const totalQty = data.reduce((acc, item) => acc + (Number(item.jwQty) || 0), 0);
//         console.log("totalQty", totalQty);
//         setTotalQuantity(totalQty);
//         const amt = data.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
//         console.log("amt", amt);
//         setTotalGrossAmount(amt);
//         return [
//             { id: 1, totalQty, amt }
//         ];
//     };

//     useEffect(() => {
//         calculateTotals(selectedItems)
//     }, [selectedItems])

//     // GST CALCULATTION
//     useEffect(() => {
//         var cgstAmount = (totalGrossAmount * cgstPercent) / 100;
//         setCGST(cgstAmount);
//         var sgstAmount = (totalGrossAmount * sgstPercent) / 100;
//         setSGST(sgstAmount)
//         var igstAmount = (totalGrossAmount * igstPercent) / 100;
//         setIGST(igstAmount)
//         let totalAmount = Number(totalGrossAmount) + Number(cgst) + Number(sgst) + Number(igst);
//         setTotalValue(Math.round(totalAmount));
//     }, [cgstPercent, sgstPercent, igstPercent, cgst, sgst, igst, totalValue, totalGrossAmount]);

//     const remarksLists = [
//         'APPROXIMATE WEIGHT & VALUE FOR WEIGHING AND RETURN WITHOUT E-WAY BILL LESS THAN 20KM',
//         'FOR SIMULATION AND RETURN',
//         'FOR STORAGE ONLY',
//         'FOR ACID PICKLING AND RETURN',
//         'FOR ANODIZING AND RETURN',
//         'FOR ASSEMBLY TRAINING AND RETURN',
//         'FOR BALANCEING AND RETURN',
//         'FOR POWDER COATING AND RETURN',
//         'FOR PRESSING AND RETURN',
//         'FOR PRODUCTION PROCESS AND RETURN',
//         'FOR PUNCHING AND RETURN',
//         'FOR PUNCHING,BENDING AND RETURN',
//         'FOR PUNCHING,BENDING,PROCESS AND RETURN',
//     ]

//     //GET SUPPLIER LIST
//     const handleChange = (e) => {
//         GetWithoutPoSuppList({ code: e.target.value }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
//     }

//     const handleItemVsProcessItemSucessShow = (dataObject) => {
//         setSupplierList(dataObject?.data || []);
//     }
//     const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
//     }

//     const handleSupplierSearchItemChange = (value) => {
//         if (value !== null) {
//             setSuppAddress(value?.spAddress || '');
//             setAddress1(value?.spAddress || '');
//             setSupplierSid(value?.id || '');
//             setGSTNo(value?.gstNo || '');
//             setPanNo(value?.panNo || '');
//             setSupplierSelect(value?.label);
//             setConsigneeName(value?.label);
//             setDistanceKMS(value?.distance || '');
//             setShippingPinCode(value?.shippingPinCode || '');
//             setToStateCode(value?.toStateCode || '');
//             setActualToState(value?.actToState || '');
//         }
//     };

//     // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\NEW CODE//////////////////////////////////////////////////
//     // HANDLE FORWARD REVERSE HANDLER
//     const handleForwardReverse = (type, id) => {
//         GetDelNoteForwardReverse({ type: type, id: id }, handleActionSuccess, handleActionException)
//     }

//     const handleActionSuccess = (dataObject) => {
//         setIsView(true);
//         //SUPPLIER LIST
//         setSuppAddress(dataObject?.supplier?.spAddress || '');
//         setCurrency(dataObject?.supplier?.currency || '');
//         setCurrencyId(dataObject?.supplier?.currencyId || '');
//         setSupplierName(dataObject?.supplier?.spName || '');
//         setDepartment(dataObject?.supplier?.department || '');
//         setSupplierSid(dataObject?.supplier?.sId || '');
//         setSuppId(dataObject?.supplier?.id || '');
//         setGSTNo(dataObject?.supplier?.gstNo || '');
//         setPanNo(dataObject?.supplier?.panNo || '');
//         setSupplierSelect(dataObject?.supplier?.spName || '');
//         // Jobwork Details
//         setMainId(dataObject?.jobWork?.id || '');
//         setDCNumber(dataObject?.jobWork?.dcNo || '')
//         setSequentialNumber(dataObject?.jobWork?.sequentialNumber || '')
//         setChallanNo(dataObject?.jobWork?.challanNo || '')
//         setChallanDate(dataObject?.jobWork?.challanDate || '')
//         setModeOfTransport(dataObject?.jobWork?.modeOfTransport || '')
//         setVehicleNo(dataObject?.jobWork?.vehicleNo || '')
//         setConsigneeName(dataObject?.jobWork?.consigneeName || '')
//         setSelectedType(dataObject?.jobWork?.dcType || '')
//         setTypeOfGoods(dataObject?.jobWork?.typeOfGoods || '')
//         // setDocType(dataObject?.jobWork?.docType || '')
//         setSubSupplyType(dataObject?.jobWork?.subSupplyType || '')
//         setSubSupplyDesc(dataObject?.jobWork?.subSupplyDesc || '')
//         setTransactionType(dataObject?.jobWork?.transactionType || '')
//         setModeOfType(dataObject?.jobWork?.modeOfType || '')
//         setDocketNo(dataObject?.jobWork?.docketNo || '')
//         setTransportDate(dataObject?.jobWork?.transportDate || '')
//         setTransportMst(dataObject?.jobWork?.transportMst || '')
//         setTransportGSTIN(dataObject?.jobWork?.transportGSTIN || '')
//         setDistanceKMS(dataObject?.jobWork?.distanceKMS || '')
//         setShippingPinCode(dataObject?.jobWork?.shippingPinCode || '')
//         setToStateCode(dataObject?.jobWork?.toStateCode || '')
//         setActualToState(dataObject?.jobWork?.actualToState || '')
//         setStockAffect(dataObject?.jobWork?.stockAffect || '')
//         setEwayBillRequired(dataObject?.jobWork?.ewayBillReq || '')
//         setTotalQuantity(dataObject?.jobWork?.totalQty || '')
//         setTotalGrossAmount(dataObject?.jobWork?.totalGrossAmt || '')
//         setCGSTPercent(dataObject?.jobWork?.cgstPercent || '')
//         setCGST(dataObject?.jobWork?.cgst || '')
//         setSGSTPercent(dataObject?.jobWork?.sgstPercent || '')
//         setSGST(dataObject?.jobWork?.sgst || '')
//         setIGSTPercent(dataObject?.jobWork?.igstPercent || '')
//         setIGST(dataObject?.jobWork?.igst || '')
//         setTotalValue(dataObject?.jobWork?.totalValue || '')
//         setRemarks(dataObject?.jobWork?.remarks || '')
//         setSelectedDate(dataObject?.jobWork?.created_at || '')
//         setAddress1(dataObject?.jobWork?.address || '')
//         //ITEMLIST
//         setVehicleNo(dataObject?.itemsList[0]?.vehicleNo || '')
//         setSelectedItems(dataObject.itemsList || []);
//         setPreviewItemLists(dataObject.itemsList || []);
//     }
//     const handleActionException = () => { }

//     const handleClearPage = () => {
//         setIsView(false);
//         setIsEdit(false);
//         setSelectedDate(new Date());
//         setGeneratedJWLists([]);
//         setSelectedJwNo('')
//         setSupplierSid('');
//         setSupplierSelect('');
//         setChallanNo('');
//         setChallanDate('');
//         setModeOfTransport('');
//         setVehicleNo('');
//         setConsigneeName('');
//         setSuppAddress('');
//         setPanNo('');
//         setGSTNo('');
//         setTypeOfGoods('inputs');
//         // setDocType('');
//         setSubSupplyType('');
//         setSubSupplyDesc('');
//         setTransactionType('');
//         setModeOfType('');
//         setDocketNo('');
//         setTransportDate('');
//         setTransportMst('');
//         setTransportGSTIN('');
//         setDistanceKMS('');
//         setShippingPinCode('');
//         setToStateCode('');
//         setActualToState('');
//         setStockAffect('');
//         setEwayBillRequired('');
//         setTotalQuantity('');
//         setTotalGrossAmount('');
//         setCGSTPercent('');
//         setCGST('');
//         setSGSTPercent('');
//         setSGST('');
//         setIGSTPercent('');
//         setIGST('');
//         setTotalValue('');
//         setRemarks('');
//         setSelectedItems([{ id: 'RDL1' }]);
//         setSelectedType('General');
//         setMainId('')
//         setAddress1('');

//         // setTimeout(() => {
//         GetJobWorkIssueUniqueID(handleUniqueCodeSuccess, handleUniqueCodeException);
//         // }, 2000);
//     }

//     // INVOICE
//     const getInvoiceData = (jobWorkId) => {
//         GetJobWorkIssueDCCopy({ id: jobWorkId }, getInvoiceDataSuccess, getInvoiceDataExceptoin)
//     }

//     const invoiceHeader = [
//         'ORIGINAL FOR CONSIGNEE',
//         'DUPLICATE FOR TRANSPORTER',
//         'TRIPLICATE FOR CONSIGNOR',
//         'EXTRA COPY'
//     ];

//     const getInvoiceDataSuccess = (dataObject) => {
//         const allBlobs = [];
//         for (const headerName of invoiceHeader) {
//             const blob = handleFileSave(dataObject, headerName);
//             allBlobs.push(blob);
//         }
//         setPdfBlobs(allBlobs);
//     }

//     const getInvoiceDataExceptoin = (errorObject, errorMessage) => {
//         console.log("error Msg", errorMessage);
//     }

//     // function emptyRowsToPush(lineItems) {
//     //     const pageSize = 39, header = 17, footer = 8;
//     //     const content = header + lineItems + footer;
//     //     const totPage = Math.floor(content / pageSize) + 1;
//     //     const totalContentSize = pageSize * totPage;
//     //     const rowToPush = totalContentSize - content
//     //     return rowToPush;
//     // }
//     function emptyRowsToPush(lineItems) {
//         const pageSize = 39;   // max rows per page (depends on your layout)
//         const header = 10;     // rows occupied by header
//         const footer = 19;     // rows reserved for footer

//         // Content rows = header + actual line items + footer
//         const content = header + lineItems + footer;

//         // Total pages needed
//         const totPage = Math.floor(content / pageSize) + 1;

//         // Capacity of all pages
//         const totalContentSize = pageSize * totPage;

//         // Rows we need to pad
//         let rowToPush = totalContentSize - content;

//         // 🔧 Always keep at least 4 dummy rows
//         if (rowToPush < 4) {
//             rowToPush = 4;
//         }

//         return rowToPush;
//     }

//     const handleFileSave = (item, headerName) => {
//         let info = [];
//         item.itemsList.forEach((element, index, array) => {
//             info.push([element.sNo, element.itemCode, element.itemName, element.hsnName, element.uomName, element.Qty, element.rate, element.amount])
//         });

//         // Ensure a minimum of 10 items
//         // const minItems = 16;
//         // const placeholderItem = [''];
//         // while (info.length < minItems) {
//         //     info.push([...placeholderItem]);
//         // }
//         const paddingNeeded = emptyRowsToPush(info.length)
//         for (let i = 0; i < paddingNeeded; i++) {
//             const emptyRow = ["", "", "", "", "", "", "", ""];
//             emptyRow.isInfoRow = true; // Keep the same flag if you want same styling
//             info.push(emptyRow);
//         }

//         const doc = new jsPDF();

//         const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
//         console.log("baseUrl------------------>>>>>>>>>>>>>>", baseUrl);
//         // const logoUrl = (await import('../../AllImage/RDL_Logo.png')).default;
//         const logoUrl = `${baseUrl}/${item.jobWork.companyImage}`
//         const ISOUrl = require('../../AllImage/Picture.png');

//         // PAGE NUMBER
//         const totalPagesExp = "{totalPages}"; // <-- Add this
//         const tableOptions = {
//             didDrawPage: (HookData) => {
//                 // Check if it's the first page
//                 if (HookData.pageNumber === 1) {
//                     // Add an image on the first page
//                     // doc.addImage(logoUrl, 'PNG', 15, 10, 28, 20);
//                     // doc.addImage(ISOUrl, 'PNG', 160, 10, 35, 20);
//                     doc.addImage(logoUrl, 'PNG', 22, 18, 28, 15);
//                     doc.addImage(ISOUrl, 'PNG', 160, 15, 35, 20);
//                 } else {
//                     // From second page onward, show header
//                     doc.setFontSize(10);
//                     doc.setTextColor('blue');
//                     doc.setFont("times", "bold");
//                     doc.text(`Dc No : ${item.jobWork.dcNo}     |     Date : ${item.jobWork.created_at}`, 14, 5); // Adjust Y pos as needed
//                     doc.setDrawColor(0);
//                     // doc.line(14, 10, 196, 10); // Line under the header (optional)
//                 }

//                 // PAGE NUMBER 
//                 const pageSize = doc.internal.pageSize;
//                 const pageWidth = pageSize.width || pageSize.getWidth();
//                 const pageHeight = pageSize.height || pageSize.getHeight();

//                 doc.setFontSize(8);
//                 doc.setTextColor(70);
//                 // Left-aligned footer text
//                 doc.text(
//                     `FORMAT NO:IMS-ME-PUR-F-203-Rev-3 Dated 11-01-2019`,
//                     14, // X position (left margin)
//                     pageHeight - 10
//                 );

//                 // Right-aligned page number
//                 doc.text(
//                     `Page ${HookData.pageNumber} of ${totalPagesExp}`,
//                     pageWidth - 14, // X position (right margin)
//                     pageHeight - 10,
//                     { align: 'right' } // Align text to the right
//                 );
//             },
//         };
//         doc.setFontSize(8);
//         doc.setTextColor('black');
//         doc.text(headerName, 200, 6, { align: 'right' }); // Adjust X and Y coordinates as needed

//         // const logoAndAddress = [
//         //     [
//         //         {
//         //             content: headerName,
//         //             colSpan: 8,
//         //             styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0 }
//         //         }
//         //     ],

//         //     [
//         //         {
//         //             content: `\n\n\n\n\n\nRDL Technologies Pvt Ltd.\nPlot No. 126, Road No 3, KIADB Industrial Estate\nII Phase, Jigani Industrial Area, Jigani,Anekal Taluk,\nBengaluru - 560 105. Tel:080-27825249\nWeb Site :www.mallikengineering.com\nEmail : info@mallikengineering.com`,
//         //             colSpan: 3,
//         //             styles: {
//         //                 halign: 'left', fontSize: 8, textColor: 'black',
//         //                 lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
//         //                 lineColor: { top: [0, 0, 0] },
//         //             }
//         //         },

//         //         {
//         //             content: '', // This is the middle space for vertical line
//         //             colSpan: 1,
//         //             styles: {
//         //                 lineWidth: { top: 0.2, right: 0, bottom: 0, left: 0.2 }, // ← this adds the vertical line on both sides
//         //                 lineColor: {
//         //                     top: [0, 0, 0],
//         //                     left: [0, 0, 0],
//         //                     right: [0, 0, 0]
//         //                 }
//         //             }
//         //         },
//         //         {
//         //             content: `\n\n\n\n\n\n\n\n\nCIN No: U28112KA2013PTC068181\nPAN No: AAICM4744Q\nGSTINO: 29AAICM4744Q1ZM`,
//         //             colSpan: 4,
//         //             styles: {
//         //                 halign: 'right', fontSize: 8, textColor: 'black', /*valign: 'top',*/
//         //                 lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0 },
//         //                 lineColor: { top: [0, 0, 0] },
//         //             }
//         //         }
//         //     ]
//         // ];
//         const logoAndAddress = [
//             [
//                 {
//                     content: '',
//                     colSpan: 2,
//                     styles: {
//                         halign: 'left', fontSize: 8, textColor: 'black',
//                         lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
//                         lineColor: { top: [0, 0, 0] },
//                     }
//                 },
//                 {
//                     content: `${item.jobWork.companyName}\n${item.jobWork.companyAdd}. Tel:${item.jobWork.telNo}\nWeb Site :${item.jobWork.website}\nEmail : ${item.jobWork.email}`,
//                     colSpan: 6,
//                     styles: {
//                         halign: 'left', fontSize: 8, textColor: 'black',
//                         lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
//                         lineColor: { top: [0, 0, 0] },
//                     }
//                 },
//             ],
//             [
//                 {
//                     content: `CIN No: ${item.jobWork.cmpCinNo}`,
//                     colSpan: 2,
//                     styles: {
//                         fontSize: 8, textColor: 'black', /*valign: 'top',*/
//                         lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
//                         lineColor: { top: [0, 0, 0] },
//                     }
//                 },
//                 {
//                     content: `GSTINO: ${item.jobWork.cmpGstNo}`,
//                     colSpan: 1,
//                     styles: {
//                         fontSize: 8, textColor: 'black', /*valign: 'top',*/
//                         lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
//                         lineColor: { top: [0, 0, 0] },
//                     }
//                 },
//                 {
//                     content: `PAN No: ${item.jobWork.cmpPanNo}`,
//                     colSpan: 3,
//                     styles: {
//                         fontSize: 8, textColor: 'black', /*valign: 'top',*/
//                         lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
//                         lineColor: { top: [0, 0, 0] },
//                     }
//                 },

//                 {
//                     content: `No: ${item.jobWork.dcNo}`,
//                     colSpan: 2,
//                     styles: {
//                         fontSize: 8, textColor: 'black', /*valign: 'top',*/
//                         lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
//                         lineColor: { top: [0, 0, 0] },
//                     }
//                 }
//             ]
//         ];

//         const poHeader = [[{
//             content: 'DELIVERY CHALLAN', colSpan: 8,
//             styles: {
//                 lineWidth: 0,
//                 textColor: "#000000", // dark text on light background
//                 fontStyle: "bold",
//                 fontWeight: "bold",
//                 fillColor: [200, 210, 255], fontSize: 8,
//             },
//         }]];
//         const address = [
//             [
//                 {
//                     content: `To: \nM/ s.${item.jobWork.supplierName}\n${item.jobWork.spAddress}\nPAN No: ${item.jobWork.panNo}\nGST No: ${item.jobWork.gstNo}`,
//                     colSpan: 3,
//                     styles: { halign: 'left', valign: 'top', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
//                 },

//                 {
//                     content: `Ship To: \nM / s.${item.jobWork.supplierName}\n${item.jobWork.address || ''}\nPAN No: ${item.jobWork.panNo}\nGST No: ${item.jobWork.gstNo}`,
//                     colSpan: 5,
//                     styles: { halign: 'left', valign: 'top', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
//                 },
//             ],
//             [
//                 {
//                     content: `Place of Supply & State : ${item.jobWork.spPlace}`,
//                     colSpan: 4,
//                     styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
//                 },
//                 {
//                     content: `State Code : ${item.jobWork.toStateCode}`,
//                     colSpan: 4,
//                     styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
//                 },
//             ]

//         ];
//         const firstHeaderRow = [
//             [
//                 {
//                     content: `DC NO: ${item.jobWork.dcNo}`,
//                     colSpan: 2,
//                     styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
//                 },
//                 {
//                     content: `Challan No: ${item.jobWork.challanNo} `,
//                     colSpan: 2,
//                     styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
//                 },
//                 {
//                     content: `Mode of Trans: ${item.jobWork.modeOfTransport}`,
//                     colSpan: 4,
//                     styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
//                 }
//             ],
//             [
//                 {
//                     content: `DC Date: ${item.jobWork.created_at}`,
//                     colSpan: 2,
//                     styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
//                 },
//                 {
//                     content: `Challan Date: ${item.jobWork.challanDate}`,
//                     colSpan: 2,
//                     styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
//                 },
//                 {
//                     content: `Vehicle No: ${item.jobWork.vehicleNo}`,
//                     colSpan: 4,
//                     styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
//                 }
//             ],
//         ];

//         const secondHeaderRow = [['SI No', 'Part Name', 'Part Description ', 'HSN /SAC', 'UOM', 'Qty', 'Rate', 'Amount']];

//         const headerRows = [...logoAndAddress,/* ...pan,*/ ...poHeader, ...address, ...firstHeaderRow, ...secondHeaderRow];

//         const totalRow = [
//             ...(item.jobWork.igst > 0 ? [[
//                 { content: '', colSpan: 3, styles: { halign: 'left', fontSize: 8 } },
//                 { content: `IGST @${item.jobWork.igstPercent} % `, colSpan: 3, styles: { halign: 'left', fontSize: 10 } },
//                 { content: `${Number(item.jobWork.igst || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8, textColor: 'black' } }
//             ],] : []),
//             ...(item.jobWork.sgst > 0 ? [[
//                 { content: '', colSpan: 3, styles: { halign: 'left', fontSize: 8 } },
//                 { content: `SGST @${item.jobWork.sgstPercent} % `, colSpan: 3, styles: { halign: 'left', fontSize: 10 } },
//                 { content: `${Number(item.jobWork.sgst || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8, textColor: 'black' } }
//             ]] : []),
//             ...(item.jobWork.cgst > 0 ? [[
//                 { content: '', colSpan: 3, styles: { halign: 'left', fontSize: 8 } },
//                 { content: `CGST @${item.jobWork.cgstPercent} % `, colSpan: 3, styles: { halign: 'left', fontSize: 10 } },
//                 { content: `${Number(item.jobWork.cgst || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8, textColor: 'black' } }
//             ]] : []),

//             [
//                 {
//                     content: `Remarks : ${item.jobWork.remarks}`,
//                     colSpan: 3,
//                     rowSpan: 1,
//                     styles: { halign: 'left', fontSize: 10, textColor: 'black' }
//                 },
//                 {
//                     content: 'Total Qty',
//                     colSpan: 3,
//                     styles: { halign: 'left', fontSize: 10, textColor: 'black' }
//                 },
//                 {
//                     content: Number(item.jobWork.totalQty || 0).toLocaleString('en-IN'),
//                     colSpan: 2,
//                     styles: { halign: 'left', fontSize: 10, textColor: 'black' }
//                 },
//             ],
//             [
//                 {
//                     content: `DC Issue Date : ${item.jobWork.created_at}`,
//                     colSpan: 3,
//                     rowSpan: 1,
//                     styles: { halign: 'left', fontSize: 10, textColor: 'black' }
//                 },
//                 {
//                     content: 'Total Value',
//                     colSpan: 3,
//                     styles: { halign: 'left', fontSize: 10, textColor: 'black' }
//                 },
//                 {
//                     content: Number(item.jobWork.totalValue || 0).toLocaleString('en-IN'),
//                     colSpan: 2,
//                     styles: { halign: 'left', fontSize: 10, textColor: 'black' }
//                 },

//             ],
//             [
//                 {
//                     content: 'Subject to Bengaluru Jurisdiction',
//                     colSpan: 3,
//                     rowSpan: 1,
//                     styles: { halign: 'left', fontSize: 10, textColor: 'black' }
//                 },
//                 {
//                     content: 'Gross Value',
//                     colSpan: 3,
//                     styles: { halign: 'left', fontSize: 10, textColor: 'black' }
//                 },
//                 {
//                     content: Number(item.jobWork.totalGrossAmt || 0).toLocaleString('en-IN'),
//                     colSpan: 2,
//                     styles: { halign: 'left', fontSize: 10, textColor: 'black' }
//                 },

//             ],
//         ];


//         const termsAndSuppluColumn = [

//             [
//                 {
//                     content: `Receiver's Signature`,
//                     colSpan: 1,
//                     styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom', marginTop: 10, paddingTop: 10 }
//                 },
//                 {
//                     content: `Prepared By ${item.jobWork.createdBy}`,
//                     colSpan: 1,
//                     styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom', marginTop: 10, paddingTop: 10 }
//                 },
//                 {
//                     content: 'Reviewed By',
//                     colSpan: 1,
//                     styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom', marginTop: 10, paddingTop: 10 }
//                 },
//                 {
//                     content: `For RDL Technologies Pvt Ltd.\n\n\n\nAuthorized Signatory`,
//                     colSpan: 1,
//                     styles: { halign: 'left', fontSize: 8, textColor: 'black', marginTop: 10, paddingTop: 10 }
//                 }

//             ],

//         ]

//         //Table Border lines
//         const outerTable = [
//             [
//                 {
//                     content: 'Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076',
//                     colSpan: 4,
//                     styles: {
//                         halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal',
//                         lineWidth: { top: 0.5, right: 0, bottom: 0, left: 0 },
//                         lineColor: { top: [0, 0, 0] },
//                         cellPadding: { top: 20, bottom: 3 }, // ⬅️ Add padding for spacing

//                     }
//                 },
//             ],
//             [
//                 {
//                     content: 'Branch Address: Plot No. 98-I, Road No. 6, KIADB Jigani Industrial Estate, 2nd Phase, Jigani, Anekal Tq, Bangalore - 560105',
//                     colSpan: 4,
//                     styles: {
//                         halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', lineWidth: 0
//                     }
//                 },
//             ],

//         ];

//         const bodyRows = [...info, ...totalRow/*, ...termsAndSuppluColumn,*/]
//         const footRows = [...termsAndSuppluColumn, ...outerTable]

//         // doc.autoTable({
//         //     theme: 'striped',
//         //     head: headerRows,
//         //     body: bodyRows,
//         //     // foot: footRows,
//         //     showHead: 'firstPage',
//         //     showFoot: 'lastPage',
//         //     // startY: 2,
//         //     ...tableOptions,
//         //     headStyles: {
//         //         fillColor: [255, 255, 255], // Header background color
//         //         textColor: [0, 0, 0], // Header text color
//         //         halign: 'center', // Header text alignment
//         //         valign: 'middle', // Vertical alignment
//         //         lineWidth: 0.1, // Border width
//         //         lineColor: [0, 0, 0], // Border color,
//         //         font: 'times',
//         //         fontSize: 8,

//         //     },
//         //     columnStyles: {
//         //         1: { cellWidth: 46 }, // Item Code
//         //         2: { cellWidth: 67 }, // Item Description
//         //     },
//         //     bodyStyles: {
//         //         fillColor: [255, 255, 255], // Header background color
//         //         textColor: [0, 0, 0], // Header text color
//         //         halign: 'left', // Header text alignment
//         //         valign: 'middle', // Vertical alignment
//         //         lineWidth: 0.1, // Border width
//         //         lineColor: [0, 0, 0], // Border color
//         //         fontStyle: 'normal',
//         //         fontSize: 7,
//         //         font: 'times',
//         //         cellWidth: 'wrap', // avoids wrapping
//         //     },
//         //     footStyles: {
//         //         fillColor: [255, 255, 255], // Header background color
//         //         textColor: [0, 0, 0], // Header text color
//         //         halign: 'center', // Header text alignment
//         //         valign: 'middle', // Vertical alignment
//         //         lineWidth: 0.1, // Border width
//         //         lineColor: [0, 0, 0], // Border color
//         //         font: 'times',
//         //     },
//         //     didDrawPage: function (data) {
//         //         if (data.pageNumber === 1) {
//         //             // Your current logo and header — keep untouched
//         //             doc.addImage(logoUrl, 'PNG', 22, 18, 28, 15);
//         //             doc.addImage(ISOUrl, 'PNG', 160, 15, 35, 20);
//         //         } else {
//         //             // ✅ Repeat secondHeaderRow manually on all pages after 1
//         //             const headers = ['SI No', 'Part Name', 'Part Description ', 'HSN /SAC', 'UOM', 'Qty', 'Rate', 'Amount'];
//         //             const widths = [15, 46, 67, 25, 20, 20, 30, 30]; // match columnStyles
//         //             const startX = data.settings.margin.left;
//         //             let y = data.cursor.y + 5;

//         //             doc.setFont('times', 'bold');
//         //             doc.setFontSize(8);
//         //             doc.setTextColor(0);

//         //             let x = startX;
//         //             headers.forEach((text, i) => {
//         //                 const width = widths[i];
//         //                 doc.rect(x, y, width, 10); // Draw border
//         //                 doc.text(text.trim(), x + width / 2, y + 6, { align: 'center', baseline: 'middle' });
//         //                 x += width;
//         //             });

//         //             data.cursor.y = y + 10; // Adjust position for next row
//         //         }

//         //         // ✅ Keep your existing footer and page number logic
//         //         const pageSize = doc.internal.pageSize;
//         //         const pageWidth = pageSize.width || pageSize.getWidth();
//         //         const pageHeight = pageSize.height || pageSize.getHeight();

//         //         doc.setFontSize(8);
//         //         doc.setTextColor(70);
//         //         doc.text('FORMAT NO:IMS-ME-PUR-F-203-Rev-3 Dated 11-01-2019', 14, pageHeight - 10);
//         //         doc.text(`Page ${data.pageNumber} of ${totalPagesExp}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
//         //     },


//         //     didParseCell: function (data) {
//         //         if (data.section === 'body') {
//         //             data.cell.styles.overflow = 'linebreak';
//         //             data.cell.styles.fillColor = false;

//         //             // Only align number cells to the right (check if value is numeric)
//         //             const valueText = Array.isArray(data.cell.text) ? data.cell.text.join('') : data.cell.text;
//         //             const plainValue = valueText.replace(/,/g, '').trim(); // Remove commas for check

//         //             if (!isNaN(plainValue) && plainValue !== '') {
//         //                 data.cell.styles.halign = 'right';
//         //             }
//         //         }
//         //     }

//         // });

//         doc.autoTable({
//             theme: 'striped',
//             head: headerRows,
//             body: bodyRows,
//             // foot: footRows,
//             showHead: 'firstPage',
//             showFoot: 'lastPage',
//             // startY: 2,
//             ...tableOptions,
//             headStyles: {
//                 fillColor: [255, 255, 255], // Header background color
//                 textColor: [0, 0, 0],       // Header text color
//                 halign: 'center',           // Header text alignment
//                 valign: 'middle',           // Vertical alignment
//                 lineWidth: 0.1,             // Border width
//                 lineColor: [0, 0, 0],       // Border color
//                 font: 'times',
//                 fontSize: 8,
//             },
//             columnStyles: {
//                 1: { cellWidth: 46 }, // Item Code
//                 2: { cellWidth: 67 }, // Item Description
//             },
//             bodyStyles: {
//                 fillColor: [255, 255, 255],
//                 textColor: [0, 0, 0],
//                 halign: 'left',
//                 valign: 'middle',
//                 lineWidth: 0.1,
//                 lineColor: [0, 0, 0],
//                 fontStyle: 'normal',
//                 fontSize: 7,
//                 font: 'times',
//                 cellWidth: 'wrap',
//             },
//             footStyles: {
//                 fillColor: [255, 255, 255],
//                 textColor: [0, 0, 0],
//                 halign: 'center',
//                 valign: 'middle',
//                 lineWidth: 0.1,
//                 lineColor: [0, 0, 0],
//                 font: 'times',
//             },

//             didDrawPage: function (data) {
//                 if (data.pageNumber === 1) {
//                     // ✅ First page logo/header
//                     doc.addImage(logoUrl, 'PNG', 22, 18, 28, 15);
//                     doc.addImage(ISOUrl, 'PNG', 160, 15, 35, 20);
//                 } else {
//                     const headerHeight = 10; // Adjust height of your repeated header

//                     // ✅ Repeat secondHeaderRow manually on all pages after 1
//                     const headers = ['SI No', 'Part Name', 'Part Description', 'HSN /SAC', 'UOM', 'Qty', 'Rate', 'Amount'];
//                     const startX = data.settings.margin.left;
//                     let y = data.settings.margin.top - headerHeight;  // 🔥 fixed: start from top margin

//                     doc.setFont('times', 'bold');
//                     doc.setFontSize(8);
//                     doc.setTextColor(0);

//                     let x = startX;
//                     data.table.columns.forEach((col, i) => {
//                         const width = col.width;  // use actual column width
//                         doc.rect(x, y, width, 10);
//                         doc.text(headers[i].trim(), x + width / 2, y + 6, {
//                             align: 'center',
//                             baseline: 'middle'
//                         });
//                         x += width;
//                     });
//                     doc.setFontSize(8);
//                     doc.setFont("times", "bold");
//                     doc.setTextColor('blue');
//                     doc.text(`Dc No : ${item.jobWork.dcNo}     |     Date : ${item.jobWork.created_at}`, 14, 3);
//                     // data.cursor.y = y + 10; // Adjust for next row

//                 }

//                 // ✅ Footer + page numbers
//                 const pageSize = doc.internal.pageSize;
//                 const pageWidth = pageSize.width || pageSize.getWidth();
//                 const pageHeight = pageSize.height || pageSize.getHeight();

//                 doc.setFontSize(8);
//                 doc.setTextColor(70);
//                 doc.text('FORMAT NO:IMS-ME-PUR-F-203-Rev-3 Dated 11-01-2019', 14, pageHeight - 10);
//                 doc.text(`Page ${data.pageNumber} of ${totalPagesExp}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
//             },

//             didParseCell: function (data) {
//                 if (data.section === 'body') {
//                     data.cell.styles.overflow = 'linebreak';
//                     data.cell.styles.fillColor = false;

//                     // ✅ Align numeric cells to right
//                     const valueText = Array.isArray(data.cell.text) ? data.cell.text.join('') : data.cell.text;
//                     const plainValue = valueText.replace(/,/g, '').trim();

//                     if (!isNaN(plainValue) && plainValue !== '') {
//                         data.cell.styles.halign = 'right';
//                     }
//                 }
//             }
//         });


//         doc.autoTable({
//             theme: 'striped',
//             head: footRows,
//             startY: doc.lastAutoTable.finalY,
//             headStyles: {
//                 fillColor: [255, 255, 255], // Header background color
//                 textColor: [0, 0, 0], // Header text color
//                 halign: 'center', // Header text alignment
//                 valign: 'middle', // Vertical alignment
//                 lineWidth: 0.1, // Border width
//                 lineColor: [0, 0, 0], // Border color,
//                 font: 'times',
//             }
//         });

//         // PAGE NUMBER
//         if (typeof doc.putTotalPages === 'function') {
//             doc.putTotalPages(totalPagesExp); // This replaces "{totalPages}" in all pages
//         }

//         // doc.save('PurchaseOrder.pdf');
//         // const pdfBlob = doc.output('blob');
//         // const pdfBlobUrl = URL.createObjectURL(pdfBlob);
//         // setPdfUrl(pdfBlobUrl);
//         const pdfBlob = doc.output('blob');
//         return pdfBlob; // ✅ Return the blob instead of setting state
//     }

//     const mergeJsPdfBlobs = async (blobs) => {
//         const mergedPdf = await PDFDocument.create();

//         for (const blob of blobs) {
//             const arrayBuffer = await blob.arrayBuffer();
//             const pdf = await PDFDocument.load(arrayBuffer);
//             const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
//             pages.forEach((page) => mergedPdf.addPage(page));
//         }

//         const mergedPdfBytes = await mergedPdf.save();
//         const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
//         return URL.createObjectURL(mergedBlob);
//     };

//     useEffect(() => {
//         const generateMergedPdf = async () => {
//             if (pdfBlobs.length > 0) {
//                 const mergedUrl = await mergeJsPdfBlobs(pdfBlobs);
//                 setMergedPdfUrl(mergedUrl);
//             }
//         };

//         generateMergedPdf();
//     }, [pdfBlobs]);

//     //JSON FILE
//     const getJsonSuccess = async (dataObject) => {
//         try {
//             // Create a Blob from the JSON data
//             const jsonBlob = new Blob([JSON.stringify(dataObject, null, 2)], { type: 'application/json' });
//             // Create a link element
//             const link = document.createElement('a');
//             link.href = URL.createObjectURL(jsonBlob);
//             link.download = 'JWI.json'; // Filename for the downloaded file
//             // Programmatically click the link to trigger the download
//             link.click();
//             // Clean up the object URL
//             URL.revokeObjectURL(link.href);
//         } catch (error) {
//             console.error('Error fetching API:', error);
//         }
//     }
//     const getJsonExceptoin = () => {
//     }

//     // JOBWORK SEARCH
//     const handlePJWChange = (e) => {
//         GetGeneratedJW({ code: e.target.value }, handleGeneratedJWSucessShow, handleGeneratedJWExceptionShow);
//     }

//     const handleGeneratedJWSucessShow = (dataObject) => {
//         setGeneratedJWLists(dataObject?.data || []);
//     }
//     const handleGeneratedJWExceptionShow = (errorObject, errorMessage) => {
//     }

//     const handleGeneratedJWSelect = (selectedValue) => {
//         if (selectedValue !== null) {
//             setSelectedJwNo(selectedValue?.label);
//             GetDelNoteForwardReverse({ type: 'view', id: selectedValue.id }, handleActionSuccess, handleActionException)
//         }
//     }

//     const handleSpeclInstr1Change = (value) => {
//         if (value !== null) {
//             setRemarks(value.label);
//         }
//     }

//     const handlePOChange = (e) => {
//         setRemarks(e.target.value);
//         GetRemarksLists({ code: e.target.value }, handleGeneratedPoSucessShow, handleGeneratedPoExceptionShow);
//     }

//     const handleGeneratedPoSucessShow = (dataObject) => {
//         setRemarksAllLists(dataObject?.data || []);
//     }
//     const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => {
//     }

//     //SEARCH ITEM
//     const handleItemChange = (e) => {
//         // GetJobWorkIssueItemLists({ supId: supplierSid, code: e.target.value }, handleVendorProcessVendorSucessShow, handleVendorProcessVendorExceptionShow);
//         ItemSearchNAAJ({
//             text: e.target.value
//         }, handleVendorProcessVendorSucessShow, handleVendorProcessVendorExceptionShow);
//     }

//     const handleVendorProcessVendorSucessShow = (dataObject) => {
//         setSupplierItemList(dataObject?.data || []);
//     }
//     const handleVendorProcessVendorExceptionShow = (errorObject, errorMessage) => {
//     }

//     const handleSupplierItemChange = (value) => {
//         if (value !== null) {
//             // // Clone the selectedItems array
//             // const clonedSelectedItems = [...selectedItems];

//             // // Remove the last item from the cloned array
//             // const lastObj = clonedSelectedItems.pop();

//             // // Add the new value at the end and the removed item back
//             // clonedSelectedItems.push(value, lastObj);

//             // // Set the state with the modified array
//             // setSelectedItems(clonedSelectedItems);
//             // // setSearchedItemValue();
//             GetJobWorkIssueItemDetails({ supplierId: supplierSid, itemId: value.id }, handleGetItemDetailsSuccess, handleGetItemDetailsException)
//         }
//     };

//     const handleGetItemDetailsSuccess = (dataObject) => {
//         const itemData = dataObject?.data?.[0] || null;
//         // Clone the selectedItems array
//         const clonedSelectedItems = [...selectedItems];

//         // Remove the last item from the cloned array
//         const lastObj = clonedSelectedItems.pop();

//         // Add the new value at the end and the removed item back
//         clonedSelectedItems.push(itemData, lastObj);

//         // Set the state with the modified array
//         setSelectedItems(clonedSelectedItems);
//         // setSearchedItemValue();
//     }
//     const handleGetItemDetailsException = () => { }

//     const handleEdit = (cellNam, newValue, id, rowData) => {
//         switch (cellNam) {
//             case "jwQty":
//                 const updatedSrnQty = selectedItems.map((supp) =>
//                     supp.id === id && cellNam === 'jwQty' ?
//                         {
//                             ...supp, jwQty: newValue,
//                             // amount: newValue * rowData.rate
//                             amount: Number((newValue * rowData.rate).toFixed(3))
//                         }
//                         : supp
//                 )
//                 setSelectedItems(updatedSrnQty);
//                 break;
//             case "remarks":
//                 const updatedRemarks = selectedItems.map((supp) =>
//                     supp.id === id && cellNam === 'remarks' ?
//                         { ...supp, remarks: newValue }
//                         : supp
//                 )
//                 setSelectedItems(updatedRemarks);
//                 break;
//             default:
//             // code block
//         }
//     }

//     const handleCloseModal = () => {
//         setViewMoreModal(false)
//         if (subSupplyType === '8' || subSupplyType === '5') {
//             if (subSupplyDesc === '') {
//                 setNotification({
//                     status: true,
//                     type: 'error',
//                     message: 'Please Enter Sub Supply Desc',
//                 });
//             }
//         }
//         if (actualToState !== '29' || (actualToState === '29' && Number(totalValue) > 50000)) {
//             if (ewayBillRequired === 'N') {
//                 setNotification({
//                     status: true,
//                     type: 'error',
//                     message: 'E-way Bill Is Mandetory',
//                 });
//             }
//         }
//     }

//     // UNIQUE CODE MANUAL CHANGE
//     const handleUniqueCodeChange = (e) => {
//         const newUniqueCode = e.target.value;
//         const currentYear = DCNumber.split('/')[0]; // Get last 2 digits of the year
//         setSequentialNumber(newUniqueCode);
//         setDCNumber(`${currentYear}/${newUniqueCode.toString().padStart(5, 0)}`);
//     };

//     // Helper function to format the current date as yyyy-MM-dd
//     const getCurrentDate = () => {
//         const today = new Date();
//         return today.toISOString().split("T")[0]; // Extracts yyyy-MM-dd
//     };

//     const CustomPopper = (props) => {
//         return (
//             <Popper
//                 {...props}
//                 placement="top"
//                 style={{ position: 'absolute', top: 'auto', bottom: '100%' }}
//             />
//         );
//     };

//     const deletehandleSuccess = (dataObject) => {
//         setNotification({
//             status: true,
//             type: "success",
//             message: dataObject.message,
//         });
//         setTimeout(() => {
//             // handleClose();
//             setDeleteDailogOpen(false);
//             handleClearPage();
//         }, 3000);
//     };
//     const deletehandleException = (errorObject, errorMessage) => {
//         setNotification({
//             status: true,
//             type: "error",
//             message: errorMessage,
//         });
//         setTimeout(() => {
//             // handleClose();
//         }, 3000);
//     };


//     const handleRateChange = (e, index, item) => {
//         const newRate = parseFloat(e.target.innerText) || 0;
//         const newAmount = (item.jwQty || 0) * newRate;

//         const updatedItems = [...selectedItems];
//         updatedItems[index] = { ...item, rate: newRate, amount: newAmount };
//         setSelectedItems(updatedItems);
//     };
//     return (
//         <div>
//             <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
//                 {/* <Link to='/JobWorkIssueResult' style={{ textDecoration: 'none' }}>
//                     <Typography
//                         sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
//                         variant="h5"
//                     >
//                         {`Back>> `}
//                     </Typography>
//                 </Link> */}
//                 <Typography
//                     sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
//                     variant="h5">
//                     {viewDC || isView ? "View - Job Work Issue" : isEdit ? "Edit - Job Work Issue" : "New - Job Work Issue"}
//                 </Typography>
//             </div>
//             <form onSubmit={handleSubmit}>
//                 <Grid container padding={1}>
//                     <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
//                         <Grid container spacing={1}>
//                             <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                                 <TextField
//                                     fullWidth
//                                     disabled={true}
//                                     placeholder='JWISS No'
//                                     size="small"
//                                     style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
//                                 <TextField
//                                     fullWidth
//                                     // readOnly={true}
//                                     disabled={isView ? true : false}
//                                     required
//                                     value={sequentialNumber}
//                                     // onChange={(e) => setSequentialNumber(e.target.value)}
//                                     onChange={handleUniqueCodeChange}
//                                     size="small"
//                                     style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
//                                     inputProps={{ maxLength: 5 }} // Set max length to 5 characters
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
//                                 <TextField
//                                     fullWidth
//                                     type='date'
//                                     // readOnly={true}
//                                     // disabled={true}
//                                     disabled={isView ? true : false}
//                                     required
//                                     value={formatDate(selectedDate)}
//                                     onChange={(e) => setSelectedDate(e.target.value)}
//                                     size="small"
//                                     style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
//                                     max={getCurrentDate()} // Restrict dates greater than today
//                                     inputProps={{
//                                         max: getCurrentDate(), // Restrict dates greater than today
//                                     }}
//                                 />
//                             </Grid>

//                             <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ display: "flex", alignItems: "center" }}>
//                                 <TextField
//                                     fullWidth
//                                     // readOnly={true}
//                                     disabled={isView ? true : false}
//                                     required
//                                     value={DCNumber}
//                                     // onChange={(e) => setDCNumber(e.target.value)}
//                                     size="small"
//                                     style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
//                                 />

//                                 <Tooltip title="Refresh DocNumber">
//                                     <span>
//                                         {" "}
//                                         {/* wrapper to avoid tooltip crash when button is disabled */}
//                                         <IconButton
//                                             disabled={isView || isEdit}
//                                             onClick={() => {
//                                                 if (sequentialNumber) {
//                                                     // setPoType(e.target.value)
//                                                     GetJobWorkIssueUniqueID(handleUniqueCodeSuccess, handleUniqueCodeException);
//                                                 }
//                                             }}
//                                             color="primary"
//                                             size="small"
//                                             style={{ marginLeft: "5px" }}
//                                         >
//                                             <RefreshIcon />
//                                         </IconButton>
//                                     </span>
//                                 </Tooltip>
//                             </Grid>

//                             <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
//                                 {/* {viewDC || isEditable ?
//                                     <TextField
//                                         fullWidth
//                                         readOnly={true}
//                                         required
//                                         value={supplierSelect}
//                                         size="small"
//                                         style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
//                                     />
//                                     : */}
//                                 <Autocomplete
//                                     disablePortal
//                                     id="combo-box-demo"
//                                     disabled={isView ? true : false}
//                                     options={supplierList}
//                                     fullWidth
//                                     // getOptionLabel={(option) => option.spCode || ''}
//                                     // value={supplierSelect}
//                                     value={supplierSelect}
//                                     getOptionLabel={(option) => option.label || supplierSelect}
//                                     renderInput={(params) => <TextField {...params} label="Supplier" onChange={handleChange} />}
//                                     onChange={(event, value) => handleSupplierSearchItemChange(value)}
//                                     size="small"
//                                     style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
//                                 />
//                                 {/* } */}
//                             </Grid>

//                             <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
//                                 <TextField
//                                     fullWidth
//                                     id="outlined-multiline-static"
//                                     label="Billing Address"
//                                     disabled={isView ? true : false}
//                                     multiline
//                                     rows={4}
//                                     rowsMax={8}
//                                     value={suppAddress}
//                                     readOnly={true}
//                                     size="small"
//                                     style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
//                                     inputProps={{
//                                         style: { height: '65px', fontSize: '13px' }
//                                     }}
//                                 />

//                             </Grid>

//                             <Grid item xs={12} sm={12} md={1} lg={1} xl={1} marginRight={2} style={{ marginRight: '10px' }}  >
//                                 <Button variant="contained" style={{ backgroundColor: isView === true ? ' #dddddd' : '#002d68' }} disabled={isView ? true : false} onClick={() => setChangeAddressModalOpen(true)}>Change</Button>
//                             </Grid>

//                             <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
//                                 <Button variant="contained" disabled={isView || selectedType === 'Capital' || selectedType === 'nonReturnable' ? true : false} style={{ backgroundColor: isView === true || selectedType === 'Capital' || selectedType === 'nonReturnable' ? ' #dddddd' : '#002d68' }} onClick={() => setLoadPendingSfg(true)}>{selectedType === 'Quarantine' ? 'Load Quarantine' : 'Load From Pending SFG'}</Button>
//                             </Grid>

//                             <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
//                             </Grid>
//                         </Grid>
//                     </Grid>

//                     <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid>

//                     <Grid item xs={12} sm={12} md={6} lg={4} xl={4} style={{ fontSize: '75%' }}>
//                         <Autocomplete
//                             disablePortal
//                             id="combo-box-demo"
//                             options={generatedJwLists}
//                             fullWidth
//                             value={selectedJwNo}
//                             getOptionLabel={(option) => option.label || selectedJwNo}
//                             renderInput={(params) => <TextField {...params} label="Search JWI" onChange={handlePJWChange} />}
//                             onChange={(event, value) => handleGeneratedJWSelect(value)}
//                             size="small"
//                             style={{ backgroundColor: '#ffffff', borderRadius: '5px', zIndex: 10000 }}
//                         />
//                         {/* <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '0px', borderRadius: '10px', width: '100%', height:'20vh', overflow: 'auto', border: '1px solid black' }}> */}
//                         {/* <CardContent> */}
//                         {/* <Autocomplete
//                                     disablePortal
//                                     id="combo-box-demo"
//                                     options={generatedJwLists}
//                                     fullWidth
//                                     value={selectedJwNo}
//                                     getOptionLabel={(option) => option.label || selectedJwNo}
//                                     renderInput={(params) => <TextField {...params} label="Search JWI" onChange={handlePJWChange} />}
//                                     onChange={(event, value) => handleGeneratedJWSelect(value)}
//                                     size="small"
//                                     style={{ backgroundColor: '#ffffff', borderRadius: '5px', zIndex: 10000 }}
//                                 /> */}
//                         {/* <Grid container spacing={2}>
//                                     <Grid item xs={12} style={{ textAlign: 'right' }}> */}
//                         <div style={{ width: '100%', textAlign: 'right', marginTop: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '15px' }}>
//                             <FormControl fullWidth style={{ display: 'flex', flex: 1 }}>
//                                 <InputLabel id="demo-simple-select-label">Category</InputLabel>
//                                 <Select
//                                     labelId="demo-simple-select-label"
//                                     id="demo-simple-select"
//                                     value={selectedType}
//                                     label="Category"
//                                     size='small'
//                                     onChange={(e) => {
//                                         setSelectedType(e.target.value)
//                                         setTypeOfGoods(e.target.value)
//                                     }}
//                                 >
//                                     <MenuItem value={'General'}>General</MenuItem>
//                                     <MenuItem value={'Capital'}>Capital Goods</MenuItem>
//                                     <MenuItem value={'Quarantine'}>Quarantine</MenuItem>
//                                     <MenuItem value={'nonReturnable'}>Non Returnable</MenuItem>
//                                 </Select>
//                             </FormControl>
//                             <Button
//                                 variant="contained"
//                                 style={{
//                                     width: "100%",
//                                     background: "#002D68",
//                                     color: "white",
//                                     height: '35px',
//                                     // width: '250px',
//                                     display: 1,
//                                     flex: 1
//                                 }}
//                                 onClick={() => setViewMoreModal(true)}
//                             >
//                                 Additional Details
//                             </Button>
//                         </div>
//                     </Grid>

//                     <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
//                         <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: screenHeight - 410, border: '1px solid black', }}>
//                             <CardContent style={{ height: '100%', overflow: 'auto' }}>
//                                 <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '18px' }}>
//                                     <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', columnGap: '10px', rowGap: '10px' }}>
//                                         <Button
//                                             variant="contained"
//                                             style={{
//                                                 width: "100%",
//                                                 height: '35px',
//                                                 background:
//                                                     userPermission[0]?.addData === 0 ? "gray" : "#002D68",
//                                                 color:
//                                                     userPermission[0]?.addData === 0 ? "black" : "white",
//                                             }}
//                                             disabled={userPermission[0]?.addData === 0}
//                                             onClick={handleClearPage}
//                                         >
//                                             New
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             style={{
//                                                 width: "100%",
//                                                 height: '35px',
//                                                 background:
//                                                     userPermission[0]?.updateData === 0 ? "gray" : "#002D68",
//                                                 color:
//                                                     userPermission[0]?.updateData === 0 ? "black" : "white",
//                                             }}
//                                             disabled={userPermission[0]?.updateData === 0}
//                                             onClick={() => {
//                                                 setIsView(false)
//                                                 setIsEdit(true)
//                                             }}
//                                         >
//                                             Edit
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             style={{
//                                                 width: "100%",
//                                                 height: '35px',
//                                                 background:
//                                                     userPermission[0]?.deleteData === 0 ? "gray" : "#002D68",
//                                                 color:
//                                                     userPermission[0]?.deleteData === 0 ? "black" : "white",
//                                             }}
//                                             disabled={userPermission[0]?.deleteData === 0}
//                                             onClick={() => setDeleteDailogOpen(true)}
//                                         >
//                                             Delete
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             style={{
//                                                 width: "100%",
//                                                 height: '35px',
//                                                 background: "#002D68",
//                                                 color: "white",
//                                             }}
//                                             onClick={handleClearPage}
//                                         >
//                                             Clear
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             style={{
//                                                 width: "100%",
//                                                 background: userPermission[0]?.print === 0
//                                                     ? "gray"
//                                                     : (preViewItemList.length > 0 && mainId)
//                                                         ? "#002D68"
//                                                         : "gray",
//                                                 color: userPermission[0]?.print === 0
//                                                     ? "#000000"
//                                                     : (preViewItemList.length > 0 && mainId)
//                                                         ? "white"
//                                                         : "#000000",
//                                                 height: "35px",
//                                             }}
//                                             disabled={
//                                                 userPermission[0]?.print === 0
//                                                     ? true
//                                                     : !(preViewItemList.length > 0 && mainId)
//                                             }
//                                             onClick={() => {
//                                                 setPdfModalOpen(true)
//                                                 getInvoiceData(mainId)
//                                             }}
//                                         >
//                                             Print
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             style={{
//                                                 width: "100%",
//                                                 background: preViewItemList.length > 0 && ewayBillRequired === 'Y' ? "#002D68" : "gray",
//                                                 color: preViewItemList.length > 0 && ewayBillRequired === 'Y' ? "white" : "black",
//                                                 height: '35px',
//                                             }}
//                                             disabled={preViewItemList.length > 0 && ewayBillRequired === 'Y' ? false : true}
//                                             onClick={() => {
//                                                 GetJobWorkIssueDCJson({ id: mainId }, getJsonSuccess, getJsonExceptoin)
//                                             }}
//                                         >
//                                             JSON
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
//                                             onClick={() => handleForwardReverse('first', '')}
//                                         >
//                                             <FastRewindIcon />
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
//                                             onClick={() => handleForwardReverse('reverse', mainId)}
//                                         >
//                                             <SkipPreviousIcon />
//                                         </Button>
//                                         {/* <Button
//                                                 variant="contained"
//                                                 style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
//                                             >
//                                                 <SearchIcon />
//                                             </Button> */}
//                                         <Button
//                                             variant="contained"
//                                             style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
//                                             onClick={() => handleForwardReverse('forward', mainId)}
//                                         >
//                                             <SkipNextIcon />
//                                         </Button>
//                                         <Button
//                                             variant="contained"
//                                             style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
//                                             onClick={() => handleForwardReverse('last', '')}
//                                         >
//                                             <FastForwardIcon />
//                                         </Button>
//                                     </div>
//                                     <div>
//                                         {/* {isView && < Button variant="contained" onClick={() => setIsEditable(!isEditable)} style={{ height: '35px', backgroundColor: '#002D68', marginRight: '10px' }}>Edit</Button>} */}
//                                         {!viewDC && < Button disabled={loading} variant="contained" type='submit' style={{ height: '35px', backgroundColor: '#002D68' }}>
//                                             {/* {isEditable && isView ? "Update" : "SAVE"} */}
//                                             {loading ? (
//                                                 <CircularProgress size={24} style={{ color: 'white' }} />
//                                             ) : (isEditable && isView ? "Update" : "SAVE")}
//                                         </Button>}
//                                     </div>
//                                 </div>
//                                 {/* <DataGrid
//                                     rows={selectedItems}
//                                     columns={middleGridColumns}
//                                     pageSize={5}
//                                     style={{ height: '310px' }}
//                                     key={refreshKey}
//                                     sx={{
//                                         '& .super-app-theme--header': {
//                                             WebkitTextStrokeWidth: '0.6px',
//                                             backgroundColor: '#93bce6',
//                                             color: '#1c1919'
//                                         },
//                                         '& .MuiDataGrid-cell': {
//                                             border: '1px solid #969696',
//                                         },
//                                         '& .MuiDataGrid-columnHeader': {
//                                             border: '1px solid #969696'
//                                         },
//                                     }}
//                                     getRowClassName={(params) => {
//                                         const rowIndex = selectedItems.findIndex(row => row.id === params.row.id);
//                                         if (rowIndex !== -1) {
//                                             console.log(' ');
//                                             return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
//                                         }
//                                         return '';
//                                     }}
//                                     rowHeight={40}
//                                     columnHeaderHeight={40}
//                                 /> */}
//                                 {/* <div style={{ overflowX: 'scroll' }}> */}
//                                 <table id="transactionTable">
//                                     <tr style={{ position: 'sticky', top: '-16px', backgroundColor: '#f9f9f9', zIndex: 1 }}>
//                                         <th>JC No</th>
//                                         <th>Part No</th>
//                                         <th>Part Name</th>
//                                         <th>UOM</th>
//                                         <th>QOH</th>
//                                         <th>HSNCODE</th>
//                                         <th>QTY</th>
//                                         <th>Supply Desc</th>
//                                         <th>Rate</th>
//                                         <th>Location</th>
//                                         <th>LOT</th>
//                                         <th>Amt</th>
//                                         <th>Remarks</th>
//                                         <th>GRN INFO</th>
//                                         <th>Actions</th>
//                                     </tr>
//                                     {selectedItems.map((item, index) => {
//                                         return (
//                                             <tr key={index}>
//                                                 <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.jcNo}</td>

//                                                 {selectedType === 'Quarantine' ?
//                                                     <td contentEditable={true} style={{ whiteSpace: 'nowrap' }}>{item.itemCode}</td>
//                                                     :
//                                                     <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>
//                                                         {item.itemCode ? <span>{item.itemCode}</span> :
//                                                             <Autocomplete
//                                                                 disablePortal
//                                                                 id="combo-box-demo"
//                                                                 options={supplierItemList}
//                                                                 // value={selectedItemName}
//                                                                 sx={{ width: 300 }}
//                                                                 getOptionLabel={(option) => option.label || ''}
//                                                                 renderInput={(params) => <TextField
//                                                                     {...params}
//                                                                     label="Search Items"
//                                                                     onChange={handleItemChange}
//                                                                     sx={{
//                                                                         "& .MuiInputBase-root": {
//                                                                             height: "35px",
//                                                                             fontSize: "12px",
//                                                                             backgroundColor: "#ffffff",
//                                                                             borderRadius: "5px",
//                                                                         },
//                                                                         "& .MuiInputBase-input": {
//                                                                             padding: "0 8px",
//                                                                         },
//                                                                         "& .MuiInputLabel-root": {
//                                                                             fontSize: "12px",
//                                                                             lineHeight: "1.2",
//                                                                         },
//                                                                     }}
//                                                                 />}
//                                                                 onChange={(event, value) => handleSupplierItemChange(value)}
//                                                                 size='small'
//                                                                 disabled={isView ? true : false}
//                                                                 PopperComponent={CustomPopper}
//                                                             />
//                                                         }
//                                                     </td>
//                                                 }
//                                                 <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.itemName}</td>
//                                                 <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.uom}</td>
//                                                 <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.qoh}</td>
//                                                 <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.hsn}</td>
//                                                 <td contentEditable={!isView} style={{ whiteSpace: 'nowrap' }} onBlur={(e) => handleEdit('jwQty', e.target.textContent, item.id, item)}>{item.jwQty}</td>
//                                                 <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.suppDesc}</td>
//                                                 <td
//                                                     contentEditable={true}
//                                                     suppressContentEditableWarning={true}
//                                                     onBlur={(e) => handleRateChange(e, index, item)}
//                                                 >
//                                                     {item.rate}
//                                                 </td>
//                                                 <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.location}</td>
//                                                 <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.lot}</td>
//                                                 <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.amount}</td>
//                                                 <td contentEditable={!isView} style={{ whiteSpace: 'nowrap' }} onBlur={(e) => handleEdit('remarks', e.target.textContent, item.id, item)}>{item.remarks}</td>
//                                                 <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.grnNo}</td>
//                                                 <td contentEditable={false} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
//                                                     {item.id === 'RDL1' ?
//                                                         null
//                                                         :
//                                                         !isView ?
//                                                             <DeleteIcon
//                                                                 onClick={() => {
//                                                                     handleDeleteRow(item.id)
//                                                                 }}
//                                                                 style={{ color: 'black', cursor: 'pointer' }}
//                                                             />
//                                                             :
//                                                             <DeleteIcon style={{ color: 'gray', cursor: 'pointer' }} />
//                                                     }
//                                                 </td>
//                                             </tr>
//                                         );
//                                     })}
//                                 </table>
//                                 {/* </div> */}
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 </Grid>

//                 {/* /////////////////////////////////////////ADITIONAL DATA\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}
//                 <Dialog open={viewMoreModal} onClose={() => setViewMoreModal(false)} maxWidth="xl" fullWidth>
//                     <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>JOB WORK ISSUE</DialogTitle>

//                     <DialogContent style={{ padding: '2px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', rowGap: '10px', columnGap: '10px' }}>
//                         <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
//                             <thead>
//                                 <tr>
//                                     <th colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#6895D2', color: '#ffffff' }}>JOB WORK ISSUE DETAILS</th>
//                                 </tr>
//                                 {/* <tr>
//                                     <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Field</th>
//                                     <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Value</th>
//                                 </tr> */}
//                             </thead>
//                             <tbody>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Challan No</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             onChange={(e) => setChallanNo(e.target.value)}
//                                             value={challanNo}
//                                             size='small'
//                                             label="Challan No"
//                                             disabled={isView ? true : false}
//                                         />
//                                     </td>
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             type='date'
//                                             onChange={(e) => setChallanDate(e.target.value)}
//                                             value={formatDate(challanDate)}
//                                             label="Challan Date"
//                                             size='small'
//                                             InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
//                                             disabled={isView ? true : false} />
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Challan Date</th> */}
//                                     {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             type='date'
//                                             onChange={(e) => setChallanDate(e.target.value)}
//                                             value={formatDate(challanDate)}
//                                             label="Challan Date"
//                                             size='small'
//                                             InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
//                                             disabled={isView ? true : false} />
//                                     </td> */}
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Mode Of Transport</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <FormControl fullWidth>
//                                             <InputLabel id="demo-simple-select-label">Mode Of Transport</InputLabel>
//                                             <Select
//                                                 labelId="demo-simple-select-label"
//                                                 id="demo-simple-select"
//                                                 value={modeOfTransport}
//                                                 onChange={(e) => setModeOfTransport(e.target.value)}
//                                                 label="Mode Of Transport"
//                                                 size='small'
//                                                 required
//                                                 disabled={isView ? true : false}                                                            >
//                                                 <MenuItem value={'BY ROAD'}>BY ROAD</MenuItem>
//                                                 <MenuItem value={'BY AIR'}>BY AIR</MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                     </td>
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={vehicleNo}
//                                             onChange={(e) => setVehicleNo(e.target.value)}
//                                             size='small'
//                                             label="Vehicle No"
//                                             required
//                                             disabled={isView ? true : false} />
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Vehicle No</th> */}
//                                     {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={vehicleNo}
//                                             onChange={(e) => setVehicleNo(e.target.value)}
//                                             size='small'
//                                             label="Vehicle No"
//                                             disabled={isView ? true : false} />
//                                     </td> */}
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Consignee Name</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={consigneeName}
//                                             // onChange={(e) => setConsigneeName(e.target.value)}
//                                             size='small'
//                                             required
//                                             label="Consignee Name"
//                                             disabled={isView ? true : false}
//                                         />
//                                     </td>
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             multiline
//                                             value={address1}
//                                             label="Address"
//                                             onChange={(e) => setAddress1(e.target.value)}
//                                             style={{ zoom: '75%' }}
//                                             size='small'
//                                             required
//                                             disabled={isView ? true : false}
//                                         />
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Address</th> */}
//                                     {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             multiline
//                                             value={suppAddress}
//                                             label="Address"
//                                             disabled={true}
//                                             onChange={(e) => setAddress1(e.target.value)}
//                                             style={{ zoom: '75%' }}
//                                             size='small'
//                                         />
//                                     </td> */}
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>PAN NO</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={panNo}
//                                             label="PAN NO"
//                                             onChange={(e) => setPanNo(e.target.value)}
//                                             size='small'
//                                             disabled={true}
//                                             required
//                                         />
//                                     </td>
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={gstNo}
//                                             label="GST NO"
//                                             onChange={(e) => setGSTNo(e.target.value)}
//                                             size='small'
//                                             disabled={true}
//                                             required
//                                         />
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>GST NO</th> */}
//                                     {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={gstNo}
//                                             label="GST NO"
//                                             onChange={(e) => setGSTNo(e.target.value)}
//                                             size='small'
//                                             disabled={true}
//                                         />
//                                     </td> */}
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Type Of Goods</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <FormControl fullWidth>
//                                             <InputLabel id="demo-simple-select-label">Type Of Goods</InputLabel>
//                                             <Select
//                                                 labelId="demo-simple-select-label"
//                                                 id="demo-simple-select"
//                                                 value={typeOfGoods}
//                                                 label="Type Of Goods"
//                                                 required
//                                                 size='small'
//                                                 onChange={(e) => setTypeOfGoods(e.target.value)}
//                                                 disabled={isView ? true : false}                                                            >
//                                                 <MenuItem value={'inputs'}>Inputs</MenuItem>
//                                                 <MenuItem value={'Capital'}>Capital Goods</MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                     </td>
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={docType}
//                                             label="Doc Type"
//                                             onChange={(e) => setDocType(e.target.value)}
//                                             size='small'
//                                             // required
//                                             disabled={isView ? true : false} />
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Doc Type</th> */}
//                                     {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={docType}
//                                             label="Doc Type"
//                                             onChange={(e) => setDocType(e.target.value)}
//                                             size='small'
//                                             disabled={isView ? true : false} />
//                                     </td> */}
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Sub Supply Type</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <FormControl fullWidth>
//                                             <InputLabel id="demo-simple-select-label">Sub Supply Type</InputLabel>
//                                             <Select
//                                                 labelId="demo-simple-select-label"
//                                                 id="demo-simple-select"
//                                                 value={subSupplyType}
//                                                 label="Sub Supply Type"
//                                                 required
//                                                 size="small"
//                                                 onChange={(e) => {
//                                                     const value = e.target.value;
//                                                     setSubSupplyType(value);
//                                                     setSubSupplyDesc(value);
//                                                 }}
//                                                 disabled={isView}
//                                             >
//                                                 <MenuItem value={"4"}>Jobwork</MenuItem>
//                                                 <MenuItem value={"8"}>others</MenuItem>
//                                                 <MenuItem value={"5"}>For Own Use</MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                     </td>

//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={subSupplyDesc}
//                                             onChange={(e) => setSubSupplyDesc(e.target.value)}
//                                             label="Sub Supply Desc"
//                                             size="small"
//                                             required={subSupplyType === "8" || subSupplyType === "5"}
//                                             disabled={isView || subSupplyType === "4"}
//                                         />
//                                     </td>


//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Sub Supply Desc</th> */}
//                                     {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={subSupplyDesc}
//                                             onChange={(e) => setSubSupplyDesc(e.target.value)}
//                                             label="Sub Supply Desc"
//                                             size='small'
//                                             disabled={isView ? true : false} />
//                                     </td> */}
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Transaction Type</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <FormControl fullWidth>
//                                             <InputLabel id="demo-simple-select-label">Transaction Type</InputLabel>
//                                             <Select
//                                                 labelId="demo-simple-select-label"
//                                                 id="demo-simple-select"
//                                                 value={transactionType}
//                                                 size='small'
//                                                 label="Transaction Type"
//                                                 required
//                                                 onChange={(e) => setTransactionType(e.target.value)}
//                                                 disabled={isView ? true : false}                                                            >
//                                                 <MenuItem value={'1'}>Regular</MenuItem>
//                                                 <MenuItem value={'2'}>Bill to Ship To</MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                     </td>
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <FormControl fullWidth>
//                                             <InputLabel id="demo-simple-select-label">Mode of Type</InputLabel>
//                                             <Select
//                                                 labelId="demo-simple-select-label"
//                                                 id="demo-simple-select"
//                                                 value={modeOfType}
//                                                 size='small'
//                                                 label="Mode of Type"
//                                                 required
//                                                 onChange={(e) => setModeOfType(e.target.value)}
//                                                 disabled={isView ? true : false}                                                            >
//                                                 <MenuItem value={'1'}>Road</MenuItem>
//                                                 <MenuItem value={'2'}>Rail</MenuItem>
//                                                 <MenuItem value={'3'}>Air</MenuItem>
//                                                 <MenuItem value={'4'}>Ship</MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Mode of Type</th> */}
//                                     {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <FormControl fullWidth>
//                                             <InputLabel id="demo-simple-select-label">Mode of Type</InputLabel>
//                                             <Select
//                                                 labelId="demo-simple-select-label"
//                                                 id="demo-simple-select"
//                                                 value={modeOfType}
//                                                 size='small'
//                                                 label="Mode of Type"
//                                                 onChange={(e) => setModeOfType(e.target.value)}
//                                                 disabled={isView ? true : false}                                                            >
//                                                 <MenuItem value={'ROAD'}>Road</MenuItem>
//                                                 <MenuItem value={'RAIL'}>Rail</MenuItem>
//                                                 <MenuItem value={'AIR'}>Air</MenuItem>
//                                                 <MenuItem value={'SHIP'}>Ship</MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                     </td> */}
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Docket No</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={docketNo}
//                                             label="Docket No"
//                                             onChange={(e) => setDocketNo(e.target.value)}
//                                             size='small'
//                                             required
//                                             disabled={isView ? true : false} />
//                                     </td>
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             type='date'
//                                             value={formatDate(transportDate)}
//                                             label="Transport Date"
//                                             onChange={(e) => setTransportDate(e.target.value)}
//                                             size='small'
//                                             required
//                                             disabled={isView ? true : false} />
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Transport Date</th> */}
//                                     {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             type='date'
//                                             value={formatDate(transportDate)}
//                                             label="Transport Date"
//                                             onChange={(e) => setTransportDate(e.target.value)}
//                                             size='small'
//                                             disabled={isView ? true : false} />
//                                     </td> */}
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Transport MST</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={transportMst}
//                                             label="Transport MST"
//                                             onChange={(e) => setTransportMst(e.target.value)}
//                                             size='small'
//                                             required
//                                             disabled={isView ? true : false} />
//                                     </td>
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={transportGSTIN}
//                                             label="Transport GSTIN"
//                                             onChange={(e) => setTransportGSTIN(e.target.value)}
//                                             size='small'
//                                             disabled={isView ? true : false} />
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Transport GSTIN</th> */}
//                                     {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={transportGSTIN}
//                                             label="Transport GSTIN"
//                                             onChange={(e) => setTransportGSTIN(e.target.value)}
//                                             size='small'
//                                             disabled={isView ? true : false} />
//                                     </td> */}
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Distance KMS</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={distanceKMS}
//                                             label="Distance KMS"
//                                             onChange={(e) => setDistanceKMS(e.target.value)}
//                                             size='small'
//                                             required
//                                             disabled={isView ? true : false} />
//                                     </td>
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={shippingPinCode}
//                                             onChange={(e) => setShippingPinCode(e.target.value)}
//                                             size='small'
//                                             required
//                                             label="Shipping Pincode"
//                                             disabled={isView ? true : false} />
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Shipping Pincode</th> */}
//                                     {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={shippingPinCode}
//                                             onChange={(e) => setShippingPinCode(e.target.value)}
//                                             size='small'
//                                             label="Shipping Pincode"
//                                             disabled={isView ? true : false} />
//                                     </td> */}
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>To State Code</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={toStateCode}
//                                             onChange={(e) => setToStateCode(e.target.value)}
//                                             label="To State Code"
//                                             size='small'
//                                             required
//                                             disabled={isView ? true : false} />
//                                     </td>
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={actualToState}
//                                             onChange={(e) => setActualToState(e.target.value)}
//                                             label="Actual To State"
//                                             size='small'
//                                             required
//                                             disabled={isView ? true : false} />
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Actual To State</th> */}
//                                     {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             value={actualToState}
//                                             onChange={(e) => setActualToState(e.target.value)}
//                                             label="Actual To State"
//                                             size='small'
//                                             disabled={isView ? true : false} />
//                                     </td> */}
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Stock Affect</th> */}
//                                     {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <FormControl fullWidth>
//                                             <InputLabel id="demo-simple-select-label">Stock Affect</InputLabel>
//                                             <Select
//                                                 labelId="demo-simple-select-label"
//                                                 id="demo-simple-select"
//                                                 value={stockAffect}
//                                                 onChange={(e) => setStockAffect(e.target.value)}
//                                                 size='small'
//                                                 label="Stock Affect"
//                                                 required
//                                                 disabled={isView ? true : false}                                                            >
//                                                 <MenuItem value={'Y'}>Y</MenuItem>
//                                                 <MenuItem value={'N'}>N</MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                     </td> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <FormControl fullWidth>
//                                             <InputLabel id="demo-simple-select-label">Eway Bill Required</InputLabel>
//                                             <Select
//                                                 labelId="demo-simple-select-label"
//                                                 id="demo-simple-select"
//                                                 value={ewayBillRequired}
//                                                 label="Eway Bill Required"
//                                                 onChange={(e) => setEwayBillRequired(e.target.value)}
//                                                 size='small'
//                                                 required={actualToState !== '29' || (actualToState === '29' && Number(totalValue) > 50000)}
//                                                 disabled={isView ? true : false}                                                            >
//                                                 <MenuItem value={'Y'}>Y</MenuItem>
//                                                 <MenuItem value={'N'}>N</MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Eway Bill Required</th> */}
//                                     {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <FormControl fullWidth>
//                                             <InputLabel id="demo-simple-select-label">Eway Bill Required</InputLabel>
//                                             <Select
//                                                 labelId="demo-simple-select-label"
//                                                 id="demo-simple-select"
//                                                 value={ewayBillRequired}
//                                                 label="Eway Bill Required"
//                                                 onChange={(e) => setEwayBillRequired(e.target.value)}
//                                                 size='small'
//                                                 disabled={isView ? true : false}                                                            >
//                                                 <MenuItem value={'Y'}>Y</MenuItem>
//                                                 <MenuItem value={'N'}>N</MenuItem>
//                                             </Select>
//                                         </FormControl>
//                                     </td> */}
//                                 </tr>
//                             </tbody>
//                         </table>
//                         <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
//                             <thead>
//                                 <tr>
//                                     <th colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#6895D2', color: '#ffffff' }}>TOTAL</th>
//                                 </tr>
//                                 {/* <tr>
//                                     <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Field</th>
//                                     <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Value</th>
//                                 </tr> */}
//                             </thead>
//                             <tbody>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Total Qty</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             size='small'
//                                             value={totalQuantity}
//                                             label="Total Qty"
//                                             required
//                                             disabled={isView ? true : false} />
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Gross Amt</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         <TextField
//                                             fullWidth
//                                             size='small'
//                                             value={totalGrossAmount}
//                                             label="Gross Amt"
//                                             required
//                                             disabled={isView ? true : false} />
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>CGST</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', flexDirection: 'row' }}>
//                                         <TextField
//                                             fullWidth
//                                             size='small'
//                                             value={cgstPercent}
//                                             required
//                                             placeholder='%'
//                                             onChange={(e) => setCGSTPercent(e.target.value)}
//                                             style={{ marginRight: '5px' }}
//                                             disabled={isView ? true : false} />
//                                         <TextField
//                                             fullWidth
//                                             size='small'
//                                             required
//                                             value={cgst}
//                                             disabled={isView ? true : false}
//                                             label="CGST"
//                                         />
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>SGST</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', flexDirection: 'row' }}>
//                                         <TextField
//                                             fullWidth
//                                             size='small'
//                                             value={sgstPercent}
//                                             placeholder='%'
//                                             required
//                                             onChange={(e) => setSGSTPercent(e.target.value)}
//                                             style={{ marginRight: '5px' }}
//                                             disabled={isView ? true : false} />
//                                         <TextField
//                                             fullWidth
//                                             size='small'
//                                             value={sgst}
//                                             disabled={isView ? true : false}
//                                             label="SGST"
//                                         />
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>IGST</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', flexDirection: 'row' }}>
//                                         <TextField
//                                             fullWidth
//                                             size='small'
//                                             value={igstPercent}
//                                             placeholder='%'
//                                             required
//                                             onChange={(e) => setIGSTPercent(e.target.value)}
//                                             style={{ marginRight: '5px' }}
//                                             disabled={isView ? true : false} />
//                                         <TextField
//                                             fullWidth
//                                             size='small'
//                                             value={igst}
//                                             disabled={isView ? true : false}
//                                             label="IGST"
//                                         />
//                                     </td>
//                                 </tr>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Total Value</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', flexDirection: 'row' }}>
//                                         <TextField
//                                             fullWidth
//                                             size='small'
//                                             value={totalValue}
//                                             required
//                                             label="Total Value"
//                                             disabled={isView ? true : false} />
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                         <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
//                             <thead>
//                                 <tr>
//                                     <th colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#6895D2', color: '#ffffff' }}>REMARKS</th>
//                                 </tr>
//                                 {/* <tr>
//                                     <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Field</th>
//                                     <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Value</th>
//                                 </tr> */}
//                             </thead>
//                             <tbody>
//                                 <tr style={{ borderBottom: '1px solid #ddd' }}>
//                                     {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Remarks</th> */}
//                                     <td style={{ border: '1px solid #ddd', padding: '8px' }}>
//                                         {/* <FormControl fullWidth>
//                                             <InputLabel id="demo-simple-select-label">Remarks</InputLabel>
//                                             <Select
//                                                 labelId="demo-simple-select-label"
//                                                 id="demo-simple-select"
//                                                 value={remarks}
//                                                 size='small'
//                                                 label="Remarks"
//                                                 required
//                                                 onChange={(e) => setRemarks(e.target.value)}
//                                                 renderValue={(selected) => (
//                                                     <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                                                         {selected.length > 25 ? `${selected.substring(0, 35)}...` : selected}
//                                                     </div>
//                                                 )}
//                                                 disabled={isView ? true : false}                                                            >
//                                                 {remarksLists.map((item) => (
//                                                     <MenuItem key={item} value={item}>
//                                                         {item}
//                                                     </MenuItem>
//                                                 ))}
//                                             </Select>
//                                         </FormControl> */}
//                                         {isView ?
//                                             <TextField
//                                                 fullWidth
//                                                 required
//                                                 value={remarks}
//                                                 size='small'
//                                                 disabled={isView ? true : false}
//                                             /> :
//                                             // <Autocomplete
//                                             //     disablePortal
//                                             //     id="combo-box-demo"
//                                             //     options={remarksAllLists}
//                                             //     sx={{ width: '100%' }}
//                                             //     getOptionLabel={(option) => option.label || ''}
//                                             //     renderInput={(params) => <TextField {...params} label={remarks} /*onChange={(e) => setRemarks(e.target.value)}*/ onChange={(e) => handlePOChange(e)} />}
//                                             //     onChange={(event, value) => handleSpeclInstr1Change(value)}
//                                             //     size='small'
//                                             //     disabled={isView ? true : false}
//                                             // />
//                                             <Autocomplete
//                                                 disablePortal
//                                                 id="combo-box-demo"
//                                                 options={remarksAllLists}
//                                                 value={remarks}
//                                                 sx={{ width: '100%' }}
//                                                 getOptionLabel={(option) => option?.label || remarks}
//                                                 renderInput={(params) => (
//                                                     <TextField
//                                                         {...params}
//                                                         label={remarks}
//                                                         onChange={(e) => handlePOChange(e)}
//                                                     />
//                                                 )}
//                                                 onChange={(event, value) => {
//                                                     if (!value) {
//                                                         setRemarks(""); // Clear state when cleared
//                                                     } else {
//                                                         handleSpeclInstr1Change(value);
//                                                     }
//                                                 }}
//                                                 size="small"
//                                                 disabled={isView}
//                                             />
//                                         }
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </DialogContent>

//                     <DialogActions>
//                         <Button onClick={handleCloseModal}>Close</Button>
//                     </DialogActions>
//                 </Dialog>
//                 {/* /////////////////////////////////////////END\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}

//             </form>
//             <ChangeAddressModal
//                 changeAddressModalOpen={changeAddressModalOpen}
//                 setChangeAddressModalOpen={setChangeAddressModalOpen}
//                 setSuppAddress={setSuppAddress}
//                 supplierSid={supplierSid}
//             />
//             <NotificationBar
//                 handleClose={handleClose}
//                 notificationContent={openNotification.message}
//                 openNotification={openNotification.status}
//                 type={openNotification.type}
//             />

//             <LoadPendingSfg
//                 setLoadPendingSfg={setLoadPendingSfg}
//                 loadPendingSfg={loadPendingSfg}
//                 setSelectedItems={setSelectedItems}
//                 supplierSid={supplierSid}
//                 selectedType={selectedType}
//             />
//             <DeleteConfirmationDailog
//                 open={deleteDailogOpen}
//                 setOpen={setDeleteDailogOpen}
//                 deleteId={mainId}
//                 // selectedMaster={selectedMaster}
//                 deleteService={JobWorkDelete}
//                 handleSuccess={deletehandleSuccess}
//                 handleException={deletehandleException}
//             />
//             {/* <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
//                 <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>DELIVERY CHALLAN</DialogTitle>

//                 <DialogContent style={{ padding: '2px' }}>
//                     {pdfUrl &&
//                         <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
//                     }
//                 </DialogContent>

//                 <DialogActions>
//                     <Button onClick={() => setPdfModalOpen(false)}>Close</Button>
//                 </DialogActions>
//             </Dialog> */}
//             <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
//                 <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                     DELIVERY CHALLAN
//                 </DialogTitle>

//                 <DialogContent style={{ padding: '2px' }}>
//                     {mergedPdfUrl && (
//                         <embed src={mergedPdfUrl} type="application/pdf" width="100%" height="600px" />
//                     )}
//                 </DialogContent>

//                 <DialogActions>
//                     <Button onClick={() => {
//                         setPdfModalOpen(false);
//                         setMergedPdfUrl(null);
//                         setPdfBlobs([]);
//                     }}
//                     >Close</Button>
//                 </DialogActions>
//             </Dialog>
//         </div >
//     )
// }

// export default JobWorkIssueModal

import React, { useEffect, useState, useRef } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { CheckBox } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from '@mui/material/Autocomplete';
import ChangeAddressModal from './ChangeAddressModal/ChangeAddressModal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoadPendingSfg from './LoadPendingSfg/LoadPendingSfg';
import {
    poApproval,
    GetJobWorkIssueUniqueID,
    GetJobWorkIssueSupplierItemList,
    GenerateJobWorkIssueDC,
    GetDelNoteDetails,
    GetWithoutPoSuppList,
    UpdateJobWorkIssueDC,
    GetDelNoteForwardReverse,
    GetJobWorkIssueDCCopy,
    GetJobWorkIssueDCJson,
    GetGeneratedJW,
    GetRemarksLists,
    GetWithoutPoItemLists,
    GetJobWorkIssueItemLists,
    ItemSearchNAAJ,
    GetJobWorkIssueItemDetails,
    JobWorkDelete,
} from '../../ApiService/LoginPageService'
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment, setRef,
    Popper,
    CircularProgress,
    IconButton,
} from '@mui/material';
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ApplicationStore from '../../Utility/localStorageUtil';
import { PDFDocument } from 'pdf-lib';
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import RefreshIcon from "@mui/icons-material/Refresh";
import { useModuleLocks } from '../context/ModuleLockContext';


const JobWorkIssueModal = ({ editeData }) => {

    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter(
        (data) => data?.menu?.toLowerCase() === "viewjobworkissue"
    );
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Job Work Issue DC")?.lockStatus === "locked";

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const navigate = useNavigate();
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [supplierList, setSupplierList] = useState([])
    const [supplierName, setSupplierName] = useState('')
    const [selectedItems, setSelectedItems] = useState([{ id: 'RDL1' }]);
    const [suppAddress, setSuppAddress] = useState('');
    const [currency, setCurrency] = useState('');
    const [currencyId, setCurrencyId] = useState('');
    const [department, setDepartment] = useState('');
    const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
    const [supplierSid, setSupplierSid] = useState('')
    const [totalQuantity, setTotalQuantity] = useState('');
    const [totalGrossAmount, setTotalGrossAmount] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [DCNumber, setDCNumber] = useState('');
    const [jobworkid, setjobWorkId] = useState('');
    console.log("jobworkid", jobworkid)
    const [sequentialNumber, setSequentialNumber] = useState('');
    const [challanNo, setChallanNo] = useState('');
    const [challanDate, setChallanDate] = useState('');
    const [modeOfTransport, setModeOfTransport] = useState('');
    const [vehicleNo, setVehicleNo] = useState('');
    const [consigneeName, setConsigneeName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [address3, setAddress3] = useState('');
    const [address4, setAddress4] = useState('');
    const [panNo, setPanNo] = useState('');
    const [gstNo, setGSTNo] = useState('');
    const [typeOfGoods, setTypeOfGoods] = useState('inputs');
    const [docType, setDocType] = useState('CHL');
    const [subSupplyType, setSubSupplyType] = useState('');
    const [subSupplyDesc, setSubSupplyDesc] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [modeOfType, setModeOfType] = useState('');
    const [docketNo, setDocketNo] = useState('');
    const [transportDate, setTransportDate] = useState('');
    const [transportMst, setTransportMst] = useState('');
    const [transportGSTIN, setTransportGSTIN] = useState('');
    const [distanceKMS, setDistanceKMS] = useState('');
    const [shippingPinCode, setShippingPinCode] = useState('');
    const [toStateCode, setToStateCode] = useState('');
    const [actualToState, setActualToState] = useState('');
    const [stockAffect, setStockAffect] = useState('');
    const [ewayBillRequired, setEwayBillRequired] = useState('');
    const [cgst, setCGST] = useState('');
    const [cgstPercent, setCGSTPercent] = useState('');
    const [sgst, setSGST] = useState('');
    const [sgstPercent, setSGSTPercent] = useState('');
    const [igst, setIGST] = useState('');
    const [igstPercent, setIGSTPercent] = useState('');
    const [totalValue, setTotalValue] = useState('');
    const [remarks, setRemarks] = useState('');
    const [suppId, setSuppId] = useState('');
    const [loadPendingSfg, setLoadPendingSfg] = useState(false);
    const [supplierSelect, setSupplierSelect] = useState('');
    const location = useLocation();
    const [isEditable, setIsEditable] = useState(false);
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [preViewItemList, setPreviewItemLists] = useState([]);
    const [viewMoreModal, setViewMoreModal] = useState(false);
    const [generatedJwLists, setGeneratedJWLists] = useState([]);
    const [remarksAllLists, setRemarksAllLists] = useState([]);
    const [selectedType, setSelectedType] = useState('General');
    const [supplierItemList, setSupplierItemList] = useState([]);
    const [pdfBlobs, setPdfBlobs] = useState([]);
    const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    //JOB WORK ISSUE ROUTE HANDLER
    const viewDC = new URLSearchParams(location.search).get('viewDC');
    const delRowId = new URLSearchParams(location.search).get('delRowId');

    // DC VIEW FROM RESULT PAGE
    // const isView = new URLSearchParams(location.search).get('isView');
    const jcRowId = new URLSearchParams(location.search).get('jcRowId');

    // NEW ENTRY
    const newEntry = new URLSearchParams(location.search).get('newEntry');

    const [isView, setIsView] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mainId, setMainId] = useState('');
    const [selectedJwNo, setSelectedJwNo] = useState('');

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
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
        newEntry === 'true' && setIsEditable(true);
        // !viewDC && GetJobWorkIssueUniqueID(handleUniqueCodeSuccess, handleUniqueCodeException);
        // if (!viewDC || !isView) {
        //     GetRemarks(handleUniqueCodeSuccess, handleUniqueCodeException);
        // }
        if (isView) {
            setIsEditable(false)
            GetDelNoteDetails({ id: jcRowId }, handleDelNoteDetailsSuccess, handleDelNoteDetailsException)
        }

        delRowId && GetDelNoteDetails({ id: delRowId }, handleDelNoteDetailsSuccess, handleDelNoteDetailsException);

        handleForwardReverse('last', '');

    }, [viewDC]);

    //UNIQUE CODE API HANDLER
    const handleUniqueCodeSuccess = (dataObject) => {
        setDCNumber(dataObject?.data?.dcNo);
        setSequentialNumber(dataObject?.data?.sequentialNumber);
    }
    const handleUniqueCodeException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    //DEL_NOTE DETAILS API HANDLER
    const handleDelNoteDetailsSuccess = (dataObject) => {
        //SUPPLIER LIST
        setSuppAddress(dataObject?.supplier?.spAddress || '');
        setCurrency(dataObject?.supplier?.currency || '');
        setCurrencyId(dataObject?.supplier?.currencyId || '');
        setSupplierName(dataObject?.supplier?.spName || '');
        setDepartment(dataObject?.supplier?.department || '');
        setSupplierSid(dataObject?.supplier?.sId || '');
        setSuppId(dataObject?.supplier?.id || '');
        setGSTNo(dataObject?.supplier?.gstNo || '');
        setPanNo(dataObject?.supplier?.panNo || '');
        setSupplierSelect(dataObject?.supplier?.spName || '');
        // Jobwork Details
        setDCNumber(dataObject?.jobWork?.dcNo || '')
        setjobWorkId(dataObject?.jobWork?.id || '')
        setSequentialNumber(dataObject?.jobWork?.sequentialNumber || '')
        setChallanNo(dataObject?.jobWork?.challanNo || '')
        setChallanDate(dataObject?.jobWork?.challanDate || '')
        setModeOfTransport(dataObject?.jobWork?.modeOfTransport || '')
        setVehicleNo(dataObject?.jobWork?.vehicleNo || '')
        setConsigneeName(dataObject?.jobWork?.consigneeName || '')
        setTypeOfGoods(dataObject?.jobWork?.typeOfGoods || '')
        // setDocType(dataObject?.jobWork?.docType || '')
        setSubSupplyType(dataObject?.jobWork?.subSupplyType || '')
        setSubSupplyDesc(dataObject?.jobWork?.subSupplyDesc || '')
        setTransactionType(dataObject?.jobWork?.transactionType || '')
        setModeOfType(dataObject?.jobWork?.modeOfType || '')
        setDocketNo(dataObject?.jobWork?.docketNo || '')
        setTransportDate(dataObject?.jobWork?.transportDate || '')
        setTransportMst(dataObject?.jobWork?.transportMst || '')
        setTransportGSTIN(dataObject?.jobWork?.transportGSTIN || '')
        setDistanceKMS(dataObject?.jobWork?.distanceKMS || '')
        setShippingPinCode(dataObject?.jobWork?.shippingPinCode || '')
        setToStateCode(dataObject?.jobWork?.toStateCode || '')
        setActualToState(dataObject?.jobWork?.actualToState || '')
        setStockAffect(dataObject?.jobWork?.stockAffect || '')
        setEwayBillRequired(dataObject?.jobWork?.ewayBillReq || '')
        setTotalQuantity(dataObject?.jobWork?.totalQty || '')
        setTotalGrossAmount(dataObject?.jobWork?.totalGrossAmt || '')
        setCGSTPercent(dataObject?.jobWork?.cgstPercent || '')
        setCGST(dataObject?.jobWork?.cgst || '')
        setSGSTPercent(dataObject?.jobWork?.sgstPercent || '')
        setSGST(dataObject?.jobWork?.sgst || '')
        setIGSTPercent(dataObject?.jobWork?.igstPercent || '')
        setIGST(dataObject?.jobWork?.igst || '')
        setTotalValue(dataObject?.jobWork?.totalValue || '')
        setRemarks(dataObject?.jobWork?.remarks || '')
        setSelectedDate(dataObject?.jobWork?.created_at || '')
        //ITEMLIST
        setVehicleNo(dataObject?.itemsList[0]?.vehicleNo || '')
        setSelectedItems(dataObject.itemsList || []);
    }

    const handleDelNoteDetailsException = () => { }

    const ClearData = () => {
        setSupplierSid('');
        setChallanNo('');
        setChallanDate('');
        setModeOfTransport('');
        setVehicleNo('');
        setConsigneeName('');
        setSuppAddress('');
        setPanNo('');
        setGSTNo('');
        setTypeOfGoods('inputs');
        // setDocType('');
        setSubSupplyType('');
        setSubSupplyDesc('');
        setTransactionType('');
        setModeOfType('');
        setDocketNo('');
        setTransportDate('');
        setTransportMst('');
        setTransportGSTIN('');
        setDistanceKMS('');
        setShippingPinCode('');
        setToStateCode('');
        setActualToState('');
        setStockAffect('');
        setEwayBillRequired('');
        setTotalQuantity('');
        setTotalGrossAmount('');
        setCGSTPercent('');
        setCGST('');
        setSGSTPercent('');
        setSGST('');
        setIGSTPercent('');
        setIGST('');
        setTotalValue('');
        setRemarks('');
        setSelectedItems([{ id: 'RDL1' }]);
        setSelectedType('General');
        setMainId('');

        // setTimeout(() => {
        GetJobWorkIssueUniqueID(handleUniqueCodeSuccess, handleUniqueCodeException);
        // }, 2000);
    }

    const handleSubmit = (e) => {
        // selectedItems
        const filteredItems = selectedItems.filter(item => item.id !== 'RDL1');
        console.log("qqqqqqqqqqqqqqqqqqq")
        e.preventDefault();
        const commonData = {
            ...(isEditable && { id: jcRowId }),
            dcNo: DCNumber,
            id: mainId,
            sequentialNumber: sequentialNumber,
            delScheduleId: delRowId,
            supplierId: supplierSid,
            suppAddress: suppAddress,
            challanNo: challanNo,
            challanDate: challanDate,
            modeOfTransport: modeOfTransport,
            vehicleNo: vehicleNo,
            consigneeName: consigneeName,
            address: address1,
            panNo: panNo,
            gstNo: gstNo,
            typeOfGoods: typeOfGoods,
            docType: docType,
            subSupplyType: subSupplyType,
            subSupplyDesc: subSupplyDesc,
            transactionType: transactionType,
            modeOfType: modeOfType,
            docketNo: docketNo,
            transportDate: transportDate,
            transportMst: transportMst,
            transportGSTIN: transportGSTIN,
            distanceKMS: distanceKMS,
            shippingPinCode: shippingPinCode,
            toStateCode: toStateCode,
            actualToState: actualToState,
            stockAffect: stockAffect,
            ewayBillReq: ewayBillRequired,
            totalQty: totalQuantity,
            totalGrossAmt: totalGrossAmount,
            cgstPercent: cgstPercent,
            cgst: cgst,
            sgstPercent: sgstPercent,
            sgst: sgst,
            igstPercent: igstPercent,
            igst: igst,
            totalValue: totalValue,
            remarks: remarks,
            dcType: selectedType
        }
        if (isEdit) {
            console.log("eeeeeeeeeeeeeeeeeeeeeeeee")
            // if (modeOfTransport && vehicleNo && consigneeName && typeOfGoods && docType && subSupplyType && transactionType && modeOfType && docketNo && transportDate && transportMst && transportGSTIN && distanceKMS && shippingPinCode && toStateCode && actualToState && stockAffect && ewayBillRequired) {
            //     if (subSupplyType === '8' || subSupplyType === '5') {
            //         console.log("lllllllllllllllllllllllllllll")
            //         if (subSupplyDesc === '') {
            //             setNotification({
            //                 status: true,
            //                 type: 'error',
            //                 message: 'Please Enter Sub Supply Desc',
            //             });
            //         }
            //     } else if (actualToState !== '29' || (actualToState === '29' && Number(totalValue) > 50000)) {
            //         if (ewayBillRequired === 'N') {
            //             setNotification({
            //                 status: true,
            //                 type: 'error',
            //                 message: 'E-way Bill Is Mandetory',
            //             });
            //         }
            //     } else {
            //         UpdateJobWorkIssueDC({ itemsList: selectedItems, jobWork: commonData }, handleSuccess, handleException);
            //     }
            // } else {
            //     setNotification({
            //         status: true,
            //         type: 'error',
            //         message: 'Please fill the required fields',
            //     });
            // }
            if (!modeOfTransport || !vehicleNo || !typeOfGoods ||/* !docType ||*/
                !transactionType || !remarks  /*!docketNo || */ /* !transportMst ||*/
            ) {

                console.log("Missing required fields!");
                setNotification({
                    status: true,
                    type: 'error',
                    message: 'Please fill the required fields',
                });
                return;
            }

            console.log("All required fields are present.");

            // Check subSupplyType condition
            if (subSupplyType === '8' || subSupplyType === '5') {
                console.log("Checking subSupplyType condition...");
                if (!subSupplyDesc || subSupplyDesc.trim() === '') {
                    console.log("Missing subSupplyDesc");
                    setNotification({
                        status: true,
                        type: 'error',
                        message: 'Please Enter Sub Supply Desc',
                    });
                    return;
                }
            }

            // Check E-way bill condition
            if (actualToState !== '29' || (actualToState === '29' && Number(totalValue) > 50000)) {
                console.log("Checking actualToState and totalValue condition...");
                if (ewayBillRequired === 'N') {
                    console.log("E-way bill required but not provided.");
                    setNotification({
                        status: true,
                        type: 'error',
                        message: 'E-way Bill Is Mandatory',
                    });
                    return;
                }
            }

            // If all conditions are met, call the API
            console.log("Calling API: UpdateJobWorkIssueDC...");
            try {
                setLoading(true);
                UpdateJobWorkIssueDC(
                    { itemsList: filteredItems, jobWork: commonData },
                    handleSuccess,
                    handleException
                );
            } catch (error) {
                console.error("API call failed:", error);
                setNotification({
                    status: true,
                    type: 'error',
                    message: 'Failed to update job work issue DC.',
                });
            }
        } else {
            console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")
            // if (modeOfTransport && vehicleNo && consigneeName && typeOfGoods && docType && subSupplyType && transactionType && modeOfType && docketNo && transportDate && transportMst && transportGSTIN && distanceKMS && shippingPinCode && toStateCode && actualToState && stockAffect && ewayBillRequired) {
            //     console.log("ppppppppppppppppppppppppppppppppppp")
            //     if (subSupplyType === '8' || subSupplyType === '5') {
            //         console.log("mmmmmmmmmmmmmmmmmmmmmmmmm")
            //         if (subSupplyDesc === '') {
            //             console.log("ggggggggggggg")
            //             setNotification({
            //                 status: true,
            //                 type: 'error',
            //                 message: 'Please Enter Sub Supply Desc',
            //             });
            //         }
            //     } else if (actualToState !== '29' || (actualToState === '29' && Number(totalValue) > 50000)) {
            //         console.log("ooooooooooooooooooooooo")
            //         if (ewayBillRequired === 'N') {
            //             console.log("ddddddddddddddddd")
            //             setNotification({
            //                 status: true,
            //                 type: 'error',
            //                 message: 'E-way Bill Is Mandetory',
            //             });
            //         }
            //     } else {
            //         console.log("xxxxxxxxxxxxxxx")
            //         GenerateJobWorkIssueDC({ itemsList: selectedItems, jobWork: commonData }, handleSuccess, handleException);
            //     }
            // } else {
            //     console.log("aaaaaaaaaaaaaaaaa")
            //     setNotification({
            //         status: true,
            //         type: 'error',
            //         message: 'Please fill the required fields',
            //     });
            // }
            if (!modeOfTransport || !vehicleNo || !typeOfGoods ||/* !docType ||*/
                !transactionType || !remarks  /*!docketNo || */ /* !transportMst ||*/
            ) {

                console.log("Missing required fields!");
                setNotification({
                    status: true,
                    type: 'error',
                    message: 'Please fill the required fields',
                });
                return;
            }

            console.log("All required fields are present.");

            // Check subSupplyType condition
            if (subSupplyType === '8' || subSupplyType === '5') {
                console.log("Checking subSupplyType condition...");
                if (!subSupplyDesc || subSupplyDesc.trim() === '') {
                    console.log("Missing subSupplyDesc");
                    setNotification({
                        status: true,
                        type: 'error',
                        message: 'Please Enter Sub Supply Desc',
                    });
                    return;
                }
            }

            // Check E-way bill condition
            if (actualToState !== '29' || (actualToState === '29' && Number(totalValue) > 50000)) {
                console.log("Checking actualToState and totalValue condition...");
                if (ewayBillRequired === 'N') {
                    console.log("E-way bill required but not provided.");
                    setNotification({
                        status: true,
                        type: 'error',
                        message: 'E-way Bill Is Mandatory',
                    });
                    return;
                }
            }

            // If all conditions are met, call the API
            console.log("Calling API: GenerateJobWorkIssueDC...");
            try {
                setLoading(true);
                GenerateJobWorkIssueDC(
                    { itemsList: filteredItems, jobWork: commonData },
                    handleSuccess,
                    handleException
                );
            } catch (error) {
                console.error("API call failed:", error);
                setNotification({
                    status: true,
                    type: 'error',
                    message: 'Failed to generate job work issue DC.',
                });
            }
        }
    };

    const handleSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setLoading(false);
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        console.log("the error ", errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
            setLoading(false);
        }, 2000);
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    //MIDDLE GRID
    const middleGridColumns = [
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
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
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Name</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
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
            headerAlign: 'center'
        },
        {
            field: 'qoh',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>QOH</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'hsn',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>HSNCODE</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'jwQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Qty</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'suppDesc',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier Desc</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'rate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rate</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'location',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Location</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: true
        },
        {
            field: 'lot',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>LOT</span>,
            type: 'string',
            sortable: true,
            minWidth: 180,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false,
        },
        {
            field: 'amount',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Amt</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remark</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'grnNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>GRN INFO</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <DeleteData selectedRow={params.row} />,
            ],
        }, ,
    ];

    const handleDeleteRow = (id) => {
        const newArray = selectedItems.filter((item) => item.id != id)
        setSelectedItems(newArray);
        // TO MINUS THE AMOUNT IN TOTAL_GRID
        calculateTotals(newArray)
    }

    function DeleteData(props) {
        return (
            viewDC ?
                <DeleteIcon
                    style={{ color: '#dddddd' }}
                />
                :
                <DeleteIcon
                    onClick={() => {
                        handleDeleteRow(props.selectedRow.id)
                    }}
                    style={{ color: 'black' }}
                />
        );
    };

    //DATE CONVERT TO TEXTFIELD
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    //TOTAL CALCULATION
    const calculateTotals = (data) => {
        const totalQty = data.reduce((acc, item) => acc + (Number(item.jwQty) || 0), 0);
        console.log("totalQty", totalQty);
        setTotalQuantity(totalQty);
        const amt = data.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
        console.log("amt", amt);
        setTotalGrossAmount(amt);
        return [
            { id: 1, totalQty, amt }
        ];
    };

    useEffect(() => {
        calculateTotals(selectedItems)
    }, [selectedItems])

    // GST CALCULATTION
    useEffect(() => {
        var cgstAmount = (totalGrossAmount * cgstPercent) / 100;
        setCGST(cgstAmount);
        var sgstAmount = (totalGrossAmount * sgstPercent) / 100;
        setSGST(sgstAmount)
        var igstAmount = (totalGrossAmount * igstPercent) / 100;
        setIGST(igstAmount)
        let totalAmount = Number(totalGrossAmount) + Number(cgst) + Number(sgst) + Number(igst);
        setTotalValue(Math.round(totalAmount));
    }, [cgstPercent, sgstPercent, igstPercent, cgst, sgst, igst, totalValue, totalGrossAmount]);

    const remarksLists = [
        'APPROXIMATE WEIGHT & VALUE FOR WEIGHING AND RETURN WITHOUT E-WAY BILL LESS THAN 20KM',
        'FOR SIMULATION AND RETURN',
        'FOR STORAGE ONLY',
        'FOR ACID PICKLING AND RETURN',
        'FOR ANODIZING AND RETURN',
        'FOR ASSEMBLY TRAINING AND RETURN',
        'FOR BALANCEING AND RETURN',
        'FOR POWDER COATING AND RETURN',
        'FOR PRESSING AND RETURN',
        'FOR PRODUCTION PROCESS AND RETURN',
        'FOR PUNCHING AND RETURN',
        'FOR PUNCHING,BENDING AND RETURN',
        'FOR PUNCHING,BENDING,PROCESS AND RETURN',
    ]

    //GET SUPPLIER LIST
    const handleChange = (e) => {
        GetWithoutPoSuppList({ code: e.target.value }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
    }

    const handleItemVsProcessItemSucessShow = (dataObject) => {
        setSupplierList(dataObject?.data || []);
    }
    const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSupplierSearchItemChange = (value) => {
        if (value !== null) {
            setSuppAddress(value?.spAddress || '');
            setAddress1(value?.spAddress || '');
            setSupplierSid(value?.id || '');
            setGSTNo(value?.gstNo || '');
            setPanNo(value?.panNo || '');
            setSupplierSelect(value?.label);
            setConsigneeName(value?.label);
            setDistanceKMS(value?.distance || '');
            setShippingPinCode(value?.shippingPinCode || '');
            setToStateCode(value?.toStateCode || '');
            setActualToState(value?.actToState || '');
        }
    };

    // \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\NEW CODE//////////////////////////////////////////////////
    // HANDLE FORWARD REVERSE HANDLER
    const handleForwardReverse = (type, id) => {
        GetDelNoteForwardReverse({ type: type, id: id }, handleActionSuccess, handleActionException)
    }

    const handleActionSuccess = (dataObject) => {
        setIsView(true);
        //SUPPLIER LIST
        setSuppAddress(dataObject?.supplier?.spAddress || '');
        setCurrency(dataObject?.supplier?.currency || '');
        setCurrencyId(dataObject?.supplier?.currencyId || '');
        setSupplierName(dataObject?.supplier?.spName || '');
        setDepartment(dataObject?.supplier?.department || '');
        setSupplierSid(dataObject?.supplier?.sId || '');
        setSuppId(dataObject?.supplier?.id || '');
        setGSTNo(dataObject?.supplier?.gstNo || '');
        setPanNo(dataObject?.supplier?.panNo || '');
        setSupplierSelect(dataObject?.supplier?.spName || '');
        // Jobwork Details
        setMainId(dataObject?.jobWork?.id || '');
        setDCNumber(dataObject?.jobWork?.dcNo || '')
        setSequentialNumber(dataObject?.jobWork?.sequentialNumber || '')
        setChallanNo(dataObject?.jobWork?.challanNo || '')
        setChallanDate(dataObject?.jobWork?.challanDate || '')
        setModeOfTransport(dataObject?.jobWork?.modeOfTransport || '')
        setVehicleNo(dataObject?.jobWork?.vehicleNo || '')
        setConsigneeName(dataObject?.jobWork?.consigneeName || '')
        setSelectedType(dataObject?.jobWork?.dcType || '')
        setTypeOfGoods(dataObject?.jobWork?.typeOfGoods || '')
        // setDocType(dataObject?.jobWork?.docType || '')
        setSubSupplyType(dataObject?.jobWork?.subSupplyType || '')
        setSubSupplyDesc(dataObject?.jobWork?.subSupplyDesc || '')
        setTransactionType(dataObject?.jobWork?.transactionType || '')
        setModeOfType(dataObject?.jobWork?.modeOfType || '')
        setDocketNo(dataObject?.jobWork?.docketNo || '')
        setTransportDate(dataObject?.jobWork?.transportDate || '')
        setTransportMst(dataObject?.jobWork?.transportMst || '')
        setTransportGSTIN(dataObject?.jobWork?.transportGSTIN || '')
        setDistanceKMS(dataObject?.jobWork?.distanceKMS || '')
        setShippingPinCode(dataObject?.jobWork?.shippingPinCode || '')
        setToStateCode(dataObject?.jobWork?.toStateCode || '')
        setActualToState(dataObject?.jobWork?.actualToState || '')
        setStockAffect(dataObject?.jobWork?.stockAffect || '')
        setEwayBillRequired(dataObject?.jobWork?.ewayBillReq || '')
        setTotalQuantity(dataObject?.jobWork?.totalQty || '')
        setTotalGrossAmount(dataObject?.jobWork?.totalGrossAmt || '')
        setCGSTPercent(dataObject?.jobWork?.cgstPercent || '')
        setCGST(dataObject?.jobWork?.cgst || '')
        setSGSTPercent(dataObject?.jobWork?.sgstPercent || '')
        setSGST(dataObject?.jobWork?.sgst || '')
        setIGSTPercent(dataObject?.jobWork?.igstPercent || '')
        setIGST(dataObject?.jobWork?.igst || '')
        setTotalValue(dataObject?.jobWork?.totalValue || '')
        setRemarks(dataObject?.jobWork?.remarks || '')
        setSelectedDate(dataObject?.jobWork?.created_at || '')
        setAddress1(dataObject?.jobWork?.address || '')
        //ITEMLIST
        setVehicleNo(dataObject?.itemsList[0]?.vehicleNo || '')
        setSelectedItems(dataObject.itemsList || []);
        setPreviewItemLists(dataObject.itemsList || []);
    }
    const handleActionException = () => { }

    const handleClearPage = () => {
        setIsView(false);
        setIsEdit(false);
        setSelectedDate(new Date());
        setGeneratedJWLists([]);
        setSelectedJwNo('')
        setSupplierSid('');
        setSupplierSelect('');
        setChallanNo('');
        setChallanDate('');
        setModeOfTransport('');
        setVehicleNo('');
        setConsigneeName('');
        setSuppAddress('');
        setPanNo('');
        setGSTNo('');
        setTypeOfGoods('inputs');
        // setDocType('');
        setSubSupplyType('');
        setSubSupplyDesc('');
        setTransactionType('');
        setModeOfType('');
        setDocketNo('');
        setTransportDate('');
        setTransportMst('');
        setTransportGSTIN('');
        setDistanceKMS('');
        setShippingPinCode('');
        setToStateCode('');
        setActualToState('');
        setStockAffect('');
        setEwayBillRequired('');
        setTotalQuantity('');
        setTotalGrossAmount('');
        setCGSTPercent('');
        setCGST('');
        setSGSTPercent('');
        setSGST('');
        setIGSTPercent('');
        setIGST('');
        setTotalValue('');
        setRemarks('');
        setSelectedItems([{ id: 'RDL1' }]);
        setSelectedType('General');
        setMainId('')
        setAddress1('');

        // setTimeout(() => {
        GetJobWorkIssueUniqueID(handleUniqueCodeSuccess, handleUniqueCodeException);
        // }, 2000);
    }

    // INVOICE
    const getInvoiceData = (jobWorkId) => {
        GetJobWorkIssueDCCopy({ id: jobWorkId }, getInvoiceDataSuccess, getInvoiceDataExceptoin)
    }

    const invoiceHeader = [
        'ORIGINAL FOR CONSIGNEE',
        'DUPLICATE FOR TRANSPORTER',
        'TRIPLICATE FOR CONSIGNOR',
        'EXTRA COPY'
    ];

    const getInvoiceDataSuccess = (dataObject) => {
        const allBlobs = [];
        for (const headerName of invoiceHeader) {
            const blob = handleFileSave(dataObject, headerName);
            allBlobs.push(blob);
        }
        setPdfBlobs(allBlobs);
    }

    const getInvoiceDataExceptoin = (errorObject, errorMessage) => {
        console.log("error Msg", errorMessage);
    }

    // function emptyRowsToPush(lineItems) {
    //     const pageSize = 39, header = 17, footer = 8;
    //     const content = header + lineItems + footer;
    //     const totPage = Math.floor(content / pageSize) + 1;
    //     const totalContentSize = pageSize * totPage;
    //     const rowToPush = totalContentSize - content
    //     return rowToPush;
    // }
    function emptyRowsToPush(lineItems) {
        const pageSize = 39;   // max rows per page (depends on your layout)
        const header = 10;     // rows occupied by header
        const footer = 19;     // rows reserved for footer

        // Content rows = header + actual line items + footer
        const content = header + lineItems + footer;

        // Total pages needed
        const totPage = Math.floor(content / pageSize) + 1;

        // Capacity of all pages
        const totalContentSize = pageSize * totPage;

        // Rows we need to pad
        let rowToPush = totalContentSize - content;

        // 🔧 Always keep at least 4 dummy rows
        if (rowToPush < 4) {
            rowToPush = 4;
        }

        return rowToPush;
    }

    const handleFileSave = (item, headerName) => {
        let info = [];
        item.itemsList.forEach((element, index, array) => {
            // info.push([element.sNo, element.itemCode, element.itemName, element.jcNo, element.hsnName, element.uomName, element.Qty, element.rate, element.amount])
            info.push([
                element.sNo,
                element.jcNo,
                element.itemCode,    // Part Name
                element.itemName,    // Part Description
                element.hsnName,
                element.uomName,
                element.Qty,
                element.rate,
                element.amount
            ]);


        });

        // Ensure a minimum of 10 items
        // const minItems = 16;
        // const placeholderItem = [''];
        // while (info.length < minItems) {
        //     info.push([...placeholderItem]);
        // }
        const paddingNeeded = emptyRowsToPush(info.length)
        for (let i = 0; i < paddingNeeded; i++) {
            const emptyRow = ["", "", "", "", "", "", "", "", ""];
            emptyRow.isInfoRow = true; // Keep the same flag if you want same styling
            info.push(emptyRow);
        }

        const doc = new jsPDF();

        const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
        console.log("baseUrl------------------>>>>>>>>>>>>>>", baseUrl);
        // const logoUrl = (await import('../../AllImage/RDL_Logo.png')).default;
        const logoUrl = `${baseUrl}/${item.jobWork.companyImage}`
        const ISOUrl = require('../../AllImage/Picture.png');

        // PAGE NUMBER
        const totalPagesExp = "{totalPages}"; // <-- Add this
        const tableOptions = {
            didDrawPage: (HookData) => {
                // Check if it's the first page
                if (HookData.pageNumber === 1) {
                    // Add an image on the first page
                    // doc.addImage(logoUrl, 'PNG', 15, 10, 28, 20);
                    // doc.addImage(ISOUrl, 'PNG', 160, 10, 35, 20);
                    doc.addImage(logoUrl, 'PNG', 22, 18, 28, 15);
                    doc.addImage(ISOUrl, 'PNG', 160, 15, 35, 20);
                } else {
                    // From second page onward, show header
                    doc.setFontSize(10);
                    doc.setTextColor('blue');
                    doc.setFont("times", "bold");
                    doc.text(`Dc No : ${item.jobWork.dcNo}     |     Date : ${item.jobWork.created_at}`, 14, 5); // Adjust Y pos as needed
                    doc.setDrawColor(0);
                    // doc.line(14, 10, 196, 10); // Line under the header (optional)
                }

                // PAGE NUMBER 
                const pageSize = doc.internal.pageSize;
                const pageWidth = pageSize.width || pageSize.getWidth();
                const pageHeight = pageSize.height || pageSize.getHeight();

                doc.setFontSize(8);
                doc.setTextColor(70);
                // Left-aligned footer text
                doc.text(
                    `FORMAT NO:IMS-ME-PUR-F-203-Rev-3 Dated 11-01-2019`,
                    14, // X position (left margin)
                    pageHeight - 10
                );

                // Right-aligned page number
                doc.text(
                    `Page ${HookData.pageNumber} of ${totalPagesExp}`,
                    pageWidth - 14, // X position (right margin)
                    pageHeight - 10,
                    { align: 'right' } // Align text to the right
                );
            },
        };
        doc.setFontSize(8);
        doc.setTextColor('black');
        doc.text(headerName, 200, 6, { align: 'right' }); // Adjust X and Y coordinates as needed

        // const logoAndAddress = [
        //     [
        //         {
        //             content: headerName,
        //             colSpan: 8,
        //             styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0 }
        //         }
        //     ],

        //     [
        //         {
        //             content: `\n\n\n\n\n\nRDL Technologies Pvt Ltd.\nPlot No. 126, Road No 3, KIADB Industrial Estate\nII Phase, Jigani Industrial Area, Jigani,Anekal Taluk,\nBengaluru - 560 105. Tel:080-27825249\nWeb Site :www.mallikengineering.com\nEmail : info@mallikengineering.com`,
        //             colSpan: 3,
        //             styles: {
        //                 halign: 'left', fontSize: 8, textColor: 'black',
        //                 lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
        //                 lineColor: { top: [0, 0, 0] },
        //             }
        //         },

        //         {
        //             content: '', // This is the middle space for vertical line
        //             colSpan: 1,
        //             styles: {
        //                 lineWidth: { top: 0.2, right: 0, bottom: 0, left: 0.2 }, // ← this adds the vertical line on both sides
        //                 lineColor: {
        //                     top: [0, 0, 0],
        //                     left: [0, 0, 0],
        //                     right: [0, 0, 0]
        //                 }
        //             }
        //         },
        //         {
        //             content: `\n\n\n\n\n\n\n\n\nCIN No: U28112KA2013PTC068181\nPAN No: AAICM4744Q\nGSTINO: 29AAICM4744Q1ZM`,
        //             colSpan: 4,
        //             styles: {
        //                 halign: 'right', fontSize: 8, textColor: 'black', /*valign: 'top',*/
        //                 lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0 },
        //                 lineColor: { top: [0, 0, 0] },
        //             }
        //         }
        //     ]
        // ];
        // const logoAndAddress = [
        //     [
        //         {
        //             content: '',
        //             colSpan: 2,
        //             styles: {
        //                 halign: 'left', fontSize: 8, textColor: 'black',
        //                 lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
        //                 lineColor: { top: [0, 0, 0] },
        //             }
        //         },
        //         {
        //             content: `${item.jobWork.companyName}\n${item.jobWork.companyAdd}. Tel:${item.jobWork.telNo}\nWeb Site :${item.jobWork.website}\nEmail : ${item.jobWork.email}`,
        //             colSpan: 6,
        //             styles: {
        //                 halign: 'left', fontSize: 8, textColor: 'black',
        //                 lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
        //                 lineColor: { top: [0, 0, 0] },
        //             }
        //         },
        //     ],
        //     [
        //         {
        //             content: `CIN No: ${item.jobWork.cmpCinNo}`,
        //             colSpan: 2,
        //             styles: {
        //                 fontSize: 8, textColor: 'black', /*valign: 'top',*/
        //                 lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
        //                 lineColor: { top: [0, 0, 0] },
        //             }
        //         },
        //         {
        //             content: `GSTINO: ${item.jobWork.cmpGstNo}`,
        //             colSpan: 1,
        //             styles: {
        //                 fontSize: 8, textColor: 'black', /*valign: 'top',*/
        //                 lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
        //                 lineColor: { top: [0, 0, 0] },
        //             }
        //         },
        //         {
        //             content: `PAN No: ${item.jobWork.cmpPanNo}`,
        //             colSpan: 3,
        //             styles: {
        //                 fontSize: 8, textColor: 'black', /*valign: 'top',*/
        //                 lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
        //                 lineColor: { top: [0, 0, 0] },
        //             }
        //         },

        //         {
        //             content: `No: ${item.jobWork.dcNo}`,
        //             colSpan: 2,
        //             styles: {
        //                 fontSize: 8, textColor: 'black', /*valign: 'top',*/
        //                 lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
        //                 lineColor: { top: [0, 0, 0] },
        //             }
        //         }
        //     ]
        // ];
        const logoAndAddress = [
            [
                {
                    content: '',
                    colSpan: 3,
                    styles: {
                        halign: 'left', fontSize: 8, textColor: 'black',
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
                {
                    content: `${item.jobWork.companyName}\n${item.jobWork.companyAdd}. Tel:${item.jobWork.telNo}\nWeb Site :${item.jobWork.website}\nEmail : ${item.jobWork.email}`,
                    colSpan: 6,   // ⬅⬅⬅ FIXED (6 → 7)
                    styles: {
                        halign: 'left', fontSize: 8, textColor: 'black',
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
            ],
            [
                {
                    content: `CIN No: ${item.jobWork.cmpCinNo}`,
                    colSpan: 3,
                    styles: {
                        fontSize: 8, textColor: 'black',
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
                {
                    content: `GSTINO: ${item.jobWork.cmpGstNo}`,
                    colSpan: 2,
                    styles: {
                        fontSize: 8, textColor: 'black',
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
                {
                    content: `PAN No: ${item.jobWork.cmpPanNo}`,
                    colSpan: 4,
                    styles: {
                        fontSize: 8, textColor: 'black',
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
                // {
                //     content: `No: ${item.jobWork.dcNo}`,
                //     colSpan: 1,  // ⬅⬅⬅ FIXED (2 → 3)
                //     styles: {
                //         fontSize: 8, textColor: 'black',
                //         lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
                //         lineColor: { top: [0, 0, 0] },
                //     }
                // }
            ]
        ];

        // const poHeader = [[{
        //     content: 'DELIVERY CHALLAN', colSpan: 8,
        //     styles: {
        //         lineWidth: 0,
        //         textColor: "#000000", // dark text on light background
        //         fontStyle: "bold",
        //         fontWeight: "bold",
        //         fillColor: [200, 210, 255], fontSize: 8,
        //     },
        // }]];
        const poHeader = [[{
            content: 'DELIVERY CHALLAN',
            colSpan: 9,   // ⬅ FIXED
            styles: {
                lineWidth: 0,
                textColor: "#000000",
                fontStyle: "bold",
                fontWeight: "bold",
                fillColor: [200, 210, 255],
                fontSize: 8,
            },
        }]];

        // const address = [
        //     [
        //         {
        //             content: `To: \nM/ s.${item.jobWork.supplierName}\n${item.jobWork.spAddress}\nPAN No: ${item.jobWork.panNo}\nGST No: ${item.jobWork.gstNo}`,
        //             colSpan: 3,
        //             styles: { halign: 'left', valign: 'top', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
        //         },

        //         {
        //             content: `Ship To: \nM / s.${item.jobWork.supplierName}\n${item.jobWork.address || ''}\nPAN No: ${item.jobWork.panNo}\nGST No: ${item.jobWork.gstNo}`,
        //             colSpan: 5,
        //             styles: { halign: 'left', valign: 'top', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
        //         },
        //     ],
        //     [
        //         {
        //             content: `Place of Supply & State : ${item.jobWork.spPlace}`,
        //             colSpan: 4,
        //             styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
        //         },
        //         {
        //             content: `State Code : ${item.jobWork.toStateCode}`,
        //             colSpan: 4,
        //             styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
        //         },
        //     ]

        // ];
        const address = [
            [
                {
                    content: `To: 
M/ s.${item.jobWork.supplierName}
${item.jobWork.spAddress}
PAN No: ${item.jobWork.panNo}
GST No: ${item.jobWork.gstNo}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: `Ship To: 
M / s.${item.jobWork.supplierName}
${item.jobWork.address || ''}
PAN No: ${item.jobWork.panNo}
GST No: ${item.jobWork.gstNo}`,
                    colSpan: 5,   // ⬅ FIXED (5 → 6)
                    styles: { halign: 'left', valign: 'top', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: `Place of Supply & State : ${item.jobWork.spPlace}`,
                    colSpan: 6,
                    styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: `State Code : ${item.jobWork.toStateCode}`,
                    colSpan: 3,  // ⬅ FIXED (4 → 5)
                    styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
                },
            ]
        ];

        const firstHeaderRow = [
            [
                {
                    content: `DC NO: ${item.jobWork.dcNo}`,
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                },
                {
                    content: `Challan No: ${item.jobWork.challanNo} `,
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                },
                {
                    content: `Mode of Trans: ${item.jobWork.modeOfTransport}`,
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                }
            ],
            [
                {
                    content: `DC Date: ${item.jobWork.created_at}`,
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                },
                {
                    content: `Challan Date: ${item.jobWork.challanDate}`,
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                },
                {
                    content: `Vehicle No: ${item.jobWork.vehicleNo}`,
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                }
            ],
        ];

        const secondHeaderRow = [['SI No', 'JC No', 'Part Name', 'Part Description ', 'HSN /SAC', 'UOM', 'Qty', 'Rate', 'Amount']];

        const headerRows = [...logoAndAddress,/* ...pan,*/ ...poHeader, ...address, ...firstHeaderRow, ...secondHeaderRow];

        // const totalRow = [
        //     ...(item.jobWork.igst > 0 ? [[
        //         { content: '', colSpan: 3, styles: { halign: 'left', fontSize: 8 } },
        //         { content: `IGST @${item.jobWork.igstPercent} % `, colSpan: 3, styles: { halign: 'left', fontSize: 10 } },
        //         { content: `${Number(item.jobWork.igst || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8, textColor: 'black' } }
        //     ],] : []),
        //     ...(item.jobWork.sgst > 0 ? [[
        //         { content: '', colSpan: 3, styles: { halign: 'left', fontSize: 8 } },
        //         { content: `SGST @${item.jobWork.sgstPercent} % `, colSpan: 3, styles: { halign: 'left', fontSize: 10 } },
        //         { content: `${Number(item.jobWork.sgst || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8, textColor: 'black' } }
        //     ]] : []),
        //     ...(item.jobWork.cgst > 0 ? [[
        //         { content: '', colSpan: 3, styles: { halign: 'left', fontSize: 8 } },
        //         { content: `CGST @${item.jobWork.cgstPercent} % `, colSpan: 3, styles: { halign: 'left', fontSize: 10 } },
        //         { content: `${Number(item.jobWork.cgst || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8, textColor: 'black' } }
        //     ]] : []),

        //     [
        //         {
        //             content: `Remarks : ${item.jobWork.remarks}`,
        //             colSpan: 3,
        //             rowSpan: 1,
        //             styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        //         },
        //         {
        //             content: 'Total Qty',
        //             colSpan: 3,
        //             styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        //         },
        //         {
        //             content: Number(item.jobWork.totalQty || 0).toLocaleString('en-IN'),
        //             colSpan: 2,
        //             styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        //         },
        //     ],
        //     [
        //         {
        //             content: `DC Issue Date : ${item.jobWork.created_at}`,
        //             colSpan: 3,
        //             rowSpan: 1,
        //             styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        //         },
        //         {
        //             content: 'Total Value',
        //             colSpan: 3,
        //             styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        //         },
        //         {
        //             content: Number(item.jobWork.totalValue || 0).toLocaleString('en-IN'),
        //             colSpan: 2,
        //             styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        //         },

        //     ],
        //     [
        //         {
        //             content: 'Subject to Bengaluru Jurisdiction',
        //             colSpan: 3,
        //             rowSpan: 1,
        //             styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        //         },
        //         {
        //             content: 'Gross Value',
        //             colSpan: 3,
        //             styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        //         },
        //         {
        //             content: Number(item.jobWork.totalGrossAmt || 0).toLocaleString('en-IN'),
        //             colSpan: 2,
        //             styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        //         },

        //     ],
        // ];
        const totalRow = [
            ...(item.jobWork.igst > 0 ? [[
                { content: '', colSpan: 4 },
                { content: `IGST @${item.jobWork.igstPercent} %`, colSpan: 3, styles: { fontSize: 10 } },
                { content: `${Number(item.jobWork.igst || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 10 } },
                // { content: '', colSpan: 1 } // ⭐ missing column added
            ]] : []),

            ...(item.jobWork.sgst > 0 ? [[
                { content: '', colSpan: 4 },
                { content: `SGST @${item.jobWork.sgstPercent} %`, colSpan: 3, styles: { fontSize: 10, } },
                { content: `${Number(item.jobWork.sgst || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 10 } },
                // { content: '', colSpan: 1 }
            ]] : []),

            ...(item.jobWork.cgst > 0 ? [[
                { content: '', colSpan: 4 },
                { content: `CGST @${item.jobWork.cgstPercent} %`, colSpan: 3, styles: { fontSize: 10, } },
                { content: `${Number(item.jobWork.cgst || 0).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 10 } },
                // { content: '', colSpan: 1 }
            ]] : []),

            [
                { content: `Remarks : ${item.jobWork.remarks}`, colSpan: 4, styles: { halign: 'left', fontSize: 10, } },
                { content: 'Total Qty', colSpan: 3, styles: { halign: 'left', fontSize: 10, } },
                { content: Number(item.jobWork.totalQty).toLocaleString('en-IN'), colSpan: 2, styles: { halign: 'left', fontSize: 10, } },
                // { content: '', colSpan: 1 } // ⭐ added
            ],

            [
                { content: `DC Issue Date : ${item.jobWork.created_at}`, colSpan: 4, styles: { halign: 'left', fontSize: 10, } },
                { content: 'Total Value', colSpan: 3, styles: { halign: 'left', fontSize: 10, } },
                { content: Number(item.jobWork.totalValue).toLocaleString('en-IN'), colSpan: 2, styles: { halign: 'left', fontSize: 10, } },
                // { content: '', colSpan: 1 } // ⭐ added
            ],

            [
                { content: 'Subject to Bengaluru Jurisdiction', colSpan: 4, styles: { fontSize: 10 } },
                { content: 'Gross Value', colSpan: 3, styles: { fontSize: 10 } },
                { content: Number(item.jobWork.totalGrossAmt).toLocaleString('en-IN'), colSpan: 2, styles: { halign: 'right', fontSize: 10, } },
                // { content: '', colSpan: 1 } // ⭐ added
            ],
        ];


        const termsAndSuppluColumn = [

            [
                {
                    content: `Receiver's Signature`,
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom', marginTop: 10, paddingTop: 10 }
                },
                {
                    content: `Prepared By ${item.jobWork.createdBy}`,
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom', marginTop: 10, paddingTop: 10 }
                },
                {
                    content: 'Reviewed By',
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom', marginTop: 10, paddingTop: 10 }
                },
                {
                    content: `For RDL Technologies Pvt Ltd.\n\n\n\nAuthorized Signatory`,
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', marginTop: 10, paddingTop: 10 }
                }

            ],

        ]

        //Table Border lines
        const outerTable = [
            [
                {
                    content: 'Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076',
                    colSpan: 4,
                    styles: {
                        halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal',
                        lineWidth: { top: 0.5, right: 0, bottom: 0, left: 0 },
                        lineColor: { top: [0, 0, 0] },
                        cellPadding: { top: 20, bottom: 3 }, // ⬅️ Add padding for spacing

                    }
                },
            ],
            [
                {
                    content: 'Branch Address: Plot No. 98-I, Road No. 6, KIADB Jigani Industrial Estate, 2nd Phase, Jigani, Anekal Tq, Bangalore - 560105',
                    colSpan: 4,
                    styles: {
                        halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', lineWidth: 0
                    }
                },
            ],

        ];

        const bodyRows = [...info, ...totalRow/*, ...termsAndSuppluColumn,*/]
        const footRows = [...termsAndSuppluColumn, ...outerTable]

        // doc.autoTable({
        //     theme: 'striped',
        //     head: headerRows,
        //     body: bodyRows,
        //     // foot: footRows,
        //     showHead: 'firstPage',
        //     showFoot: 'lastPage',
        //     // startY: 2,
        //     ...tableOptions,
        //     headStyles: {
        //         fillColor: [255, 255, 255], // Header background color
        //         textColor: [0, 0, 0], // Header text color
        //         halign: 'center', // Header text alignment
        //         valign: 'middle', // Vertical alignment
        //         lineWidth: 0.1, // Border width
        //         lineColor: [0, 0, 0], // Border color,
        //         font: 'times',
        //         fontSize: 8,

        //     },
        //     columnStyles: {
        //         1: { cellWidth: 46 }, // Item Code
        //         2: { cellWidth: 67 }, // Item Description
        //     },
        //     bodyStyles: {
        //         fillColor: [255, 255, 255], // Header background color
        //         textColor: [0, 0, 0], // Header text color
        //         halign: 'left', // Header text alignment
        //         valign: 'middle', // Vertical alignment
        //         lineWidth: 0.1, // Border width
        //         lineColor: [0, 0, 0], // Border color
        //         fontStyle: 'normal',
        //         fontSize: 7,
        //         font: 'times',
        //         cellWidth: 'wrap', // avoids wrapping
        //     },
        //     footStyles: {
        //         fillColor: [255, 255, 255], // Header background color
        //         textColor: [0, 0, 0], // Header text color
        //         halign: 'center', // Header text alignment
        //         valign: 'middle', // Vertical alignment
        //         lineWidth: 0.1, // Border width
        //         lineColor: [0, 0, 0], // Border color
        //         font: 'times',
        //     },
        //     didDrawPage: function (data) {
        //         if (data.pageNumber === 1) {
        //             // Your current logo and header — keep untouched
        //             doc.addImage(logoUrl, 'PNG', 22, 18, 28, 15);
        //             doc.addImage(ISOUrl, 'PNG', 160, 15, 35, 20);
        //         } else {
        //             // ✅ Repeat secondHeaderRow manually on all pages after 1
        //             const headers = ['SI No', 'Part Name', 'Part Description ', 'HSN /SAC', 'UOM', 'Qty', 'Rate', 'Amount'];
        //             const widths = [15, 46, 67, 25, 20, 20, 30, 30]; // match columnStyles
        //             const startX = data.settings.margin.left;
        //             let y = data.cursor.y + 5;

        //             doc.setFont('times', 'bold');
        //             doc.setFontSize(8);
        //             doc.setTextColor(0);

        //             let x = startX;
        //             headers.forEach((text, i) => {
        //                 const width = widths[i];
        //                 doc.rect(x, y, width, 10); // Draw border
        //                 doc.text(text.trim(), x + width / 2, y + 6, { align: 'center', baseline: 'middle' });
        //                 x += width;
        //             });

        //             data.cursor.y = y + 10; // Adjust position for next row
        //         }

        //         // ✅ Keep your existing footer and page number logic
        //         const pageSize = doc.internal.pageSize;
        //         const pageWidth = pageSize.width || pageSize.getWidth();
        //         const pageHeight = pageSize.height || pageSize.getHeight();

        //         doc.setFontSize(8);
        //         doc.setTextColor(70);
        //         doc.text('FORMAT NO:IMS-ME-PUR-F-203-Rev-3 Dated 11-01-2019', 14, pageHeight - 10);
        //         doc.text(`Page ${data.pageNumber} of ${totalPagesExp}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
        //     },


        //     didParseCell: function (data) {
        //         if (data.section === 'body') {
        //             data.cell.styles.overflow = 'linebreak';
        //             data.cell.styles.fillColor = false;

        //             // Only align number cells to the right (check if value is numeric)
        //             const valueText = Array.isArray(data.cell.text) ? data.cell.text.join('') : data.cell.text;
        //             const plainValue = valueText.replace(/,/g, '').trim(); // Remove commas for check

        //             if (!isNaN(plainValue) && plainValue !== '') {
        //                 data.cell.styles.halign = 'right';
        //             }
        //         }
        //     }

        // });

        doc.autoTable({
            theme: 'striped',
            head: headerRows,
            body: bodyRows,
            // foot: footRows,
            showHead: 'firstPage',
            showFoot: 'lastPage',
            // startY: 2,
            ...tableOptions,
            headStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0],       // Header text color
                halign: 'center',           // Header text alignment
                valign: 'middle',           // Vertical alignment
                lineWidth: 0.1,             // Border width
                lineColor: [0, 0, 0],       // Border color
                font: 'times',
                fontSize: 8,
            },
            columnStyles: {
                0: { cellWidth: 10 },   // SI No
                1: { cellWidth: 18 },   // JC No
                2: { cellWidth: 28 },   // Part Name
                3: { cellWidth: 50 },   // Part Description
                4: { cellWidth: 18 },   // HSN / SAC
                5: { cellWidth: 12 },   // UOM
                6: { cellWidth: 12 },   // Qty
                7: { cellWidth: 15 },   // Rate
                8: { cellWidth: 18.7 },   // Amount
            }
            ,


            bodyStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                halign: 'left',
                valign: 'middle',
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
                fontStyle: 'normal',
                fontSize: 7,
                font: 'times',
                cellWidth: 'wrap',
            },
            footStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                halign: 'center',
                valign: 'middle',
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
                font: 'times',
            },

            didDrawPage: function (data) {
                if (data.pageNumber === 1) {
                    // ✅ First page logo/header
                    doc.addImage(logoUrl, 'PNG', 22, 18, 28, 15);
                    doc.addImage(ISOUrl, 'PNG', 160, 15, 35, 20);
                } else {
                    const headerHeight = 10; // Adjust height of your repeated header

                    // ✅ Repeat secondHeaderRow manually on all pages after 1
                    const headers = ['SI No', 'JC No', 'Part Name', 'Part Description', 'HSN /SAC', 'UOM', 'Qty', 'Rate', 'Amount'];
                    const startX = data.settings.margin.left;
                    let y = data.settings.margin.top - headerHeight;  // 🔥 fixed: start from top margin

                    doc.setFont('times', 'bold');
                    doc.setFontSize(8);
                    doc.setTextColor(0);

                    let x = startX;
                    data.table.columns.forEach((col, i) => {
                        const width = col.width;  // use actual column width
                        doc.rect(x, y, width, 10);
                        doc.text(headers[i].trim(), x + width / 2, y + 6, {
                            align: 'center',
                            baseline: 'middle'
                        });
                        x += width;
                    });
                    doc.setFontSize(8);
                    doc.setFont("times", "bold");
                    doc.setTextColor('blue');
                    doc.text(`Dc No : ${item.jobWork.dcNo}     |     Date : ${item.jobWork.created_at}`, 14, 3);
                    // data.cursor.y = y + 10; // Adjust for next row

                }

                // ✅ Footer + page numbers
                const pageSize = doc.internal.pageSize;
                const pageWidth = pageSize.width || pageSize.getWidth();
                const pageHeight = pageSize.height || pageSize.getHeight();

                doc.setFontSize(8);
                doc.setTextColor(70);
                doc.text('FORMAT NO:IMS-ME-PUR-F-203-Rev-3 Dated 11-01-2019', 14, pageHeight - 10);
                doc.text(`Page ${data.pageNumber} of ${totalPagesExp}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
            },

            didParseCell: function (data) {
                if (data.section === 'body') {
                    data.cell.styles.overflow = 'linebreak';
                    data.cell.styles.fillColor = false;

                    // ✅ Align numeric cells to right
                    const valueText = Array.isArray(data.cell.text) ? data.cell.text.join('') : data.cell.text;
                    const plainValue = valueText.replace(/,/g, '').trim();

                    if (!isNaN(plainValue) && plainValue !== '') {
                        data.cell.styles.halign = 'right';
                    }
                }
            }
        });


        doc.autoTable({
            theme: 'striped',
            head: footRows,
            startY: doc.lastAutoTable.finalY,
            headStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0], // Header text color
                halign: 'center', // Header text alignment
                valign: 'middle', // Vertical alignment
                lineWidth: 0.1, // Border width
                lineColor: [0, 0, 0], // Border color,
                font: 'times',
            }
        });

        // PAGE NUMBER
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp); // This replaces "{totalPages}" in all pages
        }

        // doc.save('PurchaseOrder.pdf');
        // const pdfBlob = doc.output('blob');
        // const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        // setPdfUrl(pdfBlobUrl);
        const pdfBlob = doc.output('blob');
        return pdfBlob; // ✅ Return the blob instead of setting state
    }

    const mergeJsPdfBlobs = async (blobs) => {
        const mergedPdf = await PDFDocument.create();

        for (const blob of blobs) {
            const arrayBuffer = await blob.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        return URL.createObjectURL(mergedBlob);
    };

    useEffect(() => {
        const generateMergedPdf = async () => {
            if (pdfBlobs.length > 0) {
                const mergedUrl = await mergeJsPdfBlobs(pdfBlobs);
                setMergedPdfUrl(mergedUrl);
            }
        };

        generateMergedPdf();
    }, [pdfBlobs]);

    //JSON FILE
    const getJsonSuccess = async (dataObject) => {
        try {
            // Create a Blob from the JSON data
            const jsonBlob = new Blob([JSON.stringify(dataObject, null, 2)], { type: 'application/json' });
            // Create a link element
            const link = document.createElement('a');
            link.href = URL.createObjectURL(jsonBlob);
            link.download = 'JWI.json'; // Filename for the downloaded file
            // Programmatically click the link to trigger the download
            link.click();
            // Clean up the object URL
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error fetching API:', error);
        }
    }
    const getJsonExceptoin = () => {
    }

    // JOBWORK SEARCH
    const handlePJWChange = (e) => {
        GetGeneratedJW({ code: e.target.value }, handleGeneratedJWSucessShow, handleGeneratedJWExceptionShow);
    }

    const handleGeneratedJWSucessShow = (dataObject) => {
        setGeneratedJWLists(dataObject?.data || []);
    }
    const handleGeneratedJWExceptionShow = (errorObject, errorMessage) => {
    }

    const handleGeneratedJWSelect = (selectedValue) => {
        if (selectedValue !== null) {
            setSelectedJwNo(selectedValue?.label);
            GetDelNoteForwardReverse({ type: 'view', id: selectedValue.id }, handleActionSuccess, handleActionException)
        }
    }

    const handleSpeclInstr1Change = (value) => {
        if (value !== null) {
            setRemarks(value.label);
        }
    }

    const handlePOChange = (e) => {
        setRemarks(e.target.value);
        GetRemarksLists({ code: e.target.value }, handleGeneratedPoSucessShow, handleGeneratedPoExceptionShow);
    }

    const handleGeneratedPoSucessShow = (dataObject) => {
        setRemarksAllLists(dataObject?.data || []);
    }
    const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => {
    }

    //SEARCH ITEM
    const handleItemChange = (e) => {
        // GetJobWorkIssueItemLists({ supId: supplierSid, code: e.target.value }, handleVendorProcessVendorSucessShow, handleVendorProcessVendorExceptionShow);
        ItemSearchNAAJ({
            text: e.target.value
        }, handleVendorProcessVendorSucessShow, handleVendorProcessVendorExceptionShow);
    }

    const handleVendorProcessVendorSucessShow = (dataObject) => {
        setSupplierItemList(dataObject?.data || []);
    }
    const handleVendorProcessVendorExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSupplierItemChange = (value) => {
        if (value !== null) {
            // // Clone the selectedItems array
            // const clonedSelectedItems = [...selectedItems];

            // // Remove the last item from the cloned array
            // const lastObj = clonedSelectedItems.pop();

            // // Add the new value at the end and the removed item back
            // clonedSelectedItems.push(value, lastObj);

            // // Set the state with the modified array
            // setSelectedItems(clonedSelectedItems);
            // // setSearchedItemValue();
            GetJobWorkIssueItemDetails({ supplierId: supplierSid, itemId: value.id }, handleGetItemDetailsSuccess, handleGetItemDetailsException)
        }
    };

    const handleGetItemDetailsSuccess = (dataObject) => {
        const itemData = dataObject?.data?.[0] || null;
        // Clone the selectedItems array
        const clonedSelectedItems = [...selectedItems];

        // Remove the last item from the cloned array
        const lastObj = clonedSelectedItems.pop();

        // Add the new value at the end and the removed item back
        clonedSelectedItems.push(itemData, lastObj);

        // Set the state with the modified array
        setSelectedItems(clonedSelectedItems);
        // setSearchedItemValue();
    }
    const handleGetItemDetailsException = () => { }

    const handleEdit = (cellNam, newValue, id, rowData) => {
        switch (cellNam) {
            case "jwQty":
                const updatedSrnQty = selectedItems.map((supp) =>
                    supp.id === id && cellNam === 'jwQty' ?
                        {
                            ...supp, jwQty: newValue,
                            // amount: newValue * rowData.rate
                            amount: Number((newValue * rowData.rate).toFixed(3))
                        }
                        : supp
                )
                setSelectedItems(updatedSrnQty);
                break;
            case "remarks":
                const updatedRemarks = selectedItems.map((supp) =>
                    supp.id === id && cellNam === 'remarks' ?
                        { ...supp, remarks: newValue }
                        : supp
                )
                setSelectedItems(updatedRemarks);
                break;
            default:
            // code block
        }
    }

    const handleCloseModal = () => {
        setViewMoreModal(false)
        if (subSupplyType === '8' || subSupplyType === '5') {
            if (subSupplyDesc === '') {
                setNotification({
                    status: true,
                    type: 'error',
                    message: 'Please Enter Sub Supply Desc',
                });
            }
        }
        if (actualToState !== '29' || (actualToState === '29' && Number(totalValue) > 50000)) {
            if (ewayBillRequired === 'N') {
                setNotification({
                    status: true,
                    type: 'error',
                    message: 'E-way Bill Is Mandetory',
                });
            }
        }
    }

    // UNIQUE CODE MANUAL CHANGE
    const handleUniqueCodeChange = (e) => {
        const newUniqueCode = e.target.value;
        const currentYear = DCNumber.split('/')[0]; // Get last 2 digits of the year
        setSequentialNumber(newUniqueCode);
        setDCNumber(`${currentYear}/${newUniqueCode.toString().padStart(5, 0)}`);
    };

    // Helper function to format the current date as yyyy-MM-dd
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // Extracts yyyy-MM-dd
    };

    const CustomPopper = (props) => {
        return (
            <Popper
                {...props}
                placement="top"
                style={{ position: 'absolute', top: 'auto', bottom: '100%' }}
            />
        );
    };

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: "success",
            message: dataObject.message,
        });
        setTimeout(() => {
            // handleClose();
            setDeleteDailogOpen(false);
            handleClearPage();
        }, 3000);
    };
    const deletehandleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: "error",
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    };


    const handleRateChange = (e, index, item) => {
        const newRate = parseFloat(e.target.innerText) || 0;
        const newAmount = (item.jwQty || 0) * newRate;

        const updatedItems = [...selectedItems];
        updatedItems[index] = { ...item, rate: newRate, amount: newAmount };
        setSelectedItems(updatedItems);
    };
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                {/* <Link to='/JobWorkIssueResult' style={{ textDecoration: 'none' }}>
                    <Typography
                        sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                        variant="h5"
                    >
                        {`Back>> `}
                    </Typography>
                </Link> */}
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    {viewDC || isView ? "View - Job Work Issue" : isEdit ? "Edit - Job Work Issue" : "New - Job Work Issue"}
                </Typography>
            </div>
            <form onSubmit={handleSubmit}>
                <Grid container padding={1}>
                    <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    disabled={true}
                                    placeholder='JWISS No'
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    // readOnly={true}
                                    disabled={isView ? true : false}
                                    required
                                    value={sequentialNumber}
                                    // onChange={(e) => setSequentialNumber(e.target.value)}
                                    onChange={handleUniqueCodeChange}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    inputProps={{ maxLength: 5 }} // Set max length to 5 characters
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    type='date'
                                    // readOnly={true}
                                    // disabled={true}
                                    disabled={isView ? true : false}
                                    required
                                    value={formatDate(selectedDate)}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    max={getCurrentDate()} // Restrict dates greater than today
                                    inputProps={{
                                        max: getCurrentDate(), // Restrict dates greater than today
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    fullWidth
                                    // readOnly={true}
                                    disabled={isView ? true : false}
                                    required
                                    value={DCNumber}
                                    // onChange={(e) => setDCNumber(e.target.value)}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />

                                <Tooltip title="Refresh DocNumber">
                                    <span>
                                        {" "}
                                        {/* wrapper to avoid tooltip crash when button is disabled */}
                                        <IconButton
                                            disabled={isView || isEdit}
                                            onClick={() => {
                                                if (sequentialNumber) {
                                                    // setPoType(e.target.value)
                                                    GetJobWorkIssueUniqueID(handleUniqueCodeSuccess, handleUniqueCodeException);
                                                }
                                            }}
                                            color="primary"
                                            size="small"
                                            style={{ marginLeft: "5px" }}
                                        >
                                            <RefreshIcon />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                {/* {viewDC || isEditable ?
                                    <TextField
                                        fullWidth
                                        readOnly={true}
                                        required
                                        value={supplierSelect}
                                        size="small"
                                        style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    />
                                    : */}
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    disabled={isView ? true : false}
                                    options={supplierList}
                                    fullWidth
                                    // getOptionLabel={(option) => option.spCode || ''}
                                    // value={supplierSelect}
                                    value={supplierSelect}
                                    getOptionLabel={(option) => option.label || supplierSelect}
                                    renderInput={(params) => <TextField {...params} label="Supplier" onChange={handleChange} />}
                                    onChange={(event, value) => handleSupplierSearchItemChange(value)}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                                {/* } */}
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    id="outlined-multiline-static"
                                    label="Billing Address"
                                    disabled={isView ? true : false}
                                    multiline
                                    rows={4}
                                    rowsMax={8}
                                    value={suppAddress}
                                    readOnly={true}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    inputProps={{
                                        style: { height: '65px', fontSize: '13px' }
                                    }}
                                />

                            </Grid>

                            <Grid item xs={12} sm={12} md={1} lg={1} xl={1} marginRight={2} style={{ marginRight: '10px' }}  >
                                <Button variant="contained" style={{ backgroundColor: isView === true ? ' #dddddd' : '#002d68' }} disabled={isView ? true : false} onClick={() => setChangeAddressModalOpen(true)}>Change</Button>
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                <Button variant="contained" disabled={isView || selectedType === 'Capital' || selectedType === 'nonReturnable' ? true : false} style={{ backgroundColor: isView === true || selectedType === 'Capital' || selectedType === 'nonReturnable' ? ' #dddddd' : '#002d68' }} onClick={() => setLoadPendingSfg(true)}>{selectedType === 'Quarantine' ? 'Load Quarantine' : 'Load From Pending SFG'}</Button>
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid>

                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} style={{ fontSize: '75%' }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={generatedJwLists}
                            fullWidth
                            value={selectedJwNo}
                            getOptionLabel={(option) => option.label || selectedJwNo}
                            renderInput={(params) => <TextField {...params} label="Search JWI" onChange={handlePJWChange} />}
                            onChange={(event, value) => handleGeneratedJWSelect(value)}
                            size="small"
                            style={{ backgroundColor: '#ffffff', borderRadius: '5px', zIndex: 10000 }}
                        />
                        {/* <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '0px', borderRadius: '10px', width: '100%', height:'20vh', overflow: 'auto', border: '1px solid black' }}> */}
                        {/* <CardContent> */}
                        {/* <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={generatedJwLists}
                                    fullWidth
                                    value={selectedJwNo}
                                    getOptionLabel={(option) => option.label || selectedJwNo}
                                    renderInput={(params) => <TextField {...params} label="Search JWI" onChange={handlePJWChange} />}
                                    onChange={(event, value) => handleGeneratedJWSelect(value)}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px', zIndex: 10000 }}
                                /> */}
                        {/* <Grid container spacing={2}>
                                    <Grid item xs={12} style={{ textAlign: 'right' }}> */}
                        <div style={{ width: '100%', textAlign: 'right', marginTop: '10px', display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '15px' }}>
                            <FormControl fullWidth style={{ display: 'flex', flex: 1 }}>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedType}
                                    label="Category"
                                    size='small'
                                    onChange={(e) => {
                                        setSelectedType(e.target.value)
                                        setTypeOfGoods(e.target.value)
                                    }}
                                >
                                    <MenuItem value={'General'}>General</MenuItem>
                                    <MenuItem value={'Capital'}>Capital Goods</MenuItem>
                                    <MenuItem value={'Quarantine'}>Quarantine</MenuItem>
                                    <MenuItem value={'nonReturnable'}>Non Returnable</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                style={{
                                    width: "100%",
                                    background: isModuleLocked ? "gray" : "#002D68",
                                    color: "white",
                                    height: '35px',
                                    // width: '250px',
                                    display: 1,
                                    flex: 1
                                }}
                                disabled={isModuleLocked}
                                onClick={() => setViewMoreModal(true)}
                            >
                                Additional Details
                            </Button>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: screenHeight - 410, border: '1px solid black', }}>
                            <CardContent style={{ height: '100%', overflow: 'auto' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '18px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', columnGap: '10px', rowGap: '10px' }}>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                height: '35px',
                                                background:
                                                    userPermission[0]?.addData === 0 || isModuleLocked ? "gray" : "#002D68",
                                                color:
                                                    userPermission[0]?.addData === 0 || isModuleLocked ? "black" : "white",
                                            }}
                                            disabled={userPermission[0]?.addData === 0 || isModuleLocked}
                                            onClick={handleClearPage}
                                        >
                                            New
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                height: '35px',
                                                background:
                                                    userPermission[0]?.updateData === 0 || isModuleLocked ? "gray" : "#002D68",
                                                color:
                                                    userPermission[0]?.updateData === 0 || isModuleLocked ? "black" : "white",
                                            }}
                                            disabled={userPermission[0]?.updateData === 0 || isModuleLocked}
                                            onClick={() => {
                                                setIsView(false)
                                                setIsEdit(true)
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                height: '35px',
                                                background:
                                                    userPermission[0]?.deleteData === 0 || isModuleLocked ? "gray" : "#002D68",
                                                color:
                                                    userPermission[0]?.deleteData === 0 || isModuleLocked ? "black" : "white",
                                            }}
                                            disabled={userPermission[0]?.deleteData === 0 || isModuleLocked}
                                            onClick={() => setDeleteDailogOpen(true)}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                height: '35px',
                                                background: isModuleLocked ? "gray" : "#002D68",
                                                color: "white",
                                                disabled: isModuleLocked ? "black" : "white",
                                            }}
                                            onClick={handleClearPage}
                                            disabled={isModuleLocked}
                                        >
                                            Clear
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                background: userPermission[0]?.print === 0 || isModuleLocked
                                                    ? "gray"
                                                    : (preViewItemList.length > 0 && mainId)
                                                        ? "#002D68"
                                                        : "gray",
                                                color: userPermission[0]?.print === 0
                                                    ? "#000000"
                                                    : (preViewItemList.length > 0 && mainId)
                                                        ? "white"
                                                        : "#000000",
                                                height: "35px",
                                            }}
                                            disabled={
                                                userPermission[0]?.print === 0 || isModuleLocked
                                                    ? true
                                                    : !(preViewItemList.length > 0 && mainId)

                                            }
                                            onClick={() => {
                                                setPdfModalOpen(true)
                                                getInvoiceData(mainId)
                                            }}
                                        >
                                            Print
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                background: preViewItemList.length > 0 && ewayBillRequired === 'Y' ? "#002D68" : "gray",
                                                color: preViewItemList.length > 0 && ewayBillRequired === 'Y' ? "white" : "black",
                                                height: '35px',
                                            }}
                                            disabled={preViewItemList.length > 0 && ewayBillRequired === 'Y' ? false : true}
                                            onClick={() => {
                                                GetJobWorkIssueDCJson({ id: mainId }, getJsonSuccess, getJsonExceptoin)
                                            }}
                                        >
                                            JSON
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                            onClick={() => handleForwardReverse('first', '')}

                                        >
                                            <FastRewindIcon />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                            onClick={() => handleForwardReverse('reverse', mainId)}

                                        >
                                            <SkipPreviousIcon />
                                        </Button>
                                        {/* <Button
                                                variant="contained"
                                                style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                            >
                                                <SearchIcon />
                                            </Button> */}
                                        <Button
                                            variant="contained"
                                            style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                            onClick={() => handleForwardReverse('forward', mainId)}

                                        >
                                            <SkipNextIcon />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                            onClick={() => handleForwardReverse('last', '')}

                                        >
                                            <FastForwardIcon />
                                        </Button>
                                    </div>
                                    <div>
                                        {/* {isView && < Button variant="contained" onClick={() => setIsEditable(!isEditable)} style={{ height: '35px', backgroundColor: '#002D68', marginRight: '10px' }}>Edit</Button>} */}
                                        {!viewDC && < Button disabled={loading || isModuleLocked} variant="contained" type='submit' style={{ height: '35px', backgroundColor: isModuleLocked ? "gray" : "#002D68" }}>
                                            {/* {isEditable && isView ? "Update" : "SAVE"} */}
                                            {loading ? (
                                                <CircularProgress size={24} style={{ color: 'white' }} />
                                            ) : (isEditable && isView ? "Update" : "SAVE")}
                                        </Button>}
                                    </div>
                                </div>
                                {/* <DataGrid
                                    rows={selectedItems}
                                    columns={middleGridColumns}
                                    pageSize={5}
                                    style={{ height: '310px' }}
                                    key={refreshKey}
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
                                            border: '1px solid #969696'
                                        },
                                    }}
                                    getRowClassName={(params) => {
                                        const rowIndex = selectedItems.findIndex(row => row.id === params.row.id);
                                        if (rowIndex !== -1) {
                                            console.log(' ');
                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }
                                        return '';
                                    }}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                /> */}
                                {/* <div style={{ overflowX: 'scroll' }}> */}
                                <table id="transactionTable">
                                    <tr style={{ position: 'sticky', top: '-16px', backgroundColor: '#f9f9f9', zIndex: 1 }}>
                                        <th>JC No</th>
                                        <th>Part No</th>
                                        <th>Part Name</th>
                                        <th>UOM</th>
                                        <th>QOH</th>
                                        <th>HSNCODE</th>
                                        <th>QTY</th>
                                        <th>Supply Desc</th>
                                        <th>Rate</th>
                                        <th>Location</th>
                                        <th>LOT</th>
                                        <th>Amt</th>
                                        <th>Remarks</th>
                                        <th>GRN INFO</th>
                                        <th>Actions</th>
                                    </tr>
                                    {selectedItems.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.jcNo}</td>

                                                {selectedType === 'Quarantine' ?
                                                    <td contentEditable={true} style={{ whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                    :
                                                    <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>
                                                        {item.itemCode ? <span>{item.itemCode}</span> :
                                                            <Autocomplete
                                                                disablePortal
                                                                id="combo-box-demo"
                                                                options={supplierItemList}
                                                                // value={selectedItemName}
                                                                sx={{ width: 300 }}
                                                                getOptionLabel={(option) => option.label || ''}
                                                                renderInput={(params) => <TextField
                                                                    {...params}
                                                                    label="Search Items"
                                                                    onChange={handleItemChange}
                                                                    sx={{
                                                                        "& .MuiInputBase-root": {
                                                                            height: "35px",
                                                                            fontSize: "12px",
                                                                            backgroundColor: "#ffffff",
                                                                            borderRadius: "5px",
                                                                        },
                                                                        "& .MuiInputBase-input": {
                                                                            padding: "0 8px",
                                                                        },
                                                                        "& .MuiInputLabel-root": {
                                                                            fontSize: "12px",
                                                                            lineHeight: "1.2",
                                                                        },
                                                                    }}
                                                                />}
                                                                onChange={(event, value) => handleSupplierItemChange(value)}
                                                                size='small'
                                                                disabled={isView ? true : false}
                                                                PopperComponent={CustomPopper}
                                                            />
                                                        }
                                                    </td>
                                                }
                                                <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.uom}</td>
                                                <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.qoh}</td>
                                                <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.hsn}</td>
                                                <td contentEditable={!isView} style={{ whiteSpace: 'nowrap' }} onBlur={(e) => handleEdit('jwQty', e.target.textContent, item.id, item)}>{item.jwQty}</td>
                                                <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.suppDesc}</td>
                                                <td
                                                    contentEditable={true}
                                                    suppressContentEditableWarning={true}
                                                    onBlur={(e) => handleRateChange(e, index, item)}
                                                >
                                                    {item.rate}
                                                </td>
                                                <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.location}</td>
                                                <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.lot}</td>
                                                <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.amount}</td>
                                                <td contentEditable={!isView} style={{ whiteSpace: 'nowrap' }} onBlur={(e) => handleEdit('remarks', e.target.textContent, item.id, item)}>{item.remarks}</td>
                                                <td contentEditable={false} style={{ whiteSpace: 'nowrap' }}>{item.grnNo}</td>
                                                <td contentEditable={false} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                    {item.id === 'RDL1' ?
                                                        null
                                                        :
                                                        !isView ?
                                                            <DeleteIcon
                                                                onClick={() => {
                                                                    handleDeleteRow(item.id)
                                                                }}
                                                                style={{ color: 'black', cursor: 'pointer' }}
                                                            />
                                                            :
                                                            <DeleteIcon style={{ color: 'gray', cursor: 'pointer' }} />
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </table>
                                {/* </div> */}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* /////////////////////////////////////////ADITIONAL DATA\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}
                <Dialog open={viewMoreModal} onClose={() => setViewMoreModal(false)} maxWidth="xl" fullWidth>
                    <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>JOB WORK ISSUE</DialogTitle>

                    <DialogContent style={{ padding: '2px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', rowGap: '10px', columnGap: '10px' }}>
                        <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#6895D2', color: '#ffffff' }}>JOB WORK ISSUE DETAILS</th>
                                </tr>
                                {/* <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Field</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Value</th>
                                </tr> */}
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Challan No</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            onChange={(e) => setChallanNo(e.target.value)}
                                            value={challanNo}
                                            size='small'
                                            label="Challan No"
                                            disabled={isView ? true : false}
                                        />
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            type='date'
                                            onChange={(e) => setChallanDate(e.target.value)}
                                            value={formatDate(challanDate)}
                                            label="Challan Date"
                                            size='small'
                                            InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                            disabled={isView ? true : false} />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Challan Date</th> */}
                                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            type='date'
                                            onChange={(e) => setChallanDate(e.target.value)}
                                            value={formatDate(challanDate)}
                                            label="Challan Date"
                                            size='small'
                                            InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                            disabled={isView ? true : false} />
                                    </td> */}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Mode Of Transport</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Mode Of Transport</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={modeOfTransport}
                                                onChange={(e) => setModeOfTransport(e.target.value)}
                                                label="Mode Of Transport"
                                                size='small'
                                                required
                                                disabled={isView ? true : false}                                                            >
                                                <MenuItem value={'BY ROAD'}>BY ROAD</MenuItem>
                                                <MenuItem value={'BY AIR'}>BY AIR</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={vehicleNo}
                                            onChange={(e) => setVehicleNo(e.target.value)}
                                            size='small'
                                            label="Vehicle No"
                                            required
                                            disabled={isView ? true : false} />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Vehicle No</th> */}
                                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={vehicleNo}
                                            onChange={(e) => setVehicleNo(e.target.value)}
                                            size='small'
                                            label="Vehicle No"
                                            disabled={isView ? true : false} />
                                    </td> */}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Consignee Name</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={consigneeName}
                                            // onChange={(e) => setConsigneeName(e.target.value)}
                                            size='small'
                                            required
                                            label="Consignee Name"
                                            disabled={isView ? true : false}
                                        />
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            value={address1}
                                            label="Address"
                                            onChange={(e) => setAddress1(e.target.value)}
                                            style={{ zoom: '75%' }}
                                            size='small'
                                            required
                                            disabled={isView ? true : false}
                                        />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Address</th> */}
                                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            value={suppAddress}
                                            label="Address"
                                            disabled={true}
                                            onChange={(e) => setAddress1(e.target.value)}
                                            style={{ zoom: '75%' }}
                                            size='small'
                                        />
                                    </td> */}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>PAN NO</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={panNo}
                                            label="PAN NO"
                                            onChange={(e) => setPanNo(e.target.value)}
                                            size='small'
                                            disabled={true}
                                            required
                                        />
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={gstNo}
                                            label="GST NO"
                                            onChange={(e) => setGSTNo(e.target.value)}
                                            size='small'
                                            disabled={true}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>GST NO</th> */}
                                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={gstNo}
                                            label="GST NO"
                                            onChange={(e) => setGSTNo(e.target.value)}
                                            size='small'
                                            disabled={true}
                                        />
                                    </td> */}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Type Of Goods</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Type Of Goods</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={typeOfGoods}
                                                label="Type Of Goods"
                                                required
                                                size='small'
                                                onChange={(e) => setTypeOfGoods(e.target.value)}
                                                disabled={isView ? true : false}                                                            >
                                                <MenuItem value={'inputs'}>Inputs</MenuItem>
                                                <MenuItem value={'Capital'}>Capital Goods</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={docType}
                                            label="Doc Type"
                                            onChange={(e) => setDocType(e.target.value)}
                                            size='small'
                                            // required
                                            disabled={isView ? true : false} />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Doc Type</th> */}
                                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={docType}
                                            label="Doc Type"
                                            onChange={(e) => setDocType(e.target.value)}
                                            size='small'
                                            disabled={isView ? true : false} />
                                    </td> */}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Sub Supply Type</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Sub Supply Type</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={subSupplyType}
                                                label="Sub Supply Type"
                                                required
                                                size="small"
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSubSupplyType(value);
                                                    setSubSupplyDesc(value);
                                                }}
                                                disabled={isView}
                                            >
                                                <MenuItem value={"4"}>Jobwork</MenuItem>
                                                <MenuItem value={"8"}>others</MenuItem>
                                                <MenuItem value={"5"}>For Own Use</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </td>

                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={subSupplyDesc}
                                            onChange={(e) => setSubSupplyDesc(e.target.value)}
                                            label="Sub Supply Desc"
                                            size="small"
                                            required={subSupplyType === "8" || subSupplyType === "5"}
                                            disabled={isView || subSupplyType === "4"}
                                        />
                                    </td>


                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Sub Supply Desc</th> */}
                                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={subSupplyDesc}
                                            onChange={(e) => setSubSupplyDesc(e.target.value)}
                                            label="Sub Supply Desc"
                                            size='small'
                                            disabled={isView ? true : false} />
                                    </td> */}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Transaction Type</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Transaction Type</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={transactionType}
                                                size='small'
                                                label="Transaction Type"
                                                required
                                                onChange={(e) => setTransactionType(e.target.value)}
                                                disabled={isView ? true : false}                                                            >
                                                <MenuItem value={'1'}>Regular</MenuItem>
                                                <MenuItem value={'2'}>Bill to Ship To</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Mode of Type</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={modeOfType}
                                                size='small'
                                                label="Mode of Type"
                                                required
                                                onChange={(e) => setModeOfType(e.target.value)}
                                                disabled={isView ? true : false}                                                            >
                                                <MenuItem value={'1'}>Road</MenuItem>
                                                <MenuItem value={'2'}>Rail</MenuItem>
                                                <MenuItem value={'3'}>Air</MenuItem>
                                                <MenuItem value={'4'}>Ship</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Mode of Type</th> */}
                                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Mode of Type</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={modeOfType}
                                                size='small'
                                                label="Mode of Type"
                                                onChange={(e) => setModeOfType(e.target.value)}
                                                disabled={isView ? true : false}                                                            >
                                                <MenuItem value={'ROAD'}>Road</MenuItem>
                                                <MenuItem value={'RAIL'}>Rail</MenuItem>
                                                <MenuItem value={'AIR'}>Air</MenuItem>
                                                <MenuItem value={'SHIP'}>Ship</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </td> */}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Docket No</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={docketNo}
                                            label="Docket No"
                                            onChange={(e) => setDocketNo(e.target.value)}
                                            size='small'
                                            required
                                            disabled={isView ? true : false} />
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            type='date'
                                            value={formatDate(transportDate)}
                                            label="Transport Date"
                                            onChange={(e) => setTransportDate(e.target.value)}
                                            size='small'
                                            required
                                            disabled={isView ? true : false} />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Transport Date</th> */}
                                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            type='date'
                                            value={formatDate(transportDate)}
                                            label="Transport Date"
                                            onChange={(e) => setTransportDate(e.target.value)}
                                            size='small'
                                            disabled={isView ? true : false} />
                                    </td> */}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Transport MST</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={transportMst}
                                            label="Transport MST"
                                            onChange={(e) => setTransportMst(e.target.value)}
                                            size='small'
                                            required
                                            disabled={isView ? true : false} />
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={transportGSTIN}
                                            label="Transport GSTIN"
                                            onChange={(e) => setTransportGSTIN(e.target.value)}
                                            size='small'
                                            disabled={isView ? true : false} />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Transport GSTIN</th> */}
                                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={transportGSTIN}
                                            label="Transport GSTIN"
                                            onChange={(e) => setTransportGSTIN(e.target.value)}
                                            size='small'
                                            disabled={isView ? true : false} />
                                    </td> */}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Distance KMS</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={distanceKMS}
                                            label="Distance KMS"
                                            onChange={(e) => setDistanceKMS(e.target.value)}
                                            size='small'
                                            required
                                            disabled={isView ? true : false} />
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={shippingPinCode}
                                            onChange={(e) => setShippingPinCode(e.target.value)}
                                            size='small'
                                            required
                                            label="Shipping Pincode"
                                            disabled={isView ? true : false} />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Shipping Pincode</th> */}
                                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={shippingPinCode}
                                            onChange={(e) => setShippingPinCode(e.target.value)}
                                            size='small'
                                            label="Shipping Pincode"
                                            disabled={isView ? true : false} />
                                    </td> */}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>To State Code</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={toStateCode}
                                            onChange={(e) => setToStateCode(e.target.value)}
                                            label="To State Code"
                                            size='small'
                                            required
                                            disabled={isView ? true : false} />
                                    </td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={actualToState}
                                            onChange={(e) => setActualToState(e.target.value)}
                                            label="Actual To State"
                                            size='small'
                                            required
                                            disabled={isView ? true : false} />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Actual To State</th> */}
                                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            value={actualToState}
                                            onChange={(e) => setActualToState(e.target.value)}
                                            label="Actual To State"
                                            size='small'
                                            disabled={isView ? true : false} />
                                    </td> */}
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Stock Affect</th> */}
                                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Stock Affect</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={stockAffect}
                                                onChange={(e) => setStockAffect(e.target.value)}
                                                size='small'
                                                label="Stock Affect"
                                                required
                                                disabled={isView ? true : false}                                                            >
                                                <MenuItem value={'Y'}>Y</MenuItem>
                                                <MenuItem value={'N'}>N</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </td> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Eway Bill Required</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={ewayBillRequired}
                                                label="Eway Bill Required"
                                                onChange={(e) => setEwayBillRequired(e.target.value)}
                                                size='small'
                                                required={actualToState !== '29' || (actualToState === '29' && Number(totalValue) > 50000)}
                                                disabled={isView ? true : false}                                                            >
                                                <MenuItem value={'Y'}>Y</MenuItem>
                                                <MenuItem value={'N'}>N</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Eway Bill Required</th> */}
                                    {/* <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Eway Bill Required</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={ewayBillRequired}
                                                label="Eway Bill Required"
                                                onChange={(e) => setEwayBillRequired(e.target.value)}
                                                size='small'
                                                disabled={isView ? true : false}                                                            >
                                                <MenuItem value={'Y'}>Y</MenuItem>
                                                <MenuItem value={'N'}>N</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </td> */}
                                </tr>
                            </tbody>
                        </table>
                        <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#6895D2', color: '#ffffff' }}>TOTAL</th>
                                </tr>
                                {/* <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Field</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Value</th>
                                </tr> */}
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Total Qty</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            size='small'
                                            value={totalQuantity}
                                            label="Total Qty"
                                            required
                                            disabled={isView ? true : false} />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Gross Amt</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <TextField
                                            fullWidth
                                            size='small'
                                            value={totalGrossAmount}
                                            label="Gross Amt"
                                            required
                                            disabled={isView ? true : false} />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>CGST</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', flexDirection: 'row' }}>
                                        <TextField
                                            fullWidth
                                            size='small'
                                            value={cgstPercent}
                                            required
                                            placeholder='%'
                                            onChange={(e) => setCGSTPercent(e.target.value)}
                                            style={{ marginRight: '5px' }}
                                            disabled={isView ? true : false} />
                                        <TextField
                                            fullWidth
                                            size='small'
                                            required
                                            value={cgst}
                                            disabled={isView ? true : false}
                                            label="CGST"
                                        />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>SGST</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', flexDirection: 'row' }}>
                                        <TextField
                                            fullWidth
                                            size='small'
                                            value={sgstPercent}
                                            placeholder='%'
                                            required
                                            onChange={(e) => setSGSTPercent(e.target.value)}
                                            style={{ marginRight: '5px' }}
                                            disabled={isView ? true : false} />
                                        <TextField
                                            fullWidth
                                            size='small'
                                            value={sgst}
                                            disabled={isView ? true : false}
                                            label="SGST"
                                        />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>IGST</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', flexDirection: 'row' }}>
                                        <TextField
                                            fullWidth
                                            size='small'
                                            value={igstPercent}
                                            placeholder='%'
                                            required
                                            onChange={(e) => setIGSTPercent(e.target.value)}
                                            style={{ marginRight: '5px' }}
                                            disabled={isView ? true : false} />
                                        <TextField
                                            fullWidth
                                            size='small'
                                            value={igst}
                                            disabled={isView ? true : false}
                                            label="IGST"
                                        />
                                    </td>
                                </tr>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Total Value</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px', display: 'flex', flexDirection: 'row' }}>
                                        <TextField
                                            fullWidth
                                            size='small'
                                            value={totalValue}
                                            required
                                            label="Total Value"
                                            disabled={isView ? true : false} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th colSpan={2} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', backgroundColor: '#6895D2', color: '#ffffff' }}>REMARKS</th>
                                </tr>
                                {/* <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Field</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#7077A1' }}>Value</th>
                                </tr> */}
                            </thead>
                            <tbody>
                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                    {/* <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Remarks</th> */}
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        {/* <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Remarks</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={remarks}
                                                size='small'
                                                label="Remarks"
                                                required
                                                onChange={(e) => setRemarks(e.target.value)}
                                                renderValue={(selected) => (
                                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {selected.length > 25 ? `${selected.substring(0, 35)}...` : selected}
                                                    </div>
                                                )}
                                                disabled={isView ? true : false}                                                            >
                                                {remarksLists.map((item) => (
                                                    <MenuItem key={item} value={item}>
                                                        {item}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl> */}
                                        {isView ?
                                            <TextField
                                                fullWidth
                                                required
                                                value={remarks}
                                                size='small'
                                                disabled={isView ? true : false}
                                            /> :
                                            // <Autocomplete
                                            //     disablePortal
                                            //     id="combo-box-demo"
                                            //     options={remarksAllLists}
                                            //     sx={{ width: '100%' }}
                                            //     getOptionLabel={(option) => option.label || ''}
                                            //     renderInput={(params) => <TextField {...params} label={remarks} /*onChange={(e) => setRemarks(e.target.value)}*/ onChange={(e) => handlePOChange(e)} />}
                                            //     onChange={(event, value) => handleSpeclInstr1Change(value)}
                                            //     size='small'
                                            //     disabled={isView ? true : false}
                                            // />
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={remarksAllLists}
                                                value={remarks}
                                                sx={{ width: '100%' }}
                                                getOptionLabel={(option) => option?.label || remarks}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label={remarks}
                                                        onChange={(e) => handlePOChange(e)}
                                                    />
                                                )}
                                                onChange={(event, value) => {
                                                    if (!value) {
                                                        setRemarks(""); // Clear state when cleared
                                                    } else {
                                                        handleSpeclInstr1Change(value);
                                                    }
                                                }}
                                                size="small"
                                                disabled={isView}
                                            />
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleCloseModal}>Close</Button>
                    </DialogActions>
                </Dialog>
                {/* /////////////////////////////////////////END\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ */}

            </form>
            <ChangeAddressModal
                changeAddressModalOpen={changeAddressModalOpen}
                setChangeAddressModalOpen={setChangeAddressModalOpen}
                setSuppAddress={setSuppAddress}
                supplierSid={supplierSid}
            />
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

            <LoadPendingSfg
                setLoadPendingSfg={setLoadPendingSfg}
                loadPendingSfg={loadPendingSfg}
                setSelectedItems={setSelectedItems}
                supplierSid={supplierSid}
                selectedType={selectedType}
            />
            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={mainId}
                // selectedMaster={selectedMaster}
                deleteService={JobWorkDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
            {/* <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
                <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>DELIVERY CHALLAN</DialogTitle>

                <DialogContent style={{ padding: '2px' }}>
                    {pdfUrl &&
                        <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
                    }
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setPdfModalOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog> */}
            <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
                <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    DELIVERY CHALLAN
                </DialogTitle>

                <DialogContent style={{ padding: '2px' }}>
                    {mergedPdfUrl && (
                        <embed src={mergedPdfUrl} type="application/pdf" width="100%" height="600px" />
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {
                        setPdfModalOpen(false);
                        setMergedPdfUrl(null);
                        setPdfBlobs([]);
                    }}
                    >Close</Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default JobWorkIssueModal