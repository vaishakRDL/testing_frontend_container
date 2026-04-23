import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Box, Button, Card, CardContent, Checkbox, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { GetItemVsProcessItem, GetItemVsProcessProcessList, AddItemVsProcess, ProcessInspecReportViewId, QcInwardReportViewId, QcInwardWithotReportViewId } from '../../ApiService/LoginPageService';
import { useNavigate } from 'react-router-dom';
import { QualityReport } from '../../ApiService/DownloadCsvReportsService';
// import FPIReportTitle from './FPIReportTitle';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import WithoutPoInwardFPITittle from './WithoutPoInwardFPITittle';


const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const WithoutInwardInsideFpiReport = ({ setIsFpiReport, slNO, reportType, jcId, itemId, inwordReport, selectedRowId }) => {
    const [companyLogoPath, setCompanyLogoPath] = useState("");

    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [columns2, setColumns2] = useState([]);

    const [dataset, setDataSet] = useState([]);
    const [customer, setCustomer] = useState('');
    const [machine, setMachine] = useState('');
    const [partNumber, setPartNumber] = useState('');
    const [operation, setOperation] = useState('');
    const [shift, setShift] = useState('');
    const [description, setDescription] = useState('');
    const [jobcardNo, setJobCardNo] = useState('');
    const [totalQty, setTotalQty] = useState('');
    const [remarks, setRemarks] = useState('');
    const [rejRewQty, setRejRewQty] = useState('');
    const [addedBy, setaddedBy] = useState('');

    ////////////////////////////////////
    const [selectedItemId, setSelectedItemId] = useState('')


    // const columns2 = [
    //     {
    //         field: 'qltyParameter',
    //         headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Quality Parameter</span>,
    //         type: 'string',
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: 'left',
    //         headerAlign: 'center',
    //     },
    //     {
    //         field: "expVal",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>
    //                 Expected Value
    //             </span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //     },
    //     {
    //         field: "minTolerance",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>
    //                 Min Tolerance
    //             </span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //     },
    //     {
    //         field: "maxTolerance",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>
    //                 Max Tolerance
    //             </span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //     },
    //     {
    //         field: "uom",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>UOM </span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //     },
    //     {
    //         field: "visual",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>Visual</span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //     },
    //     {
    //         field: "evalutionMethod",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>
    //                 Evaluation Method
    //             </span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //     },
    //     {
    //         field: "actualResult",
    //         headerClassName: 'super-app-theme--header',
    //         headerName: (
    //             <span style={{ fontWeight: "bold", fontSize: "16px" }}>
    //                 Actual Result
    //             </span>
    //         ),
    //         type: "string",
    //         sortable: true,
    //         minWidth: 80,
    //         flex: 1,
    //         align: "center",
    //         headerAlign: "center",
    //         editable: true,
    //     },



    // ]
    const buildDynamicColumns = (data) => {
        if (!data || data.length === 0) return;

        // Get all keys from the first row
        const firstRow = data[0];
        const dynamicKeys = Object.keys(firstRow).filter(key =>
            key.startsWith("actualResult")
        );

        // Static columns (same as before)
        const baseColumns = [
            {
                field: 'qltyParameter',
                headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Quality Parameter</span>,
                type: 'string',
                minWidth: 120,
                flex: 1,
                align: 'left',
                headerAlign: 'center',
            },
            {
                field: "expVal",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>Expected Value</span>,
                type: "string",
                minWidth: 100,
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "minTolerance",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>Min Tolerance</span>,
                type: "string",
                minWidth: 100,
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "maxTolerance",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>Max Tolerance</span>,
                type: "string",
                minWidth: 100,
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "uom",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>UOM</span>,
                type: "string",
                minWidth: 80,
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "visual",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>Visual</span>,
                type: "string",
                minWidth: 80,
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
            {
                field: "evalutionMethod",
                headerName: <span style={{ fontWeight: "bold", fontSize: "16px" }}>Evaluation Method</span>,
                type: "string",
                minWidth: 120,
                flex: 1,
                align: "center",
                headerAlign: "center",
            },
        ];

        // Dynamic actualResult columns
        const dynamicColumns = dynamicKeys.map((key) => ({
            field: key,
            headerName: (
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                    {key.replace(/([a-z])([A-Z])/g, '$1 $2')} {/* adds space if needed */}
                </span>
            ),
            type: "string",
            sortable: false,
            minWidth: 100,
            flex: 1,
            align: "center",
            headerAlign: "center",
            editable: false,
        }));

        setColumns2([...baseColumns, ...dynamicColumns]);
    };


    useEffect(() => {
        if (inwordReport) {
            QcInwardWithotReportViewId({
                id: selectedRowId,
            }, handleProcessInspecReportViewIdSuccess, handleProcessInspecReportViewIdException);
        } else {
            ProcessInspecReportViewId({
                id: slNO,
                jcId: jcId,
                itemId: itemId
            }, handleProcessInspecReportViewIdSuccess, handleProcessInspecReportViewIdException);
        }
    }, [refreshData]);

    const handleProcessInspecReportViewIdSuccess = (dataObject) => {
        const data = dataObject?.data || [];

        setDataSet(dataObject?.data || []);
        buildDynamicColumns(data); // ✅ generate dynamic columns here
        setCustomer(dataObject?.data[0]?.supplier || '');
        setMachine(dataObject?.data[0]?.machineCode || '');
        setPartNumber(dataObject?.data[0]?.itemCode || '');
        setOperation(dataObject?.data[0]?.process || '');
        setShift(dataObject?.data[0]?.shift || '');
        setJobCardNo(dataObject?.data[0]?.poNo || '');
        setTotalQty(dataObject?.data[0]?.totQty || '');
        setRemarks(dataObject?.data[0]?.remarks || '');
        setRejRewQty(dataObject?.data[0]?.rejRewQty || '');
        setaddedBy(dataObject?.data[0]?.addedBy || '');
        setCompanyLogoPath(dataObject?.data[0]?.companyImage || "");

    }

    const handleProcessInspecReportViewIdException = () => {

    }

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const getBase64ImageFromUrl = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
            reader.readAsDataURL(blob);
        });
    };
    const ClearData = () => {

    }

    const DownloadPOEntryTemplateSuccess = () => { };

    const DownloadPOEntryTemplateException = () => { };


    const handleSupplierSearchItemChange = (value) => {
        console.log("handleSupplierSearchItemChange", value.id)
        // setSelectedItems((prevSelectedItems) => [...prevSelectedItems, value]);
        if (value !== null) {
            setSelectedItemId(value.id)
        }
    }
    const buttonStyle = {
        variant: "contained",
        // color: "primary",
        component: "label",
        sx: {
            marginRight: '8px',
            backgroundColor: '#002D68',
            height: '40px',
            borderRadius: '20px',
            width: '200px'
        }
    };
    const buttonStyle1 = {
        variant: "contained",
        // color: "primary",
        component: "label",
        sx: {
            marginRight: '8px',
            backgroundColor: '#002D68',
            height: '40px',
            borderRadius: '20px',
            width: '150px'
        }
    };


    // const handleExcelDownload = async () => {
    //   if (!dataset || dataset.length === 0 || columns2.length === 0) {
    //     alert("No data to export!");
    //     return;
    //   }

    //   const workbook = new ExcelJS.Workbook();
    //   const worksheet = workbook.addWorksheet("FPI Report");

    //   // 🔹 Title
    //   worksheet.mergeCells("A1:H1");
    //   const titleCell = worksheet.getCell("A1");
    //   titleCell.value = "FPI REPORT";
    //   titleCell.font = { size: 16, bold: true, color: { argb: "FF002D68" } };
    //   titleCell.alignment = { horizontal: "center", vertical: "middle" };

    //   // 🔹 Info rows (two-column layout)
    //   const infoRows = [
    //     ["Supplier:", customer, "Machine:", machine],
    //     ["Part Number:", partNumber, "Process:", operation],
    //     ["PO No:", jobcardNo, "Total Qty:", totalQty],
    //     ["Remarks:", remarks || "-", "User:", addedBy],
    //   ];

    //   infoRows.forEach((values) => {
    //     const row = worksheet.addRow(values);
    //     row.eachCell((cell, col) => {
    //       if (col === 1 || col === 3) {
    //         cell.font = { bold: true, color: { argb: "FF002D68" } };
    //         cell.alignment = { horizontal: "left", vertical: "middle" };
    //       } else {
    //         cell.font = { color: { argb: "FF000000" } };
    //         cell.alignment = { horizontal: "left", vertical: "middle" };
    //       }
    //     });
    //   });

    //   // Add a blank row before the DataGrid table
    //   worksheet.addRow([]);

    //   // 🔹 Now capture the table's actual starting row
    //   const tableStartRow = worksheet.lastRow.number + 1;

    //   // Helper: numeric conversion
    //   const toNumberIfPossible = (value) => {
    //     if (value === null || value === undefined || value === "") return "";
    //     const num = Number(value);
    //     return !isNaN(num) ? num : value;
    //   };

    //   // 🔹 Prepare clean headers
    //   const headers = columns2.map(col => {
    //     if (typeof col.headerName === "string" && col.headerName.trim()) {
    //       return col.headerName;
    //     } else if (React.isValidElement(col.headerName)) {
    //       return typeof col.headerName.props.children === "string"
    //         ? col.headerName.props.children
    //         : Array.isArray(col.headerName.props.children)
    //           ? col.headerName.props.children.join(" ")
    //           : String(col.headerName.props.children || "");
    //     } else if (col.field) {
    //       return col.field.replace(/([a-z])([A-Z])/g, "$1 $2")
    //                       .replace(/(\d+)/g, " $1")
    //                       .trim();
    //     }
    //     return "Column";
    //   });

    //   // 🔹 Add header + data rows
    //   worksheet.addRow(headers);
    //   dataset.forEach((row) => {
    //     const rowData = columns2.map(col => toNumberIfPossible(row[col.field]));
    //     worksheet.addRow(rowData);
    //   });

    //   // 🔹 Style header row (exactly where it starts)
    //   const headerRow = worksheet.getRow(tableStartRow);
    //   headerRow.eachCell((cell) => {
    //     cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    //     cell.fill = {
    //       type: "pattern",
    //       pattern: "solid",
    //       fgColor: { argb: "FF002D68" },
    //     };
    //     cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    //     cell.border = {
    //       top: { style: "thin" },
    //       left: { style: "thin" },
    //       bottom: { style: "thin" },
    //       right: { style: "thin" },
    //     };
    //   });

    //   // 🔹 Style data rows
    //   worksheet.eachRow((row, rowNumber) => {
    //     if (rowNumber > tableStartRow) {
    //       row.eachCell((cell) => {
    //         cell.alignment = { horizontal: "center", vertical: "middle" };
    //         cell.border = {
    //           top: { style: "thin" },
    //           left: { style: "thin" },
    //           bottom: { style: "thin" },
    //           right: { style: "thin" },
    //         };
    //       });
    //     }
    //   });

    //   // 🔹 Auto-fit columns
    //   worksheet.columns.forEach((col) => {
    //     let maxLength = 10;
    //     col.eachCell({ includeEmpty: true }, (cell) => {
    //       const len = cell.value ? cell.value.toString().length : 10;
    //       if (len > maxLength) maxLength = len;
    //     });
    //     col.width = Math.min(maxLength + 2, 30);
    //   });

    //   // 🔹 Freeze all rows above header
    //   worksheet.views = [{ state: "frozen", ySplit: tableStartRow }];

    //   // 🔹 Save Excel
    //   const buffer = await workbook.xlsx.writeBuffer();
    //   saveAs(
    //     new Blob([buffer], {
    //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //     }),
    //     `Without PO QC Inward Report_${new Date().toLocaleDateString()}.xlsx`
    //   );
    // };

    const handleExcelDownload = async () => {
        if (!dataset || dataset.length === 0 || columns2.length === 0) {
            alert("No data to export!");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Inspection Report");

        // -----------------------------------------
        // 🔹 Reserve Space for Logo (prevents overlap)
        // -----------------------------------------
        for (let i = 0; i < 5; i++) {
            worksheet.addRow([]);
        }

        // -----------------------------------------
        // 🔹 Add Company Logo
        // -----------------------------------------
        if (companyLogoPath) {
            const imgUrl = `http://192.168.0.4:8000/${companyLogoPath}`;
            const base64Img = await getBase64ImageFromUrl(imgUrl);

            const imageId = workbook.addImage({
                base64: `data:image/png;base64,${base64Img}`,
                extension: "png",
            });

            worksheet.addImage(imageId, {
                tl: { col: 0, row: 0 },
                ext: { width: 150, height: 80 }, // adjust size
            });
        }

        // -----------------------------------------
        // 🔹 Title (corrected row)
        // -----------------------------------------
        worksheet.mergeCells("D2:H2"); // << moved title to row 6
        const titleCell = worksheet.getCell("D2");
        titleCell.value = "Inspection Report";
        titleCell.font = { size: 16, bold: true, color: { argb: "FF002D68" } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };

        // Add spacing row before supplier details
        worksheet.addRow([]);

        // -----------------------------------------
        // 🔹 Supplier / PO Details (now below logo & title cleanly)
        // -----------------------------------------
        const infoRows = [
            ["Supplier:", customer, "Machine:", machine, "Part Number:", partNumber, "Process:", operation],
            ["PO No:", jobcardNo, "Total Qty:", totalQty, "Remarks:", remarks || "-", "User:", addedBy],
        ];

        infoRows.forEach((values) => {
            const row = worksheet.addRow(values);
            row.eachCell((cell, col) => {
                if ([1, 3, 5, 7].includes(col)) {
                    cell.font = { bold: true, color: { argb: "FF002D68" } };
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                } else {
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                }
            });
        });

        worksheet.addRow([]); // blank row before table

        // -----------------------------------------
        // 🔹 Table Section
        // -----------------------------------------
        const tableStartRow = worksheet.lastRow.number + 1;

        const headers = columns2.map(col =>
            typeof col.headerName === "string"
                ? col.headerName
                : col.field.replace(/([a-z])([A-Z])/g, "$1 $2").trim()
        );

        worksheet.addRow(headers);

        dataset.forEach((row) => {
            worksheet.addRow(columns2.map(col => row[col.field] ?? ""));
        });

        // Style header row
        const headerRow = worksheet.getRow(tableStartRow);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF002D68" } };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        });

        worksheet.eachRow((row, number) => {
            if (number > tableStartRow) {
                row.eachCell((cell) => {
                    cell.border = { top: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" }, bottom: { style: "thin" } };
                    cell.alignment = { horizontal: "center", vertical: "middle" };
                });
            }
        });

        worksheet.columns.forEach((col) => {
            let max = 10;
            col.eachCell((cell) => max = Math.max(max, cell.value?.toString().length || 10));
            col.width = Math.min(max + 2, 30);
        });

        worksheet.views = [{ state: "frozen", ySplit: tableStartRow }];
        const footerRow = worksheet.addRow([
            "Format No - IMS-ME-QA-F-126, REV '01' DATED 22.05.2024"
        ]);

        const totalColumns = columns2.length;
        worksheet.mergeCells(
            footerRow.number,
            1,
            footerRow.number,
            totalColumns
        );

        footerRow.getCell(1).font = {
            bold: true,          // ✅ bold
            italic: false,
            size: 12,
            color: { argb: "FF555555" }
        };

        footerRow.getCell(1).alignment = {
            horizontal: "right",
            vertical: "middle"
        };


        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Without PO QC Inward Report_${new Date().toLocaleDateString()}.xlsx`);
    };


    return (
        <div style={{ height: '60vh', width: '100%' }}>
            {reportType === "Rejected" ?
                ''
                :
                <WithoutPoInwardFPITittle
                    setIsFpiReport={setIsFpiReport}
                    reportType={reportType}
                />}
            <Grid container spacing={2} padding={2}>

                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="Supplier"
                        placeholder='Supplier'
                        label='Supplier'
                        variant="outlined"
                        value={customer}
                        style={{ color: "#000000" }}
                        size='small'
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="Machine"
                        placeholder='Machine'
                        label='Machine'
                        variant="outlined"
                        value={machine}
                        style={{ color: "#000000" }}
                        size='small'
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="Part No"
                        placeholder='Part Number'
                        label='Part Number'
                        variant="outlined"
                        value={partNumber}
                        style={{ color: "#000000" }}
                        size='small'
                    />
                </Grid>

                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="Process"
                        placeholder='Process'
                        label='Process'
                        variant="outlined"
                        value={operation}
                        style={{ color: "#000000" }}
                        size='small'
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="PO No"
                        placeholder='PO No'
                        label='PO No'
                        variant="outlined"
                        value={jobcardNo}
                        style={{ color: "#000000" }}
                        size='small'
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="Total Qty"
                        placeholder='Total Qty'
                        label='Total Qty'
                        variant="outlined"
                        value={totalQty}
                        style={{ color: "#000000" }}
                        size='small'
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="Remarks"
                        placeholder='Remarks'
                        label='Remarks'
                        variant="outlined"
                        value={remarks}
                        style={{ color: "#000000" }}
                        size='small'
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                    <TextField
                        fullWidth
                        id="User"
                        placeholder='User'
                        label='User'
                        variant="outlined"
                        value={addedBy}
                        style={{ color: "#000000" }}
                        size='small'
                    />
                </Grid>
                <Grid
                    item
                    xs={12}  // Ensures the container spans the full width
                    container
                    justifyContent="flex-end" // Aligns the button to the right end
                >
                    <Button {...buttonStyle1} style={{ marginRight: "20px" }}
                        // onClick={() => {
                        //     QualityReport({
                        //         id: slNO
                        //     },
                        //         DownloadPOEntryTemplateSuccess,
                        //         DownloadPOEntryTemplateException
                        //     );
                        // }}  
                        onClick={handleExcelDownload}

                    >
                        Download
                    </Button>
                </Grid>



                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Card
                            style={{
                                boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)',
                                borderRadius: '10px',
                                width: '98%',
                                height: '100%',
                            }}
                        >
                            <CardContent>
                                <Box
                                    sx={{
                                        height: '150%',
                                        width: '100%',
                                        '& .MuiDataGrid-columnHeaders': {
                                            backgroundColor: '#93bce6', // Set the background color for column headers
                                            color: '#1c1919', // Set the text color for column headers
                                        },
                                        '& .MuiDataGrid-cell': {
                                            border: '1px solid #969696',
                                        },
                                        '& .MuiDataGrid-columnHeader': {
                                            border: '1px solid #969696', // Add border to column headers
                                        },
                                    }}
                                >
                                    <DataGrid
                                        rows={dataset}
                                        columns={columns2}
                                        pageSize={8}
                                        rowsPerPageOptions={[8]}
                                        disableSelectionOnClick
                                        style={{ border: 'none' }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '50vh',
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                WebkitTextStrokeWidth: '0.6px',
                                            },
                                            '& .MuiDataGrid-cell': {
                                                border: '1px solid #969696',
                                            },
                                            '& .MuiDataGrid-columnHeader': {
                                                border: '1px solid #969696',
                                            },
                                            '& .MuiDataGrid-columnHeaders': {
                                                backgroundColor: '#93bce6', // Set background color for column headers
                                                color: '#1c1919', // Set text color for column headers
                                            },
                                        }}
                                        getRowClassName={(params) => {
                                            const rowIndex = dataset.findIndex(row => row.id === params.row.id);
                                            if (rowIndex !== -1) {
                                                return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                            }
                                            return '';
                                        }}
                                        rowHeight={40}
                                        columnHeaderHeight={40}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </div>


                    {/* <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <Card
                            style={{
                                boxShadow: "0 10px 10px 2px rgba(0, 0, 0, 0.2)",
                                borderRadius: "10px",
                                width: "100%",
                                height: "100%",
                            }}
                            >
                            <CardContent>
                        
                                <DataGrid
                                    rows={dataset}
                                    columns={columns2}
                                    pageSize={8}
                                    rowsPerPageOptions={[8]}
                                    disableSelectionOnClick
                                    style={{ border: 'none', }}
                                        sx={{
                                            overflow: 'auto',
                                            height: '50vh',
                                            width: '100%',
                                            '& .super-app-theme--header': {
                                                WebkitTextStrokeWidth: '0.6px',
                                            },
                                            '& .MuiDataGrid-cell': {
                                                border: '1px solid #969696',
                                            },
                                            '& .MuiDataGrid-columnHeader': {
                                                border: '1px solid #969696', // Add border to column headers
                                            },
                                        }}
                                      getRowClassName={(params) => {
                                      
                                        const rowIndex = dataset.findIndex(row => row.id === params.row.id);
                                        
                                        if (rowIndex !== -1) {
                                            console.log(' ');
                                            return rowIndex % 2 === 0 ? 'Mui-evenRow' : 'Mui-oddRow';
                                        }
                                        return ''; 
                                    }}
                                    rowHeight={40}
                                    columnHeaderHeight={40}
                                />
                            </CardContent>
                        </Card>
                    </div> */}
                </Grid>


            </Grid>

            <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                }}
            >

                {/* <Button {...buttonStyle1} style={{ marginRight: "20px" }}>
                    Next
                </Button>
                <Button
                    // type="submit"
                    {...buttonStyle1}
                    style={{ marginRight: "20px" }}

                >
                    Previous
                </Button> */}
            </Grid>
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
        </div>
    )
}

export default WithoutInwardInsideFpiReport;