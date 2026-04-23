
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
    DescriptionMasterLogAdd,
    DescriptionMasterLogShowData,
    DescriptionMasterLogUpdate,
    DescriptionMasterShowData,
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

const DescriptionLogModule = ({
    open,
    setOpen,
    isAddButton,
    editDescriptionLog,
    setRefreshData,
    setNotification,
}) => {
    const [descriptionlist, setDescriptionlist] = useState("");
    const [date, setDate] = useState("");
    const [descriptionOptions, setDescriptionlOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cost, setCost] = useState("");



    const handleClose = () => {
        setOpen(false);
        ClearData();
    };

    useEffect(() => {
        DescriptionMasterShowData(handleReworkManHourShow, handeReworkManHourException);
        setDate(editDescriptionLog?.date || "");
        setDescriptionlist(editDescriptionLog?.descId || "");
        setCost(editDescriptionLog?.cost || "")
    }, [editDescriptionLog]);

    const handleReworkManHourShow = (dataObject) => {
        setDescriptionlOptions(dataObject?.data || []);
    }

    const handeReworkManHourException = (errorStatus, errorMessage) => {
        console.log(errorMessage);
    }

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
            ? DescriptionMasterLogAdd(
                {
                    date,
                    descId: descriptionlist,
                    cost
                },
                handleSuccess,
                handleException
            )
            : DescriptionMasterLogUpdate(
                {
                    id: editDescriptionLog.id,
                    date,
                    descId: descriptionlist,
                    cost
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
                        {isAddButton ? "Add Description Log" : "Edit Description Log"}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{ marginTop: "10px" }}>

                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    // label="Date"
                                    // placeholder="Selct Date"
                                    variant="outlined"
                                    required
                                    type="date"
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                    }}
                                    value={date}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <FormControl fullWidth size="fullWidth" required>
                                    <InputLabel id="description-label">Description</InputLabel>

                                    <Select
                                        labelId="description-label"
                                        value={descriptionlist}
                                        label="Description"
                                        onChange={(e) => setDescriptionlist(e.target.value)}
                                    >
                                        {descriptionOptions.map((item) => (
                                            <MenuItem key={item} value={item.id}>
                                                {item.description}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <TextField
                                    fullWidth
                                    label="Cost "
                                    placeholder="Enter Cost"
                                    variant="outlined"
                                    required
                                    onChange={(e) => {
                                        setCost(e.target.value);
                                    }}
                                    value={cost}
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

export default DescriptionLogModule;
