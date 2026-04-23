/* eslint-disable max-len */
import { data } from 'autoprefixer';
import ApplicationStore from '../Utility/localStorageUtil';
import axios from 'axios';
const successCaseCode = [200, 201];

const _fetchService = (PATH, serviceMethod, data, successCallback, errorCallBack) => {
  // const { accessToken, userDetails } = ApplicationStore().getStorage('userDetails');
  const { fyFrom, fyTo, accessToken, userDetails = {} } = ApplicationStore().getStorage('userDetails') || {};

  const END_POINT = process.env.REACT_APP_API_URL;

  const { email, userRole, companyCode, id, userName } = userDetails;

  const headers = {
    'Content-Type': 'application/json',
    authorization: `Bearer ${accessToken}`,
    companyCode: `${companyCode}`,
    userName: `${userName}`,
    userRole: `${userRole}`,
    id: `${id}`,
    email: `${email}`,
    fyFrom: `${fyFrom}`,
    fyTo: `${fyTo}`,
  };

  // const body = (serviceMethod === 'GET') || (serviceMethod === 'DELETE') ? {} : { body: JSON.stringify(data) };
  const body = (serviceMethod === 'GET') ? {} : { body: JSON.stringify(data) };

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

  return fetch(END_POINT + PATH, bodyObject)
    .then((response) => {
      // if (successCaseCode.indexOf(response.status) > -1) {
      //   return response.json();
      // }
      if (successCaseCode.indexOf(response.status) > -1) {

        const contentType = response.headers.get("content-type") || "";

        // ✅ ONLY for file download APIs
        if (
          contentType.includes("application/vnd.openxmlformats-officedocument") ||
          contentType.includes("application/octet-stream")
        ) {
          return response.blob();   // 🔥 THIS IS THE FIX
        }

        // ✅ ALL EXISTING APIs remain unchanged
        return response.json();
      }



      // eslint-disable-next-line no-throw-literal
      // throw {
      //   errorStatus: response.status,
      //   errorObject: response.json(),
      // };
      return response.json().then((err) => {
        throw {
          errorStatus: response.status,
          errorObject: err, // ✅ resolved JSON
        };
      });
    })
    .then((dataResponse) => successCallback(dataResponse))
    // .catch((error) => {
    //   error.errorObject.then((errorResponse) => {
    //     if (error.errorStatus === 401 && errorResponse.message === 'Unable to access the page, Token Expired') {

    //       ApplicationStore().clearStorage();
    //       window.location.reload();
    //     }
    //     // errorCallBack(error.errorStatus, errorResponse.message);
    //     errorCallBack(errorResponse, errorResponse.message);
    //   });
    // });


    // .catch((error) => {
    //   const handleError = (errorResponse) => {
    //     if (
    //       error.errorStatus === 401 &&
    //       errorResponse?.message === "Unable to access the page, Token Expired"
    //     ) {
    //       ApplicationStore().clearStorage();
    //       window.location.reload();
    //       return;
    //     }

    //     errorCallBack(errorResponse, errorResponse.message);
    //   };

    //   // ✅ supports BOTH promise & object (no breaking changes)
    //   if (error?.errorObject?.then) {
    //     error.errorObject.then(handleError);
    //   } else {
    //     handleError(error.errorObject);
    //   }
    // });

    .catch((error) => {

      // 🔒 HARD GUARD: if no error at all, do nothing
      if (!error) return;

      const handleError = (errorResponse) => {

        // 🔒 VERY IMPORTANT: if no real error data, EXIT
        if (!errorResponse || Object.keys(errorResponse).length === 0) {
          return; // ✅ prevents error on success APIs
        }

        const message =
          errorResponse.message ||
          errorResponse.errorMessage ||
          "Something went wrong. Please try again.";

        // 🔐 Token expired case
        if (
          error?.errorStatus === 401 &&
          message === "Unable to access the page, Token Expired"
        ) {
          ApplicationStore().clearStorage();
          window.location.reload();
          return;
        }

        // ✅ Call error callback ONLY for real errors
        errorCallBack(errorResponse, message);
      };

      // ✅ Promise-based errorObject
      if (
        error?.errorObject &&
        typeof error.errorObject.then === "function"
      ) {
        error.errorObject
          .then(handleError)
          .catch(() => handleError(error.errorObject));
      }
      // ✅ Normal object error
      else if (error?.errorObject) {
        handleError(error.errorObject);
      }
    });


};


////Axios/////////

const _axiosService = (PATH, serviceMethod, data, successCallback, errorCallBack) => {
  const { fyFrom, fyTo, accessToken, userDetails = {} } =
    ApplicationStore().getStorage('userDetails') || {};

  const END_POINT = process.env.REACT_APP_API_URL;
  const { email, userRole, companyCode, id, userName } = userDetails;

  // Common headers
  const headers = {
    authorization: `Bearer ${accessToken}`,
    companyCode: `${companyCode}`,
    userName: `${userName}`,
    userRole: `${userRole}`,
    id: `${id}`,
    email: `${email}`,
    fyFrom: `${fyFrom}`,
    fyTo: `${fyTo}`,
  };

  // If data is FormData (files), do NOT set Content-Type; Axios will handle it
  if (!(data instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  axios({
    method: serviceMethod,
    url: END_POINT + PATH,
    headers,
    data: data instanceof FormData ? data : JSON.stringify(data),
  })
    .then((response) => {
      successCallback(response.data);
    })
    .catch((error) => {
      const errorResponse = error.response?.data || { message: error.message };
      if (error.response?.status === 401 && errorResponse.message === 'Unable to access the page, Token Expired') {
        ApplicationStore().clearStorage();
        window.location.reload();
      }
      errorCallBack(errorResponse, errorResponse.message);
    });
};

///////operatorLog////
const _fetchMallikOperatorLogService = (PATH, serviceMethod, data, successCallback, errorCallBack) => {
  const { token, userDetails } = ApplicationStore().getStorage('userDetails');

  const END_POINT = process.env.REACT_APP_MALLIK_API_URL;

  const headers = {

    'Content-Type': 'application/json',
    authorization: `Bearer ${token}`,
    // companyCode: `${companyCode}`,
    // userId: `${email}`,
    // userRole: `${userRole}`,
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

  return fetch(END_POINT + PATH, bodyObject)
    .then((response) => {
      if (successCaseCode.indexOf(response.status) > -1) {
        return response.json();
      }
      // eslint-disable-next-line no-throw-literal
      // throw {
      //   errorStatus: response.status,
      //   errorObject: response.json(),
      // };
      return response.json().then((err) => {
        throw {
          errorStatus: response.status,
          errorObject: err,
        };
      });
    })
    .then((dataResponse) => successCallback(dataResponse))
    .catch((error) => {
      error.errorObject.then((errorResponse) => {
        if (error.errorStatus === 401 && errorResponse.message === 'Unable to access the page, Token Expired') {
          ApplicationStore().clearStorage();
          // location.reload();
        }
        errorCallBack(error.errorStatus, errorResponse.message);
      });
    });
};

export const LoginService = (data) => {
  const PATH = 'login';
  const END_POINT = process.env.REACT_APP_API_URL;

  const SERVICE_METHOD = 'POST';
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  return fetch(END_POINT + PATH, {
    method: SERVICE_METHOD,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers,
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  });
};


//Dashboard APi

export const DashboardApi = (successCallback, errorCallBack) => _fetchService(`dashboard`, 'GET', {}, successCallback, errorCallBack);
export const DispatchDashboardApi = (successCallback, errorCallBack) => _fetchService(`dispatchDashboard/dailyKpiDash`, 'GET', {}, successCallback, errorCallBack);
export const KPIGrapgDashboardApi = (data, successCallback, errorCallBack) => _fetchService(`dashboard/monthlyKpiReport?month=12&kpi=${data.kpi}`, 'GET', data, successCallback, errorCallBack);
export const AddKPIsettings = (data, successCallback, errorCallBack) => _fetchService('dashboard/updateKpiTarget', 'PUT', data, successCallback, errorCallBack);
export const UpdateKPIMonth = (data, successCallback, errorCallBack) => _fetchService(`dashboard/kpiMetricReport?month=${data.month}&kpiCode=${data.code}&kpiKey=${data.key}`, 'GET', data, successCallback, errorCallBack);



//mastres and supplier master 
export const AllMasterAdd = (data, successCallback, errorCallBack) => _fetchService('master', 'POST', data, successCallback, errorCallBack);

export const AllShowMasterAdd = (data, successCallback, errorCallBack) => _fetchService(`master/${data.masterType}`, 'GET', {}, successCallback, errorCallBack);

export const AllMasterUpdate = (data, successCallback, errorCallBack) => _fetchService(`master/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const AllMasterDelete = (data, successCallback, errorCallBack) => _fetchService(`master/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const ItemGroupShowMaster = (data, successCallback, errorCallBack) => _fetchService(`master/${data.masterType}`, 'GET', {}, successCallback, errorCallBack);

export const UOMShowMaster = (data, successCallback, errorCallBack) => _fetchService(`master/${data.masterType}`, 'GET', {}, successCallback, errorCallBack);

export const ItemGroupSupplierGroupShowMaster = (successCallback, errorCallBack) => _fetchService(`master/supplierGroup`, 'GET', {}, successCallback, errorCallBack);

export const ItemGetItemsTypeFirst = (data, successCallback, errorCallBack) => _fetchService(`item/getItems?type=${data?.type}&id=${data?.id}`, 'GET', {}, successCallback, errorCallBack);

export const GetCountryStates = (data, successCallback, errorCallBack) => _fetchService(`master/getState/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const AllMasterExcelUpload = (data, successCallback, errorCallBack) => _fetchService('master/import', 'POST', data, successCallback, errorCallBack);


// Spplie/vendor
//-----------------------------------------------------------------------------------------------------------------------------------------------//
export const GetCurreny = (successCallback, errorCallBack) => _fetchService(`master/currency`, 'GET', {}, successCallback, errorCallBack);

export const GetSupplierGroup = (successCallback, errorCallBack) => _fetchService(`master/supplierGroup`, 'GET', {}, successCallback, errorCallBack);

export const GetSupplierType = (successCallback, errorCallBack) => _fetchService(`master/supplyType`, 'GET', {}, successCallback, errorCallBack);

export const GetGSTINUINID = (successCallback, errorCallBack) => _fetchService(`master/gstinOrUin`, 'GET', {}, successCallback, errorCallBack);

export const GetPlaceOfSupply = (successCallback, errorCallBack) => _fetchService(`master/placeOfSupply`, 'GET', {}, successCallback, errorCallBack);

export const GetSupplierGetId = (successCallback, errorCallBack) => _fetchService(`supplier/getId`, 'GET', {}, successCallback, errorCallBack);

export const supplierUploadFile = (data, successCallback, errorCallBack) => _fetchService(`supplier/uploadFile`, 'POST', data, successCallback, errorCallBack);

export const CustomerGroupShow = (successCallback, errorCallBack) => _fetchService(`master/customerGroup`, 'GET', {}, successCallback, errorCallBack);

export const HandleSearchCity = (data, successCallback, errorCallBack) => _fetchService(`supplier/searchCity?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

export const PreviewSupplierData = (data, successCallback, errorCallBack) => _fetchService(`supplier/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const SupplierButtonActions = (data, successCallback, errorCallBack) => _fetchService(`supplier/display?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);


// delete
export const supplierUploadDelet = (data, successCallback, errorCallBack) => _fetchService(`supplier/deleteFileById/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const supplierUploadDeletCancle = (data, successCallback, errorCallBack) => _fetchService(`supplier/deleteFile/${data.globalId}`, 'DELETE', data, successCallback, errorCallBack);

export const supplierMultiAddressDeletCancle = (data, successCallback, errorCallBack) => _fetchService(`multiAddress/delete/${data.globalId}`, 'DELETE', data, successCallback, errorCallBack);

export const supplierContactPersonDeletCancle = (data, successCallback, errorCallBack) => _fetchService(`contactPerson/delete/${data.globalId}`, 'DELETE', data, successCallback, errorCallBack);

//show
export const FileDataShow = (data, successCallback, errorCallBack) => _fetchService(`supplier/getFiles/${data.id}`, 'GET', {}, successCallback, errorCallBack);

//Add && upadte delete

export const SupplierDataAdd = (data, successCallback, errorCallBack) => _fetchService(`supplier`, 'POST', data, successCallback, errorCallBack);

export const SupplierDataUpdate = (data, successCallback, errorCallBack) => _fetchService(`supplier/update/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const SupplierDataShow = (successCallback, errorCallBack) => _fetchService(`supplier`, 'GET', {}, successCallback, errorCallBack);

export const SupplierDataDelete = (data, successCallback, errorCallBack) => _fetchService(`supplier/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const SupExcelImport = (data, successCallback, errorCallBack) => _fetchService(`supExcel/import`, 'POST', data, successCallback, errorCallBack);


//Add && upadte delete multiAddress

export const MultiAddressAdd = (data, successCallback, errorCallBack) => _fetchService(`multiAddress`, 'POST', data, successCallback, errorCallBack);

export const MultiAddressDataUpdate = (data, successCallback, errorCallBack) => _fetchService(`multiAddress/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const MultiAddressDataShow = (data, successCallback, errorCallBack) => _fetchService(`multiAddress/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const MultiAddressDataDelete = (data, successCallback, errorCallBack) => _fetchService(`contactPerson/${data.id}`, 'DELETE', {}, successCallback, errorCallBack);

//Add && upadte delete contactPerson

export const ContactPersonsAdd = (data, successCallback, errorCallBack) => _fetchService(`contactPerson`, 'POST', data, successCallback, errorCallBack);

export const ContentontactPersonUpdate = (data, successCallback, errorCallBack) => _fetchService(`contactPerson/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const ContactPersonsDataShow = (data, successCallback, errorCallBack) => _fetchService(`contactPerson/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const ContactPersonsDataDelete = (data, successCallback, errorCallBack) => _fetchService(`contactPerson/${data.id}`, 'DELETE', {}, successCallback, errorCallBack);


// itemMaster
//-----------------------------------------------------------------------------------------------------------------------------------------------//

export const ItemMasterAdd = (data, successCallback, errorCallBack) => _fetchService(`itemMaster`, 'POST', data, successCallback, errorCallBack);

export const ItemMasterUpdate = (data, successCallback, errorCallBack) => _fetchService(`itemMaster/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const ItemMastersDataShow = (data, successCallback, errorCallBack) => _fetchService(`itemMaster/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const ItemMasterDataDelete = (data, successCallback, errorCallBack) => _fetchService(`itemMaster/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const UnderLedgerDataShow = (data, successCallback, errorCallBack) => _fetchService(`itemMaster/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const HSNCodeDataShow = (data, successCallback, errorCallBack) => _fetchService(`itemMaster/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const MainLocationDataShow = (data, successCallback, errorCallBack) => _fetchService(`itemMaster/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const SubLocationDataShow = (data, successCallback, errorCallBack) => _fetchService(`itemMaster/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const ProductFinishDataShow = (data, successCallback, errorCallBack) => _fetchService(`itemMaster/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const ProductFamilyDataShow = (data, successCallback, errorCallBack) => _fetchService(`itemMaster/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const FIMIDDataShow = (data, successCallback, errorCallBack) => _fetchService(`itemMaster/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const RMItemcodeDataShow = (data, successCallback, errorCallBack) => _fetchService(`itemMaster/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const ItemMastersCatogryDataShow = (successCallback, errorCallBack) => _fetchService(`itemMaster/category`, 'GET', {}, successCallback, errorCallBack);


//------------------------------------------------------------item-------------------------------------------------------------------------------//

export const ItemAdd = (data, successCallback, errorCallBack) => _fetchService(`item`, 'POST', data, successCallback, errorCallBack);

export const ItemUpdate = (data, successCallback, errorCallBack) => _fetchService(`item/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const ItemsDataShow = (data, successCallback, errorCallBack) => _fetchService(`item?page=${data.page}&&itemId=${data?.itemId}`, 'GET', {}, successCallback, errorCallBack);

export const ItemSearchNAAJ = (data, successCallback, errorCallBack) => _fetchService(`item/search?q=${data?.text}`, 'GET', {}, successCallback, errorCallBack);

export const ItemDataDelete = (data, successCallback, errorCallBack) => _fetchService(`item/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const SuppDetailsList = (data, successCallback, errorCallBack) => _fetchService(`item/supVsItem/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const ItemImportXl = (data, successCallback, errorCallBack) => _fetchService(`item/import`, 'POST', data, successCallback, errorCallBack);

export const ItemStockImportlistdata = (data, successCallback, errorCallBack) => _fetchService(`item/stock/import`, 'POST', data, successCallback, errorCallBack);

export const ItemRateImport = (data, successCallback, errorCallBack) => _fetchService(`item/rate/import`, 'POST', data, successCallback, errorCallBack);

export const ItemRateUpdate = (data, successCallback, errorCallBack) => _fetchService(`item/rate/update`, 'POST', data, successCallback, errorCallBack);

export const ItemStockDataBase = (data, successCallback, errorCallBack) => _fetchService(`item/stock`, 'POST', data, successCallback, errorCallBack);

export const ItemDuplicateItems = (data, successCallback, errorCallBack) => _fetchService(`item/duplicateItems`, 'POST', data, successCallback, errorCallBack);

export const ItemImportExcel = (data, successCallback, errorCallBack) => _fetchService(`item/importExcel`, 'POST', data, successCallback, errorCallBack);

export const BulkItemImportExcel = (data, successCallback, errorCallBack) => _fetchService(`item/loadBulkItems`, 'POST', data, successCallback, errorCallBack);

export const CustomerImportExcel = (data, successCallback, errorCallBack) => _fetchService(`customer/import`, 'POST', data, successCallback, errorCallBack);

export const ItemStoreBulk = (data, successCallback, errorCallBack) => _fetchService(`item/storeBulk`, 'POST', data, successCallback, errorCallBack);

export const BulkItemStore = (data, successCallback, errorCallBack) => _fetchService(`item/storeBulkItems`, 'POST', data, successCallback, errorCallBack);

export const CustomerStoreBulk = (data, successCallback, errorCallBack) => _fetchService(`customer/store`, 'POST', data, successCallback, errorCallBack);

export const CustomerSearchList = (data, successCallback, errorCallBack) => _fetchService(`customer/search?q=${data?.text}`, 'GET', {}, successCallback, errorCallBack);

//---------------------------------------------------------------customer--------------------------------------------------//

export const CustomerAdd = (data, successCallback, errorCallBack) => _fetchService(`customer`, 'POST', data, successCallback, errorCallBack);

export const Customerpdate = (data, successCallback, errorCallBack) => _fetchService(`customer/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const CustomerShow = (successCallback, errorCallBack) => _fetchService(`customer`, 'GET', {}, successCallback, errorCallBack);

export const CustomerDelete = (data, successCallback, errorCallBack) => _fetchService(`customer/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const GetIdCustomer = (successCallback, errorCallBack) => _fetchService(`customer/getId`, 'GET', {}, successCallback, errorCallBack);

export const CustomerDeleteFile = (data, successCallback, errorCallBack) => _fetchService(`customer/deleteFileById/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const CustomerImport = (data, successCallback, errorCallBack) => _fetchService(`customer/import`, 'POST', data, successCallback, errorCallBack);

//----------------------------------------------------DELETE FILES LIST -----------------------------------------------------------------------//

export const ContactPersonCustomerFileDelete = (data, successCallback, errorCallBack) => _fetchService(`contactPersonCustomer/delete/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const CustomerFileDelete = (data, successCallback, errorCallBack) => _fetchService(`customer/deleteFile/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const MultiAddressCustomerFileDelete = (data, successCallback, errorCallBack) => _fetchService(`multiAddressCustomer/delete/${data.id}`, 'DELETE', data, successCallback, errorCallBack);


// multi address

export const CustomMultiAddressAdd = (data, successCallback, errorCallBack) => _fetchService(`multiAddressCustomer`, 'POST', data, successCallback, errorCallBack);

export const CustomMultiAddresspdate = (data, successCallback, errorCallBack) => _fetchService(`multiAddressCustomer/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const CustomMultiAddressShow = (data, successCallback, errorCallBack) => _fetchService(`multiAddressCustomer/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const CustomMultiAddressDelete = (data, successCallback, errorCallBack) => _fetchService(`multiAddressCustomer/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

// multi Contact person

export const CustomMContactAdd = (data, successCallback, errorCallBack) => _fetchService(`contactPersonCustomer`, 'POST', data, successCallback, errorCallBack);

export const CustomContactUpdate = (data, successCallback, errorCallBack) => _fetchService(`contactPersonCustomer/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const CustomContactShow = (data, successCallback, errorCallBack) => _fetchService(`contactPersonCustomer/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const CustomContactDelete = (data, successCallback, errorCallBack) => _fetchService(`contactPersonCustomer/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const CustomerUploadFile = (data, successCallback, errorCallBack) => _fetchService(`customer/uploadFile`, 'POST', data, successCallback, errorCallBack);

export const GetCustomerUploadFile = (data, successCallback, errorCallBack) => _fetchService(`customer/getfiles/${data.id}`, 'GET', {}, successCallback, errorCallBack);


//------------------------------------------------------------bomExl/import---------------------------------------------------------------------//

export const BeareromExlImport = (data, successCallback, errorCallBack) => _fetchService(`bom/import`, 'POST', data, successCallback, errorCallBack);

export const BomFetchId = (data, successCallback, errorCallBack) => _fetchService(`bom/getBomList?type=${data?.type}&id=${data?.id}`, 'GET', {}, successCallback, errorCallBack);

export const BomDeleteD = (data, successCallback, errorCallBack) => _fetchService(`bom/delete/${data.deleteId}`, 'DELETE', data, successCallback, errorCallBack);

export const BomItemsShow = (data, successCallback, errorCallBack) => _fetchService(`bom/items?q=${data?.text}`, 'GET', {}, successCallback, errorCallBack);

export const BomDelete = (data, successCallback, errorCallBack) => _fetchService(`bom/delete/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const BomImportStroreService = (data, successCallback, errorCallBack) => _fetchService(`bom/store`, 'POST', data, successCallback, errorCallBack);

export const BomItemsUpdate = (data, successCallback, errorCallBack) => _fetchService(`bom/update/${data?.id}`, 'PUT', data, successCallback, errorCallBack);

export const BomItemsDelete = (data, successCallback, errorCallBack) => _fetchService(`bom/items/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const BomDetailsView = (successCallback, errorCallBack) => _fetchService(`bom/details`, 'GET', {}, successCallback, errorCallBack);

export const BomItemRowInsert = (data, successCallback, errorCallBack) => _fetchService(`bom/itemDetails?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

export const UpdateNewBomEntry = (data, successCallback, errorCallBack) => _fetchService(`bom/update`, 'PUT', data, successCallback, errorCallBack);

//--------------------------------------------------------Plan Report-------------------------------------------------------------------------------//

export const ReportPlanning = (data, successCallback, errorCallBack) => _fetchService(`report/planning?fromDate=${data?.fromDate}&toDate=${data?.toDate}`, 'GET', {}, successCallback, errorCallBack);


//-------------------------------------------------------------CSL-------------------------------------------------------------------------------//

export const cslAdd = (data, successCallback, errorCallBack) => _fetchService(`csl`, 'POST', data, successCallback, errorCallBack);

export const cslUpdate = (data, successCallback, errorCallBack) => _fetchService(`csl/${data?.id}`, 'PUT', data, successCallback, errorCallBack);

export const cslShowData = (data, successCallback, errorCallBack) => _fetchService(`csl/show`, 'POST', data, successCallback, errorCallBack);

export const cslDelete = (data, successCallback, errorCallBack) => _fetchService(`csl/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const cslExlImport = (data, successCallback, errorCallBack) => _fetchService(`cslExl/import`, 'POST', data, successCallback, errorCallBack);

// export const SobConsolidateSob = (successCallback, errorCallBack) => _fetchService(`sob/consolidateSob`, 'GET', {}, successCallback, errorCallBack);
export const SobConsolidateSob = (data, successCallback, errorCallBack) => _fetchService(`sob/consolidateSob`, 'POST', data, successCallback, errorCallBack);

export const SobMissingCsl = (data, successCallback, errorCallBack) => _fetchService(`sob/missingCsl?q=${data?.id}&sobMstId=${data?.sobMstId}`, 'GET', {}, successCallback, errorCallBack);

export const SobMissingCslDelete = (data, successCallback, errorCallBack) => _fetchService(`sob/missingCsl`, 'POST', data, successCallback, errorCallBack);

export const SobMoveItems = (data, successCallback, errorCallBack) => _fetchService(`sob/moveItems`, 'POST', data, successCallback, errorCallBack);

export const SobDeletedItems = (successCallback, errorCallBack) => _fetchService(`sob/deletedItems`, 'GET', {}, successCallback, errorCallBack);

export const SobResAndDev = (successCallback, errorCallBack) => _fetchService(`sob/resAndDev`, 'GET', {}, successCallback, errorCallBack);

export const PlanningFim = (data, successCallback, errorCallBack) => _fetchService(`sob/fim?sobMstId=${data?.sobMstId}`, 'GET', {}, successCallback, errorCallBack);

export const RevisedCSLPlan = (formData, successCallback, errorCallback) =>
  _axiosService('revisedPlan/processCslAndSob', 'POST', formData, successCallback, errorCallback);

export const CompareCSLandSOB = (data, successCallback, errorCallBack) => _fetchService(`revisedPlan/compareCslAndSob`, 'POST', data, successCallback, errorCallBack);

export const ProcessRevisedPlanApi = (data, successCallback, errorCallBack) => _fetchService(`revisedPlan/processRevisedPlan`, 'POST', data, successCallback, errorCallBack);

//-------------------------------------------------------------CSL-------------------------------------------------------------------------------//

export const SobAdd = (data, successCallback, errorCallBack) => _fetchService(`sob`, 'POST', data, successCallback, errorCallBack);

export const SobUpdate = (data, successCallback, errorCallBack) => _fetchService(`sob/${data?.id}`, 'PUT', data, successCallback, errorCallBack);

export const SobShowData = (successCallback, errorCallBack) => _fetchService(`sob`, 'GET', {}, successCallback, errorCallBack);

export const SobDelete = (data, successCallback, errorCallBack) => _fetchService(`sob/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const SobExlImport = (data, successCallback, errorCallBack) => _fetchService(`sobExl/import`, 'POST', data, successCallback, errorCallBack);

export const RevisedExlImport = (data, successCallback, errorCallBack) => _fetchService(`asset/readExcel`, 'POST', data, successCallback, errorCallBack);

export const CslViewData = (data, successCallback, errorCallBack) => _fetchService(`csl/${data.viewId}`, 'GET', {}, successCallback, errorCallBack);

export const CslMissing = (data, successCallback, errorCallBack) => _fetchService(`csl/missing/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const CslSearch = (data, successCallback, errorCallBack) => _fetchService(`csl/search?q=${data?.text}`, 'GET', {}, successCallback, errorCallBack);

//--------------------------------------------------WhereUsedReport----------------------------------------------------------------------------------

export const BomMainParts = (data, successCallback, errorCallBack) => _fetchService(`bom/mainParts?itemId=${data?.itemId}&type=${data?.type}`, 'GET', {}, successCallback, errorCallBack);


//--------------------------------------------------so-verification---------------------------------------------------------------------------------

export const SoVerification = (data, successCallback, errorCallBack) => _fetchService(`so-verification`, 'POST', data, successCallback, errorCallBack);

//-----------------------------------------------------------------sale------------------------------------------------------------------------------//

//FOR ASSEMBLY USER
export const AssemblyUserMrpGenerate = (data, successCallback, errorCallBack) => _fetchService('mrp/assembly', 'POST', data, successCallback, errorCallBack);
//

export const SaleAddData = (data, successCallback, errorCallBack) => _fetchService(`sale`, 'POST', data, successCallback, errorCallBack);

export const SaleUpdateData = (data, successCallback, errorCallBack) => _fetchService(`sale/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const SaleAddShowData = (data, successCallback, errorCallBack) => _fetchService(`sale?isNpd=${data?.isNpd}&isAssembly=${data?.isAssembly}&fromDate=${data?.fromDate}&toDate=${data?.toDate}`, 'GET', {}, successCallback, errorCallBack);

export const SaleGetId = (successCallback, errorCallBack) => _fetchService(`sale/getId`, 'GET', {}, successCallback, errorCallBack);

export const SaleScrapRejectedItems = (data, successCallback, errorCallBack) => _fetchService(`order/scrap`, 'POST', data, successCallback, errorCallBack);

export const SaleGetOrderNo = (successCallback, errorCallBack) => _fetchService(`sale/getOrderNo`, 'GET', {}, successCallback, errorCallBack);

export const CustomerSearch = (successCallback, errorCallBack) => _fetchService(`customer`, 'GET', {}, successCallback, errorCallBack);

export const ItemfetchItemsSearch = (successCallback, errorCallBack) => _fetchService(`item/fetchItems`, 'GET', {}, successCallback, errorCallBack);

export const SaleOrderData = (data, successCallback, errorCallBack) => _fetchService(`sale/order`, 'POST', data, successCallback, errorCallBack);

export const SaleOrderUpdateData = (data, successCallback, errorCallBack) => _fetchService(`sale/order/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const SaleOrderDataDelete = (data, successCallback, errorCallBack) => _fetchService(`sale/order/deleteById/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const SaleOrderFullDataDelete = (data, successCallback, errorCallBack) => _fetchService(`sale/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const SaleOrderDataShow = (data, successCallback, errorCallBack) => _fetchService(`sale/order/${data.salesId}`, 'GET', {}, successCallback, errorCallBack);

export const SOBDataShow = (data, successCallback, errorCallBack) => _fetchService(`sob/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const SobFetchShow = (data, successCallback, errorCallBack) => _fetchService(`sob/fetch`, 'POST', data, successCallback, errorCallBack);

export const OrderProcessSales = (data, successCallback, errorCallBack) => _fetchService(`order/processSales`, 'POST', data, successCallback, errorCallBack);

export const OrderProcessOrder = (data, successCallback, errorCallBack) => _fetchService(`order/processOrder`, 'POST', data, successCallback, errorCallBack);

export const SobExlProductMap = (data, successCallback, errorCallBack) => _fetchService(`sobExl/productMap`, 'POST', data, successCallback, errorCallBack);

export const SaleOrderDelete = (data, successCallback, errorCallBack) => _fetchService(`sale/order/delete/${data?.id}`, 'DELETE', data, successCallback, errorCallBack);

export const SaleOrderImport = (data, successCallback, errorCallBack) => _fetchService(`sale/order/import`, 'POST', data, successCallback, errorCallBack);

export const AssemblySaleOrderImport = (data, successCallback, errorCallBack) => _fetchService(`sale/order/import`, 'POST', data, successCallback, errorCallBack);

//-----------------------------------------------------------------OrderTypeMaster-------------------------------------------------------------------------//

export const MasterAddData = (data, successCallback, errorCallBack) => _fetchService(`master`, 'POST', data, successCallback, errorCallBack);

export const MasterAddDataShow = (successCallback, errorCallBack) => _fetchService(`master/orderType`, 'GET', {}, successCallback, errorCallBack);

//-----------------------------------------------------------------Order Planing-------------------------------------------------------------------------//

export const MachinLoadBottleList = (data, successCallback, errorCallBack) => _fetchService(`planning/machineLoad?mrpMstIds=${data?.mrpMstIds}`, 'GET', {}, successCallback, errorCallBack);

export const OrderPlaningDataShow = (data, successCallback, errorCallBack) => _fetchService(`sale/fetch`, 'POST', data, successCallback, errorCallBack);

export const MRPGeneration = (data, successCallback, errorCallBack) => _fetchService(`order`, 'POST', data, successCallback, errorCallBack);

export const MRPGenerationmrp = (data, successCallback, errorCallBack) => _fetchService(`mrp`, 'POST', data, successCallback, errorCallBack);

export const SaleOrderFetch = (data, successCallback, errorCallBack) => _fetchService(`sale/order/fetch`, 'POST', data, successCallback, errorCallBack);

export const SaleOrderSplit = (data, successCallback, errorCallBack) => _fetchService(`order/split`, 'POST', data, successCallback, errorCallBack);

export const OrderOList = (data, successCallback, errorCallBack) => _fetchService(`order/list/${data?.id}`, 'GET', {}, successCallback, errorCallBack);

export const OrderList = (data, successCallback, errorCallBack) => _fetchService(`order/list/${data?.id}`, 'GET', {}, successCallback, errorCallBack);

export const InfoScrapList = (data, successCallback, errorCallBack) => _fetchService(`info/scrap/${data.id}`, 'POST', data, successCallback, errorCallBack);

export const InfoSheetList = (data, successCallback, errorCallBack) => _fetchService(`info/sheet/${data.id}`, 'POST', data, successCallback, errorCallBack);

export const SupervisorJcNestShow = (data, successCallback, errorCallBack) => _fetchService(`supervisorJc/nestShow`, 'POST', data, successCallback, errorCallBack);

export const SupervisorJcnestShowDtl = (data, successCallback, errorCallBack) => _fetchService(`supervisorJc/nestShowDtl`, 'POST', data, successCallback, errorCallBack);

export const SupervisorJcRqstMaterial = (data, successCallback, errorCallBack) => _fetchService(`supervisorJc/rqstMaterial`, 'POST', data, successCallback, errorCallBack);
export const SupervisorchecklistUpdate = (data, successCallback, errorCallBack) => _fetchService(`supervisorJc/submit`, 'PUT', data, successCallback, errorCallBack);

//----------------------------------------------------------------npd-----------------------------------------------------------------------------------//

export const NpdGetIdData = (successCallback, errorCallBack) => _fetchService(`npd/getId`, 'GET', {}, successCallback, errorCallBack);

export const NpdShowData = (data, successCallback, errorCallBack) => _fetchService(`npd/showData`, 'POST', data, successCallback, errorCallBack);

export const NpdDataDelete = (data, successCallback, errorCallBack) => _fetchService(`npd/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const NpdAddData = (data, successCallback, errorCallBack) => _fetchService(`npd`, 'POST', data, successCallback, errorCallBack);

export const NpdExlImport = (data, successCallback, errorCallBack) => _fetchService(`npdExl/import`, 'POST', data, successCallback, errorCallBack);

export const SkillMatrixExlImport = (data, successCallback, errorCallBack) => _fetchService(`skillmatrics/importSkillmatrics/import`, 'POST', data, successCallback, errorCallBack);

export const NpdFileUpload = (data, successCallback, errorCallBack) => _fetchService(`npd/fileUpload`, 'POST', data, successCallback, errorCallBack);

export const SkillMatrixFolderUpload = (data, successCallback, errorCallBack) => _fetchService(`skillmatrics/uploadSkillmatricsFiles`, 'POST', data, successCallback, errorCallBack);

export const SobResAndDevAll = (successCallback, errorCallBack) => _fetchService(`sob/resAndDevAll`, 'GET', {}, successCallback, errorCallBack);

export const NpdRevision = (data, successCallback, errorCallBack) => _fetchService(`npd/revision`, 'POST', data, successCallback, errorCallBack);

export const NpdRevisionId = (data, successCallback, errorCallBack) => _fetchService(`npd/revision/${data?.id}`, 'GET', {}, successCallback, errorCallBack);

export const NpdRevisionDELETE = (data, successCallback, errorCallBack) => _fetchService(`npd/revision/${data?.id}`, 'DELETE', {}, successCallback, errorCallBack);

export const NpdDltLogShow = (successCallback, errorCallBack) => _fetchService(`npd/dltLog`, 'GET', {}, successCallback, errorCallBack);

export const NpdSearch = (data, successCallback, errorCallBack) => _fetchService(`npd/search?q=${data?.text}`, 'GET', {}, successCallback, errorCallBack);

//--------------------------------------------------------------Authorise Documents-------------------------------------------------------------------

export const AuthoriseDocs = (data, successCallback, errorCallBack) => _fetchService(`docs?docType=${data?.type}&authLevel=${data.authLevel}`, 'GET', {}, successCallback, errorCallBack);

export const DocsData = (data, successCallback, errorCallBack) => _fetchService(`docs`, 'POST', data, successCallback, errorCallBack);


//----------------------------------------------------------------npdFileType------------------------------------------------------------------------------//

export const NpdFileType = (data, successCallback, errorCallBack) => _fetchService(`npdFileType`, 'POST', data, successCallback, errorCallBack);

export const NpdFileTypeUpdate = (data, successCallback, errorCallBack) => _fetchService(`npdFileType/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const NpdFileTypeShow = (successCallback, errorCallBack) => _fetchService(`npdFileType`, 'GET', {}, successCallback, errorCallBack);

export const NpdFileTypeDataDelete = (data, successCallback, errorCallBack) => _fetchService(`npdFileType/${data.id}`, 'DELETE', {}, successCallback, errorCallBack);

//-----------------------------------------------------------------dispatch------------------------------------------------------------------------------------//

export const DispatchExlimport = (data, successCallback, errorCallBack) => _fetchService(`dispatchExl/import`, 'POST', data, successCallback, errorCallBack);

export const DispatchSearchFim = (data, successCallback, errorCallBack) => _fetchService(`dispatch/searchFim?q=${data?.text}`, 'GET', {}, successCallback, errorCallBack);

export const DispatchShowData = (data, successCallback, errorCallBack) => _fetchService(`dispatch/showData`, 'POST', data, successCallback, errorCallBack);

export const DispatchGetFim = (successCallback, errorCallBack) => _fetchService(`dispatch/getFim`, 'GET', {}, successCallback, errorCallBack);

export const DispatchDelShow = (data, successCallback, errorCallBack) => _fetchService(`dispatch/delShow`, 'POST', data, successCallback, errorCallBack);

export const DispatchGetContractPart = (data, successCallback, errorCallBack) => _fetchService(`dispatch/getContractPart`, 'POST', data, successCallback, errorCallBack);

export const DispatchDelShowDataLis = (data, successCallback, errorCallBack) => _fetchService(`dispatch/delShow`, 'POST', data, successCallback, errorCallBack);

export const DispatchGetId = (successCallback, errorCallBack) => _fetchService(`dispatch/getId`, 'GET', {}, successCallback, errorCallBack);

export const DispatchCrtDelNote = (data, successCallback, errorCallBack) => _fetchService(`dispatch/crtDelNote`, 'POST', data, successCallback, errorCallBack);

export const DispatchCustDelSchedule = (successCallback, errorCallBack) => _fetchService(`dispatch/delstatus`, 'GET', {}, successCallback, errorCallBack);

export const DispatchCustDelScheduleShowDetail = (data, successCallback, errorCallBack) => _fetchService(`dispatch/delstatus?delID=${data?.delID}`, 'GET', data, successCallback, errorCallBack);

export const DispatchDelStatusSubmit = (data, successCallback, errorCallBack) => _fetchService(`dispatch/approveDelNote`, 'PUT', data, successCallback, errorCallBack);

export const DispatchDelStatusSubmitAll = (data, successCallback, errorCallBack) => _fetchService(`dispatch/delStatus/submitAll`, 'POST', data, successCallback, errorCallBack);

export const DispatchCustDelScheduleDelete = (data, successCallback, errorCallBack) => _fetchService(`dispatch/custDelSchedule/${data?.id}`, 'DELETE', {}, successCallback, errorCallBack);

export const DispatchInvoiceClick = (data, successCallback, errorCallBack) => _fetchService(`dispatch/invoiceClick/${data?.id}`, 'PUT', {}, successCallback, errorCallBack);

export const DispatchOrderDeleteDelete = (data, successCallback, errorCallBack) => _fetchService(`order/delete/${data?.id}`, 'DELETE', {}, successCallback, errorCallBack);

export const GetOpenPoModalData = (data, successCallback, errorCallBack) => _fetchService(`dispatch/openPo`, 'POST', data, successCallback, errorCallBack);

export const CreateDelNote = (data, successCallback, errorCallBack) => _fetchService(`dispatch/crtDelNote`, 'POST', data, successCallback, errorCallBack);

export const TodaysDispatchUpdate = (data, successCallback, errorCallBack) => _fetchService(`dispatch/qcApprove`, 'POST', data, successCallback, errorCallBack);



//---------------------------------------------------------jobCard---------------------------------------------------------------------------------------------------//

export const JobCardShow = (data, successCallback, errorCallBack) => _fetchService(`jobCard`, 'POST', data, successCallback, errorCallBack);

export const JobCardNumber = (data, successCallback, errorCallBack) => _fetchService(`jobCard/number`, 'POST', data, successCallback, errorCallBack);

export const JobCardOnSubmit = (data, successCallback, errorCallBack) => _fetchService(`jobCard`, 'POST', data, successCallback, errorCallBack);

export const SupervisorJobCardOnSubmit = (data, successCallback, errorCallBack) => _fetchService(`supervisorJc/jc`, 'POST', data, successCallback, errorCallBack);

export const JobCardView = (data, successCallback, errorCallBack) => _fetchService(`jobCard/view`, 'POST', data, successCallback, errorCallBack);


//--------------------------------------------------------------Scrape Master-----------------------------------------------------------------------------------------//

export const ScrapeMaster = (data, successCallback, errorCallBack) => _fetchService(`scrapMst`, 'POST', data, successCallback, errorCallBack);

export const ScrapeMasterUpdate = (data, successCallback, errorCallBack) => _fetchService(`scrapMst/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const ScrapeMasterDelete = (data, successCallback, errorCallBack) => _fetchService(`scrapMst/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const ScrapeMasterShowData = (successCallback, errorCallBack) => _fetchService(`scrapMst`, 'GET', {}, successCallback, errorCallBack);

export const ScrapMstReport = (data, successCallback, errorCallBack) => _fetchService(`scrapMst/report`, 'POST', data, successCallback, errorCallBack);

export const MachineShowData = (successCallback, errorCallBack) => _fetchService(`scrapMst/getMachine`, 'GET', {}, successCallback, errorCallBack);

export const SupervisorJcGetMachine = (successCallback, errorCallBack) => _fetchService(`supervisorJc/getMachine`, 'GET', {}, successCallback, errorCallBack);

export const ScrapMstGetCategory = (successCallback, errorCallBack) => _fetchService(`scrapMst/getCategory`, 'GET', {}, successCallback, errorCallBack);

export const ScrapMstGetMaterial = (successCallback, errorCallBack) => _fetchService(`scrapMst/getMaterial`, 'GET', {}, successCallback, errorCallBack);

export const SupervisorJcGetMaterial = (successCallback, errorCallBack) => _fetchService(`supervisorJc/getMaterial`, 'GET', {}, successCallback, errorCallBack);

export const SupervisorJcNestShowData = (data, successCallback, errorCallBack) => _fetchService(`supervisorJc/nestShow`, 'POST', data, successCallback, errorCallBack);

export const ScrapMstGetThickness = (successCallback, errorCallBack) => _fetchService(`scrapMst/getThickness`, 'GET', {}, successCallback, errorCallBack);

export const SupervisorJcRqstMaterialData = (data, successCallback, errorCallBack) => _fetchService(`supervisorJc/rqstMaterial`, 'POST', data, successCallback, errorCallBack);

// ------------------------------------------------------------------------Scrap Paint Sludge Report--------------------------------------------------------------------//

export const PaintSludgeReprt = (data, successCallback, errorCallBack) => _fetchService(`scrapMst/report/paintSludge`, 'POST', data, successCallback, errorCallBack);



// ------------------------------------------------------------------------pcn/uniqueNo---------------------------------------------------------------------------//

export const PcnUniqueNo = (successCallback, errorCallBack) => _fetchService(`pcn/uniqueNo`, 'GET', {}, successCallback, errorCallBack);

export const PcnImport = (data, successCallback, errorCallBack) => _fetchService(`pcn/import`, 'POST', data, successCallback, errorCallBack);

export const PcnStoreApi = (data, successCallback, errorCallBack) => _fetchService(`pcn/store`, 'POST', data, successCallback, errorCallBack);

export const GroupRightSubmit = (data, successCallback, errorCallBack) => _fetchService(`groupRight/submit`, 'POST', data, successCallback, errorCallBack);

export const PcnShowData = (data, successCallback, errorCallBack) => _fetchService(`pcn?q=${data?.text}`, 'GET', {}, successCallback, errorCallBack);

//----------------------------------------------------------------------------operatorlog-------------------------------------------------------------------------



////////////////////KEERTHI CHANGES///////////////////////////////////////

// ADD USER
export const AddUser = (data, successCallback, errorCallBack) => _fetchService('user', 'POST', data, successCallback, errorCallBack);
export const ShowUser = (successCallback, errorCallBack) => _fetchService('user', 'GET', {}, successCallback, errorCallBack);
export const UserEditData = (data, successCallback, errorCallBack) => _fetchService(`user/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const UserDeleteData = (data, successCallback, errorCallBack) => _fetchService(`user/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const ShowDesignation = (successCallback, errorCallBack) => _fetchService('master/designation', 'GET', {}, successCallback, errorCallBack);
export const ShowRole = (successCallback, errorCallBack) => _fetchService('master/role', 'GET', {}, successCallback, errorCallBack);
export const ShowDepartment = (successCallback, errorCallBack) => _fetchService('master/department', 'GET', {}, successCallback, errorCallBack);

//ADD MACHINE
export const AddMachine = (data, successCallback, errorCallBack) => _fetchService('machine', 'POST', data, successCallback, errorCallBack);
export const ShowMachine = (successCallback, errorCallBack) => _fetchService('machine', 'GET', {}, successCallback, errorCallBack);
export const MachineEdit = (data, successCallback, errorCallBack) => _fetchService(`machine/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const MachineDelete = (data, successCallback, errorCallBack) => _fetchService(`machine/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const ShowProcessMaster = (successCallback, errorCallBack) => _fetchService('master/pm', 'GET', {}, successCallback, errorCallBack);
export const GetShift = (successCallback, errorCallBack) => _fetchService('machine/getShift', 'GET', {}, successCallback, errorCallBack);
export const GetProcess = (successCallback, errorCallBack) => _fetchService('master/pm', 'GET', {}, successCallback, errorCallBack);
export const getMachineUOM = (data, successCallback, errorCallBack) => _fetchService('machine/getUom', 'POST', data, successCallback, errorCallBack);

//STORE ITEM MASTER
export const AddStoreItemMaster = (data, successCallback, errorCallBack) => _fetchService('storeItem', 'POST', data, successCallback, errorCallBack);
export const ShowStoreItemMaster = (successCallback, errorCallBack) => _fetchService('storeItem', 'GET', {}, successCallback, errorCallBack);
export const StoreItemEdit = (data, successCallback, errorCallBack) => _fetchService(`storeItem/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const StoreItemDelete = (data, successCallback, errorCallBack) => _fetchService(`storeItem/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const GetMainLocation = (successCallback, errorCallBack) => _fetchService('itemMaster/mainLocation', 'GET', {}, successCallback, errorCallBack);
export const GetSubLocation = (successCallback, errorCallBack) => _fetchService('itemMaster/subLocation', 'GET', {}, successCallback, errorCallBack);
export const GetProductFinish = (successCallback, errorCallBack) => _fetchService('itemMaster/productFinish', 'GET', {}, successCallback, errorCallBack);
export const GetProductFamily = (successCallback, errorCallBack) => _fetchService('itemMaster/productFamily', 'GET', {}, successCallback, errorCallBack);
export const GetHSNCode = (successCallback, errorCallBack) => _fetchService('itemMaster/hsnCode', 'GET', {}, successCallback, errorCallBack);
export const GetUnderLedger = (successCallback, errorCallBack) => _fetchService('itemMaster/underLedger', 'GET', {}, successCallback, errorCallBack);

export const GetItemGroup = (successCallback, errorCallBack) => _fetchService('master/itemGroup', 'GET', {}, successCallback, errorCallBack);
export const GetUOM = (successCallback, errorCallBack) => _fetchService('master/uom', 'GET', {}, successCallback, errorCallBack);
export const GetProcessmachineList = (successCallback, errorCallBack) => _fetchService('addtool/getMachineProcessMap/show', 'GET', {}, successCallback, errorCallBack);
export const NewGenerateTool = (data, successCallback, errorCallBack) => _fetchService('addtool/generateToolCount/generate', 'POST', data, successCallback, errorCallBack);

///ToolImportMapping////
export const ToolImportExlImport = (data, successCallback, errorCallBack) => _fetchService(`addtool/importToolsExcel/getimport `, 'POST', data, successCallback, errorCallBack);

export const ToolImportStroreService = (data, successCallback, errorCallBack) => _fetchService(`addtool/storeValidatedTools/store`, 'POST', data, successCallback, errorCallBack);

export const ToolMappingFetchId = (data, successCallback, errorCallBack) => _fetchService(`addtool/toolTree/tree?id=${data?.id}`, 'GET', {}, successCallback, errorCallBack);

export const ToolItemsShow = (data, successCallback, errorCallBack) => _fetchService(`addtool/toolitemcode?show=${data?.text}`, 'GET', {}, successCallback, errorCallBack);

export const ToolMappingDeleteD = (data, successCallback, errorCallBack) => _fetchService(`addtool/deleteToolMapping/${data.deleteId}`, 'DELETE', data, successCallback, errorCallBack);

export const ToolMappingForwardReverseId = (data, successCallback, errorCallBack) => _fetchService(`addtool/getToolList?type=${data?.type}&id=${data?.id}`, 'GET', {}, successCallback, errorCallBack);

export const UpdateToolMappingEntry = (data, successCallback, errorCallBack) => _fetchService(`addtool/updateMappedTool`, 'PUT', data, successCallback, errorCallBack);

export const ToolMappingDetailsView = (successCallback, errorCallBack) => _fetchService(`addtool/getToolDetails`, 'GET', {}, successCallback, errorCallBack);

export const ToolGrindingTimeService = (data, successCallback, errorCallBack) => _fetchService(`toolComplaint/updateGrindingTime/grind`, 'POST', data, successCallback, errorCallBack);


//SHIFT MASTER
export const AddShiftMaster = (data, successCallback, errorCallBack) => _fetchService('shiftMaster', 'POST', data, successCallback, errorCallBack);
export const ShowShiftMaster = (successCallback, errorCallBack) => _fetchService('shiftMaster', 'GET', {}, successCallback, errorCallBack);
export const ShiftEdit = (data, successCallback, errorCallBack) => _fetchService(`shiftMaster/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const ShiftDelete = (data, successCallback, errorCallBack) => _fetchService(`shiftMaster/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

//MACHINE OPERATOR
export const AddMachineOperator = (data, successCallback, errorCallBack) => _fetchService('machineOperator', 'POST', data, successCallback, errorCallBack);
export const ShowMachineOperator = (successCallback, errorCallBack) => _fetchService('machineOperator', 'GET', {}, successCallback, errorCallBack);
export const MachineOperatorEdit = (data, successCallback, errorCallBack) => _fetchService(`machineOperator/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const MachineOperatorDelete = (data, successCallback, errorCallBack) => _fetchService(`machineOperator/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

// PROCESS VS UOM
export const AddProcessVsUOM = (data, successCallback, errorCallBack) => _fetchService('pmVsUom', 'POST', data, successCallback, errorCallBack);
export const ShowProcessVsUOM = (successCallback, errorCallBack) => _fetchService('pmVsUom', 'GET', {}, successCallback, errorCallBack);
export const ProcessVsUOMEdit = (data, successCallback, errorCallBack) => _fetchService(`pmVsUom/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const ProcessVsUOMDelete = (data, successCallback, errorCallBack) => _fetchService(`pmVsUom/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

//ITEM VS PROCESS
export const GetItemVsProcessItem = (successCallback, errorCallBack) => _fetchService('itemVsPm/getItem', 'GET', {}, successCallback, errorCallBack);

export const GetItemVsProcessProcessList = (data, successCallback, errorCallBack) => _fetchService('itemVsPm/getPmMach', 'POST', data, successCallback, errorCallBack);
export const GetAllocatedItemVsProcessView = (data, successCallback, errorCallBack) => _fetchService(`itemVsPm/showData/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetAllAllocatedItemVsProcess = (successCallback, errorCallBack) => _fetchService('itemVsPm/showData', 'GET', {}, successCallback, errorCallBack);
export const AddItemVsProcess = (data, successCallback, errorCallBack) => _fetchService('itemVsPm', 'POST', data, successCallback, errorCallBack);
export const ItemVsProcessXLUpload = (data, successCallback, errorCallBack) => _fetchService('itmVsPmExl/import', 'POST', data, successCallback, errorCallBack);
export const ItemVsProcessCopyFromXLUpload = (data, successCallback, errorCallBack) => _fetchService('itmVsPmExl/copy', 'POST', data, successCallback, errorCallBack);
export const MachineDeselectXLUpload = (data, successCallback, errorCallBack) => _fetchService('itmVsPmExl/deSelect', 'POST', data, successCallback, errorCallBack);
export const GetMachinePartNoList = (data, successCallback, errorCallBack) => _fetchService(`itemVsPm/showItems/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const editAllocatedItemVsProcess = (data, successCallback, errorCallBack) => _fetchService(`itemVsPm/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const ItemVsPmSearch = (data, successCallback, errorCallBack) => _fetchService(`itemVsPm/search?q=${data?.text}`, 'GET', data, successCallback, errorCallBack);
export const ProcessInspecSearchMachine = (data, successCallback, errorCallBack) => _fetchService(`processInspec/searchMachine?q=${data?.text}`, 'GET', data, successCallback, errorCallBack);
export const ProcessInspecGetMachine = (successCallback, errorCallBack) => _fetchService(`processInspec/getMachine`, 'GET', {}, successCallback, errorCallBack);
export const handleProcessDeselect = (data, successCallback, errorCallBack) => _fetchService('itemVsPm/deSelect', 'POST', data, successCallback, errorCallBack);

////Part Process vs Inspection Copy From///

export const PartVsInspectionCopyFromXLUpload = (data, successCallback, errorCallBack) => _fetchService('qltyExl/copy', 'POST', data, successCallback, errorCallBack);

//TESTING 
// export const GetSearchedItems = (data, successCallback, errorCallBack) => _fetchService('itemVsPm/getItem2', 'POST', data, successCallback, errorCallBack);
export const GetAllocatedItems = (data, successCallback, errorCallBack) => _fetchService(`itemVsPm/search?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const GetSearchedItems = (data, successCallback, errorCallBack) => _fetchService(`item/search?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const GetSearchedToolItems = (data, successCallback, errorCallBack) => _fetchService(`itemVsPm/getTool?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);


//SUPPLIER VS ITEM
export const GetSuppVsItemSuppList = (successCallback, errorCallBack) => _fetchService('suppVsItem/getSupp', 'GET', {}, successCallback, errorCallBack); //OLD DONT REFER THIS
export const GetSuppVsItemAllSuppList = (data, successCallback, errorCallBack) => _fetchService(`suppVsItem/search?q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);
export const GetSuppVsItemSuppItemList = (data, successCallback, errorCallBack) => _fetchService(`suppVsItem/getSuppItm/${data.id}?page=${data?.page}`, 'POST', data, successCallback, errorCallBack);
export const GetSuppVsItemSuppItemListWithCode = (data, successCallback, errorCallBack) => _fetchService(`suppVsItem/getSuppItm?page=${data?.page}`, 'POST', data, successCallback, errorCallBack);
export const SearchSuppVsItemSuppItemListWithCode = (data, successCallback, errorCallBack) => _fetchService(`suppVsItem/searchIetm?q=${data.code}`, 'POST', data, successCallback, errorCallBack);
export const SupplierVsItemXLUpload = (data, successCallback, errorCallBack) => _fetchService('suppVsItmExl/import', 'POST', data, successCallback, errorCallBack);
export const SupplierVsItemEditCell = (data, successCallback, errorCallBack) => _fetchService(`suppVsItem/update`, 'POST', data, successCallback, errorCallBack);
export const SupplierVsItemDelete = (data, successCallback, errorCallBack) => _fetchService(`suppVsItem/deleteAll/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const SupplierVsItemDeleteRow = (data, successCallback, errorCallBack) => _fetchService(`suppVsItem/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const GetSuppVsItemCopyFromAction = (data, successCallback, errorCallBack) => _fetchService('suppVsItem/copyData', 'POST', data, successCallback, errorCallBack);
export const AddSupplierVsItem = (data, successCallback, errorCallBack) => _fetchService('suppVsItem', 'POST', data, successCallback, errorCallBack);
export const SupplierVsItemXLSaveData = (data, successCallback, errorCallBack) => _fetchService('suppVsItmExl/saveData', 'POST', data, successCallback, errorCallBack);


//PURCHASE ORDER API INTEGRATION
export const GetPOUniqueID = (data, successCallback, errorCallBack) => _fetchService('poGenerate/uniqueId', 'POST', data, successCallback, errorCallBack);
export const GetPOSupplierList = (successCallback, errorCallBack) => _fetchService('suppVsItem/getSupp', 'GET', {}, successCallback, errorCallBack);
export const GetPOSupplierItemList = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/getSuppItm/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GeneratePO = (data, successCallback, errorCallBack) => _fetchService('poGenerate', 'POST', data, successCallback, errorCallBack);
export const EditGeneratedPO = (data, successCallback, errorCallBack) => _fetchService('poGenerate', 'PUT', data, successCallback, errorCallBack);
export const UpdateAmendAndDeauth = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/updateOpt?type=${data[0].type}`, 'PUT', data, successCallback, errorCallBack);
export const PurchaseOrderXLUpload = (data, successCallback, errorCallBack) => _fetchService('poGenerate/poImport', 'POST', data, successCallback, errorCallBack);
export const GetItemPendingPoLists = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/pendPoDtl/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetSupplierRateLists = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/getSupRates/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetLocationStock = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/getLocQoh/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetPendingJWIQuantity = (data, successCallback, errorCallBack) => _fetchService(`jobWork-issue/pendingJobWork?itemId=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetFieldSuggetions = (successCallback, errorCallBack) => _fetchService('poGenerate/getSuggeation', 'GET', {}, successCallback, errorCallBack);
export const updatePoMaxLevel = (data, successCallback, errorCallBack) => _fetchService('poGenerate/checkMax', 'POST', data, successCallback, errorCallBack);
export const GetPendingDcItems = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/pendingJW?supplierId=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const deleteGeneratedPO = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/${data.id.id}?prefix=${data.id.prefix}`, 'DELETE', data, successCallback, errorCallBack);
export const deleteAmendment = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/delete/item/${data.id.id}?prefix=${data.id.prefix}`, 'DELETE', data, successCallback, errorCallBack);

// NEW API
export const GetPoItemLists = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/suppItems/${data.supId}?q=${data.code}&type=${data.type}`, 'GET', {}, successCallback, errorCallBack);
export const ChangeSupplierAfterEntry = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/get/updateSuppItems/${data.id}`, 'POST', data, successCallback, errorCallBack);
export const GetPoBillAllSuppList = (data, successCallback, errorCallBack) => _fetchService(`poBill/poSupplier2?type=${data.type}&q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);
export const GetGeneratedPo = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/searcPo?type=${data?.type}&q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);
export const PurchaseOrderPreview = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/getItems?type=${data.type}&id=${data.id}&prefix=${data.prefix}`, 'GET', {}, successCallback, errorCallBack);


//PURCHASE OERDER VIEW
export const POGenerateServices = (successCallback, errorCallBack) => _fetchService('poGenerate', 'GET', {}, successCallback, errorCallBack);
export const GetPurchaseOrderInvoiceData = (data, successCallback, errorCallBack) => _fetchService('poGenerate/invoice', 'POST', data, successCallback, errorCallBack);
export const ViewPurchaseOrderBill = (data, successCallback, errorCallBack) => _fetchService('poGenerate/poBill', 'POST', data, successCallback, errorCallBack);

//FORECAST ENTRY MODULE
export const GetForeCastUniqueID = (successCallback, errorCallBack) => _fetchService('poFC/uniqueId', 'GET', {}, successCallback, errorCallBack);
export const GetSearchedFcSupplier = (data, successCallback, errorCallBack) => _fetchService(`poFC/searchSup?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const GetFcSupplierItemList = (data, successCallback, errorCallBack) => _fetchService(`poFC/getItems/${data.id}`, 'POST', data, successCallback, errorCallBack);
export const GenerateForeCast = (data, successCallback, errorCallBack) => _fetchService('poFC', 'POST', data, successCallback, errorCallBack);
export const ShowForeCastEntry = (successCallback, errorCallBack) => _fetchService('poFC', 'GET', {}, successCallback, errorCallBack);
export const PreviewForeCastEntry = (data, successCallback, errorCallBack) => _fetchService('poFC/viewDtl', 'POST', data, successCallback, errorCallBack);
export const UpdateForeCast = (data, successCallback, errorCallBack) => _fetchService('poFC', 'PUT', data, successCallback, errorCallBack);
export const DeleteForeCast = (data, successCallback, errorCallBack) => _fetchService(`poFC/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const ForecastPreview = (data, successCallback, errorCallBack) => _fetchService(`poFC/getPoItems?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);

// Price Revision History Report
export const GetPriceRevision = (successCallback, errorCallBack) => _fetchService('suppVsItem/getSupp', 'GET', {}, successCallback, errorCallBack);
export const GetPriceRevisionData = (data, successCallback, errorCallBack) => _fetchService(`suppVsItem/getPriceRevision`, 'POST', data, successCallback, errorCallBack);
export const GetSuppAllAddress = (data, successCallback, errorCallBack) => _fetchService('poGenerate/getAddress', 'POST', data, successCallback, errorCallBack);

//Purchase bill againt Po API
export const GetPOBillUniqueID = (data, successCallback, errorCallBack) => _fetchService('poBill/uniqueId', 'POST', data, successCallback, errorCallBack);
export const GetSupplierPendingPo = (data, successCallback, errorCallBack) => _fetchService('poBill/getPoSuppItm', 'POST', data, successCallback, errorCallBack);
export const GetSupplierPendingDC = (data, successCallback, errorCallBack) => _fetchService('poBill/getPoJcSuppItm', 'POST', data, successCallback, errorCallBack);
export const GetPurchaseBillSuppList = (successCallback, errorCallBack) => _fetchService('poBill/poSupplier', 'GET', {}, successCallback, errorCallBack);
export const GetPurchaseBillSuppListItemList = (data, successCallback, errorCallBack) => _fetchService('poBill/getPoSuppItm', 'POST', data, successCallback, errorCallBack);
// export const GetPurchaseBillSuppList = (successCallback, errorCallBack) => _fetchService('poBill/poSupplier', 'GET', {}, successCallback, errorCallBack);
// export const GetPurchaseBillSuppListItemList = (data, successCallback, errorCallBack) => _fetchService(`poBill/getPoSuppItm/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const PurchaseBillFormSubmit = (data, successCallback, errorCallBack) => _fetchService('poBill', 'POST', data, successCallback, errorCallBack);
export const getPurchaseBillDetails = (data, successCallback, errorCallBack) => _fetchService('poBill/poSupplier', 'POST', data, successCallback, errorCallBack);
export const genarateGrnNumber = (successCallback, errorCallBack) => _fetchService('poBill/grn', 'GET', {}, successCallback, errorCallBack);
export const PurchaseBillPreview = (data, successCallback, errorCallBack) => _fetchService('poGenerate/poBillDtl', 'POST', data, successCallback, errorCallBack);
export const PurchaseBillResultShowData = (successCallback, errorCallBack) => _fetchService('poBill', 'GET', {}, successCallback, errorCallBack);
export const PurchaseBillDataPreview = (data, successCallback, errorCallBack) => _fetchService('poBill/viewDtl', 'POST', data, successCallback, errorCallBack);
export const DeletePurchaseBillAgainstPO = (data, successCallback, errorCallBack) => _fetchService(`poBill/${data.id.id}?prefix=${data.id.prefix}`, 'DELETE', data, successCallback, errorCallBack);
export const UpdatePurchaseBillAgainstPO = (data, successCallback, errorCallBack) => _fetchService('poBill', 'PUT', data, successCallback, errorCallBack);
export const PurchaseBillAgainstPoPreview = (data, successCallback, errorCallBack) => _fetchService(`poBill/getItems?type=${data.type}&id=${data.id}&prefix=${data.prefix}`, 'GET', {}, successCallback, errorCallBack);
export const CheckValidSuppInvNo = (data, successCallback, errorCallBack) => _fetchService(`poBill/checkInv/${data?.supplierSid}?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const handleCheckPoFreight = (data, successCallback, errorCallBack) => _fetchService(`poBill/checkFright`, 'POST', data, successCallback, errorCallBack);
export const QualityInwardReportShow = (data, successCallback, errorCallBack) => _fetchService('inwardQc/showType', 'POST', data, successCallback, errorCallBack);
export const QualityInwardWithoutReportShow = (data, successCallback, errorCallBack) => _fetchService('inwardQc/withoutPo/showType', 'POST', data, successCallback, errorCallBack);
// TEMPLATE
export const PurchaseBillXLUpload = (data, successCallback, errorCallBack) => _fetchService('poBill/import', 'POST', data, successCallback, errorCallBack);
export const QcInwardFileUpload = (data, successCallback, errorCallBack) => _fetchService(`inwardQc/qcFileUpload/${data.id}`, 'POST', data, successCallback, errorCallBack);
export const QcInwardApproveSubmit = (data, successCallback, errorCallBack) => _fetchService('inwardQc/submit', 'POST', data, successCallback, errorCallBack);
export const QcInwardWithoutPoApproveSubmit = (data, successCallback, errorCallBack) => _fetchService('inwardQc/withoutPo/submit', 'POST', data, successCallback, errorCallBack);
export const QualityInwardQcUniqueId = (successCallback, errorCallBack) => _fetchService('inwardQc/uniqueId', 'GET', {}, successCallback, errorCallBack);
export const QualityInwardWithoutQcUniqueId = (successCallback, errorCallBack) => _fetchService('inwardQc/withoutPo/uniqueId', 'GET', {}, successCallback, errorCallBack);

// PURCHASE BILL WITHOUT PO
export const GetWithoutPOBillUniqueID = (data, successCallback, errorCallBack) => _fetchService('poBillWithOutPo/uniqueId', 'POST', data, successCallback, errorCallBack);
export const GetWithoutPoSuppList = (data, successCallback, errorCallBack) => _fetchService(`poBillWithOutPo/searchSup?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const GetWithoutPoItemLists = (data, successCallback, errorCallBack) => _fetchService(`poBillWithOutPo/searchItm/?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const PurchaseBillWithoutPoFormSubmit = (data, successCallback, errorCallBack) => _fetchService('poBillWithOutPo', 'POST', data, successCallback, errorCallBack);
export const GenarateWithoutPoGrnNumber = (successCallback, errorCallBack) => _fetchService('poBillWithOutPo/grn', 'GET', {}, successCallback, errorCallBack);
export const ViewWithoutPoList = (successCallback, errorCallBack) => _fetchService(`poBillWithOutPo`, 'GET', {}, successCallback, errorCallBack);
export const PurchaseBillWithoutPOPreview = (data, successCallback, errorCallBack) => _fetchService('poBillWithOutPo/viewDtl', 'POST', data, successCallback, errorCallBack);
export const DeletePurchaseBillWithoutPO = (data, successCallback, errorCallBack) => _fetchService(`poBillWithOutPo/${data.id.id}?prefix=${data.id.prefix}`, 'DELETE', data, successCallback, errorCallBack);
export const UpdatePurchaseBillWithoutPO = (data, successCallback, errorCallBack) => _fetchService('poBillWithOutPo', 'PUT', data, successCallback, errorCallBack);
export const PurchaseBillWithoutPoPreview = (data, successCallback, errorCallBack) => _fetchService(`poBillWithOutPo/getPoItems?type=${data.type}&id=${data.id}&prefix=${data.prefix}`, 'GET', {}, successCallback, errorCallBack);
// TEMPLATE
export const PurchaseBillWithoutPOXLUpload = (data, successCallback, errorCallBack) => _fetchService('poBillWithOutPo/import', 'POST', data, successCallback, errorCallBack);

//MENU TYPE MASTER
export const AddGroupMaster = (data, successCallback, errorCallBack) => _fetchService('menuTypeMst', 'POST', data, successCallback, errorCallBack);
export const ShowGroupMaster = (successCallback, errorCallBack) => _fetchService('menuTypeMst', 'GET', {}, successCallback, errorCallBack);
export const GroupMasterEdit = (data, successCallback, errorCallBack) => _fetchService(`menuTypeMst/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const GroupMasterDelete = (data, successCallback, errorCallBack) => _fetchService(`menuTypeMst/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

//CREATE ADD GROUP
export const CreateGroup = (data, successCallback, errorCallBack) => _fetchService('groupMst ', 'POST', data, successCallback, errorCallBack);
export const ShowCreatedGroup = (successCallback, errorCallBack) => _fetchService('groupMst', 'GET', {}, successCallback, errorCallBack);
export const EditCreatedGroup = (data, successCallback, errorCallBack) => _fetchService(`groupMst/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const DeleteCreatedGroup = (data, successCallback, errorCallBack) => _fetchService(`groupMst/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
// --
export const GetGroupMenu = (data, successCallback, errorCallBack) => _fetchService('groupRight/getPermissions', 'POST', data, successCallback, errorCallBack);
export const GroupRight = (data, successCallback, errorCallBack) => _fetchService(`groupRight/${data.menuTypeMstId}`, 'PUT', data, successCallback, errorCallBack);
//USER assign
export const GroupUserAssign = (data, successCallback, errorCallBack) => _fetchService(`groupMst/userAssign/${data.groupId}`, 'POST', data, successCallback, errorCallBack);
export const ShowGroupUser = (data, successCallback, errorCallBack) => _fetchService(`groupMst/userShow/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GroupUserDelete = (data, successCallback, errorCallBack) => _fetchService(`groupMst/userAssign/${data.id}`, 'PUT', data, successCallback, errorCallBack);

// MATERIAL ALLOCATION
export const GetMaterialAllocation = (successCallback, errorCallBack) => _fetchService('allocation/mrp', 'GET', {}, successCallback, errorCallBack);
export const GetAllocationRowData = (data, successCallback, errorCallBack) => _fetchService(`allocation/jc/${data.id}?page=${data.page}`, 'GET', {}, successCallback, errorCallBack);

//MATERIAL ALLOCATION MODE
export const GetAllocationMode = (successCallback, errorCallBack) => _fetchService('allocation/mode', 'GET', {}, successCallback, errorCallBack);
export const UpdateAllocationMode = (data, successCallback, errorCallBack) => _fetchService('allocation/mode', 'PUT', data, successCallback, errorCallBack);
export const MaterialAllocate = (data, successCallback, errorCallBack) => _fetchService(`allocation/update/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const AllocateAutomatically = (data, successCallback, errorCallBack) => _fetchService(`allocation/automatic/${data.id}`, 'PUT', {}, successCallback, errorCallBack);

//BOI INDENT REPORT
export const GetBOIIndentReport = (data, successCallback, errorCallBack) => _fetchService(`boi?supplierId=${data.spId}&page=${data.page}`, 'GET', {}, successCallback, errorCallBack);
export const SearchBoiSupplier = (data, successCallback, errorCallBack) => _fetchService(`boi/suppliers?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const GetBoiPurchaseItemList = (data, successCallback, errorCallBack) => _fetchService('boi/spAndItemList', 'POST', data, successCallback, errorCallBack);

//MATERIAL ISSUE
export const GetMaterialIssue = (successCallback, errorCallBack) => _fetchService('materialIssue', 'GET', {}, successCallback, errorCallBack);
export const GetMaterialIssueRowData = (data, successCallback, errorCallBack) => _fetchService(`materialIssue/${data.id}`, 'POST', data, successCallback, errorCallBack);
export const GetMaterialGrnNo = (data, successCallback, errorCallBack) => _fetchService(`grn?itemCode=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GRNIssue = (data, successCallback, errorCallBack) => _fetchService('grn/issue', 'POST', data, successCallback, errorCallBack);
export const MaterialIssueAutomatic = (data, successCallback, errorCallBack) => _fetchService(`grn/issue-automatic`, 'POST', data, successCallback, errorCallBack);
export const MaterialIssueReverse = (data, successCallback, errorCallBack) => _fetchService(`materialIssue/view?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);


//SFG VARIFICATION
export const GetSFGVerificationOuterData = (successCallback, errorCallBack) => _fetchService('sfgVerification', 'GET', {}, successCallback, errorCallBack);
export const GetSFGVerificationInnerData = (data, successCallback, errorCallBack) => _fetchService(`sfgVerification`, 'POST', data, successCallback, errorCallBack);
export const UpdateSFGVerificationInnerData = (data, successCallback, errorCallBack) => _fetchService('sfgVerification/update', 'PUT', data, successCallback, errorCallBack);
export const GetSFGFilterLocation = (successCallback, errorCallBack) => _fetchService('itemMaster/mainLocation', 'GET', {}, successCallback, errorCallBack);
export const SfgAutoToggleUpdate = (data, successCallback, errorCallBack) => _fetchService('sfgVerification/updateStatus', 'PUT', data, successCallback, errorCallBack);
export const MoveToFg = (data, successCallback, errorCallBack) => _fetchService(`sfgVerification/moveToFG`, 'POST', data, successCallback, errorCallBack);

//SFG VIEW
export const ViewSfg = (data, successCallback, errorCallBack) => _fetchService('sfgVerification/fetch', 'POST', data, successCallback, errorCallBack);

//SFG VENDOR PROCESS
export const ViewSfgVendorProcess = (data, successCallback, errorCallBack) => _fetchService(`sfgVerification/vendorProcess?supplierId=${data.spId}`, 'GET', {}, successCallback, errorCallBack);
export const LoadPendingQuarantine = (data, successCallback, errorCallBack) => _fetchService(`jobWork-issue/quarantineStock?supplierId=${data.spId}`, 'GET', {}, successCallback, errorCallBack);
export const GetSfgRefNo = (successCallback, errorCallBack) => _fetchService('delSchedule/sfgRefNo', 'GET', {}, successCallback, errorCallBack);
export const SfgVendorProcessSubmit = (data, successCallback, errorCallBack) => _fetchService('delSchedule', 'POST', data, successCallback, errorCallBack);
export const SearchVendorProcessVendor = (data, successCallback, errorCallBack) => _fetchService(`boi/suppliers?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

//JOBWORK RECEIPT
export const GetJobWorkReceiptUniqueID = (successCallback, errorCallBack) => _fetchService('jobWork-reciept/uniqueNo', 'GET', {}, successCallback, errorCallBack);
export const LoadPendingJobWorkIssue = (data, successCallback, errorCallBack) => _fetchService(`jobWork-issue/pending?supplierId=${data.spId}`, 'GET', {}, successCallback, errorCallBack);
export const GenerateJobWorkReceipt = (data, successCallback, errorCallBack) => _fetchService('jobWork-reciept/store', 'POST', data, successCallback, errorCallBack);
export const JobWorkReciptUpdate = (data, successCallback, errorCallBack) => _fetchService('jobWork-reciept/update', 'PUT', data, successCallback, errorCallBack);
export const JobWorkReciptDelete = (data, successCallback, errorCallBack) => _fetchService(`jobWork-reciept/delete?jwrId=${data.id}`, 'DELETE', data, successCallback, errorCallBack);

// VIEW SFG VENDOR PROCESS
export const ViewScheduledVendorProcess = (data, successCallback, errorCallBack) => _fetchService('delSchedule/show', 'POST', data, successCallback, errorCallBack);

//STORE-JOBWORK ISSUE NOTE
export const JobWorkDelete = (data, successCallback, errorCallBack) => _fetchService(`jobWork-issue/delete?delScheduleId=${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const GetJobWorkIssueUniqueID = (successCallback, errorCallBack) => _fetchService('jobWork-issue/dcNo', 'GET', {}, successCallback, errorCallBack);
export const GetJobWorkIssueDCCopy = (data, successCallback, errorCallBack) => _fetchService(`jobWork-issue/itemsList?jobWorkId=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetJobWorkIssueDCJson = (data, successCallback, errorCallBack) => _fetchService(`jobWork-issue/json?jobWorkId=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const ViewGeneratedJobWorkIssue = (successCallback, errorCallBack) => _fetchService('jobWork-issue', 'GET', {}, successCallback, errorCallBack);
export const GetJobWorkIssueSupplierItemList = (data, successCallback, errorCallBack) => _fetchService(`jobWork-issue/items?supplierId=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GenerateJobWorkIssueDC = (data, successCallback, errorCallBack) => _fetchService('jobWork-issue', 'POST', data, successCallback, errorCallBack);
export const UpdateJobWorkIssueDC = (data, successCallback, errorCallBack) => _fetchService('jobWork-issue/update', 'PUT', data, successCallback, errorCallBack);
//NEW CODE
export const GetGeneratedJWRecipt = (data, successCallback, errorCallBack) => _fetchService(`jobWork-reciept/search?q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);
export const GetDelNoteDetails = (data, successCallback, errorCallBack) => _fetchService(`delSchedule/jobWork?delscheduleId=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetDelNoteForwardReverse = (data, successCallback, errorCallBack) => _fetchService(`delSchedule/jobWork?delscheduleId=${data.id}&type=${data.type}`, 'GET', {}, successCallback, errorCallBack);
export const GetGeneratedJW = (data, successCallback, errorCallBack) => _fetchService(`delSchedule/dcNo?q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);
export const GetRemarksLists = (data, successCallback, errorCallBack) => _fetchService(`jobWork-issue/serachRemarks?type=JobWork&q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);
export const GetJobWorkIssueItemLists = (data, successCallback, errorCallBack) => _fetchService(`jobWork-issue/searchItem?supplierId=${data.supId}&itemCode=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const GetJobWorkIssueItemDetails = (data, successCallback, errorCallBack) => _fetchService(`jobWork-issue/getItemDetails?supplierId=${data.supplierId}&itemId=${data.itemId}`, 'GET', {}, successCallback, errorCallBack);
export const GetJobWorkIssueReport = (data, successCallback, errorCallBack) => _fetchService(`jobWork-issue/viewReport`, 'POST', data, successCallback, errorCallBack);
///Meterail Issue Note Report//

export const MeterialIssueNoteReportList = (data, successCallback, errorCallBack) => _fetchService(`report/getMaterialIssueReport`, 'POST', data, successCallback, errorCallBack);

/////////////Indent Report ////////////
export const IndentReportList = (data, successCallback, errorCallBack) => _fetchService(`materialIssue/indentReport?fromDate=${data?.fromDate}&toDate=${data?.toDate}&page=${data?.page}&itemCode=${data?.itemCode}`, 'GET', {}, successCallback, errorCallBack);

//VENDOR DEL NOTE
export const GetVendorDelNote = (successCallback, errorCallBack) => _fetchService('delSchedule/details', 'GET', {}, successCallback, errorCallBack);
export const UpdateVendorQuantity = (data, successCallback, errorCallBack) => _fetchService('delSchedule/update', 'POST', data, successCallback, errorCallBack);
export const GetDeliveryHistoryNote = (data, successCallback, errorCallBack) => _fetchService(`delSchedule/history?delscheduleId=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetDelNoteChildDetails = (data, successCallback, errorCallBack) => _fetchService(`delSchedule/items?delscheduleId=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const UploadReceivedQuantity = (data, successCallback, errorCallBack) => _fetchService('delSchedule/import', 'POST', data, successCallback, errorCallBack);

//Quality  
export const QualityProcess = (successCallback, errorCallBack) => _fetchService('master/pm', 'GET', {}, successCallback, errorCallBack);
export const QcFieldSubmit = (data, successCallback, errorCallBack) => _fetchService('qltyTemp', 'POST', data, successCallback, errorCallBack);
export const QualityTemplate = (successCallback, errorCallBack) => _fetchService('qltyTemp', 'GET', {}, successCallback, errorCallBack);
export const QualityTemplateEdit = (data, successCallback, errorCallBack) => _fetchService(`qltyTemp/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const Qualityuom = (successCallback, errorCallBack) => _fetchService('master/uom', 'GET', {}, successCallback, errorCallBack);
export const AddNewQcField = (data, successCallback, errorCallBack) => _fetchService('qltyTemp/qc', 'POST', data, successCallback, errorCallBack);
export const ShowTemplateQcField = (data, successCallback, errorCallBack) => _fetchService(`qltyTemp/qc/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const TemplateEdit = (data, successCallback, errorCallBack) => _fetchService(`qltyTemp/qc/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const Itemno = (data, successCallback, errorCallBack) => _fetchService('itmPmVsInspec/getProcess ', 'POST', data, successCallback, errorCallBack);
export const SelectProcess = (data, successCallback, errorCallBack) => _fetchService('itmPmVsInspec/getQcList ', 'POST', data, successCallback, errorCallBack);
export const EditProcess = (data, successCallback, errorCallBack) => _fetchService('itmPmVsInspec', 'POST', data, successCallback, errorCallBack);
export const GetRejectedItems = (data, successCallback, errorCallBack) => _fetchService(`processInspec/rejected?from=${data.from}&to=${data.to}`, 'GET', {}, successCallback, errorCallBack);
export const GetInwardRejectedItems = (data, successCallback, errorCallBack) => _fetchService(`inwardQc/rejected`, 'POST', data, successCallback, errorCallBack);
//newdeveloper10//
export const InwardItemnoshow = (data, successCallback, errorCallBack) => _fetchService(`inwardQc/processList/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const AssemblyItemnoshow = (data, successCallback, errorCallBack) => _fetchService(`itmPmVsInspec/processList/${data.id}`, 'GET', {}, successCallback, errorCallBack);


// ASSEMBLY INSPECTION
export const GetAssemblyDateChange = (data, successCallback, errorCallBack) => _fetchService('qltyAssembly/getKanaban', 'POST', data, successCallback, errorCallBack);
export const GetAssemblyContractNo = (data, successCallback, errorCallBack) => _fetchService(`qltyAssembly/searchContracts?q=${data.code}`, 'POST', data, successCallback, errorCallBack);
export const GetAssemblyTableData = (data, successCallback, errorCallBack) => _fetchService(`qltyAssembly/showData/${data.id}`, 'POST', data, successCallback, errorCallBack);
export const GetAssemblyPlanInspection = (data, successCallback, errorCallBack) => _fetchService(`qltyAssembly/assemblyPlan`, 'POST', data, successCallback, errorCallBack);
export const GetFpiAssemblyInspectionData = (data, successCallback, errorCallBack) => _fetchService('qltyAssembly/showType', 'POST', data, successCallback, errorCallBack);
export const GetContractAssemblyPlanInspectionData = (data, successCallback, errorCallBack) => _fetchService('qltyAssembly/assemblyPlan/showType', 'POST', data, successCallback, errorCallBack);
export const AssemblyInspecUniqueId = (successCallback, errorCallBack) => _fetchService('qltyAssembly/uniqueId', 'GET', {}, successCallback, errorCallBack);
export const AssemblyInspecSubmit = (data, successCallback, errorCallBack) => _fetchService('qltyAssembly/submit', 'POST', data, successCallback, errorCallBack);
export const AssemblyPlanInspecSubmit = (data, successCallback, errorCallBack) => _fetchService('qltyAssembly/assemblyPlan/submit', 'POST', data, successCallback, errorCallBack);
export const AssemblyInspecReport = (data, successCallback, errorCallBack) => _fetchService('qltyAssembly/report', 'POST', data, successCallback, errorCallBack);
export const AssemblyInspecReportInsideData = (data, successCallback, errorCallBack) => _fetchService(`qltyAssembly/reportView/${data?.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetAssemblyRejectedItems = (data, successCallback, errorCallBack) => _fetchService(`qltyAssembly/rejected?fromDate=${data.fromDate}&toDate=${data.toDate}`, 'GET', {}, successCallback, errorCallBack);

// MACHINE PLANNING
export const GetPlanningMachine = (successCallback, errorCallBack) => _fetchService('machine/show', 'GET', {}, successCallback, errorCallBack);
// export const GetMRPPlanningMachine =(data, successCallback, errorCallBack) => _fetchService(`mrp/machinePlanReport?mrpMstId=${data?.id}`, 'GET', {}, successCallback, errorCallBack);
export const ShowMachinePlanning = (data, successCallback, errorCallBack) => _fetchService('schedule', 'POST', data, successCallback, errorCallBack);
export const GetMachinePlanningShifts = (data, successCallback, errorCallBack) => _fetchService('schedule/machine', 'POST', data, successCallback, errorCallBack);

//ASSEMBLY PLANNING
export const GetAssemblyPlanningFIM = (successCallback, errorCallBack) => _fetchService('planning/fim', 'GET', {}, successCallback, errorCallBack);
export const ShowAssemblyPlanning = (data, successCallback, errorCallBack) => _fetchService('planning/assemblyShow', 'POST', data, successCallback, errorCallBack);
export const UpdateAssemblyPlanning = (data, successCallback, errorCallBack) => _fetchService('planning/assemblystore', 'POST', data, successCallback, errorCallBack);

export const ShipmentDatePlanning = (data, successCallback, errorCallBack) => _fetchService(`planning/assemblyFim?shipmentDate=${data.shipmentDate}&fim=${data.fim}&type=view`, 'GET', {}, successCallback, errorCallBack);


//GANTT CHART SERVICES
export const GetGanttChartData = (data, successCallback, errorCallBack) => _fetchService('gantt-chart', 'POST', data, successCallback, errorCallBack);

//STORES REQUEST NOTE
export const GetStoresRequestNoteUniqueID = (successCallback, errorCallBack) => _fetchService('srn/uniqueNumber', 'GET', {}, successCallback, errorCallBack);
export const SearchSRNItemLists = (data, successCallback, errorCallBack) => _fetchService(`srn/items?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const UploadStoreRequestNote = (data, successCallback, errorCallBack) => _fetchService('srn', 'POST', data, successCallback, errorCallBack);
export const UpdateStoredrequestEdit = (data, successCallback, errorCallBack) => _fetchService(`srn/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const StoreRequestNotePreview = (data, successCallback, errorCallBack) => _fetchService(`srn/display?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const SupervisorStoreRequestNote = (data, successCallback, errorCallBack) => _fetchService(`supervisorJc/viewSrnDoc?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const ImportStoreRequestData = (data, successCallback, errorCallBack) => _fetchService('srn/import', 'POST', data, successCallback, errorCallBack);
export const PreviewStoreRequestNote = (data, successCallback, errorCallBack) => _fetchService(`srn/getData/${data.id}`, 'GET', data, successCallback, errorCallBack);
export const SearchSRNNOItemShow = (data, successCallback, errorCallBack) => _fetchService(`srn/getSrnByType/${data.code}`, 'GET', {}, successCallback, errorCallBack);

//ASSEMBLY STORE REQUEST NOTE
export const UploadXlStoreRequestNote = (data, successCallback, errorCallBack) => _fetchService('srn/assembly', 'POST', data, successCallback, errorCallBack);


/////------------------------------Accounting----------------------------------/////

export const AssemblyMachines = (successCallback, errorCallBack) => _fetchService(`assembly/machines`, 'GET', {}, successCallback, errorCallBack);

export const Assemblyreasons = (successCallback, errorCallBack) => _fetchService(`assembly/reasons `, 'GET', {}, successCallback, errorCallBack);


//Purchase Order Entry //

export const POEntryShowData = (successCallback, errorCallBack) => _fetchService(`purchase/showpo`, 'GET', {}, successCallback, errorCallBack);

export const POEntryDelete = (data, successCallback, errorCallBack) => _fetchService(`purchase/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const CustomerDropShowdata = (data, successCallback, errorCallBack) => _fetchService(`purchase/showname?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

export const FetchCustomerAddress = (data, successCallback, errorCallBack) => _fetchService(`purchase/adddress/${data.id}`, 'GET', data, successCallback, errorCallBack);

export const POEntryAdd = (data, successCallback, errorCallBack) => _fetchService('purchase', 'POST', data, successCallback, errorCallBack);

export const POEntryUpdate = (data, successCallback, errorCallBack) => _fetchService(`purchase/${data.id}`, 'PUT', data, successCallback, errorCallBack);

// export const POEntryUpdate = (data, successCallback, errorCallBack) => _fetchService(`purchase/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const PoNoAutoGen = (successCallback, errorCallBack) => _fetchService('purchase/uniqueId', 'GET', {}, successCallback, errorCallBack);
export const PoSalesOrderPreview = (data, successCallback, errorCallBack) => _fetchService(`purchase/getItems?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetGeneratePoSaleOrderEntry = (data, successCallback, errorCallBack) => _fetchService(`purchase/searcPo?type=${data?.type}&q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);
export const updatePoRate = (data, successCallback, errorCallBack) => _fetchService('purchase/updateRate', 'POST', data, successCallback, errorCallBack);
export const loadSaleOrderVerfied = (data, successCallback, errorCallBack) => _fetchService('purchase/soVerified/items', 'POST', data, successCallback, errorCallBack);

///VIEW///
export const NRDCImportrequest = (data, successCallback, errorCallBack) => _fetchService(`noCustomerdc/importexceldata/${data.id}`, 'POST', data, successCallback, errorCallBack);

export const PoViewing = (data, successCallback, errorCallBack) => _fetchService(`purchase/showData/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const AppendImport = (data, successCallback, errorCallBack) => _fetchService(`purchase/importexceldata/${data.id}`, 'POST', data, successCallback, errorCallBack);

export const MultiSoImport = (data, successCallback, errorCallBack) => _fetchService(`purchase/importMultiSO`, 'POST', data, successCallback, errorCallBack);

export const PoEntryViewTable = (data, successCallback, errorCallBack) => _fetchService(`purchase/showpobyid/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const PoInvPdf = (data, successCallback, errorCallBack) => _fetchService(`purchase/showPOpdfdata/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const PoEntryExport = (data, successCallback, errorCallBack) => _fetchService(`purchase/exportPo/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const PartNoSelect = (data, successCallback, errorCallBack) => _fetchService(`purchase/itemDtl/${data.id}/${data.id2}`, 'GET', {}, successCallback, errorCallBack);

export const PartNoSelectShow = (data, successCallback, errorCallBack) => _fetchService(`purchase/item/${data.id}?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

export const PoEntryImport = (data, successCallback, errorCallBack) => _fetchService(`purchase/import`, 'POST', data, successCallback, errorCallBack);

export const ChangeAddressShowData = (data, successCallback, errorCallBack) => _fetchService(`purchase/multiAddress/${data.id}`, 'GET', {}, successCallback, errorCallBack);

///Short Close Document

export const shortClseDocument = (data, successCallback, errorCallBack) => _fetchService('shortClose/getData', 'POST', data, successCallback, errorCallBack);

export const shortClosedSave = (data, successCallback, errorCallBack) => _fetchService('shortClose/save', 'POST', data, successCallback, errorCallBack);

///--GST Sales Invoice--///
export const GSTAutoGenPerf = (data, successCallback, errorCallBack) => _fetchService('perfomaInv/unique', 'POST', data, successCallback, errorCallBack);
export const GSTAutoGen = (data, successCallback, errorCallBack) => _fetchService('gstInvoice/unique', 'POST', data, successCallback, errorCallBack);
export const CustomerDropShowInvoice = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/customer?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const GSTInvUpdate = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const GstViewing = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/gstshowinvoice/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const SearchInvoiceViewing = (data, successCallback, errorCallBack) => _fetchService(`perfomaInv/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const GstInvoicePreview = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/getItems?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetGenerateGSTSaleInvoice = (data, successCallback, errorCallBack) => _fetchService(`purchase/searcPo?type=${data?.type}&q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);

///-Perform invoice
export const PerformInvoicePreview = (data, successCallback, errorCallBack) => _fetchService(`perfomaInv/getItems?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const handleAddPerformInvoice = (data, successCallback, errorCallBack) => _fetchService('perfomaInv', 'POST', data, successCallback, errorCallBack);
export const PerformInvoiceXlUpload = (data, successCallback, errorCallBack) => _fetchService('perfomaInv/import', 'POST', data, successCallback, errorCallBack);
export const PerformInvoiceUpdate = (data, successCallback, errorCallBack) => _fetchService(`perfomaInv`, 'PUT', data, successCallback, errorCallBack);
export const PerformInvoiceDelete = (data, successCallback, errorCallBack) => _fetchService(`perfomaInv/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const CustomerDropPerformInvoice = (data, successCallback, errorCallBack) => _fetchService(`purchase/showname?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

// CREDIT NOTE/SALES RETURN
export const SaledReturnAutoGen = (successCallback, errorCallBack) => _fetchService('creditNote/uniqueId', 'GET', data, successCallback, errorCallBack);
export const CreditNoteCustomer = (data, successCallback, errorCallBack) => _fetchService(`creditNote/customer?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const CreditNoteInvoice = (data, successCallback, errorCallBack) => _fetchService(`creditNote/gstInvoices/${data.cId}?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const GetInvoiceItems = (data, successCallback, errorCallBack) => _fetchService(`creditNote/items/${data.id}?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const handleAddCreditNote = (data, successCallback, errorCallBack) => _fetchService('creditNote', 'POST', data, successCallback, errorCallBack);
export const GetGenerateSalesReturn = (data, successCallback, errorCallBack) => _fetchService(`purchase/searcPo?type=${data?.type}&q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);
export const ViewCreditNotes = (data, successCallback, errorCallBack) => _fetchService(`creditNote/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const CreditNotePreview = (data, successCallback, errorCallBack) => _fetchService(`creditNote/getItems?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const LoadGetInvoiceItemsList = (data, successCallback, errorCallBack) => _fetchService(`creditNote/items/${data.id}`, 'GET', {}, successCallback, errorCallBack);

////New Customer DC/////
export const CustomerDcShowData = (successCallback, errorCallBack) => _fetchService(`customerdc`, 'GET', {}, successCallback, errorCallBack);

export const CustomerDCAdd = (data, successCallback, errorCallBack) => _fetchService('CustomerDC', 'POST', data, successCallback, errorCallBack);

export const CustomerDCUpdate = (data, successCallback, errorCallBack) => _fetchService(`CustomerDC/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const CustomerDcImport = (data, successCallback, errorCallBack) => _fetchService(`customerdc/importexceldata`, 'POST', data, successCallback, errorCallBack);

export const CustomerDCDelete = (data, successCallback, errorCallBack) => _fetchService(`CustomerDC/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const CustomerDcViewing = (data, successCallback, errorCallBack) => _fetchService(`customerdc/showData/${data.id}`, 'GET', {}, successCallback, errorCallBack);

/////--- FG Item----////

export const PoNoSelectPurchase = (data, successCallback, errorCallBack) => _fetchService(`fgitem/search/po?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const CustFgPartNoDcShow = (data, successCallback, errorCallBack) => _fetchService(`customerdc/item/${data.id}`, 'POST', data, successCallback, errorCallBack);
export const CustFgPartNoSelectDc = (data, successCallback, errorCallBack) => _fetchService(`fgitem/search/poItem/${data.id}?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const CustFgDcLists = (data, successCallback, errorCallBack) => _fetchService(`fgitem/search/dcItm?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const CustDcFgPartNoSelect = (data, successCallback, errorCallBack) => _fetchService(`fgitem/search/dcItm?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const PoFgPartNoDcShow = (data, successCallback, errorCallBack) => _fetchService(`fgitem/custDc/${data.id}`, 'GET', data, successCallback, errorCallBack);
export const ListAllFgItems = (data, successCallback, errorCallBack) => _fetchService(`fgitem/custDcAll`, 'GET', {}, successCallback, errorCallBack);

// VIEW FG ITEM
export const ViewFgItemLists = (successCallback, errorCallBack) => _fetchService(`fgitem`, 'GET', {}, successCallback, errorCallBack);
export const GetFgPoItemLists = (data, successCallback, errorCallBack) => _fetchService(`fgitem/showDtl`, 'POST', data, successCallback, errorCallBack);
export const UpdateFgPoItemLists = (data, successCallback, errorCallBack) => _fetchService(`fgitem/update`, 'PUT', data, successCallback, errorCallBack);

////Non Returnable Dc

export const LoadDcInvoice = (data, successCallback, errorCallBack) => _fetchService(`noCustomerdc/invoiceitem/${data.id}`, 'POST', data, successCallback, errorCallBack);
export const LoadDcInvoiceItems = (data, successCallback, errorCallBack) => _fetchService(`noCustomerdc/getInvoiceItems`, 'POST', data, successCallback, errorCallBack);
export const LoadDc = (data, successCallback, errorCallBack) => _fetchService(`noCustomerdc/pendingDc/${data.id}`, 'POST', data, successCallback, errorCallBack);
export const LoadDcItems = (data, successCallback, errorCallBack) => _fetchService(`noCustomerdc/getDcItems`, 'POST', data, successCallback, errorCallBack);
export const NrdcViewing = (data, successCallback, errorCallBack) => _fetchService(`noCustomerdc/showData/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const FGItemFrstSelect = (data, successCallback, errorCallBack) => _fetchService(`fgitem/item?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const FGItemSecndSelect = (data, successCallback, errorCallBack) => _fetchService(`fgitem/custDc/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const FGItemDataGrdSelect = (data, successCallback, errorCallBack) => _fetchService(`fgitem/custDcdetails/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const FgItemSave = (data, successCallback, errorCallBack) => _fetchService(`fgitem`, 'POST', data, successCallback, errorCallBack);


/////-- Customer DC-----/////
export const CustomerCDCShowdata = (data, successCallback, errorCallBack) => _fetchService(`customerdc/customer?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const PartNoSelectDc = (data, successCallback, errorCallBack) => _fetchService(`customerdc/itemDtl/${data.id}`, 'POST', data, successCallback, errorCallBack);
export const PartNoDcShow = (data, successCallback, errorCallBack) => _fetchService(`purchase/item/${data.id}?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const CustomerDCAutoGen = (successCallback, errorCallBack) => _fetchService('customerdc/uniqueId ', 'GET', {}, successCallback, errorCallBack);
export const CustomerDCQualityCheck = (successCallback, errorCallBack) => _fetchService('customerdc/qcPending', 'GET', {}, successCallback, errorCallBack);
export const CustomerDCQualityCheckApprove = (data, successCallback, errorCallBack) => _fetchService(`customerdc/qcSubmit`, 'POST', data, successCallback, errorCallBack);
export const CustomerDcPreview = (data, successCallback, errorCallBack) => _fetchService(`customerdc/getItems?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);

// export const CustomerDcShowData = (successCallback, errorCallBack) => _fetchService(`customerdc/show `, 'GET', {}, successCallback, errorCallBack);

// export const CustomerDcAdd = (data, successCallback, errorCallBack) => _fetchService('customerdc/insert ', 'POST', data, successCallback, errorCallBack);

// export const CustomerDcUpdate = (data, successCallback, errorCallBack) => _fetchService(`customerdc/update/${data.id}`, 'PUT', data, successCallback, errorCallBack);

// export const CustomerDCDelete = (data, successCallback, errorCallBack) => _fetchService(`customerdc/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const GSTDCSel = (successCallback, errorCallBack) => _fetchService(`gstInvoice/gstdcstore`, 'GET', {}, successCallback, errorCallBack);

///// Non Returnable DC //////
export const NRDCImport = (data, successCallback, errorCallBack) => _fetchService(`noCustomerdc/importndc`, 'POST', data, successCallback, errorCallBack);
export const LoadNrdcInv = (fromDate, toDate, successCallback, errorCallBack) => _fetchService(`noCustomerdc/invoiceitem/${data.id}?fromDate=${fromDate}&toDate=${toDate}`, 'POST', data, successCallback, errorCallBack);
export const PartNoSelectNDc = (data, successCallback, errorCallBack) => _fetchService(`noCustomerdc/item/${data.id}`, 'POST', data, successCallback, errorCallBack);
export const PartNoNDcShow = (data, successCallback, errorCallBack) => _fetchService(`purchase/item?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const NonDcAutoGen = (data, successCallback, errorCallBack) => _fetchService('noCustomerdc/uniqueId', 'POST', data, successCallback, errorCallBack);
export const NonReturnableShowData = (successCallback, errorCallBack) => _fetchService(`noCustomerdc/shownodc`, 'GET', {}, successCallback, errorCallBack);
export const NonReturnableDelete = (data, successCallback, errorCallBack) => _fetchService(`noCustomerdc/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const NonCustomerDcAdd = (data, successCallback, errorCallBack) => _fetchService('noCustomerdc', 'POST', data, successCallback, errorCallBack);
export const NonCustomerDcUpdate = (data, successCallback, errorCallBack) => _fetchService(`noCustomerdc/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const NonReturnableDcPreview = (data, successCallback, errorCallBack) => _fetchService(`noCustomerdc/getItems?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const NonReturnableDcInvoiceData = (data, successCallback, errorCallBack) => _fetchService(`noCustomerdc/invoicePrint/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const NonreturnableDcDCJson = (data, successCallback, errorCallBack) => _fetchService(`noCustomerdc/json?nrdcId=${data.id}`, 'GET', {}, successCallback, errorCallBack);

////Part No Search///
export const PartNoSelectGST = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/${data.id}/searchItm?type=${data.type}`, 'GET', {}, successCallback, errorCallBack);

// export const PartNoSelectGST = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/searchItm/${data.id}`, 'GET', {}, successCallback, errorCallBack);

/////GST-Sales-Invoice/////
export const gstSaleInvoiceXlUpload = (data, successCallback, errorCallBack) => _fetchService('gstInvoice/gstImport', 'POST', data, successCallback, errorCallBack);

export const GSTSalesShowData = (successCallback, errorCallBack) => _fetchService(`gstInvoice`, 'GET', {}, successCallback, errorCallBack);


export const GSTCustomerShow = (successCallback, errorCallBack) => _fetchService('gstInvoice/showname', 'GET', {}, successCallback, errorCallBack);

export const FetchGSTCustomerAddress = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/address/${data.id}`, 'GET', data, successCallback, errorCallBack);

export const GSTshowconsignee = (successCallback, errorCallBack) => _fetchService(`gstInvoice/showconsignee`, 'GET', {}, successCallback, errorCallBack);

export const GstPartNoShow = (successCallback, errorCallBack) => _fetchService('gstInvoice/item', 'GET', {}, successCallback, errorCallBack);

export const GstPartNoSelect = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/item/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const GSTInvAdd = (data, successCallback, errorCallBack) => _fetchService('gstInvoice', 'POST', data, successCallback, errorCallBack);

// CANCEL INVOICE
export const CancelGstSaleInvoice = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/cancelInvoice/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const CancelInvoiceAuthorizationLists = (successCallback, errorCallBack) => _fetchService('gstInvoice/approval/cancelInvoice', 'GET', {}, successCallback, errorCallBack);
export const AuthorizationHanlder = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/approval/submit?type=${data.type}`, 'PUT', data, successCallback, errorCallBack);
export const CancelInvoiceViewing = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/canceledInvoice/${data.id}`, 'GET', {}, successCallback, errorCallBack);

// export const GSTInvUpdate = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const GSTLoadPendingPO = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/pendingSo/${data.id}?type=${data.type}`, 'GET', {}, successCallback, errorCallBack);

export const SearchDelNote = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/searchDel?from=${data.form}&to=${data.to}&isWareHouse=${data.isWarehouse}`, 'GET', {}, successCallback, errorCallBack);

export const GetPendingDelNoteData = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/pendingDel/${data.cusId}`, 'POST', data, successCallback, errorCallBack);

export const GSTInvViewTable = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const GSTInvDelete = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const GstInvLabPdf = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/gstshowinvoice/${data.id}`, 'GET', data, successCallback, errorCallBack);

export const GstInvxml = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/gstshowinvoiceTally/${data.id}`, 'POST', data, successCallback, errorCallBack);

export const GSTInvshowdc = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/showpedinggDc/${data.id}`, 'GET', data, successCallback, errorCallBack);

export const DcSelectionGst = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/fgdc/${data.id}`, 'POST', data, successCallback, errorCallBack);

export const DcSelectionGstLoad = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/fgdcAll/${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const LoadPendingGstDc = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/pendingDc/${data.id}`, 'POST', data, successCallback, errorCallBack);

///--Account Master- Transporter---/////

export const MstTransporterShowData = (successCallback, errorCallBack) => _fetchService(`transporter`, 'GET', {}, successCallback, errorCallBack);

export const MstTransporterAdd = (data, successCallback, errorCallBack) => _fetchService('transporter', 'POST', data, successCallback, errorCallBack);

export const MstTransporterUpdate = (data, successCallback, errorCallBack) => _fetchService(`transporter/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const MstTransporterDelete = (data, successCallback, errorCallBack) => _fetchService(`transporter/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

///---Acc Dispatch-----//

export const MstDispatchShowData = (successCallback, errorCallBack) => _fetchService(`gstInvoice/dispatch`, 'GET', {}, successCallback, errorCallBack);

export const MstDispatchAdd = (data, successCallback, errorCallBack) => _fetchService('gstInvoice/dispatch', 'POST', data, successCallback, errorCallBack);

export const MstDispatchUpdate = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/dispatch/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const MstDispatchDelete = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/dispatch/${data.id}`, 'DELETE', data, successCallback, errorCallBack);



///===========Customer vs Item Report======//

export const CustomerDataShow = (data, successCallback, errorCallBack) => _fetchService(`custVsItem/report?fromDate=${data.fromDate}&toDate=${data.toDate}&customerId=${data.customerId}`, 'GET', {}, successCallback, errorCallBack);
///-----Acc Customer vs Item-----//////

export const CustomerCodeDropShow = (data, successCallback, errorCallBack) => _fetchService(`custVsItem/getCustomer?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

export const ItemCodeCodeDropShow = (data, successCallback, errorCallBack) => _fetchService(`purchase/item/${data.id}?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

export const CustomervsItemPartShow = (data, successCallback, errorCallBack) => _fetchService(`custVsItem/getItems?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

export const CustVsItemAdd = (data, successCallback, errorCallBack) => _fetchService('custVsItem', 'POST', data, successCallback, errorCallBack);

export const CustomerSelectItemShow = (data, successCallback, errorCallBack) => _fetchService(`custVsItem/${data.id}?page=${data.page}&q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

export const CustVsItemXLUpload = (data, successCallback, errorCallBack) => _fetchService('custVsItem/importCopy', 'POST', data, successCallback, errorCallBack);

export const CustVsItemXLImportXl = (data, successCallback, errorCallBack) => _fetchService('custVsItem/import', 'POST', data, successCallback, errorCallBack);
export const RateUpdateXLImportXl = (data, successCallback, errorCallBack) => _fetchService('custVsItem/import/rateUpadate', 'POST', data, successCallback, errorCallBack);

///------Acc Customer Dc Report-----/////

export const AccCustomerDcReportSearch = (data, successCallback, errorCallBack) => _fetchService(`customerdc/searchCustomer?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

export const AccCustomerDcReportItem = (data, successCallback, errorCallBack) => _fetchService(`customerdc/searchItems?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

export const CustomerDcReport = (data, successCallback, errorCallBack) => _fetchService('accountRepo/customerDc', 'POST', data, successCallback, errorCallBack);

//---------------------document number-------------//
export const ShowdocumentNumber = (successCallback, errorCallBack) => _fetchService('documentnumber', 'GET', {}, successCallback, errorCallBack);

export const SavedocumentNumber = (data, successCallback, errorCallBack) => _fetchService('documentnumber', 'POST', data, successCallback, errorCallBack);
//-----------------------------------holiday----------------------------------------------------------------------------------------------------------------

export const ShowHoliday = (successCallback, errorCallBack) => _fetchService('holiday', 'GET', {}, successCallback, errorCallBack);

export const DeleteHoliday = (data, successCallback, errorCallBack) => _fetchService(`holiday/${data?.id}`, 'DELETE', data, successCallback, errorCallBack);

export const AddHoliday = (data, successCallback, errorCallBack) => _fetchService('holiday', 'POST', data, successCallback, errorCallBack);

export const AddHolidayUpdate = (data, successCallback, errorCallBack) => _fetchService(`holiday/${data?.id}`, 'PUT', data, successCallback, errorCallBack);

// --------------------------------------------ShowType-------------------------------------------------------------------------------------------

export const ScrapMstShowType = (data, successCallback, errorCallBack) => _fetchService('scrapMst/showType', 'POST', data, successCallback, errorCallBack);

export const ScrapMstStoreBin = (data, successCallback, errorCallBack) => _fetchService('scrapMst/storeBin', 'POST', data, successCallback, errorCallBack);

export const ScrapMstBinUpdate = (data, successCallback, errorCallBack) => _fetchService(`scrapMst/binUpdate/${data?.id}`, 'PUT', data, successCallback, errorCallBack);

export const ScrapMstBinShow = (successCallback, errorCallBack) => _fetchService('scrapMst/binShow', 'GET', {}, successCallback, errorCallBack);

export const ScrapMstCategory = (successCallback, errorCallBack) => _fetchService('scrapMst/bin/category', 'GET', {}, successCallback, errorCallBack);

export const ScrapMstMaterial = (successCallback, errorCallBack) => _fetchService('scrapMst/bin/material', 'GET', {}, successCallback, errorCallBack);

//MIN-MAX-STATUS REPORT
export const GetMinMax = (data, successCallback, errorCallBack) => _fetchService('report/minMax', 'POST', data, successCallback, errorCallBack);

//ADD NEW SFG 
export const GetSFGItem = (successCallback, errorCallBack) => _fetchService('itemVsPm/getItem', 'GET', {}, successCallback, errorCallBack);
export const GetSFGUniqueID = (successCallback, errorCallBack) => _fetchService('sfg/uniqueId', 'GET', {}, successCallback, errorCallBack);
export const AddNewSFG = (data, successCallback, errorCallBack) => _fetchService('sfg', 'POST', data, successCallback, errorCallBack);
export const ShowSFG = (successCallback, errorCallBack) => _fetchService('sfg', 'GET', {}, successCallback, errorCallBack);
export const SFGEdit = (data, successCallback, errorCallBack) => _fetchService(`sfg/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const SFGDelete = (data, successCallback, errorCallBack) => _fetchService(`sfg/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

///---Quality Inscpection Master----////

export const QualityInsMstShowData = (successCallback, errorCallBack) => _fetchService(`qltyTemp/inspec`, 'GET', {}, successCallback, errorCallBack);
export const COPQShowData = (successCallback, errorCallBack) => _fetchService(`qcMst`, 'GET', {}, successCallback, errorCallBack);
export const MaterialRateShowData = (successCallback, errorCallBack) => _fetchService(`qcMst/material`, 'GET', {}, successCallback, errorCallBack);
export const ReworkManHourShowData = (successCallback, errorCallBack) => _fetchService(`qcMst/reworkRate`, 'GET', {}, successCallback, errorCallBack);
export const COPQSearchItem = (data, successCallback, errorCallBack) => _fetchService(`qcMst/material/search?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const COPQMstUpdate = (data, successCallback, errorCallBack) => _fetchService(`qcMst/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const MaterialRateUpdate = (data, successCallback, errorCallBack) => _fetchService(`qcMst/material/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const ReworkManHourUpdate = (data, successCallback, errorCallBack) => _fetchService(`qcMst/reworkRate/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const QualityInsMstAdd = (data, successCallback, errorCallBack) => _fetchService('qltyTemp/inspec', 'POST', data, successCallback, errorCallBack);
export const COPQMstAdd = (data, successCallback, errorCallBack) => _fetchService('qcMst', 'POST', data, successCallback, errorCallBack);
export const MaterialRateAdd = (data, successCallback, errorCallBack) => _fetchService('qcMst/material', 'POST', data, successCallback, errorCallBack);
export const ReworkManHourAdd = (data, successCallback, errorCallBack) => _fetchService('qcMst/reworkRate', 'POST', data, successCallback, errorCallBack);

export const QualityInsMstUpdate = (data, successCallback, errorCallBack) => _fetchService(`qltyTemp/inspec/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const QualityInsMstDelete = (data, successCallback, errorCallBack) => _fetchService(`qltyTemp/inspec/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const COPQDelete = (data, successCallback, errorCallBack) => _fetchService(`qcMst/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const MaterialRateDelete = (data, successCallback, errorCallBack) => _fetchService(`qcMst/material/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const ReworkManHourDelete = (data, successCallback, errorCallBack) => _fetchService(`qcMst/reworkRate/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const PartProcessInspectionXLUpload = (data, successCallback, errorCallBack) => _fetchService('qltyExl/import', 'POST', data, successCallback, errorCallBack);

//ADMIN APPROVAL//////
export const GetUpdatedRateList = (successCallback, errorCallBack) => _fetchService('approval/rateList', 'GET', {}, successCallback, errorCallBack);
export const GetPurchaseOrderApproveList = (successCallback, errorCallBack) => _fetchService('approval/pendingPo', 'GET', {}, successCallback, errorCallBack);
export const poApproval = (data, successCallback, errorCallBack) => _fetchService(`approval/poStatus/${data.id}`, 'POST', data, successCallback, errorCallBack);
export const poReject = (data, successCallback, errorCallBack) => _fetchService(`approval/poStatus/${data.id}`, 'POST', data, successCallback, errorCallBack);
export const GetPoRejectList = (successCallback, errorCallBack) => _fetchService('approval/poRejected', 'GET', {}, successCallback, errorCallBack);
export const priceRevisionApproval = (data, successCallback, errorCallBack) => _fetchService('approval/rateStatus', 'POST', data, successCallback, errorCallBack);
export const priceRejectList = (successCallback, errorCallBack) => _fetchService('approval/rateRejected', 'GET', {}, successCallback, errorCallBack);
export const Addinspection = (data, successCallback, errorCallBack) => _fetchService('itmPmVsInspec/addInspec', 'POST', data, successCallback, errorCallBack);
export const Addjobcardno = (data, successCallback, errorCallBack) => _fetchService('processInspec/showData', 'POST', data, successCallback, errorCallBack);
export const Processinspection = (data, successCallback, errorCallBack) => _fetchService(`processInspec/showType/${data.id}`, 'POST', data, successCallback, errorCallBack);
export const ProcessInspecUniqueId = (successCallback, errorCallBack) => _fetchService('processInspec/uniqueId', 'GET', {}, successCallback, errorCallBack);
export const ProcessInspecSubmit = (data, successCallback, errorCallBack) => _fetchService('processInspec/submit', 'POST', data, successCallback, errorCallBack);
export const InwardInspecReport = (data, successCallback, errorCallBack) => _fetchService('inwardQc/report', 'POST', data, successCallback, errorCallBack);
export const WithoutPoInwardInspecReport = (data, successCallback, errorCallBack) => _fetchService('inwardQc/withoutPo/report', 'POST', data, successCallback, errorCallBack);
export const ProcessInspecReport = (data, successCallback, errorCallBack) => _fetchService('processInspec/report', 'POST', data, successCallback, errorCallBack);
export const ProcessInspecReportViewId = (data, successCallback, errorCallBack) => _fetchService(`processInspec/reportView`, 'POST', data, successCallback, errorCallBack);
export const ProcessInspecChildPart = (data, successCallback, errorCallBack) => _fetchService('processInspec/childPart', 'POST', data, successCallback, errorCallBack);
export const npdviewFileLink = (data, successCallback, errorCallBack) => _fetchService('npd/viewFile', 'POST', data, successCallback, errorCallBack);
export const QcInwardReportViewId = (data, successCallback, errorCallBack) => _fetchService(`inwardQc/reportView/${data?.id}`, 'GET', {}, successCallback, errorCallBack);
export const QcInwardWithotReportViewId = (data, successCallback, errorCallBack) => _fetchService(`inwardQc/withoutPo/reportView/${data?.id}`, 'GET', {}, successCallback, errorCallBack);

//CustomervsItem Authorise
export const CustomerVsItemGetUpdatedRateListCustomer = (successCallback, errorCallBack) => _fetchService('custVsItem/rateApproval', 'GET', {}, successCallback, errorCallBack);
export const CustomerVsItempriceRevisionApproval = (data, successCallback, errorCallBack) => _fetchService('custVsItem/approval/submit', 'PUT', data, successCallback, errorCallBack);
export const CustomerVsItempriceRejectList = (successCallback, errorCallBack) => _fetchService('custVsItem/rejected', 'GET', {}, successCallback, errorCallBack);
export const CustomerVsItemPriceReject = (data, successCallback, errorCallBack) => _fetchService('custVsItem/approval/reject', 'PUT', data, successCallback, errorCallBack);

// FPI INSPECTION
export const GetFpiInspectionData = (data, successCallback, errorCallBack) => _fetchService(`processInspec/showType`, 'POST', data, successCallback, errorCallBack);

///Rework--////
export const ReworkreasonAdd = (data, successCallback, errorCallBack) => _fetchService('qltyReason', 'POST', data, successCallback, errorCallBack);

export const ReworkreasonUpdate = (data, successCallback, errorCallBack) => _fetchService(`qltyReason/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const ReworkreasonDelete = (data, successCallback, errorCallBack) => _fetchService(`qltyReason/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const ReworkreasonShowData = (successCallback, errorCallBack) => _fetchService(`qltyReason`, 'GET', {}, successCallback, errorCallBack);

export const ReworkreasonidShowData = (successCallback, errorCallBack) => _fetchService(`qltyReason/getId`, 'GET', {}, successCallback, errorCallBack);

export const ReworkreasonID = (successCallback, errorCallBack) => _fetchService(`qltyReason/getId`, 'GET', {}, successCallback, errorCallBack);
//NEW CODE
export const POViewApprove = (data, successCallback, errorCallBack) => _fetchService('approval/poView', 'POST', data, successCallback, errorCallBack);

// CHECKLIST 
export const AddChecklist = (data, successCallback, errorCallBack) => _fetchService('checklist/master', 'POST', data, successCallback, errorCallBack);
export const ShowCheckList = (successCallback, errorCallBack) => _fetchService('checklist/master', 'GET', {}, successCallback, errorCallBack);
export const UpdateChecklist = (data, successCallback, errorCallBack) => _fetchService(`checklist/master/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const ChecklistDelete = (data, successCallback, errorCallBack) => _fetchService(`checklist/master/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const ChecklistImport = (data, successCallback, errorCallBack) => _fetchService(`checkExl/import`, 'POST', data, successCallback, errorCallBack);
export const getMachines = (successCallback, errorCallBack) => _fetchService('checklist/machines', 'GET', {}, successCallback, errorCallBack);
export const AssignChecklist = (data, successCallback, errorCallBack) => _fetchService(`checklist/master/${data.checklistid}/assign`, 'POST', data, successCallback, errorCallBack);
export const ViewAssignedChecklist = (data, successCallback, errorCallBack) => _fetchService('checklist/show ', 'POST', data, successCallback, errorCallBack);
export const GetChecklistVerifyLists = (data, successCallback, errorCallBack) => _fetchService('checklist/showverifyapi', 'POST', data, successCallback, errorCallBack);
export const GetChecklistExecutionDetails = (id, successCallback, errorCallBack) => _fetchService(`checklist/${id}`, 'GET', {}, successCallback, errorCallBack);
export const SubmitChecklistExecution = (data, successCallback, errorCallBack) => _fetchService(`checklist/submit`, 'POST', data, successCallback, errorCallBack);

// TEMPLATE
export const AddTemplate = (data, successCallback, errorCallBack) => _fetchService('checklist/template', 'POST', data, successCallback, errorCallBack);
export const ShowTemplate = (successCallback, errorCallBack) => _fetchService('checklist/template', 'GET', {}, successCallback, errorCallBack);
export const UpdateTemplate = (data, successCallback, errorCallBack) => _fetchService(`checklist/template/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const TemplateDelete = (data, successCallback, errorCallBack) => _fetchService(`checklist/template/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const AddTemplateLayout = (data, successCallback, errorCallBack) => _fetchService('layout', 'POST', data, successCallback, errorCallBack);
export const GetBodyLayoutLists = (data, successCallback, errorCallBack) => _fetchService(`checklist/template/${data.id}/items`, 'GET', {}, successCallback, errorCallBack);
export const DeleteBodyLayoutLists = (data, successCallback, errorCallBack) => _fetchService(`layout/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const UpdateBodyLayoutLists = (data, successCallback, errorCallBack) => _fetchService(`layout/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const UpdateTableCellAnswer = (data, successCallback, errorCallBack) => _fetchService('checklist/update', 'POST', data, successCallback, errorCallBack);
export const GetHeaderFooterData = (data, successCallback, errorCallBack) => _fetchService(`checklist/template/sections/${data.sectionId}/fields`, 'GET', {}, successCallback, errorCallBack);
export const UpdateTemplateLayout = (data, successCallback, errorCallBack) => _fetchService(`layout/${data.id}`, 'PUT', data, successCallback, errorCallBack);
export const AddTemplateFields = (data, successCallback, errorCallBack) => _fetchService('checklist/template/fields', 'POST', data, successCallback, errorCallBack);
export const AddTemplateItems = (data, successCallback, errorCallBack) => _fetchService('checklist/template/items', 'POST', data, successCallback, errorCallBack);

// CHECKLIST REPORT
export const GetReportSection = (data, successCallback, errorCallBack) => _fetchService(`checklistReport/?department=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetReportAsset = (data, successCallback, errorCallBack) => _fetchService(`checklistReport/asset/?section=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetChecklistReport = (data, successCallback, errorCallBack) => {
  let url = `checklist/report?fromDate=${data.fromDate}&toDate=${data.toDate}`;
  if (data.toolId) url += `&toolId=${data.toolId}`;
  return _fetchService(url, 'GET', {}, successCallback, errorCallBack);
};

//PURCHASE ORDER REPORT
export const PurchaseReportSearchSupplier = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/searchSupplier?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const PurchaseReportSearchItem = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/searchItems?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const GetPuchaseReport = (data, successCallback, errorCallBack) => _fetchService('poGenerate/report', 'POST', data, successCallback, errorCallBack);
export const GetPuchaseOrderAganistPOReport = (data, successCallback, errorCallBack) => _fetchService('poBill/report/detailed', 'POST', data, successCallback, errorCallBack);
export const PurchaseOrderGroup = (successCallback, errorCallBack) => _fetchService('master/itemGroup', 'GET', {}, successCallback, errorCallBack);
export const SupplierVsItemList = (data, successCallback, errorCallBack) => _fetchService('suppVsItem/suppReport ', 'POST', data, successCallback, errorCallBack);
//PURCHASE ORDER APPROVAL EMAIL PDF 
export const UploadGeneratedPdf = (data, successCallback, errorCallBack) => _fetchService('docs/sendMail', 'POST', data, successCallback, errorCallBack);
export const UploadGeneratedInvoice = (data, successCallback, errorCallBack) => _fetchService('docs/sendMail', 'POST', data, successCallback, errorCallBack);

// JOBCARD VIEW
export const GetJobCardShifts = (data, successCallback, errorCallBack) => _fetchService('schedule/machine', 'POST', data, successCallback, errorCallBack);
export const GetJobCardViewData = (data, successCallback, errorCallBack) => _fetchService('jobCard/fetchSchedules', 'POST', data, successCallback, errorCallBack);
export const GetJobCardInsideDetails = (data, successCallback, errorCallBack) => _fetchService('jobCard/details', 'POST', data, successCallback, errorCallBack);
export const GetJobCardChildDrill = (data, successCallback, errorCallBack) => _fetchService('jobCard/childProcess', 'POST', data, successCallback, errorCallBack);
export const ShortClose = (data, successCallback, errorCallBack) => _fetchService('jobCard/shortClose', 'POST', data, successCallback, errorCallBack);

// QC APPROVAL
export const QCApprovalLists = (successCallback, errorCallBack) => _fetchService('poBill/qcPending', 'GET', {}, successCallback, errorCallBack);
export const WithoutPOApprovalLists = (successCallback, errorCallBack) => _fetchService('poBillWithOutPo/qcPending', 'GET', {}, successCallback, errorCallBack);

//Skill Matrix
export const FetchfileID = (successCallback, errorCallBack) => _fetchService('skillmatrics/getId', 'GET', {}, successCallback, errorCallBack);
export const FetchMachineName = (successCallback, errorCallBack) => _fetchService('skillmatrics/machine', 'GET', {}, successCallback, errorCallBack);
export const GetFileData = (data, successCallback, errorCallBack) => _fetchService('skillmatrics', 'POST', data, successCallback, errorCallBack);
export const Showdata = (successCallback, errorCallBack) => _fetchService('skillmatrics', 'GET', {}, successCallback, errorCallBack);
export const Deletedata = (data, successCallback, errorCallBack) => _fetchService(`skillmatrics/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const Updateskillmatrix = (data, successCallback, errorCallBack) => _fetchService(`skillmatrics/${data.id}`, 'PUT', data, successCallback, errorCallBack);
//STORE REFERENCE
export const StoreReferenceItemHistory = (data, successCallback, errorCallBack) => _fetchService(`storeRepo/ReferenceLatest/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetTransactionData = (data, successCallback, errorCallBack) => _fetchService(`storeRepo/referenceAll/${data.id}`, 'POST', data, successCallback, errorCallBack);
export const GetGRN_FIFO = (data, successCallback, errorCallBack) => _fetchService(`storeRepo/grnLog/${data.id}`, 'POST', data, successCallback, errorCallBack);

// STOCK LEDGER REPORT
export const GetStockLedgerReport = (data, successCallback, errorCallBack) => _fetchService('storeRepo/stockLedger', 'POST', data, successCallback, errorCallBack);

// STOCK BALANCE REPORT
export const GetStockBalanceReport = (data, successCallback, errorCallBack) => _fetchService('storeRepo/stockBalance', 'POST', data, successCallback, errorCallBack);

//MATERIAL RETURN NODE
export const GetMnrUniqueId = (data, successCallback, errorCallBack) => _fetchService('mrn/uniqueId', 'POST', data, successCallback, errorCallBack);
export const HandleGrnUpload = (data, successCallback, errorCallBack) => _fetchService('mrn', 'POST', data, successCallback, errorCallBack);
export const GetAllMrnData = (successCallback, errorCallBack) => _fetchService('mrn', 'GET', {}, successCallback, errorCallBack);
export const ViewAllMrnData = (data, successCallback, errorCallBack) => _fetchService(`mrn/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const UpdateMrnData = (data, successCallback, errorCallBack) => _fetchService(`mrn/${data.id}`, 'PUT', data, successCallback, errorCallBack);

//ASSEMBLY IMAGE MODAL
export const GetAssemblyImage = (data, successCallback, errorCallBack) => _fetchService('npd/viewFile', 'POST', data, successCallback, errorCallBack);
export const FilterAssemblyTable = (data, successCallback, errorCallBack) => _fetchService('planning/assemblyfilter', 'POST', data, successCallback, errorCallBack);
export const AssemblyFilterDropdown = (data, successCallback, errorCallBack) => _fetchService('planning/getDropdownOptions', 'POST', data, successCallback, errorCallBack);

// QUARANTINE STOCK REPORT
export const GetQuarantineStockReport = (data, successCallback, errorCallBack) => _fetchService('storeRepo/quarantine', 'POST', data, successCallback, errorCallBack);

//OPENING STOCK UPLOAD
export const UploadOpeningStock = (data, successCallback, errorCallBack) => _fetchService('storeRepo/upload/stock', 'POST', data, successCallback, errorCallBack);
export const SubmitOpeningStock = (data, successCallback, errorCallBack) => _fetchService('storeRepo/upload/confirm', 'POST', data, successCallback, errorCallBack);

// OPENING BALANCE APPROVAL
export const GetOpeningBalancePendingLists = (successCallback, errorCallBack) => _fetchService('approval/pendingItems', 'GET', {}, successCallback, errorCallBack);
export const ApproveOpeningBalance = (data, successCallback, errorCallBack) => _fetchService('approval/stockSubmit', 'POST', data, successCallback, errorCallBack);

//PO SHORT CLOSE
export const GetPoShortClose = (data, successCallback, errorCallBack) => _fetchService('poGenerate/shortClosedRepo', 'POST', data, successCallback, errorCallBack);
export const UpdatePoShortClose = (data, successCallback, errorCallBack) => _fetchService('poGenerate/shortClose', 'POST', data, successCallback, errorCallBack);

// PRODUCTION REPORT
export const GetProductionReport = (data, successCallback, errorCallBack) => _fetchService(`prodReport/view?fromDate=${data.from}&toDate=${data.to}&type=${data.type}`, 'GET', data, successCallback, errorCallBack);

//CHANGE PASSWORD
export const UserPasswordChange = (data, successCallback, errorCallBack) => _fetchService('changePassword', 'POST', data, successCallback, errorCallBack);

// SCRAP REPORT ANALYSIS
export const ScrapReportAnalysisReport = (data, successCallback, errorCallBack) => _fetchService(`scrapMst/report/analysis`, 'POST', data, successCallback, errorCallBack);

// ACCOUNT MODULE REPORT
export const GetSaleInvoiceReport = (data, successCallback, errorCallBack) => _fetchService(`accountRepo/saleInvoice`, 'POST', data, successCallback, errorCallBack);
export const GetItemwiseReport = (data, successCallback, errorCallBack) => _fetchService(`accountRepo/saleInvoice`, 'POST', data, successCallback, errorCallBack);
export const GetSaleRegisterReport = (data, successCallback, errorCallBack) => _fetchService(`accountRepo/saleRegister`, 'POST', data, successCallback, errorCallBack);
export const GetCustPoReport = (data, successCallback, errorCallBack) => _fetchService(`accountRepo/soCustpo`, 'POST', data, successCallback, errorCallBack);
export const GetInvoiceCustDcReport = (data, successCallback, errorCallBack) => _fetchService(`accountRepo/invCustDc`, 'POST', data, successCallback, errorCallBack);
export const GetCustomerPOListReport = (data, successCallback, errorCallBack) => _fetchService(`accountRepo/custPo`, 'POST', data, successCallback, errorCallBack);
export const CancelSalesInvoice = (data, successCallback, errorCallBack) => _fetchService(`accountRepo/cancel/saleInvoice`, 'POST', data, successCallback, errorCallBack);
export const CreditNoteReport = (data, successCallback, errorCallBack) => _fetchService(`accountRepo/creditNote`, 'POST', data, successCallback, errorCallBack);
export const CancelSalesInvoiceSummary = (data, successCallback, errorCallBack) => _fetchService(`accountRepo/cancel/saleInvoice/summary`, 'POST', data, successCallback, errorCallBack);

//QUALITY SRN 
export const GetQualitySrnShowData = (data, successCallback, errorCallBack) => _fetchService(`qltyItems/showData`, 'POST', data, successCallback, errorCallBack);
export const GetFpiFmiInspectionData = (data, successCallback, errorCallBack) => _fetchService('qltyItems/showType', 'POST', data, successCallback, errorCallBack);
export const FmiInspecUniqueId = (successCallback, errorCallBack) => _fetchService('qltyItems/uniqueId', 'GET', {}, successCallback, errorCallBack);
export const FmiInspecSubmit = (data, successCallback, errorCallBack) => _fetchService('qltyItems/submit', 'POST', data, successCallback, errorCallBack);
export const FmiInspecReport = (data, successCallback, errorCallBack) => _fetchService('qltyItems/report', 'POST', data, successCallback, errorCallBack);
export const FimInspecReportInsideData = (data, successCallback, errorCallBack) => _fetchService(`qltyItems/reportView/${data?.id}`, 'GET', {}, successCallback, errorCallBack);
export const GetFimRejectedItems = (data, successCallback, errorCallBack) => _fetchService(`qltyItems/rejected?fromDate=${data.fromDate}&toDate=${data.toDate}`, 'GET', data, successCallback, errorCallBack);

// STOCK TRANSFER
export const GetStockTransferUniqueID = (successCallback, errorCallBack) => _fetchService('stockTransfer/uniqueId', 'GET', {}, successCallback, errorCallBack);
export const GetStockTransferLocation = (successCallback, errorCallBack) => _fetchService('itemMaster/mainLocation', 'GET', {}, successCallback, errorCallBack);
export const UploadStockTransfer = (data, successCallback, errorCallBack) => _fetchService('stockTransfer', 'POST', data, successCallback, errorCallBack);
export const StockTransferPreview = (data, successCallback, errorCallBack) => _fetchService(`stockTransfer/getItems?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const SearchStockTransfer = (data, successCallback, errorCallBack) => _fetchService(`stockTransfer/search?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const GetSearchedStData = (data, successCallback, errorCallBack) => _fetchService(`stockTransfer/${data.id}`, 'GET', {}, successCallback, errorCallBack);

//SRN SHORT CLOSE
export const GetSrnShortClose = (data, successCallback, errorCallBack) => _fetchService('srnShortClose', 'POST', data, successCallback, errorCallBack);
export const UpdateSrnShortClose = (data, successCallback, errorCallBack) => _fetchService('srnShortClose/update', 'POST', data, successCallback, errorCallBack);

// ITEM CONSUMPTION TREND
export const GetItemConsumptionTrend = (data, successCallback, errorCallBack) => _fetchService('report/consumptionTrend', 'POST', data, successCallback, errorCallBack);

// MIN MAX CONSUMPTION REPORT
export const GetMinMaxConsumptionReport = (data, successCallback, errorCallBack) => _fetchService('report/minMax', 'POST', data, successCallback, errorCallBack);

// STOCK AGE REPORT
export const GetStockAgeReport = (data, successCallback, errorCallBack) => _fetchService('storeRepo/stockAge', 'POST', data, successCallback, errorCallBack);

//JOB CARD SRN UPDATE
export const JobCardSrnUpdate = (data, successCallback, errorCallBack) => _fetchService('supervisorJc/manualRqstMaterial', 'POST', data, successCallback, errorCallBack);
export const GetSupervisorSrnUniqueCode = (successCallback, errorCallBack) => _fetchService('supervisorJc/getUnique', 'GET', {}, successCallback, errorCallBack);
export const GetSrnNetWeight = (data, successCallback, errorCallBack) => _fetchService(`supervisorJc/getNetWeight/${data?.id}`, 'GET', {}, successCallback, errorCallBack);

/////RM Itemcode [Mst]////

export const RMItemcode = (data, successCallback, errorCallBack) => _fetchService(`item/getRmCode?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

/////
export const OperatorlogShow = (data, successCallback, errorCallBack) => _fetchMallikOperatorLogService(`operatorlog/show`, 'POST', data, successCallback, errorCallBack);

export const OperatorlogShowdropdown = (data, successCallback, errorCallBack) => _fetchMallikOperatorLogService(`operatorlog/showdropdown `, 'POST', data, successCallback, errorCallBack);
// ORDER STATUS REPORT
export const GetOrderStatusReport = (successCallback, errorCallBack) => _fetchService(`orderStatus`, 'GET', {}, successCallback, errorCallBack);
export const GetOrderStatusDetailedReport = (data, successCallback, errorCallBack) => _fetchService(`orderStatus/detailedReport?jcNo=${data.jcNo}`, 'GET', {}, successCallback, errorCallBack);

// ACCOUNT E-INVOICING
export const getGstSaleInvoiceList = (data, successCallback, errorCallBack) => _fetchService('gstInvoice/einvoice', 'POST', data, successCallback, errorCallBack);
export const getGstSaleInvoicePayload = (data, successCallback, errorCallBack) => _fetchService('gstInvoice/makeInvoice', 'POST', data, successCallback, errorCallBack);
export const StoreGstSaleInvoiceResponse = (data, successCallback, errorCallBack) => _fetchService('gstInvoice/saveEinvoice', 'POST', data, successCallback, errorCallBack);

// ACCOUNT MULTI INVOICE PRINTING
export const getGstAllSaleInvoiceList = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/fetch?fromDate=${data.from}&toDate=${data.to}&rangeFrom=${data.rangeFrom}&rangeTo=${data.rangeTo}&isPrinted=${data.printedDoc}`, 'GET', {}, successCallback, errorCallBack);
export const getGstSaleInvoiceData = (data, successCallback, errorCallBack) => _fetchService('gstInvoice/multiGstInvoice', 'POST', data, successCallback, errorCallBack);
export const updatePrintedInvoiceStatus = (data, successCallback, errorCallBack) => _fetchService('gstInvoice/updatePrintStatus', 'PUT', data, successCallback, errorCallBack);

///PurchasebillMulti Printing////
export const getPurchasebillagainstInvList = (data, successCallback, errorCallBack) => _fetchService(`poBill/multiPrint`, 'POST', data, successCallback, errorCallBack);
export const getPurchaseSelectionList = (data, successCallback, errorCallBack) => _fetchService('poBill/multiPrint/view', 'POST', data, successCallback, errorCallBack);

///PurchasebillMulti Withot Printing////
export const getPurchasebillWithoutPoInvList = (data, successCallback, errorCallBack) => _fetchService(`poBillWithOutPo/multiPrint`, 'POST', data, successCallback, errorCallBack);
export const getPurchaseWithoutPOSelectionList = (data, successCallback, errorCallBack) => _fetchService('poBillWithOutPo/multiPrint/view', 'POST', data, successCallback, errorCallBack);


////////
export const SupplyItemcode = (data, successCallback, errorCallBack) => _fetchService(`suppVsItem/search?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const SupplydnoData = (data, successCallback, errorCallBack) => _fetchService('inwardQc/showData', 'POST', data, successCallback, errorCallBack);


//////
export const GetInwardFpiInspection = (data, successCallback, errorCallBack) => _fetchService(`inwardQc/showType`, 'POST', data, successCallback, errorCallBack);

// SRN SHORTAGE REPORT
export const GetSRNshortageReport = (data, successCallback, errorCallBack) => _fetchService(`srn/report`, 'POST', data, successCallback, errorCallBack);
export const ProcessInwardSubmit = (data, successCallback, errorCallBack) => _fetchService('inwardQc/submit', 'POST', data, successCallback, errorCallBack);

////
export const SoVerificationSave = (data, successCallback, errorCallBack) => _fetchService('so-verification/store', 'POST', data, successCallback, errorCallBack);

export const SoVerificationSearch = (data, successCallback, errorCallBack) => _fetchService(`so-verification/po?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

export const GetSoPendingVreification = (data, successCallback, errorCallBack) => _fetchService(`so-verification/details?id=${data?.id}`, 'GET', {}, successCallback, errorCallBack);
export const soVerificationAuthorize = (data, successCallback, errorCallBack) => _fetchService(`so-verification/authorize?id=${data?.id}`, 'GET', {}, successCallback, errorCallBack);

////
export const PurchaseBillWithoutPReport = (data, successCallback, errorCallBack) => _fetchService('poBill/report/summary', 'POST', data, successCallback, errorCallBack);
export const PurchaseBillReceiptReport = (data, successCallback, errorCallBack) => _fetchService('poGenerate/report/purchaseVsReceipt', 'POST', data, successCallback, errorCallBack);

///customer api 
export const ShowcustomerLast = (data, successCallback, errorCallBack) => _fetchService(`customer/get?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const Showcustomerfirst = (data, successCallback, errorCallBack) => _fetchService(`customer/get?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const Showcustomerforward = (data, successCallback, errorCallBack) => _fetchService(`customer/get?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const ShowcustomerReverse = (data, successCallback, errorCallBack) => _fetchService(`customer/get?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const SaveCustomerInfo = (data, successCallback, errorCallBack) => _fetchService('customer', 'POST', data, successCallback, errorCallBack);

export const GetCurrencyData = (successCallback, errorCallBack) => _fetchService('master/currency', 'GET', {}, successCallback, errorCallBack);

export const GetCustomerGroupData = (successCallback, errorCallBack) => _fetchService('master/customerGroup', 'GET', {}, successCallback, errorCallBack);

export const GetPlaceOfSupplyData = (successCallback, errorCallBack) => _fetchService('master/placeOfSupply', 'GET', {}, successCallback, errorCallBack);

export const GetCustomerData = (successCallback, errorCallBack) => _fetchService('customer', 'GET', {}, successCallback, errorCallBack);

export const UpdateCustomerData = (data, successCallback, errorCallBack) => _fetchService(`customer/${data?.custDetails?.id}`, 'PUT', data, successCallback, errorCallBack);

export const DeleteCustomerdata = (data, successCallback, errorCallBack) => _fetchService(`customer/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const GetSuppVsItemAllcustList = (data, successCallback, errorCallBack) => _fetchService(`customer/search?q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);

export const PreviewCustomerData = (data, successCallback, errorCallBack) => _fetchService(`customer/get?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);

// QUALITY SETTING 
export const AddQualityRule = (data, successCallback, errorCallBack) => _fetchService('itmPmVsInspec/qcRule', 'POST', data, successCallback, errorCallBack);
export const EditQualityRule = (data, successCallback, errorCallBack) => _fetchService(`itmPmVsInspec/qcRule/${data?.id}`, 'PUT', data, successCallback, errorCallBack);
export const GetQualityRule = (data, successCallback, errorCallBack) => _fetchService('itmPmVsInspec/qcRule', 'GET', data, successCallback, errorCallBack);
export const GetQualityRuleMapInspection = (data, successCallback, errorCallBack) => _fetchService(`itmPmVsInspec/getQcRule?type=${data.type}`, 'GET', data, successCallback, errorCallBack);
export const GetCategoryLists = (successCallback, errorCallBack) => _fetchService('master/category', 'GET', {}, successCallback, errorCallBack);
export const GetMaterialLists = (successCallback, errorCallBack) => _fetchService('master/rmItemcode', 'GET', {}, successCallback, errorCallBack);
export const DeleteQualityRule = (data, successCallback, errorCallBack) => _fetchService(`itmPmVsInspec/qcRule/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const GetDisplayName = (data, successCallback, errorCallBack) => _fetchService(`master/${data.masterType}`, 'GET', {}, successCallback, errorCallBack);
export const GetInspectionLists = (successCallback, errorCallBack) => _fetchService('master/inspectionLevel', 'GET', {}, successCallback, errorCallBack);

// QUALITY RULE MAPING
export const AddMapInspectionBatchQty = (data, successCallback, errorCallBack) => _fetchService('itmPmVsInspec/qcRuleMap', 'POST', data, successCallback, errorCallBack);
export const EditMapInspectionBatchQty = (data, successCallback, errorCallBack) => _fetchService(`itmPmVsInspec/qcRuleMap/${data?.id}`, 'PUT', data, successCallback, errorCallBack);
export const GetMapInspectionBatchQty = (successCallback, errorCallBack) => _fetchService('itmPmVsInspec/qcRuleMap', 'GET', data, successCallback, errorCallBack);
export const DeleteMapInspectionBatchQty = (data, successCallback, errorCallBack) => _fetchService(`itmPmVsInspec/qcRuleMap/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const GetMachineList = (successCallback, errorCallBack) => _fetchService('machine/show', 'GET', {}, successCallback, errorCallBack);
export const CompletedReverseVreified = (data, successCallback, errorCallBack) => _fetchService(`dispatch/viewDelNote?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const TodayDispatchDelSchedule = (successCallback, errorCallBack) => _fetchService(`dispatch/custDelSchedule`, 'GET', {}, successCallback, errorCallBack);

export const TodayDispatchShowDetail = (data, successCallback, errorCallBack) => _fetchService('dispatch/custDelSchedule/showDetail', 'POST', data, successCallback, errorCallBack);


export const GetGeneratedSFG = (data, successCallback, errorCallBack) => _fetchService(`sfgVerification/getSfgNo?q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);

export const CompletedGetGeneratedSFG = (data, successCallback, errorCallBack) => _fetchService(`sfgVerification/view?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const CustomvsItemDelete = (data, successCallback, errorCallBack) => _fetchService(`custVsItem/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const GetSRNNoList = (data, successCallback, errorCallBack) => _fetchService(`materialIssue/getSrnNo?q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);

export const PreviewMaterialData = (data, successCallback, errorCallBack) => _fetchService(`materialIssue/view?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const AddFinancialYear = (data, successCallback, errorCallBack) => _fetchService('documentnumber/financialYear', 'POST', data, successCallback, errorCallBack);

export const ShowfinancialYearData = (successCallback, errorCallBack) => _fetchService(`documentnumber/financialYear`, 'GET', {}, successCallback, errorCallBack);

export const EditfinancialYear = (data, successCallback, errorCallBack) => _fetchService(`documentnumber/financialYear?id=${data?.id}`, 'PUT', data, successCallback, errorCallBack);

export const CustomerDeliverySchedule = (successCallback, errorCallBack) => _fetchService(`dispatch/custDelSchedule`, 'GET', {}, successCallback, errorCallBack);


export const OrderPlanningSelctedData = (data, successCallback, errorCallBack) => _fetchService(`order/authRequest`, 'POST', data, successCallback, errorCallBack);

export const AuthorizePlanningData = (data, successCallback, errorCallBack) => _fetchService(`order/authDocuments?type=${data?.type}`, 'GET', {}, successCallback, errorCallBack);

export const ProcessCheckedDataList = (data, successCallback, errorCallBack) => _fetchService(`order/processPlanningDocs`, 'POST', data, successCallback, errorCallBack);
export const DeclineCheckedDataList = (data, successCallback, errorCallBack) => _fetchService(`order/declineDocs`, 'POST', data, successCallback, errorCallBack);
export const ProcessDataList = (data, successCallback, errorCallBack) => _fetchService(`planning/approveRejectedParts`, 'POST', data, successCallback, errorCallBack);
export const DeclineDataList = (data, successCallback, errorCallBack) => _fetchService(`planning/declineRejectedParts`, 'POST', data, successCallback, errorCallBack);

export const AuthorizeRejectedPlanningData = (data, successCallback, errorCallBack) => _fetchService(`planning/fetchRejectedDoc?view=${data?.type}&kanbanDate=${data?.date}&status=${data?.status}`, 'GET', {}, successCallback, errorCallBack);


//sfg stock report
export const GetSFGStockReport = (data, successCallback, errorCallBack) => _fetchService(`accountRepo/fgStockRepo`, 'POST', data, successCallback, errorCallBack);
export const GetSFGStockSummaryReport = (data, successCallback, errorCallBack) => _fetchService(`accountRepo/fgStock/summary`, 'POST', data, successCallback, errorCallBack);
export const PurchaseBillShortClose = (data, successCallback, errorCallBack) => _fetchService(`inwardQc/qcApprove?type=1`, 'POST', data, successCallback, errorCallBack);
export const PurchaseBillWithoutShortClose = (data, successCallback, errorCallBack) => _fetchService(`inwardQc/qcApprove?type=0`, 'POST', data, successCallback, errorCallBack);

//MATERIAL ISSUE NEW TRANSACTION
export const GetMaterialDocNumber = (successCallback, errorCallBack) => _fetchService('documentnumber/generateDocNo?docType=MaterialIssueNote', 'GET', {}, successCallback, errorCallBack);
export const GetPendingIssueParts = (data, successCallback, errorCallBack) => _fetchService(`materialIssue?page=${data.page}`, 'GET', {}, successCallback, errorCallBack);
export const MaterialIssuePreview = (data, successCallback, errorCallBack) => _fetchService(`materialIssue/view?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const AutoMaterialIssueSubmit = (data, successCallback, errorCallBack) => _fetchService('grn/issue-automatic', 'PUT', data, successCallback, errorCallBack);
export const searchMaterialIssue = (data, successCallback, errorCallBack) => _fetchService(`materialIssue/search?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

// NEW TRANSACTION SFG VARIFICATON
export const GetSfgDocNumber = (successCallback, errorCallBack) => _fetchService('documentnumber/generateDocNo?docType=Sfg', 'GET', {}, successCallback, errorCallBack);
export const LoadSfgPendingParts = (data, successCallback, errorCallBack) => _fetchService('sfgVerification', 'POST', data, successCallback, errorCallBack);
export const HandleCreateJobWork = (data, successCallback, errorCallBack) => _fetchService('sfgVerification/createJobWork', 'POST', data, successCallback, errorCallBack);
export const SubmitSfgVerification = (data, successCallback, errorCallBack) => _fetchService('sfgVerification/store', 'POST', data, successCallback, errorCallBack);
export const SfgVerificationPreview = (data, successCallback, errorCallBack) => _fetchService(`sfgVerification/view?type=${data.type}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const searchSfgNumber = (data, successCallback, errorCallBack) => _fetchService(`sfgVerification/search?q=${data.code}`, 'GET', {}, successCallback, errorCallBack);

// COMPANY DETAILS
export const updateCompanyDetails = (data, successCallback, errorCallBack) => _fetchService('master/companyInfo', 'POST', data, successCallback, errorCallBack);
export const GetCompanyDetails = (successCallback, errorCallBack) => _fetchService('master/companyInfo', 'GET', {}, successCallback, errorCallBack);


//Dispatch Dashboard 

// export const dispatchDashboardShow = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/showdashdata', 'POST', data, successCallback, errorCallBack);
export const dispatchDashboardShow = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/getDispatchPlan', 'POST', data, successCallback, errorCallBack);
// export const dispatchDashboardShow = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/getShipmentDetails', 'POST', data, successCallback, errorCallBack);
export const dispatchDashboardStartTime = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/updateStartTime', 'PUT', data, successCallback, errorCallBack);

export const dispatchPartDashboardShow = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/getDispatchWithVehicle/post', 'POST', data, successCallback, errorCallBack);
export const StartTimePartDashboardShow = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/updateStartTime/update', 'POST', data, successCallback, errorCallBack);

export const dispatchPartNoDashboardShow = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/dashboardShowPartNo', 'POST', data, successCallback, errorCallBack);
export const FooterdispatchDashboardShow = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/dailydashboardcontractno', 'POST', data, successCallback, errorCallBack);
export const FooterdispatchPartDashboardShow = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/footerPartNo/show', 'POST', data, successCallback, errorCallBack);
export const ShowDelNoteShow = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/searchShipment/DelNoteNo', 'POST', data, successCallback, errorCallBack);
export const DispatchDelnoteSearch = (data, successCallback, errorCallBack) => _fetchService(`dispatchDashboard/showdropdown/dropdown?search=${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const ShowDelNoteManual = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/getContractsByShipmentDate/show', 'POST', data, successCallback, errorCallBack);
export const ShowDelNoteNoteShow = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/getFIMValuesByContract/fim', 'POST', data, successCallback, errorCallBack);
export const UpdatedispatchDashboardShow = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/updateFimStatus/dispatch', 'PUT', data, successCallback, errorCallBack);
export const FilterContractNumber = (data, successCallback, errorCallBack) => _fetchService(`dispatchDashboard/getContractDetails/filter/${data.code}`, 'GET', {}, successCallback, errorCallBack);
export const PartFilterDelNote = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/getDelNotesByDeliveryDate/date', 'POST', data, successCallback, errorCallBack);
export const PartShowDelNote = (data, successCallback, errorCallBack) => _fetchService('dispatchDashboard/getPartFilteredData/showparts', 'POST', data, successCallback, errorCallBack);


// QC INWARD PURCHASE BILL
export const SearchInwardPo = (data, successCallback, errorCallBack) => _fetchService(`inwardQc/searchPo?q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);
// QC INWARD PURCHASE BILL Without PO
export const SearchInwardPoWithoutPo = (data, successCallback, errorCallBack) => _fetchService(`inwardQc/withoutPo/searchPo?q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);

//////Quality Import///
export const QualityImport = (data, successCallback, errorCallBack) => _fetchService(`qcRule/import`, 'POST', data, successCallback, errorCallBack);

/////mapInfect/Import///
export const MapInflectQualityImport = (data, successCallback, errorCallBack) => _fetchService(`mapInfect/import`, 'POST', data, successCallback, errorCallBack);

/////Add Tool////
export const AddToolList = (data, successCallback, errorCallBack) => _fetchService('addtool/addtool', 'POST', data, successCallback, errorCallBack);
export const EditShowToolList = (data, successCallback, errorCallBack) => _fetchService(`addtool/updatetool/${data?.id}`, 'PUT', data, successCallback, errorCallBack);
export const ShowToolList = (successCallback, errorCallBack) => _fetchService('addtool/gettool', 'GET', {}, successCallback, errorCallBack);
export const DeleteShowToolList = (data, successCallback, errorCallBack) => _fetchService(`addtool/deletetool/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const AddToolListImport = (data, successCallback, errorCallBack) => _fetchService(`addtool/importtool`, 'POST', data, successCallback, errorCallBack);

///Tool Complaint///
export const AddComplaintList = (data, successCallback, errorCallBack) => _fetchService('toolComplaint/storeComplaint', 'POST', data, successCallback, errorCallBack);
export const EditComplaintList = (data, successCallback, errorCallBack) => _fetchService(`toolComplaint/updateComplaint/${data?.id}`, 'PUT', data, successCallback, errorCallBack);
export const ShowComplaintList = (successCallback, errorCallBack) => _fetchService('toolComplaint', 'GET', {}, successCallback, errorCallBack);
export const ShowComplaintMachineList = (successCallback, errorCallBack) => _fetchService('toolComplaint/getToolsByMachine', 'GET', {}, successCallback, errorCallBack);
export const DeleteComplaintList = (data, successCallback, errorCallBack) => _fetchService(`addtool/deletetool/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const ComplaintToolNameShow = (data, successCallback, errorCallBack) => _fetchService(`toolComplaint/getToolNameByToolNo/display`, 'POST', data, successCallback, errorCallBack);
export const ComplaintMachineToolNoShow = (data, successCallback, errorCallBack) => _fetchService(`toolComplaint/getToolNoByMachineId/show`, 'POST', data, successCallback, errorCallBack);
export const ShowComplaintOperatorList = (successCallback, errorCallBack) => _fetchService('toolComplaint/operatorlist', 'GET', {}, successCallback, errorCallBack);

///Tool report/////
export const GetGrindingToolsreportList = (data, successCallback, errorCallBack) => _fetchService('toolComplaint/getGrindReport', 'POST', data, successCallback, errorCallBack);


///
// Part No Vs Process Vs Tools
export const PartNoVsProcessSearch = (data, successCallback, errorCallBack) => _fetchService(`partvstoolvsprocess/search/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const PartNoVsProcessEntry = (data, successCallback, errorCallBack) => _fetchService(`toolmonitoring/searchByName?q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);
export const ProcessToolList = (successCallback, errorCallBack) => _fetchService('partvstoolvsprocess/getpartnovstool', 'GET', {}, successCallback, errorCallBack);
export const ProcessToolMachineList = (successCallback, errorCallBack) => _fetchService('machine/show', 'GET', {}, successCallback, errorCallBack);
export const ProcessToolProcessList = (data, successCallback, errorCallBack) => _fetchService(`partvstoolvsprocess/getmachineprocess/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const ProcesstoolNoList = (successCallback, errorCallBack) => _fetchService('partvstoolvsprocess/gettool', 'GET', {}, successCallback, errorCallBack);
export const ProcesstoolImport = (data, successCallback, errorCallBack) => _fetchService(`addtool/importtool`, 'POST', data, successCallback, errorCallBack);
export const AddProcessToolvs = (data, successCallback, errorCallBack) => _fetchService('partvstoolvsprocess/addpartnovstool', 'POST', data, successCallback, errorCallBack);
export const EditProcessToolvs = (data, successCallback, errorCallBack) => _fetchService(`partvstoolvsprocess/updatepartnovstool/${data?.id}`, 'PUT', data, successCallback, errorCallBack);
export const DeleteProcessToolvs = (data, successCallback, errorCallBack) => _fetchService(`partvstoolvsprocess/deletepartnovstool/${data?.id}`, 'DELETE', data, successCallback, errorCallBack);
////Tool Reports///
export const ToolReportbyMachine = (data, successCallback, errorCallBack) => _fetchService(`toolreport/toolbymachine/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const OperatorList = (successCallback, errorCallBack) => _fetchService(`toolComplaint/getOperators`, 'GET', {}, successCallback, errorCallBack);
export const ReplacementAlertReport = (data, successCallback, errorCallBack) => _fetchService('toolreport/toolalertreport', 'POST', data, successCallback, errorCallBack);
export const MissingToolReport = (data, successCallback, errorCallBack) => _fetchService('toolComplaint/getMissingReports/show ', 'POST', data, successCallback, errorCallBack);
export const BrokenToolReport = (data, successCallback, errorCallBack) => _fetchService('toolComplaint/getBrokenReports/report', 'POST', data, successCallback, errorCallBack);
export const OperatorToolReport = (data, successCallback, errorCallBack) => _fetchService('toolComplaint/getComplaintsByFilter/operator ', 'POST', data, successCallback, errorCallBack);

/////Tool Monitoring
export const ToolMonitoringSearched = (data, successCallback, errorCallBack) => _fetchService(`toolmonitoring/gettools/${data.id}`, 'GET', {}, successCallback, errorCallBack);
export const ToolsShowdata = (successCallback, errorCallBack) => _fetchService('toolmonitoring/gettoolmonitor', 'GET', {}, successCallback, errorCallBack);
export const ToolsGrindingShowdata = (successCallback, errorCallBack) => _fetchService('toolComplaint/getGrindingTools', 'GET', {}, successCallback, errorCallBack);
export const ToolGrindingDelete = (data, successCallback, errorCallBack) => _fetchService(`toolgrinding/deletegrinding/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const ToolMonitoringDelete = (data, successCallback, errorCallBack) => _fetchService(`toolmonitoring/deletetoolmonitor/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
// OPEN PO XL UPLOAD
export const OpenPoXlUpload = (data, successCallback, errorCallBack) => _fetchService(`dispatchExl/importPart`, 'POST', data, successCallback, errorCallBack);
export const UploadOpenPoXlValidData = (data, successCallback, errorCallBack) => _fetchService(`dispatchExl/partUpload`, 'POST', data, successCallback, errorCallBack);

///Email Settings///
export const ShowEmailSetting = (successCallback, errorCallBack) => _fetchService('master/getEmailSettings', 'GET', {}, successCallback, errorCallBack);
export const EditEmailSetting = (data, successCallback, errorCallBack) => _fetchService(`master/updateEmailSettings/${data.id}`, 'PUT', data, successCallback, errorCallBack);

///NPD MRP settings///
export const MRPGenerationNPD = (data, successCallback, errorCallBack) => _fetchService(`mrp`, 'POST', data, successCallback, errorCallBack);
//Remarks Master
export const RemarksShowData = (successCallback, errorCallBack) => _fetchService('dashboardRemarks/showRemarks', 'GET', {}, successCallback, errorCallBack);
export const RemarksDelete = (data, successCallback, errorCallBack) => _fetchService(`dashboardRemarks/deleteRemark/${data.id}`, 'DELETE', data, successCallback, errorCallBack);
export const AddRemarks = (data, successCallback, errorCallBack) => _fetchService('dashboardRemarks/addRemark', 'POST', data, successCallback, errorCallBack);
export const AddRemarksUpdate = (data, successCallback, errorCallBack) => _fetchService(`dashboardRemarks/updateRemark/${data?.id}`, 'PUT', data, successCallback, errorCallBack);
export const RemarksUpdate = (data, successCallback, errorCallBack) => _fetchService(`dispatchDashboard/updateSobRemarks`, 'PUT', data, successCallback, errorCallBack);
export const RemarkPartsUpdate = (data, successCallback, errorCallBack) => _fetchService(`dispatchDashboard/updatePartRemarks`, 'PUT', data, successCallback, errorCallBack);
export const RemarkPartsDashboardUpdate = (data, successCallback, errorCallBack) => _fetchService(`dispatchDashboard/postRemarks`, 'POST', data, successCallback, errorCallBack);

///NRDC Item Wise Report///
export const NEDCItemWiseReport = (data, successCallback, errorCallBack) => _fetchService(`noCustomerdc/getData`, 'POST', data, successCallback, errorCallBack);
///NRDC Customer Wise Report///
export const NEDCustomerWiseReport = (data, successCallback, errorCallBack) => _fetchService(`accountRepo/customer/nrdc`, 'POST', data, successCallback, errorCallBack);

///////PO Authorized Report//
export const PoAuthorizedReport = (data, successCallback, errorCallBack) => _fetchService('poGenerate/report/authorization', 'POST', data, successCallback, errorCallBack);

////Lotwise Stock Reports///
export const LotwiseStockReportList = (data, successCallback, errorCallBack) => _fetchService(`poBill/report/lotwiseStock`, 'POST', data, successCallback, errorCallBack);
////Lotwise Stock Reports///
export const MrnReportList = (data, successCallback, errorCallBack) => _fetchService(`mrn/getMrnDetails`, 'POST', data, successCallback, errorCallBack);

//Inwaard Discrepancy Report//
export const InwardDiscrepancyReportList = (data, successCallback, errorCallBack) => _fetchService(`poBill/postPoReport`, 'POST', data, successCallback, errorCallBack);

///ItC04///
export const ITC04JobworkIssueReportList = (data, successCallback, errorCallBack) => _fetchService(`jobWork-issue/itcJwReport`, 'POST', data, successCallback, errorCallBack);

export const DailyStockReportList = (data, successCallback, errorCallBack) => _fetchService(`accountRepo/dailyStock`, 'POST', data, successCallback, errorCallBack);


export const ForecastVsPoReport = (data, successCallback, errorCallBack) => _fetchService(`poFC/report/fcVsPo`, 'POST', data, successCallback, errorCallBack);
export const ITC04ReceiptReportList = (data, successCallback, errorCallBack) => _fetchService(`jobWork-issue/getJobworkReceiptsReport`, 'POST', data, successCallback, errorCallBack);

// export const UnderLedgerShowData = (successCallback, errorCallBack) => _fetchService('itemMaster/underLedger', 'GET', {}, successCallback, errorCallBack);
export const UnderLedgerShowData = (successCallback, errorCallBack) => _fetchService('accountRepo/itemLedjer', 'GET', {}, successCallback, errorCallBack);



///sUPPLIER dELIVERY rATING///
export const SupplierDeliveryReportList = (data, successCallback, errorCallBack) => _fetchService(`poGenerate/report/deliveryRate`, 'POST', data, successCallback, errorCallBack);


export const MaterialReturnNotepreview = (data, successCallback, errorCallBack) => _fetchService(`mrn/view?type=${data.type}&category=${data.category}&id=${data.id}`, 'GET', {}, successCallback, errorCallBack);

export const MeteraialMRNList = (data, successCallback, errorCallBack) => _fetchService(`mrn/search?q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);

export const DeliveryExcelList = (data, successCallback, errorCallBack) => _fetchService(`dispatchExl/search/excelId?q=${data?.code}`, 'GET', {}, successCallback, errorCallBack);

//dispatch Lock

export const DispatchDashboardLock = (data, successCallback, errorCallBack) => _fetchService(`dispatchDashboard/screenCheck?type=${data.type}`, 'GET', {}, successCallback, errorCallBack);
///Mutli XmL///
export const MultiXmlPrint = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/multiInvoiceXml`, 'POST', data, successCallback, errorCallBack);

//jobwork receipt

export const JobWorkReceipt = (data, successCallback, errorCallBack) => _fetchService(`jobWork-reciept/?jwrId=${data?.id}&type=${data?.type}`, 'GET', {}, successCallback, errorCallBack);
export const ShowJobWorkReceipt = (data, successCallback, errorCallBack) => _fetchService(`documentnumber/generateDocNo?docType=JobworkReceipt`, 'GET', {}, successCallback, errorCallBack);


////Multi XML Print///

export const MultiDocumentShow = (successCallback, errorCallBack) => _fetchService('gstInvoice/getDispatchList', 'GET', {}, successCallback, errorCallBack);

export const MultiInvoiceLoadList = (data, successCallback, errorCallBack) => _fetchService(`gstInvoice/multiInvoiceView`, 'POST', data, successCallback, errorCallBack);

////Customer Delivery Schedule///
export const customerdeliveryscheduleList = (data, successCallback, errorCallBack) => _fetchService(`dispatch/custDelSchedule`, 'POST', data, successCallback, errorCallBack);

export const ToolUsageReportList = (data, successCallback, errorCallBack) => _fetchService(`toolComplaint/getUsageReport`, 'POST', data, successCallback, errorCallBack);


////mrn/////
export const meterialXLUpload = (data, successCallback, errorCallBack) => _fetchService('mrn/importItems/import', 'POST', data, successCallback, errorCallBack);

//////Against Po Upload///
export const AgainstPoUpload = (data, successCallback, errorCallBack) => _fetchService(`inwardQc/multiQcFile/upload/${data?.id}`, 'POST', data, successCallback, errorCallBack);

/////Transaction Lock Settings///
export const TransactionLockSettingsShow = (successCallback, errorCallBack) => _fetchService('module', 'GET', {}, successCallback, errorCallBack);

export const TransactionModuleLock = (data, successCallback, errorCallBack) => _fetchService('module/lock', 'POST', data, successCallback, errorCallBack);

export const TransactionModuleUnlock = (data, successCallback, errorCallBack) => _fetchService(`module/unLock`, 'POST', data, successCallback, errorCallBack);


///////FPY///////
export const FpyListreport = (data, successCallback, errorCallBack) => _fetchService(`processInspec/report/fpy`, 'POST', data, successCallback, errorCallBack);

export const COPQListreport = (data, successCallback, errorCallBack) => _fetchService(`qcMst/copqRepo`, 'POST', data, successCallback, errorCallBack);

export const PPMCalculationListreport = (data, successCallback, errorCallBack) => _fetchService(`processInspec/report/ppm`, 'POST', data, successCallback, errorCallBack);

///////description Master////
export const DescriptionMasterAdd = (data, successCallback, errorCallBack) => _fetchService('qcMst/copq/desc', 'POST', data, successCallback, errorCallBack);

export const DescriptionMasterUpdate = (data, successCallback, errorCallBack) => _fetchService(`qcMst/copq/desc/${data.id}`, 'PUT', data, successCallback, errorCallBack);

// export const ReworkreasonDelete = (data, successCallback, errorCallBack) => _fetchService(`qltyReason/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const DescriptionMasterShowData = (successCallback, errorCallBack) => _fetchService(`qcMst/copq/desc`, 'GET', {}, successCallback, errorCallBack);


///////description Log Master////
export const DescriptionMasterLogAdd = (data, successCallback, errorCallBack) => _fetchService('qcMst/copq/descLog', 'POST', data, successCallback, errorCallBack);

export const DescriptionMasterLogUpdate = (data, successCallback, errorCallBack) => _fetchService(`qcMst/copq/descLog/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const DescriptionMasterLogDelete = (data, successCallback, errorCallBack) => _fetchService(`qcMst/copq/descLog/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const DescriptionMasterLogShowData = (successCallback, errorCallBack) => _fetchService(`qcMst/copq/descLog`, 'GET', {}, successCallback, errorCallBack);


/////FPYSelction Api///////
export const FPYDetaildReportList = (data, successCallback, errorCallBack) => _fetchService('processInspec/report/fpyDetail', 'POST', data, successCallback, errorCallBack);


/////Price map///

export const PriceMapAdd = (data, successCallback, errorCallBack) => _fetchService('qcMst/copq/priceMap', 'POST', data, successCallback, errorCallBack);

export const PriceMapChangeUpdate = (data, successCallback, errorCallBack) => _fetchService(`qcMst/copq/priceMap/${data.id}`, 'PUT', data, successCallback, errorCallBack);

export const PriceMapChangeDelete = (data, successCallback, errorCallBack) => _fetchService(`qcMst/copq/priceMap/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const PriceMapChangeShowList = (successCallback, errorCallBack) => _fetchService(`qcMst/copq/priceMap`, 'GET', {}, successCallback, errorCallBack);


export const PriceRangeShowList = (data, successCallback, errorCallBack) => _fetchService(`itemVsPm/priceGroup/${data?.id}`, 'GET', {}, successCallback, errorCallBack);


export const MachineShowList = (successCallback, errorCallBack) => _fetchService(`addtool/machines`, 'GET', {}, successCallback, errorCallBack);

export const ToolListByMachineId = (data, successCallback, errorCallBack) => _fetchService(`addtool/list?machineId=${data?.id}`, 'GET', {}, successCallback, errorCallBack);

export const COPQDetailsView = (data, successCallback, errorCallBack) => _fetchService('qcMst/copqRepo/detail', 'POST', data, successCallback, errorCallBack);

export const ProblemCategoryShowList = (successCallback, errorCallBack) => _fetchService(`master/problemCategory`, 'GET', {}, successCallback, errorCallBack);

export const NatureOfProblemShowList = (successCallback, errorCallBack) => _fetchService(`master/natureOfProblem`, 'GET', {}, successCallback, errorCallBack);

export const ToolUOMShowList = (successCallback, errorCallBack) => _fetchService(`master/uom`, 'GET', {}, successCallback, errorCallBack);

export const MaintanaceMachineShowList = (successCallback, errorCallBack) => _fetchService(`maintenance/machines`, 'GET', {}, successCallback, errorCallBack);

export const MaintanenceSupervisorList = (successCallback, errorCallBack) => _fetchService(`maintenance/supervisors`, 'GET', {}, successCallback, errorCallBack);

export const MaintanenceOperatorList = (successCallback, errorCallBack) => _fetchService(`maintenance/operators`, 'GET', {}, successCallback, errorCallBack);

export const MaintanenceScheduleAddList = (data, successCallback, errorCallBack) => _axiosService(`maintenance/schedule`, 'POST', data, successCallback, errorCallBack);

export const MaintanenceApprovRejList = (data, successCallback, errorCallBack) => _axiosService(`maintenance/schedule/process`, 'POST', data, successCallback, errorCallBack);

export const MaintanenceScheduleList = (successCallback, errorCallBack) => _fetchService(`maintenance/schedule?status=Pending`, 'GET', {}, successCallback, errorCallBack);

export const BreakDownMaintenanceRecordList = (data, successCallback, errorCallBack) => _fetchService(`maintenance/records/breakdown?from_date=${data?.from_date}&to_date=${data?.to_date}`, 'GET', {}, successCallback, errorCallBack);

export const MaintanenceDetailsList = (data, successCallback, errorCallBack) => _fetchService(`maintenance/details?scheduleId=${data?.scheduleId}`, 'GET', {}, successCallback, errorCallBack);

export const MaintanenceApprovedList = (successCallback, errorCallBack) => _fetchService(`maintenance/schedule?status=Approved`, 'GET', {}, successCallback, errorCallBack);

export const MaintanenceRejectedList = (successCallback, errorCallBack) => _fetchService(`maintenance/schedule?status=Rejected`, 'GET', {}, successCallback, errorCallBack);

export const MaintanenceCompletedList = (successCallback, errorCallBack) => _fetchService(`maintenance/schedule?status=Completed`, 'GET', {}, successCallback, errorCallBack);

export const MaintanenceMtbfList = (data, successCallback, errorCallBack) => _fetchService(`maintenance/mtbf?from_date=${data?.from_date}&to_date=${data?.to_date}`, 'GET', {}, successCallback, errorCallBack);

export const TemplateSectionList = (data, successCallback, errorCallBack) => _fetchService(`checklist/template/sections/${data?.id}`, 'GET', {}, successCallback, errorCallBack);

export const DeleteTemplateList = (data, successCallback, errorCallBack) => _fetchService(`checklist/template/${data.id}`, 'DELETE', data, successCallback, errorCallBack);

export const ChecklistToolList = (data, successCallback, errorCallBack) => _fetchService(`checklist/master/tool/${data?.id}`, 'GET', {}, successCallback, errorCallBack);
