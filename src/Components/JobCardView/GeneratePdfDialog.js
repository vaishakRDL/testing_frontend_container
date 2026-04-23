import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { JobCardView } from '../../ApiService/LoginPageService';

const GeneratePdfDialog = ({ open, handleClose, pdfData, selectedRowJobCardNo, jcId }) => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [jcDetails, setjcDetails] = useState('');
  const [bomDetails, setbomDetails] = useState([]);
  const [processDetails, setprocessDetails] = useState([]);

  useEffect(() => {
    console.log("useEffect triggered", { open, jcId });
    if (open && jcId) {
      JobCardView(
        { jcId: jcId },
        handleJobCardViewSuccess,
        handleJobCardViewException
      );
    }
  }, [open, jcId]);


  const handleJobCardViewSuccess = (dataObject) => {
    setjcDetails(dataObject?.jcDetails || '');
    setbomDetails(dataObject?.bomDetails || []);
    setprocessDetails(dataObject?.processDetails || []);
  }

  const handleJobCardViewException = () => {
  }
  useEffect(() => {
    if (jcDetails) {
      generatePdf();
    }
  }, [jcDetails]);

  const fullGrn = (jcDetails?.grn && jcDetails?.grn !== 'null') ? jcDetails.grn : '';
  const grnList = fullGrn.split(',').map(x => x.trim());

  // Show ONLY ONE GRN in header
  const grnHeaderDisplay = grnList.length > 1 ? `${grnList[0]} ...` : fullGrn;

  // Footer will show ALL GRNs
  const grnFooterDisplay = fullGrn;

  const generatePdf = () => {
    // Use explicit A4 Portrait to avoid browser auto-scaling/shrinking
    const doc = new jsPDF('p', 'mm', 'a4');
    const logoUrl = require('../../AllImage/RDL_Logo.png');

    // Build process rows matching UI
    const info = (processDetails || []).map(e => [
      e?.sNo ?? '',
      e?.schDate ?? e?.date ?? '',
      e?.shift ?? '',
      e?.process ?? '',
      e?.machineName ?? '',
      e?.producedQty ?? '',
      e?.acptQty ?? '',
      e?.operator ?? '',
      e?.qa ?? '',
      e?.prod_eng ?? '',

    ]);

    // BOM rows
    const infobomDetails = (bomDetails || []).map(el => ([
      { content: el?.itemCode || '', colSpan: 2, styles: { halign: 'center' } },
      { content: el?.itemName || '', colSpan: 2, styles: { halign: 'center' } },
      { content: el?.materialThickness || ' ', colSpan: 2, styles: { halign: 'center' } },
      { content: el?.Qty || ' ', colSpan: 1, styles: { halign: 'center' } },
      { content: el?.preparedQty || ' ', colSpan: 1, styles: { halign: 'center' } },
    ]));

    const tableOptions = {};

    // Header block
    const headerBlock = [
      // Row 1: Left logo spans 6 rows, center title, right JC Card No
      [
        { content: '', colSpan: 3, rowSpan: 6, styles: { halign: 'center', valign: 'top' } },
        { content: 'JOB CARD', colSpan: 3, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', fontSize: 16, textColor: [0, 0, 0] } },
        { content: 'JC Card No', colSpan: 2, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fillColor: [242, 242, 242], textColor: [0, 0, 0] } },
        { content: `${jcDetails?.jcNo ?? ''}`, colSpan: 1, styles: { halign: 'left', valign: 'middle', fillColor: [242, 242, 242], textColor: [0, 0, 0] } },
      ],
      // Row 2: Company name centered | JC Issue Date (skip first 3 cols due to rowSpan)
      [
        { content: ``, colSpan: 3, styles: { halign: 'center', valign: 'middle', fontStyle: 'bold', textColor: [0, 0, 0] } },
        { content: 'JC Issue Date', colSpan: 2, styles: { halign: 'left', valign: 'middle', fontSize: 9, fontStyle: 'bold', fillColor: [242, 242, 242], textColor: [0, 0, 0] } },
        { content: `${jcDetails?.issuedDate ?? ''}`, colSpan: 1, styles: { halign: 'left', valign: 'middle', fillColor: [242, 242, 242], textColor: [0, 0, 0] } },
      ],
      // Row 3: center blank | KANBAN Date (skip first 3 cols due to rowSpan)
      [
        { content: '', colSpan: 3 },
        { content: 'KANBAN Date', colSpan: 2, styles: { halign: 'left', valign: 'middle', fontSize: 9, fontStyle: 'bold', fillColor: [242, 242, 242], textColor: [0, 0, 0] } },
        { content: `${jcDetails?.kanbanDate ?? ''}`, colSpan: 1, styles: { halign: 'left', valign: 'middle', fillColor: [242, 242, 242], textColor: [0, 0, 0] } },],
      // Row 4: center blank | Schedule Date (skip first 3 cols due to rowSpan)
      [
        { content: '', colSpan: 3 },
        { content: 'Schedule Date', colSpan: 2, styles: { halign: 'left', valign: 'middle', fontSize: 9, fontStyle: 'bold', fillColor: [242, 242, 242], textColor: [0, 0, 0] } },
        { content: `${jcDetails?.scheduledDate ?? ''}`, colSpan: 1, styles: { halign: 'left', valign: 'middle', fillColor: [242, 242, 242], textColor: [0, 0, 0] } },
      ],
      // Row 5: center band text | GRN NO (skip first 3 cols due to rowSpan)
      [
        { content: '', colSpan: 3, styles: { halign: 'center', valign: 'middle', fontSize: 9, fontStyle: 'bold', textColor: [0, 0, 0] } },
        { content: 'GRN NO', colSpan: 2, styles: { halign: 'left', valign: 'middle', fontSize: 9, fontStyle: 'bold', fillColor: [242, 242, 242], textColor: [0, 0, 0] } },
        { content: `${grnHeaderDisplay}`, colSpan: 1, styles: { halign: 'left', valign: 'middle', fontStyle: 'bold', fillColor: [242, 242, 242], textColor: [0, 0, 0] } },
      ],
      // Row 6: center blank | Product Family (skip first 3 cols due to rowSpan)
      [
        { content: 'OTIS Elevator Company (India) ltd', colSpan: 3, styles: { halign: 'center', valign: 'middle', fontSize: 10, fontStyle: 'bold', textColor: [0, 0, 0] } },
        { content: 'Product Family', colSpan: 2, styles: { halign: 'left', valign: 'middle', fontSize: 9, fontStyle: 'bold', fillColor: [242, 242, 242], textColor: [0, 0, 0] } },
        { content: `${jcDetails?.productFamily ?? ''}`, colSpan: 1, styles: { halign: 'left', valign: 'middle', fontSize: 10, fillColor: [242, 242, 242], textColor: [0, 0, 0] } },
      ],
    ];

    // Part details
    const partDetails = [
      [
        { content: 'Part No', colSpan: 3, styles: { halign: 'left', fontSize: 10, fontStyle: 'bold' } },
        { content: `${jcDetails?.itemCode ?? ''}`, colSpan: 3, styles: { halign: 'left', fontSize: 10, } },
        { content: `${jcDetails?.planEngineer ?? ''}\n\n\n\n\n\n\PLANNING ENGINEER SIGN`, colSpan: 3, rowSpan: 6, styles: { halign: 'center', valign: 'middle', fontSize: 12, fontStyle: 'bold' } },
      ],
      [
        { content: 'Description', colSpan: 3, styles: { halign: 'left', fontSize: 10, fontStyle: 'bold' } },
        { content: `${jcDetails?.itemName ?? ''}`, colSpan: 3, styles: { halign: 'left', fontSize: 10, } },
      ],
      [
        { content: 'Material Spec', colSpan: 3, styles: { halign: 'left', fontSize: 10, fontStyle: 'bold' } },
        { content: `${(jcDetails?.materialSpec && jcDetails?.materialSpec !== 'null') ? jcDetails.materialSpec : ''}`, colSpan: 3, styles: { halign: 'left', fontSize: 10, } },
      ],
      [
        { content: 'Material Thickness', colSpan: 3, styles: { halign: 'left', fontSize: 10, fontStyle: 'bold' } },
        { content: `${jcDetails?.materialThickness ?? ''}`, colSpan: 3, styles: { halign: 'left', fontSize: 10, } },
      ],
      [
        { content: 'Planned Qty', colSpan: 3, styles: { halign: 'left', fontSize: 10, fontStyle: 'bold' } },
        { content: `${jcDetails?.plannedQty ?? ''}`, colSpan: 3, styles: { halign: 'left', fontSize: 10, } },
      ],
      [
        { content: 'Finishing Details', colSpan: 3, styles: { halign: 'left', fontSize: 10, fontStyle: 'bold' } },
        { content: `${jcDetails?.finishingDetails ?? ''}`, colSpan: 3, styles: { halign: 'left', fontSize: 10, } },
      ],
    ];

    // Process header row styled blue
    const processHeader = [[
      { content: 'SI NO', styles: { halign: 'center', fontStyle: 'bold', textColor: 'black', } },
      { content: 'Date', styles: { halign: 'center', fontStyle: 'bold', textColor: 'black', } },
      { content: 'Shift', styles: { halign: 'center', fontStyle: 'bold', textColor: 'black', } },
      { content: 'Process', styles: { halign: 'center', fontStyle: 'bold', textColor: 'black', } },
      { content: 'Machine', styles: { halign: 'center', fontStyle: 'bold', textColor: 'black', } },
      { content: 'Produced Qty', styles: { halign: 'center', fontStyle: 'bold', textColor: 'black', } },
      { content: 'Accepted Qty', styles: { halign: 'center', fontStyle: 'bold', textColor: 'black', } },
      { content: 'Operator', styles: { halign: 'center', fontStyle: 'bold', textColor: 'black', } },
      { content: 'QA', styles: { halign: 'center', fontStyle: 'bold', textColor: 'black', } },
      { content: 'Prod Eng', styles: { halign: 'center', fontStyle: 'bold', textColor: 'black', } },
    ]];

    // BOM header
    const bomHeader = [[
      { content: 'SITEMCODE', colSpan: 2, styles: { halign: 'center', fontSize: 9, fontStyle: 'bold', textColor: 'black' } },
      { content: 'SITEMNAME', colSpan: 2, styles: { halign: 'center', fontSize: 9, fontStyle: 'bold', textColor: 'black' } },
      { content: 'THK', colSpan: 2, styles: { halign: 'center', fontSize: 9, fontStyle: 'bold', textColor: 'black' } },
      { content: ' Qty', colSpan: 1, styles: { halign: 'center', fontSize: 9, fontStyle: 'bold', textColor: 'black' } },
      { content: 'Prd Qty', colSpan: 1, styles: { halign: 'center', fontSize: 9, fontStyle: 'bold', textColor: 'black' } },
    ]];

    // Footer sections
    const remarks = [[{ content: 'REMARKS:', colSpan: 9, styles: { halign: 'left', fontSize: 8, fontStyle: 'bold' } }]];
    const actionRemarks = [[{ content: 'ACTION FOR REMARKS :', colSpan: 9, styles: { halign: 'left', fontSize: 8, fontStyle: 'bold' } }]];
    const accepted = [[{ content: 'ACCEPTED QTY : 0', colSpan: 9, styles: { halign: 'left', fontSize: 8, fontStyle: 'bold' } }]];
    const reject = [[{ content: 'REJECT/REWORK QTY : 0', colSpan: 9, styles: { halign: 'left', fontSize: 8, fontStyle: 'bold' } }]];
    const grnNoContinue = [[{ content: `GRN No Continue: ${grnFooterDisplay}`, colSpan: 9, styles: { halign: 'left', fontSize: 8, fontStyle: 'bold' } }]];
    const fim = [[
      { content: 'FIM STORE 1', colSpan: 3, styles: { halign: 'center', fontSize: 8, fontStyle: 'bold' } },
      { content: 'RECEIVED QTY: 0', colSpan: 3, styles: { halign: 'center', fontSize: 8, fontStyle: 'bold' } },
      { content: 'CELL LEADER SIGN:', colSpan: 3, styles: { halign: 'center', fontSize: 8, fontStyle: 'bold' } },
    ]];
    // const spacer = [[{ content: ' ', colSpan: 9, styles: { cellPadding: { top: 6, bottom: 6 } } }]];

    // 1) Draw top header band (logo/title/right info) and part details box
    // Lock the 9-column widths so all header rows align perfectly
    const pageWidth = doc.internal.pageSize.getWidth();
    const margins = { top: 6, right: 10, bottom: 6, left: 10 };
    const availWidth = pageWidth - (margins.left + margins.right);
    // Allocate more width to right-side label/value columns (6,7,8)
    const nineColWidths = {
      0: { cellWidth: availWidth * 0.10 },
      1: { cellWidth: availWidth * 0.10 },
      2: { cellWidth: availWidth * 0.10 },
      3: { cellWidth: availWidth * 0.10 },
      4: { cellWidth: availWidth * 0.10 },
      5: { cellWidth: availWidth * 0.10 },
      6: { cellWidth: availWidth * 0.12, cellPadding: { left: 2, right: 2 }, halign: 'left' },
      7: { cellWidth: availWidth * 0.14, cellPadding: { left: 2, right: 2 }, halign: 'left' },
      8: { cellWidth: availWidth * 0.14, cellPadding: { left: 2, right: 2 }, halign: 'left' },
    };
    // Draw logo BEFORE any tables to avoid any chance of overlap
    (function placeLogo() {
      const marginsLocal = { top: 10, right: 10, bottom: 10, left: 10 };
      const availWLocal = pageWidth - (marginsLocal.left + marginsLocal.right);
      const leftBlockWidth = availWLocal * (0.11 * 3);
      // Shrink logo to further reduce header height
      const imgW = 34;
      const imgH = 26;
      const imgX = marginsLocal.left + (leftBlockWidth - imgW) / 2;
      const imgY = 12;
      doc.addImage(logoUrl, 'PNG', imgX, imgY, imgW, imgH);
    })();
    // const doc = new jsPDF('p', 'mm', 'a4');

    const footerText = "FORMAT NO: IMS-ME-PRODN-F-305, REV-'3' 25.06.2025";

    // Add footer on every page
    doc.autoTable({
      didDrawPage: (data) => {
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;

        doc.setFontSize(10);
        doc.setFont("times", "bold");

        doc.text(
          footerText,
          pageWidth / 2,
          pageHeight - 5,
          { align: "center" }
        );
      }
    });

    // A) Header only
    doc.autoTable({
      theme: 'grid',
      head: [],
      body: [...headerBlock],
      showHead: 'never',
      startY: margins.top,
      styles: { lineWidth: 0.3, lineColor: [0, 0, 0], textColor: [0, 0, 0], font: 'times', cellPadding: 0.6, overflow: 'linebreak', minCellHeight: 5 },
      bodyStyles: { lineWidth: 0.3, lineColor: [0, 0, 0], textColor: [0, 0, 0], fillColor: null, fontStyle: 'normal', cellPadding: 0.6 },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.3,
      tableWidth: availWidth,
      margin: margins,
      columnStyles: nineColWidths,
      // Remove inner grid lines in center band for rows 2-5 (indices 1..4) and columns 3..5
      didParseCell: (data) => {
        if (data.section === 'body') {
          const r = data.row.index; // 0-based within headerBlock
          const c = data.column.index; // 0..8
          if (r >= 0 && r <= 5 && c >= 3 && c <= 5) {
            data.cell.styles.lineWidth = 0; // no borders for internal center cells
            data.cell.styles.lineColor = [255, 255, 255];
          }
          // Trim padding/height on all header rows
          if (r >= 0 && r <= 5) {
            data.cell.styles.minCellHeight = 7.2;
            const cp = data.cell.styles.cellPadding;
            let pad;
            if (cp == null) {
              pad = { top: 0.4, bottom: 0.4, left: 1, right: 1 };
            } else if (typeof cp === 'number') {
              // Convert numeric padding to object form before mutating
              pad = { top: cp, bottom: cp, left: cp, right: cp };
              pad.top = 0.4;
              pad.bottom = 0.4;
              // keep left/right at least 1 for readability
              pad.left = Math.max(1, pad.left);
              pad.right = Math.max(1, pad.right);
            } else {
              pad = cp;
              pad.top = 0.4;
              pad.bottom = 0.4;
              if (pad.left == null) pad.left = 1;
              if (pad.right == null) pad.right = 1;
            }
            data.cell.styles.cellPadding = pad;
          }
        }
      },
      ...tableOptions,
    });

    let cursorY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 4 : margins.top;

    // B) Part details box (separate table so header rowSpans never interfere)
    doc.autoTable({
      theme: 'grid',
      head: [],
      body: [...partDetails],
      showHead: 'never',
      startY: cursorY,
      styles: { lineWidth: 0.3, lineColor: [0, 0, 0], textColor: [0, 0, 0], font: 'times', cellPadding: 2 },
      bodyStyles: { lineWidth: 0.3, lineColor: [0, 0, 0], textColor: [0, 0, 0], fillColor: null, fontStyle: 'normal', cellPadding: 2 },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.3,
      tableWidth: availWidth,
      margin: margins,
      columnStyles: nineColWidths,
    });

    cursorY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 6 : cursorY + 6;

    // 2) Draw Process grid with a bold header and normal body
    doc.autoTable({
      theme: 'grid',
      head: processHeader,
      body: info,
      startY: cursorY,
      styles: { lineWidth: 0.3, lineColor: [0, 0, 0], textColor: [0, 0, 0], font: 'times' },
      headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' },
      bodyStyles: { lineWidth: 0.3, lineColor: [0, 0, 0], textColor: [0, 0, 0], fillColor: null, fontStyle: 'normal' },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.3,
      margin: margins,
    });

    cursorY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 6 : cursorY + 6;

    // 3) BOM title row
    doc.autoTable({
      theme: 'grid',
      head: [],
      body: [[{ content: 'BOM Details for Job Card :', colSpan: 9, styles: { halign: 'left', fontSize: 12, fontStyle: 'bold' } }]],
      showHead: 'never',
      startY: cursorY,
      styles: { lineWidth: 0.3, lineColor: [0, 0, 0], textColor: [0, 0, 0], font: 'times' },
      bodyStyles: { lineWidth: 0.3, lineColor: [0, 0, 0], textColor: [0, 0, 0], fillColor: null, fontStyle: 'bold' },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.3,
      margin: margins,
    });

    cursorY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY : cursorY;

    // 4) BOM grid with header and body
    doc.autoTable({
      theme: 'grid',
      head: bomHeader,
      body: infobomDetails,
      startY: cursorY,
      styles: { lineWidth: 0.3, lineColor: [0, 0, 0], font: 'times' },
      headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' },
      bodyStyles: { lineWidth: 0.3, lineColor: [0, 0, 0], textColor: [0, 0, 0], fillColor: null, fontStyle: 'normal' },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.3,
      margin: margins,
      columnStyles: nineColWidths,
    });

    cursorY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 4 : cursorY + 4;

    // 5) Footer sections (remarks etc.)
    const footerBlocks = [
      ...remarks,
      ...actionRemarks,
      ...accepted,
      ...reject,
      ...grnNoContinue,
      ...fim,
      // ...spacer,
    ];

    // If there isn't enough space for the entire footer block, move it to a new page
    const pageHeight = doc.internal.pageSize.getHeight();
    const remainingSpace = pageHeight - margins.bottom - cursorY;
    // Rough height estimate for footer (6 rows with padding/borders)
    const estimatedFooterHeight = 50; // mm, tune if needed
    if (remainingSpace < estimatedFooterHeight) {
      doc.addPage();
      cursorY = margins.top;
    }

    doc.autoTable({
      theme: 'grid',
      head: [],
      body: footerBlocks,
      showHead: 'never',
      startY: cursorY,
      styles: { lineWidth: 0.3, lineColor: [0, 0, 0], textColor: [0, 0, 0], font: 'times' },
      bodyStyles: { lineWidth: 0.3, lineColor: [0, 0, 0], textColor: [0, 0, 0], fillColor: null, fontStyle: 'normal' },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.3,
      margin: margins,
    });

    // Optional: pad with dummy space to avoid a large gap after the footer when it starts on a new page
    const afterFooterY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY : cursorY;
    const remainingAfterFooter = pageHeight - margins.bottom - afterFooterY;
    if (remainingAfterFooter > 8 && remainingAfterFooter < 40) {
      // Add a small filler block to visually balance the page bottom
      doc.autoTable({
        theme: 'plain',
        head: [],
        body: [[{ content: ' ', colSpan: 9 }]],
        showHead: 'never',
        startY: afterFooterY + 2,
        styles: { cellPadding: { top: remainingAfterFooter - 6, bottom: 0 } },
        margin: margins,
      });
    }

    const pdfBlob = doc.output('blob');
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfBlobUrl);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
      <DialogTitle style={{ background: '#002D68', color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>Job Card Details</DialogTitle>

      <DialogContent style={{ padding: '2px' }}>
        {pdfUrl &&
          <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
        }
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default GeneratePdfDialog;
