import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Grid, LinearProgress, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './StoreItemReference.css';
import { GetSearchedItems, StoreReferenceItemHistory, GetTransactionData } from '../../ApiService/LoginPageService';
import GRN_FIFO_Module from './GRN_FIFO_Module';

const StoreItemReference = () => {
    const [itemList, setItemList] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [selectedItemDescription, setSelectedItemDescription] = useState('');
    const [storeRelatedData, setStoreRelatedData] = useState([]);
    const [productionRelatedData, setProductionRelatedData] = useState([]);
    const [purchaseRelatedData, setPurchaseRelatedData] = useState([]);
    const [locationData, setLocationData] = useState([])
    const [selectedTransaction, setSelectedTransaction] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setTodate] = useState('');
    const [transactionData, setTransactionData] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchLoader, setSearchLoader] = useState(false);

    const handleChange = (e) => {
        GetSearchedItems({ code: e.target.value }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
    }

    const handleItemVsProcessItemSucessShow = (dataObject) => {
        const option2 = dataObject?.data.map(item => ({
            id: item?.id,
            label: item?.label ?? '',  // fallback to empty string,
            itemName: item?.itemName ?? ''  // fallback to empty string
        }));
        setItemList(option2 || []);
    }
    const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSupplierSearchItemChange = (value) => {
        if (value !== null) {
            setSelectedItemId(value?.id)
            setSelectedItemDescription(value?.itemName)
            setSearchLoader(true)
            StoreReferenceItemHistory({ id: value?.id }, handleHistorySuccess, handleHistoryException)
        }
    }

    const handleHistorySuccess = (dataObject) => {
        setStoreRelatedData(dataObject?.store || [])
        setPurchaseRelatedData(dataObject?.purchase || [])
        setProductionRelatedData(dataObject?.production || [])
        setLocationData(dataObject?.location || [])
        console.log("dataObject?.storedataObject?.store", dataObject?.store)
        setSearchLoader(false)
    }
    const handleHistoryException = () => {
        setSearchLoader(false)
    }

    const handleLoadButtonClick = () => {
        setLoading(true);
        GetTransactionData(
            {
                id: selectedItemId,
                from: fromDate,
                to: toDate,
                category: selectedTransaction
            }, handleTransactionSuccess, handleTransactionException)
    }

    const handleTransactionSuccess = (dataObject) => {
        setLoading(false);
        setTransactionData(dataObject?.data || [])
    }
    const handleTransactionException = () => {
        setLoading(false);
    }

    const handleTransactionChanage = (value) => {
        if (value === 'GRN') {
            setOpen(true)
        }
    }

    //FINANCIAL YEAR

    useEffect(() => {
        // Initialize with the current financial year based on today's date
        const today = new Date();
        const currentYear = today.getFullYear();
        const isAfterApril = today.getMonth() >= 3; // Checks if month is April or later (0-indexed)

        // Set the initial financial year range
        const initialFromDate = isAfterApril
            ? `${currentYear}-04-01`
            : `${currentYear - 1}-04-01`;
        const initialToDate = isAfterApril
            ? `${currentYear + 1}-03-31`
            : `${currentYear}-03-31`;

        setFromDate(initialFromDate);
        setTodate(initialToDate);
    }, []);

    const handleFromDateChange = (e) => {
        const selectedFromDate = e.target.value;
        setFromDate(selectedFromDate);

        // Get the selected year and adjust the financial year accordingly
        const fromYear = new Date(selectedFromDate).getFullYear();
        const isAfterApril = new Date(selectedFromDate).getMonth() >= 3;

        // Set the "To Date" to March 31 of the financial year
        const financialYearEnd = isAfterApril
            ? `${fromYear + 1}-03-31`
            : `${fromYear}-03-31`;

        setTodate(financialYearEnd);
    };

    return (
        <div style={{ margin: '10px' }}>
            <Typography style={{ fontWeight: 'bold', textAlign: 'left', fontSize: '20px', marginBottom: '10px' }}>Store Item Reference</Typography>
            <Grid container >
                <Grid item xs={12} sm={12} md={2.925} lg={2.925} xl={2.925} style={{ backgroundColor: '#ffffff', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid black' }}>
                    <Autocomplete
                        fullWidth
                        disablePortal
                        options={itemList}
                        renderInput={(params) => <TextField {...params} label="Search Items" onChange={handleChange} />}
                        onChange={(event, value) => handleSupplierSearchItemChange(value)}
                    />
                    <TextField
                        fullWidth
                        id="outlined-multiline-flexible"
                        multiline
                        maxRows={4}
                        value={selectedItemDescription}
                        style={{ marginTop: '10px' }}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={0.1} lg={0.1} xl={0.1}></Grid>

                <Grid item xs={12} sm={12} md={1.5} lg={1.5} xl={1.5} style={{ backgroundColor: '#ffffff', border: '1px solid black', padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px',/* display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' */ }}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ backgroundColor: '#93bce6', display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Typography fullWidth style={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>Stock On Hand</Typography>
                        </div>
                        <div style={{ flex: 1.5 }}>
                            <Typography fullWidth style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '40px' }}>{locationData.length > 0 ? locationData[0]?.totQty : '0.00'}</Typography>
                        </div>
                    </div>
                </Grid>

                <Grid item xs={12} sm={12} md={0.1} lg={0.1} xl={0.1}></Grid>

                <Grid item xs={12} sm={12} md={3.35} lg={3.35} xl={3.35} style={{ backgroundColor: '#ffffff', padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '5px', height: '143px', border: '1px solid black' }}>
                    <Box
                        sx={{
                            height: "123px",
                            width: "100%",
                            overflowY: "scroll",
                            '&::-webkit-scrollbar': {
                                width: '12px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'black',
                                borderRadius: '10px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: 'lightgrey',
                            },
                            scrollbarColor: "#f9f9fb lightgrey",
                            scrollbarWidth: "thin",
                        }}
                    >
                        <table id="location">
                            <tr>
                                <th style={{ whiteSpace: 'nowrap' }}>Location</th>
                                <th style={{ whiteSpace: 'nowrap' }}>QOH</th>
                            </tr>
                            {locationData.length > 0 ? locationData.map((item) => (
                                <tr>
                                    <td style={{ whiteSpace: 'nowrap' }}>{item.locName}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>{item.totQty}</td>
                                </tr>
                            ))
                                :
                                <>
                                    <tr>
                                        <td style={{ whiteSpace: 'nowrap' }}>-</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>-</td>
                                    </tr>
                                    <tr>
                                        <td style={{ whiteSpace: 'nowrap' }}>-</td>
                                        <td style={{ whiteSpace: 'nowrap' }}>-</td>
                                    </tr>
                                </>
                            }
                        </table>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={12} md={0.07} lg={0.07} xl={0.07}></Grid>

                <Grid item xs={12} sm={12} md={3.95} lg={3.95} xl={3.95} style={{ backgroundColor: '#ffffff', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid black' }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Transaction</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedTransaction}
                            label="Transaction"
                            onChange={(e) => {
                                setSelectedTransaction(e.target.value)
                                handleTransactionChanage(e.target.value)
                            }}
                        >
                            <MenuItem value={"GRN"}>GRN FIFO</MenuItem>
                            <MenuItem value={'jobwork_issue_details'}>SFG Entry</MenuItem>
                            <MenuItem value={'po_forecast_dtl'}>ForeCast Entry</MenuItem>
                            <MenuItem value={'po_bill_dtl'}>Purchase Bill Against PO</MenuItem>
                            <MenuItem value={'po_generate'}>Purchase Order</MenuItem>
                            <MenuItem value={"jobwork_issue_details"}>Job Work Issue</MenuItem>
                            <MenuItem value={"jobwork_reciept_details"}>Job Work Receipt</MenuItem>
                            <MenuItem value={"material_issue_dtl"}>Material Issue Note</MenuItem>
                            <MenuItem value={"mrn_details"}>Material Return Note</MenuItem>
                            <MenuItem value={"srn"}>Store Request Note</MenuItem>
                        </Select>
                    </FormControl>
                    <div style={{ display: 'flex', flexDirection: 'row', columnGap: '10px', marginTop: '10px' }}>
                        {/* <TextField
                            fullWidth
                            id="outlined-basic"
                            label="From Date"
                            variant="outlined"
                            type='date'
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                        />
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            label="To Date"
                            variant="outlined"
                            type='date'
                            value={toDate}
                            onChange={(e) => setTodate(e.target.value)}
                            InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                        /> */}
                        <TextField
                            fullWidth
                            id="from-date"
                            label="From Date"
                            variant="outlined"
                            type="date"
                            value={fromDate}
                            onChange={handleFromDateChange}
                            InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                        />
                        <TextField
                            fullWidth
                            id="to-date"
                            label="To Date"
                            variant="outlined"
                            type="date"
                            value={toDate}
                            onChange={(e) => setTodate(e.target.value)}
                            InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Button disabled={loading === true} style={{ backgroundColor: '#002d68' }} variant="contained" onClick={handleLoadButtonClick}>
                                {loading ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'Load'}
                            </Button>
                        </div>
                    </div>
                </Grid>

            </Grid>

            <Grid container spacing={1.4} >
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '30px' }}>
                        <Box
                            sx={{
                                border: '1px solid black',
                                height: "580px",
                                backgroundColor: 'white',
                                width: "100%",
                                overflowY: "scroll",
                                overflowX: "scroll",
                                '&::-webkit-scrollbar': {
                                    width: '12px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'black',
                                    borderRadius: '10px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: 'lightgrey',
                                },
                                scrollbarColor: "#f9f9fb lightgrey",
                                scrollbarWidth: "thin",
                            }}
                        >
                            {
                                searchLoader &&
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress />
                                </Box>
                            }
                            <table id="customers">
                                <thead>
                                    <tr>
                                        <th style={{ whiteSpace: 'nowrap' }}>Group Name</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Doc Name</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Doc-Info</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productionRelatedData && productionRelatedData.map((item, index) => (
                                        <tr key={`prod-${index}`}>
                                            {index === 0 && (
                                                <td rowSpan={productionRelatedData.length} style={{ whiteSpace: 'nowrap' }}>PRODUCTION</td>
                                            )}
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.docName}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.docInfo}</td>
                                        </tr>
                                    ))}

                                    {purchaseRelatedData && purchaseRelatedData.map((item, index) => (
                                        <tr key={`purchase-${index}`}>
                                            {index === 0 && (
                                                <td rowSpan={purchaseRelatedData.length} style={{ whiteSpace: 'nowrap' }}>PURCHASE</td>
                                            )}
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.docName}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.docInfo}</td>
                                        </tr>
                                    ))}

                                    {storeRelatedData && storeRelatedData.map((item, index) => (
                                        <tr key={`store-${index}`}>
                                            {index === 0 && (
                                                <td rowSpan={storeRelatedData.length} style={{ whiteSpace: 'nowrap' }}>STORE</td>
                                            )}
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.docName}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.docInfo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </Box>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <Box
                        sx={{
                            height: "580px",
                            backgroundColor: 'white',
                            border: '1px solid black',
                            width: "100%",
                            overflowY: "scroll",
                            overflowX: "scroll",
                            '&::-webkit-scrollbar': {
                                width: '12px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'black',
                                borderRadius: '10px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: 'lightgrey',
                            },
                            scrollbarColor: "#f9f9fb lightgrey",
                            scrollbarWidth: "thin",
                        }}
                    >

                        {transactionData.length > 0 &&
                            <table id="customers">
                                <thead>
                                    <tr>
                                        {Object.keys(transactionData[0]).map((key, index) => (
                                            <th key={index} style={{ whiteSpace: 'nowrap' }}>{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactionData.map((item, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {Object.values(item).map((value, colIndex) => (
                                                <td key={colIndex} style={{ whiteSpace: 'nowrap' }}>{value}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        }

                    </Box>
                </Grid>
            </Grid>
            <GRN_FIFO_Module
                open={open}
                setOpen={setOpen}
                setSelectedTransaction={setSelectedTransaction}
                selectedItemId={selectedItemId}
                fromDate={fromDate}
                toDate={toDate}
            />
        </div>
    )
}

export default StoreItemReference