// import React, { useEffect, useState } from "react";
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Grid from "@mui/material/Grid";
// import Typography from "@mui/material/Typography";
// import {
//   FormControl,
//   FormControlLabel,
//   InputLabel,
//   MenuItem,
//   Radio,
//   RadioGroup,
//   Select,
//   TextField,
//   Tooltip,
// } from "@mui/material";
// // import { Natureshowbyid, ProblemShowdata } from "../../../../Services/NodeJsApiServices";
// // import {
// //   NatureShowdata,
// //   Natureshowbyid,
// //   ProblemShowdata,
// // } from "../../../services/LoginServiceNod";

// const StepTwo = ({
//   MainId,
//   setMaintId,
//   setAge,
//   age,
//   selectedRadioValue,
//   problem,
//   setSelectedRadioValue,
//   setproblem,
//   file1,
//   setfile1,
//   setfile2,
//   setfile3,
//   setfile4,
//   probcate,
//   setProblemcate,
//   naturecate,
//   setnaturecate,
//   selectedMachineName,
//   onPreventiveChange,
//   toolNo,
//   assetType,
//   assetTypeName
// }) => {

//   const [problemlist, setproblemList] = useState([]);
//   const [natureList, setnatureList] = useState([]);
//   const [disabl, setDisabl] = useState(false);
//   const [isPreventive, setIsPreventive] = useState(false);


//   const displayName =
//     assetTypeName === "Tool Asset"
//       ? toolNo
//       : selectedMachineName;

//   const displayLabel =
//     assetTypeName === "Tool Asset"
//       ? "Tool Number"
//       : "Machine Name";






//   const handleSelectChange = (event) => {
//     const selected = event.target.value;
//     if (selected == 'Preventive Maintenance' || selected == 'Conditions Based Maintenance') {
//       setDisabl(true);
//     } else {
//       setDisabl(false);
//     }


//     // preventive flag logic
//     if (selected === "Preventive Maintenance") {
//       setIsPreventive(true);
//       onPreventiveChange(true); // send to parent
//     } else {
//       setIsPreventive(false);
//       onPreventiveChange(false); // send to parent
//     }


//     setAge(selected);
//   };


//   const handleChangeProbCate = (event) => {
//     setnaturecate("")
//     setProblemcate(event.target.value);
//     console.log("setProblemcate", event.target.value);
//     // Natureshowbyid({ id: event.target.value }, handelNatureShowdata, exceptionNatureShowdata);
//   };

//   const handleChangeNatureCate = (event) => {
//     setnaturecate(event.target.value);
//   };
//   const handleRadioChange = (event) => {
//     setSelectedRadioValue(event.target.value);
//   };

//   const handleFileChange = (setter) => (event) => {
//     if (event.target.files && event.target.files.length > 0) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         if (reader.readyState === 2) {
//           setter(reader.result);
//         }
//       };
//       reader.readAsDataURL(event.target.files[0]);
//     }
//   };

//   useEffect(() => {
//     // ProblemShowdata(handelProblemShowdata, exceptionProblemShowdata);

//   }, []);

//   const handelNatureShowdata = (dataObject) => {
//     setnatureList(dataObject.data);

//   };

//   const exceptionNatureShowdata = () => { };

//   const handelProblemShowdata = (dataObject) => {
//     setproblemList(dataObject.data);

//   };

//   const exceptionProblemShowdata = () => { };
//   console.log("gghhh", selectedMachineName)
//   return (
//     <Card sx={{ minWidth: 275, paddingBottom: "15px", marginTop: "15px" }}>
//       <CardContent>
//         <Box sx={{ width: "100%", borderRadius: "5px" }}>
//           <Card
//             sx={{
//               borderRadius: "0 0 5px 5px",
//               padding: "25px",
//               boxShadow: "none",
//             }}
//           >
//             <CardContent sx={{ display: "flex", justifyContent: "center" }}>
//               <Grid
//                 container
//                 spacing={2}
//                 width={{ lg: "100%", md: "100%" }}
//                 alignItems={"center"}
//               >
//                 <Grid item xs={12} sm={4}>

//                   {/* <TextField
//                     style={{ width: "100%" }}
//                     disabled
//                     value={selectedMachineName}
//                     id="maintenance-id-input"
//                     variant="outlined"
//                     label="Machine Name"
//                   /> */}

//                   <TextField
//                     style={{ width: "100%" }}
//                     disabled
//                     value={displayName || ""}
//                     id="maintenance-id-input"
//                     variant="outlined"
//                     label={displayLabel}
//                   />

//                 </Grid>

//                 <Grid item xs={12} sm={4}>
//                   <FormControl fullWidth>
//                     <InputLabel id="maintenance-type-label">
//                       --Maintenance Type--
//                     </InputLabel>
//                     <Select
//                       labelId="maintenance-type-label"
//                       id="maintenance-type-select"
//                       value={age}
//                       label="Maintenance Type"
//                       onChange={handleSelectChange}
//                     >
//                       <MenuItem value={"Preventive Maintenance"}>
//                         Preventive Maintenance
//                       </MenuItem>
//                       <MenuItem value={"Conditions Based Maintenance"}>
//                         Conditions Based Maintenance
//                       </MenuItem>
//                       <MenuItem value={"BreakDown"}>BreakDown</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>


//                 <Grid item xs={12} sm={4}>
//                   <Tooltip title={disabl ? "Disabled: Selected condition met OR Preventive Maintenance not required" : ""} arrow>
//                     <span>
//                       <FormControl fullWidth>
//                         <InputLabel id="severity-label">Severity</InputLabel>
//                         <Select
//                           labelId="severity-label"
//                           id="severity-select"
//                           value={selectedRadioValue}
//                           onChange={handleRadioChange}
//                           label="Severity"
//                           disabled={disabl}
//                         >
//                           <MenuItem value="Major">Major</MenuItem>
//                           <MenuItem value="Minor">Minor</MenuItem>
//                           <MenuItem value="Critical">Critical</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </span>
//                   </Tooltip>
//                 </Grid>

//                 <Grid item xs={12} sm={4}>
//                   <Tooltip title={disabl ? "Disabled: Selected condition met OR Preventive Maintenance not required" : ""} arrow>
//                     <span>
//                       <FormControl fullWidth>
//                         <InputLabel id="maintenance-type-label">
//                           Problem Category
//                         </InputLabel>
//                         <Select
//                           labelId="maintenance-type-label"
//                           id="maintenance-type-select"
//                           value={probcate}
//                           label="Problem Category"
//                           onChange={handleChangeProbCate}
//                           disabled={disabl}
//                         >
//                           {problemlist?.map((data, index) => {
//                             return (
//                               <MenuItem value={data.id} key={index}>
//                                 {data.Category_name}
//                               </MenuItem>
//                             );
//                           })}
//                         </Select>
//                       </FormControl>
//                     </span>
//                   </Tooltip>
//                 </Grid>

//                 <Grid item xs={12} sm={4}>
//                   <Tooltip title={disabl ? "Disabled: Selected condition met OR Preventive Maintenance not required" : ""} arrow>
//                     <span>
//                       <FormControl fullWidth>
//                         <InputLabel id="maintenance-type-label">
//                           Nature of Problem
//                         </InputLabel>
//                         <Select
//                           labelId="maintenance-type-label"
//                           id="maintenance-type-select"
//                           value={naturecate}
//                           label="Nature of Problem"
//                           onChange={handleChangeNatureCate}
//                           disabled={disabl}
//                         >
//                           {natureList?.map((data, index) => {
//                             return (
//                               <MenuItem value={data.id} key={index}>
//                                 {data.Nature_problem}
//                               </MenuItem>
//                             );
//                           })}
//                         </Select>
//                       </FormControl>
//                     </span>
//                   </Tooltip>
//                 </Grid>

//                 <Grid item xs={12} sm={4}>
//                   <Tooltip title={disabl ? "Disabled: Selected condition met OR Preventive Maintenance not required" : ""} arrow>
//                     <span>
//                       <TextField
//                         style={{ width: "100%" }}
//                         multiline
//                         id="problem-note-input"
//                         label="Problem Note"
//                         variant="outlined"
//                         onChange={(e) => setproblem(e.target.value)}
//                         disabled={disabl}
//                       />
//                     </span>
//                   </Tooltip>
//                 </Grid>

//                 <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
//                   <Typography variant="h6" sx={{ fontWeight: "bold" }} >
//                     Breakdown Parts Images
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={12}>
//                   <Grid container spacing={3}>

//                     <Grid item sm={3}>
//                       <Tooltip title={disabl ? "Disabled: Selected condition met OR Preventive Maintenance not required" : ""} arrow>
//                         <span>
//                           <TextField
//                             style={{ width: "100%", marginBottom: "10px" }}
//                             type="file"
//                             id="file-input-1"
//                             variant="outlined"
//                             onChange={handleFileChange(setfile1)}
//                             disabled={disabl}
//                           />
//                         </span>
//                       </Tooltip>
//                     </Grid>
//                     <Grid item sm={3}>
//                       <Tooltip title={disabl ? "Disabled: Selected condition met OR Preventive Maintenance not required" : ""} arrow>
//                         <span>
//                           <TextField
//                             style={{ width: "100%", marginBottom: "10px" }}
//                             type="file"
//                             id="file-input-2"
//                             variant="outlined"
//                             onChange={handleFileChange(setfile2)}
//                             disabled={disabl}
//                           />
//                         </span>
//                       </Tooltip>
//                     </Grid>
//                     <Grid item sm={3}>
//                       <Tooltip title={disabl ? "Disabled: Selected condition met OR Preventive Maintenance not required" : ""} arrow>
//                         <span>
//                           <TextField
//                             style={{ width: "100%", marginBottom: "10px" }}
//                             type="file"
//                             id="file-input-3"
//                             variant="outlined"
//                             onChange={handleFileChange(setfile3)}
//                             disabled={disabl}
//                           />
//                         </span>
//                       </Tooltip>
//                     </Grid>
//                     <Grid item sm={3}>
//                       <Tooltip title={disabl ? "Disabled: Selected condition met OR Preventive Maintenance not required" : ""} arrow>
//                         <span>
//                           <TextField
//                             style={{ width: "100%" }}
//                             type="file"
//                             id="file-input-4"
//                             variant="outlined"
//                             onChange={handleFileChange(setfile4)}
//                             disabled={disabl}
//                           />
//                         </span>
//                       </Tooltip>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default StepTwo;

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Divider,
  Button,
  alpha,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { NatureOfProblemShowList, ProblemCategoryShowList } from "../../../../ApiService/LoginPageService";

/* ─── design tokens ──────────────────────────────────────────────────────── */
const BRAND = {
  primary: "#0F62FE",
  border: "#E2E6EA",
  text: "#1A1A2E",
  muted: "#6B7280",
};

/* ─── label above field ──────────────────────────────────────────────────── */
function Label({ children, disabled }) {
  return (
    <Typography
      sx={{
        fontSize: "0.8rem",
        fontWeight: 700,
        color: disabled ? "#9CA3AF" : BRAND.text,
        mb: 0.75,
        display: "block",
        textAlign: "left",
        width: "100%",
      }}
    >
      {children}
    </Typography>
  );
}

/* ─── shared field border styles ─────────────────────────────────────────── */
const fieldBase = {
  borderRadius: "8px",
  height: "44px",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: BRAND.text,
};

const outlinedBorder = (disabled) => ({
  "& .MuiOutlinedInput-root": {
    ...fieldBase,
    background: disabled ? "#F9FAFB" : "#fff",
    "& input": { padding: "0 14px", height: "44px", boxSizing: "border-box" },
    "& fieldset": { borderColor: BRAND.border, borderWidth: "1.5px" },
    "&:hover fieldset": { borderColor: disabled ? BRAND.border : BRAND.primary },
    "&.Mui-focused fieldset": { borderColor: BRAND.primary, borderWidth: "2px" },
    "&.Mui-disabled": { background: "#F9FAFB" },
  },
  // hide the MUI floating label entirely — we use our own Label above
  "& .MuiInputLabel-root": { display: "none" },
  "& .MuiOutlinedInput-notchedOutline legend": { display: "none" },
  "& .MuiOutlinedInput-notchedOutline": { top: 0 },
});

const selectBase = (disabled) => ({
  borderRadius: "8px",
  height: "44px",
  background: disabled ? "#F9FAFB" : "#fff",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: BRAND.border,
    borderWidth: "1.5px",
    top: 0,
  },
  "& legend": { display: "none" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: disabled ? BRAND.border : BRAND.primary },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: BRAND.primary, borderWidth: "2px" },
  "& .MuiSelect-select": {
    height: "44px !important",
    display: "flex",
    alignItems: "center",
    padding: "0 14px",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: disabled ? "#9CA3AF" : BRAND.text,
    boxSizing: "border-box",
  },
});

const menuProps = {
  PaperProps: {
    sx: {
      mt: 0.5,
      borderRadius: "8px",
      border: `1px solid ${BRAND.border}`,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      "& .MuiMenuItem-root": {
        fontSize: "0.875rem", fontWeight: 500, color: BRAND.text, py: 1,
        "&:hover": { bgcolor: alpha(BRAND.primary, 0.06) },
        "&.Mui-selected": { bgcolor: alpha(BRAND.primary, 0.08), color: BRAND.primary, fontWeight: 700 },
      },
    },
  },
};

/* ─── file upload field ──────────────────────────────────────────────────── */
function FileUploadField({ label, onChange, disabled }) {
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    onChange(e);
  };

  return (
    <Box>
      <Label disabled={disabled}>{label}</Label>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "44px",
          borderRadius: "8px",
          border: `1.5px solid ${BRAND.border}`,
          background: disabled ? "#F9FAFB" : "#fff",
          overflow: "hidden",
          opacity: disabled ? 0.6 : 1,
          "&:hover": { borderColor: disabled ? BRAND.border : BRAND.primary },
          transition: "border-color 0.2s",
        }}
      >
        {/* styled button */}
        <Box
          component="label"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            px: 1.5,
            height: "100%",
            borderRight: `1.5px solid ${BRAND.border}`,
            background: "#F3F4F6",
            cursor: disabled ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            "&:hover": { background: disabled ? "#F3F4F6" : alpha(BRAND.primary, 0.07) },
            transition: "background 0.2s",
          }}
        >
          <UploadFileIcon sx={{ fontSize: 15, color: disabled ? "#9CA3AF" : BRAND.primary }} />
          <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: disabled ? "#9CA3AF" : BRAND.primary }}>
            Browse
          </Typography>
          <input
            type="file"
            accept="image/*"
            disabled={disabled}
            onChange={handleChange}
            style={{ display: "none" }}
          />
        </Box>

        {/* filename display */}
        <Typography
          sx={{
            flex: 1,
            px: 1.5,
            fontSize: "0.8rem",
            fontWeight: 500,
            color: fileName ? BRAND.text : BRAND.muted,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {fileName || "No file chosen"}
        </Typography>
      </Box>
    </Box>
  );
}

/* ─── main component ─────────────────────────────────────────────────────── */
const StepTwo = ({
  setAge, age,
  selectedRadioValue, setSelectedRadioValue,
  problem, setproblem,
  setfile1, setfile2, setfile3, setfile4,
  probcate, setProblemcate,
  naturecate, setnaturecate,
  selectedMachineName, onPreventiveChange, toolNo,
}) => {
  const [problemlist, setproblemList] = useState([]);
  const [natureList, setnatureList] = useState([]);
  const [disabl, setDisabl] = useState(false);

  const displayName = toolNo ? toolNo : selectedMachineName;
  const displayLabel = toolNo ? "Tool Number" : "Machine Name";

  const handleMaintenanceTypeChange = (event) => {
    const selected = event.target.value;
    const disable = selected === "Preventive Maintenance" || selected === "Conditions Based Maintenance";
    setDisabl(disable);
    onPreventiveChange(selected === "Preventive Maintenance");
    setAge(selected);
  };

  const handleFileChange = (setter) => (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setter(file);
  };

  useEffect(() => {
    ProblemCategoryShowList(
      (dataObject) => setproblemList(dataObject.data),
      () => { }
    );
    NatureOfProblemShowList(
      (dataObject) => setnatureList(dataObject.data),
      () => { }
    );

  }, []);

  return (
    <Card
      elevation={0}
      sx={{ mt: 2, borderRadius: "16px", border: "1.5px solid #E2E6EA", background: "#fff", overflow: "visible" }}
    >
      <CardContent sx={{ p: "24px !important" }}>

        {/* ── header ── */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 3, }}>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: "1.05rem", color: BRAND.text, lineHeight: 1.2, }}>
              Maintenance Details
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: BRAND.muted, mt: 0.3 }}>
              Fill in maintenance type, severity and problem information
            </Typography>
          </Box>
          {/* <Box sx={{
            px: 1.5, py: 0.4, borderRadius: "20px",
            bgcolor: BRAND.primary, color: "#fff",
            fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.06em", whiteSpace: "nowrap",
          }}>
            STEP 02
          </Box> */}
        </Box>

        <Divider sx={{ borderColor: "#E2E6EA", mb: 3 }} />

        <Grid container spacing={2} alignItems="flex-start">

          {/* Machine / Tool — read only */}
          <Grid item xs={12} sm={4}>
            <Label>{displayLabel}</Label>
            <TextField
              fullWidth disabled size="small"
              value={displayName || ""}
              sx={outlinedBorder(true)}
            />
          </Grid>

          {/* Maintenance Type */}
          <Grid item xs={12} sm={4}>
            <Label>Maintenance Type</Label>
            <FormControl fullWidth size="small">
              <Select value={age} onChange={handleMaintenanceTypeChange} displayEmpty sx={selectBase(false)} MenuProps={menuProps}>
                <MenuItem value="" disabled><span style={{ color: BRAND.muted }}>Select type</span></MenuItem>
                <MenuItem value="Preventive Maintenance">Preventive Maintenance</MenuItem>
                <MenuItem value="Conditions Based Maintenance">Conditions Based Maintenance</MenuItem>
                <MenuItem value="BreakDown">BreakDown</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Severity */}
          <Grid item xs={12} sm={4}>
            <Label disabled={disabl}>Severity</Label>
            <Tooltip title={disabl ? "Disabled for selected maintenance type" : ""} arrow>
              <FormControl fullWidth size="small" disabled={disabl}>
                <Select value={selectedRadioValue} onChange={(e) => setSelectedRadioValue(e.target.value)} displayEmpty sx={selectBase(disabl)} MenuProps={menuProps}>
                  <MenuItem value="" disabled><span style={{ color: BRAND.muted }}>Select severity</span></MenuItem>
                  <MenuItem value="Major">Major</MenuItem>
                  <MenuItem value="Minor">Minor</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>

          {/* Problem Category */}
          <Grid item xs={12} sm={4}>
            <Label disabled={disabl}>Problem Category</Label>
            <Tooltip title={disabl ? "Disabled" : ""} arrow>
              <FormControl fullWidth size="small" disabled={disabl}>
                <Select value={probcate} onChange={(e) => { setnaturecate(""); setProblemcate(e.target.value); }} displayEmpty sx={selectBase(disabl)} MenuProps={menuProps}>
                  <MenuItem value="" disabled><span style={{ color: BRAND.muted }}>Select category</span></MenuItem>
                  {problemlist.map((data) => (
                    <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>

          {/* Nature of Problem */}
          <Grid item xs={12} sm={4}>
            <Label disabled={disabl}>Nature of Problem</Label>
            <Tooltip title={disabl ? "Disabled" : ""} arrow>
              <FormControl fullWidth size="small" disabled={disabl}>
                <Select value={naturecate} onChange={(e) => setnaturecate(e.target.value)} displayEmpty sx={selectBase(disabl)} MenuProps={menuProps}>
                  <MenuItem value="" disabled><span style={{ color: BRAND.muted }}>Select nature</span></MenuItem>
                  {natureList.map((data) => (
                    <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>

          {/* Problem Note */}
          <Grid item xs={12} sm={4}>
            <Label disabled={disabl}>Problem Note</Label>
            <Tooltip title={disabl ? "Disabled" : ""} arrow>
              <TextField
                fullWidth size="small"
                placeholder="Enter problem note"
                value={problem}
                onChange={(e) => setproblem(e.target.value)}
                disabled={disabl}
                sx={outlinedBorder(disabl)}
              />
            </Tooltip>
          </Grid>

        </Grid>

        {/* ── Images ── */}
        <Divider sx={{ borderColor: "#E2E6EA", my: 3 }} />

        <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: BRAND.text, mb: 2, display: 'flex', alignItems: 'flex-start' }}>
          Breakdown Parts Images
        </Typography>

        <Grid container spacing={2}>
          {[
            { setter: setfile1, label: "Image 1" },
            { setter: setfile2, label: "Image 2" },
            { setter: setfile3, label: "Image 3" },
            { setter: setfile4, label: "Image 4" },
          ].map(({ setter, label }, index) => (
            <Grid item xs={12} sm={3} key={index}>
              <FileUploadField
                label={label}
                disabled={disabl}
                onChange={handleFileChange(setter)}
              />
            </Grid>
          ))}
        </Grid>

      </CardContent>
    </Card>
  );
};

export default StepTwo;