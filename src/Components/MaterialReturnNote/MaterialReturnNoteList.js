import React from 'react'
import { useState, useEffect } from 'react';
import { Autocomplete, Button, Card, CardContent, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Popper, Select, TextField, Typography } from '@mui/material';
import { CustomervsItemPartShow, GetPoBillAllSuppList, GetWithoutPoItemLists, GetMnrUniqueId, HandleGrnUpload, ViewAllMrnData, UpdateMrnData, MaterialReturnNotepreview, GetSRNNoList, MeteraialMRNList, meterialXLUpload } from '../../ApiService/LoginPageService';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import ViewMRN from './ViewMRN';
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ApplicationStore from '../../Utility/localStorageUtil';
import { mrnTemplateDOWNLOAD } from '../../ApiService/DownloadCsvReportsService';
import { useModuleLocks } from '../context/ModuleLockContext';

const MaterialReturnNoteList = () => {
    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter(
        (data) => data?.menu?.toLowerCase() === "MaterialIssue".toLowerCase()
    );
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Material Return Note")?.lockStatus === "locked";

    const [selectedDate, setSelectedDate] = useState(new Date())
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [uploadLoader, setUploadLoader] = useState(false);

    const [getPoNumber, setGetPoNumber] = useState("");
    const [suppliertype, setSupllierType] = useState("");
    const [selectedItems, setSelectedItems] = useState([{ id: 'RDL1' }]);
    const [partNoList, setPartNoList] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [selectedMrnNo, setSelectedMrnNo] = useState('A');
    const [mrnNo, setMrnNo] = useState({ sequentialNumber: 0, mrnNo: 0 })
    const [totalQuantity, setTotalQuantity] = useState('');
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [isView, setIsView] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [rowId, setRowId] = useState('');
    const [loading, setLoading] = useState(false);
    const [mainId, setMainId] = useState('');
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [digit, setDigit] = useState("");

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    function convertToISO(dateStr) {
        // Split the "DD-MM-YYYY" format
        const [day, month, year] = dateStr.split("-");

        // Create a new Date object using "YYYY-MM-DD"
        const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

        return isoDate.toISOString(); // Convert to "YYYY-MM-DDTHH:mm:ss.SSSZ"
    }
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
        handleForwardReverse('last', '');

        GetMnrUniqueId({ type: selectedMrnNo }, handleUniqueCodeSuccess, handleUniqueCodeException)
    }, [])

    const handleChange = (e) => {
        GetWithoutPoItemLists({ code: e.target.value }, handlePartNoDropshow, handlePartNoDropshowException);
    }

    const handlePartNoDropshow = (dataObject) => {
        setPartNoList(dataObject?.data || []);
    }

    const handlePartNoDropshowException = (error, errorMessage) => {
        console.log(errorMessage);
    }

    const onPartNoSelectChange = (value) => {
        if (value !== null) {
            const clonedSelectedItems = [...selectedItems];
            const lastObj = clonedSelectedItems.pop();
            clonedSelectedItems.push(value, lastObj);
            setSelectedItems(clonedSelectedItems);
            // handleForwardReverse('view', value?.id);

        }
    };


    const handleDeleteRow = (id) => {
        const newArray = selectedItems.filter((item) => item.id != id)
        setSelectedItems(newArray);
        calculateTotals(newArray);
    }

    const calculateTotals = (data) => {
        const totalQty = data.reduce((acc, item) => acc + (Number(item.returnQty) || 0), 0);
        setTotalQuantity(totalQty);
    };

    const handleEdit = (cellNam, newValue, id, rowData) => {
        let updatedItems;
        switch (cellNam) {
            case "Return Quantity":
                updatedItems = selectedItems.map((item) =>
                    item.id === id
                        ? { ...item, returnQty: newValue }
                        : item
                );
                break;
            case "Remarks":
                updatedItems = selectedItems.map((item) =>
                    item.id === id
                        ? { ...item, remarks: newValue }
                        : item
                );
                break;
            case "Lot":
                updatedItems = selectedItems.map((item) =>
                    item.id === id
                        ? { ...item, lot: newValue }
                        : item
                );
                break;

            default:
                updatedItems = selectedItems;
                break;
        }
        setSelectedItems(updatedItems);
        calculateTotals(updatedItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const items = selectedItems
            .filter(data => data?.id !== 'RDL1')
            .map(data => ({
                itemId: data?.itemId,
                returnQty: data?.returnQty,
                lot: data?.lot ? data?.lot : '',
                remarks: data?.remarks ? data?.remarks : '',
            }));

        const MrnData = {
            type: selectedMrnNo,
            digit: mrnNo.sequentialNumber,
            mrnNo: mrnNo.mrnNo,
            date: selectedDate,
            totalQty: totalQuantity,
        }

        const requestData = {
            ...(isEdit && { id: mainId }),
            mrn: MrnData,
            items: items
        };

        !isEdit ?
            HandleGrnUpload(requestData, handleSuccess, handleException)
            :
            UpdateMrnData(requestData, handleSuccess, handleException)
    };

    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        GetMnrUniqueId({ type: selectedMrnNo }, handleUniqueCodeSuccess, handleUniqueCodeException)
        setTimeout(() => {
            setRefreshData(oldValue => !oldValue);
            ClearData();
            handleClose();
            setLoading(false);
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const ClearData = () => {
        setSelectedItems([{ id: "RDL1" }]);
        setTotalQuantity('');
        setSelectedMrnNo('A');
        setRefreshData((oldValue) => !oldValue);
    }

    const handleUniqueCodeSuccess = (dataObject) => {
        setMrnNo({ sequentialNumber: dataObject?.digit, mrnNo: dataObject?.id })
        setDigit(dataObject?.digit || []);
        setGetPoNumber(dataObject?.id || []);
    }
    const handleUniqueCodeException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    const handleViewMrn = (id) => {
        setRowId(id);
        ViewAllMrnData({ id: id }, handleMrnSuccess, handleMrnException)
    }

    const handleMrnSuccess = (dataObject) => {
        dataObject?.itemsList.push({ id: 'RDL1' });
        setSelectedItems(dataObject?.itemsList || []);
        setSelectedMrnNo(dataObject?.mrn?.type || 'A');
        setSelectedDate(dataObject?.mrn?.created_at || new Date());
        setMrnNo({ sequentialNumber: dataObject.mrn.digit, mrnNo: dataObject.mrn.mrnNo });
        setTotalQuantity(dataObject?.mrn?.totalQty || '');
    }
    const handleMrnException = () => { }



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
        const currentYear = mrnNo?.mrnNo?.split('/')[0];
        setMrnNo({ mrnNo: `${currentYear}/${newUniqueCode.toString().padStart(5, 0)}`, sequentialNumber: newUniqueCode });
    };

    const handleClearPage = () => {
        // setIsView(false);
        // setIsEdit(false);
        // setIsForwardReverse(false);
        // setSelectedDate(new Date());
        // setMainId('');
        // setSelectedItems([]);
        setTotalQuantity('');
        // setIssuedBy(userDetails?.userName || "");
        setSelectedDate(new Date());
        setSelectedItems([{ id: "RDL1" }]);
        setIsEdit(false);
        setIsView(false);
        setSelectedMrnNo('A')
        GetMnrUniqueId({ type: selectedMrnNo }, handleUniqueCodeSuccess, handleUniqueCodeException);
    };

    const handleForwardReverse = (type, id) => {
        // setIsForwardReverse(true)
        setSupllierType('')
        MaterialReturnNotepreview({ type: type, category: selectedMrnNo, id: id }, handleActionSuccess, handleActionException)
    };
    const handleActionSuccess = (dataObject) => {
        setIsView(true);
        const data = dataObject;

        setMainId(data?.mrn?.id || '');
        setDigit(data?.mrn?.digit || "");
        setGetPoNumber(data?.mrn?.mrnNo || "");
        const rawDate = data?.mrn?.date || ""; // Example: "28-02-2025"
        const formattedDate = rawDate ? convertToISO(rawDate) : "";
        setSelectedDate(formattedDate);
        setTotalQuantity(data?.mrn?.totalQty || "");
        setSelectedItems(dataObject?.mrnItems || []);

    }
    const handleActionException = () => { };


    const handleMrnSearchChange = (e) => {
        MeteraialMRNList(
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
    const handleSupplierSearchMRNChange = (value) => {
        if (value !== null) {
            setSupllierType(value.mrnNo)
            setSelectedMrnNo(value.type)
        }
        if (value !== null) {
            MaterialReturnNotepreview(
                { id: value.id, category: value.type, type: "view" },
                handleActionSuccess,
                handleActionException
            );
        }
    };
    const handleTemplateDownload = () => {
        mrnTemplateDOWNLOAD(handleTemplateDownloadSuccess, handleTemplateDownloadFailed)
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
    };
    const handleItemImportSucess = (dataObject) => {
        setSelectedItems(dataObject?.matchedItems || []);
        setNotification({
            status: true,
            type: 'error',
            message: dataObject.nonLinkedItems,
        });
        setTimeout(() => {
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
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Material Return Note
                </Typography>
            </div>
            <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                <Grid container padding={1}>
                    <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">MRN No</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="MRN No"
                                        placeholder='MRN No'
                                        size="small"
                                        disabled={isView}
                                        style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                        value={selectedMrnNo}
                                        onChange={(e) => {
                                            setSelectedMrnNo(e.target.value)
                                            GetMnrUniqueId({ type: e.target.value }, handleUniqueCodeSuccess, handleUniqueCodeException)
                                        }}>
                                        <MenuItem value="A">A</MenuItem>
                                        <MenuItem value="B">B</MenuItem>
                                        <MenuItem value="C">C</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    readOnly={true}
                                    value={digit}
                                    onChange={handleUniqueCodeChange}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    inputProps={{ maxLength: 5 }} // Set max length to 5 characters
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    label="Date"
                                    placeholder='Date'
                                    variant="outlined"
                                    disabled={isView}
                                    required
                                    type='Date'
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    value={formatDate(selectedDate)}
                                    onChange={(e) => setSelectedDate(e.target.value)}

                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    readOnly={true}
                                    value={getPoNumber} size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px', marginBottom: '10px' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* <Grid item xs={12} sm={12} md={0.5} lg={0.5} xl={0.5}></Grid> */}
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2} style={{
                        paddingLeft: 7
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            backgroundColor: '#ffffff',
                            height: '40px',
                            border: '1px solid #c4c4c4',
                            borderRadius: '5px',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}>
                            <div>
                                <Typography style={{ fontWeight: 'bold' }}>Total Qty</Typography>
                            </div>
                            <div style={{ height: '100%', backgroundColor: '#c4c4c4', width: '2px' }} />
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Typography style={{ fontWeight: 'bold' }}>{totalQuantity}</Typography>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ paddingLeft: 10 }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            value={suppliertype}
                            options={supplierList}
                            fullWidth
                            getOptionLabel={(option) => option.mrnNo || suppliertype}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search MRN No"
                                    onChange={handleMrnSearchChange}
                                />
                            )}
                            onChange={(event, value) =>
                                handleSupplierSearchMRNChange(value)
                            }
                            size="small"
                            style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "5px",
                                flex: 1,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: screenHeight - 285, border: '1px solid black', }}>
                            <CardContent style={{ height: '100%', overflow: 'auto' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '15px' }}>

                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', columnGap: '10px', rowGap: '10px' }}>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                height: '35px',
                                                background:
                                                    userPermission[0]?.addData === 0 || isModuleLocked ? "gray" : "#002D68",
                                                color:
                                                    userPermission[0]?.addData === 0 || isModuleLocked ? "black" : "white",
                                            }}
                                            disabled={userPermission[0]?.addData === 0 || isModuleLocked}
                                            onClick={handleClearPage}
                                        >
                                            New
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                height: '35px',
                                                background:
                                                    userPermission[0]?.updateData === 0 || isModuleLocked ? "gray" : "#002D68",
                                                color:
                                                    userPermission[0]?.updateData === 0 || isModuleLocked ? "black" : "white",
                                            }}
                                            disabled={userPermission[0]?.updateData === 0 || isModuleLocked}
                                            onClick={() => {
                                                setIsView(false)
                                                setIsEdit(true)
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                background: userPermission[0]?.deleteData === 0 || isModuleLocked ? "gray" : "#002D68",
                                                color: "white",
                                                height: '35px',
                                            }}
                                            onClick={() => setDeleteDailogOpen(true)}
                                            disabled={userPermission[0]?.deleteData === 0 ? true : false || isModuleLocked}
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
                                    <div>
                                        <Button variant="contained" style={{ height: '35px', backgroundColor: '#002D68', marginLeft: '10px' }} onClick={handleTemplateDownload}>Template</Button>

                                        <Button
                                            variant="contained"
                                            component="label"
                                            htmlFor="upload-photo"
                                            sx={{ backgroundColor: isModuleLocked ? "gray" : "#002D68", height: '35px', marginLeft: '10px', marginRight: '10px' }}
                                            disabled={uploadLoader === true || isModuleLocked}
                                        >
                                            {/* Upload File */}
                                            {uploadLoader ? (
                                                <CircularProgress size={24} style={{ color: 'white' }} />
                                            ) : 'Upload File'}
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
                                                            setSelectedItems([]);
                                                            meterialXLUpload({
                                                                file: reader.result,

                                                            }, handleItemImportSucess, handleItemImportException);
                                                        }
                                                    };
                                                    reader.readAsDataURL(e.target.files[0]);
                                                    // Reset the input value to allow re-uploading the same file
                                                    e.target.value = '';
                                                }
                                            }}

                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "flex-end",
                                            width: "400px",
                                        }}
                                    >
                                        {!isView && <Button
                                            variant="contained"
                                            type="submit"
                                            style={{ height: '30px', backgroundColor: '#002d68' }}
                                            disabled={loading === true}
                                        >
                                            {loading ? (
                                                <CircularProgress size={24} style={{ color: 'white' }} />
                                            ) : (isEdit ? "UPDATE" : "SAVE")}
                                        </Button>}
                                    </div>
                                </div>

                                <table id="transactionTable">
                                    <thead>
                                        <tr style={{ position: 'sticky', top: '-16px', backgroundColor: '#f9f9f9', zIndex: 1 }}>
                                            <th>Part No</th>
                                            <th>Part Name</th>
                                            <th>UOM</th>
                                            <th>Return Qty</th>
                                            <th>Department/Location</th>
                                            <th>LOT</th>
                                            <th>Remarks</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedItems && selectedItems.map((item, index) => (
                                            <tr key={index}>
                                                <td contentEditable={true} >
                                                    {item.itemCode ? (
                                                        <span>{item.itemCode}</span>
                                                    ) : (
                                                        <Autocomplete
                                                            fullWidth
                                                            disablePortal
                                                            id={`combo-box-${index}`}
                                                            size="small"
                                                            disabled={isView}
                                                            options={partNoList}
                                                            getOptionLabel={(option) => option.itemCode}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Search Part No"
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
                                                                />
                                                            )}
                                                            onChange={(event, value) => onPartNoSelectChange(value, event)}
                                                            PopperComponent={CustomPopper}
                                                        />
                                                    )}
                                                </td>
                                                <td contentEditable={!isView}>{item.itemName}</td>
                                                <td contentEditable={!isView}>{item.uom}</td>
                                                <td contentEditable={!isView} onBlur={(e) => handleEdit('Return Quantity', e.target.textContent, item.id, item)}>{item.returnQty}</td>
                                                <td contentEditable={!isView}>{item.location}</td>
                                                <td contentEditable={!isView} onBlur={(e) => handleEdit('Lot', e.target.textContent, item.id, item)}>{item.lot}</td>
                                                <td contentEditable={!isView} onBlur={(e) => handleEdit('Remarks', e.target.textContent, item.id, item)}>{item.remarks}</td>
                                                <td contentEditable={!isView} style={{ textAlign: 'center' }}>
                                                    {item.id === 'RDL1' || isView ?
                                                        <DeleteIcon
                                                            style={{ color: '#dddddd', cursor: 'pointer' }}
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
                                            </tr>
                                        ))}
                                    </tbody>
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

            <ViewMRN
                viewModalOpen={viewModalOpen}
                setViewModalOpen={setViewModalOpen}
                handleViewMrn={handleViewMrn}
                setIsView={setIsView}
                setIsEdit={setIsEdit}
            />
        </div>

    )
}

export default MaterialReturnNoteList
