import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
    LinearProgress,
    Popper,
    CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { CheckBox } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from '@mui/material/Autocomplete';
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { Link, useLocation } from 'react-router-dom';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import {
    AddStoreItemMaster,
    StoreItemEdit,
    GetMainLocation,
    GetSubLocation,
    GetProductFinish,
    GetProductFamily,
    GetHSNCode,
    GetUnderLedger,
    GetItemGroup,
    GetUOM,
    GetItemVsProcessItem,
    GetStoresRequestNoteUniqueID,
    SearchSRNItemLists,
    UploadStoreRequestNote,
    StoreRequestNotePreview,
    ImportStoreRequestData,
    PreviewStoreRequestNote,
    GetStockTransferUniqueID,
    GetWithoutPoItemLists,
    GetStockTransferLocation,
    UploadStockTransfer,
    StockTransferPreview,
    SearchStockTransfer,
    GetSearchedStData
} from '../../ApiService/LoginPageService';
import { StoreRequestNoteTemplate } from '../../ApiService/DownloadCsvReportsService';
import { useModuleLocks } from '../context/ModuleLockContext';

const StockTransfer = ({
    open, setOpen, isAddButton, editeData, setRefreshData,
}) => {

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    // const moduleLocks = JSON.parse(localStorage.getItem("moduleLocks") || "[]");
    // const isModuleLocked = moduleLocks.find(
    //     (m) => m.moduleName === "Stock Transfer"
    // )?.lockStatus === "locked";

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Stock Transfer")?.lockStatus === "locked";

    //SRN STATES
    const [srnNo, setSrnNo] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [srnDigit, setSrnDigit] = useState('');
    const [sItemName, setSItemName] = useState('');
    const [rowId, setRowId] = useState('');
    const [itemList, setItemList] = useState([])
    const [selectedItems, setSelectedItems] = useState([{ id: 'RDL1' }]);
    console.log("selectedItems", selectedItems)
    const [itemLists, setItemLists] = useState([])
    const [isView, setIsView] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mainId, setMainId] = useState('');
    const [uploadLoader, setUploadLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    //
    // stock transfer
    const [stDigit, setStDigit] = useState('');
    const [stNo, setStNo] = useState('');
    const [locationLists, setLocationLists] = useState([]);
    const [generatedStLists, setGeneratedStLists] = useState([]);
    const [selectedSt, setSelectedSt] = useState('');

    // DOCUMENT AUTHORIZATION
    const isAuthoriseDocument = new URLSearchParams(location.search).get('isAuthoriseDocument');
    const authorizeRowId = new URLSearchParams(location.search).get('rowId');

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };

        // Add event listener to update height on resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // GetStoresRequestNoteUniqueID(handleGetCodeSuccess, handleGetCodeException)
        if (!isAuthoriseDocument) {
            handleForwardReverse('last', '');
        }

        if (isAuthoriseDocument) {
            PreviewStoreRequestNote({ id: authorizeRowId }, handleActionSuccess, handleActionException)
        }

    }, [editeData]);

    const handleGetCodeSuccess = (dataObject) => {
        setStDigit(dataObject?.digit || '');
        setStNo(dataObject?.stNo || '');
    }
    const handleGetCodeException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }


    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();
        const mainData = {
            digit: stDigit,
            stNo: stNo,
            date: selectedDate
        }
        const filteredArray = selectedItems.filter((data) => data.id !== 'RDL1').map((data) => ({
            itemId: data.itemId,
            fromLoc: data.location,
            stQty: data.totStk,
            toLoc: data.toLoc,
            toLocId: data.toLocId,
            remarks: data.remarks,
        }));
        UploadStockTransfer({ mainData: mainData, items: filteredArray }, handleSuccess, handleException);
    };

    const handleSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            GetStockTransferUniqueID(handleGetCodeSuccess, handleGetCodeException);
            ClearData();
            handleClose();
            setLoading(false);
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        console.log("the error ", errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
            setLoading(false);
        }, 2000);
    };

    const ClearData = () => {
        // setOpen(false);
        // setRefreshData(oldvalue => !oldvalue);
        setSelectedItems([{ id: 'RDL1' }])
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    //DATE CONVERT TO TEXTFIELD
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // SEARCH FILTER
    const handleChange = (e) => {
        GetWithoutPoItemLists({ code: e.target.value }, handleItemSucessShow, handleItemExceptionShow);
    }

    const handleItemSucessShow = (dataObject) => {
        setItemLists(dataObject?.data || []);
    }
    const handleItemExceptionShow = (errorObject, errorMessage) => {
    }

    const handleItemChange = (value) => {
        if (value !== null) {
            const clonedSelectedItems = [...selectedItems];
            const lastObj = clonedSelectedItems.pop();
            clonedSelectedItems.push(value, lastObj);
            setSelectedItems(clonedSelectedItems);
        }
    }

    const handleCellEdit = (params) => {
        const updatedList = selectedItems.map((supp) =>
            supp.id === params.id ?
                { ...supp, srnQty: params.srnQty, remarks: params.remarks }
                : supp
        )
        setSelectedItems(updatedList);
    };

    const handleEdit = (cellNam, newValue, id, rowData) => {
        switch (cellNam) {
            case "location":
                const locName = locationLists.find((loc) => Number(loc.id) === Number(newValue)).name;
                console.log("locNamelocNamelocNamelocName", locName)
                const updatedLocation = selectedItems.map((supp) =>
                    supp.id === id && cellNam === 'location' ?
                        { ...supp, toLoc: locName, toLocId: newValue }
                        : supp
                )
                setSelectedItems(updatedLocation);
                break;
            case "remarks":
                const updatedRemarks = selectedItems.map((supp) =>
                    supp.id === id && cellNam === 'remarks' ?
                        { ...supp, remarks: newValue }
                        : supp
                )
                setSelectedItems(updatedRemarks);
                break;
            default:
            // code block
        }
    }

    const handleDeleteRow = (id) => {
        const newArray = selectedItems.filter((item) => item.id != id)
        setSelectedItems(newArray);
    }

    ///////////////////////////////////////////////
    const handleForwardReverse = (type, id) => {
        StockTransferPreview({ type: type, id: id }, handleActionSuccess, handleActionException)
    }

    const handleActionSuccess = (dataObject) => {
        setIsView(true);
        setSelectedItems(dataObject?.items || []);

        const data = dataObject.mainData;
        setStDigit(data.digit || '');
        setStNo(data.stNo || '');
        setSelectedDate(data?.date || '');
        setMainId(data?.id || '');
    }
    const handleActionException = () => { }

    const handleClearPage = () => {
        setIsView(false);
        setIsEdit(false);
        setSelectedSt('');
        setSelectedItems([{ id: 'RDL1' }]);
        setSelectedDate(new Date());
        GetStockTransferUniqueID(handleGetCodeSuccess, handleGetCodeException);
        GetStockTransferLocation(handleLocationSuccess, handleLocationException);
    }

    const handleLocationSuccess = (dataObject) => {
        setLocationLists(dataObject?.data || []);
    }
    const handleLocationException = () => { }

    const handleTemplateDownload = () => {
        StoreRequestNoteTemplate(handleTemplateDownloadSuccess, handleTemplateDownloadFailed)
    }

    const handleTemplateDownloadSuccess = () => {
        setNotification({
            status: true,
            type: 'success',
            message: "Template Download Success",
        });
        setTimeout(() => {
            handleClose();
        }, 3000);
    }

    const handleTemplateDownloadFailed = () => {
        setNotification({
            status: true,
            type: 'error',
            message: "Template failed to download",
        });
        setTimeout(() => {
        }, 3000);
    }

    // XL UPLOAD HANDLER
    const handleItemImportSucess = (dataObject) => {
        const clonedSelectedItems = [...selectedItems];
        const lastObj = clonedSelectedItems.pop();
        clonedSelectedItems.push(...dataObject?.display, lastObj);
        setSelectedItems(clonedSelectedItems);
        console.log("clonedSelectedItemsclonedSelectedItemsclonedSelectedItemsclonedSelectedItems", clonedSelectedItems)
        setUploadLoader(false);

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const handleItemImportException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
        }, 2000);
    }

    /////////////////////
    const handlePOChange = (e) => {
        SearchStockTransfer({ code: e.target.value }, handleGeneratedPoSucessShow, handleGeneratedPoExceptionShow);
    }

    const handleGeneratedPoSucessShow = (dataObject) => {
        setGeneratedStLists(dataObject?.data || []);
    }
    const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => {
    }

    const handleGeneratedPoSelect = (selectedValue) => {
        setIsView(true);
        if (selectedValue !== null) {
            setSelectedSt(selectedValue.stNo);
            GetSearchedStData({ id: selectedValue.id }, handleActionSuccess, handleActionException);
        }
    }

    const CustomPopper = (props) => {
        return (
            <Popper
                {...props}
                placement="top"
                style={{ position: 'absolute', top: 'auto', bottom: '100%' }}
            />
        );
    };

    // UNIQUE CODE MANUAL CHANGE
    const handleUniqueCodeChange = (e) => {
        const newUniqueCode = e.target.value;
        setStDigit(newUniqueCode)
        const currentYear = stNo?.split('/')[0];
        setStNo(`${currentYear}/${newUniqueCode.toString().padStart(5, 0)}`);
    };

    return (
        <div style={{ marginLeft: '25px', marginRight: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '10px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    {isEdit ? "Stock Transfer" : isView ? "Stock Transfer" : "Stock Transfer"}
                </Typography>
                <div style={{ width: '250px', marginRight: '10px' }}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={generatedStLists}
                        fullWidth
                        value={selectedSt}
                        getOptionLabel={(option) => option.stNo || selectedSt}
                        renderInput={(params) => <TextField {...params} label="Search ST" onChange={handlePOChange} />}
                        onChange={(event, value) => handleGeneratedPoSelect(value)}
                        size="small"
                        style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                    />
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={1.7} lg={1.7} xl={1.7}>
                        <TextField
                            fullWidth
                            label="ST No"
                            InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                            required
                            size='small'
                            onChange={handleUniqueCodeChange}
                            value={stDigit}
                            readOnly={true}
                            disabled={isView ? true : false}
                            inputProps={{ maxLength: 5 }} // Set max length to 5 characters
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={1.7} lg={1.7} xl={1.7}>
                        <TextField
                            fullWidth
                            type='date'
                            size='small'
                            required
                            value={formatDate(selectedDate)}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            readOnly={true}
                            disabled={isView ? true : false}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={1.7} lg={1.7} xl={1.7}>
                        <TextField
                            fullWidth
                            required
                            size='small'
                            value={stNo}
                            readOnly={true}
                            disabled={isView ? true : false}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: screenHeight - 290 }}>
                            {uploadLoader &&
                                <Box sx={{ width: '100%', marginBottom: '15px' }}>
                                    <LinearProgress />
                                </Box>
                            }
                            <CardContent style={{ height: '100%', overflow: 'auto' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    {isAuthoriseDocument === 'true' ?
                                        null
                                        :
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', columnGap: '10px', rowGap: '10px' }}>
                                            <Button
                                                variant="contained"
                                                style={{
                                                    width: "100%",
                                                    background: isModuleLocked ? "gray" : "#002D68",
                                                    color: "white",
                                                    height: '35px',
                                                }}
                                                disabled={isModuleLocked}
                                                onClick={handleClearPage}
                                            >
                                                New
                                            </Button>
                                            {/* <Button
                                                variant="contained"
                                                style={{
                                                    width: "100%",
                                                    background: "#002D68",
                                                    color: "white",
                                                    height: '35px',
                                                }}
                                                onClick={() => {
                                                    setIsView(false)
                                                    setIsEdit(true)
                                                }}
                                            >
                                                Edit
                                            </Button> */}
                                            <Button
                                                variant="contained"
                                                style={{
                                                    width: "100%",
                                                    background: isModuleLocked ? "gray" : "#002D68",
                                                    color: "white",
                                                    height: '35px',
                                                }}
                                                disabled={isModuleLocked}
                                            // onClick={() => setDeleteDailogOpen(true)}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                variant="contained"
                                                style={{
                                                    width: "100%",
                                                    background: isModuleLocked ? "gray" : "#002D68",
                                                    color: "white",
                                                    height: '35px',
                                                }}
                                                disabled={isModuleLocked}
                                                onClick={handleClearPage}
                                            >
                                                Clear
                                            </Button>
                                            <Button
                                                variant="contained"
                                                style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                                onClick={() => handleForwardReverse('first', '')}

                                            >
                                                <FastRewindIcon />
                                            </Button>
                                            <Button
                                                variant="contained"
                                                style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                                onClick={() => handleForwardReverse('reverse', mainId)}

                                            >
                                                <SkipPreviousIcon />
                                            </Button>
                                            {/* <Button
                                                variant="contained"
                                                style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                            >
                                                <SearchIcon />
                                            </Button> */}
                                            <Button
                                                variant="contained"
                                                style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                                onClick={() => handleForwardReverse('forward', mainId)}
                                                disabled={isModuleLocked}
                                            >
                                                <SkipNextIcon />
                                            </Button>
                                            <Button
                                                variant="contained"
                                                style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                                onClick={() => handleForwardReverse('last', '')}
                                                disabled={isModuleLocked}
                                            >
                                                <FastForwardIcon />
                                            </Button>
                                        </div>
                                    }
                                    {isAuthoriseDocument === 'true' ?
                                        null
                                        :
                                        isView === true ?
                                            null
                                            :
                                            <div>
                                                {/* <Button variant="contained" type='submit' style={{ flex: 1, backgroundColor: '#002d68', marginRight: '10px' }} onClick={handleTemplateDownload}>Template</Button>
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                    htmlFor="upload-photo"
                                                    sx={{ backgroundColor: '#002D68', height: '35px', marginLeft: '10px', marginRight: '10px' }}
                                                >
                                                    Upload File
                                                </Button>
                                                <input
                                                    id="upload-photo"
                                                    type="file"
                                                    style={{ display: 'none' }}
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files.length > 0) {
                                                            const reader = new FileReader();
                                                            reader.onload = () => {
                                                                if (reader.readyState === 2) {
                                                                    setUploadLoader(true)
                                                                    ImportStoreRequestData({
                                                                        file: reader.result,
                                                                    }, handleItemImportSucess, handleItemImportException);
                                                                }
                                                            };
                                                            reader.readAsDataURL(e.target.files[0]);
                                                        }
                                                    }}

                                                /> */}
                                                <Button variant="contained" type='submit' style={{ flex: 1, backgroundColor: '#002d68' }}>
                                                    {loading ? (
                                                        <CircularProgress size={24} style={{ color: 'white' }} />
                                                    ) : 'SAVE'}
                                                </Button>
                                            </div>
                                    }
                                </div>

                                <table id="transactionTable">
                                    <tr style={{ position: 'sticky', top: '-16px', backgroundColor: '#f9f9f9', zIndex: 1 }}>
                                        <th style={{ whiteSpace: 'nowrap' }}>Part No</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Part Name</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>UOM</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>From Location</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>QOH</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>ST Qty</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>To Location</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Remarks</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Action</th>
                                    </tr>
                                    {selectedItems.map((item, index) => (
                                        <tr key={index}>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>
                                                {item.label ? <span>{item.label}</span> :
                                                    <Autocomplete
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        options={itemLists}
                                                        getOptionLabel={(option) => `${option.label}` || ''}
                                                        sx={{ width: 300 }}
                                                        renderInput={(params) => <TextField
                                                            {...params}
                                                            label="Search Items"
                                                            onChange={handleChange}
                                                            sx={{
                                                                "& .MuiInputBase-root": {
                                                                    height: "35px",
                                                                    fontSize: "12px",
                                                                    backgroundColor: "#ffffff",
                                                                    borderRadius: "5px",
                                                                },
                                                                "& .MuiInputBase-input": {
                                                                    padding: "0 8px",
                                                                },
                                                                "& .MuiInputLabel-root": {
                                                                    fontSize: "12px",
                                                                    lineHeight: "1.2",
                                                                },
                                                            }}
                                                        />}
                                                        onChange={(event, value) => handleItemChange(value)}
                                                        size='small'
                                                        // disabled={isPOView}
                                                        PopperComponent={CustomPopper}
                                                    />
                                                }
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.itemName}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.uom}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} >{item.location}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} >{item.totStk}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} >{item.totStk}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>
                                                {isView ? (
                                                    <span>{item.toLoc}</span>
                                                ) :
                                                    item.id === 'RDL1' ?
                                                        null
                                                        :
                                                        (
                                                            <select
                                                                defaultValue={item.location}
                                                                onChange={(e) => handleEdit('location', e.target.value, item.id, item)}
                                                            >
                                                                <option value={""}>Select Location</option>
                                                                {
                                                                    locationLists && locationLists.map((loc) => (
                                                                        <option value={loc.id}>{loc.name}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        )}
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={isView ? false : true} onBlur={(e) => handleEdit('remarks', e.target.textContent, item.id, item)}>{item.remarks}</td>
                                            <td contentEditable={false} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                {item.id === 'RDL1' ?
                                                    null
                                                    :
                                                    isView ?
                                                        < DeleteIcon
                                                            style={{ color: 'gray', cursor: 'pointer' }}
                                                            disabled={true}
                                                        />
                                                        :
                                                        <DeleteIcon
                                                            onClick={() => {
                                                                handleDeleteRow(item.id)
                                                            }}
                                                            style={{ color: 'black', cursor: 'pointer' }}
                                                        />
                                                }
                                            </td>
                                        </tr>))}
                                </table>
                            </CardContent>

                        </Card>
                    </Grid>
                </Grid>

            </form>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div>
    )
}

export default StockTransfer