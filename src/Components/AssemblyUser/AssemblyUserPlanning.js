// import React, { useState, useEffect } from 'react';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import { Autocomplete, Button, Card, CardContent, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
// import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
// import { GetAssemblyPlanningFIM, ShowAssemblyPlanning } from '../../ApiService/LoginPageService';
// import { DownloadAssemblyPlanningXLData } from '../../ApiService/DownloadCsvReportsService'
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import * as XLSX from 'xlsx';
// import AssemblyModule from './AssemblyModule';
// import { HmiMachineDropDown, OeeOeeDownReason } from '../../ApiService/LoginPageService2';

// const AssemblyUserPlanning = () => {

//     const [isLoading, setGridLoading] = useState(false);
//     const [refreshData, setRefreshData] = useState(false);
//     const [sobDataList, setSobDataList] = useState([]);
//     const [openNotification, setNotification] = useState({
//         status: false,
//         type: 'error',
//         message: '',
//     });
//     const [fimList, setFimList] = useState([]);
//     const [machineList, setMachineList] = useState([]);
//     const [partNoList, setPartNoList] = useState([]);
//     const [PartNo, setPartNo] = useState('');
//     const [selectedFIM, setSelectedFIM] = useState('');
//     const [ContractNoList, setContractNoList] = useState([]);
//     const [ContractNo, setContractNo] = useState("");

//     const [selectedMachine, setSelectedMachine] = useState('')
//     const [selectedDate, setSelectedDate] = useState('');
//     const [selectedShift, setSelectedShift] = useState('');
//     const [thickness, setThickness] = useState('');
//     const [machinePlanningList, setMachinePlanningList] = useState([])
//     const [assemblyPlanningList, setAssemblyPlanningList] = useState([])
//     const [assemblyPlanningColumn, setAssemblyPlanningColumn] = useState([])
//     const [downloadDisable, setDownloadDisable] = useState(true);
//     const [isAllSelect, setIsAllSelect] = useState(true);
//     const [open, setOpen] = useState(false);
//     const [valueSet,setValueSet] = useState('');

//     const noDatacolumns = [
//         {
//             field: 'sNo',
//             headerClassName: 'super-app-theme--header',
//             headerName:
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     S.No
//                 </span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'item_Code',
//             headerClassName: 'super-app-theme--header',
//             headerName:
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     Item Code
//                 </span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'total_Quantity',
//             headerClassName: 'super-app-theme--header',
//             headerName:
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     Total Quantity
//                 </span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//         {
//             field: 'cycle_Time',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                 Cycle Time
//             </span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },

//         {
//             field: 'total_Cycle_Time',
//             headerClassName: 'super-app-theme--header',
//             headerName:
//                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                     Total Cycle Time
//                 </span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 100,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center'
//         },
//     ];

//     useEffect(() => {
//         document.title = 'Assembly Planning';
//         GetAssemblyPlanningFIM(handlePlanningFIMSuccess, handlePlanningFIMFailed)
//         // HmiMachineDropDown(handleHmiMachineDropDownSuccess, handleHmiMachineDropDownFailed);
//         // OeeOeeDownReason(handleOeeOeeDownReasonSuccess, handleOeeOeeDownReasonException);
//     }, [refreshData]);

//     const handleOeeOeeDownReasonSuccess = () => {

//     }

//     const handleOeeOeeDownReasonException = () => {

//     }

//     const handleHmiMachineDropDownSuccess = (dataObject) => {
//         setMachineList(dataObject?.data || []);
//     }

//     const handleHmiMachineDropDownFailed = (errorObject, errorMessage) => {

//     }

//     const handlePlanningFIMSuccess = (dataObject) => {
//         setFimList(dataObject?.data || []);
//     }

//     const handlePlanningFIMFailed = (errorObject, errorMessage) => {

//     }

//     const options = sobDataList.map(item => ({
//         id: item?.id,
//         label: item?.contractNo
//     }));

//     const handleSubmitPress = () => {
//         setGridLoading(true)
//         ShowAssemblyPlanning({
//             kanbanDate: selectedDate,
//             fim: isAllSelect ? '' : selectedFIM
//         }, showAssemblyPlanningSuccess, showAssemblyPlanningFailed)
//     }

//     const showAssemblyPlanningSuccess = (dataObject) => {
//         setGridLoading(false);
//         setDownloadDisable(dataObject?.data.length > 0 ? false : true);
//         setAssemblyPlanningList(dataObject?.data || []);

//         // DYNAMICALLY CREATE HEADER USING ARRAY KEY
//         const headerNameMapping = {
//             id: 'S.No',
//             itemcode: 'Item Code',
//             cycletime: 'Cycle Time',
//             totqty: 'Total Quantity',
//             totalcycletime: 'Total Cycle Time',
//         };

//         const dynamicColumn = Object.keys(dataObject?.data.length > 0 && dataObject?.data[0])
//             .filter((key) => key.toLowerCase() !== '')  // Exclude 'id' field
//             .map((key) => ({
//                 field: key,
//                 headerName: key,
//                 // width: 150,
//                 type: 'string',
//                 sortable: true,
//                 minWidth: 100,
//                 flex: 1,
//                 align: 'center',
//                 headerClassName: 'super-app-theme--header',
//                 headerAlign: 'center',
//                 renderHeader: (params) => (
//                     <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
//                         {headerNameMapping[key.toLowerCase()] || key}
//                     </span>
//                 ),
//             }));
//         setAssemblyPlanningColumn(dynamicColumn)

//     }
//     const showAssemblyPlanningFailed = (errorObject, errorMessage) => {
//         setGridLoading(false);
//     }

//     const arrayToWorksheet = (array, keyMapping, columnWidths) => {
//         // Change the key names in each object according to keyMapping
//         const transformedArray = array.map(obj =>
//             Object.fromEntries(Object.entries(obj).map(([key, value]) =>
//                 [keyMapping[key] || key, value]
//             ))
//         );

//         const worksheet = XLSX.utils.json_to_sheet(transformedArray);

//         // Set column widths
//         if (columnWidths) {
//             worksheet['!cols'] = columnWidths.map(width => ({ width }));
//         }

//         return worksheet;
//     };

//     const downloadExcelFile = (worksheet, filename) => {
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
//         XLSX.writeFile(workbook, filename);
//     };

//     const handleDownload = (data) => {
//         // Define a key mapping for renaming keys
//         const keyMapping = {
//             'sNo': 'SNo',
//             'rmThickness': 'Thickness',
//             'mrpNo': 'MRP ID',
//             'itemCode': 'Part Number',
//             'itemName': 'Description',
//             'jcNo': 'Job Card No',
//             'kanbanDate': 'Kanban Date',
//             'category': 'Product Type',
//             'cycleTime': 'Cycle Time',
//             'uom': 'UOM',
//             'Qty': 'Quantity',
//             'workPlanned': 'Work Planned',
//             // Add more key mappings as needed
//         };

//         // Define column widths (optional)
//         const columnWidths = [15, 20, 25, 25, 25, 25, 25, 25, 25];

//         const worksheet = arrayToWorksheet(data, keyMapping, columnWidths);
//         downloadExcelFile(worksheet, 'Machine_Planning.xlsx');
//     };

//     const handleDownloadAssemblyPlanning = () => {
//         DownloadAssemblyPlanningXLData(
//             {
//                 kanbanDate: selectedDate,
//                 fim: isAllSelect ? '' : selectedFIM
//             },
//             handleDownloadSucess, handleDownloadFailed
//         )
//     }

//     const handleClose = () => {
//         setNotification({
//             status: false,
//             type: '',
//             message: '',
//         });
//     };

//     const handleDownloadSucess = (dataObject) => {
//         console.log("dataObject", dataObject);
//         setNotification({
//             status: true,
//             type: 'success',
//             message: "Download Success",
//         });
//         setTimeout(() => {
//             handleClose();
//         }, 2000);
//     };

//     const handleDownloadFailed = (errorObject, errorMessage) => {
//         console.log("errorMessage", errorMessage);
//         console.log("errorObject", errorObject);
//         setNotification({
//             status: true,
//             type: 'error',
//             message: errorMessage?.message,
//         });
//         setTimeout(() => {
//             // handleClose();

//         }, 2000);
//     };

//     const onRowClickData = (e) => {
//         if (e.row["52KV1146"] && e.row["52KV1146"] !== 0) {
//             setOpen(true)
//             console.log("e.row===>",e.row["52KV1146"])
//             const tempValue = e.row["52KV1146"]
//             setValueSet(tempValue);
//         }

//     }

//     return (
//         <div style={{ height: '80vh', width: '100%' }}>

//             <div style={{ display: 'flex', justifyContent: 'space-around' }}>

//                 <Grid container spacing={2}>
//                     <Grid item xs={12} sm={12} md={6} lg={2.4} xl={2.4} >
//                         <TextField
//                             fullWidth
//                             label="Kanban Date"
//                             placeholder='Kanban Date'
//                             variant="filled"
//                             size='small'
//                             InputLabelProps={{
//                                 shrink: true
//                             }}
//                             type='date'
//                             value={selectedDate}
//                             onChange={(e) => {
//                                 setSelectedDate(e.target.value)
//                             }}
//                             required
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={12} md={6} lg={2.4} xl={2.4} >
//                         <FormControl fullWidth>
//                             <InputLabel id="demo-simple-select-label">Select Assembly Cell</InputLabel>
//                             <Select
//                                 labelId="demo-simple-select-label"
//                                 id="demo-simple-select"
//                                 label="Select FIM"
//                                 placeholder='Select FIM'
//                                 variant="filled"
//                                 size='small'
//                                 value={selectedFIM}
//                                 onChange={(e) => {
//                                     if (e.target.value === 'all') {
//                                         setIsAllSelect(true);
//                                         setSelectedFIM('all');
//                                     } else {
//                                         setSelectedFIM(e.target.value);
//                                         setDownloadDisable(true);
//                                         setIsAllSelect(false);
//                                     }
//                                 }
//                                 }
//                                 required
//                             >
//                                 <MenuItem key="all" value="all">All FIM</MenuItem>
//                                 {fimList.map((data) => (
//                                     <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </Grid>
//                     {/* <Grid item xs={12} sm={12} md={6} lg={2.4} xl={2.4} >
//                         <FormControl fullWidth>
//                             <InputLabel id="demo-simple-select-label">Select Part No</InputLabel>
//                             <Select
//                                 labelId="demo-simple-select-label"
//                                 id="demo-simple-select"
//                                 label="Machine List"
//                                 placeholder='Select Part No'
//                                 variant="filled"
//                                 size='small'
//                                 value={PartNo}
//                                 onChange={(e) => {
//                                     setPartNo(e.target.value)
//                                 }
//                                 }
//                                 required
//                             >

//                                 {
//                                     partNoList.map((data) => (
//                                         <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
//                                     ))
//                                 }
//                             </Select>
//                         </FormControl>
//                     </Grid>
//                     <Grid item xs={12} sm={12} md={6} lg={2.4} xl={2.4} >
//                         <FormControl fullWidth>
//                             <InputLabel id="demo-simple-select-label">Select Contract No</InputLabel>
//                             <Select
//                                 labelId="demo-simple-select-label"
//                                 id="demo-simple-select"
//                                 label="Select FIM"
//                                 placeholder='Select FIM'
//                                 variant="filled"
//                                 size='small'
//                                 value={ContractNo}
//                                 onChange={(e) => setContractNo(e.target.value)}
//                                 required
//                             >
//                                 {ContractNoList.map((data) => (
//                                     <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                     </Grid> */}
//                     <Grid item xs={12} sm={12} md={6} lg={1} xl={1} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
//                         <Button
//                             variant="contained"
//                             onClick={handleSubmitPress}
//                             style={{ backgroundColor: '#002d68' }}
//                         >
//                             Submit
//                         </Button>
//                     </Grid>
//                     <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
//                         <Card style={{ borderRadius: '8px', height: '100%', marginTop: '-5px', boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)" }}>
//                             <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                                 <DataGrid
//                                     rows={assemblyPlanningList}
//                                     columns={assemblyPlanningList.length > 0 ? assemblyPlanningColumn : noDatacolumns}
//                                     pageSize={8}
//                                     loading={isLoading}
//                                     rowsPerPageOptions={[8]}
//                                     disableSelectionOnClick
//                                     onCellClick={onRowClickData}

//                                     // onRowClick={onRowClickData}
//                                     // style={{ border: 'none', fontWeight: 'bold' }}
//                                     sx={{
//                                         overflow: 'auto',
//                                         height: '60vh',
//                                         // minHeight: '500px',
//                                         width: '100%',
//                                         '& .super-app-theme--header': {
//                                             WebkitTextStrokeWidth: '0.6px',
//                                             backgroundColor: '#93bce6',
//                                             color: '#1c1919'
//                                         },
//                                         '& .MuiDataGrid-cell': {
//                                             border: '1px solid #969696',
//                                         },
//                                         '& .MuiDataGrid-columnHeader': {
//                                             border: '1px solid #969696', // Add border to column headers
//                                         },
//                                     }}
//                                     getRowClassName={(params) => {
//                                         const rowIndex = assemblyPlanningList.findIndex(row => row.id === params.row.id);
//                                         if (rowIndex !== -1) {
//                                             console.log(' ');
//                                             return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
//                                         }
//                                         return '';
//                                     }}
//                                     rowHeight={40}
//                                     columnHeaderHeight={40}
//                                 />
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 </Grid>
//             </div>

//             <NotificationBar
//                 handleClose={handleClose}
//                 notificationContent={openNotification.message}
//                 openNotification={openNotification.status}
//                 type={openNotification.type}
//             />

//             <AssemblyModule
//                 open={open}
//                 setOpen={setOpen}
//                 valueSet={valueSet}
//                 setValueSet={setValueSet}
//             />
//         </div>
//     )
// }

// export default AssemblyUserPlanning

import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import {
  GetAssemblyPlanningFIM,
  ShowAssemblyPlanning,
  FilterAssemblyTable,
  AssemblyFilterDropdown,
} from "../../ApiService/LoginPageService";
import { DownloadAssemblyPlanningXLData } from "../../ApiService/DownloadCsvReportsService";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";
import AssemblyModule from "./AssemblyModule";
import {
  HmiMachineDropDown,
  OeeOeeDownReason,
} from "../../ApiService/LoginPageService2";
import ItemImageModal from "./ItemImageModal";

const AssemblyUserPlanning = () => {
  const [submitloading, setsubmitLoading] = useState(false);
  const [isLoading, setGridLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [sobDataList, setSobDataList] = useState([]);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [fimList, setFimList] = useState([]);
  const [machineList, setMachineList] = useState([]);
  const [partNoList, setPartNoList] = useState([]);
  const [PartNo, setPartNo] = useState("");
  const [selectedFIM, setSelectedFIM] = useState("");
  const [ContractNoList, setContractNoList] = useState([]);
  const [ContractNo, setContractNo] = useState("");

  const [selectedMachine, setSelectedMachine] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [thickness, setThickness] = useState("");
  const [machinePlanningList, setMachinePlanningList] = useState([]);
  const [assemblyPlanningList, setAssemblyPlanningList] = useState([]);
  console.log(
    "assemblyPlanningListassemblyPlanningListassemblyPlanningList",
    assemblyPlanningList
  );
  const [assemblyPlanningColumn, setAssemblyPlanningColumn] = useState([]);
  console.log(
    "assemblyPlanningColumnassemblyPlanningColumnassemblyPlanningColumn",
    assemblyPlanningColumn
  );
  const [downloadDisable, setDownloadDisable] = useState(true);
  const [isAllSelect, setIsAllSelect] = useState(true);
  const [open, setOpen] = useState(false);
  const [valueSet, setValueSet] = useState("");
  //NEW STATE
  const [stop, setStop] = useState("");
  const [duty, setDuty] = useState("");
  const [type, setType] = useState("");
  const [selectedItemCode, setSelectedItemCode] = useState("");
  const [selectedContractNumber, setSelectedContractNumber] = useState("");
  const [selectedCycleTime, setSelectedCycleTime] = useState("");
  const [updatedValue, setUpdatedValue] = useState("");
  const [originalNumber, setOriginalNumber] = useState("");
  console.log("updatedValue", updatedValue);
  // FILTER TABLE
  const [contractNoListData, setContractNoListData] = useState([]);
  const [partNoListData, setPartNoListData] = useState([]);
  const [selectedContractNo, setSelectedContractNo] = useState("");
  const [selectedPartNo, setSelectedPartNo] = useState("");
  const [imageModal, setImageModal] = useState(false);
  const [totalContract, setTotalContract] = useState(0);

  const noDatacolumns = [
    {
      field: "sNo",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>S.No</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "item_Code",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Item Code</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total_Quantity",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Total Quantity
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cycle_Time",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Cycle Time</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "total_Cycle_Time",
      headerClassName: "super-app-theme--header",
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Total Cycle Time
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  useEffect(() => {
    document.title = "Assembly Planning";
    GetAssemblyPlanningFIM(handlePlanningFIMSuccess, handlePlanningFIMFailed);
    // HmiMachineDropDown(handleHmiMachineDropDownSuccess, handleHmiMachineDropDownFailed);
    // OeeOeeDownReason(handleOeeOeeDownReasonSuccess, handleOeeOeeDownReasonException);
  }, [refreshData]);

  const handleOeeOeeDownReasonSuccess = () => { };

  const handleOeeOeeDownReasonException = () => { };

  const handleHmiMachineDropDownSuccess = (dataObject) => {
    setMachineList(dataObject?.data || []);
  };

  const handleHmiMachineDropDownFailed = (errorObject, errorMessage) => { };

  const handlePlanningFIMSuccess = (dataObject) => {
    setFimList(dataObject?.data || []);
  };

  const handlePlanningFIMFailed = (errorObject, errorMessage) => { };

  const options = sobDataList.map((item) => ({
    id: item?.id,
    label: item?.contractNo,
  }));

  const handleSubmitPress = () => {
    setGridLoading(true);
    setsubmitLoading(true);
    setSelectedContractNo("");
    setSelectedPartNo("");
    ShowAssemblyPlanning(
      {
        kanbanDate: selectedDate,
        fim: isAllSelect ? "" : selectedFIM,
      },
      showAssemblyPlanningSuccess,
      showAssemblyPlanningFailed
    );
    //FILTER DROPDOWN
    AssemblyFilterDropdown(
      {
        kanbanDate: selectedDate,
        fim: isAllSelect ? "" : selectedFIM,
      },
      filterDropdownSuccess,
      filterDropdownException
    );
  };

  const showAssemblyPlanningSuccess = (dataObject) => {
    setsubmitLoading(false);

    setSelectedContractNo("");
    setSelectedPartNo("");
    setGridLoading(false);
    setDownloadDisable(dataObject?.data.length > 0 ? false : true);
    setAssemblyPlanningList(dataObject?.data || []);
    setTotalContract(dataObject?.totalContractCount || 0);

    // DYNAMICALLY CREATE HEADER USING ARRAY KEY
    const headerNameMapping = {
      id: "S.No",
      itemcode: "Item Code",
      cycletime: "Cycle Time",
      totqty: "Total Quantity",
      totalcycletime: "Total Cycle Time",
    };

    const dynamicColumn = Object.keys(
      dataObject?.data.length > 0 && dataObject?.data[0]
    )
      .filter((key) => key.toLowerCase() !== "id") // Exclude 'id' field
      .map((key) => ({
        field: key,
        headerName: key,
        // width: 150,
        type: "string",
        sortable: true,
        minWidth: 100,
        flex: 1,
        align: "center",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        renderHeader: (params) => (
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>
            {headerNameMapping[key.toLowerCase()] || key}
          </span>
        ),
      }));
    setAssemblyPlanningColumn(dynamicColumn);
  };
  const showAssemblyPlanningFailed = (errorObject, errorMessage) => {
    setGridLoading(false);
    setsubmitLoading(false);
  };

  const arrayToWorksheet = (array, keyMapping, columnWidths) => {
    // Change the key names in each object according to keyMapping
    const transformedArray = array.map((obj) =>
      Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          keyMapping[key] || key,
          value,
        ])
      )
    );

    const worksheet = XLSX.utils.json_to_sheet(transformedArray);

    // Set column widths
    if (columnWidths) {
      worksheet["!cols"] = columnWidths.map((width) => ({ width }));
    }

    return worksheet;
  };

  const downloadExcelFile = (worksheet, filename) => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
    XLSX.writeFile(workbook, filename);
  };

  const handleDownload = (data) => {
    // Define a key mapping for renaming keys
    const keyMapping = {
      sNo: "SNo",
      rmThickness: "Thickness",
      mrpNo: "MRP ID",
      itemCode: "Part Number",
      itemName: "Description",
      jcNo: "Job Card No",
      kanbanDate: "Kanban Date",
      category: "Product Type",
      cycleTime: "Cycle Time",
      uom: "UOM",
      Qty: "Quantity",
      workPlanned: "Work Planned",
      // Add more key mappings as needed
    };

    // Define column widths (optional)
    const columnWidths = [15, 20, 25, 25, 25, 25, 25, 25, 25];

    const worksheet = arrayToWorksheet(data, keyMapping, columnWidths);
    downloadExcelFile(worksheet, "Machine_Planning.xlsx");
  };

  const handleDownloadAssemblyPlanning = () => {
    DownloadAssemblyPlanningXLData(
      {
        kanbanDate: selectedDate,
        fim: isAllSelect ? "" : selectedFIM,
      },
      handleDownloadSucess,
      handleDownloadFailed
    );
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handleDownloadSucess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: "Download Success",
    });
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleDownloadFailed = (errorObject, errorMessage) => {
    console.log("errorMessage", errorMessage);
    console.log("errorObject", errorObject);
    setNotification({
      status: true,
      type: "error",
      message: errorMessage?.message,
    });
    setTimeout(() => {
      // handleClose();
    }, 2000);
  };

  const onRowClickData = (e) => {
    if (e.row["52KV1146"] && e.row["52KV1146"] !== 0) {
      setOpen(true);
      console.log("e.row===>", e.row["52KV1146"]);
      const tempValue = e.row["52KV1146"];
      setValueSet(tempValue);
    }
  };

  const onCellClickData = (e) => {
    const columnKey = e.field;
    console.log("e.row===>", columnKey);
    const cellValue = e.row[columnKey];
    if (
      columnKey != "totQty" &&
      columnKey != "cycleTime" &&
      columnKey != "totalCycleTime" &&
      columnKey != "id" &&
      columnKey != "itemCode"
    ) {
      if (cellValue && cellValue !== 0) {
        setOpen(true);
        setValueSet(cellValue);
      }
    }
    console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", e);
    console.log("nnnnnnnnnnnnn", assemblyPlanningList[1][columnKey]);
    setDuty(assemblyPlanningList[1][columnKey]);
    setType(assemblyPlanningList[3][columnKey]);
    setStop(assemblyPlanningList[2][columnKey]);
    setSelectedItemCode(e?.row?.itemCode);
    setSelectedContractNumber(e?.field);
    setSelectedCycleTime(e?.row?.cycleTime);
  };

  const handleTableCellClick = (columnKey, cellValue, item, colIndex) => {
    // const columnKey = e.field;
    // console.log("e.row===>", columnKey);
    // const cellValue = e.row[columnKey];

    if (colIndex === 1) {
      setImageModal(true);
    }

    if (
      columnKey != "totQty" &&
      columnKey != "cycleTime" &&
      columnKey != "totalCycleTime" &&
      columnKey != "id" &&
      columnKey != "itemCode"
    ) {
      if (cellValue && cellValue !== 0) {
        setOpen(true);
        setValueSet(cellValue);
      }
    }
    // console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", e);
    console.log("nnnnnnnnnnnnn", assemblyPlanningList[1][columnKey]);
    setDuty(assemblyPlanningList[1][columnKey]);
    setType(assemblyPlanningList[3][columnKey]);
    setStop(assemblyPlanningList[2][columnKey]);
    setSelectedItemCode(item.itemCode);
    setSelectedContractNumber(columnKey);
    setSelectedCycleTime(item.cycleTime);
  };

  //FILTER TABLE
  const filterDropdownSuccess = (dataObject) => {
    setContractNoListData(dataObject?.contractNos || []);
    setPartNoListData(dataObject?.partNos || []);
  };
  const filterDropdownException = () => { };

  const handleFilterSuccess = (dataObject) => {
    setTotalContract(dataObject?.totalContractCount || 0);
    setAssemblyPlanningList(dataObject?.data || []);

    // DYNAMICALLY CREATE HEADER USING ARRAY KEY
    const headerNameMapping = {
      id: "S.No",
      itemcode: "Item Code",
      cycletime: "Cycle Time",
      totqty: "Total Quantity",
      totalcycletime: "Total Cycle Time",
    };

    const dynamicColumn = Object.keys(
      dataObject?.data.length > 0 && dataObject?.data[0]
    )
      .filter((key) => key.toLowerCase() !== "id") // Exclude 'id' field
      .map((key) => ({
        field: key,
        headerName: key,
        // width: 150,
        type: "string",
        sortable: true,
        minWidth: 100,
        flex: 1,
        align: "center",
        headerClassName: "super-app-theme--header",
        headerAlign: "center",
        renderHeader: (params) => (
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>
            {headerNameMapping[key.toLowerCase()] || key}
          </span>
        ),
      }));
    setAssemblyPlanningColumn(dynamicColumn);
  };
  const handleFilterException = () => { };

  return (
    <div style={{ height: "75vh", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={2.4} xl={2.4}>
            <TextField
              fullWidth
              label="Kanban Date"
              placeholder="Kanban Date"
              variant="filled"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={2.4} xl={2.4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select Assembly Cell
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Select FIM"
                placeholder="Select FIM"
                variant="filled"
                size="small"
                value={selectedFIM}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    setIsAllSelect(true);
                    setSelectedFIM("all");
                  } else {
                    setSelectedFIM(e.target.value);
                    setDownloadDisable(true);
                    setIsAllSelect(false);
                  }
                }}
                required
              >
                <MenuItem key="all" value="all">
                  All FIM
                </MenuItem>
                {fimList.map((data) => (
                  <MenuItem key={data.id} value={data.name}>
                    {data.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* <Grid item xs={12} sm={12} md={6} lg={2.4} xl={2.4} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Part No</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Machine List"
                                placeholder='Select Part No'
                                variant="filled"
                                size='small'
                                value={PartNo}
                                onChange={(e) => {
                                    setPartNo(e.target.value)
                                }
                                }
                                required
                            >

                                {
                                    partNoList.map((data) => (
                                        <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={2.4} xl={2.4} >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Contract No</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Select FIM"
                                placeholder='Select FIM'
                                variant="filled"
                                size='small'
                                value={ContractNo}
                                onChange={(e) => setContractNo(e.target.value)}
                                required
                            >
                                {ContractNoList.map((data) => (
                                    <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid> */}
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={1}
            xl={1}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={handleSubmitPress}
              style={{ backgroundColor: "#002d68" }}
              disabled={submitloading}
            >
              {submitloading ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                "Submit"
              )}
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={2.2}
            xl={2.2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={2}
            xl={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Contract No</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Select Contract No"
                placeholder="Select Contract No"
                variant="filled"
                size="small"
                value={selectedContractNo}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    // setIsAllSelect(true);
                    setSelectedContractNo("all");
                    FilterAssemblyTable(
                      {
                        kanbanDate: selectedDate,
                        fim: isAllSelect ? "" : selectedFIM,
                        PartNo: selectedPartNo,
                        ContractNo: "",
                      },
                      handleFilterSuccess,
                      handleFilterException
                    );
                  } else {
                    setSelectedContractNo(e.target.value);
                    FilterAssemblyTable(
                      {
                        kanbanDate: selectedDate,
                        fim: isAllSelect ? "" : selectedFIM,
                        PartNo: selectedPartNo,
                        ContractNo: e.target.value,
                      },
                      handleFilterSuccess,
                      handleFilterException
                    );
                    // setIsAllSelect(false);
                  }
                }}
              >
                {/* <MenuItem key="all" value="all">All Contract</MenuItem> */}
                {contractNoListData.map((data) => (
                  <MenuItem /*key={data.id}*/ value={data}>{data}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={2}
            xl={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Part No</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Select Part No"
                placeholder="Select Part No"
                variant="filled"
                size="small"
                value={selectedPartNo}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    // setIsAllSelect(true);
                    setSelectedPartNo("all");
                    FilterAssemblyTable(
                      {
                        kanbanDate: selectedDate,
                        fim: isAllSelect ? "" : selectedFIM,
                        PartNo: "",
                        ContractNo: selectedContractNo,
                      },
                      handleFilterSuccess,
                      handleFilterException
                    );
                  } else {
                    setSelectedPartNo(e.target.value);
                    FilterAssemblyTable(
                      {
                        kanbanDate: selectedDate,
                        fim: isAllSelect ? "" : selectedFIM,
                        PartNo: e.target.value,
                        ContractNo: selectedContractNo,
                      },
                      handleFilterSuccess,
                      handleFilterException
                    );
                    // setIsAllSelect(false);
                  }
                }}
              >
                {/* <MenuItem key="all" value="all">All Part No</MenuItem> */}
                {partNoListData.map((data) => (
                  <MenuItem /*key={data.id}*/ value={data}>{data}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Card
              style={{
                borderRadius: "8px",
                height: "100%",
                /* marginTop: '-5px',*/ boxShadow:
                  "0 0 10px 0 rgba(0, 0, 0, 0.5)",
              }}
            >
              {isLoading && (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress />
                </Box>
              )}
              <CardContent
                style={{
                  height: "520px",
                  overflow: "auto",
                  position: "relative"
                }}
              >
                <table
                  id="customers"
                  style={{
                    borderCollapse: "separate",
                    borderSpacing: 0,
                    position: "relative"
                  }}
                >
                  {/* ✅ STICKY HEADER */}
                  <thead>
                    <tr style={{ position: "sticky", top: 0, zIndex: 50 }}>
                      {assemblyPlanningColumn &&
                        assemblyPlanningColumn.map((column, key) => {

                          const colWidths = [150, 150, 150]; // adjust if needed
                          const isFrozen = key < 3;

                          return (
                            <th
                              key={key}
                              style={{
                                whiteSpace: "nowrap",
                                backgroundColor: "#93BCE6",

                                // ✅ Freeze header vertically
                                position: "sticky",
                                top: 0,

                                // ✅ Freeze first 3 header columns horizontally
                                left:
                                  key === 0
                                    ? "0px"
                                    : key === 1
                                      ? `${colWidths[0]}px`
                                      : key === 2
                                        ? `${colWidths[0] + colWidths[1]}px`
                                        : "auto",

                                zIndex: isFrozen ? 200 : 100, // ✅ REQUIRED so header stays above rows
                                width: isFrozen ? colWidths[key] : "auto",
                                minWidth: isFrozen ? colWidths[key] : "auto",

                                boxShadow: isFrozen ? "2px 0 0 #93BCE6" : "none",
                                borderBottom: "1px solid #ccc"
                              }}
                            >
                              {column.field}
                            </th>
                          );
                        })}
                    </tr>
                  </thead>



                  {/* ✅ BODY */}
                  <tbody>
                    {assemblyPlanningList &&
                      assemblyPlanningList.map((item, rowIndex) => (
                        <tr key={rowIndex}>
                          {assemblyPlanningColumn.map((column, colIndex) => {
                            const field = column.field;
                            const originalValue = item[field];
                            const updatedValue =
                              item.updated && item.updated[field];
                            const isMatch =
                              updatedValue !== undefined &&
                              originalValue === parseFloat(updatedValue);

                            const freezeWidths = [150, 150, 150];
                            const isFrozen = colIndex < 3;

                            return (
                              <td
                                key={colIndex}
                                style={{
                                  padding: "8px",
                                  whiteSpace: "nowrap",
                                  borderBottom: "1px solid #eee",

                                  backgroundColor: isMatch
                                    ? "lightgreen"
                                    : "white",

                                  width: isFrozen ? freezeWidths[colIndex] : "auto",
                                  minWidth: isFrozen ? freezeWidths[colIndex] : "auto",

                                  position: isFrozen ? "sticky" : "static",
                                  left:
                                    colIndex === 0
                                      ? "0px"
                                      : colIndex === 1
                                        ? `${freezeWidths[0]}px`
                                        : colIndex === 2
                                          ? `${freezeWidths[0] + freezeWidths[1]}px`
                                          : "auto",

                                  zIndex: isFrozen ? 60 : 1,

                                  /* ✅ CRITICAL FIX FOR SEE-THROUGH */
                                  background: isMatch ? "lightgreen" : "white",
                                  boxShadow: isFrozen ? "2px 0 0 white" : "none"
                                }}
                                onClick={() => {
                                  handleTableCellClick(
                                    field,
                                    originalValue,
                                    item,
                                    colIndex
                                  );
                                  setUpdatedValue(updatedValue);
                                  setOriginalNumber(originalValue);
                                }}
                              >
                                {originalValue}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </CardContent>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: "15px",
                  marginTop: "10px",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
                <Typography style={{ fontWeight: "bold", textAlign: "left" }}>
                  Total Contract
                </Typography>
                <Typography
                  style={{ textAlign: "center", marginLeft: "5px" }}
                >{`: ${totalContract}`}</Typography>
              </div>
            </Card>
          </Grid>
        </Grid>
      </div>

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />

      <AssemblyModule
        open={open}
        setOpen={setOpen}
        valueSet={valueSet}
        setValueSet={setValueSet}
        selectedDate={selectedDate}
        selectedContractNumber={selectedContractNumber}
        selectedItemCode={selectedItemCode}
        selectedFIM={selectedFIM}
        stop={stop}
        duty={duty}
        type={type}
        selectedCycleTime={selectedCycleTime}
        updatedValue={updatedValue}
        originalNumber={originalNumber}
        // REFRESH
        handleSubmitPress={handleSubmitPress}
      />

      <ItemImageModal
        setImageModal={setImageModal}
        imageModal={imageModal}
        selectedItemCode={selectedItemCode}
      />
    </div>
  );
};

export default AssemblyUserPlanning;
