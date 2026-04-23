import React, { useEffect, useState } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { GetSFGVerificationInnerData, UpdateSFGVerificationInnerData, GetSFGFilterLocation, MoveToFg } from '../../ApiService/LoginPageService';
import '../../App.css';
import LinearProgress from '@mui/material/LinearProgress';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel, Card,
    Switch,
} from '@mui/material';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const SfgVarificationModule = ({
    open, setOpen, isAddButton, editData, setRefreshData, sfgRowId
}) => {

    const [sfgVarificationList, setSfgVarificationList] = useState([]);
    const [filterLocationList, setFilterLocationList] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([])
    const [selectAll, setSelectAll] = useState(false);
    const [idsArray, setIdsArray] = useState([]);
    const [refreshTableData, setRefreshTableData] = useState(false);
    const [updateLoader, setUpdateLoader] = useState(false);
    const [sfgAutoStatus, setSfgAutoStatus] = useState(false);
    const [selectedField, setSelectedField] = useState('ALL');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10)
    const [refreshKey, setRefreshKey] = useState(0);


    useEffect(() => {
        setOpen(open);
        open && GetSFGVerificationInnerData({ mrpMstId: sfgRowId, location: selectedLocation, type: selectedField, page: 1, limit: 100 }, handleSfgVarificationSucessShow, handleSfgVarificationExceptionShow)
        open && GetSFGFilterLocation(handleGetLocationSuccess, handleGetLocationException);
    }, [editData, sfgRowId, open, refreshTableData, selectedField]);

    const handleSfgVarificationSucessShow = (dataObject) => {
        setSfgVarificationList(dataObject?.data || []);
        setTotalRows(dataObject?.totalRows || 0);
        setCurrentPage(dataObject?.page || 1)
        setPageSize(dataObject?.limit || 0)
    }
    const handleSfgVarificationExceptionShow = () => { }

    // GET SFG LOCATION
    const handleGetLocationSuccess = (dataObject) => {
        setFilterLocationList(dataObject?.data || [])
    }
    const handleGetLocationException = () => { }

    const ClearData = () => {
        setOpen(false);
        setRefreshData(oldvalue => !oldvalue);
        setSelectedLocation([]);
        setSelectAll(false);
        setIdsArray([]);
    }

    const handleClose = () => {
        setUpdateLoader(false);
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const columns = [
        ...(selectedField !== "FG" ? [
            {
                field: 'selected',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}></span>,
                type: 'number',
                sortable: true,
                width: 120,
                align: 'center', headerAlign: 'center',
                renderHeader: (params) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
                        <span style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '16px' }}></span>
                    </div>
                ),
                renderCell: (params) => (
                    <Checkbox
                        checked={params.row.selected}
                        // disabled={params.row.remarks === "Completed"}
                        onChange={(e) => handleCheckboxChange(e, params.row.id, params.row.vendorProcess, params.row.sfgVerifiedQty)}
                    />
                ),
            }
        ] : []),
        ...(selectedField === "ALL" ? [
            {
                field: 'jcNo',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Job Card No</span>,
                type: 'string',
                sortable: true,
                minWidth: 180,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            }] : []),
        {
            field: 'mrpNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>MRP No</span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'string',
            sortable: true,
            minWidth: 190, flex: 1, align: 'center', headerAlign: 'center'
        },
        ...(selectedField === "ALL" ? [
            {
                field: 'allocQty',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Assigned Qty</span>,
                type: 'string',
                sortable: true,
                minWidth: 200, flex: 1, align: 'center', headerAlign: 'center'
            },
            {
                field: 'producedQty',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Produced Qty</span>,
                type: 'number',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center'
            },
            {
                field: 'pendingQty',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Pending Qty</span>,
                type: 'number',
                sortable: true,
                minWidth: 190,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'jwPenQty',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Pending JW Qty</span>,
                type: 'number',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center'
            },

            {
                field: 'sfgVerifiedQty',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SFG Verified Qty</span>,
                type: 'number',
                sortable: true,
                editable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center'
            },

            {
                field: 'productFinish',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Finish</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
                editable: false
            },
            {
                field: 'vendorProcess',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Vendor Process</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
            },
            {
                field: 'nextProcess',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Next Process Name</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
            },
            {
                field: 'machineName',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Machine Name</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
            },
            {
                field: 'remarks',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
            },
        ] : []),
        ...(selectedField === "FG" ? [
            {
                field: 'itemName',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Name</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
            },
            {
                field: 'Qty',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Inward Qty</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
            },
            {
                field: 'totStk',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Total Stock</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
            },
            {
                field: 'created_at',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Date</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
            },
        ] : []),
        ...(selectedField === "SFG" ? [
            {
                field: 'inwardType',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Inward Type</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
            },
            {
                field: 'inwardQty',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Inward Qty</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
            },
            {
                field: 'outwardType',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Outward Type</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
            },
            {
                field: 'outwardQty',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Outward Qty</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
            },
            {
                field: 'totQty',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Total Qty</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
            },
            {
                field: 'created_at',
                headerClassName: 'super-app-theme--header',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Date</span>,
                type: 'string',
                sortable: true,
                minWidth: 190, flex: 1, align: 'center', headerAlign: 'center',
            },
        ] : []),
    ];

    const handleCheckboxChange = (event, id, vendorProcess, sfgVerifiedQty) => {
        if (event.target.checked) {
            setIdsArray([...idsArray, { mrpId: id, vendorProcess: vendorProcess, sfgVerifiedQty }]);
        } else {
            const filteredArray = idsArray.filter((item) => item.mrpId !== id);
            setIdsArray(filteredArray);
        }

        const updatedRows = sfgVarificationList.map((row) =>
            row.id === id ? { ...row, selected: event.target.checked } : row
        );
        setSfgVarificationList(updatedRows);
    };

    const handleSelectAllChange = (event) => {
        setSelectAll(event.target.checked);
        const isChecked = event.target.checked;
        const updatedRows = sfgVarificationList.map(row => {
            // if (row.remarks === "Completed") {
            //     return row;
            // } else {
            //     return { ...row, selected: isChecked };
            // }
            return { ...row, selected: isChecked };
        });
        setSfgVarificationList(updatedRows);

        const updatedIds = isChecked ?
            sfgVarificationList.filter(row => row.remarks !== "Completed").map(row => ({ mrpId: row.id, vendorProcess: row.vendorProcess, sfgVerifiedQty: row.sfgVerifiedQty })) :
            [];
        setIdsArray(updatedIds);
        setRefreshKey((prevKey) => prevKey + 1);
    };

    const handleCellEdit = (params) => {
        // const updatedList = sfgVarificationList.map((supp) =>
        //     supp.id === params.id ?
        //         { ...supp, sfgVerifiedQty: params.sfgVerifiedQty }
        //         : supp
        // )
        // setSfgVarificationList(updatedList);
        // Find the item being edited

        // Update the list

        const updatedList = sfgVarificationList.map((supp) => {
            if (supp.id === params.id) {
                // Check if sfgVerifiedQty is greater than producedQty
                if (params.sfgVerifiedQty > supp.producedQty) {
                    setNotification({
                        status: true,
                        type: 'error',
                        message: "Error: sfgVerifiedQty cannot be greater than producedQty.",
                    });
                    setRefreshKey((prevKey) => prevKey + 1);
                    return { ...supp, sfgVerifiedQty: 0 }; // Set sfgVerifiedQty to 0
                } else {
                    return { ...supp, sfgVerifiedQty: params.sfgVerifiedQty }; // Update with the new value
                }
            }
            return supp; // Return unchanged items
        });

        setSfgVarificationList(updatedList); // Update the state
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedLocation(
            typeof value === 'string' ? value.split(',') : value,
        );
        // GetSFGVerificationInnerData({ mrpMstId: sfgRowId, location: typeof value === 'string' ? value.split(',') : value }, handleSfgVarificationSucessShow, handleSfgVarificationExceptionShow)
        GetSFGVerificationInnerData({ mrpMstId: sfgRowId, location: typeof value === 'string' ? value.split(',') : value, type: selectedField, page: currentPage, limit: 100 }, handleSfgVarificationSucessShow, handleSfgVarificationExceptionShow)
    };

    const handleUpdateClick = () => {
        setUpdateLoader(true)
        UpdateSFGVerificationInnerData({
            mrpList: idsArray
        }, handleSelectedUpdateSucess, handleSelectedUpdateException)
    }

    const handleSelectedUpdateSucess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefreshTableData((oldvalue) => !oldvalue)
        setSelectAll(false);
        setIdsArray([]);
        setTimeout(() => {
            handleClose();
        }, 2000);
    }

    const handleSelectedUpdateException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
    }

    const handleSwitchChange = (checked) => {
        setSfgAutoStatus(checked)
        if (checked) {
            const updatedData = sfgVarificationList.map((item) => ({ ...item, sfgVerifiedQty: item.producedQty }))
            setSfgVarificationList(updatedData)
        } else {
            const updatedData = sfgVarificationList.map((item) => ({ ...item, sfgVerifiedQty: 0 }))
            setSfgVarificationList(updatedData)
        }
    };

    const handleMoveToFg = () => {
        const payloadData = {
            type: selectedField,
            itemsList: idsArray
        }
        MoveToFg(payloadData, hanldeMoveToFgSuccess, hanldeMoveToFgException)
    }
    const hanldeMoveToFgSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefreshTableData((oldvalue) => !oldvalue)
        setSelectAll(false);
        setIdsArray([]);
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const hanldeMoveToFgException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 2000);
    }

    const handlePageChange = (newPage) => {
        console.log("newPagenewPagenewPage", newPage)
        setCurrentPage(newPage.page + 1)
        // GetAllocationRowData({ id: allocationId, page: newPage.page }, handleSucessShow, handleExceptionShow)
        setPageSize(newPage.pageSize)
        GetSFGVerificationInnerData({ mrpMstId: sfgRowId, location: selectedLocation, type: selectedField, page: newPage.page + 1, limit: 100 }, handleSfgVarificationSucessShow, handleSfgVarificationExceptionShow)
    };


    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%' } }}
            maxWidth="xl"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', rowGap: '15px', columnGap: '15px' }}>
                <div>
                    FG / SFG Verification
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '7px', borderRadius: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: '3px 10px 3px 10px', borderRadius: '5px' }}>
                        <FormControl fullWidth sx={{ width: 300 }}>
                            <InputLabel id="demo-simple-select-label">Select</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedField}
                                label="Select"
                                onChange={(e) => setSelectedField(e.target.value)}
                                size='small'
                            >
                                <MenuItem value={'ALL'}>All</MenuItem>
                                <MenuItem value={'FG'}>FG</MenuItem>
                                {/* <MenuItem value={'SFG'}>SFG</MenuItem> */}
                            </Select>
                        </FormControl>
                    </div>
                </div>

                {selectedField === 'ALL' && <div style={{ backgroundColor: '#ffffff', padding: '3px', borderRadius: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>

                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: '3px 10px 3px 10px', borderRadius: '5px' }}>
                        <Typography style={{ color: '#000000', fontWeight: 'bold' }}>Auto SFG Verification</Typography>
                        <Switch
                            checked={sfgAutoStatus}
                            onChange={(e) => {
                                handleSwitchChange(e.target.checked);
                            }}
                        />
                    </div>

                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-checkbox-label">Location</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={selectedLocation}
                            onChange={handleChange}
                            input={<OutlinedInput label="Location" />}
                            renderValue={(selected) => {
                                const selectedNames = filterLocationList.filter(location => selected.includes(location.id)).map(location => location.name);
                                return selectedNames.join(', ');
                            }}
                            MenuProps={MenuProps}
                            size='small'
                        >
                            {filterLocationList.map((value, key) => (
                                <MenuItem key={key} value={value.id}>
                                    <Checkbox checked={selectedLocation.indexOf(value.id) > -1} />
                                    <ListItemText primary={value.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>



                </div>}
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6">
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '2px', borderRadius: '10px', width: '100%', height: '100%' }}>
                            <CardContent>
                                <DataGrid
                                    rows={sfgVarificationList}
                                    columns={columns}
                                    pageSize={8}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none' }}
                                    sx={{
                                        overflow: 'auto',
                                        height: '50vh',
                                        width: '100%',
                                        '& .super-app-theme--header': {
                                            WebkitTextStrokeWidth: '0.6px',
                                            backgroundColor: '#93bce6',
                                            color: '#1c1919'
                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696',
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696',
                                        },
                                    }}
                                    processRowUpdate={handleCellEdit}
                                    getRowClassName={(params) => {
                                        const rowIndex = sfgVarificationList.findIndex(row => row.id === params.row.id);
                                        if (rowIndex !== -1) {
                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }
                                        return '';
                                    }}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                    onPaginationModelChange={handlePageChange}
                                    rowCount={totalRows}
                                    // page={page}
                                    pagination
                                    paginationMode="server"
                                    key={refreshKey}
                                // pageSizeOptions={[10, 25, 100]}
                                // paginationModel={{
                                //     pageSize: pageSize,
                                //     page: currentPage,
                                // }}
                                />

                                {updateLoader === true ?
                                    <Box sx={{ width: '100%' }}>
                                        <LinearProgress />
                                    </Box>
                                    :
                                    null
                                }

                            </CardContent>
                        </Card>

                    </div>

                    <DialogActions>
                        {/* {selectedField !== "FG" &&
                            <Button
                                variant="contained"
                                style={{ width: '150px', background: '#002D68', color: 'white' }}
                                onClick={() => {
                                    handleMoveToFg();
                                }}
                            >
                                Move to FG
                            </Button>
                        } */}
                        {selectedField !== "FG" &&
                            <Button
                                variant="contained"
                                style={{ width: '150px', background: '#002D68', color: 'white' }}
                                onClick={() => {
                                    handleUpdateClick();
                                }}
                            >
                                Update
                            </Button>
                        }
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setOpen(false)
                                ClearData();
                                setSfgAutoStatus(false);
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </Dialog>
    )
}

export default SfgVarificationModule;