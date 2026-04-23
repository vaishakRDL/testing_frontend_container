import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { OrderOList, SaleOrderFetch, SaleOrderSplit } from '../../../ApiService/LoginPageService';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';

const SplitOrderModule = ({ setOpen, open, seletedItemList, setSeletedItemList, selectSalesId, selectDetails,setRefreshData }) => {
    const [SplitOrderQty, setSplitOrderQty] = useState('');
    const [ParentOrderQty, setParentOrderQty] = useState('');
    const [isNext, setIsNext] = useState(false);
    const [arrayList, setArrayList] = useState([]);
    const [itemDetail, setItemDetail] = useState([]);
    const [kanbanDate, setkanbanDate] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    useEffect(() => {
        if (open) {
            OrderOList({
                id: selectSalesId
            }, handleSaleOrderFetch, handleSaleOrderFetchException);

            // SaleOrderFetch({
            //     saleId: selectSalesId
            // }, handleSaleOrderFetch, handleSaleOrderFetchException);
        }

    }, [open, selectSalesId]);

    const handleSaleOrderFetch = (dataObject) => {
        setItemDetail(dataObject?.data || []);
    }

    const handleSaleOrderFetchException = () => {

    }

    // console.log("seletedItemListseletedItemList",selectDetails);

    const handleSubmit = (e) => {
        e.preventDefault();

        SaleOrderSplit({
            arrayList,
            kanbanDate: kanbanDate,
            orderPlnId: selectSalesId
        }, handleSaleOrderSplitSucess, handleSaleOrderSplitException);

    };

    const handleSaleOrderSplitSucess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            setRefreshData((oldvalue)=>!oldvalue);
            handleClose();
        }, 2000);
    }

    const handleSaleOrderSplitException = () => {

    }

    const ClearData = () => {
        setSplitOrderQty('');
        setParentOrderQty('');
        setIsNext(false);
        setArrayList([]);
        setItemDetail([]);
        setkanbanDate('');
        setOpen(false);
    }
    const columns = [
        {
            field: 'slNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item | Part No
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item | Part Name
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Order Qty
                </span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'actions',
            headerClassName: 'super-app-theme--header',
            type: 'actions',
            flex: 1,
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span >,
            minWidth: 100, maxWidth: 600,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <RowSelectAction selectedRow={params.row} />,
            ],
        },
    ];

    const columns2 = [
        {
            field: 'slNo',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemCode',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item | Part No
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'itemName',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Item | Part Name
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 50, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'Qty',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Order Qty
                </span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'value',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Split Order Qty
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false,
            renderCell: (params) => [
                <FieldsAction selectedRow={params.row} />,
            ],
        },
        {
            field: ' Parent Order Qty',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Parent Order Qty
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: false,
            renderCell: (params) => [
                <FieldsAction selectedRow={params.row} />,
            ],
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Actions
        //         </span >,
        //     minWidth: 350, maxWidth: 600,
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,

        //     getActions: (params) => [
        //         <RowSelectAction selectedRow={params.row} />,
        //         <SelectAction selectedRow={params.row} />,
        //         <DeleteData selectedRow={params.row} />,
        //     ],
        // },
    ];

    function FieldsAction(props) {
        return (

            <TextField
                id="filled-basic"
                fullWidth
                value={SplitOrderQty}
                onChange={(e) => {
                    // setSplitOrderQty(e.target.value)
                    // setParentOrderQty(props.selectedRow.Qty-e.target.value)
                }
                }
            />
        )
    }

    function FieldsAction2(props) {
        return (

            <TextField
                id="filled-basic"
                fullWidth
                value={ParentOrderQty}
            // onChange={(e) => setPaymentTerms(e.target.value)}
            />
        )
    }


    function RowSelectAction(props) {

        const onSelectedItem = () => {
            setArrayList((prevArrayList) => {
                const isRowSelected = prevArrayList.some(item => item.id === props.selectedRow.id);

                if (isRowSelected) {
                    return prevArrayList.filter(item => item.id !== props.selectedRow.id);
                } else {
                    return [...prevArrayList, props.selectedRow];
                }
            });
        }

        return (
            <div style={{ display: 'flex' }}>
                <Checkbox {...label}
                    checked={arrayList.some(item => item.id === props.selectedRow.id)}
                    onClick={onSelectedItem}
                />
            </div>
        );
    }

    const handleSplit = (e, index) => {
        const updatedArray = [...arrayList];
        const inputValue = parseInt(e.target.value, 10);
        if (!isNaN(inputValue) && inputValue <= updatedArray[index].Qty) {
            updatedArray[index].splitOrderQty = inputValue;
            updatedArray[index].ParentOrderQty = updatedArray[index].Qty - inputValue;
            setArrayList(updatedArray);
        } else {
            updatedArray[index].splitOrderQty = '0'; // Resetting splitOrderQty to '0'
            console.log('Invalid input value or greater than Qty');
            setNotification({
                status: true,
                type: 'error',
                message: 'Invalid input value or greater than Qty',
            });
            setTimeout(() => {
                // handleClose();
            }, 2000);
        }
    };


    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={open}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* {isAddButton ? 'Add Sales Order' : 'Edit Sales Order'} */}
                Split Order
            </DialogTitle>
            <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                <DialogContent>
                    {/* {
                        seletedItemList.map((data, index) => (
                            <Grid key={index}>
                                <Grid container spacing={2}>
                                    <Grid item md={6}>
                                        <TextField
                                            id="filled-basic"
                                            label="PO | Contract ref"
                                            variant="filled"
                                            fullWidth
                                            required
                                            placeholder="PO | Contract ref"
                                        />
                                    </Grid>
                                    <Grid item md={6}>
                                        <TextField
                                            id="filled-basic"
                                            label="PO | Contract ref"
                                            variant="filled"
                                            fullWidth
                                            required
                                            placeholder="PO | Contract ref"
                                        />
                                    </Grid>

                                </Grid>

                            </Grid>
                        ))
                        
                    } */}
                    <Grid container spacing={2}>
                        <Grid item md={3}>
                            <TextField
                                id="filled-basic"
                                label="Type Of Order"
                                variant="filled"
                                fullWidth
                                // required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={selectDetails.typeOfOrder}
                                placeholder="Type Of Order"
                            />
                        </Grid>
                        <Grid item md={3}>
                            <TextField
                                id="filled-basic"
                                label="PO Ref"
                                variant="filled"
                                fullWidth
                                // required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={selectDetails.poRef}
                                placeholder="PO Ref"
                            />
                        </Grid>
                        <Grid item md={3}>
                            <TextField
                                id="filled-basic"
                                label="Customer Name"
                                variant="filled"
                                fullWidth
                                // required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={selectDetails.cName}
                                placeholder="Customer Name"
                            />
                        </Grid>
                        <Grid item md={3}>
                            <TextField
                                id="filled-basic"
                                label="Kanban Data"
                                variant="filled"
                                fullWidth
                                // required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={selectDetails.devliveryDate}
                                placeholder="Kanban Data"
                            />
                        </Grid>
                        {
                            !isNext ? (
                                <>
                                    <Grid item md={12}>
                                        <DataGrid
                                            rows={itemDetail}
                                            columns={columns}
                                            pageSize={8}
                                            // loading={isLoading}
                                            rowsPerPageOptions={[8]}
                                            disableSelectionOnClick
                                            style={{ border: 'none', fontWeight: 'bold', overflowY: 'scroll' }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '55vh',
                                                // minHeight: '500px',
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
                                                // Find the index of the row within the rows array
                                                const rowIndex = itemDetail.findIndex(row => row.id === params.row.id);
                                                // Check if the index is valid
                                                if (rowIndex !== -1) {
                                                    console.log(' ');
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return ''; // Return default class if index is not found
                                            }}
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                        />

                                    </Grid>
                                    {/* 
                                    <Grid item md={4} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Grid container spacing={2}>
                                            <Grid item md={12}>
                                                <Button variant="contained"
                                                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                                                >
                                                    Cancel
                                                </Button>
                                            </Grid>
                                            <Grid item md={12} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Button variant="contained"
                                                    style={{ width: '150px', background: '#002D68', color: 'white' }}
                                                    onClick={() => {
                                                        setIsNext(true);
                                                    }}
                                                >
                                                    Next
                                                </Button>
                                            </Grid>

                                        </Grid>
                                    </Grid> */}
                                </>
                            ) : (
                                isNext ?
                                    (

                                        <>
                                            <Grid item md={10}>
                                                {/* <DataGrid
                                                    rows={arrayList}
                                                    columns={columns2}
                                                    pageSize={8}
                                                    // loading={isLoading}
                                                    rowsPerPageOptions={[8]}
                                                    disableSelectionOnClick
                                                    style={{ border: 'none', }}
                                                    sx={{
                                                        overflow: 'auto',
                                                        height: '55vh',
                                                        // minHeight: '500px',
                                                        width: '100%',
                                                        '& .super-app-theme--header': {
                                                            WebkitTextStrokeWidth: '0.6px',

                                                        },
                                                    }}
                                                /> */}
                                                <div className="table-container" style={{ height: '400px', overflow: 'auto' }}>
                                                    <table style={{ overflow: 'auto', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                                                        <thead>
                                                            <tr>
                                                                <th style={{ border: '2px solid #ddd', width: '30px', height: '50px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                        S.No
                                                                    </div>
                                                                </th>
                                                                <th style={{ border: '2px solid #ddd', width: '150px', height: '50px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                        Item | Part No
                                                                    </div>
                                                                </th>
                                                                <th style={{ border: '2px solid #ddd', width: '195px', height: '50px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                        Item | Part Name

                                                                    </div>
                                                                </th>
                                                                <th style={{ border: '2px solid #ddd', width: '100px', height: '50px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                        Order Qty

                                                                    </div>
                                                                </th>
                                                                <th style={{ border: '2px solid #ddd', width: '150px', height: '50px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                        Split Order Qty
                                                                    </div>
                                                                </th>
                                                                <th style={{ border: '2px solid #ddd', width: '180px', height: '50px' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                        Parent Order Qty
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody style={{ height: '300px', width: '500px', border: '1px solid #ddd' }}>
                                                            {arrayList.map((row, index) => (
                                                                <tr key={index} style={{ border: '1px solid #ddd' }}>
                                                                    <td style={{ width: '200px', border: '1px solid #ddd' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                            {row.sNo}
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ maxWidth: '250px', width: '250px', border: '1px solid #ddd', overflow: 'auto', height: '20px' }}>
                                                                        {row.itemCode}
                                                                    </td>
                                                                    <td style={{ maxWidth: '250px', width: '250px', border: '1px solid #ddd', overflow: 'auto', height: '20px' }}>
                                                                        {row.itemName}
                                                                    </td>
                                                                    <td style={{ maxWidth: '250px', width: '250px', border: '1px solid #ddd', overflow: 'auto', height: '20px' }}>
                                                                        {row.Qty}
                                                                    </td>
                                                                    <td style={{ maxWidth: '250px', width: '250px', border: '1px solid #ddd', overflow: 'auto', height: '20px' }}>
                                                                        <span>
                                                                            <TextField
                                                                                // id={`splitOrderQty-${index}`}
                                                                                // value={SplitOrderQty}
                                                                                variant="standard"
                                                                                fullWidth
                                                                                placeholder="Split Order Qty"
                                                                                // onChange={(e) => {
                                                                                //     setSplitOrderQty(()=>{
                                                                                //         if(e.target.value < row.Qty)  {

                                                                                //          return  e.target.value
                                                                                //         }else{
                                                                                //             return  "Split Order Qty is More"
                                                                                //         }
                                                                                //     }
                                                                                //     )
                                                                                //     setParentOrderQty(row.Qty - e.target.value);
                                                                                // }}
                                                                                onChange={(e) => handleSplit(e, index)}

                                                                            />
                                                                        </span>
                                                                    </td>
                                                                    <td style={{ maxWidth: '250px', width: '250px', border: '1px solid #ddd', overflow: 'auto', height: '20px' }}>
                                                                        <span>
                                                                            {/* <TextField
                                                                                id={`parentOrderQty-${index}`}
                                                                                value={ParentOrderQty}
                                                                                variant="standard"
                                                                                disabled={true}
                                                                                fullWidth
                                                                                placeholder="Parent Order Qty"
                                                                            /> */}
                                                                            {row?.ParentOrderQty === 0 ? '0' : row?.splitOrderQty === '' ? row.Qty : row?.ParentOrderQty || row.Qty}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                </div>
                                            </Grid>

                                            <Grid item md={2} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Grid container spacing={2}>
                                                    <Grid item md={12}>
                                                        <TextField
                                                            id="filled-basic"
                                                            label="Seleted Kanban Data"
                                                            variant="filled"
                                                            type='date'
                                                            fullWidth
                                                            value={kanbanDate}
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            required
                                                            placeholder="Kanban Data"
                                                            onChange={(e) => setkanbanDate(e.target.value)}
                                                        />
                                                    </Grid>
                                                    <Grid item md={12} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}>
                                                        <Button variant="contained"

                                                            type="submit"
                                                            style={{ width: '200px', background: '#002D68', color: 'white' }}
                                                        >
                                                            Place Order
                                                        </Button>
                                                    </Grid>

                                                </Grid>
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                        </>
                                    )
                            )

                        }

                    </Grid>
                </DialogContent>
                <DialogActions>

                    {/* {
                        isNext ?
                            <>
                                <Button
                                    variant="contained"
                                    style={{ width: '200px', background: '#002D68', color: 'white' }}
                                    onClick={() => {
                                        setArrayList([]);
                                        setIsNext(false);
                                    }}
                                >
                                 
                                </Button>
                            </> :
                            <>
                            </>
                    } */}

                    <Button
                        variant="contained"
                        style={{ width: '200px', background: '#002D68', color: 'white' }}
                        onClick={() => {
                            setIsNext((oldvalue) => !oldvalue);

                        }}

                    >
                        {
                            !isNext ? 'Next' : '   Back'
                        }

                    </Button>

                    <Button
                        variant="contained"
                        style={{ width: '150px', background: '#002D68', color: 'white' }}
                        onClick={(e) => {
                            setOpen(false);
                            setIsNext(false);
                            setSeletedItemList([]);
                            setArrayList([]);
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </form>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

        </Dialog>
    )
}

export default SplitOrderModule
