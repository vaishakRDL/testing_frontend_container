import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, LinearProgress, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import './ItemwiseReport.css';
import { ScrapMstGetMaterial, MachineShowData, ScrapReportAnalysisReport, CustomerDropShowdata, PartNoSelectShow, GetItemwiseReport, NEDCItemWiseReport } from "../../../../ApiService/LoginPageService";
import NotificationBar from "../../../GlobleFiles/ServiceNotificationBar";
import { ScrapAnalysisReportDownload } from "../../../../ApiService/DownloadCsvReportsService";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const NRDCItemReport = () => {

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
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedToDate, setSelectedToDate] = useState('');
    const [selectedFilterRadio, setSelectedFilterRadio] = useState('Today');

    const [partNo, setPartNo] = useState([]);
    const [partNoList, setPartNoList] = useState([]);

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
        NEDCItemWiseReport(
            {
                from: fromDate,
                to: toDate,
                item: partNo,
                customer: customerSelect
            }, handleGetReportSuccess, handleGetReportException)
    }

    const handleGetReportSuccess = (dataObject) => {
        setLoader(false)
        setReportData(dataObject?.data || [])
    }
    const handleGetReportException = (errorObject, errorMessage) => {
        setLoader(false)
    }


    const handleReportDownload = () => {
        const table = document.getElementById('customers');
        if (!table) return;

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');

        const rows = table.querySelectorAll('tr');

        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('th, td');
            const excelRow = [];

            cells.forEach((cell) => {
                // Remove commas if present in numbers, optional
                const value = cell.textContent?.trim().replace(/,/g, '') || '';
                excelRow.push(value);
            });

            worksheet.addRow(excelRow);
        });

        // Optional: auto width for columns
        worksheet.columns.forEach((column) => {
            let maxLength = 10;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const cellValue = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, cellValue.length);
            });
            column.width = maxLength + 2;
        });

        // Download
        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'NRDC_Report.xlsx');
        });
    };
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


    const handleFromDateChange = (e) => {
        const selectedFromDate = e.target.value;
        setFromDate(selectedFromDate);

        const fromYear = new Date(selectedFromDate).getFullYear();
        const isAfterApril = new Date(selectedFromDate).getMonth() >= 3;

        const financialYearEnd = isAfterApril
            ? `${fromYear + 1}-03-31`
            : `${fromYear}-03-31`;

        setTodate(financialYearEnd);
    };
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
            setCustomerSelect(idArray)
        }
    }

    // MULTI SELECTION AUTOCOMPLETE
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    ////////////////////HANDLE ITEM CHANGE//////////////////////////
    const handleChange = (e) => {
        PartNoSelectShow(
            { code: e.target.value, id: customerSelect },
            handlePartNoDropshow,
            handlePartNoDropshowException
        );
    };

    const handlePartNoDropshow = (dataObject) => {
        setPartNoList(dataObject?.data || []);
    };

    const handlePartNoDropshowException = (error, errorMessage) => { };

    const onPartNoSelectChange = (value) => {
        if (value !== null) {
            const idArray = value.map((item) => item.id)
            console.log("idArray", idArray)
            setPartNo(idArray)
        }
    }

    const handleRadioChange = (event) => {
        setLoader(false)
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
                    NRDC Item Wise
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
                        <Grid item xs={12} sm={12} md={2} lg={2}>
                            <FormControl style={{ width: '100%' }}>
                                <Autocomplete
                                    multiple
                                    id="checkboxes-tags-demo"
                                    options={partNoList}
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
                                    size="small"
                                    renderInput={(params) => <TextField {...params} label="Search Part No" onChange={handleChange} />}
                                    onChange={(event, value) => onPartNoSelectChange(value)}
                                />
                            </FormControl>
                        </Grid>
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
                                onChange={handleFromDateChange}
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
                                {loader ? (
                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                ) : 'View'}
                            </Button>
                            <Button variant="contained" style={{ backgroundColor: '#002D68', marginTop: '2px' }} onClick={handleReportDownload}>Download</Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            {/* {reportData.length > 0 ? */}
                            <Box sx={{ height: screenHeight - 310, width: '100%', overflow: 'auto' }}>

                                <table border="1" style={{ borderCollapse: "collapse", width: "100%", zoom: '80%' }} id="customers">
                                    <thead>
                                        <tr>
                                            <th style={{ whiteSpace: 'nowrap' }}>Cust Name</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>NRDC No</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>NRDC Date</th>
                                            {/* <th style={{ whiteSpace: 'nowrap' }}>Bill Add</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Ship Add </th> */}
                                            <th style={{ whiteSpace: 'nowrap' }}>Challen No</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Challen Date</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>GST No</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Item Code</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Item Name</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>HSN Code</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>UOM Code</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>NRDC Qty</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>NRDC Rate</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>NRDC Amt</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Vehical No</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Transport Date</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Transporter GstIn</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Shipping Pin Code</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Total State Code </th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Actual State Code</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>CGST</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>SGST</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>TotalValue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData &&
                                            reportData.map((item, index) => {
                                                const isEmpty = item.itemCode === "";
                                                const bgColor = isEmpty ? "#4a4947" : "#ffffff";
                                                const textColor = isEmpty ? "#ffffff" : "#000000";

                                                return (
                                                    <tr key={index}>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.cName}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.nrdcNo}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.nrdcDate}</td>
                                                        {/* <td style={{ backgroundColor: bgColor, color: textColor }}>{item.billAdd}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.shipAdd}</td> */}
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.cust_Dc_no}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>
                                                            {item.customerDcDate}
                                                        </td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.gstno}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.itemCode}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.itemName}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.hsnCode}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.uom}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.nrdcQty}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.nrdcRate}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.nrdcAmt}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.vechileNo}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>
                                                            {new Date(item.transportDate).toLocaleDateString()}
                                                        </td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.transporterGstin}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.shippingPincode}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.toStateCode}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.actualStateCode}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.cgst}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.sgst}</td>
                                                        <td style={{ backgroundColor: bgColor, color: textColor }}>{item.totalValue}</td>
                                                    </tr>
                                                );
                                            })}
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
export default NRDCItemReport;