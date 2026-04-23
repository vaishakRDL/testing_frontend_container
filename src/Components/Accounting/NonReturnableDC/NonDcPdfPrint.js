import React from "react";
import "./Pdf.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useEffect } from "react";
import { useState } from "react";

const NonDcPdfPrint = () => {
    const testData = [
        {
            id: 1,
            name: "John Doe",
            age: 25,
            city: "New York",
            state: "NY",
            region: "Northeast",
            sex: "Male"
        },
        {
            id: 2,
            name: "Alice Smith",
            age: 30,
            city: "Los Angeles",
            state: "CA",
            region: "West",
            sex: "Female"
        },
        {
            id: 3,
            name: "Bob Johnson",
            age: 22,
            city: "Chicago",
            state: "IL",
            region: "Midwest",
            sex: "Male"
        },
        {
            id: 4,
            name: "Sarah Williams",
            age: 28,
            city: "Houston",
            state: "TX",
            region: "South",
            sex: "Female"
        },
        {
            id: 5,
            name: "Michael Brown",
            age: 35,
            city: "Miami",
            state: "FL",
            region: "South",
            sex: "Male"
        },
        {
            id: 6,
            name: "Emma Davis",
            age: 27,
            city: "San Francisco",
            state: "CA",
            region: "West",
            sex: "Female"
        },
        {
            id: 7,
            name: "David Lee",
            age: 24,
            city: "Boston",
            state: "MA",
            region: "Northeast",
            sex: "Male"
        },
        {
            id: 8,
            name: "Olivia Rodriguez",
            age: 29,
            city: "Seattle",
            state: "WA",
            region: "West",
            sex: "Female"
        }
    ];

    const [jsonrows, setjsonRows] = useState([]);
    useEffect(() => {
        const xmlData = jsonToXml(jsonrows); // Assuming you want to convert only the first item
        downloadXmlFile(xmlData);
    }, [jsonrows])

    const jsonToXml = (json) => {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<ENVELOPE>\n';
        xml += '\t<HEADER>\n';
        xml += '\t\t<TALLYREQUEST>Import Data</TALLYREQUEST>\n';
        xml += '\t</HEADER>\n';
        xml += '\t<BODY>\n';
        xml += '\t\t<IMPORTDATA>\n';
        xml += '\t\t\t<REQUESTDESC>\n';
        xml += '\t\t\t\t<STATICVARIABLES>\n';
        xml += '\t\t\t\t</STATICVARIABLES>\n';
        xml += '\t\t\t</REQUESTDESC>\n';
        xml += '\t\t\t<REQUESTDATA>\n';
        xml += '\t\t\t\t<TALLYMESSAGE>\n';
        xml += '\t\t\t\t\t<VOUCHER>\n';

        // Insert invoice details
        for (let key in json.invoice) {
            xml += `\t\t\t\t\t\t<${key.toUpperCase()}>${typeof json.invoice[key] === 'string' ? json.invoice[key].toUpperCase() : json.invoice[key]}</${key.toUpperCase()}>\n`;
        }

        // Insert item details
        if (json.items && Array.isArray(json.items)) {
            xml += '\t\t\t\t\t\t<ITEMS>\n';
            json.items.forEach((item, index) => {
                xml += `\t\t\t\t\t\t\t<ITEM_${index}>\n`;
                for (let key in item) {
                    xml += `\t\t\t\t\t\t\t\t<${key.toUpperCase()}>${typeof item[key] === 'string' ? item[key].toUpperCase() : item[key]}</${key.toUpperCase()}>\n`;
                }
                xml += `\t\t\t\t\t\t\t</ITEM_${index}>\n`;
            });
            xml += '\t\t\t\t\t\t</ITEMS>\n';
        }

        xml += '\t\t\t\t\t</VOUCHER>\n';
        xml += '\t\t\t\t</TALLYMESSAGE>\n';
        xml += '\t\t\t</REQUESTDATA>\n';
        xml += '\t\t</IMPORTDATA>\n';
        xml += '\t</BODY>\n';
        xml += '</ENVELOPE>';

        return xml;
    };

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

    const objectToXml = (obj) => {
        let xml = '';
        for (let key in obj) {
            xml += `\t\t\t\t\t\t\t<${key}>${obj[key]}</${key}>\n`;
        }
        return xml;
    };

    let info = []

    testData.forEach((element, index, array) => {
        info.push([element.id, element.name, element.age, element.city, element.state, element.region, element.sex])
    });

    const handleFileSave = () => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const logoUrl = require('../../../AllImage/RDL_Logo.png');
        const ISOUrl = require('../../../AllImage/ISOlogo.png');

        //Image 
        const tableOptions = {
            didDrawPage: (HookData) => {
                if (HookData.pageNumber === 1) {
                    doc.addImage(logoUrl, 'PNG', 18, 13, 28, 20);
                    doc.addImage(ISOUrl, 'PNG', 170, 13, 20, 10);
                }
            },
        };

        //Header1
        const logoAndAddress = [
            [
                {
                    content: 'ORIGINAL FOR CONSIGNEE',
                    colSpan: 10,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0 }
                }
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
                    content: 'RDL Technologies Pvt Ltd.\nPlot No. 126, Road No 3, KIADB Industrial Estate\nII Phase, Jigani Industrial Area, Jigani,Anekal Taluk,\nBengaluru - 560 105. Tel:080-27825249\nWeb Site :www.mallikengineering.com\nEmail : info@mallikengineering.com',
                    colSpan: 6,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black' }
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
                content: 'CIN No. U28112KA2013PTC068181',
                colSpan: 3,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: 'PAN No.AAICM4744Q',
                colSpan: 2,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: 'GSTINO. 29AAICM4744Q1ZM',
                colSpan: 4,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: 'No: 23/NR/00063',
                colSpan: 1,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
            }
        ]];

        //Header3
        const poHeader = [[{ content: 'NON RETURNABLE DELIVERY CHALLAN', colSpan: 10, styles: { textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' } }]];

        //Header4
        const address = [
            [
                {
                    content: 'To: \nM/s. OTIS Elevator Company (India) ltd\nNO. 92, KIADB INDL. ESTATE,\nPHASE II, JIGANI INDL. AREA,\nANEKAL TALUK,\nPAN No: AAACO0481E\nGST No: 29AAACO0481E2ZM',
                    colSpan: 5,
                    styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
                },

                {
                    content: 'Ship To:\nOTIS Elevator Company (India) ltd\nNO. 92, KIADB INDL. ESTATE,\nPHASE II, JIGANI INDL. AREA,\nANEKAL TALUK\nBangalore-560105\nPAN No: AAACO0481E\nGST No: 29AAACO0481E2ZM',
                    colSpan: 5,
                    styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: `Place of Supply & State : ${"Bangalore Karnataka"}`,
                    colSpan: 5,
                    styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: ``,
                    colSpan: 5,
                    styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
                },
            ]
        ];

        //Header5
        const firstHeaderRow = [
            [
                {
                    content: 'NRDC NO: 23/NR/00063',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                },
                {
                    content: 'Challan No: ',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                },
                {
                    content: 'Vehicle No:',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                }
            ],
            [
                {
                    content: 'NRDC NO: 23/NR/00063',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                },
                {
                    content: 'Challan No: ',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                },
                {
                    content: 'Vehicle No:',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                }
            ],
        ];

        //Columns
        const secondHeaderRow = [['SI No', 'Part Name', 'Part Description ', 'HSN /SAC', 'DC No', 'Invoice No', 'UOM', 'Qty', 'Rate', 'Amount']];

        const headerRows = [...logoAndAddress, ...pan, ...poHeader, ...address, ...firstHeaderRow, ...secondHeaderRow];

        //Header6
        const totalRow = [
            [
                {
                    content: '"Subject to Bengaluru Jurisdiction"',
                    colSpan: 5,
                    rowSpan: 1,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black' }
                },
                {
                    content: 'Total Qty: 4.00',
                    colSpan: 5,
                    styles: { halign: 'right', fontSize: 10, textColor: 'black' }
                },
            ],
            [
                {
                    content: 'Total:15,021.48 ',
                    colSpan: 10,
                    styles: { halign: 'right', fontSize: 10, textColor: 'black' }
                },

            ],
            [
                {
                    content: 'Total Value:  15,021.00',
                    colSpan: 10,
                    styles: { halign: 'right', fontSize: 10, textColor: 'black' }
                },

            ],
        ];

        //Header7
        const totalWords = [[
            {
                content: 'Remarks :RETURN AFTER JOBWORK - INV# 2324006463;',
                colSpan: 10,
                styles: { halign: 'left', fontSize: 10 }
            },
        ]];

        //Header8
        const termsAndSuppluColumn = [
            [
                {
                    content: `Receiver's Signature`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black', valign: 'bottom' }
                },
                {
                    content: 'Prepared By ',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black', valign: 'bottom' }
                },
                {
                    content: 'Reviewed By',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black', valign: 'bottom' }
                },
                {
                    content: 'For RDL Technologies Pvt Ltd.\nSignature Not Verified.\nDigitally Signed By: \nDate: 11/03/2024\nAuthorized Signatory',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black' }
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
            startY: 4,
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

        doc.save('Non Returnable DC.pdf');
    }

    return (
        <>
            <FileDownloadIcon style={{ color: '#002D68', cursor: 'pointer' }}
                onClick={handleFileSave}
            />
        </>
    )
}
export default NonDcPdfPrint;
