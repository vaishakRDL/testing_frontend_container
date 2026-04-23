import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CustomerDropShowdata, getGstAllSaleInvoiceList, getGstSaleInvoiceData, getGstSaleInvoiceList, getGstSaleInvoicePayload, GSTSalesShowData, MultiDocumentShow, MultiInvoiceLoadList, MultiXmlPrint, StoreGstSaleInvoiceResponse, updatePrintedInvoiceStatus } from '../../../ApiService/LoginPageService';
import { Autocomplete, Button, Card, CardActions, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, ListItemText, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select, TextField, Tooltip, Typography } from '@mui/material';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import NoQr from '../../../AllImage/NoQR.png'
import { Link, useNavigate } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useModuleLocks } from '../../context/ModuleLockContext';

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

const MultiXMLPrint = () => {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    const [activeButton, setActiveButton] = useState("");
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Multi XML")?.lockStatus === "locked";

    const getHighlightStyle = (name, baseStyle = {}, disabled = false) => ({
        ...baseStyle,
        backgroundColor: disabled
            ? "gray"
            : activeButton === name
                ? "#0d6efd" // 🔵 highlight color
                : baseStyle.backgroundColor,
        transition: "0.3s",
        color: disabled ? "black" : "white",
    });

    const [selectedCodes, setSelectedCodes] = useState([]); // store multiple codes
    const [selectedDocument, setSelectedDocument] = useState([]); // For storing only one document
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
    const [documentlist, setDocumentList] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setTodate] = useState('');
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
    const [customerSelectList, setCustomerSelectList] = useState([]);
    const [customerSelect, setCustomerSelect] = useState('');
    const [refreshData, setRefreshData] = useState(false);
    const [selectedCustomerName, setSelectedCustomerName] = useState('');

    // const handleChangeCheckbox = (row) => {
    //     console.log("Selected Row:", row);

    //     // If same row clicked again → unselect it
    //     if (selected === row.id) {
    //         setSelected(null);
    //         setSelectedDocument(null);
    //     } else {
    //         setSelected(row.id);            // store only current ID
    //         setSelectedDocument(row.document); // store only current document
    //     }
    // };

    const handleChangeCheckbox = (row) => {
        if (selectedCodes.includes(row.code)) {
            // Uncheck → remove from array
            setSelectedCodes(selectedCodes.filter((code) => code !== row.code));
            setSelectedDocument(selectedDocument.filter((doc) => doc !== row.document));
        } else {
            // Check → add to array
            setSelectedCodes([...selectedCodes, row.code]);
            setSelectedDocument([...selectedDocument, row.document]);
        }
    };


    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>S No</span>,
            width: 70,
            minWidth: 70,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'invNo',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Inv No</span>,
            width: 120,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'gstNo',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>GST No</span>,
            width: 140,
            minWidth: 120,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemLedger',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Item Ledger</span>,
            width: 160,
            minWidth: 140,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'date',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Inv Date</span>,
            width: 120,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'document',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Document</span>,
            width: 150,
            minWidth: 120,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'cName',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Customer Name</span>,
            width: 200,
            minWidth: 180,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'refNo',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Ref No</span>,
            width: 130,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'partNos',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Part Nos</span>,
            width: 150,
            minWidth: 120,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'creditday',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Credit Days</span>,
            width: 110,
            minWidth: 90,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'narration',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Narration</span>,
            width: 200,
            minWidth: 180,
            align: 'left',
            headerAlign: 'center',
        },
        {
            field: 'taxableValueforGST',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Taxable Value (GST)</span>,
            width: 160,
            minWidth: 140,
            align: 'right',
            headerAlign: 'center',
        },
        {
            field: 'roundOff',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Round Off</span>,
            width: 100,
            minWidth: 80,
            align: 'right',
            headerAlign: 'center',
        },
        {
            field: 'transportCharges',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Transport Charges</span>,
            width: 160,
            minWidth: 140,
            align: 'right',
            headerAlign: 'center',
        },
        {
            field: 'CGSTPer',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>CGST %</span>,
            width: 100,
            minWidth: 90,
            align: 'right',
            headerAlign: 'center',
        },
        {
            field: 'CGST',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>CGST Value</span>,
            width: 120,
            minWidth: 100,
            align: 'right',
            headerAlign: 'center',
        },
        {
            field: 'SGSTPer',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SGST %</span>,
            width: 100,
            minWidth: 90,
            align: 'right',
            headerAlign: 'center',
        },
        {
            field: 'SGST',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>SGST Value</span>,
            width: 120,
            minWidth: 100,
            align: 'right',
            headerAlign: 'center',
        },
        {
            field: 'UTGSTPer',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UGST %</span>,
            width: 100,
            minWidth: 90,
            align: 'right',
            headerAlign: 'center',
        },
        {
            field: 'UTGST',
            headerClassName: 'super-app-theme--header',

            headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>UGST Value</span>,
            width: 120,
            minWidth: 100,
            align: 'right',
            headerAlign: 'center',
        },
    ];


    useEffect(() => {
        MultiDocumentShow(handleDocumentSuccess, handleDocumentException);
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
        // setRefreshData(oldValue => !oldValue);
    }
    const handleGstInvoiceException = () => { }

    const handleDocumentSuccess = (dataObject) => {
        setDocumentList(dataObject?.data || [])
    }
    const handleDocumentException = () => { }

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

    //     const generateTallyMessage = (json) => {
    //         const invoice = json.invoice;
    //         const items = json.items;

    //         const getFormattedDate = (dateStr) => {
    //             const [dd, mm, yyyy] = dateStr.split('-');
    //             return `${yyyy}${mm}${dd}`;
    //         };

    //         const formatAmount = (val) => (+val).toFixed(2);
    //         const escapeXml = (str) =>
    //             str?.replace(/&/g, "&amp;")
    //                 .replace(/</g, "&lt;")
    //                 .replace(/>/g, "&gt;")
    //                 .replace(/"/g, "&quot;") || "";

    //         const xmlDate = getFormattedDate(invoice.date);
    //         const refDate = invoice.date.replace(/-/g, '/');
    //         const roundOff = parseFloat(invoice.roundOff || 0);
    //         const roundOffSign = roundOff >= 0 ? 'Yes' : 'No';

    //         let xml = `<TALLYMESSAGE xmlns:UDF="TallyUDF">\n<VOUCHER REMOTEID="GSTSalesInvoice_${refDate.replace(/-/g, '')}_${invoice.invNo}" VCHTYPE="SALES" ACTION="Create">\n`;

    //         xml += `<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
    //         xml += `<DATE>${xmlDate}</DATE>\n`;
    //         xml += `<REFERENCEDATE>${refDate}</REFERENCEDATE>\n`;
    //         xml += `<GUID>GSTSalesInvoice_${refDate.replace(/-/g, '')}_${invoice.invNo}</GUID>\n`;
    //         xml += `<VOUCHERTYPENAME>SALES</VOUCHERTYPENAME>\n`;
    //         // xml += `<NARRATION>${escapeXml(items.partNo || '')}</NARRATION>\n`;
    //         // const narrationText = items.map(item => item.narration).join(', ');
    //         // xml += `<NARRATION>${escapeXml(narrationText)}</NARRATION>\n`;
    //         const poNo = items[0]?.poNo || "";
    //         const poDate = items[0]?.poDate || "";

    //         // Extract only the item descriptions (without repeating PO/date)
    //         // const details = items.map(item => {
    //         //     // remove "PO; DATE," part safely
    //         //     const prefix = `${poNo}; ${poDate},`;
    //         //     return item.narration.replace(prefix, "").trim();
    //         // }).join(", ");
    //         const details = items.map(item => {
    //             const prefix = `${poNo}; ${poDate}`;
    //             const narration = item.narration.replace(/\s+/g, " ").trim(); // normalize spaces

    //             const parts = narration.split(prefix);
    //             return parts[1] ? parts[1].replace(/^,/, '').trim() : narration.trim();
    //         }).join(", ");

    //         // Build final narration
    //         const narrationText = `${poNo}; ${poDate}, ${details}`;

    //         // Add to XML
    //         xml += `<NARRATION>${escapeXml(narrationText)}</NARRATION>\n`;

    //         console.log(narrationText);


    //         xml += `<PARTYLEDGERNAME>${escapeXml(invoice.tallyAlias)}</PARTYLEDGERNAME>\n`;
    //         xml += `<REFERENCE>${invoice.invNo}/${refDate}</REFERENCE>\n`;
    //         xml += `<VOUCHERNUMBER>${invoice.invNo}</VOUCHERNUMBER>\n`;
    //         xml += `<DIFFACTUALQTY>No</DIFFACTUALQTY>\n<ISOPTIONAL>No</ISOPTIONAL>\n`;
    //         xml += `<EFFECTIVEDATE>${xmlDate}</EFFECTIVEDATE>\n<ISCANCELLED>No</ISCANCELLED>\n<USETRACKINGNUMBER>No</USETRACKINGNUMBER>\n`;
    //         xml += `<ISINVOICE>No</ISINVOICE>\n<ISGSTOVERRIDDEN>Yes</ISGSTOVERRIDDEN>\n<BASICORDERREF></BASICORDERREF>\n`;

    //         // Party Ledger
    //         xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
    //         xml += `<LEDGERNAME>${escapeXml(invoice.cCode || invoice.cName)}</LEDGERNAME>\n<NARRATION/>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>\n`;
    //         xml += `<AMOUNT>-${formatAmount(invoice.totalValue)}</AMOUNT>\n<VATEXPAMOUNT>-${formatAmount(invoice.totalValue)}</VATEXPAMOUNT>\n`;
    //         xml += `<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n`;
    //         xml += `<BILLALLOCATIONS.LIST>\n<NAME>${invoice.invNo}/${refDate}</NAME>\n<BILLCREDITPERIOD>${items[0].pay_term}</BILLCREDITPERIOD>\n`;
    //         xml += `<BILLTYPE>New Ref</BILLTYPE>\n<AMOUNT>-${formatAmount(invoice.totalValue)}</AMOUNT>\n</BILLALLOCATIONS.LIST>\n`;
    //         xml += `</ALLLEDGERENTRIES.LIST>\n`;

    //         // Sales Ledger
    //         xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
    //         xml += `<LEDGERNAME>${escapeXml(items[0].itemLedger)}</LEDGERNAME>
    // \n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
    //         xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
    //         xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
    //         xml += `<AMOUNT>${formatAmount(invoice.taxableValueforGST)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(invoice.taxableValueforGST)}</VATEXPAMOUNT>\n`;
    //         xml += `<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;

    //         // CGST
    //         xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
    //         xml += `<LEDGERNAME>CGST @ 9% PAYABLE</LEDGERNAME>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
    //         xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
    //         xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
    //         xml += `<AMOUNT>${formatAmount(invoice.CGST)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(invoice.CGST)}</VATEXPAMOUNT>\n<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;

    //         // SGST
    //         xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
    //         xml += `<LEDGERNAME>SGST @ 9% PAYABLE</LEDGERNAME>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
    //         xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
    //         xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
    //         xml += `<AMOUNT>${formatAmount(invoice.SGST)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(invoice.SGST)}</VATEXPAMOUNT>\n<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;

    //         // Round Off
    //         xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
    //         xml += `<LEDGERNAME>Round Off</LEDGERNAME>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>${roundOffSign}</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
    //         xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
    //         xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
    //         xml += `<AMOUNT>${formatAmount(roundOff)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(roundOff)}</VATEXPAMOUNT>\n<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;

    //         // Inventory Entries
    //         // items.forEach((item) => {
    //         //     xml += `<ALLINVENTORYENTRIES.LIST>\n`;
    //         //     xml += `<STOCKITEMNAME>${escapeXml(item.itemName)}</STOCKITEMNAME>\n`;
    //         //     xml += `<RATE>${formatAmount(item.invRate)}</RATE>\n`;
    //         //     xml += `<AMOUNT>${formatAmount(item.invAmt)}</AMOUNT>\n`;
    //         //     xml += `<ACTUALQTY>${item.invQty} ${item.uom}</ACTUALQTY>\n`;
    //         //     xml += `<BILLEDQTY>${item.invQty} ${item.uom}</BILLEDQTY>\n`;
    //         //     xml += `<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n`;
    //         //     xml += `</ALLINVENTORYENTRIES.LIST>\n`;
    //         // });

    //         xml += `</VOUCHER>\n</TALLYMESSAGE>\n`;

    //         return xml;
    //     };
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
        const refDateRef = invoice.date.replace(/-/g, '.');

        const rawDate = invoice.date; // example: "03-10-2025"

        const [day, month, year] = rawDate.split("-");

        const refDateRefLetter = new Date(`${year}-${month}-${day}`)
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .replace(/ /g, "")
            .toUpperCase();

        // ================= TAX FLAGS (NEW – SAFE) =================
        const IGST = Number(invoice.IGST || 0);
        const CGST = Number(invoice.CGST || 0);
        const SGST = Number(invoice.SGST || 0);
        const isIGST = IGST > 0;

        // ================= TCS (NEW – SAFE) =================
        const tcsTotal =
            Number(invoice.tcs || 0) +
            Number(invoice.subChargeOnTcs || 0) +
            Number(invoice.cessOnTcs || 0);

        const roundOff = parseFloat(invoice.roundOff || 0);
        const roundOffSign = roundOff >= 0 ? 'No' : 'Yes';
        let xml = `<TALLYMESSAGE xmlns:UDF="TallyUDF">\n<VOUCHER REMOTEID="GSTSalesInvoice_${refDateRefLetter}_${invoice.invNo}" VCHTYPE="SALES" ACTION="Create">\n`;

        xml += `<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        xml += `<DATE>${xmlDate}</DATE>\n`;
        xml += `<REFERENCEDATE>${refDate}</REFERENCEDATE>\n`;
        xml += `<GUID>GSTSalesInvoice_${refDate.replace(/-/g, '')}_${invoice.invNo}</GUID>\n`;
        xml += `<VOUCHERTYPENAME>SALES</VOUCHERTYPENAME>\n`;

        // ---------------- FIX #1 — Correct narration extraction ----------------
        const poNo = items[0]?.poNo || "";
        const poDate = items[0]?.poDate || "";

        const details = items.map(item => {
            const prefix = `${poNo}; ${poDate}`;
            const narration = item.narration.replace(/\s+/g, " ").trim();

            const parts = narration.split(prefix);
            return parts[1] ? parts[1].replace(/^,/, '').trim() : narration.trim();
        }).join(", ");

        const narrationText = `${poNo}; ${poDate}, ${details}`;
        xml += `<NARRATION>${escapeXml(narrationText)}</NARRATION>\n`;
        // ----------------------------------------------------------------------

        xml += `<PARTYLEDGERNAME>${escapeXml(invoice.tallyAlias)}</PARTYLEDGERNAME>\n`;
        xml += `<REFERENCE>${invoice.invNo}/${refDateRef}</REFERENCE>\n`;
        xml += `<VOUCHERNUMBER>${invoice.invNo}</VOUCHERNUMBER>\n`;
        xml += `<DIFFACTUALQTY>No</DIFFACTUALQTY>\n<ISOPTIONAL>No</ISOPTIONAL>\n`;
        xml += `<EFFECTIVEDATE>${xmlDate}</EFFECTIVEDATE>\n<ISCANCELLED>No</ISCANCELLED>\n<USETRACKINGNUMBER>No</USETRACKINGNUMBER>\n`;
        xml += `<ISINVOICE>No</ISINVOICE>\n<ISGSTOVERRIDDEN>Yes</ISGSTOVERRIDDEN>\n<BASICORDERREF></BASICORDERREF>\n`;

        // ---------------- FIX #2 — Party Ledger must use invoice.invValue ----------------
        xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>`;
        xml += `<LEDGERNAME>${escapeXml(invoice.tallyAlias)}</LEDGERNAME>\n<NARRATION/>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>\n`;

        xml += `<AMOUNT>-${formatAmount(invoice.invValue)}</AMOUNT>\n`;
        xml += `<VATEXPAMOUNT>-${formatAmount(invoice.invValue)}</VATEXPAMOUNT>\n`;

        xml += `<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n`;
        xml += `<BILLALLOCATIONS.LIST>\n<NAME>${invoice.invNo}/${refDateRef}</NAME>\n<BILLCREDITPERIOD>${items[0].pay_term}</BILLCREDITPERIOD>\n`;
        xml += `<BILLTYPE>New Ref</BILLTYPE>\n`;
        xml += `<AMOUNT>-${formatAmount(invoice.invValue)}</AMOUNT>\n</BILLALLOCATIONS.LIST>\n`;
        xml += `</ALLLEDGERENTRIES.LIST>\n`;
        // ----------------------------------------------------------------------

        // ---------------- FIX #3 — Sales Ledger should NOT be "PAL2" ----------------
        xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>`;
        xml += `<LEDGERNAME>${escapeXml(items[0].itemLedgerCode)}</LEDGERNAME>\n`; // ✔ FIXED
        xml += `<GSTCLASS/>\n<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
        xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
        xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
        xml += `<AMOUNT>${formatAmount(invoice.taxableValueforGST)}</AMOUNT>\n`;
        xml += `<VATEXPAMOUNT>${formatAmount(invoice.taxableValueforGST)}</VATEXPAMOUNT>\n`;
        xml += `<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;
        // ----------------------------------------------------------------------

        // // CGST
        // xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        // xml += `<LEDGERNAME>CGST @ 9% PAYABLE</LEDGERNAME>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
        // xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
        // xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
        // xml += `<AMOUNT>${formatAmount(invoice.CGST)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(invoice.CGST)}</VATEXPAMOUNT>\n<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;

        // // SGST
        // xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        // xml += `<LEDGERNAME>SGST @ 9% PAYABLE</LEDGERNAME>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
        // xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
        // xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
        // xml += `<AMOUNT>${formatAmount(invoice.SGST)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(invoice.SGST)}</VATEXPAMOUNT>\n<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;

        if (isIGST) {
            xml += `
<ALLLEDGERENTRIES.LIST>
<OLDAUDITENTRYIDS.LIST TYPE="Number">
<OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
</OLDAUDITENTRYIDS.LIST>
<LEDGERNAME>IGST @ ${invoice.IGSTPer}% PAYABLE</LEDGERNAME>
<GSTCLASS/>
<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
<LEDGERFROMITEM>No</LEDGERFROMITEM>
<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
<ISPARTYLEDGER>No</ISPARTYLEDGER>
<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>
<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
<NARRATION/>
<AMOUNT>${formatAmount(IGST)}</AMOUNT>
<VATEXPAMOUNT>${formatAmount(IGST)}</VATEXPAMOUNT>
<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>
</ALLLEDGERENTRIES.LIST>
`;
        } else {
            if (CGST > 0) {
                xml += `
<ALLLEDGERENTRIES.LIST>
<OLDAUDITENTRYIDS.LIST TYPE="Number">
<OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
</OLDAUDITENTRYIDS.LIST>
<LEDGERNAME>CGST @ ${invoice.CGSTPer}% PAYABLE</LEDGERNAME>
<GSTCLASS/>
<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
<LEDGERFROMITEM>No</LEDGERFROMITEM>
<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
<ISPARTYLEDGER>No</ISPARTYLEDGER>
<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>
<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
<NARRATION/>
<AMOUNT>${formatAmount(CGST)}</AMOUNT>
<VATEXPAMOUNT>${formatAmount(CGST)}</VATEXPAMOUNT>
<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>
</ALLLEDGERENTRIES.LIST>
`;
            }

            if (SGST > 0) {
                xml += `
<ALLLEDGERENTRIES.LIST>
<OLDAUDITENTRYIDS.LIST TYPE="Number">
<OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
</OLDAUDITENTRYIDS.LIST>
<LEDGERNAME>SGST @ ${invoice.SGSTPer}% PAYABLE</LEDGERNAME>
<GSTCLASS/>
<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
<LEDGERFROMITEM>No</LEDGERFROMITEM>
<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
<ISPARTYLEDGER>No</ISPARTYLEDGER>
<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>
<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
<NARRATION/>
<AMOUNT>${formatAmount(SGST)}</AMOUNT>
<VATEXPAMOUNT>${formatAmount(SGST)}</VATEXPAMOUNT>
<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>
</ALLLEDGERENTRIES.LIST>
`;
            }
        }
        if (tcsTotal > 0) {
            xml += `
<ALLLEDGERENTRIES.LIST>
<OLDAUDITENTRYIDS.LIST TYPE="Number">
<OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
</OLDAUDITENTRYIDS.LIST>
<LEDGERNAME>TCS @ ${invoice.tcsPer}%</LEDGERNAME>
<GSTCLASS/>
<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
<LEDGERFROMITEM>No</LEDGERFROMITEM>
<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
<ISPARTYLEDGER>No</ISPARTYLEDGER>
<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>
<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
<NARRATION/>
<AMOUNT>${formatAmount(tcsTotal)}</AMOUNT>
<VATEXPAMOUNT>${formatAmount(tcsTotal)}</VATEXPAMOUNT>
<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>
</ALLLEDGERENTRIES.LIST>
`;
        }

        // Round Off
        xml += `<ALLLEDGERENTRIES.LIST>\n<OLDAUDITENTRYIDS.LIST TYPE="Number"><OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS></OLDAUDITENTRYIDS.LIST>\n`;
        xml += `<LEDGERNAME>Round Off</LEDGERNAME>\n<GSTCLASS/>\n<ISDEEMEDPOSITIVE>${roundOffSign}</ISDEEMEDPOSITIVE>\n<LEDGERFROMITEM>No</LEDGERFROMITEM>\n`;
        xml += `<REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>\n<ISPARTYLEDGER>No</ISPARTYLEDGER>\n<ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>\n`;
        xml += `<ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>\n<ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>\n<NARRATION/>\n`;
        xml += `<AMOUNT>${formatAmount(roundOff)}</AMOUNT>\n<VATEXPAMOUNT>${formatAmount(roundOff)}</VATEXPAMOUNT>\n<SERVICETAXDETAILS.LIST> </SERVICETAXDETAILS.LIST>\n</ALLLEDGERENTRIES.LIST>\n`;

        xml += `</VOUCHER>\n</TALLYMESSAGE>\n`;

        return xml;
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };


    const generateCombinedXml = (invoiceArray) => {
        const allTallyMessages = invoiceArray.map(generateTallyMessage).join("\n");

        return `<?xml version="1.0" encoding="UTF-8"?>\n<ENVELOPE>\n` +
            `<HEADER><TALLYREQUEST>Import Data</TALLYREQUEST></HEADER>\n` +
            `<BODY><IMPORTDATA>\n` +
            `<REQUESTDESC><STATICVARIABLES></STATICVARIABLES></REQUESTDESC>\n` +
            `<REQUESTDATA>\n${allTallyMessages}</REQUESTDATA>\n` +
            `</IMPORTDATA>\n</BODY>\n</ENVELOPE>`;
    };
    const handleRadioChange = (event) => {
        setSelectedFilterRadio(event.target.value);

        let fromDate = new Date();
        let toDate = new Date();

        switch (event.target.value) {
            case 'Today':
                fromDate = new Date();
                toDate = new Date();
                break;
            case 'Yesterday':
                fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - 1);
                toDate = new Date(fromDate);
                break;
            case 'This week':
                fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - fromDate.getDay());
                toDate = new Date();
                break;
            case 'Last week':
                fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - fromDate.getDay() - 7);
                toDate = new Date(fromDate);
                toDate.setDate(toDate.getDate() + 6);
                break;
            case 'This month':
                fromDate = new Date();
                fromDate.setDate(1);
                toDate = new Date();
                break;
            case 'Last month':
                fromDate = new Date();
                fromDate.setMonth(fromDate.getMonth() - 1);
                fromDate.setDate(1);
                toDate = new Date(fromDate);
                toDate.setMonth(toDate.getMonth() + 1);
                toDate.setDate(0); // Last day of the previous month
                break;
            default:
                fromDate = null;
                toDate = null; // For 'Custom' or other cases where a specific date isn't predefined
        }

        // selectedDate,selectedToDate
        setFromDate(fromDate ? fromDate.toISOString().split('T')[0] : '');
        setTodate(toDate ? toDate.toISOString().split('T')[0] : '');
    };

    const handleView = () => {

        MultiXmlPrint({ gstids: selectionRowIds }, handleXMLSuccess, handlePrintedXMLException);
    }
    const handleDataView = () => {

        MultiInvoiceLoadList({
            from: fromDate,
            to: toDate,
            doc: selectedDocument,
            customer: customerSelect,
            option: selectedCodes
        }, handleGstListSuccess, handleGstInvoiceException)
    }

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
        'Voucher Mismatch',
        'Export Item Master',
        'Export Party Master',

    ];



    // ON E-INVOICE BUTTON CLICK



    // GENERATING EINVOICE


    useEffect(() => {
        const generateMergedPdf = async () => {
            if (pdfBlobs.length > 0) {
                const mergedUrl = await mergeJsPdfBlobs(pdfBlobs);
                setMergedPdfUrl(mergedUrl);
            }
        };

        generateMergedPdf();
    }, [pdfBlobs]);

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
    // STEP 1: Function to convert one invoice JSON into <TALLYMESSAGE> block


    // STEP 2: Generate full XML file




    const handleChangeCustomer = (e) => {
        if (e !== null) {
            CustomerDropShowdata(
                { code: e.target.value },
                handleCustomerDropshow,
                handleCustomerDropshowException
            );
        }
    };

    const handleCustomerDropshow = (dataObject) => {
        setCustomerSelectList(dataObject?.data || []);
    };

    const handleCustomerDropshowException = (error, errorMessage) => { };

    const optionsCustList = Array.isArray(customerSelectList)
        ? customerSelectList.map((item) => ({
            cId: item.cId,         // Correctly map cId from response
            label: item.cCode,     // Show cCode as the Autocomplete label
            cName: item.cName,     // Keep name for reference if needed
            id: item.id            // Include id if needed
        }))
        : [];



    const onCustomerSelectChange = (selectedValue) => {
        console.log("Selected value:", selectedValue);

        if (selectedValue) {
            setSelectedCustomerName(selectedValue.label);  // Example: "OTIS NEW WH"
            setCustomerSelect(selectedValue.cId);          // Example: "4"
        } else {
            setSelectedCustomerName(null);
            setCustomerSelect(null);
        }
    };


    return (
        <Box sx={{ height: 400, width: '100%', padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '10px' }}>

                <Typography
                    sx={{ fontFamily: "Roboto Slab", fontWeight: "bold" }}
                    variant="h5"
                >Multi XML Print</Typography>
            </div>

            <Grid container alignItems="flex-start" spacing={2} style={{ width: "100%" }}>
                {/* Left side (filters + buttons) */}
                <Grid item xs={12} md={8} lg={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="From"
                                variant="outlined"
                                InputLabelProps={{ shrink: true, style: { color: '#000', fontWeight: 'bold' } }}
                                size="small"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="To"
                                variant="outlined"
                                InputLabelProps={{ shrink: true, style: { color: '#000', fontWeight: 'bold' } }}
                                size="small"
                                value={toDate}
                                onChange={(e) => setTodate(e.target.value)}
                            />
                        </Grid>

                        {/* <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <InputLabel id="voucher-label">Voucher Preview</InputLabel>
                                <Select
                                    labelId="voucher-label"
                                    multiple
                                    value={invoiceHeader}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Voucher Preview" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    size="small"
                                >
                                    {names.map((name) => (
                                        <MenuItem key={name} value={name}>
                                            <Checkbox checked={invoiceHeader.includes(name)} />
                                            <ListItemText primary={name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid> */}

                        <Grid item xs={12} sm={6} md={3}>
                            <Autocomplete
                                fullWidth
                                disablePortal
                                id="combo-box-demo"
                                options={optionsCustList}
                                size='small'
                                value={optionsCustList.find(opt => opt.cId === customerSelect) || null}
                                getOptionLabel={(option) => option.label || ""}
                                onChange={(event, value) => onCustomerSelectChange(value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="filled"
                                        label="Search Customer"
                                        onChange={handleChangeCustomer} // for dynamic searching
                                    />
                                )}
                                style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                            />

                            {/* <Autocomplete
                                fullWidth
                                disablePortal
                                id="combo-box-demo"
                                value={selectedCustomerName}
                                options={optionsCustList}
                                size='small'
                                renderInput={(params) =>
                                    <TextField
                                        {...params}
                                        variant="filled"
                                        label="Search Customer"
                                        onChange={handleChangeCustomer}
                                    />}
                                onChange={(event, value) => onCustomerSelectChange(value)}
                                style={{ backgroundColor: '#ffffff', borderRadius: '5px' }}
                            /> */}
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.5}>
                            <Button
                                fullWidth
                                variant="contained"
                                style={getHighlightStyle("Load", {
                                    backgroundColor: isModuleLocked ? "gray" : "#002D68",
                                })}
                                onClick={() => {
                                    setActiveButton("Load"); // 🔵 highlight
                                    handleDataView();        // ✅ existing logic
                                }}
                                disabled={isModuleLocked}
                            >
                                Load
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={3} md={3} style={{ display: "flex", gap: "8px" }}>
                            <Button
                                fullWidth
                                variant="contained"
                                style={getHighlightStyle("GenerateXML", {
                                    backgroundColor: isModuleLocked ? "gray" : "#002D68",
                                })}
                                onClick={() => {
                                    setActiveButton("GenerateXML"); // 🔵 highlight
                                    handleView();                   // ✅ existing logic
                                }}
                                disabled={isModuleLocked}
                            >
                                Generate XML
                            </Button>
                        </Grid>

                    </Grid>
                </Grid>

                {/* Right side (table) */}
                <Grid item xs={12} md={4} lg={4}>
                    <div
                        style={{
                            width: "100%",
                            height: "125px",
                            overflowY: "auto",
                            border: "1px solid #969696",
                            backgroundColor: "white",
                        }}
                    >
                        <table
                            style={{
                                borderCollapse: "collapse",
                                width: "100%",
                                fontFamily: "Arial, sans-serif",
                                fontSize: "13px",
                            }}
                        >
                            <thead style={{ backgroundColor: "#e0e0e0" }}>
                                <tr>
                                    <th style={{ border: "1px solid #969696", padding: "4px" }}>Sel</th>
                                    <th style={{ border: "1px solid #969696", padding: "4px" }}>Document</th>
                                    <th style={{ border: "1px solid #969696", padding: "4px" }}>Daywise Summary</th>
                                </tr>
                            </thead>
                            {/* <tbody>
                                {documentlist.map((row) => (
                                    <tr
                                        key={row.id}
                                        style={{
                                            backgroundColor: selected === row.id ? "#7ee37e" : "white",
                                        }}
                                    >
                                        <td style={{ border: "1px solid #969696", padding: "6px" }}>
                                            <input
                                                type="checkbox"
                                                checked={selected === row.id}
                                                onChange={() => handleChangeCheckbox(row)}
                                            />
                                        </td>
                                        <td style={{ border: "1px solid #969696", padding: "6px" }}>
                                            {row.document}
                                        </td>
                                        <td style={{ border: "1px solid #969696", padding: "6px" }}>
                                            N
                                        </td>
                                    </tr>
                                ))}
                            </tbody> */}
                            <tbody>
                                {documentlist.map((row) => (
                                    <tr
                                        key={row.id}
                                        style={{
                                            backgroundColor: selectedCodes.includes(row.code) ? "#7ee37e" : "white",
                                        }}
                                    >
                                        <td style={{ border: "1px solid #969696", padding: "6px" }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedCodes.includes(row.code)}
                                                onChange={() => handleChangeCheckbox(row)}
                                            />
                                        </td>
                                        <td style={{ border: "1px solid #969696", padding: "6px" }}>
                                            {row.document}
                                        </td>
                                        <td style={{ border: "1px solid #969696", padding: "6px" }}>N</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
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

                </CardContent>
            </Card>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />

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




export default MultiXMLPrint;
