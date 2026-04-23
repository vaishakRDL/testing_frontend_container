import React, { useEffect, useState } from 'react'
import DocumentNumber_title from './DocumentNumber_title'
import { Button, Card, CircularProgress } from '@mui/material'
import { SavedocumentNumber, ShowdocumentNumber } from '../../ApiService/LoginPageService';
import NotificationBar from '../GlobleFiles/ServiceNotificationBar';
import { useModuleLocks } from '../context/ModuleLockContext';

const DocumentNumberResult = () => {
  const moduleLocks = useModuleLocks();
  const isModuleLocked =
    moduleLocks.find(m => m.moduleName === "Document Number")?.lockStatus === "locked";
  const [Showdocumentnumber, setShowdocumentnumber] = useState([]);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [isPfxWiseReset, setIsPfxWiseReset] = useState(false);
  const [isDocumentChange, setIsDocumentChange] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [prefix, setPrefix] = useState([]);
  const [openNotification, setNotification] = useState({
    status: false,
    type: 'error',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ShowdocumentNumber(handlesuccess, handleexception);
  }, [refreshData]);


  const handlesuccess = (dataObject) => {
    setShowdocumentnumber(dataObject.data)
    setPrefix(dataObject.prefixRows)
  }

  const handleexception = (error) => {

  }

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    // Add event listener to update height on resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);



  const template = prefix.length > 0 ? [
    '',
    prefix[0].prefix,
    prefix[0].yrFrom,
    prefix[0].yrTo,
    prefix[0].shYrFrom,
    prefix[0].shYrTo,
    prefix[0].docNo,
    prefix[0].shDocNo,
    prefix[0].docNo1,
    prefix[0].docNo2,
    prefix[0].week,
    prefix[0].symbol,
    prefix[0].docNo3
  ] : [];



  const handleEdits = (cellNam, newValue, id, rowData) => {
    const updatedData = Showdocumentnumber.map((cell) =>
      cell.id === id
        ? {
          ...cell,
          [cellNam]: newValue, // Update the edited cell
          generated_no: Array.from({ length: 14 }, (_, i) => `sel${i + 1}`)
            .map((key) => template[rowData[key]] || (key === cellNam ? template[newValue] || "" : ""))
            .join("")
        }
        : cell
    );

    setShowdocumentnumber(updatedData);
  };

  const handleEdit = (cellNam, newValue, id) => {
    if (isModuleLocked) return; {
      setShowdocumentnumber((prevData) =>
        prevData.map((cell) => {
          if (cell.id !== id) return cell;

          const updatedCell = { ...cell, [cellNam]: newValue };
          updatedCell.generated_no = Array.from({ length: 14 }, (_, i) => `sel${i + 1}`)
            .map((key) => template[updatedCell[key]] || (key === cellNam ? template[newValue] || "" : ""))
            .join("");

          return updatedCell;
        })
      );
    }
  };

  const handlecheckbox1 = (cellName, isChecked, id, rowData) => {
    const updatedSel1 = Showdocumentnumber.map((cell) =>
      cell.id === id
        ? {
          ...cell,
          Pfx_Wise_resetno: isChecked ? 1 : 0, // Store checkbox state as 1 or 0
        }
        : cell
    );
    setShowdocumentnumber(updatedSel1);
    console.log("updatedSel1updatedSel1-------------->>>>>>>>>>", updatedSel1)
  };


  const handlecheckbox2 = (cellName, isChecked, id, rowData) => {
    const updatedSel1 = Showdocumentnumber.map((cell) =>
      cell.id === id
        ? {
          ...cell,
          document_change: isChecked ? 1 : 0, // Store checkbox state as 1 or 0
        }
        : cell
    );
    setShowdocumentnumber(updatedSel1);
  };


  const handleSave = () => {
    setLoading(true);
    const payload = Showdocumentnumber
      .filter(row => row.generated_no && row.generated_no.trim() !== "") // Ensure only rows with valid generated_no
      .map(row => ({
        id: row.id,
        Pfx_Wise_resetno: row.Pfx_Wise_resetno !== undefined ? row.Pfx_Wise_resetno.toString() : "0", // Ensure 1 or 0
        document_change: row.document_change !== undefined ? row.document_change.toString() : "0", // Ensure 1 or 0
        ...Object.fromEntries(
          Array.from({ length: 14 }, (_, i) => `sel${i + 1}`)
            .map(key => [key, row[key] || ""]) // Ensure all sel1 to sel14 keys exist
        ),
        generated_no: row.generated_no, // Assign the correct value
      }));

    if (payload.length === 0) {
      console.warn("No valid data to send, payload is empty.");
      return; // Prevent sending an empty payload
    }

    console.log("Payload to send:", JSON.stringify(payload, null, 2));

    // Call the API with payload and success/error callbacks
    SavedocumentNumber(payload, handledocumentsuccess, handledocumentexception);
  };

  const handledocumentsuccess = (dataObject) => {
    setRefreshData((oldValue) => !oldValue);
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      setLoading(false);
    }, 2000)
  };

  const handledocumentexception = (error, errorMessage) => {
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
      setLoading(false);
    }, 3000);
  };

  const handleClose = () => {
    setNotification({
      status: false,
      type: '',
      message: '',
    });
  };

  return (
    <div>
      <DocumentNumber_title />
      <Card className="shadow-lg p-4 overflow-x-auto w-fit ml-0" style={{ width: "1100px", justifyContent: "flex-start", marginLeft: "20px" }}>

        <table style={{ borderCollapse: "collapse", width: "1000px", border: "1px solid black", marginLeft: "30px" }}>
          <thead>

            <tr  >
              <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>1</th>
              <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>2</th>
              <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>3</th>
              <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>4</th>
              <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>5</th>
              <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>6</th>
              <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>7</th>
              <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>8</th>
              <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>9</th>
              <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>10</th>
              <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>11</th>
              <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>12</th>
            </tr>

          </thead>
          <tbody>
            <tr>
              <td style={{ border: "1px solid black", padding: "8px" }}>Prefix</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>Year From</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>Year To</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>Sh Year From</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>Sh Year To</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>Doc No</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>sh Doc No</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>Adni Doc No 1</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>Adni Doc No 2</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>Week</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>Symbol</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>Doc NO Addition </td>
            </tr>
            {prefix.map((item, index) => (
              <tr key={index}>

                <td style={{ border: "1px solid black", padding: "8px" }}>{item.prefix}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.yrFrom}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.yrTo}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.shYrFrom}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.shYrTo}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.docNo}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.shDocNo}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.docNo1}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.docNo2}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.week}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.symbol}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.docNo3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="shadow-lg p-4 overflow-x-auto w-fit ml-0" style={{ marginTop: "30px", marginLeft: "20px", width: "98%", height: screenHeight - 480, overflowY: "scroll" }} >
        <div style={{ overflowY: "auto", maxHeight: "100%" }}>
          <table style={{ borderCollapse: "collapse", width: "98%", border: "1px solid black", marginLeft: "20px", marginTop: "-0px" }}>
            <thead style={{ position: "sticky", top: '-1px', backgroundColor: "#f2f2f2", zIndex: 1 }}>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>Document</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>Cont Document No </th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>Pfx-Wise Reset No</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>Allow DocNo Chnage</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>sel</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>sel</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>sel</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>sel</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>sel</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>sel</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>sel</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>sel</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>sel</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>sel</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>sel</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>sel</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>sel</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>sel</th>
                <th style={{ border: "1px solid black", padding: "8px", backgroundColor: "#f2f2f2" }}>Example</th>
              </tr>
            </thead>
            <tbody>
              {Showdocumentnumber.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{item.Document}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }}>{item.Document_no}</td>
                  <td style={{ border: "1px solid black", padding: "8px", textAlign: "center", verticalAlign: "middle" }}>
                    <input
                      type="checkbox"
                      disabled={isModuleLocked}

                      checked={item.Pfx_Wise_resetno === 1}
                      onChange={(e) => handlecheckbox1('checkbox1', e.target.checked, item.id, item)}
                    />
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px", textAlign: "center", verticalAlign: "middle" }}>
                    <input
                      type="checkbox"
                      disabled={isModuleLocked}
                      checked={item.document_change === 1}
                      onChange={(e) => handlecheckbox2('checkbox2', e.target.checked, item.id, item)}
                    />
                  </td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true" onBlur={(e) => handleEdit('sel1', e.target.textContent, item.id, item)}>{item.sel1}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true" onBlur={(e) => handleEdit('sel2', e.target.textContent, item.id, item)}>{item.sel2}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true" onBlur={(e) => handleEdit('sel3', e.target.textContent, item.id, item)}>{item.sel3}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true" onBlur={(e) => handleEdit('sel4', e.target.textContent, item.id, item)}>{item.sel4}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true" onBlur={(e) => handleEdit('sel5', e.target.textContent, item.id, item)}>{item.sel5}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true" onBlur={(e) => handleEdit('sel6', e.target.textContent, item.id, item)}>{item.sel6}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true" onBlur={(e) => handleEdit('sel7', e.target.textContent, item.id, item)}>{item.sel7}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true" onBlur={(e) => handleEdit('sel8', e.target.textContent, item.id, item)}>{item.sel8}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true" onBlur={(e) => handleEdit('sel9', e.target.textContent, item.id, item)}>{item.sel9}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true" onBlur={(e) => handleEdit('sel10', e.target.textContent, item.id, item)}>{item.sel10}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true" onBlur={(e) => handleEdit('sel11', e.target.textContent, item.id, item)}>{item.sel11}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true" onBlur={(e) => handleEdit('sel12', e.target.textContent, item.id, item)}>{item.sel12}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true" onBlur={(e) => handleEdit('sel13', e.target.textContent, item.id, item)}>{item.sel13}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true" onBlur={(e) => handleEdit('sel14', e.target.textContent, item.id, item)}>{item.sel14}</td>
                  <td style={{ border: "1px solid black", padding: "8px" }} contentEditable="true">{item.generated_no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', marginTop: '20px', columnGap: '20px', marginRight: '20px' }}>
        <Button variant="contained" disabled={isModuleLocked} style={{ backgroundColor: isModuleLocked ? "gray" : "#002D68", color: 'white' }}>Prefix Settings</Button>
        <Button
          variant="contained"
          style={{ backgroundColor: isModuleLocked ? "gray" : "#002D68", color: 'white' }}
          disabled={loading === true || isModuleLocked}
          onClick={handleSave}>
          {loading ? (
            <CircularProgress size={24} style={{ color: 'white' }} />
          ) : 'Save'}
        </Button>
      </div>

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />
    </div>
  )
}

export default DocumentNumberResult