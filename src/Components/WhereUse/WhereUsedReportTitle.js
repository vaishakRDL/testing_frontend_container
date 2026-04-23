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

const WhereUsedReportTitle = () => {
    const [file, setFile] = useState(null);
    const [itemNameList, setItemNameList] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

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
                BOM Child Report 
            </Typography>
           
           
        </Box>
    )
}

export default WhereUsedReportTitle