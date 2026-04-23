import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { getGstSaleInvoiceList, getGstSaleInvoicePayload, GSTSalesShowData, StoreGstSaleInvoiceResponse } from '../../../ApiService/LoginPageService';
import { Button, Card, CardActions, CardContent, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, Grid, Modal, Radio, RadioGroup, TextField, Tooltip, Typography } from '@mui/material';
import NotificationBar from '../../GlobleFiles/ServiceNotificationBar';
import { useModuleLocks } from '../../context/ModuleLockContext';

const GenerateElectronicInvoice = () => {
    const [selectedRows, setSelectedRows] = React.useState([]);
    // const moduleLocks = JSON.parse(localStorage.getItem("moduleLocks") || "[]");
    // const isModuleLocked = moduleLocks.find(
    //     (m) => m.moduleName === "Generate E-Invoice"
    // )?.lockStatus === "locked";
    const moduleLocks = useModuleLocks();
    const isModuleLocked =
        moduleLocks.find(m => m.moduleName === "Generate E-Invoice")?.lockStatus === "locked";

    const [activeButton, setActiveButton] = useState("");
    const getHighlightStyle = (name, baseStyle = {}, disabled = false) => ({
        ...baseStyle,
        backgroundColor: disabled
            ? "grey"
            : activeButton === name
                ? "#0d6efd"
                : baseStyle.backgroundColor,
        transition: "0.3s",
        color: "white",
    });

    const today = new Date().toISOString().split("T")[0];
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setTodate] = useState(today);
    const [selectedFilterRadio, setSelectedFilterRadio] = useState('Today');
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
    const [pendingOnly, setPendingOnly] = useState(true);
    const [rows, setRows] = useState([]);
    const [payloadData, setPayloadData] = useState([]);
    const [apiStatus, setApiStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generateLoader, setGenerateLoader] = useState(false);

    const columns = [
        {
            field: 'docType',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    DocType
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'invNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    DocNo
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'date',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    DocDate
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'cName',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Party Name
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'gstNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Party GSTIN
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'totalValue',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Doc Value
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'Status',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    E-Status
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'Err-Msg',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Err-Msg
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'AckDt',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    ACK Date
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'AckNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    ACKNO
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'IRN',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    IRNNo
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'EwbNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    EWBILLNO
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'JSONfile',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    JSONfile
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        {
            field: 'trType',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    EDOCID
                </span>
            , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
        },
        // {
        //     field: 'actions',
        //     headerClassName: 'super-app-theme--header',
        //     type: 'actions',
        //     flex: 1,
        //     headerName: (
        //         <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
        //             Actions
        //         </span>),
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         <ViewData selectedRow={params.row.id} />,
        //     ],
        // },
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

    const handleGstListSuccess = (dataObject) => {
        setRows(dataObject?.data || [])
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }
    const handleGstInvoiceException = () => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

    const handleRowSelection = (selectionModel) => {
        // Find the selected rows based on IDs
        const selectedData = rows.filter(row => selectionModel.includes(row.id));
        setSelectedRows(selectedData);
        // GET PAYLOAD DATA ON CHECKBOX SELECTION
        getGstSaleInvoicePayload({ polist: selectionModel }, handleGetPayloadSuccess, handleGetPayloadException)
    };

    // const handleGetPayloadSuccess = (dataObject) => {
    //     setPayloadData(dataObject?.data || [])
    // }

    const handleGetPayloadSuccess = (dataObject) => {
        const cleanedData = (dataObject?.data || []).map(invoiceData => {
            const vehNo = invoiceData?.EwbDtls?.VehNo?.trim();
            const totInvVal = invoiceData?.valDtls?.TotInvVal;

            const shouldIncludeEwbDtls = vehNo && vehNo !== '' && totInvVal >= 50000;

            if (!shouldIncludeEwbDtls) {
                // Remove EwbDtls if condition not met
                const { EwbDtls, ...rest } = invoiceData;
                return rest;
            }

            return invoiceData;
        });

        setPayloadData(cleanedData);
    };

    const handleGetPayloadException = () => {
        setPayloadData([]);
    }

    // const sendInvoiceData = async () => {
    //     // if (selectedRows.length === 0) {
    //     //     alert("Please select at least one row!");
    //     //     return;
    //     // }

    //     const payload = {
    //         "Version": "1.1",
    //         "TranDtls": {
    //             "TaxSch": "GST",
    //             "SupTyp": "B2B",
    //             "RegRev": "N",
    //             "IgstOnIntra": "N"
    //         },
    //         "DocDtls": {
    //             "Typ": "INV",
    //             "No": "23-24/DEM/54",
    //             "Dt": "22/03/2024"
    //         },
    //         "SellerDtls": {
    //             "Gstin": "29AADCG4992P1ZP",
    //             "LglNm": "GSTZEN DEMO PRIVATE LIMITED",
    //             "Addr1": "Manyata Tech Park",
    //             "Loc": "BANGALORE",
    //             "Pin": 560077,
    //             "Stcd": "29"
    //         },
    //         "BuyerDtls": {
    //             "Gstin": "06AAMCS8709B1ZA",
    //             "LglNm": "Quality Products Private Limited",
    //             "Pos": "06",
    //             "Addr1": "133, Mahatma Gandhi Road",
    //             "Loc": "HARYANA",
    //             "Pin": 121009,
    //             "Stcd": "06"
    //         },
    //         "DispDtls": {
    //             "Nm": "Maharashtra Storage",
    //             "Addr1": "133, Mahatma Gandhi Road",
    //             "Loc": "Bhiwandi",
    //             "Pin": 400001,
    //             "Stcd": "27"
    //         },
    //         "ShipDtls": {
    //             "Gstin": "URP",
    //             "LglNm": "Quality Products Construction Site",
    //             "Addr1": "Anna Salai",
    //             "Loc": "Chennai",
    //             "Pin": 600001,
    //             "Stcd": "33"
    //         },
    //         "ItemList": [
    //             {
    //                 "ItemNo": 0,
    //                 "SlNo": "1",
    //                 "IsServc": "N",
    //                 "PrdDesc": "Computer Hardware - Keyboard and Mouse",
    //                 "HsnCd": "84313910",
    //                 "Qty": 25,
    //                 "FreeQty": 0,
    //                 "Unit": "PCS",
    //                 "UnitPrice": 200,
    //                 "TotAmt": 5000,
    //                 "Discount": 0,
    //                 "PreTaxVal": 0,
    //                 "AssAmt": 5000,
    //                 "GstRt": 18,
    //                 "IgstAmt": 900,
    //                 "CgstAmt": 0,
    //                 "SgstAmt": 0,
    //                 "CesRt": 0,
    //                 "CesAmt": 0,
    //                 "CesNonAdvlAmt": 0,
    //                 "StateCesRt": 0,
    //                 "StateCesAmt": 0,
    //                 "StateCesNonAdvlAmt": 0,
    //                 "OthChrg": 0,
    //                 "TotItemVal": 5900
    //             }
    //         ],
    //         "ValDtls": {
    //             "AssVal": 5000,
    //             "CgstVal": 0,
    //             "SgstVal": 0,
    //             "IgstVal": 900,
    //             "CesVal": 0,
    //             "StCesVal": 0,
    //             "Discount": 0,
    //             "OthChrg": 0,
    //             "RndOffAmt": 0,
    //             "TotInvVal": 59000
    //         }
    //     };

    //      try {
    //         const response = await fetch("https://my.gstzen.in/~gstzen/a/post-einvoice-data/einvoice-json/", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Token": "de3a3a01-273a-4a81-8b75-13fe37f14dc6"
    //             },
    //             body: JSON.stringify(payload)
    //         });

    //         const data = await response.json();
    //         console.log("Response:", data);
    //         setNotification({
    //             status: true,
    //             type: 'success',
    //             message: data.message,
    //         });
    //     } catch (error) {
    //         console.error("Error:", error);
    //         setNotification({
    //             status: true,
    //             type: 'error',
    //             message: error.message,
    //         });
    //     }
    // };

    const sendInvoiceData = async () => {
        // if (selectedRows.length === 0) {
        //     alert("Please select at least one row!");
        //     return;
        // }

        // const payloadArray = [{
        //     "Version": "1.1",
        //     "TranDtls": {
        //         "TaxSch": "GST",
        //         "SupTyp": "B2B",
        //         "RegRev": "N",
        //         "IgstOnIntra": "N"
        //     },
        //     "DocDtls": {
        //         "Typ": "INV",
        //         "No": "23-24/DEM/90",
        //         "Dt": "22/03/2024"
        //     },
        //     "SellerDtls": {
        //         "Gstin": "29AADCG4992P1ZP",
        //         "LglNm": "GSTZEN DEMO PRIVATE LIMITED",
        //         "Addr1": "Manyata Tech Park",
        //         "Loc": "BANGALORE",
        //         "Pin": 560077,
        //         "Stcd": "29"
        //     },
        //     "BuyerDtls": {
        //         "Gstin": "06AAMCS8709B1ZA",
        //         "LglNm": "Quality Products Private Limited",
        //         "Pos": "06",
        //         "Addr1": "133, Mahatma Gandhi Road",
        //         "Loc": "HARYANA",
        //         "Pin": 121009,
        //         "Stcd": "06"
        //     },
        //     "DispDtls": {
        //         "Nm": "Maharashtra Storage",
        //         "Addr1": "133, Mahatma Gandhi Road",
        //         "Loc": "Bhiwandi",
        //         "Pin": 400001,
        //         "Stcd": "27"
        //     },
        //     "ShipDtls": {
        //         "Gstin": "URP",
        //         "LglNm": "Quality Products Construction Site",
        //         "Addr1": "Anna Salai",
        //         "Loc": "Chennai",
        //         "Pin": 600001,
        //         "Stcd": "33"
        //     },
        //     "ItemList": [
        //         {
        //             "ItemNo": 0,
        //             "SlNo": "1",
        //             "IsServc": "N",
        //             "PrdDesc": "Computer Hardware - Keyboard and Mouse",
        //             "HsnCd": "84313910",
        //             "Qty": 25,
        //             "FreeQty": 0,
        //             "Unit": "PCS",
        //             "UnitPrice": 200,
        //             "TotAmt": 5000,
        //             "Discount": 0,
        //             "PreTaxVal": 0,
        //             "AssAmt": 5000,
        //             "GstRt": 18,
        //             "IgstAmt": 900,
        //             "CgstAmt": 0,
        //             "SgstAmt": 0,
        //             "CesRt": 0,
        //             "CesAmt": 0,
        //             "CesNonAdvlAmt": 0,
        //             "StateCesRt": 0,
        //             "StateCesAmt": 0,
        //             "StateCesNonAdvlAmt": 0,
        //             "OthChrg": 0,
        //             "TotItemVal": 5900
        //         }
        //     ],
        //     "ValDtls": {
        //         "AssVal": 5000,
        //         "CgstVal": 0,
        //         "SgstVal": 0,
        //         "IgstVal": 900,
        //         "CesVal": 0,
        //         "StCesVal": 0,
        //         "Discount": 0,
        //         "OthChrg": 0,
        //         "RndOffAmt": 0,
        //         "TotInvVal": 5900
        //     }
        // },
        // {
        //     "Version": "1.1",
        //     "TranDtls": {
        //         "TaxSch": "GST",
        //         "SupTyp": "B2B",
        //         "RegRev": "N",
        //         "IgstOnIntra": "N"
        //     },
        //     "DocDtls": {
        //         "Typ": "INV",
        //         "No": "23-24/DEM/300",
        //         "Dt": "22/03/2024"
        //     },
        //     "SellerDtls": {
        //         "Gstin": "29AADCG4992P1ZP",
        //         "LglNm": "GSTZEN DEMO PRIVATE LIMITED",
        //         "Addr1": "Manyata Tech Park",
        //         "Loc": "BANGALORE",
        //         "Pin": 560077,
        //         "Stcd": "29"
        //     },
        //     "BuyerDtls": {
        //         "Gstin": "06AAMCS8709B1ZA",
        //         "LglNm": "Quality Products Private Limited",
        //         "Pos": "06",
        //         "Addr1": "133, Mahatma Gandhi Road",
        //         "Loc": "HARYANA",
        //         "Pin": 121009,
        //         "Stcd": "06"
        //     },
        //     "DispDtls": {
        //         "Nm": "Maharashtra Storage",
        //         "Addr1": "133, Mahatma Gandhi Road",
        //         "Loc": "Bhiwandi",
        //         "Pin": 400001,
        //         "Stcd": "27"
        //     },
        //     "ShipDtls": {
        //         "Gstin": "URP",
        //         "LglNm": "Quality Products Construction Site",
        //         "Addr1": "Anna Salai",
        //         "Loc": "Chennai",
        //         "Pin": 600001,
        //         "Stcd": "33"
        //     },
        //     "ItemList": [
        //         {
        //             "ItemNo": 0,
        //             "SlNo": "1",
        //             "IsServc": "N",
        //             "PrdDesc": "Computer Hardware - Keyboard and Mouse",
        //             "HsnCd": "84313910",
        //             "Qty": 25,
        //             "FreeQty": 0,
        //             "Unit": "PCS",
        //             "UnitPrice": 200,
        //             "TotAmt": 5000,
        //             "Discount": 0,
        //             "PreTaxVal": 0,
        //             "AssAmt": 5000,
        //             "GstRt": 18,
        //             "IgstAmt": 900,
        //             "CgstAmt": 0,
        //             "SgstAmt": 0,
        //             "CesRt": 0,
        //             "CesAmt": 0,
        //             "CesNonAdvlAmt": 0,
        //             "StateCesRt": 0,
        //             "StateCesAmt": 0,
        //             "StateCesNonAdvlAmt": 0,
        //             "OthChrg": 0,
        //             "TotItemVal": 5900
        //         }
        //     ],
        //     "ValDtls": {
        //         "AssVal": 5000,
        //         "CgstVal": 0,
        //         "SgstVal": 0,
        //         "IgstVal": 900,
        //         "CesVal": 0,
        //         "StCesVal": 0,
        //         "Discount": 0,
        //         "OthChrg": 0,
        //         "RndOffAmt": 0,
        //         "TotInvVal": 5900
        //     }
        // }
        // ];

        payloadData.map((payload) => {
            setGenerateLoader(true)
            apiServices(payload)
        })
    };

    const apiServices = async (payload) => {
        const END_POINT = process.env.REACT_APP_GSTZEN_API_URL;
        const API_TOKEN = process.env.REACT_APP_GSTZEN_API_TOKEN;
        // const API_TOKEN = "de3a3a01-273a-4a81-8b75-13fe37f14dc6";
        try {
            const response = await fetch(`${END_POINT}/~gstzen/a/post-einvoice-data/einvoice-json/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Token": API_TOKEN
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log("Response:", data);
            setOpen(true)
            setApiStatus(data.status)
            setSuccessResponses(prev => [...prev, { docNo: payload?.DocDtls?.No, message: data?.message, AckNo: data?.AckNo, AckDt: data?.AckDt, SignedQrCodeImgUrl: data?.SignedQrCodeImgUrl }]);
            const mergedGstZenResponseData = { ...data, gstInvId: payload?.gstInvId }
            if (data.status == 1) {
                StoreGstSaleInvoiceResponse(mergedGstZenResponseData, handleStoreSuccess, handleStoreException);
            }
            setNotification({
                status: true,
                type: data.status === 1 ? 'success' : 'error',
                message: data.message,
            });
            setGenerateLoader(false)
            setTimeout(() => {
                handleClose();
            }, 2000)
        } catch (error) {
            console.error("Error:", error);
            setGenerateLoader(false)
            setNotification({
                status: true,
                type: 'error',
                message: error.message,
            });
        }
    }

    // STORE GST ZEN API RESPONSE
    const handleStoreSuccess = (dataObject) => {
        console.log("GST ZEN API RESPONSE", dataObject.message)
    }
    const handleStoreException = (errorObject, errorMessage) => {
        console.log("GST ZEN API RESPONSE", errorMessage)
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
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
        setLoading(true)
        getGstSaleInvoiceList({
            from: fromDate,
            to: toDate,
            isPending: pendingOnly
        }, handleGstListSuccess, handleGstInvoiceException)
    }

    return (
        <Box sx={{ height: 400, width: '100%', padding: '20px' }}>
            <Typography style={{ textAlign: 'left', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>Generate E-Invoice</Typography>
            <Grid container alignItems={'center'} spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <FormControl style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', height: '40px', borderRadius: '5px' }}>
                        <RadioGroup
                            aria-label="options"
                            name="options"
                            value={selectedFilterRadio}
                            onChange={handleRadioChange}
                            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}
                        >
                            <FormControlLabel
                                value="Today"
                                control={<Radio
                                    sx={{
                                        color: '#686D76', // unselected color
                                        '&.Mui-checked': {
                                            color: '#002d68', // selected color
                                        }
                                    }}
                                />}
                                label="Today"
                            />
                            <FormControlLabel
                                value="Yesterday"
                                control={<Radio
                                    sx={{
                                        color: '#686D76', // unselected color
                                        '&.Mui-checked': {
                                            color: '#002d68', // selected color
                                        }
                                    }}
                                />}
                                label="Yesterday"
                            />
                            <FormControlLabel
                                value="This week"
                                control={<Radio
                                    sx={{
                                        color: '#686D76', // unselected color
                                        '&.Mui-checked': {
                                            color: '#002d68', // selected color
                                        }
                                    }}
                                />}
                                label="This week"
                            />
                            <FormControlLabel
                                value="Last week"
                                control={<Radio
                                    sx={{
                                        color: '#686D76', // unselected color
                                        '&.Mui-checked': {
                                            color: '#002d68', // selected color
                                        }
                                    }}
                                />}
                                label="Last week"
                            />
                            <FormControlLabel
                                value="This month"
                                control={<Radio
                                    sx={{
                                        color: '#686D76', // unselected color
                                        '&.Mui-checked': {
                                            color: '#002d68', // selected color
                                        }
                                    }}
                                />}
                                label="This month"
                            />
                            <FormControlLabel
                                value="Last month"
                                control={<Radio
                                    sx={{
                                        color: '#686D76', // unselected color
                                        '&.Mui-checked': {
                                            color: '#002d68', // selected color
                                        }
                                    }}
                                />}
                                label="Last month"
                            />
                            <FormControlLabel
                                value="Custom"
                                control={<Radio
                                    sx={{
                                        color: '#686D76', // unselected color
                                        '&.Mui-checked': {
                                            color: '#002d68', // selected color
                                        }
                                    }}
                                />}
                                label="Custom"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={8} md={2} lg={2}>
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

                <Grid item xs={12} sm={8} md={2} lg={2}>
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
                <Grid item xs={12} sm={8} md={3} lg={3}>
                    <Button
                        disabled={loading === true || isModuleLocked}
                        variant="contained"
                        style={getHighlightStyle(
                            "View",
                            {
                                backgroundColor: isModuleLocked ? "grey" : "#002D68",
                                marginRight: "15px",
                                marginTop: "2px",
                            },
                            loading
                        )}
                        onClick={() => {
                            setActiveButton("View"); // 🔵 highlight
                            handleView();            // ✅ existing logic
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={24} style={{ color: "white" }} />
                        ) : (
                            "View"
                        )}
                    </Button>

                    <Button
                        variant="contained"
                        style={getHighlightStyle("ExportExcel", {
                            backgroundColor: isModuleLocked ? "grey" : "#002D68",
                            marginTop: "2px",
                        })}
                        onClick={() => {
                            setActiveButton("ExportExcel"); // 🔵 highlight
                            // keep your existing export logic here
                        }}
                        disabled={isModuleLocked}
                    >
                        Export To Excel
                    </Button>
                </Grid>

                <Grid item xs={2} sm={2} md={2} lg={2}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={pendingOnly} onChange={(e) => setPendingOnly(e.target.checked)} />} label="Pending Only" />
                    </FormGroup>
                </Grid>
            </Grid>

            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '100%', height: screenHeight - 350 }}>
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
                            // minHeight: '500px',
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
                            // Find the index of the row within the rows array
                            const rowIndex = rows.findIndex(row => row.id === params.row.id);
                            // Check if the index is valid
                            if (rowIndex !== -1) {

                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                            }
                            return ''; // Return default class if index is not found
                        }}
                        rowHeight={40}
                        columnHeaderHeight={40}
                    />
                    <div style={{ width: '100%' }}>
                        {/* <Button
                            variant="contained"
                            color="primary"
                            onClick={sendInvoiceData}
                            sx={{ marginTop: 2, backgroundColor: '#002D68', width: '200px' }}
                            disabled={generateLoader === true}
                        >
                            {generateLoader ? (
                                <CircularProgress size={24} style={{ color: 'white' }} />
                            ) : 'Generate E-Invoice'}
                        </Button> */}
                        <Button
                            variant="contained"
                            onClick={() => {
                                setActiveButton("GenerateEInvoice"); // 🔵 highlight
                                sendInvoiceData();                   // ✅ existing logic
                            }}
                            disabled={generateLoader === true || isModuleLocked}
                            sx={{
                                ...getHighlightStyle(
                                    "GenerateEInvoice",
                                    {
                                        backgroundColor: isModuleLocked ? "grey" : "#002D68",
                                        width: "200px",
                                        marginTop: 2,
                                    },
                                    generateLoader
                                ),
                            }}
                        >
                            {generateLoader ? (
                                <CircularProgress size={24} style={{ color: "white" }} />
                            ) : (
                                "Generate E-Invoice"
                            )}
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

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                width='xl'
            >
                <DialogTitle id="alert-dialog-title">
                    E-Invoice Response
                </DialogTitle>
                <DialogContent>
                    <Box /*sx={style}*/>
                        <div>
                            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
                                <thead>
                                    <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                                        <th style={thStyle}>Doc No</th>
                                        <th style={thStyle}>Message</th>
                                        <th style={thStyle}>Ack No</th>
                                        <th style={thStyle}>Ack Date</th>
                                        {/* <th style={thStyle}>Signed QR Code</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {successResponses && successResponses.map((item, index) => (
                                        <tr key={index} style={{ borderBottom: "1px solid #ddd", /*backgroundColor: item?.message === 'IRN already generated. ' ? 'red' : '#5B913B'*/ }}>
                                            <td style={{ ...(item?.message === 'IRN already generated. ' || apiStatus == 0 ? errorStyle : successStyle), whiteSpace: 'nowrap' }}>{item?.docNo}</td>
                                            <td style={{ ...(item?.message === 'IRN already generated. ' || apiStatus == 0 ? errorStyle : successStyle), width: '200px' }}>{item?.message}</td>
                                            <td style={{ ...(item?.message === 'IRN already generated. ' || apiStatus == 0 ? errorStyle : successStyle), whiteSpace: 'nowrap' }}>{item?.AckNo}</td>
                                            <td style={{ ...(item?.message === 'IRN already generated. ' || apiStatus == 0 ? errorStyle : successStyle), whiteSpace: 'nowrap' }}>{item?.AckDt}</td>
                                            {/* <td style={tdStyle}>
                                                <img style={{ width: '100px', height: '100px' }} src={`${process.env.REACT_APP_GSTZEN_API_URL}${item.SignedQrCodeImgUrl}`} />
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpen(false)
                        setSuccessResponses([])
                    }}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
//     p: 4,
// };

const thStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    fontWeight: "bold",
    backgroundColor: "#f4f4f4"
};

const successStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    color: '#5B913B',
};
const errorStyle = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    color: 'red',
};

export default GenerateElectronicInvoice;
