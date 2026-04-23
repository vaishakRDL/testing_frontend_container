import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Button, Card, CardContent, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, LinearProgress, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { PurchaseReportSearchSupplier, PurchaseReportSearchItem, GetPuchaseReport, GetProductionReport } from "../../ApiService/LoginPageService";
import './ProductionReport.css';
import { ProductionReportDownload } from "../../ApiService/DownloadCsvReportsService";
import NotificationBar from "../GlobleFiles/ServiceNotificationBar";

const ProductionReport = () => {

    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [supplierList, setSupplierList] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setTodate] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedRadio, setSelectedRadio] = useState('')
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [fimHeaderData, setFimHeaderData] = useState([])

    const purchaseReportColumn = [
        {
            field: 'Supplier',
            headerClassName: 'super-app-theme--header',
            headerName: 'supplier',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'GST No',
            headerClassName: 'super-app-theme--header',
            headerName: 'gstNo',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poNo',
            headerClassName: 'super-app-theme--header',
            headerName: 'PO No',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poDate',
            headerClassName: 'super-app-theme--header',
            headerName: 'PO Date',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poType',
            headerClassName: 'super-app-theme--header',
            headerName: 'PO Type',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'reference',
            headerClassName: 'super-app-theme--header',
            headerName: 'Reference',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'itemGroup',
            headerClassName: 'super-app-theme--header',
            headerName: 'Item Group',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'sitemCode',
            headerClassName: 'super-app-theme--header',
            headerName: 'Sitem Code',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'sitemName',
            headerClassName: 'super-app-theme--header',
            headerName: 'Sitem Name',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'suppDesc',
            headerClassName: 'super-app-theme--header',
            headerName: 'Supp Desc',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'scheduleDate',
            headerClassName: 'super-app-theme--header',
            headerName: 'scheduleDate',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'uom',
            headerClassName: 'super-app-theme--header',
            headerName: 'UOM',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'poQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'PO Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'pbCumQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'PBCumQty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'pendingQty',
            headerClassName: 'super-app-theme--header',
            headerName: 'Pending Qty',
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        // {
        //     field: 'actions',
        //     type: 'actions',
        //     flex: 1,
        //     headerName: 'BOM',
        //     cellClassName: 'actions',
        //     disableClickEventBubbling: true,
        //     getActions: (params) => [
        //         // <BOMCheck selectedRow={params.row} />,

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

    const top100Films = [
        { title: 'The Shawshank Redemption', year: 1994 },
        { title: 'The Godfather', year: 1972 },
        // other film objects...
    ];

    // SUPPLIER SEARCH
    const handleSupplierChange = (e) => {
        PurchaseReportSearchSupplier({ code: e.target.value }, handleSearchSupplierSucessShow, handleSearchSupplierExceptionShow);
    }

    const handleSearchSupplierSucessShow = (dataObject) => {
        setSupplierList(dataObject?.data || []);
    }
    const handleSearchSupplierExceptionShow = (errorObject, errorMessage) => {
    }

    const handleSupplierSelect = (value) => {
        if (value !== null) {
            const ids = value.map(item => item.id);
            setSelectedSupplier(ids)
        }
    };

    // ITEM SEARCH
    const handleItemChange = (e) => {
        PurchaseReportSearchItem({ code: e.target.value }, handleSearchItemSucessShow, handleSearchItemExceptionShow);
    }

    const handleSearchItemSucessShow = (dataObject) => {
        setItemList(dataObject?.data || []);
    }
    const handleSearchItemExceptionShow = (errorObject, errorMessage) => {
    }

    const handleItemSelect = (value) => {
        if (value !== null) {
            const ids = value.map(item => item.id);
            setSelectedItem(ids)
        }
    };

    const handleReportView = () => {
        setLoader(true)
        GetProductionReport(
            {
                from: fromDate,
                to: toDate,
                type: selectedRadio
            }, handleGetReportSuccess, handleGetReportException)
    }

    const handleGetReportSuccess = (dataObject) => {
        setLoader(false)
        console.log(dataObject.data)
        setReportData(dataObject?.data || [])
        setFimHeaderData(dataObject?.headers || [])
    }
    const handleGetReportException = () => {
        setLoader(false)
    }

    /////////////////////////////////////
    const data = [
        {
            supplierId: 4160,
            spName: "SULAX TECHNOLOGIES PRIVATE LIMITED",
            gst: "789",
            po: [
                {
                    poNo: "24/R/1036",
                    poType: "REGULAR",
                    poDate: "15-07-2024",
                    items: [
                        {
                            id: 1,
                            sNo: 1,
                            itemId: 10687,
                            itemCode: "NAA285DZ1",
                            itemName: "IP55 DOOR ( NAA308GN1 )",
                            uom: "Nos",
                            unitRate: 324,
                            value: "3240",
                            qty: "10"
                        }
                    ]
                },
                {
                    poNo: "24/R/1037",
                    poType: "OPEN PO",
                    poDate: "15-07-2024",
                    items: [
                        {
                            id: 1,
                            sNo: 1,
                            itemId: 10687,
                            itemCode: "NAA285DZ1",
                            itemName: "IP55 DOOR ( NAA308GN1 )",
                            uom: "Nos",
                            unitRate: 324,
                            value: "16200",
                            qty: "50"
                        },
                        {
                            id: 2,
                            sNo: 2,
                            itemId: 22433,
                            itemCode: "NAA285GN1",
                            itemName: "IP 55 DOOR WELDMENT",
                            uom: "Nos",
                            unitRate: 110,
                            value: "880",
                            qty: "8"
                        }
                    ]
                },
                {
                    poNo: "24/R/1039",
                    poType: "REGULAR",
                    poDate: "24-07-2024",
                    items: [
                        {
                            id: 1,
                            sNo: 1,
                            itemId: 10687,
                            itemCode: "NAA285DZ1",
                            itemName: "IP55 DOOR ( NAA308GN1 )",
                            uom: "Nos",
                            unitRate: 325,
                            value: null,
                            qty: null
                        }
                    ]
                }
            ]
        },
        {
            supplierId: 4161,
            spName: "SULAX TECHNOLOGIES PVT. LTD",
            gst: "2",
            po: [
                {
                    poNo: "24/R/1038",
                    poType: "REGULAR",
                    poDate: "24-07-2024",
                    items: [
                        {
                            id: 1,
                            sNo: 1,
                            itemId: 10687,
                            itemCode: "NAA285DZ1",
                            itemName: "IP55 DOOR ( NAA308GN1 )",
                            uom: "Nos",
                            unitRate: 325,
                            value: "3250",
                            qty: "10"
                        }
                    ]
                }
            ]
        }
    ];

    console.log(data);


    const handleReportDownload = () => {
        setLoader(true)
        ProductionReportDownload({
            from: fromDate,
            to: toDate,
            type: selectedRadio
        }, handleDownloadSuccess, handleDownloadException)
    }

    const handleDownloadSuccess = () => {
        setLoader(false)
        setNotification({
            status: true,
            type: 'success',
            message: "Download Success",
        });
    }
    const handleDownloadException = () => {
        setLoader(false)
        setNotification({
            status: true,
            type: 'error',
            message: "Failed to download",
        });
    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const fimPartLists = [
        {
            productFamily: 'BedPlate',
            items: [
                {
                    partNo: 'NAA2356F',
                    partDescr: 'BracketCS',
                    material: 'HR'
                },
                {
                    partNo: 'KAA2356F',
                    partDescr: 'BracketCSSS',
                    material: 'HRSS'
                }
            ]
        }
    ]

    return (
        <div style={{ margin: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '5px', marginTop: '10px', marginBottom: '10px' }}>
                <Typography
                    sx={{ fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
                    variant="h5">
                    Production Report
                </Typography>
            </div>
            <Card sx={{ minWidth: 275 }}>
                {loader &&
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                }
                <CardContent>
                    <Grid container alignItems={'center'} spacing={2}>
                        <Grid item xs={12} sm={12} md={3} lg={3}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Select Report</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Select Report"
                                    value={selectedRadio}
                                    size="small"
                                    onChange={(e) => {
                                        setSelectedRadio(e.target.value);
                                        setReportData([]);
                                    }}
                                >
                                    <MenuItem value={'Contract'}>Contract</MenuItem>
                                    <MenuItem value={'Fim'}>FIM</MenuItem>
                                    <MenuItem value={'Mkd'}>MKD Part List</MenuItem>
                                    <MenuItem value={'FimPart'}>FIM Part List</MenuItem>
                                    <MenuItem value={'FimKit'}>FIM Part List - Kit</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={8} md={3} lg={3}>
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
                        <Grid item xs={12} sm={8} md={3} lg={3}>
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
                            <Button variant="contained" style={{ backgroundColor: '#002D68', marginRight: '15px', marginTop: '2px' }} disabled={loader} onClick={handleReportView}>View</Button>
                            <Button variant="contained" style={{ backgroundColor: '#002D68', marginTop: '2px' }} disabled={loader} onClick={handleReportDownload}>Download</Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            {reportData.length > 0 ?
                                <Box sx={{ height: screenHeight - 365, width: '100%', overflow: 'auto' }}>

                                    {/* CONTRACT REPORT */}
                                    {selectedRadio === 'Contract' &&
                                        <table id="customers" border="1" style={{ borderCollapse: "collapse", width: "100%", zoom: '80%' }}>
                                            <thead>
                                                <tr>
                                                    {Object.keys(reportData[0] || {})
                                                        .filter(key => key !== 'id') // Exclude the 'id' key
                                                        .map(key => (
                                                            <th key={key} style={{ width: '150px', whiteSpace: 'nowrap' }}>
                                                                {key.toUpperCase()} {/* Format key name if needed */}
                                                            </th>
                                                        ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData.map((supp, suppKey) => (
                                                    <tr key={suppKey} style={{ backgroundColor: supp.Kanban === 'Total' && '#4a4947', color: supp.Kanban === 'Total' && '#ffffff' }}>
                                                        {Object.keys(supp)
                                                            .filter(key => key !== 'id') // Exclude the 'id' key
                                                            .map(key => (
                                                                <td key={key} style={{ whiteSpace: 'nowrap' }}>{supp[key]}</td>
                                                            ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    }

                                    {/* FIM REPORT */}
                                    {selectedRadio === 'Fim' &&
                                        <table id="customers" border="1" style={{ borderCollapse: "collapse", width: "100%", zoom: '80%' }}>
                                            <thead>
                                                <tr>
                                                    {Object.keys(reportData[0] || {})
                                                        .filter(key => key !== 'id') // Exclude the 'id' key
                                                        .map(key => (
                                                            <th key={key} style={{ width: '150px', whiteSpace: 'nowrap' }}>
                                                                {key.toUpperCase()} {/* Format key name if needed */}
                                                            </th>
                                                        ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData.map((supp, suppKey) => (
                                                    <tr key={suppKey} style={{ backgroundColor: supp.Product === 'Total' && '#4a4947', color: supp.Product === 'Total' && '#ffffff' }}>
                                                        {Object.keys(supp)
                                                            .filter(key => key !== 'id') // Exclude the 'id' key
                                                            .map(key => (
                                                                <td key={key} style={{ whiteSpace: 'nowrap' }}>{supp[key]}</td>
                                                            ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    }

                                    {selectedRadio === 'Mkd' &&
                                        <table border="1" style={{ borderCollapse: "collapse", width: "100%", zoom: '80%' }} id="customers">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>KANBAN</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PRODUCT</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>CONTRACT NO</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>DUTY</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>FIM CODE</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PART NO</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>PART DESC</th>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>QTY</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData && reportData.map((kanbanItem, kanbanIndex) => {
                                                    // Calculate row spans for KANBAN
                                                    const kanbanRowSpan = kanbanItem.products.reduce(
                                                        (acc, product) =>
                                                            acc +
                                                            product.contracts.reduce(
                                                                (contractAcc, contract) =>
                                                                    contractAcc +
                                                                    contract.fims.reduce(
                                                                        (fimAcc, fim) => fimAcc + fim.parts.length,
                                                                        0
                                                                    ),
                                                                0
                                                            ),
                                                        0
                                                    );

                                                    return kanbanItem.products.map((product, productIndex) => {
                                                        // Calculate row spans for PRODUCT
                                                        const productRowSpan = product.contracts.reduce(
                                                            (contractAcc, contract) =>
                                                                contractAcc +
                                                                contract.fims.reduce(
                                                                    (fimAcc, fim) => fimAcc + fim.parts.length,
                                                                    0
                                                                ),
                                                            0
                                                        );

                                                        return product.contracts.map((contract, contractIndex) => {
                                                            // Calculate row spans for CONTRACT
                                                            const contractRowSpan = contract.fims.reduce(
                                                                (fimAcc, fim) => fimAcc + fim.parts.length,
                                                                0
                                                            );

                                                            return contract.fims.map((fim, fimIndex) => {
                                                                return fim.parts.map((part, partIndex) => (
                                                                    <tr key={`${kanbanIndex}-${productIndex}-${contractIndex}-${fimIndex}-${partIndex}`}
                                                                        style={{ backgroundColor: kanbanItem.kanban === 'Total' ? '#4a4947' : '#ffffff', color: kanbanItem.kanban === 'Total' ? '#ffffff' : '#000000' }}
                                                                    >
                                                                        {/* Render KANBAN row span */}
                                                                        {productIndex === 0 &&
                                                                            contractIndex === 0 &&
                                                                            fimIndex === 0 &&
                                                                            partIndex === 0 && (
                                                                                <td rowSpan={kanbanRowSpan} style={{ whiteSpace: 'nowrap' }}>{kanbanItem.kanban}</td>
                                                                            )}

                                                                        {/* Render PRODUCT row span */}
                                                                        {contractIndex === 0 &&
                                                                            fimIndex === 0 &&
                                                                            partIndex === 0 && (
                                                                                <td rowSpan={productRowSpan} style={{ whiteSpace: 'nowrap' }}>{product.product}</td>
                                                                            )}

                                                                        {/* Render CONTRACT row span */}
                                                                        {fimIndex === 0 && partIndex === 0 && (
                                                                            <td rowSpan={contractRowSpan} style={{ whiteSpace: 'nowrap' }}>
                                                                                {contract.contractNo}
                                                                            </td>
                                                                        )}

                                                                        {/* Render DUTY row span */}
                                                                        {partIndex === 0 && (
                                                                            <td rowSpan={fim.parts.length} style={{ whiteSpace: 'nowrap' }}>
                                                                                {contract.duty}
                                                                            </td>
                                                                        )}

                                                                        {/* Render FIM CODE */}
                                                                        {partIndex === 0 && (
                                                                            <td rowSpan={fim.parts.length} style={{ whiteSpace: 'nowrap' }}>{fim.fim}</td>
                                                                        )}

                                                                        {/* Render PART details */}
                                                                        <td style={{ whiteSpace: 'nowrap' }}>{part.partNo}</td>
                                                                        <td style={{ whiteSpace: 'nowrap' }}>{part.partDesc || '-'}</td>
                                                                        <td style={{ whiteSpace: 'nowrap' }}>{part.Qty}</td>
                                                                    </tr>
                                                                ));
                                                            });
                                                        });
                                                    });
                                                })}
                                            </tbody>
                                        </table>
                                    }

                                    {selectedRadio === 'FimPart' &&
                                        <table border="1" style={{ borderCollapse: "collapse", width: "100%", zoom: '80%' }} id="customers">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>ProductFamily</th>
                                                    {fimHeaderData
                                                        .filter((label) => label !== 'ProductFamily')
                                                        .map((header, headerIndex) => (
                                                            <th key={headerIndex} style={{ width: '150px', whiteSpace: 'nowrap' }}>{header}</th>
                                                        ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData && fimHeaderData && reportData.map((data, Key) => (
                                                    data.parts.map((item, index) => (
                                                        <tr>
                                                            {
                                                                index === 0 &&
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.parts.length}>{data.ProductFamily}</td>
                                                            }
                                                            {fimHeaderData
                                                                .filter((label) => label !== 'ProductFamily')
                                                                .map((header, headerIndex) => (
                                                                    <td
                                                                        key={headerIndex}
                                                                        // style={{ width: '150px', whiteSpace: 'nowrap' }}
                                                                        style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}
                                                                    >
                                                                        {item[header] !== undefined ? item[header] : ''}
                                                                    </td>
                                                                ))}
                                                        </tr>
                                                    ))
                                                ))}
                                            </tbody>
                                        </table>
                                    }

                                    {/* FIM REPORT */}
                                    {selectedRadio === 'FimKit' &&
                                        <table border="1" style={{ borderCollapse: "collapse", width: "100%", zoom: '80%' }} id="customers">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '150px', whiteSpace: 'nowrap' }}>ProductFamily</th>
                                                    {fimHeaderData
                                                        .filter((label) => label !== 'ProductFamily')
                                                        .map((header, headerIndex) => (
                                                            <th key={headerIndex} style={{ width: '150px', whiteSpace: 'nowrap' }}>{header}</th>
                                                        ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData && fimHeaderData && reportData.map((data, Key) => (
                                                    data.parts.map((item, index) => (
                                                        <tr>
                                                            {
                                                                index === 0 &&
                                                                <td style={{ width: '150px', whiteSpace: 'nowrap' }} rowSpan={data.parts.length}>{data.ProductFamily}</td>
                                                            }
                                                            {fimHeaderData
                                                                .filter((label) => label !== 'ProductFamily')
                                                                .map((header, headerIndex) => (
                                                                    <td
                                                                        key={headerIndex}
                                                                        // style={{ width: '150px', whiteSpace: 'nowrap' }}
                                                                        style={{ backgroundColor: item.PartNo === "" ? '#4a4947' : '#ffffff', color: item.PartNo === "" ? '#ffffff' : '#000000' }}
                                                                    >
                                                                        {item[header] !== undefined ? item[header] : ''}
                                                                    </td>
                                                                ))}
                                                        </tr>
                                                    ))
                                                ))}
                                            </tbody>
                                        </table>
                                    }
                                </Box>
                                :
                                <Box sx={{ height: screenHeight - 365, width: '100%', overflow: 'auto' }}>
                                    <div style={{ backgroundColor: '#D9EAFD', padding: '50px', borderRadius: '10px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography style={{ fontFamily: 'cursive' }}>No Data Found</Typography>
                                    </div>
                                </Box>
                            }
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div >
    )
}
export default ProductionReport;