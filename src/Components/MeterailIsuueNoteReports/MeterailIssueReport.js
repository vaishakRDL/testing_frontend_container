import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
// import './JobWorkIssueReport.css';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import { MeterialIssueNoteReportList } from "../../ApiService/LoginPageService";

const MeterailIssueReport = () => {

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [fromDate, setFromDate] = useState('');

    const [meterailissueNoteList, setMeterailIssueNoteList] = useState([]);
    const [loader, setLoader] = useState(false);

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



    const handleReportView = () => {
        setLoader(true)
        setLoading(true);
        MeterialIssueNoteReportList(
            {
                fromDate: fromDate,
                toDate: toDate,
            }, handleGetReportSuccess, handleGetReportException)
    }

    const handleGetReportSuccess = (dataObject) => {
        setLoader(false)
        console.log(dataObject.data)
        setMeterailIssueNoteList(dataObject?.data || [])
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
    "MINNO": data?.MINNO,
    "MINDATE": data?.MINDATE,
    "LOCNAME": data?.LOCNAME,
    "SITEMCODE": data?.SITEMCODE,
    "SITEMNAME": data?.SITEMNAME,
    "UOMCODE": data?.UOMCODE,
    "SRNID": data?.SRNID,
    "SRNNO": data?.SRNNO,

    // numeric field
    "MINQTY": Number(data?.MINQTY || 0),
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



    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Material Issue Note Report
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
                        <Grid item xs={12} sm={8} md={8} lg={8} style={{ display: 'flex', justifyContent: 'flex-start' }}>
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

                        <Grid item xs={12} sm={4} md={4} lg={4} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', columnGap: '20px' }}>
                            <Button variant="contained" style={{ backgroundColor: '#002D68' }} onClick={handleReportView}>
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
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>MINNO</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>MINDATE</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Location Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Sitem Code</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Sitem Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>UOM CODE</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SRNID</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>SRNNO</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>MINQTY</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {meterailissueNoteList.map((item, itemKey) => (
                                            <tr key={itemKey} style={{ width: '150px' }}>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.SNO}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.MINNO}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.MINDATE}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.LOCNAME}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.SITEMCODE}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.SITEMNAME}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.UOMCODE}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.SRNID}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.SRNNO}</td>
                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.MINQTY}</td>

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
export default MeterailIssueReport;