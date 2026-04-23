import { data } from "autoprefixer";

/* eslint-disable max-len */
const _fetchServiceDownloadFile = (PATH, serviceMethod, data, successCallback, errorCallBack, fileName, reportType, contentType) => {
  const END_POINT = process.env.REACT_APP_API_URL;
  const headers = {
    'Content-Type': contentType,
    responseType: 'arraybuffer',
  };

  const body = (serviceMethod === 'GET') || (serviceMethod === 'DELETE') ? {} : { body: JSON.stringify(data) };

  const bodyParameters = {
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    headers,
    ...body,
  };

  const bodyObject = {
    method: serviceMethod,
    ...bodyParameters,
  };

  let filename = '';

  return fetch(END_POINT + PATH, bodyObject)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }

      filename = fileName || 'ReportFile';

      if (reportType === 'download') {
        return response.blob();
      } else if (reportType === 'email') {
        return response.json();
      }
    })
    .then((dataResponse) => {
      successCallback(dataResponse);
      if (reportType === 'download') {
        if (dataResponse != null) {
          const url = window.URL.createObjectURL(dataResponse);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
        }
      } else if (reportType === 'email') {
        // Handle email response
      }
    })
    .catch((error) => {
      error.errorObject.then((errorResponse) => {
        if (error.errorStatus === 401 && errorResponse.message === 'Unable to access the page, Token Expired') {
          // location.reload();
        }
        errorCallBack(error.errorStatus, errorResponse.message);
      });
    });
};

const getFileExtension = (fileType) => {
  const segments = fileType.split('.');
  if (segments.length > 1) {
    return segments.pop().toLowerCase();
  }
  return null;
};

export const BomExlTemplate = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`bom/template`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
};

export const ToolMappingExlTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`addtool/downloadToolTemplate/download`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
};
export const DownloadPDFFile = (data, successCallback, errorCallBack) => {
  const fileExtension = getFileExtension(data.fileType);
  return _fetchServiceDownloadFile(`supplier/download/${data.id}`, 'GET', {}, successCallback, errorCallBack, `Report.${fileExtension}`, 'download', `application/${fileExtension}`);
};

export const DownloadSupExcelTemplate = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`supExcel/template`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
};

export const GetSuppVsItemTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`suppVsItmExl/template`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
};

export const DownloadSuppVsItemList = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`suppVsItmExl/download/${data.id}`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
};

export const DownloadCslExlExport = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`cslExl/template`, 'GET', {}, successCallback, errorCallBack, `csl.xlsx`, 'download', `application/xlsx}`);
};


export const DocDownloadExlExport = (data, successCallback, errorCallBack) => {
  const fileExtension = getFileExtension(data.fileType);
  return _fetchServiceDownloadFile(`customer/download/${data.id}`, 'GET', {}, successCallback, errorCallBack, `Report.${fileExtension}`, 'download', `application/${fileExtension}`);
};


export const ItemDownloadExlExport = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`item/template`, 'GET', {}, successCallback, errorCallBack, `item.xlsx`, 'download', `application/xlsx`);
};

export const BulkItemDownloadExlExport = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`item/duplicateTemplate`, 'GET', {}, successCallback, errorCallBack, `item.xlsx`, 'download', `application/xlsx`);
};

export const CutomerDownloadExlExport = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`customer/template`, 'GET', {}, successCallback, errorCallBack, `item.xlsx`, 'download', `application/xlsx`);
};


export const CustomerTemplateDownloadExlExport = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`customer/template`, 'GET', {}, successCallback, errorCallBack, `item.xlsx`, 'download', `application/xlsx`);
};

// export const DownloadSuppVsItemPriceRevisionExl = (data, successCallback, errorCallBack) => _fetchService('suppVsItmExl/priceRevision/download', 'POST', data, successCallback, errorCallBack);
export const DownloadSuppVsItemPriceRevisionExl = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile('suppVsItmExl/priceRevision/download', 'GET', data, successCallback, errorCallBack, `item.xlsx`, 'download', `application/xlsx`);
};


export const DownloadItemStockTemplateExl = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile('item/stock/template', 'GET', data, successCallback, errorCallBack, `item.xlsx`, 'download', `application/xlsx`);
};

export const DownloadItemRateTemplate = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile('item/rate/template', 'GET', data, successCallback, errorCallBack, `item.xlsx`, 'download', `application/xlsx`);
};

export const GetItemVsProcessTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`itmVsPmExl/template`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
};

export const GetItemVsProcessCopyTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`itmVsPmExl/copyTemplate`, 'GET', {}, successCallback, errorCallBack, `CopyFromTemp.xlsx`, 'download', `application/xlsx}`);
};

export const GetPartProcessCopyTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`qltyExl/copyTemplate`, 'GET', {}, successCallback, errorCallBack, `CopyFromTemp.xlsx`, 'download', `application/xlsx}`);
};

export const GetItemVsProcessMachineDeselectTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`itmVsPmExl/deSelectTemp`, 'GET', {}, successCallback, errorCallBack, `ItemVsProcessMachineDeselectTemp.xlsx`, 'download', `application/xlsx}`);
};

////-Accounting---///

export const DownloadPOEntryTemplate = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`purchase/template`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
};

export const ExportPoEntry = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`purchase/exportPo/${data?.id}`, 'GET', {}, successCallback, errorCallBack, `PurchaseOrder.xlsx`, 'download', `application/xlsx}`);
};

////Customer Vs itemPrice

export const DownloadCustVsItemPriceTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`custVsItem/template`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
};

export const DownloadRateUpdateTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`custVsItem/rateTemplate`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
};

export const DownloadCustVsItemPriceCopyTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`custVsItem/copyTemplate`, 'GET', {}, successCallback, errorCallBack, `CopyFromTemp.xlsx`, 'download', `application/xlsx}`);
};

//Gst Invoice

export const ExportGstInvoice = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`gstInvoice/exportGstInvice/${data?.id}`, 'GET', {}, successCallback, errorCallBack, `Gst.xlsx`, 'download', `application/xlsx}`);
};

export const ExportPerformInvoice = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`perfomaInv/exportInv/${data?.id}`, 'GET', {}, successCallback, errorCallBack, `Proforma Invoice.xlsx`, 'download', `application/xlsx}`);
};
//customer DC
export const DownloadCustomerDcTemplate = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`customerdc/template`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
};

export const ExportCustomerDC = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`customerdc/export/${data?.id}`, 'GET', {}, successCallback, errorCallBack, `CustomerDc.xlsx`, 'download', `application/xlsx}`);
};

export const DownloadGSTExcelTemplate = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`gstInvoice/template`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
};

//Non ReturnableDc

export const DownloadNRDCTemplate = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`noCustomerdc/downloadTemplate`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
};

export const ExportNrdc = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`noCustomerdc/exportndc/${data?.id}`, 'GET', {}, successCallback, errorCallBack, `NRDC.xlsx`, 'download', `application/xlsx}`);
};


// export const GetSuppVsItemTemplate = (successCallback, errorCallBack) => _fetchService('suppVsItem/template', 'GET', {}, successCallback, errorCallBack)
export const DownloadSobExlTemplate = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`sobExl/template`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', ``);
};

export const DownloadSobExlTemplateProduct = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`sobExl/export?sobMstId=${data?.id}`, 'GET', {}, successCallback, errorCallBack, `SOBConsolidated.xlsx`, 'download', ``);
};

export const DownloadItemDuplicateTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`item/duplicateTemplate`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', ``);
};
///Shipment Planning////
export const DownloadShipMentPlanningXLData = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`planning/assemblyFim?shipmentDate=${data.shipmentDate}&fim=${data?.fim}&type=download`, 'GET', {}, successCallback, errorCallBack, `AssemblyPlanningReport.xlsx`, 'download', ``);
};


//ASSEMBLY PLANNINNG XL DOWNLOAD
export const DownloadAssemblyPlanningXLData = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`planning/assemblyExport?kanbanDate=${data.kanbanDate}&fim=${data?.fim}`, 'GET', {}, successCallback, errorCallBack, `AssemblyPlanningReport.xlsx`, 'download', ``);
};

export const DownloadNpdExlTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`npdExl/template`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', ``);
};


export const DownloadskillMatrixExlTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`skillmatrics/downloadtemp`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', ``);
};


export const SobExlMissingCsl = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`sobExl/missingCsl?q=${data?.id}&sobMstId=${data?.sobMstId}`, 'GET', {}, successCallback, errorCallBack, `Missing_CSL.xlsx`, 'download', ``);
};

export const ScrapReportCSV = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`scrapExl/repoDownload?from=${data?.fromDate}&to=${data?.todate}&machineId=${data?.machineId}&category=${data?.category}&material=${data?.material}&thickness=${data?.thickness}`, 'GET', {}, successCallback, errorCallBack, `ScrapReportCSV.xlsx`, 'download', ``);
};

export const PaintSludgeCSV = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`scrapExl/repo/paintSludge?from=${data?.fromDate}&to=${data?.todate}&machineId=${data?.machineId}`, 'GET', {}, successCallback, errorCallBack, `PaintSludgeReportCSV.xlsx`, 'download', ``);
};

export const SaleOrderTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`sale/order/template`, 'GET', {}, successCallback, errorCallBack, `SaleOrderTemplate.xlsx`, 'download', ``);
};

export const AssemblySaleOrderTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`sale/order/template?isAssembly=1`, 'GET', {}, successCallback, errorCallBack, `SaleOrderTemplate.xlsx`, 'download', ``);
};

export const PartProcessInspectionTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`qltyExl/template`, 'GET', {}, successCallback, errorCallBack, `PartProcessInspectionTemplate.xlsx`, 'download', ``);
};

export const JobCardExport = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`jobCard/export?fromDate=${data?.fromDate}&toDate=${data?.toDate}&itemCode=${data?.itemCode}`, 'GET', {}, successCallback, errorCallBack, `JobCard_Report.xlsx`, 'download', ``);
};

export const MrpExportMrpMstId = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`mrp/export?mrpMstId=${data?.mrpMstId}`, 'GET', {}, successCallback, errorCallBack, `Mrp_Report.xlsx`, 'download', ``);
};

export const DispatchExlConractTemp = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`dispatchExl/conractTemp`, 'GET', {}, successCallback, errorCallBack, `Conract_Temp.xlsx`, 'download', ``);
};

export const DispatchExlPartTemp = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`dispatchExl/partTemp`, 'GET', {}, successCallback, errorCallBack, `Part_Temp.xlsx`, 'download', ``);
};

export const NpdDocDownload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`processInspec/download/${data?.id}`, 'GET', {}, successCallback, errorCallBack, `NpdDocDownload.${data?.fileExtension}`, 'download', ``);
};

export const NpdDocDownload2 = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`npd/docDownload/${data?.id}`, 'GET', {}, successCallback, errorCallBack, `NpdDocDownload.${data?.fileExtension}`, 'download', ``);
};


//PO TEMPLATE
export const PurchaseOrderTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`poGenerate/poTemplate`, 'GET', {}, successCallback, errorCallBack, `PruchaseOrderTemplate.xlsx`, 'download', `application/xlsx}`);
};

//PO BILL AGAINST TEMPLATE
export const PurchaseBillAgaintsPOTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`poGenerate/poTemplate`, 'GET', {}, successCallback, errorCallBack, `PruchaseBillTemplate.xlsx`, 'download', `application/xlsx}`);
};

//PO BILL WITHOUT PO TEMPLATE
export const PurchaseBillWithoutPOTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`poGenerate/poTemplate`, 'GET', {}, successCallback, errorCallBack, `PruchaseBillWithoutPOTemplate.xlsx`, 'download', `application/xlsx}`);
};

export const ItemExportDownload = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`item/export`, 'GET', {}, successCallback, errorCallBack, `Item_Export.xlsx`, 'download', `application/xlsx}`);
};

// Checklist Master
export const ExportChecklistMaster = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`checklist/master/${data?.id}/export`, 'GET', {}, successCallback, errorCallBack, `ChecklistMaster.xlsx`, 'download', `application/xlsx`);
};

// MATERIAL ISSUE EXPORT
export const MaterialIssueReportDownload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`materialIssue/export?mrpMstId=${data?.id}`, 'GET', {}, successCallback, errorCallBack, `Material_Issue.xlsx`, 'download', `application/xlsx}`);
};

export const InfoScrapExport = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`info/scrapExport?id=${data?.id}&from=${data?.from}&to=${data?.to}`, 'GET', {}, successCallback, errorCallBack, `Info_scrapExport.xlsx`, 'download', `application/xlsx}`);
}
// VENDOR DEL NOTE RECEIVE TEMPLATE

export const ReceivedTemplateDownload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`delSchedule/template?delscheduleId=${data?.id}`, 'GET', {}, successCallback, errorCallBack, `ReceivedTemplate.xlsx`, 'download', `application/xlsx}`);
};

export const InfoSheetExport = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`info/sheetExport?id=${data?.id}&from=${data?.from}&to=${data?.to}`, 'GET', {}, successCallback, errorCallBack, `Info_sheetExport.xlsx`, 'download', `application/xlsx}`);
};

export const BomExportDOWNLOAD = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`bom/export`, 'GET', {}, successCallback, errorCallBack, `Bom_Export.xlsx`, 'download', `download`);
};

export const CslExlExport = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`cslExl/export?fromDate=${data?.formDate}&toDate=${data?.toDate}`, 'GET', {}, successCallback, errorCallBack, `CSL_Import_Summaryxlsx`, 'download', `download`);
};

// /////---Accuount----////

// export const ExportPoEntryReport = (data, successCallback, errorCallBack) => {
//   return _fetchServiceDownloadCsvData(`getSemWiseExport/${data.monthFrom}/${data.monthTo}?location=${data.location}&branch=${data.branch}&specialization=${data.specialization}&semester=${data.semester}&section=${data.section}&subject=${data.subject}`, 'GET', {}, successCallback, errorCallBack, '', 'download');
// };
export const CslExlExportcslMstId = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`cslExl/export?cslMstId=${data?.cslMstId}`, 'GET', {}, successCallback, errorCallBack, `CSL_Import_Summaryxlsx`, 'download', `download`);
};

export const BomMainPartsDwonload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`bom/mainParts?itemId=${data?.itemId}&type=${data?.type}`, 'GET', {}, successCallback, errorCallBack, `bom_MainParts_Summaryxlsx`, 'download', `download`);
};
export const PartMachineListDownload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`itmVsPmExl/export/${data?.id}`, 'GET', {}, successCallback, errorCallBack, `Machine_Lists.xlsx`, 'download', `application/xlsx}`);
};

export const MrpDownloadorder = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`mrp/download?orderPlnId=${data.id}`, 'GET', {}, successCallback, errorCallBack, `mrp.xlsx`, 'download', `application/xlsx}`);
}

export const MrpPlanningDownloadorder = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`mrp/machinePlanReport?mrpMstId=${data.id}`, 'GET', {}, successCallback, errorCallBack, `mrp.xlsx`, 'download', `application/xlsx}`);
}


export const NpdExlReportDownload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`npdExl/report?itm&type=${data.type}`, 'GET', {}, successCallback, errorCallBack, `.xlsx`, 'download', `application/xlsx}`);
}

///Quality Template

export const QualityReport = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`qltyExl/export?id=${data?.id}`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
}


///Quality Assembly Template

export const QualityAssemblyReportXl = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`qltyExl/assemblyExport/${data?.id}`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
}

// CHECKLIST TEMPLATE DOWNLOAD
export const ChecklistTemplateDownload = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`checkExl/template`, 'GET', {}, successCallback, errorCallBack, `Checklist_Template.xlsx`, 'download', `application/xlsx}`);
}

// CHECKLIST REPORT DOWNLOAD
export const ChecklistReportDownload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`checkexlreport/export?checkname=${data.name}&frequency=${data.frequency}&fromdate=${data.fromdate}&todate=${data.todate}`, 'GET', {}, successCallback, errorCallBack, `Checklist_Report.xlsx`, 'download', `application/xlsx}`);
}

///Quality Template
export const OpenBalanceTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`storeRepo/stockTemplate`, 'GET', {}, successCallback, errorCallBack, `Open_Balance.xlsx`, 'download', `application/xlsx}`);
}

///Quality Template
export const JobCardXlDownload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`jobCard/export?type=${data.type}&fromDate=${data.selectedDate}&toDate=${data.selectedToDate}&shift=${data.selectedShift}&part=${data.selectedItem}&thickness=${data.thickness}&mrpMstId=${data.mrpMstId}`, 'GET', {}, successCallback, errorCallBack, `JobCardReport.xlsx`, 'download', `application/xlsx}`);
}

// PRODUCTION REPORT DOWNLOAD
export const ProductionReportDownload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`prodReport/export?fromDate=${data.from}&toDate=${data.to}&type=${data.type}`, 'GET', {}, successCallback, errorCallBack, `Production_Report.xlsx`, 'download', `application/xlsx}`);
}

// SCRAP ANALYSIS REPORT DOWNLOAD
export const ScrapAnalysisReportDownload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`scrapExl/repo/analysis?from=${data.from}&to=${data.to}&machineId=${data.machineId}&material=${data.material}`, 'GET', {}, successCallback, errorCallBack, `Production_Report.xlsx`, 'download', `application/xlsx}`);
}

// Sales Register REPORT DOWNLOAD
export const SalesRegisterReportDownload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`accountRepo/exportSaleRegister?from=${data.from}&to=${data.to}&customer=${data.customer}`, 'GET', {}, successCallback, errorCallBack, `Sales Register_Report.xlsx`, 'download', `application/xlsx}`);
}
// SSO-Cust PO Report DOWNLOAD
export const SSOCustPoReportDownload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`accountRepo/exportSoCustpo?from=${data.from}&to=${data.to}&customer=${data.customer}&item=${data.item}&tye=${data.tye}`, 'GET', {}, successCallback, errorCallBack, `SSO-Cust PO Report.xlsx`, 'download', `application/xlsx}`);
}
// Invoice Cust DC Report DOWNLOAD
export const InvoiceCustDCReportDownload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`accountRepo/exportInvCustDc?from=${data.from}&to=${data.to}&customer=${data.customer}`, 'GET', {}, successCallback, errorCallBack, `Sales Register_Report.xlsx`, 'download', `application/xlsx}`);
}
export const CustomerDCReportDownload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`accountRepo/exportCustomerDc?from=${data.from}&to=${data.to}&customer=${data.customer}`, 'GET', {}, successCallback, errorCallBack, `Customer DC_Report.xlsx`, 'download', `application/xlsx}`);
}

export const QualityFpiReportXl = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`qltyExl/itemsExport/${data?.id}`, 'GET', {}, successCallback, errorCallBack, `Report.xlsx`, 'download', `application/xlsx}`);
}

// GET OPENING BALANCE XL
export const OpeningBalanceReportDownload = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`storeRepo/download/stockBalance?from=${data.from}&to=${data.to}&itmGrpId=${data.itmGrpId}&items=${data.items}&locId=${data.locId}&showVal=${data.showVal}&notDisplay=${data.notDisplay}`, 'GET', {}, successCallback, errorCallBack, `StockBalance_sheetExport.xlsx`, 'download', `application/xlsx}`);
};

//SRN TEMPLATE DOWNLOAD
export const StoreRequestNoteTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`srn/template`, 'GET', {}, successCallback, errorCallBack, `SRN_Template.xlsx`, 'download', `application/xlsx}`);
};

//ALL MASTERS DOWNLOAD
export const AllMastersTemplate = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`master/template?master=${data.masterName}`, 'GET', {}, successCallback, errorCallBack, `MasetrTemplate.xlsx`, 'download', `application/xlsx}`);
};

//ALL MASTERS DOWNLOAD
export const AllMastersExport = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`master/export?master=${data.master}`, 'GET', {}, successCallback, errorCallBack, `Masetr.xlsx`, 'download', `application/xlsx}`);
};

//ALL BOM DOWNLOAD
export const DownloadAllBomXl = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`bom/export?itemId=${data.id}`, 'GET', {}, successCallback, errorCallBack, `BOM.xlsx`, 'download', `application/xlsx}`);
};

///SO Price /////
export const DownloadSOPricePriceTemplate = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`custVsItem/template`, 'GET', {}, successCallback, errorCallBack, `Price verification.xlsx`, 'download', `application/xlsx}`);
};

///Quality Template
export const DownloadGstSaleInvoiceTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`gstInvoice/gstTemplate`, 'GET', {}, successCallback, errorCallBack, `GST Sale Invoice.xlsx`, 'download', `application/xlsx}`);
}

export const DownloadPerformInvoiceTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`perfomaInv/template`, 'GET', {}, successCallback, errorCallBack, `Proforma Invoice.xlsx`, 'download', `application/xlsx}`);
}

// PRICE CHANGE NOTE TEMPLATE
export const DownloadPriceChangeNoteTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`pcn/template`, 'GET', {}, successCallback, errorCallBack, `Price Change Note.xlsx`, 'download', `application/xlsx}`);
}

// Qualitty Setting Template/////
export const DownloadQualityDownloadTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`qcRule/template`, 'GET', {}, successCallback, errorCallBack, `Price Change Note.xlsx`, 'download', `application/xlsx}`);
}

export const DownloadQualityReport = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`qcRule/report`, 'GET', {}, successCallback, errorCallBack, 'Application Version Report.xlsx', 'download');
};

export const DownloadMapInspectionReport = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`mapInfect/report`, 'GET', {}, successCallback, errorCallBack, 'Application Version Report.xlsx', 'download');
};

export const DownloadMapInspectionTemplate = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`mapInfect/template`, 'GET', {}, successCallback, errorCallBack, `Price Change Note.xlsx`, 'download', `MapInspection/xlsx}`);
}

export const DownloadAddToolExlTemplate = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`addtool/toolexceldownload`, 'GET', {}, successCallback, errorCallBack, `Tool.xlsx`, 'download', ``);
};

export const partvstoolvsExlTemplate = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`partvstoolvsprocess/gettemplate`, 'GET', {}, successCallback, errorCallBack, `partvstoolvs.xlsx`, 'download', ``);
};

export const PurchaseBillAgaintsPOTemplateNew = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`poBill/template`, 'GET', {}, successCallback, errorCallBack, `PruchaseBillTemplate.xlsx`, 'download', `application/xlsx}`);
};


export const DownloadSOPricePriceNewTemplate = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`so-verification/template`, 'GET', {}, successCallback, errorCallBack, `Price verification.xlsx`, 'download', `application/xlsx}`);
};

//ALL tOOLmAPPING DOWNLOAD
export const DownloadAllTollMappingExel = (data, successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`addtool/toolDetailsExport/export?itemId=${data.id}`, 'GET', {}, successCallback, errorCallBack, `ToolMapping.xlsx`, 'download', `application/xlsx}`);
};

export const mrnTemplateDOWNLOAD = (successCallback, errorCallBack) => {
  return _fetchServiceDownloadFile(`mrn/download/excel`, 'GET', {}, successCallback, errorCallBack, `MaterialReturnNoteTemplate.xlsx`, 'download', `application/xlsx}`);
};


export const SalesInvoiceItemWise = (data, successCallback, errorCallBack) => {
  let queryParams = `from=${data.from}&to=${data.to}`;
  if (data.customer && data.customer.length > 0) {
    data.customer.forEach((id) => {
      queryParams += `&customer[]=${id}`;
    });
  }
  if (data.item && data.item.length > 0) {
    data.item.forEach((id) => {
      queryParams += `&item[]=${id}`;
    });
  }
  return _fetchServiceDownloadFile(`accountRepo/saleInvoice/export?${queryParams}`, 'GET', {}, successCallback, errorCallBack, `Sales Invoice Item Wise.xlsx`, 'download', `application/xlsx`);
};
