import { Autocomplete, Button, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { GetOpenPoModalData, CreateDelNote, DeliveryExcelList } from '../../ApiService/LoginPageService';
import PartUploadModule from './PartUploadModule';

const OpenPoModule = ({
    customerSelect,
    setOpenPoOpen,
    openPoOpen,
    DeliveryDate,
    setTypeNo,
    setDispatList,
    DispatchList
}) => {
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [dataList, setDataList] = useState([]);
    const [pageRefresher, setPageRefresher] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [partUpOpen, setPartUplaod] = useState(false);
    const [excelList, setExcelList] = useState([]);

    const [selectedMrnNo, setSelectedMrnNo] = useState('');


    const handleRowSelection = (selectionModel) => {
        // Find the selected rows based on IDs
        const selectedData = dataList.filter(row => selectionModel.includes(row.id));
        setSelectedRows(selectedData);
    };

    // PENDING PO COLUMN
    const pendingPoColumns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'SNo',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'excelId',
            headerClassName: 'super-app-theme--header',
            headerName: 'Excel Id',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'contractNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'Part No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'sheduledDate',
            headerClassName: 'super-app-theme--header',
            headerName: 'Open Po Date',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'Po No',
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
            headerName: 'POQuantity',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'pendQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Pending Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'qty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Shipment Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: true
        },

    ];

    useEffect(() => {
        openPoOpen && GetOpenPoModalData({ date: DeliveryDate, customerId: customerSelect }, handleGetDataSucess, handleGetDataException)
    }, [openPoOpen, pageRefresher])

    const handleGetDataSucess = (dataObject) => {
        setDataList(dataObject.data);
        // setPageRefresher((oldvalue) => !oldvalue);

    }
    const handleGetDataException = () => { }


    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     const isAllFilled = dataList.every((row) => row.qty && row.qty.trim() !== '');

    //     if (!isAllFilled) {
    //         setNotification({
    //             status: true,
    //             type: 'error',
    //             message: 'Please fill out all shipment quantities.',
    //         });
    //         return; // Prevent form submission
    //     }

    //     // Extract timeslot from the first item in dataList (assuming it's the same for all)
    //     const timeslot = dataList.length > 0 ? dataList[0].timeslot : '';

    //     // Prepare the payload, excluding 'timeslot' from the selectedValue
    //     const selectedValue = dataList.map(({ timeslot, ...rest }) => rest);
    //     setDispatList([...DispatchList, ...selectedValue])
    //     setOpenPoOpen(false); // Close the modal

    // };

    ////New submit Code/////
    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if selected rows have Shipment Qty filled
        const isValidSelection = selectedRows.every(row => 
            row.qty !== null && row.qty !== undefined && String(row.qty).trim() !== ''
          );
          
        if (!isValidSelection) {
            setNotification({
                status: true,
                type: 'error',
                message: 'Please ensure selected rows have Shipment Qty filled.',
            });
            return;
        }

        // Prepare the payload
        const updatedDispatchList = [...DispatchList, ...selectedRows];

        setDispatList(updatedDispatchList);
        setOpenPoOpen(false);
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    // const handleCellEdit = (params) => {
    //     console.log("mmmmmmmmmmmmmmmmmmmmmmmm", params)
    //     const updatedList = dataList.map((item) =>
    //         item.id === params.id ?
    //             { ...item, qty: params.qty }
    //             : item
    //     )
    //     setDataList(updatedList);
    // };

    const handleCellEdit = (params) => {
        const updatedList = dataList.map((item) =>
            item.id === params.id ? { ...item, qty: params.qty } : item
        );
        setDataList(updatedList);
    };
    const handleMrnSearchChange = (e) => {
        DeliveryExcelList(
            { code: e.target.value },
            handleDeliveryExcelListItemSucessShow,
            handleDeliveryExcelListItemExceptionShow
        );
    };

    const handleDeliveryExcelListItemSucessShow = (dataObject) => {
        setExcelList(dataObject?.data || []);
    };

    const handleDeliveryExcelListItemExceptionShow = (dataObject, errorMessage) => {
        setNotification({
            status: true,
            type: "error",
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    };
    // const handleSupplierSearchMRNChange = (value) => {
    //     if (value !== null) {
    //         // setSupllierType(value.mrnNo)
    //         setSelectedMrnNo(value.excelId)
    //     }
    //     if (value !== null) {
    //         GetOpenPoModalData({ date: DeliveryDate, customerId: customerSelect, excelId: selectedMrnNo }, handleGetDataSucess, handleGetDataException)
    //     }
    // };
    const handleSupplierSearchMRNChange = (value) => {
        if (value !== null) {
            setSelectedMrnNo(value.excelId); // Keep this to update state
            GetOpenPoModalData(
                {
                    date: DeliveryDate,
                    customerId: customerSelect,
                    excelId: value.excelId // use value directly
                },
                handleGetDataSucess,
                handleGetDataException
            );
        }
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="xl"
            open={openPoOpen}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Open Po
            </DialogTitle>
            <DialogContent>
                {/* <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container >
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '0px', width: '100%', height: '45vh' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={dataList}
                                        columns={pendingPoColumns}
                                        pageSize={8}
                                        rowsPerPageOptions={[8]}
                                        processRowUpdate={handleCellEdit}
                                        style={{ border: 'none', height: '100%' }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '50vh',
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                WebkitTextStrokeWidth: '0.6px',
                                                backgroundColor: '#93bce6',
                                                color: '#1c1919',
                                            },
                                            '& .MuiDataGrid-cell': {
                                                border: '1px solid #969696',
                                            },
                                            '& .MuiDataGrid-columnHeader': {
                                                border: '1px solid #969696', // Add border to column headers
                                            },
                                        }}
                                        getRowClassName={(params) => {
                                            const rowIndex = dataList.findIndex(row => row.id === params.row.id);
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
                            type="submit"
                            disabled={dataList.some((row) => !row.qty || row.qty.trim() === '')}
                        >
                            Submit
                        </Button>

                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setOpenPoOpen(false);
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </form> */}

                {/* New Code For Checkbox Selction */}
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container>
                        <Grid item xs={12} marginTop={0}>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3} style={{ paddingLeft: 6, paddingBottom: 7 }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    value={selectedMrnNo}
                                    options={excelList}
                                    fullWidth
                                    getOptionLabel={(option) => option.excelId || selectedMrnNo}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Search Excel Id"
                                            onChange={handleMrnSearchChange}
                                        />
                                    )}
                                    onChange={(event, value) =>
                                        handleSupplierSearchMRNChange(value)
                                    }
                                    size="small"
                                    style={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: "5px",
                                        flex: 1,
                                    }}
                                />
                            </Grid>
                            {/* <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '0px', width: '100%', height: '100%' }}>
                                <CardContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
                            <DataGrid
                                rows={dataList}
                                columns={pendingPoColumns}
                                pageSize={8}
                                rowsPerPageOptions={[8]}
                                checkboxSelection
                                disableRowSelectionOnClick
                                onRowSelectionModelChange={handleRowSelection}
                                processRowUpdate={handleCellEdit}
                                sx={{
                                    overflow: 'auto',
                                    height: '50vh',
                                    width: '100%',
                                    '& .super-app-theme--header': { backgroundColor: '#93bce6', color: '#1c1919' },
                                    '& .MuiDataGrid-cell': { border: '1px solid #969696' },
                                    '& .MuiDataGrid-columnHeader': { border: '1px solid #969696' }
                                }}
                                rowHeight={40}
                                columnHeaderHeight={40}
                            />
                            {/* </CardContent>
                            </Card> */}
                        </Grid>
                    </Grid>

                    <DialogActions>
                        <Grid item xs={12} sm={12} md={3} style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }} >
                            <Button
                                variant="contained"
                                style={{ width: '200px', height: '40px', background: '#002D68', color: 'white' }}
                                onClick={() => {
                                    setPartUplaod(true);
                                }}
                            >
                                Upload Part No
                            </Button>
                        </Grid>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type="submit"
                            disabled={
                                selectedRows.length === 0 ||
                                selectedRows.some(row => !row.qty && row.qty !== 0)
                              }
                              
                        >
                            Submit
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={() => {
                                setOpenPoOpen(false);
                                setTypeNo(1)
                                setSelectedMrnNo('')
                            }}
                        >
                            Close
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
            <PartUploadModule
                setPageRefresher={setPageRefresher}
                open={partUpOpen}
                setOpen={setPartUplaod}
                customerSelect={customerSelect}
                setExcelList={setSelectedMrnNo}
            />
        </Dialog>
    )
}

export default OpenPoModule
