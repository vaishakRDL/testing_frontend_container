// import React from 'react';

// const DownloadExcel = () => {
//   const handleDownload = () => {
//     fetch('http://192.168.1.74:8000/api/cslExl/contractsExport', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify([
//         {
//           "52KV1146": [
//             {
//               "contractNo": "52KV1146",
//               "partNo": "WAA24600D800",
//               "Qty": 1,
//               "desc": "CAR DOOR OPERATOR ASSY",
//               "boxNo": "RFIM9.1"
//             },
//             {
//               "contractNo": "52KV1146",
//               "partNo": "NAA413AV999_8CX21C-SS430",
//               "Qty": 1,
//               "desc": "ASSEMBLY PANEL RIGHT",
//               "boxNo": "RFIM9.3"
//             }
//           ]
//         },
//         {
//           "52ND0869": [
//             {
//               "contractNo": "52ND0869",
//               "partNo": "NAA24591AH1",
//               "Qty": 1,
//               "desc": "DOOR SENSOR",
//               "boxNo": "CFIM11.1"
//             },
//             {
//               "contractNo": "52ND0869",
//               "partNo": "NAA27076DC3",
//               "Qty": 1,
//               "desc": "HARDWARE KIT-SENSOR MOUNTING",
//               "boxNo": "CFIM11.12"
//             }
//           ]
//         }
//       ])
//     })
//     .then(response => response.blob())
//     .then(blob => {
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.style.display = 'none';
//       a.href = url;
//       a.download = 'contract-details.xlsx';
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//     })
//     .catch(error => console.error('Error downloading the file:', error));
//   };

//   return (
//     <div>
//       <button onClick={handleDownload}>Download Excel</button>
//     </div>
//   );
// };

// export default DownloadExcel;


const _fetchServiceDownloadFile = (PATH, serviceMethod, data, successCallback, errorCallBack, fileName, reportType, contentType) => {
    const END_POINT = process.env.REACT_APP_API_URL;
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
  
    const body = serviceMethod === 'POST' ? JSON.stringify(data) : null;
  
    const fetchOptions = {
      method: serviceMethod,
      headers: headers,
      body: body,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    };
  
    fetch(`${END_POINT}${PATH}`, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName || 'downloaded-file.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        if (typeof successCallback === 'function') {
          successCallback();
        }
      })
      .catch(error => {
        console.error('Error downloading the file:', error);
        if (typeof errorCallBack === 'function') {
          errorCallBack(error);
        }
      });
  };
  
  export const CslExlContractsExport = (data, successCallback, errorCallBack) => {
    return _fetchServiceDownloadFile(
      'cslExl/import',
      'POST',
      data,
      successCallback,
      errorCallBack,
      'Report.xlsx',
      'download',
      'application/xlsx'
    );
  };
  

