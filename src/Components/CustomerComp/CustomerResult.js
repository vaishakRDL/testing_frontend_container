// import React, { useState, useEffect } from 'react';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import { Box, Card, CardContent } from '@mui/material';
// import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
// import CustomerTitle from './CustomerTitle';
// import { DataGrid } from '@mui/x-data-grid';
// import CustomerModule from './CustomerModule';
// import { CustomerDelete, CustomerShow, GetIdCustomer } from '../../ApiService/LoginPageService';
// import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
// // import { connect } from 'react-redux';
// // import { changeUserName } from '../../Actions';
// import '../../App.css';
// import ApplicationStore from '../../Utility/localStorageUtil';

//new customer imports

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
  IconButton,
  FormHelperText,
  CircularProgress,
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
import CustomerTitle from "./CustomerTitle";
import CustomerModule from "./CustomerModule";
import {
  ContactPersonCustomerFileDelete,
  CustomContactShow,
  CustomMultiAddressShow,
  CustomerAdd,
  CustomerDeleteFile,
  CustomerFileDelete,
  CustomerGroupShow,
  Customerpdate,
  DeleteCustomerdata,
  GetCurrencyData,
  GetCurreny,
  GetCustomerGroupData,
  GetCustomerUploadFile,
  GetIdCustomer,
  GetPlaceOfSupply,
  GetPlaceOfSupplyData,
  GetSuppVsItemAllSuppList,
  GetSuppVsItemAllcustList,
  MultiAddressCustomerFileDelete,
  PreviewCustomerData,
  PreviewSupplierData,
  SaveCustomerInfo,
  ShowcustomerLast,
  ShowcustomerReverse,
  Showcustomerfirst,
  Showcustomerforward,
  UpdateCustomerData,
} from "../../ApiService/LoginPageService";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import { DocDownloadExlExport } from "../../ApiService/DownloadCsvReportsService";
import { AddUserValidate } from "../validation/formValidation";
import { CustomerDelete } from "../../ApiService/LoginPageService";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Code } from "@mui/icons-material";
import CustomerSearch from "./CustomerSearch";
import SkillMatrixViewPdf from "../SkillMatrix/SkillMatrixViewPdf";
import CustomerFileOpen from "./CustomerFileOpen";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import CustomerFileUpload from "./CustomerFileUpload";
import { useModuleLocks } from "../context/ModuleLockContext";


const CustomerResult = () => {
  //new chnages customer
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Customer")?.lockStatus === "locked";



  const [customerCode, setCustomerCode] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [tallyAlias, setTallyAlias] = useState("");
  const [customerGropList, setCustomerGroupList] = useState([]);
  const [customerGrop, setCustomerGrop] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerAddress2, setCustomerAddress2] = useState("");
  const [customerAddress3, setCustomerAddress3] = useState("");
  const [customerAddress4, setCustomerAddress4] = useState("");
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
  const [gst, setGst] = useState("");
  const [maxLineItemsIn, setMaxLineItemsIn] = useState("");
  const [allDataList, setAllDataList] = useState([]);
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
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [isAddButton, setIsAddButton] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadMultiAdress, setUploadMultiAdress] = useState([]);
  const [contactPersonDetails, setContactPersonDetails] = useState([]);
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);
  const [mainId, setMainId] = useState(" ");
  const [opeAllView, setOpenAllView] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [saved, setSaved] = useState("");
  const [supplierList, setSupplierList] = useState([]);
  const [fetchData, setFetchData] = useState([]);
  const [custFileSetOpen, setCustFileSetOpen] = useState(false);
  const [panNo, setPanNo] = useState("");
  const [error, setError] = useState(false);
  const [errorPaymentTerms, setErrorPaymentTerms] = useState(false);
  const [errorPlaceOfSupply, setErrorPlaceOfSupply] = useState(false);
  const [errorCreditDays, setErrorCreditDays] = useState(false);
  const [errorcurrency, setErrorcurrency] = useState(false);
  const [stateError, setStateError] = useState(false);
  const maxLength = 20;
  const [newButton, setNewButton] = useState(false);
  useEffect(() => {
    setOpen(open);

    LoadingData();
  }, [editData, dataRefresh]);
  const [isEditMultiAdd, setIsEditMultiAdd] = useState(false);
  const [editeDataId, setEditDataId] = useState('');
  const [multiAddEditRow, setMultiAddEditRow] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetIdCustomerSuccess = (dataObject) => {
    setAutoCustomId(dataObject?.id || "");
  };

  const handleGetIdCustomerException = (errorObject, errorMessage) => { };
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
      setGst(editData?.gst || "");
      setDcInfoRequiredIn(editData?.dcInfoReq || "");
      setMaxLineItemsIn(editData?.maxLineItem || "");
      setAutoCustomId(editData?.cId || "");
    }
  };

  const handleCustomContactShowSuccess = (dataObject) => {
    setContactList(dataObject?.data || []);
  };

  const handleCustomContactShowException = () => { };

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

  const handlGetCustomerUploadFileException = (errorObject, errorMessage) => { };

  const handleCustomerGroupShow = (dataObject) => {
    setCustomerGroupList(dataObject?.data || []);
  };

  const handleCurrencySucess = (dataObject) => {
    setCurrencyList(dataObject?.data || []);
  };

  const handleCustomerGrouSucess = (dataObject) => {
    setCustomerGroupList(dataObject?.data || []);
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
    setLoading(true);
    if (isAddButton) {
      CustomerAdd(
        {
          cId: autoCustomId,
          cCode: customerCode,
          gstNo: gstNumber,
          cName: customerName,
          tallyAlias: tallyAlias,
          cGroup: customerGrop,
          cAddress1: customerAddress,
          cAddress2: customerAddress2,
          cAddress3: customerAddress3,
          cAddress4: customerAddress4,
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
          gst: gst,
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
          cAddress1: customerAddress,
          cAddress2: customerAddress2,
          cAddress3: customerAddress3,
          cAddress4: customerAddress4,
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
      setLoading(false)
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
      setLoading(false)
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
    setCustomerAddress2("");
    setCustomerAddress3("");
    setCustomerAddress4("");
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
    setGst("");
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
      headerClassName: "super-app-theme--header",
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "custName",
      headerName: "Customer Name",
      headerClassName: "super-app-theme--header",
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
      headerClassName: "super-app-theme--header",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "left",
      headerAlign: "center",
    },

    {
      field: "gstNo",
      headerName: "GST No",
      headerClassName: "super-app-theme--header",
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
      headerClassName: "super-app-theme--header",
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
      headerClassName: "super-app-theme--header",
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
      headerClassName: "super-app-theme--header",
      flex: 1,
      headerName: "Actions",
      cellClassName: "actions",
      disableClickEventBubbling: true,
      getActions: (params) => [
        // <DownloadData selectedRow={params.row} />,
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
              disabled={edit}
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
              disabled={edit}
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
              disabled={edit}
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
            disabled={edit}
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
              disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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

  useEffect(() => {
    if (state?.toLowerCase() !== "karnataka") {
      setCgst(""); // Clear CGST if state is not Karnataka
      setSgst(""); // Clear CGST if state is not Karnataka
    }
  }, [state]); // Runs whenever state changes

  const HeaderRows = [
    {
      id: 1,
      headerName: "Currency",
      value: (
        <spacing>
          {/* <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={cuurrency}
              disabled={edit}
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
          </FormControl> */}
          <FormControl fullWidth size="small" variant="standard" error={errorPlaceOfSupply && placeOfSupply === ""}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={cuurrency}
              disabled={edit}
              onBlur={() => setErrorcurrency(true)} // Validate when user leaves the field
              onChange={(e) => {
                setCurrency(e.target.value);
                setErrorcurrency(false); // Clear error when user selects a value
              }}
            >
              {cuurrencyList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
            {errorcurrency && cuurrency === "" && (
              <FormHelperText>Currency is required</FormHelperText>
            )}
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
            disabled={edit}
            value={panNo}
            required
            size="small"
            variant="standard"
            error={error && panNo === ""}
            helperText={error && panNo === "" ? "PAN Number is required" : ""}
            onBlur={() => setError(true)}
            onChange={(e) => {
              setPanNo(e.target.value);
              setError(false); // Reset error when user types
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
            value={paymentTerms}
            size="small"
            variant="standard"
            required
            error={errorPaymentTerms && paymentTerms === ""}
            helperText={
              errorPaymentTerms && paymentTerms === "" ? "Payment Terms are required" : ""
            }
            onBlur={() => setErrorPaymentTerms(true)}
            onChange={(e) => {
              setPaymentTerms(e.target.value);
              setErrorPaymentTerms(false); // Clear error when typing
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
            disabled={edit}
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
            disabled={edit}
            value={creditDays}
            size="small"
            variant="standard"
            required
            error={errorCreditDays && creditDays === ""}
            helperText={
              errorCreditDays && creditDays === "" ? "Credit Days are required" : ""
            }
            onBlur={() => setErrorCreditDays(true)} // Trigger validation when the field loses focus
            onChange={(e) => {
              setCreditDays(e.target.value);
              setErrorCreditDays(false); // Reset error when user types
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
          <FormControl fullWidth size="small" variant="standard" error={errorPlaceOfSupply && placeOfSupply === ""}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={placeOfSupply}
              disabled={edit}
              onBlur={() => setErrorPlaceOfSupply(true)} // Validate when user leaves the field
              onChange={(e) => {
                setPlaceOfSupply(e.target.value);
                setErrorPlaceOfSupply(false); // Clear error when user selects a value
              }}
            >
              {placeOfSupplyList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
            {errorPlaceOfSupply && placeOfSupply === "" && (
              <FormHelperText>Place of Supply is required</FormHelperText>
            )}
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
            disabled={edit}
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
            disabled={edit}
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
            disabled={edit}
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
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={singleSalesOrder}
              disabled={edit}
              onChange={(e) => {
                setSingleSalesOrder(e.target.value);
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
      id: 15,
      headerName: "Apply DC Value",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={edit}
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
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={autoSOShortClose}
              disabled={edit}
              onChange={(e) => {
                setAutoSOShortClose(e.target.value);
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
      id: 17,
      headerName: "CGST%",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={edit || state?.toLowerCase() !== "karnataka"} // Disables if state is not Karnataka
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
            disabled={edit || state?.toLowerCase() !== "karnataka"} // Disables if state is not Karnataka
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
            disabled={edit}
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
            disabled={edit}
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
      headerName: "GST%",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={edit}
            value={gst}
            size="small"
            variant="standard"
            onChange={(e) => {
              setGst(e.target.value);
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
              disabled={edit}
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
      headerName: "Max Items in one Invoice",
      value: (
        <span>
          <TextField
            type="text"
            multiline
            fullWidth
            disabled={edit}
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
          setMultiOpen(true);
          setIsEditMultiAdd(true)
          setEditDataId(props.selectedRow.id);
          setMultiAddEditRow(props.selectedRow)
        }}
      />
    );
  }

  function DeleteData(props) {
    return (
      <Tooltip title="Delete" arrow>
        <DeleteIcon
          onClick={() => {
            setUploadedFiles((prevFiles) =>
              prevFiles.filter((file) => file.id !== props.selectedRow.id)
            );
          }}
          // onClick={() => setOpenDelete(true)}
          style={{ color: "#002D68" }}
        />
      </Tooltip>
    );
  }

  function DownloadData(props) {
    console.log("vvvvvvvvvvvvvvvvvvvvvv", props.selectedRow.filePath);
    const handleDownload = () => {
      const filePath = `http://192.168.1.147:8000/${props.selectedRow.filePath}`;

      if (filePath) {
        // Create a temporary anchor element
        const link = document.createElement("a");
        link.href = filePath;
        link.download = filePath.split("/").pop(); // Extract filename from path
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up
      } else {
        console.error("No file path provided.");
      }
    };

    return (
      <Tooltip title="Download" arrow>
        <DownloadIcon
          onClick={handleDownload}
          style={{ color: "#002D68", cursor: "pointer" }}
        />
      </Tooltip>
    );
  }

  const hadleDownloadSuccess = () => { };

  const handleDownloadEcxeption = () => { };

  function ViewdData(props) {
    return (
      <Tooltip title="View" arrow>
        <RemoveRedEyeIcon
          onClick={() => {
            setPdfOpen(true);
            setFileTypeForView(props.selectedRow.file);
          }}
          style={{ color: "#002D68" }}
        />
      </Tooltip>
    );
  }

  const handleCellEdit = (params) => { };

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

  const handleClearPage = () => {
    setAdd(true);
    setEdit(false);
    setErrorcurrency(false);
    setError(false);
    setErrorCreditDays(false);
    setErrorPlaceOfSupply(false);
    setStateError(false);
    setCustomerCode("");
    setGstNumber("");
    setCustomerName("");
    setTallyAlias("");
    setCustomerGroupList([]);
    setCustomerGrop("");
    setCustomerAddress("");
    setCustomerAddress2("");
    setCustomerAddress3("");
    setCustomerAddress4("");
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
    setGstNumber("");
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
    setGst("");
    setMaxLineItemsIn("");
    setMainId("");
    setPartyNotes("");
    setUploadedFiles([]);
    setUploadMultiAdress([]);
    setContactPersonDetails([]);

    GetCurrencyData(handleCurrencySucess, handleException);
    GetCustomerGroupData(handleCustomerGrouSucess, handleException);
    GetPlaceOfSupplyData(handleGetPlaceOfSupplySucess, handleException);
  };

  const handledReverse = (type, id) => {
    Showcustomerfirst(
      { type: type, id: id },
      handleFirstActionSuccess,
      handleFirstActionException
    );
  };

  const handleFirstActionSuccess = (dataObject) => {
    setFetchData(dataObject || []);
    setEdit(true);
    setAdd(true);
    // setError(false);
    // setErrorCreditDays(false);
    // setErrorPlaceOfSupply(false);
    setCustomerCode(dataObject.custDetails.cCode);
    setGstNumber(dataObject.custDetails.gstNo);
    setCustomerName(dataObject.custDetails.cName);
    setCustomerGrop(dataObject.custDetails.cGroup);
    setTallyAlias(dataObject.custDetails.tallyAlias);
    setCustomerAddress(dataObject.custDetails.cAddress1);
    setCustomerAddress2(dataObject.custDetails.cAddress2);
    setCustomerAddress3(dataObject.custDetails.cAddress3);
    setCustomerAddress4(dataObject.custDetails.cAddress4);
    setCity(dataObject.custDetails.city);
    setPincode(dataObject.custDetails.pincode);
    setState(dataObject.custDetails.state);
    setCountry(dataObject.custDetails.country);
    setCurrency(dataObject.custDetails.currency);
    setPanNo(dataObject.custDetails.panNo);
    setGstinOrUin(dataObject.custDetails.gstInUinId);
    setBillPhoneNo(dataObject.custDetails.bi_phoneNo);
    setBillFaxNo(dataObject.custDetails.bi_faxNo);
    setEmail(dataObject.custDetails.email);
    setPaymentTerms(dataObject.custDetails.payTerm);
    setNoTextRemaks(dataObject.custDetails.noTaxRemark);
    setCreditDays(dataObject.custDetails.creditday);
    setPlaceOfSupply(dataObject.custDetails.placeOfSupply);
    setTcsCollected(dataObject.custDetails.tcsCollected);
    setSurchargesOnTcs(dataObject.custDetails.SubcharOnTcs);
    setCessOnTCS(dataObject.custDetails.CessOnTcs);
    setSingleSalesOrder(dataObject.custDetails.singleSaleOrd);
    setApplyDCValue(dataObject.custDetails.dcValue);
    setAutoSOShortClose(dataObject.custDetails.shortClose);
    setCgst(dataObject.custDetails.cgst);
    setSgst(dataObject.custDetails.sgst);
    setIgst(dataObject.custDetails.igst);
    setUtgst(dataObject.custDetails.utgst);
    setGst(dataObject.custDetails.gst);
    setDcInfoRequiredIn(dataObject.custDetails.dcInfoReq);
    setMaxLineItemsIn(dataObject.custDetails.maxLineItem);
    setMainId(dataObject.custDetails.id);
    setPartyNotes(dataObject.custDetails.partyNotes);
    setInActiveState(dataObject.custDetails.inactiveStatus);
    setUploadedFiles(dataObject.customerDocs);
    setContactPersonDetails(dataObject.contactPersons);
    setUploadMultiAdress(dataObject.multiAddress);
    setSaved(dataObject.customerDocs.saved);
  };

  const handleFirstActionException = () => { };

  useEffect(() => {
    GetCurrencyData(handleCurrencySucess, handleException);
    GetCustomerGroupData(handleCustomerGrouSucess, handleException);
    GetPlaceOfSupplyData(handleGetPlaceOfSupplySucess, handleException);
    ShowcustomerLast(
      { type: "last" },
      handleLastActionSuccess,
      handleLastActionException
    );
  }, []);

  const handleForwardReverse = (type, id) => {
    ShowcustomerLast(
      { type: type, id: id },
      handleLastActionSuccess,
      handleLastActionException
    );
  };

  const handleLastActionSuccess = (dataObject) => {
    setFetchData(dataObject || []);
    setEdit(true);
    setAdd(true);
    // setError(false);
    // setErrorCreditDays(false);
    // setErrorPlaceOfSupply(false);
    setCustomerCode(dataObject.custDetails.cCode);
    setGstNumber(dataObject.custDetails.gstNo);
    setCustomerName(dataObject.custDetails.cName);
    setTallyAlias(dataObject.custDetails.tallyAlias);
    setCustomerGrop(dataObject.custDetails.cGroup);
    setCustomerAddress(dataObject.custDetails.cAddress1);
    setCustomerAddress2(dataObject.custDetails.cAddress2);
    setCustomerAddress3(dataObject.custDetails.cAddress3);
    setCustomerAddress4(dataObject.custDetails.cAddress4);
    setCity(dataObject.custDetails.city);
    setPincode(dataObject.custDetails.pincode);
    setState(dataObject.custDetails.state);
    setCountry(dataObject.custDetails.country);
    setCurrency(dataObject.custDetails.currency);
    setPanNo(dataObject.custDetails.panNo);
    setGstinOrUin(dataObject.custDetails.gstInUinId);
    setBillPhoneNo(dataObject.custDetails.bi_phoneNo);
    setBillFaxNo(dataObject.custDetails.bi_faxNo);
    setEmail(dataObject.custDetails.email);
    setPaymentTerms(dataObject.custDetails.payTerm);
    setNoTextRemaks(dataObject.custDetails.noTaxRemark);
    setCreditDays(dataObject.custDetails.creditday);
    setPlaceOfSupply(dataObject.custDetails.placeOfSupply);
    setTcsCollected(dataObject.custDetails.tcsCollected);
    setSurchargesOnTcs(dataObject.custDetails.SubcharOnTcs);
    setCessOnTCS(dataObject.custDetails.CessOnTcs);
    setSingleSalesOrder(dataObject.custDetails.singleSaleOrd);
    setApplyDCValue(dataObject.custDetails.dcValue);
    setAutoSOShortClose(dataObject.custDetails.shortClose);
    setCgst(dataObject.custDetails.cgst);
    setSgst(dataObject.custDetails.sgst);
    setIgst(dataObject.custDetails.igst);
    setUtgst(dataObject.custDetails.utgst);
    setGst(dataObject.custDetails.gst);
    setDcInfoRequiredIn(dataObject.custDetails.dcInfoReq);
    setMaxLineItemsIn(dataObject.custDetails.maxLineItem);
    setMainId(dataObject.custDetails.id);
    setPartyNotes(dataObject.custDetails.partyNotes);
    setInActiveState(dataObject.custDetails.inactiveStatus);
    setUploadedFiles(dataObject.customerDocs);
    setContactPersonDetails(dataObject.contactPersons);
    setUploadMultiAdress(dataObject.multiAddress);
    setSaved(dataObject.customerDocs.saved);
  };

  const handleLastActionException = (errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
    }, 3000);
  };

  const handlecustomerforward = (type, id) => {
    Showcustomerforward(
      { type: type, id: id },
      handleforwardActionSuccess,
      handleforwardActionException
    );
  };

  const handleforwardActionSuccess = (dataObject) => {
    setFetchData(dataObject || []);
    setEdit(true);
    setAdd(true);
    // setError(false);
    // setErrorCreditDays(false);
    // setErrorPlaceOfSupply(false);
    setCustomerCode(dataObject.custDetails.cCode);
    setGstNumber(dataObject.custDetails.gstNo);
    setCustomerName(dataObject.custDetails.cName);
    setCustomerGrop(dataObject.custDetails.cGroup);
    setTallyAlias(dataObject.custDetails.tallyAlias);
    setCustomerAddress(dataObject.custDetails.cAddress1);
    setCustomerAddress2(dataObject.custDetails.cAddress2);
    setCustomerAddress3(dataObject.custDetails.cAddress3);
    setCustomerAddress4(dataObject.custDetails.cAddress4);
    setCity(dataObject.custDetails.city);
    setPincode(dataObject.custDetails.pincode);
    setState(dataObject.custDetails.state);
    setCountry(dataObject.custDetails.country);
    setCurrency(dataObject.custDetails.currency);
    setPanNo(dataObject.custDetails.panNo);
    setGstinOrUin(dataObject.custDetails.gstInUinId);
    setBillPhoneNo(dataObject.custDetails.bi_phoneNo);
    setBillFaxNo(dataObject.custDetails.bi_faxNo);
    setEmail(dataObject.custDetails.email);
    setPaymentTerms(dataObject.custDetails.payTerm);
    setNoTextRemaks(dataObject.custDetails.noTaxRemark);
    setCreditDays(dataObject.custDetails.creditday);
    setPlaceOfSupply(dataObject.custDetails.placeOfSupply);
    setTcsCollected(dataObject.custDetails.tcsCollected);
    setSurchargesOnTcs(dataObject.custDetails.SubcharOnTcs);
    setCessOnTCS(dataObject.custDetails.CessOnTcs);
    setSingleSalesOrder(dataObject.custDetails.singleSaleOrd);
    setApplyDCValue(dataObject.custDetails.dcValue);
    setAutoSOShortClose(dataObject.custDetails.shortClose);
    setCgst(dataObject.custDetails.cgst);
    setSgst(dataObject.custDetails.sgst);
    setIgst(dataObject.custDetails.igst);
    setUtgst(dataObject.custDetails.utgst);
    setGst(dataObject.custDetails.gst);
    setDcInfoRequiredIn(dataObject.custDetails.dcInfoReq);
    setMaxLineItemsIn(dataObject.custDetails.maxLineItem);
    setMainId(dataObject.custDetails.id);
    setPartyNotes(dataObject.custDetails.partyNotes);
    setInActiveState(dataObject.custDetails.inactiveStatus);
    setUploadedFiles(dataObject.customerDocs);
    setContactPersonDetails(dataObject.contactPersons);
    setUploadMultiAdress(dataObject.multiAddress);
    setSaved(dataObject.customerDocs.saved);
  };

  const handleforwardActionException = (errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
    }, 3000);
  };

  const handlecustomerReverse = (type, id) => {
    ShowcustomerReverse(
      { type: type, id: id },
      handleReverseActionSuccess,
      handleReverseActionException
    );
  };

  const handleReverseActionSuccess = (dataObject) => {
    setFetchData(dataObject || []);
    setEdit(true);
    setAdd(true);
    // setError(false);
    // setErrorCreditDays(false);
    // setErrorPlaceOfSupply(false);
    setCustomerCode(dataObject.custDetails.cCode);
    setGstNumber(dataObject.custDetails.gstNo);
    setCustomerName(dataObject.custDetails.cName);
    setCustomerGrop(dataObject.custDetails.cGroup);
    setTallyAlias(dataObject.custDetails.tallyAlias);
    setCustomerAddress(dataObject.custDetails.cAddress1);
    setCustomerAddress2(dataObject.custDetails.cAddress2);
    setCustomerAddress3(dataObject.custDetails.cAddress3);
    setCustomerAddress4(dataObject.custDetails.cAddress4);
    setCity(dataObject.custDetails.city);
    setPincode(dataObject.custDetails.pincode);
    setState(dataObject.custDetails.state);
    setCountry(dataObject.custDetails.country);
    setCurrency(dataObject.custDetails.currency);
    setPanNo(dataObject.custDetails.panNo);
    setGstinOrUin(dataObject.custDetails.gstInUinId);
    setBillPhoneNo(dataObject.custDetails.bi_phoneNo);
    setBillFaxNo(dataObject.custDetails.bi_faxNo);
    setEmail(dataObject.custDetails.email);
    setPaymentTerms(dataObject.custDetails.payTerm);
    setNoTextRemaks(dataObject.custDetails.noTaxRemark);
    setCreditDays(dataObject.custDetails.creditday);
    setPlaceOfSupply(dataObject.custDetails.placeOfSupply);
    setTcsCollected(dataObject.custDetails.tcsCollected);
    setSurchargesOnTcs(dataObject.custDetails.SubcharOnTcs);
    setCessOnTCS(dataObject.custDetails.CessOnTcs);
    setSingleSalesOrder(dataObject.custDetails.singleSaleOrd);
    setApplyDCValue(dataObject.custDetails.dcValue);
    setAutoSOShortClose(dataObject.custDetails.shortClose);
    setCgst(dataObject.custDetails.cgst);
    setSgst(dataObject.custDetails.sgst);
    setIgst(dataObject.custDetails.igst);
    setUtgst(dataObject.custDetails.utgst);
    setGst(dataObject.custDetails.gst);
    setDcInfoRequiredIn(dataObject.custDetails.dcInfoReq);
    setMaxLineItemsIn(dataObject.custDetails.maxLineItem);
    setMainId(dataObject.custDetails.id);
    setPartyNotes(dataObject.custDetails.partyNotes);
    setInActiveState(dataObject.custDetails.inactiveStatus);
    setUploadedFiles(dataObject.customerDocs);
    setContactPersonDetails(dataObject.contactPersons);
    setUploadMultiAdress(dataObject.multiAddress);
    setSaved(dataObject.customerDocs.saved);
  };

  const handleReverseActionException = (errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
    }, 3000);
  };

  // const handleCustomerSubmit = () => {
  //   if (add) {
  //     SaveCustomerInfo(
  //       {
  //         custDetails: {
  //           cCode: customerCode,
  //           gstNo: gstNumber,
  //           cName: customerName,
  //           tallyAlias: tallyAlias,
  //           cGroup: customerGrop,
  //           cAddress1: customerAddress,
  //           cAddress2: customerAddress2,
  //           cAddress3: customerAddress3,
  //           cAddress4: customerAddress4,
  //           inactiveStatus: inActiveState,
  //           city: city,
  //           pincode: pincode,
  //           state: state,
  //           country: country,
  //           partyNotes: partyNotes,
  //           currency: cuurrency,
  //           panNo: panNo,
  //           gstInUinId: gstNumberUinId,
  //           bi_phoneNo: billPhoneNo,
  //           bi_faxNo: billFaxNo,
  //           email: email,
  //           payTerm: paymentTerms,
  //           noTaxRemark: noTaxRemaks,
  //           creditday: creditDays,
  //           placeOfSupply: placeOfSupply,
  //           tcsCollected: tcsCollected,
  //           SubcharOnTcs: surchargesOnTcs,
  //           CessOnTcs: cessOnTCS,
  //           singleSaleOrd: singleSalesOrder,
  //           dcValue: applyDCValue,
  //           shortClose: autoSOShortClose,
  //           cgst: cgst,
  //           sgst: sgst,
  //           igst: igst,
  //           utgst: utgst,
  //           dcInfoReq: dcInfoRequiredIn,
  //           maxLineItem: maxLineItemsIn,
  //         },
  //         customerDocs: uploadedFiles,
  //         multiAddress: uploadMultiAdress,
  //         contactPersons: contactPersonDetails,
  //       },
  //       handleSaveSuccess,
  //       handleSaveException
  //     );
  //   } else {
  //     UpdateCustomerData(
  //       {
  //         custDetails: {
  //           id: mainId,
  //           cCode: customerCode,
  //           gstNo: gstNumber,
  //           cName: customerName,
  //           tallyAlias: tallyAlias,
  //           cGroup: customerGrop,
  //           cAddress1: customerAddress,
  //           cAddress2: customerAddress2,
  //           cAddress3: customerAddress3,
  //           cAddress4: customerAddress4,
  //           inactiveStatus: inActiveState,
  //           city: city,
  //           pincode: pincode,
  //           state: state,
  //           country: country,
  //           partyNotes: partyNotes,
  //           currency: cuurrency,
  //           panNo: panNo,
  //           gstInUinId: gstNumberUinId,
  //           bi_phoneNo: billPhoneNo,
  //           bi_faxNo: billFaxNo,
  //           email: email,
  //           payTerm: paymentTerms,
  //           noTaxRemark: noTaxRemaks,
  //           creditday: creditDays,
  //           placeOfSupply: placeOfSupply,
  //           tcsCollected: tcsCollected,
  //           SubcharOnTcs: surchargesOnTcs,
  //           CessOnTcs: cessOnTCS,
  //           singleSaleOrd: singleSalesOrder,
  //           dcValue: applyDCValue,
  //           shortClose: autoSOShortClose,
  //           cgst: cgst,
  //           sgst: sgst,
  //           igst: igst,
  //           utgst: utgst,
  //           dcInfoReq: dcInfoRequiredIn,
  //           maxLineItem: maxLineItemsIn,
  //         },
  //         customerDocs: uploadedFiles,
  //         multiAddress: uploadMultiAdress,
  //         contactPersons: contactPersonDetails,
  //       },
  //       handleUpdateSuccess,
  //       handleUpdateException
  //     );
  //   }
  // };

  const handleCustomerSubmit = () => {
    setLoading(true)
    let isValid = true;

    if (!cuurrency) {
      setErrorcurrency(true);
      isValid = false;
    } else {
      setErrorcurrency(false);
    }
    if (!panNo) {
      setError(true);
      isValid = false;
    } else {
      setError(false);
    }

    // if (!creditDays) {
    //   setErrorCreditDays(true);
    //   isValid = false;
    // } else {
    //   setErrorCreditDays(false);
    // }

    if (!placeOfSupply) {
      setErrorPlaceOfSupply(true);
      isValid = false;
    } else {
      setErrorPlaceOfSupply(false);
    }

    // if (!state) {
    //   setStateError(true);
    //   isValid = false;
    // } else {
    //   setStateError(false);
    // }

    // Prevent submission if validation fails
    if (!isValid) return;

    const customerData = {
      custDetails: {
        cCode: customerCode,
        gstNo: gstNumber,
        cName: customerName,
        tallyAlias: tallyAlias,
        cGroup: customerGrop,
        cAddress1: customerAddress,
        cAddress2: customerAddress2,
        cAddress3: customerAddress3,
        cAddress4: customerAddress4,
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
        SubcharOnTcs: surchargesOnTcs,
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
      customerDocs: uploadedFiles,
      multiAddress: uploadMultiAdress,
      contactPersons: contactPersonDetails,
    };

    if (add) {
      SaveCustomerInfo(customerData, handleSaveSuccess, handleSaveException);
    } else {
      UpdateCustomerData(
        { ...customerData, custDetails: { ...customerData.custDetails, id: mainId } },
        handleUpdateSuccess,
        handleUpdateException
      );
    }
  };


  const handleDelete = () => {
    DeleteCustomerdata({ id: mainId }, handleSuccess, handleException);
  };

  const handleUpdateSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });

    setTimeout(() => {
      handleClose();
      setLoading(false);
    }, 3000);
  };

  const handleUpdateException = (dataObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
      setLoading(false);
    }, 3000);
  };

  const handleSaveSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });

    setTimeout(() => {
      handleClose();
      setLoading(false);
    }, 3000);
  };

  const handleSaveException = (dataObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
      setLoading(false);
    }, 3000);
  };

  const handleSupSearchChange = (e) => {
    GetSuppVsItemAllcustList(
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
      PreviewCustomerData(
        { id: value.id, type: "fetchByID" },
        handleGetSuppDataSucessShow,
        handleGetSuppDataExceptionShow
      );
    }
  };

  const handleGetSuppDataSucessShow = (dataObject) => {
    setEdit(true);
    setAdd(true);
    setCustomerCode(dataObject.custDetails.cCode);
    setGstNumber(dataObject.custDetails.gstNo);
    setCustomerName(dataObject.custDetails.cName);
    setCustomerGrop(dataObject.custDetails.cGroup);
    setTallyAlias(dataObject.custDetails.tallyAlias);
    setCustomerAddress(dataObject.custDetails.cAddress1);
    setCustomerAddress2(dataObject.custDetails.cAddress2);
    setCustomerAddress3(dataObject.custDetails.cAddress3);
    setCustomerAddress4(dataObject.custDetails.cAddress4);
    setCity(dataObject.custDetails.city);
    setPincode(dataObject.custDetails.pincode);
    setState(dataObject.custDetails.state);
    setCountry(dataObject.custDetails.country);
    setCurrency(dataObject.custDetails.currency);
    setPanNo(dataObject.custDetails.panNo);
    setGstinOrUin(dataObject.custDetails.gstInUinId);
    setBillPhoneNo(dataObject.custDetails.bi_phoneNo);
    setBillFaxNo(dataObject.custDetails.bi_faxNo);
    setEmail(dataObject.custDetails.email);
    setPaymentTerms(dataObject.custDetails.payTerm);
    setNoTextRemaks(dataObject.custDetails.noTaxRemark);
    setCreditDays(dataObject.custDetails.creditday);
    setPlaceOfSupply(dataObject.custDetails.placeOfSupply);
    setTcsCollected(dataObject.custDetails.tcsCollected);
    setSurchargesOnTcs(dataObject.custDetails.SubcharOnTcs);
    setCessOnTCS(dataObject.custDetails.CessOnTcs);
    setSingleSalesOrder(dataObject.custDetails.singleSaleOrd);
    setApplyDCValue(dataObject.custDetails.dcValue);
    setAutoSOShortClose(dataObject.custDetails.shortClose);
    setCgst(dataObject.custDetails.cgst);
    setSgst(dataObject.custDetails.sgst);
    setIgst(dataObject.custDetails.igst);
    setUtgst(dataObject.custDetails.utgst);
    setGst(dataObject.custDetails.gst);
    setDcInfoRequiredIn(dataObject.custDetails.dcInfoReq);
    setMaxLineItemsIn(dataObject.custDetails.maxLineItem);
    setMainId(dataObject.custDetails.id);
    setPartyNotes(dataObject.custDetails.partyNotes);
    setInActiveState(dataObject.custDetails.inactiveStatus);
    setUploadedFiles(dataObject.customerDocs);
    setContactPersonDetails(dataObject.contactPersons);
    setUploadMultiAdress(dataObject.multiAddress);
    setSaved(dataObject.customerDocs.saved);
  };
  const handleGetSuppDataExceptionShow = (dataObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
    }, 3000);
  };

  const arrayToWorksheet = (array) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Customer Result Report');

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
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Center align all data rows
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    return workbook;
  };

  const downloadExcelFile = async (workbook, filename) => {
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
  };

  const handleDownload = () => {
    const formattedData = allDataList.map((data) => ({

      "Cutomer Code": data?.cCode,
      "GST No": data?.gstNo,
      "Customer Name": data?.cName,
      "Tally Alias": data?.tallyAlias,
      "Cust Group": data?.cGroupName,
      "Cust Address 1": data?.cAddress1,
      "cust Address 2": data?.cAddress2,
      "cust Address 3": data?.cAddress3,
      "cust Address 4": data?.cAddress4,
      "City": data?.city,
      "Pincode": data?.pincode,
      "State": data?.state,
      "Country": data?.country,
      "Currency": data?.currencyName,
      "Pan No": data?.panNo,
      "Bill Phone No": data?.bi_phoneNo,
      "Bill Fax No": data?.bi_faxNo,
      "Email": data?.email,
      "Payment Terms": data?.payTerm,
      "No Tax Remarks": data?.noTaxRemark,
      "Credit Days": data?.creditday,
      "Place Of Supply": data?.placeOfSupplyName,
      "TCS Collected": data?.tcsCollected,
      "Subcharges on TCS": data?.SubcharOnTcs,
      "Cess on TCS": data?.CessOnTcs,
      "Single Sales Order": data?.singleSaleOrd,
      "Apply DC Value": data?.dcValue,
      "Auto SO Short Close": data?.shortClose,
      "CGST%": data?.cgst,
      "SGST%": data?.sgst,
      "IGST%": data?.igst,
      "UIGST%": data?.utgst,

    }))

    const workbook = arrayToWorksheet(formattedData);
    downloadExcelFile(workbook, 'Customer Result Report.xlsx');
  }


  return (
    <div style={{ height: "60vh", width: "100%" }}>
      <CustomerTitle
      // setIsAddButton={setIsAddButton}
      // setEditEdit={setEditEdit}
      // setOpen={setOpen}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingBottom: "20px",
          overflow: "scroll",
          height: "650px",
        }}
      >
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
                    disabled={edit}
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
                    disabled={edit}
                    value={gstNumber}
                    required
                    sx={{ mb: 1, marginTop: "8px" }}
                    placeholder="GST Number"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 15) {
                        setGstNumber(value);
                      }
                    }}
                    onBlur={() => {
                      if (gstNumber.length < 13 || gstNumber.length > 15) {
                        setErrorObject((prev) => ({
                          ...prev,
                          gstNumber: {
                            errorStatus: true,
                            helperText: "GST Number must be between 13 and 15 characters.",
                          },
                        }));
                      } else {
                        setErrorObject((prev) => ({
                          ...prev,
                          gstNumber: { errorStatus: false, helperText: "" },
                        }));
                      }
                    }}
                    // onBlur={() => validateForNullValue(gstNumber, "gstNumber")}
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
                    disabled={edit}
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
                    disabled={edit}
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
                      disabled={edit}
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
                    label="Cust Address 1"
                    type="text"
                    fullWidth
                    disabled={edit}
                    value={customerAddress}
                    variant="filled"
                    placeholder="Cust Address"
                    size="small"
                    // disabled={true}
                    multiline
                    maxRows={2}
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
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    sx={{ mb: 1 }}
                    label="Cust Address 2"
                    type="text"
                    fullWidth
                    disabled={edit}
                    value={customerAddress2}
                    variant="filled"
                    placeholder="Cust Address"
                    size="small"
                    // disabled={true}
                    multiline
                    maxRows={2}
                    // required
                    margin="dense"
                    onChange={(e) => {
                      setCustomerAddress2(e.target.value);
                    }}
                    onBlur={() =>
                      validateForNullValue(customerAddress2, "customerAddress")
                    }
                    autoComplete="off"
                    error={errorObject?.customerAddress?.errorStatus}
                    helperText={errorObject?.customerAddress?.helperText}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    sx={{ mb: 1 }}
                    label="Cust Address 3"
                    type="text"
                    fullWidth
                    disabled={edit}
                    value={customerAddress3}
                    variant="filled"
                    placeholder="Cust Address"
                    size="small"
                    // disabled={true}
                    multiline
                    maxRows={2}
                    // required
                    margin="dense"
                    onChange={(e) => {
                      setCustomerAddress3(e.target.value);
                    }}
                    onBlur={() =>
                      validateForNullValue(customerAddress3, "customerAddress")
                    }
                    autoComplete="off"
                    error={errorObject?.customerAddress?.errorStatus}
                    helperText={errorObject?.customerAddress?.helperText}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <TextField
                    sx={{ mb: 1 }}
                    label="Cust Address 4"
                    type="text"
                    fullWidth
                    disabled={edit}
                    value={customerAddress4}
                    variant="filled"
                    placeholder="Cust Address"
                    size="small"
                    // disabled={true}
                    multiline
                    maxRows={2}
                    // required
                    margin="dense"
                    onChange={(e) => {
                      setCustomerAddress4(e.target.value);
                    }}
                    onBlur={() =>
                      validateForNullValue(customerAddress4, "customerAddress")
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
                        checked={inActiveState === 1}
                        onClick={(e) => {
                          setInActiveState(e.target.checked ? 1 : 0); // Convert boolean to 1/0
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
                    disabled={edit}
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
                    disabled={edit}
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
                    disabled={edit}
                    value={state}
                    variant="filled"
                    placeholder="State"
                    size="small"
                    multiline
                    required
                    margin="dense"
                    onChange={(e) => {
                      setState(e.target.value);
                      setStateError(false)
                    }}
                    onBlur={() => {
                      validateForNullValue(state, "state")
                      setStateError(true)
                    }}
                    autoComplete="off"
                    // error={errorObject?.state?.errorStatus}
                    // helperText={errorObject?.state?.helperText}
                    error={stateError && state === ""}
                    helperText={stateError && state === "" ? "State is required" : ""}
                  />
                  {/* //////////////////////////////////// */}
                  {/* <TextField
                    type="text"
                    multiline
                    fullWidth
                    disabled={edit}
                    value={panNo}
                    required
                    size="small"
                    variant="standard"
                    error={error && panNo === ""}
                    helperText={error && panNo === "" ? "PAN Number is required" : ""}
                    onBlur={() => setError(true)}
                    onChange={(e) => {
                      setPanNo(e.target.value);
                      setError(false); // Reset error when user types
                    }}
                  /> */}
                </Grid>
                <Grid item xs={12} sm={12} md={2.4} lg={2.4} xl={2.4}>
                  <TextField
                    sx={{ mb: 1 }}
                    label="Country"
                    type="text"
                    fullWidth
                    disabled={edit}
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
                        rows={uploadMultiAdress}
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
                            backgroundColor: "#93bce6",
                            color: "#1c1919",
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
                        rows={uploadedFiles}
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
                            backgroundColor: "#93bce6",
                            color: "#1c1919",
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
                    <Grid
                      item
                      xs={12}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginRight: "10px",
                      }}
                    >
                      <Typography style={{ fontWeight: "bold", flex: 1 }}>
                        Header Info
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={supplierList}
                          disabled={isModuleLocked}
                          fullWidth
                          getOptionLabel={(option) => option.label || ""}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Customer"
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
                        <IconButton
                          onClick={handleDownload}
                          style={{ marginLeft: "10px" }}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </div>
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
                      <div style={{ height: "75vh", overflow: "auto" }}>
                        <table
                          style={{
                            overflow: "auto",
                            borderCollapse: "collapse",
                            border: "1px solid #ddd",
                            width: "100%",
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
                      {/* <Button
                        variant="outlined"
                        onClick={() => setIsEdit(!isEdit)}
                        sx={{ position: "absolute", bottom: 10 }}
                      >
                        {isEdit ? "Edit" : "Cancel"}
                      </Button> */}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </form>
      </div>
      {/* <DialogActions> */}
      <div
        style={{
          display: "flex",
          columnGap: "10px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          style={{ width: "150px", background: isModuleLocked ? "#706f6f" : "#002D68", color: "white" }}
          disabled={isModuleLocked}
          onClick={handleClearPage}
        >
          New
        </Button>

        <Button
          variant="contained"
          style={{ width: "150px", background: isModuleLocked ? "#706f6f" : "#002D68", color: "white" }}
          disabled={isModuleLocked}


          onClick={() => {
            setEdit(false);
            setAdd(false);
          }}
        >
          Edit
        </Button>

        <Button
          variant="contained"
          style={{ width: "150px", background: isModuleLocked ? "#706f6f" : "#002D68", color: "white" }}
          disabled={isModuleLocked}

          onClick={() => setDeleteDailogOpen(true)}
        >
          Delete
        </Button>

        <Button
          variant="contained"
          style={{ width: "150px", background: isModuleLocked ? "#706f6f" : "#002D68", color: "white" }}
          disabled={isModuleLocked}
          onClick={handleCustomerSubmit}
        >
          {/* {add ? "save" : "Update"} */}
          {loading ? (
            <CircularProgress size={24} style={{ color: 'white' }} />
          ) : (add ? 'Add' : 'Update')}
        </Button>
        <Button
          variant="contained"
          style={{ width: "150px", background: isModuleLocked ? "#706f6f" : "#002D68", color: "white" }}
          disabled={isModuleLocked}

          onClick={handleClearPage}
        >
          Clear
        </Button>
        <Button
          variant="contained"
          style={{ width: "150px", background: isModuleLocked ? "#706f6f" : "#002D68", color: "white" }}
          disabled={isModuleLocked}

          onClick={() => setCustFileSetOpen(true)}
        >
          Import
        </Button>
        <Button
          variant="contained"
          style={{
            minwidth: "150px",
            background: "#002D68",
            color: "white",
          }}
          onClick={() => handledReverse("first", "")}


        >
          <FastRewindIcon />
        </Button>
        <Button
          variant="contained"
          style={{
            minwidth: "150px",
            background: "#002D68",
            color: "white",
          }}
          onClick={() => handlecustomerReverse("reverse", mainId)}


        >
          <SkipPreviousIcon />
        </Button>
        <Button
          variant="contained"
          style={{
            minwidth: "150px",
            background: "#002D68",
            color: "white",
          }}
          onClick={() => {
            setOpenAllView(true);
          }}
          disabled={isModuleLocked}

        >
          <SearchIcon />
        </Button>
        <Button
          variant="contained"
          style={{
            minwidth: "150px",
            background: "#002D68",
            color: "white",
          }}
          onClick={() => handlecustomerforward("forward", mainId)}
          disabled={isModuleLocked}

        >
          <SkipNextIcon />
        </Button>
        <Button
          variant="contained"
          style={{
            minwidth: "150px",
            background: "#002D68",
            color: "white",
          }}
          onClick={() => handleForwardReverse("last", "")}
          disabled={isModuleLocked}

        >
          <FastForwardIcon />
        </Button>

        <Button
          variant="contained"
          style={{ width: "150px", background: isModuleLocked ? "#706f6f" : "#002D68", color: "white" }}
          onClick={(e) => {
            setFileUploadOpen(true);
          }}
          disabled={isModuleLocked}

        >
          file Upload
        </Button>

        <Button
          variant="contained"
          style={{ width: "150px", background: isModuleLocked ? "#706f6f" : "#002D68", color: "white" }}
          onClick={(e) => {
            setMultiOpen(true);
          }}
          disabled={isModuleLocked}

        >
          Multi Address
        </Button>

        <Button
          variant="contained"
          style={{
            minwidth: "150px",
            background: isModuleLocked ? "#706f6f" : "#002D68",
            color: "white",
          }}
          disabled={isModuleLocked}

          onClick={(e) => {
            setContactOpen(true);
          }}
        >
          Contact Person
        </Button>
      </div >
      {/* </DialogActions> */}
      < CustomerSearch opeAllView={opeAllView} setOpenAllView={setOpenAllView}
        allDataList={allDataList}
        setAllDataList={setAllDataList}
      />
      <CustomerModule
        isAddButton={isAddButton}
        editData={editData}
        open={open}
        setOpen={setOpen}
        setRefreshData={setRefreshData}
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
        deleteId={mainId}
        deleteService={CustomerDelete}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />
      <FileUploadModule
        autoCustomId={autoCustomId}
        fileUploadOpen={fileUploadOpen}
        setFileUploadOpen={setFileUploadOpen}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
      />
      <MultiAddressModule
        autoCustomId={autoCustomId}
        multiOpen={multiOpen}
        setMultiOpen={setMultiOpen}
        setUploadMultiAdress={setUploadMultiAdress}
        uploadMultiAdress={uploadMultiAdress}
        setIsEditMultiAdd={setIsEditMultiAdd}
        isEditMultiAdd={isEditMultiAdd}
        editeDataId={editeDataId}
        setEditDataId={setEditDataId}
        multiAddEditRow={multiAddEditRow}
        customerCodeMulti={customerCode}
        customerNameMulti={customerName}

      />
      <MultiContactPersonModule
        autoCustomId={autoCustomId}
        contactOpen={contactOpen}
        setContactOpen={setContactOpen}
        contactPersonDetails={contactPersonDetails}
        setContactPersonDetails={setContactPersonDetails}
      />
      <CustomerFileOpen
        pdfOpen={pdfOpen}
        setPdfOpen={setPdfOpen}
        fileTypeForView={fileTypeForView}
        saved={saved}
      />

      <CustomerFileUpload
        open={custFileSetOpen}
        setOpen={setCustFileSetOpen}
        setRefreshData={setRefreshData}
      />
    </div >
  );
};

export default CustomerResult;
