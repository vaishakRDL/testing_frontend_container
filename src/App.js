import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Sidebar from './Components/SidebarComp/Sidebar';
import Navbar from './Components/NavbarComp/Navbar';
import HomePage from './Components/HomePageComp/HomePage';
import {
  HashRouter as Router, Routes, Route, Outlet, Navigate, useNavigate, useLocation
} from 'react-router-dom';
import MotorComponents from './Components/MotorCompo/MotorComponents';
import Master from './Components/MasterComp/Master';
import CustomerResult from './Components/CustomerComp/CustomerResult';
import UserAddResult from './Components/UserAddComp/UserAddResult';
import PartMasterResult from './Components/PartMasterComp/PartMasterResult';
import SupplierResult from './Components/SupplierCom/SupplierResult';
import CustomerGroupResult from './Components/CustomerComp/CustomerGropComp/CustomerGroupResult';
import ProjectNameResult from './Components/ProjectNameComp/ProjectNameResult';
import CustomerHeaderResult from './Components/CustomerComp/CustomerHeader/CustomerHeaderResult';
import SupplaceResult from './Components/SupplaceComp/SupplaceResult';
import PartHeaderResult from './Components/PartMasterComp/PartHeaderMaster/PartHeaderResult';
import PlaceOfSupplyResult from './Components/CustomerComp/PlaceOfSupply/PlaceOfSupplyResult';
import CurrencyMasterResult from './Components/CurrencyMaster/CurrencyMasterResult';
import BomModule from './Components/BOMcompo/BomModule';
import AddMasterResult from './Components/AddMasterComp/AddMasterResult';

import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { Provider } from 'react-redux';
import Reducer from './Store/Reducer';
import ItemVsProcess from './Components/ItemVsProcess/ItemVsProcessResult';
import SalesResult from './Components/SalesComp/SalesResult';
import AddMachineResult from './Components/AddMachine/AddMachineResult';
import SupplerResult from './Components/SupplerMaster/SupplerResult';
//KEERTHI CHANGES
import AssignRightsModal from './Components/UserAddComp/AssignRightsModal';
import StoresItemMasterResult from './Components/StoresItemsMaster/StoresItemMasterResult';
import SupplierVsItemMasterResult from './Components/SupplierVsItemMaster/SupplierVsItemMasterResult';
import ShiftMasterResult from './Components/ShiftMaster/ShiftMasterResult';
import Footer from './Components/Footer/Footer';
import MachineOperatorResult from './Components/MachineOperator/MachineOperatorResult';
import ProcessVsUOMResult from './Components/ProcessVsUOM/ProcessVsUOMResult';
import PurchaseOrderGenerationModule from './Components/PurchaseOrderGeneration/PurchaseOrderGenerationModule';
import AuthoriseDocumentsModule from './Components/PurchaseOrderAuthorization/AuthoriseDocuments/AuthoriseDocumentsModule';
import SecondLevelAuthorizationModule from './Components/PurchaseOrderAuthorization/SecondLevelAuthorization/SecondLevelAuthorizationModule';
import PurchaseBillAgainstPOModule from './Components/PurchaseBillAgainstPO/PurchaseBillAgainstPOModule';
import MaterialIssueNote from './Components/MaterialRequestAndIssueProcess/MaterialIssueNote/MaterialIssueNote';
import StoresRequestNote from './Components/MaterialRequestAndIssueProcess/StoresRequestNote/StoresRequestNote';
import MinMaxStatusReport from './Components/ShortageTrackingForSRNAndMin/MinMaxStatusReport/MinMaxStatusReport';
import SRNShortageReport from './Components/ShortageTrackingForSRNAndMin/SRNShortageReport/SRNShortageReport';
import ItemVsProcessView from './Components/ItemVsProcess/ItemVsProcessView';
import FIMMasterResult from './Components/FIMMasterComp/FIMMasterResult';
import CSLimportResult from './Components/CSLimportComp/CSLimportResult';
import SOBimportResult from './Components/SOBimportComp copy/SOBimportResult';
import MinMaxConsumptionReport from './Components/Reports/MinMaxConsumptionReport/MinMaxConsumptionReport';
import PriceRevisionHistoryReport from './Components/Reports/PriceRevisionHistoryReport/PriceRevisionHistoryReport';
import NewSFGEntryModule from './Components/SemiFinishedGoodsProcess/NewSFGEntry/NewSFGEntryModule';
import ViewSFGEntryModule from './Components/SemiFinishedGoodsProcess/ViewSFGEntry/ViewSFGEntryModule';
import ApplicationStore from './Utility/localStorageUtil';
import LoginPage from './Components/Login/Login';
import MasterDashboard from './Components/DashboardComps/MasterDashboard';
import PurchaseOrderView from './Components/PurchaseOrderView/PurchaseOrderView';
import QualityResult from './Components/Quality/QualityResult';
import QualityTemplateResult from './Components/QualityTemplate/QualityTemplateResult';
import PartProcessVsInspectionResult from './Components/PartProcessVsInspection/PartProcessVsInspectionResult';
import ProcessInspectionResult from './Components/ProcessInspection/ProcessInspectionResult';
import InProcessIn from './Components/InProcessIn/InProcessIn';
import InProcessFPIResult from './Components/InProcessFPI/InProcessFPIResult';
import InProcessLPIResult from './Components/InProcessLPI/InProcessLPIResult';
import InProcessReworkResult from './Components/InProcessRework/InProcessReworkResult';
import FPIReport from './Components/ProcessReport/FPIReport';
import ObservationReport from './Components/ObservationReport/ObservationReport';
import LPIReport from './Components/LPIReport/LPIReport';
import ReworkReport from './Components/ReworkReport/ReworkReport';
import FPIReportTitle from './Components/ProcessReport/FPIReportTitle';
import LPIModifiedReport from './Components/LPIModifiedReport/LPIModifiedReport';
import FPIModifiedReport from './Components/FPIModifiedReport/FPIModifiedReport';
import ObservationModifiedReport from './Components/ObservationModifiedReport/ObservationModifiedReport';
import ReworkModifiedReport from './Components/ReworkModifiedReport/ReworkModifiedReport';
import SFGEntryResult from './Components/SemiFinishedGoodsProcess/NewSFGEntryModule/SFGEntryResult';
import AccMasterList from './Components/Accounting/AccountMaster/AccMasterList';
import AccDispatchList from './Components/Accounting/AccountMaster/AccDispatchList';
import MaterialIssueResult from './Components/MaterialIssueComp/MaterialIssueResult';
import MaterialAllocationResult from './Components/MaterialAllocationComp/MaterialAllocationResult';
import AllocationComp from './Components/MaterialAllocationComp/AllocationComponent/AllocationComp';
import IssueComp from './Components/MaterialIssueComp/IssueComponent/IssueComp';
import EinvoicingList from './Components/Accounting/EInvoicing/EinvoicingList';
import QualityMstList from './Components/QualityMaster/QualityMstList';
import QualityTitle from './Components/Quality/QualityTitle';
import OrderPlaningResult from './Components/OrderPlaningComp/OrderPlaningResult';
import OrderTypeMasterResult from './Components/OrderTypeMasterComp/OrderTypeMasterResult';
import PurchaseOrderApprovalModule from './Components/AdminApproval/PurchaseOrderApproval/PurchaseOrderApprovalModule';
import PriceRevisionApproval from './Components/AdminApproval/PriceRevisionApproval/PriceRevisionApproval';
import RejectionAndRework from './Components/RejectionAndRework/RejectionAndRework';
import DeptMasterList from './Components/DigiChecklist/DeptMstCheck/DeptMasterList';
import SectionList from './Components/DigiChecklist/Section/SectionList';
import ReportLabelList from './Components/DigiChecklist/ReportLabel/ReportLabelList';
import CheckTitleList from './Components/DigiChecklist/CheckTitle/CheckTitleList';
import CheckListList from './Components/DigiChecklist/CheckList/CheckListList';
import SfgViewResult from './Components/SfgView/SfgViewResult';
import SfgVarificationResult from './Components/SfgVarification/SfgVarificationResult';
import NewSfgVarificationResult from './Components/NewSfgVarification/NewSfgVarificationResult';
import SfgVendorProcessResult from './Components/SfgVendorProcess/SfgVendorProcessResult';
import ViewSfgVendorProcessResult from './Components/ViewSfgVendorProcess/ViewSfgVendorProcessResult';
import RMBOIIndentReportResult from './Components/RMBOIIndentReport/RMBOIIndentReportResult';
// import GroupMasterResult from './Components/GroupMaster/GroupMasterResult';
import MenuRightsResult from './Components/MenuRights/MenuRightsResult';
import GroupMasterResult from './Components/GroupMaster/GroupMasterResult';
import ToolResult from './Components/Tool/ToolResult';
import ProcessVsToolResult from './Components/PartNoVsProcessVsTool/ProcessVsToolResult';
import ToolMonitoringResult from './Components/ToolMonitoring/ToolMonitoringResult';
import ToolGrindingResult from './Components/ToolGrinding/ToolGrindingResult';
import ToolUsageReport from './Components/ToolManagementReports/ToolReport';
import DispatchResult from './Components/Dispatch/DispatchResult';
import CDispatchOrderResult from './Components/DispatchOrder/CDispatchOrderResult';
import VendorDispatchOrderResult from './Components/VendorDispatchOrder/VendorDispatchOrderResult';
import DeliveryOrderStatusResult from './Components/DeliveryOrderStatus/DeliveryOrderStatusResult';
import CreateDeliveryOrderResult from './Components/CreateDeliveryOrder/CreateDeliveryOrderResult';
import HolidayMasterResult from './Components/HolidayMaster/HolidayMasterResult';
import NpdResult from './Components/NpdComp/NpdResult';
import DeletLog from './Components/NpdComp/DeletLog';
import PlanReportResult from './Components/PlanReport/PlanReportResult';
import MachinePlaning from './Components/MachinePlaning/ToolGrindingResult';
import MachinePlanningTab from './Components/MachinePlaning/MachinePlanningTab';
import FileTypeResult from './Components/FileType/FileTypeResult';
import NPDPlanResult from './Components/NPDPlan/NPDPlanResult';
import FGItemList from './Components/Accounting/FGItem/FGItemList';
import { titleNames } from './Utility/TitleName';
import GanttChartModule from './Components/OrderPlaningComp/GanttChartModule/GanttChartModule';
import SupervisorModule from './Components/Supervisor/SupervisorModule';
import MkdResult from './Components/MkdComp/MkdResult';
import JaobCardView from './Components/JobCardView/JaobCardView';
import PurchaseBillWithoutPOModule from './Components/PurchaseBillWithoutPO/PurchaseBillWithoutPOModule';
import PurchaseOrderReport from './Components/PurchaseOrderReport/PurchaseOrderReport';
import ForeCastEntryModule from './Components/ForeCastEntry/ForeCastEntryModule';
import ForeCastEntryResult from './Components/ForeCastEntry/ForeCastEntryResult';
import POAuthorizationView from './Components/POAuthorizationView/POAuthorizationView';
import ScrapModuleResult from './Components/ScrapModule/ScrapModuleResult';
import ScrapReportModule from './Components/ScrapModule/ScrapReportModule';
import NewPurchaseOrderEntry from './Components/Accounting/PurchaseorderEntry/NewPurchaseOrderEntry';
import NewPurchaseOderEntryView from './Components/Accounting/PurchaseorderEntry/NewPurchaseOderEntryView';
import NewNRDCEntry from './Components/Accounting/NonReturnableDC/NewNRDCEntry';
import NewNRDCView from './Components/Accounting/NonReturnableDC/NewNRDCView';
import NewCustomerDc from './Components/Accounting/CustomerDC/NewCustomerDc';
import NewCustomerDcView from './Components/Accounting/CustomerDC/NewCustomerDcView';
import NewGstInvoice from './Components/Accounting/GSTSalesInvoice/NewGstInvoice';
import NewGstInvView from './Components/Accounting/GSTSalesInvoice/NewGstInvView';
import ProductMasterResult from './Components/ProductMaster/ProductMasterResult';
import JobWorkIssueResult from './Components/JobWorkIssueComp/JobWorkIssueResult';
import JobWorkIssueModal from './Components/JobWorkIssueComp/JobWorkIssueModal';
import PurchaseBillWithoutPOResult from './Components/PurchaseBillWithoutPO/PurchaseBillWithoutPOResult';
import PurchaseBillAgaintPOResult from './Components/PurchaseBillAgainstPO/PurchaseBillAgaintPOResult';
import ProductionResult from './Components/ProductionPlan/ProductionResult';
import OrderPlaningNpdResult from './Components/OrderPlaningNPD/OrderPlaningNpdResult';
import PlanningStoreRequestNote from './Components/PlanningStoreRequestNote/PlanningStoreRequestNote';
import ShortCloseDocument from './Components/Accounting/ShortClose/ShortCloseDocument';
import CustPoClosed from './Components/Accounting/CustPOclosed/CustPoClosed';
import CustomerDCReportList from './Components/Accounting/CustomerDCReport/CustomerDCReportList';
import StandardReportList from './Components/Accounting/StandardReport/StandardReportList';
import CheckListTitleList from './Components/DigitalChecklist/CheckListTitle/CheckListTitleList';
import ChecklistHeaderList from './Components/DigitalChecklist/ChecklistHeader/ChecklistHeaderList';
import DcSelection from './Components/Accounting/GSTSalesInvoice/DcSelection';
import PriceChangeResult from './Components/PriceChange/PriceChangeResult';
import WhereUsedReport from './Components/WhereUse/WhereUsedReport';
import SOPriceChangeResult from './Components/SoPriceVerification/SOPriceChangeResult';
import ReportTabsList from './Components/ReportTabs/ReportTabsList';
import JobworkReceiptModule from './Components/JobWorkReceipt/JobworkReceiptModule';
import RejectedItemsResult from './Components/RejectedItems/RejectedItemsResult';
import LocationResult from './Components/LocationComp/LocationResult';
import TodaysDispatchPlanResult from './Components/TodaysDispatchPlan/TodaysDispatchPlanResult';
import AssemblyUser from './Components/AssemblyUser/AssemblyUser';
import ProcessInspectionChild from './Components/ProcessInspection/ProcessInspectionChild';
import JobCardViewNewResult from './Components/JobCardViewNew/JobCardViewNewResult';
import QcApproval from './Components/QcApproval/QcApproval';
import PaintSludgeReport from './Components/ScrapModule/PaintSludgeReport';
import CustomerVsItemProcess from './Components/Accounting/CustomerVsItemMaster/CustomerVsItemProcess';
import SkillMatrixResult from './Components/SkillMatrix/SkillMatrixResult';
import StoreItemReference from './Components/StoreItemReference/StoreItemReference';
import StockLedgerReportList from './Components/StockLedgerReport/StockLedgerReportList';
import StockBalanceReport from './Components/StockBalanceReport/StockBalanceReport';
import MaterialReturnNoteList from './Components/MaterialReturnNote/MaterialReturnNoteList';
import QuarantineStockReport from './Components/QuarantineStockReport/QuarantineStockReport';
import OpeningBalanceApproval from './Components/OpeningBalanceApproval/OpeningBalanceApproval';
import OpeningBalanceUpload from './Components/OpeningBalanceUpload/OpeningBalanceUpload';
import ProductionReport from './Components/ProductionReport/ProductionReport';
import DocumentNumberResult from './Components/DocumentNumber/DocumentNumberResult';
import PurchaseBillAgaintPOModule from './Components/PurchaseBillAgainstPO/PurchaseBillAgainstPOModule';
import PoShortClosed from './Components/PoShortClosed/PoShortClosed';
import CustomerDcQualityCheck from './Components/Accounting/CustomerDcQC/CustomerDcQualityCheck';
import CancelInvoice from './Components/Accounting/CancelInvoice/CancelInvoice';
import CancelInvoiceAuthorization from './Components/Accounting/CancelInvoiceAuthorization/CancelInvoiceAuthorization';
import SalesReturn from './Components/Accounting/SalesReturn/SalesReturn';
import QualityInspectionTab from './Components/QualityInspectionTab/QualityInspectionTab';
import QualityAssemblyReportTitle from './Components/QualityAssemblyReport/QualityAssemblyReportTitle';
import AssemblyRejectedItemsResult from './Components/AssemblyRejectedItems/AssemblyRejectedItemsResult';
import ScrapAnalysisReport from './Components/ScrapAnalysisReport/ScrapAnalysisReport';
import SalesInvoiceReport from './Components/Accounting/ReportModules/SalesInvoiceReport/SalesInvoiceReport';
import ItemwiseReport from './Components/Accounting/ReportModules/ItemwiseReport/ItemwiseReport';
import SalesRegisterReport from './Components/Accounting/ReportModules/SalesRegisterReport/SalesRegisterReport';
import CustPoReport from './Components/Accounting/ReportModules/SO-CustPoReport/SO-CustPoReport';
import InvoiceCustDcReport from './Components/Accounting/ReportModules/InvoiceCustDcReport/InvoiceCustDcReport';
import QualityAssemblyReportTab from './Components/QualityAssemblyReportTab/QualityAssemblyReportTab';
import QualityAssemblyRejectedTab from './Components/QualityAssemblyRejectedTab/QualityAssemblyRejectedTab';
import SupplierModule from './Components/SupplierCom/SupplierModule';
import StockTransfer from './Components/StockTransfer/StockTransfer';
import SalesResultAssembly from './Components/SalesCompAssembly/SalesResult';
import SrnShortClosed from './Components/SrnShortClosed/SrnShortClosed';
import OrderStatusReport from './Components/OrderStatusReport/OrderStatusReport';
import ItemConsumptionTrend from './Components/ItemConsumptionTrend/ItemConsumptionTrend';
import StockAgeReport from './Components/StockAgeReport/StockAgeReport';
import GenerateElectronicInvoice from './Components/Accounting/GenerateElectronicInvoice/GenerateElectronicInvoice';
import PurchasebillWithoutReport from './Components/PurchasebillWithoutPOReport/PurchasebillWithoutReport';
import FPIProcessInwardReport from './Components/ProcessInwardReport/FPIProcessInwardReport';
import FPIProcessInwardTitle from './Components/ProcessInwardReport/FPIProcessInwardTitle';
import PurchaseOrderAganistPOReport from './Components/PurchaseOrderAganistPO_Report/PurchaseOrderAganistPOReport';
import JobWorkIssueReport from './Components/JobWorkIssueReport/JobWorkIssueReport';
import FGItemViewResult from './Components/Accounting/FGItemView/FGItemViewResult';
import QualitySetting from './Components/QualitySetting/QualitySetting';
import QualitySettingResult from './Components/QualitySetting/QualitySettingResult';
import NewPerformInvoice from './Components/PerformInvoice/NewPerformInvoice';
import CustomerVsItemReport from './Components/Accounting/CustomerVsItemMaster/CustomerVsItemReport';
import QualitySettingMapResult from './Components/QualitySettingMap/QualitySettingMapResult';
import SalesReportMultiPrint from './Components/Accounting/SalesReportMultiPrint/SalesReportMultiPrint';
import DeliveyComVerified from './Components/DeliveryOrderStatus/DeliveyComVerified';
import DocumentMasterResult from './Components/DocumentNumber/DocumentMasterResult';
import DispatchDashboard from './Components/DIspatchDashboard/DispatchDashboard';
import AuthorizePlanning from './Components/AuthorizeDocumentPlan/AuthorizePlanning';
import NewMaterialIsseResult from './Components/MaterialIssueComp/NewMaterialIsseResult';
import SFGStockReport from './Components/DIspatchDashboard/SFGStockReport';
import CompanyMaster from './Components/CompanyMaster/CompanyMaster';
import PartNumberDashboard from './Components/DIspatchDashboard/PartNumberDashboard';
import InwardRejectedItemsResult from './Components/InwardRejectedItems/InwardRejectedItemsResult';
import MeterailIssueReport from './Components/MeterailIsuueNoteReports/MeterailIssueReport';
import CustomerPriceRevisionApproval from './Components/Accounting/CustomerPriceRevisionApproval/CustomerPriceRevisionApproval';
import EmailSettingResult from './Components/EmailSettings/EmailSettingResult';
import RemarksMasterTitle from './Components/Remarks_Master/RemarksMasterTitle';
import RemarksMasterResult from './Components/Remarks_Master/RemarksMasterResult';
import RemarksMasterModule from './Components/Remarks_Master/RemarksMasterModule';
import CompletedSFG from './Components/DIspatchDashboard/CompletedSFGReport/CompletedSFG';
import NRDCItemReport from './Components/Accounting/ReportModules/ItemwiseReport/NRDCItemReport';
import ITC04JobworkIssueReport from './Components/ITC04JobworkReports/ITC04JobworkIssueReport';
import ITC04JobworkReceiptReport from './Components/ITC04JobworkReports/ITC04JobworkReceiptReport';
import PoAuthorizationReport from './Components/POAuthorizationReport/PoAuthorizationReport';
import SupplierDeliveryRating from './Components/SupplierDevliveryRatings/SupplierDeliveryRating';
import LotwiseStockReport from './Components/LotwiseStockReports/LotwiseStockReport';
import InwardDiscrepancyReport from './Components/LotwiseStockReports/InwardDiscrepancyReport';
import PurchaseReceiptReport from './Components/PurchaseReceiptReport/PurchaseReceiptReport';
import SupplierVsItemListReport from './Components/SupplierVsItemListReport/SupplierVsItemListReport';
import ForeCastVsPo from './Components/ForecastVsPo/ForeCastVsPo';
import MrnReport from './Components/LotwiseStockReports/MrnReport';
import ToolMappingModule from './Components/ToolMapping/ToolMappingModule';
import DailyStockReport from './Components/DailyStockReport/DailyStockReport';
import JobWork_Receipt from './Components/JobWork_Receipt/JobWork_Receipt';
import MultiXMLPrint from './Components/Accounting/MultiXmlGenerate/MultiXMLPrint';
import ToolComplaintsResult from './Components/ToolComplaints/ToolComplaintsResult';
import QOPCList from './Components/QOPCMaster/QOPCList';
import SFGSummaryReport from './Components/DIspatchDashboard/CompletedSFGReport/SFGSummaryReport';
import Manual_Dispatch from './Components/Manual_Dispatch/Manual_Dispatch_Title';
import Manual_Dispatch_Title from './Components/Manual_Dispatch/Manual_Dispatch_Title';
import Customer_POList_Report from './Components/Customer_POList_Report/Customer_POList_Report';
import Credit_Note_Report from './Components/Credit_Note/Credit_Note_Report';
import Cancel_Invoice_Report from './Components/Cancel_Invoice_Report/Cancel_Invoice_Report';
import NestingTransaction from './Components/Supervisor/NestingTransaction';
import NRDCCutomerReport from './Components/Accounting/ReportModules/ItemwiseReport/NRDCCutomerReport';
import PurchaseBillMultiPrint from './Components/PurchaseBillAgainstPO/PurchaseBillAgainstPrint/PurchaseBillMultiPrint';
import NestingModule from './Components/Supervisor/NestingModule';
import PurchaseBillWithoutMultiPrint from './Components/PurchaseBillWithoutPO/PurchaseBillWithoutPrint/PurchaseBillWithoutMultiPrint';
import IndentIssuedReport from './Components/IndentRequiredIssuedReport/IndentIssuedReport';
import TransactionLockManager from './Components/TransactionLock/TransactionLockManager';
import RevisedPlan from './Components/RevisedPlan/RevisedPlan';
import CancelSummarizedReport from './Components/Accounting/CancelInvoice/CancelSummarizedReport';
import FPYTrendsReport from './Components/ProcessInwardReport/FPYTrendsReport';
import RateMasterTablist from './Components/RateMasterList/RateMasterTablist';
import MaterialRateResult from './Components/MaterialRateMaster/MaterialRateResult';
import KPIChartCard from './Components/DashboardComps/KPIChartCard';
import COPQReport from './Components/ProcessInwardReport/COPQReport';
import PPMCalculationReport from './Components/ProcessInwardReport/PPMCalculationReport';
import { ModuleLockProvider } from './Components/context/ModuleLockContext';
import PriceMapList from './Components/PriceMapMaster/PriceMapList';
import MaintenanceSchedule from './Components/MaintenanceSchedule/MaintenanceSchedule';
import MaintenanceApproval from './Components/MaintenanceApproval/MaintenanceApproval';
import MaintenanceStatus from './Components/MaintenanceStatus/MaintenanceStatus';
import AddChecklistResult from './Components/Checklist/AddChecklistResult';
import ChecklistTemplateResult from './Components/ChecklistTemplate/ChecklistTemplateResult';
import ChecklistReport from './Components/ChecklistReport/ChecklistReport';

function ProtectedRoutes() {
  const navigate = useNavigate();
  const { accessToken, userDetails } = ApplicationStore().getStorage('userDetails');
  const location = useLocation(); // Add this line

  if (accessToken) {
    // DYNAMICALLY PAGE TITLE CHANGE
    const routeName = location.pathname.slice(1); // Remove the leading slash
    const title = `${routeName.charAt(0).toUpperCase() + routeName.slice(1)}`;
    console.log('title', title)
    document.title = titleNames[title] ? titleNames[title] : title;
    console.log('titleNames', titleNames[title])

    // Uncomment the following lines
    // if (userDetails?.secondLevelAuthorization === 'true' || userDetails?.forcePasswordReset === 1) {
    //   navigate('/login');
    // }

    return <Outlet />;
  }

  return <Navigate replace to="/login" />;
}



function App() {
  ///////////////////////////////////////////////////////////TAB CLEAR LOGIN CODE//////////////////////////////////
  useEffect(() => {
    const TAB_COUNTER_KEY = 'activeTabCount';
    const USER_DETAILS_KEY = 'userDetails';

    // Increment active tab count
    function incrementTabCount() {
      const count = parseInt(localStorage.getItem(TAB_COUNTER_KEY) || '0', 10);
      localStorage.setItem(TAB_COUNTER_KEY, (count + 1).toString());
    }

    // Decrement count and clear user details if no tabs are left
    function decrementTabCount() {
      const count = parseInt(localStorage.getItem(TAB_COUNTER_KEY) || '0', 10);
      const newCount = count > 0 ? count - 1 : 0;

      localStorage.setItem(TAB_COUNTER_KEY, newCount.toString());

      if (newCount === 0) {
        localStorage.removeItem(USER_DETAILS_KEY);
      }
    }

    // On page load
    incrementTabCount();

    // On tab close
    window.addEventListener('beforeunload', decrementTabCount);
  }, [])
  ///////////////////////////////////////////////////////////TAB CLEAR LOGIN CODE//////////////////////////////////


  // const location = useLocation();

  // useEffect(() => {
  //   // Extract the route name from the location object
  //   const routeName = location.pathname.slice(1); // Remove the leading slash

  //   // Set the document title based on the route name
  //   document.title = `${routeName.charAt(0).toUpperCase() + routeName.slice(1)} Page`;
  // }, [location.pathname]);

  const store = createStore(Reducer, {}, applyMiddleware(thunk));
  return (
    <Provider store={store}>
      {/* <ModuleLockProvider> */}
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoutes />}>
            {/* <Route path="/" element={<HomePage />}> */}
            <Route
              path="/"
              element={
                <ModuleLockProvider>
                  <HomePage />
                </ModuleLockProvider>
              }
            >
              <Route path='TransactionLock/' element={<TransactionLockManager />} />
              <Route path='MasterDashboard/' element={<MasterDashboard />} />
              <Route path='CompanyMaster/' element={<CompanyMaster />} />
              <Route path="CustomerResult/" element={<CustomerResult />} />
              <Route path='SupplaceResult/' element={<SupplaceResult />} />
              <Route path='CustomerHeaderResult/' element={<CustomerHeaderResult />} />
              <Route path='CurrencyMasterResult/' element={<CurrencyMasterResult />} />
              <Route path="UserAddResult/" element={<UserAddResult />} />
              <Route path='PartMasterResult/' element={<PartMasterResult />} />
              <Route path='SupplierResult/' element={<SupplierResult />} />
              <Route path='CustomerGroupResult/' element={<CustomerGroupResult />} />
              <Route path='ProjectNameResult/' element={<ProjectNameResult />} />
              <Route path='PartHeaderResult/' element={<PartHeaderResult />} />
              <Route path='PlaceOfSupplyResult/' element={<PlaceOfSupplyResult />} />
              <Route path='BomModule/' element={<BomModule />} />
              <Route path='ItemVsProcess/' element={<ItemVsProcess />} />
              <Route path='AddMasterResult/' element={<AddMasterResult />} />
              <Route path='SalesResult/' element={<SalesResult />} />
              <Route path='SalesResultAssembly/' element={<SalesResultAssembly />} />
              <Route path='AddMachineResult/' element={<AddMachineResult />} />
              <Route path='SupplerResult/' element={<SupplerResult />} />
              <Route path='StoresItemMasterResult/' element={<StoresItemMasterResult />} />
              <Route path='SupplierVsItemMasterResult/' element={<SupplierVsItemMasterResult />} />
              <Route path='ShiftMasterResult/' element={<ShiftMasterResult />} />
              <Route path='MachineOperatorResult/' element={<MachineOperatorResult />} />
              <Route path='ProcessVsUOMResult/' element={<ProcessVsUOMResult />} />
              <Route path='PurchaseOrderGenerationModule/' element={<PurchaseOrderGenerationModule />} />
              <Route path='AuthoriseDocumentsModule/' element={<AuthoriseDocumentsModule />} />
              <Route path='SecondLevelAuthorizationModule/' element={<SecondLevelAuthorizationModule />} />
              <Route path='PurchaseBillAgainstPOModule/' element={<PurchaseBillAgainstPOModule />} />
              <Route path='PurchaseBillAgaintPOModule/' element={<PurchaseBillAgaintPOModule />} />
              <Route path='PurchaseBillAgaintPOResult/' element={<PurchaseBillAgaintPOResult />} />
              <Route path='MaterialIssueNote/' element={<MaterialIssueNote />} />
              <Route path='StoresRequestNote/' element={<StoresRequestNote />} />
              <Route path='MinMaxStatusReport/' element={<MinMaxStatusReport />} />
              <Route path='SRNShortageReport/' element={<SRNShortageReport />} />
              <Route path='ItemVsProcessView/' element={<ItemVsProcessView />} />
              <Route path='MinMaxConsumptionReport/' element={<MinMaxConsumptionReport />} />
              <Route path='PriceRevisionHistoryReport/' element={<PriceRevisionHistoryReport />} />
              <Route path='NewSFGEntryModule/' element={<SFGEntryResult />} />
              <Route path='ViewSFGEntryModule/' element={<ViewSFGEntryModule />} />
              <Route path='PurchaseOrderView/' element={<PurchaseOrderView />} />
              {/* <Route path='MaterialIssueResult/' element={<MaterialIssueResult />} /> */}
              <Route path='NewMaterialIsseResult/' element={<NewMaterialIsseResult />} />
              <Route path='MaterialAllocationResult/' element={<MaterialAllocationResult />} />
              <Route path='AllocationComp/' element={<AllocationComp />} />
              <Route path='IssueComp/' element={<IssueComp />} />
              <Route path='QualityResults/' element={<QualityResult />} />
              <Route path='QualityTemplateResult/' element={<QualityTemplateResult />} />
              <Route path='PartProcessVsInspectionResult/' element={<PartProcessVsInspectionResult />} />
              <Route path='ProcessInspectionResult/' element={<ProcessInspectionResult />} />
              <Route path='InProcessFPIResult/' element={<InProcessFPIResult />} />
              <Route path='InProcessLPIResult/' element={<InProcessLPIResult />} />
              <Route path='InProcessReworkResult/' element={<InProcessReworkResult />} />
              <Route path='FPIReport/' element={<FPIReport />} />
              <Route path='ObservationReport/' element={<ObservationReport />} />
              <Route path='ReworkReport/' element={<ReworkReport />} />
              <Route path='LPIReport/' element={<LPIReport />} />
              <Route path='LPIModifiedReport/' element={<LPIModifiedReport />} />
              <Route path='FPIModifiedReport/' element={<FPIModifiedReport />} />
              <Route path='ObservationModifiedReport/' element={<ObservationModifiedReport />} />
              <Route path='ReworkModifiedReport/' element={<ReworkModifiedReport />} />
              <Route path='PurchaseOrderApprovalModule/' element={<PurchaseOrderApprovalModule />} />
              <Route path='PriceRevisionApproval/' element={<PriceRevisionApproval />} />
              <Route path='RejectionAndRework/' element={<RejectionAndRework />} />
              <Route path='DeptMasterList/' element={<DeptMasterList />} />
              <Route path='SectionList/' element={<SectionList />} />
              <Route path='ReportLabelList/' element={<ReportLabelList />} />
              <Route path='CheckTitleList/' element={<CheckTitleList />} />
              <Route path='CheckListList/' element={<CheckListList />} />
              <Route path='JobworkReceiptModule/' element={<JobworkReceiptModule />} />
              <Route path='RejectedItemsResult/' element={<RejectedItemsResult />} />
              <Route path='TodaysDispatchPlanResult/' element={<TodaysDispatchPlanResult />} />
              <Route path='JobCardViewNewResult/' element={<JobCardViewNewResult />} />
              <Route path='QcApproval/' element={<QcApproval />} />
              <Route path='AssemblyRejectedItemsResult/' element={<AssemblyRejectedItemsResult />} />
              <Route path='QualityAssemblyRejectedTab/' element={<QualityAssemblyRejectedTab />} />

              <Route path='QualitySetting/' element={<QualitySettingResult />} />
              <Route path='QualitySettingMapResult/' element={<QualitySettingMapResult />} />
              <Route path='QualityResults/' element={<QualityResult />} />
              <Route path='QualityInspectionTab/' element={<QualityInspectionTab />} />
              <Route path='QualityAssemblyReportTitle/' element={<QualityAssemblyReportTitle />} />
              <Route path='QualityAssemblyReportTab/' element={<QualityAssemblyReportTab />} />
              <Route path='QualityTemplateResult/' element={<QualityTemplateResult />} />
              <Route path='PartProcessVsInspectionResult/' element={<PartProcessVsInspectionResult />} />
              <Route path='ProcessInspectionResult/' element={<ProcessInspectionResult />} />
              <Route path='InProcessFPIResult/' element={<InProcessFPIResult />} />
              <Route path='InProcessLPIResult/' element={<InProcessLPIResult />} />
              <Route path='InProcessReworkResult/' element={<InProcessReworkResult />} />
              <Route path='FPIReport/' element={<FPIReport />} />
              <Route path='ObservationReport/' element={<ObservationReport />} />
              <Route path='ReworkReport/' element={<ReworkReport />} />
              <Route path='LPIReport/' element={<LPIReport />} />
              <Route path='LPIModifiedReport/' element={<LPIModifiedReport />} />
              <Route path='FPIModifiedReport/' element={<FPIModifiedReport />} />
              <Route path='ObservationModifiedReport/' element={<ObservationModifiedReport />} />
              <Route path='ReworkModifiedReport/' element={<ReworkModifiedReport />} />
              <Route path='PurchaseOrderApprovalModule/' element={<PurchaseOrderApprovalModule />} />
              <Route path='PriceRevisionApproval/' element={<PriceRevisionApproval />} />
              <Route path='AssignRightsModal/' element={<AssignRightsModal />} />
              <Route path='MenuRightsResult/' element={<MenuRightsResult />} />
              <Route path='GroupMasterResult/' element={<GroupMasterResult />} />
              <Route path='SfgVarificationResult/' element={<SfgVarificationResult />} />
              <Route path='NewSfgVarificationResult/' element={<NewSfgVarificationResult />} />
              <Route path='SfgViewResult/' element={<SfgViewResult />} />
              <Route path='SfgVendorProcessResult/' element={<SfgVendorProcessResult />} />
              <Route path='ViewSfgVendorProcessResult/' element={<ViewSfgVendorProcessResult />} />
              <Route path='RMBOIIndentReportResult/' element={<RMBOIIndentReportResult />} />
              <Route path='MachinePlanningTab/' element={<MachinePlanningTab />} />
              <Route path='GanttChartModule/' element={<GanttChartModule />} />
              <Route path='PurchaseBillWithoutPOModule/' element={<PurchaseBillWithoutPOModule />} />
              <Route path='PurchaseBillWithoutPOResult/' element={<PurchaseBillWithoutPOResult />} />
              <Route path='PurchaseOrderReport/' element={<PurchaseOrderReport />} />
              <Route path='ForeCastEntryModule/' element={<ForeCastEntryModule />} />
              <Route path='ForeCastEntryResult/' element={<ForeCastEntryResult />} />
              <Route path='POAuthorizationView/' element={<POAuthorizationView />} />
              <Route path='JobWorkIssueResult/' element={<JobWorkIssueResult />} />
              <Route path='JobWorkIssueModal/' element={<JobWorkIssueModal />} />
              <Route path='PlanningStoreRequestNote/' element={<PlanningStoreRequestNote />} />
              <Route path='PurchasebillWithoutReport/' element={<PurchasebillWithoutReport />} />
              <Route path='PartNumberDashboard/' element={<PartNumberDashboard />} />
              <Route path='JobWork_Receipt/' element={<JobWork_Receipt />} />

              {/* sanju changes */}
              <Route path='FIMMasterResult/' element={<FIMMasterResult />} />
              <Route path='CSLimportResult/' element={<CSLimportResult />} />
              <Route path='SOBimportResult/' element={<SOBimportResult />} />
              <Route path='InProcessIn/' element={<InProcessIn />} />
              <Route path='FPIReportTitle/' element={<FPIReportTitle />} />
              <Route path='FPIProcessInwardTitle/' element={<FPIProcessInwardTitle />} />
              {/* //////F.P.Y TREND ///Report */}
              <Route path='FPYTrendsReport/' element={<FPYTrendsReport />} />
              <Route path='COPQReport/' element={<COPQReport />} />

              <Route path='OrderPlaningResult/' element={<OrderPlaningResult />} />
              <Route path='OrderTypeMasterResult/' element={<OrderTypeMasterResult />} />
              <Route path='ToolResult/' element={<ToolResult />} />
              <Route path='ProcessVsToolResult/' element={<ProcessVsToolResult />} />
              <Route path='ToolMonitoringResult/' element={<ToolMonitoringResult />} />
              <Route path='ToolGrindingResult/' element={<ToolGrindingResult />} />
              <Route path='ToolUsageReport/' element={<ToolUsageReport />} />
              <Route path='DispatchResult/' element={<DispatchResult />} />
              <Route path='CDispatchOrderResult/' element={<CDispatchOrderResult />} />
              <Route path='VendorDispatchOrderResult/' element={<VendorDispatchOrderResult />} />
              <Route path='DeliveryOrderStatusResult/' element={<DeliveryOrderStatusResult />} />
              <Route path='CreateDeliveryOrderResult/' element={<CreateDeliveryOrderResult />} />
              <Route path='HolidayMasterResult/' element={<HolidayMasterResult />} />
              <Route path='NpdResult/' element={<NpdResult />} />
              <Route path='DeletLog/' element={<DeletLog />} />
              <Route path='PlanReportResult/' element={<PlanReportResult />} />
              <Route path='MachinePlaning/' element={<MachinePlaning />} />
              <Route path='FileTypeResult/' element={<FileTypeResult />} />
              <Route path='NPDPlanResult/' element={<NPDPlanResult />} />
              <Route path='SupervisorModule/' element={<SupervisorModule />} />
              <Route path='MkdResult/' element={<MkdResult />} />
              <Route path='JabCardView/' element={<JaobCardView />} />
              <Route path='ScrapModule/' element={<ScrapModuleResult />} />
              <Route path='ScrapReport/' element={<ScrapReportModule />} />
              <Route path='ProductMaster/' element={<ProductMasterResult />} />
              <Route path='ProductionResult/' element={<ProductionResult />} />
              <Route path='OrderPlaningNpdResult/' element={<OrderPlaningNpdResult />} />
              <Route path='PriceChangeResult/' element={<PriceChangeResult />} />
              <Route path='SOPriceChangeResult/' element={<SOPriceChangeResult />} />
              <Route path='LocationResult/' element={<LocationResult />} />
              <Route path='AssemblyUser/' element={<AssemblyUser />} />
              <Route path='SupplierModule/' element={<SupplierModule />} />
              <Route path='PurchaseOrderAganistPOReport/' element={<PurchaseOrderAganistPOReport />} />

              {/* Accounting */}
              <Route path='AccMasterList/' element={<AccMasterList />} />
              <Route path='AccDispatchList/' element={<AccDispatchList />} />
              <Route path='NewPurchaseOrderEntry/' element={<NewPurchaseOrderEntry />} />
              <Route path='EinvoicingList/' element={<EinvoicingList />} />
              <Route path='FGItemList/' element={<FGItemList />} />
              <Route path='NewPurchaseOderEntryView/' element={<NewPurchaseOderEntryView />} />
              <Route path='NewNRDCEntry/' element={<NewNRDCEntry />} />
              <Route path='NewNRDCView/' element={<NewNRDCView />} />
              <Route path='NewCustomerDc/' element={<NewCustomerDc />} />
              <Route path='NewCustomerDcView/' element={<NewCustomerDcView />} />
              <Route path='NewGstInvoice/' element={<NewGstInvoice />} />
              <Route path='NewGstInvView/' element={<NewGstInvView />} />
              <Route path='ShortCloseDocument/' element={<ShortCloseDocument />} />
              <Route path='CustPoClosed/' element={<CustPoClosed />} />
              <Route path='CustomerDCReportList/' element={<CustomerDCReportList />} />
              <Route path='StandardReportList/' element={<StandardReportList />} />
              <Route path='DcSelection/' element={<DcSelection />} />
              <Route path='CustomerVsItemProcess/' element={<CustomerVsItemProcess />} />
              <Route path='DocumentNumberResult/' element={<DocumentNumberResult />} />
              <Route path='CustomerDcQualityCheck/' element={<CustomerDcQualityCheck />} />
              <Route path='CancelInvoice/' element={<CancelInvoice />} />
              <Route path='CancelSummarizedReport/' element={<CancelSummarizedReport />} />
              <Route path='CancelInvoiceAuthorization/' element={<CancelInvoiceAuthorization />} />
              <Route path='SalesReturn/' element={<SalesReturn />} />
              <Route path='SalesInvoiceReport/' element={<SalesInvoiceReport />} />
              <Route path='ItemwiseReport/' element={<ItemwiseReport />} />
              <Route path='SalesRegisterReport/' element={<SalesRegisterReport />} />
              <Route path='CustPoReport/' element={<CustPoReport />} />
              <Route path='InvoiceCustDcReport/' element={<InvoiceCustDcReport />} />
              <Route path='GenerateElectronicInvoice/' element={<GenerateElectronicInvoice />} />
              <Route path='FGItemViewResult/' element={<FGItemViewResult />} />
              <Route path='NewPerformInvoice/' element={<NewPerformInvoice />} />
              <Route path='CustomerVsItemReport/' element={<CustomerVsItemReport />} />
              <Route path='NRDCItemReport/' element={<NRDCItemReport />} />
              <Route path='NRDCCutomerReport/' element={<NRDCCutomerReport />} />
              <Route path='SalesReportMultiPrint/' element={<SalesReportMultiPrint />} />
              <Route path='PurchaseBillMultiPrint/' element={<PurchaseBillMultiPrint />} />
              <Route path='PurchaseBillWithoutMultiPrint/' element={<PurchaseBillWithoutMultiPrint />} />
              <Route path='DispatchDashboard/' element={<DispatchDashboard />} />
              <Route path='DocumentMasterResult/' element={<DocumentMasterResult />} />
              <Route path='DocumentNumberResult/' element={<DocumentNumberResult />} />
              <Route path='SFGStockReport/' element={<SFGStockReport />} />
              <Route path='CustomerPriceRevisionApproval/' element={<CustomerPriceRevisionApproval />} />
              <Route path='RemarksMasterTitle/' element={<RemarksMasterTitle />} />
              <Route path='RemarksMasterResult/' element={<RemarksMasterResult />} />
              <Route path='RemarksMasterModule/' element={<RemarksMasterModule />} />
              <Route path='CompletedSFG/' element={<CompletedSFG />} />
              <Route path='PurchaseReceiptReport/' element={<PurchaseReceiptReport />} />
              <Route path='SupplierVsItemListReport/' element={<SupplierVsItemListReport />} />
              <Route path='ForeCastVsPo/' element={<ForeCastVsPo />} />
              <Route path='DailyStockReport/' element={<DailyStockReport />} />

              {/* Scrap */}
              <Route path='PaintSludgeReport/' element={<PaintSludgeReport />} />


              {/* StockLedgerReportList */}
              <Route path='StockLedgerReportList/' element={<StockLedgerReportList />} />
              <Route path='MaterialReturnNoteList/' element={<MaterialReturnNoteList />} />

              {/* {Digital CheckList} */}
              <Route path='CheckListTitleList/' element={<CheckListTitleList />} />
              <Route path='ChecklistHeaderList/' element={<ChecklistHeaderList />} />
              <Route path='WhereUsedReport/' element={<WhereUsedReport />} />
              <Route path='ReportTabsList/' element={<ReportTabsList />} />

              {/* Quality master */}
              <Route path='QualityMstList/' element={<QualityMstList />} />
              <Route path='ProcessInspectionChild/' element={<ProcessInspectionChild />} />

              {/* Skill matrix */}
              <Route path='SkillMatrixResult/' element={<SkillMatrixResult />} />

              {/* Store Item Reference */}
              <Route path='StoreItemReference/' element={<StoreItemReference />} />

              {/* Stock Balance Report */}
              <Route path='StockBalanceReport/' element={<StockBalanceReport />} />

              {/* Quarantine Stock Report */}
              <Route path='QuarantineStockReport/' element={<QuarantineStockReport />} />

              {/*OpeningBalanceApproval */}
              <Route path='OpeningBalanceApproval/' element={<OpeningBalanceApproval />} />

              {/*OpeningBalanceUpload */}
              <Route path='OpeningBalanceUpload/' element={<OpeningBalanceUpload />} />

              {/*ProductionReport */}
              <Route path='ProductionReport/' element={<ProductionReport />} />

              {/*Purchase Order Short Closed*/}
              <Route path='PoShortClosed/' element={<PoShortClosed />} />

              {/*Scrap Analysis Report*/}
              <Route path='ScrapAnalysisReport/' element={<ScrapAnalysisReport />} />

              {/*Stock Transfer*/}
              <Route path='StockTransfer/' element={<StockTransfer />} />

              {/*SRN ShortClosed*/}
              <Route path='SrnShortClosed/' element={<SrnShortClosed />} />

              {/*Order Status Report*/}
              <Route path='OrderStatusReport/' element={<OrderStatusReport />} />

              {/*Item Consumption Trend Report*/}
              <Route path='ItemConsumptionTrend/' element={<ItemConsumptionTrend />} />

              {/*Stock Age Report*/}
              <Route path='StockAgeReport/' element={<StockAgeReport />} />

              {/*Job Work Issue Report*/}
              <Route path='JobWorkIssueReport/' element={<JobWorkIssueReport />} />
              <Route path='DeliveyComVerified/' element={<DeliveyComVerified />} />

              {/*meterial Issue Note Report*/}
              <Route path='MeterailIssueReport/' element={<MeterailIssueReport />} />

              {/*ITC04JobworkIssueReport*/}
              <Route path='ITC04JobworkIssueReport/' element={<ITC04JobworkIssueReport />} />

              {/* ITC04JobworkReceiptReport */}

              <Route path='ITC04JobworkReceiptReport/' element={<ITC04JobworkReceiptReport />} />

              {/* LotwiseStock Report  */}

              <Route path='LotwiseStockReport/' element={<LotwiseStockReport />} />

              <Route path='InwardDiscrepancyReport/' element={<InwardDiscrepancyReport />} />

              <Route path='MrnReport/' element={<MrnReport />} />

              <Route path='IndentIssuedReport/' element={<IndentIssuedReport />} />


              {/* Authorize Planning Document */}
              <Route path='AuthorizePlanning/' element={<AuthorizePlanning />} />

              {/* Inward Rejected Items */}
              <Route path='InwardRejectedItemsResult/' element={<InwardRejectedItemsResult />} />

              {/* EmailSettingModule */}

              <Route path='EmailSettingResult/' element={<EmailSettingResult />} />

              {/* PO Authorization Report*/}
              <Route path='PoAuthorizationReport/' element={<PoAuthorizationReport />} />
              {/* Supplier Delivery rating Report*/}

              <Route path='SupplierDeliveryRating/' element={<SupplierDeliveryRating />} />

              <Route path='ToolMappingModule/' element={<ToolMappingModule />} />
              <Route path='ToolResult/' element={<ToolResult />} />
              <Route path='MultiXMLPrint/' element={<MultiXMLPrint />} />
              <Route path='ToolComplaintsResult/' element={<ToolComplaintsResult />} />
              <Route path='SFGSummaryReport/' element={<SFGSummaryReport />} />
              <Route path='Manual_Dispatch_Title/' element={<Manual_Dispatch_Title />} />
              {/* CR Modules */}
              <Route path='QOPCList/' element={<QOPCList />} />
              <Route path='RateMasterTablist/' element={<RateMasterTablist />} />
              <Route path='PriceMapList/' element={<PriceMapList />} />
              <Route path='MaterialRateResult/' element={<MaterialRateResult />} />
              <Route path='Customer_POList_Report/' element={<Customer_POList_Report />} />
              <Route path='Credit_Note_Report/' element={<Credit_Note_Report />} />
              <Route path='Cancel_Invoice_Report/' element={<Cancel_Invoice_Report />} />
              <Route path='NestingTransaction/' element={<NestingTransaction />} />
              <Route path='NestingModule/' element={<NestingModule />} />
              <Route path='RevisedPlan/' element={<RevisedPlan />} />
              <Route path='KPIChartCard/' element={<KPIChartCard />} />
              <Route path='PPMCalculationReport/' element={<PPMCalculationReport />} />
              <Route path="/MaintenanceSchedule" element={<MaintenanceSchedule />} />
              <Route path="/MaintenanceApproval" element={<MaintenanceApproval />} />
              <Route path="/MaintenanceStatus" element={<MaintenanceStatus />} />
              {/* <Route path="/MaintenanceMsterTab" element={<MaintenanceMsterTab />} /> */}

              <Route path="/AddChecklistResult" element={<AddChecklistResult />} />
              <Route path="/ChecklistTemplateResult" element={<ChecklistTemplateResult />} />
              <Route path="/ChecklistReport" element={<ChecklistReport />} />






            </Route>
          </Route>
        </Routes>
      </Router>
      {/* </ModuleLockProvider> */}
      {/* <Footer /> */}
    </Provider>
  );
}

export default App;
