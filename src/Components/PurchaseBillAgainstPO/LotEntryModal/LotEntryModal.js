import { Autocomplete, Button, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, duration, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import { MultiAddressAdd, MultiAddressDataDelete, MultiAddressDataShow, MultiAddressDataUpdate } from '../../ApiService/LoginPageService';
import { GetSuppVsItemSuppList, GetSuppVsItemSuppItemList, GetSuppAllAddress, GetSupplierPendingPo, GetSupplierPendingDC } from '../../../ApiService/LoginPageService';

const LotEntryModal = ({ setLotEntryModalOpen, lotEntryModalOpen, cellData, setSelectedItems, selectedItems, rowData, setRowData }) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [suppAllAddressList, setSuppAllAddressList] = useState([]);
    const [supplierPendingPoList, setSupplierPendingPoList] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedPendingPo, setSelectedPendingPo] = useState([]);

    useEffect(() => {
        if (lotEntryModalOpen) {
            const existingEntry = rowData.find(item => item.id === 1);
            if (!existingEntry && rowData.length === 0) {
                setRowData([...rowData, { id: 1, location: cellData?.location, lotNo: '', lotDate: '', duration: '', expiry: '', lotQty: '', remarks: '' }]);
            }
        }
    }, [lotEntryModalOpen, rowData, cellData]);

    const handleSubmitClick = () => {
        const totalLotQuantity = rowData.reduce((acc, value) => acc + Number(value.lotQty || 0), 0);
        if (Number(cellData./*poQty*/rcvdQty) === Number(totalLotQuantity)) {
            let filteredRowData = rowData.filter(row => row.lotQty !== "" && row.lotQty !== null && row.lotQty !== undefined);
            let updatedItemArray = selectedItems.map(obj => {
                if (obj.id === cellData.id) {
                    return {
                        ...obj,
                        lotQtyData: filteredRowData //HERE IF YOU FACE ANY ISSUE THEN SEND rowData INSTEAD OF filteredRowData
                    };
                } else {
                    return obj;
                }
            });
            setSelectedItems(updatedItemArray);
            setLotEntryModalOpen(false);
            handleClose()
        } else {
            setNotification({
                status: true,
                type: 'error',
                message: "LOT Quantity Must Match Received Quantity",
            });
        }
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleEdit = (cellNam, newValue, id, rowDataItem) => {
        let updatedItems;
        switch (cellNam) {
            case "LOT_NO":
                updatedItems = rowData.map((item) =>
                    item.id === id
                        ? { ...item, lotNo: newValue }
                        : item
                );
                break;
            case "DURATON":
                updatedItems = rowData.map((item) =>
                    item.id === id
                        ? { ...item, duration: Number(newValue), expiry: new Date(new Date(item.lotDate).setMonth(new Date(item.lotDate).getMonth() + Number(newValue))).toLocaleDateString() }
                        : item
                );
                break;
            case "LOT_QTY":
                updatedItems = rowData.map((item) =>
                    item.id === id
                        ? { ...item, lotQty: newValue }
                        : item
                );
                break;
            case "REMARKS":
                updatedItems = rowData.map((item) =>
                    item.id === id
                        ? { ...item, remarks: newValue }
                        : item
                );
                // updatedItems.push({ id: rowDataItem.id + 1 });
                if (rowData.length > 0) {
                    updatedItems.push({ id: rowData[rowData.length - 1].id + 1, location: rowDataItem?.location, });
                }
                break;

            case "LOT_DATE":
                updatedItems = rowData.map((item) =>
                    item.id === id && cellNam === 'LOT_DATE' ?
                        { ...item, lotDate: newValue }
                        : item
                )
                break;

            default:
                updatedItems = rowData;
                break;
        }
        setRowData(updatedItems);
    };

    const handleDeleteRow = (id) => {
        const newArray = rowData.filter((item) => item.id != id)
        setRowData(newArray);
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={lotEntryModalOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                LOT Entry
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" /*onSubmit={handleSubmit}*/>
                    <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '45vh' }}>
                        <CardContent>
                            <Grid container >
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Typography style={{ textAlign: 'left', fontWeight: 'bold', width: '100px' }}>Item</Typography>
                                        <Typography style={{ textAlign: 'left' }}> : {cellData?.itemName}</Typography>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Typography style={{ textAlign: 'left', fontWeight: 'bold', width: '100px' }}>Accept Qty</Typography>
                                        <Typography style={{ textAlign: 'left' }}> : {cellData?.accQty}</Typography>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Typography style={{ textAlign: 'left', fontWeight: 'bold', width: '100px' }}>Location</Typography>
                                        <Typography style={{ textAlign: 'left' }}> : {cellData?.location}</Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2} style={{ height: '300px', overflowY: 'scroll' }}>
                                    <table id="customers">
                                        <thead>
                                            <tr>
                                                {/* <th>SINo</th> */}
                                                <th>Location</th>
                                                <th>LOT No</th>
                                                <th>LOT Date</th>
                                                <th>Duration(Month)</th>
                                                <th>Expiry</th>
                                                <th>LOT Qty</th>
                                                <th>Remarks</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rowData.length > 0 && rowData.map((item, index) => (
                                                <tr key={index}>
                                                    {/* <td contentEditable={true}>{item.id}</td> */}
                                                    <td contentEditable={true}>{item.location}</td>
                                                    <td contentEditable={true} onBlur={(e) => handleEdit('LOT_NO', e.target.textContent, item.id, item)}>{item.lotNo}</td>
                                                    <td style={{ whiteSpace: 'nowrap' }} contentEditable={true}>
                                                        <TextField
                                                            value={item.lotDate}
                                                            type='date'
                                                            placeholder='Sch Date'
                                                            size='small'
                                                            onChange={(e) => handleEdit('LOT_DATE', e.target.value, item.id, item)}
                                                        />
                                                    </td>
                                                    <td contentEditable={true} onBlur={(e) => handleEdit('DURATON', e.target.textContent, item.id, item)}>{item.duration}</td>
                                                    <td contentEditable={true} /*onBlur={(e) => handleEdit('Remarks', e.target.textContent, item.id, item)}*/>{item.expiry}</td>
                                                    <td contentEditable={true} onBlur={(e) => handleEdit('LOT_QTY', e.target.textContent, item.id, item)}>{item.lotQty}</td>
                                                    <td contentEditable={true} onBlur={(e) => handleEdit('REMARKS', e.target.textContent, item.id, item)}>{item.remarks}</td>
                                                    <td contentEditable={false} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                        <DeleteIcon
                                                            onClick={() => {
                                                                handleDeleteRow(item.id)
                                                            }}
                                                            style={{ color: 'black', cursor: 'pointer' }}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Grid>
                            </Grid>
                        </CardContent>

                    </Card>

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
                                setLotEntryModalOpen(false);
                                // ClearData();
                                setRowData([]);
                                handleClose()
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

export default LotEntryModal
