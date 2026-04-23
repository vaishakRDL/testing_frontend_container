import {
    Button, Box, Dialog, Tooltip, DialogContent, DialogTitle, TextField, Grid, DialogActions, InputLabel, Select, MenuItem, FormControl, FormControlLabel, Checkbox, CardContent, Typography, InputAdornment, setRef,
    CircularProgress,
} from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { Card } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid } from '@mui/x-data-grid';
import { CheckBox } from '@mui/icons-material';
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from '@mui/material/Autocomplete';
import {
    GenerateForeCast,
    PreviewForeCastEntry,
    GetForeCastUniqueID,
    GetSearchedFcSupplier,
    UpdateForeCast,
    ForecastPreview,
    DeleteForeCast,
    GetGeneratedPo
} from '../../ApiService/LoginPageService'
import ChangeAddressModal from './ChangeAddressModal/ChangeAddressModal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SelectItemsModal from './SelectItemsModal/SelectItemsModal';
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import ApplicationStore from '../../Utility/localStorageUtil';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useModuleLocks } from '../context/ModuleLockContext';

const ForeCastEntryModule = ({
    open, setOpen, isAddButton, editeData, setRefreshData,
}) => {

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Forecast Entry")?.lockStatus === "locked";
    const { userDetails } = ApplicationStore().getStorage('userDetails');
    const userPermission = userDetails?.groupRights?.filter(
        (data) => data?.menu?.toLowerCase() === "forecastentry"
    );
    console.log("PurchaseOrderEntryPurchaseOrderEntry", userPermission)

    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const navigate = useNavigate();

    //UPDATED STATE
    const [uniqueId, setUniqueId] = useState('')
    const [uniqueDigit, setUniqueDigit] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [supplierList, setSupplierList] = useState([])
    const [supplierName, setSupplierName] = useState('')
    const [selectedItems, setSelectedItems] = useState([]);
    const [suppAddress, setSuppAddress] = useState('');
    const [changeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
    const [selectItemsModalOpen, setSelectItemsModalOpen] = useState(false);
    const [supplierSid, setSupplierSid] = useState('');
    const [supplierId, setSupplierId] = useState('')
    const [refreshKey, setRefreshKey] = useState(0);

    //NEW FORCAST ENTRY MODULE ENTRY
    const [fromConsumptionDate, setFromConsumptionDate] = useState('');
    const [toConsumptionDate, setToConsumptionDate] = useState('');
    const [consumptionInDays, setConsumptionInDays] = useState('');
    const [planDateFrom, setPlanDateFrom] = useState('');
    const [planDateTo, setPlanDateTo] = useState('');
    const [requiredPercentage, setRequiredPercentage] = useState('');
    const [specialInstruction, setSpecialInstruction] = useState('');
    const [mainId, setMainId] = useState('');
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [viewMoreModal, setViewMoreModal] = useState(false);
    const [selectedGeneratedPo, setSelectedGeneratedPo] = useState('');
    const [generatedPoLists, setGeneratedPoLists] = useState([]);
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [invoiceData, setInvoiceData] = useState([]);
    const [loading, setLoading] = useState(false);

    //FC VIEW
    const location = useLocation();
    // const isView = new URLSearchParams(location.search).get('isView');
    const fcNo = new URLSearchParams(location.search).get('fcNo');

    //FC EDIT
    // const isEdit = new URLSearchParams(location.search).get('isEdit');

    const [isView, setIsView] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
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
        // GET UNIQUE CODE
        // !isView && GetForeCastUniqueID(handleGetCodeSuccess, handleGetCodeException)

        // if (isView || isEdit) {
        //     PreviewForeCastEntry(
        //         {
        //             "digit": fcNo
        //         },
        //         handleGetFcDetailsSuccess, handleGetFcDetailsException);
        // }
        handleForwardReverse('last', '');
    }, [editeData/*, isView, fcNo*/]);

    const handleGetCodeSuccess = (dataObject) => {
        setUniqueId(dataObject.id);
        setUniqueDigit(dataObject.digit);
    }
    const handleGetCodeException = (errorObject, errorMessage) => {
        setNotification({
            // errorObject, errorMessage
            status: true,
            type: 'error',
            message: errorMessage,
        });
    }

    // PO APPROVAL CODE
    const handleGetFcDetailsSuccess = (dataObject) => {
        const data = dataObject.data[0];
        setUniqueId(data?.uniqueId || '');
        setUniqueDigit(data?.uniqueDigit || '');
        setSelectedDate(data?.date || '');
        setSuppAddress(data?.spAddress || '');
        setSupplierName(data?.suppName || '');
        setSupplierId(data?.supId || '');
        setFromConsumptionDate(data?.fromConsumptionDate || '');
        setToConsumptionDate(data?.toConsumptionDate || '');
        setConsumptionInDays(data?.consumptionInDays || '');
        setPlanDateFrom(data?.planDateFrom || '');
        setPlanDateTo(data?.planDateTo || '');
        setRequiredPercentage(data?.requiredPercentage || '');
        setSpecialInstruction(data?.specialInstruction || '');
        setSelectedItems(dataObject.data || []);
    }
    const handleGetFcDetailsException = (errorObject, errorMessage) => {
    }

    const ClearData = () => {
        setUniqueId('');
        setUniqueDigit('');
        setSelectedDate('');
        setSuppAddress('');
        setSupplierName('');
        setSupplierId('');
        setFromConsumptionDate('');
        setToConsumptionDate('');
        setConsumptionInDays('');
        setPlanDateFrom('');
        setPlanDateTo('');
        setRequiredPercentage('');
        setSpecialInstruction('');
        setSelectedItems([]);
    }

    function handleSupplierAutocompleteChange(selectedValue) {
        if (selectedValue !== null) {
            setSuppAddress(selectedValue?.spAddress || '');
            setSupplierName(selectedValue?.label || '');
            setSupplierSid(selectedValue?.sId || '');
            setSupplierId(selectedValue?.id || '');
        }
    }

    const handleSupplierSearchItemChange = (value) => {
        // console.log("handleSupplierSearchItemChange", value)
        if (value !== null) {
            setSelectedItems((prevSelectedItems) => [...prevSelectedItems, value]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const updatedArray = selectedItems.map(obj => (
            {
                ...obj,
                uniqueId: uniqueId,
                uniqueDigit: uniqueDigit,
                date: selectedDate,
                supId: supplierId,
                fromConsumptionDate: fromConsumptionDate,
                toConsumptionDate: toConsumptionDate,
                consumptionInDays: consumptionInDays,
                planDateFrom: planDateFrom,
                planDateTo: planDateTo,
                requiredPercentage: requiredPercentage,
                specialInstruction: specialInstruction
            }
        ))

        console.log("HANDLE SUBMIT UPDATED ARRAY", updatedArray)
        if (isEdit) {
            UpdateForeCast(updatedArray, handleSuccess, handleException)
        } else {
            GenerateForeCast(updatedArray, handleSuccess, handleException)
        }
    };

    const handleSuccess = (dataObject) => {
        console.log("the dataObject ", dataObject);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            ClearData();
            handleClose();
            setLoading(false);
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
            // handleClose();
            setLoading(false);
        }, 2000);
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    //MIDDLE GRID
    const fcItemGridColumns = [
        {
            field: 'itemCode',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part No</span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemName',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Name</span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UOM</span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'maxLvl',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Max Level</span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'consumptionQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Consumption Qty</span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'totStk',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>QOH</span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'fcQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>FC Qty</span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: true
        },
        {
            field: 'lastPurQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>LastPur Qty</span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'lastGrnQty',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>LastGRN Qty</span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: true
        },
        {
            field: 'fcRemarks',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>FC Remarks</span>,
            type: 'string',
            sortable: true,
            minWidth: 150,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
            editable: true
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
                <DeleteData selectedRow={params.row} />,
            ],
        }, ,
    ];

    const handleDeleteRow = (id) => {
        const newArray = selectedItems.filter((item) => item.id != id)
        setSelectedItems(newArray);
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                disabled={isView ? true : false}
                onClick={() => {
                    handleDeleteRow(props.selectedRow.id)
                }}
                style={{ color: 'black' }}
            />
        );
    };

    const handleCellEdit = (params) => {
        const updatedList = selectedItems.map((supp) =>
            supp.id === params.id ?
                { ...supp, fcQty: params.fcQty }
                : supp
        )
        setSelectedItems(updatedList);
    };

    //DATE CONVERT TO TEXTFIELD
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleChange = (e) => {
        GetSearchedFcSupplier({ code: e.target.value }, handleFcSupplierSucess, handleFcSupplierException);
    }

    const handleFcSupplierSucess = (dataObject) => {
        setSupplierList(dataObject?.data || []);
    }
    const handleFcSupplierException = (errorObject, errorMessage) => {
    }

    // DATE DIFFERENCE CALCULATER
    useEffect(() => {
        console.log("fromConsumptionDate", fromConsumptionDate);
        if (fromConsumptionDate && toConsumptionDate) {
            const differenceMs = new Date(toConsumptionDate).getTime() - new Date(fromConsumptionDate).getTime();

            // Convert milliseconds to days
            const differenceDays = Math.abs(differenceMs / (1000 * 60 * 60 * 24)); // Use Math.abs to get positive difference
            setConsumptionInDays(differenceDays);
        }
    }, [fromConsumptionDate, toConsumptionDate]);

    useEffect(() => {
        const result = selectedItems.map(item => ({ ...item, fcQty: item.consumptionQty * requiredPercentage / 100 }));
        setSelectedItems(result)
    }, [requiredPercentage])

    //NEW TABLE ENTRY CODE
    const handleEdit = (cellNam, newValue, id, rowData) => {
        switch (cellNam) {
            case "fcQty":
                const updatedFcQty = selectedItems.map((data) =>
                    data.id === id && cellNam === 'fcQty' ?
                        { ...data, fcQty: newValue }
                        : data
                )
                setSelectedItems(updatedFcQty);
                break;
            case "lastGrnQty":
                const updatedLastGrnQty = selectedItems.map((data) =>
                    data.id === id && cellNam === 'lastGrnQty' ?
                        { ...data, lastGrnQty: newValue }
                        : data
                )
                setSelectedItems(updatedLastGrnQty);
                break;
            case "fcRemarks":
                const updatedFcRemarks = selectedItems.map((data) =>
                    data.id === id && cellNam === 'fcRemarks' ?
                        { ...data, fcRemarks: newValue }
                        : data
                )
                setSelectedItems(updatedFcRemarks);
                break;
            default:
            // code block
        }
    }

    // HANDLE FORWARD REVERSE HANDLER
    const handleForwardReverse = (type, id) => {
        ForecastPreview({ type: type, id: id }, handleActionSuccess, handleActionException)
    }

    const handleActionSuccess = (dataObject) => {
        setIsView(true)
        setInvoiceData(dataObject?.data || []);
        const data = dataObject.data[0];
        setUniqueId(data?.uniqueId || '');
        setUniqueDigit(data?.uniqueDigit || '');
        setSelectedDate(data?.date || '');
        setSuppAddress(data?.spAddress || '');
        setSupplierName(data?.suppName || '');
        setSupplierId(data?.supId || '');
        setFromConsumptionDate(data?.fromConsumptionDate || '');
        setToConsumptionDate(data?.toConsumptionDate || '');
        setConsumptionInDays(data?.consumptionInDays || '');
        setPlanDateFrom(data?.planDateFrom || '');
        setPlanDateTo(data?.planDateTo || '');
        setRequiredPercentage(data?.requiredPercentage || '');
        setSpecialInstruction(data?.specialInstruction || '');
        setMainId(data?.mainId || '')
        setSelectedItems(dataObject.data || []);
    }
    const handleActionException = () => { }

    const handleClearPage = () => {
        setIsView(false)
        setIsEdit(false)
        setUniqueId('');
        setUniqueDigit('');
        setSuppAddress('');
        setSupplierName('');
        setSupplierId('');
        setFromConsumptionDate('');
        setToConsumptionDate('');
        setConsumptionInDays('');
        setPlanDateFrom('');
        setPlanDateTo('');
        setRequiredPercentage('');
        setSpecialInstruction('');
        setSelectedItems([]);
        setSelectedDate(new Date());
        GetForeCastUniqueID(handleGetCodeSuccess, handleGetCodeException)
    }

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        // setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
            handleClearPage();
        }, 3000);
    };
    const deletehandleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    };

    //SEARCH BILL
    const handleFCChange = (e) => {
        GetGeneratedPo({ type: 'poFc', code: e.target.value }, handleGeneratedPoSucessShow, handleGeneratedPoExceptionShow);
    }

    const handleGeneratedPoSucessShow = (dataObject) => {
        setGeneratedPoLists(dataObject?.data || []);
    }
    const handleGeneratedPoExceptionShow = (errorObject, errorMessage) => {
    }

    const handleGeneratedFCSelect = (selectedValue) => {
        setIsView(true)
        if (selectedValue !== null) {
            setSelectedGeneratedPo(selectedValue.digit);
            PreviewForeCastEntry(
                {
                    digit: selectedValue.digit
                },
                handleActionSuccess, handleActionException);
        }
    }

    const handleUniqueCodeChange = (e) => {
        const newUniqueCode = e.target.value;
        const currentYear = uniqueId.split('/')[0]; // Get last 2 digits of the year
        setUniqueDigit(newUniqueCode);
        setUniqueId(`${currentYear}/${newUniqueCode.toString().padStart(5, 0)}`);
    };

    const handlePrintClick = () => {
        console.log("invoiceDatainvoiceData", invoiceData)
        setPdfModalOpen(true)
        let info = [];
        // invoiceData.forEach((element, index, array) => {
        //     info.push([index + 1, element.itemCode, element.itemName, element.uom, element.uom, element.uom, element.fcQty, element.fcRemarks])
        // });

        // Ensure a minimum of 10 items
        const minItems = 15;
        const placeholderItem = [''];
        while (info.length < minItems) {
            info.push([...placeholderItem]);
        }

        const doc = new jsPDF();
        const logoUrl = require('../../AllImage/RDL_Logo.png');
        // const IsoUrl = require('../../AllImage/ISOlogo.png');
        // const IsoUrl = require('../../AllImage/Picture.png');
        const tableOptions = {
            didDrawPage: (HookData) => {
                // Check if it's the first page
                if (HookData.pageNumber === 1) {
                    // Add an image on the first page
                    doc.addImage(logoUrl, 'PNG', 15, 15, 28, 20);
                }
            },
        };
        const logoAndAddress = [
            [
                {
                    content: `\n\n\n\n\n\nRDL Technologies Pvt Ltd. - FORCAST\n`,
                    colSpan: 1,
                    styles: {
                        halign: 'left', fontSize: 8, textColor: 'black',
                        lineWidth: { top: 0.2, right: 0, bottom: 0, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
                {
                    content: '',
                    colSpan: 1,
                    styles: {
                        lineWidth: { top: 0.2, right: 0, bottom: 0, left: 0 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
                {
                    content: `Plan From Date:${invoiceData[0]?.planDateFrom}\nPlan To Date:${invoiceData[0]?.planDateTo}`,
                    colSpan: 1,
                    styles: {
                        halign: 'left', fontSize: 8, textColor: 'black', /*valign: 'top',*/
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0 },
                        lineColor: { top: [0, 0, 0] },
                    }
                }
            ]
        ];
        const poHeader = [[{ content: 'Supplier Forecast', colSpan: 10, styles: { lineWidth: 0, textColor: '#ffffff', fontStyle: 'bold', fontWeight: 'bold', fillColor: '#4D55CC', } }]];
        const address = [
            [
                {
                    content: `Buyer : \n\nTelephone No : \n\nFax : \n\nEmail : `,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: `Supplier Name/Code:\n\n ${invoiceData[0]?.suppName}\n\n#${invoiceData[0]?.spAddress}\n\n`,
                    colSpan: 4,
                    rowSpan: 1,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: `Contact Person : \n\nTelephone No : \n\nFax : \n\nEmail : `,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8 }
                },
            ],
        ];

        const secondHeaderRow = [[
            { content: 'SI No', styles: { fontStyle: 'bold' } },
            { content: 'Part No', styles: { fontStyle: 'bold' } },
            { content: 'Part Description', styles: { fontStyle: 'bold' } },
            { content: 'UOM', styles: { fontStyle: 'bold' } },
            { content: 'Week1', styles: { fontStyle: 'bold' } },
            { content: 'Week2', styles: { fontStyle: 'bold' } },
            { content: 'Week3', styles: { fontStyle: 'bold' } },
            { content: 'Week4', styles: { fontStyle: 'bold' } },
            { content: 'FC Qty', styles: { fontStyle: 'bold' } },
            { content: 'FC Remarks', styles: { fontStyle: 'bold' } }
        ]];


        const headerRows = [...logoAndAddress, ...poHeader];
        const headerRows1 = [...address];

        const totalRow = [
            [
                {
                    content: `Note:\n
1) Parts Should be Supplied along with the Inspection Report.\n
2) Delivery Should made before 2:30 P.M ,if failure intimate concerned person.\n
3) Unless Indicated,Despatch Should not be made more than once a week.\n
4) If any dimension variation found in sample inspection done by Mallik,the whole lot to be reinspected at our place.\n
5) Supply should reach Mallik,on above said date.\n
6) One week quantity to be keep as stock at your end.\n
7) Before delivery,please conform with our (Mallik Engg)Stores/Purchase Authorised Personnel.\n
8) All sheduled items to be keep ready and offer for Inspection one day advance to the delivery date.\n
9) Delay in supply,Quality & Cost will affect to the Vendor Rating as well as Quality rating.
`,
                    colSpan: 10,
                    styles: { halign: 'left', fontSize: 7, fontStyle: 'bold' }
                },
            ]
        ];

        const instructions = [
            [
                {
                    content: `SPECIAL INSTRUCTIONS`,
                    colSpan: 1,
                    rowSpan: 1,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal', fontStyle: 'bold' }
                },
                {
                    content: `For RDL Technologies Pvt Ltd.`,
                    colSpan: 3,
                    styles: { halign: 'center', fontSize: 12, textColor: 'black', fontStyle: 'normal', fontStyle: 'bold' }
                },
            ],
            [
                {
                    content: ``,
                    colSpan: 1,
                    styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: `Added By : `,
                    colSpan: 1,
                    styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal', fontStyle: 'bold' }
                },
                {
                    content: `Reviewed By : `,
                    colSpan: 1,
                    styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal', fontStyle: 'bold' }
                },
                {
                    content: `Authorised By : `,
                    colSpan: 1,
                    styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal', fontStyle: 'bold' }
                },
            ]
        ]

        const footerData = [
            [
                {
                    content: `FORMAT NO:IMS-ME-PUR-F-205-Rev-1 Dated 08-08-2015`,
                    colSpan: 10,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
        ];

        const bodyRows = [...secondHeaderRow, ...info, ...totalRow]
        const footerRows = [...instructions, ...footerData]

        doc.autoTable({
            theme: 'striped',
            head: headerRows,
            // foot: footRows,
            // showHead: 'firstPage',
            // showFoot: 'lastPage',
            ...tableOptions,
            headStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0], // Header text color
                halign: 'center', // Header text alignment
                valign: 'middle', // Vertical alignment
                lineWidth: 0.1, // Border width
                lineColor: [0, 0, 0], // Border color,
                font: 'times',
            }
        });
        doc.autoTable({
            theme: 'striped',
            head: headerRows1,
            // foot: footRows,
            // showHead: 'firstPage',
            // showFoot: 'lastPage',
            ...tableOptions,
            startY: doc.lastAutoTable.finalY,
            headStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0], // Header text color
                halign: 'center', // Header text alignment
                valign: 'middle', // Vertical alignment
                lineWidth: 0.1, // Border width
                lineColor: [0, 0, 0], // Border color,
                font: 'times',
            }
        });
        doc.autoTable({
            theme: 'striped',
            head: bodyRows,
            // showHead: 'firstPage',
            // showFoot: 'lastPage',
            ...tableOptions,
            startY: doc.lastAutoTable.finalY,
            headStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0], // Header text color
                halign: 'center', // Header text alignment
                valign: 'middle', // Vertical alignment
                lineWidth: 0.1, // Border width
                lineColor: [0, 0, 0], // Border color
                fontStyle: 'normal',
                fontSize: 8,
                font: 'times',
            },
        });

        doc.autoTable({
            theme: 'striped',
            foot: footerRows,
            // foot: footRows,
            // showHead: 'firstPage',
            // showFoot: 'lastPage',
            ...tableOptions,
            startY: doc.lastAutoTable.finalY,
            footStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0], // Header text color
                halign: 'center', // Header text alignment
                valign: 'middle', // Vertical alignment
                lineWidth: 0.1, // Border width
                lineColor: [0, 0, 0], // Border color
                font: 'times',
            },
        });

        // doc.save('PurchaseOrder.pdf');
        const pdfBlob = doc.output('blob');
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfBlobUrl);
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px', marginTop: '10px', alignItems: 'center' }}>
                {/* <Link to='/ForeCastEntryResult' style={{ textDecoration: 'none' }}>
                    <Typography
                        sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                        variant="h5"
                    >
                        {`ForeCast Entry>>`}
                    </Typography>
                </Link> */}
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    {isEdit ? "Edit ForeCast Entry" : isView ? "View ForeCast Entry" : "New ForeCast Entry"}
                </Typography>
            </div>
            <form onSubmit={handleSubmit}>
                <Grid container padding={1}>
                    <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">FC No</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        label="PO No"
                                        size="small"
                                        style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                        disabled={true}
                                    >
                                        <MenuItem value={'R'}>R</MenuItem>
                                        <MenuItem value={'J'}>J</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    readOnly={true}
                                    required
                                    value={uniqueDigit}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    disabled={isView ? true : false}
                                    onChange={handleUniqueCodeChange}
                                    inputProps={{ maxLength: 5 }} // Set max length to 5 characters
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    type='date'
                                    readOnly={true}
                                    disabled={true}
                                    required
                                    value={formatDate(selectedDate)}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                                <TextField
                                    fullWidth
                                    // readOnly={true}
                                    required
                                    value={uniqueId}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    disabled={isView ? true : false}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={supplierList}
                                    value={supplierName}
                                    fullWidth
                                    getOptionLabel={(option) => option.label || supplierName}
                                    renderInput={(params) => <TextField {...params} label="Search Supplier" onChange={handleChange} />}
                                    onChange={(event, value) => handleSupplierAutocompleteChange(value)}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    disabled={isView ? true : false}
                                />
                                {/* <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    disabled={isView ? true : false}
                                    options={supplierList}
                                    fullWidth
                                    // getOptionLabel={(option) => option.spCode || ''}
                                    // value={supplierSelect}
                                    value={supplierSelect}
                                    getOptionLabel={(option) => option.label || supplierSelect}
                                    renderInput={(params) => <TextField {...params} label="Supplier" onChange={handleChange} />}
                                    onChange={(event, value) => handleSupplierSearchItemChange(value)}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                /> */}
                            </Grid>

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <TextField
                                    fullWidth
                                    id="outlined-multiline-static"
                                    label="Billing Address"
                                    multiline
                                    rows={4} // initial number of rows
                                    rowsMax={8} // maximum number of rows
                                    value={suppAddress}
                                    readOnly={true}
                                    size="small"
                                    style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                                    inputProps={{
                                        style: { height: '65px', fontSize: '13px' } // adjust minHeight as needed
                                    }}
                                    disabled={isView ? true : false}
                                />

                            </Grid>

                            {!isView && <Grid item xs={12} sm={12} md={4} lg={4} xl={4} >
                                <Button variant="text" disabled={suppAddress.length > 0 ? false : true} onClick={() => setChangeAddressModalOpen(true)}>Change</Button>
                            </Grid>}

                            <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                                <Button disabled={consumptionInDays ? false : true} variant="contained" onClick={() => setSelectItemsModalOpen(true)} style={{ backgroundColor: consumptionInDays ? '#002D68' : '' }}>Select Items</Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={12} md={1} lg={1} xl={1}></Grid>

                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4} style={{ fontSize: '75%' }}>
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={generatedPoLists}
                            fullWidth
                            value={selectedGeneratedPo}
                            getOptionLabel={(option) => option.poNo || selectedGeneratedPo}
                            renderInput={(params) => <TextField {...params} label="Search PO" onChange={handleFCChange} />}
                            onChange={(event, value) => handleGeneratedFCSelect(value)}
                            size="small"
                            style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                        />
                        <div style={{ width: '100%', textAlign: 'right', marginTop: '10px' }}>
                            <Button
                                variant="contained"
                                style={{
                                    width: "100%",
                                    background: isModuleLocked ? "gray" : "#002D68",
                                    color: "white",
                                    height: '35px',
                                    width: '250px',
                                }}
                                onClick={() => setViewMoreModal(true)}
                                disabled={isModuleLocked}
                            >
                                Additional Details
                            </Button>
                        </div>
                        {/* <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '0px', borderRadius: '10px', width: '100%', height: '34vh', overflow: 'auto', border: '1px solid black' }}>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} > */}
                        {/* <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}> */}
                        {/* <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>From Consumption Date</th>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        type='date'
                                                        onChange={(e) => setFromConsumptionDate(e.target.value)}
                                                        value={fromConsumptionDate}
                                                        size='small'
                                                        disabled={isView ? true : false}
                                                    />
                                                </td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>To Consumption Date</th>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        type='date'
                                                        onChange={(e) => setToConsumptionDate(e.target.value)}
                                                        value={toConsumptionDate}
                                                        size='small'
                                                        disabled={isView ? true : false}
                                                    />
                                                </td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Consumption in Days</th>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        onChange={(e) => setConsumptionInDays(e.target.value)}
                                                        value={consumptionInDays}
                                                        size='small'
                                                        disabled={isView ? true : false}
                                                    />
                                                </td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Plan Date From</th>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        type='date'
                                                        onChange={(e) => setPlanDateFrom(e.target.value)}
                                                        value={planDateFrom}
                                                        size='small'
                                                        disabled={isView ? true : false}
                                                    />
                                                </td>
                                            </tr> */}
                        {/* <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Plan Date To</th>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        type='date'
                                                        onChange={(e) => setPlanDateTo(e.target.value)}
                                                        value={planDateTo}
                                                        size='small'
                                                        disabled={isView ? true : false}
                                                    />
                                                </td>
                                            </tr> */}
                        {/* <tr style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}></td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <Button
                                    variant="contained"
                                    style={{
                                        width: "100%",
                                        background: "#002D68",
                                        color: "white",
                                        height: '35px',
                                    }}
                                    onClick={() => setViewMoreModal(true)}
                                >
                                    More
                                </Button>
                            </td>
                        </tr> */}
                        {/* <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Required %</th>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        onChange={(e) => setRequiredPercentage(e.target.value)}
                                                        value={requiredPercentage}
                                                        size='small'
                                                        disabled={isView ? true : false}
                                                    />
                                                </td>
                                            </tr>
                                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Special Instruction</th>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    <TextField
                                                        fullWidth
                                                        required
                                                        onChange={(e) => setSpecialInstruction(e.target.value)}
                                                        value={specialInstruction}
                                                        size='small'
                                                        disabled={isView ? true : false}
                                                    />
                                                </td>
                                            </tr> */}
                        {/* </table> */}
                        {/* </Grid>
                                </Grid>
                            </CardContent>
                        </Card> */}
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} marginTop={2}>
                        <Card style={{ boxShadow: '0 10px 10px 10px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '100%', height: screenHeight - 405, border: '1px solid black', }}>
                            <CardContent style={{ height: '100%', overflow: 'auto' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', columnGap: '10px', rowGap: '10px' }}>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                height: '35px',
                                                background:
                                                    userPermission[0]?.addData === 0 || isModuleLocked ? "gray" : "#002D68",
                                                color:
                                                    userPermission[0]?.addData === 0 || isModuleLocked ? "black" : "white",
                                            }}
                                            disabled={userPermission[0]?.addData === 0 || isModuleLocked}
                                            onClick={handleClearPage}
                                        >
                                            New
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                height: '35px',
                                                background:
                                                    userPermission[0]?.updateData === 0 || isModuleLocked ? "gray" : "#002D68",
                                                color:
                                                    userPermission[0]?.updateData === 0 || isModuleLocked ? "black" : "white",
                                            }}
                                            disabled={userPermission[0]?.updateData === 0 || isModuleLocked}
                                            onClick={() => {
                                                setIsView(false)
                                                setIsEdit(true)
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                background: userPermission[0]?.deleteData === 0 || isModuleLocked ? "gray" : "#002D68",
                                                color: userPermission[0]?.deleteData === 0 ? "black" : "white",
                                                height: '35px',
                                            }}
                                            disabled={userPermission[0]?.deleteData === 0 ? true : false || isModuleLocked}
                                            onClick={() => setDeleteDailogOpen(true)}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                background: isModuleLocked ? "gray" : "#002D68",
                                                color: "white",
                                                height: '35px',
                                            }}
                                            onClick={handleClearPage}
                                            disabled={isModuleLocked}
                                        >
                                            Clear
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{
                                                width: "100%",
                                                background: userPermission[0]?.print === 0 || isModuleLocked ? "gray" : "#002D68",
                                                color: userPermission[0]?.print === 0 || isModuleLocked ? "black" : "white",
                                                height: '35px',
                                            }}
                                            disabled={userPermission[0]?.print === 0 ? true : false || isModuleLocked}
                                            onClick={handlePrintClick}
                                        >
                                            Print
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                            onClick={() => handleForwardReverse('first', '')}

                                        >
                                            <FastRewindIcon />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                            onClick={() => handleForwardReverse('reverse', mainId)}

                                        >
                                            <SkipPreviousIcon />
                                        </Button>
                                        {/* <Button
                                                variant="contained"
                                                style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                            >
                                                <SearchIcon />
                                            </Button> */}
                                        <Button
                                            variant="contained"
                                            style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                            onClick={() => handleForwardReverse('forward', mainId)}

                                        >
                                            <SkipNextIcon />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{ width: "100%", background: "#002D68", color: "white", height: '35px', }}
                                            onClick={() => handleForwardReverse('last', '')}

                                        >
                                            <FastForwardIcon />
                                        </Button>
                                    </div>

                                    {
                                        !isView ? (
                                            <Button disabled={loading === true || isModuleLocked} variant="contained" type='submit' style={{ height: '35px', backgroundColor: isModuleLocked ? 'gray' : '#002D68', color: 'white' }}>
                                                {/* {isEdit ? "UPDATE" : "SAVE"} */}
                                                {loading ? (
                                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                                ) : (isEdit ? "UPDATE" : "SAVE")}
                                            </Button>
                                        ) : (
                                            null
                                        )
                                    }
                                </div>
                                {/* <DataGrid
                                    rows={selectedItems}
                                    columns={fcItemGridColumns}
                                    pageSize={5}
                                    style={{ height: '310px' }}
                                    processRowUpdate={handleCellEdit}
                                    key={refreshKey}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                    sx={{
                                        '& .super-app-theme--header': {
                                            WebkitTextStrokeWidth: '0.6px',
                                            backgroundColor: '#93bce6',
                                            color: '#1c1919'

                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696',
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696',
                                        },
                                    }}
                                    getRowClassName={(params) => {
                                        const rowIndex = selectedItems.findIndex(row => row.id === params.row.id);
                                        if (rowIndex !== -1) {
                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }
                                        return '';
                                    }}

                                /> */}
                                {/* <div style={{ overflowX: 'scroll' }}> */}
                                <table id="transactionTable">
                                    <tr style={{ position: 'sticky', top: '-16px', backgroundColor: '#f9f9f9', zIndex: 1 }}>
                                        <th style={{ whiteSpace: 'nowrap' }}>Part No</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Part Name</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>UOM</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Max Level</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Consumption Qty</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>QOH</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>FC Qty</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>LastPur Qty</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>LastGRN Qty</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>FC Remarks</th>
                                        <th style={{ whiteSpace: 'nowrap' }}>Actions</th>
                                    </tr>
                                    {selectedItems.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.itemCode}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.itemName}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.uom}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.maxLvl}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.consumptionQty}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.totStk}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false} onBlur={(e) => handleEdit('fcQty', e.target.textContent, item.id, item)}>{item.fcQty}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={false}>{item.lastPurQty}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={!isView} onBlur={(e) => handleEdit('lastGrnQty', e.target.textContent, item.id, item)}>{item.lastGrnQty}</td>
                                                <td style={{ whiteSpace: 'nowrap' }} contentEditable={!isView} onBlur={(e) => handleEdit('fcRemarks', e.target.textContent, item.id, item)}>{item.fcRemarks}</td>
                                                <td contentEditable={false} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                    {
                                                        !isView ?
                                                            <DeleteIcon
                                                                onClick={() => {
                                                                    handleDeleteRow(item.id)
                                                                }}
                                                                style={{ color: 'black', cursor: 'pointer' }}
                                                            />
                                                            :
                                                            <DeleteIcon
                                                                style={{ color: 'gray', cursor: 'pointer' }}
                                                            />
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </table>
                                {/* </div> */}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Dialog open={viewMoreModal} onClose={() => setViewMoreModal(false)} maxWidth="xl" fullWidth>
                    <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>Forecast Entry</DialogTitle>

                    <DialogContent style={{ padding: '2px' }}>
                        <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
                            {/* <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>From Consumption Date</th>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <TextField
                                        fullWidth
                                        required
                                        type='date'
                                        onChange={(e) => setFromConsumptionDate(e.target.value)}
                                        value={fromConsumptionDate}
                                        size='small'
                                        disabled={isView ? true : false}
                                    />
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>To Consumption Date</th>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <TextField
                                        fullWidth
                                        required
                                        type='date'
                                        onChange={(e) => setToConsumptionDate(e.target.value)}
                                        value={toConsumptionDate}
                                        size='small'
                                        disabled={isView ? true : false}
                                    />
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Consumption in Days</th>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <TextField
                                        fullWidth
                                        required
                                        onChange={(e) => setConsumptionInDays(e.target.value)}
                                        value={consumptionInDays}
                                        size='small'
                                        disabled={isView ? true : false}
                                    />
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Plan Date From</th>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <TextField
                                        fullWidth
                                        required
                                        type='date'
                                        onChange={(e) => setPlanDateFrom(e.target.value)}
                                        value={planDateFrom}
                                        size='small'
                                        disabled={isView ? true : false}
                                    />
                                </td>
                            </tr>*/}
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>From Consumption Date</th>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <TextField
                                        fullWidth
                                        required
                                        type='date'
                                        onChange={(e) => setFromConsumptionDate(e.target.value)}
                                        value={fromConsumptionDate}
                                        size='small'
                                        disabled={isView ? true : false}
                                    />
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>To Consumption Date</th>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <TextField
                                        fullWidth
                                        required
                                        type='date'
                                        onChange={(e) => setToConsumptionDate(e.target.value)}
                                        value={toConsumptionDate}
                                        size='small'
                                        disabled={isView ? true : false}
                                    />
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Consumption in Days</th>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <TextField
                                        fullWidth
                                        required
                                        onChange={(e) => setConsumptionInDays(e.target.value)}
                                        value={consumptionInDays}
                                        size='small'
                                        disabled={isView ? true : false}
                                    />
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Plan Date From</th>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <TextField
                                        fullWidth
                                        required
                                        type='date'
                                        onChange={(e) => setPlanDateFrom(e.target.value)}
                                        value={planDateFrom}
                                        size='small'
                                        disabled={isView ? true : false}
                                    />
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Plan Date To</th>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <TextField
                                        fullWidth
                                        required
                                        type='date'
                                        onChange={(e) => setPlanDateTo(e.target.value)}
                                        value={planDateTo}
                                        size='small'
                                        disabled={isView ? true : false}
                                    />
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Required %</th>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <TextField
                                        fullWidth
                                        required
                                        onChange={(e) => setRequiredPercentage(e.target.value)}
                                        value={requiredPercentage}
                                        size='small'
                                        disabled={isView ? true : false}
                                    />
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #ddd' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Special Instruction</th>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <TextField
                                        fullWidth
                                        required
                                        onChange={(e) => setSpecialInstruction(e.target.value)}
                                        value={specialInstruction}
                                        size='small'
                                        disabled={isView ? true : false}
                                    />
                                </td>
                            </tr>
                        </table>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setViewMoreModal(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </form>
            <ChangeAddressModal
                changeAddressModalOpen={changeAddressModalOpen}
                setChangeAddressModalOpen={setChangeAddressModalOpen}
                setSuppAddress={setSuppAddress}
                supplierSid={supplierSid}
            />
            <SelectItemsModal
                selectItemsModalOpen={selectItemsModalOpen}
                setSelectItemsModalOpen={setSelectItemsModalOpen}
                setSuppAddress={setSuppAddress}
                supplierId={supplierId}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
                fromConsumptionDate={fromConsumptionDate}
                toConsumptionDate={toConsumptionDate}
                consumptionInDays={consumptionInDays}
            />
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={uniqueDigit}
                // selectedMaster={selectedMaster}
                deleteService={DeleteForeCast}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
            <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
                <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>SUPPLIER FORECAST</DialogTitle>

                <DialogContent style={{ padding: '2px' }}>
                    {pdfUrl &&
                        <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
                    }
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setPdfModalOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ForeCastEntryModule