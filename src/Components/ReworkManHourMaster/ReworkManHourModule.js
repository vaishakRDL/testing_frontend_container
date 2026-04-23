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
    MaterialRateAdd,
    MaterialRateUpdate,
    PurchaseReportSearchItem,
    QualityInsMstAdd,
    QualityInsMstUpdate,
    QualityProcess,
    ReworkManHourAdd,
    ReworkManHourUpdate,
} from "../../ApiService/LoginPageService";

const ReworkManHourModule = ({
    open,
    setOpen,
    isAddButton,
    editManHourRate,
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

    const UserOptions = [
        "Skilled Persons",
        "Inspectors",
        "Engineers",
        "Punching",
        "Power Press",
        "Laser",
        "Bending",
        "Welding",
        "Painting",
        "Powder Coating",
        "Plating",
    ];


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


    const handleClose = () => {
        setOpen(false);
        ClearData();
    };

    useEffect(() => {
        setRate(editManHourRate?.rate || "");
        setSelectedItem(editManHourRate?.user || "");

    }, [editManHourRate]);


    const handleCloseNotification = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };
    const ClearData = () => {
        setRate("");
        setItemList([]);
        setSelectedItem("");
        setRefreshData((oldValue) => !oldValue);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        isAddButton === true
            ? ReworkManHourAdd(
                {
                    user: selectedItem,
                    rate: rate,
                },
                handleSuccess,
                handleException
            )
            : ReworkManHourUpdate(
                {
                    id: editManHourRate.id,
                    user: selectedItem,
                    rate: rate,
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
                        {isAddButton ? "Add Man Hour Rate" : "Edit Man Hour Rate"}
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{ marginTop: "10px" }}>

                            {/* <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <Autocomplete
                  multiple={false}
                  options={itemList}
                  getOptionLabel={(option) => option.material || ""} // ✅ Show material name
                  // size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Material"
                      onChange={handleItemChange}
                    />
                  )}
                  onChange={(event, value) => handleItemSelect(value)}
                />
              </Grid> */}
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="material-label">Select Material</InputLabel>

                                    <Select
                                        labelId="material-label"
                                        value={selectedItem}
                                        label="Select Material"
                                        size="medium"
                                        onChange={(e) => setSelectedItem(e.target.value)}
                                    >
                                        {UserOptions.map((item) => (
                                            <MenuItem key={item} value={item}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>


                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
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

export default ReworkManHourModule;
