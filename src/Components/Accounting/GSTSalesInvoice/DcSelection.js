import { Button, Card, CardContent, Checkbox, Grid, TextField, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DcSelectionGst, DcSelectionGstLoad, LoadPendingGstDc } from '../../../ApiService/LoginPageService';

const DcSelection = ({ setDcSelectionFlag, cId, PreviousSetSelectedItems, PreviousSelectedItems, selectedPoItemIds, setDcSelectionData }) => {
    const [dcColumns, setDcColumns] = useState('');
    const [dcColumns2, setDcColumns2] = useState('');
    const [dcColumns3, setDcColumns3] = useState('');
    const [dcColumns4, setDcColumns4] = useState('');
    const [dcColumns5, setDcColumns5] = useState('');
    const [rows, setRows] = useState('');
    const [rows3, setRows3] = useState('');
    const [rows4, setRows4] = useState('');
    const [rows5, setRows5] = useState([]);
    const [showDataDcGrids, setShowDataDcGrids] = useState(false);
    const [showMainDataGrid, setShowMainDataGrid] = useState(true);
    const [refreshData, setRefreshData] = useState(false);
    const [dcValue, setDcValue] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const location = useLocation();

    const handleLoadClick = () => {
        setShowDataDcGrids(true);
        setShowMainDataGrid(false);
        // DcSelectionGstLoad({ id: cId }, handleGSTLoadDcsShow, handleGSTLoadDcException);
        const updatedSelectedPoItemIds = selectedPoItemIds.map((item) => item.id)
        LoadPendingGstDc({ id: cId, poItemId: updatedSelectedPoItemIds }, handleGSTLoadDcsShow, handleGSTLoadDcException);
    };

    const calculateTotalAmount = (data) => {
        if (!Array.isArray(data)) return 0;
        return data.reduce((total, item) => total + parseFloat(item.amt || 0), 0);
    };

    const handleGSTLoadDcsShow = (dataObject) => {
        setRows4(dataObject?.data || []);
    }

    const handleGSTLoadDcException = (errorObject, errorMessage) => {
        console.log(errorMessage);
    }
    const handleRow5Success = (dataObject) => {
        setRows5(dataObject?.data || []);
    }

    const handleRow5Exception = (errorObject, errorMessage) => {
        console.log(errorMessage);
    }

    const handleOkClick = () => {
        setShowMainDataGrid(false);
        setShowDataDcGrids(false);
        setTimeout(() => setShowMainDataGrid(true), 0);
        let updatedData = rows5
            .filter(item => item.selected === true)
            .map(item => ({ ...item }));
        // setRows3(rows5);
        setRows3(updatedData);
    };

    const handleCheckboxChange = (event, params) => {
        const { checked } = event.target;
        console.log('Checkbox value changed:', checked, 'for row:', params.row.id);
        if (checked) {
            // setRows5([...rows5, params.row]);
            DcSelectionGstLoad({ id: params.row.id }, handleRow5Success, handleRow5Exception);
        } else {
            const filterdArray = rows5.filter((item) => item.id !== params.row.id)
            console.log("filterdArray", filterdArray)
            setRows5(filterdArray);
        }
    };

    const handleOkMainClick = () => {
        setDcSelectionFlag(false);
        const transformedItems = rows3.map(item => ({
            ...item,
            itemCode: `${item.itemCode}-DC`,
        }));

        // const clonedSelectedItems = [...PreviousSelectedItems];
        // const lastObj = clonedSelectedItems.pop();
        // clonedSelectedItems.push(...transformedItems, lastObj);
        // PreviousSetSelectedItems(clonedSelectedItems);
        setDcSelectionData(transformedItems || []);
    };


    useEffect(() => {
        DcSelectionGst({ id: cId, poItemId: selectedPoItemIds }, handleGSTSalesShow, handleGSTSalesShowException);
    }, [refreshData]);


    const handleGSTSalesShow = (dataObject) => {
        setDcColumns(dataObject?.data || []);
        setRows(dataObject?.data || []);
    }

    const handleGSTSalesShowException = (errorObject, errorMessage) => {
        console.log(errorMessage);
    }

    const columns = [
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: 'Dc Item',
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
            headerName: 'Total Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'shortage',
            headerClassName: 'super-app-theme--header',
            headerName: 'Shortage',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
    ]

    const columns1 = [
        {
            field: 'sodigit',
            headerClassName: 'super-app-theme--header',
            headerName: 'SO No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'fgitemCode',
            headerClassName: 'super-app-theme--header',
            headerName: 'FGItem Code',
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
            headerName: 'DCItem Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'reqQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Req Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cumQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Cum Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'balQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Bal Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
    ]

    const columns3 = [
        {
            field: 'slNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'SlNo',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cust_Dc_no',
            headerClassName: 'super-app-theme--header',
            headerName: 'DC No',
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
            headerName: 'CDC Po No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cdcNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'Cust Dc No',
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
            headerName: 'Item Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            valueGetter: (params) => `${params.row.itemCode}-DC`,
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: 'Item Desc',
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
            headerName: 'Pend Qty',
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
            headerName: 'Uom',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'adjQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Adj Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'stdRate',
            headerClassName: 'super-app-theme--header',
            headerName: 'Rate',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'amt',
            headerClassName: 'super-app-theme--header',
            headerName: 'Amount',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
    ]

    const columns4 = [
        {
            field: 'sel',
            headerClassName: 'super-app-theme--header',
            headerName: 'Sel',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.value}
                    onChange={(event) => handleCheckboxChange(event, params)}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            ),
        },
        {
            field: 'cust_Dc_no',
            headerClassName: 'super-app-theme--header',
            headerName: 'Cust Ref No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'customerDcDate',
            headerClassName: 'super-app-theme--header',
            headerName: 'CDC Date',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cdcNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'CDC No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
    ]

    const columns5 = [
        {
            field: 'sel',
            headerClassName: 'super-app-theme--header',
            headerName: 'Sel',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.selected}
                    disabled={true}
                    // onChange={(event) => handleAutoAdjustCheckboxChange(event, params)}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            ),
        },
        {
            field: 'cdcNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'DC No',
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
            headerName: 'Item Code',
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
            headerName: 'Item Desc',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'po_ref',
            headerClassName: 'super-app-theme--header',
            headerName: 'CDC PoNo',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'Qty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Dc Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'cumInvQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Cum Inv Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'balQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Bal Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'stdRate',
            headerClassName: 'super-app-theme--header',
            headerName: 'Dc Rate',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'adjQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Adj Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
    ]

    const handleAutoAdjustCheckboxChange = (event, params) => {
        let updatedData = rows5.map(item => {
            return item.flag === 0 ? { ...item, selected: true } : item;
        });
        setRows5(updatedData);
    }

    const navigate = useNavigate();
    const handleCancel = () => {
        // navigate("/NewGstInvoice");
        setDcSelectionFlag(false);
    };

    useEffect(() => {
        const totalAmount = calculateTotalAmount(rows3);
        setDcValue(totalAmount.toString());
    }, [rows3]);

    const handleAllItemsClick = () => {
        setRows5(rows4);
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    DC Selection
                </Typography>
            </div>
            <form>
                <Grid container spacing={1} padding={1}>
                    <Grid item xs={12} sm={4} md={4} lg={4} xl={4} marginTop={1}>
                        <Card style={{ borderRadius: '10px', width: '100%', height: '23vh' }}>
                            <CardContent>
                                <DataGrid
                                    rows={dcColumns}
                                    columns={columns}
                                    pageSize={8}
                                    rowsPerPageOptions={[8]}
                                    style={{ border: 'none', height: '200px' }}
                                    sx={{
                                        '& .super-app-theme--header': {
                                            WebkitTextStrokeWidth: '0.6px',
                                            backgroundColor: '#93bce6',
                                            color: '#1c1919',
                                            cursor: 'pointer'
                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696',
                                            cursor: 'pointer'
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696',
                                            cursor: 'pointer'
                                        },
                                    }}
                                    rowHeight={30}
                                    columnHeaderHeight={30}
                                />
                            </CardContent>
                        </Card>

                    </Grid>
                    <Grid item xs={12} sm={8} md={8} lg={8} xl={8} marginTop={1}>
                        <Card style={{ borderRadius: '10px', width: '100%', height: '23vh' }}>
                            <CardContent>
                                <DataGrid
                                    rows={dcColumns}
                                    columns={columns1}
                                    pageSize={8}
                                    rowsPerPageOptions={[8]}
                                    style={{ border: 'none', height: '200px' }}
                                    sx={{
                                        '& .super-app-theme--header': {
                                            WebkitTextStrokeWidth: '0.6px',
                                            backgroundColor: '#93bce6',
                                            color: '#1c1919',
                                            cursor: 'pointer'
                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696',
                                            cursor: 'pointer'
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696',
                                            cursor: 'pointer'
                                        },
                                    }}
                                    rowHeight={30}
                                    columnHeaderHeight={30}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container padding={1} direction="row" alignItems="center" >
                            <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', marginTop: '20px' }}>
                                DC Details
                            </Typography>
                            <Button
                                variant="contained"
                                type="button"
                                style={{ height: "35px", backgroundColor: "#002d68", marginLeft: '28px' }}
                                onClick={handleLoadClick}
                            >
                                Load Pending DC's
                            </Button>
                        </Grid>
                    </Grid>
                    {showMainDataGrid && (
                        <>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={0}>
                                <Card style={{ borderRadius: '10px', width: '100%', height: '30vh' }}>
                                    <CardContent>
                                        <DataGrid
                                            rows={rows3}
                                            columns={columns3}
                                            pageSize={8}
                                            rowsPerPageOptions={[8]}
                                            style={{ border: 'none', height: '260px' }}
                                            sx={{
                                                '& .super-app-theme--header': {
                                                    WebkitTextStrokeWidth: '0.6px',
                                                    backgroundColor: '#93bce6',
                                                    color: '#1c1919',
                                                    cursor: 'pointer'
                                                },
                                                '& .MuiDataGrid-cell': {
                                                    border: '1px solid #969696',
                                                    cursor: 'pointer'
                                                },
                                                '& .MuiDataGrid-columnHeader': {
                                                    border: '1px solid #969696',
                                                    cursor: 'pointer'
                                                },
                                            }}
                                            rowHeight={30}
                                            columnHeaderHeight={30}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid container spacing={2} justify="flex-end" padding={1} marginTop={1}>
                                <Grid item xs={12} sm={4} md={4} lg={4} xl={4}>
                                    <TextField
                                        fullWidth
                                        label='Dc Value'
                                        placeholder='Dc Value'
                                        value={dcValue}
                                        size="small"
                                        onChange={(e) => setDcValue(e.target.value)}
                                        style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={6} xl={6} container justify="flex-end" alignItems="center">
                                    <Button
                                        variant="contained"
                                        style={{ height: "30px", backgroundColor: "#002d68", marginLeft: "10px" }}
                                        onClick={handleOkMainClick}
                                    >
                                        OK
                                    </Button>
                                    <Button
                                        variant="contained"
                                        style={{ height: "30px", backgroundColor: "#002d68", marginLeft: "10px" }}
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    )}
                    {showDataDcGrids && (
                        <>
                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} marginTop={1}>
                                <Card style={{ borderRadius: '10px', width: '100%', height: '30vh' }}>
                                    <CardContent>
                                        <DataGrid
                                            rows={rows4}
                                            columns={columns4}
                                            pageSize={8}
                                            rowsPerPageOptions={[8]}
                                            style={{ border: 'none', height: '260px' }}
                                            sx={{
                                                '& .super-app-theme--header': {
                                                    WebkitTextStrokeWidth: '0.6px',
                                                    backgroundColor: '#93bce6',
                                                    color: '#1c1919',
                                                    cursor: 'pointer'
                                                },
                                                '& .MuiDataGrid-cell': {
                                                    border: '1px solid #969696',
                                                    cursor: 'pointer'
                                                },
                                                '& .MuiDataGrid-columnHeader': {
                                                    border: '1px solid #969696',
                                                    cursor: 'pointer'
                                                },
                                            }}
                                            rowHeight={30}
                                            columnHeaderHeight={30}
                                        />
                                    </CardContent>
                                </Card>

                            </Grid>
                            <Grid item xs={12} sm={12} md={8} lg={8} xl={8} marginTop={1}>
                                <Card style={{ borderRadius: '10px', width: '100%', height: '30vh' }}>
                                    <CardContent>
                                        <DataGrid
                                            rows={rows5}
                                            columns={columns5}
                                            pageSize={8}
                                            rowsPerPageOptions={[8]}
                                            style={{ border: 'none', height: '260px' }}
                                            sx={{
                                                '& .super-app-theme--header': {
                                                    WebkitTextStrokeWidth: '0.6px',
                                                    backgroundColor: '#93bce6',
                                                    color: '#1c1919',
                                                    cursor: 'pointer'
                                                },
                                                '& .MuiDataGrid-cell': {
                                                    border: '1px solid #969696',
                                                    cursor: 'pointer'
                                                },
                                                '& .MuiDataGrid-columnHeader': {
                                                    border: '1px solid #969696',
                                                    cursor: 'pointer'
                                                },
                                            }}
                                            rowHeight={30}
                                            columnHeaderHeight={30}
                                        />
                                    </CardContent>
                                </Card>

                            </Grid>
                            <Grid container >
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                    <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", padding: "10px", }}>
                                        <div style={{ display: "flex", gap: "5px" }}>
                                            {/* <Button variant="contained"
                                                type="button"
                                                style={{ height: "30px", backgroundColor: "#002d68" }}
                                                onClick={handleAllItemsClick}
                                            >
                                                All Items
                                            </Button> */}
                                            <Button
                                                variant="contained"
                                                onClick={handleAutoAdjustCheckboxChange}
                                                style={{ height: "30px", backgroundColor: "#002d68" }}
                                            >
                                                Auto Adjust
                                            </Button>
                                            <Button
                                                variant="contained"

                                                style={{ height: "30px", backgroundColor: "#002d68" }}
                                                onClick={handleOkClick}
                                            >
                                                OK
                                            </Button>
                                            <Button
                                                variant="contained"
                                                style={{ height: "30px", backgroundColor: "#002d68" }}
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                        </>
                    )}
                </Grid>
            </form>
        </div>
    )
}

export default DcSelection

// boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)',