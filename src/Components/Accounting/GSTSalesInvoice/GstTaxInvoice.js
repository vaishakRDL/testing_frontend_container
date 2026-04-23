import React from "react";
import "./Pdf.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect } from "react";
import PrintIcon from '@mui/icons-material/Print';
import NoQr from '../../../AllImage/NoQR.png';
import { PDFDocument } from 'pdf-lib';
import DownloadIcon from '@mui/icons-material/Download';
import { GstInvLabPdf, GstInvxml } from "../../../ApiService/LoginPageService";

const GstTaxInvoice = (props) => {
    const { rowData } = props;
    const [rows, setRows] = useState('');
    const [jsonrows, setjsonRows] = useState([]);
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdfBlobs, setPdfBlobs] = useState([]);
    const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
    const [isAllPoSame, setIsAllPoSame] = useState(false);
    const [invoiceFromateChanger, setInvoiceFromateChanger] = useState(false);




    const jsonToXml = (json) => {
        if (!json || !json.invoice || !Array.isArray(json.items) || json.items.length === 0) {
            throw new Error('Invalid JSON format.');
        }

        const invoice = json.invoice;
        const items = json.items;

        const getFormattedDate = (dateStr) => {
            const [dd, mm, yyyy] = dateStr.split('-');
            return `${yyyy}${mm}${dd}`;
        };

        const formatAmount = (val) => (+val).toFixed(2);
        const escapeXml = (str) => str?.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;") || "";

        const xmlDate = getFormattedDate(invoice.date);
        const refDate = invoice.date.replace(/-/g, '/');
        const roundOff = parseFloat(invoice.roundOff || 0);
        const roundOffSign = roundOff >= 0 ? 'Yes' : 'No';

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<ENVELOPE>\n`;
        xml += `<HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER>\n<BODY><IMPORTDATA>\n<REQUESTDESC><STATICVARIABLES></STATICVARIABLES></REQUESTDESC>\n<REQUESTDATA>\n`;
        xml += `<TALLYMESSAGE xmlns:UDF="TallyUDF">\n<VOUCHER REMOTEID="GSTSalesInvoice_${refDate.replace(/-/g, '')}_${invoice.invNo}" VCHTYPE="SALES" ACTION="Create">\n`;

        xml += `<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        xml += `<DATE>${xmlDate}</DATE>\n`;
        xml += `<REFERENCEDATE>${refDate}</REFERENCEDATE>\n`;
        xml += `<GUID>GSTSalesInvoice_${refDate.replace(/-/g, '')}_${invoice.invNo}</GUID>\n`;
        xml += `<VOUCHERTYPENAME>SALES</VOUCHERTYPENAME>\n`;
        xml += `<NARRATION>${escapeXml(items[0].poNo || '')}</NARRATION>\n`;
        xml += `<PARTYLEDGERNAME>${escapeXml(invoice.cCode || invoice.cName)}</PARTYLEDGERNAME>\n`;
        xml += `<REFERENCE>${invoice.invNo}/${refDate}</REFERENCE>\n`;
        xml += `<VOUCHERNUMBER>${invoice.invNo}</VOUCHERNUMBER>\n`;
        xml += `<DIFFACTUALQTY>No</DIFFACTUALQTY>\n<ISOPTIONAL>No</ISOPTIONAL>\n`;
        xml += `<EFFECTIVEDATE>${xmlDate}</EFFECTIVEDATE>\n<ISCANCELLED>No</ISCANCELLED>\n<USETRACKINGNUMBER>No</USETRACKINGNUMBER>\n`;
        xml += `<ISINVOICE>No</ISINVOICE>\n<ISGSTOVERRIDDEN>Yes</ISGSTOVERRIDDEN>\n<BASICORDERREF></BASICORDERREF>\n`;

        // 1. Party Ledger
        xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        xml += `<LEDGERNAME>${escapeXml(invoice.cCode || invoice.cName)}</LEDGERNAME>\n<NARRATION/>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>\n`;
        xml += `<AMOUNT>-${formatAmount(invoice.totalValue)}</AMOUNT>\n<VATEXPAMOUNT>-${formatAmount(invoice.totalValue)}</VATEXPAMOUNT>\n`;
        xml += `<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n`;
        xml += `<BILLALLOCATIONS.LIST>\n<NAME>${invoice.invNo}/${refDate}</NAME>\n<BILLCREDITPERIOD>${items[0].pay_term}</BILLCREDITPERIOD>\n`;
        xml += `<BILLTYPE>New Ref</BILLTYPE>\n<AMOUNT>-${formatAmount(invoice.totalValue)}</AMOUNT>\n</BILLALLOCATIONS.LIST>\n`;
        xml += `</ALLLEDGERENTRIES.LIST>\n`;

        // 2. Sales Ledger
        xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        xml += `<LEDGERNAME>PAL2</LEDGERNAME>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
        xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
        xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
        xml += `<AMOUNT>${formatAmount(invoice.taxableValueforGST)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(invoice.taxableValueforGST)}</VATEXPAMOUNT>\n`;
        xml += `<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;

        // 3. CGST
        xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        xml += `<LEDGERNAME>CGST @ 9% PAYABLE</LEDGERNAME>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
        xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
        xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
        xml += `<AMOUNT>${formatAmount(invoice.CGST)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(invoice.CGST)}</VATEXPAMOUNT>\n<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;

        // 4. SGST
        xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        xml += `<LEDGERNAME>SGST @ 9% PAYABLE</LEDGERNAME>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
        xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
        xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
        xml += `<AMOUNT>${formatAmount(invoice.SGST)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(invoice.SGST)}</VATEXPAMOUNT>\n<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;

        // 5. Round Off
        xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        xml += `<LEDGERNAME>Round Off</LEDGERNAME>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>${roundOffSign}</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
        xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
        xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
        xml += `<AMOUNT>${formatAmount(roundOff)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(roundOff)}</VATEXPAMOUNT>\n<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;

        // 6. Loop through each item for inventory entries
        items.forEach((item) => {
            xml += `<ALLINVENTORYENTRIES.LIST>\n`;
            xml += `<STOCKITEMNAME>${escapeXml(item.itemName)}</STOCKITEMNAME>\n`;
            xml += `<RATE>${formatAmount(item.invRate)}</RATE>\n`;
            xml += `<AMOUNT>${formatAmount(item.invAmt)}</AMOUNT>\n`;
            xml += `<ACTUALQTY>${item.invQty} ${item.uom}</ACTUALQTY>\n`;
            xml += `<BILLEDQTY>${item.invQty} ${item.uom}</BILLEDQTY>\n`;
            xml += `<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n`;
            xml += `</ALLINVENTORYENTRIES.LIST>\n`;
        });

        xml += `</VOUCHER>\n</TALLYMESSAGE>\n</REQUESTDATA>\n</IMPORTDATA>\n</BODY>\n</ENVELOPE>\n`;

        return xml;
    };


    const handleGSTLabInvoice = () => {
        GstInvLabPdf({ id: rowData }, handlePdfInvSucess, handePdfInvException)

    }

    const downloadXmlFile = (xmlString) => {
        const blob = new Blob([xmlString], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.xml';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const invoiceHeader = [
        'ORIGINAL FOR RECIPIENT',
        'DUPLICATE FOR TRANSPORTER(GOODS)/SUPPLIER(SERVICES)',
        'TRIPLICATE FOR SUPPLIER(GOODS)/EXTRA COPY(SERVICES)',
        'EXTRA COPY'
    ];

    const handlePdfInvSucess = (dataObject) => {
        // handleFileSave(dataObject?.data || []);
        if (!dataObject?.data) return;

        const invoice = dataObject.data.invoice;
        const items = dataObject.data.items;

        if (items.length > 0) {
            const uniquePoNos = new Set(items.map(item => item.poNo));

            if (uniquePoNos.size === 1) {
                invoice.allPoSame = true;
                invoice.poNo = items[0].poNo;
                invoice.poDate = items[0].poDate;
            } else {
                invoice.allPoSame = false;
            }
        } else {
            invoice.allPoSame = false;
        }
        if (dataObject?.data) {
            const xmlData = jsonToXml(dataObject?.data); // Assuming you want to convert only the first item
            downloadXmlFile(xmlData);
        }
        const allBlobs = [];
        for (const headerName of invoiceHeader) {
            const blob = handleFileSave(dataObject.data, headerName);
            allBlobs.push(blob);
        }
        setPdfBlobs(allBlobs);
    }

    const handePdfInvException = (errorStatus, errorMessage) => {
        console.log(errorMessage);
    }


    const baseUrl = process.env.REACT_APP_API_URL;
    const urlParts = baseUrl.split('api/');

    function emptyRowsToPush(lineItems) {
        const pageSize = 39, header = 20, footer = 10;
        const content = header + lineItems + footer;
        const totPage = Math.floor(content / pageSize) + 1;
        const totalContentSize = pageSize * totPage;
        const rowToPush = totalContentSize - content
        return rowToPush;
    }

    const handleFileSave = (data, headerName) => {
        setIsAllPoSame(data.invoice.allPoSame)
        let info = [];
        data.items.forEach((element, index, array) => {
            data.invoice.allPoSame === true ?
                info.push([index + 1, `${element.partNo}`, `${element.itemName}`, element.hsnCode, element.descOfPackage, element.invQty, element.uom, element.invRate, element.invAmt])
                :
                info.push([index + 1, `${element.partNo}\nPO No: ${element.poNo}`, `${element.itemName}\nPO Date: ${element.poDate}`, element.hsnCode, element.descOfPackage, element.invQty, element.uom, element.invRate, element.invAmt]);
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
        const logoUrl = `${baseUrl}/${data.invoice?.companyImage}`
        const ISOUrl = require('../../../AllImage/Picture.png');

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
                // doc.text(
                //     `DC No : ${data.invoice.invNo}     |     Date : ${data.invoice.date}`,
                //     14, // X position
                //     10  // Y position
                // );
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
                    content: `${data.invoice.companyName}\n${data.invoice?.companyAdd}. Tel:${data.invoice?.telNo}\nWeb Site :${data.invoice?.website}\nEmail : ${data.invoice?.email}`,
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
                        content: `CIN No   : ${data.invoice?.cmpCinNo}`,
                        colSpan: 1,
                        styles: { halign: 'center', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                    },
                    {
                        content: `PAN No  : ${data.invoice?.cmpPanNo}`,
                        colSpan: 1,
                        styles: { halign: 'center', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                    },
                    {
                        content: `GSTINO : ${data.invoice?.cmpGstNo}`,
                        colSpan: 1,
                        styles: { halign: 'center', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                    },
                    {
                        content: `InvNO :${data.invoice.invNo}`,
                        colSpan: 1,
                        styles: { halign: 'center', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                    }
                ],
                [
                    {
                        content: 'TAX INVOICE',
                        colSpan: 8,
                        styles: { halign: 'center', fontSize: 10, textColor: '#ffffff', fontStyle: 'bold', fontWeight: 'bold', fillColor: '#4D55CC', lineWidth: 0 }
                    },
                ],
            ]
            :
            [
                [
                    {
                        content: 'TAX INVOICE',
                        colSpan: 8,
                        styles: { halign: 'center', fontSize: 10, textColor: '#ffffff', fontStyle: 'bold', fontWeight: 'bold', fillColor: '#4D55CC', lineWidth: 0 }
                    },
                ],
            ]


        // const address = [
        //     // First row: Labels
        //     [
        //         {
        //             content: "Dispatch From:", colSpan: 4, styles: {
        //                 cellPadding: { top: 0.5, bottom: 0, left: 1, right: 1 },

        //                 fontStyle: 'bold', fontSize: 8
        //             }
        //         },
        //         {
        //             content: "", colSpan: 4, styles: {
        //                 cellPadding: { top: 0.5, bottom: 0, left: 1, right: 1 },

        //                 fontStyle: 'bold', fontSize: 8
        //             }
        //         }
        //     ],
        //     // Second row: Data
        //     [
        //         {
        //             content: `${data.invoice?.dispatchFromAdd}`,
        //             colSpan: 4,
        //             styles: {
        //                 cellPadding: { top: 0, bottom: 0, left: 1, right: 1 },

        //                 halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal',
        //             }
        //         },
        //         {
        //             content: `IRN: ${data.invoice?.Irn || ''}\nACK NO: ${data.invoice?.AckNo || ''}\nACK Date: ${data.invoice?.AckDt || ''}`,
        //             colSpan: 4,
        //             styles: {
        //                 cellPadding: { top: 0, bottom: 0, left: 1, right: 1 },

        //                 halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal',
        //             }
        //         }
        //     ],
        //     // EwayBill row
        //     [
        //         {
        //             content: `EwayBill No: ${data.invoice?.EwbNo || ''}`,
        //             colSpan: 4,
        //             styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //         {
        //             content: `EwayBill Date: ${data.invoice?.EwbDt || ''}`,
        //             colSpan: 4,
        //             styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
        //         }
        //     ],
        //     // Bill To / Ship To
        //     [
        //         {
        //             content: "Bill To:", colSpan: 4,
        //             styles: {
        //                 cellPadding: { top: 0.5, bottom: 0, left: 1, right: 1 },

        //                 halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold',
        //             }
        //         },
        //         {
        //             content: "Ship To:", colSpan: 4,
        //             styles: {
        //                 cellPadding: { top: 0.5, bottom: 0, left: 1, right: 1 },
        //                 halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold',
        //             }
        //         }
        //     ],
        //     [
        //         {
        //             content:
        //                 `${data.invoice.cName}\n${data.invoice.billAdd}\nPAN No: ${data.invoice.panNo}\nGST No: ${data.invoice.gstNo}`,
        //             colSpan: 4,
        //             styles: {
        //                 cellPadding: { top: 0, bottom: 0.5, left: 1, right: 1 },

        //                 halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal',
        //             }
        //         },
        //         {
        //             content:
        //                 `${data.invoice.cName}\n${data.invoice.shipAdd}\nPAN No: ${data.invoice.panNo}\nGST No: ${data.invoice.gstNo}`,
        //             colSpan: 4,
        //             styles: {
        //                 cellPadding: { top: 0, bottom: 0.5, left: 1, right: 1 },

        //                 halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal',
        //             }
        //         }
        //     ],
        //     [
        //         {
        //             content: `Place of Supply & State: ${data.invoice.city} ${data.invoice.state}`,
        //             colSpan: 4,
        //             styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //         {
        //             content: `State Code: ${data.invoice.stateCode}`,
        //             colSpan: 4,
        //             styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
        //         }
        //     ]
        // ];


        //Header4
        const address = [
            // First row: Labels
            [
                {
                    content: "Dispatch From:", colSpan: 4, styles: {
                        cellPadding: { top: 0.5, bottom: 0, left: 1, right: 1 },

                        fontStyle: 'bold', fontSize: 8
                    }
                },
                {
                    content: "", colSpan: 4, styles: {
                        cellPadding: { top: 0.5, bottom: 0, left: 1, right: 1 },

                        fontStyle: 'bold', fontSize: 8
                    }
                }
            ],
            // Second row: Data
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
                    content: `${data.invoice?.dispatchFromAdd}`,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: -2, bottom: 0, left: 1, right: 1 },

                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal',
                    }
                },
                {
                    content: `IRN: ${data.invoice?.Irn || ''}\nACK NO: ${data.invoice?.AckNo || ''}\nACK Date: ${data.invoice?.AckDt || ''}`,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: -2, bottom: 0, left: 1, right: 1 },

                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal',
                    }
                }
            ],
            // EwayBill row
            [
                {
                    content: `EwayBill No: ${data.invoice?.EwbNo || ''}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `EwayBill Date: ${data.invoice?.EwbDt || ''}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                }
            ],
            // Bill To / Ship To
            [
                {
                    content: "Bill To:", colSpan: 4,
                    styles: {
                        cellPadding: { top: 0.5, bottom: 0, left: 1, right: 1 },

                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold',
                    }
                },
                {
                    content: "Ship To:", colSpan: 4,
                    styles: {
                        cellPadding: { top: 0.5, bottom: 0, left: 1, right: 1 },
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
                        cellPadding: { top: -1, bottom: 0, left: 1, right: 1 },
                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold',
                    }
                },
                {
                    content: `${data.invoice.cName}`,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: -1, bottom: 0, left: 1, right: 1 },
                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold',
                    }
                }
            ],
            // Row: Remaining address details (normal)
            [
                {
                    content:
                        `${data.invoice.billAdd}\nPAN No: ${data.invoice.panNo}\nGST No: ${data.invoice.gstNo}`,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: -2, bottom: 0.5, left: 1, right: 1 },
                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal',
                    }
                },
                {
                    content:
                        `${data.invoice.shipAdd}\nPAN No: ${data.invoice.panNo}\nGST No: ${data.invoice.gstNo}`,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: -2, bottom: 0.5, left: 1, right: 1 },
                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal',
                    }
                }
            ],
            [
                {
                    content: `Place of Supply & State: ${data.invoice.city} ${data.invoice.state}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `State Code: ${data.invoice.stateCode}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]
        ];

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
                    content: `DC NO : ${data.invoice.customerDcNo || ""}`,
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
                    content: `Dc Date: ${data.invoice.customerDcDate || ""}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `Vehicle No: ${data.invoice.vechileNO || ""}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
            ],
        ];
        const items = [
            // ...info,
            // ['SI No', 'Part No', 'Part Description', 'HSN/SAC\nCode', 'No.&Desc\nof Pckgs', 'Quantity', 'UOM', 'Rate / Unit', 'Amount'],
            ...info,

            [
                // { content: `HSN Code: ${data?.items[0]?.hsnCode}`, colSpan: 5, styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                { content: `Name of Commodities: ${data.invoice.itemLedger}`, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
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
                // { content: `Name of Commodities: PARTS OF LIFTS/ELEVATORS`, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                { content: `Whether tax payable of reverse charge basis: NO`, colSpan: 5, styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
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
            //         styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
            //     },
            // ],
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
            //         styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
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
            ...(parseFloat(data.invoice.UTGST) > 0 ? [[
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
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
            ],

            // ...(data.invoice.roundOff !== 0 ? [[
            ...(parseFloat(data.invoice.roundOff) !== 0 ? [[

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
                        halign: 'right',
                        textColor: 'black',
                        fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000'
                    }
                }
            ],
        ];


        const lastDetails = [
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
                        fontStyle: 'bold',
                        textColor: 'black',
                        cellPadding: 1,
                        lineWidth: 0,
                    }
                }
            ],
            ...(data.invoice.invoiceGen === 1
                ? [
                    [
                        {
                            content: '',
                            colSpan: 4,
                            styles: {
                                lineWidth: 0,
                            }
                        },
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
                ] : []),
            [
                {
                    content: '',
                    colSpan: 4,
                    styles: {
                        lineWidth: 0,
                    }
                },
                {
                    content: 'Authorised Signatory',
                    colSpan: 4,
                    styles: {
                        halign: 'left',
                        fontSize: 8,
                        fontStyle: 'bold',
                        textColor: 'black',
                        cellPadding: 1,
                        lineWidth: 0,
                    }
                }
            ],
            [
                {
                    content: 'E.&.O.E.' + ' '.repeat(55) + 'Subject to Bengaluru Jurisdiction',
                    colSpan: 4,
                    styles: {
                        lineWidth: 0,
                        textColor: 'black',
                        // border: [true, true, false, true]
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
                        // border: [false, true, true, true]
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
            body: address,
            theme: 'plain',
            bodyStyles: { minCellHeight: 5, cellPadding: 1 },
            styles: {
                font: 'times',
                fontSize: 8,
                halign: 'left',
                valign: 'top',
                textColor: [0, 0, 0],
            },
            margin: { left: 10, right: 10 },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.25,
            startY: doc.lastAutoTable.finalY || 30,

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


        // doc.autoTable({
        //     body: items,
        //     tableLineColor: [0, 0, 0],
        //     ...tableOptions,
        //     bodyStyles: {
        //         minCellHeight: 5,
        //         cellPadding: 1,
        //         textColor: 'black',
        //         fillColor: null,
        //         lineWidth: 0.25,
        //         lineColor: 'black'
        //     },
        //     tableLineWidth: 0.25,
        //     theme: 'grid',
        //     styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
        //     startY: doc.lastAutoTable.finalY,
        //     margin: { left: 10, right: 10 },

        //     // 👇 Add this callback to make the header row bold
        //     didParseCell: function (data) {
        //         // ✅ Make the header row bold
        //         if (data.row.index === 0) {
        //             data.cell.styles.fontStyle = 'bold';
        //         }

        //         // ✅ Right-align columns for data rows (skip header row)
        //         const rightAlignColumns = [7, 8]; // Quantity, Rate / Unit, Amount

        //         const centerAlignColumns = [5]; // Invoice No., Date, Amount
        //         if (data.row.index > 0 && rightAlignColumns.includes(data.column.index)) {
        //             data.cell.styles.halign = 'right';
        //         }
        //         if (data.row.index > 0 && centerAlignColumns.includes(data.column.index)) {
        //             data.cell.styles.halign = 'center';
        //         }
        //     }
        // });
        doc.autoTable({
            head: [[
                'SI No',
                'Part No',
                'Part Description',
                'HSN/SAC\nCode',
                'No.&Desc\nof Pckgs',
                'Quantity',
                'UOM',
                'Rate / Unit',
                'Amount'
            ]],
            //   head: head,

            body: items,  // 👈 keep only item rows + summary rows here
            tableLineColor: [0, 0, 0],
            ...tableOptions,
            headStyles: {
                fillColor: [255, 255, 255], lineWidth: 0.1, lineColor: '#000000',   // ✅ make sure border is drawn
                textColor: 'black', fontStyle: 'bold'
            },

            bodyStyles: {
                minCellHeight: 5,
                cellPadding: 1,
                textColor: 'black',
                fillColor: null,
                lineWidth: 0.25,
                lineColor: 'black',
                halign: "center",
                valign: "middle",
            },
            tableLineWidth: 0.25,
            theme: 'grid',
            styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
            startY: doc.lastAutoTable.finalY,
            margin: { left: 10, right: 10 },

            didParseCell: function (data) {
                // ✅ Bold header row
                // if (data.section === 'head') {
                //     data.cell.styles.fontStyle = 'bold';
                // }
                if (data.section === 'head') {
                    data.cell.styles.fontStyle = 'bold';
                    return;
                }

                // 🚨 Skip alignment for summary rows (GST, Total, Remarks, etc.)
                if (data.cell.colSpan > 1) {
                    return;
                }
                // ✅ Keep your alignment rules the same
                const rightAlignColumns = [7, 8];
                const centerAlignColumns = [4, 5, 6];
                const leftAlignColumns = [1, 2];
                if (data.section === 'body' && rightAlignColumns.includes(data.column.index)) {
                    data.cell.styles.halign = 'right';
                }
                if (data.section === 'body' && leftAlignColumns.includes(data.column.index)) {
                    data.cell.styles.halign = 'left';
                }
                if (data.section === 'body' && centerAlignColumns.includes(data.column.index)) {
                    data.cell.styles.halign = 'center';
                }
            }

        });


        doc.autoTable({
            body: lastDetails, // your content
            theme: 'grid', // keep it for spacing, padding
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

            didDrawCell: function (data) {
                const doc = data.doc;
                const { cell, column } = data;
                const { x, y, width, height } = cell;

                // 🟢 Only for the LEFT cell — draw one center vertical line
                if (column.index === 0) {
                    const centerX = x + width; // right edge of left cell
                    doc.setDrawColor(0); // black
                    doc.setLineWidth(0.5); // bold if needed
                    doc.line(centerX, y, centerX, y + height); // vertical center line
                }

                // 🔴 Hide all borders (theme: 'grid' draws them by default)
                doc.setDrawColor(255); // white = invisible
                doc.setLineWidth(0.25);
                doc.line(x, y, x + width, y); // top
                doc.line(x, y + height, x + width, y + height); // bottom
                doc.line(x + width, y, x + width, y + height); // right
                // optional: doc.line(x, y, x, y + height); // left

                // reset styles
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

    useEffect(() => {
        const generateMergedPdf = async () => {
            if (pdfBlobs.length > 0) {
                const mergedUrl = await mergeJsPdfBlobs(pdfBlobs);
                setMergedPdfUrl(mergedUrl);
            }
        };

        generateMergedPdf();
    }, [pdfBlobs]);

    return (
        <>
            <PrintIcon style={{ color: '#ffffff', cursor: 'pointer' }}
                onClick={() => {
                    handleGSTLabInvoice();
                    setPdfModalOpen(true);
                }}
            />

            <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
                <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    Tax-Invoice
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
        </>
    )
}
export default GstTaxInvoice;
