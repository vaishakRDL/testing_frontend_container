import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, CircularProgress, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl } from "@mui/material";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { GetShift, ShowProcessMaster, getMachineUOM, Qualityuom, AddNewQcField, TemplateEdit, QualityInsMstShowData } from "../../ApiService/LoginPageService";
import { useLocation } from "react-router-dom";

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

const QualityModule = ({ open, setOpen, isAddButton, editData, setRefreshData }) => {
  const URL = "https://varmatrix.com/MachoVersion2/Macho";
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [machineOperator, setMachineOperator] = useState([]);
  const [machineOperatorID, setMachineOperatorID] = useState([]);
  console.log("machineOperator", machineOperator);
  console.log("machineOperatorID", machineOperatorID);
  const [utilizationUnits, setUtilizationUnits] = useState("");
  console.log("utilizationUnits", utilizationUnits);
  const [days, setDays] = useState("");
  const [checkedDays, setCheckedDays] = useState({ Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false, });
  console.log("checkedDays", checkedDays);
  const [selectedShift, setSelectedShift] = useState([]);
  console.log("selectedShift", selectedShift);
  const [rowId, setRowId] = useState("");
  const [machineOperatorList, setMachineOperatorList] = useState([]);
  const [shiftList, setShiftList] = useState([]);
  const [machineUOMList, setMachineUOMList] = useState([]);
  const [uom, setUom] = useState("");
  const [uomList, setUomList] = useState([]);
  const [displaylable, SetDisplayLabel] = useState("");
  const [inspection, SetInspection] = useState("");
  const [inspectionList, SetInspectionList] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tempId = searchParams.get("id");
  const processId = searchParams.get("processId");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setOpen(open);
    open &&
      ShowProcessMaster(
        handleMachineOperatorSucessShow,
        handleMachineOperatorExceptionShow
      );
    open && GetShift(handleShiftSucessShow, handleShiftExceptionShow);
    !isAddButton && loaderData();
  }, [editData]);

  useEffect(() => {
    Qualityuom(handleUomServicesSuccess, handleUomServicesExceptoin);
    QualityInsMstShowData(handleQualityInsshow, handleQualityInsException);
  }, []);

  const handleQualityInsshow = (dataObject) => {
    SetInspectionList(dataObject?.data || []);
    console.log(dataObject?.data);
  }

  const handleQualityInsException = (error, errorMessage) => {
    console.log(errorMessage);
  }

  const handleUomServicesSuccess = (dataObject) => {
    setUomList(dataObject?.data || []);
  };

  const handleUomServicesExceptoin = (errorObject, errorMessage) => {
    console.log("error Msg", errorMessage);
  };

  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    if (isAddButton) {
      AddNewQcField(
        {
          tempId: tempId,
          label: displaylable,
          processId: processId,
          uom: uom,
          inspectionType: inspection
        },
        handleSuccess, handleException);
    } else {
      TemplateEdit(
        {
          id: rowId,
          label: displaylable,
          uom: uom,
          processId: processId,
          inspectionType: inspection,
          tempId: tempId
        },
        handleSuccess, handleException);
    }
  };

  const handleSuccess = (dataObject) => {
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
    setLoading(false);
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

  const handleMachineOperatorSucessShow = (dataObject) => {
    setMachineOperatorList(dataObject?.data || []);
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
    setUom("");
    SetDisplayLabel("");
    SetInspection("")
  };

  const loaderData = () => {
    setRowId(editData?.id || "");
    SetDisplayLabel(editData?.label || "");
    setUom(editData?.uomId || "");
    SetInspection(editData?.inspectionId || "");

  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const isAllChecked = Object.values(checkedDays).every(
    (value) => value === true
  );

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { minWidth: "50%" } }}
      maxWidth="lg"
      open={open}>
      <DialogTitle style={{ background: "#002D68", color: "white" }}>
        {isAddButton ? "QC Field" : "Edit "}
      </DialogTitle>
      <DialogContent style={{ paddingTop: "20px" }}>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                id="filled-basic"
                label="Display Label"
                variant="filled"
                sx={{ mb: 1 }}
                margin="dense"
                size="small"
                fullWidth
                required
                value={displaylable}
                onChange={(e) => SetDisplayLabel(e.target.value)}
                placeholder="Display Label"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{ marginTop: "7px" }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">UOM</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="UOM"
                  variant="filled"
                  value={uom}
                  onChange={(e) => setUom(e.target.value)}>
                  {uomList.map((data) => (
                    <MenuItem key={data.id} value={data?.id}>
                      {data?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Type Of Instrument</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Instrument"
                  variant="filled"
                  value={inspection}
                  onChange={(e) => SetInspection(e.target.value)}>
                  {inspectionList.map((data) => (
                    <MenuItem key={data.id} value={data?.id}>
                      {data?.inspectionType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                isAddButton ? "Add" : "Update"

              )}

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

export default QualityModule;
