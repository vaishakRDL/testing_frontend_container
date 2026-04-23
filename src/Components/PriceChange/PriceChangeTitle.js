// // import React, { useState } from 'react';
// // import { Box, Button, Grid, Typography } from '@mui/material';
// // import Stack from '@mui/material/Stack';
// // import Fab from '@mui/material/Fab';
// // import AddIcon from '@mui/icons-material/Add';
// // import ExcelTemplateDownloader from '../../ApiService/ExcelTemplateDownloader';

// // const PriceChangeTitle = (props) => {
// //     return (
// //         <Box
// //             sx={{
// //                 mb: '10px',
// //                 alignItems: 'center',
// //                 display: 'flex',
// //                 justifyContent: 'space-between',
// //                 flexWrap: 'wrap',
// //                 marginLeft: '10px',
// //                 marginRight: '10px'
// //             }}
// //         >
// //             <Typography
// //                 sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
// //                 variant="h5"
// //             >
// //                 Price Change Note
// //             </Typography>
// //             <Box
// //                 sx={{ m: 1 }}
// //             >   

// //             </Box>
// //             <Grid style={{ display: 'flex' }}>
// //                 <Stack
// //                     style={{ marginRight: '10px' }}
// //                     direction="row"
// //                     spacing={2}

// //                 >
// //                     <Fab
// //                         style={{ width: '100%', background: '#002D68', color: 'white' }}
// //                         // disabled={userPermission[0]?.addData === 0}
// //                         onClick={() => {
// //                             props.setIsAddButton(true);
// //                             props.setEditData([]);
// //                             props.setOpen(true);
// //                         }}
// //                         variant="extended" size="medium" color="primary" aria-label="add">
// //                         <AddIcon sx={{ mr: 1 }} />
// //                         Price Change
// //                     </Fab>
// //                 </Stack>

// //             </Grid> 
// //         </Box>
// //     )
// // }

// // export default PriceChangeTitle

// import React from 'react';
// import { Box, Grid, Typography, Stack, Fab } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import FileDownloadIcon from '@mui/icons-material/FileDownload';
// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';

// const PriceChangeTitle = (props) => {
//   // 🔹 Convert array of objects to Excel worksheet with styling
//   const arrayToWorksheet = (array) => {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Price Change Note');

//     if (array.length === 0) return workbook;

//     // 🔸 Dynamically set headers from keys
//     const columns = Object.keys(array[0]).map((key) => ({
//       header: key.toUpperCase(),
//       key: key,
//       width: 20,
//     }));

//     worksheet.columns = columns;

//     // 🔸 Add data rows
//     array.forEach((row) => worksheet.addRow(row));

//     // 🔸 Style header row (bold + center)
//     worksheet.getRow(1).eachCell((cell) => {
//       cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
//       cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: 'FF002D68' }, // blue header
//       };
//       cell.alignment = { horizontal: 'center', vertical: 'middle' };
//       cell.border = {
//         top: { style: 'thin' },
//         left: { style: 'thin' },
//         bottom: { style: 'thin' },
//         right: { style: 'thin' },
//       };
//     });

//     // 🔸 Center align all body cells
//     worksheet.eachRow((row, rowNumber) => {
//       if (rowNumber > 1) {
//         row.eachCell((cell) => {
//           cell.alignment = { horizontal: 'center', vertical: 'middle' };
//         });
//       }
//     });

//     return workbook;
//   };

//   // 🔹 Download workbook as Excel file
//   const downloadExcelFile = async (workbook, filename) => {
//     const buffer = await workbook.xlsx.writeBuffer();
//     saveAs(new Blob([buffer]), filename);
//   };

//   // 🔹 Handle Excel download for Price Change Note
//   const handleExcelDownload = () => {
//     const { dataListDetail = [] } = props;

//     if (dataListDetail.length === 0) {
//       alert('No data to export!');
//       return;
//     }

//     // 🧾 Format data to match visible table structure (flat key-value)
//     const formattedData = dataListDetail.map((item) => ({
//       'Part No': item?.partNo,
//       'Part Description': item?.partDescription,
//       'HSN Code': item?.hsnCode,
//       'Quantity': item?.quantity,
//       'UOM': item?.uom,
//       'Old Rate': item?.oldRate,
//       'New Rate': item?.newRate,
//       'Difference': item?.difference,
//       'Effective Date': item?.effectiveDate,
//       'Supplier Name': item?.supplierName,
//     }));

//     const workbook = arrayToWorksheet(formattedData);
//     downloadExcelFile(workbook, `PriceChangeNote_${new Date().toLocaleDateString()}.xlsx`);
//   };

//   return (
//     <Box
//       sx={{
//         mb: '10px',
//         alignItems: 'center',
//         display: 'flex',
//         justifyContent: 'space-between',
//         flexWrap: 'wrap',
//         marginLeft: '10px',
//         marginRight: '10px',
//       }}
//     >
//       <Typography
//         sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
//         variant="h5"
//       >
//         Price Change Note
//       </Typography>

//       <Grid style={{ display: 'flex' }}>
//         <Stack direction="row" spacing={2}>
//           <Fab
//             style={{ background: '#002D68', color: 'white' }}
//             onClick={() => {
//               props.setIsAddButton(true);
//               props.setEditData([]);
//               props.setOpen(true);
//             }}
//             variant="extended"
//             size="medium"
//             color="primary"
//             aria-label="add"
//           >
//             <AddIcon sx={{ mr: 1 }} />
//             Price Change
//           </Fab>

//           <Fab
//             style={{ background: '#388E3C', color: 'white' }}
//             onClick={handleExcelDownload}
//             variant="extended"
//             size="medium"
//             color="primary"
//             aria-label="download"
//           >
//             <FileDownloadIcon sx={{ mr: 1 }} />
//             Download Excel
//           </Fab>
//         </Stack>
//       </Grid>
//     </Box>
//   );
// };

// export default PriceChangeTitle;

import React from 'react';
import { Box, Grid, Typography, Stack, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useModuleLocks } from '../context/ModuleLockContext';

const PriceChangeTitle = (props) => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Price Change Note")?.lockStatus === "locked";

  // ✅ Auto-generate Excel worksheet from columns & data
  const arrayToWorksheet = (columns, data) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Price Change Note');

    // 🔸 Map columns to Excel headers and keys
    const excelColumns = columns.map(col => ({
      header: (typeof col.headerName === 'string' ? col.headerName : col.headerName?.props?.children) || col.field,
      key: col.field,
      width: 20
    }));

    worksheet.columns = excelColumns;

    // 🔸 Sanitize cell values (avoid circular structures)
    const sanitizeValue = (val) => {
      if (val === null || val === undefined) return '';
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        return val;
      }
      try {
        return JSON.stringify(val);
      } catch {
        return '[Object]';
      }
    };

    // 🔸 Add rows using fields in column order
    data.forEach(row => {
      const rowData = {};
      excelColumns.forEach(col => {
        rowData[col.key] = sanitizeValue(row[col.key]);
      });
      worksheet.addRow(rowData);
    });

    // 🔸 Style header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: '000000' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '93bce6' },
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // 🔸 Style body rows (center align)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }
    });

    // 🔸 Auto-fit column widths
    worksheet.columns.forEach((col) => {
      let maxLength = col.header.length;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const cellLength = cell.value ? cell.value.toString().length : 10;
        if (cellLength > maxLength) maxLength = cellLength;
      });
      col.width = maxLength < 15 ? 15 : maxLength;
    });

    return workbook;
  };

  // ✅ Trigger Excel file download
  const downloadExcelFile = async (workbook, filename) => {
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), filename);
  };

  // 📥 Handle download button click
  const handleExcelDownload = () => {
    const { columns = [], dataListDetail = [] } = props;

    if (!dataListDetail.length) {
      alert('No data to export!');
      return;
    }

    const workbook = arrayToWorksheet(columns, dataListDetail);
    const fileName = `PriceChangeNote_${new Date().toLocaleDateString()}.xlsx`;
    downloadExcelFile(workbook, fileName);
  };

  return (
    <Box
      sx={{
        mb: '10px',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginLeft: '10px',
        marginRight: '10px',
      }}
    >
      <Typography
        sx={{ m: 1, fontFamily: 'Roboto Slab', fontWeight: 'bold' }}
        variant="h5"
      >
        Price Change Note
      </Typography>

      <Grid style={{ display: 'flex' }}>
        <Stack direction="row" spacing={2}>
          <Fab
            style={{ background: '#002D68', color: 'white' }}
            onClick={handleExcelDownload}
            variant="extended"
            size="medium"
            color="primary"
            aria-label="download"
          >
            <FileDownloadIcon sx={{ mr: 1 }} />
            Download Excel
          </Fab>
          <Fab
            style={{ background: isModuleLocked ? "gray" : "#002D68", color: 'white' }}
            onClick={() => {
              props.setIsAddButton(true);
              props.setEditData([]);
              props.setOpen(true);
            }}
            disabled={isModuleLocked}
            variant="extended"
            size="medium"
            color="primary"
            aria-label="add"
          >
            <AddIcon sx={{ mr: 1 }} />
            Price Change
          </Fab>


        </Stack>
      </Grid>
    </Box>
  );
};

export default PriceChangeTitle;


