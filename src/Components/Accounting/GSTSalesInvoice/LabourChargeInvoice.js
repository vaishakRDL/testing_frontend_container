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

const LabourChargeInvoice = (props) => {
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
                // { content: " ", styles: { textColor: "black", fillColor: null } },
                // { content: " ", styles: { textColor: "black", fillColor: null } },
                // { content: " ", styles: { textColor: "black", fillColor: null } },
                // { content: " ", styles: { textColor: "black", fillColor: null } },
                { content: " ", styles: { textColor: "black", fillColor: null } },];
            info.push(emptyRow);
        }

        const doc = new jsPDF();
        const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
        // console.log("baseUrl------------------>>>>>>>>>>>>>>", baseUrl);
        // const logoUrl = (await import('../../AllImage/RDL_Logo.png')).default;
        const logoUrl = `${baseUrl}/${data.invoice?.companyImage}`
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
                        content: 'LABOUR CHARGES TAX INVOICE',
                        colSpan: 8,
                        styles: { halign: 'center', fontSize: 10, textColor: '#ffffff', fontStyle: 'bold', fontWeight: 'bold', fillColor: '#4D55CC', lineWidth: 0 }
                    },
                ],
            ]
            :
            [
                [
                    {
                        content: 'LABOUR CHARGES TAX INVOICE',
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
        //             styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //         {
        //             content: `EwayBill Date: ${data?.invoice?.EwbDt}`,
        //             colSpan: 4,
        //             styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
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
        //             styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //         {
        //             content: `State Code : ${data.invoice.stateCode}`,
        //             colSpan: 4,
        //             styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
        //         },
        //     ]
        // ];
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

        //Header4
        const firstHeaderRow = [
            [
                {
                    content: `INVOICE NO: ${data.invoice.invNo}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' }
                },
                data.invoice.allPoSame === true ?
                    {
                        content: `PO No: ${data.invoice.poNo}`,
                        colSpan: 2,
                        styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' }
                    }
                    :
                    {
                        content: `PO No: `,
                        colSpan: 2,
                        styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' }
                    },
                {
                    content: `DC NO : ${data.invoice.customerDcNo || ""}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' }
                },
                {
                    content: `Terms of Payment : 30 Days`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' }
                },
            ],
            [
                {
                    content: `Date: ${data.invoice.date}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' }
                },
                data.invoice.allPoSame === true ?
                    {
                        content: `PO Date: ${data.invoice.poDate}`,
                        colSpan: 2,
                        styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' }
                    }
                    :
                    {
                        content: `PO Date: `,
                        colSpan: 2,
                        styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' }
                    },
                {
                    content: `Dc Date: ${data.invoice.customerDcDate || ''}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' }
                },
                {
                    content: `Vehicle No: ${data.invoice.vechileNO}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' }
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
                { content: `Whether tax payable of reverse charge basis: NO`, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
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
            // ...(parseFloat(data.invoice.IGSTPer) > 0 ? [[
            //     { content: ``, colSpan: 5, styles: { halign: 'left', fontSize: 8, lineWidth: 0.1, lineColor: '#000000' } },
            //     {
            //         content: `IGST @ ${data.invoice.IGSTPer} %`,
            //         colSpan: 2,
            //         styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
            //     },
            //     {
            //         content: `${Number(data.invoice.IGST || 0).toLocaleString('en-IN')}`,
            //         colSpan: 2,
            //         styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
            //     }
            // ]] : []),
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
            //     { content: `Whether tax payable of reverse charge basis: NO`, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
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
                { content: `Remarks: ${data.invoice.remarks}`, colSpan: 5, rowSpan: 1, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
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
                { content: `DC Details: ${data.invoice.dcDetails}`, colSpan: 5, styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
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
        //             content: 'Certified that the particulars given above are true and correct and the amount indicated represents the price actually charged and that there is no flow of additional consideration directly or indirectly from the buyer',
        //             colSpan: 4,
        //             styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
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
        // ];

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

        // doc.autoTable({
        //     head: address,
        //     tableLineColor: [0, 0, 0],
        //     bodyStyles: { minCellHeight: 5, cellPadding: 1 },
        //     tableLineWidth: 0.25,
        //     theme: 'grid',
        //     styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
        //     startY: doc.lastAutoTable.finalY,
        //     margin: { left: 10, right: 10 },
        // });
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

                // ✅ Force-bold the customer name row (index 4) for both columns
                // Row order in `address`: [labels],[data],[eway],[label BT/ST],[names],[addresses],[place/state]
                if (data.row && data.row.index === 4) {
                    const text = (cell && typeof cell.raw === 'string') ? cell.raw : '';
                    if (text) {
                        const lineY = y + 3.6; // baseline for one-line text
                        const textX = x + 2;
                        doc.setFont('times', 'bold');
                        doc.setFontSize(8);
                        doc.text(text, textX, lineY);
                        doc.setFont('times', 'normal');
                    }
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
            <PrintIcon style={{ color: '#ffffff', cursor: 'pointer' }}
                // onClick={handleGSTLabInvoice}
                onClick={() => {
                    handleGSTLabInvoice();
                    setPdfModalOpen(true);
                }}
            />
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
                    Labour Charge Invoice
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
export default LabourChargeInvoice;
