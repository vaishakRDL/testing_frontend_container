import { Autocomplete, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { MachineShowData, OrderOList, PaintSludgeReprt, SaleOrderFetch, ScrapMstGetCategory, ScrapMstGetMaterial, ScrapMstGetThickness, ScrapMstReport } from '../../ApiService/LoginPageService';
import ScrapReportModuleTitle from './ScrapReportModuleTitle';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { PaintSludgeCSV, ScrapReportCSV } from '../../ApiService/DownloadCsvReportsService';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PaintSludgeReportTitle from './PaintSludgeReportTitle';

const PaintSludgeReport = ({
    itemDetaildView,
    setItemDetaildView,
    selectSalesId
}) => {

    const [machine, setMachine] = useState('');
    const [category, setCategory] = useState('');
    const [rawMaterial, setRawMaterial] = useState('');
    const [thickness, setthickness] = useState('');
    const [submitoading, setsubmitoading] = useState(false);
    const [viewloading, setviewLoading] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [todate, setToDate] = useState('');
    const [dataList, setDataList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [rawMaterialList, setRawMaterialList] = useState([]);
    const [thicknessList, setthicknessList] = useState([]);
    const [machinList, setMachineList] = useState([]);
    const [totalConsumption, setTotalConsumption] = useState('');
    const [csvloading, setcsvLoading] = useState(false);

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });

    const today = new Date();
    const date = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const TodaysDate = `${year}/${month}/${date}`;

    useEffect(() => {
        MachineShowData(handleMachineShowDataSuccess, handleMachineShowDataExceprion);
        ScrapMstGetCategory(handleScrapMstGetCategorySuccess, handleScrapMstGetCategoryException);
        ScrapMstGetMaterial(handleScrapMstGetMaterialSuccess, handleScrapMstGetMaterialException);
        ScrapMstGetThickness(handleScrapMstGetThicknessSuccess, handleScrapMstGetThicknessException);
    }, []);

    const handleMachineShowDataSuccess = (dataObject) => {
        setMachineList(dataObject?.data || []);

    }

    const handleMachineShowDataExceprion = () => {

    }

    const handleScrapMstGetCategorySuccess = (dataObject) => {
        setCategoryList(dataObject?.data || []);
    }

    const handleScrapMstGetCategoryException = () => {

    }

    const handleScrapMstGetMaterialSuccess = (dataObject) => {
        setRawMaterialList(dataObject?.data || []);
    }

    const handleScrapMstGetMaterialException = () => {

    }

    const handleScrapMstGetThicknessSuccess = (dataObject) => {
        setthicknessList(dataObject?.data || []);
    }

    const handleScrapMstGetThicknessException = () => {

    }

    const handleScrapMstReportSuccess = (dataObject) => {
        setDataList(dataObject?.data || []);
        setTotalConsumption(dataObject?.totalConsumption);
        setviewLoading(false)
        setsubmitoading(false)

    }

    const handleScrapMstReportExceprion = (errorObject, errorMessage) => {
        setviewLoading(false)
        setsubmitoading(false)
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    }

    const handleSubmit = () => {

    };

    const columns3 = [
        {
            field: 'slNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    S.No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'date',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Date
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'time',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Time
                </span>,

            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'machineName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Machine Name
                </span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'weightScan',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Weight | Kg
                </span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },


    ];

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleScrapReportCSVSuccess = (dataObject) => {
        setcsvLoading(false)

        setNotification({
            status: true,
            type: 'success',
            message: 'Download Successfully',
        });
        setTimeout(() => {
            handleClose();
        }, 2000);

    }

    const handleScrapReportCSVEception = () => {
        setcsvLoading(false)

    }

    const handleFileSave = () => {
        const doc = new jsPDF();

        // Add a custom heading
        doc.text('Scrap Data Report', 20, 20); // Adjust position as needed

        // Define the headers and rows from your data
        const headers = ['ID', 'Date', 'Machine Name', 'Weight Scan'];
        const rows = dataList.map(item => [
            item.id,
            item.date,
            item.machineName,
            item.weightScan
        ]);

        // Add the headers and rows to the PDF table
        doc.autoTable({
            head: [headers],
            body: rows,
            startY: 30, // Adjust startY to leave space for the heading
            theme: 'striped',
            styles: {
                font: 'times',
                fontSize: 8
            }
        });

        // Save the PDF with a specific filename
        doc.save('PaintSludgeData.pdf');
    }

    const options = machinList.map(item => ({
        id: item?.id,
        label: item?.machineName
    }));

    const options1 = categoryList.map(item => ({
        id: item?.id,
        label: item?.category
    }));

    const options2 = rawMaterialList.map(item => ({
        id: item?.id,
        label: item?.material
    }));

    const options3 = thicknessList.map(item => ({
        id: item?.id,
        label: item?.thickness
    }));

    const handleCategoryChange = (selectedValue) => {
        setCategory(selectedValue?.label || '');
    };

    const handleRawMaterialChange = (selectedValue) => {
        setRawMaterial(selectedValue?.label || '');
    };

    const handleMachineChange = (selectedValue) => {
        setthickness(selectedValue?.label || '');
    };

    const handleAutocompleteChange = (selectedValue) => {
        setMachine(selectedValue?.id || '');
    };

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <PaintSludgeReportTitle />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Grid container spacing={2} style={{ width: '98%', marginTop: '-20px' }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl style={{ width: '100%' }}>
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="combo-box-demo"
                                size='small'
                                options={options}
                                // sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Search By Machine"

                                />}
                                onChange={(event, value) => handleAutocompleteChange(value)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            id="filled-basic"
                            label="From Date"
                            variant="filled"
                            size='small'
                            fullWidth
                            type='date'
                            value={fromDate}
                            onChange={(e) => {
                                setFromDate(e.target.value);
                            }}
                            required
                            InputLabelProps={{ shrink: true }}
                            placeholder="From Date"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            id="filled-basic"
                            label="To Date"
                            variant="filled"
                            size='small'
                            fullWidth
                            type='date'
                            required
                            value={todate}
                            onChange={(e) => {
                                setToDate(e.target.value);
                            }}
                            InputLabelProps={{ shrink: true }}
                            placeholder="To Date"
                        />
                    </Grid>
                    <Grid item xs={12} sm={1}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Button
                            disabled={viewloading}
                            variant="contained"
                            style={{ width: '100%', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setviewLoading(true)
                                PaintSludgeReprt({
                                    machineId: machine,
                                    from: fromDate,
                                    to: todate
                                }, handleScrapMstReportSuccess, handleScrapMstReportExceprion);
                            }}
                        >
                            {viewloading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (
                                'Today'
                            )}                        </Button>
                    </Grid>


                    <Grid item xs={12} sm={1}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Button
                            variant="contained"
                            style={{ width: '100%', background: '#002D68', color: 'white' }}
                            disabled={submitoading}
                            onClick={(e) => {
                                setsubmitoading(true)
                                PaintSludgeReprt({
                                    machineId: machine,
                                    from: fromDate,
                                    to: todate
                                }, handleScrapMstReportSuccess, handleScrapMstReportExceprion);
                            }}
                        >
                            {submitoading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </Grid>

                    <Grid item xs={12} sm={2}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <Button
                            variant="contained"
                            style={{ width: '100%', background: '#002D68', color: 'white' }}
                            disabled={csvloading}
                            onClick={(e) => {
                                setcsvLoading(true)
                                PaintSludgeCSV({
                                    fromDate: fromDate,
                                    todate: todate,
                                    machineId: machine,
                                }, handleScrapReportCSVSuccess, handleScrapReportCSVEception);
                            }}
                        >
                            {csvloading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : (
                                'Download csv'
                            )}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={2}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Button
                            variant="contained"
                            style={{ width: '100%', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                handleFileSave();
                            }}
                        >
                            Download PDF
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '0px', borderRadius: '10px', width: '100%', height: '100%' }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item sm={12} xs={12} md={3} lg={3} xl={3} >
                                        <TextField
                                            id="filled-basic"
                                            label="Total Consumption"
                                            variant="filled"
                                            size='small'
                                            fullWidth
                                            required
                                            value={totalConsumption}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item sm={12} xs={12} md={12} lg={12} xl={12}>
                                        <DataGrid
                                            rows={dataList}
                                            columns={columns3}
                                            pageSize={8}
                                            rowsPerPageOptions={[8]}
                                            disableSelectionOnClick
                                            style={{ border: 'none' }}
                                            sx={{
                                                overflow: 'auto',
                                                height: '50vh',
                                                width: '100%',
                                                '& .super-app-theme--header': {
                                                    WebkitTextStrokeWidth: '0.6px',
                                                    backgroundColor: '#93bce6',
                                                    color: '#1c1919'
                                                },
                                                '& .MuiDataGrid-cell': {
                                                    border: '1px solid #969696',
                                                },
                                                '& .MuiDataGrid-columnHeader': {
                                                    border: '1px solid #969696', // Add border to column headers
                                                },
                                            }}
                                            getRowClassName={(params) => {
                                                const rowIndex = [].findIndex(row => row.id === params.row.id);
                                                if (rowIndex !== -1) {
                                                    console.log(' ');
                                                    return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                }
                                                return '';
                                            }}
                                            rowHeight={40}
                                            columnHeaderHeight={40}
                                        />
                                    </Grid>
                                </Grid>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div>

    )
}

export default PaintSludgeReport
