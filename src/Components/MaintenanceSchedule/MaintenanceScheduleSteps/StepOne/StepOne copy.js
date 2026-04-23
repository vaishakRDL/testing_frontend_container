
// //////////////
// import React, { useEffect, useState } from "react";
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { MachineShowList, ToolListByMachineId } from "../../../../ApiService/LoginPageService";
// // import {
// //   DepartmentShowdata,
// //   FetchAssetTypeSec,
// //   FetchAsstTypeAsset,
// //   MaintenanceShudeleName,
// //   ShowChecklistDropDown,
// //   viewwarrentyStatus,
// // } from "../../../../Services/NodeJsApiServices";

// const columns = [
//   {
//     field: "AMCStatus",
//     headerClassName: "super-app-theme--header",
//     headerName: "AMC Status",
//     minWidth: 100,
//     flex: 1,
//     align: "left",
//     headerAlign: "center",
//   },
//   {
//     field: "WarrantyStatus",
//     headerName: "Warranty Status",
//     headerClassName: "super-app-theme--header",
//     minWidth: 100,
//     flex: 1,
//     align: "left",
//     headerAlign: "center",
//   },
//   {
//     field: "WarrantyType",
//     headerName: "Warranty Type",
//     headerClassName: "super-app-theme--header",
//     minWidth: 100,
//     flex: 1,
//     align: "left",
//     headerAlign: "center",
//   },
// ];

// const StepOne = ({
//   Machine,
//   setMachine,
//   setSelectedMachineName,
//   machineId,
//   Rowsection,
//   RowassetType,
//   Department,
//   navigate,  // Assume this prop comes from the parent
//   setCheckList,
//   Tool,
//   setTool,

// }) => {
//   console.log("machineId", machineId)
//   console.log("row", Rowsection)
//   console.log("RowassetType", RowassetType)
//   console.log("Department", Department)
//   const [machineOptions, setMachineOptions] = useState([]);
//   const [name, setName] = useState("");
//   const [rows, setRows] = useState([]);
//   const [ToolList, setToolList] = useState([]);
//   const [section, setSection] = useState("");
//   const [sectionList, setSectionList] = useState([]);
//   const [assetType, setAssetType] = useState("");
//   const [assetTypeList, setAssetTypeList] = useState([]);



//   useEffect(() => {
//     MachineShowList(
//       Handelsuccess,
//       handelexception
//     );
//   }, []);





//   // Re-run when machineId or machineOptions change

//   // const Handelsuccess = (dataObject) => {
//   //   setMachineOptions(dataObject.data);
//   // };

//   const Handelsuccess = (dataObject) => {
//     setMachineOptions(dataObject?.data || []);
//   };


//   const handelexception = () => {
//     setMachineOptions([]);
//   };

//   const handleMachineChange = (event) => {
//     setMachine(event.target.value);
//     ToolListByMachineId(
//       { id: event.target.value },
//       handleToolSuccess,
//       handleToolException
//     );
//   };




//   const onToolChange = (e) => {
//     setTool(e.target.value);

//   };



//   const handleToolSuccess = (dataObject) => {
//     setToolList(dataObject.data || []);
//   };

//   const handleToolException = (errorStaus, errorMessage) => { };

//   return (
//     <Card
//       // sx={{ paddingBottom: "15px", marginTop: "15px" }}
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         flex: 1,
//         overflow: "hidden",
//         paddingBottom: "15px",
//         marginTop: "15px",
//       }}

//     >
//       <CardContent
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           flex: 1,
//           overflow: "hidden",
//         }}

//       >
//         <Typography variant="h6" component="div" sx={{ m: 0, color: '#000000', fontWeight: 'bold' }}>
//           Status
//         </Typography>
//         <Grid container spacing={2} style={{ marginTop: "20px", marginBottom: '20px' }}>

//           <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
//             <FormControl fullWidth>
//               <InputLabel id="demo-simple-select-label">Machine Name</InputLabel>
//               <Select
//                 labelId="demo-simple-select-label"
//                 id="demo-simple-select"
//                 label="Asset Name"
//                 value={Machine}
//                 onChange={handleMachineChange}
//                 size="small"
//               >
//                 {machineOptions?.map((data, index) => (
//                   <MenuItem value={data.id} key={index}>
//                     {data.machineCode}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
//             <FormControl fullWidth>
//               <InputLabel id="demo-simple-select-label">Tool Select</InputLabel>
//               <Select
//                 labelId="demo-simple-select-label"
//                 id="demo-simple-select"
//                 label="Department"
//                 value={Tool}
//                 onChange={onToolChange}
//                 size="small"
//               >
//                 {ToolList?.map((data, index) => (
//                   <MenuItem value={data.id} key={index}>
//                     {data.toolNo}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//         </Grid>


//         {/* <div className="view_container"> */}
//         <Box
//           className="view_container"
//           sx={{
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             overflow: "hidden",
//           }}
//         >
//           <div className="view_subcontainer">
//             <span className="view_headerText" style={{ m: 0, color: '#000000', fontWeight: 'bold' }}>View Warranty Dues</span>
//           </div>
//           <DataGrid
//             rows={rows}
//             columns={columns}
//             pageSize={8}
//             rowsPerPageOptions={[8]}
//             disableSelectionOnClick
//             // sx={{
//             //   height: 400,
//             //   '& .MuiDataGrid-columnHeaders': {
//             //     color: '#000000',
//             //     fontWeight: 'bold',
//             //   },
//             //   '& .MuiDataGrid-columnHeaderTitle': {
//             //     fontWeight: 'bold',
//             //   },
//             // }}
//             sx={{
//               flex: 1,
//               "& .MuiDataGrid-columnHeaders": {
//                 color: "#000000",
//                 fontWeight: "bold",
//               },
//               "& .MuiDataGrid-columnHeaderTitle": {
//                 fontWeight: "bold",
//               },
//             }}
//           />
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default StepOne;

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Chip,
  Divider,
  alpha
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import BuildIcon from "@mui/icons-material/Build";
import TuneIcon from "@mui/icons-material/Tune";
import { MachineShowList, ToolListByMachineId } from "../../../../ApiService/LoginPageService";

/* ─── colour tokens ─────────────────────────────────────────────────────── */
const BRAND = {
  primary: "#0F62FE",
  surface: "#FFFFFF",   // white card bg
  border: "#E2E6EA",   // neutral gray border
  text: "#1A1A2E",
  muted: "#6B7280",
  accent: "#00C9A7",
};

/* ─── shared select styles ───────────────────────────────────────────────── */
const selectSx = {
  borderRadius: "10px",
  background: "#FFFFFF",

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#C7CDD4",   // darker border for empty fields
    borderWidth: "1.5px",
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: BRAND.primary,
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: BRAND.primary,
    borderWidth: "2px",
  },

  "& .MuiSelect-select": {
    py: "10px",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: BRAND.text,
  },

  // placeholder text
  "& .MuiSelect-placeholder": {
    color: "#9CA3AF",
  }
};

/* ─── labelled select wrapper ────────────────────────────────────────────── */
function FieldGroup({ icon: Icon, label, value, onChange, options, renderValue, placeholder }) {
  const hasValue = Boolean(value);
  return (
    <Box>
      {/* micro-label row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
        <Icon sx={{ fontSize: 15, color: hasValue ? BRAND.primary : BRAND.muted }} />
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: hasValue ? BRAND.primary : BRAND.muted,
          }}
        >
          {label}
        </Typography>
        {hasValue && (
          <Chip
            label="Selected"
            size="small"
            sx={{
              height: 16,
              fontSize: "0.6rem",
              fontWeight: 700,
              bgcolor: alpha(BRAND.accent, 0.12),
              color: BRAND.accent,
              border: `1px solid ${alpha(BRAND.accent, 0.3)}`,
              ml: "auto",
              "& .MuiChip-label": { px: 1 },
            }}
          />
        )}
      </Box>

      {/* the actual select */}
      <FormControl fullWidth size="small">
        <InputLabel
          sx={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#6B7280",   // darker label
            "&.Mui-focused": {
              color: BRAND.primary
            }
          }}
        >
          {placeholder}
        </InputLabel>
        <Select
          value={value}
          label={placeholder}
          onChange={onChange}
          sx={selectSx}
          MenuProps={{
            PaperProps: {
              sx: {
                mt: 0.5,
                borderRadius: "10px",
                border: `1px solid ${BRAND.border}`,
                boxShadow: "0 8px 32px rgba(15,98,254,0.10)",
                "& .MuiMenuItem-root": {
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: BRAND.text,
                  py: 1,
                  "&:hover": { bgcolor: alpha(BRAND.primary, 0.07) },
                  "&.Mui-selected": {
                    bgcolor: alpha(BRAND.primary, 0.12),
                    color: BRAND.primary,
                    fontWeight: 700,
                  },
                },
              },
            },
          }}
        >
          {options}
        </Select>
      </FormControl>
    </Box>
  );
}

/* ─── columns ────────────────────────────────────────────────────────────── */
const columns = [
  {
    field: "AMCStatus",
    headerName: "AMC Status",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    renderCell: ({ value }) => (
      <Chip
        label={value || "—"}
        size="small"
        sx={{
          fontWeight: 700,
          fontSize: "0.72rem",
          bgcolor: value ? alpha(BRAND.primary, 0.1) : "#F0F0F0",
          color: value ? BRAND.primary : BRAND.muted,
          border: `1px solid ${value ? alpha(BRAND.primary, 0.25) : "#DDD"}`,
        }}
      />
    ),
  },
  {
    field: "WarrantyStatus",
    headerName: "Warranty Status",
    flex: 1,
    minWidth: 140,
    headerAlign: "center",
    align: "center",
    renderCell: ({ value }) => (
      <Chip
        label={value || "—"}
        size="small"
        sx={{
          fontWeight: 700,
          fontSize: "0.72rem",
          bgcolor: value === "Active" ? alpha(BRAND.accent, 0.1) : alpha("#FF6B6B", 0.1),
          color: value === "Active" ? BRAND.accent : "#FF6B6B",
          border: `1px solid ${value === "Active" ? alpha(BRAND.accent, 0.3) : alpha("#FF6B6B", 0.3)}`,
        }}
      />
    ),
  },
  {
    field: "WarrantyType",
    headerName: "Warranty Type",
    flex: 1,
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    renderCell: ({ value }) => (
      <Typography sx={{ fontSize: "0.8rem", fontWeight: 500, color: BRAND.muted }}>
        {value || "—"}
      </Typography>
    ),
  },
];

/* ─── main component ─────────────────────────────────────────────────────── */
const StepOne = ({ Machine, setMachine, Tool, setTool, setToolNo, machineCodeProp, toolNoProp }) => {
  const [machineOptions, setMachineOptions] = useState([]);
  const [toolList, setToolList] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    MachineShowList(handleMachineSuccess, handleException);
    if (Machine) {
      ToolListByMachineId({ id: Machine }, handleToolSuccess, handleException);
    }
  }, [Machine]);

  const handleMachineSuccess = ({ data }) => {
    setMachineOptions(data || []);
    if (machineCodeProp && !Machine) {
      const match = data?.find((m) => m.machineCode === machineCodeProp);
      if (match) setMachine(match.id);
    }
  };
  const handleException = () => setMachineOptions([]);
  const handleToolSuccess = ({ data }) => {
    setToolList(data || []);
    if (toolNoProp && !Tool) {
      const match = data?.find((t) => t.toolNo === toolNoProp);
      if (match) {
        setTool(match.id);
        setToolNo(match.toolNo);
      }
    }
  };

  const handleMachineChange = useCallback(
    (event) => {
      const id = event.target.value;
      setMachine(id);
      setTool("");
      setToolList([]);
      ToolListByMachineId({ id }, handleToolSuccess, handleException);
    },
    [setMachine, setTool]
  );

  const handleToolChange = (event) => {
    const toolId = event.target.value;
    setTool(toolId);
    const selectedTool = toolList.find((t) => t.id === toolId);
    if (selectedTool) setToolNo(selectedTool.toolNo);
  };

  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        mt: 2,
        borderRadius: "16px",
        border: `1.5px solid #E2E6EA`,
        background: "#FFFFFF",
        overflow: "visible",
      }}
    >
      <CardContent sx={{ display: "flex", flexDirection: "column", flex: 1, p: "24px !important" }}>

        {/* ── header ── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              bgcolor: "#F3F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TuneIcon sx={{ fontSize: 20, color: BRAND.primary }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: BRAND.text, lineHeight: 1.2 }}>
              Machine &amp; Tool Selection
            </Typography>
            <Typography sx={{ fontSize: "0.72rem", color: BRAND.muted, mt: 0.25 }}>
              Choose a machine, then select its associated tool
            </Typography>
          </Box>

        </Box>

        <Divider sx={{ borderColor: BRAND.border, mb: 3 }} />

        {/* ── selects row ── */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: "12px",
                border: `1.5px solid ${Machine ? BRAND.primary : BRAND.border}`,
                background: "#fff",
                transition: "border-color 0.2s",
              }}
            >
              <FieldGroup
                icon={PrecisionManufacturingIcon}
                label="Machine"
                placeholder="Select Machine"
                value={Machine}
                onChange={handleMachineChange}
                options={machineOptions.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.machineCode}
                  </MenuItem>
                ))}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: "12px",
                border: `1.5px solid ${Tool ? BRAND.primary : BRAND.border}`,
                background: "#fff",
                opacity: Machine ? 1 : 0.55,
                transition: "opacity 0.2s, border-color 0.2s",
              }}
            >
              <FieldGroup
                icon={BuildIcon}
                label="Tool"
                placeholder="Select Tool"
                value={Tool}
                onChange={handleToolChange}
                options={toolList.map((tool) => (
                  <MenuItem key={tool.id} value={tool.id}>
                    {tool.toolNo}
                  </MenuItem>
                ))}
              />
            </Box>
          </Grid>

          {/* status summary pill */}
          {Machine && Tool && (
            <Grid item xs={12} md={4} sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: "100%",
                  p: 2,
                  borderRadius: "12px",
                  background: "#F9FAFB",
                  border: `1.5px solid #E2E6EA`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Typography sx={{ fontSize: "0.68rem", fontWeight: 700, color: BRAND.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Selection Summary
                </Typography>
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: BRAND.text }}>
                  Machine #{Machine}
                </Typography>
                <Typography sx={{ fontSize: "0.78rem", color: BRAND.primary, fontWeight: 600 }}>
                  Tool #{Tool}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* ── data grid (shown only when there are rows) ── */}
        {rows.length > 0 && (
          <>
            <Divider sx={{ borderColor: BRAND.border, mb: 2.5 }} />
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: BRAND.muted, letterSpacing: "0.08em", textTransform: "uppercase", mb: 1.5 }}>
              Status Details
            </Typography>
            <Box sx={{ flex: 1, minHeight: 260 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                disableRowSelectionOnClick
                hideFooter
                sx={{
                  border: "none",
                  borderRadius: "12px",
                  overflow: "hidden",
                  "& .MuiDataGrid-columnHeaders": {
                    background: "#F3F4F6",
                    borderBottom: `2px solid ${BRAND.border}`,
                    "& .MuiDataGrid-columnHeaderTitle": {
                      fontWeight: 800,
                      fontSize: "0.72rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: BRAND.muted,
                    },
                  },
                  "& .MuiDataGrid-row": {
                    "&:hover": { bgcolor: alpha(BRAND.primary, 0.04) },
                    "&.Mui-selected": { bgcolor: alpha(BRAND.primary, 0.08) },
                  },
                  "& .MuiDataGrid-cell": {
                    borderColor: BRAND.border,
                    "&:focus": { outline: "none" },
                  },
                }}
              />
            </Box>
          </>
        )}

      </CardContent>
    </Card>
  );
};

export default StepOne;