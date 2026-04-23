
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    TextField,
    Checkbox,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Card,
    CardContent,
    Tooltip
}
    from '@mui/material';
import React, { useEffect, useState } from 'react'
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { AllMasterAdd, AllMasterUpdate, ViewPurchaseOrderBill } from '../../../ApiService/LoginPageService';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from 'react-router-dom';
import PDFViewer from '../../../Utility/PDFViiewer';
import ReceiptIcon from '@mui/icons-material/Receipt';

const PurchaseBillPreview = (props) => {
    const { poBillModalOpen, setPoBillModalOpen, isAddButton, currencyData, setRefreshData, configSetupData, poData } = props;
    const { digit } = poData

    //NEW STATE VARIBALES
    const [isActive, setIsActive] = useState(false);
    const [selectedMaster, setSelectedMaster] = useState('');
    const [masterId, setMasterId] = useState('');
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [inactiveRemarks, setInactiveRemarks] = useState('');
    const [chapterHDR, setChapterHDR] = useState('');
    const [isStoreGroup, setIsStoreGroup] = useState('');
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [rowId, setRowId] = useState('')
    const [poBillData, setPoBillData] = useState([]);
    const [pdfOpen, setPdfOpen] = useState(false);
    const [fileTypeForView, setFileTypeForView] = useState('');
    const navigate = useNavigate();

    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SNo</span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'date',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Date</span>,
            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'user',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>User</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'grnRefNO',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>GRN No</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>PO No</span>,
            type: 'string',
            sortable: true,
            minWidth: 80, flex: 1, align: 'center', headerAlign: 'center'
        },

        {
            field: 'poValue',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>PO Value</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            minWidth: 50,
            flex: 1,
            align: 'left', headerAlign: 'center'
        },
        {
            field: 'csSuppDcNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>DC No</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'left', headerAlign: 'center'
        },
        {
            field: 'suppInvNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Invoice No</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'left', headerAlign: 'center'
        },
        {
            field: 'suppInvoiceDate',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>DC/Invoice Date</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'left', headerAlign: 'center'
        },
        {
            field: 'invoiceValue',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Invoice Value</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'left', headerAlign: 'center'
        },
        {
            field: 'remarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Remarks</span>,
            type: 'string',
            sortable: true,
            sortable: false,
            flex: 1,
            minWidth: 80, align: 'left', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <ViewdData selectedRow={params.row} />,
                <DownloadInvoice selectedRow={params.row} />,
                <ViewPOBill selectedRow={params.row} />,
            ],
        },
    ];

    useEffect(() => {
        loaderData();
        poBillModalOpen && ViewPurchaseOrderBill({ poDigit: digit }, handleGetBillSucess, handleGetBillException)
    }, [poBillModalOpen]);

    const baseUrl = process.env.REACT_APP_API_URL;
    const urlParts = baseUrl.split('api/');
    const Url = urlParts[0];

    const handleGetBillSucess = (dataObject) => {
        setPoBillData(dataObject?.data || [])
    }
    const handleGetBillException = (errorObject, errorMessage) => {
        console.log("error Msg", errorMessage);
    }


    const dummyData = [
        {
            id: 1,
            IssueDate: '2022-01-01',
            RawMaterial: 'Material 1',
            uom: 10,
            Quantity: 'PO-001',
            GRNNo: 'GRN-001',
            GRNRate: 'Rate-001',
            InvoiceRate: 'Rate-002',
            DCInvoice: '2022-01-10',
            InvoiceValue: '$1000',
            remarks: 'Some remarks 1',
        }]

    function DownloadInvoice(props) {
        const getFileExtension = (filePath) => {
            return filePath.split('.').pop().toLowerCase();
        };

        // Function to download file based on file path
        const downloadFile = (filePath) => {
            const fileExtension = getFileExtension(filePath);
            const fileName = filePath.split('/').pop(); // Extract file name from file path

            const link = document.createElement('a');
            link.href = filePath;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        const filePath = `${Url}${props.selectedRow.file}`;

        return (
            <Tooltip disableFocusListener title="Download Invoice" >
                <DownloadIcon
                    style={{ color: '#000000' }}
                    onClick={() => downloadFile(filePath)}
                />
            </Tooltip>
        );
    }

    function ViewPOBill(props) {
        return (
            <Tooltip disableFocusListener title="View PO Bill" >
                <RemoveRedEyeIcon
                    onClick={() => {
                        // setDeleteId(props.selectedRow.id);
                        // setDeleteDailogOpen(true);
                        navigate(`/PurchaseBillAgainstPOModule?isPOBillView=true&&poBillDigit=${props.selectedRow.digit}`);
                    }}
                    style={{ color: 'black' }}
                />
            </Tooltip>
        );
    }

    function ViewdData(props) {
        return (
            <Tooltip title="View Invoice" arrow>
                <ReceiptIcon
                    onClick={() => {
                        setPdfOpen(true);
                        setFileTypeForView(props.selectedRow.file);

                    }}
                    style={{ color: '#000000' }}
                />
            </Tooltip>
        );
    }



    const handleSubmit = (e) => {
        e.preventDefault();
        if (isAddButton) {
            AllMasterAdd({
                masterType: selectedMaster,
                masterId: masterId,
                code: code,
                name: name,
                inactiveStatus: isActive,
                inactiveRemarks: inactiveRemarks,
                description: description,
                chapterHdr: chapterHDR,
                isstoreGroup: isStoreGroup
            }, handleSuccess, handleException)
        } else {
            AllMasterUpdate({
                id: rowId,
                masterType: selectedMaster,
                masterId: masterId,
                code: code,
                name: name,
                inactiveStatus: isActive,
                inactiveRemarks: inactiveRemarks,
                description: description,
                chapterHdr: chapterHDR,
                isstoreGroup: isStoreGroup
            }, handleSuccess, handleException)
        }
    }

    const handleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
        }, 2000);
    };

    const handleException = (errorObject, errorMessage) => {
        console.log("the error ", errorMessage);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // ClearData();
            // handleClose();
        }, 2000);
    };

    const ClearData = () => {
        setIsActive(false);
        setSelectedMaster('');
        setMasterId('');
        setCode('');
        setName('');
        setDescription('');
        setInactiveRemarks('');
        setPoBillModalOpen(false);
        setRefreshData(oldvalue => !oldvalue);
    }

    const loaderData = () => {
        setRowId(configSetupData?.id || '')
        setSelectedMaster(configSetupData?.masterType || '');
        // setMasterId(configSetupData?.categoryDescription || '');
        setCode(configSetupData?.code || '');
        setName(configSetupData?.name || '');
        setDescription(configSetupData?.description || '');
        setIsActive(configSetupData?.inactiveStatus || '');
        setInactiveRemarks(configSetupData?.inactiveRemarks || '');
    }

    const validateForNullValue = (value, type) => {

    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

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
        { id: 8, masterName: 'PSET', value: 'pset' },
        { id: 9, masterName: 'State', value: 'state' },
        { id: 10, masterName: 'Supplier Group', value: 'supplierGroup' },
        { id: 11, masterName: 'Tool', value: 'tool' },
        { id: 12, masterName: 'UOM', value: 'uom' },
        { id: 13, masterName: 'Item Group', value: 'itemGroup' },
        { id: 14, masterName: 'TARIFF', value: 'tarrif' },
        { id: 15, masterName: 'TRF', value: 'trf' },
        { id: 16, masterName: 'Designation', value: 'designation' }
    ]

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '60%', maxHeight: '100%' } }}
            maxWidth="lg"
            open={poBillModalOpen}
        >
            <DialogTitle style={{ background: '#002D68', color: 'white' }}>
                View Invoice
            </DialogTitle>
            <DialogContent>
                <form className="mt-2 space-y-6" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '10px', borderRadius: '10px', width: '100%', height: '100%'/*, border: '1px solid gray'*/ }}>
                                <CardContent>
                                    <DataGrid
                                        rows={poBillData}
                                        columns={columns}
                                        pageSize={8}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none', }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '50vh',
                                            // minHeight: '500px',
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
                                            // Find the index of the row within the rows array
                                            const rowIndex = dummyData.findIndex(row => row.id === params.row.id);
                                            // Check if the index is valid
                                            if (rowIndex !== -1) {
                                                console.log(' ');
                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return ''; // Return default class if index is not found
                                        }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>

                    </Grid>


                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                        >
                            Issue
                        </Button>
                        <Button
                            variant="contained"
                            style={{ width: '150px', background: '#002D68', color: 'white' }}
                            onClick={(e) => {
                                setPoBillModalOpen(false);
                                loaderData();
                            }}
                        >
                            Cancel
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
            <PDFViewer
                pdfOpen={pdfOpen}
                setPdfOpen={setPdfOpen}
                fileTypeForView={fileTypeForView}
            />

        </Dialog >
    )
}

export default PurchaseBillPreview

