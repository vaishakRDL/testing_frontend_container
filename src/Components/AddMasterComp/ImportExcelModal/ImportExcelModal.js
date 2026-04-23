import { Autocomplete, Button, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import * as XLSX from 'xlsx';
// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';
// import { MultiAddressAdd, MultiAddressDataDelete, MultiAddressDataShow, MultiAddressDataUpdate } from '../../ApiService/LoginPageService';
import { AllMastersTemplate, GetSuppVsItemTemplate } from '../../../ApiService/DownloadCsvReportsService';
import { AllMasterExcelUpload, GetSuppVsItemSuppItemListWithCode, SupplierVsItemXLSaveData, SupplierVsItemXLUpload } from '../../../ApiService/LoginPageService';
// import MissingModal from '../MissingModal/MissingModal';

const ImportExcelModal = ({ excelModal, setExcelModal, globleId, suppCode, handleLoadButtonClick, setSupplierItemList }) => {
    const [supplierCode, setSupplierCode] = useState('')
    const [category, setCategory] = useState('');
    const [address, setAddress] = useState('');
    const [defaultShippingAddress, setDefaultShippingAddress] = useState('');
    const [multiAddress, setMultiAddress] = useState([]);
    const [multiRefresh, setMultiRefresh] = useState(true);
    const [isEditable, setIsEditable] = useState(false);
    const [dataRefresh, setDataRefresh] = useState(false);
    const [editId, setEditId] = useState('');
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [excelData, setExcelData] = useState([]);
    const [excelReponse, setExcelResponse] = useState([]);
    const [missingModal, setMissingModal] = useState(false);
    const [missingLists, setMissingLists] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedMaster, setSelectedMaster] = useState('pm');

    const columns = [
        {
            field: 'id',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SI No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'name',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Name</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'description',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Description</span>,
            type: 'string',
            sortable: true,
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        }
    ];

    const [rows, setRows] = useState([]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const base64String = btoa(
                    new Uint8Array(e.target.result)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );

                // Now you have the file as a Base64-encoded string
                //API CALLS HERE
                AllMasterExcelUpload({ master: selectedMaster, file: base64String, type: "import", data: [] }, handleTemplateUploadSucessShow, handleTemplateUploadExceptionShow)
                //

                // // Rest of your code...
                // const workbook = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
                // const sheetName = workbook.SheetNames[0];
                // const sheet = workbook.Sheets[sheetName];
                // const dataArray = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                // // Assuming the first row contains headers
                // const headers = dataArray[0];

                // // Extracting data from subsequent rows
                // const excelObjects = dataArray.slice(1).map((row, rowIndex) => {
                //     const obj = { id: rowIndex + 1 }; // Adding id property
                //     headers.forEach((header, index) => {
                //         obj[header] = row[index];
                //     });
                //     return obj;
                // });

                // setExcelData(excelObjects);
                // console.log("excelObjects", excelObjects);
            };

            reader.readAsArrayBuffer(file);
        }
    };

    const handleTemplateUploadSucessShow = (dataObject) => {
        setRows(dataObject?.data || []);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000)
    }
    const handleTemplateUploadExceptionShow = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const handleDownloadTemplate = () => {
        AllMastersTemplate({ masterName: selectedMaster }, handleTemplateSuccess, handleTemplateException)
    }

    const handleTemplateSuccess = () => {
        setNotification({
            status: true,
            type: 'success',
            message: "Template Download Success",
        });
        setTimeout(() => {
            handleClose();
        }, 2000)
    }
    const handleTemplateException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'success',
            message: "Template Download Failed",
        });
    }

    const masterList = [
        // { id: 2, masterName: 'Machine', value: 'machine' },
        // { id: 9, masterName: 'Ledger Group', value: 'ledgerGroup' },
        // { id: 15, masterName: 'FIM', value: 'fim' },
        // { id: 17, masterName: 'LOC', value: 'loc' },
        { id: 1, masterName: 'PM', value: 'pm' },
        { id: 2, masterName: 'Customer Group', value: 'customerGroup' },
        { id: 3, masterName: 'Role', value: 'role' },
        { id: 4, masterName: 'Department', value: 'department' },
        { id: 5, masterName: 'SP', value: 'sp' },
        { id: 6, masterName: 'Currency', value: 'currency' },
        { id: 7, masterName: 'DTR', value: 'dtr' },
        { id: 8, masterName: 'Section', value: 'section' },
        { id: 9, masterName: 'State', value: 'state' },
        { id: 10, masterName: 'Supplier Group', value: 'supplierGroup' },
        { id: 11, masterName: 'Tool', value: 'tool' },
        { id: 12, masterName: 'UOM', value: 'uom' },
        { id: 13, masterName: 'Item Group', value: 'itemGroup' },
        { id: 14, masterName: 'TARIFF', value: 'tarrif' },
        { id: 15, masterName: 'TRF', value: 'trf' },
        { id: 16, masterName: 'Designation', value: 'designation' },
        { id: 17, masterName: 'Menu Master', value: 'menu' },
        { id: 18, masterName: 'Product Master', value: 'product' },
        { id: 19, masterName: 'Location Master', value: 'location' },
        { id: 20, masterName: 'Country', value: 'country' },
        { id: 21, masterName: 'City', value: 'city' },
        //ITEM MASTER
        { id: 22, masterName: 'Under Ledger', value: 'underLedger' },
        { id: 23, masterName: 'Reorder', value: 'reorder' },
        { id: 24, masterName: 'Main Location', value: 'mainLocation' },
        { id: 25, masterName: 'HSNCode', value: 'hsnCode' },
        { id: 26, masterName: 'Sub Location', value: 'subLocation' },
        { id: 27, masterName: 'Product Finish', value: 'productFinish' },
        { id: 28, masterName: 'Product Family', value: 'productFamily' },
        { id: 29, masterName: 'Category', value: 'category' },
        { id: 30, masterName: 'FIM', value: 'fim' },
        { id: 31, masterName: 'RM Itemcode', value: 'rmItemcode' },
        { id: 32, masterName: 'BUY PRODUCTION', value: 'BUYPRODUCTION' },
    ]

    const handleTransferMainPageClick = () => {
        setLoading(true);
        AllMasterExcelUpload({ master: selectedMaster, file: '', type: "loadToDb", data: rows }, handleSaveSucessShow, handleSaveExceptionShow)
    }

    const handleSaveSucessShow = (dataObject) => {
        setLoading(false);
        setRows([]);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000)
    }
    const handleSaveExceptionShow = (errorObject, errorMessage) => {
        setLoading(false);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: '100%' } }}
            maxWidth="lg    "
            open={excelModal}
        >

            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                Import Master...
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" /*onSubmit={handleSubmit}*/>

                    <Grid container alignItems={'center'} spacing={2} paddingTop={2.5}>
                        <Grid item xs={12} sm={12} md={3} lg={3} xl={3} display={'flex'} alignItems={'center'}>
                            <FormControl fullWidth >
                                <InputLabel id="demo-simple-select-label">Select Master</InputLabel>
                                <Select

                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedMaster}
                                    label="Select Master"
                                    variant="filled"
                                    onChange={(e) => {
                                        setSelectedMaster(e.target.value)
                                    }}
                                >
                                    {masterList.map((data) => (
                                        <MenuItem key={data.id} value={data.value}>{data.masterName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} lg={4} xl={4} display={'flex'} alignItems={'center'}>
                            <TextField
                                // fullWidth
                                id="outlined-basic"
                                type="file"
                                accept=".xls, .xlsx"
                                onChange={handleFileChange}
                                style={{ marginRight: '15px' }}
                            />
                            <Button variant="contained" onClick={handleDownloadTemplate} style={{ backgroundColor: '#002D68', marginRight: '15px' }}>Template</Button>
                            {/* <Button variant="contained" onClick={() => setMissingModal(true)} style={{ backgroundColor: '#002D68' }}>View Missing Items</Button> */}
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                            <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: '49vh' }}>
                                <CardContent>
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}
                                        pageSize={8}
                                        // loading={isLoading}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        sx={{
                                            height: '300px',
                                            // width: '100%',
                                            "& .error-row": {
                                                backgroundColor: "rgba(255, 0, 0, 0.1)",
                                                color: "red",
                                            },
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
                                            const rowIndex = rows.findIndex(row => row.id === params.row.id);
                                            if (rowIndex !== -1) {
                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return '';
                                        }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />
                                </CardContent>

                            </Card>
                        </Grid>
                    </Grid>

                    <DialogActions>
                        {/* <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            type="submit"
                        >
                            {
                                !isEditable ? 'Add' : 'Update'
                            }
                        </Button> */}
                        <Button style={{ background: rows.length > 0 ? '#002D68' : 'gray' }} variant="contained" disabled={rows.length > 0 ? false : true}
                            onClick={handleTransferMainPageClick}>
                            {loading ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : 'Save Data'}
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white', }}
                            onClick={(e) => {
                                setExcelModal(false);
                                /*ClearData();*/
                                setRows([]);
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>

            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

        </Dialog>
    )
}

export default ImportExcelModal
