import {
  Button,
  Dialog,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";
import {
  COPQMstAdd,
  COPQMstUpdate,
  COPQSearchItem,
  PurchaseReportSearchItem,
  QualityInsMstAdd,
  QualityInsMstUpdate,
  QualityProcess,
} from "../../ApiService/LoginPageService";

const QOPCModel = ({
  open,
  setOpen,
  isAddButton,
  editQuality,
  setRefreshData,
  setNotification,

}) => {
  const [quality, setQuality] = useState("");
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [Process, setProcess] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  const handleClose = () => {
    setOpen(false);
    ClearData();
  };

  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  const debouncedMaterialSearch = useRef(
    debounce((value) => {
      COPQSearchItem(
        { code: value },
        handleSearchItemSucessShow,
        handleSearchItemExceptionShow
      );
    }, 400)
  ).current;
  useEffect(() => {
    setSelectedProcess(editQuality?.processId || "");
    setSelectedItem(editQuality?.material || '')
    QualityProcess(
      handleQualityProcessServicesSuccess,
      handleQualityProcessServicesExcepation
    );
  }, [editQuality]);

  const handleQualityProcessServicesSuccess = (dataObject) => {
    setProcess(dataObject?.data || []);
  };

  const handleQualityProcessServicesExcepation = (
    errorObject,
    errorMessage
  ) => {
    console.log("error Msg", errorMessage);
  };

  const ClearData = () => {
    setSelectedProcess("");
    setRate("");
    setItemList([]);
    setSelectedItem("");
    setRefreshData((oldValue) => !oldValue);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    isAddButton === true
      ? COPQMstAdd(
        {
          processId: selectedProcess,
          material: selectedItem?.material || "",
        },
        handleSuccess,
        handleException
      )
      : COPQMstUpdate(
        {
          id: editQuality.id,
          processId: selectedProcess,
          material: selectedItem?.material || "",
        },
        handleUpdateSuccess,
        handleException
      );
  };

  const handleSuccess = (dataObject) => {
    console.log(dataObject);
    setLoading(false);
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      ClearData();
      handleClose();
      setRefreshData((oldValue) => !oldValue);
    }, 2000);
  };

  const handleUpdateSuccess = (dataObject) => {
    setLoading(false);
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      ClearData();
      handleClose();
      setRefreshData((oldValue) => !oldValue);
    }, 2000);
  };

  const handleException = (errorObject, errorMessage) => {
    console.log(errorMessage);
    setLoading(false);

    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // ClearData();
      // handleClose();
      setRefreshData((oldValue) => !oldValue);
    }, 2000);
  };

  // const handleItemChange = (e) => {
  //   COPQSearchItem(
  //     { code: e.target.value },
  //     handleSearchItemSucessShow,
  //     handleSearchItemExceptionShow
  //   );
  // };

  const handleSearchItemSucessShow = (dataObject) => {
    setItemList(dataObject?.data || []);
  };
  const handleSearchItemExceptionShow = (errorObject, errorMessage) => { };

  const handleItemSelect = (value) => {
    if (value !== null && value.length > 0) {
      const names = value.map((item) => item.material).join(", "); // ✅ join into string
      setSelectedItem(names);
      console.log("names------------->>>>>>>>>", names);
    } else {
      setSelectedItem(""); // empty string if nothing is selected
    }
  };


  return (
    <div>
      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "45%", maxHeight: "100%" } }}
        maxWidth="lg"
        open={open}
      >
        <form onSubmit={onSubmit}>
          <DialogTitle
            style={{
              background: "#002D68",
              color: "white",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {isAddButton ? "Add Process Rate" : "Edit Process Rate"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} style={{ marginTop: "10px" }}>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Process</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Process"
                    variant="filled"
                    // size="small"
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


              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <Autocomplete
                  freeSolo
                  options={itemList}
                  value={selectedItem}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option?.material || ""
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.material === value.material
                  }

                  onInputChange={(event, inputValue, reason) => {
                    if (reason !== "input") return;
                    debouncedMaterialSearch(inputValue);
                  }}

                  onChange={(event, value) => {
                    if (typeof value === "string") {
                      setSelectedItem({ material: value });
                    } else {
                      setSelectedItem(value);
                    }
                  }}

                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Material"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />

              </Grid>
              {/* <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <TextField
                  fullWidth
                  label="Rate"
                  placeholder="Rate"
                  variant="outlined"
                  required
                  onChange={(e) => {
                    setRate(e.target.value);
                  }}
                  value={rate}
                />
              </Grid> */}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : isAddButton ? (
                "Add"
              ) : (
                "Update"
              )}
            </Button>
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <DialogActions></DialogActions>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default QOPCModel;
