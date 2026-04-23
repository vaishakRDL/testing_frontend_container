import {
  Button,
  Box,
  Dialog,
  Tooltip,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  DialogActions,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  CardContent,
  Typography,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { Card } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DownloadIcon from "@mui/icons-material/Download";
import { DataGrid } from "@mui/x-data-grid";
import MultiAddressModule from "./MultlAddress/MultiAddressModule";
import MultiContactPersonModule from "./MultiContactPerson/MultiContactPersonModule";
import FileUploadModule from "./FileUpload/FileUploadModule";
import SearchIcon from "@mui/icons-material/Search";
import PDFViiewer from "../../Utility/PDFViiewer";
import {
  ContactPersonCustomerFileDelete,
  CustomContactShow,
  CustomMultiAddressShow,
  CustomerAdd,
  CustomerDeleteFile,
  CustomerFileDelete,
  CustomerGroupShow,
  Customerpdate,
  GetCurreny,
  GetCustomerUploadFile,
  GetIdCustomer,
  GetPlaceOfSupply,
  MultiAddressCustomerFileDelete,
} from "../../ApiService/LoginPageService";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import { DocDownloadExlExport } from "../../ApiService/DownloadCsvReportsService";
import { AddUserValidate } from "../validation/formValidation";

const CustomerModule = ({
  open,
  setOpen,
  isAddButton,
  editData,
  setRefreshData,
}) => {
  const [customerCode, setCustomerCode] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [tallyAlias, setTallyAlias] = useState("");
  const [customerGropList, setCustomerGroupList] = useState([]);
  const [customerGrop, setCustomerGrop] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [inActiveState, setInActiveState] = useState(false);
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [partyNotes, setPartyNotes] = useState("");

  const [cuurrencyList, setCurrencyList] = useState([]);
  const [cuurrency, setCurrency] = useState("");
  const [placeOfSupplyList, setPlaceOfSupplyList] = useState([]);

  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [dcInfoRequiredIn, setDcInfoRequiredIn] = useState("");
  const [fileUpload, setFileUpload] = useState("");

  const [panNo, setPanNo] = useState("");
  const [gstNumberUinId, setGstinOrUin] = useState("");
  const [gstNumberUinIdList, setGstinOrUinList] = useState([]);
  const [billPhoneNo, setBillPhoneNo] = useState("");
  const [billFaxNo, setBillFaxNo] = useState("");
  const [email, setEmail] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [noTaxRemaks, setNoTextRemaks] = useState("");
  const [creditDays, setCreditDays] = useState("");
  const [tcsCollected, setTcsCollected] = useState("");
  const [surchargesOnTcs, setSurchargesOnTcs] = useState("");
  const [cessOnTCS, setCessOnTCS] = useState("");
  const [singleSalesOrder, setSingleSalesOrder] = useState("");
  const [applyDCValue, setApplyDCValue] = useState("");
  const [autoSOShortClose, setAutoSOShortClose] = useState("");
  const [cgst, setCgst] = useState("");
  const [sgst, setSgst] = useState("");
  const [igst, setIgst] = useState("");
  const [utgst, setUtgst] = useState("");
  const [maxLineItemsIn, setMaxLineItemsIn] = useState("");

  const [fileDataList, setFileDataList] = useState([]);

  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  const [multiOpen, setMultiOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(true);

  const [pdfOpen, setPdfOpen] = useState(false);
  const [fileTypeForView, setFileTypeForView] = useState("");
  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [dataRefresh, setDataRefresh] = useState(true);
  const [deleteId, setDeleteId] = useState("");
  const [contectList, setContactList] = useState([]);
  const [autoCustomId, setAutoCustomId] = useState("");
  const [errorObject, setErrorObject] = useState({});

  useEffect(() => {
    setOpen(open);

    LoadingData();
  }, [editData, dataRefresh]);

  const handleGetIdCustomerSuccess = (dataObject) => {
    setAutoCustomId(dataObject?.id || "");
  };

  const handleGetIdCustomerException = (errorObject, errorMessage) => {};
  const LoadingData = () => {
    if (open) {
      // ItemGroupSupplierGroupShowMaster(handleItemGroupSupplierGroupShowMasterSuccess, handleItemGroupSupplierGroupShowMasterException);
      // FileDataShow({
      //     id: globleId
      // }, handleSuccessShowFile, handleException);
      if (!editData) {
        GetIdCustomer(handleGetIdCustomerSuccess, handleGetIdCustomerException);
      }
      GetCurreny(handleCurrencySucess, handleException);
      GetPlaceOfSupply(handleGetPlaceOfSupplySucess, handleException);
      GetCustomerUploadFile(
        {
          id: autoCustomId,
        },
        handleGetCustomerUploadFileSuccess,
        handlGetCustomerUploadFileException
      );

      CustomMultiAddressShow(
        {
          id: autoCustomId,
        },
        handleCustomContactShowSuccess,
        handleCustomContactShowException
      );

      CustomerGroupShow(handleCustomerGroupShow, handleException);

      setCustomerCode(editData?.cCode || "");
      setGstNumber(editData?.gstNo || "");
      setCustomerName(editData?.cName || "");
      setTallyAlias(editData?.tallyAlias || "");
      setCustomerGrop(editData?.cGroup || "");
      setCustomerAddress(editData?.cAddress || "");
      setInActiveState(editData?.inactiveStatus || false);
      setCity(editData?.city || "");
      setPincode(editData?.pincode || "");
      setState(editData?.state || "");
      setCountry(editData?.country || "");
      setPartyNotes(editData?.partyNotes || "");
      setCurrency(editData?.currency || "");
      setPanNo(editData?.panNo || "");
      setGstinOrUin(editData?.gstInUinId || "");
      setBillPhoneNo(editData?.bi_phoneNo || "");
      setBillFaxNo(editData?.bi_faxNo || "");
      setEmail(editData?.email || "");
      setPaymentTerms(editData?.payTerm || "");
      setNoTextRemaks(editData?.noTaxRemark || "");
      setCreditDays(editData?.creditday || "");
      setPlaceOfSupply(editData?.placeOfSupply || "");
      setTcsCollected(editData?.tcsCollected || "");
      setSurchargesOnTcs(editData?.SurcharOnTcs || "");
      setCessOnTCS(editData?.CessOnTcs || "");
      setSingleSalesOrder(editData?.singleSaleOrd || "");
      setApplyDCValue(editData?.dcValue || "");
      setAutoSOShortClose(editData?.shortClose || "");
      setCgst(editData?.cgst || "");
      setSgst(editData?.sgst || "");
      setIgst(editData?.igst || "");
      setUtgst(editData?.utgst || "");
      setDcInfoRequiredIn(editData?.dcInfoReq || "");
      setMaxLineItemsIn(editData?.maxLineItem || "");
      setAutoCustomId(editData?.cId || "");
    }
  };

  const handleCustomContactShowSuccess = (dataObject) => {
    setContactList(dataObject?.data || []);
  };

  const handleCustomContactShowException = () => {};

  const handleGetCustomerUploadFileSuccess = (dataObject) => {
    setFileDataList(dataObject?.data || []);
    const hasDefaultAddressY = dataObject?.data?.some(
      (item) => item.defaultAddress === "N"
    );

    if (hasDefaultAddressY) {
      // Find the first element with defaultAddress === 'Y'
      const addressWithDefaultY = dataObject?.data?.find(
        (item) => item.defaultAddress === "N"
      );
      // Set the customer address
      setCustomerAddress(addressWithDefaultY?.address || "");
    }
  };

  const handlGetCustomerUploadFileException = (errorObject, errorMessage) => {};

  const handleCustomerGroupShow = (dataObject) => {
    setCustomerGroupList(dataObject?.data || []);
  };

  const handleCurrencySucess = (dataObject) => {
    setCurrencyList(dataObject?.data || []);
  };

  const handleGetPlaceOfSupplySucess = (dataObject) => {
    setPlaceOfSupplyList(dataObject?.data || []);
  };

  const handleSuccess = (dataObject) => {
    setRefreshData((oldvalue) => !oldvalue);
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
      setOpen(false);
      setFileUpload("");
    }, 5000);
  };

  const handleException = (errorObject, errorMessage) => {
    setRefreshData((oldvalue) => !oldvalue);
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
      // setOpen(false);
    }, 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAddButton) {
      CustomerAdd(
        {
          cId: autoCustomId,
          cCode: customerCode,
          gstNo: gstNumber,
          cName: customerName,
          tallyAlias: tallyAlias,
          cGroup: customerGrop,
          cAddress: customerAddress,
          inactiveStatus: inActiveState,
          city: city,
          pincode: pincode,
          state: state,
          country: country,
          partyNotes: partyNotes,
          currency: cuurrency,
          panNo: panNo,
          gstInUinId: gstNumberUinId,
          bi_phoneNo: billPhoneNo,
          bi_faxNo: billFaxNo,
          email: email,
          payTerm: paymentTerms,
          noTaxRemark: noTaxRemaks,
          creditday: creditDays,
          placeOfSupply: placeOfSupply,
          tcsCollected: tcsCollected,
          SurcharOnTcs: surchargesOnTcs,
          CessOnTcs: cessOnTCS,
          singleSaleOrd: singleSalesOrder,
          dcValue: applyDCValue,
          shortClose: autoSOShortClose,
          cgst: cgst,
          sgst: sgst,
          igst: igst,
          utgst: utgst,
          dcInfoReq: dcInfoRequiredIn,
          maxLineItem: maxLineItemsIn,
        },
        handleCustomerAddSuccess,
        handleCustomerAddException
      );
    } else {
      Customerpdate(
        {
          id: editData?.id,
          cId: autoCustomId,
          cCode: customerCode,
          gstNo: gstNumber,
          cName: customerName,
          tallyAlias: tallyAlias,
          cGroup: customerGrop,
          cAddress: customerAddress,
          inactiveStatus: inActiveState,
          city: city,
          pincode: pincode,
          state: state,
          country: country,
          partyNotes: partyNotes,
          currency: cuurrency,
          panNo: panNo,
          gstInUinId: gstNumberUinId,
          bi_phoneNo: billPhoneNo,
          bi_faxNo: billFaxNo,
          email: email,
          payTerm: paymentTerms,
          noTaxRemark: noTaxRemaks,
          creditday: creditDays,
          placeOfSupply: placeOfSupply,
          tcsCollected: tcsCollected,
          SurcharOnTcs: surchargesOnTcs,
          CessOnTcs: cessOnTCS,
          singleSaleOrd: singleSalesOrder,
          dcValue: applyDCValue,
          shortClose: autoSOShortClose,
          cgst: cgst,
          sgst: sgst,
          igst: igst,
          utgst: utgst,
          dcInfoReq: dcInfoRequiredIn,
          maxLineItem: maxLineItemsIn,
        },
        handleCustomerAddSuccess,
        handleCustomerAddException
      );
    }
  };

  const handleCustomerAddSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      ClearData();
      setOpen(false);
      handleClose();
    }, 2000);
  };

  const handleCustomerAddException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // ClearData();
      // handleClose();
    }, 2000);
  };

  const ClearData = () => {
    setCustomerCode("");
    setGstNumber("");
    setCustomerName("");
    setTallyAlias("");
    setCustomerGroupList([]);
    setCustomerGrop("");
    setCustomerAddress("");
    setInActiveState(false);
    setCity("");
    setPincode("");
    setState("");
    setCountry("");
    setPartyNotes("");
    setAutoCustomId("");

    setCurrencyList([]);
    setCurrency("");
    setPlaceOfSupplyList([]);
    setPlaceOfSupply("");
    setDcInfoRequiredIn("");
    setFileUpload("");

    setPanNo("");
    setGstinOrUin("");
    setGstinOrUinList([]);
    setBillPhoneNo("");
    setBillFaxNo("");
    setEmail("");
    setPaymentTerms("");
    setNoTextRemaks("");
    setCreditDays("");
    setTcsCollected("");
    setSurchargesOnTcs("");
    setCessOnTCS("");
    setSingleSalesOrder("");
    setApplyDCValue("");
    setAutoSOShortClose("");
    setCgst("");
    setSgst("");
    setIgst("");
    setUtgst("");
    setMaxLineItemsIn("");

    setRefreshData((oldvalue) => !oldvalue);
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  const columns = [
    {
      field: "code",
      headerName: "Company Code",
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "category",
      headerName: "Cotegory",
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "address",
      headerName: "Address",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },

    {
      field: "defaultAddress",
      headerName: "Default Shapping Address",
      type: "string",
      sortable: true,
      sortable: false,
      minWidth: 50,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "actions",
      type: "actions",
      flex: 1,
      headerName: "Actions",
      cellClassName: "actions",
      disableClickEventBubbling: true,
      getActions: (params) => [<EditData selectedRow={params.row} />],
    },
  ];

  const columns2 = [
    {
      field: "headerName",
      headerName: "Header Name",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "value",
      headerName: "Values",
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: false,
      renderCell: (params) => [<FieldsAction selectedRow={params.row} />],
    },
  ];

  const dataSet = {
    Currency: [
      { id: 1, value: "rupee" },
      { id: 2, value: "UAE" },
      { id: 3, value: "EU" },
    ],
    suply: [
      { id: 1, value: "udupi" },
      { id: 2, value: "Mangalore" },
      { id: 3, value: "Uchila" },
    ],
  };

  const fileColumns = [
    {
      field: "fileType",
      headerName: "File Name",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      type: "actions",
      flex: 1,
      headerName: "Actions",
      cellClassName: "actions",
      disableClickEventBubbling: true,
      getActions: (params) => [
        <DownloadData selectedRow={params.row} />,
        <ViewdData selectedRow={params.row} />,
        <DeleteData selectedRow={params.row} />,
      ],
    },
  ];

  function FieldsAction(props) {
    return (
      <>
        {props.selectedRow.headerName === "Currency" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={cuurrency}
              disabled={isEdit}
              onChange={(e) => {
                setCurrency(e.target.value);
              }}
            >
              {cuurrencyList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "Place of Supply" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={placeOfSupply}
              disabled={isEdit}
              onChange={(e) => {
                setPlaceOfSupply(e.target.value);
              }}
            >
              {placeOfSupplyList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "DC Info Required in" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dcInfoRequiredIn}
              disabled={isEdit}
              onChange={(e) => {
                setDcInfoRequiredIn(e.target.value);
              }}
            >
              <MenuItem value={"Y"}>Y</MenuItem>
              <MenuItem value={"N"}>N</MenuItem>
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "PANNO" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={panNo}
            onChange={(e) => {
              setPanNo(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "GSTIN/UIN ID" ? (
          <>
            {/* <FormControl fullWidth>
                                         <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            disabled={isEdit}
                                            value={gstNumberUinId}
                                            onChange={(e) => {
                                                setGstinOrUin(e.target.value);
                                            }}
                                        >
                                            {gstNumberUinIdList.map((data) => {

                                                <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                                            })
                                            }

                                        </Select>

                                    </FormControl> */}
            <TextField
              type="text"
              multiline
              fullWidth
              disabled={isEdit}
              value={gstNumberUinId}
              onChange={(e) => {
                setGstinOrUin(e.target.value);
              }}
            />
          </>
        ) : props.selectedRow.headerName === "BILL PHONE NO" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={billPhoneNo}
            onChange={(e) => {
              setBillPhoneNo(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "BILL Fax No" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={billFaxNo}
            onChange={(e) => {
              setBillFaxNo(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "Email" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "Payment Terms" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={paymentTerms}
            onChange={(e) => {
              setPaymentTerms(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "NO Tax Remarks" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={noTaxRemaks}
            onChange={(e) => {
              setNoTextRemaks(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "Credit Days" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={creditDays}
            onChange={(e) => {
              setCreditDays(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "TCS Collected" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={tcsCollected}
            onChange={(e) => {
              setTcsCollected(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "Surcharges on TCS" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={surchargesOnTcs}
            onChange={(e) => {
              setSurchargesOnTcs(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "Cess on TCS" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={cessOnTCS}
            onChange={(e) => {
              setCessOnTCS(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "Single Sales Order" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={singleSalesOrder}
            onChange={(e) => {
              setSingleSalesOrder(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "Apply DC Value" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={applyDCValue}
            onChange={(e) => {
              setApplyDCValue(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "Auto SO Short Close" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={autoSOShortClose}
            onChange={(e) => {
              setAutoSOShortClose(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "CGST%" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={cgst}
            onChange={(e) => {
              setCgst(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "SGST%" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={sgst}
            onChange={(e) => {
              setSgst(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "IGST%" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={igst}
            onChange={(e) => {
              setIgst(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "UTGST%" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={utgst}
            onChange={(e) => {
              setUtgst(e.target.value);
            }}
          />
        ) : props.selectedRow.headerName === "Max Line Items In" ? (
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={maxLineItemsIn}
            onChange={(e) => {
              setMaxLineItemsIn(e.target.value);
            }}
          />
        ) : (
          <></>
        )}
      </>
    );
  }

  const HeaderRows = [
    {
      id: 1,
      headerName: "Currency",
      value: (
        <spacing>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={cuurrency}
              disabled={isEdit}
              onChange={(e) => {
                setCurrency(e.target.value);
              }}
            >
              {cuurrencyList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </spacing>
      ),
    },
    {
      id: 2,
      headerName: "PANNO",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={panNo}
            size="small"
            variant="standard"
            onChange={(e) => {
              setPanNo(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: true,
    },
    // {
    //     id: 3,
    //     headerName: 'GSTIN/UIN ID',
    //     value: '',
    //     isDropDown: false
    // },
    {
      id: 4,
      headerName: "BILL PHONE NO",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={billPhoneNo}
            size="small"
            variant="standard"
            onChange={(e) => {
              setBillPhoneNo(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: true,
    },
    {
      id: 5,
      headerName: "BILL Fax No",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={billFaxNo}
            size="small"
            variant="standard"
            onChange={(e) => {
              setBillFaxNo(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 6,
      headerName: "Email",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={email}
            size="small"
            variant="standard"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: true,
    },
    {
      id: 7,
      headerName: "Payment Terms",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={paymentTerms}
            size="small"
            variant="standard"
            onChange={(e) => {
              setPaymentTerms(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 8,
      headerName: "NO Tax Remarks",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={noTaxRemaks}
            size="small"
            variant="standard"
            onChange={(e) => {
              setNoTextRemaks(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 9,
      headerName: "Credit Days",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={creditDays}
            size="small"
            variant="standard"
            onChange={(e) => {
              setCreditDays(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: true,
    },
    {
      id: 10,
      headerName: "Place of Supply",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={placeOfSupply}
              disabled={isEdit}
              onChange={(e) => {
                setPlaceOfSupply(e.target.value);
              }}
            >
              {placeOfSupplyList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 11,
      headerName: "TCS Collected",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={tcsCollected}
            size="small"
            variant="standard"
            onChange={(e) => {
              setTcsCollected(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 12,
      headerName: "Surcharges on TCS",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={surchargesOnTcs}
            size="small"
            variant="standard"
            onChange={(e) => {
              setSurchargesOnTcs(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 13,
      headerName: "Cess on TCS",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={cessOnTCS}
            size="small"
            variant="standard"
            onChange={(e) => {
              setCessOnTCS(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 14,
      headerName: "Single Sales Order",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={singleSalesOrder}
            size="small"
            variant="standard"
            onChange={(e) => {
              setSingleSalesOrder(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 15,
      headerName: "Apply DC Value",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={applyDCValue}
            size="small"
            variant="standard"
            onChange={(e) => {
              setApplyDCValue(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 16,
      headerName: "Auto SO Short Close",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={autoSOShortClose}
            size="small"
            variant="standard"
            onChange={(e) => {
              setAutoSOShortClose(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 17,
      headerName: "CGST%",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={cgst}
            size="small"
            variant="standard"
            onChange={(e) => {
              setCgst(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 18,
      headerName: "SGST%",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={sgst}
            size="small"
            variant="standard"
            onChange={(e) => {
              setSgst(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 19,
      headerName: "IGST%",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={igst}
            size="small"
            variant="standard"
            onChange={(e) => {
              setIgst(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 20,
      headerName: "UTGST%",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={utgst}
            size="small"
            variant="standard"
            onChange={(e) => {
              setUtgst(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 21,
      headerName: "DC Info Required in",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dcInfoRequiredIn}
              disabled={isEdit}
              onChange={(e) => {
                setDcInfoRequiredIn(e.target.value);
              }}
            >
              <MenuItem value={"Y"}>Y</MenuItem>
              <MenuItem value={"N"}>N</MenuItem>
            </Select>
          </FormControl>
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 22,
      headerName: "Max Line Items In",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={isEdit}
            value={maxLineItemsIn}
            size="small"
            variant="standard"
            onChange={(e) => {
              setMaxLineItemsIn(e.target.value);
            }}
          />
        </span>
      ),
      isDropDown: false,
    },
  ];

  function EditData(props) {
    return (
      <EditIcon
        style={{ color: "#002D68" }}
        onClick={(event) => {
          setContactOpen(true);
        }}
      />
    );
  }

  function DeleteData(props) {
    return (
      <Tooltip title="Delete" arrow>
        <DeleteIcon
          onClick={() => {
            CustomerDeleteFile(
              {
                id: props.selectedRow.id,
              },
              deletehandleSuccess,
              deletehandleException
            );
          }}
          style={{ color: "#002D68" }}
        />
      </Tooltip>
    );
  }

  function DownloadData(props) {
    return (
      <Tooltip title="Download" arrow>
        <DownloadIcon
          onClick={() => {
            DocDownloadExlExport(
              { id: props.selectedRow.id },
              hadleDownloadSuccess,
              handleDownloadEcxeption
            );
          }}
          style={{ color: "#002D68" }}
        />
      </Tooltip>
    );
  }

  const hadleDownloadSuccess = () => {};

  const handleDownloadEcxeption = () => {};

  function ViewdData(props) {
    return (
      <Tooltip title="View" arrow>
        <RemoveRedEyeIcon
          onClick={() => {
            setPdfOpen(true);
            setFileTypeForView(props.selectedRow.filePath);
          }}
          style={{ color: "#002D68" }}
        />
      </Tooltip>
    );
  }

  const handleCellEdit = (params) => {};

  const top100Films = [
    { label: "The Shawshank Redemption", year: 1994 },
    { label: "The Godfather", year: 1972 },
    { label: "The Godfather: Part II", year: 1974 },
    { label: "The Dark Knight", year: 2008 },
    { label: "12 Angry Men", year: 1957 },
    { label: "Schindler's List", year: 1993 },
  ];

  const deletehandleSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });

    setTimeout(() => {
      handleClose();
      setDeleteDailogOpen(false);
      setDataRefresh((oldvalue) => !oldvalue);
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

  console.log("e.target.checked===>", inActiveState);

  const validateForNullValue = (value, type) => {
    if (value !== null && value !== undefined) {
      AddUserValidate(value, type, setErrorObject);
    }
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "100%", maxHeight: "100%" } }}
      maxWidth="xl"
      open={open}
    >
      {/* <DialogTitle
        style={{
          background: "#002D68",
          color: "white",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      > */}
        {/* {isAddButton ? "Customer Master" : "Edit Customer Master"} */}
        {/* <Grid item xs={12} md={8} lg={12} sm={12}>
                    <Card style={{ borderRadius: '8px', height: '65px' }}>
                        <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={top100Films}
                                sx={{ width: 300 }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        label="Search"
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <>
                                                    <InputAdornment position="start">
                                                        <SearchIcon color="action" />
                                                    </InputAdornment>
                                                    {params.InputProps.startAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </CardContent>
                    </Card>
                </Grid> */}
      {/* </DialogTitle> */}
      {/* <DialogContent> */}
        <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    id="filled-basic"
                    label="Customer Code"
                    variant="filled"
                    sx={{ mb: 1 }}
                    margin="dense"
                    size="small"
                    fullWidth
                    required
                    value={customerCode}
                    placeholder="Customer Code"
                    onChange={(e) => setCustomerCode(e.target.value)}
                    onBlur={() =>
                      validateForNullValue(customerCode, "customerCode")
                    }
                    autoComplete="off"
                    error={errorObject?.customerCode?.errorStatus}
                    helperText={errorObject?.customerCode?.helperText}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    id="filled-basic"
                    label="GST Number"
                    variant="filled"
                    type="text"
                    margin="dense"
                    size="small"
                    fullWidth
                    value={gstNumber}
                    required
                    sx={{ mb: 1, marginTop: "8px" }}
                    placeholder="GST Number"
                    onChange={(e) => setGstNumber(e.target.value)}
                    onBlur={() => validateForNullValue(gstNumber, "gstNumber")}
                    autoComplete="off"
                    error={errorObject?.gstNumber?.errorStatus}
                    helperText={errorObject?.gstNumber?.helperText}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    id="filled-basic"
                    sx={{ mb: 1 }}
                    label="Customer Name"
                    variant="filled"
                    margin="dense"
                    size="small"
                    type="text"
                    fullWidth
                    value={customerName}
                    placeholder="Customer Name"
                    required
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                    }}
                    onBlur={() =>
                      validateForNullValue(customerName, "customerName")
                    }
                    autoComplete="off"
                    error={errorObject?.customerName?.errorStatus}
                    helperText={errorObject?.customerName?.helperText}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    sx={{ mb: 1 }}
                    label="Tally Alias"
                    type="text"
                    size="small"
                    fullWidth
                    value={tallyAlias}
                    variant="filled"
                    margin="dense"
                    placeholder="Billing Address"
                    // required
                    onChange={(e) => setTallyAlias(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="demo-simple-select-label">
                      Cust Group
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={customerGrop}
                      label="Cust Group"
                      size="small"
                      variant="filled"
                      onChange={(e) => {
                        setCustomerGrop(e.target.value);
                      }}
                    >
                      {customerGropList.map((data) => (
                        <MenuItem key={data.id} value={data.id}>
                          {data.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    sx={{ mb: 1 }}
                    label="Cust Address"
                    type="text"
                    fullWidth
                    value={customerAddress}
                    variant="filled"
                    placeholder="Cust Address"
                    size="small"
                    // disabled={true}
                    multiline
                    required
                    margin="dense"
                    onChange={(e) => {
                      setCustomerAddress(e.target.value);
                    }}
                    onBlur={() =>
                      validateForNullValue(customerAddress, "customerAddress")
                    }
                    autoComplete="off"
                    error={errorObject?.customerAddress?.errorStatus}
                    helperText={errorObject?.customerAddress?.helperText}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={2}
                  lg={2}
                  xl={2}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#002D68",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={inActiveState}
                        onClick={(e) => {
                          setInActiveState(e.target.checked);
                        }}
                      />
                    }
                    label="In Active"
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                  <TextField
                    sx={{ mb: 1 }}
                    label="City"
                    type="text"
                    fullWidth
                    value={city}
                    variant="filled"
                    placeholder="City"
                    size="small"
                    multiline
                    required
                    margin="dense"
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                    onBlur={() => validateForNullValue(city, "city")}
                    autoComplete="off"
                    error={errorObject?.city?.errorStatus}
                    helperText={errorObject?.city?.helperText}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                  <TextField
                    sx={{ mb: 1 }}
                    label="Pincode"
                    type="text"
                    fullWidth
                    value={pincode}
                    variant="filled"
                    placeholder="Pincode"
                    size="small"
                    multiline
                    required
                    margin="dense"
                    onChange={(e) => {
                      setPincode(e.target.value);
                    }}
                    onBlur={() => validateForNullValue(pincode, "pincode")}
                    autoComplete="off"
                    error={errorObject?.pincode?.errorStatus}
                    helperText={errorObject?.pincode?.helperText}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                  <TextField
                    sx={{ mb: 1 }}
                    label="State"
                    type="text"
                    fullWidth
                    value={state}
                    variant="filled"
                    placeholder="State"
                    size="small"
                    multiline
                    required
                    margin="dense"
                    onChange={(e) => {
                      setState(e.target.value);
                    }}
                    onBlur={() => validateForNullValue(state, "state")}
                    autoComplete="off"
                    error={errorObject?.state?.errorStatus}
                    helperText={errorObject?.state?.helperText}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                  <TextField
                    sx={{ mb: 1 }}
                    label="Country"
                    type="text"
                    fullWidth
                    value={country}
                    variant="filled"
                    placeholder="Country"
                    size="small"
                    multiline
                    required
                    margin="dense"
                    onChange={(e) => {
                      setCountry(e.target.value);
                    }}
                    onBlur={() => validateForNullValue(country, "country")}
                    autoComplete="off"
                    error={errorObject?.country?.errorStatus}
                    helperText={errorObject?.country?.helperText}
                  />
                </Grid>

                {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}
                                    style={{
                                        display: 'flex',
                                        // alignItems: 'center',
                                        // justifyContent: 'space-around'
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        style={{ minwidth: '150px', background: '#002D68', color: 'white' }}
                                        onClick={(e) => {

                                            setContactOpen(true);
                                        }}
                                    >
                                        Contact Person
                                    </Button>
                                </Grid> */}

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Card
                    style={{
                      boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                      marginTop: "20px",
                      borderRadius: "10px",
                      width: "100%",
                      maxheight: "21vh",
                    }}
                  >
                    <CardContent>
                      <DataGrid
                        rows={contectList}
                        columns={columns}
                        pageSize={8}
                        // loading={isLoading}
                        rowsPerPageOptions={[8]}
                        disableSelectionOnClick
                        style={{ border: "none" }}
                        sx={{
                          height: "20vh",
                          // minHeight: '480px',
                          width: "100%",
                          "& .super-app-theme--header": {
                            WebkitTextStrokeWidth: "0.6px",
                          },
                          "& .MuiDataGrid-cell": {
                            border: "1px solid #969696",
                          },
                          "& .MuiDataGrid-columnHeader": {
                            border: "1px solid #969696", // Add border to column headers
                          },
                        }}
                        rowHeight={40}
                        columnHeaderHeight={40}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    sx={{ mb: 1 }}
                    label="Party Notes"
                    type="text"
                    size="small"
                    multiline
                    fullWidth
                    value={partyNotes}
                    variant="filled"
                    margin="dense"
                    placeholder="Party Notes"
                    onChange={(e) => {
                      setPartyNotes(e.target.value);
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                  <Card
                    style={{
                      boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                      marginTop: "10px",
                      borderRadius: "10px",
                      width: "100%",
                      height: "21vh",
                    }}
                  >
                    <CardContent>
                      <DataGrid
                        rows={fileDataList}
                        columns={fileColumns}
                        pageSize={8}
                        // loading={isLoading}
                        rowsPerPageOptions={[8]}
                        disableSelectionOnClick
                        style={{ border: "none" }}
                        sx={{
                          height: "18vh",
                          // minHeight: '480px',
                          width: "100%",
                          "& .super-app-theme--header": {
                            WebkitTextStrokeWidth: "0.6px",
                          },
                          "& .MuiDataGrid-cell": {
                            border: "1px solid #969696",
                          },
                          "& .MuiDataGrid-columnHeader": {
                            border: "1px solid #969696", // Add border to column headers
                          },
                        }}
                        rowHeight={40}
                        columnHeaderHeight={40}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                    <TextField
                                        fullWidth
                                        // variant="filled"
                                        margin="dense"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    if (reader.readyState === 2) {
                                                        setFileUpload(reader.result);
                                                        setFile(reader.result);
                                                    }
                                                };
                                                reader.readAsDataURL(e.target.files[0]);
                                            }
                                        }}
                                        InputLabelProps={{ shrink: true }}
                                        type="file" />
                                </Grid> */}
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
              <Card
                style={{
                  boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                  marginTop: "0px",
                  borderRadius: "10px",
                  width: "100%",
                  height: "100%",
                }}
              >
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} style={{ display: "flex" }}>
                      <Typography style={{ fontWeight: "bold" }}>
                        Header Info
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      {/* <DataGrid
                                                rows={HeaderRows}
                                                columns={columns2}
                                                onCellEditCommit={handleCellEdit}
                                                style={{ border: 'none', }}
                                                hideScrollbar={true}
                                                sx={{
                                                    height: '600px',

                                                    width: '100%',
                                                    overflow: 'hidden',
                                                    // '& .super-app-theme--header': {
                                                    //     WebkitTextStrokeWidth: '0.6px',

                                                    // },
                                                }}
                                                pageSize={10}
                                                rowsPerPageOptions={[20]}
                                            /> */}
                      <div style={{ height: "60vh", overflow: "auto" }}>
                        <table
                          style={{
                            overflow: "auto",
                            borderCollapse: "collapse",
                            border: "1px solid #ddd",
                          }}
                        >
                          <thead>
                            <tr>
                              <th style={{ border: "2px solid #ddd" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  Header Name
                                </div>
                              </th>
                              <th style={{ border: "2px solid #ddd" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  Value
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            style={{
                              height: "300px",
                              width: "400px",
                              border: "1px solid #ddd",
                            }}
                          >
                            {HeaderRows.map((row, index) => (
                              <tr
                                key={index}
                                style={{ border: "1px solid #ddd" }}
                              >
                                <td
                                  style={{
                                    width: "200px",
                                    border: "1px solid #ddd",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {row.headerName}
                                  </div>
                                </td>
                                <td
                                  style={{
                                    maxWidth: "250px",
                                    width: "250px",
                                    border: "1px solid #ddd",
                                    overflow: "auto",
                                    height: "20px",
                                  }}
                                >
                                  {row.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Button
                        variant="outlined"
                        onClick={() => setIsEdit(!isEdit)}
                        sx={{ position: "absolute", bottom: 10 }}
                      >
                        {isEdit ? "Edit" : "Cancel"}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {/* <DialogActions> */}
          <Button
            variant="contained"
            style={{ width: "150px", background: "#002D68", color: "white" }}
            onClick={(e) => {
              setFileUploadOpen(true);
            }}
          >
            file Upload
          </Button>

          <Button
            variant="contained"
            style={{ width: "150px", background: "#002D68", color: "white" }}
            onClick={(e) => {
              setMultiOpen(true);
            }}
          >
            Multi Address
          </Button>

          <Button
            variant="contained"
            style={{ minwidth: "150px", background: "#002D68", color: "white" }}
            onClick={(e) => {
              setContactOpen(true);
            }}
          >
            Contact Person
          </Button>

          <Button
            variant="contained"
            style={{ width: "150px", background: "#002D68", color: "white" }}
            type="submit"
          >
            {isAddButton ? "Add" : "Update"}
          </Button>
          <Button
            variant="contained"
            style={{ width: "150px", background: "#002D68", color: "white" }}
            onClick={(e) => {
              setOpen(false);
              ContactPersonCustomerFileDelete(
                {
                  id: autoCustomId,
                },
                deletehandleSuccess,
                deletehandleException
              );
              CustomerFileDelete(
                {
                  id: autoCustomId,
                },
                deletehandleSuccess,
                deletehandleException
              );
              MultiAddressCustomerFileDelete(
                {
                  id: autoCustomId,
                },
                deletehandleSuccess,
                deletehandleException
              );
              setErrorObject("");
            }}
          >
            Cancel
          </Button>
          {/* </DialogActions> */}
        </form>
      {/* </DialogContent> */}
      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
      <MultiAddressModule
        autoCustomId={autoCustomId}
        multiOpen={multiOpen}
        setMultiOpen={setMultiOpen}
      />
      <MultiContactPersonModule
        autoCustomId={autoCustomId}
        contactOpen={contactOpen}
        setContactOpen={setContactOpen}
      />

      <FileUploadModule
        autoCustomId={autoCustomId}
        fileUploadOpen={fileUploadOpen}
        setFileUploadOpen={setFileUploadOpen}
      />

      <PDFViiewer
        pdfOpen={pdfOpen}
        setPdfOpen={setPdfOpen}
        fileTypeForView={fileTypeForView}
      />

      <DeleteConfirmationDailog
        open={deleteDailogOpen}
        setOpen={setDeleteDailogOpen}
        deleteId={deleteId}
        // deleteService={supplierUploadDelet}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />
    </Dialog>
  );
};

export default CustomerModule;
