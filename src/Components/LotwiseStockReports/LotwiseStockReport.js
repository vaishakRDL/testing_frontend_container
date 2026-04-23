
import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { LotwiseStockReportList, PurchaseReportSearchItem, GetPuchaseReport, GetJobWorkIssueReport, ItemSearchNAAJ, GetSuppVsItemAllSuppList, GetSearchedItems } from "../../ApiService/LoginPageService";
// import './JobWorkIssueReport.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';


const LotwiseStockReport = () => {

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [selectedItemId, setSelectedItemId] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const today = new Date().toISOString().split("T")[0];

    const [toDate, setTodate] = useState(today);

    const [lotwsieReportData, setLotwiseReportData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('0');
    console.log('selectedRadioselectedRadio', selectedRadio)
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [fyFrom, setFyFrom] = useState("");
    const [fyTo, setFyTo] = useState("");
    const [loading, setLoading] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: "error",
        message: "",
    });
    useEffect(() => {
        GetSearchedItems({ code: '' }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);

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
    //     // Flatten data to match the frontend table structure
    //     const formattedData = lotwsieReportData.map((data) => ({
    //         "ITEMGROUPCODE	L": data?.supplier,
    //         "LOCCODE": data?.gstNo,
    //         "SITEMCODE": data?.stateCode,
    //         "SITEMNAME": data?.originalChallanNoByPrincipal,
    //         "LOTNO": data?.originalChallanDateByPrincipal,
    //         "EXPDATE": data?.challanNoByWorker,
    //         "OPQTY": data?.challanDateByWorker,
    //         "RCPTQTY": data?.jobWorkNature,
    //         "ISSQTY": data?.hsn,

    //     }));


    //     const workbook = arrayToWorksheet(formattedData);
    //     downloadExcelFile(workbook, 'Job Work Issue Report.xlsx');
    // };
    const handleDownload = () => {
        const formattedData = lotwsieReportData.map((item) => ({
            "ITEM GROUP": item?.itemGroup,
            "SUPPLIER CODE": item?.spCode,
            "SUPPLIER NAME": item?.spName,
            "LOCATION": item?.location,
            "GRN NO": item?.poNo,
            "ITEM CODE": item?.itemCode,
            "ITEM NAME": item?.itemName,
            "LOT NO": item?.lotNo,
            "EXPIRY DATE": item?.expiry,

            // Numeric values
            "LOT QTY": Number(item?.lotQty || 0),
            "ISSUE QTY": Number(item?.issueQty || 0),
        }));

        const workbook = arrayToWorksheet(formattedData);
        downloadExcelFile(workbook, "Lotwise_Report.xlsx");
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

    // AUTOCOMPLETE ITEM SEARCH
    const handleChange = (e) => {
        GetSearchedItems({ code: e.target.value }, handleItemVsProcessItemSucessShow, handleItemVsProcessItemExceptionShow);
    };

    const handleItemVsProcessItemSucessShow = (dataObject) => {
        setItemList(dataObject?.data || []);
    };
    const handleItemVsProcessItemExceptionShow = (errorObject, errorMessage) => {
    }
    const handleSearchItemChange = (value) => {
        if (value !== null) {
            const idArray = value.map((item) => item.id)
            console.log("idArray", idArray)
            setSelectedItemId(idArray)
        }
    }
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const handleReportView = () => {
        setLoader(true)
        setLoading(true);
        LotwiseStockReportList(
            {
                fromDate: fromDate,
                toDate: toDate,
                category: selectedRadio,
                items: selectedItemId,
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
    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Lotwise Stock Reports </Typography>
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
                            <Autocomplete
                                multiple
                                size="small"
                                id="checkboxes-tags-demo"
                                options={itemList}
                                disableCloseOnSelect
                                getOptionLabel={(option) => option.label}
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.label}
                                    </li>
                                )}
                                renderInput={(params) => <TextField {...params} label="Search Items" onChange={handleChange} />}
                                onChange={(event, value) => handleSearchItemChange(value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} >
                            <FormControl style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                            </FormControl>
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
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>ITEMGROUPCODE</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SUPPLIER CODE</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SUPPLIER NAME</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>LOCCODE</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>GRN NO</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SITEM CODE</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SITEMNAME</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>LOTNO</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>EXPDATE</th>
                                            {/* <th style={{ width: '150px', whiteSpace: 'nowrap' }}>OPQTY</th> */}
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>RCPTQTY</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>ISSQTY</th>

                                        </tr>
                                    </thead>

                                    <tbody>
                                        {lotwsieReportData.map((item, itemKey) => (
                                            <tr key={itemKey} style={{ width: '150px' }}>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemGroup}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.spCode}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.spName}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.location}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.poNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.lotNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.expiry}</td>
                                                {/* <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.jwiQty}</td> */}
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.lotQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.issueQty}</td>

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
export default LotwiseStockReport;