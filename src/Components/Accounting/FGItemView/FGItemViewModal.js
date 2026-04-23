import React, { useEffect, useState } from 'react';
import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, Autocomplete, InputAdornment, OutlinedInput, ListItemText, RadioGroup, Radio, FormGroup, FormLabel,
} from '@mui/material';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadIcon from '@mui/icons-material/Download';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from "@mui/icons-material/Search";
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { GetFgPoItemLists, UpdateFgPoItemLists } from '../../../ApiService/LoginPageService';

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

const FGItemViewModal = ({
    open, setOpen, setRefreshData, selectedRow
}) => {
    const moduleLocks = JSON.parse(localStorage.getItem("moduleLocks") || "[]");
    const isModuleLocked = moduleLocks.find(
        (m) => m.moduleName === "Multi XML"
    )?.lockStatus === "locked";

    const [fgItemLists, setFgItemLists] = useState([])
    const [editTable, setEditTable] = useState(false);
    const [refresPage, setRefreshPage] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    useEffect(() => {
        open && GetFgPoItemLists({ poId: selectedRow?.poId, poItemsId: selectedRow?.poItemsId }, handleGetItemSuccess, handleGetItemSuccessException)
    }, [open, refresPage])

    const handleGetItemSuccess = (dataObject) => {
        const updatedData = (dataObject?.data || []).map(item => ({
            ...item,
            edited: false,
        }));
        setFgItemLists(updatedData);
    };

    const handleGetItemSuccessException = () => { }

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedArray = fgItemLists
            .filter((item) => item.edited === true) // Filter only selected items
            .map((item) => ({ id: item.id, qty: item.qty })); // Map to their `id` values
        UpdateFgPoItemLists(updatedArray, handleSuccess, handleException);
    };

    const handleSuccess = (dataObject) => {
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
    };

    const ClearData = () => {
        // setOpen(false);
        setRefreshPage((Prev) => !Prev)
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleEdit = (cellNam, newValue, id, rowData) => {
        let updatedItems;

        switch (cellNam) {
            case "Qty":
                updatedItems = fgItemLists.map((supp) =>
                    supp.id === id && cellNam === 'Qty'
                        ? { ...supp, qty: Number(newValue), edited: true }
                        : supp
                );
                break;

        }
        setFgItemLists(updatedItems);
    };


    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { minWidth: '80%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Edit Maped Customer PO & DC
            </DialogTitle>
            <DialogContent style={{ paddingTop: '20px' }}>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '500px', border: '1px solid black', }}>
                                <CardContent>
                                    <table id="customers">
                                        <thead>
                                            <tr>
                                                <th>Part No</th>
                                                <th>Part Name</th>
                                                <th>UOM</th>
                                                <th>Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fgItemLists.map((item, index) => (
                                                <tr key={index}>
                                                    <td contentEditable={false} >
                                                        {item.dcItemCode}
                                                    </td>
                                                    <td contentEditable={false}>{item.itemName}</td>
                                                    <td contentEditable={false}>{item.uom}</td>
                                                    <td contentEditable={editTable} onBlur={(e) => handleEdit('Qty', e.target.textContent, item.id, item)}>{item.qty}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: isModuleLocked ? "gray" : '#002D68', color: 'white' }}
                            onClick={() => setEditTable(true)}
                            disabled={isModuleLocked}
                        >
                            Edit
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            style={{ width: '150px', background: isModuleLocked ? "gray" : '#002D68', color: 'white' }}
                            disabled={isModuleLocked}

                        >
                            Update
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setOpen(false)
                                setEditTable(false)
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

export default FGItemViewModal