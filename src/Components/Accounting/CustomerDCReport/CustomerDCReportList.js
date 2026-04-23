// import { Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField, Typography } from '@mui/material'
// import { DataGrid } from '@mui/x-data-grid';
// import React from 'react'
// import { useState } from 'react';

// const CustomerDCReportList = () => {
//     const [fromDate,setFromDate] = useState('');
//     const [toDate,setToDate] = useState('');
//     const [selectedRadio, setSelectedRadio] = useState('');
//     const [rows,setRows] = useState('');

//     const handleRadioChange = (event) => {
//         setSelectedRadio(event.target.value);
//     };

//     const columns = [
//         {
//             field: 'custname',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cust Name</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'custDcNo',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cust DC No</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'cdcNo',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>CDC No</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'custDCDate',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Cust DC Date</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'age',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Age</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'itemCode',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Code</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'itemName',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Name</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'uom',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'hsnCode',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>HSN Code</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'cdcQty',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>CDC Qty</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'invoicedqty',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Invoiced Qty</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'shortClosedQty',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Short Closed Qty</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'pendingqty',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Pending Qty</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//         {
//             field: 'rate',
//             headerClassName: 'super-app-theme--header',
//             headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Rate</span>,
//             type: 'string',
//             sortable: true,
//             minWidth: 80,
//             flex: 1,
//             align: 'center',
//             headerAlign: 'center',
//         },
//     ]

//     return (
//         <div>
//             <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
//                 <Typography
//                     sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
//                     variant="h5">
//                     Customer DC Report
//                 </Typography>
//             </div>
//             <from>
//                 <Grid container spacing={2} padding={1}>
//                     <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
//                         <TextField
//                             fullWidth
//                             label="From Date"
//                             placeholder='From Date'
//                             variant="outlined"
//                             required
//                             type='Date'
//                             size="small"
//                             style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
//                             onChange={(e) => {setFromDate(e.target.value) }}
//                             value={fromDate}
//                             InputLabelProps={{
//                                 shrink: true
//                             }}
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
//                         <TextField
//                             fullWidth
//                             label="To Date"
//                             placeholder='To Date'
//                             variant="outlined"
//                             required
//                             type='Date'
//                             size="small"
//                             style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
//                             onChange={(e) => {setToDate(e.target.value) }}
//                             value={toDate}
//                             InputLabelProps={{
//                                 shrink: true
//                             }}
//                         />
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
//                         <RadioGroup row value={selectedRadio} onChange={handleRadioChange} >
//                             <FormControlLabel value="docNoRadio1" control={<Radio />} label="Detailed" />
//                             <FormControlLabel value="docNoRadio2" control={<Radio />} label="Summary" />
//                             <FormControlLabel value="docNoRadio3" control={<Radio />} label="All" />
//                             <FormControlLabel value="docNoRadio4" control={<Radio />} label="Pending" />
//                         </RadioGroup>
//                     </Grid>
//                     <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
//                         <Button variant="contained" type="submit" style={{ height: '30px',backgroundColor: '#002d68' }}>
//                             View
//                         </Button>
//                     </Grid>
//                     <Grid item xs={12} sm={4} md={12} lg={12} xl={12}>
//                         <FormControl style={{ display: 'flex', flexDirection: 'row' }}>
//                             <FormControlLabel
//                                 control={<Checkbox />}
//                                 label={<Typography variant="body1" style={{ fontWeight: 'bold' }}>Select ItemCode</Typography>}
//                             />
//                             <FormControlLabel
//                                 control={<Checkbox />}
//                                 label={<Typography variant="body1" style={{ fontWeight: 'bold' }}>Select Party</Typography>}
//                             />
//                             <FormControlLabel
//                                 control={<Checkbox />}
//                                 label={<Typography variant="body1" style={{ fontWeight: 'bold' }}>Select Customer</Typography>}
//                             />
//                         </FormControl>
//                     </Grid>
//                 </Grid>
//                 <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2} spacing={2} padding={1}>
//                     <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%', border: '1px solid black', }}>
//                         <CardContent>
//                             <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end',marginBottom:'5px' }}>
//                                 <Button variant="contained" type="submit" style={{ height: '30px', backgroundColor: '#002d68' }}>
//                                     SAVE
//                                 </Button>
//                             </div>
//                             <DataGrid
//                                 rows={rows}
//                                 // rows={[]}
//                                 columns={columns}
//                                 // loading={isLoading}
//                                 pageSize={8}
//                                 style={{ height: '310px' }}
//                                 rowsPerPageOptions={[8]}
//                                 disableSelectionOnClick
//                                 rowHeight={40}
//                                 columnHeaderHeight={40}
//                             />
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </from>
//         </div>
//     )
// }

// export default CustomerDCReportList

import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import './CustomerDCReportList.css';
import { AccCustomerDcReportItem, AccCustomerDcReportSearch, CustomerDcReport } from "../../../ApiService/LoginPageService";
import NotificationBar from "../../GlobleFiles/ServiceNotificationBar";
import { CustomerDCReportDownload } from "../../../ApiService/DownloadCsvReportsService";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
const CustomerDCReportList = () => {
    const [selectedradio, setSelectedRadio] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [supplierList, setSupplierList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setTodate] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedToDate, setSelectedToDate] = useState('');
    const [selectedFilterRadio, setSelectedFilterRadio] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [poReportData, setPoReportData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
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
    // FINANCIAL YEAR
    useEffect(() => {
        // Initialize with the current financial year based on today's date
        const today = new Date(); // e.g., 2025-08-09
        const currentYear = today.getFullYear();
        const isAfterApril = today.getMonth() >= 3; // month is 0-based (April = 3)

        // Financial year starts on April 1
        const financialYearStart = isAfterApril
            ? `${currentYear}-04-01`
            : `${currentYear - 1}-04-01`;

        const formattedToday = today.toISOString().split('T')[0]; // e.g., "2025-08-09"

        setFromDate(financialYearStart);
        setTodate(formattedToday);
    }, []);

    const handleFromDateChange = (e) => {
        const selectedFromDate = e.target.value;
        setFromDate(selectedFromDate);


    };

    const top100Films = [
        { title: 'The Shawshank Redemption', year: 1994 },
        { title: 'The Godfather', year: 1972 },
        // other film objects...
    ];

    // SUPPLIER SEARCH
    const handleSupplierChange = (e) => {
        AccCustomerDcReportSearch({ code: e.target.value }, handleSearchSupplierSucessShow, handleSearchSupplierExceptionShow);
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
        AccCustomerDcReportItem({ code: e.target.value }, handleSearchItemSucessShow, handleSearchItemExceptionShow);
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
        CustomerDcReport(
            {
                from: fromDate,
                to: toDate,
                customer: selectedSupplier,
                items: selectedItem,
                type: selectedradio
            }, handleGetReportSuccess, handleGetReportException)
    }

    const handleGetReportSuccess = (dataObject) => {
        setPoReportData(dataObject?.data || [])
        setTimeout(() => {
            setLoader(false)
        }, 2000);
    }
    const handleGetReportException = () => {
        setTimeout(() => {
            setLoader(false)
        }, 2000);
    }

    /////////////////////////////////////
    const data = [
        {
            supplierId: 4160,
            spName: "SULAX TECHNOLOGIES PRIVATE LIMITED",
            gst: "789",
            po: [
                {
                    poNo: "24/R/1036",
                    poType: "REGULAR",
                    poDate: "15-07-2024",
                    items: [
                        {
                            id: 1,
                            sNo: 1,
                            itemId: 10687,
                            itemCode: "NAA285DZ1",
                            itemName: "IP55 DOOR ( NAA308GN1 )",
                            uom: "Nos",
                            unitRate: 324,
                            value: "3240",
                            qty: "10"
                        }
                    ]
                },
                {
                    poNo: "24/R/1037",
                    poType: "OPEN PO",
                    poDate: "15-07-2024",
                    items: [
                        {
                            id: 1,
                            sNo: 1,
                            itemId: 10687,
                            itemCode: "NAA285DZ1",
                            itemName: "IP55 DOOR ( NAA308GN1 )",
                            uom: "Nos",
                            unitRate: 324,
                            value: "16200",
                            qty: "50"
                        },
                        {
                            id: 2,
                            sNo: 2,
                            itemId: 22433,
                            itemCode: "NAA285GN1",
                            itemName: "IP 55 DOOR WELDMENT",
                            uom: "Nos",
                            unitRate: 110,
                            value: "880",
                            qty: "8"
                        }
                    ]
                },
                {
                    poNo: "24/R/1039",
                    poType: "REGULAR",
                    poDate: "24-07-2024",
                    items: [
                        {
                            id: 1,
                            sNo: 1,
                            itemId: 10687,
                            itemCode: "NAA285DZ1",
                            itemName: "IP55 DOOR ( NAA308GN1 )",
                            uom: "Nos",
                            unitRate: 325,
                            value: null,
                            qty: null
                        }
                    ]
                }
            ]
        },
        {
            supplierId: 4161,
            spName: "SULAX TECHNOLOGIES PVT. LTD",
            gst: "2",
            po: [
                {
                    poNo: "24/R/1038",
                    poType: "REGULAR",
                    poDate: "24-07-2024",
                    items: [
                        {
                            id: 1,
                            sNo: 1,
                            itemId: 10687,
                            itemCode: "NAA285DZ1",
                            itemName: "IP55 DOOR ( NAA308GN1 )",
                            uom: "Nos",
                            unitRate: 325,
                            value: "3250",
                            qty: "10"
                        }
                    ]
                }
            ]
        }
    ];


    // const handleReportDownload = () => {
    //     setLoader(true)
    //     CustomerDCReportDownload({
    //         from: fromDate,
    //         to: toDate,
    //         customer: selectedSupplier,
    //         items: selectedItem
    //     }, handleDownloadSuccess, handleDownloadException)
    // }

    // const handleDownloadSuccess = () => {
    //     setLoader(false)
    //     setNotification({
    //         status: true,
    //         type: 'success',
    //         message: "Download Success",
    //     });
    // }
    // const handleDownloadException = () => {
    //     setLoader(false)
    //     setNotification({
    //         status: true,
    //         type: 'error',
    //         message: "Failed to download",
    //     });
    // }




    const handleReportDownload = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('PO Report');

        // Define headers
        const headers = [
            "Customer Name",
            "GST No",
            "Customer DC No",
            "CDC No",
            "CDC Date",
            "Customer Dc Date",
            "Age",
            "Item Code",
            "Item Name",
            "UOM",
        ];

        if (selectedradio === 'Detailed') {
            headers.push("Inv No", "Inv Date", "NRDC No", "NRDC Date");
        }

        headers.push(
            "HSN Code",
            "CDC Qty",
            "Invoiced Qty",
            "Short Closed Qty",
            "Pending Qty",
            "Cumulative Qty",
            "Rate"
        );

        // Add header row
        worksheet.addRow(headers);
        worksheet.getRow(1).font = { bold: true };
        worksheet.columns = headers.map(() => ({ width: 20 }));

        // Add rows (flattened, no merging)
        poReportData.forEach((supp) => {
            supp.po.forEach((po) => {
                po.items.forEach((item) => {
                    const row = [
                        supp.cName,
                        supp.gst,
                        po.custDcNo,
                        po.cdcNo,
                        po.cdcDate,
                        po.custDcDate,
                        po.daysDiff,
                        item.itemCode,
                        item.itemName,
                        item.uom,
                    ];

                    if (selectedradio === 'Detailed') {
                        row.push(item.invNo, item.invDate, item.nrdc_No, item.nrdcDate);
                    }

                    row.push(
                        item.hsnCode,
                        item.cdcQty,
                        item.invQty,
                        item.shortQty,
                        item.pendingQty,
                        item.cumQty,
                        item.unitRate
                    );

                    worksheet.addRow(row);
                });
            });
        });

        // Export the Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, 'PO_Report_Simple.xlsx');
    };


    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };
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
                    Customer DC Report
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
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={selectedradio}
                                    onChange={(e) => {
                                        setSelectedRadio(e.target.value);
                                        setPoReportData([]);
                                    }}
                                >
                                    <FormControlLabel value="Detailed" control={<Radio />} label="Detailed" />
                                    <FormControlLabel value="Summary" control={<Radio />} label="Summary" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4} md={4} lg={4}>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    <FormControlLabel value="All" control={<Radio />} label="All" />
                                    <FormControlLabel value="Pending" control={<Radio />} label="Pending " />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
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
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <Autocomplete
                                multiple
                                disablePortal
                                options={supplierList}
                                // getOptionLabel={(option) => option.title}
                                // sx={{ width: 300 }}
                                size="small"
                                renderInput={(params) => <TextField {...params} label="Select Customer" onChange={handleSupplierChange} />}
                                onChange={(event, value) => handleSupplierSelect(value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={3} lg={3}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={[]}
                                renderInput={(params) => <TextField {...params} label="Select Item Group" />}
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} sm={1.5} md={1.5} lg={1.5}>
                            <Button variant="contained" style={{ height: '30px', backgroundColor: '#002d68' }} onClick={handleReportView}>
                                {loader ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'View'}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={1.5} md={1.5} lg={1.5}>
                            <Button variant="contained" style={{ backgroundColor: '#002D68', marginTop: '2px' }} onClick={handleReportDownload}>Download</Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Box sx={{ height: screenHeight - 435, width: '100%', overflow: 'auto' }}>
                                <table id="purchase">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Customer Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>GST No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Customer DC No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>CDC No</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>CDC Date</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Customer Dc Date</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Age</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Code</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Item Name</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>UOM</th>
                                            {/* <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Delivery Challen</th> */}
                                            {selectedradio === 'Detailed' &&
                                                <>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Inv No</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Inv Date</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>NRDC No</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>NRDC Date</th>
                                                    {/* <th style={{ width: '150px', whiteSpace: 'nowrap' }}>po_ref</th> */}
                                                </>
                                            }
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>HSN Code</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>CDC Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Invoiced Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Short Closed Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Pending Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Cummulative Qty</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Rate</th>
                                            <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {poReportData.map((supp, suppKey) => (
                                            <React.Fragment key={suppKey}>
                                                {supp.po.map((PO, poKey) => (
                                                    <React.Fragment key={poKey}>
                                                        {PO.items.map((item, itemKey) => (
                                                            <tr key={itemKey} style={{ width: '150px' }}>

                                                                {/* Only show supplier name and GST on the first PO for that supplier */}
                                                                {itemKey === 0 && poKey === 0 ? (
                                                                    <>
                                                                        <td rowSpan={supp.po.reduce((total, po) => total + po.items.length, 0)} style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.cName}</td>
                                                                        <td rowSpan={supp.po.reduce((total, po) => total + po.items.length, 0)} style={{ width: '150px', whiteSpace: 'nowrap' }}>{supp.gst}</td>
                                                                    </>
                                                                ) : null}

                                                                {/* Only show PO number, date, and type on the first item of each PO */}
                                                                {itemKey === 0 ? (
                                                                    <>
                                                                        <td rowSpan={PO.items.length} style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.custDcNo}</td>
                                                                        <td rowSpan={PO.items.length} style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.cdcNo}</td>
                                                                        <td rowSpan={PO.items.length} style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.cdcDate}</td>
                                                                        <td rowSpan={PO.items.length} style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.custDcDate}</td>
                                                                        <td rowSpan={PO.items.length} style={{ width: '150px', whiteSpace: 'nowrap' }}>{PO.daysDiff}</td>
                                                                    </>
                                                                ) : null}

                                                                {/* Always show item details */}
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemCode}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.itemName}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.uom}</td>
                                                                {/* <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.dcNO}</td> */}
                                                                {selectedradio === 'Detailed' &&
                                                                    <>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.invNo}</td>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.invDate}</td>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.nrdc_No}</td>
                                                                        <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.nrdcDate}</td>
                                                                        {/* <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.po_ref}</td> */}
                                                                    </>}
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.hsnCode}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.cdcQty}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.invQty}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.shortQty}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.pendingQty}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.cumQty}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.unitRate}</td>
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }}>{item.value}</td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            </React.Fragment>
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
export default CustomerDCReportList;