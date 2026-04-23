import React from "react";
import "./Pdf.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useState } from "react";
import { Button } from "@mui/material";
import { useEffect } from "react";
import PrintIcon from '@mui/icons-material/Print';
import { GstInvLabPdf, LabourChargeInvoicePdf } from "../../../ApiService/LoginPageService";

const TaxInvoicepdf = (props) => {
    const { rowData } = props;
    const [rows, setRows] = useState('');
    const [jsonrows, setjsonRows] = useState([]);


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

    const handlePdfInvSucess = (dataObject) => {
        handleFileSave(dataObject?.data || []);
        setjsonRows(dataObject?.data || [])
    }

    const handePdfInvException = (errorStatus, errorMessage) => {
        console.log(errorMessage);
    }



    const handleFileSave = (data) => {
        let info = []
        data.items.forEach((element, index, array) => {
            // info.push([element.id])
        });
        const doc = new jsPDF();
        const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
        // console.log("baseUrl------------------>>>>>>>>>>>>>>", baseUrl);
        // const logoUrl = (await import('../../AllImage/RDL_Logo.png')).default;
        const logoUrl = `${baseUrl}/${data.invoice.companyImage}`
        const ISOUrl = require('../../../AllImage/ISOlogo.png');

        const tableOptions = {
            didDrawPage: (HookData) => {
                if (HookData.pageNumber === 1) {
                    // Add an image on the first page L,Top/bottom, widht,height
                    doc.addImage(logoUrl, 'PNG', 26, 18, 28, 20);
                    doc.addImage(ISOUrl, 'PNG', 170, 18, 20, 10);
                }
            },
        };

        //Header1
        const logoAndAddress = [
            [
                {
                    content: 'ORIGINAL FOR RECIPIENT',
                    colSpan: 8,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0 }
                }
            ],
            [
                {
                    content: 'TAX INVOICE',
                    colSpan: 8,
                    styles: { halign: 'center', fontSize: 10, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold', fillColor: '#CCCCCC' }
                },
            ],
            [
                {
                    content: {
                        image: logoUrl,
                        width: 30, // adjust the width as needed
                        height: 30, // adjust the height as needed
                    },
                    colSpan: 2
                },
                {
                    content: `${data.invoice.companyName}\n${data.invoice.companyAdd}. Tel:${data.invoice.telNo}\nWeb Site :${data.invoice.website}\nEmail : ${data.invoice.email}`,
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'ISO 9001 : 2015\nISO 14001 : 2015\nOHSAS 18001 : 2007',
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', valign: 'bottom' }
                }
            ]
        ];

        //Header2
        const pan = [[
            {
                content: `CIN No. ${data.invoice.cmpCinNo}`,
                colSpan: 2,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: `PAN No.${data.invoice.cmpPanNo}`,
                colSpan: 2,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: `GSTINO. ${data.invoice.cmpGstNo}`,
                colSpan: 2,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: 'No:2324006750',
                colSpan: 2,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
            }
        ]];

        //Header3
        const address = [
            [
                {
                    content: 'Dispatch From :\nM/s. OTIS Elevator Company (India) ltd\nNO. 92, KIADB INDL. ESTATE,\nPHASE II, JIGANI INDL. AREA,\nANEKAL TALUK',
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },

                {
                    content: 'IRN:96a44fa78c60ee8b7a3ea5c600459a378655b2223bb631cbfa5f6ff03dd2dd21\nACK NO:112316452822878\nACK Date:2023-06-07 11:47:00',
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    // content: 'Bill To:\nOTIS Elevator Company (India) ltd\nNO. 92, KIADB INDL. ESTATE,\nPHASE II, JIGANI INDL. AREA,\nANEKAL TALUK\nBangalore 560105 Karnataka\nPAN No.:AAACO0481E\nGSTIN No:29AAACO0481E2ZM',
                    content: `Bill To:\n${data.invoice.billAdd}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: 'Ship To :\nOTIS Elevator Company (India) ltd\nNO. 92, KIADB INDL. ESTATE,\nPHASE II, JIGANI INDL. AREA,\nANEKAL TALUK\nBangalore 560105 Karnataka\nPAN No.:AAACO0481E\nGSTIN No:29AAACO0481E2ZM',
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: `Place of Supply & State : ${data.invoice.add1} ${data.invoice.add3}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: `State Code : ${data.invoice.stateCode}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ]
        ];

        //Header4
        const firstHeaderRow = [
            [
                {
                    content: `INVOICE NO: ${data.invoice.invNo}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `PO NO:${data.invoice.invNo}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `DC NO : ${data.invoice.dcNO}`,
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `Terms of Payment :${data.invoice.dcNO}`,
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                }
            ],
            [
                {
                    content: `Date: ${data.invoice.date}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'Date: ',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'Date:',
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: `Vehicle No: ${data.invoice.vechileNO}`,
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                }
            ],
        ];

        //Columns
        const secondHeaderRow = [['SI No', 'Description & Specification of Goods', 'HSN/SAC Code', 'No.&Desc of Pckgs', 'Total Qty of Goods (Net)', 'UOM', 'Rate / Unit', 'Value Of Goods']];

        const headerRows = [...logoAndAddress, ...pan, ...address, ...firstHeaderRow, ...secondHeaderRow];

        //Header5
        const totalRow = [
            [
                {
                    content: 'LABOUR CHARGES ONLY',
                    colSpan: 4,
                    rowSpan: 1,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }

                },
                {
                    content: 'Total Qty',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: ' 192.00',
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },
            ],
            [
                {
                    content: '',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'Taxable Value for GST Payable:',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: '2,918.40 ',
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },

            ],
            [
                {
                    content: '',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'SGST @ 6.00 % ',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: '175.10',
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },

            ],
            [
                {
                    content: '',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'Total Value ',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: '3,268.60',
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },
            ],
            [
                {
                    content: '',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'Round Off ',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: '0.40',
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },

            ],
            [
                {
                    content: 'Grand Total In Words: Rupees Three Thousand Two Hundred Sixty Nine Only',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'Grand Total',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: '3,269.00',
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black' }
                },
            ],
        ];

        //Header6
        const totalWords = [
            [
                {
                    content: `Date of Issue of Invoice : ${data.invoice.invoIssuDate}`,
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: 'Name of Commodities : LABOUR CHARGES',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8 }
                },

            ],
            [
                {
                    content: 'Mode of Dispatch :By Road',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: 'Whether tax payable of Reverse Charge basis: NO',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8 }
                },

            ],
            [
                {
                    content: 'Remarks:',
                    colSpan: 8,
                    styles: { halign: 'left', fontSize: 8 }
                },

            ],
            [
                {
                    content: 'Certified that the particulars given below are true and correct and the amount indicated represents the price actually charged and that there is no flow of additional consideration directly or indirectly from the buyer',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8 }
                },
                {
                    content: 'For RDL Technologies Pvt Ltd.\nSignature not verified\nDigitally Signed By:\nAuthorised Signatory\nSignature of the Licences or his Authorised Agent',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8 }
                },
            ],
        ];

        //Header7
        const termsAndSuppluColumn = [
            [
                {
                    content: `Receiver's Signature`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom' }
                },
                {
                    content: 'Prepared By ',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom' }
                },
                {
                    content: 'Reviewed By',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', valign: 'bottom' }
                },
                {
                    content: 'For RDL Technologies Pvt Ltd.\nSignature Not Verified.\nDigitally Signed By: \nDate: 11/03/2024\nAuthorized Signatory',
                    colSpan: 4,
                    // rowSpan:6,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                }
            ],
        ]

        //Table Border lines
        const outerTable = [
            [
                {
                    content: 'Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076',
                    colSpan: 10,
                    styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', lineWidth: 0 }
                },
            ],

        ];

        const bodyRows = [...info, ...totalRow, ...totalWords, ...termsAndSuppluColumn,]
        const footRows = [...outerTable]

        doc.autoTable({
            theme: 'striped',
            head: headerRows,
            body: bodyRows,
            foot: footRows,
            showHead: 'firstPage',
            showFoot: 'lastPage',
            startY: 2,
            ...tableOptions,
            // startY: 0,
            // pageBreak: 'avoid',
            // rowPageBreak: 'avoid',
            // tableWidth: 'auto',
            headStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0], // Header text color
                halign: 'center', // Header text alignment
                valign: 'middle', // Vertical alignment
                lineWidth: 0.1, // Border width
                lineColor: [0, 0, 0], // Border color,
                font: 'times',
            },
            bodyStyles: {
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

        doc.save('Labour Charge.pdf');
    }


    return (
        <>
            <PrintIcon style={{ color: '#002D68', cursor: 'pointer' }}
                onClick={handleGSTLabInvoice}
            />
        </>
    )
}
export default TaxInvoicepdf;
