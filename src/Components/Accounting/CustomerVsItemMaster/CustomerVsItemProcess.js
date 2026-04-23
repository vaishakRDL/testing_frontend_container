import React from "react";
import { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";
import {
  CustomerCodeDropShow,
  CustomerSelectItemShow,
  CustomervsItemPartShow,
  CustomvsItemDelete,
  CustVsItemAdd,
  ItemCodeCodeDropShow,
  ItemGroupShowMaster,
  UnderLedgerDataShow,
} from "../../../ApiService/LoginPageService";
import CopyFromXl from "./CopyFromXl";
import ImportXlCustItem from "./ImportXlCustItem";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import DeleteConfirmationDailog from "../../../Utility/confirmDeletion";
import RateUpdateXL from "./RateUpdateXL";
import { useModuleLocks } from "../../context/ModuleLockContext";
const CustomerVsItemProcess = () => {
  const [activeButton, setActiveButton] = useState("");
  // const getHighlightStyle = (name, baseStyle = {}) => ({
  //   ...baseStyle,
  //   backgroundColor: activeButton === name ? "#0d6efd" : baseStyle.background,
  //   transition: "0.3s",
  //   color: "white",
  // });
  const getHighlightStyle = (name, baseStyle = {}, disabled = false) => ({
    ...baseStyle,
    backgroundColor: disabled
      ? "grey"
      : activeButton === name
        ? "#0d6efd"   // highlight color
        : baseStyle.backgroundColor,
    transition: "0.3s",
    color: "white",
  });

  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Customer vs Item Price")?.lockStatus === "locked";


  const [deleteId, setDeleteId] = useState("");
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerSelect, setCustomerSelect] = useState("");
  const [itemcodeSelect, setItemCodeSelect] = useState("");
  const [customerSelectList, setCustomerSelectList] = useState([]);
  const [ItemcodeSelectList, setItemcodeSelectList] = useState([]);
  const [partNoList, setPartNoList] = useState([]);
  const [rows, setRows] = useState([]);
  const [customerError, setCustomerError] = useState(false);
  const [customerSid, setCustomerSid] = useState("");
  const [isLoading, setGridLoading] = useState(true);
  const [tableloading, setTableLoading] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [selectedItemCode, setSelectedItemCode] = useState("");
  const [cid, setcid] = useState("");
  const [itemid, setItemid] = useState("");
  const [file, setFile] = useState(null);
  const [copyFromModal, setCopyFromModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([{ id: "RDL1" }]);
  const [excelModal, setExcelModal] = useState(false);
  const [RateUpadteModal, setRateUpadteModal] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [itemListCopy, setItemListCopy] = useState([]);
  const [editModeEnabled, setEditModeEnabled] = useState(false);
  console.log("editModeEnabled", editModeEnabled);
  const [editableRowId, setEditableRowId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [itemGroupList, setItemGroupList] = useState([]);
  const [itemGroup, setItemGroup] = useState("");
  const [underLedger, setUnderLedger] = useState("");
  const [underLedgerList, setUnderLedgerList] = useState([]);
  const [pagelist, setPageList] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 100;

  useEffect(() => {
    ItemGroupShowMaster(
      { masterType: "itemGroup" },
      hadleItemGroupShowMasterSuccess,
      ShowMasterException
    );
    UnderLedgerDataShow(
      { id: "underLedger" },
      UnderLedgerDataShowSuccess,
      ShowMasterException
    );
  }, []);

  useEffect(() => {
    CustomerSelectItemShow(
      { id: customerSelect, code: itemid, page: pageIndex },
      handlePartNoShowSuccess,
      handlePartNoSelectException
    );
  }, [pageIndex]);

  // const handleItemFetchSuccess = (res) => {
  //     setSelectedItems(res?.data || []);
  //     setTotalCount(res?.totalCount || 0);
  // };

  // const handleItemFetchError = (err) => {
  //     console.error("Item Fetch Error:", err);
  // };
  const hadleItemGroupShowMasterSuccess = (dataObject) => {
    setItemGroupList(dataObject?.data || []);
  };
  const UnderLedgerDataShowSuccess = (dataObject) => {
    setUnderLedgerList(dataObject?.data || []);
  };
  const ShowMasterException = (errorObject, errorMessage) => { };

  const handleChangeCustomer = (e) => {
    const value = e?.target?.value;

    // ✅ Clear error if user types anything non-empty
    if (value && value.trim() !== "") {
      setCustomerError(false);
    }

    // ✅ Your existing logic
    if (e !== null) {
      CustomerCodeDropShow(
        { code: value },
        handleCustomerDropshow,
        handleCustomerDropshowException
      );
    }
  };

  const handleChangeItemcode = (e) => {
    if (e !== null) {
      ItemCodeCodeDropShow(
        { id: cid, code: e.target.value },
        handleItemCodeDropshow,
        handleItemCodeDropshowException
      );
    }
  };

  const handleItemCodeDropshow = (dataObject) => {
    const itmList = dataObject?.data || [];
    setItemcodeSelectList(itmList);
  };

  const handleItemCodeDropshowException = () => { };

  const handleCustomerDropshow = (dataObject) => {
    const customerList = dataObject?.data || [];
    setCustomerSelectList(customerList);
    // const selectedCustomerId = customerList[0]?.cId;
    // console.log('Customer list data:', customerList);
    // if (selectedCustomerId) {
    //     const id = selectedCustomerId.split('-')[1];
    //     const numericId = Number(id);
    //     CustomerSelectItemShow({ id: numericId }, handlePartNoShowSuccess, handlePartNoSelectException);
    // }
  };

  const handleCustomerDropshowException = (error, errorMessage) => {
    console.log(errorMessage);
  };

  ///Customer Select
  const optionsCustList = Array.isArray(customerSelectList)
    ? customerSelectList.map((item) => ({
      cId: item?.cId,
      label: item?.cCode,
      cName: item?.cName,
      id: item?.id,
    }))
    : [];

  const onCustomerSelectChange = (selectedValue) => {
    console.log("Selected value:", selectedValue);

    if (selectedValue) {
      setSelectedCustomerName(selectedValue?.label);
      setCustomerSelect(selectedValue?.id);
      setcid(selectedValue?.cId);
      setCustomerName(selectedValue?.cName);
      setCustomerError(false);
    } else {
      // If cleared
      setSelectedCustomerName(null);
      setCustomerSelect("");
      setcid("");
      setCustomerName("");
      setCustomerError(false);
    }
  };

  ///Itemcode Select
  const optionsItemList = Array.isArray(ItemcodeSelectList)
    ? ItemcodeSelectList.map((item) => ({
      // ItemId: item?.cId,
      label: item?.label,
      itemName: item?.itemName,
      id: item?.id,
    }))
    : [];

  const onItemcodeSelectChange = (selectedValue) => {
    console.log("Selected value:....................>>>>>>>>>", selectedValue);

    if (selectedValue) {
      setSelectedItemCode(selectedValue?.label);
      setItemCodeSelect(selectedValue?.itemName);
      setItemid(selectedValue?.id);
      // setCustomerName(selectedValue?.cName);
    } else {
      setSelectedItemCode("");
      setItemCodeSelect("");
      setItemid("");
    }
  };

  //PartNo select
  const optionsPartNoList = partNoList
    ? partNoList.map((item) => ({
      value: item?.id,
      label: item?.label,
    }))
    : [];

  const handlePartNoShowSuccess = (dataObject) => {
    setTotalCount(dataObject?.totRows);
    setGridLoading(false);
    setTableLoading(false);

    const data = dataObject?.data || [];
    setRows(data);
    const formattedData = data.map((item) => ({
      id: item?.id || null,
      itemCode: item?.itemCode || "",
      itemName: item?.itemName || "",
      itemId: item?.itemId || "",
      hsnCode: item?.hsnCode || "",
      uom: item?.uom || "",
      rate: item?.rate || "",
      mstRate: item?.mstRate || "",
      customerDesc: item?.customerDesc || "",
      itemGroup: item?.itemGroup || "",
      underLedger: item?.underLedger || "",
    }));
    // if (formattedData.length > 0) {
    //     const clonedSelectedItems = [...selectedItems];
    //     const lastObj = clonedSelectedItems.pop();
    //     clonedSelectedItems.push(...formattedData, lastObj);
    //     setSelectedItems(clonedSelectedItems);
    // }
    if (formattedData.length > 0) {
      const clonedSelectedItems = [];
      const lastObj = selectedItems.pop();
      clonedSelectedItems.push(...formattedData, lastObj);
      setSelectedItems(clonedSelectedItems);
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handlePartNoSelectException = (errorObject, errorMessage) => {
    setRows([]);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleGridEdit = () => {
    setEditModeEnabled(true);
  };

  const handleChange = (e) => {
    CustomervsItemPartShow(
      { code: e.target.value },
      handlePartNoDropshow,
      handlePartNoDropshowException
    );
  };

  const handlePartNoDropshow = (dataObject) => {
    setPartNoList(dataObject?.data || []);
  };

  const onPartNoSelectChange = (value) => {
    if (value !== null) {
      const clonedSelectedItems = [...selectedItems];
      const lastObj = clonedSelectedItems.pop();
      clonedSelectedItems.push(value, lastObj);
      setSelectedItems(clonedSelectedItems);
    }
  };

  const handlePartNoDropshowException = (error, errorMessage) => {
    console.log(errorMessage);
  };

  const ClearData = () => {
    setSelectedItems([{ id: "RDL1" }]);
    setRows([]);
    setRefreshData((oldValue) => !oldValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveLoader(true);
    setEditModeEnabled(false);
    setEditableRowId(null);
    // Filter out the row where id is 'RDL1'
    const filteredItems = selectedItems.filter((item) => item.id !== "RDL1");

    // Check if any item has an invalid HSN Code (null, empty, zero, or less than 6 digits)
    // const hasInvalidHsn = filteredItems.some(
    //   (data) =>
    //     !data?.hsnCode || data.hsnCode === 0 || !/^\d{6,}$/.test(data.hsnCode)
    // );

    // if (hasInvalidHsn) {
    //   setSaveLoader(false);
    //   setNotification({
    //     status: true,
    //     type: "error",
    //     message:
    //       "HSN Code must be at least 6 digits and cannot be null or zero.",
    //   });
    //   return; // Stop execution if validation fails
    // }
    const hasInvalidHsn = filteredItems.some((data) => {
      return data?.hsnCode === null || data?.hsnCode === "" || data?.hsnCode === undefined;
    });
    if (hasInvalidHsn) {
      setSaveLoader(false);
      setNotification({
        status: true,
        type: "error",
        message: "HSN Code cannot be empty or null.",
      });
      return;
    }

    // Check if any item has an invalid Rate Code (null, empty, or zero)
    const hasInvalidRate = filteredItems.some(
      (data) => !data?.rate || data.rate === 0
    );

    if (hasInvalidRate) {
      setSaveLoader(false);
      setNotification({
        status: true,
        type: "error",
        message: "Rate cannot be null or zero.",
      });
      return; // Stop execution if validation fails
    }

    // Prepare the items for submission
    const items = filteredItems.map((data) => ({
      itemId: data?.itemId,
      uomId: data?.uomId,
      uom: data?.uom,
      hsnCode: data?.hsnCode,
      rate: data?.rate,
      mstRate: data?.mstRate,
      customerDesc: data?.customerDesc,
      itemGroup: data?.itemGroup,
      underLedger: data?.underLedger,
    }));

    const requestData = {
      customerId: customerSelect,
      items: items,
    };

    CustVsItemAdd(requestData, handleSuccess, handleException);
  };

  const handleSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      setRefreshData((oldValue) => !oldValue);
      ClearData();
      setSaveLoader(false);
    }, 2000);
  };

  const handleException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      setRefreshData((oldValue) => !oldValue);
      setSaveLoader(false);
    }, 2000);
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const handleDeleteRow = (id) => {
    // const newArray = selectedItems.filter((item) => item.id != id)
    // setSelectedItems(newArray);
    setDeleteId(id);
  };

  // const handleEdit = (cellNam, newValue, id, rowData) => {
  //     let updatedItems;
  //     switch (cellNam) {
  //         case "Customer Description":
  //             updatedItems = selectedItems.map((supp) =>
  //                 supp.id === id
  //                     ? { ...supp, customerDesc: newValue }
  //                     : supp
  //             );
  //             break;

  //         default:
  //             updatedItems = selectedItems;
  //             break;
  //     }
  //     switch (cellNam) {
  //         case "Rate":
  //             updatedItems = selectedItems.map((supp) =>
  //                 supp.id === id
  //                     ? { ...supp, rate: newValue }
  //                     : supp
  //             );
  //             break;

  //         default:
  //             updatedItems = selectedItems;
  //             break;
  //     }
  //     setSelectedItems(updatedItems);
  // };

  const handleEdit = (cellNam, newValue, id, rowData) => {
    let updatedItems;
    // Update either customerDesc or rate based on the cellNam
    switch (cellNam) {
      case "Customer Description":
        updatedItems = selectedItems.map((supp) =>
          supp.itemId === id ? { ...supp, customerDesc: newValue } : supp
        );
        break;

      case "Rate":
        updatedItems = selectedItems.map((supp) =>
          supp.itemId === id ? { ...supp, rate: newValue } : supp
        );
        break;

      case "hsnCode":
        updatedItems = selectedItems.map((supp) =>
          supp.itemId === id ? { ...supp, hsnCode: newValue } : supp
        );
        break;
      case "uom":
        updatedItems = selectedItems.map((supp) =>
          supp.itemId === id ? { ...supp, uom: newValue } : supp
        );
        break;

      case "underLedger":
        updatedItems = selectedItems.map((supp) =>
          supp.itemId === id ? { ...supp, underLedger: newValue } : supp
        );
        break;
      case "itemGroup":
        updatedItems = selectedItems.map((supp) =>
          supp.itemId === id ? { ...supp, itemGroup: newValue } : supp
        );
        break;

      default:
        updatedItems = selectedItems;
        break;
    }
    setSelectedItems(updatedItems);
  };

  const handleCopyFromModelOpen = () => {
    setCopyFromModal(true);
  };

  const handleExcelModelOpen = () => {
    setExcelModal(true);
  };

  const handleRateUpdateExcelModelOpen = () => {
    setRateUpadteModal(true);
  };
  // const handleLoadButtonClick = () => {
  //     // CustomerSelectItemShow({ id: customerSelect }, handlePartNoShowSuccess, handlePartNoSelectException);
  //     setSelectedItems([{ id: 'RDL1' }])
  //     setLoading(true)
  //     CustomerSelectItemShow({ id: customerSelect ,code :itemid }, handlePartNoShowSuccess, handlePartNoSelectException);
  // };

  const handleLoadButtonClick = () => {
    if (!customerSelect) {
      setCustomerError(true);
      return;
    }
    setEditModeEnabled(false);
    // ✅ Proceed only if customer is selected
    setCustomerError(false);
    setSelectedItems([{ id: "RDL1" }]);
    setLoading(true);
    // setGridLoading(true);
    setTableLoading(true);
    //
    CustomerSelectItemShow(
      { id: customerSelect, code: itemid, page: pageIndex },
      handlePartNoShowSuccess,
      handlePartNoSelectException
    );
  };

  // Customer selection handler
  const onalertCustomerSelectChange = (value) => {
    setSelectedCustomerName(value);
    if (value) {
      setCustomerError(false);
    }
  };
  const buttonsDisabled = customerSelect === "";

  const arrayToWorksheet = (array) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Customer Vs Item Report");

    if (array.length === 0) return workbook;

    // Define columns dynamically based on keys
    const columns = Object.keys(array[0]).map((key) => ({
      header: key.toUpperCase(), // Convert headers to uppercase
      key: key,
      width: 20,
    }));

    worksheet.columns = columns;

    // Add data rows
    array.forEach((row) => worksheet.addRow(row));

    // Style the header row (bold + center aligned)
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Center align all data rows
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    });

    return workbook;
  };

  const downloadExcelFile = async (workbook, filename) => {
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
  };

  const handleDownload = () => {
    const formattedData = selectedItems.map((data) => ({
      "Part No": data?.itemCode,
      "Part Name": data?.itemName,
      "Customer Description": data?.customerDesc,
      "HSN Code": data?.hsnCode,
      UOM: data?.uom,
      Rate: data?.rate,
      "Master Rate": data?.mstRate,
    }));

    const workbook = arrayToWorksheet(formattedData);
    downloadExcelFile(workbook, "Customer Vs Item Report.xlsx");
  };
  const deletehandleSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });

    setRefreshData((oldvalue) => !oldvalue);
    setTimeout(() => {
      handleClose();
      setDeleteDailogOpen(false);
    }, 3000);
  };

  const deletehandleException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
    }, 3000);
  };

  return (
    <div style={{ height: "96vh", display: "flex", flexDirection: "column" }}>
      {/* Header Section */}
      <div style={{ flexShrink: 0, padding: "10px" }}>
        <Typography
          sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
          variant="h5"
        >
          Customer Vs Item Price
        </Typography>
      </div>

      {/* Form Section */}
      <form
        className="mt-2 space-y-6"
        // onSubmit={handleSubmit}
        style={{ flexShrink: 0 }}
      >
        <Grid container padding={1}>
          <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
            <Grid
              container
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Grid item xs>
                <TextField
                  fullWidth
                  label="Customer Name"
                  placeholder="Customer Name"
                  variant="filled"
                  required
                  disabled={true}
                  value={customerName}
                  size="small"
                />
              </Grid>

              <Grid item xs>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="combo-box-demo"
                  value={selectedCustomerName}
                  options={optionsCustList}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      label="Search Customer"
                      onChange={handleChangeCustomer}
                      error={customerError}
                      helperText={customerError ? "Customer is required" : ""}
                    />
                  )}
                  onChange={(event, value) => onCustomerSelectChange(value)}
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>

              <Grid item xs>
                <Autocomplete
                  fullWidth
                  disablePortal
                  id="combo-box-demo"
                  value={selectedItemCode}
                  options={optionsItemList}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="filled"
                      label="ItemCode"
                      onChange={handleChangeItemcode}
                    />
                  )}
                  onChange={(event, value) => onItemcodeSelectChange(value)}
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>

              <Grid item>
                {/* <Button
                  variant="contained"
                  style={getHighlightStyle("Load", {
                    background: "#002d68",
                    // color: "white",
                    height: "40px",
                  })}
                  onClick={() => {
                    setActiveButton("Load");   // 🔵 highlight only
                    handleLoadButtonClick();  // ✅ existing logic
                  }} disabled={loading === true}
                >
                  {loading ? (
                    <CircularProgress size={24} style={{ color: "white" }} />
                  ) : (
                    "Load"
                  )}
                </Button> */}
                <Button
                  variant="contained"
                  disabled={loading === true}
                  style={getHighlightStyle(
                    "Load",
                    {
                      backgroundColor: "#002d68", // ✅ FIXED
                      height: "40px",
                    },
                    loading
                  )}
                  onClick={() => {
                    setActiveButton("Load");   // highlight
                    handleLoadButtonClick();  // existing logic
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} style={{ color: "white" }} />
                  ) : (
                    "Load"
                  )}
                </Button>

              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>

      {/* Scrollable Grid Section */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "10px",
        }}
      >
        <Card
          style={{
            boxShadow: "0 10px 10px 10px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            width: "100%",
            border: "1px solid black",
          }}
        >
          {loading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          )}
          <CardContent>
            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                backgroundColor: "white",
                zIndex: 0,
                paddingBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "10px",
                }}
              >
                {/* <div style={{ display: "flex", gap: "5px" }}>
                  <Button
                    variant="contained"
                    type="button"
                    disabled={buttonsDisabled}
                    style={{
                      height: "30px",
                      backgroundColor: buttonsDisabled ? "grey" : "#002d68",
                    }}
                    onClick={handleGridEdit}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    type="button"
                    disabled={buttonsDisabled}
                    style={{
                      height: "30px",
                      backgroundColor: buttonsDisabled ? "grey" : "#002d68",
                    }}
                    onClick={handleExcelModelOpen}
                  >
                    Import From XL
                  </Button>
                  <Button
                    variant="contained"
                    type="button"
                    disabled={buttonsDisabled}
                    style={{
                      height: "30px",
                      backgroundColor: buttonsDisabled ? "grey" : "#002d68",
                    }}
                    onClick={handleRateUpdateExcelModelOpen}
                  >
                    Rate Update XL
                  </Button>
                                  <Button
                    variant="contained"
                    type="button"
                    disabled={buttonsDisabled}
                    style={{
                      height: "30px",
                      backgroundColor: buttonsDisabled ? "grey" : "#002d68",
                    }}
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={buttonsDisabled || saveLoader === true}
                    style={{
                      height: "30px",
                      backgroundColor: buttonsDisabled ? "grey" : "#002d68",
                    }}
                    onClick={(e) => {
                      handleSubmit(e);
                      setActiveButton("Submit");

                    }}
                  >
                    {saveLoader ? (
                      <CircularProgress size={24} style={{ color: "white" }} />
                    ) : (
                      "SAVE"
                    )}
                  </Button>
                </div> */}
                <div style={{ display: "flex", gap: "5px" }}>
                  <Button
                    variant="contained"
                    type="button"
                    disabled={buttonsDisabled || isModuleLocked}
                    style={getHighlightStyle(
                      "Edit",
                      { height: "30px", backgroundColor: isModuleLocked ? "gray" : "#002d68" },
                      buttonsDisabled
                    )}
                    onClick={() => {
                      setActiveButton("Edit");
                      handleGridEdit();
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="contained"
                    type="button"
                    disabled={buttonsDisabled || isModuleLocked}
                    style={getHighlightStyle(
                      "ImportXL",
                      { height: "30px", backgroundColor: isModuleLocked ? "gray" : "#002d68" },
                      buttonsDisabled
                    )}
                    onClick={() => {
                      setActiveButton("ImportXL");
                      handleExcelModelOpen();
                    }}
                  >
                    Import From XL
                  </Button>

                  <Button
                    variant="contained"
                    type="button"
                    disabled={buttonsDisabled || isModuleLocked}
                    style={getHighlightStyle(
                      "RateUpdateXL",
                      { height: "30px", backgroundColor: isModuleLocked ? "gray" : "#002d68" },
                      buttonsDisabled || isModuleLocked
                    )}
                    onClick={() => {
                      setActiveButton("RateUpdateXL");
                      handleRateUpdateExcelModelOpen();
                    }}
                  >
                    Rate Update XL
                  </Button>

                  <Button
                    variant="contained"
                    type="button"
                    disabled={buttonsDisabled || isModuleLocked}
                    style={getHighlightStyle(
                      "Download",
                      { height: "30px", backgroundColor: isModuleLocked ? "gray" : "#002d68" },
                      buttonsDisabled || isModuleLocked
                    )}
                    onClick={() => {
                      setActiveButton("Download");
                      handleDownload();
                    }}
                  >
                    Download
                  </Button>

                  <Button
                    variant="contained"
                    type="submit"
                    disabled={buttonsDisabled || saveLoader === true || isModuleLocked}
                    style={getHighlightStyle(
                      "Save",
                      { height: "30px", backgroundColor: isModuleLocked ? "gray" : "#002d68" },
                      buttonsDisabled || saveLoader || isModuleLocked
                    )}
                    onClick={(e) => {
                      setActiveButton("Save");
                      handleSubmit(e);
                    }}
                  >
                    {saveLoader ? (
                      <CircularProgress size={24} style={{ color: "white" }} />
                    ) : (
                      "SAVE"
                    )}
                  </Button>
                </div>

              </div>
            </div>

            {/* Table */}
            <div
              style={{
                overflowY: "auto",
                maxHeight: "65vh",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <table
                id="customers"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    background: "#002D68",
                    color: "white",
                    zIndex: 0,
                  }}
                >
                  <tr>
                    <th>SNo</th>
                    <th>Part No</th>
                    <th>Part Name</th>
                    <th>SO/Invoice Printing Alias</th>
                    <th>HSN Code</th>
                    <th>UOM</th>
                    <th>Rate</th>
                    <th>Master Rate</th>
                    <th>Under Ledger</th>
                    <th>Item Group</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedItems.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor:
                          parseFloat(item.rate) < parseFloat(item.mstRate)
                            ? "#ffcccc"
                            : "inherit",
                      }}
                    >
                      <td>{pageIndex * itemsPerPage + index + 1}</td>
                      <td>
                        {item.itemCode ? (
                          <span>{item.itemCode}</span>
                        ) : (
                          <Autocomplete
                            fullWidth
                            disablePortal
                            id={`combo-box-${index}`}
                            size="small"
                            options={partNoList}
                            disabled={!editModeEnabled}
                            getOptionLabel={(option) => option.itemCode}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Search Part No"
                                onChange={handleChange}
                              />
                            )}
                            onChange={(event, value) =>
                              onPartNoSelectChange(value, event)
                            }
                          />
                        )}
                      </td>
                      <td>{item.itemName}</td>
                      <td
                        contentEditable={editModeEnabled}
                        suppressContentEditableWarning={true}
                        onBlur={(e) =>
                          handleEdit(
                            "Customer Description",
                            e.target.textContent,
                            item.itemId,
                            item
                          )
                        }
                      >
                        {item.customerDesc}
                      </td>
                      <td
                        contentEditable={editModeEnabled}
                        suppressContentEditableWarning={true}

                        onBlur={(e) =>
                          handleEdit(
                            "hsnCode",
                            e.target.textContent,
                            item.itemId,
                            item
                          )
                        }
                      >
                        {item.hsnCode}
                      </td>
                      {/* <td>{item.uom}</td> */}
                      <td
                        contentEditable={editModeEnabled}
                        suppressContentEditableWarning={true}
                        onBlur={(e) =>
                          handleEdit("uom", e.target.textContent, item.itemId, item)
                        }
                      >
                        {item.uom}
                      </td>

                      <td
                        contentEditable={
                          editModeEnabled && editableRowId === item.itemId
                        }
                        onClick={() => setEditableRowId(item.itemId)}
                        onBlur={(e) =>
                          handleEdit(
                            "Rate",
                            e.target.textContent,
                            item.itemId,
                            item
                          )
                        }
                      >
                        {item.rate}
                      </td>

                      <td>
                        {item.mstRate}
                      </td>

                      <td>
                        <FormControl
                          fullWidth
                          size="small"
                          variant="filled"
                          disabled={!editModeEnabled}
                        >
                          <Select
                            id="demo-simple-select"
                            value={item?.underLedger || ""}
                            onChange={(e) =>
                              handleEdit(
                                "underLedger",
                                e.target.value,
                                item.itemId,
                                item
                              )
                            }
                          >
                            {underLedgerList.map((data) => (
                              <MenuItem key={data.id} value={data.id}>
                                {data.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </td>
                      <td>
                        <FormControl
                          fullWidth
                          size="small"
                          variant="filled"
                          disabled={!editModeEnabled}
                        >
                          <Select
                            label="Item Group"
                            value={item?.itemGroup || ""}
                            onChange={(e) =>
                              handleEdit(
                                "itemGroup",
                                e.target.value,
                                item.itemId,
                                item
                              )
                            }
                          >
                            {itemGroupList.map((data) => (
                              <MenuItem key={data.id} value={data.id}>
                                {data.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <DeleteIcon
                          onClick={() => {
                            handleDeleteRow(item.id);
                            setDeleteDailogOpen(true);
                          }}
                          style={{ color: "black", cursor: "pointer" }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                margin: "10px 0",
              }}
            >
              <button
                onClick={() => {
                  setTableLoading(true);
                  setPageIndex((prev) => Math.max(prev - 1, 0));
                }}
                disabled={pageIndex === 0}
              >
                ⬅ Previous
              </button>
              <span style={{ margin: "0 15px" }}>Page {pageIndex + 1}</span>
              <button
                onClick={() => {
                  setTableLoading(true);
                  setPageIndex((prev) => prev + 1);
                }}
                disabled={(pageIndex + 1) * itemsPerPage >= totalCount}
              >
                Next ➡
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals & Notifications */}
      <ImportXlCustItem
        excelModal={excelModal}
        setExcelModal={setExcelModal}
        customerSelect={customerSelect}
      />

      <RateUpdateXL
        RateUpadteModal={RateUpadteModal}
        setRateUpadteModal={setRateUpadteModal}
        customerSelect={customerSelect}
      />

      <CopyFromXl
        copyFromModal={copyFromModal}
        setCopyFromModal={setCopyFromModal}
        customerSelect={customerSelect}
      />

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />

      <DeleteConfirmationDailog
        open={deleteDailogOpen}
        setOpen={setDeleteDailogOpen}
        deleteId={deleteId}
        deleteService={CustomvsItemDelete}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />
    </div>
  );
};

export default CustomerVsItemProcess;
