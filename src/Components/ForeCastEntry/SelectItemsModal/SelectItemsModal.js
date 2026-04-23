import { Autocomplete, Button, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import { MultiAddressAdd, MultiAddressDataDelete, MultiAddressDataShow, MultiAddressDataUpdate } from '../../ApiService/LoginPageService';
import { GetSuppVsItemSuppList, GetSuppVsItemSuppItemList, GetSuppAllAddress, GetFcSupplierItemList } from '../../../ApiService/LoginPageService';

const SelectItemsModal = ({
    selectItemsModalOpen,
    setSelectItemsModalOpen,
    setSuppAddress,
    supplierId,
    globleId,
    setSupplierItemList,
    setSelectedItems,
    selectedItems,
    fromConsumptionDate,
    toConsumptionDate,
    consumptionInDays
}) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [suppAllAddressList, setSuppAllAddressList] = useState([])
    const [supplierFcItemList, setSupplierFcItemList] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedPendingPo, setSelectedPendingPo] = useState([]);

    // PENDING PO COLUMN
    const pendingPoColumns = [
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: 'SItem Code',
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
            headerName: 'SItem Name',
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
        const updatedRows = supplierFcItemList.map((row) => ({ ...row, select: event.target.checked }));
        let newArray = [...updatedRows];

        setSupplierFcItemList(newArray);
        if (event.target.checked) {
            setSelectedItems(newArray);
        } else {
            setSelectedItems([]);
        }
    };

    function Selector(props) {
        const handleChange = (e) => {
            if (e.target.checked) {
                setSelectedItems([...selectedItems, props.selectedRow]);
            } else {
                const filteredArray = selectedItems.filter((item) => item.id !== props.selectedRow.id);
                setSelectedItems(filteredArray);
            }

            const updatedList = supplierFcItemList.map((process) =>
                process.id === props.selectedRow.id
                    ? {
                        ...process,
                        select: e.target.checked
                    }
                    : process
            );
            setSupplierFcItemList(updatedList);
        }

        return (
            <Checkbox
                checked={props.selectedRow.select}
                onChange={handleChange}
            />
        );
    }

    const Address = [{
        id: 1,
        Address: 'udupi'
    }]

    useEffect(() => {
        // changeAddressModalOpen && GetSuppAllAddress({ sId: supplierSid }, handleGetSuppVsItemSuppListSucessShow, handleGetSuppVsItemSuppListExceptionShow);
        selectItemsModalOpen && GetFcSupplierItemList({ id: supplierId, day: consumptionInDays, from: fromConsumptionDate, to: toConsumptionDate }, handleGetSuppItemListSucessShow, handleGetSuppItemListExceptionShow);
    }, [selectItemsModalOpen])

    const handleGetSuppItemListSucessShow = (dataObject) => {
        setSupplierFcItemList(dataObject?.data || []);
        console.log("dataObject", dataObject)
    }
    const handleGetSuppItemListExceptionShow = (errorObject, errorMessage) => {
    }

    const handleRowClick = (params) => {
        console.log("handleRowClick", params)
        setSuppAddress(params.row.address);
        setSelectItemsModalOpen(false);
    }

    const handleSubmitClick = () => {
        setSelectItemsModalOpen(false);
        setSelectAll(false);
        setSelectedItems(selectedItems);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={selectItemsModalOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Select [Multiple] Items
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" /*onSubmit={handleSubmit}*/>
                    <Grid container >
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '0px', width: '100%', height: '45vh' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={supplierFcItemList}
                                        columns={pendingPoColumns}
                                        pageSize={8}
                                        // selectionModel={selectionModel}
                                        // onSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
                                        rowsPerPageOptions={[8]}
                                        // disableSelectionOnClick
                                        onRowClick={handleRowClick} // Add this line to handle row clicks
                                        style={{ border: 'none' }}
                                        sx={{
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
                                            const rowIndex = supplierFcItemList.findIndex(row => row.id === params.row.id);
                                            if (rowIndex !== -1) {
                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return '';
                                        }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
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
                            OK
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setSelectItemsModalOpen(false);
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

export default SelectItemsModal
