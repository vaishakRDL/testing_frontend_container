import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, LinearProgress, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import './SalesRegisterReport.css';
import { ScrapMstGetMaterial, MachineShowData, ScrapReportAnalysisReport, CustomerDropShowdata, GetSaleInvoiceReport, GetSaleRegisterReport } from "../../../../ApiService/LoginPageService";
import NotificationBar from "../../../GlobleFiles/ServiceNotificationBar";
import { SalesRegisterReportDownload, ScrapAnalysisReportDownload } from "../../../../ApiService/DownloadCsvReportsService";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const SalesRegisterReport = () => {

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setTodate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [rawMaterial, setRawMaterial] = useState('');
    const [rawMaterialList, setRawMaterialList] = useState([]);
    const [machinList, setMachineList] = useState([]);
    const [machine, setMachine] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const [customerSelect, setCustomerSelect] = useState([]);
    const [customerSelectList, setCustomerSelectList] = useState([]);
    const [selectedFilterRadio, setSelectedFilterRadio] = useState('Today');


    useEffect(() => {
        handleRadioChange({ target: { value: 'Today' } });

        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        ScrapMstGetMaterial(handleScrapMstGetMaterialSuccess, handleScrapMstGetMaterialException);
        MachineShowData(handleMachineShowDataSuccess, handleMachineShowDataExceprion);
    }, [])

    const handleReportView = () => {
        setLoader(true)
        GetSaleRegisterReport(
            {
                from: fromDate,
                to: toDate,
                customer: customerSelect
            }, handleGetReportSuccess, handleGetReportException)
    }

    const handleGetReportSuccess = (dataObject) => {
        setLoader(false)
        setReportData(dataObject?.data || [])
    }
    const handleGetReportException = () => {
        setLoader(false)
    }



    const handleReportDownload = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales Register');

        // Define headers exactly as shown on screen
        const headers = [
            'INV No', 'INV Date', 'Vehicle No', 'Cust PONO', 'Cust PO Date',
            'Cust Code', 'Cust Name', 'GST No', 'HSN Code', 'Commudity', 'UOM','Total Qty', 
            'Assble Value', 'Less Disc Amt', 'Less Others', 'Packing',
            'Transportation Amt', 
          'Customer Amt', 'Amount GST Payable',
            'CGSTPER', 'CGST Amt', 'SGST Per', 'SGST Amt', 'IGST Per', 'IGST Amt',
            'UTGST Per', 'UTGST Amt', 'TCS Per', 'TCS Amt', 'Round Off', 'Gross Amount','DFID Code',
        ];

        // Add header row
        worksheet.addRow(headers);

        // Add data rows from reportData
        reportData.forEach((data) => {
            worksheet.addRow([
                data.invNo,
                data.date,
                data.vechileNO,
                data.poNo,
                data.poDate,
                data.cCode,
                data.cName,
                data.gstNo,
                data.hsnCode,
                data.commudity,
                data.uom,
                data.totalQty,
                data.taxableValueforGST,
                data.lessDisc,
                data.lessOther,
                data.packingForw,
                data.transportCharges,
                // data.subtotal,
                data.custMeterialValue,
                data.amtOfGstPay,
                data.CGSTPer,
                data.CGST,
                data.SGSTPer,
                data.SGST,
                data.IGSTPer,
                data.IGST,
                data.UTGSTPer,
                data.UTGST,
                data.tcsPer,
                data.tcs,
                data.roundOff,
                data.invValue,
                 data.trType,
            ]);
        });

        // Auto width for all columns
        worksheet.columns.forEach((col) => {
            let maxLength = 10;
            col.eachCell({ includeEmpty: true }, (cell) => {
                const value = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, value.length);
            });
            col.width = maxLength + 2;
        });

        // Optional: Add borders
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });
        });

        // Generate and trigger file download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'Sales_Register_Report.xlsx');
    };


    const handleDownloadSuccess = () => {
        setLoader(false)
        setNotification({
            status: true,
            type: 'success',
            message: "Download Success",
        });
    }
    const handleDownloadException = () => {
        setLoader(false)
        setNotification({
            status: true,
            type: 'error',
            message: "Failed to download",
        });
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    // MATERIAL
    const handleScrapMstGetMaterialSuccess = (dataObject) => {
        setRawMaterialList(dataObject?.data || []);
    }
    const handleScrapMstGetMaterialException = () => {
    }
    const options2 = rawMaterialList.map(item => ({
        id: item?.id,
        label: item?.material
    }));

    const handleRawMaterialChange = (selectedValue) => {
        setRawMaterial(selectedValue?.label || '');
    };


    //MACHINE
    const handleMachineShowDataSuccess = (dataObject) => {
        setMachineList(dataObject?.data || []);

    }
    const handleMachineShowDataExceprion = () => {
    }

    const options = machinList.map(item => ({
        id: item?.id,
        label: item?.machineName
    }));

    const handleAutocompleteChange = (selectedValue) => {
        setMachine(selectedValue?.id || '');
    };

    //////////////////////////////////////////////////////
    const handleChangeCustomer = (e) => {
        if (e !== null) {
            CustomerDropShowdata(
                { code: e.target.value },
                handleCustomerDropshow,
                handleCustomerDropshowException
            );
        }
    };

    const handleCustomerDropshow = (dataObject) => {
        setCustomerSelectList(dataObject?.data || []);
    };

    const handleCustomerDropshowException = (error, errorMessage) => { };

    const handleSearchItemChange = (value) => {
        if (value !== null) {
            const idArray = value.map((item) => item.id)
            console.log("idArray", idArray)
            setCustomerSelect(idArray)
        }
    }

    // MULTI SELECTION AUTOCOMPLETE
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const handleRadioChange = (event) => {
        setSelectedFilterRadio(event.target.value);

        let fromDate = new Date();
        let toDate = new Date();

        switch (event.target.value) {
            case 'Today':
                fromDate = new Date();
                toDate = new Date();
                break;
            case 'Yesterday':
                fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - 1);
                toDate = new Date(fromDate);
                break;
            case 'This week':
                fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - fromDate.getDay());
                toDate = new Date();
                break;
            case 'Last week':
                fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - fromDate.getDay() - 7);
                toDate = new Date(fromDate);
                toDate.setDate(toDate.getDate() + 6);
                break;
            case 'This month':
                fromDate = new Date();
                fromDate.setDate(1);
                toDate = new Date();
                break;
            case 'Last month':
                fromDate = new Date();
                fromDate.setMonth(fromDate.getMonth() - 1);
                fromDate.setDate(1);
                toDate = new Date(fromDate);
                toDate.setMonth(toDate.getMonth() + 1);
                toDate.setDate(0); // Last day of the previous month
                break;
            default:
                fromDate = null;
                toDate = null; // For 'Custom' or other cases where a specific date isn't predefined
        }

        // selectedDate,selectedToDate
        setFromDate(fromDate ? fromDate.toISOString().split('T')[0] : '');
        setTodate(toDate ? toDate.toISOString().split('T')[0] : '');
    };


    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Sales Register Report
                </Typography>
            </div>
            <Card sx={{ minWidth: 275 }}>
                {loader &&
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                }
                <CardContent>
                    <Grid container alignItems={'center'} spacing={2}>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <FormControl style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', borderRadius: '5px' }}>
                                <RadioGroup
                                    aria-label="options"
                                    name="options"
                                    value={selectedFilterRadio}
                                    onChange={handleRadioChange}
                                    sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}
                                >
                                    <FormControlLabel
                                        value="Today"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Today"
                                    />
                                    <FormControlLabel
                                        value="Yesterday"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Yesterday"
                                    />
                                    <FormControlLabel
                                        value="This week"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="This week"
                                    />
                                    <FormControlLabel
                                        value="Last week"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Last week"
                                    />
                                    <FormControlLabel
                                        value="This month"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="This month"
                                    />
                                    <FormControlLabel
                                        value="Last month"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Last month"
                                    />
                                    <FormControlLabel
                                        value="Custom"
                                        control={<Radio
                                            sx={{
                                                color: '#686D76', // unselected color
                                                '&.Mui-checked': {
                                                    color: '#000000', // selected color
                                                }
                                            }}
                                        />}
                                        label="Custom"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={12} md={2} lg={2}>
                            <FormControl style={{ width: '100%' }}>
                                <Autocomplete
                                    multiple
                                    id="checkboxes-tags-demo"
                                    options={customerSelectList}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option.cCode}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option.cCode}
                                        </li>
                                    )}
                                    size="small"
                                    renderInput={(params) => <TextField {...params} label="Search Customer" onChange={handleChangeCustomer} />}
                                    onChange={(event, value) => handleSearchItemChange(value)}
                                />
                            </FormControl>
                        </Grid>
                        {/* <Grid item xs={12} sm={12} md={2} lg={2}>
                            <FormControl style={{ width: '100%' }}>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="combo-box-demo"
                                    size='small'
                                    options={options}
                                    // sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Item Code"

                                    />}
                                    onChange={(event, value) => handleAutocompleteChange(value)}
                                />
                            </FormControl>
                        </Grid> */}
                        <Grid item xs={12} sm={8} md={2} lg={2}>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                type="date"
                                label="From"
                                variant="outlined"
                                style={{ marginRight: '10px' }}
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size="small"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8} md={2} lg={2}>
                            <TextField
                                fullWidth
                                id="outlined-basic"
                                type="date"
                                label="To"
                                variant="outlined"
                                style={{ marginRight: '10px' }}
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size="small"
                                value={toDate}
                                onChange={(e) => setTodate(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8} md={3} lg={3}>
                            <Button disabled={loader === true} variant="contained" style={{ backgroundColor: '#002D68', marginRight: '15px', marginTop: '2px' }} onClick={handleReportView}>
                                {/* View */}
                                {loader ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'View'}
                            </Button>
                            <Button variant="contained" style={{ backgroundColor: '#002D68', marginTop: '2px' }} onClick={handleReportDownload}>Download</Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            {/* {reportData.length > 0 ? */}
                            <Box sx={{ height: screenHeight - 375, width: '100%', overflow: 'auto' }}>

                                <table border="1" style={{ borderCollapse: "collapse", width: "100%", zoom: '80%' }} id="customers">
                                    <thead>
                                        <tr>
                                            <th style={{ whiteSpace: 'nowrap' }}>INV No</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>INV Date</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Vehicle No</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Cust PONO</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Cust PO Date</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Cust Code</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Cust Name</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>GST No</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>HSN Code</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Commudity</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>UOM</th>
                                            {/* <th style={{ whiteSpace: 'nowrap' }}>HSN Code</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Commodity</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>UOM Code</th> */}
                                            <th style={{ whiteSpace: 'nowrap' }}>Total Qty</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Assble Value</th>
                                            {/* <th style={{ whiteSpace: 'nowrap' }}>Less Disc%</th> */}
                                            <th style={{ whiteSpace: 'nowrap' }}>Less Disc Amt</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Less Others</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Packing</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Transportation Amt</th>
                                            
                                            {/* <th style={{ whiteSpace: 'nowrap' }}>Invoice Amt</th> */}
                                            <th style={{ whiteSpace: 'nowrap' }}>Customer Amt</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Amount GST Payable</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>CGSTPER</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>CGST Amt</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>SGST Per</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>SGST Amt</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>IGST Per</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>IGST Amt</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>UTGST Per</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>UTGST Amt</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>TCS Per</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>TCS Amt</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Round Off</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Gross Amount</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>DFID Code</th>

                                            {/* <th style={{ whiteSpace: 'nowrap' }}>DFID</th> */}
                                        </tr>
                                        {/* <tr>
                                            <th>INV No</th>
                                            <th>INV Date</th>
                                            <th>Cust PONO/PO Date</th>
                                            <th>Cust Code</th>
                                            <th>Cust Name</th>
                                            <th>GST No</th>
                                            <th>Item Code</th>
                                            <th>Item Name</th>
                                            <th>UOM</th>
                                            <th>Scheduled Date</th>
                                            <th>SO Qty</th>
                                            <th>Inv Qty</th>
                                            <th>Rate</th>
                                            <th>Amount</th>
                                        </tr> */}
                                    </thead>
                                    <tbody>
                                        {reportData?.map((data) =>
                                            <tr>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.invNo}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.date}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.vechileNO}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.poNo}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.poDate}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.cCode}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.cName}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.gstNo}</td>
                                                 <td style={{ whiteSpace: 'nowrap' }}>{data.hsnCode}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.commudity}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.uom}</td>
                                                {/* <td style={{ whiteSpace: 'nowrap' }}>{data.hsnCode}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.commodity}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.uom}</td> */}
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.totalQty}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.taxableValueforGST}</td>
                                                {/* <td style={{ whiteSpace: 'nowrap' }}>{data.lessDiscPer}</td> */}
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.lessDisc}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.lessOther}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.packingForw}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.transportCharges}</td>
                                               
                                                {/* <td style={{ whiteSpace: 'nowrap' }}>{data.subtotal}</td> */}
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.custMeterialValue}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.amtOfGstPay}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.CGSTPer}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.CGST}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.SGSTPer}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.SGST}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.IGSTPer}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.IGST}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.UTGSTPer}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.UTGST}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.tcsPer}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.tcs}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.roundOff}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.invValue}</td>
                                                <td style={{ whiteSpace: 'nowrap' }}>{data.trType}</td>

                                                {/* <td style={{ whiteSpace: 'nowrap' }}>{data.dfid}</td> */}
                                            </tr>
                                        )}
                                        {/* {reportData?.map((customer) =>
                                            customer.po.map((po, poIndex) =>
                                                po.items.map((item, itemIndex) => (
                                                    <tr key={`${po.sino}-${item.id}`}>
                                                        {itemIndex === 0 && (
                                                            <>
                                                                <td rowSpan={po.items.length}>{item.invNo}</td>
                                                                <td rowSpan={po.items.length}>{item.invDate}</td>
                                                                <td rowSpan={po.items.length}>
                                                                    {po.poNo} / {po.poDate}
                                                                </td>
                                                                <td rowSpan={po.items.length}>{customer.cCode}</td>
                                                                <td rowSpan={po.items.length}>{customer.cName}</td>
                                                                <td rowSpan={po.items.length}>{customer.gst}</td>
                                                            </>
                                                        )}
                                                        <td>{item.itemCode}</td>
                                                        <td>{item.itemName}</td>
                                                        <td>{item.uom}</td>
                                                        <td>{item.schDate || "N/A"}</td>
                                                        <td>{item.soQty}</td>
                                                        <td>{item.invQty}</td>
                                                        <td>{item.rate}</td>
                                                        <td>{item.amt}</td>
                                                    </tr>
                                                ))
                                            )
                                        )} */}
                                        {/* {reportData && reportData.map((data, Key) => (
                                            data.details.map((item, index) => (
                                                <tr>
                                                    {
                                                        index === 0 &&
                                                        <>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.details.length}>{data.material}</td>
                                                        </>
                                                    }
                                                    <td style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}>
                                                        {item.thickness}
                                                    </td>
                                                    <td style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}>
                                                        {item.totalWeight}
                                                    </td>
                                                    <td style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}>
                                                        {item.withButton}
                                                    </td>
                                                    <td style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}>
                                                        {item.withoutButton}
                                                    </td>
                                                    {
                                                        index === 0 &&
                                                        <>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.details.length}>{data.scrapWeightTotal}</td>
                                                        </>
                                                    }
                                                    {
                                                        index === 0 &&
                                                        <>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.details.length}>{data.withButtonTotal}</td>
                                                        </>
                                                    }
                                                    {
                                                        index === 0 &&
                                                        <>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.details.length}>{data.withoutButtonTotal}</td>
                                                        </>
                                                    }
                                                    <td style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}>
                                                        {item.withButtonPercentage}%
                                                    </td>
                                                    <td style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}>
                                                        {item.withoutButtonPercentage}%
                                                    </td>
                                                    {
                                                        index === 0 &&
                                                        <>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.details.length}>{data.withButtonPercentage}%</td>
                                                        </>
                                                    }
                                                    {
                                                        index === 0 &&
                                                        <>
                                                            <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.details.length}>{data.withoutButtonPercentage}%</td>
                                                        </>
                                                    }
                                                </tr>
                                            ))
                                        ))} */}
                                    </tbody>
                                </table>
                            </Box>
                            {/* :
                                <Box sx={{ height: screenHeight - 310, width: '100%', overflow: 'auto' }}>
                                    <div style={{ backgroundColor: '#D9EAFD', padding: '50px', borderRadius: '10px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography style={{ fontFamily: 'cursive' }}>No Data Found</Typography>
                                    </div>
                                </Box>
                            } */}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div >
    )
}
export default SalesRegisterReport;