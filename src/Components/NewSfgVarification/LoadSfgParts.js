import { Autocomplete, Button, CardContent, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Switch, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GetSuppVsItemSuppList, GetSuppVsItemSuppItemList, GetSuppAllAddress, GetSupplierPendingPo, GetSupplierPendingDC, GetPendingIssueParts, LoadSfgPendingParts, GetSFGFilterLocation, GetSFGVerificationInnerData, HandleCreateJobWork } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
// import IssueModal from './IssueComponent/IssueModal';

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

const LoadSfgParts = ({ pendingPOModalOpen, setPendingPOModalOpen, setSelectedItems, selectedItems, handleClearPage }) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [loadLists, setLoadLists] = useState([]);

    const [selectAll, setSelectAll] = useState(false);
    const [selectedPendingPo, setSelectedPendingPo] = useState([]);

    //////////////////////////////NEW DATA\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    const [issueModalOpen, setIssueModalOpen] = useState(false);
    const [rowId, setRowId] = useState('');
    const [shelfLifeItem, setShelfLifeItem] = useState('');
    const [itemCode, setItemCode] = useState('');
    const [rawMaterial, setRawMaterial] = useState('');
    const [uom, setUOM] = useState('');
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [requiredQuantity, setRequiredQuantity] = useState('');
    const [selectedRowData, setSelectedRowData] = useState('');

    const [filterLocationList, setFilterLocationList] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([])
    const [type, setType] = useState(false);
    const [sfgAutoStatus, setSfgAutoStatus] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(false);
    //////////////////////////////NEW DATA\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    // PENDING PO COLUMN
    const pendingPoColumns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>S No</span>,
            type: 'string',
            sortable: true,
            width: 70,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'jcNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Job Card No</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'mrpNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>MRP No</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'kanbanDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Kanban Date</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Part No</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Part Name</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Assigned Qty</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'producedQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Produced Qty</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'sfgVerifiedQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>SFG Verified Qty</span>,
            type: 'string',
            sortable: true,
            width: 200,
            editable: true,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'pendQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Pending Qty</span>,
            type: 'string',
            sortable: true,
            width: 200,
            editable: false,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'productFinish',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Part Finish</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },

        {
            field: 'vendorProcess',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Vendor Process</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'nextProcess',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Next Process Name</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'machineName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Machine Name</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontSize: '16px' }}>Remarks</span>,
            type: 'string',
            sortable: true,
            width: 200,
            align: 'center', headerAlign: 'center'
        },
    ];

    useEffect(() => {
        pendingPOModalOpen && LoadSfgPendingParts({ location: [], page: 1, limit: 100, type: type ? 'VP' : 'All' }, handleSuppPOSucessShow, handleSuppPOExceptionShow);
        pendingPOModalOpen && GetSFGFilterLocation(handleGetLocationSuccess, handleGetLocationException);
    }, [pendingPOModalOpen, refreshData, type])

    // GET SFG LOCATION
    const handleGetLocationSuccess = (dataObject) => {
        setFilterLocationList(dataObject?.data || [])
    }
    const handleGetLocationException = () => { }

    // GET SUPPLIER LIST
    const handleSuppPOSucessShow = (dataObject) => {
        setLoadLists(dataObject?.data || []);
    }
    const handleSuppPOExceptionShow = (errorObject, errorMessage) => {
    }

    const handleRowClick = (params) => {
        // console.log("handleRowClick", params.row)
        // setSelectedItems([...selectedItems, params.row]);
        // // setBillingAddress(params.row.address);
        // setPendingPOModalOpen(false);
        setIssueModalOpen(true);
        setRowId(params.row.id);
        setShelfLifeItem(params.row.shelfLifeItem);
        setItemCode(params.row.itemCode);
        setRawMaterial(params.row.rawMaterialName);
        setUOM(params.row.uom);
        setRequiredQuantity(Number(params.row.reqQty) - Number(params.row.issuedQty));
        setSelectedRowData(params.row);
    }

    const handleSubmitClick = () => {
        if (type === true) {
            setLoading(true);
            HandleCreateJobWork({ sfgItems: selectedRows }, handleJobWorkSuccess, handleJobWorkException)
        } else {
            // Validate all selectedRows before proceeding
            const hasInvalidQty = selectedRows.some((item) =>
                /*Number(item.sfgVerifiedQty) > Number(item.Qty) ||*/ Number(item.sfgVerifiedQty) === 0
            );

            if (hasInvalidQty) {
                setNotification({
                    status: true,
                    type: 'error',
                    // message: "Each SFG Verified Quantity must be > 0 and <= Assigned Quantity",
                    message: "Each SFG Verified Quantity must be > 0",
                });
                return; // Stop execution if invalid
            }
            setPendingPOModalOpen(false);
            setSelectedItems(selectedRows);
            setSfgAutoStatus(false);
            setType(false);
            setTimeout(() => {
                setSelectedRows([])
                handleClose();
            }, 1000)
        }
    }

    const handleJobWorkSuccess = (dataObject) => {
        setRefreshData((prev) => !prev);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
            setLoading(false);
        }, 3000);
    }
    const handleJobWorkException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleRowSelection = (selectionModel) => {
        // Find the selected rows based on IDs
        const selectedData = loadLists.filter(row => selectionModel.includes(row.id));
        setSelectedRows(selectedData);
    };

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedLocation(
            typeof value === 'string' ? value.split(',') : value,
        );
        LoadSfgPendingParts({ location: typeof value === 'string' ? value.split(',') : value, page: 1, limit: 100, type: type ? 'VP' : 'All' }, handleSuppPOSucessShow, handleSuppPOExceptionShow)
    };

    // AUTO TOGGLE SWITCH
    const handleSwitchChange = (checked) => {
        setSfgAutoStatus(checked)
        console.log(checked)
        if (checked) {
            const updatedData = loadLists.map((item) => ({ ...item, sfgVerifiedQty: (item.producedQty - item.sfgVerifiedQty) }))
            setLoadLists(updatedData)
            // UPDATE CHECKED ITEMS
            const selectedData = selectedRows.map((item) => ({ ...item, sfgVerifiedQty: (item.producedQty - item.sfgVerifiedQty) }))
            setSelectedRows(selectedData);
        } else {
            // const updatedData = loadLists.map((item) => ({ ...item, sfgVerifiedQty: 0 }))
            // setLoadLists(updatedData)
            // // UPDATE CHECKED ITEMS
            // const selectedData = selectedRows.map((item) => ({ ...item, sfgVerifiedQty: 0 }))
            // setSelectedRows(selectedData);
            setRefreshData((oldvalue) => !oldvalue)

        }
    };

    const handleCellEdit = (params) => {

        const editedSelectedArray = loadLists.map((item) =>
            item.id === params.id
                ? { ...item, sfgVerifiedQty: params.sfgVerifiedQty }
                : item
        );
        setLoadLists(editedSelectedArray);
        const editedSelectedItems = selectedRows.map((item) =>
            item.id === params.id
                ? { ...item, sfgVerifiedQty: params.sfgVerifiedQty }
                : item
        );
        setSelectedRows(editedSelectedItems);
        return params; // Return updated row if using with processRowUpdate
    };


    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={pendingPOModalOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, display: 'flex' }}>
                    {type ? 'SFG VENDOR PROCESS' : 'SFG VERIFICATION'}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: '3px 10px 3px 10px', borderRadius: '5px' }}>
                        <Typography style={{ color: '#000000', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Auto SFG Verification</Typography>
                        <Switch
                            checked={sfgAutoStatus}
                            onChange={(e) => {
                                handleSwitchChange(e.target.checked);
                            }}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#4CAF50', // Green color when checked
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#4CAF50', // Green track when checked
                                },
                                '& .MuiSwitch-switchBase': {
                                    color: '#F44336', // Red color when unchecked
                                },
                                '& .MuiSwitch-track': {
                                    backgroundColor: '#F44336', // Red track when unchecked
                                }
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: '3px 10px 3px 10px', borderRadius: '5px', width: '100%' }}>
                        <FormControl fullWidth style={{ marginTop: '3px' }}>
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
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', padding: '3px 10px 3px 10px', borderRadius: '5px', width: '100%' }}>
                        <Typography style={{ color: '#000000', fontWeight: 'bold' }}>All</Typography>
                        <Switch
                            checked={type}
                            onChange={(e) => {
                                setType(e.target.checked);
                                setSfgAutoStatus(false);
                            }}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#4CAF50', // Green color when checked
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#4CAF50', // Green track when checked
                                },
                                '& .MuiSwitch-switchBase': {
                                    color: '#F44336', // Red color when unchecked
                                },
                                '& .MuiSwitch-track': {
                                    backgroundColor: '#F44336', // Red track when unchecked
                                }
                            }}
                        />
                        <Typography style={{ color: '#000000', fontWeight: 'bold' }}>Vendor Process</Typography>
                    </div>
                </div>
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" /*onSubmit={handleSubmit}*/>
                    <Grid container >
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            {/* <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                <CardContent> */}
                            <DataGrid
                                rows={loadLists}
                                columns={pendingPoColumns}
                                pageSize={8}
                                checkboxSelection
                                disableRowSelectionOnClick
                                onRowSelectionModelChange={handleRowSelection}
                                rowsPerPageOptions={[8]}
                                // onRowClick={handleRowClick} // Add this line to handle row clicks
                                processRowUpdate={(newRow) => {
                                    return handleCellEdit(newRow); // must return updated row
                                }}
                                style={{ border: 'none' }}
                                sx={{
                                    overflow: 'auto',
                                    height: '43vh',
                                    width: '100%',
                                    cursor: 'pointer',
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
                                key={refreshKey}
                                rowHeight={40}
                                columnHeaderHeight={40}
                                getRowClassName={(params) => {
                                    const rowIndex = loadLists.findIndex(row => row.id === params.row.id);
                                    if (rowIndex !== -1) {
                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                    }
                                    return '';
                                }}


                            />
                            {/* </CardContent>

                            </Card> */}
                        </Grid>
                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ background: selectedRows.length < 1 ? 'gray' : '#002D68', color: 'white' }}
                            // type="submit"
                            disabled={selectedRows.length < 1 || loading === true}
                            onClick={handleSubmitClick}
                        >
                            {/* {type ? "Create Job Work" : "Submit"} */}
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (type ? "Create Job Work" : "Submit")}
                        </Button>
                        <Button
                            variant="contained"
                            style={{ background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setPendingPOModalOpen(false);
                                setSelectedPendingPo([]);
                                setSfgAutoStatus(false);
                                setType(false);
                                handleClose();
                                // ClearData();
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

            {/* <IssueModal
                issueModalOpen={issueModalOpen}
                setIssueModalOpen={setIssueModalOpen}
                rowId={rowId}
                itemCode={itemCode}
                rawMaterialName={rawMaterial}
                uom={uom}
                requiredQuantity={requiredQuantity}
                selectedRowData={selectedRowData}
                setRefreshData={setRefreshData}
                shelfLifeItem={shelfLifeItem}
                handleClearPage={handleClearPage}
            /> */}

        </Dialog>
    )
}

export default LoadSfgParts