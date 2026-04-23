import { Autocomplete, Button, CircularProgress, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { GetSrnNetWeight, GetSupervisorSrnUniqueCode, GetWithoutPoItemLists, ItemSearchNAAJ, JobCardSrnUpdate, ScrapMstGetThickness, SupervisorJcGetMaterial } from '../../../ApiService/LoginPageService';

const SrnSubModule = ({ open, setOpen, selectedRowData }) => {
  const [saveloading, setsaveLoading] = useState(false);
  const [rawMaterialList, setRawMaterialList] = useState([]);
  const [selectedRawMaterial, setSelectedMaterial] = useState('');
  const [thicknessList, setthicknessList] = useState([]);
  const [selectedThickness, setSelectedThickness] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [sheetQty, setSheetQty] = useState('');
  const [totalQty, setTotalQty] = useState('');
  const [nestNo, setNestNo] = useState('');
  const [supplierItemList, setSupplierItemList] = useState([])
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItemCode, setSelectedItemCode] = useState('');
  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });

  useEffect(() => {
    open && GetSupervisorSrnUniqueCode(handleGetSuccess, handleGetException)
    SupervisorJcGetMaterial(
      handleScrapMstGetMaterialSuccess,
      handleScrapMstGetMaterialException
    );

    open && ScrapMstGetThickness(
      handleScrapMstGetThicknessSuccess,
      handleScrapMstGetThicknessException
    );
  }, [open]);

  const handleGetSuccess = (dataObject) => {
    console.log("dataObjectdataObjectdataObjectdataObject", dataObject)
    setNestNo(dataObject?.data?.nestNo || 0)
  }
  const handleGetException = () => { }

  const handleScrapMstGetMaterialSuccess = (dataObject) => {
    setRawMaterialList(dataObject?.data || []);
  };
  const handleScrapMstGetMaterialException = () => { }

  const handleMaterialChange = (selectedValue) => {
    setSelectedMaterial(selectedValue.id);
    // setRawMaterial(selectedValue?.label || "");
  };

  // ---------------

  const handleScrapMstGetThicknessSuccess = (dataObject) => {
    setthicknessList(dataObject?.data || []);
  };
  const handleScrapMstGetThicknessException = () => { };

  const handleThicknessChange = (selectedValue) => {
    setSelectedThickness(selectedValue.id);
    // setThickness(selectedValue?.label || "");
  };

  const handleSubmitClick = (e) => {
    e.preventDefault()
    setsaveLoading(true);
    JobCardSrnUpdate({
      jcList: selectedRowData,
      sheetInfo: {
        itemId: selectedItemId,
        itemCode: selectedItemCode,
        nestNo: nestNo,
        thickness: selectedThickness,
        netWeight: netWeight,
        sheetQty: sheetQty,
        totQty: totalQty
      }
    }, handleSubmitSuccess, handleSubmitException)
  }

  const handleSubmitSuccess = (dataObject) => {
    setsaveLoading(false);

    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
      setOpen(false);
      ClearData();
    }, 2000);
  }
  const handleSubmitException = (errorObject, errorMessage) => {
    setsaveLoading(false);
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
  }

  const handleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };

  const calculateTotalQty = (sheetQty, netWeight) => {
    setTotalQty(Number(netWeight) * Number(sheetQty))
  }

  const ClearData = () => {
    setNetWeight('');
    setSheetQty('');
    setTotalQty('');
    setNestNo('');
  }

  const handleItemChange = (e) => {
    ItemSearchNAAJ({ text: e.target.value }, handleVendorProcessVendorSucessShow, handleVendorProcessVendorExceptionShow);
  }

  const handleVendorProcessVendorSucessShow = (dataObject) => {
    setSupplierItemList(dataObject?.data || []);
  }
  const handleVendorProcessVendorExceptionShow = (errorObject, errorMessage) => {
  }

  // ADD ITEMS
  const handleSupplierItemChange = (value) => {
    if (value !== null) {
      setSelectedItemId(value.id);
      setSelectedItemCode(value.label);
      GetSrnNetWeight({ id: value.id }, handleGetWeightSuccess, handleGetWeightException)
    }
  };

  const handleGetWeightSuccess = (dataObject) => {
    setNetWeight(dataObject?.data[0]?.netWeight || 0);
  }
  const handleGetWeightException = () => { }

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
      maxWidth="md"
      open={open}
    >
      <DialogTitle style={{ background: '#002D68', color: 'white' }}>
        Request Material
      </DialogTitle>
      <DialogContent>
        <form className="mt-2 space-y-6" /*onSubmit={handleSubmit}*/>
          <Grid container >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
              <TextField
                id="filled-basic"
                label="Reference No"
                variant="filled"
                fullWidth
                value={nestNo}
              // disabled
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={supplierItemList}
                // value={selectedItemName}
                renderInput={(params) => <TextField {...params} label="Search Items" variant="filled" onChange={handleItemChange} />}
                onChange={(event, value) => handleSupplierItemChange(value)}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
              <Autocomplete
                fullWidth
                disablePortal
                id="combo-box-demo"
                options={thicknessList}
                getOptionLabel={(option) => option.thickness || ''}
                renderInput={(params) => (
                  <TextField {...params} variant="filled" label="Search By Thickness" />
                )}
                onChange={(event, value) => handleThicknessChange(value)}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
              <TextField
                id="filled-basic"
                label="Net Weight"
                variant="filled"
                fullWidth
                value={netWeight}
                onChange={(e) => {
                  setNetWeight(e.target.value)
                  calculateTotalQty(sheetQty, e.target.value)
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
              <TextField
                id="filled-basic"
                label="Sheet Qty"
                variant="filled"
                fullWidth
                value={sheetQty}
                onChange={(e) => {
                  setSheetQty(e.target.value)
                  calculateTotalQty(e.target.value, netWeight)
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2} marginBottom={2}>
              <TextField
                id="filled-basic"
                label="Total Weight"
                variant="filled"
                fullWidth
                value={totalQty}
                onChange={(e) => setTotalQty(e.target.value)}
              />
            </Grid>
          </Grid>

          <DialogActions>
            <Button
              variant="contained"
              style={{ width: '150px', background: '#002D68', color: 'white' }}
              type="submit"
              onClick={handleSubmitClick}
              disabled={saveloading}
            >
              {saveloading ? (
                <CircularProgress size={24} style={{ color: 'white' }} />
              ) : (
                "save"
              )}
            </Button>
            <Button
              variant="contained"
              style={{ width: '150px', background: '#002D68', color: 'white' }}
              onClick={(e) => {
                setOpen(false)
                ClearData();
              }}
            >
              Close
            </Button>
          </DialogActions>
        </form>
      </DialogContent>

      <NotificationBar
        // handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </Dialog>
  )
}

export default SrnSubModule
