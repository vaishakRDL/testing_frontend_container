import React from 'react'
import { useState } from 'react';
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, FormControl, FormControlLabel, Grid, LinearProgress, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { CustomerCodeDropShow, CustomerDataShow, CustomerSelectItemShow, CustomervsItemPartShow, CustVsItemAdd } from '../../../ApiService/LoginPageService';
import CopyFromXl from './CopyFromXl';
import ImportXlCustItem from './ImportXlCustItem';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
const CustomerVsItemReport = () => {
    const [customerName, setCustomerName] = useState('');
    const [customerSelect, setCustomerSelect] = useState('');
    const [customerSelectList, setCustomerSelectList] = useState([]);
    const [partNoList, setPartNoList] = useState([]);
    const [rows, setRows] = useState([]);
    const [customerSid, setCustomerSid] = useState('');
    const [isLoading, setGridLoading] = useState(true);
    const [selectedCustomerName, setSelectedCustomerName] = useState('');
    const [cid, setcid] = useState('');
    const [file, setFile] = useState(null);
    const [copyFromModal, setCopyFromModal] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [excelModal, setExcelModal] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fyFrom, setFyFrom] = useState("");
    const [fyTo, setFyTo] = useState("");
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedToDate, setSelectedToDate] = useState('');

    const [selectedFilterRadio, setSelectedFilterRadio] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [itemListCopy, setItemListCopy] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChangeCustomer = (e) => {
        if (e !== null) {
            CustomerCodeDropShow({ code: e.target.value }, handleCustomerDropshow, handleCustomerDropshowException);
        }
    }

    const handleCustomerDropshow = (dataObject) => {
        const customerList = dataObject?.data || [];
        setCustomerSelectList(customerList);
        // const selectedCustomerId = customerList[0]?.cId;
        // console.log('Customer list data:', customerList);
        // if (selectedCustomerId) {
        //     const id = selectedCustomerId.split('-')[1]; 
        //     const numericId = Number(id);
        //     CustomerSelectItemShow({ id: numericId }, handlePartNoShowSuccess, handlePartNoSelectException);
        // }
    };

    const handleCustomerDropshowException = (error, errorMessage) => {
        console.log(errorMessage);
    }

    ///Customer Select
    const optionsCustList = Array.isArray(customerSelectList) ? customerSelectList.map(item => ({
        cId: item?.cId,
        label: item?.cCode,
        cName: item?.cName,
        id: item?.id,
    })) : [];

    const onCustomerSelectChange = (selectedValue) => {

        if (selectedValue) {
            setSelectedCustomerName(selectedValue?.label);
            setCustomerSelect(selectedValue?.id);
            setcid(selectedValue?.cId);
            setCustomerName(selectedValue?.cName);
        }
    };

    //PartNo select
    const optionsPartNoList = partNoList ? partNoList.map(item => ({
        value: item?.id,
        label: item?.label
    })) : [];

    const handlePartNoShowSuccess = (dataObject) => {
        setGridLoading(false);
        const data = dataObject?.data || [];
        setRows(data);
        const formattedData = data.map(item => ({
            id: item?.id || null,
            itemCode: item?.itemCode || '',
            itemName: item?.itemName || '',
            itemId: item?.itemId || '',
            hsnCode: item?.hsnCode || '',
            uomName: item?.uomName || '',
            rate: item?.rate || '',
            customerDesc: item?.customerDesc || ''
        }));
        // if (formattedData.length > 0) {
        //     const clonedSelectedItems = [...selectedItems];
        //     const lastObj = clonedSelectedItems.pop();
        //     clonedSelectedItems.push(...formattedData, lastObj);
        //     setSelectedItems(clonedSelectedItems);
        // }
        if (formattedData.length > 0) {
            const clonedSelectedItems = [];
            const lastObj = selectedItems.pop();
            clonedSelectedItems.push(...formattedData, lastObj);
            setSelectedItems(clonedSelectedItems);
        }
    };

    const handlePartNoSelectException = (errorObject, errorMessage) => {
        setRows([]);
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }

    const handleChange = (e) => {
        CustomervsItemPartShow({ code: e.target.value }, handlePartNoDropshow, handlePartNoDropshowException);
    }

    const handlePartNoDropshow = (dataObject) => {
        setPartNoList(dataObject?.data || []);
    }

    const onPartNoSelectChange = (value) => {
        if (value !== null) {
            const clonedSelectedItems = [...selectedItems];
            const lastObj = clonedSelectedItems.pop();
            clonedSelectedItems.push(value, lastObj);
            setSelectedItems(clonedSelectedItems);
        }
    };

    const handlePartNoDropshowException = (error, errorMessage) => {
        console.log(errorMessage);
    }

    const ClearData = () => {
        setSelectedItems([{ id: "RDL1" }]);
        setRows([]);
        setRefreshData((oldValue) => !oldValue);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Filter out the row where id is 'RDL1'
        const filteredItems = selectedItems.filter(item => item.id !== 'RDL1');

        // Check if any item has an invalid HSN Code (null, empty, or zero)
        const hasInvalidHsn = filteredItems.some(
            (data) => !data?.hsnCode || data.hsnCode === 0
        );

        if (hasInvalidHsn) {
            setNotification({
                status: true,
                type: 'error',
                message: 'HSN Code cannot be null or zero.',
            });
            return; // Stop execution if validation fails
        }

        // Prepare the items for submission
        const items = filteredItems.map((data) => ({
            itemId: data?.itemId,
            uomId: data?.uomId,
            hsnCode: data?.hsnCode,
            rate: data?.rate,
            customerDesc: data?.customerDesc,
        }));

        const requestData = {
            customerId: customerSelect,
            items: items.slice(0, -1),
        };

        CustVsItemAdd(requestData, handleSuccess, handleException);
    };


    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            setRefreshData(oldValue => !oldValue);
            ClearData();
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            setRefreshData(oldValue => !oldValue);
        }, 2000);
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleDeleteRow = (id) => {
        const newArray = selectedItems.filter((item) => item.id != id)
        setSelectedItems(newArray);
    }

    // const handleEdit = (cellNam, newValue, id, rowData) => {
    //     let updatedItems;
    //     switch (cellNam) {
    //         case "Customer Description":
    //             updatedItems = selectedItems.map((supp) =>
    //                 supp.id === id
    //                     ? { ...supp, customerDesc: newValue }
    //                     : supp
    //             );
    //             break;

    //         default:
    //             updatedItems = selectedItems;
    //             break;
    //     }
    //     switch (cellNam) {
    //         case "Rate":
    //             updatedItems = selectedItems.map((supp) =>
    //                 supp.id === id
    //                     ? { ...supp, rate: newValue }
    //                     : supp
    //             );
    //             break;

    //         default:
    //             updatedItems = selectedItems;
    //             break;
    //     }
    //     setSelectedItems(updatedItems);
    // };

    const handleEdit = (cellNam, newValue, id, rowData) => {
        let updatedItems;
        // Update either customerDesc or rate based on the cellNam
        switch (cellNam) {
            case "Customer Description":
                updatedItems = selectedItems.map((supp) =>
                    supp.itemId === id
                        ? { ...supp, customerDesc: newValue }
                        : supp
                );
                break;

            case "Rate":
                updatedItems = selectedItems.map((supp) =>
                    supp.itemId === id
                        ? { ...supp, rate: newValue }
                        : supp
                );
                break;

            case "hsnCode":
                updatedItems = selectedItems.map((supp) =>
                    supp.itemId === id
                        ? { ...supp, hsnCode: newValue }
                        : supp
                );
                break;

            default:
                updatedItems = selectedItems;
                break;
        }
        setSelectedItems(updatedItems);
    };

    const handleCopyFromModelOpen = () => {
        setCopyFromModal(true);
    }

    const handleExcelModelOpen = () => {
        setExcelModal(true);
    }
    const handleLoadButtonClick = () => {
        // CustomerSelectItemShow({ id: customerSelect }, handlePartNoShowSuccess, handlePartNoSelectException);
        setLoading(true)
        CustomerDataShow({ fromDate: fromDate, toDate: toDate, customerId: customerSelect }, handleDataShowSuccess, handlePartNoSelectException);
    };

    const buttonsDisabled = customerSelect === '';
    const handleDataShowSuccess = (dataObject) => {
        setSelectedItems(dataObject.data);
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }

    const arrayToWorksheet = (array) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Customer Result Report');

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

    const handleDownload = () => {
        const formattedData = selectedItems.map((data) => ({

            "Part No": data?.itemCode,
            "Customer Name": data?.customer,
            "Part Name": data?.itemName,
            "Cust Desc": data?.customerDesc,
            "HSN Code": data?.hsnCode,
            "UOM": data?.uomName,
            "Old Rate": data?.old_rate,
            "New Rate": data?.new_rate,


        }))

        const workbook = arrayToWorksheet(formattedData);
        downloadExcelFile(workbook, 'Customer Vs Item Report.xlsx');
    }

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
        setToDate(initialToDate);
    }, []);
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

    const handleFromDateChange = (e) => {
        const selectedFromDate = e.target.value;
        setFromDate(selectedFromDate);

        const fromYear = new Date(selectedFromDate).getFullYear();
        const isAfterApril = new Date(selectedFromDate).getMonth() >= 3;

        const financialYearEnd = isAfterApril
            ? `${fromYear + 1}-03-31`
            : `${fromYear}-03-31`;

        setToDate(financialYearEnd);
    };

    const handleToDateChange = (e) => {
        const value = e.target.value;
        // if (isValidDateInRange(value)) {
        setToDate(value);
        //     setNotification({ status: false, type: "", message: "" });
        // } else {
        //     setNotification({
        //         status: true,
        //         type: "error",
        //         message: "Please select a valid To-Date",
        //     });
        // }
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
        setToDate(toDate ? toDate.toISOString().split('T')[0] : '');
    };


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Customer Vs Item Price Report
                </Typography>
            </div>
            <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                <Grid container padding={1}>
                    <FormControl style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40px', borderRadius: '5px', marginBottom: '20px' }}>
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
                    <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
                        <Grid container
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    label="From Date"
                                    placeholder='From Date'
                                    variant="filled"
                                    size='small'
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    type='date'
                                    value={fromDate}
                                    onChange={handleFromDateChange}
                                    // inputProps={{
                                    //     min: fyFrom,
                                    //     max: fyTo,
                                    // }}
                                    required
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    label="To Date"
                                    placeholder='To Date'
                                    variant="filled"
                                    size='small'
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    type='date'
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    // inputProps={{
                                    //     min: fyFrom,
                                    //     max: fyTo,
                                    // }}
                                    required
                                />
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    label="Customer Name"
                                    placeholder="Customer Name"
                                    variant="filled"
                                    required
                                    disabled={true}
                                    value={customerName}
                                    size="small"
                                />

                            </Grid>
                            <Grid item xs>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="combo-box-demo"
                                    value={selectedCustomerName}
                                    options={optionsCustList}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            variant="filled"
                                            label="Search Customer"
                                            onChange={handleChangeCustomer}
                                        />}
                                    onChange={(event, value) => onCustomerSelectChange(value)}
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    style={{
                                        background: '#002D68',
                                        color: 'white',
                                        height: '40px'
                                    }}
                                    onClick={handleLoadButtonClick}
                                    disabled={loading === true}
                                >
                                    {/* Load */}
                                    {loading ? (
                                        <CircularProgress size={24} style={{ color: 'white' }} />
                                    ) : 'Load'}
                                </Button>
                            </Grid>
                        </Grid>

                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '100%', border: '1px solid black', }}>
                            {loading &&
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress />
                                </Box>
                            }
                            <CardContent>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                                        <div style={{ display: 'flex', gap: '5px' }}>

                                            <Button
                                                variant="contained"
                                                type="button"
                                                disabled={buttonsDisabled}
                                                style={{ height: '30px', backgroundColor: buttonsDisabled ? 'grey' : '#002d68' }}
                                                onClick={handleDownload}>
                                                Download
                                            </Button>
                                            {/* <Button
                                                variant="contained"
                                                type="submit"
                                                disabled={buttonsDisabled}
                                                style={{ height: '30px', backgroundColor: buttonsDisabled ? 'grey' : '#002d68' }}>
                                                SAVE
                                            </Button> */}
                                        </div>
                                    </div>
                                </div>
                                <table id="customers">
                                    <thead>
                                        <tr>
                                            <th>Customer Name</th>
                                            <th>Part No</th>
                                            <th>Part Name</th>
                                            <th>Customer Description</th>
                                            <th>HSN Code</th>
                                            <th>UOM</th>
                                            <th>Old Rate</th>
                                            <th>New Rate</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedItems.map((item, index) => (
                                            <tr key={index}>
                                                <td contentEditable={false}>{item.customer}</td>
                                                <td contentEditable={false} >
                                                    {item.itemCode}
                                                </td>
                                                <td contentEditable={false}>{item.itemName}</td>

                                                <td contentEditable={false} onBlur={(e) => handleEdit('Customer Description', e.target.textContent, item.itemId, item)}>{item.customerDesc}</td>
                                                <td contentEditable={false} onBlur={(e) => handleEdit('hsnCode', e.target.textContent, item.itemId, item)}>{item.hsnCode}</td>
                                                <td contentEditable={false}>{item.uomName}</td>

                                                <td contentEditable={false} onBlur={(e) => handleEdit('Rate', e.target.textContent, item.itemId, item)}>{item.old_rate}</td>
                                                <td contentEditable={false} onBlur={(e) => handleEdit('Rate', e.target.textContent, item.itemId, item)}>{item.new_rate}</td>
                                                {/* <td contentEditable={false} style={{ textAlign: 'center' }}>
                                                    {item.id === 'RDL1' ?
                                                        <DeleteIcon
                                                            style={{ color: '#dddddd', cursor: 'pointer' }}
                                                        />
                                                        :
                                                        <DeleteIcon
                                                            onClick={() => {
                                                                handleDeleteRow(item.id)
                                                            }}
                                                            style={{ color: 'black', cursor: 'pointer' }}
                                                        />
                                                    }
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </form>

            <ImportXlCustItem
                excelModal={excelModal}
                setExcelModal={setExcelModal}
                customerSelect={customerSelect}
            />

            <CopyFromXl
                copyFromModal={copyFromModal}
                setCopyFromModal={setCopyFromModal}
                customerSelect={customerSelect}
            />
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div>
    )
}

export default CustomerVsItemReport

