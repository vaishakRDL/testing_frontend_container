import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
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
    UploadXlStoreRequestNote,
    GetAssemblyPlanningFIM
} from '../../ApiService/LoginPageService';
import StoresRequestNoteTitle from './PlanningStoreRequestNoteTitle';
import LinearProgress from '@mui/material/LinearProgress';

const PlanningStoreRequestNote = ({
    open, setOpen, isAddButton, editeData, setRefreshData,
}) => {

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    //SRN STATES
    const [srnNo, setSrnNo] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [srnDigit, setSrnDigit] = useState('');
    const [sItemName, setSItemName] = useState('');
    const [rowId, setRowId] = useState('');
    const [itemList, setItemList] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);
    console.log("selectedItems", selectedItems)
    const [itemLists, setItemLists] = useState([])
    const [uploadLoader, setUploadLoader] = useState(false);
    const [fimList, setFimList] = useState([]);
    const [selectedFIM, setSelectedFIM] = useState('');
    const [pageRefresher, setPageRefresher] = useState(false);
    //

    useEffect(() => {
        GetStoresRequestNoteUniqueID(handleGetCodeSuccess, handleGetCodeException)
        GetAssemblyPlanningFIM(handlePlanningFIMSuccess, handlePlanningFIMFailed)
    }, [editeData, pageRefresher]);

    const handleGetCodeSuccess = (dataObject) => {
        setSrnNo(dataObject.data.srnNo || '');
    }
    const handleGetCodeException = () => { }

    const handlePlanningFIMSuccess = (dataObject) => {
        setFimList(dataObject?.data || []);
    }
    const handlePlanningFIMFailed = (errorObject, errorMessage) => {
    }

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ sNo: index + 1, ...row }));
    };
    const rowData = generateRowsWithIndex(selectedItems);


    const handleSubmit = (e) => {
        e.preventDefault();
        UploadStoreRequestNote({ srnNo: srnNo, srnItems: rowData, fim: selectedFIM, isAssembly: 1 }, handleSuccess, handleException)

    };

    const handleSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject);
        setPageRefresher((oldvalue) => !oldvalue);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
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
        }, 2000);
    };

    const ClearData = () => {
        // setOpen(false);
        // setRefreshData(oldvalue => !oldvalue);
        setSelectedItems([]);
        setSelectedFIM('');
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    //MIDDLE GRID COLUMNS
    const middleGridColumns = [
        {
            field: 'sNo',
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
            field: 'Qty',
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
            field: 'pf',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Product Family</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            minWidth: 150,
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <DeleteData selectedRow={params.row} />,
            ],
        }, ,
    ];

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    handleDeleteRow(props.selectedRow.id)
                }}
                style={{ color: 'black' }}
            />
        );
    };

    const handleDeleteRow = (id) => {
        const newArray = selectedItems.filter((item) => item.id != id)
        setSelectedItems(newArray);
    }

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

    const handleItemChange = (value) => {
        if (value !== null) {
            const newSerialNumber = selectedItems.length + 1;
            const newItem = {
                ...value,
                serialNumber: newSerialNumber
            };
            console.log("newItem", newItem)

            setSelectedItems([...selectedItems, newItem]);
        }
    }

    const handleCellEdit = (params) => {
        const updatedList = selectedItems.map((supp) =>
            supp.id === params.id ?
                { ...supp, Qty: params.Qty, remarks: params.remarks }
                : supp
        )
        setSelectedItems(updatedList);
    };

    const handleXlImportSucess = (dataObject) => {
        setUploadLoader(false);
        setSelectedItems(dataObject.data || [])
        setPageRefresher((oldvalue) => !oldvalue);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const handleXlImportException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // setUploadLoader(false);
            // handleClose();
        }, 2000);
    }

    return (
        <div style={{ marginLeft: '25px', marginRight: '25px' }}>
            <StoresRequestNoteTitle />
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
                            // onChange={(e) => setSrnNo(e.target.value)}
                            readOnly={true}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={1.7} lg={1.7} xl={1.7}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select FIM</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Select FIM"
                                placeholder='Select FIM'
                                // variant="filled"
                                size='small'
                                value={selectedFIM}
                                onChange={(e) => {
                                    setSelectedFIM(e.target.value);
                                }
                                }
                                required
                            >
                                {fimList.map((data) => (
                                    <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} md={1.7} lg={1.7} xl={1.7}>
                        <TextField
                            fullWidth
                            // variant="filled"
                            type='date'
                            size='small'
                            required
                            value={formatDate(selectedDate)}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            readOnly={true}
                        />
                    </Grid>

                    {/* <Grid item xs={12} sm={12} md={1.7} lg={1.7} xl={1.7}>
                        <TextField
                            fullWidth
                            required
                            value={srnDigit}
                            size='small'
                            onChange={(e) => setSrnDigit(e.target.value)}
                            readOnly={true}
                        />
                    </Grid> */}
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%' }}>
                            {uploadLoader &&
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress />
                                </Box>
                            }
                            <CardContent>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={itemLists}
                                        sx={{ width: 300, marginBottom: '15px' }}
                                        renderInput={(params) => <TextField {...params} label="Search Item" onChange={handleChange} />}
                                        onChange={(event, value) => handleItemChange(value)}
                                        size="small"
                                    />
                                    <div>
                                        {/* <Button variant="contained" style={{ width: '180px', backgroundColor: '#002d68', marginRight: '10px' }}>Upload</Button> */}
                                        <Button
                                            variant="contained"
                                            component="label"
                                            htmlFor="upload-photo"
                                            sx={{ backgroundColor: '#002D68', height: '35px', marginLeft: '10px', marginRight: '10px' }}
                                        >
                                            Upload
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
                                                            UploadXlStoreRequestNote({
                                                                file: reader.result,
                                                                srnNo: srnNo,
                                                                fim: selectedFIM
                                                            }, handleXlImportSucess, handleXlImportException);
                                                        }
                                                    };
                                                    reader.readAsDataURL(e.target.files[0]);
                                                }
                                            }}

                                        />
                                        <Button variant="contained" type='submit' style={{ flex: 1, backgroundColor: '#002d68' }}>Generate Store Request</Button>
                                    </div>
                                </div>
                                <DataGrid
                                    rows={rowData}
                                    columns={middleGridColumns}
                                    pageSize={8}
                                    // loading={isLoading}
                                    rowsPerPageOptions={[8]}
                                    processRowUpdate={handleCellEdit}
                                    disableSelectionOnClick
                                    style={{ border: 'none', }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '55vh',
                                        width: '100%',
                                        marginTop: '10px',
                                        '& .super-app-theme--header': {
                                            WebkitTextStrokeWidth: '0.6px',
                                            backgroundColor: '#93bce6',
                                            color: '#1c1919'
                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696',
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696', // Add border to column headers
                                        },
                                    }}
                                    getRowClassName={(params) => {
                                        // Find the index of the row within the rows array
                                        const rowIndex = rowData.findIndex(row => row.id === params.row.id);
                                        // Check if the index is valid
                                        if (rowIndex !== -1) {

                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }
                                        return ''; // Return default class if index is not found
                                    }}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                />
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

export default PlanningStoreRequestNote