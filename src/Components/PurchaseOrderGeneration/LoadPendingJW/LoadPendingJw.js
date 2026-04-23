import { Autocomplete, Button, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import { MultiAddressAdd, MultiAddressDataDelete, MultiAddressDataShow, MultiAddressDataUpdate } from '../../ApiService/LoginPageService';
import { GetSuppVsItemSuppList, GetSuppVsItemSuppItemList, GetSuppAllAddress, GetSupplierPendingPo, GetSupplierPendingDC, GetPendingDcItems } from '../../../ApiService/LoginPageService';

const LoadPendingJw = ({ pendingPOModalOpen, setPendingPOModalOpen, setBillingAddress, supplierSid, globleId, setSupplierItemList, supplierId, setSelectedItems, selectedItems, pruchaseOrderDigit, genPoBillFlag, poType, calculateTotals }) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [suppAllAddressList, setSuppAllAddressList] = useState([]);
    const [supplierPendingPoList, setSupplierPendingPoList] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedPendingPo, setSelectedPendingPo] = useState([]);
    console.log("supplierIdsupplierIdsupplierIdsupplierIdsupplierId", supplierId);

    // PENDING PO COLUMN
    const pendingPoColumns = [
        {
            field: 'spCode',
            headerClassName: 'super-app-theme--header',
            headerName: 'SUPP Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'suppName',
            headerClassName: 'super-app-theme--header',
            headerName: 'SUPPName',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: 'SITEMCode',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: 'SITEM Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: 'UOM Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'JW Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
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

    const handleSelectAllChange = (event) => {
        setSelectAll(event.target.checked);
        const updatedRows = supplierPendingPoList.map((row) => ({ ...row, select: event.target.checked }));
        let newArray = [...updatedRows];

        setSupplierPendingPoList(newArray);
        if (event.target.checked) {
            setSelectedPendingPo(newArray);
        } else {
            setSelectedPendingPo([]);
        }
    };

    function Selector(props) {
        const handleChange = (e) => {
            if (e.target.checked) {
                setSelectedPendingPo([...selectedPendingPo, props.selectedRow]);
            } else {
                const filteredArray = selectedPendingPo.filter((item) => item.id !== props.selectedRow.id);
                setSelectedPendingPo(filteredArray);
            }

            const updatedList = supplierPendingPoList.map((process) =>
                process.id === props.selectedRow.id
                    ? {
                        ...process,
                        select: e.target.checked
                    }
                    : process
            );
            setSupplierPendingPoList(updatedList);
        }

        return (
            <Checkbox
                checked={props.selectedRow.select}
                onChange={handleChange}
            />
        );
    }

    useEffect(() => {
        pendingPOModalOpen && GetPendingDcItems({ id: supplierId }, handleSuppPOSucessShow, handleSuppPOExceptionShow);
    }, [pendingPOModalOpen])

    // GET SUPPLIER LIST
    const handleSuppPOSucessShow = (dataObject) => {
        setSupplierPendingPoList(dataObject?.data || []);
    }
    const handleSuppPOExceptionShow = (errorObject, errorMessage) => {
    }

    const handleRowClick = (params) => {
        // console.log("handleRowClick", params.row)
        // setSelectedItems([...selectedItems, params.row]);
        // // setBillingAddress(params.row.address);
        // setPendingPOModalOpen(false);
    }

    const handleSubmitClick = () => {
        setPendingPOModalOpen(false);
        setSelectAll(false);
        // setSelectedItems(selectedPendingPo);
        // calculateTotals(selectedPendingPo);
        // Calculate amount and update selected items
        const updatedSelectedItems = selectedPendingPo.map(item => ({
            ...item,
            amt: Number(item.poQty) * parseFloat(item.rate) // Ensure rate is treated as a number
        }));
        setSelectedItems(updatedSelectedItems);
        calculateTotals(updatedSelectedItems);
        setTimeout(() => {
            setSelectedPendingPo([])
        }, 1000)
    }
// const handleSubmitClick = () => {
//     // Calculate amount for new items
//     const updatedNewItems = selectedPendingPo.map(item => ({
//         ...item,
//         amt: Number(item.poQty) * parseFloat(item.rate || 0)
//     }));

//     // Merge new items with existing ones from parent
//     const mergedItems = [...selectedItems, ...updatedNewItems];
    
//     // Update parent with merged items
//     setSelectedItems(mergedItems);
//     calculateTotals(mergedItems);
    
//     // Close dialog and reset states
//     setPendingPOModalOpen(false);
//     setSelectAll(false);
//     setSelectedPendingPo([]);
// }
    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={pendingPOModalOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Select Pending DC
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" /*onSubmit={handleSubmit}*/>
                    <Grid container >
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={supplierPendingPoList}
                                        columns={pendingPoColumns}
                                        pageSize={8}
                                        // selectionModel={selectionModel}
                                        // onSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
                                        rowsPerPageOptions={[8]}
                                        // disableSelectionOnClick
                                        onRowClick={handleRowClick} // Add this line to handle row clicks
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
                                                border: '1px solid #969696', // Add border to column headers
                                            },
                                        }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                        getRowClassName={(params) => {
                                            const rowIndex = supplierPendingPoList.findIndex(row => row.id === params.row.id);
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
                            // type="submit"
                            onClick={handleSubmitClick}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setPendingPOModalOpen(false);
                                setSelectedPendingPo([]);
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
        </Dialog>
    )
}

export default LoadPendingJw
