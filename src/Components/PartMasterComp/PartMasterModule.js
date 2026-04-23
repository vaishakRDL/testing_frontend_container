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
  InputAdornment,
  CardActionArea,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { Card } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { DataGrid } from "@mui/x-data-grid";
import { CheckBox } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import {
  FIMIDDataShow,
  HSNCodeDataShow,
  ItemAdd,
  ItemDataDelete,
  ItemGetItemsTypeFirst,
  ItemGroupShowMaster,
  ItemMastersCatogryDataShow,
  ItemSearchNAAJ,
  ItemUpdate,
  ItemsDataShow,
  MainLocationDataShow,
  ProductFamilyDataShow,
  ProductFinishDataShow,
  RMItemcode,
  RMItemcodeDataShow,
  SubLocationDataShow,
  SuppDetailsList,
  UOMShowMaster,
  UnderLedgerDataShow,
} from "../../ApiService/LoginPageService";
import Menu from "@mui/material/Menu";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SearchIcon from "@mui/icons-material/Search";
import DeleteConfirmationDailog from "../../Utility/confirmDeletion";
import BulkCreation from "./BulkCreation/BulkCreation";
import CopyFrom from "./CopyFrom";
import PartMinMaxModule from "./PartMinMaxModule";
import SearchAllItems from "./SearchAllItems";
import UpdateStoreItemInfo from "./UpdateStoreItemInfo";
import ImportItemRate from "./ImportItemRate";
import BulkPriceUpdate from "./BulkPriceUpdate/BulkPriceUpdate";
import ApplicationStore from "../../Utility/localStorageUtil";
import { useModuleLocks } from "../context/ModuleLockContext";

const PartMasterModule = ({
  open,
  setOpen,
  setIsCopyFrom,
  isCopyFrom,
  isAddButton,
  editData,
  setRefreshData,
  isView,
  setIsView,
  setEditeData,
  refreshData,
  setIsAddButton,
  editeData,
  selectedName,
  setSelectedName,
  isPMView,
  setIsPmView,
  typeId, setTypeId,
  setSelectedPartId, selectedPartId, setSelectedPart, selectedPart
}) => {
  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: "",
  });
  // const [isPMView, setIsPmView] = useState(false);
  const [itemList, setItemList] = useState([])
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sitemCode, setSitemCode] = useState("");
  const [sitemName, setSitemName] = useState("");
  const [itemGroup, setItemGroup] = useState("");
  const [tallyERP, setTallyERP] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [inActiveSatte, setInActiveSate] = useState(false);
  const [nonStockable, setNonStockable] = useState(false);
  const [uom, setUom] = useState("");
  const [stdRate, setStdRate] = useState("");
  const [gstCategary, setGstCategory] = useState("");
  const [partImage, setPartImage] = useState("");
  const [itemGroupList, setItemGroupList] = useState([]);
  const [uomList, setUomList] = useState([]);
  // const [selectedPart, setSelectedPart] = useState([]);
  // const [selectedPartId, setSelectedPartId] = useState(null);
  console.log("selectedPartIdselectedPartId==>", selectedPartId);
  const [underLedgerList, setUnderLedgerList] = useState([]);
  const [HSNCodeList, setHSNCodeList] = useState([]);
  const [mainLocationList, setMainLocationList] = useState([]);
  const [subLocationList, setSubLocationList] = useState([]);
  const [productFinishList, setProductFinishList] = useState([]);
  const [productFamilyList, setProductFamilyList] = useState([]);
  const [FIMIDList, setFIMIDList] = useState([]);
  const [RMItemcodeList, setRMItemcodeList] = useState([]);

  const [minStockLevel, setMinStockLevel] = useState("");
  const [maxLevel, setMaxLevel] = useState("");
  const [underLedger, setUnderLedger] = useState("");
  const [reorder, setReorder] = useState("");
  const [rol, setRol] = useState("");
  const [roq, setRoq] = useState("");
  const [shelfLifeItem, setShelfLifeItem] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [critical, setCritical] = useState("");
  const [mainLocation, setMainLocation] = useState("");
  const [subLocation, setSubLocation] = useState("");
  const [productFinish, setProductFinish] = useState("");
  const [productFamily, setProductFamily] = useState("");
  const [fimid, setFimid] = useState("");
  const [duty, setDuty] = useState("");
  const [grossWeight, setGrossWeight] = useState("");
  const [netWeight, setNetWeight] = useState("");
  const [scrapWeight, setScrapWeight] = useState("");
  const [rmItemcode, setRmItemcode] = useState("");
  const [rmThickness, setRmThickness] = useState("");
  const [rmWidth, setRmWidth] = useState("");
  const [rmLength, setRmLength] = useState("");
  const [stockControl, setStockControl] = useState("");
  const [material, setMaterial] = useState("");
  const [materialthickness, setMaterialthickness] = useState("");
  const [isJCPart, setIsJCPart] = useState("");
  const [partType, setPartType] = useState("");
  const [sdCode, setSdCode] = useState("");
  const [deliveryPackageType, setDeliveryPackageType] = useState("");
  const [deliveryLotQuantity, setDeliveryLotQuantity] = useState("");

  const [BinNo, setBinNo] = useState("");
  const [LotWiseItem, setLotWiseItem] = useState("");
  const [LotType, setLotType] = useState("");
  const [MOQ, setMOQ] = useState("");
  const [invtoolsel, setInvtoolsel] = useState("");
  const [toolId, setToolId] = useState("");
  const [ledTime, setLedTime] = useState("");
  const [stCond, setStcond] = useState("");
  const [sItemNo, setSitemNo] = useState("");
  const [itemNo, setItemNo] = useState("");
  const [minLevel, setMinLevel] = useState("");
  const [locId, setLocId] = useState("");
  const [slocid, setSlocId] = useState("");
  const [category, setCategory] = useState("");
  const [RMSItemID, setRMSItemID] = useState("");
  const [conversionConcept, setConversionConcept] = useState(0);

  const [editeViewImg, setEditViewImg] = useState("");
  const [itemShowListSeach, setItemShowListSeach] = useState([]);
  const [itemShowList, setItemShowList] = useState([]);

  // const url = 'http://192.168.1.148:8000/';
  const baseUrl = process.env.REACT_APP_API_URL;
  const url = baseUrl.split("api/");

  const [CategoryList, setCategoryList] = useState([]);

  const [deleteDailogOpen, setDeleteDailogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [BulkCreationOpen, setBulkCreationOpen] = useState(false);
  const [updateStoreOpen, setUpdateStoreOpen] = useState(false);
  const [ImportItemOpen, setImportItemOpen] = useState(false);

  const [BulkCopyOpen, setBulkCopyOpen] = useState(false);
  const [bulkPrice, setBulkPrice] = useState(false);

  const [itemInfoOpen, setItemInfoOpen] = useState(false);
  const [type, setType] = useState("");
  // const [typeId, setTypeId] = useState("");
  const [dataList, setDataList] = useState([]);
  const [opeAllView, setOpenAllView] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { userDetails } = ApplicationStore()?.getStorage("userDetails");
  const userPermission = userDetails?.groupRights?.filter(
    (data) => data?.menu?.toLowerCase() === "item"
  );
  const [disableTextField, setDisableTextField] = useState(false);
  const [loading, setLoading] = useState(false);
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Item")?.lockStatus === "locked";

  useEffect(() => {
    // if (open) {
    LoadData();

  }, [open, editData,/* isAddButton,*/ refreshData]);

  useEffect(() => {
    if (!isCopyFrom) {
      setSitemCode(dataList?.itemCode || "");
    }
    setSitemName(dataList?.itemName || "");
    setItemGroup(dataList?.itemGroup || "");
    setTallyERP(dataList?.tallyOrErp || "");
    setInActiveSate(dataList?.inActive || false);
    setUom(dataList?.uom || "");
    setStdRate(dataList?.stdRate || "");
    setGstCategory(dataList?.gstCategory || "");
    setEditViewImg(dataList?.npdFile || "");
    setSelectedCategory(dataList?.category || "");
    setMinStockLevel(dataList?.minStockLvl || "");
    // setConversionConcept(dataList?.itemCode || "");
    setMaxLevel(dataList?.maxLvl || "");
    setUnderLedger(dataList?.underLedger || "");
    setReorder(dataList?.reorder || "");
    setRol(dataList?.rol || "");
    setRoq(dataList?.roq || "");
    setShelfLifeItem(dataList?.shelfLifeItem || "");
    setHsnCode(dataList?.hsnCode || "");
    setCritical(dataList?.critical || "");
    setMainLocation(dataList?.mainLocation || "");
    setSubLocation(dataList?.subLocation || "");
    setProductFinish(dataList?.productFinish || "");
    setProductFamily(dataList?.productFamily || "");
    setFimid(dataList?.fimId || "");
    setDuty(dataList?.duty || "");
    setGrossWeight(dataList?.grossWeight || "");
    setNetWeight(dataList?.netWeight || "");
    setScrapWeight(dataList?.scrapWeight || "");
    setRmItemcode(dataList?.rmItemCode || "");
    setRmThickness(dataList?.rmThickness || "");
    setRmWidth(dataList?.rmWidth || "");
    setRmLength(dataList?.rmLength || "");
    setStockControl(dataList?.stockControl || "");
    setMaterial(dataList?.material || "");
    setMaterialthickness(dataList?.materialThickness || "");
    setIsJCPart(dataList?.jcPart || "");
    setPartType(dataList?.partType || "");
    setSdCode(dataList?.sdCode || "");
    setDeliveryPackageType(dataList?.delPackageType || "");
    setDeliveryLotQuantity(dataList?.delLotQty || "");
    setNonStockable(dataList?.nonStockable || "");
    setBinNo(dataList?.binNo || "");
    setLotWiseItem(dataList?.lotWiseItem || "");
    setLotType(dataList?.lotType || "");
    setMOQ(dataList?.MOQ || "");
    setInvtoolsel(dataList?.INVTOOLSEL || "");
    setToolId(dataList?.TOOLID || "");
    setLedTime(dataList?.ledTime || "");
    setStcond(dataList?.STCOND || "");
    setMinLevel(dataList?.minLvl || " ");
    setRMSItemID(dataList?.RMItemId || "");
    setEditViewImg(dataList?.npdFile || "");
    setCreatedBy(dataList?.createdBy || "");
    setCreatedAt(dataList?.created_at || "");
    setUpdatedBy(dataList?.updatedBy || "");
    setUpdatedAt(dataList?.updated_at || "");
    console.log("dataList?.filePat==>", url[0]);
  }, [dataList]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open1 = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsCopyFrom(false)
  };
  const handleClose1 = () => {
    setAnchorEl(null);
  };

  const options = itemShowListSeach.map((item) => ({
    id: item?.id,
    label: item?.label,
  }));
  const LoadData = () => {
    ItemSearchNAAJ({
      text: ''
    }, handleItemSearchNAAJSucees, handleItemSearchNAAJException);

    ItemGroupShowMaster(
      {
        masterType: "itemGroup",
      },
      hadleItemGroupShowMasterSuccess,
      ShowMasterException
    );

    UOMShowMaster(
      {
        masterType: "uom",
      },
      UOMShowMasterSuccess,
      ShowMasterException
    );

    UnderLedgerDataShow(
      {
        id: "underLedger",
      },
      UnderLedgerDataShowSuccess,
      ShowMasterException
    );
    HSNCodeDataShow(
      {
        id: "hsnCode",
      },
      HSNCodeDataShowSuccess,
      ShowMasterException
    );
    MainLocationDataShow(
      {
        id: "mainLocation",
      },
      MainLocationDataShowSuccess,
      ShowMasterException
    );
    SubLocationDataShow(
      {
        id: "subLocation",
      },
      SubLocatioDataShowSuccess,
      ShowMasterException
    );
    ProductFinishDataShow(
      {
        id: "productFinish",
      },
      ProductFinishDataShowSuccess,
      ShowMasterException
    );
    ProductFamilyDataShow(
      {
        id: "productFamily",
      },
      ProductFamilyDataShowSuccess,
      ShowMasterException
    );
    FIMIDDataShow(
      {
        id: "fim",
      },
      FIMIDDataShowSuccess,
      ShowMasterException
    );
    RMItemcodeDataShow(
      {
        id: "rmItemcode",
      },
      RMItemcodeShowSuccess,
      ShowMasterException
    );

    ItemMastersCatogryDataShow(
      handleItemMastersCatogryDataShowSuccess,
      handleItemMastersCatogryDataShowException
    );

    SuppDetailsList(
      {
        id: editData?.id,
      },
      handleSuppDetailsListSuccess,
      handleSuppDetailsListException
    );
    // if (!isCopyFrom) {
    setSitemCode(editData?.itemCode || "");
    // }
    setSitemName(editData?.itemName || "");
    setItemGroup(editData?.itemGroup || "");
    setTallyERP(editData?.tallyOrErp || "");
    setInActiveSate(editData?.inActive || false);
    setUom(editData?.uom || "");
    setStdRate(editData?.stdRate || "");
    setGstCategory(editData?.gstCategory || "");
    setEditViewImg(editData?.npdFile || "");
    setSelectedCategory(editData?.category || "");
    setMinStockLevel(editData?.minStockLvl || "");
    setConversionConcept(editData?.conversionConcept || 0);
    setSelectedPart(editData?.conversionPart || "");
    setSelectedPartId(editData?.conversionPartId || null);
    // must be number or null
    setMaxLevel(editData?.maxLvl || "");
    setUnderLedger(editData?.underLedger || "");
    setReorder(editData?.reorder || "");
    setRol(editData?.rol || "");
    setRoq(editData?.roq || "");
    setShelfLifeItem(editData?.shelfLifeItem || "");
    setHsnCode(editData?.hsnCode || "");
    setCritical(editData?.critical || "");
    setMainLocation(editData?.mainLocation || "");
    setSubLocation(editData?.subLocation || "");
    setProductFinish(editData?.productFinish || "");
    setProductFamily(editData?.productFamily || "");
    setFimid(editData?.fimId || "");
    setDuty(editData?.duty || "");
    setGrossWeight(editData?.grossWeight || "");
    setNetWeight(editData?.netWeight || "");
    setScrapWeight(editData?.scrapWeight || "");
    setRmItemcode(editData?.rmItemCode || "");
    setRmThickness(editData?.rmThickness || "");
    setRmWidth(editData?.rmWidth || "");
    setRmLength(editData?.rmLength || "");
    setStockControl(editData?.stockControl || "");
    setMaterial(editData?.material || "");
    setMaterialthickness(editData?.materialThickness || "");
    setIsJCPart(editData?.jcPart || "");
    setPartType(editData?.partType || "");
    setSdCode(editData?.sdCode || "");
    setDeliveryPackageType(editData?.delPackageType || "");
    setDeliveryLotQuantity(editData?.delLotQty || "");
    setNonStockable(editData?.nonStockable || "");
    setBinNo(editData?.binNo || "");
    setLotWiseItem(editData?.lotWiseItem || "");
    setLotType(editData?.lotType || "");
    setMOQ(editData?.MOQ || "");
    setInvtoolsel(editData?.INVTOOLSEL || "");
    setToolId(editData?.TOOLID || "");
    setLedTime(editData?.ledTime || "");
    setStcond(editData?.STCOND || "");
    setMinLevel(editData?.minLvl || " ");
    setRMSItemID(editData?.RMItemId || "");
  };

  const handleItemMastersCatogryDataShowSuccess = (dataObject) => {
    setCategoryList(dataObject?.data || []);
  };

  const handleItemMastersCatogryDataShowException = (
    errorObject,
    errorMessage
  ) => {
    console.log("dataObjectdataObject---->", errorMessage);
  };

  const handleSuppDetailsListSuccess = (dataObject) => {
    setRows(dataObject?.data || []);
  };
  const handleSuppDetailsListException = (errorObject, errorMessage) => {
    console.log("errorMessage", errorMessage);
  };
  const ClearData = () => {
    // setIsEdit(false);
    setIsAddButton(true);
    setSitemCode("");
    setSitemName("");
    setItemGroup("");
    setTallyERP("");
    setInActiveSate(false);
    setUom("");
    setStdRate("");
    setGstCategory("");
    setPartImage("");
    // setItemGroupList([]);
    setUomList([]);

    setUnderLedgerList([]);
    setHSNCodeList([]);
    setMainLocationList([]);
    setSubLocationList([]);
    setProductFinishList([]);
    setProductFamilyList([]);
    setFIMIDList([]);
    setRMItemcodeList([]);

    setMinStockLevel("");
    setMaxLevel("");
    setUnderLedger("");
    setReorder("");
    setRol("");
    setRoq("");
    setShelfLifeItem("");
    setHsnCode("");
    setCritical("");
    setMainLocation("");
    setSubLocation("");
    setProductFinish("");
    setProductFamily("");

    setFimid("");
    setDuty("");
    setGrossWeight("");
    setNetWeight("");
    setScrapWeight("");
    setRmItemcode("");
    setRmThickness("");
    setRmWidth("");
    setRmLength("");
    setStockControl("");
    setMaterial("");
    setMaterialthickness("");
    setIsJCPart("");
    setPartType("");
    setSdCode("");
    setDeliveryPackageType("");
    setDeliveryLotQuantity("");

    setBinNo("");
    setLotWiseItem("");
    setLotType("");
    setMOQ("");
    setInvtoolsel("");
    setToolId("");
    setLedTime("");
    setStcond("");
    setMinLevel(" ");
    setRMSItemID("");
    setIsEdit(false);
    setOpen(false);
    setRefreshData((oldValue) => !oldValue);
    setEditeData([]);
    setConversionConcept(0);
    setSelectedPart([]);
  };

  const RMItemcodeShowSuccess = (dataObject) => {
    setRMItemcodeList(dataObject?.data || []);
  };
  const FIMIDDataShowSuccess = (dataObject) => {
    setFIMIDList(dataObject?.data || []);
  };
  const ProductFamilyDataShowSuccess = (dataObject) => {
    setProductFamilyList(dataObject?.data || []);
  };
  const ProductFinishDataShowSuccess = (dataObject) => {
    setProductFinishList(dataObject?.data || []);
  };
  const SubLocatioDataShowSuccess = (dataObject) => {
    setSubLocationList(dataObject?.data || []);
  };
  const MainLocationDataShowSuccess = (dataObject) => {
    setMainLocationList(dataObject?.data || []);
  };

  const HSNCodeDataShowSuccess = (dataObject) => {
    setHSNCodeList(dataObject?.data || []);
  };
  const UnderLedgerDataShowSuccess = (dataObject) => {
    setUnderLedgerList(dataObject?.data || []);
  };

  const UOMShowMasterSuccess = (dataObject) => {
    setUomList(dataObject?.data || []);
  };

  const hadleItemGroupShowMasterSuccess = (dataObject) => {
    setItemGroupList(dataObject?.data || []);
  };

  const ShowMasterException = (errorObject, errorMessage) => { };

  const handleChange = (e) => {
    RMItemcode({ code: e.target.value }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
  }

  const handleItemVsProcessItemSucessShow = (dataObject) => {
    setItemList(dataObject?.data || []);
  }
  const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
  }

  const handleSupplierSearchItemChange = (value) => {
    if (value !== null) {
      setRmItemcode(value.itemCode);
    }
  }
  const handleAutocompleteChange = (event, selectedValue) => {
    console.log("Selected Value =>", selectedValue);

    if (!selectedValue) {
      // user cleared
      setSelectedPart("");
      setSelectedPartId(null);
      return;
    }

    setSelectedPart(selectedValue.label);
    setSelectedPartId(selectedValue.id); // Now will not be undefined
  };
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    if (isAddButton || isCopyFrom) {
      ItemAdd(
        {
          itemCode: sitemCode,
          itemName: sitemName,
          itemGroup: itemGroup,
          tallyOrErp: tallyERP,
          inActive: inActiveSatte,
          uom: uom,
          stdRate: stdRate,
          gstCategory: gstCategary,
          file: partImage,
          minStockLvl: minStockLevel,
          maxLvl: maxLevel,
          underLedger: underLedger,
          reorder: reorder,
          rol: rol,
          roq: roq,
          shelfLifeItem: shelfLifeItem,
          hsnCode: hsnCode,
          critical: critical,
          mainLocation: mainLocation,
          subLocation: subLocation,
          productFinish: productFinish,
          productFamily: productFamily,
          category: selectedCategory,
          fimId: fimid,
          duty: duty,
          grossWeight: grossWeight,
          netWeight: netWeight,
          scrapWeight: scrapWeight,
          rmItemCode: rmItemcode,
          rmThickness: rmThickness,
          rmWidth: rmWidth,
          rmLength: rmLength,
          stockControl: stockControl,
          material: material,
          materialThickness: materialthickness,
          jcPart: isJCPart,
          partType: partType,
          sdCode: sdCode,
          delPackageType: deliveryPackageType,
          delLotQty: deliveryLotQuantity,
          nonStockable: nonStockable,
          binNo: BinNo,
          lotWiseItem: LotWiseItem,
          lotType: LotType,
          MOQ: MOQ,
          INVTOOLSEL: invtoolsel,
          TOOLID: toolId,
          ledTime: ledTime,
          STCOND: stCond,
          RMItemId: RMSItemID,
          minLvl: minLevel,
          conversionConcept: conversionConcept,
          conversionPart: selectedPart,
          conversionPartId: selectedPartId

        },
        handleItemAddSuccess,
        handleItemAddException
      );
    } else {
      ItemUpdate(
        {
          id: editData.id,
          itemCode: sitemCode,
          itemName: sitemName,
          itemGroup: itemGroup,
          tallyOrErp: tallyERP,
          inActive: inActiveSatte,
          uom: uom,
          stdRate: stdRate,
          gstCategory: gstCategary,
          file: partImage,
          minStockLvl: minStockLevel,
          maxLvl: maxLevel,
          underLedger: underLedger,
          reorder: reorder,
          rol: rol,
          roq: roq,
          shelfLifeItem: shelfLifeItem,
          hsnCode: hsnCode,
          critical: critical,
          mainLocation: mainLocation,
          subLocation: subLocation,
          productFinish: productFinish,
          productFamily: productFamily,
          category: selectedCategory,
          fimId: fimid,
          duty: duty,
          grossWeight: grossWeight,
          netWeight: netWeight,
          scrapWeight: scrapWeight,
          rmItemCode: rmItemcode,
          rmThickness: rmThickness,
          rmWidth: rmWidth,
          rmLength: rmLength,
          stockControl: stockControl,
          material: material,
          materialThickness: materialthickness,
          jcPart: isJCPart,
          partType: partType,
          sdCode: sdCode,
          delPackageType: deliveryPackageType,
          delLotQty: deliveryLotQuantity,
          nonStockable: nonStockable,
          binNo: BinNo,
          lotWiseItem: LotWiseItem,
          lotType: LotType,
          MOQ: MOQ,
          INVTOOLSEL: invtoolsel,
          TOOLID: toolId,
          ledTime: ledTime,
          STCOND: stCond,
          RMItemId: RMSItemID,
          minLvl: minLevel,
          conversionConcept: conversionConcept,
          conversionPart: selectedPart,
          conversionPartId: selectedPartId
        },
        handleItemUpateSuccess,
        handleItemAddException
      );
    }
  };

  const handleItemUpateSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject.message,
    });
    setTimeout(() => {
      ClearData();
      handleClose();
      setLoading(false);
    }, 2000);
  };

  const handleItemAddSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: "success",
      message: dataObject?.message,
    });
    setTimeout(() => {
      ClearData();
      setIsCopyFrom(false);
      handleClose();
      setLoading(false);
    }, 2000);
  };

  const handleItemAddException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // ClearData();
      // handleClose();
      setIsCopyFrom(false);
      setLoading(false);
    }, 2000);
  };
  const validateForNullValue = (value, type) => { };

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: "",
    });
  };

  function EditData(props) {
    return <EditIcon style={{ color: "purple" }} onClick={(event) => { }} />;
  }

  function DeleteData(props) {
    return <DeleteIcon onClick={() => { }} style={{ color: "purple" }} />;
  }

  const handleCellEdit = (params) => { };

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
      // editable: true,
      renderCell: (params) => [<FieldsAction selectedRow={params.row} />],
    },
  ];

  function FieldsAction(props) {
    return (
      <>
        {props.selectedRow.headerName === "Under Ledger [Mst]" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={underLedger}
              disabled={isPMView ? true : false}
              onChange={(e) => setUnderLedger(e.target.value)}
            >
              {underLedgerList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "Reorder" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={reorder}
              disabled={isPMView ? true : false}
              onChange={(e) => setReorder(e.target.value)}
            >
              <MenuItem value={"Y"}>Y</MenuItem>
              <MenuItem value={"N"}>N</MenuItem>
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "Shelf Life Item" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={shelfLifeItem}
              disabled={isPMView ? true : false}
              onChange={(e) => setShelfLifeItem(e.target.value)}
            >
              <MenuItem value={"Y"}>Y</MenuItem>
              <MenuItem value={"N"}>N</MenuItem>
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "HSNCode [Mst]" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={hsnCode}
              disabled={isPMView ? true : false}
              onChange={(e) => setHsnCode(e.target.value)}
            >
              {HSNCodeList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "Critical" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={critical}
              disabled={isPMView ? true : false}
              onChange={(e) => setCritical(e.target.value)}
            >
              <MenuItem value={"Y"}>Y</MenuItem>
              <MenuItem value={"N"}>N</MenuItem>
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "Main Location [Mst]" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={mainLocation}
              disabled={isPMView ? true : false}
              onChange={(e) => setMainLocation(e.target.value)}
            >
              {mainLocationList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "Sub Location [Mst]" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={subLocation}
              disabled={isPMView ? true : false}
              onChange={(e) => setSubLocation(e.target.value)}
            >
              {subLocationList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "Product Finish" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={productFinish}
              disabled={isPMView ? true : false}
              onChange={(e) => setProductFinish(e.target.value)}
            >
              {productFinishList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "Product Family" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={productFamily}
              disabled={isPMView ? true : false}
              onChange={(e) => setProductFamily(e.target.value)}
            >
              {productFamilyList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "Category" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedCategory}
              disabled={isPMView ? true : false}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                console.log("setSelectedCategory", e.target.value);
              }}
            >
              {CategoryList.map((data) => (
                <MenuItem key={data.id} value={data.name}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "FIMID [Mst]" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={fimid}
              label="Age"
              disabled={isPMView ? true : false}
              onChange={(e) => setFimid(e.target.value)}
            >
              {FIMIDList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "RM Itemcode [Mst]" ? (
          <FormControl fullWidth>
            {/* <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={rmItemcode}
              disabled={isPMView ? true : false}
              onChange={(e) => setRmItemcode(e.target.value)}
            >
              {RMItemcodeList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select> */}


          </FormControl>
        ) : props.selectedRow.headerName === "Stock Control" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={stockControl}
              disabled={isPMView ? true : false}
              onChange={(e) => setStockControl(e.target.value)}
            >
              <MenuItem value={"Y"}>Y</MenuItem>
              <MenuItem value={"N"}>N</MenuItem>
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "Is JC Part" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={isJCPart}
              disabled={isPMView ? true : false}
              onChange={(e) => setIsJCPart(e.target.value)}
            >
              <MenuItem value={"Y"}>Y</MenuItem>
              <MenuItem value={"N"}>N</MenuItem>
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "Part Type" ? (
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={partType}
              label="Age"
              disabled={isPMView ? true : false}
              onChange={(e) => setPartType(e.target.value)}
            >
              <MenuItem value={"FG"}>FG</MenuItem>
              <MenuItem value={"SFG"}>SFG</MenuItem>
            </Select>
          </FormControl>
        ) : props.selectedRow.headerName === "Min Stock Level" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={minStockLevel}
            onChange={(e) => setMinStockLevel(e.target.value)}
          />
        ) : props.selectedRow.headerName === "Max Level" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={maxLevel}
            onChange={(e) => setMaxLevel(e.target.value)}
          />
        ) : props.selectedRow.headerName === "ROL" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          />
        ) : props.selectedRow.headerName === "ROQ" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={roq}
            onChange={(e) => setRoq(e.target.value)}
          />
        ) : props.selectedRow.headerName === "Duty" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={duty}
            onChange={(e) => setDuty(e.target.value)}
          />
        ) : props.selectedRow.headerName === "Gross Weight" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={grossWeight}
            onChange={(e) => setGrossWeight(e.target.value)}
          />
        ) : props.selectedRow.headerName === "Net Weight" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={netWeight}
            onChange={(e) => setNetWeight(e.target.value)}
          />
        ) : props.selectedRow.headerName === "Scrap Weight (Kgs)" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={scrapWeight}
            onChange={(e) => setScrapWeight(e.target.value)}
          />
        ) : props.selectedRow.headerName === "RM Thickness" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={rmThickness}
            onChange={(e) => setRmThickness(e.target.value)}
          />
        ) : props.selectedRow.headerName === "RM Width" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={rmWidth}
            onChange={(e) => setRmWidth(e.target.value)}
          />
        ) : props.selectedRow.headerName === "RM Length" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={rmLength}
            onChange={(e) => setRmLength(e.target.value)}
          />
        ) : props.selectedRow.headerName === "Material" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          />
        ) : props.selectedRow.headerName === "Material thickness" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={materialthickness}
            onChange={(e) => setMaterialthickness(e.target.value)}
          />
        ) : props.selectedRow.headerName === "SD Code" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={sdCode}
            onChange={(e) => setSdCode(e.target.value)}
          />
        ) : props.selectedRow.headerName === "Delivery Package Type" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={deliveryPackageType}
            onChange={(e) => setDeliveryPackageType(e.target.value)}
          />
        ) : props.selectedRow.headerName === "Delivery Lot Quantity" ? (
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={deliveryLotQuantity}
            onChange={(e) => setDeliveryLotQuantity(e.target.value)}
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
      headerName: "Conversion Concept",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={conversionConcept}
              disabled={isPMView ? true : false}
              // onChange={(e) => setConversionConcept(e.target.value)}
              onChange={(e) => {
                const value = e.target.value;
                setConversionConcept(value);

                if (value === 0) {
                  setSelectedPart(''); // clears conversion part selection
                  setSelectedPartId(null);

                }
              }}

            >
              <MenuItem value={0}>NO</MenuItem>
              <MenuItem value={1}>YES</MenuItem>
            </Select>
          </FormControl>
        </span>
      ),
      isDropDown: false,
    },
    ...(conversionConcept === 1
      ? [
        {
          id: 2,
          headerName: "Conversion Part",
          value: (
            <span>
              {/* <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={rmItemcode}
              disabled={isPMView ? true : false}
              onChange={(e) => setRmItemcode(e.target.value)}
            >
              {RMItemcodeList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
              {/* <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={options}
                size="small"
                value={options.find(item => item.itemId === selectedPartId) || null}
                getOptionLabel={(option) => option?.label ?? ""}
                renderInput={(params) => (
                  <TextField {...params} label="Search By Conversion Part" onChange={textEntery} />
                )}
                onChange={(event, value) => handleAutocompleteChange(event, value)}
              /> */}
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={options}
                size="small"
                value={options.find(item => item.id === selectedPartId) || null}
                getOptionLabel={(option) => option?.label ?? ""}
                renderInput={(params) => (
                  <TextField {...params} label="Search By Conversion Part" onChange={textEntery} />
                )}
                onChange={handleAutocompleteChange}
              />


            </span>
          ),
          isDropDown: false,
        },
      ]
      : []),
    {
      id: 3,
      headerName: "Min Stock Level",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={minStockLevel}
            size="small"
            variant="standard"
            onChange={(e) => setMinStockLevel(e.target.value)}
          />
        </span>
      ),
    },
    {
      id: 4,
      headerName: "Max Level",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={maxLevel}
            size="small"
            variant="standard"
            onChange={(e) => setMaxLevel(e.target.value)}
          />
        </span>
      ),
      isDropDown: true,
    },
    // {
    //   id: 3,
    //   headerName: "Under Ledger [Mst]",
    //   value: (
    //     <span>
    //       <FormControl fullWidth size="small" variant="standard">
    //         <Select
    //           labelId="demo-simple-select-label"
    //           id="demo-simple-select"
    //           value={underLedger}
    //           disabled={isPMView ? true : false}
    //           onChange={(e) => setUnderLedger(e.target.value)}
    //         >
    //           {underLedgerList.map((data) => (
    //             <MenuItem key={data.id} value={data.id}>
    //               {data.name}
    //             </MenuItem>
    //           ))}
    //         </Select>
    //       </FormControl>
    //     </span>
    //   ),
    //   isDropDown: false,
    // },
    {
      id: 5,
      headerName: "Reorder",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={reorder}
              disabled={isPMView ? true : false}
              onChange={(e) => setReorder(e.target.value)}
            >
              <MenuItem value={"Y"}>Y</MenuItem>
              <MenuItem value={"N"}>N</MenuItem>
            </Select>
          </FormControl>
        </span>
      ),
      isDropDown: true,
    },
    {
      id: 6,
      headerName: "ROL",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={rol}
            size="small"
            variant="standard"
            onChange={(e) => setRol(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 7,
      headerName: "ROQ",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={roq}
            size="small"
            variant="standard"
            onChange={(e) => setRoq(e.target.value)}
          />
        </span>
      ),
      isDropDown: true,
    },
    {
      id: 8,
      headerName: "Shelf Life Item",
      value: (
        <span>
          <FormControl fullWidth>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={shelfLifeItem}
              disabled={isPMView ? true : false}
              size="small"
              variant="standard"
              onChange={(e) => setShelfLifeItem(e.target.value)}
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
      id: 9,
      headerName: "HSNCode [Mst]",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard" error={!hsnCode} sx={{
            backgroundColor: !hsnCode ? "#FFCCCC" : "transparent", // Light red when empty
            borderRadius: "4px", // Optional: for a smooth look
          }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={hsnCode}
              disabled={isPMView ? true : false}
              onChange={(e) => setHsnCode(e.target.value)}
              displayEmpty

            >
              <MenuItem value="" disabled>
                Required    </MenuItem>
              {HSNCodeList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name} | {data.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 10,
      headerName: "Critical",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={critical}
              disabled={isPMView ? true : false}
              onChange={(e) => setCritical(e.target.value)}
            >
              <MenuItem value={"Y"}>Y</MenuItem>
              <MenuItem value={"N"}>N</MenuItem>
            </Select>
          </FormControl>
        </span>
      ),
      isDropDown: true,
    },
    {
      id: 11,
      headerName: "Main Location [Mst]",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={mainLocation}
              disabled={isPMView ? true : false}
              onChange={(e) => setMainLocation(e.target.value)}
            >
              {mainLocationList.map((data) => (
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
      id: 12,
      headerName: "Sub Location [Mst]",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={subLocation}
              disabled={isPMView ? true : false}
              onChange={(e) => setSubLocation(e.target.value)}
            >
              {subLocationList.map((data) => (
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
      id: 13,
      headerName: "Product Finish",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={productFinish}
              disabled={isPMView ? true : false}
              onChange={(e) => setProductFinish(e.target.value)}
            >
              {productFinishList.map((data) => (
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
      id: 14,
      headerName: "Product Family",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={productFamily}
              disabled={isPMView ? true : false}
              onChange={(e) => setProductFamily(e.target.value)}
            >
              {productFamilyList.map((data) => (
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
      id: 15,
      headerName: "Category",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedCategory}
              disabled={isPMView ? true : false}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                console.log("setSelectedCategory", e.target.value);
              }}
            >
              {CategoryList.map((data) => (
                <MenuItem key={data.id} value={data.name}>
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
      id: 16,
      headerName: "FIMID [Mst]",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={fimid}
              label="Age"
              disabled={isPMView ? true : false}
              onChange={(e) => setFimid(e.target.value)}
            >
              {FIMIDList.map((data) => (
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
      id: 17,
      headerName: "Duty",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={duty}
            size="small"
            variant="standard"
            onChange={(e) => setDuty(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 18,
      headerName: "Gross Weight",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={grossWeight}
            size="small"
            variant="standard"
            onChange={(e) => setGrossWeight(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 19,
      headerName: "Net Weight",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={netWeight}
            size="small"
            variant="standard"
            onChange={(e) => setNetWeight(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 20,
      headerName: "Scrap Weight (Kgs)",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={scrapWeight}
            size="small"
            variant="standard"
            onChange={(e) => setScrapWeight(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 21,
      headerName: "RM Itemcode [Mst]",
      value: (
        <span>
          {/* <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={rmItemcode}
              disabled={isPMView ? true : false}
              onChange={(e) => setRmItemcode(e.target.value)}
            >
              {RMItemcodeList.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={itemList}
            size='small'
            value={rmItemcode}
            disabled={isPMView ? true : false}
            getOptionLabel={(option) => option.itemCode || rmItemcode}
            renderInput={(params) => <TextField {...params} onChange={handleChange} />}
            onChange={(event, value) => handleSupplierSearchItemChange(value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 22,
      headerName: "RM Thickness",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={rmThickness}
            size="small"
            variant="standard"
            onChange={(e) => setRmThickness(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 23,
      headerName: "RM Width",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={rmWidth}
            size="small"
            variant="standard"
            onChange={(e) => setRmWidth(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 24,
      headerName: "RM Length",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={rmLength}
            size="small"
            variant="standard"
            onChange={(e) => setRmLength(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 25,
      headerName: "Stock Control",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={stockControl}
              disabled={isPMView ? true : false}
              onChange={(e) => setStockControl(e.target.value)}
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
      id: 26,
      headerName: "Material",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={material}
            size="small"
            variant="standard"
            onChange={(e) => setMaterial(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 27,
      headerName: "Material thickness",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={materialthickness}
            size="small"
            variant="standard"
            onChange={(e) => setMaterialthickness(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 28,
      headerName: "Is Batch Production Part",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={isJCPart}
              disabled={isPMView ? true : false}
              onChange={(e) => setIsJCPart(e.target.value)}
            >
              <MenuItem value={"Y"}>Y</MenuItem>
              <MenuItem value={"N"}>N</MenuItem>
            </Select>
          </FormControl>
        </span>
      ),
      isDropDown: false,
    },
    //ADDITIONAL ADDED FROM MACCHO
    {
      id: 29,
      headerName: "Part Type",
      value: (
        <span>
          <FormControl fullWidth size="small" variant="standard">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={partType}
              disabled={isPMView ? true : false}
              onChange={(e) => setPartType(e.target.value)}
            >
              <MenuItem value={"FG"}>FG</MenuItem>
              <MenuItem value={"SFG"}>SFG</MenuItem>
            </Select>
          </FormControl>
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 30,
      headerName: "SD Code",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={sdCode}
            size="small"
            variant="standard"
            onChange={(e) => setSdCode(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 31,
      headerName: "Delivery Package Type",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={deliveryPackageType}
            size="small"
            variant="standard"
            onChange={(e) => setDeliveryPackageType(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 32,
      headerName: "Stop Condition >",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={deliveryLotQuantity}
            size="small"
            variant="standard"
            onChange={(e) => setDeliveryLotQuantity(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 33,
      headerName: "Bin No",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={BinNo}
            size="small"
            variant="standard"
            onChange={(e) => setBinNo(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 34,
      headerName: "Lot Wise Item",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={LotWiseItem}
            size="small"
            variant="standard"
            onChange={(e) => setLotWiseItem(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 35,
      headerName: "Lot Type",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={LotType}
            size="small"
            variant="standard"
            onChange={(e) => setLotType(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 36,
      headerName: "MOQ",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={MOQ}
            size="small"
            variant="standard"
            onChange={(e) => setMOQ(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 37,
      headerName: "INVTOOLSEL",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={invtoolsel}
            size="small"
            variant="standard"
            onChange={(e) => setInvtoolsel(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 38,
      headerName: "TOOL ID",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={toolId}
            size="small"
            variant="standard"
            onChange={(e) => setToolId(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 39,
      headerName: "LED TIME",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={ledTime}
            size="small"
            variant="standard"
            onChange={(e) => setLedTime(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    {
      id: 40,
      headerName: "STCOND",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={stCond}
            size="small"
            variant="standard"
            onChange={(e) => setStcond(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    // {
    //     id: 40,
    //     headerName: 'SITEM NO',
    //     value:
    //         <span>
    //             <TextField
    //                 id="filled-basic"
    //                 fullWidth
    //                                               disabled={isPMView ? true : false}
    //                 value={sItemNo}
    //                 size='small'
    //                 variant="standard"
    //                 onChange={(e) => setSitemNo(e.target.value)}
    //             />
    //         </span>,
    //     isDropDown: false
    // },
    // {
    //     id: 41,
    //     headerName: 'ITEM NO',
    //     value:
    //         <span>
    //             <TextField
    //                 id="filled-basic"
    //                 fullWidth
    //                                               disabled={isPMView ? true : false}
    //                 value={itemNo}
    //                 size='small'
    //                 variant="standard"
    //                 onChange={(e) => setItemNo(e.target.value)}
    //             />
    //         </span>,
    //     isDropDown: false
    // },
    {
      id: 41,
      headerName: "MINLEVEL",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={minLevel}
            size="small"
            variant="standard"
            onChange={(e) => setMinLevel(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },
    // {
    //     id: 43,
    //     headerName: 'LOC ID',
    //     value:
    //         <span>
    //             <TextField
    //                 id="filled-basic"
    //                 fullWidth
    //                                               disabled={isPMView ? true : false}
    //                 value={locId}
    //                 size='small'
    //                 variant="standard"
    //                 onChange={(e) => setLocId(e.target.value)}
    //             />
    //         </span>,
    //     isDropDown: false
    // },
    // {
    //     id: 44,
    //     headerName: 'SLOC ID',
    //     value:
    //         <span>
    //             <TextField
    //                 id="filled-basic"
    //                 fullWidth
    //                                               disabled={isPMView ? true : false}
    //                 value={slocid}
    //                 size='small'
    //                 variant="standard"
    //                 onChange={(e) => setSlocId(e.target.value)}
    //             />
    //         </span>,
    //     isDropDown: false
    // },
    // {
    //     id: 45,
    //     headerName: 'CATEGORY',
    //     value:
    //         <span>
    //             <TextField
    //                 id="filled-basic"
    //                 fullWidth
    //                                               disabled={isPMView ? true : false}
    //                 value={category}
    //                 size='small'
    //                 variant="standard"
    //                 onChange={(e) => setCategory(e.target.value)}
    //             />
    //         </span>,
    //     isDropDown: false
    // },
    {
      id: 42,
      headerName: "RMS Item ID",
      value: (
        <span>
          <TextField
            id="filled-basic"
            fullWidth
            disabled={isPMView ? true : false}
            value={RMSItemID}
            size="small"
            variant="standard"
            onChange={(e) => setRMSItemID(e.target.value)}
          />
        </span>
      ),
      isDropDown: false,
    },

  ];

  const columns = [
    {
      field: "spCode",
      headerName: "Supp Code",
      headerClassName: "super-app-theme--header",
      type: "string",
      sortable: true,
      minWidth: 80,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "rate",
      headerName: "Rate",
      headerClassName: "super-app-theme--header",
      type: "string",
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "leadTime",
      headerName: "LeadTime",
      headerClassName: "super-app-theme--header",
      type: "number",
      sortable: true,
      sortable: false,
      minWidth: 100,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "sob",
      headerName: "SOB%",
      headerClassName: "super-app-theme--header",
      type: "string",
      sortable: true,
      sortable: false,
      minWidth: 50,
      flex: 1,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "suppDesc",
      headerName: "Sup Description",
      headerClassName: "super-app-theme--header",
      type: "string",
      sortable: true,
      sortable: false,
      flex: 1,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
  ];

  function EditData(props) {
    return <EditIcon style={{ color: "purple" }} onClick={(event) => { }} />;
  }

  function DeleteData(props) {
    return (
      <Tooltip title="Download" arrow>
        <DeleteIcon onClick={() => { }} style={{ color: "#002D68" }} />
      </Tooltip>
    );
  }

  const [rows, setRows] = useState([]);
  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      siNo: (rows.length + 1).toString(),
      // other columns for the new row
    };

    setRows((prevRows) => [...prevRows, newRow]);
  };



  const textEntery = (e) => {

    ItemSearchNAAJ({
      text: e.target.value
    }, handleItemSearchNAAJSucees, handleItemSearchNAAJException);

  }

  // const handleItemSearchNAAJSucees = (dataObject) => {
  //   setItemShowListSeach(dataObject?.data || []);
  // }
  const handleItemSearchNAAJSucees = (dataObject) => {
    let list = dataObject?.data || [];

    // ensure selected item stays visible even if not in filtered results
    if (selectedPartId && !list.some(item => item.id === selectedPartId)) {
      list.push({ id: selectedPartId, label: selectedPart });
    }

    setItemShowListSeach(list);
  };

  const handleItemSearchNAAJException = () => {

  };





  const handleItemsDataShowSuccess = (dataObject) => {
    setEditeData(dataObject?.data[0] || []);
    console.log("ataObject?.data || []", dataObject?.data[0]);
  };

  const handleItemsDataShowException = (errorObject, errorMessage) => {
    console.log("error", errorMessage);
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
      setEditeData([]);
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

  const onChangeDataList = (dataType) => {
    ItemGetItemsTypeFirst(
      {
        type: dataType,
        id: typeId,
      },
      handleItemGetItemsTypeFirstSuccess,
      hndleItemGetItemsTypeFirstException
    );
  };

  const handleItemGetItemsTypeFirstSuccess = (dataObject) => {
    setIsPmView(true)
    setDataList(dataObject?.data[0] || []);
    setEditeData(dataObject?.data[0] || []);
    setTypeId(dataObject?.data[0]?.id || "");
    console.log("dataObject?.data[0]?.id", dataObject?.data[0]?.id);
    setSelectedName("");
    // setType('');
  };

  const hndleItemGetItemsTypeFirstException = (errorObject, errorMessage) => {
    setNotification({
      status: true,
      type: "error",
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
      setType("");
    }, 3000);
  };

  return (
    <div style={{ height: "65vh", width: "100%" }}>
      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={2}
          style={{ height: "72vh", overflow: "auto" }}
        >
          <Grid item xs={12} sm={6} md={8} lg={8} xl={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                <Grid container spacing={2}>
                  {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Customer Name</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Customer Name"
                                                    placeholder='Customer Name'
                                                    variant="filled"
                                                    required
                                                >

                                                    <MenuItem value={''} ></MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid> */}

                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    {/* <TextField
                                            fullWidth
                                            label="Sitem Code"
                                            placeholder='Sitem Code'
                                            variant="filled"
                                            // disabled={isView === true}
                                            size="small"
                                            style={{ height: '20px', }}
                                            value={sitemCode}
                                            onChange={(e) => {
                                                setSitemCode(e.target.value);
                                            }}
                                            required
                                            InputProps={{
                                                readOnly: isView,
                                            }}
                                        /> */}

                    <TextField
                      fullWidth
                      label="Sitem Code"
                      placeholder="Sitem Code"
                      variant="filled"
                      size="small"
                      style={{ height: "20px" }}
                      value={sitemCode}
                      disabled={isPMView ? true : false}
                      onChange={(e) => setSitemCode(e.target.value)}
                      required
                      InputProps={{
                        readOnly: isView,
                      }}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#292828ff", // strong visible text
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      fullWidth
                      label="Sitem Name"
                      placeholder="Sitem Name"
                      variant="filled"
                      size="small"
                      disabled={isPMView ? true : false}
                      InputProps={{
                        readOnly: isView,
                      }}
                      value={sitemName}
                      onChange={(e) => {
                        setSitemName(e.target.value);
                      }}
                      required
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#292828ff", // strong visible text
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Item Group
                      </InputLabel>
                      <Select
                        label="Item Group"
                        placeholder="Item Group"
                        variant="filled"
                        value={itemGroup}
                        size="small"
                        disabled={isPMView ? true : false}
                        InputProps={{
                          readOnly: isView,
                        }}
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#292828ff", // strong visible text
                          },
                        }}
                        onChange={(e) => {
                          setItemGroup(e.target.value);
                          console.log("sasasqa", e.target.value);
                        }}
                        required
                      >
                        {itemGroupList.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* <Grid item>
                    <TextField 
                     fullWidth
                     label="Label Tally"
                     placeholder="Label Tally"
                     variant="filled"
                     value={tallyERP}
                     size="small"
                    />
                  </Grid> */}
                  {/* <Grid item>
                    <TextField 
                      fullWidth
                      label="Tally"
                      placeholder="Tally"
                      variant="filled"
                      value={tallyERP}
                      size="small"
                    />

                  </Grid> */}

                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      fullWidth
                      label="Tally / ERP Alias"
                      placeholder="Tally / ERP Alias"
                      variant="filled"
                      value={tallyERP}
                      size="small"
                      disabled={isPMView ? true : false}
                      InputProps={{
                        readOnly: isView,
                      }}
                      onChange={(e) => {
                        setTallyERP(e.target.value);
                      }}
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#292828ff", // strong visible text
                        },
                      }}
                    // required
                    />
                  </Grid>


                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl fullWidth size="small" variant="filled">
                      <InputLabel id="demo-simple-select-label">
                        Under Ledger [Mst]</InputLabel>
                      <Select
                        id="demo-simple-select"
                        value={underLedger}
                        label="Under Ledger [Mst]"
                        placeholder="Under Ledger [Mst]"
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#292828ff", // strong visible text
                          },
                        }}
                        disabled={isPMView ? true : false}
                        onChange={(e) => setUnderLedger(e.target.value)}
                      >
                        {underLedgerList.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        UOM [Mst]
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="UOM [Mst]"
                        placeholder="UOM [Mst]"
                        variant="filled"
                        disabled={isPMView ? true : false}
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#292828ff", // strong visible text
                          },
                        }}
                        InputProps={{
                          readOnly: isView,
                        }}
                        value={uom}
                        size="small"
                        onChange={(e) => {
                          setUom(e.target.value);
                        }}
                        required
                      >
                        {uomList.map((data) => (
                          <MenuItem key={data.id} value={data.id}>
                            {data.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <TextField
                      fullWidth
                      label="Std Rate"
                      placeholder="Std Rate"
                      variant="filled"
                      size="small"
                      sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#292828ff", // strong visible text
                        },
                      }}
                      disabled={isPMView ? true : false}
                      InputProps={{
                        readOnly: isView,
                      }}
                      value={stdRate}
                      onChange={(e) => {
                        setStdRate(e.target.value);
                      }}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        GST Category
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="GST Category"
                        placeholder="GST Category"
                        variant="filled"
                        size="small"
                        sx={{
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "#292828ff", // strong visible text
                          },
                        }}
                        disabled={isPMView ? true : false}
                        InputProps={{
                          readOnly: isView,
                        }}
                        value={gstCategary}
                        onChange={(e) => {
                          setGstCategory(e.target.value);
                        }}
                      // required
                      >
                        <MenuItem value="5%">5%</MenuItem>
                        <MenuItem value="12%">12%</MenuItem>
                        <MenuItem value="18%">18%</MenuItem>
                        <MenuItem value="28%">28%</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={3}
                    lg={3}
                    xl={3}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <FormControlLabel
                      disabled={isPMView ? true : false}
                      InputProps={{
                        readOnly: isView,
                      }}
                      control={
                        <Checkbox
                          checked={inActiveSatte}
                          onChange={() => {
                            setInActiveSate((oldValue) => !oldValue);
                          }}
                          name="In Active"
                        />
                      }
                      label="In Active"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={3}
                    lg={3}
                    xl={3}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <FormControlLabel
                      disabled={isPMView ? true : false}
                      control={
                        <Checkbox
                          checked={nonStockable}
                          onChange={() => {
                            setNonStockable((oldValue) => !oldValue);
                          }}
                          name="Non Stockable"
                        />
                      }
                      label="Non Stockable"
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    xl={6}
                    sx={{ pt: "35px", pl: "30px" }}
                  >
                    <Typography variant="body2" align="left">
                      <Box component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>
                        Created By :
                      </Box>
                      <Box component="span" sx={{ ml: 0.5, color: "text.primary", fontWeight: 600 }}>
                        {createdBy || "-"}
                      </Box>
                    </Typography>

                    <Typography variant="body2" align="left">
                      <Box component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>
                        Created At :
                      </Box>
                      <Box component="span" sx={{ ml: 0.5, color: "text.primary", fontWeight: 600 }}>
                        {createdAt || "-"}
                      </Box>
                    </Typography>
                  </Grid>


                </Grid>
              </Grid>

              <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                <Grid
                  container
                  spacing={2}
                  style={{
                    display: "flex",
                    alignitems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{
                      // margin: '10px',
                      // height: '200px', display: 'flex',
                      // flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center'
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                    }}
                  >
                    <img
                      src={url[0] + editeViewImg}
                      width="100%"
                      style={{
                        alignSelf: "center",
                        alignItems: "center",
                        height: "inherit",
                        width: "230px",
                        height: "200px",
                        marginBottom: "20px",
                      }}
                      height="100%"
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  sx={{ pt: "35px", pl: "30px" }}
                >
                  <Typography variant="body2" align="left">
                    <Box component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      Updated By :
                    </Box>
                    <Box component="span" sx={{ ml: 0.5, color: "text.primary", fontWeight: 600 }}>
                      {updatedBy || "-"}
                    </Box>
                  </Typography>

                  <Typography variant="body2" align="left">
                    <Box component="span" sx={{ color: "text.secondary", fontWeight: 500 }}>
                      Updated At :
                    </Box>
                    <Box component="span" sx={{ ml: 0.5, color: "text.primary", fontWeight: 600 }}>
                      {updatedAt || "-"}
                    </Box>
                  </Typography>
                </Grid>


              </Grid>

              <Grid container spacing={2} style={{ marginTop: "10px" }}>
                {selectedCategory === "BUY" ||
                  selectedCategory === "BUY LC-S" ||
                  selectedCategory === "ASSEMBLY" ||
                  selectedCategory === "MAKE" ||
                  selectedCategory === "MAKE SUBPART" ||
                  selectedCategory === "KIT" ||
                  selectedCategory === "BUY PRODUCTION" ||
                  selectedCategory === "BUY LC" ? (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                        <DataGrid
                          rows={rows}
                          columns={columns}
                          pageSize={8}
                          // loading={isLoading}
                          rowsPerPageOptions={[8]}
                          disableSelectionOnClick
                          style={{ border: "none" }}
                          sx={{
                            overflow: "auto",
                            height: "25vh",
                            // minHeight: '500px',
                            "& .super-app-theme--header": {
                              WebkitTextStrokeWidth: "0.6px",
                              backgroundColor: "#93bce6",
                              color: "#1c1919",
                            },
                          }}
                          getRowClassName={(params) => {
                            const rowIndex = rows.findIndex(
                              (row) => row.id === params.row.id
                            );
                            if (rowIndex !== -1) {
                              console.log(" ");
                              return rowIndex % 2 === 0
                                ? "Mui-evenRow"
                                : "Mui-oddRow";
                            }
                            return "";
                          }}
                          rowHeight={40}
                          columnHeaderHeight={40}
                        />
                      </CardContent>
                      <CardActionArea>
                        {!isView ? (
                          <div>
                            <Button
                              disabled={isModuleLocked} onClick={handleAddRow}>Add Row</Button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </CardActionArea>
                    </Card>
                  </Grid>
                ) : (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ height: "230px" }}
                  ></Grid>
                )}
              </Grid>
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
                    <div style={{ overflow: "auto", height: "80vh" }}>
                      <table
                        style={{
                          overflow: "auto",
                          borderCollapse: "collapse",
                          border: "1px solid #ddd",
                          width: '100%'
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
                            height: "550px",
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
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>
        </Grid>
        <div
          style={{
            position: "fixed",
            bottom: 50,
            width: "100vw",
            backgroundColor: "#f5f5f5",
            padding: "10px",
            marginLeft: "-2%",
          }}
        >
          <Grid
            container
            spacing={2}
            style={{ display: "flex", justifyContent: "center" }}
          >
            {/* <Grid item sm={12} md={1}>
              <Button
                variant="contained"
                style={{
                  width: "100%",
                  background:
                    userPermission[0]?.addData === 0 ? "gray" : "#002D68",
                  color: userPermission[0]?.addData === 0 ? "black" : "white",
                }}
                type="subit"
                disabled={userPermission[0]?.addData === 0}
              >
                {isAddButton ? "Add" : "Update"}
              </Button>
            </Grid> */}
            {/* <Grid item sm={12} md={1}>
              <Button
                variant="contained"
                style={{
                  width: "100%",
                  backgroundColor: editData.length === 0 ? "gray" : "#002D68",
                  color: editData.length === 0 ? "black" : "white",
                }}
                disabled={editData.length === 0} // Changed the condition
                onClick={() => {
                  if (!isCopyFrom) {
                    setIsAddButton(false);
                                                                        setIsPoView(false)

                  }
                }}
              >
                Edit
              </Button>
            </Grid> */}
            <Grid item sm={12} md={1}>
              <Button
                variant="contained"
                style={{
                  width: "100%",
                  background: isModuleLocked ? "gray" : "#002D68",
                  color: "white",
                  height: '35px',
                }}
                disabled={isModuleLocked}
                onClick={() => {
                  setEditeData([]);
                  setSelectedName('');
                  setIsPmView(false)
                  setIsAddButton(true);
                  setIsCopyFrom(true)
                  setItemList([])
                }}
              >
                New
              </Button>
            </Grid>
            <Grid item sm={12} md={1}>

              <Button
                variant="contained"
                style={{
                  width: "100%",
                  background: isModuleLocked ? "gray" : "#002D68",
                  color: "white",
                  height: '35px',
                }}
                disabled={isModuleLocked}

                onClick={() => {
                  if (!isCopyFrom) {
                    setIsAddButton(false);
                    setIsPmView(false);
                    // setIsCopyFrom(false)
                  }
                  else {
                    setIsAddButton(false);
                    setIsPmView(false);
                  }
                }}
              >
                Edit
              </Button>
            </Grid>
            <Grid item sm={12} md={1}>
              <Button
                variant="contained"
                style={{
                  width: "100%",
                  background:
                    userPermission[0]?.deleteData === 0 || isModuleLocked ? "gray" : "#002D68",
                  color:
                    userPermission[0]?.deleteData === 0 || isModuleLocked ? "black" : "white",
                }}
                disabled={userPermission[0]?.deleteData === 0 || isModuleLocked}
                onClick={() => {
                  setDeleteDailogOpen(true);
                  setDeleteId(editData.id);
                  console.log("editData.id", editData.id);
                  setIsCopyFrom(false);

                }}
              >
                Delete
              </Button>
            </Grid>
            <Grid item sm={12} md={1}>
              <Button
                variant="contained"
                type='submit'
                style={{ width: "100%", height: '35px', backgroundColor: isModuleLocked ? "gray" : "#002D68", color: 'white' }}
                disabled={loading === true || isModuleLocked}
              >
                {/* {isAddButton ? "SAVE" : "UPDATE"} */}
                {loading ? (
                  <CircularProgress size={24} style={{ color: 'white' }} />
                ) : (isAddButton ? 'Add' : 'Update')}
              </Button>
            </Grid>
            <Grid item sm={12} md={1}>
              <Button
                variant="contained"
                style={{ width: "100%", background: isModuleLocked ? "gray" : "#002D68", color: "white" }}
                onClick={() => {
                  setEditeData([]);
                  setSelectedName('');
                  setIsPmView(false);
                  setIsCopyFrom(false)

                }}
                disabled={isModuleLocked}
              >
                Clear
              </Button>
            </Grid>
            <Grid item sm={12} md={1}>
              {/* <Button
                                            variant="contained"
                                            style={{ width: '100%', background: '#002D68', color: 'white' }}

                                        >
                                            Option
                                        </Button> */}
              <Button
                id="demo-positioned-button"
                aria-controls={open1 ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open1 ? "true" : undefined}
                onClick={handleClick}
                disabled={isModuleLocked}
                style={{ width: "100%", background: isModuleLocked ? "gray" : "#002D68", color: "white" }}
              >
                Option
              </Button>

              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open1}
                onClose={handleClose1}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem
                  onClick={() => {
                    setBulkCreationOpen(true);
                    handleClose1();
                  }}
                >
                  Import Store Item
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setUpdateStoreOpen(true);
                    handleClose1();
                  }}
                >
                  Update Store Item Info
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setItemInfoOpen(true);
                    handleClose1();
                  }}
                >
                  Update Item Stock Info
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setImportItemOpen(true);
                    handleClose1();
                  }}
                >
                  Import Item Rate
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setBulkCopyOpen(true);
                    handleClose1();
                  }}
                >
                  Bulk Creation Item{" "}
                </MenuItem>
                {/* <MenuItem onClick={() => {
                                setBulkPrice(true);
                                handleClose1();
                            }}>Bulk Price Update</MenuItem> */}
              </Menu>
            </Grid>

            <Grid item sm={12} md={1}>
              {/* <Button
                                variant="contained"
                                style={{ width: '100%', background: '#002D68', color: 'white' }}
                                onClick={() => {
                                    setType('first');
                                    onChangeDataList('first');
                                }}
                            >
                                <FastRewindIcon />
                            </Button> */}
              <Button
                variant="contained"
                style={{ width: "100%", background: "#002D68", color: "white" }}
                onClick={() => {
                  setType("first");
                  onChangeDataList("first");
                  setDisableTextField(true);
                  setIsCopyFrom(false)
                  // Disable the text field on button click
                }}
              >
                <FastRewindIcon />
              </Button>
            </Grid>
            <Grid item sm={12} md={1}>
              <Button
                variant="contained"
                style={{ width: "100%", background: "#002D68", color: "white" }}
                onClick={() => {
                  setType("reverse");
                  onChangeDataList("reverse");
                  setDisableTextField(true);
                  setIsCopyFrom(false)

                }}
              >
                <SkipPreviousIcon />
              </Button>
            </Grid>
            <Grid item sm={12} md={1}>
              <Button
                variant="contained"
                style={{ width: "100%", background: isModuleLocked ? "gray" : "#002D68", color: "white" }}
                onClick={() => {
                  setOpenAllView(true);
                  setIsCopyFrom(false)

                }}
                diabled={isModuleLocked}
              >
                <SearchIcon />
              </Button>
            </Grid>
            <Grid item sm={12} md={1}>
              <Button
                variant="contained"
                style={{ width: "100%", background: "#002D68", color: "white" }}

                onClick={() => {
                  setType("forward");
                  onChangeDataList("forward");
                  setDisableTextField(true);
                  setIsCopyFrom(false)

                }}
              >
                <SkipNextIcon />
              </Button>
            </Grid>
            <Grid item sm={12} md={1}>
              <Button
                variant="contained"
                style={{ width: "100%", background: "#002D68", color: "white" }}
                onClick={() => {
                  setType("last");
                  onChangeDataList("last");
                  setDisableTextField(true);
                  setIsCopyFrom(false)

                }}
              >
                <FastForwardIcon />
              </Button>
            </Grid>
          </Grid>
        </div>

        <NotificationBar
          handleClose={handleClose}
          notificationContent={openNotification.message}
          openNotification={openNotification.status}
          type={openNotification.type}
        />
      </form>
      <DeleteConfirmationDailog
        open={deleteDailogOpen}
        setOpen={setDeleteDailogOpen}
        deleteId={deleteId}
        // selectedMaster={selectedMaster}
        deleteService={ItemDataDelete}
        handleSuccess={deletehandleSuccess}
        handleException={deletehandleException}
      />

      <BulkCreation
        open={BulkCreationOpen}
        setOpen={setBulkCreationOpen}
        setRefreshData={setRefreshData}
      />

      <UpdateStoreItemInfo
        open={updateStoreOpen}
        setOpen={setUpdateStoreOpen}
        setRefreshData={setRefreshData}
      />

      <ImportItemRate
        open={ImportItemOpen}
        setOpen={setImportItemOpen}
        setRefreshData={setRefreshData}
      />

      <CopyFrom
        open={BulkCopyOpen}
        setOpen={setBulkCopyOpen}
        setRefreshData={setRefreshData}
      />
      <PartMinMaxModule
        itemInfoOpen={itemInfoOpen}
        setItemInfoOpen={setItemInfoOpen}
      />

      <SearchAllItems opeAllView={opeAllView} setOpenAllView={setOpenAllView} />

      <BulkPriceUpdate
        open={bulkPrice}
        setOpen={setBulkPrice}
        setRefreshData={setRefreshData}
      />
    </div>
  );
};

export default PartMasterModule;
