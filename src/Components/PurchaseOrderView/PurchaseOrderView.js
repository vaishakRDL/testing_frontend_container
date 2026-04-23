import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Card, CardContent, Grid, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { POGenerateServices, GetPurchaseOrderInvoiceData } from '../../ApiService/LoginPageService';
import { useEffect } from 'react';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import CompliteSucess from './CompliteSucess';
import Chip from '@mui/material/Chip';
import { Link, useNavigate } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PurchaseBillPreview from './PurchaseBillPreview/PurchaseBillPreview';
import BackupIcon from '@mui/icons-material/Backup';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import { useModuleLocks } from '../context/ModuleLockContext';

const PurchaseOrderView = () => {
  const [rows, setRows] = useState([]);
  const [poBillModalOpen, setPoBillModalOpen] = useState(false);
  const [poData, setPoData] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfModalOpen, setPdfModalOpen] = useState(false)

  const navigate = useNavigate();
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "View Purchase Orders")?.lockStatus === "locked";

  useEffect(() => {
    POGenerateServices(handlePOGenerateServicesSuccess, handlePOGenerateServicesExceptoin);
  }, []);

  const handlePOGenerateServicesSuccess = (dataObject) => {
    setRows(dataObject?.data || []);
  }

  const handlePOGenerateServicesExceptoin = (errorObject, errorMessage) => {
    console.log("error Msg", errorMessage);
  }

  const getInvoiceData = (data) => {
    GetPurchaseOrderInvoiceData({ poDigit: data.digit }, getInvoiceDataSuccess, getInvoiceDataExceptoin)
  }

  const getInvoiceDataSuccess = (dataObject) => {
    console.log("getInvoiceDataSuccess", dataObject.testData)
    handleFileSave(dataObject?.testData || [])
  }

  const getInvoiceDataExceptoin = (errorObject, errorMessage) => {
    console.log("error Msg", errorMessage);
  }

  const handleFileSave = (item) => {
    console.log("handleFileSave", item)

    let info = [];
    item.data.forEach((element, index, array) => {
      info.push([element.sNo, element.itemCode, element.itemDescription, element.uom, element.qty, element.schDate, element.unitRate, element.value])
    });
    const doc = new jsPDF();
    const baseUrl = process.env.REACT_APP_API_URL?.replace("/api", "") || "";
    const logoUrl = `${baseUrl}/${item.companyImage}`
    const IsoUrl = require('../../AllImage/ISOlogo.png');
    const tableOptions = {
      didDrawPage: (HookData) => {
        // Check if it's the first page
        if (HookData.pageNumber === 1) {
          // Add an image on the first page
          doc.addImage(logoUrl, 'PNG', 22, 18, 28, 15);
          doc.addImage(IsoUrl, 'PNG', 175, 16, 20, 10);
        }
      },
    };

    const logoAndAddress = [
      // [
      //   {
      //     content: {
      //       image: logoUrl,
      //       width: 30, // adjust the width as needed
      //       height: 30, // adjust the height as needed
      //     },
      //     colSpan: 2
      //   },
      //   {
      //     content: 'RDL Technologies Pvt Ltd.\nPlot No. 126, Road No 3, KIADB Industrial Estate\nII Phase, Jigani Industrial Area, Jigani,Anekal Taluk,\nBengaluru - 560 105. Tel:080-27825249\nWeb Site :www.mallikengineering.com\nEmail : info@mallikengineering.com',
      //     colSpan: 4,
      //     styles: { halign: 'left', fontSize: 8, textColor: 'black' }
      //   },
      //   {
      //     content: 'ISO 9001 : 2015\nISO 14001 : 2015\nOHSAS 18001 : 2007',
      //     colSpan: 2,
      //     styles: { halign: 'right', fontSize: 6, textColor: 'black', valign: 'bottom' }
      //   }
      // ]
      [
        {
          content: ``,
          colSpan: 2,
          styles: {
            halign: 'left', fontSize: 8, textColor: 'black',
            lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
            lineColor: { top: [0, 0, 0] },
          }
        },
        {
          content: `${item.companyName}\n${item.companyAdd}. Tel:${item.telNo}\nWeb Site :${item.website}\nEmail : ${item.email}`,
          colSpan: 4,
          styles: {
            halign: 'left', fontSize: 8, textColor: 'black',
            // lineWidth: { top: 0.2, right: 0.2, bottom: 0, left: 0.2 },
            // lineColor: { top: [0, 0, 0] },
          }
        },
        {
          content: 'ISO 9001 : 2015\nISO 14001 : 2015\nOHSAS 18001 : 2007',
          colSpan: 2,
          styles: { halign: 'right', fontSize: 6, textColor: 'black', valign: 'bottom' }
        }
      ],
    ];
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
        colSpan: 3,
        styles: { halign: 'center', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
      }
    ]];
    const poHeader = [[{ content: `PURCHASE ORDER - ${item.type === 'J' ? 'JOB WORK' : 'RAW MATERIAL'}`, colSpan: 8, styles: { textColor: 'blue' } }]];
    const address = [
      [
        {
          content: `To,\nM/s. ${item.toName}\n${item.toAddress}\nPAN No. ${item.panNo}\nGST No. ${item.gstNo}`,
          colSpan: 4,
          rowSpan: 5,
          styles: { halign: 'left', valign: 'top', fontSize: 8, textColor: 'black', fontStyle: 'normal' }
        },
        {
          content: 'Order No:',
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10 }
        },
        {
          content: item.poNo,
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
        },
      ],
      [
        {
          content: 'Ammendment No:',
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10 }
        },
        {
          content: '1',
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
        },
      ],
      [
        {
          content: 'Date :',
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10 }
        },
        {
          content: item.date,
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
        },
      ],
      [
        {
          content: 'PO Type :',
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10 }
        },
        {
          content: item.poType,
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
        },
      ],
      [
        {
          content: 'Ref No & Date:',
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10 }
        },
        {
          content: '',
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'blue' }
        },
      ],
    ];
    const firstHeaderRow = [[{ content: 'We are pleased to place an order for the following items, subject to the terms & conditions given below', colSpan: 8 }]];

    const secondHeaderRow = [['SI No', 'Item Code', 'Item Description', 'UOM', 'Qty', 'Sch Date', 'Unit Rate', 'Value']];

    const headerRows = [...logoAndAddress, ...pan, ...poHeader, ...address, ...firstHeaderRow, ...secondHeaderRow];

    const totalRow = [
      [
        {
          content: '"Special Instruction: Multiple GST rate not allowed in Single Invoice"',
          colSpan: 5,
          styles: { halign: 'left', fontSize: 10, textColor: 'red' }
        },
        {
          content: 'Total',
          colSpan: 1,
          styles: { halign: 'center', fontSize: 10, textColor: 'blue' }
        },
        {
          content: `INR ${item.total}`,
          colSpan: 2,
          styles: { halign: 'center', fontSize: 10, textColor: 'blue' }
        },
      ]
    ];
    const totalWords = [[
      {
        content: 'Total Amount In Words',
        colSpan: 2,
        styles: { halign: 'left', fontSize: 10 }
      },
      {
        content: `INR ${item.amountInWords}`,
        colSpan: 6,
        styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
      }
    ]];

    const termsAndSuppluColumn = [
      [
        {
          content: 'Terms & Conditions:',
          colSpan: 4,
          styles: { halign: 'left', fontSize: 10, textColor: 'red' }
        },
        {
          content: 'Supply Conditions:',
          colSpan: 4,
          styles: { halign: 'left', fontSize: 10, textColor: 'red' }
        }
      ],
      [
        {
          content: 'GST :',
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
        },
        {
          content: item.gst,
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
        },
        {
          content: '* Necessary Test Certificate/ Inspection Reports shall be furnished along with the supplies\n* Subject to Bengaluru Jurisdiction',
          colSpan: 4,
          rowSpan: 5,
          styles: { halign: 'left', valign: 'top', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
        },
      ],
      [
        {
          content: 'Payment Terms :',
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
        },
        {
          content: item.paymentTerms,
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
        },
      ],
      [
        {
          content: 'Delivery Mode :',
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
        },
        {
          content: item.deliveryMode,
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
        },
      ],
      [
        {
          content: 'Supply of Matl. :',
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'black', fontStyle: 'normal' }
        },
        {
          content: item.supplyOfMaterial,
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
        },
      ],
      [
        {
          content: 'Special Instruction 1 :',
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
        },
        {
          content: item.specialInstruction1,
          colSpan: 2,
          styles: { halign: 'left', fontSize: 10, textColor: 'blue', fontStyle: 'normal' }
        },
      ]
    ]

    const requirements = [
      [
        {
          content: 'EMS Requirements :',
          colSpan: 4,
          styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        },
        {
          content: 'OHSAS requirements :',
          colSpan: 4,
          styles: { halign: 'left', fontSize: 10, textColor: 'black' }
        }
      ],
      [
        {
          content: '* Reduce process scrap\n* Use recycled carton boxes for packing the components\n* Conserve usage of electrical energy\n* Ensure disposal of hazardous waste to authorised Agency\n* Conserve usage of oils and recycle the same to the extent possible',
          colSpan: 4,
          styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', valign: 'top', }
        },
        {
          content: '* All operators should wear relevant PPEs Like Safety shoe,Helmet, Goggles,Handgloves as applicable during working.\n* Ensure necessary material handling equipments/in your facilities\n* Monitor and Evaluate Near Miss Incidents.\n* Ensure Statutory Requirements.',
          colSpan: 4,
          styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', valign: 'top', }
        }
      ]
    ]

    const para = [[{
      content: 'Please send the acknowledgement thru return mail for having accepted this purchase order. In case of no communication within 2days of the receipt of the mail, Purchase order shall be considered as accepted by you.',
      colSpan: 8,
      styles: { fontStyle: 'normal', fontSize: 9, }
    }]];

    const users = [[
      {
        content: `Prepared By / ${item.preparedBy}`,
        colSpan: 2,
        styles: { halign: 'center', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
      },
      {
        content: `Reviewed By / ${item.reviewedBy}`,
        colSpan: 3,
        styles: { halign: 'center', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
      },
      {
        content: `Approved By / ${item.approvedBy}`,
        colSpan: 3,
        styles: { halign: 'center', fontSize: 9, textColor: 'black', fontStyle: 'normal' }
      }
    ]];

    const note = [[
      {
        content: 'Note',
        colSpan: 1,
        styles: { halign: 'left', fontSize: 9, textColor: 'red', fontStyle: 'bold' }
      },
      {
        content: 'This is computer generated document and is valid without signature',
        colSpan: 7,
        styles: { halign: 'left', fontSize: 9, textColor: 'blue', fontStyle: 'bold' }
      },
    ]];

    const outerTable = [
      [
        {
          content: 'Regd. & Corporate Office:No.380A, 5th Main, Bilekahalli,Vijaya Bank Layout, Off. Bannergatta Road,Bangalore 560 076',
          colSpan: 8,
          styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', lineWidth: 0 }
        },
      ],
      [
        {
          content: 'FORMAT NO : IMS-ME-PUR-F-219-Rev-3 Dated 11-01-2019',
          colSpan: 8,
          styles: { halign: 'left', fontSize: 9, textColor: 'black', fontStyle: 'normal', lineWidth: 0 }
        },
      ]
    ];

    const bodyRows = [...info, ...totalRow, ...totalWords, ...termsAndSuppluColumn, ...requirements, ...para, ...users, ...note]
    const footRows = [...outerTable]

    doc.autoTable({
      theme: 'striped',
      head: headerRows,
      body: bodyRows,
      foot: footRows,
      showHead: 'firstPage',
      showFoot: 'lastPage',
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

    // doc.save('PurchaseOrder.pdf');
    const pdfBlob = doc.output('blob');
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfBlobUrl);
  }

  const columns1 = [
    {
      field: 'poNo',
      headerClassName: 'super-app-theme--header',
      headerName:
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
          PO No
        </span>
      , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center'
    },
    {
      field: 'suppName',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Supplier Name</span>
      , width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'left', headerAlign: 'center'
    },
    { field: 'userBy', headerClassName: 'super-app-theme--header', headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>User</span>, width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'created_at', headerClassName: 'super-app-theme--header', headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Date</span>, width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'date', headerClassName: 'super-app-theme--header', headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Schedule Date</span>, width: 70, type: 'string', sortable: true, minWidth: 100, flex: 1, align: 'center', headerAlign: 'center' },
    {
      field: 'delayCnt',
      headerClassName: 'super-app-theme--header',
      headerName: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Delay</span>,
      width: 70,
      type: 'string',
      sortable: true,
      minWidth: 100,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ color: params.value < 0 ? 'red' : 'inherit' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'status',
      headerClassName: 'super-app-theme--header',
      headerName:
        <span style={{ fontWeight: "bold", fontSize: '16px' }}>Status</span>,
      type: 'string',
      sortable: true,
      headerClassName: 'super-app-theme--header',
      width: 70, flex: 1, align: 'center', headerAlign: 'center',
      cellClassname: 'actions',
      type: 'actions',
      getActions: (params) => [
        <Chip style={{ width: "100px" }} label={params.row.status} color={CompliteSucess(params.row.status)} />,
      ]
    },
    {
      field: 'actions',
      type: 'actions',
      headerClassName: 'super-app-theme--header',
      width: 70,
      flex: 1,
      align: 'left',
      headerAlign: 'center',
      headerName: (
        <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Actions</span>
      ),
      cellClassName: 'actions',
      disableClickEventBubbling: true,
      getActions: (params) => {
        const actions = [
          <PrintData key="print" selectedRow={params.row} />,
          <PriviewPurchaseOrder key="print" selectedRow={params.row} />,
          // <EditPurchaseOrder key="edit" selectedRow={params.row} />,
          <GeneratePurchaseBill key="generate" selectedRow={params.row} />,
          <ViewPurchaseBill key="view" selectedRow={params.row} />
        ];

        // if (params.row.status === 'Pending') {
        //   actions.push(<EditPurchaseOrder key="edit" selectedRow={params.row} />);
        // }
        // if (params.row.status === 'Approved' || params.row.status === 'Partially Completed') {
        //   actions.push(<GeneratePurchaseBill key="generate" selectedRow={params.row} />);
        // }
        // if (params.row.status === 'Partially Completed' || params.row.status === 'Completed') {
        //   actions.push(<ViewPurchaseBill key="view" selectedRow={params.row} />);
        // }
        return actions;
      },
    },
  ];

  function PriviewPurchaseOrder(props) {
    return (
      <Tooltip disableFocusListener title="View PO" >
        <PreviewIcon
          style={{ color: isModuleLocked ? "gray" : "#000000", marginLeft: "5px", marginRight: "5px" }}
          onClick={() => {
            //   (params.row.id);
            // setIsView(true);
            if (isModuleLocked) return;
            navigate(`/PurchaseOrderGenerationModule?isPurchaseOrderView=true&&poDigit=${props.selectedRow.digit}&&rowId=${props.selectedRow.id}`);
          }}
        />
      </Tooltip>
    );
  }

  function EditPurchaseOrder(props) {
    console.log("tttttttttttttttttt", props.selectedRow)
    return (
      <Tooltip disableFocusListener title="Edit PO">
        {
          props.selectedRow.status === 'Pending' ?
            <EditIcon
              style={{ color: '#000000', marginLeft: "5px", marginRight: "5px" }}
              onClick={() => {
                //   (params.row.id);
                // setIsView(true);
                navigate(`/PurchaseOrderGenerationModule?isEdit=true&&poDigit=${props.selectedRow.digit}&&rowId=${props.selectedRow.id}&&supId=${props.selectedRow.supId}`);
              }}
            />
            :
            <EditIcon
              style={{ color: '#C0C0C0', marginLeft: "5px", marginRight: "5px" }}
            />
        }
      </Tooltip >
    );
  }

  function GeneratePurchaseBill(props) {
    console.log("Allocate===>", props.selectedRow);
    // const handlePurchaseBill = () => {
    //   console.log("Allocate===>", props.selectedRow.poNo);
    // }
    return (
      // <Link to={`/PurchaseBillAgainstPOModule?selectName=${props.selectedRow.suppName}&&selectId=${props.selectedRow.id}&&selectPotype=${props.selectedRow.type}&&selectdigit=${props.selectedRow.digit}&&selectPo=${props.selectedRow.poNo}&&selectspAddress=${props.selectedRow.spAddress}&&selectsupId=${props.selectedRow.supId}`}>
      //   <Tooltip disableFocusListener title="Invoice Upload" >
      //     <BackupIcon
      //       style={{ color: '#000000', marginLeft: "5px", marginRight: "5px" }}
      //       onClick={handlePurchaseBill}
      //     />
      //   </Tooltip>
      // </Link>
      <Tooltip disableFocusListener title="Invoice Upload" >
        {props.selectedRow.status === 'Approved' || props.selectedRow.status === 'Partially Completed' ?
          <BackupIcon
            style={{ color: '#000000', marginLeft: "5px", marginRight: "5px" }}
            onClick={() => {
              //   (params.row.id);
              // setIsView(true);
              navigate(`/PurchaseBillAgainstPOModule?isGenPOBill=true&&selectedSuppName=${props.selectedRow.suppName}&&selectedPodigit=${props.selectedRow.digit}&&selectedSpAddress=${props.selectedRow.spAddress}&&selectedsupId=${props.selectedRow.supId}&&selectedCurrency=${props.selectedRow.currency}&&selectedCurrencyId=${props.selectedRow.currencyId}`);
            }} />
          :
          <BackupIcon
            style={{ color: '#C0C0C0', marginLeft: "5px", marginRight: "5px" }}
          />
        }
      </Tooltip>
    );
  }

  function PrintData(props) {
    return (
      <Tooltip disableFocusListener title="PO Download" >
        <DownloadIcon
          style={{ color: '#000000', marginLeft: "5px", marginRight: "5px" }}
          onClick={() => {
            setPdfModalOpen(true)
            getInvoiceData(props.selectedRow)
          }}
        />
      </Tooltip>
    );
  }

  function ViewPurchaseBill(props) {
    return (
      <Tooltip disableFocusListener title="View Invoice" >
        {props.selectedRow.status === 'Partially Completed' || props.selectedRow.status === 'Completed' ?
          <RemoveRedEyeIcon
            style={{ color: '#000000', marginLeft: "5px", marginRight: "5px" }}
            onClick={() => {
              setPoData(props.selectedRow);
              setPoBillModalOpen(true);
            }}
          />
          :
          <RemoveRedEyeIcon
            style={{ color: '#C0C0C0', marginLeft: "5px", marginRight: "5px" }}
          />
        }
      </Tooltip>
    );
  }

  return (
    <div>
      <div style={{ height: '100%', padding: 16, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" gutterBottom sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}>
            Purchase Order Display
          </Typography>

          {/* <Link to='/PurchaseOrderGenerationModule'>
            <Button
              variant="contained"
              component="label"
              sx={{ marginRight: '16px', backgroundColor: isModuleLocked ? "gray" : "#002D68", height: '40px', borderRadius: '20px', width: '150px', color: 'white' }}
            >
              New
            </Button>
          </Link> */}
          <Button
            variant="contained"
            sx={{
              marginRight: "16px",
              backgroundColor: isModuleLocked ? "gray" : "#002D68",
              height: "40px",
              borderRadius: "20px",
              width: "150px",
              color: "white",
            }}
            disabled={isModuleLocked}
            onClick={() => {
              if (!isModuleLocked) {
                navigate("/PurchaseOrderGenerationModule");
              }
            }}
          >
            New
          </Button>
        </div>
        <Grid container spacing={2} style={{ flex: 1 }}>
          {/* First Grid */}
          <Grid item xs={12}>
            <Card style={{ boxShadow: '0 10px 10px 2px rgba(0, 0, 0, 0.2)', marginTop: '20px', borderRadius: '10px', width: '100%', height: '650px' }}>
              <CardContent style={{ padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="h9" style={{ fontWeight: 'bold' }}></Typography>
                <div style={{ height: 600, width: '100%' }}>
                  <DataGrid
                    rows={rows}
                    columns={columns1}
                    pageSize={5}
                    disableSelectionOnClick
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
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </div>
      <PurchaseBillPreview
        poBillModalOpen={poBillModalOpen}
        setPoBillModalOpen={setPoBillModalOpen}
        poData={poData}
      />
      <Dialog open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>Purchase Order</DialogTitle>

        <DialogContent style={{ padding: '2px' }}>
          {pdfUrl &&
            <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
          }
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setPdfModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default PurchaseOrderView;
