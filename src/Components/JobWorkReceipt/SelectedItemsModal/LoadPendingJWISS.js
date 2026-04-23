import { Autocomplete, Button, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GetSuppVsItemSuppList, GetSuppVsItemSuppItemList, GetSuppAllAddress, GetSupplierPendingPo, ViewGeneratedJobWorkIssue, ViewSfgVendorProcess, LoadPendingJobWorkIssue } from '../../../ApiService/LoginPageService';

const LoadPendingJWISS = ({ mode, setLoadPendingSfg, loadPendingSfg, withoutPOSupplierId, setSelectedItems, supplierSid, selectedItems }) => {
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
            field: 'spCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SUPPCode</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'spName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SUPPName</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'dcNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>JWISSNo</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'created_at',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>JWISSDate</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SITEMCode</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SITEMName</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false
        },
        {
            field: 'itemGroup',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>ItemGroupCode</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOMCode</span>,
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
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>JWISSQty</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: true
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
                    <span style={{ marginLeft: '5px', fontSize: '16px', fontWeight: 'bold' }}>Select All</span>
                </div>
            ),
            getActions: (params) => [
                <Selector selectedRow={params.row} />,
            ],
        },
    ];
    
    // const activeSupplierId = mode === 'withPO' ? supplierSid : withoutPOSupplierId;
    const activeSupplierId = (mode === 'withPO' ? supplierSid : withoutPOSupplierId)?.toString().replace(/^=+/, '')
    useEffect(() => {
        loadPendingSfg && LoadPendingJobWorkIssue({ spId: activeSupplierId }, handleSucessShow, handleExceptionShow)
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
        // setSelectedItems(selectedSfgVendorProcessList);
    }

    const handleSelectAllChange = (event) => {
        setSelectAll(event.target.checked);
        const updatedRows = rowData.map((row) => ({ ...row, select: event.target.checked }));
        let newArray = [...updatedRows];

        setSfgVendorProcessList(newArray);
        if (event.target.checked) {
            setSelectedItems(newArray);
        } else {
            setSelectedItems([]);
        }
    };

    // function Selector(props) {
    //     const handleChange = (e) => {
    //         if (e.target.checked) {
    //             setSelectedItems([...selectedItems, props.selectedRow]);
    //         } else {
    //             const filteredArray = selectedItems.filter((item) => item.id !== props.selectedRow.id);
    //             setSelectedItems(filteredArray);
    //         }

    //         const updatedList = rowData.map((process) =>
    //             process.id === props.selectedRow.id
    //                 ? {
    //                     ...process,
    //                     select: e.target.checked
    //                 }
    //                 : process
    //         );
    //         setSfgVendorProcessList(updatedList);
    //     }

    //     return (
    //         <Checkbox
    //             checked={props.selectedRow.select}
    //             onChange={handleChange}
    //         />
    //     );
    // }
    function Selector(props) {
    const handleChange = (e) => {
        if (e.target.checked) {
            // ✅ add recievedQty = Qty when selecting
            const cumQty = Number(props.selectedRow.cumQty) || Number(props.selectedRow.Qty);
            const newRow = { ...props.selectedRow, cumQty, recievedQty: props.selectedRow.Qty, pendingQty: Number(props.selectedRow.Qty) - cumQty };

            setSelectedItems([...selectedItems, newRow]);
        } else {
            const filteredArray = selectedItems.filter(
                (item) => item.id !== props.selectedRow.id
            );
            setSelectedItems(filteredArray);
        }

        const updatedList = rowData.map((process) =>
            process.id === props.selectedRow.id
                ? { ...process, select: e.target.checked }
                : process
        );
        setSfgVendorProcessList(updatedList);
    };

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
                Select Pending Job Work Issue
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
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={handleSubmitClick}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setLoadPendingSfg(false);
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

export default LoadPendingJWISS;
