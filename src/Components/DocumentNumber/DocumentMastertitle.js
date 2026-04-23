import React, { useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import ExcelTemplateDownloader from "../../ApiService/ExcelTemplateDownloader";
import {
  DownloadSobExlTemplate,
  DownloadSupExcelTemplate,
} from "../../ApiService/DownloadCsvReportsService";
import {
  SobExlImport,
  SupExcelImport,
} from "../../ApiService/LoginPageService";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import ApplicationStore from "../../Utility/localStorageUtil";
import { useModuleLocks } from "../context/ModuleLockContext";

const DocumentMastertitle = (props) => {
  const [file, setFile] = useState(null);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });

  const { userDetails } = ApplicationStore()?.getStorage("userDetails");
  const userPermission = userDetails?.groupRights?.filter(
    (data) => data?.menu?.toLowerCase() === "holidaymaster"
  );

  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Financial Year")?.lockStatus === "locked";

  const handleFileUpload = () => { };

  const DownloadSupExcelTemplateSuccess = () => { };

  const DownloadSupExcelTemplateException = () => { };

  const SupExcelImportSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
      setFile("");
    }, 5000);
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      {/* Left Side: Typography */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
          variant="h5"
        >
          Financial Year Overview
        </Typography>
      </Box>

      {/* Right Side: Buttons */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: props.isAdmin ? "#002d68" : "gray",
            color: "white"
          }}
          disabled={!props.isAdmin || props.selectedRows.length === 0}
          onClick={props.handleSetActive}
        >
          Save
        </Button>
        <Fab
          style={{
            background: userPermission[0]?.addData === 0 || isModuleLocked ? "gray" : "#002D68",
            color: userPermission[0]?.addData === 0 || isModuleLocked ? "black" : "white",
          }}
          disabled={userPermission[0]?.addData === 0 || isModuleLocked}
          onClick={() => {
            props.setIsAddButton(true);
            props.setEditData([]);
            props.setOpen(true);
          }}
          variant="extended"
          size="medium"
          color="primary"
          aria-label="add"
        >
          <AddIcon sx={{ mr: 1 }} />
          Create Financial Year
        </Fab>
      </Box>

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </Box>

  );
};

export default DocumentMastertitle;
