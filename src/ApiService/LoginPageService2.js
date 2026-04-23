/* eslint-disable max-len */
import { data } from 'autoprefixer';
import ApplicationStore from '../Utility/localStorageUtil';

const successCaseCode = [200, 201];

const _fetchService = (PATH, serviceMethod, data, successCallback, errorCallBack) => {
  const { accessToken, userDetails } = ApplicationStore().getStorage('userDetails');
  const END_POINT = process.env.REACT_APP_SECON_API_URL;

  const { email, userRole, companyCode, id, userName } = userDetails;

  const headers = {
    'Content-Type': 'application/json',
    authorization: `Bearer ${accessToken}`,
    companyCode: `${companyCode}`,
    userName: `${userName}`,
    userRole: `${userRole}`,
    id: `${id}`,
    email: `${email}`
  };

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
      if (successCaseCode.indexOf(response.status) > -1) {
        return response.json();
      }
      // eslint-disable-next-line no-throw-literal
      throw {
        errorStatus: response.status,
        errorObject: response.json(),
      };
    })
    .then((dataResponse) => successCallback(dataResponse))
    .catch((error) => {
      error.errorObject.then((errorResponse) => {
        if (error.errorStatus === 401 && errorResponse.message === 'Unable to access the page, Token Expired') {

          ApplicationStore().clearStorage();
          window.location.reload();
        }
        errorCallBack(error.errorStatus, errorResponse.message);
      });
    });
};

export const HmiMachineDropDown = (successCallback, errorCallBack) => _fetchService('hmi/machineDropDown', 'GET', {}, successCallback, errorCallBack);

export const OeeOeeDownReason = (successCallback, errorCallBack) => _fetchService('oee/OeeDownReason', 'GET', {}, successCallback, errorCallBack);
