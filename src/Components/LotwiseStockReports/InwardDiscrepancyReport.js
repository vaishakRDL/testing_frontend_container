
import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, LinearProgress, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { LotwiseStockReportList, PurchaseReportSearchItem, GetPuchaseReport, GetJobWorkIssueReport, ItemSearchNAAJ, GetSuppVsItemAllSuppList, GetSearchedItems, InwardDiscrepancyReportList, CustomerDropShowdata, PurchaseReportSearchSupplier } from "../../ApiService/LoginPageService";
// import './JobWorkIssueReport.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';


const InwardDiscrepancyReport = () => {

    const [supplierList, setSupplierList] = useState([]);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [customerSelect, setCustomerSelect] = useState([]);
    const [customerSelectList, setCustomerSelectList] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const today = new Date().toISOString().split("T")[0]; // 👉 gives "2025-08-22"

    const [toDate, setTodate] = useState(today);
    const [lotwsieReportData, setLotwiseReportData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [selectedRadio, setSelectedRadio] = useState('0');
    console.log('selectedRadioselectedRadio', selectedRadio)
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [fyFrom, setFyFrom] = useState("");
    const [fyTo, setFyTo] = useState("");
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = React.useState("1");
    const [selectedValue, setSelectedValue] = useState('0');

    const [openNotification, setNotification] = useState({
        status: false,
        type: "error",
        message: "",
    });
    useEffect(() => {

        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };

        // Add event listener to update height on resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    const handleClose = () => {
        setNotification({
            status: false,
            type: "",
            message: "",
        });
    };


    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };



    /////////////////////////////////////

    const arrayToWorksheet = (array) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PO Report');

        if (array.length === 0) return workbook;

        // Define columns dynamically based on keys
        const columns = Object.keys(array[0]).map((key) => ({
            header: key.toUpperCase(), // Convert headers to uppercase
            key: key,
            width: 20,
        }));

        worksheet.columns = columns;

        // Add data rows
        array.forEach((row) => worksheet.addRow(row));

        // Style the header row (bold + center aligned)
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });

        // Center align all data rows
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        });

        return workbook;
    };

    const downloadExcelFile = async (workbook, filename) => {
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), filename);
    };

    // const handleDownload = () => {
    //     const formattedData = lotwsieReportData.map((item) => ({
    //         "PRINTPBNO": item?.poNo,
    //         "PBDATE": item?.date,
    //         "SUPPLIER": item?.spName,
    //         "SITEMCODE": item?.itemCode,
    //         "SITEMNAME": item?.itemName,
    //         "UOMCODE": item?.uom,
    //         "SCHDATE": item?.schDate,
    //         "INVQTY": item?.invQty,
    //         "RCVDQTY": item?.rcvdQty,
    //         "ACCEPTQTY": item?.accQty,
    //         "REJQTY": item?.rejQty,
    //         "DIFF": item?.pendingQty,
    //         "REMARKS": item?.itemRemarks
    //     }));

    //     const workbook = arrayToWorksheet(formattedData);
    //     downloadExcelFile(workbook, 'Lotwise Report.xlsx');
    // };
    const handleDownload = () => {
        const formattedData = lotwsieReportData.map((item) => ({
            "PRINTPBNO": item?.poNo,
            "PBDATE": item?.date,
            "SUPPLIER": item?.spName,
            "SITEMCODE": item?.itemCode,
            "SITEMNAME": item?.itemName,
            "UOMCODE": item?.uom,
            "SCHDATE": item?.schDate,

            // numeric fields
            "INVQTY": Number(item?.invQty || 0),
            "RCVDQTY": Number(item?.rcvdQty || 0),
            "ACCEPTQTY": Number(item?.accQty || 0),
            "REJQTY": Number(item?.rejQty || 0),
            "DIFF": Number(item?.pendingQty || 0),

            "REMARKS": item?.itemRemarks
        }));

        const workbook = arrayToWorksheet(formattedData);
        downloadExcelFile(workbook, "Lotwise Report.xlsx");
    };


    const parseDate = (str) => {
        const [day, month, year] = str.split("-");
        return new Date(`${year}-${month}-${day}`);
    };

    // Helper: Format Date to "yyyy-MM-dd" (for <input type="date" />)
    const formatDateForInput = (date) => {
        return date.toISOString().split("T")[0];
    };

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("userDetails")) || {};
        if (stored.fyFrom && stored.fyTo) {
            const from = parseDate(stored.fyFrom);
            const to = parseDate(stored.fyTo);
            setFyFrom(formatDateForInput(from));
            setFyTo(formatDateForInput(to));
        }
    }, []);

    const isValidDateInRange = (value) => {
        const selected = new Date(value);
        const min = new Date(fyFrom);
        const max = new Date(fyTo);
        return selected >= min && selected <= max;
    };

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
        // setTodate(initialToDate);
    }, []);

    const handleFromDateChange = (e) => {
        const selectedFromDate = e.target.value;
        setFromDate(selectedFromDate);

        const fromYear = new Date(selectedFromDate).getFullYear();
        const isAfterApril = new Date(selectedFromDate).getMonth() >= 3;

        const financialYearEnd = isAfterApril
            ? `${fromYear + 1}-03-31`
            : `${fromYear}-03-31`;

        // setTodate(financialYearEnd);
    };

    const handleToDateChange = (e) => {
        const value = e.target.value;
        if (isValidDateInRange(value)) {
            setTodate(value);
            setNotification({ status: false, type: "", message: "" });
        } else {
            setNotification({
                status: true,
                type: "error",
                message: "Please select a valid To-Date",
            });
        }
    };

    // AUTOCOMPLETE Customer SEARCH
    const handleSearchItemChange = (value) => {
        if (value !== null) {
            const idArray = value.map((item) => item.id)
            console.log("idArray", idArray)
            setCustomerSelect(idArray)
        }
    }
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

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const handleReportView = () => {
        setLoader(true)
        setLoading(true);
        InwardDiscrepancyReportList(
            {
                fromDate: fromDate,
                toDate: toDate,
                category: selectedValue,
                supplier: selectedSupplier,
                // items: selectedItem,
                // suppliers: selectedSupplier

            }, handleGetReportSuccess, handleGetReportException)
    }

    const handleGetReportSuccess = (dataObject) => {
        setLoader(false)
        setLotwiseReportData(dataObject?.data || [])
        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }
    const handleGetReportException = () => {
        setLoader(false)
        setTimeout(() => {
            setLoading(false);
        }, 2000)
    }
    const handleSupplierSelect = (value) => {
        if (value !== null) {
            const ids = value.map(item => item.id);
            setSelectedSupplier(ids)
        }
    };
    // SUPPLIER SEARCH
    const handleSupplierChange = (e) => {
        PurchaseReportSearchSupplier({ code: e.target.value }, handleSearchSupplierSucessShow, handleSearchSupplierExceptionShow);
    }

    const handleSearchSupplierSucessShow = (dataObject) => {
        setSupplierList(dataObject?.data || []);
    }
    const handleSearchSupplierExceptionShow = (errorObject, errorMessage) => {
    }
    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Inward Discrepancy Report </Typography>
            </div>
            <Card sx={{ minWidth: 275 }}>
                {loading &&
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                }
                <CardContent>
                    <Grid container alignItems={'center'} spacing={2}>
                        <Grid item xs={12} sm={4} md={4} lg={4} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <TextField
                                id="outlined-basic"
                                type="date"
                                label="From"
                                variant="outlined"
                                style={{ marginRight: '10px' }}
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size="small"
                                value={fromDate}
                                fullWidth
                                onChange={handleFromDateChange}
                            // inputProps={{
                            //     min: fyFrom,
                            //     max: fyTo,
                            // }}
                            />
                            <TextField
                                id="outlined-basic"
                                type="date"
                                label="To"
                                variant="outlined"
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size="small"
                                value={toDate}
                                fullWidth
                                onChange={(e) => {
                                    setTodate(e.target.value)
                                }}
                            // inputProps={{
                            //     min: fyFrom,
                            //     max: fyTo,
                            // }}
                            />
                        </Grid>


                        {/* <Grid item xs={12} sm={2} md={2} lg={2}>
                            <Autocomplete
                                multiple
                                disablePortal
                                options={itemList}
                                // getOptionLabel={(option) => option.title}
                                // sx={{ width: 300 }}
                                size="small"
                                renderInput={(params) => <TextField {...params} label="Select Item" onChange={handleItemChange} />}
                                onChange={(event, value) => handleItemSelect(value)}
                            />
                        </Grid> */}
                        <Grid item xs={12} sm={12} md={2}>
                            <FormControl style={{ width: '100%' }}>
                                <Autocomplete
                                    multiple
                                    disablePortal
                                    options={supplierList}
                                    // getOptionLabel={(option) => option.title}
                                    // sx={{ width: 300 }}
                                    size="small"
                                    renderInput={(params) => <TextField {...params} label="Select Supplier" onChange={handleSupplierChange} />}
                                    onChange={(event, value) => handleSupplierSelect(value)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2} >
                            <FormControl fullWidth sx={{ minWidth: 200 }}>
                                <InputLabel id="demo-simple-select-label">Choose Option</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedValue}
                                    label="Choose Option"
                                    onChange={handleChange}
                                    style={{ height: "40px" }}
                                >
                                    {/* <MenuItem value="">
          <em>None</em>
        </MenuItem> */}
                                    <MenuItem value={'0'}>Both</MenuItem>
                                    <MenuItem value={'1'}>With PO</MenuItem>
                                    <MenuItem value={'2'}>Without PO</MenuItem>
                                </Select>
                            </FormControl>
                            {/* <FormControl style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={selectedRadio}
                                    onChange={(e) => setSelectedRadio(e.target.value)}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="Without Po" />
                                    <FormControlLabel value="0" control={<Radio />} label="With Po" />
                                </RadioGroup>
                            </FormControl> */}
                        </Grid>

                        <Grid item xs={4} sm={4} md={3} lg={3} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', columnGap: '20px' }}>
                            <Button variant="contained" style={{ backgroundColor: '#002D68' }} onClick={handleReportView}>
                                {loading ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'View'}
                            </Button>

                            <Button
                                style={{ background: lotwsieReportData.length === 0 ? 'gray' : '#002D68', color: '#fff', }}
                                variant="contained"
                                disabled={lotwsieReportData.length === 0}
                                onClick={handleDownload}
                            >
                                Export to Excel
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Box sx={{ height: screenHeight - 435, width: '100%', overflow: 'auto' }}>
                                <table id="purchase">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PRINTPBNO</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PBDATE</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SUPPLIER</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SITEMCODE</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SITEMNAME</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>UOMCODE</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SCHDATE</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>INVQTY</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>RCVDQTY</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>ACCEPTQTY</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>REJQTY</th>
                                            {/* <th style={{ width: '150px', whiteSpace: 'nowrap' }}>DIFF</th> */}
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>REMARKS</th>

                                        </tr>
                                    </thead>

                                    <tbody>
                                        {lotwsieReportData.map((item, itemKey) => (
                                            <tr key={itemKey} style={{ width: '150px' }}>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.poNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.date}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.spName}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.uom}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.schDate}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.invQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.rcvdQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.accQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.rejQty}</td>
                                                {/* <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.pendingQty}</td> */}
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemRemarks}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box>
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
        </div>
    )
}
export default InwardDiscrepancyReport;

