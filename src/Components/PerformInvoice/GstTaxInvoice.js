
import React from "react";
import "./Pdf.css";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useState } from "react";
import { useEffect } from "react";
import PrintIcon from '@mui/icons-material/Print';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import DownloadIcon from '@mui/icons-material/Download';
import { GstInvLabPdf, SearchInvoiceViewing } from "../../ApiService/LoginPageService";


const GstTaxInvoice = (props) => {
    const { rowData } = props;
    const [rows, setRows] = useState('');
    const [jsonrows, setjsonRows] = useState([]);
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [pdfBlobs, setPdfBlobs] = useState([]);
    const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
    const [pdfUrl, setPdfUrl] = useState('');
    const [invoiceFromateChanger, setInvoiceFromateChanger] = useState(false);

    useEffect(() => {
        console.log("jsondata4444444444444444 =========== =====", jsonrows);
        // if (jsonrows) {
        //     const xmlData = jsonToXml(jsonrows); // Assuming you want to convert only the first item
        //     downloadXmlFile(xmlData);
        // }
    }, []);

    const jsonToXml = (json) => {
        // Check if json is undefined
        if (!json) {
            throw new Error('The json parameter is undefined.');
        }

        const invoice = json.invoice;
        const items = json.items;

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
        xml += `\t\t\t\t\t<VOUCHER REMOTEID="GSTSalesInvoice_29Apr2024_${invoice.invNo}" VCHTYPE="SALES" ACTION="Create">\n`;
        xml += '\t\t\t\t\t\t<OLDAUDITENTRYIDS.LIST TYPE="Number">\n';
        xml += '\t\t\t\t\t\t\t<OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>\n';
        xml += '\t\t\t\t\t\t</OLDAUDITENTRYIDS.LIST>\n';
        xml += `\t\t\t\t\t\t<DATE>20240429</DATE>\n`;
        xml += '\t\t\t\t\t\t<REFERENCEDATE>29/04/2024</REFERENCEDATE>\n';
        xml += `\t\t\t\t\t\t<GUID>GSTSalesInvoice_29Apr2024_${invoice.invNo}</GUID>\n`;
        xml += '\t\t\t\t\t\t<VOUCHERTYPENAME>SALES</VOUCHERTYPENAME>\n';
        xml += '\t\t\t\t\t\t<NARRATION>OP89210285;24/04/2024:,HAA339R1-SEL-18.00,</NARRATION>\n';
        xml += '\t\t\t\t\t\t<PARTYLEDGERNAME>SALZ2</PARTYLEDGERNAME>\n';
        xml += `\t\t\t\t\t\t<REFERENCE>${invoice.invNo}/29.04.2024</REFERENCE>\n`;
        xml += `\t\t\t\t\t\t<VOUCHERNUMBER>${invoice.invNo}</VOUCHERNUMBER>\n`;
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
        xml += `\t\t\t\t\t\t\t<AMOUNT>${invoice.taxableValueforGST}</AMOUNT>\n`;
        xml += `\t\t\t\t\t\t\t<VATEXPAMOUNT>${invoice.taxableValueforGST}</VATEXPAMOUNT>\n`;
        xml += '\t\t\t\t\t\t\t<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n';
        xml += '\t\t\t\t\t\t\t<BILLALLOCATIONS.LIST>\n';
        xml += `\t\t\t\t\t\t\t\t<NAME>${invoice.invNo}/29.04.2024</NAME>\n`;
        xml += `\t\t\t\t\t\t\t\t<BILLCREDITPERIOD>${items.pay_term}</BILLCREDITPERIOD>\n`;
        xml += '\t\t\t\t\t\t\t\t<BILLTYPE>New Ref</BILLTYPE>\n';
        xml += `\t\t\t\t\t\t\t\t<AMOUNT>${invoice.totalValue}</AMOUNT>\n`;
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
        xml += `\t\t\t\t\t\t\t<AMOUNT>${invoice.taxableValueforGST}</AMOUNT>\n`;
        xml += `\t\t\t\t\t\t\t<VATEXPAMOUNT>${invoice.taxableValueforGST}</VATEXPAMOUNT>\n`;
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
        xml += `\t\t\t\t\t\t\t<AMOUNT>${invoice.CGST}</AMOUNT>\n`;
        xml += `\t\t\t\t\t\t\t<VATEXPAMOUNT>${invoice.CGST}</VATEXPAMOUNT>\n`;
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
        xml += `\t\t\t\t\t\t\t<AMOUNT>${invoice.SGST}</AMOUNT>\n`;
        xml += `\t\t\t\t\t\t\t<VATEXPAMOUNT>${invoice.SGST}</VATEXPAMOUNT>\n`;
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

    const handleGSTLabInvoice = () => {
        // GstInvLabPdf({ id: rowData }, handlePdfInvSucess, handePdfInvException)
        SearchInvoiceViewing(
            { id: rowData },
            handlePdfInvSucess,
            handePdfInvException
        );
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

    const handlePdfInvSucess = (dataObject) => {
        handleFileSave(dataObject?.data || []);
        // setjsonRows(dataObject?.data || [])
        // if (dataObject?.data) {
        //     const xmlData = jsonToXml(dataObject?.data); // Assuming you want to convert only the first item
        //     downloadXmlFile(xmlData);
        // }
    }

    const handePdfInvException = (errorStatus, errorMessage) => {
        console.log(errorMessage);
    }


    const handleFileSave = (data) => {
        let info = [];
        console.log("data", data?.invoice);
        const invoice = data?.invoice[0] || {};
        const items = data?.items || [];
        items.forEach((element, index, array) => {
            info.push([index + 1, `${element.itemCode}`, `${element.itemName}`, element.hsnCode, element.descOfPackage, element.qty, element.uom, element.rate, element.amt]);
        });

        // Ensure a minimum of 10 items
        const minItems = 10;
        const placeholderItem = [''];
        while (info.length < minItems) {
            info.push([...placeholderItem]);
        }

        const doc = new jsPDF();
        const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
        // console.log("baseUrl------------------>>>>>>>>>>>>>>", baseUrl);
        // const logoUrl = (await import('../../AllImage/RDL_Logo.png')).default;
        const logoUrl = `${baseUrl}/${data.invoice.companyImage}`
        const ISOUrl = require('../../AllImage/ISOlogo.png');

        const tableOptions = {
            didDrawPage: (HookData) => {
                if (HookData.pageNumber === 1) {
                    // Add an image on the first page L,Top/bottom, width,height
                    doc.addImage(logoUrl, 'PNG', 15, 17, 28, 20);
                    doc.addImage(ISOUrl, 'PNG', 176, 24, 20, 10);
                }
            },
        };

        const noBackgroundColorStyle = { fillColor: null };

        doc.setFontSize(8);
        doc.setTextColor('black');
        doc.text('ORIGINAL FOR RECIPIENT', 200, 14, { align: 'right' }); // Adjust X and Y coordinates as needed


        //Header1
        const logoAndAddress = [

            [
                {
                    content: {
                        image: logoUrl,
                        width: 40, // adjust the width as needed
                        height: 40, // adjust the height as needed
                    },
                    colSpan: 6,
                    // styles: { marginBottom: 5 }
                },
                {
                    content: `${data.invoice.companyName}\n${data.invoice.companyAdd}. Tel:${data.invoice.telNo}\nWeb Site :${data.invoice.website}\nEmail : ${data.invoice.email}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                // {
                //     content: 'ISO 9001 : 2015\nISO 14001 : 2015\nOHSAS 18001 : 2007',
                //     colSpan: 2,
                //     styles: { halign: 'right', fontSize: 8, textColor: 'black', valign: 'bottom' }
                // }
            ]
        ];


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
                        content: `${data.invoice.invCode === 'Quote' ? 'QT' : 'PI NO'} :${data.invoice.invNo}`,
                        colSpan: 1,
                        styles: { halign: 'center', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                    }
                ],
                [
                    {
                        content: data.invoice.invCode === 'Quote' ? 'QUOTE' : 'PROFORMA INVOICE',
                        colSpan: 8,
                        styles: { halign: 'center', fontSize: 10, textColor: '#ffffff', fontStyle: 'bold', fontWeight: 'bold', fillColor: '#4D55CC', lineWidth: 0 }
                    },
                ],
            ]
            :
            [
                [
                    {
                        content: data.invoice.invCode === 'Quote' ? 'QUOTATION' : 'PROFORMA INVOICE',
                        colSpan: 8,
                        styles: { halign: 'center', fontSize: 10, textColor: '#ffffff', fontStyle: 'bold', fontWeight: 'bold', fillColor: '#4D55CC', lineWidth: 0 }
                    },
                ],
            ]


        const address = [


            [
                // {
                //     content: ``,
                //     colSpan: 4,
                //     styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                // },
                // {
                //     content: ``,
                //     colSpan: 4,
                //     styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                // }
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
                    content: `Place of Supply & State: ${data.invoice.placeSupply} `,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `State Code: ${data.invoice.stateCode || ''}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]
        ];


        //Header4
        const firstHeaderRow = [
            [
                {
                    content: `${data.invoice.invCode === 'Quote' ? 'QT' : 'PI NO'}: ${data.invoice.invNo}`,
                    colSpan: 2,
                    styles: {
                        halign: 'left',
                        fontSize: 8,
                        textColor: 'black',
                        lineWidth: 0.1,
                        lineColor: '#000000'
                    }
                },
                {
                    content: `PO No: ${data.invoice.poNo || ''}`,
                    colSpan: 2,
                    styles: {
                        halign: 'left',
                        fontSize: 8,
                        textColor: 'black',
                        lineWidth: 0.1,
                        lineColor: '#000000'
                    }
                },
                {
                    content: `Terms of Payment : `,
                    colSpan: 2,
                    styles: {
                        halign: 'left',
                        fontSize: 8,
                        textColor: 'black',
                        lineWidth: 0.1,
                        lineColor: '#000000'
                    }
                },
            ],
            [
                {
                    content: `${data.invoice.invCode === 'Quote' ? 'QT Date' : 'PI Date'}: ${data.invoice.date}`,
                    colSpan: 2,
                    styles: {
                        halign: 'left',
                        fontSize: 8,
                        textColor: 'black',
                        lineWidth: 0.1,
                        lineColor: '#000000'
                    }
                },
                {
                    content: `PO Date: `,
                    colSpan: 2,
                    styles: {
                        halign: 'left',
                        fontSize: 8,
                        textColor: 'black',
                        lineWidth: 0.1,
                        lineColor: '#000000'
                    }
                }
            ],
        ];

        const itemsData = [
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
                    content: `${data.invoice.totQty || ''}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold', }
                },
            ],
            [
                // { content: `Name of Commodities: PARTS OF LIFTS/ELEVATORS`, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                { content: ``, colSpan: 5, styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `Freight changes`,
                    colSpan: 2,
                    styles: {
                        halign: 'left',
                        textColor: 'black',
                        fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000'
                    }
                },
                {
                    content: `${data.invoice.frightCharges}`,
                    colSpan: 2,
                    styles: {
                        halign: 'right',
                        textColor: 'black',
                        fontStyle: 'bold', lineWidth: 0.1, lineColor: '#000000'
                    }
                },
            ],

            ...(parseFloat(data.invoice.igstPer) > 0 ? [[
                { content: '', colSpan: 5, styles: { halign: 'left', fontSize: 8, lineWidth: 0.1, lineColor: '#000000' } },
                {
                    content: `IGST @ ${data.invoice.igstPer} %`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${Number(data.invoice.igst || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]] : []),

            // ✅ Show CGST row only if CGST > 0
            ...(parseFloat(data.invoice.cgstPer) > 0 ? [[
                { content: `Mode of Dispatch: By Road`, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `CGST @ ${data.invoice.cgstPer} %`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${Number(data.invoice.cgst || 0).toLocaleString('en-IN')}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                }
            ]] : []),

            // ✅ Show SGST row only if SGST > 0
            ...(parseFloat(data.invoice.sgstPer) > 0 ? [[
                { content: `Whether tax payable of reverse charge basis: NO`, colSpan: 5, styles: { halign: 'left', lineWidth: 0.1, lineColor: '#000000', fontStyle: 'bold' } },
                {
                    content: `SGST @ ${data.invoice.sgstPer} %`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${Number(data.invoice.sgst || 0).toLocaleString('en-IN')}`,
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

            ...(data.invoice.subtotal > 0 ? [[
                {
                    content: `Sub Total`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
                {
                    content: `${data.invoice.subtotal}`,
                    colSpan: 2,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', lineWidth: 0.1, lineColor: '#000000' }
                },
            ]] : []),
            [
                {
                    content: `Grand Total In Words: Rupees ${data.invoice.totalValueInWords} Only`,
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
                    content: `${data.invoice.totalValue}`,
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
            tableLineWidth: 0.25,
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
                // const doc = data.doc;
                // const { column, cell } = data;
                // const { x, y, width, height } = cell;

                // // ✅ Only draw line at the center (after left block)
                // if (column.index === 0) {
                //     const middleX = x + width; // right edge of left half
                //     doc.setDrawColor(0); // black
                //     doc.setLineWidth(0.3); // light line
                //     doc.line(middleX, y, middleX, y + height); // vertical separator
                // }
                const doc = data.doc;
                const r = data.row.index;
                const c = data.column.index;

                const { x, y, width, height } = data.cell;

                // 🔥 Draw only ONE horizontal line after "Dispatch address" (row 2)
                if (r === 2 && c === 0) {
                    doc.setDrawColor(0);
                    doc.setLineWidth(0.6);
                    doc.line(x, y + height, x + (width * 2), y + height);
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

            body: itemsData,  // 👈 keep only item rows + summary rows here
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
                lineColor: 'black'
            },
            tableLineWidth: 0.25,
            theme: 'grid',
            styles: { font: 'times', fontSize: 8, ...noBackgroundColorStyle },
            startY: doc.lastAutoTable.finalY,
            margin: { left: 10, right: 10 },

            didParseCell: function (data) {
                // ✅ Bold header row
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
                const centerAlignColumns = [5, 6];

                if (data.section === 'body' && rightAlignColumns.includes(data.column.index)) {
                    data.cell.styles.halign = 'right';
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


        const pdfBlob = doc.output('blob');
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfBlobUrl);
    };


    return (
        <>
            {/* <PrintIcon style={{ color: '#ffffff', cursor: 'pointer' }}
                onClick={handleGSTLabInvoice}
            /> */}
            <>
                <PrintIcon style={{ color: '#ffffff', cursor: 'pointer' }}
                    onClick={() => {
                        handleGSTLabInvoice();
                        setPdfModalOpen(true);
                    }}
                />

                <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
                    <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>Proforma Invoice</DialogTitle>

                    <DialogContent style={{ padding: '2px' }}>
                        {pdfUrl &&
                            <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
                        }
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => setPdfModalOpen(false)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </>
        </>
    )
}
export default GstTaxInvoice;