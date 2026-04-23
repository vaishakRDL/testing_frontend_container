import {
  Button,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";
import { Card } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { CustomerUploadFile } from "../../../ApiService/LoginPageService";

const FileUploadModule = ({
  fileUploadOpen,
  setFileUploadOpen,
  autoCustomId,
  uploadedFiles,
  setUploadedFiles,
}) => {
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [fileUpload, setFileUpload] = useState("");
  const [file, setFile] = useState("");
  const [selectFileName, setSelectFileName] = useState("");
  // const [uploadedFiles, setUploadedFiles] = useState([]);

  //     e.preventDefault();
  //     CustomerUploadFile({
  //         cId: autoCustomId,
  //         file: file,
  //         fileType: fileUpload,

  //     }, handleCustomerUploadFileSuccess, handleCustomerUploadFileException);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectFileName || !fileUpload) {
      alert("Please select a file name and upload a file.");
      return;
    }
    const uniqueId = Date.now();
    // Append new file data to uploadedFiles state
    setUploadedFiles((prev) => [
      ...prev,
      { id: uniqueId, fileType: selectFileName, file: fileUpload },
    ]);

    // Reset fields after submission
    setSelectFileName("");
    setFileUpload(null);
  };

  const handleCustomerUploadFileSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      setFile("");
      setFileUpload("");
      handleClose();
    }, 2000);
  };

  const handleCustomerUploadFileException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
      setFile("");
      setFileUpload("");
    }, 2000);
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handlefileClose =() =>{
    setFileUploadOpen(null);
    setSelectFileName("");
    setFileUpload(null);
}


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFileUpload(reader.result); // Store Base64 encoded string
            // console.log("Base64 File:", reader.result); // Log Base64 output
        };
        reader.readAsDataURL(file); // Convert file to Base64
    }
};

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "100%", maxHeight: "100%" } }}
      maxWidth="md"
      open={fileUploadOpen}
    >
      <DialogTitle style={{ background: "#002D68", color: "white" }}>
        File Upload
      </DialogTitle>
      <DialogContent>
        <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="file-name-label">Select File Name</InputLabel>
                <Select
                  labelId="file-name-label"
                  id="file-name-select"
                  value={selectFileName}
                  size="small"
                  variant="filled"
                  onChange={(e) => setSelectFileName(e.target.value)}
                >
                  <MenuItem value="GST Certificate">GST Certificate</MenuItem>
                  <MenuItem value="Incorporation Certificate">
                    Incorporation Certificate
                  </MenuItem>
                  <MenuItem value="Aadhaar">Aadhaar</MenuItem>
                  <MenuItem value="PanCard">PanCard</MenuItem>
                  <MenuItem value="MSMA Certificate">MSMA Certificate</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                        fullWidth
                        margin="dense"
                        type="file"
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                    if (reader.readyState === 2) {
                                        setFileUpload(reader.result);
                                    }
                                };
                                reader.readAsDataURL(e.target.files[0]);
                            }
                        }}
                    />
                </Grid> */}

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <TextField
                fullWidth
                margin="dense"
                type="file"
                InputLabelProps={{ shrink: true }}
                onChange={handleFileChange}
              />
            </Grid>
          </Grid>

          <DialogActions>
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              type="submit"
              onClick={() => setFileUploadOpen(null)}
            >
              Add
            </Button>
            <Button
              variant="contained"
              style={{ width: "150px", background: "#002D68", color: "white" }}
              onClick={handlefileClose}
            >
              Cancel
            </Button>
          </DialogActions>

          {/* Display uploaded files */}
          {/* <div>
                <h3>Uploaded Files:</h3>
                <ul>
                    {uploadedFiles.map((file, index) => (
                        <li key={index}>
                            {file.fileName} - <a href={file.fileData} target="_blank" rel="noopener noreferrer">View File</a>
                        </li>
                    ))}
                </ul>
            </div> */}
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

export default FileUploadModule;
