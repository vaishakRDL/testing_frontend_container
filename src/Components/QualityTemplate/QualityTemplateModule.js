
import React, { useEffect, useState } from "react";
import {
  Button,
  Box,
  Dialog,
  Tooltip,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  DialogActions,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  CardContent,
  Typography,
  Autocomplete,
  InputAdornment,
  OutlinedInput,
  ListItemText,
  RadioGroup,
  Radio,
  FormGroup,
  CircularProgress,
  FormLabel,
} from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { Card } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DownloadIcon from "@mui/icons-material/Download";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import {
  AddMachine,
  MachineEdit,
  ShowMachineOperator,
  GetShift,
  ShowProcessMaster,
  getMachineUOM,
  QcFieldSubmit,
  QualityProcess,
  QualityTemplate,
  QualityTemplateEdit
} from "../../ApiService/LoginPageService";
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

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const QualityTemplateModule = ({
  open,
  setOpen,
  isAddButton,
  editData,
  setRefreshData,
}) => {
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [customerId, setCustomerID] = useState("");
  const [customerLogo, setCustomerLogo] = useState("");
  const [previewBuilding, setPreviewBuilding] = useState("");
  const [password, setConfirmPassword] = useState("");
  const [alertLogInterval, setAlertLogInterval] = useState("");
  const [deviceLogInterval, setDeviceLogInterval] = useState("");
  const [sensorLogInterval, setSensorLogInterval] = useState("");
  const [dataRetentionPeriodInterval, setDataRetentionPeriodInterval] =
    useState("");
  const [expireDateReminder, setExpireDateReminder] = useState("");
  const [periodicBackupInterval, setPeriodicBackupInterval] = useState("");
  const [btnReset, setBtnReset] = useState(false);
  const [GSTNumber, setGSTNumber] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [primaryContactnumber, setPrimaryContactnumber] = useState("");
  const [secondaryContactnumber, setSecondaryContactnumber] = useState("");
  const [remark, setRemark] = useState("");
  const [fileUpload, setFileUpload] = useState("");
  const [errorObject, setErrorObject] = useState({});
  const [file, setFile] = useState("");
  const URL = "https://varmatrix.com/MachoVersion2/Macho";
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [multiOpen, setMultiOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [partyNotes, setPartyNotes] = useState("");
  const [isEdit, setIsEdit] = useState(true);
  const [selectedType, setSelectedType] = useState('')

  console.log("gfwydgqywgdywq", editData)
  //Quality
  const [Process, setProcess] = useState([]);

  //NEW STATE
  const [personName, setPersonName] = React.useState([]);
  const [utilization, setUtilization] = useState("");
  const [machineName, setMachineName] = useState("");
  const [machineCode, setMachineCode] = useState("");
  const [machineOperator, setMachineOperator] = useState([]);
  const [machineOperatorID, setMachineOperatorID] = useState([]);
  console.log("machineOperator", machineOperator);
  console.log("machineOperatorID", machineOperatorID);
  const [efficiency, setEfficiency] = useState("");
  const [capacityTarget, setCapacityTarget] = useState("");
  const [utilizationUnits, setUtilizationUnits] = useState("");
  console.log("utilizationUnits", utilizationUnits);
  const [days, setDays] = useState("");
  const [checkedDays, setCheckedDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });
  console.log("checkedDays", checkedDays);
  const [time, setTime] = useState("");
  const [selectedShift, setSelectedShift] = useState([]);
  console.log("selectedShift", selectedShift);
  const [machineHourRate, setMachineHourRate] = useState("");
  const [rowId, setRowId] = useState("");
  const [machineOperatorList, setMachineOperatorList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [machineUOMList, setMachineUOMList] = useState([]);

  const [selectedProcess, setSelectedProcess] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [QualityEdit, setQualityEdit] = useState("");
  //

  useEffect(() => {
    setOpen(open);
    // open && ShowProcessMaster(handleMachineOperatorSucessShow, handleMachineOperatorExceptionShow);
    // open && GetShift(handleShiftSucessShow, handleShiftExceptionShow);
    QualityProcess(
      handleQualityProcessServicesSuccess,
      handleQualityProcessServicesExcepation
    );

    !isAddButton && loaderData();
  }, [editData]);

  //Quality Process
  const handleQualityProcessServicesSuccess = (dataObject) => {
    setProcess(dataObject?.data || []);
  };

  const handleQualityProcessServicesExcepation = (
    errorObject,
    errorMessage
  ) => {
    console.log("error Msg", errorMessage);
  };

  //quality template
  const handleQualityTemplateServicesSuccess = (dataObject) => {
    setProcess(dataObject?.data || []);
  };

  const handleQualityTemplateServicesExcepation = (
    errorObject,
    errorMessage
  ) => {
    console.log("error Msg", errorMessage);
  };

  const handleSubmit = (event) => {
    setLoading(true)
    event.preventDefault();
    if (isAddButton) {
      QcFieldSubmit(
        {
          type: selectedType,
          process: selectedProcess,
          tempName: templateName,
          description: description,
        },
        handleSuccess,
        handleException
      );
    } else {
      QualityTemplateEdit(
        {
          id: rowId,
          type: selectedType,
          process: selectedProcess,
          tempName: templateName,
          description: description,
        },
        handleSuccess,
        handleException
      );
    }
  };

  const handleSuccess = (dataObject) => {
    console.log("the dataObject ", dataObject);
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
  const handleException = (errorObject, errorMessage) => {
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

  // GET MACHINE OPERATOR
  const handleMachineOperatorSucessShow = (dataObject) => {
    setMachineOperatorList(dataObject?.data || []);
    // setGridLoading(false);
    console.log("dataObject", dataObject);
  };
  const handleMachineOperatorExceptionShow = (errorObject, errorMessage) => { };

  // GET SHIFT
  const handleShiftSucessShow = (dataObject) => {
    setShiftList(dataObject?.data || []);
    // setGridLoading(false);
    console.log("dataObject", dataObject);
  };
  const handleShiftExceptionShow = (errorObject, errorMessage) => { };

  const ClearData = () => {
    setOpen(false);
    setRefreshData((oldvalue) => !oldvalue);
    setSelectedProcess("");
    setTemplateName("");
    setDescription("");
    setSelectedType("");
  };

  const loaderData = () => {
    setRowId(editData?.id || "");
    setSelectedType(editData?.type || "")
    setSelectedProcess(editData?.processId || "");
    setTemplateName(editData?.tempName || "");
    setDescription(editData?.description || "");
  };

  const validateForNullValue = (value, type) => { };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    // On autofill we get a stringified value.
    const selectedValues = typeof value === "string" ? value.split(",") : value;

    setMachineOperator(selectedValues);

    // Update machineOperatorID based on selected names
    const selectedIDs = selectedValues.map(
      (selectedValue) =>
        machineOperatorList.find((item) => item.name === selectedValue).id
    );
    setMachineOperatorID(selectedIDs);
    getMachineUOM(
      { machOperatorInt: selectedIDs },
      handleMachineUOMSucessShow,
      handleMachineUOMExceptionShow
    );
  };

  // GET UOM LIST
  const handleMachineUOMSucessShow = (dataObject) => {
    setMachineUOMList(dataObject?.data || []);
    // setGridLoading(false);
    console.log("dataObject", dataObject);
  };
  const handleMachineUOMExceptionShow = (errorObject, errorMessage) => { };

  const handleShiftChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedShift(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // const handleUtilizationRadioChange = (event) => {
  //     setUtilization(event.target.value);
  // };

  const handleDayChange = (day) => (event) => {
    setCheckedDays((prevCheckedDays) => ({
      ...prevCheckedDays,
      [day]: event.target.checked,
    }));
  };

  const isAllChecked = Object.values(checkedDays).every(
    (value) => value === true
  );

  const handleAllChange = () => {
    const newCheckedState = {};
    for (const day in checkedDays) {
      newCheckedState[day] = !isAllChecked;
    }
    setCheckedDays(newCheckedState);
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { minWidth: "50%" } }}
      maxWidth="lg"
      open={open}
    >
      <DialogTitle style={{ background: "#002D68", color: "white" }}>
        {isAddButton ? "QC Field" : "Edit "}
      </DialogTitle>
      <DialogContent style={{ paddingTop: "20px" }}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              style={{ marginTop: "7px" }}
            >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedType}
                  variant="filled"
                  size="small"
                  label="Type"
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <MenuItem value={'Production'}>Production</MenuItem>
                  <MenuItem value={'Assembly'}>Assembly</MenuItem>
                  <MenuItem value={'Inward'}>Inward</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              style={{ marginTop: "7px" }}
            >
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Process</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Process"
                  variant="filled"
                  size="small"
                  value={selectedProcess}
                  onChange={(e) => setSelectedProcess(e.target.value)}
                >
                  {Process.map((data) => (
                    <MenuItem key={data.id} value={data?.id}>
                      {data?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                id="filled-basic"
                label="Template Name"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                size="small"
                fullWidth
                required
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Display Label"
              // disabled={!isAddButton}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                id="filled-basic"
                label="Description"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                size="small"
                fullWidth
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Uom"
              // disabled={!isAddButton}
              />
            </Grid>
          </Grid>

          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} style={{ color: 'white' }} />
              ) : (
                isAddButton ? "Add" : "Update")
              }

            </Button>
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              onClick={() => {
                setOpen(false);
                ClearData();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </Dialog>
  );
};

export default QualityTemplateModule;
