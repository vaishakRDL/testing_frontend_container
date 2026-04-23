
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { getGstAllSaleInvoiceList, getGstSaleInvoiceData, getGstSaleInvoiceList, getGstSaleInvoicePayload, getPurchasebillagainstInvList, getPurchasebillagainstList, getPurchasebillWithoutPoInvList, getPurchaseSelectionList, getPurchaseWithoutPOSelectionList, GSTSalesShowData, MultiXmlPrint, StoreGstSaleInvoiceResponse, updatePrintedInvoiceStatus } from '../../../ApiService/LoginPageService';
import { Button, Card, CardActions, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, ListItemText, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select, TextField, Tooltip, Typography } from '@mui/material';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import NoQr from '../../../AllImage/NoQR.png'
import { Link, useNavigate } from 'react-router-dom';
import ApplicationStore from '../../../Utility/localStorageUtil';
import { PDFDocument } from "pdf-lib";

const PurchaseBillWithoutMultiPrint = () => {
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
    const { userDetails } = ApplicationStore().getStorage("userDetails");
    const userPermission = userDetails?.groupRights?.filter(
        (data) => data?.menu?.toLowerCase() === "purchasebill"
    );
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [gstType, setGstType] = useState("CGST/SGST");

    const [selectedFilterRadio, setSelectedFilterRadio] = useState('');
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [successResponses, setSuccessResponses] = useState([]); // API SUCCESS SHOWS
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
    const [invoiceData, setInvoiceData] = useState([]);
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



    function emptyRowsToPush(lineItems) {
        const pageSize = 39; // Max rows per page (depends on layout)
        const header = 10; // Rows occupied by header
        const footer = 19; // Rows reserved for footer

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
            rowsToPush -= 1; // <-- prevent accidental overflow
        }

        return rowsToPush;
    }

    const columns = [
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    PB No
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'date',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    PB Date
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'grnRefNO',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    GRN Ref No
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'suppInvNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supplier Inv No
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'grandTotal',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Grand Total
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'spName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supplier
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },

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

    const handlePurchaseBillListSuccess = (dataObject) => {
        setRows(dataObject?.data || [])
    }
    const handlePurchaseBillInvoiceException = () => { }

    const handleRowSelection = (selectionModel) => {
        setSelectionRowIds(selectionModel);
        // Find the selected rows based on IDs
        const selectedData = rows.filter(row => selectionModel.includes(row.id));
        setSelectedRows(selectedData);
        // GET PAYLOAD DATA ON CHECKBOX SELECTION
        getPurchaseWithoutPOSelectionList({ invoiceIds: selectionModel }, handleGetPayloadSuccess, handleGetPayloadException)
    };

    const handleGetPayloadSuccess = (dataObject) => {
        setInvoiceData(dataObject.data || []);
        const data = dataObject.data[0];

        setGstType(data?.gstType || "");

    }
    const handleGetPayloadException = () => {
        setInvoiceData([]);
    }


    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };


    const handleView = () => {
        getPurchasebillWithoutPoInvList({
            from: fromDate,
            to: toDate,
            // rangeFrom: docRangeFrom,
            // rangeTo: docRangeTo,
            // printedDoc: printingDoc
        }, handlePurchaseBillListSuccess, handlePurchaseBillInvoiceException)
    }


    async function generateSingleGRNPdf(invData) {
        const { default: JsPDFCtor } = await import("jspdf");
        await import("jspdf-autotable");

        function formatNumber(value) {
            if (value === null || value === undefined || value === "") return "";
            const num = Number(value);
            return isNaN(num) ? value : num.toFixed(3);
        }

        const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
        const logoUrl = `${baseUrl}/${invData.companyImage}`;
        const IsoUrl = (await import("../../../AllImage/Picture.png")).default;

        const doc = new JsPDFCtor({ compress: true });
        const totalPagesExp = "{totalPages}";

        let info = invData.items.map((item, index) => [
            index + 1,
            item.description,
            item.uom,
            item.mainPoNo,
            formatNumber(item.poQty),
            formatNumber(item.invQty),
            formatNumber(item.rcvdQty),
            formatNumber(item.accQty),
            formatNumber(item.rejQty),
            item.itemRemarks || ""
        ]);


        // ---------------- PUSH EMPTY ROWS ----------------
        const paddingNeeded = emptyRowsToPush(info.length);
        for (let i = 0; i < paddingNeeded; i++) {
            info.push(["", "", "", "", "", "", "", "", "", ""]);
        }
        const tableOptions = {
            didDrawPage: (HookData) => {
                // Check if it's the first page
                if (HookData.pageNumber === 1) {
                    // Add an image on the first page
                    doc.addImage(logoUrl, "PNG", 25, 15, 28, 20);
                    doc.addImage(IsoUrl, "PNG", 160, 15, 35, 20);
                } else {
                    // From second page onward, show header
                    doc.setFontSize(10);
                    doc.setTextColor("blue");
                    doc.setFont("times", "bold");
                    doc.text(
                        `Puchase Bill No : ${invData.poNo}     |     Date : ${invData.date}`,
                        14,
                        8
                    ); // Adjust Y pos as needed
                    doc.setDrawColor(0);
                }

                // PAGE NUMBER
                const pageSize = doc.internal.pageSize;
                const pageWidth = pageSize.width || pageSize.getWidth();
                const pageHeight = pageSize.height || pageSize.getHeight();

                doc.setFontSize(8);
                doc.setTextColor(70);
                // Left-aligned footer text
                doc.text(
                    `FORMAT NO:IMS-ME-PUR-F-220-Rev-2 Dated 14-01-2019`,
                    14, // X position (left margin)
                    pageHeight - 10
                );

                // Right-aligned page number
                doc.text(
                    `Page ${HookData.pageNumber} of ${totalPagesExp}`,
                    pageWidth - 14, // X position (right margin)
                    pageHeight - 10,
                    { align: "right" } // Align text to the right
                );
            },
        };
        // At end return PDF BLOB
        const logoAndAddress = [
            [
                {
                    content: ``,
                    colSpan: 2,
                    styles: {
                        halign: "left",
                        fontSize: 8,
                        textColor: "black",
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    },
                },
                {
                    content: `${invData?.companyName}\n${invData?.companyAdd}. Tel:${invData?.telNo}\nWeb Site :${invData?.website}\nEmail : ${invData?.email}`,
                    colSpan: 8,
                    styles: {
                        halign: "left",
                        fontSize: 8,
                        textColor: "black",
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    },
                },
            ],
            [
                {
                    content: `PAN No: ${invData?.cmpPanNo}`,
                    colSpan: 2,
                    styles: {
                        fontSize: 8,
                        textColor: "black" /*valign: 'top',*/,
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    },
                },
                {
                    content: `CIN No:  ${invData?.cmpCinNo}`,
                    colSpan: 4,
                    styles: {
                        fontSize: 8,
                        textColor: "black" /*valign: 'top',*/,
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    },
                },
                {
                    content: `GSTINO:  ${invData?.cmpGstNo}`,
                    colSpan: 4,
                    styles: {
                        fontSize: 8,
                        textColor: "black" /*valign: 'top',*/,
                        lineWidth: { top: 0.2, right: 0.2, bottom: 0.2, left: 0.2 },
                        lineColor: { top: [0, 0, 0] },
                    },
                },
            ],
        ];

        const poHeader = [
            [
                {
                    content:
                        invData.type === "R"
                            ? `GOODS RECEIPT NOTE - INPUT`
                            : `GOODS RECEIPT NOTE - SERVICE`,
                    colSpan: 10,
                    styles: {
                        lineWidth: 0,
                        textColor: "#000000", // dark text on light background
                        fontStyle: "bold",
                        fontWeight: "bold",
                        fillColor: [200, 210, 255],
                        fontSize: 8,
                    },
                },
            ],
        ];
        const address = [
            [
                {
                    content: `SUPPLIER NAME :\n${invData?.suppName}\n#${invData?.spAddress}\n${invData?.state}\n${invData?.country}`,
                    colSpan: 6,
                    rowSpan: 6,
                    styles: {
                        halign: "left",
                        valign: "top",
                        fontSize: 10,
                        textColor: "black",
                        fontStyle: "normal",
                    },
                },
                {
                    content: `GRN No :`,
                    colSpan: 2,
                    styles: { halign: "left", fontSize: 8 },
                },
                {
                    content: `${invData.grnRefNO}`,
                    colSpan: 2,
                    styles: { halign: "left", fontSize: 8, textColor: "blue" },
                },
            ],
            [
                {
                    content: "GRN Date :",
                    colSpan: 2,
                    styles: { halign: "left", fontSize: 8 },
                },
                {
                    content: `${invData.date}`,
                    colSpan: 2,
                    styles: { halign: "left", fontSize: 8, textColor: "blue" },
                },
            ],
            [
                {
                    content: "PB No :",
                    colSpan: 2,
                    styles: { halign: "left", fontSize: 8 },
                },
                {
                    content: `${invData.poNo}`,
                    colSpan: 2,
                    styles: { halign: "left", fontSize: 8, textColor: "blue" },
                },
            ],
            [
                {
                    content: "IR No :",
                    colSpan: 2,
                    styles: { halign: "left", fontSize: 8 },
                },
                {
                    content: `${invData.irNo}`,
                    colSpan: 2,
                    styles: { halign: "left", fontSize: 8, textColor: "blue" },
                },
            ],
            [
                {
                    content: "CAR No:",
                    colSpan: 2,
                    styles: { halign: "left", fontSize: 8 },
                },
                {
                    content: `${invData.carNo}`,
                    colSpan: 2,
                    styles: { halign: "left", fontSize: 8, textColor: "blue" },
                },
            ],
            [
                {
                    content: "BIN No:",
                    colSpan: 2,
                    styles: { halign: "left", fontSize: 8 },
                },
                {
                    content: `${invData.binNo}`,
                    colSpan: 2,
                    styles: { halign: "left", fontSize: 8, textColor: "blue" },
                },
            ],
        ];

        const threeCell = [
            [
                {
                    content: `BOE No : ${invData?.boeNo}`,
                    colSpan: 2,
                    styles: {
                        halign: "left",
                        fontSize: 8,
                        textColor: "black",
                        fontStyle: "normal",
                    },
                },
                {
                    content: `Supp Invoice No : ${invData?.suppInvNo}`,
                    colSpan: 4,
                    styles: {
                        halign: "left",
                        fontSize: 8,
                        textColor: "black",
                        fontStyle: "normal",
                    },
                },
                {
                    content: `Supp DC No : ${invData?.csSuppDcNo}`,
                    colSpan: 4,
                    styles: {
                        halign: "left",
                        fontSize: 8,
                        textColor: "black",
                        fontStyle: "normal",
                    },
                },
            ],
            [
                {
                    content: `BOE Date : ${invData?.boeDate}`,
                    colSpan: 2,
                    styles: {
                        halign: "left",
                        fontSize: 8,
                        textColor: "black",
                        fontStyle: "normal",
                    },
                },
                {
                    content: `Supp Invoice Date : ${invData?.suppInvoiceDate}`,
                    colSpan: 4,
                    styles: {
                        halign: "left",
                        fontSize: 8,
                        textColor: "black",
                        fontStyle: "normal",
                    },
                },
                {
                    content: `Supp DC Date : ${invData?.suppDcDate}`,
                    colSpan: 4,
                    styles: {
                        halign: "left",
                        fontSize: 8,
                        textColor: "black",
                        fontStyle: "normal",
                    },
                },
            ],
        ];

        // const firstHeaderRow = [[{ content: 'We are pleased to place an order for the following items, subject to the terms & conditions given below', colSpan: 8 }]];

        const secondHeaderRow = [
            [
                "SI No",
                "Description Of Goods",
                "UOM",
                "PONo",
                "PO Qty",
                "Inv Qty",
                "Rec Qty",
                "Acc Qty",
                "Rej Qty",
                "Remarks",
            ],
        ];

        const headerRows = [
            ...logoAndAddress,
         /* ...pan, */ ...poHeader,
            ...address,
            ...threeCell /* firstHeaderRow  ...firstHeaderRow*/,
            ...secondHeaderRow,
        ];


        const GstTaxAmount = [
            // Coolie
            ...(invData?.coolie.length > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        }, // increased from 6 → 7
                        {
                            content: "Coolie :",
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        }, // same
                        {
                            content: `${Number(invData?.coolie || 0).toLocaleString(
                                "en-IN"
                            )}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        }, // reduced from 2 → 1
                    ],
                ]
                : []),

            // Discount
            ...(invData?.lessDiscount.length > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: "Discount :",
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(
                                invData?.lessDiscount || 0
                            ).toLocaleString("en-IN")}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // Transport
            ...(invData?.transport.length > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: "Transport :",
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(
                                invData?.transport || 0
                            ).toLocaleString("en-IN")}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // Total Quantity
            ...(invData?.totalQty.length > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: "Total Qty :",
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(
                                invData?.totalQty || 0
                            ).toLocaleString("en-IN")}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // Sub Total
            ...(Math.max(Number(invData.subTotal), 0) > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: "Sub Total :",
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(
                                invData?.subTotal || 0
                            ).toLocaleString("en-IN")}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // TDS
            ...(Math.max(Number(invData.tds), 0) > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: "TDS :",
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(invData?.tds || 0).toLocaleString(
                                "en-IN"
                            )}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // TCS
            ...(Math.max(Number(invData.tcs), 0) > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: "TCS :",
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(invData?.tcs || 0).toLocaleString(
                                "en-IN"
                            )}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // GST Types (IGST or CGST + SGST)
            ...(gstType === "IGST"
                ? [
                    ...(Number(invData?.igstPer || 0) > 0
                        ? [
                            [
                                {
                                    content: "",
                                    colSpan: 7,
                                    styles: { halign: "left", fontSize: 8 },
                                },
                                {
                                    content: `IGST @ ${invData?.igstPer}%`,
                                    colSpan: 2,
                                    styles: { halign: "left", fontSize: 8 },
                                },
                                {
                                    content: `${Number(
                                        invData?.igst || 0
                                    ).toLocaleString("en-IN")}`,
                                    colSpan: 1,
                                    styles: {
                                        halign: "right",
                                        fontSize: 8,
                                        textColor: "blue",
                                    },
                                },
                            ],
                        ]
                        : []),

                    ...(Number(invData?.utgstPer || 0) > 0
                        ? [
                            [
                                {
                                    content: "",
                                    colSpan: 7,
                                    styles: { halign: "left", fontSize: 8 },
                                },
                                {
                                    content: `UTGST @ ${invData?.utgstPer}%`,
                                    colSpan: 2,
                                    styles: { halign: "left", fontSize: 8 },
                                },
                                {
                                    content: `${Number(
                                        invData?.utgst || 0
                                    ).toLocaleString("en-IN")}`,
                                    colSpan: 1,
                                    styles: {
                                        halign: "right",
                                        fontSize: 8,
                                        textColor: "blue",
                                    },
                                },
                            ],
                        ]
                        : []),
                ]
                : [
                    ...(Number(invData?.cgstPer || 0) > 0
                        ? [
                            [
                                {
                                    content: "",
                                    colSpan: 7,
                                    styles: { halign: "left", fontSize: 8 },
                                },
                                {
                                    content: `CGST @ ${invData?.cgstPer}%`,
                                    colSpan: 2,
                                    styles: { halign: "left", fontSize: 8 },
                                },
                                {
                                    content: `${Number(
                                        invData?.cgst || 0
                                    ).toLocaleString("en-IN")}`,
                                    colSpan: 1,
                                    styles: {
                                        halign: "right",
                                        fontSize: 8,
                                        textColor: "blue",
                                    },
                                },
                            ],
                        ]
                        : []),

                    ...(Number(invData?.sgstPer || 0) > 0
                        ? [
                            [
                                {
                                    content: "",
                                    colSpan: 7,
                                    styles: { halign: "left", fontSize: 8 },
                                },
                                {
                                    content: `SGST @ ${invData?.sgstPer}%`,
                                    colSpan: 2,
                                    styles: { halign: "left", fontSize: 8 },
                                },
                                {
                                    content: `${Number(
                                        invData?.sgst || 0
                                    ).toLocaleString("en-IN")}`,
                                    colSpan: 1,
                                    styles: {
                                        halign: "right",
                                        fontSize: 8,
                                        textColor: "blue",
                                    },
                                },
                            ],
                        ]
                        : []),
                ]),

            // Import GST
            ...(Number(invData?.importGstPer || 0) > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `Import GST @ ${invData?.importGstPer}%`,
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(
                                invData?.importGST || 0
                            ).toLocaleString("en-IN")}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // BCD
            ...(Number(invData?.bcdPer || 0) > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `BCD @ ${invData?.bcdPer}%`,
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(invData?.bcd || 0).toLocaleString(
                                "en-IN"
                            )}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // Subtotal INS & Freight
            // ...(Math.max(Number(invData.subTotalINSAndFreight), 0) > 0 ? [[
            //     { content: '', colSpan: 7, styles: { halign: 'left', fontSize: 8 } },
            //     { content: 'Subtotal INS & Freight ', colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
            //     { content: `${Number(invData?.subTotalINSAndFreight || 0).toLocaleString('en-IN')}`, colSpan: 1, styles: { halign: 'right', fontSize: 8, textColor: 'blue' } }
            // ]] : []),
            // Subtotal INS & Freight
            ...(Math.max(Number(invData.miscCharges), 0) > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: "Misc Charges ",
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(
                                invData?.miscCharges || 0
                            ).toLocaleString("en-IN")}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // Social Welfare Charges
            ...(Number(invData?.swcPer || 0) > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `Social Welfare Charges @ ${invData?.swcPer}%`,
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(
                                invData?.socialWelfareCharges || 0
                            ).toLocaleString("en-IN")}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // Insurance
            ...(Number(invData?.insurancePer || 0) > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `Insurance @ ${invData?.insurancePer}%`,
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(
                                invData?.insurance || 0
                            ).toLocaleString("en-IN")}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // Freight
            ...(invData?.freight.length > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: "Freight ",
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(invData?.freight || 0).toLocaleString(
                                "en-IN"
                            )}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // Total with GST
            ...(Math.max(Number(invData.total), 0) > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: "Total ",
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(
                                invData?.total || 0
                            ).toLocaleString("en-IN")}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // // Subtotal SW & BCD
            // ...(Math.max(Number(invData.subTotalSwAndBCD), 0) > 0 ? [[
            //     { content: '', colSpan: 7, styles: { halign: 'left', fontSize: 8 } },
            //     { content: 'Subtotal SW & BCD ', colSpan: 2, styles: { halign: 'left', fontSize: 8 } },
            //     { content: `${Number(invData?.subTotalSwAndBCD || 0).toLocaleString('en-IN')}`, colSpan: 1, styles: { halign: 'right', fontSize: 8, textColor: 'blue' } }
            // ]] : []),

            // Freight Charges
            ...(Math.max(Number(invData.freight), 0) > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: "Freight Charges ",
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(invData?.freight || 0).toLocaleString(
                                "en-IN"
                            )}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),
            // Local Clearance Charges
            ...(Math.max(Number(invData.localClearanceCharges), 0) > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: "Local Clearance Charges ",
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(
                                invData?.localClearanceCharges || 0
                            ).toLocaleString("en-IN")}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // Others
            ...(invData?.others.length > 0
                ? [
                    [
                        {
                            content: "",
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: "Other",
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(invData?.others || 0).toLocaleString(
                                "en-IN"
                            )}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),

            // Grand Total + Remarks
            ...(invData?.grandTotal.length > 0
                ? [
                    [
                        {
                            content: `PB Remarks: ${invData?.remarks}\nQA Remarks: ${invData?.qcRemarks}`,
                            colSpan: 7,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: "Grand Total :",
                            colSpan: 2,
                            styles: { halign: "left", fontSize: 8 },
                        },
                        {
                            content: `${Number(
                                invData?.grandTotal || 0
                            ).toLocaleString("en-IN")}`,
                            colSpan: 1,
                            styles: { halign: "right", fontSize: 8, textColor: "blue" },
                        },
                    ],
                ]
                : []),
        ];

        const userData = [
            [
                {
                    content: `Prepared By ${invData?.user || ""}`,
                    colSpan: 2,
                    styles: {
                        halign: "center",
                        fontSize: 8,
                        textColor: "black",
                        fontStyle: "normal",
                        cellPadding: { top: 13, bottom: 3 },
                    },
                },
                {
                    content: `QA Approved ${invData?.qcAuthorizeBy}`,
                    colSpan: 3,
                    styles: {
                        halign: "center",
                        fontSize: 8,
                        textColor: "black",
                        fontStyle: "normal",
                        cellPadding: { top: 13, bottom: 3 },
                    },
                },
                {
                    content: `Stores in Charge`,
                    colSpan: 3,
                    styles: {
                        halign: "center",
                        fontSize: 8,
                        textColor: "black",
                        fontStyle: "normal",
                        valign: "bottom",
                        cellPadding: { top: 13, bottom: 3 },
                    },
                },
                {
                    content: `Authorised By`,
                    colSpan: 2,
                    styles: {
                        halign: "center",
                        fontSize: 8,
                        textColor: "black",
                        fontStyle: "normal",
                        valign: "bottom",
                        cellPadding: { top: 13, bottom: 3 },
                    },
                },
            ],
        ];

        const footerData = [
            [
                {
                    content: `FORMAT NO:IMS-ME-PUR-F-220-Rev-2 Dated 14-01-2019`,
                    colSpan: 10,
                    styles: {
                        halign: "left",
                        fontSize: 8,
                        textColor: "black",
                        fontStyle: "normal",
                    },
                },
            ],

        ];


        const outerTable1 = [
            [
                {
                    content:
                        "Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076",
                    colSpan: 8,
                    styles: {
                        halign: "left",
                        fontSize: 7,
                        textColor: "black",
                        fontStyle: "normal",
                        lineWidth: 0,
                        lineWidth: { top: 0.2, right: 0, bottom: 0, left: 0 },
                        lineColor: { top: [0, 0, 0] },
                    },
                    //  styles: {
                    //     halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal',
                    //     lineWidth: { top: 0.5, right: 0, bottom: 0, left: 0 },
                    //     lineColor: { top: [0, 0, 0] },
                    //     cellPadding: { top: 20, bottom: 3 }, // ⬅️ Add padding for spacing

                    // }
                },
            ],
            [
                {
                    content:
                        "Branch Address: Plot No. 98-I, Road No. 6, KIADB Jigani Industrial Estate, 2nd Phase, Jigani, Anekal Tq, Bangalore - 560105.",
                    colSpan: 8,
                    styles: {
                        halign: "left",
                        fontSize: 7,
                        textColor: "black",
                        fontStyle: "normal",
                        lineWidth: 0,
                    },
                },
            ],
        ];
        const bodyRows = [
            ...info,
            ...GstTaxAmount /*...userData, /*...footerData ...totalWords, ...termsAndSuppluColumn, ...requirements, ...para, ...users, ...note*/,
        ];
        const footRows = [...userData];
        const footRowssepearte = [...outerTable1];

        doc.autoTable({
            theme: "striped",
            head: headerRows,
            body: bodyRows,
            // foot: footRows,
            showHead: "firstPage",
            showFoot: "lastPage",
            ...tableOptions,
            headStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0], // Header text color
                halign: "center", // Header text alignment
                valign: "middle", // Vertical alignment
                lineWidth: 0.1, // Border width
                lineColor: [0, 0, 0], // Border color,
                font: "times",
                fontSize: 8,
            },
            bodyStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0], // Header text color
                halign: "left", // Header text alignment
                valign: "middle", // Vertical alignment
                lineWidth: 0.1, // Border width
                lineColor: [0, 0, 0], // Border color
                fontStyle: "normal",
                fontSize: 7,
                font: "times",
                cellWidth: "wrap",
            },
            columnStyles: {
                1: { cellWidth: 50 }, // ✅ wrap only this column
                9: { cellWidth: 20 }, // ✅ wrap only this column
                // other columns can remain default
            },
            footStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0], // Header text color
                halign: "center", // Header text alignment
                valign: "middle", // Vertical alignment
                lineWidth: 0.1, // Border width
                lineColor: [0, 0, 0], // Border color
                font: "times",
            },
            didDrawPage: function (data) {
                if (data.pageNumber === 1) {
                    // ✅ First page logo/header
                    doc.addImage(logoUrl, "PNG", 22, 18, 28, 15);
                    doc.addImage(IsoUrl, "PNG", 160, 15, 35, 20);
                } else {
                    const headerHeight = 10; // Adjust height of your repeated header

                    // ✅ Repeat secondHeaderRow manually on all pages after 1
                    const headers = [
                        "SI No",
                        "Description Of Goods",
                        "UOM",
                        "PONo",
                        "PO Qty",
                        "Inv Qty",
                        "Rec Qty",
                        "Acc Qty",
                        "Rej Qty",
                        "Remarks",
                    ];
                    const startX = data.settings.margin.left;
                    let y = data.settings.margin.top - headerHeight; // 🔥 fixed: start from top margin

                    doc.setFont("times", "bold");
                    doc.setFontSize(8);
                    doc.setTextColor(0);

                    let x = startX;
                    data.table.columns.forEach((col, i) => {
                        const width = col.width; // use actual column width
                        doc.rect(x, y, width, 10);
                        doc.text(headers[i].trim(), x + width / 2, y + 6, {
                            align: "center",
                            baseline: "middle",
                        });
                        x += width;
                    });

                    doc.setFontSize(8);
                    doc.setFont("times", "bold");
                    doc.setTextColor("blue");
                    doc.text(
                        `Puchase Bill No : ${invData.poNo}     |     Date : ${invData.date}`,
                        14,
                        3
                    ); // Adjust Y pos as needed
                }
                const pageSize = doc.internal.pageSize;
                const pageWidth = pageSize.width || pageSize.getWidth();
                const pageHeight = pageSize.height || pageSize.getHeight();

                doc.setFontSize(8);
                doc.setTextColor(70);
                doc.text(
                    "FORMAT NO:IMS-ME-PUR-F-220-Rev-2 Dated 14-01-2019",
                    14,
                    pageHeight - 10
                );
                doc.text(
                    `Page ${data.pageNumber} of ${totalPagesExp}`,
                    pageWidth - 14,
                    pageHeight - 10,
                    { align: "right" }
                );
            },
            didParseCell: function (data) {
                if (data.section === "body") {
                    data.cell.styles.overflow = "linebreak";
                    data.cell.styles.fillColor = false;

                    const rightAlignColumns = [2, 3, 4, 5, 6, 7, 8, 9];

                    // ✅ Only apply right alignment if column is in the list AND colSpan === 1 (i.e., regular numeric cell)
                    if (
                        rightAlignColumns.includes(data.column.index) &&
                        !(data.cell.colSpan > 1)
                    ) {
                        data.cell.styles.halign = "right";
                    }
                }
            },
        });

        doc.autoTable({
            theme: "striped",
            head: footRows,
            startY: doc.lastAutoTable.finalY,
            headStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0], // Header text color
                halign: "center", // Header text alignment
                valign: "middle", // Vertical alignment
                lineWidth: 0.1, // Border width
                lineColor: [0, 0, 0], // Border color,
                font: "times",
            },
        });
        doc.autoTable({
            theme: "striped",
            head: footRowssepearte,
            startY: doc.lastAutoTable.finalY,
            headStyles: {
                fillColor: [255, 255, 255], // Header background color
                textColor: [0, 0, 0], // Header text color
                halign: "center", // Header text alignment
                valign: "middle", // Vertical alignment
                lineWidth: 0.1, // Border width
                lineColor: [0, 0, 0], // Border color,
                font: "times",
            },
        });
        // PAGE NUMBER
        if (typeof doc.putTotalPages === "function") {
            doc.putTotalPages(totalPagesExp); // This replaces "{totalPages}" in all pages
        }

        // doc.save('PurchaseOrder.pdf');
        const pdfBlob = doc.output("blob");
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfBlobUrl);

        return doc.output("blob");
    }


    function groupInvoices(data) {
        const grouped = {};

        data.forEach(item => {
            const key = item.grnRefNO; // invoice unique reference

            if (!grouped[key]) {
                grouped[key] = {
                    ...item,   // take header once
                    items: []  // push multiple rows here
                };
            }

            grouped[key].items.push({
                description: item.description,
                uom: item.uom,
                mainPoNo: item.mainPoNo,
                poQty: item.poQty,
                invQty: item.invQty,
                rcvdQty: item.rcvdQty,
                accQty: item.accQty,
                rejQty: item.rejQty,
                itemRemarks: item.itemRemarks
            });
        });

        return Object.values(grouped);
    }

    const handlePrintClick = async () => {
        if (!invoiceData || invoiceData.length === 0) {
            alert("No invoice selected!");
            return;
        }

        setPdfModalOpen(true);

        const pdfParts = [];

        // 🔥 Loop selected invoices and build individual PDF Blobs
        // for (const inv of invoiceData) {
        const groupedData = groupInvoices(invoiceData);

        for (const inv of groupedData) {

            const blob = await generateSingleGRNPdf(inv);
            pdfParts.push(blob);
        }

        // 🧩 Merge PDFs
        const mergedDoc = await PDFDocument.create();

        for (const blob of pdfParts) {
            const arrayBuffer = await blob.arrayBuffer();
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedDoc.copyPages(pdf, pdf.getPageIndices());

            copiedPages.forEach((p) => mergedDoc.addPage(p));
        }

        const mergedBytes = await mergedDoc.save();
        const finalBlob = new Blob([mergedBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(finalBlob);

        setPdfUrl(url);
    };

    return (
        <Box sx={{ height: 400, width: '100%', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '20px' }}>
                <Link to='/PurchaseBillWithoutPOModule' style={{ textDecoration: 'none' }}>
                    <Typography
                        sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                        variant="h5"
                    >
                        {`View Purchase Bill Without PO >>`}
                    </Typography>
                </Link>
                <Typography style={{ textAlign: 'left', fontSize: '18px', fontWeight: 'bold' }}>Multi Purchase Bill Without PO Invoice</Typography>
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

                <Grid item xs={2} sm={12} md={2.5} lg={2.5}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={printingDoc} onChange={(e) => setPrintingDoc(e.target.checked)} />} label="Include Printed Docs Also" style={
                            { display: 'flex', alignItems: 'center', justifyContent: 'center' }
                        } />
                    </FormGroup>
                </Grid>
                <Grid item xs={12} sm={12} md={1} lg={1}>
                    <Button fullWidth variant="contained" style={{ backgroundColor: '#002D68', marginRight: '15px', marginTop: '2px' }} onClick={handleView}>View</Button>
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
                                handlePrintClick()
                                setPdfModalOpen(true);
                            }}
                            disabled={invoiceData.length < 1}
                        >
                            Multi Invoice Print
                        </Button>


                    </div>
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
                    {pdfUrl && (
                        <embed
                            src={pdfUrl}
                            type="application/pdf"
                            width="100%"
                            height="600px"
                        />
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

        </Box>)
}

export default PurchaseBillWithoutMultiPrint
