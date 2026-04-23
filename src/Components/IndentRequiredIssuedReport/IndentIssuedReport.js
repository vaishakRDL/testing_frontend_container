import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
// import './JobWorkIssueReport.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { IndentReportList, ItemSearchNAAJ, MeterialIssueNoteReportList } from "../../ApiService/LoginPageService";

const IndentIssuedReport = () => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [fromDate, setFromDate] = useState('');
    const [itemShowListSeach, setItemShowListSeach] = useState([]);
    const [meterailissueNoteList, setMeterailIssueNoteList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedName, setSelectedName] = useState(null);

    const [fyFrom, setFyFrom] = useState("");
    const today = new Date().toISOString().split("T")[0];

    const [toDate, setTodate] = useState(today);
    const [fyTo, setFyTo] = useState("");
    const [loading, setLoading] = useState(false);
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



    const handleReportView = (requestedPage = 1) => {
        setLoader(true);
        setLoading(true);

        IndentReportList(
            {
                fromDate,
                toDate,
                page: requestedPage,
                itemCode: selectedName  // send page number
            },
            (response) => handleGetReportSuccess(response, requestedPage),
            handleGetReportException
        );
    };


    const handleGetReportSuccess = (response, requestedPage) => {
        setMeterailIssueNoteList(response.data);          // Replace table data
        setTotalPages(response.totalPages || 1);         // Store total pages from API (adjust field name)
        setPage(response.page);                    // from backend
        setLoader(false);
        setLoading(false);
        setSelectedName("");
    };

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
    //     const formattedData = meterailissueNoteList.map((data) => ({
    //         "MINNO": data?.MINNO,
    //         "MINDATE": data?.MINDATE,
    //         "LOCNAME": data?.LOCNAME,
    //         "SITEMCODE": data?.SITEMCODE,
    //         "SITEMNAME": data?.SITEMNAME,
    //         "UOMCODE": data?.UOMCODE,
    //         "SRNID": data?.SRNID,
    //         "SRNNO": data?.SRNNO,
    //         "MINQTY": Number(data?.MINQTY || 0),

    //     }))

    //     const workbook = arrayToWorksheet(formattedData);
    //     downloadExcelFile(workbook, '    Material Issue Note Report.xlsx');
    // };
    const handleDownload = () => {
        // Flatten data to match the frontend table structure
        const formattedData = meterailissueNoteList.map((data) => ({
            "srnNo": data?.srnNo,
            "itemCode": data?.itemCode,
            "itemName": data?.itemName,
            "srnQty": data?.srnQty,
            "srnDate": data?.srnDate,
            "issuedQty": data?.issuedQty,

            // numeric field
            // "MINQTY": Number(data?.MINQTY || 0),
        }));

        const workbook = arrayToWorksheet(formattedData);
        downloadExcelFile(workbook, "Material Issue Note Report.xlsx");
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

    const options = itemShowListSeach.map(item => ({
        id: item?.id,
        label: item?.label
    }));
    const textEntery = (e) => {

        ItemSearchNAAJ({
            text: e.target.value
        }, handleItemSearchNAAJSucees, handleItemSearchNAAJException);

    }

    const handleItemSearchNAAJSucees = (dataObject) => {
        setItemShowListSeach(dataObject?.data || []);
    }

    const handleItemSearchNAAJException = () => {

    }
    const handleAutocompleteChange = (selectedValue) => {
        setSelectedName(selectedValue?.label || "");
    };

    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Indent Issued Report
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
                        <Grid item xs={12} sm={6} md={6} lg={6} style={{ display: 'flex', justifyContent: 'flex-start' }}>
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

                            />

                        </Grid>
                        <Grid item sm={6} xs={12} md={3} lg={3} xl={3}>
                            <FormControl fullWidth >
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={options}
                                    // sx={{ width: 300, }}
                                    value={selectedName}
                                    size="small"
                                    getOptionLabel={(option) => option.label || selectedName}
                                    renderInput={(params) => <TextField   {...params} label="Search By Item Code "
                                        onChange={textEntery}
                                    // onClear={() => {
                                    //   console.log('success');
                                    // }} 
                                    />}
                                    onChange={(event, value) => handleAutocompleteChange(value)}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={3} md={3} lg={3} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', columnGap: '20px' }}>
                            <Button variant="contained" style={{ backgroundColor: '#002D68' }} onClick={() => handleReportView(1)}>
                                {loading ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'Submit'}
                            </Button>

                            <Button
                                style={{ background: meterailissueNoteList.length === 0 ? 'gray' : '#002D68', color: '#fff', }}
                                variant="contained"
                                disabled={meterailissueNoteList.length === 0}
                                onClick={handleDownload}
                            >
                                Export to Excel
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Box sx={{ height: screenHeight - 435, width: '100%', overflow: 'auto' }}>
                                <table id="purchase">
                                    <thead style={{ position: 'sticky' }}>
                                        <tr>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SNo</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SRN No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Code</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SRN QTY</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SRN Date</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Issued Qty</th>

                                        </tr>
                                    </thead>
                                    <tbody>

                                        {meterailissueNoteList.map((item, itemKey) => (
                                            <tr key={itemKey} style={{ width: '150px' }}>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.sNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.srnNo}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.srnQty}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.srnDate}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.issuedQty}</td>


                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box>
                            <Grid container justifyContent="flex-end" style={{ marginTop: '15px' }}>
                                <Button
                                    variant="contained"
                                    disabled={page === 1}
                                    onClick={() => handleReportView(page - 1)}
                                    style={{ marginRight: '10px' }}
                                >
                                    Previous
                                </Button>

                                <Typography style={{ fontWeight: 'bold', margin: '0 10px' }}>
                                    Page {page} of {totalPages}
                                </Typography>

                                <Button
                                    variant="contained"
                                    disabled={page === totalPages}
                                    onClick={() => handleReportView(page + 1)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Next
                                </Button>
                            </Grid>

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
export default IndentIssuedReport;