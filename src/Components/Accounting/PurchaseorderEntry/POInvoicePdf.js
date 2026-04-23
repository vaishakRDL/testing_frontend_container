import React from "react";
import "./Pdf.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { PoInvPdf } from "../../../ApiService/LoginPageService";
import { useEffect } from "react";
import { useState } from "react";

const POInvoicePdf = (props) => {
    const { rowData } = props;
    const [rows, setRows] = useState('');
    const [jsonrows, setjsonRows] = useState([]);
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

    // let info = []

    // testData.forEach((element, index, array) => {
    //     info.push([element.id, element.name, element.age, element.city, element.state, element.region, element.sex])
    // });


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



    const objectToXml = (obj) => {
        let xml = '';
        for (let key in obj) {
            xml += `\t\t\t\t\t\t\t<${key}>${obj[key]}</${key}>\n`;
        }
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



    const handlePOInvoice = () => {
        PoInvPdf({ id: rowData.id }, handlePdfInvSucess, handePdfInvException)
    }

    const handlePdfInvSucess = (dataObject) => {
        setjsonRows(dataObject?.data || [])

        handleFileSave(dataObject?.data || []);

    }


    const handePdfInvException = (errorStatus, errorMessage) => {
        console.log(errorMessage);
    }

    const handleFileSave = (data) => {
        let info = []

        data.items.forEach((element, index, array) => {
            info.push([element.id, element.PartNo, element.hsnCode, element.description, element.UOM, element.Qty, element.Rate, element.Amt])
        });


        const doc = new jsPDF('p', 'mm', 'a4');

        const tableOptions = {

        };

        //Header1
        const logoAndAddress = [
            [
                {
                    content: 'Page 1',
                    colSpan: 10,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0 }
                }
            ],
            [
                {
                    content: data.invoice.cName,
                    colSpan: 10,
                    styles: { halign: 'center', fontSize: 12, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                },

            ],
            [
                {
                    content: 'CIN:U29150MH1953PLC009158|PAN:AAACO0481E',
                    colSpan: 10,
                    styles: { halign: 'center', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'PURCHASE ORDER',
                    colSpan: 8,
                    rowSpan: 5,
                    styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold', valign: 'top' }
                },
                {
                    content: 'Order No:',
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 6 }
                },
                {
                    content: '87016456',
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 6, textColor: 'black' }
                },

            ],
            [

                {
                    content: 'Order Type:',
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 6 }
                },
                {
                    content: 'OP',
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 6, textColor: 'black' }
                },

            ],
            [
                {
                    content: 'Date Opened:',
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 6 }
                },
                {
                    content: '24/05/2023',
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 6, textColor: 'black' }
                },
            ],
            [

                {
                    content: 'Requested Date:',
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 6 }
                },
                {
                    content: '23/06/2023',
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 6, textColor: 'black' }
                },
            ],
            [
                {
                    content: 'Valid Upto:',
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 6 }
                },
                {
                    content: '24/11/2023',
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 6, textColor: 'black' }
                },
            ],

        ];

        //Header2
        const pan = [
            [
                {
                    content: 'Vendor code: 33052781',
                    colSpan: 8,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },

                {
                    content: 'Job/Contract Description: Purchase Order',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'Vendor Name: MALLIK ENGINEERING(INDIA)PRIVATE LIMITED',
                    colSpan: 8,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },

                {
                    content: `Payment Terms: ${data.invoice.pay_term}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'Vendor Address:NO 126, ROAD NO 3,\n2ND PHASE, JIGANI INDUSTRIAL AREA\nJIGANI, ANEKAL TALUQ\nBANGALORE - 560105\nBANGALORE',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: `Billing Address:${data.invoice.billAdd}`,
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: 'Supplier SO:',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal', valign: 'top' }
                },
            ],
            [
                {
                    content: 'Postal code :560105',
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: 'Postal Code: 560105',
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'State – State Code Karnataka 29',
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: 'State – State Code Karnataka 29',
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'GST Number: 29AAICM4744Q1ZM',
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: 'GST Number: 29AAACO0481E2ZM',
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'Building Name: ',
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: 'Job/Contract No. ',
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'Delivery/Work At: OTIS ELEVATOR COMPANY (INDIA) LTD\nNO. 92, KIADB INDL. ESTATE,\nPHASE II, JIGANI INDL. AREA,\nANEKAL TALUK\nBangalore ',
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: 'XR/T NUMBER\nSHIPPING MODE\nSHIPPING DETAILS\nUNIT NUMBER\n',
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'Postal Code 560105 ',
                    colSpan: 10,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'State – State Code Karnataka 29 ',
                    colSpan: 10,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'GST Number: 29AAACO0481E2ZM ',
                    colSpan: 10,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: 'PAN Number: AAACO0481E',
                    colSpan: 10,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ],

        ];

        //Columns
        const secondHeaderRow = [['SI No', 'Part Number', 'HSN Code', 'Description', 'UOM', 'Quantity', 'Rate', 'Price ', 'Currency ', 'Delivery Date']];

        const headerRows = [...logoAndAddress, ...pan, ...secondHeaderRow];

        //Header3
        const totalRow = [
            [

                {
                    content: `Total Qty:${data.invoice.TotalQty}`,
                    colSpan: 10,
                    styles: { halign: 'right', fontSize: 10, textColor: 'black' }
                },
            ],
            [
                {
                    content: `Grand Total:${data.invoice.GrossAmt}`,
                    colSpan: 10,
                    styles: { halign: 'right', fontSize: 10, textColor: 'black' }
                },

            ],
            [
                {
                    content: 'Great Grand Total 335061.76',
                    colSpan: 10,
                    styles: { halign: 'right', fontSize: 10, textColor: 'black' }
                },

            ],
        ];

        //Header4
        const termsAndSuppluColumn = [
            [
                {
                    content: `Requisition No.:`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black', valign: 'bottom' }
                },
                {
                    content: 'Requisition Type:',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black', valign: 'bottom' }
                },
                {
                    content: 'Initiator Name: ',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black', valign: 'bottom' }
                },
                {
                    content: 'Requested By:',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black' }
                },
                {
                    content: 'Buyer Name:',
                    colSpan: 2,
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

        const bodyRows = [...info, ...totalRow, ...termsAndSuppluColumn,]
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

        doc.save('Purchase Order.pdf');
    }



    return (
        <>
            {/* <FileDownloadIcon style={{ color: '#002D68', cursor: 'pointer' }} 
                onClick={handlePOInvoice}
            /> */}
        </>
    )
}
export default POInvoicePdf;
