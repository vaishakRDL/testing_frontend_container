import React from "react";
import "./Pdf.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useEffect } from "react";
import PrintIcon from '@mui/icons-material/Print';
import { GstInvLabPdf, LabourChargeInvoicePdf } from "../../../ApiService/LoginPageService";
import NoQr from '../../../AllImage/NoQR.png';
import { PDFDocument } from 'pdf-lib';

const EInvoicePdf = (props) => {
    const { rowData } = props;
    const [rows, setRows] = useState('');
    const [jsonrows, setjsonRows] = useState([]);
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [pdfBlobs, setPdfBlobs] = useState([]);
    const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
    const [invoiceFromateChanger, setInvoiceFromateChanger] = useState(false);



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


    const handleGSTLabInvoice = () => {
        GstInvLabPdf({ id: rowData }, handlePdfInvSucess, handePdfInvException)
        // GstInvxml({ id: rowData.id }, handlePdfInvSucess, handePdfInvException)
    }

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

        const allBlobs = [];
        for (const headerName of invoiceHeader) {
            const blob = handleFileSave(dataObject.data, headerName);
            allBlobs.push(blob);
        }
        setPdfBlobs(allBlobs);
        setjsonRows(dataObject?.data || [])
    }

    const handePdfInvException = (errorStatus, errorMessage) => {
        console.log(errorMessage);
    }



    // const handleFileSave = (data) => {
    //     let info = []
    //     console.log("data", data)
    //     data.items.forEach((element, index, array) => {
    //         info.push([element.index, `${element.partNo} ${element.partName}`, element.hsnCode, element.descOfPackage, element.invQty, element.uom, element.invRate, element.invAmt])
    //         console.log("data", data)
    //     });
    //     const doc = new jsPDF();
    //     const logoUrl = require('../../../AllImage/RDL_Logo.png');
    //     const ISOUrl = require('../../../AllImage/ISOlogo.png');

    //     const tableOptions = {
    //         didDrawPage: (HookData) => {
    //             if (HookData.pageNumber === 1) {
    //                 // Add an image on the first page L,Top/bottom, widht,height
    //                 doc.addImage(logoUrl, 'PNG', 26, 18, 28, 20);
    //                 doc.addImage(ISOUrl, 'PNG', 170, 18, 20, 10);
    //             }
    //         },
    //     };

    //     //Header1
    //     const logoAndAddress = [
    //         [
    //             {
    //                 content: 'ORIGINAL FOR RECIPIENT',
    //                 colSpan: 8,
    //                 styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0 }
    //             }
    //         ],
    //         [
    //             {
    //                 content: 'LABOUR CHARGES TAX INVOICE',
    //                 colSpan: 8,
    //                 styles: { halign: 'center', fontSize: 10, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold', fillColor: '#CCCCCC' }
    //             },
    //         ],
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
    //                 styles: { halign: 'right', fontSize: 8, textColor: 'black', valign: 'bottom' }
    //             }
    //         ]
    //     ];

    //     //Header2
    //     const pan = [[
    //         {
    //             content: 'CIN No. U28112KA2013PTC068181',
    //             colSpan: 2,
    //             styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //         },
    //         {
    //             content: 'PAN No.AAICM4744Q',
    //             colSpan: 2,
    //             styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //         },
    //         {
    //             content: 'GSTINO. 29AAICM4744Q1ZM',
    //             colSpan: 2,
    //             styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //         },
    //         {
    //             content: 'No:2324006750',
    //             colSpan: 2,
    //             styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
    //         }
    //     ]];

    //     //Header3
    //     const address = [
    //         [
    //             {
    //                 content: `Dispatch From:\n${data.invoice.dispatchFromAdd}`,
    //                 colSpan: 4,
    //                 styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //             },

    //             {
    //                 content: `IRN:96a44fa78c60ee8b7a3ea5c600459a378655b2223bb631cbfa5f6ff03dd2dd21\nACK NO:${data.invoice.ackNo}\nACK Date:${data.invoice.ackDate}`,
    //                 colSpan: 4,
    //                 styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //             },
    //         ],
    //         [
    //             {
    //                 // content: 'Bill To:\nOTIS Elevator Company (India) ltd\nNO. 92, KIADB INDL. ESTATE,\nPHASE II, JIGANI INDL. AREA,\nANEKAL TALUK\nBangalore 560105 Karnataka\nPAN No.:AAACO0481E\nGSTIN No:29AAACO0481E2ZM',
    //                 content: `Bill To:\n${data.invoice.billAdd}`,
    //                 colSpan: 4,
    //                 styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: 'Ship To :\nOTIS Elevator Company (India) ltd\nNO. 92, KIADB INDL. ESTATE,\nPHASE II, JIGANI INDL. AREA,\nANEKAL TALUK\nBangalore 560105 Karnataka\nPAN No.:AAACO0481E\nGSTIN No:29AAACO0481E2ZM',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: `Place of Supply & State : ${data.invoice.add1} ${data.invoice.add3}`,
    //                 colSpan: 4,
    //                 styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //             },
    //             {
    //                 content: `State Code : ${data.invoice.stateCode}`,
    //                 colSpan: 4,
    //                 styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
    //             },
    //         ]
    //     ];

    //     //Header4
    //     const firstHeaderRow = [
    //         [
    //             {
    //                 content: `INVOICE NO: ${data.invoice.invNo}`,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: `PO NO:${data.invoice.invNo}`,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: `DC NO : ${data.invoice.dcNO}`,
    //                 colSpan: 1,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: `Terms of Payment :${data.invoice.dcNO}`,
    //                 colSpan: 3,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             }
    //         ],
    //         [
    //             {
    //                 content: `Date: ${data.invoice.date}`,
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: 'Date: ',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: 'Date:',
    //                 colSpan: 1,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: `Vehicle No: ${data.invoice.vechileNO}`,
    //                 colSpan: 3,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             }
    //         ],
    //     ];

    //     //Columns
    //     const secondHeaderRow = [['SI No', 'Description & Specification of Goods', 'HSN/SAC Code', 'No.&Desc of Pckgs', 'Total Qty of Goods (Net)', 'UOM', 'Rate / Unit', 'Value Of Goods']];

    //     const headerRows = [...logoAndAddress, ...pan, ...address, ...firstHeaderRow, ...secondHeaderRow];

    //     //Header5
    //     const totalRow = [
    //         [
    //             {
    //                 content: 'LABOUR CHARGES ONLY',
    //                 colSpan: 4,
    //                 rowSpan: 1,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }

    //             },
    //             {
    //                 content: 'Total Qty',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: `${data.invoice.totalQty}`,
    //                 colSpan: 2,
    //                 styles: { halign: 'right', fontSize: 8, textColor: 'black' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: '',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: 'Taxable Value for GST Payable:',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: `${data.invoice.taxableValueforGST}`,
    //                 colSpan: 2,
    //                 styles: { halign: 'right', fontSize: 8, textColor: 'black' }
    //             },

    //         ],
    //         [
    //             {
    //                 content: '',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: 'CGST @ 9.00 % ',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: `${data.invoice.CGST}`,
    //                 colSpan: 2,
    //                 styles: { halign: 'right', fontSize: 8, textColor: 'black' }
    //             },

    //         ],
    //         [
    //             {
    //                 content: '',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: 'SGST @ 9.00 % ',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: `${data.invoice.SGST}`,
    //                 colSpan: 2,
    //                 styles: { halign: 'right', fontSize: 8, textColor: 'black' }
    //             },

    //         ],
    //         [
    //             {
    //                 content: '',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: 'Total Value ',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: `${data.invoice.totalValue}`,
    //                 colSpan: 2,
    //                 styles: { halign: 'right', fontSize: 8, textColor: 'black' }
    //             },
    //         ],
    //         [
    //             {
    //                 content: '',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: 'Round Off ',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: `${data.invoice.roundOff}`,
    //                 colSpan: 2,
    //                 styles: { halign: 'right', fontSize: 8, textColor: 'black' }
    //             },

    //         ],
    //         [
    //             {
    //                 content: `Grand Total In Words: ${data.invoice.totalInWords}`,
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: 'Grand Total',
    //                 colSpan: 2,
    //                 styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //             },
    //             {
    //                 content: `${data.invoice.invValue}`,
    //                 colSpan: 2,
    //                 styles: { halign: 'right', fontSize: 8, textColor: 'black' }
    //             },
    //         ],
    //     ];

    //     //Header6
    //     const totalWords = [
    //         [
    //             {
    //                 content: `Date of Issue of Invoice : ${data.invoice.invoIssuDate}`,
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 8 }
    //             },
    //             {
    //                 content: 'Name of Commodities : LABOUR CHARGES',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 8 }
    //             },

    //         ],
    //         [
    //             {
    //                 content: `Mode of Dispatch: ${data.invoice.modelOfDis}`,
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 8 }
    //             },
    //             {
    //                 content: 'Whether tax payable of Reverse Charge basis: NO',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 8 }
    //             },

    //         ],
    //         [
    //             {
    //                 content: 'Remarks:',
    //                 colSpan: 8,
    //                 styles: { halign: 'left', fontSize: 8 }
    //             },

    //         ],
    //         [
    //             {
    //                 content: 'DC Details:',
    //                 colSpan: 8,
    //                 styles: { halign: 'left', fontSize: 8 }
    //             },

    //         ],
    //         [
    //             {
    //                 content: 'Certified that the particulars given below are true and correct and the amount indicated represents the price actually charged and that there is no flow of additional consideration directly or indirectly from the buyer',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 8 }
    //             },
    //             {
    //                 content: 'For RDL Technologies Pvt Ltd.\nSignature not verified\nDigitally Signed By:\nAuthorised Signatory\nSignature of the Licences or his Authorised Agent',
    //                 colSpan: 4,
    //                 styles: { halign: 'left', fontSize: 8 }
    //             },
    //         ],
    //     ];

    //     //Header7
    //     // const termsAndSuppluColumn = [
    //     //     [
    //     //         {
    //     //             content: `Receiver's Signature`,
    //     //             colSpan: 2,
    //     //             styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom' }
    //     //         },
    //     //         {
    //     //             content: 'Prepared By ',
    //     //             colSpan: 2,
    //     //             styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom' }
    //     //         },
    //     //         {
    //     //             content: 'Reviewed By',
    //     //             colSpan: 2,
    //     //             styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom' }
    //     //         },
    //     //         {
    //     //             content: 'For RDL Technologies Pvt Ltd.\nSignature Not Verified.\nDigitally Signed By: \nDate: 11/03/2024\nAuthorized Signatory',
    //     //             colSpan: 4,
    //     //             // rowSpan:6,
    //     //             styles: { halign: 'left', fontSize: 8, textColor: 'black' }
    //     //         }
    //     //     ],
    //     // ]

    //     //Table Border lines
    //     const outerTable = [
    //         [
    //             {
    //                 content: 'Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076',
    //                 colSpan: 10,
    //                 styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', lineWidth: 0 }
    //             },
    //         ],

    //     ];

    //     const bodyRows = [...info, ...totalRow, ...totalWords,]
    //     const footRows = [...outerTable]

    //     doc.autoTable({
    //         theme: 'striped',
    //         head: headerRows,
    //         body: bodyRows,
    //         foot: footRows,
    //         showHead: 'firstPage',
    //         showFoot: 'lastPage',
    //         startY: 2,
    //         ...tableOptions,
    //         // startY: 0,
    //         // pageBreak: 'avoid',
    //         // rowPageBreak: 'avoid',
    //         // tableWidth: 'auto',
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

    //     // doc.save('Labour Charge.pdf');
    //     const pdfBlob = doc.output('blob');
    //     const pdfBlobUrl = URL.createObjectURL(pdfBlob);
    //     setPdfUrl(pdfBlobUrl);
    // }

    const baseUrl = process.env.REACT_APP_API_URL;
    const urlParts = baseUrl.split('api/');

    // function emptyRowsToPush(lineItems) {
    //     const pageSize = 39, header = 15, footer = 10;
    //     const content = header + lineItems + footer;
    //     const totPage = Math.floor(content / pageSize) + 1;
    //     const totalContentSize = pageSize * totPage;
    //     const rowToPush = totalContentSize - content
    //     return rowToPush;
    // }
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

    const handleFileSave = (data, headerName) => {
        let info = [];
        data.items.forEach((element, index, array) => {
            data.invoice.allPoSame === true ?
                info.push([index + 1, `${element.partNo}`, `${element.partName}`, element.hsnCode, element.descOfPackage, element.invQty, element.uom, element.invRate, element.invAmt])
                :
                info.push([index + 1, `${element.partNo}\nPO No: ${element.poNo}`, `${element.partName}\nPO Date: ${element.poDate}`, element.hsnCode, element.descOfPackage, element.invQty, element.uom, element.invRate, element.invAmt]);
        });

        // Ensure a minimum of 10 items
        // const minItems = 10;
        // const placeholderItem = [''];
        // while (info.length < minItems) {
        //     info.push([...placeholderItem]);
        // }
        // const paddingNeeded = emptyRowsToPush(info.length)
        // for (let i = 0; i < paddingNeeded; i++) {
        //     const emptyRow = ["", "", "", "", "", "", "", "", ""];
        //     emptyRow.isInfoRow = true; // Keep the same flag if you want same styling
        //     info.push(emptyRow);
        // }
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
                    // doc.addImage(phoneOUrl, 'PNG', 159, 33, 2.8, 2.8);
                    // doc.addImage(mailUrl, 'PNG', 159, 36.5, 2.8, 2.8);
                    // doc.addImage(webUrl, 'PNG', 159, 39.5, 2.8, 2.8);
                    // doc.addImage(phoneOUrl, 'PNG', 42, 29, 2.8, 2.8);
                    // doc.addImage(mailUrl, 'PNG', 42, 32, 2.8, 2.8);
                    // doc.addImage(webUrl, 'PNG', 42, 35, 2.8, 2.8);
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


        //Header1
        // const logoAndAddress = [
        //     [
        //         {
        //             content: `\n\nRDL Technologies Pvt Ltd.\nPlot No. 126, Road No 3, KIADB Industrial Estate, II Phase, Jigani Industrial Area, Jigani,Anekal Taluk, Bengaluru - 560 105`,
        //             colSpan: 3,
        //             styles: { halign: 'left', fontSize: 7.6, textColor: 'black', lineWidth: 0 }
        //         },
        //         {
        //             content: '',
        //             colSpan: 3,
        //             styles: { lineWidth: 0 }
        //         },
        //         {
        //             content: `\nISO 9001 : 2015\nISO 14001 : 2015\nOHSAS 18001 : 2007\n\n 080-27825249                          \nwww.mallikengineering.com\ninfo@mallikengineering.com`,
        //             colSpan: 2,
        //             styles: { halign: 'right', fontSize: 8, textColor: 'black', /*valign: 'top',*/ lineWidth: 0 }
        //         }
        //     ]
        // ];
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

        //Header3
        // const address = [
        //     invoiceFromateChanger === false ?
        //         [
        //             {
        //                 content: `Dispatch From:\n${data.invoice.dispatchFrom}`,
        //                 colSpan: 4,
        //                 styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal', lineWidth: 0.1, lineColor: '#000000' }
        //             },
        //             {
        //                 content: `IRN:${data?.invoice?.Irn ? data?.invoice?.Irn : ""}\nACK NO:${data?.invoice?.AckNo ? data?.invoice?.AckNo : ""}\nACK Date:${data?.invoice?.AckDt ? data?.invoice?.AckDt : ""}`,
        //                 colSpan: 4,
        //                 styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
        //             },
        //         ]
        //         :
        //         [
        //             {
        //                 content: `Dispatch From:\n${data.invoice.dispatchFrom}`,
        //                 colSpan: 4,
        //                 styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal', lineWidth: 0.1, lineColor: '#000000' }
        //             },
        //             data.invoice.invoiceGen === 0 ?
        //                 {
        //                     content: `CIN No   : U28112KA2013PTC068181\nPAN No  : AAICM4744Q\nGSTINO : 29AAICM4744Q1ZM`,
        //                     colSpan: 4,
        //                     styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
        //                 }
        //                 :
        //                 {
        //                     content: `IRN:${data?.invoice?.Irn}\nACK NO:${data?.invoice?.AckNo}\nACK Date:${data?.invoice?.AckDt}\n \nCIN No. U28112KA2013PTC068181\nPAN No.AAICM4744Q\nGSTINO. 29AAICM4744Q1ZM\nNo:2324006750`,
        //                     colSpan: 4,
        //                     styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
        //                 },
        //         ],
        //     [
        //         {
        //             content: `EwayBill No: ${data?.invoice?.EwbNo}`,
        //             colSpan: 4,
        //             styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //         {
        //             content: `EwayBill Date: ${data?.invoice?.EwbDt}`,
        //             colSpan: 4,
        //             styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //     ],
        //     [
        //         {
        //             content: `Bill To:\n${data.invoice.cName}\n${data.invoice.billAdd}Pan No: ${data.invoice.panNo}\nGST No: ${data.invoice.gstNo}\nPAN No: ${data.invoice.panNo}`,
        //             colSpan: 4,
        //             styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //         {
        //             content: `Ship To:\n${data.invoice.cName}\n${data.invoice.shipAdd}Pan No: ${data.invoice.panNo}\nGST No: ${data.invoice.gstNo}\nPAN No: ${data.invoice.panNo}`,
        //             colSpan: 4,
        //             styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //     ],
        //     [
        //         {
        //             content: `Place of Supply & State : ${data.invoice.city} ${data.invoice.state}`,
        //             colSpan: 4,
        //             styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //         {
        //             content: `State Code : ${data.invoice.stateCode}`,
        //             colSpan: 4,
        //             styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //     ]
        // ];
        const address = [
            // [
            //     {
            //         content: `Dispatch From:\n${data.invoice.dispatchFrom || ''}`,
            //         colSpan: 4,
            //         styles: {
            //             halign: 'left',
            //             valign: 'top',
            //             fontSize: 8,
            //             textColor: 'black',
            //             fontStyle: 'normal',
            //             lineWidth: 0.1,
            //             lineColor: '#000000'
            //         }
            //     },
            //     {
            //         content: `IRN:${data?.invoice?.Irn || ''}\nACK NO:${data?.invoice?.AckNo || ''}\nACK Date:${data?.invoice?.AckDt || ''}`,
            //         colSpan: 4,
            //         styles: {
            //             halign: 'left',
            //             valign: 'top',
            //             fontSize: 8,
            //             textColor: 'black',
            //             fontStyle: 'normal'
            //         }
            //     }
            // ],
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
                    content: `${data.invoice.dispatchFrom || ''}`,
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
                    content: `EwayBill No: ${data?.invoice?.EwbNo}`,
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
                    content: `EwayBill Date: ${data?.invoice?.EwbDt}`,
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
            //         content: `Bill To:\n${data.invoice.cName || ''}\n${data.invoice.billAdd || ''}\nGST No: ${data.invoice.gstNo || ''}\nPAN No: ${data.invoice.panNo || ''}`,
            //         colSpan: 4,
            //         styles: {
            //             halign: 'left',
            //             valign: 'top',
            //             fontSize: 8,
            //             textColor: 'black',
            //             fontStyle: 'normal',
            //             lineWidth: 0.1,
            //             lineColor: '#000000'
            //         }
            //     },
            //     {
            //         content: `Ship To:\n${data.invoice.cName || ''}\n${data.invoice.shipAdd || ''}\nGST No: ${data.invoice.gstNo || ''}\nPAN No: ${data.invoice.panNo || ''}`,
            //         colSpan: 4,
            //         styles: {
            //             halign: 'left',
            //             valign: 'top',
            //             fontSize: 8,
            //             textColor: 'black',
            //             fontStyle: 'normal',
            //             lineWidth: 0.1,
            //             lineColor: '#000000'
            //         }
            //     }
            // ],
            [
                {
                    content: "Bill To:", colSpan: 4,
                    styles: {
                        cellPadding: { top: -1, bottom: 0.25, left: 1, right: 1 },

                        halign: 'left', valign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'bold',
                    }
                },
                {
                    content: "Ship To:", colSpan: 4,
                    styles: {
                        cellPadding: { top: -1, bottom: 0.25, left: 1, right: 1 },
                        halign: 'left', valign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'bold',
                    }
                }
            ],
            [
                {
                    content: `${data.invoice.cName}`,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: 2, bottom: 0, left: 1, right: 1 },
                        halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold',
                    }
                },
                {
                    content: `${data.invoice.cName}`,
                    colSpan: 4,
                    styles: {
                        cellPadding: { top: 2, bottom: 0, left: 1, right: 1 },
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
                    content: `DC NO : ${data.invoice.dcNO}`,
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
            //         content: `CGST @ ${data.invoice.CGSTPer} % `,
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
            //     { content: ``, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
            //     {
            //         content: `SGST @ ${data.invoice.SGSTPer} %:`,
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
                { content: `Remarks: ${data.invoice.remarks || ''}`, colSpan: 5, rowSpan: 1, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
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
                { content: 'DC Details:', colSpan: 5, styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
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

        // const afterTotal = [
        //     [
        //         {
        //             content: `HSN Code: ${data?.items[0]?.hsnCode}`,
        //             colSpan: 2,
        //             styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //         {
        //             content: `Name of Commodities: PARTS OF LIFTS/ELEVATORS`,
        //             colSpan: 2,
        //             styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //     ],
        //     [
        //         {
        //             content: `Mode of Dispatch: ${data.invoice.modelOfDis}`,
        //             colSpan: 2,
        //             styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //         {
        //             content: `Whether tax payable of reverse charge basis: NO`,
        //             colSpan: 2,
        //             styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //     ],
        // ];

        // const remarks = [
        //     [
        //         {
        //             content: `Remarks: ${data.invoice.remarks}`,
        //             colSpan: 8,
        //             styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //     ],
        // ];

        // const lastDetails = [
        //     [
        //         {
        //             content: 'Certified that the particulars given above are true and correct and the amount indicated represents the price actually charged and that there is no flow of additional consideration directly or indirectly from the buyer\n\n\n\nE.&.O.E.' + ' '.repeat(55) + 'Subject to Bengaluru Jurisdiction',
        //             colSpan: 4,
        //             styles: {
        //                 halign: 'left',
        //                 fontSize: 8,
        //                 textColor: 'black',
        //                 lineWidth: 0.1,
        //                 lineColor: '#000000'
        //             }
        //         },
        //         data.invoice.invoiceGen === 0 ?
        //             {
        //                 content: 'For RDL Technologies Pvt Ltd.\n\n\nAuthorised Signatory\nSignature of the Licences or his Authorised Agent',
        //                 colSpan: 4,
        //                 styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
        //             }
        //             :
        //             {
        //                 content: 'For RDL Technologies Pvt Ltd.\n\nE-Invoice generated with QR Code & IRN number,\nNo signature required\n\nAuthorised Signatory\nSignature of the Licences or his Authorised Agent',
        //                 colSpan: 4,
        //                 styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
        //             }
        //     ]
        //     // [
        //     //     {
        //     //         content: 'Subject to Bengaluru Jurisdiction',
        //     //         colSpan: 8,
        //     //         styles: { halign: 'center', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
        //     //     }
        //     // ]
        // ];
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
            // ...tableOptions,
            lineWidth: 0.1,
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

        // doc.autoTable({
        //     body: items,
        //     tableLineColor: [0, 0, 0],
        //     ...tableOptions,
        //     bodyStyles: {
        //         minCellHeight: 5,
        //         cellPadding: 1,
        //         textColor: 'black',
        //         fillColor: null, // No background color
        //         lineWidth: 0.25,    // No cell border line width
        //         lineColor: 'black' // No cell border line color
        //     },

        //     tableLineWidth: 0.25,
        //     theme: 'grid',
        //     styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
        //     startY: doc.lastAutoTable.finalY,
        //     margin: { left: 10, right: 10 }
        // });

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

        // doc.autoTable({
        //     head: afterTotal,
        //     tableLineColor: [0, 0, 0],
        //     bodyStyles: { minCellHeight: 5, cellPadding: 1 },
        //     tableLineWidth: 0.25,
        //     theme: 'grid',
        //     styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
        //     startY: doc.lastAutoTable.finalY,
        //     margin: { left: 10, right: 10 }
        // });

        // doc.autoTable({
        //     head: remarks,
        //     tableLineColor: [0, 0, 0],
        //     bodyStyles: { minCellHeight: 5, cellPadding: 1 },
        //     tableLineWidth: 0.25,
        //     theme: 'grid',
        //     styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
        //     startY: doc.lastAutoTable.finalY,
        //     margin: { left: 10, right: 10 }
        // });

        // doc.autoTable({
        //     body: lastDetails,
        //     tableLineColor: [0, 0, 0],
        //     bodyStyles: { minCellHeight: 5, cellPadding: 1 },
        //     tableLineWidth: 0.25,
        //     theme: 'grid',
        //     styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
        //     startY: doc.lastAutoTable.finalY,
        //     margin: { left: 10, right: 10 }
        // });

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
        // const outerText = 'Regd. & Corporate Office: No.380A, 5th Main, Bilekahalli, Vijaya Bank Layout, Off. Bannergatta Road, Bangalore 560 076';
        // const pageWidth = doc.internal.pageSize.width;
        // const margin = 10; // margin from the bottom of the page
        // const textWidth = pageWidth - 2 * margin; // Max width for the text

        // doc.autoTable({
        //     startY: doc.internal.pageSize.height - margin - 9, // Start position of the footer
        //     body: [[outerText]],
        //     styles: { align: 'left', fontSize: 8 }, // Text styles
        //     margin: { bottom: margin },
        //     theme: 'plain', // No default background
        // });


        // doc.save('Tax invoice.pdf');
        // const pdfBlob = doc.output('blob');
        // const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        // setPdfUrl(pdfBlobUrl);

        // PAGE NUMBER
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
            <Button style={{ color: '#ffffff', cursor: 'pointer' }}
                // onClick={handleGSTLabInvoice}
                onClick={() => {
                    handleGSTLabInvoice();
                    setPdfModalOpen(true);
                }}
            >
                E-Inv
            </Button>
            {/* <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
                <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>E-Invoice</DialogTitle>

                <DialogContent style={{ padding: '2px' }}>
                    {pdfUrl &&
                        <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
                    }
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setPdfModalOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog> */}
            <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
                <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    E-Invoice
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
export default EInvoicePdf;
