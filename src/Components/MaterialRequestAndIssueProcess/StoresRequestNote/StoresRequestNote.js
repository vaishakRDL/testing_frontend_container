import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
    LinearProgress,
    Popper,
    CircularProgress,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { CheckBox } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from '@mui/material/Autocomplete';
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
    UpdateStoredrequestEdit,
    GetGeneratedJW,
    SearchSRNNOItemShow
} from '../../../ApiService/LoginPageService';
import StoresRequestNoteTitle from './StoresRequestNoteTitle';
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { StoreRequestNoteTemplate } from '../../../ApiService/DownloadCsvReportsService';
import { Link, useLocation } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useModuleLocks } from '../../context/ModuleLockContext';

const StoresRequestNote = ({
    open, setOpen, isAddButton, editeData, setRefreshData,
}) => {

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Store Request Note")?.lockStatus === "locked";


    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    //SRN STATES
    const [srnNo, setSrnNo] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [generatedSRNLists, setGeneratedSRNLists] = useState([]);
    const [selectedSRNNo, setSelectedSRNNo] = useState('');
    const [rowId, setRowId] = useState('');
    const [itemList, setItemList] = useState([])
    const [selectedItems, setSelectedItems] = useState([{ id: 'RDL1' }]);
    console.log("selectedItems", selectedItems)
    const [itemLists, setItemLists] = useState([])
    const [isView, setIsView] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mainId, setMainId] = useState('');
    const [uploadLoader, setUploadLoader] = useState(false);
    const [category, setCategory] = useState('');
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [kanbanDate, setKanBanDate] = useState('');
    const [authorize, setAuthorized] = useState('');
    //

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
        setSrnNo(dataObject.data.srnNo || '');
    }
    const handleGetCodeException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        if (isEdit) {
            UpdateStoredrequestEdit({
                id: mainId,
                srnNo: srnNo, data2: selectedItems, isAssembly: 0
            }, handleSuccess, handleException)
        } else {
            UploadStoreRequestNote({ srnNo: srnNo, srnItems: selectedItems, isAssembly: 0 }, handleSuccess, handleException)

        }
    };

    const handleSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
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
        setSelectedItems([])
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleSRNChange = (e) => {
        SearchSRNNOItemShow({ code: e.target.value }, handleGeneratedSRNSucessShow, handleGeneratedSRNExceptionShow);
    }

    const handleGeneratedSRNSucessShow = (dataObject) => {
        setGeneratedSRNLists(dataObject?.data || []);
    }
    const handleGeneratedSRNExceptionShow = (errorObject, errorMessage) => {
    };
    const handleGeneratedSRNSelect = (selectedValue) => {
        console.log("qqqqqqqqqqqq", selectedValue)
        if (selectedValue !== null) {
            setSelectedSRNNo(selectedValue?.label);
            StoreRequestNotePreview({ type: 'view', id: selectedValue.value }, handleActionSuccess, handleActionException)
        }
    };

    const optionsPartNoList = generatedSRNLists ? generatedSRNLists.map(item => ({
        value: item?.id,
        label: item?.srnNo
    })) : [];
    //MIDDLE GRID COLUMNS
    const middleGridColumns = [
        {
            field: 'serialNumber',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SI No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'label',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Name</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'srnQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SRN QTY</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: true
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: true
        },
        {
            field: 'productFamily',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Product Family</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        }
    ];

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
        SearchSRNItemLists({ code: e.target.value }, handleItemSucessShow, handleItemExceptionShow);
    }

    const handleItemSucessShow = (dataObject) => {
        setItemLists(dataObject?.data || []);
    }
    const handleItemExceptionShow = (errorObject, errorMessage) => {
    }

    // const handleItemChange = (value) => {
    //     if (value !== null) {
    //         const clonedSelectedItems = [...selectedItems];
    //         const lastObj = clonedSelectedItems.pop();
    //         clonedSelectedItems.push(value, lastObj);
    //         setSelectedItems(clonedSelectedItems);
    //     }
    // }

    const handleItemChange = (value) => {
        if (value !== null) {
            // check if already selected
            const alreadyExists = selectedItems.some(item => item.label === value.label);

            if (alreadyExists) {
                alert(`Part number "${value.label}" is already present.`);
                return; // stop further execution
            }

            const clonedSelectedItems = [...selectedItems];
            const lastObj = clonedSelectedItems.pop();
            clonedSelectedItems.push(value, lastObj);
            setSelectedItems(clonedSelectedItems);
        }
    };


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
            case "srnQty":
                const updatedSrnQty = selectedItems.map((supp) =>
                    supp.id === id && cellNam === 'srnQty' ?
                        { ...supp, srnQty: newValue }
                        : supp
                )
                setSelectedItems(updatedSrnQty);
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
        setSelectedSRNNo('');
        StoreRequestNotePreview({ type: type, id: id }, handleActionSuccess, handleActionException)
    }

    const handleActionSuccess = (dataObject) => {
        setIsView(true);
        setSelectedItems(dataObject?.data2 || []);

        const data = dataObject.data[0];
        setSrnNo(data?.srnNo || '');
        // setSelectedDate(data?.srnDate || '');
        // Convert srnDate from "DD-MM-YYYY" to "MM-DD-YYYY"
        const formattedDate = data?.srnDate
            ? data.srnDate.split('-').reverse().join('-')
            : '';
        setSelectedDate(formattedDate);
        setMainId(data?.id || '');
        setCategory(data?.category || '');
        setKanBanDate(data?.kanbanDate || '')
        setAuthorized(data?.authorized || '')
    }
    const handleActionException = () => { }

    const handleClearPage = () => {
        setIsView(false);
        setIsEdit(false);
        setSelectedItems([{ id: 'RDL1' }]);
        setSelectedDate(new Date());
        setAuthorized('')
        GetStoresRequestNoteUniqueID(handleGetCodeSuccess, handleGetCodeException);
    }

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

        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setUploadLoader(false);
        }, 2000);
    }
    const handleItemImportException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setUploadLoader(false);
        }, 2000);
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

    const arrayToWorksheet = (array) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PO Report');

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
        // Flatten data to match the frontend table structure
        const formattedData = selectedItems.map((data) => ({
            "Part No": data?.label,
            "Part Name": data?.itemName,
            "UOM": data?.uom,
            "SRN Qty": data?.srnQty,
            "Remarks": data?.remarks,
            "Product Family": data?.pf,
        }))

        const workbook = arrayToWorksheet(formattedData);
        downloadExcelFile(workbook, 'Stores Request Note.xlsx');
    };

    // UNIQUE CODE MANUAL CHANGE
    const handleUniqueCodeChange = (e) => {
        const newUniqueCode = e.target.value;
        const currentYear = srnNo?.split('/')[0];
        // setSrnNo(`${currentYear}/${newUniqueCode.toString().padStart(5, 0)}`);
        setSrnNo(newUniqueCode);
    };

    return (
        <div style={{ marginLeft: '25px', marginRight: '25px' }}>
            {/* <StoresRequestNoteTitle /> */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px', marginBottom: '10px' }}>
                {isAuthoriseDocument === 'true' &&
                    <Link to='/AuthoriseDocumentsModule' style={{ textDecoration: 'none' }}>
                        <Typography
                            sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                            variant="h5"
                        >
                            {`Authorize Documents>>`}
                        </Typography>
                    </Link>
                }
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    {isEdit ? "Stores Request Note" : isView ? "Stores Request Note" : "Stores Request Note"}
                </Typography>
            </div>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={1.7} lg={1.7} xl={1.7}>
                        <TextField
                            fullWidth
                            label="SRN No"
                            InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                            required
                            size='small'
                            value={srnNo}
                            onChange={handleUniqueCodeChange}
                            // onChange={(e) => setSrnNo(e.target.value)}
                            readOnly={true}
                            disabled={isView ? true : false}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={1.7} lg={1.7} xl={1.7}>
                        <TextField
                            fullWidth
                            label="SRN Date"
                            type='date'
                            size='small'
                            InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                            required
                            value={formatDate(selectedDate)}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            readOnly={true}
                            disabled={isView ? true : false}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12} md={1.9} lg={1.9} xl={1.9}>
                        <TextField
                            fullWidth
                            label="Kanban Date"
                            InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                            required
                            size='small'
                            value={kanbanDate}
                            // onChange={(e) => setSrnNo(e.target.value)}
                            readOnly={true}
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={3.7} lg={3.7} xl={3.7}>

                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={optionsPartNoList}
                            fullWidth
                            value={selectedSRNNo}
                            getOptionLabel={(option) => option.label || selectedSRNNo}
                            renderInput={(params) => <TextField {...params} label="Search SRN No" onChange={handleSRNChange} />}
                            onChange={(event, value) => handleGeneratedSRNSelect(value)}
                            size="small"
                            style={{ backgroundColor: '#ffffff', borderRadius: '5px', zIndex: 10000 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: screenHeight - 270 }}>
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
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', columnGap: '8px', rowGap: '10px' }}>
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
                                            <Button
                                                variant="contained"
                                                style={{
                                                    width: "100%",
                                                    background: isModuleLocked ? "gray" : "#002D68",
                                                    color: "white",
                                                    height: '35px',
                                                }}
                                                onClick={() => {
                                                    setIsView(false)
                                                    setIsEdit(true)
                                                }}
                                                disabled={authorize == 1 || isModuleLocked}
                                            >
                                                Edit
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
                                                onClick={handleClearPage}
                                                disabled={isModuleLocked}
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

                                            >
                                                <SkipNextIcon />
                                            </Button>
                                            <Button
                                                variant="contained"
                                                style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                                onClick={() => handleForwardReverse('last', '')}

                                            >
                                                <FastForwardIcon />
                                            </Button>
                                        </div>
                                    }
                                    {/* {isAuthoriseDocument === 'true' ?
                                        null
                                        :
                                        isView === true ?
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                                >
                                                    Export
                                                </Button>
                                            </div>
                                            :
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    style={{ background: "#002D68", color: "white", height: '35px', marginRight: '10px' }}
                                                >
                                                    Export
                                                </Button>
                                                <Button variant="contained" type='submit' style={{ flex: 1, backgroundColor: '#002d68', marginRight: '10px' }} onClick={handleTemplateDownload}>Template</Button>
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

                                                />
                                                <Button variant="contained" type='submit' style={{ flex: 1, backgroundColor: '#002d68' }}>Generate Store Request</Button>
                                            </div>
                                    } */}
                                    {isView && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', }}>
                                        <Typography
                                            sx={{
                                                color: authorize !== 1 ? 'red' : 'green',
                                                fontWeight: 'bold',
                                                fontSize: '20px',
                                            }}
                                        >
                                            {authorize !== 1 ? "Unauthorized" : "Authorized"}
                                        </Typography>
                                    </div>}



                                    {isAuthoriseDocument === 'true' ? null : (
                                        <div style={{ paddingLeft: 10 }}>
                                            <Button
                                                variant="contained"
                                                style={{
                                                    background: isModuleLocked ? "gray" : "#002D68",
                                                    color: "white",
                                                    height: '35px',
                                                    marginRight: '10px',
                                                }}
                                                onClick={handleDownload}
                                                disabled={isModuleLocked}
                                            >
                                                Export
                                            </Button>

                                            {!isView && (
                                                <>
                                                    <Button
                                                        variant="contained"
                                                        type="submit"
                                                        style={{
                                                            flex: 1,
                                                            backgroundColor: '#002D68',
                                                            marginRight: '8px',
                                                        }}
                                                        onClick={handleTemplateDownload}
                                                    >
                                                        Template
                                                    </Button>

                                                    <Button
                                                        variant="contained"
                                                        component="label"
                                                        htmlFor="upload-photo"
                                                        sx={{
                                                            backgroundColor: '#002D68',
                                                            height: '35px',
                                                            marginRight: '8px',
                                                        }}
                                                        disabled={uploadLoader === true}
                                                    >
                                                        Upload File
                                                    </Button>

                                                    <input
                                                        id="upload-photo"
                                                        type="file"
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                const reader = new FileReader();
                                                                reader.onload = () => {
                                                                    if (reader.readyState === 2) {
                                                                        setUploadLoader(true);
                                                                        ImportStoreRequestData(
                                                                            { file: reader.result },
                                                                            handleItemImportSucess,
                                                                            handleItemImportException
                                                                        );
                                                                    }
                                                                };
                                                                reader.readAsDataURL(file);
                                                            }
                                                        }}
                                                    />

                                                    <Button
                                                        variant="contained"
                                                        type="submit"
                                                        style={{
                                                            flex: 1,
                                                            backgroundColor: '#002D68',
                                                        }}
                                                    >
                                                        {/* Generate Store Request */}
                                                        {loading ? (
                                                            <CircularProgress size={24} style={{ color: 'white' }} />
                                                        ) : isEdit ? "Update" : "Generate Store Request"}
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    )}

                                </div>

                                <table id="transactionTable">
                                    <tr style={{ position: 'sticky', top: '-16px', backgroundColor: '#f9f9f9', zIndex: 1 }}>
                                        {category === 'Production' && isAuthoriseDocument === 'true' ? <th style={{ whiteSpace: 'nowrap' }}>Nesting Id</th> : null}
                                        <th style={{ whiteSpace: 'nowrap' }}>Part No</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Part Name</th>
                                        {category === 'Production' && isAuthoriseDocument === 'true' ? <th style={{ whiteSpace: 'nowrap' }}>JobCard No</th> : null}
                                        <th style={{ whiteSpace: 'nowrap' }}>UOM</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>SRN QTY</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Remarks</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Product Family</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Actions</th>
                                    </tr>
                                    {selectedItems.map((item, index) => (
                                        <tr key={index}>
                                            {category === 'Production' && isAuthoriseDocument === 'true' ? <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.nestNo}</td> : null}
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>
                                                {item.label ? <span>{item.label}</span> :
                                                    <Autocomplete
                                                        disablePortal
                                                        id="combo-box-demo"
                                                        options={itemLists}
                                                        getOptionLabel={(option) => `${option.label}` || ''}
                                                        sx={{ width: 300 }}
                                                        renderInput={(params) => <TextField {...params} label="Search Items" onChange={handleChange} />}
                                                        onChange={(event, value) => handleItemChange(value)}
                                                        size='small'
                                                        // disabled={isPOView}
                                                        PopperComponent={CustomPopper}
                                                    />
                                                }
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.itemName}</td>
                                            {category === 'Production' && isAuthoriseDocument === 'true' ? <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.jcNos}</td> : null}
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.uom}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={isView ? false : true} onBlur={(e) => handleEdit('srnQty', e.target.textContent, item.id, item)}>{item.srnQty}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={isView ? false : true} onBlur={(e) => handleEdit('remarks', e.target.textContent, item.id, item)}>{item.remarks}</td>
                                            <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.pf}</td>
                                            <td contentEditable={false} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                {item.id === 'RDL1' ?
                                                    null
                                                    :
                                                    isAuthoriseDocument === 'true' ?
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

export default StoresRequestNote