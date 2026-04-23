import React from "react";
import "./Pdf.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { GstInvLabPdf, GstInvxml } from "../../../ApiService/LoginPageService";
import { useState } from "react";
import { Button } from "@mui/material";
import { useEffect } from "react";

const GSTLabTaxInv = (props) => {
    const { rowData } = props;
    const [rows, setRows] = useState('');
    const [jsonrows, setjsonRows] = useState([]);

    useEffect(() => {
        console.log("jsondata4444444444444444 =========== =====", jsonrows);
        if (jsonrows) {
            const xmlData = jsonToXml(jsonrows); // Assuming you want to convert only the first item
            downloadXmlFile(xmlData);
        }
    }, [jsonrows]);

    const jsonToXml = (json) => {
        // Check if json is undefined
        if (!json) {
            throw new Error('The json parameter is undefined.');
        }

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
        xml += '\t\t\t\t<TALLYMESSAGE xmlns:UDF="TallyUDF">\n';
        xml += '\t\t\t\t\t<VOUCHER REMOTEID="GSTSalesInvoice_29Apr2024_2704241004" VCHTYPE="SALES" ACTION="Create">\n';
        xml += '\t\t\t\t\t\t<OLDAUDITENTRYIDS.LIST TYPE="Number">\n';
        xml += '\t\t\t\t\t\t\t<OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>\n';
        xml += '\t\t\t\t\t\t</OLDAUDITENTRYIDS.LIST>\n';
        xml += '\t\t\t\t\t\t<DATE>20240429</DATE>\n';
        xml += '\t\t\t\t\t\t<REFERENCEDATE>29/04/2024</REFERENCEDATE>\n';
        xml += '\t\t\t\t\t\t<GUID>GSTSalesInvoice_29Apr2024_2704241004</GUID>\n';
        xml += '\t\t\t\t\t\t<VOUCHERTYPENAME>SALES</VOUCHERTYPENAME>\n';
        xml += '\t\t\t\t\t\t<NARRATION>OP89210285;24/04/2024:,HAA339R1-SEL-18.00,</NARRATION>\n';
        xml += '\t\t\t\t\t\t<PARTYLEDGERNAME>SALZ2</PARTYLEDGERNAME>\n';
        xml += '\t\t\t\t\t\t<REFERENCE>2704241004/29.04.2024</REFERENCE>\n';
        xml += '\t\t\t\t\t\t<VOUCHERNUMBER>2704241004</VOUCHERNUMBER>\n';
        xml += '\t\t\t\t\t\t<DIFFACTUALQTY>No</DIFFACTUALQTY>\n';
        xml += '\t\t\t\t\t\t<ISOPTIONAL>No</ISOPTIONAL>\n';
        xml += '\t\t\t\t\t\t<EFFECTIVEDATE>20240429</EFFECTIVEDATE>\n';
        xml += '\t\t\t\t\t\t<ISCANCELLED>No</ISCANCELLED>\n';
        xml += '\t\t\t\t\t\t<USETRACKINGNUMBER>No</USETRACKINGNUMBER>\n';
        xml += '\t\t\t\t\t\t<ISINVOICE>No</ISINVOICE>\n';
        xml += '\t\t\t\t\t\t<ISGSTOVERRIDDEN>Yes</ISGSTOVERRIDDEN>\n';
        xml += '\t\t\t\t\t\t<BASICORDERREF/>\n';


        xml += '\t\t\t\t\t\t<ALLLEDGERENTRIES.LIST>\n';
        xml += '\t\t\t\t\t\t\t<OLDAUDITENTRYIDS.LIST TYPE="Number">\n';
        xml += '\t\t\t\t\t\t\t\t<OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>\n';
        xml += '\t\t\t\t\t\t\t</OLDAUDITENTRYIDS.LIST>\n';
        xml += '\t\t\t\t\t\t\t<LEDGERNAME>SALZ2</LEDGERNAME>\n';
        xml += '\t\t\t\t\t\t\t<NARRATION/>\n';
        xml += '\t\t\t\t\t\t\t<GSTCLASS/>\n';
        xml += '\t\t\t\t\t\t\t<ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>\n';
        xml += '\t\t\t\t\t\t\t<AMOUNT>-77467</AMOUNT>\n';
        xml += '\t\t\t\t\t\t\t<VATEXPAMOUNT>-77467</VATEXPAMOUNT>\n';
        xml += '\t\t\t\t\t\t\t<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n';
        xml += '\t\t\t\t\t\t\t<BILLALLOCATIONS.LIST>\n';
        xml += '\t\t\t\t\t\t\t\t<NAME>2704241004/29.04.2024</NAME>\n';
        xml += '\t\t\t\t\t\t\t\t<BILLCREDITPERIOD>30 Days</BILLCREDITPERIOD>\n';
        xml += '\t\t\t\t\t\t\t\t<BILLTYPE>New Ref</BILLTYPE>\n';
        xml += '\t\t\t\t\t\t\t\t<AMOUNT>-77467</AMOUNT>\n';
        xml += '\t\t\t\t\t\t\t\t</BILLALLOCATIONS.LIST>\n';
        xml += '\t\t\t\t\t\t</ALLLEDGERENTRIES.LIST>\n';

        xml += '\t\t\t\t\t\t<ALLLEDGERENTRIES.LIST>\n';
        xml += '\t\t\t\t\t\t\t<OLDAUDITENTRYIDS.LIST TYPE="Number">\n';
        xml += '\t\t\t\t\t\t\t\t<OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>\n';
        xml += '\t\t\t\t\t\t\t</OLDAUDITENTRYIDS.LIST>\n';
        xml += '\t\t\t\t\t\t\t<LEDGERNAME>PAL2</LEDGERNAME>\n';
        xml += '\t\t\t\t\t\t\t<GSTCLASS/>\n';
        xml += '\t\t\t\t\t\t\t<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n';
        xml += '\t\t\t\t\t\t\t<LEDGERFROMITEM>No</LEDGERFROMITEM>\n';
        xml += '\t\t\t\t\t\t\t<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n';
        xml += '\t\t\t\t\t\t\t<ISPARTYLEDGER>No</ISPARTYLEDGER>\n';
        xml += '\t\t\t\t\t\t\t<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n';
        xml += '\t\t\t\t\t\t\t<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n';
        xml += '\t\t\t\t\t\t\t<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n';
        xml += '\t\t\t\t\t\t\t<NARRATION/>\n';
        xml += '\t\t\t\t\t\t\t<AMOUNT>65000</AMOUNT>\n';
        xml += '\t\t\t\t\t\t\t<VATEXPAMOUNT>65000</VATEXPAMOUNT>\n';
        xml += '\t\t\t\t\t\t\t<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n';
        xml += '\t\t\t\t\t\t</ALLLEDGERENTRIES.LIST>\n';

        xml += '\t\t\t\t\t\t<ALLLEDGERENTRIES.LIST>\n';
        xml += '\t\t\t\t\t\t\t<OLDAUDITENTRYIDS.LIST TYPE="Number">\n';
        xml += '\t\t\t\t\t\t\t\t<OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>\n';
        xml += '\t\t\t\t\t\t\t</OLDAUDITENTRYIDS.LIST>\n';
        xml += '\t\t\t\t\t\t\t<LEDGERNAME>CGST @ 9% PAYABLE</LEDGERNAME>\n';
        xml += '\t\t\t\t\t\t\t<GSTCLASS/>\n';
        xml += '\t\t\t\t\t\t\t<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n';
        xml += '\t\t\t\t\t\t\t<LEDGERFROMITEM>No</LEDGERFROMITEM>\n';
        xml += '\t\t\t\t\t\t\t<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n';
        xml += '\t\t\t\t\t\t\t<ISPARTYLEDGER>No</ISPARTYLEDGER>\n';
        xml += '\t\t\t\t\t\t\t<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n';
        xml += '\t\t\t\t\t\t\t<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n';
        xml += '\t\t\t\t\t\t\t<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n';
        xml += '\t\t\t\t\t\t\t<NARRATION/>\n';
        xml += '\t\t\t\t\t\t\t<AMOUNT>5850</AMOUNT>\n';
        xml += '\t\t\t\t\t\t\t<VATEXPAMOUNT>5850</VATEXPAMOUNT>\n';
        xml += '\t\t\t\t\t\t\t<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n';
        xml += '\t\t\t\t\t\t</ALLLEDGERENTRIES.LIST>\n';

        xml += '\t\t\t\t\t\t<ALLLEDGERENTRIES.LIST>\n';
        xml += '\t\t\t\t\t\t\t<OLDAUDITENTRYIDS.LIST TYPE="Number">\n';
        xml += '\t\t\t\t\t\t\t\t<OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>\n';
        xml += '\t\t\t\t\t\t\t</OLDAUDITENTRYIDS.LIST>\n';
        xml += '\t\t\t\t\t\t\t<LEDGERNAME>SGST @ 9% PAYABLE</LEDGERNAME>\n';
        xml += '\t\t\t\t\t\t\t<GSTCLASS/>\n';
        xml += '\t\t\t\t\t\t\t<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n';
        xml += '\t\t\t\t\t\t\t<LEDGERFROMITEM>No</LEDGERFROMITEM>\n';
        xml += '\t\t\t\t\t\t\t<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n';
        xml += '\t\t\t\t\t\t\t<ISPARTYLEDGER>No</ISPARTYLEDGER>\n';
        xml += '\t\t\t\t\t\t\t<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n';
        xml += '\t\t\t\t\t\t\t<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n';
        xml += '\t\t\t\t\t\t\t<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n';
        xml += '\t\t\t\t\t\t\t<NARRATION/>\n';
        xml += '\t\t\t\t\t\t\t<AMOUNT>5850</AMOUNT>\n';
        xml += '\t\t\t\t\t\t\t<VATEXPAMOUNT>5850</VATEXPAMOUNT>\n';
        xml += '\t\t\t\t\t\t\t<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n';
        xml += '\t\t\t\t\t\t</ALLLEDGERENTRIES.LIST>\n';

        xml += '\t\t\t\t\t\t<ALLLEDGERENTRIES.LIST>\n';
        xml += '\t\t\t\t\t\t\t<OLDAUDITENTRYIDS.LIST TYPE="Number">\n';
        xml += '\t\t\t\t\t\t\t\t<OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>\n';
        xml += '\t\t\t\t\t\t\t</OLDAUDITENTRYIDS.LIST>\n';
        xml += '\t\t\t\t\t\t\t<LEDGERNAME>TCS @ 1%</LEDGERNAME>\n';
        xml += '\t\t\t\t\t\t\t<GSTCLASS/>\n';
        xml += '\t\t\t\t\t\t\t<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n';
        xml += '\t\t\t\t\t\t\t<LEDGERFROMITEM>No</LEDGERFROMITEM>\n';
        xml += '\t\t\t\t\t\t\t<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n';
        xml += '\t\t\t\t\t\t\t<ISPARTYLEDGER>No</ISPARTYLEDGER>\n';
        xml += '\t\t\t\t\t\t\t<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n';
        xml += '\t\t\t\t\t\t\t<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n';
        xml += '\t\t\t\t\t\t\t<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n';
        xml += '\t\t\t\t\t\t\t<NARRATION/>\n';
        xml += '\t\t\t\t\t\t\t<AMOUNT>767</AMOUNT>\n';
        xml += '\t\t\t\t\t\t\t<VATEXPAMOUNT>767</VATEXPAMOUNT>\n';
        xml += '\t\t\t\t\t\t\t<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n';
        xml += '\t\t\t\t\t\t</ALLLEDGERENTRIES.LIST>\n';

        xml += '\t\t\t\t\t\t<ALLLEDGERENTRIES.LIST>\n';
        xml += '\t\t\t\t\t\t\t<OLDAUDITENTRYIDS.LIST TYPE="Number">\n';
        xml += '\t\t\t\t\t\t\t\t<OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>\n';
        xml += '\t\t\t\t\t\t\t</OLDAUDITENTRYIDS.LIST>\n';
        xml += '\t\t\t\t\t\t\t<LEDGERNAME>Round Off</LEDGERNAME>\n';
        xml += '\t\t\t\t\t\t\t<GSTCLASS/>\n';
        xml += '\t\t\t\t\t\t\t<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n';
        xml += '\t\t\t\t\t\t\t<LEDGERFROMITEM>No</LEDGERFROMITEM>\n';
        xml += '\t\t\t\t\t\t\t<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n';
        xml += '\t\t\t\t\t\t\t<ISPARTYLEDGER>No</ISPARTYLEDGER>\n';
        xml += '\t\t\t\t\t\t\t<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n';
        xml += '\t\t\t\t\t\t\t<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n';
        xml += '\t\t\t\t\t\t\t<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n';
        xml += '\t\t\t\t\t\t\t<NARRATION/>\n';
        xml += '\t\t\t\t\t\t\t<AMOUNT>0</AMOUNT>\n';
        xml += '\t\t\t\t\t\t\t<VATEXPAMOUNT>0</VATEXPAMOUNT>\n';
        xml += '\t\t\t\t\t\t\t<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n';
        xml += '\t\t\t\t\t\t</ALLLEDGERENTRIES.LIST>\n';

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


    const handleGSTLabInvoice = () => {
        GstInvLabPdf({ id: rowData.id }, handlePdfInvSucess, handePdfInvException)
        GstInvxml({ id: rowData.id }, handlePdfInvSucess, handePdfInvException)
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
        console.log("data", data)
        data.items.forEach((element, index, array) => {
            // info.push([element.id])
            console.log("data", data)
        });
        const doc = new jsPDF();
        const logoUrl = require('../../../AllImage/RDL_Logo.png');
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
                    content: 'LABOUR CHARGES TAX INVOICE',
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
                    content: 'RDL Technologies Pvt Ltd.\nPlot No. 126, Road No 3, KIADB Industrial Estate\nII Phase, Jigani Industrial Area, Jigani,Anekal Taluk,\nBengaluru - 560 105. Tel:080-27825249\nWeb Site :www.mallikengineering.com\nEmail : info@mallikengineering.com',
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
                content: 'CIN No. U28112KA2013PTC068181',
                colSpan: 2,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: 'PAN No.AAICM4744Q',
                colSpan: 2,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: 'GSTINO. 29AAICM4744Q1ZM',
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
                    content: 'Bill To:\nOTIS Elevator Company (India) ltd\nNO. 92, KIADB INDL. ESTATE,\nPHASE II, JIGANI INDL. AREA,\nANEKAL TALUK\nBangalore 560105 Karnataka\nPAN No.:AAACO0481E\nGSTIN No:29AAACO0481E2ZM',
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
                    content: `Place of Supply & State : ${"Bangalore Karnataka"}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: `State Code : 29`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
                },
            ]
        ];

        //Header4
        const firstHeaderRow = [
            [
                {
                    content: 'INVOICE NO: 23/NR/00063',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'PO NO:OO-87016653',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'DC NO :',
                    colSpan: 1,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                },
                {
                    content: 'Terms of Payment :30 Days',
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black' }
                }
            ],
            [
                {
                    content: 'Date: 23/NR/00063',
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
                    content: 'Date:',
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
                    content: 'Date of Issue of Invoice :07/06/2023',
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
            <FileDownloadIcon style={{ color: '#002D68', cursor: 'pointer' }}
                onClick={handleGSTLabInvoice}
            />
        </>
    )
}
export default GSTLabTaxInv;
