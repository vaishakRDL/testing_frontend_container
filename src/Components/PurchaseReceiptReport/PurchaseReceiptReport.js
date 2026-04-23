import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PurchaseReportSearchSupplier, PurchaseReportSearchItem, GetPuchaseReport, GetPuchaseOrderAganistPOReport, PurchaseOrderGroup, PurchaseBillReceiptReport } from "../../ApiService/LoginPageService";
import './PurchaseReceiptReport.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const PurchaseReceiptReport = () => {

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [supplierList, setSupplierList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setTodate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // gives YYYY-MM-DD
    });
    const [selectedSupplier, setSelectedSupplier] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [poReportData, setPoReportData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('Summary');
    const [itemGroupLists, setItemGroupLists] = useState([]);
    const [selectedItemGroup, setSelectedItemGroup] = useState([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };
        PurchaseOrderGroup(handleItemGroupSuccess, handleItemGroupException)

        // Add event listener to update height on resize
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const handleItemGroupSuccess = (dataObject) => {
        setItemGroupLists(dataObject?.data || []);
    }
    const handleItemGroupException = () => { }


    const handleGroupChange = (value) => {
        if (value !== null) {
            const idArray = value.map((item) => item.id)
            setSelectedItemGroup(idArray)
        }
    }


    // SUPPLIER SEARCH
    const handleSupplierChange = (e) => {
        PurchaseReportSearchSupplier({ code: e.target.value }, handleSearchSupplierSucessShow, handleSearchSupplierExceptionShow);
    }

    const handleSearchSupplierSucessShow = (dataObject) => {
        setSupplierList(dataObject?.data || []);
    }
    const handleSearchSupplierExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSupplierSelect = (value) => {
        if (value !== null) {
            const ids = value.map(item => item.id);
            setSelectedSupplier(ids)
        }
    };

    // ITEM SEARCH
    const handleItemChange = (e) => {
        PurchaseReportSearchItem({ code: e.target.value }, handleSearchItemSucessShow, handleSearchItemExceptionShow);
    }

    const handleSearchItemSucessShow = (dataObject) => {
        setItemList(dataObject?.data || []);
    }
    const handleSearchItemExceptionShow = (errorObject, errorMessage) => {
    }

    const handleItemSelect = (value) => {
        if (value !== null) {
            const ids = value.map(item => item.id);
            setSelectedItem(ids)
        }
    };

    const handleReportView = () => {
        setLoader(true)
        setLoading(true);
        PurchaseBillReceiptReport(
            {
                from: fromDate,
                to: toDate,
                supplier: selectedSupplier,
            }, handleGetReportSuccess, handleGetReportException)
    }

    const handleGetReportSuccess = (dataObject) => {
        setLoader(false)
        setPoReportData(dataObject?.data || [])
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
    //     // Format data to match the table structure
    //     const formattedData = poReportData.map((supp) => ({
    //       " SI No"  : supp.sNo,
    //         "Supplier" : supp.spCode,
    //        " Item Group" : supp.itemGroup,
    //        " Part No" : supp.itemCode,
    //         "Part Description" : supp.itemName,
    //        " UOM" : supp.uomName,
    //         "Location" : supp.location,
    //        " PO Quantity" : supp.poQty,
    //        " Receipt Quantity" : supp.rcvdQty,
    //        " Percentage" : supp.percentage
    //     })); const workbook = arrayToWorksheet(formattedData);
    //     downloadExcelFile(workbook, 'PO_Report.xlsx');
    // };
    const handleDownload = () => {
        // Format data to match the table structure
        const formattedData = poReportData.map((supp) => ({
            " SI No": Number(supp.sNo || 0),
            "Supplier": supp.spCode,
            " Item Group": supp.itemGroup,
            " Part No": supp.itemCode,
            "Part Description": supp.itemName,
            " UOM": supp.uomName,
            "Location": supp.location,

            // numeric fields converted
            " PO Quantity": Number(supp.poQty || 0),
            " Receipt Quantity": Number(supp.rcvdQty || 0),
            " Percentage": Number(supp.percentage || 0),
        }));

        const workbook = arrayToWorksheet(formattedData);
        downloadExcelFile(workbook, "PO_Report.xlsx");
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

    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Purchase vs Receipt Report
                </Typography>
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
                                onChange={handleFromDateChange}
                            />
                            <TextField
                                id="outlined-basic"
                                type="date"
                                label="To"
                                variant="outlined"
                                InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                                size="small"
                                value={toDate}
                                onChange={(e) => setTodate(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} md={2} lg={2}>
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
                        </Grid>

                        <Grid item xs={12} sm={3} md={3} lg={3} style={{ display: 'flex', flexDirection: 'row', columnGap: '10px' }}>
                            <Button variant="contained" style={{ backgroundColor: '#002D68' }} onClick={handleReportView}>
                                {loading ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'View'}
                            </Button>

                            <Button
                                style={{ background: '#002D68', color: '#fff', height: '40px', width: '250px' }}
                                variant="contained"
                                // disabled={rows.length === 0}
                                onClick={handleDownload}
                            >
                                Export to Excel
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>

                            <Box sx={{ height: screenHeight - 335, width: '100%', overflow: 'auto' }}>

                                <table id="purchase">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SI No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Supplier</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Group</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Part No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Part Description </th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>UOM</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Location</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PO Quantity</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Receipt Quantity</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Percentage</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {poReportData.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.sNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.spCode}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemGroup}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.uomName}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.location}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.poQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.rcvdQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.percentage}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>


                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    )
}
export default PurchaseReceiptReport;