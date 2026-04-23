import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Button, Card, CardContent, Checkbox, CircularProgress, Grid, Typography } from '@mui/material';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';

// import PartMasterTitle from './PartMasterTitle';
// import PartMasterModule from './PartMasterModule';
// import StoresItemMasterTitle from './StoresItemMasterTitle';
// import StoresItemMasterModule from './StoresItemMasterModule';
import { AuthoriseDocs, DocsData, GetPurchaseOrderInvoiceData, ShowStoreItemMaster, StoreItemDelete, UploadGeneratedInvoice, UploadGeneratedPdf } from '../../../ApiService/LoginPageService'
import DeleteConfirmationDailog from '../../../Utility/confirmDeletion';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useModuleLocks } from '../../context/ModuleLockContext';

const AuthoriseDocumentsModule = () => {

    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Document Authorization")?.lockStatus === "locked";

    const [open, setOpen] = useState(false);
    const [isAddButton, setIsAddButton] = useState(true);
    const [editeData, setEditeData] = useState([]);
    const [dataSet, setDataSet] = useState([]);
    const [password, setConfirmPassword] = useState('');
    const [btnReset, setBtnReset] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [storeItemMasterList, setStoreItemMasterList] = useState([]);
    const [onPriceChan, setOnPriceChan] = useState(false);
    const [header1, setHearder1] = useState('');
    const [arrayList, setArrayList] = useState([]);
    const [DispatchList, setDispatList] = useState([]);

    const [priceDataSet, setPriceDataSet] = useState([]);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [selectedLevel, setSelectedLevel] = useState('')
    const navigate = useNavigate();

    // PO EMAIL 
    const [selectedPoDigit, setSelectedPoDigit] = useState('');
    const [selectedType, setSelectedType] = useState('')
    const [selectedPoMainId, setSelectedPoMainId] = useState('')
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
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

    const columns = [
        {
            field: 'docName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Document Name
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'docCount',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    No.of documents to authorise
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'secondLvlAuth',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    2nd Level : No of documents to authorise
                </span>,
            type: 'number',
            sortable: true,
            sortable: false,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerName: 'Actions',
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         <EditData selectedRow={params.row} />,
        //         <DeleteData selectedRow={params.row} />,
        //     ],
        // },
    ];


    const selectAllData = (e) => {
        if (e.target.checked) {
            setArrayList(priceDataSet);
        } else {
            setArrayList([]);
        }
    }

    // const columns2 = [
    //     {
    //         field: 'actions1', // Changed field name to 'actions1'
    //         type: 'actions',
    //         flex: 1,
    //         maxWidth: 60,
    //         alignItems: 'center',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 <Checkbox
    //                     label='Select All'
    //                     onClick={selectAllData}
    //                 />
    //             </span>,
    //         cellClassName: 'actions',
    //         disableClickEventBubbling: true,
    //         getActions: (params) => [
    //             <SelectAction selectedRow={params.row} />,
    //         ],
    //     },
    //     {
    //         field: 'refNo',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 {header1} No
    //             </span>,
    //         type: 'string',
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: 'center',
    //         headerAlign: 'center',
    //     },

    //     {
    //         field: 'createdDate',
    //         headerClassName: 'super-app-theme--header',
    //         headerName:
    //             <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                 {header1} Date
    //             </span>,
    //         type: 'number',
    //         sortable: true,
    //         sortable: false,
    //         minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //     },
    //     header1 === "PO" && (
    //         {
    //             field: 'suppCode',
    //             headerClassName: 'super-app-theme--header',
    //             headerName:
    //                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                     Supp Code
    //                 </span>,
    //             type: 'number',
    //             sortable: true,
    //             sortable: false,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },
    //         {
    //             field: 'suppName',
    //             headerClassName: 'super-app-theme--header',
    //             headerName:
    //                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                     Supp Name
    //                 </span>,
    //             type: 'number',
    //             sortable: true,
    //             sortable: false,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },
    //         {
    //             field: 'poType',
    //             headerClassName: 'super-app-theme--header',
    //             headerName:
    //                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                     PO Type
    //                 </span>,
    //             type: 'number',
    //             sortable: true,
    //             sortable: false,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },
    //         {
    //             field: 'reference',
    //             headerClassName: 'super-app-theme--header',
    //             headerName:
    //                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                     Reference
    //                 </span>,
    //             type: 'number',
    //             sortable: true,
    //             sortable: false,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },
    //         {
    //             field: 'addedBy',
    //             headerClassName: 'super-app-theme--header',
    //             headerName:
    //                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                     Added By
    //                 </span>,
    //             type: 'number',
    //             sortable: true,
    //             sortable: false,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         },
    //         {
    //             field: 'firstAuthBy',
    //             headerClassName: 'super-app-theme--header',
    //             headerName:
    //                 <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
    //                     First Auth By
    //                 </span>,
    //             type: 'number',
    //             sortable: true,
    //             sortable: false,
    //             minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    //         }
    //     )
    // ];

    const columns2 = [
        {
            field: 'actions1',
            type: 'actions',
            flex: 1,
            maxWidth: 60,
            alignItems: 'center',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    <Checkbox
                        label='Select All'
                        onClick={selectAllData}
                        disabled={isModuleLocked}
                    />
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <SelectAction selectedRow={params.row} />,
            ],
        },
        {
            field: 'refNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    {header1} No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'createdDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    {header1} Date
                </span>,
            type: 'number',
            sortable: false, // Corrected from duplicate sortable property
            minWidth: 100,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        // {
        //     field: 'Addedby',
        //     headerClassName: 'super-app-theme--header',
        //     headerName:
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Added By
        //         </span>,
        //     type: 'number',
        //     sortable: false, // Corrected from duplicate sortable property
        //     minWidth: 100,
        //     flex: 1,
        //     align: 'center',
        //     headerAlign: 'center',
        // },
    ];

    // Conditional columns for header1 === "PO"
    if (header1 === "PO") {
        columns2.push(
            {
                field: 'spCode',
                headerClassName: 'super-app-theme--header',
                headerName:
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        Supp Code
                    </span>,
                type: 'number',
                sortable: false,
                minWidth: 100,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'spName',
                headerClassName: 'super-app-theme--header',
                headerName:
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        Supp Name
                    </span>,
                type: 'number',
                sortable: false,
                minWidth: 100,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'potype',
                headerClassName: 'super-app-theme--header',
                headerName:
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        PO Type
                    </span>,
                type: 'number',
                sortable: false,
                minWidth: 100,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'poRefNo',
                headerClassName: 'super-app-theme--header',
                headerName:
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        Reference
                    </span>,
                type: 'number',
                sortable: false,
                minWidth: 100,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'poValue',
                headerClassName: 'super-app-theme--header',
                headerName:
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        PO Value
                    </span>,
                type: 'number',
                sortable: false,
                minWidth: 100,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            },
            {
                field: 'addedBy',
                headerClassName: 'super-app-theme--header',
                headerName:
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        Added By
                    </span>,
                type: 'number',
                sortable: false,
                minWidth: 100,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            }
        );

        // Check the condition for including 'firstAuthBy' column
        if (selectedLevel !== 'first') {
            columns2.push({
                field: 'firstAuthBy',
                headerClassName: 'super-app-theme--header',
                headerName:
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        First Auth By
                    </span>,
                type: 'number',
                sortable: false,
                minWidth: 100,
                flex: 1,
                align: 'center',
                headerAlign: 'center',
            });
        }
    }

    console.log(columns2);


    function SelectAction(props) {

        const onSelectedItem = () => {
            if (arrayList.some(item => item.id === props.selectedRow.id)) {

                setArrayList(arrayList.filter(item => item.id !== props.selectedRow.id));
            } else {

                setArrayList([...arrayList, props.selectedRow]);
                //NEW CODE PO EMAIL
                if (header1 === "PO") {
                    setSelectedPoDigit(props.selectedRow.digit)
                    setSelectedType(props.selectedRow.type)
                    setSelectedPoMainId(props.selectedRow.poMainId)
                }
            }
        }

        return (
            <div style={{ display: 'flex' }}>
                <Checkbox
                    disabled={isModuleLocked}
                    checked={arrayList.some(item => item.id === props.selectedRow.id)}
                    onClick={onSelectedItem}
                />
            </div>
        );
    }


    useEffect(() => {
        AuthoriseDocs({ type: '' }, handleAuthoriseDocsSuccess, handleAuthoriseDocsException);
    }, [refreshData]);

    const handleAuthoriseDocsSuccess = (dataObject) => {
        setDataSet(dataObject?.data || []);
    }

    const handleAuthoriseDocsException = () => {

    }

    const handleSucessShow = (dataObject) => {
        setStoreItemMasterList(dataObject?.data || []);
        // setGridLoading(false);
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

    }

    function EditData(props) {
        return (
            <EditIcon
                style={{ color: '#000000' }}
                onClick={(event) => {
                    setIsAddButton(false);
                    setEditeData(props.selectedRow);
                    setOpen(true);
                }}
            />
        );
    }

    function DeleteData(props) {
        return (
            <DeleteIcon
                onClick={() => {
                    setDeleteId(props.selectedRow.id);
                    setDeleteDailogOpen(true);
                }}
                style={{ color: 'black' }}
            />
        );
    }

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
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

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    // const onClikRowData = (e) => {
    //     console.log('onClikRowData==>', e.row)
    //     setHearder1(e.row?.docType);
    //     setOnPriceChan(true);
    //     AuthoriseDocs({ type: e.row?.docType }, handleAuthoriseSuccess, handleAuthoriseException);
    // }

    const handleCellClick = (e) => {
        console.log('onClikRowData==>', e)
        if (e.field === 'docCount') {
            setHearder1(e.row?.docType);
            setSelectedLevel('first');
            setOnPriceChan(true);
            AuthoriseDocs({ type: e.row?.docType, authLevel: 'first' }, handleAuthoriseSuccess, handleAuthoriseException);
        } else if (e.field === 'secondLvlAuth') {
            setHearder1(e.row?.docType);
            setOnPriceChan(true);
            setSelectedLevel('second');
            AuthoriseDocs({ type: e.row?.docType, authLevel: 'second' }, handleAuthoriseSuccess, handleAuthoriseException);
        } else {
            console.log('null')
        }
    }

    const handleAuthoriseSuccess = (dataObject) => {
        setPriceDataSet(dataObject?.data || []);
        setRefreshData(!refreshData);
    }

    const handleAuthoriseException = () => {

    }

    const handleDocsDataSUccess = (dataObject) => {
        setArrayList([]);
        AuthoriseDocs({ type: header1, authLevel: selectedLevel }, handleAuthoriseSuccess, handleAuthoriseException);
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        //PO INVICE////////////////////////////////////////////////////////////////////////////////////////////////////////
        // if (header1 === "PO" && selectedLevel === 'second') {
        //     getInvoiceData();
        // }
        if (header1 === "PO" && selectedLevel === 'second') {
            arrayList.forEach(row => {
                getInvoiceData(row.digit, row.type, row.poMainId);
            });
        }

        setTimeout(() => {
            handleClose();
            setLoading(false);
        }, 2000);
    }

    const handleDocsDataException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // setUploadLoader(false);
            // handleClose();
            setLoading(false);
        }, 2000);
    }

    const handleRowDoubleClick = (params) => {
        if (header1 === "PO") {
            navigate(`/PurchaseOrderGenerationModule?isAuthoriseDocument=true&&poDigit=${params.row.digit}&&isType=${params.row.type}`);
            console.log('Double clicked row data:', params.row);
        }
        if (header1 === "SRN") {
            navigate(`/StoresRequestNote?isAuthoriseDocument=true&&rowId=${params.row.id}`);
            console.log('Double clicked row data:', params.row);
        }
    }

    const handlePageHeaderLabel = (label) => {
        switch (label) {
            case 'PCN':
                return 'Authorise Documents : Price Change Note'
            case 'SRN':
                return 'Authorise Documents : Stores Request Note'
            case 'PO':
                return 'Authorise Documents : Purchase Order'
            default:
                return 'Authorise Documents'
        }
    }

    //PURCHASE INVOICE API CALL
    const getInvoiceData = (poDigit, prefix, poMainId) => {
        GetPurchaseOrderInvoiceData(
            { poDigit, prefix },
            (dataObject) => getInvoiceDataSuccess(dataObject, poDigit, poMainId),
            getInvoiceDataExceptoin
        );
    };


    const getInvoiceDataSuccess = (dataObject, poDigit, poMainId) => {
        console.log("getInvoiceDataSuccess", dataObject.testData);
        handleFileSave(dataObject?.testData || [], poDigit, poMainId);
    };


    const getInvoiceDataExceptoin = (errorObject, errorMessage) => {
        console.log("error Msg", errorMessage);
    }

    // function emptyRowsToPush(lineItems) {
    //     const pageSize = 39, header = 10, footer = 19;//20
    //     const content = header + lineItems + footer;
    //     const totPage = Math.floor(content / pageSize) + 1;
    //     const totalContentSize = pageSize * totPage;
    //     const rowToPush = totalContentSize - content
    //     return rowToPush;
    // }

    function emptyRowsToPush(lineItems) {
        const pageSize = 39;   // max rows per page (depends on your layout)
        const header = 10;     // rows occupied by header
        const footer = 19;     // rows reserved for footer

        // Content rows = header + actual line items + footer
        const content = header + lineItems + footer;

        // Total pages needed
        const totPage = Math.floor(content / pageSize) + 1;

        // Capacity of all pages
        const totalContentSize = pageSize * totPage;

        // Rows we need to pad
        let rowToPush = totalContentSize - content;

        // 🔧 Always keep at least 4 dummy rows
        if (rowToPush < 4) {
            rowToPush = 4;
        }

        return rowToPush;
    }
    const handleFileSave = (item, poDigit, poMainId) => {
        let info = [];
        item.data.forEach((element, index) => {
            const row = [
                element.sNo,
                element.itemCode,
                element.suppDesc,
                element.uom,
                element.qty,
                element.schDate,
                element.unitRate,
                element.value
            ];
            row.isInfoRow = true; // Attach a custom flag to identify rows for styling
            info.push(row);
        });

        const paddingNeeded = emptyRowsToPush(info.length)
        for (let i = 0; i < paddingNeeded; i++) {
            const emptyRow = ["", "", "", "", "", "", "", ""];
            emptyRow.isInfoRow = true; // Keep the same flag if you want same styling
            info.push(emptyRow);
        }

        const doc = new jsPDF();
        const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
        // console.log("baseUrl------------------>>>>>>>>>>>>>>", baseUrl);
        // const logoUrl = (await import('../../AllImage/RDL_Logo.png')).default;
        const logoUrl = `${baseUrl}/${item.companyImage}`
        const IsoUrl = require('../../../AllImage/Picture.png');

        // PAGE NUMBER
        const totalPagesExp = "{totalPages}"; // <-- Add this
        const tableOptions = {
            didDrawPage: (HookData) => {
                // Check if it's the first page
                if (HookData.pageNumber === 1) {
                    // Add an image on the first page
                    doc.addImage(logoUrl, 'PNG', 22, 18, 28, 15);
                    doc.addImage(IsoUrl, 'PNG', 160, 15, 35, 20);
                } else {
                    // From second page onward, show header
                    doc.setFontSize(10);
                    doc.setTextColor('blue');
                    doc.setFont("times", "bold");
                    doc.text(`Puchase Order No : ${item.poNo}     |     Date : ${item.date}`, 14, 8); // Adjust Y pos as needed
                    doc.setDrawColor(0);
                    // doc.line(14, 10, 196, 10); // Line under the header (optional)
                }

                // PAGE NUMBER 
                const pageSize = doc.internal.pageSize;
                const pageWidth = pageSize.width || pageSize.getWidth();
                const pageHeight = pageSize.height || pageSize.getHeight();

                doc.setFontSize(8);
                doc.setTextColor(70);
                // Left-aligned footer text
                doc.text(
                    `FORMAT NO : IMS-ME-PUR-F-219-Rev-3 Dated 11-01-2019`,
                    14, // X position (left margin)
                    pageHeight - 10
                );

                // Right-aligned page number
                doc.text(
                    `Page ${HookData.pageNumber} of ${totalPagesExp}`,
                    pageWidth - 14, // X position (right margin)
                    pageHeight - 10,
                    { align: 'right' } // Align text to the right
                );
            },
        };

        const logoAndAddress = [
            [
                {
                    content: ``,
                    colSpan: 2,
                    styles: {
                        halign: 'left', fontSize: 8, textColor: 'black',
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
                {
                    content: `${item.companyName}\n${item.companyAdd}. Tel:${item.telNo}\nWeb Site :${item.website}\nEmail : ${item.email}`,
                    colSpan: 6,
                    styles: {
                        halign: 'left', fontSize: 8, textColor: 'black',
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
            ],
            [
                {
                    content: `PAN No: ${item.cmpPanNo}`,
                    colSpan: 2,
                    styles: {
                        fontSize: 8, textColor: 'black', /*valign: 'top',*/
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
                {
                    content: `CIN No: ${item.cmpCinNo}`,
                    colSpan: 2,
                    styles: {
                        fontSize: 8, textColor: 'black', /*valign: 'top',*/
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
                {
                    content: `GSTINO: ${item.cmpGstNo}`,
                    colSpan: 4,
                    styles: {
                        fontSize: 8, textColor: 'black', /*valign: 'top',*/
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    }
                }
            ]
        ];

        const poHeader = [[{
            content: `PURCHASE ORDER - ${item.type === 'J' ? 'JOB WORK' : 'RAW MATERIAL'}`, colSpan: 8,
            styles: {
                lineWidth: 0,
                textColor: "#000000", // dark text on light background
                fontStyle: "bold",
                fontWeight: "bold",
                fillColor: [200, 210, 255], fontSize: 8,
            },
        }]];

        const address = [
            [
                {
                    content: `To :\nM/s. ${item.toName}\n${item.toAddress}\nPAN No. ${item.panNo}\nGST No. ${item.supGst}`,
                    colSpan: 2,
                    rowSpan: 5,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: `Ship To :\nM/s. ${item.shipAddress}`,
                    colSpan: 1,
                    rowSpan: 5,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: 'Order No:',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: item.poNo,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue' }
                },
            ],
            [
                {
                    content: 'Ammendment No:',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: item.ammend,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'red' }
                },
            ],
            [
                {
                    content: 'Date :',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: item.date,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue' }
                },
            ],
            [
                {
                    content: 'PO Type :',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: item.poType,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'red' }
                },
            ],
            [
                {
                    content: 'Ref No & Date:',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: item.refNoDate,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'red' }
                },
            ],
        ];

        const firstHeaderRow = [[{ content: 'We are pleased to place an order for the following items, subject to the terms & conditions given below', colSpan: 8 }]];

        const secondHeaderRow = [['SI No', `          Item Code          `, `      Item Description      `, 'UOM', 'Qty', 'Sch Date', 'Unit Rate', 'Value']];

        const headerRows = [...logoAndAddress,/* ...pan,*/ ...poHeader, ...address, ...firstHeaderRow, ...secondHeaderRow];

        const totalRow = [
            [
                {
                    content: '"Special Instruction: Multiple GST rate not allowed in Single Invoice"',
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 8, textColor: 'red' }
                },
                {
                    content: 'Total',
                    colSpan: 1,
                    styles: { halign: 'center', fontSize: 8, textColor: 'blue' }
                },
                {
                    content: `${item.code} ${Number(item.total || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'center', fontSize: 8, textColor: 'blue' }
                },
            ]
        ];
        const totalWords = [[
            {
                content: 'Total Amount In Words',
                colSpan: 2,
                styles: { halign: 'left', fontSize: 8 }
            },
            {
                content: `INR ${item.amountInWords}`,
                colSpan: 6,
                styles: { halign: 'left', fontSize: 8, textColor: 'blue', fontStyle: 'normal' }
            }
        ]];

        const termsAndSuppluColumn = [
            [
                {
                    content: 'Terms & Conditions:',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'red' }
                },
                {
                    content: 'Supply Conditions:',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'red' }
                }
            ],
            [
                {
                    content: 'GST :',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: item.gst,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue', fontStyle: 'normal' }
                },
                {
                    content: '* Necessary Test Certificate/ Inspection Reports shall be furnished along with the supplies\n* Subject to Bengaluru Jurisdiction',
                    colSpan: 4,
                    rowSpan: 5,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'Payment Terms :',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: item.paymentTerms,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'Delivery Mode :',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: item.deliveryMode,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'Supply of Matl. :',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: item.supplyOfMaterial,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'Special Instruction 1 :',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue', fontStyle: 'normal' }
                },
                {
                    content: item.specialInstruction1,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'blue', fontStyle: 'normal' }
                },
            ]
        ]

        const requirements = [
            [
                {
                    content: 'EMS Requirements :',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 7, textColor: 'black' }
                },
                {
                    content: 'OHSAS requirements :',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 7, textColor: 'black' }
                }
            ],
            [
                {
                    content: '* Reduce process scrap\n* Use recycled carton boxes for packing the components\n* Conserve usage of electrical energy\n* Ensure disposal of hazardous waste to authorised Agency\n* Conserve usage of oils and recycle the same to the extent possible',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 6, textColor: 'black', fontStyle: 'normal', valign: 'top', }
                },
                {
                    content: '* All operators should wear relevant PPEs Like Safety shoe,Helmet, Goggles,Handgloves as applicable during working.\n* Ensure necessary material handling equipments/in your facilities\n* Monitor and Evaluate Near Miss Incidents.\n* Ensure Statutory Requirements.',
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 6, textColor: 'black', fontStyle: 'normal', valign: 'top', }
                }
            ]
        ]
        const payment = [[{
            content: '"Payment in 45 days on Mutual consent to MSME Category Suppliers (i.e. Micro & Small Enterprises)Subject to submission of evidence of MSME category andsubject to proper supply, quality clearance and statutory compliances."',
            colSpan: 8,
            styles: { fontStyle: 'normal', fontSize: 7, }
        }]];
        const para = [[{
            content: 'Please send the acknowledgement thru return mail for having accepted this purchase order. In case of no communication within 2days of the receipt of the mail, Purchase order shall be considered as accepted by you.',
            colSpan: 8,
            styles: { fontStyle: 'normal', fontSize: 6, }
        }]];

        const users = [[
            {
                content: `Prepared By / ${item.preparedBy}`,
                colSpan: 2,
                styles: { halign: 'center', fontSize: 7, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: `Reviewed By / ${item.reviewedBy}`,
                colSpan: 3,
                styles: { halign: 'center', fontSize: 7, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: `Approved By / ${item.approvedBy}`,
                colSpan: 3,
                styles: { halign: 'center', fontSize: 7, textColor: 'black', fontStyle: 'normal' }
            }
        ]];

        const note = [[
            {
                content: 'Note',
                colSpan: 1,
                styles: { halign: 'left', fontSize: 7, textColor: 'red', fontStyle: 'bold' }
            },
            {
                content: 'This is computer generated document and is valid without signature',
                colSpan: 7,
                styles: { halign: 'left', fontSize: 7, textColor: 'blue', fontStyle: 'bold' }
            },
        ]];

        const outerTable = [
            [
                {
                    content: 'Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076',
                    colSpan: 8,
                    styles: {
                        halign: 'left', fontSize: 7, textColor: 'black', fontStyle: 'normal', lineWidth: 0,
                        lineWidth: { top: 0.2, right: 0, bottom: 0, left: 0 },
                        lineColor: { top: [0, 0, 0] },
                    }
                },
            ],
            [
                {
                    content: 'Branch Address: Plot No. 98-I, Road No. 6, KIADB Jigani Industrial Estate, 2nd Phase, Jigani, Anekal Tq, Bangalore - 560105.',
                    colSpan: 8,
                    styles: {
                        halign: 'left', fontSize: 7, textColor: 'black', fontStyle: 'normal', lineWidth: 0,
                    }
                },
            ]
        ];

        const bodyRows = [...info, ...totalRow, ...totalWords, ...termsAndSuppluColumn, ...requirements, ...payment, ...para, ...users, ...note]
        const footRows = [...outerTable]

        const sharedColumnStyles = {
            0: { cellWidth: 10 },  // SI No
            1: { cellWidth: 45 },  // Item Code
            2: { cellWidth: 63 },  // Item Description
            3: { cellWidth: 11 },  // UOM
            4: { cellWidth: 10 },  // Qty
            5: { cellWidth: 15 },  // Sch Date
            6: { cellWidth: 15 },  // Unit Rate
            7: { cellWidth: 14 },  // Value
        };
        doc.autoTable({
            theme: 'striped',
            head: headerRows,
            body: bodyRows,
            foot: footRows,
            showHead: 'firstPage',
            showFoot: 'lastPage',
            ...tableOptions,
            headStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0], // Header text color
                halign: 'center', // Header text alignment
                valign: 'middle', // Vertical alignment
                lineWidth: 0.1, // Border width
                lineColor: [0, 0, 0], // Border color,
                font: 'times',
                fontSize: 8,

            },
            bodyStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0], // Header text color
                halign: 'left', // Header text alignment
                valign: 'middle', // Vertical alignment
                lineWidth: 0.1, // Border width
                lineColor: [0, 0, 0], // Border color
                fontStyle: 'normal',
                fontSize: 7,
                font: 'times',
                cellWidth: 'wrap', // avoids wrapping
            },
            columnStyles: sharedColumnStyles, // ✅ Apply shared styles

            footStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0], // Header text color
                halign: 'center', // Header text alignment
                valign: 'middle', // Vertical alignment
                lineWidth: 0.1, // Border width
                lineColor: [0, 0, 0], // Border color
                font: 'times',
            },
            didDrawPage: function (data) {
                const pageHeight = doc.internal.pageSize.height;
                const pageWidth = doc.internal.pageSize.width;

                if (data.pageNumber === 1) {
                    doc.addImage(logoUrl, 'PNG', 22, 18, 28, 15);
                    doc.addImage(IsoUrl, 'PNG', 160, 15, 35, 20);
                } else {
                    const headerHeight = 7; // Adjust height of your repeated header
                    // data.settings.margin.top += headerHeight; // ⬅ Push main table content down to prevent overlap

                    doc.autoTable({
                        head: [secondHeaderRow[0]], // just the 1 header row
                        body: [['', '', '', '', '', '', '', '']], // Empty dummy row
                        startY: data.settings.margin.top - headerHeight, // Place at the original top
                        theme: 'plain',
                        styles: {
                            fontSize: 8,
                            halign: 'center',
                            valign: 'middle',
                            lineWidth: 0.1,
                            lineColor: [0, 0, 0],
                            font: 'times',
                            cellWidth: 'wrap',

                        },
                        columnStyles: sharedColumnStyles, // ✅ Apply shared styles
                        //  startY: 5,                  // instead of 10 or more
                        //   margin: { top: 7, bottom: 25 },
                        headStyles: {
                            fillColor: [255, 255, 255],
                            textColor: [0, 0, 0],
                            halign: 'center',
                            valign: 'middle',
                        },

                        didParseCell: function (hookData) {
                            if (hookData.section === 'body') {
                                // ✅ hide content and remove height
                                hookData.cell.text = '';
                                hookData.cell.styles.minCellHeight = 0;
                                hookData.cell.styles.cellPadding = 0;
                                hookData.cell.styles.lineWidth = 0;
                            }
                        },
                        margin: {
                            left: data.settings.margin.left,
                            right: data.settings.margin.right
                        }
                    });
                    // data.cursor.y += headerHeight;

                    // Optional heading
                    doc.setFontSize(9);
                    doc.setFont("times", "bold");
                    doc.setTextColor('blue');
                    doc.text(`Purchase Order No: ${item.poNo}     |     Date: ${item.date}`, 14, 5);

                    // doc.text(`Purchase Order No: ${item.poNo}     |     Date: ${item.date}`, 14, 3);
                }

                // Footer
                doc.setFontSize(8);
                doc.setTextColor(70);
                doc.text('FORMAT NO: IMS-ME-PUR-F-219-Rev-3 Dated 11-01-2019', 14, pageHeight - 10);
                doc.text(`Page ${data.pageNumber} of ${totalPagesExp}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
            },
            didParseCell: function (data) {
                const colIndex = data.column.index;
                const rowIndex = data.row.index;
                const row = data.row.raw;
                if (data.section === 'body') {
                    data.cell.styles.overflow = 'linebreak';
                    data.cell.styles.fillColor = false;

                }


                if (data.row.index === 0) {
                    data.cell.styles.fontStyle = 'bold';
                }

                // ✅ Add this block
                if (data.section === 'head') {
                    if (data.column.raw === 'Unit Rate' || data.column.raw === 'Value') {
                        data.cell.styles.halign = 'right';
                    }
                }

                // const rightAlignColumns = [3, 4, 5, 6, 7];
                // // if (data.row.index > 0 && rightAlignColumns.includes(data.column.index)) {
                // //     data.cell.styles.halign = 'right';
                // // }
                // if (data.section === 'body' && rightAlignColumns.includes(data.column.index)) {
                //     data.cell.styles.halign = 'right';
                // }

                const dataRowCount = info.length + totalRow.length + totalWords.length;  // Adjust as needed
                const rightAlignColumns = [3, 4, 5, 6, 7];

                if (
                    data.section === 'body' &&
                    rowIndex < dataRowCount && // Only align rows that are actual data
                    rightAlignColumns.includes(colIndex)
                ) {
                    data.cell.styles.halign = 'right';
                }

                // Assuming itemCode is in column index 1
                if (data.section === 'body' && row?.isInfoRow && colIndex === 1) {
                    data.cell.styles.textColor = 'blue'; // Custom blue color
                    data.cell.styles.fontStyle = 'bold';
                }
                if (data.section === 'body' && row?.isInfoRow && colIndex === 2) {
                    data.cell.styles.textColor = 'blue'; // Custom blue color
                    data.cell.styles.fontStyle = 'bold';
                }
                if (data.section === 'body' && row?.isInfoRow && colIndex === 4) {
                    data.cell.styles.textColor = 'blue'; // Custom blue color
                    data.cell.styles.fontStyle = 'bold';
                }
                if (data.section === 'body' && row?.isInfoRow && colIndex === 5) {
                    data.cell.styles.textColor = 'blue'; // Custom blue color
                    data.cell.styles.fontStyle = 'bold';
                }
                if (data.section === 'body' && row?.isInfoRow && colIndex === 6) {
                    data.cell.styles.textColor = 'red'; // Custom blue color
                    data.cell.styles.fontStyle = 'bold';
                }
                if (data.section === 'body' && row?.isInfoRow && colIndex === 7) {
                    data.cell.styles.textColor = 'black'; // Custom blue color
                    data.cell.styles.fontStyle = 'bold';
                }
                if (data.section === 'body') {
                    data.cell.styles.overflow = 'linebreak'; // ✅ enables wrapping
                }
            }
        });

        // PAGE NUMBER
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp); // This replaces "{totalPages}" in all pages
        }

        const base64String = doc.output('datauristring');
        UploadGeneratedPdf(
            { digit: poDigit, poMainId, file: base64String },
            handleUploadSuccess,
            handleUploadException
        );
        // UploadGeneratedInvoice({ poMainId: selectedPoMainId, file: base64String }, handleUploadSuccess, handleUploadException)
    }

    // const handleFileSave = (item) => {
    //     let info = [];
    //     item.data.forEach((element, index, array) => {
    //         info.push([element.sNo, element?.itemCode, element.itemDescription, element.uom, element.qty, element.schDate, element.unitRate, element.value])
    //     });
    //     const doc = new jsPDF();
    //     const logoUrl = require('../../../AllImage/RDL_Logo.png');
    //     const IsoUrl = require('../../../AllImage/ISOlogo.png');
    //     const tableOptions = {
    //         didDrawPage: (HookData) => {
    //             // Check if it's the first page
    //             if (HookData.pageNumber === 1) {
    //                 // Add an image on the first page
    //                 doc.addImage(logoUrl, 'PNG', 13, 15, 28, 20);
    //                 doc.addImage(IsoUrl, 'PNG', 175, 16, 20, 10);
    //             }
    //         },
    //     };

    //     const logoAndAddress = [
    //         [
    //             {
    //                 content: `\n\n\n\n\n\nRDL Technologies Pvt Ltd.\nPlot No. 126, Road No 3, KIADB Industrial Estate\nII Phase, Jigani Industrial Area, Jigani,Anekal Taluk,\nBengaluru - 560 105. Tel:080-27825249\nWeb Site :www.mallikengineering.com\nEmail : info@mallikengineering.com`,
    //                 colSpan: 3,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0 }
    //             },
    //             {
    //                 content: '',
    //                 colSpan: 2,
    //                 styles: { lineWidth: 0 }
    //             },
    //             {
    //                 content: `\n\n\n\nISO 9001 : 2015\nISO 14001 : 2015\nOHSAS 18001 : 2007\n\n\nCIN No: U28112KA2013PTC068181\nPAN No: AAICM4744Q\nGSTINO: 29AAICM4744Q1ZM`,
    //                 colSpan: 3,
    //                 styles: { halign: 'right', fontSize: 8, textColor: 'black', /*valign: 'top',*/ lineWidth: 0 }
    //             }
    //         ]
    //     ];

    //     const poHeader = [[{ content: `PURCHASE ORDER - ${item.type === 'J' ? 'JOB WORK' : 'RAW MATERIAL'}`, colSpan: 8, styles: { lineWidth: 0, textColor: '#ffffff', fontStyle: 'bold', fontWeight: 'bold', fillColor: '#4D55CC', } }]];
    //     const address = [
    //         [
    //             {
    //                 content: `To,\nM/s. ${item.toName}\n${item.toAddress}\nPAN No. ${item.panNo}\nGST No. ${item.supGst}`,
    //                 colSpan: 4,
    //                 rowSpan: 5,
    //                 styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: 'Order No:',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10 }
    //             },
    //             {
    //                 content: item.poNo,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'Ammendment No:',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10 }
    //             },
    //             {
    //                 content: item.ammend,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'Date :',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10 }
    //             },
    //             {
    //                 content: item.date,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'PO Type :',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10 }
    //             },
    //             {
    //                 content: item.poType,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'Ref No & Date:',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10 }
    //             },
    //             {
    //                 content: '',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
    //             },
    //         ],
    //     ];
    //     const firstHeaderRow = [[{ content: 'We are pleased to place an order for the following items, subject to the terms & conditions given below', colSpan: 8 }]];

    //     const secondHeaderRow = [['SI No', 'Item Code', 'Item Description', 'UOM', 'Qty', 'Sch Date', 'Unit Rate', 'Value']];

    //     const headerRows = [...logoAndAddress,/* ...pan,*/ ...poHeader, ...address, ...firstHeaderRow, ...secondHeaderRow];

    //     const totalRow = [
    //         [
    //             {
    //                 content: '"Special Instruction: Multiple GST rate not allowed in Single Invoice"',
    //                 colSpan: 5,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'red' }
    //             },
    //             {
    //                 content: 'Total',
    //                 colSpan: 1,
    //                 styles: { halign: 'center', fontSize: 10, textColor: 'blue' }
    //             },
    //             {
    //                 content: `${item.code} ${item.total}`,
    //                 colSpan: 2,
    //                 styles: { halign: 'center', fontSize: 10, textColor: 'blue' }
    //             },
    //         ]
    //     ];
    //     const totalWords = [[
    //         {
    //             content: 'Total Amount In Words',
    //             colSpan: 2,
    //             styles: { halign: 'left', fontSize: 10 }
    //         },
    //         {
    //             content: `INR ${item.amountInWords}`,
    //             colSpan: 6,
    //             styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
    //         }
    //     ]];

    //     const termsAndSuppluColumn = [
    //         [
    //             {
    //                 content: 'Terms & Conditions:',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'red' }
    //             },
    //             {
    //                 content: 'Supply Conditions:',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'red' }
    //             }
    //         ],
    //         [
    //             {
    //                 content: 'GST :',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: item.gst,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: '* Necessary Test Certificate/ Inspection Reports shall be furnished along with the supplies\n* Subject to Bengaluru Jurisdiction',
    //                 colSpan: 4,
    //                 rowSpan: 5,
    //                 styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'Payment Terms :',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: item.paymentTerms,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'Delivery Mode :',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: item.deliveryMode,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'Supply of Matl. :',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: item.supplyOfMaterial,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'Special Instruction 1 :',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: item.specialInstruction1,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
    //             },
    //         ]
    //     ]

    //     const requirements = [
    //         [
    //             {
    //                 content: 'EMS Requirements :',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'black' }
    //             },
    //             {
    //                 content: 'OHSAS requirements :',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'black' }
    //             }
    //         ],
    //         [
    //             {
    //                 content: '* Reduce process scrap\n* Use recycled carton boxes for packing the components\n* Conserve usage of electrical energy\n* Ensure disposal of hazardous waste to authorised Agency\n* Conserve usage of oils and recycle the same to the extent possible',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', valign: 'top', }
    //             },
    //             {
    //                 content: '* All operators should wear relevant PPEs Like Safety shoe,Helmet, Goggles,Handgloves as applicable during working.\n* Ensure necessary material handling equipments/in your facilities\n* Monitor and Evaluate Near Miss Incidents.\n* Ensure Statutory Requirements.',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', valign: 'top', }
    //             }
    //         ]
    //     ]

    //     const para = [[{
    //         content: 'Please send the acknowledgement thru return mail for having accepted this purchase order. In case of no communication within 2days of the receipt of the mail, Purchase order shall be considered as accepted by you.',
    //         colSpan: 8,
    //         styles: { fontStyle: 'normal', fontSize: 9, }
    //     }]];

    //     const users = [[
    //         {
    //             content: `Prepared By / ${item.preparedBy}`,
    //             colSpan: 2,
    //             styles: { halign: 'center', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
    //         },
    //         {
    //             content: `Reviewed By / ${item.reviewedBy}`,
    //             colSpan: 3,
    //             styles: { halign: 'center', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
    //         },
    //         {
    //             content: `Approved By / ${item.approvedBy}`,
    //             colSpan: 3,
    //             styles: { halign: 'center', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
    //         }
    //     ]];

    //     const note = [[
    //         {
    //             content: 'Note',
    //             colSpan: 1,
    //             styles: { halign: 'left', fontSize: 9, textColor: 'red', fontStyle: 'bold' }
    //         },
    //         {
    //             content: 'This is computer generated document and is valid without signature',
    //             colSpan: 7,
    //             styles: { halign: 'left', fontSize: 9, textColor: 'blue', fontStyle: 'bold' }
    //         },
    //     ]];

    //     const outerTable = [
    //         [
    //             {
    //                 content: 'Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076',
    //                 colSpan: 8,
    //                 styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', lineWidth: 0 }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'FORMAT NO : IMS-ME-PUR-F-219-Rev-3 Dated 11-01-2019',
    //                 colSpan: 8,
    //                 styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', lineWidth: 0 }
    //             },
    //         ]
    //     ];

    //     const bodyRows = [...info, ...totalRow, ...totalWords, ...termsAndSuppluColumn, ...requirements, ...para, ...users, ...note]
    //     const footRows = [...outerTable]

    //     doc.autoTable({
    //         theme: 'striped',
    //         head: headerRows,
    //         body: bodyRows,
    //         foot: footRows,
    //         showHead: 'firstPage',
    //         showFoot: 'lastPage',
    //         ...tableOptions,
    //         headStyles: {
    //             fillColor: [255, 255, 255], // Header background color
    //             textColor: [0, 0, 0], // Header text color
    //             halign: 'center', // Header text alignment
    //             valign: 'middle', // Vertical alignment
    //             lineWidth: 0.1, // Border width
    //             lineColor: [0, 0, 0], // Border color,
    //             font: 'times',
    //         },
    //         bodyStyles: {
    //             fillColor: [255, 255, 255], // Header background color
    //             textColor: [0, 0, 0], // Header text color
    //             halign: 'center', // Header text alignment
    //             valign: 'middle', // Vertical alignment
    //             lineWidth: 0.1, // Border width
    //             lineColor: [0, 0, 0], // Border color
    //             fontStyle: 'normal',
    //             fontSize: 8,
    //             font: 'times',
    //         },
    //         footStyles: {
    //             fillColor: [255, 255, 255], // Header background color
    //             textColor: [0, 0, 0], // Header text color
    //             halign: 'center', // Header text alignment
    //             valign: 'middle', // Vertical alignment
    //             lineWidth: 0.1, // Border width
    //             lineColor: [0, 0, 0], // Border color
    //             font: 'times',
    //         },
    //     });

    //     // doc.save('PurchaseOrder.pdf');
    //     // const pdfBlob = doc.output('blob');
    //     // const pdfBlobUrl = URL.createObjectURL(pdfBlob);
    //     // setPdfUrl(pdfBlobUrl);

    //     // doc.save('PurchaseOrder.pdf');
    //     // Get the PDF as a base64 encoded string
    //     const base64String = doc.output('datauristring');
    //     // You can extract just the base64 part if needed
    //     // const base64Only = base64String.split(',')[1]; // Removing "data:application/pdf;base64,"
    //     console.log("Base64 PDF String:", base64String);
    //     UploadGeneratedPdf({ digit: selectedPoDigit, file: base64String }, handleUploadSuccess, handleUploadException)
    // }

    // const handleFileSaveS = (item) => {
    //     let info = [];
    //     item.data.forEach((element, index, array) => {
    //         info.push([element.sNo, element.itemCode, element.itemDescription, element.uom, element.qty, element.schDate, element.unitRate, element.value])
    //     });
    //     const doc = new jsPDF();
    //     const logoUrl = require('../../../AllImage/RDL_Logo.png');
    //     const IsoUrl = require('../../../AllImage/ISOlogo.png');
    //     const tableOptions = {
    //         didDrawPage: (HookData) => {
    //             // Check if it's the first page
    //             if (HookData.pageNumber === 1) {
    //                 // Add an image on the first page
    //                 doc.addImage(logoUrl, 'PNG', 18, 16, 28, 20);
    //                 doc.addImage(IsoUrl, 'PNG', 175, 16, 20, 10);
    //             }
    //         },
    //     };

    //     const logoAndAddress = [
    //         [
    //             {
    //                 content: {
    //                     image: logoUrl,
    //                     width: 30, // adjust the width as needed
    //                     height: 30, // adjust the height as needed
    //                 },
    //                 colSpan: 2
    //             },
    //             {
    //                 content: 'RDL Technologies Pvt Ltd.\nPlot No. 126, Road No 3, KIADB Industrial Estate\nII Phase, Jigani Industrial Area, Jigani,Anekal Taluk,\nBengaluru - 560 105. Tel:080-27825249\nWeb Site :www.mallikengineering.com\nEmail : info@mallikengineering.com',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: 'ISO 9001 : 2015\nISO 14001 : 2015\nOHSAS 18001 : 2007',
    //                 colSpan: 2,
    //                 styles: { halign: 'right', fontSize: 6, textColor: 'black', valign: 'bottom' }
    //             }
    //         ]
    //     ];
    //     const pan = [[
    //         {
    //             content: 'CIN No. U28112KA2013PTC068181',
    //             colSpan: 3,
    //             styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //         },
    //         {
    //             content: 'PAN No.AAICM4744Q',
    //             colSpan: 2,
    //             styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //         },
    //         {
    //             content: 'GSTINO. 29AAICM4744Q1ZM',
    //             colSpan: 3,
    //             styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //         }
    //     ]];
    //     const poHeader = [[{ content: `PURCHASE ORDER - ${item.type === 'J' ? 'JOB WORK' : 'RAW MATERIAL'}`, colSpan: 8, styles: { textColor: 'blue' } }]];
    //     const address = [
    //         [
    //             {
    //                 content: `To,\nM/s. ${item.toName}\n${item.toAddress}\nPAN No. ${item.panNo}\nGST No. ${item.gstNo}`,
    //                 colSpan: 4,
    //                 rowSpan: 5,
    //                 styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: 'Order No:',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10 }
    //             },
    //             {
    //                 content: item.poNo,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'Ammendment No:',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10 }
    //             },
    //             {
    //                 content: '1',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'Date :',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10 }
    //             },
    //             {
    //                 content: item.date,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'PO Type :',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10 }
    //             },
    //             {
    //                 content: item.poType,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'Ref No & Date:',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10 }
    //             },
    //             {
    //                 content: '',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
    //             },
    //         ],
    //     ];
    //     const firstHeaderRow = [[{ content: 'We are pleased to place an order for the following items, subject to the terms & conditions given below', colSpan: 8 }]];

    //     const secondHeaderRow = [['SI No', 'Item Code', 'Item Description', 'UOM', 'Qty', 'Sch Date', 'Unit Rate', 'Value']];

    //     const headerRows = [...logoAndAddress, ...pan, ...poHeader, ...address, ...firstHeaderRow, ...secondHeaderRow];

    //     const totalRow = [
    //         [
    //             {
    //                 content: '"Special Instruction: Multiple GST rate not allowed in Single Invoice"',
    //                 colSpan: 5,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'red' }
    //             },
    //             {
    //                 content: 'Total',
    //                 colSpan: 1,
    //                 styles: { halign: 'center', fontSize: 10, textColor: 'blue' }
    //             },
    //             {
    //                 content: `INR ${item.total}`,
    //                 colSpan: 2,
    //                 styles: { halign: 'center', fontSize: 10, textColor: 'blue' }
    //             },
    //         ]
    //     ];
    //     const totalWords = [[
    //         {
    //             content: 'Total Amount In Words',
    //             colSpan: 2,
    //             styles: { halign: 'left', fontSize: 10 }
    //         },
    //         {
    //             content: `INR ${item.amountInWords}`,
    //             colSpan: 6,
    //             styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
    //         }
    //     ]];

    //     const termsAndSuppluColumn = [
    //         [
    //             {
    //                 content: 'Terms & Conditions:',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'red' }
    //             },
    //             {
    //                 content: 'Supply Conditions:',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'red' }
    //             }
    //         ],
    //         [
    //             {
    //                 content: 'GST :',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: item.gst,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: '* Necessary Test Certificate/ Inspection Reports shall be furnished along with the supplies\n* Subject to Bengaluru Jurisdiction',
    //                 colSpan: 4,
    //                 rowSpan: 5,
    //                 styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'Payment Terms :',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: item.paymentTerms,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'Delivery Mode :',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: item.deliveryMode,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'Supply of Matl. :',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: item.supplyOfMaterial,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'Special Instruction 1 :',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: item.specialInstruction1,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
    //             },
    //         ]
    //     ]

    //     const requirements = [
    //         [
    //             {
    //                 content: 'EMS Requirements :',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'black' }
    //             },
    //             {
    //                 content: 'OHSAS requirements :',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 10, textColor: 'black' }
    //             }
    //         ],
    //         [
    //             {
    //                 content: '* Reduce process scrap\n* Use recycled carton boxes for packing the components\n* Conserve usage of electrical energy\n* Ensure disposal of hazardous waste to authorised Agency\n* Conserve usage of oils and recycle the same to the extent possible',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', valign: 'top', }
    //             },
    //             {
    //                 content: '* All operators should wear relevant PPEs Like Safety shoe,Helmet, Goggles,Handgloves as applicable during working.\n* Ensure necessary material handling equipments/in your facilities\n* Monitor and Evaluate Near Miss Incidents.\n* Ensure Statutory Requirements.',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', valign: 'top', }
    //             }
    //         ]
    //     ]

    //     const para = [[{
    //         content: 'Please send the acknowledgement thru return mail for having accepted this purchase order. In case of no communication within 2days of the receipt of the mail, Purchase order shall be considered as accepted by you.',
    //         colSpan: 8,
    //         styles: { fontStyle: 'normal', fontSize: 9, }
    //     }]];

    //     const users = [[
    //         {
    //             content: `Prepared By / ${item.preparedBy}`,
    //             colSpan: 2,
    //             styles: { halign: 'center', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
    //         },
    //         {
    //             content: `Reviewed By / ${item.reviewedBy}`,
    //             colSpan: 3,
    //             styles: { halign: 'center', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
    //         },
    //         {
    //             content: `Approved By / ${item.approvedBy}`,
    //             colSpan: 3,
    //             styles: { halign: 'center', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
    //         }
    //     ]];

    //     const note = [[
    //         {
    //             content: 'Note',
    //             colSpan: 1,
    //             styles: { halign: 'left', fontSize: 9, textColor: 'red', fontStyle: 'bold' }
    //         },
    //         {
    //             content: 'This is computer generated document and is valid without signature',
    //             colSpan: 7,
    //             styles: { halign: 'left', fontSize: 9, textColor: 'blue', fontStyle: 'bold' }
    //         },
    //     ]];

    //     const outerTable = [
    //         [
    //             {
    //                 content: 'Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076',
    //                 colSpan: 8,
    //                 styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', lineWidth: 0 }
    //             },
    //         ],
    //         [
    //             {
    //                 content: 'FORMAT NO : IMS-ME-PUR-F-219-Rev-3 Dated 11-01-2019',
    //                 colSpan: 8,
    //                 styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', lineWidth: 0 }
    //             },
    //         ]
    //     ];

    //     const bodyRows = [...info, ...totalRow, ...totalWords, ...termsAndSuppluColumn, ...requirements, ...para, ...users, ...note]
    //     const footRows = [...outerTable]

    //     doc.autoTable({
    //         theme: 'striped',
    //         head: headerRows,
    //         body: bodyRows,
    //         foot: footRows,
    //         showHead: 'firstPage',
    //         showFoot: 'lastPage',
    //         ...tableOptions,
    //         headStyles: {
    //             fillColor: [255, 255, 255], // Header background color
    //             textColor: [0, 0, 0], // Header text color
    //             halign: 'center', // Header text alignment
    //             valign: 'middle', // Vertical alignment
    //             lineWidth: 0.1, // Border width
    //             lineColor: [0, 0, 0], // Border color,
    //             font: 'times',
    //         },
    //         bodyStyles: {
    //             fillColor: [255, 255, 255], // Header background color
    //             textColor: [0, 0, 0], // Header text color
    //             halign: 'center', // Header text alignment
    //             valign: 'middle', // Vertical alignment
    //             lineWidth: 0.1, // Border width
    //             lineColor: [0, 0, 0], // Border color
    //             fontStyle: 'normal',
    //             fontSize: 8,
    //             font: 'times',
    //         },
    //         footStyles: {
    //             fillColor: [255, 255, 255], // Header background color
    //             textColor: [0, 0, 0], // Header text color
    //             halign: 'center', // Header text alignment
    //             valign: 'middle', // Vertical alignment
    //             lineWidth: 0.1, // Border width
    //             lineColor: [0, 0, 0], // Border color
    //             font: 'times',
    //         },
    //     });

    //     // doc.save('PurchaseOrder.pdf');

    //     // Get the PDF as a base64 encoded string
    //     const base64String = doc.output('datauristring');

    //     // You can extract just the base64 part if needed
    //     // const base64Only = base64String.split(',')[1]; // Removing "data:application/pdf;base64,"

    //     console.log("Base64 PDF String:", base64String);

    //     UploadGeneratedPdf({ digit: selectedPoDigit, file: base64String }, handleUploadSuccess, handleUploadException)

    //     // return base64Only; // Or you can send it somewhere, etc.
    // }

    const handleUploadSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setTimeout(() => {
            handleClose();
        }, 2000);
    }
    const handleUploadException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            {/* <StoresItemMasterTitle
                setIsAddButton={setIsAddButton}
                setEditeData={setEditeData}
                setOpen={setOpen}
            /> */}

            <Grid container>
                <Grid item marginLeft={1.5} marginBottom={1.5}>
                    <Typography
                        sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                        variant="h5"
                    >
                        {/* {
                            !onPriceChan ? 'Authorise Documents' : 'Authorise : Price Change Note'
                        } */}
                        {handlePageHeaderLabel(header1)}
                    </Typography>
                </Grid>
            </Grid>

            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '-10px', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent>
                        {
                            !onPriceChan ? (
                                <DataGrid
                                    rows={dataSet}
                                    columns={columns}
                                    pageSize={8}
                                    // loading={isLoading}
                                    // onRowClick={onClikRowData}
                                    onCellClick={handleCellClick}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none', fontWeight: 'bold', overflowY: 'scroll' }}
                                    sx={{
                                        overflow: 'auto',
                                        height: screenHeight - 260,
                                        cursor: 'pointer',
                                        // minHeight: '500px',
                                        '& .super-app-theme--header': {
                                            WebkitTextStrokeWidth: '0.6px',
                                            backgroundColor: '#93bce6',
                                            color: '#1c1919'
                                        },
                                    }}
                                    getRowClassName={(params) => {
                                        // Find the index of the row within the rows array
                                        const rowIndex = storeItemMasterList.findIndex(row => row.id === params.row.id);
                                        // Check if the index is valid
                                        if (rowIndex !== -1) {
                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }
                                        return ''; // Return default class if index is not found
                                    }}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                />
                            ) : (
                                <>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <DataGrid
                                                rows={priceDataSet}
                                                columns={columns2}
                                                pageSize={8}
                                                // loading={isLoading}
                                                // onRowClick={onClikRowData}
                                                onRowDoubleClick={(params, event) => handleRowDoubleClick(params)}
                                                // onRowDoubleClick={(params, event) => {
                                                //     // Handle double click event here
                                                //     // navigate(`/PurchaseOrderGenerationModule?isView=true&&poDigit=${props.selectedRow.digit}&&rowId=${props.selectedRow.id}`);
                                                //     navigate(`/PurchaseOrderGenerationModule?isAuthoriseDocument=true&&poDigit=${params.row.digit}`);
                                                //     console.log('Double clicked row data:', params.row);
                                                //     // You can perform any action you want on double click, like opening a dialog, etc.
                                                // }}
                                                rowsPerPageOptions={[8]}
                                                disableSelectionOnClick
                                                style={{ border: 'none', fontWeight: 'bold', overflowY: 'scroll' }}
                                                sx={{
                                                    overflow: 'auto',
                                                    height: screenHeight - 350,
                                                    cursor: 'pointer',
                                                    // minHeight: '500px',
                                                    '& .super-app-theme--header': {
                                                        WebkitTextStrokeWidth: '0.6px',
                                                        backgroundColor: '#93bce6',
                                                        color: '#1c1919'
                                                    },
                                                }}
                                                getRowClassName={(params) => {
                                                    // Find the index of the row within the rows array
                                                    const rowIndex = storeItemMasterList.findIndex(row => row.id === params.row.id);
                                                    // Check if the index is valid
                                                    if (rowIndex !== -1) {
                                                        return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                                    }
                                                    return ''; // Return default class if index is not found
                                                }}
                                                rowHeight={40}
                                                columnHeaderHeight={40}
                                            />

                                        </Grid>
                                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                style={{ width: '150px', background: isModuleLocked ? 'gray' : '#002D68', color: 'white', margin: '20px' }}
                                                disabled={loading === true || isModuleLocked}
                                                onClick={(e) => {
                                                    setLoading(true);
                                                    DocsData({
                                                        docType: header1,
                                                        refNos: arrayList,
                                                        authLevel: selectedLevel
                                                    }, handleDocsDataSUccess, handleDocsDataException);
                                                }}
                                            >
                                                {/* Authorise */}
                                                {loading ? (
                                                    <CircularProgress size={24} style={{ color: 'white' }} />
                                                ) : "Authorise"}
                                            </Button>
                                            <Button
                                                variant="contained"
                                                style={{ width: '150px', background: '#002D68', color: 'white', margin: '20px' }}
                                                onClick={(e) => {
                                                    setOnPriceChan(false);
                                                    setHearder1('')
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </Grid>

                                    </Grid>
                                </>
                            )

                        }
                    </CardContent>
                </Card>

            </div>

            {/* <StoresItemMasterModule
                isAddButton={isAddButton}
                editeData={editeData}
                open={open}
                setOpen={setOpen}
                setRefreshData={setRefreshData}
            /> */}
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                // selectedMaster={selectedMaster}
                deleteService={StoreItemDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />

        </div>
    )
}

export default AuthoriseDocumentsModule