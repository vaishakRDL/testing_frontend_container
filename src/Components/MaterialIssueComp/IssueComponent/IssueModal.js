
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    TextField,
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Card,
    CardContent,
    CircularProgress
}
    from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { AllMasterAdd, AllMasterUpdate, GetMaterialDocNumber, GetMaterialGrnNo, GRNIssue } from '../../../ApiService/LoginPageService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';

const IssueModal = (props) => {
    const { issueModalOpen, firstPageRowId, setIssueModalOpen, rowId, itemCode, rawMaterialName, uom, requiredQuantity, selectedRowData, setRefreshData, shelfLifeItem, handleClearPage, fetchMaterialIssueData } = props;

    const [issueDate, setIssueDate] = useState(new Date());
    const [rawMaterial, setRawMaterial] = useState('');
    const [uomFiled, setUOMFiled] = useState('');
    const [quantity, setQuantity] = useState('');
    const [grnId, setGrnId] = useState('');
    const [grnNo, setGrnNo] = useState('');
    const [pbdId, setPbdId] = useState('')
    const [grnDate, setGrnDate] = useState('');
    const [grnQty, setGrnQty] = useState('');
    const [grnType, setGrnType] = useState('');
    const [issueQty, setIssueQty] = useState('');
    const [grnList, setGrnList] = useState([]);
    const [newIssueArray, setNewIssueArray] = useState([]);
    const [quantityTotalCount, setQuantityTotalCount] = useState(0)
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [docNumber, setDocNumber] = useState({ digtit: '', uniqueNo: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setRawMaterial(itemCode);
        setUOMFiled(uom);
        setQuantity(requiredQuantity);
    }, [issueModalOpen]);

    useEffect(() => {
        issueModalOpen && GetMaterialGrnNo({ id: itemCode }, handleGrnSuccess, handleGrnException);
        issueModalOpen && GetMaterialDocNumber(documentNumberSucess, documentNumberException);
    }, [issueModalOpen]);

    const documentNumberSucess = (dataObject) => {
        setDocNumber({ digtit: dataObject?.digtit, uniqueNo: dataObject?.uniqueNo });
    }
    const documentNumberException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    const handleGrnSuccess = (dataObject) => {
        setGrnList(dataObject?.data || []);
    }
    const handleGrnException = (errorObject, errorMessage) => { }

    const columns = [
        {
            field: 'issueDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Issue Date</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'rawMaterial',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Raw Material</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'uomFiled',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        // {
        //     field: 'quantity',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Quantity</span>,
        //     type: 'string',
        //     sortable: true,
        //     minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
        // },
        // {
        //     field: 'quantity',
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Quantity</span>,
        //     minWidth: 80,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',

        //     renderCell: (params) => (
        //         <TextField
        //             variant="standard"
        //             type="number"
        //             value={params.row.quantity}
        //             inputProps={{
        //                 min: 0,
        //                 max: params.row.grnQty, // optional safety
        //             }}
        //             onChange={(e) => handleQuantityEdit(e.target.value, params.row.id)}
        //         />
        //     ),
        // },
        {
            field: 'quantity',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Quantity</span>,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',

            renderCell: (params) => {
                const isLastRow =
                    newIssueArray[newIssueArray.length - 1]?.id === params.row.id;

                return (
                    <TextField
                        variant="standard"
                        type="number"
                        value={params.row.quantity}
                        disabled={!isLastRow} // 🔒 ONLY LAST ROW EDITABLE
                        inputProps={{
                            min: 0,
                            max: params.row.grnQty,
                            step: "any",
                        }}
                        onChange={(e) =>
                            handleQuantityEdit(
                                e.target.value,
                                params.row.id,
                                params.row.grnQty
                            )
                        }
                    />
                );
            },
        },


        {
            field: 'grnNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>GRN No</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50,
            flex: 1,
            align: 'center', headerAlign: 'center'
        },
        {
            field: 'grnDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>GRN Date</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'center', headerAlign: 'center'
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerClassName: 'super-app-theme--header',
        //     headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         <DeleteData selectedRow={params.row} />,
        //     ],
        // },
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
    }

    // const handleQuantityEdit = (value, rowId, grnQty) => {
    //     let qty = Number(value);

    //     // 🔒 Hard stop
    //     if (qty > Number(grnQty)) {
    //         qty = Number(grnQty);
    //     }

    //     if (qty < 0) {
    //         qty = 0;
    //     }
    //     const updatedRows = newIssueArray.map(row =>
    //         row.id === rowId
    //             ? { ...row, quantity: Number(value) }
    //             : row
    //     );
    //     setNewIssueArray(updatedRows);
    // };
    const handleQuantityEdit = (value, rowId, grnQty) => {
        let qty = Number(value);

        if (qty < 0) qty = 0;

        // 🔒 GRN Qty limit
        if (qty > Number(grnQty)) {
            qty = Number(grnQty);
        }

        // 🔒 Total Required Qty limit
        const otherRowsTotal = newIssueArray
            .filter(row => row.id !== rowId)
            .reduce((sum, row) => sum + Number(row.quantity), 0);

        const maxAllowedForRow = Number(quantity) - otherRowsTotal;

        if (qty > maxAllowedForRow) {
            qty = maxAllowedForRow > 0 ? maxAllowedForRow : 0;
        }

        const updatedRows = newIssueArray.map(row =>
            row.id === rowId
                ? { ...row, quantity: qty }
                : row
        );

        setNewIssueArray(updatedRows);
    };


    const handleDeleteRow = (id) => {
        const newArray = newIssueArray.filter((item) => item.id !== id);
        setNewIssueArray(newArray);
        setGrnId('');
    }


    const handleSubmit = (e) => {

        e.preventDefault();
        setLoading(true);
        GRNIssue({
            srnId: rowId,
            data: newIssueArray,
            itemId: selectedRowData.itemId,
            itemCode: selectedRowData.itemCode,
            category: selectedRowData.category,
            docNo: docNumber.digtit,
            issueNo: docNumber.uniqueNo
        }, handleSuccess, handleException);
    }

    const handleSuccess = (dataObject) => {
        fetchMaterialIssueData(firstPageRowId, "");
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClearPage();
            handleClose();
            setRefreshData(prev => !prev)
            setLoading(false);
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
            setLoading(false);
        }, 2000);
    };

    const ClearData = () => {
        setIssueModalOpen(false);
        setNewIssueArray([]);
        setGrnDate('');
        setGrnNo('');
        setPbdId('');
        setGrnId('');
        setGrnList([]);
        setRawMaterial('');
        setUOMFiled('');
        setQuantity('');
        setGrnQty('');
        setIssueQty('');
        setGrnSno([1]);
        setSelectedSno(null);
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleAddClick = () => {
        // const newId = newIssueArray.length + 1;

        // Check if grnId already exists in newIssueArray
        const isDuplicate = newIssueArray.some(issue => issue.id === grnId);

        if (isDuplicate) {
            alert("Issue with this GRN ID already exists!");
            return;
        }
        // selectedRowData
        const newIssue = {
            id: grnId,
            issueDate: formatDate(issueDate),
            rawMaterial: rawMaterial,
            uomFiled: uomFiled,
            quantity: issueQty ? issueQty : grnQty < quantity ? grnQty : quantity,
            // pendingQty: grnQty < quantity ? 0 : grnQty - quantity,
            grnNo: grnNo,
            pbdId: pbdId,
            grnDate: grnDate,
            grnQty: grnQty,
            type: grnType
        };
        setNewIssueArray([...newIssueArray, newIssue]);
        setIssueQty('');
        setGrnSno(prev => [...prev, selectedSno + 1]); // Update state properly

    }

    useEffect(() => {
        const getTotalRowQty = newIssueArray.reduce((acc, cur) => Number(acc) + Number(cur.quantity), 0)
        console.log("getTotalRowQtygetTotalRowQty", getTotalRowQty)
        setQuantityTotalCount(getTotalRowQty)
    }, [newIssueArray])

    const [selectedSno, setSelectedSno] = useState(null)
    const [grnSno, setGrnSno] = useState([1]); // Initialize state

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '60%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={issueModalOpen}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Material Issue
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                            <TextField
                                id="filled-basic"
                                variant="filled"
                                label="Doc No"
                                placeholder="Doc No"
                                value={docNumber?.digtit}
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size='small'
                                readOnly={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                            <TextField
                                id="filled-basic"
                                variant="filled"
                                label="Issue No"
                                placeholder="Issue No"
                                value={docNumber?.uniqueNo}
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size='small'
                                readOnly={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                            <TextField
                                id="filled-basic"
                                label="Issue Date"
                                variant="filled"
                                value={formatDate(issueDate)}
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                placeholder="Issue Date"
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size='small'
                                readOnly={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                            <TextField
                                id="filled-basic"
                                label="Item Code"
                                variant="filled"
                                value={rawMaterial}
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                placeholder="Item Code"
                                size='small'
                                readOnly={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                            <TextField
                                id="filled-basic"
                                label="UOM"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={uomFiled}
                                placeholder="UOM"
                                size='small'
                                readOnly={true}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                            <TextField
                                id="filled-basic"
                                label="Quantity"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={quantity}
                                placeholder="Quantity"
                                size='small'
                                readOnly={true}
                            />
                        </Grid>


                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                            <FormControl fullWidth style={{ marginTop: '8px' }}>
                                <InputLabel id="demo-simple-select-label">GRN No</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={grnId}
                                    label="GRN No"
                                    variant="filled"
                                    onChange={(e) => {
                                        const selectedGrn = grnList.find(data => data?.id === e.target.value);
                                        if (selectedGrn) {
                                            setGrnId(e.target.value);
                                            setGrnNo(selectedGrn?.grnRefNO);
                                            setPbdId(selectedGrn?.pbdId);
                                            setGrnDate(selectedGrn?.grnDate);
                                            setGrnQty(selectedGrn?.poQty);
                                            setGrnType(selectedGrn?.type);
                                            setIssueQty(Math.min(selectedGrn?.poQty, Number(quantity) - Number(quantityTotalCount)));
                                        }
                                    }}
                                    size='small'
                                >
                                    {grnList && grnList.map((data, index) => (
                                        <MenuItem key={data.id} value={data.id}
                                            disabled={!grnSno.includes(data?.sNo)}
                                            onClick={() => {
                                                setSelectedSno(data?.sNo)
                                            }}
                                        >{data.grnRefNO}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>


                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                            <TextField
                                id="filled-basic"
                                label="GRN Date"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={grnDate && formatDate(grnDate)}
                                placeholder="GRN Date"
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size='small'
                                readOnly={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                            <TextField
                                id="filled-basic"
                                label="GRN Qty"
                                variant="filled"
                                sx={{ mb: 1 }}
                                margin="dense"
                                fullWidth
                                required
                                value={grnQty}
                                placeholder="GRN Qty"
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size='small'
                                readOnly={true}
                            />
                        </Grid>

                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                            <FormControl fullWidth style={{ marginTop: '8px' }}>
                                <InputLabel id="demo-simple-select-label">Shelf Life Item</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={shelfLifeItem}
                                    label="Shelf Life Item"
                                    variant="filled"
                                    size='small'
                                    disabled
                                >
                                    <MenuItem value={"Y"}>Y</MenuItem>
                                    <MenuItem value={"N"}>N</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                            <Button
                                variant="contained"
                                style={{ width: '150px', background: Number(quantityTotalCount) < Number(quantity) ? '#002D68' : 'gray', color: 'white' }}
                                onClick={handleAddClick}
                                disabled={grnNo && Number(quantityTotalCount) < Number(quantity) ? false : true}
                            >
                                Add
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%', border: '1px solid gray' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={newIssueArray}
                                        columns={columns}
                                        pageSize={8}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
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
                                        getRowClassName={(params) => {
                                            const rowIndex = newIssueArray.findIndex(row => row.id === params.row.id);
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
                            type='submit'
                            disabled={loading === true}
                        >
                            {/* Issue */}
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : "Issue"}
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                // fetchMaterialIssueData();
                                setIssueModalOpen(false);
                                ClearData();
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

        </Dialog >
    )
}

export default IssueModal

