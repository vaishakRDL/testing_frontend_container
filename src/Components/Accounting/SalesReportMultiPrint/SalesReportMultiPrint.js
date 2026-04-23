import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getGstAllSaleInvoiceList, getGstSaleInvoiceData, getGstSaleInvoiceList, getGstSaleInvoicePayload, GSTSalesShowData, MultiXmlPrint, StoreGstSaleInvoiceResponse, updatePrintedInvoiceStatus } from '../../../ApiService/LoginPageService';
import { Button, Card, CardActions, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, ListItemText, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select, TextField, Tooltip, Typography } from '@mui/material';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import NoQr from '../../../AllImage/NoQR.png'
import { Link, useNavigate } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const SalesReportMultiPrint = () => {
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [selectedFilterRadio, setSelectedFilterRadio] = useState('');
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [successResponses, setSuccessResponses] = useState([]); // API SUCCESS SHOWS
    console.log("successResponses", successResponses)
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [pendingOnly, setPendingOnly] = useState(false);
    const [rows, setRows] = useState([]);
    const [payloadData, setPayloadData] = useState([]);
    const [apiStatus, setApiStatus] = useState(null);
    const [fromDate, setFromDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [toDate, setTodate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [invoiceHeader, setInvoiceHeader] = useState([])
    const [printingDoc, setPrintingDoc] = useState(false);
    const [docRange, setDocRnage] = useState(false);
    const [docRangeFrom, setDocRangeFrom] = useState('');
    const [docRangeTo, setDocRangeTo] = useState('');
    const [selectionRowIds, setSelectionRowIds] = useState([])
    const [pdfUrl, setPdfUrl] = useState([]);
    const [pdfModalOpen, setPdfModalOpen] = useState(false)
    const [pdfBlobs, setPdfBlobs] = useState([]);
    const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
    const [invoiceFromateChanger, setInvoiceFromateChanger] = useState(false);

    const columns = [
        {
            field: 'invNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Inv No
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'custPoNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Cust PO No
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'invDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Inv Date
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'invValue',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Inv Value
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'custCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Cust Code
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'AckNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    ACK NO
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'AckDt',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    ACK Date
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'Irn',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    IRN No
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'EwbNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    EWB No
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'EwbDt',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    EWB Date
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'EwbStatus',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    EWB Status
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'printedStatus',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Is Print
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        }
    ];

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

    const handleGstListSuccess = (dataObject) => {
        setRows(dataObject?.data || [])
    }
    const handleGstInvoiceException = () => { }

    const handleRowSelection = (selectionModel) => {
        setSelectionRowIds(selectionModel);
        // Find the selected rows based on IDs
        const selectedData = rows.filter(row => selectionModel.includes(row.id));
        setSelectedRows(selectedData);
        // GET PAYLOAD DATA ON CHECKBOX SELECTION
        getGstSaleInvoiceData({ invoiceIds: selectionModel }, handleGetPayloadSuccess, handleGetPayloadException)
    };

    const handleGetPayloadSuccess = (dataObject) => {
        setPayloadData(dataObject?.data || []);
    }
    const handleGetPayloadException = () => {
        setPayloadData([]);
    }


    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };


    const handleView = () => {
        getGstAllSaleInvoiceList({
            from: fromDate,
            to: toDate,
            rangeFrom: docRangeFrom,
            rangeTo: docRangeTo,
            printedDoc: printingDoc
        }, handleGstListSuccess, handleGstInvoiceException)
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setInvoiceHeader(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const names = [
        // 'ORIGINAL FOR RECIPIENT',
        // 'DUPLICATE FOR TRANSPORT',
        // 'TRIPLICATE FOR SUPPLIER',
        // 'EXTRA COPY'
        'ORIGINAL FOR RECIPIENT',
        'DUPLICATE FOR TRANSPORTER(GOODS)/SUPPLIER(SERVICES)',
        'TRIPLICATE FOR SUPPLIER(GOODS)/EXTRA COPY(SERVICES)',
        'EXTRA COPY'
    ];


    const handleMultilpleInvoicePrint = async () => {
        updatePrintedInvoiceStatus({ invoiceIds: selectionRowIds }, handlePrintedInvoiceSuccess, handlePrintedInvoiceException);
        const allBlobs = [];
        for (const invoiceData of payloadData) {
            for (const headerName of invoiceHeader) {
                const blob = await handleFileSave(invoiceData, headerName);
                allBlobs.push(blob);
            }
        }
        // Set all at once after loop completes
        setPdfBlobs(allBlobs);
    };

    // ON E-INVOICE BUTTON CLICK
    const handleMultilpleEInvoicePrint = async () => {
        updatePrintedInvoiceStatus({ invoiceIds: selectionRowIds }, handlePrintedInvoiceSuccess, handlePrintedInvoiceException)
        const allBlobs = [];
        for (const invoiceData of payloadData) {
            for (const headerName of invoiceHeader) {
                const blob = await handleFileSave(invoiceData, headerName);
                allBlobs.push(blob);
            }
        }
        // Set all at once after loop completes
        setPdfBlobs(allBlobs);


    };

    // NEW: Download each selected invoice as a separate PDF file
    const sanitizeFileName = (name) => (name || '')
        .toString()
        .replace(/[^a-z0-9-_\.]+/gi, '_')
        .substring(0, 150);

    // const handleMultiInvoiceSeparateDownload = async () => {
    //     if (!payloadData?.length || !invoiceHeader?.length) return;
    //     // Mark as printed same as other flows
    //     updatePrintedInvoiceStatus({ invoiceIds: selectionRowIds }, handlePrintedInvoiceSuccess, handlePrintedInvoiceException);

    //     // One output file per selected invoice; inside it, append one copy per selected header
    //     for (const invoiceData of payloadData) {
    //         // Generate a PDF for each selected header
    //         const headerBlobs = [];
    //         for (const headerName of invoiceHeader) {
    //             const blob = await handleFileSave(invoiceData, headerName);
    //             headerBlobs.push(blob);
    //         }

    //         // Merge them into a single PDF using pdf-lib
    //         const merged = await PDFDocument.create();
    //         for (const blob of headerBlobs) {
    //             const srcBytes = await blob.arrayBuffer();
    //             const srcDoc = await PDFDocument.load(srcBytes);
    //             const pages = await merged.copyPages(srcDoc, srcDoc.getPageIndices());
    //             pages.forEach(p => merged.addPage(p));
    //         }
    //         const mergedBytes = await merged.save();
    //         const mergedBlob = new Blob([mergedBytes], { type: 'application/pdf' });

    //         const url = URL.createObjectURL(mergedBlob);
    //         const file = `${sanitizeFileName(invoiceData?.invoice?.invNo)}.pdf`;
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = file;
    //         document.body.appendChild(a);
    //         a.click();
    //         a.remove();
    //         setTimeout(() => URL.revokeObjectURL(url), 1000);
    //     }
    // };
    const handleMultiInvoiceSeparateDownload = async () => {
        if (!payloadData?.length || !invoiceHeader?.length) return;

        updatePrintedInvoiceStatus({ invoiceIds: selectionRowIds }, handlePrintedInvoiceSuccess, handlePrintedInvoiceException);

        for (const invoiceData of payloadData) {
            const headerBlobs = [];

            for (const headerName of invoiceHeader) {
                const blob = await handleFileSave(invoiceData, headerName);
                headerBlobs.push(blob);
            }

            const merged = await PDFDocument.create();

            for (const blob of headerBlobs) {
                const srcBytes = await blob.arrayBuffer();
                const srcDoc = await PDFDocument.load(srcBytes);
                const pages = await merged.copyPages(srcDoc, srcDoc.getPageIndices());
                pages.forEach(p => merged.addPage(p));
            }

            const mergedBytes = await merged.save();
            const mergedBlob = new Blob([mergedBytes], { type: 'application/pdf' });

            const url = URL.createObjectURL(mergedBlob);
            const file = `${sanitizeFileName(invoiceData?.invoice?.invNo)}.pdf`;
            const a = document.createElement('a');
            a.href = url;
            a.download = file;
            document.body.appendChild(a);
            a.click();
            a.remove();

            // *** NEW DELAY ***
            await new Promise(r => setTimeout(r, 400));

            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
    };

    const handlePrintedInvoiceSuccess = () => { }
    const handlePrintedInvoiceException = () => { }

    const baseUrl = process.env.REACT_APP_API_URL;
    const urlParts = baseUrl.split('api/');


    function emptyRowsToPush(lineItems) {
        const pageSize = 39;   // Max rows per page (depends on layout)
        const header = 10;     // Rows occupied by header
        const footer = 19;     // Rows reserved for footer

        // Total rows including header and footer
        const totalContent = header + lineItems + footer;

        // Total pages required
        const totalPages = Math.ceil(totalContent / pageSize);

        // Capacity available in all pages
        const totalCapacity = pageSize * totalPages;

        // Dummy rows required to perfectly fill the last page
        let rowsToPush = totalCapacity - totalContent;

        // ✅ Keep at least 0 dummy rows unless it's too small
        // if (rowsToPush < 0) rowsToPush = 0;

        // return rowsToPush;
        if (rowsToPush < 0) {
            rowsToPush = 0;
        } else if (rowsToPush > 0) {
            rowsToPush -= 1;  // <-- prevent accidental overflow
        }

        return rowsToPush;
    }

    // GENERATE INVOICE
    const handleFileSave = async (data, headerName) => {
        let info = [];
        data.items.forEach((element, index, array) => {
            data.invoice.allPoSame === true ?
                info.push([index + 1, `${element.partNo}`, `${element.partName}`, element.hsnCode, element.descOfPackage, element.invQty, element.uom, element.invRate, element.invAmt])
                :
                info.push([index + 1, `${element.partNo}\nPO No: ${element.poNo}`, `${element.partName}\nPO Date: ${element.poDate}`, element.hsnCode, element.descOfPackage, element.invQty, element.uom, element.invRate, element.invAmt]);
        });


        const paddingNeeded = emptyRowsToPush(info.length);
        for (let i = 0; i < paddingNeeded; i++) {
            const emptyRow = [
                { content: " ", styles: { textColor: "black", fillColor: null } },
                { content: " ", styles: { textColor: "black", fillColor: null } },
                { content: " ", styles: { textColor: "black", fillColor: null } },
                { content: " ", styles: { textColor: "black", fillColor: null } },
                { content: " ", styles: { textColor: "black", fillColor: null } },
                { content: " ", styles: { textColor: "black", fillColor: null } },
                { content: " ", styles: { textColor: "black", fillColor: null } },
                { content: " ", styles: { textColor: "black", fillColor: null } },
                { content: " ", styles: { textColor: "black", fillColor: null } },];
            info.push(emptyRow);
        }


        const doc = new jsPDF();
        const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
        // console.log("baseUrl------------------>>>>>>>>>>>>>>", baseUrl);
        // const logoUrl = (await import('../../AllImage/RDL_Logo.png')).default;
        const logoUrl = `${baseUrl}/${data.invoice.companyImage}`
        const ISOUrl = require('../../../AllImage/Picture.png');
        // const phoneOUrl = require('../../../AllImage/phone.png');
        // const mailUrl = require('../../../AllImage/mail.png');
        // const webUrl = require('../../../AllImage/web.png');
        const qrCodeUrl = data?.invoice?.SignedQrCodeImgUrl ? `${urlParts[0]}${data?.invoice?.SignedQrCodeImgUrl}` : NoQr;

        const totalPagesExp = "{totalPages}"; // <-- Add this
        const tableOptions = {
            didDrawPage: (HookData) => {
                if (HookData.pageNumber === 1) {
                    // Add an image on the first page L,Top/bottom, width,height
                    doc.addImage(logoUrl, 'PNG', 10.5, 21, 28, 20);
                    doc.addImage(ISOUrl, 'PNG', 164, 16, 35, 15);

                    if (qrCodeUrl) {
                        doc.addImage(qrCodeUrl, 'PNG', 128.5, 16.4, 30, 30);
                    }
                }
                doc.setFontSize(9);
                doc.setTextColor('black');

                if (HookData.pageNumber > 1) {
                    doc.setFontSize(9);
                    doc.setTextColor('black');
                    doc.text(
                        `Invoice No : ${data.invoice.invNo}     |     Date : ${data.invoice.date}`,
                        14,
                        10
                    );
                }
                // PAGE NUMBER 
                const pageSize = doc.internal.pageSize;
                const pageWidth = pageSize.width || pageSize.getWidth();
                const pageHeight = pageSize.height || pageSize.getHeight();

                doc.setFontSize(8);
                doc.setTextColor(70);

                // Left-aligned footer text
                doc.text(
                    `Regd. & Corporate Office: No.380A, 5th Main, Bilekahalli, Vijaya Bank Layout, Off. Bannergatta Road, Bangalore 560 076`,
                    14, // X position (left margin)
                    pageHeight - 10
                );

                // Right-aligned page number
                doc.text(
                    `Page ${HookData.pageNumber} of ${totalPagesExp}`,
                    pageWidth - 1, // X position (right margin)
                    pageHeight - 10,
                    { align: 'right' } // Align text to the right
                );
            },
        };

        const noBackgroundColorStyle = { fillColor: null };

        doc.setFontSize(8);
        doc.setTextColor('black');
        doc.text(headerName, 200, 6, { align: 'right' }); // Adjust X and Y coordinates as needed

        const logoAndAddress = [
            [
                {
                    content: `                              `,
                    styles: { halign: 'left', fontSize: 7.6, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${data.invoice.companyName}\n${data.invoice.companyAdd}. Tel:${data.invoice.telNo}\nWeb Site :${data.invoice.website}\nEmail : ${data.invoice.email}`,
                    styles: { halign: 'left', fontSize: 7.6, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `                                     \n\n\n\n\n\n\n\n`,
                    styles: { lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `\n\n\n\n\nISO 9001 : 2015\nISO 14001 : 2015\nOHSAS 18001 : 2007`,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', /*valign: 'top',*/ lineWidth: 0.1, lineColor: '#000000' }
                }
            ]
        ];

        //Header2
        const pan = invoiceFromateChanger === false ?
            [
                [
                    {
                        content: `CIN No   : ${data.invoice.cmpCinNo}`,
                        colSpan: 1,
                        styles: { halign: 'center', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                    },
                    {
                        content: `PAN No  : ${data.invoice.cmpPanNo}`,
                        colSpan: 1,
                        styles: { halign: 'center', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                    },
                    {
                        content: `GSTINO : ${data.invoice.cmpGstNo}`,
                        colSpan: 1,
                        styles: { halign: 'center', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                    },
                    {
                        content: `${data.invoice.invNo}`,
                        colSpan: 1,
                        styles: { halign: 'center', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                    }
                ],
                [
                    {
                        content: data.invoice.labourCharge === 'Y' ? 'LABOUR CHARGES TAX INVOICE' : 'TAX INVOICE',
                        colSpan: 8,
                        styles: { halign: 'center', fontSize: 10, textColor: '#ffffff', fontStyle: 'bold', fontWeight: 'bold', fillColor: '#4D55CC', lineWidth: 0 }
                    },
                ],
            ]
            :
            [
                [
                    {
                        content: data.invoice.labourCharge === 'Y' ? 'LABOUR CHARGES TAX INVOICE' : 'TAX INVOICE',
                        colSpan: 8,
                        styles: { halign: 'center', fontSize: 10, textColor: '#ffffff', fontStyle: 'bold', fontWeight: 'bold', fillColor: '#4D55CC', lineWidth: 0 }
                    },
                ],
            ]


        const address = [

            [
                {
                    content: "Dispatch From:", colSpan: 4, styles: {
                        cellPadding: { top: 0.5, bottom: 0.5, left: 1, right: 1 },
                        textColor: 'black',

                        fontStyle: 'bold', fontSize: 8
                    }
                },
                {
                    content: "", colSpan: 4, styles: {
                        cellPadding: { top: 0.5, bottom: 0, left: 1, right: 1 },
                        textColor: 'black',

                        fontStyle: 'bold', fontSize: 8
                    }
                }
            ],
            [
                {
                    content: `${data.invoice?.dispatchName}`,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: -1, bottom: 0, left: 1, right: 1 },
                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold',
                    }
                },
                {
                    content: ``,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: -1, bottom: 0, left: 1, right: 1 },
                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold',
                    }
                },
            ],
            [
                {
                    content: `${data.invoice.dispatchFromAdd || ''}`,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: 0.5, bottom: 0, left: 1, right: 1 },


                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal',
                    }
                },
                {
                    content: `IRN:${data?.invoice?.Irn || ''}\nACK NO:${data?.invoice?.AckNo || ''}\nACK Date:${data?.invoice?.AckDt || ''}`,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: 0, bottom: 0, left: 1, right: 1 },

                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal',
                    }
                }
            ],
            [
                {
                    content: `EwayBill No: ${data?.invoice?.EwbNo || ''}`,
                    colSpan: 4,
                    styles: {
                        halign: 'left',
                        valign: 'top',
                        fontSize: 8,
                        textColor: 'black',
                        fontStyle: 'bold',
                        lineWidth: 0.1,
                        lineColor: '#000000'
                    }
                },
                {
                    content: `EwayBill Date: ${data?.invoice?.EwbDt || ''}`,
                    colSpan: 4,
                    styles: {
                        halign: 'left',
                        valign: 'top',
                        fontSize: 8,
                        textColor: 'black',
                        fontStyle: 'bold',
                        lineWidth: 0.1,
                        lineColor: '#000000'
                    }
                }
            ],

            // [
            //     {
            //         content: "Bill To:", colSpan: 4,
            //         styles: {
            //             cellPadding: { top: 0.5, bottom: -0.25, left: 1, right: 1 },

            //             halign: 'left', valign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'bold',
            //         }
            //     },
            //     {
            //         content: "Ship To:", colSpan: 4,
            //         styles: {
            //             cellPadding: { top: 0.5, bottom: 0, left: 1, right: 1 },
            //             halign: 'left', valign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'bold',
            //         }
            //     }
            // ],
            [
                {
                    content: "Bill To:", colSpan: 4,
                    styles: {
                        cellPadding: { top: 0.5, bottom: 0.25, left: 1, right: 1 },

                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold',
                    }
                },
                {
                    content: "Ship To:", colSpan: 4,
                    styles: {
                        cellPadding: { top: 0.5, bottom: 0.25, left: 1, right: 1 },
                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold',
                    }
                }
            ],
            // Row: Customer names only (bold)
            [
                {
                    content: `${data.invoice.cName}`,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: 1, bottom: 0, left: 1, right: 1 },
                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold',
                    }
                },
                {
                    content: `${data.invoice.cName}`,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: 1, bottom: 0, left: 1, right: 1 },
                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold',
                    }
                }
            ],
            // [
            //     {
            //         content:
            //             `\n${data.invoice.cName || ''}\n${data.invoice.billAdd || ''}\nGST No: ${data.invoice.gstNo || ''}\nPAN No: ${data.invoice.panNo || ''}`,
            //         colSpan: 4,
            //         styles: {
            //             cellPadding: { top: 0, bottom: 0.5, left: 1, right: 1 },

            //             halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal',
            //         }
            //     },
            //     {
            //         content:
            //             `\n${data.invoice.cName || ''}\n${data.invoice.shipAdd || ''}\nGST No: ${data.invoice.gstNo || ''}\nPAN No: ${data.invoice.panNo || ''}`,
            //         colSpan: 4,
            //         styles: {
            //             cellPadding: { top: 0, bottom: 0.5, left: 1, right: 1 },

            //             halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal',
            //         }
            //     }
            // ],
            [
                {
                    content:
                        `${data.invoice.billAdd}\nPAN No: ${data.invoice.panNo}\nGST No: ${data.invoice.gstNo}`,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: 0, bottom: 0.5, left: 1, right: 1 },
                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal',
                    }
                },
                {
                    content:
                        `${data.invoice.shipAdd}\nPAN No: ${data.invoice.panNo}\nGST No: ${data.invoice.gstNo}`,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: 0, bottom: 0.5, left: 1, right: 1 },
                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal',
                    }
                }
            ],
            [
                {
                    content: `Place of Supply & State : ${data.invoice.city || ''} ${data.invoice.state || ''}`,
                    colSpan: 4,
                    styles: {
                        halign: 'left',
                        valign: 'top',
                        fontSize: 8,
                        textColor: 'black',
                        fontStyle: 'bold',
                        lineWidth: 0.1,
                        lineColor: '#000000'
                    }
                },
                {
                    content: `State Code : ${data.invoice.stateCode || ''}`,
                    colSpan: 4,
                    styles: {
                        halign: 'left',
                        valign: 'top',
                        fontSize: 8,
                        textColor: 'black',
                        fontStyle: 'bold',
                        lineWidth: 0.1,
                        lineColor: '#000000'
                    }
                }
            ]
        ];

        //Header4
        const firstHeaderRow = [
            [
                {
                    content: `INVOICE NO: ${data.invoice.invNo}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                data.invoice.allPoSame === true ?
                    {
                        content: `PO No: ${data.invoice.poNo}`,
                        colSpan: 2,
                        styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                    }
                    :
                    {
                        content: `PO No: `,
                        colSpan: 2,
                        styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                    },
                {
                    content: `DC NO : ${data.invoice.customerDcNo}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `Terms of Payment : 30 Days`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
            ],
            [
                {
                    content: `Date: ${data.invoice.date}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                data.invoice.allPoSame === true ?
                    {
                        content: `PO Date: ${data.invoice.poDate}`,
                        colSpan: 2,
                        styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                    }
                    :
                    {
                        content: `PO Date: `,
                        colSpan: 2,
                        styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                    },
                {
                    content: `Dc Date: ${data.invoice.customerDcDate}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `Vehicle No: ${data.invoice.vechileNO}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
            ],
        ];
        const items = [
            ...info,

            [
                { content: `Whether tax payable of reverse charge basis: NO`, colSpan: 5, styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `Total Qty`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold', }
                },
                {
                    content: `${data.invoice.totalQty}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold', }
                },
            ],
            [
                { content: `Name of Commodities: ${data.invoice.itemLedger}`, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `Taxable value for GST`,
                    colSpan: 2,
                    styles: {
                        halign: 'left',
                        textColor: 'black',
                        fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000'
                    }
                },
                {
                    content: `${data.invoice.taxableValueforGST}`,
                    colSpan: 2,
                    styles: {
                        halign: 'right',
                        textColor: 'black',
                        fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000'
                    }
                },
            ],

            ...(parseFloat(data.invoice.IGST) > 0 ? [[
                { content: `Mode of Dispatch: ${data.invoice.modelOfDis}`, colSpan: 5, styles: { halign: 'left', fontSize: 8, lineWidth: 0.1, lineColor: '#000000' } },
                {
                    content: `IGST @ ${data.invoice.IGSTPer} %`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${Number(data.invoice.IGST || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]] : []),

            // ✅ Show CGST row only if CGST > 0
            ...(parseFloat(data.invoice.CGST) > 0 ? [[
                { content: `Mode of Dispatch: ${data.invoice.modelOfDis}`, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `CGST @ ${data.invoice.CGSTPer} %`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${Number(data.invoice.CGST || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]] : []),

            // ✅ Show SGST row only if SGST > 0
            ...(parseFloat(data.invoice.SGST) > 0 ? [[
                { content: `DC Details: ${data.invoice.dcDetails || ''}`, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `SGST @ ${data.invoice.SGSTPer} %`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${Number(data.invoice.SGST || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]] : []),
            ...(parseFloat(data.invoice.UTGSTPer) > 0 ? [[
                { content: ``, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `UGST @ ${data.invoice.UTGSTPer} %`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${Number(data.invoice.UTGST || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]] : []),
            ...(Number(data.invoice.tcs || 0) > 0
                ? [[
                    { content: `DC Details: ${data.invoice.dcDetails || ''}`, colSpan: 5, styles: { halign: 'left' } },
                    { content: `TCS @ ${data.invoice.tcsPer}%`, colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
                    { content: `${Number(data.invoice.tcs).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8 } }
                ]]
                : []),

            // ✅ Subcharges TCS row
            ...(Number(data.invoice.subChargeOnTcs || 0) > 0
                ? [[
                    { content: ``, colSpan: 5, styles: { halign: 'left' } },
                    { content: `Subcharges TCS @ ${data.invoice.subChargeOnTcsPer}%`, colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
                    { content: `${Number(data.invoice.subChargeOnTcs).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8 } }
                ]]
                : []),

            // ✅ Cess on TCS row
            ...(Number(data.invoice.cessOnTcs || 0) > 0
                ? [[
                    { content: ``, colSpan: 5, styles: { halign: 'left' } },
                    { content: `Cess TCS @ ${data.invoice.cessOnTcsPer}%`, colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
                    { content: `${Number(data.invoice.cessOnTcs).toLocaleString('en-IN')}`, colSpan: 2, styles: { halign: 'right', fontSize: 8 } }
                ]]
                : []),
            [
                { content: `Remarks: ${data.invoice.remarks || ""}`, colSpan: 5, rowSpan: 2, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `Total Value`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${data.invoice.totalValue}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
            ],
            [
                // { content: ' ', colSpan: 5, styles: { halign: 'left', fontStyle: 'italic' } },
                {
                    content: `Round Off`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${data.invoice.roundOff}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
            ],
            [
                {
                    content: `Grand Total In Words: Rupees ${data.invoice.totalInWords} Only`,
                    colSpan: 5,
                    styles: {
                        halign: 'left',
                        textColor: 'black',
                        fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000'
                    }
                },

                {
                    content: `Grand Total`,
                    colSpan: 2,
                    styles: {
                        halign: 'left',
                        textColor: 'black',
                        fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000'
                    }
                },
                {
                    content: `${data.invoice.invValue}`,
                    colSpan: 2,
                    styles: {
                        halign: 'right',
                        textColor: 'black',
                        fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000'
                    }
                }
            ],
        ];


        const lastDetails = [
            // Row 1: Certification & Company Name
            [
                {
                    content:
                        'Certified that the particulars given above are true and correct and the amount indicated represents the price actually charged and that there is no flow of additional consideration directly or indirectly from the buyer',
                    colSpan: 4,
                    styles: {
                        halign: 'left',
                        fontSize: 8,
                        textColor: 'black',
                        cellPadding: 1,
                        lineWidth: 0,
                    }
                },
                {
                    content: 'For RDL Technologies Pvt Ltd.',
                    colSpan: 4,
                    styles: {
                        halign: 'left',
                        fontSize: 8,
                        fontStyle: 'bold', // Bold company name
                        textColor: 'black',
                        cellPadding: 1,
                        lineWidth: 0,
                    }
                }
            ],

            // Row 2: Conditional E-Invoice message (only if invoiceGen === 1)
            ...(data.invoice.invoiceGen === 1
                ? [
                    [
                        { content: '', colSpan: 4, styles: { lineWidth: 0 } },
                        {
                            content: 'E-Invoice generated with QR Code & IRN number,\nNo signature required',
                            colSpan: 4,
                            styles: {
                                halign: 'left',
                                fontSize: 8,
                                textColor: 'black',
                                cellPadding: 1,
                                lineWidth: 0,
                            }
                        }
                    ]
                ]
                : []),

            // Row 3: Authorised Signatory
            [
                { content: '', colSpan: 4, styles: { lineWidth: 0 } },
                {
                    content: 'Authorised Signatory',
                    colSpan: 4,
                    styles: {
                        halign: 'left',
                        fontSize: 8,
                        fontStyle: 'bold', // Bold this label
                        textColor: 'black',
                        cellPadding: 1,
                        lineWidth: 0,
                    }
                }
            ],

            // Row 4: E.&.O.E & Signature
            [
                {
                    content: 'E.&.O.E.' + ' '.repeat(55) + 'Subject to Bengaluru Jurisdiction',
                    colSpan: 4,
                    styles: {
                        lineWidth: 0,
                        textColor: 'black',
                    }
                },
                {
                    content: 'Signature of the Licences or his Authorised Agent',
                    colSpan: 4,
                    styles: {
                        halign: 'left',
                        fontSize: 8,
                        textColor: 'black',
                        cellPadding: 1,
                        lineWidth: 0,
                    }
                }
            ]
        ];
        //Auto Table
        doc.autoTable({
            head: logoAndAddress,
            tableLineColor: [0, 0, 0],
            bodyStyles: { minCellHeight: 5, cellPadding: 1 },
            // tableLineWidth: 0.25,
            theme: 'grid',
            styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
            startY: 15,

            lineWidth: 0.1,
            // ...tableOptions,
            margin: { left: 10, right: 10 }
        });


        doc.autoTable({
            head: pan,
            tableLineColor: [0, 0, 0],
            bodyStyles: { minCellHeight: 5, cellPadding: 1 },
            tableLineWidth: 0.25,
            theme: 'grid',
            styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
            startY: doc.lastAutoTable.finalY,
            margin: { left: 10, right: 10 }
        });

        doc.autoTable({
            head: address,
            tableLineColor: [0, 0, 0],
            bodyStyles: { minCellHeight: 2, cellPadding: 0 },
            tableLineWidth: 0.25,
            theme: 'grid',
            styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
            startY: doc.lastAutoTable.finalY,
            margin: { left: 10, right: 10 },
            didDrawCell: function (data) {
                const doc = data.doc;
                const { column, cell } = data;
                const { x, y, width, height } = cell;

                // ✅ Only draw line at the center (after left block)
                if (column.index === 0) {
                    const middleX = x + width; // right edge of left half
                    doc.setDrawColor(0); // black
                    doc.setLineWidth(0.3); // light line
                    doc.line(middleX, y, middleX, y + height); // vertical separator
                }
            }
        });

        doc.autoTable({
            head: firstHeaderRow,
            tableLineColor: [0, 0, 0],
            bodyStyles: { minCellHeight: 5, cellPadding: 1 },
            tableLineWidth: 0.25,
            theme: 'grid',
            styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
            startY: doc.lastAutoTable.finalY,
            margin: { left: 10, right: 10 }
        });


        const headRow = [
            'SI No',
            'Part No',
            'Part Description',
            'HSN/SAC\nCode',
            'No.&Desc\nof Pckgs',
            'Quantity',
            'UOM',
            'Rate / Unit',
            'Amount'
        ];

        doc.autoTable({
            head: [headRow],   // ✅ header row (will auto-repeat on new pages)
            body: items,       // ✅ only rows from info and totals
            tableLineColor: [0, 0, 0],
            ...tableOptions,
            bodyStyles: {
                minCellHeight: 5,
                cellPadding: 1,
                textColor: 'black',
                fillColor: null, // No background color
                lineWidth: 0.25,
                lineColor: 'black',
                halign: "center",
                valign: "middle",

            },
            tableLineWidth: 0.25,
            theme: 'grid',
            styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
            startY: doc.lastAutoTable?.finalY || 40,
            margin: { left: 10, right: 10 },
            headStyles: {
                fillColor: [255, 255, 255], lineWidth: 0.1, lineColor: '#000000',   // ✅ make sure border is drawn
                textColor: 'black', fontStyle: 'bold'
            },
            // ✅ Alignment logic
            didParseCell: function (data) {
                if (data.section === 'head') {
                    data.cell.styles.fontStyle = 'bold';
                    return;
                }

                // 🚨 Skip alignment for summary rows (GST, Total, Remarks, etc.)
                if (data.cell.colSpan > 1) {
                    return;
                }
                const rightAlignColumns = [7, 8];  // Rate, Amount
                const centerAlignColumns = [4, 5, 6];    // Quantity
                const leftAlignColumns = [1, 2];

                if (data.section === 'body' && leftAlignColumns.includes(data.column.index)) {
                    data.cell.styles.halign = 'left';
                }
                if (data.section === 'body' && rightAlignColumns.includes(data.column.index)) {
                    data.cell.styles.halign = 'right';
                }
                if (data.section === 'body' && centerAlignColumns.includes(data.column.index)) {
                    data.cell.styles.halign = 'center';
                }
            }
        });


        doc.autoTable({
            body: lastDetails,
            theme: 'grid', // required for proper layout
            styles: {
                font: 'times',
                fontSize: 8
            },
            bodyStyles: {
                minCellHeight: 5,
                cellPadding: 1
            },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.25,
            margin: { left: 10, right: 10 },
            startY: doc.lastAutoTable.finalY,

            // Custom drawing of borders and vertical line
            didDrawCell: function (data) {
                const doc = data.doc;
                const { cell, column } = data;
                const { x, y, width, height } = cell;

                // 🟢 Draw custom vertical center line ONLY for left column group
                if (column.index === 0) {
                    const centerX = x + width; // right edge of left cell
                    doc.setDrawColor(0); // black
                    doc.setLineWidth(0.5); // slightly bold line
                    doc.line(centerX, y, centerX, y + height); // vertical line
                }

                // 🔴 Hide default autoTable borders
                doc.setDrawColor(255); // white = invisible
                doc.setLineWidth(0.25);

                // Top
                doc.line(x, y, x + width, y);
                // Bottom
                doc.line(x, y + height, x + width, y + height);
                // Right
                doc.line(x + width, y, x + width, y + height);

                // Reset styles for next cells
                doc.setDrawColor(0);
                doc.setLineWidth(0.25);
            }
        });



        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp); // This replaces "{totalPages}" in all pages
        }

        const pdfBlob = doc.output('blob');
        return pdfBlob; // ✅ Return the blob instead of setting state
    };

    // GENERATING EINVOICE
    const handleGenerateEinvoice = async (data, headerName) => {
        let info = [];
        console.log("data", data);
        data.items.forEach((element, index, array) => {
            data.invoice.allPoSame === true ?
                info.push([index + 1, `${element.partNo}`, `${element.partName}`, element.hsnCode, element.descOfPackage, element.invQty, element.uom, element.invRate, element.invAmt])
                :
                info.push([index + 1, `${element.partNo}\nPO No: ${element.poNo}`, `${element.partName}\nPO Date: ${element.poDate}`, element.hsnCode, element.descOfPackage, element.invQty, element.uom, element.invRate, element.invAmt]);
        });

        // Ensure a minimum of 10 items
        const minItems = 10;
        const placeholderItem = [''];
        while (info.length < minItems) {
            info.push([...placeholderItem]);
        }

        const doc = new jsPDF();
        const logoUrl = require('../../../AllImage/RDL_Logo.png');
        const ISOUrl = require('../../../AllImage/ISOlogo.png');
        const phoneOUrl = require('../../../AllImage/phone.png');
        const mailUrl = require('../../../AllImage/mail.png');
        const webUrl = require('../../../AllImage/web.png');
        const qrCodeUrl = data?.invoice?.SignedQrCodeImgUrl ? `${urlParts[0]}${data?.invoice?.SignedQrCodeImgUrl}` : NoQr;

        const tableOptions = {
            didDrawPage: (HookData) => {
                if (HookData.pageNumber === 1) {
                    // Add an image on the first page L,Top/bottom, width,height
                    doc.addImage(logoUrl, 'PNG', 10.5, 21, 28, 20);
                    doc.addImage(ISOUrl, 'PNG', 179, 18, 20, 10);
                    // doc.addImage(phoneOUrl, 'PNG', 159, 33, 2.8, 2.8);
                    // doc.addImage(mailUrl, 'PNG', 159, 36.5, 2.8, 2.8);
                    // doc.addImage(webUrl, 'PNG', 159, 39.5, 2.8, 2.8);
                    doc.addImage(phoneOUrl, 'PNG', 42, 29, 2.8, 2.8);
                    doc.addImage(mailUrl, 'PNG', 42, 32, 2.8, 2.8);
                    doc.addImage(webUrl, 'PNG', 42, 35, 2.8, 2.8);
                    if (qrCodeUrl) {
                        doc.addImage(qrCodeUrl, 'PNG', 128.5, 16.4, 30, 30);
                    }
                }
            },
        };

        const noBackgroundColorStyle = { fillColor: null };

        doc.setFontSize(8);
        doc.setTextColor('black');
        doc.text('ORIGINAL FOR RECIPIENT', 200, 6, { align: 'right' }); // Adjust X and Y coordinates as needed



        const logoAndAddress = [
            [
                {
                    content: `                              `,
                    styles: { halign: 'left', fontSize: 7.6, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `RDL Technologies Pvt Ltd.\nPlot No. 126, Road No 3, KIADB Industrial Estate\nII Phase, Jigani Industrial Area, Jigani,Anekal Taluk,\nBengaluru - 560 105.\n     : 080-27825249\n     : www.mallikengineering.com\n     : info@mallikengineering.com`,
                    styles: { halign: 'left', fontSize: 7.6, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `                                     \n\n\n\n\n\n\n\n`,
                    styles: { lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `\n\n\n\n\nISO 9001 : 2015\nISO 14001 : 2015\nOHSAS 18001 : 2007`,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', /*valign: 'top',*/ lineWidth: 0.1, lineColor: '#000000' }
                }
            ]
        ];

        //Header2
        const pan = [
            [
                {
                    content: 'TAX INVOICE',
                    colSpan: 8,
                    styles: { halign: 'center', fontSize: 10, textColor: '#ffffff', fontStyle: 'bold', fontWeight: 'bold', fillColor: '#4D55CC', lineWidth: 0 }
                },
            ],
        ];

        //Header3
        const address = [
            [
                {
                    content: `Dispatch From:\n${data.invoice.dispatchFrom}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal', lineWidth: 0.1, lineColor: '#000000' }
                },

                {
                    content: `IRN:${data?.invoice?.Irn}\nACK NO:${data?.invoice?.AckNo}\nACK Date:${data?.invoice?.AckDt}\n \nCIN No. U28112KA2013PTC068181\nPAN No.AAICM4744Q\nGSTINO. 29AAICM4744Q1ZM\nNo:2324006750`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: `Bill To:\n${data.invoice.cName}\n${data.invoice.billAdd}Pan No: ${data.invoice.panNo}\nGST No: ${data.invoice.gstNo}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `Ship To:\n${data.invoice.cName}\n${data.invoice.shipAdd}Pan No: ${data.invoice.panNo}\nGST No: ${data.invoice.gstNo}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal', lineWidth: 0.1, lineColor: '#000000' }
                },
            ],
            [
                {
                    content: `Place of Supply & State : ${data.invoice.city} ${data.invoice.state}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `State Code : ${data.invoice.stateCode}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal', lineWidth: 0.1, lineColor: '#000000' }
                },
            ]
        ];

        //Header4
        const firstHeaderRow = [
            [
                {
                    content: `INVOICE NO: ${data.invoice.invNo}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                data.invoice.allPoSame === true ?
                    {
                        content: `PO No: ${data.items.poNo}`,
                        colSpan: 2,
                        styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                    }
                    :
                    {
                        content: `PO No: `,
                        colSpan: 2,
                        styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                    },
                {
                    content: `DC NO : ${data.invoice.customerDcNo}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `Terms of Payment : 30 Days`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
            ],
            [
                {
                    content: `Date: ${data.invoice.date}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                data.invoice.allPoSame === true ?
                    {
                        content: `PO Date: ${data.invoice.poDate}`,
                        colSpan: 2,
                        styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                    }
                    :
                    {
                        content: `PO Date: `,
                        colSpan: 2,
                        styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                    },
                {
                    content: `Date: `,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `Vehicle No: ${data.invoice.vechileNO}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
            ],
        ];
        const items = [
            // ...info,
            ['SI No', 'Part No', 'Part Description', 'HSN/SAC\nCode', 'No.&Desc\nof Pckgs', 'Quantity', 'UOM', 'Rate / Unit', 'Amount'],
            ...info,

            [
                { content: `HSN Code: ${data?.items[0]?.hsnCode}`, colSpan: 5, styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `Total Qty`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold', }
                },
                {
                    content: `${data.invoice.totalQty}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold', }
                },
            ],
            [
                { content: `Name of Commodities: ${data.invoice.itemLedger}`, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `Taxable value for GST`,
                    colSpan: 2,
                    styles: {
                        halign: 'left',
                        textColor: 'black',
                        fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000'
                    }
                },
                {
                    content: `${data.invoice.taxableValueforGST}`,
                    colSpan: 2,
                    styles: {
                        halign: 'left',
                        textColor: 'black',
                        fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000'
                    }
                },
            ],
            // [
            //     { content: `Mode of Dispatch: ${data.invoice.modelOfDis}`, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
            //     {
            //         content: `CGST @ 9.00 % `,
            //         colSpan: 2,
            //         styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
            //     },
            //     {
            //         content: `${data.invoice.CGST}`,
            //         colSpan: 2,
            //         styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
            //     },
            // ],
            ...(parseFloat(data.invoice.IGST) > 0 ? [[
                { content: `Mode of Dispatch: ${data.invoice.modelOfDis}`, colSpan: 5, styles: { halign: 'left', fontSize: 8, lineWidth: 0.1, lineColor: '#000000' } },
                {
                    content: `IGST @ ${data.invoice.IGSTPer} %`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${Number(data.invoice.IGST || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]] : []),

            ...(parseFloat(data.invoice.CGST) > 0 ? [[
                { content: `Mode of Dispatch: ${data.invoice.modelOfDis}`, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `CGST @ ${data.invoice.CGSTPer} %`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${Number(data.invoice.CGST || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]] : []),

            // ✅ Show SGST row only if SGST > 0
            ...(parseFloat(data.invoice.SGST) > 0 ? [[
                { content: ``, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `SGST @ ${data.invoice.SGSTPer} %`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${Number(data.invoice.SGST || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]] : []),
            // [
            //     { content: `Whether tax payable of reverse charge basis: NO`, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
            //     {
            //         content: `SGST @ 9.00 %:`,
            //         colSpan: 2,
            //         styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
            //     },
            //     {
            //         content: `${data.invoice.SGST}`,
            //         colSpan: 2,
            //         styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
            //     },
            // ],
            ...(parseFloat(data.invoice.UTGSTPer) > 0 ? [[
                { content: ``, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `UGST @ ${data.invoice.UTGSTPer} %`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${Number(data.invoice.UTGST || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]] : []),
            ...(parseFloat(data.invoice.tcs) > 0 ? [[
                { content: ``, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `TCS @ ${data.invoice.tcsPer} %`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${Number(data.invoice.tcs || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]] : []),
            ...(parseFloat(data.invoice.subChargeOnTcs) > 0 ? [[
                { content: ``, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `Subcharges TCS @ ${data.invoice.subChargeOnTcsPer} %`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${Number(data.invoice.subChargeOnTcs || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]] : []),
            ...(parseFloat(data.invoice.cessOnTcs) > 0 ? [[
                { content: ``, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `Cess TCS @ ${data.invoice.cessOnTcsPer} %`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${Number(data.invoice.cessOnTcs || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]] : []),
            [
                { content: `Remarks: ${data.invoice.remarks || ""}`, colSpan: 5, rowSpan: 2, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `Total Value`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${data.invoice.totalValue}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
            ],
            // [
            //     // { content: ' ', colSpan: 5, styles: { halign: 'left', fontStyle: 'italic' } },
            //     {
            //         content: `Round Off`,
            //         colSpan: 2,
            //         styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
            //     },
            //     {
            //         content: `${data.invoice.roundOff}`,
            //         colSpan: 2,
            //         styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
            //     },
            // ],
            ...(parseFloat(data.invoice.roundOff) !== 0 ? [[

                {
                    content: `Round Off`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${data.invoice.roundOff}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
            ]] : []),
            [
                {
                    content: `Grand Total In Words: Rupees ${data.invoice.totalInWords} Only`,
                    colSpan: 5,
                    styles: {
                        halign: 'left',
                        textColor: 'black',
                        fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000'
                    }
                },

                {
                    content: `Grand Total`,
                    colSpan: 2,
                    styles: {
                        halign: 'left',
                        textColor: 'black',
                        fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000'
                    }
                },
                {
                    content: `${data.invoice.invValue}`,
                    colSpan: 2,
                    styles: {
                        halign: 'left',
                        textColor: 'black',
                        fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000'
                    }
                }
            ],
        ];

        const lastDetails = [
            [
                {
                    content: 'Certified that the particulars given above are true and correct and the amount indicated represents the price actually charged and that there is no flow of additional consideration directly or indirectly from the buyer',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },

                data.invoice.invoiceGen === 0 ?
                    {
                        content: 'For RDL Technologies Pvt Ltd.\n\n\nAuthorised Signatory\nSignature of the Licences or his Authorised Agent',
                        colSpan: 4,
                        styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                    }
                    :
                    {
                        content: 'For RDL Technologies Pvt Ltd.\n\nE-Invoice generated with QR Code & IRN number,\nNo signature required\n\nAuthorised Signatory\nSignature of the Licences or his Authorised Agent',
                        colSpan: 4,
                        styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                    }
            ]
        ];

        //Auto Table
        doc.autoTable({
            head: logoAndAddress,
            tableLineColor: [0, 0, 0],
            bodyStyles: { minCellHeight: 5, cellPadding: 1 },
            // tableLineWidth: 0.25,
            theme: 'grid',
            styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
            startY: 15,

            lineWidth: 0.1,
            ...tableOptions,
            margin: { left: 10, right: 10 }
        });


        doc.autoTable({
            head: pan,
            tableLineColor: [0, 0, 0],
            bodyStyles: { minCellHeight: 5, cellPadding: 1 },
            tableLineWidth: 0.25,
            theme: 'grid',
            styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
            startY: doc.lastAutoTable.finalY,
            margin: { left: 10, right: 10 }
        });

        doc.autoTable({
            head: address,
            tableLineColor: [0, 0, 0],
            bodyStyles: { minCellHeight: 5, cellPadding: 1 },
            tableLineWidth: 0.25,
            theme: 'grid',
            styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
            startY: doc.lastAutoTable.finalY,
            margin: { left: 10, right: 10 },
        });

        doc.autoTable({
            head: firstHeaderRow,
            tableLineColor: [0, 0, 0],
            bodyStyles: { minCellHeight: 5, cellPadding: 1 },
            tableLineWidth: 0.25,
            theme: 'grid',
            styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
            startY: doc.lastAutoTable.finalY,
            margin: { left: 10, right: 10 }
        });

        doc.autoTable({
            body: items,
            tableLineColor: [0, 0, 0],
            bodyStyles: {
                minCellHeight: 5,
                cellPadding: 1,
                textColor: 'black',
                fillColor: null, // No background color
                lineWidth: 0.25,    // No cell border line width
                lineColor: 'black' // No cell border line color
            },

            tableLineWidth: 0.25,
            theme: 'grid',
            styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
            startY: doc.lastAutoTable.finalY,
            margin: { left: 10, right: 10 }
        });



        doc.autoTable({
            body: lastDetails,
            tableLineColor: [0, 0, 0],
            bodyStyles: { minCellHeight: 5, cellPadding: 1 },
            tableLineWidth: 0.25,
            theme: 'grid',
            styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
            startY: doc.lastAutoTable.finalY,
            margin: { left: 10, right: 10 }
        });


        const outerText = 'Regd. & Corporate Office: No.380A, 5th Main, Bilekahalli, Vijaya Bank Layout, Off. Bannergatta Road, Bangalore 560 076';
        const pageWidth = doc.internal.pageSize.width;
        const margin = 10; // margin from the bottom of the page
        const textWidth = pageWidth - 2 * margin; // Max width for the text

        doc.autoTable({
            startY: doc.internal.pageSize.height - margin - 9, // Start position of the footer
            body: [[outerText]],
            styles: { align: 'left', fontSize: 8 }, // Text styles
            margin: { bottom: margin },
            theme: 'plain', // No default background
        });


        // doc.save('Tax invoice.pdf');
        const pdfBlob = doc.output('blob');
        return pdfBlob; // ✅ Return the blob instead of setting state
    }

    const mergeJsPdfBlobs = async (blobs) => {
        const mergedPdf = await PDFDocument.create();

        for (const blob of blobs) {
            const arrayBuffer = await blob.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            pages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();
        const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
        return URL.createObjectURL(mergedBlob);
    };

    const [loadingPdf, setLoadingPdf] = useState(false);
    useEffect(() => {
        const generateMergedPdf = async () => {
            if (pdfBlobs.length > 0) {
                const mergedUrl = await mergeJsPdfBlobs(pdfBlobs);
                setMergedPdfUrl(mergedUrl);
            }
        };

        generateMergedPdf();
    }, [pdfBlobs]);

    // STEP 1: Function to convert one invoice JSON into <TALLYMESSAGE> block
    const generateTallyMessage = (json) => {
        const invoice = json.invoice;
        const items = json.items;

        const getFormattedDate = (dateStr) => {
            const [dd, mm, yyyy] = dateStr.split('-');
            return `${yyyy}${mm}${dd}`;
        };

        const formatAmount = (val) => (+val).toFixed(2);
        const escapeXml = (str) =>
            str?.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;") || "";

        const xmlDate = getFormattedDate(invoice.date);
        const refDate = invoice.date.replace(/-/g, '/');
        const roundOff = parseFloat(invoice.roundOff || 0);
        const roundOffSign = roundOff >= 0 ? 'Yes' : 'No';

        let xml = `<TALLYMESSAGE xmlns:UDF="TallyUDF">\n<VOUCHER REMOTEID="GSTSalesInvoice_${refDate.replace(/-/g, '')}_${invoice.invNo}" VCHTYPE="SALES" ACTION="Create">\n`;

        xml += `<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        xml += `<DATE>${xmlDate}</DATE>\n`;
        xml += `<REFERENCEDATE>${refDate}</REFERENCEDATE>\n`;
        xml += `<GUID>GSTSalesInvoice_${refDate.replace(/-/g, '')}_${invoice.invNo}</GUID>\n`;
        xml += `<VOUCHERTYPENAME>SALES</VOUCHERTYPENAME>\n`;
        // xml += `<NARRATION>${escapeXml(items.partNo || '')}</NARRATION>\n`;
        const narrationText = items.map(item => item.partNo).join(', ');
        xml += `<NARRATION>${escapeXml(narrationText)}</NARRATION>\n`;
        xml += `<PARTYLEDGERNAME>${escapeXml(invoice.cCode || invoice.cName)}</PARTYLEDGERNAME>\n`;
        xml += `<REFERENCE>${invoice.invNo}/${refDate}</REFERENCE>\n`;
        xml += `<VOUCHERNUMBER>${invoice.invNo}</VOUCHERNUMBER>\n`;
        xml += `<DIFFACTUALQTY>No</DIFFACTUALQTY>\n<ISOPTIONAL>No</ISOPTIONAL>\n`;
        xml += `<EFFECTIVEDATE>${xmlDate}</EFFECTIVEDATE>\n<ISCANCELLED>No</ISCANCELLED>\n<USETRACKINGNUMBER>No</USETRACKINGNUMBER>\n`;
        xml += `<ISINVOICE>No</ISINVOICE>\n<ISGSTOVERRIDDEN>Yes</ISGSTOVERRIDDEN>\n<BASICORDERREF></BASICORDERREF>\n`;

        // Party Ledger
        xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        xml += `<LEDGERNAME>${escapeXml(invoice.cCode || invoice.cName)}</LEDGERNAME>\n<NARRATION/>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>\n`;
        xml += `<AMOUNT>-${formatAmount(invoice.totalValue)}</AMOUNT>\n<VATEXPAMOUNT>-${formatAmount(invoice.totalValue)}</VATEXPAMOUNT>\n`;
        xml += `<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n`;
        xml += `<BILLALLOCATIONS.LIST>\n<NAME>${invoice.invNo}/${refDate}</NAME>\n<BILLCREDITPERIOD>${items[0].pay_term}</BILLCREDITPERIOD>\n`;
        xml += `<BILLTYPE>New Ref</BILLTYPE>\n<AMOUNT>-${formatAmount(invoice.totalValue)}</AMOUNT>\n</BILLALLOCATIONS.LIST>\n`;
        xml += `</ALLLEDGERENTRIES.LIST>\n`;

        // Sales Ledger
        xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        xml += `<LEDGERNAME>PAL2</LEDGERNAME>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
        xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
        xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
        xml += `<AMOUNT>${formatAmount(invoice.taxableValueforGST)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(invoice.taxableValueforGST)}</VATEXPAMOUNT>\n`;
        xml += `<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;

        // CGST
        xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        xml += `<LEDGERNAME>CGST @ 9% PAYABLE</LEDGERNAME>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
        xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
        xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
        xml += `<AMOUNT>${formatAmount(invoice.CGST)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(invoice.CGST)}</VATEXPAMOUNT>\n<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;

        // SGST
        xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        xml += `<LEDGERNAME>SGST @ 9% PAYABLE</LEDGERNAME>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
        xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
        xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
        xml += `<AMOUNT>${formatAmount(invoice.SGST)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(invoice.SGST)}</VATEXPAMOUNT>\n<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;

        // Round Off
        xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        xml += `<LEDGERNAME>Round Off</LEDGERNAME>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>${roundOffSign}</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
        xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
        xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
        xml += `<AMOUNT>${formatAmount(roundOff)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(roundOff)}</VATEXPAMOUNT>\n<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;



        xml += `</VOUCHER>\n</TALLYMESSAGE>\n`;

        return xml;
    };

    // STEP 2: Generate full XML file
    const generateCombinedXml = (invoiceArray) => {
        const allTallyMessages = invoiceArray.map(generateTallyMessage).join("\n");

        return `<?xml version="1.0" encoding="UTF-8"?>\n<ENVELOPE>\n` +
            `<HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER>\n` +
            `<BODY><IMPORTDATA>\n` +
            `<REQUESTDESC><STATICVARIABLES></STATICVARIABLES></REQUESTDESC>\n` +
            `<REQUESTDATA>\n${allTallyMessages}</REQUESTDATA>\n` +
            `</IMPORTDATA>\n</BODY>\n</ENVELOPE>`;
    };


    //////Multi XML///
    // const handleMultiXml = () => {
    //     MultiXmlPrint({ gstids: selectionRowIds }, handleXMLSuccess, handlePrintedXMLException);
    // };

    // const handleXMLSuccess = () => {

    // }
    // const handlePrintedXMLException = () => { }
    const handleMultiXml = () => {
        MultiXmlPrint({ gstids: selectionRowIds }, handleXMLSuccess, handlePrintedXMLException);
    };

    const handleXMLSuccess = (res) => {
        const xml = generateCombinedXml(res?.data || []);
        const blob = new Blob([xml], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "MultipleInvoices.xml";
        link.click();
        URL.revokeObjectURL(url);
    };

    const handlePrintedXMLException = (err) => {
        console.error("XML Download Failed:", err);
    };


    return (
        <Box sx={{ height: 400, width: '100%', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '20px' }}>
                <Link to='/NewGstInvoice' style={{ textDecoration: 'none' }}>
                    <Typography
                        sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                        variant="h5"
                    >
                        {`GST Sales Invoice>>`}
                    </Typography>
                </Link>
                <Typography style={{ textAlign: 'left', fontSize: '18px', fontWeight: 'bold' }}>Multi Invoice Sales Report</Typography>
            </div>
            <Grid container alignItems={'center'} spacing={2}>

                <Grid item xs={12} sm={12} md={3} lg={3}>
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
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={3} lg={3}>
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
                <Grid item xs={12} sm={12} md={3} lg={3}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-multiple-checkbox-label">Invoice Header</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={invoiceHeader}
                            onChange={handleChange}
                            input={<OutlinedInput label="Invoice Header" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                            size='small'
                        >
                            {names.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={invoiceHeader.includes(name)} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2} sm={12} md={3} lg={3}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={printingDoc} onChange={(e) => setPrintingDoc(e.target.checked)} />} label="Include Printed Docs Also" />
                    </FormGroup>
                </Grid>
                <Grid item xs={2} sm={12} md={5} lg={5} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', columnGap: '5px', alignItems: 'center' }}>
                    <FormGroup style={{ whiteSpace: 'nowrap' }}>
                        <FormControlLabel control={<Checkbox checked={docRange} onChange={(e) => setDocRnage(e.target.checked)} />} label="Doc Range" />
                    </FormGroup>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        label="Doc Number Range From"
                        variant="outlined"
                        style={{ marginRight: '10px' }}
                        InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                        size="small"
                        value={docRangeFrom}
                        onChange={(e) => setDocRangeFrom(e.target.value)}
                        disabled={!docRange}
                    />
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        label="Doc Number Range To"
                        variant="outlined"
                        style={{ marginRight: '10px' }}
                        InputLabelProps={{ shrink: true, style: { color: '#000000', fontWeight: 'bold' } }}
                        size="small"
                        value={docRangeTo}
                        onChange={(e) => setDocRangeTo(e.target.value)}
                        disabled={!docRange}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={1} lg={1}>
                    <Button fullWidth variant="contained" style={{ backgroundColor: '#002D68', marginRight: '15px', marginTop: '2px' }} onClick={handleView}>View</Button>
                </Grid>
            </Grid>

            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '100%', height: screenHeight - 370 }}>
                <CardContent style={{ padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        disableRowSelectionOnClick
                        onRowSelectionModelChange={handleRowSelection}
                        sx={{
                            overflow: 'auto',
                            height: '60vh',
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
                            const rowIndex = rows.findIndex(row => row.id === params.row.id);
                            if (rowIndex !== -1) {
                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                            }
                            return ''; // Return default class if index is not found
                        }}
                        rowHeight={40}
                        columnHeaderHeight={40}
                    />
                    <div style={{ width: '100%', columnGap: '10px', display: 'flex', flexDirection: 'row' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 2, backgroundColor: '#002D68' }}
                            onClick={() => {
                                handleMultilpleEInvoicePrint()
                                setPdfModalOpen(true);
                            }}
                            disabled={invoiceHeader.length < 1 || payloadData.length < 1}
                        >
                            Print E-Invoice
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 2, backgroundColor: '#002D68' }}
                            onClick={() => {
                                handleMultilpleInvoicePrint()
                                setPdfModalOpen(true);
                            }}
                            disabled={invoiceHeader.length < 1 || payloadData.length < 1}
                        >
                            Invoice Print
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 2, backgroundColor: '#002D68' }}
                            onClick={handleMultiInvoiceSeparateDownload}
                            disabled={invoiceHeader.length < 1 || payloadData.length < 1}
                        >
                            Multi Invoice Print
                        </Button>
                        {/* <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 2, backgroundColor: '#002D68' }}
                            // onClick={() => {
                            //     // handleMultilpleInvoicePrint()
                            //     // setPdfModalOpen(true);
                            //     handleMultiXml()
                            // }}
                            onClick={() => navigate('/MultiXMLPrint')}>  Generate XML</Button> */}
                    </div>
                </CardContent>
            </Card>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            {/* <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
                <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>Purchase Order</DialogTitle>

                <DialogContent style={{ padding: '2px' }}>
                    {pdfUrl && pdfUrl.map((data) => (
                        <embed src={data} type="application/pdf" width="100%" height="600px" />
                    ))
                    }
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setPdfModalOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog> */}
            <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
                <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    Purchase Order
                </DialogTitle>

                <DialogContent style={{ padding: '2px' }}>
                    {mergedPdfUrl && (
                        <embed src={mergedPdfUrl} type="application/pdf" width="100%" height="600px" />
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => {
                        setPdfModalOpen(false);
                        setMergedPdfUrl(null);
                        setPdfBlobs([]);
                    }}
                    >Close</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}
// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
// };

const thStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    fontWeight: "bold",
    backgroundColor: "#f4f4f4"
};

const successStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    color: '#5B913B',
};
const errorStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    color: 'red',
};

export default SalesReportMultiPrint;
