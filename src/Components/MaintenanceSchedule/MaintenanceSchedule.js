// import React, { useState } from "react";
// import {
//   Stepper,
//   Step,
//   StepLabel,
//   StepContent,
//   Button,
//   Typography,
//   Box,
//   CardContent,
//   Card,
//   Snackbar,
//   Alert
// } from "@mui/material";
// // import StepOne from "./StepOne";
// // import StepTwo from "./StepTwo";
// // import StepThree from "./StepThree";
// // import StepFour from "./StepFour";
// // import { insertMaintenanceSchedule } from "../../../services/LoginServiceNod";
// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
// import StepFour from "./MaintenanceScheduleSteps/StepFour/StepFour";
// import StepThree from "./MaintenanceScheduleSteps/StepThree/StepThree";
// import StepTwo from "./MaintenanceScheduleSteps/StepTwo/StepTwo";
// import StepOne from "./MaintenanceScheduleSteps/StepOne/StepOne copy";
// // import { insertMaintenanceSchedule } from "../../Services/NodeJsApiServices";
// // import StepOne from "./MaintenanceScheduleSteps/StepOne/StepOne";
// // import StepTwo from "./MaintenanceScheduleSteps/StepTwo/StepTwo";
// // import StepThree from "./MaintenanceScheduleSteps/StepThree/StepThree";
// // import StepFour from "./MaintenanceScheduleSteps/StepFour/StepFour";
// // import NotificationBar from "../../Utility/NotificationBar";
// // import { useLocation } from "react-router-dom";

// function MaintenanceSchedule() {
//   const location = useLocation();
//   const { machineId, Rowsection, RowassetType, Department } = location.state || {};

//   const [activeStep, setActiveStep] = useState(0);
//   const [Tool, setTool] = useState('');
//   const [MainId, setMaintId] = useState("mac_44");
//   const [age, setAge] = useState("");
//   const [selectedRadioValue, setSelectedRadioValue] = useState("");
//   const [problem, setproblem] = useState("");
//   const [file1, setfile1] = useState("");
//   const [file2, setfile2] = useState("");
//   const [file3, setfile3] = useState("");
//   const [file4, setfile4] = useState("");
//   const [rows, setRows] = useState([]);
//   const [Machine, setMachine] = useState('');
//   const [manhr, setManhr] = useState("");
//   const [machinUti, setMachineUti] = useState("");
//   const [probcate, setProblemcate] = useState("");
//   const [naturecate, setnaturecate] = useState("");
//   const [selectedMachineName, setSelectedMachineName] = useState('')
//   const [openNotification, setNotification] = useState({
//     status: false,
//     type: 'error',
//     message: '',
//   });

//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("error")

//   const [stepThreeValues, setStepThreeValues] = useState({
//     Type: "",
//     Name: "",
//     Partid: "",
//     Quantity: "",
//     UOM: "",
//     Unitprice: "",
//     // Add other StepThree values here as needed
//   });

//   const [affMachine, setaffMachine] = useState([]);
//   const [affManHr, setaffManHr] = useState("");
//   const [type1, settype1] = useState("");
//   const [type2, settype2] = useState("");
//   const [fromdate, setfromdate] = useState("");
//   const [todate, settodate] = useState("");
//   const [fromtime, setfromtime] = useState("");
//   const [totime, settotime] = useState("");
//   const [users, setUser] = useState([]);
//   const [supervisor, setSupervisor] = useState("");
//   const [selectedCheckList, setSelectedCheckList] = useState("");
//   const [error, setError] = useState(false);
//   const [isPreventiveFromChild, setIsPreventiveFromChild] = useState(false);
//   const [toolNo, setToolNo] = useState("");
//   const [checkList, setCheckList] = useState([]);
//   const [assetType, setAssetType] = useState("");
//   const [assetTypeName, setAssetTypeName] = useState("");


//   console.log("stepThreeValues", stepThreeValues);

//   const steps = ["Step 1", "Step 2", "Step 3", "Complete"];

//   const handleNext = () => {
//     if (activeStep === 0 && !Machine) {
//       showSnackbar("Please select a machine before proceeding to the next step.");
//       return;
//     }
//     if (activeStep === steps.length - 1) {
//       if (!supervisor) {
//         // setError(true);
//         showSnackbar("Please assign the user");
//         return;
//       }
//       // If it's the last step, call handleSubmit to submit the form data
//       handleSubmit();
//     } else {
//       // If it's not the last step, proceed to the next step
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     }
//   };

//   const showSnackbar = (message, severity = "error") => {
//     setSnackbarMessage(message);
//     setSnackbarSeverity(severity);
//     setOpenSnackbar(true);
//   };

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };



//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };


//   const handleSubmit = () => {
//     // insertMaintenanceSchedule(
//     //   {
//     //     machine: Machine,
//     //     assetType: assetType,
//     //     assetTypeName: assetTypeName,
//     //     toolNo: toolNo,
//     //     MaintId: MainId,
//     //     Maintype: age,
//     //     Severity: selectedRadioValue,
//     //     probcate: probcate,
//     //     naturecate: naturecate,
//     //     ProblemNote: problem,
//     //     BrkImages1: file1,
//     //     BrkImages2: file2,
//     //     BrkImages3: file3,
//     //     BrkImages4: file4,
//     //     AffectedMachine: affMachine,
//     //     AffdManHours: affManHr,
//     //     type1: type1,
//     //     type2: type2,
//     //     fromdate: fromdate,
//     //     todate: todate,
//     //     fromtime: fromtime,
//     //     totime: totime,
//     //     MachineRuntimeDetails: machinUti,
//     //     manHourdetails: manhr,
//     //     affMachine: affMachine,
//     //     users: users,
//     //     valuesToInsert: rows,
//     //     supervisor,
//     //     checklistId: selectedCheckList,
//     //   },
//     //   insertMaintenanceListSuccess,
//     //   insertMaintenanceListException
//     // );
//     localStorage.clear();
//   };

//   const insertMaintenanceListSuccess = (dataObject) => {
//     setNotification({
//       status: true,
//       type: 'success',
//       message: dataObject.message,
//     });
//     setTimeout(() => {
//       handleClose();
//     }, 2000);
//     setActiveStep(0);
//   }

//   const insertMaintenanceListException = (errorObject, errorMessage) => {
//     console.log("the error ", errorMessage);
//     setNotification({
//       status: true,
//       type: 'error',
//       message: errorMessage,
//     });
//     setTimeout(() => {
//       // handleClose();
//     }, 2000);
//   }

//   const handleClose = () => {
//     setNotification({
//       status: false,
//       type: '',
//       message: '',
//     });
//   };

//   return (
//     <Box
//       sx={{
//         height: "100vh",         // full screen height
//         width: "100%",           // full width
//         overflow: "hidden",      // no scroll bar
//         display: "flex",
//         flexDirection: "column",
//         bgcolor: "#fff",
//       }}
//     >
//       <Typography variant="h5" sx={{ m: 2, color: '#000000', fontWeight: 'bold' }} marginLeft={2} marginTop={2}>
//         Maintenance Schedule
//       </Typography>
//       <Box
//         sx={{
//           flex: 1,                // take remaining space
//           margin: 2,
//         }}
//         margin={2}
//         className="toolAddCardContainer"
//       >
//         <Typography
//           variant="h7"
//           component="div"
//           sx={{
//             flexGrow: 1,
//             backgroundColor: "#f7f7fc",
//             padding: 2.5,
//             color: "#000000",
//             borderRadius: "5px 5px 0 0",
//             fontWeight: 'bold'
//           }}
//         >
//           Create Maintenance Schedule
//         </Typography>
//         <Card
//           sx={{
//             borderRadius: "0 0 5px 5px",
//             padding: "0px",
//             boxShadow: "none",
//             paddingBottom: "15px",
//           }}
//         >
//           <CardContent>
//             <div>
//               <Stepper activeStep={activeStep} orientation="horizontal">
//                 {steps.map((label, index) => (
//                   <Step key={index}>
//                     <StepLabel>{label}</StepLabel>
//                   </Step>
//                 ))}
//               </Stepper>
//               {activeStep === 0 && <StepOne
//                 Machine={Machine}
//                 setMachine={setMachine}
//                 Tool={Tool}
//                 setTool={setTool}
//                 setSelectedMachineName={setSelectedMachineName}
//                 machineId={machineId}
//                 Rowsection={Rowsection}
//                 RowassetType={RowassetType}
//                 Department={Department}
//                 setCheckList={setCheckList}
//                 setToolNo={setToolNo}
//                 assetType={assetType}
//                 setAssetType={setAssetType}
//                 setAssetTypeName={setAssetTypeName}
//               />}
//               {activeStep === 1 && (
//                 <StepTwo
//                   MainId={Tool}
//                   selectedMachineName={selectedMachineName}
//                   setMaintId={setMaintId}
//                   setAge={setAge}
//                   age={age}
//                   selectedRadioValue={selectedRadioValue}
//                   problem={problem}
//                   probcate={probcate}
//                   setProblemcate={setProblemcate}
//                   naturecate={naturecate}
//                   setnaturecate={setnaturecate}
//                   setSelectedRadioValue={setSelectedRadioValue}
//                   setproblem={setproblem}
//                   file1={file1}
//                   setfile1={setfile1}
//                   setfile2={setfile2}
//                   setfile3={setfile3}
//                   setfile4={setfile4}
//                   onPreventiveChange={setIsPreventiveFromChild}
//                   toolNo={toolNo}
//                   assetType={assetType}
//                   assetTypeName={assetTypeName}
//                 />
//               )}
//               {activeStep === 2 && (
//                 <StepThree setStepThreeValues={setStepThreeValues} stepThreeValues={stepThreeValues} rows={rows}
//                   setRows={setRows} />
//               )}
//               {activeStep === 3 && (
//                 <StepFour
//                   affMachine={affMachine}
//                   affManHr={affManHr}
//                   type1={type1}
//                   type2={type2}
//                   fromdate={fromdate}
//                   todate={todate}
//                   fromtime={fromtime}
//                   totime={totime}
//                   setaffMachine={setaffMachine}
//                   setaffManHr={setaffManHr}
//                   settype1={settype1}
//                   settype2={settype2}
//                   setfromdate={setfromdate}
//                   settodate={settodate}
//                   setfromtime={setfromtime}
//                   settotime={settotime}
//                   handleSubmit={handleSubmit}
//                   setManhr={setManhr}
//                   setMachineUti={setMachineUti}
//                   users={users}
//                   setUser={setUser}
//                   supervisor={supervisor}
//                   setSupervisor={setSupervisor}
//                   error={error}
//                   setError={setError}
//                   isPreventiveFromChild={isPreventiveFromChild}
//                   machine={Machine}
//                   checkList={checkList}
//                   selectedCheckList={selectedCheckList}
//                   setSelectedCheckList={setSelectedCheckList}
//                 />
//               )}
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   marginTop: "15px",
//                 }}
//               >
//                 <Button
//                   disabled={activeStep === 0}
//                   onClick={handleBack}
//                   variant="outlined"
//                 >
//                   Back
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={handleNext}
//                   sx={{
//                     backgroundColor: 'black',
//                   }}
//                 >
//                   {activeStep === steps.length - 1 ? "Submit" : "Next"}
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </Box>
//       <NotificationBar
//         handleClose={handleClose}
//         notificationContent={openNotification.message}
//         openNotification={openNotification.status}
//         type={openNotification.type}
//       />
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={4000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled">
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }

// export default MaintenanceSchedule;


import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  CardContent,
  Card,
  Snackbar,
  Alert
} from "@mui/material";
import { useLocation } from "react-router-dom";

import NotificationBar from "../GlobleFiles/ServiceNotificationBar";
import StepFour from "./MaintenanceScheduleSteps/StepFour/StepFour";
import StepThree from "./MaintenanceScheduleSteps/StepThree/StepThree";
import StepTwo from "./MaintenanceScheduleSteps/StepTwo/StepTwo";
import StepOne from "./MaintenanceScheduleSteps/StepOne/StepOne copy";
import { MaintanenceScheduleAddList } from "../../ApiService/LoginPageService";

function MaintenanceSchedule() {

  const location = useLocation();
  const { machineId, Rowsection, RowassetType, Department, toolNo: passedToolNo, machineCode, date, time } = location.state || {};

  const steps = ["Step 1", "Step 2", "Step 3", "Complete"];

  /* ---------- STEP CONTROL ---------- */

  const [activeStep, setActiveStep] = useState(0);

  /* ---------- STEP 1 DATA ---------- */

  const [Machine, setMachine] = useState(machineId || "");
  const [Tool, setTool] = useState("");
  const [toolNo, setToolNo] = useState(passedToolNo || "");
  const [selectedMachineName, setSelectedMachineName] = useState("");

  /* ---------- STEP 3 TABLE ---------- */

  const [rows, setRows] = useState([]);

  /* ---------- STEP 2 DATA ---------- */

  const [age, setAge] = useState(passedToolNo ? "BreakDown" : "");
  const [selectedRadioValue, setSelectedRadioValue] = useState("");
  const [problem, setproblem] = useState("");

  const [file1, setfile1] = useState("");
  const [file2, setfile2] = useState("");
  const [file3, setfile3] = useState("");
  const [file4, setfile4] = useState("");

  const [probcate, setProblemcate] = useState("");
  const [naturecate, setnaturecate] = useState("");

  /* ---------- STEP 4 DATA ---------- */

  const [affMachine, setaffMachine] = useState([]);
  const [affManHr, setaffManHr] = useState("");

  const [type1, settype1] = useState("");
  const [type2, settype2] = useState("");

  const [fromdate, setfromdate] = useState(date || "");
  const [todate, settodate] = useState("");

  const [fromtime, setfromtime] = useState(time || "");
  const [totime, settotime] = useState("");

  const [users, setUser] = useState([]);
  const [supervisor, setSupervisor] = useState("");

  const [selectedCheckList, setSelectedCheckList] = useState("");
  const [checkList, setCheckList] = useState([]);

  const [assetType, setAssetType] = useState("");
  const [assetTypeName, setAssetTypeName] = useState("");

  const [error, setError] = useState(false);
  const [isPreventiveFromChild, setIsPreventiveFromChild] = useState(false);

  // States to map selection to IDs in the final payload
  const [machineOptions, setMachineOptions] = useState([]);
  const [userlist, setUserlist] = useState([]);

  /* ---------- NOTIFICATION ---------- */

  const [openNotification, setNotification] = useState({
    status: false,
    type: "error",
    message: ""
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  /* ---------- STEP 3 FORM ---------- */

  const [stepThreeValues, setStepThreeValues] = useState({
    Type: "",
    Name: "",
    Partid: "",
    Quantity: "",
    UOM: "",
    Unitprice: ""
  });

  /* ---------- SNACKBAR ---------- */

  const showSnackbar = (message, severity = "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  /* ---------- STEP CONTROL ---------- */

  const handleNext = () => {

    if (activeStep === 0) {

      if (!Machine) {
        showSnackbar("Please select a machine before proceeding.");
        return;
      }

      if (!Tool) {
        showSnackbar("Please select a tool.");
        return;
      }
    }

    if (activeStep === steps.length - 1) {

      if (!supervisor) {
        showSnackbar("Please assign the user");
        return;
      }

      handleSubmit();
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = () => {

    // Map affMachine names to IDs
    const affectedMachinesMapped = affMachine.map(name => {
      const match = machineOptions?.find(m => m.name === name);
      return match ? match.id : name; /* fallback */
    });

    // Map operator names to object { id, name }
    const operatorsMapped = users.map(name => {
      const match = userlist?.find(u => u.name === name);
      return match ? { id: match.id, name: match.name } : { name };
    });

    // Map rows to scheduleDetails
    const scheduleDetailsMapped = rows.map(r => ({
      type: r.Type || r.type,
      name: r.Name || r.name,
      part: r.PartId || r.part, // PartId mapped
      qty: Number(r.Quantity || r.qty),
      unit: r.UOM || r.unit,
      unitPrice: Number(r.Unitprice || r.unitPrice)
    }));

    // Prepare base parameters
    const mappedPayload = {
      machine_id: Machine,
      tool_id: Tool,
      maintenance_type: age,
      severity: selectedRadioValue,
      problem_category: probcate,
      problem_nature: naturecate,
      problem_note: problem,
      from_datetime: `${fromdate} ${fromtime}:00`,
      to_datetime: `${todate} ${totime}:00`,
      supervisor_id: supervisor,
      schedule_type: type1,
      manpower_mode: type2
    };

    const hasFiles = file1 || file2 || file3 || file4;

    let payloadToSubmit;

    if (hasFiles) {
      payloadToSubmit = new FormData();

      // Append standard fields
      Object.keys(mappedPayload).forEach(key => {
        if (mappedPayload[key] !== undefined && mappedPayload[key] !== null) {
          payloadToSubmit.append(key, mappedPayload[key]);
        }
      });

      // For arrays/objects in FormData, append as JSON strings
      payloadToSubmit.append("affectedMachines", JSON.stringify(affectedMachinesMapped));
      payloadToSubmit.append("operatorsId", JSON.stringify(operatorsMapped));
      payloadToSubmit.append("scheduleDetails", JSON.stringify(scheduleDetailsMapped));

      // Append files. They should be actual File objects for multer.
      if (file1) payloadToSubmit.append("bd_img1", file1);
      if (file2) payloadToSubmit.append("bd_img2", file2);
      if (file3) payloadToSubmit.append("bd_img3", file3);
      if (file4) payloadToSubmit.append("bd_img4", file4);
    } else {
      // If no files, just send as standard JSON object as assumed by Axios (or _fetchService logic)
      payloadToSubmit = {
        ...mappedPayload,
        affectedMachines: affectedMachinesMapped,
        operatorsId: operatorsMapped,
        scheduleDetails: scheduleDetailsMapped,
        bd_img1: "",
        bd_img2: "",
        bd_img3: "",
        bd_img4: ""
      };
    }

    MaintanenceScheduleAddList(
      payloadToSubmit,
      insertMaintenanceListSuccess,
      insertMaintenanceListException
    );
    // localStorage.clear();
  };
  const insertMaintenanceListSuccess = (dataObject) => {
    setNotification({
      status: true,
      type: 'success',
      message: dataObject.message,
    });
    setTimeout(() => {
      handleClose();
    }, 2000);
    setActiveStep(0);
  }

  const insertMaintenanceListException = (errorObject, errorMessage) => {
    console.log("the error ", errorMessage);
    setNotification({
      status: true,
      type: 'error',
      message: errorMessage,
    });
    setTimeout(() => {
      // handleClose();
    }, 2000);
  }

  const handleClose = () => {
    setNotification({
      status: false,
      type: "",
      message: ""
    });
  };

  /* ---------- UI ---------- */

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff"
      }}
    >

      <Typography variant="h5" sx={{ m: 2, fontWeight: "bold" }}>
        Maintenance Schedule
      </Typography>

      <Box sx={{ flex: 1, margin: 2 }}>

        <Typography
          sx={{
            backgroundColor: "#f7f7fc",
            padding: 2.5,
            borderRadius: "5px 5px 0 0",
            fontWeight: "bold"
          }}
        >
          Create Maintenance Schedule
        </Typography>

        <Card sx={{ borderRadius: "0 0 5px 5px", boxShadow: "none", pb: 2 }}>

          <CardContent>

            <Stepper activeStep={activeStep}>

              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}

            </Stepper>

            {/* STEP 1 */}

            {activeStep === 0 && (
              <StepOne
                Machine={Machine}
                setMachine={setMachine}
                Tool={Tool}
                setTool={setTool}
                setSelectedMachineName={setSelectedMachineName}
                machineId={machineId}
                Rowsection={Rowsection}
                RowassetType={RowassetType}
                Department={Department}
                setCheckList={setCheckList}
                setToolNo={setToolNo}
                assetType={assetType}
                setAssetType={setAssetType}
                setAssetTypeName={setAssetTypeName}
                machineCodeProp={machineCode}
                toolNoProp={passedToolNo}
              />
            )}

            {/* STEP 2 */}

            {activeStep === 1 && (
              <StepTwo
                selectedMachineName={selectedMachineName}
                setAge={setAge}
                age={age}
                selectedRadioValue={selectedRadioValue}
                problem={problem}
                probcate={probcate}
                setProblemcate={setProblemcate}
                naturecate={naturecate}
                setnaturecate={setnaturecate}
                setSelectedRadioValue={setSelectedRadioValue}
                setproblem={setproblem}
                file1={file1}
                setfile1={setfile1}
                setfile2={setfile2}
                setfile3={setfile3}
                setfile4={setfile4}
                onPreventiveChange={setIsPreventiveFromChild}
                toolNo={toolNo}
                assetType={assetType}
                assetTypeName={assetTypeName}
              />
            )}

            {/* STEP 3 */}

            {activeStep === 2 && (
              <StepThree
                setStepThreeValues={setStepThreeValues}
                stepThreeValues={stepThreeValues}
                rows={rows}
                setRows={setRows}
              />
            )}

            {/* STEP 4 */}

            {activeStep === 3 && (
              <StepFour
                affMachine={affMachine}
                affManHr={affManHr}
                type1={type1}
                type2={type2}
                fromdate={fromdate}
                todate={todate}
                fromtime={fromtime}
                totime={totime}
                setaffMachine={setaffMachine}
                setaffManHr={setaffManHr}
                settype1={settype1}
                settype2={settype2}
                setfromdate={setfromdate}
                settodate={settodate}
                setfromtime={setfromtime}
                settotime={settotime}
                handleSubmit={handleSubmit}
                users={users}
                setUser={setUser}
                supervisor={supervisor}
                setSupervisor={setSupervisor}
                error={error}
                setError={setError}
                isPreventiveFromChild={isPreventiveFromChild}
                machine={Machine}
                checkList={checkList}
                selectedCheckList={selectedCheckList}
                setSelectedCheckList={setSelectedCheckList}
                machineOptions={machineOptions}
                setMachineOptions={setMachineOptions}
                userlist={userlist}
                setUserlist={setUserlist}
              />
            )}

            {/* BUTTONS */}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>

              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>

              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ backgroundColor: "black" }}
              >
                {activeStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>

            </Box>

          </CardContent>

        </Card>

      </Box>

      {/* NOTIFICATIONS */}

      <NotificationBar
        handleClose={handleClose}
        notificationContent={openNotification.message}
        openNotification={openNotification.status}
        type={openNotification.type}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
}

export default MaintenanceSchedule;