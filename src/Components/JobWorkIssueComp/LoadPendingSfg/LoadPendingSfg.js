import { Autocomplete, Button, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GetSuppVsItemSuppList, GetSuppVsItemSuppItemList, GetSuppAllAddress, GetSupplierPendingPo, ViewGeneratedJobWorkIssue, ViewSfgVendorProcess, LoadPendingQuarantine } from '../../../ApiService/LoginPageService';

const LoadPendingSfg = ({ setLoadPendingSfg, loadPendingSfg, setSelectedItems, supplierSid, selectedType }) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [selectAll, setSelectAll] = useState(false);
    const [sfgVendorProcessList, setSfgVendorProcessList] = useState([]);
    const [selectedSfgVendorProcessList, setSelectedSfgVendorProcessList] = useState([]);

    const pendingPoColumns = [
        {
            field: 'jcNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>JC No</span>,
            type: 'string',
            sortable: true,
            width: 150,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'string',
            sortable: true,
            width: 150,
            align: 'center',
            headerAlign: 'center',
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
            field: 'qoh',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>QOH</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'hsn',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>HSNCODE</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'jwQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Qty</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'suppDesc',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier Desc</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'rate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rate</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'location',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Location</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: true
        },
        {
            field: 'lot',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>LOT</span>,
            type: 'string',
            sortable: true,
            minWidth: 180,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false,
        },
        {
            field: 'amount',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Amt</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'grnNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>GRN INFO</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'nextProcess',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Next Process</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remark</span>,
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
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName: 'BOM',
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            renderHeader: (params) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
                    <span style={{ marginLeft: '5px', fontSize: '15px' }}>Select All</span>
                </div>
            ),
            getActions: (params) => [
                <Selector selectedRow={params.row} />,
            ],
        },
    ];

    useEffect(() => {
        if (selectedType === 'Quarantine') {
            loadPendingSfg && LoadPendingQuarantine({ spId: supplierSid }, handleSucessShow, handleExceptionShow)
        } else {
            loadPendingSfg && ViewSfgVendorProcess({ spId: supplierSid }, handleSucessShow, handleExceptionShow)
        }
    }, [loadPendingSfg])

    const handleSucessShow = (dataObject) => {
        setSfgVendorProcessList(dataObject?.data || []);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {
    }

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ sNo: index + 1, select: false, ...row }));
    };
    const rowData = generateRowsWithIndex(sfgVendorProcessList);

    const handleRowClick = (params) => {
    }

    const handleSubmitClick = () => {
        setLoadPendingSfg(false);
        setSelectAll(false);
        if (selectedType === 'Quarantine') {
            setSelectedItems(selectedSfgVendorProcessList);
        } else {
            setSelectedItems([...selectedSfgVendorProcessList, { id: 'RDL1' }]);
        }
        setSelectedSfgVendorProcessList([])
    }

    const handleSelectAllChange = (event) => {
        setSelectAll(event.target.checked);
        const updatedRows = rowData.map((row) => ({ ...row, select: event.target.checked }));
        let newArray = [...updatedRows];

        setSfgVendorProcessList(newArray);
        if (event.target.checked) {
            setSelectedSfgVendorProcessList(newArray);
        } else {
            setSelectedSfgVendorProcessList([]);
        }
    };

    function Selector(props) {
        const handleChange = (e) => {
            if (e.target.checked) {
                setSelectedSfgVendorProcessList([...selectedSfgVendorProcessList, props.selectedRow]);
            } else {
                const filteredArray = selectedSfgVendorProcessList.filter((item) => item.id !== props.selectedRow.id);
                setSelectedSfgVendorProcessList(filteredArray);
            }

            const updatedList = rowData.map((process) =>
                process.id === props.selectedRow.id
                    ? {
                        ...process,
                        select: e.target.checked
                    }
                    : process
            );
            setSfgVendorProcessList(updatedList);
        }

        return (
            <Checkbox
                checked={props.selectedRow.select}
                onChange={handleChange}
            />
        );
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={loadPendingSfg}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                {selectedType === 'Quarantine' ? 'Select Pending Quarantine' : 'Select Pending SFG'}
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6">
                    <Grid container >
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={rowData}
                                        columns={pendingPoColumns}
                                        pageSize={8}
                                        rowsPerPageOptions={[8]}
                                        onRowClick={handleRowClick}
                                        style={{ border: 'none' }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '43vh',
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
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                        getRowClassName={(params) => {
                                            const rowIndex = sfgVendorProcessList.findIndex(row => row.id === params.row.id);
                                            if (rowIndex !== -1) {
                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return '';
                                        }}


                                    />
                                </CardContent>

                            </Card>
                        </Grid>
                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: supplierSid ? '#002D68' : 'gray', color: supplierSid ? 'white' : '#000000' }}
                            onClick={handleSubmitClick}
                            disabled={supplierSid ? false : true}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setLoadPendingSfg(false);
                                setSelectedSfgVendorProcessList([])
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

export default LoadPendingSfg;
