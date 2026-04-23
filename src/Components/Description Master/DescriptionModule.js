
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
import { useState, useRef, useCallback } from "react";
import {

    COPQSearchItem,
    DescriptionMasterAdd,
    DescriptionMasterUpdate,
    MaterialRateAdd,
    MaterialRateUpdate,
    PurchaseReportSearchItem,
    QualityInsMstAdd,
    QualityInsMstUpdate,
    QualityProcess,
    ReworkManHourAdd,
    ReworkManHourUpdate,
} from "../../ApiService/LoginPageService";

const DescriptionModule = ({
    open,
    setOpen,
    isAddButton,
    editDescription,
    setRefreshData,
    setNotification,
}) => {
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);




    const handleClose = () => {
        setOpen(false);
        ClearData();
    };

    useEffect(() => {
        setDescription(editDescription?.description || "");

    }, [editDescription]);


    const handleCloseNotification = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };
    const ClearData = () => {
        setRefreshData((oldValue) => !oldValue);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        isAddButton === true
            ? DescriptionMasterAdd(
                {
                    description: description,
                },
                handleSuccess,
                handleException
            )
            : DescriptionMasterUpdate(
                {
                    id: editDescription.id,
                    description: description,
                },
                handleUpdateSuccess,
                handleException
            );
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
            handleCloseNotification();
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
            handleCloseNotification();
            setRefreshData((oldValue) => !oldValue);
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        setLoading(false);

        setNotification({
            status: true,
            type: "error",
            message: errorMessage,
        });
        setTimeout(() => {

            setRefreshData((oldValue) => !oldValue);
        }, 2000);
    };


    return (
        <div>
            <Dialog
                sx={{ "& .MuiDialog-paper": { width: "25%", maxHeight: "100%" } }}
                maxWidth="md"
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
                        {isAddButton ? "Add Description" : "Edit Description"}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{ marginTop: "10px" }}>

                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    placeholder="Enter Description"
                                    variant="outlined"
                                    required
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                    }}
                                    value={description}
                                />
                            </Grid>
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

export default DescriptionModule;
