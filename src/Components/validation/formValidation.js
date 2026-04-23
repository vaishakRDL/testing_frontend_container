/* eslint-disable indent */

import validate from "../../Utility/validateUtil";

const AddUserValidate = (value, type, setErrorObject) => {

  switch (type) {
    case 'email':
      setErrorObject((oldErrorState) => {
        let status = {};
        if (!validate('email', value)) {
          status = {
            errorStatus: true,
            helperText: 'Enter a valid email id',
          };
        } else {
          status = {
            errorStatus: false,
            helperText: '',
          };
        }
        return {
          ...oldErrorState,
          email: status, // Corrected from fullName to userName
        };
      });
      break;

    case 'employeeId': setErrorObject((oldErrorState) => {
      let status = {};
      if (!validate('employeeId', value)) {
        status = {
          errorStatus: true,
          helperText: 'Enter a valid Employee Id',
        };
      } else {
        status = {
          errorStatus: false,
          helperText: '',
        };
      }
      return {
        ...oldErrorState,
        employeeId: status,
      };
    });
      break;
    case 'mobileNo': setErrorObject((oldErrorState) => {
      let status = {};
      if (!validate('mobileNo', value)) {
        status = {
          errorStatus: true,
          helperText: 'Enter a valid Phone number',
        };
      } else {
        status = {
          errorStatus: false,
          helperText: '',
        };
      }
      return {
        ...oldErrorState,
        mobileNo: status,
      };
    });
      break;
    case 'userName':
      setErrorObject((oldErrorState) => {
        let status = {};
        if (!validate('userName', value)) {
          status = {
            errorStatus: true,
            helperText: 'Enter the full name',
          };
        } else {
          status = {
            errorStatus: false,
            helperText: '',
          };
        }
        return {
          ...oldErrorState,
          userName: status, // Corrected from fullName to userName
        };
      });
      break;
    case 'groupName':
      setErrorObject((oldErrorState) => {
        let status = {};
        if (!validate('groupName', value)) {
          status = {
            errorStatus: true,
            helperText: 'Enter the Valid Group Name',
          };
        } else {
          status = {
            errorStatus: false,
            helperText: '',
          };
        }
        return {
          ...oldErrorState,
          groupName: status, // Corrected from fullName to userName
        };
      });
      break;
    case 'customerCode':
      setErrorObject((oldErrorState) => {
        let status = {};
        if (!validate('groupName', value)) {
          status = {
            errorStatus: true,
            helperText: 'Enter the Valid customer Code',
          };
        } else {
          status = {
            errorStatus: false,
            helperText: '',
          };
        }
        return {
          ...oldErrorState,
          customerCode: status, // Corrected from fullName to userName
        };
      });
      break;
    case 'gstNumber':
      setErrorObject((oldErrorState) => {
        let status = {};
        if (!validate('gstNumber', value)) {
          status = {
            errorStatus: true,
            helperText: 'Enter the Valid GST No',
          };
        } else {
          status = {
            errorStatus: false,
            helperText: '',
          };
        }
        return {
          ...oldErrorState,
          gstNumber: status, // Corrected from fullName to userName
        };
      });
      break;
    case 'customerName':
      setErrorObject((oldErrorState) => {
        let status = {};
        if (!validate('userName', value)) {
          status = {
            errorStatus: true,
            helperText: 'Enter the full name',
          };
        } else {
          status = {
            errorStatus: false,
            helperText: '',
          };
        }
        return {
          ...oldErrorState,
          customerName: status, // Corrected from fullName to userName
        };
      });
      break;
    case 'customerAddress':
      setErrorObject((oldErrorState) => {
        let status = {};
        if (!validate('customerAddress', value)) {
          status = {
            errorStatus: true,
            helperText: 'Enter the Valid Address',
          };
        } else {
          status = {
            errorStatus: false,
            helperText: '',
          };
        }
        return {
          ...oldErrorState,
          customerAddress: status, // Corrected from fullName to userName
        };
      });
      break;
    case 'city':
      setErrorObject((oldErrorState) => {
        let status = {};
        if (!validate('userName', value)) {
          status = {
            errorStatus: true,
            helperText: 'Enter the Valid City',
          };
        } else {
          status = {
            errorStatus: false,
            helperText: '',
          };
        }
        return {
          ...oldErrorState,
          city: status, // Corrected from fullName to userName
        };
      });
      break;
    case 'pincode':
      setErrorObject((oldErrorState) => {
        let status = {};
        if (!validate('number', value)) {
          status = {
            errorStatus: true,
            helperText: 'Enter the Valid Pin code',
          };
        } else {
          status = {
            errorStatus: false,
            helperText: '',
          };
        }
        return {
          ...oldErrorState,
          pincode: status, // Corrected from fullName to userName
        };
      });
      break;

    case 'state':
      setErrorObject((oldErrorState) => {
        let status = {};
        if (!validate('userName', value)) {
          status = {
            errorStatus: true,
            helperText: 'Enter the Valid state',
          };
        } else {
          status = {
            errorStatus: false,
            helperText: '',
          };
        }
        return {
          ...oldErrorState,
          state: status, // Corrected from fullName to userName
        };
      });
      break;
    case 'country':
      setErrorObject((oldErrorState) => {
        let status = {};
        if (!validate('userName', value)) {
          status = {
            errorStatus: true,
            helperText: 'Enter the Valid country',
          };
        } else {
          status = {
            errorStatus: false,
            helperText: '',
          };
        }
        return {
          ...oldErrorState,
          country: status, // Corrected from fullName to userName
        };
      });
      break;


    default:
      break;
  }
};


export { AddUserValidate };
