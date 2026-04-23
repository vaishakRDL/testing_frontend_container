// const ApplicationStore = () => {

//   function setStorage(storageKey, storageData) {
//     sessionStorage.setItem(storageKey, JSON.stringify(storageData));
//   }

//   function getStorage(storageKey) {
//     const dataObject = sessionStorage.getItem(storageKey) ? JSON.parse(sessionStorage.getItem(storageKey)) : '';
//     return dataObject;
//   }

//   function clearStorage() {
//     sessionStorage.clear();
//   }

//   return {
//     setStorage,
//     getStorage,
//     clearStorage,
//   };
// };

// export default ApplicationStore;
const ApplicationStore = () => {

  function setStorage(storageKey, storageData) {
    localStorage.setItem(storageKey, JSON.stringify(storageData));
  }

  function setStorage2(storageKey, storageData) {
    sessionStorage.setItem(storageKey, JSON.stringify(storageData));
  }

  function getStorage2(storageKey) {
    const dataObject = sessionStorage.getItem(storageKey) ? JSON.parse(sessionStorage.getItem(storageKey)) : '';
    return dataObject;
  }

  function getStorage(storageKey) {
    const dataObject = localStorage.getItem(storageKey) ? JSON.parse(localStorage.getItem(storageKey)) : '';
    return dataObject;
  }

  function clearStorage() {
    localStorage.clear();
  }

  function clearStorage2() {
    sessionStorage.clear();
  }

  return {
    setStorage,
    getStorage,
    clearStorage,
    setStorage2,
    getStorage2,
    clearStorage2,
  };
};

export default ApplicationStore;

