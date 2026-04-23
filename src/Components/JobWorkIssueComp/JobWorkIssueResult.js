import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Card, CardContent, Tooltip } from '@mui/material';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import JobWorkIssueTitle from './JobWorkIssueTitle';
import JobWorkIssueModal from './JobWorkIssueModal';
import { ShowMachine, MachineDelete, ViewGeneratedJobWorkIssue, GetJobWorkIssueDCCopy, GetJobWorkIssueDCJson } from '../../ApiService/LoginPageService'
import DeleteConfirmationDailog from '../../Utility/confirmDeletion';
import '../../App.css';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from 'react-router-dom';
import DataObjectIcon from '@mui/icons-material/DataObject';

const JobWorkIssueResult = (props) => {
    const navigate = useNavigate();
    const [refreshData, setRefreshData] = useState(false);
    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });
    const [deleteDailogOpen, setDeleteDailogOpen] = useState(false)
    const [deleteId, setDeleteId] = useState('')
    const [loader, setLoader] = useState(false);

    //NEW STATE
    const [jobWorkList, setJobWorkList] = useState([])

    const generateRowsWithIndex = (rows) => {
        return rows.map((row, index) => ({ sNo: index + 1, select: false, ...row }));
    };
    const rowData = generateRowsWithIndex(jobWorkList);

    const columns = [
        {
            field: 'sNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    SI No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'dcNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    DC No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'created_at',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Created At
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'challanNo',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Challan No
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'challanDate',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Challan Date
                </span>,
            type: 'string',
            sortable: true,
            minWidth: 80,
            flex: 1,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'suppCode',
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Supp Code
                </span>,

            type: 'string',
            sortable: true,
            minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            headerClassName: 'super-app-theme--header',
            headerName:
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Actions
                </span>,
            cellClassName: 'actions',
            disableClickEventBubbling: true,
            getActions: (params) => [
                <DownloadDC selectedRow={params.row} />,
                <ViewDC selectedRow={params.row} />,
                <Json selectedRow={params.row} />,
                // <EditData selectedRow={params.row} />,
                // <DeleteData selectedRow={params.row} />,
            ],
        },
    ];

    useEffect(() => {
        ViewGeneratedJobWorkIssue(handleSucessShow, handleExceptionShow)
    }, [refreshData]);

    const handleSucessShow = (dataObject) => {
        setJobWorkList(dataObject?.data || []);
        console.log("dataObject", dataObject)
    }
    const handleExceptionShow = (errorObject, errorMessage) => {

    }

    const handleFileSave = (item) => {
        console.log("handleFileSave", item)

        let info = [];
        item.itemsList.forEach((element, index, array) => {
            info.push([element.sNo, element.itemCode, element.itemName, element.hsnName, element.uomName, element.Qty, element.rate, element.amount])
        });
        const doc = new jsPDF();

        const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
        // console.log("baseUrl------------------>>>>>>>>>>>>>>", baseUrl);
        // const logoUrl = (await import('../../AllImage/RDL_Logo.png')).default;
        const logoUrl = `${baseUrl}/${item.jobWork.companyImage}`
        const ISOUrl = require('../../AllImage/ISOlogo.png');

        const tableOptions = {
            didDrawPage: (HookData) => {
                // Check if it's the first page
                if (HookData.pageNumber === 1) {
                    // Add an image on the first page
                    doc.addImage(logoUrl, 'PNG', 18, 13, 28, 20);
                    doc.addImage(ISOUrl, 'PNG', 170, 13, 20, 10);
                }
            },
        };

        const logoAndAddress = [
            [
                {
                    content: 'ORIGINAL FOR CONSIGNEE',
                    colSpan: 8,
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
                    content: `${item.jobWork.companyName}\n${item.jobWork.companyAdd}. Tel:${item.jobWork.telNo}\nWeb Site :${item.jobWork.website}\nEmail : ${item.jobWork.email}`,
                    colSpan: 5,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black' }
                },
                {
                    content: 'ISO 9001 : 2015\nISO 14001 : 2015\nOHSAS 18001 : 2007',
                    colSpan: 1,
                    styles: { halign: 'right', fontSize: 8, textColor: 'black', valign: 'bottom' }
                }
            ]
        ];
        const pan = [[
            {
                content: `CIN No. ${item.jobWork.cmpCinNo}`,
                colSpan: 3,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: `PAN No.${item.jobWork.cmpPanNo}`,
                colSpan: 1,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: `GSTINO. ${item.jobWork.cmpGstNo}`,
                colSpan: 3,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
            },
            {
                content: `No: ${item.jobWork.dcNo}`,
                colSpan: 1,
                styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
            }
        ]];
        const poHeader = [[{ content: 'DELIVERY CHALLAN', colSpan: 8, styles: { textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' } }]];
        const address = [
            [
                {
                    content: `To: \nM/s. ${item.jobWork.supplierName}\n${item.jobWork.address}\nPAN No: ${item.jobWork.panNo}\nGST No: ${item.jobWork.gstNo}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
                },

                {
                    content: `Ship To: \nM/s. ${item.jobWork.supplierName}\n${item.jobWork.address}\nPAN No: ${item.jobWork.panNo}\nGST No: ${item.jobWork.gstNo}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
                },
            ],
            [
                {
                    content: `Place of Supply & State : ${item.jobWork.state}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
                },
                {
                    content: `State Code : ${item.jobWork.toStateCode}`,
                    colSpan: 4,
                    styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
                },
            ]

        ];
        const firstHeaderRow = [
            [
                {
                    content: `DC NO: ${item.jobWork.dcNo}`,
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                },
                {
                    content: `Challan No: ${item.jobWork.challanNo} `,
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                },
                {
                    content: `Mode of Trans: ${item.jobWork.modeOfTransport}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                }
            ],
            [
                {
                    content: `DC Date: ${item.jobWork.created_at}`,
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                },
                {
                    content: `Challan Date: ${item.jobWork.challanDate}`,
                    colSpan: 3,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                },
                {
                    content: `Vehicle No:${item.jobWork.vehicleNo}`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 8, textColor: 'black', fontStyle: 'bold', fontWeight: 'bold' }
                }
            ],
        ];

        const secondHeaderRow = [['SI No', 'Part Name', 'Part Description ', 'HSN /SAC', 'UOM', 'Qty', 'Rate', 'Amount']];

        const headerRows = [...logoAndAddress, ...pan, ...poHeader, ...address, ...firstHeaderRow, ...secondHeaderRow];

        const totalRow = [
            [
                {
                    content: `Remarks :`,
                    colSpan: 5,
                    rowSpan: 1,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black' }
                },
                {
                    content: 'Total Qty',
                    colSpan: 1,
                    styles: { halign: 'center', fontSize: 10, textColor: 'black' }
                },
                {
                    content: item.jobWork.totalQty,
                    colSpan: 2,
                    styles: { halign: 'center', fontSize: 10, textColor: 'black' }
                },
            ],
            [
                {
                    content: `DC Issue Date : ${item.jobWork.created_at}`,
                    colSpan: 5,
                    rowSpan: 1,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black' }
                },
                {
                    content: 'Total Value',
                    colSpan: 1,
                    styles: { halign: 'center', fontSize: 10, textColor: 'black' }
                },
                {
                    content: item.jobWork.totalValue,
                    colSpan: 2,
                    styles: { halign: 'center', fontSize: 10, textColor: 'black' }
                },

            ],
            [
                {
                    content: 'Subject to Bengaluru Jurisdiction',
                    colSpan: 5,
                    rowSpan: 1,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black' }
                },
                {
                    content: 'Gross Value',
                    colSpan: 1,
                    styles: { halign: 'center', fontSize: 10, textColor: 'black' }
                },
                {
                    content: item.jobWork.totalGrossAmt,
                    colSpan: 2,
                    styles: { halign: 'center', fontSize: 10, textColor: 'black' }
                },

            ],
        ];


        const termsAndSuppluColumn = [
            [
                {
                    content: `Receiver's Signature`,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black', valign: 'bottom', marginTop: 10, paddingTop: 10 }
                },
                {
                    content: `Prepared By ${item.jobWork.createdBy} `,
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black', valign: 'bottom', marginTop: 10, paddingTop: 10 }
                },
                {
                    content: 'Reviewed By',
                    colSpan: 2,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black', valign: 'bottom', marginTop: 10, paddingTop: 10 }
                },
                {
                    content: 'Authorized Signatory',
                    colSpan: 4,
                    styles: { halign: 'left', fontSize: 10, textColor: 'black', marginTop: 10, paddingTop: 10 }
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
            startY: 2,
            ...tableOptions,
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

        doc.save('Delivery Challen.pdf');
    }

    const getInvoiceData = (data) => {
        setLoader(true)
        GetJobWorkIssueDCCopy({ id: data.id }, getInvoiceDataSuccess, getInvoiceDataExceptoin)
    }

    const getInvoiceDataSuccess = (dataObject) => {
        setLoader(false);
        console.log("getInvoiceDataSuccess", dataObject)
        handleFileSave(dataObject || [])
    }

    const getInvoiceDataExceptoin = (errorObject, errorMessage) => {
        setLoader(false);
        console.log("error Msg", errorMessage);
    }

    function DownloadDC(props) {
        return (
            <Tooltip title="Download DC">
                <FileDownloadIcon
                    style={{ color: '#000000' }}
                    onClick={(event) => {
                        getInvoiceData(props.selectedRow)
                    }}
                />
            </Tooltip>
        );
    }
    function ViewDC(props) {
        return (
            <Tooltip title="View DC">
                <RemoveRedEyeIcon
                    style={{ color: '#000000' }}
                    onClick={() => {
                        //   (params.row.id);
                        // setIsView(true);
                        navigate(`/JobWorkIssueModal?isView=true&&jcRowId=${props.selectedRow.id}`)
                    }}
                />
            </Tooltip>
        );
    }

    const handleJsonDownload = (id) => {
        setLoader(true)
        GetJobWorkIssueDCJson({ id: id }, getJsonSuccess, getJsonExceptoin)
    }

    const getJsonSuccess = async (dataObject) => {
        setLoader(false);
        try {
            // Create a Blob from the JSON data
            const jsonBlob = new Blob([JSON.stringify(dataObject, null, 2)], { type: 'application/json' });
            // Create a link element
            const link = document.createElement('a');
            link.href = URL.createObjectURL(jsonBlob);
            link.download = 'JWI.json'; // Filename for the downloaded file
            // Programmatically click the link to trigger the download
            link.click();
            // Clean up the object URL
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error fetching API:', error);
        }
    }
    const getJsonExceptoin = () => {
        setLoader(false);
    }

    function Json(props) {
        return (
            <Tooltip title="JSON">
                <DataObjectIcon
                    style={{ color: '#000000' }}
                    onClick={() => {
                        handleJsonDownload(props.selectedRow.id)
                    }}
                />
            </Tooltip>
        );
    }

    const deletehandleSuccess = (dataObject) => {
        setNotification({
            status: true,
            type: 'success',
            message: dataObject.message,
        });
        setRefreshData((oldvalue) => !oldvalue);
        setTimeout(() => {
            handleClose();
            setDeleteDailogOpen(false);
        }, 3000);
    };
    const deletehandleException = (errorObject, errorMessage) => {
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            // handleClose();
        }, 3000);
    };

    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    return (
        <div style={{ height: '60vh', width: '100%' }}>
            <JobWorkIssueTitle />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', borderRadius: '10px', width: '98%', height: '100%' }}>
                    <CardContent>
                        <Box
                            sx={{
                                height: '150%',
                                width: '100%',
                                '& .super-app-theme--header': {
                                    backgroundColor: '#93bce6',
                                    color: '#1c1919'
                                },
                            }}
                        >
                            <DataGrid
                                rows={rowData}
                                columns={columns}
                                pageSize={8}
                                loading={loader}
                                rowsPerPageOptions={[8]}
                                disableSelectionOnClick
                                style={{ border: 'none', }}
                                sx={{
                                    overflow: 'auto',
                                    height: '68vh',
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
                                        border: '1px solid #969696',
                                    },
                                }}
                                getRowClassName={(params) => {
                                    const rowIndex = jobWorkList.findIndex(row => row.id === params.row.id);
                                    if (rowIndex !== -1) {
                                        console.log(' ');
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
            <NotificationBar
                handleClose={handleClose}
                notificationContent={openNotification.message}
                openNotification={openNotification.status}
                type={openNotification.type}
            />
            <DeleteConfirmationDailog
                open={deleteDailogOpen}
                setOpen={setDeleteDailogOpen}
                deleteId={deleteId}
                deleteService={MachineDelete}
                handleSuccess={deletehandleSuccess}
                handleException={deletehandleException}
            />
        </div>
    )
}

export default JobWorkIssueResult;