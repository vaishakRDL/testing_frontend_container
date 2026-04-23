import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExcelTemplateDownloader = () => {
  const downloadExcelTemplate = () => {
    // Sample data for the Excel template (replace with your actual data)
    const excelTemplateData = [
      ['Name', 'Email', 'Phone'],
      ['John Doe', 'john@example.com', '123-456-7890'],
      ['Jane Smith', 'jane@example.com', '987-654-3210'],
    ];

    // Create a workbook and add a worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelTemplateData);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Create a Blob from the workbook using XLSX.write.xlsx.write
    const blob = XLSX.write.xlsx.write(wb, { bookType: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Trigger the download using FileSaver
    saveAs(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'excel_template.xlsx');
  };

  return (
    <div>
      <button onClick={downloadExcelTemplate}>Download Excel Template</button>
    </div>
  );
};

export default ExcelTemplateDownloader;
