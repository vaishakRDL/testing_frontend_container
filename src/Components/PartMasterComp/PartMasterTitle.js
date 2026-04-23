import { Autocomplete, Box, Button, FormControl, Grid, TextField, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { ItemDownloadExlExport } from '../../ApiService/DownloadCsvReportsService';
import { ItemImport, ItemImportXl, ItemSearchNAAJ, ItemsDataShow } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { useEffect } from 'react';

const PartMasterTitle = (props) => {
  const { selectedPart,
    setSelectedPart,
    selectedPartId,
    setSelectedPartId, selectedName, setSelectedName, typeId, setTypeId, setIsPmView } = props;
  const [file, setFile] = useState(null);
  const [editeViewImg, setEditViewImg] = useState('');
  const [itemShowListSeach, setItemShowListSeach] = useState([]);
  const [itemShowList, setItemShowList] = useState([]);
  // const [selectedName, setSelectedName] = useState('');

  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });

  const handleFileUpload = () => {
    // Handle the uploaded file here
  };

  const handleItemDownloadExlExportSucess = () => {

  }

  const handleItemDownloadExlExportException = () => {

  }

  const handleItemImportSucess = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
    }, 3000);
  }

  const handleItemImportException = () => {

  }

  const handleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };

  useEffect(() => {
    setItemShowListSeach([]);
    setSelectedName('');
  }, [props.refreshData]);

  const textEntery = (e) => {

    ItemSearchNAAJ({
      text: e.target.value
    }, handleItemSearchNAAJSucees, handleItemSearchNAAJException);

  }

  const handleItemSearchNAAJSucees = (dataObject) => {
    setItemShowListSeach(dataObject?.data || []);
  }

  const handleItemSearchNAAJException = () => {

  }
  const handleAutocompleteChange = (selectedValue) => {
    console.log('selectedValue', selectedValue);
    setSelectedName(selectedValue?.label);
    if (selectedValue) {
      const selectedItem = itemShowListSeach.find(item => item.id === selectedValue?.id);
      setItemShowList(selectedItem ? [selectedItem] : []);

      ItemsDataShow({
        itemId: selectedValue?.id || '',
        page: 0
      }, handleItemsDataShowSuccess, handleItemsDataShowException);
    } else {
      props.setEditeData([]);
      props.setIsCopyFrom(false);
    }

  };

  const handleItemsDataShowSuccess = (dataObject) => {
    props.setIsPmView(true)
    props.setEditeData(dataObject?.data[0] || []);
    setTypeId(dataObject?.data[0]?.id || "");
    const result = dataObject?.data?.[0]; // extract the object safely

    // if (result?.conversionPart) {
    setSelectedPart(result?.conversionPart);       // label string
    // }

    // if (result?.conversionPartId) {
    setSelectedPartId(Number(result?.conversionPartId)); // number
    // }
    // console.log("dghdghdgdgdg", dataObject.data[0].id ||"")

  }

  const handleItemsDataShowException = (errorObject, errorMessage) => {
    console.log('error', errorMessage);
  }

  const options = itemShowListSeach.map(item => ({
    id: item?.id,
    label: item?.label
  }));

  return (
    <Box
      sx={{
        marginTop: '10px',
        // mb: '10px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        // flexWrap: 'wrap',
        // marginLeft: '10px',
        // marginRight: '10px'
      }}
    >
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12} md={4} lg={4} xl={4}>
          <Typography
            sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold', minWidth: '200px' }}
            variant="h5"
          >
            Item Summary
          </Typography>
        </Grid>

        <Grid item sm={6} xs={12} md={4} lg={2} xl={2}>
          {/* <Stack direction="row" spacing={2}
            onClick={() => {
              props.setCopyFromOpen(true);
              // props.setEditeData([]);
              // props.setOpen(true);
            }}
            >
            <Fab
            style={{ background: '#002D68', color: 'white' }}
            variant="extended" size="medium" color="primary" aria-label="add">
            <AddIcon sx={{ mr: 1 }} />
            Bulk Copy from
            </Fab>
          </Stack> */}
        </Grid>

        <Grid item sm={6} xs={12} md={4} lg={2} xl={2}>
          {/* <Stack direction="row" spacing={2}
              onClick={() => {
                props.setIsCopyFrom(true);
                setNotification({
                  status: true,
                  type: 'success',
                  message: 'Copy from Activated',
                });
                setTimeout(() => {
                  handleClose();
                }, 1000);
  
              }}
            >
              <Fab
                style={{ background: '#002D68', color: 'white' }}
                variant="extended" size="medium">
                <AddIcon sx={{ mr: 1 }} />
                Copy from
              </Fab> */}
          {/* </Stack> */}
          {
            props.isCopyFrom && (

              <Button
                variant="contained"
                // color="primary"
                component="label"
                sx={{ marginRight: '16px', backgroundColor: '#002D68', height: '40px', borderRadius: '20px' }}
                onClick={() => {
                  props.setIsCopyFrom(true);
                  setIsPmView(false)
                  setNotification({
                    status: true,
                    type: 'success',
                    message: 'Copy from Activated',
                  });
                  setTimeout(() => {
                    handleClose();
                  }, 1000);

                }}
              >
                <AddIcon sx={{ mr: 1 }} />
                Copy from
              </Button>
            )}
        </Grid>


        <Grid item sm={6} xs={12} md={4} lg={4} xl={4}>
          <FormControl fullWidth >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={options}
              // sx={{ width: 300, }}
              value={selectedName}
              size="small"
              getOptionLabel={(option) => option.label || selectedName}
              renderInput={(params) => <TextField   {...params} label="Search By Item Code "
                onChange={textEntery}
              // onClear={() => {
              //   console.log('success');
              // }} 
              />}
              onChange={(event, value) => handleAutocompleteChange(value)}
            />
          </FormControl>
        </Grid>
      </Grid>

      {/* <Box
        sx={{ m: 1 }}

      > */}
      {/* </Box> */}
      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </Box >
  )
}

export default PartMasterTitle