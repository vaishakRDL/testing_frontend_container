import React, { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { DataGrid } from "@mui/x-data-grid";
import PartProcessVsInspectionTitle from "./PartProcessVsInspectionTitle";
import {
  GetItemVsProcessItem,
  GetItemVsProcessProcessList,
  AddItemVsProcess,
  Itemno,
  SelectProcess,
  EditProcess,
  PartProcessInspectionXLUpload,
  ItemVsPmSearch,
  InwardItemnoshow,
  ItemSearchNAAJ,
  AssemblyItemnoshow
} from "../../ApiService/LoginPageService";
import Box from "@mui/material/Box";
import { SelectChangeEvent } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import PartProcessAddModel from "./PartProcessAddModel";
import { PartProcessInspectionTemplate } from '../../ApiService/DownloadCsvReportsService';
import CopyForm from "./CopyForm";
import { useModuleLocks } from "../context/ModuleLockContext";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const PartProcessVsInspectionResult = () => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Part Process vs Inspection")?.lockStatus === "locked";

  const [open, setOpen] = useState(false);
  const [itemShowListSeach, setItemShowListSeach] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddButton, setIsAddButton] = useState(true);
  const [editeData, setEditeData] = useState([]);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [itemList, setItemList] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  ////////////////////////////////////
  const [selectedItemId, setSelectedItemId] = useState("");
  const [skipValues, setSkipValues] = useState({});
  const [qualityValues, setQualityValues] = useState({});
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  // console.log("CHECKBOX SELECTED", selectedRows)
  const [editedCycleTime, setEditedCycleTime] = useState({});
  const [editedProcessPriority, setEditedProcessPriority] = useState({});
  const [editCount, setEditCount] = useState({});
  const [editedSkip, setEditedSkip] = useState({});
  const [editedQuality, setEditedQuality] = useState({});
  const [excelModal, setExcelModal] = useState(false);
  const [copyFromModal, setCopyFromModal] = useState(false);
  const [itemno, setItemNo] = useState("");
  const [logRetensionPeriod, setLogRetensionPeriod] = useState('');
  const [rowsData, setRowsData] = useState([]);
  const [rowsDataCopy, setRowsDataCopy] = useState([]);
  const [isCheckedRow, setIsCheckedRow] = useState(false);
  const [seletedId, setSelectedId] = useState("");
  const [selectedrowsprocess, setSelectedRowsProcess] = useState([]);
  const [checkBoxId, setCheckBoxId] = useState("");
  const [checkBoxItemId, setCheckBoxItemId] = useState("");
  const [checkBoxProcessId, setCheckBoxProcessId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proceesId, setProcessId] = useState("");
  const [tempId, setTempId] = useState("");
  const [uploadLoader, setUploadLoader] = useState(false);
  const [jobCardNumberList, setJobCardNumberList] = useState([]);
  const [inspectionType, setInspectionType] = useState([]);
  const [file, setFile] = useState('');
  const [selectAll, setSelectAll] = useState(true);
  const [selectedType, setSelectedType] = useState('Production');
  const [rows, setRows] = useState([]);
  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };
  const allSelected =
    selectedrowsprocess.length === rowsDataCopy.length && rowsDataCopy.length > 0;
  const partiallySelected =
    selectedrowsprocess.length > 0 && !allSelected;

  // Function to handle closing the modal
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const columns1 = [
    {
      field: "process",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Process </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "actions",
      type: "actions",
      headerClassName: 'super-app-theme--header',
      flex: 1,
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>Select</span>
      ),
      cellClassName: "actions",
      disableClickEventBubbling: true,
      getActions: (params) => [
        <Checkbox
          // disabled={
          //   seletedId !== params.row.id && isCheckedRow === true ? true : false
          // }
          color={setColorData(params.row.isQlty)}
          checked={params.row.isSelected}
          onChange={(event) => handleCheckboxChange(event, params.row)}
        />,
      ],
    },
  ];

  const setColorData = (isColore) => {
    if (isColore === 1) {
      return "success";
    } else {
      return "primary";
    }
  };


  // DATAGRID CHECKBOX SELECTION
  // const handleRowCheckboxChange = (row) => {
  //   let newSelected = [];

  //   // Check if the row is already in the selected rows
  //   const isRowSelected = selectedrowsprocess.some(
  //     (selectedRow) => selectedRow.id === row.id
  //   );

  //   if (isRowSelected) {
  //     // If the row is already selected, remove it
  //     newSelected = selectedrowsprocess.filter(
  //       (selectedRow) => selectedRow.id !== row.id
  //     );
  //   } else {
  //     // If the row is not selected, add it
  //     newSelected = [...selectedrowsprocess, row];
  //   }

  //   // Update the state with the new selected rows
  //   setSelectedRowsProcess(newSelected);
  //   console.log("newSelected", newSelected);
  // };

  const handleRowCheckboxChange = (row) => {
    const isRowSelected = selectedrowsprocess.some(
      (selectedRow) => selectedRow.id === row.id
    );

    let newSelected;
    if (isRowSelected) {
      newSelected = selectedrowsprocess.filter(
        (selectedRow) => selectedRow.id !== row.id
      );
    } else {
      newSelected = [...selectedrowsprocess, row];
    }

    setSelectedRowsProcess(newSelected);
  };
  const handleHeaderCheckboxChange = () => {
    if (allSelected || partiallySelected) {
      setSelectedRowsProcess([]); // unselect all
    } else {
      setSelectedRowsProcess(rowsDataCopy); // select all
    }
  };

  const columns2 = [
    {
      field: "label",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Quality Parameter{" "}
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "expVal",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Expected value{" "}
        </span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "minTolerance",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Min Tolerance{" "}
        </span>
      ),
      type: "number",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "maxTolerance",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Max Tolerance
        </span>
      ),
      type: "number",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "uom",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>UOM</span>
      ),
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "inspectionType",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Evaluation Method{" "}
        </span>
      ),
      type: "number",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      // editable: true,
    },
    {
      field: "expVisInspec",
      headerClassName: 'super-app-theme--header',
      headerName: (
        <span style={{ fontWeight: "bold", fontSize: "16px" }}>
          Expected Visual Inspection
        </span>
      ),
      type: "stirng",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    // {
    //   field: "Skip",
    //   headerClassName: 'super-app-theme--header',
    //   headerName: (
    //     <span style={{ fontWeight: "bold", fontSize: "16px" }}>Skip</span>
    //   ),
    //   type: "string",
    //   sortable: true,
    //   minWidth: 80,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (params) => (
    //     <Checkbox
    //       // checked={params.row.skip}
    //       checked={selectedrowsprocess.some(
    //         (selectedRow) => selectedRow.id === params.row.id
    //       )}
    //       // defaultChecked={true} // Initially set to true, can be unchecked by the user
    //       onChange={() => handleRowCheckboxChange(params.row)} // Replace with your actual handler
    //     />
    //   ),
    // },
    {
      field: "Skip",
      headerClassName: "super-app-theme--header",
      headerName: (
        //       <Checkbox
        //   checked={allSelected}
        //   indeterminate={partiallySelected}
        //   onChange={handleHeaderCheckboxChange}
        // />
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <Checkbox
            disabled={isModalOpen}
            checked={allSelected}
            indeterminate={partiallySelected}
            onChange={handleHeaderCheckboxChange}
            size="small"
          />
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>Skip</span>
        </Box>
      ),
      flex: 1,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: (params) => (
        <Checkbox
          disabled={isModalOpen}
          checked={selectedrowsprocess.some(
            (selectedRow) => selectedRow.id === params.row.id
          )}
          onChange={() => handleRowCheckboxChange(params.row)}
        />
      ),
    },
  ];
  const handleCheckboxChange = (e, params) => {
    setProcessId(params?.id);
    console.log("====>", params?.id);
    if (params?.id) {
      setIsCheckedRow(e.target.checked);
      setSelectedId(params.id);
      if (e.target.checked === true) {
        setCheckBoxId(params?.id);
        setCheckBoxItemId(params?.itemId);
        setCheckBoxProcessId(params?.processId);
        SelectProcess(
          {
            processId: params?.processId,
            itemId: params?.itemId,
            type: selectedType
          },
          handleSelectProcessSuccess,
          handleSelectProcessException
        );
      } else {
        setRowsDataCopy([]);
        setInspectionType([]);
      }
    }
  };

  const handleSelectProcessSuccess = (dataObject) => {
    setInspectionType(dataObject?.data[0]?.qltInspecType?.split(',') || [])
    setRowsDataCopy(dataObject?.data || []);
    setSelectedRowsProcess(dataObject?.data || []);
    setTempId(dataObject?.data[0]?.tempId || "");
  };

  const handleSelectProcessException = (errorObject, errorMessage) => { };

  const handleCycleTimeChange = (rowId, value) => {
    setEditedCycleTime({ ...editedCycleTime, [rowId]: value });
  };

  // Handle changes in Process Priority input field
  const handleProcessPriorityChange = (rowId, value) => {
    setEditedProcessPriority({ ...editedProcessPriority, [rowId]: value });
  };

  // Handle changes in Count input field
  const handleCountChange = (rowId, value) => {
    setEditCount({ ...editCount, [rowId]: value });
  };

  const handleSkipChange = (rowId, value) => {
    setEditedSkip({ ...editedSkip, [rowId]: value });
  };

  const handleQualityChange = (rowId, value) => {
    setEditedQuality({ ...editedQuality, [rowId]: value });
  };
  /////////////////////

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     const updatedList = selectedrowsprocess.map(obj => (
  //         {
  //             ...obj,

  //         }
  //     ))

  //     console.log("HANDLE SUBMIT UPDATED ARRAY", updatedList)
  //     EditProcess(updatedList, handleSuccess, handleException);
  // };
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const updatedList = selectedrowsprocess.map((obj) => ({
      ...obj,
      processId: checkBoxProcessId,
      itemId: checkBoxItemId,
      statusId: checkBoxId,
      qltInspecType: inspectionType.join(','),
      type: selectedType
      // ExpectedVisualInspection:
      // Add other properties if needed
    }));

    console.log("HANDLE SUBMIT UPDATED ARRAY", updatedList);

    // Pass the array to EditProcess along with success and exception handlers
    EditProcess(updatedList, handleSuccess1, handleException1);
  };

  const handleSuccess1 = (dataObject) => {
    setLoading(false);
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      ClearData();
      handleClose();
    }, 2000);
  };
  const handleException1 = (errorObject, errorMessage) => {
    console.log("the error ", errorMessage);
    setLoading(false);
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      ClearData();
      handleClose();
    }, 2000);
  };

  /////////////////////////////////
  const handleCellEdit = (params) => {
    console.log("params", params);
    const updatedList = rowsDataCopy.map((Process) =>
      Process.id === params.id
        ? {
          ...Process,

          expVal: params.expVal,
          minTolerance: params.minTolerance,
          maxTolerance: params.maxTolerance,
          expVisInspec: params.expVisInspec,
          // EvaluationMethod: params.EvaluationMethod,
        }
        : Process
    );
    setRowsDataCopy(updatedList);

    const checkList = selectedrowsprocess.map((Process) =>
      Process.id === params.id
        ? {
          ...Process,

          expVal: params.expVal,
          minTolerance: params.minTolerance,
          maxTolerance: params.maxTolerance,
          expVisInspec: params.expVisInspec,
          // EvaluationMethod: params.EvaluationMethod,
        }
        : Process
    );
    setSelectedRowsProcess(checkList);
    console.log("updatedList", updatedList);
  };
  ///////////////////////////////////////////
  function SkipFieldsAction(props) {
    const { selectedRow } = props;

    const handleSkipChange = (e) => {
      const updatedSkipValues = {
        ...skipValues,
        [selectedRow.id]: e.target.value,
      };
      setSkipValues(updatedSkipValues);
    };

    return (
      <>
        <FormControl fullWidth>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={skipValues[selectedRow.id] || ""}
            label="Skip"
            onChange={handleSkipChange}
          >
            <MenuItem value={"Y"}>Y</MenuItem>
            <MenuItem value={"N"}>N</MenuItem>
          </Select>
        </FormControl>
      </>
    );
  }

  function QualityFieldsAction(props) {
    const { selectedRow } = props;

    const handleQualityChange = (e) => {
      const updatedQualityValues = {
        ...qualityValues,
        [selectedRow.id]: e.target.value,
      };
      setQualityValues(updatedQualityValues);
    };

    return (
      <>
        <FormControl fullWidth>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={qualityValues[selectedRow.id] || ""}
            label="Quality"
            onChange={handleQualityChange}
          >
            <MenuItem value={"Y"}>Y</MenuItem>
            <MenuItem value={"N"}>N</MenuItem>
          </Select>
        </FormControl>
      </>
    );
  }

  function CheckBoxData(props) {
    const { selectedRow } = props;

    const handleCheckboxChange = (e) => {
      const updatedSelectedCheckboxes = {
        ...selectedCheckboxes,
        [selectedRow.id]: e.target.checked,
      };
      setSelectedCheckboxes(updatedSelectedCheckboxes);

      const isChecked = e.target.checked;

      if (isChecked) {
        // If the checkbox is checked, add the selected row to the array
        setSelectedRows((prevSelectedRows) => [
          ...prevSelectedRows,
          selectedRow,
        ]);
      } else {
        // If the checkbox is unchecked, remove the selected row from the array
        setSelectedRows((prevSelectedRows) =>
          prevSelectedRows.filter((row) => row.id !== selectedRow.id)
        );
      }
    };

    return (
      <Checkbox
        {...label}
        checked={selectedCheckboxes[selectedRow.id] || false}
        onChange={handleCheckboxChange}
      />
    );
  }

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handleSuccess = (dataObject) => {
    setRowsData(dataObject?.data || []);

    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      ClearData();
      handleClose();
    }, 2000);
  };
  const handleException = (errorObject, errorMessage) => {
    console.log("the error ", errorMessage);
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      ClearData();
      handleClose();
    }, 2000);
  };

  const ClearData = () => {
    // window.location.reload();
    setProcessList([]);
    setSelectedRows([]);
    setEditCount({});
    setEditedCycleTime({});
    setEditedProcessPriority({});
    setEditedSkip("NO");
    setEditedQuality("YES");
    setSelectedCheckboxes({});
    // setItemNo('');
    setFile('')
    setLogRetensionPeriod('');
    setTimeout(() => {
      // GetItemVsProcessProcessList(handleItemVsProcessListSucessShow, handleItemVsProcessListExceptionShow);
    }, 1000);
  };

  const handleExcelModelOpen = () => {
    setExcelModal(true);
  };

  const handleCopyFromModelOpen = () => {
    setCopyFromModal(true);
  }

  const optionsSuppItemList = itemList.map((item) => ({
    // let optionsSuppItemList = suppItemTestingArray.map(item => ({
    id: item.id,
    label: item.itemName,
    // schDate: item.schDate,
    // poQty: item.poQty
  }));

  const handleSupplierSearchItemChange = (value) => {
    console.log("handleSupplierSearchItemChange", value.id);
    // setSelectedItems((prevSelectedItems) => [...prevSelectedItems, value]);
    if (value !== null) {
      setSelectedItemId(value.id);
    }
  };
  const buttonStyle = {
    variant: "contained",
    // color: "primary",
    component: "label",
    sx: {
      marginRight: "8px",
      backgroundColor: "#002D68",
      height: "40px",
      borderRadius: "20px",
      width: "200px",
    },
  };
  const buttonStyle1 = {
    variant: "contained",
    // color: "primary",
    component: "label",
    sx: {
      marginRight: "8px",
      backgroundColor: "#002D68",
      height: "40px",
      borderRadius: "20px",
      width: "150px",
    },
  };

  const handleBlur = (e) => {
    // Assuming 'itemno' is the value from the textbox
    const itemnoValue = e.target.value.trim();

    // Check if the value is present in the textbox
    if (itemnoValue !== "") {
      Itemno(
        {
          item: itemnoValue,
        },
        handleSuccess,
        handleException
      );
    } else {
      // Handle the case when the value is empty (optional)
      console.log("Textbox value is empty");
    }
  };

  const handleTemplateDownload = () => {
    PartProcessInspectionTemplate(handleTemplateDownloadSuccess, handleTemplateDwonalodException)
  }

  const handleTemplateDownloadSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: "Template Download Sucess",
    });
    setTimeout(() => {
      ClearData();
      handleClose();
    }, 2000);
  }

  const handleTemplateDwonalodException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      ClearData();
      handleClose();
    }, 2000);
  }

  const handleItemImportSucess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      ClearData();
      handleClose();
      setUploadLoader(false);
    }, 2000);
  }

  const handleItemImportException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      ClearData();
      handleClose();
      setUploadLoader(false);
    }, 2000);
  }

  const handleAutocompleteChange = (selectedValue) => {
    if (!selectedValue) {
      setItemNo("");
      return;
    }
    setItemNo(selectedValue?.label);


    if (selectedType === "Inward") {
      InwardItemnoshow(
        { id: selectedValue?.id },
        handleInwardSuccess,
        handleinwardException
      );
    } else if (selectedType === "Assembly") {
      AssemblyItemnoshow(
        { id: selectedValue?.id },
        handleInwardSuccess,
        handleinwardException
      );
    } else {
      Itemno(
        {
          item: selectedValue?.label,
          type: selectedType
        },
        handleSuccess,
        handleException
      );
    }

  };

  const handleInwardSuccess = (dataObject) => {
    setRowsData(dataObject?.data || []);

    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      ClearData();
      handleClose();
    }, 2000);
  };
  const handleinwardException = (errorObject, errorMessage) => {
    console.log("the error ", errorMessage);
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      ClearData();
      handleClose();
    }, 2000);
  };
  const textEntery = (e) => {
    const inputText = e.target.value;

    if (!inputText) {
      setJobCardNumberList([]);
      setItemShowListSeach([]);
      return;
    }
    if (selectedType === "Inward" || selectedType === "Assembly") {
      ItemSearchNAAJ(
        { text: inputText },
        handleItemSearchNAAJSucees,
        handleItemSearchNAAJException
      );
    }
    // ItemVsPmSearch({
    //   text: e.target.value
    // }, handleItemVsPmSearchSucees, handleItemVsPmSearchException);
    // 👉 "Inward" and other types → call ItemVsPmSearch
    if (selectedType === "Production") {
      ItemVsPmSearch(
        { text: inputText },
        handleItemVsPmSearchSucees,
        handleItemVsPmSearchException
      );
    }
  }

  const handleItemVsPmSearchSucees = (dataObject) => {
    setJobCardNumberList(dataObject?.data || []);
  };

  const handleItemVsPmSearchException = () => {

  };

  const handleItemSearchNAAJSucees = (dataObject) => {
    setItemShowListSeach(dataObject?.data || []);
  }

  const handleItemSearchNAAJException = () => {

  }

  const options = jobCardNumberList.map(item => ({
    id: item?.id,
    label: item?.label
  }));
  const options1 = itemShowListSeach.map(item => ({
    id: item?.id,
    label: item?.label
  }));

  useEffect(() => {
    console.log('data uploading ', file);
    if (file) {
      PartProcessInspectionXLUpload({
        file: file
      }, handleItemImportSucess, handleItemImportException);
    }
  }, [file]);

  ////////////////////////////////////////////////////////////////

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const names = [
    'Sample Based',
    'Complete',
    'SPC',
  ];


  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    // Ensure only up to 2 selections are allowed
    if (typeof value === 'string') {
      setInspectionType(value.split(','));
    } else if (value.length <= 2) {
      setInspectionType(value);
    }
  };


  // ✅ Select All handler
  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);

    if (checked) {
      // select all rows
      setSelectedRowsProcess([...rows]);
    } else {
      // unselect all rows
      setSelectedRowsProcess([]);
    }
  };




  return (
    <div style={{ height: "100%", width: "100%" }}>
      {uploadLoader &&
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', width: '100%', height: '80%' }}>
          <CircularProgress />
        </Box>
      }
      <PartProcessVsInspectionTitle
        setIsAddButton={setIsAddButton}
        setEditeData={setEditeData}
        setOpen={setOpen}
      />

      <Grid container spacing={2} padding={2} style={{
        marginTop: '-40px'
      }}>
        {/* Left Grid */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Box sx={{ minWidth: 320, width: 420, display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedType}
                  size="small"
                  label="Type"
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setRowsData([]);
                    setJobCardNumberList([]);
                    setItemShowListSeach([]);
                    setItemNo('')
                  }
                  }
                >
                  <MenuItem value={'Production'}>Production</MenuItem>
                  <MenuItem value={'Assembly'}>Assembly</MenuItem>
                  <MenuItem value={'Inward'}>Inward</MenuItem>

                </Select>
              </FormControl>

              <FormControl fullWidth >
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  // options={options}
                  options={selectedType === "Production" ? options : options1}
                  // value={itemno}
                  value={itemno ? { label: itemno } : ''}
                  size="small"
                  renderInput={(params) => <TextField   {...params} label="Search By Item Code "
                    onChange={textEntery}
                  />}
                  onChange={(event, value) => handleAutocompleteChange(value)}
                // onBlur={handleBlur}
                />
              </FormControl>
            </Box>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>

            <Button {...buttonStyle} disabled={isModuleLocked} onClick={handleCopyFromModelOpen}>Copy From</Button>

            <Button {...buttonStyle} disabled={isModuleLocked} onClick={handleTemplateDownload}>Template</Button>



            <Button
              variant="contained"
              component="label"
              htmlFor="upload-photo"
              sx={{ backgroundColor: isModuleLocked ? 'gray' : '#002D68', height: '40px', borderRadius: '20px' }}
              disabled={isModuleLocked}
            >
              Upload File
            </Button>
            <input
              id="upload-photo"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (reader.readyState === 2) {
                      setFile(reader.result);
                      console.log("reader.result:", reader.result);
                      setUploadLoader(true);
                    }
                  };
                  reader.readAsDataURL(file);

                  // Reset the input value to allow re-uploading the same file
                  e.target.value = '';
                }
              }}
            />

            {/* <Button {...buttonStyle}>Copy From</Button> */}
          </div>
        </Grid>

        <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {/* Card for the left grid */}
            <Card
              style={{
                boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
                width: "100%",
                height: "100%",
                marginTop: '-5px'
              }}
            >
              <CardContent>
                {/* Autocomplete for the left grid */}

                {/* DataGrid for the left grid */}
                <DataGrid

                  rows={rowsData}
                  columns={columns1}
                  pageSize={8}
                  rowsPerPageOptions={[8]}
                  disableSelectionOnClick
                  sx={{
                    overflow: "auto",
                    height: "55vh",
                    width: "100%",
                    '& .super-app-theme--header': {
                      WebkitTextStrokeWidth: '0.6px',
                    },
                    '& .MuiDataGrid-cell': {
                      border: '1px solid #969696',
                    },
                    '& .MuiDataGrid-columnHeader': {
                      border: '1px solid #969696', // Add border to column headers
                    },
                    '& .super-app-theme--header': {
                      backgroundColor: '#93bce6',
                      color: '#1c1919'
                    },
                  }}
                  getRowClassName={(params) => {
                    // Find the index of the row within the rows array
                    const rowIndex = rowsData.findIndex(row => row.id === params.row.id);
                    // Check if the index is valid
                    if (rowIndex !== -1) {
                      console.log(' ');
                      return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                    }
                    return ''; // Return default class if index is not found
                  }}
                  rowHeight={40}
                  columnHeaderHeight={40}
                />
              </CardContent>
            </Card>
          </div>
        </Grid>

        {/* Right Grid */}
        <Grid item xs={9.5} sm={9.5} md={9.5} lg={9.5}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {/* Card for the right grid */}
            <Card
              style={{
                boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
                width: "100%",
                height: "100%",
                marginTop: '-5px'
              }}
            >
              <CardContent>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FormControl sx={{ width: 300, marginBottom: "10px" }}>
                    <InputLabel id="demo-multiple-checkbox-label">
                      Inspection Type
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      size="small"
                      value={inspectionType}
                      onChange={handleChange}
                      input={<OutlinedInput label="Inspection Type" />}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {names.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={inspectionType.includes(name)} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* ✅ Checkbox outside, next to dropdown */}
                  {/* <FormControlLabel
        control={
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAll}
            color="primary"
          />
        }
        label="Select All"
      /> */}
                </div>
                {/* DataGrid for the right grid */}
                <DataGrid
                  processRowUpdate={handleCellEdit}
                  rows={rowsDataCopy}
                  columns={columns2}
                  pageSize={8}
                  rowsPerPageOptions={[8]}
                  disableSelectionOnClick
                  style={{ border: "none" }}
                  sx={{
                    overflow: "auto",
                    height: "50vh",
                    width: "100%",
                    '& .super-app-theme--header': {
                      WebkitTextStrokeWidth: '0.6px',
                    },
                    '& .MuiDataGrid-cell': {
                      border: '1px solid #969696',
                    },
                    '& .MuiDataGrid-columnHeader': {
                      border: '1px solid #969696', // Add border to column headers
                    },
                    '& .super-app-theme--header': {
                      backgroundColor: '#93bce6',
                      color: '#1c1919'
                    },
                  }}
                  getRowClassName={(params) => {
                    // Find the index of the row within the rows array
                    const rowIndex = rowsDataCopy.findIndex(row => row.id === params.row.id);
                    // Check if the index is valid
                    if (rowIndex !== -1) {
                      console.log(' ');
                      return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                    }
                    return ''; // Return default class if index is not found
                  }}
                  rowHeight={40}
                  columnHeaderHeight={40}
                />
              </CardContent>
            </Card>
          </div>
          <PartProcessAddModel
            isAddButton={isAddButton}
            open={open}
            setOpen={setOpen}
            setRefreshData={setRefreshData}
            handleClose={handleClose}
            openNotification={openNotification}
            setNotification={setNotification}
          />
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        {/* <Button
          onClick={() => setIsModalOpen(true)}
          {...buttonStyle1}
          style={{ marginRight: "20px" }}
        >
          Add
        </Button> */}
        {isModalOpen && (
          <PartProcessAddModel
            isModalOpen={isModalOpen}
            proceesId={checkBoxProcessId}
            tempId={tempId}
            setIsModalOpen={setIsModalOpen} // Ensure the correct prop name
            isAddButton={true} // or false based on your logic
            setRefreshData={() => { }}
            setNotification={() => { }}
          />
        )}
        {/* <Button
          // type="submit"
          {...buttonStyle1}
          style={{ marginRight: "20px" }}
          onClick={handleSubmit}
          disabled={inspectionType.length > 0 ? false : true}
        >
          Save
        </Button> */}
        <Button
          {...buttonStyle1}
          style={{ marginRight: "20px" }}
          onClick={handleSubmit}
          disabled={loading || isModuleLocked} // disable on loading
        >
          {loading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Save"
          )}
        </Button>

      </Grid>

      <CopyForm
        copyFromModal={copyFromModal}
        setCopyFromModal={setCopyFromModal}
        type={'quality'}
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

export default PartProcessVsInspectionResult;
