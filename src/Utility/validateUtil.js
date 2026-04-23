/* eslint-disable max-len */
/* eslint-disable no-useless-escape */
export default function validate(typeToValidate, valueToValidate) {
  console.log('recive data for validation ===>', typeToValidate, valueToValidate);
  switch (typeToValidate) {
    case 'email':
      return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        .test(valueToValidate);
    case 'employeeId':
      return (/^(?!\s*$).+/).test(valueToValidate);
    case 'vendorCode':
      return (/^(?!\s*$).+/).test(valueToValidate);
    case 'customerId':
      return (/^(?!\s*$).+/).test(valueToValidate);
    case 'mobileNo':
      return (/^[789]\d{9}$|^$/).test(valueToValidate);
    case 'phoneNo':
      return (/^[789]\d{9}$|^$/).test(valueToValidate);
    case 'phoneNumber':
      return (/^[789]\d{9}$|^$/).test(valueToValidate);
    case 'userName':
      return /^[a-zA-Z]+$/.test(valueToValidate);
    case 'groupName':
      return /^[a-zA-Z0-9]+$/.test(valueToValidate);
    case 'vendorName':
      return (/^(?!\s*$).+/).test(valueToValidate);
    case 'address':
      return (/^(?!\s*$).+/).test(valueToValidate);
    case 'customerAddress':
      return (/^(?!\s*$).+/).test(valueToValidate);
    case 'customerLogo':
      return (/^(?!\s*$).+/).test(valueToValidate);
    case 'customerTheme':
      return (/^(?!\s*$).+/).test(valueToValidate);
    case 'companyName':
      return (/^[a-zA-Z][a-zA-Z.\s]+$/).test(valueToValidate);
    case 'category':
      return (/^[a-zA-Z][a-zA-Z.\s]+$/).test(valueToValidate);
    case 'contactPersonName':
      return (/^[a-zA-Z]+$/).test(valueToValidate);
    case 'companyCode':
      return (/^(?!\s*$).+/).test(valueToValidate);
    case 'emailId':
      return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
        .test(valueToValidate);
    case 'contactPerson':
      return (/^[a-zA-Z][a-zA-Z.\s]+$/).test(valueToValidate);
    case 'categoryName':
      return (/^(?!\s*$).+/).test(valueToValidate);
    case 'categoryDescription':
      return (/^(?!\s*$).+/).test(valueToValidate);
    case 'stateName':
      return (/^[a-zA-Z][a-zA-Z.\s]+$/).test(valueToValidate);
    case 'branchName':
      return (/^[a-zA-Z][a-zA-Z.\s]+$/).test(valueToValidate);
    case 'facilityName':
      return (/^[a-zA-Z0-9\s,'-]*$/).test(valueToValidate);
    case 'labDepName':
      return (/^[a-zA-Z][a-zA-Z.\s]+$/).test(valueToValidate);
    case 'labDepMap':
      return (/^(?!\s*$).+/).test(valueToValidate);
    case 'number':
      return (/^\d+$/).test(valueToValidate);
    case 'Decimalnumber':
      return (/^(\d{1,9}|\d{1,9}\.\d{1,9})$/).test(valueToValidate);
    case 'NegativeDecimalnumber':
      return (/^-?[0-9]\d*(\.\d+)?$/).test(valueToValidate);
    case 'gstNumber':
      return (/^[a-zA-Z0-9\-]{15}$/).test(valueToValidate);
    default:
      return false;
  }
}
