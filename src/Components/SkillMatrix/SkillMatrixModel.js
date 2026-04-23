import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Autocomplete,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import React from "react";
import { useState, useEffect } from "react";
import {
  FetchfileID,
  FetchMachineName,
  GetFileData,
  Updateskillmatrix,
} from "../../ApiService/LoginPageService";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
const SkillMatrixModel = ({
  open,
  setOpen,
  isAddButton,
  editSkillMatrix,
  setRefreshData,
}) => {
  console.log("edit daata", editSkillMatrix);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [fileAuto, setFileAuto] = useState("");
  const [machineName, Setmachinename] = useState([]);
  const [selectMachine, setSelectMachine] = useState("");
  const [revisionNumber, setRevisionNumber] = useState("");
  const [revisionDate, setRevisionDate] = useState("");
  const [chooseFile, setchooseFile] = useState("");
  const [ExcelBase64File, setExcelBase64File] = useState("");
  const [rowId, setRowId] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const [viewButton, setViewButton] = useState(false);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const handleCancel = () => {
    setOpen(false);
    // ClearData();
    // ClearData();
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  useEffect(() => {
    if (open) {
      isAddButton && FetchfileID(fileIdDataSucess, fileIdDataException);
      FetchMachineName(FetchMachineNameSuccess, FetchMachineNameException);
      // GetFileData(GetfiledataSuccess, GetfiledataException)
    }
  }, [open]);

  const fileIdDataSucess = (dataObject) => {
    setFileAuto(dataObject?.fileId || "");
    // setRevisionNo(dataObject?.revisionNo || '')
  };

  const fileIdDataException = () => { };
  const FetchMachineNameSuccess = (dataObject) => {
    Setmachinename(dataObject?.data || []);
  };

  const FetchMachineNameException = () => { };

  useEffect(() => {
    loaderData();
  }, [editSkillMatrix]);

  const loaderData = () => {
    setRowId(editSkillMatrix?.id || "");
    setFileAuto(editSkillMatrix?.fileId || "");
    setSelectMachine(editSkillMatrix?.machine || "");
    setRevisionNumber(editSkillMatrix?.revisionNo || "");
    setRevisionDate(editSkillMatrix?.revDate || "");
    setExcelBase64File(editSkillMatrix?.file || "");
    setFileType(editSkillMatrix?.fileType || "");
    setFileName(editSkillMatrix?.fileName || "");
  };

  // const loaderData = () => {
  //   setRowId(editSkillMatrix?.id || "");
  //   setFileAuto(editSkillMatrix?.fileId || "");
  //   setSelectMachine(editSkillMatrix?.machine || "");
  //   setRevisionNumber(editSkillMatrix?.revisionNo || "");

  //   // Date format should be set in DD-MM-YYYY and convert it
  //   const formattedDate = editSkillMatrix?.revDate
  //     ? editSkillMatrix.revDate.split("-").reverse().join("-")  // Convert from API date format "DD-MM-YYYY"
  //     : "";
  //   setRevisionDate(formattedDate);

  //   setExcelBase64File(editSkillMatrix?.file || "");
  // };



  const handleFolderChange = (event) => {
    setSelectedFolder(event.target.files);
    console.log("event.target.files", event.target.files);
  };

  const ClearData = () => {
    setOpen(false);
    setFileAuto("");
    Setmachinename([]);
    setSelectMachine("");
    setRevisionNumber("");
    setRevisionDate("");
    setchooseFile("");
    setExcelBase64File("");
    setFileType("");
    setFileName("");
  };

  const handleSubmit = (e) => {
    if (isAddButton) {
      e.preventDefault();
      setViewButton(true);
      GetFileData(
        {
          machine: selectMachine,
          fileId: fileAuto,
          revisionNo: revisionNumber,
          revDate: revisionDate,
          file: ExcelBase64File,
          fileType: fileType,
          fileName: fileName
        },
        GetfiledataSuccess,
        GetfiledataException
      );
    }
    else {
      Updateskillmatrix(
        {
          id: rowId,
          machine: selectMachine,
          fileId: fileAuto,
          revisionNo: revisionNumber,
          revDate: revisionDate,
          file: ExcelBase64File,
          fileType: fileType,
          fileName: fileName
        },
        GetfiledataSuccess,
        GetfiledataException
      );
    }
  };

  const GetfiledataSuccess = (dataObject) => {
    setViewButton(false);
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setRefreshData((oldvalue) => !oldvalue);
    setTimeout(() => {
      handleClose();
      setOpen(false);
      ClearData();
    }, 3000);
  };

  const GetfiledataException = (errorObject, errorMessage) => {
    setViewButton(false);
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
    }, 2000);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = btoa(
          new Uint8Array(e.target.result).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );

        // Now you have the file as a Base64-encoded string
        // console.log("Base64 String:", base64String);
        setExcelBase64File(base64String);
        console.log("Base64 String:", base64String);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div>
      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "45%", maxHeight: "100%" } }}
        maxWidth="xl"
        open={open}
      >
        <form onSubmit={handleSubmit}>
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
            {isAddButton ? "Add Skill Matrix" : "Edit Skill Matrix "}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} style={{ marginTop: "10px" }}>
              <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                <TextField
                  fullWidth
                  label="File ID"
                  placeholder="File ID"
                  variant="outlined"
                  size="small"
                  required
                  onChange={(e) => {
                    setFileAuto(e.target.value);
                  }}
                  value={fileAuto}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select Machine{" "}
                  </InputLabel>
                  <Select
                    size="small"
                    labelId="demo-simple-selct-label"
                    id="demo-simple-select"
                    label="Energy Source"
                    value={selectMachine}
                    onChange={(e) => {
                      setSelectMachine(e.target.value);
                    }}
                  >
                    {machineName.map((data) => (
                      // <MenuItem value={data.machineName}>{data.machineName}</MenuItem>
                      <MenuItem value={data.machine_tag}>{data.machine_tag}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                <TextField
                  fullWidth
                  label="Revesion Number"
                  placeholder="Revesion Number"
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    setRevisionNumber(e.target.value);
                  }}
                  value={revisionNumber}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                <TextField
                  fullWidth
                  label="Revision Date"
                  placeholder="Revision Date"
                  type="date"
                  variant="outlined"
                  size="small"
                  required
                  onChange={(e) => {
                    setRevisionDate(e.target.value);

                  }}
                  value={revisionDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                // onChange={(e) => {
                //   // Convert from MUI date (YYYY-MM-DD) to DD-MM-YYYY
                //   const [year, month, day] = e.target.value.split("-");
                //   setRevisionDate(`${day}-${month}-${year}`);
                // }}
                // // Convert date from DD-MM-YYYY to YYYY-MM-DD for MUI display
                // // value={revisionDate ? revisionDate.split("-").reverse().join("-") : ""}


                // InputLabelProps={{
                //   shrink: true,
                // }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={4}
                xl={4}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  fullWidth
                  label="Upload Excel"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (reader.readyState === 2) {
                          setExcelBase64File(reader.result);
                        }
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
                  type="file"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                <TextField
                  fullWidth
                  label="File Type"
                  placeholder="File Type"
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    setFileType(e.target.value);
                  }}
                  value={fileType}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                <TextField
                  fullWidth
                  label="File Name"
                  placeholder="File Name"
                  variant="outlined"
                  size="small"
                  onChange={(e) => {
                    setFileName(e.target.value);
                  }}
                  value={fileName}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              type="submit"
              disabled={viewButton}
            >
              {isAddButton ? "Add" : "Update"}
            </Button>
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
        <NotificationBar
          handleClose={handleClose}
          notificationContent={openNotification.message}
          openNotification={openNotification.status}
          type={openNotification.type}
        />
      </Dialog>
    </div>
  );
};

export default SkillMatrixModel;
