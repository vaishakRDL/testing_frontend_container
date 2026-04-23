import {
  Card,
  CardContent,
  Box,
  Autocomplete,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import {
  CompletedReverseVreified,
  GetSRNNoList,
  MaterialIssueReverse,
  PreviewMaterialData,
} from "../../ApiService/LoginPageService";

const MaterialIssueVerified = () => {
  const [invoiceDate, setinvoiceDate] = useState(new Date());
  const [customerPoNo, setCustomerPoNo] = useState("");
  const [autogen, setAutoGen] = useState("");
  const [vehicalNo, setVehicalNo] = useState("");
  const [dispatchaddedBy, dispatchAddedBy] = useState("");
  const [invoiveNo, setInvoiceNo] = useState("");
  const [mainId, setMainId] = useState("");
  const [category, setCategory] = useState("");
  const [srnNo, setSrnNo] = useState("");
  const [requestedBy, setRequestedBy] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [kanbanDate, setKanbanDate] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [approvedDate, setApprovedDate] = useState("");
  const [status, setStatus] = useState("");
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [selectedItems, setSelectedItems] = useState([]);
  console.log("1111111111selectedItems", selectedItems);

  useEffect(() => {
    handleForwardReverse("last", "");
  }, []);

  const handleForwardReverse = (type, id) => {
    MaterialIssueReverse(
      { type: type, id: id },
      handleActionSuccess,
      handleActionException
    );
  };

  const handleActionSuccess = (dataObject) => {
    // setIsPoView(true);
    const data = dataObject.srnDetails;
    setMainId(data?.id || "");
    setCategory(data?.category || "");
    setSrnNo(data?.srnNo || "");
    setRequestedBy(data?.requestedBy || "");
    setCustomerName(data?.customerName || "");
    setRequestedDate(dataObject?.requestedDate || []);
    setKanbanDate(data?.kanbanDate || "");
    setApprovedBy(data?.approvedBy || "");
    setApprovedDate(data?.approvedDate || "");
    setSelectedItems(dataObject?.srnItems || []);
    // setStatus("");
  };
  const handleActionException = () => {};

  const handleSupSearchChange = (e) => {
    GetSRNNoList(
      { code: e.target.value },
      handleItemVsProcessItemSucessShow,
      handleItemVsProcessItemExceptionShow
    );
  };

  const handleItemVsProcessItemSucessShow = (dataObject) => {
    setSupplierList(dataObject?.data || []);
  };

  const handleItemVsProcessItemExceptionShow = (dataObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
    }, 3000);
  };
  const handleSupplierSearchItemChange = (value) => {
    if (value !== null) {
      PreviewMaterialData(
        { id: value.id, type: "search" },
        handleGetSuppDataSucessShow,
        handleGetSuppDataExceptionShow
      );
    }
  };
 const handleGetSuppDataSucessShow=(dataObject)=>{
  const data = dataObject.srnDetails;
    setMainId(data?.id || "");
    setCategory(data?.category || "");
    setSrnNo(data?.srnNo || "");
    setRequestedBy(data?.requestedBy || "");
    setCustomerName(data?.customerName || "");
    setRequestedDate(dataObject?.requestedDate || []);
    setKanbanDate(data?.kanbanDate || "");
    setApprovedBy(data?.approvedBy || "");
    setApprovedDate(data?.approvedDate || "");
  setSelectedItems(dataObject?.srnItems || []);
 }

const handleGetSuppDataExceptionShow=()=>{

}

const handleStatusClick=()=>{
  MaterialIssueReverse(
    { type: status, id: "" },
    handleActionSuccess,
    handleActionException
  );
}

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginLeft: "10px",
          marginTop: "10px",
        }}
      >
        {/* <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Verified
                </Typography> */}
      </div>
      <form /*onSubmit={handleSubmit}*/>
        <Grid container padding={1}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                <TextField
                  fullWidth
                  required
                  label="Category"
                  readOnly={true}
                  disabled={true}
                  value={category}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                  // disabled={isView || isQcApprovalFlag === 'true' ? true : false}
                  inputProps={{ maxLength: 5 }} // Set max length to 5 characters
                />
              </Grid>

              <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                <TextField
                  fullWidth
                  required
                  label="SRN No"
                  readOnly={true}
                  disabled={true}
                  value={srnNo}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                  inputProps={{ maxLength: 5 }} // Set max length to 5 characters
                />
              </Grid>

              <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                <TextField
                  fullWidth
                  label="Requested By" // disabled={true}
                  readOnly={true}
                  required
                  value={requestedBy}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                  disabled={true}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={1.5} lg={1.5} xl={1.5}>
                <TextField
                  fullWidth
                  required
                  label="Customer Name"
                  value={customerName}
                  readOnly={true}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                  disabled={true}

                  // disabled={isView || isQcApprovalFlag === 'true' ? true : false}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                <TextField
                  fullWidth
                  id="outlined-multiline-static"
                  label="Requested Date"
                  value={requestedDate}
                  readOnly={true}
                  disabled={true}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                <TextField
                  fullWidth
                  id="outlined-multiline-static"
                  label="Kanban Date"
                  value={kanbanDate}
                  readOnly={true}
                  disabled={true}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                <TextField
                  fullWidth
                  id="outlined-multiline-static"
                  label="Approved By"
                  value={approvedBy}
                  readOnly={true}
                  disabled={true}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                <TextField
                  fullWidth
                  id="outlined-multiline-static"
                  label="Approved Date"
                  value={approvedDate}
                  readOnly={true}
                  disabled={true}
                  size="small"
                  style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={supplierList}
                  fullWidth
                  getOptionLabel={(option) => option.srnNo || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search SRN No"
                      onChange={handleSupSearchChange}
                    />
                  )}
                  onChange={(event, value) =>
                    handleSupplierSearchItemChange(value)
                  }
                  size="small"
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "5px",
                    flex: 1,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid> */}

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
            <Card
              style={{
                boxShadow: "0 10px 10px 10px rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
                width: "100%",
                height: "100%",
                border: "1px solid #000000",
              }}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <Button
                    variant="contained"
                    style={{
                      background: "#002D68",
                      color: "white",
                      height: "35px",
                    }}
                    onClick={() => {handleForwardReverse("first", ""); setStatus("");} }
                  >
                    <FastRewindIcon />
                  </Button>
                  <Button
                    variant="contained"
                    style={{
                      background: "#002D68",
                      color: "white",
                      height: "35px",
                    }}
                    onClick={() => {handleForwardReverse("reverse", mainId); setStatus("");}}
                  >
                    <SkipPreviousIcon />
                  </Button>

                  <Button
                    variant="contained"
                    style={{
                      background: "#002D68",
                      color: "white",
                      height: "35px",
                    }}
                    onClick={() =>{ handleForwardReverse("forward", mainId); setStatus("");} }
                  >
                    <SkipNextIcon />
                  </Button>
                  <Button
                    variant="contained"
                    style={{
                      background: "#002D68",
                      color: "white",
                      height: "35px",
                    }}
                    onClick={() =>{  
                      handleForwardReverse("last", ""); setStatus("");}
                    } 
                  >
                    <FastForwardIcon />
                  </Button>
                  <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Status Check
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Status Check"
                        placeholder="Status Check"
                        size="small"
                        style={{
                          backgroundColor: "#ffffff",
                          borderRadius: "5px",
                          width: "200px",
                        }}
                        value={status}
                        onChange={(e) => {setStatus(e.target.value);
                          MaterialIssueReverse(
                            { type: e.target.value, id: '' },
                            handleActionSuccess,
                            handleActionException
                          );
                        }}
                         
                      >
                        <MenuItem value="Completed">Completed</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Typography style={{ fontWeight: "bold",paddingRight:"30px" ,fontSize:"18px" ,  color: status === "Completed" ? "green" : "red"}}>{status}</Typography>
                  </Grid>
                </div>

                <div style={{ overflowX: "scroll" }}>
                  <table id="customers">
                    <tr>
                      <th style={{ whiteSpace: "nowrap" }}>SI No</th>
                      <th style={{ whiteSpace: "nowrap" }}>Jobcard No</th>
                      <th style={{ whiteSpace: "nowrap" }}>ItemCode</th>
                      <th style={{ whiteSpace: "nowrap" }}>ItemName</th>
                      <th style={{ whiteSpace: "nowrap" }}>Fim</th>
                      <th style={{ whiteSpace: "nowrap" }}>Total Stock</th>
                      <th style={{ whiteSpace: "nowrap" }}>UOM</th>
                      <th style={{ whiteSpace: "nowrap" }}>Requested Qty</th>
                      <th style={{ whiteSpace: "nowrap" }}>Issued Qty</th>
                    </tr>
                    {selectedItems.map((item, index) => (
                      <tr key={index}>
                        <td
                          style={{ whiteSpace: "nowrap" }}
                          contentEditable={false}
                        >
                          {item.sNo}
                        </td>
                        <td
                          style={{ whiteSpace: "nowrap" }}
                          contentEditable={false}
                        >
                          {item.jcNo}
                        </td>
                        <td
                          style={{ whiteSpace: "nowrap" }}
                          contentEditable={false}
                        >
                          {item.itemCode}
                        </td>
                        <td
                          style={{ whiteSpace: "nowrap" }}
                          contentEditable={false}
                        >
                          {item.itemName}
                        </td>
                        <td
                          style={{ whiteSpace: "nowrap" }}
                          contentEditable={false}
                        >
                          {item.fim}
                        </td>
                        <td
                          style={{ whiteSpace: "nowrap" }}
                          contentEditable={false}
                        >
                          {item.totStk}
                        </td>
                        <td
                          style={{ whiteSpace: "nowrap" }}
                          contentEditable={false}
                        >
                          {item.uom}
                        </td>
                        <td
                          style={{ whiteSpace: "nowrap" }}
                          contentEditable={false}
                        >
                          {item.reqQty}
                        </td>
                        <td
                          style={{ whiteSpace: "nowrap" }}
                          contentEditable={false}
                        >
                          {item.issuedQty}
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>

      {/* MODALS */}
    </div>
  );
};

export default MaterialIssueVerified;
