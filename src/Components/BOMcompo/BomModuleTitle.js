import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import ExcelTemplateDownloader from '../../ApiService/ExcelTemplateDownloader';
import { DownloadSupExcelTemplate } from '../../ApiService/DownloadCsvReportsService';
import { BomFetchId, BomItemsShow, SupExcelImport } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import SearchIcon from "@mui/icons-material/Search";

const BomModuleTitle = ({ setTreeData, setRows }) => {
    const [file, setFile] = useState(null);
    const [itemNameList, setItemNameList] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        BomItemsShow(handleBomItemsShowSuccess, handleBomItemsShowException);
    }, []);

    const handleBomItemsShowSuccess = (dataObject) => {
        setItemNameList(dataObject?.data || []);

    }

    const options = itemNameList.map(item => ({
        id: item?.id,
        label: item?.itemName,
        itemCode: item?.itemCode
    }));

    const handleBomItemsShowException = (errorObject, errorMessage) => {
        console.log('error ', errorMessage);
    }

    const handleFileUpload = () => {
        // Handle the uploaded file here
    };

    const DownloadSupExcelTemplateSuccess = () => {

    }

    const DownloadSupExcelTemplateException = () => {

    }

    const SupExcelImportSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setFile('');
        }, 5000);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    function handleAutocompleteChange(selectedValue) {
        console.log("Selected Value:", selectedValue.id);
        BomFetchId({
            itemCode: selectedValue.itemCode
        }, handleBomFetchIdSuccess, handleBomFetchIdException);
    }
    const handleBomFetchIdSuccess = (dataObject) => {
        setTreeData(dataObject?.bomTree || []);
        setRows(dataObject?.data || []);
    }

    const handleBomFetchIdException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
        setTreeData([]);
        setRows([]);
    }

    return (
        <Box
            sx={{
                mb: '10px',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                marginLeft: '10px',
                marginRight: '10px'
            }}
        >
            <Typography
                sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                variant="h5"
            >
                BOM
            </Typography>
            <Box
                sx={{ m: 1 }}
            >
                <Grid container alignItems={'center'} spacing={2}>
                    {/* <Grid item>
                        <Stack direction="row" spacing={2}
                            onClick={() => {

                            }}>
                            
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="combo-box-demo"
                                options={options}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Search By Item Code " />}
                                onChange={(event, value) => handleAutocompleteChange(value)}
                            />
                          
                        </Stack>
                    </Grid> */}
                </Grid>
            </Box>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Box>
    )
}

export default BomModuleTitle